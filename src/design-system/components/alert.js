import { C as b, c as x } from "../chunks/custom-element.X6y1saJZ.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { s as u, a as p } from "../chunks/animate.c3HW4nwn.js";
import { w as m } from "../chunks/event.mFzZi4sr.js";
import { H as C } from "../chunks/slot.DJLm4Dig.js";
import { w } from "../chunks/watch.ChG-_stu.js";
import { i as T, x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { r as I } from "../chunks/state.-o_YRGMi.js";
import { e as g } from "../chunks/query.BNveAlQo.js";
import { e as f } from "../chunks/class-map.Cn0czwWq.js";
import { a as _, g as v } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as A } from "../chunks/localize.D5Yoww6T.js";
import H from "./icon-button.js";
const k = T`
  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-top-width: calc(var(--cx-panel-border-width) * 3);
    border-radius: var(--cx-border-radius-small);
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-regular);
    line-height: 1.6;
    color: var(--cx-color-neutral-700);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-large);
    padding-inline-start: var(--cx-spacing-large);
  }

  .alert--has-countdown {
    border-bottom: none;
  }

  .alert--primary {
    border-top-color: var(--cx-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--cx-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--cx-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--cx-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--cx-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--cx-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--cx-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--cx-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--cx-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--cx-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--cx-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-medium);
    padding-inline-end: var(--cx-spacing-medium);
  }

  .alert__countdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--cx-panel-border-width) * 3);
    background-color: var(--cx-panel-border-color);
    display: flex;
  }
  .alert__countdown--ltr {
    justify-content: flex-end;
  }
  .alert__countdown .alert__countdown-elapsed {
    height: 100%;
    width: 0;
  }
  .alert--primary .alert__countdown-elapsed {
    background-color: var(--cx-color-primary-600);
  }
  .alert--success .alert__countdown-elapsed {
    background-color: var(--cx-color-success-600);
  }
  .alert--neutral .alert__countdown-elapsed {
    background-color: var(--cx-color-neutral-600);
  }
  .alert--warning .alert__countdown-elapsed {
    background-color: var(--cx-color-warning-600);
  }
  .alert--danger .alert__countdown-elapsed {
    background-color: var(--cx-color-danger-600);
  }
  .alert__timer {
    display: none;
  }
`;
var z = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, r = (e, o, n, l) => {
  for (var a = l > 1 ? void 0 : l ? $(o, n) : o, c = e.length - 1, d; c >= 0; c--)
    (d = e[c]) && (a = (l ? d(o, n, a) : d(a)) || a);
  return l && a && z(o, n, a), a;
};
const i = Object.assign(document.createElement("div"), {
  className: "cx-toast-stack"
});
let t = class extends b {
  constructor() {
    super(...arguments), this.hasSlotController = new C(
      this,
      "icon",
      "suffix"
    ), this.localize = new A(this), this.open = !1, this.closable = !1, this.variant = "primary", this.duration = 1 / 0, this.remainingTime = this.duration;
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
    var e;
    (e = this.countdownAnimation) == null || e.pause(), clearTimeout(this.autoHideTimeout), clearInterval(this.remainingTimeInterval);
  }
  resumeAutoHide() {
    var e;
    this.duration < 1 / 0 && (this.autoHideTimeout = window.setTimeout(
      () => this.hide(),
      this.remainingTime
    ), this.remainingTimeInterval = window.setInterval(() => {
      this.remainingTime -= 100;
    }, 100), (e = this.countdownAnimation) == null || e.play());
  }
  handleCountdownChange() {
    if (this.open && this.duration < 1 / 0 && this.countdown) {
      const { countdownElement: e } = this, o = "100%", n = "0";
      this.countdownAnimation = e.animate(
        [{ width: o }, { width: n }],
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
      const { keyframes: e, options: o } = v(this, "alert.show", {
        dir: this.localize.dir()
      });
      await p(this.base, e, o), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), clearTimeout(this.autoHideTimeout), clearInterval(this.remainingTimeInterval), await u(this.base);
      const { keyframes: e, options: o } = v(this, "alert.hide", {
        dir: this.localize.dir()
      });
      await p(this.base, e, o), this.base.hidden = !0, this.emit("cx-after-hide");
    }
  }
  handleDurationChange() {
    this.restartAutoHide();
  }
  /** Shows the alert. */
  async show() {
    if (!this.open)
      return this.open = !0, m(this, "cx-after-show");
  }
  /** Hides the alert */
  async hide() {
    if (this.open)
      return this.open = !1, m(this, "cx-after-hide");
  }
  /**
   * Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when
   * dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by
   * calling this method again. The returned promise will resolve after the alert is hidden.
   */
  async toast() {
    return new Promise((e) => {
      this.handleCountdownChange(), i.parentElement === null && document.body.append(i), i.appendChild(this), requestAnimationFrame(() => {
        this.clientWidth, this.show();
      }), this.addEventListener(
        "cx-after-hide",
        () => {
          i.removeChild(this), e(), i.querySelector("cx-alert") === null && i.remove();
        },
        { once: !0 }
      );
    });
  }
  render() {
    return h`
      <div
        part="base"
        class=${f({
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

        ${this.closable ? h`
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
        ${this.countdown ? h`
              <div
                class=${f({
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
t.styles = [y, k];
t.dependencies = { "cx-icon-button": H };
r([
  g('[part~="base"]')
], t.prototype, "base", 2);
r([
  g(".alert__countdown-elapsed")
], t.prototype, "countdownElement", 2);
r([
  s({ reflect: !0, type: Boolean })
], t.prototype, "open", 2);
r([
  s({ reflect: !0, type: Boolean })
], t.prototype, "closable", 2);
r([
  s({ reflect: !0 })
], t.prototype, "variant", 2);
r([
  s({ type: Number })
], t.prototype, "duration", 2);
r([
  s({ reflect: !0, type: String })
], t.prototype, "countdown", 2);
r([
  I()
], t.prototype, "remainingTime", 2);
r([
  w("open", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleOpenChange", 1);
r([
  w("duration")
], t.prototype, "handleDurationChange", 1);
t = r([
  x("cx-alert")
], t);
_("alert.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 250, easing: "ease" }
});
_("alert.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 250, easing: "ease" }
});
export {
  t as default
};
