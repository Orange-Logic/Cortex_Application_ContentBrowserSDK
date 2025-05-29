import { C as d } from "../chunks/cortex-element.v9MiwbrF.js";
import { c } from "../chunks/component.styles.BLcT4bOa.js";
import { w as b } from "../chunks/watch.ChG-_stu.js";
import { x as p } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import v from "./resize-observer.styles.js";
var f = Object.defineProperty, u = Object.getOwnPropertyDescriptor, h = (n, e, r, s) => {
  for (var t = s > 1 ? void 0 : s ? u(e, r) : e, i = n.length - 1, l; i >= 0; i--)
    (l = n[i]) && (t = (s ? l(e, r, t) : l(t)) || t);
  return s && t && f(e, r, t), t;
};
const a = class a extends d {
  constructor() {
    super(...arguments), this.observedElements = [], this.disabled = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(
      (e) => {
        this.emit("cx-resize", { detail: { entries: e } });
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
    const e = this.shadowRoot.querySelector("slot");
    if (e !== null) {
      const r = e.assignedElements({
        flatten: !0
      });
      this.observedElements.forEach((s) => this.resizeObserver.unobserve(s)), this.observedElements = [], r.forEach((s) => {
        this.resizeObserver.observe(s), this.observedElements.push(s);
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
    return p` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
a.styles = [c, v];
let o = a;
h([
  m({ reflect: !0, type: Boolean })
], o.prototype, "disabled", 2);
h([
  b("disabled", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleDisabledChange", 1);
export {
  o as default
};
