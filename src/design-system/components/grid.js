import { C as c, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { i as x, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { e as m } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { o as w } from "../chunks/style-map.De8UQbPP.js";
const d = x`
  :host {
    display: block;
    box-sizing: border-box !important;
  }

  .grid {
    display: flex;
    flex-direction: row;
  }

  .grid--no-wrap {
    flex-wrap: nowrap;
  }

  .grid--wrap {
    flex-wrap: wrap;
  }

  .grid--wrap-reverse {
    flex-wrap: wrap-reverse;
  }

  .grid--flex-gap {
    gap: var(--cx-flex-row-spacing) var(--cx-flex-column-spacing);
  }

  .grid--container {
    container-type: inline-size;
  }
`;
var y = Object.defineProperty, S = Object.getOwnPropertyDescriptor, i = (r, e, a, o) => {
  for (var s = o > 1 ? void 0 : o ? S(e, a) : e, n = r.length - 1, l; n >= 0; n--)
    (l = r[n]) && (s = (o ? l(e, a, s) : l(s)) || s);
  return o && s && y(e, a, s), s;
};
const v = 12;
let t = class extends c {
  constructor() {
    super(...arguments), this.spacing = "0px", this.columns = v, this.useFlexGap = !1, this.columnSpacing = 0, this.rowSpacing = 0, this.wrap = "wrap", this.useContainer = !1;
  }
  handleSlotChange() {
    this.defaultSlot.assignedElements().forEach((e) => {
      this.useContainer ? e.setAttribute("use-container", "") : e.removeAttribute("use-container");
    });
  }
  render() {
    let r = this.columnSpacing || this.spacing || 0;
    (r === 0 || r === "0") && (r = r + "px");
    let e = this.rowSpacing || this.spacing || 0;
    return (e === 0 || e === "0") && (e = e + "px"), f`<div
      class=${h({
      grid: !0,
      "grid--container": this.useContainer,
      "grid--flex-gap": this.useFlexGap,
      "grid--no-wrap": this.wrap === "nowrap",
      "grid--wrap": this.wrap === "wrap",
      "grid--wrap-reverse": this.wrap === "wrap-reverse"
    })}
      style=${w({
      "--cx-flex-column-spacing": this.useFlexGap ? r : "0px",
      "--cx-flex-row-spacing": this.useFlexGap ? e : "0px",
      "--cx-grid-column-spacing": this.useFlexGap ? "0px" : r,
      "--cx-grid-columns": this.columns,
      "--cx-grid-row-spacing": this.useFlexGap ? "0px" : e
    })}
      part="base"
    >
      <slot part="content" @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }
};
t.styles = [g, d];
i([
  m("slot")
], t.prototype, "defaultSlot", 2);
i([
  p({ reflect: !0 })
], t.prototype, "spacing", 2);
i([
  p({ reflect: !0, type: Number })
], t.prototype, "columns", 2);
i([
  p({ attribute: "use-flex-gap", reflect: !0, type: Boolean })
], t.prototype, "useFlexGap", 2);
i([
  p({ attribute: "column-spacing", reflect: !0, type: String })
], t.prototype, "columnSpacing", 2);
i([
  p({ attribute: "row-spacing", reflect: !0, type: String })
], t.prototype, "rowSpacing", 2);
i([
  p({ reflect: !0 })
], t.prototype, "wrap", 2);
i([
  p({ attribute: "use-container", reflect: !0, type: Boolean })
], t.prototype, "useContainer", 2);
t = i([
  u("cx-grid")
], t);
export {
  t as default
};
