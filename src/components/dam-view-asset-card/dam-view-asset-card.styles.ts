import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .dam-view-asset-card {
    --border-width: 0px;
    --padding: var(--cx-spacing-x-small);

    cursor: pointer;
    height: 100%;
    width: 100%;
    isolation: isolate;
  }

  .dam-view-asset-card::part(base) {
    overflow: hidden;
  }

  .dam-view-asset-card::part(image) {
    aspect-ratio: 246 / 180;
  }

  .dam-view-asset-card__name {
    max-width: 100%;
  }

  .dam-view-asset-card__placeholder {
    visibility: hidden;
    opacity: 0;
  }

  .dam-view-asset-card__info * {
    line-height: var(--cx-line-height-small);
  }

  .dam-view-asset-card__checkbox {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 1;
  }
`;
