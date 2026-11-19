extends Control
## Title screen v2: shares the loader's key art so the web loader hands off
## seamlessly, slams in the generated logo, runs ambient embers / smoke,
## kit-art buttons with spark bursts, a wipe transition into the mission,
## and a live "intel" chip that shows background stage streaming (Segments).

const ART := preload("res://assets/template/game/env/title_art.webp")
const LOGO := preload("res://assets/template/game/ui/logo.webp")
const HUD := preload("res://scripts/hud.gd")
const Licenses := preload("res://scripts/manus/open_source_licenses.gd")
const GAME_SCENE := "res://scenes/game.tscn"
const SAVE_PATH := "user://grapple_strike.cfg"
const LOGO_W := 620.0

var t := 0.0
var menu: VBoxContainer
var show_controls := false
var show_credits := false
var best := 0
var _starting := false
var _start_t := 0.0
var _slammed := false
var _shake := 0.0
var _flash := 0.0
var _embers: Array = []      # [pos, vel, life, max, size]
var _smoke: Array = []       # [pos, vel, life, max, size]
var _sparks: Array = []      # [pos, vel, life, max, col]
var _rings: Array = []       # [pos, t, max_r]
var _focus_btn: Button
var _license_button: Button


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR
	if has_node("/root/GameAudio"):
		GameAudio.begin_title()
	# The title is calm: start streaming Stage 2 (then 3) in the background now.
	if has_node("/root/Segments"):
		Segments.start()
	var cf := ConfigFile.new()
	if cf.load(SAVE_PATH) == OK:
		best = int(cf.get_value("best", "score", 0))
	menu = VBoxContainer.new()
	menu.add_theme_constant_override("separation", 12)
	menu.position = Vector2(92, 366)
	add_child(menu)
	var start := _button("START MISSION", start_game)
	_button("FIELD MANUAL", func():
		show_controls = not show_controls
		show_credits = false)
	_button("CREDITS", func():
		show_credits = not show_credits
		show_controls = false)
	if not OS.has_feature("web"):
		_button("QUIT", func(): get_tree().quit())
	_license_button = Button.new()
	_license_button.text = "OPEN SOURCE LICENSES"
	HUD.kit_button_style(_license_button, 20)
	_license_button.position = Vector2(506, 550)
	_license_button.size = Vector2(340, 44)
	_license_button.visible = false
	_license_button.pressed.connect(func(): Licenses.open(self))
	add_child(_license_button)
	start.grab_focus()
	for i in 40:
		_spawn_ember(true)


func _button(text: String, cb: Callable) -> Button:
	var b := Button.new()
	b.text = text
	HUD.kit_button_style(b, 26)
	b.custom_minimum_size = Vector2(340, 62)
	b.alignment = HORIZONTAL_ALIGNMENT_LEFT
	b.pressed.connect(func():
		_burst(b.global_position + Vector2(b.size.x * 0.5, b.size.y * 0.5), 26, UIKit.YELLOW)
		cb.call())
	b.mouse_entered.connect(func(): b.grab_focus())
	b.focus_entered.connect(func(): _on_focus(b))
	b.pivot_offset = Vector2(0, 31)
	menu.add_child(b)
	return b


