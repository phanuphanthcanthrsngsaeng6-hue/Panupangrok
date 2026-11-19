class_name TweakService
extends Node

signal values_changed
signal status_changed(status: StringName)
signal run_integrity_changed(eligible: bool, marker: String)

const CATALOG := preload("res://config/tweaks/catalog.gd")
const SCHEMA_VERSION := 1
const SAVE_PATH := "user://mandate_of_myth_tweaks.json"
const SAVE_DEBOUNCE_SECONDS := 0.4

var last_save_ok := true
var persistence_enabled := true
var save_status: StringName = &"saved"
var _save_remaining := -1.0
var _save_pending := false
var _save_path := SAVE_PATH
const PLAYER_SETTINGS := [&"audio.master.muted", &"ui.reduced_motion"]
var _player_values: Dictionary = {}
var _requested: Dictionary = {}
var _active: Dictionary = {}
var _run_active := false
var _run_tainted := false
var _run_tainted_ids: Dictionary = {}


func setup(custom_save_path: String = SAVE_PATH) -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	set_process(true)
	_save_remaining = -1.0
	_save_pending = false
	_save_path = custom_save_path
	var catalog_errors := CATALOG.validation_errors()
	assert(catalog_errors.is_empty(), "Invalid tweak catalog: %s" % "; ".join(catalog_errors))
	_requested = CATALOG.defaults()
	_active = CATALOG.defaults()
	_load_persisted_values()
	_activate_boundary(CATALOG.LIVE, false)
	_emit_state()


func requested_values() -> Dictionary:
	return _requested.duplicate(true)


func active_values() -> Dictionary:
	return _active.duplicate(true)


func requested_value(id: StringName) -> Variant:
	var descriptor := CATALOG.descriptor(id)
	return _requested.get(id, descriptor.get("default"))


func active_value(id: StringName) -> Variant:
	var descriptor := CATALOG.descriptor(id)
	return _active.get(id, descriptor.get("default"))


func set_requested(id: StringName, value: Variant) -> bool:
	var descriptor := CATALOG.descriptor(id)
	if descriptor.is_empty():
		return false
	var validation := _validated_value(descriptor, value)
	if not bool(validation.get("ok", false)):
		status_changed.emit(&"invalid")
		return false
	var normalized: Variant = validation["value"]
	if _same_value(_requested.get(id), normalized):
		return true
	_requested[id] = normalized
	if id in PLAYER_SETTINGS: _player_values[id] = normalized
	if descriptor["apply_mode"] == CATALOG.LIVE:
		_activate_descriptor(descriptor, true)
	_queue_save()
	_emit_state()
	return true


func reset_control(id: StringName) -> bool:
	var descriptor := CATALOG.descriptor(id)
	if descriptor.is_empty():
		return false
	return set_requested(id, descriptor["default"])


func reset_all() -> void:
	var changed := false
	for descriptor: Dictionary in CATALOG.DESCRIPTORS:
		var id := descriptor["id"] as StringName
		if not _same_value(_requested.get(id), descriptor["default"]):
			_requested[id] = descriptor["default"]
			if id in PLAYER_SETTINGS: _player_values[id] = descriptor["default"]
			changed = true
		if descriptor["apply_mode"] == CATALOG.LIVE:
			_activate_descriptor(descriptor, true)
	if not changed:
		return
	_queue_save()
	_emit_state()


func apply_boundary(mode: StringName) -> Array[StringName]:
	if mode not in CATALOG.APPLY_MODES:
		return []
	return _activate_boundary(mode, true)


func begin_run() -> void:
	_run_active = true
	_run_tainted = false
	_run_tainted_ids.clear()
	# A fresh match has no in-flight actions or units whose values must be retained.
	for mode: StringName in CATALOG.APPLY_MODES:
		if mode != CATALOG.LIVE:
			_activate_boundary(mode, true)
	for descriptor: Dictionary in CATALOG.DESCRIPTORS:
		var id := descriptor["id"] as StringName
		if (
			descriptor["integrity"] != CATALOG.COSMETIC
			and not _same_value(_active.get(id), descriptor["default"])
		):
			_taint(id)
	_emit_integrity()


func end_run() -> void:
	_run_active = false
	_run_tainted = false
	_run_tainted_ids.clear()
	_emit_integrity()


func run_is_rank_eligible() -> bool:
	return not _run_tainted


