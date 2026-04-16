import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import { apiGetCollections } from '@/api/folder';
import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import CxButton from '@orangelogic/design-system/components/button';
import CxDetails from '@orangelogic/design-system/components/details';
import CxDrawer from '@orangelogic/design-system/components/drawer';
import CxFolderSelect from '@orangelogic/design-system/components/folder-select';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxSpace from '@orangelogic/design-system/components/space';
import CxTooltip from '@orangelogic/design-system/components/tooltip';
import CxTypography from '@orangelogic/design-system/components/typography';
import { svgToDataUrl } from '@/utils/string';
import { customElement, getTabbableBoundary, LocalizeController } from '@orangelogic/design-system/utils';

import styles from './content-browser-browser.styles';

import type { CxFolderSelectSearchTermChangeEvent } from '@/events';
import type { Folder, GetFolderRequest } from '@/types/folder';
import type { CSSResultGroup, TemplateResult } from 'lit';
const LIBRARY_FOLDER_TITLE = 'Library';
export const LEFT_PANEL_OPEN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#52525B"><path d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>';
export const LEFT_PANEL_CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#52525B"><path d="M660-320v-320L500-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>';

/**
 * @summary Folder browser drawer (folders tree + optional collections). Converted from ContentBrowserSDK Browser React component.
 */
