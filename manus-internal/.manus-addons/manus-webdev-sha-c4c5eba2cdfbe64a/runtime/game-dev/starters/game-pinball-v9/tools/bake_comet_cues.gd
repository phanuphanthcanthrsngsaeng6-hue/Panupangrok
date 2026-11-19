extends SceneTree
## Authoring-only reproduction of the supplied Comet Pinball one-shots.
## Excluded from Web exports. Does not compose or generate background music.
const CUE_IDS := ["ui.confirm", "ui.cancel", "player.action", "enemy.impact", "score.reward", "game.pause", "game.victory", "game.defeat"]

func _initialize() -> void:
	DirAccess.make_dir_recursive_absolute("res://assets/template/audio/cues")
	for id: String in CUE_IDS:
		var cue := _make_sound(id)
		var path := "res://assets/template/audio/cues/" + id.replace(".", "-") + ".wav"
		if cue.save_to_wav(path) != OK:
			push_error("Could not save " + path)
			quit(1)
			return
		print("BAKED ", path, " ", cue.data.size(), " PCM bytes")
	quit()

func _make_sound(id: String) -> AudioStreamWAV:
	# Original one-shot mechanical cues, not BGM: spring sweeps, clacks and brass resonances.
	var durations := {"ui.confirm":0.12,"ui.cancel":0.08,"player.action":0.45,"enemy.impact":0.25,"score.reward":0.40,"game.pause":0.12,"game.victory":0.7,"game.defeat":0.65}
	var freqs := {"ui.confirm":880.0,"ui.cancel":160.0,"player.action":140.0,"enemy.impact":620.0,"score.reward":1040.0,"game.pause":350.0,"game.victory":780.0,"game.defeat":240.0}
	var duration: float = durations[id]
	var freq: float = freqs[id]
	var data := PackedByteArray()
	var count := int(22050 * duration)
	data.resize(count * 2)
	var rng := RandomNumberGenerator.new()
	rng.seed = id.hash()
	for i in count:
		var t := float(i) / 22050
		var envelope := exp(-t * 9.0) * minf(t * 800.0, 1.0) * minf((duration-t)*150.0, 1.0)
		var phase := TAU * freq * t
		if id == "player.action": phase = TAU * (freq*t + 460*t*t)
		if id == "game.defeat": phase = TAU * (freq*t - 120*t*t)
		var ring := sin(phase) * 0.55 + sin(phase*2.71)*0.22 + sin(phase*4.13)*0.09
		var click := rng.randf_range(-1,1) * exp(-t * 95.0) * 0.35
		var sample := int(clampf((ring*envelope + click)*0.48, -1, 1) * 32767)
		data.encode_s16(i*2, sample)
	var stream := AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = 22050
	stream.data = data
	return stream
