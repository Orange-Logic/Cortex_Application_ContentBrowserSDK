import { i as O, a as C, x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as w } from "../chunks/state.-o_YRGMi.js";
import { e as b } from "../chunks/query.BNveAlQo.js";
import { e as P } from "../chunks/base.CwU3eNq-.js";
import { o as g } from "../chunks/if-defined.D8U9hdvp.js";
import { o as f } from "../chunks/style-map.De8UQbPP.js";
import { nextFrame as y, AbstractOverlay as S } from "./AbstractOverlay.js";
import { ElementResolutionController as $, elementResolverUpdatedSymbol as R } from "./reactive-controllers.js";
import { randomID as _ } from "./shared.js";
import { OverlayDialog as q } from "./OverlayDialog.js";
import { OverlayNoPopover as D } from "./OverlayNoPopover.js";
import { OverlayPopover as N } from "./OverlayPopover.js";
import { overlayStack as v } from "./OverlayStack.js";
import { P as F } from "../chunks/PlacementController.D3pNuMGu.js";
import { VirtualTrigger as T } from "./VirtualTrigger.js";
import { LONGPRESS_INSTRUCTIONS as ce } from "./LongpressController.js";
import { c as B } from "../chunks/component.styles.BLcT4bOa.js";
import A from "./overlay.style.js";
import { SlottableRequestEvent as L, removeSlottableRequest as U } from "./slottable-request-event.js";
import { strategies as I } from "./strategies.js";
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function V(d) {
  return (e, t) => {
    const { slot: i, selector: s } = d, l = "slot" + (i ? `[name=${i}]` : ":not([name])");
    return P(e, t, { get() {
      var m;
      const a = (m = this.renderRoot) == null ? void 0 : m.querySelector(l), p = (a == null ? void 0 : a.assignedElements(d)) ?? [];
      return s === void 0 ? p : p.filter((E) => E.matches(s));
    } });
  };
}
var x = Object.defineProperty, M = Object.getOwnPropertyDescriptor, r = (d, e, t, i) => {
  for (var s = i > 1 ? void 0 : i ? M(e, t) : e, l = d.length - 1, a; l >= 0; l--)
    (a = d[l]) && (s = (i ? a(e, t, s) : a(s)) || s);
  return i && s && x(e, t, s), s;
};
const j = CSS.supports("(overlay: auto)") && "showPopover" in document.createElement("div");
let c = q(S);
j ? c = N(c) : c = D(c);
var h;
const o = (h = class extends c {
  constructor() {
    super(...arguments), this._delayed = !1, this._disabled = !1, this.offset = 0, this._open = !1, this.lastRequestSlottableState = !1, this.receivesFocus = "auto", this._state = "closed", this.triggerElement = null, this.type = "auto", this.wasOpen = !1, this.closeOnFocusOut = (e) => {
      if (!e.relatedTarget)
        return;
      const t = new Event("overlay-relation-query", {
        bubbles: !0,
        composed: !0
      });
      e.relatedTarget.addEventListener(t.type, (i) => {
        i.composedPath().includes(this) || (this.open = !1);
      }), e.relatedTarget.dispatchEvent(t);
    };
  }
  get delayed() {
    return this.elements.length ? this.elements[this.elements.length - 1].hasAttribute("delayed") || this._delayed : this._delayed;
  }
  set delayed(e) {
    this._delayed = e;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(e) {
    var t;
    this._disabled = e, e ? ((t = this.strategy) == null || t.abort(), this.wasOpen = this.open, this.open = !1) : (this.bindEvents(), this.open = this.open || this.wasOpen, this.wasOpen = !1);
  }
  get hasNonVirtualTrigger() {
    return !!this.triggerElement && !(this.triggerElement instanceof T);
  }
  get placementController() {
    return this._placementController || (this._placementController = new F(this)), this._placementController;
  }
  get open() {
    return this._open;
  }
  set open(e) {
    var t;
    e && this.disabled || e !== this.open && ((t = this.strategy) != null && t.activelyOpening && !e || (this._open = e, this.open && (h.openCount += 1), this.requestUpdate("open", !this.open), this.open && this.requestSlottable()));
  }
  get state() {
    return this._state;
  }
  set state(e) {
    var i;
    if (e === this.state) return;
    const t = this.state;
    this._state = e, (this.state === "opened" || this.state === "closed") && ((i = this.strategy) == null || i.shouldCompleteOpen()), this.requestUpdate("state", t);
  }
  get elementResolver() {
    return this._elementResolver || (this._elementResolver = new $(this)), this._elementResolver;
  }
  get usesDialog() {
    return this.type === "modal" || this.type === "page";
  }
  get popoverValue() {
    if ("popover" in this)
      switch (this.type) {
        case "modal":
        case "page":
          return;
        case "hint":
          return "manual";
        default:
          return this.type;
      }
  }
  get requiresPosition() {
    return !(this.type === "page" || !this.open || !this.triggerElement || !this.placement && this.type !== "hint");
  }
  managePosition() {
    if (!this.requiresPosition || !this.open) return;
    const e = this.offset || 0, t = this.triggerElement, i = this.placement || "right", s = this.tipPadding;
    this.placementController.placeOverlay(this.dialogEl, {
      offset: e,
      placement: i,
      tipPadding: s,
      trigger: t,
      type: this.type
    });
  }
  async managePopoverOpen() {
    super.managePopoverOpen();
    const e = this.open;
    if (this.open !== e || (await this.manageDelay(e), this.open !== e) || (await this.ensureOnDOM(e), this.open !== e))
      return;
    const t = await this.makeTransition(e);
    this.open === e && await this.applyFocus(e, t);
  }
  async applyFocus(e, t) {
    if (!(this.receivesFocus === "false" || this.type === "hint")) {
      if (await y(), await y(), e === this.open && !this.open) {
        this.hasNonVirtualTrigger && this.contains(this.getRootNode().activeElement) && this.triggerElement.focus();
        return;
      }
      t == null || t.focus();
    }
  }
  returnFocus() {
    var t;
    if (this.open || this.type === "hint") return;
    const e = () => {
      var l, a;
      const i = [];
      let s = document.activeElement;
      for (; (l = s == null ? void 0 : s.shadowRoot) != null && l.activeElement; )
        s = s.shadowRoot.activeElement;
      for (; s; ) {
        const p = s.assignedSlot || s.parentElement || ((a = s.getRootNode()) == null ? void 0 : a.host);
        p && i.push(p), s = p;
      }
      return i;
    };
    this.receivesFocus !== "false" && ((t = this.triggerElement) != null && t.focus) && (this.contains(this.getRootNode().activeElement) || e().includes(this) || document.activeElement === document.body) && this.triggerElement.focus();
  }
  async manageOpen(e) {
    if (!(!this.isConnected && this.open) && (this.hasUpdated || await this.updateComplete, this.open ? (v.add(this), this.willPreventClose && (document.addEventListener(
      "pointerup",
      () => {
        this.dialogEl.classList.toggle("not-immediately-closable", !1), this.willPreventClose = !1;
      },
      { once: !0 }
    ), this.dialogEl.classList.toggle("not-immediately-closable", !0))) : (e && this.dispose(), v.remove(this)), this.open && this.state !== "opened" ? this.state = "opening" : !this.open && this.state !== "closed" && (this.state = "closing"), this.usesDialog ? this.manageDialogOpen() : this.managePopoverOpen(), this.type === "auto")) {
      const t = this.getRootNode();
      this.open ? t.addEventListener("focusout", this.closeOnFocusOut, {
        capture: !0
      }) : t.removeEventListener("focusout", this.closeOnFocusOut, {
        capture: !0
      });
    }
  }
  bindEvents() {
    var e;
    (e = this.strategy) == null || e.abort(), this.strategy = void 0, this.hasNonVirtualTrigger && this.triggerInteraction && (this.strategy = new I[this.triggerInteraction](
      this.triggerElement,
      {
        overlay: this
      }
    ));
  }
  handleBeforetoggle(e) {
    e.newState !== "open" && this.handleBrowserClose();
  }
  handleBrowserClose() {
    var e;
    if (!((e = this.strategy) != null && e.activelyOpening)) {
      this.open = !1;
      return;
    }
    this.manuallyKeepOpen();
  }
  manuallyKeepOpen() {
    this.open = !0, this.placementController.allowPlacementUpdate = !0, this.manageOpen(!1);
  }
  handleSlotchange() {
    var e, t;
    this.elements.length ? this.hasNonVirtualTrigger && ((t = this.strategy) == null || t.prepareDescription(this.triggerElement)) : (e = this.strategy) == null || e.releaseDescription();
  }
  shouldPreventClose() {
    const e = this.willPreventClose;
    return this.willPreventClose = !1, e;
  }
  requestSlottable() {
    this.lastRequestSlottableState !== this.open && (this.open || document.body.offsetHeight, this.dispatchEvent(
      new L(
        "overlay-content",
        this.open ? {} : U
      )
    ), this.lastRequestSlottableState = this.open);
  }
  willUpdate(e) {
    var i;
    if (this.hasAttribute("id") || this.setAttribute("id", `${this.tagName.toLowerCase()}-${_()}`), e.has("open") && (this.hasUpdated || this.open) && this.manageOpen(e.get("open")), e.has("trigger")) {
      const [s, l] = ((i = this.trigger) == null ? void 0 : i.split("@")) || [];
      this.elementResolver.selector = s ? `#${s}` : "", this.triggerInteraction = l;
    }
    let t = !1;
    e.has(R) && (t = this.triggerElement, this.triggerElement = this.elementResolver.element), e.has("triggerElement") && (t = e.get("triggerElement")), t !== !1 && this.bindEvents();
  }
  updated(e) {
    super.updated(e), e.has("placement") && (this.placement ? this.dialogEl.setAttribute("actual-placement", this.placement) : this.dialogEl.removeAttribute("actual-placement"), this.open && typeof e.get("placement") < "u" && this.placementController.resetOverlayPosition()), e.has("state") && this.state === "closed" && typeof e.get("state") < "u" && this.placementController.clearOverlayPosition();
  }
  renderContent() {
    return u` <slot @slotchange=${this.handleSlotchange}></slot> `;
  }
  get dialogStyleMap() {
    return {
      "--swc-overlay-open-count": h.openCount.toString()
    };
  }
  renderDialog() {
    return u`
      <dialog
        class="dialog"
        part="dialog"
        placement=${g(
      this.requiresPosition ? this.placement || "right" : void 0
    )}
        style=${f(this.dialogStyleMap)}
        @close=${this.handleBrowserClose}
        @cancel=${this.handleBrowserClose}
        @beforetoggle=${this.handleBeforetoggle}
        ?is-visible=${this.state !== "closed"}
      >
        ${this.renderContent()}
      </dialog>
    `;
  }
  renderPopover() {
    return u`
      <div
        class="dialog"
        part="dialog"
        placement=${g(
      this.requiresPosition ? this.placement || "right" : void 0
    )}
        popover=${g(this.popoverValue)}
        style=${f(this.dialogStyleMap)}
        @beforetoggle=${this.handleBeforetoggle}
        @close=${this.handleBrowserClose}
        ?is-visible=${this.state !== "closed"}
      >
        ${this.renderContent()}
      </div>
    `;
  }
  render() {
    const e = this.type === "modal" || this.type === "page";
    return u`
      ${e ? this.renderDialog() : this.renderPopover()}
      <slot name="longpress-describedby-descriptor"></slot>
    `;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("close", () => {
      this.open = !1;
    }), this.hasUpdated && this.bindEvents();
  }
  disconnectedCallback() {
    var e;
    (e = this.strategy) == null || e.releaseDescription(), this.open = !1, super.disconnectedCallback();
  }
}, h.styles = [
  B,
  O`
      ${C(A)}
    `
], h.openCount = 1, h);
r([
  n({ type: Boolean })
], o.prototype, "delayed", 1);
r([
  b(".dialog")
], o.prototype, "dialogEl", 2);
r([
  n({ type: Boolean })
], o.prototype, "disabled", 1);
r([
  V({
    flatten: !0,
    selector: ':not([slot="longpress-describedby-descriptor"], slot)'
    // gather only elements slotted into the default slot
  })
], o.prototype, "elements", 2);
r([
  n({ type: Number })
], o.prototype, "offset", 2);
r([
  n({ reflect: !0, type: Boolean })
], o.prototype, "open", 1);
r([
  n()
], o.prototype, "placement", 2);
r([
  n({ attribute: "receives-focus" })
], o.prototype, "receivesFocus", 2);
r([
  b("slot")
], o.prototype, "slotEl", 2);
r([
  w()
], o.prototype, "state", 1);
r([
  n({ attribute: "tip-padding", type: Number })
], o.prototype, "tipPadding", 2);
r([
  n()
], o.prototype, "trigger", 2);
r([
  n({ attribute: !1 })
], o.prototype, "triggerElement", 2);
r([
  n({ attribute: !1 })
], o.prototype, "triggerInteraction", 2);
r([
  n()
], o.prototype, "type", 2);
let he = o;
export {
  ce as LONGPRESS_INSTRUCTIONS,
  he as Overlay
};
