class_name HeroHud
extends Control
## Notebook-style battle HUD: stat cards, School Spirit + Hype meters, room sticky note,
## polaroid minimap, hero trading-card rail, command page, bulletins and HUD particle juice.
## Desktop and touch (mobile landscape) layouts share the same widgets.

signal command(name: StringName)
signal room_pressed(id: StringName, focus: bool)
signal card_pressed(kind: StringName, additive: bool, focus: bool)
signal ui_cue(cue: StringName)
signal coin_arrived

const T := preload("res://scripts/ui/hero_theme.gd")
const Catalog := preload("res://scripts/data/hero_catalog.gd")
const Loc := preload("res://scripts/services/localization.gd")

const ICON_REPUTATION := preload("res://assets/template/game/ui/icon_reputation.png")
const ICON_SQUAD := preload("res://assets/template/game/ui/icon_squad.png")
const ICON_WAVE := preload("res://assets/template/game/ui/icon_wave.png")
const ICON_BELL := preload("res://assets/template/game/ui/icon_bell.png")
const ICON_SPIRIT := preload("res://assets/template/game/ui/icon_spirit.png")
const ICON_CREST := preload("res://assets/template/game/ui/crest.png")
const ICON_HEART := preload("res://assets/template/game/fx/heart.png")
const ICON_STAR := preload("res://assets/template/game/fx/star.png")
const PORTRAITS := {
	&"monitor": preload("res://assets/template/game/portraits/portrait_monitor.png"),
	&"blaze": preload("res://assets/template/game/portraits/portrait_blaze.png"),
	&"frost": preload("res://assets/template/game/portraits/portrait_frost.png"),
	&"psi": preload("res://assets/template/game/portraits/portrait_psi.png"),
	&"stretch": preload("res://assets/template/game/portraits/portrait_stretch.png"),
	&"goon": preload("res://assets/template/game/portraits/portrait_goon.png"),
	&"blaster": preload("res://assets/template/game/portraits/portrait_blaster.png"),
	&"brute": preload("res://assets/template/game/portraits/portrait_brute.png"),
	&"mech": preload("res://assets/template/game/portraits/portrait_mech.png"),
	&"principal": preload("res://assets/template/game/portraits/portrait_principal.png"),
}
const HERO_TINT := {
	&"monitor": Color("f2b72c"), &"blaze": Color("ff7a2a"), &"frost": Color("6cc8ff"),
	&"psi": Color("b67bff"), &"stretch": Color("ffd23c"),
}
const ROOM_ORDER: Array[StringName] = [&"main_hall", &"gym", &"chem_lab", &"cafeteria", &"library"]
const OBJECTIVES: Array[StringName] = [&"select", &"move", &"rescue", &"secure", &"train", &"surge", &"wave"]
const CARD_SIZE := Vector2(124, 172)
const CARD_GAP := 8.0
const MAX_NOTICES := 3
const INK := Color("1c1320")
const INK_SOFT := Color("4a3b44")
const GREEN_INK := Color("2f7d2a")


## Circular cooldown / capture ring.
class Ring extends Control:
	var value := 0.0
	var color := Color("f2b72c")
	var back := Color(0, 0, 0, 0.18)
	var thickness := 5.0

	func _draw() -> void:
		var center := size * 0.5
		var radius := minf(size.x, size.y) * 0.5 - thickness * 0.5
		draw_arc(center, radius, 0.0, TAU, 40, back, thickness, true)
		if value > 0.001:
			draw_arc(center, radius, -PI * 0.5, -PI * 0.5 + TAU * clampf(value, 0.0, 1.0), 40, color, thickness, true)


