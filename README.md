# Action Keeper

Compact, player-only action tracker for Foundry VTT combat (Main Action / Bonus Action / Reaction / Movement). Manual toggles only — no automation, no reads of D&D5e item/actor data.

Targets **Foundry VTT v14** (verified against the locally installed build: generation 14, build 367, stable) and **D&D5e 5.3.3** (verified installed system; module makes no dnd5e-specific calls).

## Install for local testing

This repo is not inside Foundry's User Data directory. To test:

```bash
ln -s "/home/pedrohcg/Área de trabalho/foundry-modules/Action Keeper" \
      "/home/pedrohcg/.local/share/FoundryVTT/Data/modules/action-keeper"
```

(A symlink named exactly `action-keeper` is required — Foundry matches the folder name to `module.json`'s `id`.) Then enable **Action Keeper** in a world's Module Management, as a non-GM player.

## Automated tests (pure logic only)

```bash
npm test
# or: node --test tests/*.test.mjs
```

18 tests cover `scripts/state.mjs` (slot/count logic) and `scripts/combat-transition.mjs` (reset/idempotency logic), with no Foundry runtime required. All 18 currently pass.

## Manual runtime test matrix (not yet executed — requires a running world with 2+ clients)

- [ ] GM sees no panel, no Scene Control button, no notifications
- [ ] Player sees Scene Control button; clicking toggles the panel
- [ ] GM starts combat → each player's panel resets and opens/stays closed per their `Auto-open` setting
- [ ] Two simultaneous players have independent counts/toggles
- [ ] Advancing a turn (not round) does not reset
- [ ] Advancing the round resets all connected players exactly once
- [ ] Changing slot counts mid-combat preserves existing toggles
- [ ] Closing and reopening the panel preserves current-round state
- [ ] Refresh mid-round preserves toggles; reconnect after a round change resets correctly
- [ ] Ending combat (`Combat.endCombat()` and manual deletion) obeys each player's `Auto-close` setting
- [ ] Starting a second Combat gives a fresh state
- [ ] No duplicate panel instances; minimizing/moving works; no console errors or unhandled rejections

## Known limitations

- Only unit tests for pure logic were executed. Full multi-client runtime behavior above has **not** been tested and must not be assumed correct until run.
- `authors` is intentionally omitted from `module.json` (no author info was provided, and none was invented).
- Not published; no release artifacts created.
- All per-user settings use `scope: "client"` (browser `localStorage`), not `scope: "user"`. Verified in this build's own `common/documents/setting.mjs`: `scope: "user"` settings are stored as world `Setting` Documents, and *creating* one requires the `SETTINGS_MODIFY` permission — which regular Players don't have by default. That made every write silently fail permission for non-GM players. `client` scope has no such gate. Trade-off: tracker state is per-browser/device, not synced across devices for the same Foundry account.
