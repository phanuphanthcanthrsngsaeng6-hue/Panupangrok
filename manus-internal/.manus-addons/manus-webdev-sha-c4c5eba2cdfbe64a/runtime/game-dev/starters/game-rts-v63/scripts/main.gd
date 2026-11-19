extends Node
## Campus Hero Defense: match flow, menus, audio/voice direction and service wiring.
## The battle HUD lives in HeroHud (scripts/ui/hud.gd); results + Hall of Fame in ResultsScreen.

const Catalog := preload("res://scripts/data/hero_catalog.gd")
const Map := preload("res://scripts/data/campus_map.gd")
const Loc := preload("res://scripts/services/localization.gd")
const TWEAK_CATALOG := preload("res://config/tweaks/catalog.gd")
const OpenSourceLicenses := preload("res://scripts/manus/open_source_licenses.gd")
const T := preload("res://scripts/ui/hero_theme.gd")

const STATE_TITLE := &"title"
const STATE_MATCH := &"match"
const STATE_RESULT := &"result"
const STATE_INTRO := &"intro"
const STORY_SAVE_PATH := "user://story.cfg"

const TITLE_ART := preload("res://assets/template/game/backgrounds/title_bg.webp")
const LOGO := preload("res://assets/template/game/ui/logo.png")

const DIFFICULTIES := {
	&"rookie": {"enemy_hp": 0.8, "enemy_speed": 0.95, "reputation": 1.25, "ai": 1},
	&"varsity": {"enemy_hp": 1.0, "enemy_speed": 1.0, "reputation": 1.0, "ai": 2},
	&"legend": {"enemy_hp": 1.25, "enemy_speed": 1.08, "reputation": 0.9, "ai": 3},
}
const HUD_REFRESH_SECONDS := 0.1
const COIN_THROTTLE := 0.12

var tweak_service: TweakService
var sim: RtsSimulation
var battlefield: Battlefield
var audio: AudioDirector
var hud: HeroHud
var results: ResultsScreen
var high_scores: HighScoreStore
var state: StringName = STATE_TITLE
var paused := false
var difficulty: StringName = &"varsity"
var reduced_motion := false
var touch_mode := false
## Test hook: forces the touch (mobile landscape) HUD regardless of the device.
var force_touch_layout := false

var _ui: Control
var _title: Control
var _title_logo: TextureRect
var _title_fx: FxLayer
var _title_timer := 0.0
var _help: Control
var _help_controls: Label
var _pause: Control
var _rotate: Control
var _filter: ColorRect
var _difficulty_buttons: Dictionary = {}
var _settings_checks: Dictionary = {}
var _title_sound: Button
var _play_button: Button
var intro: ComicIntro
var _intro_replay := false
var _hud_timer := 0.0
var _result_timer := -1.0
var _pending_result: StringName = &""
var _fonts: Dictionary = {}
var _hud_scale := 1.0
var _music_unlocked := false
var _combat_music: StringName = &"match"
var _coin_timer := 0.0
var _last_select_voice: StringName = &""
var _hitstop := 0.0
var _time := 0.0


func _ready() -> void:
	_fonts = T.fonts()
	high_scores = HighScoreStore.new()
	tweak_service = TweakService.new()
	tweak_service.name = "TweakService"
	add_child(tweak_service)
	tweak_service.setup()
	tweak_service.values_changed.connect(_on_tweak_values_changed)
	battlefield = Battlefield.new()
	battlefield.name = "Battlefield"
	add_child(battlefield)
	battlefield.visible = false
	battlefield.set_process(false)
	battlefield.selection_changed.connect(_on_selection_changed)
	battlefield.command_feedback.connect(_on_command_feedback)
	battlefield.hitstop_requested.connect(func(seconds: float) -> void:
		if not reduced_motion:
			_hitstop = maxf(_hitstop, seconds)
	)
	audio = AudioDirector.new()
	audio.name = "AudioDirector"
	add_child(audio)
	audio.world_event_filter = func(event: Dictionary) -> bool:
		var position: Variant = event.get("position", Vector2.INF)
		return position is Vector2 and battlefield.is_cell_on_screen(position)
	var layer := CanvasLayer.new()
	layer.name = "UiLayer"
	layer.layer = 10
	add_child(layer)
	_ui = Control.new()
	_ui.name = "UI"
	_ui.theme = T.build_theme()
	_ui.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(_ui)
	_build_hud()
	_build_title()
	_build_help()
	_build_pause()
	_build_results()
	_build_intro()
	_build_rotate_overlay()
	_filter = ColorRect.new()
	_filter.name = "YearbookFilter"
	_filter.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_filter.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_ui.add_child(_filter)
	_ui.resized.connect(_layout_ui)
	touch_mode = _detect_touch()
	_on_tweak_values_changed()
	_apply_touch_mode()
	_show_title()


func _detect_touch() -> bool:
	if force_touch_layout:
		return true
	return OS.has_feature("web_android") or OS.has_feature("web_ios") or OS.has_feature("mobile")


func set_touch_mode(on: bool) -> void:
	if touch_mode == on:
		return
	touch_mode = on
	_apply_touch_mode()


func _apply_touch_mode() -> void:
	if hud != null:
		hud.set_touch_layout(touch_mode)
	if _help_controls != null:
		_help_controls.text = Loc.t(&"help.controls_touch") if touch_mode else Loc.t(&"help.controls_body")
	_layout_ui()


