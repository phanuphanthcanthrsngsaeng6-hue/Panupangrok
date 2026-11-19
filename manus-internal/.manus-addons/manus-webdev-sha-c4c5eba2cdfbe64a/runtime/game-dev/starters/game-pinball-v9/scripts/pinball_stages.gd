extends RefCounted
const Config = preload("res://scripts/template_config.gd")
var definitions: Array = []
var error := ""

func _init(path := "res://config/stages.json") -> void:
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
	if not parsed is Dictionary or parsed.get("version") != 1 or not parsed.get("stages") is Array:
		error = "stages.invalid"
		return
	var ids: Array = []
	for item in parsed.stages:
		if not item is Dictionary or not item.get("id") is String or item.id.is_empty() or item.id in ids:
			error = "stages.invalid"; return
		if not item.get("configuration") is String or not item.configuration.begins_with("res://config/") or ".." in item.configuration:
			error = "stages.invalid"; return
		if not item.get("title_key") is String or not (item.get("jackpots") is float or item.get("jackpots") is int) or item.jackpots < 1:
			error = "stages.invalid"; return
		if not (item.get("time_limit") is float or item.get("time_limit") is int) or item.time_limit < 60 or item.time_limit > 900:
			error = "stages.invalid"; return
		var data: Variant = JSON.parse_string(FileAccess.get_file_as_string(item.configuration))
		if not data is Dictionary or not Config.validate(data).is_empty() or data.missions.is_empty() or not data.multiball.enabled or not data.scoring.jackpot.enabled:
			error = "stages.invalid"; return
		definitions.append(item.duplicate(true))
		ids.append(item.id)
	if definitions.is_empty(): error = "stages.invalid"

func configuration(index: int) -> Dictionary:
	if not error.is_empty() or index < 0 or index >= definitions.size(): return {}
	return JSON.parse_string(FileAccess.get_file_as_string(definitions[index].configuration))
