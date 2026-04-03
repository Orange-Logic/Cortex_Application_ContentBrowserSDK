import './dam-view-grid';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';

import type { Asset } from '@/types/asset';
import { MediaType } from '@/types/asset';
import { GridView } from '@/types/dam-view';

import type DamViewGrid from './dam-view-grid';

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

function getContainer(el: DamViewGrid) {
  return el.shadowRoot!.querySelector('.dam-view-grid') as HTMLDivElement;
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

function invokeHandleScroll(el: DamViewGrid, target: HTMLDivElement) {
  const handleScroll = (
    Object.getOwnPropertyDescriptor(el, 'handleScroll')?.value ??
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'handleScroll')
      ?.value
  ) as ((event: Event) => void) | undefined;
  expect(handleScroll).to.be.a('function');
  handleScroll!.call(el, { target } as unknown as Event);
}

describe('dam-view-grid', () => {
  let el: DamViewGrid;

  beforeEach(async () => {
    el = await fixture<DamViewGrid>(html`<dam-view-grid></dam-view-grid>`);
    await elementUpdated(el);
  });

  it('renders resize observer, grid container, and loading overlay', async () => {
    expect(el.shadowRoot!.querySelector('cx-resize-observer')).to.exist;
    expect(getContainer(el)).to.exist;
    expect(el.shadowRoot!.querySelector('.dam-view-grid-loading cx-progress-bar')).to.exist;
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
    el = await fixture<DamViewGrid>(html`<dam-view-grid ?loading=${true}></dam-view-grid>`);
    await elementUpdated(el);
    expect(el.hasAttribute('loading')).to.be.true;
  });

  it('shows empty state when empty is true', async () => {
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid ?empty=${true}></dam-view-grid>
    `);
    await elementUpdated(el);
    const empty = el.shadowRoot!.querySelector('.dam-view-grid__empty');
    expect(empty).to.exist;
    expect(empty!.textContent?.includes('No results')).to.be.true;
    expect(el.shadowRoot!.querySelector('lit-virtualizer')).to.be.null;
  });

  it('renders lit-virtualizer when not empty', async () => {
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid .assets=${[]}></dam-view-grid>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('lit-virtualizer')).to.exist;
    expect(el.shadowRoot!.querySelector('.dam-view-grid__empty')).to.be.null;
  });

  it('renders asset cards for items after the virtualizer lays out', async () => {
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid .assets=${[makeAsset({ id: 'a1', name: 'One' }), makeAsset({ docType: MediaType.Video, id: 'a2', name: 'Two' })]}></dam-view-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-dam-view-asset-card').length > 0,
      'virtualizer did not render cards',
      { interval: 50, timeout: 5000 },
    );
    const cards = el.shadowRoot!.querySelectorAll('cx-dam-view-asset-card');
    expect(cards.length).to.be.at.least(1);
    expect(cards[0].getAttribute('asset-id')).to.equal('a1');
    expect(cards[0].getAttribute('asset-name')).to.equal('One');
  });

  it('sets selected only on the asset card whose id matches selected-asset-id', async () => {
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid
        .assets=${[makeAsset({ id: 'a1', name: 'One' }), makeAsset({ id: 'a2', name: 'Two' })]}
        selected-asset-id="a2"
      ></dam-view-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelectorAll('cx-dam-view-asset-card').length >= 2,
      'virtualizer did not render both cards',
      { interval: 50, timeout: 5000 },
    );
    const cards = [...el.shadowRoot!.querySelectorAll('cx-dam-view-asset-card')];
    const one = cards.find((c) => c.getAttribute('asset-id') === 'a1')!;
    const two = cards.find((c) => c.getAttribute('asset-id') === 'a2')!;

    expect(one.hasAttribute('selected')).to.be.false;
    expect(two.hasAttribute('selected')).to.be.true;
  });

  it('emits cx-dam-view-grid-click when a card receives a click targeted at the card', async () => {
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid .assets=${[makeAsset({ id: 'click-me' })]}></dam-view-grid>
    `);
    await elementUpdated(el);
    await waitUntil(
      () => el.shadowRoot!.querySelector('cx-dam-view-asset-card'),
      'card not rendered',
      { interval: 50, timeout: 5000 },
    );
    const card = el.shadowRoot!.querySelector('cx-dam-view-asset-card')!;
    const p = oneEvent(el, 'cx-dam-view-grid-click');
    card.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    );
    const ev = await p;
    expect(ev.detail.id).to.equal('click-me');
  });

  describe('virtualizer scroll end', () => {
    it('emits cx-dam-view-grid-scroll-end when scrolled to the bottom and hasMore is true', async () => {
      el = await fixture<DamViewGrid>(html`
        <dam-view-grid .assets=${[makeAsset()]}></dam-view-grid>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);
      const p = oneEvent(el, 'cx-dam-view-grid-scroll-end');
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

    it('does not emit cx-dam-view-grid-scroll-end when hasMore is false', async () => {
      el = await fixture<DamViewGrid>(html`
        <dam-view-grid .assets=${[makeAsset()]}></dam-view-grid>
      `);
      await elementUpdated(el);
      el.hasMore = false;
      await elementUpdated(el);
      let count = 0;
      el.addEventListener('cx-dam-view-grid-scroll-end', () => {
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

    it('does not emit cx-dam-view-grid-scroll-end when not near the bottom', async () => {
      el = await fixture<DamViewGrid>(html`
        <dam-view-grid .assets=${[makeAsset()]}></dam-view-grid>
      `);
      await elementUpdated(el);
      el.hasMore = true;
      await elementUpdated(el);
      let count = 0;
      el.addEventListener('cx-dam-view-grid-scroll-end', () => {
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

  it('stops propagation of cx-resize so it does not bubble to dam-view-grid host', async () => {
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

  it('emits cx-dam-view-grid-resize after a debounced resize observation', async () => {
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

    const p = oneEvent(el, 'cx-dam-view-grid-resize');
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

  it('does not emit cx-dam-view-grid-resize when width and height change by less than 10px', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);

    const p = oneEvent(el, 'cx-dam-view-grid-resize');
    ro.dispatchEvent(
      new CustomEvent('cx-resize', {
        bubbles: true,
        composed: true,
        detail: { entries: [resizeObserverEntry(container, 600, 400)] },
      }),
    );
    await p;

    let count = 0;
    el.addEventListener('cx-dam-view-grid-resize', () => {
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

    const p = oneEvent(el, 'cx-dam-view-grid-resize');
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

  it('recalculates column count and emits resize when view changes (handleViewChange)', async () => {
    await new Promise((r) => setTimeout(r, 300));

    const ro = el.shadowRoot!.querySelector('cx-resize-observer')!;
    const container = getContainer(el);

    let p = oneEvent(el, 'cx-dam-view-grid-resize');
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

    p = oneEvent(el, 'cx-dam-view-grid-resize');
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

    const p = oneEvent(el, 'cx-dam-view-grid-resize');
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

  it('does not emit cx-dam-view-grid-resize when the resize entry target is not the grid container', async () => {
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
    el.addEventListener('cx-dam-view-grid-resize', () => {
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
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid view=${GridView.Small}></dam-view-grid>
    `);
    await elementUpdated(el);
    expect(el.getAttribute('view')).to.equal(GridView.Small);
  });

  it('is accessible in empty state', async () => {
    el = await fixture<DamViewGrid>(html`
      <dam-view-grid ?empty=${true}></dam-view-grid>
    `);
    await elementUpdated(el);
    await expect(el).to.be.accessible();
  });
});
