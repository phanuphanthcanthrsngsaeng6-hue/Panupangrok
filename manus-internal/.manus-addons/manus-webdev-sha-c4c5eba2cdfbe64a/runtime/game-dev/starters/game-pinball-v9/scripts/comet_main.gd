extends Control
const TemplateConfig=preload("res://scripts/template_config.gd")
const Physics = preload("res://scripts/comet_physics.gd")
const PinballLocale = preload("res://scripts/pinball_locale.gd")
const FONT = preload("res://assets/template/fonts/ui_regular.tres")
const BOLD = preload("res://assets/template/fonts/ui_bold.tres")
# Display faces (titles, headings, section labels, score numerals); body copy uses the UI face.
const TITLE_FONT = preload("res://assets/template/fonts/display/comet_title.tres")
const TITLE_SMALL_FONT = preload("res://assets/template/fonts/display/comet_title_small.tres")
const HEAD_FONT = preload("res://assets/template/fonts/display/comet_heading.tres")
const LABEL_FONT = preload("res://assets/template/fonts/display/comet_label.tres")
const NUM_FONT = preload("res://assets/template/fonts/display/comet_number.tres")
const STATIC_BG = preload("res://assets/template/observatory/background-placeholder.webp")
const GEARS = preload("res://assets/template/mechanisms/bronze-gears/Cog Wheels - Gears/SpriteSheets/Bronze Gear Wheels/Gear 1 - Bronze_spritesheet.png")
const BG := Color("080f20")
const PANEL := Color("101f32")
const GOLD := Color("d4ad65")
const PALE := Color("f2deb0")
const MUTED := Color("8b9caf")
const CYAN := Color("73ede0")
const SAVE_PATH := "user://clockwork_comet.cfg"
var cfg:Dictionary={}
var sim
var configuration_override:Dictionary={}
var table_size:=Vector2(480,740)
var state := "title"
var run_score = preload("res://scripts/pinball_run.gd").new()
var locale_service = preload("res://scripts/pinball_locale.gd").new()
var score: int:
	get: return run_score.total
var best := 0
var balls := 3
var hits := 0
var max_multiplier := 1
var zh := false
var muted := false
var music_volume := 0.55
var sfx_volume := 0.8
var tutorial_seen := false
var tutorial_open := false
var settings_open := false
var return_state := "title"
var time := 0.0
var toast := ""
var toast_time := 0.0
var delay_next := 0.0
var trail: Array[Vector2] = []
var bursts: Array = []
var popups: Array = []
var touches := {}
var ui: Control
var layout_size := Vector2.ZERO
var compact := false
var unit := 1.0
var origin := Vector2.ZERO
var table_origin := Vector2(400, 104)
var table_scale := 1.0
var buttons := {}
var testing := false
var music_ready:=false
## Entrance fades multiply every UI draw (presentation only).
var draw_alpha := 1.0
var audio_requested:=false

func _ready() -> void:
	cfg=TemplateConfig.current() if configuration_override.is_empty() else configuration_override.duplicate(true)
	var errors:=TemplateConfig.last_errors if cfg.is_empty() else TemplateConfig.validate(cfg)
	if cfg.is_empty() or not errors.is_empty():
		state="config_error";set_process(false);set_physics_process(false)
		var label:=Label.new();label.position=Vector2(28,28);label.size=Vector2(850,600)
		label.add_theme_font_override("font",FONT);label.add_theme_font_size_override("font_size",18)
		label.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
		_load_save()
		label.text=t("error.configuration")
		add_child(label);push_error(label.text)
		if OS.has_feature("web"):JavaScriptBridge.eval("window.dispatchEvent(new Event('comet-title-ready'));",true)
		return
	sim=Physics.new(cfg);table_size=TemplateConfig.vec(cfg.table.size);balls=int(cfg.gameplay.balls)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	_load_save()
	locale_service.register_missions(cfg.missions)
	sim.scored.connect(_on_score)
	sim.drained.connect(_on_drain)
	sim.launched.connect(func(): _cue("player.action"); _message(t("ui.comet_in_flight")))
	_setup_audio()
	ui = Control.new()
	ui.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(ui)
	_layout()
	get_viewport().size_changed.connect(_layout)
	get_window().focus_exited.connect(_lost_focus)
	_message(t("ui.the_universe_is_in_your_hands"))

func t(key: String, placeholders: Dictionary = {}) -> String:
	return locale_service.t(key, placeholders, "zh_CN" if zh else "en")

func _load_save() -> void:
	var f := ConfigFile.new()
	var loaded := f.load(SAVE_PATH) == OK
	# A saved language choice wins; a first launch follows the OS/browser locale.
	zh = PinballLocale.resolve_zh(f, loaded, OS.get_locale())
	if not loaded: return
	best = int(f.get_value("game", "best", 0))
	muted = bool(f.get_value("settings", "muted", false))
	music_volume = float(f.get_value("settings", "music", 0.55))
	sfx_volume = float(f.get_value("settings", "sfx", 0.8))
	tutorial_seen = bool(f.get_value("game", "tutorial", false))

