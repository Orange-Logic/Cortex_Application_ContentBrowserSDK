import { C as _ } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as T } from "../chunks/component.styles.BLcT4bOa.js";
import { f as V } from "../chunks/form-control.styles.vYJVd0IP.js";
import { d as D } from "../chunks/default-value.BaUjiOTd.js";
import { d as S } from "../chunks/drag.BixfMdxr.js";
import { F } from "../chunks/form.CBFaCEBn.js";
import { c as m } from "../chunks/math.DqTA6ya4.js";
import { H as M } from "../chunks/slot.DJLm4Dig.js";
import { w as d } from "../chunks/watch.ChG-_stu.js";
import { x as k } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as v } from "../chunks/state.-o_YRGMi.js";
import { t as P } from "../chunks/event-options.CYHYGOd8.js";
import { e as y } from "../chunks/query.BNveAlQo.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
import { o as f } from "../chunks/if-defined.D8U9hdvp.js";
import { l as z } from "../chunks/live.C0NiCo2U.js";
import { o as b } from "../chunks/style-map.De8UQbPP.js";
import { L as N } from "../chunks/localize.DV9I313e.js";
import I from "./tooltip.component.js";
import U from "./range.styles.js";
var O = Object.defineProperty, A = Object.getOwnPropertyDescriptor, i = (g, t, s, o) => {
  for (var r = o > 1 ? void 0 : o ? A(t, s) : t, l = g.length - 1, n; l >= 0; l--)
    (n = g[l]) && (r = (o ? n(t, s, r) : n(r)) || r);
  return o && r && O(t, s, r), r;
};
const u = class u extends _ {
  constructor() {
    super(...arguments), this.formControlController = new F(this), this.hasSlotController = new M(
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
    const t = this.getAllMarks(), s = [];
    if (t && t.length)
      t.forEach((o) => {
        const r = o.getAttribute("value");
        if (!r) return;
        const l = parseFloat(r);
        isNaN(l) || s.push({
          hidden: o.hasAttribute("hidden"),
          label: o.textContent || "",
          value: l
        });
      });
    else {
      const o = this.step || 1, r = this.min, l = this.max;
      for (let n = r; n <= l; n += o)
        s.push({
          hidden: !1,
          label: n.toString(),
          value: n
        });
    }
    this.marks = s;
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
    let s = t;
    const o = this.marks.map((c) => c.value);
    let r = 1 / 0, l = 0;
    for (const c of o) {
      const w = this.valueToPercentage(c), C = this.input.clientWidth;
      let h = C * (w / 100);
      this.localize.dir() === "rtl" && (h = C - h);
      const $ = Math.abs(s - h);
      if ($ > r) break;
      r = $, l = h;
    }
    this.step ? r <= this.snapThreshold && (s = l) : s = l;
    const n = m(
      this.pixelsToValue(s),
      this.min,
      this.max
    );
    this.input.value = n.toString();
    const x = parseFloat(this.input.value);
    return this.value === x ? !1 : (this.value = x, !0);
  }
  handleThumbDragStart(t) {
    this.disabled || (this.hasTooltip = !0, this.state = "dragging", this.emit("cx-drag-start"), S(this, {
      initialEvent: t,
      onMove: (s) => {
        this.handleInput(), document.body.style.userSelect = "none", this.snapValue(s);
      },
      onStop: () => {
        document.body.style.userSelect = "", this.state = "idle", this.hasTooltip = !1, this.emit("cx-drag-end"), this.handleChange();
      }
    }));
  }
  handleMouseDown(t) {
    if (this.disabled) return;
    const s = t.x - this.input.getBoundingClientRect().left;
    this.snapValue(s);
    const o = () => {
      this.handleInput(), this.handleChange();
    };
    this.range.addEventListener("mouseup", o.bind(this), {
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
    return m((t - this.min) / (this.max - this.min), 0, 1) * 100;
  }
  pixelsToValue(t) {
    const s = this.input.clientWidth;
    return (this.localize.dir() === "rtl" ? s - t : t) / s * 100 / 100 * (this.max - this.min) + this.min;
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
    const t = m(
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
      const s = this.marks[t];
      if (s.value < this.value)
        return this.value = s.value, !0;
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
    return this.marks.map((s) => {
      const o = this.valueToPercentage(
        t ? 100 - s.value : s.value
      );
      return k` <div
          class=${p({
        mark__tick: !0,
        "mark__tick--hidden": s.hidden
      })}
          part="mark-tick"
          style=${b({ left: `${o}%` })}
        ></div>
        <div
          class=${p({
        mark__label: !0,
        "mark__label--hidden": s.hidden
      })}
          part="mark-label"
          style=${b({ left: `${o}%` })}
        >
          ${s.label}
        </div>`;
    });
  }
  render() {
    const t = this.hasSlotController.test("label"), s = this.hasSlotController.test("help-text"), o = this.label ? !0 : !!t, r = this.helpText ? !0 : !!s;
    return k`
      <div
        part="form-control"
        class=${p({
      "form-control": !0,
      "form-control--has-help-text": r,
      // range only has one size
      "form-control--has-label": o,
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
          aria-hidden=${o ? "false" : "true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${p({
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
                name=${f(this.name)}
                ?disabled=${this.disabled}
                min=${f(this.min)}
                max=${f(this.max)}
                step=${this.step || Number.MIN_VALUE}
                .value=${z(this.value.toString())}
                aria-describedby="help-text"
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
              style=${b({
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
          aria-hidden=${r ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
u.styles = [T, V, U], u.dependencies = {
  "cx-tooltip": I
};
let e = u;
i([
  y(".range__control")
], e.prototype, "input", 2);
i([
  y(".range__tooltip")
], e.prototype, "output", 2);
i([
  y(".range")
], e.prototype, "range", 2);
i([
  v()
], e.prototype, "hasFocus", 2);
i([
  v()
], e.prototype, "hasTooltip", 2);
i([
  a()
], e.prototype, "state", 2);
i([
  a()
], e.prototype, "title", 2);
i([
  a()
], e.prototype, "name", 2);
i([
  a({ type: Number })
], e.prototype, "value", 2);
i([
  a()
], e.prototype, "label", 2);
i([
  a({ attribute: "help-text" })
], e.prototype, "helpText", 2);
i([
  a({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
i([
  a({ type: Number })
], e.prototype, "min", 2);
i([
  a({ type: Number })
], e.prototype, "max", 2);
i([
  a({ reflect: !0, type: Number })
], e.prototype, "step", 2);
i([
  a({ attribute: "tooltip-placement" })
], e.prototype, "tooltipPlacement", 2);
i([
  a({ attribute: "tooltip-display" })
], e.prototype, "tooltipDisplay", 2);
i([
  a({ attribute: "tooltip-hoist", type: Boolean })
], e.prototype, "tooltipHoist", 2);
i([
  a({ attribute: !1 })
], e.prototype, "tooltipFormatter", 2);
i([
  a({ reflect: !0 })
], e.prototype, "form", 2);
i([
  a({ attribute: "snap-threshold", type: Number })
], e.prototype, "snapThreshold", 2);
i([
  a({ attribute: "show-marks", type: Boolean })
], e.prototype, "showMarks", 2);
i([
  a({ attribute: "tooltip-offset", type: Number })
], e.prototype, "tooltipOffset", 2);
i([
  v()
], e.prototype, "marks", 2);
i([
  D()
], e.prototype, "defaultValue", 2);
i([
  d(["min", "max", "step"])
], e.prototype, "initMarks", 1);
i([
  P({ passive: !0 })
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
export {
  e as default
};
