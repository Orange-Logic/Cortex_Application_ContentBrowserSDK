import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const e = r`
  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-top-width: calc(var(--cx-panel-border-width) * 3);
    border-radius: var(--cx-border-radius-small);
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-regular);
    line-height: 1.6;
    color: var(--cx-color-neutral-700);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-large);
    padding-inline-start: var(--cx-spacing-large);
  }

  .alert--has-countdown {
    border-bottom: none;
  }

  .alert--primary {
    border-top-color: var(--cx-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--cx-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--cx-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--cx-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--cx-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--cx-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--cx-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--cx-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--cx-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--cx-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--cx-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-medium);
    padding-inline-end: var(--cx-spacing-medium);
  }

  .alert__countdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--cx-panel-border-width) * 3);
    background-color: var(--cx-panel-border-color);
    display: flex;
  }
  .alert__countdown--ltr {
    justify-content: flex-end;
  }
  .alert__countdown .alert__countdown-elapsed {
    height: 100%;
    width: 0;
  }
  .alert--primary .alert__countdown-elapsed {
    background-color: var(--cx-color-primary-600);
  }
  .alert--success .alert__countdown-elapsed {
    background-color: var(--cx-color-success-600);
  }
  .alert--neutral .alert__countdown-elapsed {
    background-color: var(--cx-color-neutral-600);
  }
  .alert--warning .alert__countdown-elapsed {
    background-color: var(--cx-color-warning-600);
  }
  .alert--danger .alert__countdown-elapsed {
    background-color: var(--cx-color-danger-600);
  }
  .alert__timer {
    display: none;
  }
`;
export {
  e as default
};
