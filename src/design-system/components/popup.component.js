import "./overlay.component.js";
import { a as $, o as B, f as O, s as C, b as E, c as k, p as v, d as A } from "../chunks/PlacementController.D3pNuMGu.js";
import { C as N } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as R } from "../chunks/component.styles.BLcT4bOa.js";
import { x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { r as F } from "../chunks/state.-o_YRGMi.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import { e as w } from "../chunks/class-map.Cn0czwWq.js";
import { L } from "../chunks/localize.DV9I313e.js";
import _ from "./popup.styles.js";
function j(o) {
  return W(o);
}
function P(o) {
  return o.assignedSlot ? o.assignedSlot : o.parentNode instanceof ShadowRoot ? o.parentNode.host : o.parentNode;
}
function W(o) {
  for (let t = o; t; t = P(t)) if (t instanceof Element && getComputedStyle(t).display === "none") return null;
  for (let t = P(o); t; t = P(t)) {
    if (!(t instanceof Element)) continue;
    const e = getComputedStyle(t);
    if (e.display !== "contents" && (e.position !== "static" || e.filter !== "none" || t.tagName === "BODY"))
      return t;
  }
  return null;
}
var M = Object.defineProperty, r = (o, t, e, p) => {
  for (var a = void 0, n = o.length - 1, d; n >= 0; n--)
    (d = o[n]) && (a = d(t, e, a) || a);
  return a && M(t, e, a), a;
};
function Y(o) {
  return o !== null && typeof o == "object" && "getBoundingClientRect" in o && ("contextElement" in o ? o instanceof Element : !0);
}
function H(o) {
  let t = o;
  for (; t.getRootNode() !== document; )
    t = t.getRootNode().host;
  return t;
}
function U(o) {
  if (!o) return null;
  let t = H(
    o
  );
  if (!t) return null;
  for (; t; ) {
    if (t === document.body)
      return;
    const e = window.getComputedStyle(t);
    if (e.clipPath !== "none" && e.clipPath !== "")
      return t;
    t = t.parentElement;
  }
  return t;
}
const z = class z extends N {
  constructor() {
    super(...arguments), this.localize = new L(this), this.active = !1, this.placement = "top", this.strategy = "absolute", this.distance = 0, this.skidding = 0, this.arrow = !1, this.arrowPlacement = "anchor", this.arrowPadding = 10, this.flip = !1, this.flipFallbackPlacements = "", this.flipFallbackStrategy = "best-fit", this.flipPadding = 0, this.shift = !1, this.shiftPadding = 0, this.autoSizePadding = 0, this.hoverBridge = !1, this.autoWidthFactor = 1, this.overlayOpened = !1, this.updateHoverBridge = () => {
      if (this.hoverBridge && this.anchorEl) {
        const t = this.anchorEl.getBoundingClientRect(), e = this.popup.getBoundingClientRect(), p = this.placement.includes("top") || this.placement.includes("bottom");
        let a = 0, n = 0, d = 0, c = 0, f = 0, l = 0, h = 0, u = 0;
        p ? t.top < e.top ? (a = t.left, n = t.bottom, d = t.right, c = t.bottom, f = e.left, l = e.top, h = e.right, u = e.top) : (a = e.left, n = e.bottom, d = e.right, c = e.bottom, f = t.left, l = t.top, h = t.right, u = t.top) : t.left < e.left ? (a = t.right, n = t.top, d = e.left, c = e.top, f = t.right, l = t.bottom, h = e.left, u = e.bottom) : (a = e.right, n = e.top, d = t.left, c = t.top, f = e.right, l = e.bottom, h = t.left, u = t.bottom), this.style.setProperty("--hover-bridge-top-left-x", `${a}px`), this.style.setProperty("--hover-bridge-top-left-y", `${n}px`), this.style.setProperty("--hover-bridge-top-right-x", `${d}px`), this.style.setProperty("--hover-bridge-top-right-y", `${c}px`), this.style.setProperty(
          "--hover-bridge-bottom-left-x",
          `${f}px`
        ), this.style.setProperty(
          "--hover-bridge-bottom-left-y",
          `${l}px`
        ), this.style.setProperty(
          "--hover-bridge-bottom-right-x",
          `${h}px`
        ), this.style.setProperty(
          "--hover-bridge-bottom-right-y",
          `${u}px`
        );
      }
    };
  }
  /*
   * Use to prevent update loops when using the size middleware.
   * https://github.com/floating-ui/floating-ui/issues/1740#issuecomment-1563544849
   */
  get isSizeMiddleWareUsed() {
    return this.sync || this.autoSize;
  }
  async connectedCallback() {
    super.connectedCallback(), await this.updateComplete, this.start();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.stop();
  }
  firstUpdated() {
    if (this.strategy !== "fixed") return;
    if (!("popover" in HTMLDivElement.prototype)) {
      const e = U(this);
      e && (this.autoSizeBoundary = e, this.flipBoundary = e, this.shiftBoundary = e);
    }
  }
  async updated(t) {
    super.updated(t), t.has("active") && (this.active ? (this.start(), this.strategy !== "fixed" && this.emit("cx-opened")) : this.stop()), t.has("anchor") && this.handleAnchorChange(), this.active && (await this.updateComplete, this.reposition());
  }
  async handleAnchorChange() {
    if (await this.stop(), this.anchor && typeof this.anchor == "string") {
      const t = this.getRootNode();
      this.anchorEl = t.getElementById(this.anchor);
    } else this.anchor instanceof Element || Y(this.anchor) ? this.anchorEl = this.anchor : this.anchorEl = this.querySelector('[slot="anchor"]');
    this.anchorEl instanceof HTMLSlotElement && (this.anchorEl = this.anchorEl.assignedElements({
      flatten: !0
    })[0]), this.anchorEl && this.start();
  }
  async handleOverlayOpened() {
    this.style.removeProperty("--auto-size-available-width"), this.style.removeProperty("--auto-size-available-height"), this.reposition(), this.overlayOpened = !0, await this.updateComplete, this.emit("cx-opened");
  }
  start() {
    this.anchorEl && (this.cleanup = $(this.anchorEl, this.popup, () => {
      this.reposition();
    }));
  }
  async stop() {
    return this.active || (this.overlayOpened = !1), new Promise((t) => {
      this.cleanup ? (this.cleanup(), this.cleanup = void 0, this.removeAttribute("data-current-placement"), this.style.removeProperty("--auto-size-available-width"), this.style.removeProperty("--auto-size-available-height"), requestAnimationFrame(() => t())) : t();
    });
  }
  /** Forces the popup to recalculate and reposition itself. */
  reposition() {
    if (!this.active || !this.anchorEl)
      return;
    const t = [
      // The offset middleware goes first
      B({ crossAxis: this.skidding, mainAxis: this.distance })
    ];
    if (this.sync ? t.push(
      E({
        apply: ({ rects: p }) => {
          const a = this.sync === "width" || this.sync === "both", n = this.sync === "height" || this.sync === "both";
          this.popup.style.width = a ? `${p.reference.width}px` : "", this.popup.style.height = n ? `${p.reference.height}px` : "";
        }
      })
    ) : (this.popup.style.width = "", this.popup.style.height = ""), this.flip && t.push(
      O({
        boundary: this.flipBoundary,
        // @ts-expect-error - We're converting a string attribute to an array here
        fallbackPlacements: this.flipFallbackPlacements,
        fallbackStrategy: this.flipFallbackStrategy === "best-fit" ? "bestFit" : "initialPlacement",
        padding: this.flipPadding
      })
    ), this.shift) {
      let p = this.shiftBoundary;
      !p && this.strategy === "fixed" && (p = document.body), t.push(
        C({
          boundary: p,
          padding: this.shiftPadding
        })
      );
    }
    this.autoSize ? t.push(
      E({
        apply: ({ availableHeight: p, availableWidth: a }) => {
          this.autoSize === "vertical" || this.autoSize === "both" ? this.style.setProperty(
            "--auto-size-available-height",
            `${p}px`
          ) : this.style.removeProperty("--auto-size-available-height"), this.autoSize === "horizontal" || this.autoSize === "both" ? this.style.setProperty(
            "--auto-size-available-width",
            `${a * this.autoWidthFactor}px`
          ) : this.style.removeProperty("--auto-size-available-width");
        },
        boundary: this.autoSizeBoundary,
        padding: this.autoSizePadding
      })
    ) : (this.style.removeProperty("--auto-size-available-width"), this.style.removeProperty("--auto-size-available-height")), this.arrow && t.push(
      k({
        element: this.arrowEl,
        padding: this.arrowPadding
      })
    );
    const e = this.strategy === "absolute" ? (p) => v.getOffsetParent(p, j) : v.getOffsetParent;
    A(this.anchorEl, this.popup, {
      middleware: t,
      placement: this.placement,
      platform: {
        ...v,
        getOffsetParent: e
      },
      strategy: this.strategy
    }).then(({ middlewareData: p, placement: a, x: n, y: d }) => {
      const c = this.localize.dir() === "rtl", f = {
        bottom: "top",
        left: "right",
        right: "left",
        top: "bottom"
      }[a.split("-")[0]];
      if (this.setAttribute("data-current-placement", a), Object.assign(this.popup.style, {
        left: `${n}px`,
        top: `${d}px`
      }), this.arrow) {
        const l = p.arrow.x, h = p.arrow.y;
        let u = "", b = "", S = "", y = "";
        if (this.arrowPlacement === "start") {
          const m = typeof l == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          u = typeof h == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "", b = c ? m : "", y = c ? "" : m;
        } else if (this.arrowPlacement === "end") {
          const m = typeof l == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          b = c ? "" : m, y = c ? m : "", S = typeof h == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
        } else this.arrowPlacement === "center" ? (y = typeof l == "number" ? "calc(50% - var(--arrow-size-diagonal))" : "", u = typeof h == "number" ? "calc(50% - var(--arrow-size-diagonal))" : "") : (y = typeof l == "number" ? `${l}px` : "", u = typeof h == "number" ? `${h}px` : "");
        Object.assign(this.arrowEl.style, {
          bottom: S,
          left: y,
          right: b,
          top: u
        }), this.arrowEl.style.setProperty(
          f,
          "calc(var(--arrow-size-diagonal) * -1)"
        );
      }
    }), requestAnimationFrame(() => {
      this.updateHoverBridge(), this.emit("cx-reposition");
    });
  }
  render() {
    return g`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${w({
      "popup-hover-bridge": !0,
      "popup-hover-bridge--visible": this.hoverBridge && this.active
    })}
      ></span>

      ${this.strategy === "fixed" ? g`<cx-overlay
            ?open=${this.active}
            placement="bottom"
            type="manual"
            @cx-opened=${this.handleOverlayOpened}
          >
            <div
              part="popup"
              class=${w({
      popup: !0,
      "popup--active": this.overlayOpened,
      "popup--fixed": !0,
      "popup--has-arrow": this.arrow,
      "popup--use-size-middleware": this.isSizeMiddleWareUsed
    })}
            >
              <slot></slot>
              ${this.arrow ? g`<div
                    part="arrow"
                    class="popup__arrow"
                    role="presentation"
                  ></div>` : ""}
            </div>
          </cx-overlay>` : g`<div
            part="popup"
            class=${w({
      popup: !0,
      "popup--active": this.active,
      "popup--has-arrow": this.arrow,
      "popup--use-size-middleware": this.isSizeMiddleWareUsed
    })}
          >
            <slot></slot>
            ${this.arrow ? g`<div
                  part="arrow"
                  class="popup__arrow"
                  role="presentation"
                ></div>` : ""}
          </div>`}
    `;
  }
};
z.styles = [R, _];
let i = z;
r([
  x(".popup")
], i.prototype, "popup");
r([
  x(".popup__arrow")
], i.prototype, "arrowEl");
r([
  x("cx-overlay")
], i.prototype, "overlay");
r([
  s()
], i.prototype, "anchor");
r([
  s({ reflect: !0, type: Boolean })
], i.prototype, "active");
r([
  s({ reflect: !0 })
], i.prototype, "placement");
r([
  s({ reflect: !0 })
], i.prototype, "strategy");
r([
  s({ type: Number })
], i.prototype, "distance");
r([
  s({ type: Number })
], i.prototype, "skidding");
r([
  s({ type: Boolean })
], i.prototype, "arrow");
r([
  s({ attribute: "arrow-placement" })
], i.prototype, "arrowPlacement");
r([
  s({ attribute: "arrow-padding", type: Number })
], i.prototype, "arrowPadding");
r([
  s({ type: Boolean })
], i.prototype, "flip");
r([
  s({
    attribute: "flip-fallback-placements",
    converter: {
      fromAttribute: (o) => o.split(" ").map((t) => t.trim()).filter((t) => t !== ""),
      toAttribute: (o) => o.join(" ")
    }
  })
], i.prototype, "flipFallbackPlacements");
r([
  s({ attribute: "flip-fallback-strategy" })
], i.prototype, "flipFallbackStrategy");
r([
  s({ type: Object })
], i.prototype, "flipBoundary");
r([
  s({ attribute: "flip-padding", type: Number })
], i.prototype, "flipPadding");
r([
  s({ type: Boolean })
], i.prototype, "shift");
r([
  s({ type: Object })
], i.prototype, "shiftBoundary");
r([
  s({ attribute: "shift-padding", type: Number })
], i.prototype, "shiftPadding");
r([
  s({ attribute: "auto-size" })
], i.prototype, "autoSize");
r([
  s()
], i.prototype, "sync");
r([
  s({ type: Object })
], i.prototype, "autoSizeBoundary");
r([
  s({ attribute: "auto-size-padding", type: Number })
], i.prototype, "autoSizePadding");
r([
  s({ attribute: "hover-bridge", type: Boolean })
], i.prototype, "hoverBridge");
r([
  s({ attribute: "auto-width-factor" })
], i.prototype, "autoWidthFactor");
r([
  F()
], i.prototype, "overlayOpened");
export {
  i as default
};
