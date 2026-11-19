class_name AudioDirector
extends Node
## Music (title / battle / final showdown), pooled SFX with variants, and a single-voice bark queue.

const BrowserBgmPlayer = preload("res://scripts/manus/browser_bgm_player.gd")

const MUSIC_TRACKS := {
	&"title": preload("res://assets/template/game/audio/music/bgm_title.ogg"),
	&"battle": preload("res://assets/template/game/audio/music/bgm_battle.ogg"),
	&"boss": preload("res://assets/template/game/audio/music/bgm_boss.ogg"),
}
const SFX_STREAMS := {
	&"wave_bell": [preload("res://assets/template/game/audio/sfx_wave_bell.ogg")],
	&"wave_horn": [preload("res://assets/template/game/audio/sfx/wave_horn.ogg")],
	&"rescue": [preload("res://assets/template/game/audio/sfx_rescue.ogg")],
	&"coin": [preload("res://assets/template/game/audio/sfx/coin.ogg")],
	&"combo": [preload("res://assets/template/game/audio/sfx/coin.ogg")],
	&"ui_click": [
		preload("res://assets/template/catalog/sfxmint-ui-click/ui-click-01.wav"),
		preload("res://assets/template/catalog/sfxmint-ui-click/ui-click-02.wav"),
		preload("res://assets/template/catalog/sfxmint-ui-click/ui-click-03.wav"),
	],
	&"ui_hover": [
		preload("res://assets/template/catalog/sfxmint-ui-hover/ui-hover-01.wav"),
		preload("res://assets/template/catalog/sfxmint-ui-hover/ui-hover-02.wav"),
	],
	&"ui_confirm": [preload("res://assets/template/catalog/sfxmint-ui-click/ui-click-02.wav")],
	&"ui_cancel": [preload("res://assets/template/runtime/audio/sfx/ui_cancel.ogg")],
	&"ui_error": [preload("res://assets/template/runtime/audio/sfx/ui_error.ogg")],
	&"unit_select": [preload("res://assets/template/runtime/audio/sfx/unit_select.ogg")],
	&"order_move": [preload("res://assets/template/runtime/audio/sfx/order_move.ogg")],
	&"order_attack": [preload("res://assets/template/runtime/audio/sfx/order_attack.ogg")],
	&"order_work": [preload("res://assets/template/runtime/audio/sfx/order_work.ogg")],
	&"punch": [
		preload("res://assets/template/catalog/sfxmint-impact-punch/impact-punch-01.wav"),
		preload("res://assets/template/catalog/sfxmint-impact-punch/impact-punch-02.wav"),
		preload("res://assets/template/catalog/sfxmint-impact-punch/impact-punch-03.wav"),
		preload("res://assets/template/catalog/sfxmint-impact-punch/impact-punch-04.wav"),
	],
	&"zap": [preload("res://assets/template/game/audio/sfx/zap.ogg")],
	&"attack_magic": [preload("res://assets/template/runtime/audio/sfx/attack_magic.ogg")],
	&"attack_ranged": [preload("res://assets/template/runtime/audio/sfx/attack_ranged.ogg")],
	&"impact_damage": [preload("res://assets/template/runtime/audio/sfx/impact_damage.ogg")],
	&"ko": [preload("res://assets/template/game/audio/sfx/ko.ogg")],
	&"goon_grunt": [preload("res://assets/template/game/audio/sfx/goon_grunt.ogg")],
	&"ai_alarm": [preload("res://assets/template/game/audio/sfx/ai_alarm.ogg")],
	&"ai_charge": [preload("res://assets/template/game/audio/sfx/ai_charge.ogg")],
	&"ai_retreat": [preload("res://assets/template/game/audio/sfx/ai_retreat.ogg")],
	&"unit_death": [preload("res://assets/template/runtime/audio/sfx/unit_death.ogg")],
	&"portal": [preload("res://assets/template/game/audio/sfx/portal.ogg")],
	&"train": [preload("res://assets/template/game/audio/sfx/train.ogg")],
	&"capture": [preload("res://assets/template/game/audio/sfx/capture.ogg")],
	&"objective_secured": [preload("res://assets/template/runtime/audio/sfx/objective_secured.ogg")],
	&"structure_destroyed": [preload("res://assets/template/runtime/audio/sfx/structure_destroyed.ogg")],
	&"hall_hit": [preload("res://assets/template/game/audio/sfx/hall_hit.ogg")],
	&"rally": [preload("res://assets/template/game/audio/sfx/rally.ogg")],
	&"surge": [preload("res://assets/template/game/audio/sfx/surge.ogg")],
	&"levelup": [preload("res://assets/template/game/audio/sfx/levelup.ogg")],
	&"power_monitor": [preload("res://assets/template/game/audio/sfx/dash.ogg")],
	&"power_blaze": [preload("res://assets/template/game/audio/sfx/fireball.ogg")],
	&"power_frost": [preload("res://assets/template/game/audio/sfx/ice.ogg")],
	&"power_psi": [preload("res://assets/template/game/audio/sfx/psi.ogg")],
	&"power_stretch": [preload("res://assets/template/game/audio/sfx/stretch.ogg")],
	&"boss_roar": [preload("res://assets/template/game/audio/sfx/boss_roar.ogg")],
	&"boss_stomp": [preload("res://assets/template/game/audio/sfx/boss_stomp.ogg")],
	&"rockets": [preload("res://assets/template/game/audio/sfx/rockets.ogg")],
	&"slam": [preload("res://assets/template/game/audio/sfx/slam.ogg")],
	&"victory": [preload("res://assets/template/game/audio/sfx/victory.ogg")],
	&"defeat": [preload("res://assets/template/game/audio/sfx/defeat.ogg")],
	&"comic_page": [preload("res://assets/template/game/audio/sfx/comic_page.ogg")],
	&"comic_slam": [preload("res://assets/template/game/audio/sfx/comic_slam.ogg")],
	&"comic_sting": [preload("res://assets/template/game/audio/sfx/comic_sting.ogg")],
}

