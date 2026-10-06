import './content-browser-table';

import {
  aTimeout,
  expect,
  fixture,
  html,
  nextFrame,
  waitUntil,
} from '@open-wc/testing';
import sinon from 'sinon';

import type { Asset } from '@/types/asset';

import type ContentBrowserTable from './content-browser-table';
import { ROW_HEIGHT } from './content-browser-table';
import {
  getContainer,
  getCxTable,
  makeAssets,
  SINGLE_LINE_COLUMNS,
} from './content-browser-table.test-helpers';

/*
 * L-42BFJC: the row count the table reports to `content-browser` for a new list and around a page
 * that loads. The host builds a page on each count, so a count sent at the wrong moment asks for a
 * page out of order, and a count never sent leaves the box part empty.
 */

/** Past the resize debounce, and past Tabulator's wait before `setData` takes a new list. */
const MEASURED_MS = 1200;

const waitFor = (condition: () => boolean, message: string) => waitUntil(condition, message, { interval: 20, timeout: 4000 });

const rowsInTable = (el: ContentBrowserTable) => getCxTable(el)?.tabulatorInstance?.getRows().length ?? 0;

/** The count the table's box shows when the rows overflow it. */
const boxCount = (el: ContentBrowserTable) => Math.ceil(getContainer(el).clientHeight / ROW_HEIGHT);

const mountTable = async (options: { assets?: Asset[]; boxHeight: number; loading?: boolean }) => {
  const assets = options.assets ?? [];
  const el = await fixture<ContentBrowserTable>(html`
    <cx-content-browser-table style="height: ${options.boxHeight}px" has-more ?loading=${options.loading ?? false}
      .assets=${assets} .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
  `);
  const counts: number[] = [];

  el.addEventListener('cx-content-browser-grid-resize', (event) => counts.push((event as CustomEvent<{ rowCount: number }>).detail.rowCount));
  await waitFor(() => counts.length > 0 && rowsInTable(el) === assets.length, 'the table never reported its box with its rows in');
  await aTimeout(MEASURED_MS);

  return { counts, el };
};

/** Grows the box while a page loads, so the count changes before that page is in the rows. */
const growWhileLoading = async (el: ContentBrowserTable, counts: number[]) => {
  const before = counts.length;

  el.loading = true;
  el.style.height = '600px';
  await aTimeout(MEASURED_MS);

  return counts.slice(before);
};

describe('L-42BFJC: the row count the table reports for a new list', function rowCountForANewList(this: Mocha.Suite) {
  this.retries(0);
  // Longer than a mount and two waits, so that a wait that runs out names the state it waited for.
  // The 8 tests of this file at 14 s each end in 112 s, inside the runner's 120 s limit for the file.
  this.timeout(14000);

  it('reports the count of a box that fits the viewport and that the rows leave part empty', async () => {
    const { counts, el } = await mountTable({ boxHeight: 400 });
    const [measured] = counts;

    el.assets = makeAssets(3);
    await waitFor(() => rowsInTable(el) === 3, 'the new list never reached the table');
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(1);

    expect(reported.length === 1 && reported[0] === measured,
      `the box shows ${measured} rows, and the new list reported ${reported.join(', ') || 'nothing'}`).to.equal(true);
  });
});