func _layout_ui() -> void:
	if hud == null or _ui == null:
		return
	hud.scale = Vector2.ONE * _hud_scale
	hud.size = _ui.size / _hud_scale
	if _rotate != null:
		_rotate.visible = touch_mode and _ui.size.y > _ui.size.x * 1.05
	if _title_logo != null:
		var logo_w := minf(620.0, _ui.size.x * 0.62)
		_title_logo.custom_minimum_size = Vector2(logo_w, logo_w * 602.0 / 900.0)


# ================================================================ match flow

func _sim_values() -> Dictionary:
	var values := tweak_service.active_values().duplicate()
	var preset: Dictionary = DIFFICULTIES[difficulty]
	values[&"enemies.health.multiplier"] = float(values.get(&"enemies.health.multiplier", 1.0)) * float(preset["enemy_hp"])
	values[&"enemies.speed.multiplier"] = float(values.get(&"enemies.speed.multiplier", 1.0)) * float(preset["enemy_speed"])
	values[&"gameplay.resource.starting_multiplier"] = float(values.get(&"gameplay.resource.starting_multiplier", 1.0)) * float(preset["reputation"])
	values[&"enemies.ai.level"] = int(preset["ai"])
	return values


func start_match() -> void:
	if intro != null:
		intro.cancel()
	tweak_service.apply_boundary(TWEAK_CATALOG.NEXT_RUN)
	tweak_service.begin_run()
	sim = RtsSimulation.new()
	sim.set_tweak_values(_sim_values())
	sim.setup()
	sim.battle_notice.connect(_on_battle_notice)
	sim.match_ended.connect(_on_match_ended)
	sim.tweak_boundary_reached.connect(_on_tweak_boundary)
	battlefield.bind(sim)
	hud.sim = sim
	hud.battlefield = battlefield
	hud.minimap.sim = sim
	hud.minimap.battlefield = battlefield
	battlefield.visible = true
	battlefield.set_process(true)
	battlefield.input_enabled = true
	state = STATE_MATCH
	paused = false
	_pending_result = &""
	_result_timer = -1.0
	_combat_music = &"match"
	_last_select_voice = &""
	_title.visible = false
	results.visible = false
	_pause.visible = false
	_help.visible = false
	hud.visible = true
	hud.reset_objectives()
	hud.rebuild_context()
	hud.refresh()
	audio.set_music_state(&"match")
	_start_music()
	audio.play_voice(&"pa_welcome")
	hud.toast(Loc.t(&"notice.welcome"), T.GOLD)


func _process(delta: float) -> void:
	_time += delta
	if state == STATE_TITLE:
		_animate_title(delta)
	if state != STATE_MATCH or sim == null:
		return
	_coin_timer = maxf(0.0, _coin_timer - delta)
	if not paused:
		var scale := float(tweak_service.active_value(&"gameplay.time_scale"))
		if _hitstop > 0.0:
			_hitstop -= delta
			scale *= 0.08
		sim.advance(delta * scale)
	var events := sim.drain_events()
	if not events.is_empty():
		battlefield.handle_events(events)
		for event: Dictionary in events:
			audio.handle_simulation_event(event)
			_on_sim_event(event)
	_hud_timer -= delta
	if _hud_timer <= 0.0:
		_hud_timer = HUD_REFRESH_SECONDS
		hud.refresh()
	if _result_timer >= 0.0:
		_result_timer -= delta
		if _result_timer < 0.0:
			_show_result(_pending_result)


## Game-feel side effects of simulation events: voices, coin flights, HUD pulses, music.
func _on_sim_event(event: Dictionary) -> void:
	var type: StringName = event.get("type", &"")
	var position: Variant = event.get("pos", event.get("position", null))
	match type:
		&"rescued":
			hud.complete_objective(&"rescue")
			_coins_from(position, 5)
		&"bonus":
			_coins_from(position, 3)
		&"death":
			if int(event.get("team", -1)) == RtsSimulation.TEAM_ENEMY and _coin_timer <= 0.0:
				_coin_timer = COIN_THROTTLE
				_coins_from(position, 1)
		&"power":
			var kind: StringName = event.get("kind", &"")
			if kind != &"":
				audio.play_voice(StringName("%s_power" % kind))
		&"level_up":
			var level_kind: StringName = event.get("kind", &"")
			if level_kind != &"":
				audio.play_voice(StringName("%s_level" % level_kind))
				hud.celebrate_card(level_kind)
		&"wave":
			var index := int(event.get("index", sim.wave_index))
			audio.play_voice(&"pa_final" if index + 1 >= sim.total_waves() else &"pa_wave")
		&"secured":
			hud.complete_objective(&"secure")
			hud.pulse_stat("rooms")
			audio.play_voice(&"pa_room")
		&"queued":
			hud.complete_objective(&"train")
		&"trained":
			hud.pulse_stat("squad")
		&"wave_cleared":
			hud.complete_objective(&"wave")
		&"boss":
			_combat_music = &"boss"
			if not paused:
				audio.set_music_state(&"boss")
		&"surge":
			hud.complete_objective(&"surge")
			audio.play_voice(&"pa_surge")
			if not paused:
				audio.set_music_state(&"surge")
		&"surge_end":
			if not paused:
				audio.set_music_state(_combat_music)
		&"hall_hit":
			hud.pulse_spirit()


