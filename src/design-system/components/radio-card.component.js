import { C as u } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as p } from "../chunks/component.styles.BLcT4bOa.js";
import { H as f } from "../chunks/slot.DJLm4Dig.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { x as m } from "../chunks/lit-element.DRlPF2me.js";
import { t as b } from "../chunks/custom-element.ttkHUa8w.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { r as n } from "../chunks/state.-o_YRGMi.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import { e as C } from "../chunks/class-map.Cn0czwWq.js";
import k from "./card.component.js";
import y from "./line-clamp.component.js";
import _ from "./radio.component.js";
import v from "./radio-card.styles.js";
var A = Object.defineProperty, F = Object.getOwnPropertyDescriptor, t = (l, s, r, a) => {
  for (var i = a > 1 ? void 0 : a ? F(s, r) : s, d = l.length - 1, o; d >= 0; d--)
    (o = l[d]) && (i = (a ? o(s, r, i) : o(i)) || i);
  return a && i && A(s, r, i), i;
};
let e = class extends u {
  constructor() {
    super(), this.hasSlotController = new f(this, "suffix"), this.checked = !1, this.hasFocus = !1, this.disabled = !1, this.hideIndicator = !1, this.handleBlur = () => {
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
    this.radio.checked = this.checked, this.setAttribute("aria-checked", this.checked ? "true" : "false"), this.setAttribute("tabindex", this.checked ? "0" : "-1"), this.radio.setAttribute("aria-checked", this.checked ? "true" : "false"), this.radio.setAttribute("tabindex", this.checked ? "0" : "-1");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false"), this.radio.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  render() {
    return m`<cx-card
      part="base"
      class=${C({
      "radio-card": !0,
      "radio-card--checked": this.checked,
      "radio-card--compact": !this.querySelector('[slot="image"]'),
      "radio-card--disabled": this.disabled,
      "radio-card--focused": this.hasFocus,
      "radio-card--has-suffix": this.hasSlotController.test("suffix")
    })}
    >
      <slot name="image" slot="image" class="radio-card__image"></slot>
      <cx-radio
        ?disabled=${this.disabled}
        ?hide-indicator=${this.hideIndicator}
      >
        <div class="radio-card__label">
          <cx-line-clamp lines="1">
            <slot></slot>
          </cx-line-clamp>
          <slot name="suffix" class="radio-card__label__suffix"></slot>
        </div>
      </cx-radio>
    </cx-card>`;
  }
};
e.styles = [p, v];
e.dependencies = {
  "cx-card": k,
  "cx-line-clamp": y,
  "cx-radio": _
};
t([
  x("cx-radio")
], e.prototype, "radio", 2);
t([
  n()
], e.prototype, "checked", 2);
t([
  n()
], e.prototype, "hasFocus", 2);
t([
  c()
], e.prototype, "value", 2);
t([
  c({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
t([
  c({ attribute: "hide-indicator", reflect: !0, type: Boolean })
], e.prototype, "hideIndicator", 2);
t([
  h("checked", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleCheckedChange", 1);
t([
  h("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
e = t([
  b("cx-radio-card")
], e);
export {
  e as default
};
