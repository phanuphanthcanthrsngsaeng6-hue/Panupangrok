class_name RtsSimulation
extends RefCounted
## Deterministic campus-invasion simulation for Campus Hero Defense.
## Positions are continuous cell coordinates on the CampusMap grid.

signal match_ended(result: StringName)
signal state_changed
signal battle_notice(key: StringName, placeholder_values: Dictionary, team: int)
signal tweak_boundary_reached(mode: StringName)

const Catalog := preload("res://scripts/data/hero_catalog.gd")
const Map := preload("res://scripts/data/campus_map.gd")

const TEAM_PLAYER := 0
const TEAM_ENEMY := 1
const TEAM_CIVILIAN := 2
const TEAM_NEUTRAL := -1
const TICK_SECONDS := 1.0 / 30.0
const CLASSROOM_FOOTPRINT := Vector2i(3, 3)
const ARRIVE_EPSILON := 0.14
const SEPARATION_DISTANCE := 0.62
const REPATH_SECONDS := 0.45
const IDLE_LEASH := 6.5
const GUARD_LEASH := 5.5
const RESCUE_TOUCH_RADIUS := 1.35
const SAFE_ZONE_RADIUS := 2.4
const CIVILIAN_HP := 45.0
const CIVILIAN_SPEED := 2.7
const MAX_TRAPPED_CIVILIANS := 6
const CIVILIAN_SPAWN_INTERVAL := 16.0
const BASE_INCOME := 1.0
const ROOM_INCOME := 0.6
const EARLY_CALL_BONUS_PER_SECOND := 1.2
const WAVE_SPAWN_STAGGER := 0.55
const WAVE_HP_GROWTH := 0.05
const HALL_ALERT_COOLDOWN := 8.0
const PROJECTILE_SPEED := 11.0
const RALLY_COST := 150
const RALLY_COOLDOWN := 45.0
const RALLY_DURATION := 10.0
const RALLY_DAMAGE_BONUS := 0.35
const RALLY_HEAL := 0.5
const RALLY_HALL_REPAIR := 220.0
## Varsity Letters: XP needed to reach level 2 and 3, and per-level bonuses.
const LEVEL_XP: Array[int] = [0, 60, 160]
const MAX_LEVEL := 3
const LEVEL_HP_BONUS := 0.2
const LEVEL_DAMAGE_BONUS := 0.15
const XP_PER_BOUNTY := 5.0
const XP_SHARE_RADIUS := 4.0
const XP_RESCUE := 15.0
## Hype meter and Spirit Surge.
const HYPE_MAX := 100.0
const HYPE_KO := 4.0
const HYPE_RESCUE := 10.0
const HYPE_CAPTURE := 20.0
const HYPE_COMBO := 1.0
const SURGE_DURATION := 8.0
const SURGE_DAMAGE_BONUS := 0.5
const SURGE_SPEED_BONUS := 0.3
## Knockout combo chain.
const COMBO_WINDOW := 2.5
const COMBO_SCORE := 10
## Telegraphed heavy attacks.
const BRUTE_SLAM := {"windup": 0.7, "radius": 1.45, "damage": 30.0, "cooldown": 6.5}
const MECH_STOMP := {"windup": 1.0, "radius": 2.7, "damage": 44.0}
const MECH_ROCKETS := {"windup": 1.2, "radius": 1.3, "damage": 34.0, "count": 3, "range": 7.5}
const MECH_SPECIAL_COOLDOWN := 7.0
const STAR_HALL_RATIO := 0.6
const ENEMY_ROOM_HEAL := 6.0
const ALARM_SECONDS := 4.0
const KITE_TRIGGER := 1.7
const KITE_STEP := 2.4
const MELEE_THREAT_RANGE := 2.0
const RETREAT_HP := 0.3
const RETREAT_RECOVER := 0.8
const RETREAT_SEARCH := 10.0
const STAR_RESCUES := 10

## Hero powers: cooldown seconds and short description keys used by the HUD.
const POWERS := {
	&"monitor": {"name": "Hall Pass Dash", "cooldown": 12.0, "duration": 3.5},
	&"blaze": {"name": "Fireball", "cooldown": 14.0, "damage": 48.0, "radius": 2.1, "range": 5.2},
	&"frost": {"name": "Glacier Shield", "cooldown": 16.0, "duration": 5.0, "radius": 3.2, "reduction": 0.6},
	&"psi": {"name": "Mind Lift", "cooldown": 15.0, "duration": 2.6, "radius": 2.3, "range": 6.0},
	&"stretch": {"name": "Rubber Slam", "cooldown": 13.0, "damage": 34.0, "radius": 2.3, "knockback": 1.6},
}

var rng := RandomNumberGenerator.new()
var units: Dictionary = {}
var buildings: Dictionary = {}
var projectiles: Array[Dictionary] = []
var events: Array[Dictionary] = []
var reputation := 0.0
var score := 0
var elapsed := 0.0
var result: StringName = &""
var wave_index := -1
var wave_timer := 0.0
var wave_spawning := false
var wave_queue: Array[Dictionary] = []
var wave_spawn_timer := 0.0
var wave_enemies_alive := 0
var stats := {"rescued": 0, "defeated": 0, "rooms": 0, "heroes_lost": 0, "civilians_lost": 0}
var paused := false
var rally_cooldown := 0.0
var rally_timer := 0.0
var hype := 0.0
var surge_timer := 0.0
var combo := 0
var combo_timer := 0.0
var telegraphs: Array[Dictionary] = []
var stars := 0
var ai := InvaderAI.new()

var _next_id := 1
var _next_telegraph := 1
var _accumulator := 0.0
var _astar := AStarGrid2D.new()
var _solid: Dictionary = {}
var _tweak_values: Dictionary = {}
var _civilian_timer := 6.0
var _decision_timer := 0.0
var _hall_alert_timer := 0.0
var _hall_attack_timer := 0.0
var _focus: Dictionary = {}


func _init(seed_value: int = 0x4D41504C) -> void:
	rng.seed = seed_value


func set_tweak_values(values: Dictionary) -> void:
	_tweak_values = values.duplicate(true)


func tweak_value(id: StringName, fallback: Variant) -> Variant:
	return _tweak_values.get(id, fallback)


# ---------------------------------------------------------------- setup

func setup() -> void:
	units.clear()
	buildings.clear()
	projectiles.clear()
	events.clear()
	_next_id = 1
	result = &""
	elapsed = 0.0
	score = 0
	wave_index = -1
	wave_timer = Catalog.FIRST_WAVE_DELAY
	wave_spawning = false
	wave_queue.clear()
	wave_enemies_alive = 0
	stats = {
		"rescued": 0, "defeated": 0, "rooms": 0, "heroes_lost": 0, "civilians_lost": 0, "best_combo": 0,
		"level_ups": 0, "surges": 0, "powers": 0,
	}
	rally_cooldown = 20.0
	rally_timer = 0.0
	hype = 0.0
	surge_timer = 0.0
	combo = 0
	combo_timer = 0.0
	telegraphs.clear()
	_next_telegraph = 1
	stars = 0
	reputation = float(Catalog.STARTING_REPUTATION) * float(tweak_value(&"gameplay.resource.starting_multiplier", 1.0))
	_civilian_timer = 6.0
	_decision_timer = 0.0
	ai.reset()
	ai.level = clampi(int(tweak_value(&"enemies.ai.level", 2)), 0, 3)
	_focus.clear()
	_build_grid()
	_create_buildings()
	for index in 4:
		var kind: StringName = &"monitor" if index < 3 else &"stretch"
		spawn_unit(kind, Map.HERO_START[index])
	for room: Dictionary in Map.CLASSROOMS:
		var center := building_center(room["id"])
		var guards: Array = room["guards"]
		for guard_index in guards.size():
			var angle := TAU * float(guard_index) / float(guards.size()) + 0.4
			var spot := _free_near(center + Vector2(cos(angle), sin(angle)) * 2.1)
			var guard := spawn_unit(guards[guard_index], spot)
			guard["guard_room"] = room["id"]
			guard["home"] = spot
	var trapped_spots: Array[Vector2] = [
		Vector2(18.5, 28.5), Vector2(11.5, 27.5), Vector2(21.5, 16.5), Vector2(27.5, 11.5), Vector2(13.5, 12.5),
	]
	for spot in trapped_spots:
		spawn_civilian(spot)
	state_changed.emit()


func _build_grid() -> void:
	_solid.clear()
	_astar = AStarGrid2D.new()
	_astar.region = Rect2i(Vector2i.ZERO, Map.SIZE)
	_astar.cell_size = Vector2.ONE
	_astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_ONLY_IF_NO_OBSTACLES
	_astar.default_compute_heuristic = AStarGrid2D.HEURISTIC_OCTILE
	_astar.default_estimate_heuristic = AStarGrid2D.HEURISTIC_OCTILE
	_astar.update()
	_block_rect(Map.MAIN_HALL["origin"], Map.MAIN_HALL["footprint"])
	for room: Dictionary in Map.CLASSROOMS:
		_block_rect(room["origin"], CLASSROOM_FOOTPRINT)
	_block_rect(Map.STATUE["origin"], Map.STATUE["footprint"])
	for tree: Dictionary in Map.TREES:
		_block_rect(tree["cell"], Vector2i.ONE)
	for decor: Dictionary in Map.DECOR:
		for cell: Vector2i in decor["cells"]:
			_block_rect(cell, Vector2i.ONE)


func _block_rect(origin: Vector2i, footprint: Vector2i) -> void:
	for x in footprint.x:
		for y in footprint.y:
			var cell := origin + Vector2i(x, y)
			if _astar.is_in_boundsv(cell):
				_astar.set_point_solid(cell, true)
				_solid[cell] = true


func _create_buildings() -> void:
	buildings[&"main_hall"] = {
		"id": &"main_hall", "origin": Map.MAIN_HALL["origin"], "footprint": Map.MAIN_HALL["footprint"],
		"owner": TEAM_PLAYER, "hp": Catalog.MAIN_HALL_HP, "max_hp": Catalog.MAIN_HALL_HP, "control": 1.0,
		"trains": &"monitor", "queue": [], "train_timer": 0.0, "rally": Vector2(25.5, 26.0), "hit_flash": 0.0,
	}
	for room: Dictionary in Map.CLASSROOMS:
		var id: StringName = room["id"]
		var center := Vector2(room["origin"]) + Vector2(CLASSROOM_FOOTPRINT) * 0.5
		buildings[id] = {
			"id": id, "origin": room["origin"], "footprint": CLASSROOM_FOOTPRINT, "owner": TEAM_ENEMY,
			"hp": 1.0, "max_hp": 1.0, "control": -1.0, "trains": room["trains"], "queue": [],
			"train_timer": 0.0, "rally": _free_near(center + Vector2(0.0, 2.6)), "hit_flash": 0.0,
			"contested": false,
		}


