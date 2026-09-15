import './content-browser-table';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import sinon from 'sinon';

import type { Asset } from '@/types/asset';
import { MediaType } from '@/types/asset';
import type { TableColumn } from '@/types/content-browser';

import type ContentBrowserTable from './content-browser-table';
import { readCellValue, ROW_HEIGHT } from './content-browser-table';

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
    const header = el.shadowRoot!.querySelector<HTMLElement>('.content-browser-table__header')!;

    expect(header.style.gridTemplateColumns).to.equal('160px minmax(0px, 1fr) max-content');
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

  it('pads the header by the scroller gutter so its columns line up with the rows', async () => {
    el = await fixture<ContentBrowserTable>(html`
      <cx-content-browser-table style="height: 400px"
        .assets=${[makeAsset()]}
        .columns=${COLUMNS}
      ></cx-content-browser-table>
    `);
    await elementUpdated(el);
    await waitForRows(el, 1);

    const header = el.shadowRoot!.querySelector<HTMLElement>('.content-browser-table__header')!;

    // The header sits outside the scroller, so it has to reserve the scrollbar's width itself.
    expect(header.style.paddingInlineEnd).to.match(/^calc\(var\(--cx-spacing-medium\) \+ \d+px\)$/);
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
    expect(rows.map((r) => r.getAttribute('aria-selected')).join(',')).to.equal('false,true');
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
    expect(two.getAttribute('aria-selected')).to.equal('true');
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
});
