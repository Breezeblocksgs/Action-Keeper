import { test } from "node:test";
import assert from "node:assert/strict";
import { planCombatUpdate, planReconcile } from "../scripts/combat-transition.mjs";

test("duplicate reset for the same Combat ID and round is ignored", () => {
  const marker = { combatId: "c1", round: 2 };
  const plan = planCombatUpdate(marker, "c1", 2);
  assert.equal(plan.shouldReset, false);
});

test("a different round resets", () => {
  const marker = { combatId: "c1", round: 2 };
  const plan = planCombatUpdate(marker, "c1", 3);
  assert.equal(plan.shouldReset, true);
  assert.equal(plan.isStart, false);
  assert.deepEqual(plan.marker, { combatId: "c1", round: 3 });
});

test("a different Combat ID resets and is treated as a start", () => {
  const marker = { combatId: "c1", round: 5 };
  const plan = planCombatUpdate(marker, "c2", 1);
  assert.equal(plan.shouldReset, true);
  assert.equal(plan.isStart, true);
  assert.deepEqual(plan.marker, { combatId: "c2", round: 1 });
});

test("no prior marker is treated as a start", () => {
  const plan = planCombatUpdate(null, "c1", 1);
  assert.equal(plan.shouldReset, true);
  assert.equal(plan.isStart, true);
});

test("same-combat/same-round reload preserves toggles (no reset)", () => {
  const marker = { combatId: "c1", round: 4 };
  const plan = planReconcile(marker, { id: "c1", round: 4 });
  assert.equal(plan.shouldReset, false);
  assert.deepEqual(plan.marker, marker);
});

test("reconnecting after a round change resets correctly", () => {
  const marker = { combatId: "c1", round: 2 };
  const plan = planReconcile(marker, { id: "c1", round: 3 });
  assert.equal(plan.shouldReset, true);
  assert.deepEqual(plan.marker, { combatId: "c1", round: 3 });
});

test("no active started combat does not invent state", () => {
  const marker = { combatId: "c1", round: 2 };
  const plan = planReconcile(marker, null);
  assert.equal(plan.shouldReset, false);
  assert.equal(plan.marker, null);
});

test("no active combat and no prior marker stays inert", () => {
  const plan = planReconcile(null, null);
  assert.equal(plan.shouldReset, false);
  assert.equal(plan.marker, null);
});
