class n {
  constructor(t, ...e) {
    this.slotNames = [], this.handleSlotChange = (s) => {
      const a = s.target;
      (this.slotNames.includes("[default]") && !a.name || a.name && this.slotNames.includes(a.name)) && this.host.requestUpdate();
    }, (this.host = t).addController(this), this.slotNames = e;
  }
  hasDefaultSlot() {
    return [...this.host.childNodes].some((t) => {
      if (t.nodeType === t.TEXT_NODE && t.textContent.trim() !== "")
        return !0;
      if (t.nodeType === t.ELEMENT_NODE) {
        const e = t;
        if (e.tagName.toLowerCase() === "cx-visually-hidden")
          return !1;
        if (!e.hasAttribute("slot"))
          return !0;
      }
      return !1;
    });
  }
  hasNamedSlot(t) {
    return this.host.querySelector(`:scope > [slot="${t}"]`) !== null;
  }
  test(t) {
    return t === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(t);
  }
  hostConnected() {
    this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
  }
  hostDisconnected() {
    this.host.shadowRoot.removeEventListener(
      "slotchange",
      this.handleSlotChange
    );
  }
}
function h(o) {
  if (!o)
    return "";
  const t = o.assignedNodes({ flatten: !0 });
  let e = "";
  return [...t].forEach((s) => {
    s.nodeType === Node.TEXT_NODE && (e += s.textContent);
  }), e;
}
export {
  n as H,
  h as g
};
