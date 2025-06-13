import { C as v, c as g } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { r as p } from "../chunks/state.-o_YRGMi.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { o as c } from "../chunks/if-defined.D8U9hdvp.js";
import { i as b, u as m } from "../chunks/static.C35JqlCk.js";
import { L as f } from "../chunks/localize.D5Yoww6T.js";
import y from "./icon.js";
import { i as k } from "../chunks/lit-element.DRlPF2me.js";
const w = k`
  :host {
    display: inline-block;
    color: var(--cx-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--cx-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--cx-spacing-x-small);
    cursor: pointer;
    transition: var(--cx-transition-x-fast) color;
    position: relative;
    -webkit-appearance: none;
    position: relative;
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .icon-button:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
    margin: auto;
  }

  .icon-button--small {
    font-size: var(--cx-font-size-x-small);
    padding: var(--cx-spacing-2x-small);
    min-height: var(--cx-input-height-small);
    min-width: var(--cx-input-height-small);
  }

  .icon-button--medium {
    font-size: var(--cx-font-size-large);
    padding: var(--cx-spacing-2x-small);
    min-height: var(--cx-input-height-medium);
    min-width: var(--cx-input-height-medium);
  }

  .icon-button--large {
    font-size: var(--cx-font-size-large);
    padding: var(--cx-spacing-x-small);
    min-height: var(--cx-input-height-large);
    min-width: var(--cx-input-width-large);
  }

  .icon-button--x-large {
    font-size: var(--cx-font-size-large);
    padding: var(--cx-spacing-small);
    min-height: var(--cx-input-height-x-large);
    min-width: var(--cx-input-height-x-large);
  }

  /*
   * Standard buttons
   */

  /* Default */
  .icon-button.icon-button--default {
    background-color: var(--cx-color-neutral-100);
    border-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .icon-button.icon-button--default:hover:not(.icon-button--disabled),
  .icon-button.icon-button--default.icon-button--focused:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-neutral-200);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral);
  }

  .icon-button.icon-button--default:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-neutral-300);
    border-color: var(--cx-color-neutral-300);
    color: var(--cx-color-neutral);
  }

  /* Primary */
  .icon-button.icon-button--primary {
    background-color: var(--cx-color-primary-600);
    border-color: var(--cx-color-primary-600);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--primary:hover:not(.icon-button--disabled),
  .icon-button.icon-button--primary.icon-button--focused:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--primary:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-primary-700);
    border-color: var(--cx-color-primary-700);
    color: var(--cx-color-neutral-0);
  }

  /* Success */
  .icon-button.icon-button--success {
    background-color: var(--cx-color-success-600);
    border-color: var(--cx-color-success-600);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--success:hover:not(.icon-button--disabled),
  .icon-button.icon-button--success.icon-button--focused:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-success-500);
    border-color: var(--cx-color-success-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--success:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-success-700);
    border-color: var(--cx-color-success-700);
    color: var(--cx-color-neutral-0);
  }

  /* Warning */
  .icon-button.icon-button--warning {
    background-color: var(--cx-color-warning-600);
    border-color: var(--cx-color-warning-600);
    color: var(--cx-color-neutral-0);
  }
  .icon-button.icon-button--warning:hover:not(.icon-button--disabled),
  .icon-button.icon-button--warning.icon-button--focused:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-warning-500);
    border-color: var(--cx-color-warning-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--warning:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-warning-700);
    border-color: var(--cx-color-warning-700);
    color: var(--cx-color-neutral-0);
  }

  /* Danger */
  .icon-button.icon-button--danger {
    background-color: var(--cx-color-danger-600);
    border-color: var(--cx-color-danger-600);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--danger:hover:not(.icon-button--disabled),
  .icon-button.icon-button--danger.icon-button--focused:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-danger-500);
    border-color: var(--cx-color-danger-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button.icon-button--danger:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-danger-700);
    border-color: var(--cx-color-danger-700);
    color: var(--cx-color-neutral-0);
  }

  /* Custom */
  .icon-button.icon-button--custom {
    background-color: var(--background-color);
    border-color: var(--background-color);
    color: var(--color);
  }

  .icon-button.icon-button--custom:hover:not(.icon-button--disabled),
  .icon-button.icon-button--custom.icon-button--focused:not(
      .icon-button--disabled
    ) {
    background-color: var(--background-color);
    border-color: var(--background-color);
    color: var(--color);
  }

  .icon-button.icon-button--custom:active:not(.icon-button--disabled) {
    background-color: var(--background-color);
    border-color: var(--background-color);
    color: var(--color);
  }

  /*
   * Outline buttons
   */

  .icon-button--outline {
    background: none;
    border: solid var(--cx-input-border-width);
    border-color: var(--cx-input-border-color);
  }

  /* Default */
  .icon-button--outline.icon-button--default {
    border-color: var(--cx-input-border-color);
    color: var(--cx-color-neutral);
  }

  .icon-button--outline.icon-button--default:hover:not(.icon-button--disabled),
  .icon-button--outline.icon-button--default.icon-button--focused:not(
      .icon-button--disabled
    ),
  .icon-button--outline.icon-button--default.icon-button--checked:not(
      .icon-button--disabled
    ) {
    border-color: var(--cx-color-neutral-300);
    background-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .icon-button--outline.icon-button--default:active:not(
      .icon-button--disabled
    ) {
    border-color: var(--cx-color-neutral-300);
    background-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral);
  }

  /* Primary */
  .icon-button--outline.icon-button--primary {
    border-color: var(--cx-color-primary-600);
    color: var(--cx-color-primary-600);
  }

  .icon-button--outline.icon-button--primary:hover:not(.icon-button--disabled),
  .icon-button--outline.icon-button--primary.icon-button--focused:not(
      .icon-button--disabled
    ),
  .icon-button--outline.icon-button--primary.icon-button--checked:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-primary-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button--outline.icon-button--primary:active:not(
      .icon-button--disabled
    ) {
    border-color: var(--cx-color-primary-700);
    background-color: var(--cx-color-primary-700);
    color: var(--cx-color-neutral-0);
  }

  /* Success */
  .icon-button--outline.icon-button--success {
    border-color: var(--cx-color-success-600);
    color: var(--cx-color-success-600);
  }

  .icon-button--outline.icon-button--success:hover:not(.icon-button--disabled),
  .icon-button--outline.icon-button--success.icon-button--focused:not(
      .icon-button--disabled
    ),
  .icon-button--outline.icon-button--success.icon-button--checked:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-success-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button--outline.icon-button--success:active:not(
      .icon-button--disabled
    ) {
    border-color: var(--cx-color-success-600);
    background-color: var(--cx-color-success-600);
    color: var(--cx-color-neutral-0);
  }

  /* Warning */
  .icon-button--outline.icon-button--warning {
    border-color: var(--cx-color-warning-600);
    color: var(--cx-color-warning-600);
  }

  .icon-button--outline.icon-button--warning:hover:not(.icon-button--disabled),
  .icon-button--outline.icon-button--warning.icon-button--focused:not(
      .icon-button--disabled
    ),
  .icon-button--outline.icon-button--warning.icon-button--checked:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-warning-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button--outline.icon-button--warning:active:not(
      .icon-button--disabled
    ) {
    border-color: var(--cx-color-warning-700);
    background-color: var(--cx-color-warning-700);
    color: var(--cx-color-neutral-0);
  }

  /* Danger */
  .icon-button--outline.icon-button--danger {
    border-color: var(--cx-color-danger-600);
    color: var(--cx-color-danger);
  }

  .icon-button--outline.icon-button--danger:hover:not(.icon-button--disabled),
  .icon-button--outline.icon-button--danger.icon-button--focused:not(
      .icon-button--disabled
    ),
  .icon-button--outline.icon-button--danger.icon-button--checked:not(
      .icon-button--disabled
    ) {
    background-color: var(--cx-color-danger-500);
    color: var(--cx-color-neutral-0);
  }

  .icon-button--outline.icon-button--danger:active:not(.icon-button--disabled) {
    border-color: var(--cx-color-danger-700);
    background-color: var(--cx-color-danger-700);
    color: var(--cx-color-neutral-0);
  }

  /*
   * Tertiary buttons
   */

  .icon-button--tertiary {
    background-color: transparent;
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .icon-button--tertiary:hover:not(.icon-button--disabled),
  .icon-button--tertiary.icon-button--focused:not(.icon-button--disabled) {
    background-color: var(--cx-color-neutral-100);
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .icon-button--tertiary:focus-visible:not(.icon-button--disabled) {
    background-color: var(--cx-color-neutral-200);
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .icon-button--tertiary:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-neutral-300);
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .icon-button--circle {
    border-radius: var(--cx-border-radius-circle);
  }

  /*
   * Badges
   */

  .icon-button ::slotted(cx-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .icon-button--rtl ::slotted(cx-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host(
      [data-cx-button-group__button--first]:not(
          [data-cx-button-group__button--last]
        )
    )
    .icon-button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-cx-button-group__button--inner]) .icon-button {
    border-radius: 0;
  }

  :host(
      [data-cx-button-group__button--last]:not(
          [data-cx-button-group__button--first]
        )
    )
    .icon-button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host(
    [data-cx-button-group__button]:not([data-cx-button-group__button--first])
  ) {
    margin-inline-start: calc(-1 * var(--cx-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-cx-button-group__button]:not(
          [data-cx-button-group__button--first],
          [data-cx-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .icon-button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-cx-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-cx-button-group__button--focus]),
  :host([data-cx-button-group__button][checked]) {
    z-index: 2;
  }

  /*
   * Badges
   */

  .icon-button ::slotted(cx-badge) {
    position: absolute !important;
    top: 0 !important;
    left: unset !important;
    right: 0 !important;
    translate: 50% -50%;
    pointer-events: none;
  }

  .icon-button--rtl ::slotted(cx-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  .icon-button--small ::slotted(cx-badge) {
    --padding: 0.1em 0.32em;
    --font-size: var(--cx-font-size-x-small);
  }

  .icon-button--medium ::slotted(cx-badge) {
    --font-size: var(--cx-font-size-small);
  }

  .icon-button--large ::slotted(cx-badge) {
    --font-size: var(--cx-font-size-medium);
  }

  .icon-button--x-large ::slotted(cx-badge) {
    --font-size: var(--cx-font-size-medium);
  }
`;
var _ = Object.defineProperty, z = Object.getOwnPropertyDescriptor, n = (o, i, u, a) => {
  for (var e = a > 1 ? void 0 : a ? z(i, u) : i, l = o.length - 1, s; l >= 0; l--)
    (s = o[l]) && (e = (a ? s(i, u, e) : s(e)) || e);
  return a && e && _(i, u, e), e;
};
let t = class extends v {
  constructor() {
    super(...arguments), this.localize = new f(this), this.hasFocus = !1, this.variant = "outlined", this.buttonVariant = "text", this.label = "", this.disabled = !1, this.iconClass = "", this.size = "medium", this.outline = !1, this.circle = !1;
  }
  firstUpdated() {
    this.syncStyles(), new MutationObserver(() => this.syncStyles()).observe(this, {
      attributeFilter: ["style"],
      attributes: !0
    });
  }
  syncStyles() {
    const o = this.style.fontSize;
    o && this.button && (this.icon.style.setProperty("--font-size", o), this.button.style.fontSize = "inherit", this.style.fontSize = "");
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleClick(o) {
    this.disabled && (o.preventDefault(), o.stopPropagation());
  }
  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the icon button. */
  focus(o) {
    this.button.focus(o);
  }
  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }
  render() {
    const o = !!this.href, i = o ? b`a` : b`button`;
    return m`
      <${i}
        part="base"
        class=${h({
      "icon-button": !0,
      "icon-button--circle": this.circle,
      "icon-button--custom": !!this.src,
      "icon-button--danger": this.buttonVariant === "danger",
      "icon-button--default": this.buttonVariant === "default" || this.buttonVariant === "neutral",
      "icon-button--disabled": !o && this.disabled,
      "icon-button--focused": this.hasFocus,
      "icon-button--large": this.size === "large",
      "icon-button--medium": this.size === "medium",
      "icon-button--outline": this.outline,
      "icon-button--primary": this.buttonVariant === "primary",
      "icon-button--rtl": this.localize.dir() === "rtl",
      "icon-button--small": this.size === "small",
      "icon-button--success": this.buttonVariant === "success",
      "icon-button--tertiary": this.buttonVariant === "tertiary",
      "icon-button--text": this.buttonVariant === "text",
      "icon-button--warning": this.buttonVariant === "warning",
      "icon-button--x-large": this.size === "x-large"
    })}
        ?disabled=${c(o ? void 0 : this.disabled)}
        type=${c(o ? void 0 : "button")}
        href=${c(o ? this.href : void 0)}
        target=${c(o ? this.target : void 0)}
        download=${c(o ? this.download : void 0)}
        rel=${c(
      o && this.target ? "noreferrer noopener" : void 0
    )}
        role=${c(o ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-label="${this.label}"
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <cx-icon
          class="icon-button__icon"
          icon-class=${c(this.iconClass)}
          name=${c(this.name)}
          variant=${this.variant}
          src=${c(this.src)}
          aria-hidden="true"
          part="icon"
        ></cx-icon>
        <slot name="badge"></slot>
      </${i}>
    `;
  }
};
t.styles = [x, w];
t.dependencies = { "cx-icon": y };
n([
  d(".icon-button")
], t.prototype, "button", 2);
n([
  d(".icon-button__icon")
], t.prototype, "icon", 2);
n([
  p()
], t.prototype, "hasFocus", 2);
n([
  r()
], t.prototype, "name", 2);
n([
  r({ type: String })
], t.prototype, "variant", 2);
n([
  r({ attribute: "button-variant", reflect: !0, type: String })
], t.prototype, "buttonVariant", 2);
n([
  r()
], t.prototype, "src", 2);
n([
  r()
], t.prototype, "href", 2);
n([
  r()
], t.prototype, "target", 2);
n([
  r()
], t.prototype, "download", 2);
n([
  r()
], t.prototype, "label", 2);
n([
  r({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
n([
  r({ attribute: "icon-class", type: String })
], t.prototype, "iconClass", 2);
n([
  r({ reflect: !0 })
], t.prototype, "size", 2);
n([
  r({ reflect: !0, type: Boolean })
], t.prototype, "outline", 2);
n([
  r({ reflect: !0, type: Boolean })
], t.prototype, "circle", 2);
t = n([
  g("cx-icon-button")
], t);
export {
  t as default
};
