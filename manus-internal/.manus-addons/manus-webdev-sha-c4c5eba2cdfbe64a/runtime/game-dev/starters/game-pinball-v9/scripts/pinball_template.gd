extends "res://scripts/comet_observatory.gd"
const OpenSourceLicenses = preload("res://scripts/manus/open_source_licenses.gd")
## Template router: existing table/physics remain the playable foundation.
const Stages = preload("res://scripts/pinball_stages.gd")
const Leaderboard = preload("res://scripts/pinball_leaderboard.gd")
const Tutorial = preload("res://scripts/pinball_tutorial.gd")
var stages = Stages.new()
var standings = Leaderboard.new()
var tutorial = Tutorial.new()
var stage_index := 0
var baseline: Dictionary = {}
var stage_completed := false
var record_saved := false
var standings_baseline_only := false
var player_name := ""
var tutorial_version := 0
var input_method := "keyboard"
var modal := ""
var prior_focus: Control
var prior_focus_id := ""
var overlay: Control
var name_input: LineEdit
var status_label: Label
var filter_rect: ColorRect

func _ready() -> void:
	if configuration_override.is_empty() and stages.error.is_empty():
		configuration_override = stages.configuration(stage_index)
	super._ready()
	if sim == null: return
	if not stages.error.is_empty():
		state = "config_error"
		_show_dialog("configuration")
		return
	baseline = cfg.duplicate(true)
	TuningStore.configure_baseline(baseline)
	sim.launched.connect(func(): _tutorial_event("launch"))
	var layer := CanvasLayer.new()
	layer.layer = 10
	add_child(layer)
	filter_rect = ColorRect.new()
	filter_rect.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	filter_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var material := ShaderMaterial.new()
	material.shader = preload("res://shaders/arcade_filter.gdshader")
	filter_rect.material = material
	layer.add_child(filter_rect)
	TuningStore.value_changed.connect(func(_id, _requested, _active): _apply_tuning())
	_apply_tuning()
	_layout()

func _load_save() -> void:
	super._load_save()
	var file := ConfigFile.new()
	if file.load(SAVE_PATH) == OK:
		tutorial_version = int(file.get_value("game", "tutorial_version", 0))
		player_name = str(file.get_value("game", "player_name", ""))

func _save() -> void:
	super._save()
	if testing: return
	var file := ConfigFile.new()
	file.load(SAVE_PATH)
	file.set_value("game", "tutorial_version", tutorial_version)
	file.set_value("game", "player_name", player_name)
	file.save(SAVE_PATH)

func start_game() -> void:
	if not modal.is_empty(): _close_dialog()
	TuningStore.begin_run(tutorial_version < Tutorial.VERSION)
	_apply_tuning()
	super.start_game()
	run_score.stage_id = stages.definitions[stage_index].id
	run_score.configuration = JSON.stringify(cfg).sha256_text()
	run_score.eligible = TuningStore.is_ranked_eligible()
	stage_completed = false
	record_saved = false
	tutorial_open = false
	tutorial.start(tutorial_version >= Tutorial.VERSION)
	_layout()

func dismiss_tutorial() -> void:
	tutorial.skip()
	tutorial_open = false
	tutorial_seen = true
	tutorial_version = Tutorial.VERSION
	_save()
	_layout()

func _tutorial_event(kind: String) -> void:
	if tutorial.event(kind):
		if not tutorial.active:
			tutorial_version = Tutorial.VERSION
			_save()
		_layout()

func toggle_pause() -> void:
	if settings_open or not modal.is_empty(): return
	super.toggle_pause()
	if state == "paused": _tutorial_event("pause")

func _touch_press(action: String, down: bool) -> void:
	if down:
		TuningStore.apply_boundary("NEXT_ACTION")
		_apply_tuning()
	super._touch_press(action, down)

func _on_stage(index: int, bonus: int) -> void:
	TuningStore.apply_boundary("NEXT_STAGE")
	_apply_tuning()
	super._on_stage(index, bonus)

func _flipper_input(which: String, pressed: bool) -> void:
	if pressed:
		TuningStore.apply_boundary("NEXT_ACTION")
		_apply_tuning()
	super._flipper_input(which, pressed)
	if pressed: _tutorial_event("flip")

func _on_score(points: int, at: Vector2, kind: String) -> void:
	if state != "playing" or not run_score.result().is_empty(): return
	super._on_score(points, at, kind)
	if kind in ["bumper", "rollover", "bank"]: _tutorial_event("target")

