/*
 * Shared by the table's browser test files, which are split so that each one finishes inside the
 * test runner's per-file time limit: every test that renders rows takes about a second.
 */
import {
  aTimeout,
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import {
  sendKeys,
} from '@web/test-runner-commands';
import sinon from 'sinon';

import type { Asset } from '@/types/asset';
import { MediaType } from '@/types/asset';
import type { TableColumn } from '@/types/content-browser';

import type ContentBrowserTable from './content-browser-table';
import {
  FILLER_FIELD,
} from './content-browser-table';

export type CxTable = HTMLElementTagNameMap['cx-table'];

export type Cta = HTMLElement & { loading: boolean; updateComplete: Promise<unknown> };

export const COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier' },
  { field: 'Dell.Snippet', title: 'Snippet' },
];

export const SINGLE_LINE_COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier' },
  { field: 'Dell.Snippet', title: 'Snippet' },
];

/**
 * A text fragment as the search call returns it: no file, so no extension and no thumbnail, with the
 * column fields riding on the item under the Cortex field name. See L-29Q5K0.
 */
export function makeAsset(overrides: Record<string, unknown> = {}): Asset {
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

export function makeAssets(count: number, from = 0, prefix = 'asset') {
  return Array.from({ length: count }, (_, index) => makeAsset({
    'CoreField.Identifier': `${prefix.toUpperCase()}-${from + index}`,
    id: `${prefix}-${from + index}`,
    recordId: `rec-${prefix}-${from + index}`,
  }));
}

export function getCxTable(el: ContentBrowserTable) {
  return el.shadowRoot!.querySelector<CxTable>('cx-table');
}

export function getTableRoot(el: ContentBrowserTable) {
  return getCxTable(el)!.shadowRoot!;
}

export function getRowElements(el: ContentBrowserTable) {
  return [...getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-row')];
}

export function getRowElement(el: ContentBrowserTable, assetId: string) {
  const row = getCxTable(el)!.tabulatorInstance!.getRow(assetId);

  return row ? row.getElement() : undefined;
}

export function getScrollport(el: ContentBrowserTable) {
  return getTableRoot(el).querySelector<HTMLElement>('.tabulator-tableholder')!;
}

/** Matches the columns the component adds to the host's: the filler. */
export const OWN_FIELDS = `[tabulator-field="${FILLER_FIELD}"]`;

/** The host's column headers, without the filler header. */
export function getHeaderTitles(el: ContentBrowserTable) {
  return [...getTableRoot(el).querySelectorAll<HTMLElement>(`.tabulator-col:not(${OWN_FIELDS}) .tabulator-col-title`)]
    .map((title) => title.textContent?.trim() ?? '');
}

/** A row's data cells, without the filler cell. */
export function getDataCells(row: HTMLElement) {
  return [...row.querySelectorAll<HTMLElement>(`.tabulator-cell:not(${OWN_FIELDS})`)];
}

export function getContainer(el: ContentBrowserTable) {
  return el.shadowRoot!.querySelector<HTMLDivElement>('.content-browser-table')!;
}

/** `cx-table` builds Tabulator asynchronously, and rows arrive only once it has. */
export async function waitForRows(el: ContentBrowserTable, count: number) {
  await waitUntil(
    () => (getCxTable(el)?.tabulatorInstance?.getRows().length ?? 0) >= count
      && getRowElements(el).length > 0,
    `the table never held ${count} rows`,
    { interval: 20, timeout: 5000 },
  );
}

export async function mount(template: ReturnType<typeof html>, rowCount = 1) {
  const el = await fixture<ContentBrowserTable>(template);

  await elementUpdated(el);
  await waitForRows(el, rowCount);

  return el;
}

/** A row's CTA button, once it has rendered its own shadow root. */
export async function getCta(row: HTMLElement | undefined) {
  const cta = row?.querySelector<Cta>('.content-browser-table__cta');

  await cta?.updateComplete;

  return cta ?? undefined;
}

export function getCtaLabel(cta: Cta) {
  return cta.querySelector('span')?.innerText.trim() ?? '';
}

export function getCtaInnerButton(cta: Cta) {
  return cta.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
}

/** The opacity a CTA paints at: its own times every ancestor's, across shadow roots. */
export function effectiveOpacity(element: Element) {
  let opacity = 1;

  for (let node: Node | null = element; node; node = node instanceof ShadowRoot ? node.host : node.parentNode) {
    if (node instanceof Element) {
      opacity *= Number(getComputedStyle(node).opacity);
    }
  }

  return opacity;
}

export function isShown(cta: Cta | undefined) {
  return cta !== undefined && effectiveOpacity(cta) === 1 && getComputedStyle(cta).visibility === 'visible';
}

/** A query list whose match a test sets, and changes as an input device that is attached or removed does. */
export function fakeMediaQuery(media: string) {
  let current = false;
  const list = Object.defineProperties(new EventTarget(), {
    matches: { get: () => current },
    media: { value: media },
  }) as unknown as MediaQueryList;

  return {
    change(next: boolean) {
      current = next;
      list.dispatchEvent(new MediaQueryListEvent('change', { matches: next, media }));
    },
    list,
    set(next: boolean) {
      current = next;
    },
  };
}

/**
 * Stands in for the input queries, none of them matched at first. A test adds a query to the map
 * to fake a device, such as a touch screen beside a mouse, whatever the test machine has. Install
 * it once per test, before the table connects: `sinon.restore()` takes it off.
 */
export function stubInputQueries() {
  const matchMedia = window.matchMedia.bind(window);
  const queries = new Map([['(hover: none)', fakeMediaQuery('(hover: none)')]]);

  sinon.stub(window, 'matchMedia').callsFake((query: string) => queries.get(query)?.list ?? matchMedia(query));

  return queries;
}

export function deepActiveElement() {
  let active = document.activeElement;

  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }

  return active;
}

export function hasFocus(cta: Cta | undefined) {
  return cta !== undefined && deepActiveElement() === getCtaInnerButton(cta);
}

/** Tabs forward from `start` until a CTA takes the focus, and returns it. */
export async function tabToCta(start: HTMLElement) {
  start.focus();

  for (let press = 0; press < 12; press += 1) {
    await sendKeys({ press: 'Tab' });

    const active = deepActiveElement();
    const host = active?.getRootNode() instanceof ShadowRoot ? (active.getRootNode() as ShadowRoot).host : null;

    if (host?.classList.contains('content-browser-table__cta')) {
      return host as Cta;
    }
  }

  return undefined;
}

/** The row action overlay, independent of the data columns. */
export function getCtaOverlay(row: HTMLElement) {
  return row.querySelector<HTMLElement>('[part~="content-browser-action"]');
}

/** The action label fits its overlay without a clip, including under a scaled ancestor. */
export function isCtaOverlayFitted(cta: Cta | undefined) {
  const parent = cta?.parentElement;

  if (!cta || !parent || parent.offsetWidth === 0) {
    return false;
  }

  const style = getComputedStyle(parent);
  const box = parent.getBoundingClientRect();
  const scale = box.width / parent.offsetWidth;
  const content = (parent.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)) * scale;
  const button = cta.getBoundingClientRect();

  return Math.abs(content - button.width) <= 1 && button.left >= box.left - 0.5 && button.right <= box.right + 0.5;
}

