import './content-browser';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';

import type { GetAssetLinksResponse } from '@/api/asset/asset.types';
import type { Asset, AssetVersion, GetAssetsRequest } from '@/types/asset';
import { MediaType } from '@/types/asset';
import { GridView, OptionType, ContentBrowserFormatDialogVariant } from '@/types/content-browser';
import type { GetFolderRequest } from '@/types/folder';

import sinon from 'sinon';

import type CxContentBrowserControlBar from '../content-browser-control-bar/content-browser-control-bar';
import type CxContentBrowserFormatDialog from '../content-browser-format-dialog/content-browser-format-dialog';
import type CxContentBrowser from './content-browser';

function makeAsset(overrides: Partial<Asset> = {}): Asset {
  return {
    docSubType: '',
    docType: MediaType.Image,
    extension: '.jpg',
    id: 'rec-1',
    identifier: 'id-1',
    imageUrl: 'https://placehold.co/60',
    name: 'Photo',
    originalUrl: '',
    recordId: 'rec-1',
    size: '1 MB',
    tags: '',
    ...overrides,
  };
}

function makeVersion(overrides: Partial<AssetVersion> = {}): AssetVersion {
  return {
    createByEmail: 'a@b.com',
    fileImportDate: '2024-01-01',
    scrubUrl: '',
    versionCreateDate: '2024-06-01',
    versionFileName: 'f.jpg',
    versionFileUrl: 'https://placehold.co/1',
    versionId: 'v1',
    versionNumber: 1,
    versionNumberDisplay: 'V1',
    ...overrides,
  };
}

type OpenFormatPayload = {
  asset: Asset;
  isFavorite: boolean;
  proxies: unknown[];
};

function createMockFetchController(
  host: CxContentBrowser,
  options: {
    fetchAssetByIDResult?: OpenFormatPayload | undefined;
    getAssetLinkResult?: GetAssetLinksResponse;
    isLoggedIn?: boolean;
    items?: Asset[];
    parameters?: Record<string, unknown> | null;
    totalCount?: number;
  } = {},
) {
  const items = options.items ?? [];
  const totalCount = options.totalCount ?? items.length;
  const versionHistoryVersions = [makeVersion()];

  return {
    _versionHistoryVersions: versionHistoryVersions,
    addAssetToFavorite: sinon.stub().resolves(true),
    fetchAndMergeAssets: sinon.stub().resolves(undefined),
    fetchAssetByID: sinon.stub().resolves(options.fetchAssetByIDResult),
    fetchAssetVersionHistory: sinon.stub().resolves({ versions: versionHistoryVersions }),
    fetchAssets: sinon.stub().resolves({ facets: [], items: [], totalCount: 0 }),
    fetchFolders: sinon.stub().resolves({ data: [], hasMore: false, totalCount: 0 }),
    getAssetLink: sinon
      .stub()
      .resolves(options.getAssetLinkResult ?? {
        data: [{ imageUrl: 'https://cdn.example/selected.jpg' }],
        isError: false,
      }),
    getData: () => ({
      availableExtensions: null,
      availableFacets: [],
      facets: [],
      isLoggedIn: options.isLoggedIn ?? true,
      items,
      loading: false,
      parameters:
        options.parameters === undefined
          ? null
          : (options.parameters),
      request: host.lastRequest,
      sortOrders: {},
      totalCount,
      userInfo: {
        avatar: 'https://placehold.co/100x100',
        email: 'john.doe@example.com',
        favoriteFolderRecordID: 'rec-1',
        fullName: 'John Doe',
        loginID: 'john.doe@example.com',
      },
    }),
    removeAssetFromFavorite: sinon.stub().resolves(true),
  };
}

function installMockController(
  host: CxContentBrowser,
  mock: ReturnType<typeof createMockFetchController>,
) {
  (host as unknown as { fetchAndMergeAssetsController: typeof mock }).fetchAndMergeAssetsController =
    mock;
  host.requestUpdate();
}

