import { C as p, c } from "../chunks/custom-element.X6y1saJZ.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { i as d, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as u } from "../chunks/query-async.DsOC4YLE.js";
import { e as b, a as g } from "../chunks/index.UoycWRGZ.js";
const C = d`
  :host {
    display: contents;
  }
`;
var A = Object.defineProperty, S = Object.getOwnPropertyDescriptor, e = (i, n, r, s) => {
  for (var o = s > 1 ? void 0 : s ? S(n, r) : n, h = i.length - 1, l; h >= 0; h--)
    (l = i[h]) && (o = (s ? l(n, r, o) : l(o)) || o);
  return s && o && A(n, r, o), o;
};
let t = class extends p {
  constructor() {
    super(...arguments), this.hasStarted = !1, this.name = "none", this.play = !1, this.delay = 0, this.direction = "normal", this.duration = 1e3, this.easing = "linear", this.endDelay = 0, this.fill = "auto", this.iterations = 1 / 0, this.iterationStart = 0, this.playbackRate = 1, this.handleAnimationFinish = () => {
      this.play = !1, this.hasStarted = !1, this.emit("cx-finish");
    }, this.handleAnimationCancel = () => {
      this.play = !1, this.hasStarted = !1, this.emit("cx-cancel");
    };
  }
  /** Gets and sets the current animation time. */
  get currentTime() {
    var i;
    return ((i = this.animation) == null ? void 0 : i.currentTime) ?? 0;
  }
  set currentTime(i) {
    this.animation && (this.animation.currentTime = i);
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
    const i = b[this.easing] ?? this.easing, n = this.keyframes ?? g[this.name], s = (await this.defaultSlot).assignedElements()[0];
    return !s || !n ? !1 : (this.destroyAnimation(), this.animation = s.animate(n, {
      delay: this.delay,
      direction: this.direction,
      duration: this.duration,
      easing: i,
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
    var i;
    (i = this.animation) == null || i.cancel();
  }
  /** Sets the playback time to the end of the animation corresponding to the current playback direction. */
  finish() {
    var i;
    (i = this.animation) == null || i.finish();
  }
  render() {
    return f` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
t.styles = [y, C];
e([
  u("slot")
], t.prototype, "defaultSlot", 2);
e([
  a()
], t.prototype, "name", 2);
e([
  a({ reflect: !0, type: Boolean })
], t.prototype, "play", 2);
e([
  a({ type: Number })
], t.prototype, "delay", 2);
e([
  a()
], t.prototype, "direction", 2);
e([
  a({ type: Number })
], t.prototype, "duration", 2);
e([
  a()
], t.prototype, "easing", 2);
e([
  a({ attribute: "end-delay", type: Number })
], t.prototype, "endDelay", 2);
e([
  a()
], t.prototype, "fill", 2);
e([
  a({ type: Number })
], t.prototype, "iterations", 2);
e([
  a({ attribute: "iteration-start", type: Number })
], t.prototype, "iterationStart", 2);
e([
  a({ attribute: !1 })
], t.prototype, "keyframes", 2);
e([
  a({ attribute: "playback-rate", type: Number })
], t.prototype, "playbackRate", 2);
e([
  m([
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
e([
  m("play")
], t.prototype, "handlePlayChange", 1);
e([
  m("playbackRate")
], t.prototype, "handlePlaybackRateChange", 1);
t = e([
  c("cx-animation")
], t);
export {
  t as default
};