func _save() -> void:
	if testing: return
	var f := ConfigFile.new()
	f.set_value("game", "best", best)
	f.set_value("game", "tutorial", tutorial_seen)
	f.set_value("settings", "zh", zh)
	f.set_value("settings", "muted", muted)
	f.set_value("settings", "music", music_volume)
	f.set_value("settings", "sfx", sfx_volume)
	f.save(SAVE_PATH)

func _setup_audio() -> void:
	_apply_audio()

func _register_music(resource:AudioStreamOggVorbis)->void:
	if music_ready or resource==null:return
	resource.loop=true
	AudioDirector.register_stream("music.title",resource)
	AudioDirector.register_stream("music.gameplay",resource)
	music_ready=true
	if audio_requested:
		AudioDirector.play_music("music.gameplay")
		AudioDirector.set_music_suspended(state=="paused" or settings_open or tutorial_open)

func _apply_audio() -> void:
	AudioDirector.set_mix(muted, music_volume, sfx_volume)

func _cue(id: String, pitch := 1.0) -> void:
	AudioDirector.play_cue(id, pitch)

func _gesture() -> void:
	audio_requested=true
	AudioDirector.unlock_audio()
	if music_ready:AudioDirector.play_music("music.gameplay")

func start_game() -> void:
	_gesture()
	run_score.reset("observatory", JSON.stringify(cfg).sha256_text())
	balls = int(cfg.gameplay.balls)
	hits = 0
	max_multiplier = int(cfg.scoring.multiplier.initial)
	sim.reset_run()
	trail.clear()
	bursts.clear()
	popups.clear()
	delay_next = 0
	settings_open = false
	state = "playing"
	if not tutorial_seen:
		tutorial_open = true
	_message(t("ui.hold_space_then_release_to_launch"))
	_cue("ui.confirm")
	_layout()

func dismiss_tutorial() -> void:
	tutorial_open = false
	tutorial_seen = true
	_save()
	_layout()

func toggle_pause() -> void:
	if tutorial_open: return
	if state == "playing":
		state = "paused"
		_release_inputs()
	elif state == "paused":
		state = "playing"
	else: return
	_cue("game.pause")
	_layout()

func _lost_focus() -> void:
	_release_inputs()
	if state == "playing" and not testing:
		state = "paused"
		_layout()

func _release_inputs() -> void:
	sim.set_flipper("left", false)
	sim.set_flipper("right", false)
	sim.charging = false
	touches.clear()

func _on_score(points: int, at: Vector2, kind: String) -> void:
	run_score.award(kind, points)
	if points > 0:
		hits += 1
		popups.append({"pos":at, "text":"+%d" % points, "life":0.9})
		if popups.size() > 24: popups.pop_front()
	if bursts.size() < 24: bursts.append({"pos":at,"life":0.5,"color": CYAN if kind == "rollover" or kind == "save" else GOLD})
	if kind == "bumper" or kind == "sling": _cue("enemy.impact", 0.9 + float(hits % 4)*0.07)
	elif kind == "rollover": _cue("score.reward")
	elif kind == "multiplier":
		max_multiplier = sim.multiplier
		_cue("game.victory")
		_message(t("ui.orbit_complete_dx_multiplier") % sim.multiplier)
	elif kind == "save":
		_message(t("ui.ball_saved_one_more_chance"))
		_cue("score.reward")

func _on_drain() -> void:
	balls -= 1
	trail.clear()
	_cue("game.defeat" if balls <= 0 else "ball.drain")
	if balls <= 0:
		state = "gameover"
		best = maxi(best, score)
		_save()
		_layout()
	else:
		delay_next = cfg.gameplay.next_ball_delay
		_message(t("ui.comet_lost_d_balls_remain") % balls)

func _message(text: String) -> void:
	toast = text
	toast_time = 3.5

func _physics_process(dt: float) -> void:
	if state != "playing" or tutorial_open or settings_open: return
	if delay_next > 0:
		delay_next -= dt
		if delay_next <= 0:
			sim.prepare_ball()
			_message(t("ui.your_next_comet_is_ready"))
		return
	sim.tick(dt)
	if sim.live:
		trail.push_front(sim.pos)
		if trail.size() > 16: trail.pop_back()

func _process(dt: float) -> void:
	AudioDirector.set_music_suspended(state=="paused" or settings_open or tutorial_open)
	time += dt
	toast_time = maxf(0, toast_time-dt)
	if state != "paused" and not settings_open:
		for b in bursts: b.life -= dt
		bursts = bursts.filter(func(b): return b.life > 0)
		for p in popups: p.life -= dt; p.pos.y -= dt*32
		popups = popups.filter(func(p): return p.life > 0)
	queue_redraw()

