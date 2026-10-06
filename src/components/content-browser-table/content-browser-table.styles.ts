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
    /* The frozen CTA column is a row action, not a pinned data column: it takes no divider. */
    --frozen-border-color: transparent;

    position: absolute;
    inset: 0;
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
`;
