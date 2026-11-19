## Space Pinball cabinet materials, drawn in code.
##
## Brass bezels, chrome rails, smoked glass, a dot-matrix score display, insert
## lamps, chase bulbs and cabinet push-buttons. Presentation only: this helper owns
## no Nodes, timers or audio. The controller passes the CanvasItem to draw on and
## sets `alpha` for entrance fades.
extends RefCounted

const BRASS_HI := Color("fbe6ab")
const BRASS := Color("d4ad65")
const BRASS_MID := Color("a27a3b")
const BRASS_LO := Color("5c4220")
const BRASS_INK := Color("2c1d0b")
const CHROME_HI := Color("f5f8fc")
const CHROME := Color("aab5c3")
const CHROME_LO := Color("3b4553")
const GLASS := Color("07101d")
const AMBER := Color("ffac3a")
const AMBER_HOT := Color("ffd88a")
const DMD_BG := Color("100804")
const CYAN := Color("73ede0")
const INK := Color("1a2336")
const CARD := Color("ecdfc2")
## DMD dot pitch in layout units; the dot textures are baked once at 2x.
const DMD_PITCH := 3.0
const DMD_TEX_SCALE := 2
const DMD_TEX_SIZE := Vector2i(560, 200)

var alpha := 1.0
var _dot_tex: ImageTexture
var _mask_tex: ImageTexture

func _a(c: Color, k := 1.0) -> Color:
	return Color(c.r, c.g, c.b, c.a*alpha*k)

## Rounded-rectangle outline (clockwise from the top-right corner).
static func rounded(rect: Rect2, radius: float, segments := 5) -> PackedVector2Array:
	var r := minf(radius, minf(rect.size.x, rect.size.y)*0.5)
	if r <= 0.5:
		return PackedVector2Array([rect.position, Vector2(rect.end.x, rect.position.y), rect.end, Vector2(rect.position.x, rect.end.y)])
	var centers := [Vector2(rect.end.x-r, rect.position.y+r), Vector2(rect.end.x-r, rect.end.y-r), Vector2(rect.position.x+r, rect.end.y-r), Vector2(rect.position.x+r, rect.position.y+r)]
	var pts := PackedVector2Array()
	for c in 4:
		for i in segments+1:
			var p: Vector2 = centers[c]+Vector2.from_angle(-PI/2+PI/2*c+PI/2*float(i)/segments)*r
			# Pills have no straight edge: skip coincident joints so triangulation stays valid.
			if pts.is_empty() or p.distance_squared_to(pts[pts.size()-1]) > 0.01: pts.append(p)
	if pts.size() > 2 and pts[0].distance_squared_to(pts[pts.size()-1]) <= 0.01: pts.remove_at(pts.size()-1)
	return pts

## Colors for `pts` sampled from gradient `stops` ([[t, Color], ...]) along `dir` across `rect`.
func _grad(pts: PackedVector2Array, rect: Rect2, stops: Array, dir := Vector2(0, 1), k := 1.0) -> PackedColorArray:
	var colors := PackedColorArray()
	var span := absf(dir.x)+absf(dir.y)
	for p in pts:
		var local := (p-rect.position)/rect.size.max(Vector2.ONE)
		var t := clampf(((local.x if dir.x >= 0 else 1.0-local.x)*absf(dir.x)+(local.y if dir.y >= 0 else 1.0-local.y)*absf(dir.y))/span, 0, 1)
		var c: Color = stops[0][1]
		for i in range(1, stops.size()):
			if t <= stops[i][0]:
				c = (stops[i-1][1] as Color).lerp(stops[i][1], (t-stops[i-1][0])/maxf(0.0001, stops[i][0]-stops[i-1][0]))
				break
			c = stops[i][1]
		colors.append(_a(c, k))
	return colors

func fill(ci: CanvasItem, rect: Rect2, radius: float, stops: Array, dir := Vector2(0, 1), k := 1.0) -> void:
	var pts := rounded(rect, radius)
	ci.draw_polygon(pts, _grad(pts, rect, stops, dir, k))

func flat(ci: CanvasItem, rect: Rect2, radius: float, color: Color) -> void:
	ci.draw_colored_polygon(rounded(rect, radius), _a(color))

