extends SceneTree
## Service-level acceptance; no gameplay scene or graphics assets are loaded.
const Run = preload("res://scripts/pinball_run.gd")
const Leaderboard = preload("res://scripts/pinball_leaderboard.gd")
const Stages = preload("res://scripts/pinball_stages.gd")
const Locale = preload("res://scripts/pinball_locale.gd")
const Tutorial = preload("res://scripts/pinball_tutorial.gd")
const Config = preload("res://scripts/template_config.gd")
var errors: Array[String] = []
var checks := 0
var directory := ""
var files: Array[String] = []
var font: Font

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	checks += 1
	if not ok:
		errors.append(message)
		push_error("[pinball-services] " + message)

func fixture(name: String, data: Variant) -> String:
	var path := directory.path_join(name)
	var file := FileAccess.open(path, FileAccess.WRITE)
	if file == null:
		check(false, "test fixture could not be opened: " + name)
		return path
	file.store_string(data if data is String else JSON.stringify(data))
	file.close()
	files.append(path)
	return path

func run() -> void:
	directory = "user://pinball-services-%d-%d" % [OS.get_process_id(), Time.get_ticks_usec()]
	check(DirAccess.make_dir_recursive_absolute(directory) == OK, "isolated test storage is writable")
	font = load("res://assets/template/fonts/ui_regular.tres") as Font
	check(font != null, "bundled composite font is available")
	_check_run()
	_check_leaderboard()
	_check_stages()
	_check_tutorial()
	_check_localization()
	for path in files:
		DirAccess.remove_absolute(path)
		if FileAccess.file_exists(path + ".tmp"): DirAccess.remove_absolute(path + ".tmp")
	DirAccess.remove_absolute(directory)
	if errors.is_empty():
		print("[pinball-services] PASS: %d checks; score authority, local persistence, names, stage extension, tutorial events, localization" % checks)
		quit(0)
	else:
		print("[pinball-services] FAIL: %d/%d checks: %s" % [errors.size(), checks, str(errors)])
		quit(1)

func _check_run() -> void:
	var session := Run.new()
	session.reset("observatory", "baseline")
	session.award("bumper", 150)
	session.award("not-an-event", 999)
	session.award("bank", -50)
	check(session.total == 150, "only known positive score events count")
	session.tick(2.5)
	for invalid in [-1.0, 0.0, INF, NAN]: session.tick(invalid)
	check(is_equal_approx(session.elapsed, 2.5), "duration ignores negative, zero and nonfinite deltas")
	session.award("skill", 9223372036854775807)
	check(session.total == Run.MAX_SCORE, "oversized score awards saturate without integer overflow")
	session.eligible = false
	var result := session.finish("victory")
	check(result.stage == "observatory" and result.configuration == "baseline" and not result.eligible, "result retains stage, configuration and integrity metadata")
	check(result.outcome == "victory" and result.timestamp > 0 and result.duration == 2.5, "final result has outcome, timestamp and duration")
	var frozen := result.duplicate(true)
	result.score = -100
	result.stage = "changed"
	session.award("bumper", 200)
	session.tick(9)
	session.eligible = true
	check(session.finish("defeat") == frozen and session.result() == frozen, "result finalizes once and returned copies cannot mutate it")
	session.reset("second-stage", "modified")
	check(session.total == 0 and session.elapsed == 0 and session.result().is_empty() and session.eligible, "retry resets all run-owned score state")
	check(session.stage_id == "second-stage" and session.configuration == "modified", "stage configuration is data-owned")

func row(name: String, score := 100, duration := 10.0, timestamp := 100, stage := "observatory") -> Dictionary:
	return {"name":name, "score":score, "duration":duration, "timestamp":timestamp,
		"stage":stage, "outcome":"victory", "configuration":"baseline", "eligible":true}

