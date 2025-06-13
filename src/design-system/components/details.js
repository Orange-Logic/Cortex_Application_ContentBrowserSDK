import { C as b, c as _ } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { s as c, a as p, b as m } from "../chunks/animate.c3HW4nwn.js";
import { w as u } from "../chunks/event.mFzZi4sr.js";
import { w } from "../chunks/watch.ChG-_stu.js";
import { i as g, x as v } from "../chunks/lit-element.DRlPF2me.js";
import { n as h } from "../chunks/property.CtZ87in4.js";
import { e as l } from "../chunks/query.BNveAlQo.js";
import { e as k } from "../chunks/class-map.Cn0czwWq.js";
import { a as y, g as f } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as C } from "../chunks/localize.D5Yoww6T.js";
import D from "./icon.js";
const O = g`
  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--cx-color-neutral-200);
    background-color: var(--cx-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--cx-spacing-small) var(--cx-spacing-medium);
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    color: var(--cx-color-neutral);
    font-weight: var(--cx-font-weight-semibold);
  }

  .details__header::-webkit-details-marker {
    display: none;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: calc(1px + var(--cx-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: default;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--cx-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: 0 var(--cx-spacing-medium) var(--cx-spacing-small)
      var(--cx-spacing-medium);
  }
`;
var $ = Object.defineProperty, A = Object.getOwnPropertyDescriptor, s = (e, i, a, r) => {
  for (var o = r > 1 ? void 0 : r ? A(i, a) : i, n = e.length - 1, d; n >= 0; n--)
    (d = e[n]) && (o = (r ? d(i, a, o) : d(o)) || o);
  return r && o && $(i, a, o), o;
};
let t = class extends b {
  constructor() {
    super(...arguments), this.localize = new C(this), this.open = !1, this.disabled = !1;
  }
  firstUpdated() {
    this.body.style.height = this.open ? "auto" : "0", this.open && (this.details.open = !0), this.detailsObserver = new MutationObserver((e) => {
      for (const i of e)
        i.type === "attributes" && i.attributeName === "open" && (this.details.open ? this.show() : this.hide());
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
      const { keyframes: i, options: a } = f(this, "details.show", {
        dir: this.localize.dir()
      });
      await p(
        this.body,
        m(i, this.body.scrollHeight),
        a
      ), this.body.style.height = "auto", this.emit("cx-after-show");
    } else {
      if (this.emit("cx-hide", { cancelable: !0 }).defaultPrevented) {
        this.details.open = !0, this.open = !0;
        return;
      }
      await c(this.body);
      const { keyframes: i, options: a } = f(this, "details.hide", {
        dir: this.localize.dir()
      });
      await p(
        this.body,
        m(i, this.body.scrollHeight),
        a
      ), this.body.style.height = "auto", this.details.open = !1, this.emit("cx-after-hide");
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
    return v`
      <details
        part="base"
        class=${k({
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
t.styles = [x, O];
t.dependencies = {
  "cx-icon": D
};
s([
  l(".details")
], t.prototype, "details", 2);
s([
  l(".details__header")
], t.prototype, "header", 2);
s([
  l(".details__body")
], t.prototype, "body", 2);
s([
  l(".details__expand-icon-slot")
], t.prototype, "expandIconSlot", 2);
s([
  h({ reflect: !0, type: Boolean })
], t.prototype, "open", 2);
s([
  h()
], t.prototype, "summary", 2);
s([
  h({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
s([
  w("open", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleOpenChange", 1);
t = s([
  _("cx-details")
], t);
y("details.show", {
  keyframes: [
    { height: "0", opacity: "0" },
    { height: "auto", opacity: "1" }
  ],
  options: { duration: 200, easing: "linear" }
});
y("details.hide", {
  keyframes: [
    { height: "auto", opacity: "1" },
    { height: "0", opacity: "0" }
  ],
  options: { duration: 200, easing: "linear" }
});
export {
  t as default
};