async function fixtureWithMock(
  template: ReturnType<typeof html>,
  mockOptions: Parameters<typeof createMockFetchController>[1] = {},
) {
  const el = await fixture<CxContentBrowser>(template);
  await elementUpdated(el);
  const mock = createMockFetchController(el, mockOptions);
  installMockController(el, mock);
  await elementUpdated(el);

  return { el, mock };
}

function getFormatDialog(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-format-dialog') as CxContentBrowserFormatDialog;
}

function getGrid(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-grid');
}

function getControlBar(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-control-bar') as CxContentBrowserControlBar;
}

function getContentBrowserResizeObserver(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-resize-observer')!;
}

function getContentBrowserContentHost(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('.content-browser__content')!;
}

/** Avoids passing `undefined` into format-dialog array props (reflect + join) when `isMobile` triggers updates. */
function minimalFetchParameters(): Record<string, unknown> {
  return {
    supportedExtensions: [] as string[],
    supportedRepresentativeSubtypes: [] as string[],
  };
}

function dispatchContentResize(el: CxContentBrowser, width: number, target: Element) {
  const entry = {
    borderBoxSize: [],
    contentBoxSize: [],
    contentRect: {
      bottom: 600,
      height: 600,
      left: 0,
      right: width,
      toJSON() {
        return {};
      },
      top: 0,
      width,
      x: 0,
      y: 0,
    } as DOMRectReadOnly,
    target,
  } as unknown as ResizeObserverEntry;

  getContentBrowserResizeObserver(el).dispatchEvent(
    new CustomEvent('cx-resize', {
      bubbles: true,
      composed: true,
      detail: { entries: [entry] },
    }),
  );
}

function getBrowser(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-browser');
}

function makeTreeItemSelection(id: string, name: string) {
  const item = document.createElement('div');
  item.dataset.id = id;
  item.dataset.name = name;

  return [item];
}

