class_name ResultsScreen
extends Control
## Yearbook results spread: star rating + match stats (left page) and the local
## Hall of Fame table with name entry (right page). Also used standalone from the title.

signal play_again
signal change_difficulty
signal to_title
signal ui_cue(cue: StringName)
signal star_earned(index: int)

const T := preload("res://scripts/ui/hero_theme.gd")
const Loc := preload("res://scripts/services/localization.gd")
const STAR := preload("res://assets/template/game/fx/star.png")
const STICKER_BURST := preload("res://assets/template/game/fx/sticker_burst.png")
const HERO_ORDER: Array[StringName] = [&"blaze", &"frost", &"psi", &"stretch", &"monitor"]
const DIFFICULTIES: Array[StringName] = [&"rookie", &"varsity", &"legend"]
const INK := Color("1c1320")
const INK_SOFT := Color("4a3b44")
const HIGHLIGHT := Color(1.0, 0.86, 0.3, 0.55)

var store: HighScoreStore
var reduced_motion := false
var fx: FxLayer

var _dim: ColorRect
var _book: HBoxContainer
var _left: PanelContainer
var _right: PanelContainer
var _title: Label
var _subtitle: Label
var _stars: Array[TextureRect] = []
var _stat_grid: GridContainer
var _strip: VBoxContainer
var _table_title: Label
var _tabs: HBoxContainer
var _tab_buttons: Dictionary = {}
var _table: GridContainer
var _entry_row: PanelContainer
var _name_edit: LineEdit
var _sign_button: Button
var _note: Label
var _record_sticker: TextureRect
var _buttons: HBoxContainer
var _again_button: Button
var _table_difficulty: StringName = &"varsity"
var _pending: Dictionary = {}
var _pending_difficulty: StringName = &""
var _highlight_rank := -1
var _table_only := false


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	_dim = ColorRect.new()
	_dim.color = Color(0.05, 0.02, 0.06, 0.78)
	_dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(_dim)
	_book = HBoxContainer.new()
	_book.name = "Yearbook"
	_book.add_theme_constant_override("separation", 0)
	add_child(_book)
	_build_left()
	_build_right()
	fx = FxLayer.new()
	fx.screen_space = true
	add_child(fx)
	_record_sticker = TextureRect.new()
	_record_sticker.texture = STICKER_BURST
	_record_sticker.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	_record_sticker.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	_record_sticker.size = Vector2(150, 110)
	_record_sticker.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_record_sticker.visible = false
	add_child(_record_sticker)
	var record_label := T.display(Loc.t(&"hof.new_record"), 20, T.MAROON, 4)
	record_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	record_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	record_label.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	record_label.rotation = -0.15
	_record_sticker.add_child(record_label)
	resized.connect(_layout)
	visible = false


func _page_style() -> StyleBoxTexture:
	return T.paper_style(Vector2(34, 26))


func _build_left() -> void:
	_left = PanelContainer.new()
	_left.name = "LeftPage"
	_left.add_theme_stylebox_override("panel", _page_style())
	_book.add_child(_left)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 16)
	_left.add_child(row)
	var box := VBoxContainer.new()
	box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	box.add_theme_constant_override("separation", 6)
	row.add_child(box)
	_title = T.label("", 50, T.MAROON, "display")
	_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(_title)
	_subtitle = T.ink("", 14, INK_SOFT, "bold")
	_subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_subtitle.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_subtitle.custom_minimum_size.x = 360
	box.add_child(_subtitle)
	var star_row := HBoxContainer.new()
	star_row.alignment = BoxContainer.ALIGNMENT_CENTER
	star_row.add_theme_constant_override("separation", 10)
	box.add_child(star_row)
	for index in 3:
		var star := TextureRect.new()
		star.texture = STAR
		star.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		star.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		star.custom_minimum_size = Vector2(76, 76) if index != 1 else Vector2(92, 92)
		star.size_flags_vertical = Control.SIZE_SHRINK_END
		star.mouse_filter = Control.MOUSE_FILTER_IGNORE
		star_row.add_child(star)
		_stars.append(star)
	_stat_grid = GridContainer.new()
	_stat_grid.columns = 2
	_stat_grid.add_theme_constant_override("h_separation", 36)
	_stat_grid.add_theme_constant_override("v_separation", 3)
	_stat_grid.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	box.add_child(_stat_grid)
	_strip = VBoxContainer.new()
	_strip.add_theme_constant_override("separation", 4)
	row.add_child(_strip)
	for kind: StringName in HERO_ORDER:
		var frame := PanelContainer.new()
		var style := T.box(Color("2a1d26"), Color("2a1d26"), 2, 3, 3)
		style.content_margin_left = 4
		style.content_margin_right = 4
		style.content_margin_top = 3
		style.content_margin_bottom = 3
		frame.add_theme_stylebox_override("panel", style)
		frame.add_child(T.icon(HeroHud.PORTRAITS[kind], 70))
		_strip.add_child(frame)
	var caption := T.ink(Loc.t(&"result.strip"), 11, T.MAROON, "black")
	caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_strip.add_child(caption)


