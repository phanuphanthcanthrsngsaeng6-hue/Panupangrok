# Game Template — Real-Time Strategy

This versioned source is owned by the Webdev Addon. Use the installed Game workflow for initialization, preview, release and publishing. Matching gameplay source: template-provenance.json. Existing projects are never overwritten by a new starter.

For online multiplayer, read [the shared service guide](docs/game-multiplayer.md).

## Shared game-development workflow

Applies to Standard effort, not `fast_prototype`; Fast uses its dedicated section instead. Keep edits scoped and preserve explicit constraints.

### Preserve the selected template
Extend the initialized project and keep its working simulation, controls, saves and delivery. Integrate supplied
games into that project. The first Preview must show the requested game, not a renamed demo; replace the Generic
maze gameplay unless a maze was requested.

### First-checkpoint completion contract
Deliver the requested goal, actions and outcome loop with understandable controls and feedback, recovery or replay
where it fits, coherent readable visuals, the necessary start, pause and results screens, and any requested
deliverable. Match run length and content to the brief; there is no minimum playtime, campaign, extra mode or screen
quota. Prioritize gameplay, broken resources, responsiveness and visible defects, and stop when the requested
experience works. Add art, audio or polish only for a concrete benefit. Leaderboards, new Tweak controls and extra
languages are optional; required Share OG and explicit media, concept or feature requests are not.
Default to desktop. Add or test touch controls, portrait layouts or mobile-browser support only when the user asks.
Sharing a Web link is not a mobile request. Keep inherited controls working without expanding mobile coverage.

