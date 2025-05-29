import { C as c } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { H as f } from "../chunks/slot.DJLm4Dig.js";
import { w as b } from "../chunks/watch.ChG-_stu.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import { e as y } from "../chunks/class-map.Cn0czwWq.js";
import { o as x } from "../chunks/if-defined.D8U9hdvp.js";
import { u as v } from "../chunks/static.C35JqlCk.js";
import C from "./radio-button.styles.js";
var _ = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, s = (h, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? $(e, i) : e, a = h.length - 1, u; a >= 0; a--)
    (u = h[a]) && (o = (r ? u(e, i, o) : u(o)) || o);
  return r && o && _(e, i, o), o;
};
const n = class n extends c {
  constructor() {
    super(...arguments), this.hasSlotController = new f(
      this,
      "[default]",
      "prefix",
      "suffix"
    ), this.hasFocus = !1, this.checked = !1, this.disabled = !1, this.size = "medium", this.pill = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "presentation");
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleClick(e) {
    if (this.disabled) {
      e.preventDefault(), e.stopPropagation();
      return;
    }
    this.checked = !0;
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  /** Sets focus on the radio button. */
  focus(e) {
    this.input.focus(e);
  }
  /** Removes focus from the radio button. */
  blur() {
    this.input.blur();
  }
  render() {
    return v`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked ? " button--checked" : ""}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${y({
      button: !0,
      "button--checked": this.checked,
      "button--default": !0,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix"),
      "button--large": this.size === "large",
      "button--medium": this.size === "medium",
      "button--outline": !0,
      "button--pill": this.pill,
      "button--small": this.size === "small"
    })}
          aria-disabled=${this.disabled}
          type="button"
          value=${x(this.value)}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `;
  }
};
n.styles = [d, C];
let t = n;
s([
  p(".button")
], t.prototype, "input", 2);
s([
  p(".hidden-input")
], t.prototype, "hiddenInput", 2);
s([
  m()
], t.prototype, "hasFocus", 2);
s([
  l({ reflect: !0, type: Boolean })
], t.prototype, "checked", 2);
s([
  l()
], t.prototype, "value", 2);
s([
  l({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
s([
  l({ reflect: !0 })
], t.prototype, "size", 2);
s([
  l({ reflect: !0, type: Boolean })
], t.prototype, "pill", 2);
s([
  b("disabled", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleDisabledChange", 1);
export {
  t as default
};
