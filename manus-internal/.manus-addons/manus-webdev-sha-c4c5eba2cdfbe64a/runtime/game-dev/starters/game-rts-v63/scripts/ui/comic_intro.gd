class_name ComicIntro
extends Control
## Two-page comic intro: panels slam onto a book spread, captions type on, balloons pop from their tails,
## SFX stickers stamp in with shake and particles, and the page turns between acts.
## Click / tap / Space / Enter advances (first press completes a panel still animating), Esc or Skip ends it.

signal finished(skipped: bool)

const Loc := preload("res://scripts/services/localization.gd")
const T := preload("res://scripts/ui/hero_theme.gd")

const TYPE_SPEED := 55.0
const BEAT_GAP := 0.3
const SLAM_TIME := 0.32
const VOICE_WAIT_LIMIT := 9.0
const INK := Color("1c1320")
const PAGE_PAPER := Color("fbf3dc")
const PAGE_EDGE := Color("e6d6b0")
const BACKDROP := Color("6e1826")
const BACKDROP_DOT := Color("8e1b2e")
const CAPTION_FILL := Color("ffe07a")
const BALLOON_FILL := Color("ffffff")
const RADIO_FILL := Color("eaf6ff")

## Test / QA hooks.
var beats_shown := 0
var panel_index := -1
var page_index := -1

var audio: AudioDirector
var reduced_motion := false
var touch_mode := false

var _fonts: Dictionary = {}
var _backdrop: Control
var _stage: Control
var _book: Control
var _pages: Array[Control] = []
var _panels: Array[Dictionary] = []
var _fx: FxLayer
var _fx_top: FxLayer
var _skip: Button
var _prompt: Control
var _prompt_label: Label
var _dots: Control
var _cta: Button
var _playing := false
var _turning := false
var _page_turn_tween: Tween
var _panel_done := true
var _beats: Array = []
var _beat_cursor := 0
var _beat_timer := 0.0
var _voice_wait := 0.0
var _typing: Array[Dictionary] = []
var _shake := 0.0
var _stage_base := Vector2.ZERO
var _stage_scale := 1.0
var _ambient_timer := 0.0
var _time := 0.0
var _rng := RandomNumberGenerator.new()


func _ready() -> void:
	_rng.randomize()
	_fonts = T.fonts()
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	z_index = 12
	visible = false
	resized.connect(_layout)


# ================================================================ public API

func play(touch: bool, reduced: bool) -> void:
	_cancel_page_turn()
	touch_mode = touch
	reduced_motion = reduced
	_build()
	visible = true
	modulate.a = 1.0
	_playing = true
	_turning = false
	_panel_done = true
	panel_index = -1
	page_index = -1
	beats_shown = 0
	_layout()
	_next_panel()


func is_playing() -> bool:
	return _playing


func is_panel_complete() -> bool:
	return _panel_done


func total_panels() -> int:
	return ComicScript.panel_count()


## Advance one step: finish the current panel if it is still animating, otherwise show the next one.
func advance() -> void:
	if not _playing or _turning:
		return
	if not _panel_done:
		_complete_panel()
		return
	if panel_index >= ComicScript.panel_count() - 1:
		_finish(false)
		return
	if audio != null:
		audio.play_ui(&"ui_click")
	_next_panel()


## Hides the intro immediately without emitting finished (used when a match starts directly).
func cancel() -> void:
	_cancel_page_turn()
	if not visible and not _playing:
		return
	_playing = false
	visible = false
	if audio != null:
		audio.stop_voice()


func skip() -> void:
	if not _playing:
		return
	if audio != null:
		audio.play_cue(&"comic_page")
	_finish(true)


# ================================================================ build

func _build() -> void:
	for child in get_children():
		child.queue_free()
	_pages.clear()
	_panels.clear()
	_typing.clear()
	_cta = null
	_backdrop = Control.new()
	_backdrop.name = "Halftone"
	_backdrop.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_backdrop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_backdrop.draw.connect(_draw_backdrop.bind(_backdrop))
	_backdrop.resized.connect(_backdrop.queue_redraw)
	add_child(_backdrop)
	_stage = Control.new()
	_stage.name = "Stage"
	_stage.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_stage.size = ComicScript.DESIGN_SIZE
	add_child(_stage)
	_book = Control.new()
	_book.name = "Book"
	_book.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_book.size = ComicScript.DESIGN_SIZE
	_book.draw.connect(_draw_book.bind(_book))
	_stage.add_child(_book)
	for page_data: Dictionary in ComicScript.PAGES:
		var page := Control.new()
		page.name = "Page%d" % _pages.size()
		page.mouse_filter = Control.MOUSE_FILTER_IGNORE
		page.size = ComicScript.DESIGN_SIZE
		page.pivot_offset = Vector2(ComicScript.DESIGN_SIZE.x * 0.5, ComicScript.DESIGN_SIZE.y)
		page.visible = false
		_stage.add_child(page)
		_pages.append(page)
		for panel_data: Dictionary in page_data["panels"]:
			_panels.append(_build_panel(page, panel_data))
	_fx = FxLayer.new()
	_fx.name = "ComicFx"
	_fx.screen_space = true
	_fx.reduced_motion = reduced_motion
	_stage.add_child(_fx)
	_fx_top = FxLayer.new()
	_fx_top.name = "ComicFxTop"
	_fx_top.screen_space = true
	_fx_top.reduced_motion = reduced_motion
	_fx_top.z_index = 5
	_stage.add_child(_fx_top)
	_build_chrome()


