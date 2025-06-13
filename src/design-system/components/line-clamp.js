import "./button.js";
import "./tooltip.js";
import "./resize-observer.js";
import { C as g, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { d as y } from "../chunks/debounce.DZNkg8Q5.js";
import { i as C, x as n } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { e as b } from "../chunks/query.BNveAlQo.js";
const v = C`
  :host {
    --toggler-color: var(--cx-color-primary);
  }

  .content {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow-wrap: break-word;
  }

  .toggler {
    display: block;
    margin-top: var(cx--spacing-2x-small);
  }

  .toggler::part(base) {
    color: var(--toggler-color);
    font-weight: var(--cx-font-weight-medium);
    text-transform: none;
    width: auto;
  }

  .toggler::part(label) {
    padding-left: 0;
  }
`;
var T = Object.defineProperty, N = Object.getOwnPropertyDescriptor, o = (s, i, a, h) => {
  for (var r = h > 1 ? void 0 : h ? N(i, a) : i, t = s.length - 1, l; t >= 0; t--)
    (l = s[t]) && (r = (h ? l(i, a, r) : l(r)) || r);
  return h && r && T(i, a, r), r;
};
let e = class extends g {
  constructor() {
    super(...arguments), this.lines = 1, this.open = !1, this.showMore = !1, this.showMoreText = "View more...", this.showLessText = "View less...", this.disabledTooltip = !1, this.hoverBridge = !0, this.isClamped = !1, this.tooltipContent = "", this.calculated = !1;
  }
  async updateTooltipContent() {
    const i = this.shadowRoot.querySelector("slot").assignedNodes({ flatten: !0 }), a = async (t) => {
      var l;
      if (t.nodeType === Node.ELEMENT_NODE)
        try {
          let c = t.childNodes.length > 0 || t.shadowRoot ? "" : t.textContent ?? "";
          if (await customElements.whenDefined(t.nodeName.toLowerCase()), t.shadowRoot) {
            const d = ((l = t.shadowRoot) == null ? void 0 : l.childNodes) ?? [];
            for (const w of d)
              c += await a(w);
          }
          for (const d of t.childNodes)
            c += await a(d);
          return c.trim();
        } catch {
        }
      return t.nodeType !== Node.COMMENT_NODE ? t.textContent ?? "" : "";
    }, h = [];
    for (const t of i) {
      const l = await a(t);
      h.push(l);
    }
    const r = h.join("");
    this.tooltipContent = r.trim();
  }
  firstUpdated() {
    this.updateTooltipContent();
  }
  /**
   * This works by comparing the scrollHeight of the element to its clientHeight. When the text is clamped,
   * the scroll height extends below the element's visible area (clientHeight). When the text is not clamped,
   * the scroll height is the same as the clientHeight.
   */
  isTextClamped(s) {
    return s.scrollHeight > s.clientHeight;
  }
  handleResize() {
    this.content && (this.isClamped = this.isTextClamped(this.content), this.calculated = !0);
  }
  toggleShowingMore() {
    this.open = !this.open;
  }
  render() {
    const s = n`<div>
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
    let i = n``;
    return this.isClamped && (i = n`<cx-button
        part="toggler"
        size="small"
        variant="text"
        class="toggler"
        title=""
        @click=${this.toggleShowingMore}
      >
        ${this.open ? this.showLessText : this.showMoreText}
      </cx-button>`), this.showMore ? n`
        ${this.open && this.calculated ? n`<slot></slot>` : s}
        ${i}
      ` : this.disabledTooltip ? s : this.tooltip ? n`
        <cx-tooltip
          content=${this.tooltip}
          hoist
          .hoverBridge=${this.hoverBridge}
          >${s}
        </cx-tooltip>
      ` : n`
      ${this.isClamped ? n`<cx-tooltip
            content=${this.tooltipContent}
            hoist
            .hoverBridge=${this.hoverBridge}
          >
            ${s}
          </cx-tooltip>` : s}
    `;
  }
};
e.styles = [x, v];
o([
  p({ type: Number })
], e.prototype, "lines", 2);
o([
  p({ reflect: !0, type: Boolean })
], e.prototype, "open", 2);
o([
  p({ attribute: "show-more", type: Boolean })
], e.prototype, "showMore", 2);
o([
  p({ attribute: "show-more-text", type: String })
], e.prototype, "showMoreText", 2);
o([
  p({ attribute: "show-less-text", type: String })
], e.prototype, "showLessText", 2);
o([
  p({ type: String })
], e.prototype, "tooltip", 2);
o([
  p({ attribute: "disabled-tooltip", type: Boolean })
], e.prototype, "disabledTooltip", 2);
o([
  p({ type: Boolean })
], e.prototype, "hoverBridge", 2);
o([
  m()
], e.prototype, "isClamped", 2);
o([
  m()
], e.prototype, "tooltipContent", 2);
o([
  m()
], e.prototype, "calculated", 2);
o([
  b(".content")
], e.prototype, "content", 2);
o([
  y(100)
], e.prototype, "handleResize", 1);
e = o([
  u("cx-line-clamp")
], e);
export {
  e as default
};
