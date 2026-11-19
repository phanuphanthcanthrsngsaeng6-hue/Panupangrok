# Configuration reference

[Back to README](../README.md) · [Active JSON](../config/pinball-template.json) · [Schema](../config/pinball-template.schema.json) · [Complete example](examples/four-bumper-table.json)

The active file is `config/pinball-template.json`. Its `version` is `1`. Every setting in the default object is required unless represented by an allowed empty list; unknown keys are errors. Start from the complete default or example rather than creating a partial file. The local schema provides editor completion and authoritative structural limits.

## Coordinates and units

Coordinates are **table-local logical units**, with `[0, 0]` at the top-left, positive X rightward and positive Y downward. The default board is `[480, 740]`. Velocities use units/second, acceleration uses units/second², durations use seconds, and score fields are nonnegative whole numbers. A point or vector is `[x, y]`; a rectangle is `[x, y, width, height]`.

The renderer uniformly fits `table.size` into a fixed responsive table slot. It centers the board without stretching its aspect ratio. It does not multiply your geometry coordinates when you change the size. Keep the drain below the board and author an open route to it.

## Table geometry

| Field | Meaning |
| --- | --- |
| `size` | Logical `[width, height]`, each from 240 to 1,600. |
| `surface_inset` | Static-background inset `[left, top, right, bottom]`. Must leave a positive playfield area. |
| `drain_y` | A ball below this Y is saved or drained. Must exceed board height. |
| `rails` | 1–128 independent `{ "a": [x,y], "b": [x,y] }` contact segments. Distinct endpoints required. |
| `rail_radius`, `rail_restitution` | Capsule collision radius and rebound factor shared by rails. Art width derives from the radius. |
| `labels` | Positions for multiplier, save status, reward feedback and the `[x,y,w,h]` toast rectangle. |
| `decoration` | Static orbit center/radii, tick radius, arch, gear positions/sizes and inlane-arrow positions. `enabled: false` removes these decorative details without changing collisions. |

Rails are individual segments, not an automatically closed polygon. Do not connect the bottom drain gap accidentally. Rail placement, flipper endpoints and slingshots must leave enough space for a ball diameter; structural validation cannot prove that a custom layout is fun or free of traps.

### Launcher

| Field | Meaning |
| --- | --- |
| `spawn` | Resting ball position and shooter-lane X. |
| `gate_y` | Upward crossing that leaves the one-way shooter lane. |
| `exit` | Position immediately after crossing the gate; also the saved-ball re-entry point. |
| `exit_velocity`, `exit_charge_velocity` | Exit velocity is `exit_velocity + charge × exit_charge_velocity`. |
| `launch_speed`, `charge_speed` | Initial vertical speed is `-(launch_speed + charge × charge_speed)`. |
| `charge_rate` | Charge gained per second, capped at 1. |
| `lane_bottom`, `retry_speed` | Lower lane boundary and upward recovery speed. |
| `walls` | Visual `{a, b, width}` shooter rails; lane physics clamps X to `spawn[0]` until the gate. |
| `spring_anchor` | Bottom-launcher spring artwork position. |

The geometry must satisfy `gate_y < spawn[1] <= lane_bottom`. If the shooter fails to reach its gate, adjust geometry and energy together. The launcher walls are visual guides, not additional playfield collision segments; add a segment to `table.rails` if it must also collide after launch.

### Flippers

`flippers.left` and `flippers.right` define the existing A/left and D/right control roles. Each has its own configuration:

| Field | Meaning |
| --- | --- |
| `pivot` | Fixed contact and artwork pivot. |
| `rest_offset`, `active_offset` | Tip offsets relative to the pivot. The animated tip interpolates between these vectors. |
| `radius`, `restitution` | Capsule thickness and rebound factor. Artwork thickness follows radius. |
| `response` | Interpolation speed toward pressed or released state. |
| `hot_seconds` | Time after pressing during which a contact can receive the active strike. |
| `hit_below_pivot` | Maximum Y offset below the pivot eligible for the strike. |
| `strike_length` | Distance normalization for how far along the bat the ball contacts. |
| `kick_x`, `kick_x_along` | Horizontal strike strength; the right control mirrors its sign. |
| `kick_y`, `kick_y_along` | Upward strike strength and distance-dependent addition; upward velocities are negative. |

