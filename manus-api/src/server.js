// Manus Bridge server - OpenAI-compatible HTTP surface over the Manus agent API.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import {
  PKG_DIR,
  MODELS,
  DEFAULT_MODEL,
  resolveApiKey,
  createTask,
  taskDetail,
  taskWithMessages,
  sendMessage,
  continueTask,
  listTasks,
  listMessages,
  availableCredits,
  usageList,
  waitForTask,
  extractText,
  collectAttachments,
  profileForModel,
  uploadFile,
} from './manus.js';

const PORT = parseInt(process.env.MANUS_API_PORT || '8742', 10);
const HOST = process.env.MANUS_API_HOST || '127.0.0.1';
const REQUIRE_KEY = (process.env.MANUS_API_KEY_CLIENT || '').trim();
const DEFAULT_MODEL_ENV = process.env.MANUS_API_DEFAULT_MODEL || DEFAULT_MODEL;
const PREFIX = '/v1';

const LOG_FILE = path.join(PKG_DIR, 'manus-api.log');
const KEYS_FILE = path.join(PKG_DIR, 'api-keys.json');

// stdout/stderr are redirected to LOG_FILE by the CLI when daemonized,
// so write only to stdout here to avoid duplicated log lines.
function log(level, msg) {
  console.log(`${new Date().toISOString()} [${level}] ${msg}`);
}

function loadClientKeys() {
  const keys = new Set();
  if (REQUIRE_KEY) keys.add(REQUIRE_KEY);
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const data = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
      const list = Array.isArray(data) ? data : data.keys || [];
      for (const k of list) if (k) keys.add(String(k));
    }
  } catch (e) {
    log('warn', `could not read api-keys.json: ${e.message}`);
  }
  return keys;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(body);
}

function checkAuth(req) {
  const keys = loadClientKeys();
  if (keys.size === 0) return true;
  const header = req.headers['authorization'] || '';
  const token = header.replace(/^Bearer\s+/i, '').trim() || req.headers['x-api-key'];
  return Boolean(token && keys.has(String(token).trim()));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 5 * 1024 * 1024) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error(`invalid JSON body: ${e.message}`));
      }
    });
    req.on('error', reject);
  });
}

function flattenMessages(messages) {
  if (!Array.isArray(messages)) return String(messages || '');
  return messages
    .map((m) => {
      const role = m.role || 'user';
      let content = m.content;
      if (Array.isArray(content)) {
        content = content.map((p) => (typeof p === 'string' ? p : p.text || '')).join('\n');
      }
      return `[${role}] ${content ?? ''}`;
    })
    .join('\n\n');
}

// Upstream rejects a task whose message content exceeds this many tokens, and
// it fails the whole turn rather than truncating. NovaAgent sends its full
// system prompt + tool schemas + history (frequently 100+ messages), which is
// far larger, so the prompt has to be fitted here before it is sent.
const MAX_PROMPT_TOKENS = 4800; // headroom under the upstream 5000 limit

// Per the task.create docs the ~5000-token cap counts only the combined *text*
// parts of a message; "file parts do not count". NovaAgent's system prompt
// (persona + rules + tool schemas) alone runs to ~33k tokens, so it is attached
// as a file instead of being truncated away. Below this size a file round-trip
// is not worth the latency and the text is inlined as before.
const CONTEXT_FILE_THRESHOLD_TOKENS = Number(process.env.MANUS_API_CONTEXT_FILE_TOKENS || 1200);
// Uploaded files expire 48h after upload (file.upload docs); refresh before then.
const FILE_TTL_MS = 47 * 60 * 60 * 1000;
// Optional: a Manus project whose `instruction` is prepended to every task, so
// the persona travels without spending the message's token budget at all.
const PROJECT_ID = (process.env.MANUS_API_PROJECT_ID || '').trim();

// sha1 -> { fileId, filename, expiresAt }. Keyed by content so an unchanged
// system prompt uploads once and is reused across turns until it expires.
const CONTEXT_FILE_CACHE = new Map();

// Deliberately conservative and dependency-free: CJK and Thai codepoints cost
// far more than one token per character, so anything non-ASCII is counted
// double. Overestimating only trims a little extra dialogue; underestimating
// would fail the request outright.
function estimateTokens(text) {
  const s = String(text || '');
  let tokens = 0;
  for (let i = 0; i < s.length; i++) {
    tokens += s.charCodeAt(i) > 127 ? 2 : 0.25;
  }
  return Math.ceil(tokens);
}

