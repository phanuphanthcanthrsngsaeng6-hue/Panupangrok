extends "res://scripts/comet_main.gd"
const CometEffects = preload("res://scripts/comet_effects.gd")
const Rules = preload("res://scripts/comet_rules.gd")
const Juice = preload("res://scripts/comet_juice.gd")
const OptionalLoading=preload("res://scripts/comet_loading.gd")
var optional_loading=OptionalLoading.new()
const CAP = preload("res://assets/template/observatory/bumper.png")
const VIOLET := Color("b69aff")
var comet_fx = CometEffects.new()
var rules
var juice = Juice.new()
var extra_balls: Array = []
var nova_queued := false
var nudge_cool := 0.0
var reduced := false
var best_chain_record := 0
var displayed_score := 0.0
var ui_hover := {}
var control_pulse := {"left":0.0,"right":0.0,"launch":0.0}
var motion_clock := 0.0
var pause_offset := Vector2.ZERO
const Cabinet = preload("res://scripts/comet_cabinet.gd")
## Cabinet presentation: materials helper plus screen-entrance and attract clocks.
var cab = Cabinet.new()
var screen_key := ""
var screen_time := 0.0
var attract_step := 0.0
var _ray_cache := {}

func _ready() -> void:
	super._ready()
	if cfg.is_empty() or state=="config_error":return
	rules=Rules.new(cfg)
	comet_fx.bounds=_surface_rect()
	optional_loading.prepared.connect(_optional_prepared)
	if OS.has_feature("web"):
		JavaScriptBridge.eval("window.dispatchEvent(new Event('comet-title-ready'));",true)
	sim.contacted.connect(_on_surface_contact)
	rules.stage_completed.connect(_on_stage)
	rules.supernova_requested.connect(func(): nova_queued = true)
	juice.reduced_motion = reduced
	_message(t("ui.charge_the_cyan_window_for_a_skill_shot") if cfg.scoring.skill_shot.enabled else t("ui.hold_and_release_to_launch"))

func _load_save() -> void:
	super._load_save()
	var f := ConfigFile.new()
	if f.load(SAVE_PATH)==OK:
		reduced = bool(f.get_value("settings","reduced",false))
		best_chain_record = int(f.get_value("game","best_chain",0))

func _save() -> void:
	if testing: return
	super._save()
	var f := ConfigFile.new()
	f.load(SAVE_PATH)
	f.set_value("settings","reduced",reduced)
	f.set_value("game","best_chain",best_chain_record)
	f.save(SAVE_PATH)

func start_game() -> void:
	extra_balls.clear(); rules.reset(); juice.reset(); comet_fx.reset(); nova_queued = false
	nudge_cool = 0; displayed_score = 0; ui_hover.clear()
	super.start_game()
	_message(t("ui.cyan_charge_window_skill_shot"))

func _release_inputs() -> void:
	super._release_inputs()
	for e in extra_balls:
		e.model.set_flipper("left",false); e.model.set_flipper("right",false)

func _flipper_input(which: String, pressed: bool) -> void:
	var was: bool = sim.left if which=="left" else sim.right
	super._flipper_input(which,pressed)
	for e in extra_balls: e.model.set_flipper(which,pressed)
	if pressed and not was:
		control_pulse[which] = 0.25
		juice.hit(sim.LEFT_PIVOT if which=="left" else sim.RIGHT_PIVOT,"flipper",CYAN,0.25)
		juice.ui_burst(_control_rect(which).get_center(),CYAN)

func _touch_press(action: String, down: bool) -> void:
	if action=="launch" and _live_count()>0 and delay_next<=0:
		if down: _nudge()
		return
	super._touch_press(action,down)
	if down: control_pulse[action] = 0.3

func _input(event: InputEvent) -> void:
	if event is InputEventKey and not event.echo and event.physical_keycode in [KEY_SPACE,KEY_UP] and state=="playing" and not tutorial_open and not settings_open and _live_count()>0:
		if event.pressed: _nudge()
		return
	super._input(event)

func _nudge() -> void:
	if nudge_cool>0 or _live_count()==0: return
	nudge_cool = cfg.gameplay.nudge_cooldown
	var models := [sim]
	for e in extra_balls: models.append(e.model)
	for m in models:
		if m.live and not m.in_lane:
			m.vel.y -= cfg.gameplay.nudge_y
			m.vel.x += (cfg.gameplay.nudge_center_x-m.pos.x)*cfg.gameplay.nudge_center_strength
	juice.hit(Vector2(cfg.gameplay.nudge_center_x,cfg.table.flippers.left.pivot[1]),"nudge",CYAN,0.65)
	juice.ui_burst(_control_rect("launch").get_center(),CYAN)
	control_pulse.launch = 0.4
	_cue("player.nudge",0.75)

func _on_score(points: int, at: Vector2, kind: String) -> void:
	var earned: int = rules.award(points,at,kind)
	run_score.award(kind, earned)
	if earned>0:
		hits += 1
		popups.append({"pos":at,"text":"+%d"%earned,"life":0.9})
		if popups.size()>16: popups.pop_front()
		juice.ui_transfer(table_origin+at*table_scale,Vector2(1100,191) if not compact else Vector2(150,144),VIOLET if rules.last_jackpot else GOLD)
	var color := VIOLET if rules.multiball else (CYAN if kind in ["rollover","skill","save"] else GOLD)
	juice.hit(at,kind,color,1.35 if rules.last_jackpot else (0.45 if kind=="flipper" else 0.8))
	if rules.linked: juice.link(rules.chain_link_from,at,CYAN)
	if kind in ["bumper","bank","sling"]: _cue("enemy.impact",0.92+float(hits%4)*0.075)
	elif kind=="rollover": _cue("score.reward",1.0+minf(rules.chain,8)*0.025)
	elif kind=="multiplier":
		max_multiplier = maxi(max_multiplier,sim.multiplier)
		_cue("game.victory")
		_message(t("ui.orbit_complete_dx")%sim.multiplier)
	elif kind=="save":
		_message(t("ui.ball_saved")); _cue("score.reward")
	if rules.last_skill:
		_message(t("ui.skill_shot_s") % _number(int(cfg.scoring.skill_shot.points))); _cue("game.victory",1.12)
		juice.link(TemplateConfig.vec(cfg.table.launcher.spawn),at,CYAN)
	if rules.last_jackpot:
		_message(t("ui.jackpot_s") % _number(int(cfg.scoring.jackpot.points))); _cue("game.victory",1.22)
		juice.ui_burst(Vector2(1080,197) if not compact else Vector2(157,150),VIOLET,true)

func _on_stage(index: int, _bonus: int) -> void:
	var next:=index+1
	var text:=t("mission."+cfg.missions[next].id+".objective") if next<cfg.missions.size() else (t("ui.supernova_jackpots_are_live") if cfg.multiball.enabled else t("ui.mission_cycle_complete"))
	_message(text);_cue("game.victory",1.0+index*0.12)
	juice.hit(TemplateConfig.vec(cfg.table.labels.multiplier),"milestone",VIOLET if index==cfg.missions.size()-1 else CYAN,1.6)
	juice.ui_burst(Vector2(190,508) if not compact else Vector2(270,186),CYAN,true)

func _live_count() -> int:
	var count := 1 if sim.live else 0
	for e in extra_balls:
		if e.model.live: count += 1
	return count

func _begin_nova() -> void:
	nova_queued = false
	if state!="playing" or not sim.live: rules.pending_nova=false; rules.stage=maxi(0,rules.missions.size()-1); rules.progress=maxi(0,int(rules.goals.back())-1); return
	rules.start_nova()
	for spawn in cfg.multiball.spawns:
		var model = Physics.new(cfg)
		model.live = true; model.in_lane = false
		model.pos = TemplateConfig.vec(spawn.position)
		model.vel = TemplateConfig.vec(spawn.velocity)
		model.multiplier = sim.multiplier; model.roller_lit = sim.roller_lit
		model.save_left = cfg.multiball.spawn_save_seconds
		model.set_flipper("left",sim.left); model.set_flipper("right",sim.right)
		model.scored.connect(_extra_score.bind(weakref(model)))
		model.contacted.connect(_on_surface_contact)
		extra_balls.append({"model":model,"trail":[]})
		juice.hit(model.pos,"spawn",VIOLET,1.4)
	_message(t("ui.supernova_d_balls") % (cfg.multiball.spawns.size()+1))
	_cue("game.victory",0.85)

