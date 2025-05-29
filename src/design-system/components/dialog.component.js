import { C as _ } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as C } from "../chunks/component.styles.BLcT4bOa.js";
import { a as r, s as d } from "../chunks/animate.c3HW4nwn.js";
import { w as y } from "../chunks/event.mFzZi4sr.js";
import { M as x } from "../chunks/modal.D82DT7F2.js";
import { l as v, u as g } from "../chunks/scroll.DwPiX2Ox.js";
import { H as k } from "../chunks/slot.DJLm4Dig.js";
import { w as A } from "../chunks/watch.ChG-_stu.js";
import { x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import { e as O } from "../chunks/class-map.Cn0czwWq.js";
import { o as w } from "../chunks/if-defined.D8U9hdvp.js";
import { g as l, a as n } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as P } from "../chunks/localize.DV9I313e.js";
import S from "./divider.component.js";
import $ from "./icon-button.component.js";
import q from "./dialog.styles.js";
var L = Object.defineProperty, z = Object.getOwnPropertyDescriptor, s = (u, e, i, t) => {
  for (var a = t > 1 ? void 0 : t ? z(e, i) : e, m = u.length - 1, f; m >= 0; m--)
    (f = u[m]) && (a = (t ? f(e, i, a) : f(a)) || a);
  return t && a && L(e, i, a), a;
};
const h = class h extends _ {
  constructor() {
    super(...arguments), this.hasSlotController = new k(this, "footer"), this.localize = new P(this), this.modal = new x(this), this.open = !1, this.label = "", this.noHeader = !1, this.strategy = "fixed", this.handleDocumentKeyDown = (e) => {
      e.key === "Escape" && this.modal.isActive() && this.open && (e.stopPropagation(), this.requestClose("keyboard"));
    };
  }
  firstUpdated() {
    this.dialog.hidden = !this.open, this.open && (this.addOpenListeners(), this.modal.activate(), v(this));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), this.modal.deactivate(), g(this), (e = this.closeWatcher) == null || e.destroy();
  }
  requestClose(e) {
    if (this.emit("cx-request-close", {
      cancelable: !0,
      detail: { source: e }
    }).defaultPrevented) {
      const t = l(this, "dialog.denyClose", {
        dir: this.localize.dir()
      });
      r(this.panel, t.keyframes, t.options);
      return;
    }
    this.hide();
  }
  addOpenListeners() {
    var e;
    "CloseWatcher" in window ? ((e = this.closeWatcher) == null || e.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => this.requestClose("keyboard")) : document.addEventListener("keydown", this.handleDocumentKeyDown);
  }
  removeOpenListeners() {
    var e;
    (e = this.closeWatcher) == null || e.destroy(), document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }
  async handleOpenChange() {
    if (this.open) {
      this.emit("cx-show"), this.addOpenListeners(), this.originalTrigger = document.activeElement, this.modal.activate(), v(this);
      const e = this.querySelector("[autofocus]");
      e && e.removeAttribute("autofocus"), await Promise.all([
        d(this.dialog),
        d(this.overlay)
      ]), this.dialog.hidden = !1, requestAnimationFrame(() => {
        this.emit("cx-initial-focus", {
          cancelable: !0
        }).defaultPrevented || (e ? e.focus({
          preventScroll: !0
        }) : this.panel.focus({ preventScroll: !0 })), e && e.setAttribute("autofocus", "");
      });
      const i = l(this, "dialog.show", {
        dir: this.localize.dir()
      }), t = l(this, "dialog.overlay.show", {
        dir: this.localize.dir()
      });
      await Promise.all([
        r(this.panel, i.keyframes, i.options),
        r(
          this.overlay,
          t.keyframes,
          t.options
        )
      ]), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), this.modal.deactivate(), await Promise.all([
        d(this.dialog),
        d(this.overlay)
      ]);
      const e = l(this, "dialog.hide", {
        dir: this.localize.dir()
      }), i = l(this, "dialog.overlay.hide", {
        dir: this.localize.dir()
      });
      await Promise.all([
        r(
          this.overlay,
          i.keyframes,
          i.options
        ).then(() => {
          this.overlay.hidden = !0;
        }),
        r(
          this.panel,
          e.keyframes,
          e.options
        ).then(() => {
          this.panel.hidden = !0;
        })
      ]), this.dialog.hidden = !0, this.overlay.hidden = !1, this.panel.hidden = !1, g(this);
      const t = this.originalTrigger;
      typeof (t == null ? void 0 : t.focus) == "function" && setTimeout(() => t.focus()), this.emit("cx-after-hide");
    }
  }
  /** Shows the dialog. */
  async show() {
    if (!this.open)
      return this.open = !0, y(this, "cx-after-show");
  }
  /** Hides the dialog */
  async hide() {
    if (this.open)
      return this.open = !1, y(this, "cx-after-hide");
  }
  render() {
    return b`
      <div
        part="base"
        class=${O({
      dialog: !0,
      "dialog--absolute": this.strategy === "absolute",
      "dialog--has-footer": this.hasSlotController.test("footer"),
      "dialog--open": this.open
    })}
      >
        <div
          part="overlay"
          class="dialog__overlay"
          @click=${() => this.requestClose("overlay")}
          tabindex="-1"
        ></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${w(this.noHeader ? this.label : void 0)}
          aria-labelledby=${w(this.noHeader ? void 0 : "title")}
          tabindex="-1"
        >
          ${this.noHeader ? "" : b`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label">
                      ${this.label.length > 0 ? this.label : "\uFEFF"}
                    </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <cx-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="close"
                      label=${this.localize.term("close")}
                      @click="${() => this.requestClose("close-button")}"
                    ></cx-icon-button>
                  </div>
                </header>
                <cx-divider class="dialog__header-divider"></cx-divider>
              `}
          ${""}
          <div part="body" class="dialog__body" tabindex="-1">
            <slot></slot>
          </div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
h.styles = [C, q], h.dependencies = {
  "cx-divider": S,
  "cx-icon-button": $
};
let o = h;
s([
  p(".dialog")
], o.prototype, "dialog", 2);
s([
  p(".dialog__panel")
], o.prototype, "panel", 2);
s([
  p(".dialog__overlay")
], o.prototype, "overlay", 2);
s([
  p('slot[name="footer"]')
], o.prototype, "footerSlot", 2);
s([
  c({ reflect: !0, type: Boolean })
], o.prototype, "open", 2);
s([
  c({ reflect: !0 })
], o.prototype, "label", 2);
s([
  c({ attribute: "no-header", reflect: !0, type: Boolean })
], o.prototype, "noHeader", 2);
s([
  c({ reflect: !0 })
], o.prototype, "strategy", 2);
s([
  A("open", { waitUntilFirstUpdate: !0 })
], o.prototype, "handleOpenChange", 1);
n("dialog.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 250, easing: "ease" }
});
n("dialog.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 250, easing: "ease" }
});
n("dialog.denyClose", {
  keyframes: [{ scale: 1 }, { scale: 1.02 }, { scale: 1 }],
  options: { duration: 250 }
});
n("dialog.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});
n("dialog.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});
export {
  o as default
};
