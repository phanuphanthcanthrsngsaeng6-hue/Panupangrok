extends RefCounted
## One lookup contract for UI, data-owned mission copy and placeholders.
var dictionaries: Dictionary = {}

func _init() -> void:
	for locale in ["en", "zh_CN"]:
		var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string("res://localization/" + locale + ".json"))
		dictionaries[locale] = parsed if parsed is Dictionary else {}

func t(key: String, placeholders: Dictionary = {}, locale := "en") -> String:
	var text: String = str(dictionaries.get(locale, {}).get(key, dictionaries.en.get(key, key)))
	for name in placeholders:
		text = text.replace("{" + str(name) + "}", str(placeholders[name]))
	return text

func register_missions(missions: Array) -> void:
	for mission in missions:
		for field in ["title", "label", "short", "objective"]:
			var key: String = "mission." + mission.id + "." + field
			dictionaries.en[key] = mission[field].en
			dictionaries.zh_CN[key] = mission[field].cn

## First-launch language: Simplified Chinese for any zh* OS/browser locale, else English.
static func detect_zh(os_locale: String) -> bool:
	return os_locale.strip_edges().to_lower().begins_with("zh")

## A saved language choice always wins; otherwise follow the OS locale (on Web: the browser language).
static func resolve_zh(save: ConfigFile, loaded: bool, os_locale: String) -> bool:
	if loaded and save.has_section_key("settings", "zh"): return bool(save.get_value("settings", "zh"))
	return detect_zh(os_locale)
