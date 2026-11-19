extends Node2D
const OpenSourceLicenses = preload("res://scripts/manus/open_source_licenses.gd")
const HoloUI = preload("res://scripts/holo_ui.gd")

const BG = preload("res://assets/template/star_graveyard.webp")
const DOG_SHIP = preload("res://assets/template/dog_ship.webp")
const UI_FONT = preload("res://assets/template/fonts/ui_regular.tres")
const MEDIUM_FONT = preload("res://assets/template/fonts/ui_medium.tres")
const BOLD_FONT = preload("res://assets/template/fonts/ui_bold.tres")
const TITLE_FONT = preload("res://assets/template/fonts/display/display_title.tres")
const DISPLAY_FONT = preload("res://assets/template/fonts/display/display_bold.tres")
const LEFT := 104.0
const SHIP_X := 911.0
const SHIP_Y := 392.0
const CYAN := HoloUI.CYAN
const ORANGE := HoloUI.ORANGE
const AMBER := HoloUI.AMBER
const W := 1280.0
const H := 720.0
const LOGO_WIDTH := 452.0
const SHINE_PERIOD := 5.5

var bg_sprite: Sprite2D
var ship_sprite: Sprite2D
var logo: Node2D
var t := 0.0
var best_score := 0
var starting := false
## Parallax starfield: x, y, depth (0.3 far .. 1.0 near).
var stars: Array = []
var motes: Array = []
var thruster: Array = []
var language_buttons: Dictionary = {}
var language_label: Label
var language_notice: Label
var launch_button: Button
var licenses_button: Button
var _tracked: Dictionary = {}
var _brand_size := 60
var _cta_lift := 0.0

func _ready() -> void:
	for i in range(96):
		stars.append(Vector3(randf_range(0.0, W), randf_range(0.0, H), randf_range(0.3, 1.0)))
	for i in range(14):
		motes.append({"pos": Vector2(randf_range(560.0, W), randf_range(80.0, H - 40.0)), "vel": Vector2(randf_range(-14.0, -5.0), randf_range(-6.0, 6.0)), "phase": randf_range(0.0, TAU)})
	bg_sprite = Sprite2D.new()
	bg_sprite.texture = BG
	bg_sprite.position = Vector2(W * 0.5, H * 0.5)
	bg_sprite.scale = Vector2(1.05, 1.05)
	bg_sprite.z_index = -100
	add_child(bg_sprite)
	ship_sprite = Sprite2D.new()
	ship_sprite.texture = DOG_SHIP
	ship_sprite.position = Vector2(SHIP_X, SHIP_Y)
	ship_sprite.scale = Vector2(0.72, 0.72)
	ship_sprite.z_index = -1
	add_child(ship_sprite)
	var config := ConfigFile.new()
	if config.load("user://stargrave_save.cfg") == OK:
		best_score = int(config.get_value("progress", "best_score", 0))
	logo = Node2D.new()
	logo.name = "LogoLockup"
	logo.material = HoloUI.shine_material()
	logo.draw.connect(_draw_logo)
	add_child(logo)
	_make_language_controls()
	HoloUI.add_crt_overlay(self, Vector2(W, H))
	I18n.locale_changed.connect(_on_locale_changed)
	_on_locale_changed(I18n.get_locale())
	set_process(true)
	set_process_unhandled_input(true)
	queue_redraw()