func _physics_process(dt: float) -> void:
	if state != "playing" or tutorial_open or settings_open or not modal.is_empty(): return
	run_score.tick(dt)
	if tutorial.tick(dt):
		if not tutorial.active:
			tutorial_version = Tutorial.VERSION
			_save()
		_layout()
	if delay_next > 0 and delay_next <= dt:
		TuningStore.apply_boundary("NEXT_SPAWN")
		_apply_tuning()
	super._physics_process(dt)
	if state != "playing": return
	var definition: Dictionary = stages.definitions[stage_index]
	# Completing the mission sequence earns multiball; scoring its jackpot completes the stage.
	if rules.nova_count > 0 and rules.jackpots >= int(definition.jackpots) and rules.nova_time <= 0:
		_finish_run("victory")
	elif run_score.elapsed >= float(definition.time_limit):
		_finish_run("defeat")

func _on_drain() -> void:
	if state != "playing": return
	TuningStore.apply_boundary("NEXT_SPAWN")
	_apply_tuning()
	super._on_drain()
	if state == "gameover": _finish_run("defeat")

func _finish_run(outcome: String) -> void:
	if not run_score.result().is_empty(): return
	run_score.eligible = run_score.eligible and TuningStore.is_ranked_eligible()
	run_score.finish(outcome)
	TuningStore.end_run()
	stage_completed = outcome == "victory"
	state = "gameover"
	_release_inputs()
	best = maxi(best, score)
	best_chain_record = maxi(best_chain_record, rules.best_chain)
	tutorial.skip()
	_cue("game.victory" if stage_completed else "game.defeat")
	_save()
	_layout()

func _process(dt: float) -> void:
	if sim == null: return
	var was_reduced := reduced
	reduced = reduced or bool(TuningStore.get_active_value("ui.reduced_motion", false))
	var was_settings := settings_open
	settings_open = settings_open or not modal.is_empty()
	super._process(dt)
	settings_open = was_settings
	reduced = was_reduced
	if is_instance_valid(overlay):
		(overlay.get_meta("column") as Control).modulate.a = _entrance(0.08, 0.3)
		overlay.queue_redraw()
	if filter_rect != null:
		filter_rect.visible = bool(TuningStore.get_active_value("environment.filter.enabled", true))
		filter_rect.material.set_shader_parameter("strength", float(TuningStore.get_active_value("environment.filter.intensity", 0.18)))

func _input(event: InputEvent) -> void:
	if state == "title" and get_viewport().gui_get_focus_owner() == buttons.get("licenses") and event.is_action("ui_accept"):
		return
	if sim == null: return
	if not modal.is_empty():
		if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE: _close_dialog()
		return
	if settings_open:
		var close_requested := false
		if event is InputEventKey and event.pressed and not event.echo:
			close_requested = event.physical_keycode in [KEY_ESCAPE, KEY_P] or event.keycode in [KEY_ESCAPE, KEY_P]
		elif event is InputEventJoypadButton and event.pressed:
			close_requested = event.button_index == JOY_BUTTON_B
		if close_requested:
			_gesture()
			_cue("ui.cancel")
			_close_settings()
			get_viewport().set_input_as_handled()
		# Leave all other events unhandled for native sliders and buttons.
		return
	if event is InputEventJoypadButton:
		input_method = "gamepad"
		_gesture()
		if event.pressed and event.button_index == JOY_BUTTON_START: toggle_pause(); return
		if state != "playing" or settings_open or tutorial_open: return
		match event.button_index:
			JOY_BUTTON_LEFT_SHOULDER: _flipper_input("left", event.pressed)
			JOY_BUTTON_RIGHT_SHOULDER: _flipper_input("right", event.pressed)
			JOY_BUTTON_A: _touch_press("launch", event.pressed)
		return
	if event is InputEventScreenTouch: input_method = "touch"
	elif event is InputEventKey: input_method = "keyboard"
	# Mouse/touch control pads are separate from modal/UI controls.
	if event is InputEventKey and event.pressed and event.physical_keycode in [KEY_SPACE, KEY_DOWN, KEY_UP]:
		TuningStore.apply_boundary("NEXT_ACTION")
		_apply_tuning()
	super._input(event)

