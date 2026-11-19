extends Node
## Descriptor authority. Only active values may affect a run; requested deltas
## remain pending until their owner reaches the named application boundary.
signal value_changed(id: String, requested_value: Variant, active_value: Variant)

const SCHEMA_PATH := "res://config/tuning.json"
const APPLY_MODES := ["LIVE", "NEXT_ACTION", "NEXT_SPAWN", "NEXT_STAGE", "NEXT_RUN"]
const INTEGRITY_TYPES := ["COSMETIC", "GAMEPLAY", "SCORE_AFFECTING"]
const CATEGORIES := ["UI", "GAMEPLAY", "AUDIO", "PLAYER", "ENEMIES", "ENVIRONMENT"]
var schema_version := 0
var _settings: Array = []
var _settings_by_id: Dictionary = {}
var _defaults: Dictionary = {}
var _requested_values: Dictionary = {}
var _active_values: Dictionary = {}
var _run_active := false
var _ranked_eligible := true

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	if not _load_schema():
		push_error("TuningStore: invalid descriptor catalog")
		return
	_requested_values = _defaults.duplicate(true)
	_active_values = _defaults.duplicate(true)

func owner_preview_enabled() -> bool:
	return OS.is_debug_build() and not OS.has_feature("manus_checkpoint") and not OS.has_feature("manus_release")

func _load_schema() -> bool:
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(SCHEMA_PATH))
	if not parsed is Dictionary or int(parsed.get("version", 0)) <= 0:
		return false
	var raw_settings: Variant = parsed.get("settings")
	if not raw_settings is Array or raw_settings.is_empty():
		return false
	var by_id: Dictionary = {}
	var defaults: Dictionary = {}
	var settings: Array = []
	for raw: Variant in raw_settings:
		if not raw is Dictionary:
			return false
		var item: Dictionary = raw.duplicate(true)
		var id := str(item.get("id", ""))
		var kind := str(item.get("type", ""))
		if id.is_empty() or by_id.has(id) or kind not in ["float", "integer", "boolean", "enum"]:
			return false
		if item.get("category") not in CATEGORIES or item.get("apply_mode") not in APPLY_MODES or item.get("integrity") not in INTEGRITY_TYPES:
			return false
		for key: String in ["label_key", "description_key", "unit"]:
			if str(item.get(key, "")).is_empty():
				return false
		if kind == "boolean":
			if not item.get("default") is bool:
				return false
		elif kind == "enum":
			if not item.get("options") is Array or item.options.is_empty() or item.get("default") not in item.options:
				return false
		else:
			for key: String in ["default", "min", "max", "step"]:
				if not _is_number(item.get(key)) or not is_finite(float(item[key])):
					return false
			if item.min > item.max or item.step <= 0 or item.default < item.min or item.default > item.max:
				return false
			if kind == "integer" and (float(item.default) != floorf(float(item.default)) or float(item.step) != floorf(float(item.step))):
				return false
			item.default = int(item.default) if kind == "integer" else float(item.default)
		by_id[id] = item
		defaults[id] = item.default
		settings.append(item)
	for category: String in CATEGORIES:
		if settings.filter(func(item): return item.category == category).is_empty():
			return false
	schema_version = int(parsed.version)
	_settings = settings
	_settings_by_id = by_id
	_defaults = defaults
	return true

func get_settings() -> Array:
	return _settings.duplicate(true)

func get_categories() -> Array[String]:
	var result: Array[String] = []
	result.assign(CATEGORIES)
	return result

func get_setting(id: String) -> Dictionary:
	return (_settings_by_id.get(id, {}) as Dictionary).duplicate(true)

func get_value(id: String, fallback: Variant = null) -> Variant:
	return get_active_value(id, fallback)

func get_active_value(id: String, fallback: Variant = null) -> Variant:
	return _active_values.get(id, _defaults.get(id, fallback))

func get_requested_value(id: String, fallback: Variant = null) -> Variant:
	return _requested_values.get(id, _defaults.get(id, fallback))

func get_requested_values() -> Dictionary:
	return _requested_values.duplicate(true)

func set_value(id: String, value: Variant, _persist: bool = true) -> bool:
	return set_values({id: value}, false)


func set_values(values: Dictionary, _persist: bool = true) -> bool:
	if not owner_preview_enabled(): return false
	var candidate := _requested_values.duplicate(true)
	for id: Variant in values:
		if not id is String: return false
		var clean: Variant = _clean_value(id, values[id])
		if clean == null: return false
		candidate[id] = clean
	var changed: Array[String] = []
	for id: String in values:
		if _requested_values[id] == candidate[id]: continue
		changed.append(id)
		_requested_values[id] = candidate[id]
		if _settings_by_id[id].apply_mode == "LIVE":
			_active_values[id] = candidate[id]
			_mark_tuning_if_needed(id)
	for id: String in changed:
		value_changed.emit(id, _requested_values[id], get_active_value(id))
	return true


func reset_setting(id: String) -> bool:
	return set_value(id, _defaults[id]) if _defaults.has(id) else false

func reset_defaults() -> void:
	# Reset uses the same declared boundaries; it cannot undo an applied run taint.
	set_values(_defaults)

