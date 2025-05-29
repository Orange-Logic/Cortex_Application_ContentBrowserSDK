import { C as g } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as h } from "../chunks/property.CtZ87in4.js";
import { r as f } from "../chunks/state.-o_YRGMi.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import m from "./button-group.styles.js";
var _ = Object.defineProperty, l = (r, e, t, a) => {
  for (var o = void 0, u = r.length - 1, c; u >= 0; u--)
    (c = r[u]) && (o = c(e, t, o) || o);
  return o && _(e, t, o), o;
};
const i = class i extends g {
  constructor() {
    super(...arguments), this.disableRole = !1, this.label = "";
  }
  handleFocus(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--focus", !0);
  }
  handleBlur(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--focus", !1);
  }
  handleMouseOver(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--hover", !0);
  }
  handleMouseOut(e) {
    const t = s(e.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--hover", !1);
  }
  handleSlotChange() {
    const e = [
      ...this.defaultSlot.assignedElements({ flatten: !0 })
    ];
    e.forEach((t) => {
      const a = e.indexOf(t), o = s(t);
      o && (o.toggleAttribute("data-cx-button-group__button", !0), o.toggleAttribute(
        "data-cx-button-group__button--first",
        a === 0
      ), o.toggleAttribute(
        "data-cx-button-group__button--inner",
        a > 0 && a < e.length - 1
      ), o.toggleAttribute(
        "data-cx-button-group__button--last",
        a === e.length - 1
      ), o.toggleAttribute(
        "data-cx-button-group__button--radio",
        o.tagName.toLowerCase() === "cx-radio-button"
      ));
    });
  }
  render() {
    return b`
      <div
        part="base"
        class="button-group"
        role="${this.disableRole ? "presentation" : "group"}"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
};
i.styles = [d, m];
let n = i;
l([
  p("slot")
], n.prototype, "defaultSlot");
l([
  f()
], n.prototype, "disableRole");
l([
  h()
], n.prototype, "label");
function s(r) {
  const e = "cx-button, cx-radio-button, cx-icon-button";
  return r.closest(e) ?? r.querySelector(e);
}
export {
  n as default
};