## Rainbow Hype meter with shimmer sweep and a pulsing rim when full.
class HypeBar extends Control:
	var value := 0.0
	var shown := 0.0
	var surge := 0.0
	var time := 0.0
	var gradient_texture: GradientTexture1D

	func _init() -> void:
		var gradient := Gradient.new()
		gradient.offsets = PackedFloat32Array([0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
		gradient.colors = PackedColorArray([Color("ff4d6d"), Color("ff9f1c"), Color("ffe14d"), Color("5ee06e"), Color("4db8ff"), Color("b26bff")])
		gradient_texture = GradientTexture1D.new()
		gradient_texture.gradient = gradient
		gradient_texture.width = 256
		mouse_filter = Control.MOUSE_FILTER_IGNORE

	func _draw() -> void:
		var rect := Rect2(Vector2.ZERO, size)
		var back := StyleBoxFlat.new()
		back.bg_color = Color("2a1d26")
		back.set_corner_radius_all(int(size.y * 0.5))
		back.border_color = Color("1c1320")
		back.set_border_width_all(3)
		draw_style_box(back, rect)
		var inner := rect.grow(-4.0)
		var ratio := surge if surge > 0.0 else shown
		if ratio > 0.002:
			var fill := Rect2(inner.position, Vector2(inner.size.x * clampf(ratio, 0.0, 1.0), inner.size.y))
			draw_texture_rect(gradient_texture, fill, false)
			draw_rect(Rect2(fill.position, Vector2(fill.size.x, fill.size.y * 0.38)), Color(1, 1, 1, 0.3))
			var sweep_x := inner.position.x + inner.size.x * (fmod(time * 0.6, 1.4) - 0.2)
			if sweep_x < fill.end.x - 2.0:
				var start_x := maxf(sweep_x, fill.position.x)
				draw_rect(Rect2(Vector2(start_x, fill.position.y), Vector2(minf(18.0, fill.end.x - start_x), fill.size.y)), Color(1, 1, 1, 0.35))
		if value >= 1.0 and surge <= 0.0:
			var pulse := 0.5 + 0.5 * sin(time * 8.0)
			var glow := StyleBoxFlat.new()
			glow.bg_color = Color(0, 0, 0, 0)
			glow.border_color = Color(1.0, 0.95, 0.5, 0.5 + 0.5 * pulse)
			glow.set_border_width_all(3)
			glow.set_corner_radius_all(int(size.y * 0.5) + 3)
			draw_style_box(glow, rect.grow(3.0))


var sim: RtsSimulation
var battlefield: Battlefield
var touch_layout := false
var reduced_motion := false
var fx: FxLayer
var minimap: CampusMinimap
var objectives_done: Dictionary = {}

var _time := 0.0
var _wave_card: PanelContainer
var _wave_title: Label
var _wave_timer: Label
var _score_label: Label
var _bell_button: Button
var _stats: Dictionary = {}
var _spirit_panel: PanelContainer
var _spirit_bar: ProgressBar
var _spirit_label: Label
var _hype_row: HBoxContainer
var _hype_bar: HypeBar
var _hype_label: Label
var _top_buttons: HBoxContainer
var _mute_button: Button
var _objectives: PanelContainer
var _objective_list: VBoxContainer
var _objective_toggle: Button
var _rooms: PanelContainer
var _room_refs: Dictionary = {}
var _map_frame: PanelContainer
var _rail: Control
var _cards: Dictionary = {}
var _context: PanelContainer
var _context_box: VBoxContainer
var _context_refs: Dictionary = {}
var _commands: PanelContainer
var _command_grid: GridContainer
var _command_buttons: Dictionary = {}
var _surge_button: Button
var _center_stack: VBoxContainer
var _bulletin: PanelContainer
var _bulletin_title: Label
var _bulletin_row: HBoxContainer
var _bulletin_wave := -2
var _boss_panel: PanelContainer
var _boss_bar: ProgressBar
var _notice_box: VBoxContainer
var _banner: Label
var _banner_tween: Tween
var _vignette: TextureRect
var _vignette_color := Color(0, 0, 0, 0)
var _last_card_click: Dictionary = {}
var _surge_sparkle_timer := 0.0
var _prev_hype_full := false
var _blockers: Array[Control] = []


func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	_build_vignette()
	_build_top()
	_build_rooms()
	_build_objectives()
	_build_minimap()
	_build_rail()
	_build_context()
	_build_commands()
	_build_center_stack()
	fx = FxLayer.new()
	fx.name = "HudFx"
	fx.screen_space = true
	add_child(fx)
	fx.particle_arrived.connect(_on_particle_arrived)
	_banner = T.display("", 66, T.GOLD, 16)
	_banner.name = "Banner"
	_banner.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_banner.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_banner.modulate.a = 0.0
	_banner.z_index = 10
	add_child(_banner)
	resized.connect(_apply_layout)
	_apply_layout()


## Controls that should swallow battlefield clicks.
func blockers() -> Array[Control]:
	return _blockers


func command_button(id: StringName) -> Button:
	return _command_buttons.get(id) as Button


# ================================================================ helpers

func _juice(button: Button, big: bool = false) -> void:
	button.focus_mode = Control.FOCUS_NONE
	button.mouse_entered.connect(func() -> void:
		if not button.disabled:
			ui_cue.emit(&"ui_hover")
	)
	button.pressed.connect(func() -> void:
		_pulse(button, 1.12 if big else 1.07)
		if fx != null:
			fx.preset(&"ui_pop", _center_of(button), 1.3 if big else 0.8)
	)


## Converts a control's centre into this HUD's local (unscaled) coordinates.
func _center_of(control: Control) -> Vector2:
	var global_center := control.get_global_transform_with_canvas() * (control.size * 0.5)
	return get_global_transform_with_canvas().affine_inverse() * global_center


func _pulse(control: Control, amount: float = 1.12) -> void:
	if reduced_motion or control == null:
		return
	control.pivot_offset = control.size * 0.5
	var tween := control.create_tween()
	tween.tween_property(control, "scale", Vector2.ONE * amount, 0.07).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(control, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func _flat_button_styles(button: Button, hover: Color, pressed: Color) -> void:
	var clear := T.box(Color(0, 0, 0, 0), Color(0, 0, 0, 0), 0, 8, 0)
	button.add_theme_stylebox_override("normal", clear)
	button.add_theme_stylebox_override("focus", clear)
	button.add_theme_stylebox_override("disabled", clear)
	button.add_theme_stylebox_override("hover", T.box(hover, Color(0, 0, 0, 0), 0, 8, 0))
	button.add_theme_stylebox_override("pressed", T.box(pressed, Color(0, 0, 0, 0), 0, 8, 0))
	button.add_theme_stylebox_override("hover_pressed", T.box(pressed, Color(0, 0, 0, 0), 0, 8, 0))


# ================================================================ construction: top bar

func _build_vignette() -> void:
	_vignette = TextureRect.new()
	_vignette.name = "Vignette"
	var gradient := Gradient.new()
	gradient.offsets = PackedFloat32Array([0.0, 0.62, 1.0])
	gradient.colors = PackedColorArray([Color(1, 1, 1, 0), Color(1, 1, 1, 0), Color(1, 1, 1, 1)])
	var texture := GradientTexture2D.new()
	texture.gradient = gradient
	texture.fill = GradientTexture2D.FILL_RADIAL
	texture.fill_from = Vector2(0.5, 0.5)
	texture.fill_to = Vector2(1.05, 1.05)
	texture.width = 256
	texture.height = 256
	_vignette.texture = texture
	_vignette.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	_vignette.stretch_mode = TextureRect.STRETCH_SCALE
	_vignette.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_vignette.modulate = Color(1, 1, 1, 0)
	add_child(_vignette)


func _stat(key: String, icon_texture: Texture2D, title_key: StringName, tooltip_key: StringName) -> void:
	var panel := T.paper(Vector2(12, 4))
	panel.name = "Stat_%s" % key
	panel.tooltip_text = Loc.t(tooltip_key)
	panel.mouse_filter = Control.MOUSE_FILTER_PASS
	add_child(panel)
	_blockers.append(panel)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 6)
	row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.add_child(row)
	var icon := T.icon(icon_texture, 38)
	row.add_child(icon)
	var texts := VBoxContainer.new()
	texts.add_theme_constant_override("separation", -5)
	texts.alignment = BoxContainer.ALIGNMENT_CENTER
	texts.mouse_filter = Control.MOUSE_FILTER_IGNORE
	row.add_child(texts)
	texts.add_child(T.ink(Loc.t(title_key), 12, T.MAROON, "black"))
	var value := T.label("0", 25, INK, "display")
	texts.add_child(value)
	var sub := T.ink("", 10, INK_SOFT, "bold")
	texts.add_child(sub)
	_stats[key] = {"panel": panel, "value": value, "sub": sub, "icon": icon, "shown": 0.0, "target": 0.0}


func _build_top() -> void:
	_wave_card = T.sticky(Vector2(16, 10))
	_wave_card.name = "WaveCard"
	add_child(_wave_card)
	_blockers.append(_wave_card)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 1)
	_wave_card.add_child(box)
	var head := HBoxContainer.new()
	head.add_theme_constant_override("separation", 6)
	box.add_child(head)
	head.add_child(T.icon(ICON_WAVE, 30))
	_wave_title = T.label("", 25, T.MAROON, "display")
	head.add_child(_wave_title)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 6)
	box.add_child(row)
	_wave_timer = T.ink("", 13, INK, "black")
	_wave_timer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(_wave_timer)
	_score_label = T.ink("", 12, T.MAROON, "black")
	row.add_child(_score_label)
	_bell_button = T.button("", Loc.t(&"hud.bell_tooltip"), T.GOLD, 13)
	_bell_button.icon = ICON_BELL
	_bell_button.expand_icon = true
	_bell_button.add_theme_constant_override("icon_max_width", 22)
	_bell_button.custom_minimum_size = Vector2(0, 40)
	_bell_button.pressed.connect(func() -> void: command.emit(&"bell"))
	_juice(_bell_button)
	box.add_child(_bell_button)
	_stat("rep", ICON_REPUTATION, &"hud.rep", &"hud.rep_tooltip")
	_stat("squad", ICON_SQUAD, &"hud.squad", &"hud.squad_tooltip")
	_stat("rooms", ICON_CREST, &"hud.rooms", &"hud.rooms_tooltip")
	_spirit_panel = T.paper(Vector2(14, 6))
	_spirit_panel.name = "Spirit"
	_spirit_panel.tooltip_text = Loc.t(&"hud.hall_tooltip")
	_spirit_panel.mouse_filter = Control.MOUSE_FILTER_PASS
	add_child(_spirit_panel)
	_blockers.append(_spirit_panel)
	var spirit_row := HBoxContainer.new()
	spirit_row.add_theme_constant_override("separation", 8)
	spirit_row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_spirit_panel.add_child(spirit_row)
	var spirit_box := VBoxContainer.new()
	spirit_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	spirit_box.alignment = BoxContainer.ALIGNMENT_CENTER
	spirit_box.add_theme_constant_override("separation", 2)
	spirit_box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	spirit_row.add_child(spirit_box)
	var spirit_head := HBoxContainer.new()
	spirit_head.add_theme_constant_override("separation", 5)
	spirit_head.mouse_filter = Control.MOUSE_FILTER_IGNORE
	spirit_box.add_child(spirit_head)
	spirit_head.add_child(T.icon(ICON_HEART, 22))
	var spirit_title := T.ink(Loc.t(&"hud.spirit"), 15, T.MAROON, "black")
	spirit_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	spirit_head.add_child(spirit_title)
	_spirit_label = T.ink("", 13, INK, "black")
	spirit_head.add_child(_spirit_label)
	_spirit_bar = T.bar(Color("58c94f"), 16)
	spirit_box.add_child(_spirit_bar)
	spirit_row.add_child(T.icon(ICON_CREST, 44))
	_hype_row = HBoxContainer.new()
	_hype_row.name = "Hype"
	_hype_row.add_theme_constant_override("separation", 6)
	_hype_row.mouse_filter = Control.MOUSE_FILTER_PASS
	_hype_row.tooltip_text = Loc.t(&"hud.hype_tooltip")
	spirit_box.add_child(_hype_row)
	_hype_label = T.display(Loc.t(&"hud.hype"), 20, T.GOLD, 6)
	_hype_row.add_child(_hype_label)
	_hype_bar = HypeBar.new()
	_hype_bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_hype_bar.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	_hype_bar.custom_minimum_size = Vector2(0, 22)
	_hype_row.add_child(_hype_bar)
	_top_buttons = HBoxContainer.new()
	_top_buttons.name = "TopButtons"
	_top_buttons.alignment = BoxContainer.ALIGNMENT_END
	_top_buttons.add_theme_constant_override("separation", 4)
	add_child(_top_buttons)
	_blockers.append(_top_buttons)
	_mute_button = T.button(Loc.t(&"hud.sound_on"), Loc.t(&"hud.mute_tooltip"), T.PAPER, 13)
	_mute_button.custom_minimum_size = Vector2(0, 42)
	_mute_button.pressed.connect(func() -> void: command.emit(&"mute"))
	_juice(_mute_button)
	_top_buttons.add_child(_mute_button)
	var help := T.button("?", Loc.t(&"hud.help_tooltip"), T.PAPER, 17)
	help.custom_minimum_size = Vector2(48, 42)
	help.pressed.connect(func() -> void: command.emit(&"help"))
	_juice(help)
	_top_buttons.add_child(help)
	var pause := T.button("II", Loc.t(&"hud.pause_tooltip"), T.MAROON, 17)
	pause.custom_minimum_size = Vector2(52, 42)
	pause.pressed.connect(func() -> void: command.emit(&"pause"))
	_juice(pause)
	_top_buttons.add_child(pause)
	_command_buttons[&"pause"] = pause