func _check_leaderboard() -> void:
	for data in ["{broken", "null", "[]", '{"version":2,"records":[]}', '{"version":1,"records":{}}']:
		var path := fixture("malformed-%d.json" % files.size(), data)
		check(Leaderboard.new(path).records.is_empty(), "malformed storage falls back to empty: " + data)
	var bad_negative := row("Negative"); bad_negative.score = -1
	var bad_outcome := row("Outcome"); bad_outcome.outcome = "unknown"
	var bad_missing := row("Missing"); bad_missing.erase("duration")
	var bad_name := row("[markup]")
	var path := fixture("mixed.json", {"version":1,"records":[null, [], {}, bad_negative, bad_outcome, bad_missing, bad_name, row("Valid")]})
	var mixed := Leaderboard.new(path)
	check(mixed.records.size() == 1 and mixed.records[0].name == "Valid", "invalid persisted rows and unsafe names are discarded while valid rows survive")
	var source := [row("Zed",100,10,100), row("Amy",100,10,100), row("Later",100,10,200), row("Slower",100,20,100), row("Winner",200,30,300)]
	var order_a := Leaderboard.new(fixture("ties-a.json", {"version":1,"records":source}))
	source.reverse()
	var order_b := Leaderboard.new(fixture("ties-b.json", {"version":1,"records":source}))
	check(order_a.records == order_b.records, "tie sorting is independent of insertion order")
	var names: Array = []
	for item in order_a.records: names.append(item.name)
	check(names == ["Winner","Amy","Zed","Later","Slower"], "rank orders score, faster duration, earlier timestamp, then name")
	var exact_ties := [row("Same",100,10,100,"stage-b"), row("Same",100,10,100,"stage-a")]
	var exact_a := Leaderboard.new(fixture("exact-a.json", {"version":1,"records":exact_ties}))
	exact_ties.reverse()
	var exact_b := Leaderboard.new(fixture("exact-b.json", {"version":1,"records":exact_ties}))
	check(exact_a.records == exact_b.records, "complete ties have a deterministic stage/configuration tiebreak")
	var storage := fixture("roundtrip.json", {"version":1,"records":[]})
	var board := Leaderboard.new(storage)
	for i in 13:
		check(board.add("Pilot%02d" % i, row("ignored",i*100)) == OK, "record saves atomically")
	check(board.records.size() == 10 and board.records[0].score == 1200 and board.records[9].score == 300, "top ten cap keeps the highest scores")
	check(Leaderboard.new(storage).records == JSON.parse_string(JSON.stringify(board.records)), "leaderboard survives a fresh service instance")
	var original := row("mutable",5000)
	check(board.add("Jun简体", original) == OK, "mixed English/Chinese name is saved")
	original.score = 0
	var reloaded := Leaderboard.new(storage)
	check(reloaded.records[0].name == "Jun简体" and reloaded.records[0].score == 5000, "mixed name persists and input result cannot mutate stored records")
	if font != null:
		for name in ["Jun", "简体中文", "Jun 简体", "A".repeat(20)]:
			check(board.valid_name(name,font), "supported name is accepted: " + name)
		for name in ["", " Jun", "Jun ", "A".repeat(21), "a\nb", "<tag>", "[tag]", "𠀀", "🙂"]:
			check(not board.valid_name(name,font), "unsupported or invalid name is rejected: " + name)
	check(board.add("[unsafe]", row("ignored")) == ERR_INVALID_DATA, "storage API rejects unsafe names independently of UI")
	var fail := Leaderboard.new(directory.path_join("missing-parent/records.json"))
	check(fail.add("Jun",row("ignored")) != OK and fail.records.is_empty(), "failed persistence does not leave a phantom in-memory record")

