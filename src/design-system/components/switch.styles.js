import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const r = o`
  :host {
    display: inline-block;
    --thumb-color: var(--cx-color-neutral-0);
    --thumb-offset: 4px;
    --control-color: var(--cx-color-neutral-300);
  }

  :host([size='small']) {
    --height: var(--cx-toggle-size-small);
    --thumb-size: calc(var(--cx-toggle-size-small) - var(--thumb-offset));
    --width: calc(var(--height) * 1.75);

    font-size: var(--cx-input-font-size-small);
  }

  :host([size='medium']) {
    --height: var(--cx-toggle-size-medium);
    --thumb-size: calc(var(--cx-toggle-size-medium) - var(--thumb-offset));
    --width: calc(var(--height) * 1.6);

    font-size: var(--cx-input-font-size-medium);
  }

  :host([size='large']) {
    --height: var(--cx-toggle-size-large);
    --thumb-size: calc(var(--cx-toggle-size-large) - var(--thumb-offset));
    --width: calc(var(--height) * 1.6);

    font-size: var(--cx-input-font-size-large);
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--cx-input-font-family);
    font-size: inherit;
    font-weight: var(--cx-input-font-weight);
    color: var(--cx-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--control-color);
    border: solid var(--cx-input-border-width) var(--control-color);
    border-radius: var(--height);
    transition:
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-color);
    border-radius: 50%;
    border: solid var(--cx-input-border-width) var(--control-color);
    transition:
      var(--cx-transition-fast) translate ease,
      var(--cx-transition-fast) background-color,
      var(--cx-transition-fast) border-color,
      var(--cx-transition-fast) box-shadow;
    transform: translateX(calc((var(--width) - var(--height)) / -2));
  }
  @supports (translate: 0px) {
    .switch__control .switch__thumb {
      translate: calc((var(--width) - var(--height)) / -2);
      transform: none;
    }
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
    background-color: var(--control-color);
    border-color: var(--control-color);
  }

  .switch:not(.switch--checked):not(.switch--disabled)
    .switch__control:hover
    .switch__thumb {
    background-color: var(--thumb-color);
    border-color: var(--control-color);
  }

  /* Focus */
  .switch:not(.switch--disabled)
    .switch__input:focus-visible
    ~ .switch__control {
    background-color: var(--control-color);
    border-color: var(--control-color);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--thumb-color);
    border-color: var(--cx-color-primary-500);
    transform: translateX(calc((var(--width) - var(--height)) / 2));
  }

  @supports (translate: 0px) {
    .switch--checked .switch__control .switch__thumb {
      translate: calc((var(--width) - var(--height)) / 2);
      transform: none;
    }
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
  }

  .switch.switch--checked:not(.switch--disabled)
    .switch__control:hover
    .switch__thumb {
    background-color: var(--thumb-color);
    border-color: var(--cx-color-primary-500);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled)
    .switch__input:focus-visible
    ~ .switch__control {
    background-color: var(--cx-color-primary-500);
    border-color: var(--cx-color-primary-500);
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  /* Disabled */
  .switch--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .switch__label {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .switch__label::after {
    color: var(--cx-input-required-content-color);
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }

  @media (forced-colors: active) {
    .switch.switch--checked:not(.switch--disabled)
      .switch__control:hover
      .switch__thumb,
    .switch--checked .switch__control .switch__thumb {
      background-color: ButtonText;
    }
  }

  .switch__icon {
    user-select: none;
    font-size: var(--cx-input-font-size-large);
  }

  .switch:not(.switch--checked) .switch__icon {
    color: var(--control-color);
  }

  .switch.switch--checked .switch__icon {
    color: var(--cx-color-primary-500);
  }

  :host([size='small']) .switch__icon {
    font-size: var(--cx-font-size-x-small);
  }

  :host([size='medium']) .switch__icon {
    font-size: var(--cx-font-size-small);
  }

  :host([size='large']) .switch__icon {
    font-size: var(--cx-font-size-medium);
  }
`;
export {
  r as default
};
