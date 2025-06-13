import { C as h, c as p } from "../chunks/custom-element.X6y1saJZ.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as u } from "../chunks/property.CtZ87in4.js";
import { r as c } from "../chunks/state.-o_YRGMi.js";
import { L as f } from "../chunks/localize.D5Yoww6T.js";
var v = Object.defineProperty, T = Object.getOwnPropertyDescriptor, n = (r, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? T(t, i) : t, e = r.length - 1, l; e >= 0; e--)
    (l = r[e]) && (a = (o ? l(t, i, a) : l(a)) || a);
  return o && a && v(t, i, a), a;
};
const y = [
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
let s = class extends h {
  constructor() {
    super(...arguments), this.localize = new f(this), this.isoTime = "", this.relativeTime = "", this.date = /* @__PURE__ */ new Date(), this.format = "long", this.numeric = "auto", this.sync = !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this.updateTimeout);
  }
  render() {
    const r = /* @__PURE__ */ new Date(), t = new Date(this.date);
    if (isNaN(t.getMilliseconds()))
      return this.relativeTime = "", this.isoTime = "", "";
    const i = t.getTime() - r.getTime(), { unit: o, value: a } = y.find(
      (e) => Math.abs(i) < e.max
    );
    if (this.isoTime = t.toISOString(), this.relativeTime = this.localize.relativeTime(
      Math.round(i / a),
      o,
      {
        numeric: this.numeric,
        style: this.format
      }
    ), clearTimeout(this.updateTimeout), this.sync) {
      let e;
      o === "minute" ? e = m("second") : o === "hour" ? e = m("minute") : o === "day" ? e = m("hour") : e = m("day"), this.updateTimeout = window.setTimeout(
        () => this.requestUpdate(),
        e
      );
    }
    return d`<time datetime=${this.isoTime}>${this.relativeTime}</time>`;
  }
};
n([
  c()
], s.prototype, "isoTime", 2);
n([
  c()
], s.prototype, "relativeTime", 2);
n([
  u()
], s.prototype, "date", 2);
n([
  u()
], s.prototype, "format", 2);
n([
  u()
], s.prototype, "numeric", 2);
n([
  u({ type: Boolean })
], s.prototype, "sync", 2);
s = n([
  p("cx-relative-time")
], s);
function m(r) {
  const i = { day: 864e5, hour: 36e5, minute: 6e4, second: 1e3 }[r];
  return i - Date.now() % i;
}
export {
  s as default
};
