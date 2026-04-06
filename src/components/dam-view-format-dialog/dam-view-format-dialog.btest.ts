import './dam-view-format-dialog';

import {
  elementUpdated,
  expect,
  fixture,
  html,
  oneEvent,
} from '@open-wc/testing';

import type { GetAvailableExtensionsResponse } from '@/api/asset/asset.types';
import type { Asset, AvailableProxy } from '@/types/asset';
import { MediaType } from '@/types/asset';
import { type Parameter, TransformationAction, DamViewFormatDialogVariant } from '@/types/dam-view';

import type CxDamViewAssetProxySelector from '../dam-view-asset-proxy-selector/dam-view-asset-proxy-selector';
import {
  CUSTOM_FORMAT_VALUE,
  USE_REPRESENTATIVE_VALUE,
} from '../dam-view-asset-proxy-selector/dam-view-asset-proxy-selector';
import type CxDamViewAssetTrackingParameters from '../dam-view-asset-tracking-parameters/dam-view-asset-tracking-parameters';

import type CxDamViewFormatDialog from './dam-view-format-dialog';

/** Keeps in sync with DEFAULT_TRACKING_PARAMETERS in dam-view-format-dialog.ts */
const DEFAULT_TRACKING_PARAMETERS_SNAPSHOT: Parameter[] = [
  { key: 'UTM_source', value: '' },
  { key: 'UTM_campaign', value: '' },
  { key: 'UTM_description', value: '' },
];

function allEmptyExtensions(): GetAvailableExtensionsResponse {
  return {
    [MediaType.Album]: [],
    [MediaType.Audio]: [],
    [MediaType.Image]: [],
    [MediaType.Multimedia]: [],
    [MediaType.Story]: [],
    [MediaType.Video]: [],
    [MediaType.Widget]: [],
  };
}

function videoMp4Extensions(): GetAvailableExtensionsResponse {
  return {
    [MediaType.Album]: [],
    [MediaType.Audio]: [],
    [MediaType.Image]: [],
    [MediaType.Multimedia]: [],
    [MediaType.Story]: [],
    [MediaType.Video]: [{ displayName: 'MP4', value: '.mp4' }],
    [MediaType.Widget]: [],
  };
}

function makeAsset(overrides: Partial<Asset> = {}): Asset {
  return {
    docSubType: '',
    docType: MediaType.Video,
    extension: '.mp4',
    id: 'asset-1',
    identifier: 'id-1',
    imageUrl: 'https://placehold.co/120x80',
    name: 'Clip',
    originalUrl: 'https://example.com/v.mp4',
    recordId: 'rec-1',
    size: '2 MB',
    tags: '',
    ...overrides,
  };
}

function makeProxy(overrides: Partial<AvailableProxy> = {}): AvailableProxy {
  return {
    cdnName: 'Edge',
    extension: '.mp4',
    formatHeight: 720,
    formatWidth: 1280,
    height: 720,
    id: 'proxy-1',
    permanentLink: 'https://cdn.example/p.mp4',
    proxyLabel: 'HD',
    proxyName: 'HD_PROXY',
    width: 1280,
    ...overrides,
  };
}

function getInnerDialog(el: CxDamViewFormatDialog) {
  return el.shadowRoot!.querySelector('cx-dialog, cx-drawer') as HTMLElement;
}

function getProxySelector(el: CxDamViewFormatDialog) {
  return el.shadowRoot!.querySelector(
    'cx-dam-view-asset-proxy-selector',
  ) as CxDamViewAssetProxySelector;
}

function dispatchProxySelect(el: CxDamViewFormatDialog, value: string) {
  const selector = getProxySelector(el);
  expect(selector).to.exist;
  selector.dispatchEvent(
    new CustomEvent('cx-select', {
      bubbles: true,
      composed: true,
      detail: { item: { value } },
    }),
  );
}

function invokeHandleFavorite(el: CxDamViewFormatDialog) {
  const handleFavorite = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(el),
    'handleFavorite',
  )?.value as (() => void) | undefined;
  expect(handleFavorite).to.be.a('function');
  handleFavorite!.call(el);
}

