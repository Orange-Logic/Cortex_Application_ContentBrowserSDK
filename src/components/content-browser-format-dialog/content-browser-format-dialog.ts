import { CSSResultGroup, html, nothing, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import _uniqBy from 'lodash-es/uniqBy';

import CortexElement from '@/base/element';
import {
  CxContentBrowserAssetTrackingParametersChangeEvent, CxRequestCloseEvent, CxSelectEvent,
} from '@/events';
import { GetAvailableExtensionsResponse } from '@/api/asset/asset.types';
import componentStyles from '@/styles/component.styles';
import { Asset, AssetVersion, AvailableProxy, MediaType } from '@/types/asset';
import { watch } from '@/utils/watch';
import CxAssetLinkFormat from '@orangelogic/design-system/components/asset-link-format';
import CxCropper from '@orangelogic/design-system/components/cropper';
import CxDialog from '@orangelogic/design-system/components/dialog';
import CxDrawer from '@orangelogic/design-system/components/drawer';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSpinner from '@orangelogic/design-system/components/spinner';
import CxTooltip from '@orangelogic/design-system/components/tooltip';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement, LocalizeController, safeString } from '@orangelogic/design-system/utils';

import CxContentBrowserAssetPreview from '../content-browser-asset-preview/content-browser-asset-preview';
import CxContentBrowserAssetProxySelector, {
  CUSTOM_FORMAT_VALUE, USE_REPRESENTATIVE_VALUE,
} from '../content-browser-asset-proxy-selector/content-browser-asset-proxy-selector';
import CxContentBrowserAssetVersionHistory from '../content-browser-asset-version-history/content-browser-asset-version-history';
import styles from './content-browser-format-dialog.styles';

import { type Parameter, type Transformation, ContentBrowserFormatDialogVariant } from '@/types/content-browser';
import type CxMenuItem from '@orangelogic/design-system/components/menu-item';
const DEFAULT_TRACKING_PARAMETERS: Parameter[] = [{
  key: 'UTM_source',
  value: '',
}, {
  key: 'UTM_campaign',
  value: '',
}, {
  key: 'UTM_description',
  value: '',
}];

