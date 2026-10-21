import './content-browser-table';

import { elementUpdated, expect, fixture, html, waitUntil } from '@open-wc/testing';

import type ContentBrowserTable from './content-browser-table';
import {
  getCxTable,
  getScrollport,
  getTableRoot,
  makeAssets,
  mount,
  SINGLE_LINE_COLUMNS,
  waitForRows,
} from './content-browser-table.test-helpers';

/** The body border is the frame's `::before`, which ends at the last column as the header does. */
function expectAlignedBody(el: ContentBrowserTable) {
  const root = getTableRoot(el);
  const header = root.querySelector<HTMLElement>('.tabulator-header')!.getBoundingClientRect();
  const frame = getScrollport(el).parentElement!;
  const left = frame.getBoundingClientRect().left;
  const width = Number.parseFloat(getComputedStyle(frame, '::before').width);

  expect(width, `the body is ${width}px wide below a ${header.width}px header`).to.be.closeTo(header.width, 1);
  expect(left, 'the body starts outside the header').to.be.closeTo(header.left, 1);
}

describe('content-browser-table loading border', () => {
  it('keeps the body border aligned with the header before the first rows arrive', async () => {
    const el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table
        loading
        style="height: 400px; width: 700px; --cx-input-border-width: 1px; --cx-color-neutral-200: #ccc"
        .columns=${SINGLE_LINE_COLUMNS}
      ></cx-content-browser-table>
    `);

    await waitUntil(() => getCxTable(el)?.tabulatorInstance?.initialized === true,
      'the table was never built', { interval: 20, timeout: 5000 });

    expect(getCxTable(el)!.tabulatorInstance!.getDataCount()).to.equal(0);
    expectAlignedBody(el);

    el.assets = makeAssets(2);
    el.loading = false;
    await elementUpdated(el);
    await waitForRows(el, 2);

    expectAlignedBody(el);
  });

  it('keeps the body border aligned when a new config rebuilds the table before its rows arrive', async () => {
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 900px; --cx-input-border-width: 1px; --cx-color-neutral-200: #ccc"
        .assets=${makeAssets(2)}
        .columns=${SINGLE_LINE_COLUMNS}
      ></cx-content-browser-table>
    `, 2);
    const firstTable = getCxTable(el);

    el.empty = true;
    await elementUpdated(el);
    el.assets = [];
    el.columns = [
      { field: 'CoreField.Identifier', title: 'Identifier' },
      { field: 'Title', title: 'Title' },
    ];
    el.loading = true;
    el.empty = false;
    await elementUpdated(el);
    await waitUntil(() => getCxTable(el)?.tabulatorInstance?.initialized === true,
      'the table was never rebuilt', { interval: 20, timeout: 5000 });

    expect(getCxTable(el)).not.to.equal(firstTable);
    expect(getCxTable(el)!.tabulatorInstance!.getDataCount()).to.equal(0);
    expectAlignedBody(el);
  });
});
