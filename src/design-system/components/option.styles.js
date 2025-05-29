import { i } from "../chunks/lit-element.DRlPF2me.js";
const e = i`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-letter-spacing-normal);
    color: var(--cx-color-neutral-700);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium)
      var(--cx-spacing-x-small) var(--cx-spacing-x-small);
    transition: var(--cx-transition-fast) fill;
    cursor: pointer;
  }

  .option:not(.option--show-check) {
    padding-inline: var(--cx-spacing-small);
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--cx-menu-item-background-color-hover);
  }

  .option--current,
  .option--current.option--disabled {
    color: var(--cx-color-primary);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: default;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--cx-line-height-medium);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--cx-spacing-2x-small);
    display: none;
  }

  .option--show-check .option__check {
    display: block;
  }

  .option--show-check.option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;
export {
  e as default
};
