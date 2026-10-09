import { expect } from '@open-wc/testing';
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

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

    // L-42BQUZ: axios rejects with these errors for a timeout, a lost connection and a non-2xx response.
    const transportErrors: Array<[string, (config: InternalAxiosRequestConfig) => AxiosError]> = [
      ['a timeout', (config) => new AxiosError('timeout of 15000ms exceeded', AxiosError.ECONNABORTED, config)],
      ['a network error', (config) => new AxiosError('Network Error', AxiosError.ERR_NETWORK, config)],
      ['an HTTP 500 response', (config) => new AxiosError(
        'Request failed with status code 500',
        AxiosError.ERR_BAD_RESPONSE,
        config,
        null,
        { config, data: '', headers: {}, status: 500, statusText: 'Internal Server Error' } as AxiosResponse,
      )],
    ];

    for (const [name, makeError] of transportErrors) {
      it(`reports ${name} as an error, not as a search with no hits`, async () => {
        http.defaults.adapter = async (config) => {
          throw makeError(config);
        };

        const response = await apiGetAssets({} as Parameters<typeof apiGetAssets>[0]);

        expect(response.isError).to.equal(true);
        expect(response.items.length).to.equal(0);
      });
    }

    // A proxy or a login page can answer with a 2xx HTML page, which axios keeps as a string.
    it('reports a 2xx response without a search body as an error', async () => {
      http.defaults.adapter = async (config) => ({
        config,
        data: '<html><body>Sign in</body></html>',
        headers: {},
        status: 200,
        statusText: 'OK',
      });

      const response = await apiGetAssets({} as Parameters<typeof apiGetAssets>[0]);

      expect(response.isError).to.equal(true);
      expect(response.facets.length).to.equal(0);
    });

    it('reports a 2xx response with no hits as a search with no hits, not an error', async () => {
      http.defaults.adapter = async (config) => ({
        config,
        data: { contentItems: [], facets: [], totalCount: 0 },
        headers: {},
        status: 200,
        statusText: 'OK',
      });

      const response = await apiGetAssets({} as Parameters<typeof apiGetAssets>[0]);

      expect(response.isError).to.equal(false);
      expect(response.totalCount).to.equal(0);
    });
  });
});
