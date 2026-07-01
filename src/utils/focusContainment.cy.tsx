/// <reference types="cypress" />

import { findFocusContainmentHost } from './focusContainment';

const modal = (className: string, extraStyle = '') => {
  const el = document.createElement('div');
  el.className = className;
  el.setAttribute('data-test-modal', '');
  el.style.cssText =
    'position:fixed;top:0;left:0;width:400px;height:300px;' + extraStyle;
  document.body.appendChild(el);
  return el;
};

describe('Utils - findFocusContainmentHost', () => {
  beforeEach(() => {
    (document.activeElement as HTMLElement | null)?.blur();
  });

  afterEach(() => {
    document.querySelectorAll('[data-test-modal]').forEach((el) => el.remove());
  });

  it('returns null when no modal is present', () => {
    expect(findFocusContainmentHost()).to.equal(null);
  });

  it('detects a jQuery UI .ui-dialog via the focused trigger', () => {
    const dialog = modal('ui-dialog');
    const btn = document.createElement('button');
    dialog.appendChild(btn);
    btn.focus();

    expect(findFocusContainmentHost()).to.equal(dialog);
  });

  it('detects an aria-modal dialog when nothing inside is focused', () => {
    const dialog = modal('some-lib-modal');
    dialog.setAttribute('aria-modal', 'true');

    expect(findFocusContainmentHost()).to.equal(dialog);
  });

  it('detects a native <dialog> opened with showModal()', () => {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('data-test-modal', '');
    const btn = document.createElement('button');
    dialog.appendChild(btn);
    document.body.appendChild(dialog);
    // showModal() sets the `open` attribute but no aria-modal attribute.
    (dialog as HTMLDialogElement).showModal();
    btn.focus();

    expect(findFocusContainmentHost()).to.equal(dialog);

    (dialog as HTMLDialogElement).close();
  });

  it('ignores hidden (closed) modals', () => {
    modal('ui-dialog', 'display:none;');

    expect(findFocusContainmentHost()).to.equal(null);
  });

  it('falls back to null when the modal establishes a fixed containing block', () => {
    const dialog = modal('ui-dialog', 'transform:translateZ(0);');
    const btn = document.createElement('button');
    dialog.appendChild(btn);
    btn.focus();

    // Anchoring here would clip CBSDK's position:fixed overlay, so we decline.
    expect(findFocusContainmentHost()).to.equal(null);
  });
});
