import { C as p, c } from "../chunks/custom-element.X6y1saJZ.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { f as d } from "../chunks/form-control.styles.vYJVd0IP.js";
import { i as f, x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import { e as _ } from "../chunks/query.BNveAlQo.js";
const x = f`
  :host {
    display: inline-block;
    width: 100%;
  }

  .input-group {
    display: flex;
    flex-wrap: nowrap;
  }

  .input-group ::slotted(cx-input) {
    width: 100%;
  }
`;
var b = Object.defineProperty, v = Object.getOwnPropertyDescriptor, i = (e, t, r, o) => {
  for (var u = o > 1 ? void 0 : o ? v(t, r) : t, l = e.length - 1, a; l >= 0; l--)
    (a = e[l]) && (u = (o ? a(t, r, u) : a(u)) || u);
  return o && u && b(t, r, u), u;
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
    return h`<div
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
  g,
  d,
  x
];
i([
  _("slot")
], n.prototype, "defaultSlot", 2);
i([
  m()
], n.prototype, "label", 2);
n = i([
  c("cx-input-group")
], n);
export {
  n as default
};
