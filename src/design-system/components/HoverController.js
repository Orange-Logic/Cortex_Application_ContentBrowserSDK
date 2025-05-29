import { noop as o } from "./AbstractOverlay.js";
import { InteractionController as a, InteractionTypes as h } from "./InteractionController.js";
import { conditionAttributeWithId as s } from "./base.js";
import { randomID as l } from "./shared.js";
const d = 300;
class f extends a {
  constructor() {
    super(...arguments), this.type = h.hover, this.elementIds = [], this.focusedin = !1, this.pointerentered = !1;
  }
  handleTargetFocusin() {
    this.target.matches(":focus-visible") && (this.open = !0, this.focusedin = !0);
  }
  handleTargetFocusout() {
    this.focusedin = !1, !this.pointerentered && (this.open = !1);
  }
  handleTargetPointerenter() {
    var e;
    this.hoverTimeout && (clearTimeout(this.hoverTimeout), this.hoverTimeout = void 0), !((e = this.overlay) != null && e.disabled) && (this.open = !0, this.pointerentered = !0);
  }
  handleTargetPointerleave() {
    this.doPointerleave();
  }
  // set a timeout once the pointer enters and the overlay is shown
  // give the user time to enter the overlay
  handleHostPointerenter() {
    this.hoverTimeout && (clearTimeout(this.hoverTimeout), this.hoverTimeout = void 0);
  }
  handleHostPointerleave() {
    this.doPointerleave();
  }
  prepareDescription() {
    if (!this.overlay.elements.length) return;
    const e = this.target.getRootNode(), t = this.overlay.elements[0].getRootNode(), r = this.overlay.getRootNode();
    e === r ? this.prepareOverlayRelativeDescription() : e === t && this.prepareContentRelativeDescription();
  }
  prepareOverlayRelativeDescription() {
    const e = s(
      this.target,
      "aria-describedby",
      [this.overlay.id]
    );
    this.releaseDescription = () => {
      e(), this.releaseDescription = o;
    };
  }
  prepareContentRelativeDescription() {
    const e = [], t = this.overlay.elements.map((i) => (e.push(i.id), i.id || (i.id = `${this.overlay.tagName.toLowerCase()}-helper-${l()}`), i.id));
    this.elementIds = e;
    const r = s(
      this.target,
      "aria-describedby",
      t
    );
    this.releaseDescription = () => {
      r(), this.overlay.elements.map((i, n) => {
        i.id = this.elementIds[n];
      }), this.releaseDescription = o;
    };
  }
  doPointerleave() {
    this.pointerentered = !1;
    const e = this.target;
    this.focusedin && e.matches(":focus-visible") || (this.hoverTimeout = setTimeout(() => {
      this.open = !1;
    }, d));
  }
  init() {
    var t;
    (t = this.abortController) == null || t.abort(), this.abortController = new AbortController();
    const { signal: e } = this.abortController;
    this.target.addEventListener("focusin", () => this.handleTargetFocusin(), {
      signal: e
    }), this.target.addEventListener(
      "focusout",
      () => this.handleTargetFocusout(),
      { signal: e }
    ), this.target.addEventListener(
      "pointerenter",
      () => this.handleTargetPointerenter(),
      { signal: e }
    ), this.target.addEventListener(
      "pointerleave",
      () => this.handleTargetPointerleave(),
      { signal: e }
    ), this.overlay && this.initOverlay();
  }
  initOverlay() {
    if (!this.abortController)
      return;
    const { signal: e } = this.abortController;
    this.overlay.addEventListener(
      "pointerenter",
      () => this.handleHostPointerenter(),
      { signal: e }
    ), this.overlay.addEventListener(
      "pointerleave",
      () => this.handleHostPointerleave(),
      { signal: e }
    );
  }
}
export {
  f as HoverController
};
