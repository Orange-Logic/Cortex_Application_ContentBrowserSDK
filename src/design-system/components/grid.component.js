import { C as l } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as u } from "../chunks/component.styles.BLcT4bOa.js";
import { x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { e as m } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { o as f } from "../chunks/style-map.De8UQbPP.js";
import x from "./grid.styles.js";
var d = Object.defineProperty, r = (n, o, e, y) => {
  for (var i = void 0, p = n.length - 1, c; p >= 0; p--)
    (c = n[p]) && (i = c(o, e, i) || i);
  return i && d(o, e, i), i;
};
const w = 12, a = class a extends l {
  constructor() {
    super(...arguments), this.spacing = "0px", this.columns = w, this.useFlexGap = !1, this.columnSpacing = 0, this.rowSpacing = 0, this.wrap = "wrap", this.useContainer = !1;
  }
  handleSlotChange() {
    this.defaultSlot.assignedElements().forEach((e) => {
      this.useContainer ? e.setAttribute("use-container", "") : e.removeAttribute("use-container");
    });
  }
  render() {
    const o = this.columnSpacing || this.spacing || 0, e = this.rowSpacing || this.spacing || 0;
    return g`<div
      class=${h({
      grid: !0,
      "grid--container": this.useContainer,
      "grid--flex-gap": this.useFlexGap,
      "grid--no-wrap": this.wrap === "nowrap",
      "grid--wrap": this.wrap === "wrap",
      "grid--wrap-reverse": this.wrap === "wrap-reverse"
    })}
      style=${f({
      "--cx-flex-column-spacing": this.useFlexGap ? o : "0px",
      "--cx-flex-row-spacing": this.useFlexGap ? e : "0px",
      "--cx-grid-column-spacing": this.useFlexGap ? "0px" : o,
      "--cx-grid-columns": this.columns,
      "--cx-grid-row-spacing": this.useFlexGap ? "0px" : e
    })}
      part="base"
    >
      <slot part="content" @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }
};
a.styles = [u, x];
let t = a;
r([
  m("slot")
], t.prototype, "defaultSlot");
r([
  s({ reflect: !0 })
], t.prototype, "spacing");
r([
  s({ reflect: !0, type: Number })
], t.prototype, "columns");
r([
  s({ attribute: "use-flex-gap", reflect: !0, type: Boolean })
], t.prototype, "useFlexGap");
r([
  s({ attribute: "column-spacing", reflect: !0, type: String })
], t.prototype, "columnSpacing");
r([
  s({ attribute: "row-spacing", reflect: !0, type: String })
], t.prototype, "rowSpacing");
r([
  s({ reflect: !0 })
], t.prototype, "wrap");
r([
  s({ attribute: "use-container", reflect: !0, type: Boolean })
], t.prototype, "useContainer");
export {
  t as default
};
