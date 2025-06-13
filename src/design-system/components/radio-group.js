import { C as f, c as g } from "../chunks/custom-element.X6y1saJZ.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { f as v } from "../chunks/form-control.styles.vYJVd0IP.js";
import { F as x, c as b, a as C, v as w } from "../chunks/form.CBFaCEBn.js";
import { H as R } from "../chunks/slot.DJLm4Dig.js";
import { w as p } from "../chunks/watch.ChG-_stu.js";
import { i as V, x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n as d } from "../chunks/property.CtZ87in4.js";
import { r as c } from "../chunks/state.-o_YRGMi.js";
import { e as m } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { o as E } from "../chunks/style-map.De8UQbPP.js";
import k from "./button-group.js";
const _ = V`
  :host {
    display: block;
    --radio-group-gap: var(--cx-spacing-x-small);
  }

  .form-control {
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-control__label {
    padding: 0;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--radio-group-gap);
  }

  .radio-group--compact {
    gap: 0;
  }

  .radio-group--horizontal {
    align-items: stretch;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .radio-group--horizontal slot::slotted(cx-radio-card) {
    flex-basis: calc(
      100% / var(--radio-group-columns) - var(--radio-group-gap) /
        var(--radio-group-columns) * (var(--radio-group-columns) - 1)
    );
  }

  .radio-group--horizontal.radio-group--filled slot::slotted(cx-radio-card) {
    flex-basis: auto;
  }

  .radio-group--required .radio-group__label::after {
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
var A = Object.defineProperty, M = Object.getOwnPropertyDescriptor, r = (t, e, a, o) => {
  for (var s = o > 1 ? void 0 : o ? M(e, a) : e, l = t.length - 1, n; l >= 0; l--)
    (n = t[l]) && (s = (o ? n(e, a, s) : n(s)) || s);
  return o && s && A(e, a, s), s;
};
let i = class extends f {
  constructor() {
    super(...arguments), this.formControlController = new x(this), this.hasSlotController = new R(
      this,
      "help-text",
      "label"
    ), this.customValidityMessage = "", this.hasButtonGroup = !1, this.errorMessage = "", this.defaultValue = "", this.label = "", this.helpText = "", this.name = "option", this.value = "", this.size = "medium", this.form = "", this.required = !1, this.horizontal = !1, this.compact = !1, this.itemsPerRow = 0;
  }
  /** Gets the validity state object */
  get validity() {
    const t = this.required && !this.value;
    return this.customValidityMessage !== "" ? b : t ? C : w;
  }
  /** Gets the validation message */
  get validationMessage() {
    const t = this.required && !this.value;
    return this.customValidityMessage !== "" ? this.customValidityMessage : t ? this.validationInput.validationMessage : "";
  }
  connectedCallback() {
    super.connectedCallback(), this.defaultValue = this.value;
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  getAllRadios() {
    return [
      ...this.querySelectorAll(
        "cx-radio, cx-radio-button, cx-radio-card"
      )
    ];
  }
  handleRadioClick(t) {
    const e = t.target.closest("cx-radio, cx-radio-button, cx-radio-card"), a = this.getAllRadios(), o = this.value;
    !e || e.disabled || (this.value = e.value, a.forEach((s) => s.checked = s === e), this.value !== o && (this.emit("cx-change"), this.emit("cx-input")));
  }
  handleKeyDown(t) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
      t.key
    ))
      return;
    const e = this.getAllRadios().filter((n) => !n.disabled), a = e.find((n) => n.checked) ?? e[0], o = t.key === " " ? 0 : ["ArrowUp", "ArrowLeft"].includes(t.key) ? -1 : 1, s = this.value;
    let l = e.indexOf(a) + o;
    l < 0 && (l = e.length - 1), l > e.length - 1 && (l = 0), this.getAllRadios().forEach((n) => {
      n.checked = !1, this.hasButtonGroup || n.setAttribute("tabindex", "-1");
    }), this.value = e[l].value, e[l].checked = !0, this.hasButtonGroup ? e[l].shadowRoot.querySelector("button").focus() : (e[l].setAttribute("tabindex", "0"), e[l].focus()), this.value !== s && (this.emit("cx-change"), this.emit("cx-input")), t.preventDefault();
  }
  handleLabelClick() {
    const t = this.getAllRadios(), a = t.find((o) => o.checked) || t[0];
    a && a.focus();
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  async syncRadioElements() {
    var e, a;
    const t = this.getAllRadios();
    if (await Promise.all(
      // Sync the checked state and size
      t.map(async (o) => {
        await o.updateComplete, o.checked = o.value === this.value, o.tagName.toLowerCase() !== "cx-radio-card" && (o.size = this.size);
      })
    ), this.hasButtonGroup = t.some(
      (o) => o.tagName.toLowerCase() === "cx-radio-button"
    ), t.length > 0 && !t.some((o) => o.checked))
      if (this.hasButtonGroup) {
        const o = (e = t[0].shadowRoot) == null ? void 0 : e.querySelector("button");
        o && o.setAttribute("tabindex", "0");
      } else
        t[0].setAttribute("tabindex", "0");
    if (this.hasButtonGroup) {
      const o = (a = this.shadowRoot) == null ? void 0 : a.querySelector("cx-button-group");
      o && (o.disableRole = !0);
    }
  }
  syncRadios() {
    if (customElements.get("cx-radio") && customElements.get("cx-radio-button") && customElements.get("cx-radio-card")) {
      this.syncRadioElements();
      return;
    }
    customElements.get("cx-radio") ? this.syncRadioElements() : customElements.whenDefined("cx-radio").then(() => this.syncRadios()), customElements.get("cx-radio-button") ? this.syncRadioElements() : customElements.whenDefined("cx-radio-button").then(() => this.syncRadios()), customElements.get("cx-radio-card") ? this.syncRadioElements() : customElements.whenDefined("cx-radio-card").then(() => this.syncRadios());
  }
  updateCheckedRadio() {
    this.getAllRadios().forEach((e) => e.checked = e.value === this.value), this.formControlController.setValidity(this.validity.valid);
  }
  handleSizeChange() {
    this.syncRadios();
  }
  handleValueChange() {
    this.hasUpdated && this.updateCheckedRadio();
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    const t = this.required && !this.value, e = this.customValidityMessage !== "";
    return t || e ? (this.formControlController.emitInvalidEvent(), !1) : !0;
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    const t = this.validity.valid;
    return this.errorMessage = this.customValidityMessage || t ? "" : this.validationInput.validationMessage, this.formControlController.setValidity(t), this.validationInput.hidden = !0, clearTimeout(this.validationTimeout), t || (this.validationInput.hidden = !1, this.validationInput.reportValidity(), this.validationTimeout = setTimeout(
      () => this.validationInput.hidden = !0,
      1e4
    )), t;
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(t = "") {
    this.customValidityMessage = t, this.errorMessage = t, this.validationInput.setCustomValidity(t), this.formControlController.updateValidity();
  }
  render() {
    const t = this.hasSlotController.test("label"), e = this.hasSlotController.test("help-text"), a = this.label ? !0 : !!t, o = this.helpText ? !0 : !!e, s = u`
      <slot
        @slotchange=${this.syncRadios}
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
      ></slot>
    `;
    return u`
      <fieldset
        part="form-control"
        class=${h({
      "form-control": !0,
      "form-control--has-help-text": o,
      "form-control--has-label": a,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--radio-group": !0,
      "form-control--small": this.size === "small"
    })}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="help-text"
        aria-errormessage="error-message"
      >
        <label
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${a ? "false" : "true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div class="visually-hidden">
            <div id="error-message" aria-live="assertive">
              ${this.errorMessage}
            </div>
            <label class="radio-group__validation">
              <input
                type="text"
                class="radio-group__validation-input"
                ?required=${this.required}
                tabindex="-1"
                hidden
                @invalid=${this.handleInvalid}
              />
            </label>
          </div>

          ${this.hasButtonGroup ? u`
                <cx-button-group
                  part="button-group"
                  exportparts="base:button-group__base"
                  role="presentation"
                >
                  ${s}
                </cx-button-group>
              ` : u`
              <div
                role="radiogroup"
                class=${h({
      "radio-group": !0,
      "radio-group--compact": this.compact,
      "radio-group--filled": this.itemsPerRow < 1,
      "radio-group--horizontal": this.horizontal
    })}
                style=${E({
      "--radio-group-columns": this.itemsPerRow
    })}
              >
                ${s}
              </div>
            `}
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${o ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </fieldset>
    `;
  }
};
i.styles = [y, v, _];
i.dependencies = { "cx-button-group": k };
r([
  m("slot:not([name])")
], i.prototype, "defaultSlot", 2);
r([
  m(".radio-group__validation-input")
], i.prototype, "validationInput", 2);
r([
  c()
], i.prototype, "hasButtonGroup", 2);
r([
  c()
], i.prototype, "errorMessage", 2);
r([
  c()
], i.prototype, "defaultValue", 2);
r([
  d()
], i.prototype, "label", 2);
r([
  d({ attribute: "help-text" })
], i.prototype, "helpText", 2);
r([
  d()
], i.prototype, "name", 2);
r([
  d({ reflect: !0 })
], i.prototype, "value", 2);
r([
  d({ reflect: !0 })
], i.prototype, "size", 2);
r([
  d({ reflect: !0 })
], i.prototype, "form", 2);
r([
  d({ reflect: !0, type: Boolean })
], i.prototype, "required", 2);
r([
  d({ type: Boolean })
], i.prototype, "horizontal", 2);
r([
  d({ reflect: !0, type: Boolean })
], i.prototype, "compact", 2);
r([
  d({ attribute: "items-per-row", type: Number })
], i.prototype, "itemsPerRow", 2);
r([
  p("size", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleSizeChange", 1);
r([
  p("value")
], i.prototype, "handleValueChange", 1);
i = r([
  g("cx-radio-group")
], i);
export {
  i as default
};