func _input(event: InputEvent) -> void:
	if sim==null:return
	if event is InputEventKey and not event.echo:
		if event.pressed:
			_gesture()
			if event.physical_keycode == KEY_M:
				muted = not muted; _apply_audio(); _save(); _layout(); return
			if event.physical_keycode == KEY_ESCAPE or event.physical_keycode == KEY_P:
				if settings_open: _close_settings()
				elif tutorial_open: dismiss_tutorial()
				else: toggle_pause()
				return
			if event.physical_keycode == KEY_ENTER:
				if tutorial_open: dismiss_tutorial()
				elif state == "title" or state == "gameover": start_game()
				elif state == "paused": toggle_pause()
		if state != "playing" or tutorial_open or settings_open: return
		if event.physical_keycode in [KEY_LEFT]: _flipper_input("left", event.pressed)
		if event.physical_keycode in [KEY_RIGHT]: _flipper_input("right", event.pressed)
		if event.physical_keycode in [KEY_SPACE, KEY_DOWN]:
			if event.pressed: sim.begin_charge()
			elif delay_next <= 0: sim.release_plunger()
	if event is InputEventScreenTouch:
		var point: Vector2 = (event.position-origin)/unit
		if event.pressed and state == "playing" and not tutorial_open and not settings_open:
			var action := _touch_action(point)
			if action != "":
				touches[event.index] = action
				_touch_press(action, true)
		elif not event.pressed and touches.has(event.index):
			_touch_press(touches[event.index], false)
			touches.erase(event.index)
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		var point: Vector2 = (event.position-origin)/unit
		if event.pressed and state == "playing" and not tutorial_open and not settings_open:
			var action := _touch_action(point)
			if action != "": touches[-1] = action; _touch_press(action, true)
		elif not event.pressed and touches.has(-1):
			_touch_press(touches[-1], false); touches.erase(-1)

func _touch_action(p: Vector2) -> String:
	for action in ["left", "right", "launch"]:
		if _control_rect(action).has_point(p): return action
	return ""

func _touch_press(action: String, down: bool) -> void:
	_gesture()
	if action == "launch":
		if down: sim.begin_charge()
		elif delay_next <= 0: sim.release_plunger()
	else: _flipper_input(action, down)

func _flipper_input(which: String, pressed: bool) -> void:
	var was: bool = sim.left if which == "left" else sim.right
	sim.set_flipper(which, pressed)
	if pressed and not was: _cue("player.flipper", 1.1 if which == "left" else 1.2)

func _layout() -> void:
	var size_now := get_viewport_rect().size
	compact = size_now.x / size_now.y < 1.15
	layout_size = Vector2(540, 1080) if compact else Vector2(1280, 900)
	unit = minf(size_now.x/layout_size.x, size_now.y/layout_size.y)
	origin = (size_now - layout_size*unit)/2
	table_origin = Vector2(30, 183) if compact else Vector2(400, 103)
	table_scale = 1.0
	if ui == null: return
	for child in ui.get_children(): child.queue_free()
	buttons.clear()
	var w := layout_size.x
	var right := w-(40 if not compact else 36)
	_button("locale", t("ui.locale_cn") if zh else t("ui.locale_en"), Rect2(right-236,25,88,34), func(): zh = not zh; toast_time = 0; _save(); _layout())
	_locale_segments(buttons.locale)
	_button("mute", (t("ui.sound_off") if muted else t("ui.sound_on")), Rect2(right-140,25,92,34), func(): muted = not muted; _gesture(); _apply_audio(); _save(); _layout())
	_button("settings", t("ui.settings_icon"), Rect2(right-40,25,40,34), _open_settings)
	if state == "playing" or state == "paused":
		_button("pause", (t("ui.resume") if state == "paused" else t("ui.pause")), Rect2(36,25,98,34) if compact else Rect2(916,790,324,45), toggle_pause)
	if state == "title":
		var box := Rect2(72,508,396,68) if compact else Rect2(40,585,303,60)
		_button("start", t("ui.start_playing"), box, start_game, true)
		_button("how", t("ui.how_to_play"), Rect2(box.position+Vector2(0,80),Vector2(box.size.x,43)), func(): tutorial_open = true; _layout())
	if state == "paused" and not settings_open:
		_modal_buttons(t("ui.back_to_the_cosmos"), toggle_pause)
	if state == "gameover" and not settings_open:
		_modal_buttons(t("ui.play_again"), start_game)
	if tutorial_open and not settings_open:
		var y := 744 if compact else 662
		_button("tutorial", t("ui.got_it_let_s_play"), Rect2(65,y,410,54) if compact else Rect2(427,y,426,54), func():
			dismiss_tutorial()
			if state == "title": start_game()
		, true)
	if settings_open: _settings_widgets()
	queue_redraw()

func _modal_buttons(text: String, callback: Callable) -> void:
	var y := 685 if compact else 575
	_button("primary", text, Rect2(66,y,408,58) if compact else Rect2(437,y,406,58), callback, true)
	_button("menu", t("ui.return_to_title"), Rect2(66,y+72,408,42) if compact else Rect2(437,y+72,406,42), func(): state = "title"; sim.prepare_ball(); tutorial_open = false; _layout())

