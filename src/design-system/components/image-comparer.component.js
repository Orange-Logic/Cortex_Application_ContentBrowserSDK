import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { d as y } from "../chunks/drag.BixfMdxr.js";
import { c as m } from "../chunks/math.DqTA6ya4.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { x as w } from "../chunks/lit-element.DRlPF2me.js";
import { n as v } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as _ } from "../chunks/class-map.Cn0czwWq.js";
import { o as p } from "../chunks/style-map.De8UQbPP.js";
import { L as $ } from "../chunks/localize.DV9I313e.js";
import h from "./icon.component.js";
import b from "./image-comparer.styles.js";
var x = Object.defineProperty, D = Object.getOwnPropertyDescriptor, n = (c, i, r, e) => {
  for (var t = e > 1 ? void 0 : e ? D(i, r) : i, o = c.length - 1, l; o >= 0; o--)
    (l = c[o]) && (t = (e ? l(i, r, t) : l(t)) || t);
  return e && t && x(i, r, t), t;
};
const a = class a extends f {
  constructor() {
    super(...arguments), this.localize = new $(this), this.position = 50;
  }
  handleDrag(i) {
    const { width: r } = this.base.getBoundingClientRect(), e = this.localize.dir() === "rtl";
    i.preventDefault(), y(this.base, {
      initialEvent: i,
      onMove: (t) => {
        this.position = parseFloat(m(t / r * 100, 0, 100).toFixed(2)), e && (this.position = 100 - this.position);
      }
    });
  }
  handleKeyDown(i) {
    const r = this.localize.dir() === "ltr", e = this.localize.dir() === "rtl";
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(i.key)) {
      const t = i.shiftKey ? 10 : 1;
      let o = this.position;
      i.preventDefault(), (r && i.key === "ArrowLeft" || e && i.key === "ArrowRight") && (o -= t), (r && i.key === "ArrowRight" || e && i.key === "ArrowLeft") && (o += t), i.key === "Home" && (o = 0), i.key === "End" && (o = 100), o = m(o, 0, 100), this.position = o;
    }
  }
  handlePositionChange() {
    this.emit("cx-change");
  }
  render() {
    const i = this.localize.dir() === "rtl";
    return w`
      <div
        part="base"
        id="image-comparer"
        class=${_({
      "image-comparer": !0,
      "image-comparer--rtl": i
    })}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <div
            part="before"
            class="image-comparer__before"
            style=${p({
      clipPath: i ? `inset(0 0 0 ${100 - this.position}%)` : `inset(0 ${100 - this.position}% 0 0)`
    })}
          >
            <slot name="before"></slot>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${p({
      clipPath: i ? `inset(0 ${this.position}% 0 0)` : `inset(0 0 0 ${this.position}%)`
    })}
          >
            <slot name="after"></slot>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${p({
      left: i ? `${100 - this.position}%` : `${this.position}%`
    })}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <div
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <slot name="handle">
              <cx-icon name="drag_indicator"></cx-icon>
            </slot>
          </div>
        </div>
      </div>
    `;
  }
};
a.styles = [g, b], a.dependencies = {
  "cx-icon": h
}, a.scopedElement = { "cx-icon": h };
let s = a;
n([
  d(".image-comparer")
], s.prototype, "base", 2);
n([
  d(".image-comparer__handle")
], s.prototype, "handle", 2);
n([
  v({ reflect: !0, type: Number })
], s.prototype, "position", 2);
n([
  u("position", { waitUntilFirstUpdate: !0 })
], s.prototype, "handlePositionChange", 1);
export {
  s as default
};
