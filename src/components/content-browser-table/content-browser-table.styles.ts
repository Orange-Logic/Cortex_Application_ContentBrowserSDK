import { css } from 'lit';

export default css`
  :host {
    display: block;
    flex: 1;
    min-height: 0;
  }

  .content-browser-table {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .content-browser-table-loading {
    position: absolute;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .content-browser-table-loading cx-progress-bar {
    --height: 4px;
  }

  .content-browser-table__header,
  .content-browser-table__row {
    display: grid;
    align-items: center;
    column-gap: var(--cx-spacing-medium);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium);
  }

  .content-browser-table__head {
    flex: none;
  }

  .content-browser-table__header {
    border-bottom: 1px solid var(--cx-color-neutral-300);
    color: var(--cx-color-neutral-700);
  }

  .content-browser-table__body {
    flex: 1;
    min-height: 0;
  }

  .content-browser-table__row {
    border-bottom: 1px solid var(--cx-color-neutral-200);
    cursor: pointer;
  }

  .content-browser-table__row:hover,
  .content-browser-table__row:focus-visible {
    background-color: var(--cx-color-neutral-100);
    outline: none;
  }

  .content-browser-table__row--selected {
    background-color: var(--cx-color-primary-100);
  }

  .content-browser-table__row--disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.5;
  }

  .content-browser-table__cell {
    min-width: 0;
    overflow: hidden;
  }

  .content-browser-table__cell--center {
    text-align: center;
  }

  .content-browser-table__cell--right {
    text-align: right;
  }

  .content-browser-table__empty {
    flex: 1;
  }
`;