# ================================================================ construction: side panels

func _build_rooms() -> void:
	_rooms = T.sticky(Vector2(14, 12))
	_rooms.name = "RoomRoster"
	add_child(_rooms)
	_blockers.append(_rooms)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 0)
	_rooms.add_child(box)
	box.add_child(T.label(Loc.t(&"hud.rooms_heading"), 20, T.MAROON, "display"))
	for id: StringName in ROOM_ORDER:
		var button := Button.new()
		button.name = "Room_%s" % id
		button.custom_minimum_size = Vector2(0, 40)
		button.tooltip_text = Loc.t(StringName("room.%s.blurb" % id))
		_flat_button_styles(button, Color(1, 1, 1, 0.35), Color(1, 0.85, 0.3, 0.5))
		var content := HBoxContainer.new()
		content.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		content.offset_left = 2
		content.offset_right = -2
		content.add_theme_constant_override("separation", 6)
		content.mouse_filter = Control.MOUSE_FILTER_IGNORE
		button.add_child(content)
		var hero_kind: StringName = Catalog.ROOMS[id]["trains"]
		content.add_child(T.icon(Battlefield.UNIT_TEXTURES[hero_kind], 32))
		var texts := VBoxContainer.new()
		texts.alignment = BoxContainer.ALIGNMENT_CENTER
		texts.add_theme_constant_override("separation", -4)
		texts.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		texts.mouse_filter = Control.MOUSE_FILTER_IGNORE
		content.add_child(texts)
		texts.add_child(T.ink(Loc.t(StringName("room.%s" % id)), 14, INK, "black"))
		var status := T.ink("", 11, INK_SOFT, "bold")
		texts.add_child(status)
		var count := T.ink("", 13, T.MAROON, "black")
		content.add_child(count)
		var ring := Ring.new()
		ring.custom_minimum_size = Vector2(26, 26)
		ring.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		ring.mouse_filter = Control.MOUSE_FILTER_IGNORE
		content.add_child(ring)
		button.pressed.connect(func() -> void:
			var again := battlefield != null and battlefield.selected_building == id
			room_pressed.emit(id, again)
		)
		_juice(button)
		box.add_child(button)
		_room_refs[id] = {"button": button, "status": status, "count": count, "ring": ring, "selected": false}


func _build_objectives() -> void:
	_objectives = T.sticky(Vector2(14, 12))
	_objectives.name = "Objectives"
	add_child(_objectives)
	_blockers.append(_objectives)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 2)
	_objectives.add_child(box)
	var header := HBoxContainer.new()
	box.add_child(header)
	var title := T.label(Loc.t(&"obj.heading"), 20, T.MAROON, "display")
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(title)
	var hide := T.button(Loc.t(&"obj.hide"), Loc.t(&"obj.hide_tooltip"), T.PAPER, 11)
	hide.custom_minimum_size = Vector2(0, 30)
	hide.pressed.connect(func() -> void:
		_objective_list.visible = not _objective_list.visible
		hide.text = Loc.t(&"obj.hide") if _objective_list.visible else Loc.t(&"obj.show")
	)
	_juice(hide)
	header.add_child(hide)
	_objective_list = VBoxContainer.new()
	_objective_list.add_theme_constant_override("separation", 2)
	box.add_child(_objective_list)
	_objective_toggle = T.button(Loc.t(&"hud.objectives"), "", T.PAPER, 15)
	_objective_toggle.name = "ObjectivesToggle"
	_objective_toggle.custom_minimum_size = Vector2(0, 56)
	_objective_toggle.pressed.connect(func() -> void: _objectives.visible = not _objectives.visible)
	_juice(_objective_toggle)
	add_child(_objective_toggle)
	_blockers.append(_objective_toggle)


func _build_minimap() -> void:
	_map_frame = PanelContainer.new()
	_map_frame.name = "Polaroid"
	var style := T.box(T.PAPER, Color("cbbd9f"), 2, 4, 6)
	style.content_margin_left = 8
	style.content_margin_right = 8
	style.content_margin_top = 8
	style.content_margin_bottom = 2
	_map_frame.add_theme_stylebox_override("panel", style)
	add_child(_map_frame)
	_blockers.append(_map_frame)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 0)
	_map_frame.add_child(box)
	minimap = CampusMinimap.new()
	minimap.name = "Minimap"
	minimap.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(minimap)
	var caption := T.ink(Loc.t(&"hud.map_caption"), 13, T.MAROON, "black")
	caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(caption)


# ================================================================ construction: hero cards

func _build_rail() -> void:
	_rail = Control.new()
	_rail.name = "HeroCards"
	_rail.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_rail)
	var index := 0
	for kind: StringName in Catalog.HERO_ORDER:
		_cards[kind] = _make_card(kind, index)
		index += 1
	_rail.size = Vector2(float(Catalog.HERO_ORDER.size()) * (CARD_SIZE.x + CARD_GAP) - CARD_GAP, CARD_SIZE.y)


func _card_label(root: Control, text: String, size_value: int, color: Color, font_key: String, position_value: Vector2, box_size: Vector2) -> Label:
	var label := T.ink(text, size_value, color, font_key)
	label.position = position_value
	label.size = box_size
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	root.add_child(label)
	return label


func _make_card(kind: StringName, index: int) -> Dictionary:
	var root := Button.new()
	root.name = "Card_%s" % kind
	root.size = CARD_SIZE
	root.position = Vector2(float(index) * (CARD_SIZE.x + CARD_GAP), 0.0)
	root.tooltip_text = "%s — %s\n%s" % [Loc.t(StringName("hero.%s" % kind)), Loc.t(StringName("hero.%s.role" % kind)), Loc.t(StringName("power.%s.desc" % kind))]
	_flat_button_styles(root, Color(0, 0, 0, 0), Color(0, 0, 0, 0))
	_rail.add_child(root)
	_blockers.append(root)
	var glow := Panel.new()
	glow.add_theme_stylebox_override("panel", T.box(Color(1, 0.9, 0.4, 0.25), T.GOLD, 5, 16, 0))
	glow.position = Vector2(-5, -5)
	glow.size = CARD_SIZE + Vector2(10, 10)
	glow.mouse_filter = Control.MOUSE_FILTER_IGNORE
	glow.visible = false
	root.add_child(glow)
	var frame := NinePatchRect.new()
	frame.texture = T.TEX_CARD
	frame.patch_margin_left = 18
	frame.patch_margin_right = 18
	frame.patch_margin_top = 18
	frame.patch_margin_bottom = 18
	frame.size = CARD_SIZE
	frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(frame)
	var tint := ColorRect.new()
	tint.color = Color(HERO_TINT.get(kind, T.GOLD), 0.55)
	tint.position = Vector2(10, 10)
	tint.size = Vector2(CARD_SIZE.x - 20, 84)
	tint.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(tint)
	var portrait := TextureRect.new()
	portrait.texture = PORTRAITS[kind]
	portrait.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	portrait.position = tint.position
	portrait.size = tint.size
	portrait.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(portrait)
	var badge := Panel.new()
	badge.add_theme_stylebox_override("panel", T.box(T.GOLD, INK, 2, 14, 0))
	badge.position = Vector2(3, 3)
	badge.size = Vector2(28, 28)
	badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(badge)
	var level_label := _card_label(badge, "1", 18, INK, "display", Vector2.ZERO, badge.size)
	var count_badge := Panel.new()
	count_badge.add_theme_stylebox_override("panel", T.box(T.MAROON, T.PAPER, 2, 10, 0))
	count_badge.position = Vector2(CARD_SIZE.x - 38, 5)
	count_badge.size = Vector2(34, 24)
	count_badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(count_badge)
	var count_label := _card_label(count_badge, "x0", 14, T.PAPER, "black", Vector2.ZERO, count_badge.size)
	var name_label := _card_label(root, Loc.t(StringName("hero.%s" % kind)), 15, INK, "black", Vector2(8, 97), Vector2(CARD_SIZE.x - 16, 20))
	name_label.clip_text = true
	var stars: Array[TextureRect] = []
	for star_index in 3:
		var star := TextureRect.new()
		star.texture = ICON_STAR
		star.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		star.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		star.size = Vector2(15, 15)
		star.position = Vector2(CARD_SIZE.x * 0.5 - 24.0 + float(star_index) * 16.0, 116)
		star.mouse_filter = Control.MOUSE_FILTER_IGNORE
		root.add_child(star)
		stars.append(star)
	var power_label := T.ink(Loc.t(StringName("power.%s" % kind)), 11, INK_SOFT, "black")
	power_label.position = Vector2(10, 131)
	power_label.size = Vector2(CARD_SIZE.x - 54, 32)
	power_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	power_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	root.add_child(power_label)
	var ring := Ring.new()
	ring.color = HERO_TINT.get(kind, T.GOLD)
	ring.position = Vector2(CARD_SIZE.x - 44, 130)
	ring.size = Vector2(34, 34)
	ring.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(ring)
	var cd_label := _card_label(root, "", 12, INK, "black", ring.position, ring.size)
	var ready := T.display(Loc.t(&"card.ready"), 22, T.GOLD, 8)
	ready.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	ready.position = Vector2(0, CARD_SIZE.y - 28)
	ready.size = Vector2(CARD_SIZE.x, 30)
	ready.visible = false
	root.add_child(ready)
	var hint := _card_label(root, "", 11, T.MAROON, "black", Vector2(8, 126), Vector2(CARD_SIZE.x - 16, 40))
	hint.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	root.pressed.connect(func() -> void:
		var now := Time.get_ticks_msec()
		var last := int(_last_card_click.get(kind, 0))
		_last_card_click[kind] = now
		card_pressed.emit(kind, Input.is_key_pressed(KEY_SHIFT), now - last < 380)
	)
	_juice(root)
	return {
		"root": root, "glow": glow, "portrait": portrait, "tint": tint, "badge": badge, "level": level_label,
		"count_badge": count_badge, "count": count_label, "stars": stars, "power": power_label, "ring": ring,
		"cd": cd_label, "ready": ready, "hint": hint, "was_ready": false, "lift": 0.0, "level_value": 1,
	}


