import { expect } from '@open-wc/testing';

import http from '@/api/api';

import { apiGetAssets, resolveAssetCaption } from './asset';

describe('asset caption', () => {
  const originalAdapter = http.defaults.adapter;

  afterEach(() => {
    http.defaults.adapter = originalAdapter;
  });

  describe('resolveAssetCaption', () => {
    it('shows the title when it is set', () => {
      expect(resolveAssetCaption({
        'Document.Title': 'Stained glass window',
        'CoreField.Identifier': 'ARC12345',
        'CoreField.OriginalFileName': '_MG_8632.jpg',
      })).to.equal('Stained glass window');
    });

    // L-42B0OO: the caption used to fall back to the original file name. A stock library's file names
    // carry model names and shoot details, and a host application cannot turn the caption off.
    it('falls back to the identifier when the title is blank', () => {
      expect(resolveAssetCaption({
        'Document.Title': '',
        'CoreField.Identifier': 'ARC12345',
        'CoreField.OriginalFileName': '_MG_8632.jpg',
      })).to.equal('ARC12345');
    });

    it('never shows the original file name', () => {
      expect(resolveAssetCaption({
        'CoreField.Identifier': 'ARC12345',
        'CoreField.OriginalFileName': '_MG_8632.jpg',
      })).to.not.contain('_MG_8632');
    });

    it('is empty when neither the title nor the identifier is set', () => {
      expect(resolveAssetCaption({
        'CoreField.OriginalFileName': '_MG_8632.jpg',
      })).to.equal('');
    });
  });

  describe('apiGetAssets', () => {
    const stubContent = (fields: Record<string, string>) => {
      const seen: { requestedFields: string[] } = { requestedFields: [] };

      http.defaults.adapter = async (config) => {
        seen.requestedFields = JSON.parse(config.data).Fields;

        return {
          config,
          data: {
            contentItems: [{ recordID: 'Q0LDO000001895618', fields }],
            facets: [],
            totalCount: 1,
          },
          headers: {},
          status: 200,
          statusText: 'OK',
        };
      };

      return seen;
    };

    it('maps the caption onto the asset name', async () => {
      stubContent({
        'Document.Title': '',
        'CoreField.Identifier': 'ARC12345',
        'CoreField.OriginalFileName': '_MG_8632.jpg',
      });

      const response = await apiGetAssets({} as Parameters<typeof apiGetAssets>[0]);

      expect(response.items[0].name).to.equal('ARC12345');
    });

    it('does not ask Cortex for the original file name', async () => {
      const seen = stubContent({ 'Document.Title': 'Stained glass window' });

      await apiGetAssets({} as Parameters<typeof apiGetAssets>[0]);

      expect(seen.requestedFields).to.contain('Document.Title');
      expect(seen.requestedFields).to.not.contain('CoreField.OriginalFileName');
    });
  });
});
