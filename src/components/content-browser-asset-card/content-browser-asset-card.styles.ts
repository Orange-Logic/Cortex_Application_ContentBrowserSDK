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

  /*
   * Affordance only, never a second control: pointer-events stay off so the click lands on the card
   * beneath and takes the one path a card click already takes, and the button is aria-hidden and
   * untabbable so the card is still the single thing announced and focused.
   */
  .content-browser-asset-card__cta {
    /*
     * Positioned against the card's base, not the image slot, so the image box has to be described
     * here: inset by the card's own padding and given the same aspect-ratio ::part(image) carries,
     * which lands it exactly on the thumbnail. Without this it covers the title row too and centres
     * the button on the card rather than on the image. Keep the ratio in step with ::part(image).
     */
    position: absolute;
    inset: var(--cx-spacing-x-small);
    bottom: auto;
    aspect-ratio: 246 / 180;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(0 0 0 / 35%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms ease;
  }

  .content-browser-asset-card:hover .content-browser-asset-card__cta,
  .content-browser-asset-card:focus-within .content-browser-asset-card__cta,
  .content-browser-asset-card__cta--busy {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .content-browser-asset-card__cta {
      transition: none;
    }
  }

  .content-browser-asset-card__checkbox {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 1;
  }

  .content-browser-asset-card--disabled {
    cursor: default;
    pointer-events: none;
  }
`;
