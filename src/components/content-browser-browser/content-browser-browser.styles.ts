import { css } from 'lit';

export default css`
  :host {
    display: contents;
  }

  .drawer-trigger {
    display: block;
    padding: var(--cx-spacing-medium);
    position: absolute;
    top: 0;
    left: 0;
  }

  .drawer-trigger--hidden {
    display: none;
  }

  .content-browser-browser::part(base) {
    z-index: var(--cx-z-index-dialog);
  }

  .content-browser-browser::part(body) {
    padding: 0;
  }

  cx-space {
    height: 100%;
    width: 100%;
  }

  .browser__folders {
    color: var(--cx-color-neutral);
    width: 100%;
    flex: 1;
    overflow-y: auto;
    padding: var(--cx-spacing-small);
  }

  .browser__collections {
    --content-padding: 0 var(--cx-spacing-small) var(--cx-spacing-small);

    width: 100%;
  }
`;
