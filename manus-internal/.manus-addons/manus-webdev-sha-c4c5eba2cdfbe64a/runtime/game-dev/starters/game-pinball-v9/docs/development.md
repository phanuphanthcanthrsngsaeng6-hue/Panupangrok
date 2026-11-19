# Development workflow

[Back to README](../README.md) · [Configuration reference](configuration.md)

## Setup

Use Godot **4.7.2**, the version used for this template's checks, with its matching Web export templates. A different engine version should be treated as an upgrade requiring revalidation. The project is a native Godot project; it does not require React, a database or a backend server for gameplay.

For a complete local copy with media present:

```sh
godot --headless --path . --editor --import --quit
godot --editor --path .
```

For an attached Manus Game project, `GAME_RUNTIME` and the preview host/port come from the current Session's project context. Do not persist an installed Addon path in source, invent a port or initialize a replacement project. When assets from a source-only clone are missing, restore them through the supported asset workflow:

```sh
node "$GAME_RUNTIME/sync-assets.mjs"
```

Standalone restoration requires a current Addon Game runtime containing `game-pinball-v2`. All 18 shipped lock entries now use verified permanent public URLs. The supported runtime can hydrate a clean copy without the original source Session. Asset licensing/provenance remains separate from restoration.

## Edit and validate

The stage registry is `config/stages.json`; its default table is `config/pinball-template.json`. Keep `pinball-template.schema.json` with it. JSON files do not accept comments or trailing commas.

```sh
# Validate the active file.
godot --headless --path . --script tools/validate_template.gd

# Validate another complete configuration without activating it.
godot --headless --path . --script tools/validate_template.gd -- res://docs/examples/four-bumper-table.json
```

After editing JSON, restart the native run. In a managed Preview, request the normal build and reload Preview. Replay deliberately retains the same configuration snapshot for run consistency.

For code-level fixtures, set a scene instance's `configuration_override` to a complete configuration dictionary **before adding it to the tree**. The scene validates that dictionary too. Standalone `Physics.new(config)` and `Rules.new(config)` expect a configuration that has already passed `TemplateConfig.validate(config)`; this avoids per-ball repeated schema work during multiball.

## Verification

| Check | Purpose |
| --- | --- |
| `tools/validate_template.gd` | Active or alternative JSON validation with a shell exit status. |
| `tools/template_config_check.gd` | Custom target counts, real contact scores, multiplier/skill/chain/jackpot settings, mission order, free play, invalid inputs, resized-board fit, HUD, multiball and replay. |
| `tools/comet_acceptance.gd` | Default title/tutorial, charge, real input-driven play, scoring, flipper returns, pause, objective victory/natural-drain defeat, replay, localization, audio and saves. |
| `tools/observatory_acceptance.gd` | Default contact-driven missions, extra-ball physics, jackpots, timers, nudge, drain economy, reduced effects and reset. |
| `tools/pinball_gameplay_check.gd` | Pause/modal routing, real input routes, restart, terminal immutability and stage outcomes. |
| `tools/pinball_services_check.gd` | Score bounds, local save recovery, names, localization and stage/tutorial services. |
| `tools/tuning_acceptance.gd` | Catalog validation, application boundaries, persistence and sticky eligibility. |
| `tools/check_stage_routing.py [--native]` | Isolated two-stage route, distinct table defaults, score reset and stable signal/audio ownership. |
| `tools/juice_check.gd` | Bounded feedback and the corrected convex comet-flame geometry. |
| `tools/comet_pack.gd` | Exported title/gameplay/replay, resources, configuration/schema, bounded Chinese font and absence of removed background code. |

The managed verifier reads `game-verification.json`:

```sh
npm run check
```

For focused local work:

```sh
godot --headless --path . --script tools/template_config_check.gd
```

Headless mode checks logic without opening a window. A real renderer can also run the same fixture in an isolated virtual display on Linux:

```sh
xvfb-run -a godot --audio-driver Dummy --path . --script tools/template_config_check.gd
```

A renderer execution without errors is useful, but not a substitute for manually checking readability and tuning a new layout. The complete-play fixtures contain intentional default-table assumptions, such as `[9, 3, 3]` mission goals and three run credits. Update these fixtures when you intentionally change those defaults. The supplied alternative configuration is validated independently without replacing the shipping default.

For geometry changes, play through launch, multiple flipper returns, all mission types, multiball and natural drains. Test pause, return to title and replay. Check narrow/portrait layouts, translated labels, ball visibility and consistent collision/art alignment. Do not diagnose a new table solely from a stationary screenshot.

