/** The narrowest width a table column can have, in pixels. */
export const MIN_COLUMN_WIDTH = 92;

/**
 * One column for the layout rules.
 * `natural` is the width the column wants, in pixels.
 * `saved` is the width the user set, in pixels. Leave it out for an auto-fit column.
 */
export type ColumnLayoutInput = { natural: number; saved?: number };

let canvasContext: CanvasRenderingContext2D | null = null;

/**
 * Measure the width of a text with a font, in whole pixels.
 * @param text The text to measure.
 * @param font A CSS font value, such as `'14px sans-serif'`.
 * @returns The width of the text, rounded up. Returns 0 when no canvas context is available.
 */
export function measureTextWidth(text: string, font: string): number {
  canvasContext ??= document.createElement('canvas').getContext('2d');
  if (!canvasContext) {
    return 0;
  }
  canvasContext.font = font;
  return Math.ceil(canvasContext.measureText(text).width);
}

/**
 * Give the spare width to the auto-fit columns in equal parts, so the columns fill the host.
 * The last auto-fit column gets the pixels that the equal split leaves over. When the user saved
 * a width for every column, the spare width stays empty.
 */
function fillSpareWidth(widths: number[], columns: ColumnLayoutInput[], available: number) {
  const autoFit = columns.flatMap(({ saved }, index) => (saved === undefined ? [index] : []));
  const spare = available - widths.reduce((sum, width) => sum + width, 0);

  if (autoFit.length === 0 || spare <= 0) {
    return;
  }

  const part = Math.floor(spare / autoFit.length);

  autoFit.forEach((index) => {
    widths[index] += part;
  });
  widths[autoFit[autoFit.length - 1]] += spare - part * autoFit.length;
}

/**
 * Lay out the column widths inside the available width.
 * Saved widths keep their size. Auto-fit columns that fit in a fair share keep their natural
 * width. The other auto-fit columns share the space that is left. Spare space goes to the
 * auto-fit columns in equal parts. No column is narrower than MIN_COLUMN_WIDTH, so the result can
 * be wider than `available`.
 * @param columns The columns, in display order.
 * @param available The width of the host, in pixels.
 * @returns One whole-pixel width for each column, in the same order.
 */
export function layoutColumnWidths(columns: ColumnLayoutInput[], available: number): number[] {
  const widths = columns.map(({ saved }) => (saved === undefined ? 0 : Math.max(MIN_COLUMN_WIDTH, Math.round(saved))));
  let left = available - widths.reduce((sum, width) => sum + width, 0);
  let open = columns.flatMap(({ saved }, index) => (saved === undefined ? [index] : []));
  const natural = (index: number) => Math.max(MIN_COLUMN_WIDTH, Math.ceil(columns[index].natural));
  // Give each column that fits in a fair share its natural width, then share again.
  let fitCount = 1;
  while (fitCount > 0 && open.length > 0) {
    const share = left / open.length;
    const fits = open.filter((index) => natural(index) <= share);
    for (const index of fits) {
      widths[index] = natural(index);
      left -= widths[index];
    }
    open = open.filter((index) => !fits.includes(index));
    fitCount = fits.length;
  }
  open.forEach((index) => {
    widths[index] = Math.max(MIN_COLUMN_WIDTH, Math.floor(left / open.length));
  });
  fillSpareWidth(widths, columns, available);
  return widths;
}
