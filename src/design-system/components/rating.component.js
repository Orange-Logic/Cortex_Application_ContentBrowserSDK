import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { c as b } from "../chunks/math.DqTA6ya4.js";
import { w as v } from "../chunks/watch.ChG-_stu.js";
import { x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { r as y } from "../chunks/state.-o_YRGMi.js";
import { t as $ } from "../chunks/event-options.CYHYGOd8.js";
import { e as V } from "../chunks/query.BNveAlQo.js";
import { e as c } from "../chunks/class-map.Cn0czwWq.js";
import { o as d } from "../chunks/style-map.De8UQbPP.js";
import { o as m } from "../chunks/unsafe-html.DgLLaYx0.js";
import { L as _ } from "../chunks/localize.DV9I313e.js";
import M from "./icon.component.js";
import H from "./rating.styles.js";
var w = Object.defineProperty, P = Object.getOwnPropertyDescriptor, o = (p, e, r, t) => {
  for (var i = t > 1 ? void 0 : t ? P(e, r) : e, a = p.length - 1, h; a >= 0; a--)
    (h = p[a]) && (i = (t ? h(e, r, i) : h(i)) || i);
  return t && i && w(e, r, i), i;
};
const n = class n extends f {
  constructor() {
    super(...arguments), this.localize = new _(this), this.hoverValue = 0, this.isHovering = !1, this.label = "", this.value = 0, this.max = 5, this.precision = 1, this.readonly = !1, this.disabled = !1, this.variant = "default", this.getSymbol = (e, r = !1) => this.variant !== "outlined" || r ? '<cx-icon name="star"></cx-icon>' : '<cx-icon name="star_border"></cx-icon>';
  }
  getValueFromMousePosition(e) {
    return this.getValueFromXCoordinate(e.clientX);
  }
  getValueFromTouchPosition(e) {
    return this.getValueFromXCoordinate(e.touches[0].clientX);
  }
  getValueFromXCoordinate(e) {
    const r = this.localize.dir() === "rtl", { left: t, right: i, width: a } = this.rating.getBoundingClientRect(), h = r ? this.roundToPrecision(
      (i - e) / a * this.max,
      this.precision
    ) : this.roundToPrecision(
      (e - t) / a * this.max,
      this.precision
    );
    return b(h, 0, this.max);
  }
  handleClick(e) {
    this.disabled || (this.setValue(this.getValueFromMousePosition(e)), this.emit("cx-change"));
  }
  setValue(e) {
    this.disabled || this.readonly || (this.value = e === this.value ? 0 : e, this.isHovering = !1);
  }
  handleKeyDown(e) {
    const r = this.localize.dir() === "ltr", t = this.localize.dir() === "rtl", i = this.value;
    if (!(this.disabled || this.readonly)) {
      if (e.key === "ArrowDown" || r && e.key === "ArrowLeft" || t && e.key === "ArrowRight") {
        const a = e.shiftKey ? 1 : this.precision;
        this.value = Math.max(0, this.value - a), e.preventDefault();
      }
      if (e.key === "ArrowUp" || r && e.key === "ArrowRight" || t && e.key === "ArrowLeft") {
        const a = e.shiftKey ? 1 : this.precision;
        this.value = Math.min(this.max, this.value + a), e.preventDefault();
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
  roundToPrecision(e, r = 0.5) {
    const t = 1 / r;
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
    const e = this.localize.dir() === "rtl", r = Array.from(Array(this.max).keys());
    let t = 0;
    return this.disabled || this.readonly ? t = this.value : t = this.isHovering ? this.hoverValue : this.value, u`
      <div
        part="base"
        class=${c({
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
          ${r.map((i) => t > i && t < i + 1 ? u`
                <span
                  class=${c({
      "rating__partial-symbol-container": !0,
      rating__symbol: !0,
      "rating__symbol--hover": this.isHovering && Math.ceil(t) === i + 1
    })}
                  role="presentation"
                >
                  <div
                    style=${d({
      clipPath: e ? `inset(0 ${(t - i) * 100}% 0 0)` : `inset(0 0 0 ${(t - i) * 100}%)`
    })}
                  >
                    ${m(this.getSymbol(i + 1, !1))}
                  </div>
                  <div
                    class="rating__partial--filled"
                    style=${d({
      clipPath: e ? `inset(0 0 0 ${100 - (t - i) * 100}%)` : `inset(0 ${100 - (t - i) * 100}% 0 0)`
    })}
                  >
                    ${m(this.getSymbol(i + 1, !0))}
                  </div>
                </span>
              ` : u`
              <span
                class=${c({
      rating__symbol: !0,
      "rating__symbol--active": t >= i + 1,
      "rating__symbol--hover": this.isHovering && Math.ceil(t) === i + 1
    })}
                role="presentation"
              >
                ${m(
      this.getSymbol(i + 1, t >= i + 1)
    )}
              </span>
            `)}
        </span>
      </div>
    `;
  }
};
n.styles = [g, H], n.dependencies = { "cx-icon": M };
let s = n;
o([
  V(".rating")
], s.prototype, "rating", 2);
o([
  y()
], s.prototype, "hoverValue", 2);
o([
  y()
], s.prototype, "isHovering", 2);
o([
  l()
], s.prototype, "label", 2);
o([
  l({ type: Number })
], s.prototype, "value", 2);
o([
  l({ type: Number })
], s.prototype, "max", 2);
o([
  l({ type: Number })
], s.prototype, "precision", 2);
o([
  l({ reflect: !0, type: Boolean })
], s.prototype, "readonly", 2);
o([
  l({ reflect: !0, type: Boolean })
], s.prototype, "disabled", 2);
o([
  l({ reflect: !0 })
], s.prototype, "variant", 2);
o([
  l()
], s.prototype, "getSymbol", 2);
o([
  $({ passive: !0 })
], s.prototype, "handleTouchMove", 1);
o([
  v("hoverValue")
], s.prototype, "handleHoverValueChange", 1);
o([
  v("isHovering")
], s.prototype, "handleIsHoveringChange", 1);
export {
  s as default
};
