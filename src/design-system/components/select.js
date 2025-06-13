import { C as O, c as w } from "../chunks/custom-element.X6y1saJZ.js";
import { c as C } from "../chunks/component.styles.BLcT4bOa.js";
import { f as k } from "../chunks/form-control.styles.vYJVd0IP.js";
import { s as f, a as b } from "../chunks/animate.c3HW4nwn.js";
import { d as S } from "../chunks/default-value.BaUjiOTd.js";
import { w as g } from "../chunks/event.mFzZi4sr.js";
import { F as z } from "../chunks/form.CBFaCEBn.js";
import { s as I } from "../chunks/scroll.DwPiX2Ox.js";
import { H as L } from "../chunks/slot.DJLm4Dig.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { i as $, x as p } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as m } from "../chunks/state.-o_YRGMi.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as x } from "../chunks/class-map.Cn0czwWq.js";
import { o as D } from "../chunks/unsafe-html.BH_TRc1Y.js";
import { a as y, g as v } from "../chunks/animation-registry.CvD8WTfD.js";
import { L as A } from "../chunks/localize.D5Yoww6T.js";
import E from "./icon.js";
import h from "./option.js";
import V from "./popup.js";
import B from "./tag.js";
const F = () => navigator.userAgent.includes("Cortex") || navigator.userAgent.includes("Photoshop") || navigator.userAgent.includes("AfterEffect") || navigator.userAgent.includes("Illustrator"), T = (e) => !(document.createElement(e.tagName).constructor === HTMLElement || customElements.get(e.tagName.toLowerCase())), P = $`
  :host {
    display: block;
  }

  :host([data-user-invalid])::part(combobox) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid]:focus-within)::part(combobox) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--cx-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    letter-spacing: var(--cx-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    transition:
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) border,
      var(--cx-transition-fast) box-shadow,
      var(--cx-transition-fast) background-color;
    /*
      match default width of HTMLInputElement, so that in multiselect mode,
      when display input gets hidden, the select doesn't shrink
    */
    width: 20ch;
    min-width: 0;
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--cx-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    line-height: var(--cx-line-height-medium);
    text-overflow: ellipsis;
  }

  .form-control--has-label .select__display-input {
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-2x-small);
  }

  .select__display-input::placeholder {
    color: var(--cx-input-placeholder-color);
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--cx-input-color-hover);
  }

  .select:not(.select--disabled):hover .select__combobox {
    border-color: var(--cx-input-border-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .form-control--has-label .select__tags {
    padding-top: calc(var(--cx-spacing-2x-small) + var(--cx-spacing-3x-small));
  }

  /** In multiple mode, select__tags is displayed instead of display__input
   * Make sure select__tags have the same height as a display__input of the same size
   */
  .select--small:not(.select--placeholder-visible) .select__tags {
    min-height: var(--cx-line-height-medium);
  }

  .select--medium:not(.select--placeholder-visible) .select__tags {
    min-height: var(--cx-line-height-medium);
  }

  .select--large:not(.select--placeholder-visible) .select__tags {
    min-height: var(--cx-line-height-medium);
  }

  .select__tags::slotted(cx-tag) {
    cursor: pointer !important;
  }

  .select--disabled .select__tags,
  .select--disabled .select__tags::slotted(cx-tag) {
    cursor: default !important;
  }

  .select__tag-wrapper {
    line-height: 1;
  }

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--cx-input-background-color);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--cx-input-background-color-disabled);
    border-color: var(--cx-input-border-color-disabled);
    color: var(--cx-input-color-disabled);
    opacity: 0.5;
    cursor: default;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--cx-input-background-color-focus);
    border-color: var(--cx-input-border-color-focus);
  }

  /* Filled selects */
  .select--filled .select__combobox {
    border: none;
    background-color: var(--cx-input-filled-background-color);
    color: var(--cx-input-color);
  }

  .select--filled:hover:not(.select--disabled) .select__combobox {
    background-color: var(--cx-input-filled-background-color-hover);
  }

  .select--filled.select--disabled .select__combobox {
    background-color: var(--cx-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .select--filled:not(.select--disabled).select--open .select__combobox,
  .select--filled:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--cx-input-filled-background-color-focus);
    outline: var(--cx-focus-ring);
  }

  /* Sizes */
  .select--small .select__combobox {
    border-radius: var(--cx-input-border-radius-small);
    font-size: var(--cx-input-font-size-small);
    min-height: var(--cx-input-height-small);
    padding-block: 0;
    padding-inline: var(--cx-input-spacing-small);
  }

  .form-control:not(.form-control--has-label)
    .select--small.select--multiple
    .select__combobox {
    padding-block: 2px;
  }

  .form-control:not(.form-control--has-label)
    .select--multiple
    .select__display-input {
    margin-top: 0;
  }

  .form-control:not(.form-control--has-label) .input-container {
    justify-content: center;
  }

  .form-control:not(.form-control--has-label)
    .input-container
    .select__display-input {
    margin-top: 0;
  }

  .select--small .select__clear {
    margin-inline-start: var(--cx-input-spacing-small);
  }

  .select--small .select__prefix::slotted(*) {
    margin-inline-end: var(--cx-input-spacing-small);
  }

  .select--small .select__tags {
    gap: 2px;
  }

  .select--medium .select__combobox {
    border-radius: var(--cx-input-border-radius-medium);
    font-size: var(--cx-input-font-size-small);
    min-height: var(--cx-input-height-medium);
    padding-block: 0;
    padding-inline: var(--cx-input-spacing-medium);
  }

  .form-control:not(.form-control--has-label)
    .select--medium.select--multiple
    .select__combobox {
    padding-block: 3px;
  }

  .select--medium .select__clear {
    margin-inline-start: var(--cx-input-spacing-medium);
  }

  .select--medium .select__prefix::slotted(*) {
    margin-inline-end: var(--cx-input-spacing-medium);
  }

  .select--medium .select__tags {
    gap: 3px;
  }

  .select--large .select__combobox {
    border-radius: var(--cx-input-border-radius-large);
    font-size: var(--cx-input-font-size-small);
    min-height: var(--cx-input-height-large);
    padding-block: 0;
    padding-inline: var(--cx-input-spacing-large);
  }

  .form-control:not(.form-control--has-label)
    .select--large.select--multiple
    .select__combobox {
    padding-block: 4px;
  }

  .select--large .select__clear {
    margin-inline-start: var(--cx-input-spacing-large);
  }

  .select--large .select__prefix::slotted(*) {
    margin-inline-end: var(--cx-input-spacing-large);
  }

  .select--large .select__tags {
    gap: 4px;
  }

  /* Pills */
  .select--pill.select--small .select__combobox {
    border-radius: var(--cx-input-height-small);
  }

  .select--pill.select--medium .select__combobox {
    border-radius: var(--cx-input-height-medium);
  }

  .select--pill.select--large .select__combobox {
    border-radius: var(--cx-input-height-large);
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--cx-input-placeholder-color);
  }

  /* Suffix */
  .select__suffix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--cx-input-placeholder-color);
  }

  /* Clear button */
  .select__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--cx-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--cx-transition-fast) color;
    cursor: pointer;
    z-index: 1;
  }

  .select__clear:hover {
    color: var(--cx-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--cx-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--cx-spacing-small);
    font-size: var(--cx-font-size-large);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    box-shadow: var(--cx-shadow-large);
    background: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-radius: var(--cx-border-radius-large);
    padding-block: var(--cx-spacing-x-small);
    padding-inline: 0;
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);
  }

  .select__listbox ::slotted(cx-divider) {
    --spacing: var(--cx-spacing-x-small);
  }

  .select__listbox ::slotted(small) {
    display: block;
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-semibold);
    color: var(--cx-color-neutral-500);
    padding-block: var(--cx-spacing-2x-small);
    padding-inline: var(--cx-spacing-small);
  }

  /*
   * Adapt label to be inside select
   */

  .input-container {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    flex: 1;
    width: 0;
    height: 100%;
  }

  /* Center label vertically + same style as input value */
  .form-control__label {
    position: relative;
    -webkit-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;
    pointer-events: none;
    width: fit-content;
    line-height: 1; /* use line-height: 1 for easier transform calculation */
  }

  /* when empty with no placeholder (initial state), transform label to vertical center
    = (input height - label height) / 2
  */
  .select--small .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-small) +
              1.25rem - var(--cx-input-font-size-small)
          ) /
          2
      )
    );
    margin: 0;
  }

  .select--medium .form-control__label {
    transform: translateY(
      calc(
        (
          var(--cx-input-height-medium) / 2 +
            1rem - var(--cx-input-font-size-medium)
        )
      )
    );
    margin: 0;
  }

  .select--large .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-large) +
              1rem - var(--cx-input-font-size-large)
          ) /
          2
      )
    );
    margin: 0;
  }

  /* Increase input height if there's a label */
  .form-control--has-label .select--small {
    min-height: calc(var(--cx-input-height-small) + 1rem);
  }
  .form-control--has-label .select--medium {
    min-height: calc(var(--cx-input-height-medium) + 1rem);
  }
  .form-control--has-label .select--large {
    min-height: calc(var(--cx-input-height-large) + 1rem);
  }

  /* When focused or not empty, transform label to top
    Instead of 0, use var(--cx-spacing-2x-small) to have a distance from top
  */
  .form-control--has-label .select--focused .form-control__label,
  .form-control--has-label .select--placeholder-visible .form-control__label,
  .form-control--has-label .select:not(.select--empty) .form-control__label {
    transform: translateY(
      calc(var(--cx-spacing-2x-small) + var(--cx-spacing-3x-small))
    ); /* distance from top */
  }

  /* Display options in vertical direction */
  .select__listbox slot {
    display: flex;
    flex-direction: column;
  }

  /*
   * Input groups support a variety of input types (e.g. inputs with tooltips, inputs as dropdown triggers, etc.).
   * This means inputs aren't always direct descendants of the input group, thus we can't target them with the
   * ::slotted selector. To work around this, the input group component does some magic to add these special classes to
   * inputs and we style them here instead.
   */

  :host(
      [data-cx-input-group__input--first]:not(
          [data-cx-input-group__input--last]
        )
    )
    .select__combobox {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-cx-input-group__input--inner]) .select__combobox {
    border-radius: 0;
  }

  :host(
      [data-cx-input-group__input--last]:not(
          [data-cx-input-group__input--first]
        )
    )
    .select__combobox {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-cx-input-group__input]:not([data-cx-input-group__input--first])) {
    margin-inline-start: calc(-1 * var(--cx-input-border-width));
  }

  /* Bump hovered, focused, and checked inputs up so their focus ring isn't clipped */
  :host([data-cx-input-group__input--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-cx-input-group__input--focus]),
  :host([data-cx-input-group__input][checked]) {
    z-index: 2;
  }
`;
var M = Object.defineProperty, U = Object.getOwnPropertyDescriptor, s = (e, t, o, l) => {
  for (var a = l > 1 ? void 0 : l ? U(t, o) : t, r = e.length - 1, c; r >= 0; r--)
    (c = e[r]) && (a = (l ? c(t, o, a) : c(a)) || a);
  return l && a && M(t, o, a), a;
};
let i = class extends O {
  constructor() {
    super(...arguments), this.formControlController = new z(this, {
      assumeInteractionOn: ["cx-blur", "cx-input"]
    }), this.hasSlotController = new L(
      this,
      "help-text",
      "label"
    ), this.localize = new A(this), this.typeToSelectString = "", this.hasFocus = !1, this.displayLabel = "", this.selectedOptions = [], this.name = "", this.value = "", this.defaultValue = "", this.size = "medium", this.placeholder = "", this.allowFreetext = !1, this.multiple = !1, this.maxOptionsVisible = 3, this.disabled = !1, this.clearable = !1, this.open = !1, this.hoist = !1, this.freeWidth = !1, this.autosizePadding = 10, this.filled = !1, this.pill = !1, this.label = "", this.placement = "bottom", this.helpText = "", this.form = "", this.required = !1, this.getTag = (e) => {
      const t = this.hasSlotController.test("label"), l = (this.label ? !0 : !!t) ? this.size === "large" ? "medium" : "small" : this.size;
      return p`
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
        @cx-remove=${(a) => this.handleTagRemove(a, e)}
      >
        ${this.getOptionLabel(e)}
      </cx-tag>
    `;
    }, this.inputBehavior = "filter", this.getOptionValue = (e) => !e || !(e instanceof h) ? "" : e.value, this.stayOpenOnSelect = !1, this.forceOnChange = !1, this.handleDocumentFocusIn = (e) => {
      const t = e.composedPath();
      this && !t.includes(this) && !this.stayOpenOnSelect && this.hide();
    }, this.handleDocumentKeyDown = (e) => {
      const t = e.target, o = t.closest(".select__clear") !== null, l = t.closest("cx-icon-button") !== null;
      if (!(o || l)) {
        if (e.key === "Escape" && this.open && !this.closeWatcher && (e.preventDefault(), e.stopPropagation(), this.hide(), this.displayInput.focus({ preventScroll: !0 })), e.key === "Enter") {
          if (e.preventDefault(), e.stopImmediatePropagation(), !this.open) {
            this.show();
            return;
          }
          this.currentOption && !this.getOptionDisabled(this.currentOption) && (this.multiple ? this.toggleOptionSelection(this.currentOption) : this.setSelectedOptions(this.currentOption), this.updateComplete.then(() => {
            this.emit("cx-input"), this.emit("cx-change");
          }), !this.multiple && !this.stayOpenOnSelect && (this.hide(), this.displayInput.focus({ preventScroll: !0 })));
          return;
        }
        if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
          const a = this.getAllOptions().filter((_) => this.inputBehavior === "filter" ? !_.hidden : !0), r = a.indexOf(this.currentOption);
          let c = Math.max(0, r);
          if (e.preventDefault(), !this.open && (this.show(), this.currentOption))
            return;
          e.key === "ArrowDown" ? (c = r + 1, c > a.length - 1 && (c = 0)) : e.key === "ArrowUp" ? (c = r - 1, c < 0 && (c = a.length - 1)) : e.key === "Home" ? c = 0 : e.key === "End" && (c = a.length - 1), this.setCurrentOption(a[c]);
        }
      }
    }, this.handleDocumentMouseDown = (e) => {
      const t = e.composedPath();
      this && !t.includes(this) && !this.stayOpenOnSelect && this.hide();
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
  setOptionSelected(e, t) {
    if (e instanceof h) {
      if (t === void 0) {
        e.selected = !e.selected;
        return;
      }
      e.selected = t, t && this.setCurrentOption(e);
    }
  }
  /**
   *
   * current = whether the option is currently focused on e.g via keyboard
   * @param option The option to update the current state
   * @param current If undefined, the option will be toggled. If true, the option will be set as current. If false, the option will be unset.
   * @returns
   */
  setOptionCurrent(e, t) {
    if (e instanceof h) {
      if (t === void 0) {
        e.current = !e.current;
        return;
      }
      e.current = t;
    }
  }
  /**
   *
   * @param option The option to get the label for
   * @returns The label
   */
  getOptionLabel(e) {
    return !e || !(e instanceof h) ? "" : e.getTextLabel();
  }
  /**
   *
   * @param option The option to get the selected state for
   * @returns The selected state
   */
  getOptionSelected(e) {
    if (!(!e || !(e instanceof h)))
      return e.selected;
  }
  /**
   *
   * @param option The option to get the disabled state for
   * @returns The disabled state
   */
  getOptionDisabled(e) {
    if (!(!e || !(e instanceof h)))
      return e.disabled;
  }
  /**
   * For each option, this function is called to determine if the option should be displayed based on the input string
   * @param option
   * @param value The current input string
   * @returns Whether this option should be displayed
   */
  filterCallback(e, t) {
    return this.getOptionLabel(e).toLowerCase().includes(t);
  }
  // #endregion
  connectedCallback() {
    super.connectedCallback(), this.stayOpenOnSelect || (this.open = !1);
  }
  firstUpdated(e) {
    super.firstUpdated(e), F() && (this.contentEditable = "true");
  }
  addOpenListeners() {
    var e;
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
    ), "CloseWatcher" in window && ((e = this.closeWatcher) == null || e.destroy(), this.closeWatcher = new CloseWatcher(), this.closeWatcher.onclose = () => {
      this.open && (this.hide(), this.displayInput.focus({ preventScroll: !0 }));
    });
  }
  removeOpenListeners() {
    var e;
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
    ), (e = this.closeWatcher) == null || e.destroy();
  }
  handleFocus() {
    this.hasFocus = !0, this.displayInput.setSelectionRange(0, this.displayInput.value.length), this.emit("cx-focus");
  }
  handleBlur() {
    this.hasFocus = !1, this.allowFreetext || (this.displayInput.value = this.displayLabel, this.typeToSelectString = ""), this.emit("cx-blur");
  }
  handleInput(e) {
    if (!this.open && (this.show(), e.data === " "))
      return;
    const t = e.target, o = [
      "ArrowUp",
      "ArrowDown",
      "Enter",
      "Escape",
      "Tab",
      "Home",
      "End"
    ];
    if (!(e.data && o.includes(e.data)))
      switch (this.typeToSelectString = t.value.toLowerCase(), this.emit("cx-input"), this.inputBehavior) {
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
  handleComboboxMouseDown(e) {
    const t = e.composedPath();
    let o = !1, l = !1;
    t.forEach((a) => {
      if (a instanceof HTMLElement && a.classList.contains("select__expand-icon")) {
        l = !0;
        return;
      }
      a instanceof HTMLElement && a.tagName.toLowerCase() === "cx-icon-button" && (o = !0);
    }), !(this.disabled || o) && (l || this.inputBehavior !== "filter" || !this.open) && (e.preventDefault(), this.displayInput.focus({ preventScroll: !0 }), this.open = !this.open);
  }
  handleComboboxKeyDown(e) {
    e.key !== "Tab" && (e.stopPropagation(), this.handleDocumentKeyDown(e));
  }
  handleClearClick(e) {
    e.stopPropagation(), this.value !== "" && (this.setSelectedOptions([]), this.displayInput.focus({ preventScroll: !0 }), this.updateComplete.then(() => {
      this.emit("cx-clear"), this.emit("cx-input"), this.emit("cx-change");
    }));
  }
  handleClearMouseDown(e) {
    e.stopPropagation(), e.preventDefault();
  }
  handleOptionClick(e) {
    const o = e.target.closest('[role="option"], cx-option'), l = this.value;
    o && !this.getOptionDisabled(o) && (this.multiple ? this.toggleOptionSelection(o) : this.setSelectedOptions(o), this.updateComplete.then(
      () => this.displayInput.focus({ preventScroll: !0 })
    ), (this.value !== l || this.forceOnChange) && this.updateComplete.then(() => {
      this.emit("cx-input"), this.emit("cx-change");
    }), !this.multiple && !this.stayOpenOnSelect && (this.hide(), this.displayInput.focus({ preventScroll: !0 })));
  }
  handleDefaultSlotChange() {
    const e = this.getAllOptions(), t = Array.isArray(this.value) ? this.value : [this.value], o = [];
    for (const l of e) {
      const a = this.getOptionValue(l);
      if (!a && !(l instanceof h)) return;
      o.push(a);
      const r = l.tagName.toLowerCase();
      if (!T(l) && !customElements.get(r)) {
        customElements.whenDefined(r).then(() => this.handleDefaultSlotChange());
        return;
      }
    }
    e.forEach((l) => o.push(this.getOptionValue(l))), this.setSelectedOptions(
      e.filter((l) => t.includes(this.getOptionValue(l)))
    );
  }
  handleTagRemove(e, t) {
    e.stopPropagation(), this.disabled || (this.toggleOptionSelection(t, !1), this.updateComplete.then(() => {
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
  setCurrentOption(e) {
    this.getAllOptions().forEach((o) => {
      this.setOptionCurrent(o, !1), o.tabIndex = -1;
    }), e && (this.currentOption = e, this.setOptionCurrent(e, !0), e.tabIndex = 0, e.scrollIntoView({ block: "nearest" }));
  }
  // Sets the selected option(s)
  setSelectedOptions(e) {
    const t = this.getAllOptions(), o = Array.isArray(e) ? e : [e];
    t.forEach((l) => this.setOptionSelected(l, !1)), o.length && o.forEach((l) => this.setOptionSelected(l, !0)), this.selectionChanged();
  }
  // Toggles an option's selected state
  toggleOptionSelection(e, t) {
    this.setOptionSelected(e, t), this.selectionChanged();
  }
  // This method must be called whenever the selection changes. It will update the selected options cache, the current
  // value, and the display value
  selectionChanged() {
    this.selectedOptions = this.getAllOptions().filter(
      (e) => this.getOptionSelected(e)
    ), this.multiple ? (this.value = this.selectedOptions.map((e) => this.getOptionValue(e)), this.placeholder && this.value.length === 0 ? this.displayLabel = "" : this.displayLabel = this.localize.term(
      "numOptionsSelected",
      this.selectedOptions.length
    )) : (this.value = this.getOptionValue(this.selectedOptions[0]) ?? "", this.displayLabel = this.getOptionLabel(this.selectedOptions[0]) ?? ""), this.updateComplete.then(() => {
      this.formControlController.updateValidity();
    });
  }
  get tags() {
    const e = this.hasSlotController.test("label"), o = (this.label ? !0 : !!e) ? this.size === "large" ? "medium" : "small" : this.size;
    return this.selectedOptions.map((l, a) => {
      if (a < this.maxOptionsVisible || this.maxOptionsVisible <= 0) {
        const r = this.getTag(l, a);
        return p`<div
          class="select__tag-wrapper"
          @cx-remove=${(c) => this.handleTagRemove(c, l)}
        >
          ${typeof r == "string" ? D(r) : r}
        </div>`;
      } else if (a === this.maxOptionsVisible)
        return p`<cx-tag ?pill=${this.pill} size=${o}
          >+${this.selectedOptions.length - a}</cx-tag
        >`;
      return p``;
    });
  }
  handleInvalid(e) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(e);
  }
  handleDisabledChange() {
    this.disabled && (this.open = !1, this.handleOpenChange());
  }
  handleValueChange() {
    const e = this.getAllOptions(), t = Array.isArray(this.value) ? this.value : [this.value];
    this.setSelectedOptions(
      e.filter((o) => t.includes(this.getOptionValue(o)))
    );
  }
  async handleOpenChange() {
    if (this.open && !this.disabled) {
      this.filterOptionsByInput(), this.setCurrentOption(this.selectedOptions[0] || this.getFirstOption()), this.emit("cx-show"), this.addOpenListeners(), await f(this), this.listbox.hidden = !1, this.popup.active = !0, requestAnimationFrame(() => {
        this.setCurrentOption(this.currentOption);
      });
      const { keyframes: e, options: t } = v(this, "select.show", {
        dir: this.localize.dir()
      });
      await b(this.popup.popup, e, t), this.currentOption && I(this.currentOption, this.listbox, "vertical", "auto"), this.emit("cx-after-show");
    } else {
      this.emit("cx-hide"), this.removeOpenListeners(), await f(this);
      const { keyframes: e, options: t } = v(this, "select.hide", {
        dir: this.localize.dir()
      });
      await b(this.popup.popup, e, t), this.listbox.hidden = !0, this.popup.active = !1, this.emit("cx-after-hide");
    }
  }
  selectOptionByInput() {
    const e = this.getAllOptions();
    for (const t of e)
      if (this.getOptionLabel(t).toLowerCase().startsWith(this.typeToSelectString)) {
        this.setCurrentOption(t);
        break;
      }
  }
  filterOptionsByInput() {
    const e = this.getAllOptions();
    for (const t of e)
      this.filterCallback(t, this.typeToSelectString) ? (t.hidden = !1, t.style.display = "") : (t.hidden = !0, t.style.display = "none");
    this.popup.style.removeProperty("--auto-size-available-width"), this.popup.style.removeProperty("--auto-size-available-height");
  }
  /** Shows the listbox. */
  async show() {
    if (this.open || this.disabled) {
      this.open = !1;
      return;
    }
    return this.open = !0, g(this, "cx-after-show");
  }
  /** Hides the listbox. */
  async hide() {
    if (!this.open || this.disabled) {
      this.open = !1;
      return;
    }
    return this.open = !1, g(this, "cx-after-hide");
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
  setCustomValidity(e) {
    this.valueInput.setCustomValidity(e), this.formControlController.updateValidity();
  }
  /** Sets focus on the control. */
  focus(e) {
    this.displayInput.focus(e);
  }
  /** Removes focus from the control. */
  blur() {
    this.displayInput.blur();
  }
  render() {
    const e = this.hasSlotController.test("label"), t = this.hasSlotController.test("help-text"), o = this.label ? !0 : !!e, l = this.helpText ? !0 : !!t, a = this.clearable && !this.disabled && this.value.length > 0, r = this.placeholder && this.value.length === 0 && this.displayLabel.length === 0;
    return p`
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
                ${this.multiple ? p`<div part="tags" class="select__tags">
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

              ${a ? p`
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
i.styles = [C, k, P];
i.dependencies = {
  "cx-icon": E,
  "cx-popup": V,
  "cx-tag": B
};
s([
  d(".select")
], i.prototype, "popup", 2);
s([
  d(".select__combobox")
], i.prototype, "combobox", 2);
s([
  d(".select__display-input")
], i.prototype, "displayInput", 2);
s([
  d(".select__value-input")
], i.prototype, "valueInput", 2);
s([
  d(".select__listbox")
], i.prototype, "listbox", 2);
s([
  m()
], i.prototype, "hasFocus", 2);
s([
  m()
], i.prototype, "displayLabel", 2);
s([
  m()
], i.prototype, "currentOption", 2);
s([
  m()
], i.prototype, "selectedOptions", 2);
s([
  n()
], i.prototype, "name", 2);
s([
  n({
    converter: {
      fromAttribute: (e) => e.split(" "),
      toAttribute: (e) => e.join(" ")
    }
  })
], i.prototype, "value", 2);
s([
  S()
], i.prototype, "defaultValue", 2);
s([
  n({ reflect: !0 })
], i.prototype, "size", 2);
s([
  n()
], i.prototype, "placeholder", 2);
s([
  n({ attribute: "allow-freetext", reflect: !0, type: Boolean })
], i.prototype, "allowFreetext", 2);
s([
  n({ reflect: !0, type: Boolean })
], i.prototype, "multiple", 2);
s([
  n({ attribute: "max-options-visible", type: Number })
], i.prototype, "maxOptionsVisible", 2);
s([
  n({ reflect: !0, type: Boolean })
], i.prototype, "disabled", 2);
s([
  n({ type: Boolean })
], i.prototype, "clearable", 2);
s([
  n({ reflect: !0, type: Boolean })
], i.prototype, "open", 2);
s([
  n({ type: Boolean })
], i.prototype, "hoist", 2);
s([
  n({ attribute: "free-width", reflect: !0, type: Boolean })
], i.prototype, "freeWidth", 2);
s([
  n({ attribute: "auto-size-padding", type: Number })
], i.prototype, "autosizePadding", 2);
s([
  n({ reflect: !0, type: Boolean })
], i.prototype, "filled", 2);
s([
  n({ reflect: !0, type: Boolean })
], i.prototype, "pill", 2);
s([
  n()
], i.prototype, "label", 2);
s([
  n({ reflect: !0 })
], i.prototype, "placement", 2);
s([
  n({ attribute: "help-text" })
], i.prototype, "helpText", 2);
s([
  n({ reflect: !0 })
], i.prototype, "form", 2);
s([
  n({ reflect: !0, type: Boolean })
], i.prototype, "required", 2);
s([
  n({ attribute: !1 })
], i.prototype, "getTag", 2);
s([
  n({ attribute: "input-behavior" })
], i.prototype, "inputBehavior", 2);
s([
  n({ attribute: !1 })
], i.prototype, "getOptionValue", 2);
s([
  n({ attribute: "stay-open-on-select", type: Boolean })
], i.prototype, "stayOpenOnSelect", 2);
s([
  n({ attribute: "force-on-change", type: Boolean })
], i.prototype, "forceOnChange", 2);
s([
  u("getOptionValue", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleDefaultSlotChange", 1);
s([
  u("disabled", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleDisabledChange", 1);
s([
  u("value", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleValueChange", 1);
s([
  u("open", { waitUntilFirstUpdate: !0 })
], i.prototype, "handleOpenChange", 1);
i = s([
  w("cx-select")
], i);
y("select.show", {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 100, easing: "ease" }
});
y("select.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 }
  ],
  options: { duration: 100, easing: "ease" }
});
export {
  i as default
};
