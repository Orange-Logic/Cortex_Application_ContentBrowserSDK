import './content-browser-table';

import { elementUpdated, expect, html, waitUntil } from '@open-wc/testing';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
import sinon from 'sinon';

import { toTableRowActionPosition } from '@/types/content-browser';

import {
  centerOf,
  dragToMinimum,
  getColumnWidth,
  getCta,
  getCtaOverlay,
  getCxTable,
  getDataCells,
  getInnerWidth,
  getResizeHandles,
  getRowElements,
  getScrollport,
  getTableRoot,
  isShown,
  makeAssets,
  mount,
  settle,
  SINGLE_LINE_COLUMNS,
  stubInputQueries,
} from './content-browser-table.test-helpers';

import type ContentBrowserTable from './content-browser-table';

const LONG_SNIPPET = 'x'.repeat(400);

function expectFrameAtDataEdge(el: ContentBrowserTable) {
  const data = getDataCells(getRowElements(el)[0]).filter((cell) => cell.getClientRects().length > 0);
  const right = data[data.length - 1].getBoundingClientRect().right;
  const header = getTableRoot(el).querySelector('.tabulator-header')!.getBoundingClientRect();
  const frame = getScrollport(el).parentElement!;
  const border = getComputedStyle(frame, '::before');

  expect(header.right - right, 'the final resize handle has no narrow buffer').to.be.within(4, 8);
  expect(frame.getBoundingClientRect().left + Number.parseFloat(border.width),
    'the frame does not follow the header edge').to.be.closeTo(header.right, 1);
}

