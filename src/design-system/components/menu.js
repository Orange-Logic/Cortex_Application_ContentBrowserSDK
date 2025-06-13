import { C as g, c as p } from "../chunks/custom-element.X6y1saJZ.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { i as w, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as x } from "../chunks/property.CtZ87in4.js";
import { e as v } from "../chunks/query.BNveAlQo.js";
const I = w`
  :host {
    display: block;
    position: relative;
    background: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-radius: var(--cx-border-radius-large);
    padding: var(--cx-spacing-x-small) 0;
    overflow: auto;

    --divider-color: var(--cx-panel-border-color);
    --divider-width: var(--cx-panel-border-width);
    --divider-spacing: var(--cx-spacing-x-small);
  }

  ::slotted(cx-divider) {
    --color: var(--divider-color);
    --width: var(--divider-width);
    --spacing: var(--divider-spacing);
  }

  ::slotted([data-alternating-grouping])::before {
    content: ' ';
    background-color: var(--divider-color);

    display: block;
    margin: var(--divider-spacing) 0;
    height: var(--divider-width);
  }

  ::slotted([data-alternating-grouping='horizontal'])::before {
    display: inline-block;
    height: 100%;
    margin: 0 var(--divider-spacing);
    width: var(--divider-width);
  }

  .horizontal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :host([horizontal]) ::slotted(cx-menu-section) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;
var C = Object.defineProperty, E = Object.getOwnPropertyDescriptor, d = (e, i, r, o) => {
  for (var a = o > 1 ? void 0 : o ? E(i, r) : i, l = e.length - 1, c; l >= 0; l--)
    (c = e[l]) && (a = (o ? c(i, r, a) : c(a)) || a);
  return o && a && C(i, r, a), a;
};
function h(e) {
  return e.tagName.toLowerCase() === "cx-menu" && e instanceof m && e.getAttribute("role") === "menu";
}
let m = class extends g {
  constructor() {
    super(...arguments), this.horizontal = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "menu");
  }
  handleClick(e) {
    const i = ["menuitem", "menuitemcheckbox"], r = e.composedPath(), o = r.find(
      (s) => {
        var t;
        return i.includes(((t = s == null ? void 0 : s.getAttribute) == null ? void 0 : t.call(s, "role")) || "");
      }
    );
    if (!o || r.find(
      (s) => {
        var t;
        return ((t = s == null ? void 0 : s.getAttribute) == null ? void 0 : t.call(s, "role")) === "menu";
      }
    ) !== this) return;
    const c = o;
    c.type === "checkbox" && (c.checked = !c.checked), this.emit("cx-select", { detail: { item: c } });
  }
  handleKeyDown(e) {
    var i, r, o, a;
    if (e.key === "Enter" || e.key === " ") {
      const l = this.getCurrentItem();
      e.preventDefault(), e.stopPropagation(), l == null || l.click();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      const l = this.getAllItems(), c = this.getCurrentItem();
      let s = c ? l.indexOf(c) : 0;
      if (l.length > 0) {
        if (e.preventDefault(), e.stopPropagation(), e.key === "ArrowDown")
          s++;
        else if (e.key === "ArrowUp")
          s--;
        else if (e.key === "Home") {
          let t = (i = this.parentElement) == null ? void 0 : i.firstElementChild;
          for (; t && !h(t); )
            t = t.nextElementSibling;
          if (t) {
            const n = t.getAllItems();
            if (n.length > 0) {
              t.setCurrentItem(n[0]), n[0].focus();
              return;
            }
          }
          s = 0;
        } else if (e.key === "End") {
          let t = (r = this.parentElement) == null ? void 0 : r.lastElementChild;
          for (; t && !h(t); )
            t = t.previousElementSibling;
          if (t) {
            const n = t.getAllItems();
            if (n.length > 0) {
              t.setCurrentItem(n[n.length - 1]), n[n.length - 1].focus();
              return;
            }
          }
          s = 0;
        }
        if (s < 0) {
          let t = this.previousElementSibling;
          for (; t && !h(t); )
            t = t.previousElementSibling;
          if (t) {
            const n = t.getAllItems();
            if (n.length > 0) {
              t.setCurrentItem(
                n[n.length - 1]
              ), n[n.length - 1].focus();
              return;
            }
          } else {
            let n = (o = this.parentElement) == null ? void 0 : o.lastElementChild;
            for (; n && !h(n); )
              n = n.previousElementSibling;
            if (n) {
              const u = n.getAllItems();
              if (u.length > 0) {
                n.setCurrentItem(u[u.length - 1]), u[u.length - 1].focus();
                return;
              }
            }
            s = 0;
          }
        }
        if (s > l.length - 1) {
          let t = this.nextElementSibling;
          for (; t && !h(t); )
            t = t.nextElementSibling;
          if (t) {
            const n = t.getAllItems();
            if (n.length > 0) {
              t.setCurrentItem(n[0]), n[0].focus();
              return;
            }
          } else {
            let n = (a = this.parentElement) == null ? void 0 : a.firstElementChild;
            for (; n && !h(n); )
              n = n.nextElementSibling;
            if (n) {
              const u = n.getAllItems();
              if (u.length > 0) {
                n.setCurrentItem(u[0]), u[0].focus();
                return;
              }
            }
            s = 0;
          }
        }
        this.setCurrentItem(l[s]), l[s].focus();
      }
    }
  }
  handleMouseDown(e) {
    const i = e.target;
    this.isMenuItem(i) && this.setCurrentItem(i);
  }
  handleSlotChange() {
    const e = this.getAllItems();
    e.length > 0 && this.setCurrentItem(e[0]), this.defaultSlot.assignedElements().forEach((i) => {
      const r = i, o = r.previousElementSibling;
      (this.isMenuSection(o) && this.isMenuItem(r) || (this.isMenuItem(o) || this.isMenuSection(o)) && this.isMenuSection(r) && r.childElementCount > 0) && r.setAttribute(
        "data-alternating-grouping",
        this.horizontal ? "horizontal" : ""
      );
    });
  }
  isMenuSection(e) {
    return e instanceof HTMLElement ? e.tagName.toLowerCase() === "cx-menu-section" : !1;
  }
  isMenuItem(e) {
    return e instanceof HTMLElement ? e.tagName.toLowerCase() === "cx-menu-item" || ["menuitem", "menuitemcheckbox", "menuitemradio"].includes(
      e.getAttribute("role") ?? ""
    ) : !1;
  }
  /** @internal Gets all slotted menu items, ignoring dividers, headers, and other elements. */
  getAllItems() {
    return this.defaultSlot.assignedElements({ flatten: !0 }).flatMap((i) => {
      var r;
      if (this.isMenuSection(i)) {
        const o = (r = i.shadowRoot) == null ? void 0 : r.querySelector("slot");
        return o ? [...o.assignedElements({ flatten: !0 })] : [];
      }
      return i;
    }).filter((i) => !(i.inert || !this.isMenuItem(i)));
  }
  /**
   * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
   * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
   */
  getCurrentItem() {
    return this.getAllItems().find((e) => e.getAttribute("tabindex") === "0");
  }
  /**
   * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
   * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
   */
  setCurrentItem(e) {
    this.getAllItems().forEach((r) => {
      r.setAttribute("tabindex", r === e ? "0" : "-1");
    });
  }
  render() {
    return this.horizontal ? f`<div class="horizontal">
          <slot
            @slotchange=${this.handleSlotChange}
            @click=${this.handleClick}
            @keydown=${this.handleKeyDown}
            @mousedown=${this.handleMouseDown}
          ></slot>
        </div>` : f`<slot
          @slotchange=${this.handleSlotChange}
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
          @mousedown=${this.handleMouseDown}
        ></slot>`;
  }
};
m.styles = [b, I];
d([
  v("slot")
], m.prototype, "defaultSlot", 2);
d([
  x({ type: Boolean })
], m.prototype, "horizontal", 2);
m = d([
  p("cx-menu")
], m);
export {
  m as default
};