func _build_right() -> void:
	_right = PanelContainer.new()
	_right.name = "RightPage"
	_right.add_theme_stylebox_override("panel", _page_style())
	_book.add_child(_right)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 6)
	_right.add_child(box)
	_table_title = T.label(Loc.t(&"hof.title"), 42, T.MAROON, "display")
	_table_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	box.add_child(_table_title)
	_tabs = HBoxContainer.new()
	_tabs.alignment = BoxContainer.ALIGNMENT_CENTER
	_tabs.add_theme_constant_override("separation", 6)
	box.add_child(_tabs)
	for id: StringName in DIFFICULTIES:
		var tab := T.button(Loc.t(StringName("difficulty.%s" % id)), "", T.PAPER, 13)
		tab.custom_minimum_size = Vector2(110, 38)
		tab.focus_mode = Control.FOCUS_NONE
		tab.pressed.connect(func() -> void:
			ui_cue.emit(&"ui_click")
			_table_difficulty = id
			_refresh_table()
		)
		_tabs.add_child(tab)
		_tab_buttons[id] = tab
	_table = GridContainer.new()
	_table.columns = 5
	_table.add_theme_constant_override("h_separation", 14)
	_table.add_theme_constant_override("v_separation", 1)
	_table.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	_table.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(_table)
	_note = T.ink("", 12, INK_SOFT, "bold")
	_note.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_note.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_note.custom_minimum_size.x = 420
	box.add_child(_note)
	_entry_row = T.sticky(Vector2(16, 10))
	box.add_child(_entry_row)
	var entry := HBoxContainer.new()
	entry.add_theme_constant_override("separation", 8)
	_entry_row.add_child(entry)
	entry.add_child(T.ink(Loc.t(&"hof.enter_name"), 15, T.MAROON, "black"))
	_name_edit = LineEdit.new()
	_name_edit.max_length = HighScoreStore.NAME_LIMIT
	_name_edit.placeholder_text = Loc.t(&"hof.placeholder")
	_name_edit.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_name_edit.custom_minimum_size = Vector2(0, 42)
	_name_edit.add_theme_font_override("font", T.fonts()["black"])
	_name_edit.add_theme_font_size_override("font_size", 18)
	_name_edit.add_theme_color_override("font_color", INK)
	_name_edit.add_theme_stylebox_override("normal", T.box(Color(1, 1, 1, 0.85), INK, 2, 6, 0))
	_name_edit.add_theme_stylebox_override("focus", T.box(Color(1, 1, 1, 0.95), T.SKY, 3, 6, 0))
	_name_edit.text_submitted.connect(func(_text: String) -> void: _sign())
	_name_edit.text_changed.connect(func(_text: String) -> void: _refresh_table())
	entry.add_child(_name_edit)
	_sign_button = T.button(Loc.t(&"hof.sign"), Loc.t(&"hof.sign_tooltip"), T.MAROON, 16)
	_sign_button.custom_minimum_size = Vector2(170, 46)
	_sign_button.pressed.connect(_sign)
	entry.add_child(_sign_button)
	_buttons = HBoxContainer.new()
	_buttons.alignment = BoxContainer.ALIGNMENT_CENTER
	_buttons.add_theme_constant_override("separation", 10)
	box.add_child(_buttons)
	_again_button = T.button(Loc.t(&"result.again"), "", T.MAROON, 17)
	_again_button.custom_minimum_size = Vector2(170, 52)
	_again_button.pressed.connect(func() -> void:
		_auto_sign()
		play_again.emit()
	)
	_buttons.add_child(_again_button)
	var difficulty := T.button(Loc.t(&"result.difficulty_button"), "", T.GOLD, 15)
	difficulty.custom_minimum_size = Vector2(170, 52)
	difficulty.pressed.connect(func() -> void:
		_auto_sign()
		change_difficulty.emit()
	)
	_buttons.add_child(difficulty)
	var title_button := T.button(Loc.t(&"result.title"), "", T.PAPER, 15)
	title_button.custom_minimum_size = Vector2(130, 52)
	title_button.pressed.connect(func() -> void:
		_auto_sign()
		to_title.emit()
	)
	_buttons.add_child(title_button)
	for button: Button in [_again_button, difficulty, title_button, _sign_button]:
		button.mouse_entered.connect(func() -> void: ui_cue.emit(&"ui_hover"))