# ---------------------------------------------------------------- spawning

func spawn_unit(kind: StringName, position: Vector2) -> Dictionary:
	tweak_boundary_reached.emit(&"NEXT_SPAWN")
	var data := Catalog.stats(kind)
	var team := int(data.get("team", TEAM_ENEMY))
	var health_multiplier := 1.0
	var speed_multiplier := 1.0
	if team == TEAM_PLAYER:
		health_multiplier = float(tweak_value(&"player.health.multiplier", 1.0))
		speed_multiplier = float(tweak_value(&"player.move.speed_multiplier", 1.0))
	else:
		health_multiplier = float(tweak_value(&"enemies.health.multiplier", 1.0))
		health_multiplier *= 1.0 + WAVE_HP_GROWTH * float(maxi(wave_index, 0))
		speed_multiplier = float(tweak_value(&"enemies.speed.multiplier", 1.0))
	var max_hp := float(data.get("hp", 50.0)) * health_multiplier
	var unit := {
		"id": _next_id, "kind": kind, "team": team, "pos": position, "hp": max_hp, "max_hp": max_hp,
		"speed": float(data.get("speed", 2.0)) * speed_multiplier, "order": &"idle", "order_point": position,
		"target": 0, "path": PackedVector2Array(), "path_index": 0, "repath": 0.0, "cooldown": rng.randf_range(0.0, 0.4),
		"slow_timer": 0.0, "slow": 0.0, "stun_timer": 0.0, "shield_timer": 0.0, "dash_timer": 0.0,
		"power_cooldown": 2.0, "facing": 1.0, "moving": false, "attack_anim": 0.0, "hit_flash": 0.0,
		"home": position, "guard_room": &"", "objective": &"", "wave": -1, "anim_seed": rng.randf() * TAU,
		"xp": 0.0, "level": 1, "base_hp": max_hp, "winding": 0.0, "special_cooldown": rng.randf_range(2.5, 4.5),
		"special_toggle": 0, "squad": 0, "squad_state": &"", "stage_offset": Vector2.ZERO, "retreat_room": &"",
		"retreated": false, "kite_timer": 0.0, "kite_cd": 0.0, "vel": Vector2.ZERO,
	}
	units[_next_id] = unit
	_next_id += 1
	return unit


func spawn_civilian(position: Vector2) -> Dictionary:
	var kind: StringName = Catalog.CIVILIAN_KINDS[rng.randi_range(0, Catalog.CIVILIAN_KINDS.size() - 1)]
	var unit := {
		"id": _next_id, "kind": kind, "team": TEAM_CIVILIAN, "pos": _free_near(position), "hp": CIVILIAN_HP,
		"max_hp": CIVILIAN_HP, "speed": CIVILIAN_SPEED, "order": &"trapped", "order_point": position, "target": 0,
		"path": PackedVector2Array(), "path_index": 0, "repath": 0.0, "cooldown": 0.0, "slow_timer": 0.0,
		"slow": 0.0, "stun_timer": 0.0, "shield_timer": 0.0, "dash_timer": 0.0, "power_cooldown": 0.0,
		"facing": 1.0, "moving": false, "attack_anim": 0.0, "hit_flash": 0.0, "home": position,
		"guard_room": &"", "objective": &"", "wave": -1, "follow": 0, "anim_seed": rng.randf() * TAU,
		"xp": 0.0, "level": 1, "base_hp": CIVILIAN_HP, "winding": 0.0, "special_cooldown": 0.0, "special_toggle": 0,
	}
	units[_next_id] = unit
	_next_id += 1
	return unit


# ---------------------------------------------------------------- queries

func unit(id: int) -> Dictionary:
	return units.get(id, {})


func heroes() -> Array[Dictionary]:
	return _team_units(TEAM_PLAYER)


func enemies() -> Array[Dictionary]:
	return _team_units(TEAM_ENEMY)


func civilians() -> Array[Dictionary]:
	return _team_units(TEAM_CIVILIAN)


func _team_units(team: int) -> Array[Dictionary]:
	var list: Array[Dictionary] = []
	for value: Dictionary in units.values():
		if int(value["team"]) == team and float(value["hp"]) > 0.0:
			list.append(value)
	return list


func population() -> int:
	var count := heroes().size()
	for building: Dictionary in buildings.values():
		if int(building["owner"]) == TEAM_PLAYER:
			count += (building["queue"] as Array).size()
	return count


func population_cap() -> int:
	return Catalog.BASE_POP_CAP + Catalog.POP_PER_ROOM * secured_rooms()


func secured_rooms() -> int:
	var count := 0
	for building: Dictionary in buildings.values():
		if building["id"] != &"main_hall" and int(building["owner"]) == TEAM_PLAYER:
			count += 1
	return count


func building_center(id: StringName) -> Vector2:
	if buildings.has(id):
		var building: Dictionary = buildings[id]
		return Vector2(building["origin"]) + Vector2(building["footprint"]) * 0.5
	if id == &"main_hall":
		return Vector2(Map.MAIN_HALL["origin"]) + Vector2(Map.MAIN_HALL["footprint"]) * 0.5
	var room := Map.classroom(id)
	return Vector2(room.get("origin", Vector2i.ZERO)) + Vector2(CLASSROOM_FOOTPRINT) * 0.5


func building_at(point: Vector2) -> StringName:
	for building: Dictionary in buildings.values():
		var rect := Rect2(Vector2(building["origin"]), Vector2(building["footprint"]))
		if rect.grow(0.1).has_point(point):
			return building["id"]
	return &""


func unit_at(point: Vector2, radius: float = 0.55, team: int = -99) -> int:
	var best := 0
	var best_distance := radius
	for value: Dictionary in units.values():
		if team != -99 and int(value["team"]) != team:
			continue
		var reach := radius + float(Catalog.stats(value["kind"]).get("radius", 0.3)) * 0.6
		var distance := (value["pos"] as Vector2).distance_to(point)
		if distance < reach and (best == 0 or distance < best_distance):
			best = int(value["id"])
			best_distance = distance
	return best


## Queued-but-unspawned invaders for a lane in the current wave.
func pending_spawns(lane: StringName) -> int:
	var count := 0
	for entry: Dictionary in wave_queue:
		if entry["lane"] == lane:
			count += 1
	return count


func free_point_near(point: Vector2) -> Vector2:
	return _free_near(point)


func is_walkable(cell: Vector2i) -> bool:
	return _astar.is_in_boundsv(cell) and not _solid.has(cell)


func next_wave_number() -> int:
	return wave_index + 2


func total_waves() -> int:
	return Catalog.WAVES.size()


func can_train(building_id: StringName) -> Dictionary:
	var building: Dictionary = buildings.get(building_id, {})
	if building.is_empty() or int(building["owner"]) != TEAM_PLAYER:
		return {"ok": false, "reason": &"notice.room_not_secured"}
	var kind: StringName = building["trains"]
	var cost := int(Catalog.stats(kind)["cost"])
	if (building["queue"] as Array).size() >= Catalog.QUEUE_LIMIT:
		return {"ok": false, "reason": &"notice.queue_full"}
	if population() >= population_cap():
		return {"ok": false, "reason": &"notice.squad_full"}
	if reputation < float(cost):
		return {"ok": false, "reason": &"notice.need_reputation"}
	return {"ok": true, "reason": &""}


func power_ready_count(ids: Array) -> int:
	var count := 0
	for id: int in ids:
		var value: Dictionary = units.get(id, {})
		if not value.is_empty() and int(value["team"]) == TEAM_PLAYER and float(value["power_cooldown"]) <= 0.0:
			count += 1
	return count


func can_surge() -> Dictionary:
	if surge_timer > 0.0:
		return {"ok": false, "reason": &"notice.surge_active"}
	if hype < HYPE_MAX:
		return {"ok": false, "reason": &"notice.need_hype"}
	return {"ok": true, "reason": &""}


## Spirit Surge: spends a full Hype meter for a team-wide damage and speed boost.
func spirit_surge() -> bool:
	var check := can_surge()
	if not bool(check["ok"]):
		battle_notice.emit(check["reason"], {}, TEAM_PLAYER)
		return false
	hype = 0.0
	surge_timer = SURGE_DURATION
	stats["surges"] = int(stats["surges"]) + 1
	for hero: Dictionary in heroes():
		events.append({"type": &"surge_hero", "pos": hero["pos"], "id": hero["id"]})
	events.append({"type": &"surge", "pos": building_center(&"main_hall")})
	battle_notice.emit(&"notice.surge", {}, TEAM_PLAYER)
	state_changed.emit()
	return true


func add_hype(amount: float) -> void:
	if surge_timer > 0.0:
		return
	var before := hype
	hype = minf(HYPE_MAX, hype + amount)
	if before < HYPE_MAX and hype >= HYPE_MAX:
		events.append({"type": &"hype_full"})
		battle_notice.emit(&"notice.hype_full", {}, TEAM_PLAYER)


func level_damage_multiplier(value: Dictionary) -> float:
	return 1.0 + LEVEL_DAMAGE_BONUS * float(int(value.get("level", 1)) - 1)


## Progress toward the next level in 0..1 (1.0 at max level).
func level_progress(value: Dictionary) -> float:
	var level := int(value.get("level", 1))
	if level >= MAX_LEVEL:
		return 1.0
	var low := float(LEVEL_XP[level - 1])
	var high := float(LEVEL_XP[level])
	return clampf((float(value.get("xp", 0.0)) - low) / maxf(high - low, 1.0), 0.0, 1.0)


func _grant_xp(hero: Dictionary, amount: float) -> void:
	if hero.is_empty() or int(hero["team"]) != TEAM_PLAYER or float(hero["hp"]) <= 0.0 or amount <= 0.0:
		return
	hero["xp"] = float(hero["xp"]) + amount
	while int(hero["level"]) < MAX_LEVEL and float(hero["xp"]) >= float(LEVEL_XP[int(hero["level"])]):
		hero["level"] = int(hero["level"]) + 1
		hero["max_hp"] = float(hero["base_hp"]) * (1.0 + LEVEL_HP_BONUS * float(int(hero["level"]) - 1))
		hero["hp"] = float(hero["max_hp"])
		stats["level_ups"] = int(stats["level_ups"]) + 1
		events.append({"type": &"level_up", "pos": hero["pos"], "id": hero["id"], "kind": hero["kind"], "level": hero["level"]})
		battle_notice.emit(&"notice.level_up", {"name": Catalog.stats(hero["kind"])["name"], "level": hero["level"]}, TEAM_PLAYER)


