extends Node2D

const BrowserBgmPlayer = preload("res://scripts/manus/browser_bgm_player.gd")

const BG_FAR = preload("res://assets/template/star_graveyard.webp")
const BG_MID = preload("res://assets/template/star_graveyard_mid.webp")
const BG_NEAR = preload("res://assets/template/star_graveyard_near.webp")
const DOG_SHIP = preload("res://assets/template/dog_ship.webp")
const AI_DRONE = preload("res://assets/template/ai_drone.webp")
const AI_BOSS = preload("res://assets/template/ai_mothership.webp")
const ELITE_BARRAGE = preload("res://assets/template/elite_boss_barrage.webp")
const ELITE_LASER = preload("res://assets/template/elite_boss_laser.webp")
const ELITE_GEOMETRY = preload("res://assets/template/elite_boss_geometry.webp")
const UI_FONT = preload("res://assets/template/fonts/ui_regular.tres")
const MEDIUM_FONT = preload("res://assets/template/fonts/ui_medium.tres")
const BOLD_FONT = preload("res://assets/template/fonts/ui_bold.tres")
const TITLE_FONT = preload("res://assets/template/fonts/display/display_title.tres")
const DISPLAY_FONT = preload("res://assets/template/fonts/display/display_bold.tres")
const BGM = preload("res://assets/template/audio/stargrave_battle.ogg")
const SFX_SHOOT = preload("res://assets/template/audio/shoot.ogg")
const SFX_HIT = preload("res://assets/template/audio/hit.ogg")
const SFX_EXPLOSION = preload("res://assets/template/audio/explosion.ogg")
const TUNING_DEFAULTS = preload("res://scripts/tuning_defaults.gd")
const W := 1280.0
const H := 720.0
const PLAYER_HIT_RADIUS := 7.0
const MAX_WEAPON_LEVEL := 3
const SEGMENT_DURATIONS := [24.0, 26.0, 28.0]
const WAVES_PER_SEGMENT := 5
const BOSS_NAMES := ["boss.name.gravecrow", "boss.name.redline", "boss.name.entropy", "boss.name.gravekeeper"]
const BOSS_SKILLS := ["boss.skill.fan", "boss.skill.laser", "boss.skill.geometry", "boss.skill.final"]
const BOSS_HEALTH := [95.0, 150.0, 220.0, 420.0]
const BOSS_SCALES := [0.48, 0.56, 0.52, 0.68]
const FORMATION_NAMES := ["Line", "V", "W"]
const TUNING_PATH := "user://stargrave_tuning.cfg"
const TWEAK_COUNT := 12
const HoloUI = preload("res://scripts/holo_ui.gd")
const PAUSE_RESUME_RECT := Rect2(485, 375, 310, 42)
const PAUSE_MENU_RECT := Rect2(485, 427, 310, 42)
const WARNING_DURATION := 2.6
const WARP_IN := 0.8

enum Phase { INTRO, PLAYING, BOSS, TRANSITION, VICTORY, DEFEAT, PAUSED }

var phase: Phase = Phase.INTRO
var _tracked_fonts: Dictionary = {}
var previous_phase: Phase = Phase.PLAYING
var far_sprites: Array = []
var mid_sprites: Array = []
var near_sprites: Array = []
var far_offset := 0.0
var mid_offset := 0.0
var near_offset := 0.0
var player_sprite: Sprite2D
var boss_sprite: Sprite2D
var audio_paused := false
var audio_pause_writes := 0
var bgm_player: BrowserBgmPlayer
var shoot_sfx: AudioStreamPlayer
var hit_sfx: AudioStreamPlayer
var explosion_sfx: AudioStreamPlayer
var player_pos := Vector2(190, 360)
var player_hp := 5
var player_max_hp := 5
var invulnerable := 0.0
var score := 0
var best_score := 0
var weapon_level := 0
var weapon_upgrade_timer := 0.0
var weapon_upgrade_duration := 1.4
var weapon_upgrade_is_max := false
var combo := 0
var combo_timer := 0.0
var energy := 35.0
var elapsed := 0.0
var segment_elapsed := 0.0
var wave_segment := 0
var wave_number := 1
var last_wave_announced := 0
var formation_cursor := 0
var current_formation := "Line"
var intro_timer := 2.7
var transition_timer := 0.0
var spawn_timer := 0.8
var fire_timer := 0.0
var boss_fire_timer := 1.4
var boss_special_timer := 99.0
var boss_laser_warning := 0.0
var boss_laser_active := 0.0
var boss_laser_start := Vector2.ZERO
var boss_laser_end := Vector2.ZERO
var boss_pattern_index := 0
var boss_tier := 0
var boss_hp := 120.0
var boss_max_hp := 120.0
var boss_pos := Vector2(1450, 360)
var laser_timer := 0.0
var shield_timer := 0.0
var shield_hits := 0
var shake := 0.0
var flash := 0.0
var dialogue_key := ""
var dialogue_values: Dictionary = {}
var dialogue: String:
	get:
		return I18n.t(dialogue_key, dialogue_values) if not dialogue_key.is_empty() else ""
var dialogue_timer := 0.0
var bullets: Array = []
var enemy_bullets: Array = []
var enemies: Array = []
var particles: Array = []
var pickups: Array = []
var stars: Array = []
var debris: Array = []
var touch_id := -1
var touch_origin := Vector2.ZERO
var touch_move := Vector2.ZERO
var touch_seen := false
var tuning_player_speed: float:
	get:
		return TuningStore.active_value("player_speed")
var tuning_fire_delay: float:
	get:
		return TuningStore.active_value("fire_delay")
var tuning_enemy_count: float:
	get:
		return TuningStore.active_value("enemy_count")
var tuning_enemy_health: float:
	get:
		return TuningStore.active_value("enemy_health")
var tuning_enemy_speed: float:
	get:
		return TuningStore.active_value("enemy_speed")
var tuning_enemy_bullet_speed: float:
	get:
		return TuningStore.active_value("enemy_bullet_speed")
var tuning_boss_health: float:
	get:
		return TuningStore.active_value("boss_health")
var tuning_hit_radius: float:
	get:
		return TuningStore.active_value("hit_radius")
var tuning_energy_rate: float:
	get:
		return TuningStore.active_value("energy_rate")
var tuning_bone_drop: float:
	get:
		return TuningStore.active_value("bone_drop")
var tuning_bgm_volume_db: float:
	get:
		return TuningStore.active_value("bgm_volume_db")
var tuning_sfx_volume_db: float:
	get:
		return TuningStore.active_value("sfx_volume_db")
var rng := RandomNumberGenerator.new()
# Presentation-only state (HUD juice, overlays, transitions); never read by the simulation.
var _age := 0.0
var _overlay_phase: int = -1
var _overlay_age := 0.0
var _last_phase: Phase = Phase.INTRO
var _warning_t := 0.0
var _dlg_age := 0.0
var _shown_score := 0.0
var _last_score := 0
var _score_punch := 0.0
var _last_hp := 5
var _hp_flash := 0.0
var _last_combo := 0
var _combo_pop := 0.0
var _best_at_start := 0
var _pause_cursor := 0
var _cursor_y := 0.0

func _ready() -> void:
	I18n.locale_changed.connect(func(_locale: String): queue_redraw())
	rng.seed = 817263
	_load_score()
	_best_at_start = best_score
	TuningStore.begin_run()
	TuningStore.value_changed.connect(_on_tuning_changed)
	_make_scene_art()
	HoloUI.add_crt_overlay(self, Vector2(W, H), -1, 0.42)
	_make_audio()
	for i in range(72):
		stars.append(Vector3(rng.randf_range(0, W), rng.randf_range(0, H), rng.randf_range(0.5, 2.6)))
	for i in range(16):
		debris.append({"pos": Vector2(rng.randf_range(0, W), rng.randf_range(50, H - 50)), "speed": rng.randf_range(30, 95), "size": rng.randf_range(2, 8), "spin": rng.randf_range(-2, 2), "angle": rng.randf_range(0, TAU)})
	_show_dialogue("dialogue.intro", 4.8)
	set_process(true)
	set_process_unhandled_input(true)
	queue_redraw()

func _make_audio() -> void:
	bgm_player = BrowserBgmPlayer.new()
	bgm_player.playback_type = AudioServer.PLAYBACK_TYPE_STREAM
	var loop_stream: AudioStreamOggVorbis = BGM.duplicate()
	loop_stream.loop = true
	bgm_player.stream = loop_stream
	bgm_player.buffer_key = BGM.resource_path
	bgm_player.volume_db = tuning_bgm_volume_db
	add_child(bgm_player)
	bgm_player.play()
	shoot_sfx = AudioStreamPlayer.new()
	shoot_sfx.stream = SFX_SHOOT
	shoot_sfx.volume_db = -17.0 + tuning_sfx_volume_db
	add_child(shoot_sfx)
	hit_sfx = AudioStreamPlayer.new()
	hit_sfx.stream = SFX_HIT
	hit_sfx.volume_db = -5.0 + tuning_sfx_volume_db
	add_child(hit_sfx)
	explosion_sfx = AudioStreamPlayer.new()
	explosion_sfx.stream = SFX_EXPLOSION
	explosion_sfx.volume_db = -7.0 + tuning_sfx_volume_db
	add_child(explosion_sfx)

func _play_shoot_sfx() -> void:
	shoot_sfx.pitch_scale = rng.randf_range(0.97, 1.04)
	shoot_sfx.play()

func _play_hit_sfx() -> void:
	hit_sfx.pitch_scale = rng.randf_range(0.94, 1.02)
	hit_sfx.play()

func _play_explosion_sfx(pitch: float = 1.0) -> void:
	explosion_sfx.pitch_scale = pitch
	explosion_sfx.play()

func _make_scene_art() -> void:
	_create_scrolling_layer(BG_FAR, far_sprites, -100, Color(0.76, 0.74, 0.84))
	_create_scrolling_layer(BG_MID, mid_sprites, -90, Color(0.62, 0.62, 0.76, 0.72))
	_create_scrolling_layer(BG_NEAR, near_sprites, -10, Color(0.62, 0.60, 0.72, 0.70))
	player_sprite = Sprite2D.new()
	player_sprite.texture = DOG_SHIP
	player_sprite.scale = Vector2(0.215, 0.215)
	player_sprite.position = player_pos
	player_sprite.z_index = -1
	add_child(player_sprite)
	boss_sprite = Sprite2D.new()
	boss_sprite.texture = ELITE_BARRAGE
	boss_sprite.scale = Vector2(BOSS_SCALES[0], BOSS_SCALES[0])
	boss_sprite.position = boss_pos
	boss_sprite.z_index = -2
	boss_sprite.visible = false
	add_child(boss_sprite)

func _create_scrolling_layer(texture: Texture2D, target: Array, z: int, tint: Color) -> void:
	for i in range(2):
		var sprite := Sprite2D.new()
		sprite.texture = texture
		sprite.position = Vector2(W * 0.5 + i * W, H * 0.5)
		sprite.z_index = z
		sprite.modulate = tint
		add_child(sprite)
		target.append(sprite)

