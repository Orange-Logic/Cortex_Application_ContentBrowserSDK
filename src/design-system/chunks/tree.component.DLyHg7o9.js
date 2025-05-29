import { C as T } from "./cortex-element.v9MiwbrF.js";
import { c as z } from "./component.styles.BLcT4bOa.js";
import { c as D } from "./math.DqTA6ya4.js";
import { w as u } from "./watch.ChG-_stu.js";
import { x as g } from "./lit-element.DRlPF2me.js";
import { n as m } from "./property.CtZ87in4.js";
import { e as f } from "./query.BNveAlQo.js";
import { L } from "./localize.DV9I313e.js";
import { s as A, a as w, b as k } from "./animate.c3HW4nwn.js";
import { r as C } from "./state.-o_YRGMi.js";
import { e as E } from "./class-map.Cn0czwWq.js";
import { l as B } from "./live.C0NiCo2U.js";
import { n as S } from "./when.CDK1Tt5Y.js";
import { g as v, a as $ } from "./animation-registry.CvD8WTfD.js";
import O from "../components/checkbox.component.js";
import U from "../components/icon.component.js";
import P from "../components/spinner.component.js";
import N from "../components/tree.styles.js";
import q from "../components/tree-item.styles.js";
var H = Object.defineProperty, R = Object.getOwnPropertyDescriptor, l = (c, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? R(e, t) : e, a = c.length - 1, s; a >= 0; a--)
    (s = c[a]) && (n = (i ? s(e, t, n) : s(n)) || n);
  return i && n && H(e, t, n), n;
}, h;
const o = (h = class extends T {
  constructor() {
    super(...arguments), this.localize = new L(this), this.indeterminate = !1, this.isLeaf = !1, this.loading = !1, this.selectable = !1, this.expanded = !1, this.selected = !1, this.disabled = !1, this.readonly = !1, this.lazy = !1, this.disabledSyncCheckboxes = !1;
  }
  static isTreeItem(e) {
    return e instanceof Element && e.getAttribute("role") === "treeitem";
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "treeitem"), this.setAttribute("tabindex", "-1"), this.isNestedItem() && (this.slot = "children");
  }
  firstUpdated() {
    this.childrenContainer.hidden = !this.expanded, this.childrenContainer.style.height = this.expanded ? "auto" : "0", this.isLeaf = !this.lazy && this.getChildrenItems().length === 0, this.handleExpandedChange();
  }
  async animateCollapse() {
    this.emit("cx-collapse"), await A(this.childrenContainer);
    const { keyframes: e, options: t } = v(this, "tree-item.collapse", {
      dir: this.localize.dir()
    });
    await w(
      this.childrenContainer,
      k(e, this.childrenContainer.scrollHeight),
      t
    ), this.childrenContainer.hidden = !0, this.emit("cx-after-collapse");
  }
  // Checks whether the item is nested into an item
  isNestedItem() {
    const e = this.parentElement;
    return !!e && h.isTreeItem(e);
  }
  handleChildrenSlotChange() {
    this.loading = !1, this.isLeaf = !this.lazy && this.getChildrenItems().length === 0;
  }
  willUpdate(e) {
    e.has("selected") && !e.has("indeterminate") && (this.indeterminate = !1);
  }
  async animateExpand() {
    this.emit("cx-expand"), await A(this.childrenContainer), this.childrenContainer.hidden = !1;
    const { keyframes: e, options: t } = v(this, "tree-item.expand", {
      dir: this.localize.dir()
    });
    await w(
      this.childrenContainer,
      k(e, this.childrenContainer.scrollHeight),
      t
    ), this.childrenContainer.style.height = "auto", this.emit("cx-after-expand");
  }
  handleLoadingChange() {
    this.setAttribute("aria-busy", this.loading ? "true" : "false"), this.loading || this.animateExpand();
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleSelectedChange() {
    this.setAttribute("aria-selected", this.selected ? "true" : "false");
  }
  handleExpandedChange() {
    this.isLeaf ? this.removeAttribute("aria-expanded") : this.setAttribute("aria-expanded", this.expanded ? "true" : "false");
  }
  handleExpandAnimation() {
    this.expanded ? this.lazy ? (this.loading = !0, this.emit("cx-lazy-load")) : this.animateExpand() : this.animateCollapse();
  }
  async handleLazyChange() {
    !this.lazy && this.loading && (this.loading = !1, this.handleChildrenSlotChange()), this.selected && (await this.updateComplete, _(this)), this.emit("cx-lazy-change");
  }
  /** Gets all the nested tree items in this node. */
  getChildrenItems({
    includeDisabled: e = !0
  } = {}) {
    return this.childrenSlot ? [...this.childrenSlot.assignedElements({ flatten: !0 })].filter(
      (t) => h.isTreeItem(t) && (e || !t.disabled)
    ) : [];
  }
  render() {
    const e = this.localize.dir() === "rtl", t = !this.loading && (!this.isLeaf || this.lazy);
    return g`
      <div
        part="base"
        class="${E({
      "tree-item": !0,
      "tree-item--disabled": this.disabled,
      "tree-item--expanded": this.expanded,
      "tree-item--has-expand-button": t,
      "tree-item--leaf": this.isLeaf,
      "tree-item--rtl": this.localize.dir() === "rtl",
      "tree-item--selected": this.selected
    })}"
      >
        <div
          class="tree-item__item"
          part="
            item
            ${this.disabled ? "item--disabled" : ""}
            ${this.expanded ? "item--expanded" : ""}
            ${this.indeterminate ? "item--indeterminate" : ""}
            ${this.selected ? "item--selected" : ""}
          "
        >
          <div class="tree-item__indentation" part="indentation"></div>

          <div
            part="expand-button"
            class=${E({
      "tree-item__expand-button": !0,
      "tree-item__expand-button--visible": t
    })}
            aria-hidden="true"
          >
            ${S(
      this.loading,
      () => g`
                <cx-spinner
                  part="spinner"
                  exportparts="base:spinner__base"
                ></cx-spinner>
              `
    )}
            <slot class="tree-item__expand-icon-slot" name="expand-icon">
              <cx-icon
                name=${e ? "chevron_left" : "chevron_right"}
              ></cx-icon>
            </slot>
            <slot class="tree-item__expand-icon-slot" name="collapse-icon">
              <cx-icon
                name=${e ? "chevron_left" : "chevron_right"}
              ></cx-icon>
            </slot>
          </div>

          ${S(
      this.selectable,
      () => g`
              <cx-checkbox
                part="checkbox"
                exportparts="
                    base:checkbox__base,
                    control:checkbox__control,
                    control--checked:checkbox__control--checked,
                    control--indeterminate:checkbox__control--indeterminate,
                    checked-icon:checkbox__checked-icon,
                    indeterminate-icon:checkbox__indeterminate-icon,
                    label:checkbox__label
                  "
                class="tree-item__checkbox"
                ?disabled="${this.disabled}"
                ?checked="${B(this.selected)}"
                ?indeterminate="${this.indeterminate}"
                tabindex="-1"
              ></cx-checkbox>
            `
    )}

          <slot class="tree-item__label" part="label"></slot>
          <slot class="tree-item__actions" part="actions" name="actions"></slot>
        </div>
        <div class="tree-item__children" part="children" role="group">
          <slot
            name="children"
            @slotchange="${this.handleChildrenSlotChange}"
          ></slot>
        </div>
      </div>
    `;
  }
}, h.styles = [z, q], h.dependencies = {
  "cx-checkbox": O,
  "cx-icon": U,
  "cx-spinner": P
}, h);
l([
  C()
], o.prototype, "indeterminate", 2);
l([
  C()
], o.prototype, "isLeaf", 2);
l([
  C()
], o.prototype, "loading", 2);
l([
  C()
], o.prototype, "selectable", 2);
l([
  m({ reflect: !0, type: Boolean })
], o.prototype, "expanded", 2);
l([
  m({ reflect: !0, type: Boolean })
], o.prototype, "selected", 2);
l([
  m({ reflect: !0, type: Boolean })
], o.prototype, "disabled", 2);
l([
  m({ reflect: !0, type: Boolean })
], o.prototype, "readonly", 2);
l([
  m({ reflect: !0, type: Boolean })
], o.prototype, "lazy", 2);
l([
  m({
    attribute: "disabled-sync-checkboxes",
    reflect: !0,
    type: Boolean
  })
], o.prototype, "disabledSyncCheckboxes", 2);
l([
  f("slot:not([name])")
], o.prototype, "defaultSlot", 2);
l([
  f("slot[name=children]")
], o.prototype, "childrenSlot", 2);
l([
  f(".tree-item__item")
], o.prototype, "itemElement", 2);
l([
  f(".tree-item__children")
], o.prototype, "childrenContainer", 2);
l([
  f(".tree-item__expand-button slot")
], o.prototype, "expandButtonSlot", 2);
l([
  u("loading", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleLoadingChange", 1);
l([
  u("disabled")
], o.prototype, "handleDisabledChange", 1);
l([
  u("selected")
], o.prototype, "handleSelectedChange", 1);
l([
  u("expanded", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleExpandedChange", 1);
l([
  u("expanded", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleExpandAnimation", 1);
l([
  u("lazy", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleLazyChange", 1);
let b = o;
$("tree-item.expand", {
  keyframes: [
    { height: "0", opacity: "0", overflow: "hidden" },
    { height: "auto", opacity: "1", overflow: "hidden" }
  ],
  options: { duration: 250, easing: "cubic-bezier(0.4, 0.0, 0.2, 1)" }
});
$("tree-item.collapse", {
  keyframes: [
    { height: "auto", opacity: "1", overflow: "hidden" },
    { height: "0", opacity: "0", overflow: "hidden" }
  ],
  options: { duration: 200, easing: "cubic-bezier(0.4, 0.0, 0.2, 1)" }
});
var j = Object.defineProperty, M = Object.getOwnPropertyDescriptor, x = (c, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? M(e, t) : e, a = c.length - 1, s; a >= 0; a--)
    (s = c[a]) && (n = (i ? s(e, t, n) : s(n)) || n);
  return i && n && j(e, t, n), n;
};
function _(c, e = !1) {
  function t(a) {
    const s = a.getChildrenItems({ includeDisabled: !1 });
    if (s.length) {
      const r = s.every((d) => d.selected), y = s.every(
        (d) => !d.selected && !d.indeterminate
      );
      a.selected = r, a.indeterminate = !r && !y;
    }
  }
  function i(a) {
    const s = a.parentElement;
    b.isTreeItem(s) && !s.disabledSyncCheckboxes && (t(s), i(s));
  }
  function n(a) {
    if (!(!(a instanceof b) && a.getAttribute("role") !== "treeitem")) {
      for (const s of a.getChildrenItems())
        s.selected = e ? a.selected || s.selected : !s.disabled && !s.readonly && a.selected, n(s);
      e && t(a);
    }
  }
  c.disabledSyncCheckboxes || n(c), i(c);
}
const I = class I extends T {
  constructor() {
    super(), this.selection = "single", this.disabledAutoExpand = !1, this.autoExpandToSelected = !1, this.clickTarget = null, this.localize = new L(this), this.initTreeItem = (e) => {
      e.selectable = this.selection === "multiple", ["expand", "collapse"].filter((t) => !!this.querySelector(`[slot="${t}-icon"]`)).forEach((t) => {
        const i = e.querySelector(`[slot="${t}-icon"]`), n = this.getExpandButtonIcon(t);
        n && (i === null ? e.append(n) : i.hasAttribute("data-default") && i.replaceWith(n));
      });
    }, this.handleTreeChanged = (e) => {
      for (const t of e) {
        const i = [...t.addedNodes].filter(
          b.isTreeItem
        ), n = [...t.removedNodes].filter(
          b.isTreeItem
        );
        i.forEach(this.initTreeItem), this.lastFocusedItem && n.includes(this.lastFocusedItem) && (this.lastFocusedItem = null);
      }
    }, this.handleFocusOut = (e) => {
      const t = e.relatedTarget;
      (!t || !this.contains(t)) && (this.tabIndex = 0);
    }, this.handleFocusIn = (e) => {
      const t = e.target;
      e.target === this && this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]), b.isTreeItem(t) && !t.disabled && !t.readonly && (this.lastFocusedItem && (this.lastFocusedItem.tabIndex = -1), this.lastFocusedItem = t, this.tabIndex = -1, t.tabIndex = 0);
    }, this.addEventListener("focusin", this.handleFocusIn), this.addEventListener("focusout", this.handleFocusOut), this.addEventListener("cx-lazy-change", this.handleSlotChange);
  }
  async connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tree"), this.setAttribute("tabindex", "0"), await this.updateComplete, this.mutationObserver = new MutationObserver(this.handleTreeChanged), this.mutationObserver.observe(this, { childList: !0, subtree: !0 }), this.autoExpandToSelected && this.selectedItems.forEach((e) => {
      this.expandToItem(e);
    });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this.mutationObserver) == null || e.disconnect();
  }
  // Generates a clone of the expand icon element to use for each tree item
  getExpandButtonIcon(e) {
    const i = (e === "expand" ? this.expandedIconSlot : this.collapsedIconSlot).assignedElements({ flatten: !0 })[0];
    if (i) {
      const n = i.cloneNode(!0);
      return [n, ...n.querySelectorAll("[id]")].forEach(
        (a) => a.removeAttribute("id")
      ), n.setAttribute("data-default", ""), n.slot = `${e}-icon`, n;
    }
    return null;
  }
  selectItem(e) {
    const t = [...this.selectedItems];
    if (this.selection === "multiple")
      e.selected = !e.selected, e.lazy && !this.disabledAutoExpand && (e.expanded = !0), _(e);
    else if (this.selection === "single" || e.isLeaf) {
      const n = this.getAllTreeItems();
      for (const a of n)
        a.selected = a === e;
    } else this.selection === "leaf" && (e.expanded = !e.expanded);
    const i = this.selectedItems;
    (t.length !== i.length || i.some((n) => !t.includes(n))) && Promise.all(i.map((n) => n.updateComplete)).then(() => {
      this.emit("cx-selection-change", {
        detail: { selection: i }
      });
    });
  }
  getAllTreeItems() {
    return [...this.querySelectorAll("cx-tree-item")];
  }
  focusItem(e) {
    e == null || e.focus();
  }
  handleKeyDown(e) {
    if (![
      "ArrowDown",
      "ArrowUp",
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
      "Enter",
      " "
    ].includes(e.key) || e.composedPath().some(
      (a) => {
        var s;
        return ["input", "textarea"].includes(
          (s = a == null ? void 0 : a.tagName) == null ? void 0 : s.toLowerCase()
        );
      }
    ))
      return;
    const t = this.getFocusableItems(), i = this.localize.dir() === "ltr", n = this.localize.dir() === "rtl";
    if (t.length > 0) {
      e.preventDefault();
      const a = t.findIndex((d) => d.matches(":focus")), s = t[a], r = (d) => {
        const F = t[D(d, 0, t.length - 1)];
        this.focusItem(F);
      }, y = (d) => {
        s.expanded = d;
      };
      e.key === "ArrowDown" ? r(a + 1) : e.key === "ArrowUp" ? r(a - 1) : i && e.key === "ArrowRight" || n && e.key === "ArrowLeft" ? !s || s.disabled || s.readonly || s.expanded || s.isLeaf && !s.lazy ? r(a + 1) : y(!0) : i && e.key === "ArrowLeft" || n && e.key === "ArrowRight" ? !s || s.disabled || s.readonly || s.isLeaf || !s.expanded ? r(a - 1) : y(!1) : e.key === "Home" ? r(0) : e.key === "End" ? r(t.length - 1) : (e.key === "Enter" || e.key === " ") && !s.disabled && !s.readonly && this.selectItem(s);
    }
  }
  handleClick(e) {
    const t = e.target, i = t.closest("cx-tree-item"), n = e.composedPath().some(
      (s) => {
        var r;
        return (r = s == null ? void 0 : s.classList) == null ? void 0 : r.contains("tree-item__expand-button");
      }
    ), a = e.composedPath().some(
      (s) => {
        var r;
        return (r = s == null ? void 0 : s.classList) == null ? void 0 : r.contains("tree-item__actions");
      }
    );
    !i || i.disabled || i.readonly || t !== this.clickTarget || (n ? i.expanded = !i.expanded : a || this.selectItem(i));
  }
  handleMouseDown(e) {
    this.clickTarget = e.target;
  }
  expandToItem(e) {
    var i;
    const t = (i = e.parentElement) == null ? void 0 : i.closest("cx-tree-item");
    t && !t.expanded && !t.lazy && (t.expanded = !0, this.expandToItem(t));
  }
  handleSlotChange() {
    this.getAllTreeItems().forEach(this.initTreeItem);
  }
  async handleSelectionChange() {
    const e = this.selection === "multiple", t = this.getAllTreeItems();
    this.setAttribute(
      "aria-multiselectable",
      e ? "true" : "false"
    );
    for (const i of t)
      i.selectable = e;
    e ? (await this.updateComplete, [...this.querySelectorAll(":scope > cx-tree-item")].forEach(
      (i) => _(i, !0)
    )) : this.autoExpandToSelected || t.forEach((i) => {
      i.selected = !1, i.indeterminate = !1;
    });
  }
  /** @internal Returns the list of tree items that are selected in the tree. */
  get selectedItems() {
    const e = this.getAllTreeItems(), t = (i) => i.selected;
    return e.filter(t);
  }
  /** @internal Gets focusable tree items in the tree. */
  getFocusableItems() {
    const e = this.getAllTreeItems(), t = /* @__PURE__ */ new Set();
    return e.filter((i) => {
      var a;
      if (i.disabled || i.readonly) return !1;
      const n = (a = i.parentElement) == null ? void 0 : a.closest("[role=treeitem]");
      return n && (!n.expanded || n.loading || t.has(n)) && t.add(i), !t.has(i);
    });
  }
  render() {
    return g`
      <div
        part="base"
        class="tree"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot part="children" @slotchange=${this.handleSlotChange}></slot>
        <span hidden aria-hidden="true"><slot name="expand-icon"></slot></span>
        <span hidden aria-hidden="true"
          ><slot name="collapse-icon"></slot
        ></span>
      </div>
    `;
  }
};
I.styles = [z, N];
let p = I;
x([
  f("slot:not([name])")
], p.prototype, "defaultSlot", 2);
x([
  f("slot[name=expand-icon]")
], p.prototype, "expandedIconSlot", 2);
x([
  f("slot[name=collapse-icon]")
], p.prototype, "collapsedIconSlot", 2);
x([
  m()
], p.prototype, "selection", 2);
x([
  m({ attribute: "disabled-auto-expand", type: Boolean })
], p.prototype, "disabledAutoExpand", 2);
x([
  m({ attribute: "auto-expand-to-selected", type: Boolean })
], p.prototype, "autoExpandToSelected", 2);
x([
  u("selection")
], p.prototype, "handleSelectionChange", 1);
export {
  p as C,
  b as a,
  _ as s
};
