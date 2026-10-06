import './content-browser-table';

import { elementUpdated, expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import type { TableColumn } from '@/types/content-browser';

import type ContentBrowserTable from './content-browser-table';
import { CTA_FIELD, FILLER_FIELD, ROW_HEIGHT } from './content-browser-table';
import {
  dispatchResize,
  dragColumnHandle,
  expectFilled,
  getColumnHeader,
  getContainer,
  getCta,
  getCxTable,
  getDataCells,
  getResizeHandles,
  getRowElement,
  getRowElements,
  getScrollport,
  getTableRoot,
  hasFocus,
  isShown,
  makeAsset,
  makeAssets,
  mount,
  OWN_FIELDS,
  resizeObserverEntry,
  settle,
  stubInputQueries,
  tabToCta,
  waitForCtaColumnFit,
  waitForRows,
} from './content-browser-table.test-helpers';

/*
 * L-42BJ3T: `hiddenFields` hides a column the host still configures. A file of its own, so that it
 * does not touch the tests L-42BGNS changes.
 */

const COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
  { field: 'Custom.Date', title: 'Date' },
  { field: 'Dell.Snippet', title: 'Snippet' },
];

/** Tabulator hides a header or a cell with `display: none`, so it stays in the DOM with no box. */
function hasBox(element: Element | null | undefined) {
  return Boolean(element && element.getClientRects().length > 0);
}

function getShownHeaderTitles(el: ContentBrowserTable) {
  return [...getTableRoot(el).querySelectorAll(`.tabulator-col:not(${OWN_FIELDS})`)]
    .filter(hasBox)
    .map((header) => header.querySelector('.tabulator-col-title')?.textContent?.trim() ?? '');
}

function getShownDataCellCounts(el: ContentBrowserTable) {
  return getRowElements(el).map((row) => getDataCells(row).filter(hasBox).length);
}

function getOwnCell(row: HTMLElement, field: string) {
  return row.querySelector<HTMLElement>(`.tabulator-cell[tabulator-field="${field}"]`);
}

/** Per row, whether the filler cell and the CTA cell both have a box. */
function getOwnCellsShown(el: ContentBrowserTable) {
  return getRowElements(el).map((row) => hasBox(getOwnCell(row, FILLER_FIELD)) && hasBox(getOwnCell(row, CTA_FIELD)));
}

function getOwnHeadersShown(el: ContentBrowserTable) {
  return hasBox(getColumnHeader(el, FILLER_FIELD)) && hasBox(getColumnHeader(el, CTA_FIELD));
}

/** A host column's header width, by its position in `columns`. */
function getHeaderWidth(el: ContentBrowserTable, index: number) {
  return Math.round(getColumnHeader(el, `column${index}`).getBoundingClientRect().width);
}

async function waitForHeaders(el: ContentBrowserTable, titles: string[], message: string) {
  await waitUntil(() => getShownHeaderTitles(el).join('|') === titles.join('|'), message, { interval: 20, timeout: 3000 });
}

/** A page as Cortex returns it for a user who cannot read `field`: the value is an empty string. */
function makeFlaggedAssets(count: number, from: number, field: string, prefix = 'asset') {
  return makeAssets(count, from, prefix).map((asset) => ({ ...asset, [field]: '' }));
}

function getTableWidth(el: ContentBrowserTable) {
  return getTableRoot(el).querySelector<HTMLElement>('.tabulator')!.clientWidth;
}

/** A move of the picker: `cx-table` builds a new Tabulator instance on the reconnect. */
async function movePicker(el: ContentBrowserTable, rowCount: number) {
  const before = getCxTable(el)!.tabulatorInstance;
  const parent = el.parentElement!;

  el.remove();
  parent.appendChild(el);
  await waitUntil(() => {
    const tabulator = getCxTable(el)!.tabulatorInstance;

    return Boolean(tabulator && tabulator !== before && !tabulator.destroyed && tabulator.getRows().length === rowCount
      && getRowElements(el).length > 0);
  }, 'the table was never built again', { interval: 20, timeout: 5000 });
}

