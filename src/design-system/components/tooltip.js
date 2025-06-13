import { C as v, c as w } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { p as c, s as u, a as m } from "../chunks/animate.c3HW4nwn.js";
import { w as f } from "../chunks/event.mFzZi4sr.js";
import { w as l } from "../chunks/watch.ChG-_stu.js";
import { i as x, x as C } from "../chunks/lit-element.DRlPF2me.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as k } from "../chunks/class-map.Cn0czwWq.js";
import { a as g, g as y } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as T } from "../chunks/localize.D5Yoww6T.js";
import _ from "./popup.js";
const D = x`
  :host {
    --max-width: 40rem;
    --hide-delay: 0ms;
    --show-delay: 100ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--cx-tooltip-arrow-size);
    --arrow-color: var(--cx-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--cx-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip--disabled-hover::part(popup) {
    pointer-events: none;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--cx-tooltip-border-radius);
    background-color: var(--cx-tooltip-background-color);
    font-family: var(--cx-tooltip-font-family);
    font-size: var(--cx-tooltip-font-size);
    font-weight: var(--cx-tooltip-font-weight);
    line-height: var(--cx-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--cx-tooltip-color);
    padding: var(--cx-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    overflow-wrap: break-word;
  }
`;
var E = Object.defineProperty, O = Object.getOwnPropertyDescriptor, o = (e, s, p, r) => {
  for (var a = r > 1 ? void 0 : r ? O(s, p) : s, n = e.length - 1, h; n >= 0; n--)
    (h = e[n]) && (a = (r ? h(s, p, a) : h(a)) || a);
  return r && a && E(s, p, a), a;
};
let t = class extends v {
  constructor() {
    super(), this.localize = new T(this), this.content = "", this.placement = "top", this.disabled = !1, this.distance = 8, this.open = !1, this.skidding = 0, this.trigger = "hover focus", this.hoist = !1, this.hoverBridge = !0, this.handleBlur = () => {
      this.hasTrigger("focus") && this.hide();
    }, this.handleClick = () => {
      this.hasTrigger("click") && (this.open ? this.hide() : this.show());
    }, this.handleFocus = () => {
      this.hasTrigger("focus") && this.show();
    }, this.handleDocumentKeyDown = (e) => {
      e.key === "Escape" && (e.stopPropagation(), this.hide());
    }, this.handleMouseOver = () => {
      if (this.hasTrigger("hover")) {
        const e = c(
          getComputedStyle(this).getPropertyValue("--show-delay")
        );
        clearTimeout(this.hoverTimeout), this.hoverTimeout = window.setTimeout(() => this.show(), e);
      }
    }, this.handleMouseOut = () => {
      if (this.hasTrigger("hover")) {
        const e = c(
          getComputedStyle(this).getPropertyValue("--hide-delay")
        );
        clearTimeout(this.hoverTimeout), this.hoverTimeout = window.setTimeout(() => this.hide(), e);
      }
    }, this.addEventListener("blur", this.handleBlur, !0), this.addEventListener("focus", this.handleFocus, !0), this.addEventListener("click", this.handleClick), this.addEventListener("mouseover", this.handleMouseOver), this.addEventListener("mouseout", this.handleMouseOut);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this.closeWatcher) == null || e.destroy(), document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }
  firstUpdated() {
    this.body.hidden = !this.open, this.open && (this.popup.active = !0, this.popup.reposition());
  }
  hasTrigger(e) {
    return this.trigger.split(" ").includes(e);
  }
  async handleOpenChange() {
    var e, s;
    if (this.open) {
      if (this.disabled)
        return;
      this.emit("cx-show"), "CloseWatcher" in window ? ((e = this.closeWatcher) == null || e.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => {
        this.hide();
      }) : document.addEventListener("keydown", this.handleDocumentKeyDown), await u(this.body), this.body.hidden = !1, this.popup.active = !0;
      const { keyframes: p, options: r } = y(this, "tooltip.show", {
        dir: this.localize.dir()
      });
      await m(this.popup.popup, p, r), this.popup.reposition(), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), (s = this.closeWatcher) == null || s.destroy(), document.removeEventListener("keydown", this.handleDocumentKeyDown), await u(this.body);
      const { keyframes: p, options: r } = y(this, "tooltip.hide", {
        dir: this.localize.dir()
      });
      await m(this.popup.popup, p, r), this.popup.active = !1, this.body.hidden = !0, this.emit("cx-after-hide");
    }
  }
  async handleOptionsChange() {
    this.hasUpdated && (await this.updateComplete, this.popup.reposition());
  }
  handleDisabledChange() {
    this.disabled && this.open && this.hide();
  }
  /** Shows the tooltip. */
  async show() {
    if (!this.open)
      return this.open = !0, f(this, "cx-after-show");
  }
  /** Hides the tooltip */
  async hide() {
    if (this.open)
      return this.open = !1, f(this, "cx-after-hide");
  }
  //
  // NOTE: Tooltip is a bit unique in that we're using aria-live instead of aria-labelledby to trick screen readers into
  // announcing the content. It works really well, but it violates an accessibility rule. We're also adding the
  // aria-describedby attribute to a slot, which is required by <cx-popup> to correctly locate the first assigned
  // element, otherwise positioning is incorrect.
  //
  render() {
    return C`
      <cx-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${k({
      tooltip: !0,
      "tooltip--disabled-hover": !this.hoverBridge,
      "tooltip--open": this.open
    })}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? "fixed" : "absolute"}
        flip
        shift
        arrow
        .hoverBridge=${this.hoverBridge}
      >
        <slot slot="anchor" aria-describedby="tooltip"></slot>
        <div
          part="body"
          id="tooltip"
          class="tooltip__body"
          role="tooltip"
          aria-live=${this.open ? "polite" : "off"}
        >
          <slot name="content">${this.content}</slot>
        </div>
      </cx-popup>
    `;
  }
};
t.styles = [b, D];
t.dependencies = { "cx-popup": _ };
o([
  d("slot:not([name])")
], t.prototype, "defaultSlot", 2);
o([
  d(".tooltip__body")
], t.prototype, "body", 2);
o([
  d("cx-popup")
], t.prototype, "popup", 2);
o([
  i()
], t.prototype, "content", 2);
o([
  i()
], t.prototype, "placement", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
o([
  i({ type: Number })
], t.prototype, "distance", 2);
o([
  i({ reflect: !0, type: Boolean })
], t.prototype, "open", 2);
o([
  i({ type: Number })
], t.prototype, "skidding", 2);
o([
  i()
], t.prototype, "trigger", 2);
o([
  i({ type: Boolean })
], t.prototype, "hoist", 2);
o([
  i({ type: Boolean })
], t.prototype, "hoverBridge", 2);
o([
  l("open", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleOpenChange", 1);
o([
  l(["content", "distance", "hoist", "placement", "skidding"])
], t.prototype, "handleOptionsChange", 1);
o([
  l("disabled")
], t.prototype, "handleDisabledChange", 1);
t = o([
  w("cx-tooltip")
], t);
g("tooltip.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
g("tooltip.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 100, easing: "ease" }
});
export {
  t as default
};