Choose the [delivery scope](game-delivery.md#delivery-scope-and-stopping-boundary) from the request. Ordinary managed
delivery is check → save-release.mjs → applicable check --pack → push the exact SHA and confirm the checkpoint.
Documentation-only edits need no engine boot. Do not add audit reports, speculative test suites, a separate
self-review phase or duplicate validation workers.

### Ownership boundaries
Keep flow, authoritative simulation and scoring, input, entities, tuning, presentation and persistence in their
existing owners; cosmetics never decide collisions or rewards. Offline authority stays in Godot and online authority
on the dedicated server. WASD is reserved for player movement or camera panning, never abilities or menu actions;
leave it unbound when nothing moves, and update remapping, tutorials and hints when replacing conflicting shortcuts.

### Gameplay feedback and optional polish
Make actions, damage, rewards and outcomes readable with fitting cues. Reuse feedback and add effects only where they improve readability or the requested feel; particles, reward flights, shake and animated counters are optional. Keep overlays input-transparent, cosmetics independent of simulation and reduced-motion settings intact.

### Tutorial content boundary
Explain goals, controls and rules briefly in the game's language; simple games may use a start-screen hint.
A staged tutorial needs a working Skip that releases input/pause locks and remembers dismissal. Keep implementation values
and Tweak controls out of player instructions.

### Optional local leaderboard
Add local standings only when requested or integral to scoring and replay, and keep a useful existing one; changes
keep bounded records, once-only terminal submissions and deterministic ties. Online
rankings need an explicit request and the installed leaderboards guide; never provision a backend for an offline
game by default.

### Native verification
Reuse existing checks for changed gameplay, input, audio, saves, localization or tuning. For visual questions,
capture with the real renderer (`get_viewport().get_texture().get_image()` and `Image.save_png()`); headless Dummy
rendering proves nothing visual. Do not drive the Preview with browser automation, screenshots or self-tests unless
the user asks for browser debugging; use logs and report Web input, audio and layout as pending user acceptance.

### Concept work by request
Concepts are conditional, not a routine production step. Follow the Blueprint's recorded mockup choice and do not
offer a second concept workflow when the direction is already clear. For an explicit request, produce distinct,
coherent interpretations of the brief and keep the selected identity through revisions. The Game Concept Design flow
needs exactly three separate mockups generated under the recorded image consent, presented through the existing card
and explicitly approved; never label mockups as screenshots. Outside that flow, honor the requested count and
approval method. Mockup consent is not consent for production assets.
## Shared art and audio production

### Asset reuse and targeted production
Reuse suitable supplied, template and already available assets within their recorded permissions and the user's
source restrictions; template reuse needs no extra approval. Replace only assets that conflict with the requested
theme, lack necessary states or look visibly wrong. A new game or reskin does not require replacing every image,
animation, icon, track or effect unless the user asks for original art or a full replacement. Retain unused
reference files and supplied license notices, describe reused assets honestly, and update visible titles and themed
copy. Rename internal IDs only when needed, together with their consumers, saves and tests.

### Coherent scene and title art
Fulfill the requested visual scope with readable actors, hazards, UI and a coherent scene. Simple intentional
visuals are acceptable within the recorded source choice. Title and loading screens may reuse permitted game art
with live text; no separate key art is needed. A download is not integration: inspect the affected scene.

### 3D texture budgets
Budget the project's stored textures, including bytes embedded in GLB/glTF, not catalog masters or import limits.
Longest edge: 256–512 for small or distant props, 1024 by default, 2048 for close main actors or shared atlases,
4096 only for a justified visible difference. Never upscale, and keep UVs, channel packing and material bindings
intact. Remove replaced embedded bytes, keep ancestry and sync the changed files. If suitable tools are missing,
report it rather than replacing working assets. Claim only measured savings.

### Continuous animation and alignment
Use the approved animation method. AI continuous motion goes from approved static references to a guided
fixed-camera, in-place video to fixed-FPS extracted loops; independent poses need an approved stepped style. Keep a
shared canvas, scale, pivot and contact anchor across states and facings instead of per-state placement patches, and
keep raw masters outside the game. Check representative movement, reversal and ground contact with the native
renderer.

### Mandatory background removal for composited assets
Composited sprites, icons, portraits, cursors and loader art need clean real alpha that survives resize, import and
export; check changed edges on contrasting backgrounds at display scale. Opaque plates and terrain are exempt. Keep
words, numbers and HUD labels live, and never slice concept collages into runtime assets. Generate cursors on a
hot-pink or neon-green background and remove it before use.

### Seamless parallax backgrounds
Repeating layers must tile left and right without mirroring; check the joins between adjacent copies at the intended
scale after any crop, import or scale change. Side-scrollers keep a low scenic foreground above world actors and
below the HUD without hiding combat.

### Audio production as needed
BGM is optional unless requested or essential to the brief. Reuse a fitting permitted template, supplied or catalog
track when the source restrictions allow; silence with safe empty routes is valid, and a new Standard effort game is not a
reason to generate custom BGM. Honor explicit silence, supplied-only, AI-only and custom-music requests, and add only
useful event SFX. Generate audio only for an explicit request or a concrete
unmet need within recorded permissions: one usable result per needed track or cue, retried only for an actionable
correction. If requested custom music cannot be produced, report the unmet requirement. Audition changed audio and
ship compressed runtime audio, not raw WAV masters.

### Audio integration
Reuse the existing Music/SFX routing, gesture unlock and bounded voices, and keep empty routes safe across pause,
retry and scenes. New games that use audio keep the absolute base gains BGM 3× (+9.5424 dB) and SFX/UI 2×
(+6.0206 dB) over the inherited originals: place MusicBase/SfxBase before senders so each route crosses once,
replace old targets instead of stacking boosts, and keep the ≤0 dB guards, saved settings and explicit mixes.
Silent games need no gain plumbing, and existing delivered mixes stay unchanged. Spatial audio keeps real source
positions; music and global HUD sounds are separate. When music is used, keep the shared browser BGM adapter and
its native fallback.

### Asset generation mode gate
Recorded permissions govern generation regardless of mode or tools. Hybrid, AI or explicit permission covers
scoped visuals/SFX; mockup consent does not. Select models from live schemas/catalogs, not READMEs or asset history.
Images default to the latest available GPT Image; honor user choices. Tools record metadata automatically;
keep tool/provider/model/internal paths out of user copy and never guess model identity.

### Asset-production choice wording
Fast prototype follows its bounded workflow. New managed games call `webdev.init_project` once direction is clear,
with the complete brief; the canonical card settles unresolved choices, not parallel chat questions or a separate
Blueprint. Session-agent catalog search, access, downloads and delegation wait for successful initialization plus a
settled Blueprint, required plan and requested concept approval; in-flight or failed init is not success. Only
initialization's bounded metadata assessment may precede the card, never production downloads, generation or
integration. Standalone search or retrieval needs no project but does not justify speculative new-build sourcing.
Use the conversation language and call the catalog 游戏素材库 in Chinese. Recommend Hybrid mode for 2D, 3D and
unknown games. Card options for 2D/unknown: Manus game assets catalog, Hybrid mode, AI generation; Hybrid means
catalog plus AI art/audio, not scratch visuals. Known 3D: Game asset library and procedural generation, Hybrid mode,
AI generation. Only initialization's evidence-backed insufficient core-visual fit changes the first 3D label to
Procedural generation (Faster, lightweight, minimal token consumption); Unknown/sufficient fit or missing decoration
does not. Preserve historical accepted permissions; never infer them from option names or recommendations.
Only missing card support or a structured `planning_unavailable` receipt moves unresolved setup to one native
single-choice question; canonical state wins. For 2D/unknown: Manus game assets catalog, Hybrid (Recommended), AI
generated. Known 3D: Curated asset catalog and procedural (lowest token cost; catalog first, permitted gaps),
Hybrid (Recommended), AI generated (highest token cost). Keep these labels and this order, and record the answers.
No-questions sessions use
the recommended option within existing permission, which is not new consent. Additions to an existing game ask only
an unresolved production choice; delegation inherits constraints.
Accepted `choices.visualAssetSource: procedural` needs no repeated visual search/gap proof; audio follows its own
source restrictions and optional-production workflow. Catalog and Hybrid sourcing, including required-gap handling,
follows the game-asset-catalog Skill. Procedural permission never implies music composition.
## Shared Web runtime and delivery contract

### Browser-safe lifecycle
Bound and reuse voices, projectiles, particles, timers and subscriptions across pause, retry and scenes; change
pause or stream state on transitions, not every frame. Browser BGM uses the independent Web Audio renderer in
`scripts/manus/browser_bgm_player.gd`, never frame- or timer-fed PCM or finished-callback loops. It decodes once into
a bounded LRU AudioBuffer cache: call `prepare()` during loading or a transition before gameplay, then `play()`
reuses the buffer. Imported duplicates share an explicit original-path `buffer_key`, and changed PCM needs a new key.
Decode imported resources from the PCK, keep SFX in Godot and keep `thread_support=false`.
Route track, loop, position, pitch, mute, pause, duck, crossfade and Music/Master controls through the adapter.
External BGM does not inherit buses: the adapter mirrors player/bus volume, AudioEffectAmplify gain,
AudioEffectLimiter makeup and AudioEffectHardLimiter pre-gain only. HardLimiter ceiling/release and nonlinear
limiting are not reproduced; the independent browser renderer does not share Godot's combined BGM/SFX peak
protection. Positive HardLimiter pre-gain can clip browser BGM without the limiter's peak protection.
Reserve mix headroom and never rely on a Godot Master limiter to protect browser BGM. Keep native
Godot and the guarded Web fallback (`PLAYBACK_TYPE_STREAM` for long BGM) without overlapping backends; pending
autoplay waits for valid input, and stale starts are guarded. Stop voices and release removed cues with
`release_cached_stream()`, evict only unreferenced tracks, keep OS/bfcache suspend and restore, and release the context
on real teardown. Native tests cannot prove browser continuity through
main-thread stalls, so report that as pending user acceptance.

### Fast, recoverable startup
Keep the title and controls interactive with only the required fonts, UI, settings and small art. Defer scenes,
generation, media and decoding until needed, in bounded per-frame work; instantiate scenes on the main thread. Start
blocks duplicate transitions and reports recoverable content errors. Lazy PCK content reduces work, not transfer
bytes. Loading progress uses real bytes or phases and an indeterminate state for unknown totals; slow or stalled
notices are nonfatal, offer Retry, and clear on late success. When changing this mechanism, check cold load,
repeated Start, stall, unknown total, late success and Retry.

### Animated backgrounds without startup blocking
Show a small static placeholder immediately and retain it as fallback. Load animations asynchronously after the
title is interactive, outside Start/preload dependencies; swap on a ready frame, guarding exited scenes and stale
completions.

### Large explorable maps: presentation culling and live state
Offscreen simulation, pathfinding, orders, combat, economy, timers, replication, saves and minimap stay live. Cull
only cosmetics against current camera bounds, with sprite margins and separate fog; never remove gameplay actors,
projectiles or collision by distance. Reentry shows current state without replaying missed effects. Optimize measured
bottlenecks with existing spatial or dirty-region mechanisms; compare crowded, zoomed and revisited views to a
baseline rather than relying on empty-map FPS.

### Destructible props
Destroyed rubble and fragments render below actors in effective world z while keeping footprint, collision release
and reward position; reset restores the intact state.

### Game language
Use requested game language, else the user's Manus UI language (session default working language), then their
system language if known, then conversation language. Never use cloud sandbox locale.
New games use one language by default: pin this locale and disable inherited selectors and saved/OS/browser
auto-switching, overriding gameplay guides. Preserve existing-project localization; complete every exposed locale.
Requested Godot multilingual: [template localization](#requested-multilingual-support).
Completed single-language game: multilingual support is an optional follow-up; implement only on request.

### Tweak presentation language
For new Godot games, generate Tweak parameter labels, descriptions, category names, option labels
and human-readable units in the session default working language supplied by Node through Blueprint planning.
Reuse `data.state.language` from the canonical `webdev.config` GET `game/blueprint` already required after setup
or recovery; read it once if absent from context. Do not request a separate language parameter or infer it from
the game's language, conversation text, or sandbox/browser/OS locale. This overrides genre guides' Tweak
localization rules. Preserve existing projects' Tweak localization, including newly added controls, unless the user
asks to change it.

If init explicitly reports structured `planning_unavailable` with no saved Blueprint, use the session default
working language already known to the agent; only when unknown, use English. Pin the new catalog's presentation
language independently of the game's locale. Do not retry planning just to obtain a language or block the authorized
development. An ordinary Blueprint read error is not this fallback signal; follow the existing-game recovery
instructions and preserve existing Tweak text.

Keep parameter IDs, option values, source defaults, bounds and apply timing unchanged. Prevent the game's locale
from overriding the catalog's presentation language, including transport-generated description suffixes. This is
generation-time language selection; do not change the game's own language or add a player language selector or
live Manus-language switching.

### Requested multilingual support
Extend the selected template's localization system rather than adding a parallel one. Inspect its locale service,
catalogs and settings owner first: templates use different APIs, locale IDs and flat versus `{locale, entries}` JSON.
For example, Generic uses `autoload/i18n.gd` with `localization/en.json` and `zh-CN.json`; Tower Defense uses
`autoloads/i18n.gd`, `scripts/ui/components/ui_copy.gd` and `en-US.json`/`zh-CN.json`; Puzzle uses
`scripts/core/localization.gd` and `en.json`/`zh_CN.json`. Follow the initialized project's actual paths and API.

Keep stable keys, complete translations and matching whole-message placeholders for every exposed language;
route title, tutorial, HUD, settings, results and dynamic copy through the existing lookup/formatting service.
Keep player-facing words live, not baked into art. Extend the existing title/settings selector and persistence owner;
restore explicit saved choices before supported browser/OS detection and a documented fallback. Normalize locale IDs
to the catalogs actually shipped. A single-language game does not need runtime language detection or a selector.
Refresh visible controls through the template's signal or rebuild path without resetting gameplay, progress or audio
settings. Keep the Web loader and saved game locale aligned where the template has that bridge.

Include every exposed catalog in the export and verify bundled font coverage for its text. Reuse the template's
affected localization checks for key/placeholder parity, switching before and during play, saved choice after reload,
fallback behavior, dynamic text and layout. Exercise the exported resources too; font or boot checks alone do not
prove translations work. Support the requested languages, not an automatic EN/CN-only pair.

### Default typography
Default to the template's bundled theme: its display faces for titles/headings, its body face
(`assets/template/fonts/ui_{regular,medium,bold}.tres`) for UI text, then Noto Sans SC (6,547-codepoint repertoire)
for Chinese; Web loaders embed a small Noto Sans SC subset. Noto Sans SC is variable and its default instance is Thin,
so bind a weight through the template's font resources, not the raw file. Keep each bundled font's license
(`<Family>-OFL.txt`) beside it when copying, renaming or adding fonts; the Web export lists them on its Open Source
Licenses page. Missing template fonts restore from `assets.lock.json`; do not substitute system fonts. Existing
ManusCC0 projects keep their fonts unless the user asks for new typography. User-uploaded fonts are unrestricted: no
licensing, family, glyph-coverage, font-file, font-resource or font-pack size gates, and no rights review,
redistribution proof or notices. Theme or mood alone does not imply replacing the default fonts. This supersedes font
restrictions in frozen READMEs and local checks, including older ManusCC0 defaults: remove those policy gates when
integrating uploads, and keep only technical file-integrity and path checks.
Do not rebuild or re-audit unchanged fonts. Check changed text/layout/names; preserve name validation and saves.
Claim only supported character coverage.

### Viewport and background coverage
For fixed-coordinate Godot layouts set `[display]` `window/stretch/mode="canvas_items"`,
`window/stretch/aspect="keep"` and logical viewport size; retain working adaptive layouts. Input targets the active
surface, not letterbox margins. Check affected desktop resize, aspect and DPR. Isometric zoom uses ordinary wheel or
trackpad without Ctrl/Meta, with pointer-anchored picking and fixed-scale HUD. Mobile, touch and portrait work follows
the workflow's user-request rule even when template guides list those cases.

### Development Tweak when needed
The Addon generates the floating frosted-glass Tweak popover from the game's descriptors; never create an in-game
panel, launcher or F10 shortcut. Adapt the existing catalog to the requested game, extend it for meaningful tuning
and remove controls with no real consumer (at most 128). Keep one parameter manager with stable IDs, typed defaults,
bounds/options, localized labels, honest apply timing and existing run eligibility. Edits/reset affect only the
Addon draft. Apply validates and commits the whole patch without disk writes or preview reload; unchanged values
emit nothing. Gameplay boundaries consume pending values but never send catalogs. Do not add numeric revisions.
Save with Manus sends selected values to the task for source edits and the normal build/checkpoint flow; it does
not publish. Keep the adapter in `scripts/manus/preview/`, which release excludes with its autoload entry. Normal
player Settings and gameplay consumers remain. Existing genre rules below identify the actual parameter owners.

Follow [Tweak presentation language](#tweak-presentation-language) for the catalog and preview adapter.
For example, `tuning_transport.gd`'s `control_for` appends English timing text such as `Next Attack.` when mapping
apply modes. Localize that text in the project's adapter, preserving the actual apply boundary.

### Export constraints
Include runtime JSON/CSV/TXT through include_filter or Godot resources. Keep Web thread_support=false, resource paths discoverable, and the template-specific size budget. Use the Session port and the Addon preview/export workflow; do not hardcode the old Sandbox port or overwrite generated site/dist. Change identity through project.godot and the editable game loading shell, not generated HTML.

This current recipe overrides conflicting frozen README instructions; current shared rules and receipt commands take precedence.

**Campus Hero Defense** is a Godot 4.7.2 isometric campus-defense RTS. Choose Rookie, Varsity or Legend, watch or skip the comic intro, rescue classmates, secure four classrooms, train five hero types and defend Maplecrest High through eight Grimsby invasion waves. The Main Hall must survive. Yearbook results offer rematch, difficulty and a local Hall of Fame. English only; local play and scores.

For other isometric requests, reuse suitable projection, picking, camera and presentation code; the requested gameplay decides which campus systems remain. Update obsolete commands, assets, tests and guidance together.

## Authoritative owners

| Owner | Scope |
| --- | --- |
| `scripts/main.gd`, `scenes/main.tscn` | Title, difficulty, intro, match, pause, results and event fan-out. |
| `scripts/sim/rts_simulation.gd`, `scripts/sim/invader_ai.gd` | Gameplay, pathing, combat, economy, rooms, waves, outcomes and enemy squad decisions. |
| `scripts/data/hero_catalog.gd`, `scripts/data/campus_map.gd` | Hero/enemy stats, room labels/help, wave composition and the 36×36 campus with classroom production mappings. |
| `scripts/core/iso_projection.gd`, `scripts/view/battlefield.gd`, `scripts/view/campus_minimap.gd` | Projection, selection, commands, camera, rendering and minimap. |
| `scripts/view/unit_animator.gd`, `scripts/data/unit_anim_data.gd`, `scripts/view/fx_layer.gd` | Animation atlas frames, grounding, particles and comic effects. |
| `scripts/ui/hud.gd`, `scripts/ui/hero_theme.gd`, `scripts/ui/results_screen.gd` | Notebook HUD, hero cards, room controls, themed UI and yearbook results. |
| `scripts/data/comic_script.gd`, `scripts/ui/comic_intro.gd` | Two-page, six-panel story and its playback. |
| `scripts/audio/audio_director.gd`, `default_bus_layout.tres` | Music, SFX, voices and bus routing. |
| `scripts/services/high_score_store.gd`, `scripts/services/localization.gd`, `localization/en-US.json` | Local standings and presentation text. |
| `config/tweaks/catalog.gd`, `scripts/tuning/tweak_service.gd`, `scripts/manus/preview/tuning_adapter.gd` | Tweak descriptors, apply boundaries, settings and ranking eligibility. |

Change balance in these owners and update consumers together; only simulation decides damage, capture, rewards and outcomes.

Classroom production comes from `campus_map.gd`'s `CLASSROOMS[].trains`; `hero_catalog.gd`'s `ROOMS[].trains` also supplies UI/help lookups. Keep both mappings aligned when changing which hero a room trains. Main Hall production is initialized separately in `RtsSimulation._create_buildings()`.

## Gameplay invariants

`advance()` caps incoming time at 0.25 seconds and advances fixed 1/30-second ticks, at most eight per call. Preserve tick ordering, seeded behavior, walkable spawn placement, A* obstacle rules and simulation-owned separation. Pause and terminal results stop normal advancement; the match controller also blocks commands during pause/results. `main.gd` drains events once and distributes them to the battlefield, audio and HUD.

A match starts with three Hall Monitors, one Stretch, five trapped civilians and four enemy-held classrooms. The base squad cap is six; each secured classroom adds three. Queued heroes count toward population. Training validates room ownership, capacity, queue limit and Reputation before charging; it is FIFO, while cancel removes and refunds the last queued hero. Losing a classroom refunds and clears its remaining queue. Spawned heroes follow that room's rally point.

| Training room | Hero | Power |
| --- | --- | --- |
| Main Hall | Hall Monitor | Hall Pass Dash |
| Gymnasium | Stretch | Rubber Slam |
| Chemistry Lab | Blaze | Fireball |
| Cafeteria | Frost | Glacier Shield |
| Library | Psi | Mind Lift |

Hero contact makes a trapped classmate follow. Escort them to the Main Hall **or any secured classroom** to receive Reputation, score, Hype and escort XP. A lost escort leaves the classmate trapped again. Trapped classmates are excluded from enemy targeting and splash damage; escorted classmates are vulnerable. New trapped classmates spawn during play. Secured buildings heal nearby living heroes and classrooms add passive Reputation income.

Classroom control progresses only when one side's living units occupy the capture ring; opposing occupants contest it. Securing and losing rooms changes production, population capacity and income without deleting existing heroes. Powers keep their individual cooldowns. Knockouts grant XP and shared nearby XP to living heroes; heroes reach level three, gaining health and damage and healing on level-up. Dead records must not act, occupy rooms, heal or revive through delayed XP. Knockouts within the combo window earn combo score and Hype. Full Hype enables an eight-second Spirit Surge with increased hero damage and movement speed. Pep Rally separately spends Reputation to heal heroes, repair the Main Hall and temporarily boost damage.

Eight catalog waves enter from the parking lot, sports field and loading dock; Mecha-Mascot appears in waves five and eight. Ringing the bell advances the next wave and awards Reputation based on time skipped. Preserve staggered spawning, lane assignments, the Principal's Bulletin and ground telegraphs for Brute slams and Mecha-Mascot attacks. Victory requires the final wave to finish spawning and all wave invaders to be defeated; classroom guards are not an extra victory condition. Main Hall destruction takes precedence and causes defeat.

Stars: one for victory, one more for at least 60% Main Hall health, and one more for holding all four classrooms or rescuing at least ten classmates. Defeat earns no stars. `compute_stars()` owns this rule; results must not invent a second formula.

Difficulty applies enemy health/speed, starting Reputation and AI level together. Rookie squads mass before attacking, score objectives and raise guard alarms; Varsity adds focus fire, kiting, pincers and retreats; Legend adds regrouping, a low-health Main Hall rush and predictive rockets. Keep intent arrows, room threat notices and alarm/regroup cues consistent with actual squad state. The simulation test requires Rookie and Varsity autopilot victories; Legend is a completion/balance comparison, not a guaranteed win.

## Controls and presentation

| Input | Action |
| --- | --- |
| Left-click / drag | Select heroes; Shift adds or toggles selection. Double-click a hero selects its type on screen. |
| Hero cards | Select that type across the campus; double-click focuses it. |
| Right-click | Attack an enemy or move; with only an owned room selected, set its rally point. |
| E, then left-click | Issue one attack-move. Right-click or Esc cancels the armed mode. |
| C / Q / G | Stop / selected heroes' powers / Spirit Surge. |
| F / H / I or period | Select all heroes / focus Main Hall / select and focus an idle hero. |
| T / X | Queue training in the selected room (Main Hall by default) / cancel the selected room's last queued hero. |
| R / B | Pep Rally / call the next wave early. |
| Ctrl or Command + 1–5 / 1–5 | Assign / recall a squad. |
| WASD letters, arrows, edges, middle-drag | Pan; keys override edge scrolling. |
| Wheel, trackpad magnify, + / − | Zoom without modifier keys; base zoom is bounded from 0.5 to 1.5. |
| Space / Esc / M | Focus selection / close help, cancel attack-move or toggle pause / mute. |

Shift changes selection, not an order queue. Keep commands filtered to heroes, UI hit blocking, camera bounds and selection/room context coherent. The minimap can focus the camera and command the selected squad. Keep the 1280×720 `canvas_items`/`expand` layout, readable telegraphs and HUD, stable sprite grounding and reduced-motion option.

Opening Help during a match pauses gameplay and hides the pause menu beneath it. Closing Help returns to the paused menu for explicit Resume. Pause requests during the outcome delay or results must not re-enable commands or change outcome music; entering results clears pause/help overlays.

The inherited touch layout supports landscape: tap a hero to select; with a squad selected, tap an enemy to attack or ground to attack-move; drag to pan and pinch to zoom. Portrait shows a rotate-device prompt. Preserve this behavior; additional mobile work follows the shared workflow's scope rule. No gamepad mapping is supplied.

## Story, media and persistence

First Play, including Play from the Hall of Fame, opens the comic unless `user://story.cfg` records `intro_seen`. Click, tap, Space or Enter completes the current panel then advances; Skip/Esc exits. Finishing or skipping the first-run intro starts a match; both finishing and skipping Story replay return to the title. Keep narration cancellation, voice ducking and the transition guard when leaving the intro.

Use `assets/template/game/` for authored runtime media, `assets/template/catalog/` for retrieved catalog media and `assets/template/share/` for sharing art. `assets/template/runtime/audio/sfx/` contains twelve cues preloaded by `AudioDirector`; these are active consumers, not obsolete media. Keep `assets.lock.json` paths, hashes, sizes and provenance aligned with consumers. Bangers and Nunito are the game's bundled display/body fonts, with adjacent OFL notices and weighted Noto Sans SC fallbacks for Chinese player names. Preserve these bindings and the portable font verifier under `tools/`; system fonts must not hide missing glyphs.

English is the only shipped locale. Keyed UI and comic text use `I18n.t` and `localization/en-US.json`, but unit/room names, role text and room blurbs also live in `hero_catalog.gd`, while `invader_ai.gd` supplies raw lane names for notice placeholders. Retheming or adding a locale must cover these owners and the spoken English voice assets, not just the JSON catalog. `comic_script.gd` links localization keys and narration voice IDs; keep captions, narration and displayed names consistent.

Nine combat characters have idle/walk/attack atlases. `unit_anim_data.gd` records trimmed rectangles, full-cell margins, anchors and frame rates; `UnitAnimator` caches `AtlasTexture` frames. Preserve the shared ground anchor, facing overrides, stunned-frame freeze and slowed playback. Civilians retain static sprites. Animation source videos and full-cell masters are not packaged; do not claim they can be regenerated by inherited asset-processing scripts.

`AudioDirector` owns title/battle/boss tracks through the browser BGM adapter, a bounded 20-voice SFX pool and prioritized voice playback with cooldowns. Keep gesture unlock, music state changes, voice ducking, mute and world-event filtering; preserve the delivered mix. Playable releases exclude preview-only tuning modules.

`HighScoreStore` stores the top ten scores per difficulty in `user://high_scores.json`; names are sanitized and limited to 12 characters. Results capture eligibility before ending the run. Gameplay/score tweaks taint the current run even if reset; cosmetic tweaks do not. Preserve LIVE/NEXT_ACTION/NEXT_SPAWN/NEXT_RUN boundaries: spawn and training boundaries apply pending values before their first read, and `TweakService.begin_run()` activates all pending modes before eligibility and fresh simulation setup. Keep ordinary mute/reduced-motion preferences separate from temporary preview patches.

## Verification

Use receipt-resolved `GODOT_BIN`/`GAME_RUNTIME` and matching 4.7.2 Web templates. Restore the lock into a disposable copy before importing; never create `.godot`, exports or captures inside a frozen starter.

For UI/input tests, use a custom user directory containing `Tests` in the disposable project. `RTS_UI_CAPTURE_DIR` enables screenshots.

```bash
"$GODOT_BIN" --headless --editor --path . --import
"$GODOT_BIN" --headless --path . --script res://tests/simulation_test.gd
# Rendered captures as relevant to the change; use a real display or xvfb on Linux:
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/visual_capture.gd
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/anim_capture.gd
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/comic_capture.gd
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/ai_capture.gd
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/drag_select_probe.gd
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/ui_flow_test.gd
"$GODOT_BIN" --rendering-method gl_compatibility --path . --script res://tests/camera_input_test.gd
# After Addon initialization installs canonical runtime scripts:
npm run check
npm run preview:build
npm run build
```

The simulation suite covers setup, rescue, capture/training, powers, levels, combos/Surge, telegraphs, stars, local standings, defeat, AI and full-match autopilot. `AI_PROBE=1` selects the autopilot timeline only; it is not a substitute for the full suite. Captures write to `/tmp/hallhero_captures` and require visual review; the comic capture resets its test profile's story preference. Use an isolated test profile. Check camera/selection, first Play, Story replay, Help/Resume, outcome input blocking, results/rematch, animation anchors and AI intent. Native checks do not establish browser audio/input acceptance. Debug Preview must retain its tuning bridge and connect to Tweak; the canonical release projection removes the bridge and its autoload. Canonical Web build remains single-threaded and excludes docs, tests and generated QA artifacts.