func _process(delta: float) -> void:
	_sync_audio_pause()
	_update_presentation(minf(delta, 0.05))
	if phase == Phase.PAUSED:
		queue_redraw()
		return
	var dt: float = minf(delta, 0.04)
	_update_ambient(dt)
	if dialogue_timer > 0:
		dialogue_timer -= dt
	if invulnerable > 0:
		invulnerable -= dt
	if flash > 0:
		flash -= dt
	if weapon_upgrade_timer > 0:
		weapon_upgrade_timer = maxf(0.0, weapon_upgrade_timer - dt)
	if combo_timer > 0:
		combo_timer -= dt
	else:
		combo = 0
	if phase == Phase.INTRO:
		intro_timer -= dt
		if intro_timer <= 0:
			phase = Phase.PLAYING
	elif phase == Phase.PLAYING or phase == Phase.BOSS:
		_update_player(dt)
		_update_projectiles(dt)
		_update_enemies(dt)
		_update_pickups(dt)
		_update_particles(dt)
		_update_abilities(dt)
		elapsed += dt
		energy = minf(100.0, energy + dt * tuning_energy_rate)
		if phase == Phase.PLAYING:
			segment_elapsed += dt
			_update_waves(dt)
			if segment_elapsed >= float(SEGMENT_DURATIONS[wave_segment]):
				_start_boss(wave_segment)
		else:
			_update_boss(dt)
	elif phase == Phase.TRANSITION:
		transition_timer -= dt
		_update_projectiles(dt)
		_update_particles(dt)
		_update_abilities(dt)
		if transition_timer <= 0:
			_start_boss(3)
	else:
		_update_particles(dt)
	player_sprite.position = player_pos + Vector2(0, sin(elapsed * 5.0) * 1.2)
	player_sprite.modulate = Color(1, 1, 1, 0.34 if invulnerable > 0 and int(invulnerable * 12.0) % 2 == 0 else 1.0)
	if shake > 0:
		shake = maxf(0.0, shake - dt * 22.0)
		position = Vector2(rng.randf_range(-shake, shake), rng.randf_range(-shake, shake))
	else:
		position = Vector2.ZERO
	queue_redraw()

func _update_player(dt: float) -> void:
	var move := Vector2.ZERO
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP): move.y -= 1
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN): move.y += 1
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT): move.x -= 1
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT): move.x += 1
	if touch_move.length() > 0.05:
		move = touch_move
	if move.length() > 1:
		move = move.normalized()
	player_pos += move * tuning_player_speed * dt
	player_pos.x = clampf(player_pos.x, 60.0, 820.0)
	player_pos.y = clampf(player_pos.y, 90.0, 630.0)
	fire_timer -= dt
	if fire_timer <= 0:
		shoot_player()

func shoot_player() -> void:
	TuningStore.apply_boundary("NEXT_ATTACK", ["fire_delay"])
	fire_timer = tuning_fire_delay
	var maxed := weapon_level >= MAX_WEAPON_LEVEL
	for group in range(weapon_level + 1):
		var spread: float = float(group) * 0.055
		var origin_x: float = 45.0 - float(group) * 2.0
		bullets.append({"pos": player_pos + Vector2(origin_x, -6 - group * 2), "vel": Vector2(720, 0).rotated(-spread), "life": 1.9, "damage": 1, "maxed": maxed, "wing": -1})
		bullets.append({"pos": player_pos + Vector2(origin_x, 6 + group * 2), "vel": Vector2(720, 0).rotated(spread), "life": 1.9, "damage": 1, "maxed": maxed, "wing": 1})
	_play_shoot_sfx()
	for j in range(2):
		particles.append({"pos": player_pos + Vector2(-40, rng.randf_range(-7, 7)), "vel": Vector2(rng.randf_range(-150, -75), rng.randf_range(-10, 10)), "life": 0.22, "max": 0.22, "color": Color(0.2, 0.95, 1.0), "size": rng.randf_range(1.5, 3.5)})

func _activate_laser() -> void:
	if energy < 100.0 or laser_timer > 0 or phase not in [Phase.PLAYING, Phase.BOSS]:
		return
	energy = 0.0
	laser_timer = 5.0
	_show_dialogue("dialogue.laser_ready", 2.8)
	shake = 8.0

func _activate_shield() -> void:
	if energy < 100.0 or shield_hits > 0 or phase not in [Phase.PLAYING, Phase.BOSS]:
		return
	energy = 0.0
	shield_timer = 60.0
	shield_hits = 3
	_show_dialogue("dialogue.shield_ready", 2.8)
	for i in range(32):
		var a := TAU * float(i) / 32.0
		particles.append({"pos": player_pos + Vector2.from_angle(a) * 50.0, "vel": Vector2.from_angle(a) * 45.0, "life": 0.55, "max": 0.55, "color": Color(0.22, 0.94, 1.0), "size": 3.5})

func _update_abilities(dt: float) -> void:
	if shield_timer > 0:
		shield_timer = maxf(0.0, shield_timer - dt)
		if shield_timer <= 0:
			shield_hits = 0
	if laser_timer <= 0:
		return
	laser_timer = maxf(0.0, laser_timer - dt)
	for i in range(enemy_bullets.size() - 1, -1, -1):
		var hostile: Dictionary = enemy_bullets[i]
		if float(hostile.pos.x) >= player_pos.x and absf(float(hostile.pos.y) - player_pos.y) < 118.0:
			_spawn_hit(hostile.pos, Color(0.30, 0.96, 1.0))
			enemy_bullets.remove_at(i)
	for i in range(enemies.size() - 1, -1, -1):
		var e: Dictionary = enemies[i]
		if float(e.pos.x) > player_pos.x and absf(float(e.pos.y) - player_pos.y) < 108.0:
			e.hp = float(e.hp) - 18.0 * dt
			enemies[i] = e
			if float(e.hp) <= 0:
				_destroy_enemy(i, true)
	if phase == Phase.BOSS and boss_pos.x < W + 80 and absf(boss_pos.y - player_pos.y) < 180.0:
		boss_hp -= 34.0 * dt
		if boss_hp <= 0:
			_boss_defeated()

func _update_waves(dt: float) -> void:
	var wave_interval: float = float(SEGMENT_DURATIONS[wave_segment]) / float(WAVES_PER_SEGMENT)
	wave_number = mini(WAVES_PER_SEGMENT, 1 + int(segment_elapsed / wave_interval))
	if wave_number != last_wave_announced:
		last_wave_announced = wave_number
		_queue_formation(formation_cursor)
		formation_cursor += 1
		_show_dialogue("dialogue.wave", 2.8, {"wave": wave_number, "formation": I18n.t("formation." + current_formation)})

func _queue_formation(formation_id: int) -> void:
	TuningStore.apply_boundary("NEXT_WAVE")
	var shape := formation_id % 3
	current_formation = FORMATION_NAMES[shape]
	var kind := (wave_number + wave_segment + shape) % 3
	var centers := [220.0, 360.0, 500.0, 285.0, 440.0, 330.0]
	var center_y: float = float(centers[(wave_number - 1 + wave_segment * 2) % centers.size()])
	var base_count := (6 + wave_segment) * 2
	var count := clampi(roundi(float(base_count) * tuning_enemy_count), 6, 28)
	if shape == 0:
		center_y = 360.0
		for i in range(count):
			spawn_enemy_at(kind, Vector2(W + 70 + i * 62, center_y), 0.0, shape, i)
	elif shape == 1:
		var midpoint: float = float(count - 1) * 0.5
		for i in range(count):
			var arm: float = float(i) - midpoint
			spawn_enemy_at(kind, Vector2(W + 80 + absf(arm) * 54.0, center_y + arm * 60.0), 0.0, shape, i)
	else:
		for i in range(count):
			var ratio: float = float(i) / maxf(1.0, float(count - 1))
			var w_offset: float = -cos(ratio * TAU * 2.0) * 68.0
			spawn_enemy_at(kind, Vector2(W + 80 + i * 60, center_y + w_offset), 0.0, shape, i)

func spawn_enemy(force_type: int = -1, y_offset: float = 0.0) -> void:
	var kind := force_type if force_type >= 0 else rng.randi_range(0, 2)
	var y: float = clampf(rng.randf_range(105, 610) + y_offset, 95.0, 620.0)
	spawn_enemy_at(kind, Vector2(W + 100 + y_offset, y), rng.randf_range(0, 5))

func spawn_enemy_at(kind: int, spawn_pos: Vector2, start_age: float = 0.0, formation_shape: int = -1, formation_slot: int = 0) -> void:
	TuningStore.apply_boundary("NEXT_SPAWN")
	var node := Sprite2D.new()
	node.texture = AI_DRONE
	node.z_index = -2
	var scale_value: float = float([0.17, 0.21, 0.15][kind])
	node.scale = Vector2(scale_value, scale_value)
	if kind == 2:
		node.modulate = Color(0.77, 0.72, 1.0)
	add_child(node)
	var clamped_pos := Vector2(spawn_pos.x, clampf(spawn_pos.y, 95.0, 620.0))
	var initial_fire: float = 1.1 + float(kind) * 0.28
	if formation_shape == 0:
		initial_fire = 0.72 + float(formation_slot) * 0.19
	var enemy_hp: float = float([3, 7, 2][kind]) * tuning_enemy_health
	var e: Dictionary = {"node": node, "pos": clamped_pos, "base_y": clamped_pos.y, "base_speed": float([205.0, 145.0, 270.0][kind]), "hp": enemy_hp, "max_hp": enemy_hp, "kind": kind, "age": start_age, "fire": initial_fire, "radius": [27.0, 35.0, 23.0][kind], "formation": formation_shape, "slot": formation_slot}
	node.position = e.pos
	enemies.append(e)

func _update_enemies(dt: float) -> void:
	for i in range(enemies.size() - 1, -1, -1):
		var e: Dictionary = enemies[i]
		e.age = float(e.age) + dt
		e.fire = float(e.fire) - dt
		e.pos.x = float(e.pos.x) - float(e.base_speed) * tuning_enemy_speed * dt
		if int(e.formation) == 0:
			e.pos.y = float(e.base_y) + sin(float(e.age) * 1.35) * 185.0
		elif int(e.kind) == 0:
			e.pos.y = float(e.base_y) + sin(float(e.age) * 3.1) * 48.0
		elif int(e.kind) == 1:
			e.pos.y = float(e.base_y) + sin(float(e.age) * 1.7) * 26.0
		else:
			e.pos.y = float(e.pos.y) + sin(float(e.age) * 7.0) * 2.8
		if int(e.kind) == 1 and float(e.fire) <= 0 and float(e.pos.x) < 1110:
			_enemy_aimed_shot(e.pos, 285.0)
			e.fire = 1.90 if int(e.formation) == 0 else 1.65
		e.node.position = e.pos
		e.node.rotation = sin(float(e.age) * 2.0) * 0.035
		enemies[i] = e
		if float(e.pos.x) < -120:
			e.node.queue_free()
			enemies.remove_at(i)
			continue
		if e.pos.distance_to(player_pos) < float(e.radius) + tuning_hit_radius and invulnerable <= 0:
			_damage_player()
			_destroy_enemy(i, false)
	_check_player_bullets()
	_check_enemy_bullets()

func _update_projectiles(dt: float) -> void:
	for i in range(bullets.size() - 1, -1, -1):
		bullets[i].pos += bullets[i].vel * dt
		bullets[i].life -= dt
		if bullets[i].life <= 0 or bullets[i].pos.x > W + 80:
			bullets.remove_at(i)
	for i in range(enemy_bullets.size() - 1, -1, -1):
		var hostile: Dictionary = enemy_bullets[i]
		var hostile_velocity: Vector2 = hostile.vel
		if absf(float(hostile.get("curve", 0.0))) > 0.001:
			hostile_velocity = hostile_velocity.rotated(float(hostile.curve) * dt)
		hostile.vel = hostile_velocity
		hostile.pos += hostile_velocity * dt
		hostile.life = float(hostile.life) - dt
		enemy_bullets[i] = hostile
		if float(hostile.life) <= 0 or float(hostile.pos.x) < -40 or float(hostile.pos.y) < -40 or float(hostile.pos.y) > H + 40:
			enemy_bullets.remove_at(i)

