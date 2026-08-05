import './content-browser-header';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type CxContentBrowserHeader from './content-browser-header';

const AVATAR_URL = 'https://placehold.co/40x40';
const USER_NAME = 'Test User';

describe('content-browser-header', () => {
  let el: CxContentBrowserHeader;

  beforeEach(async () => {
    el = await fixture(html`<cx-content-browser-header></cx-content-browser-header>`);
  });

  describe('initial state', () => {
    it('is accessible when folder title is set', async () => {
      const header = await fixture(
        html`<cx-content-browser-header folder-title="Assets"></cx-content-browser-header>`,
      );
      await expect(header).to.be.accessible();
    });

    it('has default property values', () => {
      expect(el.shadowRoot).to.exist;
      expect(el.bordered).to.be.false;
      expect(el.applicationName).to.equal('');
      expect(el.loading).to.be.false;
      expect(el.isFetching).to.be.false;
      expect(el.avatar).to.equal('');
      expect(el.fullName).to.equal('');
      expect(el.folderTitle).to.equal('');
      expect(el.showCloseButton).to.be.false;
      expect(el.canLogout).to.be.false;
    });

    it('renders a skeleton when user data is incomplete', () => {
      expect(el.shadowRoot!.querySelector('cx-skeleton')).to.exist;
      expect(el.shadowRoot!.querySelector('cx-avatar')).to.be.null;
    });
  });

  describe('title', () => {
    it('renders folderTitle in the heading typography', async () => {
      el.folderTitle = 'My DAM folder';
      await elementUpdated(el);
      const typography = el.shadowRoot!.querySelector('.header__title cx-typography');
      expect(typography?.textContent?.trim()).to.equal('My DAM folder');
    });
  });

  describe('bordered', () => {
    it('adds container--bordered when bordered is true', async () => {
      el.bordered = true;
      await elementUpdated(el);
      const container = el.shadowRoot!.querySelector('.container');
      expect(container?.classList.contains('container--bordered')).to.be.true;
    });
  });

  describe('isLoading', () => {
    it('returns true when loading or isFetching', () => {
      el.loading = true;
      expect(el.isLoading).to.be.true;
      el.loading = false;
      el.isFetching = true;
      expect(el.isLoading).to.be.true;
    });

    it('shows skeleton while loading even when avatar and name are set', async () => {
      el.avatar = AVATAR_URL;
      el.fullName = USER_NAME;
      el.loading = true;
      await elementUpdated(el);
      expect(el.shadowRoot!.querySelector('cx-skeleton')).to.exist;
      expect(el.shadowRoot!.querySelector('cx-dropdown')).to.be.null;
    });
  });

  describe('user area without logout', () => {
    beforeEach(async () => {
      el.avatar = AVATAR_URL;
      el.fullName = USER_NAME;
      el.canLogout = false;
      await elementUpdated(el);
    });

    it('renders a plain avatar and no user dropdown', () => {
      expect(el.shadowRoot!.querySelector('cx-skeleton')).to.be.null;
      expect(el.shadowRoot!.querySelector('cx-dropdown')).to.be.null;
      const avatar = el.shadowRoot!.querySelector('cx-avatar.header__user-avatar');
      expect(avatar).to.exist;
      expect(avatar).to.have.attribute('image', AVATAR_URL);
    });
  });

  describe('user area with logout', () => {
    beforeEach(async () => {
      el.avatar = AVATAR_URL;
      el.fullName = USER_NAME;
      el.canLogout = true;
      await elementUpdated(el);
    });

    it('renders dropdown with avatar trigger and logout menu item', () => {
      expect(el.shadowRoot!.querySelector('cx-dropdown')).to.exist;
      const logoutItem = el.shadowRoot!.querySelector('cx-menu-item[value="logout"]');
      expect(logoutItem).to.exist;
      expect(logoutItem?.querySelector('cx-icon[name="logout"]')).to.exist;
    });

    it('emits cx-content-browser-header-logout when logout is selected', async () => {
      const menu = el.shadowRoot!.querySelector('cx-menu');
      const logoutItem = el.shadowRoot!.querySelector('cx-menu-item[value="logout"]');
      expect(menu).to.exist;
      expect(logoutItem).to.exist;

      if (!(menu instanceof HTMLElement)) {
        expect.fail('menu missing');
      }

      const evtPromise = oneEvent(el, 'cx-content-browser-header-logout');
      menu.dispatchEvent(
        new CustomEvent('cx-select', {
          bubbles: true,
          composed: true,
          detail: { item: logoutItem },
        }),
      );
      await evtPromise;
    });

    it('does not emit logout for other menu selections', async () => {
      const menu = el.shadowRoot!.querySelector('cx-menu');
      const infoItem = el.shadowRoot!.querySelector('cx-menu-item.header__user-info');
      expect(menu).to.exist;
      expect(infoItem).to.exist;

      if (!(menu instanceof HTMLElement)) {
        expect.fail('menu missing');
      }

      let fired = false;
      el.addEventListener('cx-content-browser-header-logout', () => {
        fired = true;
      });
      menu.dispatchEvent(
        new CustomEvent('cx-select', {
          bubbles: true,
          composed: true,
          detail: { item: infoItem },
        }),
      );
      await elementUpdated(el);
      expect(fired).to.be.false;
    });
  });

  describe('close button', () => {
    beforeEach(async () => {
      el.showCloseButton = true;
      await elementUpdated(el);
    });

    it('renders close icon button when showCloseButton is true', () => {
      const btn = el.shadowRoot!.querySelector('cx-icon-button[name="close"]');
      expect(btn).to.exist;
    });

    it('emits cx-content-browser-header-close when close is clicked', async () => {
      const btn = el.shadowRoot!.querySelector('cx-icon-button[name="close"]');
      expect(btn).to.exist;

      if (!(btn instanceof HTMLElement)) {
        expect.fail('close button missing');
      }

      const evtPromise = oneEvent(el, 'cx-content-browser-header-close');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await evtPromise;
    });
  });

  describe('default slot', () => {
    it('projects slotted content', async () => {
      el = await fixture(html`
        <cx-content-browser-header>
          <div id="slotted">child</div>
        </cx-content-browser-header>
      `);
      await elementUpdated(el);
      expect(el.querySelector('#slotted')).to.exist;
      expect(el.querySelector('#slotted')?.textContent?.trim()).to.equal('child');
    });
  });
});
