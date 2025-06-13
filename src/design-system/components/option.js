import { C as d, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { w as c } from "../chunks/watch.ChG-_stu.js";
import { i as x, x as m } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { r as h } from "../chunks/state.-o_YRGMi.js";
import { e as v } from "../chunks/query.BNveAlQo.js";
import { e as b } from "../chunks/class-map.Cn0czwWq.js";
import { L as g } from "../chunks/localize.D5Yoww6T.js";
import y from "./icon.js";
const _ = x`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-letter-spacing-normal);
    color: var(--cx-color-neutral-700);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium)
      var(--cx-spacing-x-small) var(--cx-spacing-x-small);
    transition: var(--cx-transition-fast) fill;
    cursor: pointer;
  }

  .option:not(.option--show-check) {
    padding-inline: var(--cx-spacing-small);
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--cx-menu-item-background-color-hover);
  }

  .option--current,
  .option--current.option--disabled {
    color: var(--cx-color-primary);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: default;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--cx-line-height-medium);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--cx-spacing-2x-small);
    display: none;
  }

  .option--show-check .option__check {
    display: block;
  }

  .option--show-check.option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;
var C = Object.defineProperty, k = Object.getOwnPropertyDescriptor, t = (i, s, o, l) => {
  for (var a = l > 1 ? void 0 : l ? k(s, o) : s, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (a = (l ? r(s, o, a) : r(a)) || a);
  return l && a && C(s, o, a), a;
};
let e = class extends d {
  constructor() {
    super(...arguments), this.localize = new g(this), this.current = !1, this.selected = !1, this.hasHover = !1, this.value = "", this.disabled = !1, this.showCheck = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "option"), this.setAttribute("aria-selected", "false");
  }
  handleDefaultSlotChange() {
    const i = this.getTextLabel();
    if (typeof this.cachedTextLabel > "u") {
      this.cachedTextLabel = i;
      return;
    }
    i !== this.cachedTextLabel && (this.cachedTextLabel = i, this.emit("slotchange", {
      bubbles: !0,
      cancelable: !1,
      composed: !1
    }));
  }
  handleMouseEnter() {
    this.hasHover = !0;
  }
  handleMouseLeave() {
    this.hasHover = !1;
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleSelectedChange() {
    this.setAttribute("aria-selected", this.selected ? "true" : "false");
  }
  handleValueChange() {
    typeof this.value != "string" && (this.value = String(this.value)), this.value.includes(" ") && (console.error(
      "Option values cannot include a space. All spaces have been replaced with underscores.",
      this
    ), this.value = this.value.replace(/ /g, "_"));
  }
  /** Returns a plain text label based on the option's content. */
  getTextLabel() {
    const i = this.childNodes;
    let s = "";
    return [...i].forEach((o) => {
      o.nodeType === Node.ELEMENT_NODE && (o.hasAttribute("slot") || (s += o.textContent)), o.nodeType === Node.TEXT_NODE && (s += o.textContent);
    }), s.trim();
  }
  render() {
    return m`
      <div
        part="base"
        class=${b({
      option: !0,
      "option--current": this.current,
      "option--disabled": this.disabled,
      "option--hover": this.hasHover,
      "option--selected": this.selected,
      "option--show-check": this.showCheck
    })}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <cx-icon
          part="checked-icon"
          class="option__check"
          name="check"
          library="system"
          aria-hidden="true"
        ></cx-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot
          part="label"
          class="option__label"
          @slotchange=${this.handleDefaultSlotChange}
        ></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `;
  }
};
e.styles = [f, _];
e.dependencies = { "cx-icon": y };
t([
  v(".option__label")
], e.prototype, "defaultSlot", 2);
t([
  h()
], e.prototype, "current", 2);
t([
  h()
], e.prototype, "selected", 2);
t([
  h()
], e.prototype, "hasHover", 2);
t([
  p({ reflect: !0 })
], e.prototype, "value", 2);
t([
  p({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
t([
  p({ attribute: "show-check", reflect: !0, type: Boolean })
], e.prototype, "showCheck", 2);
t([
  c("disabled")
], e.prototype, "handleDisabledChange", 1);
t([
  c("selected")
], e.prototype, "handleSelectedChange", 1);
t([
  c("value")
], e.prototype, "handleValueChange", 1);
e = t([
  u("cx-option")
], e);
export {
  e as default
};
