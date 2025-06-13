import { C as h, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { L as y } from "../chunks/localize.D5Yoww6T.js";
var v = Object.defineProperty, c = Object.getOwnPropertyDescriptor, e = (i, a, m, s) => {
  for (var r = s > 1 ? void 0 : s ? c(a, m) : a, n = i.length - 1, p; n >= 0; n--)
    (p = i[n]) && (r = (s ? p(a, m, r) : p(r)) || r);
  return s && r && v(a, m, r), r;
};
let t = class extends h {
  constructor() {
    super(...arguments), this.localize = new y(this), this.date = /* @__PURE__ */ new Date(), this.hourFormat = "auto";
  }
  render() {
    const i = new Date(this.date), a = this.hourFormat === "auto" ? void 0 : this.hourFormat === "12";
    if (!isNaN(i.getMilliseconds()))
      return u`
      <time datetime=${i.toISOString()}>
        ${this.localize.date(i, {
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
};
e([
  o()
], t.prototype, "date", 2);
e([
  o()
], t.prototype, "weekday", 2);
e([
  o()
], t.prototype, "era", 2);
e([
  o()
], t.prototype, "year", 2);
e([
  o()
], t.prototype, "month", 2);
e([
  o()
], t.prototype, "day", 2);
e([
  o()
], t.prototype, "hour", 2);
e([
  o()
], t.prototype, "minute", 2);
e([
  o()
], t.prototype, "second", 2);
e([
  o({ attribute: "time-zone-name" })
], t.prototype, "timeZoneName", 2);
e([
  o({ attribute: "time-zone" })
], t.prototype, "timeZone", 2);
e([
  o({ attribute: "hour-format" })
], t.prototype, "hourFormat", 2);
t = e([
  d("cx-format-date")
], t);
export {
  t as default
};
