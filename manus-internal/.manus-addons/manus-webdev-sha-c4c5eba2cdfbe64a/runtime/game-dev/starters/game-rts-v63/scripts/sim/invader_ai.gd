class_name InvaderAI
extends RefCounted
## Grimsby "Coach" brain for the invasion. It never cheats: it only reads the
## same board state the player sees and issues objectives to wave squads.
##
## Levels (set from difficulty):
##   0  legacy: every invader walks to the Main Hall or a random hero room.
##   1  Rookie: lane squads gather before pushing, objectives are scored by value
##      versus hero defense, guards raise alarms, Grimsby rooms patch invaders up.
##   2  Varsity: + focus fire, blaster kiting, pincer spreading across objectives,
##      smart boss stomps and wounded invaders limping back to heal.
##   3  Legend: + battered squads regroup, all-in rush when the Main Hall is low,
##      rockets lead moving heroes, faster re-planning.

const Catalog := preload("res://scripts/data/hero_catalog.gd")
const Map := preload("res://scripts/data/campus_map.gd")

const GATHER_TIME := 6.5
const GATHER_RADIUS := 3.4
const STAGE_DISTANCE := 5.5
const RETARGET_SECONDS := 3.0
const SWITCH_MARGIN := 0.3
const DEFENSE_RADIUS := 6.5
const REGROUP_STRENGTH := 0.4
const REGROUP_RECOVER := 0.75
const REGROUP_MAX_TIME := 14.0
const REGROUP_SEARCH := 15.0
const HALL_RUSH_RATIO := 0.35
const NOTICE_COOLDOWN := 10.0
const THINK_SECONDS := 0.5
const INTENT_SECONDS := 3.0
const LANE_NAMES := {
	&"parking_lot": "the Parking Lot",
	&"sports_field": "the Sports Field",
	&"loading_dock": "the Loading Dock",
}

var level := 2
var squads: Array[Dictionary] = []
var hall_rush := false

var _by_id: Dictionary = {}
var _next_squad := 1
var _think := 0.0
var _notice_timers: Dictionary = {}


func reset() -> void:
	squads.clear()
	_by_id.clear()
	_next_squad = 1
	_think = 0.0
	_notice_timers.clear()
	hall_rush = false


func think_multiplier() -> float:
	return 0.75 if level >= 3 else 1.0


func kite_cooldown() -> float:
	return 1.6 if level >= 3 else 2.4


func squad(id: int) -> Dictionary:
	return _by_id.get(id, {})


## Called when a wave starts: one squad per lane with a staging point a few
## cells inside the campus, pointing at the Main Hall.
func begin_wave(sim: RtsSimulation, lanes: Array) -> void:
	if level <= 0:
		return
	var hall := sim.building_center(&"main_hall")
	for lane: StringName in lanes:
		var spawn: Vector2 = Map.SPAWNS[lane]
		var stage := sim.free_point_near(spawn + (hall - spawn).normalized() * STAGE_DISTANCE)
		var entry := {
			"id": _next_squad, "lane": lane, "wave": sim.wave_index, "members": [] as Array[int],
			"state": &"gather", "objective": &"", "stage": stage, "timer": GATHER_TIME, "retarget": 0.0,
			"strength": 0.0, "peak": 0.0, "centroid": stage, "intent": 0.0, "regrouped": false, "score": -INF,
		}
		squads.append(entry)
		_by_id[_next_squad] = entry
		_next_squad += 1
	if not lanes.is_empty():
		_notice(sim, &"gather", &"notice.ai_gather", {"lane": LANE_NAMES.get(lanes[0], "the gates")}, true)
		sim.events.append({"type": &"squad_gather", "lanes": lanes})


func assign(enemy: Dictionary, lane: StringName, wave: int) -> void:
	if level <= 0:
		return
	for entry: Dictionary in squads:
		if entry["lane"] == lane and int(entry["wave"]) == wave:
			(entry["members"] as Array).append(int(enemy["id"]))
			enemy["squad"] = int(entry["id"])
			enemy["squad_state"] = entry["state"]
			enemy["stage_offset"] = Vector2(sin(float(enemy["anim_seed"])), cos(float(enemy["anim_seed"]))) * 1.4
			if entry["state"] != &"gather":
				enemy["objective"] = entry["objective"]
			return


