/*
 * L-42BFJC: the stub server, the picker controls and the waits that the table replay files share
 * (content-browser.table-*.btest.ts). The server is modeled on the QA HAR, so that each replay asks
 * what QA's DAM asked and waits as long, at a scale.
 */
import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import http from '@/api/api';
import { AssetApiEndpoint, MetadataApiEndpoint } from '@/api/endpoints';
import { TABLE_VIEW, type TableColumn } from '@/types/content-browser';

import type CxContentBrowserTable from '../content-browser-table/content-browser-table';
import type CxContentBrowser from './content-browser';

/** The OrderBy ids QA's DAM sent for the two sorts in the HAR. */
export const RELEVANCY = 'OR4ND000000063444';
export const NEWEST_FIRST = 'OR4ND000000063460';

const SORT_ORDERS = [
  { id: RELEVANCY, name: 'Relevancy', sortDirection: 'Descending', sortDirectionDisplayName: 'Descending', sortDirectionGroupKey: 'relevancy' },
  { id: 'oldest-first', name: 'Date Created', sortDirection: 'Ascending', sortDirectionDisplayName: 'Oldest First', sortDirectionGroupKey: 'datecreated' },
  { id: NEWEST_FIRST, name: 'Date Created', sortDirection: 'Descending', sortDirectionDisplayName: 'Newest First', sortDirectionGroupKey: 'datecreated' },
];

export const SEARCH_3 = '_(3)';
export const INTERNATIONAL = 'international';
export const NO_MATCH = 'no-such-asset';

/** Hits per search text, as QA's DAM reported them. The unfiltered library is any large count. */
export const HITS: Record<string, number> = {
  '': 250000,
  [INTERNATIONAL]: 66,
  [NO_MATCH]: 0,
  [SEARCH_3]: 213116,
};

/** The table view's page, `resolvePageSize` in content-browser.ts. */
export const HOST_PAGE = 30;

/**
 * The largest page that the host asks for a table box of `boxRows` rows, however many pages have
 * landed. `handleGridResize` rounds the count up past one spare page, and a scroll-end page is one
 * host page.
 */
export const pageBound = (boxRows: number) => Math.ceil(boxRows / HOST_PAGE + 1) * HOST_PAGE;

/*
 * Server time in the HAR: 5-8 s of wait plus 7-9 s of transfer for the large pages, so a modeled
 * 5 s plus 4 ms a row (Limit 60 in 5.2 s, Limit 2850 in 16.4 s). The client aborts at its own
 * timeout. Both run SCALE times faster than modeled, which keeps every response slower than the
 * 200 ms debounces in the table and the fetch controller, as the real server is.
 */
const SCALE = 20;
const CLIENT_TIMEOUT_MS = Number(http.defaults.timeout);
const modeledServerMs = (limit: number) => 5000 + 4 * limit;

/** Longer than a landed page takes to render, come into view and pass both debounces. */
export const QUIET_MS = 1200;

export const TABLE_COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
  { field: 'CoreField.TitleWithFallback', title: 'Title' },
];

export type Call = {
  limit: number;
  orderBy: string;
  outcome: 'pending' | 'answered' | 'aborted';
  start: number;
  text: string;
};

/** The end of the waits of the current test: a wait stops there at the latest, before the test times out. */
let waitsEnd = Number.POSITIVE_INFINITY;

/**
 * Builds its message only at the timeout, so the message names the state that never came. When the
 * time that the waits share ends first, the message says so: the state can then be late, not missing.
 */
export async function poll(condition: () => boolean, message: () => string, timeout = 8000, end = waitsEnd) {
  const started = performance.now();
  const deadline = Math.min(started + timeout, end);

  while (!condition()) {
    if (performance.now() > deadline) {
      const cut = deadline < started + timeout ? `the time that the waits share ended ${Math.round(Math.max(0, deadline - started))} ms into this wait: ` : '';

      throw new Error(`${cut}${message()}`);
    }

    await aTimeout(20);
  }
}