const VOICE_STREAMS := {
	&"monitor_power": preload("res://assets/template/game/audio/vo/monitor_power.ogg"),
	&"monitor_select": preload("res://assets/template/game/audio/vo/monitor_select.ogg"),
	&"monitor_level": preload("res://assets/template/game/audio/vo/monitor_level.ogg"),
	&"blaze_power": preload("res://assets/template/game/audio/vo/blaze_power.ogg"),
	&"blaze_select": preload("res://assets/template/game/audio/vo/blaze_select.ogg"),
	&"blaze_level": preload("res://assets/template/game/audio/vo/blaze_level.ogg"),
	&"frost_power": preload("res://assets/template/game/audio/vo/frost_power.ogg"),
	&"frost_select": preload("res://assets/template/game/audio/vo/frost_select.ogg"),
	&"frost_level": preload("res://assets/template/game/audio/vo/frost_level.ogg"),
	&"psi_power": preload("res://assets/template/game/audio/vo/psi_power.ogg"),
	&"psi_select": preload("res://assets/template/game/audio/vo/psi_select.ogg"),
	&"psi_level": preload("res://assets/template/game/audio/vo/psi_level.ogg"),
	&"stretch_power": preload("res://assets/template/game/audio/vo/stretch_power.ogg"),
	&"stretch_select": preload("res://assets/template/game/audio/vo/stretch_select.ogg"),
	&"stretch_level": preload("res://assets/template/game/audio/vo/stretch_level.ogg"),
	&"pa_wave": preload("res://assets/template/game/audio/vo/pa_wave.ogg"),
	&"pa_final": preload("res://assets/template/game/audio/vo/pa_final.ogg"),
	&"pa_room": preload("res://assets/template/game/audio/vo/pa_room.ogg"),
	&"pa_surge": preload("res://assets/template/game/audio/vo/pa_surge.ogg"),
	&"pa_victory": preload("res://assets/template/game/audio/vo/pa_victory.ogg"),
	&"pa_defeat": preload("res://assets/template/game/audio/vo/pa_defeat.ogg"),
	&"pa_welcome": preload("res://assets/template/game/audio/vo/pa_welcome.ogg"),
}
## Comic-intro narration and character lines. Played through the story channel (no bark queue or cooldown).
const STORY_VOICE_STREAMS := {
	&"intro_n1": preload("res://assets/template/game/audio/vo/intro_n1.ogg"),
	&"intro_n2": preload("res://assets/template/game/audio/vo/intro_n2.ogg"),
	&"intro_coach": preload("res://assets/template/game/audio/vo/intro_coach.ogg"),
	&"intro_n3": preload("res://assets/template/game/audio/vo/intro_n3.ogg"),
	&"intro_principal": preload("res://assets/template/game/audio/vo/intro_principal.ogg"),
	&"intro_n5": preload("res://assets/template/game/audio/vo/intro_n5.ogg"),
	&"intro_n6": preload("res://assets/template/game/audio/vo/intro_n6.ogg"),
}

