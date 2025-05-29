import { C as c } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { w as l } from "../chunks/watch.ChG-_stu.js";
import { x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as f } from "../chunks/query-async.DsOC4YLE.js";
import u from "./animation.styles.js";
import { e as b, a as g } from "../chunks/index.UoycWRGZ.js";
var S = Object.defineProperty, C = Object.getOwnPropertyDescriptor, i = (p, e, s, r) => {
  for (var n = r > 1 ? void 0 : r ? C(e, s) : e, o = p.length - 1, h; o >= 0; o--)
    (h = p[o]) && (n = (r ? h(e, s, n) : h(n)) || n);
  return r && n && S(e, s, n), n;
};
const m = class m extends c {
  constructor() {
    super(...arguments), this.hasStarted = !1, this.name = "none", this.play = !1, this.delay = 0, this.direction = "normal", this.duration = 1e3, this.easing = "linear", this.endDelay = 0, this.fill = "auto", this.iterations = 1 / 0, this.iterationStart = 0, this.playbackRate = 1, this.handleAnimationFinish = () => {
      this.play = !1, this.hasStarted = !1, this.emit("cx-finish");
    }, this.handleAnimationCancel = () => {
      this.play = !1, this.hasStarted = !1, this.emit("cx-cancel");
    };
  }
  /** Gets and sets the current animation time. */
  get currentTime() {
    var e;
    return ((e = this.animation) == null ? void 0 : e.currentTime) ?? 0;
  }
  set currentTime(e) {
    this.animation && (this.animation.currentTime = e);
  }
  connectedCallback() {
    super.connectedCallback(), this.createAnimation();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.destroyAnimation();
  }
  handleSlotChange() {
    this.destroyAnimation(), this.createAnimation();
  }
  async createAnimation() {
    const e = b[this.easing] ?? this.easing, s = this.keyframes ?? g[this.name], n = (await this.defaultSlot).assignedElements()[0];
    return !n || !s ? !1 : (this.destroyAnimation(), this.animation = n.animate(s, {
      delay: this.delay,
      direction: this.direction,
      duration: this.duration,
      easing: e,
      endDelay: this.endDelay,
      fill: this.fill,
      iterationStart: this.iterationStart,
      iterations: this.iterations
    }), this.animation.playbackRate = this.playbackRate, this.animation.addEventListener("cancel", this.handleAnimationCancel), this.animation.addEventListener("finish", this.handleAnimationFinish), this.play ? (this.hasStarted = !0, this.emit("cx-start")) : this.animation.pause(), !0);
  }
  destroyAnimation() {
    this.animation && (this.animation.cancel(), this.animation.removeEventListener("cancel", this.handleAnimationCancel), this.animation.removeEventListener("finish", this.handleAnimationFinish), this.hasStarted = !1);
  }
  handleAnimationChange() {
    this.hasUpdated && this.createAnimation();
  }
  handlePlayChange() {
    return this.animation ? (this.play && !this.hasStarted && (this.hasStarted = !0, this.emit("cx-start")), this.play ? this.animation.play() : this.animation.pause(), !0) : !1;
  }
  handlePlaybackRateChange() {
    this.animation && (this.animation.playbackRate = this.playbackRate);
  }
  /** Clears all keyframe effects caused by this animation and aborts its playback. */
  cancel() {
    var e;
    (e = this.animation) == null || e.cancel();
  }
  /** Sets the playback time to the end of the animation corresponding to the current playback direction. */
  finish() {
    var e;
    (e = this.animation) == null || e.finish();
  }
  render() {
    return d` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
m.styles = [y, u];
let t = m;
i([
  f("slot")
], t.prototype, "defaultSlot", 2);
i([
  a()
], t.prototype, "name", 2);
i([
  a({ reflect: !0, type: Boolean })
], t.prototype, "play", 2);
i([
  a({ type: Number })
], t.prototype, "delay", 2);
i([
  a()
], t.prototype, "direction", 2);
i([
  a({ type: Number })
], t.prototype, "duration", 2);
i([
  a()
], t.prototype, "easing", 2);
i([
  a({ attribute: "end-delay", type: Number })
], t.prototype, "endDelay", 2);
i([
  a()
], t.prototype, "fill", 2);
i([
  a({ type: Number })
], t.prototype, "iterations", 2);
i([
  a({ attribute: "iteration-start", type: Number })
], t.prototype, "iterationStart", 2);
i([
  a({ attribute: !1 })
], t.prototype, "keyframes", 2);
i([
  a({ attribute: "playback-rate", type: Number })
], t.prototype, "playbackRate", 2);
i([
  l([
    "name",
    "delay",
    "direction",
    "duration",
    "easing",
    "endDelay",
    "fill",
    "iterations",
    "iterationsStart",
    "keyframes"
  ])
], t.prototype, "handleAnimationChange", 1);
i([
  l("play")
], t.prototype, "handlePlayChange", 1);
i([
  l("playbackRate")
], t.prototype, "handlePlaybackRateChange", 1);
export {
  t as default
};
