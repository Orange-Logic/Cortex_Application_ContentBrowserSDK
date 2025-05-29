import { C as I } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as C } from "../chunks/component.styles.BLcT4bOa.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as E } from "../chunks/property.CtZ87in4.js";
import { e as b } from "../chunks/query.BNveAlQo.js";
import w from "./menu.styles.js";
var k = Object.defineProperty, p = (h, n, i, r) => {
  for (var l = void 0, m = h.length - 1, o; m >= 0; m--)
    (o = h[m]) && (l = o(n, i, l) || l);
  return l && k(n, i, l), l;
};
function c(h) {
  return h.tagName.toLowerCase() === "cx-menu" && h instanceof f && h.getAttribute("role") === "menu";
}
const g = class g extends I {
  constructor() {
    super(...arguments), this.horizontal = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "menu");
  }
  handleClick(n) {
    const i = ["menuitem", "menuitemcheckbox"], r = n.composedPath(), l = r.find(
      (s) => {
        var t;
        return i.includes(((t = s == null ? void 0 : s.getAttribute) == null ? void 0 : t.call(s, "role")) || "");
      }
    );
    if (!l || r.find(
      (s) => {
        var t;
        return ((t = s == null ? void 0 : s.getAttribute) == null ? void 0 : t.call(s, "role")) === "menu";
      }
    ) !== this) return;
    const a = l;
    a.type === "checkbox" && (a.checked = !a.checked), this.emit("cx-select", { detail: { item: a } });
  }
  handleKeyDown(n) {
    var i, r, l, m;
    if (n.key === "Enter" || n.key === " ") {
      const o = this.getCurrentItem();
      n.preventDefault(), n.stopPropagation(), o == null || o.click();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(n.key)) {
      const o = this.getAllItems(), a = this.getCurrentItem();
      let s = a ? o.indexOf(a) : 0;
      if (o.length > 0) {
        if (n.preventDefault(), n.stopPropagation(), n.key === "ArrowDown")
          s++;
        else if (n.key === "ArrowUp")
          s--;
        else if (n.key === "Home") {
          let t = (i = this.parentElement) == null ? void 0 : i.firstElementChild;
          for (; t && !c(t); )
            t = t.nextElementSibling;
          if (t) {
            const e = t.getAllItems();
            if (e.length > 0) {
              t.setCurrentItem(e[0]), e[0].focus();
              return;
            }
          }
          s = 0;
        } else if (n.key === "End") {
          let t = (r = this.parentElement) == null ? void 0 : r.lastElementChild;
          for (; t && !c(t); )
            t = t.previousElementSibling;
          if (t) {
            const e = t.getAllItems();
            if (e.length > 0) {
              t.setCurrentItem(e[e.length - 1]), e[e.length - 1].focus();
              return;
            }
          }
          s = 0;
        }
        if (s < 0) {
          let t = this.previousElementSibling;
          for (; t && !c(t); )
            t = t.previousElementSibling;
          if (t) {
            const e = t.getAllItems();
            if (e.length > 0) {
              t.setCurrentItem(
                e[e.length - 1]
              ), e[e.length - 1].focus();
              return;
            }
          } else {
            let e = (l = this.parentElement) == null ? void 0 : l.lastElementChild;
            for (; e && !c(e); )
              e = e.previousElementSibling;
            if (e) {
              const u = e.getAllItems();
              if (u.length > 0) {
                e.setCurrentItem(u[u.length - 1]), u[u.length - 1].focus();
                return;
              }
            }
            s = 0;
          }
        }
        if (s > o.length - 1) {
          let t = this.nextElementSibling;
          for (; t && !c(t); )
            t = t.nextElementSibling;
          if (t) {
            const e = t.getAllItems();
            if (e.length > 0) {
              t.setCurrentItem(e[0]), e[0].focus();
              return;
            }
          } else {
            let e = (m = this.parentElement) == null ? void 0 : m.firstElementChild;
            for (; e && !c(e); )
              e = e.nextElementSibling;
            if (e) {
              const u = e.getAllItems();
              if (u.length > 0) {
                e.setCurrentItem(u[0]), u[0].focus();
                return;
              }
            }
            s = 0;
          }
        }
        this.setCurrentItem(o[s]), o[s].focus();
      }
    }
  }
  handleMouseDown(n) {
    const i = n.target;
    this.isMenuItem(i) && this.setCurrentItem(i);
  }
  handleSlotChange() {
    const n = this.getAllItems();
    n.length > 0 && this.setCurrentItem(n[0]), this.defaultSlot.assignedElements().forEach((i) => {
      const r = i, l = r.previousElementSibling;
      (this.isMenuSection(l) && this.isMenuItem(r) || (this.isMenuItem(l) || this.isMenuSection(l)) && this.isMenuSection(r) && r.childElementCount > 0) && r.setAttribute(
        "data-alternating-grouping",
        this.horizontal ? "horizontal" : ""
      );
    });
  }
  isMenuSection(n) {
    return n instanceof HTMLElement ? n.tagName.toLowerCase() === "cx-menu-section" : !1;
  }
  isMenuItem(n) {
    return n instanceof HTMLElement ? n.tagName.toLowerCase() === "cx-menu-item" || ["menuitem", "menuitemcheckbox", "menuitemradio"].includes(
      n.getAttribute("role") ?? ""
    ) : !1;
  }
  /** @internal Gets all slotted menu items, ignoring dividers, headers, and other elements. */
  getAllItems() {
    return this.defaultSlot.assignedElements({ flatten: !0 }).flatMap((i) => {
      var r;
      if (this.isMenuSection(i)) {
        const l = (r = i.shadowRoot) == null ? void 0 : r.querySelector("slot");
        return l ? [...l.assignedElements({ flatten: !0 })] : [];
      }
      return i;
    }).filter((i) => !(i.inert || !this.isMenuItem(i)));
  }
  /**
   * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
   * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
   */
  getCurrentItem() {
    return this.getAllItems().find((n) => n.getAttribute("tabindex") === "0");
  }
  /**
   * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
   * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
   */
  setCurrentItem(n) {
    this.getAllItems().forEach((r) => {
      r.setAttribute("tabindex", r === n ? "0" : "-1");
    });
  }
  render() {
    return this.horizontal ? d`<div class="horizontal">
          <slot
            @slotchange=${this.handleSlotChange}
            @click=${this.handleClick}
            @keydown=${this.handleKeyDown}
            @mousedown=${this.handleMouseDown}
          ></slot>
        </div>` : d`<slot
          @slotchange=${this.handleSlotChange}
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
          @mousedown=${this.handleMouseDown}
        ></slot>`;
  }
};
g.styles = [C, w];
let f = g;
p([
  b("slot")
], f.prototype, "defaultSlot");
p([
  E({ type: Boolean })
], f.prototype, "horizontal");
export {
  f as default
};
