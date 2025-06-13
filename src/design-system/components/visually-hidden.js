import { C as a, c as l } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { i as c, x as d } from "../chunks/lit-element.DRlPF2me.js";
const f = c`
  :host(:not(:focus-within)) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    clip: rect(0 0 0 0) !important;
    clip-path: inset(50%) !important;
    border: none !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    padding: 0 !important;
  }
`;
var h = Object.defineProperty, u = Object.getOwnPropertyDescriptor, v = (s, e, r, o) => {
  for (var t = o > 1 ? void 0 : o ? u(e, r) : e, n = s.length - 1, i; n >= 0; n--)
    (i = s[n]) && (t = (o ? i(e, r, t) : i(t)) || t);
  return o && t && h(e, r, t), t;
};
let p = class extends a {
  render() {
    return d` <slot></slot> `;
  }
};
p.styles = [m, f];
p = v([
  l("cx-visually-hidden")
], p);
export {
  p as default
};
