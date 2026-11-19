extends SceneTree
## Router acceptance. Collision scoring/multiball are exercised independently by
## observatory_acceptance; here real UI requests must preserve/reset run state.
var game
var errors: Array[String] = []
var checks := 0
func _initialize() -> void:
	_run.call_deferred()
func check(ok: bool, message: String) -> void:
	checks += 1
	if not ok:
		errors.append(message)
		push_error("[pinball-gameplay] " + message)
func step(count := 1) -> void:
	for index in count:
		game._physics_process(1.0 / 60)
		game._process(1.0 / 60)
func key(code: int, pressed := true) -> void:
	var event := InputEventKey.new()
	event.keycode = code
	event.physical_keycode = code
	event.pressed = pressed
	game._input(event)
func pad(button: int, pressed := true) -> void:
	var event := InputEventJoypadButton.new()
	event.button_index = button
	event.pressed = pressed
	game._input(event)
func dialog_button(key_name: String) -> void:
	for button in game.overlay.find_children("*", "Button", true, false):
		if button.text == game.t(key_name):
			button.pressed.emit()
			return
	check(false, "dialog exposes " + key_name)
func _run() -> void:
	game = load("res://scenes/main.tscn").instantiate()
	game.testing = true
	root.add_child(game)
	game.set_physics_process(false)
	game.set_process(false)
	game.tutorial_seen = true
	game.tutorial_version = game.Tutorial.VERSION
	game.reduced = false
	game.zh = false
	game._layout()
	await process_frame
	check(game.state == "title" and game.stages.definitions.size() >= 1, "validated stages boot to a usable title")
	var retained_records: Array = game.standings.records.duplicate(true)
	game.standings.records = [
		{"name":"Standard entry","score":100,"duration":5.0,"stage":"observatory","outcome":"victory","configuration":"test","eligible":true,"timestamp":1},
		{"name":"Custom entry","score":200,"duration":5.0,"stage":"observatory","outcome":"victory","configuration":"test","eligible":false,"timestamp":2}]
	game.buttons.standings.pressed.emit()
	check(game.modal == "standings" and game.state == "title", "local standings preserve the title route")
	var rows: Array = game.overlay.find_children("*", "Label", true, false)
	check(rows.any(func(label): return "Custom entry" in label.text and game.t("leaderboard.practice") in label.text), "modified local records are clearly marked as practice")
	dialog_button("leaderboard.filter_all")
	rows = game.overlay.find_children("*", "Label", true, false)
	check(game.standings_baseline_only and not rows.any(func(label): return "Custom entry" in label.text) and rows.any(func(label): return "Standard entry" in label.text), "baseline filter excludes practice records without removing standard records")
	dialog_button("leaderboard.filter_baseline")
	check(not game.standings_baseline_only, "All filter restores mixed local standings")
	game.standings.records = retained_records
	key(KEY_SPACE)
	check(not game.sim.charging, "title modal rejects gameplay input")
	dialog_button("screen.close")
	game.buttons.start.pressed.emit()
	check(game.state == "playing" and not game.tutorial.active, "completed onboarding stays suppressed on start")
	# Keyboard arrows and gamepad shoulder controls share the same flipper owner.
	key(KEY_LEFT)
	key(KEY_RIGHT)
	check(game.sim.left and game.sim.right, "arrow keys control both flippers")
	key(KEY_LEFT, false)
	key(KEY_RIGHT, false)
	pad(JOY_BUTTON_LEFT_SHOULDER)
	pad(JOY_BUTTON_RIGHT_SHOULDER)
	check(game.sim.left and game.sim.right and game.input_method == "gamepad", "gamepad shoulders control both flippers")
	pad(JOY_BUTTON_START)
	check(game.state == "paused" and not game.sim.left and not game.sim.right, "gamepad pause releases held gameplay controls")
	var elapsed: float = game.run_score.elapsed
	var ball: Vector2 = game.sim.pos
	step(60)
	check(game.run_score.elapsed == elapsed and game.sim.pos == ball, "pause freezes score duration and physics")
	game._open_settings()
	key(KEY_SPACE)
	step(15)
	check(game.settings_open and game.state == "paused" and not game.sim.charging, "settings opened while paused keep gameplay suspended")
	key(KEY_ENTER)
	check(game.state == "paused" and game.settings_open, "Enter cannot resume through the settings modal")
	if game.state == "playing": game.toggle_pause()
	pad(JOY_BUTTON_START)
	check(game.state == "paused" and game.settings_open, "gamepad Start cannot resume through the settings modal")
	if game.state == "playing": game.toggle_pause()
	game._close_settings()
	check(game.state == "paused", "closing settings preserves prior pause")
	pad(JOY_BUTTON_START)
	check(game.state == "playing", "gamepad resumes from pause")
	key(KEY_DOWN)
	step(30)
	check(game.sim.charging and game.sim.charge > 0.4, "down arrow charges the plunger")
	key(KEY_DOWN, false)
	check(game.sim.live and not game.sim.charging, "down release launches a ball")
	game.toggle_pause()
	var prior_ball: Vector2 = game.sim.pos
	game.buttons.restart.grab_focus()
	game.buttons.restart.pressed.emit()
	check(game.modal == "restart" and game.state == "paused", "restart requests confirmation")
	dialog_button("screen.close")
	check(game.state == "paused" and game.sim.pos == prior_ball, "canceling restart preserves the run")
	await process_frame
	check(root.gui_get_focus_owner() == game.buttons.restart, "closing confirmation restores focus to its originating control")
	game.buttons.restart.pressed.emit()
	dialog_button("confirm.accept")
	check(game.state == "playing" and game.score == 0 and game.balls == int(game.cfg.gameplay.balls), "confirmed restart resets score and authored credits")
	check(game.sim.in_lane and not game.sim.live and game.extra_balls.is_empty() and game.run_score.elapsed == 0, "restart reconstructs the run-owned physics and clock")
	game.toggle_pause()
	game.buttons.menu.pressed.emit()
	check(game.modal == "title" and game.state == "paused", "return to title requests confirmation")
	dialog_button("screen.close")
	check(game.state == "paused", "canceling title navigation restores paused route")
	game.buttons.menu.pressed.emit()
	dialog_button("confirm.accept")
	check(game.state == "title" and game.extra_balls.is_empty() and not game.rules.multiball, "confirmed title return clears active game modes")
	# The tutorial replay entry launches actual event-driven guidance with Skip.
	game.buttons.how.pressed.emit()
	check(game.tutorial.active and game.tutorial.step == 0 and game.buttons.has("skip"), "replay tutorial starts launch guidance")
	game.buttons.skip.pressed.emit()
	check(not game.tutorial.active and game.tutorial_version == game.Tutorial.VERSION, "Skip completes this version of onboarding")
	game.start_game()
	check(not game.tutorial.active, "retry does not repeat skipped onboarding")
	# Deterministic collision fixtures: put each ball above the actual drain plane
	# and let physics own the loss and terminal transition; never assign ball credits.
	var credits: int = game.balls
	for lost in credits:
		while game.delay_next > 0: step()
		game.sim.live = true
		game.sim.in_lane = false
		game.sim.save_left = 0
		game.sim.pos = Vector2(game.table_size.x / 2, float(game.cfg.table.drain_y) - 1)
		game.sim.vel = Vector2(0, 350)
		step(2)
		check(game.balls == credits - lost - 1, "real drain consumes exactly one ball credit")
	check(game.state == "gameover" and not game.stage_completed and game.run_score.result().outcome == "defeat", "last real drain finalizes defeat")
	var terminal: Dictionary = game.run_score.result()
	var terminal_score: int = game.score
	game._on_score(1000, Vector2(232, 345), "bumper")
	game._on_drain()
	step(10)
	check(game.run_score.result() == terminal and game.score == terminal_score and game.balls == 0, "terminal routes reject late score, time and drain events")
	game.buttons.primary.pressed.emit()
	check(game.state == "playing" and game.run_score.result().is_empty() and game.score == 0, "defeat Retry clears immutable result and starts a fresh run")
	# Fast-forward only the clock to the authored terminal boundary; no score,
	# outcome or router state is assigned by the fixture.
	game.run_score.tick(float(game.stages.definitions[game.stage_index].time_limit) - 0.005)
	step()
	check(game.state == "gameover" and game.run_score.result().outcome == "defeat" and game.balls > 0, "authored time limit produces defeat even with unused balls")
	game.buttons.menu.pressed.emit()
	check(game.state == "title" and not game.rules.multiball and game.extra_balls.is_empty(), "result Return to title clears terminal presentation")
	root.get_node("AudioDirector").release_streams()
	game.queue_free()
	await process_frame
	await process_frame
	if DisplayServer.get_name() != "headless": await create_timer(0.15).timeout
	if errors.is_empty():
		print("[pinball-gameplay] PASS: %d checks; keyboard/gamepad, pause ownership, settings, confirmation/cancel, tutorial replay/skip, real-drain defeat, time-limit defeat, retry/title, immutable terminal result" % checks)
		quit(0)
	else:
		print("[pinball-gameplay] FAIL: ", errors)
		quit(1)
