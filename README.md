# Action Keeper

Action Keeper is a compact combat action tracker for Foundry Virtual Tabletop. It gives every token its own simple panel for manually tracking Main Action, Bonus Action, Reaction, and Movement availability during combat — nothing is detected or automated, so it works with any system or house rule.

Author: Pedro Henrique Cesar Godoi Braz ([github.com/pedrocgb](https://github.com/pedrocgb/))

## Features

- **Per-token tracking.** Each token keeps its own independent set of action slots. Select a token you own — or, as GM, any token — to bring up its tracker. Selecting multiple tokens with Shift shows the last one selected; deselecting it falls back to another still-selected token.
- **Four resource groups**, each with its own color and icon: Main Action, Bonus Action, Reaction, and Movement. Each group's slot count is configurable per token, from 1 to 5.
- **Two display styles.** Labeled buttons with icon and status text, or compact filled/hollow circles — switchable globally.
- **Automatic combat awareness.** Slots reset automatically when combat starts and at the start of each new round, for every token taking part in that combat. Tokens not currently in combat stay fully usable, with a small note that they're not participating.
- **Multi-language panel**, switchable instantly with no reload: English (US), Português (Brasil), Español, Deutsch, and Русский.
- **Native Foundry UI**: a standard application window (movable, minimizable) and a toggle button in the Token controls.
- Configurable auto-open/auto-close behavior around combat, and shared settings available to the GM in Foundry's own Game Settings menu.

## Requirements

- Foundry Virtual Tabletop v14.
- Works with any game system — the module only uses core Foundry Combat and Token APIs.
