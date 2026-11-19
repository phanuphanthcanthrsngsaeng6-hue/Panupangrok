class_name Battlefield
extends Node2D
## Isometric campus renderer and RTS input layer for Campus Hero Defense.

signal selection_changed
signal command_feedback(cue: StringName)
signal hitstop_requested(seconds: float)

const Catalog := preload("res://scripts/data/hero_catalog.gd")
const Map := preload("res://scripts/data/campus_map.gd")
const Loc := preload("res://scripts/services/localization.gd")

const ISO_RADIUS_X := 67.882
const MIN_ZOOM := 0.5
const MAX_ZOOM := 1.5
const PAN_SPEED := 900.0
const EDGE_PAN_MARGIN := 8.0
const DRAG_THRESHOLD := 8.0
const DOUBLE_CLICK_MS := 320
const TERRAIN_WORLD_TILE := 384.0

const UNIT_TEXTURES := {
	&"monitor": preload("res://assets/template/game/units/hero_monitor.png"),
	&"blaze": preload("res://assets/template/game/units/hero_blaze.png"),
	&"frost": preload("res://assets/template/game/units/hero_frost.png"),
	&"psi": preload("res://assets/template/game/units/hero_psi.png"),
	&"stretch": preload("res://assets/template/game/units/hero_stretch.png"),
	&"goon": preload("res://assets/template/game/units/enemy_goon.png"),
	&"blaster": preload("res://assets/template/game/units/enemy_blaster.png"),
	&"brute": preload("res://assets/template/game/units/enemy_brute.png"),
	&"mech": preload("res://assets/template/game/units/enemy_mech.png"),
	&"student": preload("res://assets/template/game/units/civ_student.png"),
	&"girl": preload("res://assets/template/game/units/civ_girl.png"),
	&"janitor": preload("res://assets/template/game/units/civ_janitor.png"),
}
## Which way each sprite's art faces (1 = right, -1 = left).
const ART_FACING := {
	&"monitor": 1.0, &"blaze": 1.0, &"frost": 1.0, &"psi": 1.0, &"stretch": 1.0,
	&"goon": -1.0, &"blaster": -1.0, &"brute": 1.0, &"mech": 1.0,
	&"student": 1.0, &"girl": 1.0, &"janitor": 1.0,
}
## Generated animation clips whose authored facing differs from the static art.
const ANIM_FACING_OVERRIDE := {
	&"mech": {&"attack": -1.0},
}
const BUILDING_TEXTURES := {
	&"main_hall": preload("res://assets/template/game/buildings/bld_main_hall.png"),
	&"gym": preload("res://assets/template/game/buildings/bld_gym.png"),
	&"chem_lab": preload("res://assets/template/game/buildings/bld_chem_lab.png"),
	&"cafeteria": preload("res://assets/template/game/buildings/bld_cafeteria.png"),
	&"library": preload("res://assets/template/game/buildings/bld_library.png"),
}
const TREE_TEXTURES := {
	&"oak": preload("res://assets/template/game/props/prop_oak.png"),
	&"maple": preload("res://assets/template/game/props/prop_maple.png"),
}
const STATUE_TEXTURE := preload("res://assets/template/game/props/prop_statue.png")
const DECOR_TEXTURES := {
	&"bus": preload("res://assets/template/game/props/prop_bus.png"),
	&"bleachers": preload("res://assets/template/game/props/prop_bleachers.png"),
	&"lockers": preload("res://assets/template/game/props/prop_lockers.png"),
	&"flagpole": preload("res://assets/template/game/props/prop_flagpole.png"),
	&"bench": preload("res://assets/template/game/props/prop_bench.png"),
}
const FIELD_TEXTURE := preload("res://assets/template/game/props/decal_field.png")
const PORTAL_TEXTURE := preload("res://assets/template/game/fx/portal.png")
const TELEGRAPH_TEXTURE := preload("res://assets/template/game/fx/telegraph.png")
const SCORCH_TEXTURE := preload("res://assets/template/game/fx/scorch.png")
const STAR_TEXTURE := preload("res://assets/template/game/fx/star.png")
const TERRAIN_TEXTURES := [
	preload("res://assets/template/game/terrain/terrain_grass.webp"),
	preload("res://assets/template/game/terrain/terrain_pavers.webp"),
	preload("res://assets/template/game/terrain/terrain_asphalt.webp"),
]

const HERO_GOLD := Color("f2b72c")
const HERO_MAROON := Color("8e1b2e")
const ENEMY_OLIVE := Color("7d9a2c")
const ENEMY_RED := Color("e0452f")
const CIVILIAN_BLUE := Color("3f9be0")
const INK := Color("1c1320")
const PAPER := Color("fff6df")

const POW_WORDS: Array[String] = ["POW!", "WHAM!", "BAM!", "ZAP!", "KAPOW!", "BONK!"]

var sim: RtsSimulation
var camera: Camera2D
var selected: Array[int] = []
var selected_building: StringName = &""
var attack_move_armed := false
var input_enabled := true
var reduced_motion := false
var edge_pan_enabled := true
var groups: Dictionary = {}
var ui_blockers: Array[Control] = []
var zoom_multiplier := 1.0
var fx: FxLayer

var _terrain: Node2D
var _ground: Node2D
var _world: Node2D
var _overlay: Node2D
var _unit_nodes: Dictionary = {}
var _animator := UnitAnimator.new()
var _building_nodes: Dictionary = {}
var _effects: Array[Dictionary] = []
var _markers: Array[Dictionary] = []
var _time := 0.0
var _drag_start := Vector2.ZERO
var _drag_current := Vector2.ZERO
var _dragging := false
var _left_down := false
var _pan_dragging := false
var _pan_last := Vector2.ZERO
var _pointer_inside := false
var _last_click_ms := 0
var _last_click_kind: StringName = &""
var _hover_id := 0
var _hover_building: StringName = &""
var _touch_points: Dictionary = {}
var _touch_pinch_distance := 0.0
var _touch_moved := false
var _touch_travel := 0.0
var _zoom_target := 0.85
var _shake := 0.0
var _rng := RandomNumberGenerator.new()
var _display_font: Font
var _ui_font: Font
var _scorches: Array[Dictionary] = []
var _ambient_timer := 0.0
var _surge_fx_timer := 0.0
var _portal_lanes: Dictionary = {}
var _fx_selected: Array[int] = []


func _ready() -> void:
	_rng.seed = 0x484D48
	_display_font = load("res://assets/template/game/fonts/display.tres") as Font
	_ui_font = load("res://assets/template/game/fonts/nunito_black.tres") as Font
	texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS
	_terrain = Node2D.new()
	_terrain.name = "Terrain"
	_terrain.texture_repeat = CanvasItem.TEXTURE_REPEAT_ENABLED
	_terrain.z_index = -20
	_terrain.draw.connect(_draw_terrain)
	add_child(_terrain)
	_ground = Node2D.new()
	_ground.name = "GroundDecals"
	_ground.z_index = -10
	_ground.draw.connect(_draw_ground)
	add_child(_ground)
	_world = Node2D.new()
	_world.name = "World"
	_world.y_sort_enabled = true
	add_child(_world)
	fx = FxLayer.new()
	fx.name = "Fx"
	add_child(fx)
	_overlay = Node2D.new()
	_overlay.name = "Overlay"
	_overlay.z_index = 20
	_overlay.draw.connect(_draw_overlay)
	add_child(_overlay)
	camera = Camera2D.new()
	camera.name = "Camera"
	add_child(camera)
	camera.make_current()
	selection_changed.connect(_on_selection_fx)


func bind(simulation: RtsSimulation) -> void:
	cancel_drag()
	_last_click_ms = 0
	_last_click_kind = &""
	_hover_id = 0
	_hover_building = &""
	sim = simulation
	selected.clear()
	selected_building = &""
	attack_move_armed = false
	groups.clear()
	_effects.clear()
	_markers.clear()
	_scorches.clear()
	_portal_lanes.clear()
	if fx != null:
		fx.clear()
	for child in _world.get_children():
		child.queue_free()
	for child in get_children():
		if child.name.begins_with("FieldDecal"):
			remove_child(child)
			child.queue_free()
	_unit_nodes.clear()
	_building_nodes.clear()
	_build_static_props()
	_terrain.queue_redraw()
	_zoom_target = 0.85
	camera.zoom = Vector2.ONE * _zoom_target * zoom_multiplier
	focus_on(Vector2(24.0, 26.0), true)
	selection_changed.emit()


# ---------------------------------------------------------------- static scene

func _build_static_props() -> void:
	for id: StringName in sim.buildings:
		var building: Dictionary = sim.buildings[id]
		var texture: Texture2D = BUILDING_TEXTURES[id]
		var footprint: Vector2i = building["footprint"]
		var anchor := IsoProjection.project(Vector2(building["origin"]) + Vector2(footprint))
		var holder := Node2D.new()
		holder.name = "Building_%s" % id
		# Sort slightly in front of the center so units behind the room draw first.
		holder.position = IsoProjection.project(sim.building_center(id)) + Vector2(0.0, float(footprint.x) * 10.0)
		var sprite := Sprite2D.new()
		sprite.texture = texture
		var scale_value := (float(footprint.x) * IsoProjection.TILE_WIDTH + 30.0) / float(texture.get_width())
		sprite.scale = Vector2.ONE * scale_value
		sprite.position = anchor - holder.position + Vector2(0.0, 8.0) - Vector2(0.0, texture.get_height() * scale_value * 0.5)
		holder.add_child(sprite)
		_world.add_child(holder)
		_building_nodes[id] = {"node": holder, "sprite": sprite}
	for tree: Dictionary in Map.TREES:
		var texture: Texture2D = TREE_TEXTURES[tree["kind"]]
		var cell: Vector2i = tree["cell"]
		var sprite := Sprite2D.new()
		sprite.texture = texture
		var scale_value := 150.0 / float(texture.get_height()) * (0.9 + 0.2 * float((cell.x * 7 + cell.y * 3) % 5) / 4.0)
		sprite.scale = Vector2.ONE * scale_value
		sprite.offset = Vector2(0.0, -texture.get_height() * 0.5 + 24.0)
		sprite.position = IsoProjection.project(Vector2(cell) + Vector2(0.5, 0.5))
		sprite.flip_h = (cell.x + cell.y) % 2 == 0
		_world.add_child(sprite)
	var statue := Sprite2D.new()
	statue.texture = STATUE_TEXTURE
	var statue_scale := 150.0 / float(STATUE_TEXTURE.get_height())
	statue.scale = Vector2.ONE * statue_scale
	statue.offset = Vector2(0.0, -STATUE_TEXTURE.get_height() * 0.5 + 40.0)
	statue.position = IsoProjection.project(Vector2(Map.STATUE["origin"]) + Vector2(Map.STATUE["footprint"]) * 0.5) + Vector2(0.0, 16.0)
	_world.add_child(statue)
	for decor: Dictionary in Map.DECOR:
		var texture: Texture2D = DECOR_TEXTURES[decor["kind"]]
		var sprite := Sprite2D.new()
		sprite.texture = texture
		var scale_value := float(decor["height"]) / float(texture.get_height())
		sprite.scale = Vector2.ONE * scale_value
		sprite.offset = Vector2(0.0, -texture.get_height() * 0.5 + 14.0)
		sprite.position = IsoProjection.project(decor["at"])
		sprite.flip_h = bool(decor.get("flip", false))
		_world.add_child(sprite)
	var field := Sprite2D.new()
	field.name = "FieldDecal"
	field.texture = FIELD_TEXTURE
	field.z_index = -15
	var field_size := float(Map.FIELD["size"])
	var field_center := IsoProjection.project(Map.FIELD["origin"] + Vector2(field_size, field_size) * 0.5)
	var field_width := field_size * IsoProjection.TILE_WIDTH * 1.04
	var field_scale := field_width / float(FIELD_TEXTURE.get_width())
	field.scale = Vector2.ONE * field_scale
	var diamond_height := field_size * IsoProjection.TILE_HEIGHT
	field.position = field_center + Vector2(0.0, diamond_height * 0.5 - FIELD_TEXTURE.get_height() * field_scale * 0.5)
	add_child(field)


