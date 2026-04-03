import { css } from 'lit';

const dialogStyles = css`
  .dam-view-format-dialog {
    --body-spacing: var(--cx-spacing-small);
    --divider-spacing: 0;
    --max-height: 100%;
    --max-width: 520px;
    --width: 52rem;
  }

  .dam-view-format-dialog::part(header) {
    align-items: center;
  }

  .dam-view-format-dialog::part(panel) {
    max-height: calc(var(--max-height) - var(--cx-spacing-2x-large));
    max-width: var(--max-width);
  }

  .dam-view-format-dialog::part(body) {
    overflow-x: hidden;
    padding: 0;
    /*  Fix for Firefox/Safari: Container with both overflow and z-index will cut off fixed-positioning child
    (in this case, cx-tooltip's popup) */
    z-index: unset;
  }

  .dam-view-format-dialog::part(footer) {
    padding: var(--cx-spacing-medium);
  }
`;

const drawerStyles = css`
  .dam-view-format-drawer {
    --size: 100%;
  }

  .dam-view-format-drawer::part(header) {
    align-items: center;
  }

  .dam-view-format-drawer::part(body) {
    background-color: var(--cx-color-neutral-100);
    padding: 0;
  }

  .dam-view-format-drawer::part(footer) {
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

  .dam-view-format__asset-name {
    --color: var(--cx-color-neutral-500);
  }

  .dam-view-format__cropper {
    height: 350px;
  }

  .dam-view-format__footer__button {
    width: 100%;
  }

  .dam-view-format__footer {
    display: flex;
    justify-content: flex-end;
  }

  .dam-view-format__footer__button cx-button-group {
    width: 100%;
  }
`;
