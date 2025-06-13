import { C as _, c as x } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { i as v, x as o } from "../chunks/lit-element.DRlPF2me.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { e as u } from "../chunks/query.BNveAlQo.js";
import { e as h } from "../chunks/class-map.Cn0czwWq.js";
import { o as g } from "../chunks/style-map.De8UQbPP.js";
import { n as a } from "../chunks/when.CDK1Tt5Y.js";
import f from "./icon.js";
import b from "./line-clamp.js";
import y from "./progress-bar.js";
const w = v`
  :host {
    --color: var(--color);

    flex: calc(100% / var(--columns) + var(--cx-spacing-small));
    margin-left: calc(-1 * var(--cx-spacing-small));
  }

  :host([round]) {
    max-width: 100%;
    margin-left: 0;
  }

  .step {
    font-family: var(--cx-font-sans);
    display: flex;
    gap: var(--cx-spacing-x-small);
    width: 100%;
  }

  .step__arrow {
    display: inline-flex;
    align-items: center;
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-x-small);
    padding-left: var(--cx-spacing-x-large);
    padding-right: var(--cx-spacing-medium);
    background-color: var(--cx-color-neutral-100);
    cursor: pointer;
    position: relative;
    clip-path: polygon(
      calc(100% - var(--cx-spacing-medium)) 0%,
      100% 50%,
      calc(100% - var(--cx-spacing-medium)) 100%,
      0% 100%,
      var(--cx-spacing-medium) 50%,
      0% 0%
    );
    width: 100%;
  }

  .step--first .step__arrow {
    clip-path: polygon(
      calc(100% - var(--cx-spacing-medium)) 0%,
      100% 50%,
      calc(100% - var(--cx-spacing-medium)) 100%,
      0% 100%,
      0 50%,
      0% 0%
    );
    border-top-left-radius: var(--cx-border-radius-large);
    border-bottom-left-radius: var(--cx-border-radius-large);
    padding-left: var(--cx-spacing-small);
  }

  .step--last .step__arrow {
    clip-path: polygon(
      100% 0,
      100% 50%,
      100% 100%,
      0% 100%,
      var(--cx-spacing-medium) 50%,
      0% 0%
    );
    border-top-right-radius: var(--cx-border-radius-large);
    border-bottom-right-radius: var(--cx-border-radius-large);
  }

  .step--first.step--last .step__arrow {
    clip-path: polygon(100% 0%, 100% 50%, 100% 100%, 0% 100%, 0 50%, 0% 0%);
  }

  .step--active .step__arrow {
    background-color: color-mix(in srgb, var(--color) 15%, white);
    cursor: default;
  }

  .step--completed .step__arrow {
    opacity: 0.5;
  }

  .step--disabled .step__arrow {
    cursor: default;
  }

  .step--readonly .step__arrow {
    cursor: default;
  }

  .step__circle {
    align-items: center;
    background-color: color-mix(in srgb, var(--color) 15%, white);
    border: 2px solid var(--color);
    border-radius: var(--cx-border-radius-circle);
    color: var(--color);
    display: flex;
    flex: 0 0 32px;
    font-weight: var(--cx-font-weight-semibold);
    height: 32px;
    justify-content: center;

    cx-icon {
      font-size: var(--cx-font-size-medium);
    }
  }

  .step--round.step--active .step__circle,
  .step--round.step--completed .step__circle {
    background-color: var(--color);
    color: var(--cx-color-neutral-0);
  }

  .step--round.step--disabled .step__circle {
    background-color: var(--cx-color-neutral-0);
    border-color: var(--cx-color-neutral-400);
    color: var(--cx-color-neutral-400);
  }

  .step--round.step--error .step__circle {
    background-color: var(--cx-color-danger);
    border-color: var(--cx-color-danger);
    color: var(--cx-color-neutral-0);
  }

  .step__content {
    display: flex;
    align-items: center;
    gap: var(--cx-spacing-x-small);
    position: relative;
    max-width: 100%;
  }

  .step--round .step__content {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
  }

  .step__content__prefix::slotted(cx-icon) {
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-medium);
  }

  .step__content__label {
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-medium);
  }

  .step--active .step__content__label,
  .step--active .step__content__help-text,
  .step--active .step__content__prefix::slotted(cx-icon) {
    color: var(--color);
  }

  .step--round.step--completed .step__content__label,
  .step--round.step--completed .step__content__help-text {
    color: var(--color);
  }

  .step--disabled .step__content__label,
  .step--disabled .step__content__help-text,
  .step--disabled .step__content__prefix::slotted(cx-icon) {
    color: var(--cx-color-neutral-400);
  }

  .step--error .step__content__label,
  .step--error .step__content__help-text {
    color: var(--cx-color-danger);
  }

  .step--round .step__content__progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--cx-spacing-small);
    line-height: 1;
    min-width: 120px;
  }

  .step--round .step__content__progress__text {
    color: var(--color);
  }

  .step--round.step__content__help-text {
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-small);
    line-height: 1;
  }

  .step__line {
    background-color: var(--color);
    flex: 1;
    height: 2rem;
    margin: var(--cx-spacing-medium) calc(32px / 2) 0;
    width: 2px;
  }

  .step--last ~ .step__line {
    display: none;
  }

  cx-progress-bar {
    --height: 8px;
    flex: 1;
  }
`;
var C = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, t = (d, l, i, c) => {
  for (var s = c > 1 ? void 0 : c ? $(l, i) : l, p = d.length - 1, n; p >= 0; p--)
    (n = d[p]) && (s = (c ? n(l, i, s) : n(s)) || s);
  return c && s && C(l, i, s), s;
};
let e = class extends _ {
  constructor() {
    super(...arguments), this.active = !1, this.completed = !1, this.disabled = !1, this.readonly = !1, this.error = !1, this.index = 0, this.last = !1, this.helpText = "", this.progress = 0, this.color = "var(--cx-color-primary)", this.round = !1, this.handleClick = () => {
      this.disabled || this.active || this.readonly || this.emit("cx-step-select", {
        detail: { id: this.dataset.id }
      });
    };
  }
  firstUpdated() {
    this.step.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.step.removeEventListener("click", this.handleClick);
  }
  renderDefaultStep() {
    return o`<div class="step__arrow">
      <div class="step__content">
        <slot name="prefix" class="step__content__prefix"></slot>
        <cx-line-clamp lines="1">
          <slot class="step__content__label"></slot>
        </cx-line-clamp>
      </div>
    </div>`;
  }
  renderRoundStep() {
    return o`<div class="step__circle">
    ${this.completed ? o`<cx-icon name="check"></cx-icon>` : o`<div class="step__circle__number">${this.index + 1}</div>`}
  </div>
  <div class="step__content">
    <slot class="step__content__label"></slot>
    ${a(
      this.progress && this.progress > 0,
      () => o`<div class="step__content__progress">
          <cx-progress-bar value=${this.progress}></cx-progress-bar>
          <div class="step__content__progress__text">${this.progress}%</div>
        </div>`,
      () => o`
        ${a(
        this.helpText,
        () => o`<div class="step__content__help-text">${this.helpText}</div>`
      )}
      `
    )}
  </div>
</div>
</div>`;
  }
  render() {
    return o`<div
      style=${g({
      "--color": this.color
    })}
    >
      <div
        part="base"
        aria-label="step"
        role="button"
        class=${h({
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
        ${a(
      this.round,
      this.renderRoundStep.bind(this),
      this.renderDefaultStep.bind(this)
    )}
      </div>
      ${a(this.round, () => o`<div class="step__line"></div>`)}
    </div>`;
  }
};
e.styles = [m, w];
e.dependencies = {
  "cx-icon": f,
  "cx-line-clamp": b,
  "cx-progress-bar": y
};
t([
  u('div[part="base"]')
], e.prototype, "step", 2);
t([
  r({ reflect: !0, type: Boolean })
], e.prototype, "active", 2);
t([
  r({ reflect: !0, type: Boolean })
], e.prototype, "completed", 2);
t([
  r({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
t([
  r({ reflect: !0, type: Boolean })
], e.prototype, "readonly", 2);
t([
  r({ reflect: !0, type: Boolean })
], e.prototype, "error", 2);
t([
  r({ type: Number })
], e.prototype, "index", 2);
t([
  r({ type: Boolean })
], e.prototype, "last", 2);
t([
  r({ attribute: "help-text", reflect: !0, type: String })
], e.prototype, "helpText", 2);
t([
  r({ reflect: !0, type: Number })
], e.prototype, "progress", 2);
t([
  r({ reflect: !0, type: String })
], e.prototype, "color", 2);
t([
  r({ reflect: !0, type: Boolean })
], e.prototype, "round", 2);
e = t([
  x("cx-step")
], e);
export {
  e as default
};
