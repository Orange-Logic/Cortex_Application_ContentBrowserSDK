import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
  }

  .content-browser-asset-version-history {
    --checked-icon-display: none;

    min-height: 124px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content-browser-asset-version-history__menu {
    --cx-menu-item-background-color-hover: transparent;

    border: none;
    border-radius: 0;
    width: 100%;
  }

  .content-browser-asset-version-history__menu-item cx-line-clamp {
    max-width: 100%;
  }

  .content-browser-asset-version-history__menu-item::part(base) {
    cursor: auto;
  }

  .content-browser-asset-version-history__menu-item__grid-item::part(base) {
    height: 100%;
  }

  .content-browser-asset-version-history__menu-item__number {
    display: flex;
    width: 54px;
    height: 24px;
    padding: 0px var(--cx-spacing-x-small);
    justify-content: center;
    align-items: center;
    border-radius: var(--cx-border-radius-pill);
    background: var(--cx-color-neutral-100);
  }

  .content-browser-asset-version-history__menu-item__name::part(base) {
    font-weight: var(--cx-font-weight-bold);
  }

  .content-browser-asset-version-history__menu-item__latest {
    margin-left: var(--cx-spacing-x-small);
  }

  .content-browser-asset-version-history__menu-item__latest::before {
    content: '•';
    margin-right: var(--cx-spacing-x-small);
  }

  cx-space {
    width: auto;
  }

  cx-grid {
    width: 100%;
  }

  cx-spinner {
    --track-width: 0.2rem;

    font-size: var(--cx-font-size-3x-large);
  }
`;
