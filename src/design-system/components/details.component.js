import { C as w } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as _ } from "../chunks/component.styles.BLcT4bOa.js";
import { s as c, a as m, b as f } from "../chunks/animate.c3HW4nwn.js";
import { w as y } from "../chunks/event.mFzZi4sr.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { x as v } from "../chunks/lit-element.DRlPF2me.js";
import { n as d } from "../chunks/property.CtZ87in4.js";
import { e as l } from "../chunks/query.BNveAlQo.js";
import { e as x } from "../chunks/class-map.Cn0czwWq.js";
import { g as u, a as b } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as k } from "../chunks/localize.DV9I313e.js";
import O from "./icon.component.js";
import $ from "./details.styles.js";
var A = Object.defineProperty, C = Object.getOwnPropertyDescriptor, a = (p, e, t, i) => {
  for (var o = i > 1 ? void 0 : i ? C(e, t) : e, n = p.length - 1, h; n >= 0; n--)
    (h = p[n]) && (o = (i ? h(e, t, o) : h(o)) || o);
  return i && o && A(e, t, o), o;
};
const r = class r extends w {
  constructor() {
    super(...arguments), this.localize = new k(this), this.open = !1, this.disabled = !1;
  }
  firstUpdated() {
    this.body.style.height = this.open ? "auto" : "0", this.open && (this.details.open = !0), this.detailsObserver = new MutationObserver((e) => {
      for (const t of e)
        t.type === "attributes" && t.attributeName === "open" && (this.details.open ? this.show() : this.hide());
    }), this.detailsObserver.observe(this.details, { attributes: !0 });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this.detailsObserver) == null || e.disconnect();
  }
  handleSummaryClick(e) {
    e.preventDefault(), this.disabled || (this.open ? this.hide() : this.show(), this.header.focus());
  }
  handleSummaryKeyDown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.open ? this.hide() : this.show()), (e.key === "ArrowUp" || e.key === "ArrowLeft") && (e.preventDefault(), this.hide()), (e.key === "ArrowDown" || e.key === "ArrowRight") && (e.preventDefault(), this.show());
  }
  async handleOpenChange() {
    if (this.open) {
      if (this.details.open = !0, this.emit("cx-show", { cancelable: !0 }).defaultPrevented) {
        this.open = !1, this.details.open = !1;
        return;
      }
      await c(this.body);
      const { keyframes: t, options: i } = u(this, "details.show", {
        dir: this.localize.dir()
      });
      await m(
        this.body,
        f(t, this.body.scrollHeight),
        i
      ), this.body.style.height = "auto", this.emit("cx-after-show");
    } else {
      if (this.emit("cx-hide", { cancelable: !0 }).defaultPrevented) {
        this.details.open = !0, this.open = !0;
        return;
      }
      await c(this.body);
      const { keyframes: t, options: i } = u(this, "details.hide", {
        dir: this.localize.dir()
      });
      await m(
        this.body,
        f(t, this.body.scrollHeight),
        i
      ), this.body.style.height = "auto", this.details.open = !1, this.emit("cx-after-hide");
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
    return v`
      <details
        part="base"
        class=${x({
      details: !0,
      "details--disabled": this.disabled,
      "details--open": this.open,
      "details--rtl": e
    })}
      >
        <summary
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="content"
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary"
            >${this.summary}</slot
          >

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <cx-icon
                name=${e ? "chevron_left" : "chevron_right"}
              ></cx-icon>
            </slot>
            <slot name="collapse-icon">
              <cx-icon
                name=${e ? "chevron_left" : "chevron_right"}
              ></cx-icon>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </details>
    `;
  }
};
r.styles = [_, $], r.dependencies = {
  "cx-icon": O
};
let s = r;
a([
  l(".details")
], s.prototype, "details", 2);
a([
  l(".details__header")
], s.prototype, "header", 2);
a([
  l(".details__body")
], s.prototype, "body", 2);
a([
  l(".details__expand-icon-slot")
], s.prototype, "expandIconSlot", 2);
a([
  d({ reflect: !0, type: Boolean })
], s.prototype, "open", 2);
a([
  d()
], s.prototype, "summary", 2);
a([
  d({ reflect: !0, type: Boolean })
], s.prototype, "disabled", 2);
a([
  g("open", { waitUntilFirstUpdate: !0 })
], s.prototype, "handleOpenChange", 1);
b("details.show", {
  keyframes: [
    { height: "0", opacity: "0" },
    { height: "auto", opacity: "1" }
  ],
  options: { duration: 200, easing: "linear" }
});
b("details.hide", {
  keyframes: [
    { height: "auto", opacity: "1" },
    { height: "0", opacity: "0" }
  ],
  options: { duration: 200, easing: "linear" }
});
export {
  s as default
};
