import CxIcon from '@orangelogic/design-system/components/icon';
import CxProgressBar from '@orangelogic/design-system/components/progress-bar';
import CxTypography from '@orangelogic/design-system/components/typography';
import CortexElement from '@/base/element';
import { Orientation } from '@/types/base';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

@customElement('cx-dam-view-asset-preview-video')
export default class CxDamViewAssetPreviewVideo extends CortexElement {
  static readonly dependencies = {
    'cx-icon': CxIcon,
    'cx-progress-bar': CxProgressBar,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @query('.dam-view-asset-preview__representative-overlay')
  contentOverlay: HTMLDivElement;

  @query('video')
  videoElement?: HTMLVideoElement;

  @query('img')
  imageElement?: HTMLImageElement;

  @property({ attribute: 'src', reflect: true, type: String })
  src: string = '';

  @property({ attribute: 'alt', reflect: true, type: String })
  alt: string = '';

  @property({ attribute: 'thumbnail-only', reflect: true, type: Boolean })
  thumbnailOnly: boolean = false;

  @property({ attribute: 'thumbnail-src', reflect: true, type: String })
  thumbnailSrc: string = '';

  @property({ attribute: 'loaded', reflect: true, type: Boolean })
  loaded: boolean = false;

  @state()
  assetDirection: Orientation = Orientation.Horizontal;

  @state()
  progress: number = 0;

  createRenderRoot() {
    return this;
  }

  private handleError() {
    this.emit('cx-error');
  }

  private handleLoaded() {
    if (this.videoElement && !this.thumbnailOnly) {
      const { videoHeight, videoWidth } = this.videoElement;
      this.assetDirection = videoWidth > videoHeight
        ? Orientation.Horizontal
        : Orientation.Vertical;
    }

    if (this.imageElement && this.thumbnailOnly) {
      const { naturalHeight, naturalWidth } = this.imageElement;
      this.assetDirection = naturalWidth > naturalHeight
        ? Orientation.Horizontal
        : Orientation.Vertical;
    }
    this.emit('cx-loaded');
  }

  private handleMouseEnter(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.updateVideoProgress(event);
  }

  private handleMouseLeave(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.progress = 0;

    if (this.videoElement) {
      this.videoElement.currentTime = 0;
      this.videoElement.pause();
    }
  }

  private handleMouseMove(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.updateVideoProgress(event);
  }

  private updateVideoProgress(event: MouseEvent) {
    if (this.videoElement?.duration && event.currentTarget === this.contentOverlay) {
      this.progress = (event.offsetX / this.contentOverlay.offsetWidth) * 100;
      this.videoElement.currentTime =
        (event.offsetX / this.contentOverlay.offsetWidth) * this.videoElement.duration;
    }
  }

  render() {
    return html`
      <div
        class=${classMap({
          'dam-view-asset-preview__representative': true,
          [`dam-view-asset-preview__representative--${this.assetDirection}`]: true,
        })}
      >
        ${when(
          this.src && !this.thumbnailOnly,
          () => html`
            <video
              src=${this.src}
              poster=${this.thumbnailSrc}
              @loadedmetadata=${this.handleLoaded}
              @error=${this.handleError}
            >
              <track default kind="captions" srcLang="en" />
            </video>
          `,
          () => html`
            <img
              src=${this.thumbnailSrc}
              alt=${this.localize.term('assetPreview')}
              @load=${this.handleLoaded}
              @error=${this.handleError}
            />
          `,
        )}
        <div class="dam-view-asset-preview__video-icon" ?hidden=${!this.loaded}>
          <cx-icon name="play_arrow" variant="filled"></cx-icon>
        </div>
      </div>
      ${when(Boolean(this.src) && !this.thumbnailOnly,
        () => html`
          <cx-progress-bar
            class="dam-view-asset-preview__progress-bar"
            value=${this.progress}
            max="100"
          ></cx-progress-bar>
          <div
            class="dam-view-asset-preview__representative-overlay"
            @mouseenter=${this.handleMouseEnter}
            @mouseleave=${this.handleMouseLeave}
            @mousemove=${this.handleMouseMove}
          >
          </div>
        `,
        () => nothing,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-dam-view-asset-preview-video': CxDamViewAssetPreviewVideo;
  }
}
