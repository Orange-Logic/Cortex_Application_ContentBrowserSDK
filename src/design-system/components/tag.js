import { C as m, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as v } from "../chunks/component.styles.BLcT4bOa.js";
import { i as p, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/class-map.Cn0czwWq.js";
import { L as x } from "../chunks/localize.D5Yoww6T.js";
import h from "./icon-button.js";
const b = p`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--cx-color-primary-50);
    border-color: var(--cx-color-primary-300);
    color: var(--cx-color-primary-800);
  }

  .tag--primary:active > cx-icon-button {
    color: var(--cx-color-primary-600);
  }

  .tag--success {
    background-color: var(--cx-color-success-50);
    border-color: var(--cx-color-success-200);
    color: var(--cx-color-success-800);
  }

  .tag--success:active > cx-icon-button {
    color: var(--cx-color-success-600);
  }

  .tag--neutral {
    background-color: var(--cx-color-neutral-50);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral-800);
  }

  .tag--neutral:active > cx-icon-button {
    color: var(--cx-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--cx-color-warning-50);
    border-color: var(--cx-color-warning-200);
    color: var(--cx-color-warning-800);
  }

  .tag--warning:active > cx-icon-button {
    color: var(--cx-color-warning-600);
  }

  .tag--danger {
    background-color: var(--cx-color-danger-50);
    border-color: var(--cx-color-danger-200);
    color: var(--cx-color-danger-800);
  }

  .tag--danger:active > cx-icon-button {
    color: var(--cx-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--cx-button-font-size-small);
    height: calc(var(--cx-input-height-small) * 0.8);
    line-height: calc(
      var(--cx-input-height-small) - var(--cx-input-border-width) * 2
    );
    border-radius: var(--cx-input-border-radius-small);
    padding: 0 var(--cx-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--cx-button-font-size-medium);
    height: calc(var(--cx-input-height-medium) * 0.8);
    line-height: calc(
      var(--cx-input-height-medium) - var(--cx-input-border-width) * 2
    );
    border-radius: var(--cx-input-border-radius-medium);
    padding: 0 var(--cx-spacing-small);
  }

  .tag--large {
    font-size: var(--cx-button-font-size-large);
    height: calc(var(--cx-input-height-large) * 0.8);
    line-height: calc(
      var(--cx-input-height-large) - var(--cx-input-border-width) * 2
    );
    border-radius: var(--cx-input-border-radius-large);
    padding: 0 var(--cx-spacing-medium);
  }

  .tag--small .tag__remove::part(icon) {
    --font-size: var(--cx-font-size-small);
  }

  .tag--medium .tag__remove::part(icon) {
    --font-size: var(--cx-font-size-medium);
  }

  .tag--large .tag__remove::part(icon) {
    --font-size: var(--cx-font-size-large);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--cx-border-radius-pill);
  }

  .tag--removable {
    padding-inline-end: 0;
  }
`;
var f = Object.defineProperty, z = Object.getOwnPropertyDescriptor, e = (s, t, c, o) => {
  for (var a = o > 1 ? void 0 : o ? z(t, c) : t, l = s.length - 1, n; l >= 0; l--)
    (n = s[l]) && (a = (o ? n(t, c, a) : n(a)) || a);
  return o && a && f(t, c, a), a;
};
let r = class extends m {
  constructor() {
    super(...arguments), this.localize = new x(this), this.variant = "neutral", this.size = "medium", this.pill = !1, this.removable = !1;
  }
  handleRemoveClick() {
    this.emit("cx-remove");
  }
  render() {
    return g`
      <span
        part="base"
        class=${d({
      tag: !0,
      "tag--danger": this.variant === "danger",
      "tag--large": this.size === "large",
      "tag--medium": this.size === "medium",
      "tag--neutral": this.variant === "neutral",
      // Modifiers
      "tag--pill": this.pill,
      "tag--primary": this.variant === "primary",
      "tag--removable": this.removable,
      // Sizes
      "tag--small": this.size === "small",
      "tag--success": this.variant === "success",
      "tag--text": this.variant === "text",
      "tag--warning": this.variant === "warning"
    })}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable ? g`
              <cx-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="close"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></cx-icon-button>
            ` : ""}
      </span>
    `;
  }
};
r.styles = [v, b];
r.dependencies = { "cx-icon-button": h };
e([
  i({ reflect: !0 })
], r.prototype, "variant", 2);
e([
  i({ reflect: !0 })
], r.prototype, "size", 2);
e([
  i({ reflect: !0, type: Boolean })
], r.prototype, "pill", 2);
e([
  i({ type: Boolean })
], r.prototype, "removable", 2);
r = e([
  u("cx-tag")
], r);
export {
  r as default
};
