import { guaranteedAllTransitionend as d, nextFrame as a } from "./AbstractOverlay.js";
import { OverlayStateEvent as l, BeforetoggleOpenEvent as p, BeforetoggleClosedEvent as E } from "./events.js";
import { userFocusableSelector as g, firstFocusableIn as m, firstFocusableSlottedIn as v } from "./shared.js";
import { VirtualTrigger as y } from "./VirtualTrigger.js";
function A(c) {
  class h extends c {
    async manageDialogOpen() {
      const i = this.open;
      if (await this.managePosition(), this.open !== i)
        return;
      const s = await this.dialogMakeTransition(i);
      this.open === i && await this.dialogApplyFocus(i, s);
    }
    async dialogMakeTransition(i) {
      let s = null;
      const u = (t, e) => async () => {
        if (t.open = i, !i) {
          const n = () => {
            t.removeEventListener("close", n);
          };
          t.addEventListener("close", n);
        }
        if (e > 0)
          return;
        const o = i ? p : E;
        this.dispatchEvent(new o()), i && (t.matches(g) && (s = t), s = s || m(t), s || t.querySelectorAll("slot").forEach((r) => {
          s || (s = v(r));
        }), !(!this.isConnected || this.dialogEl.open) && this.dialogEl.showModal());
      }, f = (t, e) => () => {
        if (this.open !== i)
          return;
        const o = i ? "cx-opened" : "cx-closed";
        if (e > 0) {
          t.dispatchEvent(
            new l(o, this, {
              interaction: this.type,
              publish: !1
            })
          );
          return;
        }
        if (!this.isConnected || i !== this.open)
          return;
        const n = async () => {
          const r = this.triggerElement instanceof y;
          this.dispatchEvent(
            new l(o, this, {
              interaction: this.type,
              publish: r
            })
          ), t.dispatchEvent(
            new l(o, this, {
              interaction: this.type,
              publish: !1
            })
          ), this.triggerElement && !r && this.triggerElement.dispatchEvent(
            new l(o, this, {
              interaction: this.type,
              publish: !0
            })
          ), this.state = i ? "opened" : "closed", this.returnFocus(), await a(), await a(), i === this.open && i === !1 && this.requestSlottable();
        };
        !i && this.dialogEl.open ? (this.dialogEl.addEventListener(
          "close",
          () => {
            n();
          },
          { once: !0 }
        ), this.dialogEl.close()) : n();
      };
      return this.elements.forEach((t, e) => {
        d(t, u(t, e), f(t, e));
      }), s;
    }
    async dialogApplyFocus(i, s) {
      this.applyFocus(i, s);
    }
  }
  return h;
}
export {
  A as OverlayDialog
};
