extends RefCounted
## Apply already imported UI composite fonts (ui_*.tres) at scene startup. No early
## project.godot font load, implicit system fallback, or repeated font acquisition.

static func create_theme(regular: Font, medium: Font = null, bold: Font = null) -> Theme:
	assert(regular != null, "A bundled UI composite font is required")
	var theme := Theme.new()
	theme.default_font = regular
	if medium != null:
		for control_type in ["Button", "CheckButton", "CheckBox", "OptionButton", "MenuButton"]:
			theme.set_font("font", control_type, medium)
	if bold != null:
		theme.set_font("normal_font", "RichTextLabel", regular)
		theme.set_font("bold_font", "RichTextLabel", bold)
	return theme

static func apply_world_label(label: Label3D, font: Font) -> void:
	assert(font != null, "A bundled UI composite font is required")
	# Label3D does not inherit a sibling Control's Theme.
	label.font = font