func _build_panel(page: Control, data: Dictionary) -> Dictionary:
	var rect: Rect2 = data["rect"]
	var card := Control.new()
	card.name = "Panel_%s" % String(data["id"])
	card.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.position = rect.position
	card.size = rect.size
	card.pivot_offset = rect.size * 0.5
	card.visible = false
	card.draw.connect(func() -> void:
		card.draw_rect(Rect2(Vector2(8, 9), card.size), Color(INK, 0.32)))
	page.add_child(card)
	var clip := Control.new()
	clip.mouse_filter = Control.MOUSE_FILTER_IGNORE
	clip.clip_contents = true
	clip.size = rect.size
	card.add_child(clip)
	var art := TextureRect.new()
	art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	art.texture = load(String(data["art"])) as Texture2D
	art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	art.stretch_mode = TextureRect.STRETCH_SCALE
	art.size = rect.size * 1.1
	art.position = -rect.size * 0.05
	clip.add_child(art)
	var tint := ColorRect.new()
	tint.mouse_filter = Control.MOUSE_FILTER_IGNORE
	tint.size = rect.size
	tint.color = Color(1.0, 0.12, 0.08, 0.0)
	clip.add_child(tint)
	var frame := Control.new()
	frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	frame.size = rect.size
	frame.draw.connect(func() -> void:
		frame.draw_rect(Rect2(Vector2.ONE * 2.5, frame.size - Vector2.ONE * 5.0), INK, false, 5.0))
	card.add_child(frame)
	return {"data": data, "card": card, "art": art, "tint": tint, "page": page, "tween": null, "revealed": false}


func _build_chrome() -> void:
	_skip = T.button(Loc.t(&"intro.skip"), Loc.t(&"intro.skip_tooltip"), T.PAPER, 17)
	_skip.name = "SkipButton"
	_skip.focus_mode = Control.FOCUS_NONE
	_skip.custom_minimum_size = Vector2(150, 46)
	_skip.position = Vector2(1106, 4)
	_skip.size = Vector2(150, 46)
	_skip.add_theme_font_override("font", _fonts["display"])
	_skip.pressed.connect(skip)
	_skip.mouse_entered.connect(func() -> void:
		if audio != null:
			audio.play_ui(&"ui_hover"))
	_skip.z_index = 6
	_stage.add_child(_skip)
	_dots = Control.new()
	_dots.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_dots.position = Vector2(600, 694)
	_dots.size = Vector2(80, 20)
	_dots.z_index = 6
	_dots.draw.connect(_draw_dots.bind(_dots))
	_stage.add_child(_dots)
	_prompt = PanelContainer.new()
	_prompt.name = "ContinuePrompt"
	_prompt.mouse_filter = Control.MOUSE_FILTER_IGNORE
	(_prompt as PanelContainer).add_theme_stylebox_override("panel", T.box(T.GOLD, INK, 3, 10, 4))
	var row := HBoxContainer.new()
	row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	row.add_theme_constant_override("separation", 8)
	_prompt.add_child(row)
	_prompt_label = T.ink("", 17, INK, "black")
	row.add_child(_prompt_label)
	var arrow := Control.new()
	arrow.mouse_filter = Control.MOUSE_FILTER_IGNORE
	arrow.custom_minimum_size = Vector2(16, 22)
	arrow.draw.connect(func() -> void:
		var bob := 3.0 * sin(_time * 7.0) if not reduced_motion else 0.0
		arrow.draw_colored_polygon(PackedVector2Array([Vector2(2 + bob, 3), Vector2(15 + bob, 11), Vector2(2 + bob, 19)]), T.MAROON))
	row.add_child(arrow)
	_prompt.visible = false
	_prompt.z_index = 6
	_stage.add_child(_prompt)


# ================================================================ layout and drawing

func _layout() -> void:
	if _stage == null:
		return
	var design := ComicScript.DESIGN_SIZE
	_stage_scale = minf(size.x / design.x, size.y / design.y)
	_stage.scale = Vector2.ONE * _stage_scale
	_stage_base = (size - design * _stage_scale) * 0.5
	_stage.position = _stage_base


func _draw_backdrop(canvas: Control) -> void:
	var area := canvas.size
	canvas.draw_rect(Rect2(Vector2.ZERO, area), BACKDROP)
	var spacing := 22.0
	var rows := int(area.y / spacing) + 2
	var cols := int(area.x / spacing) + 2
	for row in rows:
		for col in cols:
			var p := Vector2(col * spacing + (spacing * 0.5 if row % 2 == 1 else 0.0), row * spacing)
			var fade := clampf(1.0 - p.distance_to(area * 0.5) / (area.length() * 0.55), 0.0, 1.0)
			var radius := lerpf(5.5, 1.5, fade)
			canvas.draw_circle(p, radius, BACKDROP_DOT)