func _process(delta: float) -> void:
	t += delta
	bg_sprite.position = Vector2(W * 0.5 + sin(t * 0.07) * 16.0, H * 0.5 + cos(t * 0.05) * 8.0)
	var arrive := HoloUI.ease_out((t - 0.15) / 0.9)
	ship_sprite.position = Vector2(SHIP_X + (1.0 - arrive) * 420.0, SHIP_Y + sin(t * 1.65) * 10.0)
	ship_sprite.rotation = sin(t * 1.2) * 0.012
	ship_sprite.modulate.a = arrive
	for i in range(stars.size()):
		var s: Vector3 = stars[i]
		s.x -= (10.0 + s.z * s.z * 90.0) * delta
		if s.x < -40.0:
			s.x = W + randf_range(0.0, 140.0)
			s.y = randf_range(0.0, H)
		stars[i] = s
	for m: Dictionary in motes:
		m.pos += m.vel * delta
		if m.pos.x < 540.0:
			m.pos = Vector2(W + 10.0, randf_range(80.0, H - 40.0))
	var nozzle := ship_sprite.position + Vector2(-128.0, 2.0)
	if thruster.size() < 36:
		thruster.append({"pos": nozzle + Vector2(0, randf_range(-5.0, 5.0)), "vel": Vector2(randf_range(-230.0, -150.0), randf_range(-14.0, 14.0)), "life": randf_range(0.25, 0.5), "max": 0.5})
	for i in range(thruster.size() - 1, -1, -1):
		var p: Dictionary = thruster[i]
		p.life -= delta
		p.pos += p.vel * delta
		if p.life <= 0.0:
			thruster.remove_at(i)
	# Logo lockup: drop-in with overshoot, then a slow breath and a periodic shine sweep.
	var drop := HoloUI.ease_back((t - 0.1) / 0.6)
	var logo_scale := lerpf(1.22, 1.0, drop) + sin(t * 1.4) * 0.006
	logo.scale = Vector2(logo_scale, logo_scale)
	logo.modulate.a = clampf((t - 0.1) / 0.3, 0.0, 1.0)
	var cycle := fmod(maxf(t - 0.9, 0.0), SHINE_PERIOD)
	(logo.material as ShaderMaterial).set_shader_parameter("sweep", lerpf(-420.0, 520.0, cycle / 1.1) if cycle < 1.1 else -2000.0)
	_cta_lift = move_toward(_cta_lift, 1.0 if launch_button.is_hovered() or launch_button.has_focus() else 0.0, delta * 8.0)
	logo.queue_redraw()
	queue_redraw()

func _unhandled_input(event: InputEvent) -> void:
	if (event is InputEventScreenTouch or event is InputEventMouseButton) and event.pressed:
		if not Rect2(0, 0, W, H).has_point(event.position):
			return
	if starting:
		return
	# Navigation and activation on a language control must never launch a run.
	var focused := get_viewport().gui_get_focus_owner()
	if focused in language_buttons.values() or focused == licenses_button:
		if event is InputEventKey or event is InputEventJoypadButton or event is InputEventJoypadMotion:
			return
	if event is InputEventKey and event.keycode in [KEY_TAB, KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT]:
		return
	if event is InputEventKey and event.pressed and not event.echo:
		_start_game()
	elif event is InputEventMouseButton and event.pressed:
		_start_game()
	elif event is InputEventScreenTouch and event.pressed:
		_start_game()

func _start_game() -> void:
	if starting:
		return
	starting = true
	get_tree().change_scene_to_file("res://scenes/game.tscn")

## 0..1 entrance progress for an element that starts at `delay` seconds.
func _ent(delay: float, duration: float = 0.45) -> float:
	return HoloUI.ease_out((t - delay) / duration)