describe('L-42BFJC: the row count the table reports while a page loads', function rowCountWhileLoading(this: Mocha.Suite) {
  this.retries(0);
  // Longer than a mount and two waits, so that a wait that runs out names the state it waited for.
  // The 8 tests of this file at 14 s each end in 112 s, inside the runner's 120 s limit for the file.
  this.timeout(14000);

  afterEach(() => {
    sinon.restore();
  });

  it('reports a count that changes while a page loads only once that page is in the rows', async () => {
    const firstPage = makeAssets(60);
    const { counts, el } = await mountTable({ assets: firstPage, boxHeight: 400 });
    const before = counts.length;
    const whileLoading = await growWhileLoading(el, counts);
    let rowsAtReport = 0;

    el.addEventListener('cx-content-browser-grid-resize', () => {
      rowsAtReport = rowsInTable(el);
    }, { once: true });
    el.assets = [...firstPage, ...makeAssets(30, 60)];
    el.loading = false;
    await waitFor(() => rowsInTable(el) === 90, 'the page never reached the rows');
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(before);

    expect(whileLoading.length === 0, `reported ${whileLoading.join(', ')} while the page loaded`).to.equal(true);
    expect(reported.length === 1 && reported[0] === boxCount(el),
      `the ${boxCount(el)}-row box reported ${reported.join(', ') || 'nothing'} once the page was in`).to.equal(true);
    expect(rowsAtReport === 90, `the table reported the count while it held ${rowsAtReport} rows`).to.equal(true);
  });

  it('reports a count that changes while a page loads once the load ends with no new asset', async () => {
    const { counts, el } = await mountTable({ assets: makeAssets(60), boxHeight: 400 });
    const before = counts.length;
    const whileLoading = await growWhileLoading(el, counts);

    // A page of assets the rows already hold, or one that did not land, ends the load on the same list.
    el.loading = false;
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(before);

    expect(whileLoading.length === 0, `reported ${whileLoading.join(', ')} while the page loaded`).to.equal(true);
    expect(reported.length === 1 && reported[0] === boxCount(el),
      `the ${boxCount(el)}-row box reported ${reported.join(', ') || 'nothing'} once the load ended`).to.equal(true);
  });

  it('reports a count that changes while a new list loads only once the new rows are in', async () => {
    const { counts, el } = await mountTable({ assets: makeAssets(60), boxHeight: 400 });
    const before = counts.length;
    const tabulator = getCxTable(el)!.tabulatorInstance!;
    const whileLoading = await growWhileLoading(el, counts);
    let firstRowAtReport = '';

    el.addEventListener('cx-content-browser-grid-resize', () => {
      firstRowAtReport = String(tabulator.getRows()[0]?.getData().id ?? '');
    }, { once: true });
    el.assets = makeAssets(60, 0, 'other');
    el.loading = false;
    await waitFor(() => counts.length > before + whileLoading.length, 'the new list reported no count');
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(before);

    expect(whileLoading.length === 0, `reported ${whileLoading.join(', ')} while the new list loaded`).to.equal(true);
    expect(firstRowAtReport === 'other-0', `the count was reported while the first row was ${firstRowAtReport}`).to.equal(true);
    expect(reported.length === 1 && reported[0] === boxCount(el),
      `the ${boxCount(el)}-row box reported ${reported.join(', ')}`).to.equal(true);
  });

  it('reports a count that changes while a page loads, also when the load ends while the rows are built again', async () => {
    const { counts, el } = await mountTable({ assets: makeAssets(60), boxHeight: 400 });
    const before = counts.length;
    const tabulator = getCxTable(el)!.tabulatorInstance!;
    const whileLoading = await growWhileLoading(el, counts);
    let land = () => {};
    // Holds the rows back as Tabulator's half-second wait before `setData` does.
    const setData = sinon.stub(tabulator, 'setData').returns(new Promise<void>((resolve) => {
      land = resolve;
    }));

    // A column the rows hold no value for makes the table build its rows again.
    el.columns = [...SINGLE_LINE_COLUMNS, { field: 'CoreField.Title', title: 'Title' }];
    await waitFor(() => setData.called, 'the new column built no rows');
    el.loading = false;
    await aTimeout(MEASURED_MS);
    land();
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(before);

    expect(whileLoading.length === 0, `reported ${whileLoading.join(', ')} while the page loaded`).to.equal(true);
    expect(reported.length === 1 && reported[0] === boxCount(el),
      `the ${boxCount(el)}-row box reported ${reported.join(', ') || 'nothing'} once the rows were built again`).to.equal(true);
  });

  it('reports one count for a box that changes again as the load ends', async () => {
    const { counts, el } = await mountTable({ assets: makeAssets(60), boxHeight: 400 });
    const before = counts.length;
    const whileLoading = await growWhileLoading(el, counts);

    el.style.height = '800px';
    // The new size is measured, and its count waits out its debounce as the load ends.
    await nextFrame();
    await nextFrame();
    el.loading = false;
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(before);

    // `content-browser` takes a second count inside its 200 ms fetch debounce as a new page, and drops
    // the page the first count asked for.
    expect(whileLoading.length === 0, `reported ${whileLoading.join(', ')} while the page loaded`).to.equal(true);
    expect(reported.length === 1 && reported[0] === boxCount(el),
      `the ${boxCount(el)}-row box reported ${reported.join(', ') || 'nothing'}`).to.equal(true);
  });

  it('reports nothing once it is taken off the page while a page loads', async () => {
    const { counts, el } = await mountTable({ assets: makeAssets(60), boxHeight: 400 });
    const before = counts.length;
    const whileLoading = await growWhileLoading(el, counts);

    el.remove();
    el.loading = false;
    await aTimeout(MEASURED_MS);

    const reported = counts.slice(before);

    expect(whileLoading.length === 0 && reported.length === 0, `a table off the page reported ${reported.join(', ')}`).to.equal(true);
  });

  // Before the first page, `content-browser` takes the count as the size of that page.
  it('reports the count of a box with no assets while the first page loads', async () => {
    const { counts, el } = await mountTable({ boxHeight: 400, loading: true });

    expect(counts.length === 1 && counts[0] === boxCount(el),
      `the ${boxCount(el)}-row box reported ${counts.join(', ')}`).to.equal(true);
  });
});
