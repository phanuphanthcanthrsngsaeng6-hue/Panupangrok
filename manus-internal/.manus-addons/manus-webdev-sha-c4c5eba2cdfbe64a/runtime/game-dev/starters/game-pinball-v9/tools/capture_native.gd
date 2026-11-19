extends SceneTree
## Native visual inspection. No player saves or leaderboard writes.
func _initialize() -> void:
	_capture.call_deferred()

func _capture() -> void:
	var args := OS.get_cmdline_user_args()
	var mode := args[0] if args.size() else "title"
	var portrait := "--portrait" in args
	var chinese := "--chinese" in args
	root.size = Vector2i(540,1080) if portrait else Vector2i(1280,900)
	root.content_scale_size = Vector2i.ZERO
	var main = load("res://scenes/main.tscn").instantiate()
	main.testing = true
	root.add_child(main)
	main.zh = chinese
	main.set_physics_process(false)
	main.tutorial_version = 0 if mode == "tutorial" else 1
	main.input_method = "touch" if portrait else "keyboard"
	if mode in ["game", "tutorial", "pause", "result", "record", "confirm"]:
		main.start_game()
	if mode == "game":
		main.sim.begin_charge()
		for i in 45: main._physics_process(1.0/60)
		main.sim.release_plunger()
		for i in 85: main._physics_process(1.0/60)
	if mode in ["pause", "confirm"]: main.toggle_pause()
	if mode in ["result", "record"]: main._finish_run("defeat")
	if mode in ["record", "standings"]: main._show_dialog(mode)
	if mode == "confirm": main._show_dialog("restart")
	main._layout()
	for i in 8: await process_frame
	await RenderingServer.frame_post_draw
	var out := "/tmp/pinball-%s-%s-%s.png" % [mode,"zh" if chinese else "en","portrait" if portrait else "landscape"]
	var error := root.get_texture().get_image().save_png(out)
	print("PINBALL_CAPTURE: ", out, " ", error_string(error))
	root.get_node("AudioDirector").release_streams()
	await create_timer(0.15).timeout
	main.queue_free()
	await process_frame
	quit(0 if error == OK else 1)
