import './content-browser-table';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import {
  resetMouse,
  sendMouse,
} from '@web/test-runner-commands';
import sinon from 'sinon';

import type { TableColumn } from '@/types/content-browser';

import { measureTextWidth } from './column-layout';
import type ContentBrowserTable from './content-browser-table';
import {
  FILLER_FIELD,
  MIN_COLUMN_WIDTH,
  readCellValue,
  ROW_HEIGHT,
} from './content-browser-table';
import {
  centerOf,
  COLUMNS,
  dispatchResize,
  doubleClick,
  dragColumnHandle,
  dragToMinimum,
  expectRowsFill,
  getBlankBelowRows,
  getColumnHeader,
  getColumnsTotal,
  getColumnWidth,
  getColumnWidthByField,
  getContainer,
  getCta,
  getCtaOverlay,
  getCtaWidth,
  getCtaLabel,
  getCxTable,
  getDataCells,
  getHeaderTitles,
  getInnerWidth,
  getResizeHandles,
  getRowElement,
  getRowElements,
  getScrollport,
  getTableRoot,
  hasFocus,
  isCtaOverlayFitted,
  isShown,
  makeAsset,
  makeAssets,
  mount,
  resizeObserverEntry,
  settle,
  SINGLE_LINE_COLUMNS,
  stubInputQueries,
  tabToCta,
  waitForCtaLayout,
  waitForRows,
} from './content-browser-table.test-helpers';

