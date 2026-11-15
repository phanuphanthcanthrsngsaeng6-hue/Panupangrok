// Manus API v2 client - shared by the CLI and the bridge server.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PKG_DIR = path.join(__dirname, '..');

export const API_BASE = (process.env.MANUS_API_BASE || 'https://api.manus.ai/v2').replace(/\/+$/, '');

// Manus agent profiles (per open.manus.ai/docs/v2/task.create).
// Canonical: standard (default) | lite | max, with max thinking levels.
// Version segments (1.6-, 2.0-, manus-1.6-) are IGNORED by Manus: the model
// version is not selectable. Free personal accounts are downgraded to "lite".
export const MODELS = {
  // canonical values, accepted verbatim
  standard: 'standard',
  lite: 'lite',
  max: 'max',
  'max-medium': 'max-medium',
  'max-high': 'max-high',
  'max-extra': 'max-extra',
  'max-ultra': 'max-ultra',
  // versioned aliases (the version segment is ignored upstream)
  'manus-1.6': 'standard',
  '1.6': 'standard',
  '2.0': 'standard',
  'manus-2.0': 'standard',
  '1.6-standard': 'standard',
  '1.6-lite': 'lite',
  'manus-1.6-lite': 'lite',
  '2.0-lite': 'lite',
  'manus-2.0-lite': 'lite',
  '2.0-standard': 'standard',
  'manus-2.0-standard': 'standard',
  '2.0-max': 'max',
  'manus-2.0-max': 'max',
  '2.0-max-medium': 'max-medium',
  'manus-2.0-max-medium': 'max-medium',
  '2.0-max-high': 'max-high',
  'manus-2.0-max-high': 'max-high',
  '2.0-max-extra': 'max-extra',
  'manus-2.0-max-extra': 'max-extra',
  '2.0-max-ultra': 'max-ultra',
  'manus-2.0-max-ultra': 'max-ultra',
  // short helpers
  'manus-lite': 'lite',
  'manus-standard': 'standard',
  'manus-max': 'max',
};

export const DEFAULT_MODEL = 'manus-2.0-lite';

/**
 * Map a requested model id to a Manus agent_profile.
 * Falls back to the pattern in the Manus docs so any `x.y[-suffix]` form works,
 * e.g. `2.0-max`, `manus-1.6-lite`, `1.6` (-> standard).
 */
export function profileForModel(model) {
  if (model && MODELS[model]) return MODELS[model];
  const m = String(model || '').toLowerCase().replace(/^manus-/, '');
  const match = m.match(/^(?:[0-9]+(?:\.[0-9]+)*)?(?:-?(standard|lite|max(?:-(?:medium|high|extra|ultra))?))?$/);
  if (match && match[1]) return match[1];
  return MODELS[DEFAULT_MODEL];
}
export const TERMINAL_STATUS = new Set(['stopped', 'completed', 'failed', 'error']);

export function envCandidates() {
  return [
    path.join(PKG_DIR, '.env'),
    path.join(PKG_DIR, '..', '.env'),
    path.join(os.homedir(), 'NovaAgent-Terminal', '.env'),
    path.join(os.homedir(), '.env'),
    path.join(process.cwd(), '.env'),
  ];
}

export function resolveApiKey() {
  const fromEnv = (process.env.MANUS_API_KEY || '').trim();
  if (fromEnv) return fromEnv;
  for (const file of envCandidates()) {
    try {
      if (!fs.existsSync(file)) continue;
      for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*(?:export\s+)?MANUS_API_KEY\s*=\s*(.*)$/);
        if (m) return m[1].trim().replace(/^["']|["']$/g, '');
      }
    } catch {
      // ignore unreadable candidate
    }
  }
  return '';
}

export function hasApiKey() {
  return Boolean(resolveApiKey());
}

export async function apiCall(method, endpoint, { params, body, apiKey, timeoutMs = 60000 } = {}) {
  const key = apiKey || resolveApiKey();
  if (!key) throw new Error('MANUS_API_KEY not set (environment or .env)');
  const url = new URL(`${API_BASE}/${endpoint.replace(/^\/+/, '')}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        'x-manus-api-key': key,
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error(`Timeout after ${timeoutMs}ms on ${endpoint}`);
    throw new Error(`Network error on ${endpoint}: ${err.message}`);
  }
  clearTimeout(timer);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${endpoint}: ${text.slice(0, 400)}`);
  return data;
}

export function createTask({ content, contentParts, title, profile = 'standard', projectId, apiKey } = {}) {
  const message = contentParts ? { content: contentParts } : { content };
  const body = {
    message,
    title: title || 'manus-api task',
    share_visibility: 'private',
    agent_profile: profile,
  };
  if (projectId) body.project_id = projectId;
  return apiCall('POST', 'task.create', { apiKey, body });
}

/**
 * Upload a file and return its `file_id`, ready to attach in task.create.
 *
 * Why this exists: the Manus API caps a message's *text* at ~5000 estimated
 * tokens, but per `task.create` docs "file parts do not count" toward that
 * limit. NovaAgent's system prompt (persona + rules + tool schemas) alone runs
 * ~33k tokens, so it cannot travel as text. Attaching it as a file carries it
 * whole, and the agent reads it on demand.
 *
 * flow: file.upload -> presigned URL -> PUT bytes -> file_id
 */
