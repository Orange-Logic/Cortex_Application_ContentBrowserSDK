import { C as p } from "../chunks/cortex-element.v9MiwbrF.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { L as h } from "../chunks/localize.DV9I313e.js";
var m = Object.defineProperty, l = (s, i, r, a) => {
  for (var t = void 0, e = s.length - 1, o; e >= 0; e--)
    (o = s[e]) && (t = o(i, r, t) || t);
  return t && m(i, r, t), t;
};
class u extends p {
  constructor() {
    super(...arguments), this.localize = new h(this), this.value = 0, this.unit = "byte", this.display = "short";
  }
  render() {
    if (isNaN(this.value))
      return "";
    const i = ["", "kilo", "mega", "giga", "tera"], r = ["", "kilo", "mega", "giga", "tera", "peta"], a = this.unit === "bit" ? i : r, t = Math.max(
      0,
      Math.min(Math.floor(Math.log10(this.value) / 3), a.length - 1)
    ), e = a[t] + this.unit, o = parseFloat(
      (this.value / Math.pow(1e3, t)).toPrecision(3)
    );
    return this.localize.number(o, {
      style: "unit",
      unit: e,
      unitDisplay: this.display
    });
  }
}
l([
  n({ type: Number })
], u.prototype, "value");
l([
  n()
], u.prototype, "unit");
l([
  n()
], u.prototype, "display");
export {
  u as default
};
