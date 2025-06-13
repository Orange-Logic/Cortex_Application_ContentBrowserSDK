import { C as g, c as y } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { c as f } from "../chunks/math.DqTA6ya4.js";
import { w as p } from "../chunks/watch.ChG-_stu.js";
import { i as _, x as c } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { r as v } from "../chunks/state.-o_YRGMi.js";
import { t as x } from "../chunks/event-options.CYHYGOd8.js";
import { e as $ } from "../chunks/query.BNveAlQo.js";
import { e as u } from "../chunks/class-map.Cn0czwWq.js";
import { o as m } from "../chunks/style-map.De8UQbPP.js";
import { o as d } from "../chunks/unsafe-html.BH_TRc1Y.js";
import { L as V } from "../chunks/localize.D5Yoww6T.js";
import w from "./icon.js";
const M = _`
  :host {
    --symbol-color: var(--cx-color-neutral-300);
    --symbol-color-active: var(--cx-color-warning-500);
    --symbol-size: 1.2rem;
    --symbol-container-size: 40px;
    --symbol-spacing: var(--cx-spacing-3x-small);

    display: inline-flex;
  }

  :host([variant='outlined']) {
    --symbol-size: var(--cx-font-size-x-large);
    --symbol-color: var(--cx-color-neutral-600);
    --symbol-color-active: var(--cx-color-neutral-600);
  }

  .rating {
    position: relative;
    display: inline-flex;
    border-radius: var(--cx-border-radius-small);
    vertical-align: middle;
  }

  .rating:focus {
    outline: none;
  }

  .rating:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .rating__symbols {
    display: inline-flex;
    position: relative;
    line-height: 0;
    color: var(--symbol-color);
    white-space: nowrap;
    cursor: pointer;
  }

  .rating__symbols > * {
    padding: var(--symbol-spacing);
  }

  .rating__symbol--active,
  .rating__partial--filled {
    color: var(--symbol-color-active);
  }

  .rating__partial-symbol-container {
    position: relative;
  }

  .rating__partial--filled {
    position: absolute;
    top: var(--symbol-spacing);
    left: var(--symbol-spacing);
  }

  .rating__symbol {
    transition: var(--cx-transition-fast) scale;
    pointer-events: none;
  }

  .rating__symbol cx-icon {
    --font-size: var(--symbol-size);
  }

  .rating__symbol--hover {
    scale: 1.2;
  }

  .rating--disabled .rating__symbols,
  .rating--readonly .rating__symbols {
    cursor: default;
  }

  .rating--disabled .rating__symbol--hover,
  .rating--readonly .rating__symbol--hover {
    scale: none;
  }

  .rating--disabled {
    opacity: 0.5;
  }

  .rating--disabled .rating__symbols {
    cursor: default;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    .rating__symbol--active {
      color: SelectedItem;
    }
  }

  /** Outlined */
  .rating--outlined .rating__symbol {
    border: var(--cx-input-border-width) solid var(--cx-input-border-color);
    width: var(--symbol-container-size);
    height: var(--symbol-container-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rating--outlined .rating__partial--filled {
    top: unset;
    left: unset;
  }

  .rating--outlined .rating__symbol:not(:first-child) {
    border-left: none;
  }

  .rating--outlined .rating__symbol:first-child {
    border-top-left-radius: var(--cx-border-radius-small);
    border-bottom-left-radius: var(--cx-border-radius-small);
  }

  .rating--outlined .rating__symbol:last-child {
    border-top-right-radius: var(--cx-border-radius-small);
    border-bottom-right-radius: var(--cx-border-radius-small);
  }

  .rating--outlined .rating__symbol--hover {
    scale: 1;
  }
`;
var H = Object.defineProperty, C = Object.getOwnPropertyDescriptor, a = (e, o, t, i) => {
  for (var s = i > 1 ? void 0 : i ? C(o, t) : o, n = e.length - 1, h; n >= 0; n--)
    (h = e[n]) && (s = (i ? h(o, t, s) : h(s)) || s);
  return i && s && H(o, t, s), s;
};
let r = class extends g {
  constructor() {
    super(...arguments), this.localize = new V(this), this.hoverValue = 0, this.isHovering = !1, this.label = "", this.value = 0, this.max = 5, this.precision = 1, this.readonly = !1, this.disabled = !1, this.variant = "default", this.getSymbol = (e, o = !1) => this.variant !== "outlined" || o ? '<cx-icon name="star"></cx-icon>' : '<cx-icon name="star_border"></cx-icon>';
  }
  getValueFromMousePosition(e) {
    return this.getValueFromXCoordinate(e.clientX);
  }
  getValueFromTouchPosition(e) {
    return this.getValueFromXCoordinate(e.touches[0].clientX);
  }
  getValueFromXCoordinate(e) {
    const o = this.localize.dir() === "rtl", { left: t, right: i, width: s } = this.rating.getBoundingClientRect(), n = o ? this.roundToPrecision(
      (i - e) / s * this.max,
      this.precision
    ) : this.roundToPrecision(
      (e - t) / s * this.max,
      this.precision
    );
    return f(n, 0, this.max);
  }
  handleClick(e) {
    this.disabled || (this.setValue(this.getValueFromMousePosition(e)), this.emit("cx-change"));
  }
  setValue(e) {
    this.disabled || this.readonly || (this.value = e === this.value ? 0 : e, this.isHovering = !1);
  }
  handleKeyDown(e) {
    const o = this.localize.dir() === "ltr", t = this.localize.dir() === "rtl", i = this.value;
    if (!(this.disabled || this.readonly)) {
      if (e.key === "ArrowDown" || o && e.key === "ArrowLeft" || t && e.key === "ArrowRight") {
        const s = e.shiftKey ? 1 : this.precision;
        this.value = Math.max(0, this.value - s), e.preventDefault();
      }
      if (e.key === "ArrowUp" || o && e.key === "ArrowRight" || t && e.key === "ArrowLeft") {
        const s = e.shiftKey ? 1 : this.precision;
        this.value = Math.min(this.max, this.value + s), e.preventDefault();
      }
      e.key === "Home" && (this.value = 0, e.preventDefault()), e.key === "End" && (this.value = this.max, e.preventDefault()), this.value !== i && this.emit("cx-change");
    }
  }
  handleMouseEnter(e) {
    this.isHovering = !0, this.hoverValue = this.getValueFromMousePosition(e);
  }
  handleMouseMove(e) {
    this.hoverValue = this.getValueFromMousePosition(e);
  }
  handleMouseLeave() {
    this.isHovering = !1;
  }
  handleTouchStart(e) {
    this.isHovering = !0, this.hoverValue = this.getValueFromTouchPosition(e), e.preventDefault();
  }
  handleTouchMove(e) {
    this.hoverValue = this.getValueFromTouchPosition(e);
  }
  handleTouchEnd(e) {
    this.isHovering = !1, this.setValue(this.hoverValue), this.emit("cx-change"), e.preventDefault();
  }
  roundToPrecision(e, o = 0.5) {
    const t = 1 / o;
    return Math.ceil(e * t) / t;
  }
  handleHoverValueChange() {
    this.emit("cx-hover", {
      detail: {
        phase: "move",
        value: this.hoverValue
      }
    });
  }
  handleIsHoveringChange() {
    this.emit("cx-hover", {
      detail: {
        phase: this.isHovering ? "start" : "end",
        value: this.hoverValue
      }
    });
  }
  /** Sets focus on the rating. */
  focus(e) {
    this.rating.focus(e);
  }
  /** Removes focus from the rating. */
  blur() {
    this.rating.blur();
  }
  render() {
    const e = this.localize.dir() === "rtl", o = Array.from(Array(this.max).keys());
    let t = 0;
    return this.disabled || this.readonly ? t = this.value : t = this.isHovering ? this.hoverValue : this.value, c`
      <div
        part="base"
        class=${u({
      rating: !0,
      "rating--disabled": this.disabled,
      "rating--outlined": this.variant === "outlined",
      "rating--readonly": this.readonly,
      "rating--rtl": e
    })}
        role="slider"
        aria-label=${this.label}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-readonly=${this.readonly ? "true" : "false"}
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @touchstart=${this.handleTouchStart}
        @mouseleave=${this.handleMouseLeave}
        @touchend=${this.handleTouchEnd}
        @mousemove=${this.handleMouseMove}
        @touchmove=${this.handleTouchMove}
      >
        <span class="rating__symbols">
          ${o.map((i) => t > i && t < i + 1 ? c`
                <span
                  class=${u({
      "rating__partial-symbol-container": !0,
      rating__symbol: !0,
      "rating__symbol--hover": this.isHovering && Math.ceil(t) === i + 1
    })}
                  role="presentation"
                >
                  <div
                    style=${m({
      clipPath: e ? `inset(0 ${(t - i) * 100}% 0 0)` : `inset(0 0 0 ${(t - i) * 100}%)`
    })}
                  >
                    ${d(this.getSymbol(i + 1, !1))}
                  </div>
                  <div
                    class="rating__partial--filled"
                    style=${m({
      clipPath: e ? `inset(0 0 0 ${100 - (t - i) * 100}%)` : `inset(0 ${100 - (t - i) * 100}% 0 0)`
    })}
                  >
                    ${d(this.getSymbol(i + 1, !0))}
                  </div>
                </span>
              ` : c`
              <span
                class=${u({
      rating__symbol: !0,
      "rating__symbol--active": t >= i + 1,
      "rating__symbol--hover": this.isHovering && Math.ceil(t) === i + 1
    })}
                role="presentation"
              >
                ${d(
      this.getSymbol(i + 1, t >= i + 1)
    )}
              </span>
            `)}
        </span>
      </div>
    `;
  }
};
r.styles = [b, M];
r.dependencies = { "cx-icon": w };
a([
  $(".rating")
], r.prototype, "rating", 2);
a([
  v()
], r.prototype, "hoverValue", 2);
a([
  v()
], r.prototype, "isHovering", 2);
a([
  l()
], r.prototype, "label", 2);
a([
  l({ type: Number })
], r.prototype, "value", 2);
a([
  l({ type: Number })
], r.prototype, "max", 2);
a([
  l({ type: Number })
], r.prototype, "precision", 2);
a([
  l({ reflect: !0, type: Boolean })
], r.prototype, "readonly", 2);
a([
  l({ reflect: !0, type: Boolean })
], r.prototype, "disabled", 2);
a([
  l({ reflect: !0 })
], r.prototype, "variant", 2);
a([
  l()
], r.prototype, "getSymbol", 2);
a([
  x({ passive: !0 })
], r.prototype, "handleTouchMove", 1);
a([
  p("hoverValue")
], r.prototype, "handleHoverValueChange", 1);
a([
  p("isHovering")
], r.prototype, "handleIsHoveringChange", 1);
r = a([
  y("cx-rating")
], r);
export {
  r as default
};