func update(sim: RtsSimulation, dt: float) -> void:
	if level <= 0:
		return
	for key: StringName in _notice_timers.keys():
		_notice_timers[key] = maxf(0.0, float(_notice_timers[key]) - dt)
	for entry: Dictionary in squads:
		entry["intent"] = maxf(0.0, float(entry["intent"]) - dt)
	_think -= dt
	if _think > 0.0:
		return
	_think = THINK_SECONDS * think_multiplier()
	var step := THINK_SECONDS * think_multiplier()
	if level >= 3 and not hall_rush and sim.hall_ratio() < HALL_RUSH_RATIO and sim.wave_enemies_alive >= 4:
		hall_rush = true
		_notice(sim, &"rush", &"notice.ai_rush", {}, true)
		for entry: Dictionary in squads:
			if entry["state"] != &"gather":
				_set_objective(sim, entry, &"main_hall", &"attack")
	for building: Dictionary in sim.buildings.values():
		building["threat"] = 0
	var claimed: Dictionary = {}
	var alive: Array[Dictionary] = []
	for entry: Dictionary in squads:
		var living: Array[int] = []
		var hp := 0.0
		var max_hp := 0.0
		var centroid := Vector2.ZERO
		for id: int in entry["members"]:
			var member: Dictionary = sim.units.get(id, {})
			if member.is_empty() or float(member["hp"]) <= 0.0:
				continue
			living.append(id)
			hp += float(member["hp"])
			max_hp += float(member["max_hp"])
			centroid += member["pos"]
		entry["members"] = living
		var pending := sim.pending_spawns(entry["lane"]) if int(entry["wave"]) == sim.wave_index else 0
		if living.is_empty() and pending == 0:
			_by_id.erase(int(entry["id"]))
			continue
		alive.append(entry)
		if not living.is_empty():
			entry["centroid"] = centroid / float(living.size())
		entry["strength"] = hp
		entry["peak"] = maxf(float(entry["peak"]), hp)
		match entry["state"]:
			&"gather":
				entry["timer"] = float(entry["timer"]) - step
				var ready := pending == 0 and not living.is_empty()
				if ready:
					var stage: Vector2 = entry["stage"]
					for id: int in living:
						if (sim.units[id]["pos"] as Vector2).distance_to(stage) > GATHER_RADIUS:
							ready = false
							break
				if not living.is_empty() and (ready or float(entry["timer"]) <= 0.0):
					entry["state"] = &"advance"
					entry["centroid"] = centroid / float(living.size())
					sim.events.append({"type": &"squad_charge", "pos": entry["centroid"], "lane": entry["lane"], "count": living.size()})
					_retarget(sim, entry, claimed, true)
			&"advance":
				entry["retarget"] = float(entry["retarget"]) - step
				if level >= 3 and not hall_rush and _try_regroup(sim, entry):
					pass
				elif float(entry["retarget"]) <= 0.0 or not _objective_valid(sim, entry["objective"]):
					if not hall_rush:
						_retarget(sim, entry, claimed, not _objective_valid(sim, entry["objective"]))
			&"regroup":
				entry["timer"] = float(entry["timer"]) - step
				var room: StringName = entry["objective"]
				var lost: bool = not sim.buildings.has(room) or int(sim.buildings[room]["owner"]) != RtsSimulation.TEAM_ENEMY
				var healed := max_hp > 0.0 and hp / max_hp >= REGROUP_RECOVER
				if lost or healed or float(entry["timer"]) <= 0.0:
					entry["state"] = &"advance"
					_retarget(sim, entry, claimed, true)
		var objective: StringName = entry["objective"]
		if entry["state"] != &"gather" and objective != &"":
			claimed[objective] = int(claimed.get(objective, 0)) + 1
			if sim.buildings.has(objective):
				sim.buildings[objective]["threat"] = int(sim.buildings[objective].get("threat", 0)) + 1
		for id: int in living:
			var member: Dictionary = sim.units[id]
			member["squad_state"] = entry["state"]
			if entry["state"] != &"gather" and member.get("retreat_room", &"") == &"":
				member["objective"] = objective
	squads = alive


## Heroes' combined fighting weight near a point (HP scaled by level).
func _defense(sim: RtsSimulation, center: Vector2, radius: float) -> float:
	var total := 0.0
	for hero: Dictionary in sim.heroes():
		var distance := (hero["pos"] as Vector2).distance_to(center)
		if distance > radius:
			continue
		total += float(hero["hp"]) * (1.0 + 0.2 * float(int(hero.get("level", 1)) - 1)) * (1.0 - 0.4 * distance / radius)
	return total


func _objective_valid(sim: RtsSimulation, objective: StringName) -> bool:
	if objective == &"" or not sim.buildings.has(objective):
		return false
	if objective == &"main_hall":
		return true
	var building: Dictionary = sim.buildings[objective]
	if int(building["owner"]) == RtsSimulation.TEAM_PLAYER:
		return true
	# A Grimsby room only needs defending while heroes are taking it.
	return float(building["control"]) > -0.97 or bool(building.get("contested", false))


