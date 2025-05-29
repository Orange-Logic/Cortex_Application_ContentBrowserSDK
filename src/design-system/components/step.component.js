import { C as h } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as _ } from "../chunks/component.styles.BLcT4bOa.js";
import { x as r } from "../chunks/lit-element.DRlPF2me.js";
import { t as m } from "../chunks/custom-element.ttkHUa8w.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { e as f } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { o as u } from "../chunks/style-map.De8UQbPP.js";
import { n as l } from "../chunks/when.CDK1Tt5Y.js";
import x from "./icon.component.js";
import y from "./line-clamp.component.js";
import b from "./progress-bar.component.js";
import g from "./step.styles.js";
var $ = Object.defineProperty, C = Object.getOwnPropertyDescriptor, t = (d, i, a, p) => {
  for (var o = p > 1 ? void 0 : p ? C(i, a) : i, n = d.length - 1, c; n >= 0; n--)
    (c = d[n]) && (o = (p ? c(i, a, o) : c(o)) || o);
  return p && o && $(i, a, o), o;
};
let e = class extends h {
  constructor() {
    super(...arguments), this.active = !1, this.completed = !1, this.disabled = !1, this.readonly = !1, this.error = !1, this.index = 0, this.last = !1, this.helpText = "", this.progress = 0, this.color = "var(--cx-color-primary)", this.round = !1;
  }
  firstUpdated() {
    this.step.addEventListener("click", this.handleClick.bind(this));
  }
  handleClick() {
    this.disabled || this.active || this.readonly || this.emit("cx-step-select", {
      detail: { id: this.dataset.id }
    });
  }
  renderDefaultStep() {
    return r`<div class="step__arrow">
      <div class="step__content">
        <slot name="prefix" class="step__content__prefix"></slot>
        <cx-line-clamp lines="1">
          <slot class="step__content__label"></slot>
        </cx-line-clamp>
      </div>
    </div>`;
  }
  renderRoundStep() {
    return r`<div class="step__circle">
    ${this.completed ? r`<cx-icon name="check"></cx-icon>` : r`<div class="step__circle__number">${this.index + 1}</div>`}
  </div>
  <div class="step__content">
    <slot class="step__content__label"></slot>
    ${l(
      this.progress && this.progress > 0,
      () => r`<div class="step__content__progress">
          <cx-progress-bar value=${this.progress}></cx-progress-bar>
          <div class="step__content__progress__text">${this.progress}%</div>
        </div>`,
      () => r`
        ${l(
        this.helpText,
        () => r`<div class="step__content__help-text">${this.helpText}</div>`
      )}
      `
    )}
  </div>
</div>
</div>`;
  }
  render() {
    return r`<div
      style=${u({
      "--color": this.color
    })}
    >
      <div
        part="base"
        aria-label="step"
        role="button"
        class=${v({
      step: !0,
      "step--active": this.active,
      "step--completed": this.completed,
      "step--disabled": this.disabled,
      "step--error": this.error,
      "step--first": this.index === 0,
      "step--last": this.last,
      "step--readonly": this.readonly,
      "step--round": this.round
    })}
      >
        ${l(
      this.round,
      this.renderRoundStep.bind(this),
      this.renderDefaultStep.bind(this)
    )}
      </div>
      ${l(this.round, () => r`<div class="step__line"></div>`)}
    </div>`;
  }
};
e.styles = [_, g];
e.dependencies = {
  "cx-icon": x,
  "cx-line-clamp": y,
  "cx-progress-bar": b
};
t([
  f('div[part="base"]')
], e.prototype, "step", 2);
t([
  s({ reflect: !0, type: Boolean })
], e.prototype, "active", 2);
t([
  s({ reflect: !0, type: Boolean })
], e.prototype, "completed", 2);
t([
  s({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
t([
  s({ reflect: !0, type: Boolean })
], e.prototype, "readonly", 2);
t([
  s({ reflect: !0, type: Boolean })
], e.prototype, "error", 2);
t([
  s({ type: Number })
], e.prototype, "index", 2);
t([
  s({ type: Boolean })
], e.prototype, "last", 2);
t([
  s({ attribute: "help-text", reflect: !0, type: String })
], e.prototype, "helpText", 2);
t([
  s({ reflect: !0, type: Number })
], e.prototype, "progress", 2);
t([
  s({ reflect: !0, type: String })
], e.prototype, "color", 2);
t([
  s({ reflect: !0, type: Boolean })
], e.prototype, "round", 2);
e = t([
  m("cx-step")
], e);
const U = e;
export {
  e as CxStep,
  U as default
};
