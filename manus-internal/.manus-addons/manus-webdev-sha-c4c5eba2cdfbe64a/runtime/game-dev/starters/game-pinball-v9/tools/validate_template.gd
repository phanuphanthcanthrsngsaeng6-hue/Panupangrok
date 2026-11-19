extends SceneTree
const Config=preload("res://scripts/template_config.gd")
func _initialize()->void:
	var args:=OS.get_cmdline_user_args()
	var path:String=args[0] if not args.is_empty() else Config.PATH
	var result:=Config.load_file(path)
	if result.is_empty():
		for error in Config.last_errors:printerr(error)
		quit(1)
	else:
		print("VALID: ",path," | ",result.table.bumpers.size()," bumpers | ",result.table.rollovers.size()," rollovers | ",result.missions.size()," missions")
		quit(0)
