import './content-browser';

import { aTimeout, expect } from '@open-wc/testing';

import {
  describeCalls,
  describeRows,
  expectContinuousPages,
  expectRowsOf,
  getTable,
  HOST_PAGE,
  INTERNATIONAL,
  lastRowElement,
  NEWEST_FIRST,
  NO_MATCH,
  openOnSearch3,
  pickSortOrder,
  poll,
  QUIET_MS,
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
 * L-42BFJC: when the table view asks for the next page, against the server model of
 * content-browser.table-replay.test-helpers.ts: from a scroll of its own rows or a resize while a
 * page loads, and from the last row of a table box taller than the viewport. A file of its own,
 * because each test waits out every debounce of a slow server.
 */

describe('L-42BFJC: the next page of the table view', function nextPage(this: Mocha.Suite) {
  // A wrong page or a wrong row fails every run, and a retry of a test that waits out a slow server
  // can run the file past its time limit, which then names no test.
  this.retries(0);
  // Seven tests of 14 s, each with a cleanup of up to 2 s, end in 112 s, inside the runner's 120 s limit for the file.
  this.timeout(14000);

  // The waits stop 2 s before the test times out, more than the longest fixed delay between two waits
  // (1.5 s). A slow failure then fails at a wait, and its message names the state.
  const server = serverForEachTest(12000);

  it('shows the table as loading while the first page of a new sort or a new search is on its way', async () => {
    const { el } = await openOnSearch3(server, 500);
    const table = getTable(el)!;
    let release = server.hold((call) => call.orderBy === NEWEST_FIRST);

    pickSortOrder(el, 'datecreated');
    await waitFor(() => server.inFlight > 0, () => 'the sort change asked for nothing');

    const loadingForSort = table.loading && table.hasAttribute('loading');

    release();
    await settle(el, server);
    release = server.hold((call) => call.text === INTERNATIONAL);
    search(el, INTERNATIONAL);
    await waitFor(() => server.inFlight > 0, () => 'the search asked for nothing');

    const loadingForSearch = table.loading && table.hasAttribute('loading');

    release();
    await settle(el, server);

    expect(loadingForSort, 'the table was not loading while the first page of the new sort was on its way').to.equal(true);
    expect(loadingForSearch, 'the table was not loading while the first page of the new search was on its way').to.equal(true);
    expect(table.loading, 'the table was still loading once every page landed').to.equal(false);
  });

  describe('in a table box that its rows overflow as a page starts to load', () => {
    it('asks for no second page from a scroll to the end of its own rows, so the pages land in order', async () => {
      const { el } = await openOnSearch3(server, 500);
      const holder = scrollport(el);
      const from = server.calls.length;
      // The first next page lands last, so a second one asked for meanwhile would land before it.
      const release = server.hold((call) => call.start === 60);

      holder.scrollTop = holder.scrollHeight;
      await waitForRequest(server, from, (call) => call.start === 60, 'the next page after a scroll to the end of the rows');
      holder.scrollTop = 0;
      await aTimeout(300);
      holder.scrollTop = holder.scrollHeight;
      await aTimeout(QUIET_MS);

      const asked = server.calls.slice(from);

      release();
      await settle(el, server);

      expectRowsOf(el, server, SEARCH_3, RELEVANCY);
      expect(asked.length === 1, `asked for ${describeCalls(asked)} while the first next page was on its way`).to.equal(true);
    });

    it('asks for no page for a taller box while the first page of a new sort is on its way, so the pages land in order', async () => {
      const { el, page } = await openOnSearch3(server, 500);
      const from = server.calls.length;
      const release = server.hold((call) => call.orderBy === NEWEST_FIRST && call.start === 0);

      pickSortOrder(el, 'datecreated');
      await waitForRequest(server, from, (call) => call.orderBy === NEWEST_FIRST, 'the first page of the new sort');
      // The old rows still overflow the taller box, so the table counts its whole height.
      page.style.height = '2500px';
      await aTimeout(QUIET_MS);

      const asked = server.calls.slice(from);

      release();
      await settle(el, server);

      const loaded = server.calls.length;

      scrollport(el).scrollTop = scrollport(el).scrollHeight;
      await waitForRequest(server, loaded, (call) => call.start > 0, 'the next page after a scroll to the end of the rows');
      await settle(el, server);

      expectRowsOf(el, server, SEARCH_3, NEWEST_FIRST);
      expectContinuousPages(server, from, SEARCH_3, NEWEST_FIRST);
      expect(asked.length === 1, `asked for ${describeCalls(asked)} while the first page of the new sort was on its way`).to.equal(true);
    });

    it('asks for the page after the next page from a taller box only once the next page lands', async () => {
      const { el, page } = await openOnSearch3(server, 500);
      const holder = scrollport(el);
      const from = server.calls.length;
      const release = server.hold((call) => call.start === 60);

      holder.scrollTop = holder.scrollHeight;
      await waitForRequest(server, from, (call) => call.start === 60, 'the next page after a scroll to the end of the rows');
      // Taller than every row the landed page leaves, so only the count of this resize asks for more.
      page.style.height = '6000px';
      await aTimeout(QUIET_MS);

      const asked = server.calls.slice(from);

      release();
      await waitForRequest(server, from, (call) => call.start === 90, 'the page after the landed one');
      await settle(el, server);

      expectRowsOf(el, server, SEARCH_3, RELEVANCY);
      expectContinuousPages(server, 0, SEARCH_3, RELEVANCY);
      expect(asked.length === 1, `asked for ${describeCalls(asked)} while the next page was on its way`).to.equal(true);
    });
  });

  describe('in a table box taller than the viewport that its rows do not fill', () => {
    /** The host gives the picker more room than the rows it holds, as a grid-to-table switch can. */
    const openInATallBox = async () => {
      const opened = await openOnSearch3(server, 500);

      opened.page.style.height = '4100px';
      await settle(opened.el, server);

      return opened;
    };

    it('asks for the next page once its last row comes into view, one page at a time', async () => {
      const { el } = await openInATallBox();
      const from = server.calls.length;

      expect(from === 1, `the box asked for more before its last row came into view: ${describeCalls(server.calls)}`).to.equal(true);

      const release = server.hold((call) => call.start > 0);

      lastRowElement(el).scrollIntoView();
      await waitFor(() => server.inFlight > 0, () => 'its last row came into view and asked for nothing');
      // The last row leaves the view and comes back while the page is on its way.
      window.scrollTo(0, 0);
      await aTimeout(300);
      lastRowElement(el).scrollIntoView();
      await aTimeout(QUIET_MS);

      expect(server.calls.length === from + 1,
        `a second page was asked for while the first was on its way: ${describeCalls(server.calls.slice(from))}`).to.equal(true);

      release();
      await settle(el, server);

      expect(server.calls.slice(from).every(({ limit, orderBy, start, text }, index) => text === SEARCH_3 && orderBy === RELEVANCY
        && limit === HOST_PAGE && start === 60 + index * HOST_PAGE),
        `expected one host page at a time from row 60: ${describeCalls(server.calls.slice(from))}`).to.equal(true);
      expectRowsOf(el, server, SEARCH_3, RELEVANCY);
    });

    it('asks for nothing more once the list has no more rows', async () => {
      const { el } = await openInATallBox();

      search(el, INTERNATIONAL);
      await settle(el, server);
      lastRowElement(el).scrollIntoView();
      await poll(() => !getTable(el)!.hasMore, () => `the last row of international never loaded: ${describeRows(el)}`);
      await settle(el, server);

      const from = server.calls.length;

      window.scrollTo(0, 0);
      await aTimeout(300);
      lastRowElement(el).scrollIntoView();
      await settle(el, server);

      expect(server.calls.length === from, `asked past the last row: ${describeCalls(server.calls.slice(from))}`).to.equal(true);
      expect(shownRowIds(el).length === server.hitsFor(INTERNATIONAL), `${describeRows(el)} of ${server.hitsFor(INTERNATIONAL)}`).to.equal(true);
      expectRowsOf(el, server, INTERNATIONAL, RELEVANCY);
    });

    it('asks for the next page from its last row again once a search with no result has taken the rows away', async () => {
      const { el } = await openInATallBox();

      search(el, NO_MATCH);
      await settle(el, server);

      expect(showsNoResult(el), 'a search with no result shows no "No results"').to.equal(true);

      const searched = server.calls.length;

      search(el, SEARCH_3);
      await settle(el, server);

      expect(server.calls.length === searched + 1,
        `the rows asked for more before their last row came into view: ${describeCalls(server.calls.slice(searched))}`).to.equal(true);

      const from = server.calls.length;

      lastRowElement(el).scrollIntoView();
      await waitForRequest(server, from, () => true, 'a page after its last row came into view');
      await settle(el, server);

      expect(server.calls[from].start === 60 && server.calls[from].text === SEARCH_3,
        `expected the next page of _(3), got ${describeCalls(server.calls.slice(from))}`).to.equal(true);
      expectRowsOf(el, server, SEARCH_3, RELEVANCY);
    });
  });
});
