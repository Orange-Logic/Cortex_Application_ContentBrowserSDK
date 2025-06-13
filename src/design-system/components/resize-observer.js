import { C as h, c } from "../chunks/custom-element.X6y1saJZ.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { w as b } from "../chunks/watch.ChG-_stu.js";
import { i as p, x as v } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
const f = p`
  :host {
    display: contents;
  }
`;
var u = Object.defineProperty, O = Object.getOwnPropertyDescriptor, n = (s, r, e, i) => {
  for (var t = i > 1 ? void 0 : i ? O(r, e) : r, l = s.length - 1, a; l >= 0; l--)
    (a = s[l]) && (t = (i ? a(r, e, t) : a(t)) || t);
  return i && t && u(r, e, t), t;
};
let o = class extends h {
  constructor() {
    super(...arguments), this.observedElements = [], this.disabled = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(
      (s) => {
        this.emit("cx-resize", { detail: { entries: s } });
      }
    ), this.disabled || this.startObserver();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.stopObserver();
  }
  handleSlotChange() {
    this.disabled || this.startObserver();
  }
  startObserver() {
    const s = this.shadowRoot.querySelector("slot");
    if (s !== null) {
      const r = s.assignedElements({
        flatten: !0
      });
      this.observedElements.forEach((e) => this.resizeObserver.unobserve(e)), this.observedElements = [], r.forEach((e) => {
        this.resizeObserver.observe(e), this.observedElements.push(e);
      });
    }
  }
  stopObserver() {
    this.resizeObserver.disconnect();
  }
  handleDisabledChange() {
    this.disabled ? this.stopObserver() : this.startObserver();
  }
  render() {
    return v` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
o.styles = [d, f];
n([
  m({ reflect: !0, type: Boolean })
], o.prototype, "disabled", 2);
n([
  b("disabled", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleDisabledChange", 1);
o = n([
  c("cx-resize-observer")
], o);
export {
  o as default
};
