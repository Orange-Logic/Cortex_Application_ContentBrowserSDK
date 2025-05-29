import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const t = e`
  :host {
    --submenu-offset: -2px;
    --checked-icon-display: flex;
    --submenu-icon-display: flex;
    --prefix-font-size: var(--cx-font-size-small);
    --prefix-color: var(--cx-color-neutral-500);
    --label-color: var(--cx-color-neutral);
    --suffix-color: var(--cx-color-neutral);
    --font-weight: var(--cx-font-weight-regular);

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--font-weight);
    line-height: var(--cx-line-height-large);
    letter-spacing: var(--cx-letter-spacing-normal);
    color: var(--cx-color-neutral);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    transition: var(--cx-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    cursor: default;
  }

  .menu-item.menu-item--disabled .menu-item__label,
  .menu-item.menu-item--disabled .menu-item__prefix,
  .menu-item.menu-item--disabled .menu-item__chevron {
    opacity: 0.5;
  }

  .menu-item.menu-item--disabled .menu-item__suffix:not(:slotted(cx-tooltip)) {
    opacity: 0.5;
  }

  .menu-item.menu-item--loading {
    outline: none;
    cursor: wait;
  }

  .menu-item.menu-item--loading *:not(cx-spinner) {
    opacity: 0.5;
  }

  .menu-item--loading cx-spinner {
    --indicator-color: currentColor;
    --track-width: 1px;
    position: absolute;
    font-size: 0.75em;
    top: calc(50% - 0.5em);
    left: 0.65rem;
    opacity: 1;
  }

  .menu-item .menu-item__label {
    color: var(--label-color);
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: auto;
  }

  .menu-item--checked .menu-item__label {
    color: var(--cx-color-primary-600);
  }

  .menu-item .menu-item__prefix {
    color: var(--prefix-color);
    font-size: var(--prefix-font-size);
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item--checked {
    --prefix-color: var(--cx-color-primary-600);
    --suffix-color: var(--cx-color-primary-600);
  }

  .menu-item--checked .menu-item__check {
    color: var(--cx-color-primary-600);
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    color: var(--suffix-color);
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--cx-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--cx-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
      var(--safe-triangle-submenu-start-x, 0)
        var(--safe-triangle-submenu-start-y, 0),
      var(--safe-triangle-submenu-end-x, 0)
        var(--safe-triangle-submenu-end-y, 0)
    );
  }

  @media (pointer: none), (pointer: coarse) {
    .menu-item--submenu-expanded::after {
      display: none;
    }
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible, .disable-hover))
    .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--cx-menu-item-background-color-hover);
    color: var(--cx-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--cx-menu-item-background-color-hover);
    opacity: 1;
  }

  .menu-item .menu-item__check {
    display: var(--checked-icon-display);
    margin-right: var(--cx-spacing-2x-small);
  }

  .menu-item .menu-item__chevron {
    display: var(--submenu-icon-display);
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  cx-popup::part(popup) {
    border: var(--cx-panel-border-width) solid var(--cx-popup-border-color);
    border-radius: var(--cx-border-radius-large);
    box-shadow: var(--cx-shadow-large);
    z-index: var(--cx-z-index-dropdown);
    margin-left: var(--submenu-offset);
    overflow: hidden;
  }

  .menu-item--rtl cx-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(cx-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;
export {
  t as default
};
