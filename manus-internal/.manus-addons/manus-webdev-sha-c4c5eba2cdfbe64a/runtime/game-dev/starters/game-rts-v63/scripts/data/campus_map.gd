class_name CampusMap
extends RefCounted
## Maplecrest High campus layout. Cell (0, 0) is the top corner of the isometric
## diamond; the Main Hall sits near the bottom corner and Grimsby invaders enter
## from the parking lot (top), the sports field gate (left) and the loading dock (right).

const SIZE := Vector2i(36, 36)

const GRASS := 0
const PAVERS := 1
const ASPHALT := 2

const MAIN_HALL := {"id": &"main_hall", "origin": Vector2i(27, 27), "footprint": Vector2i(4, 4)}

## Capturable classrooms. `trains` names the hero class the secured room produces.
const CLASSROOMS: Array[Dictionary] = [
	{"id": &"gym", "origin": Vector2i(20, 23), "trains": &"stretch", "guards": [&"goon", &"goon", &"goon"]},
	{"id": &"chem_lab", "origin": Vector2i(7, 24), "trains": &"blaze", "guards": [&"goon", &"goon", &"blaster", &"blaster"]},
	{"id": &"cafeteria", "origin": Vector2i(24, 7), "trains": &"frost", "guards": [&"goon", &"goon", &"blaster", &"blaster", &"brute"]},
	{"id": &"library", "origin": Vector2i(15, 15), "trains": &"psi", "guards": [&"goon", &"goon", &"blaster", &"blaster", &"brute", &"brute"]},
]

## Invasion entry points (cell centers) keyed by lane.
const SPAWNS := {
	&"parking_lot": Vector2(2.5, 2.5),
	&"sports_field": Vector2(2.5, 33.5),
	&"loading_dock": Vector2(33.5, 2.5),
}

const HERO_START: Array[Vector2] = [
	Vector2(25.5, 32.0), Vector2(26.5, 33.0), Vector2(24.5, 31.0), Vector2(27.5, 34.0),
]

const TREES: Array[Dictionary] = [
	{"cell": Vector2i(10, 4), "kind": &"oak"}, {"cell": Vector2i(13, 8), "kind": &"maple"},
	{"cell": Vector2i(5, 12), "kind": &"maple"}, {"cell": Vector2i(3, 18), "kind": &"oak"},
	{"cell": Vector2i(9, 15), "kind": &"oak"}, {"cell": Vector2i(11, 21), "kind": &"maple"},
	{"cell": Vector2i(4, 23), "kind": &"oak"}, {"cell": Vector2i(14, 26), "kind": &"oak"},
	{"cell": Vector2i(17, 33), "kind": &"maple"}, {"cell": Vector2i(10, 34), "kind": &"oak"},
	{"cell": Vector2i(22, 34), "kind": &"oak"}, {"cell": Vector2i(34, 22), "kind": &"oak"},
	{"cell": Vector2i(34, 10), "kind": &"maple"}, {"cell": Vector2i(22, 4), "kind": &"oak"},
	{"cell": Vector2i(18, 11), "kind": &"maple"}, {"cell": Vector2i(26, 14), "kind": &"oak"},
	{"cell": Vector2i(21, 12), "kind": &"oak"}, {"cell": Vector2i(33, 17), "kind": &"maple"},
	{"cell": Vector2i(16, 4), "kind": &"maple"}, {"cell": Vector2i(4, 16), "kind": &"oak"},
	{"cell": Vector2i(24, 17), "kind": &"maple"}, {"cell": Vector2i(34, 26), "kind": &"maple"},
]

const STATUE := {"origin": Vector2i(23, 20), "footprint": Vector2i(2, 2)}

## Decorative campus props. `cells` are blocked for pathing; `at` is the sprite's ground anchor in cells.
const DECOR: Array[Dictionary] = [
	{"kind": &"bus", "cells": [Vector2i(5, 6), Vector2i(6, 6)], "at": Vector2(6.1, 6.6), "height": 150.0},
	{"kind": &"bleachers", "cells": [Vector2i(16, 27), Vector2i(16, 28)], "at": Vector2(16.6, 28.4), "height": 130.0},
	{"kind": &"lockers", "cells": [Vector2i(26, 21)], "at": Vector2(26.6, 21.7), "height": 120.0},
	{"kind": &"flagpole", "cells": [Vector2i(32, 26)], "at": Vector2(32.5, 26.6), "height": 190.0},
	{"kind": &"bench", "cells": [Vector2i(12, 20)], "at": Vector2(12.5, 20.6), "height": 70.0},
	{"kind": &"bench", "cells": [Vector2i(20, 9)], "at": Vector2(20.5, 9.6), "height": 70.0, "flip": true},
	{"kind": &"lockers", "cells": [Vector2i(9, 20)], "at": Vector2(9.6, 20.7), "height": 120.0, "flip": true},
]

## Painted football field (ground decal only, walkable) on the sports-field side of campus.
const FIELD := {"origin": Vector2(9.0, 27.5), "size": 6.5}


static func terrain_at(cell: Vector2i) -> int:
	var x := cell.x
	var y := cell.y
	# Parking lot and bus loop around the top gate.
	if x < 8 and y < 8:
		return ASPHALT
	# Walkways: central promenade, sports-field lane, loading-dock lane.
	if absi(x - y) <= 1 and x >= 6:
		return PAVERS
	if y >= 29 and y <= 30 and x >= 2:
		return PAVERS
	if x >= 29 and x <= 30 and y >= 2:
		return PAVERS
	# Library plaza.
	if maxi(absi(x - 16), absi(y - 16)) <= 3:
		return PAVERS
	# Forecourt around the Main Hall.
	if x >= 25 and y >= 25:
		return PAVERS
	# Sports-field and loading-dock gates.
	if x <= 3 and y >= 30:
		return ASPHALT
	if y <= 3 and x >= 30:
		return ASPHALT
	return GRASS


static func classroom(id: StringName) -> Dictionary:
	for room: Dictionary in CLASSROOMS:
		if room["id"] == id:
			return room
	return {}