func _on_focus(b: Button) -> void:
	if _focus_btn == b:
		return
	var first := _focus_btn == null
	_focus_btn = b
	if first:
		return
	if has_node("/root/GameAudio"):
		GameAudio.play_ui(&"ui_hover")
	_burst(b.global_position + Vector2(18, b.size.y * 0.5), 10, UIKit.ORANGE)
	var tw := create_tween()
	b.scale = Vector2(1.06, 1.06)
	tw.tween_property(b, "scale", Vector2.ONE, 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func start_game() -> void:
	if _starting:
		return
	_starting = true
	_start_t = 0.0
	_flash = 0.8
	_shake = 10.0
	_rings.append([Vector2(size.x * 0.5, size.y * 0.5), 0.0, 900.0])
	if has_node("/root/GameAudio"):
		GameAudio.play_ui(&"confirm")
	var tm := get_tree().create_timer(0.5)
	tm.timeout.connect(func(): get_tree().change_scene_to_file(GAME_SCENE))


func _process(delta: float) -> void:
	_license_button.visible = show_credits
	t += delta
	_start_t += delta
	_shake = maxf(0.0, _shake - delta * 30.0)
	_flash = maxf(0.0, _flash - delta * 2.4)
	# logo slam at 0.42s
	if not _slammed and t >= 0.42:
		_slammed = true
		_shake = 14.0
		_flash = 0.45
		var c := _logo_rect().get_center()
		_rings.append([c, 0.0, 520.0])
		_burst(c + Vector2(0, 60), 40, UIKit.YELLOW)
		for i in 10:
			_smoke.append([c + Vector2(randf_range(-260, 260), randf_range(40, 110)), Vector2(randf_range(-60, 60), randf_range(-30, -5)), 0.0, randf_range(1.0, 1.8), randf_range(40, 80)])
		GS.sfx(&"banner_slam")
	# ambient embers / smoke
	if randf() < delta * 22.0:
		_spawn_ember(false)
	if randf() < delta * 1.6:
		_smoke.append([Vector2(randf_range(0, size.x), size.y + 40), Vector2(randf_range(-10, 20), randf_range(-40, -18)), 0.0, randf_range(5.0, 8.0), randf_range(90, 160)])
	_step(_embers, delta, 0.0)
	_step(_smoke, delta, 0.0)
	_step(_sparks, delta, 900.0)
	for r in _rings:
		r[1] += delta
	_rings = _rings.filter(func(r): return r[1] < 0.6)
	queue_redraw()


func _step(list: Array, delta: float, grav: float) -> void:
	var i := list.size() - 1
	while i >= 0:
		var p: Array = list[i]
		p[2] += delta
		if p[2] >= p[3]:
			list.remove_at(i)
		else:
			p[1].y += grav * delta
			p[0] += p[1] * delta
		i -= 1


func _spawn_ember(anywhere: bool) -> void:
	var y := randf_range(0, size.y) if anywhere else size.y + 10.0
	_embers.append([Vector2(randf_range(0, maxf(size.x, 1280.0)), y), Vector2(randf_range(-20, 40), randf_range(-110, -50)), 0.0, randf_range(3.0, 7.0), randf_range(1.5, 3.8)])


func _burst(pos: Vector2, n: int, col: Color) -> void:
	for i in n:
		var a := randf() * TAU
		_sparks.append([pos, Vector2.from_angle(a) * randf_range(160, 520), 0.0, randf_range(0.25, 0.6), col])


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed(&"start") and not _starting and not show_controls and not show_credits:
		start_game()
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed(&"ui_cancel") and (show_controls or show_credits):
		show_controls = false
		show_credits = false
		get_viewport().set_input_as_handled()


func _logo_rect() -> Rect2:
	var h := LOGO_W * LOGO.get_height() / LOGO.get_width()
	return Rect2(60, 36, LOGO_W, h)


func _draw() -> void:
	var W := size.x
	var H := size.y
	var sh := Vector2(randf_range(-_shake, _shake), randf_range(-_shake, _shake)) * 0.5
	draw_set_transform(sh, 0.0, Vector2.ONE)
	# cover-fit key art with slow push-in + parallax sway
	var zoom := 1.03 + 0.015 * sin(t * 0.25)
	var s := maxf(W / ART.get_width(), H / ART.get_height()) * zoom
	var aw := ART.get_width() * s
	var ah := ART.get_height() * s
	draw_texture_rect(ART, Rect2((W - aw) * 0.5 + sin(t * 0.17) * 8.0, (H - ah) * 0.5, aw, ah), false)
	# smoke behind UI
	for p in _smoke:
		var k: float = p[2] / p[3]
		draw_circle(p[0], p[4] * (0.6 + k * 0.8), Color(0.12, 0.07, 0.05, 0.22 * sin(k * PI)))
	# left readability gradient + bottom strip
	for i in 26:
		var x := i * 26.0
		draw_rect(Rect2(x, 0, 26, H), Color(0.06, 0.03, 0.02, 0.7 * (1.0 - i / 26.0)))
	draw_rect(Rect2(0, H - 46, W, 46), Color(0.04, 0.02, 0.01, 0.78))
	draw_rect(Rect2(0, H - 46, W, 2), Color(UIKit.ORANGE, 0.6))
	# logo: drop + overshoot slam, then gentle breathing
	var lr := _logo_rect()
	var k2 := clampf(t / 0.42, 0.0, 1.0)
	var drop := lerpf(-lr.size.y - 40.0, 0.0, k2 * k2)
	var sc := 1.0 + (0.12 * exp(-(t - 0.42) * 9.0) if t > 0.42 else 0.25 * (1.0 - k2))
	sc *= 1.0 + 0.01 * sin(t * 1.8)
	var c := lr.get_center() + Vector2(0, drop)
	var sz := lr.size * sc
	draw_texture_rect(LOGO, Rect2(c - sz * 0.5 + Vector2(8, 10), sz), false, Color(0, 0, 0, 0.45))
	draw_texture_rect(LOGO, Rect2(c - sz * 0.5, sz), false)
	# glint sweep across the logo every 4s
	var gt := fmod(t, 4.0)
	if gt < 0.6 and t > 1.0:
		var gx := lerpf(lr.position.x - 80.0, lr.end.x + 80.0, gt / 0.6)
		draw_colored_polygon(PackedVector2Array([Vector2(gx, lr.position.y + 30), Vector2(gx + 40, lr.position.y + 30), Vector2(gx - 20, lr.end.y - 40), Vector2(gx - 60, lr.end.y - 40)]), Color(1, 1, 0.9, 0.16))
	UIKit.text(self, UIKit.BOLD, Vector2(100, lr.end.y + 20.0), "OPERATION: DUST FANG", 22, UIKit.CREAM, 5)
	# embers (additive-looking: bright core + halo)
	for p in _embers:
		var k: float = p[2] / p[3]
		var a := sin(k * PI)
		var ep: Vector2 = p[0] + Vector2(sin(t * 2.0 + p[4] * 3.0) * 6.0, 0)
		draw_circle(ep, p[4] * 2.6, Color(1.0, 0.45, 0.1, 0.12 * a))
		draw_circle(ep, p[4], Color(1.0, 0.8, 0.4, 0.85 * a))
	for p in _sparks:
		var k: float = p[2] / p[3]
		var col: Color = p[4]
		draw_line(p[0], p[0] - p[1] * 0.03, Color(col, 1.0 - k), 3.0)
	for r in _rings:
		var rk: float = r[1] / 0.6
		draw_arc(r[0], r[2] * ease(rk, 0.4), 0, TAU, 64, Color(1, 0.85, 0.5, 0.6 * (1.0 - rk)), 10.0 * (1.0 - rk) + 2.0)
	# controls strip
	var y := H - 16.0
	var x := 24.0
	for pair in [["A D", "move"], ["SPACE", "jump"], ["J", "shoot"], ["K", "grapple"], ["L", "grab / throw"], ["E", "item"], ["F", "FURY"], ["ESC", "pause"]]:
		x += UIKit.key(self, Vector2(x, y), pair[0], 14) + 6.0
		UIKit.text(self, UIKit.BOLD, Vector2(x, y), pair[1], 15, UIKit.CREAM, 4)
		x += UIKit.text_w(UIKit.BOLD, pair[1], 15) + 20.0
	_draw_intel(Vector2(W - 24, H - 62))
	if best > 0:
		var bs := "BEST  %07d" % best
		UIKit.text(self, UIKit.DISPLAY, Vector2(W - UIKit.text_w(UIKit.DISPLAY, bs, 22) - 26, H - 15), bs, 22, UIKit.YELLOW, 5)
	if show_controls:
		_draw_controls(Rect2(500, 120, 540, 520))
	if show_credits:
		_draw_credits(Rect2(480, 150, 720, 470))
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	if _flash > 0.0:
		draw_rect(Rect2(0, 0, W, H), Color(1, 0.9, 0.7, _flash * 0.6))
	if _starting:
		# diagonal hazard wipe into the mission
		var k3 := clampf(_start_t / 0.45, 0.0, 1.0)
		var wx := lerpf(-300.0, W + 300.0, ease(k3, 0.5))
		draw_colored_polygon(PackedVector2Array([Vector2(-300, 0), Vector2(wx + 200, 0), Vector2(wx, H), Vector2(-300, H)]), Color(0.05, 0.02, 0.01))
		draw_colored_polygon(PackedVector2Array([Vector2(wx + 200, 0), Vector2(wx + 240, 0), Vector2(wx + 40, H), Vector2(wx, H)]), UIKit.YELLOW)


## Background streaming status (proves the staggered loader is working).
func _draw_intel(anchor: Vector2) -> void:
	if not has_node("/root/Segments"):
		return
	var labels := [["stage2", "STAGE 2 INTEL"], ["stage3", "STAGE 3 INTEL"]]
	var txt := "ALL INTEL SECURED"
	var frac := 1.0
	for l in labels:
		if not Segments.is_ready(l[0]):
			frac = Segments.progress(l[0])
			txt = "%s  %d%%" % [l[1], int(frac * 100.0)]
			break
	var w := UIKit.text_w(UIKit.BOLD, txt, 14) + 44.0
	var r := Rect2(anchor.x - w, anchor.y - 24, w, 26)
	draw_rect(r, Color(0.05, 0.03, 0.02, 0.72))
	draw_rect(Rect2(r.position.x, r.end.y - 3, r.size.x * frac, 3), UIKit.YELLOW if frac < 1.0 else Color("#7ddc5a"))
	var blink := 0.5 + 0.5 * sin(t * 6.0) if frac < 1.0 else 1.0
	draw_circle(r.position + Vector2(14, 13), 4.0, Color(UIKit.YELLOW if frac < 1.0 else Color("#7ddc5a"), blink))
	UIKit.text(self, UIKit.BOLD, r.position + Vector2(26, 18), txt, 14, UIKit.CREAM, 3)


func _draw_credits(r: Rect2) -> void:
	UIKit.panel(self, r)
	UIKit.text(self, UIKit.DISPLAY, r.position + Vector2(26, 46), "CREDITS & LICENSES", 28, UIKit.YELLOW, 5)
	var lines := [
		["Game", "Side Scroller: original design; art, music, SFX and voice generated for this game."],
		["Engine", "Godot Engine (MIT License), godotengine.org/license"],
		["Fonts", "Black Ops One by James Grieshaber: SIL Open Font License 1.1"],
		["", "Chakra Petch by Cadson Demak: SIL Open Font License 1.1"],
		["Assets", "Kenney particle & smoke packs (CC0), kenney.nl"],
		["", "Impact SFX from the Manus game asset catalog (licenses bundled)."],
		["", "Full license texts are bundled with the game files.  ESC to close"],
	]
	var y := r.position.y + 96.0
	for ln in lines:
		if ln[0] != "":
			UIKit.text(self, UIKit.BOLD, Vector2(r.position.x + 26, y), ln[0].to_upper(), 16, UIKit.ORANGE, 4)
		UIKit.text(self, UIKit.BOLD, Vector2(r.position.x + 120, y), ln[1], 16, UIKit.CREAM, 4)
		y += 44.0


func _draw_controls(r: Rect2) -> void:
	UIKit.panel(self, r)
	UIKit.text(self, UIKit.DISPLAY, r.position + Vector2(26, 46), "FIELD MANUAL", 28, UIKit.YELLOW, 5)
	var rows := [
		["A / D", "Run left / right"], ["SPACE", "Jump  (S + SPACE drops through)"], ["J", "Shoot  -  knife when up close"],
		["W / S", "Aim up  /  crouch, aim down mid-air"], ["K", "Grapple: reel foes & props, zip to heavies"],
		["W + K", "Grapple upward / swing from rings"], ["L", "Grab object / mount MG nest  /  throw"],
		["E / Q", "Use item  /  switch item"], ["F", "FURY: unleash when the meter is full"], ["ESC", "Pause"],
	]
	var y := r.position.y + 92.0
	for row in rows:
		UIKit.key(self, Vector2(r.position.x + 26, y), row[0], 15)
		UIKit.text(self, UIKit.BOLD, Vector2(r.position.x + 140, y), row[1], 17, UIKit.CREAM, 4)
		y += 40.0
