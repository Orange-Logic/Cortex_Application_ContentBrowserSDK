import { C as p } from "../chunks/cortex-element.v9MiwbrF.js";
import { c } from "../chunks/component.styles.BLcT4bOa.js";
import { f as g } from "../chunks/form-control.styles.vYJVd0IP.js";
import { x as f } from "../chunks/lit-element.DRlPF2me.js";
import { t as d } from "../chunks/custom-element.ttkHUa8w.js";
import { n as h } from "../chunks/property.CtZ87in4.js";
import { e as m } from "../chunks/query.BNveAlQo.js";
import _ from "./input-group.styles.js";
var x = Object.defineProperty, b = Object.getOwnPropertyDescriptor, i = (e, t, r, o) => {
  for (var u = o > 1 ? void 0 : o ? b(t, r) : t, l = e.length - 1, a; l >= 0; l--)
    (a = e[l]) && (u = (o ? a(t, r, u) : a(u)) || u);
  return o && u && x(t, r, u), u;
};
function s(e) {
  const t = "cx-input, cx-select";
  return e.closest(t) ?? e.querySelector(t);
}
let n = class extends p {
  constructor() {
    super(...arguments), this.label = "";
  }
  handleFocus(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-input-group__input--focus", !0);
  }
  handleBlur(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-input-group__input--focus", !1);
  }
  handleMouseOver(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-input-group__input--hover", !0);
  }
  handleMouseOut(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-input-group__input--hover", !1);
  }
  handleSlotChange() {
    const e = [
      ...this.defaultSlot.assignedElements({ flatten: !0 })
    ];
    e.forEach((t) => {
      const r = e.indexOf(t), o = s(t);
      o && (o.toggleAttribute("data-cx-input-group__input", !0), o.toggleAttribute("data-cx-input-group__input--first", r === 0), o.toggleAttribute(
        "data-cx-input-group__input--inner",
        r > 0 && r < e.length - 1
      ), o.toggleAttribute(
        "data-cx-input-group__input--last",
        r === e.length - 1
      ));
    });
  }
  render() {
    return f`<div
      part="base"
      class="input-group"
      aria-label=${this.label}
      @focusout=${this.handleBlur}
      @focusin=${this.handleFocus}
      @mouseover=${this.handleMouseOver}
      @mouseout=${this.handleMouseOut}
    >
      <slot @slotchange=${this.handleSlotChange}></slot>
    </div>`;
  }
};
n.styles = [
  c,
  g,
  _
];
i([
  m("slot")
], n.prototype, "defaultSlot", 2);
i([
  h()
], n.prototype, "label", 2);
n = i([
  d("cx-input-group")
], n);
export {
  n as CxInputGroup
};