func _apply_tuning() -> void:
	if baseline.is_empty() or sim == null: return
	cfg = TuningStore.apply_to_config(baseline)
	for model in [sim] + extra_balls.map(func(entry): return entry.model):
		model.cfg = cfg.duplicate(true)
		model.table = model.cfg.table
		model.tuning = model.cfg.physics
		model.scores = model.cfg.scoring
	rules.cfg = cfg.duplicate(true)
	rules.missions = rules.cfg.missions
	run_score.eligible = run_score.eligible and TuningStore.is_ranked_eligible()
	comet_fx.density = float(TuningStore.get_active_value("environment.particles.density", 1.0))
	juice.intensity = float(TuningStore.get_active_value("environment.particles.density", 1.0))
	_apply_audio()

func _layout() -> void:
	super._layout()
	if sim == null: return
	if state == "title" and not settings_open:
		_button("standings", t("leaderboard.open"), Rect2(72,638,396,42) if compact else Rect2(916,790,324,45), func(): _show_dialog("standings"))
		_button("licenses", t("ui.open_source_licenses"), Rect2(72,692,396,42) if compact else Rect2(916,852,168,30), OpenSourceLicenses.open.bind(self))
		buttons.licenses.name = "OpenSourceLicensesButton"
		_quiet_footer_button(buttons.licenses)
	if state == "paused" and not settings_open:
		_button("restart", t("screen.restart"), Rect2(66,555,408,42) if compact else Rect2(437,565,406,42), func(): _show_dialog("restart"))
	if state == "gameover" and not settings_open:
		_button("record", t("leaderboard.saved") if record_saved else t("leaderboard.save"), Rect2(66,555,408,42) if compact else Rect2(437,565,406,42), func(): _show_dialog("record"))
		if stage_completed and stage_index + 1 < stages.definitions.size():
			buttons.primary.text = t("stage.next")
			for connection in buttons.primary.pressed.get_connections():
				if connection.callable != buttons.primary.get_meta("audio_press_handler", Callable()): buttons.primary.pressed.disconnect(connection.callable)
			buttons.primary.pressed.connect(_next_stage)
	if tutorial.active and state == "playing" and not settings_open:
		_button("skip", t("tutorial.skip"), Rect2(335,265,167,36) if compact else Rect2(57,837,268,36), dismiss_tutorial)
	if tutorial.active and compact:
		table_scale = minf(456.0/table_size.x, 615.0/table_size.y)
		table_origin = Vector2(42,309)+(Vector2(456,615)-table_size*table_scale)/2
	if buttons.has("how"):
		for connection in buttons.how.pressed.get_connections():
			if connection.callable != buttons.how.get_meta("audio_press_handler", Callable()): buttons.how.pressed.disconnect(connection.callable)
		buttons.how.pressed.connect(func(): tutorial_version = 0; tutorial_seen = true; start_game())
	if buttons.has("menu") and state == "paused":
		for connection in buttons.menu.pressed.get_connections():
			if connection.callable != buttons.menu.get_meta("audio_press_handler", Callable()): buttons.menu.pressed.disconnect(connection.callable)
		buttons.menu.pressed.connect(func(): _show_dialog("title"))
	if not modal.is_empty(): _build_dialog()

func _draw() -> void:
	var saved_reduced := reduced
	reduced = reduced or bool(TuningStore.get_active_value("ui.reduced_motion",false))
	super._draw()
	reduced = saved_reduced
	if sim == null: return
	draw_set_transform(origin, 0, Vector2.ONE * unit)
	if state in ["playing", "paused"]:
		_text(Vector2(31,170) if compact else Vector2(192,268), t("stage.timer_short" if compact else "stage.timer", {"seconds": maxi(0, int(stages.definitions[stage_index].time_limit - run_score.elapsed))}), 11, CYAN, false, not compact)
	if tutorial.active and state == "playing" and not settings_open and modal.is_empty():
		var box := Rect2(30,205,480,100) if compact else Rect2(40,687,303,194)
		cab.plate(self, box, "", LABEL_FONT, CYAN, Color("0a1c2c"))
		cab.nameplate(self, box.position+Vector2(16,-3), t("ui.how_to_play"), LABEL_FONT, 11)
		cab.lamp(self, Vector2(box.end.x-18, box.position.y+18), 5, CYAN, 0.6+0.4*sin(time*5.0) if not reduced else 1.0)
		# Drawing uses bounded lines; the translation owns its line breaks.
		var key: String = "tutorial." + Tutorial.STEPS[tutorial.step] + "." + input_method
		var lines := t(key).split("\n")
		for i in lines.size(): _text(box.position + Vector2(20,40+i*23), lines[i], 13, PALE)
	_paint_buttons()

