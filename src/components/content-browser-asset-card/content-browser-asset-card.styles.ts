import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .content-browser-asset-card {
    --border-width: 0px;
    --padding: var(--cx-spacing-x-small);

    cursor: pointer;
    height: 100%;
    width: 100%;
    isolation: isolate;
  }

  .content-browser-asset-card::part(base) {
    overflow: hidden;
  }

  .content-browser-asset-card::part(image) {
    aspect-ratio: 246 / 180;
  }

  .content-browser-asset-card__name {
    max-width: 100%;
  }

  .content-browser-asset-card__placeholder {
    visibility: hidden;
    opacity: 0;
  }

  .content-browser-asset-card__info * {
    line-height: var(--cx-line-height-small);
  }

  .content-browser-asset-card__checkbox {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 1;
  }
`;
