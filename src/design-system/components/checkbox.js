import { C as x, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { f } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as k } from "../chunks/default-value.BaUjiOTd.js";
import { F as v } from "../chunks/form.CBFaCEBn.js";
import { H as g } from "../chunks/slot.DJLm4Dig.js";
import { w as p } from "../chunks/watch.ChG-_stu.js";
import { i as y, x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { r as _ } from "../chunks/state.-o_YRGMi.js";
import { e as C } from "../chunks/query.BNveAlQo.js";
import { e as d } from "../chunks/class-map.Cn0czwWq.js";
import { o as z } from "../chunks/if-defined.D8U9hdvp.js";
import { l as u } from "../chunks/live.C0NiCo2U.js";
import $ from "./icon.js";
const w = y`
  :host {
    display: inline-block;
  }

  :host([data-user-invalid])::part(control) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid])::part(label) {
    color: var(--cx-input-invalid-color);
  }

  :host([data-user-invalid])::part(control) {
    outline: none;
  }

  :host(:focus-within[data-user-invalid])::part(control) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    color: var(--cx-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--cx-toggle-size-small);
    font-size: var(--cx-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--cx-toggle-size-medium);
    font-size: var(--cx-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--cx-toggle-size-large);
    font-size: var(--cx-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
    border-radius: var(--cx-border-radius-small);
    background-color: var(--cx-input-background-color);
    color: var(--cx-color-neutral-0);
    transition:
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) background-color,
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled)
    .checkbox__control:hover {
    border-color: var(--cx-input-border-color-hover);
    background-color: var(--cx-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled)
    .checkbox__input:focus-visible
    ~ .checkbox__control {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--cx-color-primary-600);
    background-color: var(--cx-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled)
    .checkbox__control:hover {
    border-color: var(--cx-color-primary-500);
    background-color: var(--cx-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled)
    .checkbox__input:focus-visible
    ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled)
    .checkbox__input:focus-visible
    ~ .checkbox__control {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--cx-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
    text-transform: var(--cx-checkbox-label-text-transform, none);
  }

  :host([required]) .checkbox__label::after {
    color: var(--cx-input-required-content-color);
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }
`;
var F = Object.defineProperty, V = Object.getOwnPropertyDescriptor, o = (t, r, a, l) => {
  for (var c = l > 1 ? void 0 : l ? V(r, a) : r, n = t.length - 1, s; n >= 0; n--)
    (s = t[n]) && (c = (l ? s(r, a, c) : s(c)) || c);
  return l && c && F(r, a, c), c;
};
let e = class extends x {
  constructor() {
    super(...arguments), this.formControlController = new v(this, {
      // eslint-disable-next-line
      // @ts-ignore
      defaultValue: (t) => t.defaultChecked,
      // eslint-disable-next-line
      // @ts-ignore
      setValue: (t, r) => t.checked = r,
      // eslint-disable-next-line
      // @ts-ignore
      value: (t) => t.checked ? t.value || "on" : void 0
    }), this.hasSlotController = new g(this, "help-text"), this.hasFocus = !1, this.title = "", this.name = "", this.size = "medium", this.disabled = !1, this.checked = !1, this.indeterminate = !1, this.defaultChecked = !1, this.form = "", this.required = !1, this.helpText = "";
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
  handleClick() {
    this.checked = !this.checked, this.indeterminate = !1, this.emit("cx-change");
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
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStateChange() {
    this.input.checked = this.checked, this.input.indeterminate = this.indeterminate, this.formControlController.updateValidity();
  }
  /** Simulates a click on the checkbox. */
  click() {
    this.input.click();
  }
  /** Sets focus on the checkbox. */
  focus(t) {
    this.input.focus(t);
  }
  /** Removes focus from the checkbox. */
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
  /**
   * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
   * the custom validation message, call this method with an empty string.
   */
  setCustomValidity(t) {
    this.input.setCustomValidity(t), this.formControlController.updateValidity();
  }
  render() {
    const t = this.hasSlotController.test("help-text"), r = this.helpText ? !0 : !!t;
    return h`
      <div
        class=${d({
      "form-control": !0,
      "form-control--has-help-text": r,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <label
          part="base"
          class=${d({
      checkbox: !0,
      "checkbox--checked": this.checked,
      "checkbox--disabled": this.disabled,
      "checkbox--focused": this.hasFocus,
      "checkbox--indeterminate": this.indeterminate,
      "checkbox--large": this.size === "large",
      "checkbox--medium": this.size === "medium",
      "checkbox--small": this.size === "small"
    })}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${z(this.value)}
            .indeterminate=${u(this.indeterminate)}
            .checked=${u(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            aria-checked=${this.checked ? "true" : "false"}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
          />

          <span
            part="control${this.checked ? " control--checked" : ""}${this.indeterminate ? " control--indeterminate" : ""}"
            class="checkbox__control"
          >
            ${this.checked ? h`
                  <cx-icon
                    part="checked-icon"
                    class="checkbox__checked-icon"
                    name="check"
                  ></cx-icon>
                ` : ""}
            ${!this.checked && this.indeterminate ? h`
                  <cx-icon
                    part="indeterminate-icon"
                    class="checkbox__indeterminate-icon"
                    name="remove"
                  ></cx-icon>
                ` : ""}
          </span>

          <div part="label" class="checkbox__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${r ? "false" : "true"}
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
e.styles = [b, f, w];
e.dependencies = { "cx-icon": $ };
o([
  C('input[type="checkbox"]')
], e.prototype, "input", 2);
o([
  _()
], e.prototype, "hasFocus", 2);
o([
  i()
], e.prototype, "title", 2);
o([
  i()
], e.prototype, "name", 2);
o([
  i()
], e.prototype, "value", 2);
o([
  i({ reflect: !0 })
], e.prototype, "size", 2);
o([
  i({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
o([
  i({ reflect: !0, type: Boolean })
], e.prototype, "checked", 2);
o([
  i({ reflect: !0, type: Boolean })
], e.prototype, "indeterminate", 2);
o([
  k("checked")
], e.prototype, "defaultChecked", 2);
o([
  i({ reflect: !0 })
], e.prototype, "form", 2);
o([
  i({ reflect: !0, type: Boolean })
], e.prototype, "required", 2);
o([
  i({ attribute: "help-text" })
], e.prototype, "helpText", 2);
o([
  p("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
o([
  p(["checked", "indeterminate"], { waitUntilFirstUpdate: !0 })
], e.prototype, "handleStateChange", 1);
e = o([
  m("cx-checkbox")
], e);
export {
  e as default
};
