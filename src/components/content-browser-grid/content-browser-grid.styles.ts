import { css } from 'lit';

export default css`
  :host {
    display: block;
    flex: 1;
    min-height: 0;
  }

  .content-browser-grid {
    height: 100%;
    position: relative;
  }

  .content-browser-grid__page-error {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--cx-spacing-small, 8px);
    padding: var(--cx-spacing-small, 8px);
    border-top: 1px solid var(--cx-color-neutral-200, #e5e5e5);
    background-color: var(--cx-color-neutral-0, #fff);
    color: var(--cx-color-neutral);
  }

  .content-browser-grid-loading {
    position: absolute;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .content-browser-grid-loading cx-progress-bar {
    --height: 4px;
  }
`;
