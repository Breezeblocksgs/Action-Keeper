/**
 * Pure combat-lifecycle transition logic, decoupled from Foundry so it can be
 * unit tested without a running world. All rounds are assumed >= 1 (started).
 */

/**
 * Decide whether a committed Combat update (id/round now known) should reset
 * the local tracker, using an idempotency marker of {combatId, round}.
 * @param {{combatId: string, round: number}|null} marker  Last-processed marker.
 * @param {string} combatId
 * @param {number} round
 * @returns {{shouldReset: boolean, isStart: boolean, marker: {combatId: string, round: number}}}
 */
export function planCombatUpdate(marker, combatId, round) {
  if (marker && marker.combatId === combatId && marker.round === round) {
    return { shouldReset: false, isStart: false, marker };
  }
  const isStart = !marker || marker.combatId !== combatId;
  return { shouldReset: true, isStart, marker: { combatId, round } };
}

/**
 * Decide whether a ready-time reconciliation should reset the local tracker.
 * @param {{combatId: string, round: number}|null} marker
 * @param {{id: string, round: number}|null} activeCombat  The currently active, started Combat, or null.
 * @returns {{shouldReset: boolean, marker: {combatId: string, round: number}|null}}
 */
export function planReconcile(marker, activeCombat) {
  if (!activeCombat) {
    return { shouldReset: false, marker: null };
  }
  if (marker && marker.combatId === activeCombat.id && marker.round === activeCombat.round) {
    return { shouldReset: false, marker };
  }
  return { shouldReset: true, marker: { combatId: activeCombat.id, round: activeCombat.round } };
}
