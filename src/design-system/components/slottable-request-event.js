class o extends Event {
  constructor(e, s, t) {
    super("slottable-request", {
      bubbles: !1,
      cancelable: !0,
      composed: !1
    }), this.name = e, this.data = s, this.slotName = t !== void 0 ? `${e}.${t}` : e;
  }
}
const a = Symbol("remove-slottable-request");
export {
  o as SlottableRequestEvent,
  a as removeSlottableRequest
};
