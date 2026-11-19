class_name FxLayer
extends Node2D
## Lightweight textured particles, additive glow and pop-up comic stickers.
## Works in world space (under the battlefield) or screen space (inside a CanvasLayer for HUD juice).

signal particle_arrived(tag: StringName)

const TEX := {
	&"smoke_a": preload("res://assets/template/game/fx/smoke_a.png"),
	&"smoke_b": preload("res://assets/template/game/fx/smoke_b.png"),
	&"dust": preload("res://assets/template/game/fx/dust.png"),
	&"flame": preload("res://assets/template/game/fx/flame.png"),
	&"ember": preload("res://assets/template/game/fx/ember.png"),
	&"ice_shard": preload("res://assets/template/game/fx/ice_shard.png"),
	&"snowflake": preload("res://assets/template/game/fx/snowflake.png"),
	&"psi_swirl": preload("res://assets/template/game/fx/psi_swirl.png"),
	&"book": preload("res://assets/template/game/fx/book.png"),
	&"star": preload("res://assets/template/game/fx/star.png"),
	&"coin": preload("res://assets/template/game/fx/coin.png"),
	&"heart": preload("res://assets/template/game/fx/heart.png"),
	&"plus": preload("res://assets/template/game/fx/plus.png"),
	&"confetti_gold": preload("res://assets/template/game/fx/confetti_gold.png"),
	&"confetti_maroon": preload("res://assets/template/game/fx/confetti_maroon.png"),
	&"leaf": preload("res://assets/template/game/fx/leaf.png"),
	&"portal": preload("res://assets/template/game/fx/portal.png"),
}
const STICKERS := {
	&"ko": preload("res://assets/template/game/fx/sticker_ko.png"),
	&"burst": preload("res://assets/template/game/fx/sticker_burst.png"),
	&"bubble": preload("res://assets/template/game/fx/sticker_bubble.png"),
	&"levelup": preload("res://assets/template/game/fx/sticker_levelup.png"),
	&"sproing": preload("res://assets/template/game/fx/sticker_sproing.png"),
	&"kaboom": preload("res://assets/template/game/fx/sticker_kaboom.png"),
	&"warning": preload("res://assets/template/game/fx/sticker_warning.png"),
	&"help": preload("res://assets/template/game/fx/sticker_help.png"),
	&"combo": preload("res://assets/template/game/fx/sticker_combo.png"),
}
const MAX_PARTICLES := 900
const MAX_STICKERS := 24
const INK := Color("1c1320")
const PAPER := Color("fff6df")

var reduced_motion := false
## Multiplies particle counts (lowered on small/touch screens).
var density := 1.0
var screen_space := false

var _glow: Node2D
var _normal: Node2D
var _top: Node2D
var _particles: Array[Dictionary] = []
var _stickers: Array[Dictionary] = []
var _flashes: Array[Dictionary] = []
var _rng := RandomNumberGenerator.new()
var _display_font: Font


func _ready() -> void:
	_rng.seed = 0x46584C
	_display_font = load("res://assets/template/game/fonts/display.tres") as Font
	_glow = Node2D.new()
	_glow.name = "Glow"
	var additive := CanvasItemMaterial.new()
	additive.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
	_glow.material = additive
	_glow.z_index = 16 if not screen_space else 0
	_glow.draw.connect(_draw_layer.bind(true))
	add_child(_glow)
	_normal = Node2D.new()
	_normal.name = "Particles"
	_normal.z_index = 17 if not screen_space else 1
	_normal.draw.connect(_draw_layer.bind(false))
	add_child(_normal)
	_top = Node2D.new()
	_top.name = "Stickers"
	_top.z_index = 26 if not screen_space else 2
	_top.draw.connect(_draw_stickers)
	add_child(_top)


func clear() -> void:
	_particles.clear()
	_stickers.clear()
	_flashes.clear()


func particle_count() -> int:
	return _particles.size()


func sticker_count() -> int:
	return _stickers.size()


