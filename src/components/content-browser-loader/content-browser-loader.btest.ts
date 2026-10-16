import './content-browser-loader';

import { expect, fixture, html } from '@open-wc/testing';

import type CxContentBrowserLoader from './content-browser-loader';

describe('content-browser-loader', () => {
  it('renders spinner by default', async () => {
    const el = await fixture<CxContentBrowserLoader>(
      html`<cx-content-browser-loader></cx-content-browser-loader>`,
    );

    expect(el.shadowRoot?.querySelector('cx-spinner')).to.exist;
  });

  it('renders message lines and converts url lines to buttons', async () => {
    const el = await fixture<CxContentBrowserLoader>(
      html`<cx-content-browser-loader message=${'First line\nhttp://example.com'}></cx-content-browser-loader>`,
    );

    const typo = el.shadowRoot?.querySelector('cx-typography');
    const button = el.shadowRoot?.querySelector('cx-button');

    expect(typo).to.exist;
    expect(typo?.textContent?.trim()).to.equal('First line');
    expect(button).to.exist;
    expect(button?.getAttribute('href')).to.equal('http://example.com');
  });

  it('renders slotted content', async () => {
    const el = await fixture<CxContentBrowserLoader>(
      html`
        <cx-content-browser-loader>
          <div id="custom-content">Child</div>
        </cx-content-browser-loader>
      `,
    );

    const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });

    expect(assigned).to.have.length(1);
    expect((assigned[0] as HTMLElement).id).to.equal('custom-content');
  });
});