func _button(id: String, text: String, rect: Rect2, callback: Callable, primary := false) -> void:
	var b := Button.new()
	b.text = text
	b.position = origin + rect.position*unit
	b.size = rect.size*unit
	b.add_theme_font_override("font", BOLD)
	b.add_theme_font_size_override("font_size", int((18 if primary else 13)*unit))
	b.add_theme_color_override("font_color", BG if primary else PALE)
	b.add_theme_color_override("font_hover_color", BG if primary else Color.WHITE)
	b.add_theme_color_override("font_pressed_color", BG if primary else PALE)
	b.add_theme_color_override("font_focus_color", BG if primary else Color.WHITE)
	# Cabinet art (bezel, dome, lamp, focus cursor) is painted by the controller underneath.
	for style in ["normal","hover","pressed","focus","hover_pressed"]:
		b.add_theme_stylebox_override(style, StyleBoxEmpty.new())
	b.set_meta("cabinet_kind", "primary" if primary else "secondary")
	AudioDirector.register_button(b, id in ["menu", "settings-close"])
	b.pressed.connect(func(): _gesture(); callback.call())
	ui.add_child(b)
	buttons[id] = b

func _locale_segments(b: Button) -> void:
	# Two-state language switch: both options visible, the active one filled in brass.
	b.tooltip_text = b.text
	if b.has_method("set_accessibility_name"): b.set("accessibility_name", b.text)
	b.text = ""
	b.draw.connect(func():
		var half := b.size.x/2
		var pad := 3.0*unit
		var active := Rect2(Vector2(half if zh else 0,0)+Vector2.ONE*pad,Vector2(half,b.size.y)-Vector2.ONE*pad*2)
		var fill := StyleBoxFlat.new()
		fill.bg_color = Color("f3b54e")
		fill.set_corner_radius_all(int(5*unit))
		fill.shadow_color = Color(1.0,0.68,0.24,0.45)
		fill.shadow_size = int(5*unit)
		b.draw_style_box(fill,active)
		var font_size := int(12*unit)
		for i in 2:
			var label := "EN" if i == 0 else "中文"
			var on := (i == 1) == zh
			var width := BOLD.get_string_size(label,HORIZONTAL_ALIGNMENT_LEFT,-1,font_size).x
			var baseline := (b.size.y+BOLD.get_ascent(font_size)-BOLD.get_descent(font_size))/2
			b.draw_string(BOLD,Vector2(half*i+(half-width)/2,baseline),label,HORIZONTAL_ALIGNMENT_LEFT,-1,font_size,BG if on else MUTED))

func _open_settings() -> void:
	if settings_open: _close_settings(); return
	return_state = state
	settings_open = true
	_release_inputs()
	_layout()

func _close_settings() -> void:
	settings_open = false
	_save()
	_layout()

func _settings_widgets() -> void:
	var x := 85.0 if compact else 447.0
	var y := 442.0 if compact else 362.0
	for i in 2:
		var slider := HSlider.new()
		slider.position = origin+Vector2(x,y+100*i)*unit
		slider.size = Vector2(360,34)*unit
		slider.min_value = 0; slider.max_value = 1; slider.step = 0.01
		slider.value = music_volume if i == 0 else sfx_volume
		var k := i
		slider.value_changed.connect(func(value):
			if k == 0: music_volume = value
			else: sfx_volume = value
			_apply_audio(); _save(); _cue("ui.select"))
		slider.focus_entered.connect(func(): _cue("ui.focus"))
		slider.mouse_entered.connect(func(): _cue("ui.hover"))
		ui.add_child(slider)
	_button("settings-close",t("ui.done"),Rect2(x,y+214,360,54),_close_settings,true)

func _control_rect(action: String) -> Rect2:
	if compact:
		return {"left":Rect2(30,948,147,75),"launch":Rect2(189,948,162,75),"right":Rect2(363,948,147,75)}[action]
	return {"left":Rect2(400,849,147,42),"launch":Rect2(559,849,162,42),"right":Rect2(733,849,147,42)}[action]

func _draw() -> void:
	if sim==null:return
	draw_rect(Rect2(Vector2.ZERO,get_viewport_rect().size),BG)
	draw_set_transform(origin,0,Vector2.ONE*unit)
	draw_texture_rect(STATIC_BG,Rect2(Vector2.ZERO,layout_size),false,Color(0.18,0.25,0.42,0.25))
	draw_line(Vector2(35,78),Vector2(layout_size.x-35,78),Color("29374a"),1)
	if compact: _mobile_hud()
	else: _side_panels()
	draw_set_transform(origin+table_origin*unit,0,Vector2.ONE*unit*table_scale)
	_draw_table()
	draw_set_transform(origin,0,Vector2.ONE*unit)
	if state != "title" or not compact: _draw_controls()
	if state == "title" and compact:
		_card(Rect2(49,310,442,370),Color("0d1b2ded"),GOLD.darkened(0.4))
		_text(Vector2(270,362),t("brand.full") if zh else t("brand.space"),39,PALE,true,true)
		if not zh: _text(Vector2(270,410),t("brand.pinball"),48,PALE,true,true)
	if state == "paused" and not settings_open: _draw_modal("pause")
	if state == "gameover" and not settings_open: _draw_modal("result")
	if tutorial_open and not settings_open: _draw_tutorial()
	if settings_open: _draw_settings()

