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
  CTA_FIELD,
  FILLER_FIELD,
} from './content-browser-table';

export type CxTable = HTMLElementTagNameMap['cx-table'];

export type Cta = HTMLElement & { loading: boolean; updateComplete: Promise<unknown> };

export const COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
  { align: 'right', field: 'Dell.Snippet', lines: 2, title: 'Snippet' },
];

export const SINGLE_LINE_COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
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

/** Matches the columns the component adds to the host's: the filler and the CTA column. */
export const OWN_FIELDS = `[tabulator-field="${FILLER_FIELD}"], [tabulator-field="${CTA_FIELD}"]`;

/** The host's column headers: the filler's and the CTA column's are left out. */
export function getHeaderTitles(el: ContentBrowserTable) {
  return [...getTableRoot(el).querySelectorAll<HTMLElement>(`.tabulator-col:not(${OWN_FIELDS}) .tabulator-col-title`)]
    .map((title) => title.textContent?.trim() ?? '');
}

/** A row's cells for the host's columns: the filler cell and the CTA cell are left out. */
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
function fakeMediaQuery(media: string) {
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
 * Stands in for the input queries that make the table show every CTA at rest, none of them matched
 * at first: a touch screen on the machine that runs the tests matches `(any-pointer: coarse)`, and
 * a CTA check would then pass with the hover or focus reveal broken. Install it once per test,
 * before the table connects: `sinon.restore()` takes it off.
 */
export function stubInputQueries() {
  const matchMedia = window.matchMedia.bind(window);
  const queries = new Map(['(hover: none)', '(any-pointer: coarse)'].map((media) => [media, fakeMediaQuery(media)] as const));

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

/**
 * The CTA column is fitted to its button once a row renders one: the button then fills its cell's
 * content box, and is cut by neither edge of its cell.
 */
export function isCtaColumnFitted(cta: Cta | undefined) {
  const parent = cta?.parentElement;
  const cell = cta?.closest<HTMLElement>('.tabulator-cell');

  if (!cta || !parent || !cell) {
    return false;
  }

  const style = getComputedStyle(parent);
  const content = parent.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
  const button = cta.getBoundingClientRect();
  const box = cell.getBoundingClientRect();

  return Math.abs(content - button.width) <= 1 && button.left >= box.left - 0.5 && button.right <= box.right + 0.5;
}

export async function waitForCtaColumnFit(el: ContentBrowserTable) {
  await waitUntil(async () => isCtaColumnFitted(await getCta(getRowElements(el)[0])),
    'the CTA column was never fitted to its button', { interval: 20, timeout: 3000 });
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

export function resizeObserverEntry(container: HTMLDivElement, height: number) {
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

export function getCtaColumnWidth(el: ContentBrowserTable) {
  return getColumnHeader(el, CTA_FIELD).getBoundingClientRect().width;
}

/** Every column's laid-out width added up, the filler's and the CTA column's included. */
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

export function isFilled(el: ContentBrowserTable) {
  return Math.abs(getColumnsTotal(el) - getInnerWidth(el)) <= 1;
}

/** The layout settles once a redraw runs after the change: wait for the fill, and report the widths if it never came. */
export async function expectFilled(el: ContentBrowserTable, when: string) {
  await waitUntil(() => isFilled(el), '', { interval: 20, timeout: 2000 }).catch(() => undefined);

  const total = Math.round(getColumnsTotal(el));
  const inner = getInnerWidth(el);

  expect(Math.abs(total - inner) <= 1, `${when}, the columns take ${total}px of a ${inner}px table`).to.equal(true);
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
