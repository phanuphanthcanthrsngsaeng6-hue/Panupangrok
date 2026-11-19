# Pinball template acceptance

The imported reference is `junnyboi/game-pinball` at `dc35d627eee1334881f3c8f3adca74ec40613d7e`. The maintained identity is logical choice `pinball`, stable template `game-pinball`, initial Addon revision `game-pinball-v1`. Its original table, collision simulation, artwork and soundtrack are retained.

## Verified game behavior

- Godot 4.7.2 imports cleanly. The managed source verifier runs seven outcome hooks, including real contact-driven gameplay, configuration variants, services and tuning.
- Timed flipper input reaches objective-backed victory: 64,595 points, 83 scored hits, eight physical flipper returns in about 31.6 simulated seconds. Tests also reach defeat through actual final-ball drains and the time limit.
- Forty router checks cover keyboard/gamepad/touch input, pause, settings isolation, confirmations, restored focus, retry, tutorial events and filtered local standings.
- A temporary two-stage project proves Next Stage loads a distinct table and fresh score/time without duplicate signals, extra audio voices or doubled music. Shipping stage data remains one observatory stage.
- Service checks cover bounded score totals, immutable results, deterministic local saves, malformed-data recovery, mixed English/Chinese names, localization and stage/tutorial validation.
- Native captures cover English and Chinese in landscape and portrait, including title, gameplay, tutorial, pause, results, score entry, standings and owner tuning.
- Twenty-five typed tuning controls preserve live/deferred application rules and sticky ranking integrity. The generator runs after final baseline changes.
- Managed release projection removes the owner panel and SandboxBridge and forces the tuning owner gate off. Exported-pack hooks check the actual game, resources, font bindings and release boundary.
- The Chinese font has 6,547 supported codepoints: 965,224 source bytes and 969,384 imported/exported resource bytes. Unsupported names are rejected; arbitrary Unicode and Traditional Chinese are not promised.

## Media and audio

All 18 managed media files were restored against their original SHA-256 and size. Four public font mappings remain unchanged. Fourteen previously session-bound assets were published through the signed-in dev Admin File Manager and downloaded without authentication for exact-byte verification. No image or music regeneration was needed.

The supplied game-specific soundtrack is retained. Its original provenance records `manus-tools/generate_music`; the exact provider/model was not recorded, so this conversion does not claim a verified Lyria 3 Pro receipt. The audio decodes without clipping. The shared browser BGM regression passes its real Godot Web loop/reentry checks and a main-thread stall check with zero silent chunks. Native semantic cue checks cover UI, sliders, flippers, nudge, targets, rewards, drains and terminal results. Subjective sound balance and loop quality remain part of user browser acceptance.

The standalone source retains historical visual-coverage records from its original Manus session. A fresh Addon import archives that session-bound evidence and source hash under `assets/template/provenance/source-session-visual-coverage.json`; it cannot serve as approval for a new project's Blueprint. The new project receives its own coverage binding through the normal initialization workflow.

## Reproduce

Set `GAME_RUNTIME` to a current installed Addon Game runtime containing `game-pinball-v2`, or to the verified Addon maintenance checkout's runtime when validating source. An initialized project receives this path in its init/attach receipt. Public media hydration does not require the original source Session.

```sh
node "$GAME_RUNTIME/sync-assets.mjs"
GAME_RUNTIME="$GAME_RUNTIME" bash tools/verify.sh --export
python3 tools/check_stage_routing.py
python3 tools/check_stage_routing.py --native
```

Use `tools/capture_native.gd` with a real renderer for visual review; it does not write player saves. Supported capture modes include title, game, tutorial, pause, result, record, standings and tweak, with optional `--portrait` and `--chinese` arguments.

Addon catalog/materialization/package checks, frozen manifests, source promotion, native Skill delivery, deployment and fresh-session adoption are separate integration evidence. Native tests and screenshots do not establish those results. User browser acceptance should confirm audio unlock/playback, touch feel, locale switching and release-player exclusion of tuning.
