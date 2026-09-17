import './content-browser-table';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import type { Asset } from '@/types/asset';
import { MediaType } from '@/types/asset';
import type { TableColumn } from '@/types/content-browser';

import type ContentBrowserTable from './content-browser-table';
import {
  COLUMN_RESIZE_STEP,
  floorFlexibleTrack,
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  readCellValue,
  ROW_HEIGHT,
  TABLE_COLUMNS_PROPERTY,
} from './content-browser-table';

/**
 * The track the component publishes for a column the host configured no width for. Flexible tracks
 * carry a floor rather than a base size of 0, so that a min-content constraint -- which the table
 * is permanently under once a drag widens it past its scrollport -- cannot collapse the column.
 */
const DEFAULT_FLEX_TRACK = `minmax(${MIN_COLUMN_WIDTH}px, 1fr)`;

const COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
  { align: 'right', field: 'Dell.Snippet', lines: 2, title: 'Snippet' },
];

/**
 * A text fragment as the search call returns it: no file, so no extension and no thumbnail, with the
 * column fields riding on the item under the Cortex field name. See L-29Q5K0.
 */
function makeAsset(overrides: Record<string, unknown> = {}): Asset {
  return {
    'CoreField.Identifier': 'FRAG-1',
    'Dell.Snippet': 'A fragment of text',
    docSubType: '',
    docType: MediaType.Story,
    extension: '',
    id: 'asset-1',
    identifier: 'FRAG-1',
    imageUrl: '',
    name: 'Fragment',
    originalUrl: '',
    recordId: 'rec-1',
    size: '',
    tags: '',
    ...overrides,
  } as unknown as Asset;
}

function getContainer(el: ContentBrowserTable) {
  return el.shadowRoot!.querySelector('.content-browser-table') as HTMLDivElement;
}

function getRows(el: ContentBrowserTable) {
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('.content-browser-table__row')];
}

async function waitForRows(el: ContentBrowserTable, count: number) {
  await waitUntil(
    () => getRows(el).length >= count,
    'virtualizer did not render rows',
    { interval: 50, timeout: 5000 },
  );
}

function resizeObserverEntry(container: HTMLDivElement, height: number) {
  return {
    borderBoxSize: [],
    contentBoxSize: [],
    contentRect: {
      bottom: height,
      height,
      left: 0,
      right: 400,
      toJSON() {
        return {};
      },
      top: 0,
      width: 400,
      x: 0,
      y: 0,
    } as DOMRectReadOnly,
    target: container,
  } as unknown as ResizeObserverEntry;
}

/** The element observes its own box, so let that settle before asserting on a synthetic entry. */
async function settleResize() {
  await new Promise((resolve) => setTimeout(resolve, 300));
}

function dispatchResize(el: ContentBrowserTable, entry: ResizeObserverEntry) {
  el.shadowRoot!.querySelector('cx-resize-observer')!.dispatchEvent(
    new CustomEvent('cx-resize', {
      bubbles: true,
      composed: true,
      detail: { entries: [entry] },
    }),
  );
}

/** Scroll metrics stand-in for `event.target` in `handleScroll`. */
function scrollTarget(dims: {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}) {
  const target = Object.create(null) as Record<string, number>;
  target.scrollTop = dims.scrollTop;
  target.clientHeight = dims.clientHeight;
  target.scrollHeight = dims.scrollHeight;

  return target as unknown as HTMLDivElement;
}

function invokeHandleScroll(el: ContentBrowserTable, target: HTMLDivElement) {
  const handleScroll = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(el),
    'handleScroll',
  )?.value as ((event: Event) => void) | undefined;
  expect(handleScroll).to.be.a('function');
  handleScroll!.call(el, { target } as unknown as Event);
}

function getHead(el: ContentBrowserTable) {
  return el.shadowRoot!.querySelector<HTMLElement>('.content-browser-table__head')!;
}

function getBody(el: ContentBrowserTable) {
  return el.shadowRoot!.querySelector<HTMLElement>('lit-virtualizer')!;
}

function makeAssets(count: number, from = 0) {
  return Array.from({ length: count }, (_, index) => makeAsset({ id: `asset-${from + index}` }));
}

function scrollAnchorControllerOf(el: ContentBrowserTable) {
  return (
    el as unknown as {
      scrollAnchorController: {
        restore: () => void;
      };
    }
  ).scrollAnchorController;
}

/**
 * The controller keeps its anchor to itself. The predicate it hands the host's index lookup on a
 * restore is the only thing that names the asset it settled on.
 */
function anchoredAssetId(el: ContentBrowserTable) {
  const assets = el.assets;
  const findIndex = assets.findIndex.bind(assets);
  let anchored: string | undefined;

  (assets as unknown as { findIndex: (predicate: (asset: Asset) => boolean) => number })
    .findIndex = (predicate) => {
      const index = findIndex(predicate);
      anchored = assets[index]?.id;

      return index;
    };
  scrollAnchorControllerOf(el).restore();
  delete (assets as unknown as Record<string, unknown>).findIndex;

  return anchored;
}

/**
 * The tops the controller scrolled to, in order. Wrapped by hand rather than with a sinon spy: a
 * mocha retry would re-enter the test and sinon refuses to wrap the same method twice.
 */
function recordScrollTo(container: HTMLDivElement) {
  const tops: number[] = [];

  (container as unknown as { scrollTo: (options: ScrollToOptions) => void }).scrollTo = (options) => {
    tops.push(options.top ?? 0);
  };

  return tops;
}

/** A restore is queued behind the host update, the virtualizer's layout and two frames. */
async function settleRestore(el: ContentBrowserTable) {
  await elementUpdated(el);
  await new Promise((resolve) => setTimeout(resolve, 150));
}

