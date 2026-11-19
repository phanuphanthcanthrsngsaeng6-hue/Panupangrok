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
// src/shared/contracts.ts
var ADDON_VERSION = "0.1.5";
var MAX_EXPIRY_HOURS = 24 * 7;
var MAX_FILE_BYTES = 1024 * 1024 * 1024;

// node_modules/@manus/addon-kit/packages/addon-tools/src/backend/runtime-auth.ts
import crypto from "node:crypto";
var SUBJECT_TOKEN_META_KEY = "ai.manus/subjectToken";
var runtimeSessionRefreshMarginMs = 60000;
var maxCachedSessions = 8;
function subjectTokenFromToolCall(params) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return "";
  }
  const meta = params._meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return "";
  }
  const token = meta[SUBJECT_TOKEN_META_KEY];
  return typeof token === "string" ? token.trim() : "";
}
function subjectCacheKey(subjectToken) {
  return crypto.createHash("sha256").update(subjectToken).digest("base64url");
}
function canOpenRuntimeConnection(credential, now = Date.now()) {
  return credential.expiresAtMs - now > runtimeSessionRefreshMarginMs;
}

class RuntimeSessionCache {
  bootstrap;
  sessions = new Map;
  inFlight = new Map;
  constructor(bootstrap) {
    this.bootstrap = bootstrap;
  }
  async get(subjectToken) {
    const token = subjectToken.trim();
    if (!token) {
      throw new Error("missing_subject_token");
    }
    const cacheKey = subjectCacheKey(token);
    const cached = this.sessions.get(cacheKey);
    if (cached && canOpenRuntimeConnection(cached)) {
      return cached;
    }
    const pending = this.inFlight.get(cacheKey);
    if (pending) {
      return pending;
    }
    const request = this.bootstrap(token).then((session) => {
      if (!session.token || !Number.isFinite(session.expiresAtMs) || session.expiresAtMs <= Date.now()) {
        throw new Error("invalid_runtime_session");
      }
      const credential = { cacheKey, ...session };
      this.sessions.set(cacheKey, credential);
      this.prune();
      return credential;
    }).finally(() => this.inFlight.delete(cacheKey));
    this.inFlight.set(cacheKey, request);
    return request;
  }
  invalidate(credential) {
    if (credential && this.sessions.get(credential.cacheKey)?.token === credential.token) {
      this.sessions.delete(credential.cacheKey);
    }
  }
  prune() {
    const now = Date.now();
    for (const [key, credential] of this.sessions) {
      if (credential.expiresAtMs <= now) {
        this.sessions.delete(key);
      }
    }
    while (this.sessions.size > maxCachedSessions) {
      const oldest = this.sessions.keys().next().value;
      if (typeof oldest !== "string")
        break;
      this.sessions.delete(oldest);
    }
  }
}
// node_modules/@manus/addon-kit/packages/addon-tools/src/backend/addonServerClient.ts
import { AsyncLocalStorage } from "node:async_hooks";
class AddonServerClient {
  endpoint;
  bootstrapTimeoutMs;
  writeTimeoutMs;
  readTimeoutMs;
  authContext = new AsyncLocalStorage;
  runtimeSessions;
  lastKnownAddonVersion;
  constructor(options) {
    this.endpoint = options.endpoint.replace(/\/$/, "");
    this.bootstrapTimeoutMs = options.bootstrapTimeoutMs ?? options.requestTimeoutMs ?? 5000;
    this.writeTimeoutMs = options.writeTimeoutMs ?? options.requestTimeoutMs ?? 15000;
    this.readTimeoutMs = options.readTimeoutMs ?? options.requestTimeoutMs ?? 5000;
    this.runtimeSessions = new RuntimeSessionCache((subjectToken) => this.bootstrap(subjectToken));
  }
  async runWithSubjectToken(subjectToken, task) {
    const token = String(subjectToken ?? "").trim();
    if (!token)
      throw new Error("missing_subject_token");
    const credential = await this.runtimeSessions.get(token);
    return this.authContext.run({ subjectToken: token, credential }, task);
  }
  currentCredential() {
    const state = this.authContext.getStore();
    if (!state)
      throw new Error("missing_subject_token");
    return state.credential;
  }
  addonVersion() {
    return this.lastKnownAddonVersion;
  }
  canReconnect(credential) {
    return canOpenRuntimeConnection(credential);
  }
  invalidateCredential(credential) {
    this.runtimeSessions.invalidate(credential);
  }
  onWriteConflictResponse(_pathname, _body) {}
  async bootstrap(subjectToken) {
    const controller = new AbortController;
    const timeout = setTimeout(() => controller.abort(), this.bootstrapTimeoutMs);
    try {
      const response = await fetch(`${this.endpoint}/api/v1/runtime/bootstrap`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${subjectToken}`
        },
        body: JSON.stringify({}),
        signal: controller.signal
      });
      if (!response.ok) {
        const details = await response.text().catch(() => "");
        throw new Error(`runtime_bootstrap_http_${response.status}${details ? `: ${details}` : ""}`);
      }
      const payload = await response.json().catch(() => {
        return;
      });
      const token = String(payload?.token ?? "");
      const expiresInSeconds = Number(payload?.expires_in_seconds ?? payload?.expiresInSeconds ?? 0);
      if (!token) {
        throw new Error("runtime_bootstrap_missing_session");
      }
      const addonVersion = payload?.addon_version ?? payload?.addonVersion;
      if (typeof addonVersion === "string" && addonVersion) {
        this.lastKnownAddonVersion = addonVersion;
      }
      return {
        token,
        expiresAtMs: Date.now() + (expiresInSeconds > 0 ? expiresInSeconds : 300) * 1000
      };
    } catch (error) {
      throw new Error(`runtime_bootstrap_failed: ${error instanceof Error ? error.message : error}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  authHeaders(credential = this.currentCredential()) {
    return { authorization: `Bearer ${credential.token}` };
  }
  async refreshCredentialAfterUnauthorized(rejectedCredential) {
    const state = this.authContext.getStore();
    if (!state)
      throw new Error("missing_subject_token");
    if (state.credential.token !== rejectedCredential.token) {
      return state.credential;
    }
    this.runtimeSessions.invalidate(rejectedCredential);
    const refreshed = await this.runtimeSessions.get(state.subjectToken);
    if (state.credential.token === rejectedCredential.token) {
      state.credential = refreshed;
    }
    return state.credential;
  }
  async post(pathname, body, requestTimeoutMs = this.writeTimeoutMs) {
    for (let attempt = 0;attempt < 2; attempt += 1) {
      const controller = new AbortController;
      const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
      const credential = this.currentCredential();
      try {
        const response = await fetch(`${this.endpoint}${pathname}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...this.authHeaders(credential)
          },
          body: JSON.stringify(body ?? {}),
          signal: controller.signal
        });
        if (!response.ok) {
          if (response.status === 401 && attempt === 0) {
            await response.body?.cancel().catch(() => {
              return;
            });
            await this.refreshCredentialAfterUnauthorized(credential);
            continue;
          }
          if (response.status === 401) {
            this.runtimeSessions.invalidate(credential);
          }
          const details = await response.text().catch(() => "");
          if (response.status === 409) {
            this.onWriteConflictResponse(pathname, body);
          }
          throw new Error(`Addon Server returned HTTP ${response.status}${details ? `: ${details}` : ""}`);
        }
        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(`Addon Server request timed out: POST ${pathname}`);
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new Error("Addon Server request retry exhausted");
  }
  async get(pathname) {
    for (let attempt = 0;attempt < 2; attempt += 1) {
      const controller = new AbortController;
      const timeout = setTimeout(() => controller.abort(), this.readTimeoutMs);
      const credential = this.currentCredential();
      try {
        const response = await fetch(`${this.endpoint}${pathname}`, {
          method: "GET",
          headers: this.authHeaders(credential),
          signal: controller.signal
        });
        if (!response.ok) {
          if (response.status === 401 && attempt === 0) {
            await response.body?.cancel().catch(() => {
              return;
            });
            await this.refreshCredentialAfterUnauthorized(credential);
            continue;
          }
          if (response.status === 401) {
            this.runtimeSessions.invalidate(credential);
          }
          const details = await response.text().catch(() => "");
          throw new Error(`Addon Server returned HTTP ${response.status}${details ? `: ${details}` : ""}`);
        }
        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(`Addon Server request timed out: GET ${pathname}`);
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new Error("Addon Server request retry exhausted");
  }
}
// src/shared/environment.ts
function environmentFlag(env, key) {
  const value = env[key];
  if (value === undefined || value === "0" || value === "false")
    return false;
  if (value === "1" || value === "true")
    return true;
  throw new Error("invalid_boolean_configuration");
}

// src/mcp/client.ts
class AuthenticatedHandoffApi extends AddonServerClient {
  create(input) {
    return this.post("/api/v1/handoffs", input);
  }
  complete(handoffId, input) {
    return this.post(`/api/v1/handoffs/${encodeURIComponent(handoffId)}/complete`, input);
  }
  inspect(handoffId) {
    return this.get(`/api/v1/handoffs/${encodeURIComponent(handoffId)}`);
  }
  download(handoffId) {
    return this.post(`/api/v1/handoffs/${encodeURIComponent(handoffId)}/download`, {});
  }
}

class LocalHandoffApi {
  endpoint;
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  create(input) {
    return this.request("POST", "/api/v1/handoffs", input);
  }
  complete(handoffId, input) {
    return this.request("POST", `/api/v1/handoffs/${encodeURIComponent(handoffId)}/complete`, input);
  }
  inspect(handoffId) {
    return this.request("GET", `/api/v1/handoffs/${encodeURIComponent(handoffId)}`);
  }
  download(handoffId) {
    return this.request("POST", `/api/v1/handoffs/${encodeURIComponent(handoffId)}/download`, {});
  }
  async request(method, pathname, body) {
    const response = await fetch(`${this.endpoint}${pathname}`, {
      method,
      headers: {
        "content-type": "application/json",
        "x-handoff-local-dev": "1"
      },
      ...body === undefined ? {} : { body: JSON.stringify(body) },
      redirect: "error"
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => {
        return;
      });
      throw new Error(typeof payload?.error === "string" ? payload.error : `handoff_server_http_${response.status}`);
    }
    return await response.json();
  }
}
function createHandoffApiRunner(env = process.env) {
  const endpoint = normalizeEndpoint(env.HANDOFF_SERVER_ENDPOINT ?? env.ADDON_SERVER_ENDPOINT);
  if (environmentFlag(env, "HANDOFF_LOCAL_DEV") && env.NODE_ENV !== "production") {
    const local = new LocalHandoffApi(endpoint);
    return async (_params, task) => task(local);
  }
  const authenticated = new AuthenticatedHandoffApi({ endpoint });
  return async (params, task) => {
    const subjectToken = subjectTokenFromToolCall(params);
    if (!subjectToken)
      throw new Error("missing_subject_token");
    return authenticated.runWithSubjectToken(subjectToken, () => task(authenticated));
  };
}
function normalizeEndpoint(value) {
  if (!value) {
    throw new Error("HANDOFF_SERVER_ENDPOINT or ADDON_SERVER_ENDPOINT is required");
  }
  const url = new URL(value);
  const loopback = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback) || url.username || url.password || url.search || url.hash) {
    throw new Error("Handoff server endpoint must be HTTPS or loopback HTTP");
  }
  return url.toString().replace(/\/$/, "");
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
// src/mcp/workspaceFiles.ts
import crypto2 from "node:crypto";
import fs, { constants } from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { finished } from "node:stream/promises";
var TRANSFER_TIMEOUT_MS = 30 * 60 * 1000;
async function uploadWorkspaceFile(workingDirectory, relativePath, createGrant) {
  const root = await fsp.realpath(workingDirectory);
  const candidate = await resolveSource(root, relativePath);
  const noFollow = "O_NOFOLLOW" in constants ? constants.O_NOFOLLOW : 0;
  const handle = await fsp.open(candidate, constants.O_RDONLY | noFollow);
  let source;
  let meter;
  let failed = false;
  try {
    const initial = await handle.stat();
    if (!initial.isFile())
      throw new Error("source_must_be_regular_file");
    const grant = await createGrant({
      name: path.basename(candidate),
      sizeBytes: initial.size
    });
    if (grant.method !== "PUT")
      throw new Error("invalid_upload_grant");
    const hash = crypto2.createHash("sha256");
    let bytes = 0;
    meter = new Transform({
      transform(chunk, _encoding, callback) {
        bytes += chunk.length;
        hash.update(chunk);
        callback(null, chunk);
      }
    });
    source = fs.createReadStream(candidate, {
      fd: handle.fd,
      autoClose: false
    });
    source.on("error", (error) => meter?.destroy(error));
    const body = Readable.toWeb(source.pipe(meter));
    const request = {
      method: grant.method,
      headers: grant.headers,
      body,
      redirect: "error",
      duplex: "half",
      signal: AbortSignal.timeout(TRANSFER_TIMEOUT_MS)
    };
    let response;
    try {
      response = await fetch(grant.url, request);
    } catch (error) {
      const after2 = await handle.stat().catch(() => {
        return;
      });
      if (isContentLengthMismatch(error) || after2 && sourceMetadataChanged(initial, after2)) {
        throw new Error("source_changed_during_upload");
      }
      throw error;
    }
    if (!response.ok)
      throw new Error("storage_upload_failed");
    const after = await handle.stat();
    if (bytes !== initial.size || sourceMetadataChanged(initial, after)) {
      throw new Error("source_changed_during_upload");
    }
    return {
      name: path.basename(candidate),
      sizeBytes: bytes,
      sha256: hash.digest("hex")
    };
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    source?.destroy();
    meter?.destroy();
    await Promise.all([
      source ? finished(source).catch(() => {
        return;
      }) : undefined,
      meter ? finished(meter).catch(() => {
        return;
      }) : undefined
    ]);
    try {
      await handle.close();
    } catch (error) {
      if (!failed && error.code !== "EBADF")
        throw error;
    }
  }
}
function sourceMetadataChanged(initial, after) {
  return after.size !== initial.size || after.mtimeMs !== initial.mtimeMs;
}
function isContentLengthMismatch(error) {
  let current = error;
  for (let depth = 0;depth < 4 && current; depth += 1) {
    if (typeof current === "object" && "code" in current && current.code === "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH") {
      return true;
    }
    current = typeof current === "object" && "cause" in current ? current.cause : undefined;
  }
  return false;
}
async function receiveWorkspaceFile(input) {
  const root = await fsp.realpath(input.workingDirectory);
  const { target, createdDirectories } = await resolveDestination(root, input.destination);
  const parent = path.dirname(target);
  const temporary = path.join(parent, `.handoff-${crypto2.randomUUID()}.tmp`);
  let handle;
  let promoted = false;
  try {
    handle = await fsp.open(temporary, "wx", 384);
    if (input.grant.method !== "GET")
      throw new Error("invalid_download_grant");
    const response = await fetch(input.grant.url, {
      method: input.grant.method,
      headers: input.grant.headers,
      redirect: "error",
      signal: AbortSignal.timeout(TRANSFER_TIMEOUT_MS)
    });
    if (!response.ok || !response.body)
      throw new Error("storage_download_failed");
    const hash = crypto2.createHash("sha256");
    let bytes = 0;
    const reader = response.body.getReader();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done)
        break;
      bytes += chunk.value.byteLength;
      if (bytes > input.expectedSize)
        throw new Error("download_size_mismatch");
      hash.update(chunk.value);
      await writeAll(handle, chunk.value);
    }
    await handle.sync();
    await handle.close();
    if (bytes !== input.expectedSize)
      throw new Error("download_size_mismatch");
    if (hash.digest("hex") !== input.expectedSha256)
      throw new Error("download_hash_mismatch");
    await fsp.chmod(temporary, 438 & ~process.umask());
    await fsp.link(temporary, target);
    await fsp.unlink(temporary);
    promoted = true;
    return target;
  } finally {
    await handle?.close().catch(() => {
      return;
    });
    if (!promoted) {
      await fsp.rm(temporary, { force: true }).catch(() => {
        return;
      });
      await removeEmptyDirectories(createdDirectories);
    }
  }
}
async function resolveSource(root, input) {
  const candidate = lexicalPath(root, input);
  await assertNoSymlinkComponents(root, path.dirname(candidate));
  const stat = await fsp.lstat(candidate);
  if (stat.isSymbolicLink())
    throw new Error("source_symlink_not_allowed");
  if (!stat.isFile())
    throw new Error("source_must_be_regular_file");
  const canonical = await fsp.realpath(candidate);
  if (!inside(root, canonical))
    throw new Error("path_outside_workspace");
  return canonical;
}
async function resolveDestination(root, input) {
  const candidate = lexicalPath(root, input);
  const createdDirectories = await ensureDestinationDirectory(root, path.dirname(candidate));
  try {
    const parent = await fsp.realpath(path.dirname(candidate));
    if (!inside(root, parent))
      throw new Error("path_outside_workspace");
    const target = path.join(parent, path.basename(candidate));
    try {
      await fsp.lstat(target);
      throw new Error("destination_exists");
    } catch (error) {
      if (error.code !== "ENOENT")
        throw error;
    }
    return { target, createdDirectories };
  } catch (error) {
    await removeEmptyDirectories(createdDirectories);
    throw error;
  }
}
async function ensureDestinationDirectory(root, candidate) {
  const relative = path.relative(root, candidate);
  if (!relative || relative === ".")
    return [];
  const createdDirectories = [];
  let current = root;
  try {
    for (const component of relative.split(path.sep)) {
      current = path.join(current, component);
      let stat;
      try {
        stat = await fsp.lstat(current);
      } catch (error) {
        if (error.code !== "ENOENT")
          throw error;
        try {
          await fsp.mkdir(current);
          createdDirectories.push(current);
        } catch (mkdirError) {
          if (mkdirError.code !== "EEXIST")
            throw mkdirError;
        }
        stat = await fsp.lstat(current);
      }
      if (stat.isSymbolicLink())
        throw new Error("workspace_symlink_not_allowed");
      if (!stat.isDirectory())
        throw new Error("destination_parent_not_directory");
    }
    return createdDirectories;
  } catch (error) {
    await removeEmptyDirectories(createdDirectories);
    throw error;
  }
}
async function removeEmptyDirectories(directories) {
  for (const directory of [...directories].reverse()) {
    await fsp.rmdir(directory).catch(() => {
      return;
    });
  }
}
function lexicalPath(root, input) {
  const value = String(input ?? "").trim();
  if (!value || value.includes("\x00") || path.isAbsolute(value))
    throw new Error("relative_workspace_path_required");
  const candidate = path.resolve(root, value);
  if (!inside(root, candidate))
    throw new Error("path_outside_workspace");
  return candidate;
}
function inside(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}
async function assertNoSymlinkComponents(root, candidate) {
  const relative = path.relative(root, candidate);
  if (!relative || relative === ".")
    return;
  let current = root;
  for (const component of relative.split(path.sep)) {
    current = path.join(current, component);
    const stat = await fsp.lstat(current);
    if (stat.isSymbolicLink())
      throw new Error("workspace_symlink_not_allowed");
  }
}
async function writeAll(handle, value) {
  let offset = 0;
  while (offset < value.byteLength) {
    const { bytesWritten } = await handle.write(value, offset, value.byteLength - offset);
    if (bytesWritten <= 0)
      throw new Error("destination_write_failed");
    offset += bytesWritten;
  }
}

// src/mcp/operations.ts
function createHandoffOperations(runWithApi) {
  return {
    async create(params) {
      const context = requireWorkspace(params);
      const args = argumentsFrom(params);
      const path2 = requiredString(args.path, "path_required");
      const expiresInHours = args.expires_in_hours === undefined ? undefined : requiredInteger(args.expires_in_hours, "invalid_expiry");
      return runWithApi(params, async (api) => {
        let created;
        const uploaded = await uploadWorkspaceFile(context.workingDirectory, path2, async (file) => {
          created = await api.create({
            name: file.name,
            size_bytes: file.sizeBytes,
            content_type: "application/octet-stream",
            ...expiresInHours === undefined ? {} : { expires_in_hours: expiresInHours }
          });
          return created.upload;
        });
        if (!created)
          throw new Error("handoff_create_failed");
        const ready = await api.complete(created.handoff_id, {
          size_bytes: uploaded.sizeBytes,
          sha256: uploaded.sha256
        });
        return {
          handoff_id: ready.handoff_id,
          name: ready.name,
          size_bytes: ready.size_bytes,
          sha256: ready.sha256,
          expires_at: ready.expires_at
        };
      });
    },
    async receive(params) {
      const context = requireWorkspace(params);
      const args = argumentsFrom(params);
      const handoffId = requiredString(args.handoff_id, "handoff_id_required");
      return runWithApi(params, async (api) => {
        const handoff = await api.download(handoffId);
        if (!handoff.sha256 || handoff.status !== "ready")
          throw new Error("handoff_unavailable");
        const destination = args.destination === undefined ? handoff.name : requiredString(args.destination, "destination_required");
        const localPath = await receiveWorkspaceFile({
          workingDirectory: context.workingDirectory,
          destination,
          expectedSize: handoff.size_bytes,
          expectedSha256: handoff.sha256,
          grant: handoff.download
        });
        return {
          handoff_id: handoff.handoff_id,
          path: localPath,
          size_bytes: handoff.size_bytes,
          sha256_verified: true
        };
      });
    },
    async inspect(params) {
      const args = argumentsFrom(params);
      const handoffId = requiredString(args.handoff_id, "handoff_id_required");
      return runWithApi(params, (api) => api.inspect(handoffId));
    }
  };
}
function requireWorkspace(params) {
  const context = addonInvocationContextFromToolCall(params);
  if (!context?.workingDirectory)
    throw new Error("workspace_context_required");
  return { workingDirectory: context.workingDirectory };
}
function argumentsFrom(params) {
  if (!params || typeof params !== "object" || Array.isArray(params))
    return {};
  const args = params.arguments;
  return args && typeof args === "object" && !Array.isArray(args) ? args : {};
}
function requiredString(value, code) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(code);
  return value.trim();
}
function requiredInteger(value, code) {
  const number = Number(value);
  if (!Number.isInteger(number))
    throw new Error(code);
  return number;
}

// src/mcp/server.ts
var tools = [
  {
    name: "handoff.create",
    description: "Privately stage one regular file from the current workspace and return a temporary handoff ID.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File path relative to the current session workspace."
        },
        expires_in_hours: {
          type: "integer",
          minimum: 1,
          maximum: 168,
          default: 24
        }
      },
      required: ["path"],
      additionalProperties: false
    }
  },
  {
    name: "handoff.receive",
    description: "Download a private handoff into the current workspace after size and SHA-256 verification.",
    inputSchema: {
      type: "object",
      properties: {
        handoff_id: { type: "string" },
        destination: {
          type: "string",
          description: "Optional relative destination; defaults to the original file name."
        }
      },
      required: ["handoff_id"],
      additionalProperties: false
    }
  },
  {
    name: "handoff.inspect",
    description: "Inspect owner-visible metadata and readiness for a temporary handoff without downloading it.",
    inputSchema: {
      type: "object",
      properties: { handoff_id: { type: "string" } },
      required: ["handoff_id"],
      additionalProperties: false
    }
  }
];
function createServer(env = process.env) {
  const operations = createHandoffOperations(createHandoffApiRunner(env));
  return createMcpServer({
    serverInfo: { name: "handoff", version: ADDON_VERSION },
    listTools: () => tools,
    callTool: async (id, params, io) => {
      const name = String(params?.name ?? "");
      try {
        const result = name === "handoff.create" ? await operations.create(params) : name === "handoff.receive" ? await operations.receive(params) : name === "handoff.inspect" ? await operations.inspect(params) : undefined;
        if (!result) {
          io.fail(id, -32602, `unknown tool: ${name}`);
          return;
        }
        io.respond(id, {
          content: [{ type: "text", text: JSON.stringify(result) }],
          structuredContent: result
        });
      } catch (error) {
        const code = safeToolError(error);
        io.respond(id, {
          content: [{ type: "text", text: code }],
          structuredContent: { error: code },
          isError: true
        });
      }
    }
  });
}
function safeToolError(error) {
  const message = error instanceof Error ? error.message : "handoff_failed";
  const embedded = /["']error["']\s*:\s*["']([a-z][a-z0-9_]{0,63})["']/.exec(message)?.[1];
  const code = embedded ?? message;
  return /^[a-z][a-z0-9_]{0,63}$/.test(code) ? code : "handoff_failed";
}
createServer().start();
export {
  createServer
};

//# debugId=37F848F619BB1CF864756E2164756E21