function truncateToTokens(text, maxTokens) {
  const s = String(text || '');
  if (estimateTokens(s) <= maxTokens) return s;
  let tokens = 0;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    tokens += s.charCodeAt(i) > 127 ? 2 : 0.25;
    if (tokens > maxTokens) break;
    out += s[i];
  }
  return out;
}

/**
 * Split an OpenAI-style message list into the (large) system context and the
 * (small) recent dialogue, without truncating either mid-sentence.
 *
 * The dialogue is what the user just asked about, so the newest turns are kept
 * whole; the system context is returned intact for the caller to attach as a
 * file rather than trim down to whatever budget happens to be left.
 */
function splitPrompt(messages, { dialogueBudget } = {}) {
  const msgs = Array.isArray(messages) ? messages : [];
  const systems = msgs
    .filter((m) => m.role === 'system')
    .map((m) => (typeof m.content === 'string' ? m.content : flattenMessages([m])))
    .filter(Boolean);

  const budget = dialogueBudget ?? MAX_PROMPT_TOKENS;
  const kept = [];
  let dialogueTokens = 0;
  for (const m of [...msgs].filter((m) => m.role !== 'system').reverse()) {
    const text = flattenMessages([m]);
    const cost = estimateTokens(text) + 4;
    if (dialogueTokens + cost > budget && kept.length) break;
    kept.push(text);
    dialogueTokens += cost;
  }

  return {
    systemText: systems.join('\n\n'),
    dialogueText: kept.reverse().join('\n\n'),
    dialogueTokens,
  };
}

async function attachContextFile(systemText) {
  const key = createHash('sha1').update(systemText).digest('hex');
  const cached = CONTEXT_FILE_CACHE.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached;

  const filename = `nova-context-${key.slice(0, 12)}.md`;
  const { fileId } = await uploadFile(systemText, filename);
  const entry = { fileId, filename, expiresAt: Date.now() + FILE_TTL_MS };
  CONTEXT_FILE_CACHE.set(key, entry);
  log('info', `context attached as ${filename} (file_id=${fileId}, ${estimateTokens(systemText)} est.tokens, whole)`);
  return entry;
}

/**
 * Build the Manus message content parts.
 *
 * Text carries only the recent dialogue plus a pointer to the attached context
 * file; the full system prompt rides along as a file part that does not count
 * toward the 5000-token cap. Small prompts stay inline (see the threshold) so
 * trivial turns do not pay for an upload.
 */
async function buildContentParts(messages) {
  const { systemText, dialogueText } = splitPrompt(messages);
  let attached = null;

  if (systemText && estimateTokens(systemText) > CONTEXT_FILE_THRESHOLD_TOKENS) {
    attached = await attachContextFile(systemText);
  }

  let head = '';
  if (attached) {
    head = `[บริบทระบบฉบับเต็มอยู่ในไฟล์แนบ "${attached.filename}" — เปิดอ่านไฟล์นี้ก่อนตอบ แล้วปฏิบัติตามอย่างเคร่งครัด]\n`;
  } else if (systemText) {
    head = systemText + '\n';
  }

  const text = truncateToTokens(head + '\n' + dialogueText, MAX_PROMPT_TOKENS);
  const parts = [{ type: 'text', text }];
  if (attached) {
    parts.push({
      type: 'file',
      file_id: attached.fileId,
      filename: attached.filename,
      mime_type: 'text/markdown',
    });
  }
  return { parts, text, attached };
}

// Manus narrates in its own working language before answering, so a reply often
// opens with a Chinese preamble ahead of the actual answer. Drop leading
// paragraphs that are overwhelmingly CJK, stopping at the first that is not —
// content in any other language is left intact.
const STRIP_CJK_PREAMBLE = process.env.MANUS_API_STRIP_PREAMBLE !== '0';

