/**
 * Client-local (never persisted) tracking of "the token this client's panel is currently showing."
 * Selecting a token on the canvas makes it active; the last-selected of a shift-click group wins
 * (canvas.tokens.controlled is an insertion-ordered Map, so this falls out for free); deselecting
 * the active token falls back to another still-controlled token, if any.
 */

let activeTokenId = null;

/**
 * Resolves the active token, preferring the live canvas selection whenever anything is currently
 * controlled. This self-heals two cases where `controlToken` never fires: a token already selected
 * before this client loaded (e.g. restored across a login/reload), and a redundant click on a token
 * that's already the sole selection (Foundry doesn't re-fire the hook for a no-op re-select).
 */
export function getActiveTokenDocument() {
  const controlled = canvas?.tokens?.controlled ?? [];
  if (controlled.length) {
    const live = controlled[controlled.length - 1].document;
    activeTokenId = live.id;
    return live;
  }
  if (!activeTokenId) return null;
  const doc = canvas?.tokens?.get(activeTokenId)?.document ?? null;
  if (!doc) activeTokenId = null;
  return doc;
}

export function setActiveToken(tokenDocument) {
  activeTokenId = tokenDocument?.id ?? null;
}

export function clearActiveToken() {
  activeTokenId = null;
}

/** Combat-start only: the literal "first selected token" rule, distinct from the general "last selected" rule. */
export function pickTokenForCombatStart() {
  const controlled = canvas?.tokens?.controlled ?? [];
  return controlled[0]?.document ?? getActiveTokenDocument();
}

export function registerActiveTokenHooks() {
  Hooks.on("controlToken", (token, controlled) => {
    if (controlled) {
      setActiveToken(token.document);
      return;
    }
    if (activeTokenId !== token.id) return;
    const remaining = canvas?.tokens?.controlled ?? [];
    setActiveToken(remaining.length ? remaining[remaining.length - 1].document : null);
  });

  Hooks.on("canvasReady", () => clearActiveToken());
}
