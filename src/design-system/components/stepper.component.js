import { C as a } from "../chunks/cortex-element.v9MiwbrF.js";
import { c } from "../chunks/component.styles.BLcT4bOa.js";
import { w as f } from "../chunks/watch.ChG-_stu.js";
import { x as h } from "../chunks/lit-element.DRlPF2me.js";
import { t as u } from "../chunks/custom-element.ttkHUa8w.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { o as S } from "../chunks/style-map.De8UQbPP.js";
import g from "./step.component.js";
import x from "./stepper.styles.js";
var y = Object.defineProperty, w = Object.getOwnPropertyDescriptor, i = (s, t, o, p) => {
  for (var r = p > 1 ? void 0 : p ? w(t, o) : t, n = s.length - 1, l; n >= 0; n--)
    (l = s[n]) && (r = (p ? l(t, o, r) : l(r)) || r);
  return p && r && y(t, o, r), r;
};
let e = class extends a {
  constructor() {
    super(...arguments), this.direction = "horizontal", this.itemsPerRow = 5;
  }
  handleSlotChange() {
    const s = this.stepSlot.assignedElements();
    s.forEach((t, o) => {
      t.setAttribute("index", o.toString()), this.direction === "vertical" ? t.setAttribute("round", "") : t.removeAttribute("round"), o === s.length - 1 && t.setAttribute("last", "");
    });
  }
  render() {
    return h`<div
      class=${v({
      stepper: !0,
      "stepper--vertical": this.direction === "vertical"
    })}
      style=${S({
      "--columns": Math.max(this.itemsPerRow, 1).toString()
    })}
    >
      <slot name="step" @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }
};
e.styles = [c, x];
e.dependencies = {
  "cx-step": g
};
i([
  d('slot[name="step"]')
], e.prototype, "stepSlot", 2);
i([
  m({ reflect: !0, type: String })
], e.prototype, "direction", 2);
i([
  m({ attribute: "items-per-row", reflect: !0, type: Number })
], e.prototype, "itemsPerRow", 2);
i([
  f("direction", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleSlotChange", 1);
e = i([
  u("cx-stepper")
], e);
const U = e;
export {
  e as CxStepper,
  U as default
};
