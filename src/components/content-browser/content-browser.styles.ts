import { css } from 'lit';

export default css`
  :host {
    --cx-button-text-transform: none;
    --default-representative-background-color: #6cdaf3;
    --default-representative-color: #377a86;

    color: var(--cx-color-neutral);
    font-family: var(--cx-font-sans);
    font-synthesis-weight: auto;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    height: var(--content-browser-height, 100dvh);
    width: 100%;
    position: relative;
  }

  .content-browser__content {
    flex: 1;
    height: 100%;
  }

  .content-browser__progress-bar {
    position: absolute;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .content-browser__progress-bar cx-progress-bar {
    --height: 4px;
  }

  .content-browser__message {
    width: 100%;
    height: 100%;
  }
`;
