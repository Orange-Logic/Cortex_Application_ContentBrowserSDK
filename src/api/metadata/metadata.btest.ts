import { expect } from '@open-wc/testing';

import http from '@/api/api';
import { apiGetContentBrowserParameters } from './metadata';

describe('content browser site title fallback', () => {
  const originalAdapter = http.defaults.adapter;
  const originalBaseUrl = http.defaults.baseURL;
  let sequence = 0;

  const useFreshSite = () => {
    sequence += 1;
    http.defaults.baseURL = `https://metadata-default-${sequence}.example`;
  };

  afterEach(() => {
    http.defaults.adapter = originalAdapter;
    http.defaults.baseURL = originalBaseUrl;
  });

  for (const [raw, expected] of [
    ['originalFileName', 'originalFileName'],
    ['uniqueIdentifier', 'uniqueIdentifier'],
    [undefined, 'uniqueIdentifier'],
    ['invalid', 'uniqueIdentifier'],
  ] as const) {
    it(`reads ${raw} as ${expected} without unrelated parameters`, async () => {
      useFreshSite();
      http.defaults.adapter = async (config) => ({
        config, data: { TitleFallback: raw }, headers: {}, status: 200, statusText: 'OK',
      });
      const result = await apiGetContentBrowserParameters();
      expect((result as unknown as { titleFallback?: string }).titleFallback).to.equal(expected);
    });
  }

  it('uses the identifier when the parameter request fails', async () => {
    useFreshSite();
    http.defaults.adapter = async () => { throw new Error('offline'); };
    const result = await apiGetContentBrowserParameters();
    expect((result as unknown as { titleFallback?: string }).titleFallback).to.equal('uniqueIdentifier');
  });
});
