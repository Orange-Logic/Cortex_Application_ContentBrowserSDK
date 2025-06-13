import { C as p, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { w as d } from "../chunks/watch.ChG-_stu.js";
import { i as f, x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { e as v } from "../chunks/query.BNveAlQo.js";
import { e as m } from "../chunks/class-map.Cn0czwWq.js";
import { L as x } from "../chunks/localize.D5Yoww6T.js";
import g from "./icon-button.js";
const y = f`
  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-regular);
    border-radius: var(--cx-border-radius-small);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition:
      var(--transition-speed) box-shadow,
      var(--transition-speed) color;
  }

  .tab.tab--default {
    color: var(--cx-color-neutral-700);
  }

  .tab.tab--button {
    color: var(--cx-color-neutral-600);
    border-radius: 10px;
  }

  .tab.tab.tab--default:hover:not(.tab--disabled) {
    color: var(--cx-color-primary-600);
  }

  .tab.tab.tab--button:hover:not(.tab--disabled) {
    color: var(--cx-color-neutral-800);
  }

  :host(:focus) {
    outline: transparent;
  }

  :host(:focus-visible):not([disabled]) {
    color: var(--cx-color-primary-600);
  }

  :host(:focus-visible) {
    outline: var(--cx-focus-ring);
    outline-offset: calc(
      -1 * var(--cx-focus-ring-width) - var(--cx-focus-ring-offset)
    );
  }

  .tab.tab--default.tab--active:not(.tab--disabled) {
    color: var(--cx-color-primary-600);
  }

  .tab.tab--button.tab--active:not(.tab--disabled) {
    background-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral-800);
  }

  .tab.tab--closable {
    padding-inline-end: var(--cx-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .tab__close-button {
    font-size: var(--cx-font-size-small);
    margin-inline-start: var(--cx-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--cx-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`;
var C = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, e = (o, r, i, l) => {
  for (var a = l > 1 ? void 0 : l ? _(r, i) : r, n = o.length - 1, c; n >= 0; n--)
    (c = o[n]) && (a = (l ? c(r, i, a) : c(a)) || a);
  return l && a && C(r, i, a), a;
};
let w = 0, t = class extends p {
  constructor() {
    super(...arguments), this.localize = new x(this), this.attrId = ++w, this.componentId = `cx-tab-${this.attrId}`, this.panel = "", this.active = !1, this.closable = !1, this.disabled = !1, this.tabIndex = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tab");
  }
  handleCloseClick(o) {
    o.stopPropagation(), this.emit("cx-close");
  }
  handleActiveChange() {
    this.setAttribute("aria-selected", this.active ? "true" : "false");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false"), this.disabled && !this.active ? this.tabIndex = -1 : this.tabIndex = 0;
  }
  render() {
    this.id = this.id.length > 0 ? this.id : this.componentId;
    const o = (this.parentElement && this.parentElement.getAttribute("variant")) ?? "default";
    return b`
      <div
        part="base"
        class=${m({
      tab: !0,
      "tab--active": this.active,
      "tab--closable": this.closable,
      "tab--disabled": this.disabled,
      [`tab--${o}`]: !0
    })}
      >
        <slot></slot>
        ${this.closable ? b`
              <cx-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="close"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></cx-icon-button>
            ` : ""}
      </div>
    `;
  }
};
t.styles = [h, y];
t.dependencies = { "cx-icon-button": g };
e([
  v(".tab")
], t.prototype, "tab", 2);
e([
  s({ reflect: !0 })
], t.prototype, "panel", 2);
e([
  s({ reflect: !0, type: Boolean })
], t.prototype, "active", 2);
e([
  s({ reflect: !0, type: Boolean })
], t.prototype, "closable", 2);
e([
  s({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
e([
  s({ reflect: !0, type: Number })
], t.prototype, "tabIndex", 2);
e([
  d("active")
], t.prototype, "handleActiveChange", 1);
e([
  d("disabled")
], t.prototype, "handleDisabledChange", 1);
t = e([
  u("cx-tab")
], t);
export {
  t as default
};
