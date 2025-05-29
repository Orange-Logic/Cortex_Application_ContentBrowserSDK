import "./resize-observer.js";
import { C as S } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as T } from "../chunks/component.styles.BLcT4bOa.js";
import { s as g } from "../chunks/scroll.DwPiX2Ox.js";
import { w as y } from "../chunks/watch.ChG-_stu.js";
import { x as p } from "../chunks/lit-element.DRlPF2me.js";
import { n as d } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { t as x } from "../chunks/event-options.CYHYGOd8.js";
import { e as u } from "../chunks/query.BNveAlQo.js";
import { e as f } from "../chunks/class-map.Cn0czwWq.js";
import { L as w } from "../chunks/localize.DV9I313e.js";
import _ from "./icon-button.component.js";
import A from "./tab-group.styles.js";
import C from "./resize-observer.component.js";
var $ = Object.defineProperty, z = Object.getOwnPropertyDescriptor, a = (v, t, s, e) => {
  for (var o = e > 1 ? void 0 : e ? z(t, s) : t, i = v.length - 1, c; i >= 0; i--)
    (c = v[i]) && (o = (e ? c(t, s, o) : c(o)) || o);
  return e && o && $(t, s, o), o;
};
const b = class b extends S {
  constructor() {
    super(...arguments), this.localize = new w(this), this.tabs = [], this.focusableTabs = [], this.panels = [], this.hasScrollControls = !1, this.shouldHideScrollStartButton = !1, this.shouldHideScrollEndButton = !1, this.placement = "top", this.activation = "auto", this.noScrollControls = !1, this.fixedScrollControls = !1, this.scrollOffset = 1;
  }
  connectedCallback() {
    const t = Promise.all([
      customElements.whenDefined("cx-tab"),
      customElements.whenDefined("cx-tab-panel")
    ]);
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => {
      this.repositionIndicator(), this.updateScrollControls();
    }), this.mutationObserver = new MutationObserver((s) => {
      s.some(
        (e) => !["aria-labelledby", "aria-controls"].includes(e.attributeName)
      ) && setTimeout(() => this.setAriaLabels()), s.some((e) => e.attributeName === "disabled") && this.syncTabsAndPanels();
    }), this.updateComplete.then(() => {
      this.syncTabsAndPanels(), this.mutationObserver.observe(this, {
        attributes: !0,
        childList: !0,
        subtree: !0
      }), this.resizeObserver.observe(this.nav), t.then(() => {
        new IntersectionObserver(
          (e, o) => {
            e[0].intersectionRatio > 0 && (this.setAriaLabels(), this.setActiveTab(this.getActiveTab() ?? this.tabs[0], {
              emitEvents: !1
            }), o.unobserve(e[0].target));
          }
        ).observe(this.tabGroup);
      });
    });
  }
  disconnectedCallback() {
    var t, s;
    super.disconnectedCallback(), (t = this.mutationObserver) == null || t.disconnect(), this.nav && ((s = this.resizeObserver) == null || s.unobserve(this.nav));
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
    const e = t.target.closest("cx-tab");
    (e == null ? void 0 : e.closest("cx-tab-group")) === this && e !== null && this.setActiveTab(e, { scrollBehavior: "smooth" });
  }
  handleKeyDown(t) {
    const e = t.target.closest("cx-tab");
    if ((e == null ? void 0 : e.closest("cx-tab-group")) === this && (["Enter", " "].includes(t.key) && e !== null && (this.setActiveTab(e, { scrollBehavior: "smooth" }), t.preventDefault()), [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ].includes(t.key))) {
      const i = this.tabs.find((n) => n.matches(":focus")), c = this.localize.dir() === "rtl";
      let l = null;
      if ((i == null ? void 0 : i.tagName.toLowerCase()) === "cx-tab") {
        if (t.key === "Home")
          l = this.focusableTabs[0];
        else if (t.key === "End")
          l = this.focusableTabs[this.focusableTabs.length - 1];
        else if (["top", "bottom"].includes(this.placement) && t.key === (c ? "ArrowRight" : "ArrowLeft") || ["start", "end"].includes(this.placement) && t.key === "ArrowUp") {
          const n = this.tabs.findIndex((h) => h === i);
          l = this.findNextFocusableTab(n, "backward");
        } else if (["top", "bottom"].includes(this.placement) && t.key === (c ? "ArrowLeft" : "ArrowRight") || ["start", "end"].includes(this.placement) && t.key === "ArrowDown") {
          const n = this.tabs.findIndex((h) => h === i);
          l = this.findNextFocusableTab(n, "forward");
        }
        if (!l)
          return;
        l.tabIndex = 0, l.focus({ preventScroll: !0 }), this.activation === "auto" ? this.setActiveTab(l, { scrollBehavior: "smooth" }) : this.tabs.forEach((n) => {
          n.tabIndex = n === l ? 0 : -1;
        }), ["top", "bottom"].includes(this.placement) && g(l, this.nav, "horizontal"), t.preventDefault();
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
  setActiveTab(t, s) {
    if (s = {
      emitEvents: !0,
      scrollBehavior: "auto",
      ...s
    }, t !== this.activeTab && !t.disabled) {
      const e = this.activeTab;
      this.activeTab = t, this.tabs.forEach((o) => {
        o.active = o === this.activeTab, o.tabIndex = o === this.activeTab ? 0 : -1;
      }), this.panels.forEach(
        (o) => {
          var i;
          return o.active = o.name === ((i = this.activeTab) == null ? void 0 : i.panel);
        }
      ), this.syncIndicator(), ["top", "bottom"].includes(this.placement) && g(
        this.activeTab,
        this.nav,
        "horizontal",
        s.scrollBehavior
      ), s.emitEvents && (e && this.emit("cx-tab-hide", { detail: { name: e.panel } }), this.emit("cx-tab-show", { detail: { name: this.activeTab.panel } }));
    }
  }
  setAriaLabels() {
    this.tabs.forEach((t) => {
      const s = this.panels.find((e) => e.name === t.panel);
      s && (t.setAttribute("aria-controls", s.getAttribute("id")), s.setAttribute("aria-labelledby", t.getAttribute("id")));
    });
  }
  repositionIndicator() {
    const t = this.getActiveTab();
    if (!t)
      return;
    const s = t.clientWidth, e = t.clientHeight, o = this.localize.dir() === "rtl", i = this.getAllTabs(), l = i.slice(0, i.indexOf(t)).reduce(
      (n, h) => ({
        left: n.left + h.clientWidth,
        top: n.top + h.clientHeight
      }),
      { left: 0, top: 0 }
    );
    switch (this.placement) {
      case "top":
      case "bottom":
        this.indicator.style.width = `${s}px`, this.indicator.style.height = "auto", this.indicator.style.translate = o ? `${-1 * l.left}px` : `${l.left}px`;
        break;
      case "start":
      case "end":
        this.indicator.style.width = "auto", this.indicator.style.height = `${e}px`, this.indicator.style.translate = `0 ${l.top}px`;
        break;
    }
  }
  // This stores tabs and panels so we can refer to a cache instead of calling querySelectorAll() multiple times.
  syncTabsAndPanels() {
    this.tabs = this.getAllTabs(), this.focusableTabs = this.tabs.filter((t) => !t.disabled), this.panels = this.getAllPanels(), this.syncIndicator(), this.updateComplete.then(() => this.updateScrollControls());
  }
  findNextFocusableTab(t, s) {
    let e = null;
    const o = s === "forward" ? 1 : -1;
    let i = t + o;
    for (; t < this.tabs.length; ) {
      if (e = this.tabs[i] || null, e === null) {
        s === "forward" ? e = this.focusableTabs[0] : e = this.focusableTabs[this.focusableTabs.length - 1];
        break;
      }
      if (!e.disabled)
        break;
      i += o;
    }
    return e;
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
  /** Shows the specified tab panel. */
  show(t) {
    const s = this.tabs.find((e) => e.panel === t);
    s && this.setActiveTab(s, { scrollBehavior: "smooth" });
  }
  render() {
    const t = this.localize.dir() === "rtl";
    return p`
      <div
        part="base"
        class=${f({
      "tab-group": !0,
      "tab-group--bottom": this.placement === "bottom",
      "tab-group--end": this.placement === "end",
      "tab-group--has-scroll-controls": this.hasScrollControls,
      "tab-group--rtl": this.localize.dir() === "rtl",
      "tab-group--start": this.placement === "start",
      "tab-group--top": this.placement === "top"
    })}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls ? p`
                <cx-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${f({
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
                  class=${f({
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
b.styles = [T, A], b.dependencies = {
  "cx-icon-button": _,
  "cx-resize-observer": C
};
let r = b;
a([
  u(".tab-group")
], r.prototype, "tabGroup", 2);
a([
  u(".tab-group__body")
], r.prototype, "body", 2);
a([
  u(".tab-group__nav")
], r.prototype, "nav", 2);
a([
  u(".tab-group__indicator")
], r.prototype, "indicator", 2);
a([
  m()
], r.prototype, "hasScrollControls", 2);
a([
  m()
], r.prototype, "shouldHideScrollStartButton", 2);
a([
  m()
], r.prototype, "shouldHideScrollEndButton", 2);
a([
  d()
], r.prototype, "placement", 2);
a([
  d()
], r.prototype, "activation", 2);
a([
  d({ attribute: "no-scroll-controls", type: Boolean })
], r.prototype, "noScrollControls", 2);
a([
  d({ attribute: "fixed-scroll-controls", type: Boolean })
], r.prototype, "fixedScrollControls", 2);
a([
  x({ passive: !0 })
], r.prototype, "updateScrollButtons", 1);
a([
  y("noScrollControls", { waitUntilFirstUpdate: !0 })
], r.prototype, "updateScrollControls", 1);
a([
  y("placement", { waitUntilFirstUpdate: !0 })
], r.prototype, "syncIndicator", 1);
export {
  r as default
};