# ================================================================ construction: context, commands, centre

func _build_context() -> void:
	_context = T.paper(Vector2(18, 10))
	_context.name = "Context"
	add_child(_context)
	_blockers.append(_context)
	_context_box = VBoxContainer.new()
	_context_box.add_theme_constant_override("separation", 3)
	_context.add_child(_context_box)


func _build_commands() -> void:
	_commands = T.paper(Vector2(14, 12))
	_commands.name = "CommandPage"
	add_child(_commands)
	_blockers.append(_commands)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	_commands.add_child(box)
	_command_grid = GridContainer.new()
	_command_grid.columns = 2
	_command_grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_command_grid.add_theme_constant_override("h_separation", 6)
	_command_grid.add_theme_constant_override("v_separation", 6)
	box.add_child(_command_grid)
	var specs := [
		[&"all", "cmd.all", "cmd.all_tooltip", T.PAPER],
		[&"power", "cmd.power", "cmd.power_tooltip", T.GOLD],
		[&"attack", "cmd.attack", "cmd.attack_tooltip", T.PAPER],
		[&"stop", "cmd.stop", "cmd.stop_tooltip", T.PAPER],
		[&"rally", "cmd.rally", "cmd.rally_tooltip", T.MAROON],
		[&"train", "cmd.train", "cmd.train_tooltip", T.PAPER],
	]
	for spec: Array in specs:
		var id: StringName = spec[0]
		var button := T.button(Loc.t(StringName(spec[1])), Loc.t(StringName(spec[2])), spec[3], 13)
		button.name = "Cmd_%s" % id
		button.custom_minimum_size = Vector2(124, 46)
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		button.pressed.connect(func() -> void: command.emit(id))
		_juice(button)
		_command_grid.add_child(button)
		_command_buttons[id] = button
	_surge_button = T.button(Loc.t(&"cmd.surge"), Loc.t(&"cmd.surge_tooltip"), T.GOLD, 20)
	_surge_button.name = "Cmd_surge"
	_surge_button.icon = ICON_SPIRIT
	_surge_button.expand_icon = true
	_surge_button.add_theme_constant_override("icon_max_width", 30)
	_surge_button.add_theme_font_override("font", T.fonts()["display"])
	_surge_button.custom_minimum_size = Vector2(0, 56)
	_surge_button.pressed.connect(func() -> void: command.emit(&"surge"))
	_juice(_surge_button, true)
	box.add_child(_surge_button)
	_command_buttons[&"surge"] = _surge_button


func _build_center_stack() -> void:
	_center_stack = VBoxContainer.new()
	_center_stack.name = "CenterStack"
	_center_stack.add_theme_constant_override("separation", 6)
	_center_stack.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_center_stack)
	_boss_panel = T.paper(Vector2(14, 6))
	_boss_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_boss_panel.visible = false
	_center_stack.add_child(_boss_panel)
	var boss_row := HBoxContainer.new()
	boss_row.add_theme_constant_override("separation", 8)
	_boss_panel.add_child(boss_row)
	boss_row.add_child(T.icon(PORTRAITS[&"mech"], 44))
	var boss_box := VBoxContainer.new()
	boss_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	boss_box.alignment = BoxContainer.ALIGNMENT_CENTER
	boss_row.add_child(boss_box)
	boss_box.add_child(T.label(Loc.t(&"hud.boss"), 20, T.RED, "display"))
	_boss_bar = T.bar(T.RED, 14)
	boss_box.add_child(_boss_bar)
	_bulletin = T.paper(Vector2(14, 8))
	_bulletin.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_bulletin.visible = false
	_center_stack.add_child(_bulletin)
	var bulletin_row := HBoxContainer.new()
	bulletin_row.add_theme_constant_override("separation", 10)
	_bulletin.add_child(bulletin_row)
	bulletin_row.add_child(T.icon(PORTRAITS[&"principal"], 50))
	var bulletin_box := VBoxContainer.new()
	bulletin_box.add_theme_constant_override("separation", 0)
	bulletin_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bulletin_row.add_child(bulletin_box)
	_bulletin_title = T.label("", 20, T.MAROON, "display")
	bulletin_box.add_child(_bulletin_title)
	_bulletin_row = HBoxContainer.new()
	_bulletin_row.add_theme_constant_override("separation", 8)
	bulletin_box.add_child(_bulletin_row)
	_notice_box = VBoxContainer.new()
	_notice_box.add_theme_constant_override("separation", 4)
	_notice_box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_center_stack.add_child(_notice_box)


# ================================================================ layout

func set_touch_layout(on: bool) -> void:
	if on and not touch_layout and _objectives != null:
		_objectives.visible = false
	touch_layout = on
	_apply_layout()
	rebuild_context()


func _place(control: Control, position_value: Vector2, width: float, height: float = 0.0) -> void:
	control.position = position_value
	control.custom_minimum_size = Vector2(width, height)
	control.size = Vector2(width, height)
	control.reset_size()