func _draw() -> void:
	# Parallax starfield: far points, near stars stretch into warp streaks.
	for s: Vector3 in stars:
		var alpha: float = 0.18 + s.z * 0.5
		if s.z > 0.78:
			var tail := 10.0 + (s.z - 0.78) * 90.0
			draw_line(Vector2(s.x, s.y), Vector2(s.x + tail, s.y), Color(0.62, 0.88, 1.0, alpha * 0.55), 1.4)
		draw_circle(Vector2(s.x, s.y), 0.5 + s.z * 1.3, Color(0.70, 0.88, 1.0, alpha))
	for m: Dictionary in motes:
		var glow := 0.5 + 0.5 * sin(t * 1.7 + float(m.phase))
		draw_circle(m.pos, 5.0, Color(1.0, 0.62, 0.35, 0.05 + glow * 0.05))
		draw_circle(m.pos, 1.4, Color(1.0, 0.80, 0.55, 0.30 + glow * 0.4))
	for p: Dictionary in thruster:
		var k: float = clampf(float(p.life) / float(p.max), 0.0, 1.0)
		draw_circle(p.pos, 1.0 + k * 3.0, Color(0.35, 0.90, 1.0, k * 0.55 * ship_sprite.modulate.a))
	# Cinematic scrim: dark on the left for the menu, fading into the key art.
	var dark := Color(0.012, 0.008, 0.035, 0.92)
	var mid := Color(0.012, 0.008, 0.035, 0.70)
	var clear := Color(0.012, 0.008, 0.035, 0.0)
	draw_polygon(PackedVector2Array([Vector2(0, 0), Vector2(380, 0), Vector2(380, H), Vector2(0, H)]), PackedColorArray([dark, mid, mid, dark]))
	draw_polygon(PackedVector2Array([Vector2(380, 0), Vector2(720, 0), Vector2(720, H), Vector2(380, H)]), PackedColorArray([mid, clear, clear, mid]))
	# Cockpit frame: screen-corner brackets and centre ticks.
	var frame_a := _ent(0.0, 0.6)
	HoloUI.brackets(self, Rect2(18, 18, W - 36, H - 36).grow(-8.0 * (1.0 - frame_a)), 34.0, Color(CYAN, 0.42 * frame_a), 2.0)
	for i in range(-6, 7):
		var tick_h := 7.0 if i % 3 == 0 else 3.0
		draw_line(Vector2(W * 0.5 + i * 14.0, 18), Vector2(W * 0.5 + i * 14.0, 18 + tick_h), Color(CYAN, 0.30 * frame_a), 1.0)
	_draw_hiscore()
	var zh := I18n.get_locale() != "en"
	var fade := _ent(0.25)
	var slide := (1.0 - fade) * -28.0
	# Eyebrow (the wordmark itself is drawn by the LogoLockup child for its shine shader).
	var eye := Color(CYAN, fade)
	draw_rect(Rect2(LEFT + slide, 101, 6, 6), Color(ORANGE, fade))
	_text(I18n.t("title.eyebrow"), Vector2(LEFT + 16 + slide, 108), 13, eye, _caps_font())
	var tag_y := 184.0 + _brand_size + 6 + 42
	fade = _ent(0.55)
	slide = (1.0 - fade) * -28.0
	draw_rect(Rect2(LEFT + slide, tag_y - 9, 28, 2), Color(ORANGE, fade))
	_text(I18n.t("title.tagline"), Vector2(LEFT + 40 + slide, tag_y - 3), 13, Color(0.74, 0.72, 0.88, fade), _caps_font())
	fade = _ent(0.7)
	slide = (1.0 - fade) * -28.0
	_text(I18n.t("title.story_first"), Vector2(LEFT + slide, tag_y + 50), 22, Color(0.96, 0.95, 0.98, fade), MEDIUM_FONT)
	_text(I18n.t("title.story_second"), Vector2(LEFT + slide, tag_y + 80), 17, Color(0.72, 0.74, 0.86, fade))
	_draw_launch_plate(zh)
	_draw_legend()
	_draw_ship_callout()

func _draw_hiscore() -> void:
	var a := _ent(0.4)
	var label := I18n.t("title.hiscore")
	_text(label, Vector2(0, 44), 11, Color(ORANGE, 0.9 * a), _caps_font(), HORIZONTAL_ALIGNMENT_CENTER, W)
	HoloUI.glow_text(self, DISPLAY_FONT, Vector2(0, 74), "%06d" % best_score, 26, Color(1.0, 0.86, 0.55, a), Color(1.0, 0.62, 0.25, a), HORIZONTAL_ALIGNMENT_CENTER, W)

func _draw_logo() -> void:
	var first := I18n.t("title.brand_first")
	var second := I18n.t("title.brand_second")
	# The LogoLockup node sits at the lockup centre so the drop-in scales around it.
	var first_base := Vector2(-LOGO_WIDTH * 0.5, 184.0 - logo.position.y)
	var second_base := first_base + Vector2(0, _brand_size + 6)
	var glitch := 1.0 if fmod(t, 3.7) > 3.58 else 0.0
	var split := 2.0 + glitch * 4.0
	HoloUI.chroma_text(logo, TITLE_FONT, first_base + Vector2(glitch * 3.0, 0), first, _brand_size, Color(0.99, 0.96, 0.90), Color(0.55, 0.85, 1.0, 0.9), HORIZONTAL_ALIGNMENT_LEFT, -1, split)
	HoloUI.chroma_text(logo, TITLE_FONT, second_base, second, _brand_size, ORANGE, Color(1.0, 0.45, 0.18, 1.0), HORIZONTAL_ALIGNMENT_LEFT, -1, split)