func _extra_score(points: int, at: Vector2, kind: String, model_ref: WeakRef) -> void:
	var model = model_ref.get_ref()
	if model==null: return
	if kind=="multiplier":
		sim.multiplier = maxi(sim.multiplier,model.multiplier)
		sim.roller_lit = model.roller_lit
	_on_score(points,at,kind)

func _on_drain() -> void:
	# Main-ball drain during multiball is not a spent credit; wait for the last survivor.
	if _live_count()>0 or delay_next>0 or state!="playing": return
	extra_balls.clear(); comet_fx.forget_emitters()
	if rules.multiball: rules.finish_nova()
	rules.drain()
	best_chain_record = maxi(best_chain_record,rules.best_chain)
	super._on_drain()
	juice.hit(Vector2(table_size.x/2,table_size.y-30),"drain",Color("e89483"),1.15)

func _physics_process(dt: float) -> void:
	if state!="playing" or tutorial_open or settings_open: return
	rules.tick(dt); nudge_cool = maxf(0,nudge_cool-dt)
	if delay_next>0:
		delay_next -= dt
		if delay_next<=0: sim.prepare_ball(); _message(t("ui.next_comet_ready"))
		return
	sim.tick(dt)
	if sim.live:
		_sample_trail(trail,sim.pos)
		comet_fx.emit_comet(0,sim.pos,sim.vel,dt)
	else: trail.clear()
	for e in extra_balls:
		e.model.multiplier = sim.multiplier
		e.model.roller_lit = sim.roller_lit
		e.model.tick(dt)
		if e.model.live:
			_sample_trail(e.trail,e.model.pos)
			comet_fx.emit_comet(e.model.get_instance_id(),e.model.pos,e.model.vel,dt,true)
		else:e.trail.clear()
	if nova_queued: _begin_nova()
	if not extra_balls.is_empty():
		var live := _live_count()
		if live==0: _on_drain()
		elif live==1:
			# Transfer the surviving real state, never invent a replacement ball or a life.
			if not sim.live:
				for e in extra_balls:
					if e.model.live:
						sim.pos=e.model.pos; sim.vel=e.model.vel; sim.live=true; sim.in_lane=false
						sim.save_left=e.model.save_left; trail.assign(e.trail)
						break
			extra_balls.clear(); rules.finish_nova(); comet_fx.forget_emitters()
			_message(t("ui.one_comet_remains_build_the_core"))

func _process(dt: float) -> void:
	AudioDirector.set_music_suspended(state=="paused" or settings_open or tutorial_open)
	# Single-thread Web: optional work is bounded and restricted to non-action windows.
	optional_loading.tick(state!="playing" or tutorial_open or settings_open or _live_count()==0)
	time += dt
	var frozen := state=="paused" or tutorial_open or settings_open
	if not frozen:
		motion_clock += dt
		toast_time = maxf(0,toast_time-dt)
		for p in popups: p.life-=dt; p.pos.y-=dt*(8 if reduced else 28)
		popups=popups.filter(func(p):return p.life>0)
	juice.reduced_motion = reduced
	comet_fx.tick(dt,frozen,reduced)
	juice.tick(dt,frozen)
	displayed_score = move_toward(displayed_score,score,maxf(450,float(score)-displayed_score)*dt*9)
	for key in control_pulse: control_pulse[key]=maxf(0,control_pulse[key]-dt)
	var key := "%s|%s|%s" % [state, settings_open, tutorial_open]
	if key != screen_key:
		screen_key = key
		screen_time = 0.0
	screen_time += dt
	if not reduced: attract_step += dt*(8.0 if state == "title" else 3.0)
	_animate_buttons(dt)
	queue_redraw()

func _layout() -> void:
	super._layout()
	if sim==null:return
	var slot:=Rect2(42,211,456,703) if compact else Rect2(400,103,480,740)
	table_scale=minf(slot.size.x/table_size.x,slot.size.y/table_size.y)
	table_origin=slot.position+(slot.size-table_size*table_scale)/2
	if not compact and buttons.has("start"):
		buttons.start.position=origin+Vector2(40,742)*unit
		buttons.how.position=origin+Vector2(40,814)*unit

func _button(id: String, label: String, rect: Rect2, callback: Callable, primary := false) -> void:
	var action:Callable=callback
	if id=="menu":
		action=func():
			_release_inputs();extra_balls.clear();rules.reset();juice.reset();comet_fx.reset();nova_queued=false
			callback.call()
	super._button(id,label,rect,action,primary)
	var b: Button=buttons[id]
	b.mouse_entered.connect(func(): ui_hover[id]=true)
	b.mouse_exited.connect(func():ui_hover.erase(id))
	b.focus_entered.connect(func():ui_hover[id]=true)
	b.focus_exited.connect(func():ui_hover.erase(id))
	b.button_down.connect(func():juice.ui_burst((b.position+b.size/2-origin)/unit,CYAN,primary))

func _draw() -> void:
	if sim==null:return
	draw_rect(Rect2(Vector2.ZERO,get_viewport_rect().size),BG)
	draw_set_transform(origin,0,Vector2.ONE*unit)
	# One static image is shared by UI screens and the playfield.
	_draw_backdrop()
	if compact: _mobile_hud()
	else: _side_panels()
	_draw_cabinet_body()
	var jolt:=Vector2.ZERO
	if not reduced and state=="playing" and not settings_open and not tutorial_open:
		jolt=Vector2(sin(motion_clock*101),cos(motion_clock*83))*minf(juice.shake,2.0)*float(TuningStore.get_active_value("environment.camera.shake_multiplier",1.0))
	draw_set_transform(origin+(table_origin+jolt)*unit,0,Vector2.ONE*unit*table_scale)
	_draw_table()
	_draw_table_glass()
	draw_set_transform(origin,0,Vector2.ONE*unit)
	if state!="title" or not compact: _draw_controls()
	juice.draw_ui(self)
	if compact and state=="title": _compact_title()
	if state=="paused" and not settings_open: _draw_modal("pause")
	if state=="gameover" and not settings_open: _draw_modal("result")
	if tutorial_open and not settings_open: _draw_tutorial()
	if settings_open: _draw_settings()

# --- Cabinet presentation -------------------------------------------------

## 0..1 progress of a screen-entrance element that starts after `delay` seconds.
func _entrance(delay: float, duration := 0.5) -> float:
	if reduced: return 1.0
	return clampf((screen_time-delay)/duration, 0.0, 1.0)

static func _back(k: float) -> float:
	var x := k-1.0
	return 1.0+2.5*x*x*x+1.5*x*x

## Offsets and fades one title-screen group (panels slide in from `from`).
func _group(delay: float, from: Vector2) -> void:
	var k := _entrance(delay, 0.6) if state == "title" else 1.0
	draw_set_transform(origin+from*(1.0-_back(k))*unit,0,Vector2.ONE*unit)
	draw_alpha = clampf(k*1.6,0,1)
	cab.alpha = draw_alpha

func _group_end() -> void:
	draw_set_transform(origin,0,Vector2.ONE*unit)
	draw_alpha = 1.0
	cab.alpha = 1.0

func _animate_buttons(dt: float) -> void:
	var i := 0
	for id in buttons:
		var b: Button = buttons[id]
		if not is_instance_valid(b) or b.is_queued_for_deletion(): continue
		if not b.has_meta("base_pos"): b.set_meta("base_pos", b.position)
		var k := _entrance(0.3+0.07*i, 0.45)
		b.position = b.get_meta("base_pos")+Vector2(0, 14.0*(1.0-_back(k)))*unit
		b.modulate.a = clampf(k*1.8, 0, 1)
		var hover: float = move_toward(float(b.get_meta("fx_hover", 0.0)), 1.0 if b.is_hovered() else 0.0, dt*8.0)
		var focus: float = move_toward(float(b.get_meta("fx_focus", 0.0)), 1.0 if b.has_focus(true) else 0.0, dt*7.0)
		b.set_meta("fx_hover", hover)
		b.set_meta("fx_focus", focus)
		i += 1

