import { C as m, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as i } from "../chunks/component.styles.BLcT4bOa.js";
import { i as b, x as p, E as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as x } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import y from "./menu-label.js";
const C = b`
  :host {
    display: block;
  }
`;
var h = Object.defineProperty, v = Object.getOwnPropertyDescriptor, a = (c, l, r, o) => {
  for (var e = o > 1 ? void 0 : o ? v(l, r) : l, s = c.length - 1, n; s >= 0; s--)
    (n = c[s]) && (e = (o ? n(l, r, e) : n(e)) || e);
  return o && e && h(l, r, e), e;
};
let t = class extends m {
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
t.styles = [i, C];
t.dependencies = {
  "cx-menu-label": y
};
a([
  d("slot")
], t.prototype, "defaultSlot", 2);
a([
  x({ type: String })
], t.prototype, "label", 2);
t = a([
  u("cx-menu-section")
], t);
export {
  t as default
};
