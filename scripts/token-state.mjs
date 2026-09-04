import { MODULE_ID, FLAG_KEY } from "./constants.mjs";
import { validateCounts, validateState, validateMarker, resetState, toggleSlot, resizeGroup } from "./state.mjs";

/**
 * Per-token Action Keeper data, stored as a single TokenDocument flag: {counts, state, marker}.
 * Writing a token's flags requires "OWNER" Document permission — true for the owning player, and
 * always true for a GM (`TokenDocument#isOwner` returns true unconditionally for GM).
 * All reads validate/recover; all writes are logged narrowly on failure.
 */

function warn(...args) {
  console.warn("Action Keeper |", ...args);
}

function log(...args) {
  console.log("Action Keeper |", ...args);
}

function readRaw(tokenDoc) {
  return tokenDoc.getFlag(MODULE_ID, FLAG_KEY) ?? {};
}

export function getCounts(tokenDoc) {
  return validateCounts(readRaw(tokenDoc).counts);
}

export function getState(tokenDoc) {
  return validateState(readRaw(tokenDoc).state, getCounts(tokenDoc));
}

export function getMarker(tokenDoc) {
  return validateMarker(readRaw(tokenDoc).marker);
}

async function writeRaw(tokenDoc, patch) {
  const next = { ...readRaw(tokenDoc), ...patch };
  try {
    await tokenDoc.setFlag(MODULE_ID, FLAG_KEY, next);
  } catch (err) {
    warn(`failed to persist token data for "${tokenDoc.name}"`, err);
  }
}

export async function setCount(tokenDoc, group, value) {
  const counts = getCounts(tokenDoc);
  const clamped = validateCounts({ ...counts, [group]: value })[group];
  const state = resizeGroup(getState(tokenDoc), group, clamped);
  await writeRaw(tokenDoc, { counts: { ...counts, [group]: clamped }, state });
}

export async function toggle(tokenDoc, group, index) {
  const state = toggleSlot(getState(tokenDoc), group, index);
  await writeRaw(tokenDoc, { state });
}

export async function resetAll(tokenDoc) {
  await writeRaw(tokenDoc, { state: resetState(getCounts(tokenDoc)) });
  log(`tracker reset for "${tokenDoc.name}"`);
}

export async function setMarker(tokenDoc, marker) {
  await writeRaw(tokenDoc, { marker });
}

export function isOwnedByCurrentUser(tokenDoc) {
  return Boolean(tokenDoc?.isOwner);
}