## Enemy counts for a wave index, used by the wave bulletin.
func wave_composition(index: int) -> Dictionary:
	if index < 0 or index >= Catalog.WAVES.size():
		return {}
	var wave: Dictionary = Catalog.WAVES[index]
	var counts := {}
	for kind: StringName in [&"goon", &"blaster", &"brute", &"mech"]:
		if int(wave[kind]) > 0:
			counts[kind] = int(wave[kind])
	return {"counts": counts, "lanes": wave["lanes"], "final": index == Catalog.WAVES.size() - 1}


func hall_ratio() -> float:
	var hall: Dictionary = buildings.get(&"main_hall", {})
	if hall.is_empty():
		return 0.0
	return clampf(float(hall["hp"]) / maxf(float(hall["max_hp"]), 1.0), 0.0, 1.0)


## Star rating: 1 for victory, +1 for a healthy Main Hall, +1 for holding every room or rescuing enough classmates.
func compute_stars() -> Dictionary:
	var earned := {"victory": result == &"victory", "hall": false, "campus": false}
	if result == &"victory":
		earned["hall"] = hall_ratio() >= STAR_HALL_RATIO
		earned["campus"] = secured_rooms() >= Map.CLASSROOMS.size() or int(stats["rescued"]) >= STAR_RESCUES
	var total := 0
	for key: String in earned:
		if bool(earned[key]):
			total += 1
	earned["total"] = total
	return earned


# ---------------------------------------------------------------- commands

func command_move(ids: Array, point: Vector2, attack_move: bool) -> void:
	var movers: Array[Dictionary] = []
	for id: int in ids:
		var value: Dictionary = units.get(id, {})
		if not value.is_empty() and int(value["team"]) == TEAM_PLAYER:
			movers.append(value)
	var offsets := _formation_offsets(movers.size())
	for index in movers.size():
		var mover := movers[index]
		var destination := _free_near(point + offsets[index])
		mover["order"] = &"attack_move" if attack_move else &"move"
		mover["order_point"] = destination
		mover["home"] = destination
		mover["target"] = 0
		_set_path(mover, destination)


func command_attack(ids: Array, target_id: int) -> void:
	if not units.has(target_id):
		return
	for id: int in ids:
		var value: Dictionary = units.get(id, {})
		if value.is_empty() or int(value["team"]) != TEAM_PLAYER:
			continue
		value["order"] = &"attack"
		value["target"] = target_id
		value["repath"] = 0.0


func command_stop(ids: Array) -> void:
	for id: int in ids:
		var value: Dictionary = units.get(id, {})
		if value.is_empty() or int(value["team"]) != TEAM_PLAYER:
			continue
		value["order"] = &"idle"
		value["target"] = 0
		value["home"] = value["pos"]
		value["path"] = PackedVector2Array()


func command_power(ids: Array) -> int:
	var used := 0
	for id: int in ids:
		var value: Dictionary = units.get(id, {})
		if value.is_empty() or int(value["team"]) != TEAM_PLAYER or float(value["power_cooldown"]) > 0.0:
			continue
		if _use_power(value):
			used += 1
	return used


func queue_training(building_id: StringName) -> bool:
	var check := can_train(building_id)
	if not bool(check["ok"]):
		battle_notice.emit(check["reason"], {}, TEAM_PLAYER)
		return false
	var building: Dictionary = buildings[building_id]
	var kind: StringName = building["trains"]
	reputation -= float(Catalog.stats(kind)["cost"])
	var queue: Array = building["queue"]
	if queue.is_empty():
		tweak_boundary_reached.emit(&"NEXT_ACTION")
		building["train_timer"] = _train_time(kind)
	queue.append(kind)
	events.append({"type": &"queued", "building": building_id, "kind": kind})
	state_changed.emit()
	return true


func cancel_training(building_id: StringName) -> bool:
	var building: Dictionary = buildings.get(building_id, {})
	if building.is_empty():
		return false
	var queue: Array = building["queue"]
	if queue.is_empty():
		return false
	var kind: StringName = queue.pop_back()
	reputation += float(Catalog.stats(kind)["cost"])
	if queue.is_empty():
		building["train_timer"] = 0.0
	state_changed.emit()
	return true


func set_rally(building_id: StringName, point: Vector2) -> void:
	if buildings.has(building_id):
		buildings[building_id]["rally"] = _free_near(point)


func call_wave_early() -> int:
	if result != &"" or wave_spawning or wave_index + 1 >= Catalog.WAVES.size():
		return 0
	var bonus := int(round(wave_timer * EARLY_CALL_BONUS_PER_SECOND))
	reputation += bonus
	wave_timer = 0.0
	if bonus > 0:
		events.append({"type": &"bonus", "amount": bonus, "pos": building_center(&"main_hall")})
	return bonus


func can_pep_rally() -> Dictionary:
	if rally_cooldown > 0.0:
		return {"ok": false, "reason": &"notice.rally_cooldown"}
	if reputation < float(RALLY_COST):
		return {"ok": false, "reason": &"notice.need_reputation"}
	return {"ok": true, "reason": &""}


## Spends reputation to heal every hero, boost their damage and patch up the Main Hall.
func pep_rally() -> bool:
	var check := can_pep_rally()
	if not bool(check["ok"]):
		battle_notice.emit(check["reason"], {}, TEAM_PLAYER)
		return false
	reputation -= float(RALLY_COST)
	rally_cooldown = RALLY_COOLDOWN
	rally_timer = RALLY_DURATION
	for hero: Dictionary in heroes():
		hero["hp"] = minf(float(hero["max_hp"]), float(hero["hp"]) + float(hero["max_hp"]) * RALLY_HEAL)
		events.append({"type": &"rally_hero", "pos": hero["pos"], "id": hero["id"]})
	var hall: Dictionary = buildings[&"main_hall"]
	hall["hp"] = minf(float(hall["max_hp"]), float(hall["hp"]) + RALLY_HALL_REPAIR)
	events.append({"type": &"rally", "pos": building_center(&"main_hall")})
	battle_notice.emit(&"notice.pep_rally", {}, TEAM_PLAYER)
	state_changed.emit()
	return true


func _train_time(kind: StringName) -> float:
	return float(Catalog.stats(kind)["train"]) * float(tweak_value(&"gameplay.build.duration_multiplier", 1.0))


func _formation_offsets(count: int) -> Array[Vector2]:
	var offsets: Array[Vector2] = []
	if count <= 0:
		return offsets
	offsets.append(Vector2.ZERO)
	var ring := 1
	while offsets.size() < count:
		var slots := ring * 6
		for slot in slots:
			if offsets.size() >= count:
				break
			var angle := TAU * float(slot) / float(slots)
			offsets.append(Vector2(cos(angle), sin(angle)) * 0.78 * float(ring))
		ring += 1
	return offsets


# ---------------------------------------------------------------- tick

func advance(delta: float) -> void:
	if paused or result != &"":
		return
	_accumulator += minf(delta, 0.25)
	var steps := 0
	while _accumulator >= TICK_SECONDS and steps < 8:
		_accumulator -= TICK_SECONDS
		step(TICK_SECONDS)
		steps += 1
		if result != &"":
			break


func step(dt: float) -> void:
	if result != &"":
		return
	elapsed += dt
	_update_economy(dt)
	_update_waves(dt)
	_update_civilian_spawns(dt)
	_update_decisions(dt)
	ai.update(self, dt)
	_rebuild_focus()
	for value: Dictionary in units.values():
		if float(value["hp"]) > 0.0:
			_update_timers(value, dt)
	for value: Dictionary in units.values().duplicate():
		if not units.has(int(value["id"])) or float(value["hp"]) <= 0.0:
			continue
		match int(value["team"]):
			TEAM_PLAYER:
				_update_hero(value, dt)
			TEAM_ENEMY:
				_update_enemy(value, dt)
			TEAM_CIVILIAN:
				_update_civilian(value, dt)
	_separate_units(dt)
	_update_projectiles(dt)
	_update_telegraphs(dt)
	_update_main_hall(dt)
	_update_rooms(dt)
	_update_training(dt)
	_remove_dead()
	_check_outcome()


func _update_economy(dt: float) -> void:
	reputation += (BASE_INCOME + ROOM_INCOME * float(secured_rooms())) * dt
	_hall_alert_timer = maxf(0.0, _hall_alert_timer - dt)
	rally_cooldown = maxf(0.0, rally_cooldown - dt)
	rally_timer = maxf(0.0, rally_timer - dt)
	var surge_before := surge_timer
	surge_timer = maxf(0.0, surge_timer - dt)
	if surge_before > 0.0 and surge_timer <= 0.0:
		events.append({"type": &"surge_end"})
	if combo_timer > 0.0:
		combo_timer = maxf(0.0, combo_timer - dt)
		if combo_timer <= 0.0:
			if combo >= 2:
				events.append({"type": &"combo_end", "count": combo})
			combo = 0


func _update_timers(value: Dictionary, dt: float) -> void:
	value["cooldown"] = maxf(0.0, float(value["cooldown"]) - dt)
	value["power_cooldown"] = maxf(0.0, float(value["power_cooldown"]) - dt)
	value["slow_timer"] = maxf(0.0, float(value["slow_timer"]) - dt)
	value["stun_timer"] = maxf(0.0, float(value["stun_timer"]) - dt)
	value["shield_timer"] = maxf(0.0, float(value["shield_timer"]) - dt)
	value["dash_timer"] = maxf(0.0, float(value["dash_timer"]) - dt)
	value["attack_anim"] = maxf(0.0, float(value["attack_anim"]) - dt)
	value["hit_flash"] = maxf(0.0, float(value["hit_flash"]) - dt)
	value["repath"] = maxf(0.0, float(value["repath"]) - dt)
	value["winding"] = maxf(0.0, float(value["winding"]) - dt)
	value["special_cooldown"] = maxf(0.0, float(value["special_cooldown"]) - dt)
	value["moving"] = false
	value["vel"] = Vector2.ZERO


# ---------------------------------------------------------------- waves

