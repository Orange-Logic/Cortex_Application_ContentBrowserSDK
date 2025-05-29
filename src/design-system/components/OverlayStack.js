const c = "showPopover" in document.createElement("div");
class a {
  constructor() {
    this.root = document.body, this.stack = [], this.handlePointerdown = (t) => {
      this.pointerdownPath = t.composedPath(), this.lastOverlay = this.stack[this.stack.length - 1];
    }, this.handlePointerup = () => {
      const t = this.pointerdownPath;
      if (this.pointerdownPath = void 0, !this.stack.length || !(t != null && t.length)) return;
      const e = this.stack.length - 1, s = this.stack.filter((n, i) => !t.find(
        (h) => (
          // The Overlay is in the stack
          h === n || // The Overlay trigger is in the stack and the Overlay is a "hint"
          h === (n == null ? void 0 : n.triggerElement) && (n == null ? void 0 : n.type) === "hint" || // The last Overlay in the stack is not the last Overlay at `pointerdown` time and has a
          // `triggerInteraction` of "longpress", meaning it was opened by this poitner interaction
          i === e && n !== this.lastOverlay && n.triggerInteraction === "longpress"
        )
      ) && !n.shouldPreventClose() && n.type !== "manual");
      s.reverse(), s.forEach((n) => {
        this.closeOverlay(n);
        let i = n.parentOverlayToForceClose;
        for (; i; )
          this.closeOverlay(i), i = i.parentOverlayToForceClose;
      });
    }, this.handleBeforetoggle = (t) => {
      const { newState: e, target: s } = t;
      e !== "open" && this.closeOverlay(s);
    }, this.handleKeydown = (t) => {
      if (t.code !== "Escape" || !this.stack.length) return;
      const e = this.stack[this.stack.length - 1];
      if ((e == null ? void 0 : e.type) === "page") {
        t.preventDefault();
        return;
      }
      c || (e == null ? void 0 : e.type) !== "manual" && e && this.closeOverlay(e);
    }, this.bindEvents();
  }
  get document() {
    var t;
    return ((t = this.root) == null ? void 0 : t.ownerDocument) || document;
  }
  bindEvents() {
    this.document.addEventListener("pointerdown", this.handlePointerdown), this.document.addEventListener("pointerup", this.handlePointerup), this.document.addEventListener("keydown", this.handleKeydown);
  }
  closeOverlay(t) {
    const e = this.stack.indexOf(t);
    e > -1 && this.stack.splice(e, 1), t.open = !1;
  }
  /**
   * Get an array of Overlays that all share the same trigger element.
   *
   * @param triggerElement {HTMLELement}
   * @returns {Overlay[]}
   */
  overlaysByTriggerElement(t) {
    return this.stack.filter(
      (e) => e.triggerElement === t
    );
  }
  /**
   * When overlays are added manage the open state of exisiting overlays appropriately:
   * - 'modal': should close other overlays
   * - 'page': should close other overlays
   * - 'auto': should close other 'auto' overlays and other 'hint' overlays, but not 'manual' overlays
   * - 'manual': shouldn't close other overlays
   * - 'hint': shouldn't close other overlays and give way to all other overlays on a trigger
   */
  add(t) {
    if (this.stack.includes(t)) {
      const e = this.stack.indexOf(t);
      e > -1 && (this.stack.splice(e, 1), this.stack.push(t));
      return;
    }
    if (t.type === "auto" || t.type === "modal" || t.type === "page") {
      const e = "cx-overlay-query-path", s = new Event(e, {
        bubbles: !0,
        composed: !0
      });
      t.addEventListener(
        e,
        (n) => {
          const i = n.composedPath();
          this.stack.forEach((r) => {
            !i.find((o) => o === r) && r.type !== "manual" && this.closeOverlay(r);
          });
        },
        { once: !0 }
      ), t.dispatchEvent(s);
    } else if (t.type === "hint") {
      if (this.stack.some((s) => s.type !== "manual" && s.triggerElement && s.triggerElement === t.triggerElement)) {
        t.open = !1;
        return;
      }
      this.stack.forEach((s) => {
        s.type === "hint" && this.closeOverlay(s);
      });
    }
    requestAnimationFrame(() => {
      this.stack.push(t), t.addEventListener("beforetoggle", this.handleBeforetoggle, {
        once: !0
      });
    });
  }
  remove(t) {
    this.closeOverlay(t);
  }
}
const u = new a();
export {
  u as overlayStack
};
