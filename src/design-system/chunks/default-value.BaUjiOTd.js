import { u as c } from "./lit-element.DRlPF2me.js";
const C = (e = "value") => (u, s) => {
  const i = u.constructor, b = i.prototype.attributeChangedCallback;
  i.prototype.attributeChangedCallback = function(r, f, n) {
    const o = i.getPropertyOptions(e), l = typeof o.attribute == "string" ? o.attribute : e;
    if (r === l) {
      const t = o.converter || c, a = (typeof t == "function" ? t : (t == null ? void 0 : t.fromAttribute) ?? c.fromAttribute)(n, o.type);
      this[e] !== a && (this[s] = a);
    }
    b.call(this, r, f, n);
  };
};
export {
  C as d
};