func _apply_layout() -> void:
	if _wave_card == null:
		return
	var w := size.x
	var h := size.y
	if w <= 1.0 or h <= 1.0:
		return
	_vignette.position = Vector2.ZERO
	_vignette.size = size
	var touch := touch_layout
	var top_y := 8.0
	var stat_w := 128.0 if touch else 146.0
	var wave_w := 226.0 if touch else 244.0
	_place(_wave_card, Vector2(8, top_y), wave_w)
	_score_label.visible = not touch
	var x := 8.0 + wave_w + 8.0
	for key: String in ["rep", "squad", "rooms"]:
		var panel: PanelContainer = _stats[key]["panel"]
		panel.visible = not (touch and key == "rooms")
		if panel.visible:
			_place(panel, Vector2(x, top_y), stat_w, 66)
			x += stat_w + 6.0
	var right_reserved := 196.0
	var spirit_w := maxf(220.0, w - x - right_reserved - 8.0)
	_place(_spirit_panel, Vector2(x, top_y), spirit_w)
	_top_buttons.position = Vector2(w - right_reserved, top_y + 6.0)
	_top_buttons.size = Vector2(right_reserved - 8.0, 42)
	var center_w := minf(520.0, w * 0.4)
	_center_stack.position = Vector2((w - center_w) * 0.5, top_y + 100.0)
	_center_stack.size = Vector2(center_w, 0)
	_banner.position = Vector2(0, h * 0.3)
	_banner.size = Vector2(w, 110)
	var command_ids: Array[StringName] = [&"all", &"power", &"attack", &"stop", &"rally", &"train"]
	if touch:
		_rooms.visible = false
		_place(_map_frame, Vector2(10, 116), 210, 172)
		_map_frame.rotation = -0.025
		_objective_toggle.visible = true
		_place(_objective_toggle, Vector2(10, 300), 170, 56)
		_place(_objectives, Vector2(10, 362), 250)
		var column_w := 196.0
		_command_grid.columns = 1
		for id: StringName in command_ids:
			var button: Button = _command_buttons[id]
			button.custom_minimum_size = Vector2(0, 62)
			button.add_theme_font_size_override("font_size", 18)
			button.visible = id != &"stop" and id != &"train"
		_surge_button.custom_minimum_size = Vector2(0, 80)
		_surge_button.add_theme_font_size_override("font_size", 22)
		_place(_commands, Vector2(w - column_w - 8.0, 0), column_w)
		_commands.position.y = h - _commands.size.y - 8.0
		var rail_scale := 1.12
		var left := 228.0
		var right := w - column_w - 16.0
		var available := right - left
		rail_scale = minf(rail_scale, available / _rail.size.x)
		_rail.scale = Vector2.ONE * rail_scale
		_rail.position = Vector2(left + (available - _rail.size.x * rail_scale) * 0.5, h - CARD_SIZE.y * rail_scale - 6.0)
		var context_w := minf(520.0, available)
		_place(_context, Vector2(left + (available - context_w) * 0.5, 0), context_w)
		_context.position.y = _rail.position.y - _context.size.y - 16.0
	else:
		_rooms.visible = true
		_place(_rooms, Vector2(8, top_y + 150.0), 236)
		_objective_toggle.visible = false
		_objectives.visible = true
		_place(_objectives, Vector2(w - 262.0, top_y + 100.0), 254)
		_place(_map_frame, Vector2(10, h - 196.0), 236, 188)
		_map_frame.rotation = -0.03
		_command_grid.columns = 2
		for id: StringName in command_ids:
			var button: Button = _command_buttons[id]
			button.custom_minimum_size = Vector2(124, 46)
			button.add_theme_font_size_override("font_size", 13)
			button.visible = true
		_surge_button.custom_minimum_size = Vector2(0, 56)
		_surge_button.add_theme_font_size_override("font_size", 20)
		var commands_w := 284.0
		_place(_commands, Vector2(w - commands_w - 8.0, 0), commands_w)
		_commands.position.y = h - _commands.size.y - 8.0
		var left2 := 256.0
		var right2 := w - commands_w - 16.0
		var available2 := right2 - left2
		var rail_scale2 := minf(1.0, available2 / _rail.size.x)
		_rail.scale = Vector2.ONE * rail_scale2
		_rail.position = Vector2(left2 + (available2 - _rail.size.x * rail_scale2) * 0.5, h - CARD_SIZE.y * rail_scale2 - 6.0)
		var context_w2 := minf(560.0, available2)
		_place(_context, Vector2(left2 + (available2 - context_w2) * 0.5, 0), context_w2)
		_context.position.y = _rail.position.y - _context.size.y - 16.0
	if fx != null:
		fx.density = 0.65 if touch else 1.0


func set_opacity(alpha: float) -> void:
	for control: Control in [_wave_card, _spirit_panel, _hype_row, _rooms, _objectives, _map_frame, _context, _commands, _top_buttons, _rail, _objective_toggle]:
		control.modulate.a = alpha
	for key: String in _stats:
		(_stats[key]["panel"] as Control).modulate.a = alpha


# ================================================================ per-frame juice

func _process(delta: float) -> void:
	_time += delta
	if sim == null or not visible:
		return
	var rep: Dictionary = _stats["rep"]
	var shown := float(rep["shown"])
	var target := float(rep["target"])
	if absf(shown - target) > 0.01:
		shown = lerpf(shown, target, clampf(delta * 8.0, 0.0, 1.0))
		if absf(shown - target) < 0.6:
			shown = target
		rep["shown"] = shown
		(rep["value"] as Label).text = str(int(round(shown)))
	_hype_bar.time = _time
	_hype_bar.value = sim.hype / RtsSimulation.HYPE_MAX
	_hype_bar.shown = lerpf(_hype_bar.shown, _hype_bar.value, clampf(delta * 6.0, 0.0, 1.0))
	_hype_bar.surge = sim.surge_timer / RtsSimulation.SURGE_DURATION if sim.surge_timer > 0.0 else 0.0
	_hype_bar.queue_redraw()
	var hype_full := sim.hype >= RtsSimulation.HYPE_MAX and sim.surge_timer <= 0.0
	if hype_full and not _prev_hype_full:
		_pulse(_hype_row, 1.08)
		_pulse(_surge_button, 1.18)
		fx.preset(&"ui_pop", _center_of(_hype_bar), 1.6)
	_prev_hype_full = hype_full
	_hype_label.pivot_offset = _hype_label.size * 0.5
	_hype_label.scale = Vector2.ONE * (1.0 + 0.07 * sin(_time * 8.0)) if hype_full and not reduced_motion else Vector2.ONE
	if hype_full or sim.surge_timer > 0.0:
		_surge_sparkle_timer -= delta
		if _surge_sparkle_timer <= 0.0:
			_surge_sparkle_timer = 0.16
			var center := _center_of(_surge_button)
			var half := _surge_button.size * 0.5
			fx.preset(&"ui_sparkle", center + Vector2(randf_range(-half.x, half.x), randf_range(-half.y, half.y)), 0.9)
		_surge_button.modulate = Color.WHITE.lerp(Color(1.35, 1.22, 0.8), 0.5 + 0.5 * sin(_time * 7.0))
	else:
		_surge_button.modulate = Color.WHITE
	for kind: StringName in _cards:
		var card: Dictionary = _cards[kind]
		var ready_label: Label = card["ready"]
		if ready_label.visible and not reduced_motion:
			ready_label.pivot_offset = ready_label.size * 0.5
			ready_label.scale = Vector2.ONE * (1.0 + 0.07 * sin(_time * 7.0 + float(Catalog.HERO_ORDER.find(kind))))
		var root: Button = card["root"]
		var target_lift := -12.0 if (card["glow"] as Panel).visible else 0.0
		if root.is_hovered():
			target_lift -= 4.0
		card["lift"] = lerpf(float(card["lift"]), target_lift, clampf(delta * 14.0, 0.0, 1.0))
		root.position.y = float(card["lift"])
	var vignette_target := Color(1, 1, 1, 0)
	if sim.surge_timer > 0.0:
		vignette_target = Color(1.0, 0.78, 0.2, 0.42 + 0.12 * sin(_time * 6.0))
	elif sim.hall_ratio() < 0.3 and sim.result == &"":
		vignette_target = Color(0.9, 0.1, 0.08, 0.26 + 0.14 * absf(sin(_time * 3.5)))
	else:
		vignette_target = Color(_vignette_color.r, _vignette_color.g, _vignette_color.b, 0.0)
	_vignette_color = _vignette_color.lerp(vignette_target, clampf(delta * 5.0, 0.0, 1.0))
	_vignette.modulate = _vignette_color


# ================================================================ refresh (10 Hz)

func refresh() -> void:
	if sim == null:
		return
	var income := RtsSimulation.BASE_INCOME + RtsSimulation.ROOM_INCOME * float(sim.secured_rooms())
	var rep: Dictionary = _stats["rep"]
	rep["target"] = floorf(sim.reputation)
	(rep["sub"] as Label).text = Loc.t(&"hud.income", {"income": "%.1f" % income})
	var squad: Dictionary = _stats["squad"]
	var full := sim.population() >= sim.population_cap()
	(squad["value"] as Label).text = "%d/%d" % [sim.population(), sim.population_cap()]
	(squad["value"] as Label).add_theme_color_override("font_color", T.RED if full else INK)
	(squad["sub"] as Label).text = Loc.t(&"hud.squad_full") if full else Loc.t(&"hud.squad_sub")
	var rooms: Dictionary = _stats["rooms"]
	(rooms["value"] as Label).text = "%d/4" % sim.secured_rooms()
	(rooms["sub"] as Label).text = Loc.t(&"hud.rooms_sub")
	var ratio := sim.hall_ratio()
	_spirit_bar.value = ratio
	T.set_bar_color(_spirit_bar, Color("58c94f") if ratio > 0.6 else (Color("f0b429") if ratio > 0.3 else T.RED))
	var hall: Dictionary = sim.buildings[&"main_hall"]
	_spirit_label.text = "%d/%d" % [int(ceil(float(hall["hp"]))), int(hall["max_hp"])]
	_refresh_wave()
	_refresh_rooms()
	_refresh_cards()
	_refresh_commands()
	_refresh_context_values()
	_refresh_bulletin()
	_refresh_boss()


