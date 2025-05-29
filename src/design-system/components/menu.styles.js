import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const a = r`
  :host {
    display: block;
    position: relative;
    background: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-radius: var(--cx-border-radius-large);
    padding: var(--cx-spacing-x-small) 0;
    overflow: auto;

    --divider-color: var(--cx-panel-border-color);
    --divider-width: var(--cx-panel-border-width);
    --divider-spacing: var(--cx-spacing-x-small);
  }

  ::slotted(cx-divider) {
    --color: var(--divider-color);
    --width: var(--divider-width);
    --spacing: var(--divider-spacing);
  }

  ::slotted([data-alternating-grouping])::before {
    content: ' ';
    background-color: var(--divider-color);

    display: block;
    margin: var(--divider-spacing) 0;
    height: var(--divider-width);
  }

  ::slotted([data-alternating-grouping='horizontal'])::before {
    display: inline-block;
    height: 100%;
    margin: 0 var(--divider-spacing);
    width: var(--divider-width);
  }

  .horizontal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :host([horizontal]) ::slotted(cx-menu-section) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;
export {
  a as default
};
