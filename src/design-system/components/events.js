class n extends Event {
  constructor() {
    super("beforetoggle", {
      bubbles: !1,
      composed: !1
    }), this.currentState = "open", this.newState = "closed";
  }
}
class c extends Event {
  constructor() {
    super("beforetoggle", {
      bubbles: !1,
      composed: !1
    }), this.currentState = "closed", this.newState = "open";
  }
}
class a extends Event {
  constructor(s, o, {
    interaction: r,
    publish: t,
    reason: l
  }) {
    super(s, {
      bubbles: t,
      composed: t
    }), this.overlay = o, this.detail = {
      interaction: r,
      reason: l
    };
  }
}
export {
  n as BeforetoggleClosedEvent,
  c as BeforetoggleOpenEvent,
  a as OverlayStateEvent
};
