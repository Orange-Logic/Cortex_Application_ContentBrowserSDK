import { expect, waitUntil } from '@open-wc/testing';

import http from '@/api/api';
import { AuthApiEndpoint } from '@/api/endpoints';
import type CortexElement from '@/base/element';
import type { GetAssetsRequest } from '@/types/asset';

import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
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
        bearerToken: '',
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

  // L-42BXQB: Cortex only accepts the host's OAuth token as a Bearer header.
  describe('with a host-supplied bearer token', () => {
    const okResponse = (config: InternalAxiosRequestConfig) => ({
      config,
      data: {},
      headers: {},
      status: 200,
      statusText: 'OK',
    });

    it('sends it as an Authorization header', async () => {
      const requests: InternalAxiosRequestConfig[] = [];
      http.defaults.adapter = async (config) => {
        requests.push(config);
        return okResponse(config);
      };
      createController({ bearerToken: 'host-token' });

      await http.get(AuthApiEndpoint.GET_USER_INFO, { cache: false });

      expect(requests[0].headers.get('Authorization')).to.equal('Bearer host-token');
      expect(requests[0].params?.Token).to.equal(undefined);
    });

    it('keeps sending the Token parameter when the host gives no bearer token', async () => {
      const requests: InternalAxiosRequestConfig[] = [];
      http.defaults.adapter = async (config) => {
        requests.push(config);
        return okResponse(config);
      };
      createController({ token: 'cortex-token' });

      await http.get(AuthApiEndpoint.GET_USER_INFO, { cache: false });

      expect(requests[0].params?.Token).to.equal('cortex-token');
      expect(requests[0].headers.get('Authorization')).to.equal(undefined);
    });

    it('retries a 401 with the bearer token the host hands over next', async () => {
      const authorizations: unknown[] = [];
      http.defaults.adapter = async (config) => {
        const authorization = config.headers.get('Authorization');
        authorizations.push(authorization);
        if (authorization === 'Bearer expired-token') {
          throw new AxiosError('Unauthorized', AxiosError.ERR_BAD_REQUEST, config, null, {
            ...okResponse(config),
            status: 401,
            statusText: 'Unauthorized',
          });
        }
        return okResponse(config);
      };
      const current = createController({ bearerToken: 'expired-token' });
      // Answer asynchronously, as the SDK does.
      const handOverToken = () => queueMicrotask(() => current.updateAuth('', '', 'renewed-token'));
      globalThis.addEventListener('cx-unauthorized', handOverToken, { once: true });

      const response = await http.get(AuthApiEndpoint.GET_USER_INFO, { cache: false });

      expect(response.status).to.equal(200);
      expect(authorizations).to.deep.equal(['Bearer expired-token', 'Bearer renewed-token']);
    });

    it('does not send a bearer token set by a controller for another site', async () => {
      const requests: InternalAxiosRequestConfig[] = [];
      http.defaults.adapter = async (config) => {
        requests.push(config);
        return okResponse(config);
      };
      // Interceptors run in reverse order of registration, so the first controller picks the site.
      const tokenSite = createController({ baseUrl: 'https://token.example', token: 'cortex-token' });
      createController({ baseUrl: 'https://bearer.example', bearerToken: 'host-token' });

      try {
        await http.get(AuthApiEndpoint.GET_USER_INFO, { cache: false });
      } finally {
        tokenSite.hostDisconnected();
      }

      expect(requests[0].baseURL).to.equal('https://token.example');
      expect(requests[0].headers.get('Authorization')).to.equal(undefined);
    });
  });

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

  describe('unreadable fields (L-42BJ3T)', () => {
    /** One search response: the rows it carries, and the flag, which an older Cortex does not send. */
    type Page = { recordIds: string[]; unreadableFields?: string[] };

    /** Runs one search per start and records the hidden set after each response. */
    const fetchPages = async (starts: number[], pages: Page[]) => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const searches: Array<{ Fields: string[] }> = [];

      http.defaults.adapter = async (config) => {
        searches.push(JSON.parse(config.data));
        const { recordIds, unreadableFields } = pages[searches.length - 1];

        return {
          config,
          data: {
            contentItems: recordIds.map((recordId) => ({
              fields: { 'Custom.Date': '', 'Document.RecordID': recordId },
              recordID: recordId,
            })),
            facets: [],
            totalCount: 90,
            ...(unreadableFields === undefined ? {} : { unreadableFields }),
          },
          headers: {},
          status: 200,
          statusText: 'OK',
        };
      };

      const current = createController({ additionalFields: ['Custom.Date', 'Dell.Snippet'] });
      // Avoid a metadata request so that each request the adapter sees is a search.
      (current as unknown as { sortOrders: Record<string, unknown[]> }).sortOrders = { title: [] };

      const hiddenSets: string[][] = [];

      for (const start of starts) {
        await current.fetchAndMergeAssets({ pageSize: 30, start });
        await clock.tickAsync(200);
        hiddenSets.push(current.getData().unreadableFields);
      }

      return { current, hiddenSets, searches };
    };

    it('hides nothing for a Cortex build that sends no flag', async () => {
      const { hiddenSets } = await fetchPages([0], [{ recordIds: ['a'] }]);

      expect(hiddenSets).to.deep.equal([[]]);
    });

    it('takes the hidden set of a new list from its first page', async () => {
      const { hiddenSets } = await fetchPages([0], [{ recordIds: ['a'], unreadableFields: ['Custom.Date'] }]);

      expect(hiddenSets).to.deep.equal([['Custom.Date']]);
    });

    it('keeps a field hidden while each appended page flags it', async () => {
      const { current, hiddenSets } = await fetchPages([0, 30], [
        { recordIds: ['a'], unreadableFields: ['Custom.Date'] },
        { recordIds: ['b'], unreadableFields: ['custom.date'] },
      ]);

      expect(current.getData().items).to.have.lengthOf(2);
      expect(hiddenSets).to.deep.equal([['Custom.Date'], ['Custom.Date']]);
    });

    it('shows a field again when an appended page has a row that can read it', async () => {
      const { hiddenSets } = await fetchPages([0, 30], [
        { recordIds: ['a'], unreadableFields: ['Custom.Date'] },
        { recordIds: ['b'], unreadableFields: [] },
      ]);

      expect(hiddenSets).to.deep.equal([['Custom.Date'], []]);
    });

    it('does not show a field again for an appended page with no rows', async () => {
      const { hiddenSets } = await fetchPages([0, 30], [
        { recordIds: ['a'], unreadableFields: ['Custom.Date'] },
        { recordIds: [] },
      ]);

      expect(hiddenSets).to.deep.equal([['Custom.Date'], ['Custom.Date']]);
    });

    it('replaces the hidden set when a new list starts', async () => {
      const { hiddenSets } = await fetchPages([0, 0, 0], [
        { recordIds: ['a'], unreadableFields: ['Custom.Date'] },
        { recordIds: ['c'], unreadableFields: ['Dell.Snippet'] },
        { recordIds: ['d'] },
      ]);

      expect(hiddenSets).to.deep.equal([['Custom.Date'], ['Dell.Snippet'], []]);
    });

    it('keeps asking Cortex for a field it flagged', async () => {
      const { searches } = await fetchPages([0, 30], [
        { recordIds: ['a'], unreadableFields: ['Custom.Date'] },
        { recordIds: ['b'], unreadableFields: ['Custom.Date'] },
      ]);

      expect(searches.map((search) => search.Fields.filter((field) => field === 'Custom.Date'))).to.deep.equal([
        ['Custom.Date'],
        ['Custom.Date'],
      ]);
    });

    it('forgets the hidden set when the host disconnects', async () => {
      const { current } = await fetchPages([0], [{ recordIds: ['a'], unreadableFields: ['Custom.Date'] }]);

      current.hostDisconnected();

      expect(current.getData().unreadableFields).to.deep.equal([]);
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