func _coins_from(position: Variant, count: int) -> void:
	if not (position is Vector2):
		return
	var cell: Vector2 = position
	if not battlefield.is_cell_on_screen(cell):
		return
	var screen := battlefield.world_to_screen(cell)
	hud.fly_coins(screen, count)


func _on_match_ended(result: StringName) -> void:
	_pending_result = result
	_result_timer = 2.0
	audio.play_outcome(result)
	battlefield.input_enabled = false
	battlefield.cancel_drag()
	var victory := result == &"victory"
	hud.banner(Loc.t(&"banner.victory") if victory else Loc.t(&"banner.defeat"), T.GOLD if victory else T.RED, &"burst" if victory else &"kaboom")


func _on_tweak_boundary(mode: StringName) -> void:
	tweak_service.apply_boundary(mode)
	if sim != null:
		sim.set_tweak_values(_sim_values())


func _on_tweak_values_changed() -> void:
	var values := tweak_service.active_values()
	reduced_motion = bool(values.get(&"ui.reduced_motion", false))
	audio.apply_tweak_values(values)
	if sim != null:
		sim.set_tweak_values(_sim_values())
	battlefield.reduced_motion = reduced_motion
	battlefield.zoom_multiplier = float(values.get(&"environment.camera.zoom", 1.0))
	if hud != null:
		hud.reduced_motion = reduced_motion
		if hud.fx != null:
			hud.fx.reduced_motion = reduced_motion
		hud.set_opacity(float(values.get(&"ui.hud.opacity", 100.0)) / 100.0)
		hud.set_muted(bool(values.get(&"audio.master.muted", false)))
		_hud_scale = float(values.get(&"ui.hud.scale", 1.0))
		_layout_ui()
	if results != null:
		results.reduced_motion = reduced_motion
	if _title_sound != null:
		_title_sound.text = Loc.t(&"hud.sound_off") if bool(values.get(&"audio.master.muted", false)) else Loc.t(&"hud.sound_on")
	if _filter != null:
		var intensity := float(values.get(&"environment.filter.intensity", 18.0)) / 100.0
		_filter.color = Color(0.55, 0.38, 0.16, intensity * 0.5)
		_filter.visible = bool(values.get(&"environment.filter.enabled", false)) and intensity > 0.0
	_sync_settings_checks()


# ================================================================ input

## Browsers only allow audio after a user gesture, so music starts on the first real input.
func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch and not touch_mode:
		set_touch_mode(true)
	elif touch_mode and event is InputEventMouseButton and event.is_pressed() and event.device != InputEvent.DEVICE_ID_EMULATION:
		set_touch_mode(false)
	if _music_unlocked:
		return
	var gesture := (event is InputEventMouseButton or event is InputEventKey or event is InputEventScreenTouch) and event.is_pressed()
	if gesture:
		_music_unlocked = true
		audio.unlock_music()


func _start_music() -> void:
	if _music_unlocked:
		audio.ensure_bgm()


func _unhandled_key_input(event: InputEvent) -> void:
	var key := event as InputEventKey
	if key == null or not key.pressed or key.echo:
		return
	if key.keycode == KEY_ESCAPE:
		if _help.visible:
			_close_help()
		elif state == STATE_MATCH and battlefield.attack_move_armed:
			battlefield.attack_move_armed = false
		elif state == STATE_MATCH and _result_timer < 0.0:
			_set_paused(not paused)
		get_viewport().set_input_as_handled()
		return
	if key.keycode == KEY_M:
		_toggle_mute()
		get_viewport().set_input_as_handled()
		return
	if state != STATE_MATCH or paused or sim == null or sim.result != &"":
		return
	var handled := true
	match key.keycode:
		KEY_E:
			_cmd_attack_move()
		KEY_C:
			battlefield.issue_stop()
		KEY_W, KEY_A, KEY_S, KEY_D:
			pass
		KEY_Q:
			_cmd_power()
		KEY_G:
			_cmd_surge()
		KEY_R:
			_cmd_rally()
		KEY_B:
			_cmd_bell()
		KEY_F:
			battlefield.select_all_heroes()
		KEY_H:
			_select_room(&"main_hall", true)
		KEY_T:
			_cmd_train()
		KEY_X:
			_cmd_cancel_training()
		KEY_SPACE:
			_focus_selection()
		KEY_PERIOD, KEY_I:
			if not battlefield.select_idle_hero():
				hud.toast(Loc.t(&"notice.no_idle"), T.MUTED)
		KEY_1, KEY_2, KEY_3, KEY_4, KEY_5:
			var slot := int(key.keycode - KEY_1) + 1
			if key.ctrl_pressed or key.meta_pressed:
				if battlefield.assign_group(slot):
					hud.toast(Loc.t(&"notice.group_set", {"slot": slot}), T.GOLD)
			else:
				battlefield.recall_group(slot)
		KEY_EQUAL, KEY_KP_ADD:
			battlefield.zoom_by(1.12)
		KEY_MINUS, KEY_KP_SUBTRACT:
			battlefield.zoom_by(1.0 / 1.12)
		_:
			handled = false
	if handled:
		get_viewport().set_input_as_handled()


