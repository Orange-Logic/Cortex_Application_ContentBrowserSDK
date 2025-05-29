import { C as b } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { w as p } from "../chunks/watch.ChG-_stu.js";
import { x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { r as u } from "../chunks/state.-o_YRGMi.js";
import { e as n } from "../chunks/class-map.Cn0czwWq.js";
import k from "./icon.component.js";
import y from "./radio.styles.js";
import { checkedSvg as v } from "./radio.svg.js";
var C = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, t = (c, i, d, r) => {
  for (var s = r > 1 ? void 0 : r ? _(i, d) : i, h = c.length - 1, l; h >= 0; h--)
    (l = c[h]) && (s = (r ? l(i, d, s) : l(s)) || s);
  return r && s && C(i, d, s), s;
};
const a = class a extends b {
  constructor() {
    super(), this.checked = !1, this.hasFocus = !1, this.size = "medium", this.disabled = !1, this.hideIndicator = !1, this.handleBlur = () => {
      this.hasFocus = !1, this.emit("cx-blur");
    }, this.handleClick = () => {
      this.disabled || (this.checked = !0);
    }, this.handleFocus = () => {
      this.hasFocus = !0, this.emit("cx-focus");
    }, this.addEventListener("blur", this.handleBlur), this.addEventListener("click", this.handleClick), this.addEventListener("focus", this.handleFocus);
  }
  connectedCallback() {
    super.connectedCallback(), this.setInitialAttributes();
  }
  setInitialAttributes() {
    this.setAttribute("role", "radio"), this.setAttribute("tabindex", "-1"), this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleCheckedChange() {
    this.setAttribute("aria-checked", this.checked ? "true" : "false"), this.setAttribute("tabindex", this.checked ? "0" : "-1");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  render() {
    return f`
      <span
        part="base"
        class=${n({
      radio: !0,
      "radio--checked": this.checked,
      "radio--disabled": this.disabled,
      "radio--focused": this.hasFocus,
      "radio--large": this.size === "large",
      "radio--medium": this.size === "medium",
      "radio--small": this.size === "small"
    })}
      >
        <span
          part="${`control${this.checked ? " control--checked" : ""}`}"
          class=${n({
      radio__control: !0,
      "radio__control--hidden": this.hideIndicator
    })}
        >
          ${this.checked ? v : ""}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `;
  }
};
a.styles = [m, y], a.dependencies = { "cx-icon": k };
let e = a;
t([
  u()
], e.prototype, "checked", 2);
t([
  u()
], e.prototype, "hasFocus", 2);
t([
  o()
], e.prototype, "value", 2);
t([
  o({ reflect: !0 })
], e.prototype, "size", 2);
t([
  o({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
t([
  o({ attribute: "hide-indicator", reflect: !0, type: Boolean })
], e.prototype, "hideIndicator", 2);
t([
  p("checked")
], e.prototype, "handleCheckedChange", 1);
t([
  p("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
export {
  e as default
};
