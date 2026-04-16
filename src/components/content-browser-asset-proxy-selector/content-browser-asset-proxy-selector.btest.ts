import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import type CxContentBrowserAssetTrackingParameters from '../content-browser-asset-tracking-parameters/content-browser-asset-tracking-parameters';

import CxContentBrowserAssetProxySelector, {
  CUSTOM_FORMAT_VALUE,
  USE_REPRESENTATIVE_VALUE,
} from './content-browser-asset-proxy-selector';

/** Warning icon uses brand amber; axe contrast threshold is strict on white. */
const accessibilityIgnoredRules = ['color-contrast'];

const sampleItem = {
  cdnName: 'Edge',
  docType: 'Image',
  extension: '.jpg',
  height: '1080',
  id: 'proxy-large',
  image: 'https://placehold.co/40x30',
  name: 'Large preview',
  value: 'https://cdn.example/large',
  width: '1920',
};

describe('content-browser-asset-proxy-selector', () => {
  it('exports proxy option value constants', () => {
    expect(USE_REPRESENTATIVE_VALUE).to.equal('use-representative');
    expect(CUSTOM_FORMAT_VALUE).to.equal('custom');
  });

  describe('when no proxies and ATS is off', () => {
    let el: CxContentBrowserAssetProxySelector;

    beforeEach(async () => {
      el = await fixture(html`<cx-content-browser-asset-proxy-selector></cx-content-browser-asset-proxy-selector>`);
    });

    it('is accessible', async () => {
      await expect(el).to.be.accessible({ ignoredRules: accessibilityIgnoredRules });
    });

    it('shows the empty-state warning', () => {
      const root = el.shadowRoot!;
      expect(root.querySelector('cx-menu')).to.be.null;
      expect(root.textContent?.includes('no available options')).to.be.true;
      expect(root.querySelector('cx-icon[name="warning"]')).to.exist;
    });
  });

  describe('with proxy items', () => {
    let el: CxContentBrowserAssetProxySelector;

    beforeEach(async () => {
      el = await fixture(html`<cx-content-browser-asset-proxy-selector></cx-content-browser-asset-proxy-selector>`);
      el.items = [sampleItem];
      await elementUpdated(el);
    });

    it('renders a menu with one item per proxy', () => {
      const items = el.shadowRoot!.querySelectorAll(
        'cx-menu.content-browser-asset-proxy-selector__menu cx-menu-item',
      );
      expect(items.length).to.equal(1);
      expect(items[0]).to.have.attribute('value', sampleItem.id);
    });

    it('renders thumbnail when item has image', () => {
      const img = el.shadowRoot!.querySelector(
        '.content-browser-asset-proxy-selector__menu-item__thumbnail img',
      );
      expect(img).to.exist;
      expect(img).to.have.attribute('src', sampleItem.image);
      expect(img).to.have.attribute('alt', sampleItem.name);
    });

    it('renders dimensions, extension, and CDN in details', () => {
      const text = el.shadowRoot!.textContent ?? '';
      expect(text.includes('1920')).to.be.true;
      expect(text.includes('1080')).to.be.true;
      expect(text.includes('JPG')).to.be.true;
      expect(text.includes('Edge')).to.be.true;
    });

    it('strips leading dot from extension in the label', async () => {
      el.items = [{ ...sampleItem, extension: '.png' }];
      await elementUpdated(el);
      expect(el.shadowRoot!.textContent?.includes('PNG')).to.be.true;
    });

    it('marks the selected item with check icon and selected name class', async () => {
      el.selected = sampleItem.id;
      await elementUpdated(el);
      const suffixIcons = el.shadowRoot!.querySelectorAll(
        `cx-menu-item[value="${sampleItem.id}"] cx-icon[slot="suffix"]`,
      );
      const check = [...suffixIcons].find((i) => i.getAttribute('name') === 'check');
      expect(check).to.exist;
      const nameTypo = el.shadowRoot!.querySelector(
        '.content-browser-asset-proxy-selector__menu-item__name--selected',
      );
      expect(nameTypo?.textContent?.includes(sampleItem.name)).to.be.true;
    });

    it('adds disable-hover on the selected row when disabledSelected is false', async () => {
      el.selected = sampleItem.id;
      el.disabledSelected = false;
      await elementUpdated(el);
      const menuItem = el.shadowRoot!.querySelector(`cx-menu-item[value="${sampleItem.id}"]`);
      expect(menuItem?.classList.contains('content-browser-asset-proxy-selector__menu-item--disable-hover')).to.be
        .true;
    });

    it('drops disable-hover and selected name style when disabledSelected is true', async () => {
      el.selected = sampleItem.id;
      el.disabledSelected = true;
      await elementUpdated(el);
      const menuItem = el.shadowRoot!.querySelector(`cx-menu-item[value="${sampleItem.id}"]`);
      expect(menuItem?.classList.contains('content-browser-asset-proxy-selector__menu-item--disable-hover')).to.be
        .false;
      expect(
        el.shadowRoot!.querySelector('.content-browser-asset-proxy-selector__menu-item__name--selected'),
      ).to.be.null;
    });
  });

  describe('representative image option', () => {
    let el: CxContentBrowserAssetProxySelector;

    beforeEach(async () => {
      el = await fixture(html`<cx-content-browser-asset-proxy-selector></cx-content-browser-asset-proxy-selector>`);
      el.items = [sampleItem];
      el.canUseRepresentative = true;
      await elementUpdated(el);
    });

    it('appends use-representative menu item', () => {
      const rep = el.shadowRoot!.querySelector(
        `cx-menu-item[value="${USE_REPRESENTATIVE_VALUE}"]`,
      );
      expect(rep).to.exist;
    });
  });

  describe('ATS custom format', () => {
    let el: CxContentBrowserAssetProxySelector;

    beforeEach(async () => {
      el = await fixture(html`<cx-content-browser-asset-proxy-selector></cx-content-browser-asset-proxy-selector>`);
      el.canUseATS = true;
      await elementUpdated(el);
    });

    it('renders custom format menu when canUseATS is true without proxy items', () => {
      const menus = el.shadowRoot!.querySelectorAll('cx-menu');
      expect(menus.length).to.equal(1);
      expect(el.shadowRoot!.querySelector(`cx-menu-item[value="${CUSTOM_FORMAT_VALUE}"]`)).to.exist;
      expect(el.shadowRoot!.querySelector('cx-icon[name="crop_rotate"]')).to.exist;
    });

    it('shows custom dimensions and extension when custom format is selected', async () => {
      el.selected = CUSTOM_FORMAT_VALUE;
      el.customWidth = '800';
      el.customHeight = '600';
      el.customExtension = '.webp';
      await elementUpdated(el);
      const text = el.shadowRoot!.textContent ?? '';
      expect(text.includes('800')).to.be.true;
      expect(text.includes('600')).to.be.true;
      expect(text.includes('WEBP')).to.be.true;
      expect(el.shadowRoot!.querySelector('cx-icon.icon--primary[name="check"]')).to.exist;
    });
  });

  describe('items plus ATS', () => {
    it('renders two menus when both items and canUseATS are set', async () => {
      const el = await fixture<CxContentBrowserAssetProxySelector>(
        html`<cx-content-browser-asset-proxy-selector></cx-content-browser-asset-proxy-selector>`,
      );
      el.items = [sampleItem];
      el.canUseATS = true;
      await elementUpdated(el);
      expect(el.shadowRoot!.querySelectorAll('cx-menu.content-browser-asset-proxy-selector__menu').length).to
        .equal(2);
    });
  });

  describe('tracking parameters', () => {
    let el: CxContentBrowserAssetProxySelector;

    beforeEach(async () => {
      el = await fixture(html`<cx-content-browser-asset-proxy-selector></cx-content-browser-asset-proxy-selector>`);
      el.items = [sampleItem];
      el.canUseTracking = true;
      el.enabledTracking = true;
      el.trackingParameters = [{ key: 'utm_source', value: 'email' }];
      await elementUpdated(el);
    });

    it('renders cx-content-browser-asset-tracking-parameters when tracking is enabled', () => {
      expect(el.shadowRoot!.querySelector('cx-content-browser-asset-tracking-parameters')).to.exist;
    });

    it('passes trackingParameters to the editor as values', () => {
      const tracking = el.shadowRoot!.querySelector(
        'cx-content-browser-asset-tracking-parameters',
      ) as CxContentBrowserAssetTrackingParameters;
      expect(tracking.values).to.deep.equal([{ key: 'utm_source', value: 'email' }]);
    });

    it('does not render the editor when enabledTracking is false', async () => {
      el.enabledTracking = false;
      await elementUpdated(el);
      expect(el.shadowRoot!.querySelector('cx-content-browser-asset-tracking-parameters')).to.be.null;
    });

    it('calls preventDefault on tracking switch click so the menu item is not activated as well', async () => {
      el.enabledTracking = false;
      await elementUpdated(el);
      const switchEl = el.shadowRoot!.querySelector(
        'cx-switch.content-browser-asset-proxy-selector__menu-item__switch',
      );
      expect(switchEl).to.exist;
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true });
      switchEl!.dispatchEvent(evt);
      expect(evt.defaultPrevented).to.be.true;
    });
  });
});
