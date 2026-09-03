import { ActionKeeperApp } from "./action-keeper-app.mjs";

/** Add the Action Keeper toggle tool to the Token control group, non-GM only. */
export function registerSceneControls() {
  Hooks.on("getSceneControlButtons", (controls) => {
    if (game.user.isGM) return;
    const tokenControl = controls.tokens;
    if (!tokenControl) return;

    tokenControl.tools["action-keeper-toggle"] = {
      name: "action-keeper-toggle",
      order: Object.keys(tokenControl.tools).length + 1,
      title: "ACTION_KEEPER.SceneControlTitle",
      icon: "fa-solid fa-clipboard-clock",
      button: true,
      onChange: () => ActionKeeperApp.toggle(),
    };
  });
}
