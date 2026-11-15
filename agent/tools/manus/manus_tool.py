"""Call the user's Manus account agent to carry out a task and return its result.

This is an execution tool, not a code-edit delegation: the caller supplies the
actual task, Manus performs it in the account's own environment/connectors, and
this tool returns the finished response. It does not expose NovaAgent files or
claim that Manus can access them.
"""
from __future__ import annotations

import os
import re
import time
from pathlib import Path
from urllib.parse import urlparse
from typing import Any, Dict, Optional

import requests

from agent.tools.base_tool import BaseTool, ToolResult
from config import conf

DEFAULT_API_BASE = "https://api.manus.ai/v2"
REQUEST_TIMEOUT = 30
TASK_TIMEOUT_SECONDS = 600
POLL_INTERVAL_SECONDS = 3
MAX_TASK_CHARS = 12000
MAX_ATTACHMENT_BYTES = 100 * 1024 * 1024
ALLOWED_ATTACHMENT_HOST_SUFFIX = ".manuscdn.com"
SUPPORTED_AGENT_PROFILES = (
    "standard", "lite", "max", "max-medium", "max-high", "max-extra", "max-ultra",
)
LEGACY_MODEL_ALIASES = {"manus2.0": "standard", "manus-task": "standard"}


class ManusTool(BaseTool):
    """Ask the configured Manus account agent to perform a user task."""

    name = "manus"
    description = (
        "Use the user's Manus account to create a new task, continue an existing "
        "Manus sandbox/task, or inspect its result and output files. Set action to "
        "create_task, continue_task, or inspect_task. For continue_task and "
        "inspect_task, pass the existing 22-character task_id from its Manus URL. "
        "Task attachments are returned as links; use download_files=true on "
        "inspect_task or continue_task to save them under the authorized output_dir. "
        "This does not provide shell access to Manus's sandbox or access to NovaAgent local files."

    )
    params = {
        "type": "object",
        "properties": {
            "action": {
                "type": "string",
                "enum": ["create_task", "continue_task", "inspect_task"],
                "description": "Create a fresh Manus task, continue an existing sandbox, or inspect its outputs.",
            },
            "task": {
                "type": "string",
                "description": "Concrete instruction to Manus; required for create_task and continue_task.",
            },
            "task_id": {
                "type": "string",
                "description": "Existing 22-character Manus task ID from the task URL; required for continue_task and inspect_task.",
            },
            "profile": {
                "type": "string",
                "enum": list(SUPPORTED_AGENT_PROFILES),
                "description": "Manus agent profile for create_task; defaults to lite.",
            },
            "download_files": {
                "type": "boolean",
                "description": "Download authorized task attachments to output_dir (existing-task actions only).",
            },
            "output_dir": {
                "type": "string",
                "description": "Optional destination directory. Defaults to outputs/manus/<task_id> under the current project.",
            },
        },
        "required": ["action"],
    }

    def is_available(self) -> bool:
        return bool(self._api_key())

    @staticmethod
    def _api_key() -> str:
        return str(conf().get("manus_api_key") or os.environ.get("MANUS_API_KEY") or "").strip()

    @staticmethod
    def _api_base() -> str:
        base = str(conf().get("manus_api_base") or "https://api.manus.ai").strip().rstrip("/")
        if base.endswith("/v2"):
            return base
        return base + "/v2"

    def execute(self, params: dict) -> ToolResult:
        action = str(params.get("action") or "").strip()
        if action not in ("create_task", "continue_task", "inspect_task"):
            return ToolResult.fail("Manus: action must be create_task, continue_task, or inspect_task.")

        task_text = str(params.get("task") or "").strip()
        if action in ("create_task", "continue_task") and not task_text:
            return ToolResult.fail("Manus: 'task' is required for this action.")
        if len(task_text) > MAX_TASK_CHARS:
            return ToolResult.fail(f"Manus: task exceeds the {MAX_TASK_CHARS}-character limit.")

        task_id = str(params.get("task_id") or "").strip()
        if action in ("continue_task", "inspect_task") and not self._valid_task_id(task_id):
            return ToolResult.fail("Manus: provide the 22-character task ID from the authorized Manus task URL.")

        api_key = self._api_key()
        if not api_key:
            return ToolResult.fail(
                "Manus is not configured. Add a Manus API key in the provider settings "
                "or set MANUS_API_KEY, then try again."
            )

        profile = params.get("profile", "lite")
        profile = LEGACY_MODEL_ALIASES.get(str(profile), str(profile))
        if profile not in SUPPORTED_AGENT_PROFILES:
            return ToolResult.fail("Manus: unsupported agent profile.")

        if action == "inspect_task":
            self.report_progress("Reading the existing Manus task and its output files…")
        else:
            self.report_progress("Sending the requested work to Manus…")
        download_files = bool(params.get("download_files", False))
        output_dir = str(params.get("output_dir") or "").strip()
        if output_dir and not download_files:
            return ToolResult.fail("Manus: output_dir requires download_files=true.")
        if download_files and action == "create_task":
            return ToolResult.fail("Manus: download_files is only supported for an existing task.")

        try:
            if action == "create_task":
                return ToolResult.success(self._run_create_task(task_text, api_key, profile))
            if action == "continue_task":
                result = self._run_existing_task(task_id, task_text, api_key)
            else:
                result = self._inspect_task(task_id, api_key)
            if download_files:
                result += self._download_task_attachments(task_id, api_key, output_dir)
            return ToolResult.success(result)
        except ManusToolError as exc:
            return ToolResult.fail(str(exc))

    @staticmethod
    def _valid_task_id(task_id: str) -> bool:
        return len(task_id) == 22 and task_id.isalnum() and task_id.isascii()

    def _request(self, method: str, path: str, api_key: str, *, params=None, body=None) -> Dict[str, Any]:
        try:
            response = requests.request(
                method,
                f"{self._api_base()}/{path.lstrip('/')}",
                headers={"x-manus-api-key": api_key, "Accept": "application/json"},
                params=params,
                json=body,
                timeout=REQUEST_TIMEOUT,
            )
        except requests.RequestException as exc:
            # Never include request headers, credentials, or raw provider output.
            raise ManusToolError(f"Manus API connection failed ({type(exc).__name__}).") from None

        if not 200 <= response.status_code < 300:
            raise ManusToolError(f"Manus API returned HTTP {response.status_code}.")
        try:
            payload = response.json()
        except ValueError:
            raise ManusToolError("Manus API returned an unreadable response.") from None
        if not isinstance(payload, dict) or payload.get("ok") is False:
            raise ManusToolError("Manus API rejected the request.")
        return payload

    @staticmethod
    def _content_text(content: Any) -> str:
        if isinstance(content, str):
            return content.strip()
        if isinstance(content, list):
            parts = []
            for block in content:
                if isinstance(block, str):
                    parts.append(block)
                elif isinstance(block, dict):
                    text = block.get("text") or block.get("content")
                    if isinstance(text, str):
                        parts.append(text)
            return "\n".join(part for part in parts if part).strip()
        return ""

    @classmethod
    def _latest_result(cls, events: list) -> str:
        for event in events:
            if not isinstance(event, dict):
                continue
            assistant = event.get("assistant_message")
            if isinstance(assistant, dict) and assistant.get("delivery_kind") != "progress":
                text = cls._content_text(assistant.get("content"))
                if text:
                    return text
        for event in events:
            if isinstance(event, dict) and isinstance(event.get("error_message"), dict):
                text = cls._content_text(event["error_message"].get("content"))
                if text:
                    return text
        return ""

    @classmethod
    def _format_task_result(cls, task_id: str, task_url: str, status: str, events: list) -> str:
        parts = [f"Manus task `{task_id}` — status: **{status}**"]
        result = cls._latest_result(events)
        if result:
            parts.extend(["", result])

        attachments = []
        seen = set()
        for event in events:
            assistant = event.get("assistant_message") if isinstance(event, dict) else None
            if not isinstance(assistant, dict):
                continue
            for attachment in assistant.get("attachments") or []:
                if not isinstance(attachment, dict):
                    continue
                url = str(attachment.get("url") or "").strip()
                filename = str(attachment.get("filename") or "Manus output").strip()
                if not url or not url.startswith("https://"):
                    continue
                identity = (attachment.get("file_uid") or url, attachment.get("version_uid") or "")
                if identity in seen:
                    continue
                seen.add(identity)
                attachments.append((filename, url))
        if attachments:
            parts.extend(["", "**Files:**"])
            parts.extend(f"- [{name}]({url})" for name, url in attachments)
        if task_url:
            parts.extend(["", f"Open task in Manus: {task_url}"])
        return "\n".join(parts)

    def _run_create_task(self, task_text: str, api_key: str, profile: str) -> str:
        # Create a separate private sandbox only when the user explicitly asks.
        request_text = (
            "Perform the following task for the user using the capabilities and "
            "connectors enabled in this Manus account. Return the completed result "
            "or clearly state what is blocked and what input is needed. Do not claim "
            "to access NovaAgent's local project files unless an enabled connector "
            "actually provides access.\n\nTask:\n" + task_text
        )
        sent = self._request(
            "POST", "task.create", api_key,
            body={
                "message": {"content": request_text},
                "title": "NovaAgent task",
                "share_visibility": "private",
                "hide_in_task_list": True,
                "agent_profile": profile,
            },
        )
        task_id = str(sent.get("task_id") or "").strip()
        task_url = str(sent.get("task_url") or "").strip()
        if not task_id:
            raise ManusToolError("Manus did not identify the task it started.")
        return self._poll_task(task_id, task_url, api_key)

    def _download_task_attachments(self, task_id: str, api_key: str, output_dir: str = "") -> str:
        message_data = self._request(
            "GET", "task.listMessages", api_key,
            params={"task_id": task_id, "order": "desc", "limit": 50},
        )
        raw_events = message_data.get("messages")
        events = [item for item in raw_events if isinstance(item, dict)] if isinstance(raw_events, list) else []
        workspace_root = Path.cwd().resolve()
        destination = Path(output_dir).expanduser() if output_dir else workspace_root / "outputs" / "manus" / task_id
        try:
            resolved_destination = destination.resolve(strict=False)
        except OSError:
            raise ManusToolError("Manus attachment destination is invalid.") from None
        if resolved_destination != workspace_root and workspace_root not in resolved_destination.parents:
            raise ManusToolError("Manus attachment destination must be under the current workspace.")
        try:
            destination.mkdir(parents=True, exist_ok=True)
            destination = destination.resolve(strict=True)
        except OSError:
            raise ManusToolError("Manus attachment destination is not writable.") from None
        if destination != workspace_root and workspace_root not in destination.parents:
            raise ManusToolError("Manus attachment destination must be under the current workspace.")

        saved = []
        seen = set()
        for event in events:
            assistant = event.get("assistant_message")
            if not isinstance(assistant, dict):
                continue
            for attachment in assistant.get("attachments") or []:
                if not isinstance(attachment, dict):
                    continue
                url = str(attachment.get("url") or "").strip()
                parsed = urlparse(url)
                host = (parsed.hostname or "").lower()
                if parsed.scheme != "https" or not (host == "manuscdn.com" or host.endswith(ALLOWED_ATTACHMENT_HOST_SUFFIX)):
                    continue
                identity = (attachment.get("file_uid") or url, attachment.get("version_uid") or "")
                if identity in seen:
                    continue
                seen.add(identity)
                name = Path(str(attachment.get("filename") or "manus-output")).name
                name = re.sub(r"[^A-Za-z0-9._ -]", "_", name).strip(" .") or "manus-output"
                target = destination / name
                if target.parent != destination:
                    continue
                counter = 1
                while target.exists():
                    stem, suffix = target.stem, target.suffix
                    target = destination / f"{stem} ({counter}){suffix}"
                    counter += 1
                try:
                    target = target.resolve(strict=False)
                except OSError:
                    raise ManusToolError("Manus attachment destination is invalid.") from None
                if target.parent != destination:
                    continue
                try:
                    response = requests.get(url, stream=True, timeout=REQUEST_TIMEOUT, allow_redirects=False)
                except requests.RequestException:
                    raise ManusToolError("Could not download a Manus attachment.") from None
                if not 200 <= response.status_code < 300:
                    raise ManusToolError(f"Manus attachment download returned HTTP {response.status_code}.")
                content_length = response.headers.get("Content-Length")
                if content_length:
                    try:
                        if int(content_length) > MAX_ATTACHMENT_BYTES:
                            raise ManusToolError("Manus attachment exceeds the 100 MB download limit.")
                    except ValueError:
                        raise ManusToolError("Manus attachment returned an invalid size.") from None
                temp_target = target.with_name(target.name + ".part")
                try:
                    resolved_temp_target = temp_target.resolve(strict=False)
                except OSError:
                    raise ManusToolError("Manus attachment temporary file is invalid.") from None
                if resolved_temp_target.parent != destination:
                    raise ManusToolError("Manus attachment temporary file escapes the workspace.")
                if temp_target.is_symlink() and resolved_temp_target.parent != destination:
                    raise ManusToolError("Manus attachment temporary file escapes the workspace.")
                written = 0
                try:
                    temp_flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC | getattr(os, "O_NOFOLLOW", 0)
                    with os.fdopen(os.open(temp_target, temp_flags, 0o600), "wb") as handle:
                        for chunk in response.iter_content(chunk_size=64 * 1024):
                            if not chunk:
                                continue
                            written += len(chunk)
                            if written > MAX_ATTACHMENT_BYTES:
                                raise ManusToolError("Manus attachment exceeds the 100 MB download limit.")
                            handle.write(chunk)
                    temp_target.replace(target)
                except ManusToolError:
                    try:
                        temp_target.unlink(missing_ok=True)
                    except OSError:
                        pass
                    raise
                except OSError:
                    try:
                        temp_target.unlink(missing_ok=True)
                    except OSError:
                        pass
                    raise ManusToolError("Could not save a Manus attachment.") from None
                finally:
                    response.close()
                saved.append(str(target))
        if not saved:
            return "\n\nNo downloadable Manus attachments were found for this task."
        return "\n\n**Downloaded files:**\n" + "\n".join(f"- `{path}`" for path in saved)

    def _run_existing_task(self, task_id: str, task_text: str, api_key: str) -> str:
        # Continue the exact sandbox/task selected by the user; never substitute
        # the account's default agent task or silently create a new task.
        self._request(
            "POST", "task.sendMessage", api_key,
            body={"task_id": task_id, "message": {"content": task_text}},
        )
        detail = self._request(
            "GET", "task.detail", api_key, params={"task_id": task_id}
        )
        task_data = detail.get("task")
        task_url = str(task_data.get("task_url") or "") if isinstance(task_data, dict) else ""
        return self._poll_task(task_id, task_url, api_key)

    def _inspect_task(self, task_id: str, api_key: str) -> str:
        detail = self._request(
            "GET", "task.detail", api_key, params={"task_id": task_id}
        )
        task_data = detail.get("task")
        task = task_data if isinstance(task_data, dict) else {}
        status = str(task.get("status") or "unknown").lower()
        task_url = str(task.get("task_url") or f"https://manus.im/app/{task_id}")
        message_data = self._request(
            "GET", "task.listMessages", api_key,
            params={"task_id": task_id, "order": "desc", "limit": 50},
        )
        raw = message_data.get("messages")
        events = [item for item in raw if isinstance(item, dict)] if isinstance(raw, list) else []
        return self._format_task_result(task_id, task_url, status, events)

    def _poll_task(self, task_id: str, task_url: str, api_key: str) -> str:
        deadline = time.monotonic() + TASK_TIMEOUT_SECONDS
        waiting_since: Optional[float] = None
        while time.monotonic() < deadline:
            if self.is_cancelled():
                raise ManusToolError("Manus task wait was cancelled.")
            detail = self._request(
                "GET", "task.detail", api_key, params={"task_id": task_id}
            )
            task_data = detail.get("task")
            task = task_data if isinstance(task_data, dict) else {}
            status = str(task.get("status") or "running").lower()
            message_data = self._request(
                "GET", "task.listMessages", api_key,
                params={"task_id": task_id, "order": "desc", "limit": 50},
            )
            raw = message_data.get("messages")
            events = [item for item in raw if isinstance(item, dict)] if isinstance(raw, list) else []

            if status == "error":
                result = self._latest_result(events)
                raise ManusToolError(result or "Manus could not complete the task.")
            if status == "waiting":
                if waiting_since is None:
                    waiting_since = time.monotonic()
                wait_type = ""
                wait_description = ""
                for event in events:
                    state = event.get("status_update") if isinstance(event, dict) else None
                    if isinstance(state, dict):
                        detail_data = state.get("status_detail")
                        detail_data = detail_data if isinstance(detail_data, dict) else {}
                        wait_type = str(detail_data.get("waiting_for_event_type") or "")
                        wait_description = str(detail_data.get("waiting_description") or "")
                        if wait_type or wait_description:
                            break
                if wait_type or wait_description or time.monotonic() - waiting_since >= 15:
                    question = self._latest_result(events) if wait_type in ("messageAskUser", "cascadeAskUser") else ""
                    note = question or wait_description or "Manus needs more information or confirmation to continue."
                    if task_url:
                        note += f"\n\nContinue in Manus: {task_url}"
                    return note
                time.sleep(POLL_INTERVAL_SECONDS)
                continue

            waiting_since = None
            if status == "stopped" and not task.get("has_running_background_jobs"):
                result = self._latest_result(events)
                if result:
                    return result
                raise ManusToolError("Manus finished without returning a result.")
            time.sleep(POLL_INTERVAL_SECONDS)

        suffix = f" Track the task in Manus: {task_url}" if task_url else ""
        raise ManusToolError("Manus task did not finish before the wait limit." + suffix)


class ManusToolError(RuntimeError):
    """Safe, user-facing Manus API or task error."""
