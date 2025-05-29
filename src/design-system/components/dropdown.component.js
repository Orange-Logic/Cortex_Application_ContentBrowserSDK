import { C as w } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { s as d, a as u } from "../chunks/animate.c3HW4nwn.js";
import { w as m } from "../chunks/event.mFzZi4sr.js";
import { g } from "../chunks/tabbable.Bf7wIRw3.js";
import { w as E } from "../chunks/watch.ChG-_stu.js";
import { x as k } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { e as c } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { o as T } from "../chunks/if-defined.D8U9hdvp.js";
import { g as f, a as y } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as C } from "../chunks/localize.DV9I313e.js";
import O from "./popup.component.js";
import x from "./dropdown.styles.js";
var D = Object.defineProperty, L = Object.getOwnPropertyDescriptor, n = (l, e, t, i) => {
  for (var s = i > 1 ? void 0 : i ? L(e, t) : e, r = l.length - 1, p; r >= 0; r--)
    (p = l[r]) && (s = (i ? p(e, t, s) : p(s)) || s);
  return i && s && D(e, t, s), s;
};
const h = class h extends w {
  constructor() {
    super(...arguments), this.localize = new C(this), this.open = !1, this.placement = "bottom-start", this.disabled = !1, this.stayOpenOnSelect = !1, this.distance = 0, this.skidding = 0, this.hoist = !1, this.sync = void 0, this.autoWidthFactor = 1, this.handleKeyDown = (e) => {
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
          var s, r, p;
          const i = ((s = this.containingElement) == null ? void 0 : s.getRootNode()) instanceof ShadowRoot ? (p = (r = document.activeElement) == null ? void 0 : r.shadowRoot) == null ? void 0 : p.activeElement : document.activeElement;
          (!this.containingElement || (i == null ? void 0 : i.closest(
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
      const i = t.getAllItems(), s = i[0], r = i[i.length - 1];
      ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key) && (e.preventDefault(), this.open || (this.show(), await this.updateComplete), i.length > 0 && (typeof t.checkVisibility == "function" && !(t != null && t.checkVisibility()) && await new Promise((p) => {
        this.popup.addEventListener("cx-opened", p);
      }), this.updateComplete.then(() => {
        (e.key === "ArrowDown" || e.key === "Home") && (t.setCurrentItem(s), s.focus()), (e.key === "ArrowUp" || e.key === "End") && (t.setCurrentItem(r), r.focus());
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
      (s) => g(s).start
    );
    let i;
    if (t) {
      switch (t.tagName.toLowerCase()) {
        case "cx-button":
        case "cx-icon-button":
          i = t.button;
          break;
        default:
          i = t;
      }
      i.setAttribute("aria-haspopup", "true"), i.setAttribute("aria-expanded", this.open ? "true" : "false");
    }
  }
  blurTrigger() {
    const t = this.trigger.assignedElements({
      flatten: !0
    }).find(
      (s) => g(s).start
    );
    let i;
    if (t) {
      switch (t.tagName.toLowerCase()) {
        case "cx-button":
        case "cx-icon-button":
          i = t.button;
          break;
        default:
          i = t;
      }
      i.blur();
    }
  }
  /** Shows the dropdown panel. */
  async show() {
    if (!this.open)
      return this.open = !0, m(this, "cx-after-show");
  }
  /** Hides the dropdown panel */
  async hide() {
    if (this.open)
      return this.open = !1, this.blurTrigger(), m(this, "cx-after-hide");
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
      this.emit("cx-show"), this.addOpenListeners(), await d(this), this.panel.hidden = !1, this.popup.active = !0;
      const { keyframes: e, options: t } = f(this, "dropdown.show", {
        dir: this.localize.dir()
      });
      await u(this.popup.popup, e, t), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), await d(this);
      const { keyframes: e, options: t } = f(this, "dropdown.hide", {
        dir: this.localize.dir()
      });
      await u(this.popup.popup, e, t), this.panel.hidden = !0, this.popup.active = !1, this.emit("cx-after-hide");
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
        sync=${T(this.sync ? this.sync : void 0)}
        class=${v({
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
h.styles = [b, x], h.dependencies = { "cx-popup": O };
let o = h;
n([
  c(".dropdown")
], o.prototype, "popup", 2);
n([
  c(".dropdown__trigger")
], o.prototype, "trigger", 2);
n([
  c(".dropdown__panel")
], o.prototype, "panel", 2);
n([
  a({ reflect: !0, type: Boolean })
], o.prototype, "open", 2);
n([
  a({ reflect: !0 })
], o.prototype, "placement", 2);
n([
  a({ reflect: !0, type: Boolean })
], o.prototype, "disabled", 2);
n([
  a({ attribute: "stay-open-on-select", reflect: !0, type: Boolean })
], o.prototype, "stayOpenOnSelect", 2);
n([
  a({ attribute: !1 })
], o.prototype, "containingElement", 2);
n([
  a({ type: Number })
], o.prototype, "distance", 2);
n([
  a({ type: Number })
], o.prototype, "skidding", 2);
n([
  a({ type: Boolean })
], o.prototype, "hoist", 2);
n([
  a({ reflect: !0 })
], o.prototype, "sync", 2);
n([
  a({ attribute: "auto-width-factor" })
], o.prototype, "autoWidthFactor", 2);
n([
  E("open", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleOpenChange", 1);
y("dropdown.show", {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
y("dropdown.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 }
  ],
  options: { duration: 100, easing: "ease" }
});
export {
  o as default
};
