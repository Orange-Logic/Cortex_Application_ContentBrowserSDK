import { getData, storeData } from './storage';

export type TableColumnWidths = Record<string, number>;

/** A site URL with and without a trailing slash gives the same key. */
export function tableColumnWidthsKey(siteUrl: string): string {
  return `tableColumnWidths:${siteUrl.replace(/\/+$/, '')}`;
}

const parseTableColumnWidths = (raw: string | null): TableColumnWidths => {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const widths: TableColumnWidths = {};
    for (const [field, width] of Object.entries(parsed)) {
      if (typeof width === 'number' && Number.isFinite(width) && width > 0) {
        widths[field] = width;
      }
    }
    return widths;
  } catch {
    return {};
  }
};

export async function readTableColumnWidths(siteUrl: string): Promise<TableColumnWidths> {
  try {
    return parseTableColumnWidths(await getData(tableColumnWidthsKey(siteUrl)));
  } catch {
    // Storage is not available: the table falls back to its default widths.
    return {};
  }
}

export async function writeTableColumnWidth(
  siteUrl: string,
  field: string,
  width: number | undefined,
): Promise<TableColumnWidths> {
  const widths = await readTableColumnWidths(siteUrl);
  const pixels = width === undefined ? 0 : Math.round(width);
  if (pixels > 0) {
    widths[field] = pixels;
  } else {
    delete widths[field];
  }
  try {
    storeData(tableColumnWidthsKey(siteUrl), JSON.stringify(widths));
  } catch {
    // Storage is not available: the width is kept for this call only.
  }
  return widths;
}
