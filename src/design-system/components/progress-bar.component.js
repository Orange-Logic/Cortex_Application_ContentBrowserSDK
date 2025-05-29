import { C as h } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { x as i } from "../chunks/lit-element.DRlPF2me.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { e as c } from "../chunks/class-map.Cn0czwWq.js";
import { o as u } from "../chunks/if-defined.D8U9hdvp.js";
import { o as b } from "../chunks/style-map.De8UQbPP.js";
import { L as v } from "../chunks/localize.DV9I313e.js";
import f from "./progress-bar.styles.js";
var g = Object.defineProperty, s = (l, p, n, y) => {
  for (var e = void 0, a = l.length - 1, m; a >= 0; a--)
    (m = l[a]) && (e = m(p, n, e) || e);
  return e && g(p, n, e), e;
};
const o = class o extends h {
  constructor() {
    super(...arguments), this.localize = new v(this), this.value = 0, this.indeterminate = !1, this.label = "", this.showProgress = "";
  }
  render() {
    return i`
      <div part="container" class="container">
        <div part="label" class="progress-bar-label">
          <span>${this.label}</span>
          ${this.showProgress ? i`<span>${this.value || 0}%</span>` : ""}
        </div>
        <div
          part="base"
          class=${c({
      "progress-bar": !0,
      "progress-bar--indeterminate": this.indeterminate,
      "progress-bar--rtl": this.localize.dir() === "rtl"
    })}
          role="progressbar"
          title=${u(this.title)}
          aria-label=${this.label.length > 0 ? this.label : this.localize.term("progress")}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${this.indeterminate ? 0 : this.value}
        >
          <div
            part="indicator"
            class="progress-bar__indicator"
            style=${b({ width: `${this.value || 0}%` })}
          >
            ${this.indeterminate ? "" : i` <slot part="label" class="progress-bar__label"></slot> `}
          </div>
        </div>
      </div>
    `;
  }
};
o.styles = [d, f];
let t = o;
s([
  r({ reflect: !0, type: Number })
], t.prototype, "value");
s([
  r({ reflect: !0, type: Boolean })
], t.prototype, "indeterminate");
s([
  r({ reflect: !0, type: String })
], t.prototype, "label");
s([
  r({ attribute: "show-progress", reflect: !0, type: Boolean })
], t.prototype, "showProgress");
export {
  t as default
};
