import { CSSResultGroup, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { MediaType } from '@/types/asset';
import { GridView } from '@/types/content-browser';
import CxArrayLineClamp from '@orangelogic/design-system/components/array-line-clamp';
import CxCard from '@orangelogic/design-system/components/card';
import CxCheckbox from '@orangelogic/design-system/components/checkbox';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxSpace from '@orangelogic/design-system/components/space';
import CxTag from '@orangelogic/design-system/components/tag';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement } from '@orangelogic/design-system/utils';

import CxContentBrowserAssetPreview from '../content-browser-asset-preview/content-browser-asset-preview';
import styles from './content-browser-asset-card.styles';

@customElement('cx-content-browser-asset-card')
export default class CxContentBrowserAssetCard extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];
  
  static readonly dependencies = {
    'cx-array-line-clamp': CxArrayLineClamp,
    'cx-card': CxCard,
    'cx-checkbox': CxCheckbox,
    'cx-content-browser-asset-preview': CxContentBrowserAssetPreview,
    'cx-line-clamp': CxLineClamp,
    'cx-space': CxSpace,
    'cx-tag': CxTag,
    'cx-typography': CxTypography,
  };

  @property({ attribute: 'image-url', reflect: true, type: String })
  imageUrl: string = '';

  @property({ attribute: 'original-url', reflect: true, type: String })
  originalUrl: string = '';

  @property({ attribute: 'scrub-url', reflect: true, type: String })
  scrubUrl: string = '';

  @property({ attribute: 'asset-id', reflect: true, type: String })
  assetId: string = '';

  @property({ attribute: 'asset-name', reflect: true, type: String })
  assetName: string = '';

  @property({ attribute: 'asset-width', reflect: true, type: String })
  assetWidth: string = '';

  @property({ attribute: 'asset-height', reflect: true, type: String })
  assetHeight: string = '';

  @property({ attribute: 'asset-size', reflect: true, type: String })
  assetSize: string = '';

  @property({ attribute: 'extension', reflect: true, type: String })
  extension: string = '';

  @property({ attribute: 'in-cold-storage', reflect: true, type: Boolean })
  inColdStorage: boolean = false;

  @property({ attribute: 'doc-type', reflect: true, type: String })
  docType: MediaType | '' = '';

  @property({ attribute: 'view', reflect: true, type: String })
  view: GridView = GridView.Medium;

  @property({ attribute: 'selected', reflect: true, type: Boolean })
  selected: boolean = false;

  @property({
    converter: {
      fromAttribute: (value: string | null) =>
        value ? value.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      toAttribute: (value: string[]) => {
        if (!Array.isArray(value)) {
          return value;
        }

        return value.join(',');
      },
    },
    reflect: true,
    type: String,
  })
  tags: string[] = [];

  @property({ attribute: 'show-tags', reflect: true, type: Boolean })
  showTags: boolean = false;

  @property({ attribute: 'show-title', reflect: true, type: Boolean })
  showTitle: boolean = false;

  @property({ attribute: 'show-size', reflect: true, type: Boolean })
  showSize: boolean = false;

  @property({ attribute: 'show-dimensions', reflect: true, type: Boolean })
  showDimensions: boolean = false;

  render() {
    return html`
      <cx-card
        class=${classMap({
          'content-browser-asset-card': true,
          [`content-browser-asset-card--${this.view}`]: true,
          'content-browser-asset-card--disabled': this.inColdStorage,
          'content-browser-asset-card--selected': this.selected,
        })}
        interactive
      >
        <cx-content-browser-asset-preview
          slot="image"
          image-url=${this.imageUrl}
          original-url=${this.originalUrl}
          preview-url=${this.scrubUrl}
          alt=${this.assetName}
          doc-type=${this.docType}
          extension=${this.extension}
          ?thumbnail-only=${this.view === 'small'}
          ?in-cold-storage=${this.inColdStorage}
        ></cx-content-browser-asset-preview>
        <cx-space spacing="small" align-items="center" wrap="nowrap" class="content-browser-asset-card__info">
          ${when(
            this.showTitle && this.assetName,
            () => html`
              <cx-line-clamp lines="1" class="content-browser-asset-card__name">
                <cx-typography variant="h6">
                  ${this.assetName}
                </cx-typography>
              </cx-line-clamp>
            `,
            () => html`
              <cx-typography variant="small" class="content-browser-asset-card__placeholder">
                <span>empty</span>
              </cx-typography>
            `,
          )}
        </cx-space>
        ${when(
          this.selected,
          () => html`
            <div slot="image" class="content-browser-asset-card__checkbox">
              <cx-checkbox checked></cx-checkbox>
            </div>
          `,
          () => nothing,
        )}
        ${when(
          this.showTags && this.tags?.length > 0,
          () => html`
            <cx-array-line-clamp
              class="content-browser-asset-card__tags"
              separator=" "
              tooltip-separator=", "
            >
              ${repeat(
                this.tags.filter((tag) => tag.trim() !== '').slice(0, 5),
                (tag) => tag,
                (tag) => html`
                  <cx-tag
                    size="small"
                    variant="neutral"
                    pill
                  >
                    <cx-line-clamp lines="1">${tag}</cx-line-clamp>
                  </cx-tag>
                `,
              )}
            </cx-array-line-clamp>
          `,
          () => nothing,
        )}
        ${when(
          this.showDimensions || this.showSize,
          () => html`
            <cx-space spacing="small" align-items="center" wrap="nowrap" class="content-browser-asset-card__info">
              ${when(
                this.showDimensions &&
                  Boolean(Number(this.assetWidth)) &&
                  Boolean(Number(this.assetHeight)),
                () => html`
                  <cx-line-clamp lines="1" class="content-browser-asset-card__name">
                    <cx-typography variant="small">
                      <span>${this.assetWidth}</span> x <span>${this.assetHeight}</span>
                    </cx-typography>
                  </cx-line-clamp>
                `,
              )}
              ${when(
                this.showSize,
                () => html`
                  <cx-line-clamp
                    lines="1"
                    class=${classMap({
                      'content-browser-asset-card__name': true,
                      'content-browser-asset-card__name--right': true,
                    })}
                  >
                    <cx-typography variant="small">
                      ${this.assetSize}
                    </cx-typography>
                  </cx-line-clamp>
                `,
              )}
              ${when(
                !(
                  (this.showDimensions &&
                    Boolean(Number(this.assetWidth)) &&
                    Boolean(Number(this.assetHeight))) ||
                  this.showSize
                ),
                () => html`
                  <cx-typography variant="small" class="content-browser-asset-card__placeholder">
                    <span>empty</span>
                  </cx-typography>
                `,
              )}
            </cx-space>
          `,
          () => nothing,
        )}
        ${when(
          this.showTags && this.tags?.length === 0,
          () => html`
            <cx-array-line-clamp
              class="content-browser-asset-card__tags"
              separator=" "
              tooltip-separator=", "
            >
              <span></span>
            </cx-array-line-clamp>
          `,
          () => nothing,
        )}
      </cx-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-asset-card': CxContentBrowserAssetCard;
  }
}
