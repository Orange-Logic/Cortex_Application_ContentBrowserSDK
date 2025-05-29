import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { x } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as u } from "../chunks/state.-o_YRGMi.js";
import { e as h } from "../chunks/query.BNveAlQo.js";
import { e as _ } from "../chunks/class-map.Cn0czwWq.js";
import { g as y, a as d } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as w } from "../chunks/localize.DV9I313e.js";
import L from "./icon.component.js";
import g from "./tooltip.component.js";
import k from "./copy-button.styles.js";
var I = Object.defineProperty, e = (m, o, n, p) => {
  for (var r = void 0, s = m.length - 1, i; s >= 0; s--)
    (i = m[s]) && (r = i(o, n, r) || r);
  return r && I(o, n, r), r;
};
const l = class l extends f {
  constructor() {
    super(...arguments), this.localize = new w(this), this.isCopying = !1, this.status = "rest", this.value = "", this.from = "", this.disabled = !1, this.copyLabel = "", this.successLabel = "", this.errorLabel = "", this.feedbackDuration = 1e3, this.tooltipPlacement = "top", this.hoist = !1;
  }
  async handleCopy() {
    if (this.disabled || this.isCopying)
      return;
    this.isCopying = !0;
    let o = this.value;
    if (this.from) {
      const n = this.getRootNode(), p = this.from.includes("."), r = this.from.includes("[") && this.from.includes("]");
      let s = this.from, i = "";
      p ? [s, i] = this.from.trim().split(".") : r && ([s, i] = this.from.trim().replace(/\]$/, "").split("["));
      const c = "getElementById" in n ? n.getElementById(s) : null;
      c ? r ? o = c.getAttribute(i) || "" : p ? o = c[i] || "" : o = c.textContent || "" : (this.showStatus("error"), this.emit("cx-error"));
    }
    if (!o)
      this.showStatus("error"), this.emit("cx-error");
    else
      try {
        await navigator.clipboard.writeText(o), this.showStatus("success"), this.emit("cx-copy", {
          detail: {
            value: o
          }
        });
      } catch {
        this.showStatus("error"), this.emit("cx-error");
      }
  }
  async showStatus(o) {
    const n = this.copyLabel || this.localize.term("copy"), p = this.successLabel || this.localize.term("copied"), r = this.errorLabel || this.localize.term("error"), s = o === "success" ? this.successIcon : this.errorIcon, i = y(this, "copy.in", { dir: "ltr" }), c = y(this, "copy.out", { dir: "ltr" });
    this.tooltip.content = o === "success" ? p : r, await this.copyIcon.animate(c.keyframes, c.options).finished, this.copyIcon.hidden = !0, this.status = o, s.hidden = !1, await s.animate(i.keyframes, i.options).finished, setTimeout(async () => {
      await s.animate(c.keyframes, c.options).finished, s.hidden = !0, this.status = "rest", this.copyIcon.hidden = !1, await this.copyIcon.animate(
        i.keyframes,
        i.options
      ).finished, this.tooltip.content = n, this.isCopying = !1;
    }, this.feedbackDuration);
  }
  render() {
    const o = this.copyLabel || this.localize.term("copy");
    return x`
      <cx-tooltip
        class=${_({
      "copy-button": !0,
      "copy-button--error": this.status === "error",
      "copy-button--success": this.status === "success"
    })}
        content=${o}
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
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <cx-icon name="content_copy"></cx-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <cx-icon name="check"></cx-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <cx-icon name="close"></cx-icon>
          </slot>
        </button>
      </cx-tooltip>
    `;
  }
};
l.styles = [b, k], l.dependencies = {
  "cx-icon": L,
  "cx-tooltip": g
};
let t = l;
e([
  h('slot[name="copy-icon"]')
], t.prototype, "copyIcon");
e([
  h('slot[name="success-icon"]')
], t.prototype, "successIcon");
e([
  h('slot[name="error-icon"]')
], t.prototype, "errorIcon");
e([
  h("cx-tooltip")
], t.prototype, "tooltip");
e([
  u()
], t.prototype, "isCopying");
e([
  u()
], t.prototype, "status");
e([
  a()
], t.prototype, "value");
e([
  a()
], t.prototype, "from");
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "disabled");
e([
  a({ attribute: "copy-label" })
], t.prototype, "copyLabel");
e([
  a({ attribute: "success-label" })
], t.prototype, "successLabel");
e([
  a({ attribute: "error-label" })
], t.prototype, "errorLabel");
e([
  a({ attribute: "feedback-duration", type: Number })
], t.prototype, "feedbackDuration");
e([
  a({ attribute: "tooltip-placement" })
], t.prototype, "tooltipPlacement");
e([
  a({ type: Boolean })
], t.prototype, "hoist");
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
