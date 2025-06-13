import { C as v, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as u } from "../chunks/component.styles.BLcT4bOa.js";
import { d as g } from "../chunks/drag.BixfMdxr.js";
import { c as p } from "../chunks/math.DqTA6ya4.js";
import { w as c } from "../chunks/watch.ChG-_stu.js";
import { i as f, x as y } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import { o as b } from "../chunks/if-defined.D8U9hdvp.js";
import { L as w } from "../chunks/localize.D5Yoww6T.js";
const P = f`
  :host {
    --divider-color: var(--cx-panel-border-color);
    --divider-color-hover: var(--cx-color-neutral-300);
    --divider-color-dragging: var(--cx-color-primary-500);
    --divider-color-focus: var(--cx-color-primary-600);
    --divider-width: 3px;
    --divider-hit-area: 12px;
    --min: 0%;
    --max: 100%;

    display: grid;
  }

  .start,
  .end {
    overflow: hidden;
  }

  .divider {
    flex: 0 0 var(--divider-width);
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-color: var(--divider-color);
    color: var(--cx-color-neutral-900);
    z-index: 1;
  }

  .divider:focus {
    outline: none;
  }

  .divider:hover {
    background-color: var(--divider-color-hover);
  }

  .divider.dragging {
    background-color: var(--divider-color-dragging);
  }

  :host(:not([disabled])) .divider:focus-visible {
    background-color: var(--divider-color-focus);
    color: var(--cx-color-neutral-0);
  }

  :host([disabled]) .divider {
    cursor: default;
  }

  /* Horizontal */
  :host(:not([vertical], [disabled])) .divider {
    cursor: col-resize;
  }

  :host(:not([vertical])) .divider::after {
    display: flex;
    content: '';
    position: absolute;
    height: 100%;
    left: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    width: var(--divider-hit-area);
  }

  /* Vertical */
  :host([vertical]) {
    flex-direction: column;
  }

  :host([vertical]:not([disabled])) .divider {
    cursor: row-resize;
  }

  :host([vertical]) .divider::after {
    content: '';
    position: absolute;
    width: 100%;
    top: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    height: var(--divider-hit-area);
  }

  @media (forced-colors: active) {
    .divider {
      outline: solid 1px transparent;
    }
  }
`;
var z = Object.defineProperty, C = Object.getOwnPropertyDescriptor, s = (i, t, o, a) => {
  for (var e = a > 1 ? void 0 : a ? C(t, o) : t, h = i.length - 1, n; h >= 0; h--)
    (n = i[h]) && (e = (a ? n(t, o, e) : n(e)) || e);
  return a && e && z(t, o, e), e;
};
let r = class extends v {
  constructor() {
    super(...arguments), this.localize = new w(this), this.position = 50, this.vertical = !1, this.disabled = !1, this.state = "idle", this.snapThreshold = 12;
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
      onMove: (o, a) => {
        let e = this.vertical ? a : o;
        this.primary === "end" && (e = this.size - e), this.snap && this.snap.split(" ").forEach((n) => {
          let d;
          n.endsWith("%") ? d = this.size * (parseFloat(n) / 100) : d = parseFloat(n), t && !this.vertical && (d = this.size - d), e >= d - this.snapThreshold && e <= d + this.snapThreshold && (e = d);
        }), this.position = p(
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
      const o = (i.shiftKey ? 10 : 1) * (this.primary === "end" ? -1 : 1);
      i.preventDefault(), (i.key === "ArrowLeft" && !this.vertical || i.key === "ArrowUp" && this.vertical) && (t -= o), (i.key === "ArrowRight" && !this.vertical || i.key === "ArrowDown" && this.vertical) && (t += o), i.key === "Home" && (t = this.primary === "end" ? 100 : 0), i.key === "End" && (t = this.primary === "end" ? 0 : 100), this.position = p(t, 0, 100);
    }
  }
  handleResize(i) {
    const { height: t, width: o } = i[0].contentRect;
    this.size = this.vertical ? t : o, (isNaN(this.cachedPositionInPixels) || this.position === 1 / 0) && (this.cachedPositionInPixels = Number(
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
    const i = this.vertical ? "gridTemplateRows" : "gridTemplateColumns", t = this.vertical ? "gridTemplateColumns" : "gridTemplateRows", o = this.localize.dir() === "rtl", a = `
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
    return this.primary === "end" ? o && !this.vertical ? this.style[i] = `${a} var(--divider-width) ${e}` : this.style[i] = `${e} var(--divider-width) ${a}` : o && !this.vertical ? this.style[i] = `${e} var(--divider-width) ${a}` : this.style[i] = `${a} var(--divider-width) ${e}`, this.style[t] = "", y`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider ${this.state === "dragging" ? "dragging" : ""}"
        tabindex=${b(this.disabled ? void 0 : "0")}
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
r.styles = [u, P];
s([
  x(".divider")
], r.prototype, "divider", 2);
s([
  l({ reflect: !0, type: Number })
], r.prototype, "position", 2);
s([
  l({ attribute: "position-in-pixels", type: Number })
], r.prototype, "positionInPixels", 2);
s([
  l({ reflect: !0, type: Boolean })
], r.prototype, "vertical", 2);
s([
  l({ reflect: !0, type: Boolean })
], r.prototype, "disabled", 2);
s([
  l()
], r.prototype, "primary", 2);
s([
  l()
], r.prototype, "state", 2);
s([
  l()
], r.prototype, "snap", 2);
s([
  l({ attribute: "snap-threshold", type: Number })
], r.prototype, "snapThreshold", 2);
s([
  c("position")
], r.prototype, "handlePositionChange", 1);
s([
  c("positionInPixels")
], r.prototype, "handlePositionInPixelsChange", 1);
s([
  c("state")
], r.prototype, "handleStateChange", 1);
s([
  c("vertical")
], r.prototype, "handleVerticalChange", 1);
r = s([
  m("cx-split-panel")
], r);
export {
  r as default
};
