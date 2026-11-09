import { expect, waitUntil } from '@open-wc/testing';
import { createElement, useContext } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppContext } from '@/AppContext';
import { AssetLinkError } from '@/api/asset/asset';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { store } from '@/store';
import { deleteData, getData, storeData } from '@/utils/storage';
import type CxContentBrowser from '@/components/content-browser/content-browser';
import type { TitleFallback } from '@/types/content-browser';
import AssetsPicker from './AssetsPicker';

function Host({ view, titleFallback }: { view: string; titleFallback?: TitleFallback }) {
  const defaults = useContext(GlobalConfigContext);
  return createElement(GlobalConfigContext.Provider, {
    value: { ...defaults, defaultGridView: view, tableColumns: [{ title: 'Title', field: 'CoreField.Title' }],
      ...(titleFallback === undefined ? {} : { titleFallback }) },
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

  async function render(view: string, titleFallback?: TitleFallback) {
    // React Redux requires the children prop in its createElement overload.
    // eslint-disable-next-line react/no-children-prop
    root.render(createElement(Provider, { store, children: createElement(Host, { view, titleFallback }) }));
    await waitUntil(() => !!container.querySelector('cx-content-browser'));
    const browser = container.querySelector('cx-content-browser') as CxContentBrowser;
    await browser.updateComplete;
    return browser;
  }

  it('preserves an omitted title fallback for the site default', async () => {
    const browser = await render('medium');
    expect(browser.titleFallback).to.equal(undefined);
    expect(browser.hasAttribute('title-fallback')).to.equal(false);
  });

  it('preserves an explicit identifier fallback', async () => {
    const browser = await render('medium', 'uniqueIdentifier');
    expect(browser.titleFallback).to.equal('uniqueIdentifier');
  });

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

describe('AssetsPicker asset link error', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
  });

  it('passes the asset link error of a confirm to the host onError', async () => {
    const calls: [string | undefined, Error | undefined][] = [];

    function ErrorHost() {
      const defaults = useContext(AppContext);
      return createElement(AppContext.Provider, {
        value: { ...defaults, onError: (message?: string, error?: Error) => calls.push([message, error]) },
      }, createElement(AssetsPicker));
    }

    // React Redux requires the children prop in its createElement overload.
    // eslint-disable-next-line react/no-children-prop
    root.render(createElement(Provider, { store, children: createElement(ErrorHost) }));
    await waitUntil(() => !!container.querySelector('cx-content-browser'));
    const browser = container.querySelector('cx-content-browser') as CxContentBrowser;
    await browser.updateComplete;

    const message = 'You do not have permission to get bulk of reusable permanent links';
    const error = new AssetLinkError(message, { errorCode: 'OL_ERR_002_NOTALLOWED', serverMessage: message });

    browser.dispatchEvent(new CustomEvent('cx-content-browser-asset-link-error', { detail: { error } }));

    await waitUntil(() => calls.length === 1);
    expect(calls[0][0]).to.equal(message);
    expect((calls[0][1] as AssetLinkError).errorCode).to.equal('OL_ERR_002_NOTALLOWED');
  });
});