func _update_waves(dt: float) -> void:
	if wave_spawning:
		wave_spawn_timer -= dt
		while wave_spawn_timer <= 0.0 and not wave_queue.is_empty():
			var entry: Dictionary = wave_queue.pop_front()
			var spawn: Vector2 = Map.SPAWNS[entry["lane"]]
			var enemy := spawn_unit(entry["kind"], _free_near(spawn + Vector2(rng.randf_range(-1.2, 1.2), rng.randf_range(-1.2, 1.2))))
			enemy["wave"] = wave_index
			enemy["objective"] = _choose_objective(enemy)
			ai.assign(enemy, entry["lane"], wave_index)
			wave_enemies_alive += 1
			wave_spawn_timer += WAVE_SPAWN_STAGGER
			events.append({"type": &"spawn", "pos": enemy["pos"], "kind": entry["kind"], "lane": entry["lane"]})
			if entry["kind"] == &"mech":
				battle_notice.emit(&"notice.boss", {}, TEAM_ENEMY)
				events.append({"type": &"boss", "pos": enemy["pos"]})
		if wave_queue.is_empty():
			wave_spawning = false
			wave_timer = Catalog.WAVE_INTERVAL
		return
	if wave_index + 1 >= Catalog.WAVES.size():
		return
	wave_timer -= dt
	if wave_timer <= 0.0:
		_start_wave()


func _start_wave() -> void:
	wave_index += 1
	var wave: Dictionary = Catalog.WAVES[wave_index]
	var lanes: Array = wave["lanes"]
	wave_queue.clear()
	var lane_index := 0
	for kind: StringName in [&"goon", &"blaster", &"brute", &"mech"]:
		for count in int(wave[kind]):
			wave_queue.append({"kind": kind, "lane": lanes[lane_index % lanes.size()]})
			lane_index += 1
	# Interleave so ranged and heavy invaders arrive mixed with goons.
	var mixed: Array[Dictionary] = []
	var goons: Array[Dictionary] = []
	var others: Array[Dictionary] = []
	for entry: Dictionary in wave_queue:
		if entry["kind"] == &"goon":
			goons.append(entry)
		else:
			others.append(entry)
	while not goons.is_empty() or not others.is_empty():
		if not goons.is_empty():
			mixed.append(goons.pop_front())
		if not goons.is_empty():
			mixed.append(goons.pop_front())
		if not others.is_empty():
			mixed.append(others.pop_front())
	wave_queue = mixed
	wave_spawning = true
	wave_spawn_timer = 0.0
	ai.begin_wave(self, lanes)
	for lane_value: StringName in lanes:
		events.append({"type": &"wave_lane", "pos": Map.SPAWNS[lane_value], "lane": lane_value})
	events.append({"type": &"wave", "index": wave_index})
	battle_notice.emit(&"notice.wave_incoming", {"wave": wave_index + 1, "total": Catalog.WAVES.size()}, TEAM_ENEMY)
	for count in 2:
		_spawn_random_civilian()
	state_changed.emit()


func _choose_objective(enemy: Dictionary) -> StringName:
	var hero_rooms: Array[StringName] = []
	for building: Dictionary in buildings.values():
		if building["id"] != &"main_hall" and int(building["owner"]) == TEAM_PLAYER:
			hero_rooms.append(building["id"])
	if enemy["kind"] == &"mech" or hero_rooms.is_empty() or rng.randf() < 0.5:
		return &"main_hall"
	var best: StringName = hero_rooms[0]
	var best_distance := INF
	for id in hero_rooms:
		var distance := (enemy["pos"] as Vector2).distance_to(building_center(id))
		if distance < best_distance:
			best_distance = distance
			best = id
	return best


func _update_decisions(dt: float) -> void:
	_decision_timer -= dt
	if _decision_timer > 0.0:
		return
	_decision_timer = float(tweak_value(&"enemies.ai.decision_interval", 1.4)) * ai.think_multiplier()
	for enemy: Dictionary in enemies():
		var objective: StringName = enemy["objective"]
		if objective == &"" or (ai.level > 0 and int(enemy["squad"]) > 0):
			continue
		if objective != &"main_hall" and int(buildings[objective]["owner"]) == TEAM_ENEMY:
			enemy["objective"] = _choose_objective(enemy)
			enemy["path"] = PackedVector2Array()


func _update_civilian_spawns(dt: float) -> void:
	_civilian_timer -= dt
	if _civilian_timer > 0.0:
		return
	_civilian_timer = CIVILIAN_SPAWN_INTERVAL
	_spawn_random_civilian()


func _spawn_random_civilian() -> void:
	var trapped := 0
	for civilian: Dictionary in civilians():
		if civilian["order"] == &"trapped":
			trapped += 1
	if trapped >= MAX_TRAPPED_CIVILIANS:
		return
	var hall := building_center(&"main_hall")
	for attempt in 24:
		var cell := Vector2i(rng.randi_range(4, Map.SIZE.x - 5), rng.randi_range(4, Map.SIZE.y - 5))
		var point := Vector2(cell) + Vector2(0.5, 0.5)
		if not is_walkable(cell) or point.distance_to(hall) < 9.0:
			continue
		var crowded := false
		for other: Dictionary in units.values():
			if (other["pos"] as Vector2).distance_to(point) < 2.5:
				crowded = true
				break
		if crowded:
			continue
		spawn_civilian(point)
		events.append({"type": &"civilian_spawn", "pos": point})
		return


# ---------------------------------------------------------------- heroes

func _update_hero(hero: Dictionary, dt: float) -> void:
	if float(hero["stun_timer"]) > 0.0:
		return
	_try_rescue(hero)
	var order: StringName = hero["order"]
	var data := Catalog.stats(hero["kind"])
	match order:
		&"move":
			if _follow_path(hero, dt):
				hero["order"] = &"idle"
		&"attack":
			var target: Dictionary = units.get(int(hero["target"]), {})
			if target.is_empty() or float(target["hp"]) <= 0.0:
				hero["order"] = &"idle"
				hero["home"] = hero["pos"]
				hero["target"] = 0
			else:
				_engage(hero, target, dt)
		&"attack_move":
			var foe := _find_target(hero, float(data["acquire"]))
			if not foe.is_empty():
				_engage(hero, foe, dt)
			elif _follow_path(hero, dt):
				hero["order"] = &"idle"
		_:
			var foe := _find_target(hero, float(data["acquire"]))
			var home: Vector2 = hero["home"]
			if not foe.is_empty() and (foe["pos"] as Vector2).distance_to(home) <= IDLE_LEASH + float(data["range"]):
				_engage(hero, foe, dt)
			elif (hero["pos"] as Vector2).distance_to(home) > 0.6:
				if hero["path"].is_empty() or float(hero["repath"]) <= 0.0:
					_set_path(hero, home)
					hero["repath"] = 1.0
				_follow_path(hero, dt)


func _try_rescue(hero: Dictionary) -> void:
	for civilian: Dictionary in civilians():
		if civilian["order"] != &"trapped":
			continue
		if (civilian["pos"] as Vector2).distance_to(hero["pos"]) <= RESCUE_TOUCH_RADIUS:
			civilian["order"] = &"follow"
			civilian["follow"] = hero["id"]
			events.append({"type": &"escort", "pos": civilian["pos"], "id": civilian["id"]})


# ---------------------------------------------------------------- enemies

func _update_enemy(enemy: Dictionary, dt: float) -> void:
	enemy["kite_timer"] = maxf(0.0, float(enemy["kite_timer"]) - dt)
	enemy["kite_cd"] = maxf(0.0, float(enemy["kite_cd"]) - dt)
	if float(enemy["stun_timer"]) > 0.0:
		return
	if float(enemy["winding"]) > 0.0:
		return
	var data := Catalog.stats(enemy["kind"])
	if float(enemy["kite_timer"]) > 0.0:
		if _follow_path(enemy, dt):
			enemy["kite_timer"] = 0.0
		return
	if _try_heavy_attack(enemy):
		return
	var guard_room: StringName = enemy["guard_room"]
	if guard_room != &"":
		_update_guard(enemy, guard_room, data, dt)
		return
	if ai.level >= 2 and _update_retreat(enemy, dt):
		return
	var foe := _find_target(enemy, float(data["acquire"]))
	if not foe.is_empty():
		_engage(enemy, foe, dt)
		return
	if enemy["squad_state"] == &"gather":
		var squad := ai.squad(int(enemy["squad"]))
		if not squad.is_empty():
			var stage: Vector2 = (squad["stage"] as Vector2) + (enemy["stage_offset"] as Vector2)
			if (enemy["pos"] as Vector2).distance_to(stage) > 0.8:
				if enemy["path"].is_empty() or float(enemy["repath"]) <= 0.0:
					_set_path(enemy, stage)
					enemy["repath"] = 1.5
				_follow_path(enemy, dt)
			return
	var objective: StringName = enemy["objective"]
	if objective == &"":
		objective = &"main_hall"
		enemy["objective"] = objective
	if objective == &"main_hall":
		var hall: Dictionary = buildings[&"main_hall"]
		var reach := _distance_to_building(enemy["pos"], hall)
		if reach <= float(data["range"]) + 0.35:
			_attack_building(enemy, hall)
			return
		if enemy["path"].is_empty() or float(enemy["repath"]) <= 0.0:
			_set_path(enemy, _approach_point(hall, enemy["pos"]))
			enemy["repath"] = 2.0
		_follow_path(enemy, dt)
		return
	var center := building_center(objective)
	if (enemy["pos"] as Vector2).distance_to(center) <= Catalog.CAPTURE_RADIUS - 0.5:
		return
	if enemy["path"].is_empty() or float(enemy["repath"]) <= 0.0:
		_set_path(enemy, _approach_point(buildings[objective], enemy["pos"]))
		enemy["repath"] = 2.0
	_follow_path(enemy, dt)


## Room guards hold their post; once any guard spots a hero the whole room
## is alarmed and reacts from further away (Rookie and up).
func _update_guard(enemy: Dictionary, room_id: StringName, data: Dictionary, dt: float) -> void:
	var home: Vector2 = enemy["home"]
	var room: Dictionary = buildings[room_id]
	var alarmed := ai.level >= 1 and float(room.get("alarm", 0.0)) > 0.0
	var acquire := float(data["acquire"]) + (2.5 if alarmed else 0.0)
	var leash := GUARD_LEASH + (2.0 if alarmed else 0.0)
	var foe := _find_target(enemy, acquire)
	if not foe.is_empty() and (foe["pos"] as Vector2).distance_to(home) <= leash:
		if ai.level >= 1 and int(foe["team"]) == TEAM_PLAYER and int(room["owner"]) == TEAM_ENEMY:
			if float(room.get("alarm", 0.0)) <= 0.0:
				events.append({"type": &"alarm", "pos": building_center(room_id), "building": room_id})
			room["alarm"] = ALARM_SECONDS
		_engage(enemy, foe, dt)
	elif (enemy["pos"] as Vector2).distance_to(home) > 0.5:
		if enemy["path"].is_empty() or float(enemy["repath"]) <= 0.0:
			_set_path(enemy, home)
			enemy["repath"] = 1.2
		_follow_path(enemy, dt)


