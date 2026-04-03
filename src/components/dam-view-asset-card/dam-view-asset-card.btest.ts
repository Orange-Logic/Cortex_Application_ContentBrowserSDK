import './dam-view-asset-card';

import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import { MediaType } from '@/types/asset';
import { GridView } from '@/types/dam-view';

import type DamViewAssetCard from './dam-view-asset-card';

const PLACEHOLDER_TEXT = 'empty';
const THUMB = 'https://placehold.co/120x80';

function getCard(el: DamViewAssetCard) {
  return el.shadowRoot!.querySelector('cx-card')!;
}

function getPreview(el: DamViewAssetCard) {
  return el.shadowRoot!.querySelector('cx-dam-view-asset-preview')!;
}

describe('dam-view-asset-card', () => {
  let el: DamViewAssetCard;

  beforeEach(async () => {
    el = await fixture(html`<dam-view-asset-card></dam-view-asset-card>`);
  });

  describe('initial state', () => {
    it('is accessible with basic asset fields', async () => {
      el.assetName = 'Photo';
      el.imageUrl = THUMB;
      el.docType = MediaType.Image;
      await elementUpdated(el);
      await expect(el).to.be.accessible();
    });

    it('has default property values', () => {
      expect(el.shadowRoot).to.exist;
      expect(el.imageUrl).to.equal('');
      expect(el.assetId).to.equal('');
      expect(el.assetName).to.equal('');
      expect(el.view).to.equal(GridView.Medium);
      expect(el.selected).to.be.false;
      expect(el.showTags).to.be.false;
      expect(el.showTitle).to.be.false;
      expect(el.inColdStorage).to.be.false;
      expect(el.tags).to.deep.equal([]);
    });

    it('applies view and state classes on the card', () => {
      const card = getCard(el);
      expect(card.classList.contains('dam-view-asset-card')).to.be.true;
      expect(card.classList.contains('dam-view-asset-card--medium')).to.be.true;
      expect(card.classList.contains('dam-view-asset-card--selected')).to.be.false;
    });

    it('applies selected class on cx-card when selected is true', async () => {
      el.selected = true;
      await elementUpdated(el);
      const card = getCard(el);
      expect(card.classList.contains('dam-view-asset-card--selected')).to.be.true;
    });

    it('parses tags attribute as comma-separated string', async () => {
      el = await fixture(html`<dam-view-asset-card tags="a,b,c"></dam-view-asset-card>`);
      await elementUpdated(el);
      expect(el.tags).to.deep.equal(['a', 'b', 'c']);
    });

    it('parses tags property as space-separated string', async () => {
      el.tags = ['a', 'b', 'c'];
      await elementUpdated(el);
      expect(el.getAttribute('tags')).to.equal('a,b,c');
    });

    it('parses tags property as comma-separated string when tags is not an array', async () => {
      el.tags = 'a' as any;
      await elementUpdated(el);
      expect(el.getAttribute('tags')).to.equal('a');
    });
  });

  describe('dam-view-asset-preview integration', () => {
    beforeEach(async () => {
      el.imageUrl = THUMB;
      el.scrubUrl = 'https://example.com/scrub.mp4';
      el.assetName = 'Clip';
      el.docType = MediaType.Video;
      el.extension = '.mp4';
      await elementUpdated(el);
    });

    it('forwards media props to the preview', () => {
      const preview = getPreview(el);
      expect(preview).to.have.attribute('image-url', THUMB);
      expect(preview).to.have.attribute('scrub-url', 'https://example.com/scrub.mp4');
      expect(preview).to.have.attribute('alt', 'Clip');
      expect(preview).to.have.attribute('doc-type', MediaType.Video);
      expect(preview).to.have.attribute('extension', '.mp4');
    });

    it('sets thumbnail-only on small grid view', async () => {
      el.view = GridView.Small;
      await elementUpdated(el);
      expect(getPreview(el)).to.have.attribute('thumbnail-only');
    });

    it('marks the card disabled when in cold storage', async () => {
      el.inColdStorage = true;
      await elementUpdated(el);
      expect(getCard(el).classList.contains('dam-view-asset-card--disabled')).to.be.true;
      expect(getPreview(el)).to.have.attribute('in-cold-storage');
    });
  });

  describe('title row', () => {
    it('shows asset name when showTitle and assetName are set', async () => {
      el.showTitle = true;
      el.assetName = 'My file.pdf';
      await elementUpdated(el);
      const nameTypo = el.shadowRoot!.querySelector(
        '.dam-view-asset-card__name cx-typography',
      );
      expect(nameTypo?.textContent?.includes('My file.pdf')).to.be.true;
    });

    it('shows placeholder when showTitle is off', async () => {
      el.assetName = 'Hidden';
      await elementUpdated(el);
      const placeholder = el.shadowRoot!.querySelector('.dam-view-asset-card__placeholder');
      expect(placeholder?.textContent?.trim()).to.equal(PLACEHOLDER_TEXT);
    });

    it('shows placeholder when showTitle is on but name is empty', async () => {
      el.showTitle = true;
      el.assetName = '';
      await elementUpdated(el);
      const placeholder = el.shadowRoot!.querySelector('.dam-view-asset-card__placeholder');
      expect(placeholder?.textContent?.trim()).to.equal(PLACEHOLDER_TEXT);
    });
  });

  describe('selection', () => {
    it('adds selected class and shows checkbox when selected', async () => {
      el.selected = true;
      await elementUpdated(el);
      expect(getCard(el).classList.contains('dam-view-asset-card--selected')).to.be.true;
      const overlay = el.shadowRoot!.querySelector('.dam-view-asset-card__checkbox');
      expect(overlay).to.exist;
      expect(overlay?.querySelector('cx-checkbox[checked]')).to.exist;
    });
  });

  describe('tags', () => {
    it('renders up to five tags when showTags is true', async () => {
      el.showTags = true;
      el.tags = ['a', 'b', 'c', 'd', 'e', 'f'];
      await elementUpdated(el);
      const tags = el.shadowRoot!.querySelectorAll('.dam-view-asset-card__tags cx-tag');
      expect(tags.length).to.equal(5);
    });

    it('skips blank tag strings', async () => {
      el.showTags = true;
      el.tags = ['x', '   ', 'y'];
      await elementUpdated(el);
      const tags = el.shadowRoot!.querySelectorAll('.dam-view-asset-card__tags cx-tag');
      expect(tags.length).to.equal(2);
    });

    it('renders empty tag container when showTags and tags are empty', async () => {
      el.showTags = true;
      el.tags = [];
      await elementUpdated(el);
      const clamp = el.shadowRoot!.querySelector('.dam-view-asset-card__tags');
      expect(clamp).to.exist;
      expect(clamp?.querySelector('span')).to.exist;
    });
  });

  describe('size and dimensions row', () => {
    it('shows width x height when showDimensions and numeric dimensions are set', async () => {
      el.showDimensions = true;
      el.assetWidth = '1920';
      el.assetHeight = '1080';
      await elementUpdated(el);
      const text = el.shadowRoot!.textContent ?? '';
      expect(text.includes('1920')).to.be.true;
      expect(text.includes('1080')).to.be.true;
    });

    it('shows asset size when showSize is set', async () => {
      el.showSize = true;
      el.assetSize = '2.5 MB';
      await elementUpdated(el);
      expect(el.shadowRoot!.textContent?.includes('2.5 MB')).to.be.true;
    });

    it('shows placeholder when dimensions row is on but has nothing to show', async () => {
      el.showDimensions = true;
      el.assetWidth = '';
      el.assetHeight = '';
      el.showSize = false;
      await elementUpdated(el);
      const rows = el.shadowRoot!.querySelectorAll('.dam-view-asset-card__info');
      const lastInfo = rows[rows.length - 1];
      const placeholder = lastInfo?.querySelector('.dam-view-asset-card__placeholder');
      expect(placeholder?.textContent?.trim()).to.equal(PLACEHOLDER_TEXT);
    });
  });
});