# ================================================================ commands

func _on_hud_command(name: StringName) -> void:
	if name == &"mute":
		_toggle_mute()
		return
	if name == &"help":
		_show_help()
		return
	if name == &"pause":
		_set_paused(true)
		return
	if state != STATE_MATCH or paused or sim == null or sim.result != &"":
		return
	match name:
		&"bell":
			_cmd_bell()
		&"all":
			battlefield.select_all_heroes()
		&"power":
			_cmd_power()
		&"attack":
			_cmd_attack_move()
		&"stop":
			battlefield.issue_stop()
			audio.play_ui(&"ui_click")
		&"rally":
			_cmd_rally()
		&"train":
			_cmd_train()
		&"cancel_train":
			_cmd_cancel_training()
		&"surge":
			_cmd_surge()


func _cmd_attack_move() -> void:
	if battlefield.arm_attack_move():
		hud.toast(Loc.t(&"notice.attack_move_armed_touch") if touch_mode else Loc.t(&"notice.attack_move_armed"), T.GOLD)
	else:
		hud.toast(Loc.t(&"notice.select_heroes_first"), T.MUTED)
		audio.play_ui(&"ui_error")


func _cmd_power() -> void:
	if battlefield.selected.is_empty():
		hud.toast(Loc.t(&"notice.select_heroes_first"), T.MUTED)
		audio.play_ui(&"ui_error")
		return
	if battlefield.issue_power() == 0:
		hud.toast(Loc.t(&"notice.power_cooldown"), T.MUTED)
		audio.play_ui(&"ui_error")


func _cmd_surge() -> void:
	if sim.spirit_surge():
		hud.banner(Loc.t(&"banner.surge"), T.GOLD, &"burst")
		battlefield.focus_on(sim.building_center(&"main_hall"))
	else:
		audio.play_ui(&"ui_error")
		if sim.surge_timer <= 0.0:
			hud.toast(Loc.t(&"notice.hype_not_ready", {"percent": int(floor(sim.hype / RtsSimulation.HYPE_MAX * 100.0))}), T.MUTED)


func _cmd_rally() -> void:
	if sim.pep_rally():
		audio.play_ui(&"ui_confirm")
	else:
		audio.play_ui(&"ui_error")


func _cmd_bell() -> void:
	if sim.wave_spawning or sim.wave_index + 1 >= sim.total_waves():
		audio.play_ui(&"ui_error")
		return
	var bonus := sim.call_wave_early()
	hud.toast(Loc.t(&"notice.bell_early", {"amount": bonus}), T.GOLD)


func _cmd_train() -> void:
	var id := battlefield.selected_building
	if id == &"":
		id = &"main_hall"
	if sim.queue_training(id):
		audio.play_ui(&"ui_confirm")
		hud.rebuild_context()
	else:
		audio.play_ui(&"ui_error")


func _cmd_cancel_training() -> void:
	var id := battlefield.selected_building
	if id != &"" and sim.cancel_training(id):
		audio.play_ui(&"ui_cancel")
		hud.rebuild_context()


func _focus_selection() -> void:
	if not battlefield.selected.is_empty():
		var id: int = battlefield.selected[0]
		if sim.units.has(id):
			battlefield.focus_on(sim.units[id]["pos"])
	elif battlefield.selected_building != &"":
		battlefield.focus_on(sim.building_center(battlefield.selected_building))
	else:
		battlefield.focus_on(sim.building_center(&"main_hall"))


func _select_room(id: StringName, focus: bool) -> void:
	battlefield.select_building(id)
	if focus:
		battlefield.focus_on(sim.building_center(id))


func _on_card_pressed(kind: StringName, additive: bool, focus: bool) -> void:
	if state != STATE_MATCH or sim == null:
		return
	var count := battlefield.select_kind(kind, additive)
	if count == 0:
		for room_id: StringName in Catalog.ROOMS:
			if Catalog.ROOMS[room_id]["trains"] == kind:
				_select_room(room_id, true)
				break
		audio.play_ui(&"ui_click")
		return
	if focus:
		battlefield.focus_kind(kind)


func _on_room_pressed(id: StringName, focus: bool) -> void:
	if state != STATE_MATCH or sim == null:
		return
	_select_room(id, focus)
	audio.play_ui(&"ui_click")


func _set_paused(value: bool) -> void:
	if state != STATE_MATCH or sim == null or sim.result != &"" or _result_timer >= 0.0:
		return
	paused = value
	_pause.visible = paused
	battlefield.input_enabled = not paused
	battlefield.cancel_drag()
	var music := _combat_music
	if sim != null and sim.surge_timer > 0.0:
		music = &"surge"
	audio.set_music_state(&"paused" if paused else music)
	audio.play_ui(&"ui_click" if paused else &"ui_cancel")


func _show_help() -> void:
	if state == STATE_MATCH:
		if sim == null or sim.result != &"" or _result_timer >= 0.0:
			return
		if not paused:
			_set_paused(true)
	_pause.visible = false
	_help.visible = true
	audio.play_ui(&"ui_click")


func _close_help() -> void:
	_help.visible = false
	_pause.visible = state == STATE_MATCH and paused and sim != null and sim.result == &""
	audio.play_ui(&"ui_cancel")