## Wounded goons and blasters limp back to a quiet Grimsby-held room to
## patch up, then rejoin their squad (Varsity and up). Returns true while busy.
func _update_retreat(enemy: Dictionary, dt: float) -> bool:
	var room_id: StringName = enemy["retreat_room"]
	var ratio := float(enemy["hp"]) / maxf(1.0, float(enemy["max_hp"]))
	if room_id == &"":
		if ratio >= RETREAT_HP or bool(enemy["retreated"]) or not (enemy["kind"] in [&"goon", &"blaster"]):
			return false
		room_id = _retreat_room_for(enemy["pos"])
		if room_id == &"":
			return false
		enemy["retreat_room"] = room_id
		enemy["retreated"] = true
		enemy["objective"] = room_id
		enemy["path"] = PackedVector2Array()
		enemy["target"] = 0
		events.append({"type": &"retreat", "pos": enemy["pos"], "building": room_id})
	var room: Dictionary = buildings[room_id]
	if int(room["owner"]) != TEAM_ENEMY or ratio >= RETREAT_RECOVER:
		enemy["retreat_room"] = &""
		var squad := ai.squad(int(enemy["squad"]))
		var back: StringName = &"main_hall"
		if not squad.is_empty() and squad["objective"] != &"":
			back = squad["objective"]
		enemy["objective"] = back
		enemy["path"] = PackedVector2Array()
		return false
	var cornered := _find_target(enemy, 1.3)
	if not cornered.is_empty():
		_engage(enemy, cornered, dt)
		return true
	if (enemy["pos"] as Vector2).distance_to(building_center(room_id)) > Catalog.CAPTURE_RADIUS - 0.8:
		if enemy["path"].is_empty() or float(enemy["repath"]) <= 0.0:
			_set_path(enemy, _approach_point(room, enemy["pos"]))
			enemy["repath"] = 1.5
		_follow_path(enemy, dt)
	return true


func _retreat_room_for(point: Vector2) -> StringName:
	var best: StringName = &""
	var best_distance := RETREAT_SEARCH
	for id: StringName in buildings:
		var building: Dictionary = buildings[id]
		if id == &"main_hall" or int(building["owner"]) != TEAM_ENEMY:
			continue
		var center := building_center(id)
		var distance := point.distance_to(center)
		if distance >= best_distance:
			continue
		var watched := false
		for hero: Dictionary in heroes():
			if (hero["pos"] as Vector2).distance_to(center) <= 4.0:
				watched = true
				break
		if not watched:
			best_distance = distance
			best = id
	return best


## Blasters step away from melee heroes that close in, then resume firing.
func _try_kite(enemy: Dictionary) -> bool:
	var pos: Vector2 = enemy["pos"]
	var threat: Dictionary = {}
	var closest := KITE_TRIGGER
	for hero: Dictionary in heroes():
		if float(Catalog.stats(hero["kind"])["range"]) > MELEE_THREAT_RANGE:
			continue
		var distance := pos.distance_to(hero["pos"])
		if distance < closest:
			closest = distance
			threat = hero
	if threat.is_empty():
		return false
	var away := pos - (threat["pos"] as Vector2)
	away = away.normalized() if away.length() > 0.01 else Vector2.RIGHT.rotated(rng.randf() * TAU)
	for angle: float in [0.0, 0.6, -0.6, 1.2, -1.2]:
		var point := pos + away.rotated(angle) * KITE_STEP
		if is_walkable(Vector2i(point.floor())) and _line_clear(pos, point):
			enemy["path"] = PackedVector2Array([point])
			enemy["path_index"] = 0
			enemy["kite_timer"] = 0.8
			enemy["kite_cd"] = ai.kite_cooldown()
			events.append({"type": &"kite", "pos": pos})
			return true
	return false


func _rebuild_focus() -> void:
	_focus.clear()
	if ai.level < 2:
		return
	for enemy: Dictionary in enemies():
		var target := int(enemy["target"])
		if target > 0:
			_focus[target] = int(_focus.get(target, 0)) + 1


func _is_capturing(hero: Dictionary) -> bool:
	for id: StringName in buildings:
		var building: Dictionary = buildings[id]
		if id == &"main_hall" or int(building["owner"]) == TEAM_PLAYER:
			continue
		if (hero["pos"] as Vector2).distance_to(building_center(id)) <= Catalog.CAPTURE_RADIUS:
			return true
	return false


func _attack_building(enemy: Dictionary, building: Dictionary) -> void:
	var data := Catalog.stats(enemy["kind"])
	enemy["facing"] = signf(IsoProjection.project(building_center(building["id"]) - enemy["pos"]).x + 0.001)
	if float(enemy["cooldown"]) > 0.0:
		return
	enemy["cooldown"] = float(data["cooldown"])
	enemy["attack_anim"] = 0.35
	var damage := float(data["damage"]) * float(data.get("building_bonus", 1.0))
	if data["attack"] == &"blaster":
		_fire_projectile(enemy, 0, building_center(building["id"]), damage, 0.0, &"hall")
		return
	_damage_hall(damage, enemy["pos"])


func _damage_hall(amount: float, from: Vector2) -> void:
	var hall: Dictionary = buildings[&"main_hall"]
	hall["hp"] = maxf(0.0, float(hall["hp"]) - amount)
	hall["hit_flash"] = 0.18
	events.append({"type": &"hall_hit", "pos": from, "amount": amount})
	if _hall_alert_timer <= 0.0:
		_hall_alert_timer = HALL_ALERT_COOLDOWN
		battle_notice.emit(&"notice.hall_under_attack", {}, TEAM_ENEMY)


# ---------------------------------------------------------------- civilians

func _update_civilian(civilian: Dictionary, dt: float) -> void:
	if civilian["order"] == &"trapped":
		return
	var leader: Dictionary = units.get(int(civilian["follow"]), {})
	if leader.is_empty():
		civilian["order"] = &"trapped"
		civilian["path"] = PackedVector2Array()
		return
	var safe := _safe_zone_for(civilian["pos"])
	if safe != &"":
		_rescue(civilian, safe)
		return
	var leader_pos: Vector2 = leader["pos"]
	var distance := (civilian["pos"] as Vector2).distance_to(leader_pos)
	if distance > 1.1:
		if civilian["path"].is_empty() or float(civilian["repath"]) <= 0.0:
			_set_path(civilian, leader_pos)
			civilian["repath"] = REPATH_SECONDS
		_follow_path(civilian, dt)


func _safe_zone_for(position: Vector2) -> StringName:
	for building: Dictionary in buildings.values():
		if int(building["owner"]) != TEAM_PLAYER:
			continue
		if _distance_to_building(position, building) <= SAFE_ZONE_RADIUS:
			return building["id"]
	return &""


func _rescue(civilian: Dictionary, building_id: StringName) -> void:
	units.erase(int(civilian["id"]))
	reputation += Catalog.RESCUE_REWARD
	stats["rescued"] = int(stats["rescued"]) + 1
	_add_score(Catalog.RESCUE_SCORE)
	_grant_xp(units.get(int(civilian["follow"]), {}), XP_RESCUE)
	add_hype(HYPE_RESCUE)
	events.append({"type": &"rescued", "pos": civilian["pos"], "amount": Catalog.RESCUE_REWARD, "building": building_id})
	battle_notice.emit(&"notice.rescued", {"amount": Catalog.RESCUE_REWARD}, TEAM_PLAYER)


# ---------------------------------------------------------------- combat

func _find_target(attacker: Dictionary, radius: float) -> Dictionary:
	var team := int(attacker["team"])
	var smart := team == TEAM_ENEMY and ai.level >= 2
	var best: Dictionary = {}
	var best_score := INF
	var pos: Vector2 = attacker["pos"]
	for other: Dictionary in units.values():
		var other_team := int(other["team"])
		if other_team == team or float(other["hp"]) <= 0.0:
			continue
		if team == TEAM_PLAYER and other_team != TEAM_ENEMY:
			continue
		if other_team == TEAM_CIVILIAN and other["order"] == &"trapped":
			continue
		var distance := pos.distance_to(other["pos"])
		if distance > radius:
			continue
		var weight := distance
		if other_team == TEAM_CIVILIAN:
			weight += 1.5
		if smart:
			weight -= (1.0 - float(other["hp"]) / maxf(1.0, float(other.get("max_hp", other["hp"])))) * (1.3 if ai.level >= 3 else 0.9)
			weight -= minf(float(_focus.get(int(other["id"]), 0)), 2.0) * (0.45 if ai.level >= 3 else 0.3)
			if float(other.get("shield_timer", 0.0)) > 0.0:
				weight += 1.2
			if int(attacker["target"]) == int(other["id"]):
				weight -= 0.5
			if other_team == TEAM_PLAYER and _is_capturing(other):
				weight -= 0.8
		if weight < best_score:
			best_score = weight
			best = other
	return best


func _engage(attacker: Dictionary, target: Dictionary, dt: float) -> void:
	var data := Catalog.stats(attacker["kind"])
	if attacker["kind"] == &"blaster" and ai.level >= 2 and float(attacker["kite_cd"]) <= 0.0 and _try_kite(attacker):
		return
	var attack_range := float(data["range"]) + float(Catalog.stats(target["kind"]).get("radius", 0.3)) * 0.8
	var distance := (attacker["pos"] as Vector2).distance_to(target["pos"])
	attacker["target"] = target["id"]
	if distance > attack_range:
		if attacker["path"].is_empty() or float(attacker["repath"]) <= 0.0:
			_set_path(attacker, target["pos"])
			attacker["repath"] = REPATH_SECONDS
		_follow_path(attacker, dt)
		return
	attacker["path"] = PackedVector2Array()
	attacker["facing"] = signf(IsoProjection.project(target["pos"] - attacker["pos"]).x + 0.001)
	if float(attacker["cooldown"]) > 0.0:
		return
	attacker["cooldown"] = float(data["cooldown"])
	attacker["attack_anim"] = 0.32
	var damage := float(data["damage"])
	if int(attacker["team"]) == TEAM_PLAYER:
		damage *= hero_damage_multiplier(attacker)
	var attack: StringName = data["attack"]
	if attack in [&"fire", &"psi", &"blaster"]:
		_fire_projectile(attacker, int(target["id"]), target["pos"], damage, float(data.get("splash", 0.0)), attack)
	else:
		events.append({"type": &"swing", "pos": target["pos"], "from": attacker["pos"], "attack": attack})
		_apply_hit(attacker, target, damage, attack)
		var splash := float(data.get("splash", 0.0))
		if splash > 0.0:
			_splash(attacker, target["pos"], damage * 0.5, splash, int(target["id"]), attack)


