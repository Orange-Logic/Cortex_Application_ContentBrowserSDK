import { C as p, c as f } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { i as m, x as v } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as u } from "../chunks/state.-o_YRGMi.js";
import { e as n } from "../chunks/class-map.Cn0czwWq.js";
import g from "./icon.js";
import { checkedSvg as x } from "./radio.svg.js";
const k = m`
  :host {
    display: block;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio {
    display: inline-flex;
    align-items: top;
    font-family: var(--cx-input-font-family);
    font-size: var(--cx-input-font-size-medium);
    font-weight: var(--cx-input-font-weight);
    color: var(--cx-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .radio--small {
    --toggle-size: var(--cx-toggle-size-small);
    font-size: var(--cx-input-font-size-small);
  }

  .radio--medium {
    --toggle-size: var(--cx-toggle-size-medium);
    font-size: var(--cx-input-font-size-medium);
  }

  .radio--large {
    --toggle-size: var(--cx-toggle-size-large);
    font-size: var(--cx-input-font-size-large);
  }

  .radio__checked-icon {
    display: inline-flex;
  }

  .radio__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
    border-radius: 50%;
    background-color: var(--cx-input-background-color);
    color: transparent;
    transition:
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) background-color,
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) box-shadow;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
    border-color: var(--cx-input-border-color-hover);
    background-color: var(--cx-input-background-color-hover);
  }

  /* Checked */
  .radio--checked .radio__control {
    color: var(--cx-color-primary-600);
    border-color: var(--cx-color-primary-600);
    background-color: var(--cx-color-neutral-0);
  }

  /* Checked + hover */
  .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
    border-color: var(--cx-color-primary-500);
    background-color: var(--cx-color-neutral-0);
  }

  /* Checked + focus */
  :host(:focus-visible) .radio__control {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .radio__control.radio__control--hidden {
    display: none;
  }

  /* Disabled */
  .radio--disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
  .radio:not(.radio--checked) svg circle {
    opacity: 0;
  }

  .radio__label {
    display: inline-block;
    color: var(--cx-input-label-color);
    flex: 1;
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
    text-transform: var(--cx-radio-label-text-transform, none);
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
var _ = Object.defineProperty, y = Object.getOwnPropertyDescriptor, t = (d, i, s, r) => {
  for (var o = r > 1 ? void 0 : r ? y(i, s) : i, c = d.length - 1, l; c >= 0; c--)
    (l = d[c]) && (o = (r ? l(i, s, o) : l(o)) || o);
  return r && o && _(i, s, o), o;
};
let e = class extends p {
  constructor() {
    super(), this.checked = !1, this.hasFocus = !1, this.size = "medium", this.disabled = !1, this.hideIndicator = !1, this.handleBlur = () => {
      this.hasFocus = !1, this.emit("cx-blur");
    }, this.handleClick = () => {
      this.disabled || (this.checked = !0);
    }, this.handleFocus = () => {
      this.hasFocus = !0, this.emit("cx-focus");
    }, this.addEventListener("blur", this.handleBlur), this.addEventListener("click", this.handleClick), this.addEventListener("focus", this.handleFocus);
  }
  connectedCallback() {
    super.connectedCallback(), this.setInitialAttributes();
  }
  setInitialAttributes() {
    this.setAttribute("role", "radio"), this.setAttribute("tabindex", "-1"), this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleCheckedChange() {
    this.setAttribute("aria-checked", this.checked ? "true" : "false"), this.setAttribute("tabindex", this.checked ? "0" : "-1");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  render() {
    return v`
      <span
        part="base"
        class=${n({
      radio: !0,
      "radio--checked": this.checked,
      "radio--disabled": this.disabled,
      "radio--focused": this.hasFocus,
      "radio--large": this.size === "large",
      "radio--medium": this.size === "medium",
      "radio--small": this.size === "small"
    })}
      >
        <span
          part="${`control${this.checked ? " control--checked" : ""}`}"
          class=${n({
      radio__control: !0,
      "radio__control--hidden": this.hideIndicator
    })}
        >
          ${this.checked ? x : ""}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `;
  }
};
e.styles = [b, k];
e.dependencies = { "cx-icon": g };
t([
  u()
], e.prototype, "checked", 2);
t([
  u()
], e.prototype, "hasFocus", 2);
t([
  a()
], e.prototype, "value", 2);
t([
  a({ reflect: !0 })
], e.prototype, "size", 2);
t([
  a({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
t([
  a({ attribute: "hide-indicator", reflect: !0, type: Boolean })
], e.prototype, "hideIndicator", 2);
t([
  h("checked")
], e.prototype, "handleCheckedChange", 1);
t([
  h("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
e = t([
  f("cx-radio")
], e);
export {
  e as default
};
