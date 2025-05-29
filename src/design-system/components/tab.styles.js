import { i as a } from "../chunks/lit-element.DRlPF2me.js";
const t = a`
  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-regular);
    border-radius: var(--cx-border-radius-small);
    color: var(--cx-color-neutral-700);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition:
      var(--transition-speed) box-shadow,
      var(--transition-speed) color;
  }

  .tab:hover:not(.tab--disabled) {
    color: var(--cx-color-primary-600);
  }

  :host(:focus) {
    outline: transparent;
  }

  :host(:focus-visible):not([disabled]) {
    color: var(--cx-color-primary-600);
  }

  :host(:focus-visible) {
    outline: var(--cx-focus-ring);
    outline-offset: calc(
      -1 * var(--cx-focus-ring-width) - var(--cx-focus-ring-offset)
    );
  }

  .tab.tab--active:not(.tab--disabled) {
    color: var(--cx-color-primary-600);
  }

  .tab.tab--closable {
    padding-inline-end: var(--cx-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .tab__close-button {
    font-size: var(--cx-font-size-small);
    margin-inline-start: var(--cx-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--cx-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`;
export {
  t as default
};
