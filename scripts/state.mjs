import { GROUPS, MIN_SLOTS, MAX_SLOTS, DEFAULT_COUNTS } from "./constants.mjs";

/**
 * Pure, Foundry-free action-tracker state logic.
 * State shape: { main: boolean[], bonus: boolean[], reaction: boolean[], movement: boolean[] }
 * Each boolean is true = available, false = used.
 * Counts shape: { main: number, bonus: number, reaction: number, movement: number }
 */

export function clampCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_COUNTS.main;
  return Math.min(MAX_SLOTS, Math.max(MIN_SLOTS, Math.round(n)));
}

export function validateCounts(raw) {
  const counts = {};
  for (const group of GROUPS) {
    const value = raw && typeof raw === "object" ? raw[group] : undefined;
    counts[group] = clampCount(value ?? DEFAULT_COUNTS[group]);
  }
  return counts;
}

/** Build a slot array of the given length, preserving overlap with `previous`, new slots default available. */
export function resizeSlots(previous, count) {
  const prior = Array.isArray(previous) ? previous : [];
  const next = [];
  for (let i = 0; i < count; i++) {
    next.push(typeof prior[i] === "boolean" ? prior[i] : true);
  }
  return next;
}

export function createDefaultState(counts) {
  const state = {};
  for (const group of GROUPS) state[group] = resizeSlots([], counts[group]);
  return state;
}

export function resetState(counts) {
  return createDefaultState(counts);
}

export function toggleSlot(state, group, index) {
  const slots = Array.isArray(state[group]) ? state[group] : [];
  if (index < 0 || index >= slots.length) return state;
  const next = slots.slice();
  next[index] = !next[index];
  return { ...state, [group]: next };
}

export function resizeGroup(state, group, newCount) {
  const count = clampCount(newCount);
  return { ...state, [group]: resizeSlots(state[group], count) };
}

/** Validate stored state against current counts, recovering safely from malformed/missing data. */
export function validateState(raw, counts) {
  const state = {};
  for (const group of GROUPS) {
    const stored = raw && typeof raw === "object" ? raw[group] : undefined;
    const prior = Array.isArray(stored) ? stored.filter((v) => typeof v === "boolean") : [];
    state[group] = resizeSlots(prior, counts[group]);
  }
  return state;
}

/** Validate a stored combat marker, recovering safely from malformed data. */
export function validateMarker(raw) {
  if (!raw || typeof raw !== "object") return null;
  const { combatId, round } = raw;
  if (typeof combatId !== "string" || !combatId) return null;
  if (!Number.isFinite(round) || round < 1) return null;
  return { combatId, round };
}
