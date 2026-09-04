import * as tokenState from "./token-state.mjs";
import { getAutoOpen, getAutoClose } from "./settings.mjs";
import { planCombatUpdate } from "./combat-transition.mjs";
import { ActionKeeperApp } from "./action-keeper-app.mjs";
import { getActiveTokenDocument, setActiveToken, pickTokenForCombatStart, registerActiveTokenHooks } from "./active-token.mjs";

function log(...args) {
  console.log("Action Keeper |", ...args);
}

function warn(...args) {
  console.warn("Action Keeper |", ...args);
}

/**
 * Token flags are shared Documents: every authorized client (the owning player, and the GM, since
 * GM owns every token) independently computes and writes the same reset for a given round. This is
 * safe because the reset payload is deterministic (all slots become available), so redundant writes
 * converge to the same value — no single-writer election needed.
 * @returns {Promise<boolean>} whether any reset performed was a combat-start transition
 */
async function resetOwnedCombatantTokens(combat) {
  let isStart = false;
  for (const combatant of combat.combatants) {
    const token = combatant.token;
    if (!token || !tokenState.isOwnedByCurrentUser(token)) continue;

    const marker = tokenState.getMarker(token);
    const plan = planCombatUpdate(marker, combat.id, combat.round);
    if (!plan.shouldReset) continue;

    await tokenState.resetAll(token);
    await tokenState.setMarker(token, plan.marker);
    isStart = isStart || plan.isStart;
    log(plan.isStart ? `combat started, reset "${token.name}"` : `new round, reset "${token.name}"`, plan.marker);
  }
  return isStart;
}

async function onUpdateCombat(combat, changed, _options, _userId) {
  try {
    if (!("round" in changed)) return;
    if (!combat.started) return;

    const isStart = await resetOwnedCombatantTokens(combat);

    if (isStart) {
      const token = pickTokenForCombatStart();
      if (token) setActiveToken(token);
      if (getAutoOpen()) ActionKeeperApp.open();
      else ActionKeeperApp.refreshIfOpen();
    } else {
      ActionKeeperApp.refreshIfOpen();
    }
  } catch (err) {
    warn("failed to process updateCombat", err);
  }
}

function onDeleteCombat(_combat, _options, _userId) {
  try {
    if (getAutoClose()) ActionKeeperApp.closeIfOpen();
    else ActionKeeperApp.refreshIfOpen();
  } catch (err) {
    warn("failed to process deleteCombat", err);
  }
}

async function reconcileOnReady() {
  try {
    const active = game.combats?.find((c) => c.started) ?? null;
    if (!active) return;
    await resetOwnedCombatantTokens(active);
  } catch (err) {
    warn("failed to reconcile on ready", err);
  }
}

function onUpdateToken(tokenDoc, changed) {
  const active = getActiveTokenDocument();
  if (!active || active.id !== tokenDoc.id) return;
  if ("flags" in changed || "name" in changed || "texture" in changed) ActionKeeperApp.refreshIfOpen();
}

export function registerCombatHooks() {
  Hooks.on("updateCombat", onUpdateCombat);
  Hooks.on("deleteCombat", onDeleteCombat);
  Hooks.on("updateToken", onUpdateToken);
  Hooks.once("ready", reconcileOnReady);

  registerActiveTokenHooks();
  Hooks.on("controlToken", () => ActionKeeperApp.refreshIfOpen());
}
