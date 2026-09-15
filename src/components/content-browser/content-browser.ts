import { CSSResultGroup, html, nothing, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import _camelCase from 'lodash-es/camelCase';

import { GetAssetLinkResponse } from '@/api/asset/asset.types';
import CortexElement from '@/base/element';
import CxContentBrowserBrowser from '@/components/content-browser-browser/content-browser-browser';
import CxContentBrowserControlBar from '@/components/content-browser-control-bar/content-browser-control-bar';
import CxContentBrowserFormatDialog from '@/components/content-browser-format-dialog/content-browser-format-dialog';
import CxContentBrowserGrid from '@/components/content-browser-grid/content-browser-grid';
import CxContentBrowserHeader from '@/components/content-browser-header/content-browser-header';
import CxContentBrowserNoResult from '@/components/content-browser-no-result/content-browser-no-result';
import CxContentBrowserTable from '@/components/content-browser-table/content-browser-table';
import {
    CxContentBrowserControlBarSearchChangeEvent, CxContentBrowserControlFilterChangeEvent,
    CxContentBrowserControlSortOrderChangeEvent, CxContentBrowserControlViewChangeEvent,
    CxContentBrowserFormatDialogFavoriteChangeEvent, CxContentBrowserFormatDialogFormatConfirmEvent,
    CxContentBrowserFormatDialogPinAssetChangeEvent, CxContentBrowserFormatDialogProxyConfirmEvent,
    CxContentBrowserFormatDialogVersionHistoryOpenEvent,
    CxContentBrowserGridClickEvent, CxContentBrowserGridResizeEvent, CxResizeEvent, CxSelectionChangeEvent,
} from '@/events';
import componentStyles from '@/styles/component.styles';
import { FetchAndMergeAssetsController } from '@/tools/fetch-and-merge-assets';
import {
  ChangeOption, ContentBrowserFormatDialogVariant, type ContentBrowserView, type CtaTextTransform,
  GridView, OptionType, TABLE_VIEW, type TableColumn,
} from '@/types/content-browser';
import { GetFolderRequest } from '@/types/folder';
import { safeInteger } from '@/utils/number';
import { watch } from '@/utils/watch';
import { resolveSiteSessionUrl, SITE_SESSION_EXPIRED_MESSAGE } from '@/utils/site-session';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxResizeObserver from '@orangelogic/design-system/components/resize-observer';
import CxSpace from '@orangelogic/design-system/components/space';
import CxTreeItem from '@orangelogic/design-system/components/tree-item';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import styles from './content-browser.styles';

import type { Asset, AssetLinkInfo, AssetTransformationInfo, GetAssetsRequest } from '@/types/asset';
export const COMPUTED_FIELDS = ['ScrubUrl', 'AllowATSLink'];
const MOBILE_WIDTH_THRESHOLD = 480;
const FORCE_OVERLAY_THRESHOLD = 650;
const PERSISTENT_DRAWER_WIDTH = 400;

/** How many items one screen of a view holds: small tiles and table rows both fit far more than a large tile. */
function resolvePageSize(view: ContentBrowserView): number {
  switch (view) {
    case GridView.Large:
      return 15;
    case GridView.Small:
    case TABLE_VIEW:
      return 30;
    default:
      return 20;
  }
}

/**
 * @summary CxContentBrowser
 */
@customElement('cx-content-browser')
export default class CxContentBrowser extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-content-browser-browser': CxContentBrowserBrowser,
    'cx-content-browser-control-bar': CxContentBrowserControlBar,
    'cx-content-browser-format-dialog': CxContentBrowserFormatDialog,
    'cx-content-browser-grid': CxContentBrowserGrid,
    'cx-content-browser-header': CxContentBrowserHeader,
    'cx-content-browser-no-result': CxContentBrowserNoResult,
    'cx-content-browser-table': CxContentBrowserTable,
    'cx-icon': CxIcon,
    'cx-icon-button': CxIconButton,
    'cx-resize-observer': CxResizeObserver,
    'cx-space': CxSpace,
  };

  private readonly localize = new LocalizeController(this);

  @query('cx-content-browser-format-dialog') formatDialog!: CxContentBrowserFormatDialog;

  @query('.content-browser__content') content!: HTMLDivElement;

  @property({ attribute: 'base-url', type: String })
  baseUrl = '';

  /**
   * Application name shown when no folder is selected.
   */
  @property({ attribute: 'application-name', type: String })
  applicationName = '';

  @property({
    attribute: 'available-doc-types',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[]) => value.join(' '),
    },
    reflect: true,
    type: Array,
  })
  availableDocTypes: string[] = [
    'DO_DOCUMENTS.Image_DbBO.*',
    'DO_DOCUMENTS.Audio_DbBO.*',
    'DO_DOCUMENTS.Multimedia_DbBO.*',
    'DO_DOCUMENTS.Video_DbBO.*',
  ];

  @property({
    attribute: 'allowed-extensions',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[]) => value.join(' '),
    },
    reflect: true,
    type: Array,
  })
  allowedExtensions: string[] = [];

  @property({
    attribute: 'allowed-folders',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[]) => value.join(' '),
    },
    reflect: true,
    type: Array,
  })
  allowedFolders: string[] = [];

  @property({
    attribute: 'available-representative-subtypes',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[]) => value.join(' '),
    },
    reflect: true,
    type: Array,
  })
  availableRepresentativeSubtypes: string[] = [];

  @property({ attribute: 'token', reflect: false, type: String })
  token = '';

  @property({ attribute: 'show-collections', reflect: true, type: Boolean })
  showCollections = false;

  @property({ attribute: 'show-favorite-folder', reflect: true, type: Boolean })
  showFavoriteFolder = false;

  @property({ attribute: 'show-close-button', reflect: true, type: Boolean })
  showCloseButton = false;

  @property({ attribute: 'use-session', reflect: false, type: String })
  useSession = '';

  @property({ attribute: 'use-site-session', type: Boolean })
  useSiteSession = false;

  @property({ attribute: 'can-pin', reflect: true, type: Boolean })
  canPin = false;

  @property({ attribute: 'can-favorite', reflect: true, type: Boolean })
  canFavorite = false;

  /**
   * Whether to show the pin/unpin action for the selected asset in the format dialog.
   * Not to be confused with `can-pin`, which controls pinning the folder browser drawer open.
   */
  @property({ attribute: 'can-pin-asset', reflect: true, type: Boolean })
  canPinAsset = false;

  @property({ attribute: 'can-use-proxies', reflect: true, type: Boolean })
  canUseProxies = false;

  /**
   * Pick-only mode: no available-proxies lookup, no transformation on confirm. The preview popup
   * shows the asset's LargeSizePreview and confirming emits the asset straight to the host.
   * Implies `can-use-proxies=false`.
   */
  @property({ attribute: 'simple-pick', reflect: true, type: Boolean })
  simplePick = false;

  @property({ attribute: 'can-view-versions', reflect: true, type: Boolean })
  canViewVersions = false;

  @property({ attribute: 'can-track', reflect: true, type: Boolean })
  canTrack = false;

  @property({ attribute: 'can-logout', reflect: true, type: Boolean })
  canLogout = false;

  @property({ attribute: 'cta-text', type: String })
  ctaText = '';

  @property({ attribute: 'cta-text-transform', type: String })
  ctaTextTransform: CtaTextTransform = 'capitalize';

  @property({
    attribute: 'extra-fields',
    converter: {
      fromAttribute: (value: string) => value.split(' '),
      toAttribute: (value: string[]) => value.join(' '),
    },
    reflect: true,
    type: Array,
  })
  extraFields: string[] = [];

  @property({ attribute: 'default-grid-view', type: String })
  defaultGridView: ContentBrowserView = GridView.Medium;

  /**
   * Columns of the table view, defined by the host: a title, the Cortex field the column reads, and
   * its styling. The table view is offered only while this is non-empty — an empty table is not a
   * view mode — and the fields are read once, when the fetch controller is created.
   */
  @property({
    attribute: 'table-columns',
    /**
     * Lit's stock Array converter returns `null` for anything `JSON.parse` rejects, and a host that
     * stringifies an array into the attribute hands it `""` or `"[object Object]"`. `null` then
     * throws on every read below, taking the whole picker down. An unreadable value means "no
     * columns", which turns the table view off — the same outcome as not configuring one.
     */
    converter: {
      fromAttribute: (value: string | null): TableColumn[] => {
        if (!value) {
          return [];
        }

        try {
          const parsed: unknown = JSON.parse(value);

          return Array.isArray(parsed) ? parsed as TableColumn[] : [];
        } catch {
          return [];
        }
      },
      toAttribute: (value: TableColumn[]) => JSON.stringify(value ?? []),
    },
    type: Array,
  })
  tableColumns: TableColumn[] = [];

  @property({ attribute: 'default-sort-order-name', type: String })
  defaultSortOrderName: string = '';

  @property({ attribute: 'default-sort-direction', type: String })
  defaultSortDirection: 'ascending' | 'descending' = 'ascending';

  @property({ attribute: 'default-selected-facets', type: Object })
  defaultSelectedFacets: Record<string, string[]> = {};

  @property({ attribute: 'default-is-see-through', type: Boolean })
  defaultIsSeeThrough: boolean = false;

  @property({ attribute: 'default-search-text', type: String })
  defaultSearchText: string = '';

  @property({ attribute: 'default-folder-id', type: String })
  defaultFolderId: string = '';

  @property({ attribute: 'show-title', reflect: true, type: Boolean })
  showTitle: boolean = true;

  @property({ attribute: 'show-size', reflect: true, type: Boolean })
  showSize: boolean = true;

  @property({ attribute: 'show-dimensions', reflect: true, type: Boolean })
  showDimensions: boolean = true;

  @property({ attribute: 'show-tags', reflect: true, type: Boolean })
  showTags: boolean = false;
  
  @property({ attribute: 'views', type: Array })
  views = [
    {
      label: this.localize.term('smallLabeled'),
      value: 'small',
    },
    {
      label: this.localize.term('mediumLabeled'),
      value: 'medium',
    },
    {
      label: this.localize.term('largeLabeled'),
      value: 'large',
    },
  ];

  @property({ attribute: 'error-message', reflect: true, type: String })
  errorMessage: string = '';


  @state()
  private forceOverlay = false;

  @state()
  private canPinLayout = true;

  @state()
  private view: ContentBrowserView = this.defaultGridView;

  @state()
  private folderTitle: string | undefined = undefined;

  @state()
  assets: Asset[] = [];

  @state()
  lastRequest: GetAssetsRequest = {
    isSeeThrough: true,
    start: 0,
  };

  @state()
  private newlyChangedOption: ChangeOption | undefined;

  @state()
  selectedAssetId: string | undefined = undefined;

  @state()
  isMobile: boolean = false;

  private defaultPageSize = 10;

  private fetchAndMergeAssetsController: FetchAndMergeAssetsController;

  willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (!this.hasUpdated) {
      // A table with no columns is not a view, so a stored or configured `table` falls back to the
      // grid rather than rendering an empty frame the user cannot switch out of.
      this.view = this.defaultGridView === TABLE_VIEW && !this.canUseTable
        ? GridView.Medium
        : this.defaultGridView;
    }
  }

  /**
   * Never trust the host's value: it also arrives by direct property assignment, past the converter.
   * Entries are checked one by one, not just the outer array — `field` is dereferenced while the
   * fetch controller is being built, where a throw leaves the controller unassigned and the picker
   * blank. `title` is only rendered, and Lit renders a nullish one as nothing, so a column is not
   * worth dropping over it.
   */
  private get tableColumnList(): TableColumn[] {
    const columns: unknown = this.tableColumns;

    if (!Array.isArray(columns)) {
      return [];
    }

    return columns.filter((column): column is TableColumn => {
      return !!column && typeof column === 'object'
        && typeof (column as TableColumn).field === 'string'
        && (column as TableColumn).field.length > 0;
    });
  }

  private get canUseTable(): boolean {
    return this.tableColumnList.length > 0;
  }

  runFirstUpdated() {
    if (this.useSiteSession) {
      this.baseUrl = resolveSiteSessionUrl(this.baseUrl);
    }

    this.defaultPageSize = resolvePageSize(this.view);

    this.lastRequest = {
      ...this.lastRequest,
      folderId: this.defaultFolderId,
      isSeeThrough: this.defaultIsSeeThrough,
      searchText: this.defaultSearchText,
      selectedFacets: this.defaultSelectedFacets,
      sortDirection: this.defaultSortDirection,
      sortOrderName: this.defaultSortOrderName,
    };

    this.updateComplete.then(() => {
      this.fetchAndMergeAssetsController = new FetchAndMergeAssetsController(this, {
        additionalFields: this.tableColumnList.map((column) => column.field),
        availableDocTypes: this.availableDocTypes,
        baseUrl: this.baseUrl,
        defaultFolderId: this.defaultFolderId,
        defaultIsSeeThrough: this.defaultIsSeeThrough,
        defaultSearchText: this.defaultSearchText,
        defaultSelectedFacets: this.defaultSelectedFacets,
        defaultSortDirection: this.defaultSortDirection,
        defaultSortOrderName: this.defaultSortOrderName,
        token: this.token,
        useSession: this.useSession,
        useSiteSession: this.useSiteSession,
      });

      this.requestUpdate();
    });
  }

  async fetchAssets(request: GetAssetsRequest) {
    return await this.fetchAndMergeAssetsController.fetchAssets(request);
  }

  async fetchFolders(request: GetFolderRequest) {
    return await this.fetchAndMergeAssetsController.fetchFolders(request);
  }

  async selectAsset(id: string) {
    await this.openFormatDialog(id);
  }

  /**
   * The host application owns pinned state; call this once it has resolved a
   * pin/unpin request (see `cx-content-browser-pin-asset-change`) to reflect the result.
   */
  setIsAssetPinned(isAssetPinned: boolean) {
    this.formatDialog.setIsAssetPinned(isAssetPinned);
  }

  #openingAsset = false;

  #insertInFlight = false;

  private async openFormatDialog(id: string) {
    // A row click and its CTA button can both land before the fetch resolves, and each one would
    // otherwise open its own dialog — or, on the auto-confirm path, insert the asset again. The
    // second guard covers the rest of an auto-confirmed insert, which outlives the fetch and has no
    // dialog of its own: without it the next asset's dialog inherits that insert and is torn down
    // when it settles.
    if (this.#openingAsset || this.#insertInFlight) {
      return;
    }

    this.#openingAsset = true;
    this.selectedAssetId = id;

    try {
      const asset = await this.fetchAndMergeAssetsController.fetchAssetByID(id, {
        canFavorite: this.canFavorite,
        simplePick: this.simplePick,
      });

      if (!asset) {
        this.selectedAssetId = undefined;

        return;
      }

      let isAssetPinned = false;

      if (this.canPinAsset) {
        const lookupEvent = this.emit('cx-content-browser-pin-asset-lookup', {
          detail: { assetId: id, isAssetPinned: false },
        });

        isAssetPinned = lookupEvent.detail.isAssetPinned;
      }

      this.formatDialog.open({ ...asset, isAssetPinned });
    } catch {
      this.selectedAssetId = undefined;
    } finally {
      this.#openingAsset = false;
    }
  }

  @watch('lastRequest', { waitUntilFirstUpdate: true })
  async handleLastRequestChange() {
    this.emit('cx-content-browser-request-change', {
      detail: {
        request: this.lastRequest,
        view: this.view,
      },
    });
  }

  @watch('tableColumns', { waitUntilFirstUpdate: true })
  handleTableColumnsChange() {
    if (!this.fetchAndMergeAssetsController) {
      return;
    }

    this.fetchAndMergeAssetsController.updateAdditionalFields(
      this.tableColumnList.map((column) => column.field),
    );

    // Rows already on screen were fetched without the new fields, so their cells would stay blank.
    // This has to be the stateful path -- `fetchAssets` only returns the response and refreshes
    // nothing -- and it has to start from zero: past the first page the controller appends and
    // de-duplicates by recordId, which keeps the field-less rows it already had.
    this.lastRequest = { ...this.lastRequest, start: 0 };

    void this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  @watch(['token', 'useSession'], { waitUntilFirstUpdate: true })
  handleAuthChange() {
    this.fetchAndMergeAssetsController?.updateAuth(this.token, this.useSession);
  }

  @watch('useSiteSession', { waitUntilFirstUpdate: true })
  handleSiteSessionChange() {
    if (this.useSiteSession) {
      this.baseUrl = resolveSiteSessionUrl(this.baseUrl);
    }

    this.fetchAndMergeAssetsController?.updateSiteSession(
      this.useSiteSession,
      this.baseUrl,
      this.token,
      this.useSession,
    );
  }

  private async handleSortOrderChange(event: CxContentBrowserControlSortOrderChangeEvent) {
    const { sortDirection, sortOrderName } = event.detail;

    if (sortDirection !== this.lastRequest.sortDirection) {
      this.newlyChangedOption = {
        type: OptionType.SORT_DIRECTION,
        value: sortDirection,
      };
    }

    if (sortOrderName !== this.lastRequest.sortOrderName) {
      this.newlyChangedOption = {
        type: OptionType.SORT_ORDER,
        value: sortOrderName,
      };
    }

    this.lastRequest = {
      ...this.lastRequest,
      sortDirection,
      sortOrderName,
      start: 0,
    };

    await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  private async handleFilterChange(event: CxContentBrowserControlFilterChangeEvent) {
    this.lastRequest = {
      ...this.lastRequest,
      selectedFacets: event.detail.selection,
      start: 0,
    };
    await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  private async handleViewChange(event: CxContentBrowserControlViewChangeEvent) {
    if (event.detail.isSeeThrough !== this.lastRequest.isSeeThrough) {
      this.lastRequest = {
        ...this.lastRequest,
        isSeeThrough: event.detail.isSeeThrough,
        start: 0,
      };
      await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
    }

    this.defaultPageSize = resolvePageSize(event.detail.view);

    this.view = event.detail.view;
  }

  private async handleScrollEnd() {
    const newStart = safeInteger(this.lastRequest.start) + safeInteger(this.lastRequest.pageSize);

    this.lastRequest = {
      ...this.lastRequest,
      pageSize: this.defaultPageSize,
      start: newStart,
    };

    await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  private async handleFolderSelectionChange(event: CxSelectionChangeEvent<CxTreeItem>) {
    if (
      !event.detail.selection?.length ||
      !event.detail.selection[0].dataset?.id
    ) {
      return;
    }

    const { id: folderId, name: folderTitle } = event.detail.selection[0].dataset;

    this.folderTitle = folderTitle;

    if (!folderId || folderId === this.lastRequest.folderId) {
      return;
    }

    this.lastRequest = {
      ...this.lastRequest,
      folderId,
      start: 0,
    };

    await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  private async handleSearchChange(event: CxContentBrowserControlBarSearchChangeEvent) {
    this.lastRequest = {
      ...this.lastRequest,
      searchText: event.detail.searchText,
      start: 0,
    };
    await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  private async handleGridResize(event: CxContentBrowserGridResizeEvent) {
    const { columnCount, rowCount } = event.detail;
    const newPageSize = Math.ceil((rowCount * columnCount) / this.defaultPageSize + 1) * this.defaultPageSize;
    const totalCount = this.fetchAndMergeAssetsController.getData().totalCount;
    const newStart = safeInteger(this.lastRequest.start) + safeInteger(this.lastRequest.pageSize);

    if (newPageSize <= safeInteger(this.lastRequest.pageSize) || newPageSize === 0 || newStart > totalCount) {
      return;
    }

    this.lastRequest = {
      ...this.lastRequest,
      pageSize: newPageSize - safeInteger(this.lastRequest.pageSize),
      start: newStart,
    };

    await this.fetchAndMergeAssetsController.fetchAndMergeAssets(this.lastRequest);
  }

  private async handleGridClick(event: CxContentBrowserGridClickEvent) {
    const { id } = event.detail;

    await this.openFormatDialog(id);
  }

  private async handleVersionHistoryOpen(event: CxContentBrowserFormatDialogVersionHistoryOpenEvent) {
    const { assetId } = event.detail;

    const data = await this.fetchAndMergeAssetsController.fetchAssetVersionHistory(assetId);

    this.formatDialog.setVersionHistory(data.versions);
  }

  private async handleFavoriteChange(event: CxContentBrowserFormatDialogFavoriteChangeEvent) {
    const { assetId, isFavorite } = event.detail;

    let status = false;

    this.emit('cx-content-browser-favorite-change', {
      detail: {
        assetId,
        isFavorite,
      },
    });

    if (isFavorite) {
      status = await this.fetchAndMergeAssetsController.removeAssetFromFavorite(assetId);
    } else {
      status = await this.fetchAndMergeAssetsController.addAssetToFavorite(assetId);
    }

    if (status) {
      this.formatDialog.setIsFavorite(!isFavorite);
      this.emit('cx-content-browser-favorite-changed-status', {
        detail: {
          assetId,
          isFavorite: !isFavorite,
        },
      });
    }
  }

  /**
   * Pinned state is owned by the host application, not the SDK, so this only forwards
   * the toggle request outward. The host is responsible for calling `setIsAssetPinned()`
   * once it has resolved the pin/unpin action.
   */
  private handlePinAssetChange(event: CxContentBrowserFormatDialogPinAssetChangeEvent) {
    const { assetId, isPinned } = event.detail;

    this.emit('cx-content-browser-pin-asset-change', {
      detail: {
        assetId,
        isPinned,
      },
    });
  }

  private async handleProxyConfirm(event: CxContentBrowserFormatDialogProxyConfirmEvent) {
    // Simple-pick mode hands the host the asset it already has: there is no proxy or transformation
    // to resolve, so a GetAssetLink round trip would only re-fetch what the grid fetched.
    if (this.simplePick) {
      // handleSelectedAsset builds the payload off images[0], so stand in the preview the grid
      // already fetched (CoreField.LargeSizePreview) as the link rather than leaving it empty.
      this.handleSelectedAsset({
        asset: event.detail.asset,
        images: [{ imageUrl: event.detail.asset.imageUrl ?? '' }],
        selectedProxyMetadata: event.detail.selectedProxyMetadata,
      });

      this.formatDialog.hide();

      return;
    }

    // Only the asynchronous path needs this; simple-pick above resolves synchronously.
    this.#insertInFlight = true;

    try {
      const response = await this.fetchAndMergeAssetsController.getAssetLink({
        ...event.detail,
        assets: [event.detail.asset],
        extraFields: this.extraFields,
      });

      // Only a real failure keeps the dialog open. A successful response with no link is not one: an asset with
      // no file of its own (digitized = 0 — e.g. a text fragment) has nothing to link to, yet still carries the
      // ExtraFields the host asked for, and swallowing the selection leaves the integration with no callback
      // and no error to act on.
      if (response.isError) {
        this.reportProxyConfirmFailure();

        return;
      }

      this.handleSelectedAsset({
        asset: event.detail.asset,
        images: response.data,
        selectedProxyMetadata: event.detail.selectedProxyMetadata,
      });

      this.formatDialog.hide();
    } catch {
      this.reportProxyConfirmFailure();
    } finally {
      this.#insertInFlight = false;
    }
  }

  /**
   * An auto-confirmed insert never opened a dialog, so stopping its spinner reports the failure
   * nowhere and leaves the row selected with nothing pending. Reset the selection in that case.
   */
  private reportProxyConfirmFailure() {
    if (this.formatDialog.isDialogOpen) {
      this.formatDialog.setLoadingConfirm(false);
    } else {
      this.formatDialog.hide();
    }
  }

  private async handleFormatConfirm(event: CxContentBrowserFormatDialogFormatConfirmEvent) {
    try {
      const response = await this.fetchAndMergeAssetsController.getAssetLink({
        ...event.detail,
        assets: [event.detail.asset],
        extraFields: this.extraFields,
      });

      // Only a real failure keeps the dialog open. A successful response with no link is not one: an asset with
      // no file of its own (digitized = 0 — e.g. a text fragment) has nothing to link to, yet still carries the
      // ExtraFields the host asked for, and swallowing the selection leaves the integration with no callback
      // and no error to act on.
      if (response.isError) {
        this.formatDialog.setLoadingConfirm(false);

        return;
      }

      this.handleSelectedAsset({
        asset: event.detail.asset,
        images: response.data,
        selectedProxyMetadata: event.detail.sourceProxyMetadata,
        transformedAssetMetadata: event.detail.transformedAssetMetadata,
      });

      this.formatDialog.hide();
    } catch {
      this.formatDialog.setLoadingConfirm(false);
    }
  }

  private async handleFormatDialogClose() {
    this.selectedAssetId = undefined;
  }

  private handleSelectedAsset(data: {
    asset: Asset;
    images: GetAssetLinkResponse[];
    selectedProxyMetadata?: AssetLinkInfo;
    transformedAssetMetadata?: AssetTransformationInfo;
  }) {
    const { asset, images, selectedProxyMetadata, transformedAssetMetadata } = data;

    const payload: Array<Record<string, unknown>> = [...images];

    /**
     * Inject info from COMPUTED_FIELDS if requested, which are from the getContent api, not from the extra fields of the getLink response
     */
    for (const item of COMPUTED_FIELDS) {
      const key = _camelCase(item) as keyof Asset;

      if (asset && this.extraFields?.includes(item)) {
        payload[0] = {
          ...payload[0],
          extraFields: {
            ...(payload[0]?.extraFields || {}),
            [item]: asset[key],
          },
        };
      }

      /**
       * Inject info from the selected proxy or transformation
       */
      if (transformedAssetMetadata) {
        /**
         * Inject info stored in the selected transformation in UI, the transformation source from the AvailableProxies api, and the link from the getLink response
         */
        payload[0] = {
          ...payload[0],
          assetLinkInfo: {
            extension: transformedAssetMetadata.extension,
            height: transformedAssetMetadata.height,
            isCustomFormat: transformedAssetMetadata.isCustomFormat,
            permanentLink: payload[0].imageUrl,
            width: transformedAssetMetadata.width,
          },
          assetTransformationSource: selectedProxyMetadata,
        };
      } else {
        /**
         * Inject info from the selected proxy from the AvailableProxies api, and the link from the getLink response
         */
        payload[0] = {
          ...payload[0],
          assetLinkInfo: {
            cdnName: selectedProxyMetadata?.cdnName,
            extension: selectedProxyMetadata?.extension,
            height: selectedProxyMetadata?.height,
            isCustomFormat: selectedProxyMetadata?.isCustomFormat,
            permanentLink: payload[0].imageUrl,
            proxyLabel: selectedProxyMetadata?.proxyLabel,
            proxyName: selectedProxyMetadata?.proxyName,
            width: selectedProxyMetadata?.width,
          },
        };
      }
    }

    this.emit('cx-content-browser-selected-asset', {
      detail: payload,
    });
  }

  private handleResize(event: CxResizeEvent) {
    const entries = event.detail.entries;

    if (entries[0].target !== this.content) {
      return;
    }

    const width = entries[0].contentRect.width;
    this.isMobile = width < MOBILE_WIDTH_THRESHOLD;
    this.forceOverlay = width < FORCE_OVERLAY_THRESHOLD;
    this.canPinLayout = width >= FORCE_OVERLAY_THRESHOLD + PERSISTENT_DRAWER_WIDTH;
  }

  render() {
    if (!this.fetchAndMergeAssetsController) {
      return nothing;
    }

    const {
      availableExtensions,
      availableFacets,
      facets,
      isLoggedIn,
      items,
      loading,
      parameters,
      request,
      sortOrders,
      totalCount,
      userInfo,
    } = this.fetchAndMergeAssetsController.getData({
      allowedExtensions: this.allowedExtensions,
      availableRepresentativeSubtypes: this.availableRepresentativeSubtypes,
    });

    if (!isLoggedIn) {
      return html`
        ${when(this.useSiteSession && this.showCloseButton, () => html`
          <cx-content-browser-header show-close-button></cx-content-browser-header>
        `)}
        <cx-space class="content-browser__message" align-items="center" justify-content="center" spacing="small" direction="vertical">
          <cx-icon name="warning" class="content-browser__message__icon"></cx-icon>
          ${when(this.useSiteSession || this.errorMessage,
            () => html`
              <cx-typography class="content-browser__message__text">
                ${this.useSiteSession ? SITE_SESSION_EXPIRED_MESSAGE : this.errorMessage}
              </cx-typography>
            `,
            () => nothing,
          )}
        </cx-space>
      `;
    }

    return html`
      ${
        when(parameters,
        () => html`
          <cx-content-browser-browser
            collection-path=${ifDefined(parameters?.collectionPath)}
            favorite-folder-id=${ifDefined(userInfo?.favoriteFolderRecordID)}
            folder-id=${ifDefined(this.lastRequest.folderId || undefined)}
            folder-title=${ifDefined(this.folderTitle || undefined)}
            token=${this.useSiteSession ? '' : this.token}
            base-url=${this.baseUrl}
            use-session=${this.useSiteSession ? '' : this.useSession}
            ?use-site-session=${this.useSiteSession}
            ?can-favorite=${this.canFavorite}
            ?can-pin=${this.canPin && this.canPinLayout}
            ?force-overlay=${this.forceOverlay}
            ?show-collections=${this.showCollections}
            ?show-favorite-folder=${this.showFavoriteFolder}
            @cx-selection-change=${this.handleFolderSelectionChange}
          >
            <cx-icon-button slot="trigger" name="menu">
              <cx-icon name="add"></cx-icon>
            </cx-icon-button>
          </cx-content-browser-browser>
        `,
        () => nothing,
      )}
      <cx-resize-observer @cx-resize=${this.handleResize}>
        <cx-space direction="vertical" spacing="3x-small" class="content-browser__content">
          <cx-content-browser-header
            application-name=${ifDefined(this.applicationName || undefined)}
            avatar=${ifDefined(userInfo?.avatar)}
            full-name=${ifDefined(userInfo?.fullName)}
            folder-title=${ifDefined(this.folderTitle || undefined)}
            ?can-logout=${!this.useSiteSession && this.canLogout}
            ?show-close-button=${this.showCloseButton}
          ></cx-content-browser-header>
          <cx-content-browser-control-bar
            .availableFacets=${availableFacets}
            .selectedFacets=${request?.selectedFacets ?? {}}
            .facets=${facets}
            .newlyChangedOption=${this.newlyChangedOption}
            .sortOrders=${sortOrders}
            .views=${this.views}
            ?can-use-table=${this.canUseTable}
            ?is-mobile=${this.isMobile}
            ?is-see-through=${request?.isSeeThrough}
            ?loading=${loading}
            can-sort
            current-count=${items.length}
            search-text=${ifDefined(request?.searchText)}
            sort-order-name=${ifDefined(request?.sortOrderName)}
            sort-direction=${ifDefined(request?.sortDirection)}
            total-count=${totalCount}
            view=${this.view}
            @cx-content-browser-control-view-change=${this.handleViewChange}
            @cx-content-browser-control-sort-order-change=${this.handleSortOrderChange}
            @cx-content-browser-control-filter-change=${this.handleFilterChange}
            @cx-content-browser-control-bar-search-change=${this.handleSearchChange}
          ></cx-content-browser-control-bar>
          ${when(this.view === TABLE_VIEW && this.canUseTable,
            () => html`
              <cx-content-browser-table
                .assets=${items}
                .columns=${this.tableColumnList}
                ?empty=${!loading && items.length === 0}
                cta-text=${this.ctaText}
                cta-text-transform=${this.ctaTextTransform}
                ?has-more=${items.length < totalCount}
                ?loading=${loading}
                selected-asset-id=${ifDefined(this.selectedAssetId || undefined)}
                @cx-content-browser-grid-scroll-end=${this.handleScrollEnd}
                @cx-content-browser-grid-resize=${this.handleGridResize}
                @cx-content-browser-grid-click=${this.handleGridClick}
              ></cx-content-browser-table>
            `,
            () => html`
              <cx-content-browser-grid
                .assets=${items}
                ?has-more=${items.length < totalCount}
                ?loading=${loading}
                ?show-title=${this.showTitle}
                ?show-size=${this.showSize}
                ?show-dimensions=${this.showDimensions}
                ?show-tags=${this.showTags}
                selected-asset-id=${ifDefined(this.selectedAssetId || undefined)}
                view=${this.view}
                @cx-content-browser-grid-scroll-end=${this.handleScrollEnd}
                @cx-content-browser-grid-resize=${this.handleGridResize}
                @cx-content-browser-grid-click=${this.handleGridClick}
              ></cx-content-browser-grid>
            `,
          )}
        </cx-resize-observer>
        <cx-content-browser-format-dialog
          .availableExtensions=${availableExtensions}
          .boundary=${this.content}
          .supportedExtensions=${ifDefined(parameters?.supportedExtensions)}
          .supportedRepresentativeSubtypes=${ifDefined(parameters?.supportedRepresentativeSubtypes)}
          auto-extension=${ifDefined(parameters?.autoExtension)}
          base-url=${this.baseUrl}
          cta-text=${this.ctaText}
          cta-text-transform=${this.ctaTextTransform}
          variant=${this.isMobile ? ContentBrowserFormatDialogVariant.Drawer : ContentBrowserFormatDialogVariant.Dialog}
          token=${this.useSiteSession ? '' : this.token}
          ?auto-confirm-single-option=${this.view === TABLE_VIEW && this.canUseTable}
          ?can-custom-format=${!!parameters?.ATSEnabled}
          ?can-favorite=${this.canFavorite}
          ?can-pin-asset=${this.canPinAsset}
          ?can-track=${this.canTrack}
          ?can-use-proxies=${this.canUseProxies && !this.simplePick}
          ?simple-pick=${this.simplePick}
          ?can-view-versions=${this.canViewVersions}
          @cx-content-browser-format-dialog-version-history-open=${this.handleVersionHistoryOpen}
          @cx-content-browser-format-dialog-favorite-change=${this.handleFavoriteChange}
          @cx-content-browser-format-dialog-pin-asset-change=${this.handlePinAssetChange}
          @cx-content-browser-format-dialog-proxy-confirm=${this.handleProxyConfirm}
          @cx-content-browser-format-dialog-format-confirm=${this.handleFormatConfirm}
          @cx-content-browser-format-dialog-close=${this.handleFormatDialogClose}
        >
        </cx-content-browser-format-dialog>
      </cx-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser': CxContentBrowser;
  }
}
