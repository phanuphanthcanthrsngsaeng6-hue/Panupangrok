class_name HeroTheme
extends RefCounted
## Yearbook-sticker UI styling shared by every Campus Hero Defense screen.

const INK := Color("1c1320")
const PAPER := Color("fff6df")
const GOLD := Color("f2b72c")
const MAROON := Color("8e1b2e")
const MAROON_DARK := Color("5e1020")
const OLIVE := Color("6f7f35")
const RED := Color("e0452f")
const SKY := Color("3f9be0")
const MUTED := Color("b9a98c")


static func fonts() -> Dictionary:
	return {
		"display": load("res://assets/template/game/fonts/display.tres") as Font,
		"regular": load("res://assets/template/game/fonts/nunito_regular.tres") as Font,
		"bold": load("res://assets/template/game/fonts/nunito_bold.tres") as Font,
		"black": load("res://assets/template/game/fonts/nunito_black.tres") as Font,
	}


static func box(bg: Color, border: Color = INK, border_width: int = 3, radius: int = 12, shadow: int = 4) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(border_width)
	style.set_corner_radius_all(radius)
	style.shadow_color = Color(0, 0, 0, 0.35)
	style.shadow_size = 0
	style.shadow_offset = Vector2(0, shadow)
	if shadow > 0:
		style.shadow_size = 1
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 6
	style.content_margin_bottom = 6
	style.anti_aliasing = true
	return style


static func build_theme() -> Theme:
	var f := fonts()
	var theme := Theme.new()
	theme.default_font = f["bold"]
	theme.default_font_size = 16
	theme.set_stylebox("normal", "Button", tex_box(TEX_BTN_CREAM, Vector2(22, 20), Vector2(18, 6)))
	theme.set_stylebox("hover", "Button", tex_box(TEX_BTN_CREAM, Vector2(22, 20), Vector2(18, 6), Color(1.12, 1.12, 1.12)))
	theme.set_stylebox("pressed", "Button", tex_box(TEX_BTN_CREAM, Vector2(22, 20), Vector2(18, 6), Color(0.82, 0.82, 0.82)))
	theme.set_stylebox("disabled", "Button", tex_box(TEX_BTN_CREAM, Vector2(22, 20), Vector2(18, 6), Color(0.72, 0.7, 0.68, 0.85)))
	theme.set_stylebox("focus", "Button", box(Color(0, 0, 0, 0), SKY, 3, 12, 0))
	theme.set_color("font_color", "Button", INK)
	theme.set_color("font_hover_color", "Button", INK)
	theme.set_color("font_pressed_color", "Button", INK)
	theme.set_color("font_focus_color", "Button", INK)
	theme.set_color("font_disabled_color", "Button", Color("7d7280"))
	theme.set_font("font", "Button", f["black"])
	theme.set_font_size("font_size", "Button", 16)
	theme.set_stylebox("panel", "PanelContainer", box(Color(0.11, 0.07, 0.12, 0.92), PAPER, 3, 14, 5))
	theme.set_stylebox("panel", "Panel", box(Color(0.11, 0.07, 0.12, 0.92), PAPER, 3, 14, 5))
	theme.set_color("font_color", "Label", PAPER)
	theme.set_color("font_outline_color", "Label", INK)
	theme.set_constant("outline_size", "Label", 0)
	theme.set_stylebox("panel", "TooltipPanel", box(PAPER, INK, 2, 8, 3))
	theme.set_color("font_color", "TooltipLabel", INK)
	theme.set_font("font", "TooltipLabel", f["bold"])
	theme.set_font_size("font_size", "TooltipLabel", 14)
	var bar_bg := box(Color("3a2a36"), INK, 2, 6, 0)
	bar_bg.content_margin_top = 0
	bar_bg.content_margin_bottom = 0
	var bar_fill := box(Color("58c94f"), Color(0, 0, 0, 0), 0, 5, 0)
	theme.set_stylebox("background", "ProgressBar", bar_bg)
	theme.set_stylebox("fill", "ProgressBar", bar_fill)
	theme.set_color("font_color", "ProgressBar", PAPER)
	theme.set_stylebox("normal", "CheckButton", box(Color(0, 0, 0, 0), Color(0, 0, 0, 0), 0, 8, 0))
	theme.set_stylebox("hover", "CheckButton", box(Color(1, 1, 1, 0.08), Color(0, 0, 0, 0), 0, 8, 0))
	theme.set_stylebox("pressed", "CheckButton", box(Color(0, 0, 0, 0), Color(0, 0, 0, 0), 0, 8, 0))
	theme.set_stylebox("hover_pressed", "CheckButton", box(Color(1, 1, 1, 0.08), Color(0, 0, 0, 0), 0, 8, 0))
	theme.set_stylebox("focus", "CheckButton", box(Color(0, 0, 0, 0), SKY, 2, 8, 0))
	theme.set_color("font_color", "CheckButton", PAPER)
	theme.set_color("font_hover_color", "CheckButton", PAPER)
	theme.set_color("font_pressed_color", "CheckButton", PAPER)
	theme.set_color("font_hover_pressed_color", "CheckButton", PAPER)
	theme.set_color("font_focus_color", "CheckButton", PAPER)
	theme.set_stylebox("scroll", "VScrollBar", box(Color(1, 1, 1, 0.08), Color(0, 0, 0, 0), 0, 6, 0))
	theme.set_stylebox("grabber", "VScrollBar", box(GOLD, Color(0, 0, 0, 0), 0, 6, 0))
	theme.set_stylebox("grabber_highlight", "VScrollBar", box(Color("ffd35c"), Color(0, 0, 0, 0), 0, 6, 0))
	theme.set_stylebox("grabber_pressed", "VScrollBar", box(Color("ffd35c"), Color(0, 0, 0, 0), 0, 6, 0))
	return theme


