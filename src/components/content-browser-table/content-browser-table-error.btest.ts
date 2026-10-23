import './content-browser-table';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import type ContentBrowserTable from './content-browser-table';
import {
  dragColumnHandle,
  getColumnWidth,
  getContainer,
  getCxTable,
  getResizeHandles,
  makeAsset,
  makeAssets,
  mount,
  SINGLE_LINE_COLUMNS,
  waitForRows,
} from './content-browser-table.test-helpers';

describe('content-browser-table search error (L-42BQUZ)', () => {
  const query = (el: ContentBrowserTable, selector: string) => el.shadowRoot!.querySelector<HTMLElement>(selector);

  const mountWithRows = () => mount(html`
    <cx-content-browser-table style="height: 400px; width: 700px" .assets=${[makeAsset()]} .columns=${SINGLE_LINE_COLUMNS}>
    </cx-content-browser-table>
  `);

  it('shows an error with Retry, not No results, when a search with no rows gets an error', async () => {
    const emptyEl = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table empty .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `);
    const noResultsMessage = query(emptyEl, 'cx-content-browser-no-result')!.getAttribute('message');
    const el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table error .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);

    const panel = query(el, 'cx-content-browser-no-result');
    expect(panel?.getAttribute('icon')).to.equal('error_outline');
    expect(panel?.getAttribute('role')).to.equal('alert');
    expect(panel?.getAttribute('message') !== noResultsMessage).to.equal(true);
    // The button is a child of the no-result panel, so it shows only when the panel has a slot for it.
    expect(query(el, '.content-browser-table__retry')?.assignedSlot != null).to.equal(true);
    expect(getCxTable(el) === null).to.equal(true);
  });

  it('keeps the rows and shows Retry when a next page gets an error', async () => {
    const el = await mountWithRows();

    el.error = true;
    await elementUpdated(el);

    expect(getCxTable(el) !== null).to.equal(true);
    expect(query(el, '.content-browser-table__page-error .content-browser-table__retry') !== null).to.equal(true);
    expect(query(el, 'cx-content-browser-no-result') === null).to.equal(true);
  });

  it('keeps the page error bar below the rows and inside the table', async () => {
    const el = await mountWithRows();

    el.error = true;
    await elementUpdated(el);

    const rows = getContainer(el).getBoundingClientRect();
    const bar = query(el, '.content-browser-table__page-error')!.getBoundingClientRect();

    expect(bar.height > 0).to.equal(true);
    expect(rows.bottom <= bar.top + 0.5, 'the bar covers the last row').to.equal(true);
    expect(bar.bottom <= el.getBoundingClientRect().bottom + 0.5, 'the bar goes below the table').to.equal(true);
  });

  it('emits cx-content-browser-grid-retry when the user clicks Retry', async () => {
    const el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table error .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    let retried = false;
    el.addEventListener('cx-content-browser-grid-retry', () => {
      retried = true;
    });

    query(el, '.content-browser-table__retry')!.click();

    expect(retried).to.equal(true);
  });

  it('shows no Retry for a search with no hits', async () => {
    const el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table empty .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);

    expect(query(el, '.content-browser-table__retry') === null).to.equal(true);
  });

  it('keeps a dragged width when the table comes back after a search error with no rows', async () => {
    const el = await mountWithRows();
    const start = Math.round(getColumnWidth(el, 0));

    dragColumnHandle(getResizeHandles(el)[0], 60);
    await elementUpdated(el);

    el.assets = [];
    el.error = true;
    await elementUpdated(el);

    expect(getCxTable(el) === null, 'the table stayed on screen for an error with no rows').to.equal(true);

    el.assets = makeAssets(2);
    el.error = false;
    await elementUpdated(el);
    await waitForRows(el, 2);

    expect(Math.round(getColumnWidth(el, 0))).to.equal(start + 60);
  });
});
