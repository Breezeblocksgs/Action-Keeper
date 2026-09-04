import { registerSettings } from "./settings.mjs";
import { registerCombatHooks } from "./combat-coordinator.mjs";
import { registerSceneControls } from "./scene-controls.mjs";
import { ActionKeeperApp } from "./action-keeper-app.mjs";

Hooks.once("init", () => {
  registerSettings(() => ActionKeeperApp.refreshIfOpen());
  registerCombatHooks();
  registerSceneControls();
  console.log("Action Keeper | initialized");
});
