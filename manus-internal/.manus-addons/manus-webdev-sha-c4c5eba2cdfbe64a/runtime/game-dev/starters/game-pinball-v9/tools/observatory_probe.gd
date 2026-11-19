extends SceneTree
func _initialize()->void:call_deferred("run")
func run()->void:
	var g=load("res://scenes/main.tscn").instantiate()
	root.add_child(g);g.testing=true;g.tutorial_seen=true;g.set_physics_process(false);g.start_game()
	g.sim.begin_charge()
	for j in 65:g._physics_process(1.0/60);g._process(1.0/60)
	g.sim.release_plunger()
	for i in 24000:
		if g.state=="gameover":print("DRAINED ALL at ",float(i)/60," score ",g.score);break
		if g._live_count()==0 and g.delay_next<=0:
			g.sim.begin_charge()
			for j in (40 if i<2100 else 30):g._physics_process(1.0/60);g._process(1.0/60)
			g.sim.release_plunger()
		if i<2100:
			var p:Vector2=g.sim.pos
			g._flipper_input("left",p.y>570 and p.y<658 and p.x<240 and g.sim.vel.y>0)
			g._flipper_input("right",p.y>570 and p.y<658 and p.x>=240 and g.sim.vel.y>0)
		else:g._release_inputs()
		g._physics_process(1.0/60);g._process(1.0/60)
		if i%600==0:
			print("t=",float(i)/60," balls=",g.balls," stage=",g.rules.stage," count=",g._live_count()," main=",g.sim.pos," vel=",g.sim.vel," hits=",g.hits," flippers ",g.sim.left,"/",g.sim.right)
			for e in g.extra_balls:print(" extra=",e.model.pos," ",e.model.vel," live=",e.model.live)
	g._release_inputs();g.queue_free();await process_frame
	quit()
