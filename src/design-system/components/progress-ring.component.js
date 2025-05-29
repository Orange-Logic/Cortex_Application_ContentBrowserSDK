import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as d } from "../chunks/state.-o_YRGMi.js";
import { e as h } from "../chunks/query.BNveAlQo.js";
import { L as v } from "../chunks/localize.DV9I313e.js";
import g from "./progress-ring.styles.js";
var b = Object.defineProperty, a = (p, t, s, i) => {
  for (var e = void 0, l = p.length - 1, c; l >= 0; l--)
    (c = p[l]) && (e = c(t, s, e) || e);
  return e && b(t, s, e), e;
};
const o = class o extends f {
  constructor() {
    super(...arguments), this.localize = new v(this), this.value = 0, this.label = "";
  }
  updated(t) {
    if (super.updated(t), t.has("value")) {
      const s = parseFloat(
        getComputedStyle(this.indicator).getPropertyValue("r")
      ), i = 2 * Math.PI * s, e = i - this.value / 100 * i;
      this.indicatorOffset = `${e}px`;
    }
  }
  render() {
    return u`
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
o.styles = [m, g];
let r = o;
a([
  h(".progress-ring__indicator")
], r.prototype, "indicator");
a([
  d()
], r.prototype, "indicatorOffset");
a([
  n({ reflect: !0, type: Number })
], r.prototype, "value");
a([
  n()
], r.prototype, "label");
export {
  r as default
};