## Voice priority: announcer beats heroes; level-ups beat power barks; selection barks are lowest.
const VOICE_PRIORITY := {"pa": 4, "level": 3, "power": 2, "select": 1}
const VOICE_KEY_COOLDOWN := 5.0
const VOICE_GAP := 0.35
const VOICE_QUEUE_LIFETIME := 3.0

const CUE_POLICY := {
	&"wave_bell": {"bus": &"SFX", "volume": -4.0, "pitch": 0.0, "cooldown": 1.0, "priority": 3, "max": 1},
	&"wave_horn": {"bus": &"SFX", "volume": -2.0, "pitch": 0.0, "cooldown": 2.0, "priority": 4, "max": 1},
	&"rescue": {"bus": &"SFX", "volume": -4.0, "pitch": 0.03, "cooldown": 0.2, "priority": 3, "max": 2},
	&"coin": {"bus": &"UI", "volume": -9.0, "pitch": 0.06, "cooldown": 0.06, "priority": 1, "max": 3},
	&"combo": {"bus": &"UI", "volume": -6.0, "pitch": 0.0, "cooldown": 0.08, "priority": 2, "max": 2},
	&"ui_click": {"bus": &"UI", "volume": -4.0, "pitch": 0.05, "cooldown": 0.04, "priority": 2, "max": 2},
	&"ui_hover": {"bus": &"UI", "volume": -14.0, "pitch": 0.06, "cooldown": 0.06, "priority": 0, "max": 1},
	&"ui_confirm": {"bus": &"UI", "volume": -3.0, "pitch": 0.02, "cooldown": 0.05, "priority": 2, "max": 2},
	&"ui_cancel": {"bus": &"UI", "volume": -3.0, "pitch": 0.01, "cooldown": 0.05, "priority": 2, "max": 2},
	&"ui_error": {"bus": &"UI", "volume": -2.0, "pitch": 0.0, "cooldown": 0.15, "priority": 3, "max": 1},
	&"unit_select": {"bus": &"UI", "volume": -6.0, "pitch": 0.025, "cooldown": 0.10, "priority": 1, "max": 1},
	&"order_move": {"bus": &"SFX", "volume": -4.0, "pitch": 0.025, "cooldown": 0.10, "priority": 2, "max": 2},
	&"order_attack": {"bus": &"SFX", "volume": -3.0, "pitch": 0.02, "cooldown": 0.10, "priority": 2, "max": 2},
	&"order_work": {"bus": &"SFX", "volume": -5.0, "pitch": 0.025, "cooldown": 0.15, "priority": 1, "max": 2},
	&"punch": {"bus": &"SFX", "volume": -12.0, "pitch": 0.08, "cooldown": 0.06, "priority": 1, "max": 3},
	&"zap": {"bus": &"SFX", "volume": -13.0, "pitch": 0.08, "cooldown": 0.08, "priority": 0, "max": 2},
	&"attack_magic": {"bus": &"SFX", "volume": -9.0, "pitch": 0.05, "cooldown": 0.10, "priority": 1, "max": 2},
	&"attack_ranged": {"bus": &"SFX", "volume": -10.0, "pitch": 0.04, "cooldown": 0.12, "priority": 0, "max": 2},
	&"impact_damage": {"bus": &"SFX", "volume": -15.0, "pitch": 0.05, "cooldown": 0.08, "priority": 0, "max": 2},
	&"ko": {"bus": &"SFX", "volume": -7.0, "pitch": 0.07, "cooldown": 0.08, "priority": 2, "max": 3},
	&"goon_grunt": {"bus": &"SFX", "volume": -9.0, "pitch": 0.12, "cooldown": 0.5, "priority": 1, "max": 1},
	&"ai_alarm": {"bus": &"SFX", "volume": -6.0, "pitch": 0.06, "cooldown": 2.5, "priority": 2, "max": 1},
	&"ai_charge": {"bus": &"SFX", "volume": -8.0, "pitch": 0.08, "cooldown": 3.0, "priority": 2, "max": 1},
	&"ai_retreat": {"bus": &"SFX", "volume": -9.0, "pitch": 0.1, "cooldown": 4.0, "priority": 1, "max": 1},
	&"unit_death": {"bus": &"SFX", "volume": -5.0, "pitch": 0.025, "cooldown": 0.2, "priority": 2, "max": 2},
	&"portal": {"bus": &"SFX", "volume": -10.0, "pitch": 0.06, "cooldown": 0.9, "priority": 1, "max": 2},
	&"train": {"bus": &"SFX", "volume": -4.0, "pitch": 0.03, "cooldown": 0.2, "priority": 2, "max": 2},
	&"capture": {"bus": &"SFX", "volume": -2.0, "pitch": 0.0, "cooldown": 0.5, "priority": 3, "max": 1},
	&"objective_secured": {"bus": &"SFX", "volume": -3.0, "pitch": 0.0, "cooldown": 0.35, "priority": 3, "max": 2},
	&"structure_destroyed": {"bus": &"SFX", "volume": -2.0, "pitch": 0.01, "cooldown": 0.30, "priority": 3, "max": 2},
	&"hall_hit": {"bus": &"SFX", "volume": -12.0, "pitch": 0.08, "cooldown": 0.35, "priority": 1, "max": 1},
	&"rally": {"bus": &"SFX", "volume": -2.0, "pitch": 0.0, "cooldown": 1.0, "priority": 3, "max": 1},
	&"surge": {"bus": &"SFX", "volume": -1.0, "pitch": 0.0, "cooldown": 1.0, "priority": 4, "max": 1},
	&"levelup": {"bus": &"SFX", "volume": -4.0, "pitch": 0.02, "cooldown": 0.25, "priority": 3, "max": 2},
	&"power_monitor": {"bus": &"SFX", "volume": -5.0, "pitch": 0.04, "cooldown": 0.15, "priority": 3, "max": 2},
	&"power_blaze": {"bus": &"SFX", "volume": -3.0, "pitch": 0.04, "cooldown": 0.15, "priority": 3, "max": 2},
	&"power_frost": {"bus": &"SFX", "volume": -4.0, "pitch": 0.03, "cooldown": 0.15, "priority": 3, "max": 2},
	&"power_psi": {"bus": &"SFX", "volume": -4.0, "pitch": 0.03, "cooldown": 0.15, "priority": 3, "max": 2},
	&"power_stretch": {"bus": &"SFX", "volume": -4.0, "pitch": 0.04, "cooldown": 0.15, "priority": 3, "max": 2},
	&"boss_roar": {"bus": &"SFX", "volume": 0.0, "pitch": 0.0, "cooldown": 3.0, "priority": 4, "max": 1},
	&"boss_stomp": {"bus": &"SFX", "volume": -2.0, "pitch": 0.03, "cooldown": 0.4, "priority": 3, "max": 1},
	&"rockets": {"bus": &"SFX", "volume": -4.0, "pitch": 0.03, "cooldown": 0.6, "priority": 3, "max": 1},
	&"slam": {"bus": &"SFX", "volume": -5.0, "pitch": 0.06, "cooldown": 0.25, "priority": 2, "max": 2},
	&"victory": {"bus": &"UI", "volume": -1.0, "pitch": 0.0, "cooldown": 1.0, "priority": 4, "max": 1},
	&"defeat": {"bus": &"UI", "volume": -1.0, "pitch": 0.0, "cooldown": 1.0, "priority": 4, "max": 1},
	&"comic_page": {"bus": &"UI", "volume": -3.0, "pitch": 0.05, "cooldown": 0.15, "priority": 3, "max": 1},
	&"comic_slam": {"bus": &"UI", "volume": -5.0, "pitch": 0.07, "cooldown": 0.08, "priority": 3, "max": 2},
	&"comic_sting": {"bus": &"UI", "volume": -3.0, "pitch": 0.0, "cooldown": 1.0, "priority": 4, "max": 1},
}

