import './content-browser';

import { aTimeout, expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';

import { TABLE_VIEW } from '@/types/content-browser';
import { tableColumnWidthsKey } from '@/utils/table-column-widths';

import { doubleClick, dragColumnHandle } from '../content-browser-table/content-browser-table.test-helpers';
import type CxContentBrowser from './content-browser';
import {
  getTable,
  getTabulator,
  ModeledServer,
  poll,
  shownRowIds,
  TABLE_COLUMNS,
} from './content-browser.table-replay.test-helpers';

const SITE_A = 'https://a.example';
const SITE_B = 'https://b.example';
const IDENTIFIER = 'CoreField.Identifier';
const TITLE = 'CoreField.TitleWithFallback';

const store = (site: string, widths: Record<string, number>) => {
  localStorage.setItem(tableColumnWidthsKey(site), JSON.stringify(widths));
};

const stored = (site: string): Record<string, number> => JSON.parse(localStorage.getItem(tableColumnWidthsKey(site)) ?? '{}');

/** The delay of each read of the slow host storage, in milliseconds. A stored map takes two reads. */
const SLOW_MS = 100;

const identifierColumn = (el: CxContentBrowser) => getTabulator(el)!.getColumns()
  .find((column) => column.getDefinition().title === 'Identifier')!;

/** The rendered width of the Identifier column, in whole pixels. */
const identifierWidth = (el: CxContentBrowser) => Math.round(identifierColumn(el).getElement().getBoundingClientRect().width);

/** Tabulator puts the divider of a column right after the header of that column. */
const identifierHandle = (el: CxContentBrowser) => identifierColumn(el).getElement().nextElementSibling as HTMLElement;

describe('table column widths of cx-content-browser', () => {
  const server = new ModeledServer();

  beforeEach(() => {
    localStorage.clear();
    server.reset();
    server.install();
  });

  afterEach(() => {
    server.uninstall();
    localStorage.clear();
  });

  const mount = async (baseUrl = SITE_A) => {
    const el = await fixture<CxContentBrowser>(html`
      <cx-content-browser
        style="height: 500px; width: 800px"
        base-url=${baseUrl}
        default-folder-id="library"
        default-grid-view=${TABLE_VIEW}
        .tableColumns=${TABLE_COLUMNS}
      ></cx-content-browser>
    `);

    await poll(() => getTable(el) !== null && shownRowIds(el).length > 0, () => 'the table never showed rows', Number.POSITIVE_INFINITY, performance.now() + 8000);

    return el;
  };

  const resize = (el: CxContentBrowser, detail: { field: string; reset: boolean; width: number }) => {
    getTable(el)!.dispatchEvent(new CustomEvent('cx-content-browser-table-column-resize', { bubbles: true, composed: true, detail }));
  };

  it('gives the table the saved widths of its site', async () => {
    store(SITE_A, { [IDENTIFIER]: 250 });
    const el = await mount();

    await waitUntil(() => getTable(el)!.savedWidths[IDENTIFIER] === 250, 'the table never got the saved widths');
    expect(getTable(el)!.savedWidths).to.deep.equal({ [IDENTIFIER]: 250 });
  });

  it('saves a drag under the site key', async () => {
    const el = await mount();

    resize(el, { field: IDENTIFIER, reset: false, width: 240 });
    await waitUntil(() => stored(SITE_A)[IDENTIFIER] === 240, 'the width was never stored');
    expect(stored(SITE_A)).to.deep.equal({ [IDENTIFIER]: 240 });
    await waitUntil(() => getTable(el)!.savedWidths[IDENTIFIER] === 240, 'the table never got the new map');
  });

  it('keeps both entries of two quick drags', async () => {
    const el = await mount();

    resize(el, { field: IDENTIFIER, reset: false, width: 240 });
    resize(el, { field: TITLE, reset: false, width: 300 });
    await waitUntil(() => stored(SITE_A)[TITLE] === 300, 'the second width was never stored');
    expect(stored(SITE_A)).to.deep.equal({ [IDENTIFIER]: 240, [TITLE]: 300 });
  });

  it('does not stop the event, so that a host can still listen', async () => {
    const el = await mount();
    let heard = 0;

    el.addEventListener('cx-content-browser-table-column-resize', () => { heard += 1; });
    resize(el, { field: IDENTIFIER, reset: false, width: 240 });
    expect(heard).to.equal(1);
  });

  it('deletes the saved width on a reset', async () => {
    store(SITE_A, { [IDENTIFIER]: 250 });
    const el = await mount();

    resize(el, { field: IDENTIFIER, reset: true, width: 180 });
    await waitUntil(() => !(IDENTIFIER in stored(SITE_A)), 'the width was never deleted');
    expect(stored(SITE_A)).to.deep.equal({});
    await waitUntil(() => !(IDENTIFIER in getTable(el)!.savedWidths), 'the table kept the saved width');
  });

  it('does not bring a reset width back on a later update of the saved widths', async () => {
    store(SITE_A, { [IDENTIFIER]: 250 });
    const el = await mount();
    const table = getTable(el)!;

    await waitUntil(() => table.savedWidths[IDENTIFIER] === 250, 'the table never got the saved widths');
    await waitUntil(() => getTabulator(el)?.getColumns().length, 'the table never built its columns');

    const handle = table.shadowRoot!.querySelector('cx-table')!.shadowRoot?.querySelector('.tabulator-col-resize-handle')
      ?? table.shadowRoot!.querySelector('.tabulator-col-resize-handle');

    expect(handle, 'a column divider').to.not.equal(null);
    // A real double click: the table forgets the width in its memory, then emits the reset.
    handle!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
    await waitUntil(() => !(IDENTIFIER in stored(SITE_A)), 'the width was never deleted');
    await waitUntil(() => !(IDENTIFIER in table.savedWidths), 'the table kept the saved width');

    // A later drag of another column updates the saved widths again.
    resize(el, { field: TITLE, reset: false, width: 300 });
    await waitUntil(() => table.savedWidths[TITLE] === 300, 'the table never got the new map');
    await aTimeout(100);

    expect(table.savedWidths).to.deep.equal({ [TITLE]: 300 });
    expect(Math.round(getTabulator(el)!.getColumns().find((column) => column.getField().length > 0
      && column.getDefinition().title === 'Identifier')!.getWidth())).to.not.equal(250);
  });

  it('reads the widths again when the site changes', async () => {
    store(SITE_A, { [IDENTIFIER]: 250 });
    store(SITE_B, { [TITLE]: 310 });
    const el = await mount();

    await waitUntil(() => getTable(el)!.savedWidths[IDENTIFIER] === 250, 'the table never got the widths of site A');
    el.baseUrl = SITE_B;
    await waitUntil(() => getTable(el)!.savedWidths[TITLE] === 310, 'the table never got the widths of site B');
    expect(getTable(el)!.savedWidths).to.deep.equal({ [TITLE]: 310 });
  });

  it('does not keep the saved width of the old site when the site changes', async () => {
    store(SITE_A, { [IDENTIFIER]: 250 });
    const el = await mount();

    await waitUntil(() => identifierWidth(el) === 250, 'the column never showed the width of site A');
    el.baseUrl = SITE_B;
    await waitUntil(() => Object.keys(getTable(el)!.savedWidths).length === 0, 'the table never got the widths of site B');
    await aTimeout(300);

    expect(identifierWidth(el), 'the column kept the saved width of site A').to.not.equal(250);
  });

  describe('with a slow host storage', () => {
    const values = new Map<string, string>();
    const host = window as unknown as { OrangeDAMContentBrowser?: { _customStorage?: unknown } };
    let previous: unknown;

    beforeEach(() => {
      values.clear();
      host.OrangeDAMContentBrowser ??= {};
      previous = host.OrangeDAMContentBrowser._customStorage;
      host.OrangeDAMContentBrowser._customStorage = {
        delete: (key: string) => { values.delete(key); },
        get: (key: string) => new Promise((resolve) => {
          setTimeout(() => resolve(values.get(key) ?? null), SLOW_MS);
        }),
        set: (key: string, value: string) => { values.set(key, value); },
      };
    });

    afterEach(() => {
      host.OrangeDAMContentBrowser!._customStorage = previous;
    });

    const hostStored = (site: string): Record<string, number> => JSON.parse(values.get(tableColumnWidthsKey(site)) ?? '{}');

    it('ends with the table and the storage in agreement after a drag and a reset', async () => {
      const el = await mount();

      await aTimeout(SLOW_MS * 4);

      const auto = identifierWidth(el);
      const dragged = oneEvent(getTable(el)!, 'cx-content-browser-table-column-resize');

      dragColumnHandle(identifierHandle(el), 80);
      await dragged;
      expect(identifierWidth(el)).to.equal(auto + 80);

      // A reset before the write of the drag ends.
      doubleClick(identifierHandle(el));
      // Each write waits for the slow read of the stored map.
      await aTimeout(SLOW_MS * 8);

      expect(hostStored(SITE_A)).to.deep.equal({});
      expect(getTable(el)!.savedWidths).to.deep.equal({});
      expect(identifierWidth(el), 'the table shows the dragged width that the storage does not hold').to.equal(auto);
    });

    it('does not keep a drag on the old site when the site changes before its write ends', async () => {
      const el = await mount();

      await aTimeout(SLOW_MS * 4);

      const auto = identifierWidth(el);
      const dragged = oneEvent(getTable(el)!, 'cx-content-browser-table-column-resize');

      dragColumnHandle(identifierHandle(el), 80);
      await dragged;
      el.baseUrl = SITE_B;
      await aTimeout(SLOW_MS * 8);

      expect(hostStored(SITE_A)).to.deep.equal({ [IDENTIFIER]: auto + 80 });
      expect(getTable(el)!.savedWidths).to.deep.equal({});
      expect(identifierWidth(el), 'the table shows the drag of site A on site B').to.equal(auto);
    });

    it('does not let a read for a new site undo a drag that follows it', async () => {
      store(SITE_A, { [TITLE]: 300 });
      const el = await mount();

      await aTimeout(SLOW_MS * 4);
      el.baseUrl = SITE_B;
      await el.updateComplete;

      const auto = identifierWidth(el);
      const dragged = oneEvent(getTable(el)!, 'cx-content-browser-table-column-resize');

      dragColumnHandle(identifierHandle(el), 80);
      await dragged;

      const target = auto + 80;
      const seen = new Set<number>();
      const end = performance.now() + SLOW_MS * 8;

      while (performance.now() < end) {
        seen.add(identifierWidth(el));
        await aTimeout(10);
      }

      expect([...seen], 'the drag was undone while the writes ran').to.deep.equal([target]);
      expect(hostStored(SITE_B)).to.deep.equal({ [IDENTIFIER]: target });
      expect(getTable(el)!.savedWidths).to.deep.equal({ [IDENTIFIER]: target });
    });
  });

  describe('L-42CA9K issue 2: after a drag with no saved widths', () => {
    const titleColumn = (el: CxContentBrowser) => getTabulator(el)!.getColumns()
      .find((column) => column.getDefinition().title === 'Title')!;
    const titleWidth = (el: CxContentBrowser) => Math.round(titleColumn(el).getElement().getBoundingClientRect().width);

    const shrinkIdentifier = async (el: CxContentBrowser) => {
      await aTimeout(200);

      const identifier = identifierWidth(el);
      const title = titleWidth(el);
      const dragged = oneEvent(getTable(el)!, 'cx-content-browser-table-column-resize');

      expect(identifier - 60, 'the drag reaches the floor').to.be.above(92);
      dragColumnHandle(identifierHandle(el), -60);
      await dragged;
      await waitUntil(() => getTable(el)!.savedWidths[IDENTIFIER] === identifier - 60, 'the table never got the saved width back');
      await aTimeout(200);

      return title;
    };

    it('keeps the width of Title once the saved width comes back from the storage', async () => {
      const el = await mount();
      const title = await shrinkIdentifier(el);

      expect(titleWidth(el), 'Title took the space that the drag freed').to.be.closeTo(title, 1);
      expect(stored(SITE_A)).to.deep.equal({ [IDENTIFIER]: identifierWidth(el) });
    });

    it('fits Title again when the site changes', async () => {
      const el = await mount();
      const title = await shrinkIdentifier(el);

      // Site B saves the same narrow Identifier: only a session width would still hold Title.
      store(SITE_B, { [IDENTIFIER]: identifierWidth(el) });
      el.baseUrl = SITE_B;
      await waitUntil(() => getTable(el)!.savedWidths[IDENTIFIER] === identifierWidth(el), 'the table never got the widths of site B');
      await aTimeout(200);

      expect(titleWidth(el), 'Title kept its session width on another site').to.be.above(title + 10);
    });
  });

  it('passes host-edge to the table by default, and row-end when set', async () => {
    const el = await mount();

    expect(getTable(el)!.rowActionPosition).to.equal('host-edge');

    el.tableRowActionPosition = 'row-end';
    await el.updateComplete;
    expect(getTable(el)!.rowActionPosition).to.equal('row-end');

    el.tableRowActionPosition = 'sideways' as never;
    await el.updateComplete;
    expect(getTable(el)!.rowActionPosition).to.equal('host-edge');
  });
});
