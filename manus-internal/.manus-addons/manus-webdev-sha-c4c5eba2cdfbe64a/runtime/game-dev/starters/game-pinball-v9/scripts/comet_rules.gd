extends RefCounted
## Progress is run-scoped; ball loss never silently erases an earned objective.
signal stage_completed(stage_index: int, bonus: int)
signal supernova_requested
var stage := 0
var progress := 0
const Config=preload("res://scripts/template_config.gd")
var cfg:Dictionary
var missions:Array=[]
var goals:Array=[]
var jackpot_at:=Vector2.ZERO
var chain := 0
var best_chain := 0
var chain_time := 0.0
var last_target := ""
var last_at := Vector2.ZERO
var chain_link_from := Vector2.ZERO
var linked := false
var nova_time := 0.0
var nova_count := 0
var jackpots := 0
var skills := 0
var jackpot_cool := 0.0
var multiball := false
var pending_nova := false
var mission_pulse := 0.0
var score_pulse := 0.0
var chain_pulse := 0.0
var last_bonus := 0
var last_jackpot := false
var last_skill := false

func _init(configuration:Dictionary={})->void:
	cfg=Config.current() if configuration.is_empty() else configuration.duplicate(true)
	if cfg.is_empty():return
	missions=cfg.missions
	for mission in missions:goals.append(int(mission.goal))
	for bumper in cfg.table.bumpers:
		if bumper.id==cfg.scoring.jackpot.bumper_id:jackpot_at=Config.vec(bumper.position)

func active_mission()->Dictionary:
	return missions[mini(stage,missions.size()-1)] if not missions.is_empty() else {}

func wants(kind:String)->bool:
	return not multiball and not missions.is_empty() and active_mission().kind==kind

func reset() -> void:
	stage = 0; progress = 0; chain = 0; best_chain = 0; chain_time = 0
	last_target = ""; last_at = Vector2.ZERO; linked = false
	nova_time = 0; nova_count = 0; jackpots = 0; skills = 0
	jackpot_cool = 0; multiball = false; pending_nova = false
	mission_pulse = 0; score_pulse = 0; chain_pulse = 0

func tick(dt: float) -> void:
	chain_time = maxf(0, chain_time - dt)
	if chain_time <= 0: chain = 0; last_target = ""
	nova_time = maxf(0, nova_time-dt)
	jackpot_cool = maxf(0, jackpot_cool-dt)
	mission_pulse = maxf(0, mission_pulse-dt)
	score_pulse = maxf(0, score_pulse-dt)
	chain_pulse = maxf(0, chain_pulse-dt)

func award(base:int,at:Vector2,kind:String)->int:
	linked=false;last_bonus=0;last_jackpot=false;last_skill=false
	var value:=base
	var rules:Dictionary=cfg.scoring
	if kind=="skill":skills+=1;last_skill=true
	if rules.chain.enabled and kind in rules.chain.eligible_kinds:
		var target:="%s:%d:%d"%[kind,roundi(at.x),roundi(at.y)]
		if target!=last_target:
			linked=chain_time>0 and chain>0
			chain_link_from=last_at
			chain=mini(int(rules.chain.cap),chain+1) if chain_time>0 else 1
			chain_time=rules.chain.seconds;chain_pulse=0.3
			last_target=target;last_at=at;best_chain=maxi(best_chain,chain)
		value+=roundi(base*rules.chain.bonus_per_link*maxi(0,chain-1))
	if rules.jackpot.enabled and nova_time>0 and kind=="bumper" and at.distance_to(jackpot_at)<0.1 and jackpot_cool<=0:
		value+=int(rules.jackpot.points)
		jackpots+=1;jackpot_cool=rules.jackpot.cooldown;last_jackpot=true
	# Mission progress does not depend on which events are eligible for chains.
	if not missions.is_empty() and not multiball and not pending_nova and kind==missions[stage].kind:
		progress+=1;mission_pulse=0.3
		if progress>=goals[stage]:
			var finished:=stage
			last_bonus=int(missions[stage].bonus);value+=last_bonus
			stage_completed.emit(finished,last_bonus)
			stage+=1;progress=0
			if stage==missions.size():
				if cfg.multiball.enabled:pending_nova=true;supernova_requested.emit()
				else:stage=0
	if value>0:score_pulse=0.22
	return value

func start_nova() -> void:
	pending_nova = false; multiball = true
	nova_time = cfg.multiball.seconds; nova_count += 1; stage = missions.size(); progress = 0
	mission_pulse = 1.0

func finish_nova() -> void:
	multiball = false; pending_nova = false; nova_time = 0
	stage = 0; progress = 0; mission_pulse = 0.6

func drain() -> void:
	chain = 0; chain_time = 0; last_target = ""

func fraction() -> float:
	if missions.is_empty() or stage >= missions.size(): return 1.0
	return float(progress)/goals[stage]
