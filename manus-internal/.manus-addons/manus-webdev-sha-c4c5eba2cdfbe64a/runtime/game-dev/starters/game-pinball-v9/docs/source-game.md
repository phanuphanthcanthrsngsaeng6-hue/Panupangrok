# Space Pinball Template

A configurable, single-table 2D pinball game built with Godot, integrated into Manus as **`pinball`**. The default JSON preserves the tuned pinball table, three-ball run, chains, mission sequence and earned multiball. Developers can customize the existing table and scoring systems without editing GDScript.

The template uses **one static background**. Gameplay comet trails, stardust, fire and HUD feedback remain. A lightweight full-screen filter is controlled by the owner tuning catalog; there are no background viewports or animated-background downloads. Music is prepared after the title becomes available and does not gate Start.

## Developer guide

| Topic | Entry point |
| --- | --- |
| Active template configuration | [`config/pinball-template.json`](config/pinball-template.json) |
| Types, limits and editor completion | [`config/pinball-template.schema.json`](config/pinball-template.schema.json) |
| Geometry and scoring details | [Configuration reference](configuration.md) |
| Complete alternative table | [Four-bumper example](examples/four-bumper-table.json) |
| Setup, tests, export and troubleshooting | [Development workflow](development.md) |
| Previous simplification scope | [Static template baseline](template-baseline.md) |

## Quick start

The project is tested with **Godot 4.7.2**. Use matching export templates for Web builds. Node.js is required for the Manus-managed commands, not for running directly in Godot.

From a workspace containing the project and its assets:

```sh
godot --headless --path . --editor --import --quit
godot --path .
```

Use `godot --editor --path .` to open the editor. The entry scene is `scenes/main.tscn`; its router is `scripts/pinball_template.gd`, extending the original observatory controller.

