import { C as T } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as _ } from "../chunks/component.styles.BLcT4bOa.js";
import { s as u, a as p } from "../chunks/animate.c3HW4nwn.js";
import { w as f } from "../chunks/event.mFzZi4sr.js";
import { H as C } from "../chunks/slot.DJLm4Dig.js";
import { w as y } from "../chunks/watch.ChG-_stu.js";
import { x as c } from "../chunks/lit-element.DRlPF2me.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { r as x } from "../chunks/state.-o_YRGMi.js";
import { e as g } from "../chunks/query.BNveAlQo.js";
import { e as w } from "../chunks/class-map.Cn0czwWq.js";
import { g as v, a as b } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as I } from "../chunks/localize.DV9I313e.js";
import H from "./icon-button.component.js";
import A from "./alert.styles.js";
var $ = Object.defineProperty, E = Object.getOwnPropertyDescriptor, i = (m, t, a, s) => {
  for (var o = s > 1 ? void 0 : s ? E(t, a) : t, h = m.length - 1, d; h >= 0; h--)
    (d = m[h]) && (o = (s ? d(t, a, o) : d(o)) || o);
  return s && o && $(t, a, o), o;
};
const n = Object.assign(document.createElement("div"), {
  className: "cx-toast-stack"
}), l = class l extends T {
  constructor() {
    super(...arguments), this.hasSlotController = new C(
      this,
      "icon",
      "suffix"
    ), this.localize = new I(this), this.open = !1, this.closable = !1, this.variant = "primary", this.duration = 1 / 0, this.remainingTime = this.duration;
  }
  firstUpdated() {
    this.base.hidden = !this.open;
  }
  restartAutoHide() {
    this.handleCountdownChange(), clearTimeout(this.autoHideTimeout), clearInterval(this.remainingTimeInterval), this.open && this.duration < 1 / 0 && (this.autoHideTimeout = window.setTimeout(
      () => this.hide(),
      this.duration
    ), this.remainingTime = this.duration, this.remainingTimeInterval = window.setInterval(() => {
      this.remainingTime -= 100;
    }, 100));
  }
  pauseAutoHide() {
    var t;
    (t = this.countdownAnimation) == null || t.pause(), clearTimeout(this.autoHideTimeout), clearInterval(this.remainingTimeInterval);
  }
  resumeAutoHide() {
    var t;
    this.duration < 1 / 0 && (this.autoHideTimeout = window.setTimeout(
      () => this.hide(),
      this.remainingTime
    ), this.remainingTimeInterval = window.setInterval(() => {
      this.remainingTime -= 100;
    }, 100), (t = this.countdownAnimation) == null || t.play());
  }
  handleCountdownChange() {
    if (this.open && this.duration < 1 / 0 && this.countdown) {
      const { countdownElement: t } = this, a = "100%", s = "0";
      this.countdownAnimation = t.animate(
        [{ width: a }, { width: s }],
        {
          duration: this.duration,
          easing: "linear"
        }
      );
    }
  }
  handleCloseClick() {
    this.hide();
  }
  async handleOpenChange() {
    if (this.open) {
      this.emit("cx-show"), this.duration < 1 / 0 && this.restartAutoHide(), await u(this.base), this.base.hidden = !1;
      const { keyframes: t, options: a } = v(this, "alert.show", {
        dir: this.localize.dir()
      });
      await p(this.base, t, a), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), clearTimeout(this.autoHideTimeout), clearInterval(this.remainingTimeInterval), await u(this.base);
      const { keyframes: t, options: a } = v(this, "alert.hide", {
        dir: this.localize.dir()
      });
      await p(this.base, t, a), this.base.hidden = !0, this.emit("cx-after-hide");
    }
  }
  handleDurationChange() {
    this.restartAutoHide();
  }
  /** Shows the alert. */
  async show() {
    if (!this.open)
      return this.open = !0, f(this, "cx-after-show");
  }
  /** Hides the alert */
  async hide() {
    if (this.open)
      return this.open = !1, f(this, "cx-after-hide");
  }
  /**
   * Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when
   * dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by
   * calling this method again. The returned promise will resolve after the alert is hidden.
   */
  async toast() {
    return new Promise((t) => {
      this.handleCountdownChange(), n.parentElement === null && document.body.append(n), n.appendChild(this), requestAnimationFrame(() => {
        this.clientWidth, this.show();
      }), this.addEventListener(
        "cx-after-hide",
        () => {
          n.removeChild(this), t(), n.querySelector("cx-alert") === null && n.remove();
        },
        { once: !0 }
      );
    });
  }
  render() {
    return c`
      <div
        part="base"
        class=${w({
      alert: !0,
      "alert--closable": this.closable,
      "alert--danger": this.variant === "danger",
      "alert--has-countdown": !!this.countdown,
      "alert--has-icon": this.hasSlotController.test("icon"),
      "alert--neutral": this.variant === "neutral",
      "alert--open": this.open,
      "alert--primary": this.variant === "primary",
      "alert--success": this.variant === "success",
      "alert--warning": this.variant === "warning"
    })}
        role="alert"
        aria-hidden=${this.open ? "false" : "true"}
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <div part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </div>

        <div part="message" class="alert__message" aria-live="polite">
          <slot></slot>
        </div>

        ${this.closable ? c`
              <cx-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="close"
                label=${this.localize.term("close")}
                @click=${this.handleCloseClick}
              ></cx-icon-button>
            ` : ""}

        <div role="timer" class="alert__timer">${this.remainingTime}</div>
        ${this.countdown ? c`
              <div
                class=${w({
      alert__countdown: !0,
      "alert__countdown--ltr": this.countdown === "ltr"
    })}
              >
                <div class="alert__countdown-elapsed"></div>
              </div>
            ` : ""}
      </div>
    `;
  }
};
l.styles = [_, A], l.dependencies = { "cx-icon-button": H };
let e = l;
i([
  g('[part~="base"]')
], e.prototype, "base", 2);
i([
  g(".alert__countdown-elapsed")
], e.prototype, "countdownElement", 2);
i([
  r({ reflect: !0, type: Boolean })
], e.prototype, "open", 2);
i([
  r({ reflect: !0, type: Boolean })
], e.prototype, "closable", 2);
i([
  r({ reflect: !0 })
], e.prototype, "variant", 2);
i([
  r({ type: Number })
], e.prototype, "duration", 2);
i([
  r({ reflect: !0, type: String })
], e.prototype, "countdown", 2);
i([
  x()
], e.prototype, "remainingTime", 2);
i([
  y("open", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleOpenChange", 1);
i([
  y("duration")
], e.prototype, "handleDurationChange", 1);
b("alert.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 250, easing: "ease" }
});
b("alert.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 250, easing: "ease" }
});
export {
  e as default
};