func _draw_terrain() -> void:
	var bounds := IsoProjection.map_bounds(Map.SIZE).grow(1600.0)
	_terrain.draw_rect(bounds, Color("3a5a30"))
	var outer := PackedVector2Array([
		IsoProjection.project(Vector2(-1.4, -1.4)), IsoProjection.project(Vector2(Map.SIZE.x + 1.4, -1.4)),
		IsoProjection.project(Vector2(Map.SIZE) + Vector2(1.4, 1.4)), IsoProjection.project(Vector2(-1.4, Map.SIZE.y + 1.4)),
	])
	_terrain.draw_colored_polygon(outer, Color("2c4626"))
	for x in Map.SIZE.x:
		for y in Map.SIZE.y:
			var cell := Vector2i(x, y)
			var kind := Map.terrain_at(cell)
			var polygon := IsoProjection.cell_polygon(cell)
			var uvs := PackedVector2Array()
			for point in polygon:
				uvs.append(point / TERRAIN_WORLD_TILE)
			var shade := 1.0 - 0.03 * float((x * 31 + y * 17) % 3)
			var tint := Color(shade, shade, shade)
			_terrain.draw_polygon(polygon, PackedColorArray([tint, tint, tint, tint]), uvs, TERRAIN_TEXTURES[kind])
	# Curbs where walkways meet lawn.
	var neighbors: Array[Vector2i] = [Vector2i(0, -1), Vector2i(1, 0), Vector2i(0, 1), Vector2i(-1, 0)]
	for x in Map.SIZE.x:
		for y in Map.SIZE.y:
			var cell := Vector2i(x, y)
			var kind := Map.terrain_at(cell)
			if kind == Map.GRASS:
				continue
			var polygon := IsoProjection.cell_polygon(cell)
			for side in 4:
				var other := cell + neighbors[side]
				if other.x < 0 or other.y < 0 or other.x >= Map.SIZE.x or other.y >= Map.SIZE.y:
					continue
				if Map.terrain_at(other) == kind:
					continue
				_terrain.draw_line(polygon[side], polygon[(side + 1) % 4], Color(0.94, 0.9, 0.78, 0.85), 3.0)
	var edge := PackedVector2Array([
		IsoProjection.project(Vector2.ZERO), IsoProjection.project(Vector2(Map.SIZE.x, 0.0)),
		IsoProjection.project(Vector2(Map.SIZE)), IsoProjection.project(Vector2(0.0, Map.SIZE.y)),
		IsoProjection.project(Vector2.ZERO),
	])
	_terrain.draw_polyline(edge, Color("1d3619"), 16.0, true)
	_terrain.draw_polyline(edge, Color("5a8a3c"), 6.0, true)
	for index in range(1, 7):
		_terrain.draw_line(IsoProjection.project(Vector2(float(index), 0.6)), IsoProjection.project(Vector2(float(index), 2.2)), Color(1, 1, 1, 0.55), 2.0)
		_terrain.draw_line(IsoProjection.project(Vector2(float(index), 4.2)), IsoProjection.project(Vector2(float(index), 5.8)), Color(1, 1, 1, 0.55), 2.0)
	for lane: StringName in Map.SPAWNS:
		var point: Vector2 = Map.SPAWNS[lane]
		_draw_iso_ellipse(_terrain, IsoProjection.project(point), 1.6, Color(0.9, 0.2, 0.15, 0.16), true)
		_draw_iso_ellipse(_terrain, IsoProjection.project(point), 1.6, Color(0.95, 0.85, 0.2, 0.55), false, 3.0)


func _draw_iso_ellipse(canvas: CanvasItem, center: Vector2, radius_cells: float, color: Color, filled: bool, width: float = 2.0) -> void:
	canvas.draw_set_transform(center, 0.0, Vector2(1.0, 0.5))
	if filled:
		canvas.draw_circle(Vector2.ZERO, radius_cells * ISO_RADIUS_X, color)
	else:
		canvas.draw_arc(Vector2.ZERO, radius_cells * ISO_RADIUS_X, 0.0, TAU, 48, color, width * 1.4, true)
	canvas.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)


func _draw_iso_arc(canvas: CanvasItem, center: Vector2, radius_cells: float, from_angle: float, to_angle: float, color: Color, width: float) -> void:
	canvas.draw_set_transform(center, 0.0, Vector2(1.0, 0.5))
	canvas.draw_arc(Vector2.ZERO, radius_cells * ISO_RADIUS_X, from_angle, to_angle, 48, color, width * 1.6, true)
	canvas.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)


# ---------------------------------------------------------------- per-frame sync

func _process(delta: float) -> void:
	if sim == null:
		return
	_time += delta
	_update_camera(delta)
	_sync_units(delta)
	_sync_buildings()
	_update_effects(delta)
	_update_hover()
	_update_ambient(delta)
	_ground.queue_redraw()
	_overlay.queue_redraw()


func _update_ambient(delta: float) -> void:
	fx.reduced_motion = reduced_motion
	var scorches: Array[Dictionary] = []
	for scorch: Dictionary in _scorches:
		scorch["t"] = float(scorch["t"]) + delta
		if float(scorch["t"]) < float(scorch["dur"]):
			scorches.append(scorch)
	_scorches = scorches
	_ambient_timer -= delta
	if _ambient_timer <= 0.0:
		_ambient_timer = _rng.randf_range(0.9, 1.8)
		var tree: Dictionary = Map.TREES[_rng.randi_range(0, Map.TREES.size() - 1)]
		var cell := Vector2(tree["cell"]) + Vector2(0.5, 0.5)
		if is_cell_on_screen(cell) and tree["kind"] == &"maple":
			fx.burst(&"leaf", IsoProjection.project(cell) + Vector2(0, -110), 2, Vector2(20, 60), Vector2(1.8, 2.8), Vector2(14, 20), Color.WHITE, {"grav": 40.0, "drag": 0.8, "spin": 3.0, "jitter": 40.0, "fade": 0.8})
	if sim.surge_timer > 0.0:
		_surge_fx_timer -= delta
		if _surge_fx_timer <= 0.0:
			_surge_fx_timer = 0.12
			var heroes := sim.heroes()
			if not heroes.is_empty():
				var hero: Dictionary = heroes[_rng.randi_range(0, heroes.size() - 1)]
				if is_cell_on_screen(hero["pos"]):
					fx.preset(&"surge", IsoProjection.project(hero["pos"]) + Vector2(0, -20))
	for lane: StringName in _portal_lanes.keys():
		_portal_lanes[lane] = float(_portal_lanes[lane]) - delta
		if float(_portal_lanes[lane]) <= 0.0 and not sim.wave_spawning:
			_portal_lanes.erase(lane)


func _sync_units(delta: float) -> void:
	for id: int in _unit_nodes.keys():
		if not sim.units.has(id):
			var entry: Dictionary = _unit_nodes[id]
			_spawn_fade(entry)
			_unit_nodes.erase(id)
			if id in selected:
				selected.erase(id)
				selection_changed.emit()
	for id: int in sim.units:
		var value: Dictionary = sim.units[id]
		if not _unit_nodes.has(id):
			_unit_nodes[id] = _create_unit_node(value)
		var entry: Dictionary = _unit_nodes[id]
		var node: Node2D = entry["node"]
		var sprite: Sprite2D = entry["sprite"]
		var kind: StringName = value["kind"]
		node.position = IsoProjection.project(value["pos"])
		var base_scale: float = entry["scale"]
		var facing := float(value["facing"])
		sprite.flip_h = facing * float(ART_FACING.get(kind, 1.0)) < 0.0
		var animated := bool(entry.get("animated", false))
		if animated:
			_advance_unit_anim(entry, value, kind, delta)
		var bob := 0.0
		var squash := Vector2.ONE
		var lean := 0.0
		var seed_value := float(value["anim_seed"])
		var phase := _time * 11.0 + seed_value
		if not reduced_motion:
			if bool(value["moving"]):
				# Animated units already step and bob inside their walk cycle.
				if not animated:
					bob = -absf(sin(phase)) * 5.0
					lean = sin(phase) * 0.05
			elif value["order"] == &"trapped":
				bob = -absf(sin(_time * 5.0 + seed_value)) * 3.0
			elif not animated:
				var breathe := sin(_time * 2.4 + seed_value) * 0.014
				squash = Vector2(1.0 + breathe, 1.0 - breathe)
		var attack_anim := float(value["attack_anim"])
		var lunge := 0.0
		if attack_anim > 0.0:
			var t := attack_anim / 0.35
			var punch := 0.4 if animated else 1.0
			squash = Vector2(1.0 + 0.12 * t * punch, 1.0 - 0.08 * t * punch)
			lunge = facing * 10.0 * punch * sin(t * PI)
		if float(value["stun_timer"]) > 0.0 and not reduced_motion:
			lean = sin(_time * 18.0) * 0.12
		sprite.position = Vector2(lunge, bob)
		sprite.rotation = lean
		sprite.scale = Vector2(base_scale, base_scale) * squash
		var tint := Color.WHITE
		if float(value["slow_timer"]) > 0.0:
			tint = Color(0.72, 0.88, 1.15)
		if float(value["stun_timer"]) > 0.0:
			tint = Color(1.05, 0.8, 1.2)
		if float(value["hit_flash"]) > 0.0:
			tint = Color(2.2, 2.2, 2.2)
		sprite.modulate = sprite.modulate.lerp(tint, clampf(delta * 30.0, 0.0, 1.0))