const SFX_POOL_SIZE := 20
const STATE_MUSIC_DB := {
	&"title": -12.0,
	&"intro": -19.0,
	&"match": -15.0,
	&"boss": -13.5,
	&"surge": -12.5,
	&"paused": -20.0,
	&"result": -19.0,
}
const STATE_TRACK := {&"title": &"title", &"intro": &"title", &"match": &"battle", &"boss": &"boss", &"result": &""}
const MUSIC_FADE := 0.45

var muted := false
var music_unlocked := false
var playback_log: Array[StringName] = []
var voice_log: Array[StringName] = []
var music_state: StringName = &"title"
var music_track: StringName = &"title"
var music_target_db := -12.0

var _music_player: BrowserBgmPlayer
var _voice_player: AudioStreamPlayer
var _voice_priority := 0
var _voice_queue: Array[Dictionary] = []
var _voice_cooldowns: Dictionary = {}
var _voice_gap_until := 0
var _players: Array[AudioStreamPlayer] = []
var _player_cues: Dictionary = {}
var _player_priorities: Dictionary = {}
var _player_started_ms: Dictionary = {}
var _cooldown_until_ms: Dictionary = {}
var _rng := RandomNumberGenerator.new()
var _music_tween: Tween
var world_event_filter: Callable
var _player_world_events: Dictionary = {}