func _side_panels() -> void:
	_text(Vector2(38,206),t("brand.full") if zh else t("brand.space"),43,PALE,true)
	if not zh: _text(Vector2(38,262),t("brand.pinball"),58,PALE,true)
	if state != "title":
		_card(Rect2(40,585,303,94),PANEL,Color("354051"))
		_text(Vector2(61,617),t("ui.personal_best"),12,MUTED)
		_text(Vector2(61,656),_number(maxi(best,score)),30,PALE,true)
	_card(Rect2(916,104,324,151),PANEL,Color("304054"))
	_text(Vector2(939,139),t("ui.your_score"),13,MUTED)
	_text(Vector2(939,204),_number(score),49,PALE,true)
	_text(Vector2(939,234),t("ui.personal_best_21")+_number(maxi(score,best)),12,GOLD)
	_card(Rect2(916,271,156,102),PANEL,Color("304054"))
	_card(Rect2(1084,271,156,102),PANEL,Color("304054"))
	_text(Vector2(934,301),t("ui.balls_left"),12,MUTED)
	for i in int(cfg.gameplay.balls): _ball(Vector2(942+i*minf(32,110.0/maxi(1,int(cfg.gameplay.balls)-1)),337),6,1.0 if i<balls else 0.18)
	_text(Vector2(1103,301),t("ui.multiplier"),12,MUTED)
	_text(Vector2(1103,351),"%d×" % sim.multiplier,38,CYAN,true)
	_text(Vector2(916,425),t("ui.light_the_orbit"),16,PALE,true)
	_text(Vector2(916,456),t("ui.light_all_d_rollover_targets") % sim.ROLLERS.size(),14,MUTED)
	_text(Vector2(916,478),t("ui.to_boost_your_score_multiplier"),14,MUTED)
	for i in sim.ROLLERS.size():
		draw_circle(Vector2(939+i*52,516),13,Color("0d2934"))
		draw_arc(Vector2(939+i*52,516),13,0,TAU,32,CYAN if sim.roller_lit[i] else Color("50616c"),2,true)
		_text(Vector2(939+i*52,521),str(cfg.table.rollovers[i].label),12,CYAN if sim.roller_lit[i] else MUTED,true,true)
	draw_line(Vector2(916,557),Vector2(1240,557),Color("304054"),1)
	_text(Vector2(916,598),t("ui.the_controls"),12,GOLD)
	_text(Vector2(916,631),"←"+"        "+t("ui.left_flipper"),16,PALE)
	_text(Vector2(916,663),"→        "+t("ui.right_flipper"),16,PALE)
	_text(Vector2(916,695),"SPACE      "+t("ui.hold_release"),16,PALE)
	_text(Vector2(916,738),t("ui.p_esc_pause_m_mute"),13,MUTED)

func _mobile_hud() -> void:
	_label(Vector2(31,111),t("ui.your_score"),12,MUTED)
	_num(Vector2(29,157),_number(score),42,PALE)
	_label(Vector2(332,111),t("ui.balls"),12,MUTED)
	for i in int(cfg.gameplay.balls): _ball(Vector2(340+i*minf(27,78.0/maxi(1,int(cfg.gameplay.balls)-1)),143),minf(6,30.0/cfg.gameplay.balls),1 if i<balls else 0.2)
	_num(Vector2(458,150),"%d×" % sim.multiplier,32,CYAN)
	_text(Vector2(270,1055),t("ui.flippers_space_launch_p_pause"),11,MUTED,false,true)

func _surface_rect()->Rect2:
	var inset:Array=cfg.table.surface_inset
	return Rect2(Vector2(inset[0],inset[1]),table_size-Vector2(inset[0]+inset[2],inset[1]+inset[3]))

