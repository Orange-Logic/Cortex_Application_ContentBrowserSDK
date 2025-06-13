import { r as p } from "./lit-element.DRlPF2me.js";
import { n as d } from "./property.CtZ87in4.js";
var l = Object.defineProperty, f = (s, e, t, i) => {
  for (var r = void 0, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = o(e, t, r) || r);
  return r && l(e, t, r), r;
};
const u = class u extends p {
  emit(e, t) {
    const i = new CustomEvent(e, {
      bubbles: !0,
      cancelable: !1,
      composed: !0,
      detail: {},
      ...t
    });
    return this.dispatchEvent(i), i;
  }
  static define(e, t = this, i = {}) {
    const r = customElements.get(e);
    if (!r) {
      try {
        customElements.define(e, t, i);
      } catch {
        customElements.define(
          e,
          class extends t {
          },
          i
        );
      }
      return;
    }
    let n = " (unknown version)", o = n;
    "version" in t && t.version && (n = " v" + t.version), "version" in r && r.version && (o = " v" + r.version), !(n && o && n === o) && console.warn(
      `Attempted to register <${e}>${n}, but <${e}>${o} has already been registered.`
    );
  }
  static createProperty(e, t) {
    super.createProperty(e, t), t != null && t.attribute && typeof t.attribute == "string" && !Object.prototype.hasOwnProperty.call(
      this.prototype,
      t.attribute
    ) && Object.prototype.hasOwnProperty.call(this.prototype, e) && Object.defineProperty(this.prototype, t.attribute, {
      get() {
        return this[e];
      },
      set(i) {
        this[e] = i;
      }
    });
  }
  constructor() {
    super(), Object.entries(
      this.constructor.dependencies
    ).forEach(([e, t]) => {
      this.constructor.define(e, t);
    });
  }
};
u.version = "1", u.dependencies = {};
let c = u;
f([
  d()
], c.prototype, "dir");
f([
  d()
], c.prototype, "lang");
const a = (s, e) => (window.customElements.get(s) || window.customElements.define(s, e), e), h = (s, e) => {
  const { elements: t, kind: i } = e;
  return {
    elements: t,
    // This callback is called once the class is otherwise fully defined
    finisher(r) {
      window.customElements.get(s) || window.customElements.define(s, r);
    },
    kind: i
  };
}, w = (s) => (e) => typeof e == "function" ? a(s, e) : h(s, e);
export {
  c as C,
  w as c
};