The contact factor is the pivot-to-ball distance divided by `strike_length`, clamped to `[0,1]`. A hot strike replaces velocity with the configured horizontal and vertical components. Moving the pivot does not automatically move an adjoining rail; update the rail endpoint as well to avoid a trapping seam.

## Targets

IDs must be unique within each target collection. Positions and relevant artwork/collision values are read from JSON, and cooldown/state arrays are sized from the lists rather than fixed counts.

### Bumpers

The template supports 1–64 bumpers. A complete entry is:

```json
{
  "id": "bonus",
  "position": [232, 220],
  "radius": 20,
  "visual_radius": 31,
  "kick": 180,
  "cooldown": 0.2,
  "points": 500,
  "color": "be9bff"
}
```

`radius` is the physical circular contact radius. `visual_radius` controls the transparent cap-art rectangle independently; the default art includes a decorative gear surround beyond the contact core. Tune both intentionally. `kick` adds outward speed after reflection. `cooldown` limits rewarded contacts, and `points` is the pre-multiplier value. `color` is six hexadecimal RGB digits without `#`.

A bumper's complete physical circle must fit inside the board. Keep enough separation from other bumpers and rails for intended ball routes. To move the jackpot, change `scoring.jackpot.bumper_id`; no center coordinate or fixed array index is required.

### Rollovers

`rollovers` supports 0–32 entries with `id`, `position`, `radius`, `cooldown`, `points` and `label`. These are non-solid sensors. The first eligible contact lights the target and scores. When every configured rollover is lit, the set clears, the multiplier increases, and the completion bonus is awarded. An empty list disables this set-completion mechanic; it is invalid when a mission requires rollover or multiplier events.

### Side banks

`banks` supports 0–64 entries with `id`, `position`, `normal`, `half_length`, `radius`, `restitution`, `kick`, `cooldown` and `points`. A nonzero `normal` is normalized at runtime. Its perpendicular direction defines the contact segment, permitting horizontal or angled targets rather than only left/right vertical banks.

Only the normal-facing side is energized. The reflected contact receives a kick along the normal and the configured score. Artwork and collision orientation use that same normal and half-length.

### Slingshots

`slingshots` supports 0–16 entries. Each contains `id`, contact endpoints `a`/`b`, a three-point `outline` for artwork, `impulse`, `radius`, `restitution`, `cooldown`, `damping`, `coil_threshold`, `coil_gain`, `coil_max` and `points`.

The rubber contact line is drawn at `a`/`b`; the triangle defines its surrounding panel. Keep them aligned when editing. The impulse vector defines the energized-facing direction. The added coil strength is `clamp((speed - coil_threshold) × coil_gain, 0, coil_max)`, applied after damping. This prevents slow repeated contacts from receiving an unconditional fixed boost. Slingshots share the simulation's slingshot cooldown; an energized contact uses the contacted sling's configured duration.

## Physics and run settings

| Section | Fields and behavior |
| --- | --- |
| `physics` | `ball_radius`, `gravity`, `drag`, `max_speed`, `substeps`; six substeps is the tuned default. |
| `physics` unsticking | `unstick_speed`, `unstick_above_y`, `unstick_seconds`, `unstick_impulse`; recovery applies only to a genuinely slow ball in the permitted region. |
| `gameplay` ball credits | `balls` supports 1–9. Extra balls during multiball are not additional run credits. |
| `gameplay` recovery | `next_ball_delay`, `ball_save_seconds`, `save_velocity`; the save re-entry uses launcher `exit`. |
| `gameplay` nudge | `nudge_cooldown`, `nudge_y`, `nudge_center_x`, `nudge_center_strength`; upward and center-seeking impulse applied to live balls. |

The speed cap, collision substeps and smallest collider dimensions interact. Aggressively increasing speed or reducing substeps can cause tunneling. Increasing board size without retuning energy/gravity can make targets unreachable. Validate changes with real trajectories and input, not JSON validation alone.

