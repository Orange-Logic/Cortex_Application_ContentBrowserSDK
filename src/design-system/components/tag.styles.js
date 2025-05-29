import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const o = r`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--cx-color-primary-50);
    border-color: var(--cx-color-primary-300);
    color: var(--cx-color-primary-800);
  }

  .tag--primary:active > cx-icon-button {
    color: var(--cx-color-primary-600);
  }

  .tag--success {
    background-color: var(--cx-color-success-50);
    border-color: var(--cx-color-success-200);
    color: var(--cx-color-success-800);
  }

  .tag--success:active > cx-icon-button {
    color: var(--cx-color-success-600);
  }

  .tag--neutral {
    background-color: var(--cx-color-neutral-50);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral-800);
  }

  .tag--neutral:active > cx-icon-button {
    color: var(--cx-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--cx-color-warning-50);
    border-color: var(--cx-color-warning-200);
    color: var(--cx-color-warning-800);
  }

  .tag--warning:active > cx-icon-button {
    color: var(--cx-color-warning-600);
  }

  .tag--danger {
    background-color: var(--cx-color-danger-50);
    border-color: var(--cx-color-danger-200);
    color: var(--cx-color-danger-800);
  }

  .tag--danger:active > cx-icon-button {
    color: var(--cx-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--cx-button-font-size-small);
    height: calc(var(--cx-input-height-small) * 0.8);
    line-height: calc(
      var(--cx-input-height-small) - var(--cx-input-border-width) * 2
    );
    border-radius: var(--cx-input-border-radius-small);
    padding: 0 var(--cx-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--cx-button-font-size-medium);
    height: calc(var(--cx-input-height-medium) * 0.8);
    line-height: calc(
      var(--cx-input-height-medium) - var(--cx-input-border-width) * 2
    );
    border-radius: var(--cx-input-border-radius-medium);
    padding: 0 var(--cx-spacing-small);
  }

  .tag--large {
    font-size: var(--cx-button-font-size-large);
    height: calc(var(--cx-input-height-large) * 0.8);
    line-height: calc(
      var(--cx-input-height-large) - var(--cx-input-border-width) * 2
    );
    border-radius: var(--cx-input-border-radius-large);
    padding: 0 var(--cx-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--cx-border-radius-pill);
  }
`;
export {
  o as default
};