func _spawn_fade(entry: Dictionary) -> void:
	var node: Node2D = entry["node"]
	if not is_instance_valid(node):
		return
	var tween := node.create_tween()
	tween.set_parallel(true)
	tween.tween_property(node, "modulate:a", 0.0, 0.45)
	tween.tween_property(node, "position:y", node.position.y - 18.0, 0.45)
	tween.chain().tween_callback(node.queue_free)


func _create_unit_node(value: Dictionary) -> Dictionary:
	var kind: StringName = value["kind"]
	var texture: Texture2D = UNIT_TEXTURES.get(kind, UNIT_TEXTURES[&"goon"])
	var node := Node2D.new()
	node.name = "Unit_%d" % int(value["id"])
	var sprite := Sprite2D.new()
	var animated := _animator.has_kind(kind)
	var art_height := float(texture.get_height())
	var anchor := Vector2.ZERO
	var cell := Vector2.ZERO
	if animated:
		anchor = _animator.anchor(kind)
		cell = _animator.cell_size(kind)
		art_height = _animator.body_height(kind)
		sprite.centered = false
		sprite.texture = _animator.frame_at(kind, &"idle", float(value["anim_seed"]))
		sprite.offset = Vector2(-anchor.x, -anchor.y + 4.0)
	else:
		sprite.texture = texture
		sprite.offset = Vector2(0.0, -texture.get_height() * 0.5 + 8.0)
	var height := float(Catalog.stats(kind).get("height", 58.0)) * 1.5
	if int(value["team"]) == RtsSimulation.TEAM_CIVILIAN:
		height = 80.0
	var scale_value := height / art_height
	sprite.scale = Vector2.ONE * scale_value
	node.add_child(sprite)
	_world.add_child(node)
	if int(value["team"]) == RtsSimulation.TEAM_PLAYER:
		_add_effect({"type": &"ring", "pos": IsoProjection.project(value["pos"]), "dur": 0.6, "color": HERO_GOLD, "radius": 1.2})
	return {
		"node": node, "sprite": sprite, "scale": scale_value, "animated": animated,
		"anchor": anchor, "cell": cell, "action": &"idle", "anim_t": float(value["anim_seed"]),
		"attack_hold": 0.0, "last_attack": 0.0,
	}


## Picks idle / walk / attack for a generated-animation unit and advances its frame.
## Attacks hold the attack cycle briefly so strikes read even with short sim pulses.
func _advance_unit_anim(entry: Dictionary, value: Dictionary, kind: StringName, delta: float) -> void:
	var sprite: Sprite2D = entry["sprite"]
	var attack_anim := float(value["attack_anim"])
	if attack_anim > float(entry["last_attack"]) + 0.001:
		entry["attack_hold"] = UnitAnimator.ATTACK_HOLD
		if entry["action"] != &"attack" and not bool(value["moving"]):
			entry["action"] = &"attack"
			entry["anim_t"] = 0.0
	entry["last_attack"] = attack_anim
	entry["attack_hold"] = maxf(0.0, float(entry["attack_hold"]) - delta)
	var action: StringName = &"idle"
	if bool(value["moving"]):
		action = &"walk"
	elif float(entry["attack_hold"]) > 0.0:
		action = &"attack"
	if action != entry["action"]:
		entry["action"] = action
		entry["anim_t"] = float(value["anim_seed"]) if action == &"idle" else 0.0
	var speed := 1.0
	if float(value["stun_timer"]) > 0.0:
		speed = 0.0
	elif float(value["slow_timer"]) > 0.0:
		speed = 0.55
	entry["anim_t"] = float(entry["anim_t"]) + delta * speed
	sprite.texture = _animator.frame_at(kind, action, float(entry["anim_t"]))
	var overrides: Dictionary = ANIM_FACING_OVERRIDE.get(kind, {})
	if overrides.has(action):
		sprite.flip_h = float(value["facing"]) * float(overrides[action]) < 0.0
	var anchor: Vector2 = entry["anchor"]
	var cell: Vector2 = entry["cell"]
	var anchor_x := cell.x - anchor.x if sprite.flip_h else anchor.x
	sprite.offset = Vector2(-anchor_x, -anchor.y + 4.0)


func _sync_buildings() -> void:
	for id: StringName in _building_nodes:
		var building: Dictionary = sim.buildings[id]
		var sprite: Sprite2D = _building_nodes[id]["sprite"]
		var tint := Color.WHITE
		if id != &"main_hall" and int(building["owner"]) == RtsSimulation.TEAM_ENEMY:
			tint = Color(0.78, 0.84, 0.7)
		if float(building["hit_flash"]) > 0.0:
			tint = Color(1.5, 1.15, 1.15)
		if id == selected_building or id == _hover_building:
			tint = tint * Color(1.12, 1.12, 1.12)
		sprite.modulate = tint


# ---------------------------------------------------------------- ground decals

func _draw_ground() -> void:
	if sim == null:
		return
	for id: StringName in sim.buildings:
		var building: Dictionary = sim.buildings[id]
		var center := IsoProjection.project(sim.building_center(id))
		if id == &"main_hall":
			_draw_iso_ellipse(_ground, center, 3.4, Color(0.95, 0.72, 0.17, 0.10), true)
			if id == selected_building:
				_draw_rally(building)
			continue
		var control := float(building["control"])
		var owner := int(building["owner"])
		var base_color := HERO_GOLD if owner == RtsSimulation.TEAM_PLAYER else ENEMY_OLIVE
		_draw_iso_ellipse(_ground, center, Catalog.CAPTURE_RADIUS, Color(base_color, 0.12), true)
		var ring_alpha := 0.55
		if bool(building.get("contested", false)):
			ring_alpha = 0.35 + 0.35 * sin(_time * 10.0)
		_draw_iso_ellipse(_ground, center, Catalog.CAPTURE_RADIUS, Color(base_color, ring_alpha), false, 2.5)
		var progress := (control + 1.0) * 0.5
		if progress > 0.001 and progress < 0.999:
			_draw_iso_arc(_ground, center, Catalog.CAPTURE_RADIUS + 0.12, -PI * 0.5, -PI * 0.5 + TAU * progress, HERO_GOLD, 4.0)
		if id == selected_building and owner == RtsSimulation.TEAM_PLAYER:
			_draw_rally(building)
	var next_index := sim.wave_index + 1
	if next_index < Catalog.WAVES.size() and not sim.wave_spawning and sim.wave_timer < 12.0:
		var pulse := 0.4 + 0.4 * absf(sin(_time * 5.0))
		for lane: StringName in Catalog.WAVES[next_index]["lanes"]:
			var point := IsoProjection.project(Map.SPAWNS[lane])
			_draw_iso_ellipse(_ground, point, 2.2, Color(ENEMY_RED, pulse * 0.35), true)
			_draw_iso_ellipse(_ground, point, 2.2 + 0.4 * absf(sin(_time * 3.0)), Color(ENEMY_RED, pulse), false, 3.0)
	for scorch: Dictionary in _scorches:
		var fade := 1.0 - clampf((float(scorch["t"]) - float(scorch["dur"]) + 1.5) / 1.5, 0.0, 1.0)
		var size := float(scorch["size"])
		_ground.draw_set_transform(scorch["pos"], 0.0, Vector2(1.0, 0.5))
		_ground.draw_texture_rect(SCORCH_TEXTURE, Rect2(Vector2(-size, -size) * 0.5, Vector2(size, size)), false, Color(1, 1, 1, 0.75 * fade))
	_ground.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	for lane: StringName in _portal_lanes:
		var point := IsoProjection.project(Map.SPAWNS[lane])
		var grow := clampf(1.0 - maxf(0.0, -float(_portal_lanes[lane])) , 0.0, 1.0)
		var width := 300.0 * (0.85 + 0.08 * sin(_time * 4.0)) * grow
		_ground.draw_set_transform_matrix(Transform2D(Vector2(1, 0), Vector2(0, 0.5), point) * Transform2D(_time * 1.6, Vector2.ZERO))
		var aspect := float(PORTAL_TEXTURE.get_height()) / float(PORTAL_TEXTURE.get_width())
		_ground.draw_texture_rect(PORTAL_TEXTURE, Rect2(Vector2(-width, -width * aspect) * 0.5, Vector2(width, width * aspect)), false, Color(1, 1, 1, 0.95))
		_ground.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
		_draw_iso_ellipse(_ground, point, 1.9, Color(0.6, 1.0, 0.25, 0.35 + 0.25 * sin(_time * 7.0)), false, 4.0)
	for telegraph: Dictionary in sim.telegraphs:
		var center := IsoProjection.project(telegraph["pos"])
		var radius := float(telegraph["radius"])
		var progress := 1.0 - float(telegraph["timer"]) / maxf(float(telegraph["total"]), 0.01)
		var blink := 0.55 + 0.45 * absf(sin(_time * (10.0 + 14.0 * progress)))
		var size := radius * ISO_RADIUS_X * 2.0
		_ground.draw_set_transform(center, 0.0, Vector2(1.0, 0.5))
		_ground.draw_texture_rect(TELEGRAPH_TEXTURE, Rect2(Vector2(-size, -size) * 0.5, Vector2(size, size)), false, Color(1, 1, 1, 0.35 + 0.35 * blink))
		_ground.draw_circle(Vector2.ZERO, radius * ISO_RADIUS_X * progress, Color(1.0, 0.18, 0.1, 0.35))
		_ground.draw_arc(Vector2.ZERO, radius * ISO_RADIUS_X, 0.0, TAU, 48, Color(1.0, 0.92, 0.2, blink), 6.0, true)
		_ground.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	if sim.surge_timer > 0.0:
		for hero: Dictionary in sim.heroes():
			var hero_pos := IsoProjection.project(hero["pos"])
			var wobble := 0.08 * sin(_time * 9.0 + float(hero["anim_seed"]))
			_draw_iso_ellipse(_ground, hero_pos, 0.62 + wobble, Color(1.0, 0.82, 0.25, 0.28), true)
			_draw_iso_ellipse(_ground, hero_pos, 0.7 + wobble, Color(1.0, 0.9, 0.4, 0.85), false, 3.0)
	for value: Dictionary in sim.units.values():
		var pos := IsoProjection.project(value["pos"])
		var radius := float(Catalog.stats(value["kind"]).get("radius", 0.3))
		_draw_iso_ellipse(_ground, pos, radius * 1.05, Color(0, 0, 0, 0.28), true)
		var team := int(value["team"])
		var id := int(value["id"])
		if id in selected:
			_draw_iso_ellipse(_ground, pos, radius + 0.18, HERO_GOLD, false, 3.0)
			_draw_iso_ellipse(_ground, pos, radius + 0.3, Color(HERO_GOLD, 0.35), false, 2.0)
		elif id == _hover_id:
			_draw_iso_ellipse(_ground, pos, radius + 0.18, Color(1, 1, 1, 0.8), false, 2.0)
		elif team == RtsSimulation.TEAM_PLAYER:
			_draw_iso_ellipse(_ground, pos, radius + 0.12, Color(HERO_MAROON, 0.75), false, 2.0)
		elif team == RtsSimulation.TEAM_ENEMY:
			_draw_iso_ellipse(_ground, pos, radius + 0.12, Color(ENEMY_RED, 0.55), false, 2.0)
		if float(value["shield_timer"]) > 0.0:
			_draw_iso_ellipse(_ground, pos, radius + 0.35, Color(0.55, 0.85, 1.0, 0.45 + 0.2 * sin(_time * 8.0)), false, 3.0)
	for civilian: Dictionary in sim.civilians():
		if civilian["order"] != &"follow":
			continue
		var leader: Dictionary = sim.units.get(int(civilian["follow"]), {})
		if not leader.is_empty():
			_ground.draw_dashed_line(IsoProjection.project(civilian["pos"]), IsoProjection.project(leader["pos"]), Color(CIVILIAN_BLUE, 0.85), 2.5, 7.0)
	for marker: Dictionary in _markers:
		var t := float(marker["t"]) / float(marker["dur"])
		var color: Color = marker["color"]
		_draw_iso_ellipse(_ground, marker["pos"], 0.55 * (1.0 - t) + 0.15, Color(color, 1.0 - t), false, 3.0)
	for id: int in selected:
		var value: Dictionary = sim.units.get(id, {})
		if value.is_empty() or not (value["order"] in [&"move", &"attack_move"]):
			continue
		var path: PackedVector2Array = value["path"]
		var index := int(value["path_index"])
		if index >= path.size():
			continue
		var points := PackedVector2Array([IsoProjection.project(value["pos"])])
		for point_index in range(index, path.size()):
			points.append(IsoProjection.project(path[point_index]))
		var color := Color(1, 1, 1, 0.35) if value["order"] == &"move" else Color(ENEMY_RED, 0.45)
		_ground.draw_polyline(points, color, 2.0, true)


