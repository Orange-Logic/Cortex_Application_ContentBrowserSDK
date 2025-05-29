import { SpectrumElement as h } from "./base.js";
import { reparentChildren as b } from "./shared.js";
import { OverlayTimer as C } from "./overlay-timer.js";
const E = new C(), f = () => {
}, _ = (o, e, r) => {
  const l = new AbortController(), a = /* @__PURE__ */ new Map(), p = () => {
    l.abort(), r();
  };
  let s, t;
  const u = requestAnimationFrame(() => {
    s = requestAnimationFrame(() => {
      t = requestAnimationFrame(() => {
        p();
      });
    });
  }), m = (n) => {
    n.target === o && (a.set(
      n.propertyName,
      a.get(n.propertyName) - 1
    ), a.get(n.propertyName) || a.delete(n.propertyName), a.size === 0 && p());
  }, y = (n) => {
    n.target === o && (a.has(n.propertyName) || a.set(n.propertyName, 0), a.set(
      n.propertyName,
      a.get(n.propertyName) + 1
    ), cancelAnimationFrame(u), cancelAnimationFrame(s), cancelAnimationFrame(t));
  };
  o.addEventListener("transitionrun", y, {
    signal: l.signal
  }), o.addEventListener("transitionend", m, {
    signal: l.signal
  }), o.addEventListener("transitioncancel", m, {
    signal: l.signal
  }), e();
};
function w() {
  return new Promise((o) => requestAnimationFrame(() => o()));
}
class g extends h {
  constructor() {
    super(...arguments), this.dispose = f, this.offset = 0, this.willPreventClose = !1;
  }
  async applyFocus(e, r) {
  }
  /* c8 ignore next 6 */
  get delayed() {
    return !1;
  }
  set delayed(e) {
  }
  /* c8 ignore next 6 */
  get disabled() {
    return !1;
  }
  set disabled(e) {
  }
  get elementResolver() {
    return this._elementResolver;
  }
  set elementResolver(e) {
    this._elementResolver = e;
  }
  /* c8 ignore next 3 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ensureOnDOM(e) {
  }
  /* c8 ignore next 5 */
  async makeTransition(e) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async manageDelay(e) {
  }
  /* c8 ignore next 3 */
  async manageDialogOpen() {
  }
  /* c8 ignore next 3 */
  async managePopoverOpen() {
  }
  /* c8 ignore next 3 */
  managePosition() {
  }
  /* c8 ignore next 6 */
  get open() {
    return !1;
  }
  set open(e) {
  }
  get placementController() {
    return this._placementController;
  }
  set placementController(e) {
    this._placementController = e;
  }
  requestSlottable() {
  }
  returnFocus() {
  }
  /* c8 ignore next 6 */
  get state() {
    return "closed";
  }
  set state(e) {
  }
  /* c8 ignore next 3 */
  manuallyKeepOpen() {
  }
  static update() {
    const e = new CustomEvent("cx-update-overlays", {
      bubbles: !0,
      cancelable: !0,
      composed: !0
    });
    document.dispatchEvent(e);
  }
  static async open(e, r, l, a) {
    await import("./overlay.component.js");
    const p = arguments.length === 2, s = l || e, t = new this();
    let u = !1;
    t.dispose = () => {
      t.addEventListener("cx-closed", () => {
        u || (m(), u = !0), requestAnimationFrame(() => {
          t.remove();
        });
      }), t.open = !1, t.dispose = f;
    };
    const m = b([s], t, {
      position: "beforeend",
      prepareCallback: (i) => {
        const d = i.slot;
        return i.removeAttribute("slot"), () => {
          i.slot = d;
        };
      }
    });
    if (!p && s && a) {
      const i = e, d = r, c = a;
      return g.applyOptions(t, {
        ...c,
        delayed: c.delayed || s.hasAttribute("delayed"),
        trigger: c.virtualTrigger || i,
        type: d === "modal" ? "modal" : d === "hover" ? "hint" : "auto"
      }), i.insertAdjacentElement("afterend", t), await t.updateComplete, t.open = !0, t.dispose;
    }
    const n = r;
    return t.append(s), g.applyOptions(t, {
      ...n,
      delayed: n.delayed || s.hasAttribute("delayed")
    }), t.updateComplete.then(() => {
      t.open = !0;
    }), t;
  }
  static applyOptions(e, r) {
    e.delayed = !!r.delayed, e.receivesFocus = r.receivesFocus ?? "auto", e.triggerElement = r.trigger || null, e.type = r.type || "modal", e.offset = r.offset ?? 0, e.placement = r.placement, e.willPreventClose = !!r.notImmediatelyClosable;
  }
}
export {
  g as AbstractOverlay,
  _ as guaranteedAllTransitionend,
  w as nextFrame,
  f as noop,
  E as overlayTimer
};
