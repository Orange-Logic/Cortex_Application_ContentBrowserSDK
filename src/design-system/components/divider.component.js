import { C as p } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { n as h } from "../chunks/property.CtZ87in4.js";
import u from "./divider.styles.js";
var v = Object.defineProperty, b = Object.getOwnPropertyDescriptor, i = (n, e, o, r) => {
  for (var t = r > 1 ? void 0 : r ? b(e, o) : e, s = n.length - 1, l; s >= 0; s--)
    (l = n[s]) && (t = (r ? l(e, o, t) : l(t)) || t);
  return r && t && v(e, o, t), t;
};
const c = class c extends p {
  constructor() {
    super(...arguments), this.vertical = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "separator");
  }
  handleVerticalChange() {
    this.setAttribute(
      "aria-orientation",
      this.vertical ? "vertical" : "horizontal"
    );
  }
};
c.styles = [f, u];
let a = c;
i([
  h({ reflect: !0, type: Boolean })
], a.prototype, "vertical", 2);
i([
  m("vertical")
], a.prototype, "handleVerticalChange", 1);
export {
  a as default
};
