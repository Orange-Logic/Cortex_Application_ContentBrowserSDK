import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const t = o`
  :host {
    --error-color: var(--cx-color-danger-600);
    --success-color: var(--cx-color-success-600);

    display: inline-block;
  }

  /* make icon slots overlapped each other using grid */
  .copy-button__button {
    display: inline-grid;
    grid-template-columns: 1fr;
    background: none;
    border: none;
    border-radius: var(--cx-border-radius-small);
    font-size: inherit;
    color: inherit;
    padding: var(--cx-spacing-x-small);
    cursor: pointer;
    transition: var(--cx-transition-x-fast) color;
  }

  .copy-button__button slot {
    grid-row-start: 1;
    grid-column-start: 1;
  }

  .copy-button--success .copy-button__button {
    color: var(--success-color);
  }

  .copy-button--error .copy-button__button {
    color: var(--error-color);
  }

  .copy-button__button:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: default !important;
  }

  slot {
    display: inline-flex;
  }
`;
export {
  t as default
};