func _quiet_footer_button(b: Button) -> void:
	# Secondary legal entry: a quiet text link, still focusable with a visible outline.
	b.add_theme_font_size_override("font_size", int(12*unit))
	b.add_theme_color_override("font_color", MUTED)
	b.add_theme_color_override("font_hover_color", PALE)
	b.add_theme_color_override("font_focus_color", PALE)
	b.alignment = HORIZONTAL_ALIGNMENT_CENTER if compact else HORIZONTAL_ALIGNMENT_LEFT
	# Painted as an underline that grows on hover/focus (see _paint_buttons).
	b.set_meta("cabinet_kind", "quiet")
	for style in ["normal","hover","pressed","focus","hover_pressed"]:
		var s := StyleBoxEmpty.new()
		s.content_margin_left = 2*unit
		b.add_theme_stylebox_override(style, s)

func _modal_buttons(text: String, callback: Callable) -> void:
	var y := 613 if compact else 495
	_button("primary", text, Rect2(66,y,408,58) if compact else Rect2(437,y,406,58), callback, true)
	_button("menu", t("ui.return_to_title"), Rect2(66,y+72,408,42) if compact else Rect2(437,y+124,406,42), func():
		tutorial.skip(); extra_balls.clear(); rules.reset(); juice.reset(); comet_fx.reset()
		nova_queued = false; state = "title"; sim.prepare_ball(); TuningStore.end_run(); _layout())

func _draw_modal(mode: String) -> void:
	var r := Rect2(40,280,460,490) if compact else Rect2(408,212,464,478)
	_modal_frame(r)
	var x := r.get_center().x
	var y := r.position.y if compact else 220.0
	var result := mode == "result"
	_glow_text(Vector2(x,y+50),t("result.victory" if stage_completed else "result.defeat") if result else t("ui.time_stands_still"),26,CYAN if stage_completed else GOLD,true,HEAD_FONT,0.9)
	if result:
		# Mission stars pop in one by one: the run's rank at a glance.
		var count: int = cfg.missions.size()
		for i in count:
			var k := _entrance(0.45+i*0.18, 0.3)
			var at := Vector2(x+(i-(count-1)*0.5)*28.0, y+74)
			_star(at, 8.5*_back(k), rules.stage > i or stage_completed)
	else:
		draw_line(Vector2(x-64,y+74),Vector2(x+64,y+74),Color(GOLD,0.45*draw_alpha),1,true)
		cab.bulb(self, Vector2(x,y+74), 3.0, 0.8)
	_text(Vector2(x,y+104),t("result.completed" if stage_completed else "result.retry") if result else t("ui.your_comet_will_be_right_here"),14,PALE,false,true)
	var face: Rect2 = cab.dmd_begin(self, Rect2(r.position.x+32,y+114,r.size.x-64,92))
	var shown := score
	if result and not reduced: shown = roundi(score*(1.0-pow(1.0-clampf((screen_time-0.35)/1.1,0,1),3.0)))
	cab.dmd_text(self, NUM_FONT, Vector2(x,face.end.y-15), _number(shown), 58, Cabinet.AMBER, true)
	cab.dmd_end(self, face)
	cab.dmd_text(self, BOLD, face.position+Vector2(12,19), t("ui.final_score" if result else "ui.current_score"), 11, Color(Cabinet.AMBER,0.85), false, 0.5)
	_text(Vector2(x,y+230),t("ui.best_s_d_hits_d_peak") % [_number(maxi(best,score)),hits,max_multiplier],12,PALE,false,true)
	_text(Vector2(x,y+253),t("ui.chain_d_skill_shots_d_jackpots_d") % [rules.best_chain,rules.skills,rules.jackpots],11,CYAN,true,true)
	_modal_frame_end()

func _star(at: Vector2, radius: float, lit: bool) -> void:
	if radius <= 0.5: return
	var pts := PackedVector2Array()
	for i in 10: pts.append(at+Vector2.from_angle(-PI/2+PI/5*i)*(radius if i%2==0 else radius*0.45))
	if lit:
		for k in 3: draw_circle(at, radius+3+k*4, Color(Cabinet.AMBER_HOT, 0.08*draw_alpha))
	draw_colored_polygon(pts, Color(Color("ffd27a") if lit else Color("2a3040"), draw_alpha))
	pts.append(pts[0])
	draw_polyline(pts, Color(Cabinet.BRASS_LO if lit else Color("5a6478"), draw_alpha), 1.2, true)

