import { C as i, c as n } from "../chunks/custom-element.X6y1saJZ.js";
import { c as p } from "../chunks/component.styles.BLcT4bOa.js";
import { i as m, x as f } from "../chunks/lit-element.DRlPF2me.js";
const u = m`
  :host {
    --aspect-ratio: inherit;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    aspect-ratio: var(--aspect-ratio);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  ::slotted(img) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
`;
var h = Object.defineProperty, x = Object.getOwnPropertyDescriptor, d = (c, e, s, r) => {
  for (var t = r > 1 ? void 0 : r ? x(e, s) : e, o = c.length - 1, l; o >= 0; o--)
    (l = c[o]) && (t = (r ? l(e, s, t) : l(t)) || t);
  return r && t && h(e, s, t), t;
};
let a = class extends i {
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "group");
  }
  render() {
    return f` <slot></slot> `;
  }
};
a.styles = [p, u];
a = d([
  n("cx-carousel-item")
], a);
export {
  a as default
};
