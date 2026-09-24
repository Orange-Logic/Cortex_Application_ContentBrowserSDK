import { expect, waitUntil } from '@open-wc/testing';

import http from '@/api/api';
import type CortexElement from '@/base/element';
import type { GetAssetsRequest } from '@/types/asset';

import sinon from 'sinon';

import { FetchAndMergeAssetsController } from './fetch-and-merge-assets';

describe('FetchAndMergeAssetsController', () => {
  const originalAdapter = http.defaults.adapter;
  let controller: FetchAndMergeAssetsController | undefined;
  let recordIdSeq = 0;

  afterEach(() => {
    sinon.restore();
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

  const createController = (options: Partial<ConstructorParameters<typeof FetchAndMergeAssetsController>[1]> = {}) => {
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
        ...options,
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

  it('keeps the requested folder on the first fetch instead of resetting it to the default', async () => {
    const searchBodies: Record<string, unknown>[] = [];

    http.defaults.adapter = async (config) => {
      if (config.method?.toLowerCase() === 'post') {
        searchBodies.push(typeof config.data === 'string' ? JSON.parse(config.data) : config.data);
      }

      return {
        config,
        data: { contentItems: [], facets: [], totalCount: 0 },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    // fetchAndMergeAssets debounces and does not return the pending fetch, so wait for the request.
    await createController().fetchAndMergeAssets({ folderId: 'library-id', pageSize: 40, start: 0 });
    await waitUntil(() => searchBodies.length > 0);

    expect(searchBodies).to.have.length(1);
    expect(searchBodies[0].ObjectRecordID).to.equal('library-id');
  });

  const firstFetchControls: GetAssetsRequest[] = [
    {},
    { isSeeThrough: false, searchText: '', selectedFacets: {}, sortDirection: '', sortOrderName: '' },
    { isSeeThrough: false, searchText: 'updated', selectedFacets: { category: ['new'] }, sortDirection: 'descending', sortOrderName: 'title' },
  ];

  for (const supplied of firstFetchControls) {
    it(`preserves supplied first-fetch controls and defaults only missing values: ${JSON.stringify(supplied)}`, async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      http.defaults.adapter = async (config) => ({
        config,
        data: { contentItems: [], facets: [], totalCount: 0 },
        headers: {},
        status: 200,
        statusText: 'OK',
      });
      const defaults = {
        isSeeThrough: true,
        searchText: 'default search',
        selectedFacets: { category: ['default'] },
        sortDirection: 'ascending',
        sortOrderName: 'title',
      };
      const current = createController({
        defaultIsSeeThrough: defaults.isSeeThrough,
        defaultSearchText: defaults.searchText,
        defaultSelectedFacets: defaults.selectedFacets,
        defaultSortDirection: 'ascending',
        defaultSortOrderName: defaults.sortOrderName,
      });
      // Avoid a metadata request so this test isolates the first asset request's defaults.
      (current as unknown as { sortOrders: Record<string, unknown[]> }).sortOrders = {
        title: [{ id: 'title-asc', sortDirection: 'ascending' }, { id: 'title-desc', sortDirection: 'descending' }],
      };
      await current.fetchAndMergeAssets({ pageSize: 40, start: 0, ...supplied });
      await clock.tickAsync(200);
      expect(current.getData().loading).to.equal(false);
      expect(current.getData().request).to.deep.include({ ...defaults, ...supplied });
    });
  }
});
