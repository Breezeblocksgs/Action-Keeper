import { registerSettings } from "./settings.mjs";
import { registerCombatHooks } from "./combat-coordinator.mjs";
import { registerSceneControls } from "./scene-controls.mjs";

Hooks.once("init", () => {
  registerSettings();
  registerCombatHooks();
  registerSceneControls();
  console.log("Action Keeper | initialized");
});