func outline(ci: CanvasItem, rect: Rect2, radius: float, color: Color, width := 1.0) -> void:
	var pts := rounded(rect, radius)
	pts.append(pts[0])
	ci.draw_polyline(pts, _a(color), width, true)

static func metal(kind: String) -> Array:
	if kind == "chrome":
		return [[0.0, CHROME_HI], [0.32, CHROME], [0.62, CHROME_LO], [0.82, Color("8994a4")], [1.0, Color("c9d2dd")]]
	if kind == "dark":
		return [[0.0, Color("4c5566")], [0.5, Color("1a2130")], [1.0, Color("0b0f18")]]
	return [[0.0, BRASS_HI], [0.3, BRASS], [0.62, BRASS_LO], [0.84, BRASS_MID], [1.0, Color("e2c07e")]]

## Soft drop shadow under a panel.
func shadow(ci: CanvasItem, rect: Rect2, radius: float, depth := 6.0, layers := 3) -> void:
	for i in layers:
		flat(ci, Rect2(rect.position+Vector2(0, depth*0.6), rect.size).grow(1.5+i*(3.0 if layers > 2 else 2.0)), radius+1.5+i*3.0, Color(0, 0, 0, 0.16 if layers > 2 else 0.22))

## Machined metal frame: outer bevel, groove, rim light. Returns the inner face rect.
func bezel(ci: CanvasItem, rect: Rect2, radius := 12.0, kind := "brass", width := 6.0) -> Rect2:
	shadow(ci, rect, radius)
	var stops := metal(kind)
	fill(ci, rect, radius, stops, Vector2(0.35, 1))
	var groove := rect.grow(-width*0.45)
	fill(ci, groove, maxf(2, radius-width*0.45), stops, Vector2(-0.35, -1), 0.9)
	var face := rect.grow(-width)
	flat(ci, face.grow(1), maxf(2, radius-width+1), Color(0, 0, 0, 0.75))
	var top := rounded(rect.grow(-0.5), radius)
	var arc := PackedVector2Array()
	for p in top:
		if p.y < rect.position.y+radius+1: arc.append(p)
	if arc.size() > 1: ci.draw_polyline(arc, _a(Color(1, 1, 1, 0.55)), 1.0, true)
	return face

## Smoked glass face with an inner top shadow and a diagonal gloss.
func glass(ci: CanvasItem, rect: Rect2, radius := 6.0, tint := GLASS, gloss := 1.0) -> void:
	fill(ci, rect, radius, [[0.0, tint.lightened(0.07)], [0.55, tint], [1.0, tint.darkened(0.35)]])
	var band := Rect2(rect.position+Vector2(radius*0.5, 0), Vector2(rect.size.x-radius, minf(14, rect.size.y*0.3)))
	ci.draw_polygon(PackedVector2Array([band.position, Vector2(band.end.x, band.position.y), band.end, Vector2(band.position.x, band.end.y)]),
		PackedColorArray([_a(Color(0, 0, 0, 0.5)), _a(Color(0, 0, 0, 0.5)), _a(Color(0, 0, 0, 0)), _a(Color(0, 0, 0, 0))]))
	if gloss <= 0: return
	var g := rect.grow(-2)
	var w := g.size.x
	var h := minf(g.size.y*0.62, w*0.5)
	ci.draw_polygon(PackedVector2Array([g.position, g.position+Vector2(w*0.62, 0), g.position+Vector2(w*0.2, h), g.position+Vector2(0, h)]),
		PackedColorArray([_a(Color(1, 1, 1, 0.075*gloss)), _a(Color(1, 1, 1, 0.0)), _a(Color(1, 1, 1, 0.0)), _a(Color(1, 1, 1, 0.02*gloss))]))

func screw(ci: CanvasItem, at: Vector2, r := 3.5, angle := 0.6) -> void:
	ci.draw_circle(at+Vector2(0, 1), r+1, _a(Color(0, 0, 0, 0.55)))
	ci.draw_circle(at, r, _a(BRASS_LO))
	ci.draw_circle(at+Vector2(-0.6, -0.7), r*0.78, _a(BRASS.lightened(0.1)))
	var d := Vector2.from_angle(angle)*r*0.8
	ci.draw_line(at-d, at+d, _a(BRASS_INK), 1.2, true)