func _check_player_bullets() -> void:
	for bi in range(bullets.size() - 1, -1, -1):
		if bi >= bullets.size(): continue
		var hit := false
		var b: Dictionary = bullets[bi]
		if phase == Phase.BOSS and b.pos.distance_to(boss_pos) < _boss_collision_radius() and boss_pos.x < W + 60:
			boss_hp -= float(b.damage)
			hit = true
			_spawn_hit(b.pos, Color(1.0, 0.24, 0.17))
			if boss_hp <= 0:
				_boss_defeated()
		for ei in range(enemies.size() - 1, -1, -1):
			if hit or ei >= enemies.size(): break
			var e: Dictionary = enemies[ei]
			if b.pos.distance_to(e.pos) < float(e.radius):
				e.hp = float(e.hp) - float(b.damage)
				enemies[ei] = e
				hit = true
				_spawn_hit(b.pos, Color(1.0, 0.35, 0.2))
				if float(e.hp) <= 0:
					_destroy_enemy(ei, true)
		if hit and bi < bullets.size():
			bullets.remove_at(bi)

func _check_enemy_bullets() -> void:
	if invulnerable > 0:
		return
	for i in range(enemy_bullets.size() - 1, -1, -1):
		if enemy_bullets[i].pos.distance_to(player_pos) < tuning_hit_radius + 2.0:
			enemy_bullets.remove_at(i)
			_damage_player()
			break

func _destroy_enemy(index: int, reward: bool) -> void:
	if index < 0 or index >= enemies.size(): return
	var e: Dictionary = enemies[index]
	_explode(e.pos, Color(1.0, 0.22, 0.12), 12)
	_play_explosion_sfx(rng.randf_range(1.08, 1.24))
	if reward:
		combo += 1
		combo_timer = 2.3
		var gained: int = int((100 + int(e.kind) * 55) * maxi(1, mini(combo, 8)))
		score += gained
		energy = minf(100.0, energy + 5.0 + float(e.kind) * 2.0)
		if rng.randf() < tuning_bone_drop:
			_spawn_bone(e.pos)
	e.node.queue_free()
	enemies.remove_at(index)

func _damage_player() -> void:
	if invulnerable > 0 or phase not in [Phase.PLAYING, Phase.BOSS]: return
	if shield_timer > 0 and shield_hits > 0:
		_play_hit_sfx()
		shield_hits -= 1
		invulnerable = 0.48
		shake = 5.0
		_explode(player_pos, Color(0.18, 0.96, 1.0), 18)
		if shield_hits <= 0:
			shield_timer = 0.0
			_show_dialogue("dialogue.shield_empty", 2.5)
		else:
			_show_dialogue("dialogue.shield_hit", 2.0, {"hits": shield_hits})
		return
	player_hp -= 1
	_play_hit_sfx()
	invulnerable = 1.25
	combo = 0
	shake = 11.0
	flash = 0.18
	_explode(player_pos, Color(0.22, 0.92, 1.0), 18)
	_show_dialogue(["dialogue.hurt1", "dialogue.hurt2", "dialogue.hurt3"].pick_random(), 2.2)
	if player_hp <= 0:
		_defeat()

func _start_boss(tier: int = -1) -> void:
	TuningStore.apply_boundary("NEXT_BOSS")
	if tier < 0:
		tier = wave_segment
	boss_tier = clampi(tier, 0, 3)
	phase = Phase.BOSS
	boss_sprite.visible = true
	boss_pos = Vector2(1480, 360)
	boss_max_hp = float(BOSS_HEALTH[boss_tier]) * tuning_boss_health
	boss_hp = boss_max_hp
	boss_sprite.texture = [ELITE_BARRAGE, ELITE_LASER, ELITE_GEOMETRY, AI_BOSS][boss_tier]
	var scale_value: float = float(BOSS_SCALES[boss_tier])
	boss_sprite.scale = Vector2(scale_value, scale_value)
	boss_sprite.modulate = Color.WHITE
	boss_fire_timer = [1.15, 1.05, 1.0, 0.88][boss_tier]
	boss_special_timer = [99.0, 2.6, 99.0, 2.4][boss_tier]
	boss_laser_warning = 0.0
	boss_laser_active = 0.0
	boss_pattern_index = 0
	for e in enemies:
		e.node.queue_free()
	enemies.clear()
	enemy_bullets.clear()
	_show_dialogue("dialogue.boss", 4.5, {"boss": I18n.t(BOSS_NAMES[boss_tier]), "skill": I18n.t(BOSS_SKILLS[boss_tier])})
	shake = 8.0

func _update_boss(dt: float) -> void:
	var target_x: float = float([1090.0, 1060.0, 1065.0, 1025.0][boss_tier])
	if boss_pos.x > target_x:
		boss_pos.x = move_toward(boss_pos.x, target_x, 110.0 * dt)
	elif boss_laser_warning <= 0.0 and boss_laser_active <= 0.0:
		var amplitude: float = float([95.0, 120.0, 132.0, 175.0][boss_tier])
		var frequency: float = float([0.88, 1.0, 1.12, 1.20][boss_tier])
		boss_pos.y = 360.0 + sin(elapsed * frequency) * amplitude
	boss_sprite.position = boss_pos
	boss_sprite.rotation = elapsed * 0.16 if boss_tier == 2 else sin(elapsed * 0.7) * 0.012
	boss_fire_timer -= dt
	boss_special_timer -= dt
	if boss_pos.x <= target_x + 30 and boss_fire_timer <= 0:
		_boss_volley()
		boss_fire_timer = [1.28, 1.18, 1.32, 1.02][boss_tier]
	if boss_tier in [1, 3] and boss_pos.x <= target_x + 30 and boss_special_timer <= 0.0 and boss_laser_warning <= 0.0 and boss_laser_active <= 0.0:
		_start_boss_laser()
		boss_special_timer = 5.6 if boss_tier == 1 else 4.9
	_update_boss_laser(dt)
	if boss_pos.distance_to(player_pos) < _boss_collision_radius() + tuning_hit_radius and invulnerable <= 0:
		_damage_player()

func _boss_collision_radius() -> float:
	return [88.0, 104.0, 96.0, 150.0][boss_tier]

func _boss_volley() -> void:
	TuningStore.apply_boundary("NEXT_ATTACK", ["enemy_bullet_speed"])
	var muzzle_offset: float = float([125.0, 170.0, 112.0, 180.0][boss_tier])
	var origin := boss_pos + Vector2(-muzzle_offset, 0)
	var base := (player_pos - origin).normalized()
	if boss_tier <= 1:
		var angles: Array = [[-0.30, 0.0, 0.30], [-0.38, 0.0, 0.38]][boss_tier]
		var speed: float = float([285.0, 305.0][boss_tier]) * tuning_enemy_bullet_speed
		for angle in angles:
			_append_enemy_bullet(origin, base.rotated(float(angle)) * speed, 7.0 + boss_tier, Color(1.0, 0.20, 0.08))
	else:
		var pattern := boss_pattern_index % 3
		boss_pattern_index += 1
		if pattern == 0:
			_boss_gap_fan(origin, base, boss_tier == 3)
		elif pattern == 1:
			_boss_diamond_gate(origin, boss_tier == 3)
		else:
			_boss_curved_petals(origin, base, boss_tier == 3)
	for i in range(6):
		particles.append({"pos": origin, "vel": Vector2(rng.randf_range(-120, -30), rng.randf_range(-40, 40)), "life": 0.35, "max": 0.35, "color": Color(1.0, 0.12, 0.08), "size": rng.randf_range(3, 7)})

func _append_enemy_bullet(at: Vector2, velocity: Vector2, size: float, color: Color, curve: float = 0.0) -> void:
	enemy_bullets.append({"pos": at, "vel": velocity, "life": 6.5, "size": size, "color": color, "curve": curve})

func _boss_gap_fan(origin: Vector2, base: Vector2, final_boss: bool) -> void:
	var count := 13 if final_boss else 11
	var spread := 1.02 if final_boss else 0.86
	var speed := (330.0 if final_boss else 305.0) * tuning_enemy_bullet_speed
	var gap_shift := (boss_pattern_index / 3) % 3 - 1
	var gap_center := count / 2 + gap_shift
	for i in range(count):
		if absi(i - gap_center) <= 1:
			continue
		var ratio := float(i) / float(count - 1)
		var angle := lerpf(-spread, spread, ratio)
		_append_enemy_bullet(origin, base.rotated(angle) * speed, 8.0, Color(0.98, 0.22, 0.38))

func _boss_diamond_gate(origin: Vector2, final_boss: bool) -> void:
	var layers := 2 if final_boss else 1
	var speed := (315.0 if final_boss else 285.0) * tuning_enemy_bullet_speed
	for layer in range(layers):
		for lane in [-3, -2, -1, 1, 2, 3]:
			var at := Vector2(origin.x + abs(lane) * 17.0 + layer * 38.0, clampf(player_pos.y + lane * 48.0, 70.0, 650.0))
			var velocity := Vector2(-1.0, float(lane) * 0.025).normalized() * speed
			_append_enemy_bullet(at, velocity, 7.5, Color(0.20, 0.94, 1.0))

func _boss_curved_petals(origin: Vector2, base: Vector2, final_boss: bool) -> void:
	var speed := (300.0 if final_boss else 270.0) * tuning_enemy_bullet_speed
	var angles := [-0.92, -0.70, -0.50, -0.30, 0.30, 0.50, 0.70, 0.92]
	for angle in angles:
		var curve := signf(float(angle)) * (0.19 if final_boss else 0.15)
		_append_enemy_bullet(origin, base.rotated(float(angle)) * speed, 7.0, Color(0.72, 0.38, 1.0), curve)

func _start_boss_laser() -> void:
	var muzzle_offset: float = 176.0 if boss_tier == 1 else 188.0
	boss_laser_start = boss_pos + Vector2(-muzzle_offset, 0)
	boss_laser_end = Vector2(-30.0, clampf(player_pos.y, 70.0, 650.0))
	boss_laser_warning = 1.25 if boss_tier == 1 else 1.05
	boss_laser_active = 0.0
	_show_dialogue("dialogue.laser_warning", 2.0)

func _update_boss_laser(dt: float) -> void:
	if boss_laser_warning > 0.0:
		boss_laser_warning = maxf(0.0, boss_laser_warning - dt)
		if boss_laser_warning <= 0.0:
			boss_laser_active = 0.72 if boss_tier == 1 else 0.88
			shake = 10.0
			_show_dialogue("dialogue.laser_firing", 1.2)
		return
	if boss_laser_active <= 0.0:
		return
	boss_laser_active = maxf(0.0, boss_laser_active - dt)
	var closest := Geometry2D.get_closest_point_to_segment(player_pos, boss_laser_start, boss_laser_end)
	var beam_radius := 14.0 if boss_tier == 1 else 22.0
	if player_pos.distance_to(closest) < beam_radius + tuning_hit_radius:
		_damage_player()

