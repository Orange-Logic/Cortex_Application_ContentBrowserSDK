import { C as w } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { p as u, s as m, a as y } from "../chunks/animate.c3HW4nwn.js";
import { w as f } from "../chunks/event.mFzZi4sr.js";
import { w as d } from "../chunks/watch.ChG-_stu.js";
import { x as C } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { e as l } from "../chunks/query.BNveAlQo.js";
import { e as k } from "../chunks/class-map.Cn0czwWq.js";
import { g, a as v } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as x } from "../chunks/localize.DV9I313e.js";
import D from "./popup.component.js";
import O from "./tooltip.styles.js";
var T = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, i = (c, t, h, r) => {
  for (var o = r > 1 ? void 0 : r ? _(t, h) : t, p = c.length - 1, n; p >= 0; p--)
    (n = c[p]) && (o = (r ? n(t, h, o) : n(o)) || o);
  return r && o && T(t, h, o), o;
};
const a = class a extends w {
  constructor() {
    super(), this.localize = new x(this), this.content = "", this.placement = "top", this.disabled = !1, this.distance = 8, this.open = !1, this.skidding = 0, this.trigger = "hover focus", this.hoist = !1, this.hoverBridge = !0, this.handleBlur = () => {
      this.hasTrigger("focus") && this.hide();
    }, this.handleClick = () => {
      this.hasTrigger("click") && (this.open ? this.hide() : this.show());
    }, this.handleFocus = () => {
      this.hasTrigger("focus") && this.show();
    }, this.handleDocumentKeyDown = (t) => {
      t.key === "Escape" && (t.stopPropagation(), this.hide());
    }, this.handleMouseOver = () => {
      if (this.hasTrigger("hover")) {
        const t = u(
          getComputedStyle(this).getPropertyValue("--show-delay")
        );
        clearTimeout(this.hoverTimeout), this.hoverTimeout = window.setTimeout(() => this.show(), t);
      }
    }, this.handleMouseOut = () => {
      if (this.hasTrigger("hover")) {
        const t = u(
          getComputedStyle(this).getPropertyValue("--hide-delay")
        );
        clearTimeout(this.hoverTimeout), this.hoverTimeout = window.setTimeout(() => this.hide(), t);
      }
    }, this.addEventListener("blur", this.handleBlur, !0), this.addEventListener("focus", this.handleFocus, !0), this.addEventListener("click", this.handleClick), this.addEventListener("mouseover", this.handleMouseOver), this.addEventListener("mouseout", this.handleMouseOut);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this.closeWatcher) == null || t.destroy(), document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }
  firstUpdated() {
    this.body.hidden = !this.open, this.open && (this.popup.active = !0, this.popup.reposition());
  }
  hasTrigger(t) {
    return this.trigger.split(" ").includes(t);
  }
  async handleOpenChange() {
    var t, h;
    if (this.open) {
      if (this.disabled)
        return;
      this.emit("cx-show"), "CloseWatcher" in window ? ((t = this.closeWatcher) == null || t.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => {
        this.hide();
      }) : document.addEventListener("keydown", this.handleDocumentKeyDown), await m(this.body), this.body.hidden = !1, this.popup.active = !0;
      const { keyframes: r, options: o } = g(this, "tooltip.show", {
        dir: this.localize.dir()
      });
      await y(this.popup.popup, r, o), this.popup.reposition(), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), (h = this.closeWatcher) == null || h.destroy(), document.removeEventListener("keydown", this.handleDocumentKeyDown), await m(this.body);
      const { keyframes: r, options: o } = g(this, "tooltip.hide", {
        dir: this.localize.dir()
      });
      await y(this.popup.popup, r, o), this.popup.active = !1, this.body.hidden = !0, this.emit("cx-after-hide");
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
a.styles = [b, O], a.dependencies = { "cx-popup": D };
let e = a;
i([
  l("slot:not([name])")
], e.prototype, "defaultSlot", 2);
i([
  l(".tooltip__body")
], e.prototype, "body", 2);
i([
  l("cx-popup")
], e.prototype, "popup", 2);
i([
  s()
], e.prototype, "content", 2);
i([
  s()
], e.prototype, "placement", 2);
i([
  s({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
i([
  s({ type: Number })
], e.prototype, "distance", 2);
i([
  s({ reflect: !0, type: Boolean })
], e.prototype, "open", 2);
i([
  s({ type: Number })
], e.prototype, "skidding", 2);
i([
  s()
], e.prototype, "trigger", 2);
i([
  s({ type: Boolean })
], e.prototype, "hoist", 2);
i([
  s({ type: Boolean })
], e.prototype, "hoverBridge", 2);
i([
  d("open", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleOpenChange", 1);
i([
  d(["content", "distance", "hoist", "placement", "skidding"])
], e.prototype, "handleOptionsChange", 1);
i([
  d("disabled")
], e.prototype, "handleDisabledChange", 1);
v("tooltip.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
v("tooltip.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 100, easing: "ease" }
});
export {
  e as default
};
