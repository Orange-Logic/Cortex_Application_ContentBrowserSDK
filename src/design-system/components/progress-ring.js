import { C as p, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { i as u, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { r as v } from "../chunks/state.-o_YRGMi.js";
import { e as m } from "../chunks/query.BNveAlQo.js";
import { L as h } from "../chunks/localize.D5Yoww6T.js";
const _ = u`
  :host {
    --size: 128px;
    --track-width: 4px;
    --track-color: var(--cx-color-neutral-200);
    --indicator-width: var(--track-width);
    --indicator-color: var(--cx-color-primary-600);
    --indicator-transition-duration: 0.35s;

    display: inline-flex;
  }

  .progress-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .progress-ring__image {
    width: var(--size);
    height: var(--size);
    rotate: -90deg;
    transform-origin: 50% 50%;
  }

  .progress-ring__track,
  .progress-ring__indicator {
    --radius: calc(
      var(--size) / 2 - max(var(--track-width), var(--indicator-width)) * 0.5
    );
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    fill: none;
    r: var(--radius);
    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
  }

  .progress-ring__track {
    stroke: var(--track-color);
    stroke-width: var(--track-width);
  }

  .progress-ring__indicator {
    stroke: var(--indicator-color);
    stroke-width: var(--indicator-width);
    stroke-linecap: round;
    transition-property: stroke-dashoffset;
    transition-duration: var(--indicator-transition-duration);
    stroke-dasharray: var(--circumference) var(--circumference);
    stroke-dashoffset: calc(
      var(--circumference) - var(--percentage) * var(--circumference)
    );
  }

  .progress-ring__label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    user-select: none;
    -webkit-user-select: none;
  }
`;
var y = Object.defineProperty, b = Object.getOwnPropertyDescriptor, o = (s, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? b(t, i) : t, c = s.length - 1, n; c >= 0; c--)
    (n = s[c]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && y(t, i, r), r;
};
let e = class extends p {
  constructor() {
    super(...arguments), this.localize = new h(this), this.value = 0, this.label = "";
  }
  updated(s) {
    if (super.updated(s), s.has("value")) {
      const t = parseFloat(
        getComputedStyle(this.indicator).getPropertyValue("r")
      ), i = 2 * Math.PI * t, a = i - this.value / 100 * i;
      this.indicatorOffset = `${a}px`;
    }
  }
  render() {
    return f`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${this.label.length > 0 ? this.label : this.localize.term("progress")}
        aria-describedby="label"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value / 100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle
            class="progress-ring__indicator"
            style="stroke-dashoffset: ${this.indicatorOffset}"
          ></circle>
        </svg>

        <slot id="label" part="label" class="progress-ring__label"></slot>
      </div>
    `;
  }
};
e.styles = [g, _];
o([
  m(".progress-ring__indicator")
], e.prototype, "indicator", 2);
o([
  v()
], e.prototype, "indicatorOffset", 2);
o([
  l({ reflect: !0, type: Number })
], e.prototype, "value", 2);
o([
  l()
], e.prototype, "label", 2);
e = o([
  d("cx-progress-ring")
], e);
export {
  e as default
};
