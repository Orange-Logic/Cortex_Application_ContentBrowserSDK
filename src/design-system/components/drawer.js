import { C as _, c as k } from "../chunks/custom-element.X6y1saJZ.js";
import { c as C } from "../chunks/component.styles.BLcT4bOa.js";
import { a as l, s as h } from "../chunks/animate.c3HW4nwn.js";
import { w } from "../chunks/event.mFzZi4sr.js";
import { M as z } from "../chunks/modal.OAmlKOKq.js";
import { l as m, u as y } from "../chunks/scroll.DwPiX2Ox.js";
import { H as P } from "../chunks/slot.DJLm4Dig.js";
import { w as b } from "../chunks/watch.ChG-_stu.js";
import { i as A, x as v } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { e as u } from "../chunks/query.BNveAlQo.js";
import { e as S } from "../chunks/class-map.Cn0czwWq.js";
import { o as g } from "../chunks/if-defined.D8U9hdvp.js";
import { a as r, g as d } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as $ } from "../chunks/localize.D5Yoww6T.js";
import O from "./icon-button.js";
function x(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const q = A`
  :host {
    --size: 25rem;
    --header-spacing: var(--cx-spacing-large);
    --body-spacing: var(--cx-spacing-large);
    --footer-spacing: var(--cx-spacing-large);
    --font-family: var(--cx-font-sans);

    display: contents;
  }

  .drawer {
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .drawer--contained {
    position: absolute;
    z-index: initial;
  }

  .drawer--fixed {
    position: fixed;
    z-index: var(--cx-z-index-drawer);
  }

  .drawer__panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 2;
    max-width: 100%;
    max-height: 100%;
    background-color: var(--cx-panel-background-color);
    box-shadow: var(--cx-shadow-large);
    overflow: auto;
    pointer-events: all;
  }

  .drawer__panel:focus {
    outline: none;
  }

  .drawer--top .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--end .drawer__panel {
    top: 0;
    inset-inline-end: 0;
    bottom: auto;
    inset-inline-start: auto;
    width: var(--size);
    height: 100%;
  }

  .drawer--bottom .drawer__panel {
    top: auto;
    inset-inline-end: auto;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--start .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: var(--size);
    height: 100%;
  }

  .drawer__header {
    display: flex;
    gap: var(--cx-spacing-small);
    padding: var(--header-spacing);
    border-bottom: solid 1px var(--cx-input-border-color);
    font-family: var(--font-family);
  }

  .drawer__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-medium);
    margin: 0;
    display: flex;
    align-items: center;
  }

  .drawer__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--cx-spacing-2x-small);
  }

  .drawer__header-actions cx-icon-button,
  .drawer__header-actions ::slotted(cx-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-medium);
  }

  .drawer__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    font-family: var(--font-family);
  }

  .drawer__footer {
    text-align: right;
    padding: var(--footer-spacing);
    font-family: var(--font-family);
  }

  .drawer__footer ::slotted(cx-button:not(:last-of-type)) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .drawer:not(.drawer--has-footer) .drawer__footer {
    display: none;
  }

  .drawer__overlay {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--cx-overlay-background-color);
    pointer-events: all;
  }

  .drawer--contained .drawer__overlay {
    opacity: 0;
    position: absolute;
  }

  @media (forced-colors: active) {
    .drawer__panel {
      border: solid 1px var(--cx-color-neutral-0);
    }
  }
`;
var D = Object.defineProperty, L = Object.getOwnPropertyDescriptor, i = (e, o, t, n) => {
  for (var s = n > 1 ? void 0 : n ? L(o, t) : o, p = e.length - 1, f; p >= 0; p--)
    (f = e[p]) && (s = (n ? f(o, t, s) : f(s)) || s);
  return n && s && D(o, t, s), s;
};
let a = class extends _ {
  constructor() {
    super(...arguments), this.hasSlotController = new P(this, "footer"), this.localize = new $(this), this.modal = new z(this), this.open = !1, this.label = "", this.placement = "end", this.contained = !1, this.noHeader = !1, this.handleDocumentKeyDown = (e) => {
      this.contained || e.key === "Escape" && this.modal.isActive() && this.open && (e.stopImmediatePropagation(), this.requestClose("keyboard"));
    };
  }
  firstUpdated() {
    this.drawer.hidden = !this.open, this.open && (this.addOpenListeners(), this.contained || (this.modal.activate(), m(this)));
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), y(this), (e = this.closeWatcher) == null || e.destroy();
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
      this.emit("cx-show"), this.addOpenListeners(), this.originalTrigger = document.activeElement, this.contained || (this.modal.activate(), m(this));
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
      const o = d(
        this,
        `drawer.show${x(this.placement)}`,
        {
          dir: this.localize.dir()
        }
      ), t = d(this, "drawer.overlay.show", {
        dir: this.localize.dir()
      });
      await Promise.all([
        l(this.panel, o.keyframes, o.options),
        this.contained ? Promise.resolve() : l(
          this.overlay,
          t.keyframes,
          t.options
        )
      ]), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), this.contained || (this.modal.deactivate(), y(this)), await Promise.all([
        h(this.drawer),
        h(this.overlay)
      ]);
      const e = d(
        this,
        `drawer.hide${x(this.placement)}`,
        {
          dir: this.localize.dir()
        }
      ), o = d(this, "drawer.overlay.hide", {
        dir: this.localize.dir()
      });
      await Promise.all([
        (this.contained ? Promise.resolve() : l(
          this.overlay,
          o.keyframes,
          o.options
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
    this.open && !this.contained && (this.modal.activate(), m(this)), this.open && this.contained && (this.modal.deactivate(), y(this));
  }
  /** Shows the drawer. */
  async show() {
    if (!this.open)
      return this.open = !0, w(this, "cx-after-show");
  }
  /** Hides the drawer */
  async hide() {
    if (this.open)
      return this.open = !1, w(this, "cx-after-hide");
  }
  render() {
    return v`
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
          ${this.noHeader ? "" : v`
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
a.styles = [C, q];
a.dependencies = { "cx-icon-button": O };
i([
  u(".drawer")
], a.prototype, "drawer", 2);
i([
  u(".drawer__panel")
], a.prototype, "panel", 2);
i([
  u(".drawer__overlay")
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
  b("open", { waitUntilFirstUpdate: !0 })
], a.prototype, "handleOpenChange", 1);
i([
  b("contained", { waitUntilFirstUpdate: !0 })
], a.prototype, "handleNoModalChange", 1);
a = i([
  k("cx-drawer")
], a);
r("drawer.showTop", {
  keyframes: [
    { opacity: 0, translate: "0 -100%" },
    { opacity: 1, translate: "0 0" }
  ],
  options: { duration: 250, easing: "ease" }
});
r("drawer.hideTop", {
  keyframes: [
    { opacity: 1, translate: "0 0" },
    { opacity: 0, translate: "0 -100%" }
  ],
  options: { duration: 250, easing: "ease" }
});
r("drawer.showEnd", {
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
r("drawer.hideEnd", {
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
r("drawer.showBottom", {
  keyframes: [
    { opacity: 0, translate: "0 100%" },
    { opacity: 1, translate: "0 0" }
  ],
  options: { duration: 250, easing: "ease" }
});
r("drawer.hideBottom", {
  keyframes: [
    { opacity: 1, translate: "0 0" },
    { opacity: 0, translate: "0 100%" }
  ],
  options: { duration: 250, easing: "ease" }
});
r("drawer.showStart", {
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
r("drawer.hideStart", {
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
r("drawer.denyClose", {
  keyframes: [{ scale: 1 }, { scale: 1.01 }, { scale: 1 }],
  options: { duration: 250 }
});
r("drawer.overlay.show", {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: { duration: 250 }
});
r("drawer.overlay.hide", {
  keyframes: [{ opacity: 1 }, { opacity: 0 }],
  options: { duration: 250 }
});
export {
  a as default
};
