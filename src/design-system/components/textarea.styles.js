import { i as a } from "../chunks/lit-element.DRlPF2me.js";
const r = a`
  :host {
    display: block;
  }

  :host([data-user-invalid])::part(base) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid]:focus-within)::part(base) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  .textarea {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-input-letter-spacing);
    vertical-align: middle;
    transition:
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) border,
      var(--cx-transition-fast) box-shadow,
      var(--cx-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--cx-input-background-color);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--cx-input-background-color-hover);
    border-color: var(--cx-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--cx-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--cx-input-background-color-focus);
    border-color: var(--cx-input-border-color-focus);
    color: var(--cx-input-color-focus);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled)
    .textarea__control {
    color: var(--cx-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--cx-input-background-color-disabled);
    border-color: var(--cx-input-border-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--cx-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--cx-input-placeholder-color-disabled);
  }

  /* Filled textareas */
  .textarea--filled {
    border: none;
    background-color: var(--cx-input-filled-background-color);
    color: var(--cx-input-color);
  }

  .textarea--filled:hover:not(.textarea--disabled) {
    background-color: var(--cx-input-filled-background-color-hover);
  }

  .textarea--filled.textarea--focused:not(.textarea--disabled) {
    background-color: var(--cx-input-filled-background-color-focus);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .textarea--filled.textarea--disabled {
    background-color: var(--cx-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: default;
  }

  .textarea__control {
    flex: 1 1 auto;
    font: inherit;
    line-height: 1.4;
    color: var(--cx-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
    line-height: var(--cx-line-height-medium);
    padding-top: var(--cx-spacing-x-small);
  }

  .form-control--has-label .textarea__control {
    padding-bottom: var(--cx-spacing-2x-small);
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--cx-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Size modifiers
   */

  .textarea--small {
    border-radius: var(--cx-input-border-radius-small);
    font-size: var(--cx-input-font-size-small);
  }

  .textarea--small .textarea-container {
    padding-left: var(--cx-input-spacing-small);
    padding-right: var(--cx-input-spacing-small);
  }

  .textarea--medium {
    border-radius: var(--cx-input-border-radius-medium);
    font-size: var(--cx-input-font-size-medium);
  }

  .textarea--medium .textarea-container {
    padding-left: var(--cx-input-spacing-medium);
    padding-right: var(--cx-input-spacing-medium);
  }

  .textarea--large {
    border-radius: var(--cx-input-border-radius-large);
    font-size: var(--cx-input-font-size-large);
  }

  .textarea--large .textarea-container {
    padding-left: var(--cx-input-spacing-large);
    padding-right: var(--cx-input-spacing-large);
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }

  /*
   * Adapt label to be inside textarea
   */

  .textarea-container {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  /* set label's position to absolute */
  .form-control__label {
    position: relative;
    -webkit-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;
    pointer-events: none;
    width: fit-content;
    line-height: 1; /* use line-height: 1 for easier transform calculation */
  }

  .form-control--has-label .textarea--small .form-control__label {
    font-size: var(--cx-input-font-size-small);
    margin: 0;
  }

  .form-control--has-label .textarea--medium .form-control__label {
    font-size: var(--cx-input-font-size-medium);
    margin: 0;
  }

  .form-control--has-label .textarea--large .form-control__label {
    font-size: var(--cx-input-font-size-large);
    margin: 0;
  }

  /* when empty with no placeholder (initial state), transform label to vertical center
    = (input height - label height) / 2
  */
  .textarea--small .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-small) +
              1.25rem - var(--cx-input-font-size-small)
          ) /
          2
      )
    );
  }

  .textarea--medium .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-medium) +
              1rem - var(--cx-input-font-size-medium)
          ) /
          2
      )
    );
  }

  .textarea--large .form-control__label {
    transform: translateY(
      calc(
        (
            var(--cx-input-height-large) +
              1rem - var(--cx-input-font-size-large)
          ) /
          2
      )
    );
  }

  /* When focused or not empty, transform label to top
    Instead of 0, use var(--cx-spacing-2x-small) to have a distance from top
  */
  .form-control--has-label .textarea--focused .form-control__label,
  .form-control--has-label .textarea--placeholder-visible .form-control__label,
  .form-control--has-label
    .textarea:not(.textarea--empty)
    .form-control__label {
    transform: translateY(
      calc(var(--cx-spacing-2x-small) + var(--cx-spacing-3x-small))
    ); /* distance from top */
  }
`;
export {
  r as default
};
