"""Manus provider for NovaAgent-Terminal.

Uses the local OpenAI-compatible bridge (``manus-api``, default
http://127.0.0.1:8742/v1) so Manus can be selected as a provider in the web
console like any other OpenAI-compatible vendor.

Why a bridge instead of calling api.manus.ai directly: the Manus API is a
task-oriented agent API (``task.create`` + poll ``task.listMessages``), not an
OpenAI chat-completions API. ``manus-api`` performs that task/poll dance and
exposes ``/v1/chat/completions``. This bot is therefore a thin subclass of
``ChatGPTBot`` that only swaps the credential pair (api_key / api_base) and
reports a model name the bridge understands.

Contract is inherited unchanged from ChatGPTBot:
    reply(query, context=None) -> Reply
    reply_text(session, retry_count=0) -> {"content", "total_tokens", ...}
"""
from __future__ import annotations

from common.log import logger
from config import conf
from models.chatgpt.chat_gpt_bot import ChatGPTBot
from models.openai.openai_http_client import OpenAIHTTPClient

# Where the local manus-api bridge listens by default. A per-install override
# wins so a non-default port keeps working.
DEFAULT_BRIDGE_BASE = "http://127.0.0.1:8742/v1"
# The bridge ignores the client key when it was started without --api-key; send
# a placeholder instead of an empty string so OpenAI-style clients stay happy.
DEFAULT_CLIENT_KEY = "unused"
DEFAULT_MODEL = "manus-2.0-lite"


def _bridge_base() -> str:
    base = str(conf().get("manus_bridge_api_base") or "").strip()
    if not base:
        base = str(conf().get("manus_api_base") or "").strip()
    # ``manus_api_base`` may still hold the upstream https://api.manus.ai value
    # (the agent tool uses it). Only accept it when it looks like a local
    # OpenAI-compatible endpoint; otherwise fall back to the bridge.
    if not base or "api.manus.ai" in base:
        base = DEFAULT_BRIDGE_BASE
    if not base.endswith("/v1"):
        base = base.rstrip("/") + "/v1"
    return base


def _client_key() -> str:
    key = str(conf().get("manus_bridge_api_key") or "").strip()
    return key or DEFAULT_CLIENT_KEY


class ManusBot(ChatGPTBot):
    """Chat bot that answers through the local Manus bridge."""

    def __init__(self, bot_type=None):
        # Build with the OpenAI credential fields so ChatGPTBot's own
        # resolution cannot fail when open_ai_api_key is unset (e.g. after a
        # fresh install); we overwrite both right after.
        super().__init__(bot_type)
        self._api_base = _bridge_base()
        self._api_key = _client_key()
        self._http_client = OpenAIHTTPClient(
            api_key=self._api_key,
            api_base=self._api_base,
            proxy=conf().get("proxy") or None,
        )
        configured = str(conf().get("manus_model") or "").strip()
        global_model = str(conf().get("model") or "").strip()
        if not configured and global_model.lower().startswith("manus"):
            # The console persists the chosen model globally; keep it when it is
            # already a Manus model so the picker stays authoritative.
            configured = global_model
        self.args["model"] = configured or DEFAULT_MODEL
        logger.info(
            "[MANUS] bridge ready base=%s model=%s",
            self._api_base,
            self.args.get("model"),
        )

    def get_api_config(self):
        """Point the OpenAI-compatible path at the local Manus bridge."""
        return {
            "api_key": self._api_key or _client_key(),
            "api_base": self._api_base or _bridge_base(),
            "model": self.args.get("model") or DEFAULT_MODEL,
            "default_temperature": conf().get("temperature", 0.9),
            "default_top_p": conf().get("top_p", 1.0),
            "default_frequency_penalty": conf().get("frequency_penalty", 0.0),
            "default_presence_penalty": conf().get("presence_penalty", 0.0),
            # The bridge speaks plain chat-completions; never the Responses API.
            "api_type": "chat",
        }