function invokeHandleProxyConfirm(el: CxDamViewFormatDialog) {
  const handleProxyConfirm = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(el),
    'handleProxyConfirm',
  )?.value as (() => void) | undefined;
  expect(handleProxyConfirm).to.be.a('function');
  handleProxyConfirm!.call(el);
}

function invokeHandleVersionHistory(el: CxDamViewFormatDialog) {
  const handleVersionHistory = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(el),
    'handleVersionHistory',
  )?.value as (() => void) | undefined;
  expect(handleVersionHistory).to.be.a('function');
  handleVersionHistory!.call(el);
}

function setAssetLinkFormatStub(
  el: CxDamViewFormatDialog,
  stub: {
    selectedFormat?: { extension?: string; height?: number | null; width?: number | null };
    transformations?: Array<{ key: TransformationAction; value: { width?: number } }>;
  } | null,
) {
  if (stub === null) {
    Object.defineProperty(el, 'assetLinkFormat', {
      configurable: true,
      get: () => undefined,
    });

    return;
  }

  const mock = {
    selectedFormat: stub.selectedFormat ?? {},
    transformations: stub.transformations ?? [],
  };

  Object.defineProperty(el, 'assetLinkFormat', {
    configurable: true,
    get: () => mock,
  });
}

describe('dam-view-format-dialog', () => {
  let el: CxDamViewFormatDialog;

  beforeEach(async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog></cx-dam-view-format-dialog>`,
    );
    await elementUpdated(el);
  });

  it('renders cx-dialog by default and cx-drawer when variant is drawer', async () => {
    const dialogEl = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog></cx-dam-view-format-dialog>`,
    );
    await elementUpdated(dialogEl);
    expect(dialogEl.shadowRoot!.querySelector('cx-dialog')).to.exist;
    expect(dialogEl.shadowRoot!.querySelector('cx-drawer')).to.be.null;

    const drawerEl = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog variant=${DamViewFormatDialogVariant.Drawer}></cx-dam-view-format-dialog>`,
    );
    await elementUpdated(drawerEl);
    const drawer = drawerEl.shadowRoot!.querySelector('cx-drawer');
    expect(drawer).to.exist;
    expect(drawer).to.have.attribute('placement', 'bottom');
    expect(drawerEl.shadowRoot!.querySelector('cx-dialog')).to.be.null;
  });

  it('does not render preview body until open() is called', async () => {
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-preview')).to.be.null;
    expect(el.shadowRoot!.querySelector('#cropper')).to.be.null;
  });

  it('shows asset preview for non-image assets after open()', async () => {
    const asset = makeAsset({ docType: MediaType.Video });
    el.open({ asset, isFavorite: false, proxies: [] });
    await elementUpdated(el);
    const preview = el.shadowRoot!.querySelector('cx-dam-view-asset-preview');
    expect(preview).to.exist;
    expect(preview!.getAttribute('image-url')).to.equal(asset.imageUrl);
  });

  it('shows cropper for image assets after open()', async () => {
    const asset = makeAsset({
      docType: MediaType.Image,
      extension: '.jpg',
      originalUrl: 'https://example.com/i.jpg',
    });
    el.open({ asset, isFavorite: false, proxies: [] });
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('#cropper')).to.exist;
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-preview')).to.be.null;
  });

  it('clears preview content after hide()', async () => {
    el.open({ asset: makeAsset(), isFavorite: false, proxies: [] });
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-preview')).to.exist;
    el.trackingParameters = [{ key: 'custom', value: 'edited' }];
    el.enabledTracking = true;
    await elementUpdated(el);
    el.hide();
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-preview')).to.be.null;
    expect(el.trackingParameters).to.deep.equal(DEFAULT_TRACKING_PARAMETERS_SNAPSHOT);
    expect(el.enabledTracking).to.be.false;
  });

  it('emits cx-dam-view-format-dialog-favorite-change when the star is clicked', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-favorite></cx-dam-view-format-dialog>`,
    );
    el.open({ asset: makeAsset(), isFavorite: false, proxies: [] });
    await elementUpdated(el);

    const star = el.shadowRoot!.querySelector('cx-icon-button[name="star"]');
    expect(star).to.exist;

    const p = oneEvent(el, 'cx-dam-view-format-dialog-favorite-change');
    (star as HTMLElement).click();
    const ev = await p;
    expect(ev.detail.assetId).to.equal('asset-1');
    expect(ev.detail.isFavorite).to.equal(false);
  });

  it('renders favorite star outlined with text color when not favorited', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-favorite></cx-dam-view-format-dialog>`,
    );
    el.open({ asset: makeAsset(), isFavorite: false, proxies: [] });
    await elementUpdated(el);

    const star = el.shadowRoot!.querySelector(
      'cx-icon-button[name="star"]',
    ) as HTMLElement & { variant?: string };

    expect(star).to.exist;
    expect(star.variant).to.equal('outlined');
    expect(star.getAttribute('style')).to.include('var(--cx-color-text)');
    expect(star.getAttribute('style')).to.not.include('var(--cx-color-warning)');
  });

  it('renders favorite star filled with warning color when favorited', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-favorite></cx-dam-view-format-dialog>`,
    );
    el.open({ asset: makeAsset(), isFavorite: true, proxies: [] });
    await elementUpdated(el);

    const star = el.shadowRoot!.querySelector(
      'cx-icon-button[name="star"]',
    ) as HTMLElement & { variant?: string };

    expect(star).to.exist;
    expect(star.variant).to.equal('filled');
    expect(star.getAttribute('style')).to.include('var(--cx-color-warning)');
  });

  it('emits cx-dam-view-format-dialog-version-history-open when history is clicked', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-view-versions can-use-proxies></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    const historyBtn = el.shadowRoot!.querySelector('cx-icon-button[name="history"]');
    expect(historyBtn).to.exist;

    const p = oneEvent(el, 'cx-dam-view-format-dialog-version-history-open');
    (historyBtn as HTMLElement).click();
    const ev = await p;
    expect(ev.detail.assetId).to.equal('asset-1');
  });

  it('shows version history body and returns from it on cx-request-close', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-view-versions can-use-proxies></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    (el.shadowRoot!.querySelector('cx-icon-button[name="history"]') as HTMLElement).click();
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-version-history')).to.exist;

    const inner = getInnerDialog(el);
    const prevented = !inner.dispatchEvent(
      new CustomEvent('cx-request-close', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { source: 'keyboard' },
      }),
    );
    expect(prevented).to.be.true;
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-version-history')).to.be.null;
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-proxy-selector')).to.exist;
  });

  it('updates trackingParameters when nested editor emits cx-dam-view-asset-tracking-parameters-change', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-use-proxies can-track></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    dispatchProxySelect(el, 'tracking');
    await elementUpdated(el);

    const selector = getProxySelector(el);
    const tracking = selector.shadowRoot!.querySelector(
      'cx-dam-view-asset-tracking-parameters',
    ) as unknown as CxDamViewAssetTrackingParameters;
    expect(tracking).to.exist;

    const next = [{ key: 'foo', value: 'bar' }];
    tracking.dispatchEvent(
      new CustomEvent('cx-dam-view-asset-tracking-parameters-change', {
        bubbles: true,
        composed: true,
        detail: { values: next },
      }),
    );
    await elementUpdated(el);
    expect(el.trackingParameters).to.deep.equal(next);
  });

  it('prevents cx-request-close while loadingFavorites', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-favorite loading-favorites></cx-dam-view-format-dialog>`,
    );
    el.open({ asset: makeAsset(), isFavorite: false, proxies: [] });
    await elementUpdated(el);

    const inner = getInnerDialog(el);
    const prevented = !inner.dispatchEvent(
      new CustomEvent('cx-request-close', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { source: 'overlay' },
      }),
    );
    expect(prevented).to.be.true;
  });

  it('closes and resets on cx-request-close when not in version history', async () => {
    el.open({ asset: makeAsset(), isFavorite: false, proxies: [] });
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-preview')).to.exist;
    el.trackingParameters = [{ key: 'custom', value: 'edited' }];
    el.enabledTracking = true;
    await elementUpdated(el);

    const inner = getInnerDialog(el);
    const p = oneEvent(el, 'cx-dam-view-format-dialog-close');
    const prevented = !inner.dispatchEvent(
      new CustomEvent('cx-request-close', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { source: 'overlay' },
      }),
    );
    expect(prevented).to.be.false;
    await p;
    await elementUpdated(el);

    expect(el.asset).to.be.undefined;
    expect(el.shadowRoot!.querySelector('cx-dam-view-asset-preview')).to.be.null;
    expect(el.trackingParameters).to.deep.equal(DEFAULT_TRACKING_PARAMETERS_SNAPSHOT);
    expect(el.enabledTracking).to.be.false;
  });

  describe('handler early returns', () => {
    it('handleFavorite does not emit when loadingFavorites is true', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog can-favorite loading-favorites></cx-dam-view-format-dialog>`,
      );
      el.open({ asset: makeAsset(), isFavorite: false, proxies: [] });
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-dam-view-format-dialog-favorite-change', () => {
        count += 1;
      });
      invokeHandleFavorite(el);
      expect(count).to.equal(0);
    });

    it('handleFavorite does not emit when there is no asset', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog can-favorite></cx-dam-view-format-dialog>`,
      );
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-dam-view-format-dialog-favorite-change', () => {
        count += 1;
      });
      invokeHandleFavorite(el);
      expect(count).to.equal(0);
    });

    it('handleFavorite does not emit when asset id is empty', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog can-favorite></cx-dam-view-format-dialog>`,
      );
      el.open({
        asset: makeAsset({ id: '' }),
        isFavorite: false,
        proxies: [],
      });
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-dam-view-format-dialog-favorite-change', () => {
        count += 1;
      });
      invokeHandleFavorite(el);
      expect(count).to.equal(0);
    });

    it('handleProxyConfirm does not emit when asset is cleared', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog can-use-proxies></cx-dam-view-format-dialog>`,
      );
      el.open({
        asset: makeAsset(),
        isFavorite: false,
        proxies: [makeProxy()],
      });
      await elementUpdated(el);
      el.hide();
      await elementUpdated(el);

      let proxyCount = 0;
      let formatCount = 0;
      el.addEventListener('cx-dam-view-format-dialog-proxy-confirm', () => {
        proxyCount += 1;
      });
      el.addEventListener('cx-dam-view-format-dialog-format-confirm', () => {
        formatCount += 1;
      });
      invokeHandleProxyConfirm(el);
      expect(proxyCount).to.equal(0);
      expect(formatCount).to.equal(0);
    });

    it('handleVersionHistory does not emit when asset is cleared', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog can-view-versions can-use-proxies></cx-dam-view-format-dialog>`,
      );
      el.open({
        asset: makeAsset(),
        isFavorite: false,
        proxies: [makeProxy()],
      });
      await elementUpdated(el);
      el.hide();
      await elementUpdated(el);

      let count = 0;
      el.addEventListener('cx-dam-view-format-dialog-version-history-open', () => {
        count += 1;
      });
      invokeHandleVersionHistory(el);
      expect(count).to.equal(0);
    });
  });

  it('emits cx-dam-view-format-dialog-proxy-confirm when insert is clicked with a selected proxy', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-use-proxies></cx-dam-view-format-dialog>`,
    );
    const proxy = makeProxy();
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [proxy],
    });
    await elementUpdated(el);

    const insert = el.shadowRoot!.querySelector(
      '.dam-view-format__footer__button',
    ) as HTMLElement;
    expect(insert).to.exist;

    const p = oneEvent(el, 'cx-dam-view-format-dialog-proxy-confirm');
    insert.click();
    const ev = await p;
    expect(ev.detail.asset.id).to.equal('asset-1');
    expect(ev.detail.useRepresentative).to.equal(false);
    expect(ev.detail.proxyPreference).to.equal(proxy.proxyName);
  });

  it('emits proxy-confirm with useRepresentative after selecting representative', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog
        can-use-proxies
        supported-representative-subtypes="thumb"
      ></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset({
        docSubType: 'thumb',
        imageUrl: 'https://placehold.co/1x1',
      }),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    dispatchProxySelect(el, USE_REPRESENTATIVE_VALUE);
    await elementUpdated(el);

    const insert = el.shadowRoot!.querySelector(
      '.dam-view-format__footer__button',
    ) as HTMLElement;
    const p = oneEvent(el, 'cx-dam-view-format-dialog-proxy-confirm');
    insert.click();
    const ev = await p;
    expect(ev.detail.useRepresentative).to.equal(true);
  });

  it('ignores proxy select when value is not a known proxy id', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-use-proxies></cx-dam-view-format-dialog>`,
    );
    const proxy = makeProxy({ id: 'p-known' });
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [proxy],
    });
    await elementUpdated(el);

    expect(el.selectedProxy).to.equal('p-known');

    el.confirmedTransformations = [
      {
        key: TransformationAction.Resize,
        value: { width: 100 },
      },
    ];
    await elementUpdated(el);

    dispatchProxySelect(el, 'not-in-proxies-list');
    await elementUpdated(el);

    expect(el.selectedProxy).to.equal('p-known');
    expect(el.confirmedTransformations.length).to.equal(1);
  });

  it('selects proxy by id and clears confirmed transformations when switching proxy', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-use-proxies></cx-dam-view-format-dialog>`,
    );
    const proxyA = makeProxy({ id: 'p-a', proxyName: 'A' });
    const proxyB = makeProxy({
      id: 'p-b',
      proxyLabel: 'B label',
      proxyName: 'B',
    });
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [proxyA, proxyB],
    });
    await elementUpdated(el);

    expect(el.selectedProxy).to.equal('p-a');

    el.confirmedTransformations = [
      {
        key: TransformationAction.Resize,
        value: { width: 100 },
      },
    ];
    await elementUpdated(el);

    dispatchProxySelect(el, 'p-b');
    await elementUpdated(el);

    expect(el.selectedProxy).to.equal('p-b');
    expect(el.confirmedTransformations.length).to.equal(0);
  });

  it('maps TRX proxy selector items from asset dimensions and extension', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog can-use-proxies></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset({
        docType: MediaType.Video,
        extension: '.mov',
        height: '1080',
        width: '1920',
      }),
      isFavorite: false,
      proxies: [
        makeProxy({
          extension: '.mp4',
          formatHeight: 720,
          formatWidth: 1280,
          id: 'trx-1',
          proxyLabel: 'Transcode',
          proxyName: 'TRX',
        }),
        makeProxy({
          extension: '.webm',
          formatHeight: 480,
          formatWidth: 854,
          id: 'hd-1',
          proxyLabel: 'Web',
          proxyName: 'WEB_PROXY',
        }),
      ],
    });
    await elementUpdated(el);

    const selector = getProxySelector(el);
    const trxItem = selector.items.find((item) => item.value === 'TRX');
    const webItem = selector.items.find((item) => item.value === 'WEB_PROXY');

    expect(trxItem).to.exist;
    expect(trxItem!.extension).to.equal('.mov');
    expect(trxItem!.height).to.equal('1080');
    expect(trxItem!.width).to.equal('1920');
    expect(trxItem!.docType).to.equal(MediaType.Video);
    expect(trxItem!.cdnName).to.equal('Edge');

    expect(webItem).to.exist;
    expect(webItem!.extension).to.equal('.webm');
    expect(webItem!.height).to.equal('480');
    expect(webItem!.width).to.equal('854');
  });

  it('does not emit proxy-confirm when no proxy is selected', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog
        can-use-proxies
        supported-extensions="gif"
      ></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset({ extension: '.mp4' }),
      isFavorite: false,
      proxies: [
        makeProxy({
          extension: null,
          id: 'p-raw',
          proxyLabel: 'Raw',
          proxyName: 'RAW',
        }),
      ],
    });
    await elementUpdated(el);

    let count = 0;
    el.addEventListener('cx-dam-view-format-dialog-proxy-confirm', () => {
      count += 1;
    });
    const insert = el.shadowRoot!.querySelector(
      '.dam-view-format__footer__button',
    ) as HTMLElement;
    insert.click();
    await elementUpdated(el);
    expect(count).to.equal(0);
  });

  it('shows custom format footer and restores proxy footer after cancel', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog
        can-use-proxies
        can-custom-format
        .availableExtensions=${videoMp4Extensions()}
      ></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset({ extension: '.mp4' }),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    dispatchProxySelect(el, CUSTOM_FORMAT_VALUE);
    await elementUpdated(el);

    let footerButtons = el.shadowRoot!.querySelectorAll('.dam-view-format__footer cx-button');
    expect(footerButtons.length).to.equal(2);

    (footerButtons[0] as HTMLElement).click();
    await elementUpdated(el);

    footerButtons = el.shadowRoot!.querySelectorAll('.dam-view-format__footer cx-button');
    expect(footerButtons.length).to.equal(1);
  });

  it('emits cx-dam-view-format-dialog-format-confirm after custom format done and insert', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog
        can-use-proxies
        can-custom-format
        .availableExtensions=${videoMp4Extensions()}
      ></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset({ extension: '.mp4' }),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    dispatchProxySelect(el, CUSTOM_FORMAT_VALUE);
    await elementUpdated(el);

    const footerButtons = el.shadowRoot!.querySelectorAll('.dam-view-format__footer cx-button');
    (footerButtons[1] as HTMLElement).click();
    await elementUpdated(el);

    const insert = el.shadowRoot!.querySelector(
      '.dam-view-format__footer__button',
    ) as HTMLElement;
    const p = oneEvent(el, 'cx-dam-view-format-dialog-format-confirm');
    insert.click();
    const ev = await p;
    expect(ev.detail.asset.id).to.equal('asset-1');
    expect(ev.detail.transformedAssetMetadata?.isCustomFormat).to.equal(true);
  });

  it('disables insert when disabledConfirm is set', async () => {
    el = await fixture<CxDamViewFormatDialog>(
      html`<cx-dam-view-format-dialog
        can-use-proxies
        disabled-confirm
      ></cx-dam-view-format-dialog>`,
    );
    el.open({
      asset: makeAsset(),
      isFavorite: false,
      proxies: [makeProxy()],
    });
    await elementUpdated(el);

    const insert = el.shadowRoot!.querySelector('.dam-view-format__footer__button');
    expect(insert).to.exist;
    expect(insert!.hasAttribute('disabled')).to.be.true;
  });

  describe('shouldAppendAutoExtension (can-use-ats on proxy selector)', () => {
    it('canUseATS is false when asset is missing', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog
          can-use-proxies
          can-custom-format
          auto-extension="webm"
          supported-extensions="webm"
          .availableExtensions=${allEmptyExtensions()}
        ></cx-dam-view-format-dialog>`,
      );
      await elementUpdated(el);
      expect(el.asset).to.be.undefined;

      const canUseATS = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(el),
        'canUseATS',
      )?.get?.call(el);

      expect(canUseATS).to.equal(false);
    });

    it('enables can-use-ats when autoExtension is non-empty and listed in supportedExtensions', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog
          can-use-proxies
          can-custom-format
          auto-extension="webm"
          supported-extensions="webm"
          .availableExtensions=${allEmptyExtensions()}
        ></cx-dam-view-format-dialog>`,
      );
      el.open({
        asset: makeAsset({ extension: 'webm' }),
        isFavorite: false,
        proxies: [makeProxy()],
      });
      await elementUpdated(el);

      expect(getProxySelector(el).canUseATS).to.equal(true);
    });

    it('disables can-use-ats when autoExtension is not in supportedExtensions (automatic row filtered out)', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog
          can-use-proxies
          can-custom-format
          auto-extension="webm"
          supported-extensions="mp4"
          .availableExtensions=${allEmptyExtensions()}
        ></cx-dam-view-format-dialog>`,
      );
      el.open({
        asset: makeAsset({ extension: 'webm' }),
        isFavorite: false,
        proxies: [makeProxy()],
      });
      await elementUpdated(el);

      expect(getProxySelector(el).canUseATS).to.equal(false);
    });

    it('disables can-use-ats when autoExtension is empty even if supportedExtensions lists that extension', async () => {
      el = await fixture<CxDamViewFormatDialog>(
        html`<cx-dam-view-format-dialog
          can-use-proxies
          can-custom-format
          supported-extensions="webm"
          .availableExtensions=${allEmptyExtensions()}
        ></cx-dam-view-format-dialog>`,
      );
      el.open({
        asset: makeAsset({ extension: 'webm' }),
        isFavorite: false,
        proxies: [makeProxy()],
      });
      await elementUpdated(el);

      expect(getProxySelector(el).canUseATS).to.equal(false);
    });
  });

  it('applies setVersionHistory and setIsFavorite without throwing', async () => {
    el.setVersionHistory([]);
    el.setIsFavorite(true);
    await elementUpdated(el);
    expect(el.loadingFavorites).to.equal(false);
  });

  describe('mapFormatConfirmPayload', () => {
    it('uses empty extension and transformations when assetLinkFormat is missing', async () => {
      setAssetLinkFormatStub(el, null);
      const asset = makeAsset();
      const p = el.mapFormatConfirmPayload(asset);

      expect(p.asset).to.equal(asset);
      expect(p.extension).to.equal('');
      expect(p.transformations).to.deep.equal([]);
      expect(p.transformedAssetMetadata).to.deep.equal({
        extension: null,
        height: null,
        isCustomFormat: true,
        permanentLink: null,
        width: null,
      });
      expect(p.parameters).to.be.undefined;
      expect(p.proxiesPreference).to.be.undefined;
      expect(p.sourceProxyMetadata).to.deep.equal({
        cdnName: null,
        extension: null,
        height: null,
        isCustomFormat: null,
        permanentLink: null,
        proxyLabel: null,
        proxyName: null,
        width: null,
      });
    });

    it('maps assetLinkFormat fields, non-TRX sourceProxyMetadata, and omits parameters when tracking is off', async () => {
      const transformations = [{ key: TransformationAction.Resize, value: { width: 100 } }];
      setAssetLinkFormatStub(el, {
        selectedFormat: { extension: '.webm', height: 480, width: 640 },
        transformations,
      });
      el.enabledTracking = false;
      await elementUpdated(el);
      const asset = makeAsset();
      const proxy = makeProxy({
        extension: '.proxy-ext',
        formatHeight: 720,
        formatWidth: 1280,
        proxyName: 'HD_PROXY',
      });
      const p = el.mapFormatConfirmPayload(asset, proxy);

      expect(p.extension).to.equal('.webm');
      expect(p.transformations).to.deep.equal(transformations);
      expect(p.proxiesPreference).to.equal('HD_PROXY');
      expect(p.parameters).to.be.undefined;
      expect(p.sourceProxyMetadata).to.deep.equal({
        cdnName: 'Edge',
        extension: '.proxy-ext',
        height: 720,
        isCustomFormat: null,
        permanentLink: 'https://cdn.example/p.mp4',
        proxyLabel: 'HD',
        proxyName: 'HD_PROXY',
        width: 1280,
      });
      expect(p.transformedAssetMetadata).to.deep.equal({
        extension: '.webm',
        height: 480,
        isCustomFormat: true,
        permanentLink: null,
        width: 640,
      });
    });

    it('includes tracking parameters when enabledTracking is true', async () => {
      setAssetLinkFormatStub(el, { selectedFormat: {}, transformations: [] });
      el.enabledTracking = true;
      el.trackingParameters = [{ key: 'utm', value: 'camp' }];
      await elementUpdated(el);
      const p = el.mapFormatConfirmPayload(makeAsset(), makeProxy());

      expect(p.parameters).to.deep.equal([{ key: 'utm', value: 'camp' }]);
    });

    it('uses asset extension and dimensions in sourceProxyMetadata for TRX proxy', async () => {
      setAssetLinkFormatStub(el, null);
      const asset = makeAsset({
        extension: '.mov',
        height: '1080',
        width: '1920',
      });
      const proxy = makeProxy({
        extension: '.mp4',
        formatHeight: 360,
        formatWidth: 640,
        proxyName: 'TRX',
      });
      const p = el.mapFormatConfirmPayload(asset, proxy);

      expect(p.proxiesPreference).to.equal('TRX');
      expect(p.sourceProxyMetadata.extension).to.equal('.mov');
      expect(p.sourceProxyMetadata.height).to.equal(1080);
      expect(p.sourceProxyMetadata.width).to.equal(1920);
    });
  });

  describe('mapProxyConfirmPayload', () => {
    it('uses asset-only fields when selectedProxy is omitted', async () => {
      el.enabledTracking = false;
      el.selectedProxy = '';
      await elementUpdated(el);
      const asset = makeAsset({ extension: '.avi' });
      const p = el.mapProxyConfirmPayload(asset);

      expect(p.asset).to.equal(asset);
      expect(p.extension).to.equal('.avi');
      expect(p.proxyPreference).to.equal('');
      expect(p.permanentLink).to.be.undefined;
      expect(p.useRepresentative).to.be.false;
      expect(p.parameters).to.be.undefined;
      expect(p.selectedProxyMetadata).to.deep.equal({
        cdnName: null,
        extension: null,
        height: null,
        isCustomFormat: false,
        permanentLink: null,
        proxyLabel: null,
        proxyName: null,
        width: null,
      });
    });

    it('maps non-TRX proxy including permanentLink', async () => {
      el.selectedProxy = 'proxy-1';
      await elementUpdated(el);
      const proxy = makeProxy({ permanentLink: 'https://perm.example/link' });
      const p = el.mapProxyConfirmPayload(makeAsset(), proxy);

      expect(p.extension).to.equal('.mp4');
      expect(p.permanentLink).to.equal('https://perm.example/link');
      expect(p.proxyPreference).to.equal('HD_PROXY');
      expect(p.selectedProxyMetadata.extension).to.equal('.mp4');
      expect(p.selectedProxyMetadata.height).to.equal(720);
      expect(p.selectedProxyMetadata.width).to.equal(1280);
      expect(p.useRepresentative).to.be.false;
    });

    it('omits top-level permanentLink when proxy permanentLink is null', async () => {
      const proxy = makeProxy({ permanentLink: null });
      const p = el.mapProxyConfirmPayload(makeAsset(), proxy);

      expect(p.permanentLink).to.be.undefined;
      expect(p.selectedProxyMetadata.permanentLink).to.be.null;
    });

    it('uses asset extension when proxy extension is null and non-TRX metadata extension is null', async () => {
      const proxy = makeProxy({ extension: null });
      const p = el.mapProxyConfirmPayload(makeAsset({ extension: '.src' }), proxy);

      expect(p.extension).to.equal('.src');
      expect(p.selectedProxyMetadata.extension).to.be.null;
    });

    it('uses asset dimensions in selectedProxyMetadata for TRX proxy', async () => {
      const asset = makeAsset({ extension: '.mov', height: '480', width: '854' });
      const proxy = makeProxy({
        extension: '.mp4',
        formatHeight: 1080,
        formatWidth: 1920,
        proxyName: 'TRX',
      });
      const p = el.mapProxyConfirmPayload(asset, proxy);

      expect(p.selectedProxyMetadata.extension).to.equal('.mov');
      expect(p.selectedProxyMetadata.height).to.equal(480);
      expect(p.selectedProxyMetadata.width).to.equal(854);
    });

    it('parses missing asset height and width as zero for TRX metadata', async () => {
      const asset = makeAsset({ extension: '.mov' });
      delete asset.height;
      delete asset.width;
      const proxy = makeProxy({ proxyName: 'TRX' });
      const p = el.mapProxyConfirmPayload(asset, proxy);

      expect(p.selectedProxyMetadata.height).to.equal(0);
      expect(p.selectedProxyMetadata.width).to.equal(0);
    });

    it('sets useRepresentative when selectedProxy state is use-representative', async () => {
      el.selectedProxy = USE_REPRESENTATIVE_VALUE;
      await elementUpdated(el);
      const p = el.mapProxyConfirmPayload(makeAsset(), makeProxy());

      expect(p.useRepresentative).to.be.true;
    });

    it('includes tracking parameters when enabledTracking is true', async () => {
      el.enabledTracking = true;
      el.trackingParameters = [{ key: 'src', value: 'news' }];
      await elementUpdated(el);
      const p = el.mapProxyConfirmPayload(makeAsset(), makeProxy());

      expect(p.parameters).to.deep.equal([{ key: 'src', value: 'news' }]);
    });
  });
});
