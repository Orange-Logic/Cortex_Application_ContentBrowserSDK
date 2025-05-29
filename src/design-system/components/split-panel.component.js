import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as u } from "../chunks/component.styles.BLcT4bOa.js";
import { d as g } from "../chunks/drag.BixfMdxr.js";
import { c as y } from "../chunks/math.DqTA6ya4.js";
import { w as p } from "../chunks/watch.ChG-_stu.js";
import { x as v } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { e as P } from "../chunks/query.BNveAlQo.js";
import { o as w } from "../chunks/if-defined.D8U9hdvp.js";
import { L as b } from "../chunks/localize.DV9I313e.js";
import x from "./split-panel.styles.js";
var z = Object.defineProperty, C = Object.getOwnPropertyDescriptor, a = (m, i, t, r) => {
  for (var o = r > 1 ? void 0 : r ? C(i, t) : i, e = m.length - 1, h; e >= 0; e--)
    (h = m[e]) && (o = (r ? h(i, t, o) : h(o)) || o);
  return r && o && z(i, t, o), o;
};
const c = class c extends f {
  constructor() {
    super(...arguments), this.localize = new b(this), this.position = 50, this.vertical = !1, this.disabled = !1, this.state = "idle", this.snapThreshold = 12;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(
      (i) => this.handleResize(i)
    ), this.updateComplete.then(() => this.resizeObserver.observe(this)), this.detectSize(), this.cachedPositionInPixels = this.percentageToPixels(this.position);
  }
  disconnectedCallback() {
    var i;
    super.disconnectedCallback(), this && ((i = this.resizeObserver) == null || i.unobserve(this)), this.unsetDocumentCursor();
  }
  detectSize() {
    const { height: i, width: t } = this.getBoundingClientRect();
    this.size = this.vertical ? i : t;
  }
  percentageToPixels(i) {
    return this.size * (i / 100);
  }
  pixelsToPercentage(i) {
    return i / this.size * 100;
  }
  handleDrag(i) {
    const t = this.localize.dir() === "rtl";
    this.disabled || (i.cancelable && i.preventDefault(), this.state = "dragging", g(this, {
      initialEvent: i,
      onMove: (r, o) => {
        let e = this.vertical ? o : r;
        this.primary === "end" && (e = this.size - e), this.snap && this.snap.split(" ").forEach((d) => {
          let l;
          d.endsWith("%") ? l = this.size * (parseFloat(d) / 100) : l = parseFloat(d), t && !this.vertical && (l = this.size - l), e >= l - this.snapThreshold && e <= l + this.snapThreshold && (e = l);
        }), this.position = y(
          this.pixelsToPercentage(e),
          0,
          100
        );
      },
      onStop: () => {
        this.state = "idle";
      }
    }));
  }
  handleKeyDown(i) {
    if (!this.disabled && [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ].includes(i.key)) {
      let t = this.position;
      const r = (i.shiftKey ? 10 : 1) * (this.primary === "end" ? -1 : 1);
      i.preventDefault(), (i.key === "ArrowLeft" && !this.vertical || i.key === "ArrowUp" && this.vertical) && (t -= r), (i.key === "ArrowRight" && !this.vertical || i.key === "ArrowDown" && this.vertical) && (t += r), i.key === "Home" && (t = this.primary === "end" ? 100 : 0), i.key === "End" && (t = this.primary === "end" ? 0 : 100), this.position = y(t, 0, 100);
    }
  }
  handleResize(i) {
    const { height: t, width: r } = i[0].contentRect;
    this.size = this.vertical ? t : r, (isNaN(this.cachedPositionInPixels) || this.position === 1 / 0) && (this.cachedPositionInPixels = Number(
      this.getAttribute("position-in-pixels")
    ), this.positionInPixels = Number(this.getAttribute("position-in-pixels")), this.position = this.pixelsToPercentage(this.positionInPixels)), this.primary && (this.position = this.pixelsToPercentage(this.cachedPositionInPixels));
  }
  unsetDocumentCursor() {
    document.body.style.cursor = "";
  }
  handlePositionChange() {
    this.cachedPositionInPixels = this.percentageToPixels(this.position), this.positionInPixels = this.percentageToPixels(this.position), this.emit("cx-reposition");
  }
  handlePositionInPixelsChange() {
    this.position = this.pixelsToPercentage(this.positionInPixels);
  }
  handleStateChange() {
    this.state === "dragging" ? document.body.style.cursor = this.vertical ? "row-resize" : "col-resize" : document.body.style.cursor = "";
  }
  handleVerticalChange() {
    this.detectSize();
  }
  render() {
    const i = this.vertical ? "gridTemplateRows" : "gridTemplateColumns", t = this.vertical ? "gridTemplateColumns" : "gridTemplateRows", r = this.localize.dir() === "rtl", o = `
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `, e = "auto";
    return this.primary === "end" ? r && !this.vertical ? this.style[i] = `${o} var(--divider-width) ${e}` : this.style[i] = `${e} var(--divider-width) ${o}` : r && !this.vertical ? this.style[i] = `${e} var(--divider-width) ${o}` : this.style[i] = `${o} var(--divider-width) ${e}`, this.style[t] = "", v`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider ${this.state === "dragging" ? "dragging" : ""}"
        tabindex=${w(this.disabled ? void 0 : "0")}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `;
  }
};
c.styles = [u, x];
let s = c;
a([
  P(".divider")
], s.prototype, "divider", 2);
a([
  n({ reflect: !0, type: Number })
], s.prototype, "position", 2);
a([
  n({ attribute: "position-in-pixels", type: Number })
], s.prototype, "positionInPixels", 2);
a([
  n({ reflect: !0, type: Boolean })
], s.prototype, "vertical", 2);
a([
  n({ reflect: !0, type: Boolean })
], s.prototype, "disabled", 2);
a([
  n()
], s.prototype, "primary", 2);
a([
  n()
], s.prototype, "state", 2);
a([
  n()
], s.prototype, "snap", 2);
a([
  n({ attribute: "snap-threshold", type: Number })
], s.prototype, "snapThreshold", 2);
a([
  p("position")
], s.prototype, "handlePositionChange", 1);
a([
  p("positionInPixels")
], s.prototype, "handlePositionInPixelsChange", 1);
a([
  p("state")
], s.prototype, "handleStateChange", 1);
a([
  p("vertical")
], s.prototype, "handleVerticalChange", 1);
export {
  s as default
};
