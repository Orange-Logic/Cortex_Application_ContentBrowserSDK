import { C as f, c as b } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { H as v, g } from "../chunks/slot.DJLm4Dig.js";
import { w as d } from "../chunks/watch.ChG-_stu.js";
import { i as y, x as l } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { o as m } from "../chunks/if-defined.D8U9hdvp.js";
import { L as _ } from "../chunks/localize.D5Yoww6T.js";
import k from "./icon.js";
import C from "./popup.js";
import w from "./spinner.js";
import { SubmenuController as S } from "./submenu-controller.js";
const z = y`
  :host {
    --submenu-offset: -2px;
    --checked-icon-display: flex;
    --submenu-icon-display: flex;
    --prefix-font-size: var(--cx-font-size-small);
    --prefix-color: var(--cx-color-neutral-500);
    --label-color: var(--cx-color-neutral);
    --suffix-color: var(--cx-color-neutral);
    --font-weight: var(--cx-font-weight-regular);

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    text-decoration: none;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--font-weight);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-letter-spacing-normal);
    color: var(--cx-color-neutral);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    transition: var(--cx-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    cursor: default;
  }

  .menu-item.menu-item--disabled .menu-item__label,
  .menu-item.menu-item--disabled .menu-item__prefix,
  .menu-item.menu-item--disabled .menu-item__chevron {
    opacity: 0.5;
  }

  .menu-item.menu-item--disabled .menu-item__suffix:not(:slotted(cx-tooltip)) {
    opacity: 0.5;
  }

  .menu-item.menu-item--loading {
    outline: none;
    cursor: wait;
  }

  .menu-item.menu-item--loading *:not(cx-spinner) {
    opacity: 0.5;
  }

  .menu-item--loading cx-spinner {
    --indicator-color: currentColor;
    --track-width: 1px;
    position: absolute;
    font-size: 0.75em;
    top: calc(50% - 0.5em);
    left: 0.65rem;
    opacity: 1;
  }

  .menu-item .menu-item__label {
    color: var(--label-color);
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: auto;
  }

  .menu-item--checked .menu-item__label {
    color: var(--cx-color-primary-600);
  }

  .menu-item .menu-item__prefix {
    color: var(--prefix-color);
    font-size: var(--prefix-font-size);
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item--checked {
    --prefix-color: var(--cx-color-primary-600);
    --suffix-color: var(--cx-color-primary-600);
  }

  .menu-item--checked .menu-item__check {
    color: var(--cx-color-primary-600);
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    color: var(--suffix-color);
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--cx-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
      var(--safe-triangle-submenu-start-x, 0)
        var(--safe-triangle-submenu-start-y, 0),
      var(--safe-triangle-submenu-end-x, 0)
        var(--safe-triangle-submenu-end-y, 0)
    );
  }

  @media (pointer: none), (pointer: coarse) {
    .menu-item--submenu-expanded::after {
      display: none;
    }
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible, .disable-hover))
    .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--cx-menu-item-background-color-hover);
    color: var(--cx-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--cx-menu-item-background-color-hover);
    opacity: 1;
  }

  .menu-item .menu-item__check {
    display: var(--checked-icon-display);
    margin-right: var(--cx-spacing-2x-small);
  }

  .menu-item .menu-item__chevron {
    display: var(--submenu-icon-display);
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  cx-popup::part(popup) {
    border: var(--cx-panel-border-width) solid var(--cx-popup-border-color);
    border-radius: var(--cx-border-radius-large);
    box-shadow: var(--cx-shadow-large);
    z-index: var(--cx-z-index-dropdown);
    margin-left: var(--submenu-offset);
    overflow: hidden;
  }

  .menu-item--rtl cx-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(cx-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;
var L = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, i = (t, o, s, r) => {
  for (var a = r > 1 ? void 0 : r ? $(o, s) : o, c = t.length - 1, u; c >= 0; c--)
    (u = t[c]) && (a = (r ? u(o, s, a) : u(a)) || a);
  return r && a && L(o, s, a), a;
};
let e = class extends f {
  constructor() {
    super(...arguments), this.type = "normal", this.checked = !1, this.value = "", this.href = "", this.rel = "noreferrer noopener", this.loading = !1, this.disabled = !1, this.readonly = !1, this.localize = new _(this), this.hasSlotController = new v(this, "submenu"), this.submenuController = new S(
      this,
      this.hasSlotController
    ), this.handleDocumentWheel = (t) => {
      const o = t.composedPath();
      this.submenuController.isExpanded() && (!this.submenuController.popup || !o.includes(this.submenuController.popup)) && (t.preventDefault(), this.submenuController.disableSubmenu());
    }, this.handleHostClick = (t) => {
      (this.disabled || this.readonly) && (t.target === this && t.preventDefault(), t.stopImmediatePropagation());
    }, this.handleMouseOver = (t) => {
      t.stopPropagation();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("click", this.handleHostClick), this.addEventListener("mouseover", this.handleMouseOver), document.addEventListener("wheel", this.handleDocumentWheel, {
      passive: !1
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("click", this.handleHostClick), this.removeEventListener("mouseover", this.handleMouseOver), document.removeEventListener("wheel", this.handleDocumentWheel);
  }
  handleDefaultSlotChange() {
    const t = this.getTextLabel();
    if (typeof this.cachedTextLabel > "u") {
      this.cachedTextLabel = t;
      return;
    }
    t !== this.cachedTextLabel && (this.cachedTextLabel = t, this.emit("slotchange", {
      bubbles: !0,
      cancelable: !1,
      composed: !1
    }));
  }
  handleCheckedChange() {
    if (this.checked && this.type !== "checkbox") {
      this.checked = !1, console.error(
        'The checked attribute can only be used on menu items with type="checkbox"',
        this
      );
      return;
    }
    this.type === "checkbox" ? this.setAttribute("aria-checked", this.checked ? "true" : "false") : this.removeAttribute("aria-checked");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleTypeChange() {
    this.type === "checkbox" ? (this.setAttribute("role", "menuitemcheckbox"), this.setAttribute("aria-checked", this.checked ? "true" : "false")) : (this.setAttribute("role", "menuitem"), this.removeAttribute("aria-checked"));
  }
  /** Returns a text label based on the contents of the menu item's default slot. */
  getTextLabel() {
    return g(this.defaultSlot);
  }
  isSubmenu() {
    return this.hasSlotController.test("submenu");
  }
  renderBase(t) {
    const o = !!this.href, s = this.localize.dir() === "rtl", r = this.submenuController.isExpanded();
    return o ? l`
        <a
          id="anchor"
          part="base"
          class=${h({
      "menu-item": !0,
      "menu-item--checked": this.checked,
      "menu-item--disabled": this.disabled,
      "menu-item--has-submenu": this.isSubmenu(),
      "menu-item--loading": this.loading,
      "menu-item--rtl": s,
      "menu-item--submenu-expanded": r
    })}
          aria-haspopup="${this.isSubmenu()}"
          href=${m(this.href)}
          target=${m(this.target)}
          download=${m(this.download)}
          rel=${m(this.rel)}
        >
          ${t}
        </a>
      ` : l`
      <div
        id="anchor"
        part="base"
        class=${h({
      "menu-item": !0,
      "menu-item--checked": this.checked,
      "menu-item--disabled": this.disabled,
      "menu-item--has-submenu": this.isSubmenu(),
      "menu-item--loading": this.loading,
      "menu-item--rtl": s,
      "menu-item--submenu-expanded": r
    })}
        aria-haspopup="${this.isSubmenu()}"
      >
        ${t}
      </div>
    `;
  }
  render() {
    const t = this.localize.dir() === "rtl";
    return this.renderBase(l`
      <span part="checked-icon" class="menu-item__check">
        <cx-icon name="check"></cx-icon>
      </span>

      <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

      <slot
        part="label"
        class="menu-item__label"
        @slotchange=${this.handleDefaultSlotChange}
      ></slot>

      <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

      <span part="submenu-icon" class="menu-item__chevron">
        <cx-icon
          name=${t ? "chevron_left" : "chevron_right"}
          aria-hidden="true"
        ></cx-icon>
      </span>

      ${this.submenuController.renderSubmenu()}
      ${this.loading ? l`
            <cx-spinner
              part="spinner"
              exportparts="base:spinner__base"
            ></cx-spinner>
          ` : ""}
    `);
  }
};
e.styles = [x, z];
e.dependencies = {
  "cx-icon": k,
  "cx-popup": C,
  "cx-spinner": w
};
i([
  p("slot:not([name])")
], e.prototype, "defaultSlot", 2);
i([
  p(".menu-item")
], e.prototype, "menuItem", 2);
i([
  n()
], e.prototype, "type", 2);
i([
  n({ reflect: !0, type: Boolean })
], e.prototype, "checked", 2);
i([
  n()
], e.prototype, "value", 2);
i([
  n()
], e.prototype, "href", 2);
i([
  n()
], e.prototype, "target", 2);
i([
  n()
], e.prototype, "rel", 2);
i([
  n()
], e.prototype, "download", 2);
i([
  n({ reflect: !0, type: Boolean })
], e.prototype, "loading", 2);
i([
  n({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
i([
  n({ reflect: !0, type: Boolean })
], e.prototype, "readonly", 2);
i([
  n({ attribute: !1, type: Object })
], e.prototype, "flipBoundary", 2);
i([
  n({ attribute: !1, type: Object })
], e.prototype, "shiftBoundary", 2);
i([
  d("checked")
], e.prototype, "handleCheckedChange", 1);
i([
  d("disabled")
], e.prototype, "handleDisabledChange", 1);
i([
  d("type")
], e.prototype, "handleTypeChange", 1);
e = i([
  b("cx-menu-item")
], e);
export {
  e as default
};
