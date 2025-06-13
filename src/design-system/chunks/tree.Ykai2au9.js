import { C as S, c as z } from "./custom-element.X6y1saJZ.js";
import { c as T } from "./component.styles.BLcT4bOa.js";
import { c as P } from "./math.DqTA6ya4.js";
import { w as f } from "./watch.ChG-_stu.js";
import { i as B, x, E as C } from "./lit-element.DRlPF2me.js";
import { n as c } from "./property.CtZ87in4.js";
import { e as u } from "./query.BNveAlQo.js";
import { L as $ } from "./localize.D5Yoww6T.js";
import { s as w, a as k, b as I } from "./animate.c3HW4nwn.js";
import { r as g } from "./state.-o_YRGMi.js";
import { e as E } from "./class-map.Cn0czwWq.js";
import { l as F } from "./live.C0NiCo2U.js";
import { n as y } from "./when.CDK1Tt5Y.js";
import { a as L, g as A } from "./animation-registry.CvD8WTfD.js";
import D from "../components/checkbox.js";
import O from "../components/icon.js";
import U from "../components/spinner.js";
const N = B`
  :host {
    display: block;
    outline: 0;
    --selected-color: var(--cx-color-primary-600);
  }

  :host(:focus) {
    outline: none;
  }

  [hidden] {
    display: none !important;
  }

  slot:not([name])::slotted(cx-icon) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    color: var(--cx-color-neutral);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .tree-item__checkbox {
    pointer-events: none;
  }

  .tree-item__expand-button,
  .tree-item__checkbox,
  .tree-item__label {
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-letter-spacing-normal);
  }

  .tree-item__checkbox::part(base) {
    display: flex;
    align-items: center;
  }

  .tree-item__indentation {
    display: block;
    width: 1em;
    flex-shrink: 0;
  }

  .tree-item__expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    color: var(--cx-color-neutral-500);
    min-width: max(1em, 1rem);
    min-height: max(1em, 1rem);
    flex-shrink: 0;
    cursor: pointer;
  }

  .tree-item__expand-button {
    transition: var(--cx-transition-medium) rotate ease;
  }

  .tree-item--expanded .tree-item__expand-button {
    rotate: 90deg;
  }

  .tree-item--expanded.tree-item--rtl .tree-item__expand-button {
    rotate: -90deg;
  }

  .tree-item--expanded slot[name='expand-icon'],
  .tree-item:not(.tree-item--expanded) slot[name='collapse-icon'] {
    display: none;
  }

  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__item
    .tree-item__expand-icon-slot {
    color: var(--selected-color);
  }

  .tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot {
    display: none;
  }

  .tree-item__expand-button--visible {
    cursor: pointer;
  }

  .tree-item__item {
    display: flex;
    align-items: center;
    border-radius: var(--cx-border-radius-large);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    transition: var(--cx-transition-x-fast) background-color ease;
  }

  .tree-item__item:hover {
    background-color: var(--cx-menu-item-background-color-hover);
  }

  .tree-item__item:active {
    background-color: var(--cx-color-neutral-200);
  }

  .tree-item--disabled .tree-item__item {
    opacity: 0.5;
    outline: none;
    cursor: default;
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
    background-color: var(--cx-color-primary-50);
    color: var(--selected-color);
  }

  :host(:not([aria-disabled='true'])) .tree-item__expand-button {
    color: var(--cx-color-neutral);
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected,
  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__expand-button,
  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__actions::slotted(cx-icon-button) {
    color: var(--cx-color-neutral-0);
  }

  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__actions::slotted(cx-icon-button) {
    --hover-color: var(--cx-color-neutral-0);
  }

  .tree-item__label {
    display: flex;
    align-items: center;
  }

  .tree-item__actions {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
    font-size: var(--cx-font-size-medium);
    width: fit-content;
  }

  .tree-item__actions::slotted(*) {
    visibility: hidden;
    opacity: 0;
    transition:
      var(--cx-transition-x-fast) visibility,
      var(--cx-transition-x-fast) opacity ease;
  }

  .tree-item__item:hover .tree-item__actions::slotted(*) {
    visibility: visible;
    opacity: 1;
  }

  /**
   * If overlay attribute is not supported, the cx-overlay
   * inside dropdown will be hidden if the dropdown itself is hidden.
   * Thus, we fallback by making dropdown visible if it's open.
   * See 41MFC1
   */
  @supports not (overlay: auto) {
    .tree-item__actions::slotted(cx-dropdown[open]) {
      visibility: visible;
      opacity: 1;
    }
  }

  .tree-item__children {
    display: flex;
    flex-direction: column;
    font-size: calc(1em + var(--indent-size, var(--cx-spacing-medium)));
  }

  @media (forced-colors: active) {
    :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
      outline: dashed 1px SelectedItem;
    }
  }
`;
var j = Object.defineProperty, q = Object.getOwnPropertyDescriptor, l = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? q(t, i) : t, a = e.length - 1, r; a >= 0; a--)
    (r = e[a]) && (s = (n ? r(t, i, s) : r(s)) || s);
  return n && s && j(t, i, s), s;
};
let o = class extends S {
  constructor() {
    super(...arguments), this.localize = new $(this), this.indeterminate = !1, this.isLeaf = !1, this.loading = !1, this.selectable = !1, this.expanded = !1, this.selected = !1, this.disabled = !1, this.readonly = !1, this.lazy = !1, this.itemid = "", this.expandButtonPlacement = "start", this.disabledSyncCheckboxes = !1;
  }
  static isTreeItem(e) {
    return e instanceof Element && e.getAttribute("role") === "treeitem";
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "treeitem"), this.setAttribute("tabindex", "-1"), this.isNestedItem() && (this.slot = "children");
  }
  firstUpdated() {
    this.childrenContainer.hidden = !this.expanded, this.childrenContainer.style.height = this.expanded ? "auto" : "0", this.getChildrenItems().forEach(
      (e) => e.expandButtonPlacement = this.expandButtonPlacement
    ), this.isLeaf = !this.lazy && this.getChildrenItems().length === 0, this.handleExpandedChange();
  }
  async animateCollapse() {
    this.emit("cx-collapse"), await w(this.childrenContainer);
    const { keyframes: e, options: t } = A(this, "tree-item.collapse", {
      dir: this.localize.dir()
    });
    await k(
      this.childrenContainer,
      I(e, this.childrenContainer.scrollHeight),
      t
    ), this.childrenContainer.hidden = !0, this.emit("cx-after-collapse");
  }
  // Checks whether the item is nested into an item
  isNestedItem() {
    const e = this.parentElement;
    return !!e && o.isTreeItem(e);
  }
  handleChildrenSlotChange() {
    this.loading = !1, this.getChildrenItems().forEach(
      (e) => e.expandButtonPlacement = this.expandButtonPlacement
    ), this.isLeaf = !this.lazy && this.getChildrenItems().length === 0;
  }
  willUpdate(e) {
    e.has("selected") && !e.has("indeterminate") && (this.indeterminate = !1);
  }
  async animateExpand() {
    this.emit("cx-expand"), await w(this.childrenContainer), this.childrenContainer.hidden = !1;
    const { keyframes: e, options: t } = A(this, "tree-item.expand", {
      dir: this.localize.dir()
    });
    await k(
      this.childrenContainer,
      I(e, this.childrenContainer.scrollHeight),
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
    !this.lazy && this.loading && (this.loading = !1, this.handleChildrenSlotChange()), this.selected && (await this.updateComplete, v(this)), this.emit("cx-lazy-change");
  }
  /** Gets all the nested tree items in this node. */
  getChildrenItems({
    includeDisabled: e = !0
  } = {}) {
    return this.childrenSlot ? [...this.childrenSlot.assignedElements({ flatten: !0 })].filter(
      (t) => o.isTreeItem(t) && (e || !t.disabled)
    ) : [];
  }
  renderExpandButton() {
    const e = this.localize.dir() === "rtl", t = !this.loading && (!this.isLeaf || this.lazy);
    return x` <div
      part="expand-button"
      class=${E({
      "tree-item__expand-button": !0,
      "tree-item__expand-button--visible": t
    })}
      aria-hidden="true"
    >
      ${y(
      this.loading,
      () => x`
          <cx-spinner
            part="spinner"
            exportparts="base:spinner__base"
          ></cx-spinner>
        `
    )}
      <slot class="tree-item__expand-icon-slot" name="expand-icon">
        <cx-icon name=${e ? "chevron_left" : "chevron_right"}></cx-icon>
      </slot>
      <slot class="tree-item__expand-icon-slot" name="collapse-icon">
        <cx-icon name=${e ? "chevron_left" : "chevron_right"}></cx-icon>
      </slot>
    </div>`;
  }
  render() {
    const e = !this.loading && (!this.isLeaf || this.lazy);
    return x`
      <div
        part="base"
        class="${E({
      "tree-item": !0,
      "tree-item--disabled": this.disabled,
      "tree-item--expanded": this.expanded,
      "tree-item--has-expand-button": e,
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

          ${y(
      this.expandButtonPlacement === "start",
      this.renderExpandButton.bind(this),
      () => C
    )}
          ${y(
      this.selectable,
      () => x`
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
                ?checked="${F(this.selected)}"
                ?indeterminate="${this.indeterminate}"
                tabindex="-1"
              ></cx-checkbox>
            `
    )}

          <slot class="tree-item__label" part="label"></slot>
          <slot class="tree-item__actions" part="actions" name="actions"></slot>

          ${y(
      this.expandButtonPlacement === "end",
      this.renderExpandButton.bind(this),
      () => C
    )}
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
};
o.styles = [T, N];
o.dependencies = {
  "cx-checkbox": D,
  "cx-icon": O,
  "cx-spinner": U
};
l([
  g()
], o.prototype, "indeterminate", 2);
l([
  g()
], o.prototype, "isLeaf", 2);
l([
  g()
], o.prototype, "loading", 2);
l([
  g()
], o.prototype, "selectable", 2);
l([
  c({ reflect: !0, type: Boolean })
], o.prototype, "expanded", 2);
l([
  c({ reflect: !0, type: Boolean })
], o.prototype, "selected", 2);
l([
  c({ reflect: !0, type: Boolean })
], o.prototype, "disabled", 2);
l([
  c({ reflect: !0, type: Boolean })
], o.prototype, "readonly", 2);
l([
  c({ reflect: !0, type: Boolean })
], o.prototype, "lazy", 2);
l([
  c({ reflect: !0, type: String })
], o.prototype, "itemid", 2);
l([
  c({
    attribute: "expand-button-placement",
    reflect: !0,
    type: String
  })
], o.prototype, "expandButtonPlacement", 2);
l([
  c({
    attribute: "disabled-sync-checkboxes",
    reflect: !0,
    type: Boolean
  })
], o.prototype, "disabledSyncCheckboxes", 2);
l([
  u("slot:not([name])")
], o.prototype, "defaultSlot", 2);
l([
  u("slot[name=children]")
], o.prototype, "childrenSlot", 2);
l([
  u(".tree-item__item")
], o.prototype, "itemElement", 2);
l([
  u(".tree-item__children")
], o.prototype, "childrenContainer", 2);
l([
  u(".tree-item__expand-button slot")
], o.prototype, "expandButtonSlot", 2);
l([
  f("loading", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleLoadingChange", 1);
l([
  f("disabled")
], o.prototype, "handleDisabledChange", 1);
l([
  f("selected")
], o.prototype, "handleSelectedChange", 1);
l([
  f("expanded", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleExpandedChange", 1);
l([
  f("expanded", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleExpandAnimation", 1);
l([
  f("lazy", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleLazyChange", 1);
o = l([
  z("cx-tree-item")
], o);
L("tree-item.expand", {
  keyframes: [
    { height: "0", opacity: "0", overflow: "hidden" },
    { height: "auto", opacity: "1", overflow: "hidden" }
  ],
  options: { duration: 250, easing: "cubic-bezier(0.4, 0.0, 0.2, 1)" }
});
L("tree-item.collapse", {
  keyframes: [
    { height: "auto", opacity: "1", overflow: "hidden" },
    { height: "0", opacity: "0", overflow: "hidden" }
  ],
  options: { duration: 200, easing: "cubic-bezier(0.4, 0.0, 0.2, 1)" }
});
const H = B`
  :host {
    /*
     * These are actually used by tree item, but we define them here so they can more easily be set and all tree items
     * stay consistent.
     */
    --indent-guide-color: var(--cx-color-neutral-200);
    --indent-guide-offset: 0;
    --indent-guide-style: solid;
    --indent-guide-width: 0;
    --indent-size: var(--cx-spacing-large);

    display: block;

    /*
     * Tree item indentation uses the "em" unit to increment its width on each level, so setting the font size to zero
     * here removes the indentation for all the nodes on the first level.
     */
    font-size: 0;
  }

  :host::part(children) {
    display: flex;
    flex-direction: column;
  }
`;
var M = Object.defineProperty, R = Object.getOwnPropertyDescriptor, p = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? R(t, i) : t, a = e.length - 1, r; a >= 0; a--)
    (r = e[a]) && (s = (n ? r(t, i, s) : r(s)) || s);
  return n && s && M(t, i, s), s;
};
function v(e, t = !1, i = "single") {
  function n(r) {
    const d = r.getChildrenItems({ includeDisabled: !1 });
    if (d.length) {
      const m = d.every((b) => b.selected), _ = d.every(
        (b) => !b.selected && !b.indeterminate
      );
      r.selected = m, r.indeterminate = !m && !_;
    }
  }
  function s(r) {
    const d = r.parentElement;
    o.isTreeItem(d) && !d.disabledSyncCheckboxes && i === "multiple" && (n(d), s(d));
  }
  function a(r) {
    if (!(!(r instanceof o) && r.getAttribute("role") !== "treeitem")) {
      for (const d of r.getChildrenItems())
        d.selected = t ? r.selected || d.selected : !d.disabled && !d.readonly && r.selected, a(d);
      t && n(r);
    }
  }
  !e.disabledSyncCheckboxes && i === "multiple" && a(e), s(e);
}
let h = class extends S {
  constructor() {
    super(), this.selection = "single", this.disabledAutoExpand = !1, this.autoExpandToSelected = !1, this.expandButtonPlacement = "start", this.clickTarget = null, this.localize = new $(this), this.initTreeItem = (e) => {
      e.expandButtonPlacement = this.expandButtonPlacement, e.selectable = this.selection === "multiple", ["expand", "collapse"].filter((t) => !!this.querySelector(`[slot="${t}-icon"]`)).forEach((t) => {
        const i = e.querySelector(`[slot="${t}-icon"]`), n = this.getExpandButtonIcon(t);
        n && (i === null ? e.append(n) : i.hasAttribute("data-default") && i.replaceWith(n));
      });
    }, this.handleTreeChanged = (e) => {
      for (const t of e) {
        const i = [...t.addedNodes].filter(
          o.isTreeItem
        ), n = [...t.removedNodes].filter(
          o.isTreeItem
        );
        i.forEach(this.initTreeItem), this.lastFocusedItem && n.includes(this.lastFocusedItem) && (this.lastFocusedItem = null);
      }
    }, this.handleFocusOut = (e) => {
      const t = e.relatedTarget;
      (!t || !this.contains(t)) && (this.tabIndex = 0);
    }, this.handleFocusIn = (e) => {
      const t = e.target;
      e.target === this && this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]), o.isTreeItem(t) && !t.disabled && !t.readonly && (this.lastFocusedItem && (this.lastFocusedItem.tabIndex = -1), this.lastFocusedItem = t, this.tabIndex = -1, t.tabIndex = 0);
    }, this.addEventListener("focusin", this.handleFocusIn), this.addEventListener("focusout", this.handleFocusOut), this.addEventListener("cx-lazy-change", this.handleSlotChange);
  }
  async connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tree"), this.setAttribute("tabindex", "0"), await this.updateComplete, this.mutationObserver = new MutationObserver(this.handleTreeChanged), this.mutationObserver.observe(this, { childList: !0, subtree: !0 }), this.autoExpandToSelected && this.getAllTreeItems().length && customElements.whenDefined("cx-tree-item").then(() => {
      this.selectedItems.forEach((e) => {
        this.expandToItem(e);
      });
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
        (s) => s.removeAttribute("id")
      ), n.setAttribute("data-default", ""), n.slot = `${e}-icon`, n;
    }
    return null;
  }
  selectItem(e) {
    const t = [...this.selectedItems];
    if (this.selection === "multiple")
      e.selected = !e.selected, e.lazy && !this.disabledAutoExpand && (e.expanded = !0), v(e, !1, this.selection);
    else if (this.selection === "single" || e.isLeaf) {
      const n = this.getAllTreeItems();
      for (const s of n)
        s.selected = s === e;
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
      (s) => {
        var a;
        return ["input", "textarea"].includes(
          (a = s == null ? void 0 : s.tagName) == null ? void 0 : a.toLowerCase()
        );
      }
    ))
      return;
    const t = this.getFocusableItems(), i = this.localize.dir() === "ltr", n = this.localize.dir() === "rtl";
    if (t.length > 0) {
      e.preventDefault();
      const s = t.findIndex((m) => m.matches(":focus")), a = t[s], r = (m) => {
        const _ = t[P(m, 0, t.length - 1)];
        this.focusItem(_);
      }, d = (m) => {
        a.expanded = m;
      };
      e.key === "ArrowDown" ? r(s + 1) : e.key === "ArrowUp" ? r(s - 1) : i && e.key === "ArrowRight" || n && e.key === "ArrowLeft" ? !a || a.disabled || a.readonly || a.expanded || a.isLeaf && !a.lazy ? r(s + 1) : d(!0) : i && e.key === "ArrowLeft" || n && e.key === "ArrowRight" ? !a || a.disabled || a.readonly || a.isLeaf || !a.expanded ? r(s - 1) : d(!1) : e.key === "Home" ? r(0) : e.key === "End" ? r(t.length - 1) : (e.key === "Enter" || e.key === " ") && !a.disabled && !a.readonly && this.selectItem(a);
    }
  }
  handleClick(e) {
    const t = e.target, i = t.closest("cx-tree-item"), n = e.composedPath().some(
      (a) => {
        var r;
        return (r = a == null ? void 0 : a.classList) == null ? void 0 : r.contains("tree-item__expand-button");
      }
    ), s = e.composedPath().some(
      (a) => {
        var r;
        return (r = a == null ? void 0 : a.classList) == null ? void 0 : r.contains("tree-item__actions");
      }
    );
    !i || i.disabled || i.readonly || t !== this.clickTarget || (n ? i.expanded = !i.expanded : s || this.selectItem(i));
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
      (i) => v(i, !0, this.selection)
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
      var s;
      if (i.disabled || i.readonly) return !1;
      const n = (s = i.parentElement) == null ? void 0 : s.closest("[role=treeitem]");
      return n && (!n.expanded || n.loading || t.has(n)) && t.add(i), !t.has(i);
    });
  }
  render() {
    return x`
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
h.styles = [T, H];
p([
  u("slot:not([name])")
], h.prototype, "defaultSlot", 2);
p([
  u("slot[name=expand-icon]")
], h.prototype, "expandedIconSlot", 2);
p([
  u("slot[name=collapse-icon]")
], h.prototype, "collapsedIconSlot", 2);
p([
  c()
], h.prototype, "selection", 2);
p([
  c({ attribute: "disabled-auto-expand", type: Boolean })
], h.prototype, "disabledAutoExpand", 2);
p([
  c({ attribute: "auto-expand-to-selected", type: Boolean })
], h.prototype, "autoExpandToSelected", 2);
p([
  c({
    attribute: "expand-button-placement",
    reflect: !0,
    type: String
  })
], h.prototype, "expandButtonPlacement", 2);
p([
  f("selection")
], h.prototype, "handleSelectionChange", 1);
h = p([
  z("cx-tree")
], h);
export {
  h as C,
  o as a,
  v as s
};
