import { css } from 'lit';

export default css`
  /* Containing block for the absolutely positioned loading bar, which is a direct child. */
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    box-sizing: border-box;
    /*
     * A multi-line flex parent stretches an item to its own flex line's cross size rather than to
     * the container's width, and a row parent's automatic minimum refuses to shrink below content.
     * A definite width and a zero minimum keep a wide table scrolling inside the picker instead of
     * widening it (L-429EVG).
     */
    width: 100%;
    min-width: 0;
    min-height: 0;
    /*
     * The gap under the control bar belongs to the table, not to the shared cx-space above it, which
     * spaces the grid too. Fallback because an unthemed host resolves the token to nothing.
     */
    padding-top: var(--cx-spacing-medium, 16px);
  }

  /*
   * The table is positioned out of flow, so the rows can never size this box: its height comes from
   * the container alone, in every host shape. A host slot that takes its height from a flex line
   * cannot be shorter than the height its contents report, and a table in flow reports every row it
   * holds, which paints the picker over the page below (L-42BBKC) and makes a row count read off it
   * grow with each page (L-42BFJC). The floor is the grid's own (lit-virtualizer's scroller
   * minimum), so a host that gives the picker no height gets a short table that scrolls, never one
   * that collapses to nothing.
   */
  .content-browser-table {
    position: relative;
    flex: 1 1 auto;
    min-height: 150px;
  }

  .content-browser-table__table {
    --table-height: 100%;
    --content-browser-action-boundary: 100%;

    position: absolute;
    inset: 0;
  }

  :host([row-action-position='row-end']) .content-browser-table__table {
    --content-browser-action-boundary: var(--content-browser-table-width);
  }

  .content-browser-table__table::part(content-browser-header),
  .content-browser-table__table::part(content-browser-frame)::before {
    box-sizing: border-box;
    width: min(100%, var(--content-browser-table-width, 100%));
  }

  .content-browser-table__table::part(content-browser-header) {
    background-color: var(--header-background-color, var(--cx-color-neutral-50));
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .content-browser-table__table::part(content-browser-scrollport) {
    scrollbar-width: thin;
  }

  .content-browser-table__table::part(content-browser-row) {
    min-width: 100%;
  }

  /* The zero-width anchor follows the viewport edge without space in the column layout. */
  .content-browser-table__table::part(content-browser-action-anchor) {
    position: sticky;
    right: 0;
    width: 0;
    min-width: 0;
    flex: 0 0 0;
    margin-left: auto;
    margin-right: max(0px, calc(100% - var(--content-browser-action-boundary)));
    align-self: stretch;
    background-color: inherit;
    /* The frame can cross the action after a small shrink. Keep its border below the button. */
    z-index: 2;
  }

  .content-browser-table__table::part(content-browser-action) {
    position: absolute;
    inset: 0 0 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 var(--cell-padding-right, 8px) 0 var(--cell-padding-left, 8px);
    background-color: inherit;
    /* Leave the data-cell separator visible without a line across empty space. */
    background-clip: padding-box;
    border-bottom: var(--border-width, 1px) solid transparent;
    border-right: var(--border-width, 1px) solid transparent;
  }

  .content-browser-table-loading {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .content-browser-table-loading cx-progress-bar {
    --height: 4px;
  }

  .content-browser-table__empty {
    height: 100%;
  }

  .content-browser-table__page-error {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--cx-spacing-small, 8px);
    padding: var(--cx-spacing-small, 8px);
    border-top: 1px solid var(--cx-color-neutral-200, #e5e5e5);
    background-color: var(--cx-color-neutral-0, #fff);
    color: var(--cx-color-neutral);
  }
`;
