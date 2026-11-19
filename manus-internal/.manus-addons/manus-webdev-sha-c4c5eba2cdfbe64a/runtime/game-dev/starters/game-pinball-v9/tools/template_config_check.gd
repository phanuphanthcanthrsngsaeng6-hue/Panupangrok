extends SceneTree
const Config=preload("res://scripts/template_config.gd")
const Physics=preload("res://scripts/comet_physics.gd")
const Rules=preload("res://scripts/comet_rules.gd")
var errors:Array[String]=[]
func _initialize()->void:call_deferred("run")
func check(ok:bool,message:String)->void:
	if not ok:errors.append(message);push_error(message)
func run()->void:
	var defaults:=Config.load_file(Config.PATH)
	check(not defaults.is_empty(),"default JSON validates: "+str(Config.last_errors))
	var custom:=Config.load_file("res://docs/examples/four-bumper-table.json")
	check(not custom.is_empty(),"complete example JSON validates: "+str(Config.last_errors))
	if defaults.is_empty() or custom.is_empty():quit(1);return
	var model=Physics.new(custom)
	check(model.BUMPERS.size()==4 and model.ROLLERS.size()==5 and model.BANKS.size()==4,"target arrays are not fixed at 3/3/6")
	check(model.rails[0][0]==Vector2(78,639),"rail geometry comes from JSON")
	check(model.multiplier==2,"configured starting multiplier")
	var events:Array=[]
	model.scored.connect(func(points,at,kind):events.append({"points":points,"at":at,"kind":kind}))
	model.live=true;model.in_lane=false;model.save_left=0
	model.pos=model.BUMPERS[3]+Vector2(0,-27);model.vel=Vector2(0,400)
	model.tick(1.0/60)
	check(events.any(func(e):return e.kind=="bumper" and e.points==1000 and e.at==model.BUMPERS[3]),"added bumper uses its position, radius and individual points")
	events.clear()
	for i in model.ROLLERS.size():
		model.pos=model.ROLLERS[i];model.vel=Vector2(0,1);model.tick(1.0/60)
	check(model.multiplier==4,"all five configured rollovers increase multiplier by two")
	check(events.any(func(e):return e.kind=="multiplier" and e.points==4800),"completion reward uses the new multiplier")
	model.prepare_ball();model.charge=0.6;model.release_plunger()
	for i in 180:
		model.tick(1.0/60)
		if not model.in_lane:break
	check(events.any(func(e):return e.kind=="skill" and e.points==2200),"skill shot uses the configured charge window and points")
	var rules=Rules.new(custom)
	check(rules.goals==[4,5,4],"mission goals are loaded")
	check(rules.award(100,Vector2(10,10),"bank")==100,"first chain link has no bonus")
	check(rules.award(100,Vector2(20,10),"bank")==115 and rules.chain_time==4.5,"configured chain bonus and timer")
	rules.tick(4.6);check(rules.chain==0,"configured chain expires")
	rules.start_nova()
	check(rules.nova_time==24,"configured multiball timer")
	check(rules.award(0,model.BUMPERS[0],"bumper")==4500 and rules.last_jackpot,"jackpot target uses bumper ID rather than a hard-coded center")
	rules.award(0,model.BUMPERS[0],"bumper");check(not rules.last_jackpot,"configured jackpot cooldown")
	# Reordered, shorter mission list and disabled chain must still progress independently.
	var reordered:Dictionary=custom.duplicate(true)
	reordered.missions=[reordered.missions[2],reordered.missions[0]]
	reordered.missions[0].goal=1;reordered.missions[0].bonus=700
	reordered.scoring.chain.enabled=false
	var alternate=Rules.new(reordered)
	check(alternate.award(50,Vector2(12,12),"bank")==750 and alternate.stage==1,"mission order, count and bonus are data-driven without chains")
	var free:Dictionary=custom.duplicate(true);free.missions=[];free.multiball.enabled=false
	check(Config.validate(free).is_empty(),"free-play configuration validates")
	var free_rules=Rules.new(free);free_rules.award(100,Vector2.ZERO,"bumper")
	check(free_rules.active_mission().is_empty() and not free_rules.pending_nova,"empty mission list is supported")
	var bad:Dictionary=custom.duplicate(true);bad.table.bumpers[0].radius=-1
	check(not Config.validate(bad).is_empty(),"negative radii rejected")
	bad=custom.duplicate(true);bad.scoring.chain.secnds=3
	check(Config.validate(bad).any(func(e):return "unknown field" in e),"misspelled settings rejected")
	bad=custom.duplicate(true);bad.scoring.jackpot.bumper_id="missing"
	check(Config.validate(bad).any(func(e):return "bumper_id" in e),"dangling jackpot references rejected")
	bad=custom.duplicate(true);bad.scoring.multiplier.cap=1
	check(not Config.validate(bad).is_empty(),"invalid multiplier range rejected")
	bad=custom.duplicate(true);bad.table.bumpers.append(bad.table.bumpers[0].duplicate(true))
	check(not Config.validate(bad).is_empty(),"duplicate target IDs rejected")
	bad=custom.duplicate(true);bad.table.rails[0].b=bad.table.rails[0].a.duplicate()
	check(not Config.validate(bad).is_empty(),"zero-length rails rejected")
	bad=custom.duplicate(true);bad.table.bumpers[0].position=[1]
	check(not Config.validate(bad).is_empty(),"malformed vectors fail cleanly")
	bad=custom.duplicate(true);bad.scoring.skill_shot.charge_min=0.9
	check(not Config.validate(bad).is_empty(),"reversed skill window rejected")
	var edited_size:Dictionary=custom.duplicate(true)
	edited_size.table.size=[600,900];edited_size.table.drain_y=920
	check(Config.validate(edited_size).is_empty(),"different board dimensions validate")
	var game=load("res://scenes/main.tscn").instantiate()
	game.configuration_override=edited_size;game.testing=true;root.add_child(game)
	game.tutorial_seen=true;game.tutorial_version=game.Tutorial.VERSION;game.set_physics_process(false)
	await process_frame
	check(game.balls==5 and game.table_size==Vector2(600,900) and game.table_scale<1,"runtime HUD and board fit follow custom settings")
	game.start_game();game.sim.live=true;game.sim.in_lane=false;game.sim.pos=Vector2(240,300)
	game._begin_nova()
	check(game.extra_balls.size()==1 and game._live_count()==2,"multiball spawn count follows configuration")
	game.rules.nova_time=10;game._layout();game.queue_redraw()
	await process_frame
	game.state="gameover";game._layout();await process_frame
	game.start_game()
	check(game.balls==5 and game.score==0 and game.extra_balls.is_empty(),"customized replay resets the configured ball credits")
	game.rules=free_rules;game._layout();game.queue_redraw();await process_frame
	root.get_node("AudioDirector").release_streams()
	game.queue_free();await process_frame;await process_frame
	if DisplayServer.get_name()!="headless":await create_timer(0.15).timeout
	if errors.is_empty():print("[template-config] PASS: JSON/schema, custom collisions, counts, scoring, progression, validation, board fit, HUD, multiball and replay");quit(0)
	else:print("[template-config] FAIL: ",errors);quit(1)
