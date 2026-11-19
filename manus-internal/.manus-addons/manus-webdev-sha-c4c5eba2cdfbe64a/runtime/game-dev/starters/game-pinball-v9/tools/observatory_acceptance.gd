extends SceneTree
var g
var errors:Array[String]=[]
var capture:=false
func _initialize()->void:call_deferred("run")
func check(test:bool,label:String)->void:
	if not test:errors.append(label);push_error(label)
func step(n:=1)->void:
	for i in n:g._physics_process(1.0/60);g._process(1.0/60)
func snap(name:String)->void:
	if not capture:return
	g.queue_redraw()
	await process_frame;await process_frame;await RenderingServer.frame_post_draw
	root.get_texture().get_image().save_png("res://captures/"+name+".png")
	print("CAPTURE ",name)
func launch(charge:float)->void:
	g.sim.begin_charge()
	while g.sim.charge<charge:step()
	g.sim.release_plunger()
	for i in 120:
		step()
		if not g.sim.in_lane:break
func physical_hit(p:Vector2,kind:String)->void:
	g.sim.live=true;g.sim.in_lane=false;g.sim.save_left=0
	g.sim.bumper_cool.fill(0.0);g.sim.roller_cool.fill(0.0);g.sim.bank_cool.fill(0.0)
	if kind=="bumper":g.sim.pos=p+Vector2(0,-39);g.sim.vel=Vector2(0,420)
	elif kind=="rollover":g.sim.pos=p+Vector2(0,-25);g.sim.vel=Vector2(0,420)
	elif kind=="bank":g.sim.pos=p+Vector2(16,0);g.sim.vel=Vector2(-420,0)
	step(4)
