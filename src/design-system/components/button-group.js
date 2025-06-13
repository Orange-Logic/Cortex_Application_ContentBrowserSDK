import { C as c, c as g } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { i as p, x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as f } from "../chunks/property.CtZ87in4.js";
import { r as h } from "../chunks/state.-o_YRGMi.js";
import { e as _ } from "../chunks/query.BNveAlQo.js";
const x = p`
  :host {
    display: inline-block;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
  }
`;
var m = Object.defineProperty, v = Object.getOwnPropertyDescriptor, l = (o, t, r, e) => {
  for (var u = e > 1 ? void 0 : e ? v(t, r) : t, a = o.length - 1, i; a >= 0; a--)
    (i = o[a]) && (u = (e ? i(t, r, u) : i(u)) || u);
  return e && u && m(t, r, u), u;
};
let n = class extends c {
  constructor() {
    super(...arguments), this.disableRole = !1, this.label = "";
  }
  handleFocus(o) {
    const t = s(o.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--focus", !0);
  }
  handleBlur(o) {
    const t = s(o.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--focus", !1);
  }
  handleMouseOver(o) {
    const t = s(o.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--hover", !0);
  }
  handleMouseOut(o) {
    const t = s(o.target);
    t == null || t.toggleAttribute("data-cx-button-group__button--hover", !1);
  }
  handleSlotChange() {
    const o = [
      ...this.defaultSlot.assignedElements({ flatten: !0 })
    ];
    o.forEach((t) => {
      const r = o.indexOf(t), e = s(t);
      e && (e.toggleAttribute("data-cx-button-group__button", !0), e.toggleAttribute(
        "data-cx-button-group__button--first",
        r === 0
      ), e.toggleAttribute(
        "data-cx-button-group__button--inner",
        r > 0 && r < o.length - 1
      ), e.toggleAttribute(
        "data-cx-button-group__button--last",
        r === o.length - 1
      ), e.toggleAttribute(
        "data-cx-button-group__button--radio",
        e.tagName.toLowerCase() === "cx-radio-button"
      ));
    });
  }
  render() {
    return d`
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
n.styles = [b, x];
l([
  _("slot")
], n.prototype, "defaultSlot", 2);
l([
  h()
], n.prototype, "disableRole", 2);
l([
  f()
], n.prototype, "label", 2);
n = l([
  g("cx-button-group")
], n);
function s(o) {
  const t = "cx-button, cx-radio-button, cx-icon-button";
  return o.closest(t) ?? o.querySelector(t);
}
export {
  n as default
};
