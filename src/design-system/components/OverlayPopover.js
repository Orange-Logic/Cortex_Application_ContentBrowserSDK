import { overlayTimer as d, nextFrame as l, guaranteedAllTransitionend as m } from "./AbstractOverlay.js";
import { OverlayStateEvent as c, BeforetoggleOpenEvent as E, BeforetoggleClosedEvent as w } from "./events.js";
import { userFocusableSelector as g, firstFocusableIn as P, firstFocusableSlottedIn as b } from "./shared.js";
import { VirtualTrigger as C } from "./VirtualTrigger.js";
const T = CSS.supports("(overlay: auto)");
function v(h) {
  let a = !1;
  try {
    a = h.matches(":popover-open");
  } catch {
  }
  let p = !1;
  try {
    p = h.matches(":open");
  } catch {
  }
  return a || p;
}
function B(h) {
  class a extends h {
    async manageDelay(e) {
      if (e === !1 || e !== this.open) {
        d.close(this);
        return;
      }
      this.delayed && await d.openTimer(this) && (this.open = !e);
    }
    /**
     * A popover should be hidden _after_ it is no longer on top-layer because
     * the position metrics will have changed from when it was originally positioned.
     */
    async shouldHidePopover(e) {
      if (e && this.open !== e)
        return;
      const i = async ({
        newState: s
      } = {}) => {
        s !== "open" && await this.placementController.resetOverlayPosition();
      };
      if (!v(this.dialogEl)) {
        i();
        return;
      }
      this.dialogEl.addEventListener("toggle", i, {
        once: !0
      });
    }
    async shouldShowPopover(e) {
      let i = !1;
      try {
        i = this.dialogEl.matches(":popover-open");
      } catch {
      }
      let s = !1;
      try {
        s = this.dialogEl.matches(":open");
      } catch {
      }
      e && this.open === e && !i && !s && this.isConnected && (this.dialogEl.showPopover(), await this.managePosition());
    }
    async ensureOnDOM(e) {
      await l(), T || await this.shouldHidePopover(e), await this.shouldShowPopover(e), await l();
    }
    async makeTransition(e) {
      if (this.open !== e)
        return null;
      let i = null;
      const s = (o, t) => () => {
        if (o.open = e, t === 0) {
          const n = e ? E : w;
          this.dispatchEvent(new n());
        }
        if (!e || (o.matches(g) && (i = o), i = i || P(o), i))
          return;
        o.querySelectorAll("slot").forEach((n) => {
          i || (i = b(n));
        });
      }, u = (o, t) => async () => {
        if (this.open !== e)
          return;
        const r = e ? "cx-opened" : "cx-closed";
        if (t > 0) {
          o.dispatchEvent(
            new c(r, this, {
              interaction: this.type,
              publish: !1
            })
          );
          return;
        }
        const n = async () => {
          if (this.open !== e)
            return;
          await l();
          const f = this.triggerElement instanceof C;
          this.dispatchEvent(
            new c(r, this, {
              interaction: this.type,
              publish: f
            })
          ), o.dispatchEvent(
            new c(r, this, {
              interaction: this.type,
              publish: !1
            })
          ), this.triggerElement && !f && this.triggerElement.dispatchEvent(
            new c(r, this, {
              interaction: this.type,
              publish: !0
            })
          ), this.state = e ? "opened" : "closed", this.returnFocus(), await l(), await l(), e === this.open && e === !1 && this.requestSlottable();
        };
        if (this.open !== e)
          return;
        const y = v(this.dialogEl);
        e !== !0 && y && this.isConnected ? (this.dialogEl.addEventListener(
          "beforetoggle",
          () => {
            n();
          },
          { once: !0 }
        ), this.dialogEl.hidePopover()) : n();
      };
      return this.elements.forEach((o, t) => {
        m(o, s(o, t), u(o, t));
      }), i;
    }
  }
  return a;
}
export {
  B as OverlayPopover
};
