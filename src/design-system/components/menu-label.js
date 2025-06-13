import { C as c, c as i } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { i as p, x as f } from "../chunks/lit-element.DRlPF2me.js";
const x = p`
  :host {
    display: block;
  }

  .menu-label {
    display: inline-block;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-medium);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-letter-spacing-normal);
    color: var(--cx-color-neutral-500);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    user-select: none;
    -webkit-user-select: none;
  }
`;
var v = Object.defineProperty, u = Object.getOwnPropertyDescriptor, b = (o, l, t, s) => {
  for (var e = s > 1 ? void 0 : s ? u(l, t) : l, r = o.length - 1, a; r >= 0; r--)
    (a = o[r]) && (e = (s ? a(l, t, e) : a(e)) || e);
  return s && e && v(l, t, e), e;
};
let n = class extends c {
  render() {
    return f` <slot part="base" class="menu-label"></slot> `;
  }
};
n.styles = [m, x];
n = b([
  i("cx-menu-label")
], n);
export {
  n as default
};
