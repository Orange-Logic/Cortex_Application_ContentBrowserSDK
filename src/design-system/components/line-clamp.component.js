import "./button.js";
import "./tooltip.js";
import "./resize-observer.js";
import { C as x } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { d as C } from "../chunks/debounce.DZNkg8Q5.js";
import { x as l } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { e as T } from "../chunks/query.BNveAlQo.js";
import b from "./line-clamp.styles.js";
var v = Object.defineProperty, N = Object.getOwnPropertyDescriptor, s = (f, o, r, n) => {
  for (var i = n > 1 ? void 0 : n ? N(o, r) : o, h = f.length - 1, t; h >= 0; h--)
    (t = f[h]) && (i = (n ? t(o, r, i) : t(i)) || i);
  return n && i && v(o, r, i), i;
};
const u = class u extends x {
  constructor() {
    super(...arguments), this.lines = 1, this.open = !1, this.showMore = !1, this.showMoreText = "View more...", this.showLessText = "View less...", this.disabledTooltip = !1, this.hoverBridge = !0, this.isClamped = !1, this.tooltipContent = "", this.calculated = !1;
  }
  async updateTooltipContent() {
    const r = this.shadowRoot.querySelector("slot").assignedNodes({ flatten: !0 }), n = async (t) => {
      var a;
      if (t.nodeType === Node.ELEMENT_NODE)
        try {
          let c = t.childNodes.length > 0 || t.shadowRoot ? "" : t.textContent ?? "";
          if (await customElements.whenDefined(t.nodeName.toLowerCase()), t.shadowRoot) {
            const d = ((a = t.shadowRoot) == null ? void 0 : a.childNodes) ?? [];
            for (const y of d)
              c += await n(y);
          }
          for (const d of t.childNodes)
            c += await n(d);
          return c.trim();
        } catch {
        }
      return t.nodeType !== Node.COMMENT_NODE ? t.textContent ?? "" : "";
    }, i = [];
    for (const t of r) {
      const a = await n(t);
      i.push(a);
    }
    const h = i.join("");
    this.tooltipContent = h.trim();
  }
  firstUpdated() {
    this.updateTooltipContent();
  }
  /**
   * This works by comparing the scrollHeight of the element to its clientHeight. When the text is clamped,
   * the scroll height extends below the element's visible area (clientHeight). When the text is not clamped,
   * the scroll height is the same as the clientHeight.
   */
  isTextClamped(o) {
    return o.scrollHeight > o.clientHeight;
  }
  handleResize() {
    this.content && (this.isClamped = this.isTextClamped(this.content), this.calculated = !0);
  }
  toggleShowingMore() {
    this.open = !this.open;
  }
  render() {
    const o = l`<div>
      <cx-resize-observer @cx-resize=${this.handleResize}>
        <span
          class="content"
          part="content"
          style="-webkit-line-clamp: ${this.lines}"
          @slotchange=${this.updateTooltipContent}
        >
          <slot></slot>
        </span>
      </cx-resize-observer>
    </div>`;
    let r = l``;
    return this.isClamped && (r = l`<cx-button
        part="toggler"
        size="small"
        variant="text"
        class="toggler"
        title=""
        @click=${this.toggleShowingMore}
      >
        ${this.open ? this.showLessText : this.showMoreText}
      </cx-button>`), this.showMore ? l`
        ${this.open && this.calculated ? l`<slot></slot>` : o}
        ${r}
      ` : this.disabledTooltip ? o : this.tooltip ? l`
        <cx-tooltip
          content=${this.tooltip}
          hoist
          .hoverBridge=${this.hoverBridge}
          >${o}
        </cx-tooltip>
      ` : l`
      ${this.isClamped ? l`<cx-tooltip
            content=${this.tooltipContent}
            hoist
            .hoverBridge=${this.hoverBridge}
          >
            ${o}
          </cx-tooltip>` : o}
    `;
  }
};
u.styles = [g, b];
let e = u;
s([
  p({ type: Number })
], e.prototype, "lines", 2);
s([
  p({ reflect: !0, type: Boolean })
], e.prototype, "open", 2);
s([
  p({ attribute: "show-more", type: Boolean })
], e.prototype, "showMore", 2);
s([
  p({ attribute: "show-more-text", type: String })
], e.prototype, "showMoreText", 2);
s([
  p({ attribute: "show-less-text", type: String })
], e.prototype, "showLessText", 2);
s([
  p({ type: String })
], e.prototype, "tooltip", 2);
s([
  p({ attribute: "disabled-tooltip", type: Boolean })
], e.prototype, "disabledTooltip", 2);
s([
  p({ type: Boolean })
], e.prototype, "hoverBridge", 2);
s([
  m()
], e.prototype, "isClamped", 2);
s([
  m()
], e.prototype, "tooltipContent", 2);
s([
  m()
], e.prototype, "calculated", 2);
s([
  T(".content")
], e.prototype, "content", 2);
s([
  C(100)
], e.prototype, "handleResize", 1);
export {
  e as default
};
