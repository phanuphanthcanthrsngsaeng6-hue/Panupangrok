extends SceneTree
func _initialize() -> void:
	var model = load("res://scripts/comet_physics.gd").new()
	model.scored.connect(func(_p,_at,kind):
		if kind=="sling": print("SLING t=%.1f p=%s v=%s" % [model.elapsed,model.pos,model.vel]))
	model.release_plunger()
	for i in 7200:
		model.tick(1.0/60)
		if i%600==0: print("t=%.1f pos=%s vel=%s" % [model.elapsed,model.pos,model.vel])
		if not model.live:
			print("DRAIN %.2f" % model.elapsed)
			break
	quit()