func _next_stage() -> void:
	var next = load("res://scenes/main.tscn").instantiate()
	next.stage_index = stage_index + 1
	get_parent().add_child(next)
	next.start_game()
	queue_free()

func _show_dialog(kind: String) -> void:
	_release_inputs()
	prior_focus = get_viewport().gui_get_focus_owner()
	prior_focus_id = ""
	for id in buttons:
		if buttons[id] == prior_focus:
			prior_focus_id = id
			break
	modal = kind
	_build_dialog()

func _close_dialog() -> void:
	modal = ""
	if is_instance_valid(overlay): overlay.queue_free()
	overlay = null
	_layout()
	if not prior_focus_id.is_empty() and buttons.has(prior_focus_id):
		buttons[prior_focus_id].grab_focus()
	elif prior_focus_id.is_empty() and is_instance_valid(prior_focus) and not prior_focus.is_queued_for_deletion():
		prior_focus.grab_focus()
	prior_focus = null
	prior_focus_id = ""

func _build_dialog() -> void:
	if is_instance_valid(overlay): overlay.queue_free()
	overlay = ColorRect.new()
	# The dim, brass frame and button art are painted in _paint_dialog.
	overlay.color = Color(0,0,0,0)
	overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	overlay.z_index = 50
	overlay.draw.connect(_paint_dialog)
	add_child(overlay)
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	var horizontal := maxi(24, int((get_viewport_rect().size.x - 660*unit)/2))
	for side in ["left","right"]: margin.add_theme_constant_override("margin_"+side,horizontal)
	margin.add_theme_constant_override("margin_top",int((80 if compact else 180)*unit))
	margin.add_theme_constant_override("margin_bottom",int(40*unit))
	overlay.add_child(margin)
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.follow_focus = true
	margin.add_child(scroll)
	var column := VBoxContainer.new()
	overlay.set_meta("column", column)
	overlay.set_meta("scroll", scroll)
	column.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	column.add_theme_constant_override("separation", int(18*unit))
	scroll.add_child(column)
	var title := Label.new()
	title.text = t("leaderboard.title" if modal == "standings" else ("leaderboard.save" if modal == "record" else "confirm."+modal))
	title.add_theme_font_override("font", HEAD_FONT)
	title.add_theme_font_size_override("font_size", int(28*unit))
	title.add_theme_color_override("font_color", PALE)
	title.add_theme_color_override("font_outline_color", Color("2a1a08"))
	title.add_theme_constant_override("outline_size", int(5*unit))
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	column.add_child(title)
	if modal == "standings":
		_dialog_button(column, t("leaderboard.filter_baseline" if standings_baseline_only else "leaderboard.filter_all"), func():
			standings_baseline_only = not standings_baseline_only
			_build_dialog())
		var rows: Array = standings.records.filter(func(row): return not standings_baseline_only or row.eligible)
		if rows.is_empty(): _dialog_label(column, t("leaderboard.empty_filter" if standings_baseline_only else "leaderboard.empty"))
		for i in rows.size():
			var row: Dictionary = rows[i]
			var stage_label: String = row.stage
			for definition in stages.definitions:
				if definition.id == row.stage: stage_label = t(definition.title_key)
			_dialog_label(column, t("leaderboard.row", {"rank": i+1,"name":row.name,"score":row.score,"stage":stage_label,"outcome":t("result."+row.outcome),"seconds":roundi(row.duration),"integrity":t("leaderboard.baseline" if row.eligible else "leaderboard.practice")}))
	elif modal == "record":
		_dialog_label(column, t("leaderboard.baseline" if run_score.result().get("eligible",false) else "leaderboard.practice"))
		name_input = LineEdit.new()
		name_input.text = player_name
		name_input.placeholder_text = t("leaderboard.name")
		name_input.max_length = 20
		name_input.custom_minimum_size.y = 48*unit
		for style in ["normal","focus"]:
			var field := StyleBoxFlat.new()
			field.bg_color = Color("050b16")
			field.border_color = CYAN if style == "focus" else GOLD.darkened(0.35)
			field.set_border_width_all(2)
			field.set_corner_radius_all(int(8*unit))
			field.content_margin_left = 14*unit
			field.shadow_color = Color(CYAN,0.25) if style == "focus" else Color(0,0,0,0)
			field.shadow_size = int(6*unit) if style == "focus" else 0
			name_input.add_theme_stylebox_override(style, field)
		name_input.add_theme_color_override("font_color", PALE)
		name_input.add_theme_color_override("caret_color", CYAN)
		column.add_child(name_input)
		_dialog_label(column, t("leaderboard.name_help"))
		status_label = Label.new()
		status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		column.add_child(status_label)
		_dialog_button(column, t("leaderboard.save"), _save_record)
	elif modal in ["restart", "title"]:
		_dialog_label(column, t("confirm.progress"))
		_dialog_button(column, t("confirm.accept"), func():
			var action := modal
			_close_dialog()
			if action == "restart": start_game()
			else:
				tutorial.skip(); extra_balls.clear(); rules.reset(); juice.reset(); comet_fx.reset()
				nova_queued = false; state = "title"; sim.prepare_ball(); TuningStore.end_run(); _layout())
	else: _dialog_label(column, t("error.configuration"))
	_dialog_button(column, t("screen.close"), _close_dialog)
	var controls: Array[Control] = []
	for child in column.get_children():
		if child is Button or child is LineEdit: controls.append(child)
	for i in controls.size():
		controls[i].focus_next = controls[i].get_path_to(controls[(i+1)%controls.size()])
		controls[i].focus_previous = controls[i].get_path_to(controls[(i-1+controls.size())%controls.size()])
	if not controls.is_empty(): controls[0].grab_focus()

