import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as k } from "../chunks/component.styles.BLcT4bOa.js";
import { f as y } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as x } from "../chunks/default-value.BaUjiOTd.js";
import { F as b } from "../chunks/form.CBFaCEBn.js";
import { H as C } from "../chunks/slot.DJLm4Dig.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { x as n } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { r as v } from "../chunks/state.-o_YRGMi.js";
import { e as $ } from "../chunks/query.BNveAlQo.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
import { o as g } from "../chunks/if-defined.D8U9hdvp.js";
import { l as m } from "../chunks/live.C0NiCo2U.js";
import _ from "./icon.component.js";
import V from "./checkbox.styles.js";
var F = Object.defineProperty, w = Object.getOwnPropertyDescriptor, i = (d, e, r, l) => {
  for (var s = l > 1 ? void 0 : l ? w(e, r) : e, h = d.length - 1, c; h >= 0; h--)
    (c = d[h]) && (s = (l ? c(e, r, s) : c(s)) || s);
  return l && s && F(e, r, s), s;
};
const a = class a extends f {
  constructor() {
    super(...arguments), this.formControlController = new b(this, {
      // eslint-disable-next-line
      // @ts-ignore
      defaultValue: (e) => e.defaultChecked,
      // eslint-disable-next-line
      // @ts-ignore
      setValue: (e, r) => e.checked = r,
      // eslint-disable-next-line
      // @ts-ignore
      value: (e) => e.checked ? e.value || "on" : void 0
    }), this.hasSlotController = new C(this, "help-text"), this.hasFocus = !1, this.title = "", this.name = "", this.size = "medium", this.disabled = !1, this.checked = !1, this.indeterminate = !1, this.defaultChecked = !1, this.form = "", this.required = !1, this.helpText = "";
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
  handleInvalid(e) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(e);
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
  focus(e) {
    this.input.focus(e);
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
  setCustomValidity(e) {
    this.input.setCustomValidity(e), this.formControlController.updateValidity();
  }
  render() {
    const e = this.hasSlotController.test("help-text"), r = this.helpText ? !0 : !!e;
    return n`
      <div
        class=${p({
      "form-control": !0,
      "form-control--has-help-text": r,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <label
          part="base"
          class=${p({
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
            value=${g(this.value)}
            .indeterminate=${m(this.indeterminate)}
            .checked=${m(this.checked)}
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
            ${this.checked ? n`
                  <cx-icon
                    part="checked-icon"
                    class="checkbox__checked-icon"
                    name="check"
                  ></cx-icon>
                ` : ""}
            ${!this.checked && this.indeterminate ? n`
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
a.styles = [k, y, V], a.dependencies = { "cx-icon": _ };
let t = a;
i([
  $('input[type="checkbox"]')
], t.prototype, "input", 2);
i([
  v()
], t.prototype, "hasFocus", 2);
i([
  o()
], t.prototype, "title", 2);
i([
  o()
], t.prototype, "name", 2);
i([
  o()
], t.prototype, "value", 2);
i([
  o({ reflect: !0 })
], t.prototype, "size", 2);
i([
  o({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
i([
  o({ reflect: !0, type: Boolean })
], t.prototype, "checked", 2);
i([
  o({ reflect: !0, type: Boolean })
], t.prototype, "indeterminate", 2);
i([
  x("checked")
], t.prototype, "defaultChecked", 2);
i([
  o({ reflect: !0 })
], t.prototype, "form", 2);
i([
  o({ reflect: !0, type: Boolean })
], t.prototype, "required", 2);
i([
  o({ attribute: "help-text" })
], t.prototype, "helpText", 2);
i([
  u("disabled", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleDisabledChange", 1);
i([
  u(["checked", "indeterminate"], { waitUntilFirstUpdate: !0 })
], t.prototype, "handleStateChange", 1);
export {
  t as default
};
