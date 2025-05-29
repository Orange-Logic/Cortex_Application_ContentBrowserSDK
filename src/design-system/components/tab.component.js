import { C as b } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { e as f } from "../chunks/query.BNveAlQo.js";
import { e as u } from "../chunks/class-map.Cn0czwWq.js";
import { L as v } from "../chunks/localize.DV9I313e.js";
import y from "./icon-button.component.js";
import x from "./tab.styles.js";
var C = Object.defineProperty, I = Object.getOwnPropertyDescriptor, e = (p, o, r, i) => {
  for (var s = i > 1 ? void 0 : i ? I(o, r) : o, c = p.length - 1, n; c >= 0; c--)
    (n = p[c]) && (s = (i ? n(o, r, s) : n(s)) || s);
  return i && s && C(o, r, s), s;
};
let _ = 0;
const l = class l extends b {
  constructor() {
    super(...arguments), this.localize = new v(this), this.attrId = ++_, this.componentId = `cx-tab-${this.attrId}`, this.panel = "", this.active = !1, this.closable = !1, this.disabled = !1, this.tabIndex = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tab");
  }
  handleCloseClick(o) {
    o.stopPropagation(), this.emit("cx-close");
  }
  handleActiveChange() {
    this.setAttribute("aria-selected", this.active ? "true" : "false");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false"), this.disabled && !this.active ? this.tabIndex = -1 : this.tabIndex = 0;
  }
  render() {
    return this.id = this.id.length > 0 ? this.id : this.componentId, d`
      <div
        part="base"
        class=${u({
      tab: !0,
      "tab--active": this.active,
      "tab--closable": this.closable,
      "tab--disabled": this.disabled
    })}
      >
        <slot></slot>
        ${this.closable ? d`
              <cx-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="close"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></cx-icon-button>
            ` : ""}
      </div>
    `;
  }
};
l.styles = [m, x], l.dependencies = { "cx-icon-button": y };
let t = l;
e([
  f(".tab")
], t.prototype, "tab", 2);
e([
  a({ reflect: !0 })
], t.prototype, "panel", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "active", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "closable", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
e([
  a({ reflect: !0, type: Number })
], t.prototype, "tabIndex", 2);
e([
  h("active")
], t.prototype, "handleActiveChange", 1);
e([
  h("disabled")
], t.prototype, "handleDisabledChange", 1);
export {
  t as default
};
