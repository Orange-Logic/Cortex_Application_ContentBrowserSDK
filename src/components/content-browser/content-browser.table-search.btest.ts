import './content-browser';

import { expect, fixture, html } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';

import { TABLE_VIEW, type TableColumn } from '@/types/content-browser';

import { ROW_HEIGHT } from '../content-browser-table/content-browser-table';
import type CxContentBrowser from './content-browser';
import {
  type Call,
  describeCall,
  describeCalls,
  getControlBar,
  getTable,
  getTableContainer,
  HITS,
  INTERNATIONAL,
  listKey,
  ModeledServer,
  NEWEST_FIRST,
  pageBound,
  parseRecordId,
  pickSortOrder,
  poll,
  QUIET_MS,
  RELEVANCY,
  search,
  SEARCH_3,
  shownRowIds,
  showsNoResult,
  showsOnly,
  TABLE_COLUMNS,
} from './content-browser.table-replay.test-helpers';

/*
 * L-42BFJC replayed on the cx-table: QA searched `_(3)`, switched the sort from Relevancy to Date
 * Created - newest, searched `international` and then `_(3)` again, and saw "No results" twice. The
 * QA HAR shows why: the client's 15 s timeout aborted every such request, because each page asked
 * for more rows than the last. These tests drive the same steps against a server modeled on that HAR
 * and prove that the table asks for bounded pages that land in time.
 */

/** The columns CBSDKdemo.html configures, a two-line description among them. */
const DEMO_COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
  { field: 'CoreField.TitleWithFallback', title: 'Title', width: 'minmax(0, 2fr)' },
  { field: 'Document.CaptionLong', lines: 2, title: 'Description' },
];

/** What QA could see after a step, and the requests the step sent, read once the step settled. */
type StepRecord = {
  boxRows: number;
  calls: Call[];
  empty: boolean;
  noResult: boolean;
  rowIds: string[];
  totalCount: number;
};

/** `step` names the shape and the step, because the test runner prints a failed hook without its title. */
async function settleStep(el: CxContentBrowser, server: ModeledServer, from: number, list: string, step: string, deadline: number): Promise<StepRecord> {
  await poll(
    () => server.calls.length > from && server.isQuietFor(QUIET_MS) && showsOnly(el, list),
    () => `${step} never settled on ${list}: requests ${describeCalls(server.calls.slice(from))}, `
      + `rows ${shownRowIds(el).length} (${shownRowIds(el)[0] ?? 'none'}), no-result ${showsNoResult(el)}`,
    Number.POSITIVE_INFINITY,
    deadline,
  );

  return {
    // No taller than the viewport, so that rows that grow the box cannot raise the bound on their pages.
    boxRows: Math.ceil(Math.min(getTableContainer(el)?.clientHeight ?? 0, window.innerHeight) / ROW_HEIGHT),
    calls: server.calls.slice(from),
    empty: getTable(el)!.empty,
    noResult: showsNoResult(el),
    rowIds: shownRowIds(el),
    totalCount: getControlBar(el).totalCount,
  };
}

const picker = (columns: TableColumn[], style = '') => html`
  <cx-content-browser style=${style} default-folder-id="library" default-grid-view=${TABLE_VIEW} .tableColumns=${columns}></cx-content-browser>
`;

/** In a column under a host header, as the L-42BBKC host shapes are. */
const underHeader = (outer: string, slot: string, pickerStyle = '') => (columns: TableColumn[]) => html`
  <div style=${outer}>
    <div style="flex: none; height: 40px">host header</div>
    <div style=${slot}>${picker(columns, pickerStyle)}</div>
  </div>
`;

/*
 * The old table (a436f61) asks for a larger page after each page in the first, second and last
 * shapes, and fails their replay at step 1. In the two shapes that say so, it passes the replay:
 * there these tests guard the steps, not the page bound that fixed L-42BFJC.
 */
const HOST_SHAPES = [
  {
    columns: TABLE_COLUMNS,
    name: 'a slot that takes its height from a flex line (the L-42BFJC shape)',
    template: underHeader('display: flex; flex-direction: column; height: 500px; width: 800px', 'flex: 1; --content-browser-height: 100%'),
    viewport: { height: 600, width: 800 },
  },
  {
    columns: DEMO_COLUMNS,
    name: 'the CBSDKdemo.html layout, taller than a laptop viewport',
    template: (columns: TableColumn[]) => html`
      <div style="box-sizing: border-box; padding: 16px">
        <div style="display: flex; gap: 0.5em; height: 800px">
          <div style="flex: 1; display: flex; flex-direction: column">
            <div style="display: flex; justify-content: space-between">Orange Logic Content Browser SDK</div>
            <div style="--content-browser-height: 100%; flex: 1; border: 2px solid">${picker(columns)}</div>
          </div>
          <div style="display: flex; flex-direction: column; min-width: 400px; height: 100%">config</div>
        </div>
      </div>
    `,
    viewport: { height: 720, width: 1280 },
  },
  {
    columns: TABLE_COLUMNS,
    name: 'a container with a definite height, where the old table passes too',
    template: underHeader('height: 500px; width: 800px', 'height: 460px', '--content-browser-height: 100%'),
    viewport: { height: 600, width: 800 },
  },
  {
    columns: TABLE_COLUMNS,
    name: 'a container with no height, where the old table passes too',
    template: underHeader('width: 800px', ''),
    viewport: { height: 600, width: 800 },
  },
  {
    columns: TABLE_COLUMNS,
    name: 'a container with no height and the picker at height auto',
    template: underHeader('width: 800px', '', '--content-browser-height: auto'),
    viewport: { height: 600, width: 800 },
  },
];

