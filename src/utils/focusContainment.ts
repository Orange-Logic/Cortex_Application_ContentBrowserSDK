/**
 * Focus-trap-aware popup anchoring (ticket 29KEV1).
 *
 * When the Content Browser SDK opens in popup mode (no `containerId`), its UI is
 * appended to `document.body`. If the host page has an active modal with a focus
 * trap — Drupal's jQuery UI Dialog, Bootstrap, react-focus-lock / focus-trap,
 * a native `<dialog>`, etc. — that trap forcibly returns focus to the modal
 * whenever focus lands on an element *outside* the modal's containment subtree.
 * The CBSDK search field then becomes impossible to type in, because it lives in
 * `document.body`, a sibling of the modal rather than a descendant.
 *
 * Every containment-based focus trap allows focus for elements that are DOM
 * descendants of its container (jQuery UI checks `closest('.ui-dialog')`,
 * focus-trap checks `container.contains(target)`, native dialogs don't mark
 * their own subtree `inert`, ...). So the robust, framework-agnostic fix is to
 * mount the CBSDK popup *inside* the active modal container instead of
 * `document.body`.
 */

const MODAL_SELECTORS = [
  '[aria-modal="true"]', // native <dialog> + most ARIA-compliant libraries
  '.ui-dialog', // jQuery UI Dialog (used by Drupal core modals)
  '.modal.show', // Bootstrap 4 / 5
  '.modal.in', // Bootstrap 3
  '[data-focus-lock-disabled="false"]', // react-focus-lock / focus-trap-react
].join(',');

function isVisible(el: Element | null): el is HTMLElement {
  if (!(el instanceof HTMLElement) || !el.isConnected) {
    return false;
  }
  const style = window.getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * True when `el` or one of its ancestors (up to `<body>`) establishes a
 * containing block for `position: fixed` descendants
 * (transform / filter / perspective / will-change / contain). CBSDK's popup is a
 * full-screen `position: fixed` overlay; mounting it inside such an element would
 * clip it to that element's box, so we must not anchor there.
 */
function establishesFixedContainingBlock(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    if (
      (style.transform && style.transform !== 'none') ||
      (style.perspective && style.perspective !== 'none') ||
      (style.filter && style.filter !== 'none') ||
      /transform|perspective|filter/.test(style.willChange || '') ||
      /paint|layout|strict|content/.test(style.contain || '')
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

function pickTopmost(candidates: HTMLElement[]): HTMLElement | null {
  if (candidates.length === 0) {
    return null;
  }
  return candidates.reduce((top, el) => {
    const zTop = parseInt(window.getComputedStyle(top).zIndex, 10) || 0;
    const zEl = parseInt(window.getComputedStyle(el).zIndex, 10) || 0;
    if (zEl !== zTop) {
      return zEl > zTop ? el : top;
    }
    // Same stacking level: whichever comes later in the document paints on top.
    return el.compareDocumentPosition(top) & Node.DOCUMENT_POSITION_PRECEDING
      ? el
      : top;
  });
}

/**
 * Finds the active host-page modal that CBSDK should mount inside so its inputs
 * remain focusable. Returns `null` when there is no modal to anchor to (the
 * normal case — CBSDK then mounts to `document.body` as before), or when
 * anchoring would clip CBSDK's fixed overlay.
 */
export function findFocusContainmentHost(
  doc: Document = document,
): HTMLElement | null {
  // Strongest signal: the element focused when `open()` was called is almost
  // always the trigger *inside* the host modal.
  const active = doc.activeElement;
  const fromActive =
    active instanceof HTMLElement
      ? active.closest<HTMLElement>(MODAL_SELECTORS)
      : null;

  const candidate =
    (fromActive && isVisible(fromActive) && fromActive) ||
    pickTopmost(
      Array.from(doc.querySelectorAll<HTMLElement>(MODAL_SELECTORS)).filter(
        isVisible,
      ),
    );

  if (!candidate) {
    return null;
  }

  if (establishesFixedContainingBlock(candidate)) {
    // eslint-disable-next-line no-console
    console.warn(
      '[ContentBrowserSDK] An active modal was detected, but it establishes a ' +
        'CSS containing block that would clip the picker overlay. Falling back ' +
        'to document.body. Pass `containerId` (an element inside the modal) to ' +
        'embed the picker correctly.',
    );
    return null;
  }

  return candidate;
}
