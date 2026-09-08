# Action Keeper
[<img src="images/buymeacoffee.png" alt="Buy Me a Coffee" width="386">](https://www.patreon.com/cw/Breezeblocksgs)

Do you keep forgetting which actions your 32 monsters have already used? Do your easily distracted players return from a 30-second bathroom break with no idea whether they’ve spent their reaction? Your problems—and your players’ problems—are over! Action Keeper makes it easy to track actions, bonus actions, reactions, and even movement for every token on the battlefield!

Action Keeper is a compact combat action tracker for Foundry Virtual Tabletop. It gives every token its own simple panel for manually tracking Main Action, Bonus Action, Reaction, and Movement availability during combat — nothing is detected or automated, so it works with any system or house rule.

Author: Pedro Henrique Cesar Godoi Braz ([github.com/Breezeblocksgs](https://github.com/Breezeblocksgs/Action-Keeper))

## Installation

1. In Foundry, go to **Add-on Modules** → **Install Module**.
2. Paste this manifest URL into the **Manifest URL** field:
   ```
   https://github.com/Breezeblocksgs/Action-Keeper/releases/latest/download/module.json
   ```
3. Click **Install**, then enable Action Keeper in your world's module settings.

## Features
![Demo](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHczemx0eW9va3Nlano2anBubmNzcHQxcHV1M3R2aDkwcWYyY2VlbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KV65RqzfzL5Tom46kW/giphy.gif)

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

## Compatibility

Compatible with Foundry VTT v14, and likely with any game system, since it uses only core Foundry features (no system-specific APIs).

## Support

Found a bug? Report it on the [issue tracker](https://github.com/Breezeblocksgs/Action-Keeper/issues).
