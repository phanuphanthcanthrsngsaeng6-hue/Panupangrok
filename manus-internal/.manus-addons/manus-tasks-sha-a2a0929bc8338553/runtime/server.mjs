// node_modules/@manus/addon-kit/packages/addon-tools/src/mcpServer.ts
import readline from "node:readline";
function createMcpServer(options) {
  const protocolVersion = options.protocolVersion ?? "2024-11-05";
  const capabilities = options.capabilities ?? { tools: {} };
  function respond(id, result) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}
`);
  }
  function fail(id, code, message) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}
`);
  }
  const io = { respond, fail };
  async function handleMessage(message) {
    const { id, method, params } = message;
    if (method === "initialize") {
      respond(id, {
        protocolVersion,
        serverInfo: options.serverInfo,
        capabilities
      });
      return;
    }
    if (method === "tools/list") {
      respond(id, { tools: options.listTools() });
      return;
    }
    if (method === "tools/call") {
      await options.callTool(id, params, io);
      return;
    }
    if (method === "ping") {
      respond(id, {});
      return;
    }
    if (method === "notifications/initialized") {
      return;
    }
    fail(id, -32601, `unknown method: ${method}`);
  }
  function start() {
    const input = readline.createInterface({ input: process.stdin, terminal: false });
    input.on("line", (line) => {
      if (!line.trim())
        return;
      try {
        handleMessage(JSON.parse(line));
      } catch (error) {
        fail(null, -32700, String(error instanceof Error ? error.message : error));
      }
    });
    let shuttingDown = false;
    function shutdown() {
      if (shuttingDown)
        return;
      shuttingDown = true;
      (async () => {
        await options.onShutdown?.();
      })().finally(() => process.exit(0));
    }
    input.on("close", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
  return { start, respond, fail };
}
// addons/manus-tasks/runtime/access.ts
function accessResult() {
  const data = {
    ready: false,
    reason: "runtime_http_access_unavailable"
  };
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
    structuredContent: data
  };
}
// node_modules/@manus/addon-kit/packages/addon-backend/src/clientAssertion.ts
import crypto from "node:crypto";
var clientAssertionType = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
var assertionTTLSeconds = 45;
function createClientAssertion(config, nowSeconds = Math.floor(Date.now() / 1000)) {
  const privateKey = clientPrivateKey(config);
  const claims = {
    iss: config.addonID,
    sub: config.addonID,
    aud: config.auth.exchangeAudience,
    iat: nowSeconds,
    exp: nowSeconds + assertionTTLSeconds,
    jti: crypto.randomUUID()
  };
  const header = base64URL(JSON.stringify({ alg: "EdDSA", typ: "JWT", kid: config.auth.clientKeyID }));
  const payload = base64URL(JSON.stringify(claims));
  const signature = crypto.sign(null, Buffer.from(`${header}.${payload}`), privateKey).toString("base64url");
  return `${header}.${payload}.${signature}`;
}
function clientPrivateKey(config) {
  const keyID = requireKeyID(config.auth.clientKeyID);
  const privateKey = parseClientPrivateKey(config.auth.clientSigningKey);
  if (!keyID) {
    throw new Error("ADDON_CLIENT_KEY_ID is not configured");
  }
  return privateKey;
}
function parseClientPrivateKey(raw) {
  if (!raw.trim()) {
    throw new Error("ADDON_CLIENT_SIGNING_KEY is not configured");
  }
  const key = crypto.createPrivateKey(raw);
  if (key.asymmetricKeyType !== "ed25519") {
    throw new Error("ADDON_CLIENT_SIGNING_KEY must be an Ed25519 PKCS#8 private key");
  }
  return key;
}
function requireKeyID(keyID) {
  const normalized = keyID.trim();
  if (!normalized) {
    throw new Error("ADDON_CLIENT_KEY_ID is not configured");
  }
  return normalized;
}
function base64URL(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}
// node_modules/@manus/addon-kit/packages/addon-backend/src/hostAccessService.ts
import crypto2 from "node:crypto";
var exchangeProcedure = "/addon.v1.AddonGatewayService/ExchangeToken";
var requestTimeoutMs = 5000;
var expiryMarginMs = 1000;
var maxCachedHostTokens = 4096;

class HostAccessError extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "HostAccessError";
  }
}

