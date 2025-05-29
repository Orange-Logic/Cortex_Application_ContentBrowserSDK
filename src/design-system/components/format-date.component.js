import { C as d } from "../chunks/cortex-element.v9MiwbrF.js";
import { x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n as t } from "../chunks/property.CtZ87in4.js";
import { L as p } from "../chunks/localize.DV9I313e.js";
var u = Object.defineProperty, e = (n, r, a, y) => {
  for (var i = void 0, m = n.length - 1, s; m >= 0; m--)
    (s = n[m]) && (i = s(r, a, i) || i);
  return i && u(r, a, i), i;
};
class o extends d {
  constructor() {
    super(...arguments), this.localize = new p(this), this.date = /* @__PURE__ */ new Date(), this.hourFormat = "auto";
  }
  render() {
    const r = new Date(this.date), a = this.hourFormat === "auto" ? void 0 : this.hourFormat === "12";
    if (!isNaN(r.getMilliseconds()))
      return h`
      <time datetime=${r.toISOString()}>
        ${this.localize.date(r, {
        day: this.day ?? void 0,
        era: this.era ?? void 0,
        hour: this.hour ?? void 0,
        hour12: a ?? void 0,
        minute: this.minute ?? void 0,
        month: this.month ?? void 0,
        second: this.second ?? void 0,
        timeZone: this.timeZone ?? void 0,
        timeZoneName: this.timeZoneName ?? void 0,
        weekday: this.weekday ?? void 0,
        year: this.year ?? void 0
      })}
      </time>
    `;
  }
}
e([
  t()
], o.prototype, "date");
e([
  t()
], o.prototype, "weekday");
e([
  t()
], o.prototype, "era");
e([
  t()
], o.prototype, "year");
e([
  t()
], o.prototype, "month");
e([
  t()
], o.prototype, "day");
e([
  t()
], o.prototype, "hour");
e([
  t()
], o.prototype, "minute");
e([
  t()
], o.prototype, "second");
e([
  t({ attribute: "time-zone-name" })
], o.prototype, "timeZoneName");
e([
  t({ attribute: "time-zone" })
], o.prototype, "timeZone");
e([
  t({ attribute: "hour-format" })
], o.prototype, "hourFormat");
export {
  o as default
};