func _draw_rally(building: Dictionary) -> void:
	var from := IsoProjection.project(sim.building_center(building["id"]))
	var to := IsoProjection.project(building["rally"])
	_ground.draw_dashed_line(from, to, Color(1, 1, 1, 0.75), 3.0, 10.0)
	_ground.draw_line(to, to + Vector2(0, -34), INK, 3.0)
	_ground.draw_colored_polygon(PackedVector2Array([to + Vector2(0, -34), to + Vector2(22, -27), to + Vector2(0, -20)]), HERO_MAROON)


# ---------------------------------------------------------------- overlay

func _draw_overlay() -> void:
	if sim == null:
		return
	var zoom := camera.zoom.x
	var ui_scale := clampf(1.0 / zoom, 0.8, 1.7)
	for id: StringName in sim.buildings:
		var building: Dictionary = sim.buildings[id]
		var top := IsoProjection.project(sim.building_center(id)) + Vector2(0.0, -175.0 if id == &"main_hall" else -125.0)
		if id == &"main_hall":
			var ratio := float(building["hp"]) / float(building["max_hp"])
			_draw_tag(top + Vector2(0, -26) * ui_scale, Loc.t(&"room.main_hall"), HERO_MAROON, ui_scale)
			_draw_bar(top, Vector2(150, 12) * ui_scale, ratio, _hall_color(ratio), true)
			var queue: Array = building["queue"]
			if not queue.is_empty():
				_draw_bar(top + Vector2(0, 16) * ui_scale, Vector2(90, 7) * ui_scale, sim.training_progress(id), HERO_GOLD, false)
			continue
		var owner := int(building["owner"])
		var tag_color := HERO_MAROON if owner == RtsSimulation.TEAM_PLAYER else Color("4b5a2a")
		_draw_tag(top, Loc.t(StringName("room.%s" % id)), tag_color, ui_scale)
		var hero_kind: StringName = building["trains"]
		var subtitle := Loc.t(&"room.held")
		if owner == RtsSimulation.TEAM_PLAYER:
			subtitle = Loc.t(&"room.trains", {"hero": Loc.t(StringName("hero.%s" % hero_kind))})
		elif float(building["control"]) > -0.999:
			subtitle = Loc.t(&"room.capturing", {"percent": int(round((float(building["control"]) + 1.0) * 50.0))})
		_draw_small_text(top + Vector2(0, 22) * ui_scale, subtitle, Color(1, 1, 1, 0.95), 13, ui_scale)
		var queue: Array = building["queue"]
		if not queue.is_empty():
			_draw_bar(top + Vector2(0, 38) * ui_scale, Vector2(90, 7) * ui_scale, sim.training_progress(id), HERO_GOLD, false)
	for value: Dictionary in sim.units.values():
		var pos := IsoProjection.project(value["pos"])
		var team := int(value["team"])
		var data := Catalog.stats(value["kind"])
		var height := float(data.get("height", 58.0)) * 1.5
		if team == RtsSimulation.TEAM_CIVILIAN:
			if value["order"] == &"trapped":
				var bob := sin(_time * 4.0 + float(value["anim_seed"])) * 3.0
				_draw_speech(pos + Vector2(0, -96 + bob), Loc.t(&"civilian.help"), ui_scale)
			continue
		var id := int(value["id"])
		var ratio := float(value["hp"]) / float(value["max_hp"])
		var boss := bool(data.get("boss", false))
		if ratio < 0.999 or id in selected or id == _hover_id or boss:
			var width := 110.0 if boss else 44.0
			var color := Color("58c94f") if team == RtsSimulation.TEAM_PLAYER else ENEMY_RED
			if team == RtsSimulation.TEAM_PLAYER and ratio < 0.35:
				color = Color("f08a24")
			_draw_bar(pos + Vector2(0, -height - 12), Vector2(width, 7) * ui_scale, ratio, color, false)
		if team == RtsSimulation.TEAM_PLAYER and id in selected:
			var ready := float(value["power_cooldown"]) <= 0.0
			var dot_pos := pos + Vector2(30, -height - 12) * Vector2(ui_scale, 1.0)
			if ready:
				_draw_star(dot_pos, (7.0 + sin(_time * 6.0)) * ui_scale, HERO_GOLD)
		if team == RtsSimulation.TEAM_PLAYER and int(value.get("level", 1)) > 1:
			var level := int(value["level"])
			var star_size := 16.0 * ui_scale
			for star_index in level - 1:
				var offset := (float(star_index) - float(level - 2) * 0.5) * star_size * 0.9
				_overlay.draw_texture_rect(STAR_TEXTURE, Rect2(pos + Vector2(offset - star_size * 0.5, -height - 34.0 * ui_scale), Vector2(star_size, star_size)), false)
		if float(value["stun_timer"]) > 0.0:
			for star in 3:
				var angle := _time * 5.0 + TAU * float(star) / 3.0
				_draw_star(pos + Vector2(cos(angle) * 18.0, -height - 2 + sin(angle) * 6.0), 6.0, Color("d9a6ff"))
		if float(value["dash_timer"]) > 0.0 and bool(value["moving"]):
			for line in 3:
				var offset := Vector2(-float(value["facing"]) * (18.0 + 8.0 * float(line)), -20.0 - 12.0 * float(line))
				_overlay.draw_line(pos + offset, pos + offset + Vector2(-float(value["facing"]) * 16.0, 0), Color(1, 1, 1, 0.75), 3.0)
	for projectile: Dictionary in sim.projectiles:
		var pos := IsoProjection.project(projectile["pos"]) + Vector2(0, -36)
		var from := IsoProjection.project(projectile["from"]) + Vector2(0, -36)
		var direction := (pos - from).normalized()
		match projectile["kind"]:
			&"fire":
				for trail in 4:
					_overlay.draw_circle(pos - direction * float(trail) * 7.0, 8.0 - float(trail) * 1.6, Color(1.0, 0.45 + 0.1 * float(trail), 0.1, 0.9 - 0.2 * float(trail)))
				_overlay.draw_circle(pos, 4.0, Color("fff3b0"))
			&"psi":
				_overlay.draw_circle(pos, 8.0, Color(0.65, 0.35, 1.0, 0.55))
				_overlay.draw_circle(pos, 4.5, Color("f0dcff"))
			&"blaster", &"hall":
				_overlay.draw_line(pos - direction * 18.0, pos, Color("b7ff3c"), 4.0)
				_overlay.draw_circle(pos, 3.5, Color("efffc0"))
			&"tower":
				_draw_star(IsoProjection.project(projectile["pos"]) + Vector2(0, -60), 9.0, HERO_GOLD)
	_draw_squad_intents(ui_scale)
	for effect: Dictionary in _effects:
		_draw_effect(effect, ui_scale)
	if _dragging:
		var inverse := get_global_transform_with_canvas().affine_inverse()
		var rect := Rect2(inverse * _drag_start, Vector2.ZERO).expand(inverse * _drag_current)
		_overlay.draw_rect(rect, Color(HERO_GOLD, 0.12), true)
		_overlay.draw_rect(rect, HERO_GOLD, false, 2.0 / zoom)


## Grimsby's plan is readable: staging rings while squads mass, marching
## dashed arrows toward each squad's objective (bright right after a re-plan).
func _draw_squad_intents(ui_scale: float) -> void:
	if sim.ai == null or sim.ai.level <= 0:
		return
	for squad: Dictionary in sim.ai.squads:
		if (squad["members"] as Array).is_empty():
			continue
		var state: StringName = squad["state"]
		if state == &"gather":
			var stage := IsoProjection.project(squad["stage"])
			var pulse := 0.5 + 0.5 * sin(_time * 5.0)
			_draw_iso_ellipse(_overlay, stage, 2.2 + 0.2 * pulse, Color(ENEMY_RED, 0.3 + 0.3 * pulse), false, 3.0)
			_draw_small_text(stage + Vector2(0, -26) * ui_scale, Loc.t(&"fx.ai_massing"), Color("ffb3a8"), 13, ui_scale)
			continue
		var objective: StringName = squad["objective"]
		if objective == &"" or not sim.buildings.has(objective):
			continue
		var from := IsoProjection.project(squad["centroid"])
		var to := IsoProjection.project(sim.building_center(objective))
		var fresh := clampf(float(squad["intent"]) / InvaderAI.INTENT_SECONDS, 0.0, 1.0)
		var color := Color("c9d46a") if state == &"regroup" else ENEMY_RED
		_draw_intent_arrow(from, to, Color(color, 0.5 + 0.45 * fresh), (5.0 + 3.0 * fresh) * ui_scale)


