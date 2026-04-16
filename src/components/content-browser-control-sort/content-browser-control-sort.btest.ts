import './content-browser-control-sort';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type CxMenuItem from '@orangelogic/design-system/components/menu-item';
import { OptionType, type SortOrder } from '@/types/content-browser';

import type CxContentBrowserControlSort from './content-browser-control-sort';

function baseSortOrder(
  overrides: Pick<
    SortOrder,
    | 'id'
    | 'name'
    | 'sortDirection'
    | 'sortDirectionDisplayName'
    | 'sortDirectionGroupKey'
  > &
    Partial<SortOrder>,
): SortOrder {
  return {
    description: '',
    legacyValue: '',
    sortType: 'test',
    ...overrides,
  };
}

const defaultSortOrders: Record<string, SortOrder[]> = {
  date: [
    baseSortOrder({
      id: 'date-asc',
      name: 'Date',
      sortDirection: 'ascending',
      sortDirectionDisplayName: 'Oldest',
      sortDirectionGroupKey: 'date',
    }),
    baseSortOrder({
      id: 'date-desc',
      name: 'Date',
      sortDirection: 'descending',
      sortDirectionDisplayName: 'Newest',
      sortDirectionGroupKey: 'date',
    }),
  ],
  name: [
    baseSortOrder({
      id: 'name-asc',
      name: 'Name',
      sortDirection: 'ascending',
      sortDirectionDisplayName: 'A–Z',
      sortDirectionGroupKey: 'name',
    }),
    baseSortOrder({
      id: 'name-desc',
      name: 'Name',
      sortDirection: 'descending',
      sortDirectionDisplayName: 'Z–A',
      sortDirectionGroupKey: 'name',
    }),
  ],
};

function getDropdown(el: CxContentBrowserControlSort) {
  return el.shadowRoot!.querySelector('cx-dropdown')!;
}

function getMenuItems(el: CxContentBrowserControlSort) {
  return [...getDropdown(el).querySelectorAll('cx-menu-item')] as CxMenuItem[];
}

function findMenuItem(el: CxContentBrowserControlSort, match: (item: CxMenuItem) => boolean) {
  const found = getMenuItems(el).find(match);
  expect(found, 'expected menu item').to.exist;

  return found!;
}

async function dispatchSelectOnDropdown(el: CxContentBrowserControlSort, item: CxMenuItem) {
  getDropdown(el).dispatchEvent(
    new CustomEvent('cx-select', {
      bubbles: true,
      composed: true,
      detail: { item },
    }),
  );
  await elementUpdated(el);
}