func _draw_table() -> void:
	var t:Dictionary=cfg.table
	_draw_table_frame()
	_draw_surface()
	var deco:Dictionary=t.decoration
	if deco.enabled:
		var center:=TemplateConfig.vec(deco.orbit_center)
		for radius in deco.orbit_radii:draw_arc(center,radius,0,TAU,96,Color(0.7,0.64,0.4,0.17),1,true)
		for i in 48:
			var direction:=Vector2.from_angle(float(i)/48*TAU)
			draw_line(center+direction*deco.ticks_radius,center+direction*(deco.ticks_radius+(6 if i%4==0 else 3)),Color(GOLD,0.28),1,true)
		for gear in deco.gears:
			var c:=TemplateConfig.vec(gear.position);var radius:float=gear.size/2.0
			draw_texture_rect_region(GEARS,Rect2(c-Vector2.ONE*radius,Vector2.ONE*radius*2),Rect2(0,0,43,43),Color(0.9,0.8,0.61,0.65))
		draw_arc(TemplateConfig.vec(deco.arch_center),deco.arch_radius,PI*1.07,PI*1.94,64,Color(GOLD,0.45),2,true)
		for arrow in deco.arrows:
			var c:=TemplateConfig.vec(arrow)
			draw_polyline(PackedVector2Array([c-Vector2(5,0),c+Vector2(0,5),c+Vector2(5,0)]),Color(GOLD,0.55),2,true)
	for wall in t.launcher.walls:_rail(TemplateConfig.vec(wall.a),TemplateConfig.vec(wall.b),wall.width)
	var spring:=TemplateConfig.vec(t.launcher.spring_anchor)
	for i in 11:
		var y:float=spring.y+i*(2.4-sim.charge*0.9)
		draw_line(Vector2(spring.x-11,y),Vector2(spring.x+11,y+2),GOLD.darkened(0.15),2,true)
	draw_line(spring+Vector2(-11,-6),spring+Vector2(11,-6),PALE,5,true)
	for rail in sim.rails:_rail(rail[0],rail[1],t.rail_radius*2-1)
	for i in sim.ROLLERS.size():
		var p:Vector2=sim.ROLLERS[i];var lit:bool=sim.roller_lit[i]
		var radius:float=t.rollovers[i].radius*0.74
		if lit:draw_circle(p,radius+9,Color(CYAN,0.10))
		draw_circle(p,radius,Color("08141f"))
		draw_arc(p,radius,0,TAU,40,CYAN if lit else GOLD.darkened(0.18),2,true)
		_text(p+Vector2(0,5),str(t.rollovers[i].label),13,CYAN if lit else PALE,true,true)
		draw_circle(p+Vector2(0,radius+12),3,CYAN if lit else Color("304658"))
	for i in sim.BUMPERS.size():_bumper(sim.BUMPERS[i],i)
	for sling in t.slingshots:
		var points:Array=[]
		for point in sling.outline:points.append(TemplateConfig.vec(point))
		_sling_art(points)
		draw_line(TemplateConfig.vec(sling.a),TemplateConfig.vec(sling.b),CYAN.darkened(0.2),3,true)
	_draw_bank_lamps()
	_num(TemplateConfig.vec(t.labels.multiplier),"%d×"%sim.multiplier,36,CYAN,true)
	_text(TemplateConfig.vec(t.labels.save),t("ui.ball_save") if state=="playing" and sim.save_left>0 else t("ui.timing_is_everything"),10,CYAN if sim.save_left>0 else MUTED,false,true)
	_flipper_art("left",sim.LEFT_PIVOT);_flipper_art("right",sim.RIGHT_PIVOT)
	for p in [Vector2(22,31),Vector2(table_size.x-25,31),Vector2(22,table_size.y-35),table_size-Vector2(25,35)]:
		draw_circle(p,4,Color("b59967"));draw_line(p+Vector2(-2,1),p+Vector2(2,-1),Color("4a3b2a"),1,true)
	_draw_live_balls()
	if state=="playing" and not tutorial_open:
		var message:=toast if toast_time>0 else (t("ui.hold_space_launch_to_charge") if not sim.live else "")
		if message!="":
			var area:=TemplateConfig.rect(t.labels.toast)
			_card(area,Color("08131dda"),Color("253f4b"),4)
			_text(area.position+Vector2(area.size.x/2,area.size.y/2+5),message,10,CYAN,false,true)

func _bumper(p: Vector2, index: int) -> void:
	var active: bool = sim.bumper_cool[index]>0
	draw_circle(p+Vector2(0,5),36,Color("050a12"))
	for i in 12:
		var a := float(i)/12*TAU+time*0.1*(1 if index%2 else -1)
		var n := Vector2.from_angle(a)
		draw_line(p+n*28,p+n*37,GOLD.darkened(0.42),8,true)
	draw_circle(p,32,GOLD.darkened(0.43))
	draw_arc(p,31,0,TAU,56,GOLD,3,true)
	draw_circle(p,25,Color("1c5560") if active else Color("133341"))
	draw_arc(p,23,0,TAU,48,CYAN if active else Color("708c84"),2,true)
	draw_arc(p,27,PI,TAU,28,PALE,2,true)
	draw_circle(p,15,Color("124858") if active else Color("0d2434"))
	# A compass-star centerpiece also reads as a mechanical contact cap.
	var pts := PackedVector2Array()
	for i in 8: pts.append(p+Vector2.from_angle(PI/4*i)*(11 if i%2==0 else 4))
	draw_colored_polygon(pts,CYAN if active else PALE)

func _sling_art(points: Array) -> void:
	var polygon := PackedVector2Array(points)
	draw_colored_polygon(polygon,Color("263c48"))
	polygon.append(polygon[0])
	draw_polyline(polygon,GOLD.darkened(0.2),5,true)
	draw_line(points[0],points[1],CYAN.darkened(0.2),3,true)

func _rail(a: Vector2,b: Vector2,width: float) -> void:
	draw_line(a+Vector2(0,4),b+Vector2(0,4),Color("050c18"),width+6,true)
	draw_line(a,b,GOLD.darkened(0.58),width+2,true)
	draw_line(a,b,GOLD,width-2,true)
	draw_line(a+Vector2(-1,-2),b+Vector2(-1,-2),PALE,width*0.18,true)

