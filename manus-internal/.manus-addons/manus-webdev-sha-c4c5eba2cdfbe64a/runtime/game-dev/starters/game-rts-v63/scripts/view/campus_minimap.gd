class_name CampusMinimap
extends Control
## Clickable tactical minimap of Maplecrest High.

signal focus_requested(cell_position: Vector2)
signal command_requested(cell_position: Vector2)

const Map := preload("res://scripts/data/campus_map.gd")
const Catalog := preload("res://scripts/data/hero_catalog.gd")

var sim: RtsSimulation
var battlefield: Battlefield
var _dragging := false
var _time := 0.0


func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	custom_minimum_size = Vector2(196, 128)
	clip_contents = true


func _process(delta: float) -> void:
	_time += delta
	if is_visible_in_tree():
		queue_redraw()


func _map_transform() -> Dictionary:
	var bounds := IsoProjection.map_bounds(Map.SIZE)
	var inner := Rect2(Vector2(6, 6), size - Vector2(12, 12))
	var scale_value := minf(inner.size.x / bounds.size.x, inner.size.y / bounds.size.y)
	var offset := inner.position + (inner.size - bounds.size * scale_value) * 0.5 - bounds.position * scale_value
	return {"scale": scale_value, "offset": offset}


func _to_mini(cell_position: Vector2, transform_data: Dictionary) -> Vector2:
	return IsoProjection.project(cell_position) * float(transform_data["scale"]) + (transform_data["offset"] as Vector2)


func _from_mini(point: Vector2) -> Vector2:
	var transform_data := _map_transform()
	var world := (point - (transform_data["offset"] as Vector2)) / float(transform_data["scale"])
	return IsoProjection.unproject(world)


func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color("1c1320"), true)
	if sim == null:
		return
	var tr := _map_transform()
	var diamond := PackedVector2Array([
		_to_mini(Vector2.ZERO, tr), _to_mini(Vector2(Map.SIZE.x, 0), tr),
		_to_mini(Vector2(Map.SIZE), tr), _to_mini(Vector2(0, Map.SIZE.y), tr),
	])
	draw_colored_polygon(diamond, Color("4f7d3a"))
	for x in Map.SIZE.x:
		for y in Map.SIZE.y:
			var kind := Map.terrain_at(Vector2i(x, y))
			if kind == Map.GRASS:
				continue
			var color := Color("c9b48f") if kind == Map.PAVERS else Color("5d5a60")
			draw_circle(_to_mini(Vector2(x, y) + Vector2(0.5, 0.5), tr), 1.6, color)
	for lane: StringName in Map.SPAWNS:
		var point := _to_mini(Map.SPAWNS[lane], tr)
		draw_circle(point, 4.0, Color(0.88, 0.27, 0.18, 0.55))
	for id: StringName in sim.buildings:
		var building: Dictionary = sim.buildings[id]
		var origin: Vector2 = Vector2(building["origin"])
		var footprint: Vector2 = Vector2(building["footprint"])
		var points := PackedVector2Array([
			_to_mini(origin, tr), _to_mini(origin + Vector2(footprint.x, 0), tr),
			_to_mini(origin + footprint, tr), _to_mini(origin + Vector2(0, footprint.y), tr),
		])
		var owner := int(building["owner"])
		var color := Color("f2b72c") if owner == RtsSimulation.TEAM_PLAYER else Color("6f7f35")
		if id == &"main_hall":
			color = Color("8e1b2e")
		draw_colored_polygon(points, color)
		var outline := points.duplicate()
		outline.append(points[0])
		draw_polyline(outline, Color("fff6df") if battlefield != null and battlefield.selected_building == id else Color("1c1320"), 1.5)
	for value: Dictionary in sim.units.values():
		var team := int(value["team"])
		var point := _to_mini(value["pos"], tr)
		match team:
			RtsSimulation.TEAM_PLAYER:
				var selected := battlefield != null and int(value["id"]) in battlefield.selected
				draw_circle(point, 3.2 if selected else 2.6, Color("fff6df") if selected else Color("f2b72c"))
			RtsSimulation.TEAM_ENEMY:
				var boss := bool(Catalog.stats(value["kind"]).get("boss", false))
				draw_circle(point, 5.0 if boss else 2.4, Color("e0452f"))
			RtsSimulation.TEAM_CIVILIAN:
				if value["order"] == &"trapped":
					if int(_time * 3.0) % 2 == 0:
						draw_circle(point, 3.0, Color("6fc3ff"))
				else:
					draw_circle(point, 2.0, Color("6fc3ff"))
	if battlefield != null:
		var view := battlefield.visible_world_rect()
		var scale_value := float(tr["scale"])
		var offset: Vector2 = tr["offset"]
		var rect := Rect2(view.position * scale_value + offset, view.size * scale_value)
		draw_rect(rect, Color(1, 1, 1, 0.85), false, 1.5)
	draw_rect(Rect2(Vector2.ZERO, size), Color("fff6df"), false, 2.0)


func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		var mouse := event as InputEventMouseButton
		if mouse.button_index == MOUSE_BUTTON_LEFT:
			_dragging = mouse.pressed
			if mouse.pressed:
				focus_requested.emit(_from_mini(mouse.position))
			accept_event()
		elif mouse.button_index == MOUSE_BUTTON_RIGHT and mouse.pressed:
			command_requested.emit(_from_mini(mouse.position))
			accept_event()
	elif event is InputEventMouseMotion and _dragging:
		focus_requested.emit(_from_mini((event as InputEventMouseMotion).position))
		accept_event()
	elif event is InputEventScreenTouch:
		var touch := event as InputEventScreenTouch
		_dragging = touch.pressed
		if touch.pressed:
			focus_requested.emit(_from_mini(touch.position))
		accept_event()
	elif event is InputEventScreenDrag and _dragging:
		focus_requested.emit(_from_mini((event as InputEventScreenDrag).position))
		accept_event()
