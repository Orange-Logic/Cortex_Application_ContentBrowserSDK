import { C as c, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { i as b, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
const u = b`
  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`;
var y = Object.defineProperty, C = Object.getOwnPropertyDescriptor, r = (l, a, o, s) => {
  for (var t = s > 1 ? void 0 : s ? C(a, o) : a, i = l.length - 1, n; i >= 0; i--)
    (n = l[i]) && (t = (s ? n(a, o, t) : n(t)) || t);
  return s && t && y(a, o, t), t;
};
let g = 0, e = class extends c {
  constructor() {
    super(...arguments), this.attrId = ++g, this.componentId = `cx-tab-panel-${this.attrId}`, this.name = "", this.active = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.id = this.id.length > 0 ? this.id : this.componentId, this.setAttribute("role", "tabpanel");
  }
  handleActiveChange() {
    this.setAttribute("aria-hidden", this.active ? "false" : "true");
  }
  render() {
    return f`
      <slot
        part="base"
        class=${v({
      "tab-panel": !0,
      "tab-panel--active": this.active
    })}
      ></slot>
    `;
  }
};
e.styles = [h, u];
r([
  p({ reflect: !0 })
], e.prototype, "name", 2);
r([
  p({ reflect: !0, type: Boolean })
], e.prototype, "active", 2);
r([
  m("active")
], e.prototype, "handleActiveChange", 1);
e = r([
  d("cx-tab-panel")
], e);
export {
  e as default
};