## Paints the cabinet art under every Button (their theme styles are empty).
func _paint_buttons() -> void:
	draw_set_transform(origin,0,Vector2.ONE*unit)
	for id in buttons:
		var b: Button = buttons[id]
		if not is_instance_valid(b) or b.is_queued_for_deletion() or not b.visible: continue
		var kind: String = b.get_meta("cabinet_kind", "secondary")
		if id in ["locale", "mute", "settings"]: kind = "small"
		var rect := Rect2((b.position-origin)/unit, b.size/unit)
		var hover := float(b.get_meta("fx_hover", 0.0))
		var focus := float(b.get_meta("fx_focus", 0.0))
		var press := 1.0 if b.get_draw_mode() in [BaseButton.DRAW_PRESSED, BaseButton.DRAW_HOVER_PRESSED] else 0.0
		cab.alpha = b.modulate.a
		if kind == "quiet":
			if hover > 0.01 or focus > 0.01:
				var y := rect.end.y-6
				draw_line(Vector2(rect.position.x+2, y), Vector2(rect.position.x+2+(rect.size.x-4)*maxf(hover, focus), y), Color(CYAN, 0.8*maxf(hover, focus)*cab.alpha), 1.0, true)
			continue
		var blink := 0.0
		if kind == "primary": blink = (0.35+0.65*pow(0.5+0.5*sin(time*4.2), 2.0)) if state == "title" and not reduced else 0.45
		cab.button(self, rect, kind, hover, press, focus, time, blink)
	for slider in ui.get_children():
		if slider is HSlider and not slider.is_queued_for_deletion(): _paint_slider(slider)
	cab.alpha = 1.0

func _paint_slider(slider: HSlider) -> void:
	var r := Rect2((slider.position-origin)/unit, slider.size/unit)
	var y := r.get_center().y
	var track := Rect2(r.position.x+4, y-5, r.size.x-8, 10)
	var ratio := float((slider.value-slider.min_value)/maxf(0.0001, slider.max_value-slider.min_value))
	var knob_r := 13.0
	var x := track.position.x+knob_r+(track.size.x-knob_r*2)*ratio
	cab.flat(self, track.grow(3), 8, Color(0,0,0,0.55))
	cab.fill(self, track, 5, Cabinet.metal("dark"))
	# Lit lamp segments up to the value.
	var n := 18
	for i in n:
		var sx := track.position.x+6+(track.size.x-12)*float(i)/(n-1)
		var on: bool = sx <= x
		draw_circle(Vector2(sx, y), 2.4, Color(CYAN, 0.95) if on else Color("1f3342"))
		if on: draw_circle(Vector2(sx, y), 5, Color(CYAN, 0.12))
	var focus := 1.0 if slider.has_focus(true) else 0.0
	if focus > 0: for i in 3: draw_circle(Vector2(x, y), knob_r+4+i*3, Color(CYAN, 0.16-i*0.04))
	cab.shadow(self, Rect2(x-knob_r, y-knob_r, knob_r*2, knob_r*2), knob_r, 3)
	draw_circle(Vector2(x, y), knob_r, Cabinet.BRASS_LO)
	draw_circle(Vector2(x, y-0.8), knob_r-1.5, Cabinet.BRASS)
	draw_circle(Vector2(x-2, y-3), knob_r*0.55, Cabinet.BRASS_HI)
	draw_circle(Vector2(x, y), knob_r*0.36, Color("2a1a0a"))
	draw_circle(Vector2(x, y), knob_r*0.2, Color(CYAN, 0.9))

func _vgrad_rect(r: Rect2, top: Color, bottom: Color) -> void:
	draw_polygon(PackedVector2Array([r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]), PackedColorArray([top, top, bottom, bottom]))

func _draw_backdrop() -> void:
	var drift := Vector2.ZERO if reduced else Vector2(sin(time*0.05), cos(time*0.037))*10.0
	draw_texture_rect(STATIC_BG,Rect2(Vector2(-14,-14)+drift,layout_size+Vector2(28,28)),false,Color(0.62,0.66,0.86,0.44))
	var w := layout_size.x
	var h := layout_size.y
	_vgrad_rect(Rect2(0,0,w,110), Color(0,0,0,0.5), Color(0,0,0,0))
	_vgrad_rect(Rect2(0,h-150,w,150), Color(0,0,0,0), Color(0,0,0,0.55))
	# Comet sparkle: a sparse, deterministic field of twinkling stars.
	for i in 44:
		var p := Vector2(fposmod(i*211.7+37.0, w), fposmod(i*163.9+float(i*i)*3.1, h))
		var tw := 0.6 if reduced else 0.5+0.5*sin(time*(0.7+float(i%5)*0.35)+float(i)*1.7)
		var a := 0.12+0.6*pow(tw, 3.0)
		var r := 0.7+float(i%3)*0.45
		draw_circle(p, r, Color(1,0.95,0.85,a))
		if i%7 == 0:
			draw_line(p-Vector2(r*5,0), p+Vector2(r*5,0), Color(1,0.9,0.7,a*0.45), 1, true)
			draw_line(p-Vector2(0,r*5), p+Vector2(0,r*5), Color(1,0.9,0.7,a*0.45), 1, true)

## Lacquered cabinet body, chrome side rails and the apron that carries the flipper buttons.
func _draw_cabinet_body() -> void:
	var tr := Rect2(table_origin, table_size*table_scale)
	var body := Rect2(tr.position.x-16, tr.position.y-12, tr.size.x+32, layout_size.y-tr.position.y+40)
	cab.shadow(self, body, 18, 10)
	cab.fill(self, body, 18, [[0.0,Color("04080f")],[0.1,Color("1b2942")],[0.5,Color("0c1526")],[0.9,Color("1b2942")],[1.0,Color("04080f")]], Vector2(1,0))
	cab.outline(self, body.grow(-4), 15, Color(GOLD,0.3), 1)
	var top := tr.position.y+34
	var bottom := tr.end.y-16
	cab.rail(self, Vector2(tr.position.x-9, top), Vector2(tr.position.x-9, bottom), 6)
	cab.rail(self, Vector2(tr.end.x+9, top), Vector2(tr.end.x+9, bottom), 6)
	if state == "title" and compact: return
	var controls := _control_rect("left").merge(_control_rect("right"))
	var apron := Rect2(Vector2(tr.position.x-8, tr.end.y+1), Vector2(tr.size.x+16, controls.end.y-tr.end.y+7))
	cab.fill(self, apron, 12, [[0.0,Color("30394b")],[0.25,Color("151c2a")],[1.0,Color("070b13")]])
	cab.outline(self, apron.grow(-2), 10, Color(GOLD,0.22), 1)
	cab.rail(self, Vector2(apron.position.x+10, apron.position.y+2), Vector2(apron.end.x-10, apron.position.y+2), 5)

func _draw_table_frame() -> void:
	var outer := Rect2(Vector2(-7,-4), table_size+Vector2(14,3))
	cab.shadow(self, outer, 26, 8)
	cab.fill(self, outer, 26, [[0.0,Color("6a4727")],[0.45,Color("352213")],[1.0,Color("170d05")]], Vector2(0.4,1))
	cab.outline(self, outer.grow(-1), 25, Color(1,0.85,0.6,0.22), 1)
	cab.fill(self, Rect2(Vector2(5,1), table_size-Vector2(10,10)), 23, Cabinet.metal("brass"), Vector2(0.3,1))
	cab.flat(self, Rect2(Vector2(9,5),table_size-Vector2(18,18)), 21, Color("0e2035"))

