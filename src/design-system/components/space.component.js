import { C as c } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { x as m } from "../chunks/lit-element.DRlPF2me.js";
import { t as u } from "../chunks/custom-element.ttkHUa8w.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import y from "./space.styles.js";
var g = Object.defineProperty, h = Object.getOwnPropertyDescriptor, r = (a, p, i, s) => {
  for (var e = s > 1 ? void 0 : s ? h(p, i) : p, n = a.length - 1, l; n >= 0; n--)
    (l = a[n]) && (e = (s ? l(p, i, e) : l(e)) || e);
  return s && e && g(p, i, e), e;
};
let t = class extends c {
  constructor() {
    super(...arguments), this.block = !1, this.direction = "horizontal", this.spacing = "medium", this.wrap = "wrap", this.justifyContent = "normal", this.alignItems = "normal";
  }
  render() {
    return m`<slot part="base"></slot>`;
  }
};
t.styles = [f, y];
r([
  o({ reflect: !0, type: Boolean })
], t.prototype, "block", 2);
r([
  o({ reflect: !0, type: String })
], t.prototype, "direction", 2);
r([
  o({ reflect: !0, type: String })
], t.prototype, "spacing", 2);
r([
  o({ reflect: !0, type: String })
], t.prototype, "wrap", 2);
r([
  o({ attribute: "justify-content", reflect: !0, type: String })
], t.prototype, "justifyContent", 2);
r([
  o({ attribute: "align-items", reflect: !0, type: String })
], t.prototype, "alignItems", 2);
t = r([
  u("cx-space")
], t);
export {
  t as default
};
