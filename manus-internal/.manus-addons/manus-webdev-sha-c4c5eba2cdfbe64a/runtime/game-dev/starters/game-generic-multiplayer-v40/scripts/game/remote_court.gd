# Present-time presentation of server-owned objects: the ball and every paddle this client does not move.
# The server still decides bounces and points; this copy only decides where they are drawn now.
extends RefCounted

const MAX_LEAD := 0.2         # Longest projection from a snapshot to the present.
const STALE_AFTER := 0.5      # Stop moving remote objects when snapshots stop.
const BALL_SNAP := 0.04       # About one ball width plus jitter: jump instead of fading.
const PADDLE_SNAP := 0.20     # About one paddle height, as in local_paddle.gd.
const MAX_STEP := 1.0 / 120.0 # Sub-step so a fast ball cannot skip a paddle plane.

var court := {
	"ball_radius": 0.014, "paddle_half_height": 0.11, "paddle_half_width": 0.012, "left_x": 0.05, "right_x": 0.95,
	"max_ball_speed": 0.72, "speedup": 1.035, "bounce_angle": 0.88, "spin": 0.08,
}
var min_y := 0.11
var max_y := 0.89
var own_side := ""
var ball := Vector2(0.5, 0.5)
var ball_velocity := Vector2.ZERO
var ball_offset := Vector2.ZERO
var _serve_wait := -1.0       # Seconds until an announced serve starts at the present; negative: none.
var _serve_velocity := Vector2.ZERO
var initialized := false
var _live := false
var _lead := 0.0
var _age := 0.0
var _own_y := 0.5
var _own_axis := 0.0
var _server_y := {"left": 0.5, "right": 0.5}
var _server_vy := {"left": 0.0, "right": 0.0}
var _paddle_offset := {"left": 0.0, "right": 0.0}


func configure(side: String, movement: Dictionary, court_numbers: Dictionary) -> void:
	own_side = side if side in ["left", "right"] else ""
	min_y = float(movement.get("min_y", min_y))
	max_y = float(movement.get("max_y", max_y))
	for key: String in court:
		court[key] = float(court_numbers.get(key, court[key]))
	reset()


func reset() -> void:
	initialized = false
	_live = false
	_lead = 0.0
	_age = 0.0
	ball_velocity = Vector2.ZERO
	ball_offset = Vector2.ZERO
	_serve_wait = -1.0
	_paddle_offset = {"left": 0.0, "right": 0.0}


func set_own(y: float, axis: float) -> void:
	_own_y = y
	_own_axis = axis


# lead: this client's one-way latency; the snapshot describes the court that long ago.
func accept(snapshot: Dictionary, live: bool, lead: float) -> void:
	var paddles: Dictionary = snapshot.get("paddles", {})
	var before := {"left": _projected("left"), "right": _projected("right")}
	for side: String in ["left", "right"]:
		var paddle: Dictionary = paddles.get(side, {})
		_server_y[side] = clampf(float(paddle.get("y", 0.5)), min_y, max_y)
		_server_vy[side] = float(paddle.get("vy", 0.0)) if live else 0.0
	_lead = clampf(lead, 0.0, MAX_LEAD) if live else 0.0
	_age = 0.0
	for side: String in ["left", "right"]:
		# Keep the drawn paddle where it was and fade the error, unless it is too far off.
		var offset: float = _paddle_offset[side] + before[side] - _projected(side) if initialized and live else 0.0
		_paddle_offset[side] = offset if absf(offset) <= PADDLE_SNAP else 0.0
	var data: Dictionary = snapshot.get("ball", {})
	var position := Vector2(float(data.get("x", 0.5)), float(data.get("y", 0.5)))
	var velocity := Vector2(float(data.get("vx", 0.0)), float(data.get("vy", 0.0))) if live else Vector2.ZERO
	var serve: Dictionary = snapshot.get("serve", {}) if live else {}
	_serve_wait = -1.0
	var now: Array
	if velocity == Vector2.ZERO and not serve.is_empty():
		# An announced serve starts at the same present moment on every client, so nothing has to catch up.
		var serve_velocity := Vector2(float(serve.get("vx", 0.0)), float(serve.get("vy", 0.0)))
		var wait := float(serve.get("in_ms", 0.0)) / 1000.0 - _lead
		if wait > 0.0:
			now = [position, Vector2.ZERO]
			_serve_wait = wait
			_serve_velocity = serve_velocity
		else:
			now = _simulate(position, serve_velocity, -wait, [])
	else:
		now = _simulate(position, velocity, _lead, [])
	var error: Vector2 = ball - now[0]
	var projected_velocity: Vector2 = now[1]
	ball_offset = ball_offset + error if initialized and _live and live else Vector2.ZERO
	# An unannounced launch from rest trails by up to speed x lead: fade that instead of jumping.
	var launch := ball_velocity == Vector2.ZERO and projected_velocity != Vector2.ZERO
	if ball_offset.length() > BALL_SNAP + (projected_velocity.length() * _lead if launch else 0.0):
		ball_offset = Vector2.ZERO
	ball = now[0]
	ball_velocity = projected_velocity
	_live = live
	initialized = true


