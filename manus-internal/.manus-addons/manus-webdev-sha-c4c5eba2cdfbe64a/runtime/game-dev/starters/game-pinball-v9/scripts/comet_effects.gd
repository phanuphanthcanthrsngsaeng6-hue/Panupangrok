extends RefCounted
## Gameplay VFX only. No background shader, viewport, palette or loading dependencies.
const MAX_EMBERS:=240
const MAX_DUST:=180
const COOL:=Color("75e8fa")
const FIRE:=Color("ffbd62")
var bounds:=Rect2(19,19,442,692)
var density:=1.0
var clock:=0.0
var reduced:=false
var particles:Array=[]
var dust:Array=[]
var rng:=RandomNumberGenerator.new()
var emit_accumulator:Dictionary={}

func _init()->void:
	rng.seed=8091783

func reset()->void:
	clock=0.0
	particles.clear();dust.clear();emit_accumulator.clear();rng.seed=8091783

func tick(dt:float,paused:bool,is_reduced:bool)->void:
	reduced=is_reduced
	if reduced:particles.clear();emit_accumulator.clear()
	if paused:return
	var step:=clampf(dt,0,0.05)
	if not reduced:clock+=step
	particles=_age(particles,step)
	dust=_age(dust,step)

func heat(speed:float)->float:
	return smoothstep(450.0,1100.0,speed)

func emit_comet(key:int,at:Vector2,velocity:Vector2,dt:float,violet:=false)->void:
	if reduced or velocity.length()<60:return
	var hot:=heat(velocity.length())
	var amount:float=float(emit_accumulator.get(key,0.0))+dt*(22+hot*110)*density
	var count:=mini(4,floori(amount));emit_accumulator[key]=amount-count
	var direction:=velocity.normalized()
	var normal:=direction.orthogonal()
	for i in count:
		var warm:=rng.randf()<hot
		var col:Color=FIRE.lerp(Color("ff6446"),rng.randf()*0.65) if warm else (Color("b8a0ff") if violet else COOL)
		var p:=at-direction*rng.randf_range(5,15)+normal*rng.randf_range(-5,5)
		var v:Vector2=-direction*rng.randf_range(28,95+hot*90)+normal*rng.randf_range(-27,27)+velocity*0.075
		particles.append({"p":p,"v":v,"life":rng.randf_range(0.18,0.43),"max":0.43,"size":rng.randf_range(1.3,3.3)+hot*2.5,"c":col,"hot":warm})
		if particles.size()>MAX_EMBERS:particles.pop_front()

func impact(at:Vector2,normal:Vector2,speed:float)->void:
	var strength:=clampf(speed/650.0,0.2,1.7)
	var count:=int((3 if reduced else 7+strength*12)*density)
	for i in count:
		var direction:=normal.rotated(rng.randf_range(-1.35,1.35))
		var col:Color=Color("f8d694") if i%3 else COOL
		var lifetime:=rng.randf_range(0.20,0.50)
		dust.append({"p":at+normal*2,"v":direction*rng.randf_range(40,150)*strength*(0.22 if reduced else 1.0),"life":lifetime,"max":lifetime,"size":rng.randf_range(1.2,2.8),"c":col,"hot":false})
		if dust.size()>MAX_DUST:dust.pop_front()

func forget_emitters()->void:
	emit_accumulator.clear()

func _age(items:Array,dt:float)->Array:
	var alive:Array=[]
	for p in items:
		p.life-=dt
		if p.life<=0:continue
		p.p+=p.v*dt;p.v*=exp(-dt*2.0)
		alive.append(p)
	return alive

func draw_particles(canvas:CanvasItem)->void:
	for p in particles:
		if not bounds.has_point(p.p):continue
		var a:float=clampf(p.life/p.max,0,1)
		var r:float=p.size*(0.4+0.6*a)
		canvas.draw_circle(p.p,r*1.9,Color(p.c,a*0.055),true,-1,true)
		canvas.draw_circle(p.p,r,Color(p.c,a*0.70),true,-1,true)
		if p.hot:canvas.draw_circle(p.p,r*0.40,Color("ffeec8")*Color(1,1,1,a*0.8),true,-1,true)
	for p in dust:
		if not bounds.has_point(p.p):continue
		var a:float=clampf(p.life/p.max,0,1)
		canvas.draw_line(p.p-p.v.normalized()*p.size*2.3,p.p,Color(p.c,a*0.55),0.8,true)
		canvas.draw_circle(p.p,p.size*a,Color(p.c,a),true,-1,true)
		if p.size>2.1:
			canvas.draw_line(p.p-Vector2(3,0),p.p+Vector2(3,0),Color(p.c,a*0.9),0.75,true)
			canvas.draw_line(p.p-Vector2(0,3),p.p+Vector2(0,3),Color(p.c,a*0.9),0.75,true)

func draw_coma(canvas:CanvasItem,at:Vector2,velocity:Vector2)->void:
	var hot:=heat(velocity.length())
	if hot<=0.01:return
	var tint_color:=COOL.lerp(FIRE,hot)
	if reduced:
		canvas.draw_arc(at,10.5,0,TAU,24,Color(tint_color,0.38),1.0,true)
		return
	var direction:=velocity.normalized()
	var normal:=direction.orthogonal()
	var tail:=PackedVector2Array([at+normal*(7+hot*3),at-direction*(19+hot*34)+normal*2,at-direction*(26+hot*34),at-direction*(19+hot*34)-normal*2,at-normal*(7+hot*3)])
	canvas.draw_colored_polygon(tail,Color(FIRE,hot*0.25))
	# Narrow overlapping tongues create a fire silhouette, not an opaque halo.
	for i in 5:
		var flame:=_flame_polygon(at,direction,hot,i)
		var flame_color:Color=Color("ff793c") if i%2 else Color("ffc765")
		canvas.draw_colored_polygon(flame,Color(flame_color,hot*0.38))
	for i in 4:canvas.draw_circle(at,10+i*3,Color(tint_color,hot*(0.055-float(i)*0.011)),true,-1,true)
	canvas.draw_arc(at,10,velocity.angle()-PI/2,velocity.angle()+PI/2,24,Color("ffe4aa")*Color(1,1,1,hot*0.8),1.2,true)

func _flame_polygon(at:Vector2,direction:Vector2,hot:float,tongue:int)->PackedVector2Array:
	var normal:=direction.orthogonal()
	var base:=at-direction*3+normal*(tongue-2)*3.0
	var flicker:float=0.70+0.30*sin(clock*23.0+tongue*1.7)
	var length:float=(18+hot*43)*flicker
	# Fixed 12px shoulders let a short flame fold back onto its bottom edge.
	# Keep shoulders before the tip, and its +/-3px sway inside +/-4px shoulders.
	# This preserves a strictly convex perimeter throughout flicker and rotation.
	var shoulder:float=minf(12.0,length*0.45)
	var tip:=base-direction*length+normal*sin(clock*17+tongue)*3.0
	return PackedVector2Array([base+normal*3,base-direction*shoulder+normal*4,tip,base-direction*shoulder-normal*4,base-normal*3])
