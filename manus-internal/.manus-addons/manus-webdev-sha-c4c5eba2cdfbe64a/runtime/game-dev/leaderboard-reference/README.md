# Optional online leaderboard reference

Use this reference only when online rankings are requested. Select the Three.js or Godot integration below from the project's recorded engine; API, data and database contracts are shared unless scoped otherwise. This API uses the **game project's** managed Webdev database; it must never connect to `addon_webdev`. The owning workflow is the Addon Game leaderboard skill. Nothing here provisions infrastructure or runs migrations automatically during startup or Publish.

## Three.js integration

`../install-leaderboard.mjs` installs this reference explicitly into a Three.js project. Its required
configuration is `{ "identity": "account" | "guest", "boards": [{ "id": "score-v1", "rulesVersion": "v1" }] }`.
Use account mode only after canonical Webdev auth installation. The installer preflights packaged files
and refuses customized existing backends; it never provisions, migrates, overwrites a customized service,
or upgrades an existing generated game automatically. The returned config patch uses `pnpm build` / `dist`
and `/api/health` for container startup in the same Web hybrid container. Install dependencies and lockfiles.

For a customized existing Webdev backend, copy the shared modules to `server/leaderboard/`, keep the
configuration in `server/leaderboard.config.json`, and compose with the existing router/app:

```js
import { readFileSync } from 'node:fs';
import { router, publicProcedure, protectedProcedure } from './webdev-adapter.mjs';
import { createLeaderboardRuntime } from './leaderboard/runtime.mjs';
import { createLeaderboardRouter } from './leaderboard/router.mjs';
const leaderboard = createLeaderboardRuntime(JSON.parse(
  readFileSync(new URL('./leaderboard.config.json', import.meta.url), 'utf8')));
const gameRouter = router({
  // Preserve the existing game's procedures here.
  leaderboard: createLeaderboardRouter({ router, publicProcedure, protectedProcedure }, leaderboard),
});
// The auth reference accepts this optional integration. In a customized Express
// app, mount leaderboard.middleware before JSON parsers and existing tRPC routes.
const app = createGameApp(gameRouter, { leaderboard });
```

Import `createGameApp` from the project's existing `app.mjs`. Reuse its canonical public/protected
procedures; update the committed auth adapter when those exports are absent. Only the existing app
listens. Account mode rejects every REST mutation with 403 `account_session_required`, including
requests carrying an existing guest token; health and public GET remain available. Existing guest scores
remain readable, but switching a project to account mode disables old guest clients from submitting or
retrying scores. Guest-only projects and the legacy Godot entrypoint retain their REST writes.
Guest mode mounts the same runtime middleware without the account router or login dependency.
The legacy Godot `server.mjs` delegates to the same service/rest modules and retains its backend contract.

The account router exposes public `game.leaderboard.list({boardId,limit?})`, protected
`beginRun({boardId,protocolVersion,rulesVersion,releaseSha?})`, and protected
`submitRun({runId,score,durationMs})`. It rejects unknown fields, including client-supplied player/user IDs.
The canonical session supplies `ctx.user.id`; migration `003_accounts.sql` uses its signed INT type.
The composite key follows this project-owned leaderboard's namespace identity and the approved mapping
schema, rather than the schema convention for Manus service-owned tables. The unique account key and
transaction create exactly one player across concurrent first logins, without orphan rows. Account player
credentials are undisclosed and expired; mapping does not depend on guest token expiry. No guest/account
merging occurs. Existing player, run and best rows remain intact, and guest schema version 2 stays valid.
Account health additionally probes the new mapping columns. Apply migrations before checkpoint and retain
them during rollback. The reference adds no foreign-key dependency to guest-only projects' schema.

