import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .control-bar {
    padding: 0 var(--cx-spacing-medium);
  }

  .control-bar__left {
    flex: 1;
  }

  .control-bar__search-input {
    width: 100%;
    max-width: 320px;
  }
`;