## Scoring pipeline

The following order is implemented by the physics and rules modules:

1. A bumper, rollover, bank or slingshot emits `target.points × current multiplier`. A skill shot emits its fixed configured points.
2. If the event is chain-eligible, the rules engine updates the chain and adds `round(base × bonus_per_link × max(0, chain − 1))`.
3. An eligible jackpot adds the fixed jackpot points.
4. Completing the active mission adds its fixed completion bonus.

The chain bonus applies to the base event, not to the jackpot or mission bonus. Points are not multiplied again in the controller. A rollover-set completion first updates the multiplier, then emits `completion_points × new multiplier`.

### Multiplier

`scoring.multiplier` contains `initial`, `step`, `cap` and `completion_points`. Initial and cap are integers from 1–100, step is 0–100, and initial cannot exceed cap. A completed rollover set still clears and pays its completion reward at the cap.

### Skill shot

`scoring.skill_shot` contains `enabled`, `charge_min`, `charge_max` and `points`. The inclusive charge window lies within `[0,1]`, with minimum below maximum. A launch inside that window is eligible for one award when it exits the shooter lane. The reward does not repeat on ball-save re-entry. Disabling it removes the cyan charge-window guidance.

### Chains

`scoring.chain` contains `enabled`, `seconds`, `cap`, `bonus_per_link` and `eligible_kinds`. Supported event names are `bumper`, `rollover`, `bank`, `sling`, `skill` and `multiplier`.

A different target extends the chain and refreshes its timer. Repeated contact with the same target does not extend or refresh it, although that event may still receive the existing chain bonus. Target identity is event kind plus its rounded event position; avoid coincident same-kind targets if they should count independently. Disabling chains does not disable mission progress.

### Jackpot

`scoring.jackpot` contains `enabled`, `bumper_id`, `points` and `cooldown`. When enabled, `bumper_id` must reference a configured bumper. The reward is available while the earned multiball jackpot window remains above zero. Its cooldown prevents rapid repeated contacts from generating multiple jackpots.

## Missions and multiball

`missions` is an ordered list of 0–8 objects. Every mission has `id`, `kind`, `goal`, `bonus`, and localized `title`, `label`, `short` and `objective` objects with `en`/`cn` fields. The supported kinds are the same named score events listed above. Goals are positive whole numbers.

HUD progress and active-target highlighting follow the current mission's event kind, not its original array index. Goals can exceed target count because they count qualifying events over time; rollover hits only qualify while unlit. Label lengths are bounded in the schema to fit the HUD. Use concise wording and supported Chinese glyphs.

An empty mission list enables free play and does not automatically launch multiball. When a nonempty mission sequence finishes, `multiball.enabled` determines whether the reward starts; when disabled, the sequence resets to its first objective for another cycle.

`multiball.spawns` holds 1–7 extra-ball entries with `position` and `velocity`. The original ball remains active, so total starting multiball count is **one plus this list's length**. `seconds` is the jackpot-window duration, not a forced destruction timer: after it expires, remaining extra balls continue until they drain. `spawn_save_seconds` protects newly spawned balls. Losing one live ball does not spend a run credit; only the final live-ball drain does.

## Validation and application boundaries

The loader checks types, required/unknown keys, array lengths, numeric ranges, finite numbers, IDs, vector dimensions, nondegenerate rails/slingshots, bank normals, board bounds, multiplier/window relationships, jackpot references and mission prerequisites. The schema and loader are versioned together. The runtime interprets the schema keywords present in this repository; extending it with unrelated JSON-Schema features also requires extending the runtime validator.

The loader reads local files only; the `$schema` field is an editor hint, not a remote resource fetch. No executable expressions, remote asset URLs or arbitrary callbacks are accepted. To add an entirely new mechanic, implement its physics/rules/rendering owner, update schema and loader validation, and add a regression before exposing a new setting.

Configuration validation establishes structure, not balance. After modifying geometry or scoring, test launch clearance, flipper returns, natural drains, mission reachability, multiball, pause and replay. Check both supported layouts and languages, and decide whether the old high-score namespace remains appropriate.
