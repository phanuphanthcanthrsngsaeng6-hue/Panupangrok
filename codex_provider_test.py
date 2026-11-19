"""Offline contract tests for the ChatGPT-login Codex provider.

These tests mock both ``codex login status`` and ``codex exec``. They never
send a prompt to a real model, read Codex auth files, or modify the workspace.
"""
from __future__ import annotations

import json
from pathlib import Path
import subprocess
from unittest.mock import patch

from models.codex.codex_bot import CodexBot, _parse_events


def _completed(args, *, returncode=0, stdout="", stderr="", **kwargs):
    return subprocess.CompletedProcess(args, returncode, stdout, stderr)


def test_jsonl_parser_reads_message_and_usage():
    output = "\n".join([
        json.dumps({"type": "item.completed", "item": {
            "type": "agent_message", "text": "hello NovaAgent"
        }}),
        json.dumps({"type": "turn.completed", "usage": {
            "input_tokens": 10, "output_tokens": 4, "total_tokens": 14
        }}),
    ])
    parsed = _parse_events(output)
    assert parsed["text"] == "hello NovaAgent"
    assert parsed["total_tokens"] == 14
    assert parsed["completion_tokens"] == 4


def test_exec_uses_stdin_and_never_forwards_openai_key():
    bot = CodexBot(cwd="/workspace", timeout=30)
    calls = []

    def fake_run(args, **kwargs):
        calls.append((args, kwargs))
        if args[1:3] == ["login", "status"]:
            return _completed(args, stdout="Logged in using ChatGPT")
        return _completed(args, stdout=json.dumps({
            "type": "item.completed",
            "item": {"type": "agent_message", "text": "mock answer"},
        }))

    with patch.dict("os.environ", {"OPENAI_API_KEY": "sk-never-forward"}, clear=False):
        with patch("models.codex.codex_bot._which_codex", return_value="/usr/bin/codex"):
            with patch("models.codex.codex_bot.subprocess.run", side_effect=fake_run):
                result = bot._run("mock prompt")

    assert result["content"] == "mock answer"
    assert len(calls) == 2
    login_args, login_kwargs = calls[0]
    exec_args, exec_kwargs = calls[1]
    assert login_args[1:3] == ["login", "status"]
    assert exec_args[1] == "exec"
    assert exec_kwargs["input"] == "mock prompt"
    assert exec_kwargs["env"].get("OPENAI_API_KEY") is None
    assert all("sk-" not in str(value) for value in exec_args)
    assert exec_args[exec_args.index("-s") + 1] == "read-only"


def test_login_expired_is_classified_without_running_model():
    bot = CodexBot(timeout=30)
    calls = []

    def fake_run(args, **kwargs):
        calls.append(args)
        return _completed(args, returncode=1, stderr="not logged in")

    with patch("models.codex.codex_bot._which_codex", return_value="/usr/bin/codex"):
        with patch("models.codex.codex_bot.subprocess.run", side_effect=fake_run):
            result = bot._run("must not reach model")

    assert result["content"].startswith("[login_expired]")
    assert len(calls) == 1
    assert calls[0][1:3] == ["login", "status"]


def test_quota_and_cli_unavailable_are_classified():
    bot = CodexBot(timeout=30)

    def quota_run(args, **kwargs):
        if args[1:3] == ["login", "status"]:
            return _completed(args, stdout="Logged in using ChatGPT")
        return _completed(args, returncode=1, stderr="quota exceeded")

    with patch("models.codex.codex_bot._which_codex", return_value="/usr/bin/codex"):
        with patch("models.codex.codex_bot.subprocess.run", side_effect=quota_run):
            assert bot._run("mock") ["content"].startswith("[quota_exceeded]")

    with patch("models.codex.codex_bot._which_codex", return_value=None):
        assert bot._run("mock")["content"].startswith("Codex CLI unavailable")


def test_provider_source_does_not_read_auth_json_or_embed_api_keys():
    source = Path("models/codex/codex_bot.py").read_text()
    assert "auth.json" not in source
    assert "OPENAI_API_KEY" in source  # explicitly removed from child env
    assert "sk-" not in source