func run()->void:
	capture=OS.get_environment("COMET_CAPTURE")=="1"
	root.size=Vector2i(1280,900)
	g=load("res://scenes/main.tscn").instantiate();g.testing=true;root.add_child(g)
	check(not g.music_ready and g.find_children("*","SubViewport",true,false).is_empty(),"title starts without deferred music or any background viewport")
	g.testing=true;g.tutorial_seen=true;g.tutorial_version=g.Tutorial.VERSION;g.reduced=false;g.zh=false;g.set_physics_process(false);g.start_game()
	await process_frame
	launch(0.58)
	check(g.rules.skills==1 and g.score>=1500,"sweet-spot awards exactly one actual launch skill shot")
	step(15);check(g.rules.skills==1,"skill shot cannot repeat during a ball save")
	# Deterministic contact fixtures exercise the genuine collision path; no score/stage assignment.
	for i in 9:physical_hit(g.sim.BUMPERS[i%3],"bumper")
	check(g.rules.stage==1,"nine real bumper contacts ignite the reactor")
	g.sim.roller_lit=[false,false,false]
	for i in 3:physical_hit(g.sim.ROLLERS[i],"rollover")
	check(g.rules.stage==2,"three actual rollovers align the reactor")
	check(g.sim.multiplier>=2,"the original I/II/III multiplier remains functional")
	for i in 3:physical_hit(g.sim.BANKS[i],"bank")
	check(g.rules.multiball and g.extra_balls.size()==2 and g._live_count()==3,"real bank contacts trigger three physically live balls")
	var before:Vector2=g.extra_balls[0].model.pos
	step(8)
	check(g.extra_balls[0].model.pos.distance_to(before)>5,"extra balls move through real physics, not just rendering")
	physical_hit(g.sim.BUMPERS[2],"bumper")
	check(g.rules.jackpots==1,"central bumper pays a jackpot")
	physical_hit(g.sim.BUMPERS[2],"bumper")
	check(g.rules.jackpots==1,"jackpot cooldown rejects rapid repeated contact")
	check(g.find_children("*","SubViewport",true,false).is_empty(),"missions and multiball never create background viewports")
	check(g.comet_fx.emit_accumulator.size()==3,"all three physical balls emit comet particles")
	check(g.comet_fx.dust.size()>0,"actual surface collisions emit stardust")
	await snap("13-supernova")
	step(6);await snap("14-supernova-motion")
	var timer:float=g.rules.nova_time
	var chain_timer:float=g.rules.chain_time
	var positions:Array=[g.sim.pos,g.extra_balls[0].model.pos,g.extra_balls[1].model.pos]
	var cosmos_clock:float=g.comet_fx.clock
	var dust_life:float=g.comet_fx.dust[0].life if not g.comet_fx.dust.is_empty() else -1.0
	g.toggle_pause();step(60)
	check(g.comet_fx.clock==cosmos_clock,"pause freezes comet flicker")
	if dust_life>0:check(g.comet_fx.dust[0].life==dust_life,"pause freezes stardust lifetime")
	check(is_equal_approx(g.rules.nova_time,timer) and is_equal_approx(g.rules.chain_time,chain_timer),"pause freezes mission and chain timers")
	check(g.sim.pos==positions[0] and g.extra_balls[0].model.pos==positions[1],"pause freezes every live ball")
	g.toggle_pause()
	var v:Vector2=g.sim.vel;g._nudge()
	check(g.sim.vel.y<v.y and g.nudge_cool>0,"nudge applies bounded physical impulse")
	v=g.sim.vel;g._nudge();check(g.sim.vel==v,"nudge cooldown prevents repeated impulse")
	# Rule-only boundary assertions are separate from the complete physical play test.
	var r=load("res://scripts/comet_rules.gd").new()
	r.award(100,Vector2(170,240),"bumper");r.award(100,Vector2(170,240),"bumper")
	check(r.chain==1,"same target cannot farm chain links")
	r.award(100,Vector2(294,240),"bumper");check(r.chain==2,"different targets extend the chain")
	r.tick(3.1);check(r.chain==0,"chain expires after its advertised window")
	var credits:int=g.balls
	g.sim.save_left=0;g.sim.pos=Vector2(230,755);g.sim.vel=Vector2(0,350)
	step(2)
	check(g.balls==credits and g._live_count()>=1,"losing main ball in multiball does not spend a credit")
	for e in g.extra_balls:e.model.save_left=0;e.model.pos=Vector2(232,755);e.model.vel=Vector2(0,350)
	step(4)
	check(g.balls==credits-1,"only the final live drain spends one ball credit")
	check(g.state=="gameover" and g.stage_completed and g.run_score.result().outcome=="victory","completing the physical jackpot phase finalizes stage victory")
	g.start_game();launch(0.58)
	g._open_settings();await snap("15-observatory-settings")
	g.buttons.effects.pressed.emit()
	check(g.reduced and g.juice.reduced_motion,"effects control enables reduced mode")
	g._close_settings();g.juice.hit(Vector2(232,345),"jackpot",g.VIOLET,2.0)
	step(1);check(g.juice.shake==0,"reduced effects removes table shake")
	var still_clock:float=g.comet_fx.clock
	step(8)
	check(g.comet_fx.clock==still_clock and g.comet_fx.particles.is_empty(),"reduced mode stops comet flicker and fire")
	await snap("16-reduced-effects")
	g.reduced=false;g.juice.reduced_motion=false
	root.content_scale_size=Vector2i.ZERO;root.size=Vector2i(540,1080)
	await process_frame;g._layout();g.buttons.locale.pressed.emit()
	await snap("17-portrait-mission-cn")
	g._open_settings();await snap("18-portrait-settings-cn");g._close_settings()
	g.toggle_pause()
	g.buttons.menu.pressed.emit()
	check(g.modal=="title" and g.state=="paused","return-to-title asks before discarding the active run")
	for button in g.overlay.find_children("*","Button",true,false):
		if button.text==g.t("confirm.accept"):button.pressed.emit();break
	check(g.state=="title" and g.extra_balls.is_empty() and not g.rules.multiball,"return-to-title clears active mode state")
	for i in 3:
		g.juice.hit(Vector2(232,300),"bumper",g.GOLD,2.0)
		g.start_game()
	check(g.extra_balls.is_empty() and not g.rules.multiball and g.rules.chain==0 and g.rules.stage==0,"replay clears all mode state")
	check(g.juice.world_particles.is_empty() and g.juice.world_rings.is_empty(),"replay clears transient effects")
	check(g.comet_fx.particles.is_empty() and g.comet_fx.dust.is_empty(),"replay clears comet effects")
	check(g.comet_fx.heat(200)==0 and g.comet_fx.heat(1200)==1,"fire follows actual speed thresholds")
	var visual=load("res://scripts/comet_effects.gd").new()
	for i in 300:
		visual.emit_comet(0,Vector2(232,300),Vector2(1000,500),1.0/60)
		visual.impact(Vector2(100,300),Vector2.RIGHT,1000)
	check(visual.particles.size()<=visual.MAX_EMBERS and visual.dust.size()<=visual.MAX_DUST,"new particle pools stay bounded")
	visual.tick(0.05,false,true)
	check(visual.particles.is_empty(),"reduced mode clears residual fire immediately")
	for i in 8:
		g._process(1.0/60)
		await process_frame
	check(g.music_ready and g.optional_loading.done,"optional media loads between safe frames")
	var audio=root.get_node("AudioDirector")
	check(audio._streams["music.gameplay"].get_length()>100 and audio._streams["music.gameplay"].loop,"custom BGM is a long looping stream")
	var font:Font=load("res://assets/template/fonts/ui_regular.tres")
	var code:=FileAccess.get_file_as_string("res://localization/zh_CN.json")
	for i in code.length():
		var cp:=code.unicode_at(i)
		if cp>=0x4E00 and cp<=0x9FFF:check(font.has_char(cp),"new CN glyph "+str(cp))
	root.get_node("AudioDirector").release_streams()
	g.queue_free();await process_frame;await process_frame
	if DisplayServer.get_name()!="headless":await create_timer(0.15).timeout
	if errors.is_empty():print("[observatory-tests] PASS: skill shot, contact-driven missions, physical multiball, jackpot, timers, nudge, chain, drain economy, reduced effects, reset, CN glyphs");quit(0)
	else:print("[observatory-tests] FAIL: ",errors);quit(1)
