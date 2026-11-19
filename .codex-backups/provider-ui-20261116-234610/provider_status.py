"""Read-only provider status for the Web Workspace.

This endpoint deliberately performs only safe health/usage reads.  It never
starts a model turn, creates a Manus task, or returns credentials to the
browser.  The existing web authentication gate protects it like the other
workspace APIs.
"""

from __future__ import annotations

import json
import os
import subprocess
from typing import Any, Dict

import requests
import web

from channel.web.core._common import _require_auth
from config import conf
from models.codex.codex_bot import _classify_cli_error, _which_codex


def _safe_text(value: Any, limit: int = 180) -> str:
    text = str(value or "").replace("\n", " ").strip()
    return text[:limit]


def _codex_status() -> Dict[str, Any]:
    binary = _which_codex()
    if not binary:
        return {"status": "unavailable", "message": "Codex CLI unavailable"}

    env = os.environ.copy()
    env.pop("OPENAI_API_KEY", None)
    try:
        result = subprocess.run(
            [binary, "login", "status"],
            capture_output=True,
            text=True,
            stdin=subprocess.DEVNULL,
            timeout=10,
            env=env,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return {"status": "unavailable", "message": f"Codex CLI unavailable ({type(exc).__name__})"}

    output = _safe_text(f"{result.stdout}\n{result.stderr}")
    if result.returncode == 0 and "logged in" in output.lower():
        return {"status": "ready", "message": "ChatGPT Login พร้อมใช้งาน"}
    category = _classify_cli_error(output)
    messages = {
        "login_expired": "ChatGPT Login หมดอายุหรือยังไม่ได้ล็อกอิน",
        "quota_exceeded": "โควตา Codex ถึงขีดจำกัด",
        "cli_unavailable": "ตรวจสอบ Codex CLI ไม่สำเร็จ",
    }
    return {"status": category, "message": messages[category]}


def _manus_base() -> str:
    base = str(conf().get("manus_bridge_api_base") or "").strip()
    if not base or "api.manus.ai" in base:
        base = "http://127.0.0.1:8742/v1"
    return base.rstrip("/") if base.rstrip("/").endswith("/v1") else base.rstrip("/") + "/v1"


def _credit_value(payload: Any) -> Any:
    if isinstance(payload, dict):
        for key in ("availableCredits", "available_credits", "credits", "balance"):
            if key in payload:
                return payload[key]
        for key in ("data", "result"):
            if key in payload:
                value = _credit_value(payload[key])
                if value is not None:
                    return value
    return payload if isinstance(payload, (int, float, str)) else None


def _manus_status() -> Dict[str, Any]:
    try:
        client_key = str(conf().get("manus_bridge_api_key") or "").strip() or "unused"
        response = requests.get(
            f"{_manus_base()}/usage",
            headers={"Authorization": f"Bearer {client_key}"},
            params={"limit": 10},
            timeout=8,
        )
        if response.status_code != 200:
            return {"status": "error", "message": f"Manus Bridge HTTP {response.status_code}"}
        payload = response.json()
        available = payload.get("available_credits") if isinstance(payload, dict) else None
        history = payload.get("usage") if isinstance(payload, dict) else None
        return {
            "status": "ready",
            "message": "Manus Bridge พร้อมใช้งาน",
            "available_credits": available,
            "available_credits_value": _credit_value(available),
            "recent_usage": history,
        }
    except requests.RequestException:
        return {"status": "unavailable", "message": "เชื่อมต่อ Manus Bridge ไม่ได้"}
    except (ValueError, TypeError):
        return {"status": "error", "message": "Manus Bridge ส่งข้อมูลไม่ถูกต้อง"}


def _routing_state() -> Dict[str, Any]:
    local = conf()
    provider = local.get("bot_type") or ""
    provider = "openai" if provider == "chatGPT" else provider
    fallback = local.get("chat_fallback") or {}
    chain = []
    for item in fallback.get("chain") or []:
        if isinstance(item, dict) and item.get("provider") and item.get("model"):
            chain.append({"provider": str(item["provider"]), "model": str(item["model"])})
    return {
        "primary": {"provider": provider, "model": local.get("model") or ""},
        "fallback_enabled": bool(fallback.get("enabled")),
        "fallback_chain": chain,
    }


class ProviderStatusHandler:
    def GET(self):
        _require_auth()
        web.header("Content-Type", "application/json; charset=utf-8")
        web.header("Cache-Control", "no-store")
        return json.dumps({
            "status": "success",
            "routing": _routing_state(),
            "providers": {"codex": _codex_status(), "manus": _manus_status()},
        }, ensure_ascii=False)