func _layout() -> void:
	if _book == null:
		return
	var page_w := minf(560.0, (size.x - 60.0) * 0.5)
	var page_h := minf(640.0, size.y - 40.0)
	_left.custom_minimum_size = Vector2(page_w, page_h)
	_right.custom_minimum_size = Vector2(page_w if not _table_only else minf(640.0, size.x - 60.0), page_h)
	_subtitle.custom_minimum_size.x = maxf(200.0, page_w - (190.0 if _strip.visible else 90.0))
	_note.custom_minimum_size.x = maxf(200.0, _right.custom_minimum_size.x - 90.0)
	_book.reset_size()
	_book.position = (size - _book.size) * 0.5
	var compact := page_h < 600.0
	_title.add_theme_font_size_override("font_size", 40 if compact else 50)
	for star: TextureRect in _stars:
		var big := star == _stars[1]
		star.custom_minimum_size = Vector2.ONE * ((74.0 if big else 60.0) if compact else (92.0 if big else 76.0))
	_strip.visible = page_w >= 500.0 and not _table_only


func _stat_row(label_key: StringName, value: String) -> void:
	_stat_grid.add_child(T.ink(Loc.t(label_key), 16, T.MAROON, "black"))
	var value_label := T.label(value, 22, INK, "display")
	value_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_stat_grid.add_child(value_label)


## Shows the yearbook spread after a match. `eligible` is false when preview tweaks were used.
func show_result(sim: RtsSimulation, difficulty: StringName, eligible: bool) -> void:
	_table_only = false
	_left.visible = true
	_buttons.visible = true
	_record_sticker.visible = false
	var victory := sim.result == &"victory"
	var star_info := sim.compute_stars()
	var star_total := int(star_info.get("total", 0))
	_title.text = Loc.t(&"result.victory") if victory else Loc.t(&"result.defeat")
	_title.add_theme_color_override("font_color", T.MAROON if victory else T.RED)
	_subtitle.text = Loc.t(&"result.victory_body") if victory else Loc.t(&"result.defeat_body")
	for child in _stat_grid.get_children():
		child.queue_free()
	var seconds := int(sim.elapsed)
	var waves := sim.total_waves() if victory else maxi(0, sim.wave_index if sim.wave_enemies_alive > 0 else sim.wave_index + 1)
	_stat_row(&"result.score_label", _thousands(sim.score))
	_stat_row(&"result.rescued", str(int(sim.stats["rescued"])))
	_stat_row(&"result.rooms", "%d/4" % sim.secured_rooms())
	_stat_row(&"result.defeated", str(int(sim.stats["defeated"])))
	_stat_row(&"result.best_combo", "x%d" % int(sim.stats.get("best_combo", 0)))
	_stat_row(&"result.waves", "%d/%d" % [waves, sim.total_waves()])
	_stat_row(&"result.time", "%d:%02d" % [seconds / 60, seconds % 60])
	_stat_row(&"result.difficulty", Loc.t(StringName("difficulty.%s" % difficulty)))
	_pending = {}
	_pending_difficulty = difficulty
	_highlight_rank = -1
	_table_difficulty = difficulty
	if eligible and store != null and store.qualifies(difficulty, sim.score):
		_pending = {"score": sim.score, "stars": star_total, "waves": waves, "time": sim.elapsed}
		_name_edit.text = store.last_name if store.last_name != "" else ""
		_note.text = Loc.t(&"hof.qualified")
	elif not eligible:
		_note.text = Loc.t(&"hof.not_eligible")
	else:
		_note.text = Loc.t(&"hof.not_qualified", {"best": _thousands(store.best(difficulty)) if store != null else "0"})
	_entry_row.visible = not _pending.is_empty()
	_refresh_table()
	visible = true
	_layout()
	_layout.call_deferred()
	_animate_open(star_total)
	if not _pending.is_empty():
		_name_edit.grab_focus.call_deferred()
	else:
		_again_button.grab_focus.call_deferred()


