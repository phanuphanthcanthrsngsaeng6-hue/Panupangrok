extends SceneTree
var failures: Array[String] = []
func _initialize() -> void:
	call_deferred("run")
func check(value: bool, text: String) -> void:
	if not value: failures.append(text); push_error(text)
func run() -> void:
	check(ProjectSettings.get_setting("application/config/name") == "Space Pinball", "release identity")
	check(not root.has_node("SandboxBridge"), "debug bridge excluded")
	var tuning = root.get_node("TuningStore")
	check(not tuning.owner_preview_enabled() and not tuning.set_value("player.lives", 9, false), "release refuses developer values even in a debug-capable pack verifier")
	check(not ResourceLoader.exists("res://scripts/ui/tweak_panel.gd"), "developer controls excluded")
	for path in ["res://assets/template/characters/runner.png","res://assets/template/ui/title_glass.png","res://tools/comet_acceptance.gd"]:
		check(not ResourceLoader.exists(path),"unused template/tool resource excluded: "+path)
	var font: Font = load("res://assets/template/fonts/ui_regular.tres")
	check(font != null and font.has_char("彗".unicode_at(0)) and font.has_char("星".unicode_at(0)), "exported CJK glyphs")
	var cjk: FontFile = load("res://assets/template/fonts/NotoSansSC-VF.subset.woff2")
	check(cjk != null and cjk.data.size()<=2000000 and cjk.get_supported_chars().length()>=6547,"exported full bounded CJK repertoire")
	var cjk_import := ConfigFile.new()
	check(cjk_import.load("res://assets/template/fonts/NotoSansSC-VF.subset.woff2.import") == OK, "exported font import receipt")
	var packed_font_path: String = cjk_import.get_value("remap", "path", "")
	var packed_font := FileAccess.open(packed_font_path, FileAccess.READ)
	check(packed_font != null and packed_font.get_length() <= 2000000, "actual packed CJK body resource respects the two-million-byte subset cap")
	if packed_font != null:
		print("[comet-pack] CJK bytes: font=", cjk.data.size(), " packed=", packed_font.get_length())
		packed_font.close()
	check(cjk != null and not cjk.allow_system_fallback, "CJK does not mask unsupported glyphs with system fonts")
	var main = load("res://scenes/main.tscn").instantiate()
	main.testing = true
	main.tutorial_seen = true
	main.tutorial_version = main.Tutorial.VERSION
	root.add_child(main)
	check(main.get_script().resource_path == "res://scripts/pinball_template.gd", "pinball router boots without an owner UI")
	check(not main.music_ready and main.find_children("*","SubViewport",true,false).is_empty(),"title starts without deferred music or any background viewport")
	main.set_physics_process(false)
	await process_frame
	check(main.state == "title", "exported game starts at title")
	for path in ["res://assets/template/observatory/bumper.png","res://scripts/comet_juice.gd","res://scripts/comet_rules.gd","res://scripts/comet_effects.gd","res://assets/template/audio/cosmic/celestial-drift.ogg","res://scripts/manus/browser_bgm_player.gd","res://scripts/manus/browser_bgm_backend.gd","res://scripts/pinball_stages.gd","res://scripts/pinball_leaderboard.gd","res://shaders/arcade_filter.gdshader"]:
		check(ResourceLoader.exists(path),"upgraded resource included: "+path)
	check(main.CAP.get_width()>0 and main.STATIC_BG.get_width()>0,"core sprites and shared static background decode at startup")
	var template=load("res://scripts/template_config.gd")
	check(template.validate(main.cfg).is_empty(),"exported JSON and schema validate")
	check(ResourceLoader.exists("res://scripts/template_config.gd") and FileAccess.file_exists(template.PATH) and FileAccess.file_exists(template.SCHEMA_PATH),"template resources included in export")
	check(main.rules.goals==[9,3,3] and main.sim.BUMPERS.size()==3,"default template retains the tested table and objectives")
	for path in ["res://shaders/living_cosmos.gdshader","res://scripts/comet_cosmos.gd","res://assets/template/observatory/cosmos.webp","res://assets/template/observatory/surface.webp"]:
		check(not ResourceLoader.exists(path),"animated background implementation excluded: "+path)
	check(main.optional_loading.ITEMS.size()==1 and main.optional_loading.ITEMS[0].id=="music","no deferred background tasks in release")
	main.buttons.start.pressed.emit()
	for i in 18000:
		if main.state == "gameover": break
		if main._live_count()==0 and main.delay_next<=0:
			var e := InputEventKey.new()
			e.physical_keycode = KEY_SPACE; e.pressed = true; main._input(e)
			for j in 30: main._physics_process(1.0/60); main._process(1.0/60)
			e.pressed = false; main._input(e)
		main._physics_process(1.0/60)
		main._process(1.0/60)
	check(main.state == "gameover" and main.score > 0 and not main.run_score.result().is_empty(), "exported launches reach a finalized terminal result")
	check(main.run_score.result().outcome == "defeat" and (main.balls == 0 or main.run_score.elapsed >= main.stages.definitions[0].time_limit), "defeat follows natural drains or the authored stage time limit")
	check(main.sim.multiplier>=1,"exported scoring multiplier")
	if main.buttons.has("primary"): main.buttons.primary.pressed.emit()
	check(main.state=="playing" and main.balls==3 and main.score==0 and main.run_score.result().is_empty(),"exported one-click replay resets score authority")
	for i in 8: await process_frame
	check(main.music_ready and main.optional_loading.done,"optional BGM loads between safe frames")
	var audio = root.get_node("AudioDirector")
	check(audio._streams.has("music.gameplay") and audio._streams.has("enemy.impact"), "pack contains connected BGM and effects")
	check(audio.get_voice_capacity() == {"music":2,"sfx":8,"ui":2}, "audio voice allocation remains bounded")
	check(audio._streams["music.title"] == audio._streams["music.gameplay"], "title and gameplay reuse one supplied track")
	for locale in ["en", "zh_CN"]:
		check(FileAccess.file_exists("res://localization/"+locale+".json"), "complete exported locale: "+locale)
		var dictionary: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://localization/"+locale+".json"))
		for text: String in dictionary.values():
			for i in text.length():
				if text.unicode_at(i) >= 32: check(font.has_char(text.unicode_at(i)), "exported locale glyph: "+text[i])
	audio.release_streams()
	main.queue_free()
	await process_frame
	if failures.is_empty():
		print("[comet-pack] PASS: clean release, identity, resources, complete 6547 CJK, fonts <=1MB, title, real gameplay, game over, replay, audio")
		quit(0)
	else:
		print("[comet-pack] FAIL: "+str(failures))
		quit(1)
