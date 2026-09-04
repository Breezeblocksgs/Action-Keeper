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