func _draw_launch_plate(zh: bool) -> void:
	var fade := _ent(0.85)
	var base := launch_button.get_rect()
	var cta := Rect2(base.position + Vector2((1.0 - fade) * -40.0, -3.0 * _cta_lift), base.size)
	var skew := 14.0
	var glow := 0.5 + 0.5 * sin(t * 3.0)
	var active := _cta_lift
	# Outer glow halo on hover/focus.
	if active > 0.01:
		for g in 3:
			var grow := 4.0 + g * 5.0
			var halo := _skew_rect(cta.grow(grow), skew)
			halo.append(halo[0])
			draw_polyline(halo, Color(AMBER, (0.22 - g * 0.06) * active * fade), 3.0)
	var plate := _skew_rect(cta, skew)
	var top_c := Color(0.06, 0.26, 0.32, 0.95 * fade).lerp(Color(0.24, 0.20, 0.08, 0.96 * fade), active)
	var bot_c := Color(0.02, 0.08, 0.12, 0.95 * fade)
	draw_polygon(plate, PackedColorArray([top_c, top_c, bot_c, bot_c]))
	var y := cta.position.y + 3.0
	while y < cta.end.y:
		var k := (y - cta.position.y) / cta.size.y
		draw_line(Vector2(cta.position.x + skew * (1.0 - k) + 2, y), Vector2(cta.end.x + skew * (1.0 - k) - 2, y), Color(CYAN, 0.05 * fade), 1.0)
		y += 3.0
	var edge := plate.duplicate()
	edge.append(plate[0])
	var edge_c := Color(CYAN, (0.55 + glow * 0.35) * fade).lerp(Color(AMBER, fade), active)
	draw_polyline(edge, edge_c, 2.0)
	draw_line(plate[0] + Vector2(3, 2), plate[1] + Vector2(-3, 2), Color(1, 1, 1, 0.25 * fade), 1.0)
	# Animated chevrons feed into the label.
	var cy := cta.get_center().y
	for i in 3:
		var phase := fposmod(t * 1.6 - i * 0.22, 1.0)
		HoloUI.chevron(self, Vector2(cta.position.x + 22.0 + i * 9.0, cy), 6.0, Color(ORANGE, fade * (0.25 + 0.75 * (1.0 - phase))), 2.5)
	var label_font := BOLD_FONT if zh else _caps_font(BOLD_FONT)
	var label_c := Color(0.96, 1.0, 1.0, fade).lerp(Color(1.0, 0.94, 0.78, fade), active)
	HoloUI.glow_text(self, label_font, Vector2(cta.position.x + 58, cy + 7), I18n.t("title.launch"), 21, label_c, Color(CYAN, fade * (0.6 + active * 0.4)), HORIZONTAL_ALIGNMENT_LEFT, -1, 0.8)
	var key_w := BOLD_FONT.get_string_size("ENTER", HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x + 12.0
	HoloUI.keycap(self, BOLD_FONT, Vector2(cta.end.x - key_w - 10.0, cy - 11.0), "ENTER", 12, AMBER if active > 0.5 else HoloUI.INK, fade)
	# Selection cursor: bracket that slides onto the plate when it owns focus/hover.
	if active > 0.01:
		HoloUI.brackets(self, cta.grow(10.0 - 4.0 * active).grow_individual(0, 0, skew, 0), 10.0, Color(AMBER, active * fade), 2.0)
	# Arcade "press start" blink.
	var blink := 1.0 if fmod(t, 1.1) < 0.72 else 0.25
	_text(I18n.t("title.start_hint"), Vector2(LEFT, base.end.y + 30), 12, Color(0.60, 0.86, 0.92, blink * _ent(1.0)), _caps_font())

func _skew_rect(r: Rect2, skew: float) -> PackedVector2Array:
	return PackedVector2Array([r.position + Vector2(skew, 0), Vector2(r.end.x + skew, r.position.y), r.end, Vector2(r.position.x, r.end.y)])

func _draw_legend() -> void:
	var a := _ent(1.1)
	var x := LEFT
	var y := 566.0
	draw_line(Vector2(x, y - 12), Vector2(x + 340, y - 12), Color(0.30, 0.60, 0.70, 0.28 * a), 1.0)
	_text(I18n.t("controls.title"), Vector2(x, y + 6), 11, Color(CYAN, a), _caps_font())
	y += 18.0
	var kx := x
	for key: String in ["W", "A", "S", "D"]:
		kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, y), key, 12, HoloUI.INK, a) + 4.0
	_text(I18n.t("legend.move"), Vector2(kx + 6, y + 15), 13, Color(0.82, 0.84, 0.92, a), _caps_font())
	kx += 12.0 + _caps_font().get_string_size(I18n.t("legend.move"), HORIZONTAL_ALIGNMENT_LEFT, -1, 13).x + 14.0
	draw_circle(Vector2(kx - 7, y + 10), 2.0, Color(CYAN, 0.5 * a))
	_text(I18n.t("legend.autofire"), Vector2(kx + 2, y + 15), 13, Color(0.66, 0.70, 0.82, a), _caps_font())
	y += 30.0
	kx = x
	kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, y), "K", 12, AMBER, a) + 8.0
	_text(I18n.t("legend.laser"), Vector2(kx, y + 15), 13, Color(1.0, 0.80, 0.46, a), _caps_font())
	kx += _caps_font().get_string_size(I18n.t("legend.laser"), HORIZONTAL_ALIGNMENT_LEFT, -1, 13).x + 18.0
	kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, y), "L", 12, AMBER, a) + 8.0
	_text(I18n.t("legend.shield"), Vector2(kx, y + 15), 13, Color(1.0, 0.80, 0.46, a), _caps_font())
	_text(I18n.t("title.touch"), Vector2(x, y + 44), 12, Color(0.56, 0.58, 0.72, a), _caps_font())

