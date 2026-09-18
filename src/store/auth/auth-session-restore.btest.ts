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
const STORED_KEY = 'stored-access-key';

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

    it('discards the key only when the server answers and declines it', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: false }), { status: 200 }),
      );

      await store.dispatch(initAuthInfoFromCache());

      expect(accessKeyDiscarded()).to.equal(true);
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

    it('discards the key when the refresh call is declined by the server', async () => {
      sinon.stub(window, 'fetch').resolves(
        new Response(JSON.stringify({ success: false }), { status: 200 }),
      );

      expect(await refreshAccessToken()).to.equal(null);

      expect(accessKeyDiscarded()).to.equal(true);
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