func _draw_book(canvas: Control) -> void:
	var book := ComicScript.BOOK_RECT
	# Page stack edges and cast shadow.
	canvas.draw_rect(Rect2(book.position + Vector2(10, 12), book.size), Color(0, 0, 0, 0.35))
	for index in 3:
		var inset := float(3 - index) * 3.0
		canvas.draw_rect(Rect2(book.position + Vector2(-inset, inset), book.size), PAGE_EDGE)
	canvas.draw_rect(book, PAGE_PAPER)
	# Faint halftone paper grain.
	var grain := Color(0.55, 0.42, 0.25, 0.06)
	var y := book.position.y + 8.0
	while y < book.end.y:
		var x := book.position.x + 8.0 + (6.0 if int(y) % 2 == 0 else 0.0)
		while x < book.end.x:
			canvas.draw_circle(Vector2(x, y), 1.2, grain)
			x += 12.0
		y += 12.0
	# Centre fold.
	var fold_x := book.position.x + book.size.x * 0.5
	for index in 14:
		var alpha := 0.2 * (1.0 - float(index) / 14.0)
		canvas.draw_line(Vector2(fold_x - index, book.position.y), Vector2(fold_x - index, book.end.y), Color(0.3, 0.2, 0.1, alpha), 1.0)
		canvas.draw_line(Vector2(fold_x + index, book.position.y), Vector2(fold_x + index, book.end.y), Color(0.3, 0.2, 0.1, alpha * 0.7), 1.0)
	canvas.draw_rect(book, INK, false, 3.0)
	# Headers and page numbers.
	var font: Font = _fonts["black"]
	var current := maxi(page_index, 0)
	var header := Loc.t(StringName(ComicScript.PAGES[current]["title"]))
	canvas.draw_string(font, Vector2(76, 54), header.to_upper(), HORIZONTAL_ALIGNMENT_LEFT, -1, 13, T.MAROON)
	canvas.draw_string(font, Vector2(676, 54), Loc.t(&"intro.issue").to_upper(), HORIZONTAL_ALIGNMENT_LEFT, 532, 13, Color(T.MAROON, 0.8))
	canvas.draw_string(font, Vector2(76, 682), str(current * 2 + 1), HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(INK, 0.6))
	canvas.draw_string(font, Vector2(1190, 682), str(current * 2 + 2), HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(INK, 0.6))


func _draw_dots(canvas: Control) -> void:
	for index in ComicScript.PAGES.size():
		var center := Vector2(28 + index * 24, 8)
		if index == page_index:
			canvas.draw_circle(center, 8.0, T.GOLD)
			canvas.draw_arc(center, 8.0, 0.0, TAU, 20, INK, 2.5)
		else:
			canvas.draw_circle(center, 7.0, Color(T.PAPER, 0.85))
			canvas.draw_arc(center, 7.0, 0.0, TAU, 20, T.MAROON_DARK, 2.0)


# ================================================================ flow

func _next_panel() -> void:
	panel_index += 1
	var location := ComicScript.locate(panel_index)
	if location.x != page_index:
		if page_index >= 0:
			_turn_page(location.x)
			return
		page_index = location.x
		_pages[page_index].visible = true
		_book.queue_redraw()
		_dots.queue_redraw()
	_reveal_panel()


func _cancel_page_turn() -> void:
	if _page_turn_tween != null and _page_turn_tween.is_valid():
		_page_turn_tween.kill()
	_page_turn_tween = null
	_turning = false


