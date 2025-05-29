import { AbstractOverlay as h } from "./AbstractOverlay.js";
class e {
  constructor(t, i) {
    this.x = 0, this.y = 0, this.x = t, this.y = i;
  }
  updateBoundingClientRect(t, i) {
    this.x = t, this.y = i, h.update();
  }
  getBoundingClientRect() {
    return {
      bottom: this.y,
      height: 0,
      left: this.x,
      right: this.x,
      /* c8 ignore next 3 */
      toJSON() {
      },
      top: this.y,
      width: 0,
      x: this.x,
      y: this.y
    };
  }
}
export {
  e as VirtualTrigger
};
