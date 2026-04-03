import { css } from 'lit';

export default css`
  :host {
    display: block;
    flex: 1;
  }

  .dam-view-grid {
    height: 100%;
  }

  .dam-view-grid-loading {
    position: absolute;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .dam-view-grid-loading cx-progress-bar {
    --height: 4px;
  }
`;