func _process(delta: float) -> void:
	if _particles.is_empty() and _stickers.is_empty() and _flashes.is_empty():
		return
	var alive: Array[Dictionary] = []
	for p: Dictionary in _particles:
		p["t"] = float(p["t"]) + delta
		var life := float(p["life"])
		if float(p["t"]) >= life:
			if p.has("tag"):
				particle_arrived.emit(p["tag"])
			continue
		if p.has("target"):
			var u := clampf(float(p["t"]) / life, 0.0, 1.0)
			var eased := u * u * (3.0 - 2.0 * u)
			var start: Vector2 = p["start"]
			var control: Vector2 = p["control"]
			var target: Vector2 = p["target"]
			var a := start.lerp(control, eased)
			var b := control.lerp(target, eased)
			p["pos"] = a.lerp(b, eased)
		else:
			var velocity: Vector2 = p["vel"]
			velocity += Vector2(0.0, float(p["grav"])) * delta
			velocity *= maxf(0.0, 1.0 - float(p["drag"]) * delta)
			p["vel"] = velocity
			p["pos"] = (p["pos"] as Vector2) + velocity * delta
		p["rot"] = float(p["rot"]) + float(p["spin"]) * delta
		alive.append(p)
	_particles = alive
	var stickers: Array[Dictionary] = []
	for s: Dictionary in _stickers:
		s["t"] = float(s["t"]) + delta
		if float(s["t"]) < float(s["dur"]):
			stickers.append(s)
	_stickers = stickers
	var flashes: Array[Dictionary] = []
	for f: Dictionary in _flashes:
		f["t"] = float(f["t"]) + delta
		if float(f["t"]) < float(f["dur"]):
			flashes.append(f)
	_flashes = flashes
	_glow.queue_redraw()
	_normal.queue_redraw()
	_top.queue_redraw()


# ---------------------------------------------------------------- drawing

func _draw_layer(glow: bool) -> void:
	var canvas := _glow if glow else _normal
	for f: Dictionary in _flashes:
		if bool(f["glow"]) != glow:
			continue
		var t := float(f["t"]) / float(f["dur"])
		var radius := float(f["radius"]) * (0.5 + 0.5 * t)
		var color: Color = f["color"]
		canvas.draw_set_transform(f["pos"], 0.0, Vector2(1.0, float(f.get("squash", 0.5))))
		canvas.draw_circle(Vector2.ZERO, radius, Color(color, color.a * (1.0 - t)))
		canvas.draw_circle(Vector2.ZERO, radius * 0.55, Color(color.lightened(0.5), color.a * (1.0 - t) * 0.8))
	for p: Dictionary in _particles:
		if bool(p["glow"]) != glow:
			continue
		var u := float(p["t"]) / float(p["life"])
		var size := lerpf(float(p["s0"]), float(p["s1"]), u)
		var color: Color = p["color"]
		var alpha := color.a
		var fade_in := float(p.get("fade_in", 0.08))
		if u < fade_in:
			alpha *= u / fade_in
		elif u > float(p["fade"]):
			alpha *= 1.0 - (u - float(p["fade"])) / maxf(1.0 - float(p["fade"]), 0.001)
		var texture: Texture2D = TEX[p["tex"]]
		canvas.draw_set_transform(p["pos"], float(p["rot"]), Vector2.ONE)
		canvas.draw_texture_rect(texture, Rect2(Vector2(-size, -size) * 0.5, Vector2(size, size)), false, Color(color, alpha))
	canvas.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)


func _draw_stickers() -> void:
	for s: Dictionary in _stickers:
		var t := float(s["t"])
		var dur := float(s["dur"])
		var pop := _pop_curve(t)
		var alpha := 1.0 - clampf((t - dur + 0.25) / 0.25, 0.0, 1.0)
		var wobble := 0.0 if reduced_motion else sin(t * 14.0) * 0.06 * maxf(0.0, 1.0 - t * 2.0)
		var rise := Vector2(0.0, -float(s.get("rise", 26.0)) * clampf(t / dur, 0.0, 1.0))
		var size := float(s["size"]) * pop
		var center: Vector2 = (s["pos"] as Vector2) + rise
		_top.draw_set_transform(center, float(s.get("tilt", 0.0)) + wobble, Vector2.ONE)
		if s.has("tex"):
			var texture: Texture2D = STICKERS[s["tex"]]
			var aspect := float(texture.get_height()) / float(texture.get_width())
			_top.draw_texture_rect(texture, Rect2(Vector2(-size, -size * aspect) * 0.5, Vector2(size, size * aspect)), false, Color(1, 1, 1, alpha))
		var text := String(s.get("text", ""))
		if text != "":
			var font_size := int(round(float(s.get("font", 28.0)) * pop))
			var text_size := _display_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size)
			var origin := Vector2(-text_size.x * 0.5, _display_font.get_ascent(font_size) * 0.38 + float(s.get("text_dy", 0.0)))
			var fill: Color = s.get("color", PAPER)
			_top.draw_string_outline(_display_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, 8, Color(INK, alpha))
			_top.draw_string(_display_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, Color(fill, alpha))
	_top.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)


