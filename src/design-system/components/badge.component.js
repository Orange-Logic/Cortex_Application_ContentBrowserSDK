import { C as u } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { e as c } from "../chunks/class-map.Cn0czwWq.js";
import d from "./badge.styles.js";
var h = Object.defineProperty, s = (l, p, n, v) => {
  for (var t = void 0, r = l.length - 1, o; r >= 0; r--)
    (o = l[r]) && (t = o(p, n, t) || t);
  return t && h(p, n, t), t;
};
const i = class i extends u {
  constructor() {
    super(...arguments), this.variant = "primary", this.pill = !1, this.pulse = !1;
  }
  render() {
    return f`
      <span
        part="base"
        class=${c({
      badge: !0,
      "badge--danger": this.variant === "danger",
      "badge--neutral": this.variant === "neutral",
      "badge--pill": this.pill,
      "badge--primary": this.variant === "primary",
      "badge--pulse": this.pulse,
      "badge--success": this.variant === "success",
      "badge--warning": this.variant === "warning"
    })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
  }
};
i.styles = [m, d];
let e = i;
s([
  a({ reflect: !0 })
], e.prototype, "variant");
s([
  a({ reflect: !0, type: Boolean })
], e.prototype, "pill");
s([
  a({ reflect: !0, type: Boolean })
], e.prototype, "pulse");
export {
  e as default
};
