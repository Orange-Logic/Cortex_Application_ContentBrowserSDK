import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const l = e`
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
    font-size: var(--cx-input-font-size-medium);
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
    font-size: var(--cx-input-font-size-large);
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
export {
  l as default
};