describe('content-browser-table', () => {
  let el: ContentBrowserTable;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(async () => {
    el = await fixture<ContentBrowserTable>(html`<cx-content-browser-table style="height: 400px"></cx-content-browser-table>`);
    await elementUpdated(el);
  });

  it('renders resize observer, table container, and loading overlay', async () => {
    expect(el.shadowRoot!.querySelector('cx-resize-observer')).to.exist;
    expect(getContainer(el)).to.exist;
    expect(el.shadowRoot!.querySelector('.content-browser-table-loading cx-progress-bar')).to.exist;
  });

  it('has default property values', async () => {
    expect(el.assets).to.deep.equal([]);
    expect(el.columns).to.deep.equal([]);
    expect(el.empty).to.be.false;
    expect(el.hasMore).to.be.false;
    expect(el.loading).to.be.false;
    expect(el.selectedAssetId).to.be.undefined;
  });

  it('reflects loading on the host attribute', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" ?loading=${true}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    expect(el.hasAttribute('loading')).to.be.true;
  });

  it('renders one header cell per configured column, in order', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    const headers = [...el.shadowRoot!.querySelectorAll('[role="columnheader"]')];

    // The trailing header is the action column, which carries no title of its own.
    expect(headers).to.have.lengthOf(3);
    expect(headers[0].textContent).to.contain('Identifier');
    expect(headers[1].textContent).to.contain('Snippet');
    expect(headers[2]).to.have.class('content-browser-table__cell--action');
  });

  it('lays the header out with the configured column widths', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    // The track list lives on the host so the header and every virtualized row share one definition.
    expect(el.style.getPropertyValue(TABLE_COLUMNS_PROPERTY).trim())
      .to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
  });

  it('renders a row per asset whose cells read the host-configured Cortex fields', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset()]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const cells = getRows(el)[0].querySelectorAll('[role="cell"]');
    expect(cells).to.have.lengthOf(3);
    expect(cells[0].textContent).to.contain('FRAG-1');
    expect(cells[1].textContent).to.contain('A fragment of text');
  });


  it('offers an action button on each row that hands the asset to the host', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset()]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const button = getRows(el)[0].querySelector<HTMLElement>('.content-browser-table__action')!;
    expect(button.textContent).to.contain('Insert');

    setTimeout(() => button.click());
    const event = await oneEvent(el, 'cx-content-browser-grid-click');

    expect(event.detail.id).to.equal('asset-1');
  });

  it('labels the action button with the host cta text', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        cta-text="Add"
        .assets=${[makeAsset()]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const button = getRows(el)[0].querySelector<HTMLElement>('.content-browser-table__action')!;

    expect(button.textContent).to.contain('Add');
    expect(button.textContent).to.not.contain('Insert');
  });

  it('activates the asset once when the action button is clicked, not twice', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset()]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const spy = sinon.spy();
    el.addEventListener('cx-content-browser-grid-click', spy);
    // The row is clickable too, so the button's click must not also bubble into the row handler.
    getRows(el)[0].querySelector<HTMLElement>('.content-browser-table__action')!.click();
    await elementUpdated(el);

    expect(spy).to.have.been.calledOnce;
  });

  it('keeps the action button out of the accessibility tree and off the tab order in the header', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);

    const twin = el.shadowRoot!.querySelector<HTMLElement>(
      '.content-browser-table__action--placeholder',
    )!;

    // It exists only so the header grid resolves the same max-content action track the rows do.
    expect(twin.getAttribute('aria-hidden')).to.equal('true');
    expect(twin.getAttribute('tabindex')).to.equal('-1');
    expect(twin.hasAttribute('data-id')).to.be.false;
  });

  it('does not hand over a cold-storage asset when its action button is clicked', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ inColdStorage: true })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const spy = sinon.spy();
    el.addEventListener('cx-content-browser-grid-click', spy);
    getRows(el)[0].querySelector<HTMLElement>('.content-browser-table__action')!.click();
    await elementUpdated(el);

    expect(spy).to.not.have.been.called;
  });

  it('shows the no-results state instead of an empty scroller when empty', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" empty .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);

    expect(el.shadowRoot!.querySelector('cx-content-browser-no-result')).to.exist;
    expect(el.shadowRoot!.querySelector('lit-virtualizer')).to.not.exist;
  });


  it('marks the selected row once the host resolves the selection', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset(), makeAsset({ id: 'asset-2' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 2);

    // The host sets this after a click resolves, while the same asset list stands. Nothing else
    // bound to the virtualizer changes identity, so without a fresh items array it never re-renders.
    el.selectedAssetId = 'asset-2';
    await elementUpdated(el);

    const rows = getRows(el);
    expect(rows).to.have.lengthOf(2);
    // Joined rather than asserted per element: a failing chai-dom element assertion serializes the
    // whole row subtree and wedges the runner.
    expect(rows.map((r) => r.classList.contains('content-browser-table__row--selected')).join(',')).to.equal('false,true');
    // aria-selected is only honoured for rows inside a grid or treegrid. Under role="table"
    // assistive tech drops it, which left the selection conveyed by background colour alone.
    expect(rows.map((r) => r.getAttribute('aria-current')).join(',')).to.equal('false,true');
  });

  describe('column resizing', () => {
    function getHandles(table: ContentBrowserTable) {
      return [...table.shadowRoot!.querySelectorAll<HTMLElement>('.content-browser-table__resize')];
    }

    function trackList(table: ContentBrowserTable) {
      return table.style.getPropertyValue(TABLE_COLUMNS_PROPERTY).trim();
    }

    function headerOf(table: ContentBrowserTable) {
      return table.shadowRoot!.querySelector<HTMLElement>('.content-browser-table__header')!;
    }

    /** Used pixel size of every track the header resolved, in order. */
    function usedTracks(header: HTMLElement) {
      return getComputedStyle(header).gridTemplateColumns.split(' ').map((track) => Number.parseFloat(track));
    }

    /**
     * Takes the branch that actually ships. A synthetic pointerId matches no live pointer, so a real
     * `setPointerCapture` refuses it and every drag here would otherwise run the fallback: the
     * captured path -- no document listeners, the release retargeted to the handle -- is the one the
     * browser uses.
     */
    function grantCapture(handle: HTMLElement) {
      return sinon.stub(handle, 'setPointerCapture');
    }

    /**
     * Returns a dispatcher for one pointer event `deltaX` from where the press started. Real mouse
     * input via sendMouse was tried first and stalls: the pointer stays captured across the fixture
     * teardown between tests, and the next press is never delivered. Hit-testability of the handle
     * -- the part this cannot prove -- has its own test above.
     *
     * The origin is captured once, because the handle travels with the column a drag widens. A
     * synthetic pointerId matches no live pointer, so `setPointerCapture` refuses it and these drags
     * run through the document fallback.
     */
    function pointerAt(handle: HTMLElement) {
      const box = handle.getBoundingClientRect();
      const clientY = box.top + box.height / 2;
      const originX = box.left + box.width / 2;

      return function dispatch(
        type: string,
        deltaX: number,
        init: PointerEventInit = {},
        target: EventTarget = handle,
      ) {
        target.dispatchEvent(new PointerEvent(type, {
          bubbles: true,
          button: 0,
          cancelable: true,
          clientX: originX + deltaX,
          clientY,
          composed: true,
          isPrimary: true,
          pointerId: 1,
          pointerType: 'mouse',
          ...init,
        }));
      };
    }

    async function dragBy(handle: HTMLElement, deltaX: number) {
      const dispatch = pointerAt(handle);

      dispatch('pointerdown', 0);
      dispatch('pointermove', deltaX);
      dispatch('pointerup', deltaX);

      await elementUpdated((handle.getRootNode() as ShadowRoot).host as ContentBrowserTable);
    }

    it('offers a resize handle on every configured column and none on the action column', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handles = getHandles(el);

      expect(handles).to.have.lengthOf(COLUMNS.length);
      expect(handles.map((handle) => handle.dataset.field))
        .to.deep.equal(COLUMNS.map((column) => column.field));

      const actionCell = el.shadowRoot!.querySelector('.content-browser-table__cell--action')!;
      expect(actionCell.querySelector('.content-browser-table__resize')).to.not.exist;
    });

    it('puts the whole grab target inside the cell, where it can actually be hit', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handle = getHandles(el)[0];
      const cell = handle.parentElement!.getBoundingClientRect();
      const box = handle.getBoundingClientRect();

      // The cell clips its overflow, so a handle hanging into the column gap is neither painted
      // nor hit-testable -- the pointer would land on the header and the drag would never start.
      expect(box.right).to.be.at.most(cell.right);
      expect(box.left).to.be.at.least(cell.left);
      const topmost = el.shadowRoot!.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      expect(box.width, 'the grab target must have width even without a design-system theme').to.be.greaterThan(0);
      // Compared as a boolean on purpose: chai stringifies a DOM node on failure, and inspecting a
      // shadow subtree this size stalls the test runner rather than reporting.
      expect(topmost === handle, 'the handle must be the topmost element at its own centre').to.be.true;
    });

    it('pins the dragged column to the width it was dragged to', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], 60);
      await elementUpdated(el);

      // 160px configured, dragged 60 to the right.
      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('reports the new width to the host', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      await dragBy(getHandles(el)[0], 40);
      await elementUpdated(el);

      expect(spy).to.have.been.calledOnce;
      expect(spy.firstCall.args[0].detail).to.deep.equal({
        field: 'CoreField.Identifier',
        width: 200,
      });
    });

    it('will not let a column be dragged narrower than its minimum', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], -400);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`${MIN_COLUMN_WIDTH}px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('will not let a column be dragged wider than the maximum', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 600px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      // Nothing measures a maximum any more, but a stray pointer event must still not be able to
      // produce an absurd track.
      await dragBy(getHandles(el)[0], 5000);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`${MAX_COLUMN_WIDTH}px ${DEFAULT_FLEX_TRACK} max-content`);

      // The keyboard step answers to the same bound.
      getHandles(el)[0].focus();
      await sendKeys({ press: 'ArrowRight' });
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`${MAX_COLUMN_WIDTH}px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('widens a column past the table instead of capping it, and scrolls to reach it', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 600px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const container = getContainer(el);

      expect(container.scrollWidth, 'the columns fit before the drag').to.be.at.most(container.clientWidth + 1);

      await dragBy(getHandles(el)[0], 1000);
      await elementUpdated(el);

      // 160px configured, dragged 1000 to the right, in a 600px table. The track is kept whole
      // rather than trimmed to what the header could hold.
      expect(trackList(el)).to.equal(`1160px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(usedTracks(headerOf(el))[0], 'the header lays the whole track out').to.equal(1160);
      expect(container.scrollWidth, 'and the table overflows its own width').to.be.greaterThan(container.clientWidth);

      container.scrollLeft = 9999;

      expect(container.scrollLeft, 'the container is what scrolls to reach it').to.be.greaterThan(0);
    });

    it('scrolls the header and the rows together, keeping their column boundaries in line', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 600px"
          .assets=${[makeAsset()]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);
      await elementUpdated(el);
      await waitForRows(el, 1);

      await dragBy(getHandles(el)[0], 1000);
      await elementUpdated(el);

      const container = getContainer(el);

      container.scrollLeft = 200;
      await elementUpdated(el);

      const header = headerOf(el).getBoundingClientRect();
      const row = getRows(el)[0].getBoundingClientRect();

      // Two grids on one scrollport: one scroll offset moves both, so neither can drift from the
      // other however far the table is scrolled.
      expect(container.scrollLeft, 'the offset belongs to the container').to.equal(200);
      expect(row.left, 'the rows sit where the header does').to.be.closeTo(header.left, 0.5);
      expect(row.width, 'and run exactly as wide').to.be.closeTo(header.width, 0.5);

      const headerBoundary = headerOf(el).querySelector('[role="columnheader"]')!.getBoundingClientRect().right;
      const rowBoundary = getRows(el)[0].querySelector('[role="cell"]')!.getBoundingClientRect().right;

      expect(rowBoundary, 'and their first column ends in the same place').to.be.closeTo(headerBoundary, 0.5);
    });

    /*
     * The component is a flex item in the host's surface, and a grid sized from min-content pushes
     * that surface wider on every drag unless the host is stopped from growing. Two different
     * parents let it grow for two different reasons, so both shapes are covered here: a row parent
     * through the automatic minimum size on the main axis, and a wrapping column parent -- the
     * picker's own shape -- by stretching the host to its flex line instead of to the container.
     * A row-only fixture is what let L-429EVG ship with the picker's login avatar still moving.
     */
    const expectTheDragStaysInsideTheTable = async (parent: HTMLElement) => {
      el = parent.querySelector<ContentBrowserTable>('cx-content-browser-table')!;
      await elementUpdated(el);

      const sibling = parent.querySelector<HTMLElement>('.sibling')!;
      const siblingRight = sibling.getBoundingClientRect().right;
      const parentWidth = parent.getBoundingClientRect().width;

      await dragBy(getHandles(el)[0], 1600);
      await elementUpdated(el);

      const container = getContainer(el);

      expect(container.scrollWidth > container.clientWidth, 'the table itself has to be what overflows').to.be.true;
      expect(el.getBoundingClientRect().width <= parentWidth + 0.5, 'the host may not outgrow its parent').to.be.true;
      expect(sibling.getBoundingClientRect().right, 'nothing beside the table moves').to.be.closeTo(siblingRight, 0.5);
      expect(parent.getBoundingClientRect().width, 'and its surface does not grow').to.be.closeTo(parentWidth, 0.5);
      expect(parent.scrollWidth <= Math.ceil(parentWidth), 'nor does the overflow escape into it').to.be.true;

      el.remove();
    };

    it('keeps a dragged column inside its own scrollport in a row parent', async () => {
      const parent = await fixture<HTMLDivElement>(html`
        <div style="display: flex; width: 600px; align-items: stretch">
          <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
          <div class="sibling" style="flex: none; width: 80px">avatar</div>
        </div>
      `);

      await expectTheDragStaysInsideTheTable(parent);
    });

    it('keeps a dragged column inside its own scrollport in a wrapping column parent', async () => {
      // The table takes a definite height of its own rather than flexing into the line: the
      // horizontal scrollbar this test brings up shortens the rows by more than the page-size
      // observer's threshold, and in a wrapping container that relayout feeds straight back into
      // the line it was measured from. That loop is the fixture's, not the component's.
      const parent = await fixture<HTMLDivElement>(html`
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; width: 600px; height: 600px">
          <div class="sibling" style="flex: none; height: 20px">avatar</div>
          <cx-content-browser-table style="flex: none; height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
        </div>
      `);

      await expectTheDragStaysInsideTheTable(parent);
    });

    it('keeps every other column usable when one is dragged past the table', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 600px"
          .assets=${[makeAsset()]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);
      await elementUpdated(el);
      await waitForRows(el, 1);

      await dragBy(getHandles(el)[0], 1000);
      await elementUpdated(el);

      // The property, not the arithmetic the fix happens to produce: overflowing puts the grid under
      // a min-content constraint, where a flexible track resolves to its base size -- 0 for
      // minmax(0, 1fr) -- while the dragged column and the action column measure exactly what a test
      // pinned to their numbers expects.
      const tracks = usedTracks(headerOf(el)).slice(0, COLUMNS.length);

      expect(tracks.every((track) => track >= MIN_COLUMN_WIDTH),
        `a column collapsed: ${tracks.join(', ')}`).to.be.true;

      const cells = getRows(el)[0].querySelectorAll<HTMLElement>('[role="cell"]');

      expect(cells[1].getBoundingClientRect().width >= MIN_COLUMN_WIDTH,
        'the rows keep the column too, or every cell in it is clipped away').to.be.true;

      // A collapsed column takes its own way back with it: the handle lives inside the cell, which
      // clips, so at zero width there is nothing left for the pointer to grab.
      const container = getContainer(el);

      container.scrollLeft = container.scrollWidth;
      await elementUpdated(el);

      const handle = getHandles(el)[1];
      const box = handle.getBoundingClientRect();
      const topmost = el.shadowRoot!.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);

      expect(topmost === handle, 'and its resize handle can still be pointed at').to.be.true;
    });

    it('floors a host-authored flexible track the way it floors the default', async () => {
      const columns: TableColumn[] = [
        { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
        { field: 'Dell.Snippet', title: 'Snippet', width: 'minmax(0, 2fr)' },
        { field: 'Dell.Other', title: 'Other', width: '2fr' },
      ];

      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 600px" .columns=${columns}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], 1000);
      await elementUpdated(el);

      const tracks = usedTracks(headerOf(el)).slice(1, columns.length);

      expect(tracks.every((track) => track >= MIN_COLUMN_WIDTH),
        `a host-authored flexible column collapsed: ${tracks.join(', ')}`).to.be.true;
    });

    it('does not shrink a column wider than the maximum when the pointer only nudges it', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 2600px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const flexible = el.shadowRoot!
        .querySelector<HTMLElement>('[role="columnheader"][data-field="Dell.Snippet"]')!;
      const before = flexible.getBoundingClientRect().width;

      expect(before > MAX_COLUMN_WIDTH,
        `the column has to start wider than the maximum for this to bite, and measures ${before}`).to.be.true;

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      await dragBy(getHandles(el)[1], 2);
      await elementUpdated(el);

      // Started from an unclamped width, the first clamped move lands hundreds of pixels below it:
      // a nudge to the right that shrinks the column, and asks the host to persist the result.
      expect(spy.called,
        `a 2px nudge persisted ${JSON.stringify(spy.firstCall?.args[0]?.detail)}`).to.be.false;
      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('does not invert an arrow step on a column wider than the maximum', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 2600px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const selector = '[role="columnheader"][data-field="Dell.Snippet"]';
      const before = el.shadowRoot!.querySelector<HTMLElement>(selector)!.getBoundingClientRect().width;

      expect(before > MAX_COLUMN_WIDTH,
        `the column has to start wider than the maximum for this to bite, and measures ${before}`).to.be.true;

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      getHandles(el)[1].focus();
      await sendKeys({ press: 'ArrowRight' });
      await elementUpdated(el);

      const after = el.shadowRoot!.querySelector<HTMLElement>(selector)!.getBoundingClientRect().width;

      // ArrowRight is the widen gesture. Stepping from an unclamped width and clamping the result
      // turned it into the narrow gesture, several hundred pixels at a time.
      expect(after >= before - 1, `ArrowRight narrowed the column from ${before} to ${after}`).to.be.true;
      expect(spy.called, 'and a step with nowhere to go persists nothing').to.be.false;
    });

    it('shows the column dividers at rest and strengthens them for a drag', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handle = getHandles(el)[0];
      const atRest = getComputedStyle(handle, '::after');
      const resting = atRest.backgroundColor;

      // Revealed only on hover, there is nothing to aim at until the pointer is already in the right
      // place. Fallback colours matter here: the tokens resolve to nothing on an unthemed host.
      expect(Number.parseFloat(atRest.opacity) > 0,
        `the divider is invisible at rest: opacity ${atRest.opacity}`).to.be.true;
      expect(resting !== 'rgba(0, 0, 0, 0)' && resting !== 'transparent',
        `the divider paints nothing at rest: ${resting}`).to.be.true;
      expect(Number.parseFloat(atRest.width) > 0, `the divider has no width at rest: ${atRest.width}`).to.be.true;

      // The affordance still answers to being used, or the divider reads as chrome and nothing else.
      const dispatch = pointerAt(handle);

      dispatch('pointerdown', 0);
      const dragging = getComputedStyle(handle, '::after').backgroundColor;

      expect(dragging !== resting, `a drag looks no different from rest: ${dragging}`).to.be.true;

      dispatch('pointerup', 0);
      await elementUpdated(el);
    });

    it('keeps the rows on the same track list as the header after a resize', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px"
          .assets=${[makeAsset()]}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);
      await elementUpdated(el);
      await waitForRows(el, 1);

      await dragBy(getHandles(el)[0], 50);
      await elementUpdated(el);

      const header = el.shadowRoot!.querySelector<HTMLElement>('.content-browser-table__header')!;
      const row = getRows(el)[0];

      expect(getComputedStyle(row).gridTemplateColumns)
        .to.equal(getComputedStyle(header).gridTemplateColumns);
    });

    it('resizes from the keyboard, with a larger step while shift is held', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      getHandles(el)[0].focus();
      await sendKeys({ press: 'ArrowRight' });
      await elementUpdated(el);
      expect(trackList(el)).to.equal(`168px ${DEFAULT_FLEX_TRACK} max-content`);

      await sendKeys({ press: 'Shift+ArrowLeft' });
      await elementUpdated(el);
      expect(trackList(el)).to.equal(`136px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('returns a column to its configured width on Home, and says so', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], 70);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      getHandles(el)[0].focus();
      await sendKeys({ press: 'Home' });
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy.firstCall.args[0].detail).to.deep.equal({
        field: 'CoreField.Identifier',
        width: undefined,
      });
    });

    it('returns a column to its configured width on double click', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], 70);
      await elementUpdated(el);
      expect(trackList(el)).to.not.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);

      getHandles(el)[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('drops a dragged width when the host stops configuring that column', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], 40);
      await elementUpdated(el);
      expect(trackList(el)).to.equal(`200px ${DEFAULT_FLEX_TRACK} max-content`);

      el.columns = [COLUMNS[1]];
      await elementUpdated(el);

      // Only the surviving column's track remains, and it is back to its configured value.
      expect(trackList(el)).to.equal(`${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('ignores a press that is not a primary left-button press', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const rightClick = pointerAt(getHandles(el)[0]);

      rightClick('pointerdown', 0, { button: 2 });
      rightClick('pointermove', 60);
      // Nothing that follows a press the component refused may act on a drag that never started.
      rightClick('pointercancel', 60);
      rightClick('pointerup', 60);
      await elementUpdated(el);

      expect(trackList(el), 'a right-click must not start a drag').to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);

      const secondFinger = pointerAt(getHandles(el)[0]);
      const touch = { isPrimary: false, pointerId: 7, pointerType: 'touch' };

      secondFinger('pointerdown', 0, touch);
      secondFinger('pointermove', 60, touch);
      secondFinger('pointerup', 60, touch);
      await elementUpdated(el);

      expect(trackList(el), 'a non-primary pointer must not start a drag').to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.not.have.been.called;
    });

    it('leaves the first pointer in charge when a second one presses mid-drag', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const dispatch = pointerAt(getHandles(el)[0]);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 40);
      // A second finger lands on the handle. Taking the drag over would orphan the release of the
      // pointer that started it, and the drag would never end.
      dispatch('pointerdown', 300, { pointerId: 2 });
      dispatch('pointermove', 300, { pointerId: 2 });

      expect(trackList(el), 'the second pointer moves nothing').to.equal(`200px ${DEFAULT_FLEX_TRACK} max-content`);

      dispatch('pointermove', 60);
      dispatch('pointerup', 60);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('leaves the handle focused after a drag, so the arrow keys carry on from there', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      await dragBy(getHandles(el)[0], 40);
      await elementUpdated(el);

      // preventDefault on the press suppresses the compatibility mousedown, and with it the focus
      // the press would have given the handle. Compared as a boolean: chai stringifies a DOM node on
      // failure and inspecting a shadow subtree this size stalls the runner.
      expect(el.shadowRoot!.activeElement === getHandles(el)[0], 'the press must focus the handle').to.be.true;

      await sendKeys({ press: 'ArrowRight' });
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`${200 + COLUMN_RESIZE_STEP}px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('abandons the drag and tells the host nothing when the user agent cancels it', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const dispatch = pointerAt(getHandles(el)[0]);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 60);
      expect(trackList(el), 'the drag previews while it runs').to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);

      dispatch('pointercancel', 60);
      await elementUpdated(el);

      // A gesture the user agent took away was never a decision by the user.
      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.not.have.been.called;
      expect(getContainer(el).classList.contains('content-browser-table--resizing')).to.be.false;

      // The cancel has to release the drag too, or the next one never starts.
      await dragBy(getHandles(el)[0], 30);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`190px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('says nothing to the host when a reset or a step changes no width', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      // Home on a column that was never resized: the host has nothing to unpersist.
      getHandles(el)[0].focus();
      await sendKeys({ press: 'Home' });
      await elementUpdated(el);
      expect(spy, 'a reset of a column with no pinned width').to.not.have.been.called;

      // A press that never moved leaves the column exactly where it was.
      await dragBy(getHandles(el)[0], 0);
      expect(spy, 'a drag that moved nothing').to.not.have.been.called;

      await dragBy(getHandles(el)[0], -400);
      await elementUpdated(el);
      expect(spy, 'the drag down to the minimum is a real change').to.have.been.calledOnce;

      // At the minimum ArrowLeft has nowhere left to go, and the press re-pins what is already pinned.
      getHandles(el)[0].focus();
      await sendKeys({ press: 'ArrowLeft' });
      await elementUpdated(el);
      await dragBy(getHandles(el)[0], 0);

      expect(spy, 'neither a step at the minimum nor a zero-movement press on a pinned column').to.have.been.calledOnce;
    });

    it('reports whole pixels for a column whose track measures fractional', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const cell = el.shadowRoot!.querySelector<HTMLElement>('[role="columnheader"][data-field="Dell.Snippet"]')!;

      // An fr track resolves fractional, and every keyboard step would compound the fraction.
      sinon.stub(cell, 'getBoundingClientRect').returns({ width: 120.4 } as unknown as DOMRect);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      getHandles(el)[1].focus();
      await sendKeys({ press: 'ArrowRight' });
      await elementUpdated(el);

      expect(spy.firstCall.args[0].detail.width).to.equal(120 + COLUMN_RESIZE_STEP);
      expect(trackList(el)).to.equal(`160px ${120 + COLUMN_RESIZE_STEP}px max-content`);
    });

    it('keeps the published track list in step with the header cells when columns change mid-drag', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const dispatch = pointerAt(getHandles(el)[0]);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 60);
      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);

      // The host drops the other column and the pointer never moves again before it is released. A
      // track list still three long would leave the action cell in the leftover flexible track and
      // an empty track after it -- in the header and in every virtualized row with it.
      el.columns = [COLUMNS[0]];
      await elementUpdated(el);

      const cells = el.shadowRoot!.querySelectorAll('.content-browser-table__header [role="columnheader"]');

      expect(trackList(el), 'the drag keeps its preview, over the columns that survive')
        .to.equal('220px max-content');
      expect(usedTracks(headerOf(el)), 'one track per rendered cell').to.have.lengthOf(cells.length);

      dispatch('pointerup', 60);
      await elementUpdated(el);

      expect(trackList(el)).to.equal('220px max-content');
    });

    it('announces the handle as a separator, reporting a committed width against the resize range', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handle = getHandles(el)[0];

      expect(handle.getAttribute('role')).to.equal('separator');
      // ARIA defaults a missing maximum to 100, against which a pixel width of 200 is nonsense. The
      // range is the pair of constants the drag and the keyboard step clamp to, so it is reportable
      // before anything is measured -- and stays true however the table is sized or scrolled.
      expect(handle.getAttribute('aria-valuemin')).to.equal(String(MIN_COLUMN_WIDTH));
      expect(handle.getAttribute('aria-valuemax')).to.equal(String(MAX_COLUMN_WIDTH));
      // The column is still on its configured track, so it has no value of its own to report --
      // and resolving one here would cost a layout read per handle on every render.
      expect(handle.hasAttribute('aria-valuenow')).to.be.false;

      await dragBy(getHandles(el)[0], 40);
      await elementUpdated(el);

      const resized = getHandles(el)[0];

      expect(resized.getAttribute('aria-valuenow')).to.equal('200');
      expect(resized.getAttribute('aria-valuemin')).to.equal(String(MIN_COLUMN_WIDTH));
      expect(resized.getAttribute('aria-valuemax')).to.equal(String(MAX_COLUMN_WIDTH));

      getHandles(el)[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
      await elementUpdated(el);

      expect(getHandles(el)[0].hasAttribute('aria-valuenow'), 'a reset column reports no value again').to.be.false;
    });

    it('labels the handle by what it does, not by the column it sits in', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      // The handle is a descendant of the columnheader, so the column title is already in the
      // accessible context: a handle labelled with it announces "Identifier Identifier".
      const labels = getHandles(el).map((handle) => handle.getAttribute('aria-label'));

      expect(labels.some((label) => COLUMNS.some((column) => column.title === label))).to.be.false;
      expect(labels.every((label) => Boolean(label))).to.be.true;
    });

    it('runs the drag through pointer capture when the browser grants it', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handle = getHandles(el)[0];
      const capture = grantCapture(handle);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const dispatch = pointerAt(handle);

      dispatch('pointerdown', 0);
      expect(capture.calledOnce, 'the press asks for the capture').to.be.true;

      dispatch('pointermove', 60);
      expect(trackList(el), 'the captured handle sees the whole drag').to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);

      // With the capture granted the component binds nothing on the document, so a move delivered
      // there belongs to somebody else.
      dispatch('pointermove', 500, {}, document);
      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);

      dispatch('pointerup', 60);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.have.been.calledOnce;
      expect(spy.firstCall.args[0].detail).to.deep.equal({
        field: 'CoreField.Identifier',
        width: 220,
      });
      expect(getContainer(el).classList.contains('content-browser-table--resizing')).to.be.false;
    });

    it('settles the drag where it stands when the browser takes the capture away', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handle = getHandles(el)[0];

      grantCapture(handle);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const dispatch = pointerAt(handle);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 60);
      // An implicit release -- the captured element removed, the gesture taken over -- never sends a
      // pointerup. Without this the drag would latch and the track list would never be published again.
      dispatch('lostpointercapture', 60);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.have.been.calledOnce;
      expect(getContainer(el).classList.contains('content-browser-table--resizing')).to.be.false;

      // The drag is over: the handle's own move binding must not carry on resizing.
      dispatch('pointermove', 400);
      expect(trackList(el)).to.equal(`220px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('reports whole pixels when the pointer lands on a fractional coordinate', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      // clientX is a double, and fractional whenever devicePixelRatio is -- Windows at 150%, Retina
      // at 2 -- so the drag delta arrives fractional, not only the measured starting width.
      await dragBy(getHandles(el)[0], 40.6);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`201px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy.firstCall.args[0].detail.width).to.equal(201);
    });

    it('lets go of the preview when a drag ends on the width it started from', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      // The second column has no configured width, so a preview left behind on it is visible: a
      // fixed px track standing where the flexible one belongs.
      const dispatch = pointerAt(getHandles(el)[1]);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 60);
      expect(trackList(el).includes(`${DEFAULT_FLEX_TRACK}`), 'the drag previews a fixed track').to.be.false;

      dispatch('pointermove', 0);
      dispatch('pointerup', 0);
      await elementUpdated(el);

      // Nothing is committed on this path, so the preview has to come off. Left there the column is
      // pinned with no state behind it: it stops flexing, announces no value, and Home and double
      // click are inert because there is nothing to reset.
      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.not.have.been.called;
      expect(getHandles(el)[1].hasAttribute('aria-valuenow')).to.be.false;

      // The other way onto the same path: a leftward drag on a column already at its minimum, where
      // the clamp pins every move at the width the press started from.
      await dragBy(getHandles(el)[1], -5000);
      await elementUpdated(el);
      expect(trackList(el)).to.equal(`160px ${MIN_COLUMN_WIDTH}px max-content`);
      expect(spy).to.have.been.calledOnce;

      const atMinimum = pointerAt(getHandles(el)[1]);

      atMinimum('pointerdown', 0);
      atMinimum('pointermove', -50);
      atMinimum('pointerup', -50);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`160px ${MIN_COLUMN_WIDTH}px max-content`);
      expect(spy, 'a drag that could not move said nothing').to.have.been.calledOnce;
      expect(getHandles(el)[1].getAttribute('aria-valuenow')).to.equal(String(MIN_COLUMN_WIDTH));
    });

    it('still ends a drag the browser refused to capture', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const handle = getHandles(el)[0];

      // Without a fallback the release lands off the handle, the drag never ends and the component
      // stops republishing the track list for good.
      sinon.stub(handle, 'setPointerCapture').throws(new Error('capture refused'));

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const dispatch = pointerAt(handle);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 50, {}, document);
      dispatch('pointerup', 50, {}, document);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`210px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.have.been.calledOnce;
      expect(getContainer(el).classList.contains('content-browser-table--resizing')).to.be.false;

      // The listeners go with the drag: a later move anywhere in the document resizes nothing.
      dispatch('pointermove', 400, {}, document);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`210px ${DEFAULT_FLEX_TRACK} max-content`);

      // A cancel delivered off the handle must revert the same way one delivered on it does.
      dispatch('pointerdown', 0);
      dispatch('pointermove', 80, {}, document);
      dispatch('pointercancel', 80, {}, document);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`210px ${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.have.been.calledOnce;
    });

    it('drops an in-flight drag when the element is torn down', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const container = getContainer(el);
      const dispatch = pointerAt(getHandles(el)[0]);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 60);
      expect(container.classList.contains('content-browser-table--resizing'), 'a running drag marks the table').to.be.true;

      el.remove();
      await elementUpdated(el);

      expect(container.classList.contains('content-browser-table--resizing'), 'a teardown mid-drag clears it').to.be.false;

      dispatch('pointerup', 60);
      await elementUpdated(el);
      expect(spy).to.not.have.been.called;

      // With the drag still latched, the element would never publish a track list again.
      document.body.append(el);
      el.columns = [COLUMNS[1]];
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`${DEFAULT_FLEX_TRACK} max-content`);
      el.remove();
    });

    it('does not write back a width for a column the host dropped mid-drag', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      const spy = sinon.spy();
      el.addEventListener('cx-content-browser-table-column-resize', spy);

      const dispatch = pointerAt(getHandles(el)[0]);

      dispatch('pointerdown', 0);
      dispatch('pointermove', 60);

      el.columns = [COLUMNS[1]];
      await elementUpdated(el);

      dispatch('pointerup', 60);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`${DEFAULT_FLEX_TRACK} max-content`);
      expect(spy).to.not.have.been.called;

      // Nor may the width lie in wait: the column comes back at the width the host configured.
      el.columns = COLUMNS;
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
    });

    it('sizes a column whose field is an Object.prototype member like any other', async () => {
      // The field is the host's string: read out of a plain object, `toString` resolves to the
      // inherited function and stringifies into grid-template-columns, breaking every row with it.
      const columns: TableColumn[] = [
        { field: 'toString', title: 'Name', width: '120px' },
        { field: 'constructor', title: 'Kind' },
      ];

      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .columns=${columns}></cx-content-browser-table>
      `);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`120px ${DEFAULT_FLEX_TRACK} max-content`);

      await dragBy(getHandles(el)[0], 40);
      await elementUpdated(el);

      expect(trackList(el)).to.equal(`160px ${DEFAULT_FLEX_TRACK} max-content`);
    });
  });

  it('scrolls the rows vertically under a header that stays where it is', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px; width: 600px"
        .assets=${Array.from({ length: 40 }, (_, index) => makeAsset({ id: `asset-${index}` }))}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 2);
    // A scroll offset is clamped against the scroll height as it stands, so the virtualizer has
    // to have sized itself to the whole list before there is anything to scroll to.
    await settleResize();

    const container = getContainer(el);
    const header = el.shadowRoot!.querySelector<HTMLElement>('.content-browser-table__header')!;
    const body = el.shadowRoot!.querySelector<HTMLElement>('lit-virtualizer')!;
    const headerTop = header.getBoundingClientRect().top;
    const bodyTop = body.getBoundingClientRect().top;

    container.scrollTop = 200;
    await elementUpdated(el);

    expect(container.scrollTop, 'the rows scroll vertically inside the container').to.equal(200);
    expect(body.getBoundingClientRect().top, 'the rows travel with the scroll').to.be.closeTo(bodyTop - 200, 1);
    expect(header.getBoundingClientRect().top, 'the header does not go with them').to.be.closeTo(headerTop, 1);
  });

  it('paints the whole sticky header, the offset above the row included', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px; width: 600px"
        .assets=${makeAssets(40)}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 2);
    await settleResize();

    const container = getContainer(el);

    container.scrollTop = 200;
    await elementUpdated(el);

    const head = getHead(el);
    const headBox = head.getBoundingClientRect();
    const headerBox = el.shadowRoot!
      .querySelector<HTMLElement>('.content-browser-table__header')!.getBoundingClientRect();

    // Rows now scroll inside the same scrollport as the header, so anything the sticky box does not
    // paint shows them through. The offset above the header row is real -- a flex item cannot
    // collapse its child's margin out -- so the sticky box itself has to be what paints it.
    expect(headerBox.top - headBox.top >= 4,
      `the sticky box holds a ${headerBox.top - headBox.top}px strip above its row`).to.be.true;
    expect(getRows(el).some((row) => row.getBoundingClientRect().top < headBox.bottom),
      'rows have to be travelling under the header for this to matter').to.be.true;

    const painted = getComputedStyle(head).backgroundColor;
    const alpha = /^rgba\(.*,\s*([\d.]+)\)$/.exec(painted)?.[1];

    expect(painted !== 'rgba(0, 0, 0, 0)' && painted !== 'transparent',
      `the sticky box paints nothing: ${painted}`).to.be.true;
    expect(alpha === undefined || Number.parseFloat(alpha) === 1,
      `the sticky box is see-through: ${painted}`).to.be.true;
  });

  describe('scroll anchoring', () => {
    /** Rows rendered, and the virtualizer sized to the whole list, before anything is measured. */
    async function renderScrollableTable(count = 20) {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px; width: 600px"
          .assets=${makeAssets(count)}
          .columns=${COLUMNS}
        ></cx-content-browser-table>
      `);
      await elementUpdated(el);
      await waitForRows(el, 2);
      await settleResize();
    }

    it('restores the row the user was on, not a header height above it', async () => {
      await renderScrollableTable();

      const container = getContainer(el);
      const headerHeight = getHead(el).getBoundingClientRect().height;
      expect(headerHeight > 1, 'the sticky header has a height to account for').to.be.true;

      // A whole number of rows down, so the sixth row sits exactly against the header's bottom edge
      // and a restore that honours the header has to land back on this same offset.
      container.scrollTop = 5 * ROW_HEIGHT;
      container.dispatchEvent(new Event('scroll'));

      const restores = recordScrollTo(container);

      // What infinite-scroll paging does: the same rows, plus a page.
      el.assets = makeAssets(30);
      await settleRestore(el);

      expect(restores.length > 0, 'the page of assets triggered a restore').to.be.true;
      expect(restores[restores.length - 1], 'it restores the offset it captured')
        .to.be.closeTo(5 * ROW_HEIGHT, 1);
      expect(container.scrollTop, 'and the container is left on that row')
        .to.be.closeTo(5 * ROW_HEIGHT, 1);
    });

    it('anchors on the first row below the header, not one hidden behind it', async () => {
      await renderScrollableTable();

      const container = getContainer(el);
      const headerHeight = getHead(el).getBoundingClientRect().height;
      expect(headerHeight > 1, 'the sticky header has a height to hide a row behind').to.be.true;

      // Half a header past a row boundary: the fifth row's bottom edge is behind the header, where
      // the user cannot see it, and the sixth row is the first one they can.
      container.scrollTop = 5 * ROW_HEIGHT + headerHeight / 2;
      container.dispatchEvent(new Event('scroll'));

      expect(anchoredAssetId(el)).to.equal('asset-5');
    });

    it('waits for the virtualizer to lay the rows out before restoring', async () => {
      await renderScrollableTable();

      const container = getContainer(el);
      let release: () => void = () => undefined;
      const layoutComplete = new Promise<void>((resolve) => {
        release = resolve;
      });

      container.scrollTop = 5 * ROW_HEIGHT;
      container.dispatchEvent(new Event('scroll'));
      // The container is a plain div, so only the virtualizer can say when the rows exist to land
      // on. Held open, a restore that consults it cannot run.
      Object.defineProperty(getBody(el), 'layoutComplete', {
        configurable: true,
        get: () => layoutComplete,
      });

      const restores = recordScrollTo(container);

      el.assets = makeAssets(30);
      await settleRestore(el);

      expect(restores.length === 0, 'the restore waits on the virtualizer').to.be.true;

      release();
      await settleRestore(el);

      expect(restores.length > 0, 'and runs once it has laid out').to.be.true;
    });
  });

  it('applies the column alignment and line clamp to its cells', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset()]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const cells = getRows(el)[0].querySelectorAll('[role="cell"]');
    expect(cells[0].classList.contains('content-browser-table__cell--right')).to.be.false;
    expect(cells[1].classList.contains('content-browser-table__cell--right')).to.be.true;
    expect(cells[0].querySelector('cx-line-clamp')!.getAttribute('lines')).to.equal('1');
    expect(cells[1].querySelector('cx-line-clamp')!.getAttribute('lines')).to.equal('2');
  });

  it('renders an empty cell for a field the response did not return', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ 'Dell.Snippet': undefined })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const cells = getRows(el)[0].querySelectorAll('[role="cell"]');
    expect(cells[1].textContent!.trim()).to.equal('');
  });

  it('renders exactly the assets it was given, one row each', async () => {
    // Item 4, L-429EVG: the table resolves nothing of its own, so a row exists only because the
    // permission-filtered search response the grid also consumes carried that asset.
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'visible-1' }), makeAsset({ id: 'visible-2' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 2);

    expect(getRows(el).map((row) => row.dataset.id)).to.deep.equal(['visible-1', 'visible-2']);
  });

  it('marks only the row whose id matches selected-asset-id', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'a1' }), makeAsset({ id: 'a2' })]}
        .columns=${COLUMNS}
        selected-asset-id="a2"
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 2);

    const rows = getRows(el);
    const one = rows.find((row) => row.dataset.id === 'a1')!;
    const two = rows.find((row) => row.dataset.id === 'a2')!;

    expect(one.classList.contains('content-browser-table__row--selected')).to.be.false;
    expect(two.classList.contains('content-browser-table__row--selected')).to.be.true;
    expect(two.getAttribute('aria-current')).to.equal('true');
  });

  it('emits cx-content-browser-grid-click when a row is clicked', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'click-me' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const p = oneEvent(el, 'cx-content-browser-grid-click');
    getRows(el)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    const ev = await p;

    expect(ev.detail.id).to.equal('click-me');
  });

  it('emits cx-content-browser-grid-click when a row is activated from the keyboard', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'key-me' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const row = getRows(el)[0];
    expect(row.getAttribute('tabindex')).to.equal('0');

    const enter = oneEvent(el, 'cx-content-browser-grid-click');
    row.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'Enter' }));
    expect((await enter).detail.id).to.equal('key-me');

    const space = oneEvent(el, 'cx-content-browser-grid-click');
    row.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, composed: true, key: ' ' }));
    expect((await space).detail.id).to.equal('key-me');
  });

  it('ignores keys other than Enter and Space', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'key-me' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    let count = 0;
    el.addEventListener('cx-content-browser-grid-click', () => {
      count += 1;
    });
    getRows(el)[0].dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'a' }),
    );
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(count).to.equal(0);
  });

  it('does not emit cx-content-browser-grid-click for a cold storage row', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'cold', inColdStorage: true }), makeAsset({ id: 'warm' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 2);

    const rows = getRows(el);
    const cold = rows.find((row) => row.dataset.id === 'cold')!;
    const warm = rows.find((row) => row.dataset.id === 'warm')!;

    expect(cold.getAttribute('tabindex')).to.equal('-1');
    expect(cold.classList.contains('content-browser-table__row--disabled')).to.be.true;

    let count = 0;
    el.addEventListener('cx-content-browser-grid-click', () => {
      count += 1;
    });
    cold.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(count).to.equal(0);

    const p = oneEvent(el, 'cx-content-browser-grid-click');
    warm.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect((await p).detail.id).to.equal('warm');
    expect(count).to.equal(1);
  });

  it('shows the no-result state and no virtualizer when empty', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" ?empty=${true} .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    const noResult = el.shadowRoot!.querySelector('cx-content-browser-no-result');

    expect(noResult).to.exist;
    expect(noResult!.getAttribute('icon')).to.equal('search_off');
    expect(el.shadowRoot!.querySelector('lit-virtualizer')).to.be.null;
  });

  it('emits cx-content-browser-grid-resize with a single column and the visible row count', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await settleResize();

    const p = oneEvent(el, 'cx-content-browser-grid-resize');
    dispatchResize(el, resizeObserverEntry(getContainer(el), 1234));
    const ev = await p;

    expect(ev.detail.columnCount).to.equal(1);
    expect(ev.detail.rowCount).to.equal(Math.ceil(1234 / ROW_HEIGHT));
  });

  it('ignores a resize reported for an element other than the table container', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await settleResize();

    let count = 0;
    el.addEventListener('cx-content-browser-grid-resize', () => {
      count += 1;
    });
    dispatchResize(el, resizeObserverEntry(document.createElement('div') as HTMLDivElement, 1234));
    await settleResize();

    expect(count).to.equal(0);
  });

  it('does not re-emit a resize for a height change under the threshold', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px" .columns=${COLUMNS}></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await settleResize();

    const first = oneEvent(el, 'cx-content-browser-grid-resize');
    dispatchResize(el, resizeObserverEntry(getContainer(el), 1234));
    await first;

    let count = 0;
    el.addEventListener('cx-content-browser-grid-resize', () => {
      count += 1;
    });
    dispatchResize(el, resizeObserverEntry(getContainer(el), 1239));
    await settleResize();

    expect(count).to.equal(0);
  });

  describe('virtualizer scroll end', () => {
    it('emits cx-content-browser-grid-scroll-end at the bottom when hasMore is true', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);

      const p = oneEvent(el, 'cx-content-browser-grid-scroll-end');
      invokeHandleScroll(el, scrollTarget({ clientHeight: 100, scrollHeight: 500, scrollTop: 400 }));
      await p;
    });

    it('does not emit cx-content-browser-grid-scroll-end when hasMore is false', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);
      el.hasMore = false;
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-content-browser-grid-scroll-end', () => {
        count += 1;
      });
      invokeHandleScroll(el, scrollTarget({ clientHeight: 100, scrollHeight: 500, scrollTop: 400 }));
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(count).to.equal(0);
    });

    it('does not ask for another page when the table is only scrolled sideways', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-content-browser-grid-scroll-end', () => {
        count += 1;
      });

      invokeHandleScroll(el, scrollTarget({ clientHeight: 100, scrollHeight: 500, scrollTop: 400 }));
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(count, 'reaching the bottom asks for the next page').to.equal(1);

      // Scrolling sideways to reach a widened column leaves every vertical metric exactly where it
      // was, so an end test that reads only those stays true and the host fetches a page that
      // reveals no rows at all.
      invokeHandleScroll(el, scrollTarget({ clientHeight: 100, scrollHeight: 500, scrollTop: 400 }));
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(count, 'but a horizontal scroll at the bottom asks for nothing').to.equal(1);
    });

    it('does not emit cx-content-browser-grid-scroll-end away from the bottom', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px" .assets=${[makeAsset()]} .columns=${COLUMNS}></cx-content-browser-table>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-content-browser-grid-scroll-end', () => {
        count += 1;
      });
      invokeHandleScroll(el, scrollTarget({ clientHeight: 100, scrollHeight: 500, scrollTop: 0 }));
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(count).to.equal(0);
    });
  });

  it('indexes the assets it is given so a row click can be resolved', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset({ id: 'a1' }), makeAsset({ id: 'a2' })]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);

    expect([...el.assetMap.keys()]).to.deep.equal(['a1', 'a2']);

    el.assets = [makeAsset({ id: 'a3' })];
    await elementUpdated(el);

    expect([...el.assetMap.keys()]).to.deep.equal(['a3']);
  });

  describe('floorFlexibleTrack', () => {
    it('raises a flexible track that a min-content constraint could collapse', () => {
      expect(floorFlexibleTrack('minmax(0, 1fr)')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 1fr)`);
      expect(floorFlexibleTrack('minmax(0, 2fr)')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 2fr)`);
      expect(floorFlexibleTrack('2fr')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 2fr)`);
      expect(floorFlexibleTrack('0.5fr')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 0.5fr)`);
      // auto and min-content measure cells that clip to nothing, so they are floors in name only.
      expect(floorFlexibleTrack('minmax(auto, 1fr)')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 1fr)`);
      expect(floorFlexibleTrack('minmax(min-content, 1fr)')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 1fr)`);
      expect(floorFlexibleTrack('minmax(10px, 1fr)')).to.equal(`minmax(${MIN_COLUMN_WIDTH}px, 1fr)`);
    });

    it('leaves a track that cannot collapse exactly as the host authored it', () => {
      // Nothing here takes a share of the free space, so nothing here has a base size to floor.
      expect(floorFlexibleTrack('160px')).to.equal('160px');
      expect(floorFlexibleTrack('max-content')).to.equal('max-content');
      expect(floorFlexibleTrack('fit-content(200px)')).to.equal('fit-content(200px)');
      expect(floorFlexibleTrack('minmax(100px, 300px)')).to.equal('minmax(100px, 300px)');
      // And a minimum the host chose above the floor is the host's decision to keep.
      expect(floorFlexibleTrack('minmax(200px, 1fr)')).to.equal('minmax(200px, 1fr)');
    });
  });

  describe('readCellValue', () => {
    it('returns the field value as a string', () => {
      expect(readCellValue(makeAsset(), 'Dell.Snippet')).to.equal('A fragment of text');
      expect(readCellValue(makeAsset({ 'Dell.Flag': true }), 'Dell.Flag')).to.equal('true');
    });

    it('returns an empty string for a missing, null or non-scalar value', () => {
      expect(readCellValue(makeAsset(), 'Dell.Missing')).to.equal('');
      expect(readCellValue(makeAsset({ 'Dell.Null': null }), 'Dell.Null')).to.equal('');
      expect(readCellValue(makeAsset({ 'Dell.Object': { a: 1 } }), 'Dell.Object')).to.equal('');
    });
  });

  describe('insert pending state', () => {
    it('spins the action button of the busy row only', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px"
          .assets=${[makeAsset(), makeAsset({ id: 'asset-2' } as Partial<Asset>)]}
          .columns=${COLUMNS}
          .busyAssetId=${'asset-1'}
        ></cx-content-browser-table>
      `);
      await elementUpdated(el);
      await waitForRows(el, 2);

      const buttons = getRows(el).map(
        (row) => row.querySelector<HTMLElement>('.content-browser-table__action')!,
      );

      expect(buttons[0].hasAttribute('loading')).to.be.true;
      expect(buttons[1].hasAttribute('loading')).to.be.false;
    });

    it('keeps the busy action button on screen without a hover', async () => {
      el = await fixture<ContentBrowserTable>(html`
        <cx-content-browser-table style="height: 400px"
          .assets=${[makeAsset()]}
          .columns=${COLUMNS}
          .busyAssetId=${'asset-1'}
        ></cx-content-browser-table>
      `);
      await elementUpdated(el);
      await waitForRows(el, 1);

      // Hover-revealed otherwise, so the feedback would vanish the moment the pointer moved away.
      const button = getRows(el)[0].querySelector<HTMLElement>('.content-browser-table__action')!;

      expect(getComputedStyle(button).visibility).to.equal('visible');
    });
  });
});
