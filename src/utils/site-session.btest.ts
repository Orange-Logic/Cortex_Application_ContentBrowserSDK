import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import { AxiosError } from 'axios';

import ContentBrowser from '@/index';
import http from '@/api/api';
import { apiGetFolders } from '@/api/folder';
import type CxContentBrowserBrowser from '@/components/content-browser-browser/content-browser-browser';
import type CxFolderSelect from '@orangelogic/design-system/components/folder-select';
import { AuthApiEndpoint } from '@/api/endpoints';
import CortexElement from '@/base/element';
import { store } from '@/store';
import { AUTH_FEATURE_KEY, authSlice, logout, oAuth } from '@/store/auth/auth.slice';
import type CxContentBrowser from '@/components/content-browser/content-browser';
import { FetchAndMergeAssetsController } from '@/tools/fetch-and-merge-assets';
import { cortexFetch, refreshAccessToken } from './api';

describe('site session authentication', () => {
  let controller: FetchAndMergeAssetsController | undefined;
  const originalAdapter = http.defaults.adapter;

  afterEach(() => {
    ContentBrowser.close();
    controller?.hostDisconnected();
    controller = undefined;
    http.defaults.adapter = originalAdapter;
    sinon.restore();
    store.dispatch(logout());
    document.getElementById('cortex-asset-picker-root')?.remove();
  });

  const openSiteSession = async (config = {}) => {
    await ContentBrowser.open({ ...config, useSiteSession: true } as Parameters<typeof ContentBrowser.open>[0]);
    ContentBrowser.close();
  };

  const createController = () => {
    controller = new FetchAndMergeAssetsController({ requestUpdate() {}, addController() {} } as unknown as CortexElement, {
      availableDocTypes: [], baseUrl: '', defaultFolderId: '', defaultIsSeeThrough: true,
      defaultSearchText: '', defaultSelectedFacets: {}, defaultSortDirection: 'ascending',
      defaultSortOrderName: '', token: 'stale-token', useSession: 'stale-preview', useSiteSession: true,
    } as ConstructorParameters<typeof FetchAndMergeAssetsController>[1]);
    return controller;
  };

  it('opens against the current page origin without restoring tokens or invoking the token callback', async () => {
    store.dispatch(authSlice.actions.updateAuthTokens({ accessKey: 'old-key', accessToken: 'old-token' }));
    const requestToken = sinon.stub().resolves('other-token');
    const storageGet = sinon.stub().resolves('cached-value');
    await openSiteSession({ onRequestToken: requestToken, customStorage: { get: storageGet, set() {}, delete() {} } });
    const auth = store.getState()[AUTH_FEATURE_KEY];
    expect(auth.siteUrl).to.equal(window.location.origin);
    expect(auth.accessToken).to.equal(undefined);
    expect(auth.accessKey).to.equal(undefined);
    expect(auth.status).to.equal('authenticated');
    expect(requestToken.called).to.equal(false);
    expect(storageGet.called).to.equal(false);
  });

  it('rejects a different origin before mounting the picker', async () => {
    let error: unknown;
    try { await openSiteSession({ baseUrl: 'https://other.example' }); } catch (caught) { error = caught; }
    expect(error).to.be.instanceOf(Error);
    expect(document.getElementById('cortex-asset-picker-root')).to.equal(null);
  });

  it('sends fetch requests with cookies and no token, preview session, or authorization', async () => {
    await openSiteSession({ baseUrl: `${window.location.origin}/cortex` });
    const fetchStub = sinon.stub(window, 'fetch').resolves(new Response('{}'));
    await cortexFetch('webapi/test?Token=stale&UseSession=stale', { headers: { Authorization: 'Bearer stale' } });
    const [url, options] = fetchStub.firstCall.args;
    expect(String(url)).to.equal(`${window.location.origin}/cortex/webapi/test`);
    expect(options?.credentials).to.equal('same-origin');
    expect(new Headers(options?.headers).has('Authorization')).to.equal(false);
  });

  it('does not refresh or log out the SDK when a site session returns 401', async () => {
    await openSiteSession();
    const fetchStub = sinon.stub(window, 'fetch').resolves(new Response('', { status: 401 }));
    expect((await cortexFetch('webapi/test')).status).to.equal(401);
    await refreshAccessToken();
    expect(fetchStub.callCount).to.equal(1);
    expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('authenticated');
  });

  it('ignores an old token refresh failure after switching to the site session', async () => {
    store.dispatch(authSlice.actions.setSiteSession(undefined));
    store.dispatch(authSlice.actions.setSiteUrl('https://previous.example'));
    store.dispatch(authSlice.actions.updateAuthTokens({ accessKey: 'old-key' }));
    let resolveRefresh!: (response: Response) => void;
    const refresh = new Promise<Response>((resolve) => { resolveRefresh = resolve; });
    const fetchStub = sinon.stub(window, 'fetch').returns(refresh);
    const pending = refreshAccessToken();
    await waitUntil(() => fetchStub.called);
    await openSiteSession();
    resolveRefresh(new Response('{}'));
    await pending;
    expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('authenticated');
    expect(store.getState()[AUTH_FEATURE_KEY].siteUrl).to.equal(window.location.origin);
  });

  it('returns to token authentication on a subsequent standard open', async () => {
    await openSiteSession();
    const requestToken = sinon.stub().resolves('new-key');
    await ContentBrowser.open({ baseUrl: 'https://token.example', onRequestToken: requestToken });
    ContentBrowser.close();
    await waitUntil(() => requestToken.called && store.getState()[AUTH_FEATURE_KEY].status === 'authenticated');
    expect(store.getState()[AUTH_FEATURE_KEY].siteUrl).to.equal('https://token.example');
    expect(store.getState()[AUTH_FEATURE_KEY].accessKey).to.equal('new-key');
    const fetchStub = sinon.stub(window, 'fetch').resolves(new Response('{}'));
    store.dispatch(authSlice.actions.setAccessToken('new-token'));
    await cortexFetch('webapi/test');
    expect(String(fetchStub.firstCall.args[0])).to.contain('Token=new-token');
  });

  it('ignores a pending token callback when switching to the site session', async () => {
    let resolveToken!: (value: string) => void;
    const token = new Promise<string>((resolve) => { resolveToken = resolve; });
    await ContentBrowser.open({ baseUrl: 'https://previous.example', onRequestToken: () => token });
    ContentBrowser.close();
    await openSiteSession();
    resolveToken('old-token');
    await token;
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(store.getState()[AUTH_FEATURE_KEY].siteUrl).to.equal(window.location.origin);
    expect(store.getState()[AUTH_FEATURE_KEY].accessKey).to.equal(undefined);
  });

  it('does not open a pending OAuth popup after switching to the site session', async () => {
    store.dispatch(authSlice.actions.setSiteSession(undefined));
    let resolveAuthorize!: (response: Response) => void;
    const authorize = new Promise<Response>((resolve) => { resolveAuthorize = resolve; });
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.onFirstCall().returns(authorize);
    fetchStub.resolves(new Response('{"code":"NotAuthorized"}'));
    const popup = sinon.stub(window, 'open');
    const pending = store.dispatch(oAuth({ siteUrl: 'https://previous.example' }));
    await openSiteSession();
    resolveAuthorize(new Response('{"requestID":"old-request"}'));
    await pending;
    expect(popup.called).to.equal(false);
    expect(fetchStub.callCount).to.equal(1);
    expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('authenticated');
  });

  it('shows a session error without a login form when embedded and unauthorized', async () => {
    http.defaults.adapter = async (config) => {
      throw new AxiosError('Unauthorized', '401', config, undefined, { data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config });
    };
    const container = document.createElement('div');
    container.id = 'site-session-test-container';
    document.body.appendChild(container);
    try {
      await ContentBrowser.open({ useSiteSession: true, containerId: container.id, loadExternalFonts: false } as Parameters<typeof ContentBrowser.open>[0]);
      await waitUntil(() => !!container.querySelector('cx-content-browser'), 'the picker should bypass authentication');
      const picker = container.querySelector<CxContentBrowser>('cx-content-browser')!;
      expect(picker.useSiteSession).to.equal(true);
      await waitUntil(() => !!picker.shadowRoot?.textContent?.includes('Your Cortex site session'), 'site session failure should be shown immediately', { timeout: 1500 });
      expect(picker.canLogout).to.equal(false);
      expect(container.querySelector('input')).to.equal(null);
      picker.showCloseButton = true;
      await picker.updateComplete;
      expect(picker.shadowRoot?.querySelector('cx-content-browser-header')?.hasAttribute('show-close-button')).to.equal(true);
    } finally {
      ContentBrowser.close();
      container.remove();
    }
  });

  it('sends Axios requests to the current origin without stale credentials', async () => {
    createController();
    const adapter = sinon.stub().callsFake(async (config) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));
    http.defaults.adapter = adapter;
    await http.get(`${AuthApiEndpoint.GET_USER_INFO}?Token=stale&UseSession=stale`, {
      cache: false, headers: { Authorization: 'Bearer stale' }, params: { Token: 'stale', UseSession: 'stale' },
    });
    const config = adapter.firstCall.args[0];
    expect(config.baseURL).to.equal(window.location.origin);
    expect(config.withCredentials).to.equal(true);
    expect(config.headers.has('Authorization')).to.equal(false);
    expect(config.params.Token).to.equal(undefined);
    expect(config.params.UseSession).to.equal(undefined);
    expect(config.url).not.to.contain('Token');
    expect(config.url).not.to.contain('UseSession');
  });

  it('routes the folder tree through the SDK cookie-aware transport', async () => {
    const browser = await fixture<CxContentBrowserBrowser>(html`<cx-content-browser-browser use-site-session></cx-content-browser-browser>`);
    const select = browser.shadowRoot!.querySelector<CxFolderSelect>('cx-folder-select')!;
    expect(select.api).to.equal(apiGetFolders);
  });

  it('reports Axios 401 immediately without requesting a token refresh', async () => {
    const activeController = createController();
    const unauthorized = sinon.spy();
    globalThis.addEventListener('cx-unauthorized', unauthorized);
    http.defaults.adapter = async (config) => {
      throw new AxiosError('Unauthorized', '401', config, undefined, { data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config });
    };
    try {
      await Promise.race([
        http.get(AuthApiEndpoint.GET_USER_INFO, { cache: false }).catch(() => 'unauthorized'),
        new Promise((resolve) => setTimeout(() => resolve('timed out'), 300)),
      ]).then((result) => expect(result).to.equal('unauthorized'));
      expect(activeController.getData().isLoggedIn).to.equal(false);
      expect(unauthorized.called).to.equal(false);
    } finally {
      globalThis.removeEventListener('cx-unauthorized', unauthorized);
    }
  });
});
