import { i as a } from "../chunks/lit-element.DRlPF2me.js";
const o = a`
  :host {
    --width: 31rem;
    --header-spacing: var(--cx-spacing-small) var(--cx-spacing-medium);
    --body-spacing: var(--cx-spacing-large);
    --footer-spacing: var(--cx-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--cx-z-index-dialog);
  }

  .dialog--absolute {
    position: absolute;
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--cx-spacing-2x-large));
    max-height: calc(100% - var(--cx-spacing-2x-large));
    background-color: var(--cx-panel-background-color);
    border-radius: var(--cx-border-radius-medium);
    box-shadow: var(--cx-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
    padding: var(--header-spacing);
  }

  .dialog__header-divider {
    --spacing: 0;
  }

  .dialog__title {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-large);
    margin: 0;
  }

  .dialog__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--cx-spacing-2x-small);
  }

  .dialog__header-actions cx-icon-button,
  .dialog__header-actions ::slotted(cx-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-3x-large);
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-small);
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(cx-button:not(:first-of-type)) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--cx-overlay-background-color);
  }

  .dialog--absolute .dialog__overlay {
    position: absolute;
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--cx-color-neutral-0);
    }
  }
`;
export {
  o as default
};
