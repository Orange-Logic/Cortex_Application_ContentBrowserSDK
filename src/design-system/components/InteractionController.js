var o = /* @__PURE__ */ ((t) => (t[t.click = 0] = "click", t[t.hover = 1] = "hover", t[t.longpress = 2] = "longpress", t))(o || {});
class l {
  constructor(e, { handleOverlayReady: i, isPersistent: r, overlay: s }) {
    this.target = e, this.isLazilyOpen = !1, this.isPersistent = !1, this.isPersistent = !!r, this.handleOverlayReady = i, this.isPersistent && this.init(), this.overlay = s;
  }
  get activelyOpening() {
    return !1;
  }
  get open() {
    var e;
    return ((e = this.overlay) == null ? void 0 : e.open) ?? this.isLazilyOpen;
  }
  /**
   * Set `open` against the associated Overlay lazily.
   */
  set open(e) {
    if (e !== this.open) {
      if (this.isLazilyOpen = e, this.overlay) {
        this.overlay.open = e;
        return;
      }
      e && (customElements.whenDefined("cx-overlay").then(async () => {
        const { Overlay: i } = await import("./Overlay.js");
        this.overlay = new i(), this.overlay.open = !0;
      }), import("./overlay.component.js"));
    }
  }
  get overlay() {
    return this._overlay;
  }
  set overlay(e) {
    var i;
    e && this.overlay !== e && (this.overlay && this.overlay.removeController(this), this._overlay = e, this.overlay.addController(this), this.initOverlay(), this.prepareDescription(this.target), (i = this.handleOverlayReady) == null || i.call(this, this.overlay));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepareDescription(e) {
  }
  releaseDescription() {
  }
  shouldCompleteOpen() {
  }
  /* c8 ignore next 3 */
  init() {
  }
  /* c8 ignore next 3 */
  initOverlay() {
  }
  abort() {
    var e;
    this.releaseDescription(), (e = this.abortController) == null || e.abort();
  }
  hostConnected() {
    this.init();
  }
  hostDisconnected() {
    this.isPersistent || this.abort();
  }
}
export {
  l as InteractionController,
  o as InteractionTypes
};