## Standalone Hall of Fame (from the title screen).
func show_table(difficulty: StringName) -> void:
	_table_only = true
	_left.visible = false
	_pending = {}
	_entry_row.visible = false
	_record_sticker.visible = false
	_highlight_rank = -1
	_table_difficulty = difficulty
	_note.text = Loc.t(&"hof.table_note")
	_buttons.visible = true
	_again_button.text = Loc.t(&"hof.play")
	_refresh_table()
	visible = true
	_layout()
	_layout.call_deferred()
	_animate_open(0)


func _animate_open(star_total: int) -> void:
	_again_button.text = Loc.t(&"hof.play") if _table_only else Loc.t(&"result.again")
	for index in _stars.size():
		_stars[index].modulate = Color(0.25, 0.2, 0.22, 0.35)
		_stars[index].scale = Vector2.ONE
	if reduced_motion:
		for index in star_total:
			_stars[index].modulate = Color.WHITE
		return
	_book.modulate.a = 0.0
	_book.pivot_offset = _book.size * 0.5
	_book.scale = Vector2.ONE * 0.92
	var tween := create_tween()
	tween.set_parallel(true)
	tween.tween_property(_book, "modulate:a", 1.0, 0.25)
	tween.tween_property(_book, "scale", Vector2.ONE, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.set_parallel(false)
	for index in star_total:
		tween.tween_interval(0.35)
		tween.tween_callback(_reveal_star.bind(index))


func _reveal_star(index: int) -> void:
	var star := _stars[index]
	star.modulate = Color.WHITE
	star.pivot_offset = star.size * 0.5
	star.scale = Vector2.ONE * 1.9
	var tween := star.create_tween()
	tween.tween_property(star, "scale", Vector2.ONE, 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	var center := get_global_transform_with_canvas().affine_inverse() * (star.get_global_transform_with_canvas() * (star.size * 0.5))
	fx.preset(&"confetti", center, 1.0)
	fx.preset(&"ui_pop", center, 1.8)
	star_earned.emit(index)


func _thousands(value: int) -> String:
	var text := str(absi(value))
	var out := ""
	while text.length() > 3:
		out = "," + text.substr(text.length() - 3) + out
		text = text.substr(0, text.length() - 3)
	return ("-" if value < 0 else "") + text + out


func _cell(text: String, size_value: int, color: Color, font_key: String, highlight: bool, align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_LEFT) -> Control:
	var panel := PanelContainer.new()
	var style := T.box(HIGHLIGHT if highlight else Color(0, 0, 0, 0), Color(0, 0, 0, 0), 0, 4, 0)
	style.content_margin_left = 6
	style.content_margin_right = 6
	style.content_margin_top = 1
	style.content_margin_bottom = 1
	panel.add_theme_stylebox_override("panel", style)
	var label := T.ink(text, size_value, color, font_key)
	label.horizontal_alignment = align
	panel.add_child(label)
	return panel


func _star_cell(count: int, highlight: bool) -> Control:
	var panel := _cell("", 1, INK, "bold", highlight)
	for child in panel.get_children():
		child.queue_free()
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 1)
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	panel.add_child(row)
	for index in 3:
		var star := T.icon(STAR, 18)
		star.modulate = Color.WHITE if index < count else Color(0.3, 0.25, 0.25, 0.3)
		row.add_child(star)
	return panel


func _refresh_table() -> void:
	for id: StringName in _tab_buttons:
		T.style_button(_tab_buttons[id], T.GOLD if id == _table_difficulty else T.PAPER)
	_table_title.text = Loc.t(&"hof.title")
	for child in _table.get_children():
		child.queue_free()
	for header: String in ["#", Loc.t(&"hof.name"), Loc.t(&"hof.score"), Loc.t(&"hof.stars"), Loc.t(&"hof.date")]:
		_table.add_child(_cell(header, 13, T.MAROON, "black", false))
	var rows: Array = store.table(_table_difficulty) if store != null else []
	var pending_rank := -1
	if not _pending.is_empty() and _pending_difficulty == _table_difficulty:
		pending_rank = rows.size()
		for index in rows.size():
			if int(_pending["score"]) > int(rows[index]["score"]):
				pending_rank = index
				break
		var preview := _pending.duplicate()
		preview["name"] = _name_edit.text if _name_edit.text.strip_edges() != "" else Loc.t(&"hof.you")
		preview["date"] = Time.get_date_string_from_system()
		rows.insert(pending_rank, preview)
		rows = rows.slice(0, HighScoreStore.MAX_ENTRIES)
	if rows.is_empty():
		for column in 5:
			_table.add_child(_cell("—" if column != 1 else Loc.t(&"hof.empty"), 14, INK_SOFT, "bold", false))
		return
	for index in rows.size():
		var row: Dictionary = rows[index]
		var highlight := index == pending_rank or (pending_rank < 0 and index == _highlight_rank and _table_difficulty == _pending_difficulty)
		var color := INK if index > 2 else T.MAROON
		_table.add_child(_cell(str(index + 1), 16, color, "display", highlight))
		_table.add_child(_cell(String(row.get("name", "HERO")), 15, INK, "black", highlight))
		_table.add_child(_cell(_thousands(int(row.get("score", 0))), 15, INK, "black", highlight, HORIZONTAL_ALIGNMENT_RIGHT))
		_table.add_child(_star_cell(int(row.get("stars", 0)), highlight))
		_table.add_child(_cell(String(row.get("date", "")), 12, INK_SOFT, "bold", highlight))


func _sign() -> void:
	if _pending.is_empty() or store == null:
		return
	var entry := _pending.duplicate()
	entry["name"] = _name_edit.text
	var rank := store.submit(_pending_difficulty, entry)
	_pending = {}
	_entry_row.visible = false
	_highlight_rank = rank
	_table_difficulty = _pending_difficulty
	_note.text = Loc.t(&"hof.signed", {"rank": rank + 1}) if rank >= 0 else Loc.t(&"hof.not_qualified", {"best": _thousands(store.best(_pending_difficulty))})
	_refresh_table()
	ui_cue.emit(&"ui_confirm")
	if rank >= 0:
		var center := get_global_transform_with_canvas().affine_inverse() * (_right.get_global_transform_with_canvas() * (_right.size * Vector2(0.5, 0.45)))
		fx.preset(&"confetti", center, 1.6)
		if rank == 0:
			_record_sticker.visible = true
			_record_sticker.position = _book.position + Vector2(_book.size.x - 150.0, _book.size.y * 0.55)
			_record_sticker.pivot_offset = _record_sticker.size * 0.5
			_record_sticker.scale = Vector2.ONE * 2.0
			var tween := _record_sticker.create_tween()
			tween.tween_property(_record_sticker, "scale", Vector2.ONE, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			ui_cue.emit(&"record")
	_again_button.grab_focus.call_deferred()


## Leaving the screen with a qualifying unsigned score signs it with the default name.
func _auto_sign() -> void:
	if not _pending.is_empty():
		_sign()


func _unhandled_input(event: InputEvent) -> void:
	if visible and _name_edit.has_focus() and event is InputEventKey:
		accept_event()