describe('content-browser-table hidden columns', () => {
  // A touch screen on the machine that runs the tests would show every CTA at rest.
  beforeEach(() => {
    stubInputQueries();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('shows no header and no cell for a hidden column', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${COLUMNS} .hiddenFields=${['Custom.Date']}>
      </cx-content-browser-table>
    `, 3);

    expect(getShownHeaderTitles(el)).to.deep.equal(['Identifier', 'Snippet']);
    expect(getShownDataCellCounts(el)).to.deep.equal([2, 2, 2]);
  });

  it('hides only the host column when the host hides it after the build, and keeps the filler and the CTA column', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${COLUMNS}>
      </cx-content-browser-table>
    `, 3);

    el.hiddenFields = ['Custom.Date'];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');

    expect(getShownDataCellCounts(el)).to.deep.equal([2, 2, 2]);
    expect(getOwnHeadersShown(el), 'a header of the filler or the CTA column was hidden').to.equal(true);
    expect(getOwnCellsShown(el)).to.deep.equal([true, true, true]);
  });

  it('shows the column and its cells again when the host stops hiding it', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${COLUMNS} .hiddenFields=${['Custom.Date']}>
      </cx-content-browser-table>
    `, 3);

    el.hiddenFields = [];
    await elementUpdated(el);

    await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
    expect(getShownDataCellCounts(el)).to.deep.equal([3, 3, 3]);
  });

  it('hides a column that the host hides before the table is built', async () => {
    const el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${COLUMNS}>
      </cx-content-browser-table>
    `);
    const builtBefore = getCxTable(el)?.tabulatorInstance?.initialized === true;

    el.hiddenFields = ['Custom.Date'];
    await elementUpdated(el);
    await waitForRows(el, 3);
    await settle(100);

    expect(builtBefore, 'the table was built before the host hid the column').to.equal(false);
    expect(getShownHeaderTitles(el)).to.deep.equal(['Identifier', 'Snippet']);
  });

  it('brings a column back with the rows, the scroll position and the busy and selected rows in place', async () => {
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px"
        .assets=${makeAssets(60)}
        .columns=${COLUMNS}
        .hiddenFields=${['Custom.Date']}
        .busyAssetId=${'asset-20'}
        selected-asset-id="asset-21"
      ></cx-content-browser-table>
    `, 60);
    const scrollport = getScrollport(el);

    scrollport.scrollTop = 900;
    await settle(300);

    const before = scrollport.scrollTop;
    const marker = getRowElement(el, 'asset-22');

    // The page that stops the flag lands with the rows it appends.
    el.assets = [...el.assets, ...makeAssets(30, 60)];
    el.hiddenFields = [];
    await elementUpdated(el);
    await waitForRows(el, 90);
    await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
    await settle(300);

    const busyCta = await getCta(getRowElement(el, 'asset-20'));

    expect(before > 0, 'the scrollport never scrolled').to.equal(true);
    expect(Math.abs(scrollport.scrollTop - before) <= ROW_HEIGHT,
      `scrolled from ${before} to ${scrollport.scrollTop}`).to.equal(true);
    expect(marker !== undefined && getRowElement(el, 'asset-22') === marker, 'the rows were built again').to.equal(true);
    expect(isShown(busyCta), 'the busy row hid its CTA').to.equal(true);
    expect(Boolean(busyCta?.hasAttribute('loading')), 'the busy row stopped its spin').to.equal(true);
    expect(getRowElement(el, 'asset-21')?.getAttribute('aria-current')).to.equal('true');
  });

  it('keeps keyboard focus on its CTA while the host hides a column and shows it again', async () => {
    const page = await fixture<HTMLDivElement>(html`
      <div>
        <button class="before">before</button>
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      </div>
    `);
    const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

    await waitForRows(el, 2);
    await getCta(getRowElement(el, 'asset-0'));

    const cta = await tabToCta(page.querySelector<HTMLElement>('.before')!);

    expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

    el.hiddenFields = ['Custom.Date'];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');
    await settle(200);

    expect(hasFocus(cta), 'the hide took the focus off the CTA').to.equal(true);

    el.hiddenFields = [];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
    await settle(200);

    expect(hasFocus(cta), 'the show took the focus off the CTA').to.equal(true);
    expect(isShown(cta), 'the focused CTA hid').to.equal(true);
  });

  it('fills the table width after a hide and after a show, with the filler in the space the fixed columns leave', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px; width: 800px" .assets=${makeAssets(3)} .columns=${COLUMNS}>
      </cx-content-browser-table>
    `, 3);

    // The drag fixes the width of Date, so once Snippet is hidden no host column takes the free space.
    dragColumnHandle(getResizeHandles(el)[1], -80);
    await elementUpdated(el);
    await settle(200);

    el.hiddenFields = ['Dell.Snippet'];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Date'], 'the column was never hidden');
    await expectFilled(el, 'after the hide');

    const fillerAfterHide = Math.round(getColumnHeader(el, FILLER_FIELD).getBoundingClientRect().width);

    el.hiddenFields = [];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
    await expectFilled(el, 'after the show');

    expect(fillerAfterHide > ROW_HEIGHT, `the filler took ${fillerAfterHide}px after the hide`).to.equal(true);
  });

  it('brings a column back at the width the user dragged it to', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px; width: 800px" .assets=${makeAssets(3)} .columns=${COLUMNS}>
      </cx-content-browser-table>
    `, 3);
    const hostWidth = getHeaderWidth(el, 1);

    dragColumnHandle(getResizeHandles(el)[1], -80);
    await elementUpdated(el);

    const dragged = getHeaderWidth(el, 1);

    el.hiddenFields = ['Custom.Date'];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');

    el.hiddenFields = [];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');

    expect(dragged < hostWidth, `dragged from ${hostWidth}px to ${dragged}px`).to.equal(true);
    expect(getHeaderWidth(el, 1)).to.equal(dragged);
  });

  describe('when the table is built again', () => {
    it('keeps a column hidden after the host changes its columns', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${COLUMNS} .hiddenFields=${['Custom.Date']}>
        </cx-content-browser-table>
      `, 3);

      el.columns = [...COLUMNS, { field: 'name', title: 'Name' }];
      await elementUpdated(el);

      await waitForHeaders(el, ['Identifier', 'Snippet', 'Name'], 'the table never took the new column set');
    });

    it('keeps a column hidden when the table comes back after a list with no result', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 3);

      el.assets = [];
      el.empty = true;
      await elementUpdated(el);

      // A search with no rows flags the field from its group grants only.
      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);

      el.assets = makeAssets(2);
      el.empty = false;
      await elementUpdated(el);
      await waitForRows(el, 2);

      await waitForHeaders(el, ['Identifier', 'Snippet'], 'the table came back with the hidden column');
    });

    it('keeps a column hidden over a table that has no rows yet', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" loading .columns=${COLUMNS} .hiddenFields=${['Custom.Date']}>
        </cx-content-browser-table>
      `);

      await waitUntil(() => getCxTable(el)?.tabulatorInstance?.initialized === true, 'the table was never built');
      await settle(100);

      expect(getShownHeaderTitles(el)).to.deep.equal(['Identifier', 'Snippet']);
    });

    it('keeps a column the host hid after the build hidden when a move of the picker builds a new table', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(1)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 1);

      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');

      const before = getCxTable(el)!.tabulatorInstance;
      const parent = el.parentElement!;

      el.remove();
      parent.appendChild(el);
      await waitUntil(() => {
        const tabulator = getCxTable(el)!.tabulatorInstance;

        return Boolean(tabulator && tabulator !== before && !tabulator.destroyed && tabulator.getRows().length === 1
          && getRowElements(el).length > 0);
      }, 'the table was never built again', { interval: 20, timeout: 5000 });
      await settle(100);

      expect(getShownHeaderTitles(el)).to.deep.equal(['Identifier', 'Snippet']);
    });
  });

  it('keeps each row at the single-line height when the multi-line column is hidden, and leaves the filler and the CTA cells as they are', async () => {
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px"
        .assets=${[...makeAssets(2), makeAsset({ id: 'cold-0', inColdStorage: true, recordId: 'rec-cold-0' })]}
        .columns=${[COLUMNS[0], { ...COLUMNS[2], lines: 2 }]}
        .hiddenFields=${['Dell.Snippet']}
      ></cx-content-browser-table>
    `, 3);

    await settle(300);

    const rows = getRowElements(el);

    expect(rows.map((row) => Math.round(row.getBoundingClientRect().height))).to.deep.equal([ROW_HEIGHT, ROW_HEIGHT, ROW_HEIGHT]);
    expect(rows.map((row) => `${getOwnCell(row, FILLER_FIELD)!.style.minHeight}|${getOwnCell(row, CTA_FIELD)!.style.minHeight}`))
      .to.deep.equal(['|', '|', '|']);
    expect(rows.map((row) => getOwnCell(row, FILLER_FIELD)!.style.padding)).to.deep.equal(['0px', '0px', '0px']);
  });

  it('keeps the rows with only their CTA when each host column is hidden', async () => {
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 800px"
        .assets=${makeAssets(2)}
        .columns=${COLUMNS}
        .hiddenFields=${COLUMNS.map((column) => column.field)}
      ></cx-content-browser-table>
    `, 2);

    await settle(300);

    expect(hasBox(getTableRoot(el).querySelector('.tabulator-placeholder')), 'the table showed its message for no visible column')
      .to.equal(false);
    expect(getRowElements(el).filter(hasBox).length).to.equal(2);
    expect(getShownDataCellCounts(el)).to.deep.equal([0, 0]);
    expect(getOwnCellsShown(el)).to.deep.equal([true, true]);
    expect(Boolean(await getCta(getRowElement(el, 'asset-0'))), 'the row has no CTA').to.equal(true);
    await expectFilled(el, 'with each host column hidden');
  });

  it('keeps the rows with only their CTA when the host hides each host column after the build', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px; width: 800px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
      </cx-content-browser-table>
    `, 2);

    el.hiddenFields = COLUMNS.map((column) => column.field);
    await elementUpdated(el);
    await waitForHeaders(el, [], 'the host columns were never hidden');
    await settle(300);

    expect(hasBox(getTableRoot(el).querySelector('.tabulator-placeholder')), 'the table showed its message for no visible column')
      .to.equal(false);
    expect(getRowElements(el).filter(hasBox).length).to.equal(2);
    expect(getShownDataCellCounts(el)).to.deep.equal([0, 0]);
    expect(getOwnHeadersShown(el), 'a header of the filler or the CTA column was hidden').to.equal(true);
    expect(getOwnCellsShown(el)).to.deep.equal([true, true]);
    expect(Boolean(await getCta(getRowElement(el, 'asset-0'))), 'the row has no CTA').to.equal(true);
    await expectFilled(el, 'with each host column hidden after the build');
  });

  it('keeps each row at the single-line height when each host column of a multi-line table is hidden', async () => {
    const columns = [COLUMNS[0], { ...COLUMNS[2], lines: 2 }];
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px"
        .assets=${[...makeAssets(2), makeAsset({ id: 'cold-0', inColdStorage: true, recordId: 'rec-cold-0' })]}
        .columns=${columns}
        .hiddenFields=${columns.map((column) => column.field)}
      ></cx-content-browser-table>
    `, 3);

    await settle(300);

    expect(getShownDataCellCounts(el)).to.deep.equal([0, 0, 0]);
    expect(getRowElements(el).map((row) => Math.round(row.getBoundingClientRect().height)))
      .to.deep.equal([ROW_HEIGHT, ROW_HEIGHT, ROW_HEIGHT]);
    expect(getRowElements(el).map((row) => Math.round(getOwnCell(row, CTA_FIELD)!.getBoundingClientRect().height)), 'a CTA cell kept its own height')
      .to.deep.equal([ROW_HEIGHT, ROW_HEIGHT, ROW_HEIGHT]);
  });

  it('keeps each row at the single-line height when the host hides each host column of a multi-line table after the build', async () => {
    const columns = [COLUMNS[0], { ...COLUMNS[2], lines: 2 }];
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px"
        .assets=${[...makeAssets(2, 0, 'later'), makeAsset({ id: 'later-cold-0', inColdStorage: true, recordId: 'rec-later-cold-0' })]}
        .columns=${columns}
      ></cx-content-browser-table>
    `, 3);

    el.hiddenFields = columns.map((column) => column.field);
    await elementUpdated(el);
    await waitForHeaders(el, [], 'the host columns were never hidden');
    await settle(300);

    expect(getShownDataCellCounts(el)).to.deep.equal([0, 0, 0]);
    expect(getRowElements(el).map((row) => Math.round(row.getBoundingClientRect().height)))
      .to.deep.equal([ROW_HEIGHT, ROW_HEIGHT, ROW_HEIGHT]);
    expect(getRowElements(el).map((row) => Math.round(getOwnCell(row, CTA_FIELD)!.getBoundingClientRect().height)), 'a CTA cell kept its own height')
      .to.deep.equal([ROW_HEIGHT, ROW_HEIGHT, ROW_HEIGHT]);
  });

  describe('with the row keys of the host columns', () => {
    it('hides the column of the flagged field after the host removes a column before it', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      // Date and Snippet keep the row keys they had in the first column set.
      el.columns = [COLUMNS[1], COLUMNS[2]];
      await elementUpdated(el);
      await waitForHeaders(el, ['Date', 'Snippet'], 'the table never took the new column set');

      el.hiddenFields = ['Dell.Snippet'];
      await elementUpdated(el);
      await waitForHeaders(el, ['Date'], 'the flagged column was never hidden');

      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForHeaders(el, ['Date', 'Snippet'], 'the column never came back');
    });

    it('hides each column of a field the host repeats', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${makeAssets(2)}
          .columns=${[...COLUMNS, { field: 'CoreField.Identifier', title: 'Code' }]}
        ></cx-content-browser-table>
      `, 2);

      el.hiddenFields = ['CoreField.Identifier'];
      await elementUpdated(el);
      await waitForHeaders(el, ['Date', 'Snippet'], 'a column of the repeated field stayed');

      expect(getShownDataCellCounts(el)).to.deep.equal([2, 2]);
    });
  });

  describe('with the rows the table holds', () => {
    it('keeps the rows and the scroll position when each appended page flags the hidden field again', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${makeFlaggedAssets(60, 0, 'Custom.Date')}
          .columns=${COLUMNS}
          .hiddenFields=${['Custom.Date']}
        ></cx-content-browser-table>
      `, 60);
      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const scrollport = getScrollport(el);

      scrollport.scrollTop = 900;
      await settle(300);

      const before = scrollport.scrollTop;
      const marker = getRowElement(el, 'asset-22');
      const setData = sinon.spy(tabulator, 'setData');

      // `content-browser` hands over a new flag array with each page.
      el.assets = [...el.assets, ...makeFlaggedAssets(30, 60, 'Custom.Date')];
      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);
      await waitForRows(el, 90);
      await settle(300);

      expect(before > 0, 'the scrollport never scrolled').to.equal(true);
      expect(setData.callCount, 'the appended page built every row again').to.equal(0);
      expect(getRowElement(el, 'asset-22') === marker, 'the rows were built again').to.equal(true);
      expect(Math.abs(scrollport.scrollTop - before) <= ROW_HEIGHT,
        `scrolled from ${before} to ${scrollport.scrollTop}`).to.equal(true);
      expect(getShownHeaderTitles(el)).to.deep.equal(['Identifier', 'Snippet']);
    });

    it('keeps a column hidden, and the rows it holds, when the host retitles its columns', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${makeFlaggedAssets(3, 0, 'Custom.Date')}
          .columns=${COLUMNS}
          .hiddenFields=${['Custom.Date']}
        ></cx-content-browser-table>
      `, 3);
      const setData = sinon.spy(getCxTable(el)!.tabulatorInstance!, 'setData');

      el.columns = COLUMNS.map((column) => ({ ...column, title: `${column.title}!` }));
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier!', 'Snippet!'], 'the table never took the new titles');
      await settle(100);

      expect(setData.callCount, 'the new titles built every row again').to.equal(0);
      expect(getShownDataCellCounts(el)).to.deep.equal([2, 2, 2]);
    });
  });

  describe('with the column widths', () => {
    const PERCENT_COLUMNS: TableColumn[] = [
      { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
      { field: 'Custom.Date', title: 'Date', width: '25%' },
      { field: 'Dell.Snippet', title: 'Snippet' },
    ];

    it('fills the table around a hidden percentage column, and shows it at its share when it comes back', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 800px"
          .assets=${makeAssets(2)}
          .columns=${PERCENT_COLUMNS}
          .hiddenFields=${['Custom.Date']}
        ></cx-content-browser-table>
      `, 2);

      await expectFilled(el, 'with the percentage column hidden');

      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');

      const share = Math.floor(getTableWidth(el) / 100 * 25);

      expect(getHeaderWidth(el, 1), `the 25% column of a ${getTableWidth(el)}px table`).to.equal(share);
      await expectFilled(el, 'once the percentage column is shown');
    });

    it('shows a hidden percentage column at its share of a table that took its columns while hidden', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 800px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const observedWidths: number[] = [];
      const observer = new ResizeObserver((entries) => {
        observedWidths.push(entries[0].contentRect.width);
      });

      observer.observe(el);
      await waitUntil(() => observedWidths.length > 0, 'the table was never observed', { interval: 20, timeout: 3000 });

      // A panel or tab the host hides keeps the table and its Tabulator instance, with no width.
      el.style.display = 'none';
      el.columns = PERCENT_COLUMNS;
      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);
      await waitUntil(() => tabulator.getColumns()[1]?.getDefinition().width === '25%',
        'the hidden table never took the new columns', { interval: 20, timeout: 3000 });
      await waitUntil(() => observedWidths[observedWidths.length - 1] === 0,
        'the browser never laid the hidden table out', { interval: 20, timeout: 3000 });
      observer.disconnect();

      el.style.display = '';
      await expectFilled(el, 'once the table is shown');

      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');

      const share = Math.floor(getTableWidth(el) / 100 * 25);

      await waitUntil(() => getHeaderWidth(el, 1) === share, '', { interval: 20, timeout: 2000 }).catch(() => undefined);

      expect(getCxTable(el)!.tabulatorInstance === tabulator, 'the table was built again').to.equal(true);
      expect(getHeaderWidth(el, 1), `the 25% column of a ${getTableWidth(el)}px table`).to.equal(share);
      await expectFilled(el, 'once the percentage column is shown');
    });

    it('lays a percentage column out at its share when the host hides it and shows it again before the build', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 800px" .assets=${makeAssets(2)} .columns=${PERCENT_COLUMNS}>
        </cx-content-browser-table>
      `);
      const builtBefore = getCxTable(el)?.tabulatorInstance?.initialized === true;

      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);
      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForRows(el, 2);
      await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column was never shown');

      const share = Math.floor(getTableWidth(el) / 100 * 25);

      expect(builtBefore, 'the table was built before the host hid the column').to.equal(false);
      expect(getHeaderWidth(el, 1), `the 25% column of a ${getTableWidth(el)}px table`).to.equal(share);
      await expectFilled(el, 'once the table is built');
    });

    it('brings a column of width 0 back at the floor', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 800px"
          .assets=${makeAssets(2)}
          .columns=${[COLUMNS[0], { ...COLUMNS[1], width: '0px' }, COLUMNS[2]]}
          .hiddenFields=${['Custom.Date']}
        ></cx-content-browser-table>
      `, 2);

      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');

      expect(getHeaderWidth(el, 1)).to.equal(48);
      await expectFilled(el, 'once the column of width 0 is shown');
    });

    it('brings a column back at its dragged width after a move of the picker builds a new table', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 800px" .assets=${makeAssets(1)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 1);
      const hostWidth = getHeaderWidth(el, 1);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[1], -80);
      await resized;
      await elementUpdated(el);

      const dragged = getHeaderWidth(el, 1);

      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');

      await movePicker(el, 1);
      await waitForHeaders(el, ['Identifier', 'Snippet'], 'the new table showed the hidden column');

      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');

      expect(dragged < hostWidth, `dragged from ${hostWidth}px to ${dragged}px`).to.equal(true);
      expect(getHeaderWidth(el, 1)).to.equal(dragged);
      await expectFilled(el, 'once the dragged column is shown');
    });
  });

  it('fits the CTA column to its button, at the right edge, when each host column is hidden', async () => {
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 800px"
        .assets=${makeAssets(2)}
        .columns=${COLUMNS}
        .hiddenFields=${COLUMNS.map((column) => column.field)}
      ></cx-content-browser-table>
    `, 2);

    await waitForCtaColumnFit(el);

    const table = getTableRoot(el).querySelector<HTMLElement>('.tabulator')!.getBoundingClientRect();
    const header = getColumnHeader(el, CTA_FIELD).getBoundingClientRect();

    expect(Math.abs(header.right - table.right) <= 1, `the CTA column ends at ${header.right}, the table at ${table.right}`)
      .to.equal(true);
  });

  describe('with the row count', () => {
    it('sends no row count for a hide or a show of a column', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      el.hiddenFields = ['Custom.Date'];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');
      el.hiddenFields = [];
      await elementUpdated(el);
      await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
      await settle(400);

      expect(spy.callCount, 'a hide or a show sent a row count').to.equal(0);
    });

    it('reports the count once for a restarted list whose first page hides the multi-line column', async () => {
      const columns = [COLUMNS[0], COLUMNS[1], { ...COLUMNS[2], lines: 2 }];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${columns}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      // `content-browser` sets the flag of a new list with its first page.
      el.assets = makeFlaggedAssets(60, 0, 'Dell.Snippet', 'other');
      el.hiddenFields = ['Dell.Snippet'];
      await elementUpdated(el);
      await waitUntil(() => tabulator.getRows()[0]?.getData().id === 'other-0', 'the new list never replaced the rows',
        { interval: 20, timeout: 5000 });
      await settle(400);

      expect(spy.callCount, 'the restarted list did not report its count once').to.equal(1);
      expect((spy.firstCall.args[0] as CustomEvent<{ rowCount: number }>).detail.rowCount).to.equal(20);
      expect(getShownHeaderTitles(el)).to.deep.equal(['Identifier', 'Date']);
    });
  });

  it('keeps the focus and the scroll position when the host hides and shows a column while an off-screen CTA holds the focus', async () => {
    const page = await fixture<HTMLDivElement>(html`
      <div>
        <button class="before">before</button>
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(60)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      </div>
    `);
    const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

    await waitForRows(el, 60);
    await waitForCtaColumnFit(el);

    const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;
    const scrollport = getScrollport(el);
    const scrolled = oneEvent(scrollport, 'scroll');

    expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

    // Above the scrollport, but still inside the rows Tabulator keeps rendered around it.
    scrollport.scrollTop = 4 * ROW_HEIGHT;
    await scrolled;

    const before = scrollport.scrollTop;

    el.hiddenFields = ['Custom.Date'];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Snippet'], 'the column was never hidden');
    await settle(200);

    expect(hasFocus(cta), 'the hide took the focus off the CTA').to.equal(true);
    expect(scrollport.scrollTop, 'the hide scrolled the rows').to.equal(before);

    el.hiddenFields = [];
    await elementUpdated(el);
    await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
    await settle(200);

    expect(hasFocus(cta), 'the show took the focus off the CTA').to.equal(true);
    expect(scrollport.scrollTop, 'the show scrolled the rows').to.equal(before);
  });
});