func _ready() -> void:
	_rng.seed = 0x4D414E44415445
	_build_music_player()
	_build_sfx_pool()
	_apply_bus_mutes()


func _build_music_player() -> void:
	_music_player = BrowserBgmPlayer.new()
	_music_player.name = "Music"
	_music_player.bus = &"Music"
	_music_player.volume_db = music_target_db
	add_child(_music_player)
	_assign_track(music_track)


func _assign_track(track: StringName) -> void:
	var source := MUSIC_TRACKS.get(track) as AudioStreamOggVorbis
	if source == null:
		return
	var loop_stream := source.duplicate() as AudioStreamOggVorbis
	loop_stream.loop = true
	_music_player.buffer_key = source.resource_path
	_music_player.stream = loop_stream


func _build_sfx_pool() -> void:
	for index in range(SFX_POOL_SIZE):
		var player := AudioStreamPlayer.new()
		player.name = "SfxVoice%02d" % index
		player.max_polyphony = 1
		add_child(player)
		_players.append(player)
	_voice_player = AudioStreamPlayer.new()
	_voice_player.name = "Barks"
	_voice_player.bus = &"SFX"
	_voice_player.volume_db = 1.0
	_voice_player.finished.connect(_on_voice_finished)
	add_child(_voice_player)


## Browsers require a user gesture before audio; the game unlocks music on first input.
func unlock_music() -> void:
	music_unlocked = true
	ensure_bgm()


func ensure_bgm() -> void:
	if not music_unlocked or muted or _music_player == null or _music_player.playing or music_track == &"":
		return
	_music_player.play()


func _exit_tree() -> void:
	# Release looping stream playback before engine shutdown to avoid leaked Ogg resources.
	if _music_player != null:
		_music_player.stop()
		_music_player.stream = null
	for player: AudioStreamPlayer in _players:
		player.stop()
		player.stream = null
	if _voice_player != null:
		_voice_player.stop()
		_voice_player.stream = null


