import { C as a } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as p } from "../chunks/component.styles.BLcT4bOa.js";
import { x as l } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import { e as c } from "../chunks/class-map.Cn0czwWq.js";
import d from "./skeleton.styles.js";
var u = Object.defineProperty, v = (o, i, n, h) => {
  for (var e = void 0, t = o.length - 1, f; t >= 0; t--)
    (f = o[t]) && (e = f(i, n, e) || e);
  return e && u(i, n, e), e;
};
const s = class s extends a {
  constructor() {
    super(...arguments), this.effect = "none";
  }
  render() {
    return l`
      <div
        part="base"
        class=${c({
      skeleton: !0,
      "skeleton--pulse": this.effect === "pulse",
      "skeleton--sheen": this.effect === "sheen"
    })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
};
s.styles = [p, d];
let r = s;
v([
  m()
], r.prototype, "effect");
export {
  r as default
};
