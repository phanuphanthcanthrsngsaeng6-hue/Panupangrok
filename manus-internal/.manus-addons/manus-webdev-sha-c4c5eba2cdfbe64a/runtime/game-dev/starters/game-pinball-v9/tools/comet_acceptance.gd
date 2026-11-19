extends SceneTree
var main
var failures: Array[String] = []
var capture := false
func _initialize() -> void:
	call_deferred("run")
func check(value: bool, label: String) -> void:
	if not value: failures.append(label); push_error(label)
func step() -> void:
	main._physics_process(1.0/60)
	main._process(1.0/60)
func shot(key: int, pressed: bool) -> void:
	var e := InputEventKey.new()
	e.keycode = key
	e.physical_keycode = key
	e.pressed = pressed
	main._input(e)
func snap(name: String) -> void:
	if not capture: return
	await process_frame
	await process_frame
	await RenderingServer.frame_post_draw
	var path := "res://captures/"+name+".png"
	root.get_texture().get_image().save_png(path)
	print("CAPTURE "+path)
func run() -> void:
	capture = OS.get_environment("COMET_CAPTURE") == "1"
	root.size = Vector2i(1280,900)
	main = load("res://scenes/main.tscn").instantiate()
	main.testing = true
	root.add_child(main)
	check(not main.music_ready and main.find_children("*","SubViewport",true,false).is_empty(),"title starts without deferred music or any background viewport")
	check(main.STATIC_BG.get_width()>0,"one shared static background is ready at startup")
	check(main.optional_loading.ITEMS.size()==1 and main.optional_loading.ITEMS[0].id=="music","only BGM is deferred; no animated background requests")
	main.testing = true
	main.tutorial_seen = false
	main.tutorial_version = 0
	main.zh = false
	main._layout()
	main.set_physics_process(false)
	main.set_process(false)
	await process_frame
	check(main.state == "title", "boots into the custom title")
	await snap("01-title-en")
	main.buttons.locale.pressed.emit()
	check(main.zh, "title EN to CN")
	await snap("02-title-cn")
	main.buttons.locale.pressed.emit()
	check(not main.zh, "title CN to EN")
	main.buttons.start.pressed.emit()
	check(main.tutorial.active and main.tutorial.step == 0 and not main.tutorial_open, "first start shows nonblocking event-driven launch guidance")
	await snap("03-tutorial")
	check(main.state == "playing" and main.buttons.has("skip"), "tutorial permits real play and exposes Skip")
	shot(KEY_SPACE, true)
	for i in 65: step()
	check(main.sim.charge>0.8, "plunger charge builds while held")
	shot(KEY_SPACE, false)
	check(main.sim.live, "space release launches a real ball")
	check(main.tutorial.step == 1, "actual launch advances tutorial to flippers")
	shot(KEY_LEFT, true)
	shot(KEY_LEFT, false)
	check(main.tutorial.step == 2, "actual arrow flipper input advances tutorial to targets")
	var fast_comet_captured := false
	var shots_returned := 0
	var flipper_hits := [0]
	main.sim.scored.connect(func(_points,_at,kind):
		if kind == "flipper": flipper_hits[0] += 1)
	for i in 2100:
		if main.state != "playing": break
		if main._live_count()==0 and main.delay_next <= 0:
			shot(KEY_SPACE,true)
			for j in 40: step()
			shot(KEY_SPACE,false)
			shots_returned += 1
		# Time the bats when an actual descending ball reaches their strike region.
		var p: Vector2 = main.sim.pos
		var left_now: bool = p.y>570 and p.y<658 and p.x<240 and main.sim.vel.y>0
		var right_now: bool = p.y>570 and p.y<658 and p.x>=240 and main.sim.vel.y>0
		shot(KEY_LEFT,left_now)
		shot(KEY_RIGHT,right_now)
		step()
		if capture and not fast_comet_captured and main.sim.live and not main.sim.in_lane and main.sim.vel.length()>1000:
			fast_comet_captured=true
			print("COMET FIRE actual speed=",main.sim.vel.length())
			await snap("20-fast-comet")
		if i == 70: await snap("04-in-flight")
		if i == 95: await snap("05-moving-comet")
		if i == 400: await snap("06-live-table")
	check(main.score>0 and main.hits>0, "actual gameplay scores on collision targets")
	check(flipper_hits[0]>0, "timed input makes contact with a real flipper")
	print("ACTIVE PLAY score=%d hits=%d flipper_returns=%d balls=%d elapsed=%.1f" % [main.score,main.hits,flipper_hits[0],main.balls,main.sim.elapsed])
	if main.state == "playing":
		shot(KEY_LEFT,false); shot(KEY_RIGHT,false)
		main.toggle_pause()
		var before: Vector2 = main.sim.pos
		for i in 90: step()
		check(main.sim.pos == before, "pause freezes ball physics")
		await snap("07-paused")
		main.toggle_pause()
		# Let real physics drain all remaining balls; do not assign score, balls or result state.
		for i in 18000:
			if main.state == "gameover": break
			if main._live_count()==0 and main.delay_next<=0:
				shot(KEY_SPACE,true)
				for j in 30: step()
				shot(KEY_SPACE,false)
			step()
	check(main.state == "gameover" and not main.run_score.result().is_empty(), "natural play reaches a finalized result")
	if main.run_score.result().outcome == "victory":
		check(main.stage_completed and main.rules.nova_count > 0 and main.rules.jackpots >= main.stages.definitions[0].jackpots, "natural victory satisfies the authored multiball jackpot objective")
	else:
		check(main.balls == 0 or main.run_score.elapsed >= main.stages.definitions[0].time_limit, "natural defeat follows drains or the authored time limit")
	check(main.best>=main.score, "results update high score")
	print("RESULT score=%d hits=%d duration=%.1f balls=%d" % [main.score,main.hits,main.sim.elapsed,main.balls])
	await snap("08-results")
	if main.buttons.has("primary"): main.buttons.primary.pressed.emit()
	check(main.state == "playing" and main.score == 0 and main.balls == 3 and main.sim.in_lane, "one-click replay resets the run")
	check(not main.tutorial_open and not main.tutorial.active, "replay does not repeat completed onboarding")
	await snap("09-replay")
	main._open_settings()
	await snap("10-settings")
	main._close_settings()
	var prior: bool = main.muted
	shot(KEY_M,true)
	check(main.muted != prior and AudioServer.is_bus_mute(AudioServer.get_bus_index("Master")) == main.muted, "mute updates actual output bus")
	shot(KEY_M,true)
	# Touch controls drive the same physical input paths; two simultaneous contacts.
	root.content_scale_size = Vector2i(0,0)
	root.size = Vector2i(540,1080)
	await process_frame
	main._layout()
	check(main.compact, "portrait layout is active")
	for pair in [[0,"left"],[1,"right"]]:
		var e := InputEventScreenTouch.new()
		e.index = pair[0]; e.pressed = true
		e.position = main.origin + main._control_rect(pair[1]).get_center()*main.unit
		main._input(e)
	check(main.sim.left and main.sim.right, "two-finger touch operates both flippers")
	for i in 10: step()
	await snap("11-portrait-touch")
	main._release_inputs()
	main.zh = true
	main.toast_time = 0
	main._layout()
	await snap("12-portrait-cn")
	# Keep the packaged font contract and verify every Chinese character authored in the UI.
	var font: Font = load("res://assets/template/fonts/ui_regular.tres")
	var code := FileAccess.get_file_as_string("res://localization/zh_CN.json")
	for i in code.length():
		var cp := code.unicode_at(i)
		if cp>=0x4E00 and cp<=0x9FFF: check(font.has_char(cp),"Chinese glyph %d" % cp)
	check(FileAccess.get_file_as_bytes("res://assets/template/fonts/NotoSansSC-VF.subset.woff2").size()<=2000000,"bounded CJK body font (subset WOFF2)")
	for i in 8:
		main._process(1.0/60)
		await process_frame
	check(main.music_ready and main.optional_loading.done,"optional audio finishes without gating real gameplay")
	check(main.find_children("*","SubViewport",true,false).is_empty(),"background viewports remain absent after gameplay and deferred loading")
	var music_bus:=AudioServer.get_bus_index("Music")
	var preserved_volume:=AudioServer.get_bus_volume_db(music_bus)
	var audio_director=root.get_node("AudioDirector")
	var preserved_stream=audio_director._music_players[audio_director._music_index].stream
	audio_director.set_music_suspended(true)
	check(audio_director._music_suspended and audio_director._music_players[audio_director._music_index].stream==preserved_stream,"loaded music suspension preserves stream identity")
	audio_director.set_music_suspended(false)
	check(is_equal_approx(AudioServer.get_bus_volume_db(music_bus),preserved_volume),"pause/late audio preserves player volume")
	check(root.get_node("AudioDirector")._sfx_players.size()==8 and root.get_node("AudioDirector")._music_players.size()==2,"bounded reusable audio voices")
	check(root.get_node("AudioDirector")._music_players[root.get_node("AudioDirector")._music_index].playback_type==AudioServer.PLAYBACK_TYPE_STREAM,"music uses Web streaming playback")
	# Exercise the actual durable save method, then restore this native test profile.
	var save_path := "user://clockwork_comet.cfg"
	var existed := FileAccess.file_exists(save_path)
	var prior_bytes := FileAccess.get_file_as_bytes(save_path) if existed else PackedByteArray()
	main.reduced = true
	main.best_chain_record = maxi(main.best_chain_record,8)
	main.testing = false
	main._save()
	var stored := ConfigFile.new()
	check(stored.load(save_path)==OK, "high-score settings file is durable")
	check(bool(stored.get_value("settings","reduced",false)),"reduced effects saves durably")
	check(int(stored.get_value("game","best_chain",0))>=8,"best chain saves durably")
	check(int(stored.get_value("game","best",-1)) == main.best, "stored high score round trip")
	check(bool(stored.get_value("settings","zh",false)) == main.zh, "stored locale round trip")
	check(is_equal_approx(float(stored.get_value("settings","music",-1)),main.music_volume), "stored music setting round trip")
	main.testing = true
	if existed:
		var out := FileAccess.open(save_path,FileAccess.WRITE)
		out.store_buffer(prior_bytes)
		out.close()
	else: DirAccess.remove_absolute(save_path)
	for retry in 5:
		main.start_game()
		await process_frame
		await process_frame
	check(root.get_node("AudioDirector")._sfx_players.size()==8, "replay does not allocate more audio voices")
	check(main.popups.is_empty() and main.bursts.is_empty() and main.trail.is_empty(), "replay clears effects")
	root.get_node("AudioDirector").release_streams()
	main.queue_free()
	await process_frame
	if DisplayServer.get_name()!="headless":await create_timer(0.15).timeout
	if failures.is_empty():
		print("[comet-tests] PASS: start, tutorial, charge, launch, scored physics, flipper returns, pause, verified terminal outcome, replay, localization, touch, mute, font and audio lifecycle")
		quit(0)
	else:
		print("[comet-tests] FAIL: "+str(failures))
		quit(1)
