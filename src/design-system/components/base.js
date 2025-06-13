import { r as h } from "../chunks/lit-element.DRlPF2me.js";
const l = /* @__PURE__ */ new Set(), u = (e) => typeof e.startManagingContentDirection < "u" || e.tagName === "SP-THEME";
function m(e) {
  class s extends e {
    /**
     * @private
     */
    get isLTR() {
      return this.dir === "ltr";
    }
    hasVisibleFocusInTree() {
      const n = ((o = document) => {
        var d;
        let i = o.activeElement;
        for (; i != null && i.shadowRoot && i.shadowRoot.activeElement; )
          i = i.shadowRoot.activeElement;
        const c = i ? [i] : [];
        for (; i; ) {
          const a = i.assignedSlot || i.parentElement || ((d = i.getRootNode()) == null ? void 0 : d.host);
          a && c.push(a), i = a;
        }
        return c;
      })(this.getRootNode())[0];
      if (!n)
        return !1;
      try {
        return n.matches(":focus-visible") || n.matches(".focus-visible");
      } catch {
        return n.matches(".focus-visible");
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
          const { localName: n } = t;
          n.search("-") > -1 && !customElements.get(n) ? customElements.whenDefined(n).then(() => {
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
function f(e, s, r) {
  const t = e.getAttribute(s);
  let n = t ? t.split(/\s+/) : [];
  n = n.filter(
    (o) => !r.find((i) => o === i)
  ), n.length ? e.setAttribute(s, n.join(" ")) : e.removeAttribute(s);
}
function p(e, s, r) {
  const t = Array.isArray(r) ? r : [r], n = e.getAttribute(s), o = n ? n.split(/\s+/) : [];
  return t.every((c) => o.indexOf(c) > -1) ? () => {
  } : (o.push(...t), e.setAttribute(s, o.join(" ")), () => f(e, s, t));
}
function E(e, s) {
  customElements.get(e) || customElements.define(e, s);
}
export {
  b as SpectrumElement,
  m as SpectrumMixin,
  p as conditionAttributeWithId,
  f as conditionAttributeWithoutId,
  E as defineElement
};
