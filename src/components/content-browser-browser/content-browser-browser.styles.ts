import { css } from 'lit';

export default css`
  :host {
    display: contents;
  }

  .drawer-trigger {
    display: block;
    padding: var(--cx-spacing-medium);
    position: absolute;
    top: 0;
    left: 0;
  }

  .drawer-trigger--hidden {
    display: none;
  }

  .content-browser-browser::part(base) {
    z-index: var(--cx-z-index-dialog);
  }

  .content-browser-browser::part(body) {
    padding: 0;
  }

  cx-space {
    height: 100%;
    width: 100%;
  }

  .browser__folders {
    color: var(--cx-color-neutral);
    width: 100%;
    flex: 1;
    padding: var(--cx-spacing-small);
    min-height: 0;
  }

  .browser__collections {
    display: flex;
    flex-direction: column;
    max-height: 50%;
    min-height: 0;
    width: 100%;
    border: solid 1px var(--cx-color-neutral-200);
    border-radius: var(--cx-border-radius-small);
    overflow: hidden;
  }

  .browser__collections-summary {
    display: flex;
    align-items: center;
    flex: none;
    padding: var(--cx-spacing-small);
    color: var(--cx-color-neutral);
    font-weight: var(--cx-font-weight-semibold);
    cursor: pointer;
    user-select: none;
  }

  .browser__collections-summary:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: calc(-1 * var(--cx-focus-ring-offset));
  }

  .browser__collections-summary cx-typography {
    flex: auto;
  }

  .browser__collections-summary-icon {
    flex: none;
    transition: rotate var(--cx-transition-medium) ease;
  }

  .browser__collections--open .browser__collections-summary-icon {
    rotate: 90deg;
  }

  .browser__collections-content {
    display: none;
    min-height: 0;
    overflow-y: auto;
    padding: 0 var(--cx-spacing-small) var(--cx-spacing-small);
  }

  .browser__collections--open .browser__collections-content {
    display: block;
  }
`;
