import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const i = o`
  :host {
    display: block;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio {
    display: inline-flex;
    align-items: top;
    font-family: var(--cx-input-font-family);
    font-size: var(--cx-input-font-size-medium);
    font-weight: var(--cx-input-font-weight);
    color: var(--cx-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .radio--small {
    --toggle-size: var(--cx-toggle-size-small);
    font-size: var(--cx-input-font-size-small);
  }

  .radio--medium {
    --toggle-size: var(--cx-toggle-size-medium);
    font-size: var(--cx-input-font-size-medium);
  }

  .radio--large {
    --toggle-size: var(--cx-toggle-size-large);
    font-size: var(--cx-input-font-size-large);
  }

  .radio__checked-icon {
    display: inline-flex;
  }

  .radio__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--cx-input-border-width) var(--cx-input-border-color);
    border-radius: 50%;
    background-color: var(--cx-input-background-color);
    color: transparent;
    transition:
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) background-color,
      var(--cx-transition-fast) color,
      var(--cx-transition-fast) box-shadow;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
    border-color: var(--cx-input-border-color-hover);
    background-color: var(--cx-input-background-color-hover);
  }

  /* Checked */
  .radio--checked .radio__control {
    color: var(--cx-color-primary-600);
    border-color: var(--cx-color-primary-600);
    background-color: var(--cx-color-neutral-0);
  }

  /* Checked + hover */
  .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
    border-color: var(--cx-color-primary-500);
    background-color: var(--cx-color-neutral-0);
  }

  /* Checked + focus */
  :host(:focus-visible) .radio__control {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .radio__control.radio__control--hidden {
    display: none;
  }

  /* Disabled */
  .radio--disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
  .radio:not(.radio--checked) svg circle {
    opacity: 0;
  }

  .radio__label {
    display: inline-block;
    color: var(--cx-input-label-color);
    flex: 1;
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
    text-transform: var(--cx-radio-label-text-transform, none);
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
export {
  i as default
};