func _fire_projectile(source: Dictionary, target_id: int, point: Vector2, damage: float, splash: float, kind: StringName) -> void:
	var origin: Vector2 = source["pos"]
	projectiles.append({
		"source": source["id"], "team": source["team"], "target": target_id, "pos": origin, "from": origin,
		"to": point, "damage": damage, "splash": splash, "kind": kind, "source_kind": source["kind"],
	})


func _update_projectiles(dt: float) -> void:
	var remaining: Array[Dictionary] = []
	for projectile: Dictionary in projectiles:
		var target: Dictionary = units.get(int(projectile["target"]), {})
		if not target.is_empty():
			projectile["to"] = target["pos"]
		var pos: Vector2 = projectile["pos"]
		var to: Vector2 = projectile["to"]
		var step_length := PROJECTILE_SPEED * dt
		if pos.distance_to(to) <= step_length:
			_projectile_arrive(projectile, target)
			continue
		projectile["pos"] = pos + (to - pos).normalized() * step_length
		remaining.append(projectile)
	projectiles = remaining


func _projectile_arrive(projectile: Dictionary, target: Dictionary) -> void:
	var kind: StringName = projectile["kind"]
	var source: Dictionary = units.get(int(projectile["source"]), {})
	if source.is_empty():
		source = {"id": 0, "team": projectile["team"], "kind": projectile["source_kind"], "pos": projectile["from"]}
	if kind == &"hall":
		_damage_hall(float(projectile["damage"]), projectile["from"])
		return
	if kind == &"tower":
		if not target.is_empty():
			_apply_hit(source, target, float(projectile["damage"]), &"tower")
		return
	if not target.is_empty():
		_apply_hit(source, target, float(projectile["damage"]), kind)
	var splash := float(projectile["splash"])
	if splash > 0.0:
		_splash(source, projectile["to"], float(projectile["damage"]) * 0.6, splash, int(projectile["target"]), kind)
	events.append({"type": &"impact", "pos": projectile["to"], "attack": kind})


func _splash(source: Dictionary, center: Vector2, damage: float, radius: float, skip_id: int, attack: StringName) -> void:
	var team := int(source["team"])
	for other: Dictionary in units.values().duplicate():
		if int(other["id"]) == skip_id or int(other["team"]) == team:
			continue
		if team == TEAM_PLAYER and int(other["team"]) != TEAM_ENEMY:
			continue
		if int(other["team"]) == TEAM_CIVILIAN and other["order"] == &"trapped":
			continue
		if (other["pos"] as Vector2).distance_to(center) <= radius:
			_apply_hit(source, other, damage, attack)


func _apply_hit(source: Dictionary, target: Dictionary, damage: float, attack: StringName) -> void:
	if float(target["hp"]) <= 0.0:
		return
	var amount := damage
	if int(target["team"]) == TEAM_PLAYER:
		amount *= 1.0 - _damage_reduction(target)
	target["hp"] = float(target["hp"]) - amount
	target["hit_flash"] = 0.16
	var data := Catalog.stats(source.get("kind", &""))
	var slow := float(data.get("slow", 0.0))
	if slow > 0.0 and attack in [&"ice", &"psi"]:
		target["slow"] = maxf(float(target["slow"]), slow) if float(target["slow_timer"]) > 0.0 else slow
		target["slow_timer"] = float(data.get("slow_time", 1.5))
	var knockback := float(data.get("knockback", 0.0))
	if knockback > 0.0 and attack in [&"stretch", &"psi"] and not bool(Catalog.stats(target["kind"]).get("boss", false)):
		_knockback(target, source.get("pos", target["pos"]), knockback)
	events.append({"type": &"hit", "pos": target["pos"], "amount": amount, "team": target["team"], "attack": attack, "id": target["id"]})
	if float(target["hp"]) <= 0.0:
		_on_unit_down(target, source)


func _damage_reduction(hero: Dictionary) -> float:
	var reduction := 0.0
	if float(hero["shield_timer"]) > 0.0:
		reduction = float(POWERS[&"frost"]["reduction"])
	var pos: Vector2 = hero["pos"]
	for ally: Dictionary in units.values():
		if float(ally["hp"]) <= 0.0 or int(ally["team"]) != TEAM_PLAYER or ally["kind"] != &"frost" or int(ally["id"]) == int(hero["id"]):
			continue
		if (ally["pos"] as Vector2).distance_to(pos) <= float(Catalog.stats(&"frost")["aura"]):
			reduction = maxf(reduction, 0.25)
			break
	return reduction


func _knockback(target: Dictionary, from: Vector2, amount: float) -> void:
	var pos: Vector2 = target["pos"]
	var direction := (pos - from)
	if direction.length() < 0.01:
		direction = Vector2(rng.randf_range(-1.0, 1.0), rng.randf_range(-1.0, 1.0))
	direction = direction.normalized()
	var destination := pos
	var steps := 6
	for index in steps:
		var candidate := pos + direction * amount * float(index + 1) / float(steps)
		if not is_walkable(Vector2i(candidate.floor())):
			break
		destination = candidate
	target["pos"] = destination
	target["path"] = PackedVector2Array()


func _on_unit_down(target: Dictionary, source: Dictionary) -> void:
	var team := int(target["team"])
	events.append({"type": &"death", "pos": target["pos"], "kind": target["kind"], "team": team, "bounty": int(Catalog.stats(target["kind"]).get("bounty", 0))})
	if team == TEAM_ENEMY:
		stats["defeated"] = int(stats["defeated"]) + 1
		var data := Catalog.stats(target["kind"])
		reputation += float(data.get("bounty", 0))
		_add_score(int(data.get("score", 10)))
		_reward_knockout(target, source)
		if int(target["wave"]) >= 0:
			wave_enemies_alive = maxi(0, wave_enemies_alive - 1)
			if wave_enemies_alive == 0 and not wave_spawning:
				_on_wave_cleared()
	elif team == TEAM_PLAYER:
		stats["heroes_lost"] = int(stats["heroes_lost"]) + 1
		var killers: Dictionary = stats.get("killers", {})
		var killer_kind := String(source.get("kind", &"hall"))
		killers[killer_kind] = int(killers.get(killer_kind, 0)) + 1
		stats["killers"] = killers
		battle_notice.emit(&"notice.hero_down", {"name": Catalog.stats(target["kind"])["name"]}, TEAM_PLAYER)
	elif team == TEAM_CIVILIAN:
		stats["civilians_lost"] = int(stats["civilians_lost"]) + 1
	var _unused := source


func _reward_knockout(target: Dictionary, source: Dictionary) -> void:
	var bounty := float(Catalog.stats(target["kind"]).get("bounty", 0))
	var xp := bounty * XP_PER_BOUNTY
	var killer: Dictionary = units.get(int(source.get("id", 0)), {})
	var killer_id := 0
	if not killer.is_empty() and int(killer["team"]) == TEAM_PLAYER:
		killer_id = int(killer["id"])
		_grant_xp(killer, xp)
	for hero: Dictionary in heroes():
		if int(hero["id"]) == killer_id or float(hero["hp"]) <= 0.0:
			continue
		if (hero["pos"] as Vector2).distance_to(target["pos"]) <= XP_SHARE_RADIUS:
			_grant_xp(hero, xp * 0.5)
	add_hype(HYPE_KO)
	if combo_timer > 0.0:
		combo += 1
	else:
		combo = 1
	combo_timer = COMBO_WINDOW
	if combo >= 2:
		_add_score(COMBO_SCORE * (combo - 1))
		add_hype(HYPE_COMBO)
		stats["best_combo"] = maxi(int(stats["best_combo"]), combo)
		events.append({"type": &"combo", "count": combo, "pos": target["pos"]})


## Heroes' damage multiplier from tweaks, Pep Rally, Spirit Surge and Varsity level.
func hero_damage_multiplier(hero: Dictionary) -> float:
	var multiplier := float(tweak_value(&"player.attack.damage_multiplier", 1.0))
	if rally_timer > 0.0:
		multiplier *= 1.0 + RALLY_DAMAGE_BONUS
	if surge_timer > 0.0:
		multiplier *= 1.0 + SURGE_DAMAGE_BONUS
	return multiplier * level_damage_multiplier(hero)


# ---------------------------------------------------------------- telegraphed heavy attacks

func _try_heavy_attack(enemy: Dictionary) -> bool:
	if float(enemy["special_cooldown"]) > 0.0:
		return false
	var kind: StringName = enemy["kind"]
	var pos: Vector2 = enemy["pos"]
	if kind == &"brute":
		var foe := _find_target(enemy, float(Catalog.stats(kind)["range"]) + 1.1)
		if foe.is_empty() or int(foe["team"]) != TEAM_PLAYER:
			return false
		enemy["special_cooldown"] = float(BRUTE_SLAM["cooldown"])
		var center: Vector2 = pos.lerp(foe["pos"], 0.7)
		if ai.level >= 1:
			var reach := float(Catalog.stats(kind)["range"]) + 1.1
			var best_hits := 0
			for hero: Dictionary in heroes():
				if (hero["pos"] as Vector2).distance_to(pos) > reach:
					continue
				var candidate: Vector2 = pos.lerp(hero["pos"], 0.7)
				var hits := 0
				for other: Dictionary in heroes():
					if (other["pos"] as Vector2).distance_to(candidate) <= float(BRUTE_SLAM["radius"]):
						hits += 1
				if hits > best_hits:
					best_hits = hits
					center = candidate
		_add_telegraph(enemy, &"slam", center, float(BRUTE_SLAM["radius"]), float(BRUTE_SLAM["windup"]), float(BRUTE_SLAM["damage"]))
		return true
	if kind == &"mech":
		var nearby: Array[Dictionary] = []
		for hero: Dictionary in heroes():
			if (hero["pos"] as Vector2).distance_to(pos) <= float(MECH_ROCKETS["range"]):
				nearby.append(hero)
		if nearby.is_empty():
			return false
		enemy["special_cooldown"] = MECH_SPECIAL_COOLDOWN
		var use_stomp := int(enemy["special_toggle"]) % 2 == 0
		var closest := INF
		for hero: Dictionary in nearby:
			closest = minf(closest, (hero["pos"] as Vector2).distance_to(pos))
		if closest > float(MECH_STOMP["radius"]) + 0.6:
			use_stomp = false
		elif ai.level >= 2:
			var in_stomp := 0
			for hero: Dictionary in nearby:
				if (hero["pos"] as Vector2).distance_to(pos) <= float(MECH_STOMP["radius"]) + 0.3:
					in_stomp += 1
			use_stomp = in_stomp >= 2 or (in_stomp == 1 and use_stomp)
		enemy["special_toggle"] = int(enemy["special_toggle"]) + 1
		if use_stomp:
			_add_telegraph(enemy, &"stomp", pos, float(MECH_STOMP["radius"]), float(MECH_STOMP["windup"]), float(MECH_STOMP["damage"]))
		else:
			for index in range(nearby.size() - 1, 0, -1):
				var swap_index := rng.randi_range(0, index)
				var hero := nearby[index]
				nearby[index] = nearby[swap_index]
				nearby[swap_index] = hero
			for index in mini(int(MECH_ROCKETS["count"]), maxi(nearby.size(), 1) + 1):
				var aim: Vector2 = (nearby[index % nearby.size()]["pos"] as Vector2)
				if ai.level >= 3 and index < nearby.size():
					var lead := float(MECH_ROCKETS["windup"]) + 0.15 * float(index)
					aim = _free_near(aim + (nearby[index]["vel"] as Vector2) * lead * 0.8)
				if index >= nearby.size():
					aim += Vector2(rng.randf_range(-1.5, 1.5), rng.randf_range(-1.5, 1.5))
				_add_telegraph(enemy, &"rocket", aim, float(MECH_ROCKETS["radius"]), float(MECH_ROCKETS["windup"]) + 0.15 * float(index), float(MECH_ROCKETS["damage"]))
		return true
	return false