## Playfield glass: a faint diagonal reflection and, in attract mode, a travelling glint.
func _draw_table_glass() -> void:
	var w := table_size.x
	var h := table_size.y
	draw_polygon(PackedVector2Array([Vector2(16,12),Vector2(w*0.58,12),Vector2(w*0.12,h*0.56),Vector2(16,h*0.64)]),
		PackedColorArray([Color(1,1,1,0.055),Color(1,1,1,0),Color(1,1,1,0),Color(1,1,1,0.018)]))
	if state == "title" and not reduced:
		var k := fposmod(time, 6.0)/1.4
		if k < 1.0:
			var x := -120.0+(w+240.0)*k
			var band := PackedVector2Array([Vector2(x,14),Vector2(x+34,14),Vector2(x-150,h-20),Vector2(x-184,h-20)])
			for i in band.size(): band[i].x = clampf(band[i].x, 14, w-14)
			if absf(band[1].x-band[0].x)+absf(band[2].x-band[3].x) > 2 and absf(band[0].x-band[3].x) > 1:
				draw_colored_polygon(band, Color(1,1,1,0.035))

func _glow_text(at: Vector2, text: String, size: int, color: Color, center := false, face: Font = null, glow := 1.0) -> void:
	for o in [Vector2(-2,0),Vector2(2,0),Vector2(0,-2),Vector2(0,2)]:
		_text(at+o, text, size, Color(color, 0.14*glow), false, center, face)
	_text(at, text, size, color, false, center, face)

## Backlit marquee: brass frame, nebula glass, art-deco rays, chase bulbs, logo.
func _backglass(r: Rect2, eyebrow := true) -> void:
	var face: Rect2 = cab.bezel(self, r, 18, "brass", 11)
	cab.glass(self, face, 9, Color("0b1433"), 0.0)
	var size: Vector2 = STATIC_BG.get_size()
	draw_texture_rect_region(STATIC_BG, face, Rect2(size*Vector2(0.2,0.12), size*Vector2(0.36,0.36*face.size.y/face.size.x*size.x/size.y)), Color(1.0,0.9,1.0,0.5*draw_alpha))
	var center := Vector2(face.get_center().x, face.end.y+24)
	var key := str(face)
	if not _ray_cache.has(key):
		var rays := []
		var clip := Cabinet.rounded(face.grow(-2), 8)
		for i in 15:
			var a0 := PI+PI*float(i)/15.0
			var tri := PackedVector2Array([center, center+Vector2.from_angle(a0)*900.0, center+Vector2.from_angle(a0+PI/30.0)*900.0])
			for part in Geometry2D.intersect_polygons(tri, clip): rays.append(part)
		_ray_cache[key] = rays
	for part in _ray_cache[key]: draw_colored_polygon(part, Color(GOLD, 0.06*draw_alpha))
	# A comet crosses the glass every few seconds.
	if not reduced:
		var k := fposmod(time+2.0, 5.5)/1.3
		if k < 1.0:
			var a := face.position+Vector2(14, 26)
			var b := Vector2(face.end.x-14, face.position.y+face.size.y*0.36)
			var head := a.lerp(b, k)
			var tail := a.lerp(b, maxf(0, k-0.28))
			var pts := PackedVector2Array([tail, head])
			draw_polyline_colors(pts, PackedColorArray([Color(CYAN,0), Color(Color("dffcf7"),0.8*draw_alpha)]), 3, true)
			draw_circle(head, 3, Color(1,1,1,0.9*draw_alpha))
			draw_circle(head, 7, Color(CYAN,0.25*draw_alpha))
	var logo_k := _entrance(0.25, 0.7) if state == "title" else 1.0
	var saved := draw_alpha
	draw_set_transform(origin+(_offset_now+Vector2(0,-46.0*(1.0-_back(logo_k))))*unit,0,Vector2.ONE*unit)
	draw_alpha = saved*clampf(logo_k*1.8,0,1)
	_title_lockup(Vector2(face.get_center().x, face.position.y+30), true)
	if eyebrow and state == "title": _label(Vector2(face.get_center().x, face.end.y-14), t("ui.ignite_align_release"), 12, CYAN, true)
	draw_alpha = saved
	draw_set_transform(origin+_offset_now*unit,0,Vector2.ONE*unit)
	var power := clampf((screen_time-0.05)/0.8, 0, 1) if state == "title" and not reduced else 1.0
	cab.chase(self, r.grow(-5.5), 16, attract_step, power, reduced)

## Layout-unit offset of the group currently being drawn (used by nested logo motion).
var _offset_now := Vector2.ZERO

func _title_lockup(at: Vector2,center := false,scale := 1.0) -> void:
	var x := at.x
	var pulse := 0.5 if reduced else 0.5+0.5*sin(time*1.6)
	if zh:
		_logo_word(Vector2(x,at.y+56*scale),t("brand.full"),int(54*scale),center,TITLE_FONT,pulse)
	else:
		_text(Vector2(x,at.y+4*scale),t("brand.space"),int(28*scale),GOLD,false,center,TITLE_SMALL_FONT)
		_logo_word(Vector2(x,at.y+60*scale),t("brand.pinball"),int(54*scale),center,TITLE_FONT,pulse)
	var rule_y := at.y+82*scale
	var left := x-130*scale if center else x
	var right := x+130*scale if center else x+300*scale
	draw_line(Vector2(left,rule_y),Vector2(right,rule_y),Color(GOLD,0.55*draw_alpha),1,true)
	var mid := Vector2((left+right)/2 if center else left+18*scale,rule_y)
	cab.alpha = draw_alpha
	cab.bulb(self, mid, 3.2, 0.6+0.4*pulse, CYAN.lerp(Color.WHITE, 0.4))

## Backlit logo word: warm halo, inked outline, brass underside and a travelling shine.
func _logo_word(at: Vector2,text: String,size: int,center: bool,face: Font,pulse: float) -> void:
	var p := at
	var width := face.get_string_size(text,HORIZONTAL_ALIGNMENT_LEFT,-1,size).x
	if center: p.x -= width/2
	var a := draw_alpha
	for o in [Vector2(-3,0),Vector2(3,0),Vector2(0,-3),Vector2(0,3)]:
		draw_string(face,p+o,text,HORIZONTAL_ALIGNMENT_LEFT,-1,size,Color(1.0,0.7,0.3,(0.07+0.05*pulse)*a))
	draw_string_outline(face,p+Vector2(0,4),text,HORIZONTAL_ALIGNMENT_LEFT,-1,size,6,Color(0,0,0,0.55*a))
	draw_string_outline(face,p,text,HORIZONTAL_ALIGNMENT_LEFT,-1,size,4,Color(Color("3b260c"),a))
	draw_string(face,p+Vector2(0,2),text,HORIZONTAL_ALIGNMENT_LEFT,-1,size,Color(Color("8a5f22"),a))
	var sweep := -1000.0
	if not reduced:
		var k := fposmod(time-1.2, 4.5)/0.9
		if k < 1.0: sweep = p.x-40.0+(width+80.0)*k
	for i in text.length():
		var cx := p.x+face.get_string_size(text.substr(0,i),HORIZONTAL_ALIGNMENT_LEFT,-1,size).x
		var cw := face.get_string_size(text[i],HORIZONTAL_ALIGNMENT_LEFT,-1,size).x
		var glint := exp(-pow((cx+cw*0.5-sweep)/26.0, 2.0))
		draw_char(face,Vector2(cx,p.y),text[i],size,Color(PALE.lerp(Color.WHITE,glint*0.9),a))

## Lacquered cabinet wing that the instruments are mounted into.
func _wing(r: Rect2) -> void:
	cab.shadow(self, r, 16, 8)
	cab.fill(self, r, 16, [[0.0,Color("17223a")],[0.5,Color("0b1323")],[1.0,Color("060a14")]], Vector2(0.2,1), 0.92)
	cab.outline(self, r.grow(-3), 13, Color(GOLD,0.28), 1)
	cab.outline(self, r, 16, Color(0,0,0,0.6), 1)