func _draw_intent_arrow(from: Vector2, to: Vector2, color: Color, width: float) -> void:
	var delta := to - from
	var length := delta.length()
	if length < 120.0:
		return
	var direction := delta / length
	var start := from + direction * 30.0
	var end := to - direction * 80.0
	var total := (end - start).length()
	var dash := 22.0
	var gap := 14.0
	var cursor := -dash + fmod(_time * 70.0, dash + gap)
	while cursor < total:
		var a := maxf(cursor, 0.0)
		var b := minf(cursor + dash, total)
		if b > a:
			_overlay.draw_line(start + direction * a, start + direction * b, Color(INK, color.a * 0.7), width + 4.0)
			_overlay.draw_line(start + direction * a, start + direction * b, color, width)
		cursor += dash + gap
	var normal := Vector2(-direction.y, direction.x)
	var outline := PackedVector2Array([end + direction * 30.0, end - direction * 9.0 + normal * 20.0, end - direction * 9.0 - normal * 20.0])
	_overlay.draw_colored_polygon(outline, Color(INK, color.a * 0.7))
	var head := PackedVector2Array([end + direction * 24.0, end - direction * 6.0 + normal * 15.0, end - direction * 6.0 - normal * 15.0])
	_overlay.draw_colored_polygon(head, color)


func _hall_color(ratio: float) -> Color:
	if ratio > 0.6:
		return Color("58c94f")
	if ratio > 0.3:
		return Color("f0b429")
	return ENEMY_RED


func _draw_bar(center: Vector2, size: Vector2, ratio: float, color: Color, framed: bool) -> void:
	var rect := Rect2(center - size * 0.5, size)
	_overlay.draw_rect(rect.grow(2.0), INK, true)
	_overlay.draw_rect(rect, Color(0.22, 0.16, 0.2), true)
	var fill := Rect2(rect.position, Vector2(rect.size.x * clampf(ratio, 0.0, 1.0), rect.size.y))
	_overlay.draw_rect(fill, color, true)
	_overlay.draw_rect(Rect2(fill.position, Vector2(fill.size.x, fill.size.y * 0.4)), Color(1, 1, 1, 0.22), true)
	if framed:
		_overlay.draw_rect(rect.grow(3.5), PAPER, false, 1.5)


func _draw_tag(center: Vector2, text: String, color: Color, ui_scale: float) -> void:
	var size := int(round(16.0 * ui_scale))
	var text_size := _ui_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, size)
	var rect := Rect2(center - Vector2(text_size.x * 0.5 + 10.0, text_size.y * 0.5 + 3.0), Vector2(text_size.x + 20.0, text_size.y + 6.0))
	_overlay.draw_rect(Rect2(rect.position + Vector2(3, 3), rect.size), Color(0, 0, 0, 0.35), true)
	_overlay.draw_rect(rect, color, true)
	_overlay.draw_rect(rect, PAPER, false, 2.0)
	var ascent := _ui_font.get_ascent(size)
	var baseline := rect.position.y + (rect.size.y - _ui_font.get_height(size)) * 0.5 + ascent
	_overlay.draw_string(_ui_font, Vector2(rect.position.x + 10.0, baseline), text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, PAPER)


func _draw_small_text(center: Vector2, text: String, color: Color, base_size: int, ui_scale: float) -> void:
	var size := int(round(float(base_size) * ui_scale))
	var text_size := _ui_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, size)
	var origin := Vector2(center.x - text_size.x * 0.5, center.y + _ui_font.get_ascent(size) * 0.5)
	_overlay.draw_string_outline(_ui_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, 5, INK)
	_overlay.draw_string(_ui_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, color)


func _draw_speech(center: Vector2, text: String, ui_scale: float) -> void:
	var size := int(round(15.0 * ui_scale))
	var text_size := _display_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, size)
	var rect := Rect2(center - Vector2(text_size.x * 0.5 + 8.0, text_size.y * 0.5 + 2.0), Vector2(text_size.x + 16.0, text_size.y + 4.0))
	var tail := PackedVector2Array([Vector2(center.x - 6, rect.end.y - 1), Vector2(center.x + 6, rect.end.y - 1), Vector2(center.x - 2, rect.end.y + 10)])
	_overlay.draw_colored_polygon(tail, PAPER)
	_overlay.draw_rect(rect, PAPER, true)
	_overlay.draw_rect(rect, INK, false, 2.0)
	var baseline := rect.position.y + (rect.size.y - _display_font.get_height(size)) * 0.5 + _display_font.get_ascent(size)
	_overlay.draw_string(_display_font, Vector2(rect.position.x + 8.0, baseline), text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, Color("c22f2f"))


func _draw_star(center: Vector2, radius: float, color: Color) -> void:
	var points := PackedVector2Array()
	for index in 10:
		var angle := -PI * 0.5 + TAU * float(index) / 10.0
		var r := radius if index % 2 == 0 else radius * 0.45
		points.append(center + Vector2(cos(angle), sin(angle)) * r)
	_overlay.draw_colored_polygon(points, color)


func _draw_burst(center: Vector2, radius: float, color: Color, spikes: int) -> void:
	var points := PackedVector2Array()
	for index in spikes * 2:
		var angle := TAU * float(index) / float(spikes * 2)
		var r := radius if index % 2 == 0 else radius * 0.64
		points.append(center + Vector2(cos(angle), sin(angle) * 0.8) * r)
	_overlay.draw_colored_polygon(points, color)


func _draw_effect(effect: Dictionary, ui_scale: float) -> void:
	var t := float(effect["t"]) / float(effect["dur"])
	var pos: Vector2 = effect["pos"]
	var color: Color = effect.get("color", Color.WHITE)
	match effect["type"]:
		&"ring":
			var radius := float(effect.get("radius", 1.0)) * (0.35 + 0.65 * t)
			_draw_iso_ellipse(_overlay, pos, radius, Color(color, 1.0 - t), false, 4.0)
		&"blast":
			var radius := float(effect.get("radius", 1.0)) * (0.4 + 0.6 * t)
			_draw_iso_ellipse(_overlay, pos, radius, Color(color, 0.45 * (1.0 - t)), true)
			_draw_iso_ellipse(_overlay, pos, radius, Color(color.lightened(0.4), 1.0 - t), false, 4.0)
		&"burst":
			_draw_burst(pos, float(effect.get("size", 16.0)) * (0.6 + 0.6 * t), Color(color, 1.0 - t), 8)
		&"pow":
			var text: String = effect["text"]
			var pop := 1.0 + 0.3 * (1.0 - minf(t * 5.0, 1.0))
			var font_size := int(round(float(effect.get("size", 26.0)) * ui_scale * pop))
			var rise := Vector2(0, -24.0 * t)
			var text_size := _display_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size)
			var alpha := 1.0 - maxf(0.0, t - 0.65) / 0.35
			var center := pos + rise
			_draw_burst(center, text_size.x * 0.66 + 8.0, Color(INK, alpha), 11)
			_draw_burst(center, text_size.x * 0.62 + 4.0, Color(color, alpha), 11)
			var origin := center + Vector2(-text_size.x * 0.5, _display_font.get_ascent(font_size) * 0.42)
			_overlay.draw_string_outline(_display_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, 7, Color(INK, alpha))
			_overlay.draw_string(_display_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, Color(PAPER, alpha))
		&"float":
			var text: String = effect["text"]
			var font_size := int(round(float(effect.get("size", 16.0)) * ui_scale))
			var text_size := _ui_font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size)
			var origin := pos + Vector2(-text_size.x * 0.5, -34.0 * t)
			var alpha := 1.0 - maxf(0.0, t - 0.5) / 0.5
			_overlay.draw_string_outline(_ui_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, 5, Color(INK, alpha))
			_overlay.draw_string(_ui_font, origin, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, Color(color, alpha))
		&"beam":
			var to: Vector2 = effect["to"]
			_overlay.draw_line(pos, to, Color(color, 1.0 - t), 10.0 * (1.0 - t) + 2.0)
			_overlay.draw_line(pos, to, Color(1, 1, 1, 1.0 - t), 3.0)
		&"sparkle":
			for index in 6:
				var angle := TAU * float(index) / 6.0 + float(effect.get("seed", 0.0))
				var distance := 10.0 + 34.0 * t
				_draw_star(pos + Vector2(cos(angle), sin(angle) * 0.6) * distance + Vector2(0, -30.0 * t), 6.0 * (1.0 - t) + 1.0, Color(color, 1.0 - t))


# ---------------------------------------------------------------- effects

