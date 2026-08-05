import CxGrid from '@orangelogic/design-system/components/grid';
import CxGridItem from '@orangelogic/design-system/components/grid-item';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxMenu from '@orangelogic/design-system/components/menu';
import CxMenuItem from '@orangelogic/design-system/components/menu-item';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSpinner from '@orangelogic/design-system/components/spinner';
import CxTypography from '@orangelogic/design-system/components/typography';
import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { AssetVersion, MediaType } from '@/types/asset';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import { CSSResultGroup, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import CxContentBrowserAssetPreview from '../content-browser-asset-preview/content-browser-asset-preview';

import styles from './content-browser-asset-version-history.styles';

@customElement('cx-content-browser-asset-version-history')
export default class CxContentBrowserAssetVersionHistory extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-grid': CxGrid,
    'cx-grid-item': CxGridItem,
    'cx-line-clamp': CxLineClamp,
    'cx-menu': CxMenu,
    'cx-menu-item': CxMenuItem,
    'cx-space': CxSpace,
    'cx-spinner': CxSpinner,
    'cx-typography': CxTypography,
    'cx-content-browser-asset-preview': CxContentBrowserAssetPreview,
  };

  private readonly localize = new LocalizeController(this);

  @property({ reflect: false, type: Array })
  versions: AssetVersion[] = [];

  @property({ reflect: true, type: Boolean })
  loading: boolean = false;

  render() {
    return html`
      <div class="content-browser-asset-version-history">
        ${when(this.loading,
          () => html`<cx-spinner></cx-spinner>`,
          () => html`
            <cx-menu class="content-browser-asset-version-history__menu">
              ${repeat(
                this.versions,
                (item) => item.versionNumber,
                (item, index) => html`
                  <cx-menu-item class="content-browser-asset-version-history__menu-item" readonly>
                    <cx-grid columns="5" spacing="12px">
                      <cx-grid-item class="content-browser-asset-version-history__menu-item__grid-item" xs="2" sm="2">
                        <cx-space direction="horizontal" align-items="center" wrap="nowrap">
                          <div class="content-browser-asset-version-history__menu-item__number">
                            <cx-line-clamp lines="1">
                              ${item.versionNumberDisplay}
                            </cx-line-clamp>
                          </div>
                          <cx-content-browser-asset-preview
                            image-url=${item.versionFileUrl}
                            preview-url=${item.scrubUrl}
                            alt=${item.versionFileName}
                            doc-type=${when(item.scrubUrl,
                              () => MediaType.Video,
                              () => MediaType.Image,
                            )}
                          ></cx-content-browser-asset-preview>
                        </cx-space>
                      </cx-grid-item>
                      <cx-grid-item class="content-browser-asset-version-history__menu-item__grid-item" xs="2" sm="3">
                        <cx-space direction="vertical" spacing="2x-small">
                          <cx-line-clamp lines="1">
                            <cx-typography variant="body3" class="content-browser-asset-version-history__menu-item__name">${item.versionFileName}</cx-typography>
                          </cx-line-clamp>
                          <cx-line-clamp lines="1">
                            <cx-typography variant="body3">${item.createByEmail}</cx-typography>
                          </cx-line-clamp>
                          <cx-typography variant="body3">
                            ${item.versionCreateDate.split(' ')[0]}
                            ${when(
                              index === 0,
                              () => html`<span class="content-browser-asset-version-history__menu-item__latest">${this.localize.term('currentVersion')}</span>`,
                              () => nothing,
                            )}
                          </cx-typography>
                        </cx-space>
                      </cx-grid-item>
                    </cx-grid>
                  </cx-menu-item>
                `,
              )}
            </cx-menu>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-asset-version-history': CxContentBrowserAssetVersionHistory;
  }
}