func _dialog_label(column: VBoxContainer, text: String) -> void:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", maxi(16,int(18*unit)))
	label.add_theme_color_override("font_color", PALE)
	column.add_child(label)

func _dialog_button(column: VBoxContainer, text: String, action: Callable) -> void:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size.y = 48*unit
	button.add_theme_font_override("font", BOLD)
	button.add_theme_color_override("font_color", PALE)
	button.add_theme_color_override("font_hover_color", Color.WHITE)
	button.add_theme_color_override("font_focus_color", Color.WHITE)
	# Cabinet art is painted underneath by _paint_dialog.
	for style in ["normal","hover","pressed","focus","hover_pressed"]:
		button.add_theme_stylebox_override(style,StyleBoxEmpty.new())
	AudioDirector.register_button(button)
	button.pressed.connect(action)
	column.add_child(button)

## Dialog chrome: dim, brass backglass frame with chase bulbs, cabinet buttons.
func _paint_dialog() -> void:
	if not is_instance_valid(overlay): return
	var column: Control = overlay.get_meta("column")
	var scroll: Control = overlay.get_meta("scroll")
	var k := _entrance(0.0, 0.35)
	overlay.draw_rect(Rect2(Vector2.ZERO, overlay.size), Color(0.01,0.02,0.05,0.9*clampf(k*2.0,0,1)))
	var content := column.get_global_rect().intersection(scroll.get_global_rect())
	if content.size.y < 4: return
	overlay.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE*unit)
	cab.alpha = clampf(k*1.6, 0, 1)
	var frame := Rect2(content.position/unit, content.size/unit).grow_individual(46, 34, 46, 30)
	var face: Rect2 = cab.bezel(overlay, frame, 18, "brass", 11)
	cab.glass(overlay, face, 9, Color("0d1a30"), 0.7)
	cab.chase(overlay, frame.grow(-5.5), 18, attract_step, 1.0, reduced)
	for child in column.get_children():
		if child is Button:
			var b: Button = child
			var press := 1.0 if b.get_draw_mode() in [BaseButton.DRAW_PRESSED, BaseButton.DRAW_HOVER_PRESSED] else 0.0
			var rect := Rect2(b.get_global_rect().position/unit, b.size/unit)
			cab.button(overlay, rect, "secondary", 1.0 if b.is_hovered() else 0.0, press, 1.0 if b.has_focus(true) else 0.0, time)
	cab.alpha = 1.0

func _save_record() -> void:
	if record_saved:
		status_label.text = t("leaderboard.saved")
		return
	if not standings.valid_name(name_input.text, FONT):
		status_label.text = t("leaderboard.invalid_name")
		_cue("ui.invalid")
		return
	var error: Error = standings.add(name_input.text, run_score.result())
	if error != OK:
		status_label.text = t("leaderboard.save_error")
		return
	player_name = name_input.text
	record_saved = true
	_save()
	_close_dialog()
