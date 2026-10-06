import './content-browser-control-view';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type CxMenuItem from '@orangelogic/design-system/components/menu-item';
import { GridView, TABLE_VIEW, type ControlOption } from '@/types/content-browser';

import type CxContentBrowserControlView from './content-browser-control-view';

const sampleViews: ControlOption[] = [
  { label: 'Large', value: 'large' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
];

function getDropdown(el: CxContentBrowserControlView) {
  return el.shadowRoot!.querySelector('cx-dropdown')!;
}

function getMenuItems(el: CxContentBrowserControlView) {
  return [...getDropdown(el).querySelectorAll('cx-menu-item')] as CxMenuItem[];
}

function findMenuItem(el: CxContentBrowserControlView, match: (item: CxMenuItem) => boolean) {
  const found = getMenuItems(el).find(match);
  expect(found, 'expected menu item').to.exist;

  return found!;
}

async function dispatchSelectOnDropdown(el: CxContentBrowserControlView, item: CxMenuItem) {
  getDropdown(el).dispatchEvent(
    new CustomEvent('cx-select', {
      bubbles: true,
      composed: true,
      detail: { item },
    }),
  );
  await elementUpdated(el);
}

/** `handleViewChange` is @watch('view') only; nudge `view` after `views` so `selectedView` syncs. */
async function setViewsAndView(
  el: CxContentBrowserControlView,
  views: ControlOption[],
  targetView: string,
) {
  el.views = views;
  await elementUpdated(el);
  el.view = targetView === 'medium' ? GridView.Large : GridView.Medium;
  await elementUpdated(el);
  el.view = targetView as GridView;
  await elementUpdated(el);
}

describe('content-browser-control-view', () => {
  let el: CxContentBrowserControlView;

  beforeEach(async () => {
    el = await fixture(html`<cx-content-browser-control-view></cx-content-browser-control-view>`);
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });

    it('has default property values', () => {
      expect(el.shadowRoot).to.exist;
      expect(el.view).to.equal('medium');
      expect(el.views).to.deep.equal([]);
      expect(el.isSeeThrough).to.be.false;
      expect(el.isMobile).to.be.false;
    });

    it('renders a view trigger with dashboard icon button inside dropdown', () => {
      const dropdown = getDropdown(el);
      expect(dropdown).to.exist;
      expect(dropdown.getAttribute('distance')).to.equal('4');
      const trigger = dropdown.querySelector('[slot="trigger"] cx-icon-button');
      expect(trigger).to.exist;
      expect(trigger).to.have.attribute('name', 'dashboard');
    });
  });

  describe('selected view state', () => {
    beforeEach(async () => {
      await setViewsAndView(el, sampleViews, 'medium');
    });

    it('checks the menu item for the active view in the submenu', () => {
      const medium = findMenuItem(el, (item) => item.value === 'medium');
      expect(medium.checked).to.be.true;
    });
  });

  describe('cx-content-browser-control-view-change', () => {
    beforeEach(async () => {
      el.isSeeThrough = false;
      await setViewsAndView(el, sampleViews, 'medium');
    });

    it('emits new view and preserves isSeeThrough when a grid size is selected', async () => {
      const large = findMenuItem(el, (item) => item.value === 'large');
      const evtPromise = oneEvent(el, 'cx-content-browser-control-view-change');
      await dispatchSelectOnDropdown(el, large);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('large');
      expect(evt.detail.isSeeThrough).to.be.false;
    });

    it('toggles isSeeThrough and preserves view when see-thru row is selected', async () => {
      const seeThru = findMenuItem(el, (item) => item.value === 'see-thru');
      const evtPromise = oneEvent(el, 'cx-content-browser-control-view-change');
      await dispatchSelectOnDropdown(el, seeThru);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('medium');
      expect(evt.detail.isSeeThrough).to.be.true;
    });

    it('toggles isSeeThrough off when already on', async () => {
      el.isSeeThrough = true;
      await elementUpdated(el);
      const seeThru = findMenuItem(el, (item) => item.value === 'see-thru');
      const evtPromise = oneEvent(el, 'cx-content-browser-control-view-change');
      await dispatchSelectOnDropdown(el, seeThru);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('medium');
      expect(evt.detail.isSeeThrough).to.be.false;
    });
  });

  describe('handleViewSelect guard', () => {
    beforeEach(async () => {
      await setViewsAndView(el, sampleViews, 'medium');
    });

    it('does not emit when menu item has no value', async () => {
      let fired = false;
      el.addEventListener('cx-content-browser-control-view-change', () => {
        fired = true;
      });
      const broken = await fixture<CxMenuItem>(html`<cx-menu-item></cx-menu-item>`);
      broken.value = '';
      await elementUpdated(broken);
      await dispatchSelectOnDropdown(el, broken);
      expect(fired).to.be.false;
    });
  });

  describe('see-through switch', () => {
    beforeEach(async () => {
      await setViewsAndView(el, sampleViews, 'medium');
    });

    it('prevents default on switch click to avoid closing the menu', () => {
      const seeThru = findMenuItem(el, (item) => item.value === 'see-thru');
      const switchEl = seeThru.querySelector('cx-switch');
      expect(switchEl).to.exist;

      if (!(switchEl instanceof HTMLElement)) {
        expect.fail('cx-switch missing');
      }
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      switchEl.dispatchEvent(clickEvent);
      expect(clickEvent.defaultPrevented).to.be.true;
    });
  });

  describe('mobile layout', () => {
    beforeEach(async () => {
      el.isMobile = true;
      await setViewsAndView(el, sampleViews, 'small');
    });

    it('sets dropdown auto-width-factor to 1', () => {
      expect(getDropdown(el).getAttribute('auto-width-factor')).to.equal('1');
    });

    it('uses multiple menu variant and still emits view change from submenu item', async () => {
      const menu = getDropdown(el).querySelector('cx-menu[variant="multiple"]');
      expect(menu).to.exist;
      const small = findMenuItem(el, (item) => item.value === 'small');
      const evtPromise = oneEvent(el, 'cx-content-browser-control-view-change');
      await dispatchSelectOnDropdown(el, small);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('small');
    });
  });
  describe('table view option', () => {
    it('is absent while the host has configured no table columns', async () => {
      await setViewsAndView(el, sampleViews, 'medium');

      expect(getMenuItems(el).some((item) => item.value === TABLE_VIEW)).to.be.false;
    });

    it('is offered on both layouts once can-use-table is set', async () => {
      el.canUseTable = true;
      await setViewsAndView(el, sampleViews, 'medium');
      expect(findMenuItem(el, (item) => item.value === TABLE_VIEW)).to.exist;

      el.isMobile = true;
      await elementUpdated(el);
      expect(findMenuItem(el, (item) => item.value === TABLE_VIEW)).to.exist;
    });

    it('emits the table view when selected', async () => {
      el.canUseTable = true;
      await setViewsAndView(el, sampleViews, 'medium');

      const table = findMenuItem(el, (item) => item.value === TABLE_VIEW);
      const evtPromise = oneEvent(el, 'cx-content-browser-control-view-change');
      await dispatchSelectOnDropdown(el, table);
      const evt = await evtPromise;

      expect(evt.detail.view).to.equal(TABLE_VIEW);
      expect(evt.detail.isSeeThrough).to.be.false;
    });

    it('returns to the grid when a size is picked from table view', async () => {
      el.canUseTable = true;
      await setViewsAndView(el, sampleViews, 'medium');
      el.view = TABLE_VIEW;
      await elementUpdated(el);

      const small = findMenuItem(el, (item) => item.value === 'small');
      const evtPromise = oneEvent(el, 'cx-content-browser-control-view-change');
      await dispatchSelectOnDropdown(el, small);

      expect((await evtPromise).detail.view).to.equal(GridView.Small);
    });
  });

  describe('visible mobile checkmarks', () => {
    async function visibleCheckmarks() {
      const items = getMenuItems(el);

      await Promise.all(items.map((item) => item.updateComplete));

      return items.filter((item) => {
        const icon = item.shadowRoot!.querySelector<HTMLElement>('[part="checked-icon"]')!;
        const style = getComputedStyle(icon);

        return style.visibility === 'visible' && style.display !== 'none';
      }).map((item) => (item.menu === 'submenu' ? 'grid' : item.value));
    }

    it('marks only the active leaf across mobile table and grid transitions', async () => {
      el.canUseTable = true;
      el.isMobile = true;
      await setViewsAndView(el, sampleViews, 'small');
      el.addEventListener('cx-content-browser-control-view-change', (event) => {
        el.view = event.detail.view;
      });
      await getDropdown(el).show();

      findMenuItem(el, (item) => item.value === TABLE_VIEW).click();
      await elementUpdated(el);
      expect(await visibleCheckmarks()).to.deep.equal([TABLE_VIEW]);

      findMenuItem(el, (item) => item.value === GridView.Small).click();
      await elementUpdated(el);
      expect(await visibleCheckmarks()).to.deep.equal([GridView.Small]);

      findMenuItem(el, (item) => item.value === TABLE_VIEW).click();
      await elementUpdated(el);
      expect(await visibleCheckmarks()).to.deep.equal([TABLE_VIEW]);
    });

    it('keeps the active Table mark after the control returns from desktop to mobile', async () => {
      el.canUseTable = true;
      el.isMobile = true;
      await setViewsAndView(el, sampleViews, TABLE_VIEW);

      for (const isMobile of [true, false, true]) {
        el.isMobile = isMobile;
        await elementUpdated(el);
        await getDropdown(el).show();
        expect(await visibleCheckmarks()).to.deep.equal([TABLE_VIEW]);
      }
    });

    it('keeps the mobile Grid mark for a host without table columns', async () => {
      el.isMobile = true;
      await setViewsAndView(el, sampleViews, 'small');
      await getDropdown(el).show();

      expect(await visibleCheckmarks()).to.deep.equal(['grid', GridView.Small]);
    });
  });
  describe('desktop checked state', () => {
    /** The Grid item is the one that opens the grid-size submenu. */
    function getGridItem(control: CxContentBrowserControlView) {
      return findMenuItem(control, (item) => item.querySelector(':scope > cx-menu[slot="submenu"]') !== null);
    }

    /** Labels, not nodes, so a failure reads as the list of marked items. */
    function checkedItems(control: CxContentBrowserControlView) {
      return getMenuItems(control)
        .filter((item) => item.hasAttribute('checked'))
        .map((item) => (getGridItem(control) === item ? 'grid' : item.value));
    }

    it('leaves the Grid item unmarked for a host without table columns', async () => {
      await setViewsAndView(el, sampleViews, 'medium');

      expect(getGridItem(el).hasAttribute('checked')).to.be.false;
      expect(checkedItems(el)).to.deep.equal(['medium']);
    });

    it('marks the active grid size alone, never the Grid item, once the table is offered', async () => {
      el.canUseTable = true;
      await setViewsAndView(el, sampleViews, 'medium');

      expect(checkedItems(el)).to.deep.equal(['medium']);
    });

    it('marks the Table item alone while the table is active', async () => {
      el.canUseTable = true;
      await setViewsAndView(el, sampleViews, 'medium');
      el.view = TABLE_VIEW;
      await elementUpdated(el);

      expect(checkedItems(el)).to.deep.equal([TABLE_VIEW]);
    });
  });
});
