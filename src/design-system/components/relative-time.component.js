import { C as h } from "../chunks/cortex-element.v9MiwbrF.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as u } from "../chunks/property.CtZ87in4.js";
import { r as c } from "../chunks/state.-o_YRGMi.js";
import { L as p } from "../chunks/localize.DV9I313e.js";
var f = Object.defineProperty, o = (n, s, i, l) => {
  for (var e = void 0, r = n.length - 1, t; r >= 0; r--)
    (t = n[r]) && (e = t(s, i, e) || e);
  return e && f(s, i, e), e;
};
const v = [
  { max: 46e3, unit: "second", value: 1e3 },
  // max 46 seconds
  { max: 276e4, unit: "minute", value: 6e4 },
  // max 46 minutes
  { max: 72e6, unit: "hour", value: 36e5 },
  // max 20 hours
  { max: 5184e5, unit: "day", value: 864e5 },
  // max 6 days
  { max: 24192e5, unit: "week", value: 6048e5 },
  // max 28 days
  { max: 28512e6, unit: "month", value: 2592e6 },
  // max 11 months
  { max: 1 / 0, unit: "year", value: 31536e6 }
];
class a extends h {
  constructor() {
    super(...arguments), this.localize = new p(this), this.isoTime = "", this.relativeTime = "", this.date = /* @__PURE__ */ new Date(), this.format = "long", this.numeric = "auto", this.sync = !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this.updateTimeout);
  }
  render() {
    const s = /* @__PURE__ */ new Date(), i = new Date(this.date);
    if (isNaN(i.getMilliseconds()))
      return this.relativeTime = "", this.isoTime = "", "";
    const l = i.getTime() - s.getTime(), { unit: e, value: r } = v.find(
      (t) => Math.abs(l) < t.max
    );
    if (this.isoTime = i.toISOString(), this.relativeTime = this.localize.relativeTime(
      Math.round(l / r),
      e,
      {
        numeric: this.numeric,
        style: this.format
      }
    ), clearTimeout(this.updateTimeout), this.sync) {
      let t;
      e === "minute" ? t = m("second") : e === "hour" ? t = m("minute") : e === "day" ? t = m("hour") : t = m("day"), this.updateTimeout = window.setTimeout(
        () => this.requestUpdate(),
        t
      );
    }
    return d`<time datetime=${this.isoTime}>${this.relativeTime}</time>`;
  }
}
o([
  c()
], a.prototype, "isoTime");
o([
  c()
], a.prototype, "relativeTime");
o([
  u()
], a.prototype, "date");
o([
  u()
], a.prototype, "format");
o([
  u()
], a.prototype, "numeric");
o([
  u({ type: Boolean })
], a.prototype, "sync");
function m(n) {
  const i = { day: 864e5, hour: 36e5, minute: 6e4, second: 1e3 }[n];
  return i - Date.now() % i;
}
export {
  a as default
};
