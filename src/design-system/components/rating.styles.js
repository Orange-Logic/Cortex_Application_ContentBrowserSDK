import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const o = r`
  :host {
    --symbol-color: var(--cx-color-neutral-300);
    --symbol-color-active: var(--cx-color-warning-500);
    --symbol-size: 1.2rem;
    --symbol-container-size: 40px;
    --symbol-spacing: var(--cx-spacing-3x-small);

    display: inline-flex;
  }

  :host([variant='outlined']) {
    --symbol-size: var(--cx-font-size-x-large);
    --symbol-color: var(--cx-color-neutral-600);
    --symbol-color-active: var(--cx-color-neutral-600);
  }

  .rating {
    position: relative;
    display: inline-flex;
    border-radius: var(--cx-border-radius-small);
    vertical-align: middle;
  }

  .rating:focus {
    outline: none;
  }

  .rating:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .rating__symbols {
    display: inline-flex;
    position: relative;
    line-height: 0;
    color: var(--symbol-color);
    white-space: nowrap;
    cursor: pointer;
  }

  .rating__symbols > * {
    padding: var(--symbol-spacing);
  }

  .rating__symbol--active,
  .rating__partial--filled {
    color: var(--symbol-color-active);
  }

  .rating__partial-symbol-container {
    position: relative;
  }

  .rating__partial--filled {
    position: absolute;
    top: var(--symbol-spacing);
    left: var(--symbol-spacing);
  }

  .rating__symbol {
    transition: var(--cx-transition-fast) scale;
    pointer-events: none;
  }

  .rating__symbol cx-icon {
    --font-size: var(--symbol-size);
  }

  .rating__symbol--hover {
    scale: 1.2;
  }

  .rating--disabled .rating__symbols,
  .rating--readonly .rating__symbols {
    cursor: default;
  }

  .rating--disabled .rating__symbol--hover,
  .rating--readonly .rating__symbol--hover {
    scale: none;
  }

  .rating--disabled {
    opacity: 0.5;
  }

  .rating--disabled .rating__symbols {
    cursor: default;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    .rating__symbol--active {
      color: SelectedItem;
    }
  }

  /** Outlined */
  .rating--outlined .rating__symbol {
    border: var(--cx-input-border-width) solid var(--cx-input-border-color);
    width: var(--symbol-container-size);
    height: var(--symbol-container-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rating--outlined .rating__partial--filled {
    top: unset;
    left: unset;
  }

  .rating--outlined .rating__symbol:not(:first-child) {
    border-left: none;
  }

  .rating--outlined .rating__symbol:first-child {
    border-top-left-radius: var(--cx-border-radius-small);
    border-bottom-left-radius: var(--cx-border-radius-small);
  }

  .rating--outlined .rating__symbol:last-child {
    border-top-right-radius: var(--cx-border-radius-small);
    border-bottom-right-radius: var(--cx-border-radius-small);
  }

  .rating--outlined .rating__symbol--hover {
    scale: 1;
  }
`;
export {
  o as default
};