## Managed Preview

Reuse the Session's assigned listener if its `/__manus__/game-status` identifies this project. Request a build with the existing command:

```sh
npm run preview:build
npm run preview:status
```

A configuration-only edit still requires a new Preview export because JSON is packed with the game. Do not modify generated Preview files or revive an unrelated project's server. Optional BGM loading remains post-title; there are no animated-background requests to wait for.

## Export and release

A normal Manus release uses the attached project's current Game release contract: validate source, refresh and integrate canonical Git through the supported transport, prepare/save matching source and release artifacts, verify the resulting pack, then push the exact prepared SHA for checkpoint registration. Do not attempt remote Git operations while the platform reports that canonical wiring is unresolved.

The core commands, once those prerequisites are satisfied, are:

```sh
node "$GAME_RUNTIME/save-release.mjs" --message "Describe your pinball change"
npm run check -- --pack
```

The save command alone is not a recorded remote checkpoint. The subsequent canonical push and its platform receipt establish saving. Publication is separate and must use the current authorization and supported publication workflow. Never edit manifest hashes, generated `site/` files or release fingerprints to force readiness.

For a standalone export in an attached workspace:

```sh
npm run build
```

This produces `dist/standalone/` without publishing. Serve it over HTTP rather than opening its HTML with `file://`. A source-only Godot export can use the `Web` preset, but it is not the Manus release projection: the managed release profile additionally removes development tooling and applies its explicit autoload and owner-tuning patches. Do not claim the two outputs have identical boundaries.

`export_presets.cfg` retains `config/*.json` in the package, including the active data and schema. `game-release-profile.json` excludes developer tools, fixtures, captures and documentation. Keep these boundaries intact. The four-bumper example is documentation/test input, not an extra runtime table downloaded in the background.

## Troubleshooting

| Symptom | Check and correction |
| --- | --- |
| Configuration error panel | Run the validator, fix the named path, required field, type/range or cross-field relationship, then restart. |
| A changed value has no effect | Ensure the active file was edited, not just the example. Rebuild/reload Preview or restart the native run; replay keeps its original snapshot. |
| Editor cannot resolve the example's schema after copying | Set the copied file's `$schema` to `./pinball-template.schema.json`. Runtime validation uses the bundled local schema regardless of that editor hint. |
| Bumper looks too large or small for its collision | Review both physical `radius` and art `visual_radius`; the cap contains a decorative surround. |
| Ball catches at a rail/flipper seam | Align adjoining endpoints and keep at least a ball-diameter route; do not close the drain. |
| Shooter does not clear the gate | Check `spawn`, `gate_y`, gravity, launch energy, exit position and retry speed together. |
| Bank never awards a hit | Its nonzero `normal` must face the approaching ball. Check cooldown, location and reachable routes. |
| Mission never completes | Check its event kind, goal, target availability and reachability. Rollover contacts only score when unlit. |
| Jackpot moved but still appears at another target | Check `bumper_id`, validate it, and restart; IDs rather than array indices select the jackpot bumper. |
| Audio is silent before interaction | Web audio needs a user gesture; also check mute/volume and deferred BGM readiness. |
| New background seems blurry | The shared static image is intentionally small. Replace it through the normal asset workflow if needed; do not reintroduce animated-background loading. |
| Web export misses configuration | Retain the `config/*.json` include filter, then rebuild and run the pack check. |
| Source-only clone misses media | Restore the known managed assets; do not modify storage locks or add unverified download URLs. |
| New label overflows | Shorten the localized configuration text, respect schema limits and review both UI layouts. |

In Manus, `.manus-logs/devserver.log` describes import/export problems and `.manus-logs/browserConsole.log` captures reported runtime errors. Preserve logs when diagnosing a failure. Fix the earliest concrete problem rather than repeatedly rebuilding an unchanged failing candidate.

## Distribution checklist

Before distributing a derivative, set its application/UI/loading/sharing identity, decide its save namespace and score compatibility, and review asset redistribution rights. Preserve provenance and the font contract. Include source configuration, schema and developer documentation with editable source; exclude developer-only tools and documentation from the playable export.

This template supplies reusable versions of its existing pinball mechanics. It does not provide a visual table editor, arbitrary gameplay scripting, online leaderboards or multiplayer. Those are separate extensions with their own implementation and verification requirements.
