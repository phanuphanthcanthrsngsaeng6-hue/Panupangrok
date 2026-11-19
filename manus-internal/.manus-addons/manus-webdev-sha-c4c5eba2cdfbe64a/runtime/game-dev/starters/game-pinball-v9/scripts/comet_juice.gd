## Space Pinball procedural VFX helper.
##
## The controller owns placement and redraw order: call draw_world() before drawing
## the ball/table foreground, and draw_ui() / hover() before UI labels. This class
## owns no Nodes, timers, textures, or audio.
extends RefCounted

const MIDNIGHT := Color("080f20")
const BRASS := Color("d4ad65")
const CYAN := Color("73ede0")
const VIOLET := Color("b59dff")
const WHITE := Color("fffdf4")

const MAX_WORLD_PARTICLES := 360
const MAX_WORLD_RINGS := 36
const MAX_UI_PARTICLES := 120
const MAX_UI_RINGS := 16
const MAX_LINKS := 16
const RNG_SEED := 418796513

## Public knobs and inspectable, bounded effect collections.
var reduced_motion: bool = false
var intensity: float = 1.0
var shake: float = 0.0
var world_particles: Array = []
var world_rings: Array = []
var ui_particles: Array = []
var ui_rings: Array = []
## Public for optional diagnostics; links are rendered as short-lived contact beams.
var links: Array = []

var _rng := RandomNumberGenerator.new()
var _ui_time := 0.0


func _init() -> void:
	_rng.seed = RNG_SEED


## Clears all transient effects and restarts the deterministic visual random stream.
func reset() -> void:
	world_particles.clear()
	world_rings.clear()
	ui_particles.clear()
	ui_rings.clear()
	links.clear()
	shake = 0.0
	_ui_time = 0.0
	_rng.seed = RNG_SEED


## Creates a localized table impact. Kinds may be "bumper", "rail", "sling",
## "target", or another caller-defined string; unknown kinds use the balanced profile.
func hit(at: Vector2, kind: String, color: Color, strength: float = 1.0) -> void:
	var level := clampf(strength, 0.20, 2.0) * _intensity()
	var profile := _kind_scale(kind)
	var count := int(round(18.0 * profile * level))
	if reduced_motion:
		# Cancel a residual impulse if this setting changes during an effect.
		shake = 0.0
		count = max(3, int(ceil(float(count) * 0.34)))

	# A small white-hot core makes every impact readable without a screen-filling fog.
	_add_world_particle(_particle(at, Vector2.ZERO, color, 0.16 + 0.035 * level, 5.2 + level * 2.0, "core", 0.0, 0.0))
	for i in count:
		var direction := _random_unit()
		var speed := _rng.randf_range(65.0, 175.0) * profile * level
		if reduced_motion:
			speed *= 0.30
		var particle_kind := "spark"
		if i % 7 == 0:
			particle_kind = "glint"
		elif i % 5 == 0:
			particle_kind = "star"
		var particle_color := color if i % 3 != 0 else _accent_color(color)
		if particle_kind == "star" and i % 2 == 0:
			particle_color = VIOLET
		_add_world_particle(_particle(
			at + direction * _rng.randf_range(1.0, 5.0),
			direction * speed,
			particle_color,
			_rng.randf_range(0.28, 0.66) + 0.08 * level,
			_rng.randf_range(1.2, 3.2) * (0.8 + level * 0.24),
			particle_kind,
			_rng.randf_range(-8.0, 8.0),
			_rng.randf_range(-PI, PI)
		))

	_add_world_ring(_ring(at, color, 8.0, 24.0 + level * 18.0, 0.38 + 0.10 * level, 1.3 + level * 0.65, "impact"))
	if level > 0.72:
		_add_world_ring(_ring(at, _accent_color(color), 14.0, 34.0 + level * 24.0, 0.52 + 0.09 * level, 0.9 + level * 0.45, "shock"))
	if not reduced_motion and (strength >= 1.3 or kind in ["milestone", "spawn", "skill", "drain"]):
		shake = minf(18.0, shake + 1.8 * level * profile)