@customElement('cx-content-browser-format-dialog')
export default class CxContentBrowserFormatDialog extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-asset-link-format': CxAssetLinkFormat,
    'cx-cropper': CxCropper,
    'cx-content-browser-asset-preview': CxContentBrowserAssetPreview,
    'cx-content-browser-asset-proxy-selector': CxContentBrowserAssetProxySelector,
    'cx-content-browser-asset-version-history': CxContentBrowserAssetVersionHistory,
    'cx-dialog': CxDialog,
    'cx-drawer': CxDrawer,
    'cx-icon-button': CxIconButton,
    'cx-line-clamp': CxLineClamp,
    'cx-space': CxSpace,
    'cx-spinner': CxSpinner,
    'cx-tooltip': CxTooltip,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @query('cx-asset-link-format') assetLinkFormat!: CxAssetLinkFormat;

  @property({ reflect: false, type: Object })
  boundary: HTMLElement = document.body;

  @property({ attribute: false, reflect: false, type: Object })
  availableExtensions: GetAvailableExtensionsResponse | null = null;

  @property({
    attribute: 'supported-extensions',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[] | undefined) => (value ?? []).join(' '),
    },
    reflect: true,
    type: Array,
  })
  supportedExtensions: string[] = [];

  @property({
    attribute: 'supported-representative-subtypes',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[] | undefined) => (value ?? []).join(' '),
    },
    reflect: true,
    type: Array,
  })
  supportedRepresentativeSubtypes: string[] = [];

  @property({ attribute: 'auto-extension', reflect: false, type: String })
  autoExtension: string = '';

  @property({ attribute: 'cta-text', reflect: false, type: String })
  ctaText: string = '';

  @property({ attribute: 'can-custom-format', reflect: false, type: Boolean })
  canCustomFormat: boolean = false;

  @property({ attribute: 'can-favorite', reflect: false, type: Boolean })
  canFavorite: boolean = false;

  @property({ attribute: 'can-track', reflect: false, type: Boolean })
  canTrack: boolean = false;

  @property({ attribute: 'can-use-proxies', reflect: false, type: Boolean })
  canUseProxies: boolean = false;

  @property({ attribute: 'can-view-versions', reflect: false, type: Boolean })
  canViewVersions: boolean = false;

  @property({ reflect: true, type: String })
  variant: ContentBrowserFormatDialogVariant = ContentBrowserFormatDialogVariant.Dialog;

  @property({ attribute: 'loading-favorites', reflect: true, type: Boolean })
  loadingFavorites: boolean = false;

  @property({ attribute: 'loading-proxies', reflect: true, type: Boolean })
  loadingProxies: boolean = false;

  @property({ attribute: 'disabled-confirm', reflect: true, type: Boolean })
  disabledConfirm: boolean = false;

  @property({ attribute: 'token', type: String })
  token: string = '';

  @property({ attribute: 'base-url', type: String })
  baseUrl: string = '';

  @state()
  asset: Asset & { previewUrl: string } | undefined = undefined;

  @state()
  private isOpen: boolean = false;

  @state()
  isFavorite: boolean = false;

  @state()
  proxies: AvailableProxy[] = [];

  @state()
  showVersionHistory: boolean = false;

  @state()
  showCustomFormat: boolean = false;

  @state()
  loadingVersionHistory: boolean = false;

  @state()
  versions: AssetVersion[] = [];

  @state()
  filteredProxies: AvailableProxy[] = [];

  @state()
  selectedProxy: string = '';

  @state()
  confirmedTransformations: Transformation[] = [];

  @state()
  confirmedFormat: { width?: number | null; height?: number | null; extension?: string | null } | undefined = undefined;

  @state()
  loadingConfirm = false;

  @state()
  enabledTracking: boolean = false;

  @state()
  trackingParameters: Parameter[] = DEFAULT_TRACKING_PARAMETERS;

  private get shouldAppendAutoExtension(): boolean {
    return !!this.autoExtension && this.supportedExtensions.includes(this.autoExtension);
  }

  private get canUseATS(): boolean {
    if (!this.asset) {
      return false;
    }

    const extensionList = (this.availableExtensions && this.asset.docType
      ? _uniqBy([
        ...this.availableExtensions[this.asset.docType],
        { displayName: this.localize.term('automatic'), value: this.autoExtension },
      ], 'value')
      : [{ displayName: this.localize.term('automatic'), value: this.autoExtension }])
      .filter((item) => this.shouldAppendAutoExtension || item.value !== this.autoExtension);

    return this.canCustomFormat && extensionList.some((item) => item.value === this.asset!.extension);
  }

  @watch('proxies', { waitUntilFirstUpdate: true })
  @watch('supportedExtensions')
  handleSupportedExtensionsChange() {
    this.filteredProxies = this.proxies.filter((item) => {
      if (!item.extension && this.asset) {
        return this.supportedExtensions.includes(this.asset.extension.replace(/^\./, ''));
      }

      return true;
    });
    this.selectedProxy = this.filteredProxies[0]?.id ?? '';
  }

  open({
    asset,
    isFavorite,
    proxies,
  }: {
    asset: Asset & { previewUrl: string };
    isFavorite: boolean;
    proxies: AvailableProxy[];
  }) {
    this.asset = asset;
    this.isFavorite = isFavorite;
    this.proxies = proxies;
    this.isOpen = true;
  }

  hide() {
    this.handleClose();
  }

  setVersionHistory(versions: AssetVersion[]) {
    this.versions = versions;
    this.loadingVersionHistory = false;
  }

  setIsFavorite(isFavorite: boolean) {
    this.isFavorite = isFavorite;
    this.loadingFavorites = false;
  }

  setLoadingConfirm(loadingConfirm: boolean) {
    this.loadingConfirm = loadingConfirm;
  }

  mapFormatConfirmPayload(asset: Asset, selectedProxy?: AvailableProxy) {
    return {
      asset,
      extension: this.confirmedFormat?.extension ?? '',
      parameters: this.enabledTracking ? this.trackingParameters : undefined,
      proxiesPreference: selectedProxy?.proxyName,
      sourceProxyMetadata: {
        cdnName: selectedProxy?.cdnName ?? null,
        extension: selectedProxy?.proxyName === 'TRX' ? asset.extension : selectedProxy?.extension ?? null,
        height: selectedProxy?.proxyName === 'TRX' ? Number.parseInt(asset.height ?? '0', 10) : selectedProxy?.formatHeight ?? null,
        isCustomFormat: null,
        permanentLink: selectedProxy?.permanentLink ?? null,
        proxyLabel: selectedProxy?.proxyLabel ?? null,
        proxyName: selectedProxy?.proxyName ?? null,
        width: selectedProxy?.proxyName === 'TRX' ? Number.parseInt(asset.width ?? '0', 10) : selectedProxy?.formatWidth ?? null,
      },
      transformations: this.confirmedTransformations,
      transformedAssetMetadata: {
        extension: this.confirmedFormat?.extension ?? null,
        height: this.confirmedFormat?.height ?? null,
        isCustomFormat: true,
        permanentLink: null,
        width: this.confirmedFormat?.width ?? null,
      },
    };
  }

  mapProxyConfirmPayload(asset: Asset, selectedProxy?: AvailableProxy) {
    return {
      asset,
      extension: selectedProxy?.extension ?? asset.extension,
      parameters: this.enabledTracking ? this.trackingParameters : undefined,
      permanentLink: selectedProxy?.permanentLink ?? undefined,
      proxyPreference: selectedProxy?.proxyName ?? '',
      selectedProxyMetadata: {
        cdnName: selectedProxy?.cdnName ?? null,
        extension: selectedProxy?.proxyName === 'TRX' ? asset.extension : selectedProxy?.extension ?? null,
        height: selectedProxy?.proxyName === 'TRX' ? Number.parseInt(asset.height ?? '0', 10) : selectedProxy?.formatHeight ?? null,
        isCustomFormat: false,
        permanentLink: selectedProxy?.permanentLink ?? null,
        proxyLabel: selectedProxy?.proxyLabel ?? null,
        proxyName: selectedProxy?.proxyName ?? null,
        width: selectedProxy?.proxyName === 'TRX' ? Number.parseInt(asset.width ?? '0', 10) : selectedProxy?.formatWidth ?? null,
      },
      useRepresentative: this.selectedProxy === USE_REPRESENTATIVE_VALUE,
    };
  }

  private handleCancelCustomFormat() {
    this.assetLinkFormat.setActiveSetting('');
    this.showCustomFormat = false;

    /**
     * If no transformations have been confirmed, we need to reset the selected proxy to an empty string.
     */
    if (!this.confirmedFormat && this.confirmedTransformations.length === 0) {
      this.selectedProxy = '';
    }
  }

  private handleDoneCustomFormat() {
    this.confirmedTransformations = this.assetLinkFormat.transformations;
    this.confirmedFormat = this.assetLinkFormat.selectedFormat;
    this.assetLinkFormat.setActiveSetting('');
    this.showCustomFormat = false;
  }

  private handleFavorite() {
    if (this.loadingFavorites || !this.asset?.id) {
      return;
    }

    this.loadingFavorites = true;

    this.emit('cx-content-browser-format-dialog-favorite-change', {
      detail: {
        assetId: this.asset.id,
        isFavorite: this.isFavorite,
      },
    });
  }

  private handleProxyConfirm() {
    if (!this.asset) {
      return;
    }

    if (!this.canUseProxies) {
      this.loadingConfirm = true;
      this.emit('cx-content-browser-format-dialog-proxy-confirm', {
        detail: this.mapProxyConfirmPayload(this.asset),
      });

      return;
    }

    const selectedProxy = this.filteredProxies?.find((proxy) => {
      return proxy.id === this.selectedProxy;
    });

    if (this.selectedProxy === CUSTOM_FORMAT_VALUE) {
      const payload = this.mapFormatConfirmPayload(this.asset, selectedProxy);

      this.loadingConfirm = true;

      this.emit('cx-content-browser-format-dialog-format-confirm', {
        detail: payload,
      });
    } else {
      if (!selectedProxy && this.selectedProxy !== USE_REPRESENTATIVE_VALUE) {
        return;
      }

      const payload = this.mapProxyConfirmPayload(this.asset, selectedProxy);

      this.loadingConfirm = true;

      this.emit('cx-content-browser-format-dialog-proxy-confirm', {
        detail: payload,
      });
    }
  }

  private handleVersionHistory() {
    if (!this.asset) {
      return;
    }

    this.loadingVersionHistory = true;
    this.showVersionHistory = true;

    this.emit('cx-content-browser-format-dialog-version-history-open', {
      detail: {
        assetId: this.asset.id,
      },
    });
  }

  private handleProxySelect(event: CxSelectEvent<CxMenuItem>) {
    const value = event.detail.item.value;

    if (value === CUSTOM_FORMAT_VALUE) {
      this.showCustomFormat = true;
      this.selectedProxy = CUSTOM_FORMAT_VALUE;

      return;
    }

    if (value === 'tracking') {
      this.enabledTracking = !this.enabledTracking;

      return;
    }

    if (value === USE_REPRESENTATIVE_VALUE) {
      this.selectedProxy = USE_REPRESENTATIVE_VALUE;

      return;
    }

    if (value && this.proxies) {
      if (!this.proxies.map((item) => item.id).includes(value)) {
        return;
      }
      this.selectedProxy = value;
      this.confirmedFormat = undefined;

      if (this.confirmedTransformations.length > 0) {
        this.confirmedTransformations = [];
      }
    }
  }

  private handleTrackingParametersChange(event: CxContentBrowserAssetTrackingParametersChangeEvent) {
    this.trackingParameters = event.detail.values;
  }

  private renderHeader() {
    if (this.showVersionHistory) {
      return html`
        <cx-space slot="label" justify-content="space-between" align-items="center">
          <cx-space
            direction="vertical"
            spacing="2x-small"
            style=${styleMap({
              flex: '1',
            })}
          >
            <cx-typography variant="h4">${this.localize.term('versionHistory')}</cx-typography>
            <cx-typography variant="body3" class="content-browser-format__asset-name">
              <cx-line-clamp lines="1">${this.asset?.name}</cx-line-clamp>
            </cx-typography>
          </cx-space>
        </cx-space>
      `;
    }

    return html`
      <cx-space
        slot="label"
        justify-content="space-between"
        align-items="center"
      >
        <cx-space
          direction="vertical"
          spacing="2x-small"
          style=${styleMap({
            flex: '1',
          })}
        >
          <cx-typography variant="h4">
            ${when(this.canUseProxies,
              () => this.localize.term('customFormat'),
              () => this.localize.term('preview'),
            )}
          </cx-typography>
          <cx-typography variant="body3" class="content-browser-format__asset-name">
            <cx-line-clamp lines="1">${this.asset?.name}</cx-line-clamp>
          </cx-typography>
        </cx-space>
      </cx-space>
      ${when(
        this.canFavorite,
        () => html`
          <cx-tooltip
            slot="header-actions"
            content=${when(this.isFavorite,
              () => this.localize.term('unfavorite'),
              () => this.localize.term('favorite'),
            )}
            placement="bottom"
          >
            ${when(
              this.loadingFavorites,
              () => html`
                <cx-space
                  align-items="center"
                  justify-content="center"
                  style=${styleMap({
                    height: '32px',
                    width: '32px',
                  })}
                >
                  <cx-spinner></cx-spinner>
                </cx-space>
              `,
              () => html`
                <cx-icon-button
                  name="star"
                  variant=${when(this.isFavorite,
                    () => 'filled',
                    () => 'outlined',
                  )}
                  style=${styleMap({
                    color: this.isFavorite
                      ? 'var(--cx-color-warning)'
                      : 'var(--cx-color-text)',
                  })}
                  @click=${this.handleFavorite}
                ></cx-icon-button>
              `,
            )}
          </cx-tooltip>
        `,
        () => nothing,
      )}
      ${when(this.canViewVersions,
        () => html`
          <cx-tooltip
            slot="header-actions"
            content=${this.localize.term('versionHistory')}
            placement="bottom"
          >
            <cx-icon-button
              name="history"
              @click=${this.handleVersionHistory}
            ></cx-icon-button>
          </cx-tooltip>
        `,
        () => nothing,
      )}
    `;
  }

  private renderBody() {
    if (!this.asset) {
      return nothing;
    }

    let previewer: TemplateResult | undefined = undefined;
    let proxySelector: TemplateResult | undefined = undefined;

    if (this.asset.docType === MediaType.Image) {
      previewer = html`
        <cx-cropper id="cropper" class="content-browser-format__cropper" fill-image></cx-cropper>
      `;
    } else {
      previewer = html`
        <cx-content-browser-asset-preview
          image-url=${this.asset.imageUrl}
          original-url=${this.asset.originalUrl}
          preview-url=${this.asset.previewUrl}
          alt=${this.asset.name}
          doc-type=${this.asset.docType}
          extension=${this.asset.extension}
          controls
          ?in-cold-storage=${this.asset.inColdStorage}
        ></cx-content-browser-asset-preview>
      `;
    }

    if (this.showVersionHistory && this.asset.id) {
      return html`
        <cx-content-browser-asset-version-history
          ?loading=${this.loadingVersionHistory}
          .versions=${this.versions}
        ></cx-content-browser-asset-version-history>
      `;
    }

    if (this.canUseProxies) {
      proxySelector = html`
        <cx-content-browser-asset-proxy-selector
          selected=${this.selectedProxy || this.proxies[0]?.id}
          custom-width=${ifDefined(this.confirmedFormat?.width?.toString() || undefined)}
          custom-height=${ifDefined(this.confirmedFormat?.height?.toString() || undefined)}
          custom-extension=${ifDefined(this.confirmedFormat?.extension || undefined)}
          .items=${guard([this.filteredProxies],
            () => {
              return this.filteredProxies.map((proxy) => {
                if (proxy.proxyName === 'TRX' && this.asset) {
                  return {
                    cdnName: proxy.cdnName,
                    docType: this.asset.docType,
                    extension: this.asset.extension,
                    height: this.asset.height,
                    id: proxy.id,
                    name: proxy.proxyLabel,
                    value: proxy.proxyName,
                    width: this.asset.width,
                  };
                }

                return {
                  cdnName: proxy.cdnName,
                  docType: this.asset!.docType,
                  extension: proxy.extension,
                  height: String(proxy.formatHeight),
                  id: proxy.id,
                  name: proxy.proxyLabel,
                  value: proxy.proxyName,
                  width: String(proxy.formatWidth),
                };
              });
            })
          }
          .trackingParameters=${this.trackingParameters}
          ?can-custom-format=${this.canCustomFormat}
          ?can-use-representative=${guard([this.supportedRepresentativeSubtypes, this.asset],
            () => this.supportedRepresentativeSubtypes?.includes(safeString(this.asset?.docSubType)) && !!this.asset?.imageUrl,
          )}
          ?can-use-ats=${guard([this.availableExtensions, this.asset, this.canCustomFormat],
            () => this.canUseATS,
          )}
          ?can-use-tracking=${this.canTrack}
          ?enabled-tracking=${this.enabledTracking}
          ?disabled-selected=${this.selectedProxy === CUSTOM_FORMAT_VALUE}
          @cx-select=${this.handleProxySelect}
          @cx-content-browser-asset-tracking-parameters-change=${this.handleTrackingParametersChange}
        ></cx-content-browser-asset-proxy-selector>
      `;
    }

    return html`
      ${guard([this.asset], () => previewer)}
      ${guard([
          this.availableExtensions,
          this.asset,
          this.proxies,
          this.confirmedTransformations,
          this.selectedProxy,
          this.showCustomFormat,
        ],
        () => {
          if (this.asset?.docType !== MediaType.Image) {
            return nothing;
          }

          const extensions =
            this.availableExtensions?.[this.asset.docType]?.map((item) => ({
              displayName: item.displayName,
              value: item.value,
            })) ?? [];

          return html`
            <cx-asset-link-format
              for-cropper="cropper"
              hide-header
              selected-proxy=${ifDefined(this.selectedProxy === CUSTOM_FORMAT_VALUE ? undefined : this.selectedProxy)}
              use-custom-extension
              .asset=${this.asset}
              .baseUrl=${this.baseUrl}
              .extensions=${extensions}
              .queryElement=${this.shadowRoot}
              .proxies=${this.proxies}
              .token=${this.token}
              .transformations=${this.confirmedTransformations}
              style=${styleMap({
                display: this.showCustomFormat ? 'block' : 'none',
              })}
            >
            </cx-asset-link-format>
          `;
        },
      )}
      ${when(this.canUseProxies && !this.showCustomFormat,
        () => proxySelector,
        () => nothing,
      )}
    `;
  }

  private renderFooter() {
    if (this.showVersionHistory) {
      return nothing;
    }

    let content: TemplateResult | undefined = undefined;

    if (!this.canUseProxies) {
      content = html`
        <cx-button
          class="content-browser-format__footer__button"
          variant="primary"
          ?loading=${this.loadingProxies}
          @click=${this.handleProxyConfirm}
        >
          <cx-icon slot="prefix" name="folder"></cx-icon>
          <span
            style=${styleMap({
              textTransform: 'capitalize',
            })}
          >
            ${this.ctaText || this.localize.term('insert')}
          </span>
        </cx-button>
      `;
    } else if (this.showCustomFormat) {
      content = html`
        <cx-space
          spacing="small"
          style=${styleMap({
            width: 'fit-content',
          })}
        >
          <cx-button variant="default" @click=${this.handleCancelCustomFormat}>
            ${this.localize.term('cancel')}
          </cx-button>
          <cx-button variant="primary" @click=${this.handleDoneCustomFormat}>
            ${this.localize.term('done')}
          </cx-button>
        </cx-space>
      `;
    } else {
      content = html`
        <cx-button
          class="content-browser-format__footer__button"
          ?disabled=${this.disabledConfirm}
          ?loading=${this.loadingConfirm}
          variant="primary"
          style=${styleMap({
            flex: '1',
          })}
          @click=${this.handleProxyConfirm}
        >
          <span
            style=${styleMap({
              textTransform: 'capitalize',
            })}
          >
            ${this.ctaText || this.localize.term('insert')}
          </span>
        </cx-button>
      `;
    }

    return html`
      <div slot="footer" class="content-browser-format__footer">
        ${content}
      </div>
    `;
  }

  private renderContent() {
    return html`
      ${this.renderHeader()}
      ${this.renderBody()}
      ${this.renderFooter()}
    `;
  }

  private handleRequestClose(event: CxRequestCloseEvent) {
    if (this.loadingFavorites) {
      event.preventDefault();

      return;
    }

    if (this.showVersionHistory) {
      event.preventDefault();
      this.showVersionHistory = false;
    } else {
      this.handleClose();
    }
  }

  private handleClose() {
    this.asset = undefined;
    this.confirmedFormat = undefined;
    this.confirmedTransformations = [];
    this.isOpen = false;
    this.enabledTracking = false;
    this.filteredProxies = [];
    this.isFavorite = false;
    this.loadingConfirm = false;
    this.loadingVersionHistory = false;
    this.proxies = [];
    this.selectedProxy = '';
    this.showCustomFormat = false;
    this.showVersionHistory = false;
    this.trackingParameters = DEFAULT_TRACKING_PARAMETERS;
    this.versions = [];

    this.emit('cx-content-browser-format-dialog-close');
  }

  render() {
    return html`
      ${when(this.variant === ContentBrowserFormatDialogVariant.Drawer,
        () => html`
          <cx-drawer
            class="content-browser-format-drawer"
            placement="bottom"
            ?open=${this.isOpen}
            .boundary=${this.boundary}
            @cx-request-close=${this.handleRequestClose}
          >
            ${this.renderContent()}
          </cx-drawer>
        `,
        () => html`
          <cx-dialog
            class="content-browser-format-dialog"
            overlay-scrollbar-auto-hide="never"
            ?open=${this.isOpen}
            .boundary=${this.boundary}
            @cx-request-close=${this.handleRequestClose}
          >
            ${this.renderContent()}
          </cx-dialog>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-format-dialog': CxContentBrowserFormatDialog;
  }
}
