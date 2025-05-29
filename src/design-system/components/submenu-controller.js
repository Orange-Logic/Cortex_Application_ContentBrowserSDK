import { E as m, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { f as S } from "../chunks/directive-helpers.Dmi6mvkC.js";
import { i as y, t as $, e as C } from "../chunks/directive.B76A7YXI.js";
import { d as E } from "../chunks/localize-utils.DpR4JUVq.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a = (s, t) => {
  var e;
  const i = s._$AN;
  if (i === void 0) return !1;
  for (const n of i) (e = n._$AO) == null || e.call(n, t, !1), a(n, t);
  return !0;
}, l = (s) => {
  let t, i;
  do {
    if ((t = s._$AM) === void 0) break;
    i = t._$AN, i.delete(s), s = t;
  } while ((i == null ? void 0 : i.size) === 0);
}, v = (s) => {
  for (let t; t = s._$AM; s = t) {
    let i = t._$AN;
    if (i === void 0) t._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(s)) break;
    i.add(s), R(t);
  }
};
function x(s) {
  this._$AN !== void 0 ? (l(this), this._$AM = s, v(this)) : this._$AM = s;
}
function A(s, t = !1, i = 0) {
  const e = this._$AH, n = this._$AN;
  if (n !== void 0 && n.size !== 0) if (t) if (Array.isArray(e)) for (let o = i; o < e.length; o++) a(e[o], !1), l(e[o]);
  else e != null && (a(e, !1), l(e));
  else a(this, s);
}
const R = (s) => {
  s.type == $.CHILD && (s._$AP ?? (s._$AP = A), s._$AQ ?? (s._$AQ = x));
};
class L extends y {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, i, e) {
    super._$AT(t, i, e), v(this), this.isConnected = t._$AU;
  }
  _$AO(t, i = !0) {
    var e, n;
    t !== this.isConnected && (this.isConnected = t, t ? (e = this.reconnected) == null || e.call(this) : (n = this.disconnected) == null || n.call(this)), i && (a(this, t), l(this));
  }
  setValue(t) {
    if (S(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _ = () => new M();
class M {
}
const p = /* @__PURE__ */ new WeakMap(), k = C(class extends L {
  render(s) {
    return m;
  }
  update(s, [t]) {
    var e;
    const i = t !== this.Y;
    return i && this.Y !== void 0 && this.rt(void 0), (i || this.lt !== this.ct) && (this.Y = t, this.ht = (e = s.options) == null ? void 0 : e.host, this.rt(this.ct = s.element)), m;
  }
  rt(s) {
    if (this.isConnected || (s = void 0), typeof this.Y == "function") {
      const t = this.ht ?? globalThis;
      let i = p.get(t);
      i === void 0 && (i = /* @__PURE__ */ new WeakMap(), p.set(t, i)), i.get(this.Y) !== void 0 && this.Y.call(this.ht, void 0), i.set(this.Y, s), s !== void 0 && this.Y.call(this.ht, s);
    } else this.Y.value = s;
  }
  get lt() {
    var s, t;
    return typeof this.Y == "function" ? (s = p.get(this.ht ?? globalThis)) == null ? void 0 : s.get(this.Y) : (t = this.Y) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
class D {
  constructor(t, i) {
    this.popupRef = _(), this.enableSubmenuTimer = -1, this.isConnected = !1, this.isPopupConnected = !1, this.skidding = 0, this.submenuOpenDelay = 100, this.handleMouseMove = (e) => {
      var o, r;
      const n = getComputedStyle(this.host).direction === "rtl" || ((r = (o = this.popupRef.value) == null ? void 0 : o.dataset.currentPlacement) == null ? void 0 : r.startsWith("left"));
      this.host.style.setProperty(
        "--safe-triangle-cursor-x",
        `${e.clientX + (n ? 1 : 0)}px`
      ), this.host.style.setProperty(
        "--safe-triangle-cursor-y",
        `${e.clientY}px`
      );
    }, this.handleMouseOver = () => {
      this.hasSlotController.test("submenu") && this.enableSubmenu();
    }, this.handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
        case "Tab":
          this.disableSubmenu();
          break;
        case "ArrowLeft":
          e.target !== this.host && (e.preventDefault(), e.stopPropagation(), this.host.focus(), this.disableSubmenu());
          break;
        case "ArrowRight":
        case "Enter":
        case " ":
          this.handleSubmenuEntry(e);
          break;
      }
    }, this.handleClick = (e) => {
      var n, o;
      e.target === this.host ? (e.preventDefault(), e.stopPropagation(), (n = e.sourceCapabilities) != null && n.firesTouchEvents && (this.isExpanded() ? this.disableSubmenu() : this.enableSubmenu())) : e.target instanceof Element && (e.target.tagName === "cx-menu-item" || (o = e.target.role) != null && o.startsWith("menuitem"));
    }, this.handleMouseLeave = (e) => {
      e.relatedTarget && e.relatedTarget instanceof Element && this.host.contains(e.relatedTarget) || this.disableSubmenu();
    }, this.handlePopupMouseover = (e) => {
      e.stopPropagation();
    }, this.handlePopupReposition = () => {
      var c, f;
      const e = this.host.renderRoot.querySelector("slot[name='submenu']"), n = e == null ? void 0 : e.assignedElements({ flatten: !0 }).filter((b) => b.localName === "cx-menu")[0], o = getComputedStyle(this.host).direction === "rtl" || ((f = (c = this.popupRef.value) == null ? void 0 : c.dataset.currentPlacement) == null ? void 0 : f.startsWith("left"));
      if (!n)
        return;
      const { height: r, left: h, top: d, width: u } = n.getBoundingClientRect();
      this.host.style.setProperty(
        "--safe-triangle-submenu-start-x",
        `${o ? h + u : h}px`
      ), this.host.style.setProperty("--safe-triangle-submenu-start-y", `${d}px`), this.host.style.setProperty(
        "--safe-triangle-submenu-end-x",
        `${o ? h + u : h}px`
      ), this.host.style.setProperty(
        "--safe-triangle-submenu-end-y",
        `${d + r}px`
      );
    }, (this.host = t).addController(this), this.hasSlotController = i;
  }
  get popup() {
    return this.popupRef.value;
  }
  hostConnected() {
    this.hasSlotController.test("submenu") && !this.host.disabled && this.addListeners();
  }
  hostDisconnected() {
    this.removeListeners();
  }
  hostUpdated() {
    this.hasSlotController.test("submenu") && !this.host.disabled ? (this.addListeners(), this.updateSkidding()) : this.removeListeners();
  }
  addListeners() {
    this.isConnected || (this.host.addEventListener("mousemove", this.handleMouseMove), this.host.addEventListener("mouseover", this.handleMouseOver), this.host.addEventListener("keydown", this.handleKeyDown), this.host.addEventListener("click", this.handleClick), this.host.addEventListener("mouseleave", this.handleMouseLeave), this.isConnected = !0), this.isPopupConnected || this.popupRef.value && (this.popupRef.value.addEventListener(
      "mouseover",
      this.handlePopupMouseover
    ), this.popupRef.value.addEventListener(
      "cx-reposition",
      this.handlePopupReposition
    ), this.isPopupConnected = !0);
  }
  removeListeners() {
    this.isConnected && (this.host.removeEventListener("mousemove", this.handleMouseMove), this.host.removeEventListener("mouseover", this.handleMouseOver), this.host.removeEventListener("keydown", this.handleKeyDown), this.host.removeEventListener("click", this.handleClick), this.host.removeEventListener("mouseleave", this.handleMouseLeave), this.isConnected = !1), this.isPopupConnected && this.popupRef.value && (this.popupRef.value.removeEventListener(
      "mouseover",
      this.handlePopupMouseover
    ), this.popupRef.value.removeEventListener(
      "cx-reposition",
      this.handlePopupReposition
    ), this.isPopupConnected = !1);
  }
  handleSubmenuEntry(t) {
    const i = this.host.renderRoot.querySelector("slot[name='submenu']");
    if (!i) {
      console.error(
        "Cannot activate a submenu if no corresponding menuitem can be found.",
        this
      );
      return;
    }
    let e = null;
    for (const n of i.assignedElements())
      if (e = n.querySelectorAll("cx-menu-item, [role^='menuitem']"), e.length !== 0)
        break;
    if (!(!e || e.length === 0)) {
      e[0].setAttribute("tabindex", "0");
      for (let n = 1; n !== e.length; ++n)
        e[n].setAttribute("tabindex", "-1");
      this.popupRef.value && (t.preventDefault(), t.stopPropagation(), this.popupRef.value.active ? e[0] instanceof HTMLElement && e[0].focus() : (this.enableSubmenu(!1), this.popupRef.value.addEventListener("cx-opened", () => {
        e[0] instanceof HTMLElement && e[0].focus();
      }), this.host.requestUpdate()));
    }
  }
  setSubmenuState(t) {
    this.popupRef.value && this.popupRef.value.active !== t && (this.popupRef.value.active = t, this.host.requestUpdate());
  }
  // Shows the submenu. Supports disabling the opening delay, e.g. for keyboard events that want to set the focus to the
  // newly opened menu.
  enableSubmenu(t = !0) {
    t ? (window.clearTimeout(this.enableSubmenuTimer), this.enableSubmenuTimer = window.setTimeout(() => {
      this.setSubmenuState(!0);
    }, this.submenuOpenDelay)) : this.setSubmenuState(!0);
  }
  disableSubmenu() {
    window.clearTimeout(this.enableSubmenuTimer), this.setSubmenuState(!1);
  }
  // Calculate the space the top of a menu takes-up, for aligning the popup menu-item with the activating element.
  updateSkidding() {
    var n;
    if (!((n = this.host.parentElement) != null && n.computedStyleMap))
      return;
    const t = this.host.parentElement.computedStyleMap(), e = ["padding-top", "border-top-width", "margin-top"].reduce((o, r) => {
      const h = t.get(r) ?? new CSSUnitValue(0, "px"), u = (h instanceof CSSUnitValue ? h : new CSSUnitValue(0, "px")).to("px");
      return o - u.value;
    }, 0);
    this.skidding = e;
  }
  isExpanded() {
    return this.popupRef.value ? this.popupRef.value.active : !1;
  }
  renderSubmenu() {
    const t = E(this.host) === "rtl";
    return this.hasSlotController.test("submenu") ? g`
      <cx-popup
        ${k(this.popupRef)}
        placement=${t ? "left-start" : "right-start"}
        anchor="anchor"
        flip
        flip-fallback-strategy="best-fit"
        skidding="${this.skidding}"
        strategy="fixed"
        auto-size="both"
        auto-size-padding="10"
        .flipBoundary=${this.host.flipBoundary}
        .shiftBoundary=${this.host.shiftBoundary}
        .autoSizeBoundary=${this.host.autoSizeBoundary}
      >
        <slot name="submenu"></slot>
      </cx-popup>
    ` : null;
  }
}
export {
  D as SubmenuController
};
