import { i as n } from "../chunks/lit-element.DRlPF2me.js";
const a = n`
  :host {
    display: flex;
    flex-direction: var(--spacing-container-direction, horizontal);
    gap: var(--spacing-container-gap, var(--cx-spacing-medium));
    align-items: var(--spacing-container-align-items, normal);
    flex-wrap: var(--spacing-container-wrap, nowrap);
    justify-content: var(--spacing-container-justify-content, normal);
  }

  :host([direction='vertical']) {
    --spacing-container-direction: column;
  }

  :host([direction='horizontal']) {
    --spacing-container-direction: row;
    --spacing-container-align-items: center;
  }

  /* #region Spacing */
  :host([spacing='3x-small']) {
    --spacing-container-gap: var(--cx-spacing-3x-small);
  }
  :host([spacing='2x-small']) {
    --spacing-container-gap: var(--cx-spacing-2x-small);
  }
  :host([spacing='x-small']) {
    --spacing-container-gap: var(--cx-spacing-x-small);
  }
  :host([spacing='small']) {
    --spacing-container-gap: var(--cx-spacing-small);
  }
  :host([spacing='medium']) {
    --spacing-container-gap: var(--cx-spacing-medium);
  }
  :host([spacing='large']) {
    --spacing-container-gap: var(--cx-spacing-large);
  }
  :host([spacing='x-large']) {
    --spacing-container-gap: var(--cx-spacing-x-large);
  }
  :host([spacing='2x-large']) {
    --spacing-container-gap: var(--cx-spacing-2x-large);
  }
  :host([spacing='3x-large']) {
    --spacing-container-gap: var(--cx-spacing-3x-large);
  }
  :host([spacing='4x-large']) {
    --spacing-container-gap: var(--cx-spacing-4x-large);
  }

  /* #endregion */

  /* #region Wrap */
  :host([wrap='wrap']) {
    --spacing-container-wrap: wrap;
  }

  :host([wrap='nowrap']) {
    --spacing-container-wrap: nowrap;
  }

  :host([wrap='wrap-reverse']) {
    --spacing-container-wrap: wrap-reverse;
  }
  /* #endregion */

  /* #region Justify content */
  :host([justify-content='start']) {
    --spacing-container-justify-content: start;
  }
  :host([justify-content='end']) {
    --spacing-container-justify-content: end;
  }
  :host([justify-content='flex-start']) {
    --spacing-container-justify-content: flex-start;
  }
  :host([justify-content='flex-end']) {
    --spacing-container-justify-content: flex-end;
  }
  :host([justify-content='center']) {
    --spacing-container-justify-content: center;
  }
  :host([justify-content='left']) {
    --spacing-container-justify-content: left;
  }
  :host([justify-content='right']) {
    --spacing-container-justify-content: right;
  }
  :host([justify-content='normal']) {
    --spacing-container-justify-content: normal;
  }
  :host([justify-content='space-between']) {
    --spacing-container-justify-content: space-between;
  }
  :host([justify-content='space-around']) {
    --spacing-container-justify-content: space-around;
  }
  :host([justify-content='space-evenly']) {
    --spacing-container-justify-content: space-evenly;
  }
  :host([justify-content='stretch']) {
    --spacing-container-justify-content: stretch;
  }
  /* #endregion */

  /* #region Align items */
  :host([align-items='normal']) {
    --spacing-container-align-items: normal;
  }
  :host([align-items='center']) {
    --spacing-container-align-items: center;
  }
  :host([align-items='start']) {
    --spacing-container-align-items: start;
  }
  :host([align-items='end']) {
    --spacing-container-align-items: end;
  }
  :host([align-items='baseline']) {
    --spacing-container-align-items: baseline;
  }
  :host([align-items='stretch']) {
    --spacing-container-align-items: stretch;
  }
  :host([align-items='flex-start']) {
    --spacing-container-align-items: flex-start;
  }
  :host([align-items='flex-end']) {
    --spacing-container-align-items: flex-end;
  }
  /* #endregion */

  :host([direction='vertical'][block]) ::slotted(*) {
    display: block;
    width: 100%;
  }
`;
export {
  a as default
};
