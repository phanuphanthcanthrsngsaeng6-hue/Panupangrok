extends SceneTree
var begin_usec:=Time.get_ticks_usec()
func _initialize()->void:call_deferred("run")
func run()->void:
	var a:=Time.get_ticks_usec()
	var scene=load("res://scenes/main.tscn")
	var b:=Time.get_ticks_usec()
	var game=scene.instantiate()
	var c:=Time.get_ticks_usec()
	root.add_child(game)
	game.testing=true
	game.set_physics_process(false)
	var d:=Time.get_ticks_usec()
	await process_frame
	print("STARTUP_PROFILE ",JSON.stringify({"scene_load_ms":(b-a)/1000.0,"instantiate_ms":(c-b)/1000.0,"ready_ms":(d-c)/1000.0,"title_ms":(Time.get_ticks_usec()-a)/1000.0,"from_script_ms":(Time.get_ticks_usec()-begin_usec)/1000.0}))
	for i in 8: await process_frame
	if "optional_loading" in game:print("OPTIONAL_PROFILE ",JSON.stringify({"timings_ms":game.optional_loading.timings_ms,"done":game.optional_loading.done,"music_ready":game.music_ready}))
	var files:Array=[]
	inventory("res://",files)
	files.sort_custom(func(x,y):return x.bytes>y.bytes)
	for entry in files.slice(0,22):print("PACK_FILE ",JSON.stringify(entry))
	root.get_node("AudioDirector").release_streams()
	game.queue_free()
	await process_frame
	quit()
func inventory(folder:String,files:Array)->void:
	for name in DirAccess.get_files_at(folder):
		var path:=folder.path_join(name)
		var f:=FileAccess.open(path,FileAccess.READ)
		if f:files.append({"path":path,"bytes":f.get_length()})
	for name in DirAccess.get_directories_at(folder):
		if name in [".git","dist","node_modules","captures","docs"]:continue
		inventory(folder.path_join(name),files)
