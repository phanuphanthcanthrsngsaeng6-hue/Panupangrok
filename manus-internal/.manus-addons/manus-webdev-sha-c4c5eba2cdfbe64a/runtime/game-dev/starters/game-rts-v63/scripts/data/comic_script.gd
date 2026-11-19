class_name ComicScript
extends RefCounted
## Data-only storyboard for the "Previously on Homecoming" comic intro.
## Coordinates are in the 1280x720 book-spread design space used by ComicIntro.
## Beat kinds: caption, speech, jagged, radio (balloons), sticker, mission, cta.
## Balloons point their tail at "tail". Text is always a localization key.

const DESIGN_SIZE := Vector2(1280, 720)
const BOOK_RECT := Rect2(40, 30, 1200, 660)
const TALL_LEFT := Rect2(72, 62, 536, 596)
const WIDE_RIGHT_TOP := Rect2(672, 62, 536, 288)
const WIDE_RIGHT_BOTTOM := Rect2(672, 370, 536, 288)
const WIDE_LEFT_TOP := Rect2(72, 62, 536, 288)
const WIDE_LEFT_BOTTOM := Rect2(72, 370, 536, 288)
const TALL_RIGHT := Rect2(672, 62, 536, 596)

const PAGES := [
	{
		"title": &"intro.page1.title",
		"panels": [
			{
				"id": &"quad",
				"art": "res://assets/template/game/comic/p1_quad.webp",
				"rect": TALL_LEFT,
				"tilt": -0.05,
				"voice": &"intro_n1",
				"ambient": &"leaves",
				"pan": Vector2(-0.03, 0.035),
				"beats": [
					{"kind": &"caption", "text": &"intro.p1.caption", "pos": Vector2(90, 80), "width": 300.0},
					{"kind": &"caption", "text": &"intro.p1.caption2", "pos": Vector2(368, 590), "width": 222.0, "delay": 0.6, "fx": &"sparkle"},
				],
			},
			{
				"id": &"villain",
				"art": "res://assets/template/game/comic/p2_villain.webp",
				"rect": WIDE_RIGHT_TOP,
				"tilt": 0.045,
				"voice": &"intro_n2",
				"sfx": &"comic_sting",
				"ambient": &"embers",
				"pan": Vector2(0.03, -0.02),
				"beats": [
					{"kind": &"caption", "text": &"intro.p2.caption", "pos": Vector2(684, 72), "width": 244.0},
					{"kind": &"jagged", "text": &"intro.p2.coach", "pos": Vector2(714, 192), "width": 180.0, "tail": Vector2(900, 150), "voice": &"intro_coach", "wait_voice": true, "fx": &"ink"},
				],
			},
			{
				"id": &"invasion",
				"art": "res://assets/template/game/comic/p3_invasion.webp",
				"rect": WIDE_RIGHT_BOTTOM,
				"tilt": -0.06,
				"voice": &"intro_n3",
				"ambient": &"smoke",
				"pan": Vector2(-0.035, 0.0),
				"beats": [
					{"kind": &"caption", "text": &"intro.p3.caption", "pos": Vector2(684, 380), "width": 300.0},
					{"kind": &"sticker", "sticker": &"kaboom", "pos": Vector2(1096, 552), "size": 190.0, "sfx": &"slam", "fx": &"explosion", "shake": 14.0},
					{"kind": &"speech", "text": &"intro.p3.help", "pos": Vector2(690, 470), "width": 92.0, "tail": Vector2(742, 530)},
					{"kind": &"speech", "text": &"intro.p3.gym", "pos": Vector2(846, 590), "width": 170.0, "tail": Vector2(870, 560)},
				],
			},
		],
	},
	{
		"title": &"intro.page2.title",
		"panels": [
			{
				"id": &"principal",
				"art": "res://assets/template/game/comic/p4_principal.webp",
				"rect": WIDE_LEFT_TOP,
				"tilt": 0.05,
				"voice": &"intro_principal",
				"sfx": &"wave_bell",
				"ambient": &"alarm",
				"pan": Vector2(0.025, 0.02),
				"beats": [
					{"kind": &"sticker", "sticker": &"warning", "pos": Vector2(150, 118), "size": 132.0, "sfx": &"ui_error", "fx": &"alarm", "shake": 6.0},
					{"kind": &"radio", "text": &"intro.p4.principal", "pos": Vector2(384, 76), "width": 212.0, "tail": Vector2(300, 196)},
				],
			},
			{
				"id": &"squad",
				"art": "res://assets/template/game/comic/p5_squad.webp",
				"rect": WIDE_LEFT_BOTTOM,
				"tilt": -0.045,
				"voice": &"intro_n5",
				"ambient": &"powers",
				"pan": Vector2(0.0, -0.03),
				"beats": [
					{"kind": &"caption", "text": &"intro.p5.caption", "pos": Vector2(380, 380), "width": 214.0},
					{"kind": &"speech", "text": &"intro.p5.blaze", "pos": Vector2(86, 392), "width": 138.0, "tail": Vector2(226, 452), "sfx": &"power_blaze", "fx": &"fire"},
					{"kind": &"sticker", "sticker": &"sproing", "pos": Vector2(560, 470), "size": 118.0, "sfx": &"power_stretch", "fx": &"confetti", "shake": 5.0},
					{"kind": &"speech", "text": &"intro.p5.stretch", "pos": Vector2(392, 574), "width": 196.0, "tail": Vector2(470, 520)},
				],
			},
			{
				"id": &"splash",
				"art": "res://assets/template/game/comic/p6_splash.webp",
				"rect": TALL_RIGHT,
				"tilt": 0.05,
				"voice": &"intro_n6",
				"sfx": &"boss_stomp",
				"ambient": &"confetti",
				"pan": Vector2(0.0, 0.04),
				"beats": [
					{"kind": &"caption", "text": &"intro.p6.caption", "pos": Vector2(690, 80), "width": 262.0},
					{"kind": &"mission", "pos": Vector2(690, 408), "width": 272.0},
					{"kind": &"cta", "pos": Vector2(958, 604)},
				],
			},
		],
	},
]

const MISSION_LINES := [
	{"text": &"intro.p6.m1", "icon": "res://assets/template/game/fx/heart.png"},
	{"text": &"intro.p6.m2", "icon": "res://assets/template/game/ui/crest.png"},
	{"text": &"intro.p6.m3", "icon": "res://assets/template/game/ui/icon_spirit.png"},
	{"text": &"intro.p6.m4", "icon": "res://assets/template/game/fx/sticker_burst.png"},
]


static func panel_count() -> int:
	var total := 0
	for page: Dictionary in PAGES:
		total += (page["panels"] as Array).size()
	return total


## Returns [page_index, panel_index_within_page] for a global panel index.
static func locate(global_index: int) -> Vector2i:
	var remaining := global_index
	for page_index in PAGES.size():
		var panels: Array = PAGES[page_index]["panels"]
		if remaining < panels.size():
			return Vector2i(page_index, remaining)
		remaining -= panels.size()
	return Vector2i(-1, -1)