export const describeCall = ({ limit, orderBy, outcome, start, text }: Call) =>
  `[${text || '-'} ${orderBy || '-'} ${start}+${limit} ${outcome}]`;

export const describeCalls = (calls: Call[]) => calls.map(describeCall).join(' ') || 'none';

export const listKey = (text: string, orderBy: string) => `${text || '-'}|${orderBy || '-'}`;

/** A record id that carries the list it belongs to, so a stale row cannot pass for a current one. */
const recordId = (text: string, orderBy: string, index: number) => `${listKey(text, orderBy)}|${index}`;

export function parseRecordId(id: string) {
  const [text, orderBy, index] = id.split('|');

  return { index: Number(index), list: `${text}|${orderBy}` };
}

export class ModeledServer {
  readonly calls: Call[] = [];

  /** The share of the modeled server time a request waits: 0 answers each request at once. */
  latency = 1 / SCALE;

  #holds: Array<{ matches: (call: Call) => boolean; released: Promise<void> }> = [];

  #hits: Record<string, number> = { ...HITS };

  #leads = new Map<string, { count: number; from: string }>();

  #lastActivity = performance.now();

  readonly #originalAdapter = http.defaults.adapter;

  install() {
    http.defaults.adapter = (config) => this.answer(config);
  }

  uninstall() {
    http.defaults.adapter = this.#originalAdapter;
  }

  /** Forgets the calls, the holds and every list this test set up. */
  reset() {
    this.calls.length = 0;
    this.latency = 1 / SCALE;
    this.#holds = [];
    this.#hits = { ...HITS };
    this.#leads.clear();
  }

  /** Keeps the answer to every request `matches` from landing until the returned release is called. */
  hold(matches: (call: Call) => boolean): () => void {
    let release = () => {};
    const released = new Promise<void>((resolve) => {
      release = resolve;
    });

    this.#holds.push({ matches, released });

    return () => {
      this.#holds = this.#holds.filter((entry) => entry.released !== released);
      release();
    };
  }

  /** Gives `text` `hits` hits, of which the first `count` are the first hits of `from`, in its order. */
  defineList(text: string, hits: number, lead?: { count: number; from: string }) {
    this.#hits[text] = hits;

    if (lead) {
      this.#leads.set(text, lead);
    }
  }

  hitsFor(text: string) {
    return this.#hits[text] ?? 0;
  }

  /** The record at `index` of the list the server answers for `text` under `orderBy`. */
  recordIdAt(text: string, orderBy: string, index: number): string {
    const lead = this.#leads.get(text);

    return lead && index < lead.count ? this.recordIdAt(lead.from, orderBy, index) : recordId(text, orderBy, index);
  }

  get inFlight() {
    return this.calls.filter(({ outcome }) => outcome === 'pending').length;
  }

  /** Counts as activity, so a quiet spell starts no earlier than the action that may send a request. */
  mark() {
    this.#lastActivity = performance.now();
  }

  /** No request in flight and none sent for `ms`: past every debounce a landed page can start. */
  isQuietFor(ms: number) {
    return this.inFlight === 0 && performance.now() - this.#lastActivity >= ms;
  }

