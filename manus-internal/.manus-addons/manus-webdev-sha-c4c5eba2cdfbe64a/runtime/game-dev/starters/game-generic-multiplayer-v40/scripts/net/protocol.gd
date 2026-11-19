class_name PongProtocol
extends RefCounted

const BUILD := "pong-online-v3"
const MAX_MESSAGE_BYTES := 4096
# Court numbers from welcome and their accepted ranges; clients draw the ball with the server's rules.
const COURT_LIMITS := {
	"ball_radius": [0.001, 0.1], "paddle_half_height": [0.01, 0.5], "paddle_half_width": [0.001, 0.1],
	"left_x": [0.0, 0.5], "right_x": [0.5, 1.0], "max_ball_speed": [0.01, 4.0], "speedup": [1.0, 2.0],
	"bounce_angle": [0.0, 1.5], "spin": [0.0, 0.5],
}

static func is_number(value: Variant) -> bool:
	return (value is float or value is int) and is_finite(float(value))

static func is_uint(value: Variant) -> bool:
	return is_number(value) and float(value) >= 0 and float(value) <= 9007199254740991.0 and float(value) == floor(float(value))

static func valid_room(value: String) -> bool:
	if value.length() < 4 or value.length() > 8:
		return false
	for character in value:
		if not character in "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789":
			return false
	return true

static func decode(text: String, room: String, last_seq: int) -> Dictionary:
	if text.to_utf8_buffer().size() > MAX_MESSAGE_BYTES:
		return {}
	var raw: Variant = parse_packet(text)
	if not raw is Dictionary or raw.get("marker") != BUILD or raw.get("room") != room:
		return {}
	if raw.get("type") == "error":
		return raw if raw.get("code") == "invalid_message" else {}
	if raw.get("type") == "welcome":
		if raw.get("role") not in ["left", "right", "spectator"] or not raw.get("resume_token") is String:
			return {}
		if str(raw.resume_token).length() > 128 or (raw.role != "spectator" and str(raw.resume_token).length() < 16):
			return {}
		var movement: Variant = raw.get("movement")
		if not movement is Dictionary:
			return {}
		for key in ["speed", "min_y", "max_y"]:
			if not is_number(movement.get(key)):
				return {}
		if movement.speed <= 0 or movement.speed > 4 or movement.min_y < 0 or movement.max_y > 1 or movement.min_y >= movement.max_y:
			return {}
		var court: Variant = raw.get("court")
		if not court is Dictionary:
			return {}
		for key: String in COURT_LIMITS:
			var limits: Array = COURT_LIMITS[key]
			if not is_number(court.get(key)) or float(court[key]) < limits[0] or float(court[key]) > limits[1]:
				return {}
		return raw
	if raw.get("type") != "state" or not is_number(raw.get("seq")) or float(raw.seq) != floor(float(raw.seq)) or int(raw.seq) <= last_seq:
		return {}
	if raw.get("phase") not in ["live", "waiting"]:
		return {}
	for field in ["paddles", "players", "ball", "score", "event"]:
		if not raw.get(field) is Dictionary:
			return {}
	for side in ["left", "right"]:
		if not raw.paddles.get(side) is Dictionary or not is_number(raw.paddles[side].get("y")):
			return {}
		if float(raw.paddles[side].y) < 0 or float(raw.paddles[side].y) > 1 or not raw.players.get(side) is bool:
			return {}
		var paddle: Dictionary = raw.paddles[side]
		if not is_number(paddle.get("vy")) or absf(float(paddle.vy)) > 4 or not is_uint(paddle.get("ack_seq")) or not is_uint(paddle.get("sent_msec")):
			return {}
		if not is_number(raw.score.get(side)) or float(raw.score[side]) < 0 or float(raw.score[side]) != floor(float(raw.score[side])):
			return {}
	for axis in ["x", "y"]:
		if not is_number(raw.ball.get(axis)) or float(raw.ball[axis]) < -0.1 or float(raw.ball[axis]) > 1.1:
			return {}
		if not is_number(raw.ball.get("v" + axis)) or absf(float(raw.ball["v" + axis])) > 4:
			return {}
	# Optional: a pending serve the server announces ahead of time.
	if raw.has("serve"):
		if not raw.serve is Dictionary or not is_number(raw.serve.get("in_ms")) or float(raw.serve.in_ms) < 0 or float(raw.serve.in_ms) > 10000:
			return {}
		for axis in ["vx", "vy"]:
			if not is_number(raw.serve.get(axis)) or absf(float(raw.serve[axis])) > 4:
				return {}
	if not is_number(raw.event.get("seq")) or float(raw.event.seq) < 0 or float(raw.event.seq) != floor(float(raw.event.seq)) or raw.event.get("kind") not in ["", "wall", "paddle", "score"]:
		return {}
	return raw

static func parse_packet(text: String) -> Dictionary:
	if text.to_utf8_buffer().size() > MAX_MESSAGE_BYTES:
		return {}
	var parser := JSON.new()
	if parser.parse(text) != OK:
		return {}
	var raw: Variant = parser.data
	if not raw is Dictionary or raw.get("type") not in ["welcome", "state", "error"]:
		return {}
	return raw

static func normalize_state(message: Dictionary) -> Dictionary:
	return decode(JSON.stringify(message), str(message.get("room", "")), -1)
