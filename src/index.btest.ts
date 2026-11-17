import { expect, waitUntil } from '@open-wc/testing';
import type { InternalAxiosRequestConfig } from 'axios';

import http from '@/api/api';
import { AssetApiEndpoint, MetadataApiEndpoint } from '@/api/endpoints';
import type CxContentBrowser from '@/components/content-browser/content-browser';
import ContentBrowser from './index';

describe('public title fallback configuration', () => {
  const originalAdapter = http.defaults.adapter;
  const originalBaseUrl = http.defaults.baseURL;
  let container: HTMLDivElement;
  let requests: InternalAxiosRequestConfig[];

  beforeEach(async () => {
    await http.storage.clear?.();
    requests = [];
    container = document.createElement('div');
    container.id = 'public-title-fallback';
    document.body.append(container);
    http.defaults.adapter = async (config) => {
      requests.push(config);
      const url = config.url ?? '';
      let data: unknown = {};
      if (url.endsWith(MetadataApiEndpoint.GET_CONTENT_BROWSER_PARAMETERS)) {
        data = { TitleFallback: 'originalFileName' };
      } else if (url.endsWith(AssetApiEndpoint.GET_CONTENT_V3)) {
        data = { contentItems: [{ recordID: 'public-asset', fields: {
          'CoreField.Identifier': 'UID-PUBLIC',
          'CoreField.OriginalFileName': 'public-photo.jpg',
          'Document.Title': '',
        } }], facets: [], totalCount: 1 };
      }
      return { config, data, headers: {}, status: 200, statusText: 'OK' };
    };
  });

  afterEach(() => {
    ContentBrowser.close();
    container.remove();
    http.defaults.adapter = originalAdapter;
    http.defaults.baseURL = originalBaseUrl;
  });

  const assertPublicFallback = async (titleFallback: 'uniqueIdentifier' | undefined, expected: string) => {
    ContentBrowser.open({
      baseUrl: window.location.origin,
      containerId: container.id,
      loadExternalFonts: false,
      useSiteSession: true,
      ...(titleFallback === undefined ? {} : { titleFallback }),
    });
    await waitUntil(() => !!container.querySelector('cx-content-browser'));
    const browser = container.querySelector('cx-content-browser') as CxContentBrowser;
    await browser.updateComplete;
    expect(browser.titleFallback).to.equal(titleFallback);

    const result = await ContentBrowser.fetchAssets({ pageSize: 1 }) as unknown as { items: Array<{ name: string }> };
    expect(result?.items[0].name).to.equal(expected);
    const assetRequest = requests.find((request) => request.method === 'post' && request.url?.endsWith(AssetApiEndpoint.GET_CONTENT_V3))!;
    expect(JSON.parse(assetRequest.data).Fields.includes('CoreField.OriginalFileName')).to.equal(titleFallback === undefined);
  };

  for (const [titleFallback, expected] of [
    [undefined, 'public-photo.jpg'],
    ['uniqueIdentifier', 'UID-PUBLIC'],
  ] as const) {
    it(`uses ${expected} through open and the real component`, async () => {
      await assertPublicFallback(titleFallback, expected);
    });
  }
});
