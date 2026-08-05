import './content-browser-control-bar';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type CxInput from '@orangelogic/design-system/components/input';

import type CxContentBrowserControlBar from './content-browser-control-bar';

function getSearchInput(el: CxContentBrowserControlBar): CxInput {
  return el.shadowRoot!.querySelector<CxInput>('cx-input.control-bar__search-input')!;
}

describe('content-browser-control-bar', () => {
  let el: CxContentBrowserControlBar;

  beforeEach(async () => {
    el = await fixture(html`<cx-content-browser-control-bar></cx-content-browser-control-bar>`);
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });

    it('has default property values', () => {
      expect(el.shadowRoot).to.exist;
      expect(el.currentCount).to.equal(0);
      expect(el.totalCount).to.equal(0);
      expect(el.sortOrderName).to.equal('');
      expect(el.sortDirection).to.equal('');
      expect(el.view).to.equal('medium');
      expect(el.views).to.deep.equal([]);
      expect(el.facets).to.deep.equal([]);
      expect(el.availableFacets).to.deep.equal([]);
      expect(el.selectedFacets).to.deep.equal({});
      expect(el.isSeeThrough).to.be.false;
      expect(el.loading).to.be.false;
      expect(el.newlyChangedOption).to.be.undefined;
    });

    it('renders search input with search icon and localized placeholder', () => {
      const input = getSearchInput(el);
      expect(input).to.exist;
      expect(input.placeholder.endsWith('...')).to.be.true;
      const icon = input.querySelector('cx-icon[name="search"]');
      expect(icon).to.exist;
    });

    it('renders filter, view mode, and sort controls', () => {
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-filter')).to.exist;
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-view')).to.exist;
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-sort')).to.exist;
    });
  });

  describe('item count label', () => {
    it('shows localized itemOfTotal for current and total counts', async () => {
      el.currentCount = 5;
      el.totalCount = 20;
      await elementUpdated(el);
      const typography = el.shadowRoot!.querySelector('cx-line-clamp cx-typography');
      expect(typography?.textContent?.replaceAll(/\s+/g, ' ').trim()).to.equal('5 of 20');
    });
  });

  describe('props forwarded to child controls', () => {
    it('passes view to cx-content-browser-control-view', async () => {
      el.view = 'large';
      await elementUpdated(el);
      const viewCtl = el.shadowRoot!.querySelector('cx-content-browser-control-view');
      expect(viewCtl).to.have.attribute('view', 'large');
    });

    it('passes sort-order-name and sort-direction to cx-content-browser-control-sort', async () => {
      el.sortOrderName = 'name';
      el.sortDirection = 'ascending';
      await elementUpdated(el);
      const sortCtl = el.shadowRoot!.querySelector('cx-content-browser-control-sort');
      expect(sortCtl).to.have.attribute('sort-order-name', 'name');
      expect(sortCtl).to.have.attribute('sort-direction', 'ascending');
    });

    it('passes loading to filter and sort', async () => {
      el.loading = true;
      await elementUpdated(el);
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-filter')).to.have.attribute('loading');
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-sort')).to.have.attribute('loading');
    });

    it('passes is-see-through to view control', async () => {
      el.isSeeThrough = true;
      await elementUpdated(el);
      expect(el.shadowRoot!.querySelector('cx-content-browser-control-view')).to.have.attribute(
        'is-see-through',
      );
    });
  });

  describe('cx-content-browser-control-bar-search-change', () => {
    it('emits with searchText when cx-input fires cx-change', async () => {
      const input = getSearchInput(el);
      input.value = 'asset query';
      await elementUpdated(input);

      const evtPromise = oneEvent(el, 'cx-content-browser-control-bar-search-change');
      input.dispatchEvent(
        new CustomEvent('cx-change', { bubbles: true, composed: true }),
      );
      const evt = await evtPromise;

      expect(evt.detail.searchText).to.equal('asset query');
      await elementUpdated(el);
      expect(getSearchInput(el).value).to.equal('asset query');
    });
  });
});