func set_muted(muted: bool) -> void:
	_mute_button.text = Loc.t(&"hud.sound_off") if muted else Loc.t(&"hud.sound_on")


func _refresh_wave() -> void:
	var total := sim.total_waves()
	var last_started := sim.wave_index + 1 >= total
	if sim.wave_index < 0:
		_wave_title.text = Loc.t(&"hud.wave_title_pre")
	else:
		_wave_title.text = Loc.t(&"hud.wave_title", {"wave": sim.wave_index + 1, "total": total})
	if sim.wave_spawning or (last_started and sim.wave_index >= 0):
		_wave_timer.text = Loc.t(&"hud.wave_invaders", {"count": sim.enemies().size()})
	else:
		var seconds := int(ceil(sim.wave_timer))
		_wave_timer.text = Loc.t(&"hud.wave_countdown", {"wave": sim.next_wave_number(), "time": "%d:%02d" % [seconds / 60, seconds % 60]})
	_score_label.text = Loc.t(&"hud.score", {"score": sim.score})
	var can_bell := not sim.wave_spawning and not last_started and sim.result == &""
	_bell_button.disabled = not can_bell
	_bell_button.text = Loc.t(&"hud.bell", {"amount": int(round(sim.wave_timer * RtsSimulation.EARLY_CALL_BONUS_PER_SECOND))}) if can_bell else Loc.t(&"hud.bell_busy")


func _refresh_rooms() -> void:
	for id: StringName in ROOM_ORDER:
		var refs: Dictionary = _room_refs[id]
		var building: Dictionary = sim.buildings[id]
		var status: Label = refs["status"]
		var ring: Ring = refs["ring"]
		var owner := int(building["owner"])
		var queue: Array = building["queue"]
		ring.visible = true
		if id == &"main_hall":
			status.text = Loc.t(&"room.status_hall", {"percent": int(round(sim.hall_ratio() * 100.0))})
			status.add_theme_color_override("font_color", INK_SOFT)
			ring.value = sim.hall_ratio()
			ring.color = Color("58c94f") if sim.hall_ratio() > 0.3 else T.RED
		else:
			var control := float(building["control"])
			ring.value = (control + 1.0) * 0.5
			if owner == RtsSimulation.TEAM_PLAYER:
				var contested := bool(building.get("contested", false))
				var threatened := not contested and int(building.get("threat", 0)) > 0
				status.text = Loc.t(&"room.status_contested") if contested else (Loc.t(&"room.status_threat") if threatened else Loc.t(&"room.status_secured"))
				status.add_theme_color_override("font_color", T.RED if contested else (Color("c8561c") if threatened else GREEN_INK))
				ring.color = T.RED if contested else (Color("f08a24") if threatened else Color("58c94f"))
			elif control > -0.999:
				status.text = Loc.t(&"room.capturing", {"percent": int(round((control + 1.0) * 50.0))})
				status.add_theme_color_override("font_color", Color("a8651a"))
				ring.color = T.GOLD
			else:
				var alarmed := float(building.get("alarm", 0.0)) > 0.0
				status.text = Loc.t(&"room.status_alarm") if alarmed else Loc.t(&"room.status_held")
				status.add_theme_color_override("font_color", T.RED if alarmed else Color("5d6b2c"))
				ring.visible = false
		ring.queue_redraw()
		(refs["count"] as Label).text = "x%d" % queue.size() if not queue.is_empty() else ""
		var selected := battlefield != null and battlefield.selected_building == id
		if selected != bool(refs["selected"]):
			refs["selected"] = selected
			var button: Button = refs["button"]
			button.add_theme_stylebox_override("normal", T.box(Color(1, 0.86, 0.35, 0.6) if selected else Color(0, 0, 0, 0), Color(0, 0, 0, 0), 0, 8, 0))


func _refresh_cards() -> void:
	var selected_kinds := {}
	if battlefield != null:
		for id: int in battlefield.selected:
			var value: Dictionary = sim.units.get(id, {})
			if not value.is_empty():
				selected_kinds[value["kind"]] = true
	for kind: StringName in _cards:
		var card: Dictionary = _cards[kind]
		var count := 0
		var level := 1
		var best_cd := INF
		var ready_count := 0
		for hero: Dictionary in sim.heroes():
			if hero["kind"] != kind:
				continue
			count += 1
			level = maxi(level, int(hero.get("level", 1)))
			var cd := float(hero["power_cooldown"])
			best_cd = minf(best_cd, cd)
			if cd <= 0.0:
				ready_count += 1
		var has := count > 0
		(card["count"] as Label).text = "x%d" % count
		(card["count_badge"] as Panel).visible = has
		(card["level"] as Label).text = str(level)
		(card["badge"] as Panel).visible = has
		(card["portrait"] as TextureRect).modulate = Color.WHITE if has else Color(0.55, 0.52, 0.5, 0.7)
		(card["tint"] as ColorRect).visible = has
		var stars: Array[TextureRect] = card["stars"]
		for index in stars.size():
			stars[index].visible = has
			stars[index].modulate = Color.WHITE if index < level else Color(0.3, 0.25, 0.25, 0.3)
		var ring: Ring = card["ring"]
		var cd_label: Label = card["cd"]
		var hint: Label = card["hint"]
		ring.visible = has
		cd_label.visible = has
		(card["power"] as Label).visible = has
		hint.visible = not has
		var ready := has and ready_count > 0
		(card["ready"] as Label).visible = ready
		if has:
			var cooldown := float(RtsSimulation.POWERS[kind]["cooldown"])
			ring.value = 1.0 - clampf(best_cd / cooldown, 0.0, 1.0)
			cd_label.text = "" if ready else str(int(ceil(best_cd)))
			ring.queue_redraw()
			if ready and not bool(card["was_ready"]):
				_pulse(card["root"], 1.1)
				fx.preset(&"ui_pop", _center_of(card["root"]), 1.0)
			if level > int(card["level_value"]):
				celebrate_card(kind)
			card["level_value"] = level
		else:
			card["level_value"] = 1
			var room := _room_for(kind)
			if room == &"main_hall" or int(sim.buildings[room]["owner"]) == RtsSimulation.TEAM_PLAYER:
				hint.text = Loc.t(&"card.train_hint", {"room": Loc.t(StringName("room.%s" % room)), "cost": int(Catalog.stats(kind)["cost"])})
			else:
				hint.text = Loc.t(&"card.locked", {"room": Loc.t(StringName("room.%s" % room))})
		card["was_ready"] = ready
		(card["glow"] as Panel).visible = selected_kinds.has(kind)


func _room_for(kind: StringName) -> StringName:
	for room_id: StringName in Catalog.ROOMS:
		if Catalog.ROOMS[room_id]["trains"] == kind:
			return room_id
	return &"main_hall"


func _refresh_commands() -> void:
	var has_selection := battlefield != null and not battlefield.selected.is_empty()
	var ready := sim.power_ready_count(battlefield.selected) if has_selection else 0
	var power: Button = _command_buttons[&"power"]
	power.disabled = not has_selection
	power.text = Loc.t(&"cmd.power_ready", {"count": ready}) if has_selection else Loc.t(&"cmd.power")
	(_command_buttons[&"attack"] as Button).disabled = not has_selection
	(_command_buttons[&"stop"] as Button).disabled = not has_selection
	var rally: Button = _command_buttons[&"rally"]
	rally.disabled = not bool(sim.can_pep_rally()["ok"])
	rally.text = Loc.t(&"cmd.rally_cooldown", {"seconds": int(ceil(sim.rally_cooldown))}) if sim.rally_cooldown > 0.0 else Loc.t(&"cmd.rally_cost", {"cost": RtsSimulation.RALLY_COST})
	var train: Button = _command_buttons[&"train"]
	var room := battlefield.selected_building if battlefield != null and battlefield.selected_building != &"" else &"main_hall"
	var hero_kind: StringName = sim.buildings[room]["trains"]
	train.text = Loc.t(&"cmd.train_kind", {"hero": Loc.t(StringName("hero.%s" % hero_kind)), "cost": int(Catalog.stats(hero_kind)["cost"])})
	train.disabled = not bool(sim.can_train(room)["ok"])
	if sim.surge_timer > 0.0:
		_surge_button.text = Loc.t(&"cmd.surge_active", {"seconds": int(ceil(sim.surge_timer))})
		_surge_button.disabled = true
	elif sim.hype >= RtsSimulation.HYPE_MAX:
		_surge_button.text = Loc.t(&"cmd.surge")
		_surge_button.disabled = false
	else:
		_surge_button.text = Loc.t(&"cmd.surge_need", {"percent": int(floor(sim.hype / RtsSimulation.HYPE_MAX * 100.0))})
		_surge_button.disabled = true


