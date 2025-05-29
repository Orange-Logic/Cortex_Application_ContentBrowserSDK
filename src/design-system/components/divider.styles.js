import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const t = o`
  :host {
    --color: var(--cx-panel-border-color);
    --width: var(--cx-panel-border-width);
    --spacing: var(--cx-spacing-medium);
  }

  :host(:not([vertical])) {
    display: block;
    padding: var(--spacing) 0;
  }

  :host(:not([vertical]))::after {
    display: block;
    content: ' ';
    border-top: solid var(--width) var(--color);
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    padding: 0 var(--spacing);
  }

  :host([vertical])::after {
    display: inline-block;
    content: ' ';
    height: 100%;
    border-left: solid var(--width) var(--color);
  }
`;
export {
  t as default
};
