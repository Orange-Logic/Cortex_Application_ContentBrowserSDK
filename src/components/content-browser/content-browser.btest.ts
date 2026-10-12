import './content-browser';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
  waitUntil,
} from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { AxiosError } from 'axios';

import http from '@/api/api';
import type { GetAssetLinksResponse } from '@/api/asset/asset.types';
import { AssetApiEndpoint, MetadataApiEndpoint } from '@/api/endpoints';
import type { Asset, AssetVersion, GetAssetsRequest } from '@/types/asset';
import { MediaType } from '@/types/asset';
import {
  ContentBrowserFormatDialogVariant, GridView, OptionType, TABLE_VIEW, type TableColumn,
} from '@/types/content-browser';
import type { GetFolderRequest, GetFolderResponse } from '@/types/folder';

import sinon from 'sinon';

import { ROW_HEIGHT } from '../content-browser-table/content-browser-table';
import { OWN_FIELDS } from '../content-browser-table/content-browser-table.test-helpers';
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
    loading?: boolean;
    parameters?: Record<string, unknown> | null;
    totalCount?: number;
    unreadableFields?: string[];
  } = {},
) {
  const items = options.items ?? [];
  const totalCount = options.totalCount ?? items.length;
  const versionHistoryVersions = [makeVersion()];
  const unreadableFields = options.unreadableFields ?? [];
  const fetchAndMergeAssets = sinon.stub().resolves(undefined);

  return {
    _versionHistoryVersions: versionHistoryVersions,
    addAssetToFavorite: sinon.stub().resolves(true),
    fetchAndMergeAssets,
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
    // Stands for a controller that accepted the last page it was asked for.
    getNextPage: sinon.stub().callsFake(() => {
      const last = fetchAndMergeAssets.lastCall?.args[0] as { pageSize?: number; start?: number } | undefined;

      return { lastPageSize: last?.pageSize ?? 0, start: last ? (last.start ?? 0) + (last.pageSize ?? 0) : 0 };
    }),
    getData: () => ({
      availableExtensions: null,
      availableFacets: [],
      facets: [],
      isLoggedIn: options.isLoggedIn ?? true,
      items,
      loading: options.loading ?? false,
      parameters:
        options.parameters === undefined
          ? null
          : (options.parameters),
      request: host.lastRequest,
      sortOrders: {},
      totalCount,
      unreadableFields,
      userInfo: {
        avatar: 'https://placehold.co/100x100',
        email: 'john.doe@example.com',
        favoriteFolderRecordID: 'rec-1',
        fullName: 'John Doe',
        loginID: 'john.doe@example.com',
      },
    }),
    removeAssetFromFavorite: sinon.stub().resolves(true),
    updateAdditionalFields: sinon.stub(),
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

function getTable(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-table');
}

/** The design-system table the table view renders its rows with. */
function getCxTable(el: CxContentBrowser) {
  return getTable(el)?.shadowRoot?.querySelector('cx-table') ?? null;
}

function getTableRowElements(el: CxContentBrowser) {
  return [...(getCxTable(el)?.shadowRoot?.querySelectorAll<HTMLElement>('.tabulator-row') ?? [])];
}

/** A row's CTA button, once it has rendered its own shadow root. */
async function getTableRowAction(row: HTMLElement) {
  const cta = row.querySelector<HTMLElement & { updateComplete: Promise<unknown> }>('.content-browser-table__cta');

  await cta?.updateComplete;

  return cta ?? undefined;
}

/** `cx-table` builds Tabulator asynchronously, and the rows arrive only once it has. */
async function waitForTableRows(el: CxContentBrowser, count = 1) {
  await waitUntil(
    () => (getCxTable(el)?.tabulatorInstance?.getRows().length ?? 0) >= count && getTableRowElements(el).length > 0,
    `the table never held ${count} rows`,
    { interval: 20, timeout: 5000 },
  );
}

function getControlBar(el: CxContentBrowser) {
  return el.shadowRoot!.querySelector('cx-content-browser-control-bar') as CxContentBrowserControlBar;
}

const TABLE_COLUMNS: TableColumn[] = [
  { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
  { field: 'Dell.Snippet', lines: 2, title: 'Snippet' },
];

function selectTableView(el: CxContentBrowser) {
  getControlBar(el).dispatchEvent(
    new CustomEvent('cx-content-browser-control-view-change', {
      bubbles: true,
      composed: true,
      detail: { isSeeThrough: el.lastRequest.isSeeThrough, view: TABLE_VIEW },
    }),
  );
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

  it('shows the grid empty state only after an empty asset request finishes', async () => {
    const { el: emptyEl } = await fixtureWithMock(
      html`<cx-content-browser default-folder-id="folder-empty"></cx-content-browser>`,
    );
    expect(getGrid(emptyEl)).to.have.attribute('empty');

    const { el: loadingEl } = await fixtureWithMock(
      html`<cx-content-browser default-folder-id="folder-loading"></cx-content-browser>`,
      { loading: true },
    );
    expect(getGrid(loadingEl)).not.to.have.attribute('empty');

    const { el: populatedEl } = await fixtureWithMock(
      html`<cx-content-browser default-folder-id="folder-populated"></cx-content-browser>`,
      { items: [makeAsset()] },
    );
    expect(getGrid(populatedEl)).not.to.have.attribute('empty');
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

  it('passes can-pin-asset to the format dialog, independent from can-pin', async () => {
    const { el } = await fixtureWithMock(html`
      <cx-content-browser ?can-pin-asset=${true} ?can-pin=${false}></cx-content-browser>
    `);

    const dialog = getFormatDialog(el);
    expect(dialog.canPinAsset).to.be.true;
    expect(el.canPin).to.be.false;
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
    expect(openSpy.firstCall.args[0]).to.deep.equal({ ...openPayload, isAssetPinned: false });
    expect(el.selectedAssetId).to.equal(asset.id);
    expect(getGrid(el)!.getAttribute('selected-asset-id')).to.equal(asset.id);
  });

  it('does not emit cx-content-browser-pin-asset-lookup when can-pin-asset is absent', async () => {
    const asset = makeAsset();
    const openPayload = { asset, isFavorite: false, proxies: [] as unknown[] };

    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      fetchAssetByIDResult: openPayload,
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const openSpy = sinon.spy(dialog, 'open');
    let lookupCount = 0;
    el.addEventListener('cx-content-browser-pin-asset-lookup', () => {
      lookupCount += 1;
    });

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-click', {
        bubbles: true,
        composed: true,
        detail: { id: asset.id },
      }),
    );

    await waitUntil(() => openSpy.calledOnce);
    expect(lookupCount).to.equal(0);
    expect(openSpy.firstCall.args[0]).to.deep.equal({ ...openPayload, isAssetPinned: false });
  });

  it('emits cx-content-browser-pin-asset-lookup and opens with the mutated isAssetPinned', async () => {
    const asset = makeAsset();
    const openPayload = { asset, isFavorite: false, proxies: [] as unknown[] };

    const { el } = await fixtureWithMock(html`<cx-content-browser ?can-pin-asset=${true}></cx-content-browser>`, {
      fetchAssetByIDResult: openPayload,
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const openSpy = sinon.spy(dialog, 'open');
    let lookupAssetId: string | undefined;
    el.addEventListener('cx-content-browser-pin-asset-lookup', (event) => {
      lookupAssetId = event.detail.assetId;
      event.detail.isAssetPinned = true;
    });

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-click', {
        bubbles: true,
        composed: true,
        detail: { id: asset.id },
      }),
    );

    await waitUntil(() => openSpy.calledOnce);
    expect(lookupAssetId).to.equal(asset.id);
    expect(openSpy.firstCall.args[0]).to.deep.equal({ ...openPayload, isAssetPinned: true });
  });

  it('re-emits cx-content-browser-pin-asset-change when the format dialog requests a pin toggle', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser ?can-pin-asset=${true}></cx-content-browser>`);
    const dialog = getFormatDialog(el);

    const p = oneEvent(el, 'cx-content-browser-pin-asset-change');
    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-pin-asset-change', {
        bubbles: true,
        composed: true,
        detail: { assetId: 'rec-9', isPinned: false },
      }),
    );
    const ev = await p;

    expect(ev.detail).to.deep.equal({ assetId: 'rec-9', isPinned: false });
  });

  it('setIsAssetPinned delegates to the format dialog', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser ?can-pin-asset=${true}></cx-content-browser>`);
    const dialog = getFormatDialog(el);
    const spy = sinon.spy(dialog, 'setIsAssetPinned');

    el.setIsAssetPinned(true);

    expect(spy).to.have.been.calledWith(true);
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
    expect(openSpy.firstCall.args[0]).to.deep.equal({ ...openPayload, isAssetPinned: false });
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

  it('emits cx-content-browser-selected-asset for a file-less asset that resolves to no link', async () => {
    // Regression, L-29Q5K0: digitized = 0 (e.g. a text fragment) — GetAssetLink succeeds and returns the
    // requested ExtraFields, but there is no file to link to. Gating the callback on imageUrl (2.3.0) swallowed
    // the selection entirely, giving the host neither an event nor an error. Reported at
    // https://link.orangelogic.com/asset-management/2P7YOHEHMD263?DetailTab=Overview&Anchor=2P7YOL7KIP92
    const asset = makeAsset({ extension: '', imageUrl: '' });
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
      getAssetLinkResult: {
        data: [{ extraFields: { 'Dell.Snippet': 'A fragment of text' }, imageUrl: '' }],
        isError: false,
      },
      items: [asset],
      totalCount: 1,
    });

    const dialog = getFormatDialog(el);
    const hideSpy = sinon.spy(dialog, 'hide');
    const p = oneEvent(el, 'cx-content-browser-selected-asset');

    dialog.dispatchEvent(
      new CustomEvent('cx-content-browser-format-dialog-proxy-confirm', {
        bubbles: true,
        composed: true,
        detail: {
          asset,
          selectedProxyMetadata: null,
          useRepresentative: false,
        },
      }),
    );

    const ev = await p;
    expect(ev.detail).to.be.an('array').with.lengthOf(1);
    expect(ev.detail[0].extraFields['Dell.Snippet']).to.equal('A fragment of text');
    expect(ev.detail[0].imageUrl).to.equal('');
    expect(hideSpy).to.have.been.called;
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
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser default-folder-id="library-id"></cx-content-browser>`);
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
      mock.getNextPage.returns({ lastPageSize: 5, start: 15 });

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
      mock.getNextPage.returns({ lastPageSize: 5, start: 15 });

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
      mock.getNextPage.returns({ lastPageSize: 5, start: 15 });

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

  it('does not ask for a next page while the controller has a request of the list queued or in flight', async () => {
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser default-folder-id="library"></cx-content-browser>`);

    // The grid reports its first size 200 ms after it mounts. Let that settle before the host is watched.
    await waitUntil(() => el.lastRequest?.pageSize !== undefined);
    mock.fetchAndMergeAssets.resetHistory();
    mock.getNextPage.returns(null);
    const { pageSize, start } = el.lastRequest!;

    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-scroll-end', { bubbles: true, composed: true }),
    );
    getGrid(el)!.dispatchEvent(
      new CustomEvent('cx-content-browser-grid-resize', {
        bubbles: true,
        composed: true,
        detail: { columnCount: 8, rowCount: 8 },
      }),
    );
    await elementUpdated(el);

    expect(mock.fetchAndMergeAssets.called).to.equal(false);
    expect(el.lastRequest!.start, 'the host keeps its start').to.equal(start);
    expect(el.lastRequest!.pageSize, 'the host keeps its page size').to.equal(pageSize);
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
    mock.getNextPage.returns({ lastPageSize: 5, start: 15 });

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
    mock.getNextPage.returns({ lastPageSize: 5, start: 15 });

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
    mock.getNextPage.returns({ lastPageSize: 5, start: 15 });

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
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser default-folder-id="library-id"></cx-content-browser>`);
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
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser default-folder-id="library-id"></cx-content-browser>`);
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

  describe('initial folder', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, toFake: ['setTimeout', 'clearTimeout'] });
    });

    afterEach(() => {
      clock.restore();
    });

    function dispatchGridResize(el: CxContentBrowser) {
      getGrid(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-resize', {
          bubbles: true,
          composed: true,
          detail: { columnCount: 5, rowCount: 2 },
        }),
      );
    }

    function selectFolder(el: CxContentBrowser, id: string, name: string) {
      getBrowser(el)!.dispatchEvent(
        new CustomEvent('cx-selection-change', {
          bubbles: true,
          composed: true,
          detail: { selection: makeTreeItemSelection(id, name) },
        }),
      );
    }

    it('holds the first grid fetch until the initial folder is selected, then fetches once in it', async () => {
      let resolveFolders!: (response: GetFolderResponse) => void;
      const fetchFoldersResult = new Promise<GetFolderResponse>((resolve) => {
        resolveFolders = resolve;
      });
      const fetchFolders = sinon.stub(customElements.get('cx-folder-select-tree')!.prototype, 'fetchFolders')
        .returns(fetchFoldersResult);
      const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
        parameters: { collectionPath: '/collections' },
      });

      mock.fetchAndMergeAssets.resetHistory();
      dispatchGridResize(el);
      await clock.tickAsync(2999);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(0);
      expect(el.lastRequest.pageSize).to.be.greaterThan(0);
      expect(fetchFolders.callCount).to.be.greaterThan(0);

      resolveFolders({
        data: [{ docType: 'Folder', fullPath: '/Library', hasChildren: false, id: 'library-id', title: 'Library' }],
        hasMore: false,
        totalCount: 1,
      });
      await clock.tickAsync(0);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      const req = mock.fetchAndMergeAssets.firstCall.args[0];
      expect(req.folderId).to.equal('library-id');
      expect(req.start).to.equal(0);
      expect(req.pageSize).to.equal(el.lastRequest.pageSize);
      await clock.tickAsync(3000);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
    });

    it('resumes normal grid fetches once the initial folder is selected', async () => {
      const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
        parameters: { collectionPath: '/collections' },
      });

      selectFolder(el, 'library-id', 'Library');
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      mock.fetchAndMergeAssets.resetHistory();

      dispatchGridResize(el);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      expect(mock.fetchAndMergeAssets.firstCall.args[0].folderId).to.equal('library-id');
    });

    it('fetches on grid resize right away when a default folder is set', async () => {
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser default-folder-id="external"></cx-content-browser>`,
        { parameters: { collectionPath: '/collections' } },
      );

      mock.fetchAndMergeAssets.resetHistory();
      dispatchGridResize(el);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      expect(mock.fetchAndMergeAssets.firstCall.args[0].folderId).to.equal('external');
    });

    it('shows the table as loading, not empty, until the initial folder is selected', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${TABLE_VIEW} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `, { parameters: { collectionPath: '/collections' } });

      expect(getTable(el)!.hasAttribute('loading')).to.be.true;
      expect(getTable(el)!.hasAttribute('empty')).to.be.false;

      selectFolder(el, 'library-id', 'Library');
      await elementUpdated(el);

      expect(getTable(el)!.hasAttribute('loading')).to.be.false;
      expect(getTable(el)!.hasAttribute('empty')).to.be.true;
    });

    it('holds the table-columns refetch until the initial folder is selected, then fetches once in it', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `, { parameters: { collectionPath: '/collections' } });
      mock.fetchAndMergeAssets.resetHistory();

      el.tableColumns = [{ field: 'Dell.Snippet', title: 'Snippet' }];
      await elementUpdated(el);

      expect(mock.updateAdditionalFields.calledWith(['Dell.Snippet'])).to.be.true;
      expect(mock.fetchAndMergeAssets.callCount).to.equal(0);

      selectFolder(el, 'library-id', 'Library');
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      expect(mock.fetchAndMergeAssets.firstCall.args[0].folderId).to.equal('library-id');
      expect(mock.fetchAndMergeAssets.firstCall.args[0].start).to.equal(0);
    });

    it('falls back to the held unscoped fetch when no folder is selected in time', async () => {
      const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
        parameters: { collectionPath: '/collections' },
      });

      mock.fetchAndMergeAssets.resetHistory();
      dispatchGridResize(el);
      await clock.tickAsync(2999);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(0);

      await clock.tickAsync(1);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      expect(mock.fetchAndMergeAssets.firstCall.args[0].folderId).to.not.be.ok;
    });

    ['selection', 'timeout'].forEach((resolution) => {
      it(`holds control changes until folder ${resolution} and preserves their latest values`, async () => {
        const { el, mock } = await fixtureWithMock(html`
          <cx-content-browser default-search-text="old search" default-is-see-through></cx-content-browser>
        `, { parameters: { collectionPath: '/collections' } });
        mock.fetchAndMergeAssets.resetHistory();
        dispatchGridResize(el);

        for (const [type, detail] of [
          ['cx-content-browser-control-bar-search-change', { searchText: '' }],
          ['cx-content-browser-control-filter-change', { selection: {} }],
          ['cx-content-browser-control-sort-order-change', { sortDirection: 'descending', sortOrderName: 'title' }],
          ['cx-content-browser-control-view-change', { isSeeThrough: false, view: GridView.Medium }],
        ] as const) {
          getControlBar(el).dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
          expect(mock.fetchAndMergeAssets.callCount).to.equal(0);
        }

        await clock.tickAsync(2999);
        expect(mock.fetchAndMergeAssets.callCount).to.equal(0);
        if (resolution === 'selection') {
          selectFolder(el, 'library-id', 'Library');
        } else {
          await clock.tickAsync(1);
        }
        expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
        expect(mock.fetchAndMergeAssets.firstCall.args[0]).to.include({
          isSeeThrough: false,
          searchText: '',
          sortDirection: 'descending',
          sortOrderName: 'title',
          start: 0,
        });
        expect(mock.fetchAndMergeAssets.firstCall.args[0].selectedFacets).to.deep.equal({});
      });
    });

    it('cancels the timer on disconnect and resumes an unresolved wait on reconnect', async () => {
      const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
        parameters: { collectionPath: '/collections' },
      });
      dispatchGridResize(el);
      const parent = el.parentElement!;
      await clock.tickAsync(1000);
      el.remove();
      await clock.tickAsync(3000);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(0);

      parent.append(el);
      dispatchGridResize(el);
      await clock.tickAsync(2999);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(0);
      await clock.tickAsync(1);
      expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
    });

    ['selection', 'timeout'].forEach((resolution) => {
      it(`does not restart a resolved wait on reconnect after ${resolution}`, async () => {
        const { el, mock } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`, {
          parameters: { collectionPath: '/collections' },
        });
        dispatchGridResize(el);
        if (resolution === 'selection') {
          selectFolder(el, 'library-id', 'Library');
        } else {
          await clock.tickAsync(3000);
        }
        expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
        const parent = el.parentElement!;
        el.remove();
        parent.append(el);
        await clock.tickAsync(3000);
        expect(mock.fetchAndMergeAssets.callCount).to.equal(1);
      });
    });
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
    const { el, mock } = await fixtureWithMock(html`<cx-content-browser default-folder-id="library-id"></cx-content-browser>`);
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

  it('forwards the active searchText to the control bar', async () => {
    const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);

    el.lastRequest = { ...el.lastRequest, searchText: 'HU1405JO' };
    el.requestUpdate();
    await elementUpdated(el);

    const bar = getControlBar(el);
    expect(bar.getAttribute('search-text')).to.equal('HU1405JO');
    expect(bar.searchText).to.equal('HU1405JO');
  });

  it('displays a search term restored through default-search-text', async () => {
    const { el } = await fixtureWithMock(
      html`<cx-content-browser default-search-text="HU1405JO"></cx-content-browser>`,
    );

    expect(el.lastRequest.searchText).to.equal('HU1405JO');

    el.requestUpdate();
    await elementUpdated(el);

    const bar = getControlBar(el);
    expect(bar.getAttribute('search-text')).to.equal('HU1405JO');
    expect(bar.searchText).to.equal('HU1405JO');
  });
  describe('table view', () => {
    it('offers the table only once the host has configured columns', async () => {
      const { el } = await fixtureWithMock(html`<cx-content-browser></cx-content-browser>`);
      expect(getControlBar(el).canUseTable).to.be.false;

      el.tableColumns = TABLE_COLUMNS;
      await elementUpdated(el);

      expect(getControlBar(el).canUseTable).to.be.true;
      expect(getGrid(el), 'grid stays until the view is switched').to.exist;
      expect(getTable(el)).to.not.exist;
    });

    it('swaps the grid for the table on a view change, carrying the configured columns', async () => {
      const { el } = await fixtureWithMock(
        html`<cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
      );

      selectTableView(el);
      await elementUpdated(el);

      const table = getTable(el)!;
      expect(table).to.exist;
      expect(getGrid(el)).to.not.exist;
      expect((table as unknown as { columns: TableColumn[] }).columns).to.deep.equal(TABLE_COLUMNS);
    });

    it('renders the table from the start when it is the configured default view', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          default-grid-view=${TABLE_VIEW}
          .tableColumns=${TABLE_COLUMNS}
        ></cx-content-browser>
      `);

      expect(getTable(el)).to.exist;
      expect(getGrid(el)).to.not.exist;
    });

    it('falls back to the grid when the table is the default view but no columns are configured', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${TABLE_VIEW}></cx-content-browser>
      `);

      expect(getTable(el)).to.not.exist;
      expect(getGrid(el)).to.have.attribute('view', GridView.Medium);
    });

    it('pages 30 rows at a time in the table view', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser
          default-grid-view=${TABLE_VIEW}
          .tableColumns=${TABLE_COLUMNS}
        ></cx-content-browser>
      `);

      el.lastRequest = {
        ...el.lastRequest!,
        pageSize: 5,
        start: 10,
      };
      el.requestUpdate();
      await elementUpdated(el);
      mock.fetchAndMergeAssets.resetHistory();

      getTable(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-scroll-end', { bubbles: true, composed: true }),
      );

      await waitUntil(() => mock.fetchAndMergeAssets.calledOnce);
      expect(mock.fetchAndMergeAssets.firstCall.args[0].pageSize).to.equal(30);
    });

    it('opens the format dialog for a row activated in the table', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset, isFavorite: false, proxies: [] },
          items: [asset],
          totalCount: 1,
        },
      );

      selectTableView(el);
      await elementUpdated(el);

      getTable(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-click', {
          bubbles: true,
          composed: true,
          detail: { id: 'frag-1' },
        }),
      );

      await waitUntil(() => mock.fetchAssetByID.calledOnce);
      expect(mock.fetchAssetByID).to.have.been.calledWith('frag-1');
    });

    it('hands the host a file-less selection made from the table', async () => {
      // P0 item 3, L-429EVG: the table exists so a text fragment (digitized = 0) can be picked for its
      // metadata alone. The callback must survive the empty link, as restored by L-29Q5K0.
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el } = await fixtureWithMock(
        html`<cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          getAssetLinkResult: {
            data: [{ extraFields: { 'Dell.Snippet': 'A fragment of text' }, imageUrl: '' }],
            isError: false,
          },
          items: [asset],
          totalCount: 1,
        },
      );

      selectTableView(el);
      await elementUpdated(el);

      const p = oneEvent(el, 'cx-content-browser-selected-asset');
      getFormatDialog(el).dispatchEvent(
        new CustomEvent('cx-content-browser-format-dialog-proxy-confirm', {
          bubbles: true,
          composed: true,
          detail: { asset, selectedProxyMetadata: null, useRepresentative: false },
        }),
      );
      const ev = await p;

      expect(ev.detail[0].extraFields['Dell.Snippet']).to.equal('A fragment of text');
      expect(ev.detail[0].imageUrl).to.equal('');
    });

    it('shows the skipped dialog when an auto-confirmed insert fails', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${true} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset, isFavorite: false, proxies: [] },
          items: [asset],
          totalCount: 1,
        },
      );
      mock.getAssetLink.rejects(new Error('link generation failed'));

      selectTableView(el);
      await elementUpdated(el);

      getTable(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-click', {
          bubbles: true,
          composed: true,
          detail: { id: 'frag-1' },
        }),
      );

      // The shortcut skipped the dialog, so there is nowhere to report into and the SDK has no
      // error event. The dialog it skipped is the fallback: its confirm button is the retry.
      await waitUntil(() => getFormatDialog(el).isDialogOpen);
      expect(el.selectedAssetId).to.equal('frag-1');
    });

    it('ignores a second row activated while an insert is still in flight', async () => {
      const first = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const second = makeAsset({ extension: '', id: 'frag-2', imageUrl: '' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${true} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset: first, isFavorite: false, proxies: [] },
          items: [first, second],
          totalCount: 2,
        },
      );
      // Never settles, so the first insert stays outstanding for the whole test.
      mock.getAssetLink.returns(new Promise(() => {}));

      selectTableView(el);
      await elementUpdated(el);

      const activate = (id: string) => getTable(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-click', {
          bubbles: true,
          composed: true,
          detail: { id },
        }),
      );

      activate('frag-1');
      await waitUntil(() => mock.getAssetLink.calledOnce);
      activate('frag-2');
      await elementUpdated(el);

      // Without the in-flight guard the second row hands its asset over on top of the first.
      expect(mock.getAssetLink).to.have.been.calledOnce;
      expect(el.selectedAssetId).to.equal('frag-1');
    });

    it('opens the format dialog from a row\'s CTA in the rendered table, never from a click on the row', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-click', imageUrl: '', recordId: 'rec-click' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser default-grid-view=${TABLE_VIEW} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset, isFavorite: false, proxies: [] },
          items: [asset],
          totalCount: 1,
        },
      );

      await waitForTableRows(el);
      getTableRowElements(el)[0].querySelector<HTMLElement>('.tabulator-cell')!.click();

      // The host asks for the asset in the same task as the hand-over, so a row click that reached it
      // has asked by now.
      expect(mock.fetchAssetByID.called, 'the row click reached the host').to.equal(false);

      (await getTableRowAction(getTableRowElements(el)[0]))!.click();

      await waitUntil(() => mock.fetchAssetByID.calledOnce, 'the CTA never reached the host');
      expect(mock.fetchAssetByID.firstCall.args[0]).to.equal('frag-click');
      await waitUntil(() => getFormatDialog(el).isDialogOpen, 'the CTA never opened the format dialog');
    });

    it('starts the table 18px below the control bar: the shared 2px spacing, then its own 16px gap', async () => {
      // The themed value of the shared spacing, which the unthemed test page leaves empty.
      const { el } = await fixtureWithMock(
        html`<cx-content-browser
          style="--cx-spacing-3x-small: 2px"
          default-grid-view=${TABLE_VIEW}
          .tableColumns=${TABLE_COLUMNS}
        ></cx-content-browser>`,
        { items: [makeAsset({ extension: '', id: 'frag-gap', imageUrl: '' })], totalCount: 1 },
      );

      await waitForTableRows(el);

      const gap = getCxTable(el)!.getBoundingClientRect().top - getControlBar(el).getBoundingClientRect().bottom;

      expect(Math.round(gap)).to.equal(18);
    });

    it('marks the row the host is working on in the rendered table', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-busy', imageUrl: '', recordId: 'rec-busy' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser default-grid-view=${TABLE_VIEW} .autoSelectFormat=${true} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        { items: [asset], totalCount: 1 },
      );
      mock.fetchAssetByID.returns(new Promise(() => {}));

      await waitForTableRows(el);
      (await getTableRowAction(getTableRowElements(el)[0]))!.click();

      await waitUntil(() => getTableRowElements(el)[0].getAttribute('aria-current') === 'true',
        'the in-flight row was never marked', { interval: 20, timeout: 3000 });
      await waitUntil(async () => Boolean((await getTableRowAction(getTableRowElements(el)[0]))?.hasAttribute('loading')),
        'the in-flight row never spun its CTA', { interval: 20, timeout: 3000 });
    });
  });

  describe('two columns on one field', () => {
    /**
     * The resize feature keys its widths, its DOM lookups and its host event on `field`, so a
     * duplicate resizes both columns at once and reports a width the host cannot attribute.
     * Case-insensitive because the search call sends one field per casing and keys the response
     * under whichever it sent, which leaves the later column blank regardless.
     */
    /**
     * Ordered first deliberately: it is the only one here that does not render the table, so a
     * regression reports itself by name. Lit's `repeat` does not tolerate duplicate keys, and a
     * duplicate-keyed render wedges the runner rather than failing cleanly.
     */
    it('asks the fetch controller for that field once', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `);
      mock.updateAdditionalFields.resetHistory();

      el.tableColumns = [
        { field: 'Dell.Snippet', title: 'Snippet' },
        { field: 'dell.snippet', title: 'Snippet lowercased' },
      ];
      await elementUpdated(el);

      expect(mock.updateAdditionalFields.args).to.deep.equal([[['Dell.Snippet']]]);
    });
    it('renders the first column and drops the duplicate', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          .tableColumns=${[
            { field: 'Dell.Snippet', title: 'Snippet', width: '100px' },
            { field: 'Dell.Snippet', title: 'Snippet again', width: '200px' },
          ]}
        ></cx-content-browser>
      `);
      selectTableView(el);
      await elementUpdated(el);

      const columns = getTable(el)!.columns;

      expect(columns).to.have.lengthOf(1);
      expect(columns[0].title).to.equal('Snippet');
    });

    it('drops a column whose field differs from an earlier one only in case', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          .tableColumns=${[
            { field: 'Dell.Snippet', title: 'Snippet' },
            { field: 'dell.snippet', title: 'Snippet lowercased' },
          ]}
        ></cx-content-browser>
      `);
      selectTableView(el);
      await elementUpdated(el);

      const columns = getTable(el)!.columns;

      expect(columns).to.have.lengthOf(1);
      expect(columns[0].title).to.equal('Snippet');
    });

  });

  describe('a column field padded with whitespace', () => {
    /**
     * A padded name travels as one string to the search call and to the cell lookup, so it matches
     * no Cortex field and the column renders empty. It is trimmed at the boundary that drops
     * duplicates, and before that check, so that two fields differing only in padding still
     * collapse to one column.
     */
    it('asks the fetch controller for the trimmed field name', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `);
      mock.updateAdditionalFields.resetHistory();

      el.tableColumns = [{ field: 'CoreField.CaptionLong ', title: 'Description' }];
      await elementUpdated(el);

      expect(mock.updateAdditionalFields.args).to.deep.equal([[['CoreField.CaptionLong']]]);
    });

    it('renders the cell the response carries under the trimmed field name', async () => {
      const { el } = await fixtureWithMock(
        html`
          <cx-content-browser
            .tableColumns=${[{ field: 'CoreField.CaptionLong ', title: 'Description' }]}
          ></cx-content-browser>
        `,
        {
          items: [makeAsset({ 'CoreField.CaptionLong': 'A caption' } as unknown as Partial<Asset>)],
          totalCount: 1,
        },
      );
      selectTableView(el);
      await elementUpdated(el);

      await waitForTableRows(el);
      const cell = getTableRowElements(el)[0].querySelector('.tabulator-cell');

      expect(cell?.textContent?.trim()).to.equal('A caption');
    });

    it('drops a column that repeats an earlier field once both are trimmed', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          .tableColumns=${[
            { field: 'Dell.Snippet', title: 'Snippet' },
            { field: 'Dell.Snippet ', title: 'Snippet padded' },
          ]}
        ></cx-content-browser>
      `);
      selectTableView(el);
      await elementUpdated(el);

      const columns = getTable(el)!.columns;

      expect(columns).to.have.lengthOf(1);
      expect(columns[0].title).to.equal('Snippet');
    });

    it('trims a leading pad too, which fails the same way', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `);
      mock.updateAdditionalFields.resetHistory();

      el.tableColumns = [{ field: ' CoreField.CaptionLong', title: 'Description' }];
      await elementUpdated(el);

      expect(mock.updateAdditionalFields.args).to.deep.equal([[['CoreField.CaptionLong']]]);
    });

    it('offers no table when a column field is nothing but whitespace', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${[{ field: '  ', title: 'Blank' }]}></cx-content-browser>
      `);
      await elementUpdated(el);

      selectTableView(el);
      await elementUpdated(el);

      expect(getTable(el)).to.not.exist;
      expect(getGrid(el)).to.exist;
    });

    it('reports the trimmed field name when the padded column is resized', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          .tableColumns=${[
            { field: 'CoreField.CaptionLong ', title: 'Description', width: '200px' },
            { field: 'Dell.Snippet', title: 'Snippet' },
          ]}
        ></cx-content-browser>
      `, { items: [makeAsset({ id: 'frag-padded', recordId: 'rec-padded' })], totalCount: 1 });
      selectTableView(el);
      await elementUpdated(el);

      await waitForTableRows(el);
      const table = getTable(el)!;
      const handle = getCxTable(el)!.shadowRoot!.querySelector<HTMLElement>('.tabulator-col-resize-handle')!;
      const resized = oneEvent(table, 'cx-content-browser-table-column-resize');
      const { left, top, width } = handle.getBoundingClientRect();
      const init = { bubbles: true, button: 0, clientY: top + 1, composed: true };

      // Tabulator drags with the press on the handle and the move and release on the document body.
      handle.dispatchEvent(new MouseEvent('mousedown', { ...init, clientX: left + width / 2 }));
      document.body.dispatchEvent(new MouseEvent('mousemove', { ...init, clientX: left + width / 2 + 30 }));
      document.body.dispatchEvent(new MouseEvent('mouseup', { ...init, clientX: left + width / 2 + 30 }));

      expect((await resized).detail.field).to.equal('CoreField.CaptionLong');
    });
  });

  describe('table-columns reconfigured after mount', () => {
    /**
     * The controller takes its field list once, at construction. A host that reconfigures columns
     * later would otherwise keep fetching the original set, leaving the new columns' cells blank.
     */
    it('asks the fetch controller for the new column fields', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `);
      mock.updateAdditionalFields.resetHistory();

      el.tableColumns = [
        { field: 'CoreField.Identifier', title: 'Identifier' },
        { field: 'Dell.Snippet', title: 'Snippet' },
      ];
      await elementUpdated(el);

      expect(mock.updateAdditionalFields).to.have.been.calledOnceWith([
        'CoreField.Identifier',
        'Dell.Snippet',
      ]);
    });

    it('restarts the refetch from the first page so scrolled-in rows are replaced', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser default-folder-id="library-id" .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `);
      el.lastRequest = { ...el.lastRequest, start: 30 };
      await elementUpdated(el);
      mock.fetchAndMergeAssets.resetHistory();

      el.tableColumns = [{ field: 'Dell.Snippet', title: 'Snippet' }];
      await elementUpdated(el);

      // Past the first page the controller appends and de-duplicates by recordId, which would keep
      // the field-less rows it already had.
      expect(mock.fetchAndMergeAssets).to.have.been.calledOnce;
      expect(mock.fetchAndMergeAssets.firstCall.args[0].start).to.equal(0);
    });

    it('refetches through the stateful path so the rows on screen are replaced', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser default-folder-id="library-id" .tableColumns=${TABLE_COLUMNS}></cx-content-browser>
      `);
      mock.fetchAndMergeAssets.resetHistory();
      mock.fetchAssets.resetHistory();

      el.tableColumns = [{ field: 'Dell.Snippet', title: 'Snippet' }];
      await elementUpdated(el);

      // fetchAssets only returns the response; it refreshes no state, so the table would keep
      // rendering the rows it already had.
      expect(mock.fetchAndMergeAssets).to.have.been.calledOnce;
      expect(mock.fetchAssets).to.not.have.been.called;
    });
  });

  describe('table-columns from an attribute', () => {
    /**
     * A host that stringifies an array into the attribute hands Lit `""` or `"[object Object]"`.
     * The stock Array converter turns both into null, which used to throw on every read.
     */
    it('treats an unreadable table-columns attribute as no columns instead of throwing', async () => {
      const el = await fixture<CxContentBrowser>(html`
        <cx-content-browser table-columns=${String([])}></cx-content-browser>
      `);
      await elementUpdated(el);

      expect(el.tableColumns).to.deep.equal([]);
    });

    it('treats a stringified object array as no columns instead of throwing', async () => {
      const el = await fixture<CxContentBrowser>(html`
        <cx-content-browser table-columns=${String([{ field: 'F', title: 'T' }])}></cx-content-browser>
      `);
      await elementUpdated(el);

      expect(el.tableColumns).to.deep.equal([]);
    });

    /**
     * The outer-array guard let a bad entry through, and `field` is dereferenced while the fetch
     * controller is being built — a throw there left the controller unassigned and the picker blank.
     */
    it('drops entries that carry no usable field instead of blanking the picker', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          .tableColumns=${[null, {}, { title: 'No field' }, { field: '', title: 'Empty' }, ...TABLE_COLUMNS] as TableColumn[]}
        ></cx-content-browser>
      `);
      await elementUpdated(el);

      selectTableView(el);
      await elementUpdated(el);

      const table = getTable(el)!;
      expect(table).to.exist;
      expect((table as unknown as { columns: TableColumn[] }).columns).to.deep.equal(TABLE_COLUMNS);
    });

    it('offers no table when every configured column is unusable', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser .tableColumns=${[null, {}] as unknown as TableColumn[]}></cx-content-browser>
      `);
      await elementUpdated(el);

      selectTableView(el);
      await elementUpdated(el);

      expect(getTable(el)).to.not.exist;
      expect(getGrid(el)).to.exist;
    });

    it('keeps a column whose title is missing, since only field is dereferenced', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser
          .tableColumns=${[{ field: 'CoreField.Identifier' }] as unknown as TableColumn[]}
        ></cx-content-browser>
      `);
      await elementUpdated(el);

      selectTableView(el);
      await elementUpdated(el);

      const table = getTable(el)!;
      expect((table as unknown as { columns: TableColumn[] }).columns).to.have.lengthOf(1);
    });

    it('reads a valid JSON table-columns attribute', async () => {
      const el = await fixture<CxContentBrowser>(html`
        <cx-content-browser
          table-columns=${JSON.stringify([{ field: 'CoreField.Identifier', title: 'Identifier' }])}
        ></cx-content-browser>
      `);
      await elementUpdated(el);

      expect(el.tableColumns).to.deep.equal([{ field: 'CoreField.Identifier', title: 'Identifier' }]);
    });
  });

  it('passes simple-pick through to the fetch controller and forces proxies off in the dialog', async () => {
    const { el } = await fixtureWithMock(html`
      <cx-content-browser ?simple-pick=${true} ?can-use-proxies=${true}></cx-content-browser>
    `);

    const dialog = getFormatDialog(el);

    expect(el.simplePick).to.equal(true);
    expect(dialog.canUseProxies).to.equal(false);
  });

  it('asks fetchAssetByID to skip the available-proxies lookup in simple-pick mode', async () => {
    const asset = makeAsset();
    const openPayload = { asset, isFavorite: false, proxies: [] as unknown[] };
    const { el, mock } = await fixtureWithMock(
      html`<cx-content-browser ?simple-pick=${true}></cx-content-browser>`,
      { fetchAssetByIDResult: openPayload as unknown as OpenFormatPayload, items: [asset], totalCount: 1 },
    );

    await el.selectAsset(asset.id);

    expect(mock.fetchAssetByID).to.have.been.calledOnceWith(asset.id, sinon.match({ simplePick: true }));
  });

  it('emits the selected asset without a getAssetLink request in simple-pick mode', async () => {
    const asset = makeAsset({ imageUrl: 'https://cdn.example/large-size-preview.jpg' });
    const { el, mock } = await fixtureWithMock(
      html`<cx-content-browser ?simple-pick=${true}></cx-content-browser>`,
      { items: [asset], totalCount: 1 },
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
          proxyPreference: '',
          selectedProxyMetadata: {
            cdnName: null,
            extension: '.jpg',
            height: null,
            isCustomFormat: false,
            permanentLink: null,
            proxyLabel: null,
            proxyName: null,
            width: null,
          },
          useRepresentative: false,
        },
      }),
    );

    const ev = await p;

    expect(mock.getAssetLink).to.not.have.been.called;
    expect(ev.detail).to.be.an('array').with.lengthOf(1);
    expect(ev.detail[0].imageUrl).to.equal('https://cdn.example/large-size-preview.jpg');
    expect(ev.detail[0].assetLinkInfo?.permanentLink).to.equal('https://cdn.example/large-size-preview.jpg');
  });

  it('still requests a transformation on confirm when simple-pick is off', async () => {
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
        detail: { asset, extension: '.jpg', proxyPreference: '', useRepresentative: false },
      }),
    );

    await p;

    expect(mock.getAssetLink).to.have.been.calledOnce;
  });


  describe('a column Cortex flags as unreadable', () => {
    /**
     * L-42BJ3T: the DAM does not show a column for a secured field the user cannot read, so the
     * table must not show one either. Cortex flags such a field on the search response, and still
     * sends it on every item, with an empty value.
     */
    const COLUMNS: TableColumn[] = [
      { field: 'CoreField.Identifier', title: 'Identifier', width: '160px' },
      { field: 'Custom.Date', title: 'Date' },
      { field: 'Dell.Snippet', title: 'Snippet' },
    ];

    const tableRoot = (el: CxContentBrowser) => getCxTable(el)!.shadowRoot!;

    /** A header or a cell that Tabulator hides stays in the DOM with no box. */
    const isShown = (element: Element) => element.getClientRects().length > 0;

    /** The host's columns only: the filler and the CTA column always show. */
    const shownHeaderTitles = (el: CxContentBrowser) => [...tableRoot(el).querySelectorAll(`.tabulator-col:not(${OWN_FIELDS})`)]
      .filter(isShown)
      .map((header) => header.querySelector('.tabulator-col-title')?.textContent?.trim() ?? '');

    const shownCellCounts = (el: CxContentBrowser) => getTableRowElements(el)
      .map((row) => [...row.querySelectorAll(`.tabulator-cell:not(${OWN_FIELDS})`)].filter(isShown).length);

    const headerWidth = (el: CxContentBrowser, title: string) => {
      const header = [...tableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col')]
        .find((column) => column.querySelector('.tabulator-col-title')?.textContent?.trim() === title);

      return header ? Math.round(header.getBoundingClientRect().width) : 0;
    };

    const waitForHeaders = (el: CxContentBrowser, titles: string[], message: string) => waitUntil(
      () => getCxTable(el)?.tabulatorInstance?.initialized === true && shownHeaderTitles(el).join('|') === titles.join('|'),
      message,
      { interval: 20, timeout: 5000 },
    );

    it('hands the table the configured fields Cortex flags, spelled as configured', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${TABLE_VIEW} .tableColumns=${COLUMNS}></cx-content-browser>
      `, { unreadableFields: [' custom.DATE ', 'Custom.Other'] });
      const table = getTable(el)!;

      expect(table.hiddenFields).to.deep.equal(['Custom.Date']);
      expect(table.columns.map((column) => column.field))
        .to.deep.equal(['CoreField.Identifier', 'Custom.Date', 'Dell.Snippet']);
    });

    it('keeps asking Cortex for the hidden field, so that the next response can flag it again', async () => {
      const { el, mock } = await fixtureWithMock(html`
        <cx-content-browser default-folder-id="library-id" .tableColumns=${COLUMNS}></cx-content-browser>
      `, { unreadableFields: ['Custom.Date'] });
      mock.updateAdditionalFields.resetHistory();

      el.tableColumns = [...COLUMNS];
      await elementUpdated(el);

      expect(mock.updateAdditionalFields.args)
        .to.deep.equal([[['CoreField.Identifier', 'Custom.Date', 'Dell.Snippet']]]);
    });

    it('keeps the table view when Cortex flags each column', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${TABLE_VIEW} .tableColumns=${COLUMNS}></cx-content-browser>
      `, { items: [makeAsset()], unreadableFields: ['CoreField.Identifier', 'Custom.Date', 'Dell.Snippet'] });

      expect(getControlBar(el).canUseTable).to.equal(true);
      expect(getGrid(el) === null).to.equal(true);
      expect(getTable(el)!.hiddenFields).to.deep.equal(['CoreField.Identifier', 'Custom.Date', 'Dell.Snippet']);
    });

    it('keeps a flagged column hidden over the table while a list with no rows loads', async () => {
      const { el } = await fixtureWithMock(html`
        <cx-content-browser default-grid-view=${TABLE_VIEW} .tableColumns=${COLUMNS}></cx-content-browser>
      `, { items: [], loading: true, unreadableFields: ['Custom.Date'] });

      await waitForHeaders(el, ['Identifier', 'Snippet'], 'the table showed the flagged header over no rows');
    });

    it('hands the host the same insert payload whether or not the column is hidden', async () => {
      const asset = makeAsset({ 'Custom.Date': '', id: 'frag-secured' } as unknown as Partial<Asset>);
      const insert = async (unreadableFields: string[]) => {
        const { el, mock } = await fixtureWithMock(html`
          <cx-content-browser extra-fields="Custom.Date" default-grid-view=${TABLE_VIEW} .tableColumns=${COLUMNS}>
          </cx-content-browser>
        `, {
          getAssetLinkResult: {
            data: [{ extraFields: { 'Custom.Date': '' }, imageUrl: 'https://cdn.example/selected.jpg' }],
            isError: false,
          },
          items: [asset],
          totalCount: 1,
          unreadableFields,
        });
        const selected = oneEvent(el, 'cx-content-browser-selected-asset');

        getFormatDialog(el).dispatchEvent(
          new CustomEvent('cx-content-browser-format-dialog-proxy-confirm', {
            bubbles: true,
            composed: true,
            detail: { asset, selectedProxyMetadata: null, useRepresentative: false },
          }),
        );

        return { linkRequest: mock.getAssetLink.args, payload: (await selected).detail };
      };

      const hidden = await insert(['Custom.Date']);
      const shown = await insert([]);

      expect(hidden.payload).to.deep.equal(shown.payload);
      expect(hidden.payload[0].extraFields['Custom.Date']).to.equal('');
      expect(hidden.linkRequest).to.deep.equal(shown.linkRequest);
      expect(hidden.linkRequest[0][0].extraFields).to.deep.equal(['Custom.Date']);
    });

    describe('through the fetch controller', () => {
      const originalAdapter = http.defaults.adapter;

      type Search = { limit: number; searchText: string; start: number };

      /** The searches Cortex received, and the answers still held back, in order. */
      let searches: Search[] = [];
      let held: Array<() => void> = [];

      /**
       * Answers each search with a full page of rows, flagged as `flagFor` says. A search that
       * `holdFor` names waits until the test releases it.
       */
      const stubServer = (flagFor: (search: Search) => string[], holdFor: (search: Search) => boolean = () => false) => {
        searches = [];
        held = [];
        http.defaults.adapter = async (config) => {
          if ((config.url ?? '').split('?')[0] !== AssetApiEndpoint.GET_CONTENT_V3) {
            throw new AxiosError('not stubbed', AxiosError.ERR_BAD_RESPONSE, config);
          }

          const body = JSON.parse(config.data as string) as { Limit?: number; Start?: number; Text?: string };
          const search = { limit: body.Limit ?? 0, searchText: body.Text ?? '', start: body.Start ?? 0 };

          searches.push(search);

          if (holdFor(search)) {
            await new Promise<void>((resolve) => {
              held.push(resolve);
            });
          }

          return {
            config,
            data: {
              contentItems: Array.from({ length: search.limit }, (_, index) => {
                const recordId = `rec-${search.searchText}-${search.start + index}`;

                return {
                  fields: {
                    'CoreField.Identifier': `ID-${search.start + index}`,
                    'Custom.Date': '',
                    'Dell.Snippet': 'A fragment of text',
                    'Document.RecordID': recordId,
                  },
                  recordID: recordId,
                };
              }),
              facets: [],
              totalCount: 500,
              unreadableFields: flagFor(search),
            },
            headers: {},
            status: 200,
            statusText: 'OK',
          };
        };
      };

      const mountPicker = async () => {
        const page = await fixture<HTMLDivElement>(html`
          <div style="height: 500px; width: 800px; --content-browser-height: 100%">
            <cx-content-browser default-folder-id="library-id" default-grid-view=${TABLE_VIEW} .tableColumns=${COLUMNS}>
            </cx-content-browser>
          </div>
        `);
        const el = page.querySelector<CxContentBrowser>('cx-content-browser')!;

        await waitForTableRows(el);

        return el;
      };

      const search = (el: CxContentBrowser, searchText: string) => {
        getControlBar(el).dispatchEvent(new CustomEvent('cx-content-browser-control-bar-search-change', {
          bubbles: true,
          composed: true,
          detail: { searchText },
        }));
      };

      const scrollport = (el: CxContentBrowser) => tableRoot(el).querySelector<HTMLElement>('.tabulator-tableholder')!;

      afterEach(() => {
        held.forEach((release) => release());
        http.defaults.adapter = originalAdapter;
      });

      it('shows no header and no cell for a flagged field, and shows them again for a new list that does not flag it', async () => {
        stubServer(({ searchText }) => (searchText === '' ? ['Custom.Date'] : []));

        const el = await mountPicker();

        await waitForHeaders(el, ['Identifier', 'Snippet'], 'the table showed the flagged column');
        expect(shownCellCounts(el).every((count) => count === 2), `shown cells per row: ${shownCellCounts(el)}`)
          .to.equal(true);

        search(el, 'unflagged');

        await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back for the new list');
        await waitUntil(() => shownCellCounts(el).every((count) => count === 3), 'the cells never came back');
      });

      it('brings a column back when the page a scroll appends stops its flag, and keeps the rows and the scroll position', async () => {
        // Each appended page waits, so that it lands after the scroll.
        stubServer(({ start }) => (start === 0 ? ['Custom.Date'] : []), ({ start }) => start > 0);

        const el = await mountPicker();

        await waitForHeaders(el, ['Identifier', 'Snippet'], 'the table showed the flagged column');

        // The user scrolls to the last row, which asks for the next page.
        scrollport(el).scrollTop = scrollport(el).scrollHeight;
        await waitUntil(() => held.length > 0, 'no appended page was asked for', { interval: 20, timeout: 5000 });

        const before = scrollport(el).scrollTop;
        const tabulator = getCxTable(el)!.tabulatorInstance!;
        const scrollportTop = scrollport(el).getBoundingClientRect().top;
        const rowAtScroll = tabulator.getRows()
          .find((row) => isShown(row.getElement()) && row.getElement().getBoundingClientRect().top >= scrollportTop);
        const markerId = String(rowAtScroll?.getData().id ?? '');
        const marker = rowAtScroll?.getElement();

        held.splice(0).forEach((release) => release());

        await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');
        await waitUntil(() => tabulator.getRows().length > 30, 'the page was never appended');

        const markerRow = tabulator.getRow(markerId);

        expect(before > 0, 'the scrollport never scrolled').to.equal(true);
        expect(markerId.length > 0, 'no row sat at the scroll position').to.equal(true);
        expect(Math.abs(scrollport(el).scrollTop - before) <= ROW_HEIGHT,
          `scrolled from ${before} to ${scrollport(el).scrollTop}`).to.equal(true);
        expect(markerRow !== false && markerRow.getElement() === marker, 'the rows were built again').to.equal(true);
      });

      it('brings a column back at the width the user dragged it to', async () => {
        stubServer(({ searchText }) => (searchText === 'flagged' ? ['Custom.Date'] : []));

        const el = await mountPicker();

        await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the table never showed each column');

        const hostWidth = headerWidth(el, 'Date');
        const handle = tableRoot(el).querySelectorAll<HTMLElement>('.tabulator-col-resize-handle')[1];
        const { left, top, width } = handle.getBoundingClientRect();
        const init = { bubbles: true, button: 0, clientY: top + 1, composed: true };
        const resized = oneEvent(getTable(el)!, 'cx-content-browser-table-column-resize');

        handle.dispatchEvent(new MouseEvent('mousedown', { ...init, clientX: left + width / 2 }));
        document.body.dispatchEvent(new MouseEvent('mousemove', { ...init, clientX: left + width / 2 - 80 }));
        document.body.dispatchEvent(new MouseEvent('mouseup', { ...init, clientX: left + width / 2 - 80 }));

        const { detail } = await resized;

        search(el, 'flagged');
        await waitForHeaders(el, ['Identifier', 'Snippet'], 'the flagged column never went away');

        search(el, 'unflagged');
        await waitForHeaders(el, ['Identifier', 'Date', 'Snippet'], 'the column never came back');

        expect(detail.width < hostWidth, `dragged from ${hostWidth}px to ${detail.width}px`).to.equal(true);
        expect(headerWidth(el, 'Date')).to.equal(detail.width);
      });
    });
  });

  describe('insert overlay in grid view', () => {
    /**
     * Without the dialog a card click hands the asset over immediately, so the grid has to say so
     * before it is clicked. The overlay follows the flag, not the view.
     */
    async function gridShowsCta(autoSelectFormat: boolean | string) {
      const { el } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${autoSelectFormat}></cx-content-browser>`,
        { items: [makeAsset({ id: 'a-1' })], totalCount: 1 },
      );
      await elementUpdated(el);

      return getGrid(el)!.showCta;
    }

    it('is off when the host has not asked to skip the picker', async () => {
      expect(await gridShowsCta(false)).to.be.false;
    });

    it('is on when the flag takes the first format', async () => {
      expect(await gridShowsCta(true)).to.be.true;
    });

    it('is on when the flag names a format', async () => {
      expect(await gridShowsCta('TRX')).to.be.true;
    });

    it('is off for a blank name, which is off everywhere else too', async () => {
      // Matches resolveAutoSelection: a blank string is not a format named " ".
      expect(await gridShowsCta('   ')).to.be.false;
    });
  });

  describe('insert pending state', () => {
    /**
     * With the dialog skipped there is no confirm button to spin, so the CTA the user clicked is the
     * only place the wait can be shown. These assert the surface's own property rather than the
     * private state behind it, since that is what actually reaches the button.
     */
    function activateRow(el: CxContentBrowser, id: string) {
      getTable(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-click', {
          bubbles: true,
          composed: true,
          detail: { id },
        }),
      );
    }

    it('marks the asset busy from the click until the dialog takes over', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      let releaseFetch: (value: unknown) => void = () => {};
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        { items: [asset], totalCount: 1 },
      );
      mock.fetchAssetByID.returns(new Promise((resolve) => { releaseFetch = resolve; }));

      selectTableView(el);
      await elementUpdated(el);
      activateRow(el, 'frag-1');
      await elementUpdated(el);

      expect(getTable(el)!.busyAssetId).to.equal('frag-1');

      releaseFetch({ asset, isFavorite: false, proxies: [] });
      await waitUntil(() => getFormatDialog(el).isDialogOpen, 'dialog never opened');
      await elementUpdated(el);

      // The dialog's own confirm button carries it from here; two spinners read as two operations.
      expect(getTable(el)!.busyAssetId).to.be.undefined;
    });

    it('holds the asset busy through an insert that never opened a dialog', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${true} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset, isFavorite: false, proxies: [] },
          items: [asset],
          totalCount: 1,
        },
      );
      // Never settles, so the insert stays outstanding for the whole test.
      mock.getAssetLink.returns(new Promise(() => {}));

      selectTableView(el);
      await elementUpdated(el);
      activateRow(el, 'frag-1');
      await waitUntil(() => mock.getAssetLink.calledOnce, 'insert never started');
      await elementUpdated(el);

      expect(getFormatDialog(el).isDialogOpen).to.be.false;
      expect(getTable(el)!.busyAssetId).to.equal('frag-1');
    });

    it('releases the asset once the insert settles', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${true} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset, isFavorite: false, proxies: [] },
          getAssetLinkResult: { data: [{ imageUrl: '' }], isError: false },
          items: [asset],
          totalCount: 1,
        },
      );

      selectTableView(el);
      await elementUpdated(el);
      const handed = oneEvent(el, 'cx-content-browser-selected-asset');
      activateRow(el, 'frag-1');

      // Wait for the outcome, not for "not busy" — that is already true before the click renders.
      await handed;
      await elementUpdated(el);

      expect(getTable(el)!.busyAssetId).to.be.undefined;
    });

    it('releases the asset when the insert fails, rather than spinning forever', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${true} .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        {
          fetchAssetByIDResult: { asset, isFavorite: false, proxies: [] },
          items: [asset],
          totalCount: 1,
        },
      );
      mock.getAssetLink.rejects(new Error('link generation failed'));

      selectTableView(el);
      await elementUpdated(el);
      activateRow(el, 'frag-1');

      // Wait for the outcome, not for "not busy" — that is already true before the click renders.
      await waitUntil(() => getFormatDialog(el).isDialogOpen, 'skipped dialog was never revealed');
      await elementUpdated(el);

      expect(getTable(el)!.busyAssetId).to.be.undefined;
    });

    it('releases the asset when it cannot be fetched at all', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .tableColumns=${TABLE_COLUMNS}></cx-content-browser>`,
        { items: [asset], totalCount: 1 },
      );
      mock.fetchAssetByID.resolves(undefined);

      selectTableView(el);
      await elementUpdated(el);
      activateRow(el, 'frag-1');
      await waitUntil(() => getTable(el)!.busyAssetId === undefined, 'CTA span forever on a missing asset');

      expect(getFormatDialog(el).isDialogOpen).to.be.false;
      expect(getTable(el)!.busyAssetId).to.be.undefined;
    });

    it('tells the grid which card is busy too', async () => {
      const asset = makeAsset({ extension: '', id: 'frag-1', imageUrl: '' });
      let releaseFetch: (value: unknown) => void = () => {};
      const { el, mock } = await fixtureWithMock(
        html`<cx-content-browser .autoSelectFormat=${true}></cx-content-browser>`,
        { items: [asset], totalCount: 1 },
      );
      mock.fetchAssetByID.returns(new Promise((resolve) => { releaseFetch = resolve; }));

      getGrid(el)!.dispatchEvent(
        new CustomEvent('cx-content-browser-grid-click', {
          bubbles: true,
          composed: true,
          detail: { id: 'frag-1' },
        }),
      );
      await elementUpdated(el);

      expect(getGrid(el)!.busyAssetId).to.equal('frag-1');

      releaseFetch(undefined);
    });
  });

  describe('table view in the host shapes of L-42BBKC', () => {
    /**
     * In every shape a host gives the picker, the rows have to scroll inside the table's own
     * scrollport, that scrollport has to keep a height of its own, and nothing may paint past the
     * picker over the page below it.
     */
    const shapes = [
      {
        name: 'a container with a definite height',
        outer: 'height: 500px; width: 800px',
        picker: '--content-browser-height: 100%',
        slot: 'height: 460px',
      },
      {
        name: 'a slot that takes its height from a flex line, as CBSDKdemo.html does',
        outer: 'display: flex; flex-direction: column; height: 500px; width: 800px',
        picker: '--content-browser-height: 100%',
        slot: 'flex: 1',
      },
      {
        name: 'a container with no height',
        outer: 'width: 800px',
        picker: '',
        slot: '',
      },
      {
        name: 'a container with no height and the picker at height auto',
        outer: 'width: 800px',
        picker: '--content-browser-height: auto',
        slot: '',
      },
    ];

    shapes.forEach(({ name, outer, picker, slot }) => {
      it(`scrolls the rows inside the table in ${name}`, async () => {
        const items = Array.from({ length: 200 }, (_, index) => makeAsset({
          id: `frag-shape-${index}`,
          identifier: `FRAG-${index}`,
          recordId: `rec-shape-${index}`,
        }));
        const page = await fixture<HTMLDivElement>(html`
          <div>
            <div style=${outer}>
              <div style="flex: none; height: 40px">host header</div>
              <div style=${slot}>
                <cx-content-browser
                  style=${picker}
                  default-grid-view=${TABLE_VIEW}
                  .tableColumns=${TABLE_COLUMNS}
                ></cx-content-browser>
              </div>
            </div>
            <div class="below">the page below</div>
          </div>
        `);
        const el = page.querySelector<CxContentBrowser>('cx-content-browser')!;

        await elementUpdated(el);
        installMockController(el, createMockFetchController(el, { items }));
        await elementUpdated(el);
        await waitForTableRows(el, 200);

        const scrollport = getCxTable(el)!.shadowRoot!.querySelector<HTMLElement>('.tabulator-tableholder')!;
        const pickerBottom = el.getBoundingClientRect().bottom;
        const tableBottom = getTable(el)!.getBoundingClientRect().bottom;
        const belowTop = page.querySelector('.below')!.getBoundingClientRect().top;

        expect(scrollport.clientHeight > 0, 'the scrollport collapsed to nothing').to.equal(true);
        expect(scrollport.scrollHeight > scrollport.clientHeight,
          `the scrollport is ${scrollport.clientHeight}px tall and holds ${scrollport.scrollHeight}px`).to.equal(true);
        expect(tableBottom <= pickerBottom + 1,
          `the table ends at ${tableBottom}px, past the picker at ${pickerBottom}px`).to.equal(true);
        expect(pickerBottom <= belowTop + 1,
          `the picker ends at ${pickerBottom}px, over the page below at ${belowTop}px`).to.equal(true);
      });
    });
  });

  describe('table view page size in a host slot its rows could size', () => {
    /**
     * L-42BFJC: a row count read off a box that grows with its own rows asks for a larger page with
     * every page it loads. Run against the real fetch controller, because the page size the host
     * sends is what has to stay bounded, not only the event.
     */
    const TOTAL_COUNT = 213116;
    const HOST_PAGE = 30;
    const originalAdapter = http.defaults.adapter;
    let requests: Array<{ limit: number; orderBy?: string; start: number }> = [];

    const stubServer = () => {
      requests = [];
      http.defaults.adapter = async (config) => {
        const url = (config.url ?? '').split('?')[0];
        const answer = (data: unknown) => ({ config, data, headers: {}, status: 200, statusText: 'OK' });

        if (url === MetadataApiEndpoint.GET_SORT_ORDERS) {
          return answer({
            sortOrders: [
              { id: 'relevancy-id', name: 'Relevancy', sortDirection: 'Descending', sortDirectionGroupKey: 'relevancy' },
              { id: 'newest-id', name: 'Date Created', sortDirection: 'Descending', sortDirectionGroupKey: 'datecreated' },
            ],
          });
        }

        if (url !== AssetApiEndpoint.GET_CONTENT_V3) {
          throw new AxiosError('not stubbed', AxiosError.ERR_BAD_RESPONSE, config);
        }

        const body = JSON.parse(config.data as string) as { Limit?: number; OrderBy?: string; Start?: number };
        const start = body.Start ?? 0;
        const limit = body.Limit ?? 0;

        requests.push({ limit, orderBy: body.OrderBy, start });

        // Past a handful of pages a runaway is already proven, and answering it would build rows without end.
        if (requests.length > 6) {
          return new Promise<never>(() => {});
        }

        return answer({
          contentItems: Array.from({ length: limit }, (_, index) => ({
            fields: { 'CoreField.Identifier': `ID-${start + index}`, 'Document.RecordID': `rec-${start + index}` },
            recordID: `rec-${start + index}`,
          })),
          facets: [],
          totalCount: TOTAL_COUNT,
        });
      };
    };

    const viewportRows = () => Math.ceil(window.innerHeight / ROW_HEIGHT);

    // The host rounds a count up past one spare page, and measures the next count against the last
    // page it asked for rather than the rows it holds, so a settled table carries up to three pages
    // past the screen. A count that grows with the rows has no ceiling at all.
    const rowBound = () => viewportRows() + 3 * HOST_PAGE;

    const highestRow = () => Math.max(0, ...requests.map(({ limit, start }) => start + limit));

    const describeRequests = () => requests
      .map(({ limit, orderBy, start }) => `${orderBy ?? '-'} ${start}+${limit}`)
      .join(', ');

    // Each fetch the rows cause is debounced twice, in the table and in the controller. A request past
    // the bound already proves a runaway, so the wait ends there and the assertion names it.
    const waitForQuiet = async (message: string) => {
      let seen = -1;
      let quietFor = 0;

      await waitUntil(() => {
        quietFor = requests.length === seen ? quietFor + 1 : 0;
        seen = requests.length;

        return quietFor >= 8 || highestRow() > rowBound();
      }, message, { interval: 100, timeout: 8000 });
    };

    afterEach(async () => {
      http.defaults.adapter = originalAdapter;
      await setViewport({ height: 600, width: 800 });
    });

    it('stays within the viewport before and after a sort change', async () => {
      // Tall enough that the viewport's rows round to a larger page than the slot's first
      // measurement: the shape in which a repeated row count fetches one more page per resize.
      await setViewport({ height: 1600, width: 800 });
      stubServer();

      const page = await fixture<HTMLDivElement>(html`
        <div style="display: flex; flex-direction: column; height: 500px; width: 800px">
          <div style="flex: none; height: 40px">host header</div>
          <div style="flex: 1; --content-browser-height: 100%">
            <cx-content-browser
              default-grid-view=${TABLE_VIEW}
              .tableColumns=${TABLE_COLUMNS}
            ></cx-content-browser>
          </div>
        </div>
      `);
      const el = page.querySelector<CxContentBrowser>('cx-content-browser')!;

      await waitForTableRows(el);
      await waitForQuiet('the table never stopped fetching');

      expect(highestRow() <= rowBound(),
        `requested ${describeRequests()} for a ${viewportRows()}-row viewport`).to.equal(true);

      getControlBar(el).dispatchEvent(new CustomEvent('cx-content-browser-control-sort-order-change', {
        bubbles: true,
        composed: true,
        detail: { sortDirection: 'Descending', sortOrderName: 'datecreated' },
      }));
      await waitUntil(() => requests.some(({ orderBy }) => orderBy === 'newest-id'), 'the sort change never fetched');
      await waitForQuiet('the table never stopped fetching after the sort change');

      const sorted = requests.find(({ orderBy }) => orderBy === 'newest-id')!;

      expect(highestRow() <= rowBound(),
        `requested ${describeRequests()} for a ${viewportRows()}-row viewport`).to.equal(true);
      expect(sorted.start === 0 && sorted.limit <= viewportRows() + 2 * HOST_PAGE,
        `the sort change asked for ${sorted.start}+${sorted.limit}`).to.equal(true);
    });
  });
});
