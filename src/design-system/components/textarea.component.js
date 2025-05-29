import { C as m } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { f as y } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as b } from "../chunks/default-value.BaUjiOTd.js";
import { F as x } from "../chunks/form.CBFaCEBn.js";
import { H as v } from "../chunks/slot.DJLm4Dig.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { r as C } from "../chunks/state.-o_YRGMi.js";
import { e as $ } from "../chunks/query.BNveAlQo.js";
import { e as d } from "../chunks/class-map.Cn0czwWq.js";
import { o } from "../chunks/if-defined.D8U9hdvp.js";
import { l as z } from "../chunks/live.C0NiCo2U.js";
import w from "./textarea.styles.js";
var V = Object.defineProperty, T = Object.getOwnPropertyDescriptor, e = (h, i, a, s) => {
  for (var l = s > 1 ? void 0 : s ? T(i, a) : i, n = h.length - 1, p; n >= 0; n--)
    (p = h[n]) && (l = (s ? p(i, a, l) : p(l)) || l);
  return s && l && V(i, a, l), l;
};
const c = class c extends m {
  constructor() {
    super(...arguments), this.formControlController = new x(this, {
      assumeInteractionOn: ["cx-blur", "cx-input"]
    }), this.hasSlotController = new v(
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
    var i;
    super.disconnectedCallback(), this.input && ((i = this.resizeObserver) == null || i.unobserve(this.input));
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
  handleInvalid(i) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(i);
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
  focus(i) {
    this.input.focus(i);
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
  scrollPosition(i) {
    if (i) {
      typeof i.top == "number" && (this.input.scrollTop = i.top), typeof i.left == "number" && (this.input.scrollLeft = i.left);
      return;
    }
    return {
      left: this.input.scrollTop,
      top: this.input.scrollTop
    };
  }
  /** Sets the start and end positions of the text selection (0-based). */
  setSelectionRange(i, a, s = "none") {
    this.input.setSelectionRange(
      i,
      a,
      s
    );
  }
  /** Replaces a range of text with a new string. */
  setRangeText(i, a, s, l = "preserve") {
    const n = a ?? this.input.selectionStart, p = s ?? this.input.selectionEnd;
    this.input.setRangeText(
      i,
      n,
      p,
      l
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
  setCustomValidity(i) {
    this.input.setCustomValidity(i), this.formControlController.updateValidity();
  }
  render() {
    const i = this.hasSlotController.test("label"), a = this.hasSlotController.test("help-text"), s = this.label ? !0 : !!i, l = this.helpText ? !0 : !!a, n = this.placeholder && this.value.length === 0;
    return g`
      <div
        part="form-control"
        class=${d({
      "form-control": !0,
      "form-control--has-help-text": l,
      "form-control--has-label": s,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${d({
      textarea: !0,
      "textarea--disabled": this.disabled,
      "textarea--empty": !this.value,
      "textarea--filled": this.filled,
      "textarea--focused": this.hasFocus,
      "textarea--large": this.size === "large",
      "textarea--medium": this.size === "medium",
      "textarea--placeholder-visible": n,
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
                aria-hidden=${s ? "false" : "true"}
              >
                <slot name="label">${this.label}</slot>
              </label>
              <textarea
                part="textarea"
                id="input"
                class="textarea__control"
                title=${this.title}
                name=${o(this.name)}
                .value=${z(this.value)}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                placeholder=${o(this.placeholder)}
                rows=${o(this.rows)}
                minlength=${o(this.minlength)}
                maxlength=${o(this.maxlength)}
                autocapitalize=${o(this.autocapitalize)}
                autocorrect=${o(this.autocorrect)}
                ?autofocus=${this.autofocus}
                spellcheck=${o(this.spellcheck)}
                enterkeyhint=${o(this.enterkeyhint)}
                inputmode=${o(this.inputmode)}
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
          aria-hidden=${l ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
c.styles = [f, y, w];
let t = c;
e([
  $(".textarea__control")
], t.prototype, "input", 2);
e([
  C()
], t.prototype, "hasFocus", 2);
e([
  r()
], t.prototype, "title", 2);
e([
  r()
], t.prototype, "name", 2);
e([
  r()
], t.prototype, "value", 2);
e([
  r({ reflect: !0 })
], t.prototype, "size", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "filled", 2);
e([
  r()
], t.prototype, "label", 2);
e([
  r({ attribute: "help-text" })
], t.prototype, "helpText", 2);
e([
  r()
], t.prototype, "placeholder", 2);
e([
  r({ type: Number })
], t.prototype, "rows", 2);
e([
  r()
], t.prototype, "resize", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "readonly", 2);
e([
  r({ reflect: !0 })
], t.prototype, "form", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "required", 2);
e([
  r({ type: Number })
], t.prototype, "minlength", 2);
e([
  r({ type: Number })
], t.prototype, "maxlength", 2);
e([
  r()
], t.prototype, "autocapitalize", 2);
e([
  r()
], t.prototype, "autocorrect", 2);
e([
  r()
], t.prototype, "autocomplete", 2);
e([
  r({ type: Boolean })
], t.prototype, "autofocus", 2);
e([
  r()
], t.prototype, "enterkeyhint", 2);
e([
  r({
    converter: {
      // Allow "true|false" attribute values but keep the property boolean
      fromAttribute: (h) => !(!h || h === "false"),
      toAttribute: (h) => h ? "true" : "false"
    },
    type: Boolean
  })
], t.prototype, "spellcheck", 2);
e([
  r()
], t.prototype, "inputmode", 2);
e([
  b()
], t.prototype, "defaultValue", 2);
e([
  u("disabled", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleDisabledChange", 1);
e([
  u("rows", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleRowsChange", 1);
e([
  u("value", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleValueChange", 1);
export {
  t as default
};
