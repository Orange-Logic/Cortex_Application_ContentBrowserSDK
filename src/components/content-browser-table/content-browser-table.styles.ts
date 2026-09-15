import { css } from 'lit';

export default css`
  /* Containing block for the absolutely positioned loading bar, which is a direct child. */
  :host {
    position: relative;
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
    background-color: var(--cx-color-neutral-50);
    border-bottom: 1px solid var(--cx-color-neutral-200);
    color: var(--cx-color-neutral-700);
  }

  /* cx-typography sets its own font-weight, so the host cannot simply inherit one in. */
  .content-browser-table__header cx-typography::part(base) {
    font-weight: var(--cx-font-weight-medium);
  }

  .content-browser-table__body {
    flex: 1;
    min-height: 0;
  }

  /*
   * lit-virtualizer positions rows absolutely, which makes them shrink-to-fit. Without an explicit
   * width the row's grid resolves its fr tracks against the row's own content width while the
   * header -- not virtualized -- resolves the same tracks against the full container, so the two
   * disagree and a fractional column never receives the free space.
   */
  .content-browser-table__row {
    box-sizing: border-box;
    width: 100%;
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

  .content-browser-table__cell--action {
    display: flex;
    justify-content: flex-end;
  }

  /*
   * visibility, not display: the action column is a max-content track, so removing the button
   * from layout would collapse the track and reflow every other column on hover.
   */
  .content-browser-table__action {
    --min-height: 0;

    visibility: hidden;
  }

  .content-browser-table__row:hover .content-browser-table__action,
  .content-browser-table__row:focus-visible .content-browser-table__action,
  .content-browser-table__row:focus-within .content-browser-table__action,
  .content-browser-table__row--selected .content-browser-table__action {
    visibility: visible;
  }

  /*
   * Reserves the action track's width in the header grid so it resolves to the same max-content
   * size the row grid resolves to. It is never shown and never focusable.
   */
  .content-browser-table__action--placeholder {
    visibility: hidden;
    pointer-events: none;
  }

  .content-browser-table__empty {
    flex: 1;
  }
`;
