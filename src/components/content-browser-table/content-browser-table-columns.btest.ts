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

import type ContentBrowserTable from './content-browser-table';
import {
  CTA_FIELD,
  FILLER_FIELD,
  MIN_COLUMN_WIDTH,
  readCellValue,
  ROW_HEIGHT,
  toColumnSizing,
} from './content-browser-table';
import {
  centerOf,
  COLUMNS,
  dispatchResize,
  dragColumnHandle,
  dragToMinimum,
  expectFilled,
  getBlankBelowRows,
  getColumnHeader,
  getColumnsTotal,
  getColumnWidth,
  getContainer,
  getCta,
  getCtaColumnWidth,
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
  isCtaColumnFitted,
  isShown,
  makeAsset,
  makeAssets,
  mount,
  resizeObserverEntry,
  settle,
  SINGLE_LINE_COLUMNS,
  stubInputQueries,
  tabToCta,
  waitForCtaColumnFit,
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
    it('renders one header per configured column, in order, then an untitled filler and CTA column', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);
      const headers = [...getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col')];
      const own = headers.slice(-2);

      expect(getHeaderTitles(el).join('|')).to.equal('Identifier|Snippet');
      expect(headers.length).to.equal(COLUMNS.length + 2);
      expect(own.map((header) => header.getAttribute('tabulator-field')).join('|')).to.equal(`${FILLER_FIELD}|${CTA_FIELD}`);
      expect(own.map((header) => header.textContent?.trim()).join('|')).to.equal('|');
    });

    it('gives the filler and the CTA column no resize handle and no sort', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      [FILLER_FIELD, CTA_FIELD].forEach((field) => {
        const definition = getCxTable(el)!.columns!.find((column) => column.field === field)!;
        const header = getColumnHeader(el, field);

        expect(definition.resizable, `the ${field} column can be resized`).to.equal(false);
        expect(definition.headerSort, `the ${field} column can be sorted`).to.equal(false);
        // Tabulator puts a column's divider right after its header.
        expect(Boolean(header.nextElementSibling?.classList.contains('tabulator-col-resize-handle')),
          `the ${field} column has a divider`).to.equal(false);
      });
    });

    it('fits the CTA column to its button, and again to a relabelled one', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaColumnFit(el);

      const before = getCtaColumnWidth(el);

      el.ctaText = 'Add this asset to the page';
      await elementUpdated(el);
      await waitUntil(async () => getCtaLabel((await getCta(getRowElement(el, 'asset-0')))!) === 'Add This Asset To The Page',
        'the CTA was never relabelled', { interval: 20, timeout: 3000 });
      await waitForCtaColumnFit(el);

      const total = getColumnsTotal(el);

      expect(getCtaColumnWidth(el) > before, `the column stayed ${before}px wide for a longer label`).to.equal(true);
      expect(total <= 700 + 1, `the columns take ${total}px of a 700px table`).to.equal(true);
      expect(total >= 700 - 4, `the columns leave a gap in a 700px table: ${total}px`).to.equal(true);
    });

    it('fits the CTA column to its button under an ancestor that scales the picker', async () => {
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

      // In layout pixels, which the scale leaves alone: `getCtaColumnWidth` reads the scaled header.
      const ctaColumnWidth = () => getCxTable(el)!.tabulatorInstance!.getColumn(CTA_FIELD).getWidth() as number;

      // A column no button has been measured in starts at 96px, which a label this long outgrows.
      await waitUntil(() => ctaColumnWidth() !== 96, 'the CTA column was never fitted', { interval: 20, timeout: 3000 });
      await settle(100);

      const cta = (await getCta(getRowElements(el)[0]))!;
      const cell = cta.parentElement!;
      const style = getComputedStyle(cell);
      const content = Math.round(cell.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight));

      // Whole pixels on both sides: a pixel of rounding each way, never the half a scale of 0.5 leaves.
      expect(Math.abs(cta.offsetWidth - content) <= 2,
        `the ${cta.offsetWidth}px CTA sits in a ${content}px cell content box`).to.equal(true);
    });

    it('fits the CTA column to a label it took while the table was hidden, once the table is shown', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      await waitForCtaColumnFit(el);

      const fitted = Math.round(getCtaColumnWidth(el));
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

      await waitUntil(async () => isCtaColumnFitted(await firstCta()), '', { interval: 20, timeout: 2000 })
        .catch(() => undefined);

      const cta = (await firstCta())!;
      const button = Math.round(cta.getBoundingClientRect().width);
      const column = Math.round(getCtaColumnWidth(el));

      expect(getCtaLabel(cta), 'the hidden CTA kept its old label').to.equal('Add This Asset To The Page');
      expect(isCtaColumnFitted(cta),
        `the ${button}px CTA sits in a ${column}px column, fitted at ${fitted}px to the old label`).to.equal(true);
    });

    it('measures no CTA that an appended page renders with the label its column is fitted to', async () => {
      const firstPage = makeAssets(2);
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${firstPage} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaColumnFit(el);

      // The fit reads the computed style of the element that holds a CTA.
      const readStyle = sinon.spy(window, 'getComputedStyle');

      el.assets = [...firstPage, ...makeAssets(2, 2)];
      await elementUpdated(el);
      await waitForRows(el, 4);

      const appended = await getCta(getRowElement(el, 'asset-3'));

      await settle(100);

      const measured = readStyle.getCalls()
        .filter((call) => Array.from(call.args[0].children).some((child) => child.classList.contains('content-browser-table__cta')))
        .length;

      expect(appended !== undefined, 'the appended row rendered no CTA').to.equal(true);
      expect(measured, 'an appended CTA measured the CTA column again').to.equal(0);
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

    it('names the untitled CTA column header after the CTA, and renames it with the cta text', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const header = () => getColumnHeader(el, CTA_FIELD);

      expect(header().getAttribute('role')).to.equal('columnheader');
      expect(header().getAttribute('aria-label')).to.equal('Insert');
      expect(header().textContent?.trim()).to.equal('');

      el.ctaText = 'add to page';
      await elementUpdated(el);

      expect(header().getAttribute('aria-label'), 'a new cta text left the old name').to.equal('add to page');

      // A new column set builds the CTA column again.
      el.columns = [SINGLE_LINE_COLUMNS[0]];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier',
        'the table never dropped the column', { interval: 20, timeout: 3000 });

      expect(header().getAttribute('aria-label'), 'the rebuilt header lost its name').to.equal('add to page');
    });

    describe('in a table wider than its host', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('keeps the hovered row\'s CTA inside the visible table, with no divider at its left edge', async () => {
        const wide: TableColumn[] = [
          { field: 'CoreField.Identifier', title: 'Identifier', width: '600px' },
          { field: 'Dell.Snippet', title: 'Snippet', width: '600px' },
        ];
        // The runner loads no design-system theme: the token paints the divider as a themed page does.
        const el = await mount(html`
          <cx-content-browser-table
            style="height: 400px; width: 500px; --cx-color-neutral-300: rgb(1, 2, 3)"
            .assets=${makeAssets(2)}
            .columns=${wide}
          ></cx-content-browser-table>
        `, 2);
        const row = getRowElement(el, 'asset-0')!;
        const cta = (await getCta(row))!;
        const scrollport = getScrollport(el);

        await waitForCtaColumnFit(el);
        await sendMouse({ position: centerOf(getDataCells(row)[0]), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        const box = cta.getBoundingClientRect();
        const left = scrollport.getBoundingClientRect().left + scrollport.clientLeft;
        const right = left + scrollport.clientWidth;
        const hit = getTableRoot(el).elementFromPoint(...centerOf(cta));
        const divider = getComputedStyle(getTableRoot(el).querySelector('.tabulator')!, '::after');
        const cell = cta.closest<HTMLElement>('.tabulator-cell')!;
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

    it('lays a pixel width out at that width and gives a flexible column the rest', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      await waitForCtaColumnFit(el);

      const cta = getCtaColumnWidth(el);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(160);
      expect(Math.round(getColumnWidth(el, 1)) >= 700 - 160 - cta - 4,
        `the flexible column is ${getColumnWidth(el, 1)}px of a 700px table beside a ${cta}px CTA`).to.equal(true);
    });

    it('keeps the flexible columns filling the table once a percentage column is laid out at a new width', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '20%' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);
      await waitForCtaColumnFit(el);

      const built = getColumnWidth(el, 0);

      el.style.width = '500px';
      // A new list lays the columns out again, at the width the table has now.
      el.assets = makeAssets(2, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the rows were never replaced', { interval: 20, timeout: 3000 });

      const total = getColumnsTotal(el);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(Math.round(built));
      expect(total <= 500 + 1, `the columns take ${total}px of a 500px table`).to.equal(true);
      expect(total >= 500 - 4, `the columns leave a gap in a 500px table: ${total}px`).to.equal(true);
    });

    it('keeps the flexible columns filling the table when its container resizes before any new list', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '20%' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);
      await waitForCtaColumnFit(el);

      const built = getColumnWidth(el, 0);

      // No new list comes: only the redraw of the resized container lays the columns out again.
      el.style.width = '500px';
      await expectFilled(el, 'once the container shrinks to 500px');

      expect(Math.round(getColumnWidth(el, 0))).to.equal(Math.round(built));
    });

    it('lays a percentage column out at its share of the table once a table that took it while hidden is shown', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const tabulator = getCxTable(el)!.tabulatorInstance!;
      const observedWidths: number[] = [];
      const observer = new ResizeObserver((entries) => {
        observedWidths.push(entries[0].contentRect.width);
      });

      observer.observe(el);
      await waitUntil(() => observedWidths.length > 0, 'the table was never observed', { interval: 20, timeout: 3000 });

      // A panel or tab the host hides keeps the table and its Tabulator instance, with no width.
      el.style.display = 'none';
      el.columns = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '20%' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      await elementUpdated(el);
      await waitUntil(() => tabulator.getColumns()[0]?.getDefinition().width !== 160,
        'the hidden table never took the new columns', { interval: 20, timeout: 3000 });
      // A hidden tab stays hidden for one frame or more, so the resize observers see the width of 0.
      await waitUntil(() => observedWidths[observedWidths.length - 1] === 0,
        'the browser never laid the hidden table out', { interval: 20, timeout: 3000 });
      observer.disconnect();

      el.style.display = '';

      const tableWidth = () => getTableRoot(el).querySelector<HTMLElement>('.tabulator')!.clientWidth;
      const share = () => Math.floor(tableWidth() / 100 * 20);

      await waitUntil(() => Math.round(getColumnWidth(el, 0)) === share(), '', { interval: 20, timeout: 2000 })
        .catch(() => undefined);

      // Built again, the table would convert the share at its width and hide the defect.
      expect(getCxTable(el)!.tabulatorInstance === tabulator, 'the table was built again').to.equal(true);
      expect(Math.round(getColumnWidth(el, 0)), `the 20% column of a ${tableWidth()}px table`).to.equal(share());
      await expectFilled(el, 'once the table is shown');
    });

    it('lays a pixel width below the floor out at the width the host set', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '30px' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(30);
    });

    it('lays a share of 0 out at the floor, and leaves the free width to the other columns', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '0fr' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);

      expect(Math.round(getColumnWidth(el, 0)), 'the 0fr column width').to.equal(MIN_COLUMN_WIDTH);
    });

    it('lays a column the host sets to 0px out at the floor, not as a flexible share', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '0px' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);

      expect(Math.round(getColumnWidth(el, 0)), 'the 0px column width').to.equal(MIN_COLUMN_WIDTH);
    });

    it('carries alignment and line clamps onto the column definitions', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);
      const [identifier, snippet] = getCxTable(el)!.columns!;

      expect(identifier.width).to.equal(160);
      expect(identifier.variableHeight).to.equal(false);
      expect(snippet.hozAlign).to.equal('right');
      expect(snippet.headerHozAlign).to.equal('right');
      expect(snippet.variableHeight).to.equal(true);
      expect(snippet.widthGrow).to.equal(1);
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

    it('clamps a cell to the lines its column configures and cuts a single-line cell inside its cell', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[
            makeAsset({ 'CoreField.Identifier': 'An identifier far wider than its 160px column', id: 'long', recordId: 'rec-long' }),
            makeAsset({ id: 'short', recordId: 'rec-short' }),
          ]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `, 2);
      const cellsOf = (id: string) => [...getRowElement(el, id)!.querySelectorAll<HTMLElement>('.tabulator-cell')];
      const [identifier, snippet] = cellsOf('long');
      // The element the formatter rendered, and the box that cuts its text: a line clamp's content part.
      const textOf = async (cell: HTMLElement) => {
        const text = cell.querySelector<HTMLElement & { updateComplete?: Promise<unknown> }>('cx-line-clamp, span')!;

        await text.updateComplete;

        return { clip: text.shadowRoot?.querySelector<HTMLElement>('[part="content"]') ?? text, text };
      };
      const { clip, text } = await textOf(identifier);
      const clipBox = clip.getBoundingClientRect();
      const cellRight = identifier.getBoundingClientRect().right;
      const nextLeft = snippet.getBoundingClientRect().left;
      const probe = getTableRoot(el).elementFromPoint(nextLeft + 2, clipBox.top + clipBox.height / 2);

      expect(snippet.querySelector('cx-line-clamp')?.getAttribute('lines')).to.equal('2');
      // Wider than its column: cut inside the cell, never painted over the next column.
      expect(clipBox.right <= cellRight + 0.5,
        `the text box ends at ${clipBox.right}px, past its cell's edge at ${cellRight}px`).to.equal(true);
      expect(Boolean(probe) && text.contains(probe),
        `the text paints over the next column at ${nextLeft + 2}px`).to.equal(false);
      expect(clip.scrollWidth > clip.clientWidth || clip.scrollHeight > clip.clientHeight,
        `the text shows in full in a ${clip.clientWidth}px box, so nothing cuts it`).to.equal(true);
      // And still one line tall, never wrapped.
      expect(Math.round(clipBox.height))
        .to.equal(Math.round((await textOf(cellsOf('short')[0])).clip.getBoundingClientRect().height));
    });

    it('renders a single-line row at the height the page size is counted in', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      expect(Math.round(getRowElement(el, 'asset-0')!.getBoundingClientRect().height)).to.equal(ROW_HEIGHT);
    });

    it('grows a row to every line its column clamps to, and never below the single-line height', async () => {
      const long = 'A fragment of text long enough to wrap past every line its column allows, so the clamp '
        + 'shows all three of them and cuts the rest, however wide the column is laid out here.';
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 400px"
          .assets=${[
            makeAsset({ 'Dell.Snippet': long, id: 'long', recordId: 'rec-long' }),
            makeAsset({ 'Dell.Snippet': 'Short', id: 'short', recordId: 'rec-short' }),
          ]}
          .columns=${[{ field: 'Dell.Snippet', lines: 3, title: 'Snippet' }]}
        ></cx-content-browser-table>
      `, 2);
      const cellOf = (id: string) => getRowElement(el, id)!.querySelector<HTMLElement>('.tabulator-cell')!;

      // Three lines are taller than a single-line row, so only a row that grew to them can pass.
      await waitUntil(() => {
        const cell = cellOf('long');
        const clamp = cell.querySelector<HTMLElement>('cx-line-clamp')!;

        return clamp.getBoundingClientRect().height > ROW_HEIGHT && cell.scrollHeight <= cell.clientHeight + 1;
      }, 'the long row cuts off the lines its clamp shows', { interval: 20, timeout: 3000 });

      const short = Math.round(getRowElement(el, 'short')!.getBoundingClientRect().height);

      expect(short >= ROW_HEIGHT, `the short row is ${short}px tall`).to.equal(true);
    });

    it('aligns the cell text its column right-aligns', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);
      const snippet = getRowElements(el)[0].querySelectorAll<HTMLElement>('.tabulator-cell')[1];
      const content = snippet.querySelector<HTMLElement>('.tabulator-cell-content') ?? snippet;

      expect(getComputedStyle(content).justifyContent).to.equal('flex-end');
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

      // A new title or alignment leaves every value under its key: `cx-table` lays the rows it holds
      // out under the new columns itself.
      el.columns = [{ ...SINGLE_LINE_COLUMNS[0], title: 'Code' }, { ...SINGLE_LINE_COLUMNS[1], align: 'right' }];
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

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      // `content-browser` hands over a new array on every render.
      el.columns = SINGLE_LINE_COLUMNS.map((column) => ({ ...column }));
      await elementUpdated(el);
      await elementUpdated(getCxTable(el)!);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(220);
    });

    it('keeps the dragged width of a column that survives a change to the column set', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      el.columns = [...SINGLE_LINE_COLUMNS, { field: 'name', title: 'Name', width: '100px' }];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier|Snippet|Name',
        'the table never took the new column', { interval: 20, timeout: 3000 });

      expect(Math.round(getColumnWidth(el, 0))).to.equal(220);
    });

    it('pins a dragged flexible column at its width, above its floor, once the column set changes', async () => {
      const columns: TableColumn[] = [...SINGLE_LINE_COLUMNS, { field: 'name', title: 'Name', width: '100px' }];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[1], -100);

      const { detail } = await resized;

      el.columns = [...columns, { field: 'extra', title: 'Extra' }];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier|Snippet|Name|Extra',
        'the table never took the new column', { interval: 20, timeout: 3000 });

      const { minWidth, width, widthGrow } = getCxTable(el)!.columns![1];

      expect(detail.field).to.equal('Dell.Snippet');
      expect({ minWidth, width, widthGrow })
        .to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: detail.width, widthGrow: undefined });
      expect(Math.round(getColumnWidth(el, 1))).to.equal(detail.width);
    });

    it('keeps a dragged flexible column at its width when a new list replaces the rows', async () => {
      const columns: TableColumn[] = [...SINGLE_LINE_COLUMNS, { field: 'name', title: 'Name', width: '100px' }];
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

    it('lays the other columns out around a dragged width when a new list replaces the rows', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await resized;

      el.assets = makeAssets(3, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the rows were never replaced', { interval: 20, timeout: 3000 });

      const total = getColumnsTotal(el);

      expect(Math.round(getColumnWidth(el, 0))).to.equal(220);
      expect(total <= 700 + 1, `the columns take ${total}px of a 700px table`).to.equal(true);
    });

    it('keeps a dragged width when the table comes back after a list with no result', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

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

      expect(Math.round(getColumnWidth(el, 0))).to.equal(220);
    });

    it('keeps a dragged width when a move of the picker rebuilds the table', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

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

      expect(Math.round(getColumnWidth(el, 0))).to.equal(220);
    });

    it('starts the table a move of the picker rebuilds with the CTA column at its fitted width', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px"
          cta-text="Add this asset to the page"
          .assets=${[makeAsset()]}
          .columns=${SINGLE_LINE_COLUMNS}
        ></cx-content-browser-table>
      `);

      await waitForCtaColumnFit(el);

      const fitted: number = getCxTable(el)!.tabulatorInstance!.getColumn(CTA_FIELD).getWidth();
      const parent = el.parentElement!;

      el.remove();
      parent.appendChild(el);
      await elementUpdated(el);

      const definition = getCxTable(el)!.columns!.find((column) => column.field === CTA_FIELD)!;

      // A column no button has been measured in starts at 96px, which a label this long outgrows.
      expect(fitted > 96, `the CTA column was fitted at ${fitted}px`).to.equal(true);
      expect(definition.width).to.equal(fitted);
    });

    it('drops the dragged width of a column the host stops configuring', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);

      dragColumnHandle(getResizeHandles(el)[0], 60);
      await elementUpdated(el);

      el.columns = [SINGLE_LINE_COLUMNS[1]];
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Snippet',
        'the table never dropped the column', { interval: 20, timeout: 3000 });

      // Configured again, it starts from the host's width, not the one dragged before it went away.
      el.columns = SINGLE_LINE_COLUMNS.map((column) => ({ ...column }));
      await elementUpdated(el);
      await waitUntil(() => getHeaderTitles(el).join('|') === 'Identifier|Snippet',
        'the table never took the column back', { interval: 20, timeout: 3000 });

      expect(Math.round(getColumnWidth(el, 0))).to.equal(160);
    });
  });

  describe('toColumnSizing', () => {
    it('maps a pixel track to a fixed width', () => {
      expect(toColumnSizing('160px')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: 160 });
      expect(toColumnSizing('160')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: 160 });
      expect(toColumnSizing('30px')).to.deep.equal({ minWidth: 30, width: 30 });
      expect(toColumnSizing('25%')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: '25%' });
    });

    it('maps a flexible track to a share of the free space with a floor', () => {
      expect(toColumnSizing('2fr')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 2 });
      expect(toColumnSizing(undefined)).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 1 });
      expect(toColumnSizing('  ')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 1 });
    });

    it('keeps a minmax() minimum unless a flexible column could collapse below it', () => {
      expect(toColumnSizing('minmax(0, 2fr)')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 2 });
      expect(toColumnSizing('minmax(120px, 1fr)')).to.deep.equal({ minWidth: 120, widthGrow: 1 });
      expect(toColumnSizing('minmax(auto, 1fr)')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 1 });
      expect(toColumnSizing('minmax(100px, 200px)')).to.deep.equal({ minWidth: 100, width: 200 });
      expect(toColumnSizing('minmax(auto, 200px)')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: 200 });
      expect(toColumnSizing('minmax(80px, max-content)')).to.deep.equal({ minWidth: 80, widthGrow: 1 });
    });

    it('floors a fixed minmax() minimum a drag could collapse the column to, never above its width', () => {
      expect(toColumnSizing('minmax(0, 200px)')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: 200 });
      expect(toColumnSizing('minmax(20px, 200px)')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: 200 });
      expect(toColumnSizing('minmax(0, 30px)')).to.deep.equal({ minWidth: 30, width: 30 });
    });

    it('fixes a share of 0 and a width of 0 at the floor', () => {
      expect(toColumnSizing('0fr')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: MIN_COLUMN_WIDTH });
      expect(toColumnSizing('minmax(120px, 0fr)')).to.deep.equal({ minWidth: 120, width: 120 });
      expect(toColumnSizing('0px')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: MIN_COLUMN_WIDTH });
      expect(toColumnSizing('0')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: MIN_COLUMN_WIDTH });
      expect(toColumnSizing('minmax(0, 0px)')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, width: MIN_COLUMN_WIDTH });
    });

    it('gives a track Tabulator cannot express an equal share', () => {
      expect(toColumnSizing('max-content')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 1 });
      expect(toColumnSizing('10rem')).to.deep.equal({ minWidth: MIN_COLUMN_WIDTH, widthGrow: 1 });
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
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], 40);

      const { detail } = await resized;

      expect(detail.field).to.equal('CoreField.Identifier');
      expect(detail.width).to.equal(200);
    });

    it('stops a drag at the floor for a fixed column whose minmax() minimum is below it', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: 'minmax(0, 200px)' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], -300);

      const { detail } = await resized;

      expect(detail.width).to.equal(MIN_COLUMN_WIDTH);
    });

    it('stops a drag at the floor for a fixed pixel column', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], -300);

      const { detail } = await resized;

      expect(detail.width).to.equal(MIN_COLUMN_WIDTH);
    });

    it('stops a drag at the floor for a percentage column', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '20%' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${columns}>
        </cx-content-browser-table>
      `);
      const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

      dragColumnHandle(getResizeHandles(el)[0], -300);

      const { detail } = await resized;

      expect(detail.width).to.equal(MIN_COLUMN_WIDTH);
    });

    it('reports the fitted width, not undefined, when a double click fits the column to its content', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const handle = getResizeHandles(el)[0];

      dragColumnHandle(handle, 40);
      await elementUpdated(el);

      const reset = oneEvent(el, 'cx-content-browser-table-column-resize');

      handle.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));

      const { detail } = await reset;

      expect(detail.field).to.equal('CoreField.Identifier');
      expect(typeof detail.width).to.equal('number');
      expect(detail.width !== 200, 'the double click left the dragged width').to.equal(true);
      expect(detail.width).to.equal(Math.round(getColumnWidth(el, 0)));
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

  describe('filling the table', () => {
    it('fills the table once every data column is dragged to its minimum, with the CTA at its right edge', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaColumnFit(el);
      await dragToMinimum(el, 0);
      await dragToMinimum(el, 1);
      await expectFilled(el, 'once every data column is at its minimum');

      const table = getTableRoot(el).querySelector<HTMLElement>('.tabulator')!;
      const innerRight = table.getBoundingClientRect().left + table.clientLeft + getInnerWidth(el);
      const ctaRight = (await getCta(getRowElement(el, 'asset-0')))!.getBoundingClientRect().right;

      expect(Math.abs(ctaRight - innerRight) <= 1,
        `the CTA ends at ${ctaRight}px, not at the table's right edge at ${innerRight}px`).to.equal(true);
    });

    it('keeps the table filled when its container grows wider or narrower after a drag', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaColumnFit(el);
      await dragToMinimum(el, 1);

      el.style.width = '900px';
      await expectFilled(el, 'once the container grows to 900px');

      el.style.width = '500px';
      await expectFilled(el, 'once the container shrinks to 500px');
    });

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

    it('keeps the table filled, and every dragged width, when a new list replaces the rows after the drags', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      await waitForCtaColumnFit(el);

      const identifier = await dragToMinimum(el, 0);
      const snippet = await dragToMinimum(el, 1);

      el.assets = makeAssets(3, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the rows were never replaced', { interval: 20, timeout: 3000 });

      await expectFilled(el, 'once a new list replaces the rows');
      expect(Math.round(getColumnWidth(el, 0))).to.equal(identifier.width);
      expect(Math.round(getColumnWidth(el, 1))).to.equal(snippet.width);
    });

    it('reports each drag in the same payload, and offers no divider on the filler or the CTA column', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 700px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
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
      await expectFilled(el, 'once the container grows to 900px');

      expect(details.map((detail) => Object.keys(detail).sort().join(',')).join('|')).to.equal('field,width|field,width');
      expect(details.map(({ field }) => field).join('|')).to.equal('CoreField.Identifier|Dell.Snippet');
      expect(details.map(({ width }) => width).join('|'))
        .to.equal([0, 1].map((index) => Math.round(getColumnWidth(el, index))).join('|'));
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
      await waitForCtaColumnFit(el);
      await dragToMinimum(el, 1);

      const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

      expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

      el.style.width = '900px';
      await expectFilled(el, 'once the container grows to 900px');

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
      await waitForCtaColumnFit(el);

      const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

      expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

      // Before a drag `cx-table` lays the rows out again itself, and our debounced redraw follows it.
      el.style.width = '900px';
      await expectFilled(el, 'once the container grows to 900px');
      await settle(200);

      expect(hasFocus(cta), 'the resize took the focus off the CTA').to.equal(true);
      expect(isShown(cta), 'the focused CTA hid after the resize').to.equal(true);
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

      await waitForCtaColumnFit(el);

      const scrollport = getScrollport(el);
      const padding = Number.parseFloat(getComputedStyle(getDataCells(getRowElement(el, 'asset-0')!)[0]).paddingLeft);

      expect(padding > 0, 'the tokens left the cells unpadded').to.equal(true);
      expect(scrollport.scrollWidth <= scrollport.clientWidth,
        `the rows run ${scrollport.scrollWidth}px wide in a ${scrollport.clientWidth}px table`).to.equal(true);
      await expectFilled(el, 'at rest');
    });

    it('lets the filler take no pointer, so its area shows no hover of its own and a cold-storage row stays inert', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 700px"
          .assets=${[makeAsset({ id: 'asset-cold', inColdStorage: true, recordId: 'rec-cold' }), makeAsset()]}
          .columns=${SINGLE_LINE_COLUMNS}
        ></cx-content-browser-table>
      `, 2);

      await waitUntil(() => getRowElements(el).length === 2, 'both rows never rendered', { interval: 20, timeout: 5000 });
      await dragToMinimum(el, 1);
      await expectFilled(el, 'once every data column is fixed');

      const root = getTableRoot(el);
      const fillerOf = (assetId: string) => getRowElement(el, assetId)!
        .querySelector<HTMLElement>(`[tabulator-field="${FILLER_FIELD}"]`)!;
      const header = getColumnHeader(el, FILLER_FIELD);
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-click', spy);

      const hit = root.elementFromPoint(...centerOf(fillerOf('asset-1')));
      const coldHit = root.elementFromPoint(...centerOf(fillerOf('asset-cold')));
      const headerHit = root.elementFromPoint(...centerOf(header));

      expect(header.getBoundingClientRect().width > 100, 'the filler never took the free space').to.equal(true);
      expect(Boolean(hit) && !fillerOf('asset-1').contains(hit), 'the filler cell takes the pointer').to.equal(true);
      expect(Boolean(coldHit) && getRowElement(el, 'asset-cold')!.contains(coldHit),
        'the cold-storage row takes the pointer at its filler').to.equal(false);
      expect(Boolean(headerHit) && header.contains(headerHit), 'the filler header takes the pointer').to.equal(false);

      hit!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

      expect(spy.callCount, 'a click on the filler handed an asset over').to.equal(0);
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
