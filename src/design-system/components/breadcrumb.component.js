import { C as c } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import { e as h } from "../chunks/query.BNveAlQo.js";
import { L as u } from "../chunks/localize.DV9I313e.js";
import g from "./icon.component.js";
import S from "./breadcrumb.styles.js";
var b = Object.defineProperty, i = (n, r, t, o) => {
  for (var e = void 0, l = n.length - 1, p; l >= 0; l--)
    (p = n[l]) && (e = p(r, t, e) || e);
  return e && b(r, t, e), e;
};
const s = class s extends c {
  constructor() {
    super(...arguments), this.localize = new u(this), this.separatorDir = this.localize.dir(), this.label = "";
  }
  // Generates a clone of the separator element to use for each breadcrumb item
  getSeparator() {
    const t = this.separatorSlot.assignedElements({
      flatten: !0
    })[0].cloneNode(!0);
    return [t, ...t.querySelectorAll("[id]")].forEach(
      (o) => o.removeAttribute("id")
    ), t.setAttribute("data-default", ""), t.slot = "separator", t;
  }
  handleSlotChange() {
    const r = [
      ...this.defaultSlot.assignedElements({ flatten: !0 })
    ].filter(
      (t) => t.tagName.toLowerCase() === "cx-breadcrumb-item"
    );
    r.forEach((t, o) => {
      const e = t.querySelector('[slot="separator"]');
      e === null ? t.append(this.getSeparator()) : e.hasAttribute("data-default") && e.replaceWith(this.getSeparator()), o === r.length - 1 ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current");
    });
  }
  render() {
    return this.separatorDir !== this.localize.dir() && (this.separatorDir = this.localize.dir(), this.updateComplete.then(() => this.handleSlotChange())), f`
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
s.styles = [d, S], s.dependencies = { "cx-icon": g };
let a = s;
i([
  h("slot")
], a.prototype, "defaultSlot");
i([
  h('slot[name="separator"]')
], a.prototype, "separatorSlot");
i([
  m()
], a.prototype, "label");
export {
  a as default
};
