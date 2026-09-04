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

/** Global settings, shared world-wide, edited via Foundry's own Game Settings menu. */
export const SETTINGS = {
  AUTO_OPEN: "autoOpenOnCombatStart",
  AUTO_CLOSE: "autoCloseOnCombatEnd",
  LABELED_BUTTONS: "labeledButtons",
  LANGUAGE: "language",
};

/** Per-token data (counts/state/marker) lives in a single TokenDocument flag under this key. */
export const FLAG_KEY = "data";
