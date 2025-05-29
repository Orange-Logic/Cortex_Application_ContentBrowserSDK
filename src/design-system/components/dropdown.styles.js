import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const a = o`
  :host {
    display: inline-block;
    --panel-padding: 0px;
  }

  .dropdown::part(popup) {
    z-index: var(--cx-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    display: block;
    padding: var(--panel-padding);
    background-color: var(--cx-panel-background-color);
    border: var(--cx-panel-border-width) solid var(--cx-panel-border-color);
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    box-shadow: var(--cx-shadow-large);
    border-radius: var(--cx-border-radius-large);
    pointer-events: none;
    max-height: min(
      var(--auto-size-available-height),
      var(--max-height, var(--auto-size-available-height))
    );
    overflow: auto;
  }

  .dropdown--open .dropdown__panel {
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(cx-menu) {
    max-width: min(100%, var(--auto-size-available-width)) !important;
    border: none;
  }
`;
export {
  a as default
};
