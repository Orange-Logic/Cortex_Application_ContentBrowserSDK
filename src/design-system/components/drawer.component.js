import { C as k } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as x } from "../chunks/component.styles.BLcT4bOa.js";
import { a as l, s as h } from "../chunks/animate.c3HW4nwn.js";
import { w as v } from "../chunks/event.mFzZi4sr.js";
import { M as P } from "../chunks/modal.D82DT7F2.js";
import { l as y, u } from "../chunks/scroll.DwPiX2Ox.js";
import { H as A } from "../chunks/slot.DJLm4Dig.js";
import { w as C } from "../chunks/watch.ChG-_stu.js";
import { x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { e as w } from "../chunks/query.BNveAlQo.js";
import { e as S } from "../chunks/class-map.Cn0czwWq.js";
import { o as g } from "../chunks/if-defined.D8U9hdvp.js";
import { g as d, a as o } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as $ } from "../chunks/localize.DV9I313e.js";
import O from "./icon-button.component.js";
import q from "./drawer.styles.js";
function _(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
var L = Object.defineProperty, z = Object.getOwnPropertyDescriptor, i = (n, e, r, t) => {
  for (var s = t > 1 ? void 0 : t ? z(e, r) : e, m = n.length - 1, f; m >= 0; m--)
    (f = n[m]) && (s = (t ? f(e, r, s) : f(s)) || s);
  return t && s && L(e, r, s), s;
};
const p = class p extends k {
  constructor() {
    super(...arguments), this.hasSlotController = new A(this, "footer"), this.localize = new $(this), this.modal = new P(this), this.open = !1, this.label = "", this.placement = "end", this.contained = !1, this.noHeader = !1, this.handleDocumentKeyDown = (e) => {
      this.contained || e.key === "Escape" && this.modal.isActive() && this.open && (e.stopImmediatePropagation(), this.requestClose("keyboard"));
    };
  }
  firstUpdated() {
    this.drawer.hidden = !this.open, this.open && (this.addOpenListeners(), this.contained || (this.modal.activate(), y(this)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), u(this), (e = this.closeWatcher) == null || e.destroy();
  }
  requestClose(e) {
    if (this.emit("cx-request-close", {
      cancelable: !0,
      detail: { source: e }
    }).defaultPrevented) {
      const t = d(this, "drawer.denyClose", {
        dir: this.localize.dir()
      });
      l(this.panel, t.keyframes, t.options);
      return;
    }
    this.hide();
  }
  addOpenListeners() {
    var e;
    "CloseWatcher" in window ? ((e = this.closeWatcher) == null || e.destroy(), this.contained || (this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => this.requestClose("keyboard"))) : document.addEventListener("keydown", this.handleDocumentKeyDown);
  }
  removeOpenListeners() {
    var e;
    document.removeEventListener("keydown", this.handleDocumentKeyDown), (e = this.closeWatcher) == null || e.destroy();
  }
  async handleOpenChange() {
    if (this.open) {
      this.emit("cx-show"), this.addOpenListeners(), this.originalTrigger = document.activeElement, this.contained || (this.modal.activate(), y(this));
      const e = this.querySelector("[autofocus]");
      e && e.removeAttribute("autofocus"), await Promise.all([
        h(this.drawer),
        h(this.overlay)
      ]), this.drawer.hidden = !1, requestAnimationFrame(() => {
        this.emit("cx-initial-focus", {
          cancelable: !0
        }).defaultPrevented || (e ? e.focus({
          preventScroll: !0
        }) : this.panel.focus({ preventScroll: !0 })), e && e.setAttribute("autofocus", "");
      });
      const r = d(
        this,
        `drawer.show${_(this.placement)}`,
        {
          dir: this.localize.dir()
        }
      ), t = d(this, "drawer.overlay.show", {
        dir: this.localize.dir()
      });
      await Promise.all([
        l(this.panel, r.keyframes, r.options),
        this.contained ? Promise.resolve() : l(
          this.overlay,
          t.keyframes,
          t.options
        )
      ]), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), this.contained || (this.modal.deactivate(), u(this)), await Promise.all([
        h(this.drawer),
        h(this.overlay)
      ]);
      const e = d(
        this,
        `drawer.hide${_(this.placement)}`,
        {
          dir: this.localize.dir()
        }
      ), r = d(this, "drawer.overlay.hide", {
        dir: this.localize.dir()
      });
      await Promise.all([
        (this.contained ? Promise.resolve() : l(
          this.overlay,
          r.keyframes,
          r.options
        )).then(() => {
          this.overlay.hidden = !0;
        }),
        l(
          this.panel,
          e.keyframes,
          e.options
        ).then(() => {
          this.panel.hidden = !0;
        })
      ]), this.drawer.hidden = !0, this.overlay.hidden = !1, this.panel.hidden = !1;
      const t = this.originalTrigger;
      typeof (t == null ? void 0 : t.focus) == "function" && setTimeout(() => t.focus()), this.emit("cx-after-hide");
    }
  }
  handleNoModalChange() {
    this.open && !this.contained && (this.modal.activate(), y(this)), this.open && this.contained && (this.modal.deactivate(), u(this));
  }
  /** Shows the drawer. */
  async show() {
    if (!this.open)
      return this.open = !0, v(this, "cx-after-show");
  }
  /** Hides the drawer */
  async hide() {
    if (this.open)
      return this.open = !1, v(this, "cx-after-hide");
  }
  render() {
    return b`
      <div
        part="base"
        class=${S({
      drawer: !0,
      "drawer--bottom": this.placement === "bottom",
      "drawer--contained": this.contained,
      "drawer--end": this.placement === "end",
      "drawer--fixed": !this.contained,
      "drawer--has-footer": this.hasSlotController.test("footer"),
      "drawer--open": this.open,
      "drawer--rtl": this.localize.dir() === "rtl",
      "drawer--start": this.placement === "start",
      "drawer--top": this.placement === "top"
    })}
      >
        <div
          part="overlay"
          class="drawer__overlay"
          @click=${() => this.requestClose("overlay")}
          tabindex="-1"
        ></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${g(this.noHeader ? this.label : void 0)}
          aria-labelledby=${g(this.noHeader ? void 0 : "title")}
          tabindex="0"
        >
          ${this.noHeader ? "" : b`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label">
                      ${this.label.length > 0 ? this.label : "\uFEFF"}
                    </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <cx-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="close"
                      label=${this.localize.term("close")}
                      @click=${() => this.requestClose("close-button")}
                    ></cx-icon-button>
                  </div>
                </header>
              `}

          <slot part="body" class="drawer__body"></slot>

          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
p.styles = [x, q], p.dependencies = { "cx-icon-button": O };
let a = p;
i([
  w(".drawer")
], a.prototype, "drawer", 2);
i([
  w(".drawer__panel")
], a.prototype, "panel", 2);
i([
  w(".drawer__overlay")
], a.prototype, "overlay", 2);
i([
  c({ reflect: !0, type: Boolean })
], a.prototype, "open", 2);
i([
  c({ reflect: !0 })
], a.prototype, "label", 2);
i([
  c({ reflect: !0 })
], a.prototype, "placement", 2);
i([
  c({ reflect: !0, type: Boolean })
], a.prototype, "contained", 2);
i([
  c({ attribute: "no-header", reflect: !0, type: Boolean })
], a.prototype, "noHeader", 2);
i([
  C("open", { waitUntilFirstUpdate: !0 })
], a.prototype, "handleOpenChange", 1);
i([
  C("contained", { waitUntilFirstUpdate: !0 })
], a.prototype, "handleNoModalChange", 1);
o("drawer.showTop", {
  keyframes: [
    { opacity: 0, translate: "0 -100%" },
    { opacity: 1, translate: "0 0" }
  ],
  options: { duration: 250, easing: "ease" }
});
o("drawer.hideTop", {
  keyframes: [
    { opacity: 1, translate: "0 0" },
    { opacity: 0, translate: "0 -100%" }
  ],
  options: { duration: 250, easing: "ease" }
});
o("drawer.showEnd", {
  keyframes: [
    { opacity: 0, translate: "100%" },
    { opacity: 1, translate: "0" }
  ],
  options: { duration: 250, easing: "ease" },
  rtlKeyframes: [
    { opacity: 0, translate: "-100%" },
    { opacity: 1, translate: "0" }
  ]
});
o("drawer.hideEnd", {
  keyframes: [
    { opacity: 1, translate: "0" },
    { opacity: 0, translate: "100%" }
  ],
  options: { duration: 250, easing: "ease" },
  rtlKeyframes: [
    { opacity: 1, translate: "0" },
    { opacity: 0, translate: "-100%" }
  ]
});
o("drawer.showBottom", {
  keyframes: [
    { opacity: 0, translate: "0 100%" },
    { opacity: 1, translate: "0 0" }
  ],
  options: { duration: 250, easing: "ease" }
});
o("drawer.hideBottom", {
  keyframes: [
    { opacity: 1, translate: "0 0" },
    { opacity: 0, translate: "0 100%" }
  ],
  options: { duration: 250, easing: "ease" }
});
o("drawer.showStart", {
  keyframes: [
    { opacity: 0, translate: "-100%" },
    { opacity: 1, translate: "0" }
  ],
  options: { duration: 250, easing: "ease" },
  rtlKeyframes: [
    { opacity: 0, translate: "100%" },
    { opacity: 1, translate: "0" }
  ]
});
o("drawer.hideStart", {
  keyframes: [
    { opacity: 1, translate: "0" },
    { opacity: 0, translate: "-100%" }
  ],
  options: { duration: 250, easing: "ease" },
  rtlKeyframes: [
    { opacity: 1, translate: "0" },
    { opacity: 0, translate: "100%" }
  ]
});
o("drawer.denyClose", {
  keyframes: [{ scale: 1 }, { scale: 1.01 }, { scale: 1 }],
  options: { duration: 250 }
});
o("drawer.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});
o("drawer.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});
export {
  a as default
};
