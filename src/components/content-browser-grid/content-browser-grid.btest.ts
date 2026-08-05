import './content-browser-grid';

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
import { GridView } from '@/types/content-browser';

import type ContentBrowserGrid from './content-browser-grid';

function makeAsset(overrides: Partial<Asset> = {}): Asset {
  return {
    docSubType: '',
    docType: MediaType.Image,
    extension: 'jpg',
    id: 'asset-1',
    identifier: 'id-1',
    imageUrl: 'https://placehold.co/120x80',
    name: 'Photo',
    originalUrl: '',
    recordId: 'rec-1',
    size: '1 MB',
    tags: '',
    ...overrides,
  };
}

function getContainer(el: ContentBrowserGrid) {
  return el.shadowRoot!.querySelector('.content-browser-grid') as HTMLDivElement;
}

function resizeObserverEntry(
  container: HTMLDivElement,
  width: number,
  height: number,
) {
  return {
    borderBoxSize: [],
    contentBoxSize: [],
    contentRect: {
      bottom: height,
      height,
      left: 0,
      right: width,
      toJSON() {
        return {};
      },
      top: 0,
      width,
      x: 0,
      y: 0,
    } as DOMRectReadOnly,
    target: container,
  } as unknown as ResizeObserverEntry;
}

/** Scroll metrics stand-in for `event.target` in `handleScroll` (null prototype avoids polluted numeric reads). */
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

function invokeHandleScroll(el: ContentBrowserGrid, target: HTMLDivElement) {
  const handleScroll = (
    Object.getOwnPropertyDescriptor(el, 'handleScroll')?.value ??
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'handleScroll')
      ?.value
  ) as ((event: Event) => void) | undefined;
  expect(handleScroll).to.be.a('function');
  handleScroll!.call(el, { target } as unknown as Event);
}