describe('L-42BFJC: search and sort in the table view against a slow server', function searchAndSort(this: Mocha.Suite) {
  // A wrong page fails every run, and each step waits out a slow server: a retry only runs the file
  // closer to its time limit, past which no test is named.
  this.retries(0);

  HOST_SHAPES.forEach(({ columns, name, template, viewport }) => {
    describe(`in ${name}`, () => {
      const server = new ModeledServer();
      const steps: Partial<Record<'open' | 'relevancy' | 'search3' | 'newest' | 'international' | 'search3Again', StepRecord>> = {};

      before(async function replayQaSteps(this: Mocha.Context) {
        // Six steps of about 2 s each. The steps share one deadline 1 s before this limit, so that a
        // step that never settles fails at its own poll, which names it. Five shapes at this limit
        // still end inside the runner's 120 s limit for the file.
        this.timeout(20000);

        const deadline = performance.now() + 19000;

        await setViewport(viewport);
        server.reset();
        server.install();

        const page = await fixture<HTMLDivElement>(template(columns));
        const el = page.querySelector<CxContentBrowser>('cx-content-browser')!;
        const run = async (key: keyof typeof steps, list: string, act?: () => void) => {
          const from = server.calls.length;

          act?.();
          steps[key] = await settleStep(el, server, from, list, `the ${key} step in ${name}`, deadline);
        };

        // Step 1: CBSDK opens in the table view.
        await run('open', listKey('', ''));
        // Step 2: sort by Relevancy.
        await run('relevancy', listKey('', RELEVANCY), () => pickSortOrder(el, 'relevancy'));
        // Step 3: search `_(3)`.
        await run('search3', listKey(SEARCH_3, RELEVANCY), () => search(el, SEARCH_3));
        // Steps 4 and 5: sort by Date Created - newest, and look at the results.
        await run('newest', listKey(SEARCH_3, NEWEST_FIRST), () => pickSortOrder(el, 'datecreated'));
        // Step 6: search `international`, then `_(3)` again.
        await run('international', listKey(INTERNATIONAL, NEWEST_FIRST), () => search(el, INTERNATIONAL));
        await run('search3Again', listKey(SEARCH_3, NEWEST_FIRST), () => search(el, SEARCH_3));
      });

      after(async () => {
        server.uninstall();
        await setViewport({ height: 600, width: 800 });
      });

      const expectStep = (key: keyof typeof steps, text: string, orderBy: string) => {
        const step = steps[key]!;
        const [first] = step.calls;

        expect(step.rowIds.length > 0 && !step.noResult && !step.empty,
          `${step.rowIds.length} rows, no-result ${step.noResult}, empty ${step.empty}`).to.equal(true);
        expect(step.calls.every(({ outcome }) => outcome === 'answered'),
          `a request did not land: ${describeCalls(step.calls)}`).to.equal(true);
        expect(step.calls.every(({ limit }) => limit > 0 && limit <= pageBound(step.boxRows)),
          `a request asked for more than ${pageBound(step.boxRows)} rows in a ${step.boxRows}-row table box: ${describeCalls(step.calls)}`).to.equal(true);
        expect(first.start === 0 && first.text === text && first.orderBy === orderBy,
          `the step started with ${describeCall(first)}, not a first page of ${listKey(text, orderBy)}`).to.equal(true);
        // Every later request of the step continues the same list where the one before it ended.
        expect(step.calls.every((call, index) => index === 0 || (call.text === text && call.orderBy === orderBy
          && call.start === step.calls[index - 1].start + step.calls[index - 1].limit)),
          `the step asked out of order: ${describeCalls(step.calls)}`).to.equal(true);
        expect(step.rowIds.every((id, index) => parseRecordId(id).list === listKey(text, orderBy) && parseRecordId(id).index === index),
          `the rows are not the first ${step.rowIds.length} of ${listKey(text, orderBy)}: ${step.rowIds.slice(0, 3).join(', ')}`).to.equal(true);
        expect(step.totalCount === HITS[text],
          `the control bar counts ${step.totalCount} hits for "${text}", the server ${HITS[text]}`).to.equal(true);
      };

      it('step 1: opens in the table view on a first page it can load in time', () => {
        expectStep('open', '', '');
      });

      it('step 2: sorts by Relevancy from the first page', () => {
        expectStep('relevancy', '', RELEVANCY);
      });

      it('step 3: shows the results for _(3) under Relevancy', () => {
        expectStep('search3', SEARCH_3, RELEVANCY);
      });

      it('steps 4 and 5: shows the results for _(3) once the sort is Date Created - newest', () => {
        expectStep('newest', SEARCH_3, NEWEST_FIRST);
      });

      it('step 6: shows the results for international, and for _(3) again after it', () => {
        expectStep('international', INTERNATIONAL, NEWEST_FIRST);
        expectStep('search3Again', SEARCH_3, NEWEST_FIRST);
      });
    });
  });
});
