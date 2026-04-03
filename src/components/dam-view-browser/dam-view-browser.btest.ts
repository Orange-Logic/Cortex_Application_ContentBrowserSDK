import './dam-view-browser';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import type CxIconButton from '@/atoms/icon-button';
import type CxFolderSelect from '@/molecules/folder-select';
import type { Folder, GetFolderRequest } from '@/types/folder-select';

import sinon from 'sinon';

import type CxDamViewBrowser from './dam-view-browser';

function makeFolder(overrides: Partial<Folder> = {}): Folder {
  return {
    docType: 'folder',
    fullPath: '/',
    hasChildren: false,
    id: 'folder-1',
    title: 'Library',
    ...overrides,
  };
}

function getDrawer(el: CxDamViewBrowser) {
  return el.shadowRoot!.querySelector('cx-drawer')!;
}

function getFolderSelect(el: CxDamViewBrowser) {
  return el.shadowRoot!.querySelector('cx-folder-select') as unknown as CxFolderSelect;
}

function getTriggerSlot(el: CxDamViewBrowser) {
  return el.shadowRoot!.querySelector('slot[name="trigger"]') as HTMLSlotElement;
}

describe('dam-view-browser', () => {
  let el: CxDamViewBrowser;

  beforeEach(async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders a trigger slot and folder drawer', () => {
    expect(getTriggerSlot(el)).to.exist;
    expect(getDrawer(el)).to.exist;
    expect(getFolderSelect(el)).to.exist;
  });

  it('passes folder id, title, and min query length to folder select', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser folder-id="fid-1" folder-title="My folder" min-query-length="3">
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    const fs = getFolderSelect(el);
    expect(fs.getAttribute('value')).to.equal('fid-1');
    expect(fs.getAttribute('selected-label')).to.equal('My folder');
    expect(fs.getAttribute('min-query-length')).to.equal('3');
  });

  it('sets extra folder id when show favorite folder and id are set', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser favorite-folder-id="fav-99" ?show-favorite-folder=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    expect(getFolderSelect(el).getAttribute('extra-folder-id')).to.equal('fav-99');
  });

  it('toggles the drawer open when the trigger is clicked', async () => {
    const drawer = getDrawer(el) as HTMLElement & { open: boolean };
    const btn = getTriggerSlot(el).assignedElements()[0] as HTMLButtonElement;

    expect(drawer.open).to.be.false;
    btn.click();
    await elementUpdated(el);
    expect(drawer.open).to.be.true;
    btn.click();
    await elementUpdated(el);
    expect(drawer.open).to.be.false;
  });

  it('opens the drawer when Enter is pressed on the focused trigger', async () => {
    const drawer = getDrawer(el) as HTMLElement & { open: boolean };
    const btn = getTriggerSlot(el).assignedElements()[0] as HTMLButtonElement;

    btn.focus();
    expect(drawer.open).to.be.false;
    await sendKeys({ press: 'Enter' });
    await elementUpdated(el);
    expect(drawer.open).to.be.true;
  });

  it('opens the drawer when Space is pressed on the focused trigger', async () => {
    const drawer = getDrawer(el) as HTMLElement & { open: boolean };
    const btn = getTriggerSlot(el).assignedElements()[0] as HTMLButtonElement;

    btn.focus();
    expect(drawer.open).to.be.false;
    await sendKeys({ press: ' ' });
    await elementUpdated(el);
    expect(drawer.open).to.be.true;
  });

  describe('trigger slot keyup (Firefox space-click suppression)', () => {
    it('calls preventDefault on keyup when key is Space', () => {
      const slot = getTriggerSlot(el);
      const ev = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: ' ',
      });
      slot.dispatchEvent(ev);
      expect(ev.defaultPrevented).to.be.true;
    });

    it('calls preventDefault on keyup when key is Enter', () => {
      const slot = getTriggerSlot(el);
      const ev = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
      });
      slot.dispatchEvent(ev);
      expect(ev.defaultPrevented).to.be.true;
    });

    it('does not prevent default on keyup for other keys', () => {
      const slot = getTriggerSlot(el);
      const ev = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: 'Escape',
      });
      slot.dispatchEvent(ev);
      expect(ev.defaultPrevented).to.be.false;
    });
  });

  describe('getAccessibleTriggerTarget default branch (native slotted trigger)', () => {
    it('updateAccessibleTrigger sets aria on the slotted element itself', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser>
          <button type="button" slot="trigger">Open</button>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const btn = getTriggerSlot(el).assignedElements()[0] as HTMLButtonElement;

      el.updateAccessibleTrigger();
      await elementUpdated(el);

      expect(btn.getAttribute('aria-haspopup')).to.equal('true');
      expect(btn.getAttribute('aria-expanded')).to.equal('false');
    });

    it('updateAccessibleTrigger sets aria-expanded when the drawer is open', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser>
          <button type="button" slot="trigger">Open</button>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const btn = getTriggerSlot(el).assignedElements()[0] as HTMLButtonElement;

      el.show();
      await elementUpdated(el);
      el.updateAccessibleTrigger();
      await elementUpdated(el);

      expect(btn.getAttribute('aria-haspopup')).to.equal('true');
      expect(btn.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('blurTrigger', () => {
    it('blurs focus from a slotted native button', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser>
          <button type="button" slot="trigger">Open</button>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const btn = getTriggerSlot(el).assignedElements()[0] as HTMLButtonElement;

      btn.focus();
      expect(document.activeElement).to.equal(btn);

      el.blurTrigger();

      expect(document.activeElement).to.not.equal(btn);
    });

    it('blurs focus from the inner button of a slotted cx-icon-button', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser>
          <cx-icon-button slot="trigger" label="Open menu" name="menu"></cx-icon-button>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const iconBtn = getTriggerSlot(el).assignedElements()[0] as CxIconButton;
      await iconBtn.updateComplete;

      iconBtn.focus();
      expect(document.activeElement).to.equal(iconBtn);

      el.blurTrigger();

      expect(document.activeElement).to.not.equal(iconBtn);
    });
  });

  describe('when the trigger has no tabbable target (getAccessibleTriggerTarget)', () => {
    it('updateAccessibleTrigger does not set aria on a non-tabbable slotted element', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser>
          <div slot="trigger" data-testid="non-tabbable-trigger"></div>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const plain = el.querySelector(
        '[data-testid="non-tabbable-trigger"]',
      ) as HTMLDivElement;

      el.updateAccessibleTrigger();
      await elementUpdated(el);

      expect(plain.hasAttribute('aria-haspopup')).to.be.false;
      expect(plain.hasAttribute('aria-expanded')).to.be.false;
    });

    it('blurTrigger does not throw when there is no accessible trigger', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser>
          <div slot="trigger"></div>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);

      expect(() => el.blurTrigger()).to.not.throw();
    });

    it('updateAccessibleTrigger and blurTrigger are no-ops when the trigger slot is empty', async () => {
      el = await fixture<CxDamViewBrowser>(html`<cx-dam-view-browser></cx-dam-view-browser>`);
      await elementUpdated(el);

      expect(getTriggerSlot(el).assignedElements().length).to.equal(0);
      expect(() => el.updateAccessibleTrigger()).to.not.throw();
      expect(() => el.blurTrigger()).to.not.throw();
    });
  });

  it('does not render pin control when can-pin is false', () => {
    expect(el.shadowRoot!.querySelector('cx-drawer cx-icon-button')).to.be.null;
  });

  it('renders pin control when can-pin is set and not force-overlay', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser ?can-pin=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-drawer cx-tooltip cx-icon-button')).to.exist;
  });

  it('hides pin when force-overlay is set even if can-pin', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser ?can-pin=${true} ?force-overlay=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('cx-drawer cx-icon-button')).to.be.null;
  });

  it('pin toggles persistent drawer variant and hides the trigger slot', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser ?can-pin=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    const pin = el.shadowRoot!.querySelector(
      'cx-drawer cx-tooltip cx-icon-button',
    ) as HTMLElement;
    const drawer = getDrawer(el) as HTMLElement & { variant: string };
    const triggerSlot = getTriggerSlot(el);

    expect(drawer.variant).to.equal('overlay');
    expect(triggerSlot.classList.contains('drawer-trigger--hidden')).to.be.false;

    pin.click();
    await elementUpdated(el);

    expect(drawer.variant).to.equal('persistent');
    expect(triggerSlot.classList.contains('drawer-trigger--hidden')).to.be.true;
  });

  it('renders collections tree when show-collections and collection-path are set', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser collection-path="/col/root" ?show-collections=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('.browser__collections')).to.exist;
    expect(el.shadowRoot!.querySelector('cx-folder-select-tree')).to.exist;
  });

  it('does not render collections when collection-path is empty', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser ?show-collections=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('.browser__collections')).to.be.null;
  });

  it('forwards search term from folder select to the collections tree', async () => {
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser collection-path="/col" ?show-collections=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);
    const fs = getFolderSelect(el);
    fs.dispatchEvent(
      new CustomEvent('cx-folder-select-search-term-change', {
        bubbles: true,
        composed: true,
        detail: { value: 'needle' },
      }),
    );
    await elementUpdated(el);
    const tree = el.shadowRoot!.querySelector('cx-folder-select-tree');
    expect(tree!.getAttribute('search-term')).to.equal('needle');
  });

  it('collectionApi forwards params to apiGetCollections with folderId from collectionPath', async () => {
    const stub = sinon.stub().resolves({ data: [], hasMore: false });
    el = await fixture<CxDamViewBrowser>(html`
      <cx-dam-view-browser collection-path="/collections/root" ?show-collections=${true}>
        <cx-button type="button" slot="trigger">Open</cx-button>
      </cx-dam-view-browser>
    `);
    await elementUpdated(el);

    (
      el as unknown as {
        apiGetCollections: (typeof stub);
      }
    ).apiGetCollections = stub;

    const collectionApi = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(el),
      'collectionApi',
    )?.value as (
      this: CxDamViewBrowser,
      params: GetFolderRequest,
    ) => Promise<{ data: Folder[]; hasMore: boolean }>;

    const params: GetFolderRequest = {
      folderId: 'ignored-by-wrapper',
      limit: 10,
      searchTerm: 'needle',
      start: 5,
    };

    await collectionApi.call(el, params);

    expect(stub).to.have.been.calledOnce;
    expect(stub.firstCall.args[0]).to.deep.equal({
      ...params,
      folderId: '/collections/root',
    });
  });

  describe('firstFetchCallback selection', () => {
    it('emits cx-selection-change with the Library folder when allowed folders are empty', async () => {
      const fs = getFolderSelect(el);
      const p = oneEvent(el, 'cx-selection-change');
      fs.firstFetchCallback!([
        makeFolder({ id: 'a', title: 'Alpha' }),
        makeFolder({ id: 'b', title: 'Library' }),
      ]);
      const ev = await p;
      expect(ev.detail.selection[0].dataset.id).to.equal('b');
      expect(ev.detail.selection[0].dataset.name).to.equal('Library');
    });

    it('prefers an allowed folder id when set', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser .allowedFolders=${['pick-me']}>
          <cx-button type="button" slot="trigger">Open</cx-button>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const fs = getFolderSelect(el);
      const p = oneEvent(el, 'cx-selection-change');
      fs.firstFetchCallback!([
        makeFolder({ id: 'other', title: 'Library' }),
        makeFolder({ id: 'pick-me', title: 'Pinned' }),
      ]);
      const ev = await p;
      expect(ev.detail.selection[0].dataset.id).to.equal('pick-me');
    });

    it('falls back to the first folder when allowed id is missing', async () => {
      el = await fixture<CxDamViewBrowser>(html`
        <cx-dam-view-browser .allowedFolders=${['missing']}>
          <cx-button type="button" slot="trigger">Open</cx-button>
        </cx-dam-view-browser>
      `);
      await elementUpdated(el);
      const fs = getFolderSelect(el);
      const p = oneEvent(el, 'cx-selection-change');
      fs.firstFetchCallback!([makeFolder({ id: 'only', title: 'Solo' })]);
      const ev = await p;
      expect(ev.detail.selection[0].dataset.id).to.equal('only');
    });

    it('uses the first folder when there is no Library title', async () => {
      const fs = getFolderSelect(el);
      const p = oneEvent(el, 'cx-selection-change');
      fs.firstFetchCallback!([makeFolder({ id: 'first', title: 'Archive' })]);
      const ev = await p;
      expect(ev.detail.selection[0].dataset.id).to.equal('first');
    });
  });
});