class HostAccessService {
  config;
  hostTokens = new Map;
  constructor(config) {
    this.config = config;
  }
  asProvider(identity) {
    return async ({ scopes, refresh }) => {
      const input = { ...identity, scopes: [...new Set(scopes.map((scope) => scope.trim()).filter(Boolean))].sort() };
      if (refresh)
        this.invalidate(input);
      const token = await this.getTokenDetail(input);
      return { accessToken: token.token, expiresAt: token.expiresAtMs / 1000, grantedScopes: token.grantedScopes ?? [] };
    };
  }
  clearForTest() {
    this.hostTokens.clear();
  }
  invalidate(input) {
    this.hostTokens.delete(this.cacheKey(input));
  }
  async getToken(input) {
    return (await this.getTokenDetail(input)).token;
  }
  async getTokenDetail(input) {
    const normalizedScopes = [...new Set(input.scopes.map((scope) => scope.trim()).filter(Boolean))].sort();
    if (!input.subjectToken) {
      throw new HostAccessError(503, "host_access_input_invalid");
    }
    const normalizedInput = { ...input, scopes: normalizedScopes };
    const key = this.cacheKey(normalizedInput);
    this.pruneHostTokens();
    const cached = this.hostTokens.get(key);
    if (cached && cached.expiresAtMs - Date.now() > expiryMarginMs) {
      return { ...cached, grantedScopes: cached.grantedScopes?.slice() };
    }
    let clientAssertion;
    try {
      clientAssertion = createClientAssertion(this.config);
    } catch {
      throw new HostAccessError(503, "addon_credential_unavailable");
    }
    const response = await fetch(`${this.config.bizServerEndpoint}${exchangeProcedure}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        subjectToken: input.subjectToken,
        clientId: this.config.addonID,
        clientAssertionType,
        clientAssertion,
        scopes: normalizedScopes
      }),
      signal: AbortSignal.timeout(requestTimeoutMs)
    }).catch((error) => {
      throw new HostAccessError(503, error instanceof Error ? error.message : "token_exchange_unavailable");
    });
    const payload = await response.json().catch(() => {
      return;
    });
    if (!response.ok) {
      throw new HostAccessError(response.status === 401 ? 401 : response.status === 403 ? 403 : 503, `token_exchange_http_${response.status}`);
    }
    const token = payload?.accessToken ?? payload?.access_token;
    const expiresAtSeconds = Number(payload?.expiresAt ?? payload?.expires_at ?? 0);
    if (!token || !Number.isFinite(expiresAtSeconds) || expiresAtSeconds <= 0) {
      throw new HostAccessError(503, "invalid_token_exchange_response");
    }
    while (this.hostTokens.size >= maxCachedHostTokens) {
      const oldestKey = this.hostTokens.keys().next().value;
      if (typeof oldestKey !== "string") {
        break;
      }
      this.hostTokens.delete(oldestKey);
    }
    const grantedScopes = payload?.grantedScopes ?? payload?.granted_scopes;
    if (grantedScopes !== undefined && (!Array.isArray(grantedScopes) || grantedScopes.some((scope) => typeof scope !== "string"))) {
      throw new HostAccessError(503, "invalid_token_exchange_response");
    }
    this.hostTokens.set(key, { token, expiresAtMs: expiresAtSeconds * 1000, grantedScopes: grantedScopes?.slice() });
    return { token, expiresAtMs: expiresAtSeconds * 1000, grantedScopes: grantedScopes?.slice() };
  }
  pruneHostTokens() {
    const now = Date.now();
    for (const [key, cached] of this.hostTokens) {
      if (cached.expiresAtMs - now <= expiryMarginMs) {
        this.hostTokens.delete(key);
      }
    }
  }
  cacheKey(input) {
    const tokenID = input.subjectTokenID || crypto2.createHash("sha256").update(input.subjectToken).digest("base64url");
    return `${tokenID}
${input.scopes.join(" ")}`;
  }
}
// node_modules/@manus/addon-kit/packages/addon-backend/src/sessionAccessService.ts
var checkSessionAccessProcedure = "/addon.v1.AddonGatewayService/CheckSessionAccess";
var REQUEST_TIMEOUT_MS = 2000;
var ACCESS_CACHE_TTL_MS = 60000;
var DENY = { canRead: false, canWrite: false };

class SessionAccessService {
  config;
  decisions = new Map;
  constructor(config) {
    this.config = config;
  }
  clearForTest() {
    this.decisions.clear();
  }
  async checkAccess(sessionUid, sub, hostAccessToken) {
    if (!sessionUid || !sub) {
      return DENY;
    }
    const cacheKey = `${sessionUid}
${sub}`;
    const cached = this.decisions.get(cacheKey);
    if (cached && cached.expiresAtMs > Date.now()) {
      return cached.decision;
    }
    if (!hostAccessToken) {
      return DENY;
    }
    try {
      const response = await fetch(`${this.config.bizServerEndpoint}${checkSessionAccessProcedure}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${hostAccessToken}` },
        body: JSON.stringify({
          sessionUid,
          sub
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
      if (!response.ok) {
        return DENY;
      }
      const payload = await response.json().catch(() => {
        return;
      });
      const decision = {
        canRead: payload?.allowed === true,
        canWrite: payload?.canWrite === true || payload?.can_write === true
      };
      this.decisions.set(cacheKey, { decision, expiresAtMs: Date.now() + ACCESS_CACHE_TTL_MS });
      return decision;
    } catch {
      return DENY;
    }
  }
}
// node_modules/@manus/addon-kit/packages/addon-backend/src/subjectProfileService.ts
var resolveSubjectProfilesProcedure = "/addon.v1.AddonGatewayService/ResolveSubjectProfiles";
var REQUEST_TIMEOUT_MS2 = 2000;
var MAX_SUBS_PER_REQUEST = 50;
var PROFILE_CACHE_TTL_MS = 10 * 60000;

class SubjectProfileService {
  config;
  profiles = new Map;
  constructor(config) {
    this.config = config;
  }
  clearForTest() {
    this.profiles.clear();
  }
  async resolveProfiles(subs, credentials = {}) {
    const resolved = {};
    const pending = [];
    const seen = new Set;
    const now = Date.now();
    for (const sub of subs) {
      if (!sub.startsWith("sub_") || seen.has(sub)) {
        continue;
      }
      seen.add(sub);
      const cached = this.profiles.get(sub);
      if (cached && cached.expiresAtMs > now) {
        if (cached.profile) {
          resolved[sub] = cached.profile;
        }
        continue;
      }
      pending.push(sub);
    }
    for (let index = 0;index < pending.length; index += MAX_SUBS_PER_REQUEST) {
      const batch = pending.slice(index, index + MAX_SUBS_PER_REQUEST);
      const profiles = await this.fetchProfiles(batch, credentials.hostAccessToken);
      if (!profiles) {
        continue;
      }
      for (const sub of batch) {
        const raw = profiles[sub];
        const profile = raw ? { name: raw.name ?? "", avatarUrl: raw.avatarUrl ?? raw.avatar_url ?? "" } : undefined;
        this.profiles.set(sub, { profile, expiresAtMs: Date.now() + PROFILE_CACHE_TTL_MS });
        if (profile) {
          resolved[sub] = profile;
        }
      }
    }
    return resolved;
  }
  async fetchProfiles(subs, hostAccessToken) {
    if (!hostAccessToken) {
      return;
    }
    try {
      const response = await fetch(`${this.config.bizServerEndpoint}${resolveSubjectProfilesProcedure}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${hostAccessToken}` },
        body: JSON.stringify({ subs }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS2)
      });
      if (!response.ok) {
        return;
      }
      const payload = await response.json().catch(() => {
        return;
      });
      return payload?.profiles ?? {};
    } catch {
      return;
    }
  }
}
// node_modules/@manus/addon-kit/packages/addon-protocol/src/hostPermissions.ts
var ADDON_HOST_PERMISSIONS = {
  AUDIO_TRANSCRIBE: "audio.transcribe"
};

// node_modules/@manus/addon-kit/packages/addon-backend/src/hostClient.ts
var audioTranscriptionScope = ADDON_HOST_PERMISSIONS.AUDIO_TRANSCRIBE;
var maxAudioBytes = 100 * 1024 * 1024;
// node_modules/@manus/addon-kit/packages/addon-backend/src/deviceHostAccess.ts
var DEVICE_HOST_ACCESS_META_KEY = "ai.manus/hostAccess";
function readDeviceHostAccess(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return;
  const grant = value;
  if (typeof grant.addonId !== "string" || !grant.addonId || typeof grant.addonRevision !== "string" || !grant.addonRevision || typeof grant.endpoint !== "string" || !isHostEndpoint(grant.endpoint) || typeof grant.accessToken !== "string" || !grant.accessToken || grant.accessToken.length > 32768 || typeof grant.expiresAt !== "number" || !Number.isFinite(grant.expiresAt) || !Array.isArray(grant.grantedScopes) || grant.grantedScopes.length > 128 || !grant.grantedScopes.every((scope) => typeof scope === "string"))
    return;
  return {
    addonId: grant.addonId,
    addonRevision: grant.addonRevision,
    endpoint: grant.endpoint,
    accessToken: grant.accessToken,
    expiresAt: grant.expiresAt,
    grantedScopes: [...grant.grantedScopes]
  };
}
function isHostEndpoint(value) {
  if (!value || value.length > 2048)
    return false;
  try {
    const endpoint = new URL(value);
    return ["http:", "https:"].includes(endpoint.protocol) && !endpoint.username && !endpoint.password && !endpoint.search && !endpoint.hash && (endpoint.protocol === "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname));
  } catch {
    return false;
  }
}
// node_modules/@manus/addon-kit/packages/addon-protocol/src/envelope.ts
var MAX_MANUS_ADDON_INLINE_RESOURCE_BYTES = 32 * 1024;
// node_modules/@manus/addon-kit/packages/addon-protocol/src/invocationContext.ts
var MANUS_ADDON_INVOCATION_CONTEXT_META_KEY = "ai.manus/invocationContext";
function addonInvocationContextFromToolCall(params) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return;
  }
  const meta = params._meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return;
  }
  const value = meta[MANUS_ADDON_INVOCATION_CONTEXT_META_KEY];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return;
  }
  const record = value;
  const sessionId = typeof record.sessionId === "string" ? record.sessionId.trim() : "";
  if (!sessionId) {
    return;
  }
  const workspaceId = typeof record.workspaceId === "string" ? record.workspaceId.trim() || null : null;
  const directoryId = typeof record.directoryId === "string" ? record.directoryId.trim() || null : null;
  const workingDirectory = typeof record.workingDirectory === "string" ? record.workingDirectory.trim() || null : null;
  const dataDirectory = typeof record.dataDirectory === "string" ? record.dataDirectory.trim() || null : null;
  return {
    sessionId,
    workspaceId,
    directoryId,
    workingDirectory,
    dataDirectory
  };
}
// node_modules/@manus/addon-kit/packages/addon-protocol/src/oauth.ts
var OAUTH_PROVIDERS = {
  GOOGLE_DRIVE: "google_drive",
  ONE_DRIVE_PERSONAL: "one_drive_personal",
  ONE_DRIVE_BUSINESS: "one_drive_business",
  GOOGLE_GMAIL: "google_gmail",
  GOOGLE_CALENDAR: "google_calendar",
  GOOGLE_ADS: "google_ads",
  GITHUB: "github",
  FIGMA: "figma",
  MICROSOFT_OUTLOOK: "microsoft_outlook",
  MICROSOFT_CALENDAR: "microsoft_calendar",
  META_MARKETING: "meta_marketing",
  META_CREATORS: "meta_creators",
  INSTAGRAM: "instagram",
  SHOPIFY: "shopify",
  X: "x",
  NOTION: "notion"
};
var OAUTH_PROVIDER_VALUES = Object.values(OAUTH_PROVIDERS);
var OAUTH_ENV_SOURCES = {
  ACCESS_TOKEN: "oauth.access_token",
  ACCOUNT: "oauth.account",
  ACCOUNT_UID: "oauth.account_uid"
};
var OAUTH_ENV_SOURCE_VALUES = Object.values(OAUTH_ENV_SOURCES);
var MCP_EXECUTION_MODES = {
  RUNTIME: "runtime_mcp",
  DEVICE: "device_mcp",
  CONNECTOR: "connector_mcp"
};
// node_modules/@manus/addon-kit/packages/addon-protocol/src/executionModes.ts
var MCP_EXECUTION_MODE_VALUES = [
  MCP_EXECUTION_MODES.RUNTIME,
  MCP_EXECUTION_MODES.DEVICE,
  MCP_EXECUTION_MODES.CONNECTOR
];
// node_modules/@manus/addon-kit/packages/addon-protocol/src/agentHooks.ts
var ADDON_HOOK_TRIGGERS = {
  FILE_EDIT_COMPLETED: "host_file_edit_completed",
  USER_CHAT: "host_user_chat",
  TODO_COMPLETED: "host_todo_completed",
  TERMINAL_PRE_EXEC: "host_terminal_pre_exec",
  TERMINAL_POST_EXEC: "host_terminal_post_exec"
};
var ADDON_HOOK_RESULT_KINDS = {
  AGENT_REMINDER: "agent_reminder",
  MODEL_CALL: "model_call",
  SUBAGENT_START: "subagent_start",
  EXECUTION_BLOCK: "execution_block"
};
var ADDON_SUBAGENT_MAX_INSTRUCTIONS_BYTES = 64 * 1024;
var ADDON_HOOK_RESULT_KINDS_BY_TRIGGER = {
  [ADDON_HOOK_TRIGGERS.FILE_EDIT_COMPLETED]: [
    ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER,
    ADDON_HOOK_RESULT_KINDS.MODEL_CALL
  ],
  [ADDON_HOOK_TRIGGERS.USER_CHAT]: [ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER],
  [ADDON_HOOK_TRIGGERS.TODO_COMPLETED]: [
    ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER,
    ADDON_HOOK_RESULT_KINDS.SUBAGENT_START
  ],
  [ADDON_HOOK_TRIGGERS.TERMINAL_PRE_EXEC]: [
    ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER,
    ADDON_HOOK_RESULT_KINDS.EXECUTION_BLOCK
  ],
  [ADDON_HOOK_TRIGGERS.TERMINAL_POST_EXEC]: [ADDON_HOOK_RESULT_KINDS.AGENT_REMINDER]
};
// node_modules/@manus/addon-kit/packages/addon-protocol/src/notifications.ts
var ADDON_WIDGET_NOTIFICATION_LIMITS = {
  maxDefinitions: 32,
  maxTextLength: 2000,
  maxPayloadBytes: 32 * 1024
};
// node_modules/@manus/addon-kit/packages/addon-protocol/src/updateModes.ts
var ADDON_UPDATE_MODES = {
  HOT: "hot",
  RESTART: "restart"
};
var DEFAULT_ADDON_UPDATE_MODE = ADDON_UPDATE_MODES.RESTART;
// addons/manus-tasks/runtime/hostFetch.ts
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { pipeline, Readable } from "node:stream";
import * as tls from "node:tls";
var trustedCertificates;
function caCertificates() {
  const read = tls.getCACertificates;
  if (!read)
    return;
  if (trustedCertificates === undefined) {
    try {
      trustedCertificates = [...new Set([...read("default"), ...read("system")])];
    } catch {
      trustedCertificates = [];
    }
  }
  return trustedCertificates.length > 0 ? trustedCertificates : undefined;
}
var NULL_BODY_STATUSES = new Set([204, 205, 304]);
var hostFetch = (input, init) => new Promise((resolve, reject) => {
  const url = new URL(input);
  const secure = url.protocol === "https:";
  if (!secure && url.protocol !== "http:") {
    reject(new TypeError("unsupported protocol"));
    return;
  }
  const headers = Object.fromEntries(new Headers(init?.headers).entries());
  const options = { method: init?.method ?? "GET", headers };
  const signal = init?.signal ?? undefined;
  if (signal?.aborted) {
    reject(signal.reason);
    return;
  }
  const handle = (res) => {
    const status = res.statusCode ?? 0;
    if (status < 200 || status > 599) {
      res.destroy();
      reject(new TypeError("invalid response status"));
      return;
    }
    const body2 = NULL_BODY_STATUSES.has(status) ? null : Readable.toWeb(res);
    if (!body2)
      res.resume();
    resolve(new Response(body2, { status }));
  };
  const req = secure ? httpsRequest(url, { ...options, ca: caCertificates() }, handle) : httpRequest(url, options, handle);
  signal?.addEventListener("abort", () => {
    const reason = signal.reason instanceof Error ? signal.reason : new Error("aborted");
    reject(reason);
    req.destroy(reason);
  }, { once: true });
  req.on("error", reject);
  const body = init?.body;
  if (body === undefined || body === null) {
    req.end();
  } else if (typeof body === "string" || body instanceof Uint8Array) {
    req.end(body);
  } else if (body instanceof ReadableStream) {
    pipeline(Readable.fromWeb(body), req, (error) => {
      if (error)
        reject(error);
    });
  } else {
    const error = new TypeError("unsupported request body");
    reject(error);
    req.destroy(error);
  }
});

// addons/manus-tasks/runtime/sectionName.ts
var space = "[\t-\r    - \u2028\u2029  　]";
var nonSpace = `[^${space.slice(1, -1)}]`;
var edges = new RegExp(`^${space}+|${space}+$`, "gu");
var sectionNamePattern = `^${space}*${nonSpace}(?:[\\s\\S]{0,78}${nonSpace})?${space}*$`;
function normalizeSectionName(name) {
  return name.replace(edges, "");
}

// addons/manus-tasks/runtime/server-info.ts
var serverInfo = { name: "manus-tasks", version: "0.0.27" };

// addons/manus-tasks/runtime/uploadFile.ts
import { constants, createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { basename, isAbsolute } from "node:path";
import { Readable as Readable2 } from "node:stream";
var UPLOAD_FILE_TOOL = "upload_file";
var MAX_UPLOAD_FILES = 20;
var MAX_UPLOAD_FILE_BYTES = 512 * 1024 * 1024;
var UPLOAD_DEADLINE_MS = 270000;
var UPLOAD_PUT_WINDOW_MS = 170000;
var BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".dll",
  ".bin",
  ".com",
  ".scr",
  ".msi",
  ".app",
  ".bat",
  ".cmd",
  ".sh",
  ".ps1",
  ".dmg",
  ".pkg",
  ".deb",
  ".rpm"
]);
var FILE_SOURCES = ["file_id", "file_url", "file_data"];
async function callUploadFileTool(params, fetchImpl = hostFetch, deadlineMs = UPLOAD_DEADLINE_MS, putWindowMs = UPLOAD_PUT_WINDOW_MS) {
  const authorized = authorizeCall(params);
  if (!("grant" in authorized))
    return authorized;
  const args = isRecord(params) ? params.arguments : undefined;
  if (!isRecord(args) || !hasOnly(args, ["paths"]))
    return failure("upload_file accepts only paths");
  const paths = args.paths;
  if (!Array.isArray(paths) || paths.length === 0 || paths.length > MAX_UPLOAD_FILES) {
    return failure(`paths must list 1 to ${MAX_UPLOAD_FILES} files`);
  }
  const files = await checkLocalFiles(paths);
  if (typeof files === "string")
    return failure(files);
  const uploaded = await uploadLocalFiles(authorized.grant, files, fetchImpl, deadlineMs, putWindowMs);
  if (typeof uploaded === "string")
    return failure(`${uploaded}; no file_id was returned, retry the whole call`);
  const result = { files: uploaded };
  return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
}
async function uploadContentFiles(grant, content, fetchImpl, deadlineMs, putWindowMs = UPLOAD_PUT_WINDOW_MS) {
  const indexes = content.flatMap((part, index) => isRecord(part) && Object.hasOwn(part, "file_path") ? [index] : []);
  if (indexes.length === 0)
    return [...content];
  if (indexes.length > MAX_UPLOAD_FILES) {
    return `a message can attach at most ${MAX_UPLOAD_FILES} local files; nothing was sent`;
  }
  const parts = indexes.map((index) => content[index]);
  for (const part of parts) {
    if (part.type !== "file" && part.type !== "voice" || FILE_SOURCES.some((key) => Object.hasOwn(part, key))) {
      return "invalid_argument: a file_path part needs type file or voice and no file_id, file_url or file_data; nothing was sent";
    }
  }
  const files = await checkLocalFiles(parts.map((part) => part.file_path));
  if (typeof files === "string")
    return `${files}; nothing was sent`;
  const uploaded = await uploadLocalFiles(grant, files, fetchImpl, deadlineMs, putWindowMs);
  if (typeof uploaded === "string")
    return `${uploaded}; nothing was sent, retry the whole call`;
  const resolved = [...content];
  indexes.forEach((index, n) => {
    const { file_path: _path, ...rest } = parts[n];
    resolved[index] = { ...rest, file_id: uploaded[n].file_id };
  });
  return resolved;
}
async function checkLocalFiles(paths) {
  const files = [];
  for (const path of paths) {
    const checked = await checkLocalFile(path);
    if (typeof checked === "string")
      return checked;
    files.push(checked);
  }
  return files;
}
async function uploadLocalFiles(grant, files, fetchImpl, deadlineMs, putWindowMs) {
  const deadline = Date.now() + deadlineMs;
  const uploaded = [];
  for (const file of files) {
    const outcome = await uploadOne(grant, file, fetchImpl, deadline, putWindowMs);
    if (typeof outcome === "string")
      return `upload failed for ${file.path}: ${outcome}`;
    uploaded.push(outcome);
  }
  return uploaded;
}
async function checkLocalFile(path) {
  if (typeof path !== "string" || !path || !isAbsolute(path)) {
    return `path must be absolute: ${JSON.stringify(path)}`;
  }
  const filename = basename(path);
  const extension = fileExtension(filename);
  if (!extension)
    return `file has no extension: ${path}`;
  if (BLOCKED_EXTENSIONS.has(extension))
    return `file type ${extension} is not allowed: ${path}`;
  try {
    const info = await stat(path);
    if (!info.isFile())
      return `not a regular file: ${path}`;
    if (info.size > MAX_UPLOAD_FILE_BYTES)
      return `file exceeds 512 MB: ${path}`;
    await access(path, constants.R_OK);
    return { path, filename, size: info.size };
  } catch {
    return `cannot read file: ${path}`;
  }
}
function fileExtension(filename) {
  const cut = filename.search(/[?#]/);
  const name = cut === -1 ? filename : filename.slice(0, cut);
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}
async function uploadOne(grant, file, fetchImpl, deadline, putWindowMs) {
  const remaining = (until = deadline) => Math.max(1, until - Date.now());
  if (deadline <= Date.now())
    return "upload timed out";
  const putDeadline = Math.min(deadline, Date.now() + putWindowMs);
  const created = await invokeProcedure(grant, "UploadFile", { filename: file.filename }, fetchImpl, remaining());
  if (created.isError)
    return created.content[0]?.text ?? "manus api request rejected";
  const data = created.structuredContent;
  const record = isRecord(data) && isRecord(data.file) ? data.file : undefined;
  const fileId = typeof record?.id === "string" ? record.id : "";
  const uploadUrl = isRecord(data) && typeof data.upload_url === "string" ? data.upload_url : "";
  if (!fileId || !isHttpsUrl(uploadUrl))
    return "invalid manus api response";
  if (putDeadline <= Date.now())
    return "upload timed out";
  const body = file.size === 0 ? new Uint8Array : Readable2.toWeb(createReadStream(file.path, { start: 0, end: file.size - 1 }));
  let response;
  try {
    response = await fetchImpl(uploadUrl, {
      method: "PUT",
      headers: { "Content-Length": String(file.size) },
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(remaining(putDeadline))
    });
  } catch (error) {
    if (body instanceof ReadableStream)
      await body.cancel().catch(() => {});
    return error instanceof Error && error.name === "TimeoutError" ? "upload timed out" : "file storage unavailable";
  }
  await response.body?.cancel().catch(() => {});
  if (response.status < 200 || response.status > 299)
    return `file storage rejected the upload (HTTP ${response.status})`;
  return { path: file.path, file_id: fileId, filename: file.filename, size_bytes: file.size };
}
function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

// addons/manus-tasks/runtime/manusApi.ts
var TASKS = "manus_api.tasks";
var PROJECTS = "manus_api.projects";
var manusApiContracts = {
  create_task: {
    procedure: "CreateTask",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: [
      "message",
      "title",
      "project_id",
      "locale",
      "interactive_mode",
      "hide_in_task_list",
      "share_visibility",
      "agent_profile",
      "speed_mode",
      "structured_output_schema",
      "execution_environment"
    ]
  },
  update_task: {
    procedure: "UpdateTask",
    scope: TASKS,
    defaultsToCurrentTask: true,
    arguments: [
      "task_id",
      "title",
      "enable_visible_in_task_list",
      "share_visibility",
      "pinned",
      "favorite",
      "project_id",
      "is_archived",
      "section_id"
    ]
  },
  list_tasks: {
    procedure: "ListTasks",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: [
      "limit",
      "cursor",
      "order",
      "scope",
      "agent_id",
      "project_id",
      "oauth_client_id",
      "api_key_id",
      "is_archived"
    ]
  },
  list_sections: {
    procedure: "ListSections",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: []
  },
  create_section: {
    procedure: "CreateSection",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: ["name"]
  },
  update_section: {
    procedure: "UpdateSection",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: ["section_id", "name"]
  },
  send_task_message: {
    procedure: "SendMessage",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: ["task_id", "message", "agent_profile", "speed_mode", "structured_output_schema", "clear_connectors"]
  },
  list_task_messages: {
    procedure: "ListMessages",
    scope: TASKS,
    defaultsToCurrentTask: false,
    arguments: ["task_id", "limit", "cursor", "order"]
  },
  create_project: {
    procedure: "CreateProject",
    scope: PROJECTS,
    defaultsToCurrentTask: false,
    arguments: ["name", "instruction"]
  },
  update_project: {
    procedure: "UpdateProject",
    scope: PROJECTS,
    defaultsToCurrentTask: false,
    arguments: ["project_id", "name", "description", "instruction", "connector_ids", "skill_ids"]
  },
  list_projects: { procedure: "ListProjects", scope: PROJECTS, defaultsToCurrentTask: false, arguments: [] }
};
var MESSAGE_ARGUMENTS = ["content", "connectors", "enable_skills", "force_skills", "task_references"];
var EXECUTION_ENVIRONMENT_ARGUMENTS = ["kind", "device_id", "working_directory", "worktree"];
var MAX_RESPONSE_BYTES = 8 << 20;
var REQUEST_TIMEOUT_MS3 = 30000;
var REPORTED_ERROR_CODES = [
  "invalid_argument",
  "unauthenticated",
  "permission_denied",
  "not_found",
  "already_exists",
  "failed_precondition",
  "resource_exhausted",
  "out_of_range",
  "aborted",
  "canceled"
];
function failure(text) {
  return { isError: true, content: [{ type: "text", text }] };
}
function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function hasOnly(value, allowed) {
  return Object.keys(value).every((key) => allowed.includes(key));
}
function isManusApiTool(name) {
  return Object.hasOwn(manusApiContracts, name);
}
function authorizeCall(params) {
  const sessionId = addonInvocationContextFromToolCall(params)?.sessionId?.trim();
  if (!sessionId)
    return failure("manus api requires a session");
  const meta = isRecord(params) && isRecord(params._meta) ? params._meta : {};
  const grant = readDeviceHostAccess(meta[DEVICE_HOST_ACCESS_META_KEY]);
  if (!grant || grant.addonId !== serverInfo.name || grant.expiresAt <= Date.now() / 1000) {
    return failure("invalid host access");
  }
  return { sessionId, grant };
}
async function callManusApiTool(name, params, fetchImpl = hostFetch) {
  const contract = isManusApiTool(name) ? manusApiContracts[name] : undefined;
  if (!contract)
    return failure("unsupported manus api tool");
  const authorized = authorizeCall(params);
  if (!("grant" in authorized))
    return authorized;
  const raw = isRecord(params) ? params.arguments : undefined;
  if (raw !== undefined && raw !== null && !isRecord(raw))
    return failure("invalid manus api arguments");
  let args = raw ?? {};
  if (!hasOnly(args, contract.arguments))
    return failure("unsupported manus api argument");
  if (name === "create_section" || name === "update_section") {
    if (typeof args.name !== "string")
      return failure("invalid_argument: name is required");
    const sectionName = normalizeSectionName(args.name);
    if (Array.from(sectionName).length < 1 || Array.from(sectionName).length > 80) {
      return failure("invalid_argument: name must contain 1–80 Unicode characters after trimming");
    }
    args = { ...args, name: sectionName };
  }
  if (name === "update_section") {
    if (typeof args.section_id !== "string" || args.section_id.length === 0 || Array.from(args.section_id).length > 128) {
      return failure("invalid_argument: section_id must contain 1–128 characters");
    }
  }
  if (name === "update_task" && args.section_id !== undefined) {
    if (typeof args.section_id !== "string" || Array.from(args.section_id).length > 128) {
      return failure("invalid_argument: section_id must contain at most 128 characters");
    }
    if (Object.keys(args).some((key) => key !== "task_id" && key !== "section_id")) {
      return failure("invalid_argument: send section_id separately from other task settings");
    }
  }
  if (isRecord(args.message) && !hasOnly(args.message, MESSAGE_ARGUMENTS)) {
    return failure("unsupported manus api argument");
  }
  const environment = args.execution_environment;
  if (environment !== undefined && environment !== null) {
    if (!isRecord(environment))
      return failure("invalid manus api execution environment");
    if (!hasOnly(environment, EXECUTION_ENVIRONMENT_ARGUMENTS))
      return failure("unsupported manus api argument");
  }
  if (contract.defaultsToCurrentTask && (args.task_id === undefined || args.task_id === null || args.task_id === "")) {
    args = { ...args, task_id: authorized.sessionId };
  }
  const message = args.message;
  if (isRecord(message) && Array.isArray(message.content)) {
    const content = await uploadContentFiles(authorized.grant, message.content, fetchImpl, UPLOAD_DEADLINE_MS - REQUEST_TIMEOUT_MS3);
    if (typeof content === "string")
      return failure(content);
    args = { ...args, message: { ...message, content } };
  }
  return invokeProcedure(authorized.grant, contract.procedure, args, fetchImpl);
}
async function invokeProcedure(grant, procedure, args, fetchImpl = hostFetch, timeoutMs = REQUEST_TIMEOUT_MS3) {
  const endpoint = grant.endpoint.replace(/\/+$/, "");
  let response;
  try {
    response = await fetchImpl(`${endpoint}/openapi.v2.OpenapiV2Service/${procedure}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${grant.accessToken}`,
        "Content-Type": "application/json",
        "Connect-Protocol-Version": "1"
      },
      body: JSON.stringify(args),
      redirect: "manual",
      signal: AbortSignal.timeout(Math.min(timeoutMs, REQUEST_TIMEOUT_MS3))
    });
  } catch {
    return failure("manus api request unavailable");
  }
  const body = await readLimited(response);
  if (body === undefined)
    return failure("manus api response unavailable; request a smaller page");
  if (response.status !== 200) {
    if (response.status >= 400 && response.status < 500)
      return requestError(body, grant.accessToken);
    return failure("manus api request rejected");
  }
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return failure("invalid manus api response");
  }
  if (!isRecord(data))
    return failure("invalid manus api response");
  return { content: [{ type: "text", text: body }], structuredContent: data };
}
async function readLimited(response) {
  if (!response.body)
    return "";
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;; ) {
      const { done, value } = await reader.read();
      if (done)
        break;
      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) {
        await reader.cancel().catch(() => {});
        return;
      }
      chunks.push(value);
    }
  } catch {
    return;
  }
  return Buffer.concat(chunks).toString("utf8");
}
function requestError(body, token) {
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return failure("manus api request rejected");
  }
  if (!isRecord(payload) || typeof payload.code !== "string" || !REPORTED_ERROR_CODES.includes(payload.code)) {
    return failure("manus api request rejected");
  }
  const message = (typeof payload.message === "string" ? payload.message : "").replaceAll(token, "[redacted]").replace(/\p{Cc}/gu, " ");
  return failure(`${payload.code}: ${Array.from(message).slice(0, 512).join("")}`);
}

// addons/manus-tasks/runtime/tools.ts
var string = { type: "string" };
var boolean = { type: "boolean" };
var strings = { type: "array", items: string };
var order = { type: "string", enum: ["asc", "desc"] };
var sectionID = {
  ...string,
  minLength: 1,
  maxLength: 128,
  description: "An ID returned by list_sections or create_section; do not guess. Resolve duplicate names by ID."
};
var sectionName = {
  ...string,
  minLength: 1,
  pattern: sectionNamePattern,
  description: "Section name, trimmed before saving; 1–80 Unicode characters after trimming. Duplicate names are allowed."
};
var contentPart = {
  oneOf: [
    {
      type: "object",
      properties: { type: { const: "text" }, text: string },
      required: ["type", "text"],
      additionalProperties: false
    },
    ...["file_id", "file_url", "file_data", "file_path"].map((source) => ({
      type: "object",
      properties: {
        type: { type: "string", enum: ["file", "voice"] },
        [source]: { ...string, minLength: 1 },
        filename: { ...string, minLength: 1 },
        mime_type: string
      },
      required: source === "file_data" ? ["type", source, "filename"] : ["type", source],
      additionalProperties: false
    }))
  ]
};
var message = {
  type: "object",
  properties: {
    content: {
      anyOf: [string, { type: "array", minItems: 1, items: contentPart }],
      description: 'Text, or ordered text and file parts. To attach a local file, add {"type":"file","file_path":"<absolute path>"} where it belongs; the tool uploads it before sending (upload_file limits apply) and sends nothing if an upload fails. Do not call upload_file first, and do not paste local paths or signed file URLs into the text. Use file_id parts for files already uploaded with upload_file. If a file_path part fails with "file content part must have one of", nothing was sent and this host predates file_path: call upload_file and send file_id parts instead.'
    },
    connectors: strings,
    enable_skills: strings,
    force_skills: strings,
    task_references: { ...strings, maxItems: 20 }
  },
  required: ["content"],
  additionalProperties: false
};
var agentProfiles = ["lite", "standard", "max", "max-medium", "max-high", "max-extra", "max-ultra"];
var speedModes = ["normal", "fast", "ultrafast"];
function tool(name, description, properties, required = []) {
  return { name, description, inputSchema: { type: "object", properties, required, additionalProperties: false } };
}
var manusApiTools = [
  tool("get_access", "Enable script access to Manus API. The first call asks for approval; refreshes do not. After success, read the API credentials from the terminal environment. The other MCP tools do not require this step.", {}),
  tool("create_task", "Start a separate user-visible Manus task only when the user explicitly asks for a new task or accepts a new-task suggestion; no additional confirmation is needed then. Otherwise continue in the current task, using internal subagents/workflow as appropriate. Duration, complexity, parallelism and a new execution phase do not justify creating a task. Defaults to the current device, working directory, Project and agent profile (including Max thinking level), plus current Skills, Connectors and Addons (including connector_mcp). Explicit fields override those defaults. Include all instructions and context it needs; it does not inherit this conversation.", {
    message,
    title: {
      ...string,
      description: "Omit by default so Manus generates the task title. Set only when the user explicitly specifies a title."
    },
    project_id: {
      ...string,
      description: "Omit to inherit the current Project. Set an ID to override, or an empty string for no Project."
    },
    execution_environment: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["device", "sandbox"] },
        device_id: { ...string, minLength: 1 },
        working_directory: { ...string, minLength: 1 },
        worktree: {
          ...boolean,
          description: "true runs the new task in its own Git worktree, like the worktree option when creating a task. Omit or false shares the directory."
        }
      },
      additionalProperties: false,
      description: "Omit to inherit the current device and directory. kind=device requires an inherited device or an explicit authorized device_id. working_directory also requires a device; a sandbox source must supply device_id. Changing device without a directory uses its default workspace. kind=sandbox creates a fresh sandbox and forbids device_id/working_directory/worktree. worktree=true creates the worktree from working_directory, or else from the current task's selected folder rather than its current worktree; that folder must be a Git repository root on a Desktop. A sandbox, another device type or a missing folder is rejected, and the task pauses if the worktree cannot be prepared; it never falls back to the shared folder. If a call with worktree fails with 'unsupported manus api argument', the Manus Desktop app is too old for it: ask the user to update the app. Use only when the user specifies another target or asks for a separate worktree, including through project instructions."
    },
    locale: string,
    interactive_mode: boolean,
    hide_in_task_list: boolean,
    share_visibility: { type: "string", enum: ["private", "team", "public"] },
    agent_profile: {
      type: "string",
      enum: agentProfiles,
      description: "Omit to inherit the current task profile and Max thinking level. Set only when the user asks for a mode; max-<level> picks the Max thinking level."
    },
    speed_mode: {
      type: "string",
      enum: speedModes,
      description: "Omit to inherit the current task speed mode. Set only when the user asks for one; fast and ultrafast apply to Max tasks."
    },
    structured_output_schema: { type: "object" }
  }, ["message"]),
  tool("update_task", "Rename, hide, share, archive, pin or favorite a Manus task, or move it into, between or out of a Project or Section. Omit task_id for the current task; supply an ID for another task. pinned and favorite apply to any task you can access; other settings, including project_id, section_id and is_archived, require a task you own. Provide at least one setting; omitted settings stay unchanged. Change only what the user requested. For a Section move, call list_sections to resolve the name first; if names repeat, ask the user to choose an ID. Update section_id separately from other settings, including pinned. Move from section A to B by setting B’s ID directly; use an empty string to move out. An update_task success response confirms the change. Optionally compare section_id or your personal pinned status in an already retrieved list; do not paginate just to verify a move. Missing optional read-back does not negate a successful update. If a call with is_archived or section_id fails with 'unsupported manus api argument' on Manus Desktop, the task was not changed and the app is too old for that setting: ask the user to update the app. Elsewhere, that error means an argument outside this schema; correct the arguments instead. No get_access call is needed.", {
    task_id: { ...string, minLength: 1, description: "Omit to update the current task." },
    title: { ...string, minLength: 1 },
    enable_visible_in_task_list: {
      ...boolean,
      description: "Set false to hide the task from the task list, or true to show it again."
    },
    share_visibility: { type: "string", enum: ["private", "team", "public"] },
    section_id: {
      ...string,
      maxLength: 128,
      description: "Use an ID returned by list_sections or create_section; do not guess. Set an empty string to remove the task from its section, or the destination ID to move between sections. The task keeps its Project. Send section_id in its own request, without any other setting."
    },
    pinned: { ...boolean, description: "Set true to pin the task, or false to unpin it." },
    favorite: { ...boolean, description: "Add the task to or remove it from your favorites." },
    project_id: {
      ...string,
      maxLength: 65,
      description: "Move the task to this Project, using an ID returned by list_projects, or pass an empty string to remove it from its Project. The task keeps its Section."
    },
    is_archived: {
      ...boolean,
      description: "Set true to archive the task or false to unarchive it. Archive only when the user asks to archive; hiding is enable_visible_in_task_list. Agent tasks and their subtasks cannot be archived: report that error and do not hide the task instead."
    }
  }),
  tool("list_tasks", 'List accessible tasks, including IDs, status, current section_id (omitted when the task is not in a custom Section), your personal pinned boolean (true means pinned, false means unpinned), and your personal is_unread boolean (true means the task has new results you have not opened in Manus). Use these returned fields to inspect section membership, pin state or unread results; section_id, pinned and is_unread are not filter parameters. Listing tasks does not mark them as read. To filter by Project, pass both scope="project" and project_id; project_id alone does not filter. Follow next_cursor to retrieve another page. Use list_sections to resolve section IDs to names.', {
    limit: { type: "integer", minimum: 1, maximum: 100 },
    cursor: string,
    order,
    scope: {
      type: "string",
      enum: ["all", "agent_subtask", "project", "standard"],
      description: 'Defaults to all. For a specific Project, set scope="project" and supply project_id.'
    },
    agent_id: string,
    project_id: { ...string, description: 'Required when scope="project"; ignored for other scopes.' },
    oauth_client_id: string,
    api_key_id: string,
    is_archived: {
      ...boolean,
      description: "Set true to list only archived tasks or false to exclude them. Omit to include both."
    }
  }),
  tool("list_sections", "List your custom Manus sidebar Sections with IDs and names. These are personal task-list Sections, not Projects or default sidebar partitions. Call this before moving a task or renaming a section by name. Duplicate names are allowed; ask the user to choose an ID if ambiguous. Do not guess IDs. No get_access call is needed.", {}),
  tool("create_section", "Create a personal custom Manus sidebar section only when requested by the user. Names are trimmed and limited to 1–80 Unicode characters; at most 50 custom sections are allowed. Duplicate names are allowed. Returns section with id and name; use that ID for later operations. Creating a section does not move tasks or create a Project. No get_access call is needed.", { name: sectionName }, ["name"]),
  tool("update_section", "Rename one of your custom Manus sidebar sections when requested by the user. Default sidebar partitions cannot be renamed. Resolve its ID with list_sections first; duplicate names require the user to choose an ID. Names are trimmed and limited to 1–80 Unicode characters. Returns section with id and name. This does not move tasks, change Projects, or change pin state. No get_access call is needed.", { section_id: sectionID, name: sectionName }, ["section_id", "name"]),
  tool("send_task_message", "Send instructions to another accessible task. This may resume its execution and does not ask for an additional confirmation.", {
    task_id: string,
    message,
    agent_profile: {
      type: "string",
      enum: agentProfiles,
      description: "Omit to keep the target task profile and Max thinking level. Set only when the user asks to switch; max-<level> picks the Max thinking level."
    },
    speed_mode: {
      type: "string",
      enum: speedModes,
      description: "Omit to keep the target task speed mode. Set only when the user asks to switch; fast and ultrafast apply to Max tasks."
    },
    structured_output_schema: { type: "object" },
    clear_connectors: boolean
  }, ["task_id", "message"]),
  tool("list_task_messages", "Read the public message history of an accessible task. Follow next_cursor for another page.", {
    task_id: string,
    limit: { type: "integer", minimum: 1, maximum: 200 },
    cursor: string,
    order
  }, ["task_id"]),
  tool("upload_file", "Upload local files once to reuse them in several create_task or send_task_message calls; to attach files to one message, use file_path parts in that message instead. Accepts absolute paths readable on this computer, up to 20 files of at most 512 MB each, and returns a file_id per path. Each file must finish uploading within 3 minutes, and each file_id expires after 48 hours.", {
    paths: {
      type: "array",
      minItems: 1,
      maxItems: 20,
      items: { ...string, minLength: 1 },
      description: "Absolute local file paths, each with a file extension. Executables, scripts and installers (such as .exe, .sh, .bat, .dmg, .pkg) are rejected."
    }
  }, ["paths"]),
  tool("create_project", "Create a Manus project without an additional confirmation.", {
    name: string,
    instruction: string
  }, ["name"]),
  tool("update_project", "Update an accessible project without an additional confirmation. Omitted or null fields remain unchanged. connector_ids and skill_ids replace the entire list; an empty array clears it. For additions or removals, obtain the current complete list first; project summaries do not contain it. Do not guess existing IDs. A complete replacement explicitly supplied by the user can be applied directly.", {
    project_id: string,
    name: { type: ["string", "null"] },
    description: { type: ["string", "null"] },
    instruction: { type: ["string", "null"] },
    connector_ids: { type: ["array", "null"], items: string, maxItems: 500 },
    skill_ids: { type: ["array", "null"], items: string, maxItems: 50 }
  }, ["project_id"]),
  tool("list_projects", "List accessible Manus projects.", {})
];

// addons/manus-tasks/runtime/server.ts
var server2 = createMcpServer({
  serverInfo,
  listTools: () => manusApiTools,
  callTool: async (id, params, io) => {
    const name = String(params?.name ?? "");
    if (!manusApiTools.some((tool2) => tool2.name === name)) {
      io.fail(id, -32602, `unknown tool: ${name}`);
      return;
    }
    if (name === "get_access")
      io.respond(id, accessResult());
    else if (name === UPLOAD_FILE_TOOL)
      io.respond(id, await callUploadFileTool(params));
    else
      io.respond(id, await callManusApiTool(name, params));
  }
});
server2.start();