# Moves the drawn court to the present and returns the contacts drawn this frame.
func advance(delta: float, smoothing: float) -> Array[String]:
	var contacts: Array[String] = []
	if not initialized:
		return contacts
	var dt := clampf(delta, 0.0, 0.05)
	var fade := exp(-dt * smoothing)
	ball_offset *= fade
	for side: String in ["left", "right"]:
		_paddle_offset[side] *= fade
	_age += maxf(delta, 0.0)
	if not _live or _age > STALE_AFTER:
		return contacts
	var step := dt
	if _serve_wait >= 0.0 and ball_velocity == Vector2.ZERO:
		_serve_wait -= dt
		if _serve_wait > 0.0:
			return contacts
		step = -_serve_wait # The part of this frame after the serve.
		ball_velocity = _serve_velocity
		_serve_wait = -1.0
	var next: Array = _simulate(ball, ball_velocity, step, contacts)
	ball = next[0]
	ball_velocity = next[1]
	return contacts


func drawn_ball() -> Vector2:
	return ball + ball_offset


func paddle(side: String) -> float:
	if side == own_side:
		return _own_y
	return clampf(_projected(side) + _paddle_offset[side], min_y, max_y)


func _projected(side: String) -> float:
	return clampf(_server_y[side] + _server_vy[side] * minf(_lead + _age, MAX_LEAD), min_y, max_y)


# The server's ball rules (authoritative_server.mjs tick and collidePaddle) against the drawn paddles.
func _simulate(position: Vector2, velocity: Vector2, seconds: float, contacts: Array) -> Array:
	var remaining := seconds
	while remaining > 0.0 and velocity != Vector2.ZERO:
		var dt := minf(remaining, MAX_STEP)
		remaining -= dt
		var r: float = court.ball_radius
		var previous_x := position.x
		position += velocity * dt
		if position.y - r <= 0.0 and velocity.y < 0.0:
			position.y = r
			velocity.y = absf(velocity.y)
			contacts.append("wall")
		elif position.y + r >= 1.0 and velocity.y > 0.0:
			position.y = 1.0 - r
			velocity.y = -absf(velocity.y)
			contacts.append("wall")
		for side: String in ["left", "right"]:
			var hit := _paddle_hit(side, previous_x, position, velocity)
			if not hit.is_empty():
				position = hit[0]
				velocity = hit[1]
				contacts.append("paddle")
		if position.x < -r or position.x > 1.0 + r:
			velocity = Vector2.ZERO # Past a goal line: wait for the server's point.
	return [position, velocity]


func _paddle_hit(side: String, previous_x: float, position: Vector2, velocity: Vector2) -> Array:
	var is_left := side == "left"
	if (is_left and velocity.x >= 0.0) or (not is_left and velocity.x <= 0.0):
		return []
	var r: float = court.ball_radius
	var half_height: float = court.paddle_half_height
	var plane: float = court.left_x + court.paddle_half_width if is_left else court.right_x - court.paddle_half_width
	var crossed := (previous_x - r > plane and position.x - r <= plane) if is_left else (previous_x + r < plane and position.x + r >= plane)
	var paddle_y := paddle(side)
	if not crossed or absf(position.y - paddle_y) > half_height + r:
		return []
	var offset := clampf((position.y - paddle_y) / half_height, -1.0, 1.0)
	var speed := minf(court.max_ball_speed, velocity.length() * court.speedup)
	var input := _own_axis if side == own_side else signf(_server_vy[side])
	var angle: float = offset * court.bounce_angle + input * court.spin
	var x := plane + (r if is_left else -r)
	return [Vector2(x, position.y), Vector2(cos(angle) * speed * (1.0 if is_left else -1.0), sin(angle) * speed)]
