import { C as p, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { c } from "../chunks/component.styles.BLcT4bOa.js";
import { H as b } from "../chunks/slot.DJLm4Dig.js";
import { w as f } from "../chunks/watch.ChG-_stu.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { e as h } from "../chunks/query.BNveAlQo.js";
import { e as x } from "../chunks/class-map.Cn0czwWq.js";
import { o as y } from "../chunks/if-defined.D8U9hdvp.js";
import { u as _ } from "../chunks/static.C35JqlCk.js";
import { i as C } from "../chunks/lit-element.DRlPF2me.js";
import { b as v } from "../chunks/button.styles.C9W3odO4.js";
const w = C`
  ${v}

  .button__prefix,
  .button__suffix,
  .button__label {
    display: inline-flex;
    position: relative;
    align-items: center;
  }

  /* We use a hidden input so constraint validation errors work, since they don't appear to show when used with buttons.
    We can't actually hide it, though, otherwise the messages will be suppressed by the browser. */
  .hidden-input {
    all: unset;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    outline: dotted 1px red;
    opacity: 0;
    z-index: -1;
  }
`;
var $ = Object.defineProperty, g = Object.getOwnPropertyDescriptor, e = (s, l, a, r) => {
  for (var o = r > 1 ? void 0 : r ? g(l, a) : l, u = s.length - 1, n; u >= 0; u--)
    (n = s[u]) && (o = (r ? n(l, a, o) : n(o)) || o);
  return r && o && $(l, a, o), o;
};
let t = class extends p {
  constructor() {
    super(...arguments), this.hasSlotController = new b(
      this,
      "[default]",
      "prefix",
      "suffix"
    ), this.hasFocus = !1, this.checked = !1, this.disabled = !1, this.size = "medium", this.pill = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "presentation");
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleClick(s) {
    if (this.disabled) {
      s.preventDefault(), s.stopPropagation();
      return;
    }
    this.checked = !0;
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  /** Sets focus on the radio button. */
  focus(s) {
    this.input.focus(s);
  }
  /** Removes focus from the radio button. */
  blur() {
    this.input.blur();
  }
  render() {
    return _`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked ? " button--checked" : ""}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${x({
      button: !0,
      "button--checked": this.checked,
      "button--default": !0,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix"),
      "button--large": this.size === "large",
      "button--medium": this.size === "medium",
      "button--outline": !0,
      "button--pill": this.pill,
      "button--small": this.size === "small"
    })}
          aria-disabled=${this.disabled}
          type="button"
          value=${y(this.value)}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `;
  }
};
t.styles = [c, w];
e([
  h(".button")
], t.prototype, "input", 2);
e([
  h(".hidden-input")
], t.prototype, "hiddenInput", 2);
e([
  m()
], t.prototype, "hasFocus", 2);
e([
  i({ reflect: !0, type: Boolean })
], t.prototype, "checked", 2);
e([
  i()
], t.prototype, "value", 2);
e([
  i({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
e([
  i({ reflect: !0 })
], t.prototype, "size", 2);
e([
  i({ reflect: !0, type: Boolean })
], t.prototype, "pill", 2);
e([
  f("disabled", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleDisabledChange", 1);
t = e([
  d("cx-radio-button")
], t);
export {
  t as default
};
