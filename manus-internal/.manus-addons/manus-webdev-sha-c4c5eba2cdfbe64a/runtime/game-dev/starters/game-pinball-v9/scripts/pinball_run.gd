extends RefCounted
## Run and score authority. Finalization snapshots once; callers receive copies.
const EVENTS := ["bumper", "rollover", "bank", "sling", "skill", "multiplier", "flipper", "save"]
const MAX_SCORE := 999999999
var total := 0
var elapsed := 0.0
var stage_id := "observatory"
var configuration := ""
var eligible := true
var _result: Dictionary = {}

func reset(id: String, marker: String) -> void:
	total = 0
	elapsed = 0.0
	stage_id = id
	configuration = marker
	eligible = true
	_result.clear()

func award(kind: String, points: int) -> void:
	if _result.is_empty() and kind in EVENTS:
		total = clampi(total + clampi(points, 0, MAX_SCORE), 0, MAX_SCORE)

func tick(dt: float) -> void:
	if _result.is_empty() and is_finite(dt) and dt > 0:
		elapsed += dt

func finish(outcome: String) -> Dictionary:
	if _result.is_empty():
		_result = {"score": total, "stage": stage_id, "outcome": outcome, "duration": elapsed,
			"timestamp": int(Time.get_unix_time_from_system()), "configuration": configuration, "eligible": eligible}
	return _result.duplicate(true)

func result() -> Dictionary:
	return _result.duplicate(true)
