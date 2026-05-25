import './content-browser-asset-preview-video';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';

import { Orientation } from '@/types/base';

import type CxContentBrowserAssetPreviewVideo from './content-browser-asset-preview-video';

const SAMPLE_VIDEO_SRC =
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_HORIZONTAL_THUMBNAIL_SRC = 'https://placehold.co/600x400';
const SAMPLE_VERTICAL_THUMBNAIL_SRC = 'https://placehold.co/400x600';

function dispatchMouseMoveWithOffset(overlay: HTMLElement, offsetX: number) {
  const event = new MouseEvent('mousemove', { bubbles: true });
  Object.defineProperty(event, 'offsetX', { configurable: true, enumerable: true, value: offsetX });
  overlay.dispatchEvent(event);
}

function dispatchMouseEnter(overlay: HTMLElement, offsetX = 100) {
  const event = new MouseEvent('mouseenter', { bubbles: true });
  Object.defineProperty(event, 'offsetX', { configurable: true, enumerable: true, value: offsetX });
  overlay.dispatchEvent(event);
}

describe('content-browser-asset-preview-video', () => {
  let el: CxContentBrowserAssetPreviewVideo;

  beforeEach(async () => {
    el = await fixture(html`<cx-content-browser-asset-preview-video></cx-content-browser-asset-preview-video>`);
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
      const video = el.querySelector('cx-video');
      expect(video).to.exist;
      expect(video).to.have.attribute('src', SAMPLE_VIDEO_SRC);
      expect(video).to.have.attribute('poster', SAMPLE_HORIZONTAL_THUMBNAIL_SRC);
      expect(video).to.have.attribute('disable-picture-in-picture');
      expect(video).to.have.attribute('disable-remote-playback');
      expect(video).to.have.attribute('height', '100%');
      expect(video).to.have.attribute('width', '100%');
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
      expect(el.querySelector('cx-video')).to.be.null;
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
      const video = el.querySelector('cx-video')!;
      Object.defineProperty(video, 'videoWidth', { configurable: true, value: 1920 });
      Object.defineProperty(video, 'videoHeight', { configurable: true, value: 1080 });

      const loaded = oneEvent(el, 'cx-loaded');
      video.dispatchEvent(new CustomEvent('cx-loaded-metadata'));
      await loaded;

      expect(el.assetDirection).to.equal(Orientation.Horizontal);
      const rep = el.querySelector('.content-browser-asset-preview__representative');
      expect(rep?.classList.contains('content-browser-asset-preview__representative--horizontal')).to.be.true;
    });

    it('emits cx-loaded and sets vertical orientation from video metadata', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const video = el.querySelector('cx-video')!;
      Object.defineProperty(video, 'videoWidth', { configurable: true, value: 720 });
      Object.defineProperty(video, 'videoHeight', { configurable: true, value: 1280 });

      const loaded = oneEvent(el, 'cx-loaded');
      video.dispatchEvent(new CustomEvent('cx-loaded-metadata'));
      await loaded;

      expect(el.assetDirection).to.equal(Orientation.Vertical);
      const rep = el.querySelector('.content-browser-asset-preview__representative');
      expect(rep?.classList.contains('content-browser-asset-preview__representative--vertical')).to.be.true;
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
      const video = el.querySelector('cx-video')!;

      const err = oneEvent(el, 'cx-error');
      video.dispatchEvent(new CustomEvent('cx-error'));
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
    it('renders the play icon when using cx-video without controls', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      el.loaded = true;
      await elementUpdated(el);

      expect(el.querySelector('.content-browser-asset-preview__video-icon')).to.exist;
    });

    it('does not render the play icon when using cx-video with controls', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      el.controls = true;
      el.loaded = true;
      await elementUpdated(el);

      expect(el.querySelector('.content-browser-asset-preview__video-icon')).to.be.null;
    });

    it('renders the play icon for thumbnail-only before load', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      el.thumbnailSrc = SAMPLE_HORIZONTAL_THUMBNAIL_SRC;
      el.thumbnailOnly = true;
      await elementUpdated(el);

      expect(el.querySelector('.content-browser-asset-preview__video-icon')).to.exist;
    });

    it('renders the play icon for thumbnail-only when loaded', async () => {
      el.src = SAMPLE_VIDEO_SRC;
      el.thumbnailSrc = SAMPLE_HORIZONTAL_THUMBNAIL_SRC;
      el.thumbnailOnly = true;
      el.loaded = true;
      await elementUpdated(el);

      const iconWrap = el.querySelector('.content-browser-asset-preview__video-icon');
      expect(iconWrap).to.exist;
      const icon = iconWrap?.querySelector('cx-icon');
      expect(icon).to.exist;
      expect(icon?.getAttribute('name')).to.equal('play_arrow');
    });
  });

  describe('overlay scrubbing', () => {
    beforeEach(async () => {
      el.src = SAMPLE_VIDEO_SRC;
      await elementUpdated(el);
      const video = el.querySelector('cx-video')!;
      Object.defineProperty(video, 'duration', { configurable: true, value: 10 });
      Object.defineProperty(el.contentOverlay, 'offsetWidth', { configurable: true, value: 200 });
    });

    it('updates progress and seeks on mouseenter', () => {
      const video = el.querySelector('cx-video')!;
      const seek = sinon.spy(video, 'seek');
      dispatchMouseEnter(el.contentOverlay);
      expect(el.progress).to.not.equal(0);
      expect(seek).to.have.been.calledWith(5);
    });

    it('updates progress and seeks on mousemove', () => {
      const video = el.querySelector('cx-video')!;
      const seek = sinon.spy(video, 'seek');
      dispatchMouseMoveWithOffset(el.contentOverlay, 100);
      expect(el.progress).to.equal(50);
      expect(seek).to.have.been.calledWith(5);
    });

    it('resets progress and seeks to the start on mouseleave', async () => {
      const video = el.querySelector('cx-video')!;
      const seek = sinon.spy(video, 'seek');
      dispatchMouseMoveWithOffset(el.contentOverlay, 100);
      expect(el.progress).to.equal(50);

      el.contentOverlay.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await elementUpdated(el);

      expect(el.progress).to.equal(0);
      expect(seek).to.have.been.calledWith(0);
    });
  });
});