export async function uploadFile(content, filename, { apiKey, mimeType = 'text/markdown' } = {}) {
  const record = await apiCall('POST', 'file.upload', {
    apiKey,
    body: { filename },
    timeoutMs: 60000,
  });
  const fileId = record?.file?.id;
  const uploadUrl = record?.upload_url;
  if (!fileId || !uploadUrl) throw new Error('file.upload returned no file id / upload_url');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  let put;
  try {
    put = await fetch(uploadUrl, {
      method: 'PUT',
      signal: controller.signal,
      headers: { 'Content-Type': mimeType },
      body: content,
    });
  } catch (err) {
    clearTimeout(timer);
    throw new Error(`file PUT failed: ${err.message}`);
  }
  clearTimeout(timer);
  if (!put.ok) throw new Error(`file PUT failed: HTTP ${put.status}`);
  return { fileId, filename };
}

export function fileDetail(fileId, { apiKey } = {}) {
  return apiCall('GET', 'file.detail', { apiKey, params: { file_id: fileId } }).then((d) => d?.file || d);
}

export function taskDetail(taskId, { apiKey } = {}) {
  return apiCall('GET', 'task.detail', { apiKey, params: { task_id: taskId } }).then(normalizeTask);
}

/** Manus wraps the task under a `task` key — flatten it so callers see `status` etc. */
export function normalizeTask(data) {
  if (data && typeof data === 'object' && data.task && typeof data.task === 'object') {
    return { ...data.task, ok: data.ok, request_id: data.request_id };
  }
  return data || {};
}

/** Fetch a task together with its message timeline (assistant text lives in the messages). */
export async function taskWithMessages(taskId, { apiKey, limit = 50 } = {}) {
  const [detail, msgs] = await Promise.all([
    taskDetail(taskId, { apiKey }),
    listMessages(taskId, { limit, apiKey }).catch(() => ({ messages: [] })),
  ]);
  const messages = msgs.messages || msgs.data || [];
  const chronological = [...messages].sort((a, b) => Number(a?.timestamp || 0) - Number(b?.timestamp || 0));
  return { ...detail, messages: chronological, text: extractText({ messages: chronological }) };
}

export function sendMessage(taskId, content, { apiKey } = {}) {
  return apiCall('POST', 'task.sendMessage', {
    apiKey,
    body: { task_id: taskId, message: { content } },
  });
}

function assistantCount(messages) {
  return (messages || []).filter((m) => m && m.type === 'assistant_message').length;
}

/** Manus returns messages newest-first; order them chronologically. */
function toChronological(messages) {
  return [...(messages || [])].sort((a, b) => Number(a?.timestamp || 0) - Number(b?.timestamp || 0));
}

/**
 * Continue an existing task and wait for its NEW reply.
 * A finished task stays "stopped" for a moment after sendMessage, so waiting on
 * terminal status alone returns stale text — we also require a new assistant message.
 */
export async function continueTask(taskId, content, { timeoutMs = 300000, intervalMs = 3000, apiKey, onStatus } = {}) {
  let before = 0;
  try {
    const m = await listMessages(taskId, { limit: 50, apiKey });
    before = assistantCount(m.messages || m.data);
  } catch {
    // best effort baseline
  }

  await sendMessage(taskId, content, { apiKey });

  const started = Date.now();
  let detail = {};
  for (;;) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const bundle = await taskWithMessages(taskId, { apiKey }).catch(() => null);
    if (bundle) detail = bundle;
    const status = String(detail.status || '');
    if (onStatus) onStatus(status);
    const fresh = assistantCount(detail.messages) > before;
    if (fresh && TERMINAL_STATUS.has(status.toLowerCase())) break;
    if (Date.now() - started >= timeoutMs) break;
  }

  const replies = toChronological(detail.messages)
    .filter((m) => m.type === 'assistant_message')
    .map((m) => m.assistant_message?.content || '');
  const newText = replies.slice(before).join('\n\n');
  return { ...detail, text: newText || extractText(detail) };
}

export function listTasks({ limit = 10, apiKey } = {}) {
  return apiCall('GET', 'task.list', { apiKey, params: { limit } });
}

export function listMessages(taskId, { limit = 50, apiKey } = {}) {
  return apiCall('GET', 'task.listMessages', { apiKey, params: { task_id: taskId, order: 'desc', limit } });
}

export async function availableCredits({ apiKey } = {}) {
  return apiCall('GET', 'usage.availableCredits', { apiKey });
}

/**
 * Poll until the task reaches a terminal status, then attach its message timeline.
 * The assistant answer lives in the messages (not in task.detail), so we fetch both.
 */
export async function waitForTask(taskId, { timeoutMs = 300000, intervalMs = 3000, apiKey, onStatus } = {}) {
  const started = Date.now();
  let last = '';
  let detail = {};
  for (;;) {
    detail = await taskDetail(taskId, { apiKey });
    const status = String(detail.status || '');
    if (status !== last) {
      last = status;
      if (onStatus) onStatus(status);
    }
    if (TERMINAL_STATUS.has(status.toLowerCase())) break;
    if (Date.now() - started >= timeoutMs) break;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return taskWithMessages(taskId, { apiKey }).catch(() => ({ ...detail, messages: [], text: '' }));
}

export function extractText(data) {
  const parts = [];
  for (const ev of data?.messages || []) {
    const a = ev && typeof ev === 'object' ? ev.assistant_message : null;
    if (a && typeof a === 'object' && a.content) parts.push(String(a.content));
  }
  if (!parts.length && data?.content) parts.push(String(data.content));
  return parts.join('\n\n');
}

export function collectAttachments(data) {
  const out = [];
  for (const ev of data?.messages || []) {
    const a = ev && typeof ev === 'object' ? ev.assistant_message : null;
    if (a && typeof a === 'object') {
      for (const att of a.attachments || []) {
        if (att && typeof att === 'object' && att.url) out.push(att);
      }
    }
  }
  return out;
}
