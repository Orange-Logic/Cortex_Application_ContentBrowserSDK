import { C as v } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { s as m, a as u, b as f } from "../chunks/animate.c3HW4nwn.js";
import { w as y } from "../chunks/event.mFzZi4sr.js";
import { w } from "../chunks/watch.ChG-_stu.js";
import { x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as h } from "../chunks/property.CtZ87in4.js";
import { r as C } from "../chunks/state.-o_YRGMi.js";
import { e as H } from "../chunks/query.BNveAlQo.js";
import { e as B } from "../chunks/class-map.Cn0czwWq.js";
import { s as l, g } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as k } from "../chunks/localize.DV9I313e.js";
import z from "./button.component.js";
import O from "./element-clamp.styles.js";
var T = Object.defineProperty, S = Object.getOwnPropertyDescriptor, s = (c, e, o, t) => {
  for (var r = t > 1 ? void 0 : t ? S(e, o) : e, n = c.length - 1, a; n >= 0; n--)
    (a = c[n]) && (r = (t ? a(e, o, r) : a(r)) || r);
  return t && r && T(e, o, r), r;
};
const d = class d extends v {
  constructor() {
    super(...arguments), this.localize = new k(this), this.open = !1, this.disabled = !1, this.elements = 0, this.root = "", this.animation = !1, this.showMore = !1, this.showMoreText = "View more...", this.showLessText = "View less...", this.rerenderEvent = "", this.showButton = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => {
      if (!this.body)
        return;
      const e = this.getCollapsedHeight();
      this.body.style.height = this.open ? "auto" : e >= 0 ? e + "px" : "auto", this.animation && (l(this.body, "element-clamp.show", {
        keyframes: [{ height: e }, { height: "auto" }],
        options: { duration: 250, easing: "linear" }
      }), l(this.body, "element-clamp.hide", {
        keyframes: [{ height: "auto" }, { height: e }],
        options: { duration: 250, easing: "linear" }
      }));
    }), this.rerenderEvent && document.addEventListener(
      this.rerenderEvent,
      this.handleChange.bind(this)
    ), this.updateComplete.then(() => {
      this.resizeObserver.observe(this.body);
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), this.body && ((e = this.resizeObserver) == null || e.unobserve(this.body)), this.rerenderEvent && document.removeEventListener(
      this.rerenderEvent,
      this.handleChange.bind(this)
    );
  }
  handleClick(e) {
    e.preventDefault(), this.disabled || (this.open ? this.hide() : this.show());
  }
  replaceRootId(e, o) {
    if (!e)
      return "";
    const t = e.split(":");
    return t.pop(), t.push(o), t.join(":");
  }
  getCollapsedHeight() {
    const e = this.shadowRoot.querySelector("slot");
    if (!e)
      return -1;
    const o = e.assignedNodes({ flatten: !1 }), t = this.getAttribute("id") ?? "", r = this.root && t ? this.querySelector(`[id="${this.replaceRootId(t, this.root)}"]`) : null;
    let n = [], a = -1;
    return r ? n = Array.from(r.children).filter(
      (p) => p.nodeType !== 3
    ) : n = o.filter((p) => p.nodeType !== 3), n.length >= this.elements && this.elements > 0 && (a = Math.abs(
      n[0].getBoundingClientRect().top - n[this.elements - 1].getBoundingClientRect().bottom
    )), this.showButton = n.length > this.elements && this.showMore, a;
  }
  async handleChange() {
    if (!this.body)
      return;
    const e = this.getCollapsedHeight();
    this.body.style.height = this.open ? "auto" : e >= 0 ? e + "px" : "auto", this.animation && (l(this.body, "element-clamp.show", {
      keyframes: [{ height: e }, { height: "auto" }],
      options: { duration: 250, easing: "linear" }
    }), l(this.body, "element-clamp.hide", {
      keyframes: [{ height: "auto" }, { height: e }],
      options: { duration: 250, easing: "linear" }
    }));
  }
  async handleOpenChange() {
    if (this.open) {
      if (this.emit("cx-show", { cancelable: !0 }).defaultPrevented) {
        this.open = !1;
        return;
      }
      if (this.animation) {
        await m(this.body);
        const { keyframes: o, options: t } = g(
          this.body,
          "element-clamp.show",
          {
            dir: this.localize.dir()
          }
        );
        await u(
          this.body,
          f(o, this.body.scrollHeight),
          t
        );
      }
      this.body.style.height = "auto", this.emit("cx-after-show");
    } else {
      if (this.emit("cx-hide", { cancelable: !0 }).defaultPrevented) {
        this.open = !0;
        return;
      }
      if (this.animation) {
        await m(this.body);
        const { keyframes: t, options: r } = g(
          this.body,
          "element-clamp.hide",
          {
            dir: this.localize.dir()
          }
        );
        await u(
          this.body,
          f(t, this.body.scrollHeight),
          r
        );
      }
      const o = this.getCollapsedHeight();
      this.body.style.height = o >= 0 ? o + "px" : "auto", this.emit("cx-after-hide");
    }
  }
  /** Shows the details. */
  async show() {
    if (!(this.open || this.disabled))
      return this.open = !0, y(this, "cx-after-show");
  }
  /** Hides the details */
  async hide() {
    if (!(!this.open || this.disabled))
      return this.open = !1, y(this, "cx-after-hide");
  }
  render() {
    const e = this.localize.dir() === "rtl";
    return b`
      <div
        part="base"
        class=${B({
      "element-clamp": !0,
      "element-clamp--disabled": this.disabled,
      "element-clamp--open": this.open,
      "element-clamp--rtl": e
    })}
        @click=${this.showMore ? void 0 : this.handleClick}
      >
        <slot part="content" id="content" class="element-clamp__content"></slot>
        ${this.showButton ? b`<cx-button
              part="toggler"
              size="small"
              variant="text"
              class="toggler"
              title=""
              @click=${this.handleClick}
            >
              ${this.open ? this.showLessText : this.showMoreText}
            </cx-button>` : ""}
      </div>
    `;
  }
};
d.styles = [x, O], d.dependencies = {
  "cx-button": z
};
let i = d;
s([
  H('[part="content"]')
], i.prototype, "body", 2);
s([
  h({ reflect: !0, type: Boolean })
], i.prototype, "open", 2);
s([
  h({ reflect: !0, type: Boolean })
], i.prototype, "disabled", 2);
s([
  h({ reflect: !0, type: Number })
], i.prototype, "elements", 2);
s([
  h({ attribute: "root-element", type: String })
], i.prototype, "root", 2);
s([
  h({ type: Boolean })
], i.prototype, "animation", 2);
s([
  h({ attribute: "show-more", reflect: !0, type: Boolean })
], i.prototype, "showMore", 2);
s([
  h({ attribute: "show-more-text", type: String })
], i.prototype, "showMoreText", 2);
s([
  h({ attribute: "show-less-text", type: String })
], i.prototype, "showLessText", 2);
s([
  h({
    attribute: "rerender-event",
    type: String
  })
], i.prototype, "rerenderEvent", 2);
s([
  C()
], i.prototype, "showButton", 2);
s([
  w(["elements", "animation"], { waitUntilFirstUpdate: !0 })
], i.prototype, "handleChange", 1);
s([
  w("open", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleOpenChange", 1);
export {
  i as default
};
