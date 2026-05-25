import { css } from 'lit';

const dialogStyles = css`
  .content-browser-format-dialog {
    --body-spacing: var(--cx-spacing-small);
    --divider-spacing: 0;
    --max-height: 100%;
    --max-width: 520px;
    --width: 52rem;
  }

  .content-browser-format-dialog::part(header) {
    align-items: center;
  }

  .content-browser-format-dialog::part(panel) {
    max-height: calc(var(--max-height) - var(--cx-spacing-2x-large));
    max-width: var(--max-width);
  }

  .content-browser-format-dialog::part(body) {
    overflow-x: hidden;
    padding: 0;
    /*  Fix for Firefox/Safari: Container with both overflow and z-index will cut off fixed-positioning child
    (in this case, cx-tooltip's popup) */
    z-index: unset;
  }

  .content-browser-format-dialog::part(footer) {
    padding: var(--cx-spacing-medium);
  }
`;

const drawerStyles = css`
  .content-browser-format-drawer {
    --size: 100%;
  }

  .content-browser-format-drawer::part(header) {
    align-items: center;
  }

  .content-browser-format-drawer::part(body) {
    background-color: var(--cx-color-neutral-100);
    padding: 0;
  }

  .content-browser-format-drawer::part(footer) {
    padding: var(--cx-spacing-medium);
  }
`;

export default css`
  :host {
    display: block;
  }

  ${dialogStyles}

  ${drawerStyles}

  cx-space {
    width: 100%;
  }

  .content-browser-format__asset-name {
    --color: var(--cx-color-neutral-500);
  }

  .content-browser-format__cropper {
    height: 350px;
  }

  .content-browser-format-dialog cx-content-browser-asset-preview,
  .content-browser-format-drawer cx-content-browser-asset-preview {
    height: 350px;
    min-height: 350px;
  }

  .content-browser-format__footer__button {
    width: 100%;
  }

  .content-browser-format__footer {
    display: flex;
    justify-content: flex-end;
  }

  .content-browser-format__footer__button cx-button-group {
    width: 100%;
  }
`;
