import { css } from 'lit';

export default css`
  :host {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  :host([in-cold-storage]) {
    cursor: default;
    pointer-events: none;
  }

  .content-browser-asset-preview {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content-browser-asset-preview__thumbnail {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content-browser-asset-preview__thumbnail--other {
    --text-font-size: var(--cx-font-size-medium);
    --icon-font-size: var(--cx-font-size-x-large);
    --gap: var(--cx-spacing-2x-small);

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap);
    background-color: var(--default-representative-background-color);
    color: var(--default-representative-color);
    font-weight: var(--cx-font-weight-medium);
    font-size: var(--text-font-size);
  }

  .content-browser-asset-preview__thumbnail--other cx-icon {
    font-size: var(--icon-font-size);
  }

  .content-browser-asset-preview__representative {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: contain;
  }

  .content-browser-asset-preview__representative--animated {
    display: none;
  }

  .content-browser-asset-preview__representative-container {
    height: 100%;
    width: 100%;
  }

  .content-browser-asset-preview__representative-container--animated:hover .content-browser-asset-preview__representative {
    display: none;
  }

  .content-browser-asset-preview__representative-container--animated:hover .content-browser-asset-preview__representative--animated {
    display: block;
  }

  .content-browser-asset-preview__representative--horizontal > * {
    width: 100%;
    height: auto;
  }

  .content-browser-asset-preview__representative--vertical > * {
    width: auto;
    height: 100%;
  }

  .content-browser-asset-preview__representative-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: transparent;
    z-index: 1;
  }

  .content-browser-asset-preview__image-skeleton {
    --border-radius: var(--cx-border-radius-medium);

    aspect-ratio: 246/180;
    position: absolute;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
  }

  .content-browser-asset-preview__video-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--cx-color-neutral-0);
    font-size: var(--cx-font-size-x-large);
    background-color: color-mix(
      in srgb,
      var(--cx-color-neutral-1000),
      transparent 60%
    );
    border-radius: var(--cx-border-radius-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    pointer-events: none;
  }

  .content-browser-asset-preview__video-icon[hidden] {
    display: none !important;
  }

  .content-browser-asset-preview__progress-bar {
    --height: 6px;

    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .content-browser-asset-preview__progress-bar::part(indicator) {
    transition: none;
  }
`;
