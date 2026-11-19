extends SceneTree

const Juice = preload("res://scripts/comet_juice.gd")
const CometEffects = preload("res://scripts/comet_effects.gd")
var _failed := false

func _init() -> void:
	var juice := Juice.new()
	juice.intensity = 2.0
	for i in 80:
		juice.hit(Vector2(float(i % 24) * 20.0, float(i / 24) * 30.0), "bumper", Color("d4ad65"), 2.0)
		juice.link(Vector2(0, 0), Vector2(120, 50), Color("73ede0"))
	for i in 40:
		juice.ui_burst(Vector2(float(i) * 3.0, 30.0), Color("b59dff"), i % 2 == 0)
		juice.ui_transfer(Vector2(10, 90), Vector2(300, 20), Color("73ede0"))
	_assert(juice.world_particles.size() <= Juice.MAX_WORLD_PARTICLES, "world particle cap")
	_assert(juice.world_rings.size() <= Juice.MAX_WORLD_RINGS, "world ring cap")
	_assert(juice.ui_particles.size() <= Juice.MAX_UI_PARTICLES, "UI particle cap")
	_assert(juice.ui_rings.size() <= Juice.MAX_UI_RINGS, "UI ring cap")
	_assert(juice.links.size() <= Juice.MAX_LINKS, "link cap")
	var world_age := float(juice.world_particles[0]["age"])
	juice.tick(0.1, true)
	_assert(is_equal_approx(float(juice.world_particles[0]["age"]), world_age), "paused world must freeze")
	juice.tick(0.1, false)
	_assert(float(juice.world_particles[0]["age"]) > world_age, "unpaused world must advance")
	juice.reduced_motion = true
	juice.hit(Vector2(240, 400), "rail", Color("73ede0"))
	_assert(is_zero_approx(juice.shake), "reduced motion must suppress shake")
	juice.reset()
	_assert(juice.world_particles.is_empty() and juice.world_rings.is_empty() and juice.ui_particles.is_empty() and juice.ui_rings.is_empty() and juice.links.is_empty(), "reset must clear all effects")
	_check_flame_geometry()
	if _failed:
		quit(1)
		return
	print("juice_check: PASS")
	quit(0)

func _check_flame_geometry()->void:
	var effects:=CometEffects.new()
	# The old polygon fails at clock 0.47032789926849, heat .011, tongue 3,
	# rotated PI/8: a retracted tip reaches the lower perimeter.
	var times:Array[float]=[0.0,0.47032789926849,3600.0,86400.0]
	for sample in 120:times.append(sample*0.073)
	for cycle in 12:
		for tongue in 5:
			times.append((1.5*PI+TAU*cycle-tongue)/17.0)
			times.append((1.5*PI+TAU*cycle-tongue*1.7)/23.0)
	var checked:=0
	for phase in times:
		effects.clock=phase
		for hot in [0.010001,0.011,0.05,0.25,0.6,1.0]:
			for angle_index in 16:
				var direction:=Vector2.RIGHT.rotated(TAU*angle_index/16.0)
				for tongue in 5:
					var polygon:=effects._flame_polygon(Vector2(240,650),direction,hot,tongue)
					var triangles:=Geometry2D.triangulate_polygon(polygon)
					if triangles.size()!=(polygon.size()-2)*3:
						_assert(false,"flame triangulation phase=%s heat=%s angle=%s tongue=%s" % [phase,hot,angle_index,tongue])
						return
					checked+=1
	print("comet flame polygons verified: ",checked)

func _assert(condition: bool, label: String) -> void:
	if not condition:
		_failed = true
		push_error("juice_check failed: " + label)
