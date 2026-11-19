extends SceneTree
## Run only through check_stage_routing.py's isolated two-stage project fixture.
var errors: Array[String] = []
func _initialize() -> void:
	_run.call_deferred()
func check(ok: bool, message: String) -> void:
	if not ok:
		errors.append(message)
		push_error("[pinball-stage-route] " + message)
func _run() -> void:
	print("ROUTE_USER_DIR:", OS.get_user_data_dir())
	var first = load("res://scenes/main.tscn").instantiate()
	first.testing = true
	root.add_child(first)
	first.set_process(false)
	first.set_physics_process(false)
	first.tutorial_version = first.Tutorial.VERSION
	check(first.stages.definitions.size() == 2, "isolated registry contains two stages")
	first.start_game()
	var audio := root.get_node("AudioDirector")
	for frame in 8:
		first._process(1.0 / 60)
		await process_frame
	var music_ids: Array = audio._music_players.map(func(player): return player.get_instance_id())
	var sfx_ids: Array = audio._sfx_players.map(func(player): return player.get_instance_id())
	var ui_ids: Array = audio._ui_players.map(func(player): return player.get_instance_id())
	var old_stream: AudioStream = audio._streams.get("music.gameplay")
	var before_connections: int = root.get_node("TuningStore").value_changed.get_connections().size()
	# The full collision suite proves earned victories; this fixture isolates the
	# production finalizer and actual Next Stage button from those mechanics.
	first._on_score(777, first.sim.BUMPERS[0], "bumper")
	first._finish_run("victory")
	check(first.buttons.primary.text == first.t("stage.next"), "victory routes its primary action to Next Stage")
	var first_ref: WeakRef = weakref(first)
	first.buttons.primary.pressed.emit()
	var next = null
	for child in root.get_children():
		if child != first and child.get_script() == first.get_script(): next = child
	check(next != null, "Next Stage instantiates the same template router")
	if next != null:
		next.testing = true
		next.set_process(false)
		next.set_physics_process(false)
	await process_frame
	await process_frame
	check(first_ref.get_ref() == null, "old stage frees after routing")
	if next != null:
		check(next.stage_index == 1 and next.state == "playing", "second registered stage starts gameplay")
		check(next.cfg.gameplay.balls == 2 and next.cfg.physics.gravity == 550, "second stage loads its distinct authored configuration")
		check(next.score == 0 and next.run_score.elapsed == 0 and next.run_score.result().is_empty(), "second stage owns a fresh zero-score run")
		check(next.run_score.stage_id == "route-second", "second stage result identity comes from registry data")
		check(next.extra_balls.is_empty() and not next.sim.live and next.sim.in_lane, "second stage resets ball and multiball state")
		check(root.get_node("TuningStore").value_changed.get_connections().size() == before_connections, "old stage tuning connections are removed rather than duplicated")
		check(next.sim.scored.get_connections().size() == 1 and next.sim.drained.get_connections().size() == 1, "new physics events have a single authoritative receiver")
		for frame in 8:
			next._process(1.0 / 60)
			await process_frame
		check(next.music_ready and next.optional_loading.done, "second stage completes its normal media preparation")
		check(audio._music_players.map(func(player): return player.get_instance_id()) == music_ids, "stage route reuses the music players")
		check(audio._sfx_players.map(func(player): return player.get_instance_id()) == sfx_ids and audio._ui_players.map(func(player): return player.get_instance_id()) == ui_ids, "stage route reuses bounded SFX/UI voices")
		check(audio._streams.get("music.gameplay") == old_stream, "stage route preserves the same track resource")
		if DisplayServer.get_name() != "headless":
			check(audio._music_players.filter(func(player): return player.playing).size() <= 1, "stage route never doubles music playback")
		next.queue_free()
	audio.release_streams()
	await process_frame
	await process_frame
	if DisplayServer.get_name() != "headless": await create_timer(0.15).timeout
	if errors.is_empty():
		print("[pinball-stage-route] PASS: actual Next Stage route, authored stage-two config, fresh score, unique signals, reused audio")
		quit(0)
	else:
		print("[pinball-stage-route] FAIL: ", errors)
		quit(1)
