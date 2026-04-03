import './dam-view-asset-preview-video';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import { Orientation } from '@/types';

import type CxDamViewAssetPreviewVideo from './dam-view-asset-preview-video';

const SAMPLE_VIDEO_SRC =
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_HORIZONTAL_THUMBNAIL_SRC = 'https://placehold.co/600x400';
const SAMPLE_VERTICAL_THUMBNAIL_SRC = 'https://placehold.co/400x600';

function dispatchMouseMoveWithOffset(overlay: HTMLElement, offsetX: number) {
  const event = new MouseEvent('mousemove', { bubbles: true });
  Object.defineProperty(event, 'offsetX', { configurable: true, enumerable: true, value: offsetX });
  overlay.dispatchEvent(event);
}

function dispatchMouseEnter(overlay: HTMLElement) {
  const event = new MouseEvent('mouseenter', { bubbles: true });
  overlay.dispatchEvent(event);
}

describe('dam-view-asset-preview-video', () => {
  let el: CxDamViewAssetPreviewVideo;

  beforeEach(async () => {
    el = await fixture(html`<cx-dam-view-asset-preview-video></cx-dam-view-asset-preview-video>`);
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });
    it('has default values', () => {
      expect(el).to.exist;
      expect(el.shadowRoot).to.be.null;
      expect(el.src).to.be.empty;
      expect(el.alt).to.be.empty;
      expect(el.thumbnailOnly).to.be.false;
      expect(el.thumbnailSrc).to.be.empty;
      expect(el.loaded).to.be.false;
      expect(el.assetDirection).to.equal(Orientation.Horizontal);
      expect(el.progress).to.equal(0);
    });
  });

  describe('when src is set and not thumbnail-only', () => {
    beforeEach(async () => {
      el.src = SAMPLE_VIDEO_SRC;
      el.thumbnailSrc = SAMPLE_HORIZONTAL_THUMBNAIL_SRC;
      await elementUpdated(el);
    });

    it('renders the video', () => {
      const video = el.querySelector('video');
      expect(video).to.exist;
      expect(video).to.have.attribute('src', SAMPLE_VIDEO_SRC);
      expect(video).to.have.attribute('poster', SAMPLE_HORIZONTAL_THUMBNAIL_SRC);
    });

    it('renders the progress bar', () => {
      expect(el.querySelector('cx-progress-bar')).to.exist;
    });

    it('does not render an img', () => {
      expect(el.querySelector('img')).to.be.null;
    });
  });

  describe('when thumbnail-only is true with src set', () => {
    beforeEach(async () => {
      el.src = SAMPLE_VIDEO_SRC;
      el.thumbnailSrc = SAMPLE_HORIZONTAL_THUMBNAIL_SRC;
      el.thumbnailOnly = true;
      await elementUpdated(el);
    });

    it('renders an img instead of video', () => {
      expect(el.querySelector('video')).to.be.null;
      const img = el.querySelector('img');
      expect(img).to.exist;
      expect(img).to.have.attribute('src', SAMPLE_HORIZONTAL_THUMBNAIL_SRC);
    });

    it('does not render the progress bar', () => {
      expect(el.querySelector('cx-progress-bar')).to.be.null;
    });
  });

  describe('cx-loaded and orientation', () => {
    it('emits cx-loaded and sets horizontal orientation from video metadata', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const video = el.querySelector('video')!;
      Object.defineProperty(video, 'videoWidth', { configurable: true, value: 1920 });
      Object.defineProperty(video, 'videoHeight', { configurable: true, value: 1080 });

      const loaded = oneEvent(el, 'cx-loaded');
      video.dispatchEvent(new Event('loadedmetadata'));
      await loaded;

      expect(el.assetDirection).to.equal(Orientation.Horizontal);
      const rep = el.querySelector('.dam-view-asset-preview__representative');
      expect(rep?.classList.contains('dam-view-asset-preview__representative--horizontal')).to.be.true;
    });

    it('emits cx-loaded and sets vertical orientation from video metadata', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const video = el.querySelector('video')!;
      Object.defineProperty(video, 'videoWidth', { configurable: true, value: 720 });
      Object.defineProperty(video, 'videoHeight', { configurable: true, value: 1280 });

      const loaded = oneEvent(el, 'cx-loaded');
      video.dispatchEvent(new Event('loadedmetadata'));
      await loaded;

      expect(el.assetDirection).to.equal(Orientation.Vertical);
      const rep = el.querySelector('.dam-view-asset-preview__representative');
      expect(rep?.classList.contains('dam-view-asset-preview__representative--vertical')).to.be.true;
    });

    it('emits cx-loaded and sets orientation from img load when thumbnail-only', async () => {
      el.thumbnailSrc = SAMPLE_HORIZONTAL_THUMBNAIL_SRC;
      el.thumbnailOnly = true;
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const img = el.querySelector('img')!;
      Object.defineProperty(img, 'naturalWidth', { configurable: true, value: 400 });
      Object.defineProperty(img, 'naturalHeight', { configurable: true, value: 800 });

      const loaded = oneEvent(el, 'cx-loaded');
      img.dispatchEvent(new Event('load'));
      await loaded;

      expect(el.assetDirection).to.equal(Orientation.Vertical);
    });

    it('emits cx-loaded and sets orientation from img load when thumbnail-only and vertical thumbnail', async () => {
      el.thumbnailSrc = SAMPLE_VERTICAL_THUMBNAIL_SRC;
      el.thumbnailOnly = true;
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const img = el.querySelector('img')!;
      Object.defineProperty(img, 'naturalWidth', { configurable: true, value: 400 });
      Object.defineProperty(img, 'naturalHeight', { configurable: true, value: 800 });

      const loaded = oneEvent(el, 'cx-loaded');
      img.dispatchEvent(new Event('load'));
      await loaded;

      expect(el.assetDirection).to.equal(Orientation.Vertical);
    });
  });

  describe('cx-error', () => {
    it('emits cx-error when the video fires error', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const video = el.querySelector('video')!;

      const err = oneEvent(el, 'cx-error');
      video.dispatchEvent(new Event('error'));
      await err;
    });

    it('emits cx-error when the img fires error', async () => {
      el.thumbnailSrc = SAMPLE_HORIZONTAL_THUMBNAIL_SRC;
      el.thumbnailOnly = true;
      await elementUpdated(el);
      const img = el.querySelector('img')!;

      const err = oneEvent(el, 'cx-error');
      img.dispatchEvent(new Event('error'));
      await err;
    });
  });

  describe('play icon visibility', () => {
    beforeEach(async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
    });

    it('hides the play icon when loaded is false', () => {
      const iconWrap = el.querySelector('.dam-view-asset-preview__video-icon');
      expect(iconWrap).to.exist;
      expect(iconWrap).to.have.attribute('hidden');
    });

    it('shows the play icon when loaded is true', async () => {
      el.loaded = true;
      await elementUpdated(el);
      const iconWrap = el.querySelector('.dam-view-asset-preview__video-icon');
      expect(iconWrap).to.exist;
      expect(iconWrap).not.to.have.attribute('hidden');
      const icon = iconWrap?.querySelector('cx-icon');
      expect(icon).to.exist;
      expect(icon?.getAttribute('name')).to.equal('play_arrow');
    });
  });

  describe('overlay scrubbing', () => {
    beforeEach(async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const video = el.querySelector('video')!;
      Object.defineProperty(video, 'duration', { configurable: true, value: 10 });
      Object.defineProperty(el.contentOverlay, 'offsetWidth', { configurable: true, value: 200 });
    });

    it('updates progress and currentTime on mouseenter', () => {
      const video = el.querySelector('video')!;
      dispatchMouseEnter(el.contentOverlay);
      expect(el.progress).to.not.equal(0);
      expect(video.currentTime).to.not.equal(0);
    });

    it('updates progress and currentTime on mousemove', () => {
      const video = el.querySelector('video')!;
      dispatchMouseMoveWithOffset(el.contentOverlay, 100);
      expect(el.progress).to.equal(50);
      expect(video.currentTime).to.equal(5);
    });

    it('resets progress and currentTime on mouseleave', async () => {
      const video = el.querySelector('video')!;
      dispatchMouseMoveWithOffset(el.contentOverlay, 100);
      expect(el.progress).to.equal(50);

      el.contentOverlay.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await elementUpdated(el);

      expect(el.progress).to.equal(0);
      expect(video.currentTime).to.equal(0);
    });
  });
});
