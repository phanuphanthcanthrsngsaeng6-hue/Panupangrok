extends RefCounted
## Validated, local JSON only. One immutable snapshot is shared by a running game.
const PATH="res://config/pinball-template.json"
const SCHEMA_PATH="res://config/pinball-template.schema.json"
static var _cached:Dictionary={}
static var _schema:Dictionary={}
static var last_errors:Array[String]=[]

static func current()->Dictionary:
	if _cached.is_empty():_cached=load_file(PATH)
	return _cached.duplicate(true)

static func load_file(path:String)->Dictionary:
	last_errors.clear()
	if not FileAccess.file_exists(path):
		last_errors.append(path+": file not found");return {}
	var parser:=JSON.new()
	if parser.parse(FileAccess.get_file_as_string(path))!=OK:
		last_errors.append("%s:%d: %s"%[path,parser.get_error_line()+1,parser.get_error_message()]);return {}
	last_errors=validate(parser.data)
	if not last_errors.is_empty():return {}
	return parser.data

static func validate(data:Variant)->Array[String]:
	var errors:Array[String]=[]
	if _schema.is_empty():
		var parsed=JSON.parse_string(FileAccess.get_file_as_string(SCHEMA_PATH))
		if not parsed is Dictionary:
			errors.append("Configuration schema is missing or invalid: "+SCHEMA_PATH);return errors
		_schema=parsed
	_validate_value(data,_schema,"config",errors)
	if not errors.is_empty():return errors
	var c:Dictionary=data
	var size:=vec(c.table.size)
	for collection in ["bumpers","rollovers","banks","slingshots"]:
		var ids:Dictionary={}
		for item in c.table[collection]:
			if ids.has(item.id):errors.append("config.table.%s: duplicate id '%s'"%[collection,item.id])
			ids[item.id]=true
			if item.has("position"):
				var p:=vec(item.position)
				if p.x<0 or p.x>size.x or p.y<0 or p.y>size.y:errors.append("config.table.%s.%s.position must lie inside table.size"%[collection,item.id])
		for item in c.table[collection]:
			if collection=="bumpers":
				var p:=vec(item.position)
				if p.x-item.radius<0 or p.x+item.radius>size.x or p.y-item.radius<0 or p.y+item.radius>size.y:errors.append("Bumper '%s' radius extends beyond table.size"%item.id)
	for rail in c.table.rails+c.table.launcher.walls:
		if vec(rail.a).distance_to(vec(rail.b))<0.1:errors.append("Rail endpoints must be distinct")
	for sling in c.table.slingshots:
		if vec(sling.a).distance_to(vec(sling.b))<0.1 or vec(sling.impulse).is_zero_approx():errors.append("Slingshot '%s' requires distinct endpoints and a nonzero impulse"%sling.id)
		var polygon:=PackedVector2Array()
		for p in sling.outline:polygon.append(vec(p))
		if Geometry2D.triangulate_polygon(polygon).is_empty():errors.append("Slingshot '%s' outline is degenerate"%sling.id)
	for bank in c.table.banks:
		if vec(bank.normal).is_zero_approx():errors.append("Bank '%s' normal must be nonzero"%bank.id)
	for side in ["left","right"]:
		var f:Dictionary=c.table.flippers[side]
		if vec(f.rest_offset).length()<c.physics.ball_radius or vec(f.active_offset).length()<c.physics.ball_radius:errors.append("Flipper '%s' offsets must be longer than ball radius"%side)
	if c.table.drain_y<=size.y:errors.append("config.table.drain_y must be below table.size[1]")
	var l:Dictionary=c.table.launcher
	if l.gate_y>=l.spawn[1] or l.spawn[1]>l.lane_bottom:errors.append("Launcher must satisfy gate_y < spawn[1] <= lane_bottom")
	if c.table.surface_inset[0]+c.table.surface_inset[2]>=size.x or c.table.surface_inset[1]+c.table.surface_inset[3]>=size.y:errors.append("surface_inset leaves no drawable playfield")
	if c.scoring.multiplier.initial>c.scoring.multiplier.cap:errors.append("multiplier.initial must not exceed multiplier.cap")
	if c.scoring.skill_shot.charge_min>=c.scoring.skill_shot.charge_max:errors.append("skill_shot.charge_min must be less than charge_max")
	if c.scoring.jackpot.enabled and not c.table.bumpers.any(func(b):return b.id==c.scoring.jackpot.bumper_id):errors.append("jackpot.bumper_id must reference an existing bumper")
	var mission_ids:Dictionary={}
	for m in c.missions:
		if mission_ids.has(m.id):errors.append("Duplicate mission id: "+m.id)
		mission_ids[m.id]=true
		if (m.kind=="rollover" or m.kind=="multiplier") and c.table.rollovers.is_empty():errors.append("Mission '%s' requires at least one rollover"%m.id)
		if m.kind=="bank" and c.table.banks.is_empty():errors.append("Mission '%s' requires a side bank"%m.id)
		if m.kind=="sling" and c.table.slingshots.is_empty():errors.append("Mission '%s' requires a slingshot"%m.id)
		if m.kind=="skill" and not c.scoring.skill_shot.enabled:errors.append("Mission '%s' requires skill_shot.enabled"%m.id)
	return errors

static func vec(value:Array)->Vector2:return Vector2(float(value[0]),float(value[1]))
static func rect(value:Array)->Rect2:return Rect2(float(value[0]),float(value[1]),float(value[2]),float(value[3]))
static func localized(value:Dictionary,zh:bool)->String:return str(value.cn if zh else value.en)

static func _validate_value(value:Variant,spec:Dictionary,path:String,errors:Array[String])->void:
	if errors.size()>=32:return
	var kind:String=spec.get("type","")
	var valid:=true
	match kind:
		"object":valid=value is Dictionary
		"array":valid=value is Array
		"string":valid=value is String
		"boolean":valid=value is bool
		"number","integer":valid=(value is float or value is int) and is_finite(float(value))
	if not valid:errors.append(path+": expected "+kind);return
	if kind=="object":
		for key in spec.get("required",[]):
			if not value.has(key):errors.append(path+"."+key+": required field missing")
		for key in value:
			if not spec.properties.has(key):errors.append(path+"."+str(key)+": unknown field")
			else:_validate_value(value[key],spec.properties[key],path+"."+str(key),errors)
	elif kind=="array":
		if value.size()<spec.get("minItems",0) or value.size()>spec.get("maxItems",100000):errors.append(path+": invalid array length")
		for i in value.size():_validate_value(value[i],spec.get("items",{}),path+"["+str(i)+"]",errors)
	elif kind in ["number","integer"]:
		if kind=="integer" and float(value)!=floorf(float(value)):errors.append(path+": expected a whole number")
		if value<spec.get("minimum",-INF) or value>spec.get("maximum",INF):errors.append(path+": outside allowed range "+str(spec.get("minimum","-inf"))+".."+str(spec.get("maximum","inf")))
	elif kind=="string":
		if value.length()<spec.get("minLength",0) or value.length()>spec.get("maxLength",100000):errors.append(path+": invalid text length")
		if spec.has("pattern"):
			var expression:=RegEx.new();expression.compile(spec.pattern)
			if expression.search(value)==null:errors.append(path+": invalid format")
	if spec.has("enum") and not value in spec.enum:errors.append(path+": unsupported value "+str(value))
