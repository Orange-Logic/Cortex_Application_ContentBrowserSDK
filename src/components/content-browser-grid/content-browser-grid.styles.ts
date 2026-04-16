import { css } from 'lit';

export default css`
  :host {
    display: block;
    flex: 1;
  }

  .content-browser-grid {
    height: 100%;
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
