class_name HeroCatalog
extends RefCounted
## Stable gameplay data for Maplecrest heroes, Grimsby invaders, rooms and waves.

const HERO_TEAM := 0
const ENEMY_TEAM := 1
const CIVILIAN_TEAM := 2

const UNITS := {
	&"monitor": {
		"name": "Hall Monitor", "team": HERO_TEAM, "hp": 115.0, "damage": 9.0, "range": 1.0,
		"cooldown": 0.8, "speed": 2.8, "cost": 50, "train": 5.0, "radius": 0.32, "acquire": 5.0,
		"role": "Fast rookie. Cheap, quick rescuer.", "attack": &"melee", "height": 62.0,
	},
	&"blaze": {
		"name": "Blaze", "team": HERO_TEAM, "hp": 80.0, "damage": 15.0, "range": 4.2,
		"cooldown": 1.5, "speed": 2.5, "cost": 90, "train": 7.0, "radius": 0.32, "acquire": 5.6,
		"splash": 1.35, "role": "Fire power. Ranged area burn.", "attack": &"fire", "height": 62.0,
	},
	&"frost": {
		"name": "Frost", "team": HERO_TEAM, "hp": 270.0, "damage": 8.0, "range": 1.1,
		"cooldown": 1.1, "speed": 2.25, "cost": 100, "train": 8.0, "radius": 0.36, "acquire": 5.0,
		"slow": 0.35, "slow_time": 2.0, "aura": 2.6, "role": "Ice shield. Tank that shields nearby allies.",
		"attack": &"ice", "height": 64.0,
	},
	&"psi": {
		"name": "Psi", "team": HERO_TEAM, "hp": 75.0, "damage": 11.0, "range": 5.0,
		"cooldown": 1.3, "speed": 2.5, "cost": 110, "train": 8.0, "radius": 0.32, "acquire": 6.2,
		"slow": 0.5, "slow_time": 1.6, "knockback": 0.45, "role": "Telekinesis. Long-range crowd control.",
		"attack": &"psi", "height": 62.0,
	},
	&"stretch": {
		"name": "Stretch", "team": HERO_TEAM, "hp": 175.0, "damage": 20.0, "range": 2.0,
		"cooldown": 1.25, "speed": 2.9, "cost": 100, "train": 7.0, "radius": 0.34, "acquire": 5.2,
		"knockback": 0.9, "role": "Rubber stretch. Long-reach knockback bruiser.", "attack": &"stretch", "height": 66.0,
	},
	&"goon": {
		"name": "Grimsby Goon", "team": ENEMY_TEAM, "hp": 70.0, "damage": 8.0, "range": 1.0,
		"cooldown": 1.0, "speed": 2.1, "bounty": 4, "radius": 0.32, "acquire": 4.5, "attack": &"melee",
		"height": 60.0, "score": 20,
	},
	&"blaster": {
		"name": "Grimsby Blaster", "team": ENEMY_TEAM, "hp": 55.0, "damage": 10.0, "range": 4.0,
		"cooldown": 1.6, "speed": 2.0, "bounty": 5, "radius": 0.30, "acquire": 5.0, "attack": &"blaster",
		"height": 62.0, "score": 25,
	},
	&"brute": {
		"name": "Grimsby Brute", "team": ENEMY_TEAM, "hp": 300.0, "damage": 22.0, "range": 1.2,
		"cooldown": 1.8, "speed": 1.55, "bounty": 12, "radius": 0.44, "acquire": 4.0, "building_bonus": 2.5,
		"attack": &"smash", "height": 84.0, "score": 60,
	},
	&"mech": {
		"name": "Mecha-Mascot", "team": ENEMY_TEAM, "hp": 1500.0, "damage": 30.0, "range": 2.3,
		"cooldown": 2.5, "speed": 1.2, "bounty": 80, "radius": 0.7, "acquire": 4.5, "building_bonus": 1.6,
		"splash": 1.25, "attack": &"smash", "height": 138.0, "score": 500, "boss": true,
	},
}

const HERO_ORDER: Array[StringName] = [&"monitor", &"blaze", &"frost", &"psi", &"stretch"]

const ROOMS := {
	&"main_hall": {"name": "Main Hall", "trains": &"monitor", "blurb": "The heart of Maplecrest High. If it falls, the school is captured."},
	&"gym": {"name": "Gymnasium", "trains": &"stretch", "blurb": "Trains Stretch, the rubber-limbed bruiser."},
	&"chem_lab": {"name": "Chemistry Lab", "trains": &"blaze", "blurb": "Trains Blaze, the fire-power striker."},
	&"cafeteria": {"name": "Cafeteria", "trains": &"frost", "blurb": "Trains Frost, the ice-shield defender."},
	&"library": {"name": "Library", "trains": &"psi", "blurb": "Trains Psi, the telekinetic controller."},
}

## Each wave lists enemy counts and the lanes they arrive through.
const WAVES: Array[Dictionary] = [
	{"goon": 5, "blaster": 0, "brute": 0, "mech": 0, "lanes": [&"parking_lot"]},
	{"goon": 6, "blaster": 2, "brute": 0, "mech": 0, "lanes": [&"parking_lot", &"sports_field"]},
	{"goon": 7, "blaster": 3, "brute": 1, "mech": 0, "lanes": [&"parking_lot", &"loading_dock"]},
	{"goon": 7, "blaster": 4, "brute": 2, "mech": 0, "lanes": [&"parking_lot", &"sports_field", &"loading_dock"]},
	{"goon": 8, "blaster": 4, "brute": 2, "mech": 1, "lanes": [&"parking_lot", &"sports_field", &"loading_dock"]},
	{"goon": 10, "blaster": 6, "brute": 3, "mech": 0, "lanes": [&"sports_field", &"loading_dock", &"parking_lot"]},
	{"goon": 12, "blaster": 7, "brute": 4, "mech": 0, "lanes": [&"parking_lot", &"sports_field", &"loading_dock"]},
	{"goon": 12, "blaster": 8, "brute": 4, "mech": 1, "lanes": [&"parking_lot", &"sports_field", &"loading_dock"]},
]

const MAIN_HALL_HP := 2200.0
const MAIN_HALL_ATTACK := {"damage": 11.0, "range": 5.0, "cooldown": 1.4}
const STARTING_REPUTATION := 160
const BASE_POP_CAP := 6
const POP_PER_ROOM := 3
const QUEUE_LIMIT := 5
const FIRST_WAVE_DELAY := 55.0
const WAVE_INTERVAL := 52.0
const CAPTURE_TIME := 6.0
const RECAPTURE_TIME := 7.0
const CAPTURE_RADIUS := 3.1
const HEAL_RADIUS := 3.3
const HEAL_PER_SECOND := 5.0
const RESCUE_REWARD := 20
const RESCUE_SCORE := 100
const WAVE_CLEAR_SCORE := 250
const ROOM_SCORE := 150
const CIVILIAN_KINDS: Array[StringName] = [&"student", &"girl", &"janitor"]


static func stats(kind: StringName) -> Dictionary:
	return UNITS.get(kind, {})


static func wave_size(index: int) -> int:
	if index < 0 or index >= WAVES.size():
		return 0
	var wave: Dictionary = WAVES[index]
	return int(wave["goon"]) + int(wave["blaster"]) + int(wave["brute"]) + int(wave["mech"])
