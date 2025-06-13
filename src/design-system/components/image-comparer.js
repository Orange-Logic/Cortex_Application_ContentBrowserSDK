import { C as h, c as f } from "../chunks/custom-element.X6y1saJZ.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { d as u } from "../chunks/drag.BixfMdxr.js";
import { c as m } from "../chunks/math.DqTA6ya4.js";
import { w as v } from "../chunks/watch.ChG-_stu.js";
import { i as _, x as w } from "../chunks/lit-element.DRlPF2me.js";
import { n as y } from "../chunks/property.CtZ87in4.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import { e as x } from "../chunks/class-map.Cn0czwWq.js";
import { o as c } from "../chunks/style-map.De8UQbPP.js";
import { L as b } from "../chunks/localize.D5Yoww6T.js";
import d from "./icon.js";
const $ = _`
  :host {
    --divider-width: 2px;
    --handle-size: 2.5rem;

    display: inline-block;
    position: relative;
  }

  .image-comparer {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .image-comparer__before,
  .image-comparer__after {
    display: block;
    pointer-events: none;
    position: relative;
  }

  slot[name='before']::slotted(img),
  slot[name='after']::slotted(img),
  slot[name='before']::slotted(svg),
  slot[name='after']::slotted(svg) {
    display: block;
    max-width: 100% !important;
    height: auto;
  }

  .image-comparer__before {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .image-comparer__divider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: var(--divider-width);
    height: 100%;
    background-color: var(--cx-color-neutral-0);
    translate: calc(var(--divider-width) / -2);
    cursor: ew-resize;
  }

  .image-comparer__handle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(50% - (var(--handle-size) / 2));
    width: var(--handle-size);
    height: var(--handle-size);
    background-color: var(--cx-color-neutral-0);
    border-radius: var(--cx-border-radius-circle);
    font-size: calc(var(--handle-size) * 0.5);
    color: var(--cx-color-neutral-700);
    cursor: inherit;
    z-index: 10;
  }

  .image-comparer__handle:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }
`;
var z = Object.defineProperty, C = Object.getOwnPropertyDescriptor, s = (e, t, a, o) => {
  for (var i = o > 1 ? void 0 : o ? C(t, a) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (i = (o ? n(t, a, i) : n(i)) || i);
  return o && i && z(t, a, i), i;
};
let r = class extends h {
  constructor() {
    super(...arguments), this.localize = new b(this), this.position = 50;
  }
  handleDrag(e) {
    const { width: t } = this.base.getBoundingClientRect(), a = this.localize.dir() === "rtl";
    e.preventDefault(), u(this.base, {
      initialEvent: e,
      onMove: (o) => {
        this.position = parseFloat(m(o / t * 100, 0, 100).toFixed(2)), a && (this.position = 100 - this.position);
      }
    });
  }
  handleKeyDown(e) {
    const t = this.localize.dir() === "ltr", a = this.localize.dir() === "rtl";
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      const o = e.shiftKey ? 10 : 1;
      let i = this.position;
      e.preventDefault(), (t && e.key === "ArrowLeft" || a && e.key === "ArrowRight") && (i -= o), (t && e.key === "ArrowRight" || a && e.key === "ArrowLeft") && (i += o), e.key === "Home" && (i = 0), e.key === "End" && (i = 100), i = m(i, 0, 100), this.position = i;
    }
  }
  handlePositionChange() {
    this.emit("cx-change");
  }
  render() {
    const e = this.localize.dir() === "rtl";
    return w`
      <div
        part="base"
        id="image-comparer"
        class=${x({
      "image-comparer": !0,
      "image-comparer--rtl": e
    })}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <div
            part="before"
            class="image-comparer__before"
            style=${c({
      clipPath: e ? `inset(0 0 0 ${100 - this.position}%)` : `inset(0 ${100 - this.position}% 0 0)`
    })}
          >
            <slot name="before"></slot>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${c({
      clipPath: e ? `inset(0 ${this.position}% 0 0)` : `inset(0 0 0 ${this.position}%)`
    })}
          >
            <slot name="after"></slot>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${c({
      left: e ? `${100 - this.position}%` : `${this.position}%`
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
r.styles = [g, $];
r.dependencies = {
  "cx-icon": d
};
r.scopedElement = { "cx-icon": d };
s([
  p(".image-comparer")
], r.prototype, "base", 2);
s([
  p(".image-comparer__handle")
], r.prototype, "handle", 2);
s([
  y({ reflect: !0, type: Number })
], r.prototype, "position", 2);
s([
  v("position", { waitUntilFirstUpdate: !0 })
], r.prototype, "handlePositionChange", 1);
r = s([
  f("cx-image-comparer")
], r);
export {
  r as default
};
