class_name HighScoreStore
extends RefCounted
## Local top-10 high-score tables per difficulty, persisted as JSON in user://.
## Only rank-eligible runs (no preview tweaks) should be submitted by the caller.

const MAX_ENTRIES := 10
const NAME_LIMIT := 12
const DEFAULT_PATH := "user://high_scores.json"
const DIFFICULTIES: Array[StringName] = [&"rookie", &"varsity", &"legend"]

var _path := DEFAULT_PATH
var _tables: Dictionary = {}
var last_name := ""


func _init(path: String = DEFAULT_PATH) -> void:
	_path = path
	_load()


func table(difficulty: StringName) -> Array:
	return (_tables.get(String(difficulty), []) as Array).duplicate(true)


func best(difficulty: StringName) -> int:
	var entries := table(difficulty)
	return 0 if entries.is_empty() else int(entries[0]["score"])


func qualifies(difficulty: StringName, score: int) -> bool:
	if score <= 0:
		return false
	var entries := table(difficulty)
	return entries.size() < MAX_ENTRIES or score > int(entries[entries.size() - 1]["score"])


## Inserts an entry and returns its 0-based rank, or -1 when it did not make the table.
func submit(difficulty: StringName, entry: Dictionary) -> int:
	var score := int(entry.get("score", 0))
	if not qualifies(difficulty, score):
		return -1
	var clean_name := sanitize_name(String(entry.get("name", "")))
	var record := {
		"name": clean_name,
		"score": score,
		"stars": clampi(int(entry.get("stars", 0)), 0, 3),
		"waves": int(entry.get("waves", 0)),
		"time": float(entry.get("time", 0.0)),
		"date": String(entry.get("date", Time.get_date_string_from_system())),
	}
	var entries: Array = _tables.get(String(difficulty), [])
	var rank := entries.size()
	for index in entries.size():
		if score > int(entries[index]["score"]):
			rank = index
			break
	entries.insert(rank, record)
	while entries.size() > MAX_ENTRIES:
		entries.pop_back()
	_tables[String(difficulty)] = entries
	last_name = clean_name
	_save()
	return rank


func clear_all() -> void:
	_tables.clear()
	_save()


static func sanitize_name(raw: String) -> String:
	var cleaned := ""
	for character in raw.strip_edges():
		var code := character.unicode_at(0)
		if code >= 32 and code != 127:
			cleaned += character
	cleaned = cleaned.strip_edges().substr(0, NAME_LIMIT)
	return cleaned if cleaned != "" else "HERO"


func _load() -> void:
	_tables.clear()
	if not FileAccess.file_exists(_path):
		return
	var file := FileAccess.open(_path, FileAccess.READ)
	if file == null:
		return
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return
	var data: Dictionary = parsed
	last_name = String(data.get("last_name", ""))
	var tables: Variant = data.get("tables", {})
	if typeof(tables) != TYPE_DICTIONARY:
		return
	for key: String in (tables as Dictionary):
		var rows: Variant = tables[key]
		if typeof(rows) != TYPE_ARRAY:
			continue
		var clean: Array = []
		for row: Variant in rows:
			if typeof(row) == TYPE_DICTIONARY and (row as Dictionary).has("score"):
				clean.append(row)
		clean.sort_custom(func(a: Dictionary, b: Dictionary) -> bool: return int(a["score"]) > int(b["score"]))
		_tables[key] = clean.slice(0, MAX_ENTRIES)


func _save() -> void:
	var file := FileAccess.open(_path, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify({"version": 1, "last_name": last_name, "tables": _tables}))