func _check_stages() -> void:
	var stages := Stages.new()
	check(stages.error.is_empty() and not stages.definitions.is_empty(), "authored stage registry validates")
	if stages.definitions.is_empty(): return
	var first: Dictionary = stages.definitions[0].duplicate(true)
	var second: Dictionary = first.duplicate(true)
	second.id = "service-test-stage-2"
	second.title_key = first.title_key
	second.jackpots = int(first.jackpots) + 1
	second.time_limit = minf(900.0, float(first.time_limit) + 60.0)
	var extended := Stages.new(fixture("stages-two.json", {"version":1,"stages":[first,second]}))
	check(extended.error.is_empty() and extended.definitions.size() == 2, "second stage registers by data without core-loop changes")
	check(extended.definitions[1].jackpots != extended.definitions[0].jackpots and extended.definitions[1].time_limit != extended.definitions[0].time_limit, "second stage has independent objective and pacing")
	check(not extended.configuration(1).is_empty() and extended.configuration(-1).is_empty() and extended.configuration(2).is_empty(), "stage lookup resolves registered config and guards invalid indices")
	var changed := extended.configuration(0)
	changed.gameplay.balls = 999
	check(extended.configuration(0).gameplay.balls != 999, "configuration lookups do not share mutable state")
	var duplicate := Stages.new(fixture("stages-duplicate.json", {"version":1,"stages":[first,first]}))
	check(duplicate.error == "stages.invalid" and duplicate.configuration(0).is_empty(), "duplicate IDs make the registry unusable with a localized diagnostic")
	for field in ["configuration", "jackpots", "time_limit"]:
		var invalid := first.duplicate(true)
		invalid[field] = "res://config/../outside.json" if field == "configuration" else 0
		var rejected := Stages.new(fixture("stages-invalid-"+field+".json", {"version":1,"stages":[invalid]}))
		check(rejected.error == "stages.invalid" and rejected.configuration(0).is_empty(), "bad stage " + field + " fails safely")
	check(Stages.new(fixture("stages-empty.json", {"version":1,"stages":[]})).error == "stages.invalid", "empty registry cannot start an unwinnable session")

func _check_tutorial() -> void:
	var tutorial := Tutorial.new()
	tutorial.start(true)
	check(not tutorial.active and not tutorial.event("launch"), "completed tutorial remains suppressed")
	tutorial.start(false)
	check(tutorial.active and tutorial.step == 0, "first run starts tutorial at launch")
	check(not tutorial.event("target") and tutorial.step == 0, "out-of-order gameplay events do not advance prompts")
	for kind in Tutorial.STEPS:
		check(tutorial.event(kind), "matching real event advances: " + kind)
	check(not tutorial.active and not tutorial.event("pause"), "last real event completes tutorial exactly once")
	tutorial.start(false)
	tutorial.event("launch")
	tutorial.skip()
	check(not tutorial.active and not tutorial.tick(100) and not tutorial.event("flip"), "Skip suppresses remaining callouts and timeouts")
	tutorial.start(false)
	check(tutorial.active and tutorial.step == 0 and tutorial.seconds == 0, "explicit replay resets transient tutorial state")
	for invalid in [-5.0, INF, NAN]: tutorial.tick(invalid)
	check(tutorial.step == 0 and tutorial.seconds == 0, "invalid time deltas cannot skip or stall tutorial")
	tutorial.start(false)
	check(not tutorial.tick(24.0) and tutorial.step == 0, "fallback waits for its timeout")
	check(tutorial.tick(1.0) and tutorial.step == 1 and tutorial.seconds == 0, "fallback advances a stranded prompt after 25 seconds")
	for i in 3: tutorial.tick(25.0)
	check(not tutorial.active, "timeouts eventually complete all remaining prompts")

func placeholders(value: String) -> Array:
	var tokens: Array = []
	var expression := RegEx.new()
	expression.compile("\\{[A-Za-z_][A-Za-z_0-9]*\\}|%(?:[0-9]*\\.)?[0-9]*[dfs]")
	for match in expression.search_all(value): tokens.append(match.get_string())
	tokens.sort()
	return tokens