func _side_panels() -> void:
	_group(0.05, Vector2(-40,0))
	_wing(Rect2(30,300,323,610))
	_group(0.15, Vector2(40,0))
	_wing(Rect2(906,94,344,683))
	_offset_now = Vector2(0,-30)*(1.0-_back(_entrance(0.0,0.6))) if state == "title" else Vector2.ZERO
	_group(0.0, Vector2(0,-30))
	_backglass(Rect2(22,100,340,190))
	_group(0.12, Vector2(-70,0))
	_offset_now = Vector2.ZERO
	_mission_card()
	if state!="title":
		var face: Rect2 = cab.plate(self, Rect2(40,698,303,116), t("ui.personal_best"), LABEL_FONT)
		_num(Vector2(62,770),_number(maxi(best,score)),34,PALE)
		_text(Vector2(62,796),t("ui.best_chain_d")%maxi(best_chain_record,rules.best_chain),12,CYAN)
	elif not compact:
		_key_prompts(Vector2(42,884))
	_group(0.2, Vector2(70,0))
	_score_dmd(Rect2(916,104,324,151))
	_group(0.28, Vector2(70,0))
	_balls_plate(Rect2(916,273,156,107))
	_multiplier_plate(Rect2(1084,273,156,107))
	_group(0.36, Vector2(70,0))
	_chain_plate(Rect2(916,402,324,124))
	_group(0.44, Vector2(70,0))
	_instruction_card(Rect2(916,549,324,218))
	_group_end()

## Keyboard prompt chips under the title menu.
func _key_prompts(at: Vector2) -> void:
	var x := at.x
	for pair in [["ENTER", t("ui.prompt_start")], ["← →", t("ui.prompt_flip")], ["SPACE", t("ui.launch")]]:
		x = _keycap(Vector2(x, at.y), pair[0], 10, false)+6
		_text(Vector2(x, at.y), pair[1], 11, MUTED)
		x += BOLD.get_string_size(pair[1],HORIZONTAL_ALIGNMENT_LEFT,-1,11).x+16

## Raised keycap chip whose text baseline sits at `at.y`; returns its right edge.
func _keycap(at: Vector2, key: String, size: int, ink: bool) -> float:
	var w := BOLD.get_string_size(key,HORIZONTAL_ALIGNMENT_LEFT,-1,size).x+12
	var r := Rect2(at.x, at.y-size-5, w, size+10)
	cab.alpha = draw_alpha
	if ink:
		cab.flat(self, Rect2(r.position+Vector2(0,2), r.size), 4, Color(Cabinet.INK, 0.35))
		cab.flat(self, r, 4, Cabinet.INK)
		_text(Vector2(r.position.x+6, at.y), key, size, Cabinet.CARD, true)
	else:
		cab.flat(self, Rect2(r.position+Vector2(0,2), r.size), 4, Color(0,0,0,0.6))
		cab.fill(self, r, 4, [[0.0,Color("3a4a62")],[1.0,Color("141c2b")]])
		cab.outline(self, r, 4, Color(GOLD,0.45), 1)
		_text(Vector2(r.position.x+6, at.y), key, size, PALE, true)
	return r.end.x

func _score_dmd(r: Rect2) -> void:
	var face: Rect2 = cab.dmd_begin(self, r)
	var cx := face.get_center().x
	var big_y := face.position.y+face.size.y*0.5+30
	var top_line := ""
	var right_line := ""
	var big := _number(roundi(displayed_score))
	var big_font: Font = NUM_FONT
	var big_size := 72+roundi(rules.score_pulse/0.22*3)
	var fade := 1.0
	if state == "title":
		# Attract mode: the display cycles score, high score and a start prompt.
		var cycle := int(time/2.8)%3
		fade = 1.0 if reduced else 0.2+0.8*clampf(fposmod(time, 2.8)/0.25, 0, 1)
		if cycle == 1:
			top_line = t("ui.dmd_high_score")
			big = _number(best)
		elif cycle == 0:
			big = t("ui.dmd_press_start")
			big_font = BOLD
			big_size = 36 if not zh else 40
			big_y = face.position.y+face.size.y*0.5+18
			if not reduced: fade *= 0.6+0.4*float(int(time*2.5)%2)
		else:
			top_line = t("ui.score")
			big = _number(0)
	else:
		top_line = t("ui.score")
		right_line = t("ui.best")+_number(maxi(score,best))
	cab.dmd_text(self, big_font, Vector2(cx, big_y), big, big_size, Color(Cabinet.AMBER, fade), true)
	cab.dmd_end(self, face)
	if top_line != "": cab.dmd_text(self, BOLD, face.position+Vector2(12, 22), top_line, 12, Color(Cabinet.AMBER, 0.9*fade), false, 0.6)
	if right_line != "":
		var w := BOLD.get_string_size(right_line,HORIZONTAL_ALIGNMENT_LEFT,-1,12).x
		cab.dmd_text(self, BOLD, Vector2(face.end.x-12-w, face.position.y+22), right_line, 12, Color(Cabinet.AMBER, 0.75), false, 0.6)

func _balls_plate(r: Rect2) -> void:
	var face: Rect2 = cab.plate(self, r, t("ui.balls_left"), LABEL_FONT)
	var n := int(cfg.gameplay.balls)
	var gap := minf(36.0, (face.size.x-24)/maxf(1, n))
	var radius := minf(11.0, gap*0.4)
	var start := face.get_center().x-gap*(n-1)*0.5
	for i in n:
		var p := Vector2(start+gap*i, face.get_center().y+9)
		draw_circle(p+Vector2(0,1), radius+2.5, Color(0,0,0,0.6*draw_alpha))
		draw_circle(p, radius+1.8, Color(Cabinet.CHROME_LO, draw_alpha))
		draw_arc(p, radius+1.2, PI*1.05, PI*1.95, 16, Color(Cabinet.CHROME_HI, 0.7*draw_alpha), 1.0, true)
		draw_circle(p, radius, Color(Color("03070d"), draw_alpha))
		if i < balls: _ball(p, radius-2.5, draw_alpha)

func _multiplier_plate(r: Rect2) -> void:
	var face: Rect2 = cab.plate(self, r, t("ui.multiplier"), LABEL_FONT)
	_glow_text(Vector2(face.get_center().x, face.position.y+66), "%d×"%sim.multiplier, 38, CYAN, true, NUM_FONT)
	var cap := maxi(1, int(cfg.scoring.multiplier.cap))
	var gap := minf(24.0, (face.size.x-20)/cap)
	var start := face.get_center().x-gap*(cap-1)*0.5
	for i in cap:
		var on: bool = i < sim.multiplier
		var level := 1.0 if on else 0.0
		if state == "title" and not reduced: level = 1.0 if (int(attract_step)+i)%cap == 0 else 0.12
		cab.lamp(self, Vector2(start+gap*i, face.end.y-12), 5.0, CYAN, level)

func _chain_plate(r: Rect2) -> void:
	var face: Rect2 = cab.plate(self, r, t("ui.chain"), LABEL_FONT, GOLD, Color("06121a"))
	_glow_text(Vector2(face.position.x+24, face.end.y-26), str(rules.chain), 48+roundi(rules.chain_pulse*8), CYAN, false, NUM_FONT, 1.2)
	var seconds: float = cfg.scoring.chain.seconds
	var fraction := clampf(rules.chain_time/maxf(0.01, seconds), 0, 1)
	var segments := 14
	var x0 := face.position.x+84
	var seg_w := (face.end.x-14-x0)/segments
	for i in segments:
		var cell := Rect2(x0+i*seg_w+1, face.position.y+36, seg_w-3, 13)
		var on: bool = float(i)/segments < fraction
		if on: cab.flat(self, cell.grow(3), 5, Color(CYAN, 0.12))
		cab.fill(self, cell, 3, [[0.0, Color("c8fbf4")], [0.45, CYAN], [1.0, Color("2a8f88")]] if on else [[0.0, Color("1a2a36")], [1.0, Color("0b141c")]])
	var cap := maxi(1, int(cfg.scoring.chain.cap))
	for i in cap:
		cab.bulb(self, Vector2(x0+6+i*17, face.end.y-20), 3.0, 1.0 if i < rules.chain else 0.0)
	_num(Vector2(face.end.x-14-NUM_FONT.get_string_size("%.1fs"%rules.chain_time,HORIZONTAL_ALIGNMENT_LEFT,-1,15).x, face.end.y-14), "%.1fs"%rules.chain_time, 15, MUTED)