func screws(ci: CanvasItem, rect: Rect2, inset := 9.0) -> void:
	var i := 0
	for p in [rect.position+Vector2(inset, inset), Vector2(rect.end.x-inset, rect.position.y+inset), rect.end-Vector2(inset, inset), Vector2(rect.position.x+inset, rect.end.y-inset)]:
		screw(ci, p, 3.2, 0.5+i*1.1)
		i += 1

## Instrument plate: brass bezel + glass face + engraved nameplate tab on the top rail.
func plate(ci: CanvasItem, rect: Rect2, label: String, font: Font, accent := BRASS, tint := GLASS) -> Rect2:
	var face := bezel(ci, rect, 12, "brass", 5)
	glass(ci, face, 8, tint)
	if accent != BRASS:
		outline(ci, face.grow(-1), 7, Color(accent, 0.55), 1.5)
	if label != "":
		nameplate(ci, Vector2(rect.position.x+18, rect.position.y+1), label, font, 11)
	return face

## Engraved brass tag with dark inked lettering, anchored at its top-left.
func nameplate(ci: CanvasItem, at: Vector2, text: String, font: Font, size := 11, center := false) -> Rect2:
	var w := font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, size).x+18
	var h := size+10.0
	var r := Rect2(at-Vector2(w*0.5 if center else 0.0, 0), Vector2(w, h))
	flat(ci, Rect2(r.position+Vector2(0, 2), r.size), 3, Color(0, 0, 0, 0.5))
	fill(ci, r, 3, [[0.0, BRASS_HI], [0.45, BRASS], [1.0, BRASS_MID]])
	outline(ci, r, 3, Color(BRASS_INK, 0.7), 1)
	var base := r.position+Vector2(9, h*0.5+(font.get_ascent(size)-font.get_descent(size))*0.5)
	ci.draw_string(font, base+Vector2(0, 1), text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, _a(Color(1, 0.95, 0.8, 0.55)))
	ci.draw_string(font, base, text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, _a(BRASS_INK))
	return r

## Playfield insert lamp: tinted plastic disc, chrome ring, glow when lit.
func lamp(ci: CanvasItem, at: Vector2, r: float, color: Color, level: float) -> void:
	level = clampf(level, 0, 1)
	if level > 0.02:
		for i in 4: ci.draw_circle(at, r+3+i*3.5, _a(color, 0.07*level))
	ci.draw_circle(at+Vector2(0, 1.5), r+2, _a(Color(0, 0, 0, 0.6)))
	ci.draw_circle(at, r+1.6, _a(CHROME_LO))
	ci.draw_arc(at, r+1.1, PI*1.05, PI*1.95, 16, _a(CHROME_HI, 0.8), 1.0, true)
	ci.draw_circle(at, r, _a(color.darkened(0.78).lerp(color, level*0.85)))
	if level > 0.02:
		ci.draw_circle(at, r*0.62, _a(color.lerp(Color.WHITE, 0.55), level*0.9))
	ci.draw_circle(at+Vector2(-r*0.32, -r*0.36), r*0.26, _a(Color(1, 1, 1, 0.22+0.4*level)))

## Small incandescent chase bulb.
func bulb(ci: CanvasItem, at: Vector2, r: float, level: float, warm := AMBER_HOT) -> void:
	level = clampf(level, 0, 1)
	if level > 0.05:
		ci.draw_circle(at, r*3.4, _a(warm, 0.07*level))
		ci.draw_circle(at, r*2.1, _a(warm, 0.2*level))
	ci.draw_circle(at, r+0.8, _a(BRASS_INK))
	ci.draw_circle(at, r, _a(Color("3a2a16").lerp(warm, level)))
	ci.draw_circle(at+Vector2(-r*0.3, -r*0.3), r*0.4, _a(Color(1, 1, 1, 0.25+0.6*level)))

## Marquee bulbs around a rounded rect. `step` advances a three-phase chase;
## `power` (0..1) lights bulbs in sequence during the power-on entrance.
func chase(ci: CanvasItem, rect: Rect2, spacing: float, step: float, power := 1.0, still := false, r := 2.9) -> void:
	var pts := rounded(rect, 14, 6)
	pts.append(pts[0])
	var total := 0.0
	for i in range(1, pts.size()): total += pts[i].distance_to(pts[i-1])
	var n := maxi(8, int(total/spacing))
	var gap := total/n
	var seg := 0
	var walked := 0.0
	var seg_len := pts[1].distance_to(pts[0])
	for b in n:
		var target := b*gap
		while walked+seg_len < target and seg < pts.size()-2:
			walked += seg_len
			seg += 1
			seg_len = pts[seg+1].distance_to(pts[seg])
		var p := pts[seg].lerp(pts[seg+1], (target-walked)/maxf(0.001, seg_len))
		var lit := 0.85 if still else (1.0 if (b+int(step))%3 == 0 else 0.28)
		if float(b)/n > power: lit = 0.0
		bulb(ci, p, r, lit)

