import { C as p, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { f as v } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as w } from "../chunks/default-value.BaUjiOTd.js";
import { F as b } from "../chunks/form.CBFaCEBn.js";
import { H as x } from "../chunks/slot.DJLm4Dig.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { i as _, x as n } from "../chunks/lit-element.DRlPF2me.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { r as g } from "../chunks/state.-o_YRGMi.js";
import { e as k } from "../chunks/query.BNveAlQo.js";
import { e as d } from "../chunks/class-map.Cn0czwWq.js";
import { o as y } from "../chunks/if-defined.D8U9hdvp.js";
import { l as C } from "../chunks/live.C0NiCo2U.js";
const z = _`
  :host {
    display: inline-block;
    --thumb-color: var(--cx-color-neutral-0);
    --thumb-offset: 4px;
    --control-color: var(--cx-color-neutral-300);
  }

  :host([size='small']) {
    --height: var(--cx-toggle-size-small);
    --thumb-size: calc(var(--cx-toggle-size-small) - var(--thumb-offset));
    --width: calc(var(--height) * 1.75);

    font-size: var(--cx-input-font-size-small);
  }

  :host([size='medium']) {
    --height: var(--cx-toggle-size-medium);
    --thumb-size: calc(var(--cx-toggle-size-medium) - var(--thumb-offset));
    --width: calc(var(--height) * 1.6);

    font-size: var(--cx-input-font-size-medium);
  }

  :host([size='large']) {
    --height: var(--cx-toggle-size-large);
    --thumb-size: calc(var(--cx-toggle-size-large) - var(--thumb-offset));
    --width: calc(var(--height) * 1.6);

    font-size: var(--cx-input-font-size-large);
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--cx-input-font-family);
    font-size: inherit;
    font-weight: var(--cx-input-font-weight);
    color: var(--cx-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--control-color);
    border: solid var(--cx-input-border-width) var(--control-color);
    border-radius: var(--height);
    transition:
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-color);
    border-radius: 50%;
    border: solid var(--cx-input-border-width) var(--control-color);
    transition:
      var(--cx-transition-fast) translate ease,
      var(--cx-transition-fast) background-color,
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) box-shadow;
    transform: translateX(calc((var(--width) - var(--height)) / -2));
  }
  @supports (translate: 0px) {
    .switch__control .switch__thumb {
      translate: calc((var(--width) - var(--height)) / -2);
      transform: none;
    }
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
    background-color: var(--control-color);
    border-color: var(--control-color);
  }

  .switch:not(.switch--checked):not(.switch--disabled)
    .switch__control:hover
    .switch__thumb {
    background-color: var(--thumb-color);
    border-color: var(--control-color);
  }

  /* Focus */
  .switch:not(.switch--disabled)
    .switch__input:focus-visible
    ~ .switch__control {
    background-color: var(--control-color);
    border-color: var(--control-color);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--thumb-color);
    border-color: var(--cx-color-primary-500);
    transform: translateX(calc((var(--width) - var(--height)) / 2));
  }

  @supports (translate: 0px) {
    .switch--checked .switch__control .switch__thumb {
      translate: calc((var(--width) - var(--height)) / 2);
      transform: none;
    }
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
  }

  .switch.switch--checked:not(.switch--disabled)
    .switch__control:hover
    .switch__thumb {
    background-color: var(--thumb-color);
    border-color: var(--cx-color-primary-500);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled)
    .switch__input:focus-visible
    ~ .switch__control {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Disabled */
  .switch--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .switch__label {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .switch__label::after {
    color: var(--cx-input-required-content-color);
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }

  @media (forced-colors: active) {
    .switch.switch--checked:not(.switch--disabled)
      .switch__control:hover
      .switch__thumb,
    .switch--checked .switch__control .switch__thumb {
      background-color: ButtonText;
    }
  }

  .switch__icon {
    user-select: none;
    font-size: var(--cx-input-font-size-large);
  }

  .switch:not(.switch--checked) .switch__icon {
    color: var(--control-color);
  }

  .switch.switch--checked .switch__icon {
    color: var(--cx-color-primary-500);
  }

  :host([size='small']) .switch__icon {
    font-size: var(--cx-font-size-x-small);
  }

  :host([size='medium']) .switch__icon {
    font-size: var(--cx-font-size-small);
  }

  :host([size='large']) .switch__icon {
    font-size: var(--cx-font-size-medium);
  }
`;
var $ = Object.defineProperty, F = Object.getOwnPropertyDescriptor, o = (t, i, l, s) => {
  for (var c = s > 1 ? void 0 : s ? F(i, l) : i, a = t.length - 1, h; a >= 0; a--)
    (h = t[a]) && (c = (s ? h(i, l, c) : h(c)) || c);
  return s && c && $(i, l, c), c;
};
let e = class extends p {
  constructor() {
    super(...arguments), this.formControlController = new b(this, {
      // eslint-disable-next-line
      // @ts-ignore
      defaultValue: (t) => t.defaultChecked,
      // eslint-disable-next-line
      // @ts-ignore
      setValue: (t, i) => t.checked = i,
      // eslint-disable-next-line
      // @ts-ignore
      value: (t) => t.checked ? t.value || "on" : void 0
    }), this.hasSlotController = new x(this, "help-text"), this.hasFocus = !1, this.title = "", this.name = "", this.size = "medium", this.disabled = !1, this.checked = !1, this.defaultChecked = !1, this.form = "", this.required = !1, this.showIcon = !1, this.helpText = "";
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleInput() {
    this.emit("cx-input");
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  handleClick() {
    this.checked = !this.checked, this.emit("cx-change");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleKeyDown(t) {
    t.key === "ArrowLeft" && (t.preventDefault(), this.checked = !1, this.emit("cx-change"), this.emit("cx-input")), t.key === "ArrowRight" && (t.preventDefault(), this.checked = !0, this.emit("cx-change"), this.emit("cx-input"));
  }
  handleCheckedChange() {
    this.input.checked = this.checked, this.formControlController.updateValidity();
  }
  handleDisabledChange() {
    this.formControlController.setValidity(!0);
  }
  /** Simulates a click on the switch. */
  click() {
    this.input.click();
  }
  /** Sets focus on the switch. */
  focus(t) {
    this.input.focus(t);
  }
  /** Removes focus from the switch. */
  blur() {
    this.input.blur();
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(t) {
    this.input.setCustomValidity(t), this.formControlController.updateValidity();
  }
  render() {
    const t = this.hasSlotController.test("help-text"), i = this.helpText ? !0 : !!t;
    return n`
      <div
        class=${d({
      "form-control": !0,
      "form-control--has-help-text": i,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <label
          part="base"
          class=${d({
      switch: !0,
      "switch--checked": this.checked,
      "switch--disabled": this.disabled,
      "switch--focused": this.hasFocus,
      "switch--large": this.size === "large",
      "switch--medium": this.size === "medium",
      "switch--small": this.size === "small"
    })}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${y(this.value)}
            .checked=${C(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            role="switch"
            aria-checked=${this.checked ? "true" : "false"}
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          />
          <span part="control" class="switch__control">
            <span part="thumb" class="switch__thumb">
              ${this.showIcon ? this.checked ? n`<cx-icon
                      part="checked-icon"
                      class="switch__icon"
                      name="check"
                    ></cx-icon>` : n`<cx-icon
                      part="unchecked-icon"
                      class="switch__icon"
                      name="close"
                    ></cx-icon>` : ""}
            </span>
          </span>

          <div part="label" class="switch__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${i ? "false" : "true"}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
e.styles = [f, v, z];
o([
  k('input[type="checkbox"]')
], e.prototype, "input", 2);
o([
  g()
], e.prototype, "hasFocus", 2);
o([
  r()
], e.prototype, "title", 2);
o([
  r()
], e.prototype, "name", 2);
o([
  r()
], e.prototype, "value", 2);
o([
  r({ reflect: !0 })
], e.prototype, "size", 2);
o([
  r({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
o([
  r({ reflect: !0, type: Boolean })
], e.prototype, "checked", 2);
o([
  w("checked")
], e.prototype, "defaultChecked", 2);
o([
  r({ reflect: !0 })
], e.prototype, "form", 2);
o([
  r({ reflect: !0, type: Boolean })
], e.prototype, "required", 2);
o([
  r({ attribute: "show-icon", reflect: !0, type: Boolean })
], e.prototype, "showIcon", 2);
o([
  r({ attribute: "help-text" })
], e.prototype, "helpText", 2);
o([
  u("checked", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleCheckedChange", 1);
o([
  u("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
e = o([
  m("cx-switch")
], e);
export {
  e as default
};
