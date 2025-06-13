import { C as w, c as y } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { s as h, a as c } from "../chunks/animate.c3HW4nwn.js";
import { w as u } from "../chunks/event.mFzZi4sr.js";
import { a as m } from "../chunks/tabbable.BLpzI3OC.js";
import { w as v } from "../chunks/watch.ChG-_stu.js";
import { i as x, x as k } from "../chunks/lit-element.DRlPF2me.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { e as l } from "../chunks/query.BNveAlQo.js";
import { e as E } from "../chunks/class-map.Cn0czwWq.js";
import { o as C } from "../chunks/if-defined.D8U9hdvp.js";
import { a as f, g } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as D } from "../chunks/localize.D5Yoww6T.js";
import T from "./popup.js";
const O = x`
  :host {
    display: inline-block;
    --panel-padding: 0px;
  }

  .dropdown::part(popup) {
    z-index: var(--cx-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    display: block;
    padding: var(--panel-padding);
    background-color: var(--cx-panel-background-color);
    border: var(--cx-panel-border-width) solid var(--cx-panel-border-color);
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    box-shadow: var(--cx-shadow-large);
    border-radius: var(--cx-border-radius-large);
    pointer-events: none;
    max-height: min(
      var(--auto-size-available-height),
      var(--max-height, var(--auto-size-available-height))
    );
    overflow: auto;
  }

  .dropdown--open .dropdown__panel {
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(cx-menu) {
    max-width: min(100%, var(--auto-size-available-width)) !important;
    border: none;
  }
`;
var L = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, s = (e, t, o, n) => {
  for (var a = n > 1 ? void 0 : n ? _(t, o) : t, p = e.length - 1, d; p >= 0; p--)
    (d = e[p]) && (a = (n ? d(t, o, a) : d(a)) || a);
  return n && a && L(t, o, a), a;
};
let i = class extends w {
  constructor() {
    super(...arguments), this.localize = new D(this), this.open = !1, this.placement = "bottom-start", this.disabled = !1, this.stayOpenOnSelect = !1, this.distance = 0, this.skidding = 0, this.hoist = !1, this.sync = void 0, this.autoWidthFactor = 1, this.handleKeyDown = (e) => {
      this.open && e.key === "Escape" && (e.stopPropagation(), this.hide(), this.focusOnTrigger());
    }, this.handleDocumentKeyDown = (e) => {
      var t;
      if (e.key === "Escape" && this.open && !this.closeWatcher) {
        e.stopPropagation(), this.focusOnTrigger(), this.hide();
        return;
      }
      if (e.key === "Tab") {
        if (this.open && ((t = document.activeElement) == null ? void 0 : t.tagName.toLowerCase()) === "cx-menu-item") {
          e.preventDefault(), this.hide(), this.focusOnTrigger();
          return;
        }
        setTimeout(() => {
          var n, a, p;
          const o = ((n = this.containingElement) == null ? void 0 : n.getRootNode()) instanceof ShadowRoot ? (p = (a = document.activeElement) == null ? void 0 : a.shadowRoot) == null ? void 0 : p.activeElement : document.activeElement;
          (!this.containingElement || (o == null ? void 0 : o.closest(
            this.containingElement.tagName.toLowerCase()
          )) !== this.containingElement) && this.hide();
        });
      }
    }, this.handleDocumentMouseDown = (e) => {
      const t = e.composedPath();
      this.containingElement && !t.includes(this.containingElement) && this.hide();
    }, this.handlePanelSelect = (e) => {
      const t = e.target;
      !this.stayOpenOnSelect && t.tagName.toLowerCase() === "cx-menu" && (this.hide(), this.focusOnTrigger());
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.containingElement || (this.containingElement = this);
  }
  firstUpdated() {
    this.panel.hidden = !this.open, this.open && (this.addOpenListeners(), this.popup.active = !0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeOpenListeners(), this.hide();
  }
  focusOnTrigger() {
    const e = this.trigger.assignedElements({ flatten: !0 })[0];
    typeof (e == null ? void 0 : e.focus) == "function" && e.focus();
  }
  getMenu() {
    return this.panel.assignedElements({ flatten: !0 }).find((e) => e.tagName.toLowerCase() === "cx-menu");
  }
  handleTriggerClick() {
    this.open ? this.hide() : (this.show(), this.focusOnTrigger());
  }
  async handleTriggerKeyDown(e) {
    if ([" ", "Enter"].includes(e.key)) {
      e.preventDefault(), this.handleTriggerClick();
      return;
    }
    const t = this.getMenu();
    if (t) {
      const o = t.getAllItems(), n = o[0], a = o[o.length - 1];
      ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key) && (e.preventDefault(), this.open || (this.show(), await this.updateComplete), o.length > 0 && (typeof t.checkVisibility == "function" && !(t != null && t.checkVisibility()) && await new Promise((p) => {
        this.popup.addEventListener("cx-opened", p);
      }), this.updateComplete.then(() => {
        (e.key === "ArrowDown" || e.key === "Home") && (t.setCurrentItem(n), n.focus()), (e.key === "ArrowUp" || e.key === "End") && (t.setCurrentItem(a), a.focus());
      })));
    }
  }
  handleTriggerKeyUp(e) {
    e.key === " " && e.preventDefault();
  }
  handleTriggerSlotChange() {
    this.updateAccessibleTrigger();
  }
  //
  // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
  // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
  // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
  // a child of the slotted element, or an element in the slotted element's shadow root.
  //
  // For example, the accessible trigger of an <cx-button> is a <button> located inside its shadow root.
  //
  // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
  //
  updateAccessibleTrigger() {
    const t = this.trigger.assignedElements({
      flatten: !0
    }).find(
      (n) => m(n).start
    );
    let o;
    if (t) {
      switch (t.tagName.toLowerCase()) {
        case "cx-button":
        case "cx-icon-button":
          o = t.button;
          break;
        default:
          o = t;
      }
      o.setAttribute("aria-haspopup", "true"), o.setAttribute("aria-expanded", this.open ? "true" : "false");
    }
  }
  blurTrigger() {
    const t = this.trigger.assignedElements({
      flatten: !0
    }).find(
      (n) => m(n).start
    );
    let o;
    if (t) {
      switch (t.tagName.toLowerCase()) {
        case "cx-button":
        case "cx-icon-button":
          o = t.button;
          break;
        default:
          o = t;
      }
      o.blur();
    }
  }
  /** Shows the dropdown panel. */
  async show() {
    if (!this.open)
      return this.open = !0, u(this, "cx-after-show");
  }
  /** Hides the dropdown panel */
  async hide() {
    if (this.open)
      return this.open = !1, this.blurTrigger(), u(this, "cx-after-hide");
  }
  /**
   * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
   * is activated.
   */
  reposition() {
    this.popup.reposition();
  }
  addOpenListeners() {
    var e;
    this.panel.addEventListener("cx-select", this.handlePanelSelect), "CloseWatcher" in window ? ((e = this.closeWatcher) == null || e.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => {
      this.hide(), this.focusOnTrigger();
    }) : this.panel.addEventListener("keydown", this.handleKeyDown), document.addEventListener("keydown", this.handleDocumentKeyDown), document.addEventListener("mousedown", this.handleDocumentMouseDown);
  }
  removeOpenListeners() {
    var e;
    this.panel && (this.panel.removeEventListener("cx-select", this.handlePanelSelect), this.panel.removeEventListener("keydown", this.handleKeyDown)), document.removeEventListener("keydown", this.handleDocumentKeyDown), document.removeEventListener("mousedown", this.handleDocumentMouseDown), (e = this.closeWatcher) == null || e.destroy();
  }
  async handleOpenChange() {
    if (this.disabled) {
      this.open = !1;
      return;
    }
    if (this.updateAccessibleTrigger(), this.open) {
      this.emit("cx-show"), this.addOpenListeners(), await h(this), this.panel.hidden = !1, this.popup.active = !0;
      const { keyframes: e, options: t } = g(this, "dropdown.show", {
        dir: this.localize.dir()
      });
      await c(this.popup.popup, e, t), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), await h(this);
      const { keyframes: e, options: t } = g(this, "dropdown.hide", {
        dir: this.localize.dir()
      });
      await c(this.popup.popup, e, t), this.panel.hidden = !0, this.popup.active = !1, this.emit("cx-after-hide");
    }
  }
  render() {
    return k`
      <cx-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? "fixed" : "absolute"}
        flip
        shift
        auto-size="both"
        auto-size-padding="10"
        flip-padding="10"
        sync=${C(this.sync ? this.sync : void 0)}
        class=${E({
      dropdown: !0,
      "dropdown--open": this.open
    })}
        auto-width-factor=${this.autoWidthFactor}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div
          aria-hidden=${this.open ? "false" : "true"}
          aria-labelledby="dropdown"
        >
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </cx-popup>
    `;
  }
};
i.styles = [b, O];
i.dependencies = { "cx-popup": T };
s([
  l(".dropdown")
], i.prototype, "popup", 2);
s([
  l(".dropdown__trigger")
], i.prototype, "trigger", 2);
s([
  l(".dropdown__panel")
], i.prototype, "panel", 2);
s([
  r({ reflect: !0, type: Boolean })
], i.prototype, "open", 2);
s([
  r({ reflect: !0 })
], i.prototype, "placement", 2);
s([
  r({ reflect: !0, type: Boolean })
], i.prototype, "disabled", 2);
s([
  r({ attribute: "stay-open-on-select", reflect: !0, type: Boolean })
], i.prototype, "stayOpenOnSelect", 2);
s([
  r({ attribute: !1 })
], i.prototype, "containingElement", 2);
s([
  r({ type: Number })
], i.prototype, "distance", 2);
s([
  r({ type: Number })
], i.prototype, "skidding", 2);
s([
  r({ type: Boolean })
], i.prototype, "hoist", 2);
s([
  r({ reflect: !0 })
], i.prototype, "sync", 2);
s([
  r({ attribute: "auto-width-factor" })
], i.prototype, "autoWidthFactor", 2);
s([
  v("open", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleOpenChange", 1);
i = s([
  y("cx-dropdown")
], i);
f("dropdown.show", {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
f("dropdown.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 }
  ],
  options: { duration: 100, easing: "ease" }
});
export {
  i as default
};