func _draw_ship_callout() -> void:
	var a := _ent(0.6, 0.6)
	var c := ship_sprite.position
	# Target-lock frame breathing around the hero ship, plus a slow scanning ring.
	var breathe := sin(t * 2.2) * 4.0
	var lock := Rect2(c - Vector2(168, 92), Vector2(336, 184)).grow(breathe + (1.0 - a) * 40.0)
	HoloUI.brackets(self, lock, 22.0, Color(CYAN, 0.55 * a), 2.0)
	var ring_a := t * 0.35
	for i in 6:
		var start := ring_a + i * TAU / 6.0
		draw_arc(c, 176.0, start, start + 0.55, 12, Color(CYAN, 0.16 * a), 1.5)
	draw_line(Vector2(lock.position.x - 10, c.y), Vector2(lock.position.x + 8, c.y), Color(CYAN, 0.5 * a), 1.0)
	draw_line(Vector2(lock.end.x - 8, c.y), Vector2(lock.end.x + 10, c.y), Color(CYAN, 0.5 * a), 1.0)
	# Pilot nameplate.
	var plate := Rect2(SHIP_X - 186, 540, 372, 66)
	plate.position.y += (1.0 - a) * 20.0
	HoloUI.panel(self, plate, CYAN, 0.9 * a, 10.0, true, 10.0)
	_text(I18n.t("title.pilot"), Vector2(plate.position.x, plate.position.y + 28), 16, Color(0.86, 0.97, 1.0, a), _caps_font(), HORIZONTAL_ALIGNMENT_CENTER, plate.size.x)
	_text(I18n.t("title.enemy"), Vector2(plate.position.x, plate.position.y + 50), 12, Color(1.0, 0.58, 0.56, a), _caps_font(), HORIZONTAL_ALIGNMENT_CENTER, plate.size.x)

func _text(value: String, pos: Vector2, size: int, color: Color, font: Font = UI_FONT, align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_LEFT, width: float = -1) -> void:
	draw_string(font, pos, value, align, width, size, color)

func _fit_size(font: Font, value: String, size: int, max_width: float) -> int:
	while size > 24 and font.get_string_size(value, HORIZONTAL_ALIGNMENT_LEFT, -1, size).x > max_width:
		size -= 2
	return size

