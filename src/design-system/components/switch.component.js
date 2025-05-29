import { C as m } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { f as y } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as C } from "../chunks/default-value.BaUjiOTd.js";
import { F as k } from "../chunks/form.CBFaCEBn.js";
import { H as x } from "../chunks/slot.DJLm4Dig.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { x as c } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { r as w } from "../chunks/state.-o_YRGMi.js";
import { e as b } from "../chunks/query.BNveAlQo.js";
import { e as d } from "../chunks/class-map.Cn0czwWq.js";
import { o as v } from "../chunks/if-defined.D8U9hdvp.js";
import { l as g } from "../chunks/live.C0NiCo2U.js";
import _ from "./switch.styles.js";
var $ = Object.defineProperty, V = Object.getOwnPropertyDescriptor, i = (p, t, o, r) => {
  for (var l = r > 1 ? void 0 : r ? V(t, o) : t, h = p.length - 1, a; h >= 0; h--)
    (a = p[h]) && (l = (r ? a(t, o, l) : a(l)) || l);
  return r && l && $(t, o, l), l;
};
const n = class n extends m {
  constructor() {
    super(...arguments), this.formControlController = new k(this, {
      // eslint-disable-next-line
      // @ts-ignore
      defaultValue: (t) => t.defaultChecked,
      // eslint-disable-next-line
      // @ts-ignore
      setValue: (t, o) => t.checked = o,
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
    const t = this.hasSlotController.test("help-text"), o = this.helpText ? !0 : !!t;
    return c`
      <div
        class=${d({
      "form-control": !0,
      "form-control--has-help-text": o,
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
            value=${v(this.value)}
            .checked=${g(this.checked)}
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
              ${this.showIcon ? this.checked ? c`<cx-icon
                      part="checked-icon"
                      class="switch__icon"
                      name="check"
                    ></cx-icon>` : c`<cx-icon
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
          aria-hidden=${o ? "false" : "true"}
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
n.styles = [f, y, _];
let e = n;
i([
  b('input[type="checkbox"]')
], e.prototype, "input", 2);
i([
  w()
], e.prototype, "hasFocus", 2);
i([
  s()
], e.prototype, "title", 2);
i([
  s()
], e.prototype, "name", 2);
i([
  s()
], e.prototype, "value", 2);
i([
  s({ reflect: !0 })
], e.prototype, "size", 2);
i([
  s({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
i([
  s({ reflect: !0, type: Boolean })
], e.prototype, "checked", 2);
i([
  C("checked")
], e.prototype, "defaultChecked", 2);
i([
  s({ reflect: !0 })
], e.prototype, "form", 2);
i([
  s({ reflect: !0, type: Boolean })
], e.prototype, "required", 2);
i([
  s({ attribute: "show-icon", reflect: !0, type: Boolean })
], e.prototype, "showIcon", 2);
i([
  s({ attribute: "help-text" })
], e.prototype, "helpText", 2);
i([
  u("checked", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleCheckedChange", 1);
i([
  u("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
export {
  e as default
};