func _boss_defeated() -> void:
	if phase != Phase.BOSS:
		return
	var defeated_tier := boss_tier
	var bone_drop_pos := boss_pos + Vector2(-135, 0)
	boss_sprite.visible = false
	boss_laser_warning = 0.0
	boss_laser_active = 0.0
	enemy_bullets.clear()
	for e in enemies:
		e.node.queue_free()
	enemies.clear()
	_explode(boss_pos, Color(1.0, 0.22, 0.08), 60 + defeated_tier * 24)
	_play_explosion_sfx(0.72 - defeated_tier * 0.08)
	_spawn_bone(bone_drop_pos)
	score += [1800, 2800, 4200, 8000][defeated_tier]
	shake = 16.0
	flash = 0.32
	if defeated_tier < 2:
		wave_segment = defeated_tier + 1
		segment_elapsed = 0.0
		wave_number = 1
		last_wave_announced = 0
		spawn_timer = 1.4
		player_hp = mini(player_max_hp, player_hp + 1)
		energy = minf(100.0, energy + 25.0)
		phase = Phase.PLAYING
		_show_dialogue("dialogue.elite_defeated", 4.0, {"elite": defeated_tier + 1})
	elif defeated_tier == 2:
		phase = Phase.TRANSITION
		transition_timer = 5.5
		energy = minf(100.0, energy + 35.0)
		_show_dialogue("dialogue.final_waking", 5.2)
	else:
		_victory()

func _spawn_bone(at: Vector2) -> void:
	pickups.append({"pos": at, "base_y": at.y, "phase": rng.randf_range(0.0, TAU)})

func _enemy_aimed_shot(origin: Vector2, speed: float) -> void:
	TuningStore.apply_boundary("NEXT_ATTACK", ["enemy_bullet_speed"])
	var direction := (player_pos - origin).normalized()
	_append_enemy_bullet(origin + Vector2(-26, 0), direction * speed * tuning_enemy_bullet_speed, 7.0, Color(1.0, 0.20, 0.08))

func _update_pickups(dt: float) -> void:
	for i in range(pickups.size() - 1, -1, -1):
		pickups[i].phase = float(pickups[i].phase) + dt
		if float(pickups[i].pos.x) > 780.0:
			pickups[i].pos.x = float(pickups[i].pos.x) - 52.0 * dt
		pickups[i].pos.y = float(pickups[i].base_y) + sin(float(pickups[i].phase) * 2.4) * 7.0
		if pickups[i].pos.distance_to(player_pos) < 24:
			if weapon_level < MAX_WEAPON_LEVEL:
				weapon_level += 1
				energy = minf(100.0, energy + 20.0)
				score += 600
				_trigger_weapon_upgrade_feedback(weapon_level >= MAX_WEAPON_LEVEL)
				if weapon_level >= MAX_WEAPON_LEVEL:
					_show_dialogue("dialogue.weapon_max", 3.5)
				else:
					_show_dialogue("dialogue.weapon_level", 3.0, {"level": weapon_level + 1})
			else:
				energy = minf(100.0, energy + 30.0)
				score += 300
				_trigger_weapon_upgrade_feedback(true)
				_show_dialogue("dialogue.bone_energy", 2.8)
			pickups.remove_at(i)

func _trigger_weapon_upgrade_feedback(is_max: bool) -> void:
	weapon_upgrade_is_max = is_max
	weapon_upgrade_duration = 1.9 if is_max else 1.4
	weapon_upgrade_timer = weapon_upgrade_duration
	shake = maxf(shake, 7.0 if is_max else 4.0)
	flash = maxf(flash, 0.16 if is_max else 0.08)
	var particle_count := 48 if is_max else 30
	for i in range(particle_count):
		var angle := TAU * float(i) / float(particle_count) + rng.randf_range(-0.06, 0.06)
		var color := Color(1.0, 0.73, 0.20) if i % 3 == 0 else (Color(1.0, 0.26, 0.66) if is_max else Color(0.28, 0.96, 1.0))
		particles.append({"pos": player_pos + Vector2.from_angle(angle) * 18.0, "vel": Vector2.from_angle(angle) * rng.randf_range(85.0, 235.0), "life": rng.randf_range(0.55, 1.05), "max": 1.05, "color": color, "size": rng.randf_range(2.0, 5.5)})

func _update_particles(dt: float) -> void:
	for i in range(particles.size() - 1, -1, -1):
		particles[i].pos += particles[i].vel * dt
		particles[i].vel *= 0.97
		particles[i].life -= dt
		if particles[i].life <= 0:
			particles.remove_at(i)

func _update_ambient(dt: float) -> void:
	far_offset = fmod(far_offset - 4.0 * dt, W)
	mid_offset = fmod(mid_offset - 12.0 * dt, W)
	near_offset = fmod(near_offset - 28.0 * dt, W)
	_position_layer(far_sprites, far_offset)
	_position_layer(mid_sprites, mid_offset)
	_position_layer(near_sprites, near_offset)
	for i in range(stars.size()):
		var s: Vector3 = stars[i]
		s.x -= (18.0 + s.z * 20.0) * dt
		if s.x < -10:
			s.x = W + rng.randf_range(0, 150)
			s.y = rng.randf_range(0, H)
		stars[i] = s
	for i in range(debris.size()):
		var d: Dictionary = debris[i]
		d.pos.x = float(d.pos.x) - float(d.speed) * dt
		d.angle = float(d.angle) + float(d.spin) * dt
		if float(d.pos.x) < -30:
			d.pos = Vector2(W + rng.randf_range(0, 220), rng.randf_range(60, H - 60))
		debris[i] = d

func _position_layer(layer: Array, offset: float) -> void:
	for i in range(layer.size()):
		var x := W * 0.5 + float(i) * W + offset
		if x < -W * 0.5:
			x += W * 2.0
		layer[i].position = Vector2(x, H * 0.5)

func _spawn_hit(at: Vector2, color: Color) -> void:
	for i in range(5):
		particles.append({"pos": at, "vel": Vector2.from_angle(rng.randf_range(0, TAU)) * rng.randf_range(35, 120), "life": 0.28, "max": 0.28, "color": color, "size": rng.randf_range(2, 5)})

func _explode(at: Vector2, color: Color, count: int) -> void:
	for i in range(count):
		particles.append({"pos": at, "vel": Vector2.from_angle(rng.randf_range(0, TAU)) * rng.randf_range(50, 250), "life": rng.randf_range(0.35, 0.8), "max": 0.8, "color": color, "size": rng.randf_range(2, 8)})

func _victory() -> void:
	if phase == Phase.VICTORY: return
	phase = Phase.VICTORY
	score += 5000 + player_hp * 500
	boss_sprite.visible = false
	enemy_bullets.clear()
	_show_dialogue("dialogue.victory", 99.0)
	_save_score()
	shake = 18.0
	flash = 0.4

func _defeat() -> void:
	phase = Phase.DEFEAT
	player_sprite.visible = false
	enemy_bullets.clear()
	_explode(player_pos, Color(0.2, 0.9, 1.0), 70)
	_show_dialogue("dialogue.defeat", 99.0)
	_save_score()

func _show_dialogue(key: String, duration: float, values: Dictionary = {}) -> void:
	dialogue_key = key
	dialogue_values = values
	dialogue_timer = duration
	_dlg_age = 0.0

func _load_score() -> void:
	var config := ConfigFile.new()
	if config.load("user://stargrave_save.cfg") == OK:
		best_score = int(config.get_value("progress", "best_score", 0))

func _save_score() -> void:
	best_score = maxi(best_score, score)
	var config := ConfigFile.new()
	config.set_value("meta", "version", 2)
	config.set_value("progress", "best_score", best_score)
	config.set_value("progress", "last_run_custom", TuningStore.run_custom)
	config.save("user://stargrave_save.cfg")

func _sync_audio_pause() -> void:
	var should_pause := phase == Phase.PAUSED
	if audio_paused == should_pause:
		return
	audio_paused = should_pause
	for voice in [bgm_player, shoot_sfx, hit_sfx, explosion_sfx]:
		if is_instance_valid(voice) and (voice.playing or voice.stream_paused):
			voice.stream_paused = should_pause
			audio_pause_writes += 1

func _apply_audio_tuning() -> void:
	if is_instance_valid(bgm_player):
		bgm_player.volume_db = tuning_bgm_volume_db
	if is_instance_valid(shoot_sfx):
		shoot_sfx.volume_db = -17.0 + tuning_sfx_volume_db
	if is_instance_valid(hit_sfx):
		hit_sfx.volume_db = -5.0 + tuning_sfx_volume_db
	if is_instance_valid(explosion_sfx):
		explosion_sfx.volume_db = -7.0 + tuning_sfx_volume_db

func _toggle_pause() -> void:
	if phase == Phase.PAUSED:
		phase = previous_phase
	elif phase in [Phase.INTRO, Phase.PLAYING, Phase.BOSS, Phase.TRANSITION]:
		previous_phase = phase
		phase = Phase.PAUSED

func _unhandled_input(event: InputEvent) -> void:
	if (event is InputEventScreenTouch or event is InputEventMouseButton) and event.pressed:
		if not Rect2(0, 0, W, H).has_point(event.position):
			return
	if (event is InputEventScreenTouch or event is InputEventMouseButton) and event.pressed:
		if Rect2(1170, 100, 78, 32).has_point(event.position):
			_toggle_pause()
			return
		if phase == Phase.PAUSED and PAUSE_MENU_RECT.has_point(event.position):
			get_tree().change_scene_to_file("res://scenes/title_screen.tscn")
			return
		if phase == Phase.PAUSED and PAUSE_RESUME_RECT.has_point(event.position):
			_toggle_pause()
			return
	if phase == Phase.PAUSED:
		# Pause menu: pointer hover and Up/Down move the selection cursor; Enter/Space confirm.
		if event is InputEventMouseMotion:
			if PAUSE_RESUME_RECT.has_point(event.position):
				_pause_cursor = 0
			elif PAUSE_MENU_RECT.has_point(event.position):
				_pause_cursor = 1
		elif event is InputEventKey and event.pressed and not event.echo:
			if event.keycode in [KEY_UP, KEY_DOWN, KEY_W, KEY_S]:
				_pause_cursor = 1 - _pause_cursor
				return
			if event.keycode in [KEY_ENTER, KEY_KP_ENTER, KEY_SPACE]:
				if _pause_cursor == 0:
					_toggle_pause()
				else:
					get_tree().change_scene_to_file("res://scenes/title_screen.tscn")
				return
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_M and phase in [Phase.PAUSED, Phase.VICTORY, Phase.DEFEAT]:
			get_tree().change_scene_to_file("res://scenes/title_screen.tscn")
		elif event.keycode == KEY_K:
			_activate_laser()
		elif event.keycode == KEY_L:
			_activate_shield()
		elif event.keycode == KEY_ESCAPE:
			_toggle_pause()
		elif event.keycode == KEY_R and phase in [Phase.VICTORY, Phase.DEFEAT]:
			get_tree().reload_current_scene()
		elif event.keycode == KEY_ENTER and phase == Phase.INTRO:
			phase = Phase.PLAYING
	if event is InputEventScreenTouch:
		touch_seen = true
		if event.pressed:
			if phase in [Phase.VICTORY, Phase.DEFEAT]:
				get_tree().reload_current_scene()
			elif phase == Phase.INTRO:
				phase = Phase.PLAYING
			elif event.position.distance_to(Vector2(1070, 620)) < 58:
				_activate_laser()
			elif event.position.distance_to(Vector2(1180, 620)) < 58:
				_activate_shield()
			elif event.position.x < W * 0.48 and touch_id == -1:
				touch_id = event.index
				touch_origin = event.position
				touch_move = Vector2.ZERO
		else:
			if event.index == touch_id:
				touch_id = -1
				touch_move = Vector2.ZERO
	elif event is InputEventScreenDrag and event.index == touch_id:
		touch_move = ((event.position - touch_origin) / 62.0).limit_length(1.0)

