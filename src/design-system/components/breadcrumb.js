import { C as p, c as h } from "../chunks/custom-element.X6y1saJZ.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { i as m, x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n as f } from "../chunks/property.CtZ87in4.js";
import { e as c } from "../chunks/query.BNveAlQo.js";
import { L as b } from "../chunks/localize.D5Yoww6T.js";
import g from "./icon.js";
const S = m`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`;
var x = Object.defineProperty, v = Object.getOwnPropertyDescriptor, l = (s, e, r, t) => {
  for (var a = t > 1 ? void 0 : t ? v(e, r) : e, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (a = (t ? n(e, r, a) : n(a)) || a);
  return t && a && x(e, r, a), a;
};
let o = class extends p {
  constructor() {
    super(...arguments), this.localize = new b(this), this.separatorDir = this.localize.dir(), this.label = "";
  }
  // Generates a clone of the separator element to use for each breadcrumb item
  getSeparator() {
    const e = this.separatorSlot.assignedElements({
      flatten: !0
    })[0].cloneNode(!0);
    return [e, ...e.querySelectorAll("[id]")].forEach(
      (r) => r.removeAttribute("id")
    ), e.setAttribute("data-default", ""), e.slot = "separator", e;
  }
  handleSlotChange() {
    const s = [
      ...this.defaultSlot.assignedElements({ flatten: !0 })
    ].filter(
      (e) => e.tagName.toLowerCase() === "cx-breadcrumb-item"
    );
    s.forEach((e, r) => {
      const t = e.querySelector('[slot="separator"]');
      t === null ? e.append(this.getSeparator()) : t.hasAttribute("data-default") && t.replaceWith(this.getSeparator()), r === s.length - 1 ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current");
    });
  }
  render() {
    return this.separatorDir !== this.localize.dir() && (this.separatorDir = this.localize.dir(), this.updateComplete.then(() => this.handleSlotChange())), u`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true" style="display: none">
        <slot name="separator" @slotchange=${this.handleSlotChange}>
          <cx-icon
            name=${this.localize.dir() === "rtl" ? "chevron_left" : "chevron_right"}
          ></cx-icon>
        </slot>
      </span>
    `;
  }
};
o.styles = [d, S];
o.dependencies = { "cx-icon": g };
l([
  c("slot")
], o.prototype, "defaultSlot", 2);
l([
  c('slot[name="separator"]')
], o.prototype, "separatorSlot", 2);
l([
  f()
], o.prototype, "label", 2);
o = l([
  h("cx-breadcrumb")
], o);
export {
  o as default
};