describe('content-browser-control-sort', () => {
  let el: CxContentBrowserControlSort;

  beforeEach(async () => {
    el = await fixture(html`<cx-content-browser-control-sort></cx-content-browser-control-sort>`);
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });

    it('has default property values', () => {
      expect(el.shadowRoot).to.exist;
      expect(el.sortOrderName).to.equal('');
      expect(el.sortDirection).to.equal('');
      expect(el.sortOrders).to.deep.equal({});
      expect(el.loading).to.be.false;
      expect(el.isMobile).to.be.false;
      expect(el.newlyChangedOption).to.be.undefined;
    });

    it('renders a sort trigger with icon button inside dropdown', () => {
      const dropdown = getDropdown(el);
      expect(dropdown).to.exist;
      expect(dropdown.getAttribute('distance')).to.equal('4');
      const trigger = dropdown.querySelector('[slot="trigger"] cx-icon-button');
      expect(trigger).to.exist;
      expect(trigger).to.have.attribute('name', 'sort');
    });
  });

  describe('with sort orders and current sort selection', () => {
    beforeEach(async () => {
      el.sortOrders = defaultSortOrders;
      el.sortOrderName = 'name';
      el.sortDirection = 'ascending';
      await el.updateComplete;
      await el.updateComplete;
    });

    it('enables direction menu items when the group has more than one option', () => {
      const ascending = findMenuItem(
        el,
        (item) =>
          item.dataset.type === 'sort-direction' && item.value === 'ascending',
      );
      const descending = findMenuItem(
        el,
        (item) =>
          item.dataset.type === 'sort-direction' && item.value === 'descending',
      );
      expect(ascending.disabled).to.be.false;
      expect(descending.disabled).to.be.false;
    });

    it('renders a sort-order item per group key', () => {
      const orderItems = getMenuItems(el).filter(
        (item) => item.dataset.type === 'sort-order',
      );
      expect(
        orderItems.map((i) => i.value).sort((a, b) => a.localeCompare(b)),
      ).to.deep.equal(['date', 'name']);
    });

    it('emits cx-content-browser-control-sort-order-change when sort direction is selected', async () => {
      const descending = findMenuItem(
        el,
        (item) =>
          item.dataset.type === 'sort-direction' && item.value === 'descending',
      );
      const evtPromise = oneEvent(el, 'cx-content-browser-control-sort-order-change');
      await dispatchSelectOnDropdown(el, descending);
      const evt = await evtPromise;
      expect(evt.detail.sortDirection).to.equal('descending');
      expect(evt.detail.sortOrderName).to.equal('name');
    });

    it('emits cx-content-browser-control-sort-order-change when sort order group is selected', async () => {
      const dateItem = findMenuItem(
        el,
        (item) => item.dataset.type === 'sort-order' && item.value === 'date',
      );
      const evtPromise = oneEvent(el, 'cx-content-browser-control-sort-order-change');
      await dispatchSelectOnDropdown(el, dateItem);
      const evt = await evtPromise;
      expect(evt.detail.sortOrderName).to.equal('date');
      expect(evt.detail.sortDirection).to.equal('ascending');
    });

    it('shows a spinner on the matching direction item while loading that change', async () => {
      el.loading = true;
      el.newlyChangedOption = {
        type: OptionType.SORT_DIRECTION as any,
        value: 'ascending',
      };
      await elementUpdated(el);
      const ascending = findMenuItem(
        el,
        (item) =>
          item.dataset.type === 'sort-direction' && item.value === 'ascending',
      );
      expect(ascending.querySelector('cx-spinner')).to.exist;
    });
  });

  describe('when a group has only one sort option', () => {
    beforeEach(async () => {
      el.sortOrders = {
        name: [
          baseSortOrder({
            id: 'name-asc',
            name: 'Name',
            sortDirection: 'ascending',
            sortDirectionDisplayName: 'A–Z',
            sortDirectionGroupKey: 'name',
          }),
        ],
      };
      el.sortOrderName = 'name';
      el.sortDirection = 'ascending';
      await el.updateComplete;
      await el.updateComplete;
    });

    it('disables direction menu items', () => {
      const ascending = findMenuItem(
        el,
        (item) =>
          item.dataset.type === 'sort-direction' && item.value === 'ascending',
      );
      expect(ascending.disabled).to.be.true;
    });
  });

  describe('mobile layout', () => {
    beforeEach(async () => {
      el.isMobile = true;
      await elementUpdated(el);
    });

    it('sets dropdown auto-width-factor to 1', () => {
      const dropdown = getDropdown(el);
      expect(dropdown.getAttribute('auto-width-factor')).to.equal('1');
    });
  });

  describe('handleSortSelect guard', () => {
    beforeEach(async () => {
      el.sortOrders = defaultSortOrders;
      el.sortOrderName = 'name';
      el.sortDirection = 'ascending';
      await el.updateComplete;
      await el.updateComplete;
    });

    it('does not emit when selection detail is incomplete', async () => {
      let fired = false;
      el.addEventListener('cx-content-browser-control-sort-order-change', () => {
        fired = true;
      });
      const broken = document.createElement('cx-menu-item') as CxMenuItem;
      broken.value = '';
      broken.dataset.type = 'sort-direction';
      await dispatchSelectOnDropdown(el, broken);
      expect(fired).to.be.false;
    });
  });
});
