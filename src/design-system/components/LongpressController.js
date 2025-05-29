import { noop as s } from "./AbstractOverlay.js";
import { InteractionController as a, InteractionTypes as l } from "./InteractionController.js";
import { conditionAttributeWithId as p } from "./base.js";
import { randomID as d, isIOS as h, isAndroid as c } from "./shared.js";
const u = 300, g = {
  keyboard: "Press Space or Alt+Down Arrow for additional options",
  mouse: "Click and hold for additional options",
  touch: "Double tap and long press for additional options"
};
class v extends a {
  constructor() {
    super(...arguments), this.type = l.longpress, this.longpressState = null, this.releaseDescription = s, this.handlePointerup = () => {
      var e;
      clearTimeout(this.timeout), this.target && (this.longpressState = ((e = this.overlay) == null ? void 0 : e.state) === "opening" ? "pressed" : null, document.removeEventListener("pointerup", this.handlePointerup), document.removeEventListener("pointercancel", this.handlePointerup));
    };
  }
  get activelyOpening() {
    return this.longpressState === "opening" || this.longpressState === "pressed";
  }
  handleLongpress() {
    this.open = !0, this.longpressState = this.longpressState === "potential" ? "opening" : "pressed";
  }
  handlePointerdown(e) {
    !this.target || e.button !== 0 || (this.longpressState = "potential", document.addEventListener("pointerup", this.handlePointerup), document.addEventListener("pointercancel", this.handlePointerup), "holdAffordance" in this.target) || (this.timeout = setTimeout(() => {
      this.target && this.target.dispatchEvent(
        new CustomEvent("longpress", {
          bubbles: !0,
          composed: !0,
          detail: {
            source: "pointer"
          }
        })
      );
    }, u));
  }
  handleKeydown(e) {
    const { altKey: t, code: o } = e;
    t && o === "ArrowDown" && (e.stopPropagation(), e.stopImmediatePropagation());
  }
  handleKeyup(e) {
    const { altKey: t, code: o } = e;
    if (o === "Space" || t && o === "ArrowDown") {
      if (!this.target)
        return;
      e.stopPropagation(), this.target.dispatchEvent(
        new CustomEvent("longpress", {
          bubbles: !0,
          composed: !0,
          detail: {
            source: "keyboard"
          }
        })
      ), setTimeout(() => {
        this.longpressState = null;
      });
    }
  }
  prepareDescription(e) {
    if (
      // do not reapply until target is recycled
      this.releaseDescription !== s || // require "longpress content" to apply relationship
      !this.overlay.elements.length
    )
      return;
    const t = document.createElement("div");
    t.id = `longpress-describedby-descriptor-${d()}`;
    const o = h() || c() ? "touch" : "keyboard";
    t.textContent = g[o], t.slot = "longpress-describedby-descriptor";
    const r = e.getRootNode(), n = this.overlay.getRootNode();
    r === n ? this.overlay.append(t) : (t.hidden = !("host" in r), e.insertAdjacentElement("afterend", t));
    const i = p(
      e,
      "aria-describedby",
      [t.id]
    );
    this.releaseDescription = () => {
      i(), t.remove(), this.releaseDescription = s;
    };
  }
  shouldCompleteOpen() {
    this.longpressState = this.longpressState === "pressed" ? null : this.longpressState;
  }
  init() {
    var t;
    (t = this.abortController) == null || t.abort(), this.abortController = new AbortController();
    const { signal: e } = this.abortController;
    this.target.addEventListener("longpress", () => this.handleLongpress(), {
      signal: e
    }), this.target.addEventListener(
      "pointerdown",
      (o) => this.handlePointerdown(o),
      { signal: e }
    ), this.prepareDescription(this.target), !this.target.holdAffordance && (this.target.addEventListener(
      "keydown",
      (o) => this.handleKeydown(o),
      { signal: e }
    ), this.target.addEventListener(
      "keyup",
      (o) => this.handleKeyup(o),
      { signal: e }
    ));
  }
}
export {
  g as LONGPRESS_INSTRUCTIONS,
  v as LongpressController
};
