import { C as e } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as t } from "../chunks/component.styles.BLcT4bOa.js";
import { x as o } from "../chunks/lit-element.DRlPF2me.js";
import { L as l } from "../chunks/localize.DV9I313e.js";
import a from "./spinner.styles.js";
const r = class r extends e {
  constructor() {
    super(...arguments), this.localize = new l(this);
  }
  render() {
    return o`
      <svg
        part="base"
        class="spinner"
        role="progressbar"
        aria-label=${this.localize.term("loading")}
      >
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
};
r.styles = [t, a];
let s = r;
export {
  s as default
};