function stripCjkPreamble(text) {
  if (!STRIP_CJK_PREAMBLE) return text;
  const paragraphs = String(text || '').split(/\n{2,}/);
  let start = 0;
  while (start < paragraphs.length) {
    const p = paragraphs[start].trim();
    if (!p) {
      start += 1;
      continue;
    }
    const cjk = (p.match(/[\u3400-\u9FFF\uF900-\uFAFF]/g) || []).length;
    const letters = (p.match(/[^\s\d\p{P}]/gu) || []).length;
    if (!letters || cjk / letters < 0.5) break;
    start += 1;
  }
  if (start === 0) return text;
  const rest = paragraphs.slice(start).join('\n\n').trim();
  return rest || paragraphs.join('\n\n').trim();
}

function sse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function handleChatCompletions(req, res, body) {
  const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
  if (!messages.length) return sendJson(res, 400, { error: { message: 'messages is required', type: 'invalid_request_error' } });

  const model = body.model || DEFAULT_MODEL_ENV;
  const profile = profileForModel(model);
  const stream = Boolean(body.stream);
  const id = `chatcmpl-${Date.now().toString(36)}`;
  const created = Math.floor(Date.now() / 1000);

  try {
    // The system prompt travels as a file part (it does not count toward the
    // 5000-token text cap); only the recent dialogue is sent as text.
    const { parts, text: promptText, attached } = await buildContentParts(messages);
    const createdTask = await createTask({
      contentParts: parts,
      title: `manus-api ${model}`,
      profile,
      projectId: PROJECT_ID || undefined,
    });
    const taskId = createdTask.task_id;

    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      sse(res, { id, object: 'chat.completion.chunk', created, model, choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] });
      const detail = await waitForTask(taskId, { timeoutMs: 300000, onStatus: (s) => log('info', `task ${taskId} status=${s}`) });
      const text = stripCjkPreamble(extractText(detail));
      const pieces = text.match(/[\s\S]{1,600}/g) || [text];
      for (const piece of pieces) {
        sse(res, { id, object: 'chat.completion.chunk', created, model, choices: [{ index: 0, delta: { content: piece }, finish_reason: null }] });
      }
      sse(res, { id, object: 'chat.completion.chunk', created, model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] });
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const detail = await waitForTask(taskId, { timeoutMs: 300000, onStatus: (s) => log('info', `task ${taskId} status=${s}`) });
    const text = stripCjkPreamble(extractText(detail));
    sendJson(res, 200, {
      id,
      object: 'chat.completion',
      created,
      model,
      choices: [{ index: 0, message: { role: 'assistant', content: text }, finish_reason: 'stop' }],
      usage: { prompt_tokens: promptText.length, completion_tokens: text.length, total_tokens: promptText.length + text.length },
      manus: {
        task_id: taskId,
        task_url: createdTask.task_url || null,
        status: detail.status,
        // This is reported by task.detail. Manus credits must never be
        // inferred from token counts or text length.
        credit_usage: Number.isInteger(detail.credit_usage) ? detail.credit_usage : null,
        attachments: collectAttachments(detail),
        context_file: attached ? attached.filename : null,
      },
    });
  } catch (err) {
    log('error', `chat.completions failed: ${err.message}`);
    sendJson(res, 502, { error: { message: err.message, type: 'upstream_error' } });
  }
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || HOST}`);
  const p = url.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' });
    return res.end();
  }

  if (p === '/health' || p === `${PREFIX}/health`) {
    return sendJson(res, 200, { ok: true, service: 'manus-api', model_default: DEFAULT_MODEL_ENV, auth_required: loadClientKeys().size > 0 });
  }

  if (!p.startsWith(PREFIX)) return sendJson(res, 404, { error: { message: `unknown path ${p}`, type: 'invalid_request_error' } });
  if (!checkAuth(req)) return sendJson(res, 401, { error: { message: 'invalid api key', type: 'invalid_request_error' } });
  if (!resolveApiKey()) return sendJson(res, 500, { error: { message: 'MANUS_API_KEY not configured on the bridge', type: 'configuration_error' } });

  try {
    if (p === `${PREFIX}/models` && req.method === 'GET') {
      return sendJson(res, 200, { object: 'list', data: Object.keys(MODELS).map((id) => ({ id, object: 'model', owned_by: 'manus' })) });
    }
    if (p === `${PREFIX}/chat/completions` && req.method === 'POST') {
      const body = await readBody(req);
      return handleChatCompletions(req, res, body);
    }
    if (p === `${PREFIX}/context` && req.method === 'POST') {
      const body = await readBody(req);
      const messages = body.messages || [];
      const { parts, text, attached } = await buildContentParts(messages);
      return sendJson(res, 200, {
        ok: true,
        context_file: attached ? { filename: attached.filename, file_id: attached.fileId } : null,
        text_tokens: estimateTokens(text),
        text_preview: text.slice(0, 300),
        parts: parts.map((x) => (x.type === 'file'
          ? { type: 'file', filename: x.filename }
          : { type: 'text', tokens: estimateTokens(x.text) })),
      });
    }
    if (p === `${PREFIX}/credits` && req.method === 'GET') {
      return sendJson(res, 200, await availableCredits({}));
    }
    if (p === `${PREFIX}/usage` && req.method === 'GET') {
      const rawLimit = url.searchParams.get('limit');
      const rawCursor = url.searchParams.get('cursor');
      const limit = rawLimit === null ? 20 : Number(rawLimit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return sendJson(res, 400, {
          error: {
            message: 'limit must be an integer between 1 and 100',
            type: 'invalid_request_error',
          },
        });
      }
      // Keep balance and history separate. Both values are passed through
      // from Manus; NovaAgent does not calculate either one.
      const [available, history] = await Promise.all([
        availableCredits({}),
        usageList({ limit, cursor: rawCursor || undefined }),
      ]);
      return sendJson(res, 200, {
        object: 'manus.usage',
        available_credits: available,
        usage: history,
      });
    }
    if (p === `${PREFIX}/tasks` && req.method === 'GET') {
      return sendJson(res, 200, await listTasks({ limit: Number(url.searchParams.get('limit') || 10) }));
    }
    if (p === `${PREFIX}/tasks` && req.method === 'POST') {
      const body = await readBody(req);
      const content = body.message || body.prompt || body.content;
      if (!content) return sendJson(res, 400, { error: { message: 'message is required', type: 'invalid_request_error' } });
      const createdTask = await createTask({ content, title: body.title, profile: profileForModel(body.model || body.profile) });
      return sendJson(res, 200, createdTask);
    }
    const taskMatch = p.match(new RegExp(`^${PREFIX}/tasks/([^/]+)$`));
    if (taskMatch && req.method === 'GET') {
      return sendJson(res, 200, await taskWithMessages(taskMatch[1]));
    }
    const msgMatch = p.match(new RegExp(`^${PREFIX}/tasks/([^/]+)/messages$`));
    if (msgMatch) {
      if (req.method === 'GET') return sendJson(res, 200, await listMessages(msgMatch[1]));
      if (req.method === 'POST') {
        const body = await readBody(req);
        if (!body.message) return sendJson(res, 400, { error: { message: 'message is required', type: 'invalid_request_error' } });
        const detail = await continueTask(msgMatch[1], body.message, { timeoutMs: 300000 });
        return sendJson(res, 200, detail);
      }
    }
    return sendJson(res, 404, { error: { message: `unknown path ${p}`, type: 'invalid_request_error' } });
  } catch (err) {
    log('error', `${req.method} ${p} -> ${err.message}`);
    return sendJson(res, 502, { error: { message: err.message, type: 'upstream_error' } });
  }
}

const server = http.createServer((req, res) => {
  route(req, res).catch((err) => {
    log('error', `unhandled: ${err.message}`);
    if (!res.headersSent) sendJson(res, 500, { error: { message: err.message, type: 'internal_error' } });
  });
});

server.listen(PORT, HOST, () => {
  log('info', `manus-api listening on http://${HOST}:${PORT}${PREFIX}`);
  log('info', `upstream=${process.env.MANUS_API_BASE || 'https://api.manus.ai/v2'} default_model=${DEFAULT_MODEL_ENV}`);
  log('info', `auth_required=${loadClientKeys().size > 0} manus_key_configured=${Boolean(resolveApiKey())}`);
  console.log('Manus Bridge ready');
});

process.on('SIGTERM', () => { log('info', 'SIGTERM received, shutting down'); server.close(() => process.exit(0)); });
process.on('SIGINT', () => { log('info', 'SIGINT received, shutting down'); server.close(() => process.exit(0)); });