describe('content-browser-grid', () => {
  let el: ContentBrowserGrid;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(async () => {
    el = await fixture<ContentBrowserGrid>(html`<cx-content-browser-grid><</cx-content-browser-grid>`);
    await elementUpdated(el);
  });

  it('renders resize observer, grid container, and loading overlay', async () => {
    expect(el.shadowRoot!.querySelector('cx-resize-observer')).to.exist;
    expect(getContainer(el)).to.exist;
    expect(el.shadowRoot!.querySelector('.content-browser-grid-loading cx-progress-bar')).to.exist;
  });

  it('has default property values', async () => {
    expect(el.assets).to.deep.equal([]);
    expect(el.empty).to.be.false;
    expect(el.view).to.equal(GridView.Medium);
    expect(el.hasMore).to.be.false;
    expect(el.loading).to.be.false;
    expect(el.selectedAssetId).to.be.undefined;
  });

  it('reflects loading on the host attribute', async () => {
    el = await fixture<ContentBrowserGrid>(html`<cx-content-browser-grid ?loading=${true}><</cx-content-browser-grid>`);
    await elementUpdated(el);
    expect(el.hasAttribute('loading')).to.be.true;
  });

  it('shows empty state when empty is true', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid ?empty=${true}></cx-content-browser-grid>
    `);
    await elementUpdated(el);
    const noResult = el.shadowRoot!.querySelector('cx-content-browser-no-result');
    expect(noResult).to.exist;
    expect(noResult!.getAttribute('icon')).to.equal('search_off');
    expect(noResult!.hasAttribute('message')).to.be.true;
    expect(el.shadowRoot!.querySelector('lit-virtualizer')).to.be.null;
  });

  it('renders lit-virtualizer when not empty', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid .assets=${[]}><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('lit-virtualizer')).to.exist;
    expect(el.shadowRoot!.querySelector('.content-browser-grid__empty')).to.be.null;
  });

  it('renders asset cards for items after the virtualizer lays out', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid .assets=${[makeAsset({ id: 'a1', name: 'One' }), makeAsset({ docType: MediaType.Video, id: 'a2', name: 'Two' })]}><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card').length > 0,
      'virtualizer did not render cards',
      { interval: 50, timeout: 5000 },
    );
    const cards = el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card');
    expect(cards.length).to.be.at.least(1);
    expect(cards[0].getAttribute('asset-id')).to.equal('a1');
    expect((cards[0] as HTMLElement).dataset.id).to.equal('a1');
    expect(cards[0].getAttribute('asset-name')).to.equal('One');
  });

  it('sets selected only on the asset card whose id matches selected-asset-id', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid
        .assets=${[makeAsset({ id: 'a1', name: 'One' }), makeAsset({ id: 'a2', name: 'Two' })]}
        selected-asset-id="a2"
      ><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card').length >= 2,
      'virtualizer did not render both cards',
      { interval: 50, timeout: 5000 },
    );
    const cards = [...el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card')];
    const one = cards.find((c) => c.getAttribute('asset-id') === 'a1')!;
    const two = cards.find((c) => c.getAttribute('asset-id') === 'a2')!;

    expect(one.hasAttribute('selected')).to.be.false;
    expect(two.hasAttribute('selected')).to.be.true;
  });

  it('forwards in-cold-storage to rendered asset cards', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid
        .assets=${[
          makeAsset({ id: 'cold', inColdStorage: true, name: 'Cold' }),
          makeAsset({ id: 'warm', name: 'Warm' }),
        ]}
      ><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card').length >= 2,
      'virtualizer did not render both cards',
      { interval: 50, timeout: 5000 },
    );
    const cards = [...el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card')];
    const cold = cards.find((c) => c.getAttribute('asset-id') === 'cold')!;
    const warm = cards.find((c) => c.getAttribute('asset-id') === 'warm')!;

    expect(cold.hasAttribute('in-cold-storage')).to.be.true;
    expect(warm.hasAttribute('in-cold-storage')).to.be.false;
  });

  it('does not emit cx-content-browser-grid-click when clicking a cold storage asset', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid
        .assets=${[
          makeAsset({ id: 'cold', inColdStorage: true, name: 'Cold' }),
          makeAsset({ id: 'warm', name: 'Warm' }),
        ]}
      ><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card').length >= 2,
      'virtualizer did not render both cards',
      { interval: 50, timeout: 5000 },
    );
    const cards = [...el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card')];
    const cold = cards.find((c) => c.getAttribute('asset-id') === 'cold')!;
    const warm = cards.find((c) => c.getAttribute('asset-id') === 'warm')!;

    let clickCount = 0;
    el.addEventListener('cx-content-browser-grid-click', () => {
      clickCount += 1;
    });

    cold.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(clickCount).to.equal(0);

    const p = oneEvent(el, 'cx-content-browser-grid-click');
    warm.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );
    const ev = await p;
    expect(ev.detail.id).to.equal('warm');
    expect(clickCount).to.equal(1);
  });

  it('emits cx-content-browser-grid-click when a card receives a click targeted at the card', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid .assets=${[makeAsset({ id: 'click-me' })]}><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelector('cx-content-browser-asset-card'),
      'card not rendered',
      { interval: 50, timeout: 5000 },
    );
    const card = el.shadowRoot!.querySelector('cx-content-browser-asset-card')!;
    const p = oneEvent(el, 'cx-content-browser-grid-click');
    card.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );
    const ev = await p;
    expect(ev.detail.id).to.equal('click-me');
  });

  describe('virtualizer scroll end', () => {
    it('emits cx-content-browser-grid-scroll-end when scrolled to the bottom and hasMore is true', async () => {
      el = await fixture<ContentBrowserGrid>(html`
        <cx-content-browser-grid .assets=${[makeAsset()]}><</cx-content-browser-grid>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);
      const p = oneEvent(el, 'cx-content-browser-grid-scroll-end');
      invokeHandleScroll(
        el,
        scrollTarget({
          clientHeight: 100,
          scrollHeight: 500,
          scrollTop: 400,
        }),
      );
      await p;
    });

    it('does not emit cx-content-browser-grid-scroll-end when hasMore is false', async () => {
      el = await fixture<ContentBrowserGrid>(html`
        <cx-content-browser-grid .assets=${[makeAsset()]}><</cx-content-browser-grid>
      `);
      await elementUpdated(el);
      el.hasMore = false;
      await elementUpdated(el);
      let count = 0;
      el.addEventListener('cx-content-browser-grid-scroll-end', () => {
        count += 1;
      });
      invokeHandleScroll(
        el,
        scrollTarget({
          clientHeight: 100,
          scrollHeight: 500,
          scrollTop: 400,
        }),
      );
      await new Promise((r) => setTimeout(r, 300));
      expect(count).to.equal(0);
    });

    it('does not emit cx-content-browser-grid-scroll-end when not near the bottom', async () => {
      el = await fixture<ContentBrowserGrid>(html`
        <cx-content-browser-grid .assets=${[makeAsset()]}><</cx-content-browser-grid>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);
      let count = 0;
      el.addEventListener('cx-content-browser-grid-scroll-end', () => {
        count += 1;
      });
      invokeHandleScroll(
        el,
        scrollTarget({
          clientHeight: 100,
          scrollHeight: 500,
          scrollTop: 0,
        }),
      );
      await new Promise((r) => setTimeout(r, 300));
      expect(count).to.equal(0);
    });
  });

  it('captures the first visible card on scroll and restores it to the same offset', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid
        .assets=${[
          makeAsset({ id: 'above', name: 'Above' }),
          makeAsset({ id: 'anchor', name: 'Anchor' }),
        ]}
      ><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card').length >= 2,
      'virtualizer did not render cards',
      { interval: 50, timeout: 5000 },
    );

    const virtualizer = el.shadowRoot!.querySelector('lit-virtualizer') as HTMLElement;
    const cards = [...el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card')];
    const aboveCard = cards.find((card) => card.getAttribute('asset-id') === 'above') as HTMLElement;
    const anchorCard = cards.find((card) => card.getAttribute('asset-id') === 'anchor') as HTMLElement;
    const scrollTo = sinon.spy();
    let scrollTop = 250;

    Object.defineProperties(virtualizer, {
      clientHeight: { configurable: true, get: () => 100 },
      scrollHeight: { configurable: true, get: () => 500 },
      scrollTo: { configurable: true, value: scrollTo },
      scrollTop: {
        configurable: true,
        get: () => scrollTop,
        set: (value) => {
          scrollTop = value;
        },
      },
    });
    sinon.stub(virtualizer, 'getBoundingClientRect').returns({ top: 100 } as DOMRect);
    sinon.stub(aboveCard, 'getBoundingClientRect').returns({ bottom: 90, top: 20 } as DOMRect);
    const anchorRect = sinon.stub(anchorCard, 'getBoundingClientRect');
    anchorRect.returns({ bottom: 300, top: 120 } as DOMRect);

    invokeHandleScroll(el, virtualizer as HTMLDivElement);

    anchorRect.returns({ bottom: 360, top: 180 } as DOMRect);
    (
      el as unknown as {
        scrollAnchorController: {
          restore: () => void;
          setLayoutMetrics: (options: { columnCount: number; itemHeight: number }) => void;
        };
      }
    ).scrollAnchorController.setLayoutMetrics({
      columnCount: 0,
      itemHeight: 0,
    });
    (
      el as unknown as {
        scrollAnchorController: {
          restore: () => void;
        };
      }
    ).scrollAnchorController.restore();

    expect(scrollTop).to.equal(310);
    expect(scrollTo).to.have.been.calledOnceWith({
      behavior: 'auto',
      top: 310,
    });
  });

  it('uses layout metrics to keep the captured asset at the same offset after grid layout changes', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid
        .assets=${[
          makeAsset({ id: 'above', name: 'Above' }),
          makeAsset({ id: 'middle', name: 'Middle' }),
          makeAsset({ id: 'anchor', name: 'Anchor' }),
        ]}
      ><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card').length >= 3,
      'virtualizer did not render cards',
      { interval: 50, timeout: 5000 },
    );

    const virtualizer = el.shadowRoot!.querySelector('lit-virtualizer') as HTMLElement;
    const cards = [...el.shadowRoot!.querySelectorAll('cx-content-browser-asset-card')] as HTMLElement[];
    const anchorCard = cards.find((card) => card.getAttribute('asset-id') === 'anchor')!;
    const scrollTo = sinon.spy();
    let scrollTop = 250;

    Object.defineProperties(virtualizer, {
      clientHeight: { configurable: true, get: () => 100 },
      scrollHeight: { configurable: true, get: () => 500 },
      scrollTo: { configurable: true, value: scrollTo },
      scrollTop: {
        configurable: true,
        get: () => scrollTop,
        set: (value) => {
          scrollTop = value;
        },
      },
    });
    sinon.stub(virtualizer, 'getBoundingClientRect').returns({ top: 100 } as DOMRect);
    cards
      .filter((card) => card !== anchorCard)
      .forEach((card) => {
        sinon.stub(card, 'getBoundingClientRect').returns({ bottom: 90, top: 20 } as DOMRect);
      });
    const anchorRect = sinon.stub(anchorCard, 'getBoundingClientRect');
    anchorRect.returns({ bottom: 300, top: 120 } as DOMRect);

    invokeHandleScroll(el, virtualizer as HTMLDivElement);
    anchorRect.returns({ bottom: 700, top: 600 } as DOMRect);
    (
      el as unknown as {
        scrollAnchorController: {
          restore: () => void;
          setLayoutMetrics: (options: { columnCount: number; itemHeight: number }) => void;
        };
      }
    ).scrollAnchorController.setLayoutMetrics({
      columnCount: 2,
      itemHeight: 100,
    });

    (
      el as unknown as {
        scrollAnchorController: {
          restore: () => void;
        };
      }
    ).scrollAnchorController.restore();

    expect(scrollTop).to.equal(80);
    expect(scrollTo).to.have.been.calledOnceWith({
      behavior: 'auto',
      top: 80,
    });
  });

  it('stops propagation of cx-resize so it does not bubble to content-browser-grid host', async () => {
    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);
    let hostHeardResize = false;
    el.addEventListener('cx-resize', () => {
      hostHeardResize = true;
    });

    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [resizeObserverEntry(container, 600, 400)] },
      }),
    );

    expect(hostHeardResize).to.be.false;
  });

  it('emits cx-content-browser-grid-resize after a debounced resize observation', async () => {
    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);
    const contentRect = {
      bottom: 400,
      height: 400,
      left: 0,
      right: 600,
      toJSON() {
        return {};
      },
      top: 0,
      width: 600,
      x: 0,
      y: 0,
    } as DOMRectReadOnly;
    const entry = {
      borderBoxSize: [],
      contentBoxSize: [],
      contentRect,
      target: container,
    } as unknown as ResizeObserverEntry;

    const p = oneEvent(el, 'cx-content-browser-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [entry] },
      }),
    );
    const ev = await p;
    expect(ev.detail.columnCount).to.be.at.least(1);
    expect(ev.detail.rowCount).to.be.at.least(1);
  });

  it('does not emit cx-content-browser-grid-resize when width and height change by less than 10px', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);

    const p = oneEvent(el, 'cx-content-browser-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [resizeObserverEntry(container, 600, 400)] },
      }),
    );
    await p;

    let count = 0;
    el.addEventListener('cx-content-browser-grid-resize', () => {
      count += 1;
    });

    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [resizeObserverEntry(container, 605, 406)] },
      }),
    );
    await new Promise((r) => setTimeout(r, 300));
    expect(count).to.equal(0);
  });

  it('emits zero column and row counts when container width is below 100', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);
    const contentRect = {
      bottom: 200,
      height: 200,
      left: 0,
      right: 50,
      toJSON() {
        return {};
      },
      top: 0,
      width: 50,
      x: 0,
      y: 0,
    } as DOMRectReadOnly;
    const entry = {
      borderBoxSize: [],
      contentBoxSize: [],
      contentRect,
      target: container,
    } as unknown as ResizeObserverEntry;

    const p = oneEvent(el, 'cx-content-browser-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [entry] },
      }),
    );
    const ev = await p;
    expect(ev.detail.columnCount).to.equal(0);
    expect(ev.detail.rowCount).to.equal(0);
  });

  it('uses virtualizerEl clientWidth as effectiveWidth to account for scrollbar', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);
    const virtualizer = el.shadowRoot!.querySelector('lit-virtualizer')!;

    // Mock virtualizer clientWidth to 400px (simulating scrollbar on 600px container)
    Object.defineProperty(virtualizer, 'clientWidth', {
      configurable: true,
      get: () => 400,
    });

    const p = oneEvent(el, 'cx-content-browser-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [resizeObserverEntry(container, 600, 400)] },
      }),
    );
    const ev = await p;

    // effectiveWidth = 400 (from clientWidth) → 2 columns for Medium view, not 3 from container width=600
    expect(ev.detail.columnCount).to.equal(2);

    Object.defineProperty(virtualizer, 'clientWidth', {
      configurable: true,
      get: () => 0,
    });
  });

  it('recalculates column count and emits resize when view changes (handleViewChange)', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);
    const virtualizer = el.shadowRoot!.querySelector('lit-virtualizer')!;
    Object.defineProperty(virtualizer, 'clientWidth', { configurable: true, get: () => 0 });

    let p = oneEvent(el, 'cx-content-browser-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [resizeObserverEntry(container, 600, 400)] },
      }),
    );
    const afterLayout = await p;

    expect(el.view).to.equal(GridView.Medium);
    expect(afterLayout.detail.columnCount).to.equal(3);

    p = oneEvent(el, 'cx-content-browser-grid-resize');
    el.view = GridView.Small;
    await elementUpdated(el);
    const afterViewChange = await p;

    expect(el.view).to.equal(GridView.Small);
    expect(afterViewChange.detail.columnCount).to.equal(4);
  });

  it('falls back to Large min width when view is not an ASSET_SIZE key', async () => {
    await new Promise((r) => setTimeout(r, 300));

    (el as unknown as { view: string }).view = 'not-a-registered-grid-view';
    await elementUpdated(el);

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);
    const virtualizer = el.shadowRoot!.querySelector('lit-virtualizer')!;
    Object.defineProperty(virtualizer, 'clientWidth', { configurable: true, get: () => 0 });
    const contentRect = {
      bottom: 400,
      height: 400,
      left: 0,
      right: 600,
      toJSON() {
        return {};
      },
      top: 0,
      width: 600,
      x: 0,
      y: 0,
    } as DOMRectReadOnly;
    const entry = {
      borderBoxSize: [],
      contentBoxSize: [],
      contentRect,
      target: container,
    } as unknown as ResizeObserverEntry;

    const p = oneEvent(el, 'cx-content-browser-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [entry] },
      }),
    );
    const ev = await p;

    // ASSET_SIZE[GridView.Large].minWidth === 302; width 600 × height 400
    expect(ev.detail.columnCount).to.equal(1);
    expect(ev.detail.rowCount).to.equal(2);
  });

  it('does not emit cx-content-browser-grid-resize when the resize entry target is not the grid container', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const wrongTarget = document.createElement('div');
    const contentRect = {
      bottom: 400,
      height: 400,
      left: 0,
      right: 600,
      toJSON() {
        return {};
      },
      top: 0,
      width: 600,
      x: 0,
      y: 0,
    } as DOMRectReadOnly;
    const entry = {
      borderBoxSize: [],
      contentBoxSize: [],
      contentRect,
      target: wrongTarget,
    } as unknown as ResizeObserverEntry;

    let count = 0;
    el.addEventListener('cx-content-browser-grid-resize', () => {
      count += 1;
    });
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [entry] },
      }),
    );
    await new Promise((r) => setTimeout(r, 250));
    expect(count).to.equal(0);
  });

  it('reflects view on the host attribute', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid view=${GridView.Small}><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    expect(el.getAttribute('view')).to.equal(GridView.Small);
  });

  it('is accessible in empty state', async () => {
    el = await fixture<ContentBrowserGrid>(html`
      <cx-content-browser-grid ?empty=${true}><</cx-content-browser-grid>
    `);
    await elementUpdated(el);
    await expect(el).to.be.accessible();
  });
});