func _flipper_art(which: String,pivot: Vector2) -> void:
	var tip: Vector2 = sim.flipper_tip(which)
	var width:float=cfg.table.flippers[which].radius*2
	draw_line(pivot+Vector2(0,5),tip+Vector2(0,5),Color("040a14"),width+7,true)
	draw_line(pivot,tip,GOLD.darkened(0.58),width+4,true)
	draw_circle(pivot,width*0.62,GOLD.darkened(0.4)); draw_circle(tip,width*0.52,GOLD.darkened(0.4))
	draw_line(pivot,tip,GOLD,width-2,true)
	draw_line(pivot+Vector2(0,-5),tip+Vector2(0,-5),PALE,4,true)
	draw_line(pivot+Vector2(0,5),tip+Vector2(0,5),Color("9be8db"),4,true)
	draw_circle(pivot,7,Color("263943")); draw_circle(pivot,3,GOLD)

func _ball(p: Vector2,radius: float,alpha := 1.0) -> void:
	draw_circle(p+Vector2(2,3),radius+2,Color(0,0,0,0.5*alpha))
	draw_circle(p,radius,Color(Color("7b9fab"),alpha))
	draw_circle(p+Vector2(-1.2,-1.5),radius*0.78,Color(Color("d8eeea"),alpha))
	draw_circle(p+Vector2(-2,-3),radius*0.32,Color(Color.WHITE,alpha))
	draw_arc(p,radius-1,0,PI*0.8,16,Color(Color("2a5365"),alpha),2,true)

func _draw_table_frame() -> void:
	_card(Rect2(Vector2(-7,0),table_size+Vector2(14,0)),Color("020812"),Color("263747"),26)
	_card(Rect2(Vector2(0,-3),table_size-Vector2(0,2)),Color("322b27"),Color("967747"),26)
	_card(Rect2(Vector2(9,5),table_size-Vector2(18,18)),Color("0e2035"),GOLD.darkened(0.12),22)

func _draw_controls() -> void:
	for id in ["left","launch","right"]:
		var r := _control_rect(id)
		var down: bool = sim.left if id == "left" else (sim.right if id == "right" else sim.charging)
		_card(r,Color("284a50") if down else PANEL,GOLD.darkened(0.25) if down else Color("3a4757"),6)
		var text: String = {"left":t("ui.left"),"right":t("ui.right"),"launch":t("ui.launch")}[id]
		_text(r.position+Vector2(r.size.x/2,r.size.y/2+5),text,14,PALE,true,true)
		if id == "launch" and sim.charging:
			draw_rect(Rect2(r.position+Vector2(4,r.size.y-7),Vector2((r.size.x-8)*sim.charge,3)),CYAN)

func _draw_modal(mode: String) -> void:
	draw_rect(Rect2(Vector2.ZERO,layout_size),Color(0.01,0.03,0.07,0.74))
	var r := Rect2(40,308,460,500) if compact else Rect2(408,240,464,468)
	_card(r,Color("112338"),GOLD.darkened(0.2),14)
	var cx := r.get_center().x
	_text(Vector2(cx,r.position.y+51),(t("ui.take_a_breather") if mode=="pause" else t("ui.end_of_orbit")),12,GOLD,false,true)
	_text(Vector2(cx,r.position.y+108),(t("ui.time_stands_still") if mode=="pause" else t("ui.beautifully_played")),29,PALE,true,true)
	_text(Vector2(cx,r.position.y+153),(t("ui.your_comet_will_be_right_here") if mode=="pause" else t("ui.d_balls_one_journey_through_the_cosmos")) % cfg.gameplay.balls if mode!="pause" else t("ui.your_comet_will_be_right_here"),14,MUTED,false,true)
	_text(Vector2(cx,r.position.y+225),_number(score),49,CYAN,true,true)
	_text(Vector2(cx,r.position.y+257),(t("ui.final_score") if mode=="result" else t("ui.current_score")),11,MUTED,false,true)
	_text(Vector2(cx,r.position.y+298),t("ui.best_s_d_hits_d_peak") % [_number(maxi(best,score)),hits,max_multiplier],12,PALE,false,true)

func _draw_tutorial() -> void:
	draw_rect(Rect2(Vector2.ZERO,layout_size),Color(0.01,0.03,0.07,0.82))
	var r := Rect2(38,263,464,562) if compact else Rect2(398,188,484,558)
	_card(r,Color("112338"),GOLD,14)
	var x := r.position.x+31
	var y := r.position.y
	_text(Vector2(x,y+46),t("ui.a_30_second_flight_manual"),12,GOLD)
	_text(Vector2(x,y+98),t("ui.meet_your_machine"),29,PALE,true)
	var titles := [t("ui.01_wind_it_up"),t("ui.02_find_your_rhythm"),t("ui.03_light_the_orbit")]
	var lines := [[t("ui.hold_space_or_launch_to_charge"),t("ui.release_to_send_your_comet_into_orbit")],[t("ui.tap_or_to_flip"),t("ui.on_touchscreens_use_the_two_lower_pads")],[t("ui.light_all_rollovers_to_raise_the_multiplier"),t("ui.d_balls_and_1fs_ball_save") % [int(cfg.gameplay.balls),cfg.gameplay.ball_save_seconds]]]
	for i in 3:
		_text(Vector2(x,y+156+i*104),titles[i],15,PALE,true)
		_text(Vector2(x,y+185+i*104),lines[i][0],14,MUTED)
		_text(Vector2(x,y+207+i*104),lines[i][1],14,MUTED)