export async function waitForCtaLayout(el: ContentBrowserTable) {
  await waitUntil(async () => isCtaOverlayFitted(await getCta(getRowElements(el)[0])),
    'the CTA overlay never fit its button', { interval: 20, timeout: 3000 });
}

/**
 * A double click as the browser delivers it: two clicks, the second counted as such, then `dblclick`.
 * Dispatched, because `sendMouse` has no double click.
 */
export function doubleClick(target: HTMLElement) {
  const init = { bubbles: true, button: 0, cancelable: true, composed: true };

  target.dispatchEvent(new MouseEvent('click', { ...init, detail: 1 }));
  target.dispatchEvent(new MouseEvent('click', { ...init, detail: 2 }));
  target.dispatchEvent(new MouseEvent('dblclick', { ...init, detail: 2 }));
}

export function centerOf(element: Element): [number, number] {
  const { height, left, top, width } = element.getBoundingClientRect();

  return [Math.round(left + width / 2), Math.round(top + height / 2)];
}

export function resizeObserverEntry(container: HTMLDivElement, height: number, width = 400) {
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

export function dispatchResize(el: ContentBrowserTable, entry: ResizeObserverEntry) {
  el.shadowRoot!.querySelector('cx-resize-observer')!.dispatchEvent(
    new CustomEvent('cx-resize', {
      bubbles: true,
      composed: true,
      detail: { entries: [entry] },
    }),
  );
}

/** Past the debounce the resize and scroll handlers wait out. */
export function settle(ms = 300) {
  return aTimeout(ms);
}

/**
 * Tabulator drags a column with mouse events: the press on the handle, the move and release on the
 * document body. Dispatched rather than driven with `sendMouse`, whose drags leak between tests.
 */
export function dragColumnHandle(handle: HTMLElement, delta: number) {
  const { left, top, width } = handle.getBoundingClientRect();
  const startX = left + width / 2;
  const init = { bubbles: true, button: 0, clientY: top + 1, composed: true };

  handle.dispatchEvent(new MouseEvent('mousedown', { ...init, clientX: startX }));
  document.body.dispatchEvent(new MouseEvent('mousemove', { ...init, clientX: startX + delta }));
  document.body.dispatchEvent(new MouseEvent('mouseup', { ...init, clientX: startX + delta }));
}

export function getResizeHandles(el: ContentBrowserTable) {
  return [...getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col-resize-handle')];
}

export function getColumnWidth(el: ContentBrowserTable, index: number) {
  return getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col')[index].getBoundingClientRect().width;
}

export function getColumnHeader(el: ContentBrowserTable, field: string) {
  return getTableRoot(el).querySelector<HTMLElement>(`.tabulator-col[tabulator-field="${field}"]`)!;
}

/**
 * The rounded header width of the column that shows `field`. A row key (`column0`) works too. A
 * Cortex field resolves to its row key through the column definitions of `cx-table`.
 */
export function getColumnWidthByField(el: ContentBrowserTable, field: string) {
  const index = el.columns.findIndex((column) => column.field === field);
  const definition = index < 0 ? undefined : getCxTable(el)!.columns![index];
  const key = definition ? String(definition.field) : field;

  return Math.round(getColumnHeader(el, key).getBoundingClientRect().width);
}

export function getCtaWidth(el: ContentBrowserTable) {
  return getRowElements(el)[0].querySelector<HTMLElement>('.content-browser-table__cta')!.getBoundingClientRect().width;
}

/** Every column's laid-out width added up, the filler's included. */
export function getColumnsTotal(el: ContentBrowserTable) {
  return [...getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col')]
    .reduce((total, column) => total + column.getBoundingClientRect().width, 0);
}

/**
 * The width the columns have to fill: the table's own, less the scrollport's vertical scrollbar. Not
 * the scrollport's: it is as wide as the columns, however narrow they are.
 */
export function getInnerWidth(el: ContentBrowserTable) {
  const scrollport = getScrollport(el);

  return getTableRoot(el).querySelector<HTMLElement>('.tabulator')!.clientWidth
    - (scrollport.offsetWidth - scrollport.clientWidth);
}

export function rowsFillViewport(el: ContentBrowserTable) {
  const expected = Math.max(getColumnsTotal(el), getInnerWidth(el));

  return getRowElements(el).every((row) => Math.abs(row.getBoundingClientRect().width - expected) <= 1);
}

/** Rows fill the viewport even when the data columns leave empty space. */
export async function expectRowsFill(el: ContentBrowserTable, when: string) {
  await waitUntil(() => rowsFillViewport(el), '', { interval: 20, timeout: 2000 }).catch(() => undefined);

  const expected = Math.max(getColumnsTotal(el), getInnerWidth(el));

  getRowElements(el).forEach((row) => {
    expect(row.getBoundingClientRect().width, `${when}, a row does not fill the viewport`).to.be.closeTo(expected, 1);
  });
}

/** A drag far past the column's left edge, where it stops at the column's minimum. */
export async function dragToMinimum(el: ContentBrowserTable, index: number) {
  const resized = oneEvent(el, 'cx-content-browser-table-column-resize');

  dragColumnHandle(getResizeHandles(el)[index], -1000);

  return (await resized).detail as { field: string; width: number };
}

/** The height of the band the rendered rows leave blank at the bottom of the scrollport. */
export function getBlankBelowRows(el: ContentBrowserTable) {
  const scrollport = getScrollport(el);
  const bottom = scrollport.getBoundingClientRect().top + scrollport.clientTop + scrollport.clientHeight;
  const lowest = Math.max(...getRowElements(el).map((row) => row.getBoundingClientRect().bottom));

  return Math.round(bottom - lowest);
}