describe('content-browser', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('parses space-separated list attributes (split on space)', async () => {
    const { el } = await fixtureWithMock(html`
      <cx-content-browser
        available-doc-types="DO_ONE DO_TWO DO_THREE"
        allowed-extensions="jpg png gif"
        allowed-folders="folder-a folder-b folder-c"
        available-representative-subtypes="thumb poster"
      ></cx-content-browser>
    `);

    expect(el.availableDocTypes).to.deep.equal(['DO_ONE', 'DO_TWO', 'DO_THREE']);
    expect(el.allowedExtensions).to.deep.equal(['jpg', 'png', 'gif']);
    expect(el.allowedFolders).to.deep.equal(['folder-a', 'folder-b', 'folder-c']);
    expect(el.availableRepresentativeSubtypes).to.deep.equal(['thumb', 'poster']);
  });

  it('renders header, control bar, grid, and format dialog when the fetch controller is ready', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser base-url="https://api.test"></cx-content-browser>`);

    expect(getContentBrowserResizeObserver(el)).to.exist;
    expect(el.shadowRoot!.querySelector('cx-content-browser-header')).to.exist;
    expect(el.shadowRoot!.querySelector('cx-content-browser-control-bar')).to.exist;
    expect(getGrid(el)).to.exist;
    expect(getFormatDialog(el)).to.exist;
  });

  it('sets isMobile from content width, passes is-mobile to control bar, and switches format dialog to drawer', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: minimalFetchParameters(),
    });
    const content = getContentBrowserContentHost(el);
    expect(el.isMobile).to.be.false;
    expect(getControlBar(el).isMobile).to.be.false;
    expect(getFormatDialog(el).variant).to.equal(ContentBrowserFormatDialogVariant.Dialog);

    dispatchContentResize(el, 400, content);
    await elementUpdated(el);

    expect(el.isMobile).to.be.true;
    expect(getControlBar(el).isMobile).to.be.true;
    expect(getFormatDialog(el).variant).to.equal(ContentBrowserFormatDialogVariant.Drawer);

    dispatchContentResize(el, 800, content);
    await elementUpdated(el);

    expect(el.isMobile).to.be.false;
    expect(getControlBar(el).isMobile).to.be.false;
    expect(getFormatDialog(el).variant).to.equal(ContentBrowserFormatDialogVariant.Dialog);
  });

  it('sets force-overlay on the folder browser when content width is below 650px', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: minimalFetchParameters(),
    });
    const content = getContentBrowserContentHost(el);
    const browser = getBrowser(el);
    expect(browser).to.exist;
    expect(browser!.hasAttribute('force-overlay')).to.be.false;

    dispatchContentResize(el, 600, content);
    await elementUpdated(el);
    expect(browser!.hasAttribute('force-overlay')).to.be.true;

    dispatchContentResize(el, 649, content);
    await elementUpdated(el);
    expect(browser!.hasAttribute('force-overlay')).to.be.true;

    dispatchContentResize(el, 650, content);
    await elementUpdated(el);
    expect(browser!.hasAttribute('force-overlay')).to.be.false;

    dispatchContentResize(el, 800, content);
    await elementUpdated(el);
    expect(browser!.hasAttribute('force-overlay')).to.be.false;
  });

  it('ignores cx-resize when the entry target is not content-browser content', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: minimalFetchParameters(),
    });
    const other = document.createElement('div');
    const browser = getBrowser(el);
    expect(browser).to.exist;

    dispatchContentResize(el, 400, other);
    await elementUpdated(el);

    expect(el.isMobile).to.be.false;
    expect(browser!.hasAttribute('force-overlay')).to.be.false;
  });

  it('renders unauthorized message with warning icon when not logged in', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser error-message="Unauthorized"></cx-content-browser>`, {
      isLoggedIn: false,
    });

    const message = el.shadowRoot!.querySelector('.content-browser__message');
    expect(message).to.exist;
    expect(message!.querySelector('cx-icon.content-browser__message__icon')).to.have.attribute('name', 'warning');
    const typography = message!.querySelector('cx-typography.content-browser__message__text');
    expect(typography).to.exist;
    expect(typography!.textContent?.replaceAll(/\s+/g, ' ').trim()).to.equal('Unauthorized');

    expect(el.shadowRoot!.querySelector('cx-content-browser-header')).to.be.null;
    expect(el.shadowRoot!.querySelector('cx-content-browser-control-bar')).to.be.null;
    expect(getGrid(el)).to.be.null;
    expect(getFormatDialog(el)).to.be.null;
    expect(getBrowser(el)).to.be.null;
  });

  it('does not render the folder browser when parameters are absent', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: null,
    });

    expect(el.shadowRoot!.querySelector('cx-content-browser-browser')).to.be.null;
  });

  it('renders the folder browser when parameters include collectionPath', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: { collectionPath: '/collections/root' },
    });

    expect(el.shadowRoot!.querySelector('cx-content-browser-browser')).to.exist;
  });

  it('passes can-favorite and can-use-proxies to the format dialog', async () => {
    const { el } = await fixtureWithMock(html`
      <cx-content-browser .canFavorite=${false} .canUseProxies=${false}></cx-content-browser>
    `);

    const dialog = getFormatDialog(el);
    expect(dialog.canFavorite).to.be.false;
    expect(dialog.canUseProxies).to.be.false;
  });

  it('opens the format dialog after a grid click when fetchAssetByID resolves', async () => {
    const asset = makeAsset();
    const openPayload = { asset, isFavorite: false, proxies: [] as unknown[] };

    const { el } = await fixtureWithMock(html`<cx-content-browser .canFavorite=${false}></cx-content-browser>`, {
      fetchAssetByIDResult: openPayload,
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const openSpy = sinon.spy(dialog, 'open');

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-click', {
        bubbles: true,
        composed: true,
        detail: { id: asset.id },
      }),
    );

    await waitUntil(() => openSpy.calledOnce);
    expect(openSpy.firstCall.args[0]).to.deep.equal(openPayload);
    expect(el.selectedAssetId).to.equal(asset.id);
    expect(getGrid(el)!.getAttribute('selected-asset-id')).to.equal(asset.id);
  });

  it('does not open the format dialog when fetchAssetByID resolves undefined', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      fetchAssetByIDResult: undefined,
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const openSpy = sinon.spy(dialog, 'open');

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-click', {
        bubbles: true,
        composed: true,
        detail: { id: asset.id },
      }),
    );

    await waitUntil(() => mock.fetchAssetByID.calledOnce);
    expect(openSpy.called).to.be.false;
    expect(el.selectedAssetId).to.be.undefined;
  });

  it('clears selectedAssetId when the format dialog fires cx-content-browser-format-dialog-close', async () => {
    const asset = makeAsset({ id: 'sel-42' });
    const openPayload = { asset, isFavorite: false, proxies: [] as unknown[] };

    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      fetchAssetByIDResult: openPayload,
      items: [asset],
      parameters: minimalFetchParameters(),
      totalCount: 1,
    });

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-click', {
        bubbles: true,
        composed: true,
        detail: { id: asset.id },
      }),
    );
    await waitUntil(() => el.selectedAssetId === asset.id);
    expect(getGrid(el)!.getAttribute('selected-asset-id')).to.equal('sel-42');

    getFormatDialog(el).dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-close', {
        bubbles: true,
        composed: true,
      }),
    );
    await elementUpdated(el);

    expect(el.selectedAssetId).to.be.undefined;
    expect(getGrid(el)!.hasAttribute('selected-asset-id')).to.be.false;
  });

  it('selectAsset loads the asset and opens the format dialog', async () => {
    const asset = makeAsset({ id: 'via-select' });
    const openPayload = { asset, isFavorite: false, proxies: [] as unknown[] };

    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      fetchAssetByIDResult: openPayload,
      items: [asset],
      parameters: minimalFetchParameters(),
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const openSpy = sinon.spy(dialog, 'open');
    await el.selectAsset(asset.id);

    await waitUntil(() => openSpy.calledOnce);
    expect(openSpy.firstCall.args[0]).to.deep.equal(openPayload);
    expect(el.selectedAssetId).to.equal(asset.id);
  });

  it('fetchAssets delegates to the fetch controller', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: minimalFetchParameters(),
    });
    const req: GetAssetsRequest = {
      folderId: 'folder-1',
      pageSize: 10,
      start: 0,
    };

    await el.fetchAssets(req);

    expect(mock.fetchAssets).to.have.been.calledOnceWith(req);
  });

  it('fetchFolders delegates to the fetch controller', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: minimalFetchParameters(),
    });
    const req: GetFolderRequest = { folderId: 'fid-9' };

    await el.fetchFolders(req);

    expect(mock.fetchFolders).to.have.been.calledOnceWith(req);
  });

  it('emits cx-content-browser-selected-asset after proxy confirm', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const p = oneEvent(el, 'cx-content-browser-selected-asset');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-proxy-confirm', {
        bubbles: true,
        composed: true,
        detail: {
          asset,
          extension: '.jpg',
          permanentLink: 'https://perm.example/x',
          proxyPreference: 'HD',
          selectedProxyMetadata: {
            cdnName: null,
            extension: '.jpg',
            height: 720,
            isCustomFormat: false,
            permanentLink: null,
            proxyLabel: 'HD',
            proxyName: 'HD',
            width: 1280,
          },
          useRepresentative: false,
        },
      }),
    );

    const ev = await p;
    expect(mock.getAssetLink).to.have.been.calledOnce;
    expect(ev.detail).to.be.an('array').with.lengthOf(1);
    expect(ev.detail[0].imageUrl).to.equal('https://cdn.example/selected.jpg');
    expect(ev.detail[0].assetLinkInfo?.proxyName).to.equal('HD');
  });

  it('handleFormatConfirm calls getAssetLink, hides the dialog, and emits selected asset with transformation metadata', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      getAssetLinkResult: {
        data: [{ imageUrl: 'https://cdn.example/custom.webp' }],
        isError: false,
      },
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const hideSpy = sinon.spy(dialog, 'hide');
    const p = oneEvent(el, 'cx-content-browser-selected-asset');

    const sourceProxyMetadata = {
      cdnName: null,
      extension: '.jpg',
      height: 720,
      isCustomFormat: false,
      permanentLink: null,
      proxyLabel: 'Source proxy',
      proxyName: 'SRC',
      width: 1280,
    };

    const transformedAssetMetadata = {
      extension: '.webp',
      height: 600,
      isCustomFormat: true,
      permanentLink: null,
      width: 800,
    };

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-format-confirm', {
        bubbles: true,
        composed: true,
        detail: {
          asset,
          extension: '.webp',
          sourceProxyMetadata,
          transformations: [],
          transformedAssetMetadata,
        },
      }),
    );

    const ev = await p;

    expect(mock.getAssetLink).to.have.been.calledOnce;
    const linkPayload = mock.getAssetLink.firstCall.args[0] as {
      asset: Asset;
      assets: Asset[];
      extraFields?: string[];
    };
    expect(linkPayload.assets).to.deep.equal([asset]);
    expect(linkPayload.extraFields).to.deep.equal([]);
    expect(linkPayload.asset).to.equal(asset);

    await waitUntil(() => hideSpy.calledOnce);

    expect(ev.detail).to.be.an('array').with.lengthOf(1);
    expect(ev.detail[0].imageUrl).to.equal('https://cdn.example/custom.webp');
    expect(ev.detail[0].assetLinkInfo).to.deep.include({
      extension: '.webp',
      height: 600,
      isCustomFormat: true,
      permanentLink: 'https://cdn.example/custom.webp',
      width: 800,
    });
    expect(ev.detail[0].assetTransformationSource).to.deep.equal(sourceProxyMetadata);
  });

  it('keeps the format dialog open when format confirm link generation fails', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      getAssetLinkResult: {
        data: [],
        isError: true,
      },
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const hideSpy = sinon.spy(dialog, 'hide');
    const selectedSpy = sinon.spy();
    el.addEventListener('cx-content-browser-selected-asset', selectedSpy);
    dialog.loadingConfirm = true;

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-format-confirm', {
        bubbles: true,
        composed: true,
        detail: {
          asset,
          extension: '.webp',
          sourceProxyMetadata: null,
          transformations: [],
          transformedAssetMetadata: {
            extension: '.webp',
            height: 600,
            isCustomFormat: true,
            permanentLink: null,
            width: 800,
          },
        },
      }),
    );

    await waitUntil(() => mock.getAssetLink.calledOnce);
    await waitUntil(() => dialog.loadingConfirm === false);

    expect(hideSpy).not.to.have.been.called;
    expect(selectedSpy).not.to.have.been.called;
  });

  it('merges ScrubUrl into selected payload when extra-fields requests it', async () => {
    const asset = makeAsset({ scrubUrl: 'https://scrub.example/s.vtt' });
    const { el } = await fixtureWithMock(
      html`<cx-content-browser extra-fields="ScrubUrl"></cx-content-browser>`,
      {
        getAssetLinkResult: {
          data: [{ imageUrl: 'https://out.example/img.jpg' }],
          isError: false,
        },
        items: [asset],
        totalCount: 1,
      },
    );

    const dialog = getFormatDialog(el);
    const p = oneEvent(el, 'cx-content-browser-selected-asset');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-proxy-confirm', {
        bubbles: true,
        composed: true,
        detail: {
          asset,
          extension: '.jpg',
          proxyPreference: 'HD',
          selectedProxyMetadata: {
            cdnName: null,
            extension: '.jpg',
            height: null,
            isCustomFormat: false,
            permanentLink: null,
            proxyLabel: null,
            proxyName: 'HD',
            width: null,
          },
          useRepresentative: false,
        },
      }),
    );

    const ev = await p;
    expect(ev.detail[0].extraFields?.ScrubUrl).to.equal('https://scrub.example/s.vtt');
  });

  it('calls setVersionHistory on the format dialog when version history is opened', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const spy = sinon.spy(dialog, 'setVersionHistory');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-version-history-open', {
        bubbles: true,
        composed: true,
        detail: { assetId: asset.id },
      }),
    );

    await waitUntil(() => spy.calledOnce);
    expect(mock.fetchAssetVersionHistory).to.have.been.calledWith(asset.id);
    expect(spy.firstCall.args[0]).to.deep.equal(mock._versionHistoryVersions);
  });

  it('calls setIsFavorite on the format dialog when favorite add succeeds', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const spy = sinon.spy(dialog, 'setIsFavorite');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-favorite-change', {
        bubbles: true,
        composed: true,
        detail: { assetId: asset.id, isFavorite: false },
      }),
    );

    await waitUntil(() => spy.calledOnce);
    expect(mock.addAssetToFavorite).to.have.been.calledWith(asset.id);
    expect(spy).to.have.been.calledWith(true);
  });

  it('calls removeAssetFromFavorite and setIsFavorite(false) when unfavorite succeeds', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const spy = sinon.spy(dialog, 'setIsFavorite');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-favorite-change', {
        bubbles: true,
        composed: true,
        detail: { assetId: asset.id, isFavorite: true },
      }),
    );

    await waitUntil(() => spy.calledOnce);
    expect(mock.removeAssetFromFavorite).to.have.been.calledWith(asset.id);
    expect(mock.addAssetToFavorite).to.not.have.been.called;
    expect(spy).to.have.been.calledWith(false);
  });

  it('does not call setIsFavorite when removeAssetFromFavorite returns false', async () => {
    const asset = makeAsset();
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      items: [asset],
      totalCount: 1,
    });

    mock.removeAssetFromFavorite.resolves(false);

    const dialog = getFormatDialog(el);
    const spy = sinon.spy(dialog, 'setIsFavorite');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-favorite-change', {
        bubbles: true,
        composed: true,
        detail: { assetId: asset.id, isFavorite: true },
      }),
    );

    await waitUntil(() => mock.removeAssetFromFavorite.calledOnce);
    expect(mock.removeAssetFromFavorite).to.have.been.calledWith(asset.id);
    expect(spy.called).to.be.false;
  });

  it('updates grid view when the control bar emits a view change', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);

    const bar = getControlBar(el);
    expect(bar).to.exist;

    bar!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-view-change', {
        bubbles: true,
        composed: true,
        detail: { isSeeThrough: true, view: GridView.Large },
      }),
    );
    await elementUpdated(el);

    expect(getGrid(el)).to.have.attribute('view', GridView.Large);
  });

  it('handleViewChange refetches when isSeeThrough changes', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);
    expect(el.lastRequest?.isSeeThrough).to.be.false;

    getControlBar(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-view-change', {
        bubbles: true,
        composed: true,
        detail: { isSeeThrough: true, view: GridView.Medium },
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.isSeeThrough).to.be.true;
    expect(req.start).to.equal(0);
    expect(el.lastRequest?.isSeeThrough).to.be.true;
  });

  describe('runFirstUpdated: defaultPageSize from default-grid-view (no view-change event)', () => {
    it('uses 15 for Large', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${GridView.Large}></cx-content-browser>
      `);

      el.lastRequest = {
        ...el.lastRequest!,
        isSeeThrough: true,
        pageSize: 5,
        start: 10,
      };
      el.requestUpdate();
      await elementUpdated(el);

      expect(getGrid(el)).to.have.attribute('view', GridView.Large);

      mock.fetchAndMergeAssets.resetHistory();

      getGrid(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-scroll-end', {
          bubbles: true,
          composed: true,
        }),
      );

      await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
      const req = mock.fetchAndMergeAssets.firstCall.args[0];
      expect(req.pageSize).to.equal(15);
      expect(req.start).to.equal(15);
    });

    it('uses 20 for Medium', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${GridView.Medium}></cx-content-browser>
      `);

      el.lastRequest = {
        ...el.lastRequest!,
        isSeeThrough: true,
        pageSize: 5,
        start: 10,
      };
      el.requestUpdate();
      await elementUpdated(el);

      expect(getGrid(el)).to.have.attribute('view', GridView.Medium);

      mock.fetchAndMergeAssets.resetHistory();

      getGrid(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-scroll-end', {
          bubbles: true,
          composed: true,
        }),
      );

      await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
      const req = mock.fetchAndMergeAssets.firstCall.args[0];
      expect(req.pageSize).to.equal(20);
      expect(req.start).to.equal(15);
    });

    it('uses 30 for Small', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${GridView.Small}></cx-content-browser>
      `);

      el.lastRequest = {
        ...el.lastRequest!,
        isSeeThrough: true,
        pageSize: 5,
        start: 10,
      };
      el.requestUpdate();
      await elementUpdated(el);

      expect(getGrid(el)).to.have.attribute('view', GridView.Small);

      mock.fetchAndMergeAssets.resetHistory();

      getGrid(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-scroll-end', {
          bubbles: true,
          composed: true,
        }),
      );

      await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
      const req = mock.fetchAndMergeAssets.firstCall.args[0];
      expect(req.pageSize).to.equal(30);
      expect(req.start).to.equal(15);
    });
  });

  it('applies defaultPageSize 15 for Large when loading more (scroll-end)', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);

    el.lastRequest = {
      ...el.lastRequest!,
      isSeeThrough: true,
      pageSize: 5,
      start: 10,
    };
    el.requestUpdate();
    await elementUpdated(el);

    getControlBar(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-view-change', {
        bubbles: true,
        composed: true,
        detail: { isSeeThrough: true, view: GridView.Large },
      }),
    );
    await elementUpdated(el);

    mock.fetchAndMergeAssets.resetHistory();

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-scroll-end', {
        bubbles: true,
        composed: true,
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.pageSize).to.equal(15);
    expect(req.start).to.equal(15);
  });

  it('applies defaultPageSize 20 for Medium when loading more (scroll-end)', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);

    el.lastRequest = {
      ...el.lastRequest!,
      isSeeThrough: true,
      pageSize: 5,
      start: 10,
    };
    el.requestUpdate();
    await elementUpdated(el);

    getControlBar(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-view-change', {
        bubbles: true,
        composed: true,
        detail: { isSeeThrough: true, view: GridView.Medium },
      }),
    );
    await elementUpdated(el);

    mock.fetchAndMergeAssets.resetHistory();

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-scroll-end', {
        bubbles: true,
        composed: true,
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.pageSize).to.equal(20);
    expect(req.start).to.equal(15);
  });

  it('applies defaultPageSize 30 for Small when loading more (scroll-end)', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);

    el.lastRequest = {
      ...el.lastRequest!,
      isSeeThrough: true,
      pageSize: 5,
      start: 10,
    };
    el.requestUpdate();
    await elementUpdated(el);

    getControlBar(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-view-change', {
        bubbles: true,
        composed: true,
        detail: { isSeeThrough: true, view: GridView.Small },
      }),
    );
    await elementUpdated(el);

    mock.fetchAndMergeAssets.resetHistory();

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-scroll-end', {
        bubbles: true,
        composed: true,
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.pageSize).to.equal(30);
    expect(req.start).to.equal(15);
  });

  it('handleSortOrderChange updates lastRequest, newlyChangedOption, and refetches', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);
    const bar = getControlBar(el);
    expect(bar).to.exist;

    bar!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-sort-order-change', {
        bubbles: true,
        composed: true,
        detail: {
          sortDirection: 'ascending',
          sortOrderName: 'title',
        },
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.sortOrderName).to.equal('title');
    expect(req.sortDirection).to.equal('ascending');
    expect(req.start).to.equal(0);
    expect(el.lastRequest?.sortOrderName).to.equal('title');
    expect(el.lastRequest?.sortDirection).to.equal('ascending');

    const barEl = bar as HTMLElement & { newlyChangedOption?: { type: OptionType; value: string } };
    expect(barEl.newlyChangedOption).to.deep.equal({
      type: OptionType.SORT_ORDER,
      value: 'title',
    });
  });

  it('handleFilterChange updates selectedFacets, resets start, and refetches', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);
    const bar = getControlBar(el);
    expect(bar).to.exist;

    /** Empty map avoids content-browser-control-filter repeating tags before mappedDisplayNames exists. */
    const selection: Record<string, string[]> = {};

    bar!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-filter-change', {
        bubbles: true,
        composed: true,
        detail: { selection },
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.selectedFacets).to.deep.equal(selection);
    expect(req.start).to.equal(0);
    expect(el.lastRequest?.selectedFacets).to.deep.equal(selection);
  });

  it('handleFolderSelectionChange updates folderId, folderTitle, start, and refetches', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: { collectionPath: '/collections' },
    });

    const browser = getBrowser(el);
    expect(browser).to.exist;

    mock.fetchAndMergeAssets.resetHistory();

    browser!.dispatchEvent(
      new CustomEvent('cx-selection-change', {
        bubbles: true,
        composed: true,
        detail: { selection: makeTreeItemSelection('folder-new', 'New folder') },
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.folderId).to.equal('folder-new');
    expect(req.start).to.equal(0);
    expect(el.lastRequest.folderId).to.equal('folder-new');
    expect(el.shadowRoot!.querySelector('cx-content-browser-header')).to.have.attribute(
      'folder-title',
      'New folder',
    );
  });

  it('handleFolderSelectionChange is a no-op when the selected item has no dataset id', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: { collectionPath: '/collections' },
    });

    const item = document.createElement('div');
    mock.fetchAndMergeAssets.resetHistory();

    getBrowser(el)!.dispatchEvent(
      new CustomEvent('cx-selection-change', {
        bubbles: true,
        composed: true,
        detail: { selection: [item] },
      }),
    );

    await new Promise((r) => setTimeout(r, 50));
    expect(mock.fetchAndMergeAssets.called).to.be.false;
  });

  it('handleFolderSelectionChange is a no-op when selection is empty', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: { collectionPath: '/collections' },
    });

    mock.fetchAndMergeAssets.resetHistory();

    getBrowser(el)!.dispatchEvent(
      new CustomEvent('cx-selection-change', {
        bubbles: true,
        composed: true,
        detail: { selection: [] },
      }),
    );

    await new Promise((r) => setTimeout(r, 50));
    expect(mock.fetchAndMergeAssets.called).to.be.false;
  });

  it('handleFolderSelectionChange is a no-op when folderId is unchanged', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      parameters: { collectionPath: '/collections' },
    });

    el.lastRequest = { ...el.lastRequest, folderId: 'folder-same', start: 0 };
    el.requestUpdate();
    await elementUpdated(el);

    mock.fetchAndMergeAssets.resetHistory();

    getBrowser(el)!.dispatchEvent(
      new CustomEvent('cx-selection-change', {
        bubbles: true,
        composed: true,
        detail: { selection: makeTreeItemSelection('folder-same', 'Same') },
      }),
    );

    await new Promise((r) => setTimeout(r, 50));
    expect(mock.fetchAndMergeAssets.called).to.be.false;
  });

  it('handleSearchChange updates searchText, resets start, and refetches', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);
    const bar = getControlBar(el);
    expect(bar).to.exist;

    mock.fetchAndMergeAssets.resetHistory();

    bar!.dispatchEvent(
      new CustomEvent('cx-content-browser-control-bar-search-change', {
        bubbles: true,
        composed: true,
        detail: { searchText: 'sunset photos' },
      }),
    );

    await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
    const req = mock.fetchAndMergeAssets.firstCall.args[0];
    expect(req.searchText).to.equal('sunset photos');
    expect(req.start).to.equal(0);
    expect(el.lastRequest.searchText).to.equal('sunset photos');
  });
});
