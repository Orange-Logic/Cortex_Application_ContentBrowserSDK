import './dam-view-control-view';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type CxMenuItem from '@orangelogic/design-system/components/menu-item';
import { GridView, type ControlOption } from '@/types/dam-view';

import type CxDamViewControlView from './dam-view-control-view';

const sampleViews: ControlOption[] = [
  { label: 'Large', value: 'large' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
];

function getDropdown(el: CxDamViewControlView) {
  return el.shadowRoot!.querySelector('cx-dropdown')!;
}

function getMenuItems(el: CxDamViewControlView) {
  return [...getDropdown(el).querySelectorAll('cx-menu-item')] as CxMenuItem[];
}

function findMenuItem(el: CxDamViewControlView, match: (item: CxMenuItem) => boolean) {
  const found = getMenuItems(el).find(match);
  expect(found, 'expected menu item').to.exist;

  return found!;
}

async function dispatchSelectOnDropdown(el: CxDamViewControlView, item: CxMenuItem) {
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
  el: CxDamViewControlView,
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

describe('dam-view-control-view', () => {
  let el: CxDamViewControlView;

  beforeEach(async () => {
    el = await fixture(html`<cx-dam-view-control-view></cx-dam-view-control-view>`);
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

  describe('cx-dam-view-control-view-change', () => {
    beforeEach(async () => {
      el.isSeeThrough = false;
      await setViewsAndView(el, sampleViews, 'medium');
    });

    it('emits new view and preserves isSeeThrough when a grid size is selected', async () => {
      const large = findMenuItem(el, (item) => item.value === 'large');
      const evtPromise = oneEvent(el, 'cx-dam-view-control-view-change');
      await dispatchSelectOnDropdown(el, large);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('large');
      expect(evt.detail.isSeeThrough).to.be.false;
    });

    it('toggles isSeeThrough and preserves view when see-thru row is selected', async () => {
      const seeThru = findMenuItem(el, (item) => item.value === 'see-thru');
      const evtPromise = oneEvent(el, 'cx-dam-view-control-view-change');
      await dispatchSelectOnDropdown(el, seeThru);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('medium');
      expect(evt.detail.isSeeThrough).to.be.true;
    });

    it('toggles isSeeThrough off when already on', async () => {
      el.isSeeThrough = true;
      await elementUpdated(el);
      const seeThru = findMenuItem(el, (item) => item.value === 'see-thru');
      const evtPromise = oneEvent(el, 'cx-dam-view-control-view-change');
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
      el.addEventListener('cx-dam-view-control-view-change', () => {
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
      const evtPromise = oneEvent(el, 'cx-dam-view-control-view-change');
      await dispatchSelectOnDropdown(el, small);
      const evt = await evtPromise;
      expect(evt.detail.view).to.equal('small');
    });
  });
});