func _pop_curve(t: float) -> float:
	if reduced_motion:
		return 1.0
	if t < 0.12:
		return lerpf(0.2, 1.25, t / 0.12)
	if t < 0.24:
		return lerpf(1.25, 0.94, (t - 0.12) / 0.12)
	if t < 0.34:
		return lerpf(0.94, 1.0, (t - 0.24) / 0.1)
	return 1.0


# ---------------------------------------------------------------- emitters

func _count(base: int) -> int:
	var scaled := float(base) * density * (0.4 if reduced_motion else 1.0)
	return maxi(1, int(round(scaled)))


func particle(tex: StringName, pos: Vector2, vel: Vector2, life: float, s0: float, s1: float, color: Color = Color.WHITE, options: Dictionary = {}) -> void:
	if _particles.size() >= MAX_PARTICLES:
		_particles.pop_front()
	var p := {
		"tex": tex, "pos": pos, "vel": vel, "life": maxf(life, 0.05), "t": 0.0, "s0": s0, "s1": s1, "color": color,
		"grav": float(options.get("grav", 0.0)), "drag": float(options.get("drag", 1.5)),
		"rot": float(options.get("rot", _rng.randf() * TAU)), "spin": float(options.get("spin", _rng.randf_range(-3.0, 3.0))),
		"fade": float(options.get("fade", 0.55)), "glow": bool(options.get("glow", false)),
		"fade_in": float(options.get("fade_in", 0.08)),
	}
	if options.has("target"):
		p["target"] = options["target"]
		p["start"] = pos
		p["control"] = options.get("control", pos.lerp(options["target"], 0.5) + Vector2(0, -120))
	if options.has("tag"):
		p["tag"] = options["tag"]
	_particles.append(p)


func flash(pos: Vector2, radius: float, color: Color, dur: float = 0.25, glow: bool = true, squash: float = 0.5) -> void:
	if reduced_motion:
		dur *= 0.6
	_flashes.append({"pos": pos, "radius": radius, "color": color, "dur": dur, "t": 0.0, "glow": glow, "squash": squash})


func sticker(key: StringName, pos: Vector2, size: float, dur: float = 0.9, options: Dictionary = {}) -> void:
	var entry := options.duplicate()
	if key != &"":
		entry["tex"] = key
	entry["pos"] = pos
	entry["size"] = size
	entry["dur"] = dur
	entry["t"] = 0.0
	if not entry.has("tilt"):
		entry["tilt"] = _rng.randf_range(-0.14, 0.14)
	_stickers.append(entry)
	while _stickers.size() > MAX_STICKERS:
		_stickers.pop_front()


func sticker_slot_free(pos: Vector2, spacing: float = 110.0, small_limit: int = 4) -> bool:
	var small := 0
	for s: Dictionary in _stickers:
		if (s["pos"] as Vector2).distance_to(pos) < spacing:
			return false
		if float(s["size"]) < 150.0:
			small += 1
	return small < small_limit


func burst(tex: StringName, pos: Vector2, count: int, speed: Vector2, life: Vector2, size: Vector2, color: Color = Color.WHITE, options: Dictionary = {}) -> void:
	var spread := float(options.get("spread", TAU))
	var direction := float(options.get("direction", -PI * 0.5))
	var squash := float(options.get("squash", 0.6))
	for index in _count(count):
		var angle := direction + _rng.randf_range(-spread * 0.5, spread * 0.5)
		var magnitude := _rng.randf_range(speed.x, speed.y)
		var vel := Vector2(cos(angle), sin(angle) * squash) * magnitude
		var jitter := float(options.get("jitter", 6.0))
		var start := pos + Vector2(_rng.randf_range(-jitter, jitter), _rng.randf_range(-jitter, jitter) * 0.6)
		var s := _rng.randf_range(size.x, size.y)
		particle(tex, start, vel, _rng.randf_range(life.x, life.y), s, s * float(options.get("grow", 1.0)), color, options)