## Latin all-caps labels get modest tracking; Chinese stays untracked.
func _caps_font(base: Font = MEDIUM_FONT) -> Font:
	if I18n.get_locale() != "en":
		return base
	if not _tracked.has(base):
		# Duplicate an existing FontVariation: wrapping it would drop its wght axis.
		var tracked: FontVariation
		if base is FontVariation:
			tracked = (base as FontVariation).duplicate() as FontVariation
		else:
			tracked = FontVariation.new()
			tracked.base_font = base
		tracked.spacing_glyph = 1
		_tracked[base] = tracked
	return _tracked[base]

## Split a localized "LABEL {value}" string so the value can use the display face.
func _split_value(key: String, token: String) -> PackedStringArray:
	var marked := I18n.t(key, {token: "\u0001"})
	var parts := marked.split("\u0001")
	return PackedStringArray([parts[0].strip_edges(), parts[1].strip_edges() if parts.size() > 1 else ""])


func _lang_style(fill: Color, border: Color, width: int = 1) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(width)
	style.skew = Vector2(0.28, 0.0)
	style.content_margin_left = 6
	style.content_margin_right = 6
	return style


func _make_language_controls() -> void:
	var controller_accept := InputEventJoypadButton.new()
	controller_accept.button_index = JOY_BUTTON_A
	if not InputMap.action_has_event("ui_accept", controller_accept):
		InputMap.action_add_event("ui_accept", controller_accept)
	launch_button = Button.new()
	launch_button.name = "LaunchButton"
	launch_button.position = Vector2(LEFT, 412)
	launch_button.size = Vector2(328, 60)
	launch_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	# Drawn by _draw_launch_plate; focus is shown by the amber bracket cursor + halo.
	for state: String in ["normal", "hover", "pressed", "disabled", "focus"]:
		launch_button.add_theme_stylebox_override(state, StyleBoxEmpty.new())
	launch_button.pressed.connect(_start_game)
	add_child(launch_button)
	language_label = Label.new()
	language_label.position = Vector2(900, 28)
	language_label.size = Vector2(228, 32)
	language_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	language_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	language_label.add_theme_font_size_override("font_size", 11)
	language_label.add_theme_color_override("font_color", Color(0.62, 0.72, 0.80))
	language_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(language_label)
	var focus := _lang_style(Color.TRANSPARENT, AMBER, 2)
	focus.expand_margin_left = 3
	focus.expand_margin_right = 3
	focus.expand_margin_top = 3
	focus.expand_margin_bottom = 3
	for index: int in 2:
		var locale: String = ["en", "zh-CN"][index]
		var button := Button.new()
		button.name = "EnglishButton" if locale == "en" else "ChineseButton"
		button.text = "EN" if locale == "en" else "CN"
		button.tooltip_text = "English" if locale == "en" else "简体中文"
		button.accessibility_name = button.tooltip_text
		button.position = Vector2(1140 + index * 54, 30)
		button.size = Vector2(50, 28)
		button.toggle_mode = true
		button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		button.add_theme_font_override("font", DISPLAY_FONT)
		button.add_theme_font_size_override("font_size", 12)
		button.add_theme_color_override("font_color", Color(0.58, 0.76, 0.82))
		button.add_theme_color_override("font_hover_color", Color(0.94, 1.0, 1.0))
		button.add_theme_color_override("font_pressed_color", Color(0.06, 0.04, 0.02))
		button.add_theme_color_override("font_hover_pressed_color", Color(0.06, 0.04, 0.02))
		button.add_theme_color_override("font_focus_color", Color(0.94, 1.0, 1.0))
		button.add_theme_stylebox_override("normal", _lang_style(Color(0.02, 0.06, 0.10, 0.72), Color(CYAN, 0.45)))
		button.add_theme_stylebox_override("hover", _lang_style(Color(0.05, 0.18, 0.24, 0.92), Color(CYAN, 0.9)))
		button.add_theme_stylebox_override("pressed", _lang_style(Color(1.0, 0.72, 0.36, 0.95), AMBER))
		button.add_theme_stylebox_override("hover_pressed", _lang_style(Color(1.0, 0.80, 0.48, 1.0), AMBER))
		button.add_theme_stylebox_override("focus", focus.duplicate())
		button.pressed.connect(func(): I18n.set_locale(locale))
		add_child(button)
		language_buttons[locale] = button
	var english: Button = language_buttons["en"]
	var chinese: Button = language_buttons["zh-CN"]
	licenses_button = Button.new()
	licenses_button.name = "OpenSourceLicensesButton"
	licenses_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	# Quiet footer link: small, low-contrast, but with a visible focus ring.
	licenses_button.alignment = HORIZONTAL_ALIGNMENT_LEFT
	licenses_button.add_theme_font_size_override("font_size", 12)
	licenses_button.add_theme_color_override("font_color", Color(0.50, 0.54, 0.66))
	licenses_button.add_theme_color_override("font_hover_color", Color(0.86, 0.94, 1.0))
	licenses_button.add_theme_color_override("font_focus_color", Color(0.86, 0.94, 1.0))
	licenses_button.add_theme_color_override("font_pressed_color", Color(0.86, 0.94, 1.0))
	var link := StyleBoxFlat.new()
	link.bg_color = Color.TRANSPARENT
	link.content_margin_left = 8
	link.content_margin_right = 8
	var link_hover := link.duplicate() as StyleBoxFlat
	link_hover.bg_color = Color(0.10, 0.20, 0.26, 0.55)
	link_hover.set_corner_radius_all(3)
	var link_focus := link.duplicate() as StyleBoxFlat
	link_focus.border_color = AMBER
	link_focus.set_border_width_all(2)
	link_focus.draw_center = false
	for state: String in ["normal", "disabled"]:
		licenses_button.add_theme_stylebox_override(state, link)
	for state: String in ["hover", "pressed", "hover_pressed"]:
		licenses_button.add_theme_stylebox_override(state, link_hover)
	licenses_button.add_theme_stylebox_override("focus", link_focus)
	licenses_button.position = Vector2(LEFT - 8, 674)
	licenses_button.size = Vector2(220, 28)
	licenses_button.pressed.connect(OpenSourceLicenses.open.bind(self))
	add_child(licenses_button)
	var controls: Array[Button] = [launch_button, english, chinese, licenses_button]
	for index: int in controls.size():
		var next := controls[(index + 1) % controls.size()].get_path()
		var previous := controls[(index + controls.size() - 1) % controls.size()].get_path()
		controls[index].focus_next = next
		controls[index].focus_previous = previous
		controls[index].focus_neighbor_right = next
		controls[index].focus_neighbor_bottom = next
		controls[index].focus_neighbor_left = previous
		controls[index].focus_neighbor_top = previous
	language_notice = Label.new()
	language_notice.position = Vector2(748, 66)
	language_notice.size = Vector2(500, 35)
	language_notice.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	language_notice.add_theme_font_size_override("font_size", 13)
	language_notice.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(language_notice)
	launch_button.grab_focus()


