import { expect, waitUntil } from '@open-wc/testing';
import { createElement, useContext } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { store } from '@/store';
import { deleteData, getData, storeData } from '@/utils/storage';
import type CxContentBrowser from '@/components/content-browser/content-browser';
import AssetsPicker from './AssetsPicker';

function Host({ view }: { view: string }) {
  const defaults = useContext(GlobalConfigContext);
  return createElement(GlobalConfigContext.Provider, {
    value: { ...defaults, defaultGridView: view, tableColumns: [{ title: 'Title', field: 'CoreField.Title' }] },
  }, createElement(AssetsPicker));
}

describe('AssetsPicker view configuration', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(async () => {
    await deleteData('selectedView');
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    root.unmount();
    container.remove();
    await deleteData('selectedView');
  });

  async function render(view: string) {
    // React Redux requires the children prop in its createElement overload.
    // eslint-disable-next-line react/no-children-prop
    root.render(createElement(Provider, { store, children: createElement(Host, { view }) }));
    await waitUntil(() => !!container.querySelector('cx-content-browser'));
    const browser = container.querySelector('cx-content-browser') as CxContentBrowser;
    await browser.updateComplete;
    return browser;
  }

  for (const view of ['small', 'medium', 'large', 'table']) {
    it(`applies the configured ${view} view before the saved view`, async () => {
      await storeData('selectedView', view === 'table' ? 'small' : 'table');
      const browser = await render(view);
      expect(browser.defaultGridView).to.equal(view);
      if (view === 'table') {
        expect(browser.shadowRoot!.querySelector('cx-content-browser-table')).to.exist;
      } else {
        expect(browser.shadowRoot!.querySelector('cx-content-browser-grid')).to.have.attribute('view', view);
      }
    });
  }

  it('restores the saved table view without a configured view', async () => {
    await storeData('selectedView', 'table');
    const browser = await render('');
    expect(browser.shadowRoot!.querySelector('cx-content-browser-table')).to.exist;
  });

  it('saves a mode change before any subsequent asset request', async () => {
    const browser = await render('medium');
    browser.shadowRoot!.querySelector('cx-content-browser-control-bar')!.dispatchEvent(new CustomEvent(
      'cx-content-browser-control-view-change', {
        detail: { view: 'table', isSeeThrough: browser.lastRequest.isSeeThrough },
        bubbles: true,
        composed: true,
      },
    ));
    await browser.updateComplete;
    expect(await getData('selectedView')).to.equal('table');
    root.unmount();
    root = createRoot(container);
    const reloaded = await render('');
    expect(reloaded.shadowRoot!.querySelector('cx-content-browser-table')).to.exist;
  });

  it('uses medium for an invalid saved view', async () => {
    await storeData('selectedView', 'invalid');
    const browser = await render('');
    expect(browser.defaultGridView).to.equal('medium');
  });
});
