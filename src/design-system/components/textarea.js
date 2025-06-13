import { C as u, c as x } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { f } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as b } from "../chunks/default-value.BaUjiOTd.js";
import { F as v } from "../chunks/form.CBFaCEBn.js";
import { H as g } from "../chunks/slot.DJLm4Dig.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { i as y, x as _ } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as z } from "../chunks/state.-o_YRGMi.js";
import { e as C } from "../chunks/query.BNveAlQo.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
import { o as s } from "../chunks/if-defined.D8U9hdvp.js";
import { l as w } from "../chunks/live.C0NiCo2U.js";
const k = y`
  :host {
    display: block;
  }

  :host([data-user-invalid])::part(base) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid]:focus-within)::part(base) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  .textarea {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-input-letter-spacing);
    vertical-align: middle;
    transition:
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) border,
      var(--cx-transition-fast) box-shadow,
      var(--cx-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--cx-input-background-color);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--cx-input-background-color-hover);
    border-color: var(--cx-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--cx-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--cx-input-background-color-focus);
    border-color: var(--cx-input-border-color-focus);
    color: var(--cx-input-color-focus);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled)
    .textarea__control {
    color: var(--cx-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--cx-input-background-color-disabled);
    border-color: var(--cx-input-border-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--cx-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--cx-input-placeholder-color-disabled);
  }

  /* Filled textareas */
  .textarea--filled {
    border: none;
    background-color: var(--cx-input-filled-background-color);
    color: var(--cx-input-color);
  }

  .textarea--filled:hover:not(.textarea--disabled) {
    background-color: var(--cx-input-filled-background-color-hover);
  }

  .textarea--filled.textarea--focused:not(.textarea--disabled) {
    background-color: var(--cx-input-filled-background-color-focus);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .textarea--filled.textarea--disabled {
    background-color: var(--cx-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .textarea__control {
    flex: 1 1 auto;
    font: inherit;
    line-height: 1.4;
    color: var(--cx-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
    line-height: var(--cx-line-height-medium);
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-x-small);
    padding-left: 0;
    padding-right: 0;
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--cx-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Size modifiers
   */

  .textarea--small {
    border-radius: var(--cx-input-border-radius-small);
    font-size: var(--cx-input-font-size-small);
  }

  .textarea--small .textarea-container {
    padding-left: var(--cx-input-spacing-small);
    padding-right: var(--cx-input-spacing-small);
  }

  .textarea--medium {
    border-radius: var(--cx-input-border-radius-medium);
    font-size: var(--cx-input-font-size-medium);
  }

  .textarea--medium .textarea-container {
    padding-left: var(--cx-input-spacing-medium);
    padding-right: var(--cx-input-spacing-medium);
  }

  .textarea--large {
    border-radius: var(--cx-input-border-radius-large);
    font-size: var(--cx-input-font-size-large);
  }

  .textarea--large .textarea-container {
    padding-left: var(--cx-input-spacing-large);
    padding-right: var(--cx-input-spacing-large);
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }

  /*
   * Adapt label to be inside textarea
   */

  .textarea-container {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  /* set label's position to absolute */
  .form-control__label {
    position: relative;
    -webkit-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;
    pointer-events: none;
    width: fit-content;
    line-height: 1; /* use line-height: 1 for easier transform calculation */
  }

  .form-control--has-label .textarea--small .form-control__label {
    font-size: var(--cx-input-font-size-small);
    margin: 0;
  }

  .form-control--has-label .textarea--medium .form-control__label {
    font-size: var(--cx-input-font-size-medium);
    margin: 0;
  }

  .form-control--has-label .textarea--large .form-control__label {
    font-size: var(--cx-input-font-size-large);
    margin: 0;
  }

  /* when empty with no placeholder (initial state), transform label to vertical center
    = (input height - label height) / 2
  */
  .textarea--small .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-small) +
              1.25rem - var(--cx-input-font-size-small)
          ) /
          2
      )
    );
  }

  .textarea--medium .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-medium) +
              1rem - var(--cx-input-font-size-medium)
          ) /
          2
      )
    );
  }

  .textarea--large .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-large) +
              1rem - var(--cx-input-font-size-large)
          ) /
          2
      )
    );
  }

  /* When focused or not empty, transform label to top
    Instead of 0, use var(--cx-spacing-2x-small) to have a distance from top
  */
  .form-control--has-label .textarea--focused .form-control__label,
  .form-control--has-label .textarea--placeholder-visible .form-control__label,
  .form-control--has-label
    .textarea:not(.textarea--empty)
    .form-control__label {
    transform: translateY(
      calc(var(--cx-spacing-2x-small) + var(--cx-spacing-3x-small))
    ); /* distance from top */
  }
`;
var $ = Object.defineProperty, T = Object.getOwnPropertyDescriptor, e = (r, i, l, n) => {
  for (var o = n > 1 ? void 0 : n ? T(i, l) : i, c = r.length - 1, d; c >= 0; c--)
    (d = r[c]) && (o = (n ? d(i, l, o) : d(o)) || o);
  return n && o && $(i, l, o), o;
};
let t = class extends u {
  constructor() {
    super(...arguments), this.formControlController = new v(this, {
      assumeInteractionOn: ["cx-blur", "cx-input"]
    }), this.hasSlotController = new g(
      this,
      "help-text",
      "label"
    ), this.hasFocus = !1, this.title = "", this.name = "", this.value = "", this.size = "medium", this.filled = !1, this.label = "", this.helpText = "", this.placeholder = "", this.rows = 4, this.resize = "vertical", this.disabled = !1, this.readonly = !1, this.form = "", this.required = !1, this.spellcheck = !0, this.defaultValue = "";
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight()), this.updateComplete.then(() => {
      this.setTextareaHeight(), this.resizeObserver.observe(this.input);
    });
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  disconnectedCallback() {
    var r;
    super.disconnectedCallback(), this.input && ((r = this.resizeObserver) == null || r.unobserve(this.input));
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleChange() {
    this.value = this.input.value, this.setTextareaHeight(), this.emit("cx-change");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleInput() {
    this.value = this.input.value, this.emit("cx-input");
  }
  handleInvalid(r) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(r);
  }
  setTextareaHeight() {
    this.resize === "auto" ? (this.input.style.height = "auto", this.input.style.height = `${this.input.scrollHeight}px`) : this.input.style.height = void 0;
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleRowsChange() {
    this.setTextareaHeight();
  }
  async handleValueChange() {
    await this.updateComplete, this.formControlController.updateValidity(), this.setTextareaHeight();
  }
  /** Sets focus on the textarea. */
  focus(r) {
    this.input.focus(r);
  }
  /** Removes focus from the textarea. */
  blur() {
    this.input.blur();
  }
  /** Selects all the text in the textarea. */
  select() {
    this.input.select();
  }
  /** Gets or sets the textarea's scroll position. */
  scrollPosition(r) {
    if (r) {
      typeof r.top == "number" && (this.input.scrollTop = r.top), typeof r.left == "number" && (this.input.scrollLeft = r.left);
      return;
    }
    return {
      left: this.input.scrollTop,
      top: this.input.scrollTop
    };
  }
  /** Sets the start and end positions of the text selection (0-based). */
  setSelectionRange(r, i, l = "none") {
    this.input.setSelectionRange(
      r,
      i,
      l
    );
  }
  /** Replaces a range of text with a new string. */
  setRangeText(r, i, l, n = "preserve") {
    const o = i ?? this.input.selectionStart, c = l ?? this.input.selectionEnd;
    this.input.setRangeText(
      r,
      o,
      c,
      n
    ), this.value !== this.input.value && (this.value = this.input.value, this.setTextareaHeight());
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
  setCustomValidity(r) {
    this.input.setCustomValidity(r), this.formControlController.updateValidity();
  }
  render() {
    const r = this.hasSlotController.test("label"), i = this.hasSlotController.test("help-text"), l = this.label ? !0 : !!r, n = this.helpText ? !0 : !!i, o = this.placeholder && this.value.length === 0;
    return _`
      <div
        part="form-control"
        class=${p({
      "form-control": !0,
      "form-control--has-help-text": n,
      "form-control--has-label": l,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${p({
      textarea: !0,
      "textarea--disabled": this.disabled,
      "textarea--empty": !this.value,
      "textarea--filled": this.filled,
      "textarea--focused": this.hasFocus,
      "textarea--large": this.size === "large",
      "textarea--medium": this.size === "medium",
      "textarea--placeholder-visible": o,
      "textarea--resize-auto": this.resize === "auto",
      "textarea--resize-none": this.resize === "none",
      "textarea--resize-vertical": this.resize === "vertical",
      "textarea--small": this.size === "small",
      "textarea--standard": !this.filled
    })}
          >
            <span class="textarea-container">
              <label
                part="form-control-label"
                class="form-control__label"
                for="input"
                aria-hidden=${l ? "false" : "true"}
              >
                <slot name="label">${this.label}</slot>
              </label>
              <textarea
                part="textarea"
                id="input"
                class="textarea__control"
                title=${this.title}
                name=${s(this.name)}
                .value=${w(this.value)}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                placeholder=${s(this.placeholder)}
                rows=${s(this.rows)}
                minlength=${s(this.minlength)}
                maxlength=${s(this.maxlength)}
                autocapitalize=${s(this.autocapitalize)}
                autocorrect=${s(this.autocorrect)}
                ?autofocus=${this.autofocus}
                spellcheck=${s(this.spellcheck)}
                enterkeyhint=${s(this.enterkeyhint)}
                inputmode=${s(this.inputmode)}
                aria-describedby="help-text"
                @change=${this.handleChange}
                @input=${this.handleInput}
                @invalid=${this.handleInvalid}
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
              ></textarea>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${n ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
t.styles = [m, f, k];
e([
  C(".textarea__control")
], t.prototype, "input", 2);
e([
  z()
], t.prototype, "hasFocus", 2);
e([
  a()
], t.prototype, "title", 2);
e([
  a()
], t.prototype, "name", 2);
e([
  a()
], t.prototype, "value", 2);
e([
  a({ reflect: !0 })
], t.prototype, "size", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "filled", 2);
e([
  a()
], t.prototype, "label", 2);
e([
  a({ attribute: "help-text" })
], t.prototype, "helpText", 2);
e([
  a()
], t.prototype, "placeholder", 2);
e([
  a({ type: Number })
], t.prototype, "rows", 2);
e([
  a()
], t.prototype, "resize", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "readonly", 2);
e([
  a({ reflect: !0 })
], t.prototype, "form", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "required", 2);
e([
  a({ type: Number })
], t.prototype, "minlength", 2);
e([
  a({ type: Number })
], t.prototype, "maxlength", 2);
e([
  a()
], t.prototype, "autocapitalize", 2);
e([
  a()
], t.prototype, "autocorrect", 2);
e([
  a()
], t.prototype, "autocomplete", 2);
e([
  a({ type: Boolean })
], t.prototype, "autofocus", 2);
e([
  a()
], t.prototype, "enterkeyhint", 2);
e([
  a({
    converter: {
      // Allow "true|false" attribute values but keep the property boolean
      fromAttribute: (r) => !(!r || r === "false"),
      toAttribute: (r) => r ? "true" : "false"
    },
    type: Boolean
  })
], t.prototype, "spellcheck", 2);
e([
  a()
], t.prototype, "inputmode", 2);
e([
  b()
], t.prototype, "defaultValue", 2);
e([
  h("disabled", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleDisabledChange", 1);
e([
  h("rows", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleRowsChange", 1);
e([
  h("value", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleValueChange", 1);
t = e([
  x("cx-textarea")
], t);
export {
  t as default
};
