import { i as t } from "../chunks/lit-element.DRlPF2me.js";
const n = t`
  :host {
    display: block;
    line-height: normal;
  }

  :host([data-user-invalid])::part(base) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid]:focus-within)::part(base) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    letter-spacing: var(--cx-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) border,
      var(--cx-transition-fast) box-shadow,
      var(--cx-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--cx-input-background-color);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--cx-input-background-color-hover);
    border-color: var(--cx-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--cx-input-background-color-focus);
    border-color: var(--cx-input-border-color-focus);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--cx-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--cx-input-background-color-disabled);
    border-color: var(--cx-input-border-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .input--standard.input--disabled .input__control {
    color: var(--cx-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--cx-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--cx-input-filled-background-color);
    color: var(--cx-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--cx-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--cx-input-filled-background-color-focus);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--cx-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .input__control {
    font: inherit;
    min-width: 0;
    color: var(--cx-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
    line-height: var(--cx-line-height-medium);
  }

  .form-control--has-label .input__control {
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-2x-small);
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--cx-input-height-large)
      var(--cx-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--cx-color-primary-500);
    caret-color: var(--cx-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--cx-input-height-large)
      var(--cx-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--cx-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--cx-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(cx-icon),
  .input__suffix ::slotted(cx-icon) {
    color: var(--cx-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--cx-input-border-radius-small);
    font-size: var(--cx-input-font-size-small);
    min-height: var(--cx-input-height-small);
  }

  .input--small .input__control {
    padding-left: var(--cx-input-spacing-small);
    padding-right: var(--cx-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--cx-spacing-x-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .input--small .input__control--file {
    gap: calc(var(--cx-input-spacing-small) / 2);
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-x-small);
  }

  .input--medium {
    border-radius: var(--cx-input-border-radius-medium);
    font-size: var(--cx-input-font-size-medium);
    min-height: var(--cx-input-height-medium);
  }

  .input--medium .input__control {
    padding-left: var(--cx-input-spacing-medium);
    padding-right: var(--cx-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--cx-spacing-x-small) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .input--medium .input__control--file {
    gap: calc(var(--cx-input-spacing-medium) / 2);
  }

  .input--large {
    border-radius: var(--cx-input-border-radius-large);
    font-size: var(--cx-input-font-size-large);
    min-height: var(--cx-input-height-large);
  }

  .input--large .input__control {
    padding-left: var(--cx-input-spacing-large);
    padding-right: var(--cx-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--cx-input-spacing-small) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--cx-input-spacing-small);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--cx-input-spacing-small);
  }

  .input--large .input__control--file {
    gap: calc(var(--cx-input-spacing-large) / 2);
  }

  .input--button-only {
    padding: 0;
    border: 0;
    align-items: center;
  }

  .input--button-only .input__control--file {
    padding: 0;
    border: 0;
  }

  .input--button-only .input-container {
    display: none;
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--cx-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--cx-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--cx-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
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
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--cx-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='file'] {
    display: none;
  }

  /*
   * Adapt label to be inside input
   */

  .input-container {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    width: 0;
  }

  .form-control__label {
    position: relative;
    -webkit-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;
    pointer-events: none;
    width: fit-content;
    line-height: 1; /* use line-height: 1 for easier transform calculation */
    text-transform: var(--cx-input-label-text-transform, none);
  }

  /* when empty with no placeholder (initial state), transform label to vertical center
    = (input height - label height) / 2
  */
  .form-control--has-label .input--small .form-control__label {
    padding: 0 var(--cx-input-spacing-small);
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

  .form-control--has-label .input--medium .form-control__label {
    padding: 0 var(--cx-input-spacing-medium);
    transform: translateY(
      calc(
        (
            var(--cx-input-height-medium) +
              1rem - var(--cx-input-font-size-medium)
          ) /
          2
      )
    );
    margin: 0;
  }

  .form-control--has-label .input--large .form-control__label {
    padding: 0 var(--cx-input-spacing-large);
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
  .form-control--has-label .input--small,
  .form-control--file .input--small {
    min-height: calc(var(--cx-input-height-small) + 1rem);
  }
  .form-control--has-label .input--medium,
  .form-control--file .input--medium {
    min-height: calc(var(--cx-input-height-medium) + 1rem);
  }
  .form-control--has-label .input--large,
  .form-control--file .input--large {
    min-height: calc(var(--cx-input-height-large) + 1rem);
  }

  /* When focused or not empty, transform label to top
    Instead of 0, use var(--cx-spacing-2x-small) to have a distance from top
  */
  .form-control--has-label .input--focused .form-control__label,
  .form-control--has-label .input--has-placeholder .form-control__label,
  .form-control--has-label .input:not(.input--empty) .form-control__label {
    transform: translateY(
      calc(var(--cx-spacing-2x-small) + var(--cx-spacing-3x-small))
    ); /* distance from top */
  }

  .input__control--file {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-block: 0;
    text-align: start !important;
    width: 100%;
    height: 100%;
  }

  .input__control--file span {
    flex: 1 1 auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
    .input {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-cx-input-group__input--inner]) .input {
    border-radius: 0;
  }

  :host(
      [data-cx-input-group__input--last]:not(
          [data-cx-input-group__input--first]
        )
    )
    .input {
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
  n as default
};