func _draw() -> void:
	for s in stars:
		draw_circle(Vector2(s.x, s.y), s.z, Color(0.55, 0.82, 1.0, 0.18 + s.z * 0.12))
	for d in debris:
		var dir: Vector2 = Vector2.from_angle(float(d.angle)) * float(d.size)
		draw_line(d.pos - dir, d.pos + dir, Color(0.32, 0.31, 0.40, 0.62), maxf(1.0, float(d.size) * 0.3))
	for b in bullets:
		if bool(b.get("maxed", false)):
			_draw_max_weapon_bullet(b)
		else:
			draw_line(b.pos - Vector2(15, 0), b.pos + Vector2(7, 0), Color(0.25, 0.96, 1.0, 0.45), 6.0)
			draw_line(b.pos - Vector2(10, 0), b.pos + Vector2(8, 0), Color(0.88, 1.0, 1.0), 2.0)
	for b in enemy_bullets:
		var bullet_color: Color = b.get("color", Color(1.0, 0.18, 0.08))
		var bullet_glow := bullet_color
		bullet_glow.a = 0.14
		draw_circle(b.pos, float(b.size) + 5, bullet_glow)
		draw_circle(b.pos, float(b.size), bullet_color)
		draw_circle(b.pos, float(b.size) * 0.35, Color(1.0, 0.86, 0.55))
	if boss_laser_warning > 0.0 or boss_laser_active > 0.0:
		_draw_boss_laser()
	for p in pickups:
		var pickup_pos: Vector2 = p.pos
		var bone_glow := 0.48 + sin(float(p.phase) * 3.0) * 0.16
		draw_circle(pickup_pos, 22.0, Color(1.0, 0.66, 0.16, 0.08 + bone_glow * 0.08))
		draw_arc(pickup_pos, 17.0, float(p.phase), float(p.phase) + 4.6, 18, Color(1.0, 0.78, 0.32, bone_glow), 1.5)
		draw_line(pickup_pos - Vector2(8, 0), pickup_pos + Vector2(8, 0), Color(1.0, 0.89, 0.62), 5.0)
		for off in [Vector2(-10, -4), Vector2(-10, 4), Vector2(10, -4), Vector2(10, 4)]:
			draw_circle(pickup_pos + off, 4, Color(1.0, 0.89, 0.62))
	if player_sprite.visible:
		var flame := 16.0 + sin(elapsed * 28.0) * 5.0
		draw_colored_polygon(PackedVector2Array([player_pos + Vector2(-39, -8), player_pos + Vector2(-39 - flame, 0), player_pos + Vector2(-39, 8)]), Color(0.1, 0.80, 1.0, 0.30))
		draw_colored_polygon(PackedVector2Array([player_pos + Vector2(-40, -4), player_pos + Vector2(-49 - flame * 0.35, 0), player_pos + Vector2(-40, 4)]), Color(0.78, 1.0, 1.0, 0.82))
		_draw_player_core()
		if shield_timer > 0 and shield_hits > 0:
			_draw_shield()
	if weapon_upgrade_timer > 0:
		_draw_weapon_upgrade_feedback()
	if laser_timer > 0:
		_draw_laser()
	for p in particles:
		var alpha: float = clampf(float(p.life) / float(p.max), 0.0, 1.0)
		var c: Color = p.color
		c.a = alpha
		draw_circle(p.pos, float(p.size) * alpha + 1.0, c)
	_draw_hud()
	_draw_controls_guide()
	if dialogue_timer > 0 and dialogue != "":
		_draw_dialogue()
	if phase == Phase.INTRO:
		_draw_center_overlay(I18n.t("intro.title"), I18n.t("intro.subtitle"), I18n.t("intro.hint"))
	elif phase == Phase.TRANSITION:
		_draw_center_overlay(I18n.t("transition.title"), I18n.t("transition.subtitle"), I18n.t("transition.hint"))
	elif phase == Phase.PAUSED:
		_draw_center_overlay(I18n.t("pause.title"), I18n.t("pause.resume"), I18n.t("pause.menu"))
	elif phase == Phase.VICTORY:
		_draw_center_overlay(I18n.t("victory.title"), I18n.t("victory.score", {"score": "%06d" % score}), I18n.t("victory.retry"))
	elif phase == Phase.DEFEAT:
		_draw_center_overlay(I18n.t("defeat.title"), I18n.t("defeat.score", {"score": "%06d" % score, "best": "%06d" % best_score}), I18n.t("defeat.retry"))
	if _warning_t > 0.0 and phase != Phase.PAUSED:
		_draw_warning()
	if flash > 0:
		draw_rect(Rect2(0, 0, W, H), Color(1.0, 0.18, 0.10, minf(0.24, flash)))
	if _age < WARP_IN:
		_draw_warp_in()

func _draw_max_weapon_bullet(bullet: Dictionary) -> void:
	var bullet_pos: Vector2 = bullet.pos
	var forward: Vector2 = Vector2(bullet.vel).normalized()
	var side := forward.orthogonal()
	var wing := float(bullet.get("wing", 1))
	var pulse := 0.76 + sin(elapsed * 34.0 + bullet_pos.x * 0.03) * 0.16
	var outer := PackedVector2Array([
		bullet_pos + forward * 22.0,
		bullet_pos + side * 8.0,
		bullet_pos - forward * 13.0,
		bullet_pos - side * 8.0,
	])
	draw_colored_polygon(outer, Color(1.0, 0.60, 0.10, 0.18))
	var fang := PackedVector2Array([
		bullet_pos + forward * 17.0,
		bullet_pos + side * 5.0,
		bullet_pos - forward * 9.0,
		bullet_pos - side * 5.0,
	])
	draw_colored_polygon(fang, Color(1.0, 0.18, 0.60, pulse))
	var fin_root := bullet_pos - forward * 3.0
	draw_colored_polygon(PackedVector2Array([fin_root, fin_root - forward * 11.0 + side * 8.0 * wing, fin_root - forward * 7.0]), Color(0.20, 0.95, 1.0, 0.86))
	draw_line(bullet_pos - forward * 25.0, bullet_pos - forward * 8.0, Color(1.0, 0.50, 0.14, 0.45), 5.0)
	draw_line(bullet_pos - forward * 17.0, bullet_pos + forward * 12.0, Color(1.0, 0.94, 0.70), 2.0)
	draw_circle(bullet_pos, 2.6, Color.WHITE)

func _draw_weapon_upgrade_feedback() -> void:
	var progress := 1.0 - weapon_upgrade_timer / maxf(weapon_upgrade_duration, 0.01)
	var fade := clampf(weapon_upgrade_timer / 0.55, 0.0, 1.0)
	var primary := Color(1.0, 0.34, 0.66) if weapon_upgrade_is_max else Color(0.20, 0.94, 1.0)
	if weapon_upgrade_is_max:
		draw_rect(Rect2(0, 0, W, H), Color(0.44, 0.10, 0.32, 0.04 * fade))
	for ring in range(3):
		var radius := 30.0 + progress * (78.0 + ring * 24.0)
		draw_arc(player_pos, radius, elapsed * (1.8 + ring * 0.35), elapsed * (1.8 + ring * 0.35) + 4.8, 40, Color(primary.r, primary.g, primary.b, fade * (0.72 - ring * 0.16)), 3.0 - ring * 0.55)
	for ray in range(8):
		var angle := TAU * float(ray) / 8.0 + elapsed * 0.8
		var inner := player_pos + Vector2.from_angle(angle) * (38.0 + progress * 22.0)
		var outer := player_pos + Vector2.from_angle(angle) * (58.0 + progress * 70.0)
		draw_line(inner, outer, Color(1.0, 0.78, 0.28, fade * 0.58), 2.0)
	var label := I18n.t("weapon.max_feedback") if weapon_upgrade_is_max else I18n.t("weapon.level_feedback", {"level": weapon_level + 1})
	var label_x := clampf(player_pos.x - 120.0, 22.0, W - 262.0)
	draw_string_outline(DISPLAY_FONT, Vector2(label_x, player_pos.y - 86.0), label, HORIZONTAL_ALIGNMENT_CENTER, 240.0, 16 if weapon_upgrade_is_max else 14, 4, Color(0.02, 0.01, 0.05, 0.8 * fade))
	draw_string(DISPLAY_FONT, Vector2(label_x, player_pos.y - 86.0), label, HORIZONTAL_ALIGNMENT_CENTER, 240.0, 16 if weapon_upgrade_is_max else 14, Color(1.0, 0.87, 0.48, fade))

func _draw_player_core() -> void:
	var pulse := 0.5 + sin(elapsed * 8.0) * 0.18
	draw_circle(player_pos, 14.0, Color(0.10, 0.88, 1.0, 0.08 + pulse * 0.08))
	draw_circle(player_pos, tuning_hit_radius + 2.0, Color(0.22, 0.93, 1.0, 0.28))
	draw_circle(player_pos, tuning_hit_radius, Color(0.82, 1.0, 1.0, 0.92))
	draw_circle(player_pos, 2.6, Color.WHITE)
	if weapon_level >= MAX_WEAPON_LEVEL:
		draw_arc(player_pos, 18.0, elapsed * 2.4, elapsed * 2.4 + 4.7, 28, Color(1.0, 0.40, 0.70, 0.86), 2.0)
		for i in range(3):
			var angle := -elapsed * 1.8 + TAU * float(i) / 3.0
			draw_circle(player_pos + Vector2.from_angle(angle) * 21.0, 2.4, Color(1.0, 0.76, 0.24))

func _draw_shield() -> void:
	var shield_alpha := 0.42 + sin(elapsed * 6.0) * 0.12
	draw_circle(player_pos, 58.0, Color(0.08, 0.74, 1.0, 0.12))
	draw_circle(player_pos, 49.0, Color(0.15, 0.94, 1.0, 0.08))
	for ring in range(2):
		var points := PackedVector2Array()
		var rotation := elapsed * (0.72 if ring == 0 else -0.48) + ring * 0.42
		var radius := 53.0 + ring * 7.0
		for i in range(7):
			points.append(player_pos + Vector2.from_angle(rotation + i * TAU / 6.0) * radius)
		draw_polyline(points, Color(0.32, 0.94, 1.0, shield_alpha - ring * 0.12), 2.2 if ring == 0 else 1.2)
	for i in range(12):
		var spark_angle := elapsed * 1.8 + i * TAU / 12.0
		var spark_pos := player_pos + Vector2.from_angle(spark_angle) * (57.0 + sin(elapsed * 7.0 + i) * 3.0)
		draw_circle(spark_pos, 2.4, Color(0.72, 1.0, 1.0, 0.76))
	for i in range(shield_hits):
		draw_circle(player_pos + Vector2(-12 + i * 12, -56), 3.5, Color(0.62, 1.0, 1.0))