func _toggle_mute() -> void:
	var muted := not bool(tweak_service.requested_value(&"audio.master.muted"))
	tweak_service.set_requested(&"audio.master.muted", muted)


func _on_command_feedback(cue: StringName) -> void:
	audio.play_ui(cue)
	if cue in [&"order_move", &"order_attack"]:
		_on_tweak_boundary(TWEAK_CATALOG.NEXT_ACTION)
		hud.complete_objective(&"move")


func _on_selection_changed() -> void:
	if state != STATE_MATCH or sim == null:
		return
	if not battlefield.selected.is_empty():
		hud.complete_objective(&"select")
		var first: Dictionary = sim.units.get(battlefield.selected[0], {})
		if not first.is_empty():
			var kind: StringName = first["kind"]
			if kind != _last_select_voice:
				_last_select_voice = kind
				audio.play_voice(StringName("%s_select" % kind))
	else:
		_last_select_voice = &""
	hud.rebuild_context()
	hud.refresh()


func _on_battle_notice(key: StringName, values: Dictionary, team: int) -> void:
	var color := T.GOLD if team == RtsSimulation.TEAM_PLAYER else T.RED
	if key in [&"notice.need_reputation", &"notice.squad_full", &"notice.queue_full", &"notice.room_not_secured", &"notice.rally_cooldown"]:
		color = T.MUTED
	hud.toast(Loc.t(key, values), color)
	match key:
		&"notice.wave_incoming":
			hud.banner(Loc.t(&"banner.wave", {"wave": int(values.get("wave", 1))}), T.RED, &"warning")
		&"notice.wave_cleared":
			hud.banner(Loc.t(&"banner.cleared"), T.GOLD, &"burst")
		&"notice.boss":
			hud.banner(Loc.t(&"banner.boss"), T.RED, &"kaboom")


# ================================================================ HUD

func _build_hud() -> void:
	hud = HeroHud.new()
	hud.name = "Hud"
	hud.visible = false
	_ui.add_child(hud)
	hud.command.connect(_on_hud_command)
	hud.card_pressed.connect(_on_card_pressed)
	hud.room_pressed.connect(_on_room_pressed)
	hud.ui_cue.connect(func(cue: StringName) -> void: audio.play_ui(cue))
	hud.coin_arrived.connect(func() -> void: audio.play_ui(&"coin"))
	hud.minimap.focus_requested.connect(func(cell: Vector2) -> void: battlefield.focus_on(cell, true))
	hud.minimap.command_requested.connect(func(cell: Vector2) -> void: battlefield.command_selected_to(cell, false))
	battlefield.ui_blockers = hud.blockers()


# ================================================================ title

func _build_title() -> void:
	_title = Control.new()
	_title.name = "TitleScreen"
	_title.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_ui.add_child(_title)
	var art := TextureRect.new()
	art.texture = TITLE_ART
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	art.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_title.add_child(art)
	var shade := TextureRect.new()
	var gradient := Gradient.new()
	gradient.set_color(0, Color(0.07, 0.04, 0.08, 0.0))
	gradient.set_color(1, Color(0.07, 0.04, 0.08, 0.85))
	var gradient_texture := GradientTexture2D.new()
	gradient_texture.gradient = gradient
	gradient_texture.fill_from = Vector2(0.5, 0.45)
	gradient_texture.fill_to = Vector2(0.5, 1.0)
	shade.texture = gradient_texture
	shade.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_title.add_child(shade)
	_title_fx = FxLayer.new()
	_title_fx.screen_space = true
	_title.add_child(_title_fx)
	var column := VBoxContainer.new()
	column.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	column.offset_top = 10
	column.offset_bottom = -18
	column.alignment = BoxContainer.ALIGNMENT_END
	column.add_theme_constant_override("separation", 8)
	_title.add_child(column)
	_title_logo = TextureRect.new()
	_title_logo.texture = LOGO
	_title_logo.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	_title_logo.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	_title_logo.custom_minimum_size = Vector2(560, 375)
	_title_logo.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	_title_logo.size_flags_vertical = Control.SIZE_EXPAND_FILL
	_title_logo.mouse_filter = Control.MOUSE_FILTER_IGNORE
	column.add_child(_title_logo)
	var tagline := T.label(Loc.t(&"title.tagline"), 19, T.PAPER, "black", 6)
	tagline.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	column.add_child(tagline)
	var difficulty_row := HBoxContainer.new()
	difficulty_row.alignment = BoxContainer.ALIGNMENT_CENTER
	difficulty_row.add_theme_constant_override("separation", 8)
	column.add_child(difficulty_row)
	for id: StringName in [&"rookie", &"varsity", &"legend"]:
		var button := T.button(Loc.t(StringName("difficulty.%s" % id)), Loc.t(StringName("difficulty.%s.tooltip" % id)), T.PAPER, 15)
		button.custom_minimum_size = Vector2(150, 48)
		button.pressed.connect(func() -> void:
			difficulty = id
			_sync_difficulty_buttons()
			audio.play_ui(&"ui_confirm")
			_title_fx.preset(&"ui_pop", _control_center(button), 1.0)
		)
		button.mouse_entered.connect(func() -> void: audio.play_ui(&"ui_hover"))
		difficulty_row.add_child(button)
		_difficulty_buttons[id] = button
	_sync_difficulty_buttons()
	_play_button = T.button(Loc.t(&"title.play"), Loc.t(&"title.play_tooltip"), T.MAROON, 28)
	_play_button.name = "PlayButton"
	_play_button.custom_minimum_size = Vector2(340, 70)
	_play_button.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	_play_button.add_theme_font_override("font", _fonts["display"])
	_play_button.pressed.connect(func() -> void:
		audio.play_ui(&"ui_confirm")
		_title_fx.preset(&"confetti", _control_center(_play_button), 1.4)
		_begin_from_title()
	)
	_play_button.mouse_entered.connect(func() -> void: audio.play_ui(&"ui_hover"))
	column.add_child(_play_button)
	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_theme_constant_override("separation", 8)
	column.add_child(row)
	var how := T.button(Loc.t(&"title.how"), "", T.PAPER, 15)
	how.pressed.connect(func() -> void:
		_start_music()
		_show_help()
	)
	row.add_child(how)
	var story := T.button(Loc.t(&"title.story"), Loc.t(&"title.story_tooltip"), T.GOLD, 15)
	story.name = "StoryButton"
	story.pressed.connect(func() -> void:
		_start_music()
		audio.play_ui(&"ui_click")
		_play_intro(true)
	)
	row.add_child(story)
	var fame := T.button(Loc.t(&"title.hall_of_fame"), Loc.t(&"title.hall_of_fame_tooltip"), T.GOLD, 15)
	fame.name = "HallOfFameButton"
	fame.pressed.connect(func() -> void:
		_start_music()
		audio.play_ui(&"ui_click")
		results.show_table(difficulty)
	)
	row.add_child(fame)
	_title_sound = T.button(Loc.t(&"hud.sound_on"), Loc.t(&"hud.mute_tooltip"), T.PAPER, 15)
	_title_sound.pressed.connect(func() -> void:
		_start_music()
		_toggle_mute()
	)
	row.add_child(_title_sound)
	var licenses := T.button(Loc.t(&"ui.open_source_licenses"), "", T.PAPER, 13)
	licenses.pressed.connect(func() -> void: OpenSourceLicenses.open(self))
	row.add_child(licenses)
	for button: Button in [how, story, fame, _title_sound, licenses]:
		button.custom_minimum_size = Vector2(0, 46)
		button.mouse_entered.connect(func() -> void: audio.play_ui(&"ui_hover"))
	_title.gui_input.connect(func(event: InputEvent) -> void:
		if event is InputEventMouseButton and (event as InputEventMouseButton).pressed:
			_start_music()
	)