func is_run_active() -> bool:
	return _run_active


func run_configuration_marker() -> String:
	if not _run_tainted:
		return "baseline"
	var ids := PackedStringArray()
	for raw_id: Variant in _run_tainted_ids:
		ids.append(String(raw_id))
	ids.sort()
	return "tweaked:%s" % ",".join(ids)


func pending_count() -> int:
	var result := 0
	for descriptor: Dictionary in CATALOG.DESCRIPTORS:
		var id := descriptor["id"] as StringName
		if not _same_value(_requested.get(id), _active.get(id)):
			result += 1
	return result


func pending_for(mode: StringName) -> int:
	var result := 0
	for descriptor: Dictionary in CATALOG.DESCRIPTORS:
		if descriptor["apply_mode"] != mode:
			continue
		var id := descriptor["id"] as StringName
		if not _same_value(_requested.get(id), _active.get(id)):
			result += 1
	return result


func validated_persisted_deltas() -> Dictionary:
	var result := {}
	for descriptor: Dictionary in CATALOG.DESCRIPTORS:
		var id := descriptor["id"] as StringName
		var requested: Variant = _requested.get(id, descriptor["default"])
		if not _same_value(requested, descriptor["default"]):
			result[id] = requested
	return result


func _activate_boundary(mode: StringName, may_taint: bool) -> Array[StringName]:
	var applied: Array[StringName] = []
	for descriptor: Dictionary in CATALOG.DESCRIPTORS:
		if descriptor["apply_mode"] != mode:
			continue
		var id := descriptor["id"] as StringName
		if _same_value(_active.get(id), _requested.get(id)):
			continue
		_activate_descriptor(descriptor, may_taint)
		applied.append(id)
	if not applied.is_empty():
		_emit_state()
	return applied


func _activate_descriptor(descriptor: Dictionary, may_taint: bool) -> void:
	var id := descriptor["id"] as StringName
	_active[id] = _requested.get(id, descriptor["default"])
	if (
		may_taint
		and _run_active
		and descriptor["integrity"] != CATALOG.COSMETIC
		and not _same_value(_active[id], descriptor["default"])
	):
		_taint(id)


func _taint(id: StringName) -> void:
	if _run_tainted_ids.has(id):
		return
	_run_tainted = true
	_run_tainted_ids[id] = true
	_emit_integrity()


func _emit_integrity() -> void:
	run_integrity_changed.emit(run_is_rank_eligible(), run_configuration_marker())


func _emit_state() -> void:
	values_changed.emit()
	status_changed.emit(save_status)


func _validated_value(descriptor: Dictionary, raw_value: Variant) -> Dictionary:
	match descriptor["type"]:
		&"bool":
			if raw_value is bool:
				return {"ok": true, "value": raw_value}
		&"int":
			if (raw_value is int or raw_value is float) and is_finite(float(raw_value)):
				var value := int(round(float(raw_value)))
				if value >= int(descriptor["min"]) and value <= int(descriptor["max"]):
					return {"ok": true, "value": value}
		&"float":
			if raw_value is int or raw_value is float:
				var value := float(raw_value)
				if not is_finite(value) or value < float(descriptor["min"]) or value > float(descriptor["max"]):
					return {"ok": false}
				# Authored defaults may sit between slider steps (for example exact audio gain).
				if is_equal_approx(value, float(descriptor["default"])):
					return {"ok": true, "value": descriptor["default"]}
				var step := float(descriptor.get("step", 0.0))
				if step > 0.0:
					value = snappedf(value, step)
				value = clampf(value, float(descriptor["min"]), float(descriptor["max"]))
				return {"ok": true, "value": value}
		&"enum":
			var value := StringName(raw_value)
			if value in descriptor.get("options", []):
				return {"ok": true, "value": value}
	return {"ok": false}


func _same_value(left: Variant, right: Variant) -> bool:
	if (left is float or left is int) and (right is float or right is int):
		return is_equal_approx(float(left), float(right))
	return left == right


func _process(delta: float) -> void:
	if _save_remaining < 0.0:
		return
	_save_remaining -= maxf(delta, 0.0)
	if _save_remaining <= 0.0:
		flush_now()


func _exit_tree() -> void:
	if _save_pending:
		flush_now()


func _queue_save() -> void:
	_save_pending = persistence_enabled
	_save_remaining = SAVE_DEBOUNCE_SECONDS if persistence_enabled else -1.0
	save_status = &"saving" if persistence_enabled else &"session_only"


