#!/usr/bin/env node
// manus-api - CLI to run the Manus Bridge (OpenAI-compatible API over Manus).
import fs from 'fs';
import path from 'path';
import net from 'net';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_DIR = path.join(__dirname, '..');

const PID_FILE = path.join(PKG_DIR, '.manus-api.pid');
const LOG_FILE = path.join(PKG_DIR, 'manus-api.log');
const SERVER = path.join(PKG_DIR, 'src', 'server.js');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const BANNER = `
${C.magenta}${C.bold}╔══════════════════════════════════════════════════════╗${C.reset}
${C.magenta}${C.bold}║${C.reset}  ${C.cyan}${C.bold}🔌 Manus Bridge${C.reset}                                     ${C.magenta}${C.bold}║${C.reset}
${C.magenta}${C.bold}║${C.reset}  ${C.dim}OpenAI-compatible API over the Manus agent${C.reset}          ${C.magenta}${C.bold}║${C.reset}
${C.magenta}${C.bold}║${C.reset}  ${C.dim}Upstream: api.manus.ai/v2${C.reset}                          ${C.magenta}${C.bold}║${C.reset}
${C.magenta}${C.bold}╚══════════════════════════════════════════════════════╝${C.reset}
`;

function readPid() {
  try {
    if (fs.existsSync(PID_FILE)) return JSON.parse(fs.readFileSync(PID_FILE, 'utf8'));
  } catch {
    // ignore
  }
  return null;
}

function isRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function portInUse(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once('error', () => resolve(true));
    s.once('listening', () => s.close(() => resolve(false)));
    s.listen(port, '127.0.0.1');
  });
}

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--foreground') opts.foreground = true;
    else if (a === '--follow' || a === '-f') opts.follow = true;
    else if (a === '--port' || a === '-p') opts.port = argv[++i];
    else if (a === '--host' || a === '-H') opts.host = argv[++i];
    else if (a === '--lines' || a === '-n') opts.lines = argv[++i];
    else if (a === '--api-key') opts.clientKey = argv[++i];
    else if (a === '--default-model') opts.defaultModel = argv[++i];
  }
  return opts;
}

async function cmdStart(opts) {
  console.log(BANNER);
  const port = parseInt(opts.port || process.env.MANUS_API_PORT || '8742', 10);
  const host = opts.host || process.env.MANUS_API_HOST || '127.0.0.1';

  const existing = readPid();
  if (existing && isRunning(existing.pid)) {
    console.log(`${C.yellow}  ⚠  Server is already running${C.reset}`);
    console.log(`${C.dim}     PID: ${existing.pid} | Port: ${existing.port}${C.reset}`);
    console.log(`${C.dim}     Use ${C.reset}${C.bold}manus-api stop${C.reset}${C.dim} to stop it first.${C.reset}`);
    process.exit(1);
  }

  if (await portInUse(port)) {
    console.log(`${C.red}  ✗  Port ${port} is already in use.${C.reset}`);
    console.log(`${C.dim}     Try: ${C.reset}${C.bold}manus-api start --port ${port + 1}${C.reset}`);
    process.exit(1);
  }

  const env = {
    ...process.env,
    MANUS_API_PORT: String(port),
    MANUS_API_HOST: host,
  };
  if (opts.clientKey) env.MANUS_API_KEY_CLIENT = opts.clientKey;
  if (opts.defaultModel) env.MANUS_API_DEFAULT_MODEL = opts.defaultModel;

  if (opts.foreground) {
    const { spawnSync } = await import('child_process');
    spawnSync(process.execPath, [SERVER], { stdio: 'inherit', env });
    return;
  }

  const logStream = fs.openSync(LOG_FILE, 'a');
  const child = spawn(process.execPath, [SERVER], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
    env,
  });
  fs.writeFileSync(PID_FILE, JSON.stringify({ pid: child.pid, port, host, startedAt: new Date().toISOString() }));
  child.unref();

  await new Promise((r) => setTimeout(r, 1800));

  if (isRunning(child.pid)) {
    console.log(`${C.green}  ✔  Server started successfully${C.reset}`);
    console.log();
    console.log(`${C.cyan}${C.bold}  API Endpoint${C.reset}`);
    console.log(`  ${C.bold}http://${host}:${port}/v1${C.reset}`);
    console.log();
    console.log(`${C.cyan}${C.bold}  OpenAI SDK Usage${C.reset}`);
    console.log(`${C.dim}  base_url = "http://${host}:${port}/v1"${C.reset}`);
    console.log(`${C.dim}  api_key  = "${opts.clientKey || 'unused'}"${C.reset}`);
    console.log();
    console.log(`${C.cyan}${C.bold}  Server Info${C.reset}`);
    console.log(`${C.dim}  PID: ${child.pid} | Log: ${path.basename(LOG_FILE)}${C.reset}`);
    console.log();
    console.log(`${C.dim}  Stop with: ${C.reset}${C.bold}manus-api stop${C.reset}`);
    console.log(`${C.dim}  View logs: ${C.reset}${C.bold}manus-api logs${C.reset}`);
    console.log();
  } else {
    console.log(`${C.red}  ✗  Failed to start server${C.reset}`);
    console.log(`${C.dim}     Check: cat ${LOG_FILE}${C.reset}`);
    process.exit(1);
  }
}

