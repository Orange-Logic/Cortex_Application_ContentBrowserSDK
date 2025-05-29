import { C as g } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as v } from "../chunks/component.styles.BLcT4bOa.js";
import { f as b } from "../chunks/form-control.styles.vYJVd0IP.js";
import { F as x, c as C, a as R, v as V } from "../chunks/form.CBFaCEBn.js";
import { H as w } from "../chunks/slot.DJLm4Dig.js";
import { w as f } from "../chunks/watch.ChG-_stu.js";
import { x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as c } from "../chunks/state.-o_YRGMi.js";
import { e as y } from "../chunks/query.BNveAlQo.js";
import { e as m } from "../chunks/class-map.Cn0czwWq.js";
import { o as E } from "../chunks/style-map.De8UQbPP.js";
import k from "./button-group.component.js";
import A from "./radio-group.styles.js";
var M = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, r = (p, t, e, s) => {
  for (var o = s > 1 ? void 0 : s ? _(t, e) : t, l = p.length - 1, a; l >= 0; l--)
    (a = p[l]) && (o = (s ? a(t, e, o) : a(o)) || o);
  return s && o && M(t, e, o), o;
};
const u = class u extends g {
  constructor() {
    super(...arguments), this.formControlController = new x(this), this.hasSlotController = new w(
      this,
      "help-text",
      "label"
    ), this.customValidityMessage = "", this.hasButtonGroup = !1, this.errorMessage = "", this.defaultValue = "", this.label = "", this.helpText = "", this.name = "option", this.value = "", this.size = "medium", this.form = "", this.required = !1, this.horizontal = !1, this.itemsPerRow = 0;
  }
  /** Gets the validity state object */
  get validity() {
    const t = this.required && !this.value;
    return this.customValidityMessage !== "" ? C : t ? R : V;
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
    const e = t.target.closest("cx-radio, cx-radio-button, cx-radio-card"), s = this.getAllRadios(), o = this.value;
    !e || e.disabled || (this.value = e.value, s.forEach((l) => l.checked = l === e), this.value !== o && (this.emit("cx-change"), this.emit("cx-input")));
  }
  handleKeyDown(t) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
      t.key
    ))
      return;
    const e = this.getAllRadios().filter((d) => !d.disabled), s = e.find((d) => d.checked) ?? e[0], o = t.key === " " ? 0 : ["ArrowUp", "ArrowLeft"].includes(t.key) ? -1 : 1, l = this.value;
    let a = e.indexOf(s) + o;
    a < 0 && (a = e.length - 1), a > e.length - 1 && (a = 0), this.getAllRadios().forEach((d) => {
      d.checked = !1, this.hasButtonGroup || d.setAttribute("tabindex", "-1");
    }), this.value = e[a].value, e[a].checked = !0, this.hasButtonGroup ? e[a].shadowRoot.querySelector("button").focus() : (e[a].setAttribute("tabindex", "0"), e[a].focus()), this.value !== l && (this.emit("cx-change"), this.emit("cx-input")), t.preventDefault();
  }
  handleLabelClick() {
    const t = this.getAllRadios(), s = t.find((o) => o.checked) || t[0];
    s && s.focus();
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  async syncRadioElements() {
    var e, s;
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
      const o = (s = this.shadowRoot) == null ? void 0 : s.querySelector("cx-button-group");
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
    const t = this.hasSlotController.test("label"), e = this.hasSlotController.test("help-text"), s = this.label ? !0 : !!t, o = this.helpText ? !0 : !!e, l = h`
      <slot
        @slotchange=${this.syncRadios}
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
      ></slot>
    `;
    return h`
      <fieldset
        part="form-control"
        class=${m({
      "form-control": !0,
      "form-control--has-help-text": o,
      "form-control--has-label": s,
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
          aria-hidden=${s ? "false" : "true"}
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

          ${this.hasButtonGroup ? h`
                <cx-button-group
                  part="button-group"
                  exportparts="base:button-group__base"
                  role="presentation"
                >
                  ${l}
                </cx-button-group>
              ` : this.horizontal ? h`
                <div
                  role="radiogroup"
                  class=${m({
      "radio-group__horizontal": !0,
      "radio-group__horizontal--filled": this.itemsPerRow < 1
    })}
                  style=${E({
      "--radio-group-columns": this.itemsPerRow
    })}
                >
                  ${l}
                </div>
              ` : l}
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
u.styles = [v, b, A], u.dependencies = { "cx-button-group": k };
let i = u;
r([
  y("slot:not([name])")
], i.prototype, "defaultSlot", 2);
r([
  y(".radio-group__validation-input")
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
  n()
], i.prototype, "label", 2);
r([
  n({ attribute: "help-text" })
], i.prototype, "helpText", 2);
r([
  n()
], i.prototype, "name", 2);
r([
  n({ reflect: !0 })
], i.prototype, "value", 2);
r([
  n({ reflect: !0 })
], i.prototype, "size", 2);
r([
  n({ reflect: !0 })
], i.prototype, "form", 2);
r([
  n({ reflect: !0, type: Boolean })
], i.prototype, "required", 2);
r([
  n({ type: Boolean })
], i.prototype, "horizontal", 2);
r([
  n({ attribute: "items-per-row", type: Number })
], i.prototype, "itemsPerRow", 2);
r([
  f("size", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleSizeChange", 1);
r([
  f("value")
], i.prototype, "handleValueChange", 1);
export {
  i as default
};
