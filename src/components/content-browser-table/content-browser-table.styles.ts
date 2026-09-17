import { css } from 'lit';

export default css`
  /* Containing block for the absolutely positioned loading bar, which is a direct child. */
  :host {
    position: relative;
    display: block;
    flex: 1;
    box-sizing: border-box;
    /*
     * The overflow has to stop at the scrollport below, which it only does while the host cannot
     * grow with the grids' min-content width. Two different parents can let it grow, so both are
     * closed off:
     *
     * width  -- a multi-line flex parent stretches an item to its own flex line's cross size, the
     *           largest hypothetical size on that line, and not to the container's width; only a
     *           single-line container does the latter. The picker's column parent wraps, so the
     *           host stretched to the grids' min-content width and carried everything beside it
     *           along (L-429EVG: the login avatar left the viewport). A definite width ends that.
     * min-width -- in a row parent the main axis is the horizontal one, and a flex item's automatic
     *           minimum size refuses to shrink below its content there. In a column parent that
     *           automatic minimum lands on min-height instead, which is why width alone is not
     *           enough for one shape and min-width alone is not enough for the other.
     */
    width: 100%;
    min-width: 0;
    min-height: 0;
  }

  /*
   * The one scrollport for both axes. The header and the virtualized rows are separate grids, so
   * anything that scrolled them separately could drift; sharing a scroll container means a single
   * scroll offset moves both and they cannot. The vertical scrollbar therefore sits outside both
   * grids, which is why neither has to reserve a gutter for it.
   */
  .content-browser-table {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
  }

  .content-browser-table-loading {
    position: absolute;
    width: 100%;
    z-index: var(--cx-z-index-drawer);
  }

  .content-browser-table-loading cx-progress-bar {
    --height: 4px;
  }

  /*
   * min-width: min-content is what makes the table scroll instead of squashing: it is the width
   * at which every track that cannot shrink still fits, so a column dragged wider than the viewport
   * widens both grids past it and the container gains a horizontal scrollbar. The header and a row
   * resolve the same track list against the same padding and gaps, so their min-content widths are
   * equal and their column boundaries stay on top of each other at any scroll offset.
   */
  .content-browser-table__header,
  .content-browser-table__row {
    display: grid;
    align-items: center;
    /* Set on the host so the header and every virtualized row resolve one identical track list. */
    grid-template-columns: var(--cx-content-browser-table-columns);
    column-gap: var(--cx-spacing-medium);
    padding: var(--cx-spacing-x-small) var(--cx-spacing-medium);
    min-width: min-content;
  }

  /*
   * Sticky rather than outside the scroller: the header has to travel with the rows horizontally
   * and stay put vertically, and only sharing their scrollport gives the first of those for free.
   */
  .content-browser-table__head {
    position: sticky;
    top: 0;
    z-index: 1;
    flex: none;
    min-width: min-content;
    /*
     * The offset and the background belong to the sticky box, not to the row inside it: rows now
     * scroll underneath within the same scrollport, and any part of the sticky box that paints
     * nothing shows them through. __head is a flex item, so a child's margin cannot collapse out
     * of it either. Literal fallback because an unthemed host paints no background at all.
     */
    padding-top: 5px;
    background-color: var(--cx-color-neutral-50, #f9f9f9);
  }

  .content-browser-table__header {
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
   * disagree and a fractional column never receives the free space. 100% is the scrollport, not
   * the scroll width, so the shared min-width: min-content above is what carries a row past it.
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

  /* Anchors the resize handle; the cell clips, so the handle stays inside its own right edge. */
  .content-browser-table__header .content-browser-table__cell {
    position: relative;
  }

  /*
   * Kept wholly inside the cell: the cell clips, so any part hanging into the column gap is not
   * painted and, more importantly, not hit-testable.
   */
  .content-browser-table__resize {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    /* Fallback matters: with no design-system theme the token is empty and the grab target is 0px. */
    width: var(--cx-spacing-medium, 16px);
    cursor: col-resize;
    touch-action: none;
  }

  /*
   * The column divider, pinned to the grab target's right edge -- which the cell clips to, so it
   * lands on the column boundary. Visible at rest as a neutral full-height hairline: it is what
   * tells the user where the draggable boundaries are before the pointer is anywhere near one, so
   * it has to read as table chrome. The rules below take it to the primary treatment once the
   * boundary is actually being addressed. Literal fallbacks because the tokens resolve to nothing
   * on an unthemed host, and an invisible divider is the defect this fixes.
   */
  .content-browser-table__resize::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background-color: var(--cx-color-neutral-200, #e4e4e7);
    content: '';
  }

  .content-browser-table__resize:hover::after,
  .content-browser-table__resize:focus-visible::after {
    width: 2px;
    background-color: var(--cx-color-primary-500, #3b82f6);
  }

  /*
   * Keyboard focus needs an indicator of its own: the hover hairline is 2px wide and half the cell
   * high, far too small to read as focus. The ring is inset by its own width because the header
   * cell clips -- the handle is flush with the cell's top, right and bottom edges, so anything
   * drawn outside its box is never painted. Fallbacks matter: with no design-system theme the
   * tokens are empty and the ring would disappear entirely.
   */
  .content-browser-table__resize:focus-visible {
    outline: var(--cx-focus-ring-style, solid) var(--cx-focus-ring-width, 3px)
      var(--cx-focus-ring-color, #2563eb);
    outline-offset: calc(-1 * var(--cx-focus-ring-width, 3px));
  }

  /*
   * While a column is being dragged the pointer is captured, so it can travel anywhere in the
   * document -- keep the resize cursor and stop the drag from selecting header text.
   */
  .content-browser-table--resizing {
    cursor: col-resize;
    user-select: none;
  }

  .content-browser-table--resizing .content-browser-table__resize::after {
    width: 2px;
    background-color: var(--cx-color-primary-500, #3b82f6);
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
  .content-browser-table__row--selected .content-browser-table__action,
  .content-browser-table__action--busy {
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