## Chrome tube rail between two points (side rails, lockdown bar).
func rail(ci: CanvasItem, a: Vector2, b: Vector2, width: float) -> void:
	var n := (b-a).orthogonal().normalized()
	ci.draw_line(a+Vector2(0, 3), b+Vector2(0, 3), _a(Color(0, 0, 0, 0.55)), width+4, true)
	var layers := [[1.0, CHROME_LO], [0.8, Color("6f7a8a")], [0.55, CHROME], [0.28, CHROME_HI]]
	for l in layers:
		ci.draw_line(a-n*width*(1.0-l[0])*0.25, b-n*width*(1.0-l[0])*0.25, _a(l[1]), width*l[0], true)

## Dot-matrix display. Call dmd_begin, draw text with dmd_text, then dmd_end.
func dmd_begin(ci: CanvasItem, rect: Rect2) -> Rect2:
	var inner := bezel(ci, rect, 12, "brass", 5)
	var face := inner.grow(-3)
	fill(ci, inner, 8, metal("dark"), Vector2(0, 1))
	flat(ci, face, 6, DMD_BG)
	_ensure_dmd()
	var src := Rect2(Vector2.ZERO, face.size*DMD_TEX_SCALE)
	ci.draw_texture_rect_region(_dot_tex, face, src, _a(Color(AMBER, 0.10)))
	return face

func dmd_text(ci: CanvasItem, font: Font, at: Vector2, text: String, size: int, color := AMBER, center := false, glow := 1.0) -> void:
	if center: at.x -= font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, size).x*0.5
	if glow > 0:
		for o in [Vector2(-2, 0), Vector2(2, 0), Vector2(0, -2), Vector2(0, 2)]:
			ci.draw_string(font, at+o, text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, _a(color, 0.16*glow))
	ci.draw_string(font, at, text, HORIZONTAL_ALIGNMENT_LEFT, -1, size, _a(color))

func dmd_end(ci: CanvasItem, face: Rect2) -> void:
	var src := Rect2(Vector2.ZERO, face.size*DMD_TEX_SCALE)
	ci.draw_texture_rect_region(_mask_tex, face, src, _a(DMD_BG, 0.92))
	glass(ci, face, 6, Color(0, 0, 0, 0), 0.8)

func _ensure_dmd() -> void:
	if _dot_tex != null: return
	var pitch := int(DMD_PITCH*DMD_TEX_SCALE)
	var cell_dot := Image.create(pitch, pitch, false, Image.FORMAT_LA8)
	var cell_mask := Image.create(pitch, pitch, false, Image.FORMAT_LA8)
	var radius := pitch*0.36
	for y in pitch:
		for x in pitch:
			var d := Vector2(x+0.5, y+0.5).distance_to(Vector2(pitch, pitch)*0.5)
			var dot := clampf(radius+0.7-d, 0, 1)
			cell_dot.set_pixel(x, y, Color(1, 1, 1, dot))
			cell_mask.set_pixel(x, y, Color(1, 1, 1, 1.0-dot))
	var size := DMD_TEX_SIZE*DMD_TEX_SCALE
	var images := []
	for cell in [cell_dot, cell_mask]:
		var row := Image.create(size.x, pitch, false, Image.FORMAT_LA8)
		for x in range(0, size.x, pitch): row.blit_rect(cell, Rect2i(0, 0, pitch, pitch), Vector2i(x, 0))
		var full := Image.create(size.x, size.y, false, Image.FORMAT_LA8)
		for y in range(0, size.y, pitch): full.blit_rect(row, Rect2i(0, 0, size.x, pitch), Vector2i(0, y))
		images.append(full)
	_dot_tex = ImageTexture.create_from_image(images[0])
	_mask_tex = ImageTexture.create_from_image(images[1])