func handle_events(events: Array[Dictionary]) -> void:
	for event: Dictionary in events:
		var type: StringName = event["type"]
		var cell: Vector2 = event.get("pos", Vector2.ZERO)
		var pos := IsoProjection.project(cell)
		var visible := is_cell_on_screen(cell) if event.has("pos") else true
		match type:
			&"hit":
				if not visible:
					continue
				var team := int(event.get("team", 1))
				var amount := float(event.get("amount", 0.0))
				if amount >= 1.0:
					var color := Color("ff7a5c") if team == RtsSimulation.TEAM_PLAYER else PAPER
					var big := amount >= 30.0
					_add_effect({"type": &"float", "pos": pos + Vector2(_rng.randf_range(-12, 12), -64), "dur": 0.8, "text": str(int(round(amount))), "color": HERO_GOLD if big and team != RtsSimulation.TEAM_PLAYER else color, "size": 22.0 if big else 15.0})
				var impact := pos + Vector2(0, -34)
				match event.get("attack", &""):
					&"fire", &"fireball":
						fx.preset(&"hit_fire", impact)
					&"ice":
						fx.preset(&"hit_ice", impact)
					&"psi":
						fx.preset(&"hit_psi", impact)
					&"blaster":
						fx.preset(&"hit_zap", impact)
					&"melee", &"stretch", &"smash", &"rubber":
						fx.preset(&"punch", impact)
					&"slam", &"stomp", &"rocket":
						pass
					_:
						fx.preset(&"hit", impact)
			&"swing":
				if not visible:
					continue
				var attack: StringName = event.get("attack", &"")
				if attack == &"smash" and _rng.randf() < 0.5:
					_pow(pos + Vector2(0, -80), "WHAM!", ENEMY_RED, 110.0)
					_shake = maxf(_shake, 5.0)
				elif attack == &"stretch" and _rng.randf() < 0.3:
					_pow(pos + Vector2(0, -70), "BOING!", HERO_GOLD, 100.0)
				elif attack == &"ice" and _rng.randf() < 0.25:
					_pow(pos + Vector2(0, -70), "CRACK!", Color("8fd8ff"), 100.0)
				elif attack == &"melee" and _rng.randf() < 0.12:
					_pow(pos + Vector2(0, -70), ["POW!", "BAM!", "BONK!"][_rng.randi_range(0, 2)], HERO_GOLD, 92.0)
			&"impact":
				if not visible:
					continue
				match event.get("attack", &""):
					&"fire":
						_add_effect({"type": &"blast", "pos": pos, "dur": 0.4, "color": Color("ff7a2a"), "radius": 1.2})
						fx.burst(&"flame", pos + Vector2(0, -20), 3, Vector2(40, 110), Vector2(0.3, 0.5), Vector2(22, 32), Color.WHITE, {"glow": true, "grav": -120.0})
					&"psi":
						fx.flash(pos + Vector2(0, -20), 34.0, Color(0.7, 0.4, 1.0, 0.6), 0.2)
					&"blaster":
						fx.flash(pos + Vector2(0, -30), 22.0, Color(0.7, 1.0, 0.3, 0.7), 0.15, true, 1.0)
			&"death":
				var death_team := int(event.get("team", 1))
				if death_team == RtsSimulation.TEAM_ENEMY:
					var kind: StringName = event.get("kind", &"")
					var boss: bool = kind == &"mech"
					var heavy: bool = kind == &"brute"
					if visible:
						fx.preset(&"ko", pos + Vector2(0, -30), 1.6 if boss else (1.2 if heavy else 1.0))
						fx.preset(&"coins", pos + Vector2(0, -40), 1.2 if boss else 1.0)
					if boss:
						_shake = 16.0
						fx.preset(&"explosion", pos + Vector2(0, -40), 2.2)
						fx.preset(&"confetti", pos + Vector2(0, -120), 1.4)
						fx.sticker(&"kaboom", pos + Vector2(0, -150), 300.0, 1.8)
						_add_effect({"type": &"blast", "pos": pos, "dur": 0.9, "color": HERO_GOLD, "radius": 3.0})
						_scorch(pos, 260.0, 14.0)
						hitstop_requested.emit(0.16)
					elif heavy:
						_shake = maxf(_shake, 7.0)
						if visible:
							fx.sticker(&"ko", pos + Vector2(0, -95), 150.0, 0.9)
						hitstop_requested.emit(0.06)
					elif visible:
						_pow(pos + Vector2(0, -60), POW_WORDS[_rng.randi_range(0, POW_WORDS.size() - 1)], HERO_GOLD, 104.0)
				elif death_team == RtsSimulation.TEAM_PLAYER:
					fx.preset(&"smoke", pos + Vector2(0, -30))
					_pow(pos + Vector2(0, -60), Loc.t(&"fx.ouch"), Color("b7ff3c"), 110.0, true)
				else:
					fx.preset(&"smoke", pos + Vector2(0, -20), 0.8)
			&"rescued":
				_add_effect({"type": &"float", "pos": pos + Vector2(0, -70), "dur": 1.3, "text": "+%d %s" % [int(event.get("amount", 0)), Loc.t(&"hud.rep_short")], "color": HERO_GOLD, "size": 20.0})
				fx.preset(&"heal", pos + Vector2(0, -50), 1.2)
				fx.preset(&"coins", pos + Vector2(0, -40))
				_add_effect({"type": &"ring", "pos": pos, "dur": 0.8, "color": CIVILIAN_BLUE, "radius": 1.6})
			&"escort":
				_add_effect({"type": &"float", "pos": pos + Vector2(0, -100), "dur": 1.1, "text": Loc.t(&"fx.follow"), "color": CIVILIAN_BLUE, "size": 16.0})
				fx.burst(&"heart", pos + Vector2(0, -70), 3, Vector2(30, 70), Vector2(0.6, 0.9), Vector2(14, 20), Color.WHITE, {"grav": -80.0, "spin": 0.5})
			&"secured":
				_add_effect({"type": &"ring", "pos": pos, "dur": 1.2, "color": HERO_GOLD, "radius": 4.0})
				fx.preset(&"confetti", pos + Vector2(0, -120), 1.1)
				fx.flash(pos, 260.0, Color(1.0, 0.85, 0.3, 0.55), 0.6)
				fx.sticker(&"burst", pos + Vector2(0, -175), 240.0, 1.7, {"text": Loc.t(&"fx.secured"), "font": 30.0, "color": HERO_MAROON})
			&"lost":
				_add_effect({"type": &"ring", "pos": pos, "dur": 1.2, "color": ENEMY_RED, "radius": 4.0})
				fx.preset(&"smoke", pos + Vector2(0, -60), 2.0)
				fx.sticker(&"warning", pos + Vector2(0, -175), 150.0, 1.6)
			&"trained":
				fx.preset(&"level_up", pos + Vector2(0, -20), 0.8)
				fx.preset(&"portal_puff", pos, 0.6)
			&"power":
				_power_effect(event)
			&"rally":
				for hero: Dictionary in sim.heroes():
					fx.preset(&"heal", IsoProjection.project(hero["pos"]) + Vector2(0, -50))
				fx.preset(&"confetti", pos + Vector2(0, -200), 1.0)
				fx.sticker(&"burst", pos + Vector2(0, -230), 250.0, 1.8, {"text": Loc.t(&"fx.rally"), "font": 30.0, "color": HERO_MAROON})
			&"surge":
				_shake = maxf(_shake, 6.0)
				for hero: Dictionary in sim.heroes():
					var hero_pos := IsoProjection.project(hero["pos"])
					fx.flash(hero_pos, 70.0, Color(1.0, 0.8, 0.25, 0.8), 0.5)
					fx.burst(&"star", hero_pos + Vector2(0, -30), 5, Vector2(80, 180), Vector2(0.5, 0.8), Vector2(12, 20), Color.WHITE, {"glow": true, "grav": -60.0})
			&"level_up":
				fx.preset(&"level_up", pos + Vector2(0, -40), 1.2)
				fx.sticker(&"levelup", pos + Vector2(0, -150), 170.0, 1.4)
				_add_effect({"type": &"ring", "pos": pos, "dur": 0.8, "color": HERO_GOLD, "radius": 1.6})
			&"combo":
				var count := int(event.get("count", 2))
				if count >= 3 and (count <= 5 or count % 5 == 0) and visible:
					fx.sticker(&"combo", pos + Vector2(0, -130), 120.0 + minf(float(count) * 6.0, 80.0), 1.0, {"text": "x%d" % count, "font": 30.0, "text_dy": 34.0, "color": HERO_GOLD})
			&"hall_hit":
				if _rng.randf() < 0.25:
					_shake = maxf(_shake, 3.0)
				if _rng.randf() < 0.35:
					var hall := IsoProjection.project(sim.building_center(&"main_hall"))
					fx.burst(&"dust", hall + Vector2(_rng.randf_range(-80, 80), -40), 2, Vector2(30, 80), Vector2(0.5, 0.8), Vector2(24, 34), Color(1, 1, 1, 0.7), {"grow": 1.5, "grav": 60.0})
			&"boss":
				_shake = 12.0
				fx.sticker(&"warning", pos + Vector2(0, -210), 170.0, 2.2)
				fx.preset(&"portal_puff", pos, 2.0)
				hitstop_requested.emit(0.1)
			&"wave_lane":
				_add_effect({"type": &"ring", "pos": pos, "dur": 1.5, "color": ENEMY_RED, "radius": 3.0})
				_portal_lanes[event.get("lane", &"")] = 1.2
			&"spawn":
				if visible:
					fx.preset(&"portal_puff", pos + Vector2(0, -20), 0.8)
			&"bonus":
				_add_effect({"type": &"float", "pos": pos + Vector2(0, -220), "dur": 1.5, "text": "+%d %s" % [int(event.get("amount", 0)), Loc.t(&"hud.rep_short")], "color": HERO_GOLD, "size": 22.0})
				fx.preset(&"coins", pos + Vector2(0, -200), 1.4)
			&"civilian_spawn":
				_add_effect({"type": &"ring", "pos": pos, "dur": 0.8, "color": CIVILIAN_BLUE, "radius": 1.0})
			&"squad_charge":
				_add_effect({"type": &"ring", "pos": pos, "dur": 1.0, "color": ENEMY_RED, "radius": 2.6})
				if visible:
					fx.sticker(&"burst", pos + Vector2(0, -120), 170.0, 1.2, {"text": Loc.t(&"fx.charge"), "font": 26.0, "color": ENEMY_RED})
					fx.burst(&"dust", pos + Vector2(0, -8), 6, Vector2(40, 110), Vector2(0.4, 0.7), Vector2(22, 34), Color(1, 1, 1, 0.7), {"grow": 1.6, "grav": 40.0})
			&"squad_intent":
				var mode: StringName = event.get("mode", &"attack")
				var objective: StringName = event.get("objective", &"")
				if mode == &"regroup":
					_add_effect({"type": &"ring", "pos": pos, "dur": 1.2, "color": Color("c9d46a"), "radius": 3.2})
				else:
					_add_effect({"type": &"ring", "pos": pos, "dur": 1.4, "color": ENEMY_RED, "radius": 4.2})
					if objective != &"main_hall" and fx.sticker_slot_free(pos + Vector2(0, -190), 140.0):
						fx.sticker(&"warning", pos + Vector2(0, -190), 120.0, 1.4)
			&"alarm":
				_add_effect({"type": &"ring", "pos": pos, "dur": 0.9, "color": ENEMY_RED, "radius": 3.4})
				if visible:
					_pow(pos + Vector2(0, -165), Loc.t(&"fx.alert"), ENEMY_RED, 112.0, true)
			&"enemy_heal":
				if visible:
					fx.burst(&"plus", pos + Vector2(_rng.randf_range(-50, 50), -40), 3, Vector2(30, 70), Vector2(0.6, 0.9), Vector2(14, 20), Color(0.75, 1.0, 0.45), {"grav": -80.0})
			&"retreat":
				if visible:
					_add_effect({"type": &"float", "pos": pos + Vector2(0, -88), "dur": 1.1, "text": Loc.t(&"fx.retreat"), "color": Color("c9d46a"), "size": 15.0})
			&"kite":
				if visible:
					fx.burst(&"dust", pos + Vector2(0, -6), 2, Vector2(20, 50), Vector2(0.3, 0.5), Vector2(14, 20), Color(1, 1, 1, 0.6), {"grow": 1.4})
			&"telegraph":
				if event.get("kind", &"") == &"stomp":
					fx.sticker(&"warning", pos + Vector2(0, -150), 110.0, float(event.get("windup", 1.0)))
			&"telegraph_hit":
				var kind: StringName = event.get("kind", &"")
				var radius := float(event.get("radius", 1.0))
				match kind:
					&"stomp":
						_shake = maxf(_shake, 14.0)
						fx.preset(&"rubber_slam", pos, 1.6)
						fx.sticker(&"burst", pos + Vector2(0, -110), 170.0, 0.9, {"text": "STOMP!", "font": 30.0, "color": ENEMY_RED})
						_scorch(pos, radius * ISO_RADIUS_X * 1.6, 6.0)
						hitstop_requested.emit(0.08)
					&"rocket":
						_shake = maxf(_shake, 8.0)
						fx.preset(&"explosion", pos + Vector2(0, -10), 1.1)
						_scorch(pos, radius * ISO_RADIUS_X * 1.9, 7.0)
						if visible and fx.sticker_slot_free(pos + Vector2(0, -90), 140.0):
							fx.sticker(&"kaboom", pos + Vector2(0, -90), 130.0, 0.8)
					&"slam":
						_shake = maxf(_shake, 7.0)
						fx.preset(&"rubber_slam", pos, 0.9)
						_pow(pos + Vector2(0, -80), "SMASH!", ENEMY_RED, 120.0, true)
						_scorch(pos, radius * ISO_RADIUS_X * 1.3, 4.0)
			&"hype_full":
				pass


