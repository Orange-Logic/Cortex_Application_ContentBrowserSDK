import "./overlay.component.js";
import { a as S, o as E, f as $, s as B, b as z, c as O, p as b, d as C } from "../chunks/PlacementController.D3pNuMGu.js";
import { C as A, c as N } from "../chunks/custom-element.X6y1saJZ.js";
import { c as R } from "../chunks/component.styles.BLcT4bOa.js";
import { i as _, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as k } from "../chunks/state.-o_YRGMi.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { L as F } from "../chunks/localize.D5Yoww6T.js";
function j(t) {
  return L(t);
}
function w(t) {
  return t.assignedSlot ? t.assignedSlot : t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
}
function L(t) {
  for (let e = t; e; e = w(e)) if (e instanceof Element && getComputedStyle(e).display === "none") return null;
  for (let e = w(t); e; e = w(e)) {
    if (!(e instanceof Element)) continue;
    const r = getComputedStyle(e);
    if (r.display !== "contents" && (r.position !== "static" || r.filter !== "none" || e.tagName === "BODY"))
      return e;
  }
  return null;
}
const W = _`
  :host {
    --arrow-color: var(--cx-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(
      var(--arrow-size-diagonal) - var(--arrow-size)
    );

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--use-size-middleware {
    /*
     * Prevent update loops when using the size middleware.
     * https://github.com/floating-ui/floating-ui/issues/1740#issuecomment-1563544849
     */
    width: max-content;
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--cx-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0)
        var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;
var H = Object.defineProperty, M = Object.getOwnPropertyDescriptor, i = (t, e, r, s) => {
  for (var p = s > 1 ? void 0 : s ? M(e, r) : e, l = t.length - 1, n; l >= 0; l--)
    (n = t[l]) && (p = (s ? n(e, r, p) : n(p)) || p);
  return s && p && H(e, r, p), p;
};
function Y(t) {
  return t !== null && typeof t == "object" && "getBoundingClientRect" in t && ("contextElement" in t ? t instanceof Element : !0);
}
function U(t) {
  let e = t;
  for (; e.getRootNode() !== document; )
    e = e.getRootNode().host;
  return e;
}
function X(t) {
  if (!t) return null;
  let e = U(
    t
  );
  if (!e) return null;
  for (; e; ) {
    if (e === document.body)
      return;
    const r = window.getComputedStyle(e);
    if (r.clipPath !== "none" && r.clipPath !== "")
      return e;
    e = e.parentElement;
  }
  return e;
}
let o = class extends A {
  constructor() {
    super(...arguments), this.localize = new F(this), this.active = !1, this.placement = "top", this.strategy = "absolute", this.distance = 0, this.skidding = 0, this.arrow = !1, this.arrowPlacement = "anchor", this.arrowPadding = 10, this.flip = !1, this.flipFallbackPlacements = "", this.flipFallbackStrategy = "best-fit", this.flipPadding = 0, this.shift = !1, this.shiftPadding = 0, this.autoSizePadding = 0, this.hoverBridge = !1, this.autoWidthFactor = 1, this.overlayOpened = !1, this.updateHoverBridge = () => {
      if (this.hoverBridge && this.anchorEl) {
        const t = this.anchorEl.getBoundingClientRect(), e = this.popup.getBoundingClientRect(), r = this.placement.includes("top") || this.placement.includes("bottom");
        let s = 0, p = 0, l = 0, n = 0, u = 0, h = 0, d = 0, c = 0;
        r ? t.top < e.top ? (s = t.left, p = t.bottom, l = t.right, n = t.bottom, u = e.left, h = e.top, d = e.right, c = e.top) : (s = e.left, p = e.bottom, l = e.right, n = e.bottom, u = t.left, h = t.top, d = t.right, c = t.top) : t.left < e.left ? (s = t.right, p = t.top, l = e.left, n = e.top, u = t.right, h = t.bottom, d = e.left, c = e.bottom) : (s = e.right, p = e.top, l = t.left, n = t.top, u = e.right, h = e.bottom, d = t.left, c = t.bottom), this.style.setProperty("--hover-bridge-top-left-x", `${s}px`), this.style.setProperty("--hover-bridge-top-left-y", `${p}px`), this.style.setProperty("--hover-bridge-top-right-x", `${l}px`), this.style.setProperty("--hover-bridge-top-right-y", `${n}px`), this.style.setProperty(
          "--hover-bridge-bottom-left-x",
          `${u}px`
        ), this.style.setProperty(
          "--hover-bridge-bottom-left-y",
          `${h}px`
        ), this.style.setProperty(
          "--hover-bridge-bottom-right-x",
          `${d}px`
        ), this.style.setProperty(
          "--hover-bridge-bottom-right-y",
          `${c}px`
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
      const e = X(this);
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
    this.anchorEl && (this.cleanup = S(this.anchorEl, this.popup, () => {
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
      E({ crossAxis: this.skidding, mainAxis: this.distance })
    ];
    if (this.sync ? t.push(
      z({
        apply: ({ rects: r }) => {
          const s = this.sync === "width" || this.sync === "both", p = this.sync === "height" || this.sync === "both";
          this.popup.style.width = s ? `${r.reference.width}px` : "", this.popup.style.height = p ? `${r.reference.height}px` : "";
        }
      })
    ) : (this.popup.style.width = "", this.popup.style.height = ""), this.flip && t.push(
      $({
        boundary: this.flipBoundary,
        // @ts-expect-error - We're converting a string attribute to an array here
        fallbackPlacements: this.flipFallbackPlacements,
        fallbackStrategy: this.flipFallbackStrategy === "best-fit" ? "bestFit" : "initialPlacement",
        padding: this.flipPadding
      })
    ), this.shift) {
      let r = this.shiftBoundary;
      !r && this.strategy === "fixed" && (r = document.body), t.push(
        B({
          boundary: r,
          padding: this.shiftPadding
        })
      );
    }
    this.autoSize ? t.push(
      z({
        apply: ({ availableHeight: r, availableWidth: s }) => {
          this.autoSize === "vertical" || this.autoSize === "both" ? this.style.setProperty(
            "--auto-size-available-height",
            `${r}px`
          ) : this.style.removeProperty("--auto-size-available-height"), this.autoSize === "horizontal" || this.autoSize === "both" ? this.style.setProperty(
            "--auto-size-available-width",
            `${s * this.autoWidthFactor}px`
          ) : this.style.removeProperty("--auto-size-available-width");
        },
        boundary: this.autoSizeBoundary,
        padding: this.autoSizePadding
      })
    ) : (this.style.removeProperty("--auto-size-available-width"), this.style.removeProperty("--auto-size-available-height")), this.arrow && t.push(
      O({
        element: this.arrowEl,
        padding: this.arrowPadding
      })
    );
    const e = this.strategy === "absolute" ? (r) => b.getOffsetParent(r, j) : b.getOffsetParent;
    C(this.anchorEl, this.popup, {
      middleware: t,
      placement: this.placement,
      platform: {
        ...b,
        getOffsetParent: e
      },
      strategy: this.strategy
    }).then(({ middlewareData: r, placement: s, x: p, y: l }) => {
      const n = this.localize.dir() === "rtl", u = {
        bottom: "top",
        left: "right",
        right: "left",
        top: "bottom"
      }[s.split("-")[0]];
      if (this.setAttribute("data-current-placement", s), Object.assign(this.popup.style, {
        left: `${p}px`,
        top: `${l}px`
      }), this.arrow) {
        const h = r.arrow.x, d = r.arrow.y;
        let c = "", m = "", P = "", f = "";
        if (this.arrowPlacement === "start") {
          const y = typeof h == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          c = typeof d == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "", m = n ? y : "", f = n ? "" : y;
        } else if (this.arrowPlacement === "end") {
          const y = typeof h == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
          m = n ? "" : y, f = n ? y : "", P = typeof d == "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
        } else this.arrowPlacement === "center" ? (f = typeof h == "number" ? "calc(50% - var(--arrow-size-diagonal))" : "", c = typeof d == "number" ? "calc(50% - var(--arrow-size-diagonal))" : "") : (f = typeof h == "number" ? `${h}px` : "", c = typeof d == "number" ? `${d}px` : "");
        Object.assign(this.arrowEl.style, {
          bottom: P,
          left: f,
          right: m,
          top: c
        }), this.arrowEl.style.setProperty(
          u,
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
        class=${v({
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
              class=${v({
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
            class=${v({
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
o.styles = [R, W];
i([
  x(".popup")
], o.prototype, "popup", 2);
i([
  x(".popup__arrow")
], o.prototype, "arrowEl", 2);
i([
  x("cx-overlay")
], o.prototype, "overlay", 2);
i([
  a()
], o.prototype, "anchor", 2);
i([
  a({ reflect: !0, type: Boolean })
], o.prototype, "active", 2);
i([
  a({ reflect: !0 })
], o.prototype, "placement", 2);
i([
  a({ reflect: !0 })
], o.prototype, "strategy", 2);
i([
  a({ type: Number })
], o.prototype, "distance", 2);
i([
  a({ type: Number })
], o.prototype, "skidding", 2);
i([
  a({ type: Boolean })
], o.prototype, "arrow", 2);
i([
  a({ attribute: "arrow-placement" })
], o.prototype, "arrowPlacement", 2);
i([
  a({ attribute: "arrow-padding", type: Number })
], o.prototype, "arrowPadding", 2);
i([
  a({ type: Boolean })
], o.prototype, "flip", 2);
i([
  a({
    attribute: "flip-fallback-placements",
    converter: {
      fromAttribute: (t) => t.split(" ").map((e) => e.trim()).filter((e) => e !== ""),
      toAttribute: (t) => t.join(" ")
    }
  })
], o.prototype, "flipFallbackPlacements", 2);
i([
  a({ attribute: "flip-fallback-strategy" })
], o.prototype, "flipFallbackStrategy", 2);
i([
  a({ type: Object })
], o.prototype, "flipBoundary", 2);
i([
  a({ attribute: "flip-padding", type: Number })
], o.prototype, "flipPadding", 2);
i([
  a({ type: Boolean })
], o.prototype, "shift", 2);
i([
  a({ type: Object })
], o.prototype, "shiftBoundary", 2);
i([
  a({ attribute: "shift-padding", type: Number })
], o.prototype, "shiftPadding", 2);
i([
  a({ attribute: "auto-size" })
], o.prototype, "autoSize", 2);
i([
  a()
], o.prototype, "sync", 2);
i([
  a({ type: Object })
], o.prototype, "autoSizeBoundary", 2);
i([
  a({ attribute: "auto-size-padding", type: Number })
], o.prototype, "autoSizePadding", 2);
i([
  a({ attribute: "hover-bridge", type: Boolean })
], o.prototype, "hoverBridge", 2);
i([
  a({ attribute: "auto-width-factor" })
], o.prototype, "autoWidthFactor", 2);
i([
  k()
], o.prototype, "overlayOpened", 2);
o = i([
  N("cx-popup")
], o);
export {
  o as default
};
