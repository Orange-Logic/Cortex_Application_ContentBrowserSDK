import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import '@/index';
import { store } from '@/store';
import {
  AUTH_FEATURE_ACCESS_KEY_KEY, AUTH_FEATURE_KEY, AUTH_FEATURE_SITE_URL_KEY,
  authSlice, initAuthInfoFromCache, logout, oAuth,
} from '@/store/auth/auth.slice';
import { refreshAccessToken } from '@/utils/api';

const SITE_URL = 'https://restore.example';
const OTHER_SITE_URL = 'https://other.example';
const STORED_KEY = 'stored-access-key';

/** Whether `promise` settles within `ms`. A refresh that waits on its own lock never does. */
const settlesWithin = (promise: Promise<unknown>, ms: number) =>
  Promise.race([
    promise.then(() => true, () => true),
    new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), ms);
    }),
  ]);

/**
 * The stored access key must survive every failure except the server declining it.
 * Before 42AX2G any transport error, non-JSON body or slow host storage read
 * destroyed a credential that was still valid, sending the user back to the
 * authorization screen.
 */
describe('session restore and token refresh preserve a valid access key', () => {
  let storage: {
    get: sinon.SinonStub;
    set: sinon.SinonStub;
    delete: sinon.SinonStub;
  };

  const storedValues = (key: string) => {
    if (key === AUTH_FEATURE_ACCESS_KEY_KEY) return STORED_KEY;
    if (key === AUTH_FEATURE_SITE_URL_KEY) return SITE_URL;
    return null;
  };

  beforeEach(() => {
    storage = {
      get: sinon.stub().callsFake(async (key: string) => storedValues(key)),
      set: sinon.stub(),
      delete: sinon.stub(),
    };
    window.OrangeDAMContentBrowser._customStorage =
      storage as unknown as typeof window.OrangeDAMContentBrowser._customStorage;
    store.dispatch(authSlice.actions.setSiteSession(undefined));
    store.dispatch(authSlice.actions.setUseHeaders(false));
  });

  afterEach(() => {
    window.OrangeDAMContentBrowser._customStorage = undefined;
    sinon.restore();
    store.dispatch(logout());
  });

  /** Whether the access key itself was cleared from host storage. */
  const accessKeyDiscarded = () =>
    storage.delete.getCalls().some((call) => call.args[0] === AUTH_FEATURE_ACCESS_KEY_KEY);

  /** Whether any request sent the stored access key to `siteUrl`. */
  const storedKeySentTo = (fetchStub: sinon.SinonStub, siteUrl: string) =>
    fetchStub.getCalls().some((call) =>
      String(call.args[0]).startsWith(siteUrl) && String(call.args[1]?.body ?? '').includes(STORED_KEY));

  describe('during silent session restore', () => {
    it('keeps the key when the token endpoint answers with a gateway error page', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response('<html><body>502 Bad Gateway</body></html>', {
          status: 502,
          headers: { 'Content-Type': 'text/html' },
        }),
      );

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(false);
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('unauthenticated');
    });

    it('keeps the key when the response is a 200 carrying a body that is not JSON', async () => {
      sinon.stub(window, 'fetch').resolves(new Response('not json at all', { status: 200 }));

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('keeps the key when the host storage read fails or exceeds its deadline', async () => {
      storage.get.callsFake(async (key: string) => {
        if (key === AUTH_FEATURE_ACCESS_KEY_KEY) {
          throw new Error('Timed out reading "auth_access_key_key" from Figma storage');
        }
        return storedValues(key);
      });
      const fetchStub = sinon.stub(window, 'fetch');

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(false);
      expect(fetchStub.called).to.equal(false);
    });

    it('settles and keeps the key when a proxy answers the token request with 401', async () => {
      sinon.stub(window, 'fetch').callsFake(async () => new Response('', { status: 401 }));

      expect(await settlesWithin(store.dispatch(initAuthInfoFromCache()), 2000)).to.equal(true);

      expect(accessKeyDiscarded()).to.equal(false);
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('unauthenticated');
    });

    it('discards the key only when the server answers and declines it', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: false }), { status: 200 }),
      );

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(true);
    });

    it('keeps the key when a well-formed response reports success but carries no token', async () => {
      // GabAuthorizationService sets Success before reading the token node, so this
      // shape reaches the client. It is an anomaly, not a verdict on the key.
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('authenticates and leaves the key in place when the server returns a token', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: true, accessToken: 'fresh-token' }), { status: 200 }),
      );

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(false);
      expect(store.getState()[AUTH_FEATURE_KEY].accessToken).to.equal('fresh-token');
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('authenticated');
    });

    it('reconnects on the next open after a transient failure', async () => {
      const fetchStub = sinon.stub(window, 'fetch');
      fetchStub.onFirstCall().resolves(new Response('', { status: 503 }));
      fetchStub.resolves(
        new Response(JSON.stringify({ success: true, accessToken: 'fresh-token' }), { status: 200 }),
      );

      await store.dispatch(initAuthInfoFromCache());
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('unauthenticated');

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(false);
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('authenticated');
      expect(store.getState()[AUTH_FEATURE_KEY].accessKey).to.equal(STORED_KEY);
    });
  });

  describe('during mid-session token refresh', () => {
    beforeEach(() => {
      store.dispatch(authSlice.actions.setSiteUrl(SITE_URL));
      store.dispatch(authSlice.actions.updateAuthTokens({
        accessKey: STORED_KEY,
        accessToken: 'expiring-token',
      }));
    });

    it('keeps the key when the refresh call fails in transit', async () => {
      sinon.stub(window, 'fetch').rejects(new TypeError('Failed to fetch'));

      expect(await refreshAccessToken()).to.equal(null);

      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('settles and keeps the key when a proxy answers the refresh call with 401', async () => {
      sinon.stub(window, 'fetch').callsFake(async () => new Response('', { status: 401 }));

      expect(await settlesWithin(refreshAccessToken(), 2000)).to.equal(true);

      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('discards the key when the refresh call is declined by the server', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: false }), { status: 200 }),
      );

      expect(await refreshAccessToken()).to.equal(null);

      expect(accessKeyDiscarded()).to.equal(true);
    });

    it('keeps the key when the refresh response reports success but carries no token', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      expect(await refreshAccessToken()).to.equal(null);

      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('reconnects with the stored key after an earlier refresh failed in transit', async () => {
      const fetchStub = sinon.stub(window, 'fetch');
      fetchStub.onFirstCall().rejects(new TypeError('Failed to fetch'));
      fetchStub.resolves(
        new Response(JSON.stringify({ success: true, accessToken: 'fresh-token' }), { status: 200 }),
      );

      expect(await refreshAccessToken()).to.equal(null);
      // The dropped session leaves no key in memory, so the next 401 has to read the
      // stored one back rather than read its absence as a logout.
      const recovered = await refreshAccessToken();

      expect(accessKeyDiscarded()).to.equal(false);
      expect(recovered).to.equal('fresh-token');
      expect(store.getState()[AUTH_FEATURE_KEY].accessKey).to.equal(STORED_KEY);
    });

    it('keeps the key when reading it back from host storage fails', async () => {
      sinon.stub(window, 'fetch').rejects(new TypeError('Failed to fetch'));
      expect(await refreshAccessToken()).to.equal(null);
      storage.get.callsFake(async (key: string) => {
        if (key === AUTH_FEATURE_ACCESS_KEY_KEY) {
          throw new Error('Timed out reading "auth_access_key_key" from Figma storage');
        }
        return storedValues(key);
      });

      expect(await refreshAccessToken()).to.equal(null);

      expect(accessKeyDiscarded()).to.equal(false);
    });
  });

  describe('the stored key reaches only the site it was stored for', () => {
    /** Declines the authorization flow, and answers any token request with a verdict. */
    const stubDeclinedAuthorization = () => sinon.stub(window, 'fetch').callsFake(async (input) => {
      const url = String(input);
      if (url.includes('requestauthorize')) {
        return new Response(JSON.stringify({ requestID: 'request-1' }), { status: 200 });
      }
      if (url.includes('getaccesskey')) {
        return new Response(JSON.stringify({ code: 'NotAuthorized', message: 'declined' }), { status: 200 });
      }
      return new Response(JSON.stringify({ success: false }), { status: 200 });
    });

    beforeEach(() => {
      sinon.stub(window, 'open');
    });

    it('is neither sent nor discarded by a refresh after another site declines authorization', async () => {
      const fetchStub = stubDeclinedAuthorization();
      await store.dispatch(oAuth({ siteUrl: OTHER_SITE_URL }));

      expect(await refreshAccessToken()).to.equal(null);

      expect(storedKeySentTo(fetchStub, OTHER_SITE_URL)).to.equal(false);
      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('is neither sent nor discarded by the next open after another site declines authorization', async () => {
      const fetchStub = stubDeclinedAuthorization();
      await store.dispatch(oAuth({ siteUrl: OTHER_SITE_URL }));

      await store.dispatch(initAuthInfoFromCache());

      expect(storedKeySentTo(fetchStub, OTHER_SITE_URL)).to.equal(false);
      expect(accessKeyDiscarded()).to.equal(false);
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('unauthenticated');
    });

    it('is not presented by a refresh in header mode', async () => {
      store.dispatch(authSlice.actions.setUseHeaders(true));
      store.dispatch(authSlice.actions.setSiteUrl(SITE_URL));
      const fetchStub = sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: false }), { status: 200 }),
      );

      expect(await refreshAccessToken()).to.equal(null);

      expect(fetchStub.called).to.equal(false);
      expect(accessKeyDiscarded()).to.equal(false);
    });

    it('is presented to its own site when the two URLs differ only by a trailing slash', async () => {
      store.dispatch(authSlice.actions.setSiteUrl(`${SITE_URL}/`));
      const fetchStub = sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: true, accessToken: 'fresh-token' }), { status: 200 }),
      );

      expect(await refreshAccessToken()).to.equal('fresh-token');

      expect(storedKeySentTo(fetchStub, SITE_URL)).to.equal(true);
    });
  });

  describe('during interactive authorization', () => {
    it('keeps a previously stored key when the authorization flow is declined', async () => {
      sinon.stub(window, 'open');
      const fetchStub = sinon.stub(window, 'fetch');
      fetchStub.onFirstCall().resolves(
        new Response(JSON.stringify({ requestID: 'request-1' }), { status: 200 }),
      );
      fetchStub.resolves(
        new Response(JSON.stringify({ code: 'NotAuthorized', message: 'declined' }), { status: 200 }),
      );

      await store.dispatch(oAuth({ siteUrl: SITE_URL }));

      expect(accessKeyDiscarded()).to.equal(false);
      expect(store.getState()[AUTH_FEATURE_KEY].status).to.equal('unauthenticated');
    });
  });
});
