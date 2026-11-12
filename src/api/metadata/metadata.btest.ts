import { expect } from '@open-wc/testing';

import http from '@/api/api';
import { AssetLinkFormatPart } from '@/types/content-browser';

import { apiGetContentBrowserParameters } from './metadata';

// The mapping itself is covered in metadata.utils.btest.ts; these cover the request around it.
describe('apiGetContentBrowserParameters', () => {
  const originalAdapter = http.defaults.adapter;

  beforeEach(async () => {
    // The GET is cached by URL, and every case here hits the same URL.
    await http.storage.clear?.();
  });

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
    });
  });
});
