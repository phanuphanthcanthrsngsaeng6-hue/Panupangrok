"""Signing in to the console, and the MCP OAuth callback.

The console's own password check plus the redirect target an MCP server
sends the user back to after authorising it.
"""

import hashlib
import hmac
import json
import time

import web

from channel.web.core._common import (
    _check_auth,
    _get_web_password,
    _is_password_enabled,
    _session_expire_seconds,
)
from channel.web.core import user_store
from common.log import logger
from common.utils import constant_time_equals


def _create_auth_token(identity: str = ""):
    """Create a stateless signed token.

    Two shapes are emitted:

    * root (no identity): ``<timestamp_hex>.<hmac_hex>``
    * user: ``<identity>.<timestamp_hex>.<hmac_hex>``

    The HMAC key stays the root ``web_password``; the identity is covered by
    the signature, so a user's token cannot be forged from another user's
    password and rotating one user's password does not invalidate the rest.
    """
    ts = format(int(time.time()), "x")
    payload = f"{identity}.{ts}" if identity else ts
    sig = hmac.new(
        _get_web_password().encode(),
        payload.encode(),
        hashlib.sha256,
    ).hexdigest()
    return f"{payload}.{sig}"


class McpOAuthCallbackHandler:
    """OAuth redirect target for MCP servers requiring authorization.

    The browser lands here after the user authorizes a remote MCP server.
    We exchange the authorization code for tokens and bring the server
    online. Unauthenticated by design: the OAuth `state` param is the
    single-use secret that binds this request to a pending authorization.
    """

    def GET(self):
        web.header('Content-Type', 'text/html; charset=utf-8')
        params = web.input(code="", state="", error="", error_description="")

        def _page(title: str, message: str) -> str:
            return (
                "<!doctype html><html><head><meta charset='utf-8'>"
                "<meta name='viewport' content='width=device-width,initial-scale=1'>"
                f"<title>{title}</title></head>"
                "<body style='font-family:-apple-system,Segoe UI,Roboto,sans-serif;"
                "max-width:520px;margin:64px auto;padding:0 20px;text-align:center;color:#1f2328'>"
                f"<h2>{title}</h2><p style='color:#57606a'>{message}</p></body></html>"
            )

        if params.error:
            logger.warning(f"[MCP-OAuth] callback error: {params.error} {params.error_description}")
            return _page("授权失败", f"{params.error}: {params.error_description or ''}")

        if not params.code or not params.state:
            return _page("参数缺失", "回调缺少 code 或 state 参数。")

        try:
            from agent.tools.mcp.mcp_oauth import pop_pending
            from agent.tools.mcp.mcp_client import notify_server_authorized
        except Exception as e:
            logger.warning(f"[MCP-OAuth] callback import failed: {e}")
            return _page("内部错误", "OAuth 模块不可用。")

        handler = pop_pending(params.state)
        if handler is None:
            return _page("会话已过期", "授权请求不存在或已过期，请重新触发授权。")

        try:
            ok = handler.finish_authorization(params.code)
        except Exception as e:
            logger.warning(f"[MCP-OAuth] token exchange crashed: {e}")
            ok = False

        if not ok:
            return _page("授权失败", "换取令牌失败，请重试。")

        notify_server_authorized(handler.server_name)
        logger.info(f"[MCP-OAuth] Server '{handler.server_name}' authorized via web callback")
        return _page(
            "授权成功",
            f"MCP 服务 “{handler.server_name}” 已授权，可以返回聊天继续使用了。",
        )


class AuthCheckHandler:
    def GET(self):
        web.header('Content-Type', 'application/json; charset=utf-8')
        if not _is_password_enabled():
            return json.dumps({"status": "success", "auth_required": False})
        if _check_auth():
            return json.dumps({"status": "success", "auth_required": True, "authenticated": True})
        return json.dumps({"status": "success", "auth_required": True, "authenticated": False})


class AuthLoginHandler:
    def POST(self):
        web.header('Content-Type', 'application/json; charset=utf-8')
        if not _is_password_enabled():
            return json.dumps({"status": "success"})
        try:
            data = json.loads(web.data())
        except Exception:
            return json.dumps({"status": "error", "message": "Invalid request"})
        username = str(data.get("username", "") or "").strip()
        password = str(data.get("password", "") or "")

        if username and username != "root":
            # Named user: verify against the scrypt record in web_users.
            if not user_store.verify_password(username, password):
                logger.warning("[WebChannel] Invalid login attempt for user '%s'", username)
                return json.dumps({"status": "error", "message": "Wrong username or password"})
            token = _create_auth_token(username)
            logger.info("[WebChannel] user '%s' signed in", username)
        else:
            expected = _get_web_password()
            if not constant_time_equals(password, expected):
                logger.warning("[WebChannel] Invalid root login attempt")
                return json.dumps({"status": "error", "message": "Wrong password"})
            token = _create_auth_token("")
        web.setcookie("cow_auth_token", token, expires=_session_expire_seconds(),
                       path="/", httponly=True, samesite="Lax")
        # Also return the token in the body: the desktop client (file:// origin)
        # can't rely on the cookie and sends it back via an Authorization header.
        return json.dumps({"status": "success", "token": token,
                           "identity": username or "root"})


class AuthRegisterHandler:
    """Create a named console user (``POST /auth/register``)."""

    def POST(self):
        web.header('Content-Type', 'application/json; charset=utf-8')
        if not _is_password_enabled():
            return json.dumps({"status": "error",
                               "message": "Set a web_password first"})
        if not _check_auth():
            # Only root (or an already-signed-in user) may create accounts.
            return json.dumps({"status": "error", "message": "Unauthorized"})
        try:
            data = json.loads(web.data())
        except Exception:
            return json.dumps({"status": "error", "message": "Invalid request"})
        username = str(data.get("username", "") or "").strip()
        password = str(data.get("password", "") or "")
        try:
            user_store.create_user(username, password)
        except user_store.UserStoreError as e:
            return json.dumps({"status": "error", "message": str(e)})
        logger.info("[WebChannel] registered web user '%s'", username)
        return json.dumps({"status": "success", "username": username})


class AuthUsersHandler:
    """List named console users (``GET /auth/users``)."""

    def GET(self):
        web.header('Content-Type', 'application/json; charset=utf-8')
        if not _check_auth():
            return json.dumps({"status": "error", "message": "Unauthorized"})
        return json.dumps({"status": "success", "users": user_store.public_list()})


class AuthLogoutHandler:
    def POST(self):
        web.header('Content-Type', 'application/json; charset=utf-8')
        web.setcookie("cow_auth_token", "", expires=-1, path="/")
        return json.dumps({"status": "success"})
