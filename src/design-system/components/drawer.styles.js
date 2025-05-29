import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const t = e`
  :host {
    --size: 25rem;
    --header-spacing: var(--cx-spacing-large);
    --body-spacing: var(--cx-spacing-large);
    --footer-spacing: var(--cx-spacing-large);
    --font-family: var(--cx-font-sans);

    display: contents;
  }

  .drawer {
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .drawer--contained {
    position: absolute;
    z-index: initial;
  }

  .drawer--fixed {
    position: fixed;
    z-index: var(--cx-z-index-drawer);
  }

  .drawer__panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 2;
    max-width: 100%;
    max-height: 100%;
    background-color: var(--cx-panel-background-color);
    box-shadow: var(--cx-shadow-large);
    overflow: auto;
    pointer-events: all;
  }

  .drawer__panel:focus {
    outline: none;
  }

  .drawer--top .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--end .drawer__panel {
    top: 0;
    inset-inline-end: 0;
    bottom: auto;
    inset-inline-start: auto;
    width: var(--size);
    height: 100%;
  }

  .drawer--bottom .drawer__panel {
    top: auto;
    inset-inline-end: auto;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--start .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: var(--size);
    height: 100%;
  }

  .drawer__header {
    display: flex;
    gap: var(--cx-spacing-small);
    padding: var(--header-spacing);
    border-bottom: solid 1px var(--cx-input-border-color);
    font-family: var(--font-family);
  }

  .drawer__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-semibold);
    line-height: var(--cx-line-height-medium);
    margin: 0;
    display: flex;
    align-items: center;
  }

  .drawer__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--cx-spacing-2x-small);
  }

  .drawer__header-actions cx-icon-button,
  .drawer__header-actions ::slotted(cx-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--cx-font-size-medium);
  }

  .drawer__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    font-family: var(--font-family);
  }

  .drawer__footer {
    text-align: right;
    padding: var(--footer-spacing);
    font-family: var(--font-family);
  }

  .drawer__footer ::slotted(cx-button:not(:last-of-type)) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .drawer:not(.drawer--has-footer) .drawer__footer {
    display: none;
  }

  .drawer__overlay {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--cx-overlay-background-color);
    pointer-events: all;
  }

  .drawer--contained .drawer__overlay {
    opacity: 0;
    position: absolute;
  }

  @media (forced-colors: active) {
    .drawer__panel {
      border: solid 1px var(--cx-color-neutral-0);
    }
  }
`;
export {
  t as default
};