func _check_localization() -> void:
	var locale := Locale.new()
	# First-launch language detection is independent of this machine's locale.
	for pair in [["zh_CN",true],["zh-Hans-CN",true],["zh_TW",true],["ZH",true],["en_US",false],["ja_JP",false],["",false]]:
		check(Locale.detect_zh(pair[0]) == pair[1], "locale detection maps " + str(pair[0]))
	var none := ConfigFile.new()
	check(Locale.resolve_zh(none, false, "zh_CN") and not Locale.resolve_zh(none, false, "en_GB"), "first launch follows the system/browser language")
	var legacy := ConfigFile.new()
	legacy.set_value("game", "best", 10)
	check(Locale.resolve_zh(legacy, true, "zh_CN"), "a save without a language choice still follows the system language")
	var chosen := ConfigFile.new()
	chosen.set_value("settings", "zh", false)
	check(not Locale.resolve_zh(chosen, true, "zh_CN"), "a saved English choice wins over a Chinese system locale")
	chosen.set_value("settings", "zh", true)
	check(Locale.resolve_zh(chosen, true, "en_US"), "a saved Chinese choice wins over an English system locale")
	var en: Dictionary = locale.dictionaries.en
	var zh: Dictionary = locale.dictionaries.zh_CN
	var en_keys := en.keys(); var zh_keys := zh.keys()
	en_keys.sort(); zh_keys.sort()
	check(not en.is_empty() and en_keys == zh_keys, "English and Simplified Chinese key sets match")
	var cfg := Config.current()
	if not cfg.is_empty(): locale.register_missions(cfg.missions)
	var missing_glyphs: Dictionary = {}
	for key in locale.dictionaries.en:
		var english: String = str(locale.dictionaries.en[key])
		var chinese: String = str(locale.dictionaries.zh_CN.get(key,""))
		check(placeholders(english) == placeholders(chinese), "locale placeholders match for " + str(key))
		if font != null:
			for text in [english,chinese]:
				for i in text.length():
					var cp: int = text.unicode_at(i)
					if cp >= 32 and not font.has_char(cp): missing_glyphs[cp] = text[i]
	check(missing_glyphs.is_empty(), "all localized runtime characters have bundled glyphs: " + str(missing_glyphs))
	check(locale.t("stage.timer",{"seconds":42},"en").contains("42") and not locale.t("stage.timer",{"seconds":42},"zh_CN").contains("{seconds}"), "named placeholders render in both locales")
	check(locale.t("screen.close",{},"unsupported-locale") == locale.t("screen.close",{},"en"), "unknown locale falls back to English")
	check(locale.t("unknown.key",{},"zh_CN") == "unknown.key", "unknown key fails visibly rather than throwing")
	var required: Array = ["error.configuration", "leaderboard.open", "leaderboard.title", "leaderboard.saved", "leaderboard.save", "leaderboard.empty", "leaderboard.row", "leaderboard.name", "leaderboard.name_help", "leaderboard.invalid_name", "leaderboard.save_error", "screen.restart", "screen.close", "confirm.restart", "confirm.title", "confirm.progress", "confirm.accept", "result.victory", "result.defeat", "result.completed", "result.retry", "stage.next", "stage.timer", "tutorial.skip"]
	for kind in Tutorial.STEPS:
		for input in ["keyboard","touch","gamepad"]: required.append("tutorial."+kind+"."+input)
	for stage in Stages.new().definitions: required.append(stage.title_key)
	var tuning: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://config/tuning.json"))
	for descriptor in tuning.get("settings", []):
		for field in ["label_key","description_key","unit_key"]: required.append(descriptor[field])
	var literals := RegEx.new(); literals.compile("\\bt\\(\"([^\"]+)\"\\s*[,\\)]")
	for source in ["res://scripts/comet_main.gd","res://scripts/comet_observatory.gd","res://scripts/pinball_template.gd"]:
		for match in literals.search_all(FileAccess.get_file_as_string(source)): required.append(match.get_string(1))
	for key in required:
		check(en.has(key) and zh.has(key) and (str(key).begins_with("unit.") or (not str(en.get(key,"")).is_empty() and not str(zh.get(key,"")).is_empty())), "reachable UI key is translated: " + str(key))
