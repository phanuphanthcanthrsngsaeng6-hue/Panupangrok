# Historical Comet Pinball template simplification

This document records the earlier source-game simplification, before the Space Pinball title and font updates. See [the current developer guide](source-game.md) for the active identity and font inventory.

This revision removes the marked Celestial Orbit label, the entire central C/P emblem and its concentric instrument graphics, and the table's bottom Comet Pinball / 01 caption in both locales. The launch prompt, multiplier, mission HUD, controls and main game title remain functional.

## Static presentation

The UI and playfield share `assets/template/observatory/background-placeholder.webp` as a permanent static background. There is no background shader, SubViewport, render-readiness callback, twinkling star pass, animated colour transition, milestone background pulse, background loading queue or ambience preparation indicator. Decorative gear sprites use a fixed frame. The retired high-resolution nebula and engraved textures are removed from the current managed asset set and game export; their original provenance and history remain available.

## Runtime boundaries

| Module | Responsibility |
| --- | --- |
| `scripts/comet_main.gd` | Table rendering, UI, input, save data, static background and audio setup. |
| `scripts/comet_physics.gd` | Ball simulation, collisions, launch and flippers. |
| `scripts/comet_rules.gd` | Missions, chains, multipliers, jackpots and Supernova progression. |
| `scripts/comet_observatory.gd` | HUD integration, multiball lifecycle, controls and presentation. |
| `scripts/comet_effects.gd` | Gameplay-only stardust, speed-driven fire and bounded comet particles; no background dependencies. |
| `scripts/comet_juice.gd` | Impact feedback and interactive HUD effects. |
| `scripts/comet_loading.gd` | Deferred BGM registration after the title is visible; no background assets. |

Gameplay, ball physics, three-ball credits, replay, pause, localization, font coverage, audio settings and local records are retained. Reduced Effects still reduces fire and shake. The convex flame geometry fix and its existing regression remain intact.

The existing source and pack checks verify gameplay and static-only presentation. Background-specific one-off installers were removed rather than leaving an unused alternate implementation in the template. Historical design notes describe earlier revisions; this file defines the current baseline.