## Named effect recipes shared by the battlefield and HUD.
func preset(name: StringName, pos: Vector2, scale: float = 1.0) -> void:
	match name:
		&"hit":
			burst(&"star", pos, 3, Vector2(90, 180) * scale, Vector2(0.18, 0.32), Vector2(10, 16) * scale, Color("fff2b0"), {"glow": true, "drag": 4.0})
		&"hit_fire":
			burst(&"ember", pos, 5, Vector2(80, 200) * scale, Vector2(0.25, 0.5), Vector2(12, 20) * scale, Color.WHITE, {"glow": true, "grav": -60.0})
		&"hit_ice":
			burst(&"ice_shard", pos, 4, Vector2(90, 190) * scale, Vector2(0.3, 0.5), Vector2(12, 18) * scale, Color.WHITE, {"grav": 260.0, "drag": 1.0})
		&"hit_psi":
			burst(&"psi_swirl", pos, 2, Vector2(20, 60) * scale, Vector2(0.3, 0.5), Vector2(18, 30) * scale, Color(1, 1, 1, 0.9), {"glow": true, "grow": 1.8, "spin": 6.0})
		&"hit_zap":
			burst(&"star", pos, 3, Vector2(60, 150) * scale, Vector2(0.15, 0.25), Vector2(8, 13) * scale, Color("c6ff5a"), {"glow": true, "drag": 5.0})
		&"punch":
			burst(&"dust", pos + Vector2(0, 26) * scale, 3, Vector2(40, 90) * scale, Vector2(0.35, 0.55), Vector2(22, 34) * scale, Color(1, 1, 1, 0.8), {"grow": 1.6, "squash": 0.35, "spread": PI, "direction": 0.0})
			flash(pos, 26.0 * scale, Color(1, 0.95, 0.7, 0.8), 0.14, true, 1.0)
		&"ko":
			burst(&"smoke_a", pos, 6, Vector2(60, 140) * scale, Vector2(0.45, 0.8), Vector2(34, 54) * scale, Color(1, 1, 1, 0.9), {"grow": 1.7, "grav": -30.0, "drag": 3.0})
			burst(&"star", pos + Vector2(0, -20), 6, Vector2(140, 260) * scale, Vector2(0.4, 0.7), Vector2(14, 22) * scale, Color.WHITE, {"grav": 320.0, "drag": 0.8, "glow": true})
			flash(pos, 60.0 * scale, Color(1, 0.9, 0.55, 0.7), 0.2)
		&"coins":
			burst(&"coin", pos, 5, Vector2(120, 220) * scale, Vector2(0.55, 0.8), Vector2(18, 24) * scale, Color.WHITE, {"grav": 520.0, "drag": 0.5, "spin": 8.0, "direction": -PI * 0.5, "spread": 1.8, "squash": 1.0})
		&"smoke":
			burst(&"smoke_b", pos, 4, Vector2(20, 60) * scale, Vector2(0.6, 1.0), Vector2(30, 44) * scale, Color(1, 1, 1, 0.75), {"grow": 1.8, "grav": -40.0})
		&"explosion":
			flash(pos, 110.0 * scale, Color(1.0, 0.55, 0.15, 0.9), 0.3)
			burst(&"flame", pos, 10, Vector2(120, 300) * scale, Vector2(0.3, 0.6), Vector2(30, 50) * scale, Color.WHITE, {"glow": true, "grow": 1.5, "grav": -120.0, "drag": 3.0})
			burst(&"smoke_a", pos, 8, Vector2(60, 180) * scale, Vector2(0.7, 1.2), Vector2(44, 70) * scale, Color(0.55, 0.5, 0.5, 0.85), {"grow": 1.9, "grav": -50.0, "drag": 2.2})
			burst(&"ember", pos, 12, Vector2(200, 420) * scale, Vector2(0.5, 0.9), Vector2(10, 16) * scale, Color.WHITE, {"glow": true, "grav": 420.0, "drag": 0.6})
		&"fireball":
			preset(&"explosion", pos, scale * 0.9)
			burst(&"flame", pos, 8, Vector2(40, 90) * scale, Vector2(0.6, 1.0), Vector2(28, 40) * scale, Color.WHITE, {"glow": true, "grav": -160.0, "spread": 1.2, "jitter": 40.0})
		&"ice_nova":
			flash(pos, 150.0 * scale, Color(0.55, 0.85, 1.0, 0.7), 0.4)
			burst(&"ice_shard", pos, 14, Vector2(180, 340) * scale, Vector2(0.4, 0.7), Vector2(18, 28) * scale, Color.WHITE, {"drag": 3.0, "squash": 0.5})
			burst(&"snowflake", pos, 12, Vector2(30, 110) * scale, Vector2(0.9, 1.6), Vector2(14, 22) * scale, Color.WHITE, {"grav": 30.0, "jitter": 70.0, "spin": 2.0})
		&"psi_lift":
			flash(pos, 130.0 * scale, Color(0.65, 0.35, 1.0, 0.65), 0.45)
			burst(&"psi_swirl", pos, 5, Vector2(10, 40) * scale, Vector2(0.7, 1.1), Vector2(40, 60) * scale, Color(1, 1, 1, 0.9), {"glow": true, "grow": 2.0, "spin": 5.0, "jitter": 40.0})
			burst(&"book", pos, 6, Vector2(60, 140) * scale, Vector2(0.8, 1.3), Vector2(22, 30) * scale, Color.WHITE, {"grav": -90.0, "spin": 4.0, "jitter": 50.0})
		&"rubber_slam":
			flash(pos, 150.0 * scale, Color(1.0, 0.8, 0.25, 0.75), 0.3)
			burst(&"dust", pos, 14, Vector2(160, 320) * scale, Vector2(0.45, 0.8), Vector2(34, 52) * scale, Color(1, 1, 1, 0.9), {"grow": 1.6, "squash": 0.4, "drag": 3.0})
			burst(&"star", pos + Vector2(0, -30), 6, Vector2(160, 260) * scale, Vector2(0.4, 0.6), Vector2(14, 20) * scale, Color.WHITE, {"grav": 360.0, "glow": true})
		&"dash":
			burst(&"dust", pos, 6, Vector2(60, 140) * scale, Vector2(0.35, 0.6), Vector2(22, 32) * scale, Color(1, 1, 1, 0.85), {"grow": 1.5, "squash": 0.35})
			burst(&"star", pos + Vector2(0, -40), 4, Vector2(80, 160) * scale, Vector2(0.3, 0.5), Vector2(12, 16) * scale, Color("ffe07a"), {"glow": true})
		&"level_up":
			flash(pos, 90.0 * scale, Color(1.0, 0.85, 0.3, 0.8), 0.45, true, 0.5)
			burst(&"star", pos, 14, Vector2(60, 200) * scale, Vector2(0.8, 1.3), Vector2(14, 26) * scale, Color.WHITE, {"glow": true, "grav": -80.0, "direction": -PI * 0.5, "spread": 2.2, "drag": 1.2})
			burst(&"plus", pos, 5, Vector2(30, 80) * scale, Vector2(0.8, 1.1), Vector2(14, 20) * scale, Color.WHITE, {"grav": -120.0, "jitter": 26.0, "spin": 0.0, "rot": 0.0})
		&"heal":
			burst(&"plus", pos, 4, Vector2(20, 60) * scale, Vector2(0.7, 1.0), Vector2(12, 18) * scale, Color.WHITE, {"grav": -110.0, "jitter": 20.0, "spin": 0.0, "rot": 0.0})
			burst(&"heart", pos, 2, Vector2(20, 50) * scale, Vector2(0.8, 1.1), Vector2(14, 18) * scale, Color.WHITE, {"grav": -90.0, "jitter": 18.0, "spin": 0.5})
		&"confetti":
			for tex: StringName in [&"confetti_gold", &"confetti_maroon"]:
				burst(tex, pos, 14, Vector2(220, 480) * scale, Vector2(1.0, 1.8), Vector2(14, 22) * scale, Color.WHITE, {"grav": 380.0, "drag": 1.6, "spin": 9.0, "direction": -PI * 0.5, "spread": 2.4, "squash": 1.0})
		&"portal_puff":
			burst(&"smoke_b", pos, 5, Vector2(40, 110) * scale, Vector2(0.5, 0.9), Vector2(30, 46) * scale, Color(0.7, 1.0, 0.35, 0.85), {"grow": 1.7, "grav": -60.0})
			flash(pos, 70.0 * scale, Color(0.5, 1.0, 0.2, 0.7), 0.3)
		&"surge":
			burst(&"ember", pos, 4, Vector2(30, 80) * scale, Vector2(0.6, 1.0), Vector2(12, 18) * scale, Color(1, 0.9, 0.5), {"glow": true, "grav": -160.0, "jitter": 18.0})
		&"leaves":
			burst(&"leaf", pos, 6, Vector2(60, 160) * scale, Vector2(1.0, 1.6), Vector2(16, 24) * scale, Color.WHITE, {"grav": 90.0, "spin": 4.0, "jitter": 40.0})
		&"ui_pop":
			burst(&"star", pos, 6, Vector2(120, 240) * scale, Vector2(0.3, 0.5), Vector2(10, 16) * scale, Color.WHITE, {"glow": true, "drag": 3.5, "squash": 1.0})
			flash(pos, 40.0 * scale, Color(1, 0.9, 0.5, 0.7), 0.18, true, 1.0)
		&"ui_sparkle":
			burst(&"star", pos, 3, Vector2(40, 100) * scale, Vector2(0.3, 0.5), Vector2(8, 12) * scale, Color.WHITE, {"glow": true, "drag": 3.0, "squash": 1.0})