Copy/import `web/leaderboard.js` and its `.d.ts` together. Create one client per board with explicit
`identity`, `boardId`, `rulesVersion`, and (account only) `auth: ManusAuth`. Call guest `ensureGuest` explicitly,
`beginRun` at start, then `submitRun(ticket, score, durationMs)` and `retryRun(ticket)` at settlement/retry.
Tickets and exact payloads stay in that client instance; page reload does not replay an unfinished result.
All network operations return a Result; render its error and keep local play independent. An accepted
submission includes a separate leaderboard-refresh Result. Rule mismatch latches writes until reload;
reads continue. Expired login never creates a guest, and guest expiry requires explicit identity recovery.
Default REST URLs preserve the same Preview ingress prefix as the authentication bridge.

The Three.js server migration command is `npm --prefix server run db:migrate:leaderboard`. Add the game's
board definition as the next numbered file (004 or later); do not seed scores. Canonical users migration is
separate and is required for account mode. SQL runs only under the authorized project migration workflow.
Local tests may use a disposable loopback TiDB via `LEADERBOARD_TEST_PORT`; the integration test creates
and drops only its unique `leaderboard_test_*` database and never uses a shared project connection.

## Godot integration

These steps apply only to Godot. Copy `server/` into the game's project and
`godot/online_leaderboard.gd` into its scripts, preserving customized backends. Three.js follows
[its integration above](#threejs-integration) and keeps the Web build, Preview and checkpoint flow.

1. Keep the game's offline score service. Adapt `OnlineLeaderboard` to the actual score and UI; call `ensure_guest` once, `begin_run` before ranked gameplay, then `submit_run` with the server run ID at settlement. Show real online errors without interrupting local gameplay. Preserve the exact ID and values for a retry. Do not upload old local saves as new scores.
2. Request the existing server/database capability upgrade. The generated project's `server/` contains this backend and Dockerfile. Install its dependency and commit the resulting package lock. For reproducible Docker installs change `npm install` to `npm ci` after that lock exists. Keep database credentials in backend environment injection, never Godot, PCK, JavaScript or Git.
3. Review the numbered SQL files, add a new numbered migration containing the game's immutable board definitions, and run `npm --prefix server run db:migrate` as a finite command before saving the first dependent checkpoint. The runner records each filename and SHA-256 in `game_lb_schema_migrations` and rejects edits to applied migrations. There is no migration or seed on server startup. Apply additive schema changes before deploying dependent code; reverting Git does not restore the project database.
4. Configure hybrid deployment: prebuilt static `site/` plus the backend container under `/api/*`. The container listens on port 8080; `/api/health` is its deployment health path. The backend uses same-origin routes and the managed `DATABASE_URL`; do not add a database URL or public-origin input card.
5. Local Game Preview remains offline for this capability and returns `online_preview_requires_checkpoint` for `/api/*`. Follow the owning Addon Game leaderboard skill: prioritize Godot API/client-state tests, native screenshots and existing backend/protocol checks, then save/push the prepared version and hand the checkpoint Preview to the user for online acceptance. Do not proactively use a browser to test the leaderboard. That deployment receives the checkpoint database branch; its writes do not modify the live project database. Publish receives the live project database. There is no Game-specific test database, local backend supervisor, proxy token or relay.

Example seed for an explicitly selected casual high-score game, adapted and reviewed before manual execution:

```sql
INSERT INTO game_lb_boards
(namespace,id,rules_version,direction,min_score,max_score,min_duration_ms,max_duration_ms,`open`)
VALUES
('production','score-v1','v1','desc',0,1000000,1000,1800000,TRUE);
```

Use `asc` for lower-is-better durations. Board ID and rules version remain immutable after submissions. Changed rules require a new board ID, preserving the previous board. Do not create a new board just because art/code was republished.

## Shared guest REST API

Both engines use this protocol in guest mode. Account mode uses the protected procedures above;
it does not use these REST writes. All paths below follow `/api/leaderboards/v1`. Errors return `{error}` with HTTP status. Responses are not cached. Authenticated calls send both `Authorization: Bearer <guest token>` and `X-Guest-Token: <guest token>`; the server prefers `X-Guest-Token` because Preview ingress in older sandbox runtimes strips `Authorization`.

| Method/path | Request | Result |
| --- | --- | --- |
| POST `/guests` | `displayName` (1–48 characters) | `playerId`, opaque `token`, `expiresInSeconds` |
| GET `/boards/:id?limit=20` | Optional token, limit 1–100 | `entries`, optional `myRank`, `rulesVersion`, `namespace`, `trust` |
| POST `/boards/:id/runs` | `protocolVersion:1`, matching `rulesVersion`, optional informational `releaseSha` | server `runId`, expiry, protocol and rules version |
| PUT `/runs/:id` | integer `score`, `durationMs` | accepted receipt; same body replay is idempotent, changed body is 409 |

Run lifetime is 30 minutes. Guest tokens expire in 30 days and are stored hashed in the database. Same-score ties keep the earliest best; rank order is score direction, best-achieved server time, then stable player UUID. Concurrent submissions from a player serialize and best score plus receipt update in one transaction. A lost successful receipt is retried with the same run ID and payload. A 401 clears the client credential; the UI can offer a new guest, explaining that it is a new identity.

## Shared trust, history and data retention

The reference is for **casual client-reported scores**. A server-issued run, elapsed time and bounds reject malformed and duplicate submissions but cannot prove legitimate gameplay. `releaseSha` is also only a client declaration. Competitive/rewarded games must replace submission validation with authoritative simulation or verifiable evidence before claiming verified scores.

Guest tokens identify this installation, not a recoverable account. Clearing storage, expiration or changing devices can lose that identity. For account recovery/cross-device continuity, replace the identity resolver with the game's validated login/session adapter and use server-owned player IDs. Never accept a body `playerId` or use a display name as identity. Do not place an admin API key in the client.

Production and checkpoint Preview use the existing Webdev database lifecycle. Preview receives a branch tied to the selected checkpoint, while Publish receives the live project database. Both use the server-owned `production` application namespace; no request parameter can change it. The database branch, rather than a second namespace or user-entered DSN, isolates Preview writes. The client's `read_only` flag is a UI convenience, not an authorization boundary. Default client URLs remain same-origin and retain managed Preview ingress prefixes.

Rate limits use transactional database buckets: an explicit shared service budget of 300 guest creations/minute per namespace, and 120 authenticated requests/minute per identity. Socket IPs identify ingress proxies and are not used as player quotas; arbitrary forwarded headers are not trusted. A trusted edge may additionally enforce client-IP abuse limits. These bounds do not solve distributed abuse.

The backend admits at most eight concurrent handlers and uses eight database connections with no connection wait queue. Handlers perform database operations sequentially, so admission matches pool capacity; excess requests receive explicit `leaderboard_busy` responses. Database connection establishment is limited to three seconds; each handler has an eight-second total deadline. Timeout or disconnect hard-closes its connecting and leased sockets and prevents subsequent queries. The database rolls back uncommitted work when it detects the disconnect; this is not an immediate rollback guarantee. A timed-out commit may already have succeeded: retry the exact same run/payload to retrieve its idempotent receipt. Busy and timeout responses are 503/504; the game must keep local play working. Configure database connection TLS as required by the project's provider.

Maintain retention through an explicitly reviewed operational job: prune stale rate buckets and expired unsubmitted runs; retain accepted run receipts for the product's advertised retry/audit window. Expired guest players referenced by scores must be retained for display/identity history (credential expiry alone disables login). Do not delete best entries when releasing or rolling back code. Set retention and abuse limits for expected traffic before launch.


## Shared database and deployment contract

The selected integration's migration command creates the schema ledger and applies checked-in SQL to the managed
project database: Three.js uses `npm --prefix server run db:migrate:leaderboard`, Godot uses
`npm --prefix server run db:migrate`. Migration `002_deployment_contract.sql` records the server-owned `production` namespace and
schema version. A checkpoint database branch inherits that identity and schema. Runtime code must not
modify the identity row, migration ledger or board definitions. Leaderboard readiness at
`/api/leaderboards/v1/health` requires a matching database
identity, migration columns and readable declared boards; an HTTP listener alone cannot make the API
ready. No migration or seed runs on process startup or Publish.

`GET /api/health` is the database-independent container startup probe. It returns `{ "status": "ok" }`
before database request admission, even when the database is slow, unavailable or all leaderboard slots
are occupied. Keep the database checks on `/api/leaderboards/v1/health`; do not replace their failures
with a successful response. Verify business readiness and a ranked run in checkpoint Preview and the
published API before claiming leaderboard acceptance. Deployment success alone proves neither.

Existing generated games are not upgraded by this reference update. Preserve their custom backend,
add or reuse the lightweight startup handler, and update managed `config/deploy` to `/api/health`.
For Godot, also align the project-root backend declaration and the entrypoint's expected health path
before preparing a new checkpoint. Do not rewrite an existing checkpoint or rerun an installer over
custom code. Retain the business readiness endpoint and use the normal checkpoint/publish workflow.

Protocol v1 requires an explicit matching rules version when issuing a run. Old clients without that
binding receive HTTP 426 `client_upgrade_required`; show a refresh/upgrade message while retaining
offline play. The Godot adapter then blocks further ranked writes until reloaded, preserves the guest
identity, and allows board reads. It does not refresh the page or change scoring rules automatically.
A run records protocol/rules together with its server-selected namespace, board, player
and expiry. Changed rules invalidate outstanding runs with 409; changed art/code does not. Existing
successful receipts remain idempotent. Pre-migration unsubmitted runs have no binding and are rejected.
Keep supported board definitions immutable and available across releases. The supported rollback
window starts with versions implementing this contract; do not roll back to an API that rejects the
new client request fields while those clients remain open.

Publish the static site and container from the same checkpoint using managed hybrid. Static upload
is only candidate readiness. Host combines frontend and backend status, retains the previous successful
site/API pair until both succeed, and commits pending routes with the successful deployment. A failed
half keeps the old pair live; report the candidate failure and retry through normal Publish. This relies
on the managed Host successful-snapshot contract, not the availability of the candidate's static URL.
Additive schema remains in place after a failed deploy or code rollback. Never undo migrations by
deleting player data. Verify real routing, health and failure recovery before public launch.

## Godot checkpoint compatibility declaration

This release declaration is Godot-only. Three.js uses the normal Web checkpoint and hybrid publication
flow, with its declared boards and account configuration checked by `/api/leaderboards/v1/health`.

Copy `game-backend-contract.example.json` to the game project root as
`game-backend-contract.json` and set its actual config routes, Dockerfile/health paths,
protocol/schema and board rules. The current reference supports protocol 1/schema 2 and
`/api/health` as the deployment probe; changing the declaration cannot add backend support.
Launch the reference with the project root as cwd. Its Dockerfile copies the declaration
into the container work directory. Runtime validates the same parser used by release
preflight; `/api/leaderboards/v1/health` rejects missing or mismatched board rules and schema. Migration execution
remains an explicit finite command. Data is never rolled back by these checks.

The file allows at most 16 KiB, 64 ordered routes and 64 distinct boards. Unknown fields
are rejected. `deploy.port` is not supported: hosting injects PORT. Release binds the file
by SHA256; this Godot leaderboard backend requires that binding and an exact deployment-path/route
match. A leaderboard release without its required declaration must be prepared as a new checkpoint;
its history remains readable. Generic Godot backends can publish with validated Webdev config
without a declaration; that does not make this reference server's board/rules input optional.
Web/Mobile/Three.js publication does not acquire this gate. A Godot game with backend features
must use hybrid publication, even if its output is static.
These checks do not establish full SQL type/index/privilege compatibility or atomic routing.