func set_music_state(next_state: StringName) -> void:
	music_state = next_state
	music_target_db = float(STATE_MUSIC_DB.get(next_state, STATE_MUSIC_DB[&"match"]))
	if _music_player == null:
		return
	if STATE_TRACK.has(next_state):
		var track: StringName = STATE_TRACK[next_state]
		if track != &"" and track != music_track:
			_crossfade_to(track)
			return
	if _music_tween != null and _music_tween.is_valid():
		_music_tween.kill()
	_music_tween = create_tween()
	_music_tween.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	_music_tween.tween_property(_music_player, "volume_db", music_target_db, 0.35)


func _crossfade_to(track: StringName) -> void:
	music_track = track
	if _music_tween != null and _music_tween.is_valid():
		_music_tween.kill()
	_music_tween = create_tween()
	_music_tween.tween_property(_music_player, "volume_db", -40.0, MUSIC_FADE).set_trans(Tween.TRANS_SINE)
	_music_tween.tween_callback(func() -> void:
		_assign_track(track)
		_music_player.volume_db = -30.0
		ensure_bgm())
	_music_tween.tween_property(_music_player, "volume_db", music_target_db, MUSIC_FADE * 1.4).set_trans(Tween.TRANS_SINE)


func toggle_muted() -> bool:
	set_muted(not muted)
	return muted


func set_muted(value: bool) -> void:
	muted = value
	_apply_bus_mutes()
	if muted and _voice_player != null:
		_voice_player.stop()
		_voice_queue.clear()
	if not muted:
		ensure_bgm()


func apply_tweak_values(values: Dictionary) -> void:
	set_muted(bool(values.get(&"audio.master.muted", muted)))
	_set_bus_volume(&"Music", float(values.get(&"audio.music.volume_db", 10.0)))
	_set_bus_volume(&"SFX", float(values.get(&"audio.sfx.volume_db", 2.5012253)))


func _set_bus_volume(bus_name: StringName, volume_db: float) -> void:
	var index := AudioServer.get_bus_index(bus_name)
	if index >= 0:
		AudioServer.set_bus_volume_db(index, clampf(volume_db, -80.0, 24.0))


func _apply_bus_mutes() -> void:
	for bus_name in [&"Music", &"SFX", &"UI"]:
		var index := AudioServer.get_bus_index(bus_name)
		if index >= 0:
			AudioServer.set_bus_mute(index, muted)


func play_ui(cue: StringName) -> bool:
	return play_cue(cue)


func play_cue(cue: StringName, world_event: Dictionary = {}, pitch_offset: float = 0.0) -> bool:
	if not world_event.is_empty() and not _world_event_is_audible(world_event):
		return false
	if muted or not SFX_STREAMS.has(cue):
		return false
	var policy := CUE_POLICY.get(cue, {}) as Dictionary
	var now := Time.get_ticks_msec()
	if now < int(_cooldown_until_ms.get(cue, 0)):
		return false
	if _active_instances(cue) >= int(policy.get("max", 2)):
		return false
	var priority := int(policy.get("priority", 1))
	var player := _available_player(priority)
	if player == null:
		return false
	var cooldown_ms := int(round(float(policy.get("cooldown", 0.1)) * 1000.0))
	_cooldown_until_ms[cue] = now + cooldown_ms
	var pitch_variance := float(policy.get("pitch", 0.0))
	var variants: Array = SFX_STREAMS[cue]
	player.stop()
	player.stream = variants[_rng.randi_range(0, variants.size() - 1)] as AudioStream
	player.bus = policy.get("bus", &"SFX") as StringName
	player.volume_db = float(policy.get("volume", -4.0))
	player.pitch_scale = maxf(0.3, 1.0 + pitch_offset + _rng.randf_range(-pitch_variance, pitch_variance))
	var id := player.get_instance_id()
	_player_world_events.erase(id)
	if not world_event.is_empty():
		_player_world_events[id] = world_event.duplicate(true)
	_player_cues[id] = cue
	_player_priorities[id] = priority
	_player_started_ms[id] = now
	player.play()
	playback_log.append(cue)
	if playback_log.size() > 128:
		playback_log.pop_front()
	return true


