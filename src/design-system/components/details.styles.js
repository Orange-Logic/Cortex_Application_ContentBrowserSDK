import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const i = e`
  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--cx-color-neutral-200);
    background-color: var(--cx-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--cx-spacing-small) var(--cx-spacing-medium);
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    color: var(--cx-color-neutral);
    font-weight: var(--cx-font-weight-semibold);
  }

  .details__header::-webkit-details-marker {
    display: none;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: calc(1px + var(--cx-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: default;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--cx-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: 0 var(--cx-spacing-medium) var(--cx-spacing-small)
      var(--cx-spacing-medium);
  }
`;
export {
  i as default
};
