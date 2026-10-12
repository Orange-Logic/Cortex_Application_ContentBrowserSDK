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
  sendKeys,
  sendMouse,
  setViewport,
} from '@web/test-runner-commands';
import sinon from 'sinon';

import type { TableColumn } from '@/types/content-browser';

import type ContentBrowserTable from './content-browser-table';
import {
  ROW_HEIGHT,
} from './content-browser-table';
import {
  centerOf,
  COLUMNS,
  dispatchResize,
  doubleClick,
  effectiveOpacity,
  getContainer,
  getCta,
  getCtaColumnWidth,
  getCtaInnerButton,
  getCtaLabel,
  getCxTable,
  getHeaderTitles,
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
  /** The input queries the table reads, which a test sets or changes. */
  let inputQueries: ReturnType<typeof stubInputQueries>;

  beforeEach(() => {
    inputQueries = stubInputQueries();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('structure', () => {
    it('renders a cx-table, the loading bar and the resize observer', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);

      expect(Boolean(el.shadowRoot!.querySelector('cx-resize-observer'))).to.equal(true);
      expect(Boolean(getCxTable(el))).to.equal(true);
      expect(Boolean(el.shadowRoot!.querySelector('.content-browser-table-loading cx-progress-bar'))).to.equal(true);
    });

    it('has default property values', async () => {
      const el = await fixture<ContentBrowserTable>(html`<cx-content-browser-table></cx-content-browser-table>`);

      expect(el.assets).to.deep.equal([]);
      expect(el.columns).to.deep.equal([]);
      expect(el.empty).to.equal(false);
      expect(el.hasMore).to.equal(false);
      expect(el.loading).to.equal(false);
      expect(el.selectedAssetId).to.equal(undefined);
      expect(el.busyAssetId).to.equal(undefined);
    });

    it('shows the loading bar only while loading, and reflects it on the host', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" ?loading=${true}></cx-content-browser-table>
      `);
      const bar = el.shadowRoot!.querySelector<HTMLElement>('.content-browser-table-loading')!;

      expect(el.hasAttribute('loading')).to.equal(true);
      expect(bar.style.opacity).to.equal('1');

      el.loading = false;
      await elementUpdated(el);

      expect(bar.style.opacity).to.equal('0');
    });

    it('renders no table toolbar of its own, so the control bar stays the only one', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      expect(getTableRoot(el).querySelector('cx-table-toolbar') === null).to.equal(true);
    });

    it('shows the no-results state instead of the table when empty', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" empty .columns=${COLUMNS}></cx-content-browser-table>
      `);

      expect(Boolean(el.shadowRoot!.querySelector('cx-content-browser-no-result'))).to.equal(true);
      expect(getCxTable(el) === null).to.equal(true);
    });

    it('builds the table again when the list stops being empty', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" empty .columns=${COLUMNS}></cx-content-browser-table>
      `);

      el.assets = makeAssets(3);
      el.empty = false;
      await elementUpdated(el);
      await waitForRows(el, 3);

      expect(getCxTable(el)!.tabulatorInstance!.getRows().length).to.equal(3);
    });
  });

  describe('row activation', () => {
    describe('with the pointer on a row', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('hands over nothing for a click or a double click on the row itself', async () => {
        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const spy = sinon.spy();
        const cell = getRowElement(el, 'asset-1')!.querySelector<HTMLElement>('.tabulator-cell')!;

        el.addEventListener('cx-content-browser-grid-click', spy);
        await sendMouse({ position: centerOf(cell), type: 'click' });
        doubleClick(cell);

        // Every one of these clicks is dispatched before this line runs, and a hand-over is synchronous.
        expect(spy.callCount, 'a click on the row handed its asset over').to.equal(0);
      });

      it('shows the pointer cursor over the CTA only, never over the row it hands nothing over for', async () => {
        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const row = getRowElement(el, 'asset-0')!;
        const cell = row.querySelector<HTMLElement>('.tabulator-cell')!;
        const cta = (await getCta(row))!;

        await sendMouse({ position: centerOf(cell), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        expect(getComputedStyle(cell).cursor, 'the row shows the cursor of a clickable row').to.equal('default');
        expect(getComputedStyle(cta).cursor, 'the CTA lost its pointer cursor').to.equal('pointer');
      });

      it('hands the asset over once when the pointer clicks its CTA', async () => {
        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const spy = sinon.spy();
        const row = getRowElement(el, 'asset-0')!;
        const cta = (await getCta(row))!;

        el.addEventListener('cx-content-browser-grid-click', spy);
        await sendMouse({ position: centerOf(row.querySelector('.tabulator-cell')!), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        const [x, y] = centerOf(cta);
        const hit = getTableRoot(el).elementFromPoint(x, y);

        expect(Boolean(hit) && cta.contains(hit), 'the CTA is not what the pointer lands on').to.equal(true);

        await sendMouse({ position: [x, y], type: 'click' });

        expect(spy.args.map(([event]) => (event as CustomEvent<{ id: string }>).detail.id)).to.deep.equal(['asset-0']);
      });
    });

    it('hands the asset over once for a double click on its CTA', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-click', spy);
      doubleClick(getCtaInnerButton((await getCta(getRowElement(el, 'asset-1')))!));

      expect(spy.args.map(([event]) => (event as CustomEvent<{ id: string }>).detail.id)).to.deep.equal(['asset-1']);
    });

    it('hands the asset over from the keyboard through its CTA', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const cta = (await getCta(getRowElement(el, 'asset-1')))!;
      const event = oneEvent(el, 'cx-content-browser-grid-click');

      getCtaInnerButton(cta).focus();
      await sendKeys({ press: 'Enter' });

      expect((await event).detail.id).to.equal('asset-1');
    });

    it('keeps the table events inside the picker', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const leaked = sinon.spy();

      el.addEventListener('cx-table.rowClick', leaked);
      el.addEventListener('cx-table-row-action-click', leaked);
      (await getCta(getRowElement(el, 'asset-0')))!.click();
      await elementUpdated(el);

      expect(leaked.callCount).to.equal(0);
    });

    it('offers a cold-storage asset no CTA', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[makeAsset({ inColdStorage: true })]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);

      expect((await getCta(getRowElement(el, 'asset-1'))) === undefined).to.equal(true);
    });

    it('does not hand over an asset that went to cold storage after its CTA rendered', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const spy = sinon.spy();
      const staleCta = (await getCta(getRowElement(el, 'asset-0')))!;
      const liveCta = (await getCta(getRowElement(el, 'asset-1')))!;
      const [first, ...rest] = makeAssets(3);

      // New objects for the assets the rows show replace the rows, but only once Tabulator's
      // half-second `setData` wait runs out: until then asset-0 keeps its CTA.
      el.assets = [{ ...first, inColdStorage: true }, ...rest];
      await elementUpdated(el);
      el.addEventListener('cx-content-browser-grid-click', spy);
      staleCta.click();
      liveCta.click();

      expect(staleCta.isConnected, 'the rows were replaced before the stale CTA was clicked').to.equal(true);
      expect(spy.args.map(([event]) => (event as CustomEvent<{ id: string }>).detail.id)).to.deep.equal(['asset-1']);
    });

    it('lets a cold-storage row take no pointer, so it never shows as clickable', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          .assets=${[makeAsset({ id: 'asset-cold', inColdStorage: true, recordId: 'rec-cold' }), makeAsset()]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `, 2);

      await waitUntil(() => getRowElements(el).length === 2, 'both rows never rendered', { interval: 20, timeout: 5000 });

      expect(getComputedStyle(getRowElement(el, 'asset-cold')!).pointerEvents).to.equal('none');
      expect(getComputedStyle(getRowElement(el, 'asset-1')!).pointerEvents).to.equal('auto');
    });

    it('labels the CTA with the host cta text, in the host\'s text transform', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          cta-text="add to page"
          cta-text-transform="capitalize"
          .assets=${[makeAsset()]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);

      expect(getCtaLabel((await getCta(getRowElements(el)[0]))!)).to.equal('Add To Page');
    });

    it('falls back to Insert when the host sets no cta text', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `);

      expect(getCtaLabel((await getCta(getRowElements(el)[0]))!)).to.equal('Insert');
    });

    it('relabels every row in place when the cta text changes', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const before = (await getCta(getRowElement(el, 'asset-1')))!;

      el.ctaText = 'place';
      el.ctaTextTransform = 'uppercase';
      await elementUpdated(el);

      await waitUntil(async () => getCtaLabel((await getCta(getRowElement(el, 'asset-0')))!) === 'PLACE'
        && getCtaLabel((await getCta(getRowElement(el, 'asset-1')))!) === 'PLACE',
      'a row kept its old label', { interval: 20, timeout: 3000 });
      expect((await getCta(getRowElement(el, 'asset-1'))) === before, 'the relabel rebuilt the CTA').to.equal(true);
    });

    it('relabels a list that arrives with new cta text without updating a row the table does not hold', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const rejections: string[] = [];
      const onRejection = (event: PromiseRejectionEvent) => {
        rejections.push(String(event.reason));
        event.preventDefault();
      };

      window.addEventListener('unhandledrejection', onRejection);

      try {
        el.ctaText = 'Place';
        el.assets = makeAssets(2, 0, 'other');
        await elementUpdated(el);
        await waitUntil(async () => {
          const cta = await getCta(getRowElement(el, 'other-1'));

          return cta !== undefined && getCtaLabel(cta) === 'Place';
        }, 'the new list never took the new label', { interval: 20, timeout: 3000 });
        await settle(100);
      } finally {
        window.removeEventListener('unhandledrejection', onRejection);
      }

      expect(rejections.join(' | ')).to.equal('');
    });
  });

  describe('CTA visibility', () => {
    afterEach(async () => {
      await resetMouse();
    });

    it('hides the CTA at rest and shows it while the pointer is on its row', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 2);
      const idle = (await getCta(getRowElement(el, 'asset-0')))!;
      const hovered = (await getCta(getRowElement(el, 'asset-1')))!;

      expect(effectiveOpacity(idle), 'a CTA shows at rest').to.equal(0);
      expect(effectiveOpacity(hovered), 'a CTA shows at rest').to.equal(0);

      await sendMouse({ position: centerOf(getRowElement(el, 'asset-1')!.querySelector('.tabulator-cell')!), type: 'move' });

      await waitUntil(() => isShown(hovered), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });
      expect(effectiveOpacity(idle), 'a row the pointer is not on showed its CTA').to.equal(0);

      await sendMouse({ position: [0, 0], type: 'move' });

      await waitUntil(() => effectiveOpacity(hovered) === 0, 'the CTA stayed on screen after the pointer left the row',
        { interval: 20, timeout: 3000 });
    });

    it('shows the CTA that keyboard focus lands on', async () => {
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        </div>
      `);
      const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 2);
      await getCta(getRowElement(el, 'asset-0'));

      const focused = await tabToCta(page.querySelector<HTMLElement>('.before')!);

      expect(focused === undefined, 'Tab never reached a CTA').to.equal(false);
      expect(focused === (await getCta(getRowElement(el, 'asset-0'))), 'Tab skipped the first row\'s CTA').to.equal(true);
      await waitUntil(() => isShown(focused), 'the focused CTA stayed hidden', { interval: 20, timeout: 3000 });
      expect(effectiveOpacity((await getCta(getRowElement(el, 'asset-1')))!), 'an unfocused CTA showed').to.equal(0);

      await sendKeys({ press: 'Tab' });

      await waitUntil(() => effectiveOpacity(focused!) === 0, 'the CTA stayed on screen after focus left it',
        { interval: 20, timeout: 3000 });
    });

    it('keeps keyboard focus on its CTA while the host marks its row busy, selected, and then neither', async () => {
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        </div>
      `);
      const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 2);
      await getCta(getRowElement(el, 'asset-0'));

      const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

      expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

      el.selectedAssetId = 'asset-0';
      el.busyAssetId = 'asset-0';
      await elementUpdated(el);
      await waitUntil(() => cta.hasAttribute('loading'), 'the busy row never spun', { interval: 20, timeout: 3000 });

      expect(hasFocus(cta), 'the busy mark took the focus off the CTA').to.equal(true);

      el.busyAssetId = undefined;
      el.selectedAssetId = undefined;
      await elementUpdated(el);
      await waitUntil(() => !cta.hasAttribute('loading'), 'the row kept spinning', { interval: 20, timeout: 3000 });

      expect(hasFocus(cta), 'clearing the marks took the focus off the CTA').to.equal(true);
      expect(isShown(cta), 'the focused CTA hid once its row was no longer marked').to.equal(true);
    });

    it('keeps keyboard focus on its CTA when a relabel resizes its column', async () => {
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
      const before = getCtaColumnWidth(el);

      el.ctaText = 'Add this asset to the page';
      await elementUpdated(el);
      await waitUntil(() => getCtaColumnWidth(el) > before && isCtaColumnFitted(cta),
        'the CTA column was never fitted to the longer label', { interval: 20, timeout: 3000 });

      expect(hasFocus(cta), 'the relabel took the focus off the CTA').to.equal(true);
      expect(isShown(cta), 'the focused CTA hid after the relabel').to.equal(true);
    });

    it('keeps keyboard focus on its CTA when the next page is appended', async () => {
      const firstPage = makeAssets(2);
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px; width: 700px" .assets=${firstPage} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        </div>
      `);
      const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 2);
      await waitForCtaColumnFit(el);

      const cta = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

      expect(hasFocus(cta), 'Tab never reached the CTA').to.equal(true);

      el.assets = [...firstPage, ...makeAssets(2, 2)];
      await elementUpdated(el);
      await waitForRows(el, 4);

      expect(hasFocus(cta), 'the appended page took the focus off the CTA').to.equal(true);
      expect(isShown(cta), 'the focused CTA hid once the page was appended').to.equal(true);
    });

    it('gives the focus back without a scroll when an appended page renders the focused CTA off screen', async () => {
      const firstPage = makeAssets(60);
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px; width: 700px" .assets=${firstPage} .columns=${SINGLE_LINE_COLUMNS}>
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

      expect(cta.getBoundingClientRect().bottom <= scrollport.getBoundingClientRect().top,
        'the scroll left the focused CTA on screen').to.equal(true);
      expect(cta.isConnected && hasFocus(cta), 'the scroll took the focused CTA off the page').to.equal(true);

      el.assets = [...firstPage, ...makeAssets(30, 60)];
      await elementUpdated(el);
      await waitForRows(el, 90);
      await waitUntil(() => hasFocus(cta), 'the appended page took the focus off the CTA', { interval: 20, timeout: 3000 });

      expect(Math.abs(scrollport.scrollTop - before) <= ROW_HEIGHT,
        `giving the focus back scrolled the rows from ${before} to ${scrollport.scrollTop}`).to.equal(true);
    });

    it('keeps the hover and the focus of the rows on the page while a new list waits to replace them', async () => {
      const page = await fixture<HTMLDivElement>(html`
        <div>
          <button class="before">before</button>
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        </div>
      `);
      const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

      await waitForRows(el, 2);
      await waitForCtaColumnFit(el);

      const focused = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;
      const hoveredRow = getRowElement(el, 'asset-1')!;
      const hovered = (await getCta(hoveredRow))!;

      expect(hasFocus(focused), 'Tab never reached the CTA').to.equal(true);

      // Dispatched, not sent: every step below has to land inside the half second Tabulator waits
      // before it applies the new list.
      hoveredRow.dispatchEvent(new MouseEvent('mouseenter'));

      expect(isShown(hovered), 'the row under the pointer never showed its CTA').to.equal(true);

      el.assets = makeAssets(2, 0, 'other');
      await elementUpdated(el);
      hoveredRow.dispatchEvent(new MouseEvent('mouseleave'));
      el.selectedAssetId = 'asset-0';
      await elementUpdated(el);
      el.selectedAssetId = undefined;
      await elementUpdated(el);

      expect(hoveredRow.isConnected && focused.isConnected, 'the new list replaced the rows before the checks').to.equal(true);
      expect(effectiveOpacity(hovered), 'the CTA stayed on screen after the pointer left its row').to.equal(0);
      expect(isShown(focused) && hasFocus(focused), 'a repaint hid the CTA that holds the focus').to.equal(true);
    });

    describe('on a device with no hover', () => {
      it('shows every CTA at rest, so one tap on a CTA hands its asset over', async () => {
        inputQueries.get('(hover: none)')!.set(true);

        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const row = getRowElement(el, 'asset-1')!;
        const cta = (await getCta(row))!;
        const spy = sinon.spy();

        el.addEventListener('cx-content-browser-grid-click', spy);

        expect(isShown(cta), 'a CTA hid at rest on a device with no hover').to.equal(true);

        // A tap as a touch screen delivers it: the press, then the emulated `mouseenter` on the row, then the click.
        cta.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, pointerType: 'touch' }));
        row.dispatchEvent(new MouseEvent('mouseenter'));
        cta.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0, cancelable: true, composed: true, detail: 1 }));

        expect(spy.args.map(([event]) => (event as CustomEvent<{ id: string }>).detail.id)).to.deep.equal(['asset-1']);
      });

      it('hides the CTAs in place once a mouse gives the device a hover, and shows them again once it goes', async () => {
        const query = inputQueries.get('(hover: none)')!;

        query.set(true);

        const page = await fixture<HTMLDivElement>(html`
          <div>
            <button class="before">before</button>
            <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
            </cx-content-browser-table>
          </div>
        `);
        const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

        await waitForRows(el, 2);

        const idle = (await getCta(getRowElement(el, 'asset-1')))!;
        const focused = (await tabToCta(page.querySelector<HTMLElement>('.before')!))!;

        expect(hasFocus(focused), 'Tab never reached the CTA').to.equal(true);
        expect(isShown(idle), 'a CTA hid at rest on a device with no hover').to.equal(true);

        query.change(false);

        expect(effectiveOpacity(idle), 'a CTA stayed on screen at rest once the device had a hover').to.equal(0);
        expect(isShown(focused) && hasFocus(focused), 'the focused CTA hid or lost the focus').to.equal(true);

        query.change(true);

        expect(isShown(idle), 'a CTA stayed hidden once the device had no hover again').to.equal(true);
        expect(hasFocus(focused), 'the change took the focus off the CTA').to.equal(true);
        expect((await getCta(getRowElement(el, 'asset-1'))) === idle, 'the change built the CTA again').to.equal(true);
      });

      it('stops following the input queries once it leaves the page', async () => {
        const spies = [...inputQueries].map(([media, { list }]) => ({
          added: sinon.spy(list, 'addEventListener'),
          media,
          removed: sinon.spy(list, 'removeEventListener'),
        }));
        const el = await fixture<ContentBrowserTable>(html`
          <cx-content-browser-table style="height: 400px" .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
        `);

        el.remove();

        spies.forEach(({ added, media, removed }) => {
          const listener: unknown = added.args.find(([type]) => type === 'change')?.[1];

          expect(listener !== undefined, `the table never followed ${media}`).to.equal(true);
          expect(removed.args.some(([type, callback]) => type === 'change' && callback === listener),
            `the table kept its listener on ${media} once it left the page`).to.equal(true);
        });
      });
    });

    describe('on a device with a touch screen beside its mouse', () => {
      it('shows every CTA at rest, so one tap on a CTA hands its asset over, and hides them once the touch screen goes', async () => {
        const coarsePointer = inputQueries.get('(any-pointer: coarse)')!;

        coarsePointer.set(true);

        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const idle = (await getCta(getRowElement(el, 'asset-0')))!;
        const row = getRowElement(el, 'asset-1')!;
        const cta = (await getCta(row))!;
        const spy = sinon.spy();

        el.addEventListener('cx-content-browser-grid-click', spy);

        expect(isShown(cta), 'a CTA hid at rest on a device with a touch screen beside its mouse').to.equal(true);

        // A tap as a touch screen delivers it: the press, then the emulated `mouseenter` on the row, then the click.
        cta.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, pointerType: 'touch' }));
        row.dispatchEvent(new MouseEvent('mouseenter'));
        cta.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0, cancelable: true, composed: true, detail: 1 }));

        expect(spy.args.map(([event]) => (event as CustomEvent<{ id: string }>).detail.id)).to.deep.equal(['asset-1']);

        coarsePointer.change(false);

        expect(effectiveOpacity(idle), 'a CTA stayed on screen at rest once the touch screen went').to.equal(0);
      });
    });

    describe('with the pointer resting on a row', () => {
      it('keeps the relabelled CTA on screen under the pointer, until the pointer leaves the row', async () => {
        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const cta = (await getCta(getRowElement(el, 'asset-1')))!;

        await sendMouse({ position: centerOf(getRowElement(el, 'asset-1')!.querySelector('.tabulator-cell')!), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        el.ctaText = 'Place';
        await elementUpdated(el);
        await waitUntil(() => getCtaLabel(cta) === 'Place', 'the row kept its old label', { interval: 20, timeout: 3000 });

        // The pointer has not moved: the relabelled CTA it rests on stays there to click.
        expect(isShown(cta), 'the relabelled row hid its CTA under the pointer').to.equal(true);

        await sendMouse({ position: [0, 0], type: 'move' });

        await waitUntil(() => effectiveOpacity(cta) === 0, 'the CTA stayed on screen after the pointer left the row',
          { interval: 20, timeout: 3000 });
      });

      it('keeps the CTA on screen once the insert settles, until the pointer leaves the row', async () => {
        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        `, 2);
        const cta = (await getCta(getRowElement(el, 'asset-1')))!;

        await sendMouse({ position: centerOf(getRowElement(el, 'asset-1')!.querySelector('.tabulator-cell')!), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        el.busyAssetId = 'asset-1';
        await elementUpdated(el);
        await waitUntil(() => cta.hasAttribute('loading'), 'the busy row never spun', { interval: 20, timeout: 3000 });

        el.busyAssetId = undefined;
        await elementUpdated(el);
        await waitUntil(() => !cta.hasAttribute('loading'), 'the row kept spinning after the insert settled',
          { interval: 20, timeout: 3000 });

        // The pointer has not moved: the CTA it rests on stays there to click.
        expect((await getCta(getRowElement(el, 'asset-1'))) === cta, 'the settled insert rebuilt the CTA').to.equal(true);
        expect(isShown(cta), 'the settled row hid its CTA under the pointer').to.equal(true);

        await sendMouse({ position: [0, 0], type: 'move' });

        await waitUntil(() => effectiveOpacity(cta) === 0, 'the CTA stayed on screen after the pointer left the row',
          { interval: 20, timeout: 3000 });
      });

      it('lets the CTA go once a scroll takes the row off the page from under the pointer', async () => {
        const el = await mount(html`
          <cx-content-browser-table style="height: 400px" .assets=${makeAssets(200)} .columns=${SINGLE_LINE_COLUMNS}>
          </cx-content-browser-table>
        `, 200);
        const row = getRowElement(el, 'asset-1')!;
        const cta = (await getCta(row))!;

        await sendMouse({ position: centerOf(row.querySelector('.tabulator-cell')!), type: 'move' });
        await waitUntil(() => isShown(cta), 'the row under the pointer never showed its CTA', { interval: 20, timeout: 3000 });

        const scrollport = getScrollport(el);
        // Chromium moves the hover as the rows scroll, so the row gets its `mouseleave` before it is
        // taken off the page. A browser that moves the hover only once the scroll ends sends it none:
        // held back here, the row leaves the page still showing its CTA.
        const holdBackLeave = (event: Event) => {
          if (event.target === row) {
            event.stopPropagation();
          }
        };

        scrollport.addEventListener('mouseleave', holdBackLeave, true);

        try {
          scrollport.scrollTop = scrollport.scrollHeight;
          await waitUntil(() => row.isConnected === false,
            'the scroll never took the row off the page', { interval: 20, timeout: 3000 });
        } finally {
          scrollport.removeEventListener('mouseleave', holdBackLeave, true);
        }

        await sendMouse({ position: [0, 0], type: 'move' });
        scrollport.scrollTop = 0;

        await waitUntil(() => row.isConnected && effectiveOpacity(cta) === 0,
          'the row kept its CTA on screen after a scroll took it from under the pointer', { interval: 20, timeout: 3000 });
      });
    });
  });

  describe('selection', () => {
    it('marks the selected row with aria-current, and no other', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      el.selectedAssetId = 'asset-1';
      await elementUpdated(el);

      expect(getRowElement(el, 'asset-1')!.getAttribute('aria-current')).to.equal('true');
      expect(getRowElement(el, 'asset-0')!.getAttribute('aria-current') === 'true').to.equal(false);
      expect(getRowElements(el).some((row) => row.hasAttribute('aria-selected'))).to.equal(false);
    });

    it('moves the mark when the selection moves', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          selected-asset-id="asset-0"
          .assets=${makeAssets(2)}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `, 2);

      expect(getRowElement(el, 'asset-0')!.getAttribute('aria-current')).to.equal('true');

      el.selectedAssetId = 'asset-1';
      await elementUpdated(el);

      expect(getRowElement(el, 'asset-0')!.getAttribute('aria-current')).to.equal('false');
      expect(getRowElement(el, 'asset-1')!.getAttribute('aria-current')).to.equal('true');
    });

    /** The token `cx-table` paints a selected row with, which the unthemed test page leaves empty. */
    const SELECTED_ROW_COLOR = 'rgb(1, 2, 3)';

    function rowBackground(el: ContentBrowserTable, assetId: string) {
      return getComputedStyle(getRowElement(el, assetId)!).backgroundColor;
    }

    it('marks the selected row as current without painting it, and moves the mark with the selection', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; --cx-color-primary-200: ${SELECTED_ROW_COLOR}"
          selected-asset-id="asset-1"
          .assets=${makeAssets(2)}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `, 2);
      const isCurrent = (assetId: string) => getRowElement(el, assetId)!.getAttribute('aria-current') === 'true';

      expect(isCurrent('asset-1')).to.equal(true);
      expect(isCurrent('asset-0')).to.equal(false);
      // An import must not paint cx-table's selected-row highlight.
      expect(rowBackground(el, 'asset-1') === SELECTED_ROW_COLOR, 'the selected row is painted').to.equal(false);
      // A selection brings none of cx-table's selection chrome: no checkbox column, no toolbar.
      expect(getHeaderTitles(el).join('|')).to.equal('Identifier|Snippet');
      expect(getTableRoot(el).querySelector('cx-checkbox, cx-table-toolbar') === null).to.equal(true);

      el.selectedAssetId = 'asset-0';
      await elementUpdated(el);

      expect(isCurrent('asset-0')).to.equal(true);
      expect(isCurrent('asset-1')).to.equal(false);
      expect(rowBackground(el, 'asset-0') === SELECTED_ROW_COLOR, 'the selected row is painted').to.equal(false);
    });

    it('leaves a clicked row unpainted: only the host selects a row', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; --cx-color-primary-200: ${SELECTED_ROW_COLOR}"
          .assets=${makeAssets(2)}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `, 2);

      getRowElement(el, 'asset-0')!.querySelector<HTMLElement>('.tabulator-cell')!.click();

      expect(rowBackground(el, 'asset-0') === SELECTED_ROW_COLOR, 'the click painted the row').to.equal(false);
      expect(getRowElement(el, 'asset-0')!.getAttribute('aria-current') === 'true').to.equal(false);
    });
  });

  describe('insert pending state', () => {
    it('spins the CTA of the busy row only', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      el.busyAssetId = 'asset-1';
      await elementUpdated(el);

      await waitUntil(async () => Boolean((await getCta(getRowElement(el, 'asset-1')))?.hasAttribute('loading')),
        'the busy row never spun', { interval: 20, timeout: 3000 });
      expect((await getCta(getRowElement(el, 'asset-0')))!.hasAttribute('loading')).to.equal(false);
    });

    it('keeps the busy row\'s CTA on screen without a hover', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      el.busyAssetId = 'asset-1';
      await elementUpdated(el);

      await waitUntil(async () => isShown(await getCta(getRowElement(el, 'asset-1'))),
        'the busy row hid its CTA', { interval: 20, timeout: 3000 });
      expect(effectiveOpacity((await getCta(getRowElement(el, 'asset-0')))!)).to.equal(0);
    });

    it('keeps the selected row\'s CTA on screen without a hover, and spins only the busy row', async () => {
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px"
          selected-asset-id="asset-0"
          .assets=${makeAssets(3)}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `, 3);
      const ctaOf = (id: string) => getCta(getRowElement(el, id));
      const isCtaShown = async (id: string) => isShown(await ctaOf(id));
      const isSpinning = async (id: string) => Boolean((await ctaOf(id))?.hasAttribute('loading'));

      await waitUntil(() => isCtaShown('asset-0'), 'the selected row hid its CTA', { interval: 20, timeout: 3000 });
      expect(await isCtaShown('asset-1'), 'an unselected row showed its CTA').to.equal(false);

      el.selectedAssetId = 'asset-1';
      el.busyAssetId = 'asset-2';
      await elementUpdated(el);

      await waitUntil(() => isCtaShown('asset-1'), 'the newly selected row hid its CTA', { interval: 20, timeout: 3000 });
      await waitUntil(() => isSpinning('asset-2'), 'the busy row never spun', { interval: 20, timeout: 3000 });
      expect(await isCtaShown('asset-0'), 'the row the selection left kept its CTA on screen').to.equal(false);
      expect(await isCtaShown('asset-2'), 'the busy row hid its CTA').to.equal(true);
      expect(await isSpinning('asset-1'), 'the selected row spun without an insert running').to.equal(false);
    });

    it('stops spinning once the insert settles', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(2)} .columns=${COLUMNS}>
        </cx-content-browser-table>
      `, 2);

      el.busyAssetId = 'asset-1';
      await elementUpdated(el);
      await waitUntil(async () => Boolean((await getCta(getRowElement(el, 'asset-1')))?.hasAttribute('loading')),
        'the busy row never spun', { interval: 20, timeout: 3000 });

      el.busyAssetId = undefined;
      await elementUpdated(el);

      await waitUntil(async () => (await getCta(getRowElement(el, 'asset-1')))?.hasAttribute('loading') === false,
        'the row kept spinning after the insert settled', { interval: 20, timeout: 3000 });
    });
  });

  describe('paging', () => {
    it('appends the next page without scrolling back to the top', async () => {
      const firstPage = makeAssets(60);
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${firstPage} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const scrollport = getScrollport(el);

      scrollport.scrollTop = 1200;
      await settle(100);
      const before = scrollport.scrollTop;

      el.assets = [...firstPage, ...makeAssets(30, 60)];
      await elementUpdated(el);
      await waitForRows(el, 90);
      await settle(100);

      expect(before > 0, 'the scrollport never scrolled').to.equal(true);
      expect(Math.abs(scrollport.scrollTop - before) <= ROW_HEIGHT,
        `scrolled from ${before} to ${scrollport.scrollTop}`).to.equal(true);
    });

    it('keeps its place when a page brings no asset the table does not already hold', async () => {
      const assets = makeAssets(60);
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${assets} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const scrollport = getScrollport(el);

      scrollport.scrollTop = 1200;
      await settle(100);
      const before = scrollport.scrollTop;

      // `content-browser` merges a page of records it already lists into a new array of the same assets.
      el.assets = [...assets];
      await elementUpdated(el);
      // Past the half second Tabulator waits before it applies `setData`.
      await settle(800);

      expect(before > 0, 'the scrollport never scrolled').to.equal(true);
      expect(Math.abs(scrollport.scrollTop - before) <= ROW_HEIGHT,
        `scrolled from ${before} to ${scrollport.scrollTop}`).to.equal(true);
    });

    it('replaces the rows, and returns to the top, for a different list', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const scrollport = getScrollport(el);

      scrollport.scrollTop = 1200;
      await settle(100);

      el.assets = makeAssets(70, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows().length === 70,
        'the rows were never replaced', { interval: 20, timeout: 3000 });
      await settle(100);

      expect(getCxTable(el)!.tabulatorInstance!.getRows()[0].getData().id).to.equal('other-0');
      expect(scrollport.scrollTop).to.equal(0);
    });

    it('replaces the rows when a list of the same length arrives', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(5)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 5);

      el.assets = makeAssets(5, 0, 'other');
      await elementUpdated(el);

      await waitUntil(() => getCxTable(el)!.tabulatorInstance!.getRows()[0]?.getData().id === 'other-0',
        'the rows were never replaced', { interval: 20, timeout: 3000 });
      expect(getCxTable(el)!.tabulatorInstance!.getRows().length).to.equal(5);
    });

    it('keeps a page that lands while a new list still waits to replace the rows', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(5)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 5);
      const others = makeAssets(5, 0, 'other');
      const grown = [...others, ...makeAssets(5, 5, 'other')];
      const expected = grown.map((asset) => asset.id).join('|');
      const heldIds = () => getCxTable(el)!.tabulatorInstance!.getRows().map((row) => row.getData().id).join('|');

      el.assets = others;
      await elementUpdated(el);
      // Well inside the half second Tabulator waits before it applies `others`.
      el.assets = grown;
      await elementUpdated(el);
      await waitUntil(() => heldIds() === expected, '', { interval: 20, timeout: 3000 }).catch(() => undefined);

      expect(heldIds()).to.equal(expected);
    });

    it('hands every row to the table it rebuilds after the picker is moved', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(3)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 3);
      const parent = el.parentElement!;

      // `cx-table` destroys its Tabulator instance on disconnect and builds a new one on reconnect,
      // so the page that arrives in between has only the new table to go to.
      el.remove();
      el.assets = makeAssets(5);
      await elementUpdated(el);
      parent.appendChild(el);

      await waitUntil(() => {
        const tabulator = getCxTable(el)!.tabulatorInstance;

        return Boolean(tabulator && !tabulator.destroyed && tabulator.getRows().length === 5
          && tabulator.getRows()[0].getData().id === 'asset-0');
      }, 'the rebuilt table did not get every row', { interval: 20, timeout: 5000 });
    });

    it('emits cx-content-browser-grid-scroll-end at the bottom when has-more is set', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" has-more .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const event = oneEvent(el, 'cx-content-browser-grid-scroll-end');
      const scrollport = getScrollport(el);

      scrollport.scrollTop = scrollport.scrollHeight;

      await event;
    });

    it('emits cx-content-browser-grid-scroll-end when a scroll stops less than a row short of the end', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" has-more .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const event = oneEvent(el, 'cx-content-browser-grid-scroll-end');
      const scrollport = getScrollport(el);

      // Measured in Chromium on 60 rows: the furthest a scroll reached, against the scroll height
      // Tabulator reported once it had re-padded the rows.
      Object.defineProperty(scrollport, 'scrollTop', { configurable: true, value: 2514 });
      Object.defineProperty(scrollport, 'clientHeight', { configurable: true, value: 366 });
      Object.defineProperty(scrollport, 'scrollHeight', { configurable: true, value: 2898 });
      getCxTable(el)!.dispatchEvent(new CustomEvent('cx-table.scrollVertical', { detail: { args: [2514, false] } }));

      await event;
    });

    it('does not emit cx-content-browser-grid-scroll-end at the bottom without has-more', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const spy = sinon.spy();
      const scrollport = getScrollport(el);

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      scrollport.scrollTop = scrollport.scrollHeight;
      await settle();

      expect(spy.callCount).to.equal(0);
    });

    it('does not emit cx-content-browser-grid-scroll-end away from the bottom', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" has-more .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const spy = sinon.spy();
      const scrollport = getScrollport(el);

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      scrollport.scrollTop = 200;
      await settle();

      expect(spy.callCount).to.equal(0);
    });

    it('does not ask for another page from its own scrollport while a page is loading', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" has-more loading .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      const spy = sinon.spy();
      const scrollport = getScrollport(el);
      const scrollToEnd = () => getCxTable(el)!.dispatchEvent(
        new CustomEvent('cx-table.scrollVertical', { detail: { args: [2514, false] } }),
      );

      // Less than a row short of the end, as measured in Chromium on 60 rows.
      Object.defineProperty(scrollport, 'scrollTop', { configurable: true, value: 2514 });
      Object.defineProperty(scrollport, 'clientHeight', { configurable: true, value: 366 });
      Object.defineProperty(scrollport, 'scrollHeight', { configurable: true, value: 2898 });
      el.addEventListener('cx-content-browser-grid-scroll-end', spy);

      scrollToEnd();
      // Past the scroll-end debounce.
      await settle(400);

      expect(spy.callCount, 'asked for another page while one was loading').to.equal(0);

      el.loading = false;
      await elementUpdated(el);
      scrollToEnd();

      await waitUntil(() => spy.callCount > 0, 'a scroll to the end asked for nothing once the page landed',
        { interval: 20, timeout: 3000 });
    });

    it('does not ask for another page when the table is only scrolled sideways', async () => {
      const wide: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '600px' },
        { field: 'Dell.Snippet', title: 'Snippet', width: '600px' },
      ];
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px; width: 500px" has-more .assets=${makeAssets(3)} .columns=${wide}>
        </cx-content-browser-table>
      `, 3);
      const spy = sinon.spy();
      const scrollport = getScrollport(el);

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      scrollport.scrollLeft = 300;
      await settle();

      expect(scrollport.scrollLeft > 0, 'the table did not scroll sideways').to.equal(true);
      expect(spy.callCount).to.equal(0);
    });
  });

  describe('page size', () => {
    it('emits cx-content-browser-grid-resize with a single column and the visible row count', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      const event = oneEvent(el, 'cx-content-browser-grid-resize');

      dispatchResize(el, resizeObserverEntry(getContainer(el), 480));

      expect((await event).detail).to.deep.equal({ columnCount: 1, rowCount: Math.ceil(480 / ROW_HEIGHT) });
    });

    it('ignores a resize reported for an element other than the table container', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      dispatchResize(el, resizeObserverEntry(document.createElement('div'), 900));
      await settle();

      expect(spy.callCount).to.equal(0);
    });

    it('does not re-emit for a height change under the threshold', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 480));
      await settle();

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      dispatchResize(el, resizeObserverEntry(getContainer(el), 485));
      await settle();

      expect(spy.callCount).to.equal(0);
    });

    it('does not re-emit a row count that has not changed', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      // Past the 10px threshold, still the same 20 rows.
      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 5));
      await settle();

      expect(spy.callCount).to.equal(0);
    });

    it('reports the count again once the restarted rows are in, with no resize to measure it', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(60)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 60);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      // The rows never size the container, so a restarted list brings no resize with it.
      el.assets = makeAssets(60, 0, 'other');
      await elementUpdated(el);
      await waitUntil(() => spy.callCount > 0, 'the restarted list reported no count', { interval: 20, timeout: 3000 });

      expect((spy.firstCall.args[0] as CustomEvent<{ rowCount: number }>).detail.rowCount).to.equal(20);
    });

    it('reports the count again for a restarted list that keeps the first asset and grows', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(20)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 20);
      await settle();

      dispatchResize(el, resizeObserverEntry(getContainer(el), 20 * ROW_HEIGHT - 20));
      await settle();

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-resize', spy);
      // A filter removed again: the host restarts at the page size it last asked for, and the longer
      // list it brings starts with the asset the filtered one did, as new objects.
      el.assets = makeAssets(30);
      await elementUpdated(el);
      await waitUntil(() => spy.callCount > 0, '', { interval: 20, timeout: 3000 }).catch(() => undefined);

      expect(spy.callCount, 'the restarted list reported no count').to.equal(1);
      expect((spy.firstCall.args[0] as CustomEvent<{ rowCount: number }>).detail.rowCount).to.equal(20);
    });

    it('caps the count at the viewport while its rows do not fill the scrollport', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 2000px" .assets=${makeAssets(5)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 5);
      await settle();

      // Whether the first real measurement landed before or after the table was built decides
      // whether it was capped, so a count below the cap goes first and the capped one is a change.
      const below = oneEvent(el, 'cx-content-browser-grid-resize');

      dispatchResize(el, resizeObserverEntry(getContainer(el), 2 * ROW_HEIGHT));

      expect((await below).detail.rowCount).to.equal(2);

      const event = oneEvent(el, 'cx-content-browser-grid-resize');

      dispatchResize(el, resizeObserverEntry(getContainer(el), 1950));

      expect((await event).detail.rowCount).to.equal(Math.ceil(window.innerHeight / ROW_HEIGHT));
    });

    it('reports the full height when the rows overflow the scrollport', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 1000px" .assets=${makeAssets(200)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 200);
      await settle();

      const event = oneEvent(el, 'cx-content-browser-grid-resize');

      dispatchResize(el, resizeObserverEntry(getContainer(el), 960));

      expect((await event).detail.rowCount).to.equal(Math.ceil(960 / ROW_HEIGHT));
    });
  });

  describe('a table taller than the viewport that its rows do not fill', () => {
    afterEach(async () => {
      window.scrollTo(0, 0);
      await setViewport({ height: 600, width: 800 });
    });

    it('asks for the next page while its last row is in view', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 2000px" has-more .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const event = oneEvent(el, 'cx-content-browser-grid-scroll-end');

      el.assets = makeAssets(5);
      await elementUpdated(el);

      await event;
    });

    it('asks for nothing more when a page brings no asset the table does not already hold', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 2000px" has-more .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const assets = makeAssets(5);
      const first = oneEvent(el, 'cx-content-browser-grid-scroll-end');

      el.assets = assets;
      await elementUpdated(el);
      await first;
      await settle(400);

      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      // `content-browser` merges a page of records it already lists into a new array of the same assets.
      el.assets = [...assets];
      await elementUpdated(el);
      // Past Tabulator's half-second wait before `setData`, and the last-row debounce after it.
      await settle(1500);

      expect(spy.callCount).to.equal(0);
    });

    it('waits for the page to bring the last row into view', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 3000px" has-more .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      el.assets = makeAssets(30);
      await elementUpdated(el);
      await waitForRows(el, 30);
      await settle(400);

      expect(spy.callCount, 'asked for more while the last row was below the viewport').to.equal(0);

      getRowElement(el, 'asset-29')!.scrollIntoView();

      await waitUntil(() => spy.callCount > 0, 'scrolling the last row into view asked for nothing',
        { interval: 20, timeout: 3000 });
    });

    it('asks for nothing without has-more', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 2000px" .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      el.assets = makeAssets(5);
      await elementUpdated(el);
      await waitForRows(el, 5);
      await settle(400);

      expect(spy.callCount).to.equal(0);
    });

    it('waits for a loading page to land before it asks for the next one', async () => {
      const el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 2000px" has-more loading .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `);
      const spy = sinon.spy();

      el.addEventListener('cx-content-browser-grid-scroll-end', spy);
      el.assets = makeAssets(5);
      await elementUpdated(el);
      await waitForRows(el, 5);
      await settle(400);

      expect(spy.callCount, 'asked for another page while one was loading').to.equal(0);

      el.loading = false;
      el.assets = [...el.assets, ...makeAssets(1, 5)];
      await elementUpdated(el);

      await waitUntil(() => spy.callCount > 0, 'the page that landed asked for nothing more',
        { interval: 20, timeout: 3000 });
    });
  });

  describe('layout', () => {
    it('renders only the rows around the scrollport, not every row it holds', async () => {
      const el = await mount(html`
        <cx-content-browser-table style="height: 400px" .assets=${makeAssets(200)} .columns=${SINGLE_LINE_COLUMNS}>
        </cx-content-browser-table>
      `, 200);
      const held = getCxTable(el)!.tabulatorInstance!.getRows().length;
      const rendered = getRowElements(el).length;

      expect(held).to.equal(200);
      expect(rendered <= held / 4, `${rendered} of ${held} rows are in the DOM`).to.equal(true);
    });

    /**
     * The host shapes from L-42BBKC. In each one the rows have to scroll inside the table's own
     * scrollport, the scrollport has to have a height of its own, and nothing may reach past the
     * container into the page below it.
     */
    const shapes = [
      {
        name: 'a container with a definite height',
        outer: 'height: 500px; width: 600px',
        slot: 'height: 460px',
        table: 'height: 100%',
      },
      {
        name: 'a slot that takes its height from a flex line',
        outer: 'display: flex; flex-direction: column; height: 500px; width: 600px',
        slot: 'flex: 1',
        table: 'height: 100%',
      },
      {
        name: 'a container with no height',
        outer: 'width: 600px',
        slot: '',
        table: 'height: 100%',
      },
      {
        name: 'a container with no height and the table at height auto',
        outer: 'width: 600px',
        slot: '',
        table: 'height: auto',
      },
    ];

    shapes.forEach(({ name, outer, slot, table }) => {
      it(`scrolls its rows inside ${name} without reaching the page below`, async () => {
        const page = await fixture<HTMLDivElement>(html`
          <div>
            <div class="outer" style=${outer}>
              <div style="flex: none; height: 40px">header</div>
              <div class="slot" style=${slot}>
                <cx-content-browser-table style=${table} .assets=${makeAssets(200)} .columns=${SINGLE_LINE_COLUMNS}>
                </cx-content-browser-table>
              </div>
            </div>
            <div class="below">below</div>
          </div>
        `);
        const el = page.querySelector<ContentBrowserTable>('cx-content-browser-table')!;

        await waitForRows(el, 200);

        const scrollport = getScrollport(el);
        const tableBottom = getCxTable(el)!.getBoundingClientRect().bottom;
        const belowTop = page.querySelector('.below')!.getBoundingClientRect().top;

        expect(scrollport.clientHeight > 0, 'the scrollport collapsed to nothing').to.equal(true);
        expect(scrollport.scrollHeight > scrollport.clientHeight,
          `the scrollport is ${scrollport.clientHeight}px tall and holds ${scrollport.scrollHeight}px`).to.equal(true);
        expect(tableBottom <= belowTop + 1,
          `the table ends at ${tableBottom}px, past the page below at ${belowTop}px`).to.equal(true);
      });
    });
  });
});