func _refresh_bulletin() -> void:
	var next_index := sim.wave_index + 1
	var show := next_index < sim.total_waves() and not sim.wave_spawning and sim.wave_timer < 14.0 and sim.result == &""
	if show != _bulletin.visible:
		_bulletin.visible = show
		if show:
			_pulse(_bulletin, 1.06)
	if not show or _bulletin_wave == next_index:
		return
	_bulletin_wave = next_index
	var info := sim.wave_composition(next_index)
	_bulletin_title.text = Loc.t(&"hud.bulletin_final") if bool(info.get("final", false)) else Loc.t(&"hud.bulletin", {"wave": next_index + 1})
	for child in _bulletin_row.get_children():
		child.queue_free()
	var counts: Dictionary = info.get("counts", {})
	for kind: StringName in counts:
		var chip := HBoxContainer.new()
		chip.add_theme_constant_override("separation", 2)
		chip.add_child(T.icon(PORTRAITS[kind], 30))
		chip.add_child(T.ink("x%d" % int(counts[kind]), 15, INK, "black"))
		_bulletin_row.add_child(chip)
	var lane_names: Array[String] = []
	for lane: Variant in info.get("lanes", []):
		lane_names.append(Loc.t(StringName("lane.%s" % str(lane))))
	var lane_label := T.ink(Loc.t(&"hud.bulletin_lanes", {"lanes": ", ".join(lane_names)}), 12, T.MAROON, "black")
	lane_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_wrap(lane_label, 150.0)
	_bulletin_row.add_child(lane_label)


func _refresh_boss() -> void:
	var boss: Dictionary = {}
	for enemy: Dictionary in sim.enemies():
		if enemy["kind"] == &"mech":
			boss = enemy
			break
	if _boss_panel.visible != (not boss.is_empty()):
		_boss_panel.visible = not boss.is_empty()
		if _boss_panel.visible:
			_pulse(_boss_panel, 1.1)
	if not boss.is_empty():
		_boss_bar.value = float(boss["hp"]) / maxf(float(boss["max_hp"]), 1.0)


# ================================================================ context panel

func _wrap(label: Label, width: float) -> Label:
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.custom_minimum_size.x = maxf(width, 60.0)
	return label


func _context_text_width(with_portrait: bool) -> float:
	var width := (_context.custom_minimum_size.x if _context.custom_minimum_size.x > 0.0 else 520.0) - 40.0
	return width - (66.0 if with_portrait else 0.0)


func rebuild_context() -> void:
	for child in _context_box.get_children():
		_context_box.remove_child(child)
		child.queue_free()
	_context_refs.clear()
	if sim == null or battlefield == null:
		return
	if not battlefield.selected.is_empty():
		_build_hero_context()
	elif battlefield.selected_building != &"":
		_build_room_context(battlefield.selected_building)
	else:
		_context_box.add_child(T.label(Loc.t(&"sel.none_title"), 18, T.MAROON, "display"))
		var tip := T.ink(Loc.t(&"sel.none_body_touch") if touch_layout else Loc.t(&"sel.none_body"), 12, INK_SOFT, "bold")
		_context_box.add_child(_wrap(tip, _context_text_width(false)))
	_refresh_context_values()
	_context.reset_size()
	_context.position.y = _rail.position.y - _context.size.y - 16.0


func _build_hero_context() -> void:
	var ids: Array[int] = battlefield.selected
	var first: Dictionary = sim.units.get(ids[0], {})
	if first.is_empty():
		return
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	_context_box.add_child(row)
	var kind: StringName = first["kind"]
	row.add_child(T.icon(PORTRAITS[kind], 56))
	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_theme_constant_override("separation", 1)
	row.add_child(info)
	if ids.size() == 1:
		info.add_child(T.ink("%s  ·  %s" % [Loc.t(StringName("hero.%s" % kind)), Loc.t(StringName("hero.%s.role" % kind))], 16, T.MAROON, "black"))
		var bars := HBoxContainer.new()
		bars.add_theme_constant_override("separation", 8)
		info.add_child(bars)
		var hp := T.bar(Color("58c94f"), 12)
		hp.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		hp.tooltip_text = Loc.t(&"sel.hp_tooltip")
		bars.add_child(hp)
		var xp := T.bar(Color("b26bff"), 12)
		xp.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		bars.add_child(xp)
		var line := T.ink("", 12, INK, "black")
		info.add_child(line)
		var desc := T.ink(Loc.t(StringName("power.%s.desc" % kind)), 11, INK_SOFT, "bold")
		info.add_child(_wrap(desc, _context_text_width(true)))
		_context_refs = {"mode": &"single", "id": ids[0], "hp": hp, "xp": xp, "line": line}
		return
	info.add_child(T.ink(Loc.t(&"sel.squad", {"count": ids.size()}), 16, T.MAROON, "black"))
	var kinds := {}
	for id: int in ids:
		var value: Dictionary = sim.units.get(id, {})
		if not value.is_empty():
			kinds[value["kind"]] = int(kinds.get(value["kind"], 0)) + 1
	var chips := HBoxContainer.new()
	chips.add_theme_constant_override("separation", 10)
	info.add_child(chips)
	for chip_kind: StringName in kinds:
		var chip := HBoxContainer.new()
		chip.add_theme_constant_override("separation", 2)
		chip.add_child(T.icon(PORTRAITS[chip_kind], 26))
		chip.add_child(T.ink("x%d" % int(kinds[chip_kind]), 14, INK, "black"))
		chips.add_child(chip)
	var squad_line := T.ink("", 12, INK_SOFT, "black")
	info.add_child(squad_line)
	_context_refs = {"mode": &"squad", "line": squad_line}


func _build_room_context(id: StringName) -> void:
	var building: Dictionary = sim.buildings[id]
	var owner := int(building["owner"])
	var hero_kind: StringName = building["trains"]
	var header := HBoxContainer.new()
	header.add_theme_constant_override("separation", 10)
	_context_box.add_child(header)
	header.add_child(T.label(Loc.t(StringName("room.%s" % id)), 20, T.MAROON, "display"))
	var status_text := Loc.t(&"room.status_secured") if owner == RtsSimulation.TEAM_PLAYER else Loc.t(&"room.status_held")
	if id == &"main_hall":
		status_text = Loc.t(&"room.status_base")
	var status := T.ink(status_text, 13, GREEN_INK if owner == RtsSimulation.TEAM_PLAYER else Color("5d6b2c"), "black")
	status.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(status)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 8)
	_context_box.add_child(row)
	var train := T.button("", Loc.t(StringName("hero.%s.role" % hero_kind)), T.GOLD, 14)
	train.name = "ContextTrain"
	train.icon = PORTRAITS[hero_kind]
	train.expand_icon = true
	train.add_theme_constant_override("icon_max_width", 34)
	train.custom_minimum_size = Vector2(228, 54 if touch_layout else 46)
	train.pressed.connect(func() -> void: command.emit(&"train"))
	_juice(train)
	row.add_child(train)
	var queue_box := VBoxContainer.new()
	queue_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	queue_box.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_child(queue_box)
	var queue_label := T.ink("", 12, INK, "black")
	queue_box.add_child(queue_label)
	var progress := T.bar(T.GOLD, 10)
	queue_box.add_child(progress)
	var cancel := T.button(Loc.t(&"sel.cancel"), Loc.t(&"sel.cancel_tooltip"), T.PAPER, 12)
	cancel.custom_minimum_size = Vector2(0, 54 if touch_layout else 46)
	cancel.pressed.connect(func() -> void: command.emit(&"cancel_train"))
	_juice(cancel)
	row.add_child(cancel)
	var hint_text := Loc.t(&"sel.rally_hint") if owner == RtsSimulation.TEAM_PLAYER else Loc.t(&"sel.capture_hint", {"hero": Loc.t(StringName("hero.%s" % hero_kind))})
	var hint := T.ink(hint_text, 11, INK_SOFT, "bold")
	_context_box.add_child(_wrap(hint, _context_text_width(false)))
	_context_refs = {"mode": &"room", "id": id, "train": train, "queue_label": queue_label, "progress": progress, "cancel": cancel}


