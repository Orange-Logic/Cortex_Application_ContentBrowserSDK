import { r as u } from "./lit-element.DRlPF2me.js";
import { n as p } from "./property.CtZ87in4.js";
var f = Object.defineProperty, d = (a, t, e, i) => {
  for (var r = void 0, s = a.length - 1, c; s >= 0; s--)
    (c = a[s]) && (r = c(t, e, r) || r);
  return r && f(t, e, r), r;
};
const o = class o extends u {
  emit(t, e) {
    const i = new CustomEvent(t, {
      bubbles: !0,
      cancelable: !1,
      composed: !0,
      detail: {},
      ...e
    });
    return this.dispatchEvent(i), i;
  }
  static define(t, e = this, i = {}) {
    const r = customElements.get(t);
    if (!r) {
      try {
        customElements.define(t, e, i);
      } catch {
        customElements.define(
          t,
          class extends e {
          },
          i
        );
      }
      return;
    }
    let s = " (unknown version)", c = s;
    "version" in e && e.version && (s = " v" + e.version), "version" in r && r.version && (c = " v" + r.version), !(s && c && s === c) && console.warn(
      `Attempted to register <${t}>${s}, but <${t}>${c} has already been registered.`
    );
  }
  static createProperty(t, e) {
    super.createProperty(t, e), e != null && e.attribute && typeof e.attribute == "string" && !Object.prototype.hasOwnProperty.call(
      this.prototype,
      e.attribute
    ) && Object.prototype.hasOwnProperty.call(this.prototype, t) && Object.defineProperty(this.prototype, e.attribute, {
      get() {
        return this[t];
      },
      set(i) {
        this[t] = i;
      }
    });
  }
  constructor() {
    super(), Object.entries(
      this.constructor.dependencies
    ).forEach(([t, e]) => {
      this.constructor.define(t, e);
    });
  }
};
o.version = "1", o.dependencies = {};
let n = o;
d([
  p()
], n.prototype, "dir");
d([
  p()
], n.prototype, "lang");
export {
  n as C
};