## Printed apron instruction card in a chrome holder.
func _instruction_card(r: Rect2) -> void:
	var face: Rect2 = cab.bezel(self, r, 10, "chrome", 6)
	cab.fill(self, face, 5, [[0.0, Color("f3e8cf")], [0.7, Color("e4d4b0")], [1.0, Color("cdb98f")]])
	cab.outline(self, face.grow(-6), 3, Color(Cabinet.INK, 0.55), 1.5)
	cab.outline(self, face.grow(-10), 2, Color(Cabinet.INK, 0.3), 1)
	var cx := face.get_center().x
	_text(Vector2(cx, face.position.y+36), t("ui.controls"), 13, Cabinet.INK, false, true, HEAD_FONT)
	draw_line(Vector2(cx-56, face.position.y+46), Vector2(cx+56, face.position.y+46), Color(Cabinet.INK, 0.45*draw_alpha), 1, true)
	var rows := [["←", t("ui.left_flipper")], ["→", t("ui.right_flipper")]]
	var parts := t("ui.space_launch_nudge").split("  ", false)
	rows.append([parts[0].strip_edges(), " ".join(parts.slice(1)).strip_edges()])
	for i in rows.size():
		var y := face.position.y+84+i*34
		_keycap(Vector2(face.position.x+26, y), rows[i][0], 12, true)
		_text(Vector2(face.position.x+104, y), rows[i][1], 15, Cabinet.INK)
	_text(Vector2(cx, face.end.y-18), t("ui.p_esc_pause_m_mute_86"), 12, Color(Cabinet.INK, 0.75), false, true)

func _mission_card() -> void:
	var accent:=VIOLET if rules.multiball else CYAN
	var mission:Dictionary=rules.active_mission()
	var title:=t("ui.free_play") if mission.is_empty() else t("mission."+mission.id+".title")
	if rules.multiball:title=t("ui.supernova")
	var r := Rect2(40,309,303,359)
	var face: Rect2 = cab.plate(self, r, "", LABEL_FONT, GOLD.lerp(accent,minf(1,rules.mission_pulse)))
	cab.nameplate(self, Vector2(r.get_center().x, r.position.y-2), title, HEAD_FONT, 14, true)
	if rules.multiball:
		_label(Vector2(61,372),t("ui.jackpot_window"),12,GOLD)
		_glow_text(Vector2(61,428),"%.1fs"%rules.nova_time,44,VIOLET,false,NUM_FONT)
		_text(Vector2(190,420),t("ui.d_balls_live")%_live_count(),12,PALE)
	elif not mission.is_empty():
		_label(Vector2(61,372),t("mission."+mission.id+".label"),12,GOLD)
		_glow_text(Vector2(61,428),"%d / %d"%[rules.progress,int(mission.goal)],44,CYAN,false,NUM_FONT)
		var goal := maxi(1,int(mission.goal))
		var n := mini(goal, 10)
		for i in n:
			var lit: bool = float(rules.progress)*n/goal > i
			cab.lamp(self, Vector2(188+i*14.5, 412), 4.2, CYAN, 1.0 if lit else 0.0)
	else:_text(Vector2(61,425),t("ui.keep_the_ball_in_play"),17,CYAN,true)
	var count:int=cfg.missions.size()
	var radius:=minf(19,100.0/maxi(1,count))
	var step := int(attract_step)
	for i in count:
		var x:float=192 if count==1 else 88+i*208.0/(count-1)
		var complete:bool=rules.stage>i;var active:bool=rules.stage==i
		var level := 1.0 if complete else (0.55+0.35*sin(time*4.0) if active and not reduced else (0.7 if active else 0.0))
		if state == "title" and not reduced: level = 1.0 if (step/3)%count == i else 0.15
		cab.lamp(self, Vector2(x,486), radius, accent if not complete else CYAN, level)
		if active: draw_arc(Vector2(x,486),radius+6,-PI/2,-PI/2+maxf(0.02,rules.fraction())*TAU,40,Color(CYAN,draw_alpha),2,true)
		_num(Vector2(x,492),str(i+1),14,Color("06202a") if level > 0.5 else MUTED,true)
		if count<=4:_label(Vector2(x,530),t("mission."+cfg.missions[i].id+".short"),10,CYAN if complete or active else MUTED,true)
		if i < count-1:
			# Chase arrows between inserts point toward the next goal.
			var nx:float = 88+(i+1)*208.0/(count-1)
			for j in 3:
				var ax: float = lerpf(x, nx, 0.32+j*0.18)
				var on: bool = (step+2-j)%3 == 0 and not reduced
				var c := Color(accent, (0.9 if on else 0.28)*draw_alpha)
				draw_polyline(PackedVector2Array([Vector2(ax-3,480),Vector2(ax+3,486),Vector2(ax-3,492)]), c, 2, true)
	draw_line(Vector2(61,556),Vector2(322,556),Color(0,0,0,0.5*draw_alpha),1)
	draw_line(Vector2(61,557),Vector2(322,557),Color(GOLD,0.25*draw_alpha),1)
	_label(Vector2(61,584),t("ui.next"),11,GOLD)
	_text(Vector2(61,614),_objective_text(),14,PALE,true)

func _objective_text() -> String:
	if rules.multiball:
		return t("ui.jackpot_bumper_s")%_number(int(cfg.scoring.jackpot.points)) if rules.nova_time>0 and cfg.scoring.jackpot.enabled else t("ui.keep_your_comets_alive")
	var mission:Dictionary=rules.active_mission()
	return t("mission."+mission.id+".objective") if not mission.is_empty() else t("ui.keep_the_ball_in_play")

func _mobile_hud() -> void:
	# Portrait: one dot-matrix strip carries score, balls and multiplier.
	_label(Vector2(32,83),t("ui.chain_d")%rules.chain,12,CYAN)
	var seconds: float = cfg.scoring.chain.seconds
	var fraction := clampf(rules.chain_time/maxf(0.01, seconds), 0, 1)
	for i in 12:
		var cell := Rect2(128+i*12.6, 73, 10, 7)
		var on: bool = float(i)/12 < fraction
		cab.fill(self, cell, 2, [[0.0, Color("c8fbf4")], [1.0, Color("2a8f88")]] if on else [[0.0, Color("1a2a36")], [1.0, Color("0b141c")]])
	_num(Vector2(293,82),"%.1fs"%rules.chain_time,11,MUTED)
	var face: Rect2 = cab.dmd_begin(self, Rect2(24,88,492,70))
	cab.dmd_text(self, NUM_FONT, Vector2(face.position.x+14, face.end.y-5), _number(roundi(displayed_score)), 38+roundi(rules.score_pulse/0.22*2), Cabinet.AMBER)
	var n := int(cfg.gameplay.balls)
	for i in n:
		var p := Vector2(338+i*minf(22.0,70.0/maxi(1,n-1)), face.end.y-17)
		draw_circle(p, 6.5, Color(Cabinet.AMBER, 1.0 if i < balls else 0.14))
	cab.dmd_text(self, NUM_FONT, Vector2(face.end.x-14-NUM_FONT.get_string_size("%d×"%sim.multiplier,HORIZONTAL_ALIGNMENT_LEFT,-1,36).x, face.end.y-6), "%d×"%sim.multiplier, 36, Cabinet.AMBER)
	cab.dmd_end(self, face)
	cab.dmd_text(self, BOLD, face.position+Vector2(14,13), t("ui.your_score"), 10, Color(Cabinet.AMBER,0.85), false, 0.5)
	cab.dmd_text(self, BOLD, Vector2(326, face.position.y+13), t("ui.balls"), 10, Color(Cabinet.AMBER,0.85), false, 0.5)
	var strip: Rect2 = cab.bezel(self, Rect2(28,174,484,31), 8, "brass", 3)
	cab.glass(self, strip, 5, Color("081626"))
	if rules.multiball: cab.outline(self, strip, 5, Color(VIOLET,0.7), 1.5)
	var text:String=_objective_text()
	if not rules.multiball and not rules.missions.is_empty(): text+="  %d/%d"%[rules.progress,int(rules.active_mission().goal)]
	elif rules.multiball: text+="  %.1fs"%rules.nova_time
	_text(Vector2(270,194),text,12,PALE,true,true)
	_text(Vector2(270,1060),t("ui.flippers_space_launch_p_pause"),11,MUTED,false,true)

