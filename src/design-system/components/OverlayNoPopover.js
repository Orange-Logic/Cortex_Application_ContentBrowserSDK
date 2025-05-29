import { overlayTimer as c, guaranteedAllTransitionend as m, nextFrame as l } from "./AbstractOverlay.js";
import { OverlayStateEvent as r, BeforetoggleOpenEvent as d, BeforetoggleClosedEvent as p } from "./events.js";
import { userFocusableSelector as v, firstFocusableIn as y, firstFocusableSlottedIn as E } from "./shared.js";
import { VirtualTrigger as g } from "./VirtualTrigger.js";
function P(h) {
  class a extends h {
    async managePopoverOpen() {
      await this.managePosition();
    }
    async manageDelay(e) {
      if (e === !1 || e !== this.open) {
        c.close(this);
        return;
      }
      this.delayed && await c.openTimer(this) && (this.open = !e);
    }
    async ensureOnDOM(e) {
      document.body.offsetHeight;
    }
    async makeTransition(e) {
      if (this.open !== e)
        return null;
      let t = null;
      const f = (i, s) => () => {
        if (e !== this.open)
          return;
        if (i.open = e, s === 0) {
          const n = e ? d : p;
          this.dispatchEvent(new n());
        }
        if (e !== !0 || (i.matches(v) && (t = i), t = t || y(i), t))
          return;
        i.querySelectorAll("slot").forEach((n) => {
          t || (t = E(n));
        });
      }, u = (i, s) => async () => {
        if (this.open !== e)
          return;
        const o = e ? "cx-opened" : "cx-closed";
        if (i.dispatchEvent(
          new r(o, this, {
            interaction: this.type
          })
        ), s > 0)
          return;
        const n = this.triggerElement instanceof g;
        this.dispatchEvent(
          new r(o, this, {
            interaction: this.type,
            publish: n
          })
        ), this.triggerElement && !n && this.triggerElement.dispatchEvent(
          new r(o, this, {
            interaction: this.type,
            publish: !0
          })
        ), this.state = e ? "opened" : "closed", this.returnFocus(), await l(), await l(), e === this.open && e === !1 && this.requestSlottable();
      };
      return this.elements.forEach((i, s) => {
        m(i, f(i, s), u(i, s));
      }), t;
    }
  }
  return a;
}
export {
  P as OverlayNoPopover
};
