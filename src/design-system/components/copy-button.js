import { C as h, c as y } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { H as f } from "../chunks/slot.DJLm4Dig.js";
import { i as x, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as u } from "../chunks/state.-o_YRGMi.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { a as d, g as b } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as _ } from "../chunks/localize.D5Yoww6T.js";
import w from "./icon.js";
import z from "./tooltip.js";
const C = x`
  :host {
    --error-color: var(--cx-color-danger-600);
    --success-color: var(--cx-color-success-600);

    --background-color: light-dark(
      var(--cx-color-primary),
      var(--cx-color-primary)
    );
    --color: light-dark(
      var(--cx-color-neutral-0),
      var(--cx-color-neutral-1000)
    );
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
    line-height: normal;
  }

  .copy-button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--cx-input-border-width);
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-font-weight-regular);
    text-decoration: none;
    text-transform: var(--cx-button-text-transform, none);
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--cx-transition-x-fast) background-color,
      var(--cx-transition-x-fast) color,
      var(--cx-transition-x-fast) border,
      var(--cx-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .copy-button::-moz-focus-inner {
    border: 0;
  }

  .copy-button:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .copy-button {
    background-color: transparent;
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .copy-button.copy-button--has-label:hover:not(.copy-button--disabled),
  .copy-button.copy-button--has-label.copy-button--focused:not(
      .copy-button--disabled
    ) {
    background-color: var(--cx-color-neutral-100);
    border-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .copy-button.copy-button--has-label:active:not(.copy-button--disabled) {
    background-color: var(--cx-color-neutral-200);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral);
  }

  .copy-button--disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .copy-button--disabled * {
    pointer-events: none;
  }

  /* make icon slots overlapped each other using grid */
  .copy-button__icon-wrapper {
    display: inline-grid;
    grid-template-columns: 1fr;
    background: none;
    border: none;
  }

  .copy-button__icon-wrapper slot {
    grid-row-start: 1;
    grid-column-start: 1;
    display: inline-flex;
  }

  .copy-button__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .copy-button--copy-success .copy-button__icon {
    color: var(--success-color);
  }

  .copy-button--copy-error .copy-button__icon {
    color: var(--error-color);
  }

  .copy-button__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /*
   * Size modifiers
   */

  .copy-button--small {
    height: auto;
    min-height: var(--cx-input-height-small);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-small);
  }

  .copy-button--small .copy-button__icon {
    --font-size: var(--cx-font-size-medium);
  }

  .copy-button--medium {
    height: auto;
    min-height: var(--cx-input-height-medium);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-medium);
  }

  .copy-button--large {
    height: auto;
    min-height: var(--cx-input-height-large);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-large);
  }

  .copy-button--x-large {
    height: auto;
    min-height: var(--cx-input-height-x-large);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-large);
  }

  /*
   * Button spacing
   */

  .copy-button--small {
    padding: 0 var(--cx-spacing-x-small);
  }

  .copy-button--medium {
    padding: 0 var(--cx-spacing-medium);
  }

  .copy-button--large {
    padding: 0 var(--cx-spacing-large);
  }

  .copy-button--x-large {
    padding: 0 var(--cx-spacing-x-large);
  }

  .copy-button--has-label.copy-button--small .copy-button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .copy-button--has-label.copy-button--medium .copy-button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .copy-button--has-label.copy-button--large .copy-button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .copy-button--has-label.copy-button--x-large .copy-button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }
`;
var k = Object.defineProperty, L = Object.getOwnPropertyDescriptor, o = (e, c, l, n) => {
  for (var i = n > 1 ? void 0 : n ? L(c, l) : c, r = e.length - 1, s; r >= 0; r--)
    (s = e[r]) && (i = (n ? s(c, l, i) : s(i)) || i);
  return n && i && k(c, l, i), i;
};
let t = class extends h {
  constructor() {
    super(...arguments), this.localize = new _(this), this.hasSlotController = new f(this, "[default]"), this.hasFocus = !1, this.isCopying = !1, this.status = "rest", this.value = "", this.size = "medium", this.from = "", this.disabled = !1, this.copyLabel = "", this.successLabel = "", this.errorLabel = "", this.feedbackDuration = 1e3, this.tooltipPlacement = "top", this.hoist = !1, this.getValue = void 0;
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  async handleCopy() {
    if (this.disabled || this.isCopying)
      return;
    this.isCopying = !0;
    let e = this.value;
    if (this.from) {
      const c = this.getRootNode(), l = this.from.includes("."), n = this.from.includes("[") && this.from.includes("]");
      let i = this.from, r = "";
      l ? [i, r] = this.from.trim().split(".") : n && ([i, r] = this.from.trim().replace(/\]$/, "").split("["));
      const s = "getElementById" in c ? c.getElementById(i) : null;
      s ? n ? e = s.getAttribute(r) || "" : l ? e = s[r] || "" : e = s.textContent || "" : (this.showStatus("error"), this.emit("cx-error"));
    }
    if (this.getValue && (e = this.getValue()), !e)
      this.showStatus("error"), this.emit("cx-error");
    else
      try {
        await navigator.clipboard.writeText(e), this.showStatus("success"), this.emit("cx-copy", {
          detail: {
            value: e
          }
        });
      } catch {
        this.showStatus("error"), this.emit("cx-error");
      }
  }
  async showStatus(e) {
    const c = this.copyLabel || this.localize.term("copy"), l = this.successLabel || this.localize.term("copied"), n = this.errorLabel || this.localize.term("error"), i = e === "success" ? this.successIcon : this.errorIcon, r = b(this, "copy.in", { dir: "ltr" }), s = b(this, "copy.out", { dir: "ltr" });
    this.tooltip.content = e === "success" ? l : n, await this.copyIcon.animate(s.keyframes, s.options).finished, this.copyIcon.hidden = !0, this.status = e, i.hidden = !1, await i.animate(r.keyframes, r.options).finished, setTimeout(async () => {
      await i.animate(s.keyframes, s.options).finished, i.hidden = !0, this.status = "rest", this.copyIcon.hidden = !1, await this.copyIcon.animate(
        r.keyframes,
        r.options
      ).finished, this.tooltip.content = c, this.isCopying = !1;
    }, this.feedbackDuration);
  }
  render() {
    const e = this.copyLabel || this.localize.term("copy");
    return g`
      <cx-tooltip
        content=${e}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class=${v({
      "copy-button": !0,
      "copy-button--copy-error": this.status === "error",
      "copy-button--copy-success": this.status === "success",
      "copy-button--disabled": this.disabled,
      "copy-button--focused": this.hasFocus,
      "copy-button--has-label": this.hasSlotController.test("[default]"),
      "copy-button--large": this.size === "large",
      "copy-button--medium": this.size === "medium",
      "copy-button--small": this.size === "small",
      "copy-button--x-large": this.size === "x-large"
    })}
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        >
          <div part="icon-wrapper" class="copy-button__icon-wrapper">
            <slot part="copy-icon" name="copy-icon" class="copy-button__icon">
              <cx-icon name="content_copy"></cx-icon>
            </slot>
            <slot
              part="success-icon"
              name="success-icon"
              hidden
              class="copy-button__icon"
            >
              <cx-icon name="check"></cx-icon>
            </slot>
            <slot
              part="error-icon"
              name="error-icon"
              hidden
              class="copy-button__icon"
            >
              <cx-icon name="close"></cx-icon>
            </slot>
          </div>
          <slot part="label" class="copy-button__label"></slot>
        </button>
      </cx-tooltip>
    `;
  }
};
t.styles = [m, C];
t.dependencies = {
  "cx-icon": w,
  "cx-tooltip": z
};
o([
  p('slot[name="copy-icon"]')
], t.prototype, "copyIcon", 2);
o([
  p('slot[name="success-icon"]')
], t.prototype, "successIcon", 2);
o([
  p('slot[name="error-icon"]')
], t.prototype, "errorIcon", 2);
o([
  p("cx-tooltip")
], t.prototype, "tooltip", 2);
o([
  u()
], t.prototype, "hasFocus", 2);
o([
  u()
], t.prototype, "isCopying", 2);
o([
  u()
], t.prototype, "status", 2);
o([
  a()
], t.prototype, "value", 2);
o([
  a({ reflect: !0 })
], t.prototype, "size", 2);
o([
  a()
], t.prototype, "from", 2);
o([
  a({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
o([
  a({ attribute: "copy-label" })
], t.prototype, "copyLabel", 2);
o([
  a({ attribute: "success-label" })
], t.prototype, "successLabel", 2);
o([
  a({ attribute: "error-label" })
], t.prototype, "errorLabel", 2);
o([
  a({ attribute: "feedback-duration", type: Number })
], t.prototype, "feedbackDuration", 2);
o([
  a({ attribute: "tooltip-placement" })
], t.prototype, "tooltipPlacement", 2);
o([
  a({ type: Boolean })
], t.prototype, "hoist", 2);
o([
  a({ attribute: !1, type: Function })
], t.prototype, "getValue", 2);
t = o([
  y("cx-copy-button")
], t);
d("copy.in", {
  keyframes: [
    { opacity: ".25", scale: ".25" },
    { opacity: "1", scale: "1" }
  ],
  options: { duration: 100 }
});
d("copy.out", {
  keyframes: [
    { opacity: "1", scale: "1" },
    { opacity: "0", scale: ".25" }
  ],
  options: { duration: 100 }
});
export {
  t as default
};
