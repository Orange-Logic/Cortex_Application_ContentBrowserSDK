import { i as t } from "../chunks/lit-element.DRlPF2me.js";
const n = t`
  :host {
    display: inline-block;
    color: var(--cx-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--cx-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--cx-spacing-x-small);
    cursor: pointer;
    transition: var(--cx-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .icon-button:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
    margin: auto;
  }

  .icon-button--small {
    font-size: var(--cx-font-size-x-small);
    padding: var(--cx-spacing-2x-small);
    min-height: var(--cx-input-height-small);
    min-width: var(--cx-input-height-small);
  }

  .icon-button--medium {
    font-size: var(--cx-font-size-large);
    padding: var(--cx-spacing-2x-small);
    min-height: var(--cx-input-height-medium);
    min-width: var(--cx-input-height-medium);
  }

  .icon-button--large {
    font-size: var(--cx-font-size-large);
    padding: var(--cx-spacing-x-small);
    min-height: var(--cx-input-height-large);
    min-width: var(--cx-input-width-large);
  }

  .icon-button--x-large {
    font-size: var(--cx-font-size-large);
    padding: var(--cx-spacing-small);
    min-height: var(--cx-input-height-x-large);
    min-width: var(--cx-input-height-x-large);
  }

  .icon-button--outline {
    border: solid var(--cx-input-border-width);
    border-color: var(--cx-input-border-color);
  }

  .icon-button--outline:hover:not(.icon-button--disabled) {
    background-color: var(--cx-color-neutral-100);
  }

  .icon-button--outline:active:not(.icon-button--disabled) {
    background-color: var(--cx-color-neutral-200);
  }

  .icon-button--circle {
    border-radius: var(--cx-border-radius-circle);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host(
      [data-cx-button-group__button--first]:not(
          [data-cx-button-group__button--last]
        )
    )
    .icon-button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-cx-button-group__button--inner]) .icon-button {
    border-radius: 0;
  }

  :host(
      [data-cx-button-group__button--last]:not(
          [data-cx-button-group__button--first]
        )
    )
    .icon-button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host(
    [data-cx-button-group__button]:not([data-cx-button-group__button--first])
  ) {
    margin-inline-start: calc(-1 * var(--cx-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-cx-button-group__button]:not(
          [data-cx-button-group__button--first],
          [data-cx-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .icon-button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-cx-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-cx-button-group__button--focus]),
  :host([data-cx-button-group__button][checked]) {
    z-index: 2;
  }
`;
export {
  n as default
};
