import { expect } from '@open-wc/testing';

import http from '@/api/api';
import type CortexElement from '@/base/element';

import { FetchAndMergeAssetsController } from './fetch-and-merge-assets';

describe('FetchAndMergeAssetsController', () => {
  const originalAdapter = http.defaults.adapter;
  let controller: FetchAndMergeAssetsController | undefined;
  let recordIdSeq = 0;

  afterEach(() => {
    controller?.hostDisconnected();
    controller = undefined;
    http.defaults.adapter = originalAdapter;
  });

  // fetchAssetByID reaches Cortex through a GET, and http is wrapped in axios-cache-interceptor, which
  // caches GETs by URL. Reusing one record id across cases serves the first case's body to every later
  // one, so each case gets its own id.
  const stubContent = (fields: Record<string, string>) => {
    recordIdSeq += 1;
    const recordId = `Q0LDO00000189561${recordIdSeq}`;

    http.defaults.adapter = async (config) => ({
      config,
      data: {
        contentItems: [{ recordID: recordId, fields }],
        facets: [],
        totalCount: 1,
      },
      headers: {},
      status: 200,
      statusText: 'OK',
    });

    return recordId;
  };

  const createController = () => {
    controller = new FetchAndMergeAssetsController(
      { addController() {}, requestUpdate() {} } as unknown as CortexElement,
      {
        availableDocTypes: [],
        baseUrl: '',
        defaultFolderId: '',
        defaultIsSeeThrough: true,
        defaultSearchText: '',
        defaultSelectedFacets: {},
        defaultSortDirection: 'ascending',
        defaultSortOrderName: '',
        token: '',
        useSession: '',
      } as unknown as ConstructorParameters<typeof FetchAndMergeAssetsController>[1],
    );

    return controller;
  };

  // L-42B0OO: a grid click opens the format dialog through fetchAssetByID, and content-browser.btest.ts
  // stubs that method wholesale — so without this, the caption fallback could regress here unnoticed while
  // the apiGetAssets tests stayed green.
  it('falls back to the identifier when the title is blank', async () => {
    const recordId = stubContent({
      'CoreField.Identifier': 'ARC12345',
      'CoreField.OriginalFileName': '_MG_8632.jpg',
      'Document.Title': '',
    });

    const result = await createController().fetchAssetByID(recordId, { simplePick: true });

    expect(result?.asset.name).to.equal('ARC12345');
  });

  it('shows the title when it is set', async () => {
    const recordId = stubContent({
      'CoreField.Identifier': 'ARC12345',
      'CoreField.OriginalFileName': '_MG_8632.jpg',
      'Document.Title': 'Stained glass window',
    });

    const result = await createController().fetchAssetByID(recordId, { simplePick: true });

    expect(result?.asset.name).to.equal('Stained glass window');
  });

  it('never shows the original file name', async () => {
    const recordId = stubContent({
      'CoreField.Identifier': 'ARC12345',
      'CoreField.OriginalFileName': '_MG_8632.jpg',
    });

    const result = await createController().fetchAssetByID(recordId, { simplePick: true });

    expect(result?.asset.name).to.not.contain('_MG_8632');
  });
});
