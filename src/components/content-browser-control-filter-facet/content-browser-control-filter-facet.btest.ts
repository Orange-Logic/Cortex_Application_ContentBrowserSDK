import './content-browser-control-filter-facet';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import type CxContentBrowserControlFilterFacet from './content-browser-control-filter-facet';

describe('content-browser-control-filter-facet', () => {
  let el: CxContentBrowserControlFilterFacet;

  beforeEach(async () => {
    el = await fixture(
      html`<cx-content-browser-control-filter-facet></cx-content-browser-control-filter-facet>`,
    );
  });

  describe('initial state', () => {
    it('is accessible with display name and flat values', async () => {
      el.displayName = 'Facet';
      el.type = 'kind';
      el.values = [{ count: 1, displayValue: 'A', value: 'a' }];
      await elementUpdated(el);
      await expect(el).to.be.accessible();
    });

    it('uses light DOM (no shadow root)', () => {
      expect(el.shadowRoot).to.be.null;
    });

    it('has default property values', () => {
      expect(el.loading).to.be.false;
      expect(el.displayName).to.equal('');
      expect(el.type).to.equal('');
      expect(el.values).to.deep.equal([]);
      expect(el.collections).to.deep.equal([]);
    });
  });

  describe('summary', () => {
    beforeEach(async () => {
      el.displayName = 'Color';
      el.type = 'color';
      el.values = [{ count: 2, displayValue: 'Red', value: 'red' }];
      await elementUpdated(el);
      await elementUpdated(el);
    });

    it('renders display name in the details summary', () => {
      const typo = el.querySelector('cx-details cx-typography');
      expect(typo?.textContent?.trim()).to.equal('Color');
    });

    it('shows a spinner in the summary when loading', async () => {
      el.loading = true;
      await elementUpdated(el);
      expect(el.querySelector('cx-details cx-spinner')).to.exist;
    });
  });

  describe('flat facet values', () => {
    beforeEach(async () => {
      el.displayName = 'Status';
      el.type = 'status';
      el.values = [
        { count: 3, displayValue: 'Active', value: 'active' },
        { count: 1, displayValue: 'Archived', value: 'archived' },
      ];
      await elementUpdated(el);
      await elementUpdated(el);
    });

    it('renders a tree item per top-level value', () => {
      const items = el.querySelectorAll('cx-tree > cx-tree-item');
      expect(items.length).to.equal(2);
    });

    it('marks tree items as selected when collections includes the value', async () => {
      el.collections = ['active'];
      await elementUpdated(el);
      const active = el.querySelector('cx-tree-item[data-value="active"]');
      expect(active).to.exist;
      expect(active).to.have.attribute('selected');
    });

    it('sets readonly on tree items when loading', async () => {
      el.loading = true;
      await elementUpdated(el);
      const items = el.querySelectorAll('cx-tree-item');
      expect(items.length).to.be.greaterThan(0);
      items.forEach((item) => {
        expect(item).to.have.attribute('readonly');
      });
    });
  });

  describe('hierarchical values (parent>>subtype)', () => {
    beforeEach(async () => {
      el.displayName = 'Folder';
      el.type = 'folder';
      el.values = [
        { count: 2, displayValue: 'Docs', value: 'docs' },
        { count: 1, displayValue: 'PDF', value: 'docs>>pdf' },
      ];
      await elementUpdated(el);
      await elementUpdated(el);
    });

    it('renders a parent row with nested subtype items', () => {
      const parent = el.querySelector('cx-tree-item[data-value="docs"]');
      expect(parent).to.exist;
      const child = el.querySelector('cx-tree-item[data-value="docs>>pdf"]');
      expect(child).to.exist;
      expect(child?.textContent?.includes('PDF')).to.be.true;
    });

    it('selects nested item when collections includes the composed value', async () => {
      el.collections = ['docs>>pdf'];
      await elementUpdated(el);
      const child = el.querySelector('cx-tree-item[data-value="docs>>pdf"]');
      expect(child).to.have.attribute('selected');
    });
  });

  describe('implicit parent display name (no facet row for parent key)', () => {
    it('title-cases the parent segment when only a child value is provided', async () => {
      el.displayName = 'Files';
      el.type = 'file';
      el.values = [{ count: 1, displayValue: 'Portable', value: 'documents>>pdf' }];
      await elementUpdated(el);
      await elementUpdated(el);
      const parent = el.querySelector('cx-tree-item[data-value="documents"]');
      expect(parent).to.exist;
      expect(parent?.textContent?.replaceAll(/\s+/g, ' ')).to.contain('Documents (');
      const child = el.querySelector('cx-tree-item[data-value="documents>>pdf"]');
      expect(child?.textContent?.includes('Portable')).to.be.true;
    });

    it('title-cases each word when the implicit parent key contains spaces', async () => {
      el.displayName = 'Tree';
      el.type = 'tree';
      el.values = [{ count: 2, displayValue: 'Leaf node', value: 'my folder>>leaf' }];
      await elementUpdated(el);
      await elementUpdated(el);
      const parent = el.querySelector('cx-tree-item[data-value="my folder"]');
      expect(parent).to.exist;
      expect(parent?.textContent?.replaceAll(/\s+/g, ' ')).to.contain('My Folder (');
    });
  });

  describe('load more', () => {
    beforeEach(async () => {
      el.displayName = 'Many';
      el.type = 'many';
      el.values = Array.from({ length: 11 }, (_, i) => ({
        count: 1,
        displayValue: `Item ${i}`,
        value: `k${i}`,
      }));
      await elementUpdated(el);
      await elementUpdated(el);
    });

    it('shows more button when there are more than ten top-level keys', () => {
      expect(el.querySelector('cx-tree cx-button[variant="text"]')).to.exist;
    });

    it('increases visible items after load more is clicked', async () => {
      const initialCount = el.querySelectorAll('cx-tree > cx-tree-item').length;
      expect(initialCount).to.equal(10);
      const moreBtn = el.querySelector('cx-tree cx-button[variant="text"]');
      expect(moreBtn).to.exist;
      (moreBtn as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await elementUpdated(el);
      expect(el.querySelectorAll('cx-tree > cx-tree-item').length).to.equal(11);
    });
  });
});