func _compact_title() -> void:
	_offset_now = Vector2(0,-30)*(1.0-_back(_entrance(0.0,0.6)))
	_group(0.0, Vector2(0,-30))
	var r := Rect2(44,300,452,448)
	var face: Rect2 = cab.bezel(self, r, 18, "brass", 11)
	cab.glass(self, face, 9, Color("0a1330"), 0.6)
	var size: Vector2 = STATIC_BG.get_size()
	draw_texture_rect_region(STATIC_BG, Rect2(face.position, Vector2(face.size.x, 190)), Rect2(size*Vector2(0.25,0.15), size*Vector2(0.3,0.3*190.0/face.size.x*size.x/size.y)), Color(1.0,0.9,1.0,0.4*draw_alpha))
	var logo_k := _entrance(0.25, 0.7)
	var saved := draw_alpha
	draw_set_transform(origin+(_offset_now+Vector2(0,-46.0*(1.0-_back(logo_k))))*unit,0,Vector2.ONE*unit)
	draw_alpha = saved*clampf(logo_k*1.8,0,1)
	_title_lockup(Vector2(270,340),true,1.0)
	_label(Vector2(270,459),t("ui.ignite_align_release"),13,CYAN,true)
	draw_alpha = saved
	draw_set_transform(origin+_offset_now*unit,0,Vector2.ONE*unit)
	cab.chase(self, r.grow(-5.5), 16, attract_step, clampf((screen_time-0.05)/0.8,0,1) if not reduced else 1.0, reduced)
	_offset_now = Vector2.ZERO
	_group_end()

func _bumper(p:Vector2,index:int)->void:
	var bumper:Dictionary=cfg.table.bumpers[index]
	var contact:float=sim.bumper_cool[index]
	for e in extra_balls:contact=maxf(contact,e.model.bumper_cool[index])
	var jackpot:bool=cfg.scoring.jackpot.enabled and bumper.id==cfg.scoring.jackpot.bumper_id and rules.nova_time>0
	var powered:bool=rules.wants("bumper") or jackpot
	var tint:=VIOLET if jackpot else Color(bumper.color)
	var radius:float=bumper.visual_radius
	for i in 4:draw_circle(p,bumper.radius+5+i*4,Color(tint,(0.018 if powered else 0.006)+contact*0.13))
	var scale:float=1.0+contact*0.35
	draw_texture_rect(CAP,Rect2(p-Vector2.ONE*radius*scale,Vector2.ONE*radius*scale*2),false,Color.WHITE.lerp(tint,0.18))
	if contact>0:draw_arc(p,bumper.radius+2+contact*20,0,TAU,48,Color(Color.WHITE,contact*5),2,true)
	if jackpot:draw_arc(p,radius-5,-PI/2,-PI/2+TAU*rules.nova_time/cfg.multiball.seconds,60,VIOLET,3,true)

func _draw_live_balls() -> void:
	juice.draw_world(self)
	if not reduced:
		if sim.live:_draw_comet_trail(trail,CYAN.lerp(Color("ffb66d"),comet_fx.heat(sim.vel.length())))
		for e in extra_balls:
			if e.model.live: _draw_comet_trail(e.trail,VIOLET.lerp(Color("ffb66d"),comet_fx.heat(e.model.vel.length())))
	comet_fx.draw_particles(self)
	if delay_next<=0 and state!="gameover" and (sim.live or _live_count()==0):
		if sim.live:comet_fx.draw_coma(self,sim.pos,sim.vel)
		_ball(sim.pos,sim.R)
	for e in extra_balls:
		if e.model.live:
			comet_fx.draw_coma(self,e.model.pos,e.model.vel)
			_ball(e.model.pos,e.model.R)
	for p in popups: _num(p.pos,p.text,18,Color(PALE,minf(1,p.life*1.8)),true)

func _draw_comet_trail(points: Array,color: Color) -> void:
	for i in range(points.size()-1,0,-1):
		var a:float=(1.0-float(i)/maxf(1,points.size()))*0.6
		draw_line(points[i],points[i-1],Color(color,a*0.15),12*(1.0-float(i)/maxf(1,points.size())),true)
		draw_line(points[i],points[i-1],Color(color,a),maxf(0.8,4*(1.0-float(i)/maxf(1,points.size()))),true)

func _ball(p: Vector2,radius: float,alpha := 1.0) -> void:
	for i in 3: draw_circle(p,radius+3+i*2,Color(CYAN,0.025*alpha))
	super._ball(p,radius,alpha)
	draw_arc(p,radius,PI,TAU,24,Color(Color.WHITE,0.8*alpha),1,true)

func _draw_controls() -> void:
	for id in ["left","launch","right"]:
		var r:=_control_rect(id)
		var down:bool=sim.left if id=="left" else (sim.right if id=="right" else sim.charging)
		var lit:float=minf(1.0, maxf(control_pulse[id]*3.0,1.0 if down else 0.0))
		cab.button(self, r, "plunger" if id=="launch" else "flipper", 0.0, 1.0 if down else 0.0, 0.0, time, 0.25, lit)
		var label:String={"left":t("ui.left_96"),"right":t("ui.right_97"),"launch":t("ui.nudge") if _live_count()>0 else t("ui.launch")}[id]
		var ty := r.position.y+r.size.y/2+(3 if id=="launch" else 5)+(1.5 if down else 0.0)
		var ink := Color("2a1606") if id=="launch" else Color("032024")
		_text(Vector2(r.get_center().x, ty+1), label, 14, Color(1,1,1,0.35), true, true)
		_text(Vector2(r.get_center().x, ty), label, 14, ink, true, true)
		if id=="launch":
			var slot := Rect2(r.position+Vector2(r.size.y*0.5, r.size.y-11), Vector2(r.size.x-r.size.y, 5))
			draw_rect(slot.grow(1), Color(0,0,0,0.55))
			if _live_count()>0:
				draw_rect(Rect2(slot.position, Vector2(slot.size.x*(1-nudge_cool/cfg.gameplay.nudge_cooldown), slot.size.y)), CYAN.darkened(0.3) if nudge_cool>0 else CYAN)
			else:
				draw_rect(slot, Color("26374a"))
				draw_rect(Rect2(slot.position+Vector2(slot.size.x*cfg.scoring.skill_shot.charge_min,0),Vector2(slot.size.x*(cfg.scoring.skill_shot.charge_max-cfg.scoring.skill_shot.charge_min),slot.size.y)),CYAN)
				if sim.charging:
					var x:float=slot.position.x+slot.size.x*sim.charge
					draw_line(Vector2(x,slot.position.y-4),Vector2(x,slot.end.y+2),Color.WHITE,3,true)

## Shared modal frame: dimmed cabinet, brass backglass frame, chase bulbs; drops in.
func _modal_frame(r: Rect2, dim := 0.8) -> void:
	var k := _entrance(0.0, 0.4)
	draw_rect(Rect2(Vector2(-400,-400),layout_size+Vector2(800,800)),Color(0.01,0.02,0.05,dim*clampf(k*2.0,0,1)))
	var off := Vector2(0, 36.0*(1.0-_back(k)))
	_offset_now = off
	draw_set_transform(origin+off*unit,0,Vector2.ONE*unit)
	draw_alpha = clampf(k*1.8,0,1)
	cab.alpha = draw_alpha
	var face: Rect2 = cab.bezel(self, r, 18, "brass", 11)
	cab.glass(self, face, 9, Color("0d1a30"), 0.7)
	var size: Vector2 = STATIC_BG.get_size()
	draw_texture_rect_region(STATIC_BG, Rect2(face.position, Vector2(face.size.x, face.size.y*0.4)), Rect2(size*Vector2(0.3,0.2), size*Vector2(0.3,0.3*0.4*face.size.y/face.size.x*size.x/size.y)), Color(1,0.9,1,0.22*draw_alpha))
	cab.chase(self, r.grow(-5.5), 18, attract_step, 1.0, reduced)

