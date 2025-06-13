import { C as w, c as C } from "../chunks/custom-element.X6y1saJZ.js";
import { c as $ } from "../chunks/component.styles.BLcT4bOa.js";
import { f as T } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as V } from "../chunks/default-value.BaUjiOTd.js";
import { d as z } from "../chunks/drag.BixfMdxr.js";
import { F as D } from "../chunks/form.CBFaCEBn.js";
import { c as v } from "../chunks/math.DqTA6ya4.js";
import { H as S } from "../chunks/slot.DJLm4Dig.js";
import { w as d } from "../chunks/watch.ChG-_stu.js";
import { i as F, x as _ } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { r as b } from "../chunks/state.-o_YRGMi.js";
import { t as M } from "../chunks/event-options.CYHYGOd8.js";
import { e as g } from "../chunks/query.BNveAlQo.js";
import { e as c } from "../chunks/class-map.Cn0czwWq.js";
import { o as u } from "../chunks/if-defined.D8U9hdvp.js";
import { l as P } from "../chunks/live.C0NiCo2U.js";
import { o as f } from "../chunks/style-map.De8UQbPP.js";
import { L as N } from "../chunks/localize.D5Yoww6T.js";
import I from "./tooltip.js";
const R = F`
  :host {
    --thumb-size: 20px;
    --track-color-active: var(--cx-color-neutral-200);
    --track-color-inactive: var(--cx-color-neutral-200);
    --track-active-offset: 0%;
    --track-height: 6px;

    display: block;
  }

  .range {
    position: relative;
    cursor: pointer;
    margin: var(--cx-spacing-large) 0;
  }

  .range::before {
    content: '';
    background-color: var(--cx-color-primary);
    border-radius: 3px;
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: var(--percent);
    z-index: 1;
  }

  .range__container {
    position: relative;
    height: var(--track-height);
  }

  .range__control {
    position: absolute;
    top: 0;
    -webkit-appearance: none;
    border-radius: 3px;
    width: 100%;
    height: var(--track-height);
    background: transparent;
    line-height: var(--cx-input-height-medium);
    vertical-align: middle;
    margin: 0;

    background-image: linear-gradient(
      to right,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive)
        min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive)
        max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );

    cursor: pointer;
  }

  .range--disabled .range__control {
    cursor: default;
  }

  .range--rtl .range__control {
    background-image: linear-gradient(
      to left,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive)
        min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive)
        max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  /* Webkit */
  .range__control::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    border-radius: 3px;
    border: none;
  }

  .range__control::-webkit-slider-thumb {
    display: none;
  }

  /* Firefox */
  .range__control::-moz-focus-outer {
    border: 0;
  }

  .range__control::-moz-range-progress {
    background-color: var(--track-color-active);
    border-radius: 3px;
    height: var(--track-height);
  }

  .range__control::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--track-color-inactive);
    border-radius: 3px;
    border: none;
  }

  .range__control::-moz-range-thumb {
    display: none;
  }

  /* States */
  .range__control:focus-visible {
    outline: none;
  }

  .range__control:disabled {
    opacity: 0.5;
  }

  .range__control:disabled::-webkit-slider-thumb {
    cursor: default;
  }

  .range__control:disabled::-moz-range-thumb {
    cursor: default;
  }

  @media (forced-colors: active) {
    .range__control,
    .range__control::-webkit-slider-thumb {
      border: solid 1px transparent;
    }

    .range__control::-moz-range-thumb {
      border: solid 1px transparent;
    }
  }

  ::slotted([slot='marks']) {
    display: none;
  }

  .range__marks {
    position: absolute;
    height: 10px;
    width: 100%;
    transform: translateY(-50%);
    display: flex;
  }

  .mark__tick {
    height: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-left: 1px solid var(--cx-color-neutral-1000);
  }
  .mark__tick--hidden {
    visibility: hidden;
  }
  .mark__label {
    position: absolute;
    top: var(--cx-spacing-medium);
    transform: translateX(-50%);
  }
  .mark__label--hidden {
    visibility: hidden;
  }

  .range__thumb {
    position: absolute;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--cx-color-neutral-0);
    box-shadow: var(--cx-shadow-large);
    top: 50%;
    transform: translate(-50%, -50%);
    left: var(--percent);
    z-index: 1;
  }

  .range__thumb:dir(rtl) {
    left: calc(100% - var(--percent));
  }

  .range__control:focus-visible ~ .range__thumb {
    outline: var(--cx-focus-ring);
    outline-offset: 2px;
  }

  .range--disabled .range__container {
    opacity: 0.5;
    cursor: default;
  }
`;
var U = Object.defineProperty, O = Object.getOwnPropertyDescriptor, i = (t, r, a, s) => {
  for (var l = s > 1 ? void 0 : s ? O(r, a) : r, n = t.length - 1, h; n >= 0; n--)
    (h = t[n]) && (l = (s ? h(r, a, l) : h(l)) || l);
  return s && l && U(r, a, l), l;
};
let e = class extends w {
  constructor() {
    super(...arguments), this.formControlController = new D(this), this.hasSlotController = new S(
      this,
      "help-text",
      "label"
    ), this.localize = new N(this), this.hasFocus = !1, this.hasTooltip = !1, this.state = "idle", this.title = "", this.name = "", this.value = 0, this.label = "", this.helpText = "", this.disabled = !1, this.min = 0, this.max = 100, this.tooltipPlacement = "top", this.tooltipDisplay = "auto", this.tooltipHoist = !1, this.tooltipFormatter = (t) => t.toString(), this.form = "", this.snapThreshold = 12, this.showMarks = !1, this.tooltipOffset = 8, this.marks = [], this.defaultValue = 0;
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  connectedCallback() {
    super.connectedCallback(), this.resizeObserver = new ResizeObserver(() => this.syncRange()), this.value < this.min && (this.value = this.min), this.value > this.max && (this.value = this.max), this.initMarks(), !this.step && (!this.marks || !this.marks.length) && (this.step = 1), this.updateComplete.then(() => {
      this.syncRange(), this.resizeObserver.observe(this.input);
    });
  }
  initMarks() {
    if (!this.showMarks) return;
    const t = this.getAllMarks(), r = [];
    if (t && t.length)
      t.forEach((a) => {
        const s = a.getAttribute("value");
        if (!s) return;
        const l = parseFloat(s);
        isNaN(l) || r.push({
          hidden: a.hasAttribute("hidden"),
          label: a.textContent || "",
          value: l
        });
      });
    else {
      const a = this.step || 1, s = this.min, l = this.max;
      for (let n = s; n <= l; n += a)
        r.push({
          hidden: !1,
          label: n.toString(),
          value: n
        });
    }
    this.marks = r;
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.input && ((t = this.resizeObserver) == null || t.unobserve(this.input));
  }
  handleChange() {
    this.emit("cx-change");
  }
  handleInput() {
    this.emit("cx-input"), this.syncRange();
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  /**
   * Snaps the value to the nearest snap point to a given x position
   * @param x the x position that is seeked to
   * @returns whether the value has changed
   */
  snapValue(t) {
    let r = t;
    const a = this.marks.map((m) => m.value);
    let s = 1 / 0, l = 0;
    for (const m of a) {
      const x = this.valueToPercentage(m), y = this.input.clientWidth;
      let p = y * (x / 100);
      this.localize.dir() === "rtl" && (p = y - p);
      const k = Math.abs(r - p);
      if (k > s) break;
      s = k, l = p;
    }
    this.step ? s <= this.snapThreshold && (r = l) : r = l;
    const n = v(
      this.pixelsToValue(r),
      this.min,
      this.max
    );
    this.input.value = n.toString();
    const h = parseFloat(this.input.value);
    return this.value === h ? !1 : (this.value = h, !0);
  }
  handleThumbDragStart(t) {
    this.disabled || (this.hasTooltip = !0, this.state = "dragging", this.emit("cx-drag-start"), z(this, {
      initialEvent: t,
      onMove: (r) => {
        this.handleInput(), document.body.style.userSelect = "none", this.snapValue(r);
      },
      onStop: () => {
        document.body.style.userSelect = "", this.state = "idle", this.hasTooltip = !1, this.emit("cx-drag-end"), this.handleChange();
      }
    }));
  }
  handleMouseDown(t) {
    if (this.disabled) return;
    const r = t.x - this.input.getBoundingClientRect().left;
    this.snapValue(r);
    const a = () => {
      this.handleInput(), this.handleChange();
    };
    this.range.addEventListener("mouseup", a.bind(this), {
      once: !0
    });
  }
  handleKeyDown(t) {
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowDown": {
        t.preventDefault(), this.stepDown(), this.handleInput(), this.handleChange();
        break;
      }
      case "ArrowRight":
      case "ArrowUp": {
        t.preventDefault(), this.stepUp(), this.handleInput(), this.handleChange();
        break;
      }
    }
  }
  valueToPercentage(t) {
    return v((t - this.min) / (this.max - this.min), 0, 1) * 100;
  }
  pixelsToValue(t) {
    const r = this.input.clientWidth;
    return (this.localize.dir() === "rtl" ? r - t : t) / r * 100 / 100 * (this.max - this.min) + this.min;
  }
  syncProgress(t) {
    this.range.style.setProperty("--percent", `${t * 100}%`);
  }
  handleValueChange() {
    this.formControlController.updateValidity(), this.syncRange();
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  syncRange() {
    this.tooltipDisplay === "auto" && (this.output.open = this.hasTooltip);
    const t = v(
      (this.value - this.min) / (this.max - this.min),
      0,
      1
    );
    this.syncProgress(t);
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  /** Sets focus on the range. */
  focus(t) {
    this.input.focus(t);
  }
  /** Removes focus from the range. */
  blur() {
    this.input.blur();
  }
  /**
   * Increments the value of the range by the value of the step attribute.
   * @returns whether the value has changed
   */
  stepUp() {
    if (this.step)
      return this.input.stepUp(), this.value !== Number(this.input.value) ? (this.value = Number(this.input.value), !0) : !1;
    for (const t of this.marks)
      if (t.value > this.value)
        return this.value = t.value, !0;
    return !1;
  }
  /**
   * Decrements the value of the range by the value of the step attribute.
   * @returns whether the value has changed
   */
  stepDown() {
    if (this.step)
      return this.input.stepDown(), this.value !== Number(this.input.value) ? (this.value = Number(this.input.value), !0) : !1;
    for (let t = this.marks.length - 1; t >= 0; t--) {
      const r = this.marks[t];
      if (r.value < this.value)
        return this.value = r.value, !0;
    }
    return !1;
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(t) {
    this.input.setCustomValidity(t), this.formControlController.updateValidity();
  }
  getAllMarks() {
    var t;
    return (t = this.querySelector(
      "datalist"
    )) == null ? void 0 : t.querySelectorAll("option");
  }
  renderMarks() {
    const t = this.localize.dir() === "rtl";
    return this.marks.map((r) => {
      const a = this.valueToPercentage(
        t ? 100 - r.value : r.value
      );
      return _` <div
          class=${c({
        mark__tick: !0,
        "mark__tick--hidden": r.hidden
      })}
          part="mark-tick"
          style=${f({ left: `${a}%` })}
        ></div>
        <div
          class=${c({
        mark__label: !0,
        "mark__label--hidden": r.hidden
      })}
          part="mark-label"
          style=${f({ left: `${a}%` })}
        >
          ${r.label}
        </div>`;
    });
  }
  render() {
    const t = this.hasSlotController.test("label"), r = this.hasSlotController.test("help-text"), a = this.label ? !0 : !!t, s = this.helpText ? !0 : !!r;
    return _`
      <div
        part="form-control"
        class=${c({
      "form-control": !0,
      "form-control--has-help-text": s,
      // range only has one size
      "form-control--has-label": a,
      "form-control--medium": !0
    })}
        @focus=${this.focus}
        @blur=${this.blur}
        @keydown=${this.handleKeyDown}
        tabindex="0"
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${a ? "false" : "true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${c({
      range: !0,
      "range--disabled": this.disabled,
      "range--focused": this.hasFocus,
      "range--rtl": this.localize.dir() === "rtl",
      "range--tooltip-visible": this.tooltipDisplay === "auto" && this.hasTooltip || this.tooltipDisplay === "on"
    })}
            @mousedown=${this.handleMouseDown}
          >
            <div class="range__container">
              <input
                part="input"
                id="input"
                class="range__control"
                title=${this.title}
                type="range"
                name=${u(this.name)}
                ?disabled=${this.disabled}
                min=${u(this.min)}
                max=${u(this.max)}
                step=${this.step || Number.MIN_VALUE}
                .value=${P(this.value.toString())}
                aria-describedby="help-text"
                aria-label=${u(this.ariaLabel)}
                @change=${this.handleChange}
                @focus=${this.handleFocus}
                @input=${this.handleInput}
                @invalid=${this.handleInvalid}
                @blur=${this.handleBlur}
              />
              <cx-tooltip
                open
                class="range__tooltip"
                trigger="manual"
                ?hoist=${this.tooltipHoist}
                ?disabled=${this.tooltipDisplay === "off"}
                distance=${this.tooltipOffset}
                placement=${this.tooltipPlacement}
                content=${typeof this.tooltipFormatter == "function" ? this.tooltipFormatter(this.value) : this.value}
              >
                <div
                  part="thumb"
                  class="range__thumb"
                  @mousedown=${this.handleThumbDragStart}
                  @touchstart=${this.handleThumbDragStart}
                ></div>
              </cx-tooltip>
            </div>

            <slot name="marks"> </slot>

            <div
              class="range__marks"
              style=${f({
      visibility: this.showMarks ? "visible" : "hidden"
    })}
            >
              ${this.renderMarks()}
            </div>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
e.styles = [$, T, R];
e.dependencies = {
  "cx-tooltip": I
};
i([
  g(".range__control")
], e.prototype, "input", 2);
i([
  g(".range__tooltip")
], e.prototype, "output", 2);
i([
  g(".range")
], e.prototype, "range", 2);
i([
  b()
], e.prototype, "hasFocus", 2);
i([
  b()
], e.prototype, "hasTooltip", 2);
i([
  o()
], e.prototype, "state", 2);
i([
  o()
], e.prototype, "title", 2);
i([
  o()
], e.prototype, "name", 2);
i([
  o({ type: Number })
], e.prototype, "value", 2);
i([
  o()
], e.prototype, "label", 2);
i([
  o({ attribute: "help-text" })
], e.prototype, "helpText", 2);
i([
  o({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
i([
  o({ type: Number })
], e.prototype, "min", 2);
i([
  o({ type: Number })
], e.prototype, "max", 2);
i([
  o({ reflect: !0, type: Number })
], e.prototype, "step", 2);
i([
  o({ attribute: "tooltip-placement" })
], e.prototype, "tooltipPlacement", 2);
i([
  o({ attribute: "tooltip-display" })
], e.prototype, "tooltipDisplay", 2);
i([
  o({ attribute: "tooltip-hoist", type: Boolean })
], e.prototype, "tooltipHoist", 2);
i([
  o({ attribute: !1 })
], e.prototype, "tooltipFormatter", 2);
i([
  o({ reflect: !0 })
], e.prototype, "form", 2);
i([
  o({ attribute: "snap-threshold", type: Number })
], e.prototype, "snapThreshold", 2);
i([
  o({ attribute: "show-marks", type: Boolean })
], e.prototype, "showMarks", 2);
i([
  o({ attribute: "tooltip-offset", type: Number })
], e.prototype, "tooltipOffset", 2);
i([
  b()
], e.prototype, "marks", 2);
i([
  V()
], e.prototype, "defaultValue", 2);
i([
  d(["min", "max", "step"])
], e.prototype, "initMarks", 1);
i([
  M({ passive: !0 })
], e.prototype, "handleThumbDragStart", 1);
i([
  d("value", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleValueChange", 1);
i([
  d("disabled", { waitUntilFirstUpdate: !0 })
], e.prototype, "handleDisabledChange", 1);
i([
  d("hasTooltip", { waitUntilFirstUpdate: !0 })
], e.prototype, "syncRange", 1);
e = i([
  C("cx-range")
], e);
export {
  e as default
};
