import { C as S } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as _ } from "../chunks/component.styles.BLcT4bOa.js";
import { f as L } from "../chunks/form-control.styles.vYJVd0IP.js";
import { s as y, a as g } from "../chunks/animate.c3HW4nwn.js";
import { d as I } from "../chunks/default-value.BaUjiOTd.js";
import { w as O } from "../chunks/event.mFzZi4sr.js";
import { F as $ } from "../chunks/form.CBFaCEBn.js";
import { s as D } from "../chunks/scroll.DwPiX2Ox.js";
import { H as A } from "../chunks/slot.DJLm4Dig.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { x as c } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as b } from "../chunks/state.-o_YRGMi.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as x } from "../chunks/class-map.Cn0czwWq.js";
import { o as E } from "../chunks/unsafe-html.DgLLaYx0.js";
import { g as v, a as C } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as V } from "../chunks/localize.DV9I313e.js";
import z from "./icon.component.js";
import u from "./option.component.js";
import k from "./popup.component.js";
import B from "./tag.component.js";
import F from "./select.styles.js";
const T = () => navigator.userAgent.includes("Cortex") || navigator.userAgent.includes("Photoshop") || navigator.userAgent.includes("AfterEffect") || navigator.userAgent.includes("Illustrator"), P = (p) => !(document.createElement(p.tagName).constructor === HTMLElement || customElements.get(p.tagName.toLowerCase()));
var M = Object.defineProperty, U = Object.getOwnPropertyDescriptor, i = (p, t, e, o) => {
  for (var l = o > 1 ? void 0 : o ? U(t, e) : t, a = p.length - 1, r; a >= 0; a--)
    (r = p[a]) && (l = (o ? r(t, e, l) : r(l)) || l);
  return o && l && M(t, e, l), l;
};
const f = class f extends S {
  constructor() {
    super(...arguments), this.formControlController = new $(this, {
      assumeInteractionOn: ["cx-blur", "cx-input"]
    }), this.hasSlotController = new A(
      this,
      "help-text",
      "label"
    ), this.localize = new V(this), this.typeToSelectString = "", this.hasFocus = !1, this.displayLabel = "", this.selectedOptions = [], this.name = "", this.value = "", this.defaultValue = "", this.size = "medium", this.placeholder = "", this.allowFreetext = !1, this.multiple = !1, this.maxOptionsVisible = 3, this.disabled = !1, this.clearable = !1, this.open = !1, this.hoist = !1, this.freeWidth = !1, this.autosizePadding = 10, this.filled = !1, this.pill = !1, this.label = "", this.placement = "bottom", this.helpText = "", this.form = "", this.required = !1, this.getTag = (t) => {
      const e = this.hasSlotController.test("label"), l = (this.label ? !0 : !!e) ? this.size === "large" ? "medium" : "small" : this.size;
      return c`
      <cx-tag
        part="tag"
        exportparts="
              base:tag__base,
              content:tag__content,
              remove-button:tag__remove-button,
              remove-button__base:tag__remove-button__base
            "
        ?pill=${this.pill}
        size=${l}
        removable
        @cx-remove=${(a) => this.handleTagRemove(a, t)}
      >
        ${this.getOptionLabel(t)}
      </cx-tag>
    `;
    }, this.inputBehavior = "filter", this.getOptionValue = (t) => !t || !(t instanceof u) ? "" : t.value, this.stayOpenOnSelect = !1, this.forceOnChange = !1, this.handleDocumentFocusIn = (t) => {
      const e = t.composedPath();
      this && !e.includes(this) && !this.stayOpenOnSelect && this.hide();
    }, this.handleDocumentKeyDown = (t) => {
      const e = t.target, o = e.closest(".select__clear") !== null, l = e.closest("cx-icon-button") !== null;
      if (!(o || l)) {
        if (t.key === "Escape" && this.open && !this.closeWatcher && (t.preventDefault(), t.stopPropagation(), this.hide(), this.displayInput.focus({ preventScroll: !0 })), t.key === "Enter") {
          if (t.preventDefault(), t.stopImmediatePropagation(), !this.open) {
            this.show();
            return;
          }
          this.currentOption && !this.getOptionDisabled(this.currentOption) && (this.multiple ? this.toggleOptionSelection(this.currentOption) : this.setSelectedOptions(this.currentOption), this.updateComplete.then(() => {
            this.emit("cx-input"), this.emit("cx-change");
          }), !this.multiple && !this.stayOpenOnSelect && (this.hide(), this.displayInput.focus({ preventScroll: !0 })));
          return;
        }
        if (["ArrowUp", "ArrowDown", "Home", "End"].includes(t.key)) {
          const a = this.getAllOptions().filter((w) => this.inputBehavior === "filter" ? !w.hidden : !0), r = a.indexOf(this.currentOption);
          let h = Math.max(0, r);
          if (t.preventDefault(), !this.open && (this.show(), this.currentOption))
            return;
          t.key === "ArrowDown" ? (h = r + 1, h > a.length - 1 && (h = 0)) : t.key === "ArrowUp" ? (h = r - 1, h < 0 && (h = a.length - 1)) : t.key === "Home" ? h = 0 : t.key === "End" && (h = a.length - 1), this.setCurrentOption(a[h]);
        }
      }
    }, this.handleDocumentMouseDown = (t) => {
      const e = t.composedPath();
      this && !e.includes(this) && !this.stayOpenOnSelect && this.hide();
    };
  }
  /** Gets the validity state object */
  get validity() {
    return this.valueInput.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.valueInput.validationMessage;
  }
  // #region Overridables
  /**
   *
   * @param option The option to update the selected state
   * @param selected If undefined, the option will be toggled. If true, the option will be selected. If false, the option will be unselected.
   * @returns
   */
  setOptionSelected(t, e) {
    if (t instanceof u) {
      if (e === void 0) {
        t.selected = !t.selected;
        return;
      }
      t.selected = e, e && this.setCurrentOption(t);
    }
  }
  /**
   *
   * current = whether the option is currently focused on e.g via keyboard
   * @param option The option to update the current state
   * @param current If undefined, the option will be toggled. If true, the option will be set as current. If false, the option will be unset.
   * @returns
   */
  setOptionCurrent(t, e) {
    if (t instanceof u) {
      if (e === void 0) {
        t.current = !t.current;
        return;
      }
      t.current = e;
    }
  }
  /**
   *
   * @param option The option to get the label for
   * @returns The label
   */
  getOptionLabel(t) {
    return !t || !(t instanceof u) ? "" : t.getTextLabel();
  }
  /**
   *
   * @param option The option to get the selected state for
   * @returns The selected state
   */
  getOptionSelected(t) {
    if (!(!t || !(t instanceof u)))
      return t.selected;
  }
  /**
   *
   * @param option The option to get the disabled state for
   * @returns The disabled state
   */
  getOptionDisabled(t) {
    if (!(!t || !(t instanceof u)))
      return t.disabled;
  }
  /**
   * For each option, this function is called to determine if the option should be displayed based on the input string
   * @param option
   * @param value The current input string
   * @returns Whether this option should be displayed
   */
  filterCallback(t, e) {
    return this.getOptionLabel(t).toLowerCase().includes(e);
  }
  // #endregion
  connectedCallback() {
    super.connectedCallback(), this.stayOpenOnSelect || (this.open = !1);
  }
  firstUpdated(t) {
    super.firstUpdated(t), T() && (this.contentEditable = "true");
  }
  addOpenListeners() {
    var t;
    document.addEventListener(
      "focusin",
      this.handleDocumentFocusIn
    ), document.addEventListener(
      "keydown",
      this.handleDocumentKeyDown
    ), document.addEventListener(
      "mousedown",
      this.handleDocumentMouseDown
    ), this.getRootNode() !== document && this.getRootNode().addEventListener(
      "focusin",
      this.handleDocumentFocusIn
    ), "CloseWatcher" in window && ((t = this.closeWatcher) == null || t.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => {
      this.open && (this.hide(), this.displayInput.focus({ preventScroll: !0 }));
    });
  }
  removeOpenListeners() {
    var t;
    document.removeEventListener(
      "focusin",
      this.handleDocumentFocusIn
    ), document.removeEventListener(
      "keydown",
      this.handleDocumentKeyDown
    ), document.removeEventListener(
      "mousedown",
      this.handleDocumentMouseDown
    ), this.getRootNode() !== document && this.getRootNode().removeEventListener(
      "focusin",
      this.handleDocumentFocusIn
    ), (t = this.closeWatcher) == null || t.destroy();
  }
  handleFocus() {
    this.hasFocus = !0, this.displayInput.setSelectionRange(0, this.displayInput.value.length), this.emit("cx-focus");
  }
  handleBlur() {
    this.hasFocus = !1, this.allowFreetext || (this.displayInput.value = this.displayLabel, this.typeToSelectString = ""), this.emit("cx-blur");
  }
  handleInput(t) {
    if (!this.open && (this.show(), t.data === " "))
      return;
    const e = t.target, o = [
      "ArrowUp",
      "ArrowDown",
      "Enter",
      "Escape",
      "Tab",
      "Home",
      "End"
    ];
    if (!(t.data && o.includes(t.data)))
      switch (this.typeToSelectString = e.value.toLowerCase(), this.emit("cx-input"), this.inputBehavior) {
        case "filter": {
          this.filterOptionsByInput();
          break;
        }
        case "select":
          this.selectOptionByInput();
      }
  }
  handleLabelClick() {
    this.displayInput.focus();
  }
  handleComboboxMouseDown(t) {
    const e = t.composedPath();
    let o = !1, l = !1;
    e.forEach((a) => {
      if (a instanceof HTMLElement && a.classList.contains("select__expand-icon")) {
        l = !0;
        return;
      }
      a instanceof HTMLElement && a.tagName.toLowerCase() === "cx-icon-button" && (o = !0);
    }), !(this.disabled || o) && (l || this.inputBehavior !== "filter" || !this.open) && (t.preventDefault(), this.displayInput.focus({ preventScroll: !0 }), this.open = !this.open);
  }
  handleComboboxKeyDown(t) {
    t.key !== "Tab" && (t.stopPropagation(), this.handleDocumentKeyDown(t));
  }
  handleClearClick(t) {
    t.stopPropagation(), this.value !== "" && (this.setSelectedOptions([]), this.displayInput.focus({ preventScroll: !0 }), this.updateComplete.then(() => {
      this.emit("cx-clear"), this.emit("cx-input"), this.emit("cx-change");
    }));
  }
  handleClearMouseDown(t) {
    t.stopPropagation(), t.preventDefault();
  }
  handleOptionClick(t) {
    const o = t.target.closest('[role="option"], cx-option'), l = this.value;
    o && !this.getOptionDisabled(o) && (this.multiple ? this.toggleOptionSelection(o) : this.setSelectedOptions(o), this.updateComplete.then(
      () => this.displayInput.focus({ preventScroll: !0 })
    ), (this.value !== l || this.forceOnChange) && this.updateComplete.then(() => {
      this.emit("cx-input"), this.emit("cx-change");
    }), !this.multiple && !this.stayOpenOnSelect && (this.hide(), this.displayInput.focus({ preventScroll: !0 })));
  }
  handleDefaultSlotChange() {
    const t = this.getAllOptions(), e = Array.isArray(this.value) ? this.value : [this.value], o = [];
    for (const l of t) {
      const a = this.getOptionValue(l);
      if (!a && !(l instanceof u)) return;
      o.push(a);
      const r = l.tagName.toLowerCase();
      if (!P(l) && !customElements.get(r)) {
        customElements.whenDefined(r).then(() => this.handleDefaultSlotChange());
        return;
      }
    }
    t.forEach((l) => o.push(this.getOptionValue(l))), this.setSelectedOptions(
      t.filter((l) => e.includes(this.getOptionValue(l)))
    );
  }
  handleTagRemove(t, e) {
    t.stopPropagation(), this.disabled || (this.toggleOptionSelection(e, !1), this.updateComplete.then(() => {
      this.emit("cx-input"), this.emit("cx-change");
    }));
  }
  // Gets an array of all <cx-option> elements
  getAllOptions() {
    return [
      ...this.querySelectorAll('[role="option"], cx-option')
    ];
  }
  // Gets the first <cx-option> element
  getFirstOption() {
    return this.querySelector("cx-option");
  }
  // Sets the current option, which is the option the user is currently interacting with (e.g. via keyboard). Only one
  // option may be "current" at a time.
  setCurrentOption(t) {
    this.getAllOptions().forEach((o) => {
      this.setOptionCurrent(o, !1), o.tabIndex = -1;
    }), t && (this.currentOption = t, this.setOptionCurrent(t, !0), t.tabIndex = 0, t.scrollIntoView({ block: "nearest" }));
  }
  // Sets the selected option(s)
  setSelectedOptions(t) {
    const e = this.getAllOptions(), o = Array.isArray(t) ? t : [t];
    e.forEach((l) => this.setOptionSelected(l, !1)), o.length && o.forEach((l) => this.setOptionSelected(l, !0)), this.selectionChanged();
  }
  // Toggles an option's selected state
  toggleOptionSelection(t, e) {
    this.setOptionSelected(t, e), this.selectionChanged();
  }
  // This method must be called whenever the selection changes. It will update the selected options cache, the current
  // value, and the display value
  selectionChanged() {
    this.selectedOptions = this.getAllOptions().filter(
      (t) => this.getOptionSelected(t)
    ), this.multiple ? (this.value = this.selectedOptions.map((t) => this.getOptionValue(t)), this.placeholder && this.value.length === 0 ? this.displayLabel = "" : this.displayLabel = this.localize.term(
      "numOptionsSelected",
      this.selectedOptions.length
    )) : (this.value = this.getOptionValue(this.selectedOptions[0]) ?? "", this.displayLabel = this.getOptionLabel(this.selectedOptions[0]) ?? ""), this.updateComplete.then(() => {
      this.formControlController.updateValidity();
    });
  }
  get tags() {
    const t = this.hasSlotController.test("label"), o = (this.label ? !0 : !!t) ? this.size === "large" ? "medium" : "small" : this.size;
    return this.selectedOptions.map((l, a) => {
      if (a < this.maxOptionsVisible || this.maxOptionsVisible <= 0) {
        const r = this.getTag(l, a);
        return c`<div
          class="select__tag-wrapper"
          @cx-remove=${(h) => this.handleTagRemove(h, l)}
        >
          ${typeof r == "string" ? E(r) : r}
        </div>`;
      } else if (a === this.maxOptionsVisible)
        return c`<cx-tag ?pill=${this.pill} size=${o}
          >+${this.selectedOptions.length - a}</cx-tag
        >`;
      return c``;
    });
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  handleDisabledChange() {
    this.disabled && (this.open = !1, this.handleOpenChange());
  }
  handleValueChange() {
    const t = this.getAllOptions(), e = Array.isArray(this.value) ? this.value : [this.value];
    this.setSelectedOptions(
      t.filter((o) => e.includes(this.getOptionValue(o)))
    );
  }
  async handleOpenChange() {
    if (this.open && !this.disabled) {
      this.filterOptionsByInput(), this.setCurrentOption(this.selectedOptions[0] || this.getFirstOption()), this.emit("cx-show"), this.addOpenListeners(), await y(this), this.listbox.hidden = !1, this.popup.active = !0, requestAnimationFrame(() => {
        this.setCurrentOption(this.currentOption);
      });
      const { keyframes: t, options: e } = v(this, "select.show", {
        dir: this.localize.dir()
      });
      await g(this.popup.popup, t, e), this.currentOption && D(this.currentOption, this.listbox, "vertical", "auto"), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), await y(this);
      const { keyframes: t, options: e } = v(this, "select.hide", {
        dir: this.localize.dir()
      });
      await g(this.popup.popup, t, e), this.listbox.hidden = !0, this.popup.active = !1, this.emit("cx-after-hide");
    }
  }
  selectOptionByInput() {
    const t = this.getAllOptions();
    for (const e of t)
      if (this.getOptionLabel(e).toLowerCase().startsWith(this.typeToSelectString)) {
        this.setCurrentOption(e);
        break;
      }
  }
  filterOptionsByInput() {
    const t = this.getAllOptions();
    for (const e of t)
      this.filterCallback(e, this.typeToSelectString) ? (e.hidden = !1, e.style.display = "") : (e.hidden = !0, e.style.display = "none");
    this.popup.style.removeProperty("--auto-size-available-width"), this.popup.style.removeProperty("--auto-size-available-height");
  }
  /** Shows the listbox. */
  async show() {
    if (this.open || this.disabled) {
      this.open = !1;
      return;
    }
    return this.open = !0, O(this, "cx-after-show");
  }
  /** Hides the listbox. */
  async hide() {
    if (!this.open || this.disabled) {
      this.open = !1;
      return;
    }
    return this.open = !1, O(this, "cx-after-hide");
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.valueInput.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.valueInput.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(t) {
    this.valueInput.setCustomValidity(t), this.formControlController.updateValidity();
  }
  /** Sets focus on the control. */
  focus(t) {
    this.displayInput.focus(t);
  }
  /** Removes focus from the control. */
  blur() {
    this.displayInput.blur();
  }
  render() {
    const t = this.hasSlotController.test("label"), e = this.hasSlotController.test("help-text"), o = this.label ? !0 : !!t, l = this.helpText ? !0 : !!e, a = this.clearable && !this.disabled && this.value.length > 0, r = this.placeholder && this.value.length === 0 && this.displayLabel.length === 0;
    return c`
      <div
        part="form-control"
        class=${x({
      "form-control": !0,
      "form-control--has-help-text": l,
      "form-control--has-label": o,
      "form-control--large": this.size === "large",
      "form-control--medium": this.size === "medium",
      "form-control--small": this.size === "small"
    })}
      >
        <div part="form-control-input" class="form-control-input">
          <cx-popup
            .active=${this.open && this.stayOpenOnSelect}
            class=${x({
      select: !0,
      "select--bottom": this.placement === "bottom",
      "select--disabled": this.disabled,
      "select--empty": this.value.length === 0 && this.displayLabel.length === 0 || this.multiple && this.tags.length === 0,
      "select--filled": this.filled,
      "select--focused": this.hasFocus || this.open,
      "select--large": this.size === "large",
      "select--medium": this.size === "medium",
      "select--multiple": this.multiple,
      "select--open": this.open,
      "select--pill": this.pill,
      "select--placeholder-visible": r,
      "select--small": this.size === "small",
      "select--standard": !0,
      "select--top": this.placement === "top"
    })}
            placement=${this.placement}
            strategy=${this.hoist ? "fixed" : "absolute"}
            flip
            shift
            sync=${this.freeWidth ? void 0 : "width"}
            auto-size="both"
            auto-size-padding=${this.autosizePadding}
            flip-padding="10"
          >
            <div
              part="combobox"
              class="select__combobox"
              slot="anchor"
              @keydown=${this.handleComboboxKeyDown}
              @mousedown=${this.handleComboboxMouseDown}
            >
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <span class="input-container">
                <label
                  id="label"
                  part="form-control-label"
                  class="form-control__label"
                  aria-hidden=${o ? "false" : "true"}
                  @click=${this.handleLabelClick}
                >
                  <slot name="label">${this.label}</slot>
                </label>
                <input
                  part="display-input"
                  class="select__display-input"
                  type="text"
                  placeholder=${this.placeholder}
                  .disabled=${this.disabled}
                  .value=${this.displayLabel}
                  autocomplete="off"
                  spellcheck="false"
                  autocapitalize="off"
                  aria-controls="listbox"
                  aria-expanded=${this.open ? "true" : "false"}
                  aria-haspopup="listbox"
                  aria-label=${o ? void 0 : this.dataset.label}
                  aria-labelledby="label"
                  aria-disabled=${this.disabled ? "true" : "false"}
                  aria-describedby="help-text"
                  role="combobox"
                  tabindex="0"
                  @focus=${this.handleFocus}
                  @blur=${this.handleBlur}
                  @input=${this.handleInput}
                />
                ${this.multiple ? c`<div part="tags" class="select__tags">
                      ${this.tags}
                    </div>` : ""}
              </span>

              <input
                class="select__value-input"
                type="text"
                ?disabled=${this.disabled}
                ?required=${this.required}
                .value=${Array.isArray(this.value) ? this.value.join(", ") : this.value}
                tabindex="-1"
                aria-hidden="true"
                @focus=${() => this.focus()}
                @invalid=${this.handleInvalid}
              />

              ${a ? c`
                    <button
                      part="clear-button"
                      class="select__clear"
                      type="button"
                      aria-label=${this.localize.term("clearEntry")}
                      @mousedown=${this.handleClearMouseDown}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <cx-icon name="cancel"></cx-icon>
                      </slot>
                    </button>
                  ` : ""}

              <slot name="suffix" part="suffix" class="select__suffix"></slot>

              <slot
                name="expand-icon"
                part="expand-icon"
                class="select__expand-icon"
              >
                <cx-icon name="arrow_drop_down"></cx-icon>
              </slot>
            </div>

            <div
              id="listbox"
              role="listbox"
              aria-expanded=${this.open ? "true" : "false"}
              aria-multiselectable=${this.multiple ? "true" : "false"}
              aria-labelledby="label"
              part="listbox"
              class="select__listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
              @slotchange=${this.handleDefaultSlotChange}
            >
              <slot></slot>
            </div>
          </cx-popup>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${l ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
f.styles = [_, L, F], f.dependencies = {
  "cx-icon": z,
  "cx-popup": k,
  "cx-tag": B
};
let s = f;
i([
  d(".select")
], s.prototype, "popup", 2);
i([
  d(".select__combobox")
], s.prototype, "combobox", 2);
i([
  d(".select__display-input")
], s.prototype, "displayInput", 2);
i([
  d(".select__value-input")
], s.prototype, "valueInput", 2);
i([
  d(".select__listbox")
], s.prototype, "listbox", 2);
i([
  b()
], s.prototype, "hasFocus", 2);
i([
  b()
], s.prototype, "displayLabel", 2);
i([
  b()
], s.prototype, "currentOption", 2);
i([
  b()
], s.prototype, "selectedOptions", 2);
i([
  n()
], s.prototype, "name", 2);
i([
  n({
    converter: {
      fromAttribute: (p) => p.split(" "),
      toAttribute: (p) => p.join(" ")
    }
  })
], s.prototype, "value", 2);
i([
  I()
], s.prototype, "defaultValue", 2);
i([
  n({ reflect: !0 })
], s.prototype, "size", 2);
i([
  n()
], s.prototype, "placeholder", 2);
i([
  n({ attribute: "allow-freetext", reflect: !0, type: Boolean })
], s.prototype, "allowFreetext", 2);
i([
  n({ reflect: !0, type: Boolean })
], s.prototype, "multiple", 2);
i([
  n({ attribute: "max-options-visible", type: Number })
], s.prototype, "maxOptionsVisible", 2);
i([
  n({ reflect: !0, type: Boolean })
], s.prototype, "disabled", 2);
i([
  n({ type: Boolean })
], s.prototype, "clearable", 2);
i([
  n({ reflect: !0, type: Boolean })
], s.prototype, "open", 2);
i([
  n({ type: Boolean })
], s.prototype, "hoist", 2);
i([
  n({ attribute: "free-width", reflect: !0, type: Boolean })
], s.prototype, "freeWidth", 2);
i([
  n({ attribute: "auto-size-padding", type: Number })
], s.prototype, "autosizePadding", 2);
i([
  n({ reflect: !0, type: Boolean })
], s.prototype, "filled", 2);
i([
  n({ reflect: !0, type: Boolean })
], s.prototype, "pill", 2);
i([
  n()
], s.prototype, "label", 2);
i([
  n({ reflect: !0 })
], s.prototype, "placement", 2);
i([
  n({ attribute: "help-text" })
], s.prototype, "helpText", 2);
i([
  n({ reflect: !0 })
], s.prototype, "form", 2);
i([
  n({ reflect: !0, type: Boolean })
], s.prototype, "required", 2);
i([
  n({ attribute: !1 })
], s.prototype, "getTag", 2);
i([
  n({ attribute: "input-behavior" })
], s.prototype, "inputBehavior", 2);
i([
  n({ attribute: !1 })
], s.prototype, "getOptionValue", 2);
i([
  n({ attribute: "stay-open-on-select", type: Boolean })
], s.prototype, "stayOpenOnSelect", 2);
i([
  n({ attribute: "force-on-change", type: Boolean })
], s.prototype, "forceOnChange", 2);
i([
  m("getOptionValue", { waitUntilFirstUpdate: !0 })
], s.prototype, "handleDefaultSlotChange", 1);
i([
  m("disabled", { waitUntilFirstUpdate: !0 })
], s.prototype, "handleDisabledChange", 1);
i([
  m("value", { waitUntilFirstUpdate: !0 })
], s.prototype, "handleValueChange", 1);
i([
  m("open", { waitUntilFirstUpdate: !0 })
], s.prototype, "handleOpenChange", 1);
C("select.show", {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
C("select.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 }
  ],
  options: { duration: 100, easing: "ease" }
});
export {
  s as default
};
