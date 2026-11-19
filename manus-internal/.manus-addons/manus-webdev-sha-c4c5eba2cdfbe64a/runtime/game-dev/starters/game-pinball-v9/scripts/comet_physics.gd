extends RefCounted
## Custom pinball simulation: fixed-step circle/capsule contacts, swept in six substeps.
signal scored(points: int, at: Vector2, kind: String)
signal drained
signal launched
signal contacted(at: Vector2, normal: Vector2, speed: float)
const Config=preload("res://scripts/template_config.gd")
var cfg:Dictionary
var table:Dictionary
var tuning:Dictionary
var scores:Dictionary
var R:=8.0
var BUMPERS:Array[Vector2]=[]
var ROLLERS:Array[Vector2]=[]
var BANKS:Array[Vector2]=[]
var LEFT_PIVOT:=Vector2.ZERO
var RIGHT_PIVOT:=Vector2.ZERO
var pos := Vector2(443, 656)
var vel := Vector2.ZERO
var live := false
var in_lane := true
var charging := false
var charge := 0.0
var left := false
var right := false
var left_amount := 0.0
var right_amount := 0.0
var left_hot := 0.0
var right_hot := 0.0
var save_left := 0.0
var roller_lit := [false, false, false]
var multiplier := 1
var bumper_cool := [0.0, 0.0, 0.0]
var roller_cool := [0.0, 0.0, 0.0]
var sling_cool := 0.0
var sling_hits := 0
var elapsed := 0.0
var slow_time := 0.0
var rails: Array = []
var last_saved := false
var contact_cool := 0.0
var skill_pending := false
var bank_cool := [0.0,0.0,0.0,0.0,0.0,0.0]

func _init(configuration:Dictionary={})->void:
	cfg=Config.current() if configuration.is_empty() else configuration.duplicate(true)
	if cfg.is_empty():return
	table=cfg.table;tuning=cfg.physics;scores=cfg.scoring
	R=float(tuning.ball_radius)
	LEFT_PIVOT=Config.vec(table.flippers.left.pivot);RIGHT_PIVOT=Config.vec(table.flippers.right.pivot)
	for item in table.bumpers:BUMPERS.append(Config.vec(item.position))
	for item in table.rollovers:ROLLERS.append(Config.vec(item.position))
	for item in table.banks:BANKS.append(Config.vec(item.position))
	bumper_cool.resize(BUMPERS.size());bumper_cool.fill(0.0)
	roller_cool.resize(ROLLERS.size());roller_cool.fill(0.0)
	bank_cool.resize(BANKS.size());bank_cool.fill(0.0)
	roller_lit.resize(ROLLERS.size());roller_lit.fill(false)
	for rail in table.rails:rails.append([Config.vec(rail.a),Config.vec(rail.b)])
	reset_run()

func reset_run() -> void:
	multiplier = int(scores.multiplier.initial)
	roller_lit.fill(false)
	elapsed = 0.0
	prepare_ball()

func prepare_ball() -> void:
	pos = Config.vec(table.launcher.spawn)
	vel = Vector2.ZERO
	live = false
	in_lane = true
	charging = false
	charge = 0.0
	left = false
	right = false
	left_amount = 0.0
	right_amount = 0.0
	left_hot = 0.0
	right_hot = 0.0
	save_left = 0.0
	slow_time = 0.0
	last_saved = false
	skill_pending = false
	bank_cool.fill(0.0)
	sling_hits = 0
	contact_cool = 0.0

func set_flipper(which: String, pressed: bool) -> void:
	if which == "left":
		if pressed and not left: left_hot = float(table.flippers.left.hot_seconds)
		left = pressed
	else:
		if pressed and not right: right_hot = float(table.flippers.right.hot_seconds)
		right = pressed

func begin_charge() -> void:
	if in_lane and not live:
		charging = true