func _score(sim: RtsSimulation, objective: StringName, from: Vector2, strength: float, claimed: Dictionary) -> float:
	if not _objective_valid(sim, objective):
		return -INF
	var building: Dictionary = sim.buildings[objective]
	var center := sim.building_center(objective)
	var value := 1.0
	if objective == &"main_hall":
		value = 1.0 + (1.0 - sim.hall_ratio()) * 1.3
	elif int(building["owner"]) == RtsSimulation.TEAM_PLAYER:
		value = 0.95 + (0.35 if not (building["queue"] as Array).is_empty() else 0.0)
	else:
		value = 1.15 + (float(building["control"]) + 1.0) * 0.45
	var defense := _defense(sim, center, DEFENSE_RADIUS)
	var odds := (strength + 60.0) / (strength + defense + 60.0)
	var score := value * odds - from.distance_to(center) * 0.02
	if level >= 2:
		score *= pow(0.62 if level >= 3 else 0.78, float(int(claimed.get(objective, 0))))
	return score


func _retarget(sim: RtsSimulation, entry: Dictionary, claimed: Dictionary, force: bool) -> void:
	entry["retarget"] = RETARGET_SECONDS * think_multiplier()
	var from: Vector2 = entry["centroid"]
	var strength := float(entry["strength"])
	var best: StringName = &"main_hall"
	var best_score := -INF
	for id: StringName in sim.buildings:
		var score := _score(sim, id, from, strength, claimed)
		if score > best_score:
			best_score = score
			best = id
	var current: StringName = entry["objective"]
	if not force and current != &"" and current != best and _objective_valid(sim, current):
		var current_score := _score(sim, current, from, strength, claimed)
		if best_score < current_score + absf(current_score) * SWITCH_MARGIN:
			return
	if best == current and not force:
		return
	var mode := &"attack"
	if best != &"main_hall" and int(sim.buildings[best]["owner"]) == RtsSimulation.TEAM_ENEMY:
		mode = &"defend"
	_set_objective(sim, entry, best, mode)


func _set_objective(sim: RtsSimulation, entry: Dictionary, objective: StringName, mode: StringName) -> void:
	var changed: bool = entry["objective"] != objective
	entry["objective"] = objective
	for id: int in entry["members"]:
		var member: Dictionary = sim.units.get(id, {})
		if member.is_empty() or member.get("retreat_room", &"") != &"":
			continue
		member["objective"] = objective
		member["path"] = PackedVector2Array()
		member["repath"] = 0.0
	if not changed:
		return
	entry["intent"] = INTENT_SECONDS
	var center := sim.building_center(objective)
	sim.events.append({"type": &"squad_intent", "pos": center, "from": entry["centroid"], "objective": objective, "mode": mode, "squad": entry["id"]})
	if objective == &"main_hall" or mode == &"regroup":
		return
	var room_name: String = Catalog.ROOMS[objective]["name"]
	if mode == &"defend":
		_notice(sim, StringName("defend_%s" % objective), &"notice.ai_defend", {"room": room_name})
	else:
		_notice(sim, StringName("flank_%s" % objective), &"notice.ai_flank", {"room": room_name})


func _try_regroup(sim: RtsSimulation, entry: Dictionary) -> bool:
	if bool(entry["regrouped"]) or (entry["members"] as Array).size() < 2:
		return false
	if float(entry["strength"]) > float(entry["peak"]) * REGROUP_STRENGTH:
		return false
	var from: Vector2 = entry["centroid"]
	var best: StringName = &""
	var best_distance := REGROUP_SEARCH
	for id: StringName in sim.buildings:
		var building: Dictionary = sim.buildings[id]
		if id == &"main_hall" or int(building["owner"]) != RtsSimulation.TEAM_ENEMY:
			continue
		var center := sim.building_center(id)
		if _defense(sim, center, 4.5) > 0.0:
			continue
		var distance := from.distance_to(center)
		if distance < best_distance:
			best_distance = distance
			best = id
	if best == &"":
		return false
	entry["state"] = &"regroup"
	entry["regrouped"] = true
	entry["timer"] = REGROUP_MAX_TIME
	_set_objective(sim, entry, best, &"regroup")
	_notice(sim, &"regroup", &"notice.ai_regroup", {"room": Catalog.ROOMS[best]["name"]})
	return true


func _notice(sim: RtsSimulation, slot: StringName, key: StringName, params: Dictionary, force: bool = false) -> void:
	if not force and float(_notice_timers.get(slot, 0.0)) > 0.0:
		return
	if not force and float(_notice_timers.get(&"_any", 0.0)) > 0.0:
		return
	_notice_timers[slot] = NOTICE_COOLDOWN
	_notice_timers[&"_any"] = 3.5
	sim.battle_notice.emit(key, params, RtsSimulation.TEAM_ENEMY)
