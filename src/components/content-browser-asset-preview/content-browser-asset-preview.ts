import { CSSResultGroup, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import CortexElement from '@/base/element';
import { MediaType } from '@/types/asset';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxSkeleton from '@orangelogic/design-system/components/skeleton';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import componentStyles from '@/styles/component.styles';
import CxContentBrowserAssetPreviewVideo from './content-browser-asset-preview-video/content-browser-asset-preview-video';
import styles from './content-browser-asset-preview.styles';

const GIF_EXTENSION = '.gif';

export function getMediaIcon(type?: MediaType | '') {
  switch (type) {
    case MediaType.Audio:
      return 'audio_file';
    case MediaType.Album:
      return 'album';
    case MediaType.Widget:
      return 'widgets';
    case MediaType.Multimedia:
      return 'perm_media';
    case MediaType.Story:
      return 'article';
    case MediaType.Video:
      return 'video_file';
    case MediaType.Image:
      return 'photo';
    default:
      return 'file';
  }
}

@customElement('content-browser-asset-preview')
export default class CxContentBrowserAssetPreview extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-content-browser-asset-preview-video': CxContentBrowserAssetPreviewVideo,
    'cx-icon': CxIcon,
    'cx-skeleton': CxSkeleton,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @property({ attribute: 'image-url', reflect: true, type: String })
  imageUrl: string = '';

  @property({ attribute: 'original-url', reflect: true, type: String })
  originalUrl: string = '';

  @property({ attribute: 'scrub-url', reflect: true, type: String })
  scrubUrl: string = '';

  @property({ attribute: 'alt', reflect: true, type: String })
  alt: string = '';

  @property({ attribute: 'doc-type', reflect: true, type: String })
  docType: MediaType | '' = '';

  @property({ attribute: 'extension', reflect: true, type: String })
  extension: string = '';

  @property({ attribute: 'in-cold-storage', reflect: true, type: Boolean })
  inColdStorage: boolean = false;

  @property({ attribute: 'thumbnail-only', reflect: true, type: Boolean })
  thumbnailOnly: boolean = false;

  @state()
  isError: boolean = false;

  @state()
  loaded: boolean = false;

  get isUrlFilled(): boolean {
    return typeof this.imageUrl === 'string' && this.imageUrl.length > 0;
  }

  private handleLoaded() {
    this.loaded = true;
  }

  private handleError() {
    this.isError = true;
  }

  private renderThumbnail() {
    if (this.inColdStorage) {
      return html`
        <div
          data-testid="content-browser-asset-preview__thumbnail--cold-storage"
          class=${classMap({
            'content-browser-asset-preview__thumbnail': true,
            'content-browser-asset-preview__thumbnail--other': true,
          })}>
          <cx-icon name="mode_cool" variant="filled"></cx-icon>
          <cx-typography data-testid="content-browser-asset-preview__thumbnail--cold-storage-text">
            ${this.localize.term('assetInColdStorage')}
          </cx-typography>
          <br />
          <cx-typography
            variant="small"
            data-testid="content-browser-asset-preview__thumbnail--cold-storage-text-small"
          >
            (${this.localize.term('noPreviewAvailable').toLowerCase()})
          </cx-typography>
        </div>
      `;
    }

    if (this.isError || !this.isUrlFilled) {
      return html`
        <div
          data-testid="content-browser-asset-preview__thumbnail--other"
          class=${classMap({
            'content-browser-asset-preview__thumbnail': true,
            'content-browser-asset-preview__thumbnail--other': true,
          })}
        >
          <cx-icon name=${getMediaIcon(this.docType)} variant="filled"></cx-icon>
          <cx-typography>${this.extension.toUpperCase() || this.docType}</cx-typography>
        </div>
      `;
    }

    if (this.docType === MediaType.Video) {
      return html`
        <cx-content-browser-asset-preview-video
          src=${this.scrubUrl}
          thumbnail-src=${this.imageUrl}
          ?loaded=${this.loaded}
          ?thumbnail-only=${this.thumbnailOnly}
          @cx-loaded=${this.handleLoaded}
          @cx-error=${this.handleError}
        ></cx-content-browser-asset-preview-video>
      `;
    }

    return html`
      <div
        data-testid="content-browser-asset-preview__representative-container"
        class=${classMap({
          'content-browser-asset-preview__representative-container': true,
          'content-browser-asset-preview__representative-container--animated': this.extension === GIF_EXTENSION && this.originalUrl && this.loaded,
        })}
      >
        <img
          class="content-browser-asset-preview__representative"
          src=${this.imageUrl}
          alt=${this.alt}
          @load=${this.handleLoaded}
          @error=${this.handleError}
        />
        ${when(
          this.extension === GIF_EXTENSION && this.originalUrl,
          () => html`
            <img
              class=${classMap({
                'content-browser-asset-preview__representative': true,
                'content-browser-asset-preview__representative--animated': true,
              })}
              src=${this.originalUrl}
              alt=${this.alt}
            />
          `,
          () => nothing,
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class=${classMap({
        'content-browser-asset-preview': true,
      })}
      >
        ${when(
          !this.loaded && !this.inColdStorage && this.docType !== '' && [MediaType.Image, MediaType.Video].includes(this.docType),
          () => html`
            <cx-skeleton
              slot="image"
              class="content-browser-asset-preview__skeleton"
            ></cx-skeleton>
          `,
        )}
        ${this.renderThumbnail()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-asset-preview': CxContentBrowserAssetPreview;
  }
}