static func label(text: String, size: int = 16, color: Color = PAPER, font_key: String = "bold", outline: int = 0) -> Label:
	var node := Label.new()
	node.text = text
	node.add_theme_font_override("font", fonts()[font_key])
	node.add_theme_font_size_override("font_size", size)
	node.add_theme_color_override("font_color", color)
	if outline > 0:
		node.add_theme_constant_override("outline_size", outline)
		node.add_theme_color_override("font_outline_color", INK)
	node.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return node


static func display(text: String, size: int, color: Color = GOLD, outline: int = 10) -> Label:
	var node := label(text, size, color, "display", outline)
	node.add_theme_constant_override("shadow_offset_x", 0)
	node.add_theme_constant_override("shadow_offset_y", 5)
	node.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.45))
	return node


static func button(text: String, tooltip: String = "", accent: Color = PAPER, font_size: int = 16) -> Button:
	var node := Button.new()
	node.text = text
	node.tooltip_text = tooltip
	node.focus_mode = Control.FOCUS_ALL
	node.add_theme_font_size_override("font_size", font_size)
	style_button(node, accent)
	return node


static func panel(bg: Color = Color(0.11, 0.07, 0.12, 0.92), border: Color = PAPER) -> PanelContainer:
	var node := PanelContainer.new()
	node.add_theme_stylebox_override("panel", box(bg, border, 3, 14, 5))
	return node


static func bar(fill: Color, height: float = 10.0) -> ProgressBar:
	var node := ProgressBar.new()
	node.show_percentage = false
	node.min_value = 0.0
	node.max_value = 1.0
	node.step = 0.0
	node.custom_minimum_size = Vector2(0, height)
	var fill_style := box(fill, Color(0, 0, 0, 0), 0, 5, 0)
	fill_style.content_margin_top = 0
	fill_style.content_margin_bottom = 0
	node.add_theme_stylebox_override("fill", fill_style)
	node.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return node


static func set_bar_color(node: ProgressBar, fill: Color) -> void:
	var fill_style := box(fill, Color(0, 0, 0, 0), 0, 5, 0)
	node.add_theme_stylebox_override("fill", fill_style)