## Brief energy beam between two table contacts. The beam is deliberately capped and
## never persists long enough to read as a static rail decoration.
func link(a: Vector2, b: Vector2, color: Color) -> void:
	if a.distance_to(b) < 2.0:
		hit(a, "target", color, 0.45)
		return
	if reduced_motion:
		# Keep a contact acknowledgement without the moving beam/streak.
		_add_world_particle(_particle(a, Vector2.ZERO, color, 0.15, 4.0, "core", 0.0, 0.0))
		_add_world_particle(_particle(b, Vector2.ZERO, color, 0.15, 4.0, "core", 0.0, 0.0))
		return
	_add_link({
		"a": a,
		"b": b,
		"color": color,
		"age": 0.0,
		"life": 0.16,
		"phase": _rng.randf_range(0.0, TAU)
	})
	_add_world_particle(_particle(a, Vector2.ZERO, color, 0.16, 3.8, "core", 0.0, 0.0))
	_add_world_particle(_particle(b, Vector2.ZERO, color, 0.16, 3.8, "core", 0.0, 0.0))


## A UI click/celebration burst. The expanding ring doubles as the click ripple.
func ui_burst(at: Vector2, color: Color, large: bool = false) -> void:
	var scale := 1.55 if large else 1.0
	var count := 14 if large else 8
	if reduced_motion:
		count = max(3, int(ceil(float(count) * 0.42)))
	_add_ui_ring(_ring(at, color, 4.0, 42.0 * scale, 0.38 + 0.10 * scale, 1.4, "ui_ripple"))
	_add_ui_particle(_particle(at, Vector2.ZERO, color, 0.18, 4.2 * scale, "core", 0.0, 0.0))
	for i in count:
		var direction := _random_unit()
		var speed := _rng.randf_range(25.0, 74.0) * scale
		if reduced_motion:
			speed *= 0.28
		_add_ui_particle(_particle(
			at + direction * 2.0,
			direction * speed,
			color if i % 2 == 0 else _accent_color(color),
			_rng.randf_range(0.24, 0.48),
			_rng.randf_range(1.3, 2.8) * scale,
			"glint" if i % 3 == 0 else "spark",
			_rng.randf_range(-9.0, 9.0),
			_rng.randf_range(-PI, PI)
		))


## Sends a compact score mote from table-space-converted UI coordinates to the HUD.
## The parent supplies both positions in the same UI/layout coordinate space.
func ui_transfer(from: Vector2, to: Vector2, color: Color) -> void:
	var count := 5
	if reduced_motion:
		count = 2
	for i in count:
		var side := -1.0 if i % 2 == 0 else 1.0
		var offset := Vector2(_rng.randf_range(-4.0, 4.0), _rng.randf_range(-4.0, 4.0))
		var control := from.lerp(to, 0.48) + Vector2(side * _rng.randf_range(18.0, 42.0), -_rng.randf_range(14.0, 44.0))
		var mote := _particle(from + offset, Vector2.ZERO, color if i != 0 else WHITE, 0.52 + float(i) * 0.045, 2.2 + float(i % 2), "mote", 0.0, _rng.randf_range(-PI, PI))
		mote["start"] = from + offset
		mote["to"] = to
		mote["control"] = control
		_add_ui_particle(mote)
	_add_ui_ring(_ring(to, _accent_color(color), 3.0, 16.0, 0.26, 1.2, "arrival"))


## Advances UI effects every call. World effects, links, and shake freeze while paused.
## The caller remains responsible for calling queue_redraw() on its canvas items.
func tick(dt: float, paused: bool = false) -> void:
	var step := clampf(dt, 0.0, 0.05)
	_ui_time += step
	ui_particles = _tick_particles(ui_particles, step, true)
	ui_rings = _tick_rings(ui_rings, step)
	if reduced_motion:
		shake = 0.0
	if paused:
		return
	world_particles = _tick_particles(world_particles, step, false)
	world_rings = _tick_rings(world_rings, step)
	links = _tick_links(links, step)
	shake = maxf(0.0, shake - step * 22.0)


## Draws table-space effects (the game table is 480 x 740). Call before ball/text art.
func draw_world(canvas: CanvasItem) -> void:
	_draw_rings(canvas, world_rings)
	_draw_links(canvas)
	_draw_particles(canvas, world_particles, false)


## Draws effects authored in the caller's UI/layout coordinate space.
func draw_ui(canvas: CanvasItem) -> void:
	_draw_rings(canvas, ui_rings)
	_draw_particles(canvas, ui_particles, true)