func _add_telegraph(source: Dictionary, kind: StringName, center: Vector2, radius: float, windup: float, damage: float) -> void:
	var telegraph := {
		"id": _next_telegraph, "kind": kind, "pos": center, "radius": radius, "timer": windup, "total": windup,
		"damage": damage, "source": source["id"], "source_kind": source["kind"], "from": source["pos"],
	}
	_next_telegraph += 1
	telegraphs.append(telegraph)
	source["winding"] = maxf(float(source["winding"]), windup if kind != &"rocket" else 0.6)
	source["attack_anim"] = 0.5
	source["facing"] = signf(IsoProjection.project(center - source["pos"]).x + 0.001)
	source["path"] = PackedVector2Array()
	events.append({"type": &"telegraph", "kind": kind, "pos": center, "radius": radius, "from": source["pos"], "windup": windup})


func _update_telegraphs(dt: float) -> void:
	if telegraphs.is_empty():
		return
	var remaining: Array[Dictionary] = []
	for telegraph: Dictionary in telegraphs:
		telegraph["timer"] = float(telegraph["timer"]) - dt
		if float(telegraph["timer"]) > 0.0:
			remaining.append(telegraph)
			continue
		var source: Dictionary = units.get(int(telegraph["source"]), {})
		if source.is_empty():
			source = {"id": 0, "team": TEAM_ENEMY, "kind": telegraph["source_kind"], "pos": telegraph["from"]}
		var center: Vector2 = telegraph["pos"]
		var radius := float(telegraph["radius"])
		var hits := 0
		for other: Dictionary in units.values().duplicate():
			if int(other["team"]) != TEAM_PLAYER:
				continue
			if (other["pos"] as Vector2).distance_to(center) <= radius + float(Catalog.stats(other["kind"]).get("radius", 0.3)) * 0.5:
				_apply_hit(source, other, float(telegraph["damage"]), telegraph["kind"])
				hits += 1
				if units.has(int(other["id"])) and telegraph["kind"] != &"rocket":
					_knockback(other, center, 0.8)
		events.append({"type": &"telegraph_hit", "kind": telegraph["kind"], "pos": center, "radius": radius, "hits": hits})
	telegraphs = remaining


func _on_wave_cleared() -> void:
	_add_score(Catalog.WAVE_CLEAR_SCORE)
	events.append({"type": &"wave_cleared", "index": wave_index})
	if wave_index + 1 < Catalog.WAVES.size():
		battle_notice.emit(&"notice.wave_cleared", {"wave": wave_index + 1}, TEAM_PLAYER)


func _remove_dead() -> void:
	for id: int in units.keys():
		if float(units[id]["hp"]) <= 0.0:
			units.erase(id)


func _add_score(points: int) -> void:
	score += maxi(1, roundi(float(points) * float(tweak_value(&"gameplay.score.multiplier", 1.0))))


# ---------------------------------------------------------------- powers

func _use_power(hero: Dictionary) -> bool:
	var kind: StringName = hero["kind"]
	var power: Dictionary = POWERS.get(kind, {})
	if power.is_empty():
		return false
	var pos: Vector2 = hero["pos"]
	var power_scale := hero_damage_multiplier(hero)
	match kind:
		&"monitor":
			hero["dash_timer"] = float(power["duration"])
			events.append({"type": &"power", "kind": kind, "pos": pos, "radius": 1.0})
		&"frost":
			for ally: Dictionary in heroes():
				if (ally["pos"] as Vector2).distance_to(pos) <= float(power["radius"]):
					ally["shield_timer"] = float(power["duration"])
			events.append({"type": &"power", "kind": kind, "pos": pos, "radius": float(power["radius"])})
		&"stretch":
			var center := pos
			for foe: Dictionary in enemies():
				if (foe["pos"] as Vector2).distance_to(center) <= float(power["radius"]):
					_apply_hit(hero, foe, float(power["damage"]) * power_scale, &"rubber")
					if units.has(int(foe["id"])) and not bool(Catalog.stats(foe["kind"]).get("boss", false)):
						_knockback(foe, center, float(power["knockback"]))
			events.append({"type": &"power", "kind": kind, "pos": center, "radius": float(power["radius"])})
		&"blaze", &"psi":
			var center := _power_target_point(hero, float(power["range"]))
			if center == Vector2.INF:
				return false
			for foe: Dictionary in enemies():
				if (foe["pos"] as Vector2).distance_to(center) > float(power["radius"]):
					continue
				if kind == &"blaze":
					_apply_hit(hero, foe, float(power["damage"]) * power_scale, &"fireball")
				else:
					var duration := float(power["duration"])
					if bool(Catalog.stats(foe["kind"]).get("boss", false)):
						duration *= 0.4
					foe["stun_timer"] = maxf(float(foe["stun_timer"]), duration)
					foe["hit_flash"] = 0.2
			events.append({"type": &"power", "kind": kind, "pos": center, "radius": float(power["radius"]), "from": pos})
		_:
			return false
	hero["power_cooldown"] = float(power["cooldown"])
	hero["attack_anim"] = 0.4
	stats["powers"] = int(stats["powers"]) + 1
	return true


func _power_target_point(hero: Dictionary, reach: float) -> Vector2:
	var pos: Vector2 = hero["pos"]
	var best := Vector2.INF
	var best_count := 0
	for foe: Dictionary in enemies():
		var foe_pos: Vector2 = foe["pos"]
		if foe_pos.distance_to(pos) > reach:
			continue
		var count := 0
		for other: Dictionary in enemies():
			if (other["pos"] as Vector2).distance_to(foe_pos) <= 2.0:
				count += 1
		if count > best_count:
			best_count = count
			best = foe_pos
	return best


# ---------------------------------------------------------------- buildings

func _update_main_hall(dt: float) -> void:
	var hall: Dictionary = buildings[&"main_hall"]
	hall["hit_flash"] = maxf(0.0, float(hall["hit_flash"]) - dt)
	_hall_attack_timer -= dt
	if _hall_attack_timer > 0.0:
		return
	var center := building_center(&"main_hall")
	var best: Dictionary = {}
	var best_distance := INF
	for foe: Dictionary in enemies():
		var distance := _distance_to_building(foe["pos"], hall)
		if distance <= float(Catalog.MAIN_HALL_ATTACK["range"]) and distance < best_distance:
			best_distance = distance
			best = foe
	if best.is_empty():
		return
	_hall_attack_timer = float(Catalog.MAIN_HALL_ATTACK["cooldown"])
	projectiles.append({
		"source": 0, "team": TEAM_PLAYER, "target": best["id"], "pos": center + Vector2(-0.6, -0.6),
		"from": center, "to": best["pos"], "damage": float(Catalog.MAIN_HALL_ATTACK["damage"]),
		"splash": 0.0, "kind": &"tower", "source_kind": &"",
	})


func _update_rooms(dt: float) -> void:
	for building: Dictionary in buildings.values():
		var id: StringName = building["id"]
		if id == &"main_hall":
			_heal_near(building, dt)
			continue
		building["alarm"] = maxf(0.0, float(building.get("alarm", 0.0)) - dt)
		var center := building_center(id)
		var hero_count := 0
		var enemy_count := 0
		for value: Dictionary in units.values():
			if float(value["hp"]) <= 0.0 or (value["pos"] as Vector2).distance_to(center) > Catalog.CAPTURE_RADIUS:
				continue
			if int(value["team"]) == TEAM_PLAYER:
				hero_count += 1
			elif int(value["team"]) == TEAM_ENEMY:
				enemy_count += 1
		var control := float(building["control"])
		building["contested"] = hero_count > 0 and enemy_count > 0
		if hero_count > 0 and enemy_count == 0 and control < 1.0:
			control = minf(1.0, control + dt * 2.0 / Catalog.CAPTURE_TIME * (1.0 + 0.2 * float(mini(hero_count, 4) - 1)))
		elif enemy_count > 0 and hero_count == 0 and control > -1.0:
			control = maxf(-1.0, control - dt * 2.0 / Catalog.RECAPTURE_TIME * (1.0 + 0.15 * float(mini(enemy_count, 4) - 1)))
		building["control"] = control
		if control >= 1.0 and int(building["owner"]) != TEAM_PLAYER:
			building["owner"] = TEAM_PLAYER
			stats["rooms"] = int(stats["rooms"]) + 1
			_add_score(Catalog.ROOM_SCORE)
			add_hype(HYPE_CAPTURE)
			events.append({"type": &"secured", "building": id, "pos": center})
			battle_notice.emit(&"notice.room_secured", {"room": Catalog.ROOMS[id]["name"], "hero": Catalog.stats(building["trains"])["name"]}, TEAM_PLAYER)
			state_changed.emit()
		elif control <= -1.0 and int(building["owner"]) == TEAM_PLAYER:
			building["owner"] = TEAM_ENEMY
			for kind: StringName in building["queue"]:
				reputation += float(Catalog.stats(kind)["cost"])
			(building["queue"] as Array).clear()
			building["train_timer"] = 0.0
			events.append({"type": &"lost", "building": id, "pos": center})
			battle_notice.emit(&"notice.room_lost", {"room": Catalog.ROOMS[id]["name"]}, TEAM_ENEMY)
			state_changed.emit()
		if int(building["owner"]) == TEAM_PLAYER:
			_heal_near(building, dt)
		elif ai.level >= 1 and enemy_count > 0 and hero_count == 0:
			_heal_invaders(building, center, dt)