func _turn_page(next_page: int) -> void:
	_turning = true
	_hide_prompt()
	if audio != null:
		audio.play_cue(&"comic_page")
	var old_page := _pages[page_index]
	var new_page := _pages[next_page]
	var fold := Vector2(640, 360)
	for index in 6:
		_fx.burst(&"dust", fold + Vector2(0, -260 + index * 104), 2, Vector2(60, 160), Vector2(0.4, 0.7), Vector2(20, 34), Color(1, 0.97, 0.9, 0.9), {"grow": 1.6, "drag": 2.5, "direction": PI, "spread": 1.6})
	var tween := create_tween().set_parallel(true)
	_page_turn_tween = tween
	if reduced_motion:
		tween.tween_property(old_page, "modulate:a", 0.0, 0.25)
	else:
		tween.tween_property(old_page, "position:x", -220.0, 0.42).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
		tween.tween_property(old_page, "rotation", -0.1, 0.42).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
		tween.tween_property(old_page, "modulate:a", 0.0, 0.42)
	tween.chain().tween_callback(func() -> void:
		old_page.visible = false
		_fx.clear()
		page_index = next_page
		_book.queue_redraw()
		_dots.queue_redraw()
		new_page.visible = true
		new_page.modulate.a = 0.0
		new_page.position.x = 0.0 if reduced_motion else 90.0
		var intro := create_tween().set_parallel(true)
		_page_turn_tween = intro
		intro.tween_property(new_page, "modulate:a", 1.0, 0.25)
		intro.tween_property(new_page, "position:x", 0.0, 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		intro.chain().tween_callback(func() -> void:
			_turning = false
			_reveal_panel()))


func _reveal_panel() -> void:
	if not _playing:
		return
	var entry: Dictionary = _panels[panel_index]
	var data: Dictionary = entry["data"]
	var card: Control = entry["card"]
	entry["revealed"] = true
	card.visible = true
	_panel_done = false
	_hide_prompt()
	_beats = data["beats"]
	_beat_cursor = 0
	_beat_timer = SLAM_TIME + 0.25 + float((_beats[0] as Dictionary).get("delay", 0.0)) if not _beats.is_empty() else SLAM_TIME
	_voice_wait = 0.0
	var tween := create_tween().set_parallel(true)
	entry["tween"] = tween
	if reduced_motion:
		card.modulate.a = 0.0
		tween.tween_property(card, "modulate:a", 1.0, 0.2)
	else:
		card.scale = Vector2.ONE * 1.18
		card.rotation = float(data.get("tilt", 0.04))
		card.modulate.a = 0.0
		tween.tween_property(card, "scale", Vector2.ONE, SLAM_TIME).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(card, "rotation", 0.0, SLAM_TIME).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(card, "modulate:a", 1.0, 0.12)
		var art: TextureRect = entry["art"]
		var pan: Vector2 = data.get("pan", Vector2.ZERO)
		var rect: Rect2 = data["rect"]
		var drift := create_tween()
		drift.tween_property(art, "position", -rect.size * 0.05 + pan * rect.size, 14.0).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tween.chain().tween_callback(_on_panel_landed.bind(panel_index))
	if audio != null:
		audio.play_cue(&"comic_slam")
		var voice: StringName = data.get("voice", &"")
		if voice != &"":
			audio.play_story_voice(voice)
		var sfx: StringName = data.get("sfx", &"")
		if sfx != &"":
			audio.play_cue(sfx)


func _on_panel_landed(index: int) -> void:
	if not _playing or index >= _panels.size():
		return
	var rect: Rect2 = _panels[index]["data"]["rect"]
	_shake = maxf(_shake, 7.0)
	for step in 5:
		var along := rect.position.x + rect.size.x * (0.1 + 0.2 * step)
		_fx.burst(&"dust", Vector2(along, rect.end.y), 2, Vector2(40, 120), Vector2(0.35, 0.6), Vector2(16, 28), Color(1, 0.97, 0.9, 0.9), {"grow": 1.7, "drag": 3.0, "squash": 0.4})
		_fx.burst(&"dust", Vector2(along, rect.position.y), 1, Vector2(30, 90), Vector2(0.3, 0.5), Vector2(14, 22), Color(1, 0.97, 0.9, 0.8), {"grow": 1.5, "drag": 3.0, "squash": 0.4})
	_fx.burst(&"star", rect.get_center(), 6, Vector2(160, 320), Vector2(0.3, 0.55), Vector2(10, 18), Color("fff2b0"), {"glow": true, "drag": 3.0})


func _complete_panel() -> void:
	var entry: Dictionary = _panels[panel_index]
	var tween: Tween = entry.get("tween")
	var card: Control = entry["card"]
	if tween != null and tween.is_valid():
		tween.kill()
		card.scale = Vector2.ONE
		card.rotation = 0.0
		card.modulate.a = 1.0
		_on_panel_landed(panel_index)
	while _beat_cursor < _beats.size():
		var beat: Dictionary = _beats[_beat_cursor]
		_beat_cursor += 1
		_show_beat(beat, true)
	for typing: Dictionary in _typing:
		(typing["label"] as Label).visible_characters = -1
	_typing.clear()
	_panel_done = true
	_show_prompt()


func _finish(skipped: bool) -> void:
	if not _playing:
		return
	_playing = false
	_cancel_page_turn()
	_hide_prompt()
	if audio != null:
		audio.stop_voice()
	var tween := create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.3)
	tween.tween_callback(func() -> void:
		visible = false
		finished.emit(skipped))


# ================================================================ beats

## Shows one beat and returns how long it takes before the next beat may start.
func _show_beat(beat: Dictionary, instant: bool) -> float:
	beats_shown += 1
	var kind: StringName = beat["kind"]
	var page := _pages[page_index]
	var duration := 0.4
	match kind:
		&"caption", &"speech", &"jagged", &"radio":
			var bubble := _make_bubble(beat)
			bubble.z_index = 4
			page.add_child(bubble)
			var chars := bubble.label.get_total_character_count()
			if instant:
				bubble.label.visible_characters = -1
			else:
				_typing.append({"label": bubble.label, "chars": chars, "t": 0.0, "tick": 0})
				_pop(bubble, kind == &"caption")
				duration = float(chars) / TYPE_SPEED + 0.25
			if audio != null:
				var voice: StringName = beat.get("voice", &"")
				if voice != &"":
					audio.play_story_voice(voice)
				audio.play_cue(beat.get("sfx", &"ui_confirm" if kind != &"caption" else &"ui_hover"))
			if not instant:
				var center := bubble.position + bubble.size * 0.5
				_fx.burst(&"star", center, 4, Vector2(90, 180), Vector2(0.25, 0.45), Vector2(8, 14), Color("fff2b0"), {"glow": true, "drag": 3.0})
			_beat_fx(beat.get("fx", &""), bubble.position + bubble.size * 0.5, instant)
		&"sticker":
			_stamp_sticker(page, beat, instant)
			duration = 0.55
		&"mission":
			duration = _show_mission(page, beat, instant)
		&"cta":
			_show_cta(page, beat, instant)
			duration = 0.3
	return duration


func _make_bubble(beat: Dictionary) -> Bubble:
	var kind: StringName = beat["kind"]
	var font_key := "bold"
	var font_size := 16
	match kind:
		&"caption":
			font_key = "bold"
			font_size = 16
		&"speech":
			font_key = "black"
			font_size = 17
		&"jagged":
			font_key = "display"
			font_size = 24
		&"radio":
			font_key = "black"
			font_size = 15
	var bubble := Bubble.new()
	bubble.setup(kind, Loc.t(StringName(beat["text"])), float(beat.get("width", 220.0)), _fonts[font_key], font_size, beat["pos"], beat.get("tail", Vector2.INF))
	return bubble