## Comic sound-word sticker. Small ones are throttled so crowded fights stay readable.
func _pow(position: Vector2, text: String, color: Color, size: float, force: bool = false) -> void:
	if not force and not fx.sticker_slot_free(position):
		return
	fx.sticker(&"burst", position, size, 0.8, {"text": text, "font": size * 0.24, "color": color if color != HERO_GOLD else PAPER})


func _scorch(position: Vector2, size: float, duration: float) -> void:
	_scorches.append({"pos": position, "size": size, "dur": duration, "t": 0.0})
	while _scorches.size() > 18:
		_scorches.pop_front()


func _power_effect(event: Dictionary) -> void:
	var kind: StringName = event["kind"]
	var pos := IsoProjection.project(event["pos"])
	var radius := float(event.get("radius", 1.0))
	var from := IsoProjection.project(event.get("from", event["pos"])) + Vector2(0, -40)
	match kind:
		&"monitor":
			fx.preset(&"dash", pos)
			fx.sticker(&"burst", pos + Vector2(0, -110), 130.0, 0.8, {"text": "ZOOM!", "font": 28.0, "color": HERO_MAROON})
		&"blaze":
			_add_effect({"type": &"beam", "pos": from, "to": pos + Vector2(0, -20), "dur": 0.35, "color": Color("ff7a2a")})
			_add_effect({"type": &"blast", "pos": pos, "dur": 0.7, "color": Color("ff6a1a"), "radius": radius})
			fx.preset(&"fireball", pos + Vector2(0, -10), 1.2)
			fx.sticker(&"burst", pos + Vector2(0, -100), 170.0, 0.9, {"text": "FWOOSH!", "font": 32.0, "color": Color("ff8a2a")})
			_scorch(pos, radius * ISO_RADIUS_X * 1.7, 6.0)
			_shake = maxf(_shake, 8.0)
			hitstop_requested.emit(0.05)
		&"frost":
			_add_effect({"type": &"blast", "pos": pos, "dur": 0.9, "color": Color("8fd8ff"), "radius": radius})
			fx.preset(&"ice_nova", pos + Vector2(0, -20), 1.1)
			fx.sticker(&"burst", pos + Vector2(0, -130), 170.0, 0.9, {"text": "SHIELDS UP!", "font": 24.0, "color": Color("8fd8ff")})
		&"psi":
			_add_effect({"type": &"beam", "pos": from, "to": pos + Vector2(0, -20), "dur": 0.4, "color": Color("b67bff")})
			_add_effect({"type": &"blast", "pos": pos, "dur": 0.9, "color": Color("a66bff"), "radius": radius})
			fx.preset(&"psi_lift", pos + Vector2(0, -20), 1.1)
			fx.sticker(&"burst", pos + Vector2(0, -100), 170.0, 0.9, {"text": "MIND LIFT!", "font": 26.0, "color": Color("d9b6ff")})
		&"stretch":
			_add_effect({"type": &"blast", "pos": pos, "dur": 0.6, "color": HERO_GOLD, "radius": radius})
			fx.preset(&"rubber_slam", pos, 1.2)
			fx.sticker(&"sproing", pos + Vector2(0, -110), 170.0, 0.9)
			_shake = maxf(_shake, 9.0)
			hitstop_requested.emit(0.05)


func _add_effect(effect: Dictionary) -> void:
	if reduced_motion and effect["type"] in [&"sparkle", &"burst"]:
		return
	if effect["type"] == &"pow" and float(effect.get("size", 20.0)) < 30.0 and not _pow_slot_free(effect["pos"]):
		return
	effect["t"] = 0.0
	_effects.append(effect)
	if _effects.size() > 200:
		_effects.pop_front()


## Small sound-word stickers are capped globally and spaced apart; headline stickers always show.
func _pow_slot_free(position: Vector2) -> bool:
	var small := 0
	for other: Dictionary in _effects:
		if other["type"] != &"pow":
			continue
		if (other["pos"] as Vector2).distance_to(position) < 110.0:
			return false
		if float(other.get("size", 20.0)) < 30.0:
			small += 1
	return small < 3


func _update_effects(delta: float) -> void:
	var alive: Array[Dictionary] = []
	for effect: Dictionary in _effects:
		effect["t"] = float(effect["t"]) + delta
		if float(effect["t"]) < float(effect["dur"]):
			alive.append(effect)
	_effects = alive
	var markers: Array[Dictionary] = []
	for marker: Dictionary in _markers:
		marker["t"] = float(marker["t"]) + delta
		if float(marker["t"]) < float(marker["dur"]):
			markers.append(marker)
	_markers = markers


func effect_count() -> int:
	return _effects.size()


# ---------------------------------------------------------------- camera

func focus_on(cell_position: Vector2, instant: bool = false) -> void:
	var target := IsoProjection.project(cell_position)
	if instant:
		camera.position = target
		_clamp_camera()
		return
	var tween := create_tween()
	tween.tween_property(camera, "position", target, 0.35).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)


func _text_input_focused() -> bool:
	var viewport := get_viewport()
	if viewport == null:
		return false
	return viewport.gui_get_focus_owner() is LineEdit


func _update_camera(delta: float) -> void:
	var move := Vector2.ZERO
	if input_enabled:
		var letters := not (Input.is_key_pressed(KEY_CTRL) or Input.is_key_pressed(KEY_META)) and not _text_input_focused()
		if Input.is_key_pressed(KEY_LEFT) or (letters and Input.is_key_pressed(KEY_A)):
			move.x -= 1.0
		if Input.is_key_pressed(KEY_RIGHT) or (letters and Input.is_key_pressed(KEY_D)):
			move.x += 1.0
		if Input.is_key_pressed(KEY_UP) or (letters and Input.is_key_pressed(KEY_W)):
			move.y -= 1.0
		if Input.is_key_pressed(KEY_DOWN) or (letters and Input.is_key_pressed(KEY_S)):
			move.y += 1.0
		var viewport := get_viewport()
		if move == Vector2.ZERO and edge_pan_enabled and _pointer_inside and viewport != null and not _pan_dragging and _touch_points.is_empty() and DisplayServer.window_is_focused():
			var mouse := viewport.get_mouse_position()
			var size := viewport.get_visible_rect().size
			if Rect2(Vector2.ZERO, size).has_point(mouse):
				if mouse.x < EDGE_PAN_MARGIN:
					move.x -= 1.0
				elif mouse.x > size.x - EDGE_PAN_MARGIN:
					move.x += 1.0
				if mouse.y < EDGE_PAN_MARGIN:
					move.y -= 1.0
				elif mouse.y > size.y - EDGE_PAN_MARGIN:
					move.y += 1.0
	if move != Vector2.ZERO:
		camera.position += move.normalized() * PAN_SPEED * delta / camera.zoom.x
	var goal := _zoom_target * zoom_multiplier
	var zoom := lerpf(camera.zoom.x, goal, clampf(delta * 12.0, 0.0, 1.0))
	camera.zoom = Vector2(zoom, zoom)
	_clamp_camera()
	if _shake > 0.0 and not reduced_motion:
		camera.offset = Vector2(_rng.randf_range(-1, 1), _rng.randf_range(-1, 1)) * _shake
		_shake = maxf(0.0, _shake - delta * 30.0)
	else:
		camera.offset = Vector2.ZERO
		_shake = 0.0


func _clamp_camera() -> void:
	var bounds := IsoProjection.map_bounds(Map.SIZE).grow(-160.0)
	camera.position = Vector2(clampf(camera.position.x, bounds.position.x, bounds.end.x), clampf(camera.position.y, bounds.position.y, bounds.end.y))


func zoom_by(factor: float) -> void:
	_zoom_target = clampf(_zoom_target * factor, MIN_ZOOM, MAX_ZOOM)


func camera_cell_center() -> Vector2:
	return IsoProjection.unproject(camera.position)


func visible_world_rect() -> Rect2:
	var size := get_viewport().get_visible_rect().size / camera.zoom
	return Rect2(camera.position - size * 0.5, size)


func is_cell_on_screen(cell_position: Vector2) -> bool:
	return visible_world_rect().grow(80.0).has_point(IsoProjection.project(cell_position))


func world_to_screen(cell_position: Vector2) -> Vector2:
	return get_global_transform_with_canvas() * IsoProjection.project(cell_position)


func screen_to_cell(screen: Vector2) -> Vector2:
	return IsoProjection.unproject(get_global_transform_with_canvas().affine_inverse() * screen)


# ---------------------------------------------------------------- input

func _pointer_over_ui(screen: Vector2) -> bool:
	for blocker in ui_blockers:
		if is_instance_valid(blocker) and blocker.is_visible_in_tree() and blocker.get_global_rect().has_point(screen):
			return true
	return false


func cancel_drag() -> void:
	_dragging = false
	_left_down = false
	_pan_dragging = false
	_touch_points.clear()
	_touch_pinch_distance = 0.0
	_touch_moved = false
	_touch_travel = 0.0


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_MOUSE_ENTER:
		_pointer_inside = true
	elif what == NOTIFICATION_WM_MOUSE_EXIT or what == NOTIFICATION_APPLICATION_FOCUS_OUT:
		_pointer_inside = false
		cancel_drag()


func _input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		_pointer_inside = get_viewport().get_visible_rect().has_point(event.position)


func _unhandled_input(event: InputEvent) -> void:
	if sim == null or not input_enabled:
		return
	if event is InputEventScreenTouch or event is InputEventScreenDrag:
		_handle_touch(event)
		return
	if event is InputEventMouseButton:
		var mouse := event as InputEventMouseButton
		if mouse.pressed and _pointer_over_ui(mouse.position):
			return
		match mouse.button_index:
			MOUSE_BUTTON_WHEEL_UP:
				if mouse.pressed:
					zoom_by(1.1)
			MOUSE_BUTTON_WHEEL_DOWN:
				if mouse.pressed:
					zoom_by(1.0 / 1.1)
			MOUSE_BUTTON_MIDDLE:
				_pan_dragging = mouse.pressed
				_pan_last = mouse.position
			MOUSE_BUTTON_LEFT:
				if mouse.pressed:
					if attack_move_armed:
						_issue_move(screen_to_cell(mouse.position), true)
						attack_move_armed = false
						get_viewport().set_input_as_handled()
						return
					_left_down = true
					_drag_start = mouse.position
					_drag_current = mouse.position
					_dragging = false
				elif _left_down:
					_left_down = false
					if _dragging:
						_finish_box_select(mouse.shift_pressed)
					else:
						_click_select(mouse.position, mouse.shift_pressed, mouse.double_click)
					_dragging = false
			MOUSE_BUTTON_RIGHT:
				if mouse.pressed:
					if attack_move_armed:
						attack_move_armed = false
					else:
						_right_click(mouse.position)
		get_viewport().set_input_as_handled()
	elif event is InputEventMouseMotion:
		var motion := event as InputEventMouseMotion
		if _pan_dragging:
			camera.position -= (motion.position - _pan_last) / camera.zoom.x
			_pan_last = motion.position
			_clamp_camera()
		if _left_down:
			_drag_current = motion.position
			if _drag_current.distance_to(_drag_start) > DRAG_THRESHOLD:
				_dragging = true
	elif event is InputEventMagnifyGesture:
		zoom_by((event as InputEventMagnifyGesture).factor)
	elif event is InputEventPanGesture:
		camera.position += (event as InputEventPanGesture).delta * 12.0 / camera.zoom.x
		_clamp_camera()