function cmdStop() {
  console.log(BANNER);
  const data = readPid();
  if (!data) {
    console.log(`${C.yellow}  ⚠  No server is currently running.${C.reset}`);
    return;
  }
  if (!isRunning(data.pid)) {
    console.log(`${C.yellow}  ⚠  Stale PID file (process not running).${C.reset}`);
    try { fs.unlinkSync(PID_FILE); } catch {}
    return;
  }
  try {
    process.kill(data.pid, 'SIGTERM');
  } catch {}
  let n = 0;
  const t = setInterval(() => {
    n++;
    if (!isRunning(data.pid) || n > 20) {
      clearInterval(t);
      if (isRunning(data.pid)) {
        try { process.kill(data.pid, 'SIGKILL'); } catch {}
      }
      try { fs.unlinkSync(PID_FILE); } catch {}
      console.log(`${C.green}  ✔  Server stopped${C.reset}${C.dim} (PID ${data.pid})${C.reset}`);
      console.log();
    }
  }, 250);
}

function cmdStatus() {
  console.log(BANNER);
  const data = readPid();
  if (!data || !isRunning(data.pid)) {
    if (data) { try { fs.unlinkSync(PID_FILE); } catch {} }
    console.log(`${C.dim}  ○  Server is not running.${C.reset}`);
    console.log(`${C.dim}     Start with: ${C.reset}${C.bold}manus-api start${C.reset}`);
    console.log();
    return;
  }
  console.log(`${C.green}  ●  Server is running${C.reset}`);
  console.log(`${C.dim}     PID:     ${C.reset}${data.pid}`);
  console.log(`${C.dim}     Host:    ${C.reset}${data.host}`);
  console.log(`${C.dim}     Port:    ${C.reset}${data.port}`);
  console.log(`${C.dim}     Started: ${C.reset}${data.startedAt}`);
  console.log(`${C.dim}     URL:     ${C.reset}http://${data.host}:${data.port}/v1`);
  console.log();
}

function cmdLogs(opts) {
  if (!fs.existsSync(LOG_FILE)) {
    console.log(`${C.yellow}  No log file found yet.${C.reset}`);
    return;
  }
  if (opts.follow) {
    const child = spawn('tail', ['-f', '-n', String(opts.lines || 50), LOG_FILE], { stdio: 'inherit' });
    child.on('exit', () => process.exit(0));
    return;
  }
  const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n');
  console.log(lines.slice(-parseInt(opts.lines || '50', 10)).join('\n'));
}

function cmdCredits() {
  import('./manus.js').then(async ({ availableCredits, resolveApiKey }) => {
    if (!resolveApiKey()) {
      console.log(`${C.red}  ✗  MANUS_API_KEY not set${C.reset}`);
      process.exit(1);
    }
    console.log(JSON.stringify(await availableCredits({}), null, 2));
  });
}

function usage() {
  console.log(BANNER);
  console.log('  Usage: manus-api <command> [options]\n');
  console.log('  Commands:');
  console.log('    start     Start the API server in the background');
  console.log('    stop      Stop the running server');
  console.log('    status    Show server status');
  console.log('    logs      Print server logs (-n <lines>, -f)');
  console.log('    credits   Show Manus credits');
  console.log('    help      Show this help\n');
  console.log('  Start options:');
  console.log('    -p, --port <port>            Port (default 8742)');
  console.log('    -H, --host <host>            Host (default 127.0.0.1)');
  console.log('        --foreground             Run in foreground');
  console.log('        --api-key <key>          Require this key from clients');
  console.log('        --default-model <model>  Default model (default manus-2.0-lite)\n');
}

const [cmd, ...rest] = process.argv.slice(2);
const opts = parseArgs(rest);

switch (cmd) {
  case 'start': await cmdStart(opts); break;
  case 'stop': cmdStop(); break;
  case 'status': cmdStatus(); break;
  case 'logs': cmdLogs(opts); break;
  case 'credits': cmdCredits(); break;
  case 'help':
  case undefined:
  case '--help':
  case '-h': usage(); break;
  default:
    console.log(`${C.red}  ✗  Unknown command: ${cmd}${C.reset}`);
    usage();
    process.exit(1);
}