func _modal_frame_end() -> void:
	_offset_now = Vector2.ZERO
	_group_end()

func _settings_widgets() -> void:
	var x:=85.0 if compact else 447.0
	var y:=410.0 if compact else 330.0
	for i in 2:
		var slider:=HSlider.new()
		slider.position=origin+Vector2(x,y+i*95)*unit; slider.size=Vector2(360,34)*unit
		slider.min_value=0; slider.max_value=1; slider.step=0.01
		slider.value=music_volume if i==0 else sfx_volume
		# Track and brass knob are painted by the controller; keep the grab area.
		for style in ["slider","grabber_area","grabber_area_highlight","focus"]: slider.add_theme_stylebox_override(style, StyleBoxEmpty.new())
		var knob := ImageTexture.create_from_image(Image.create(26, 26, false, Image.FORMAT_LA8))
		for icon in ["grabber","grabber_highlight"]: slider.add_theme_icon_override(icon, knob)
		var k:=i
		slider.value_changed.connect(func(value):
			if k==0:music_volume=value
			else:sfx_volume=value
			_apply_audio(); _save()
			_cue("ui.select",0.9+value*0.3))
		slider.focus_entered.connect(func(): _cue("ui.focus"))
		slider.mouse_entered.connect(func(): _cue("ui.hover"))
		ui.add_child(slider)
	_button("effects",(t("ui.effects_reduced") if reduced else t("ui.effects_full")),Rect2(x,y+181,360,45),func():reduced=not reduced; juice.reduced_motion=reduced; _save(); _layout())
	_button("settings-close",t("ui.done"),Rect2(x,y+261,360,52),_close_settings,true)

func _draw_settings() -> void:
	var r:=Rect2(45,278,450,506) if compact else Rect2(407,198,466,506)
	_modal_frame(r, 0.86)
	_glow_text(r.position+Vector2(r.size.x/2,62),t("ui.audio_effects"),24,PALE,true,HEAD_FONT,0.8)
	draw_line(r.position+Vector2(r.size.x/2-70,78),r.position+Vector2(r.size.x/2+70,78),Color(GOLD,0.5*draw_alpha),1,true)
	_label(r.position+Vector2(40,118),t("ui.music"),12,GOLD)
	_label(r.position+Vector2(40,213),t("ui.sound_effects"),12,GOLD)
	_text(r.position+Vector2(40,378),t("ui.reduced_less_fire_no_shake"),12,MUTED)
	_modal_frame_end()

func _draw_modal(mode: String) -> void:
	super._draw_modal(mode)
	if mode=="result":
		var y:=635 if compact else 549
		_text(Vector2(270 if compact else 640,y),t("ui.chain_d_skill_shots_d_jackpots_d")%[rules.best_chain,rules.skills,rules.jackpots],11,CYAN,true,true)

func _draw_tutorial() -> void:
	draw_rect(Rect2(Vector2.ZERO,layout_size),Color(0.01,0.03,0.07,0.88))
	var r:=Rect2(38,254,464,582) if compact else Rect2(398,179,484,582)
	_card(r,Color("102236"),GOLD,14)
	var x:=r.position.x+28; var y:=r.position.y
	_head(Vector2(x,y+50),t("ui.make_the_machine_come_alive"),24,PALE)
	var titles: Array[String]=[t("ui.01_launch_flip"),t("ui.02_build_the_reactor"),t("ui.03_supernova_recovery")]
	var rows:Array=[
		[t("ui.hold_space_release_inside_the_cyan_window") if cfg.scoring.skill_shot.enabled else t("ui.hold_space_release_to_launch"),t("ui.or_arrows_flip_touch_pads_work_too")],
		[t("ui.complete_the_configured_hud_objectives"),t("ui.different_targets_chain_within_1f_seconds") % cfg.scoring.chain.seconds if cfg.scoring.chain.enabled else t("ui.each_target_awards_its_configured_points")],
		[t("ui.earn_d_ball_play_hit_the_lit_jackpot_bumper") % (cfg.multiball.spawns.size()+1) if cfg.multiball.enabled and not cfg.missions.is_empty() else t("ui.keep_your_ball_alive_and_build_your_score"),t("ui.space_nudges_in_play_recharges_in_1fs") % cfg.gameplay.nudge_cooldown]
	]
	for i in 3:
		_label(Vector2(x,y+111+i*125),titles[i],13,GOLD)
		_text(Vector2(x,y+144+i*125),rows[i][0],13,PALE)
		_text(Vector2(x,y+168+i*125),rows[i][1],13,MUTED)
	_text(Vector2(x,y+466),t("ui.d_balls_1fs_ball_save_reduced_effects_in_settings") % [int(cfg.gameplay.balls),cfg.gameplay.ball_save_seconds],11,CYAN)

func _draw_surface() -> void:
	draw_texture_rect(STATIC_BG,_surface_rect(),false,Color(0.7,0.8,1.0,0.62))

func _draw_bank_lamps() -> void:
	for i in sim.BANKS.size():
		var bank:Dictionary=cfg.table.banks[i]
		var p:Vector2=sim.BANKS[i];var hot:float=sim.bank_cool[i]
		for e in extra_balls:hot=maxf(hot,e.model.bank_cool[i])
		var required:bool=rules.wants("bank")
		var c:Color=CYAN if required else GOLD
		var n:=TemplateConfig.vec(bank.normal).normalized();var tangent:Vector2=n.orthogonal()*bank.half_length
		if hot>0 or required:draw_circle(p,bank.half_length+bank.radius+1,Color(c,hot*0.4+0.035))
		draw_line(p-tangent,p+tangent,c if hot>0 else Color("122d38"),bank.radius*2,true)
		draw_line(p-tangent+n*bank.radius,p+tangent+n*bank.radius,c,1,true)
	if state=="title": _attract_lamps()

## Attract mode: playfield inserts chase while the machine waits for a player.
func _attract_lamps() -> void:
	var step := int(attract_step)
	var t:Dictionary=cfg.table
	var count:int=sim.ROLLERS.size()
	for i in count:
		var p:Vector2=sim.ROLLERS[i]
		var radius:float=t.rollovers[i].radius*0.74
		var on: bool = reduced or (step/2)%maxi(1,count)==i
		if on:
			for k in 3: draw_circle(p,radius+4+k*5,Color(CYAN,0.08))
			draw_arc(p,radius,0,TAU,40,Color("c8fbf4"),2.5,true)
			draw_circle(p+Vector2(0,radius+12),3.5,CYAN)
	var deco:Dictionary=t.decoration
	if deco.enabled:
		var arrows:Array=deco.arrows
		for i in arrows.size():
			var c:=TemplateConfig.vec(arrows[i])
			if reduced or (step+i)%3==0:
				draw_polyline(PackedVector2Array([c-Vector2(6,0),c+Vector2(0,6),c+Vector2(6,0)]),Color(Color("ffd88a"),0.95),3,true)
				draw_circle(c+Vector2(0,3),9,Color(1.0,0.75,0.35,0.12))
	for i in sim.BANKS.size():
		if reduced or (step/4+i)%2==0: draw_circle(sim.BANKS[i],cfg.table.banks[i].half_length+4,Color(GOLD,0.10))

func _on_surface_contact(at:Vector2,normal:Vector2,speed:float)->void:
	comet_fx.reduced=reduced
	comet_fx.impact(at,normal,speed)

func _sample_trail(points:Array,at:Vector2)->void:
	if not points.is_empty() and points[0].distance_to(at)>65:points.clear()
	points.push_front(at)
	if points.size()>26:points.pop_back()

func _optional_prepared(id:String,resource:Resource)->void:
	if id=="music":_register_music(resource as AudioStreamOggVorbis)
