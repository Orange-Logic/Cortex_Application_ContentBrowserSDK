/* eslint-disable @typescript-eslint/dot-notation */
import './content-browser-asset-preview';

import { MediaType } from '@/types/asset';
import { elementUpdated, expect, fixture, html, waitUntil } from '@open-wc/testing';

import CxContentBrowserAssetPreviewVideo from './content-browser-asset-preview-video/content-browser-asset-preview-video';

import { getMediaIcon } from './content-browser-asset-preview';
import type CxContentBrowserAssetPreview from './content-browser-asset-preview';
describe('content-browser-asset-preview', () => {
  let el: CxContentBrowserAssetPreview;

  beforeEach(async () => {
    el = await fixture(html`<content-browser-asset-preview></content-browser-asset-preview>`);
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });
    it('has default values', () => {
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
      expect(el.imageUrl).to.be.empty;
      expect(el.originalUrl).to.be.empty;
      expect(el.scrubUrl).to.be.empty;
      expect(el.alt).to.be.empty;
      expect(el.docType).to.be.empty;
      expect(el.extension).to.be.empty;
      expect(el.inColdStorage).to.be.false;
      expect(el.thumbnailOnly).to.be.false;
      expect(el.isError).to.be.false;
      expect(el.loaded).to.be.false;
      expect(el.isUrlFilled).to.be.false;
    });
  });

  describe('when no imageUrl is set', () => {
    Object.values(MediaType).forEach((docType) => {
      it(`renders the thumbnail for ${docType}`, async () => {
        el.docType = docType;
        await elementUpdated(el);
        const thumbnail = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__thumbnail--other"]');
        expect(thumbnail).to.exist;
        expect(thumbnail).to.have.class('content-browser-asset-preview__thumbnail');
        expect(thumbnail).to.have.class('content-browser-asset-preview__thumbnail--other');
        const icon = thumbnail!.querySelector('cx-icon');
        expect(icon).to.exist;
        expect(icon!.getAttribute('name')).to.equal(getMediaIcon(docType));
        const text = thumbnail!.querySelector('cx-typography');
        expect(text).to.exist;
        expect(text?.textContent?.trim()).to.equal(docType);
      });
    });
  });

  describe('when imageUrl is set', () => {
    describe('when in cold storage', () => {
      it('renders the cold storage thumbnail', async () => {
        el.inColdStorage = true;
        await elementUpdated(el);
        const thumbnail = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__thumbnail--cold-storage"]');
        expect(thumbnail).to.have.class('content-browser-asset-preview__thumbnail');
        expect(thumbnail).to.have.class('content-browser-asset-preview__thumbnail--other');
        const text = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__thumbnail--cold-storage-text"]');
        expect(text?.textContent?.trim()).to.equal(el['localize'].term('assetInColdStorage'));
        const textSmall = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__thumbnail--cold-storage-text-small"]');
        expect(textSmall?.textContent?.trim()).to.equal(`(${el['localize'].term('noPreviewAvailable').toLowerCase()})`);
      });
    });

    describe('when doc type is video', () => {
      let video: CxContentBrowserAssetPreviewVideo | null;
      beforeEach(async () => {
        el.docType = MediaType.Video;
        el.imageUrl = 'https://placehold.co/600x400';
        await elementUpdated(el);
        video = el.shadowRoot!.querySelector('cx-content-browser-asset-preview-video');
      });

      it('renders the video thumbnail', async () => {
        expect(video).to.exist;
      });
      it('updates loaded state when video is loaded', async () => {
        video!.emit('cx-loaded');
        await elementUpdated(el);
        expect(el.loaded).to.be.true;
      });
      it('updates error state when video is errored', async () => {
        video!.emit('cx-error');
        await elementUpdated(el);
        expect(el.isError).to.be.true;
      });
    });

    describe('when doc type is image', () => {
      it('renders the image', async () => {
        el.docType = MediaType.Image;
        el.imageUrl = 'https://placehold.co/600x400';
        await elementUpdated(el);
        const container = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__representative-container"]');
        expect(container).to.exist;
        expect(container).to.have.class('content-browser-asset-preview__representative-container');
        const image = container!.querySelector('img');
        expect(image).to.exist;
        expect(image).to.have.class('content-browser-asset-preview__representative');
        expect(image).to.have.attribute('src', 'https://placehold.co/600x400');
        expect(image).to.have.attribute('alt', el.alt);
      });
      it('renders the animated image when extension is gif and originalUrl is set', async () => {
        el.extension = '.gif';
        el.docType = MediaType.Image;
        el.imageUrl = 'https://placehold.co/600x400';
        el.originalUrl = 'https://placehold.co/800x600';
        el.loaded = true;
        await elementUpdated(el);
        const container = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__representative-container"]');
        expect(container).to.exist;
        expect(container).to.have.class('content-browser-asset-preview__representative-container');
        expect(container).to.have.class('content-browser-asset-preview__representative-container--animated');
        const animatedImage = container!.querySelector('.content-browser-asset-preview__representative--animated');
        expect(animatedImage).to.exist;
        expect(animatedImage).to.have.attribute('src', 'https://placehold.co/800x600');
        expect(animatedImage).to.have.attribute('alt', el.alt);
      });
      it('updates loaded state when image is loaded', async () => {
        el.extension = '.gif';
        el.docType = MediaType.Image;
        el.imageUrl = 'https://placehold.co/600x400';
        el.originalUrl = 'https://placehold.co/800x600';
        el.loaded = true;
        await elementUpdated(el);
        const container = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__representative-container"]');
        expect(container).to.exist;
        expect(container).to.have.class('content-browser-asset-preview__representative-container');
        expect(container).to.have.class('content-browser-asset-preview__representative-container--animated');
        const animatedImage = container!.querySelector('.content-browser-asset-preview__representative--animated');
        expect(animatedImage).to.exist;
        expect(animatedImage).to.have.attribute('src', 'https://placehold.co/800x600');
        expect(animatedImage).to.have.attribute('alt', el.alt);
        waitUntil(() => el.loaded, 'loaded should be true');
      });
      it('updates error state when image is errored', async () => {
        el.extension = '.gif';
        el.docType = MediaType.Image;
        el.imageUrl = 'https://placehold.co/600x400';
        el.originalUrl = 'https://broken.co/800x600';
        el.loaded = true;
        await elementUpdated(el);
        const container = el.shadowRoot!.querySelector('[data-testid="content-browser-asset-preview__representative-container"]');
        expect(container).to.exist;
        expect(container).to.have.class('content-browser-asset-preview__representative-container');
        expect(container).to.have.class('content-browser-asset-preview__representative-container--animated');
        const animatedImage = container!.querySelector('.content-browser-asset-preview__representative--animated');
        expect(animatedImage).to.exist;
        expect(animatedImage).to.have.attribute('src', 'https://broken.co/800x600');
        expect(animatedImage).to.have.attribute('alt', el.alt);
        waitUntil(() => el.isError, 'isError should be true');
      });
    });
  });
});
