import './content-browser-control-filter';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import { type Facet, OptionType } from '@/types/content-browser';

import type CxContentBrowserControlFilter from './content-browser-control-filter';

const colorFacet: Facet = {
  facetDetails: {
    displayName: 'Color',
    facetFieldName: 'color',
  },
  values: [
    { count: 3, displayValue: 'Red', value: 'red' },
    { count: 2, displayValue: 'Blue', value: 'blue' },
  ],
};

function getDropdown(el: CxContentBrowserControlFilter) {
  return el.shadowRoot!.querySelector('cx-dropdown');
}

function dispatchOnDropdownWithTarget(
  el: CxContentBrowserControlFilter,
  eventName: string,
  target: EventTarget,
  detail?: object,
) {
  const dropdown = getDropdown(el);
  expect(dropdown).to.exist;

  if (!(dropdown instanceof HTMLElement)) {
    expect.fail('dropdown missing');
  }

  const eventInit: CustomEventInit =
    detail === undefined
      ? { bubbles: true, composed: true }
      : { bubbles: true, composed: true, detail };
  const event = new CustomEvent(eventName, eventInit);
  Object.defineProperty(event, 'target', { configurable: true, enumerable: true, value: target });
  dropdown.dispatchEvent(event);
}

describe('content-browser-control-filter', () => {
  let el: CxContentBrowserControlFilter;

  beforeEach(async () => {
    el = await fixture(html`<cx-content-browser-control-filter></cx-content-browser-control-filter>`);
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });

    it('has default property values', () => {
      expect(el.shadowRoot).to.exist;
      expect(el.facets).to.deep.equal([]);
      expect(el.availableFacets).to.deep.equal([]);
      expect(el.selectedFacets).to.deep.equal({});
      expect(el.loading).to.be.false;
      expect(el.newlyChangedOption).to.be.undefined;
      expect(el.isMobile).to.be.false;
    });

    it('renders filter trigger with tooltip and no badge when nothing applied', () => {
      const btn = el.shadowRoot!.querySelector('[data-testid="filter-button"]');
      expect(btn).to.exist;
      expect(el.shadowRoot!.querySelector('cx-badge')).to.be.null;
    });

    it('does not render facet list when availableFacets is empty', () => {
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-filter-facet')).to.be.null;
    });
  });

  describe('with facets and selections', () => {
    beforeEach(async () => {
      el.facets = [colorFacet];
      el.availableFacets = [colorFacet.facetDetails];
      await elementUpdated(el);
      el.selectedFacets = { color: ['red'] };
      await elementUpdated(el);
    });

    it('renders facet components for available facets that exist in facets', () => {
      const facetEl = el.shadowRoot!.querySelector('cx-content-browser-control-filter-facet');
      expect(facetEl).to.exist;
      expect(facetEl).to.have.attribute('type', 'color');
      expect(facetEl).to.have.attribute('display-name', 'Color');
    });

    it('shows applied filter count in summary and badge on the trigger', () => {
      const badge = el.shadowRoot!.querySelector('[data-testid="filter-button"] cx-badge');
      expect(badge).to.exist;
      expect(badge?.textContent?.trim()).to.equal('1');
    });

    it('marks applied filter details as non-empty', () => {
      const details = el.shadowRoot!.querySelector('cx-details.filter-details');
      expect(details?.classList.contains('filter-details--empty')).to.be.false;
    });

    it('renders removable tags for applied values', () => {
      const tag = el.shadowRoot!.querySelector('cx-tag[removable][data-type="color"]');
      expect(tag).to.exist;
      expect(tag).to.have.attribute('data-value', 'red');
      expect(tag?.textContent?.includes('Red')).to.be.true;
    });

    it('emits cx-content-browser-control-filter-change with empty selection when clear all is clicked', async () => {
      const clearBtn = el.shadowRoot!.querySelector('cx-button[variant="text"]');
      expect(clearBtn).to.exist;
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');
      (clearBtn as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const evt = await evtPromise;
      expect(evt.detail.selection).to.deep.equal({});
    });

    it('emits updated selection when a tag fires cx-remove', async () => {
      el.selectedFacets = { color: ['red', 'blue'] };
      await elementUpdated(el);
      const tag = el.shadowRoot!.querySelector(
        'cx-tag[removable][data-type="color"][data-value="red"]',
      );
      expect(tag).to.exist;
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');

      if (!(tag instanceof HTMLElement)) {
        expect.fail('tag missing');
      }

      tag.dispatchEvent(new CustomEvent('cx-remove', { bubbles: true, composed: true }));
      const evt = await evtPromise;
      expect(evt.detail.selection.color).to.deep.equal(['blue']);
    });

    it('emits selection from tree when cx-selection-change bubbles from the facet tree', async () => {
      const tree = el.shadowRoot!.querySelector('cx-tree[data-facet="color"]');
      expect(tree).to.exist;
      const item = document.createElement('cx-tree-item');
      item.dataset.type = 'color';
      item.dataset.value = 'blue';
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');

      if (!(tree instanceof HTMLElement)) {
        expect.fail('tree missing');
      }

      tree.dispatchEvent(
        new CustomEvent('cx-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selection: [item] },
        }),
      );
      const evt = await evtPromise;
      expect(evt.detail.selection.color).to.deep.equal(['blue']);
      expect(evt.detail.selection).to.have.property('color');
    });

    it('initializes selection bucket when tree item type was not in selectedFacets', async () => {
      const tree = el.shadowRoot!.querySelector('cx-tree[data-facet="color"]');
      expect(tree).to.exist;
      const item = document.createElement('cx-tree-item');
      item.dataset.type = 'brand';
      item.dataset.value = 'nike';
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');

      if (!(tree instanceof HTMLElement)) {
        expect.fail('tree missing');
      }

      tree.dispatchEvent(
        new CustomEvent('cx-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selection: [item] },
        }),
      );
      const evt = await evtPromise;
      expect(evt.detail.selection.color).to.deep.equal([]);
      expect(evt.detail.selection.brand).to.deep.equal(['nike']);
    });

    it('skips tree items without data-value when building selection', async () => {
      const tree = el.shadowRoot!.querySelector('cx-tree[data-facet="color"]');
      expect(tree).to.exist;
      const item = document.createElement('cx-tree-item');
      item.dataset.type = 'color';
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');

      if (!(tree instanceof HTMLElement)) {
        expect.fail('tree missing');
      }

      tree.dispatchEvent(
        new CustomEvent('cx-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selection: [item] },
        }),
      );
      const evt = await evtPromise;
      expect(evt.detail.selection.color).to.deep.equal([]);
    });

    it('skips tree items without data-type when building selection', async () => {
      const tree = el.shadowRoot!.querySelector('cx-tree[data-facet="color"]');
      expect(tree).to.exist;
      const item = document.createElement('cx-tree-item');
      item.dataset.value = 'blue';
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');

      if (!(tree instanceof HTMLElement)) {
        expect.fail('tree missing');
      }

      tree.dispatchEvent(
        new CustomEvent('cx-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selection: [item] },
        }),
      );
      const evt = await evtPromise;
      expect(evt.detail.selection.color).to.deep.equal([]);
    });

    it('skips invalid tree items and still applies siblings with type and value', async () => {
      const tree = el.shadowRoot!.querySelector('cx-tree[data-facet="color"]');
      expect(tree).to.exist;
      const missingValue = document.createElement('cx-tree-item');
      missingValue.dataset.type = 'color';
      const valid = document.createElement('cx-tree-item');
      valid.dataset.type = 'color';
      valid.dataset.value = 'blue';
      const evtPromise = oneEvent(el, 'cx-content-browser-control-filter-change');

      if (!(tree instanceof HTMLElement)) {
        expect.fail('tree missing');
      }

      tree.dispatchEvent(
        new CustomEvent('cx-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selection: [missingValue, valid] },
        }),
      );
      const evt = await evtPromise;
      expect(evt.detail.selection.color).to.deep.equal(['blue']);
    });
  });

  describe('loading state on applied filters', () => {
    beforeEach(async () => {
      el.facets = [colorFacet];
      el.availableFacets = [colorFacet.facetDetails];
      await elementUpdated(el);
      el.selectedFacets = { color: ['red'] };
      el.loading = true;
      el.newlyChangedOption = { type: OptionType.FILTER, value: 'color' };
      await elementUpdated(el);
    });

    it('shows a spinner next to applied filters label', () => {
      const details = el.shadowRoot!.querySelector('cx-details.filter-details');
      expect(details?.querySelector('cx-spinner')).to.exist;
    });
  });

  describe('mobile layout', () => {
    beforeEach(async () => {
      el.isMobile = true;
      await elementUpdated(el);
    });

    it('sets dropdown auto-width-factor to 1', () => {
      expect(getDropdown(el)?.getAttribute('auto-width-factor')).to.equal('1');
    });
  });

  describe('available facets vs facets payload', () => {
    it('does not render a facet control when availableFacets has no matching entry in facets', async () => {
      el.facets = [colorFacet];
      el.availableFacets = [
        colorFacet.facetDetails,
        { displayName: 'Orphan', facetFieldName: 'orphan' },
      ];
      await elementUpdated(el);

      const facetEls = el.shadowRoot!.querySelectorAll('cx-content-browser-control-filter-facet');
      expect(facetEls.length).to.equal(1);
      expect(facetEls[0]).to.have.attribute('type', 'color');
    });
  });

  describe('event guards', () => {
    beforeEach(async () => {
      el.facets = [colorFacet];
      el.availableFacets = [colorFacet.facetDetails];
      await elementUpdated(el);
      el.selectedFacets = { color: ['red'] };
      await elementUpdated(el);
    });

    it('ignores cx-remove when tag has no data-value', async () => {
      let fired = false;
      el.addEventListener('cx-content-browser-control-filter-change', () => {
        fired = true;
      });
      const tag = document.createElement('cx-tag');
      tag.dataset.type = 'color';
      dispatchOnDropdownWithTarget(el, 'cx-remove', tag);
      await elementUpdated(el);
      expect(fired).to.be.false;
    });

    it('ignores cx-selection-change when target has no data-facet', async () => {
      let fired = false;
      el.addEventListener('cx-content-browser-control-filter-change', () => {
        fired = true;
      });
      const div = document.createElement('div');
      const item = document.createElement('cx-tree-item');
      item.dataset.type = 'color';
      item.dataset.value = 'blue';
      dispatchOnDropdownWithTarget(el, 'cx-selection-change', div, {
        selection: [item],
      });
      await elementUpdated(el);
      expect(fired).to.be.false;
    });
  });
});