describe('content-browser-table', () => {
  beforeEach(() => {
    stubInputQueries();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('columns', () => {
    it('renders one visible header per configured column, in order', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);
      const headers = [...getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col')];
      const own = headers.slice(-1);

      expect(getHeaderTitles(el).join('|')).to.equal('Identifier|Snippet');
      expect(headers.length).to.equal(COLUMNS.length + 1);
      expect(own.map((header) => header.getAttribute('tabulator-field')).join('|')).to.equal(FILLER_FIELD);
      expect(own[0].textContent?.trim()).to.equal('');
      expect(getComputedStyle(own[0]).opacity).to.equal('0');
    });

    it('gives the filler no resize handle and no sort', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      const definition = getCxTable(el)!.columns!.find((column) => column.field === FILLER_FIELD)!;
      const header = getColumnHeader(el, FILLER_FIELD);

      expect(definition.resizable, 'the filler column can be resized').to.equal(false);
      expect(definition.headerSort, 'the filler column can be sorted').to.equal(false);
      // Tabulator puts a column's divider right after its header.
      expect(Boolean(header.nextElementSibling?.classList.contains('tabulator-col-resize-handle')),
        'the filler column has a divider').to.equal(false);
    });

    it('names the untitled filler header after the CTA, and renames it with the cta text', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const header = () => getColumnHeader(el, FILLER_FIELD);

      expect(header().getAttribute('role')).to.equal('columnheader');
      expect(header().getAttribute('aria-label')).to.equal('Insert');
      expect(header().hasAttribute('aria-hidden'), 'the header is out of the accessibility tree').to.equal(false);
      expect(header().textContent?.trim()).to.equal('');

      el.ctaText = 'add to page';
      await elementUpdated(el);

      expect(header().getAttribute('aria-label'), 'a new cta text left the old name').to.equal('add to page');

      // A new column set builds the filler column again.
      el.columns = [SINGLE_LINE_COLUMNS[0]];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier',
        'the table never dropped the column', { interval: 20, timeout: 3000 });

      expect(header().getAttribute('aria-label'), 'the rebuilt header lost its name').to.equal('add to page');
    });

    it('fits the action overlay to a new label without a change to data widths', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaLayout(el);

      const before = getCtaWidth(el);
      const dataWidths = SINGLE_LINE_COLUMNS.map((_, index) => getColumnWidth(el, index));

      el.ctaText = 'Add this asset to the page';
      await elementUpdated(el);
      await waitUntil(async () => getCtaLabel((await getCta(getRowElement(el, 'asset-0')))!) === 'Add This Asset To The Page',
        'the CTA was never relabelled', { interval: 20, timeout: 3000 });
      await waitForCtaLayout(el);

      const total = getColumnsTotal(el);

      expect(getCtaWidth(el) > before, `the action stayed ${before}px wide for a longer label`).to.equal(true);
      expect(SINGLE_LINE_COLUMNS.map((_, index) => getColumnWidth(el, index))).to.deep.equal(dataWidths);
      expect(total <= 700 + 1, `the columns take ${total}px of a 700px table`).to.equal(true);
    });

    it('fits the action overlay under an ancestor that scales the picker', async () => {
      const host = await fixture<HTMLDivElement>(html`
        <div style="transform: scale(0.5); transform-origin: 0 0">
          <cx-content-browser-table
            style="height: 400px; width: 700px"
            cta-text="Add this asset to the page"
            .assets=${[makeAsset()]}
            .columns=${SINGLE_LINE_COLUMNS}
          ></cx-content-browser-table>
        </div>
      `);
      const el = host.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 1);

      await waitForCtaLayout(el);

      const cta = (await getCta(getRowElements(el)[0]))!;
      const cell = cta.parentElement!;
      const style = getComputedStyle(cell);
      const content = Math.round(cell.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight));

      // Whole pixels on both sides: a pixel of rounding each way, never the half a scale of 0.5 leaves.
      expect(Math.abs(cta.offsetWidth - content) <= 2,
        `the ${cta.offsetWidth}px CTA sits in a ${content}px cell content box`).to.equal(true);
    });

    it('fits the action overlay to a label set while the table was hidden', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      await waitForCtaLayout(el);

      const previousWidth = getCtaWidth(el);
      const observedWidths: number[] = [];
      const observer = new ResizeObserver((entries) => {
        observedWidths.push(entries[0].contentRect.width);
      });

      observer.observe(el);
      await waitUntil(() => observedWidths.length > 0, 'the table was never observed', { interval: 20, timeout: 3000 });

      // A panel or tab the host hides keeps the rows and their CTAs on the page, with no width.
      el.style.display = 'none';
      el.ctaText = 'Add this asset to the page';
      await elementUpdated(el);
      // A hidden tab stays hidden for one frame or more, so the resize observers see the width of 0.
      await waitUntil(() => observedWidths[observedWidths.length - 1] === 0,
        'the browser never laid the hidden table out', { interval: 20, timeout: 3000 });
      observer.disconnect();

      el.style.display = '';

      const firstCta = () => getCta(getRowElements(el)[0]);

      await waitUntil(async () => isCtaOverlayFitted(await firstCta()), '', { interval: 20, timeout: 2000 })
        .catch(() => undefined);

      const cta = (await firstCta())!;

      expect(getCtaLabel(cta), 'the hidden CTA kept its old label').to.equal('Add This Asset To The Page');
      expect(getCtaWidth(el)).to.be.greaterThan(previousWidth);
      expect(isCtaOverlayFitted(cta), 'the action overlay clips the new label').to.equal(true);
    });

    it('keeps the data widths when a new page adds row actions', async () => {
      const firstPage = makeAssets(2);
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${firstPage} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaLayout(el);

      const widths = SINGLE_LINE_COLUMNS.map((_, index) => getColumnWidth(el, index));

      el.assets = [...firstPage, ...makeAssets(2, 2)];
      await elementUpdated(el);
      await waitForRows(el, 4);

      const appended = await getCta(getRowElement(el, 'asset-3'));

      await settle(100);

      expect(appended !== undefined, 'the appended row rendered no CTA').to.equal(true);
      expect(SINGLE_LINE_COLUMNS.map((_, index) => getColumnWidth(el, index))).to.deep.equal(widths);
    });

    it('relabels its CTAs without building an element for a row it has not rendered', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(200)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 200);
      // Far below the rendered rows, and short of the last row, which the table observes for the end of the list.
      const getElement = sinon.spy(getCxTable(el)!.tabulatorInstance!.getRows()[150], 'getElement');

      el.ctaText = 'place';
      await elementUpdated(el);
      await waitUntil(async () => getCtaLabel((await getCta(getRowElement(el, 'asset-0')))!) === 'Place',
        'a rendered row kept its old label', { interval: 20, timeout: 3000 });

      expect(getElement.callCount, 'the relabel built the element of a row never rendered').to.equal(0);
    });

    it('relabels only the CTA its row renders now, never one the row formatted before', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const replaced = (await getCta(getRowElement(el, 'asset-0')))!;
      const label = replaced.querySelector('span')!.textContent;

      // Tabulator formats a row again for every new list, and for a row that scrolls back after a redraw.
      (getCxTable(el)!.tabulatorInstance!.getRow('asset-0') || undefined)?.reformat();

      const current = (await getCta(getRowElement(el, 'asset-0')))!;

      expect(current !== replaced && !replaced.isConnected, 'formatting the row again kept its old CTA').to.equal(true);

      el.ctaText = 'place';
      await elementUpdated(el);
      await waitUntil(() => getCtaLabel(current) === 'Place', 'the new CTA kept its old label', { interval: 20, timeout: 3000 });

      expect(replaced.querySelector('span')!.textContent, 'the relabel still reached the CTA the row replaced').to.equal(label);
    });

    describe('in a table wider than its host', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('keeps the hovered row\'s CTA inside the visible table, with no divider at its left edge', async () => {
        // The runner loads no design-system theme: the token paints the divider as a themed page does.
        const el = await mount(html`
          <cx-content-browser-table
            style="height: 400px; width: 500px; --cx-color-neutral-300: rgb(1, 2, 3)"
            .assets=${makeAssets(2)}
            .columns=${SINGLE_LINE_COLUMNS}
            .savedWidths=${{ 'CoreField.Identifier': 600, 'Dell.Snippet': 600 }}
          ></cx-content-browser-table>
        `, 2);
        const row = getRowElement(el, 'asset-0')!;
        const cta = (await getCta(row))!;
        const scrollport = getScrollport(el);

        await waitForCtaLayout(el);
        await sendMouse({ position: centerOf(getDataCells(row)[0]), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        const box = cta.getBoundingClientRect();
        const left = scrollport.getBoundingClientRect().left + scrollport.clientLeft;
        const right = left + scrollport.clientWidth;
        const hit = getTableRoot(el).elementFromPoint(...centerOf(cta));
        const divider = getComputedStyle(getTableRoot(el).querySelector('.tabulator')!, '::after');
        const cell = getCtaOverlay(row)!;
        const dividerShows = divider.content !== 'none' && divider.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const cellEdgeShows = Number.parseFloat(getComputedStyle(cell).borderLeftWidth) > 0
          && getComputedStyle(cell).borderLeftColor !== 'rgba(0, 0, 0, 0)';

        expect(scrollport.scrollWidth > scrollport.clientWidth, 'the columns fit the table').to.equal(true);
        expect(box.left >= left - 0.5 && box.right <= right + 0.5,
          `the CTA spans ${box.left}-${box.right}px, outside the visible ${left}-${right}px`).to.equal(true);
        expect(Boolean(hit) && cta.contains(hit), 'the CTA is not what the pointer lands on').to.equal(true);
        expect(dividerShows, `a ${divider.width} divider paints in ${divider.backgroundColor}`).to.equal(false);
        expect(cellEdgeShows, `the CTA cell paints a left edge in ${getComputedStyle(cell).borderLeftColor}`).to.equal(false);
      });
    });

    it('renders a column title as text, never as markup', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[makeAsset()]}
          .columns=${[
            { field: 'CoreField.Identifier', title: 'Size <kb>' },
            { field: 'Dell.Snippet', title: '<b>Snippet</b>' },
          ]}
        ></cx-content-browser-table>
      `);

      expect(getHeaderTitles(el).join('|')).to.equal('Size <kb>|<b>Snippet</b>');
      expect(getTableRoot(el).querySelector('.tabulator-col-title b') === null).to.equal(true);
    });

    it('sorts nothing itself: the list order is the search order', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      expect(getCxTable(el)!.columnDefaults.headerSort).to.equal(false);
    });

    it('renders a row per asset whose cells read the host-configured Cortex fields', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);
      const cells = getDataCells(getRowElements(el)[0]);

      expect(cells.map((cell) => cell.textContent?.trim()).join('|')).to.equal('FRAG-1|A fragment of text');
    });

    it('renders a single-line row at the height the page size is counted in', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      expect(Math.round(getRowElement(el, 'asset-0')!.getBoundingClientRect().height)).to.equal(ROW_HEIGHT);
    });

    it('renders an empty cell for a field the response did not return', async () => {
      const asset = makeAsset();

      delete (asset as unknown as Record<string, unknown>)['Dell.Snippet'];

      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[asset]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      expect(getRowElements(el)[0].querySelectorAll('.tabulator-cell')[1].textContent?.trim()).to.equal('');
    });

    it('inserts a DAM value as text, never as markup', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[makeAsset({ 'Dell.Snippet': '<img src="x" class="injected">' })]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);
      const cell = getRowElements(el)[0].querySelectorAll('.tabulator-cell')[1];

      expect(cell.querySelector('.injected') === null).to.equal(true);
      expect(cell.textContent?.trim()).to.equal('<img src="x" class="injected">');
    });

    it('reads a column named after an Object.prototype member as empty', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[makeAsset()]}
          .columns=${[{ field: 'toString', title: 'Odd' }, { field: 'constructor', title: 'Odder' }]}
        ></cx-content-browser-table>
      `);
      const cells = getDataCells(getRowElements(el)[0]);

      expect(cells.map((cell) => cell.textContent?.trim()).join('|')).to.equal('|');
    });

    it('resolves the column keys once for a whole list, not once per row', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const resolveColumnKeys = sinon.spy(el as unknown as { resolveColumnKeys(): string[] }, 'resolveColumnKeys');

      el.assets = makeAssets(5, 0, 'other');
      await elementUpdated(el);

      expect(resolveColumnKeys.callCount).to.equal(1);
    });

    it('rebuilds the rows when the columns change', async () => {
      // Single-line before and after, so the row height holds and `cx-table` keeps its instance:
      // only the column change can bring the new values in.
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[makeAsset({ name: 'The name' })]}
          .columns=${SINGLE_LINE_COLUMNS}
        ></cx-content-browser-table>
      `);

      el.columns = [{ field: 'name', title: 'Name' }];
      await elementUpdated(el);
      await waitUntil(
        () => getHeaderTitles(el).join('|') === 'Name'
          && getRowElements(el)[0]?.querySelector('.tabulator-cell')?.textContent?.trim() === 'The name',
        'the rows never took the new column',
        { interval: 20, timeout: 3000 },
      );
    });

    it('rebuilds the rows when the host changes its column array in place', async () => {
      const columns: TableColumn[] = SINGLE_LINE_COLUMNS.map((column) => ({ ...column }));
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset({ name: 'The name' })]} .columns=${columns}>
        </cx-content-browser-table>
      `);

      columns.splice(0, columns.length, { field: 'name', title: 'Name' });
      el.requestUpdate();
      await elementUpdated(el);
      await waitUntil(
        () => getHeaderTitles(el).join('|') === 'Name'
          && getRowElements(el)[0]?.querySelector('.tabulator-cell')?.textContent?.trim() === 'The name',
        'the rows never took the new column',
        { interval: 20, timeout: 3000 },
      );
    });

    it('fills a new column on the rows it holds when the refetch after the column change brings more assets', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const heldRow = getRowElement(el, 'asset-0');

      el.columns = [...SINGLE_LINE_COLUMNS, { field: 'Dell.Region', title: 'Region' }];
      await elementUpdated(el);
      // Built again from the assets the table holds, which were fetched without the new field.
      await waitUntil(() => getRowElement(el, 'asset-0') !== heldRow, 'the rows were never built again',
        { interval: 20, timeout: 3000 });
      await settle(100);

      // `content-browser` fetches the first page again with the new field: the same assets, as new objects.
      el.assets = makeAssets(3).map((asset) => makeAsset({ ...asset, 'Dell.Region': `Region of ${asset.id}` }));
      await elementUpdated(el);

      const regionOfFirstRow = () => {
        const row = getRowElement(el, 'asset-0');

        return row ? getDataCells(row)[2]?.textContent?.trim() ?? '' : '';
      };

      await waitUntil(() => regionOfFirstRow() === 'Region of asset-0', '', { interval: 20, timeout: 3000 })
        .catch(() => undefined);

      expect(regionOfFirstRow(), 'the rows the table held kept the new column blank').to.equal('Region of asset-0');
    });

    it('shows each value under its own header once the columns are reordered', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      el.columns = [SINGLE_LINE_COLUMNS[1], SINGLE_LINE_COLUMNS[0]];
      await elementUpdated(el);
      // `cx-table` moves the headers and lays the rows it holds out under them at once.
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Snippet|Identifier',
        'the table never took the new column order', { interval: 20, timeout: 3000 });

      expect(getDataCells(getRowElements(el)[0]).map((cell) => cell.textContent?.trim()).join('|'))
        .to.equal('A fragment of text|FRAG-1');
    });

    it('builds the rows again only for a column whose field they hold no value for', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const setData = sinon.spy(getCxTable(el)!.tabulatorInstance!, 'setData');
      const snippetOf = (assetId: string) => {
        const row = getRowElement(el, assetId);

        return row ? getDataCells(row)[1]?.textContent?.trim() ?? '' : '';
      };

      // A new title leaves every value under its key: `cx-table` lays the rows it holds out under the
      // new columns itself.
      el.columns = [{ ...SINGLE_LINE_COLUMNS[0], title: 'Code' }, { ...SINGLE_LINE_COLUMNS[1] }];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Code|Snippet',
        'the table never took the new title', { interval: 20, timeout: 3000 });
      await settle(100);

      expect(setData.called, 'a new title built every row again').to.equal(false);
      expect(snippetOf('asset-0')).to.equal('A fragment of text');

      // The rows a new list brings while a column is away hold no value for it when it comes back.
      el.columns = [SINGLE_LINE_COLUMNS[0]];
      await elementUpdated(el);
      el.assets = makeAssets(2, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the new list never replaced the rows', { interval: 20, timeout: 3000 });

      el.columns = SINGLE_LINE_COLUMNS.map((column) => ({ ...column }));
      await elementUpdated(el);
      await waitUntil(() => snippetOf('other-0') === 'A fragment of text', '', { interval: 20, timeout: 3000 })
        .catch(() => undefined);

      expect(snippetOf('other-0'), 'the column that came back stayed blank').to.equal('A fragment of text');
    });

    it('keeps a dragged width when the host re-renders with the same columns', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      const start = Math.round(getColumnWidth(el, 0));

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      // `content-browser` hands over a new array on every render.
      el.columns = SINGLE_LINE_COLUMNS.map((column) => ({ ...column }));
      await elementUpdated(el);
      await elementUpdated(getCxTable(el)!);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
    });

    it('keeps the dragged width of a column that survives a change to the column set', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      const start = Math.round(getColumnWidth(el, 0));

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      el.columns = [...SINGLE_LINE_COLUMNS, { field: 'name', title: 'Name' }];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier|Snippet|Name',
        'the table never took the new column', { interval: 20, timeout: 3000 });

      expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
    });

    it('keeps a dragged column at its width when a new list replaces the rows', async () => {
      const columns: TableColumn[] = [...SINGLE_LINE_COLUMNS, { field: 'name', title: 'Name' }];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[1], -100);

      const { detail } = await resized;

      // A new list lays every column out again.
      el.assets = makeAssets(3, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the rows were never replaced', { interval: 20, timeout: 3000 });

      expect(detail.field).to.equal('Dell.Snippet');
      expect(Math.round(getColumnWidth(el, 1))).to.equal(detail.width);
    });

    it('keeps the other columns as they are around a dragged width when a new list replaces the rows', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      const start = Math.round(getColumnWidth(el, 0));
      const other = Math.round(getColumnWidth(el, 1));

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await resized;

      el.assets = makeAssets(3, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the rows were never replaced', { interval: 20, timeout: 3000 });

      const scrollport = getScrollport(el);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
      expect(Math.round(getColumnWidth(el, 1)), 'the other column gave up width to the dragged one').to.equal(other);
      expect(scrollport.scrollWidth > scrollport.clientWidth, 'the wider columns did not scroll').to.equal(true);
    });

    it('keeps a dragged width when the table comes back after a list with no result', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      const start = Math.round(getColumnWidth(el, 0));

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      el.assets = [];
      el.empty = true;
      await elementUpdated(el);

      expect(getCxTable(el) === null, 'the table stayed on screen for an empty list').to.equal(true);

      el.assets = makeAssets(2);
      el.empty = false;
      await elementUpdated(el);
      await waitForRows(el, 2);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
    });

    it('keeps a dragged width when a move of the picker rebuilds the table', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      const start = Math.round(getColumnWidth(el, 0));

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      const before = getCxTable(el)!.tabulatorInstance;
      const parent = el.parentElement!;

      el.remove();
      parent.appendChild(el);
      await waitUntil(() => {
        const tabulator = getCxTable(el)!.tabulatorInstance;

        return Boolean(tabulator && tabulator !== before && !tabulator.destroyed && tabulator.getRows().length === 1
          && getRowElements(el).length > 0);
      }, 'the table was never rebuilt', { interval: 20, timeout: 5000 });

      expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
    });

    it('keeps the action label and data widths after a move of the picker', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px"
          cta-text="Add this asset to the page"
          .assets=${[makeAsset()]}
          .columns=${SINGLE_LINE_COLUMNS}
        ></cx-content-browser-table>
      `);

      await waitForCtaLayout(el);

      const widths = SINGLE_LINE_COLUMNS.map((_, index) => getColumnWidth(el, index));
      const before = getCxTable(el)!.tabulatorInstance;
      const parent = el.parentElement!;

      el.remove();
      parent.appendChild(el);
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance !== before && getRowElements(el).length > 0,
        'the table was never rebuilt', { interval: 20, timeout: 5000 });
      await waitForCtaLayout(el);

      expect(getCtaLabel((await getCta(getRowElements(el)[0]))!)).to.equal('Add This Asset To The Page');
      expect(SINGLE_LINE_COLUMNS.map((_, index) => getColumnWidth(el, index))).to.deep.equal(widths);
    });

    it('uses the dragged width again when the host adds the column back', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      const start = Math.round(getColumnWidth(el, 0));

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      el.columns = [SINGLE_LINE_COLUMNS[1]];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Snippet',
        'the table never dropped the column', { interval: 20, timeout: 3000 });

      // Configured again, it gets the width the user dragged it to before it went away.
      el.columns = SINGLE_LINE_COLUMNS.map((column) => ({ ...column }));
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier|Snippet',
        'the table never took the column back', { interval: 20, timeout: 3000 });

      expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
    });
  });

  describe('auto-fit', () => {
    const FIT_COLUMNS: TableColumn[] = [
      { field: 'CoreField.Identifier', title: 'Identifier' },
      { field: 'Dell.Snippet', title: 'Snippet' },
    ];
    const LONG_SNIPPET = 'x'.repeat(400);

    function mountFit(
      assets = [makeAsset({ 'Dell.Snippet': LONG_SNIPPET })],
      columns: TableColumn[] = FIT_COLUMNS,
      savedWidths: Record<string, number> = {},
      style = 'height: 400px; width: 1000px',
    ) {
      return mount(html`
        <cx-content-browser-table style=${style} .assets=${assets} .columns=${columns} .savedWidths=${savedWidths}>
        </cx-content-browser-table>
      `, assets.length);
    }

    function getFitWidths(el: ContentBrowserTable) {
      return el.columns.map(({ field }) => getColumnWidthByField(el, field));
    }

    /** The width of a header title as the text renders, clipped or not. */
    function getTitleTextWidth(el: ContentBrowserTable, field: string) {
      const index = el.columns.findIndex((column) => column.field === field);
      const key = String(getCxTable(el)!.columns![index].field);
      const range = document.createRange();

      range.selectNodeContents(getColumnHeader(el, key).querySelector('.tabulator-col-title cx-line-clamp')!);

      return range.getBoundingClientRect().width;
    }

    it('gives a short column its content width', async () => {
      const el = await mountFit();

      await settle(200);

      const identifier = getColumnWidthByField(el, 'CoreField.Identifier');

      expect(identifier, 'the short column is wider than its content').to.be.below(200);
      expect(identifier).to.be.at.least(MIN_COLUMN_WIDTH);
    });

    it('gives a long column the space that is left (rule A)', async () => {
      const el = await mountFit();

      await settle(200);

      const [identifier, snippet] = getFitWidths(el);

      expect(identifier + snippet).to.be.closeTo(getInnerWidth(el) - 6, 1);
    });

    it('fills the width on the first load when the content is short', async () => {
      const el = await mountFit([makeAsset()]);

      await settle(200);

      const [identifier, snippet] = getFitWidths(el);

      // Each auto-fit column gets an equal part of the spare width, so the columns end at the resize buffer.
      expect(identifier + snippet).to.be.closeTo(getInnerWidth(el) - 6, 1);
      expect(identifier, 'the short columns did not grow').to.be.above(300);
    });

    it('ends the table at the last column when every column has a saved width', async () => {
      const el = await mountFit([makeAsset()], FIT_COLUMNS, { 'CoreField.Identifier': 160, 'Dell.Snippet': 200 });

      await settle(200);

      expect(getFitWidths(el)).to.deep.equal([160, 200]);
      expect(getColumnsTotal(el)).to.be.below(getInnerWidth(el) - 100);
    });

    it('ignores width, lines and align from the host', async () => {
      const plain = await mountFit();
      const configured = await mountFit(undefined, [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '600px' },
        { align: 'right', field: 'Dell.Snippet', lines: 3, title: 'Snippet', width: '600px' },
      ]);

      await settle(200);

      expect(getFitWidths(configured)).to.deep.equal(getFitWidths(plain));
      expect(Math.round(getRowElements(configured)[0].getBoundingClientRect().height)).to.equal(ROW_HEIGHT);
    });

    it('floors a column at 92px', async () => {
      // A saved width that uses all the space leaves no spare width for the short column.
      const el = await mountFit(
        [makeAsset({ Letter: 'A' })],
        [{ field: 'Letter', title: 'A' }, ...FIT_COLUMNS],
        { 'CoreField.Identifier': 1000, 'Dell.Snippet': 1000 },
      );

      await settle(200);

      expect(getColumnWidthByField(el, 'Letter')).to.equal(92);
    });

    it('uses the header width for a column with no values', async () => {
      const columns: TableColumn[] = [
        ...FIT_COLUMNS,
        { field: 'Missing.Field', title: 'A long title for a field that no asset holds' },
      ];
      const el = await mountFit(undefined, columns);

      await settle(200);

      const width = getColumnWidthByField(el, 'Missing.Field');

      expect(width).to.be.at.least(Math.ceil(getTitleTextWidth(el, 'Missing.Field')));
      expect(width).to.be.at.least(MIN_COLUMN_WIDTH);
    });

    it('uses a saved width', async () => {
      const el = await mountFit(undefined, FIT_COLUMNS, { 'Dell.Snippet': 300 });

      await settle(200);

      expect(getColumnWidthByField(el, 'Dell.Snippet')).to.equal(300);
    });

    it('lays a column out again when the saved widths change after mount', async () => {
      const el = await mountFit();

      await settle(200);
      expect(getColumnWidthByField(el, 'CoreField.Identifier')).to.not.equal(250);

      el.savedWidths = { 'CoreField.Identifier': 250 };
      await elementUpdated(el);
      await settle(200);

      expect(getColumnWidthByField(el, 'CoreField.Identifier')).to.equal(250);
    });

    it('auto-fits a column again when the new saved widths do not hold it', async () => {
      const plain = await mountFit();
      const el = await mountFit(undefined, FIT_COLUMNS, { 'CoreField.Identifier': 250 });

      await settle(200);
      expect(getColumnWidthByField(el, 'CoreField.Identifier')).to.equal(250);

      // The saved widths of another site, which has no width for this column.
      el.savedWidths = { 'Other.Field': 300 };
      await elementUpdated(el);
      await settle(200);

      expect(getColumnWidthByField(el, 'CoreField.Identifier')).to.equal(getColumnWidthByField(plain, 'CoreField.Identifier'));
    });

    /**
     * The width of the text of a data cell, unclipped, in the font that the text renders in. A span on
     * the page with the same font longhands measures it: the clamp clips its own box.
     */
    function getCellTextWidth(cell: HTMLElement) {
      const clamp = cell.querySelector('cx-line-clamp')!;
      const style = getComputedStyle(clamp);
      const span = document.createElement('span');

      span.textContent = clamp.textContent;
      Object.assign(span.style, {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontStyle: style.fontStyle,
        fontVariantNumeric: style.fontVariantNumeric,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        position: 'absolute',
        whiteSpace: 'nowrap',
      });
      document.body.append(span);

      const width = span.getBoundingClientRect().width;

      span.remove();

      return width;
    }

    /** Whether the text of a data cell overflows the content box of the cell. */
    function isCellClipped(cell: HTMLElement) {
      const style = getComputedStyle(cell);
      const content = cell.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);

      return getCellTextWidth(cell) > content + 0.5 || cell.scrollWidth > cell.clientWidth;
    }

    const MID_IDENTIFIER = 'IDENTIFIER-0123456789-AB';

    it('does not clip a short column when the host font has a sub-property the font shorthand cannot hold', async () => {
      // The measure canvas keeps the last font it took, and an empty font string does not change it.
      measureTextWidth('x', '8px serif');

      const el = await mountFit(
        [makeAsset({ 'CoreField.Identifier': MID_IDENTIFIER, 'Dell.Snippet': LONG_SNIPPET })],
        FIT_COLUMNS,
        {},
        'height: 400px; width: 1000px; font-size: 16px; font-variant-numeric: tabular-nums',
      );

      await settle(200);

      const cell = getDataCells(getRowElements(el)[0])[0];

      expect(getComputedStyle(cell.querySelector('cx-line-clamp')!).font, 'the browser kept the font shorthand').to.equal('');
      expect(isCellClipped(cell), `the ${getColumnWidthByField(el, 'CoreField.Identifier')}px column clips its text`).to.equal(false);
    });

    it('fits a short column with the cell padding of the design system', async () => {
      // The runner loads no design-system theme: the spacing tokens pad the cells as a themed page does.
      const el = await mountFit(
        [makeAsset({ 'CoreField.Identifier': MID_IDENTIFIER, 'Dell.Snippet': LONG_SNIPPET })],
        FIT_COLUMNS,
        {},
        'height: 400px; width: 1000px; --cx-spacing-2x-small: 4px; --cx-spacing-large: 24px',
      );

      await settle(200);

      const cell = getDataCells(getRowElements(el)[0])[0];
      const style = getComputedStyle(cell);
      const padding = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);

      expect(Number.parseFloat(style.paddingLeft) >= 24, 'the tokens left the cells unpadded').to.equal(true);
      expect(getColumnWidthByField(el, 'CoreField.Identifier')).to.be.at.least(Math.floor(getCellTextWidth(cell) + padding));
      expect(isCellClipped(cell)).to.equal(false);
    });

    it('does not clip a short value when the cells have borders', async () => {
      const el = await mountFit(
        [makeAsset({ 'CoreField.Identifier': MID_IDENTIFIER, 'Dell.Snippet': LONG_SNIPPET })],
        FIT_COLUMNS,
        {},
        'height: 400px; width: 1000px; --cx-spacing-2x-small: 4px; --cx-spacing-large: 24px',
      );
      const style = document.createElement('style');

      // A themed page at a device pixel ratio of 1.5 paints the cell edges with a fraction of a pixel.
      style.textContent = '.tabulator-cell, .tabulator-col { border-left: 0.67px solid !important; border-right: 0.67px solid !important; }';
      getTableRoot(el).append(style);

      // New saved widths, for another site, lay the columns out again and measure them.
      el.savedWidths = { 'Other.Field': 300 };
      await elementUpdated(el);
      await settle(200);

      const cell = getDataCells(getRowElements(el)[0])[0];
      const clamp = cell.querySelector('cx-line-clamp')!;
      const cellStyle = getComputedStyle(cell);
      const edges = Number.parseFloat(cellStyle.paddingLeft) + Number.parseFloat(cellStyle.paddingRight)
        + Number.parseFloat(cellStyle.borderLeftWidth) + Number.parseFloat(cellStyle.borderRightWidth);

      expect(Number.parseFloat(cellStyle.borderLeftWidth) > 0, 'the cell has no border').to.equal(true);
      expect(getColumnWidthByField(el, 'CoreField.Identifier')).to.be.at.least(getCellTextWidth(cell) + edges);
      expect(clamp.scrollWidth <= clamp.clientWidth, 'the text of the cell is clipped').to.equal(true);
      expect(isCellClipped(cell)).to.equal(false);
    });

    it('measures the columns again once the web fonts are ready', async () => {
      const el = await mountFit();

      await settle(200);

      let ready!: () => void;
      const fonts = document.fonts;
      const original = Object.getOwnPropertyDescriptor(fonts, 'ready');

      Object.defineProperty(fonts, 'status', { configurable: true, value: 'loading' });
      Object.defineProperty(fonts, 'ready', { configurable: true, value: new Promise<void>((resolve) => { ready = resolve; }) });

      try {
        const layout = sinon.spy(el as unknown as { applyColumnLayout: () => void }, 'applyColumnLayout');

        el.savedWidths = { 'Other.Field': 300 };
        await elementUpdated(el);
        await settle(200);

        const before = layout.callCount;

        Object.defineProperty(fonts, 'status', { configurable: true, value: 'loaded' });
        ready();
        await settle(100);

        expect(layout.callCount, 'the columns kept the widths of the fallback font').to.be.greaterThan(before);
      } finally {
        delete (fonts as unknown as Record<string, unknown>).status;

        if (original) {
          Object.defineProperty(fonts, 'ready', original);
        } else {
          delete (fonts as unknown as Record<string, unknown>).ready;
        }
      }
    });

    it('scrolls horizontally when the minimums do not fit', async () => {
      const el = await mountFit(undefined, [...FIT_COLUMNS, { field: 'name', title: 'Name' }], {}, 'height: 400px; width: 150px');

      await settle(200);

      const scrollport = getScrollport(el);

      expect(scrollport.scrollWidth).to.be.greaterThan(scrollport.clientWidth);
    });

    it('does not lay the columns out again for an appended page', async () => {
      const firstPage = makeAssets(2);
      const el = await mountFit(firstPage);

      await settle(200);

      const widths = getFitWidths(el);

      el.assets = [...firstPage, ...makeAssets(2, 2).map((asset) => makeAsset({ ...asset, 'Dell.Snippet': 'y'.repeat(200) }))];
      await elementUpdated(el);
      await waitForRows(el, 4);
      await settle();

      expect(getFitWidths(el)).to.deep.equal(widths);
    });

    it('lays the columns out again for a new list', async () => {
      const el = await mountFit(makeAssets(2));

      await settle(200);

      const [identifier] = getFitWidths(el);

      el.assets = makeAssets(2, 0, 'other').map((asset) => makeAsset({
        ...asset,
        'CoreField.Identifier': 'AN IDENTIFIER THAT IS FAR LONGER THAN ANY BEFORE IT',
      }));
      await elementUpdated(el);
      await waitUntil(() => getFitWidths(el)[0] > identifier, '', { interval: 20, timeout: 3000 }).catch(() => undefined);

      expect(getFitWidths(el)[0]).to.be.greaterThan(identifier);
    });

    it('lays the columns out again when the container gets narrower', async () => {
      const el = await mountFit();

      await settle(200);

      const [, snippet] = getFitWidths(el);

      el.style.width = '600px';
      dispatchResize(el, resizeObserverEntry(getContainer(el), 400, 600));
      await waitUntil(() => getFitWidths(el)[1] < snippet, '', { interval: 20, timeout: 3000 }).catch(() => undefined);

      expect(getFitWidths(el)[1]).to.be.below(snippet);
    });

    it('shows the full value of a clipped cell on hover', async () => {
      const el = await mountFit();

      await settle(200);

      const clamp = getDataCells(getRowElements(el)[0])[1].querySelector('cx-line-clamp')!;

      expect(clamp.getAttribute('title')).to.equal(LONG_SNIPPET);
    });

    it('keeps the widths of an appended page that first shows the vertical scrollbar, but for the scrollbar', async () => {
      const firstPage = makeAssets(2);
      const el = await mountFit(firstPage);
      const scrollport = getScrollport(el);

      // The headless runner hides its scrollbars: a 12px classic scrollbar shows once the rows overflow.
      Object.defineProperty(scrollport, 'clientWidth', {
        configurable: true,
        get: () => scrollport.offsetWidth - (scrollport.scrollHeight > scrollport.clientHeight ? 12 : 0),
      });
      await settle(200);

      const widths = getFitWidths(el);

      expect(scrollport.scrollHeight > scrollport.clientHeight, 'the first page already scrolls').to.equal(false);

      el.assets = [...firstPage, ...makeAssets(30, 2).map((asset) => makeAsset({
        ...asset,
        'CoreField.Identifier': 'AN IDENTIFIER THAT IS FAR LONGER THAN ANY BEFORE IT',
        'Dell.Snippet': LONG_SNIPPET,
      }))];
      await elementUpdated(el);
      await waitForRows(el, 32);
      await settle();

      const scrollbar = scrollport.offsetWidth - scrollport.clientWidth;

      expect(scrollbar, 'the appended page shows no scrollbar').to.equal(12);
      getFitWidths(el).forEach((width, index) => {
        expect(Math.abs(width - widths[index]), `column ${index} went from ${widths[index]}px to ${width}px`)
          .to.be.at.most(scrollbar);
      });
    });

    it('auto-fits a table that was mounted hidden once it is shown', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table
          style="display: none; height: 400px; width: 1000px"
          .assets=${[makeAsset({ 'Dell.Snippet': LONG_SNIPPET })]}
          .columns=${FIT_COLUMNS}
        ></cx-content-browser-table>
      `);

      // `cx-table` builds its Tabulator instance only once it has a width.
      await settle(200);
      el.style.display = '';
      await waitForRows(el, 1);
      await waitUntil(() => getFitWidths(el)[1] > 300, '', { interval: 20, timeout: 3000 }).catch(() => undefined);

      const [identifier, snippet] = getFitWidths(el);

      expect(snippet, 'the long column kept the default width').to.be.greaterThan(300);
      expect(identifier + snippet).to.be.closeTo(getInnerWidth(el) - 6, 1);
    });

    it('auto-fits a new list that arrives while the table is hidden once the table is shown', async () => {
      const el = await mountFit([makeAsset()]);
      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const observedWidths: number[] = [];
      const observer = new ResizeObserver((entries) => {
        observedWidths.push(entries[0].contentRect.width);
      });

      await settle(200);
      observer.observe(el);
      await waitUntil(() => observedWidths.length > 0, 'the table was never observed', { interval: 20, timeout: 3000 });

      const [, before] = getFitWidths(el);

      // A panel or tab the host hides keeps the table and its Tabulator instance, with no width.
      el.style.display = 'none';
      await waitUntil(() => observedWidths[observedWidths.length - 1] === 0,
        'the browser never laid the hidden table out', { interval: 20, timeout: 3000 });
      observer.disconnect();
      el.assets = [makeAsset({ 'Dell.Snippet': LONG_SNIPPET, id: 'long', recordId: 'rec-long' })];
      await elementUpdated(el);
      await waitUntil(() => tabulator.getRows()[0]?.getData().id === 'long', 'the hidden table never took the new list',
        { interval: 20, timeout: 3000 });

      el.style.display = '';
      await waitUntil(() => getFitWidths(el)[1] > before, '', { interval: 20, timeout: 3000 }).catch(() => undefined);

      const [identifier, snippet] = getFitWidths(el);

      expect(getCxTable(el)!.tabulatorInstance === tabulator, 'the table was built again').to.equal(true);
      expect(snippet, 'the long column kept its width from before the hide').to.be.greaterThan(before);
      expect(identifier + snippet).to.be.closeTo(getInnerWidth(el) - 6, 1);
    });
  });

  describe('with the container and the rows', () => {
    it('renders rows down to the bottom of a container that grows taller after a drag', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 300px; width: 700px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);

      await dragToMinimum(el, 1);

      el.style.height = '1300px';
      await waitUntil(() => getBlankBelowRows(el) <= 1, '', { interval: 20, timeout: 2000 }).catch(() => undefined);

      const scrollport = getScrollport(el);
      const blank = getBlankBelowRows(el);

      expect(scrollport.clientHeight > 1000, `the scrollport stayed ${scrollport.clientHeight}px tall`).to.equal(true);
      expect(scrollport.scrollHeight > scrollport.clientHeight, 'the rows no longer overflow the taller table').to.equal(true);
      expect(blank <= 1, `the rows leave a ${blank}px band blank under them in a ${scrollport.clientHeight}px scrollport`)
        .to.equal(true);
    });

    it('keeps keyboard focus on its CTA through a resize of its container after a drag', async () => {
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        </div>
      `);
      const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 2);
      await waitForCtaLayout(el);
      await dragToMinimum(el, 1);

      const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

      expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

      el.style.width = '900px';
      await expectRowsFill(el, 'once the container grows to 900px');

      expect(hasFocus(cta), 'the resize took the focus off the CTA').to.equal(true);
      expect(isShown(cta), 'the focused CTA hid after the resize').to.equal(true);
    });

    it('keeps keyboard focus on its CTA through a resize of its container before any drag', async () => {
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        </div>
      `);
      const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 2);
      await waitForCtaLayout(el);

      const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

      expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

      // Before a drag `cx-table` lays the rows out again itself, and our debounced layout follows it.
      el.style.width = '900px';
      await expectRowsFill(el, 'once the container grows to 900px');
      await settle(200);

      expect(hasFocus(cta), 'the resize took the focus off the CTA').to.equal(true);
      expect(isShown(cta), 'the focused CTA hid after the resize').to.equal(true);
    });

    it('reports each data-column drag without a divider on the filler or the action', async () => {
      // Wider than the floor at the start, so each drag to the floor changes the width.
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px"
          .assets=${makeAssets(2)}
          .columns=${SINGLE_LINE_COLUMNS}
          .savedWidths=${{ 'CoreField.Identifier': 200, 'Dell.Snippet': 200 }}
        ></cx-content-browser-table>
      `, 2);
      const details: Record<string, unknown>[] = [];

      el.addEventListener('cx-content-browser-table-column-resize', (event) => {
        details.push({ ...(event as CustomEvent<Record<string, unknown>>).detail });
      });

      expect(getResizeHandles(el).length, 'a column the host did not configure has a divider')
        .to.equal(SINGLE_LINE_COLUMNS.length);

      await dragToMinimum(el, 0);
      await dragToMinimum(el, 1);
      el.style.width = '900px';
      await expectRowsFill(el, 'once the container grows to 900px');

      expect(details.map((detail) => Object.keys(detail).sort().join(',')).join('|')).to.equal('field,reset,width|field,reset,width');
      expect(details.map(({ field }) => field).join('|')).to.equal('CoreField.Identifier|Dell.Snippet');
      expect(details.map(({ reset }) => reset).join('|')).to.equal('false|false');
      expect(details.map(({ width }) => width).join('|'))
        .to.equal([0, 1].map((index) => Math.round(getColumnWidth(el, index))).join('|'));
    });

    it('lays the filler out at its own width when the design system pads the cells', async () => {
      // The runner loads no design-system theme: the spacing tokens pad the cells as a themed page does.
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px; --cx-spacing-2x-small: 4px; --cx-spacing-large: 24px"
          .assets=${makeAssets(2)}
          .columns=${SINGLE_LINE_COLUMNS}
        ></cx-content-browser-table>
      `, 2);

      await waitForCtaLayout(el);
      await settle(200);

      const scrollport = getScrollport(el);
      const padding = Number.parseFloat(getComputedStyle(getDataCells(getRowElement(el, 'asset-0')!)[0]).paddingLeft);

      expect(padding > 0, 'the tokens left the cells unpadded').to.equal(true);
      expect(getColumnHeader(el, FILLER_FIELD).getBoundingClientRect().width, 'the filler width').to.be.within(4, 8);
      expect(scrollport.scrollWidth <= scrollport.clientWidth,
        `the rows run ${scrollport.scrollWidth}px wide in a ${scrollport.clientWidth}px table`).to.equal(true);
      await expectRowsFill(el, 'at rest');
    });

    it('leaves the empty row area inactive and keeps a cold-storage row inert', async () => {
      // The empty row area shows only when every column has a width the user set.
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px"
          .assets=${[makeAsset({ id: 'asset-cold', inColdStorage: true, recordId: 'rec-cold' }), makeAsset()]}
          .columns=${SINGLE_LINE_COLUMNS}
          .savedWidths=${{ 'CoreField.Identifier': 160 }}
        ></cx-content-browser-table>
      `, 2);

      await waitUntil(() => getRowElements(el).length === 2, 'both rows never rendered', { interval: 20, timeout: 5000 });
      await dragToMinimum(el, 1);
      await expectRowsFill(el, 'once every data column is fixed');

      const root = getTableRoot(el);
      const blankPoint = (assetId: string): [number, number] => {
        const row = getRowElement(el, assetId)!;
        const cells = getDataCells(row);
        const last = cells[cells.length - 1].getBoundingClientRect();

        return [Math.round(last.right + 100), Math.round(last.top + last.height / 2)];
      };
      const header = getColumnHeader(el, FILLER_FIELD);
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-click', spy);

      const hit = root.elementFromPoint(...blankPoint('asset-1'));
      const coldHit = root.elementFromPoint(...blankPoint('asset-cold'));
      const headerHit = root.elementFromPoint(...centerOf(header));

      expect(header.getBoundingClientRect().width, 'the internal column takes the free space').to.be.within(4, 8);
      expect(hit, 'the empty area does not belong to the row').to.equal(getRowElement(el, 'asset-1'));
      expect(Boolean(coldHit) && getRowElement(el, 'asset-cold')!.contains(coldHit),
        'the cold-storage row takes the pointer in its empty area').to.equal(false);
      expect(Boolean(headerHit) && header.contains(headerHit), 'the filler header takes the pointer').to.equal(false);

      hit!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

      expect(spy.callCount, 'a click on the empty area handed an asset over').to.equal(0);
    });
  });

  describe('readCellValue', () => {
    it('returns the field value as a string', () => {
      expect(readCellValue(makeAsset({ count: 3 }), 'count')).to.equal('3');
    });

    it('returns an empty string for a missing, null, non-scalar or inherited value', () => {
      expect(readCellValue(makeAsset(), 'Missing.Field')).to.equal('');
      expect(readCellValue(makeAsset({ nothing: null }), 'nothing')).to.equal('');
      expect(readCellValue(makeAsset({ list: ['a'] }), 'list')).to.equal('');
      expect(readCellValue(makeAsset(), 'toString')).to.equal('');
      expect(readCellValue(makeAsset(), 'constructor')).to.equal('');
    });
  });

  describe('column resizing', () => {
    it('reports a dragged width to the host as the field and its width in pixels', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const start = Math.round(getColumnWidth(el, 0));
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], 40);

      const { detail } = await resized;

      expect(detail.field).to.equal('CoreField.Identifier');
      expect(detail.width).to.equal(start + 40);
      expect(detail.reset).to.equal(false);
    });

    it('stops a drag at 92px', async () => {
      // Wider than the floor at the start, so the drag changes the width.
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px"
          .assets=${[makeAsset()]}
          .columns=${SINGLE_LINE_COLUMNS}
          .savedWidths=${{ 'CoreField.Identifier': 200 }}
        ></cx-content-browser-table>
      `);

      const detail = await dragToMinimum(el, 0);

      expect(detail.width).to.equal(92);
    });

    describe('L-42CA9K issue 2: after a drag on a table with no saved widths', () => {
      const LONG_ASSET = { 'CoreField.Identifier': 'IDENTIFIER-0123456789-ABCDEFGHIJ', 'Dell.Snippet': 'x'.repeat(400) };

      async function mountAndShrinkIdentifier() {
        const el = await mount(html`
          <cx-content-browser-table
            style="height: 400px; width: 1000px"
            .assets=${[makeAsset(LONG_ASSET)]}
            .columns=${SINGLE_LINE_COLUMNS}
          ></cx-content-browser-table>
        `);

        await settle(200);

        const identifier = getColumnWidthByField(el, 'CoreField.Identifier');
        const snippet = getColumnWidthByField(el, 'Dell.Snippet');
        const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

        expect(identifier - 60, 'the drag reaches the floor').to.be.above(MIN_COLUMN_WIDTH);

        dragColumnHandle(getResizeHandles(el)[0], -60);

        const { detail } = await resized;

        await settle();

        return { detail, el, snippet };
      }

      it('keeps the other columns at their width when the drag ends, and saves only the dragged one', async () => {
        const spy = sinon.spy();
        const { detail, el, snippet } = await mountAndShrinkIdentifier();

        el.addEventListener('cx-content-browser-table-column-resize', spy);
        await settle();

        expect(detail.field).to.equal('CoreField.Identifier');
        expect(getColumnWidthByField(el, 'Dell.Snippet'), 'the other column filled the freed space').to.be.closeTo(snippet, 2);
        expect(spy.callCount, 'the release emitted a width for a column the user did not drag').to.equal(0);
      });

      it('keeps the width of the other columns through a container resize', async () => {
        const { el, snippet } = await mountAndShrinkIdentifier();

        el.style.width = '1200px';
        dispatchResize(el, resizeObserverEntry(getContainer(el), 400, 1200));
        await settle(300);

        expect(getColumnWidthByField(el, 'Dell.Snippet'), 'a container resize fitted the column again').to.be.closeTo(snippet, 2);
      });

      it('keeps the width of the other columns when the saved widths come back from the host', async () => {
        const { detail, el, snippet } = await mountAndShrinkIdentifier();

        el.savedWidths = { [detail.field]: detail.width! };
        await elementUpdated(el);
        await settle(200);

        expect(getColumnWidthByField(el, 'Dell.Snippet'), 'the saved widths dropped the session width').to.be.closeTo(snippet, 2);
      });

      it('fits the other columns again when the width scope changes', async () => {
        const { el, snippet } = await mountAndShrinkIdentifier();

        el.widthScope = 'https://another.example';
        await elementUpdated(el);
        await settle(200);

        expect(getColumnWidthByField(el, 'Dell.Snippet'), 'the session width outlived the width scope')
          .to.be.above(snippet + 10);
      });

      it('fits a column again on a double-click on its divider', async () => {
        const { el, snippet } = await mountAndShrinkIdentifier();
        const reset = oneEvent(el, 'cx-content-browser-table-column-resize');

        doubleClick(getResizeHandles(el)[1]);

        const { detail } = await reset;

        await settle();

        expect(detail.field).to.equal('Dell.Snippet');
        expect(detail.reset).to.equal(true);
        expect(getColumnWidthByField(el, 'Dell.Snippet'), 'the column kept its session width').to.be.above(snippet + 10);
      });
    });

    it('forgets the saved width on a double-click and auto-fits the column', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      await settle(200);

      const before = getColumnWidth(el, 0);
      const dragged = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], 200);
      await dragged;
      await settle();

      const reset = oneEvent(el, 'cx-content-browser-table-column-resize');

      doubleClick(getResizeHandles(el)[0]);

      const { detail } = await reset;

      expect(detail.field).to.equal('CoreField.Identifier');
      expect(detail.reset).to.equal(true);
      expect(detail.width).to.be.closeTo(before, 1);
      expect(getColumnWidth(el, 0)).to.be.closeTo(detail.width!, 1);
    });

    it('does not run the Tabulator fit on a double-click', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const key = String(getCxTable(el)!.columns![0].field);
      // The internal column: the resize handle calls its `reinitializeWidth(true)` on a double click.
      const internal = (getCxTable(el)!.tabulatorInstance!.getColumn(key) as unknown as {
        _column: { reinitializeWidth(force?: boolean): Promise<void> };
      })._column;
      const dragged = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], 200);
      await dragged;
      await settle();

      const fit = sinon.spy(internal, 'reinitializeWidth');

      doubleClick(getResizeHandles(el)[0]);
      await settle();

      expect(fit.callCount).to.equal(0);
    });

    it('offers no keyboard resize handle of its own', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      expect(el.shadowRoot!.querySelector('[role="separator"]') === null).to.equal(true);
      expect(getTableRoot(el).querySelector('[role="separator"]') === null).to.equal(true);
    });
  });

  describe('page size before the rows arrive', () => {
    it('measures the full height while the table holds no rows yet, however many assets it has', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 2000px" .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      await waitUntil(() => getCxTable(el)?.tabulatorInstance?.initialized === true, 'the table was never built',
        { interval: 20, timeout: 5000 });
      await settle();

      const tabulator = getCxTable(el)!.tabulatorInstance!;

      // Holds the list back as Tabulator's half-second wait before `setData` does: assets, and no rows.
      sinon.stub(tabulator, 'setData').resolves();
      el.assets = makeAssets(5);
      await elementUpdated(el);

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      dispatchResize(el, resizeObserverEntry(getContainer(el), 1950));
      await settle();

      expect(tabulator.getDataCount(), 'the table took rows').to.equal(0);
      expect(spy.callCount, 'the measurement reported no count').to.equal(1);
      expect((spy.firstCall.args[0] as CustomEvent<{ rowCount: number }>).detail.rowCount).to.equal(Math.ceil(1950 / ROW_HEIGHT));
    });
  });

  describe('page size when the list restarts', () => {
    it('reports the count once the restarted rows are in, so the page it asks for is appended', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const restarted = makeAssets(30, 0, 'other');
      const setData = sinon.spy(tabulator, 'setData');
      const addData = sinon.spy(tabulator, 'addData');
      let firstRowAtReport = '';

      // As `content-browser` answers the report: the page it asks for lands once its fetch debounce runs out.
      el.addEventListener('cx-content-browser-grid-resize', () => {
        firstRowAtReport = String(tabulator.getRows()[0]?.getData().id ?? '');
        setTimeout(() => {
          el.assets = [...restarted, ...makeAssets(30, 30, 'other')];
        }, 200);
      }, { once: true });
      el.assets = restarted;
      await elementUpdated(el);
      await waitUntil(() => Boolean(tabulator.getRow('other-59')), 'the page the report asked for never reached the rows',
        { interval: 20, timeout: 5000 });

      expect(firstRowAtReport, 'the count was reported while the rows still showed the old list').to.equal('other-0');
      expect(setData.callCount, 'the page the report asked for replaced the rows again').to.equal(1);
      expect(addData.callCount, 'the page the report asked for was not appended').to.equal(1);
    });

    it('reports a measurement still in its debounce in the same count, never as a second one', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      let land!: () => void;
      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const spy = sinon.spy();

      // Holds the restarted list back until the test lets it land, as Tabulator's half-second wait does.
      sinon.stub(tabulator, 'setData').returns(new Promise<void>((resolve) => {
        land = resolve;
      }));
      el.addEventListener('cx-content-browser-grid-resize', spy);
      el.assets = makeAssets(60, 0, 'other');
      await elementUpdated(el);
      // The container grows just before the rows land, so its measurement is still in its debounce.
      dispatchResize(el, resizeObserverEntry(getContainer(el), 30 * ROW_HEIGHT - 20));
      land();
      // Past that debounce: `content-browser` takes a second count inside its own 200 ms fetch debounce
      // as a new page, and drops the page the first count asked for.
      await settle();

      expect(spy.callCount, 'the restart and the measurement each reported a count').to.equal(1);
      expect((spy.firstCall.args[0] as CustomEvent<{ rowCount: number }>).detail.rowCount).to.equal(30);
    });
  });

  describe('page size when a page is appended', () => {
    it('reports no count again for a page appended to the same assets', async () => {
      const firstPage = makeAssets(60);
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${firstPage} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const addData = sinon.spy(tabulator, 'addData');
      const spy = sinon.spy();

      // `content-browser` fetches a page for every count it gets, so a count sent again for an
      // appended page asks for one more page, and so on up to the total.
      el.addEventListener('cx-content-browser-grid-resize', spy);
      el.assets = [...firstPage, ...makeAssets(30, 60)];
      await elementUpdated(el);
      await waitUntil(() => Boolean(tabulator.getRow('asset-89')), 'the appended page never reached the rows',
        { interval: 20, timeout: 5000 });
      await waitUntil(() => spy.callCount > 0, '', { interval: 20, timeout: 1000 }).catch(() => undefined);

      expect(addData.callCount, 'the page was not appended').to.equal(1);
      expect(spy.callCount, 'the appended page reported the count again').to.equal(0);
    });
  });
});
