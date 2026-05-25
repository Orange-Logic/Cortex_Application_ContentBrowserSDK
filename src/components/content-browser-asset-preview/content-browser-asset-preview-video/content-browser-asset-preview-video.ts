import CxIcon from '@orangelogic/design-system/components/icon';
import CxProgressBar from '@orangelogic/design-system/components/progress-bar';
import CxTypography from '@orangelogic/design-system/components/typography';
import CxVideo from '@orangelogic/design-system/components/video';
import CortexElement from '@/base/element';
import { Orientation } from '@/types/base';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

@customElement('cx-content-browser-asset-preview-video')
export default class CxContentBrowserAssetPreviewVideo extends CortexElement {
  static readonly dependencies = {
    'cx-icon': CxIcon,
    'cx-progress-bar': CxProgressBar,
    'cx-typography': CxTypography,
    'cx-video': CxVideo,
  };

  private readonly localize = new LocalizeController(this);

  @query('.content-browser-asset-preview__representative-overlay')
  contentOverlay: HTMLDivElement;

  @query('cx-video')
  videoElement?: CxVideo;

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

  @property({ reflect: true, type: Boolean })
  controls: boolean = false;

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
      this.videoElement.seek(0);
      this.videoElement.pause();
    }
  }

  private handleMouseMove(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.updateVideoProgress(event);
  }

  private updateVideoProgress(event: MouseEvent) {
    const width = this.contentOverlay.offsetWidth;
    if (
      this.videoElement?.duration &&
      width > 0 &&
      event.currentTarget === this.contentOverlay
    ) {
      const ratio = Math.min(1, Math.max(0, event.offsetX / width));
      this.progress = ratio * 100;
      this.videoElement.seek(ratio * this.videoElement.duration);
    }
  }

  render() {
    return html`
      <div
        class=${classMap({
          'content-browser-asset-preview__representative': true,
          [`content-browser-asset-preview__representative--${this.assetDirection}`]: true,
        })}
      >
        ${when(
          this.src && !this.thumbnailOnly,
          () => html`
            <cx-video
              src=${this.src}
              poster=${this.thumbnailSrc}
              disable-picture-in-picture
              disable-remote-playback
              height="100%"
              width="100%"
              ?show-controls=${this.controls}
              @cx-loaded-metadata=${this.handleLoaded}
              @cx-error=${this.handleError}
            ></cx-video>
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
        ${when(
          !this.controls,
          () => html`
            <div class="content-browser-asset-preview__video-icon">
              <cx-icon name="play_arrow" variant="filled"></cx-icon>
            </div>
          `,
        )}
      </div>
      ${when(Boolean(this.src) && !this.thumbnailOnly && !this.controls,
        () => html`
          <cx-progress-bar
            class="content-browser-asset-preview__progress-bar"
            value=${this.progress}
            max="100"
          ></cx-progress-bar>
          <div
            class="content-browser-asset-preview__representative-overlay"
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
    'cx-content-browser-asset-preview-video': CxContentBrowserAssetPreviewVideo;
  }
}