func release_plunger() -> bool:
	if not in_lane or live: return false
	# Every legal stroke clears the shooter arc; charge changes its exit energy.
	live = true
	skill_pending = scores.skill_shot.enabled and charge >= scores.skill_shot.charge_min and charge <= scores.skill_shot.charge_max
	charging = false
	vel = Vector2(0, -table.launcher.launch_speed - charge * table.launcher.charge_speed)
	save_left = float(cfg.gameplay.ball_save_seconds)
	launched.emit()
	return true

func flipper_tip(which:String)->Vector2:
	var f:Dictionary=table.flippers[which]
	return Config.vec(f.pivot)+Config.vec(f.rest_offset).lerp(Config.vec(f.active_offset),left_amount if which=="left" else right_amount)

func tick(dt: float) -> void:
	if charging: charge = minf(1.0, charge + dt * table.launcher.charge_rate)
	left_amount = move_toward(left_amount, 1.0 if left else 0.0, dt * table.flippers.left.response)
	right_amount = move_toward(right_amount, 1.0 if right else 0.0, dt * table.flippers.right.response)
	left_hot = maxf(0, left_hot - dt)
	right_hot = maxf(0, right_hot - dt)
	for i in bumper_cool.size():bumper_cool[i]=maxf(0,bumper_cool[i]-dt)
	for i in roller_cool.size():roller_cool[i]=maxf(0,roller_cool[i]-dt)
	for i in bank_cool.size():bank_cool[i]=maxf(0,bank_cool[i]-dt)
	sling_cool = maxf(0, sling_cool - dt)
	contact_cool = maxf(0,contact_cool-dt)
	if not live: return
	elapsed += dt
	save_left = maxf(0, save_left - dt)
	var h:float = dt / tuning.substeps
	for sub in int(tuning.substeps):
		vel.y += tuning.gravity * h
		vel *= 1.0 - tuning.drag * h
		vel = vel.limit_length(tuning.max_speed)
		pos += vel * h
		if in_lane:
			pos.x = table.launcher.spawn[0]
			if pos.y < table.launcher.gate_y:
				# Curved, one-way top shooter gate sends the comet into orbit.
				in_lane = false
				pos = Config.vec(table.launcher.exit)
				vel = Config.vec(table.launcher.exit_velocity)+Config.vec(table.launcher.exit_charge_velocity)*charge
				if skill_pending:
					skill_pending = false
					scored.emit(int(scores.skill_shot.points), pos, "skill")
			if pos.y > table.launcher.lane_bottom:
				pos.y = table.launcher.lane_bottom
				vel.y = -table.launcher.retry_speed
			continue
		for rail in rails:
			_capsule(rail[0], rail[1], table.rail_radius, table.rail_restitution)
		for i in BUMPERS.size():
			var bumper:Dictionary=table.bumpers[i]
			var delta:Vector2=pos-BUMPERS[i]
			if delta.length()<R+bumper.radius:
				var n:=delta.normalized() if delta.length()>0.01 else Vector2.DOWN
				pos=BUMPERS[i]+n*(R+bumper.radius+0.1)
				if vel.dot(n)<0:vel=vel.bounce(n)
				vel+=n*bumper.kick
				if bumper_cool[i]<=0:
					bumper_cool[i]=bumper.cooldown
					_emit_contact(BUMPERS[i]+n*bumper.radius,n,vel.length())
					scored.emit(int(bumper.points)*multiplier,BUMPERS[i],"bumper")
		for i in ROLLERS.size():
			var roller:Dictionary=table.rollovers[i]
			if pos.distance_to(ROLLERS[i])<roller.radius and roller_cool[i]<=0:
				roller_cool[i]=roller.cooldown
				if not roller_lit[i]:
					roller_lit[i]=true
					scored.emit(int(roller.points)*multiplier,ROLLERS[i],"rollover")
					if roller_lit.all(func(x):return x):
						multiplier=mini(int(scores.multiplier.cap),multiplier+int(scores.multiplier.step))
						roller_lit.fill(false)
						scored.emit(int(scores.multiplier.completion_points)*multiplier,Config.vec(table.labels.reward),"multiplier")
		for i in BANKS.size():
			var bank:Dictionary=table.banks[i]
			var n:=Config.vec(bank.normal).normalized()
			var tangent:Vector2=n.orthogonal()*bank.half_length
			var p:Vector2=BANKS[i]
			if (pos-p).dot(n)>0 and _capsule(p-tangent,p+tangent,bank.radius,bank.restitution) and bank_cool[i]<=0:
				bank_cool[i]=bank.cooldown;vel+=n*bank.kick
				scored.emit(int(bank.points)*multiplier,p,"bank")
		for sling in table.slingshots:_sling(sling)
		_flipper("left", LEFT_PIVOT, flipper_tip("left"), left_hot)
		_flipper("right", RIGHT_PIVOT, flipper_tip("right"), right_hot)
		if pos.y > table.drain_y:
			if save_left > 0:
				last_saved = true
				pos = Config.vec(table.launcher.exit)
				vel = Config.vec(cfg.gameplay.save_velocity)
				save_left = 0
				scored.emit(0, Config.vec(table.labels.save), "save")
			else:
				live = false
				drained.emit()
			return
	# Deterministic unsticking only for a ball genuinely motionless away from bats.
	if vel.length() < tuning.unstick_speed and pos.y < tuning.unstick_above_y:
		slow_time += dt
		if slow_time > tuning.unstick_seconds:
			vel += Config.vec(tuning.unstick_impulse)
			slow_time = 0
	else:
		slow_time = 0

