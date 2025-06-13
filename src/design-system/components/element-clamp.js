import { C as b, c as w } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { s as d, a as c, b as m } from "../chunks/animate.c3HW4nwn.js";
import { w as u } from "../chunks/event.mFzZi4sr.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { i as v, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as C } from "../chunks/state.-o_YRGMi.js";
import { e as k } from "../chunks/query.BNveAlQo.js";
import { e as E } from "../chunks/class-map.Cn0czwWq.js";
import { s as p, g as y } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as H } from "../chunks/localize.D5Yoww6T.js";
import B from "./button.js";
const z = v`
  :host {
    display: block;
    overflow: hidden;
    --toggler-color: var(--cx-color-primary);
  }

  .element-clamp {
    overflow-anchor: none;
  }

  .element-clamp--disabled {
    opacity: 0.5;
  }

  .element-clamp-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--cx-transition-medium) rotate ease;
  }

  .details--open .element-clamp-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .element-clamp-icon {
    rotate: -90deg;
  }

  .element-clamp--open slot[name='expand-icon'],
  .element-clamp:not(.element-clamp--open) slot[name='collapse-icon'] {
    display: none;
  }

  .element-clamp__content {
    display: block;
    overflow: hidden;
  }

  .toggler {
    display: block;
    margin-top: var(--cx-spacing-2x-small);
  }

  .toggler::part(base) {
    color: var(--toggler-color);
    font-weight: var(--cx-font-weight-medium);
    text-transform: none;
    width: auto;
  }

  .toggler::part(label) {
    padding-left: 0;
  }
`;
var O = Object.defineProperty, T = Object.getOwnPropertyDescriptor, s = (e, n, o, r) => {
  for (var i = r > 1 ? void 0 : r ? T(n, o) : n, h = e.length - 1, l; h >= 0; h--)
    (l = e[h]) && (i = (r ? l(n, o, i) : l(i)) || i);
  return r && i && O(n, o, i), i;
};
let t = class extends b {
  constructor() {
    super(...arguments), this.localize = new H(this), this.open = !1, this.disabled = !1, this.elements = 0, this.root = "", this.animation = !1, this.showMore = !1, this.showMoreText = "View more...", this.showLessText = "View less...", this.rerenderEvent = "", this.showButton = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => {
      if (!this.body)
        return;
      const e = this.getCollapsedHeight();
      this.body.style.height = this.open ? "auto" : e >= 0 ? e + "px" : "auto", this.animation && (p(this.body, "element-clamp.show", {
        keyframes: [{ height: e }, { height: "auto" }],
        options: { duration: 250, easing: "linear" }
      }), p(this.body, "element-clamp.hide", {
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
  replaceRootId(e, n) {
    if (!e)
      return "";
    const o = e.split(":");
    return o.pop(), o.push(n), o.join(":");
  }
  getCollapsedHeight() {
    const e = this.shadowRoot.querySelector("slot");
    if (!e)
      return -1;
    const n = e.assignedNodes({ flatten: !1 }), o = this.getAttribute("id") ?? "", r = this.root && o ? this.querySelector(`[id="${this.replaceRootId(o, this.root)}"]`) : null;
    let i = [], h = -1;
    return r ? i = Array.from(r.children).filter(
      (l) => l.nodeType !== 3
    ) : i = n.filter((l) => l.nodeType !== 3), i.length >= this.elements && this.elements > 0 && (h = Math.abs(
      i[0].getBoundingClientRect().top - i[this.elements - 1].getBoundingClientRect().bottom
    )), this.showButton = i.length > this.elements && this.showMore, h;
  }
  async handleChange() {
    if (!this.body)
      return;
    const e = this.getCollapsedHeight();
    this.body.style.height = this.open ? "auto" : e >= 0 ? e + "px" : "auto", this.animation && (p(this.body, "element-clamp.show", {
      keyframes: [{ height: e }, { height: "auto" }],
      options: { duration: 250, easing: "linear" }
    }), p(this.body, "element-clamp.hide", {
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
        await d(this.body);
        const { keyframes: n, options: o } = y(
          this.body,
          "element-clamp.show",
          {
            dir: this.localize.dir()
          }
        );
        await c(
          this.body,
          m(n, this.body.scrollHeight),
          o
        );
      }
      this.body.style.height = "auto", this.emit("cx-after-show");
    } else {
      if (this.emit("cx-hide", { cancelable: !0 }).defaultPrevented) {
        this.open = !0;
        return;
      }
      if (this.animation) {
        await d(this.body);
        const { keyframes: o, options: r } = y(
          this.body,
          "element-clamp.hide",
          {
            dir: this.localize.dir()
          }
        );
        await c(
          this.body,
          m(o, this.body.scrollHeight),
          r
        );
      }
      const n = this.getCollapsedHeight();
      this.body.style.height = n >= 0 ? n + "px" : "auto", this.emit("cx-after-hide");
    }
  }
  /** Shows the details. */
  async show() {
    if (!(this.open || this.disabled))
      return this.open = !0, u(this, "cx-after-show");
  }
  /** Hides the details */
  async hide() {
    if (!(!this.open || this.disabled))
      return this.open = !1, u(this, "cx-after-hide");
  }
  render() {
    const e = this.localize.dir() === "rtl";
    return f`
      <div
        part="base"
        class=${E({
      "element-clamp": !0,
      "element-clamp--disabled": this.disabled,
      "element-clamp--open": this.open,
      "element-clamp--rtl": e
    })}
        @click=${this.showMore ? void 0 : this.handleClick}
      >
        <slot part="content" id="content" class="element-clamp__content"></slot>
        ${this.showButton ? f`<cx-button
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
t.styles = [x, z];
t.dependencies = {
  "cx-button": B
};
s([
  k('[part="content"]')
], t.prototype, "body", 2);
s([
  a({ reflect: !0, type: Boolean })
], t.prototype, "open", 2);
s([
  a({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
s([
  a({ reflect: !0, type: Number })
], t.prototype, "elements", 2);
s([
  a({ attribute: "root-element", type: String })
], t.prototype, "root", 2);
s([
  a({ type: Boolean })
], t.prototype, "animation", 2);
s([
  a({ attribute: "show-more", reflect: !0, type: Boolean })
], t.prototype, "showMore", 2);
s([
  a({ attribute: "show-more-text", type: String })
], t.prototype, "showMoreText", 2);
s([
  a({ attribute: "show-less-text", type: String })
], t.prototype, "showLessText", 2);
s([
  a({
    attribute: "rerender-event",
    type: String
  })
], t.prototype, "rerenderEvent", 2);
s([
  C()
], t.prototype, "showButton", 2);
s([
  g(["elements", "animation"], { waitUntilFirstUpdate: !0 })
], t.prototype, "handleChange", 1);
s([
  g("open", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleOpenChange", 1);
t = s([
  w("cx-element-clamp")
], t);
export {
  t as default
};