  private async answer(config: InternalAxiosRequestConfig) {
    const url = (config.url ?? '').split('?')[0];
    const reply = (data: unknown) => ({ config, data, headers: {}, status: 200, statusText: 'OK' });

    if (url === MetadataApiEndpoint.GET_SORT_ORDERS) {
      return reply({ sortOrders: SORT_ORDERS });
    }

    if (url !== AssetApiEndpoint.GET_CONTENT_V3) {
      throw new AxiosError('not stubbed', AxiosError.ERR_BAD_RESPONSE, config);
    }

    const body = JSON.parse(config.data as string) as { Limit?: number; OrderBy?: string; Start?: number; Text?: string };
    const call: Call = {
      limit: body.Limit ?? 0,
      orderBy: body.OrderBy ?? '',
      outcome: 'pending',
      start: body.Start ?? 0,
      text: body.Text ?? '',
    };

    this.calls.push(call);
    this.#lastActivity = performance.now();

    const serverMs = modeledServerMs(call.limit);

    try {
      if (serverMs > CLIENT_TIMEOUT_MS) {
        await aTimeout(CLIENT_TIMEOUT_MS * this.latency);
        call.outcome = 'aborted';
        throw new AxiosError(`timeout of ${CLIENT_TIMEOUT_MS}ms exceeded`, AxiosError.ECONNABORTED, config);
      }

      await aTimeout(serverMs * this.latency);
      await this.#holds.find(({ matches }) => matches(call))?.released;
      call.outcome = 'answered';

      const totalCount = this.hitsFor(call.text);
      const end = Math.min(call.start + call.limit, totalCount);

      return reply({
        contentItems: Array.from({ length: Math.max(0, end - call.start) }, (_, offset) => {
          const id = this.recordIdAt(call.text, call.orderBy, call.start + offset);

          return {
            fields: { 'CoreField.Identifier': id, 'CoreField.TitleWithFallback': `Title ${id}`, 'Document.RecordID': id },
            recordID: id,
          };
        }),
        facets: [],
        totalCount,
      });
    } finally {
      this.#lastActivity = performance.now();
    }
  }
}

export function getTable(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector<CxContentBrowserTable>('cx-content-browser-table');
}

export function getTableContainer(el: CxContentBrowser) {
  return getTable(el)?.shadowRoot?.querySelector<HTMLElement>('.content-browser-table') ?? null;
}

export function getTabulator(el: CxContentBrowser) {
  return getTable(el)?.shadowRoot?.querySelector('cx-table')?.tabulatorInstance ?? undefined;
}

export function getControlBar(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-control-bar')!;
}

/** The ids of the rows the table shows, in order. */
export function shownRowIds(el: CxContentBrowser): string[] {
  const tabulator = getTabulator(el);

  if (!tabulator || tabulator.destroyed) {
    return [];
  }

  return (tabulator.getData() as Array<{ id: string }>).map(({ id }) => String(id));
}

export function showsNoResult(el: CxContentBrowser) {
  return Boolean(getTable(el)?.shadowRoot?.querySelector('cx-content-browser-no-result'));
}

/** Through the sort menu, as QA did: a click on the menu item of the sort order. */
export function pickSortOrder(el: CxContentBrowser, sortOrderName: string) {
  const sort = getControlBar(el).shadowRoot!.querySelector('cx-content-browser-control-sort')!;
  const item = sort.shadowRoot!.querySelector<HTMLElement>(`cx-menu-item[data-type="sort-order"][value="${sortOrderName}"]`);

  if (!item) {
    throw new Error(`the sort menu offers no ${sortOrderName}`);
  }

  item.click();
}

