import { C as h } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { w as f } from "../chunks/watch.ChG-_stu.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { e as u } from "../chunks/class-map.Cn0czwWq.js";
import v from "./tab-panel.styles.js";
var b = Object.defineProperty, y = Object.getOwnPropertyDescriptor, n = (c, r, a, s) => {
  for (var t = s > 1 ? void 0 : s ? y(r, a) : r, o = c.length - 1, i; o >= 0; o--)
    (i = c[o]) && (t = (s ? i(r, a, t) : i(t)) || t);
  return s && t && b(r, a, t), t;
};
let C = 0;
const p = class p extends h {
  constructor() {
    super(...arguments), this.attrId = ++C, this.componentId = `cx-tab-panel-${this.attrId}`, this.name = "", this.active = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.id = this.id.length > 0 ? this.id : this.componentId, this.setAttribute("role", "tabpanel");
  }
  handleActiveChange() {
    this.setAttribute("aria-hidden", this.active ? "false" : "true");
  }
  render() {
    return d`
      <slot
        part="base"
        class=${u({
      "tab-panel": !0,
      "tab-panel--active": this.active
    })}
      ></slot>
    `;
  }
};
p.styles = [m, v];
let e = p;
n([
  l({ reflect: !0 })
], e.prototype, "name", 2);
n([
  l({ reflect: !0, type: Boolean })
], e.prototype, "active", 2);
n([
  f("active")
], e.prototype, "handleActiveChange", 1);
export {
  e as default
};
