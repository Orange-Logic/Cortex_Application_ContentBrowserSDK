import { C as n } from "../chunks/cortex-element.v9MiwbrF.js";
import { c } from "../chunks/component.styles.BLcT4bOa.js";
import { H as m } from "../chunks/slot.DJLm4Dig.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as h } from "../chunks/property.CtZ87in4.js";
import { e as f } from "../chunks/class-map.Cn0czwWq.js";
import p from "./card.styles.js";
var _ = Object.defineProperty, v = (a, s, l, u) => {
  for (var t = void 0, e = a.length - 1, i; e >= 0; e--)
    (i = a[e]) && (t = i(s, l, t) || t);
  return t && _(s, l, t), t;
};
const o = class o extends n {
  constructor() {
    super(...arguments), this.interactive = !1, this.hasSlotController = new m(
      this,
      "footer",
      "header",
      "image"
    );
  }
  render() {
    return d`
      <div
        part="base"
        class=${f({
      card: !0,
      "card--has-footer": this.hasSlotController.test("footer"),
      "card--has-header": this.hasSlotController.test("header"),
      "card--has-image": this.hasSlotController.test("image"),
      "card--interactive": this.interactive
    })}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot name="title" part="title" class="card__title"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `;
  }
};
o.styles = [c, p];
let r = o;
v([
  h({ reflect: !0, type: Boolean })
], r.prototype, "interactive");
export {
  r as default
};
