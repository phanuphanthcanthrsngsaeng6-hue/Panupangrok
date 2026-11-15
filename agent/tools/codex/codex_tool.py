"""Codex CLI as a tool, so the parent Agent can offload heavy work.

Why this exists
---------------
Reading a large repository through the parent model costs the parent's
context: every file lands in the prompt and stays there for the rest of the
turn. The local `codex` CLI does that reading in its own sandbox and hands
back only a conclusion, so the parent pays for the answer instead of for the
search. That is the whole point of routing review / refactor / "read these
40 files and tell me X" work here.

Contract
--------
Mirrors the other tools: implement ``execute(params) -> ToolResult``. The
result is written for a model (plain text, already truncated), and
``display`` is left unset because the text reads the same either way.
"""
from __future__ import annotations

import shutil
import subprocess
import time
from typing import Any, List, Optional

from agent.tools.base_tool import BaseTool, ToolResult
from common.log import logger

# Profiles prepared in ~/.codex/*.config.toml
PROFILES = {
    "fast": "gpt-6-luna",       # quick questions, cheapest
    "review": "gpt-5.6-terra",  # read-only code review
    "code": "gpt-5.6-luna",     # workspace-write, can edit files
}

DEFAULT_PROFILE = "fast"
DEFAULT_TIMEOUT = 300
MAX_TIMEOUT = 600

# The parent reads this output, so keep it well inside a context budget.
MAX_OUTPUT_CHARS = 8000

_METADATA_WORDS = (
    "Reading additional input from stdin",
    "OpenAI Codex v",
)


def _which_codex() -> Optional[str]:
    found = shutil.which("codex")
    if found:
        return found
    for candidate in (
        "/data/data/com.termux/files/usr/bin/codex",
        "/usr/local/bin/codex",
    ):
        try:
            import os
            if os.path.isfile(candidate) and os.access(candidate, os.X_OK):
                return candidate
        except Exception:
            continue
    return None


def _clean_output(text: str) -> str:
    """Drop the CLI's own chatter so only the model's answer reaches the parent."""
    lines: List[str] = []
    for line in (text or "").splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if any(stripped.startswith(word) for word in _METADATA_WORDS):
            continue
        if stripped.startswith("---") or stripped.startswith("workdir:") \
                or stripped.startswith("model:") or stripped.startswith("provider:") \
                or stripped.startswith("approval:") or stripped.startswith("sandbox:") \
                or stripped.startswith("reasoning ") or stripped.startswith("session id:") \
                or stripped.startswith("tokens used"):
            continue
        lines.append(line)
    return "\n".join(lines).strip()


class CodexTool(BaseTool):
    """Hand a self-contained task to the local Codex CLI agent."""

    name: str = "codex"
    description: str = (
        "Hand a self-contained task to the local Codex CLI agent, which works in "
        "its own sandbox and returns only its conclusion. Use this to keep heavy "
        "work out of your own context: reading many files, reviewing a module, "
        "tracing a bug across a repository, or a broad refactor. Prefer this over "
        "reading dozens of files yourself. Give one clear instruction per call. "
        "Profiles: 'fast' (quick/cheap), 'review' (read-only code review), "
        "'code' (may edit files in the workspace)."
    )

    # Never touch files unless the caller picked the 'code' profile, and even
    # then only inside the workspace - the CLI enforces the sandbox itself.
    params: dict = {
        "type": "object",
        "properties": {
            "prompt": {
                "type": "string",
                "description": "The task, stated fully and self-containedly.",
            },
            "profile": {
                "type": "string",
                "enum": list(PROFILES.keys()),
                "description": "fast = quick/cheap, review = read-only review, "
                               "code = may edit files (workspace-write).",
            },
            "model": {
                "type": "string",
                "description": "Optional model override, e.g. gpt-5.6-luna.",
            },
            "sandbox": {
                "type": "string",
                "enum": ["read-only", "workspace-write"],
                "description": "Sandbox policy. Defaults to read-only.",
            },
            "cwd": {
                "type": "string",
                "description": "Directory the agent works in. Defaults to the tool's cwd.",
            },
            "timeout": {
                "type": "integer",
                "description": f"Seconds before aborting (max {MAX_TIMEOUT}). Default {DEFAULT_TIMEOUT}.",
            },
        },
        "required": ["prompt"],
    }

    # Independent work; several codex calls may run at once.
    parallel_safe: bool = True

    def is_available(self) -> bool:
        """Only offered when the CLI is actually installed."""
        return _which_codex() is not None

    def execute(self, params: dict) -> ToolResult:
        prompt = (params.get("prompt") or "").strip()
        if not prompt:
            return ToolResult.fail("codex: 'prompt' is required.")

        binary = _which_codex()
        if not binary:
            return ToolResult.fail("codex: the codex CLI is not installed.")

        profile = params.get("profile") or DEFAULT_PROFILE
        if profile not in PROFILES:
            profile = DEFAULT_PROFILE
        model = params.get("model") or PROFILES.get(profile)
        sandbox = params.get("sandbox") or "read-only"
        workdir = params.get("cwd") or self.cwd or None

        try:
            timeout = int(params.get("timeout") or DEFAULT_TIMEOUT)
        except (TypeError, ValueError):
            timeout = DEFAULT_TIMEOUT
        timeout = max(30, min(timeout, MAX_TIMEOUT))

        cmd = [
            binary, "exec",
            "-p", profile,
            "--skip-git-repo-check",
            "--json",
            "-s", sandbox,
        ]
        if workdir:
            cmd += ["-C", str(workdir)]
        if model:
            cmd += ["-m", model]
        cmd.append(prompt)

        self.report_progress(f"codex ({profile}) working on it…")
        started = time.time()

        try:
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout,
                stdin=subprocess.DEVNULL,
            )
        except subprocess.TimeoutExpired:
            logger.error("[codex tool] timed out after %ss", timeout)
            return ToolResult.fail(f"codex: timed out after {timeout}s.")
        except OSError as exc:
            logger.error("[codex tool] failed to start: %s", exc)
            return ToolResult.fail(f"codex: failed to start: {exc}")

        content = self._extract(proc.stdout or "")
        if not content:
            fallback = _clean_output(proc.stdout or "") or (proc.stderr or "").strip()
            content = fallback
        if not content:
            content = f"codex exited with code {proc.returncode} and produced no output."

        if len(content) > MAX_OUTPUT_CHARS:
            content = content[:MAX_OUTPUT_CHARS] + "\n…[truncated]"

        logger.info("[codex tool] profile=%s model=%s elapsed=%.1fs chars=%d",
                    profile, model, time.time() - started, len(content))

        return ToolResult.success(
            f"[codex/{profile}]\n{content}",
            ext_data={"profile": profile, "model": model,
                      "elapsed": round(time.time() - started, 1)},
        )

    # ------------------------------------------------------------------ parse
    @staticmethod
    def _extract(stdout: str) -> str:
        """Pull assistant text out of the --json event stream."""
        import json as _json

        texts: List[str] = []
        for line in stdout.splitlines():
            line = line.strip()
            if not line.startswith("{"):
                continue
            try:
                event = _json.loads(line)
            except ValueError:
                continue
            item = event.get("item")
            if isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str) and text.strip():
                    texts.append(text.strip())
            if event.get("type") in ("message", "agent_message"):
                text = event.get("text")
                if isinstance(text, str) and text.strip():
                    texts.append(text.strip())
        return texts[-1] if texts else ""


__all__ = ["CodexTool", "PROFILES"]