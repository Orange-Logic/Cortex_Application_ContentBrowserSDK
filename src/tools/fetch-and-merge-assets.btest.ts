import { expect, waitUntil } from '@open-wc/testing';
import { AxiosError } from 'axios';

import http from '@/api/api';
import type CortexElement from '@/base/element';
import type { GetAssetsRequest } from '@/types/asset';
import type { Facet } from '@/types/content-browser';

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

  // L-42BIA4: the format dialog shows a different message for a failed format request than for an empty
  // format list, so the failure must reach it.
  const stubContentAndProxies = ({ failProxies = false, proxiesData = {} }: { failProxies?: boolean; proxiesData?: unknown }) => {
    recordIdSeq += 1;
    const recordId = `Q0LDO00000189562${recordIdSeq}`;

    http.defaults.adapter = async (config) => {
      const isProxiesRequest = config.url?.includes('AvailableProxies');

      if (isProxiesRequest && failProxies) {
        throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config);
      }

      return {
        config,
        data: isProxiesRequest
          ? proxiesData
          : {
            contentItems: [{ recordID: recordId, fields: { 'CoreField.Identifier': 'ARC12345' } }],
            facets: [],
            totalCount: 1,
          },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    return recordId;
  };

  it('reports a failed format request', async () => {
    const recordId = stubContentAndProxies({ failProxies: true });

    const result = await createController().fetchAssetByID(recordId);

    expect(result?.proxiesFailed).to.equal(true);
    expect(result?.proxies.length).to.equal(0);
  });

  it('does not report an empty format list as a failure', async () => {
    const recordId = stubContentAndProxies({ proxiesData: { previewUrl: '', proxies: [] } });

    const result = await createController().fetchAssetByID(recordId);

    expect(result?.proxiesFailed).to.equal(false);
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

  for (const sortOrderName of ['unknown', 'empty', 'title']) {
    it(`completes a fetch with ${sortOrderName} sort order and an unavailable direction`, async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
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
      const current = createController();
      (current as unknown as { sortOrders: Record<string, unknown[]> }).sortOrders = {
        empty: [],
        title: [{ id: 'title-asc', sortDirection: 'ascending' }],
      };

      await current.fetchAndMergeAssets({ pageSize: 40, sortDirection: 'descending', sortOrderName, start: 0 });
      await clock.tickAsync(200);

      expect(searchBodies).to.have.length(1);
      expect(searchBodies[0].OrderBy).to.equal(sortOrderName === 'title' ? 'title-asc' : undefined);
      expect(current.getData().loading).to.equal(false);
      expect(current.getData().request?.sortDirection).to.equal(sortOrderName === 'title' ? 'ascending' : 'descending');
    });
  }

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

  describe('search errors (L-42BQUZ)', () => {
    type SearchBody = { Limit?: number; Start?: number; Text?: string };
    type SearchReply = { facets?: Facet[]; recordIds: string[]; totalCount: number } | 'network-error' | 'timeout';

    const typeFacet: Facet = {
      facetDetails: { displayName: 'Type', facetFieldName: 'Types' },
      values: [
        { count: 3, displayValue: 'Image', value: 'Image' },
        { count: 2, displayValue: 'Video', value: 'Video' },
      ],
    };

    // Each search POST takes the next reply. axios rejects with an AxiosError for a timeout or a lost connection.
    const scriptSearches = (replies: Array<SearchReply | Promise<SearchReply>>) => {
      const bodies: SearchBody[] = [];

      http.defaults.adapter = async (config) => {
        const index = bodies.push(JSON.parse(config.data) as SearchBody) - 1;
        const reply = await replies[index];

        if (reply === 'timeout') {
          throw new AxiosError('timeout of 15000ms exceeded', AxiosError.ECONNABORTED, config);
        }

        if (reply === 'network-error') {
          throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config);
        }

        return {
          config,
          data: {
            contentItems: reply.recordIds.map((recordId) => ({
              fields: { 'CoreField.Identifier': recordId, 'Document.RecordID': recordId },
              recordID: recordId,
            })),
            facets: reply.facets ?? [],
            totalCount: reply.totalCount,
          },
          headers: {},
          status: 200,
          statusText: 'OK',
        };
      };

      return bodies;
    };

    const createSearchController = () => {
      const current = createController();
      // A known sort order keeps the sort-order GET out of the scripted search replies.
      (current as unknown as { sortOrders: Record<string, unknown[]> }).sortOrders = {
        title: [{ id: 'title-asc', sortDirection: 'ascending' }],
      };

      return current;
    };

    const recordIdsOf = (current: FetchAndMergeAssetsController) => current.getData().items.map((item) => item.recordId);

    it('keeps the rows and the total when a next page gets an error', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      scriptSearches([{ recordIds: ['r1', 'r2'], totalCount: 5 }, 'network-error']);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, start: 2 });
      await clock.tickAsync(200);

      expect(recordIdsOf(current)).to.deep.equal(['r1', 'r2']);
      expect(current.getData().totalCount).to.equal(5);
      expect(current.getData().searchError).to.equal(true);
      expect(current.getData().loading).to.equal(false);
    });

    it('removes the rows of the previous search when a new search gets an error', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      scriptSearches([{ recordIds: ['r1'], totalCount: 1 }, 'timeout']);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'first', start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'second', start: 0 });
      await clock.tickAsync(200);

      expect(recordIdsOf(current)).to.deep.equal([]);
      expect(current.getData().totalCount).to.equal(0);
      expect(current.getData().searchError).to.equal(true);
    });

    it('keeps the facet values when a search gets an error', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      scriptSearches([{ facets: [typeFacet], recordIds: ['r1'], totalCount: 1 }, 'timeout']);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'first', start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'second', start: 0 });
      await clock.tickAsync(200);

      expect(current.getData().facets.map((facet) => facet.values.map((value) => value.value)))
        .to.deep.equal([['Image', 'Video']]);
    });

    it('reports a search with no hits as no error', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      scriptSearches([{ recordIds: [], totalCount: 0 }]);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, start: 0 });
      await clock.tickAsync(200);

      expect(recordIdsOf(current)).to.deep.equal([]);
      expect(current.getData().searchError).to.equal(false);
    });

    it('sends the request with the error again on a retry, and adds its rows', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const bodies = scriptSearches([
        { recordIds: ['r1', 'r2'], totalCount: 4 },
        'timeout',
        { recordIds: ['r3', 'r4'], totalCount: 4 },
      ]);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'cat', start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'cat', start: 2 });
      await clock.tickAsync(200);
      current.retrySearch();
      await clock.tickAsync(200);

      expect(bodies.length).to.equal(3);
      expect(bodies[2]).to.deep.include({ Limit: 2, Start: 2, Text: 'cat' });
      expect(recordIdsOf(current)).to.deep.equal(['r1', 'r2', 'r3', 'r4']);
      expect(current.getData().searchError).to.equal(false);
    });

    it('ignores the error of a search that a subsequent search replaced', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      let releaseFirst: (reply: SearchReply) => void = () => {};
      const first = new Promise<SearchReply>((resolve) => {
        releaseFirst = resolve;
      });
      scriptSearches([first, { recordIds: ['new-1'], totalCount: 1 }]);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'old', start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'new', start: 0 });
      await clock.tickAsync(200);
      releaseFirst('timeout');
      await clock.tickAsync(0);

      expect(recordIdsOf(current)).to.deep.equal(['new-1']);
      expect(current.getData().searchError).to.equal(false);
    });

    it('shows an error and stops loading when a search answers with a malformed facet', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      scriptSearches([{ facets: [{}] as unknown as Facet[], recordIds: ['r1'], totalCount: 1 }]);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, start: 0 });
      await clock.tickAsync(200);

      expect(current.getData().searchError).to.equal(true);
      expect(current.getData().loading).to.equal(false);
    });

    it('ignores the rows of a search that a subsequent search replaced, when the older one resolves last', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      let releaseFirst: (reply: SearchReply) => void = () => {};
      const first = new Promise<SearchReply>((resolve) => {
        releaseFirst = resolve;
      });
      scriptSearches([first, { recordIds: ['new-1'], totalCount: 1 }]);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'old', start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, searchText: 'new', start: 0 });
      await clock.tickAsync(200);
      releaseFirst({ recordIds: ['old-1', 'old-2'], totalCount: 2 });
      await clock.tickAsync(0);

      expect(recordIdsOf(current)).to.deep.equal(['new-1']);
      expect(current.getData().totalCount).to.equal(1);
    });

    it('reports the error of a next page when a subsequent page of the same list was sent after it', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      let releaseSecondPage: (reply: SearchReply) => void = () => {};
      const secondPage = new Promise<SearchReply>((resolve) => {
        releaseSecondPage = resolve;
      });
      scriptSearches([{ recordIds: ['r1', 'r2'], totalCount: 6 }, secondPage, { recordIds: ['r5', 'r6'], totalCount: 6 }]);
      const current = createSearchController();

      await current.fetchAndMergeAssets({ pageSize: 2, start: 0 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, start: 2 });
      await clock.tickAsync(200);
      await current.fetchAndMergeAssets({ pageSize: 2, start: 4 });
      await clock.tickAsync(200);
      releaseSecondPage('network-error');
      await clock.tickAsync(0);

      expect(current.getData().searchError).to.equal(true);
    });
  });

  describe('responses that arrive out of order (L-42BVFI)', () => {
    type Held = {
      body: { Limit?: number; Start?: number; Text?: string };
      fail: () => void;
      respond: () => void;
    };

    const HITS: Record<string, number> = { broad: 500, narrow: 7 };
    let held: Held[] = [];
    let heldSortOrders: Array<() => void> = [];

    const holdServer = () => {
      held = [];
      heldSortOrders = [];
      http.defaults.adapter = (config) => new Promise((resolve, reject) => {
        if (config.method?.toLowerCase() === 'get') {
          heldSortOrders.push(() => resolve({
            config,
            data: { sortOrders: [{ id: 'title-asc', name: 'title', sortDirection: 'ascending', sortDirectionGroupKey: 'title' }] },
            headers: {},
            status: 200,
            statusText: 'OK',
          }));

          return;
        }

        const body = JSON.parse(config.data as string) as Held['body'];
        const list = body.Text ?? '';
        const start = body.Start ?? 0;
        const rows = Math.max(0, Math.min(body.Limit ?? 0, (HITS[list] ?? 0) - start));

        held.push({
          body,
          fail: () => reject(new AxiosError('timeout', AxiosError.ECONNABORTED, config)),
          respond: () => resolve({
            config,
            data: {
              contentItems: Array.from({ length: rows }, (_, offset) => {
                const id = `${list}|${start + offset}`;

                return { fields: { 'CoreField.Identifier': id, 'Document.RecordID': id }, recordID: id };
              }),
              facets: [],
              totalCount: HITS[list] ?? 0,
            },
            headers: {},
            status: 200,
            statusText: 'OK',
          }),
        });
      });
    };

    const setup = ({ knowsSortOrders = true } = {}) => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const current = createController();

      holdServer();

      if (knowsSortOrders) {
        (current as unknown as { sortOrders: Record<string, unknown[]> }).sortOrders = {
          title: [{ id: 'title-asc', sortDirection: 'ascending' }],
        };
      }

      const send = async (request: GetAssetsRequest) => {
        await current.fetchAndMergeAssets({ pageSize: 40, sortDirection: 'ascending', sortOrderName: 'title', ...request });
        await clock.tickAsync(200);
      };
      const settle = () => clock.tickAsync(0);
      const shownLists = () => [...new Set(current.getData().items.map(({ id }) => String(id).split('|')[0]))];
      const sentTexts = () => held.map(({ body }) => `${body.Text}@${body.Start ?? 0}`);

      return { clock, current, send, sentTexts, settle, shownLists };
    };

    it('keeps the list of the last search when the response of an earlier search comes last', async () => {
      const { current, send, settle, shownLists } = setup();

      await send({ searchText: 'broad', start: 0 });
      await send({ searchText: 'narrow', start: 0 });
      held[1].respond();
      await settle();
      held[0].respond();
      await settle();

      expect(shownLists()).to.deep.equal(['narrow']);
      expect(current.getData().totalCount).to.equal(7);
      expect(current.getData().loading).to.equal(false);
    });

    it('does not send the request of an earlier list that waited for the sort orders', async () => {
      // http caches GETs by URL, so an earlier case may have cached the sort orders.
      await http.storage.clear?.();

      const { clock, current, send, sentTexts, settle } = setup({ knowsSortOrders: false });

      await send({ searchText: 'broad', start: 0 });
      await send({ searchText: 'narrow', start: 0 });
      await clock.tickAsync(50);

      // http shares one in-flight GET between both callbacks, so one answer lets both go on.
      expect(heldSortOrders).to.have.length(1);

      heldSortOrders[0]();
      await settle();

      expect(sentTexts()).to.deep.equal(['narrow@0']);
      expect(current.getData().request?.searchText).to.equal('narrow');
    });

    it('keeps the list when the request of an earlier search fails after the later search answered', async () => {
      const { current, send, settle, shownLists } = setup();

      await send({ searchText: 'broad', start: 0 });
      await send({ searchText: 'narrow', start: 0 });
      held[1].respond();
      await settle();
      held[0].fail();
      await settle();

      expect(shownLists()).to.deep.equal(['narrow']);
      expect(current.getData().totalCount).to.equal(7);
    });

    it('keeps loading on while the request of the newest list is in flight', async () => {
      const { current, send, settle } = setup();

      await send({ searchText: 'broad', start: 0 });
      await send({ searchText: 'narrow', start: 0 });
      held[0].respond();
      await settle();

      expect(current.getData().loading).to.equal(true);

      held[1].respond();
      await settle();

      expect(current.getData().loading).to.equal(false);
    });

    it('does not add a late scroll page of the previous list to the new list', async () => {
      const { current, send, settle, shownLists } = setup();

      await send({ searchText: 'broad', start: 0 });
      held[0].respond();
      await settle();
      await send({ pageSize: 20, searchText: 'broad', start: 40 });
      await send({ searchText: 'narrow', start: 0 });
      held[2].respond();
      await settle();
      held[1].respond();
      await settle();

      expect(shownLists()).to.deep.equal(['narrow']);
      expect(current.getData().items).to.have.length(7);
    });

    it('sends the restart when a scroll request comes inside its debounce', async () => {
      const { clock, current, send, sentTexts } = setup();

      await send({ searchText: 'broad', start: 0 });
      held[0].respond();
      await clock.tickAsync(0);
      await current.fetchAndMergeAssets({ pageSize: 40, searchText: 'narrow', start: 0 });
      await current.fetchAndMergeAssets({ pageSize: 20, searchText: 'narrow', start: 40 });
      await clock.tickAsync(200);

      expect(sentTexts()).to.deep.equal(['broad@0', 'narrow@0']);
    });

    it('asks for the page after the last accepted page and for one page at a time', async () => {
      const { current, send, settle } = setup();

      expect(current.getNextPage()).to.deep.equal({ lastPageSize: 0, start: 0 });

      await send({ searchText: 'broad', start: 0 });

      expect(current.getNextPage(), 'a request is in flight').to.equal(null);

      held[0].respond();
      await settle();

      expect(current.getNextPage()).to.deep.equal({ lastPageSize: 40, start: 40 });

      await send({ pageSize: 20, searchText: 'broad', start: 40 });
      held[1].respond();
      await settle();

      expect(current.getNextPage()).to.deep.equal({ lastPageSize: 20, start: 60 });
    });

    it('does not move the next page when a page of an older list lands', async () => {
      const { current, send, settle } = setup();

      await send({ searchText: 'broad', start: 0 });
      await send({ searchText: 'narrow', start: 0 });
      held[1].respond();
      await settle();
      held[0].respond();
      await settle();

      expect(current.getNextPage()).to.deep.equal({ lastPageSize: 40, start: 40 });
    });
  });
});
