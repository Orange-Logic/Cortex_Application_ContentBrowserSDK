import { i as t } from "../chunks/lit-element.DRlPF2me.js";
const r = t`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
    line-height: normal;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--cx-input-border-width);
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-font-weight-regular);
    text-decoration: none;
    text-transform: var(--cx-button-text-transform, none);
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--cx-transition-x-fast) background-color,
      var(--cx-transition-x-fast) color,
      var(--cx-transition-x-fast) border,
      var(--cx-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .button__label::slotted(cx-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--cx-color-neutral-100);
    border-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .button--standard.button--default:hover:not(.button--disabled),
  .button--standard.button--default.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-neutral-200);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--cx-color-neutral-300);
    border-color: var(--cx-color-neutral-300);
    color: var(--cx-color-neutral);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--cx-color-primary-600);
    border-color: var(--cx-color-primary-600);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled),
  .button--standard.button--primary.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--cx-color-primary-700);
    border-color: var(--cx-color-primary-700);
    color: var(--cx-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--cx-color-success-600);
    border-color: var(--cx-color-success-600);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled),
  .button--standard.button--success.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-success-500);
    border-color: var(--cx-color-success-500);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--cx-color-success-700);
    border-color: var(--cx-color-success-700);
    color: var(--cx-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--cx-color-warning-600);
    border-color: var(--cx-color-warning-600);
    color: var(--cx-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled),
  .button--standard.button--warning.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-warning-500);
    border-color: var(--cx-color-warning-500);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--cx-color-warning-700);
    border-color: var(--cx-color-warning-700);
    color: var(--cx-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--cx-color-danger-600);
    border-color: var(--cx-color-danger-600);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled),
  .button--standard.button--danger.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-danger-500);
    border-color: var(--cx-color-danger-500);
    color: var(--cx-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--cx-color-danger-700);
    border-color: var(--cx-color-danger-700);
    color: var(--cx-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid var(--cx-input-border-width);
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--cx-input-border-color);
    color: var(--cx-color-neutral);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--focused:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--cx-color-neutral-300);
    background-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--cx-color-neutral-300);
    background-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--cx-color-primary-600);
    color: var(--cx-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--focused:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--cx-color-primary-500);
    color: var(--cx-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--cx-color-primary-700);
    background-color: var(--cx-color-primary-700);
    color: var(--cx-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--cx-color-success-600);
    color: var(--cx-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--focused:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--cx-color-success-500);
    color: var(--cx-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--cx-color-success-600);
    background-color: var(--cx-color-success-600);
    color: var(--cx-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--cx-color-warning-600);
    color: var(--cx-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--focused:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--cx-color-warning-500);
    color: var(--cx-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--cx-color-warning-700);
    background-color: var(--cx-color-warning-700);
    color: var(--cx-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--cx-color-danger-600);
    color: var(--cx-color-danger);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--focused:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--cx-color-danger-500);
    color: var(--cx-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--cx-color-danger-700);
    background-color: var(--cx-color-danger-700);
    color: var(--cx-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .button--text:hover:not(.button--disabled),
  .button--text.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-neutral-100);
    border-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--cx-color-neutral-800);
  }

  .button--text:active:not(.button--disabled) {
    background-color: var(--cx-color-neutral-200);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral);
  }

  /*
   * Tertiary buttons
   */

  .button--tertiary {
    background-color: transparent;
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .button--tertiary:hover:not(.button--disabled),
  .button--tertiary.button--focused:not(.button--disabled) {
    background-color: var(--cx-color-neutral-100);
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .button--tertiary:focus-visible:not(.button--disabled) {
    background-color: var(--cx-color-neutral-200);
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  .button--tertiary:active:not(.button--disabled) {
    background-color: var(--cx-color-neutral-300);
    border-color: transparent;
    color: var(--cx-color-neutral);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--cx-input-height-small);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-small);
  }

  .button--small ::slotted(cx-icon) {
    --font-size: var(--cx-font-size-medium);
  }

  .button--medium {
    height: auto;
    min-height: var(--cx-input-height-medium);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--cx-input-height-large);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-large);
  }

  .button--x-large {
    height: auto;
    min-height: var(--cx-input-height-x-large);
    font-size: var(--cx-button-font-size-medium);
    border-radius: var(--cx-button-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--cx-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--cx-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--cx-input-height-large);
  }

  .button--pill.button--x-large {
    border-radius: var(--cx-input-height-x-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--cx-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--cx-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--cx-input-height-large);
    border-radius: 50%;
  }

  .button--circle.button--x-large {
    width: var(--cx-input-height-x-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */
  .button--caret .button__caret {
    --font-size: var(--cx-font-size-large);
    margin-block: auto;
  }

  .button--caret.button--small .button__caret {
    --font-size: var(--cx-font-size-medium);
  }

  .button--caret .button__suffix {
    display: none;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading cx-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(cx-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(cx-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--cx-spacing-x-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--cx-spacing-small);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--cx-spacing-medium);
  }

  .button--has-label.button--x-large .button__label {
    padding: 0 var(--cx-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--cx-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--cx-spacing-x-small);
  }

  .button--has-prefix.button--x-large {
    padding-inline-start: var(--cx-spacing-medium);
  }

  .button--has-prefix.button--x-large .button__label {
    padding-inline-start: var(--cx-spacing-medium);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--cx-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--cx-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--cx-spacing-x-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--cx-spacing-x-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--cx-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--cx-spacing-x-small);
  }

  .button--has-suffix.button--x-large,
  .button--caret.button--x-large {
    padding-inline-end: var(--cx-spacing-medium);
  }

  .button--has-suffix.button--x-large .button__label,
  .button--caret.button--x-large .button__label {
    padding-inline-end: var(--cx-spacing-medium);
  }

  .button--caret cx-icon::part(span) {
    height: auto;
  }
  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host(
      [data-cx-button-group__button--first]:not(
          [data-cx-button-group__button--last]
        )
    )
    .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-cx-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host(
      [data-cx-button-group__button--last]:not(
          [data-cx-button-group__button--first]
        )
    )
    .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host(
    [data-cx-button-group__button]:not([data-cx-button-group__button--first])
  ) {
    margin-inline-start: calc(-1 * var(--cx-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-cx-button-group__button]:not(
          [data-cx-button-group__button--first],
          [data-cx-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-cx-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-cx-button-group__button--focus]),
  :host([data-cx-button-group__button][checked]) {
    z-index: 2;
  }
`;
export {
  r as default
};
