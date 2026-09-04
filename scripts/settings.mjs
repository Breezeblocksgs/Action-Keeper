import { MODULE_ID, SETTINGS, LANGUAGES, DEFAULT_LANGUAGE } from "./constants.mjs";

/**
 * Global Action Keeper preferences. These are shared world-wide (`scope: "world"`), visible and
 * editable in Foundry's own Game Settings menu like any other module setting. Writing a world
 * setting requires the SETTINGS_MODIFY permission (GM/Assistant GM by default) — a single shared
 * value edited by the GM, not a per-player preference.
 *
 * Each setting's `onChange` fires on every client whenever the Setting document updates —
 * confirmed in `client/documents/setting.mjs#_onUpdate`, which calls the registered `onChange`
 * for any commit of that document, whether it originated locally or was broadcast from another
 * client — so it's the reliable way to push a live refresh, unlike the generic per-type
 * `Hooks.callAll` dispatch other Document types use (Setting has no confirmed `updateSetting` hook).
 *
 * @param {() => void} [onGlobalSettingChange] Called whenever any of these settings change.
 */
export function registerSettings(onGlobalSettingChange) {
  const onChange = onGlobalSettingChange ?? (() => {});

  game.settings.register(MODULE_ID, SETTINGS.AUTO_OPEN, {
    name: "ACTION_KEEPER.AutoOpen",
    hint: "ACTION_KEEPER.AutoOpenHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange,
  });

  game.settings.register(MODULE_ID, SETTINGS.AUTO_CLOSE, {
    name: "ACTION_KEEPER.AutoClose",
    hint: "ACTION_KEEPER.AutoCloseHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange,
  });

  game.settings.register(MODULE_ID, SETTINGS.LABELED_BUTTONS, {
    name: "ACTION_KEEPER.LabeledButtons",
    hint: "ACTION_KEEPER.LabeledButtonsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange,
  });

  const choices = {};
  for (const { code, flag, nativeName } of LANGUAGES) choices[code] = `${flag} ${nativeName}`;

  game.settings.register(MODULE_ID, SETTINGS.LANGUAGE, {
    name: "ACTION_KEEPER.Language",
    hint: "ACTION_KEEPER.LanguageHint",
    scope: "world",
    config: true,
    type: String,
    choices,
    default: DEFAULT_LANGUAGE,
    onChange,
  });
}

export function getAutoOpen() {
  return Boolean(game.settings.get(MODULE_ID, SETTINGS.AUTO_OPEN));
}

export function getAutoClose() {
  return Boolean(game.settings.get(MODULE_ID, SETTINGS.AUTO_CLOSE));
}

export function getLabeledButtons() {
  return Boolean(game.settings.get(MODULE_ID, SETTINGS.LABELED_BUTTONS));
}

export function getLanguage() {
  const raw = game.settings.get(MODULE_ID, SETTINGS.LANGUAGE);
  return LANGUAGES.some((l) => l.code === raw) ? raw : DEFAULT_LANGUAGE;
}
