import { C as i } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { x as s } from "../chunks/lit-element.DRlPF2me.js";
import { t as d } from "../chunks/custom-element.ttkHUa8w.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import u from "./typography.styles.js";
import { Variant as t } from "./typography.types.js";
var y = Object.defineProperty, g = Object.getOwnPropertyDescriptor, h = (c, r, l, e) => {
  for (var a = e > 1 ? void 0 : e ? g(r, l) : r, p = c.length - 1, n; p >= 0; p--)
    (n = c[p]) && (a = (e ? n(r, l, a) : n(a)) || a);
  return e && a && y(r, l, a), a;
};
let o = class extends i {
  constructor() {
    super(...arguments), this.variant = t.BODY1;
  }
  render() {
    switch (this.variant) {
      case t.BODY1:
        return s`<p part="base" class="body body-1"><slot></slot></p>`;
      case t.BODY2:
        return s`<p part="base" class="body body-2"><slot></slot></p>`;
      case t.BODY3:
        return s`<p part="base" class="body body-3"><slot></slot></p>`;
      case t.SMALL:
        return s`<small part="base" class="small"><slot></slot></small>`;
      case t.H1:
        return s`<h1 part="base" class="heading heading-1">
          <slot></slot>
        </h1>`;
      case t.H2:
        return s`<h2 part="base" class="heading heading-2">
          <slot></slot>
        </h2>`;
      case t.H3:
        return s`<h3 part="base" class="heading heading-3">
          <slot></slot>
        </h3>`;
      case t.H4:
        return s`<h4 part="base" class="heading heading-4">
          <slot></slot>
        </h4>`;
      case t.H5:
        return s`<h5 part="base" class="heading heading-5">
          <slot></slot>
        </h5>`;
      case t.H6:
        return s`<h6 part="base" class="heading heading-6">
          <slot></slot>
        </h6>`;
    }
    return s`<p part="base" class="body body-2"><slot></slot></p>`;
  }
};
o.styles = [b, u];
h([
  m({ type: String })
], o.prototype, "variant", 2);
o = h([
  d("cx-typography")
], o);
export {
  o as default
};