## Quiet Grimsby-held rooms patch up invaders inside them.
func _heal_invaders(building: Dictionary, center: Vector2, dt: float) -> void:
	var healed := false
	for foe: Dictionary in enemies():
		if float(foe["hp"]) >= float(foe["max_hp"]) or bool(Catalog.stats(foe["kind"]).get("boss", false)):
			continue
		if (foe["pos"] as Vector2).distance_to(center) > Catalog.CAPTURE_RADIUS:
			continue
		foe["hp"] = minf(float(foe["max_hp"]), float(foe["hp"]) + maxf(ENEMY_ROOM_HEAL, float(foe["max_hp"]) * 0.03) * dt)
		healed = true
	building["heal_fx"] = float(building.get("heal_fx", 0.0)) - dt
	if healed and float(building["heal_fx"]) <= 0.0:
		building["heal_fx"] = 1.2
		events.append({"type": &"enemy_heal", "pos": center, "building": building["id"]})


func _heal_near(building: Dictionary, dt: float) -> void:
	for hero: Dictionary in heroes():
		if float(hero["hp"]) >= float(hero["max_hp"]):
			continue
		if _distance_to_building(hero["pos"], building) <= Catalog.HEAL_RADIUS - 1.2:
			hero["hp"] = minf(float(hero["max_hp"]), float(hero["hp"]) + Catalog.HEAL_PER_SECOND * dt)


func _update_training(dt: float) -> void:
	for building: Dictionary in buildings.values():
		var queue: Array = building["queue"]
		if queue.is_empty() or int(building["owner"]) != TEAM_PLAYER:
			continue
		building["train_timer"] = float(building["train_timer"]) - dt
		if float(building["train_timer"]) > 0.0:
			continue
		var kind: StringName = queue.pop_front()
		var rally: Vector2 = building["rally"]
		var exit_point := _approach_point(building, rally)
		var hero := spawn_unit(kind, exit_point)
		hero["order"] = &"move"
		hero["home"] = rally
		hero["order_point"] = rally
		_set_path(hero, rally)
		events.append({"type": &"trained", "pos": exit_point, "kind": kind, "building": building["id"]})
		battle_notice.emit(&"notice.hero_ready", {"name": Catalog.stats(kind)["name"]}, TEAM_PLAYER)
		if not queue.is_empty():
			tweak_boundary_reached.emit(&"NEXT_ACTION")
			building["train_timer"] = _train_time(queue[0])
		state_changed.emit()


func training_progress(building_id: StringName) -> float:
	var building: Dictionary = buildings.get(building_id, {})
	if building.is_empty() or (building["queue"] as Array).is_empty():
		return 0.0
	var total := _train_time((building["queue"] as Array)[0])
	return clampf(1.0 - float(building["train_timer"]) / maxf(total, 0.01), 0.0, 1.0)


func _check_outcome() -> void:
	if float(buildings[&"main_hall"]["hp"]) <= 0.0:
		result = &"defeat"
		events.append({"type": &"hall_destroyed", "pos": building_center(&"main_hall")})
		match_ended.emit(result)
		return
	if wave_index == Catalog.WAVES.size() - 1 and not wave_spawning and wave_enemies_alive == 0:
		result = &"victory"
		_add_score(int(round(float(buildings[&"main_hall"]["hp"]) / 4.0)))
		stars = int(compute_stars()["total"])
		_add_score(200 * stars)
		match_ended.emit(result)


# ---------------------------------------------------------------- movement

func _set_path(value: Dictionary, destination: Vector2) -> void:
	var start := _nearest_walkable_cell(Vector2i((value["pos"] as Vector2).floor()))
	var goal := _nearest_walkable_cell(Vector2i(destination.floor()))
	var cells := _astar.get_id_path(start, goal, true)
	var path := PackedVector2Array()
	for index in range(1, cells.size()):
		path.append(Vector2(cells[index]) + Vector2(0.5, 0.5))
	if is_walkable(Vector2i(destination.floor())):
		if path.is_empty():
			path.append(destination)
		else:
			path[path.size() - 1] = destination
	value["path"] = _smooth_path(value["pos"], path)
	value["path_index"] = 0


func _smooth_path(origin: Vector2, path: PackedVector2Array) -> PackedVector2Array:
	if path.size() < 3:
		return path
	var result_path := PackedVector2Array()
	var anchor := origin
	var index := 0
	while index < path.size():
		var furthest := index
		for probe in range(index, mini(path.size(), index + 8)):
			if _line_clear(anchor, path[probe]):
				furthest = probe
		result_path.append(path[furthest])
		anchor = path[furthest]
		index = furthest + 1
	return result_path


func _line_clear(from: Vector2, to: Vector2) -> bool:
	var distance := from.distance_to(to)
	var samples := maxi(2, int(ceil(distance / 0.25)))
	for sample in samples + 1:
		var point := from.lerp(to, float(sample) / float(samples))
		for offset: Vector2 in [Vector2(0.22, 0.0), Vector2(-0.22, 0.0), Vector2(0.0, 0.22), Vector2(0.0, -0.22)]:
			if not is_walkable(Vector2i((point + offset).floor())):
				return false
	return true


## Returns true when the path is exhausted.
func _follow_path(value: Dictionary, dt: float) -> bool:
	var path: PackedVector2Array = value["path"]
	var index := int(value["path_index"])
	if index >= path.size():
		return true
	var speed := float(value["speed"])
	if float(value["slow_timer"]) > 0.0:
		speed *= 1.0 - float(value["slow"])
	if float(value["dash_timer"]) > 0.0:
		speed *= 1.75
	if surge_timer > 0.0 and int(value["team"]) == TEAM_PLAYER:
		speed *= 1.0 + SURGE_SPEED_BONUS
	var pos: Vector2 = value["pos"]
	var start := pos
	var remaining := speed * dt
	while remaining > 0.0 and index < path.size():
		var waypoint := path[index]
		var to_waypoint := waypoint - pos
		var distance := to_waypoint.length()
		if distance <= maxf(remaining, ARRIVE_EPSILON):
			pos = waypoint if distance <= remaining else pos + to_waypoint.normalized() * remaining
			remaining -= distance
			index += 1
		else:
			pos += to_waypoint / distance * remaining
			remaining = 0.0
		var screen_dx := IsoProjection.project(to_waypoint).x
		if absf(screen_dx) > 0.5:
			value["facing"] = signf(screen_dx)
	value["pos"] = pos
	value["path_index"] = index
	value["moving"] = true
	value["vel"] = (pos - start) / maxf(dt, 0.0001)
	return index >= path.size()


func _separate_units(dt: float) -> void:
	var buckets: Dictionary = {}
	for value: Dictionary in units.values():
		if float(value["hp"]) <= 0.0:
			continue
		var key := Vector2i((value["pos"] as Vector2).floor())
		if not buckets.has(key):
			buckets[key] = []
		(buckets[key] as Array).append(value)
	for value: Dictionary in units.values():
		if float(value["hp"]) <= 0.0 or value["order"] == &"trapped":
			continue
		var pos: Vector2 = value["pos"]
		var radius := float(Catalog.stats(value["kind"]).get("radius", 0.3))
		var push := Vector2.ZERO
		var key := Vector2i(pos.floor())
		for x in range(-1, 2):
			for y in range(-1, 2):
				var bucket: Array = buckets.get(key + Vector2i(x, y), [])
				for other: Dictionary in bucket:
					if int(other["id"]) == int(value["id"]):
						continue
					var other_radius := float(Catalog.stats(other["kind"]).get("radius", 0.3))
					var minimum := maxf(SEPARATION_DISTANCE, radius + other_radius)
					var delta: Vector2 = pos - (other["pos"] as Vector2)
					var distance := delta.length()
					if distance >= minimum:
						continue
					if distance < 0.001:
						delta = Vector2(0.01 * float(int(value["id"]) % 7 - 3), 0.01)
						distance = delta.length()
					var weight := 1.0
					if int(other["team"]) != int(value["team"]):
						weight = 0.6
					push += delta / distance * (minimum - distance) * weight
		if push == Vector2.ZERO:
			continue
		var moved := pos + push.limit_length(2.4 * dt * 3.0) * 0.5
		if is_walkable(Vector2i(moved.floor())):
			value["pos"] = moved
		else:
			var slide_x := Vector2(moved.x, pos.y)
			var slide_y := Vector2(pos.x, moved.y)
			if is_walkable(Vector2i(slide_x.floor())):
				value["pos"] = slide_x
			elif is_walkable(Vector2i(slide_y.floor())):
				value["pos"] = slide_y


func _nearest_walkable_cell(cell: Vector2i) -> Vector2i:
	var clamped := Vector2i(clampi(cell.x, 0, Map.SIZE.x - 1), clampi(cell.y, 0, Map.SIZE.y - 1))
	if is_walkable(clamped):
		return clamped
	for ring in range(1, 8):
		var best := Vector2i(-1, -1)
		var best_distance := INF
		for x in range(-ring, ring + 1):
			for y in range(-ring, ring + 1):
				if maxi(absi(x), absi(y)) != ring:
					continue
				var candidate := clamped + Vector2i(x, y)
				if is_walkable(candidate):
					var distance := Vector2(candidate - cell).length()
					if distance < best_distance:
						best_distance = distance
						best = candidate
		if best.x >= 0:
			return best
	return clamped


func _free_near(point: Vector2) -> Vector2:
	var cell := Vector2i(point.floor())
	if is_walkable(cell):
		return Vector2(clampf(point.x, 0.3, Map.SIZE.x - 0.3), clampf(point.y, 0.3, Map.SIZE.y - 0.3))
	return Vector2(_nearest_walkable_cell(cell)) + Vector2(0.5, 0.5)


func _approach_point(building: Dictionary, from: Vector2) -> Vector2:
	var rect := Rect2(Vector2(building["origin"]), Vector2(building["footprint"]))
	var closest := Vector2(clampf(from.x, rect.position.x, rect.end.x), clampf(from.y, rect.position.y, rect.end.y))
	var outward := from - closest
	if outward.length() < 0.01:
		outward = from - rect.get_center()
	return _free_near(closest + outward.normalized() * 0.7)


func _distance_to_building(point: Vector2, building: Dictionary) -> float:
	var rect := Rect2(Vector2(building["origin"]), Vector2(building["footprint"]))
	var closest := Vector2(clampf(point.x, rect.position.x, rect.end.x), clampf(point.y, rect.position.y, rect.end.y))
	return point.distance_to(closest)


func drain_events() -> Array[Dictionary]:
	var drained := events
	events = []
	return drained
