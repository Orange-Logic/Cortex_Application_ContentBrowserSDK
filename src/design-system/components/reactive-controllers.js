const n = Symbol("element resolver updated");
class c {
  constructor(e, { selector: l } = { selector: "" }) {
    this._element = null, this._selector = "", this.mutationCallback = (t) => {
      let s = !1;
      t.forEach((r) => {
        if (!s) {
          if (r.type === "childList") {
            const o = this.element && [...r.removedNodes].includes(this.element), i = !!this.selector && [...r.addedNodes].some(
              this.elementIsSelected
            );
            s = s || o || i;
          }
          if (r.type === "attributes") {
            const o = r.target === this.element, i = !!this.selector && this.elementIsSelected(r.target);
            s = s || o || i;
          }
        }
      }), s && this.resolveElement();
    }, this.elementIsSelected = (t) => {
      var s;
      return this.selectorIsId ? (t == null ? void 0 : t.id) === this.selectorAsId : (s = t == null ? void 0 : t.matches) == null ? void 0 : s.call(t, this.selector);
    }, this.host = e, this.selector = l, this.observer = new MutationObserver(this.mutationCallback), this.host.addController(this);
  }
  get element() {
    return this._element;
  }
  set element(e) {
    if (e === this.element) return;
    const l = this.element;
    this._element = e, this.host.requestUpdate(n, l);
  }
  get selector() {
    return this._selector;
  }
  set selector(e) {
    e !== this.selector && (this.releaseElement(), this._selector = e, this.resolveElement());
  }
  get selectorAsId() {
    return this.selector.slice(1);
  }
  get selectorIsId() {
    return !!this.selector && this.selector.startsWith("#");
  }
  hostConnected() {
    this.resolveElement(), this.observer.observe(this.host.getRootNode(), {
      attributes: !0,
      childList: !0,
      subtree: !0
    });
  }
  hostDisconnected() {
    this.releaseElement(), this.observer.disconnect();
  }
  resolveElement() {
    if (!this.selector) {
      this.releaseElement();
      return;
    }
    const e = this.host.getRootNode();
    this.element = this.selectorIsId ? e.getElementById(this.selectorAsId) : e.querySelector(this.selector);
  }
  releaseElement() {
    this.element = null;
  }
}
export {
  c as ElementResolutionController,
  n as elementResolverUpdatedSymbol
};
