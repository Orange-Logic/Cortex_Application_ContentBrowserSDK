import m from "./resize-observer.js";
import { C as _, c as x } from "../chunks/custom-element.X6y1saJZ.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { s as v } from "../chunks/scroll.DwPiX2Ox.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { i as w, x as p } from "../chunks/lit-element.DRlPF2me.js";
import { n as d } from "../chunks/property.CtZ87in4.js";
import { r as f } from "../chunks/state.-o_YRGMi.js";
import { t as T } from "../chunks/event-options.CYHYGOd8.js";
import { e as u } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { L as S } from "../chunks/localize.D5Yoww6T.js";
import k from "./icon-button.js";
const C = w`
  :host {
    --indicator-color: var(--cx-color-primary-600);
    --track-color: var(--cx-color-neutral-200);
    --track-width: 2px;

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group--button .tab-group__tabs {
    background-color: var(--cx-color-neutral-100);
    border-radius: 12px;
    padding: var(--cx-spacing-2x-small);
    flex: 0 0 auto;
  }

  .tab-group__indicator {
    position: absolute;
    transition:
      var(--cx-transition-fast) translate ease,
      var(--cx-transition-fast) width ease;
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--cx-spacing-x-large);
  }

  .tab-group--has-scroll-controls .tab-group__scroll-button--start--hidden,
  .tab-group--has-scroll-controls .tab-group__scroll-button--end--hidden {
    visibility: hidden;
  }

  .tab-group__body {
    display: block;
    overflow: auto;
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--cx-spacing-x-large);
  }

  .tab-group__scroll-button--start {
    left: 0;
  }

  .tab-group__scroll-button--end {
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--start {
    left: auto;
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--end {
    left: 0;
    right: auto;
  }

  /*
   * Top
   */

  .tab-group--top {
    flex-direction: column;
  }

  .tab-group--top .tab-group__nav-container {
    order: 1;
  }

  .tab-group--top .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--top .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--top .tab-group__tabs {
    position: relative;
    flex-direction: row;
  }

  .tab-group--default.tab-group--top .tab-group__tabs {
    flex: 1 1 auto;
    border-bottom: solid var(--track-width) var(--track-color);
  }

  .tab-group--top .tab-group__indicator {
    bottom: calc(-1 * var(--track-width));
    border-bottom: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--top .tab-group__body {
    order: 2;
  }

  .tab-group--top ::slotted(cx-tab-panel) {
    --padding: var(--cx-spacing-medium) 0;
  }

  /*
   * Bottom
   */

  .tab-group--bottom {
    flex-direction: column;
  }

  .tab-group--bottom .tab-group__nav-container {
    order: 2;
  }

  .tab-group--bottom .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--bottom .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--bottom .tab-group__tabs {
    position: relative;
    flex-direction: row;
  }

  .tab-group--default.tab-group--bottom .tab-group__tabs {
    flex: 1 1 auto;
    border-top: solid var(--track-width) var(--track-color);
  }

  .tab-group--bottom .tab-group__indicator {
    top: calc(-1 * var(--track-width));
    border-top: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--bottom .tab-group__body {
    order: 1;
  }

  .tab-group--bottom ::slotted(cx-tab-panel) {
    --padding: var(--cx-spacing-medium) 0;
  }

  /*
   * Start
   */

  .tab-group--start {
    flex-direction: row;
  }

  .tab-group--start .tab-group__nav-container {
    order: 1;
  }

  .tab-group--start .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
  }

  .tab-group--start .tab-group__indicator {
    right: calc(-1 * var(--track-width));
  }

  .tab-group--default.tab-group--start .tab-group__tabs {
    border-inline-end: solid var(--track-width) var(--track-color);
  }

  .tab-group--default.tab-group--start .tab-group__indicator {
    border-right: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--start.tab-group--rtl .tab-group__indicator {
    right: auto;
    left: calc(-1 * var(--track-width));
  }

  .tab-group--start .tab-group__body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group--start ::slotted(cx-tab-panel) {
    --padding: 0 var(--cx-spacing-medium);
  }

  /*
   * End
   */

  .tab-group--end {
    flex-direction: row;
  }

  .tab-group--end .tab-group__nav-container {
    order: 2;
  }

  .tab-group--end .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
  }

  .tab-group--default.tab-group--end .tab-group__tabs {
    border-left: solid var(--track-width) var(--track-color);
  }

  .tab-group--end .tab-group__indicator {
    left: calc(-1 * var(--track-width));
  }

  .tab-group--default.tab-group--end .tab-group__indicator {
    border-inline-start: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--end.tab-group--rtl .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    left: auto;
  }

  .tab-group--end .tab-group__body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group--end ::slotted(cx-tab-panel) {
    --padding: 0 var(--cx-spacing-medium);
  }
`;
var A = Object.defineProperty, E = Object.getOwnPropertyDescriptor, l = (t, r, o, e) => {
  for (var a = e > 1 ? void 0 : e ? E(r, o) : r, c = t.length - 1, i; c >= 0; c--)
    (i = t[c]) && (a = (e ? i(r, o, a) : i(a)) || a);
  return e && a && A(r, o, a), a;
};
let s = class extends _ {
  constructor() {
    super(...arguments), this.localize = new S(this), this.tabs = [], this.focusableTabs = [], this.panels = [], this.hasScrollControls = !1, this.shouldHideScrollStartButton = !1, this.shouldHideScrollEndButton = !1, this.placement = "top", this.activation = "auto", this.noScrollControls = !1, this.fixedScrollControls = !1, this.variant = "default", this.scrollOffset = 1;
  }
  connectedCallback() {
    const t = Promise.all([
      customElements.whenDefined("cx-tab"),
      customElements.whenDefined("cx-tab-panel")
    ]);
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => {
      this.repositionIndicator(), this.updateScrollControls();
    }), this.mutationObserver = new MutationObserver((r) => {
      r.some(
        (o) => !["aria-labelledby", "aria-controls"].includes(o.attributeName)
      ) && setTimeout(() => this.setAriaLabels()), r.some((o) => o.attributeName === "disabled") && this.syncTabsAndPanels();
    }), this.updateComplete.then(() => {
      this.syncTabsAndPanels(), this.mutationObserver.observe(this, {
        attributes: !0,
        childList: !0,
        subtree: !0
      }), this.resizeObserver.observe(this.nav), t.then(() => {
        new IntersectionObserver(
          (o, e) => {
            o[0].intersectionRatio > 0 && (this.setAriaLabels(), this.setActiveTab(this.getActiveTab() ?? this.tabs[0], {
              emitEvents: !1
            }), e.unobserve(o[0].target));
          }
        ).observe(this.tabGroup);
      });
    });
  }
  disconnectedCallback() {
    var t, r;
    super.disconnectedCallback(), (t = this.mutationObserver) == null || t.disconnect(), this.nav && ((r = this.resizeObserver) == null || r.unobserve(this.nav));
  }
  getAllTabs() {
    return this.shadowRoot.querySelector('slot[name="nav"]').assignedElements();
  }
  getAllPanels() {
    return [...this.body.assignedElements()].filter(
      (t) => t.tagName.toLowerCase() === "cx-tab-panel"
    );
  }
  getActiveTab() {
    return this.tabs.find((t) => t.active);
  }
  handleClick(t) {
    const o = t.target.closest("cx-tab");
    (o == null ? void 0 : o.closest("cx-tab-group")) === this && o !== null && this.setActiveTab(o, { scrollBehavior: "smooth" });
  }
  handleKeyDown(t) {
    const o = t.target.closest("cx-tab");
    if ((o == null ? void 0 : o.closest("cx-tab-group")) === this && (["Enter", " "].includes(t.key) && o !== null && (this.setActiveTab(o, { scrollBehavior: "smooth" }), t.preventDefault()), [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ].includes(t.key))) {
      const a = this.tabs.find((n) => n.matches(":focus")), c = this.localize.dir() === "rtl";
      let i = null;
      if ((a == null ? void 0 : a.tagName.toLowerCase()) === "cx-tab") {
        if (t.key === "Home")
          i = this.focusableTabs[0];
        else if (t.key === "End")
          i = this.focusableTabs[this.focusableTabs.length - 1];
        else if (["top", "bottom"].includes(this.placement) && t.key === (c ? "ArrowRight" : "ArrowLeft") || ["start", "end"].includes(this.placement) && t.key === "ArrowUp") {
          const n = this.tabs.findIndex((b) => b === a);
          i = this.findNextFocusableTab(n, "backward");
        } else if (["top", "bottom"].includes(this.placement) && t.key === (c ? "ArrowLeft" : "ArrowRight") || ["start", "end"].includes(this.placement) && t.key === "ArrowDown") {
          const n = this.tabs.findIndex((b) => b === a);
          i = this.findNextFocusableTab(n, "forward");
        }
        if (!i)
          return;
        i.tabIndex = 0, i.focus({ preventScroll: !0 }), this.activation === "auto" ? this.setActiveTab(i, { scrollBehavior: "smooth" }) : this.tabs.forEach((n) => {
          n.tabIndex = n === i ? 0 : -1;
        }), ["top", "bottom"].includes(this.placement) && v(i, this.nav, "horizontal"), t.preventDefault();
      }
    }
  }
  handleScrollToStart() {
    this.nav.scroll({
      behavior: "smooth",
      left: this.localize.dir() === "rtl" ? this.nav.scrollLeft + this.nav.clientWidth : this.nav.scrollLeft - this.nav.clientWidth
    });
  }
  handleScrollToEnd() {
    this.nav.scroll({
      behavior: "smooth",
      left: this.localize.dir() === "rtl" ? this.nav.scrollLeft - this.nav.clientWidth : this.nav.scrollLeft + this.nav.clientWidth
    });
  }
  setActiveTab(t, r) {
    if (r = {
      emitEvents: !0,
      scrollBehavior: "auto",
      ...r
    }, t !== this.activeTab && !t.disabled) {
      const o = this.activeTab;
      this.activeTab = t, this.tabs.forEach((e) => {
        e.active = e === this.activeTab, e.tabIndex = e === this.activeTab ? 0 : -1;
      }), this.panels.forEach(
        (e) => {
          var a;
          return e.active = e.name === ((a = this.activeTab) == null ? void 0 : a.panel);
        }
      ), this.syncIndicator(), ["top", "bottom"].includes(this.placement) && v(
        this.activeTab,
        this.nav,
        "horizontal",
        r.scrollBehavior
      ), r.emitEvents && (o && this.emit("cx-tab-hide", { detail: { name: o.panel } }), this.emit("cx-tab-show", { detail: { name: this.activeTab.panel } }));
    }
  }
  setAriaLabels() {
    this.tabs.forEach((t) => {
      const r = this.panels.find((o) => o.name === t.panel);
      r && (t.setAttribute("aria-controls", r.getAttribute("id")), r.setAttribute("aria-labelledby", t.getAttribute("id")));
    });
  }
  repositionIndicator() {
    const t = this.getActiveTab();
    if (!t)
      return;
    const r = t.clientWidth, o = t.clientHeight, e = this.localize.dir() === "rtl", a = this.getAllTabs(), i = a.slice(0, a.indexOf(t)).reduce(
      (n, b) => ({
        left: n.left + b.clientWidth,
        top: n.top + b.clientHeight
      }),
      { left: 0, top: 0 }
    );
    switch (this.placement) {
      case "top":
      case "bottom":
        this.indicator.style.width = `${r}px`, this.indicator.style.height = "auto", this.indicator.style.translate = e ? `${-1 * i.left}px` : `${i.left}px`;
        break;
      case "start":
      case "end":
        this.indicator.style.width = "auto", this.indicator.style.height = `${o}px`, this.indicator.style.translate = `0 ${i.top}px`;
        break;
    }
  }
  // This stores tabs and panels so we can refer to a cache instead of calling querySelectorAll() multiple times.
  syncTabsAndPanels() {
    this.tabs = this.getAllTabs(), this.focusableTabs = this.tabs.filter((t) => !t.disabled), this.panels = this.getAllPanels(), this.syncIndicator(), this.updateComplete.then(() => this.updateScrollControls());
  }
  findNextFocusableTab(t, r) {
    let o = null;
    const e = r === "forward" ? 1 : -1;
    let a = t + e;
    for (; t < this.tabs.length; ) {
      if (o = this.tabs[a] || null, o === null) {
        r === "forward" ? o = this.focusableTabs[0] : o = this.focusableTabs[this.focusableTabs.length - 1];
        break;
      }
      if (!o.disabled)
        break;
      a += e;
    }
    return o;
  }
  updateScrollButtons() {
    this.hasScrollControls && !this.fixedScrollControls && (this.shouldHideScrollStartButton = this.scrollFromStart() <= this.scrollOffset, this.shouldHideScrollEndButton = this.isScrolledToEnd());
  }
  isScrolledToEnd() {
    return this.scrollFromStart() + this.nav.clientWidth >= this.nav.scrollWidth - this.scrollOffset;
  }
  scrollFromStart() {
    return this.localize.dir() === "rtl" ? -this.nav.scrollLeft : this.nav.scrollLeft;
  }
  updateScrollControls() {
    this.noScrollControls ? this.hasScrollControls = !1 : this.hasScrollControls = ["top", "bottom"].includes(this.placement) && this.nav.scrollWidth > this.nav.clientWidth + 1, this.updateScrollButtons();
  }
  syncIndicator() {
    this.getActiveTab() ? (this.indicator.style.display = "block", this.repositionIndicator()) : this.indicator.style.display = "none";
  }
  handleVariantChange() {
    this.tabs.forEach((t) => {
      t.requestUpdate();
    });
  }
  /** Shows the specified tab panel. */
  show(t) {
    const r = this.tabs.find((o) => o.panel === t);
    r && this.setActiveTab(r, { scrollBehavior: "smooth" });
  }
  render() {
    const t = this.localize.dir() === "rtl";
    return p`
      <div
        part="base"
        class=${h({
      "tab-group": !0,
      "tab-group--bottom": this.placement === "bottom",
      "tab-group--end": this.placement === "end",
      "tab-group--has-scroll-controls": this.hasScrollControls,
      "tab-group--rtl": this.localize.dir() === "rtl",
      "tab-group--start": this.placement === "start",
      "tab-group--top": this.placement === "top",
      [`tab-group--${this.variant}`]: !0
    })}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls ? p`
                <cx-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${h({
      "tab-group__scroll-button": !0,
      "tab-group__scroll-button--start": !0,
      "tab-group__scroll-button--start--hidden": this.shouldHideScrollStartButton
    })}
                  name=${t ? "chevron_right" : "chevron_left"}
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term("scrollToStart")}
                  @click=${this.handleScrollToStart}
                ></cx-icon-button>
              ` : ""}

          <div class="tab-group__nav" @scrollend=${this.updateScrollButtons}>
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div
                part="active-tab-indicator"
                class="tab-group__indicator"
              ></div>
              <cx-resize-observer @cx-resize=${this.syncIndicator}>
                <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
              </cx-resize-observer>
            </div>
          </div>

          ${this.hasScrollControls ? p`
                <cx-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class=${h({
      "tab-group__scroll-button": !0,
      "tab-group__scroll-button--end": !0,
      "tab-group__scroll-button--end--hidden": this.shouldHideScrollEndButton
    })}
                  name=${t ? "chevron_left" : "chevron_right"}
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term("scrollToEnd")}
                  @click=${this.handleScrollToEnd}
                ></cx-icon-button>
              ` : ""}
        </div>

        <slot
          part="body"
          class="tab-group__body"
          @slotchange=${this.syncTabsAndPanels}
        ></slot>
      </div>
    `;
  }
};
s.styles = [y, C];
s.dependencies = {
  "cx-icon-button": k,
  "cx-resize-observer": m
};
l([
  u(".tab-group")
], s.prototype, "tabGroup", 2);
l([
  u(".tab-group__body")
], s.prototype, "body", 2);
l([
  u(".tab-group__nav")
], s.prototype, "nav", 2);
l([
  u(".tab-group__indicator")
], s.prototype, "indicator", 2);
l([
  f()
], s.prototype, "hasScrollControls", 2);
l([
  f()
], s.prototype, "shouldHideScrollStartButton", 2);
l([
  f()
], s.prototype, "shouldHideScrollEndButton", 2);
l([
  d()
], s.prototype, "placement", 2);
l([
  d()
], s.prototype, "activation", 2);
l([
  d({ attribute: "no-scroll-controls", type: Boolean })
], s.prototype, "noScrollControls", 2);
l([
  d({ attribute: "fixed-scroll-controls", type: Boolean })
], s.prototype, "fixedScrollControls", 2);
l([
  d({ reflect: !0, type: String })
], s.prototype, "variant", 2);
l([
  T({ passive: !0 })
], s.prototype, "updateScrollButtons", 1);
l([
  g("noScrollControls", { waitUntilFirstUpdate: !0 })
], s.prototype, "updateScrollControls", 1);
l([
  g("placement", { waitUntilFirstUpdate: !0 })
], s.prototype, "syncIndicator", 1);
l([
  g("variant", { waitUntilFirstUpdate: !0 })
], s.prototype, "handleVariantChange", 1);
s = l([
  x("cx-tab-group")
], s);
export {
  s as default
};
