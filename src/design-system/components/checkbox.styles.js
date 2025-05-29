import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const c = o`
  :host {
    display: inline-block;
  }

  :host([data-user-invalid])::part(control) {
    border-color: var(--cx-input-invalid-border-color);
  }

  :host([data-user-invalid])::part(label) {
    color: var(--cx-input-invalid-color);
  }

  :host([data-user-invalid])::part(control) {
    outline: none;
  }

  :host(:focus-within[data-user-invalid])::part(control) {
    border-color: var(--cx-input-invalid-border-color);
    box-shadow: var(--cx-input-invalid-shadow);
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--cx-input-font-family);
    font-weight: var(--cx-input-font-weight);
    color: var(--cx-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--cx-toggle-size-small);
    font-size: var(--cx-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--cx-toggle-size-medium);
    font-size: var(--cx-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--cx-toggle-size-large);
    font-size: var(--cx-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
    border-radius: var(--cx-border-radius-small);
    background-color: var(--cx-input-background-color);
    color: var(--cx-color-neutral-0);
    transition:
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) background-color,
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled)
    .checkbox__control:hover {
    border-color: var(--cx-input-border-color-hover);
    background-color: var(--cx-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled)
    .checkbox__input:focus-visible
    ~ .checkbox__control {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--cx-color-primary-600);
    background-color: var(--cx-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled)
    .checkbox__control:hover {
    border-color: var(--cx-color-primary-500);
    background-color: var(--cx-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled)
    .checkbox__input:focus-visible
    ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled)
    .checkbox__input:focus-visible
    ~ .checkbox__control {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--cx-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
    text-transform: var(--cx-checkbox-label-text-transform, none);
  }

  :host([required]) .checkbox__label::after {
    color: var(--cx-input-required-content-color);
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }
`;
export {
  c as default
};