func apply_boundary(apply_mode: String) -> void:
	if apply_mode not in APPLY_MODES or apply_mode == "LIVE": return
	var changed: Array[String] = []
	for setting: Dictionary in _settings:
		if str(setting.apply_mode) != apply_mode: continue
		var id := str(setting.id)
		if _active_values[id] != _requested_values[id]:
			_active_values[id] = _requested_values[id]
			changed.append(id)
		_mark_tuning_if_needed(id)
	for id: String in changed: value_changed.emit(id, _requested_values[id], _active_values[id])

func begin_run(tutorial_run: bool = false) -> void:
	_run_active = true
	_ranked_eligible = not tutorial_run
	for boundary: String in ["NEXT_RUN", "NEXT_STAGE", "NEXT_SPAWN", "NEXT_ACTION"]:
		apply_boundary(boundary)
	for id: String in _active_values:
		_mark_tuning_if_needed(id)

func end_run() -> void:
	_run_active = false

func is_ranked_eligible() -> bool:
	return _ranked_eligible

func pending_count() -> int:
	var count := 0
	for id: String in _requested_values:
		if not _values_equal(_requested_values[id], _active_values[id]):
			count += 1
	return count

func configuration_marker() -> String:
	var parts: Array[String] = []
	for setting: Dictionary in _settings:
		if setting.integrity != "COSMETIC":
			parts.append("%s=%s" % [setting.id, str(get_active_value(setting.id))])
	parts.sort()
	return "pinball-v%d-%s" % [schema_version, "|".join(parts).sha256_text().left(10)]

func get_persisted_deltas() -> Dictionary:
	var deltas: Dictionary = {}
	for id: String in _requested_values:
		if not _values_equal(_requested_values[id], _defaults[id]):
			deltas[id] = _requested_values[id]
	return deltas

func configure_baseline(baseline: Dictionary) -> void:
	# Authored table variants are their own baseline; untouched controls must not
	# silently replace them with the original source game's defaults.
	for item: Dictionary in _settings:
		var id := str(item.id)
		var source: Variant = null
		if item.has("config_path"):
			source = baseline
			for part: String in str(item.config_path).split("."):
				source = source[part]
		elif id == "player.flipper.response":
			source = baseline.table.flippers.left.response
		if source == null:
			continue
		var old_default: Variant = _defaults[id]
		# Keep safe preview ranges fixed. apply_to_config preserves an authored
		# out-of-range baseline until the owner requests a non-default value.
		if _clean_value(id, source) == null:
			continue
		item.default = source
		_settings_by_id[id].default = source
		_defaults[id] = source
		if _values_equal(_requested_values[id], old_default):
			_requested_values[id] = source
		if _values_equal(_active_values[id], old_default):
			_active_values[id] = source

func apply_to_config(baseline: Dictionary) -> Dictionary:
	# Always derive from baseline, never from a previously scaled live configuration.
	var result := baseline.duplicate(true)
	for setting: Dictionary in _settings:
		if setting.has("config_path") and not _values_equal(get_active_value(setting.id), setting.default):
			var path: PackedStringArray = str(setting.config_path).split(".")
			var cursor: Dictionary = result
			for index in range(path.size() - 1):
				cursor = cursor[path[index]]
			cursor[path[-1]] = get_active_value(setting.id)
	if not _values_equal(get_active_value("player.flipper.response"), _defaults["player.flipper.response"]):
		for side: String in ["left", "right"]:
			result.table.flippers[side].response = get_active_value("player.flipper.response", 17.0)
	var kick_scale := float(get_active_value("enemies.bumper.kick_multiplier", 1.0))
	if not is_equal_approx(kick_scale, 1.0):
		for bumper: Dictionary in result.table.bumpers:
			bumper.kick *= kick_scale
	var score_scale := float(get_active_value("enemies.score.multiplier", 1.0))
	if not is_equal_approx(score_scale, 1.0):
		for group: String in ["bumpers", "banks", "slingshots"]:
			for target: Dictionary in result.table[group]:
				target.points = roundi(float(target.points) * score_scale)
	return result

func _clean_value(id: String, value: Variant) -> Variant:
	var item: Dictionary = _settings_by_id.get(id, {})
	if item.is_empty():
		return null
	if item.type == "boolean":
		return value if value is bool else null
	if item.type == "enum":
		return value if value in item.options else null
	if not _is_number(value) or not is_finite(float(value)):
		return null
	var numeric := float(value)
	if numeric < float(item.min) or numeric > float(item.max):
		return null
	if item.type == "integer" and numeric != floorf(numeric):
		return null
	# Normalize slider round-off to the descriptor's increment, without accepting
	# out-of-domain input or serializing unstable floating-point tails.
	var normalized := clampf(float(item.min) + snappedf(numeric - float(item.min), float(item.step)), float(item.min), float(item.max))
	return int(normalized) if item.type == "integer" else normalized

func _mark_tuning_if_needed(id: String) -> void:
	if _run_active and _settings_by_id[id].integrity != "COSMETIC" and not _values_equal(_active_values[id], _defaults[id]):
		_ranked_eligible = false

func _values_equal(a: Variant, b: Variant) -> bool:
	if _is_number(a) and _is_number(b):
		return is_equal_approx(float(a), float(b))
	return a == b

func _is_number(value: Variant) -> bool:
	return value is int or value is float