func _draw_laser() -> void:
	var start := player_pos + Vector2(38, 0)
	var beam_end := Vector2(W + 30, player_pos.y)
	var flicker := sin(elapsed * 42.0) * 9.0
	draw_rect(Rect2(0, 0, W, H), Color(0.02, 0.42, 0.62, 0.035))
	draw_colored_polygon(PackedVector2Array([start + Vector2(0, -122 - flicker), beam_end + Vector2(0, -94), beam_end + Vector2(0, 94), start + Vector2(0, 122 + flicker)]), Color(0.06, 0.62, 1.0, 0.15))
	draw_colored_polygon(PackedVector2Array([start + Vector2(0, -72 - flicker * 0.3), beam_end + Vector2(0, -54), beam_end + Vector2(0, 54), start + Vector2(0, 72 + flicker * 0.3)]), Color(0.18, 0.88, 1.0, 0.50))
	for filament in range(4):
		var points := PackedVector2Array()
		for step in range(15):
			var ratio := float(step) / 14.0
			var x := lerpf(start.x, beam_end.x, ratio)
			var y := player_pos.y + sin(ratio * 28.0 + elapsed * (18.0 + filament * 2.0) + filament) * (24.0 + filament * 8.0)
			points.append(Vector2(x, y))
		draw_polyline(points, Color(0.62, 0.98, 1.0, 0.34), 2.0)
	draw_line(start, beam_end, Color(0.82, 1.0, 1.0), 24.0)
	draw_line(start, beam_end, Color.WHITE, 8.0)
	for ring in range(3):
		draw_arc(start, 24.0 + ring * 11.0, elapsed * 5.0 + ring, elapsed * 5.0 + ring + 4.5, 24, Color(0.50, 0.98, 1.0, 0.72 - ring * 0.16), 3.0)
	draw_circle(start, 27.0 + sin(elapsed * 30.0) * 4.0, Color(0.45, 0.96, 1.0, 0.72))

func _draw_boss_laser() -> void:
	var beam_color := Color(1.0, 0.16, 0.12) if boss_tier == 1 else Color(0.92, 0.18, 1.0)
	if boss_laser_warning > 0.0:
		var pulse := 0.42 + sin(elapsed * 24.0) * 0.18
		for segment in range(18):
			if segment % 2 == 0:
				var start_ratio := float(segment) / 18.0
				var end_ratio := float(segment + 1) / 18.0
				var a := boss_laser_start.lerp(boss_laser_end, start_ratio)
				var b := boss_laser_start.lerp(boss_laser_end, end_ratio)
				draw_line(a, b, Color(beam_color.r, beam_color.g, beam_color.b, pulse), 3.0)
		for i in range(7):
			var ratio := fposmod(elapsed * 0.9 + float(i) / 7.0, 1.0)
			draw_circle(boss_laser_start.lerp(boss_laser_end, ratio), 3.0, Color(1.0, 0.82, 0.62, 0.75))
		draw_arc(boss_laser_start, 24.0 + sin(elapsed * 20.0) * 4.0, 0.0, TAU, 32, beam_color, 3.0)
		return
	var outer_width := 72.0 if boss_tier == 1 else 96.0
	draw_line(boss_laser_start, boss_laser_end, Color(beam_color.r, beam_color.g, beam_color.b, 0.16), outer_width)
	draw_line(boss_laser_start, boss_laser_end, Color(beam_color.r, beam_color.g, beam_color.b, 0.72), 30.0 if boss_tier == 1 else 44.0)
	draw_line(boss_laser_start, boss_laser_end, Color(1.0, 0.92, 0.82), 8.0)
	draw_circle(boss_laser_start, 30.0 + sin(elapsed * 35.0) * 5.0, Color(beam_color.r, beam_color.g, beam_color.b, 0.72))

func _update_presentation(delta: float) -> void:
	_age += delta
	if phase != _overlay_phase:
		_overlay_phase = phase
		_overlay_age = 0.0
		if phase == Phase.PAUSED:
			_pause_cursor = 0
	_overlay_age += delta
	_cursor_y = lerpf(_cursor_y, float(_pause_cursor), minf(1.0, delta * 16.0))
	if phase == Phase.PAUSED:
		return
	if phase == Phase.BOSS and _last_phase != Phase.BOSS:
		_warning_t = WARNING_DURATION
	_last_phase = phase
	_warning_t = maxf(0.0, _warning_t - delta)
	_dlg_age += delta
	if score != _last_score:
		_score_punch = 1.0
		_last_score = score
	_score_punch = move_toward(_score_punch, 0.0, delta * 4.5)
	_shown_score = move_toward(_shown_score, float(score), maxf(delta * 900.0, absf(float(score) - _shown_score) * delta * 9.0))
	if player_hp < _last_hp:
		_hp_flash = 1.0
	_last_hp = player_hp
	_hp_flash = move_toward(_hp_flash, 0.0, delta * 2.2)
	if combo != _last_combo:
		_combo_pop = 1.0 if combo > _last_combo else _combo_pop
		_last_combo = combo
	_combo_pop = move_toward(_combo_pop, 0.0, delta * 5.0)

func _draw_hud() -> void:
	var zh := I18n.get_locale() != "en"
	# --- Top-left: pilot plate, hull hearts, weapon pips. ---
	var hurt := _hp_flash
	var left := Rect2(24, 20, 336, 70)
	HoloUI.panel(self, left, HoloUI.CYAN.lerp(HoloUI.RED, hurt), 0.92, 12.0, true, 12.0)
	HoloUI.glow_text(self, DISPLAY_FONT, Vector2(42, 47), I18n.t("hud.pilot"), 15, Color(0.50, 0.95, 0.98), HoloUI.CYAN, HORIZONTAL_ALIGNMENT_LEFT, -1, 0.7)
	for i in range(player_max_hp):
		var center := Vector2(176.0 + i * 30.0, 41.0)
		if i < player_hp:
			HoloUI.heart(self, center, 12.0, Color(1.0, 0.52, 0.24, 0.20))
			HoloUI.heart(self, center, 9.0, Color(1.0, 0.60, 0.32))
			HoloUI.heart(self, center + Vector2(-2.5, -2.5), 3.0, Color(1.0, 0.88, 0.70, 0.8))
		else:
			var lost := Color(0.40, 0.38, 0.52, 0.85)
			if i == player_hp and hurt > 0.05:
				HoloUI.heart(self, center, 9.0 + hurt * 4.0, Color(1.0, 1.0, 1.0, hurt))
			HoloUI.heart(self, center, 9.0, lost, true)
	var weapon_maxed := weapon_level >= MAX_WEAPON_LEVEL
	var weapon_color := HoloUI.MAGENTA if weapon_maxed else HoloUI.AMBER
	var weapon_text := I18n.t("hud.weapon_max") if weapon_maxed else I18n.t("hud.weapon", {"level": weapon_level + 1, "max": MAX_WEAPON_LEVEL + 1})
	_text(weapon_text, Vector2(42, 78), 11, weapon_color, _caps_font())
	var pulse := (0.5 + 0.5 * sin(elapsed * 6.0)) if weapon_maxed else 0.0
	HoloUI.seg_bar(self, Rect2(176, 68, 166, 10), float(weapon_level + 1) / float(MAX_WEAPON_LEVEL + 1), MAX_WEAPON_LEVEL + 1, weapon_color, 5.0, 4.0, pulse)
	if phase == Phase.PLAYING:
		var progress: float = clampf(segment_elapsed / float(SEGMENT_DURATIONS[wave_segment]), 0.0, 1.0)
		var track := Rect2(28, 104, 300, 4)
		draw_rect(track, Color(0.10, 0.12, 0.20, 0.85))
		draw_rect(Rect2(track.position, Vector2(track.size.x * progress, track.size.y)), HoloUI.ORANGE)
		draw_circle(Vector2(track.position.x + track.size.x * progress, track.get_center().y), 4.0, Color(1.0, 0.80, 0.55))
		for w in range(1, WAVES_PER_SEGMENT):
			var tx := track.position.x + track.size.x * float(w) / WAVES_PER_SEGMENT
			draw_line(Vector2(tx, track.position.y - 3), Vector2(tx, track.end.y + 3), Color(0.60, 0.70, 0.86, 0.5), 1.0)
		_shadow_text(I18n.t("hud.wave", {"sector": wave_segment + 1, "wave": wave_number, "waves": WAVES_PER_SEGMENT}), Vector2(28, 126), 12, Color(0.78, 0.80, 0.90), _caps_font())
	# --- Top-centre: arcade score with punch + rolling digits. ---
	var score_parts := _split_value("hud.score", "score")
	_shadow_text(score_parts[0], Vector2(0, 34), 11, Color(0.62, 0.72, 0.86), _caps_font(), HORIZONTAL_ALIGNMENT_CENTER, W)
	var punch := 1.0 + HoloUI.ease_out(_score_punch) * 0.14
	draw_set_transform(Vector2(W * 0.5, 58.0), 0.0, Vector2(punch, punch))
	HoloUI.glow_text(self, DISPLAY_FONT, Vector2(-220, 11), "%06d" % int(round(_shown_score)), 28, Color(0.97, 0.98, 1.0), HoloUI.CYAN.lerp(HoloUI.AMBER, _score_punch), HORIZONTAL_ALIGNMENT_CENTER, 440, 0.7 + _score_punch * 0.6)
	draw_set_transform(Vector2.ZERO)
	if combo > 1:
		var pop := 1.0 + HoloUI.ease_out(_combo_pop) * 0.3
		draw_set_transform(Vector2(W * 0.5, 88.0), 0.0, Vector2(pop, pop))
		HoloUI.glow_text(self, DISPLAY_FONT, Vector2(-160, 5), I18n.t("hud.combo", {"count": mini(combo, 8)}), 13, Color(1.0, 0.72, 0.34), HoloUI.ORANGE, HORIZONTAL_ALIGNMENT_CENTER, 320, 0.8)
		draw_set_transform(Vector2.ZERO)
	# --- Top-right: energy reactor meter + ability status. ---
	var right := Rect2(920, 20, 336, 70)
	var full := energy >= 100.0
	HoloUI.panel(self, right, HoloUI.AMBER if full else HoloUI.CYAN, 0.92, 12.0, true, 12.0)
	_text(I18n.t("hud.energy"), Vector2(938, 46), 11, Color(0.58, 0.86, 0.90), _caps_font())
	var energy_pulse := (0.5 + 0.5 * sin(elapsed * 7.0)) if full else 0.0
	HoloUI.seg_bar(self, Rect2(1010, 36, 228, 12), energy / 100.0, 10, HoloUI.AMBER if full else HoloUI.CYAN, 5.0, 3.0, energy_pulse)
	var status_y := 78.0
	if full:
		var kx := 938.0
		kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, status_y - 15), "K", 12, HoloUI.AMBER) + 6.0
		_text(I18n.t("legend.laser"), Vector2(kx, status_y), 12, Color(1.0, 0.82, 0.46), _caps_font())
		kx += _caps_font().get_string_size(I18n.t("legend.laser"), HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x + 16.0
		kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, status_y - 15), "L", 12, HoloUI.AMBER) + 6.0
		_text(I18n.t("legend.shield"), Vector2(kx, status_y), 12, Color(1.0, 0.82, 0.46), _caps_font())
	elif laser_timer > 0:
		_text(I18n.t("hud.laser", {"seconds": "%.1f" % laser_timer}), Vector2(938, status_y), 12, Color(0.50, 0.96, 1.0), _caps_font())
	elif shield_hits > 0:
		_text(I18n.t("hud.shield", {"seconds": ceili(shield_timer), "hits": shield_hits}), Vector2(938, status_y), 12, Color(0.50, 0.96, 1.0), _caps_font())
	else:
		_text(I18n.t("hud.charging"), Vector2(938, status_y), 12, Color(0.56, 0.62, 0.74), _caps_font())
		_text("%d%%" % int(energy), Vector2(1010, status_y), 12, Color(0.56, 0.62, 0.74), DISPLAY_FONT, HORIZONTAL_ALIGNMENT_RIGHT, 228)
	# Pause glyph button (same tap target as before).
	var pause_rect := Rect2(1170, 100, 78, 32)
	HoloUI.panel(self, pause_rect, HoloUI.CYAN, 0.9, 7.0, false, 0.0)
	draw_rect(Rect2(pause_rect.position + Vector2(10, 10), Vector2(3, 12)), Color(0.62, 0.95, 0.98))
	draw_rect(Rect2(pause_rect.position + Vector2(16, 10), Vector2(3, 12)), Color(0.62, 0.95, 0.98))
	_text(I18n.t("hud.pause"), Vector2(pause_rect.position.x + 24, pause_rect.position.y + 21), 11 if not zh else 12, Color(0.62, 0.95, 0.98), _caps_font(), HORIZONTAL_ALIGNMENT_CENTER, pause_rect.size.x - 28)
	# --- Boss: name plate + segmented hull bar. ---
	if phase == Phase.BOSS:
		var rank := I18n.t("boss.elite", {"elite": boss_tier + 1}) if boss_tier < 3 else I18n.t("boss.final")
		_shadow_text(I18n.t("boss.header", {"rank": rank, "boss": I18n.t(BOSS_NAMES[boss_tier])}), Vector2(382, 126), 14, Color(1.0, 0.54, 0.44), DISPLAY_FONT, HORIZONTAL_ALIGNMENT_CENTER, 516)
		var bar := Rect2(396, 134, 488, 12)
		HoloUI.brackets(self, bar.grow(5.0), 6.0, Color(HoloUI.RED, 0.8), 1.5)
		HoloUI.seg_bar(self, bar, maxf(0.0, boss_hp) / boss_max_hp, 24, Color(0.95, 0.18, 0.12), 4.0, 2.0)
		_shadow_text(I18n.t(BOSS_SKILLS[boss_tier]), Vector2(382, 166), 12, Color(0.74, 0.80, 0.92), UI_FONT, HORIZONTAL_ALIGNMENT_CENTER, 516)
	if touch_seen or DisplayServer.is_touchscreen_available():
		draw_circle(Vector2(128, 515), 66, Color(0.14, 0.69, 0.74, 0.10))
		draw_arc(Vector2(128, 515), 66, 0, TAU, 48, Color(0.30, 0.87, 0.91, 0.36), 2.0)
		var stick := Vector2(128, 515) + touch_move * 34.0
		draw_circle(stick, 22, Color(0.34, 0.93, 0.96, 0.32))
		for ability: Array in [[Vector2(1070, 620), "K", full], [Vector2(1180, 620), "L", full]]:
			var c: Vector2 = ability[0]
			draw_circle(c, 45, Color(0.18, 0.90, 1.0, 0.14))
			draw_arc(c, 45, -PI * 0.5, -PI * 0.5 + TAU * energy / 100.0, 40, Color(HoloUI.AMBER if ability[2] else HoloUI.CYAN, 0.8), 3.0)
			_text(ability[1], Vector2(c.x - 30, c.y + 8), 20, Color(0.68, 0.97, 1.0), DISPLAY_FONT, HORIZONTAL_ALIGNMENT_CENTER, 60)