# ---------------------------------------------------------------- voice barks

func _voice_class(key: StringName) -> String:
	var text := String(key)
	if text.begins_with("pa_"):
		return "pa"
	return text.get_slice("_", text.get_slice_count("_") - 1)


## Plays a voiced bark or announcer line; higher priority lines interrupt, equal ones queue briefly.
func play_voice(key: StringName) -> bool:
	if muted or not VOICE_STREAMS.has(key):
		return false
	var now := Time.get_ticks_msec()
	if now < int(_voice_cooldowns.get(key, 0)):
		return false
	var priority := int(VOICE_PRIORITY.get(_voice_class(key), 1))
	if _voice_player.playing:
		if priority > _voice_priority:
			_voice_player.stop()
		elif priority >= 2:
			_voice_queue = _voice_queue.filter(func(entry: Dictionary) -> bool: return entry["key"] != key)
			_voice_queue.append({"key": key, "priority": priority, "expires": now + int(VOICE_QUEUE_LIFETIME * 1000.0)})
			_voice_queue.sort_custom(func(a: Dictionary, b: Dictionary) -> bool: return int(a["priority"]) > int(b["priority"]))
			while _voice_queue.size() > 2:
				_voice_queue.pop_back()
			return true
		else:
			return false
	_start_voice(key, priority)
	return true


func _start_voice(key: StringName, priority: int) -> void:
	_voice_cooldowns[key] = Time.get_ticks_msec() + int(VOICE_KEY_COOLDOWN * 1000.0)
	_voice_priority = priority
	_voice_player.stream = VOICE_STREAMS[key]
	_voice_player.pitch_scale = 1.0
	_voice_player.play()
	voice_log.append(key)
	if voice_log.size() > 64:
		voice_log.pop_front()


func _on_voice_finished() -> void:
	_voice_priority = 0
	_voice_gap_until = Time.get_ticks_msec() + int(VOICE_GAP * 1000.0)


## Plays a comic-intro line immediately, replacing whatever line is playing.
func play_story_voice(key: StringName) -> bool:
	if muted or _voice_player == null or not STORY_VOICE_STREAMS.has(key):
		return false
	_voice_queue.clear()
	_voice_player.stop()
	_voice_priority = 5
	_voice_player.stream = STORY_VOICE_STREAMS[key]
	_voice_player.pitch_scale = 1.0
	_voice_player.play()
	voice_log.append(key)
	if voice_log.size() > 64:
		voice_log.pop_front()
	return true


func stop_voice() -> void:
	_voice_queue.clear()
	if _voice_player != null:
		_voice_player.stop()
	_voice_priority = 0


func is_voice_playing() -> bool:
	return _voice_player != null and _voice_player.playing


func _active_instances(cue: StringName) -> int:
	var result := 0
	for player in _players:
		if player.playing and _player_cues.get(player.get_instance_id(), &"") == cue:
			result += 1
	return result


func _available_player(requested_priority: int) -> AudioStreamPlayer:
	for player in _players:
		if not player.playing:
			return player
	var oldest: AudioStreamPlayer
	var oldest_started := Time.get_ticks_msec() + 1
	for player in _players:
		var id := player.get_instance_id()
		if int(_player_priorities.get(id, 0)) > requested_priority:
			continue
		var started := int(_player_started_ms.get(id, 0))
		if started < oldest_started:
			oldest = player
			oldest_started = started
	return oldest