# ================================================================ comic intro

func _build_intro() -> void:
	intro = ComicIntro.new()
	intro.name = "ComicIntro"
	intro.audio = audio
	intro.finished.connect(_on_intro_finished)
	_ui.add_child(intro)


## First press of Defend the School plays the comic; afterwards it goes straight into the match.
func _begin_from_title() -> void:
	if intro_seen():
		start_match()
	else:
		_play_intro(false)


func _play_intro(replay: bool) -> void:
	_intro_replay = replay
	state = STATE_INTRO
	_title.visible = false
	_help.visible = false
	results.visible = false
	audio.set_music_state(&"intro")
	_start_music()
	intro.play(touch_mode, reduced_motion)


func _on_intro_finished(_skipped: bool) -> void:
	_mark_intro_seen()
	if _intro_replay:
		_show_title()
	else:
		start_match()


static func intro_seen() -> bool:
	var config := ConfigFile.new()
	if config.load(STORY_SAVE_PATH) != OK:
		return false
	return bool(config.get_value("story", "intro_seen", false))


func _mark_intro_seen() -> void:
	var config := ConfigFile.new()
	config.load(STORY_SAVE_PATH)
	config.set_value("story", "intro_seen", true)
	config.save(STORY_SAVE_PATH)


func _control_center(control: Control) -> Vector2:
	var global_center := control.get_global_transform_with_canvas() * (control.size * 0.5)
	return _title_fx.get_global_transform_with_canvas().affine_inverse() * global_center


func _animate_title(delta: float) -> void:
	if _title_logo != null and not reduced_motion:
		_title_logo.pivot_offset = _title_logo.size * 0.5
		_title_logo.scale = Vector2.ONE * (1.0 + 0.015 * sin(_time * 1.8))
		_title_logo.rotation = 0.012 * sin(_time * 1.1)
	_title_timer -= delta
	if _title_timer > 0.0 or _title_fx == null:
		return
	_title_timer = 0.35
	var view := _ui.size
	if randf() < 0.55:
		var start := Vector2(randf_range(-40.0, view.x * 0.6), -30.0)
		_title_fx.particle(&"leaf", start, Vector2(randf_range(30, 70), randf_range(40, 80)), randf_range(5.0, 8.0), 22.0, 18.0, Color(1, 1, 1, 0.9), {"spin": randf_range(-2.0, 2.0), "fade": 0.85, "fade_in": 0.1, "wobble": 30.0})
	if _title_logo != null:
		var rect := Rect2(_control_center(_title_logo) - _title_logo.size * 0.4, _title_logo.size * 0.8)
		_title_fx.preset(&"ui_sparkle", rect.position + Vector2(randf() * rect.size.x, randf() * rect.size.y), 1.2)
	if _play_button != null and randf() < 0.5:
		var center := _control_center(_play_button)
		_title_fx.preset(&"ui_sparkle", center + Vector2(randf_range(-160, 160), randf_range(-30, 30)), 0.8)
	_play_button.pivot_offset = _play_button.size * 0.5
	if not reduced_motion:
		_play_button.scale = Vector2.ONE * (1.0 + 0.025 * sin(_time * 4.0))