func _pop(node: Control, drop: bool) -> void:
	if reduced_motion:
		node.modulate.a = 0.0
		create_tween().tween_property(node, "modulate:a", 1.0, 0.18)
		return
	var tween := create_tween().set_parallel(true)
	if drop:
		var target := node.position
		node.position = target - Vector2(0, 26)
		node.modulate.a = 0.0
		tween.tween_property(node, "position", target, 0.3).set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		tween.tween_property(node, "modulate:a", 1.0, 0.14)
	else:
		node.scale = Vector2.ONE * 0.05
		tween.tween_property(node, "scale", Vector2.ONE, 0.34).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func _stamp_sticker(page: Control, beat: Dictionary, instant: bool) -> void:
	var texture := FxLayer.STICKERS.get(StringName(beat["sticker"])) as Texture2D
	var sticker := TextureRect.new()
	sticker.mouse_filter = Control.MOUSE_FILTER_IGNORE
	sticker.texture = texture
	sticker.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	sticker.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	var side := float(beat.get("size", 160.0))
	var aspect := float(texture.get_width()) / maxf(1.0, float(texture.get_height()))
	sticker.size = Vector2(side * aspect, side) if aspect < 1.0 else Vector2(side, side / aspect)
	var pos: Vector2 = beat["pos"]
	sticker.position = pos - sticker.size * 0.5
	sticker.pivot_offset = sticker.size * 0.5
	var tilt := _rng.randf_range(-0.16, 0.16)
	sticker.z_index = 4
	page.add_child(sticker)
	if instant or reduced_motion:
		sticker.rotation = tilt
	else:
		sticker.scale = Vector2.ONE * 1.7
		sticker.rotation = tilt - 0.5
		sticker.modulate.a = 0.0
		var tween := create_tween().set_parallel(true)
		tween.tween_property(sticker, "scale", Vector2.ONE, 0.26).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(sticker, "rotation", tilt, 0.26).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(sticker, "modulate:a", 1.0, 0.08)
		tween.chain().tween_property(sticker, "scale", Vector2.ONE * 1.06, 0.5).set_trans(Tween.TRANS_SINE)
		tween.chain().tween_property(sticker, "scale", Vector2.ONE, 0.5).set_trans(Tween.TRANS_SINE)
		_shake = maxf(_shake, float(beat.get("shake", 6.0)))
	if audio != null:
		var sfx: StringName = beat.get("sfx", &"")
		if sfx != &"":
			audio.play_cue(sfx)
	_beat_fx(beat.get("fx", &""), pos, instant)


