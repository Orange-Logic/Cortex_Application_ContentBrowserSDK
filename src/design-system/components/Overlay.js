import { i as b, a as O, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as C } from "../chunks/state.-o_YRGMi.js";
import { e as w } from "../chunks/query.BNveAlQo.js";
import { e as P } from "../chunks/base.CwU3eNq-.js";
import { o as m } from "../chunks/if-defined.D8U9hdvp.js";
import { o as f } from "../chunks/style-map.De8UQbPP.js";
import { nextFrame as v, AbstractOverlay as S } from "./AbstractOverlay.js";
import { ElementResolutionController as R, elementResolverUpdatedSymbol as x } from "./reactive-controllers.js";
import { randomID as $ } from "./shared.js";
import { OverlayDialog as _ } from "./OverlayDialog.js";
import { OverlayNoPopover as A } from "./OverlayNoPopover.js";
import { OverlayPopover as N } from "./OverlayPopover.js";
import { overlayStack as y } from "./OverlayStack.js";
import { P as T } from "../chunks/PlacementController.D3pNuMGu.js";
import { VirtualTrigger as q } from "./VirtualTrigger.js";
import { LONGPRESS_INSTRUCTIONS as ce } from "./LongpressController.js";
import { c as D } from "../chunks/component.styles.BLcT4bOa.js";
import { SlottableRequestEvent as L, removeSlottableRequest as I } from "./slottable-request-event.js";
import { strategies as F } from "./strategies.js";
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function B(c) {
  return (e, t) => {
    const { slot: s, selector: i } = c, r = "slot" + (s ? `[name=${s}]` : ":not([name])");
    return P(e, t, { get() {
      var u;
      const l = (u = this.renderRoot) == null ? void 0 : u.querySelector(r), h = (l == null ? void 0 : l.assignedElements(c)) ?? [];
      return i === void 0 ? h : h.filter((E) => E.matches(i));
    } });
  };
}
const U = b`
  /*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

  :host {
    display: contents;
    pointer-events: none;

    /**
     * Duplicate --spectrum-overlay-animation-distance, which is out of scope.
     * Currently is is statically '--cx-spacing-medium' across a number of places
     * so that is leveraged here as the default.
     **/

    --swc-overlay-animation-distance: var(--cx-spacing-medium);
  }

  .dialog {
    margin: 0;
    border: 0;
    background: none;
    padding: 0;
    display: flex;
    position: fixed;
    overflow: visible;
    opacity: 1 !important;
    box-sizing: border-box;
    max-height: calc(100vh - 16px);
    max-height: calc(100dvh - 16px);
    max-width: calc(100vw - 16px);
    height: auto;
    inset: auto;
    top: 0;
    left: 0;

    --cx-overlay-open: true;
  }

  .dialog:not([is-visible]) {
    display: none;
  }

  .dialog:focus {
    outline: none;
  }

  :host(:not([open])) .dialog {
    --cx-overlay-open: false;
  }

  .dialog::backdrop {
    display: none;
  }

  .dialog::before {
    position: absolute;
    inset: -999em;
    content: '';
    pointer-events: auto !important;
  }

  .dialog:not(.not-immediately-closable)::before {
    display: none;
  }

  .dialog > div {
    width: 100%;
  }

  ::slotted(*) {
    pointer-events: auto;
    visibility: visible !important;
  }

  /**
 * Offset the transition displacement from the trigger edge by
 * padding the equivelent distance off of the opposite edge.
 *
 * <HACK>
 * Prepare for Context Menus with [popover] by adding margin/border
 * that _should_ still be under the pointer when 'pointerup' is dispatched.
 * </HACK>
 **/
  .dialog:not([actual-placement])[placement*='top'] {
    padding-block: var(--swc-overlay-animation-distance);
    margin-top: var(--swc-overlay-animation-distance);
  }

  .dialog:not([actual-placement])[placement*='right'] {
    padding-inline: var(--swc-overlay-animation-distance);
    margin-left: calc(-1 * var(--swc-overlay-animation-distance));
  }

  .dialog:not([actual-placement])[placement*='bottom'] {
    padding-block: var(--swc-overlay-animation-distance);
    margin-top: calc(-1 * var(--swc-overlay-animation-distance));
  }

  .dialog:not([actual-placement])[placement*='left'] {
    padding-inline: var(--swc-overlay-animation-distance);
    margin-left: var(--swc-overlay-animation-distance);
  }

  .dialog[actual-placement*='top'] {
    padding-block: var(--swc-overlay-animation-distance);
    margin-top: var(--swc-overlay-animation-distance);
  }

  .dialog[actual-placement*='right'] {
    padding-inline: var(--swc-overlay-animation-distance);
    margin-left: calc(-1 * var(--swc-overlay-animation-distance));
  }

  .dialog[actual-placement*='bottom'] {
    padding-block: var(--swc-overlay-animation-distance);
    margin-top: calc(-1 * var(--swc-overlay-animation-distance));
  }

  .dialog[actual-placement*='left'] {
    padding-inline: var(--swc-overlay-animation-distance);
    margin-left: var(--swc-overlay-animation-distance);
  }

  slot[name='longpress-describedby-descriptor'] {
    display: none;
  }

  /* stylelint-disable */
  @supports selector(:open) {
    .dialog {
      opacity: 0;
    }

    .dialog:open {
      opacity: 1;
    }
  }

  @supports selector(:popover-open) {
    .dialog {
      opacity: 0;
    }

    .dialog:popover-open {
      opacity: 1;
    }
  }

  @supports (overlay: auto) {
    .dialog {
      display: none;
      transition:
        all var(--cx-transition-fast, 0.13s),
        translate 0s,
        display var(--cx-transition-fast, 0.13s);
      transition-behavior: allow-discrete;
    }

    .dialog:popover-open,
    .dialog:modal {
      display: flex;
    }
  }
  .dialog[actual-placement] {
    z-index: calc(
      var(--swc-overlay-z-index-base, 1000) + var(--swc-overlay-open-count)
    );
  }
  @supports (not selector(:open)) and (not selector(:popover-open)) {
    :host:not([open]) .dialog {
      pointer-events: none;
    }
  }
`;
var V = Object.defineProperty, k = Object.getOwnPropertyDescriptor, a = (c, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? k(e, t) : e, r = c.length - 1, l; r >= 0; r--)
    (l = c[r]) && (i = (s ? l(e, t, i) : l(i)) || i);
  return s && i && V(e, t, i), i;
};
const K = CSS.supports("(overlay: auto)") && "showPopover" in document.createElement("div");
let d = _(S);
K ? d = N(d) : d = A(d);
var p;
const o = (p = class extends d {
  constructor() {
    super(...arguments), this._delayed = !1, this._disabled = !1, this.offset = 0, this._open = !1, this.lastRequestSlottableState = !1, this.receivesFocus = "auto", this._state = "closed", this.triggerElement = null, this.type = "auto", this.wasOpen = !1, this.closeOnFocusOut = (e) => {
      if (!e.relatedTarget)
        return;
      const t = new Event("overlay-relation-query", {
        bubbles: !0,
        composed: !0
      });
      e.relatedTarget.addEventListener(t.type, (s) => {
        s.composedPath().includes(this) || (this.open = !1);
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
    return !!this.triggerElement && !(this.triggerElement instanceof q);
  }
  get placementController() {
    return this._placementController || (this._placementController = new T(this)), this._placementController;
  }
  get open() {
    return this._open;
  }
  set open(e) {
    var t;
    e && this.disabled || e !== this.open && ((t = this.strategy) != null && t.activelyOpening && !e || (this._open = e, this.open && (p.openCount += 1), this.requestUpdate("open", !this.open), this.open && this.requestSlottable()));
  }
  get state() {
    return this._state;
  }
  set state(e) {
    var s;
    if (e === this.state) return;
    const t = this.state;
    this._state = e, (this.state === "opened" || this.state === "closed") && ((s = this.strategy) == null || s.shouldCompleteOpen()), this.requestUpdate("state", t);
  }
  get elementResolver() {
    return this._elementResolver || (this._elementResolver = new R(this)), this._elementResolver;
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
    const e = this.offset || 0, t = this.triggerElement, s = this.placement || "right", i = this.tipPadding;
    this.placementController.placeOverlay(this.dialogEl, {
      offset: e,
      placement: s,
      tipPadding: i,
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
      if (await v(), await v(), e === this.open && !this.open) {
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
      var r, l;
      const s = [];
      let i = document.activeElement;
      for (; (r = i == null ? void 0 : i.shadowRoot) != null && r.activeElement; )
        i = i.shadowRoot.activeElement;
      for (; i; ) {
        const h = i.assignedSlot || i.parentElement || ((l = i.getRootNode()) == null ? void 0 : l.host);
        h && s.push(h), i = h;
      }
      return s;
    };
    this.receivesFocus !== "false" && ((t = this.triggerElement) != null && t.focus) && (this.contains(this.getRootNode().activeElement) || e().includes(this) || document.activeElement === document.body) && this.triggerElement.focus();
  }
  async manageOpen(e) {
    if (!(!this.isConnected && this.open) && (this.hasUpdated || await this.updateComplete, this.open ? (y.add(this), this.willPreventClose && (document.addEventListener(
      "pointerup",
      () => {
        this.dialogEl.classList.toggle("not-immediately-closable", !1), this.willPreventClose = !1;
      },
      { once: !0 }
    ), this.dialogEl.classList.toggle("not-immediately-closable", !0))) : (e && this.dispose(), y.remove(this)), this.open && this.state !== "opened" ? this.state = "opening" : !this.open && this.state !== "closed" && (this.state = "closing"), this.usesDialog ? this.manageDialogOpen() : this.managePopoverOpen(), this.type === "auto")) {
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
    (e = this.strategy) == null || e.abort(), this.strategy = void 0, this.hasNonVirtualTrigger && this.triggerInteraction && (this.strategy = new F[this.triggerInteraction](
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
        this.open ? {} : I
      )
    ), this.lastRequestSlottableState = this.open);
  }
  willUpdate(e) {
    var s;
    if (this.hasAttribute("id") || this.setAttribute("id", `${this.tagName.toLowerCase()}-${$()}`), e.has("open") && (this.hasUpdated || this.open) && this.manageOpen(e.get("open")), e.has("trigger")) {
      const [i, r] = ((s = this.trigger) == null ? void 0 : s.split("@")) || [];
      this.elementResolver.selector = i ? `#${i}` : "", this.triggerInteraction = r;
    }
    let t = !1;
    e.has(x) && (t = this.triggerElement, this.triggerElement = this.elementResolver.element), e.has("triggerElement") && (t = e.get("triggerElement")), t !== !1 && this.bindEvents();
  }
  updated(e) {
    super.updated(e), e.has("placement") && (this.placement ? this.dialogEl.setAttribute("actual-placement", this.placement) : this.dialogEl.removeAttribute("actual-placement"), this.open && typeof e.get("placement") < "u" && this.placementController.resetOverlayPosition()), e.has("state") && this.state === "closed" && typeof e.get("state") < "u" && this.placementController.clearOverlayPosition();
  }
  renderContent() {
    return g` <slot @slotchange=${this.handleSlotchange}></slot> `;
  }
  get dialogStyleMap() {
    return {
      "--swc-overlay-open-count": p.openCount.toString()
    };
  }
  renderDialog() {
    return g`
      <dialog
        class="dialog"
        part="dialog"
        placement=${m(
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
    return g`
      <div
        class="dialog"
        part="dialog"
        placement=${m(
      this.requiresPosition ? this.placement || "right" : void 0
    )}
        popover=${m(this.popoverValue)}
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
    return g`
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
}, p.styles = [
  D,
  b`
      ${O(U)}
    `
], p.openCount = 1, p);
a([
  n({ type: Boolean })
], o.prototype, "delayed", 1);
a([
  w(".dialog")
], o.prototype, "dialogEl", 2);
a([
  n({ type: Boolean })
], o.prototype, "disabled", 1);
a([
  B({
    flatten: !0,
    selector: ':not([slot="longpress-describedby-descriptor"], slot)'
    // gather only elements slotted into the default slot
  })
], o.prototype, "elements", 2);
a([
  n({ type: Number })
], o.prototype, "offset", 2);
a([
  n({ reflect: !0, type: Boolean })
], o.prototype, "open", 1);
a([
  n()
], o.prototype, "placement", 2);
a([
  n({ attribute: "receives-focus" })
], o.prototype, "receivesFocus", 2);
a([
  w("slot")
], o.prototype, "slotEl", 2);
a([
  C()
], o.prototype, "state", 1);
a([
  n({ attribute: "tip-padding", type: Number })
], o.prototype, "tipPadding", 2);
a([
  n()
], o.prototype, "trigger", 2);
a([
  n({ attribute: !1 })
], o.prototype, "triggerElement", 2);
a([
  n({ attribute: !1 })
], o.prototype, "triggerInteraction", 2);
a([
  n()
], o.prototype, "type", 2);
let le = o;
export {
  ce as LONGPRESS_INSTRUCTIONS,
  le as Overlay
};
