# Pinball audio

Pinball retains its supplied original soundtrack, **Celestial Drift**, and eight
original mechanical one-shots. `asset-provenance.json` records generation and
transformation evidence; `assets.lock.json` owns exact restoration hashes and
storage paths. The former Generic scaffold's intentional silence no longer
describes this game.

Celestial Drift was generated for this game through `manus-tools/generate_music`
as an instrumental, 96 BPM cosmic electronic track with warm pads, glassy notes
and soft mechanical percussion. The supplied receipt does not identify its
provider/model, so no exact model claim is made. The authored Ogg loop is 118.484
seconds after trim, a 1.25-second overlap and loudness normalization. Preserve
this track; no replacement or additional composition was made for conversion.

`autoload/audio_director.gd` owns semantic cue paths, registration, Music/SFX/UI
bus routing, bounded voices, cooldowns, button subscriptions, mix and playback.
The main scene requests cues and supplies saved settings. Music is prepared
after the interactive title and starts only after a real input gesture. The
same track spans title, gameplay and results; pause/settings/tutorial suspension
preserves its playback position. Browser exports use the current shared cached
Web Audio BGM player; native builds use its streaming Godot fallback.

| Cue | Supplied sound / event |
| --- | --- |
| `music.title`, `music.gameplay` | Celestial Drift; one shared continuous track |
| `ui.confirm`, `ui.hover`, `ui.focus`, `ui.select` | Short confirmation chime; navigation/selection aliases are attenuated |
| `ui.cancel`, `ui.invalid` | Back/cancel and invalid-entry clack |
| `player.action`, `player.nudge` | Spring sweep; launcher and nudge |
| `player.flipper` | Attenuated mechanical pause clack |
| `enemy.impact` | Metallic bumper and target impact |
| `score.reward` | Score/progression accent |
| `ball.drain`, `game.defeat` | Falling metallic accent; drain alias is attenuated |
| `game.pause` | Pause clack |
| `game.victory` | Completed-objective accent |

`tools/bake_comet_cues.gd` is the offline authoring source for the eight original
PCM16 one-shots. Reproduction during conversion matched every supplied lock hash
and byte size. It never generates BGM and is excluded from player exports.

All 18 managed assets are now restored from the supplied source project, including
Celestial Drift. Their byte sizes and SHA-256 values match `assets.lock.json`.
No replacement music or new compositions were needed. Fourteen original media
files were republished without changing their bytes for permanent public restoration. The source
track and all eight SFX decode successfully; release/native playback and the
shared browser BGM regression gate are verified separately from listening review.
