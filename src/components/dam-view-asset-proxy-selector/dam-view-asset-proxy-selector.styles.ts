import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .dam-view-asset-proxy-selector__menu {
    --checked-icon-display: none;

    border: none;
    border-radius: 0;
    padding: 0;
  }

  .dam-view-asset-proxy-selector__menu-item {
    border-bottom: var(--cx-panel-border-width) solid var(--cx-panel-border-color);
  }

  .dam-view-asset-proxy-selector__menu-item::part(base) {
    height: 60px;
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium);
  }

  .dam-view-asset-proxy-selector__menu-item::part(label) {
    display: flex;
    align-items: center;
  }

  .dam-view-asset-proxy-selector__menu-item::part(checked-icon) {
    display: none;
  }

  .dam-view-asset-proxy-selector__menu-item::part(submenu-icon) {
    display: none;
  }

  .dam-view-asset-proxy-selector__menu-item::part(suffix) {
    color: var(--cx-color-neutral-600);
  }

  .dam-view-asset-proxy-selector__menu-item__switch {
    margin-left: auto;
  }

  .dam-view-asset-proxy-selector__menu-item__thumbnail {
    background-color: var(--cx-color-neutral-100);
    width: 54px;
    height: 40px;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dam-view-asset-proxy-selector__menu-item__thumbnail img {
    width: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .dam-view-asset-proxy-selector__menu-item__name {
    --color: var(--cx-color-neutral-900);
  }

  .dam-view-asset-proxy-selector__menu-item__name--selected {
    --color: var(--cx-color-primary);
  }

  .dam-view-asset-proxy-selector__menu-item__name::part(base) {
    font-weight: var(--cx-font-weight-medium);
  }

  .dam-view-asset-proxy-selector__menu-item__details {
    --color: var(--cx-color-neutral-500);
  }

  .dam-view-asset-proxy-selector__menu-item__details::part(base) {
    display: flex;
    align-items: center;
    gap: var(--cx-spacing-2x-small);
  }

  .dam-view-asset-proxy-selector__menu-item__extension-dot {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: var(--cx-color-neutral-500);
  }

  .dam-view-asset-proxy-selector__menu-item__warning {
    background-color: var(--cx-color-neutral-0);
    width: 100%;
    padding: var(--cx-spacing-medium);
    gap: 20px;
  }

  .dam-view-asset-proxy-selector__menu-item__warning cx-icon {
    color: var(--cx-color-warning);
  }

  .icon--large {
    font-size: var(--cx-input-font-size-large);
  }

  .icon--primary {
    color: var(--cx-color-primary);
  }
`;