func _show_mission(page: Control, beat: Dictionary, instant: bool) -> float:
	var note := T.sticky(Vector2(18, 16))
	note.mouse_filter = Control.MOUSE_FILTER_IGNORE
	note.position = beat["pos"]
	note.custom_minimum_size = Vector2(float(beat.get("width", 270.0)), 0)
	note.rotation = -0.035
	note.z_index = 4
	page.add_child(note)
	var column := VBoxContainer.new()
	column.mouse_filter = Control.MOUSE_FILTER_IGNORE
	column.add_theme_constant_override("separation", 6)
	note.add_child(column)
	var title := T.ink(Loc.t(&"intro.p6.mission_title"), 19, T.MAROON, "black")
	column.add_child(title)
	var rows: Array[Control] = []
	for line: Dictionary in ComicScript.MISSION_LINES:
		var row := HBoxContainer.new()
		row.mouse_filter = Control.MOUSE_FILTER_IGNORE
		row.add_theme_constant_override("separation", 8)
		var icon := T.icon(load(String(line["icon"])) as Texture2D, 26)
		icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
		row.add_child(icon)
		var label := T.ink(Loc.t(StringName(line["text"])), 16, INK, "black")
		row.add_child(label)
		column.add_child(row)
		rows.append(row)
	if instant or reduced_motion:
		_pop(note, true)
		return 0.3
	_pop(note, true)
	for index in rows.size():
		var row := rows[index]
		row.modulate.a = 0.0
		var tween := create_tween()
		tween.tween_interval(0.35 + 0.42 * index)
		tween.tween_callback(func() -> void:
			row.modulate.a = 1.0
			row.pivot_offset = Vector2(0, row.size.y * 0.5)
			row.scale = Vector2(1.35, 1.35)
			var pop := create_tween()
			pop.tween_property(row, "scale", Vector2.ONE, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			var at := note.position + row.position + Vector2(30, row.size.y * 0.5 + 18)
			_fx_top.burst(&"star", at, 5, Vector2(80, 180), Vector2(0.3, 0.5), Vector2(9, 15), Color("ffe07a"), {"glow": true, "drag": 3.0})
			if audio != null:
				audio.play_cue(&"coin"))
	return 0.35 + 0.42 * rows.size()


func _show_cta(page: Control, beat: Dictionary, instant: bool) -> void:
	_cta = T.button(Loc.t(&"intro.cta"), Loc.t(&"intro.cta_tooltip"), T.MAROON, 26)
	_cta.name = "DefendButton"
	_cta.add_theme_font_override("font", _fonts["display"])
	_cta.custom_minimum_size = Vector2(300, 66)
	_cta.size = Vector2(300, 66)
	var pos: Vector2 = beat["pos"]
	_cta.position = pos - _cta.size * 0.5
	_cta.pivot_offset = _cta.size * 0.5
	_cta.pressed.connect(func() -> void:
		if audio != null:
			audio.play_ui(&"ui_confirm")
		_fx_top.preset(&"confetti", pos, 1.6)
		_finish(false))
	_cta.mouse_entered.connect(func() -> void:
		if audio != null:
			audio.play_ui(&"ui_hover"))
	_cta.z_index = 4
	page.add_child(_cta)
	_cta.grab_focus.call_deferred()
	if not instant and not reduced_motion:
		_cta.scale = Vector2.ONE * 0.1
		create_tween().tween_property(_cta, "scale", Vector2.ONE, 0.4).set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
	_fx_top.preset(&"confetti", pos, 1.3)
	if audio != null:
		audio.play_cue(&"levelup")


func _beat_fx(name: StringName, pos: Vector2, instant: bool) -> void:
	if name == &"" or (instant and reduced_motion):
		return
	match name:
		&"sparkle":
			for index in 3:
				_fx.preset(&"ui_sparkle", pos + Vector2(_rng.randf_range(-90, 90), _rng.randf_range(-24, 24)), 1.4)
			_fx.burst(&"confetti_gold", pos, 8, Vector2(120, 260), Vector2(0.6, 1.0), Vector2(10, 16), Color.WHITE, {"grav": 260.0, "drag": 0.8})
		&"ink":
			_fx.burst(&"smoke_b", pos, 6, Vector2(60, 150), Vector2(0.4, 0.75), Vector2(22, 36), Color(0.12, 0.1, 0.14, 0.75), {"grow": 1.6, "drag": 3.0})
			_fx.burst(&"ember", pos, 8, Vector2(80, 200), Vector2(0.4, 0.8), Vector2(8, 14), Color(0.55, 1.0, 0.45), {"glow": true, "grav": -40.0})
		&"explosion":
			_fx.preset(&"explosion", pos, 1.4)
			_fx.flash(pos, 150.0, Color(1, 0.85, 0.4, 0.9), 0.3)
			_fx.burst(&"smoke_a", pos, 6, Vector2(60, 150), Vector2(0.6, 1.0), Vector2(30, 50), Color(1, 1, 1, 0.8), {"grow": 1.8, "grav": -40.0, "drag": 2.5})
		&"alarm":
			_fx.flash(pos, 110.0, Color(1, 0.2, 0.1, 0.75), 0.4)
			_fx.burst(&"star", pos, 8, Vector2(120, 240), Vector2(0.3, 0.55), Vector2(10, 16), Color("ff6b4a"), {"glow": true, "drag": 3.0})
		&"fire":
			_fx.preset(&"hit_fire", pos, 2.2)
			_fx.preset(&"fireball", pos + Vector2(40, 30), 0.8)
		&"confetti":
			_fx.preset(&"confetti", pos, 1.2)
			_fx.preset(&"ui_pop", pos, 1.4)


# ================================================================ per-frame

func _process(delta: float) -> void:
	if not visible or _stage == null:
		return
	_time += delta
	if _shake > 0.0:
		_shake = maxf(0.0, _shake - delta * 40.0)
		var amount := 0.0 if reduced_motion else _shake
		_stage.position = _stage_base + Vector2(_rng.randf_range(-amount, amount), _rng.randf_range(-amount, amount)) * _stage_scale
	else:
		_stage.position = _stage_base
	_update_typing(delta)
	_update_ambient(delta)
	if _prompt.visible:
		_prompt.get_child(0).get_child(1).queue_redraw()
		if not reduced_motion:
			_prompt.pivot_offset = _prompt.size * 0.5
			_prompt.scale = Vector2.ONE * (1.0 + 0.04 * sin(_time * 5.0))
	if _cta != null and is_instance_valid(_cta) and not reduced_motion:
		_cta.scale = _cta.scale.lerp(Vector2.ONE * (1.0 + 0.045 * sin(_time * 4.5)), minf(1.0, delta * 8.0))
	if not _playing or _turning or _panel_done:
		return
	if _beat_cursor < _beats.size():
		_beat_timer -= delta
		if _beat_timer > 0.0:
			return
		var beat: Dictionary = _beats[_beat_cursor]
		if bool(beat.get("wait_voice", false)) and audio != null and audio.is_voice_playing() and _voice_wait < VOICE_WAIT_LIMIT:
			_voice_wait += delta
			return
		_beat_cursor += 1
		var duration := _show_beat(beat, false)
		var next_delay := 0.0
		if _beat_cursor < _beats.size():
			next_delay = float((_beats[_beat_cursor] as Dictionary).get("delay", 0.0))
		_beat_timer = duration + BEAT_GAP + next_delay
	elif _typing.is_empty() and _beat_timer <= 0.0:
		_panel_done = true
		_show_prompt()
	else:
		_beat_timer -= delta


func _update_typing(delta: float) -> void:
	for index in range(_typing.size() - 1, -1, -1):
		var typing: Dictionary = _typing[index]
		var label: Label = typing["label"]
		if not is_instance_valid(label):
			_typing.remove_at(index)
			continue
		typing["t"] = float(typing["t"]) + delta
		var shown := int(float(typing["t"]) * TYPE_SPEED)
		var total := int(typing["chars"])
		label.visible_characters = mini(shown, total)
		if audio != null and shown / 7 > int(typing["tick"]) and shown < total:
			typing["tick"] = shown / 7
			audio.play_ui(&"ui_hover")
		if shown >= total:
			label.visible_characters = -1
			_typing.remove_at(index)


func _update_ambient(delta: float) -> void:
	if page_index < 0:
		return
	_ambient_timer -= delta
	var emit := _ambient_timer <= 0.0
	if emit:
		_ambient_timer = 0.24 if not reduced_motion else 0.5
	for entry: Dictionary in _panels:
		if not bool(entry["revealed"]) or entry["page"] != _pages[page_index]:
			continue
		var data: Dictionary = entry["data"]
		var rect: Rect2 = data["rect"]
		var ambient: StringName = data.get("ambient", &"")
		if ambient == &"alarm":
			(entry["tint"] as ColorRect).color.a = 0.16 * (0.5 + 0.5 * sin(_time * 6.5))
		if not emit:
			continue
		var x := _rng.randf_range(rect.position.x + 10, rect.end.x - 10)
		match ambient:
			&"leaves":
				_fx.particle(&"leaf", Vector2(x, rect.position.y + 4), Vector2(_rng.randf_range(10, 45), _rng.randf_range(40, 70)), _rng.randf_range(4.0, 6.0), 18.0, 16.0, Color(1, 1, 1, 0.95), {"spin": _rng.randf_range(-2.0, 2.0), "fade": 0.85, "fade_in": 0.1, "wobble": 26.0})
			&"embers":
				_fx.particle(&"ember", Vector2(x, rect.end.y - 8), Vector2(_rng.randf_range(-12, 12), _rng.randf_range(-50, -80)), _rng.randf_range(1.4, 2.2), 12.0, 4.0, Color(0.55, 1.0, 0.45), {"glow": true, "grav": -10.0, "drag": 0.4})
			&"smoke":
				var at := Vector2(_rng.randf_range(rect.position.x + rect.size.x * 0.6, rect.end.x - 20), rect.end.y - _rng.randf_range(20, 90))
				_fx.particle(&"smoke_a", at, Vector2(_rng.randf_range(-8, 8), _rng.randf_range(-22, -36)), _rng.randf_range(2.0, 3.0), 30.0, 70.0, Color(1, 1, 1, 0.45), {"fade": 0.7, "drag": 0.3})
			&"alarm":
				_fx.particle(&"star", Vector2(rect.position.x + rect.size.x * 0.73, rect.position.y + rect.size.y * 0.25), Vector2(_rng.randf_range(-60, 60), _rng.randf_range(-60, 20)), 0.5, 8.0, 3.0, Color("ff5a3c"), {"glow": true, "drag": 2.0})
			&"powers":
				var textures := [&"ember", &"snowflake", &"psi_swirl"]
				var tint := [Color(1, 0.7, 0.3), Color(0.8, 0.95, 1.0), Color(0.85, 0.6, 1.0)]
				var pick := _rng.randi_range(0, 2)
				_fx.particle(textures[pick], Vector2(x, rect.end.y - _rng.randf_range(10, 60)), Vector2(_rng.randf_range(-15, 15), _rng.randf_range(-40, -70)), _rng.randf_range(1.2, 1.8), 14.0, 6.0, tint[pick], {"glow": true, "grav": -20.0})
			&"confetti":
				var piece := &"confetti_gold" if _rng.randf() < 0.5 else &"confetti_maroon"
				_fx.particle(piece, Vector2(x, rect.position.y + 4), Vector2(_rng.randf_range(-20, 20), _rng.randf_range(50, 90)), _rng.randf_range(3.0, 4.5), 14.0, 12.0, Color.WHITE, {"spin": _rng.randf_range(-4.0, 4.0), "fade": 0.85, "wobble": 20.0})


func _show_prompt() -> void:
	if panel_index >= ComicScript.panel_count() - 1:
		_prompt.visible = false
		return
	_prompt_label.text = Loc.t(&"intro.continue_touch") if touch_mode else Loc.t(&"intro.continue")
	_prompt.visible = true
	_prompt.reset_size()
	_prompt.position = Vector2(1232, 686) - _prompt.size
	if not reduced_motion:
		_prompt.modulate.a = 0.0
		create_tween().tween_property(_prompt, "modulate:a", 1.0, 0.2)


func _hide_prompt() -> void:
	if _prompt != null:
		_prompt.visible = false


# ================================================================ input

func _gui_input(event: InputEvent) -> void:
	if not _playing:
		return
	var press := false
	if event is InputEventMouseButton:
		var mouse := event as InputEventMouseButton
		press = mouse.pressed and mouse.button_index == MOUSE_BUTTON_LEFT
	elif event is InputEventScreenTouch:
		press = (event as InputEventScreenTouch).pressed
	if press:
		accept_event()
		advance()


func _unhandled_key_input(event: InputEvent) -> void:
	if not visible or not _playing:
		return
	var key := event as InputEventKey
	if key == null or not key.pressed or key.echo:
		return
	match key.keycode:
		KEY_SPACE, KEY_ENTER, KEY_KP_ENTER:
			advance()
			get_viewport().set_input_as_handled()
		KEY_ESCAPE:
			skip()
			get_viewport().set_input_as_handled()


# ================================================================ balloon

## Caption box or speech balloon drawn in ink, with a typewriter label inside.
class Bubble:
	extends Control

	var kind: StringName = &"caption"
	var label: Label
	var tail_local := Vector2.INF

	func setup(bubble_kind: StringName, text: String, width: float, font: Font, font_size: int, pos: Vector2, tail: Vector2) -> void:
		kind = bubble_kind
		mouse_filter = Control.MOUSE_FILTER_IGNORE
		var pad := Vector2(12, 9)
		var align := HORIZONTAL_ALIGNMENT_LEFT
		match kind:
			&"speech":
				pad = Vector2(20, 14)
				align = HORIZONTAL_ALIGNMENT_CENTER
			&"jagged":
				pad = Vector2(24, 20)
				align = HORIZONTAL_ALIGNMENT_CENTER
			&"radio":
				pad = Vector2(14, 11)
		var inner := width - pad.x * 2.0
		var text_size := font.get_multiline_string_size(text, align, inner, font_size)
		size = Vector2(width, text_size.y + pad.y * 2.0)
		position = pos
		label = Label.new()
		label.mouse_filter = Control.MOUSE_FILTER_IGNORE
		label.text = text
		label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		label.horizontal_alignment = align
		label.add_theme_font_override("font", font)
		label.add_theme_font_size_override("font_size", font_size)
		label.add_theme_color_override("font_color", Color("1c1320"))
		label.add_theme_constant_override("line_spacing", -2)
		label.position = pad
		label.size = Vector2(inner, text_size.y + 4.0)
		label.visible_characters = 0
		add_child(label)
		if tail != Vector2.INF:
			tail_local = tail - pos
		pivot_offset = size * 0.5 if tail_local == Vector2.INF else tail_local.clamp(Vector2.ZERO, size)

	func _draw() -> void:
		var ink := Color("1c1320")
		match kind:
			&"caption":
				draw_rect(Rect2(Vector2(5, 5), size), Color(ink, 0.35))
				draw_rect(Rect2(Vector2.ZERO, size), Color("ffe07a"))
				draw_rect(Rect2(Vector2.ZERO, size), ink, false, 3.0)
			&"speech":
				_draw_oval(Color.WHITE, ink, false)
			&"jagged":
				_draw_oval(Color.WHITE, ink, true)
			&"radio":
				_draw_radio(ink)

	func _oval_points(grow: float, jagged: bool) -> PackedVector2Array:
		var center := size * 0.5
		var radius := size * 0.5 + Vector2(10, 8) + Vector2.ONE * grow
		var points := PackedVector2Array()
		var count := 40 if jagged else 36
		for index in count:
			var angle := TAU * float(index) / float(count)
			var scale := 1.0
			if jagged:
				scale = 1.16 if index % 2 == 0 else 0.9
			points.append(center + Vector2(cos(angle) * radius.x, sin(angle) * radius.y) * scale)
		return points

	func _tail_points(grow: float) -> PackedVector2Array:
		var center := size * 0.5
		var direction := (tail_local - center).normalized()
		var side := Vector2(-direction.y, direction.x)
		var base := center + direction * minf(size.x, size.y) * 0.3
		return PackedVector2Array([base + side * (13.0 + grow), tail_local + direction * grow * 1.4, base - side * (13.0 + grow)])

	func _draw_oval(fill: Color, ink: Color, jagged: bool) -> void:
		var has_tail := tail_local != Vector2.INF
		draw_colored_polygon(_oval_points(9.0, jagged), Color(ink, 0.3))
		draw_colored_polygon(_oval_points(3.5, jagged), ink)
		if has_tail:
			draw_colored_polygon(_tail_points(3.5), ink)
			draw_colored_polygon(_tail_points(0.0), fill)
		draw_colored_polygon(_oval_points(0.0, jagged), fill)

	func _draw_radio(ink: Color) -> void:
		var box := StyleBoxFlat.new()
		box.bg_color = Color("eaf6ff")
		box.border_color = ink
		box.set_border_width_all(3)
		box.set_corner_radius_all(12)
		box.shadow_color = Color(ink, 0.3)
		box.shadow_offset = Vector2(4, 5)
		box.shadow_size = 1
		draw_style_box(box, Rect2(Vector2(-6, -4), size + Vector2(12, 8)))
		if tail_local == Vector2.INF:
			return
		var start := Vector2(clampf(tail_local.x, 12.0, size.x - 12.0), size.y + 4.0)
		if tail_local.x < 0.0:
			start = Vector2(-6.0, clampf(tail_local.y, 12.0, size.y - 12.0))
		var zig := PackedVector2Array()
		var steps := 5
		for index in steps + 1:
			var t := float(index) / float(steps)
			var point := start.lerp(tail_local, t)
			var normal := (tail_local - start).normalized().orthogonal()
			if index > 0 and index < steps:
				point += normal * (9.0 if index % 2 == 0 else -9.0)
			zig.append(point)
		draw_polyline(zig, ink, 6.0, true)
		draw_polyline(zig, Color("eaf6ff"), 2.5, true)
		for index in 3:
			var ring := 10.0 + index * 7.0
			draw_arc(tail_local, ring, -2.4, -0.7, 8, Color(ink, 0.7 - index * 0.2), 2.5)
