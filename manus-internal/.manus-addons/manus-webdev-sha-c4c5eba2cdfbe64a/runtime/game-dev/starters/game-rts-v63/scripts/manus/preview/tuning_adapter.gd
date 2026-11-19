extends "res://scripts/manus/preview/tuning_transport.gd"

func store() -> Variant:
	var scene := get_tree().current_scene
	return scene.get("tweak_service") if scene != null else null

func settings() -> Array:
	return store().CATALOG.DESCRIPTORS

func requested(setting: Dictionary) -> Variant:
	return store().requested_value(StringName(setting.id))

func active(setting: Dictionary) -> Variant:
	return store().active_value(StringName(setting.id))

func commit(patch: Dictionary) -> bool:
	return store().apply_preview_patch(patch)

func translate(value: String) -> String:
	return str(preload("res://scripts/services/localization.gd").t(value)) if not value.is_empty() else ""

func control_for(setting: Dictionary) -> Dictionary:
	var localized := setting.duplicate(true)
	localized["category_key"] = "tweak.category." + str(setting.category).to_lower()
	if not str(setting.get("unit", "")).is_empty(): localized["unit_key"] = str(setting.unit)
	return super.control_for(localized)
