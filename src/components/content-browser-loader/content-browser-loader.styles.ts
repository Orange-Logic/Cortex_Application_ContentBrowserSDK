import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .content-browser-loader {
    width: 100%;
    height: 100%;
  }

  .content-browser-loader__spinner {
    --track-width: 0.2rem;
    font-size: var(--cx-font-size-3x-large);
  }
`;