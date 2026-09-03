import * as repository from "./state-repository.mjs";
import { planCombatUpdate, planReconcile } from "./combat-transition.mjs";
import { ActionKeeperApp } from "./action-keeper-app.mjs";

function log(...args) {
  console.log(`Action Keeper |`, ...args);
}

function warn(...args) {
  console.warn(`Action Keeper |`, ...args);
}

/** Non-GM only: react to committed Combat updates (round start/change). */
async function onUpdateCombat(combat, changed, _options, _userId) {
  try {
    if (game.user.isGM) return;
    if (!("round" in changed)) return;
    if (!combat.started) return;

    const marker = repository.getMarker();
    const plan = planCombatUpdate(marker, combat.id, combat.round);
    if (!plan.shouldReset) return;

    await repository.resetAll();
    await repository.setMarker(plan.marker);
    log(plan.isStart ? "combat started, tracker reset" : "new round, tracker reset", plan.marker);

    if (plan.isStart && repository.getAutoOpen()) {
      ActionKeeperApp.open();
    } else {
      ActionKeeperApp.refreshIfOpen();
    }
  } catch (err) {
    warn("failed to process updateCombat", err);
  }
}

/** Non-GM only: react to committed Combat deletion (covers Combat.endCombat() and manual deletion). */
async function onDeleteCombat(combat, _options, _userId) {
  try {
    if (game.user.isGM) return;
    const marker = repository.getMarker();
    if (!marker || marker.combatId !== combat.id) return;

    await repository.setMarker(null);
    log("combat ended, tracker marked inactive");

    if (repository.getAutoClose()) ActionKeeperApp.closeIfOpen();
    else ActionKeeperApp.refreshIfOpen();
  } catch (err) {
    warn("failed to process deleteCombat", err);
  }
}

/** Non-GM only: reconcile stored state with the active Combat at `ready` (reload/reconnect). */
async function reconcileOnReady() {
  try {
    if (game.user.isGM) return;

    const active = game.combats?.find((c) => c.started) ?? null;
    const marker = repository.getMarker();
    const plan = planReconcile(marker, active ? { id: active.id, round: active.round } : null);

    if (plan.marker === null && marker !== null) {
      await repository.setMarker(null);
      return;
    }
    if (!plan.shouldReset) return;

    await repository.resetAll();
    await repository.setMarker(plan.marker);
    log("reconciled tracker with active combat on ready", plan.marker);
  } catch (err) {
    warn("failed to reconcile on ready", err);
  }
}

export function registerCombatHooks() {
  Hooks.on("updateCombat", onUpdateCombat);
  Hooks.on("deleteCombat", onDeleteCombat);
  Hooks.once("ready", reconcileOnReady);
}
