import { x as f, i as R } from "./lit-element.DRlPF2me.js";
import { n as a } from "./property.CtZ87in4.js";
import { r as m } from "./state.-o_YRGMi.js";
import { e as P } from "./query.BNveAlQo.js";
import { C as _, c as V } from "./custom-element.X6y1saJZ.js";
import { c as A } from "./component.styles.BLcT4bOa.js";
import { w as M } from "./watch.ChG-_stu.js";
import { e as u } from "./class-map.Cn0czwWq.js";
import { n as z } from "./when.CDK1Tt5Y.js";
import B from "../components/icon.js";
import N from "../components/skeleton.js";
import O from "../components/space.js";
var W = Object.defineProperty, d = (n, e, o, l) => {
  for (var t = void 0, i = n.length - 1, s; i >= 0; i--)
    (s = n[i]) && (t = s(e, o, t) || t);
  return t && W(e, o, t), t;
};
class p extends _ {
  constructor() {
    super(...arguments), this.width = "", this.height = "", this.resizable = !1, this.keepRatio = !1, this.noLimit = !1, this.isResizeActive = !1, this.isResizing = !1, this.resizeSize = {
      height: 0,
      width: 0
    }, this.handleDocumentMouseDown = (e) => {
      const o = e.composedPath();
      this.containingElement && !o.includes(this.containingElement) && this.stopResizing();
    };
  }
  get ratio() {
    var l, t;
    const e = ((l = this.containingElement) == null ? void 0 : l.clientWidth) || 0, o = ((t = this.containingElement) == null ? void 0 : t.clientHeight) || 0;
    return !e || !o ? 1 : e / o;
  }
  startResizing() {
    !this.resizable || this.isResizeActive || (this.isResizeActive = !0, this.ownerDocument.addEventListener(
      "mousedown",
      this.handleDocumentMouseDown
    ));
  }
  stopResizing() {
    this.isResizeActive = !1, this.ownerDocument.removeEventListener(
      "mousedown",
      this.handleDocumentMouseDown
    );
  }
  handleResizeDragging(e, o = !1, l = !1) {
    var b, w, v;
    e.preventDefault(), e.stopPropagation(), this.isResizing = !0;
    const t = { x: e.pageX, y: e.pageY };
    let i = 0, s = 0;
    const y = {
      height: ((b = this.containingElement) == null ? void 0 : b.clientHeight) || 0,
      width: ((w = this.containingElement) == null ? void 0 : w.clientWidth) || 0
    };
    let g;
    if (!this.noLimit && this.parentElement) {
      g = (v = this.parentElement) == null ? void 0 : v.clientWidth;
      const c = getComputedStyle(this.parentElement), E = c.getPropertyValue("padding-left").trim() || "0px", $ = c.getPropertyValue("padding-right").trim() || "0px", S = Number(E.replace("px", "")), D = Number($.replace("px", "")), L = getComputedStyle(this.parentElement).getPropertyValue("--padding").trim() || "0px", C = Number(L.replace("px", "")), j = Math.max(
        S + D,
        C * 2
      );
      g = Math.max(g - j, 0);
    }
    this.emit("cx-resize-start", {
      detail: {
        element: this,
        event: e
      }
    });
    const x = (c) => {
      i = Number(y.width) + (o ? t.x - c.pageX : c.pageX - t.x), s = Number(y.height) + (l ? t.y - c.pageY : c.pageY - t.y), this.keepRatio && (s >= i / this.ratio && (s = i / this.ratio), i >= s * this.ratio && (i = s * this.ratio)), this.resizeSize = {
        height: s,
        width: g ? Math.min(i, g) : i
      };
    }, k = (c) => {
      i > 0 && s > 0 && (this.width = `${g ? Math.min(i, g) : i}px`, this.height = `${s}px`, this.resizeSize = {
        height: 0,
        width: 0
      }, this.isResizing = !1), this.emit("cx-resize-end", {
        detail: {
          element: this,
          event: c
        }
      }), this.ownerDocument.body.removeEventListener("mousemove", x);
    };
    this.ownerDocument.body.addEventListener("mousemove", x), this.ownerDocument.body.addEventListener("mouseup", k, {
      once: !0
    });
  }
  renderResizer() {
    return f`
      <div
        class="resizer resizer--top-left"
        @mousedown=${(e) => {
      this.handleResizeDragging(e, !0, !0);
    }}
      ></div>
      <div
        class="resizer resizer--top-right"
        @mousedown=${(e) => {
      this.handleResizeDragging(e, !1, !0);
    }}
      ></div>
      <div
        class="resizer resizer--bottom-left"
        @mousedown=${(e) => {
      this.handleResizeDragging(e, !0, !1);
    }}
      ></div>
      <div
        class="resizer resizer--bottom-right"
        @mousedown=${(e) => {
      this.handleResizeDragging(e, !1, !1);
    }}
      ></div>
    `;
  }
}
d([
  P('[part="base"]')
], p.prototype, "containingElement");
d([
  a({ reflect: !0, type: String })
], p.prototype, "width");
d([
  a({ reflect: !0, type: String })
], p.prototype, "height");
d([
  a({ reflect: !0, type: Boolean })
], p.prototype, "resizable");
d([
  a({ attribute: "keep-ratio", reflect: !0, type: Boolean })
], p.prototype, "keepRatio");
d([
  a({ attribute: "no-limit", reflect: !0, type: Boolean })
], p.prototype, "noLimit");
d([
  m()
], p.prototype, "isResizeActive");
d([
  m()
], p.prototype, "isResizing");
d([
  m()
], p.prototype, "resizeSize");
const X = R`
  .resizer {
    background-color: var(--cx-color-primary);
    width: 8px;
    height: 8px;
    position: absolute;
    z-index: 100;
  }

  .resizer--top-left {
    top: -1px;
    left: -1px;
    cursor: nw-resize;
  }

  .resizer--top-right {
    top: -1px;
    right: -1px;
    cursor: ne-resize;
  }

  .resizer--bottom-left {
    bottom: -1px;
    left: -1px;
    cursor: sw-resize;
  }

  .resizer--bottom-right {
    bottom: -1px;
    right: -1px;
    cursor: se-resize;
  }
`, Y = R`
  :host {
    --border-radius: 0px;
    --padding: 0px;
    display: block;
    width: var(--width, 100%);
    height: var(--height, auto);
  }

  .container {
    padding: var(--padding, 0px);
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .container--resizing {
    outline: 2px dashed var(--cx-color-primary);
    user-select: none;
  }

  img {
    border-radius: var(--border-radius);
    width: 100%;
    height: 100%;
    display: block;
  }

  img.image--fill {
    object-fit: fill;
  }

  img.image--contain {
    object-fit: contain;
  }

  img.image--cover {
    object-fit: cover;
  }

  img.image--none {
    object-fit: none;
  }

  img.image--scale-down {
    object-fit: scale-down;
  }

  img.image-error {
    display: none;
  }

  .skeleton {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .skeleton cx-skeleton {
    width: 100%;
    height: 100%;
    --border-radius: 0;
  }

  .fallback {
    position: relative;
  }

  .fallback cx-icon {
    --font-size: var(--cx-font-size-4x-large);
  }
`;
var F = Object.defineProperty, H = Object.getOwnPropertyDescriptor, h = (n, e, o, l) => {
  for (var t = l > 1 ? void 0 : l ? H(e, o) : e, i = n.length - 1, s; i >= 0; i--)
    (s = n[i]) && (t = (l ? s(e, o, t) : s(t)) || t);
  return l && t && F(e, o, t), t;
};
let r = class extends p {
  constructor() {
    super(...arguments), this.isLoaded = !1, this.isError = !1, this.src = "", this.placeholder = "", this.alt = "", this.objectFit = "fill", this.skeleton = !1, this.lazy = !1, this.fallback = !1;
  }
  handleLoad() {
    this.isLoaded || (this.emit("cx-load"), this.isLoaded = !0, this.isError = !1);
  }
  handleError() {
    this.emit("cx-error"), this.isLoaded = !0, this.isError = !0;
  }
  handleSrcChange() {
    this.isLoaded = !1, this.isError = !1;
  }
  updated(n) {
    super.updated(n), (n.has("width") || n.has("height") || n.has("resizeSize")) && this.handleSizeChange();
  }
  handleSizeChange() {
    (this.width || this.isResizing) && this.style.setProperty(
      "--width",
      this.isResizing ? `${this.resizeSize.width}px` : this.width
    ), (this.height || this.isResizing) && this.style.setProperty(
      "--height",
      this.isResizing ? `${this.resizeSize.height}px` : this.height
    );
  }
  render() {
    return f`<div
      part="base"
      class=${u({
      container: !0,
      "container--resizing": this.resizable && this.isResizeActive
    })}
      @click=${this.startResizing.bind(this)}
    >
      <img
        part="image"
        class=${u({
      image: !0,
      [`image--${this.objectFit}`]: !0,
      "image-error": this.isError && this.fallback
    })}
        src=${this.src || this.placeholder}
        alt=${this.alt}
        crossorigin="anonymous"
        @load=${this.handleLoad}
        @error=${this.handleError}
        loading=${this.lazy ? "lazy" : "eager"}
      />
      ${z(this.skeleton && !this.isLoaded && !this.isError, () => f`
          <slot name="skeleton" part="skeleton">
            <div
              class=${u({
      skeleton: !0
    })}
            >
              <cx-skeleton effect="sheen"></cx-skeleton>
            </div>
          </slot>
        `)}
      ${z(this.isError && this.fallback, () => f`
          <slot name="fallback" part="fallback">
            <cx-space
              class=${u({ fallback: !0 })}
              direction="column"
              align-items="center"
              justify-content="center"
            >
              <cx-icon name="hide_image" part="fallback-icon"> </cx-icon>
            </cx-space>
          </slot>
        `)}
      ${z(this.resizable && this.isResizeActive, () => this.renderResizer())}
    </div>`;
  }
};
r.styles = [A, X, Y];
r.dependencies = {
  "cx-icon": B,
  "cx-skeleton": N,
  "cx-space": O
};
h([
  m()
], r.prototype, "isLoaded", 2);
h([
  m()
], r.prototype, "isError", 2);
h([
  a({ reflect: !0, type: String })
], r.prototype, "src", 2);
h([
  a({ reflect: !0, type: String })
], r.prototype, "placeholder", 2);
h([
  a({ reflect: !0, type: String })
], r.prototype, "alt", 2);
h([
  a({ attribute: "object-fit", reflect: !0 })
], r.prototype, "objectFit", 2);
h([
  a({ reflect: !0, type: Boolean })
], r.prototype, "skeleton", 2);
h([
  a({ reflect: !0, type: Boolean })
], r.prototype, "lazy", 2);
h([
  a({ reflect: !0, type: Boolean })
], r.prototype, "fallback", 2);
h([
  M("src")
], r.prototype, "handleSrcChange", 1);
r = h([
  V("cx-image")
], r);
export {
  r as C,
  p as R,
  X as r
};
