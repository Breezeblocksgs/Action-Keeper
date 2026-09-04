import { MODULE_ID, GROUPS, GROUP_ICON, GROUP_LABEL_KEY, GROUP_COLOR, MIN_SLOTS, MAX_SLOTS } from "./constants.mjs";
import * as tokenState from "./token-state.mjs";
import { getLabeledButtons, getLanguage } from "./settings.mjs";
import { ensureLanguageLoaded, localize } from "./localization.mjs";
import { getActiveTokenDocument } from "./active-token.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * The Action Keeper panel. One instance per client, tracking whichever token this client
 * currently has active (see active-token.mjs). Available to GM and Players alike.
 */
export class ActionKeeperApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static #instance = null;

  static DEFAULT_OPTIONS = {
    id: "action-keeper-panel",
    tag: "div",
    window: {
      title: "ACTION_KEEPER.PanelTitle",
      icon: "fa-solid fa-clipboard-clock",
      minimizable: true,
      resizable: false,
    },
    position: { width: 320 },
    actions: {
      toggleSlot: ActionKeeperApp.#onToggleSlot,
      toggleSettingsPanel: ActionKeeperApp.#onToggleSettingsPanel,
    },
  };

  static PARTS = {
    panel: { template: `modules/${MODULE_ID}/templates/action-keeper.hbs` },
  };

  #settingsOpen = false;
  #language = getLanguage();
  #tokenName = null;

  /** Open the panel (creating the singleton instance if needed) and bring it to front. */
  static open() {
    ActionKeeperApp.#instance ??= new ActionKeeperApp();
    ActionKeeperApp.#instance.render(true);
    return ActionKeeperApp.#instance;
  }

  /** Toggle: close if open, otherwise open. */
  static toggle() {
    if (ActionKeeperApp.#instance?.rendered) ActionKeeperApp.#instance.close();
    else ActionKeeperApp.open();
  }

  /** Re-render the panel in place if it is currently open, without un-minimizing it. */
  static refreshIfOpen() {
    if (ActionKeeperApp.#instance?.rendered) ActionKeeperApp.#instance.render();
  }

  static closeIfOpen() {
    if (ActionKeeperApp.#instance?.rendered) ActionKeeperApp.#instance.close();
  }

  /** Action Keeper's own localized window title, independent of Foundry's core language. @override */
  get title() {
    const base = localize(this.#language, "ACTION_KEEPER.PanelTitle");
    return this.#tokenName ? `${base} — ${this.#tokenName}` : base;
  }

  /** The active token, only if it's actually usable by the current user (GM, or the owning player). */
  #getUsableToken() {
    const token = getActiveTokenDocument();
    if (!token) return null;
    return game.user.isGM || tokenState.isOwnedByCurrentUser(token) ? token : null;
  }

  /** @override */
  async _prepareContext(_options) {
    this.#language = await ensureLanguageLoaded(getLanguage());
    const t = (key) => localize(this.#language, key);

    const token = this.#getUsableToken();
    this.#tokenName = token?.name ?? null;
    const labeledButtons = getLabeledButtons();

    if (!token) {
      return {
        hasToken: false,
        labeledButtons,
        settingsOpen: this.#settingsOpen,
        i18n: { noToken: t("ACTION_KEEPER.NoTokenSelected") },
      };
    }

    const inCombat = Boolean(game.combats?.active?.combatants?.some((c) => c.tokenId === token.id));
    const counts = tokenState.getCounts(token);
    const state = tokenState.getState(token);

    const groups = GROUPS.map((key) => {
      const groupLabel = t(GROUP_LABEL_KEY[key]);
      const slots = state[key].map((available, index) => {
        const statusLabel = t(available ? "ACTION_KEEPER.Available" : "ACTION_KEEPER.Used");
        return {
          index,
          available,
          statusLabel,
          label: `${groupLabel} ${index + 1}: ${statusLabel}`,
        };
      });
      const countOptions = [];
      for (let n = MIN_SLOTS; n <= MAX_SLOTS; n++) countOptions.push({ value: n, selected: n === counts[key] });
      return { key, label: groupLabel, icon: GROUP_ICON[key], color: GROUP_COLOR[key], slots, countOptions };
    });

    return {
      hasToken: true,
      inCombat,
      tokenHeader: { name: token.name, img: token.texture?.src ?? "" },
      groups,
      labeledButtons,
      settingsOpen: this.#settingsOpen,
      i18n: {
        notInCombat: t("ACTION_KEEPER.NotInCombat"),
        configureButton: t("ACTION_KEEPER.ConfigureButton"),
      },
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    this._updateFrame({ window: { title: this.title } });

    const token = this.#getUsableToken();
    for (const select of this.element.querySelectorAll("select[data-setting='count']")) {
      select.addEventListener("change", (event) => {
        if (!token) return;
        const group = event.currentTarget.dataset.group;
        tokenState
          .setCount(token, group, event.currentTarget.value)
          .then(() => this.render())
          .catch((err) => console.warn("Action Keeper |", "failed to change slot count", err));
      });
    }
  }

  /** @override */
  _onClose(options) {
    super._onClose(options);
    if (ActionKeeperApp.#instance === this) ActionKeeperApp.#instance = null;
  }

  static #onToggleSlot(_event, target) {
    const token = this.#getUsableToken();
    if (!token) return;
    const group = target.dataset.group;
    const index = Number(target.dataset.index);
    tokenState
      .toggle(token, group, index)
      .then(() => this.render())
      .catch((err) => console.warn("Action Keeper |", "failed to toggle slot", err));
  }

  static #onToggleSettingsPanel() {
    this.#settingsOpen = !this.#settingsOpen;
    this.render();
  }
}
