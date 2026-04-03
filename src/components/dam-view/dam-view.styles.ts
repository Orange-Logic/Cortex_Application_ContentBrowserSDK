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
    height: var(--dam-view-height, 100dvh);
    width: 100%;
    position: relative;
  }

  .dam-view__content {
    flex: 1;
    height: 100%;
  }

  .dam-view__progress-bar {
    position: absolute;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .dam-view__progress-bar cx-progress-bar {
    --height: 4px;
  }

  .dam-view__message {
    width: 100%;
    height: 100%;
  }

  .dam-view__message__icon {
    font-size: var(--cx-font-size-4x-large);
  }

  .dam-view__message__text {
    --font-size: var(--cx-font-size-2x-large);
  }
`;