func _sync_difficulty_buttons() -> void:
	for id: StringName in _difficulty_buttons:
		var button: Button = _difficulty_buttons[id]
		T.style_button(button, T.GOLD if id == difficulty else T.PAPER)


func _show_title() -> void:
	state = STATE_TITLE
	paused = false
	_title.visible = true
	hud.visible = false
	_help.visible = false
	_pause.visible = false
	results.visible = false
	battlefield.visible = false
	battlefield.set_process(false)
	battlefield.input_enabled = false
	_sync_difficulty_buttons()
	audio.set_music_state(&"title")
	_start_music()
	_play_button.grab_focus.call_deferred()


# ================================================================ overlays

func _overlay_root(name_text: String) -> Control:
	var root := Control.new()
	root.name = name_text
	root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_STOP
	var dim := ColorRect.new()
	dim.color = Color(0.05, 0.02, 0.06, 0.72)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root.add_child(dim)
	root.visible = false
	root.z_index = 20
	_ui.add_child(root)
	return root


func _centered_paper(parent: Control, half: Vector2) -> PanelContainer:
	var panel := T.paper(Vector2(30, 22))
	panel.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	panel.offset_left = -half.x
	panel.offset_right = half.x
	panel.offset_top = -half.y
	panel.offset_bottom = half.y
	parent.add_child(panel)
	return panel


func _build_help() -> void:
	_help = _overlay_root("HelpOverlay")
	var panel := _centered_paper(_help, Vector2(580, 336))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 8)
	panel.add_child(box)
	var header := HBoxContainer.new()
	box.add_child(header)
	var title := T.label(Loc.t(&"help.title"), 40, T.MAROON, "display")
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(title)
	var close := T.button(Loc.t(&"help.close"), "", T.MAROON, 16)
	close.custom_minimum_size = Vector2(120, 48)
	close.pressed.connect(_close_help)
	header.add_child(close)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	box.add_child(scroll)
	var content := VBoxContainer.new()
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_theme_constant_override("separation", 10)
	scroll.add_child(content)
	var loop := T.ink(Loc.t(&"help.loop"), 15, T.INK, "bold")
	loop.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	loop.custom_minimum_size.x = 1040
	content.add_child(loop)
	var columns := HBoxContainer.new()
	columns.add_theme_constant_override("separation", 18)
	content.add_child(columns)
	var controls := VBoxContainer.new()
	controls.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	columns.add_child(controls)
	controls.add_child(T.ink(Loc.t(&"help.controls"), 18, T.MAROON, "black"))
	_help_controls = T.ink(Loc.t(&"help.controls_body"), 14, T.INK, "bold")
	_help_controls.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_help_controls.custom_minimum_size.x = 520
	controls.add_child(_help_controls)
	controls.add_child(T.ink(Loc.t(&"help.tactics"), 18, T.MAROON, "black"))
	var tactics := T.ink(Loc.t(&"help.tactics_body"), 14, T.INK, "bold")
	tactics.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	tactics.custom_minimum_size.x = 520
	controls.add_child(tactics)
	var heroes := VBoxContainer.new()
	heroes.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	heroes.add_theme_constant_override("separation", 6)
	columns.add_child(heroes)
	heroes.add_child(T.ink(Loc.t(&"help.roster"), 18, T.MAROON, "black"))
	for kind: StringName in Catalog.HERO_ORDER:
		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 8)
		row.add_child(T.icon(HeroHud.PORTRAITS[kind], 52))
		var texts := VBoxContainer.new()
		texts.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		texts.add_theme_constant_override("separation", 0)
		var room := &"main_hall"
		for room_id: StringName in Catalog.ROOMS:
			if Catalog.ROOMS[room_id]["trains"] == kind:
				room = room_id
		texts.add_child(T.ink("%s — %s" % [Loc.t(StringName("hero.%s" % kind)), Loc.t(StringName("hero.%s.role" % kind))], 14, T.INK, "black"))
		var detail := T.ink(Loc.t(&"help.hero_line", {"power": Loc.t(StringName("power.%s" % kind)), "room": Loc.t(StringName("room.%s" % room)), "cost": int(Catalog.stats(kind)["cost"])}), 12, Color("4a3b44"), "bold")
		detail.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		detail.custom_minimum_size.x = 400
		texts.add_child(detail)
		row.add_child(texts)
		heroes.add_child(row)


