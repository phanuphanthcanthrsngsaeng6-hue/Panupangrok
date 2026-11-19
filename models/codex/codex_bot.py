"""Codex CLI provider for NovaAgent-Terminal.

Bridges the locally installed `codex` CLI (OpenAI Codex agent, v0.169.0)
into the project's bot contract so the web channel and agent loop can use
it like any other provider.

Contract implemented (verified against models/openai/open_ai_bot.py):
    reply(query, context=None) -> Reply
    reply_text(session, retry_count=0) -> {"content", "total_tokens", "completion_tokens"}

The provider shells out to `codex exec`, which is non-interactive and
prints a final message. We run it with --json so token usage can be read
back from the JSONL event stream.
"""
from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import time
from typing import Any, Dict, List, Optional

from bridge.reply import Reply, ReplyType
from common import const
from common.log import logger
from models.bot import Bot

# Profiles prepared in ~/.codex/*.config.toml
DEFAULT_PROFILE = "fast"
DEFAULT_MODEL = "gpt-5.6-luna"

# Hard ceiling so one request cannot wedge the agent loop.
MAX_TIMEOUT = 600
DEFAULT_TIMEOUT = 300

# Output is handed to a model; keep it within a sane context budget.
MAX_OUTPUT_CHARS = 8000
LOGIN_STATUS_TIMEOUT = 10

# CLI/status messages that are not model answers. Keep this deliberately small:
# authentication and quota messages must remain visible to the caller.
_NOISE_LINES = frozenset()

PROFILE_MODELS = {
    "fast": "gpt-6-luna",
    "review": "gpt-5.6-terra",
    "code": "gpt-5.6-luna",
}


def _which_codex() -> Optional[str]:
    """Locate the codex binary; None when it is not installed."""
    found = shutil.which("codex")
    if found:
        return found
    # Termux PREFIX layout, in case PATH was trimmed by a service manager.
    for candidate in (
        "/data/data/com.termux/files/usr/bin/codex",
        os.path.expanduser("~/../usr/bin/codex"),
    ):
        if os.path.isfile(candidate) and os.access(candidate, os.X_OK):
            return candidate
    return None


def _prompt_from_query(query: Any) -> str:
    """Flatten the query into one prompt string.

    The legacy adapter passes a list of OpenAI-style message dicts with
    context=None; the web channel passes a plain string. Both must work.
    """
    if isinstance(query, str):
        return query
    if isinstance(query, (list, tuple)):
        parts: List[str] = []
        for item in query:
            if isinstance(item, dict):
                role = item.get("role") or "user"
                content = item.get("content")
                if isinstance(content, list):
                    content = " ".join(
                        str(c.get("text", "")) if isinstance(c, dict) else str(c)
                        for c in content
                    )
                parts.append(f"{role}: {content}")
            else:
                parts.append(str(item))
        return "\n".join(parts)
    return str(query)


def _parse_events(stdout: str) -> Dict[str, Any]:
    """Pull the final message and token usage out of a --json event stream."""
    final_text: List[str] = []
    total_tokens = 0
    completion_tokens = 0
    errors: List[str] = []

    for line in stdout.splitlines():
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            event = json.loads(line)
        except ValueError:
            continue
        etype = event.get("type") or event.get("event") or ""

        # Real shape (codex 0.169, verified):
        # {"type":"turn.completed","usage":{"input_tokens":13029,
        #   "cached_input_tokens":10752,"output_tokens":5,...}}
        usage = event.get("usage") or {}
        if isinstance(usage, dict):
            input_tokens = int(usage.get("input_tokens") or 0)
            output_tokens = int(usage.get("output_tokens") or 0)
            if input_tokens or output_tokens:
                total_tokens = input_tokens + output_tokens
                completion_tokens = output_tokens
            total_tokens = int(usage.get("total_tokens") or total_tokens or 0)
            completion_tokens = int(
                usage.get("completion_tokens") or completion_tokens or 0
            )

        if "error" in etype.lower():
            msg = event.get("message") or event.get("error")
            if msg:
                errors.append(str(msg))

        # Message payloads carry the assistant text.
        item = event.get("item") or {}
        if isinstance(item, dict):
            text = item.get("text") or item.get("content")
            if isinstance(text, str) and text.strip():
                final_text.append(text.strip())

        text = event.get("text") or event.get("message")
        if isinstance(text, str) and etype in ("message", "agent_message", "response"):
            final_text.append(text.strip())

    return {
        "text": final_text[-1] if final_text else "",
        "total_tokens": total_tokens,
        "completion_tokens": completion_tokens,
        "errors": errors,
    }


