import { C as c, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { i as d, x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { o as g } from "../chunks/style-map.De8UQbPP.js";
import w from "./step.js";
const y = d`
  .stepper {
    display: flex;
    max-width: 100%;
    flex-wrap: wrap;
    row-gap: var(--cx-spacing-2x-small);
  }

  .stepper--vertical {
    flex-direction: column;
    /* gap: var(--cx-spacing-medium); */
  }
`;
var S = Object.defineProperty, b = Object.getOwnPropertyDescriptor, i = (o, t, s, p) => {
  for (var r = p > 1 ? void 0 : p ? b(t, s) : t, a = o.length - 1, l; a >= 0; a--)
    (l = o[a]) && (r = (p ? l(t, s, r) : l(r)) || r);
  return p && r && S(t, s, r), r;
};
let e = class extends c {
  constructor() {
    super(...arguments), this.direction = "horizontal", this.itemsPerRow = 5;
  }
  handleSlotChange() {
    const o = this.stepSlot.assignedElements();
    o.forEach((t, s) => {
      t.setAttribute("index", s.toString()), this.direction === "vertical" ? t.setAttribute("round", "") : t.removeAttribute("round"), s === o.length - 1 && t.setAttribute("last", "");
    });
  }
  render() {
    return h`<div
      class=${v({
      stepper: !0,
      "stepper--vertical": this.direction === "vertical"
    })}
      style=${g({
      "--columns": Math.max(this.itemsPerRow, 1).toString()
    })}
    >
      <slot name="step" @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }
};
e.styles = [f, y];
e.dependencies = {
  "cx-step": w
};
i([
  x('slot[name="step"]')
], e.prototype, "stepSlot", 2);
i([
  n({ reflect: !0, type: String })
], e.prototype, "direction", 2);
i([
  n({ attribute: "items-per-row", reflect: !0, type: Number })
], e.prototype, "itemsPerRow", 2);
i([
  u("direction", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleSlotChange", 1);
e = i([
  m("cx-stepper")
], e);
export {
  e as default
};