## Draws a non-filled hover outline. Call before the button's label; use ui_burst()
## on click to create the corresponding ripple.
func hover(canvas: CanvasItem, rect: Rect2, color: Color, amount: float, time: float) -> void:
	var visibility := clampf(amount, 0.0, 1.0)
	if visibility <= 0.01:
		return
	var pulse := 0.66 + 0.34 * sin(time * 7.0)
	var outer := rect.grow(2.0 + pulse * 1.5)
	canvas.draw_rect(outer, _fade(color, visibility * 0.20), false, 3.0, true)
	canvas.draw_rect(rect.grow(0.5), _fade(_accent_color(color), visibility * (0.58 + pulse * 0.28)), false, 1.15, true)
	var corner := 5.0 + pulse * 2.0
	for p in [rect.position, Vector2(rect.end.x, rect.position.y), rect.end, Vector2(rect.position.x, rect.end.y)]:
		canvas.draw_circle(p, corner * 0.34, _fade(WHITE, visibility * 0.72), true, -1.0, true)


func _intensity() -> float:
	return clampf(intensity, 0.15, 2.0)


func _kind_scale(kind: String) -> float:
	match kind.to_lower():
		"bumper":
			return 1.28
		"sling", "slingshot":
			return 1.12
		"rail", "wall":
			return 0.78
		"target", "switch":
			return 0.94
		"flipper":
			return 0.84
		_:
			return 1.0


func _particle(position: Vector2, velocity: Vector2, color: Color, life: float, size: float, kind: String, spin: float, rotation: float) -> Dictionary:
	return {
		"p": position,
		"v": velocity,
		"color": color,
		"age": 0.0,
		"life": minf(life, 0.80),
		"size": size,
		"kind": kind,
		"spin": spin,
		"rot": rotation,
		"drag": 3.2
	}


func _ring(position: Vector2, color: Color, radius: float, growth: float, life: float, width: float, kind: String) -> Dictionary:
	return {
		"p": position,
		"color": color,
		"age": 0.0,
		"life": minf(life, 0.80),
		"radius": radius,
		"growth": growth,
		"width": width,
		"kind": kind
	}


func _add_world_particle(effect: Dictionary) -> void:
	_push_bounded(world_particles, effect, MAX_WORLD_PARTICLES)


func _add_world_ring(effect: Dictionary) -> void:
	_push_bounded(world_rings, effect, MAX_WORLD_RINGS)


func _add_ui_particle(effect: Dictionary) -> void:
	_push_bounded(ui_particles, effect, MAX_UI_PARTICLES)


func _add_ui_ring(effect: Dictionary) -> void:
	_push_bounded(ui_rings, effect, MAX_UI_RINGS)


func _add_link(effect: Dictionary) -> void:
	_push_bounded(links, effect, MAX_LINKS)


func _push_bounded(list: Array, effect: Dictionary, maximum: int) -> void:
	while list.size() >= maximum:
		list.pop_front()
	list.append(effect)


func _tick_particles(source: Array, dt: float, is_ui: bool) -> Array:
	var alive: Array = []
	for item in source:
		var effect: Dictionary = item
		effect["age"] = float(effect["age"]) + dt
		var life := float(effect["life"])
		if float(effect["age"]) >= life:
			continue
		if is_ui and effect["kind"] == "mote":
			var progress := clampf(float(effect["age"]) / life, 0.0, 1.0)
			effect["p"] = _quadratic_bezier(effect["start"], effect["control"], effect["to"], progress)
		else:
			var velocity: Vector2 = effect["v"]
			velocity *= exp(-float(effect["drag"]) * dt)
			effect["v"] = velocity
			effect["p"] = effect["p"] + velocity * dt
		effect["rot"] = float(effect["rot"]) + float(effect["spin"]) * dt
		alive.append(effect)
	return alive


func _tick_rings(source: Array, dt: float) -> Array:
	var alive: Array = []
	for item in source:
		var effect: Dictionary = item
		effect["age"] = float(effect["age"]) + dt
		if float(effect["age"]) < float(effect["life"]):
			alive.append(effect)
	return alive


func _tick_links(source: Array, dt: float) -> Array:
	var alive: Array = []
	for item in source:
		var effect: Dictionary = item
		effect["age"] = float(effect["age"]) + dt
		if float(effect["age"]) < float(effect["life"]):
			alive.append(effect)
	return alive


func _draw_rings(canvas: CanvasItem, source: Array) -> void:
	for item in source:
		var effect: Dictionary = item
		var progress := clampf(float(effect["age"]) / float(effect["life"]), 0.0, 1.0)
		var color: Color = effect["color"]
		var alpha := pow(1.0 - progress, 1.65) * color.a
		var radius := float(effect["radius"]) + float(effect["growth"]) * progress
		var width := maxf(0.7, float(effect["width"]) * (1.0 - progress * 0.35))
		canvas.draw_arc(effect["p"], radius, 0.0, TAU, 36, _fade(color, alpha), width, true)
		if effect["kind"] == "shock" or effect["kind"] == "ui_ripple":
			canvas.draw_arc(effect["p"], maxf(1.0, radius - 3.0), progress * TAU, progress * TAU + PI * 0.78, 16, _fade(WHITE, alpha * 0.58), maxf(0.65, width * 0.55), true)


