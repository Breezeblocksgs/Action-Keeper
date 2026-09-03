import { MODULE_ID, SETTINGS, GROUP_COUNT_SETTING, GROUPS } from "./constants.mjs";
import { validateCounts, validateState, validateMarker, resetState, toggleSlot, resizeGroup } from "./state.mjs";

/**
 * Per-user Action Keeper state, backed by `scope: "client"` settings.
 * `scope: "user"` was tried first but requires the SETTINGS_MODIFY permission to create the
 * backing Setting document, which regular Players lack by default; `client` scope (localStorage)
 * has no such permission gate.
 * All reads validate/recover; all writes are logged narrowly on failure.
 */

function log(...args) {
  console.log(`Action Keeper |`, ...args);
}

function warn(...args) {
  console.warn(`Action Keeper |`, ...args);
}

export function getCounts() {
  const raw = {};
  for (const group of GROUPS) raw[group] = game.settings.get(MODULE_ID, GROUP_COUNT_SETTING[group]);
  return validateCounts(raw);
}

export async function setCount(group, value) {
  const counts = getCounts();
  const clamped = validateCounts({ ...counts, [group]: value })[group];
  await game.settings.set(MODULE_ID, GROUP_COUNT_SETTING[group], clamped);
  const state = getState();
  await setState(resizeGroup(state, group, clamped));
}

export function getState() {
  const raw = game.settings.get(MODULE_ID, SETTINGS.STATE);
  return validateState(raw, getCounts());
}

export async function setState(state) {
  try {
    await game.settings.set(MODULE_ID, SETTINGS.STATE, state);
  } catch (err) {
    warn("failed to persist state", err);
  }
}

export async function toggle(group, index) {
  const state = getState();
  await setState(toggleSlot(state, group, index));
}

export async function resetAll() {
  await setState(resetState(getCounts()));
  log("tracker reset for the current round");
}

export function getMarker() {
  return validateMarker(game.settings.get(MODULE_ID, SETTINGS.MARKER));
}

export async function setMarker(marker) {
  try {
    await game.settings.set(MODULE_ID, SETTINGS.MARKER, marker);
  } catch (err) {
    warn("failed to persist combat marker", err);
  }
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