static func icon(texture: Texture2D, size: float) -> TextureRect:
	var node := TextureRect.new()
	node.texture = texture
	node.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	node.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	node.custom_minimum_size = Vector2(size, size)
	node.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return node


# ---------------------------------------------------------------- notebook textures

const TEX_BTN_MAROON := preload("res://assets/template/game/ui/btn_maroon_s.png")
const TEX_BTN_GOLD := preload("res://assets/template/game/ui/btn_gold_s.png")
const TEX_BTN_CREAM := preload("res://assets/template/game/ui/btn_cream_s.png")
const TEX_PAPER := preload("res://assets/template/game/ui/paper_panel_s.png")
const TEX_STICKY := preload("res://assets/template/game/ui/sticky_note_s.png")
const TEX_CARD := preload("res://assets/template/game/ui/card_frame_s.png")


static func tex_box(texture: Texture2D, margin: Vector2, content: Vector2, modulate: Color = Color.WHITE) -> StyleBoxTexture:
	var style := StyleBoxTexture.new()
	style.texture = texture
	style.texture_margin_left = margin.x
	style.texture_margin_right = margin.x
	style.texture_margin_top = margin.y
	style.texture_margin_bottom = margin.y
	style.content_margin_left = content.x
	style.content_margin_right = content.x
	style.content_margin_top = content.y
	style.content_margin_bottom = content.y
	style.modulate_color = modulate
	return style


static func button_texture(accent: Color) -> Texture2D:
	if accent == MAROON or accent == MAROON_DARK or accent == RED:
		return TEX_BTN_MAROON
	if accent == GOLD:
		return TEX_BTN_GOLD
	return TEX_BTN_CREAM


## Applies the sticker-pill button art for a given accent (maroon / gold / cream).
static func style_button(node: Button, accent: Color) -> void:
	var texture := button_texture(accent)
	var margin := Vector2(22, 20)
	var content := Vector2(18, 6)
	node.add_theme_stylebox_override("normal", tex_box(texture, margin, content))
	node.add_theme_stylebox_override("hover", tex_box(texture, margin, content, Color(1.12, 1.12, 1.12)))
	node.add_theme_stylebox_override("pressed", tex_box(texture, margin, content, Color(0.82, 0.82, 0.82)))
	node.add_theme_stylebox_override("hover_pressed", tex_box(texture, margin, content, Color(0.9, 0.9, 0.9)))
	node.add_theme_stylebox_override("disabled", tex_box(TEX_BTN_CREAM, margin, content, Color(0.72, 0.7, 0.68, 0.85)))
	node.add_theme_stylebox_override("focus", box(Color(0, 0, 0, 0), SKY, 3, 22, 0))
	var text_color := PAPER if texture == TEX_BTN_MAROON else INK
	for key: String in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		node.add_theme_color_override(key, text_color)
	node.add_theme_color_override("font_disabled_color", Color("7d7280"))


static func paper_style(pad: Vector2 = Vector2(18, 12)) -> StyleBoxTexture:
	return tex_box(TEX_PAPER, Vector2(30, 30), pad)


static func sticky_style(pad: Vector2 = Vector2(16, 14)) -> StyleBoxTexture:
	return tex_box(TEX_STICKY, Vector2(28, 30), pad)


static func paper(pad: Vector2 = Vector2(18, 12)) -> PanelContainer:
	var node := PanelContainer.new()
	node.add_theme_stylebox_override("panel", paper_style(pad))
	return node


static func sticky(pad: Vector2 = Vector2(16, 14)) -> PanelContainer:
	var node := PanelContainer.new()
	node.add_theme_stylebox_override("panel", sticky_style(pad))
	return node


## Handwritten-ink label for paper surfaces.
static func ink(text: String, size: int = 16, color: Color = INK, font_key: String = "black") -> Label:
	return label(text, size, color, font_key)