func _capsule(a: Vector2, b: Vector2, radius: float, restitution: float) -> bool:
	var nearest := Geometry2D.get_closest_point_to_segment(pos, a, b)
	var d := pos - nearest
	var length := d.length()
	if length >= R + radius: return false
	var n := d / length if length > 0.01 else Vector2.UP
	var impact_speed := maxf(0.0,-vel.dot(n))
	pos = nearest + n * (R + radius + 0.05)
	if vel.dot(n) < 0: vel -= n * vel.dot(n) * (1.0 + restitution)
	_emit_contact(nearest+n*radius,n,impact_speed)
	return true

func _sling(sling:Dictionary) -> void:
	var a:=Config.vec(sling.a);var b:=Config.vec(sling.b);var impulse:=Config.vec(sling.impulse)
	var nearest := Geometry2D.get_closest_point_to_segment(pos, a, b)
	var front := (pos - nearest).dot(impulse) > 0
	if _capsule(a, b, sling.radius, sling.restitution) and sling_cool <= 0 and front:
		# Only the inward-facing rubber is energized. The reverse face is an inlane guide.
		# Preserve the reflected contact direction instead of prescribing the same
		# outgoing vector, which can create a self-sustaining left/right limit cycle.
		sling_hits += 1
		var coil: float = clampf((vel.length() - sling.coil_threshold) * sling.coil_gain, 0.0, sling.coil_max)
		vel = vel * sling.damping + impulse.normalized() * coil
		sling_cool = sling.cooldown
		scored.emit(int(sling.points) * multiplier, pos, "sling")

func _flipper(which: String, pivot: Vector2, tip: Vector2, hot: float) -> void:
	var f:Dictionary=table.flippers[which]
	if not _capsule(pivot, tip, f.radius, f.restitution): return
	if hot > 0 and pos.y < pivot.y + f.hit_below_pivot:
		var along := clampf(pos.distance_to(pivot) / f.strike_length, 0.0, 1.0)
		vel = Vector2((f.kick_x + along * f.kick_x_along) * (1 if which == "left" else -1), f.kick_y + along * f.kick_y_along)
		scored.emit(0, pos, "flipper")

func _emit_contact(at:Vector2,normal:Vector2,speed:float)->void:
	if contact_cool>0 or speed<65:return
	contact_cool=0.055
	contacted.emit(at,normal,speed)
