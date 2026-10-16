import './content-browser-asset-version-history';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import type { AssetVersion } from '@/types/asset';
import { MediaType } from '@/types/asset';

import type CxContentBrowserAssetVersionHistory from './content-browser-asset-version-history';

function makeVersion(overrides: Partial<AssetVersion> = {}): AssetVersion {
  return {
    createByEmail: 'author@example.com',
    fileImportDate: '2024-01-01',
    scrubUrl: '',
    versionCreateDate: '2024-06-15 14:30:00',
    versionFileName: 'photo.jpg',
    versionFileUrl: 'https://placehold.co/80x60',
    versionId: 'ver-1',
    versionNumber: 1,
    versionNumberDisplay: 'V1',
    ...overrides,
  };
}

describe('content-browser-asset-version-history', () => {
  it('shows a spinner while loading', async () => {
    const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
      <cx-content-browser-asset-version-history ?loading=${true}></cx-content-browser-asset-version-history>
    `);
    expect(el.shadowRoot!.querySelector('cx-spinner')).to.exist;
    expect(el.shadowRoot!.querySelector('cx-menu')).to.be.null;
  });

  it('is accessible when not loading with one version', async () => {
    const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
      <cx-content-browser-asset-version-history
        .versions=${[makeVersion()]}
      ></cx-content-browser-asset-version-history>
    `);
    await elementUpdated(el);
    await expect(el).to.be.accessible();
  });

  it('renders an empty menu when there are no versions', async () => {
    const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
      <cx-content-browser-asset-version-history .versions=${[]}></cx-content-browser-asset-version-history>
    `);
    await elementUpdated(el);
    const menu = el.shadowRoot!.querySelector('cx-menu');
    expect(menu).to.exist;
    expect(menu!.querySelectorAll('cx-menu-item').length).to.equal(0);
  });

  describe('with versions', () => {
    it('renders each version as a readonly menu row with grid layout', async () => {
      const v1 = makeVersion({ versionNumber: 1, versionNumberDisplay: 'V1' });
      const v2 = makeVersion({
        createByEmail: 'other@example.com',
        versionCreateDate: '2024-07-01 09:00:00',
        versionFileName: 'other.png',
        versionId: 'ver-2',
        versionNumber: 2,
        versionNumberDisplay: 'V2',
      });
      const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
        <cx-content-browser-asset-version-history .versions=${[v1, v2]}></cx-content-browser-asset-version-history>
      `);
      await elementUpdated(el);
      const items = el.shadowRoot!.querySelectorAll(
        'cx-menu.content-browser-asset-version-history__menu cx-menu-item',
      );
      expect(items.length).to.equal(2);
      items.forEach((item) => {
        expect(item).to.have.attribute('readonly');
        expect(item.querySelector('cx-grid[columns="5"]')).to.exist;
      });
    });

    it('shows version label, file name, author email, and date prefix', async () => {
      const v = makeVersion({
        createByEmail: 'editor@example.com',
        versionCreateDate: '2025-03-20 18:45:30',
        versionFileName: 'report.pdf',
        versionNumberDisplay: '3.0',
      });
      const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
        <cx-content-browser-asset-version-history .versions=${[v]}></cx-content-browser-asset-version-history>
      `);
      await elementUpdated(el);
      const text = el.shadowRoot!.textContent ?? '';
      expect(text.includes('3.0')).to.be.true;
      expect(text.includes('report.pdf')).to.be.true;
      expect(text.includes('editor@example.com')).to.be.true;
      expect(text.includes('2025-03-20')).to.be.true;
    });

    it('marks only the first row as current version', async () => {
      const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
        <cx-content-browser-asset-version-history
          .versions=${[makeVersion({ versionNumber: 1 }), makeVersion({ versionId: 'v2', versionNumber: 2 })]}
        ></cx-content-browser-asset-version-history>
      `);
      await elementUpdated(el);
      const latest = el.shadowRoot!.querySelectorAll(
        '.content-browser-asset-version-history__menu-item__latest',
      );
      expect(latest.length).to.equal(1);
      expect(el.shadowRoot!.textContent?.includes('Current version')).to.be.true;
    });

    it('passes image preview props and Image doc type when scrubUrl is empty', async () => {
      const v = makeVersion({ scrubUrl: '' });
      const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
        <cx-content-browser-asset-version-history .versions=${[v]}></cx-content-browser-asset-version-history>
      `);
      await elementUpdated(el);
      const preview = el.shadowRoot!.querySelector('cx-content-browser-asset-preview');
      expect(preview).to.exist;
      expect(preview).to.have.attribute('image-url', v.versionFileUrl);
      expect(preview).to.have.attribute('alt', v.versionFileName);
      expect(preview).to.have.attribute('doc-type', MediaType.Image);
    });

    it('uses Video doc type when scrubUrl is set', async () => {
      const v = makeVersion({ scrubUrl: 'https://example.com/preview.mp4' });
      const el = await fixture<CxContentBrowserAssetVersionHistory>(html`
        <cx-content-browser-asset-version-history .versions=${[v]}></cx-content-browser-asset-version-history>
      `);
      await elementUpdated(el);
      const preview = el.shadowRoot!.querySelector('cx-content-browser-asset-preview');
      expect(preview).to.have.attribute('doc-type', MediaType.Video);
      expect(preview).to.have.attribute('preview-url', v.scrubUrl);
    });
  });
});