func cue_for_event(event: Dictionary) -> StringName:
	var event_type := event.get("type", &"") as StringName
	match event_type:
		&"wave":
			return &"wave_horn"
		&"spawn":
			return &"portal"
		&"rescued":
			return &"rescue"
		&"escort", &"queued":
			return &"order_work"
		&"trained":
			return &"train"
		&"secured":
			return &"capture"
		&"wave_cleared":
			return &"objective_secured"
		&"rally":
			return &"rally"
		&"surge":
			return &"surge"
		&"level_up":
			return &"levelup"
		&"combo":
			return &"combo"
		&"hype_full":
			return &"rescue"
		&"lost", &"hall_destroyed":
			return &"structure_destroyed"
		&"bonus":
			return &"coin"
		&"death":
			return &"ko" if int(event.get("team", 1)) == 1 else &"unit_death"
		&"alarm":
			return &"ai_alarm"
		&"squad_charge":
			return &"ai_charge"
		&"retreat":
			return &"ai_retreat"
		&"hall_hit":
			return &"hall_hit"
		&"boss":
			return &"boss_roar"
		&"power":
			return StringName("power_" + String(event.get("kind", &"")))
		&"telegraph":
			return &"rockets" if event.get("kind", &"") == &"rocket" else &""
		&"telegraph_hit":
			match event.get("kind", &"") as StringName:
				&"stomp":
					return &"boss_stomp"
				&"slam":
					return &"slam"
			return &""
		&"swing":
			return &"punch"
		&"impact":
			var attack := event.get("attack", &"") as StringName
			if attack == &"blaster":
				return &"zap"
			return &"attack_magic" if attack in [&"fire", &"psi"] else &"attack_ranged"
		&"hit":
			return &"impact_damage"
	return &""


func _world_event_is_audible(event: Dictionary) -> bool:
	return world_event_filter.is_valid() and bool(world_event_filter.call(event))


func _process(_delta: float) -> void:
	for player in _players:
		var id := player.get_instance_id()
		if not _player_world_events.has(id):
			continue
		if not player.playing or not _world_event_is_audible(_player_world_events[id]):
			player.stop()
			_player_world_events.erase(id)
	if not _voice_queue.is_empty() and not _voice_player.playing and Time.get_ticks_msec() >= _voice_gap_until:
		var now := Time.get_ticks_msec()
		while not _voice_queue.is_empty():
			var entry: Dictionary = _voice_queue.pop_front()
			if now <= int(entry["expires"]):
				_start_voice(entry["key"], int(entry["priority"]))
				break


const GLOBAL_EVENTS: Array[StringName] = [
	&"wave", &"rescued", &"trained", &"secured", &"lost", &"wave_cleared", &"rally", &"boss", &"hall_destroyed",
	&"bonus", &"queued", &"surge", &"level_up", &"combo", &"hype_full", &"telegraph", &"squad_charge",
]


func handle_simulation_event(event: Dictionary) -> bool:
	var cue := cue_for_event(event)
	if cue.is_empty():
		return false
	var event_type := event.get("type") as StringName
	var pitch := 0.0
	if event_type == &"combo":
		pitch = clampf(0.08 * float(int(event.get("count", 2)) - 1), 0.0, 0.8)
	if event_type == &"death" and int(event.get("team", 1)) == 1 and event.get("kind", &"") in [&"goon", &"brute"] and _rng.randf() < 0.35:
		var grunt := event.duplicate(true)
		grunt["position"] = event.get("pos", Vector2.INF)
		play_cue(&"goon_grunt", grunt)
	if event_type in GLOBAL_EVENTS:
		return play_cue(cue, {}, pitch)
	var positional := event.duplicate(true)
	positional["position"] = event.get("pos", Vector2.INF)
	return play_cue(cue, positional, pitch)


func play_outcome(result: StringName) -> bool:
	set_music_state(&"result")
	play_voice(&"pa_victory" if result == &"victory" else &"pa_defeat")
	return play_cue(&"victory" if result == &"victory" else &"defeat")


func is_bgm_looping() -> bool:
	return (
		_music_player != null
		and _music_player.stream is AudioStreamOggVorbis
		and (_music_player.stream as AudioStreamOggVorbis).loop
	)


func sfx_voice_count() -> int:
	return _players.size()


func registered_cue_count() -> int:
	return SFX_STREAMS.size()


func clear_diagnostics() -> void:
	playback_log.clear()
	voice_log.clear()
	_cooldown_until_ms.clear()
