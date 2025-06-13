import { C as c, c as f } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { i as d, x as e } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import { Variant as t } from "./typography.types.js";
const v = d`
  :host {
    --color: inherit;
    --font-family: var(--cx-font-sans);
    line-height: var(--cx-line-height-large);
  }

  :host::part(base) {
    color: var(--color);
    font-family: var(--font-family);
  }

  .heading,
  .body {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  .heading-1 {
    font-size: var(--cx-font-size-3x-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-3x-large);
  }

  .heading-2 {
    font-size: var(--cx-font-size-2x-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-3x-large);
  }

  .heading-3 {
    font-size: var(--cx-font-size-x-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-2x-large);
  }

  .heading-4 {
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-x-large);
  }

  .heading-5 {
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-large);
  }

  .heading-6 {
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-medium);
  }

  .body-1 {
    font-size: var(--cx-font-size-medium-large);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-x-large);
  }

  .body-2 {
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-large);
  }

  .body-3 {
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-medium);
  }

  .small {
    font-size: var(--cx-font-size-x-small);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-small);
  }
`;
var p = Object.defineProperty, b = Object.getOwnPropertyDescriptor, g = (h, i, n, r) => {
  for (var a = r > 1 ? void 0 : r ? b(i, n) : i, o = h.length - 1, l; o >= 0; o--)
    (l = h[o]) && (a = (r ? l(i, n, a) : l(a)) || a);
  return r && a && p(i, n, a), a;
};
let s = class extends c {
  constructor() {
    super(...arguments), this.variant = t.BODY1;
  }
  render() {
    switch (this.variant) {
      case t.BODY1:
        return e`<p part="base" class="body body-1"><slot></slot></p>`;
      case t.BODY2:
        return e`<p part="base" class="body body-2"><slot></slot></p>`;
      case t.BODY3:
        return e`<p part="base" class="body body-3"><slot></slot></p>`;
      case t.SMALL:
        return e`<small part="base" class="small"><slot></slot></small>`;
      case t.H1:
        return e`<h1 part="base" class="heading heading-1">
          <slot></slot>
        </h1>`;
      case t.H2:
        return e`<h2 part="base" class="heading heading-2">
          <slot></slot>
        </h2>`;
      case t.H3:
        return e`<h3 part="base" class="heading heading-3">
          <slot></slot>
        </h3>`;
      case t.H4:
        return e`<h4 part="base" class="heading heading-4">
          <slot></slot>
        </h4>`;
      case t.H5:
        return e`<h5 part="base" class="heading heading-5">
          <slot></slot>
        </h5>`;
      case t.H6:
        return e`<h6 part="base" class="heading heading-6">
          <slot></slot>
        </h6>`;
    }
    return e`<p part="base" class="body body-2"><slot></slot></p>`;
  }
};
s.styles = [x, v];
g([
  m({ type: String })
], s.prototype, "variant", 2);
s = g([
  f("cx-typography")
], s);
export {
  s as default
};