## Cabinet push-button. kind: primary (lit amber dome), secondary (smoked dome),
## small (brass toggle), flipper (cyan flipper button), plunger.
## `hover`, `press`, `focus` are 0..1 animated levels; `blink` pulses attract lamps.
func button(ci: CanvasItem, rect: Rect2, kind: String, hover: float, press: float, focus: float, time: float, blink := 0.0, lit := 0.0) -> void:
	var radius := rect.size.y*0.5 if kind in ["primary", "flipper", "plunger"] else (7.0 if kind == "small" else 10.0)
	var ring := 3.0 if kind == "small" else 4.0
	if focus > 0.01:
		var pulse := 0.7+0.3*sin(time*6.0)
		for i in 3: outline(ci, rect.grow(3.0+i*2.5), radius+3.0+i*2.5, Color(CYAN, (0.42-i*0.12)*focus*pulse), 2.0)
	shadow(ci, rect, radius, 4, 2)
	fill(ci, rect, radius, metal("brass" if kind in ["small", "secondary"] else "chrome"), Vector2(0.3, 1))
	var dome := rect.grow(-ring)
	dome.position.y += press*1.5
	var dr := maxf(2, radius-ring)
	flat(ci, dome.grow(1), dr+1, Color(0, 0, 0, 0.7))
	var glow := clampf(maxf(maxf(hover, lit), blink), 0, 1)
	match kind:
		"primary":
			var hot := 0.55+0.45*glow
			fill(ci, dome, dr, [[0.0, Color("ffe2a0").lerp(Color("fff2cf"), hot-0.55)], [0.45, Color("f0a83a").lerp(Color("ffc15a"), glow)], [1.0, Color("8a4b0e").lerp(Color("b86a18"), glow)]])
			if glow > 0.02:
				for i in 3: outline(ci, rect.grow(2.0+i*3.0), radius+2+i*3, Color(AMBER, 0.14*glow), 3.0)
		"flipper":
			fill(ci, dome, dr, [[0.0, Color("baf7ee").lerp(Color.WHITE, glow*0.4)], [0.5, Color("2a8d8a").lerp(CYAN, glow*0.7)], [1.0, Color("0c3036").lerp(Color("1a6763"), glow)]])
			if glow > 0.02:
				for i in 3: outline(ci, rect.grow(2.0+i*3.0), radius+2+i*3, Color(CYAN, 0.16*glow), 3.0)
		"plunger":
			fill(ci, dome, dr, [[0.0, Color("fbe6ab")], [0.5, Color("c7954a").lerp(Color("f0b55a"), glow)], [1.0, Color("4e3314")]])
		"small":
			fill(ci, dome, dr, [[0.0, Color("2a3a50").lerp(Color("35506a"), glow)], [1.0, Color("0b1320")]])
		_:
			fill(ci, dome, dr, [[0.0, Color("2c3e55").lerp(Color("3d5f78"), glow)], [0.5, Color("13223a").lerp(Color("1b3a4e"), glow)], [1.0, Color("070d18")]])
			if glow > 0.02: outline(ci, dome.grow(-1.5), dr-1.5, Color(CYAN, 0.55*glow), 1.5)
	# Specular dome highlight.
	var spec := Rect2(dome.position+Vector2(dr*0.55, 2.5), Vector2(dome.size.x-dr*1.1, dome.size.y*0.36))
	var sp := rounded(spec, spec.size.y*0.5)
	ci.draw_polygon(sp, _grad(sp, spec, [[0.0, Color(1, 1, 1, 0.36 if kind in ["primary", "plunger", "flipper"] else 0.16)], [1.0, Color(1, 1, 1, 0.0)]]))
	if focus > 0.01 and kind != "small":
		# Selection cursor: cyan chevrons slide in and breathe on both sides.
		var gap := 7.0+(1.0-focus)*12.0+1.5*sin(time*6.0)
		var cy := rect.get_center().y
		for side in [-1.0, 1.0]:
			var tip := Vector2(rect.position.x-gap if side < 0 else rect.end.x+gap, cy)
			var pts := PackedVector2Array([tip+Vector2(side*9.0, -8), tip, tip+Vector2(side*9.0, 8), tip+Vector2(side*4.5, 0)])
			ci.draw_colored_polygon(pts, _a(CYAN, focus))
