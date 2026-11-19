extends RefCounted
## Offline top ten; no network or global-ranking adapter.
const PATH := "user://pinball_records_v1.json"
const LIMIT := 10
var records: Array = []
var path := PATH

func _init(storage_path := PATH) -> void:
	path = storage_path
	if not FileAccess.file_exists(path): return
	var parser := JSON.new()
	if parser.parse(FileAccess.get_file_as_string(path)) != OK: return
	var data: Variant = parser.data
	if not data is Dictionary or data.get("version") != 1 or not data.get("records") is Array: return
	for row in data.records:
		if _valid(row): records.append(row.duplicate(true))
	_sort()

func valid_name(value: String, font: Font) -> bool:
	if value != value.strip_edges() or value.length() < 1 or value.length() > 20 or value.to_utf8_buffer().size() > 80: return false
	for i in value.length():
		var cp := value.unicode_at(i)
		if cp < 32 or cp == 127 or value[i] in ["<", ">", "[", "]"] or not font.has_char(cp): return false
	return true

func add(name: String, result: Dictionary) -> Error:
	var row := result.duplicate(true)
	row["name"] = name
	if not _valid(row): return ERR_INVALID_DATA
	var previous := records.duplicate(true)
	records.append(row)
	_sort()
	var file := FileAccess.open(path + ".tmp", FileAccess.WRITE)
	if file == null:
		records = previous
		return FileAccess.get_open_error()
	file.store_string(JSON.stringify({"version": 1, "records": records}))
	file.close()
	var error := DirAccess.rename_absolute(path + ".tmp", path)
	if error != OK: records = previous
	return error

func _valid(row: Variant) -> bool:
	if not row is Dictionary: return false
	for key in ["name", "stage", "outcome", "configuration"]:
		if not row.get(key) is String or row[key].is_empty(): return false
	if row.name.length() > 20 or row.name.to_utf8_buffer().size() > 80 or row.name != row.name.strip_edges(): return false
	for i in row.name.length():
		if row.name.unicode_at(i) < 32 or row.name.unicode_at(i) == 127 or row.name[i] in ["<", ">", "[", "]"]: return false
	if row.outcome not in ["victory", "defeat"] or not row.get("eligible") is bool: return false
	for key in ["score", "duration", "timestamp"]:
		if not (row.get(key) is float or row.get(key) is int) or not is_finite(float(row[key])) or row[key] < 0: return false
	return row.score <= 999999999

func _sort() -> void:
	records.sort_custom(func(a: Dictionary, b: Dictionary):
		if a.score != b.score: return a.score > b.score
		if a.duration != b.duration: return a.duration < b.duration
		if a.timestamp != b.timestamp: return a.timestamp < b.timestamp
		if a.name != b.name: return a.name < b.name
		for key in ["stage", "configuration", "outcome", "eligible"]:
			if str(a[key]) != str(b[key]): return str(a[key]) < str(b[key])
		return false)
	if records.size() > LIMIT: records.resize(LIMIT)
