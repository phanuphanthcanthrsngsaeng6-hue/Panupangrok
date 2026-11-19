import { readFileSync, lstatSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateLeaderboardConfig } from './leaderboard-reference/server/config.mjs';

const reference = fileURLToPath(new URL('./leaderboard-reference/', import.meta.url));
const authReference = fileURLToPath(new URL('./auth-reference/', import.meta.url));
// Explicit opt-in. Preflight every target before changing an existing project.
export function installLeaderboard(root, config, source = reference, authSource = authReference) {
  root = resolve(root);
  validateLeaderboardConfig(config);
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  if (!pkg.dependencies?.three) throw new Error('A Three.js project is required');
  for (const path of ['package.json', 'index.html']) if (!lstatSync(join(root, path)).isFile()) throw new Error('Regular Three.js source required');
  const files = new Map();
  const add = (path, value) => files.set(path, value);
  for (const name of ['config.mjs', 'service.mjs', 'rest.mjs', 'runtime.mjs', 'router.mjs', 'request-database.mjs', 'deployment-contract.mjs', 'migrate.mjs']) add(`server/leaderboard/${name}`, readFileSync(join(source, 'server', name)));
  for (const name of readdirSync(join(source, 'server/migrations'))) if (/^\d{3}_[a-z0-9_]+\.sql$/.test(name)) add(`server/leaderboard/migrations/${name}`, readFileSync(join(source, 'server/migrations', name)));
  for (const name of ['leaderboard.js', 'leaderboard.d.ts']) add(name, readFileSync(join(source, 'web', name)));
  add('server/leaderboard.config.json', JSON.stringify(config, null, 2) + '\n');
  add('server/leaderboard.mjs', `import { readFileSync } from 'node:fs';\nimport { createLeaderboardRuntime } from './leaderboard/runtime.mjs';\nexport const leaderboard = createLeaderboardRuntime(JSON.parse(readFileSync(new URL('./leaderboard.config.json', import.meta.url), 'utf8')));\n`);
  const replacements = new Set();
  if (config.identity === 'account') {
    // Install auth first. Customized routers/index stay owned by the game author.
    for (const name of ['app.mjs', 'routers.mjs', 'index.mjs']) {
      if (!lstatSync(join(root, 'server', name), { throwIfNoEntry: false })?.isFile() || readFileSync(join(root, 'server', name), 'utf8') !== readFileSync(join(authSource, 'server', name), 'utf8')) throw new Error('Existing backend preserved; integrate createLeaderboardRouter and leaderboard.middleware explicitly');
    }
    if (!readFileSync(join(root, 'server/webdev-adapter.mjs'), 'utf8').includes('publicProcedure')) throw new Error('Update the committed Webdev auth adapter before integrating leaderboards');
    const router = readFileSync(join(root, 'server/routers.mjs'), 'utf8').replace('router, protectedProcedure', 'router, publicProcedure, protectedProcedure').replace('export const gameRouter = router({', `import { leaderboard } from './leaderboard.mjs'\nimport { createLeaderboardRouter } from './leaderboard/router.mjs'\n\nexport const gameRouter = router({\n  leaderboard: createLeaderboardRouter({ router, publicProcedure, protectedProcedure }, leaderboard),`);
    add('server/routers.mjs', router);
    add('server/index.mjs', readFileSync(join(root, 'server/index.mjs'), 'utf8').replace("import { gameRouter }", "import { leaderboard } from './leaderboard.mjs'\nimport { gameRouter }").replace('createGameApp(gameRouter)', 'createGameApp(gameRouter, { leaderboard })'));
    const serverPackage = JSON.parse(readFileSync(join(root, 'server/package.json'), 'utf8'));
    if (serverPackage.scripts?.['db:migrate:leaderboard']) throw new Error('Existing migration command preserved');
    add('server/package.json', JSON.stringify({ ...serverPackage, scripts: { ...serverPackage.scripts, 'db:migrate:leaderboard': 'node leaderboard/migrate.mjs' } }, null, 2) + '\n');
    for (const path of ['server/routers.mjs', 'server/index.mjs', 'server/package.json']) replacements.add(path);
  } else {
    if (lstatSync(join(root, 'server'), { throwIfNoEntry: false })) throw new Error('Existing backend preserved; mount leaderboard.middleware in that backend explicitly');
    const pkg = JSON.parse(readFileSync(join(source, 'server/package.json'), 'utf8'));
    add('server/package.json', JSON.stringify({ ...pkg, scripts: { start: 'node index.mjs', 'db:migrate:leaderboard': 'node leaderboard/migrate.mjs' } }, null, 2) + '\n');
    add('server/Dockerfile', readFileSync(join(authSource, 'server/Dockerfile')));
    add('server/index.mjs', `import http from 'node:http';\nimport { leaderboard } from './leaderboard.mjs';\nimport { send } from './leaderboard/rest.mjs';\nconst server = http.createServer((req, res) => {\n  if (req.method === 'GET' && req.url?.split('?')[0] === '/api/health') return send(res, 200, { status: 'ok' });\n  leaderboard.middleware(req, res, () => { res.writeHead(404); res.end(); });\n});\nserver.requestTimeout = 15000;\nserver.headersTimeout = 10000;\nserver.listen(Number(process.env.PORT || 3000), '0.0.0.0');\nfor (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => leaderboard.close().finally(() => process.exit(0))));\n`);
  }
  for (const path of files.keys()) {
    const parts = path.split('/');
    for (let i = 1; i <= parts.length; i++) {
      const relative = parts.slice(0, i).join('/');
      const stat = lstatSync(join(root, relative), { throwIfNoEntry: false });
      if (stat && (stat.isSymbolicLink() || (i < parts.length && !stat.isDirectory()) || (i === parts.length && (!replacements.has(path) || !stat.isFile())))) throw new Error(`Existing project file preserved: ${relative}`);
    }
  }
  for (const [path, value] of files) { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), value, { flag: replacements.has(path) ? 'w' : 'wx' }); }
  return { installed: true, configurationApplied: false, configurationPatch: {
    features: { server: true, database: true }, build: { command: 'pnpm build', outputDirectory: 'dist' },
    deploy: { dockerfilePath: 'server/Dockerfile', healthPath: '/api/health' },
    routes: [{ path: '/api/*', target: 'server' }, { path: '/*', target: 'static' }],
  }, nextSteps: ['Merge and read back configurationPatch through the existing config API.', 'Add a numbered board migration with reviewed score/duration rules. Apply migrations only through the authorized project database workflow before checkpoint.', 'Install dependencies and commit lockfiles. Wire leaderboard.js into game start/settlement and show Result errors while preserving local play.', 'Validate the saved checkpoint Preview and published hybrid API separately. Existing games require explicit integration.'] };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const config = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8'));
    console.log(JSON.stringify(installLeaderboard(process.cwd(), config), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
