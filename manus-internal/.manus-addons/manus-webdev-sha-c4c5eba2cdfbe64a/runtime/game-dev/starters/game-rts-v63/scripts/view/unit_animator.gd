class_name UnitAnimator
extends RefCounted
## Frame-texture cache for the generated unit animations (see UnitAnimData).
## Each frame is an AtlasTexture whose margin restores the shared animation cell,
## so every frame of a character shares one ground anchor and never jitters.

const AnimData := preload("res://scripts/data/unit_anim_data.gd")
const ATTACK_HOLD := 1.1

var _frames: Dictionary = {}


func has_kind(kind: StringName) -> bool:
	return AnimData.DATA.has(kind)


func info(kind: StringName) -> Dictionary:
	return AnimData.DATA[kind]


func cell_size(kind: StringName) -> Vector2:
	var cell: Array = AnimData.DATA[kind]["cell"]
	return Vector2(float(cell[0]), float(cell[1]))


func anchor(kind: StringName) -> Vector2:
	var value: Array = AnimData.DATA[kind]["anchor"]
	return Vector2(float(value[0]), float(value[1]))


func body_height(kind: StringName) -> float:
	return float(AnimData.DATA[kind]["body_height"])


func fps(kind: StringName, action: StringName) -> float:
	var table: Dictionary = AnimData.DATA[kind]["fps"]
	return float(table.get(String(action), 12.0))


func frames(kind: StringName, action: StringName) -> Array:
	if not _frames.has(kind):
		_build(kind)
	var per: Dictionary = _frames[kind]
	return per.get(action, per[&"idle"])


func frame_at(kind: StringName, action: StringName, time: float) -> Texture2D:
	var list := frames(kind, action)
	var index := int(floor(time * fps(kind, action))) % list.size()
	return list[index]


func clear() -> void:
	_frames.clear()


func _build(kind: StringName) -> void:
	var data: Dictionary = AnimData.DATA[kind]
	var atlas: Texture2D = load(String(data["texture"]))
	var cell := cell_size(kind)
	var per := {}
	var table: Dictionary = data["frames"]
	for action_name: String in table:
		var list: Array[Texture2D] = []
		for rect: Array in table[action_name]:
			var frame := AtlasTexture.new()
			frame.atlas = atlas
			frame.region = Rect2(float(rect[0]), float(rect[1]), float(rect[2]), float(rect[3]))
			frame.margin = Rect2(float(rect[4]), float(rect[5]), cell.x - float(rect[2]), cell.y - float(rect[3]))
			frame.filter_clip = true
			list.append(frame)
		per[StringName(action_name)] = list
	_frames[kind] = per
