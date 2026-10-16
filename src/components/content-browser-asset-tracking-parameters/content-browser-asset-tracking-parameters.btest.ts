import './content-browser-asset-tracking-parameters';

import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import type CxInput from '@orangelogic/design-system/components/input';
import type { CxChangeEvent } from '@/events';

import type CxContentBrowserAssetTrackingParameters from './content-browser-asset-tracking-parameters';

function getRootSpace(el: CxContentBrowserAssetTrackingParameters) {
  return el.shadowRoot!.querySelector('cx-space.dialog__tracking');
}

function getInput(
  el: CxContentBrowserAssetTrackingParameters,
  field: 'key' | 'value',
  index: number,
): CxInput {
  return el.shadowRoot!.querySelector<CxInput>(
    `cx-input[data-tracking-field="${field}"][data-tracking-index="${index}"]`,
  )!;
}

describe('content-browser-asset-tracking-parameters', () => {
  let el: CxContentBrowserAssetTrackingParameters;

  beforeEach(async () => {
    el = await fixture(
      html`<cx-content-browser-asset-tracking-parameters></cx-content-browser-asset-tracking-parameters>`,
    );
  });

  describe('initial state', () => {
    it('is accessible', async () => {
      await expect(el).to.be.accessible();
    });

    it('has empty values and no parameter rows', () => {
      expect(el.values).to.deep.equal([]);
      expect(getRootSpace(el)).to.exist;
      expect(el.shadowRoot!.querySelectorAll('cx-input').length).to.equal(0);
      expect(el.shadowRoot!.querySelector('cx-button')).to.exist;
    });
  });

  describe('with values', () => {
    beforeEach(async () => {
      el.values = [{ key: 'utm_source', value: 'news' }];
      await elementUpdated(el);
    });

    it('renders a row with key/value inputs and remove control', () => {
      expect(el.shadowRoot!.querySelectorAll('.content-browser-asset-tracking-parameters__row').length).to
        .equal(1);
      expect(getInput(el, 'key', 0).value).to.equal('utm_source');
      expect(getInput(el, 'value', 0).value).to.equal('news');
      expect(el.shadowRoot!.querySelector('cx-icon-button[name="close"]')).to.exist;
    });

    it('emits cx-content-browser-asset-tracking-parameters-change when key input commits', async () => {
      const input = getInput(el, 'key', 0);
      input.value = 'utm_campaign';
      await elementUpdated(input);
      const evtPromise = oneEvent(el, 'cx-content-browser-asset-tracking-parameters-change');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      const evt = await evtPromise;
      expect(evt.detail.values).to.deep.equal([{ key: 'utm_campaign', value: 'news' }]);
    });

    it('emits cx-content-browser-asset-tracking-parameters-change when value input commits', async () => {
      const input = getInput(el, 'value', 0);
      input.value = 'email';
      await elementUpdated(input);
      const evtPromise = oneEvent(el, 'cx-content-browser-asset-tracking-parameters-change');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      const evt = await evtPromise;
      expect(evt.detail.values).to.deep.equal([{ key: 'utm_source', value: 'email' }]);
    });

    it('leaves non-target rows unchanged when key commits (map else / : r branch)', async () => {
      el.values = [
        { key: 'a', value: '1' },
        { key: 'b', value: '2' },
      ];
      await elementUpdated(el);

      const input = getInput(el, 'key', 0);
      input.value = 'a-updated';
      await elementUpdated(input);
      const evtPromise = oneEvent(el, 'cx-content-browser-asset-tracking-parameters-change');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      const evt = await evtPromise;
      expect(evt.detail.values).to.deep.equal([
        { key: 'a-updated', value: '1' },
        { key: 'b', value: '2' },
      ]);
    });

    it('leaves non-target rows unchanged when value commits (map else / : r branch)', async () => {
      el.values = [
        { key: 'a', value: '1' },
        { key: 'b', value: '2' },
      ];
      await elementUpdated(el);

      const input = getInput(el, 'value', 1);
      input.value = '2-updated';
      await elementUpdated(input);
      const evtPromise = oneEvent(el, 'cx-content-browser-asset-tracking-parameters-change');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      const evt = await evtPromise;
      expect(evt.detail.values).to.deep.equal([
        { key: 'a', value: '1' },
        { key: 'b', value: '2-updated' },
      ]);
    });

    it('does not emit when remove is clicked without data-tracking-index', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const btn = el.shadowRoot!.querySelector('cx-icon-button[name="close"]')!;
      btn.removeAttribute('data-tracking-index');
      (btn as HTMLElement).click();
      await elementUpdated(el);
      expect(count).to.equal(0);
    });

    it('does not emit when remove has non-numeric data-tracking-index', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const btn = el.shadowRoot!.querySelector('cx-icon-button[name="close"]')!;
      btn.setAttribute('data-tracking-index', 'x');
      (btn as HTMLElement).click();
      await elementUpdated(el);
      expect(count).to.equal(0);
    });

    it('does not emit when key input fires cx-change without data-tracking-index', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const input = getInput(el, 'key', 0);
      input.removeAttribute('data-tracking-index');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      await elementUpdated(el);
      expect(count).to.equal(0);
    });

    it('does not emit when input has unsupported data-tracking-field', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const input = getInput(el, 'key', 0);
      input.setAttribute('data-tracking-field', 'other');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      await elementUpdated(el);
      expect(count).to.equal(0);
    });

    it('does not emit when data-tracking-index is NaN', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const input = getInput(el, 'key', 0);
      input.setAttribute('data-tracking-index', 'not-a-number');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      await elementUpdated(el);
      expect(count).to.equal(0);
    });

    it('does not emit when row index is out of range', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const input = getInput(el, 'key', 0);
      input.setAttribute('data-tracking-index', '99');
      input.dispatchEvent(new CustomEvent('cx-change', { bubbles: true, composed: true }));
      await elementUpdated(el);
      expect(count).to.equal(0);
    });

    it('does not emit when cx-change target is not CxInput', async () => {
      let count = 0;
      el.addEventListener('cx-content-browser-asset-tracking-parameters-change', () => {
        count += 1;
      });
      const ev = new CustomEvent('cx-change') as CxChangeEvent;
      Object.defineProperty(ev, 'target', { value: document.createElement('div') });
      (el as unknown as { handleRowInputChange(e: CxChangeEvent): void }).handleRowInputChange(ev);
      expect(count).to.equal(0);
    });

    it('emits when remove is clicked', async () => {
      el.values = [
        { key: 'a', value: '1' },
        { key: 'b', value: '2' },
      ];
      await elementUpdated(el);
      const buttons = el.shadowRoot!.querySelectorAll('cx-icon-button[name="close"]');
      expect(buttons.length).to.equal(2);
      const evtPromise = oneEvent(el, 'cx-content-browser-asset-tracking-parameters-change');
      (buttons[0] as HTMLElement).click();
      const evt = await evtPromise;
      expect(evt.detail.values).to.deep.equal([{ key: 'b', value: '2' }]);
    });
  });

  describe('add parameter', () => {
    it('appends an empty row via the add button', async () => {
      const btn = el.shadowRoot!.querySelector('cx-button');
      expect(btn).to.exist;
      const evtPromise = oneEvent(el, 'cx-content-browser-asset-tracking-parameters-change');
      (btn as HTMLElement).click();
      const evt = await evtPromise;
      expect(evt.detail.values).to.deep.equal([{ key: '', value: '' }]);
    });
  });
});
