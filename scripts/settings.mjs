import { MODULE_ID, SETTINGS, DEFAULT_COUNTS } from "./constants.mjs";

/** Register all Action Keeper settings. Must run during `init`. */
export function registerSettings() {
  const countSetting = (key, group) => {
    game.settings.register(MODULE_ID, key, {
      name: `ACTION_KEEPER.Group${group[0].toUpperCase()}${group.slice(1)}`,
      scope: "client",
      config: false,
      type: Number,
      default: DEFAULT_COUNTS[group],
    });
  };

  countSetting(SETTINGS.MAIN_COUNT, "main");
  countSetting(SETTINGS.BONUS_COUNT, "bonus");
  countSetting(SETTINGS.REACTION_COUNT, "reaction");
  countSetting(SETTINGS.MOVEMENT_COUNT, "movement");

  game.settings.register(MODULE_ID, SETTINGS.AUTO_OPEN, {
    name: "ACTION_KEEPER.AutoOpen",
    hint: "ACTION_KEEPER.AutoOpenHint",
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.AUTO_CLOSE, {
    name: "ACTION_KEEPER.AutoClose",
    hint: "ACTION_KEEPER.AutoCloseHint",
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.LABELED_BUTTONS, {
    name: "ACTION_KEEPER.LabeledButtons",
    hint: "ACTION_KEEPER.LabeledButtonsHint",
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, SETTINGS.STATE, {
    scope: "client",
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register(MODULE_ID, SETTINGS.MARKER, {
    scope: "client",
    config: false,
    type: Object,
    default: null,
  });
}
