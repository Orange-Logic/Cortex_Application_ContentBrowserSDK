import { r as h } from "../chunks/lit-element.DRlPF2me.js";
const l = /* @__PURE__ */ new Set(), u = (i) => typeof i.startManagingContentDirection < "u" || i.tagName === "SP-THEME";
function m(i) {
  class s extends i {
    /**
     * @private
     */
    get isLTR() {
      return this.dir === "ltr";
    }
    hasVisibleFocusInTree() {
      const e = ((o = document) => {
        var d;
        let n = o.activeElement;
        for (; n != null && n.shadowRoot && n.shadowRoot.activeElement; )
          n = n.shadowRoot.activeElement;
        const c = n ? [n] : [];
        for (; n; ) {
          const a = n.assignedSlot || n.parentElement || ((d = n.getRootNode()) == null ? void 0 : d.host);
          a && c.push(a), n = a;
        }
        return c;
      })(this.getRootNode())[0];
      if (!e)
        return !1;
      try {
        return e.matches(":focus-visible") || e.matches(".focus-visible");
      } catch {
        return e.matches(".focus-visible");
      }
    }
    connectedCallback() {
      if (!this.hasAttribute("dir")) {
        let t = this.assignedSlot || this.parentNode;
        for (; t !== document.documentElement && !u(t); )
          t = t.assignedSlot || // step into the shadow DOM of the parent of a slotted node
          t.parentNode || // DOM Element detected
          t.host;
        if (this.dir = t.dir === "rtl" ? t.dir : this.dir || "ltr", t === document.documentElement)
          l.add(this);
        else {
          const { localName: e } = t;
          e.search("-") > -1 && !customElements.get(e) ? customElements.whenDefined(e).then(() => {
            t.startManagingContentDirection(this);
          }) : t.startManagingContentDirection(this);
        }
        this._dirParent = t;
      }
      super.connectedCallback();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._dirParent && (this._dirParent === document.documentElement ? l.delete(this) : this._dirParent.stopManagingContentDirection(this), this.removeAttribute("dir"));
    }
  }
  return s;
}
class b extends m(h) {
}
function f(i, s, r) {
  const t = i.getAttribute(s);
  let e = t ? t.split(/\s+/) : [];
  e = e.filter(
    (o) => !r.find((n) => o === n)
  ), e.length ? i.setAttribute(s, e.join(" ")) : i.removeAttribute(s);
}
function p(i, s, r) {
  const t = Array.isArray(r) ? r : [r], e = i.getAttribute(s), o = e ? e.split(/\s+/) : [];
  return t.every((c) => o.indexOf(c) > -1) ? () => {
  } : (o.push(...t), i.setAttribute(s, o.join(" ")), () => f(i, s, t));
}
function E(i, s) {
  customElements.define(i, s);
}
export {
  b as SpectrumElement,
  m as SpectrumMixin,
  p as conditionAttributeWithId,
  f as conditionAttributeWithoutId,
  E as defineElement
};
