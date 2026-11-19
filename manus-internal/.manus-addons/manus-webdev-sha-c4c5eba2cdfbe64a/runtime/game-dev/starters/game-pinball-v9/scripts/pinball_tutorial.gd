extends RefCounted
## Steps react to actual inputs and contacts, with bounded fallback and durable completion.
const VERSION := 1
const STEPS := ["launch", "flip", "target", "pause"]
var active := false
var step := 0
var seconds := 0.0

func start(completed: bool) -> void:
	active = not completed
	step = 0
	seconds = 0.0

func event(kind: String) -> bool:
	if not active or kind != STEPS[step]: return false
	step += 1
	seconds = 0
	if step == STEPS.size(): active = false
	return true

func tick(dt: float) -> bool:
	if not active or not is_finite(dt) or dt <= 0: return false
	seconds += dt
	if seconds >= 25: return event(STEPS[step])
	return false

func skip() -> void:
	active = false