describe('content-browser-table row action', () => {
  beforeEach(() => {
    stubInputQueries();
  });

  afterEach(async () => {
    await resetMouse();
    sinon.restore();
  });

  it('uses the full width for data without an action header or reserved action space', async () => {
    // A long value gives the last column the space that is left, so the data reaches the table edge.
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 700px"
        cta-text="Open In New Tab"
        .assets=${makeAssets(2).map((asset) => ({ ...asset, 'Dell.Snippet': LONG_SNIPPET }))}
        .columns=${SINGLE_LINE_COLUMNS}
      ></cx-content-browser-table>
    `, 2);
    const row = getRowElements(el)[0];
    const data = getDataCells(row);
    const scrollport = getScrollport(el);
    const right = scrollport.getBoundingClientRect().left + scrollport.clientWidth;

    expect(right - data[data.length - 1].getBoundingClientRect().right).to.be.within(4, 8);
    expect(getTableRoot(el).querySelector('.tabulator-col[tabulator-field="cta"]')).to.equal(null);

    const widths = data.map((cell) => cell.getBoundingClientRect().width);

    await sendMouse({ position: centerOf(data[0]), type: 'move' });
    await waitUntil(async () => isShown(await getCta(row)));

    expect(data.map((cell) => cell.getBoundingClientRect().width)).to.deep.equal(widths);
  });

  it('leaves empty space after the last column shrinks without another visible column', async () => {
    // The spare width stays empty only when every column has a width the user set.
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 700px; --cx-input-border-width: 1px; --cx-color-neutral-200: rgb(100, 100, 100)"
        .assets=${makeAssets(2)}
        .columns=${SINGLE_LINE_COLUMNS}
        .savedWidths=${{ 'CoreField.Identifier': 160 }}
      ></cx-content-browser-table>
    `, 2);
    const identifier = Math.round(getColumnWidth(el, 0));
    const resized = await dragToMinimum(el, 1);

    await settle();

    const headers = [...getTableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col')];
    const visibleHeaders = headers.filter((header) => getComputedStyle(header).opacity !== '0'
      && header.getBoundingClientRect().width > 0);

    expect(visibleHeaders.length, 'the empty space appears as another column').to.equal(SINGLE_LINE_COLUMNS.length);
    expect(getColumnWidth(el, 1)).to.equal(resized.width);

    const row = getRowElements(el)[0];
    const data = getDataCells(row);
    const last = data[data.length - 1].getBoundingClientRect();
    const box = row.getBoundingClientRect();
    const header = getTableRoot(el).querySelector('.tabulator-header')!.getBoundingClientRect();
    const frame = getScrollport(el).parentElement!;
    const border = getComputedStyle(frame, '::before');

    expect(header.right - last.right, 'the header extends across the empty space').to.be.within(4, 8);
    expect(frame.getBoundingClientRect().left + Number.parseFloat(border.width),
      'the table frame extends across the empty space').to.be.closeTo(header.right, 1);
    expect(border.borderRightStyle, 'the table has no right border').to.equal('solid');
    expect(Number.parseFloat(border.borderRightWidth), 'the table has no right border').to.equal(1);
    expect(box.right - last.right).to.be.greaterThan(200);
    await sendMouse({ position: [Math.round(last.right + 100), Math.round(box.top + box.height / 2)], type: 'move' });
    await waitUntil(async () => isShown(await getCta(row)));

    const action = (await getCta(row))!.getBoundingClientRect();

    expect(box.right - action.right).to.be.within(0, 20);
    expect(data.map((cell) => cell.getBoundingClientRect().width)).to.deep.equal([identifier, resized.width]);
  });

  it('can align the action with the table edge through one layout setting', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px; width: 700px"
        .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `, 2);

    await dragToMinimum(el, 1);
    await settle();
    getCxTable(el)!.style.setProperty('--content-browser-action-boundary', 'var(--content-browser-table-width)');

    const row = getRowElements(el)[0];
    const data = getDataCells(row);

    await sendMouse({ position: centerOf(data[0]), type: 'move' });
    await waitUntil(async () => isShown(await getCta(row)));

    const action = (await getCta(row))!.getBoundingClientRect();
    const last = data[data.length - 1].getBoundingClientRect();

    expect(last.right - action.right).to.be.within(0, 20);
  });

  it('moves the header and body frame during a drag in both directions before mouse release', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px; width: 700px"
        .assets=${makeAssets(2)} .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `, 2);
    const handle = getResizeHandles(el)[1];
    const { left, top, width } = handle.getBoundingClientRect();
    const startX = left + width / 2;
    const init = { bubbles: true, button: 0, clientY: top + 1, composed: true };

    handle.dispatchEvent(new MouseEvent('mousedown', { ...init, clientX: startX }));
    try {
      for (const delta of [-300, -150]) {
        document.body.dispatchEvent(new MouseEvent('mousemove', { ...init, clientX: startX + delta }));
        await settle(50);
        expectFrameAtDataEdge(el);
      }
    } finally {
      document.body.dispatchEvent(new MouseEvent('mouseup', { ...init, clientX: startX - 150 }));
    }
  });

  it('moves the frame after a data column hide and show', async () => {
    const el = await mount(html`
      <cx-content-browser-table style="height: 400px; width: 700px"
        .assets=${makeAssets(2)} .columns=${[
          { field: 'CoreField.Identifier', title: 'Identifier' },
          { field: 'Dell.Snippet', title: 'Description' },
        ]}></cx-content-browser-table>
    `, 2);

    for (const fields of [['Dell.Snippet'], []]) {
      el.hiddenFields = fields;
      await elementUpdated(el);
      await settle(50);
      expectFrameAtDataEdge(el);
    }
  });

  it('keeps the vertical scrollbar narrow and the last resize handle accessible', async () => {
    // A long value gives the last column the space that is left, so it ends at the resize buffer.
    const el = await mount(html`
      <cx-content-browser-table style="height: 300px; width: 700px"
        .assets=${makeAssets(30).map((asset) => ({ ...asset, 'Dell.Snippet': LONG_SNIPPET }))}
        .columns=${SINGLE_LINE_COLUMNS}></cx-content-browser-table>
    `, 30);
    const scrollport = getScrollport(el);
    const classicScrollbar = document.createElement('style');

    classicScrollbar.textContent = '.tabulator-tableholder { scrollbar-gutter: stable; }';
    getTableRoot(el).append(classicScrollbar);
    getCxTable(el)!.tabulatorInstance!.redraw(true);
    await settle();

    expect(scrollport.scrollHeight).to.be.greaterThan(scrollport.clientHeight);
    expect(scrollport.offsetWidth - scrollport.clientWidth, 'the scrollbar looks like another column').to.be.at.most(12);
    const right = getDataCells(getRowElements(el)[0]).at(-1)!.getBoundingClientRect().right;
    const gap = scrollport.getBoundingClientRect().left + getInnerWidth(el) - right;

    expect(gap, 'the final column leaves more than a narrow resize buffer').to.be.within(4, 8);
    const handle = getResizeHandles(el)[1];
    const box = handle.getBoundingClientRect();
    const hit = getTableRoot(el).elementFromPoint(Math.round(box.left + 1), Math.round(box.top + box.height / 2));

    expect(hit, 'the final resize handle is inaccessible').to.equal(handle);
  });

  it('highlights only the hovered cell and leaves the row and blank space unhighlighted', async () => {
    // Saved widths for every column leave blank space after the last column.
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 700px; --cx-color-neutral-0: white; --cx-color-neutral-50: rgb(210, 230, 250)"
        .assets=${makeAssets(2)}
        .columns=${[
          { field: 'CoreField.Identifier', title: 'Identifier' },
          { field: 'Dell.Snippet', title: 'Description' },
        ]}
        .savedWidths=${{ 'CoreField.Identifier': 150, 'Dell.Snippet': 150 }}
      ></cx-content-browser-table>
    `, 2);
    const row = getRowElements(el)[0];
    const cell = getDataCells(row)[0];
    const otherCell = getDataCells(row)[1];

    expect(getComputedStyle(row).backgroundColor).to.equal('rgb(255, 255, 255)');

    await sendMouse({ position: centerOf(cell), type: 'move' });

    expect(getComputedStyle(row).backgroundColor).to.equal('rgb(255, 255, 255)');
    expect(getComputedStyle(cell).backgroundColor).to.equal('rgb(210, 230, 250)');
    expect(getComputedStyle(otherCell).backgroundColor).to.equal('rgba(0, 0, 0, 0)');

    const box = row.getBoundingClientRect();

    await sendMouse({ position: [Math.round(box.left + 400), Math.round(box.top + box.height / 2)], type: 'move' });

    expect(getComputedStyle(row).backgroundColor).to.equal('rgb(255, 255, 255)');
    expect(getComputedStyle(cell).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(otherCell).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
    expect(isShown(await getCta(row))).to.equal(true);

    await sendMouse({ position: [0, 0], type: 'move' });

    expect(getComputedStyle(row).backgroundColor).not.to.equal('rgb(210, 230, 250)');
    expect(isShown(await getCta(row))).to.equal(false);
  });

  describe('row action position', () => {
    async function hoverFirstRow(position?: string) {
      // Saved widths for every column end the rows before the host edge.
      const el = await mount(html`
        <cx-content-browser-table
          style="height: 400px; width: 1000px"
          row-action-position=${position ?? 'host-edge'}
          .assets=${makeAssets(2)}
          .columns=${SINGLE_LINE_COLUMNS}
          .savedWidths=${{ 'CoreField.Identifier': 160, 'Dell.Snippet': 200 }}
        ></cx-content-browser-table>
      `, 2);

      await settle(200);

      const row = getRowElements(el)[0];

      await sendMouse({ position: centerOf(getDataCells(row)[0]), type: 'move' });
      await waitUntil(async () => isShown(await getCta(row)), 'the hovered row never showed its CTA',
        { interval: 20, timeout: 3000 });

      return { el, row };
    }

    it('shows the action at the right edge of the host by default', async () => {
      const { el, row } = await hoverFirstRow();
      const scrollport = getScrollport(el);
      const right = scrollport.getBoundingClientRect().left + scrollport.clientLeft + scrollport.clientWidth;

      expect(el.rowActionPosition).to.equal('host-edge');
      expect(getCtaOverlay(row)!.getBoundingClientRect().right).to.be.closeTo(right, 10);
    });

    it('shows the action at the end of the row for row-end', async () => {
      const { el, row } = await hoverFirstRow('row-end');
      const data = getDataCells(row);
      const last = data[data.length - 1].getBoundingClientRect().right;
      const scrollport = getScrollport(el);
      const edge = scrollport.getBoundingClientRect().left + scrollport.clientWidth;

      expect(edge - last, 'the short values reach the host edge').to.be.greaterThan(100);
      expect(getCtaOverlay(row)!.getBoundingClientRect().right).to.be.closeTo(last, 10);
    });
  });

  describe('toTableRowActionPosition', () => {
    it('keeps row-end', () => {
      expect(toTableRowActionPosition('row-end')).to.equal('row-end');
    });

    it('gives host-edge for any other value', () => {
      ['host-edge', undefined, 'left', 42].forEach((value) => {
        expect(toTableRowActionPosition(value), String(value)).to.equal('host-edge');
      });
    });
  });

  it('keeps the action at the visible right edge after horizontal scroll and a container resize', async () => {
    const el = await mount(html`
      <cx-content-browser-table
        style="height: 400px; width: 500px"
        cta-text="Open In New Tab"
        .assets=${makeAssets(2)}
        .columns=${[
          { field: 'CoreField.Identifier', title: 'Identifier' },
          { field: 'Dell.Snippet', title: 'Description' },
        ]}
        .savedWidths=${{ 'CoreField.Identifier': 600, 'Dell.Snippet': 600 }}
      ></cx-content-browser-table>
    `, 2);
    const row = getRowElements(el)[0];
    const scrollport = getScrollport(el);
    const cta = (await getCta(row))!;
    const rowBox = row.getBoundingClientRect();

    await sendMouse({ position: [Math.round(rowBox.left + 40), Math.round(rowBox.top + rowBox.height / 2)], type: 'move' });

    const expectRightEdge = () => {
      const button = cta.getBoundingClientRect();
      const view = scrollport.getBoundingClientRect();
      const gap = view.left + scrollport.clientWidth - button.right;

      expect(gap, 'the action leaves the visible right edge').to.be.within(0, 20);
      expect(button.left, 'the action leaves the viewport').to.be.at.least(view.left);
      expect(isShown(cta)).to.equal(true);
    };

    expectRightEdge();
    scrollport.scrollLeft = 350;
    await waitUntil(() => scrollport.scrollLeft === 350);
    expectRightEdge();

    el.style.width = '400px';
    await elementUpdated(el);
    await waitUntil(() => scrollport.clientWidth <= 400);
    expectRightEdge();
  });
});