/** Through the search box, as QA did: the input commits its text with a change event. */
export function search(el: CxContentBrowser, text: string) {
  const input = getControlBar(el).shadowRoot!.querySelector('cx-input')!.shadowRoot!.querySelector('input')!;

  input.value = text;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

/** A cleanup with the test timeout can double the worst-case time of each test in its file. */
const CLEANUP_MS = 2000;

/**
 * A server for each test of the suite that calls this, and the viewport and the page scroll put back after it.
 * The waits of each test stop `waitBudgetMs` after the test starts.
 */
export function serverForEachTest(waitBudgetMs: number): ModeledServer {
  const server = new ModeledServer();

  beforeEach(() => {
    server.reset();
    server.install();
    waitsEnd = performance.now() + waitBudgetMs;
  });

  afterEach(async function restorePage(this: Mocha.Context) {
    this.timeout(CLEANUP_MS);
    waitsEnd = Number.POSITIVE_INFINITY;
    server.uninstall();
    window.scrollTo(0, 0);
    await setViewport({ height: 600, width: 800 });
  });

  return server;
}

/** Long enough for any request an action starts to be sent, and far shorter than a test's limit. */
const REQUEST_WAIT_MS = 4000;

export const describeRows = (el: CxContentBrowser) => {
  const ids = shownRowIds(el);

  return `${ids.length} rows, ${ids[0] ?? 'none'} to ${ids[ids.length - 1] ?? 'none'}`;
};

/** The table shows rows, and every row is of the list `list` names. It reads the rows once. */
export function showsOnly(el: CxContentBrowser, list: string) {
  const ids = shownRowIds(el);

  return ids.length > 0 && ids.every((id) => parseRecordId(id).list === list);
}

/** Until the rows are the list `list` names, and nothing more is asked for or on its way. */
export async function waitForList(el: CxContentBrowser, server: ModeledServer, list: string) {
  await poll(
    () => server.calls.length > 0 && server.isQuietFor(QUIET_MS) && showsOnly(el, list),
    () => `the table never settled on ${list}: requests ${describeCalls(server.calls)}, rows ${shownRowIds(el).length}`,
  );
}

/** Waits past every debounce an action can start, and for every request it sent to land. */
export async function settle(el: CxContentBrowser, server: ModeledServer) {
  server.mark();
  await poll(() => server.isQuietFor(QUIET_MS),
    () => `the table never stopped asking: ${describeCalls(server.calls)}, ${shownRowIds(el).length} rows`, 10000);
}

/** Until a request from call `from` on is sent that `matches`, which `what` names. */
export async function waitForRequest(server: ModeledServer, from: number, matches: (call: Call) => boolean, what: string) {
  await poll(() => server.calls.slice(from).some(matches),
    () => `${what} was never asked for: ${describeCalls(server.calls.slice(from))}`, REQUEST_WAIT_MS);
}

/** Until `condition` holds, as a step must bring about soon after the action that starts it. */
export async function waitFor(condition: () => boolean, message: () => string) {
  await poll(condition, message, REQUEST_WAIT_MS);
}

/** Opened on the `_(3)` results under Relevancy, as QA had them after step 3. */
export async function openOnSearch3(server: ModeledServer, outerHeight: number) {
  const page = await fixture<HTMLDivElement>(html`
    <div style="display: flex; flex-direction: column; height: ${outerHeight}px; width: 800px">
      <div style="flex: none; height: 40px">host header</div>
      <div style="flex: 1; --content-browser-height: 100%">
        <cx-content-browser default-folder-id="library" default-grid-view=${TABLE_VIEW} default-search-text=${SEARCH_3}
          default-sort-order-name="relevancy" default-sort-direction="descending" .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      </div>
    </div>
  `);
  const el = page.querySelector<CxContentBrowser>('cx-content-browser')!;

  await waitForList(el, server, listKey(SEARCH_3, RELEVANCY));

  return { el, page };
}

/** Tabulator's row holder, the element that scrolls the rows. */
export const scrollport = (el: CxContentBrowser) =>
  getTable(el)!.shadowRoot!.querySelector('cx-table')!.shadowRoot!.querySelector<HTMLElement>('.tabulator-tableholder')!;

export const lastRowElement = (el: CxContentBrowser) => {
  const rows = getTabulator(el)!.getRows();

  return rows[rows.length - 1].getElement();
};

/** The rows are the first rows of one list, in order, with nothing missing and nothing stale. */
export function expectRowsOf(el: CxContentBrowser, server: ModeledServer, text: string, orderBy: string) {
  const ids = shownRowIds(el);
  const wrong = ids.findIndex((id, index) => id !== server.recordIdAt(text, orderBy, index));

  expect(ids.length > 0 && wrong === -1,
    `expected the first rows of ${listKey(text, orderBy)}, got ${describeRows(el)}${wrong === -1 ? '' : `, row ${wrong} is ${ids[wrong]}`}`).to.equal(true);
}

/** Pages of one list from its first row on, each one where the one before it ended. */
export function expectContinuousPages(server: ModeledServer, from: number, text: string, orderBy: string) {
  const calls = server.calls.slice(from).filter((call) => call.text === text && call.orderBy === orderBy);

  expect(calls.length > 0 && calls.every((call, index) => call.outcome === 'answered'
    && call.start === (index === 0 ? 0 : calls[index - 1].start + calls[index - 1].limit)),
    `expected pages of ${listKey(text, orderBy)} from row 0 with no gap: ${describeCalls(calls)}`).to.equal(true);
}
