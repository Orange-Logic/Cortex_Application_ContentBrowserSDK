import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const i = e`
  :host {
    display: block;
    outline: 0;
    --selected-color: var(--cx-color-primary-600);
  }

  :host(:focus) {
    outline: none;
  }

  [hidden] {
    display: none !important;
  }

  slot:not([name])::slotted(cx-icon) {
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    color: var(--cx-color-neutral-700);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .tree-item__checkbox {
    pointer-events: none;
  }

  .tree-item__expand-button,
  .tree-item__checkbox,
  .tree-item__label {
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    line-height: var(--cx-line-height-medium);
    letter-spacing: var(--cx-letter-spacing-normal);
  }

  .tree-item__checkbox::part(base) {
    display: flex;
    align-items: center;
  }

  .tree-item__indentation {
    display: block;
    width: 1em;
    flex-shrink: 0;
  }

  .tree-item__expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    color: var(--cx-color-neutral-500);
    padding: var(--cx-spacing-x-small);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .tree-item__expand-button {
    transition: var(--cx-transition-medium) rotate ease;
  }

  .tree-item--expanded .tree-item__expand-button {
    rotate: 90deg;
  }

  .tree-item--expanded.tree-item--rtl .tree-item__expand-button {
    rotate: -90deg;
  }

  .tree-item--expanded slot[name='expand-icon'],
  .tree-item:not(.tree-item--expanded) slot[name='collapse-icon'] {
    display: none;
  }

  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__item
    .tree-item__expand-icon-slot {
    color: var(--selected-color);
  }

  .tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot {
    display: none;
  }

  .tree-item__expand-button--visible {
    cursor: pointer;
  }

  .tree-item__item {
    display: flex;
    align-items: center;
    border-radius: var(--cx-border-radius-large);
    padding: var(--cx-spacing-2x-small) var(--cx-spacing-x-small);
    transition: var(--cx-transition-x-fast) background-color ease;
  }

  .tree-item__item:hover {
    background-color: var(--cx-menu-item-background-color-hover);
  }

  .tree-item__item:active {
    background-color: var(--cx-color-neutral-200);
  }

  .tree-item--disabled .tree-item__item {
    opacity: 0.5;
    outline: none;
    cursor: default;
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
    background-color: var(--cx-color-primary-50);
    color: var(--selected-color);
  }

  :host(:not([aria-disabled='true'])) .tree-item__expand-button {
    color: var(--cx-color-neutral);
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected,
  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__expand-button,
  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__actions::slotted(cx-icon-button) {
    color: var(--cx-color-neutral-0);
  }

  :host(:not([aria-disabled='true']))
    .tree-item--selected
    .tree-item__actions::slotted(cx-icon-button) {
    --hover-color: var(--cx-color-neutral-0);
  }

  .tree-item__label {
    display: flex;
    align-items: center;
  }

  .tree-item__actions {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
    font-size: var(--cx-font-size-medium);
    width: fit-content;
  }

  .tree-item__actions::slotted(*) {
    visibility: hidden;
    opacity: 0;
    transition:
      var(--cx-transition-x-fast) visibility,
      var(--cx-transition-x-fast) opacity ease;
  }

  .tree-item__item:hover .tree-item__actions::slotted(*) {
    visibility: visible;
    opacity: 1;
  }

  /**
   * If overlay attribute is not supported, the cx-overlay
   * inside dropdown will be hidden if the dropdown itself is hidden.
   * Thus, we fallback by making dropdown visible if it's open.
   * See 41MFC1
   */
  @supports not (overlay: auto) {
    .tree-item__actions::slotted(cx-dropdown[open]) {
      visibility: visible;
      opacity: 1;
    }
  }

  .tree-item__children {
    display: flex;
    flex-direction: column;
    font-size: calc(1em + var(--indent-size, var(--cx-spacing-medium)));
  }

  @media (forced-colors: active) {
    :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
      outline: dashed 1px SelectedItem;
    }
  }
`;
export {
  i as default
};
