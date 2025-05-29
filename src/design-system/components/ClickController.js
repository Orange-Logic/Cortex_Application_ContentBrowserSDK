import { InteractionController as n, InteractionTypes as o } from "./InteractionController.js";
class l extends n {
  constructor() {
    super(...arguments), this.type = o.click, this.preventNextToggle = !1;
  }
  handleClick() {
    this.preventNextToggle || (this.open = !this.open), this.preventNextToggle = !1;
  }
  handlePointerdown() {
    this.preventNextToggle = this.open;
  }
  init() {
    var e;
    (e = this.abortController) == null || e.abort(), this.abortController = new AbortController();
    const { signal: t } = this.abortController;
    this.target.addEventListener("click", () => this.handleClick(), {
      signal: t
    }), this.target.addEventListener(
      "pointerdown",
      () => this.handlePointerdown(),
      { signal: t }
    );
  }
}
export {
  l as ClickController
};