func _handle_touch(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		var touch := event as InputEventScreenTouch
		if touch.pressed:
			if _pointer_over_ui(touch.position):
				return
			_touch_points[touch.index] = touch.position
			if _touch_points.size() == 1:
				_touch_moved = false
				_touch_travel = 0.0
			elif _touch_points.size() == 2:
				var points: Array = _touch_points.values()
				_touch_pinch_distance = (points[0] as Vector2).distance_to(points[1])
				_touch_moved = true
		else:
			if not _touch_points.has(touch.index):
				return
			_touch_points.erase(touch.index)
			if _touch_points.is_empty() and not _touch_moved:
				_tap(touch.position)
		get_viewport().set_input_as_handled()
	elif event is InputEventScreenDrag:
		var drag := event as InputEventScreenDrag
		if not _touch_points.has(drag.index):
			return
		_touch_points[drag.index] = drag.position
		if _touch_points.size() == 1:
			_touch_travel += drag.relative.length()
			if _touch_travel > 12.0:
				_touch_moved = true
			if _touch_moved:
				camera.position -= drag.relative / camera.zoom.x
				_clamp_camera()
		elif _touch_points.size() == 2:
			var points: Array = _touch_points.values()
			var distance := (points[0] as Vector2).distance_to(points[1])
			if _touch_pinch_distance > 0.0:
				_zoom_target = clampf(_zoom_target * distance / _touch_pinch_distance, MIN_ZOOM, MAX_ZOOM)
			_touch_pinch_distance = distance
			camera.position -= drag.relative * 0.5 / camera.zoom.x
			_clamp_camera()
		get_viewport().set_input_as_handled()


## Touch tap: select what is under the finger, otherwise command the current squad.
func _tap(screen: Vector2) -> void:
	var cell := screen_to_cell(screen)
	if _pick_unit(screen, RtsSimulation.TEAM_PLAYER) != 0:
		_click_select(screen, false, false)
		return
	if _pick_unit(screen, RtsSimulation.TEAM_ENEMY) != 0 and not selected.is_empty():
		_right_click(screen)
		return
	var building := sim.building_at(cell)
	if selected.is_empty():
		if building != &"":
			select_building(building)
		return
	_issue_move(cell, true)
	attack_move_armed = false


func _pick_unit(screen: Vector2, team: int = -99) -> int:
	var id := sim.unit_at(screen_to_cell(screen), 0.5, team)
	if id == 0:
		# Tall sprites: the cursor is usually over the body, above the feet.
		id = sim.unit_at(screen_to_cell(screen + Vector2(0, 34.0 * camera.zoom.x)), 0.5, team)
	if id == 0:
		id = sim.unit_at(screen_to_cell(screen + Vector2(0, 62.0 * camera.zoom.x)), 0.45, team)
	return id


func _click_select(screen: Vector2, additive: bool, double_click: bool) -> void:
	var id := _pick_unit(screen, RtsSimulation.TEAM_PLAYER)
	var value: Dictionary = sim.units.get(id, {})
	if not value.is_empty():
		var now := Time.get_ticks_msec()
		if double_click or (now - _last_click_ms < DOUBLE_CLICK_MS and _last_click_kind == value["kind"]):
			select_kind_on_screen(value["kind"], additive)
		elif additive:
			if id in selected:
				selected.erase(id)
			else:
				selected.append(id)
		else:
			selected = [id]
		_last_click_ms = now
		_last_click_kind = value["kind"]
		selected_building = &""
		command_feedback.emit(&"unit_select")
		selection_changed.emit()
		return
	var building := sim.building_at(screen_to_cell(screen))
	if building != &"":
		select_building(building)
		return
	if not additive:
		selected.clear()
		selected_building = &""
		selection_changed.emit()


func select_building(id: StringName) -> void:
	selected.clear()
	selected_building = id
	command_feedback.emit(&"unit_select")
	selection_changed.emit()


func select_kind_on_screen(kind: StringName, additive: bool) -> void:
	if not additive:
		selected.clear()
	for hero: Dictionary in sim.heroes():
		if hero["kind"] == kind and is_cell_on_screen(hero["pos"]) and not (int(hero["id"]) in selected):
			selected.append(int(hero["id"]))
	selected_building = &""
	selection_changed.emit()


## Selects every hero of one class anywhere on campus (hero-card rail).
func select_kind(kind: StringName, additive: bool) -> int:
	if not additive:
		selected.clear()
	var count := 0
	for hero: Dictionary in sim.heroes():
		if hero["kind"] == kind and not (int(hero["id"]) in selected):
			selected.append(int(hero["id"]))
			count += 1
	selected_building = &""
	if count > 0:
		command_feedback.emit(&"unit_select")
	selection_changed.emit()
	return count


func focus_kind(kind: StringName) -> void:
	for hero: Dictionary in sim.heroes():
		if hero["kind"] == kind:
			focus_on(hero["pos"])
			return


func select_all_heroes() -> void:
	selected.clear()
	for hero: Dictionary in sim.heroes():
		selected.append(int(hero["id"]))
	selected_building = &""
	command_feedback.emit(&"unit_select")
	selection_changed.emit()


func select_idle_hero() -> bool:
	var heroes := sim.heroes()
	for hero: Dictionary in heroes:
		if hero["order"] == &"idle" and int(hero["target"]) == 0 and not (int(hero["id"]) in selected):
			selected = [int(hero["id"])]
			selected_building = &""
			focus_on(hero["pos"])
			selection_changed.emit()
			return true
	return false


func _finish_box_select(additive: bool) -> void:
	var rect := Rect2(_drag_start, Vector2.ZERO).expand(_drag_current).grow(10.0)
	if not additive:
		selected.clear()
	for hero: Dictionary in sim.heroes():
		var feet := world_to_screen(hero["pos"])
		var body := feet + Vector2(0, -40.0 * camera.zoom.x)
		if (rect.has_point(feet) or rect.has_point(body)) and not (int(hero["id"]) in selected):
			selected.append(int(hero["id"]))
	selected_building = &""
	if not selected.is_empty():
		command_feedback.emit(&"unit_select")
	selection_changed.emit()


func _right_click(screen: Vector2) -> void:
	var cell := screen_to_cell(screen)
	if selected.is_empty():
		if selected_building != &"" and int(sim.buildings[selected_building]["owner"]) == RtsSimulation.TEAM_PLAYER:
			sim.set_rally(selected_building, cell)
			_markers.append({"pos": IsoProjection.project(cell), "t": 0.0, "dur": 0.6, "color": HERO_GOLD})
			command_feedback.emit(&"order_move")
		return
	var foe := _pick_unit(screen, RtsSimulation.TEAM_ENEMY)
	if foe != 0:
		sim.command_attack(selected, foe)
		_markers.append({"pos": IsoProjection.project(sim.units[foe]["pos"]), "t": 0.0, "dur": 0.6, "color": ENEMY_RED})
		_order_fx(sim.units[foe]["pos"], ENEMY_RED)
		command_feedback.emit(&"order_attack")
		return
	_issue_move(cell, false)


func _issue_move(cell: Vector2, attack_move: bool) -> void:
	if selected.is_empty():
		return
	sim.command_move(selected, cell, attack_move)
	_markers.append({"pos": IsoProjection.project(cell), "t": 0.0, "dur": 0.6, "color": ENEMY_RED if attack_move else Color.WHITE})
	_order_fx(cell, ENEMY_RED if attack_move else HERO_GOLD)
	command_feedback.emit(&"order_attack" if attack_move else &"order_move")


func command_selected_to(cell: Vector2, attack_move: bool) -> void:
	_issue_move(cell, attack_move)


func arm_attack_move() -> bool:
	if selected.is_empty():
		return false
	attack_move_armed = true
	return true


func issue_stop() -> void:
	if selected.is_empty():
		return
	sim.command_stop(selected)
	command_feedback.emit(&"ui_cancel")


func issue_power() -> int:
	if selected.is_empty():
		return 0
	var used := sim.command_power(selected)
	command_feedback.emit(&"attack_magic" if used > 0 else &"ui_error")
	return used


func assign_group(slot: int) -> bool:
	if selected.is_empty():
		return false
	groups[slot] = selected.duplicate()
	return true


func recall_group(slot: int) -> bool:
	var ids: Array = groups.get(slot, [])
	var alive: Array[int] = []
	for id: int in ids:
		if sim.units.has(id):
			alive.append(id)
	if alive.is_empty():
		return false
	var now := Time.get_ticks_msec()
	if selected == alive and now - _last_click_ms < 450:
		focus_on(sim.units[alive[0]]["pos"])
	selected = alive
	selected_building = &""
	_last_click_ms = now
	selection_changed.emit()
	return true


func _on_selection_fx() -> void:
	if sim == null or fx == null:
		return
	for id: int in selected:
		if id in _fx_selected:
			continue
		var value: Dictionary = sim.units.get(id, {})
		if not value.is_empty():
			var pos := IsoProjection.project(value["pos"])
			fx.preset(&"ui_sparkle", pos + Vector2(0, -50), 0.8)
			_add_effect({"type": &"ring", "pos": pos, "dur": 0.35, "color": HERO_GOLD, "radius": 0.8})
	_fx_selected = selected.duplicate()


func _order_fx(cell: Vector2, color: Color) -> void:
	var pos := IsoProjection.project(cell)
	fx.burst(&"dust", pos, 3, Vector2(30, 70), Vector2(0.3, 0.5), Vector2(16, 24), Color(1, 1, 1, 0.7), {"grow": 1.5, "squash": 0.35})
	fx.flash(pos, 34.0, Color(color, 0.6), 0.2, true, 0.5)


func _update_hover() -> void:
	var viewport := get_viewport()
	if viewport == null:
		return
	var mouse := viewport.get_mouse_position()
	if _pointer_over_ui(mouse):
		_hover_id = 0
		_hover_building = &""
		return
	_hover_id = _pick_unit(mouse)
	_hover_building = sim.building_at(screen_to_cell(mouse)) if _hover_id == 0 else &""


func hover_unit() -> int:
	return _hover_id


func hover_building() -> StringName:
	return _hover_building
