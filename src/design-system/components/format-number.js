import { C as p, c } from "../chunks/custom-element.X6y1saJZ.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { L as g } from "../chunks/localize.D5Yoww6T.js";
var y = Object.defineProperty, l = Object.getOwnPropertyDescriptor, t = (a, m, s, n) => {
  for (var e = n > 1 ? void 0 : n ? l(m, s) : m, u = a.length - 1, o; u >= 0; u--)
    (o = a[u]) && (e = (n ? o(m, s, e) : o(e)) || e);
  return n && e && y(m, s, e), e;
};
let i = class extends p {
  constructor() {
    super(...arguments), this.localize = new g(this), this.value = 0, this.type = "decimal", this.noGrouping = !1, this.currency = "USD", this.currencyDisplay = "symbol";
  }
  render() {
    return isNaN(this.value) ? "" : this.localize.number(this.value, {
      currency: this.currency,
      currencyDisplay: this.currencyDisplay,
      maximumFractionDigits: this.maximumFractionDigits,
      maximumSignificantDigits: this.maximumSignificantDigits,
      minimumFractionDigits: this.minimumFractionDigits,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      style: this.type,
      useGrouping: !this.noGrouping
    });
  }
};
t([
  r({ type: Number })
], i.prototype, "value", 2);
t([
  r()
], i.prototype, "type", 2);
t([
  r({ attribute: "no-grouping", type: Boolean })
], i.prototype, "noGrouping", 2);
t([
  r()
], i.prototype, "currency", 2);
t([
  r({ attribute: "currency-display" })
], i.prototype, "currencyDisplay", 2);
t([
  r({ attribute: "minimum-integer-digits", type: Number })
], i.prototype, "minimumIntegerDigits", 2);
t([
  r({ attribute: "minimum-fraction-digits", type: Number })
], i.prototype, "minimumFractionDigits", 2);
t([
  r({ attribute: "maximum-fraction-digits", type: Number })
], i.prototype, "maximumFractionDigits", 2);
t([
  r({ attribute: "minimum-significant-digits", type: Number })
], i.prototype, "minimumSignificantDigits", 2);
t([
  r({ attribute: "maximum-significant-digits", type: Number })
], i.prototype, "maximumSignificantDigits", 2);
i = t([
  c("cx-format-number")
], i);
export {
  i as default
};
