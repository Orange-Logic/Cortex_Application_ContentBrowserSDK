import { C as u, c as p } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { H as m } from "../chunks/slot.DJLm4Dig.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { i as f, x } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { r as n } from "../chunks/state.-o_YRGMi.js";
import { e as g } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import _ from "./card.js";
import y from "./line-clamp.js";
import C from "./radio.js";
const w = f`
  :host {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    position: relative;
    --label-color: var(--cx-input-label-color);
    --label-text-align: left;
    --description-color: var(--cx-input-label-color);
    --description-text-align: left;
    --toggle-size: var(--cx-toggle-size-large);
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio-card {
    --border-radius: var(--cx-border-radius-large);
    --box-shadow: none;
    --padding: var(--cx-spacing-small);
    --image-border-radius: var(--cx-border-radius-medium);
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .radio-card--checked:not(.radio-card--grouped)::part(base) {
    height: 100%;
  }

  .radio-card--grouped::part(base) {
    border-radius: 0;
    border-top-width: 0;
  }

  .radio-card--grouped.radio-card--horizontal::part(base) {
    border-left-width: 0;
    border-top-width: var(--border-width);
  }

  :host(:first-child) .radio-card--grouped::part(base) {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-width: var(--border-width);
  }

  :host(:last-child) .radio-card--grouped::part(base) {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  :host(:first-child) .radio-card--grouped.radio-card--horizontal::part(base) {
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-left-width: var(--border-width);
  }

  :host(:last-child) .radio-card--grouped.radio-card--horizontal::part(base) {
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .radio-card::part(image) {
    background-color: transparent;
  }

  .radio-card--compact::part(image) {
    display: none;
  }

  .radio-card--checked:not(.radio-card--grouped) {
    --border-color: var(--cx-color-primary);
  }

  .radio-card--checked::part(base) {
    background-color: var(--cx-color-primary-50);
  }

  .radio-card--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .radio-card__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cx-spacing-2x-small);
    text-transform: var(--cx-radio-card-label-text-transform, none);
  }

  .radio-card__description {
    margin-left: calc(var(--toggle-size) + 0.5em);
  }

  .radio-card__description > cx-line-clamp {
    color: var(--description-color);
    line-height: var(--cx-line-height-medium);
    text-align: var(--description-text-align);
  }

  .radio-card__label > cx-line-clamp {
    color: var(--label-color);
    flex: 1 1 auto;
    text-align: var(--label-text-align);
  }

  .radio-card--has-suffix .radio-card__label__suffix {
    width: 3rem;
  }

  .radio-card__label__suffix {
    display: flex;
    justify-content: flex-end;
    height: fit-content;
  }

  .radio-card__image::slotted(img) {
    border-radius: var(--cx-border-radius-small);
    width: 100%;
  }

  .radio-card__image::slotted(*) {
    display: flex;
    flex-direction: column;
  }

  cx-radio {
    --toggle-size: var(--toggle-size);
  }

  cx-radio::part(base) {
    align-items: center;
    width: 100%;
  }
`;
var k = Object.defineProperty, A = Object.getOwnPropertyDescriptor, e = (i, a, o, d) => {
  for (var t = d > 1 ? void 0 : d ? A(a, o) : a, s = i.length - 1, l; s >= 0; s--)
    (l = i[s]) && (t = (d ? l(a, o, t) : l(t)) || t);
  return d && t && k(a, o, t), t;
};
let r = class extends u {
  constructor() {
    super(), this.hasSlotController = new m(this, "suffix"), this.checked = !1, this.hasFocus = !1, this.disabled = !1, this.hideIndicator = !1, this.handleBlur = () => {
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
    const i = !!(this.parentElement && this.parentElement.getAttribute("compact") !== null), a = !!(this.parentElement && this.parentElement.getAttribute("horizontal") !== null);
    return x`<cx-card
      part="base"
      class=${v({
      "radio-card": !0,
      "radio-card--checked": this.checked,
      "radio-card--compact": !this.querySelector('[slot="image"]'),
      "radio-card--disabled": this.disabled,
      "radio-card--focused": this.hasFocus,
      "radio-card--grouped": i,
      "radio-card--has-suffix": this.hasSlotController.test("suffix"),
      "radio-card--horizontal": a
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
      <div class="radio-card__description">
        <cx-line-clamp lines="3">
          <slot name="help-text"></slot>
        </cx-line-clamp>
      </div>
    </cx-card>`;
  }
};
r.styles = [b, w];
r.dependencies = {
  "cx-card": _,
  "cx-line-clamp": y,
  "cx-radio": C
};
e([
  g("cx-radio")
], r.prototype, "radio", 2);
e([
  n()
], r.prototype, "checked", 2);
e([
  n()
], r.prototype, "hasFocus", 2);
e([
  c()
], r.prototype, "value", 2);
e([
  c({ reflect: !0, type: Boolean })
], r.prototype, "disabled", 2);
e([
  c({ attribute: "hide-indicator", reflect: !0, type: Boolean })
], r.prototype, "hideIndicator", 2);
e([
  h("checked", { waitUntilFirstUpdate: !0 })
], r.prototype, "handleCheckedChange", 1);
e([
  h("disabled", { waitUntilFirstUpdate: !0 })
], r.prototype, "handleDisabledChange", 1);
r = e([
  p("cx-radio-card")
], r);
export {
  r as default
};
