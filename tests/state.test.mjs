import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clampCount,
  validateCounts,
  createDefaultState,
  resetState,
  toggleSlot,
  resizeGroup,
  validateState,
  validateMarker,
} from "../scripts/state.mjs";
import { GROUPS, DEFAULT_COUNTS } from "../scripts/constants.mjs";

test("default state has one available slot per group", () => {
  const state = createDefaultState(DEFAULT_COUNTS);
  for (const group of GROUPS) {
    assert.deepEqual(state[group], [true]);
  }
});

test("toggling one slot does not affect another", () => {
  const counts = { main: 2, bonus: 1, reaction: 1, movement: 1 };
  const state = createDefaultState(counts);
  const next = toggleSlot(state, "main", 0);
  assert.equal(next.main[0], false);
  assert.equal(next.main[1], true);
  assert.equal(next.bonus[0], true);
  assert.deepEqual(state.main, [true, true], "original state is untouched");
});

test("reset makes every configured slot available", () => {
  const counts = { main: 3, bonus: 2, reaction: 1, movement: 4 };
  let state = createDefaultState(counts);
  state = toggleSlot(state, "main", 0);
  state = toggleSlot(state, "movement", 2);
  const reset = resetState(counts);
  for (const group of GROUPS) {
    assert.ok(reset[group].every((slot) => slot === true));
    assert.equal(reset[group].length, counts[group]);
  }
});

test("counts are clamped to 1-5", () => {
  assert.equal(clampCount(0), 1);
  assert.equal(clampCount(-3), 1);
  assert.equal(clampCount(6), 5);
  assert.equal(clampCount(999), 5);
  assert.equal(clampCount("3"), 3);
  assert.equal(clampCount("not a number"), DEFAULT_COUNTS.main);
  assert.equal(clampCount(undefined), DEFAULT_COUNTS.main);
  assert.equal(clampCount(NaN), DEFAULT_COUNTS.main);
});

test("validateCounts clamps and recovers malformed input", () => {
  const counts = validateCounts({ main: 10, bonus: -1, reaction: "x", movement: 3 });
  assert.deepEqual(counts, { main: 5, bonus: 1, reaction: DEFAULT_COUNTS.reaction, movement: 3 });
  assert.deepEqual(validateCounts(null), DEFAULT_COUNTS);
  assert.deepEqual(validateCounts("garbage"), DEFAULT_COUNTS);
});

test("increasing a count preserves existing slots and adds available slots", () => {
  let state = createDefaultState({ main: 1, bonus: 1, reaction: 1, movement: 1 });
  state = toggleSlot(state, "main", 0); // main[0] = false (used)
  state = resizeGroup(state, "main", 3);
  assert.deepEqual(state.main, [false, true, true]);
});

test("decreasing a count safely removes excess slots and preserves retained ones", () => {
  let state = createDefaultState({ main: 4, bonus: 1, reaction: 1, movement: 1 });
  state = toggleSlot(state, "main", 3); // last slot used
  state = resizeGroup(state, "main", 2);
  assert.deepEqual(state.main, [true, true]);
});

test("validateState recovers safely from malformed stored state", () => {
  const counts = { main: 2, bonus: 1, reaction: 1, movement: 1 };
  const recovered = validateState({ main: "not an array", bonus: [true, "x", false] }, counts);
  assert.equal(recovered.main.length, 2);
  assert.ok(recovered.main.every((v) => v === true));
  assert.deepEqual(recovered.bonus, [true]); // non-boolean entries filtered, padded to count
  assert.deepEqual(recovered.reaction, [true]);
  assert.deepEqual(recovered.movement, [true]);
  assert.deepEqual(validateState(null, counts), createDefaultState(counts));
  assert.deepEqual(validateState(undefined, counts), createDefaultState(counts));
});

test("validateState preserves valid existing toggles", () => {
  const counts = { main: 2, bonus: 1, reaction: 1, movement: 1 };
  const stored = { main: [false, true], bonus: [false], reaction: [true], movement: [true] };
  assert.deepEqual(validateState(stored, counts), stored);
});

test("validateMarker accepts a well-formed marker and rejects malformed ones", () => {
  assert.deepEqual(validateMarker({ combatId: "abc123", round: 2 }), { combatId: "abc123", round: 2 });
  assert.equal(validateMarker(null), null);
  assert.equal(validateMarker(undefined), null);
  assert.equal(validateMarker({}), null);
  assert.equal(validateMarker({ combatId: "", round: 1 }), null);
  assert.equal(validateMarker({ combatId: "abc", round: 0 }), null);
  assert.equal(validateMarker({ combatId: "abc", round: -1 }), null);
  assert.equal(validateMarker({ combatId: 5, round: 1 }), null);
  assert.equal(validateMarker("garbage"), null);
});