A source-only Managed Git clone does not embed every hydrated media file. Restore its 20 hash-verified public assets through the supported asset workflow before importing. Do not copy the installed Manus runtime into this repository. See [setup](development.md#setup).

## Customize your first table

Edit `config/pinball-template.json`, validate it, then restart the running game:

```sh
godot --headless --path . --script tools/validate_template.gd
```

The validator exits with `0` on success or `1` on failure. Errors identify the setting or structural problem. Unknown fields are rejected, so misspelled settings cannot silently leave a rule unchanged. Invalid configuration blocks gameplay with an error panel rather than silently choosing another table.

Configuration is read once per running process, validated, and copied into simulation and rules objects. Replay reuses that snapshot; it does not reload JSON mid-run. Editing JSON requires restarting the native game or rebuilding and reloading Preview.

For a complete alternative, back up your current JSON, then copy the example:

```sh
cp docs/examples/four-bumper-table.json config/pinball-template.json
```

Change its `$schema` field to `./pinball-template.schema.json` for editor completion in the new location, validate again, and restart. This example has **four bumpers, five rollovers, four bank targets, five ball credits, changed scoring and a two-ball multiball reward**. It is a real configuration alternative, not another hard-coded scene, and is a starting point for balance testing.

## Stage loop and records

The shipped observatory stage gives three balls and at most 240 seconds. Complete the three missions, enter earned multiball, and score a jackpot before its window closes to win. Exhausting the ball credits or the stage timer ends in defeat. Pause freezes the simulation; Restart and Return to Title ask before abandoning an active run. Retry resets score, timers, effects, missions and extra balls.

`config/stages.json` selects each stage's table file, jackpot goal and time limit. Add a second validated definition with a unique ID and local configuration path; the victory screen then offers Next Stage. The stage contract requires a reachable mission sequence, multiball and jackpot. The lower-level table engine can still support free-play configurations for custom modes.

The score service accepts named events: bumper, rollover, bank, sling, flipper, skill, multiplier and save. The rules engine attaches chain, mission and jackpot bonuses to the originating contact event. Configured points flow through this one score service; totals are bounded to 999,999,999 and terminal results finalize once. Local records include name, score, stage, outcome, elapsed time, timestamp, configuration hash and eligibility. Top-ten ordering is deterministic. Practice/tuned records are labeled, and standings can filter to baseline runs. No online leaderboard is enabled.

First-run tutorial prompts follow launch, flipper, target and pause events. Each step can be skipped or time out safely; completion is versioned in the existing local settings. How to Play replays the tutorial. Score names allow 1–20 characters and at most 80 UTF-8 bytes. Common Simplified Chinese and mixed names work; characters outside the bundled repertoire are rejected instead of silently falling back to a system font.

## Owner tuning

Debug previews show a bottom-right Tweak Controls button and the F2 shortcut. The generated catalog has 25 controls across UI, Gameplay, Audio, Player, Enemies and Environment. It covers text/motion/filter effects, ball credits, gravity, flippers, launch/nudge, bumper force, score timing and audio buses. Requested values and active values are distinct; each row identifies live, next-action, next-spawn, next-stage or next-run application.

Only valid non-default deltas persist. Reset One and Reset All restore the baseline. Cosmetic values preserve ranking eligibility; applied gameplay/score changes taint the current run even if reset later. Tutorial runs are also marked ineligible. This is local metadata and creates no network feature.

After gameplay or balance changes, run `python3 tools/tuning_generate_catalog.py`, merge its generated locale entries, then rerun the verifier. Managed checkpoint/release projection excludes the owner panel and forces the owner gate off, including when a saved debug draft exists. Player audio/reduced-effects settings remain available.

## Configuration modules

| Section | Customizable behavior |
| --- | --- |
| `table` | Board dimensions, drain, rails, launcher, both flippers, variable target lists, static decorations and playfield label positions. |
| `physics` | Ball radius, gravity, drag, speed limit, integration substeps and unsticking behavior. |
| `gameplay` | Ball credits, next-ball delay, launch protection and nudge behavior. |
| `scoring` | Multiplier, rollover-set reward, skill-shot window/reward, chain eligibility/bonus/window/cap, jackpot target/reward/cooldown. |
| `missions` | Ordered event objectives, goals, bonuses and EN/CN HUD copy. An empty list enables free play. |
| `multiball` | Enablement, jackpot-window duration, extra-ball spawn positions/velocities and spawn protection. |

Rendering and physics use the same validated configuration. Board dimensions are fitted into the existing desktop or portrait table slot. Changing `table.size` changes the available coordinate area; it **does not automatically rescale authored coordinates or retune physics**.

The supported mechanics remain two controlled flippers, one shooter lane, circular bumpers and rollover sensors, capsule bank targets, slingshots and event-driven progression. New mechanics such as ramps, ball-lock devices or additional control groups require code; JSON is not a general-purpose scripting language.

## Architecture

| Module | Responsibility |
| --- | --- |
| `scripts/template_config.gd` | Local JSON loading, process-local cache, structural/semantic validation, geometry conversion and localized text helpers. |
| `scripts/comet_physics.gd` | Geometry, fixed-substep collisions, launcher, flippers, ball save and base score events. |
| `scripts/comet_rules.gd` | Chains, ordered mission progression and jackpot rules. |
| `scripts/comet_main.gd` | Input, UI primitives, table rendering, persistence, audio and configuration-error reporting. |
| `scripts/comet_observatory.gd` | Original mission HUD, multiball, nudge and configuration-aware artwork. |
| `scripts/pinball_template.gd` | Stage/run routing, dialogs, event tutorial and tuning boundaries. |
| `scripts/pinball_run.gd` | Named score awards and a single immutable result snapshot. |
| `scripts/pinball_leaderboard.gd` | Validated local top ten and atomic save recovery. |
| `scripts/pinball_stages.gd` | Stage registry validation and local configuration references. |
| `scripts/pinball_locale.gd` | English/Chinese keys, placeholders and stage mission copy. |
| `autoload/tuning_store.gd` | Typed requested/active settings and ranking integrity. |
| `scripts/comet_effects.gd` | Bounded gameplay stardust and speed-driven comet particles; no background subsystem. |
| `scripts/comet_juice.gd` | Impact rings, trails, shake and interactive HUD feedback. |
| `scripts/comet_loading.gd` | Deferred BGM registration only. |
| `autoload/audio_director.gd` | Audio buses, stream ownership and bounded playback voices. |

Physics emits score/contact events. The rules engine decorates base scores and advances objectives. The controller owns run state and extra physical balls, and maps events to audio, VFX and HUD feedback. Visual effects do not change scores or velocity.

## Verification

Run the validator for every JSON edit. Run the focused regression when changing the configuration loader or integration:

```sh
godot --headless --path . --script tools/template_config_check.gd
```

In an attached Manus Game workspace, set `GAME_RUNTIME` to the current runtime from that Session's project receipt, then use:

```sh
npm run check
npm run preview:build
```

The source verifier includes configuration, gameplay, mission/multiball, score/leaderboard/localization services, tweak validation and flame-geometry checks. Custom-configuration coverage includes different target counts, actual collisions and scores, altered multiball count, free play, malformed inputs, board fitting and replay. Export checks verify that the runtime JSON and schema ship with the game.

Existing complete-play fixtures intentionally describe the **default table**. After changing its geometry, update fixture trajectories and expected goals/scores to match your game. Do not weaken tests to hide broken drains or unreachable objectives. See [verification details](development.md#verification).

## Rebranding and presentation

Table/scoring changes belong in JSON. Identity and art remain explicit project concerns:

| Change | Owner |
| --- | --- |
| Application title | `project.godot` → `application/config/name`. |
| In-game title and general copy | `localization/en.json` and `localization/zh_CN.json`; mission copy is in stage configuration. |
| Loading title | `web/loading.html`; preserve its engine-ready lifecycle. |
| Sharing title, description and artwork | `game-sharing.json` and its referenced assets. |
| Static background | `assets/template/observatory/background-placeholder.webp`, referenced by `STATIC_BG`. |
| Bumper artwork | `assets/template/observatory/bumper.png`, referenced by `CAP`; configure each bumper's `visual_radius`. |
| Audio | `assets/template/audio/`, `scripts/comet_loading.gd` and `autoload/audio_director.gd`'s semantic cue registry. |

The title uses the full, unmodified **ManusCC0 Bold** font under **CC0-1.0**. The remaining fonts are OFL subset WOFF2 files: **Figtree** (UI body), **Noto Sans SC** (Chinese body and labels), **Cinzel** (headings and labels), **Oswald** (score numerals), and **Noto Serif SC** (Chinese titles and headings). See the [current font inventory](../assets/template/fonts/SOURCES.md) and retain the adjacent CC0 and OFL notices. Cinzel Decorative was replaced; its notice remains only in [historical font evidence](provenance/historical-font-licenses/CinzelDecorative-OFL.txt). Preserve the common **6,547-character SC repertoire** of the subset Chinese fonts (Noto Sans SC stays below 2,000,000 bytes). Do not replace them with system fonts or trim coverage to current labels. Keep custom Chinese copy within the supported repertoire and HUD labels concise.

Asset lineage and applicable licensing facts are in `asset-provenance.json`. A CC0 font license does not make every game asset CC0. Review each retained asset's provenance and redistribution terms before distributing a public template or derivative game.

## Persistence and controls

High score, tutorial state, locale, audio settings and reduced-effects preferences are local. The retained path `user://clockwork_comet.cfg` deliberately preserves existing records despite its legacy name. For a separate game, select a new save namespace intentionally and decide whether old scores should migrate; scores from materially different rules are not directly comparable.

| Action | Keyboard | Touch/mouse |
| --- | --- | --- |
| Flippers | Left/right arrows; gamepad shoulders | Bottom left/right pads |
| Charge/launch | Hold/release Space or Down; gamepad A | Hold/release Launch |
| Nudge during play | Space | Launch pad during play |
| Pause/resume | P or Escape; gamepad Start | Pause/resume button |
| Mute | M | Sound toggle |

## Release boundary

Preview, export, checkpoint and publication are distinct. Use the attached project's normal Game release workflow; never edit generated fingerprints by hand. The release profile excludes developer tools, tests and documentation while retaining the active JSON, schema, game code and required assets.

See [the development workflow](development.md) for setup, test commands, release boundaries and troubleshooting.
