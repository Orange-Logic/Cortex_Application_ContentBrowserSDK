import { C as u, c as h } from "../chunks/custom-element.X6y1saJZ.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { L as m } from "../chunks/localize.D5Yoww6T.js";
var c = Object.defineProperty, f = Object.getOwnPropertyDescriptor, l = (a, r, s, e) => {
  for (var t = e > 1 ? void 0 : e ? f(r, s) : r, i = a.length - 1, n; i >= 0; i--)
    (n = a[i]) && (t = (e ? n(r, s, t) : n(t)) || t);
  return e && t && c(r, s, t), t;
};
let o = class extends u {
  constructor() {
    super(...arguments), this.localize = new m(this), this.value = 0, this.unit = "byte", this.display = "short";
  }
  render() {
    if (isNaN(this.value))
      return "";
    const a = ["", "kilo", "mega", "giga", "tera"], r = ["", "kilo", "mega", "giga", "tera", "peta"], s = this.unit === "bit" ? a : r, e = Math.max(
      0,
      Math.min(Math.floor(Math.log10(this.value) / 3), s.length - 1)
    ), t = s[e] + this.unit, i = parseFloat(
      (this.value / Math.pow(1e3, e)).toPrecision(3)
    );
    return this.localize.number(i, {
      style: "unit",
      unit: t,
      unitDisplay: this.display
    });
  }
};
l([
  p({ type: Number })
], o.prototype, "value", 2);
l([
  p()
], o.prototype, "unit", 2);
l([
  p()
], o.prototype, "display", 2);
o = l([
  h("cx-format-bytes")
], o);
export {
  o as default
};
