import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const o = r`
  :host {
    --border-color: var(--cx-color-neutral-200);
    --border-radius: var(--cx-border-radius-x-large);
    --box-shadow: var(--cx-shadow-x-small);
    --image-border-radius: var(--cx-border-radius-x-large);
    --border-width: 1px;
    --padding: var(--cx-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--cx-panel-background-color);
    box-shadow: var(--box-shadow);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
    padding: var(--padding);
  }

  .card--interactive {
    --border-color: var(--cx-color-primary-300);
    box-shadow: none;
    cursor: pointer;
  }

  .card--interactive:hover {
    box-shadow: var(--cx-shadow-medium);
  }

  .card__image {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--cx-color-neutral-100);
    border-radius: var(--image-border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
    margin-bottom: var(--padding);
  }

  .card__image::slotted(img) {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--header-border-width, var(--border-width))
      var(--border-color);
    padding-bottom: var(--padding);
    margin-bottom: var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card__title {
    display: block;
    font-size: var(--cx-font-size-large);
    font-weight: var(--cx-font-weight-bold);
  }

  .card__body {
    display: block;
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding-top: var(--padding);
    margin-top: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`;
export {
  o as default
};