func _draw_controls_guide() -> void:
	var a := 1.0 if elapsed < 10.0 else 0.62
	var box := Rect2(24, 604, 268, 88)
	HoloUI.panel(self, box, HoloUI.CYAN, 0.85 * a, 10.0, true, 8.0)
	_text(I18n.t("controls.title"), Vector2(40, 622), 11, Color(HoloUI.CYAN, a), _caps_font())
	var kx := 40.0
	for key: String in ["W", "A", "S", "D"]:
		kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, 630), key, 11, HoloUI.INK, a) + 3.0
	_text(I18n.t("legend.move"), Vector2(kx + 5, 644), 12, Color(0.82, 0.84, 0.92, a), _caps_font())
	kx += 10.0 + _caps_font().get_string_size(I18n.t("legend.move"), HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x + 10.0
	_text(I18n.t("legend.autofire"), Vector2(kx, 644), 12, Color(0.62, 0.68, 0.80, a), _caps_font())
	kx = 40.0
	kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, 660), "K", 11, HoloUI.AMBER, a) + 6.0
	_text(I18n.t("legend.laser"), Vector2(kx, 674), 12, Color(1.0, 0.78, 0.42, a), _caps_font())
	kx += _caps_font().get_string_size(I18n.t("legend.laser"), HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x + 16.0
	kx += HoloUI.keycap(self, BOLD_FONT, Vector2(kx, 660), "L", 11, HoloUI.AMBER, a) + 6.0
	_text(I18n.t("legend.shield"), Vector2(kx, 674), 12, Color(1.0, 0.78, 0.42, a), _caps_font())

func _draw_dialogue() -> void:
	var box := Rect2(316, 604, 648, 88)
	var open := HoloUI.ease_out(_dlg_age / 0.18)
	var shown := box
	shown.size.x = lerpf(120.0, box.size.x, open)
	HoloUI.panel(self, shown, HoloUI.CYAN, 0.94, 12.0, true, 10.0)
	# Pilot portrait cropped from the ship's canopy, as a comm-feed window.
	var portrait := Rect2(326, 614, 68, 68)
	draw_rect(portrait, Color(0.02, 0.10, 0.14, 1.0))
	draw_texture_rect_region(DOG_SHIP, portrait, Rect2(248, 44, 90, 90), Color(0.85, 1.0, 1.0, 1.0))
	var sy := portrait.position.y + fposmod(_age * 20.0, 3.0)
	while sy < portrait.end.y:
		draw_line(Vector2(portrait.position.x, sy), Vector2(portrait.end.x, sy), Color(0.3, 0.9, 1.0, 0.10), 1.0)
		sy += 3.0
	draw_rect(portrait, Color(HoloUI.CYAN, 0.6), false, 1.0)
	if open < 1.0:
		return
	var line := dialogue
	var speaker := ""
	for separator: String in [": ", "："]:
		var at := line.find(separator)
		if at > 0 and at < 14:
			speaker = line.substr(0, at)
			line = line.substr(at + separator.length())
			break
	var rec := 0.5 + 0.5 * sin(_age * 6.0)
	draw_circle(Vector2(412, 624), 3.0, Color(1.0, 0.36, 0.30, 0.4 + rec * 0.6))
	var tag := I18n.t("hud.comm") + ("  /  " + speaker if speaker != "" else "")
	_text(tag, Vector2(422, 628), 11, HoloUI.AMBER, _caps_font())
	var chars := mini(line.length(), int((_dlg_age - 0.18) * 70.0))
	draw_multiline_string(UI_FONT, Vector2(408, 654), line.substr(0, chars), HORIZONTAL_ALIGNMENT_LEFT, 540, 16, 2, Color(0.92, 0.95, 1.0))

func _draw_center_overlay(title: String, subtitle: String, hint: String) -> void:
	match phase:
		Phase.INTRO, Phase.TRANSITION:
			_draw_banner(title, subtitle, hint)
		Phase.PAUSED:
			_draw_pause_modal(title)
		_:
			_draw_results(title, subtitle, hint)

## Stage-card banner that wipes open across the playfield (intro / final-core alert).
func _draw_banner(title: String, subtitle: String, hint: String) -> void:
	var alert := phase == Phase.TRANSITION
	var accent := HoloUI.RED if alert else HoloUI.CYAN
	var remaining := transition_timer if alert else intro_timer
	var out := clampf(remaining / 0.35, 0.0, 1.0)
	var k := HoloUI.ease_out(_overlay_age / 0.35) * out
	draw_rect(Rect2(0, 0, W, H), Color(0.005, 0.003, 0.018, 0.30 * k))
	var half := W * 0.5 * k
	if half < 4.0:
		return
	var band := Rect2(W * 0.5 - half, 282, half * 2.0, 156)
	var dark := Color(0.01, 0.012, 0.04, 0.84)
	var edge := Color(0.01, 0.012, 0.04, 0.0)
	draw_polygon(PackedVector2Array([band.position, Vector2(band.get_center().x, band.position.y), Vector2(band.get_center().x, band.end.y), Vector2(band.position.x, band.end.y)]), PackedColorArray([edge, dark, dark, edge]))
	draw_polygon(PackedVector2Array([Vector2(band.get_center().x, band.position.y), Vector2(band.end.x, band.position.y), band.end, Vector2(band.get_center().x, band.end.y)]), PackedColorArray([dark, edge, edge, dark]))
	if alert:
		HoloUI.stripes(self, Rect2(band.position.x, band.position.y, band.size.x, 8), Color(HoloUI.RED, 0.75 * k), 22.0, 10.0, _age * 40.0)
		HoloUI.stripes(self, Rect2(band.position.x, band.end.y - 8, band.size.x, 8), Color(HoloUI.RED, 0.75 * k), 22.0, 10.0, -_age * 40.0)
	else:
		draw_line(band.position, Vector2(band.end.x, band.position.y), Color(accent, 0.7 * k), 2.0)
		draw_line(Vector2(band.position.x, band.end.y), band.end, Color(accent, 0.35 * k), 1.0)
		var sweep := fposmod(_age * 520.0, W + 200.0) - 100.0
		draw_line(Vector2(sweep, band.position.y), Vector2(sweep + 90.0, band.position.y), Color(1, 1, 1, 0.8 * k), 2.0)
	var text_a := clampf((_overlay_age - 0.2) / 0.3, 0.0, 1.0) * out
	if text_a <= 0.0:
		return
	var title_size := _fit(TITLE_FONT, title, 46, 900.0)
	var lift := (1.0 - HoloUI.ease_out((_overlay_age - 0.2) / 0.4)) * 12.0
	HoloUI.chroma_text(self, TITLE_FONT, Vector2(0, 358 + lift), title, title_size, Color(0.99, 0.95, 0.90, text_a), Color(accent, text_a), HORIZONTAL_ALIGNMENT_CENTER, W, 2.0)
	draw_rect(Rect2(W * 0.5 - 24, 374, 48, 2), Color(HoloUI.ORANGE, text_a))
	draw_string(UI_FONT, Vector2(0, 402), subtitle, HORIZONTAL_ALIGNMENT_CENTER, W, 18, Color(0.82, 0.84, 0.94, text_a))
	draw_string(_caps_font(), Vector2(0, 424), hint, HORIZONTAL_ALIGNMENT_CENTER, W, 12, Color(HoloUI.AMBER if not alert else Color(1.0, 0.62, 0.52), text_a))

func _modal_rect(target: Rect2) -> Rect2:
	# CRT power-on: a bright line that opens vertically into the full panel.
	var k := HoloUI.ease_out(_overlay_age / 0.28)
	var h := maxf(2.0, target.size.y * k)
	var w := target.size.x * minf(1.0, 0.35 + _overlay_age / 0.12)
	return Rect2(target.get_center() - Vector2(w, h) * 0.5, Vector2(w, h))

func _draw_pause_modal(title: String) -> void:
	draw_rect(Rect2(0, 0, W, H), Color(0.004, 0.003, 0.016, 0.60 * minf(1.0, _overlay_age / 0.15)))
	var target := Rect2(330, 206, 620, 290)
	var rect := _modal_rect(target)
	HoloUI.panel(self, rect, HoloUI.CYAN, 1.0, 16.0, true, 18.0)
	if rect.size.y < target.size.y - 1.0:
		return
	HoloUI.chroma_text(self, TITLE_FONT, Vector2(target.position.x, 296), title, _fit(TITLE_FONT, title, 40, 540.0), Color(0.98, 0.95, 0.90), HoloUI.CYAN, HORIZONTAL_ALIGNMENT_CENTER, target.size.x, 2.0)
	draw_rect(Rect2(W * 0.5 - 24, 318, 48, 2), HoloUI.ORANGE)
	_menu_row(PAUSE_RESUME_RECT, I18n.t("pause.item_resume"), "ESC", 0)
	_menu_row(PAUSE_MENU_RECT, I18n.t("pause.item_menu"), "M", 1)
	# Sliding selection cursor.
	var cy := lerpf(PAUSE_RESUME_RECT.get_center().y, PAUSE_MENU_RECT.get_center().y, _cursor_y)
	var bob := sin(_age * 7.0) * 3.0
	HoloUI.chevron(self, Vector2(PAUSE_RESUME_RECT.position.x - 22 + bob, cy), 8.0, HoloUI.AMBER, 3.0)
	HoloUI.chevron(self, Vector2(PAUSE_RESUME_RECT.position.x - 32 + bob, cy), 8.0, Color(HoloUI.AMBER, 0.4), 3.0)

func _menu_row(rect: Rect2, label: String, key: String, index: int) -> void:
	var selected := clampf(1.0 - absf(_cursor_y - index), 0.0, 1.0)
	var skew := 10.0
	var pts := PackedVector2Array([rect.position + Vector2(skew, 0), Vector2(rect.end.x, rect.position.y), rect.end - Vector2(skew, 0), Vector2(rect.position.x, rect.end.y)])
	var top := Color(0.04, 0.12, 0.16, 0.9).lerp(Color(0.34, 0.24, 0.08, 0.95), selected)
	var bottom := Color(0.02, 0.05, 0.08, 0.9).lerp(Color(0.16, 0.10, 0.03, 0.95), selected)
	draw_polygon(pts, PackedColorArray([top, top, bottom, bottom]))
	var closed := pts.duplicate()
	closed.append(pts[0])
	draw_polyline(closed, Color(HoloUI.CYAN, 0.45).lerp(HoloUI.AMBER, selected), 1.5)
	var font := MEDIUM_FONT if I18n.get_locale() != "en" else _caps_font(MEDIUM_FONT)
	draw_string(font, Vector2(rect.position.x + 26, rect.get_center().y + 6), label, HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.80, 0.90, 0.95).lerp(Color(1.0, 0.95, 0.82), selected))
	var key_w := BOLD_FONT.get_string_size(key, HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x + 12.0
	HoloUI.keycap(self, BOLD_FONT, Vector2(rect.end.x - key_w - 22, rect.get_center().y - 12), key, 12, HoloUI.AMBER if selected > 0.5 else HoloUI.INK)

func _draw_results(title: String, _subtitle: String, hint: String) -> void:
	var victory := phase == Phase.VICTORY
	var accent := HoloUI.AMBER if victory else HoloUI.RED
	draw_rect(Rect2(0, 0, W, H), Color(0.004, 0.003, 0.016, 0.66 * minf(1.0, _overlay_age / 0.2)))
	var target := Rect2(300, 150, 680, 400)
	var rect := _modal_rect(target)
	HoloUI.panel(self, rect, accent, 1.0, 18.0, true, 20.0)
	if rect.size.y < target.size.y - 1.0:
		return
	HoloUI.chroma_text(self, TITLE_FONT, Vector2(target.position.x, 226), title, _fit(TITLE_FONT, title, 42, 600.0), Color(0.99, 0.95, 0.90), accent, HORIZONTAL_ALIGNMENT_CENTER, target.size.x, 2.0)
	if victory:
		draw_string(MEDIUM_FONT, Vector2(target.position.x, 256), I18n.t("victory.subtitle"), HORIZONTAL_ALIGNMENT_CENTER, target.size.x, 16, Color(0.80, 0.84, 0.94))
	else:
		for i in range(player_max_hp):
			HoloUI.heart(self, Vector2(W * 0.5 - 60 + i * 30, 250), 8.0, Color(0.40, 0.36, 0.48, 0.9), true)
	draw_line(Vector2(target.position.x + 60, 274), Vector2(target.end.x - 60, 274), Color(accent, 0.3), 1.0)
	var label := _split_value("hud.score", "score")[0]
	draw_string(_caps_font(), Vector2(target.position.x, 302), label, HORIZONTAL_ALIGNMENT_CENTER, target.size.x, 12, Color(0.62, 0.72, 0.86))
	var reveal := HoloUI.ease_out((_overlay_age - 0.3) / 1.1)
	var shown := int(round(score * reveal))
	var done := reveal >= 1.0
	var pop := 1.0 + (0.12 * maxf(0.0, 1.0 - (_overlay_age - 1.4) / 0.25) if done and _overlay_age < 1.65 else 0.0)
	draw_set_transform(Vector2(W * 0.5, 350), 0.0, Vector2(pop, pop))
	HoloUI.glow_text(self, TITLE_FONT, Vector2(-300, 20), "%06d" % shown, 58, Color(1.0, 0.94, 0.80), accent, HORIZONTAL_ALIGNMENT_CENTER, 600, 1.2)
	draw_set_transform(Vector2.ZERO)
	draw_string(_caps_font(), Vector2(target.position.x, 402), I18n.t("results.best", {"best": "%06d" % best_score}), HORIZONTAL_ALIGNMENT_CENTER, target.size.x, 13, Color(0.70, 0.76, 0.90))
	if done and score > _best_at_start and score > 0:
		var badge_a := 1.0 if fmod(_age, 0.8) < 0.55 else 0.45
		var badge_text := I18n.t("results.new_best")
		var bw := DISPLAY_FONT.get_string_size(badge_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 13).x + 32.0
		var badge := Rect2(W * 0.5 - bw * 0.5, 414, bw, 26)
		draw_rect(badge, Color(HoloUI.AMBER, 0.9 * badge_a))
		draw_string(DISPLAY_FONT, Vector2(badge.position.x, badge.position.y + 18), badge_text, HORIZONTAL_ALIGNMENT_CENTER, bw, 13, Color(0.08, 0.04, 0.02, badge_a))
	var row := Rect2(420, 454, 440, 42)
	var blink := 0.75 + 0.25 * sin(_age * 5.0)
	var pts := PackedVector2Array([row.position + Vector2(12, 0), Vector2(row.end.x, row.position.y), row.end - Vector2(12, 0), Vector2(row.position.x, row.end.y)])
	draw_colored_polygon(pts, Color(accent.r * 0.3, accent.g * 0.22, accent.b * 0.12, 0.92))
	var closed := pts.duplicate()
	closed.append(pts[0])
	draw_polyline(closed, Color(accent, blink), 1.5)
	var hint_size := 14
	while hint_size > 10 and _caps_font().get_string_size(hint, HORIZONTAL_ALIGNMENT_LEFT, -1, hint_size).x > row.size.x - 70:
		hint_size -= 1
	draw_string(_caps_font(), Vector2(row.position.x + 20, row.get_center().y + 5), hint, HORIZONTAL_ALIGNMENT_LEFT, row.size.x - 70, hint_size, Color(1.0, 0.95, 0.86, blink))
	HoloUI.keycap(self, BOLD_FONT, Vector2(row.end.x - 46, row.get_center().y - 12), "R", 12, accent)
	var menu_label := I18n.t("pause.item_menu")
	var menu_w := _caps_font().get_string_size(menu_label, HORIZONTAL_ALIGNMENT_LEFT, -1, 12).x
	var mx := W * 0.5 - (menu_w + 30) * 0.5
	HoloUI.keycap(self, BOLD_FONT, Vector2(mx, 512), "M", 11, HoloUI.MUTED)
	draw_string(_caps_font(), Vector2(mx + 30, 526), menu_label, HORIZONTAL_ALIGNMENT_LEFT, -1, 12, HoloUI.MUTED)

func _draw_warning() -> void:
	var k := clampf(minf((WARNING_DURATION - _warning_t) / 0.25, _warning_t / 0.4), 0.0, 1.0)
	var band := Rect2(0, 316, W, 88)
	draw_rect(band, Color(0.35, 0.02, 0.02, 0.22 * k))
	HoloUI.stripes(self, Rect2(0, band.position.y, W, 10), Color(HoloUI.RED, 0.8 * k), 24.0, 11.0, _age * 60.0)
	HoloUI.stripes(self, Rect2(0, band.end.y - 10, W, 10), Color(HoloUI.RED, 0.8 * k), 24.0, 11.0, -_age * 60.0)
	var blink := 1.0 if fmod(_warning_t, 0.5) > 0.16 else 0.35
	HoloUI.glow_text(self, TITLE_FONT, Vector2(0, 372), I18n.t("hud.warning"), 44, Color(1.0, 0.86, 0.80, k * blink), Color(HoloUI.RED, k), HORIZONTAL_ALIGNMENT_CENTER, W, 1.3)
	draw_string(_caps_font(), Vector2(0, 390), I18n.t("hud.incoming"), HORIZONTAL_ALIGNMENT_CENTER, W, 12, Color(1.0, 0.62, 0.55, k))

func _draw_warp_in() -> void:
	var k := clampf(_age / WARP_IN, 0.0, 1.0)
	draw_rect(Rect2(0, 0, W, H), Color(0.01, 0.02, 0.05, pow(1.0 - k, 1.6)))
	for i in 28:
		var y := fposmod(float(i) * 97.31, H)
		var streak := (1.0 - k) * (260.0 + fposmod(float(i) * 53.7, 420.0))
		var x := fposmod(float(i) * 211.7 - _age * 2400.0, W + 600.0) - 300.0
		draw_line(Vector2(x, y), Vector2(x + streak, y), Color(0.6, 0.92, 1.0, 0.55 * (1.0 - k)), 1.5)
	draw_rect(Rect2(0, 0, W, H), Color(0.7, 0.95, 1.0, 0.35 * maxf(0.0, 1.0 - _age / 0.18)))

func _fit(font: Font, value: String, size: int, max_width: float) -> int:
	while size > 22 and font.get_string_size(value, HORIZONTAL_ALIGNMENT_LEFT, -1, size).x > max_width:
		size -= 2
	return size

func _text(value: String, pos: Vector2, size: int, color: Color, font: Font = UI_FONT, align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_LEFT, width: float = -1) -> void:
	draw_string(font, pos, value, align, width, size, color)

func _shadow_text(value: String, pos: Vector2, size: int, color: Color, font: Font = UI_FONT, align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_LEFT, width: float = -1) -> void:
	draw_string_outline(font, pos, value, align, width, size, 4, Color(0.0, 0.0, 0.03, 0.75))
	draw_string(font, pos, value, align, width, size, color)

## Latin all-caps labels get modest tracking; Chinese stays untracked.
func _caps_font(base: Font = MEDIUM_FONT) -> Font:
	if I18n.get_locale() != "en":
		return base
	if not _tracked_fonts.has(base):
		# Duplicate an existing FontVariation: wrapping it would drop its wght axis.
		var tracked: FontVariation
		if base is FontVariation:
			tracked = (base as FontVariation).duplicate() as FontVariation
		else:
			tracked = FontVariation.new()
			tracked.base_font = base
		tracked.spacing_glyph = 1
		_tracked_fonts[base] = tracked
	return _tracked_fonts[base]

## Split a localized "LABEL {value}" string so the value can use the display face.
func _split_value(key: String, token: String) -> PackedStringArray:
	var parts := I18n.t(key, {token: "\u0001"}).split("\u0001")
	return PackedStringArray([parts[0].strip_edges(), parts[1].strip_edges() if parts.size() > 1 else ""])

func _on_tuning_changed(_id: String) -> void:
	_apply_audio_tuning()
