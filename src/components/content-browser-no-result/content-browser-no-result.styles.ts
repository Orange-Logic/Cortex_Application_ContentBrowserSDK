import { css } from 'lit';

export default css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .content-browser-no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--cx-spacing-medium);
    color: var(--cx-color-neutral);
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .content-browser-no-result cx-icon {
    font-size: 96px;
  }
`;