func _on_locale_changed(locale: String) -> void:
	for choice: String in language_buttons:
		(language_buttons[choice] as Button).set_pressed_no_signal(choice == locale)
	licenses_button.text = I18n.t("ui.open_source_licenses")
	licenses_button.size = Vector2(MEDIUM_FONT.get_string_size(licenses_button.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x + 18, 28)
	licenses_button.tooltip_text = licenses_button.text
	licenses_button.accessibility_name = licenses_button.text
	language_label.text = I18n.t("language.label")
	language_label.add_theme_font_override("font", _caps_font())
	language_notice.text = "" if I18n.save_succeeded else I18n.t("language.session_only")
	launch_button.tooltip_text = I18n.t("title.launch")
	launch_button.accessibility_name = I18n.t("title.launch")
	_brand_size = mini(_fit_size(TITLE_FONT, I18n.t("title.brand_first"), 66, LOGO_WIDTH), _fit_size(TITLE_FONT, I18n.t("title.brand_second"), 66, LOGO_WIDTH))
	# Lockup centre: the Logo node scales around this point during the drop-in.
	logo.position = Vector2(LEFT - 2 + LOGO_WIDTH * 0.5, (184.0 - _brand_size * 0.74 + 184.0 + _brand_size + 6) * 0.5)
	logo.queue_redraw()
	queue_redraw()