func _build_pause() -> void:
	_pause = _overlay_root("PauseOverlay")
	var panel := _centered_paper(_pause, Vector2(240, 262))
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 8)
	box.alignment = BoxContainer.ALIGNMENT_CENTER
	panel.add_child(box)
	var title := T.label(Loc.t(&"pause.title"), 44, T.MAROON, "display")
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(title)
	var resume := T.button(Loc.t(&"pause.resume"), "", T.MAROON, 18)
	resume.custom_minimum_size = Vector2(0, 54)
	resume.pressed.connect(func() -> void: _set_paused(false))
	box.add_child(resume)
	var help := T.button(Loc.t(&"title.how"), "", T.PAPER, 16)
	help.custom_minimum_size = Vector2(0, 46)
	help.pressed.connect(_show_help)
	box.add_child(help)
	for spec: Array in [[&"sound", "settings.sound"], [&"edge", "settings.edge_pan"], [&"motion", "settings.reduced_motion"]]:
		var check := CheckButton.new()
		check.text = Loc.t(StringName(spec[1]))
		check.add_theme_font_override("font", _fonts["black"])
		check.add_theme_font_size_override("font_size", 15)
		for color_name: String in ["font_color", "font_hover_color", "font_pressed_color", "font_hover_pressed_color", "font_focus_color"]:
			check.add_theme_color_override(color_name, T.INK)
		check.focus_mode = Control.FOCUS_ALL
		var key: StringName = spec[0]
		check.toggled.connect(func(on: bool) -> void: _on_setting_toggled(key, on))
		box.add_child(check)
		_settings_checks[key] = check
	var restart := T.button(Loc.t(&"pause.restart"), "", T.PAPER, 16)
	restart.custom_minimum_size = Vector2(0, 46)
	restart.pressed.connect(func() -> void:
		if sim != null and sim.result == &"":
			tweak_service.end_run()
		start_match()
	)
	box.add_child(restart)
	var quit := T.button(Loc.t(&"pause.quit"), "", T.PAPER, 16)
	quit.custom_minimum_size = Vector2(0, 46)
	quit.pressed.connect(func() -> void:
		if sim != null and sim.result == &"":
			tweak_service.end_run()
		_show_title()
	)
	box.add_child(quit)
	_sync_settings_checks()


func _on_setting_toggled(key: StringName, on: bool) -> void:
	match key:
		&"sound":
			tweak_service.set_requested(&"audio.master.muted", not on)
		&"edge":
			battlefield.edge_pan_enabled = on
		&"motion":
			tweak_service.set_requested(&"ui.reduced_motion", on)


func _sync_settings_checks() -> void:
	if _settings_checks.is_empty() or tweak_service == null:
		return
	(_settings_checks[&"sound"] as CheckButton).set_pressed_no_signal(not bool(tweak_service.requested_value(&"audio.master.muted")))
	(_settings_checks[&"edge"] as CheckButton).set_pressed_no_signal(battlefield.edge_pan_enabled)
	(_settings_checks[&"motion"] as CheckButton).set_pressed_no_signal(bool(tweak_service.requested_value(&"ui.reduced_motion")))


func _build_results() -> void:
	results = ResultsScreen.new()
	results.name = "ResultsScreen"
	results.store = high_scores
	results.z_index = 20
	_ui.add_child(results)
	results.ui_cue.connect(func(cue: StringName) -> void:
		audio.play_ui(&"levelup" if cue == &"record" else cue)
	)
	results.star_earned.connect(func(_index: int) -> void: audio.play_ui(&"coin"))
	results.play_again.connect(func() -> void:
		audio.play_ui(&"ui_confirm")
		_begin_from_title()
	)
	results.change_difficulty.connect(func() -> void:
		audio.play_ui(&"ui_click")
		_show_title()
	)
	results.to_title.connect(func() -> void:
		audio.play_ui(&"ui_click")
		_show_title()
	)


func _build_rotate_overlay() -> void:
	_rotate = Control.new()
	_rotate.name = "RotatePrompt"
	_rotate.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_rotate.mouse_filter = Control.MOUSE_FILTER_STOP
	_rotate.visible = false
	_rotate.z_index = 40
	_ui.add_child(_rotate)
	var dim := ColorRect.new()
	dim.color = Color(0.08, 0.04, 0.09, 0.94)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_rotate.add_child(dim)
	var box := VBoxContainer.new()
	box.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	box.alignment = BoxContainer.ALIGNMENT_CENTER
	box.add_theme_constant_override("separation", 14)
	_rotate.add_child(box)
	var logo := TextureRect.new()
	logo.texture = LOGO
	logo.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	logo.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	logo.custom_minimum_size = Vector2(0, 260)
	logo.mouse_filter = Control.MOUSE_FILTER_IGNORE
	box.add_child(logo)
	var title := T.display(Loc.t(&"rotate.title"), 40, T.GOLD, 10)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	title.custom_minimum_size.x = 300
	box.add_child(title)
	var body := T.label(Loc.t(&"rotate.body"), 20, T.PAPER, "black", 4)
	body.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	body.custom_minimum_size.x = 300
	box.add_child(body)


func _show_result(result: StringName) -> void:
	state = STATE_RESULT
	paused = false
	_pause.visible = false
	_help.visible = false
	battlefield.input_enabled = false
	var eligible := tweak_service.run_is_rank_eligible()
	tweak_service.end_run()
	audio.set_music_state(&"result")
	hud.visible = false
	results.show_result(sim, difficulty, eligible)
	if result == &"victory":
		results.fx.preset(&"confetti", _ui.size * Vector2(0.3, 0.3), 2.0)
		results.fx.preset(&"confetti", _ui.size * Vector2(0.7, 0.3), 2.0)
