import { C as m } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { e as g } from "../chunks/class-map.Cn0czwWq.js";
import x from "./grid-item.styles.js";
function y(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/(\s+|_)/g, "-").toLowerCase().replace(/^-+|-+$/g, "");
}
function b(e) {
  return e.split(/[\s_-]+/).map(
    (t, r) => r === 0 ? t.toLowerCase() : t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  ).join("");
}
const d = (e) => {
  const t = e.match(/^[-]+/), r = e.replace(/^-+/, ""), o = y(r);
  return t ? t[0] + o : o;
}, C = (e, t = !1) => {
  if (!e) return {};
  const r = {};
  return e.trim().split(";").filter((o) => !!o).forEach((o) => {
    const s = o.trim().split(":"), l = t ? b(s[0]) : s[0], c = s[1];
    c && (r[l] = c.trim());
  }), r;
}, v = (e, t = !1) => {
  let r = "";
  return (t ? Object.keys(e).sort((s, l) => s.localeCompare(l)) : Object.keys(e)).forEach((s) => {
    r += `${d(s)}:${e[s]};`;
  }), r;
};
var O = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, n = (e, t, r, o) => {
  for (var s = o > 1 ? void 0 : o ? _(t, r) : t, l = e.length - 1, c; l >= 0; l--)
    (c = e[l]) && (s = (o ? c(t, r, s) : c(s)) || s);
  return o && s && O(t, r, s), s;
};
const p = class p extends m {
  constructor() {
    super(...arguments), this.xs = 12, this.sm = null, this.md = null, this.lg = null, this.xl = null, this.useContainer = !1;
  }
  handleXsChange() {
    const t = C(this.getAttribute("style") || "");
    t["--cx-grid-item-xs"] = this.xs, t["--cx-grid-item-sm"] = this.sm || this.xs, t["--cx-grid-item-md"] = this.md || this.sm || this.xs, t["--cx-grid-item-lg"] = this.lg || this.md || this.sm || this.xs, t["--cx-grid-item-xl"] = this.xl || this.lg || this.md || this.sm || this.xs, this.setAttribute("style", v(t));
  }
  render() {
    return f`<div
      class=${g({
      "grid-item": !0
    })}
      part="base"
    >
      <slot part="content"></slot>
    </div>`;
  }
};
p.styles = [h, x];
let i = p;
n([
  a({ reflect: !0 })
], i.prototype, "xs", 2);
n([
  a({ reflect: !0 })
], i.prototype, "sm", 2);
n([
  a({ reflect: !0 })
], i.prototype, "md", 2);
n([
  a({ reflect: !0 })
], i.prototype, "lg", 2);
n([
  a({ reflect: !0 })
], i.prototype, "xl", 2);
n([
  a({ attribute: "use-container", reflect: !0, type: Boolean })
], i.prototype, "useContainer", 2);
n([
  u(["xs", "sm", "md", "lg", "xl"])
], i.prototype, "handleXsChange", 1);
export {
  i as default
};
