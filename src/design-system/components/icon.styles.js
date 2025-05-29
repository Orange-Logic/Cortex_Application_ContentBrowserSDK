import { i } from "../chunks/lit-element.DRlPF2me.js";
const o = i`
  :host {
    --font-size: var(--cx-font-size-large);
    display: inline-flex;
    min-width: 1em;
    min-height: 1em;
    overflow: hidden;
    box-sizing: content-box !important;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: var(--font-size);
  }

  :host:has(.icon) {
    max-width: var(--font-size, 1em);
    max-height: var(--font-size, 1em);
  }

  .icon {
    font-weight: normal;
    font-style: normal;
    line-height: inherit;
    letter-spacing: normal;
    text-transform: none;
    display: block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'liga';
    visibility: hidden;
    opacity: 0;
  }

  .icon--loaded {
    visibility: inherit;
    opacity: inherit;
  }

  .icon--outlined {
    font-family: 'Cortex Icons Outlined';
  }

  .icon--filled {
    font-family: 'Cortex Icons Filled';
  }

  .icon--round {
    font-family: 'Cortex Icons Round';
  }

  .icon--sharp {
    font-family: 'Cortex Icons Sharp';
  }

  .icon--two-tone {
    font-family: 'Cortex Icons Two Tone';
  }

  span.icon {
    display: block;
    height: 100%;
    width: 100%;
  }

  span.custom-icon {
    display: block;
    height: 1em;
    width: 1em;
  }

  span.custom-icon img {
    height: 100%;
    width: 100%;
  }
`;
export {
  o as default
};