def _classify_cli_error(text: str) -> str:
    """Return a stable, non-sensitive category for Codex CLI failures."""
    value = str(text or '').lower()
    if any(marker in value for marker in (
        'quota', 'rate limit', 'rate_limit', 'usage limit', 'usage_limit',
        'too many requests', 'insufficient credits',
    )):
        return 'quota_exceeded'
    if any(marker in value for marker in (
        'not logged in', 'login required', 'login expired', 'unauthorized',
        'authentication', 'auth expired', 'invalid token',
    )):
        return 'login_expired'
    return 'cli_unavailable'


class CodexBot(Bot):
    """Bot backed by the local `codex` CLI."""

    def __init__(self, profile: str = DEFAULT_PROFILE, model: Optional[str] = None,
                 sandbox: str = "read-only", cwd: Optional[str] = None,
                 timeout: int = DEFAULT_TIMEOUT):
        self.profile = profile or DEFAULT_PROFILE
        self.model = model or PROFILE_MODELS.get(self.profile, DEFAULT_MODEL)
        self.sandbox = sandbox
        self.cwd = cwd or os.getcwd()
        self.timeout = max(30, min(int(timeout or DEFAULT_TIMEOUT), MAX_TIMEOUT))

    # ---------------------------------------------------------------- helpers
    @staticmethod
    def _runtime_env() -> Dict[str, str]:
        """Run Codex with ChatGPT login only, never an OpenAI API key."""
        env = os.environ.copy()
        env.pop('OPENAI_API_KEY', None)
        return env

    def _login_status(self, binary: str) -> Optional[Dict[str, str]]:
        """Preflight the existing Codex login without reading auth files."""
        try:
            status = subprocess.run(
                [binary, 'login', 'status'],
                capture_output=True,
                text=True,
                timeout=LOGIN_STATUS_TIMEOUT,
                stdin=subprocess.DEVNULL,
                env=self._runtime_env(),
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            return {
                'category': 'cli_unavailable',
                'message': f'Codex CLI login status unavailable: {type(exc).__name__}.',
            }

        output = f'{status.stdout}\n{status.stderr}'.strip()
        if status.returncode == 0 and 'logged in' in output.lower():
            return None

        category = _classify_cli_error(output)
        if category == 'login_expired':
            message = 'Codex ChatGPT login expired or is not authenticated.'
        elif category == 'quota_exceeded':
            message = 'Codex ChatGPT usage quota or limit has been exceeded.'
        else:
            message = 'Codex CLI login status could not be verified.'
        return {'category': category, 'message': message}

    def _build_command(self, prompt: str, model: Optional[str] = None) -> List[str]:
        binary = _which_codex()
        if not binary:
            raise FileNotFoundError("codex binary not found on PATH")
        cmd = [
            binary, "exec",
            "-p", self.profile,
            "--skip-git-repo-check",
            "--json",
            "-s", self.sandbox,
            "-C", self.cwd,
        ]
        selected_model = model or self.model
        if selected_model:
            cmd += ["-m", selected_model]
        # Pass the prompt through stdin instead of argv. Long agent histories can
        # exceed Android/Termux's per-argument limit and make execve fail with
        # E2BIG ("Argument list too long"). Codex CLI reads stdin when the
        # positional prompt is omitted.
        return cmd

    def _run(self, prompt: str, model: Optional[str] = None) -> Dict[str, Any]:
        """Run codex and return {"content", "total_tokens", "completion_tokens"}."""
        try:
            cmd = self._build_command(prompt, model=model)
        except FileNotFoundError as exc:
            return {"content": "Codex CLI unavailable: binary not found.", "total_tokens": 0,
                    "completion_tokens": 0}

        login_error = self._login_status(cmd[0])
        if login_error:
            return {"content": f"[{login_error['category']}] {login_error['message']}",
                    "total_tokens": 0, "completion_tokens": 0}

        started = time.time()
        try:
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                input=prompt,
                env=self._runtime_env(),
            )
        except subprocess.TimeoutExpired:
            logger.error("[CODEX] timed out after %ss", self.timeout)
            return {"content": f"Codex timed out after {self.timeout}s.",
                    "total_tokens": 0, "completion_tokens": 0}
        except OSError as exc:
            logger.error("[CODEX] failed to start: %s", exc)
            return {"content": f"Codex failed to start: {exc}", "total_tokens": 0,
                    "completion_tokens": 0}

        parsed = _parse_events(proc.stdout or "")
        content = parsed["text"]

        if not content:
            # --json produced nothing usable; fall back to raw stdout, then stderr.
            raw = (proc.stdout or "").strip()
            if raw and not raw.startswith("{"):
                content = raw
            elif proc.stderr:
                content = proc.stderr.strip()

        # A line the CLI prints on every run is not an answer. Left in place it
        # masks the real reason (quota exhausted, logged out) because the
        # errors branch below only fires on empty content.
        if content.strip() in _NOISE_LINES:
            content = ""

        if proc.returncode != 0:
            raw_error = (proc.stderr or proc.stdout or '').strip()
            category = _classify_cli_error(raw_error)
            if category == 'quota_exceeded':
                content = '[quota_exceeded] Codex ChatGPT usage quota or limit has been exceeded.'
            elif category == 'login_expired':
                content = '[login_expired] Codex ChatGPT login expired or is not authenticated.'
            else:
                content = f'[cli_unavailable] Codex exited with code {proc.returncode}.'
        if parsed["errors"] and not content:
            content = "; ".join(parsed["errors"])

        if len(content) > MAX_OUTPUT_CHARS:
            content = content[:MAX_OUTPUT_CHARS] + "\n...[truncated]"

        logger.info("[CODEX] profile=%s model=%s tokens=%s elapsed=%.1fs",
                    self.profile, self.model, parsed["total_tokens"],
                    time.time() - started)

        return {
            "content": content or "(codex returned no output)",
            "total_tokens": parsed["total_tokens"],
            "completion_tokens": parsed["completion_tokens"],
        }

    # ----------------------------------------------------------------- contract
    def call_with_tools(self, messages, tools=None, stream=False, model=None, **kwargs):
        """Return OpenAI-compatible chunks; tools are returned, never executed here."""
        tool_schemas = tools or []
        prompt = (
            "Handle the conversation below. If tools are provided, choose whether "
            "to return a tool call, but do not execute any tool. Respond with strict "
            "JSON only, with no markdown or surrounding text, in exactly one of these "
            'forms: {"content":"..."} or '
            '{"tool_calls":[{"name":"...","arguments":{...}}]}. '
            "Tool-call names must match a provided tool schema.\n\n"
            "MESSAGE HISTORY (JSON):\n"
            + json.dumps(messages, ensure_ascii=False, separators=(",", ":"))
            + "\n\nTOOL SCHEMAS (JSON):\n"
            + json.dumps(tool_schemas, ensure_ascii=False, separators=(",", ":"))
        )
        result = self._run(prompt, model=model)
        raw = result.get("content", "")
        try:
            response = json.loads(raw)
        except (TypeError, ValueError) as exc:
            # A CLI that answers with prose (quota exhausted, login expired,
            # usage limit) lands here, and "malformed JSON" hides exactly the
            # text needed to tell that apart from a model ignoring the format.
            snippet = " ".join(str(raw or "").split())[:300]
            raise ValueError(
                "Codex did not return tool/chat JSON"
                + (f"; CLI said: {snippet}" if snippet else " (empty response)")
            ) from exc
        if not isinstance(response, dict):
            raise ValueError("Codex response must be a JSON object")

        has_content = set(response) == {"content"} and isinstance(response["content"], str)
        has_tool_calls = set(response) == {"tool_calls"} and isinstance(response["tool_calls"], list)
        if not (has_content or has_tool_calls):
            raise ValueError('Codex JSON must contain only "content" or "tool_calls"')

        known_names = set()
        for tool in tool_schemas:
            if not isinstance(tool, dict):
                continue
            function = tool.get("function", tool)
            if isinstance(function, dict) and isinstance(function.get("name"), str):
                known_names.add(function["name"])

        normalized_calls = []
        if has_tool_calls:
            for call in response["tool_calls"]:
                if not isinstance(call, dict) or set(call) != {"name", "arguments"}:
                    raise ValueError("Each tool call must contain name and arguments")
                name, arguments = call["name"], call["arguments"]
                if name not in known_names:
                    raise ValueError("Codex returned unknown tool name: %s" % name)
                if not isinstance(arguments, dict):
                    raise ValueError("Tool-call arguments must be a JSON object")
                normalized_calls.append({"name": name, "arguments": arguments})

        response_json = json.dumps(response, ensure_ascii=False, sort_keys=True)
        chunk_id = "chatcmpl-" + hashlib.sha256(
            (prompt + "\\0" + response_json).encode("utf-8")
        ).hexdigest()[:24]
        created = int(time.time())
        selected_model = model or self.model
        chunks = []
        if has_content:
            chunks.append({
                "id": chunk_id, "object": "chat.completion.chunk", "created": created,
                "model": selected_model,
                "choices": [{"index": 0, "delta": {"content": response["content"]},
                             "finish_reason": None}],
            })
            finish_reason = "stop"
        else:
            if normalized_calls:
                chunks.append({
                    "id": chunk_id, "object": "chat.completion.chunk", "created": created,
                    "model": selected_model,
                    "choices": [{
                        "index": 0,
                        "delta": {"tool_calls": [
                            {"index": index, "id": chunk_id + "_%d" % index,
                             "type": "function", "function": {
                                 "name": call["name"],
                                 "arguments": json.dumps(call["arguments"], ensure_ascii=False),
                             }}
                            for index, call in enumerate(normalized_calls)
                        ]},
                        "finish_reason": None,
                    }],
                })
            finish_reason = "tool_calls"

        final_chunk = {
            "id": chunk_id, "object": "chat.completion.chunk", "created": created,
            "model": selected_model,
            "choices": [{"index": 0, "delta": {}, "finish_reason": finish_reason}],
        }
        total_tokens = result.get("total_tokens")
        completion_tokens = result.get("completion_tokens")
        if total_tokens is not None or completion_tokens is not None:
            completion_tokens = int(completion_tokens or 0)
            total_tokens = int(total_tokens or completion_tokens)
            final_chunk["usage"] = {
                "prompt_tokens": max(0, total_tokens - completion_tokens),
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens,
            }
        chunks.append(final_chunk)
        return iter(chunks)

    def reply(self, query, context=None) -> Reply:
        """Reply to a query, honouring the project's Reply contract."""
        # Legacy adapter path: context is None and query is a message list.
        if context is None:
            result = self._run(_prompt_from_query(query))
            if not result["content"]:
                return Reply(ReplyType.ERROR, "Codex returned nothing.")
            return Reply(ReplyType.TEXT, result["content"])

        from bridge.context import ContextType

        if context and context.type == ContextType.TEXT:
            prompt = _prompt_from_query(query)
            logger.info("[CODEX] query=%s", prompt[:200])
            result = self._run(prompt)
            if not result["content"]:
                return Reply(ReplyType.ERROR, "Codex returned nothing.")
            return Reply(ReplyType.TEXT, result["content"])

        return Reply(ReplyType.ERROR, "Codex bot only supports text queries.")

    def reply_text(self, session, retry_count: int = 0) -> Dict[str, Any]:
        """Same contract as OpenAIBot.reply_text: content + token counts."""
        prompt = _prompt_from_query(session)
        return self._run(prompt)

    # ------------------------------------------------------------- capability
    @staticmethod
    def capabilities() -> Dict[str, bool]:
        return {"chat": True, "stream": False, "vision": False, "tools": True}

    def available_models(self) -> List[str]:
        """Models the installed CLI advertises (see `codex debug models`)."""
        return [
            "gpt-6-luna",
            "gpt-6-astra",
            "gpt-6.1-sol",
            "gpt-6.1-terra",
            "gpt-6-sol",
            "gpt-5.6-luna",
            "gpt-5.6-terra",
            "gpt-5.6-sol",
            "gpt-5.5",
        ]


__all__ = ["CodexBot", "PROFILE_MODELS", "DEFAULT_PROFILE", "DEFAULT_MODEL"]
