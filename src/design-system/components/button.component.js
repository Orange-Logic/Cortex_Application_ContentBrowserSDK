import { C as b } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { F as y, v } from "../chunks/form.CBFaCEBn.js";
import { H as C } from "../chunks/slot.DJLm4Dig.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { r as d } from "../chunks/state.-o_YRGMi.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import { e as w } from "../chunks/class-map.Cn0czwWq.js";
import { o as r } from "../chunks/if-defined.D8U9hdvp.js";
import { i as c, u as p } from "../chunks/static.C35JqlCk.js";
import { L as $ } from "../chunks/localize.DV9I313e.js";
import S from "./icon.component.js";
import B from "./spinner.component.js";
import F from "./button.styles.js";
var _ = Object.defineProperty, z = Object.getOwnPropertyDescriptor, o = (f, e, l, n) => {
  for (var s = n > 1 ? void 0 : n ? z(e, l) : e, u = f.length - 1, h; u >= 0; u--)
    (h = f[u]) && (s = (n ? h(e, l, s) : h(s)) || s);
  return n && s && _(e, l, s), s;
};
const a = class a extends b {
  constructor() {
    super(...arguments), this.formControlController = new y(this, {
      assumeInteractionOn: ["click"]
    }), this.hasSlotController = new C(
      this,
      "[default]",
      "prefix",
      "suffix"
    ), this.localize = new $(this), this.hasFocus = !1, this.invalid = !1, this.isParentDropdownOpened = !1, this.title = "", this.variant = "default", this.size = "medium", this.caret = !1, this.disabled = !1, this.loading = !1, this.outline = !1, this.pill = !1, this.circle = !1, this.type = "button", this.name = "", this.value = "", this.href = "", this.rel = "noreferrer noopener";
  }
  /** Gets the validity state object */
  get validity() {
    return this.isButton() ? this.button.validity : v;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.isButton() ? this.button.validationMessage : "";
  }
  firstUpdated() {
    this.isButton() && this.formControlController.updateValidity(), this.syncStyles(), new MutationObserver(() => this.syncStyles()).observe(this, {
      attributeFilter: ["style"],
      attributes: !0
    });
    const e = this.closest("cx-dropdown");
    e && new MutationObserver(() => {
      this.isParentDropdownOpened = e.open;
    }).observe(e, {
      attributeFilter: ["open"],
      attributes: !0
    });
  }
  syncStyles() {
    const e = this.style.fontSize;
    e && this.button && (this.button.style.fontSize = e, this.style.fontSize = "");
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleClick() {
    this.type === "submit" && this.formControlController.submit(this), this.type === "reset" && this.formControlController.reset(this);
  }
  handleInvalid(e) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(e);
  }
  isButton() {
    return !this.href;
  }
  isLink() {
    return !!this.href;
  }
  handleDisabledChange() {
    this.isButton() && this.formControlController.setValidity(this.disabled);
  }
  /** Simulates a click on the button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the button. */
  focus(e) {
    this.button.focus(e);
  }
  /** Removes focus from the button. */
  blur() {
    this.button.blur();
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.isButton() ? this.button.checkValidity() : !0;
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.isButton() ? this.button.reportValidity() : !0;
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(e) {
    this.isButton() && (this.button.setCustomValidity(e), this.formControlController.updateValidity());
  }
  render() {
    const e = this.isLink(), l = e ? c`a` : c`button`;
    return p`
      <${l}
        part="base"
        class=${w({
      button: !0,
      "button--caret": this.caret,
      "button--circle": this.circle,
      "button--danger": this.variant === "danger",
      "button--default": this.variant === "default" || this.variant === "neutral",
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus || this.isParentDropdownOpened,
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix"),
      "button--large": this.size === "large",
      "button--loading": this.loading,
      "button--medium": this.size === "medium",
      "button--outline": this.outline,
      "button--pill": this.pill,
      "button--primary": this.variant === "primary",
      "button--rtl": this.localize.dir() === "rtl",
      "button--small": this.size === "small",
      "button--standard": !this.outline,
      "button--success": this.variant === "success",
      "button--tertiary": this.variant === "tertiary",
      "button--text": this.variant === "text",
      "button--warning": this.variant === "warning",
      "button--x-large": this.size === "x-large"
    })}
        ?disabled=${r(e ? void 0 : this.disabled)}
        type=${r(e ? void 0 : this.type)}
        title=${this.title}
        name=${r(e ? void 0 : this.name)}
        value=${r(e ? void 0 : this.value)}
        href=${r(e ? this.href : void 0)}
        target=${r(e ? this.target : void 0)}
        download=${r(e ? this.download : void 0)}
        rel=${r(e ? this.rel : void 0)}
        role=${r(e ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? p`
                <cx-icon
                  part="caret"
                  class="button__caret"
                  name="keyboard_arrow_down"
                ></cx-icon>
              ` : ""}
        ${this.loading ? p`<cx-spinner part="spinner"></cx-spinner>` : ""}
      </${l}>
    `;
  }
};
a.styles = [m, F], a.dependencies = {
  "cx-icon": S,
  "cx-spinner": B
};
let t = a;
o([
  x(".button")
], t.prototype, "button", 2);
o([
  d()
], t.prototype, "hasFocus", 2);
o([
  d()
], t.prototype, "invalid", 2);
o([
  d()
], t.prototype, "isParentDropdownOpened", 2);
o([
  i()
], t.prototype, "title", 2);
o([
  i({ reflect: !0 })
], t.prototype, "variant", 2);
o([
  i({ reflect: !0 })
], t.prototype, "size", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "caret", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "loading", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "outline", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "pill", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "circle", 2);
o([
  i()
], t.prototype, "type", 2);
o([
  i()
], t.prototype, "name", 2);
o([
  i()
], t.prototype, "value", 2);
o([
  i()
], t.prototype, "href", 2);
o([
  i()
], t.prototype, "target", 2);
o([
  i()
], t.prototype, "rel", 2);
o([
  i()
], t.prototype, "download", 2);
o([
  i()
], t.prototype, "form", 2);
o([
  i({ attribute: "formaction" })
], t.prototype, "formAction", 2);
o([
  i({ attribute: "formenctype" })
], t.prototype, "formEnctype", 2);
o([
  i({ attribute: "formmethod" })
], t.prototype, "formMethod", 2);
o([
  i({ attribute: "formnovalidate", type: Boolean })
], t.prototype, "formNoValidate", 2);
o([
  i({ attribute: "formtarget" })
], t.prototype, "formTarget", 2);
o([
  g("disabled", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleDisabledChange", 1);
export {
  t as default
};