func _draw_settings() -> void:
	draw_rect(Rect2(Vector2.ZERO,layout_size),Color(0.01,0.03,0.07,0.84))
	var r := Rect2(45,287,450,490) if compact else Rect2(407,207,466,490)
	_card(r,Color("112338"),GOLD.darkened(0.2),14)
	_text(r.position+Vector2(39,55),t("ui.audio_settings"),23,PALE,true)
	_text(r.position+Vector2(39,107),t("ui.music"),13,GOLD)
	_text(r.position+Vector2(39,207),t("ui.sound_effects"),13,GOLD)
	_text(r.position+Vector2(39,298),t("ui.m_toggles_all_audio_your_settings_are_saved"),13,MUTED)

func _text(at: Vector2,text: String,size: int,color := PALE,bold := false,center := false,face: Font = null) -> void:
	var font: Font = face if face != null else (BOLD if bold else FONT)
	if center: at.x -= font.get_string_size(text,HORIZONTAL_ALIGNMENT_LEFT,-1,size).x/2
	color.a *= float(TuningStore.get_active_value("ui.hud.opacity",1.0))*draw_alpha
	draw_string(font,at,text,HORIZONTAL_ALIGNMENT_LEFT,-1,size,color)

func _label(at: Vector2,text: String,size: int,color := GOLD,center := false) -> void:
	_text(at,text,size,color,false,center,LABEL_FONT)

func _num(at: Vector2,text: String,size: int,color := PALE,center := false) -> void:
	_text(at,text,size,color,false,center,NUM_FONT)

func _head(at: Vector2,text: String,size: int,color := PALE,center := false) -> void:
	_text(at,text,size,color,false,center,HEAD_FONT)

func _title_lockup(at: Vector2,center := false,scale := 1.0) -> void:
	# Brass-and-starlight logo: tracked eyebrow word over an engraved display word.
	var x := at.x
	if zh:
		_engraved(Vector2(x,at.y+56*scale),t("brand.full"),int(54*scale),center,TITLE_FONT)
	else:
		_text(Vector2(x,at.y+4*scale),t("brand.space"),int(28*scale),GOLD,false,center,TITLE_SMALL_FONT)
		_engraved(Vector2(x,at.y+60*scale),t("brand.pinball"),int(54*scale),center,TITLE_FONT)
	var rule_y := at.y+82*scale
	var left := x-150*scale if center else x
	var right := x+150*scale if center else x+300*scale
	draw_line(Vector2(left,rule_y),Vector2(right,rule_y),Color(GOLD,0.55),1,true)
	var mid := Vector2((left+right)/2 if center else left+18*scale,rule_y)
	draw_colored_polygon(PackedVector2Array([mid+Vector2(0,-4),mid+Vector2(4,0),mid+Vector2(0,4),mid+Vector2(-4,0)]),GOLD)

func _engraved(at: Vector2,text: String,size: int,center: bool,face: Font) -> void:
	_text(at+Vector2(0,3),text,size,Color(0,0,0,0.55),false,center,face)
	_text(at+Vector2(0,1),text,size,GOLD.darkened(0.35),false,center,face)
	_text(at,text,size,PALE,false,center,face)

func _card(rect: Rect2,fill: Color,border: Color,radius := 9) -> void:
	var box := StyleBoxFlat.new()
	box.bg_color = fill
	box.border_color = border
	box.set_border_width_all(1)
	box.set_corner_radius_all(radius)
	draw_style_box(box,rect)

func _number(value: int) -> String:
	var s := str(value)
	var out := ""
	for i in s.length():
		if i>0 and (s.length()-i)%3==0: out += ","
		out += s[i]
	return out.pad_zeros(6) if value<1000 else out

func _draw_surface() -> void:
	draw_texture_rect(STATIC_BG,_surface_rect(),false,Color(0.25,0.35,0.55,0.22))

func _draw_bank_lamps() -> void:
	for bank in cfg.table.banks:
		var p:=TemplateConfig.vec(bank.position)
		var tangent:Vector2=TemplateConfig.vec(bank.normal).normalized().orthogonal()*bank.half_length
		draw_line(p-tangent,p+tangent,GOLD,bank.radius*2,true)

func _draw_live_balls() -> void:
	for i in range(trail.size()-1,0,-1):
		var alpha := (1-float(i)/16)*0.28
		draw_circle(trail[i],maxf(1,7-float(i)*0.32),Color(CYAN,alpha))
	if delay_next <= 0 and state != "gameover": _ball(sim.pos,sim.R)
	for b in bursts:
		var progress: float = 1-b.life/0.5
		var color: Color = b.color
		color.a = 1-progress
		draw_arc(b.pos,17+progress*35,0,TAU,32,color,2,true)
		for i in 8:
			var v := Vector2.from_angle(float(i)/8*TAU)
			draw_line(b.pos+v*(20+progress*24),b.pos+v*(27+progress*35),color,2,true)
	for p in popups: _text(p.pos,p.text,18,Color(PALE,p.life),true,true)
