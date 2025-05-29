import { C as o } from "../chunks/cortex-element.v9MiwbrF.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { L as p } from "../chunks/localize.DV9I313e.js";
var c = Object.defineProperty, t = (m, s, u, g) => {
  for (var e = void 0, n = m.length - 1, a; n >= 0; n--)
    (a = m[n]) && (e = a(s, u, e) || e);
  return e && c(s, u, e), e;
};
class r extends o {
  constructor() {
    super(...arguments), this.localize = new p(this), this.value = 0, this.type = "decimal", this.noGrouping = !1, this.currency = "USD", this.currencyDisplay = "symbol";
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
}
t([
  i({ type: Number })
], r.prototype, "value");
t([
  i()
], r.prototype, "type");
t([
  i({ attribute: "no-grouping", type: Boolean })
], r.prototype, "noGrouping");
t([
  i()
], r.prototype, "currency");
t([
  i({ attribute: "currency-display" })
], r.prototype, "currencyDisplay");
t([
  i({ attribute: "minimum-integer-digits", type: Number })
], r.prototype, "minimumIntegerDigits");
t([
  i({ attribute: "minimum-fraction-digits", type: Number })
], r.prototype, "minimumFractionDigits");
t([
  i({ attribute: "maximum-fraction-digits", type: Number })
], r.prototype, "maximumFractionDigits");
t([
  i({ attribute: "minimum-significant-digits", type: Number })
], r.prototype, "minimumSignificantDigits");
t([
  i({ attribute: "maximum-significant-digits", type: Number })
], r.prototype, "maximumSignificantDigits");
export {
  r as default
};
