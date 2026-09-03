export const MODULE_ID = "action-keeper";

/** Order matters: rendered top-to-bottom in this order. */
export const GROUPS = ["main", "bonus", "reaction", "movement"];

export const GROUP_ICON = {
  main: "fa-solid fa-swords",
  bonus: "fa-solid fa-circle-plus",
  reaction: "fa-solid fa-rotate-right",
  movement: "fa-solid fa-shoe-prints",
};

export const GROUP_LABEL_KEY = {
  main: "ACTION_KEEPER.GroupMain",
  bonus: "ACTION_KEEPER.GroupBonus",
  reaction: "ACTION_KEEPER.GroupReaction",
  movement: "ACTION_KEEPER.GroupMovement",
};

export const GROUP_COLOR = {
  main: "#2f9e44",
  bonus: "#e8590c",
  reaction: "#e6b800",
  movement: "#4dabf7",
};

/** Action Keeper's own UI language, independent of Foundry's core language setting so it can switch instantly. */
export const LANGUAGES = [
  { code: "en", flag: "🇺🇸", nativeName: "English (US)" },
  { code: "pt-BR", flag: "🇧🇷", nativeName: "Português (Brasil)" },
  { code: "ru", flag: "🇷🇺", nativeName: "Русский" },
  { code: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "de", flag: "🇩🇪", nativeName: "Deutsch" },
];
export const DEFAULT_LANGUAGE = "en";

export const MIN_SLOTS = 1;
export const MAX_SLOTS = 5;

export const DEFAULT_COUNTS = Object.freeze({
  main: 1,
  bonus: 1,
  reaction: 1,
  movement: 1,
});

export const SETTINGS = {
  MAIN_COUNT: "mainActionCount",
  BONUS_COUNT: "bonusActionCount",
  REACTION_COUNT: "reactionCount",
  MOVEMENT_COUNT: "movementCount",
  AUTO_OPEN: "autoOpenOnCombatStart",
  AUTO_CLOSE: "autoCloseOnCombatEnd",
  LABELED_BUTTONS: "labeledButtons",
  LANGUAGE: "language",
  STATE: "actionState",
  MARKER: "combatMarker",
};

export const GROUP_COUNT_SETTING = {
  main: SETTINGS.MAIN_COUNT,
  bonus: SETTINGS.BONUS_COUNT,
  reaction: SETTINGS.REACTION_COUNT,
  movement: SETTINGS.MOVEMENT_COUNT,
};
