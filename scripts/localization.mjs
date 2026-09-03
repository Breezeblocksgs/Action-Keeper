import { MODULE_ID, LANGUAGES, DEFAULT_LANGUAGE } from "./constants.mjs";

/**
 * Action Keeper's own UI-string loader, deliberately independent of Foundry's core `game.i18n`
 * language (which is client-global and reloads the page on change). Loads directly from this
 * module's own `lang/*.json` files, keyed by the same language codes declared in module.json.
 */

const dictionaries = new Map();

function warn(...args) {
  console.warn("Action Keeper |", ...args);
}

async function loadDictionary(code) {
  if (dictionaries.has(code)) return dictionaries.get(code);
  try {
    const response = await fetch(`modules/${MODULE_ID}/lang/${code}.json`);
    const data = await response.json();
    dictionaries.set(code, data);
    return data;
  } catch (err) {
    warn(`failed to load language "${code}"`, err);
    dictionaries.set(code, null);
    return null;
  }
}

/** Ensure the given language (and the English fallback) are loaded, then return the resolved code to use. */
export async function ensureLanguageLoaded(code) {
  const valid = LANGUAGES.some((l) => l.code === code) ? code : DEFAULT_LANGUAGE;
  await loadDictionary(valid);
  if (valid !== DEFAULT_LANGUAGE) await loadDictionary(DEFAULT_LANGUAGE);
  return valid;
}

/** Look up a dotted key (e.g. "ACTION_KEEPER.PanelTitle") in the given language, falling back to English, then the raw key. */
export function localize(code, key) {
  const path = key.split(".");
  const resolve = (dict) => path.reduce((node, part) => (node && typeof node === "object" ? node[part] : undefined), dict);
  return resolve(dictionaries.get(code)) ?? resolve(dictionaries.get(DEFAULT_LANGUAGE)) ?? key;
}