@customElement('cx-content-browser-browser')
export default class CxContentBrowserBrowser extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-details': CxDetails,
    'cx-drawer': CxDrawer,
    'cx-folder-select': CxFolderSelect,
    'cx-icon-button': CxIconButton,
    'cx-space': CxSpace,
    'cx-tooltip': CxTooltip,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @query('.drawer-trigger') trigger: HTMLSlotElement;

  @query('.content-browser-browser') drawer: CxDrawer;

  @property({ attribute: 'folder-id', type: String })
  folderId: string = '';

  @property({ attribute: 'folder-title', type: String })
  folderTitle: string = '';

  @property({ attribute: 'allowed-folders', type: Array })
  allowedFolders: string[] = [];

  @property({ attribute: 'can-pin', type: Boolean })
  canPin = false;

  @property({ attribute: 'collection-path', type: String })
  collectionPath = '';

  @property({ attribute: 'favorite-folder-id', type: String })
  favoriteFolderId = '';

  @property({ attribute: 'show-collections', type: Boolean })
  showCollections = false;

  @property({ attribute: 'show-favorite-folder', type: Boolean })
  showFavoriteFolder = false;

  @property({ attribute: 'force-overlay', type: Boolean })
  forceOverlay = false;

  @property({ attribute: 'see-thru', type: Boolean })
  seeThru = false;

  @property({ attribute: 'min-query-length', type: Number })
  minQueryLength = 2;

  @property({ attribute: 'token', type: String })
  token = '';

  @property({ attribute: 'base-url', type: String })
  baseUrl = '';

  @state()
  private searchTerm = '';

  @state()
  private isPersistent = false;

  private apiGetCollections = apiGetCollections;

  private get variant(): CxDrawer['variant'] {
    return this.forceOverlay || !this.isPersistent ? 'overlay' : 'persistent';
  }

  private get noCloseButton(): boolean {
    return !this.forceOverlay && this.isPersistent;
  }

  constructor() {
    super();

    this.collectionApi = this.collectionApi.bind(this);
    this.handleFirstFetchCallback = this.handleFirstFetchCallback.bind(this);
  }

  async handleTriggerClick() {
    if (this.drawer.open) {
      this.hide();
    } else {
      this.show();
      this.focusOnTrigger();
    }
  }

  private handleTriggerKeyDown(event: KeyboardEvent) {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();

      if (!this.drawer.open) {
        this.show();
        this.focusOnTrigger();
      }
    }
  }

  private handleTriggerKeyUp(event: KeyboardEvent) {
    // Prevent space from triggering a click event in Firefox
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
    }
  }

  private handleTriggerSlotChange() {
    this.updateAccessibleTrigger();
  }

  focusOnTrigger() {
    const trigger = this.trigger.assignedElements({ flatten: true })[0] as
      | HTMLElement
      | undefined;

    if (typeof trigger?.focus === 'function') {
      trigger.focus();
    }
  }

  private getAccessibleTriggerTarget(): HTMLElement | undefined {
    const assignedElements = this.trigger.assignedElements({
      flatten: true,
    }) as HTMLElement[];
    const accessibleTrigger = assignedElements.find(
      (el) => getTabbableBoundary(el).start,
    );

    if (!accessibleTrigger) {
      return undefined;
    }

    switch (accessibleTrigger.tagName.toLowerCase()) {
      case 'cx-button':
      case 'cx-icon-button':
        return (accessibleTrigger as CxButton | CxIconButton).button;
      default:
        return accessibleTrigger;
    }
  }

    //
  // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
  // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
  // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
  // a child of the slotted element, or an element in the slotted element's shadow root.
  //
  // For example, the accessible trigger of an <cx-button> is a <button> located inside its shadow root.
  //
  // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
  //
  updateAccessibleTrigger() {
    const target = this.getAccessibleTriggerTarget();

    if (target) {
      target.setAttribute('aria-haspopup', 'true');
      target.setAttribute('aria-expanded', this.drawer.open ? 'true' : 'false');
    }
  }

  blurTrigger() {
    const target = this.getAccessibleTriggerTarget();

    if (target) {
      target.blur();
    }
  }

  show() {
    this.drawer.show();
  }

  hide() {
    this.drawer.hide();
  }

  private handleFirstFetchCallback(data: Folder[]): void {
    let first = null;

    if (this.allowedFolders.length) {
      first = data.find((item) => this.allowedFolders.includes(item.id)) ?? data[0];
    } else {
      first = data.find((item) => item.title === LIBRARY_FOLDER_TITLE) ?? data[0];
    }

    if (first) {
      this.emit('cx-selection-change', {
        detail: {
          selection: [{
            dataset: {
              id: first.id,
              name: first.title,
            },
          }],
        },
      });
    }
  }

  private handlePinClick(): void {
    this.isPersistent = !this.isPersistent;
  }

  private handleFolderSelectSearchTermChange(event: CxFolderSelectSearchTermChangeEvent): void {
    this.searchTerm = event.detail.value;
  }

  private collectionApi(params: GetFolderRequest) {
    return this.apiGetCollections({
      ...params,
      folderId: this.collectionPath,
    });
  }

  render(): TemplateResult {
    return html`
      <slot
        name="trigger"
        slot="anchor"
        part="trigger"
        class=${classMap({
          'drawer-trigger': true,
          'drawer-trigger--hidden': this.isPersistent,
        })}
        @click=${this.handleTriggerClick}
        @keydown=${this.handleTriggerKeyDown}
        @keyup=${this.handleTriggerKeyUp}
        @slotchange=${this.handleTriggerSlotChange}
      ></slot>
      <cx-drawer
        class="content-browser-browser"
        label="browser"
        placement="start"
        contained
        variant=${this.variant}
        ?no-close-button=${this.noCloseButton}
        @cx-after-show=${this.updateAccessibleTrigger}
        @cx-after-hide=${this.updateAccessibleTrigger}
      >
        ${when(
          !this.forceOverlay && this.canPin,
          () => html`
            <cx-tooltip
              slot="header-actions"
              content=${this.isPersistent ? this.localize.term('collapseMenu') : this.localize.term('expandMenu')}>
              <cx-icon-button
                src=${this.isPersistent ? svgToDataUrl(LEFT_PANEL_CLOSE_ICON) : svgToDataUrl(LEFT_PANEL_OPEN_ICON)}
                @click=${this.handlePinClick}
              ></cx-icon-button>
            </cx-tooltip>
          `,
          () => nothing,
        )}
        <cx-space direction="vertical" spacing="small" wrap="nowrap">
          <div class="browser__folders">
            <cx-space direction="vertical" spacing="small" wrap="nowrap">
              <cx-typography variant="body3">${this.localize.term('folders')}</cx-typography>
              <cx-folder-select
                name="folders"
                extra-folder-id=${ifDefined(this.showFavoriteFolder && this.favoriteFolderId ? this.favoriteFolderId : undefined)}
                extra-folder-title=${this.localize.term('myFavorites')}
                min-query-length=${this.minQueryLength}
                value=${ifDefined(this.folderId || undefined)}
                selected-label=${ifDefined(this.folderTitle || undefined)}
                .token=${this.token}
                .baseUrl=${this.baseUrl}
                .form=${this.closest('form')}
                .firstFetchCallback=${this.handleFirstFetchCallback}
                @cx-folder-select-search-term-change=${this.handleFolderSelectSearchTermChange}
              ></cx-folder-select>
            </cx-space>
          </div>
          ${when(
            this.showCollections && this.collectionPath,
            () => html`
              <div class="browser__collections">
                <cx-details>
                  <cx-typography slot="summary" variant="body3">${this.localize.term('collections')}</cx-typography>
                  <cx-folder-select-tree
                    min-query-length=${this.minQueryLength}
                    search-term=${this.searchTerm}
                    selected-value=${ifDefined(this.folderId || undefined)}
                    .api=${this.collectionApi}
                    .token=${this.token}
                    .baseUrl=${this.baseUrl}
                  >
                  </cx-folder-select-tree>
                </cx-details>
              </div>
            `,
          )}
        </cx-space>
      </cx-drawer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-browser': CxContentBrowserBrowser;
  }
}