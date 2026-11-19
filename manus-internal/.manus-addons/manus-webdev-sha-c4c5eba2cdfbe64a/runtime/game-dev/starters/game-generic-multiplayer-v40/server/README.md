# Pong authoritative service

Deployment and cloud-computer operations are owned by [the shared multiplayer guide](../docs/game-multiplayer.md).
This directory owns only Pong's protocol and executable service. It is deployed separately from the
Addon static client; installing this template does not provision a computer or start the service.

- Node 22+, pinned pnpm dependencies: `pnpm install --frozen-lockfile --prod`.
- Run `HOST=127.0.0.1 PORT=8787 node authoritative_server.mjs` after verifying the chosen port.
- `ALLOWED_ORIGINS` is a comma-separated list of exact browser origins permitted in addition to the
  same-origin deployment. Native clients do not send Origin. Origin checks are not account authentication.
- Optional `STATIC_ROOT` serves a complete frozen Web release. Default is `../site` relative to this
  directory. Server source and private configuration must never be placed in the static root.
- `GET /healthz` reports process availability. `/ws?room=ABCD` connects a client. Room codes are 4–8
  ASCII letters/digits and public invitations; this reference does not implement private rooms.

## Protocol: pong-online-v3

`welcome` contains `marker`, `room`, `role` (`left`, `right`, `spectator`) and a private `resume_token`.
`error` carries the same marker/room and the stable code `invalid_message`; clients display a localized reconnect prompt.
Reconnect adds that token as `resume` to the same endpoint and room. Do not log request queries or share
this token. A resumed seat immediately invalidates the previous socket's input authority.

`input` has a numeric `value` of -1, 0 or 1; the server only accepts it from the seat's current socket.
The client sends at once when the value changes (at most every 33 ms) and otherwise every 50 ms, with a strictly increasing positive safe-integer `seq`
and nonnegative safe-integer `sent_msec` from its monotonic clock. Invalid or repeated sequences are
ignored. Input is the current axis, not a scored action. After 500 ms without new valid input the
server releases it. Server movement, collisions and points never use client coordinates or time.
`welcome.movement` supplies `speed`, `min_y` and `max_y`. `welcome.court` supplies the ball rules
(`ball_radius`, `paddle_half_height`, `paddle_half_width`, `left_x`, `right_x`, `max_ball_speed`, `speedup`,
`bounce_angle`, `spin`) so clients can draw the ball at the present; the server still decides every bounce. Each paddle snapshot includes `vy`,
`ack_seq` and `sent_msec` from the last input applied by a simulation tick. The timestamp is echoed
only so that the owning client can estimate RTT without clock synchronization; it is not authority.
A new/resumed socket starts a fresh sequence. Each marker pairs one client with one service;
upgrading from `pong-online-v1` or `pong-online-v2` requires deploying the matching v3 client and service.

`state` contains monotonically increasing `seq`, `phase` (`waiting`/`live`), `players.left/right`,
`paddles.left/right.y`, `ball.x/y/vx/vy`, `score.left/right`, `event.seq/kind` and `server_time`.
Coordinates use a normalized 0–1 court. The fixed simulation is 60 Hz; snapshots are 30 Hz, plus one at
once after each bounce or point. Paddle half-height is 0.11, half-width 0.012, centers x=0.05/0.95 and speed 0.74 court-heights/s.
Ball radius is 0.014; initial speed 0.48. After a point the server waits 650 ms before serving again.
While a serve is pending, `state` also has `serve.in_ms/vx/vy`: the time until the serve and its velocity.
Clients start the ball when `in_ms` minus their one-way latency has passed, so the serve never catches up.
The field is optional: v3 clients and services without it still pair.
Rendering aspect scales these world dimensions; do not use visual pixels to calculate collision.

Disconnected seats are reserved for 60 seconds; simulation waits for both players. Empty rooms expire
after ten minutes. Spectators are not automatically seated: after the grace period, use **Retry connection**
to reconnect and claim an available seat. Reconnecting during grace may still return a spectator role.
Process restart loses rooms/scores; new welcome resets client sequence tracking.
Capacity is bounded to 128 rooms, 256 connections and eight observers per room. Inputs have a 4096-byte
limit and 60-message/s ceiling. Slow clients and missed heartbeats are disconnected. This is a bounded
MVP, not internet-scale matchmaking, persistent identity, ranked play or a DDoS protection service.

## Checks

`pnpm test` starts an isolated process on port 0 and verifies the protocol, seat ownership, room isolation,
spectators and reconnection. `pnpm test:e2e -- wss://VERIFIED_HOST/ws` targets an explicitly chosen public
service and creates a temporary room; it is a separate deployment acceptance operation.