func _draw_links(canvas: CanvasItem) -> void:
	for item in links:
		var effect: Dictionary = item
		var progress := clampf(float(effect["age"]) / float(effect["life"]), 0.0, 1.0)
		var color: Color = effect["color"]
		var alpha := pow(1.0 - progress, 1.35)
		var a: Vector2 = effect["a"]
		var b: Vector2 = effect["b"]
		canvas.draw_line(a, b, _fade(MIDNIGHT, alpha * 0.70), 4.4, true)
		canvas.draw_line(a, b, _fade(color, alpha * 0.86), 2.1, true)
		var midpoint := a.lerp(b, 0.5 + sin(float(effect["phase"]) + progress * 18.0) * 0.14)
		canvas.draw_circle(midpoint, 2.1, _fade(WHITE, alpha), true, -1.0, true)


func _draw_particles(canvas: CanvasItem, source: Array, is_ui: bool) -> void:
	for item in source:
		var effect: Dictionary = item
		var progress := clampf(float(effect["age"]) / float(effect["life"]), 0.0, 1.0)
		var alpha := pow(1.0 - progress, 1.45)
		var color: Color = effect["color"]
		var position: Vector2 = effect["p"]
		var size := float(effect["size"]) * (1.0 - progress * 0.28)
		var kind: String = effect["kind"]
		if kind == "core":
			canvas.draw_circle(position, size * 1.35, _fade(color, alpha * 0.26), true, -1.0, true)
			canvas.draw_circle(position, maxf(1.0, size * 0.60), _fade(WHITE, alpha), true, -1.0, true)
		elif kind == "spark":
			var velocity: Vector2 = effect["v"]
			var tail := minf(9.0, velocity.length() * 0.055) * (1.0 - progress)
			if tail > 0.25 and not reduced_motion:
				canvas.draw_line(position - velocity.normalized() * tail, position, _fade(color, alpha * 0.52), maxf(0.65, size * 0.45), true)
			canvas.draw_circle(position, maxf(0.8, size * 0.55), _fade(color, alpha), true, -1.0, true)
			if not is_ui:
				canvas.draw_circle(position, maxf(0.45, size * 0.23), _fade(WHITE, alpha * 0.95), true, -1.0, true)
		elif kind == "mote":
			_draw_star(canvas, position, size * 1.55, float(effect["rot"]), _fade(color, alpha), 3)
			canvas.draw_circle(position, maxf(0.8, size * 0.38), _fade(WHITE, alpha), true, -1.0, true)
		elif kind == "glint":
			_draw_star(canvas, position, size * 1.85, float(effect["rot"]), _fade(color, alpha), 4)
			canvas.draw_circle(position, maxf(0.7, size * 0.34), _fade(WHITE, alpha), true, -1.0, true)
		else: # "star" and future harmless particle variants.
			_draw_star(canvas, position, size * 1.55, float(effect["rot"]), _fade(color, alpha), 3)


func _draw_star(canvas: CanvasItem, position: Vector2, radius: float, rotation: float, color: Color, arms: int) -> void:
	for i in arms:
		var angle := rotation + float(i) * PI / float(arms)
		var direction := Vector2.from_angle(angle)
		canvas.draw_line(position - direction * radius, position + direction * radius, color, maxf(0.65, radius * 0.22), true)


func _quadratic_bezier(a: Vector2, b: Vector2, c: Vector2, t: float) -> Vector2:
	var inverse := 1.0 - t
	return inverse * inverse * a + 2.0 * inverse * t * b + t * t * c


func _random_unit() -> Vector2:
	return Vector2.from_angle(_rng.randf_range(0.0, TAU))


func _accent_color(color: Color) -> Color:
	# Palette-preserving alternation: warm contacts lean cyan, cyan contacts lean brass.
	var cyan_distance := absf(color.r - CYAN.r) + absf(color.g - CYAN.g) + absf(color.b - CYAN.b)
	return BRASS if cyan_distance < 0.55 else CYAN


func _fade(color: Color, alpha: float) -> Color:
	return Color(color.r, color.g, color.b, clampf(alpha, 0.0, 1.0))