func flush_now() -> bool:
	_save_remaining = -1.0
	if not persistence_enabled:
		_save_pending = false
		save_status = &"session_only"
		status_changed.emit(save_status)
		return false
	last_save_ok = _save_persisted_values()
	_save_pending = not last_save_ok
	save_status = &"saved" if last_save_ok else &"not_saved"
	status_changed.emit(save_status)
	return last_save_ok


func _load_persisted_values() -> void:
	if not persistence_enabled:
		save_status = &"session_only"
		return
	var primary := _read_valid_draft(_save_path)
	if bool(primary.ok):
		last_save_ok = true
		_player_values = primary.values.duplicate()
		_requested.merge(primary.values, true)
		save_status = &"saved"
		return
	var backup := _read_valid_draft(_save_path + ".bak")
	if bool(backup.ok):
		last_save_ok = true
		_player_values = backup.values.duplicate()
		_requested.merge(backup.values, true)
		save_status = &"recovered"
		return
	last_save_ok = not FileAccess.file_exists(_save_path) and not FileAccess.file_exists(_save_path + ".bak")
	save_status = &"saved" if last_save_ok else &"not_saved"


func _read_valid_draft(path: String) -> Dictionary:
	var invalid := {"ok": false, "values": {}}
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return invalid
	var parser := JSON.new()
	if parser.parse(file.get_as_text()) != OK or not parser.data is Dictionary:
		return invalid
	var draft := parser.data as Dictionary
	if draft.get("schema_version") != SCHEMA_VERSION or not draft.get("values") is Dictionary:
		return invalid
	var checked := {}
	for raw_id: Variant in draft.values:
		var id := StringName(raw_id)
		if id not in PLAYER_SETTINGS: continue
		var descriptor := CATALOG.descriptor(id)
		if descriptor.is_empty():
			continue
		var raw_value: Variant = draft.values[raw_id]
		var validation := _validated_value(descriptor, raw_value)
		if not bool(validation.get("ok", false)):
			return invalid
		if descriptor["type"] == &"int" and float(raw_value) != float(validation.value):
			return invalid
		checked[id] = validation.value
	return {"ok": true, "values": checked}


func _save_persisted_values() -> bool:
	var temp_path := _save_path + ".tmp"
	var temp := FileAccess.open(temp_path, FileAccess.WRITE)
	if temp == null:
		return false
	temp.store_string(JSON.stringify({"schema_version": SCHEMA_VERSION, "values": _player_values}, "\t"))
	temp.flush()
	temp.close()
	if not bool(_read_valid_draft(temp_path).ok):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(temp_path))
		return false
	var target := ProjectSettings.globalize_path(_save_path)
	var backup := ProjectSettings.globalize_path(_save_path + ".bak")
	var temporary := ProjectSettings.globalize_path(temp_path)
	var primary_valid := bool(_read_valid_draft(_save_path).ok)
	if primary_valid:
		if FileAccess.file_exists(_save_path + ".bak") and DirAccess.remove_absolute(backup) != OK:
			return false
		if DirAccess.rename_absolute(target, backup) != OK:
			return false
	elif FileAccess.file_exists(_save_path) and DirAccess.remove_absolute(target) != OK:
		return false
	if DirAccess.rename_absolute(temporary, target) != OK:
		if primary_valid and not FileAccess.file_exists(_save_path):
			DirAccess.copy_absolute(backup, target)
		return false
	return true

func apply_preview_patch(patch: Dictionary) -> bool:
	var checked := {}
	for id: String in patch:
		var descriptor := CATALOG.descriptor(StringName(id))
		if descriptor.is_empty(): return false
		var result := _validated_value(descriptor,patch[id])
		if not result.get("ok",false): return false
		checked[StringName(id)] = result.value
	var changed: Array[StringName] = []
	for id: StringName in checked:
		if _same_value(_requested[id],checked[id]): continue
		_requested[id] = checked[id]
		changed.append(id)
		if CATALOG.descriptor(id).apply_mode == CATALOG.LIVE: _active[id] = checked[id]
	for id: StringName in changed:
		var descriptor := CATALOG.descriptor(id)
		if descriptor.apply_mode == CATALOG.LIVE: _activate_descriptor(descriptor,true)
	if not changed.is_empty(): _emit_state()
	return true
