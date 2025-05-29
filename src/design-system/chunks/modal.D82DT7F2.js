import { a as d } from "./tabbable.Bf7wIRw3.js";
function* h(s = document.activeElement) {
  s != null && (yield s, "shadowRoot" in s && s.shadowRoot && s.shadowRoot.mode !== "closed" && (yield* h(s.shadowRoot.activeElement)));
}
function b() {
  return [...h()].pop();
}
let r = [];
class v {
  constructor(e) {
    this.tabDirection = "forward", this.handleFocusIn = () => {
      this.isActive() && this.checkFocus();
    }, this.handleKeyDown = (n) => {
      var l;
      if (n.key !== "Tab" || this.isExternalActivated || !this.isActive()) return;
      const c = b();
      if (this.previousFocus = c, this.previousFocus && this.possiblyHasTabbableChildren(this.previousFocus))
        return;
      n.shiftKey ? this.tabDirection = "backward" : this.tabDirection = "forward";
      const t = d(this.element);
      let i = t.findIndex(
        (o) => o === c
      );
      this.previousFocus = this.currentFocus;
      const a = this.tabDirection === "forward" ? 1 : -1;
      for (; ; ) {
        i + a >= t.length ? i = 0 : i + a < 0 ? i = t.length - 1 : i += a, this.previousFocus = this.currentFocus;
        const o = (
          /** @type {HTMLElement} */
          t[i]
        );
        if (this.tabDirection === "backward" && this.previousFocus && this.possiblyHasTabbableChildren(this.previousFocus) || o && this.possiblyHasTabbableChildren(o))
          return;
        n.preventDefault(), this.currentFocus = o, (l = this.currentFocus) == null || l.focus({ preventScroll: !1 });
        const u = [...h()];
        if (u.includes(this.currentFocus) || !u.includes(this.previousFocus))
          break;
      }
      setTimeout(() => this.checkFocus());
    }, this.handleKeyUp = () => {
      this.tabDirection = "forward";
    }, this.element = e, this.elementsWithTabbableControls = ["iframe"];
  }
  /** Activates focus trapping. */
  activate() {
    r.push(this.element), document.addEventListener("focusin", this.handleFocusIn), document.addEventListener("keydown", this.handleKeyDown), document.addEventListener("keyup", this.handleKeyUp);
  }
  /** Deactivates focus trapping. */
  deactivate() {
    r = r.filter((e) => e !== this.element), this.currentFocus = null, document.removeEventListener("focusin", this.handleFocusIn), document.removeEventListener("keydown", this.handleKeyDown), document.removeEventListener("keyup", this.handleKeyUp);
  }
  /** Determines if this modal element is currently active or not. */
  isActive() {
    return r[r.length - 1] === this.element;
  }
  /** Activates external modal behavior and temporarily disables focus trapping. */
  activateExternal() {
    this.isExternalActivated = !0;
  }
  /** Deactivates external modal behavior and re-enables focus trapping. */
  deactivateExternal() {
    this.isExternalActivated = !1;
  }
  checkFocus() {
    if (this.isActive() && !this.isExternalActivated) {
      const e = d(this.element);
      if (!this.element.matches(":focus-within")) {
        const n = e[0], c = e[e.length - 1], t = this.tabDirection === "forward" ? n : c;
        typeof (t == null ? void 0 : t.focus) == "function" && (this.currentFocus = t, t.focus({ preventScroll: !1 }));
      }
    }
  }
  possiblyHasTabbableChildren(e) {
    return this.elementsWithTabbableControls.includes(
      e.tagName.toLowerCase()
    ) || e.hasAttribute("controls");
  }
}
export {
  v as M
};
