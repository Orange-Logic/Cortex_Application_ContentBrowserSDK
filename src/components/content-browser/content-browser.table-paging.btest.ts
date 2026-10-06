import './content-browser';

import { expect } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';

import { ROW_HEIGHT } from '../content-browser-table/content-browser-table';
import type CxContentBrowser from './content-browser';
import {
  describeCalls,
  describeRows,
  expectRowsOf,
  getTable,
  getTableContainer,
  INTERNATIONAL,
  listKey,
  NEWEST_FIRST,
  NO_MATCH,
  openOnSearch3,
  pageBound,
  pickSortOrder,
  RELEVANCY,
  scrollport,
  search,
  SEARCH_3,
  settle,
  showsNoResult,
  shownRowIds,
  serverForEachTest,
  waitFor,
  waitForRequest,
} from './content-browser.table-replay.test-helpers';

/*
 * L-42BFJC: a new list in a table box that shows more rows than the host's first page, against the
 * server model of content-browser.table-replay.test-helpers.ts. A file of its own, because each test
 * waits out every debounce of a slow server.
 */

/** A search whose hits all fit one host page, and a broader one that starts with its hits. */
const FEW = 'fifteen';
const BROAD = 'broad';

describe('L-42BFJC: a restarted list in a table box that shows more than one page and fits the viewport', function restartedList(this: Mocha.Suite) {
  // A wrong page or a wrong row fails every run, and a retry of a test that waits out a slow server
  // can run the file past its time limit, which then names no test.
  this.retries(0);
  // Six tests of 16 s, each with a cleanup of up to 2 s, end in 108 s, inside the runner's 120 s limit for the file.
  this.timeout(16000);

  // The waits stop 2 s before the test times out. A slow failure then fails at a wait, and its message
  // names the state.
  const server = serverForEachTest(14000);

  /*
   * A scroll-end leaves the host's next first page at one host page, fewer rows than this box
   * shows. The box keeps its size on a new list, so no resize measures it again, and the last-row
   * trigger serves only a box taller than the viewport.
   */
  const openScrolledToTheEnd = async () => {
    await setViewport({ height: 1700, width: 800 });

    const opened = await openOnSearch3(server, 1650);
    const holder = scrollport(opened.el);
    const loaded = server.calls.length;

    holder.scrollTop = holder.scrollHeight;
    await waitForRequest(server, loaded, (call) => call.start > 0, 'the next page after a scroll to the end of the rows');
    await settle(opened.el, server);

    return opened;
  };

  /** The rows reach past the scrollport, so a scroll can ask for the next page, or the list has no more. */
  const expectBoxFilled = (el: CxContentBrowser) => {
    const holder = scrollport(el);

    expect(holder.scrollHeight > holder.clientHeight + 1 || !getTable(el)!.hasMore,
      `${describeRows(el)} leave a ${holder.clientHeight}px scrollport with nothing to scroll, and nothing asks for more`).to.equal(true);
  };

  /** Pages of the new list from its first row, none larger than the host's page for this box. */
  const expectPagesOf = (el: CxContentBrowser, from: number, text: string, orderBy: string) => {
    const calls = server.calls.slice(from);
    // No taller than the viewport, so that rows that grow the box cannot raise the bound on their pages.
    const bound = pageBound(Math.ceil(Math.min(getTableContainer(el)!.clientHeight, window.innerHeight) / ROW_HEIGHT));

    expect(calls.length > 0 && calls.every((call, index) => call.text === text && call.orderBy === orderBy
      && call.outcome === 'answered' && call.limit <= bound
      && call.start === (index === 0 ? 0 : calls[index - 1].start + calls[index - 1].limit)),
      `expected pages of at most ${bound} rows of ${listKey(text, orderBy)} from row 0: ${describeCalls(calls)}`).to.equal(true);
  };

  /** The first page of a new list is one host page, so the rows that fill the box come in a second request. */
  const settleFilled = async (el: CxContentBrowser, from: number, text: string) => {
    await waitForRequest(server, from, (call) => call.text === text && call.start > 0, `a page of ${text} that fills the box`);
    await settle(el, server);
  };

  it('fills the box after a sort change', async () => {
    const { el } = await openScrolledToTheEnd();
    const from = server.calls.length;

    pickSortOrder(el, 'datecreated');
    await settleFilled(el, from, SEARCH_3);

    expectPagesOf(el, from, SEARCH_3, NEWEST_FIRST);
    expectRowsOf(el, server, SEARCH_3, NEWEST_FIRST);
    expectBoxFilled(el);
  });

  it('fills the box after a new search', async () => {
    const { el } = await openScrolledToTheEnd();
    const from = server.calls.length;

    search(el, INTERNATIONAL);
    await settleFilled(el, from, INTERNATIONAL);

    expectPagesOf(el, from, INTERNATIONAL, RELEVANCY);
    expectRowsOf(el, server, INTERNATIONAL, RELEVANCY);
    expectBoxFilled(el);
  });

  /** The no-result block takes `cx-table` away, so the next list goes into a new `cx-table`. */
  const fillsAfterASearchWithNoResult = async () => {
    const { el } = await openScrolledToTheEnd();

    search(el, NO_MATCH);
    await waitFor(() => showsNoResult(el), () => `a search with no result never showed "No results": ${describeRows(el)}`);
    await settle(el, server);

    const from = server.calls.length;

    search(el, SEARCH_3);
    await settleFilled(el, from, SEARCH_3);

    expectPagesOf(el, from, SEARCH_3, RELEVANCY);
    expectRowsOf(el, server, SEARCH_3, RELEVANCY);
    expectBoxFilled(el);
  };

  it('fills the box after a search with no result, which takes the rows away', fillsAfterASearchWithNoResult);

  it('fills the box after a search with no result, from a server that answers at once', async () => {
    // Each page then lands faster than the 200 ms debounces of the table and the fetch controller,
    // which the modeled server never does.
    server.latency = 0;
    await fillsAfterASearchWithNoResult();
  });

  describe('after a search whose few hits the rows show in full', () => {
    /** The few hits load in one first page, which leaves has-more unset. */
    const openOnFewHits = async () => {
      const opened = await openScrolledToTheEnd();

      search(opened.el, FEW);
      await waitFor(() => shownRowIds(opened.el).length === server.hitsFor(FEW) && !getTable(opened.el)!.hasMore,
        () => `the ${server.hitsFor(FEW)} hits of ${FEW} never loaded: ${describeRows(opened.el)}`);
      await settle(opened.el, server);

      return opened;
    };

    it('fills the box for a broader search whose first hit is the first hit of the last search', async () => {
      server.defineList(FEW, 15);
      server.defineList(BROAD, 213116, { count: 1, from: FEW });

      const { el } = await openOnFewHits();
      const from = server.calls.length;

      search(el, BROAD);
      await settleFilled(el, from, BROAD);

      expectPagesOf(el, from, BROAD, RELEVANCY);
      expectRowsOf(el, server, BROAD, RELEVANCY);
      expectBoxFilled(el);
    });

    it('fills the box for a broader search whose first hits are every hit of the last search', async () => {
      server.defineList(FEW, 15);
      server.defineList(BROAD, 213116, { count: 15, from: FEW });

      const { el } = await openOnFewHits();
      const from = server.calls.length;

      search(el, BROAD);
      await settleFilled(el, from, BROAD);

      expectPagesOf(el, from, BROAD, RELEVANCY);
      expectRowsOf(el, server, BROAD, RELEVANCY);
      expectBoxFilled(el);
    });
  });
});