func _refresh_context_values() -> void:
	if _context_refs.is_empty() or sim == null:
		return
	match _context_refs["mode"]:
		&"single":
			var value: Dictionary = sim.units.get(int(_context_refs["id"]), {})
			if value.is_empty():
				return
			(_context_refs["hp"] as ProgressBar).value = float(value["hp"]) / float(value["max_hp"])
			(_context_refs["xp"] as ProgressBar).value = sim.level_progress(value)
			var cooldown := float(value["power_cooldown"])
			var power_name := Loc.t(StringName("power.%s" % value["kind"]))
			var power_text := Loc.t(&"sel.power_ready", {"power": power_name}) if cooldown <= 0.0 else Loc.t(&"sel.power_wait", {"power": power_name, "seconds": int(ceil(cooldown))})
			(_context_refs["line"] as Label).text = "%s  ·  %s  ·  %s" % [Loc.t(&"card.lv", {"level": int(value.get("level", 1))}), Loc.t(&"sel.hp", {"hp": int(ceil(float(value["hp"]))), "max": int(value["max_hp"])}), power_text]
		&"squad":
			(_context_refs["line"] as Label).text = Loc.t(&"sel.squad_ready", {"count": sim.power_ready_count(battlefield.selected)})
		&"room":
			var id: StringName = _context_refs["id"]
			var building: Dictionary = sim.buildings[id]
			var hero_kind: StringName = building["trains"]
			var train: Button = _context_refs["train"]
			var check := sim.can_train(id)
			train.disabled = not bool(check["ok"])
			train.text = Loc.t(&"sel.train", {"hero": Loc.t(StringName("hero.%s" % hero_kind)), "cost": int(Catalog.stats(hero_kind)["cost"])}) if bool(check["ok"]) else Loc.t(check["reason"])
			var queue: Array = building["queue"]
			(_context_refs["queue_label"] as Label).text = Loc.t(&"sel.queue_empty") if queue.is_empty() else Loc.t(&"sel.queue", {"count": queue.size(), "hero": Loc.t(StringName("hero.%s" % queue[0]))})
			(_context_refs["progress"] as ProgressBar).value = sim.training_progress(id)
			(_context_refs["cancel"] as Button).disabled = queue.is_empty()


# ================================================================ objectives

func reset_objectives() -> void:
	objectives_done.clear()
	_bulletin_wave = -2
	for child in _notice_box.get_children():
		child.queue_free()
	(_stats["rep"] as Dictionary)["shown"] = 0.0
	refresh_objectives()


func complete_objective(id: StringName) -> bool:
	if objectives_done.has(id):
		return false
	objectives_done[id] = true
	refresh_objectives()
	if _objectives.visible:
		_pulse(_objectives, 1.05)
		fx.preset(&"ui_pop", _center_of(_objectives), 1.1)
	return true


func refresh_objectives() -> void:
	for child in _objective_list.get_children():
		_objective_list.remove_child(child)
		child.queue_free()
	var current_found := false
	for id: StringName in OBJECTIVES:
		var done := objectives_done.has(id)
		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 6)
		var mark := T.ink("✔" if done else ("▶" if not current_found else "•"), 14, GREEN_INK if done else T.MAROON, "black")
		mark.custom_minimum_size = Vector2(16, 0)
		row.add_child(mark)
		var is_current := not done and not current_found
		var text := _wrap(T.ink(Loc.t(StringName("obj.%s" % id)), 13, Color(0.1, 0.07, 0.1, 0.42) if done else INK, "black" if is_current else "bold"), 196.0)
		text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(text)
		_objective_list.add_child(row)
		if is_current:
			current_found = true
			_objective_list.add_child(_wrap(T.ink(Loc.t(StringName("obj.%s.tip" % id)), 11, INK_SOFT, "bold"), 218.0))
	_objective_list.add_child(_wrap(T.ink(Loc.t(&"obj.goal", {"total": Catalog.WAVES.size()}), 11, T.MAROON, "black"), 218.0))
	_objectives.reset_size()


# ================================================================ notices, banners, coins

func toast(text: String, color: Color) -> void:
	while _notice_box.get_child_count() >= MAX_NOTICES:
		var oldest := _notice_box.get_child(0)
		_notice_box.remove_child(oldest)
		oldest.queue_free()
	var panel := T.paper(Vector2(16, 4))
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	var ink_color := color
	if color == T.MUTED:
		ink_color = INK_SOFT
	elif color.get_luminance() > 0.55:
		ink_color = color.darkened(0.5)
	var label := T.ink(text, 14, ink_color, "black")
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	if text.length() > 48:
		_wrap(label, 440.0)
	panel.add_child(label)
	_notice_box.add_child(panel)
	panel.modulate.a = 0.0
	var tween := panel.create_tween()
	tween.tween_property(panel, "modulate:a", 1.0, 0.15)
	tween.tween_interval(3.3)
	tween.tween_property(panel, "modulate:a", 0.0, 0.5)
	tween.tween_callback(panel.queue_free)


func banner(text: String, color: Color, sticker: StringName = &"") -> void:
	_banner.text = text
	_banner.add_theme_color_override("font_color", color)
	_banner.pivot_offset = _banner.size * 0.5
	var center := _banner.position + _banner.size * 0.5
	if sticker != &"":
		fx.sticker(sticker, center + Vector2(0, 8), 230.0, 1.6)
	fx.preset(&"confetti" if color == T.GOLD else &"ui_pop", center + Vector2(0, -30), 1.4)
	if _banner_tween != null and _banner_tween.is_valid():
		_banner_tween.kill()
	var tween := _banner.create_tween()
	_banner_tween = tween
	if reduced_motion:
		_banner.scale = Vector2.ONE
		_banner.modulate.a = 1.0
	else:
		_banner.scale = Vector2.ONE * 1.8
		_banner.modulate.a = 0.0
		tween.set_parallel(true)
		tween.tween_property(_banner, "scale", Vector2.ONE, 0.28).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(_banner, "modulate:a", 1.0, 0.15)
		tween.set_parallel(false)
	tween.tween_interval(1.8)
	tween.tween_property(_banner, "modulate:a", 0.0, 0.5)


## Coins fly from a viewport position into the Reputation card; each arrival pulses the card.
func fly_coins(viewport_position: Vector2, count: int) -> void:
	if fx == null or count <= 0:
		return
	var start := get_global_transform_with_canvas().affine_inverse() * viewport_position
	var target := _center_of(_stats["rep"]["icon"])
	for index in mini(count, 8):
		var offset := Vector2(randf_range(-22, 22), randf_range(-14, 14))
		var control := start.lerp(target, 0.35) + Vector2(randf_range(-110, 110), randf_range(-170, -60))
		fx.particle(&"coin", start + offset, Vector2.ZERO, 0.55 + 0.07 * float(index), 26.0, 18.0, Color.WHITE, {"target": target, "control": control, "tag": &"coin", "spin": 6.0, "fade": 0.97, "fade_in": 0.02})


func _on_particle_arrived(tag: StringName) -> void:
	if tag == &"coin":
		_pulse(_stats["rep"]["panel"], 1.07)
		fx.preset(&"ui_sparkle", _center_of(_stats["rep"]["icon"]), 0.8)
		coin_arrived.emit()


func pulse_stat(key: String) -> void:
	if _stats.has(key):
		var panel: Control = _stats[key]["panel"]
		if panel.visible:
			_pulse(panel, 1.1)
			fx.preset(&"ui_pop", _center_of(panel), 0.9)


func pulse_spirit() -> void:
	_pulse(_spirit_panel, 1.04)


func celebrate_card(kind: StringName) -> void:
	if not _cards.has(kind):
		return
	var root: Control = _cards[kind]["root"]
	_pulse(root, 1.16)
	var center := _center_of(root)
	fx.preset(&"level_up", center, 0.6)
	fx.preset(&"ui_pop", center, 1.4)


func card_center(kind: StringName) -> Vector2:
	return _center_of(_cards[kind]["root"]) if _cards.has(kind) else size * 0.5
