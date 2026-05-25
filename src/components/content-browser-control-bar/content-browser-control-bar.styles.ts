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
    max-width: 300px;
    min-width: 160px;
    flex: 1;
  }

  .control-bar__right {
    margin-left: auto;
  }
`;
