import { expect } from '@open-wc/testing';

import http from '@/api/api';
import { AssetLinkFormatPart } from '@/types/content-browser';

import { apiGetContentBrowserParameters } from './metadata';

// The mapping itself is covered in metadata.utils.btest.ts; these cover the request around it.
describe('apiGetContentBrowserParameters', () => {
  const originalAdapter = http.defaults.adapter;

  afterEach(() => {
    http.defaults.adapter = originalAdapter;
  });

  it('maps the response', async () => {
    http.defaults.adapter = async (config) => ({
      config,
      data: { AssetLinkFormatParts: 'crop\r\nproxy', EnableATSInGetLink: 'True' },
      headers: {},
      status: 200,
      statusText: 'OK',
    });

    const response = await apiGetContentBrowserParameters();

    expect(response.ATSEnabled).to.equal(true);
    expect(response.parts).to.deep.equal([AssetLinkFormatPart.Crop, AssetLinkFormatPart.Proxy]);
  });

  it('falls back to the defaults when the request fails', async () => {
    http.defaults.adapter = async () => {
      throw new Error('Network Error');
    };

    const response = await apiGetContentBrowserParameters();

    expect(response).to.deep.equal({
      ATSEnabled: false,
      autoExtension: '.auto',
      collectionPath: '',
      cropModes: undefined,
      focusModes: undefined,
      parts: undefined,
      supportedExtensions: [],
      supportedRepresentativeSubtypes: [],
      titleFallback: 'uniqueIdentifier',
    });
  });
});

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
