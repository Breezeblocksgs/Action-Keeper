import { MODULE_ID, GROUPS, GROUP_ICON, GROUP_LABEL_KEY, GROUP_COLOR, MIN_SLOTS, MAX_SLOTS, LANGUAGES } from "./constants.mjs";
import * as repository from "./state-repository.mjs";
import { ensureLanguageLoaded, localize } from "./localization.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * The Action Keeper panel. One instance per client. Non-GM users only.
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
      toggleAutoOpen: ActionKeeperApp.#onToggleAutoOpen,
      toggleAutoClose: ActionKeeperApp.#onToggleAutoClose,
      toggleLabeledButtons: ActionKeeperApp.#onToggleLabeledButtons,
    },
  };

  static PARTS = {
    panel: { template: `modules/${MODULE_ID}/templates/action-keeper.hbs` },
  };

  #settingsOpen = false;
  #language = repository.getLanguage();

  /** Open the panel (creating the singleton instance if needed) and bring it to front. */
  static open() {
    if (game.user.isGM) return null;
    ActionKeeperApp.#instance ??= new ActionKeeperApp();
    ActionKeeperApp.#instance.render(true);
    return ActionKeeperApp.#instance;
  }

  /** Toggle: close if open, otherwise open. */
  static toggle() {
    if (game.user.isGM) return;
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
    return localize(this.#language, "ACTION_KEEPER.PanelTitle");
  }

  /** @override */
  async _prepareContext(_options) {
    this.#language = await ensureLanguageLoaded(repository.getLanguage());
    const t = (key) => localize(this.#language, key);

    const marker = repository.getMarker();
    const hasActiveCombat = marker !== null;
    const counts = repository.getCounts();
    const state = repository.getState();

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

    const languages = LANGUAGES.map((l) => ({ ...l, selected: l.code === this.#language }));

    return {
      hasActiveCombat,
      groups,
      languages,
      settingsOpen: this.#settingsOpen,
      autoOpen: repository.getAutoOpen(),
      autoClose: repository.getAutoClose(),
      labeledButtons: repository.getLabeledButtons(),
      i18n: {
        noActiveCombat: t("ACTION_KEEPER.NoActiveCombat"),
        configureButton: t("ACTION_KEEPER.ConfigureButton"),
        autoOpen: t("ACTION_KEEPER.AutoOpen"),
        autoClose: t("ACTION_KEEPER.AutoClose"),
        labeledButtons: t("ACTION_KEEPER.LabeledButtons"),
        language: t("ACTION_KEEPER.Language"),
      },
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    this._updateFrame({ window: { title: this.title } });

    for (const select of this.element.querySelectorAll("select[data-setting='count']")) {
      select.addEventListener("change", (event) => {
        const group = event.currentTarget.dataset.group;
        repository
          .setCount(group, event.currentTarget.value)
          .then(() => this.render())
          .catch((err) => console.warn("Action Keeper |", "failed to change slot count", err));
      });
    }

    const languageSelect = this.element.querySelector("select[data-setting='language']");
    languageSelect?.addEventListener("change", (event) => {
      game.settings
        .set(MODULE_ID, "language", event.currentTarget.value)
        .then(() => this.render())
        .catch((err) => console.warn("Action Keeper |", "failed to change language", err));
    });
  }

  /** @override */
  _onClose(options) {
    super._onClose(options);
    if (ActionKeeperApp.#instance === this) ActionKeeperApp.#instance = null;
  }

  static #onToggleSlot(_event, target) {
    const group = target.dataset.group;
    const index = Number(target.dataset.index);
    repository
      .toggle(group, index)
      .then(() => this.render())
      .catch((err) => console.warn("Action Keeper |", "failed to toggle slot", err));
  }

  static #onToggleSettingsPanel() {
    this.#settingsOpen = !this.#settingsOpen;
    this.render();
  }

  static #onToggleAutoOpen(_event, target) {
    game.settings.set(MODULE_ID, "autoOpenOnCombatStart", target.checked).catch((err) =>
      console.warn("Action Keeper |", "failed to save auto-open setting", err),
    );
  }

  static #onToggleAutoClose(_event, target) {
    game.settings.set(MODULE_ID, "autoCloseOnCombatEnd", target.checked).catch((err) =>
      console.warn("Action Keeper |", "failed to save auto-close setting", err),
    );
  }

  static #onToggleLabeledButtons(_event, target) {
    game.settings
      .set(MODULE_ID, "labeledButtons", target.checked)
      .then(() => this.render())
      .catch((err) => console.warn("Action Keeper |", "failed to save labeled-buttons setting", err));
  }
}
