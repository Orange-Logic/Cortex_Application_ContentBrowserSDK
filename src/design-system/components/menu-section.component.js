import { C as i } from "../chunks/cortex-element.v9MiwbrF.js";
import { c } from "../chunks/component.styles.BLcT4bOa.js";
import { x as p, E as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as b } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import u from "./menu-label.component.js";
import h from "./menu-section.styles.js";
var y = Object.defineProperty, n = (o, s, a, v) => {
  for (var e = void 0, r = o.length - 1, m; r >= 0; r--)
    (m = o[r]) && (e = m(s, a, e) || e);
  return e && y(s, a, e), e;
};
const l = class l extends i {
  constructor() {
    super(...arguments), this.label = "";
  }
  connectedCallback() {
    super.connectedCallback();
  }
  render() {
    return p`
      ${this.label.length > 0 ? p`<cx-menu-label part="label">${this.label}</cx-menu-label>` : f}
      <slot></slot>
    `;
  }
};
l.styles = [c, h], l.dependencies = {
  "cx-menu-label": u
};
let t = l;
n([
  d("slot")
], t.prototype, "defaultSlot");
n([
  b({ type: String })
], t.prototype, "label");
export {
  t as default
};
