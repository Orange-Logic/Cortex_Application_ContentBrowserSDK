import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const r = o`
  :host {
    --toggler-color: var(--cx-color-primary);
  }

  .content {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow-wrap: break-word;
  }

  .toggler {
    display: block;
    margin-top: var(cx--spacing-2x-small);
  }

  .toggler::part(base) {
    color: var(--toggler-color);
    font-weight: var(--cx-font-weight-medium);
    text-transform: none;
    width: auto;
  }

  .toggler::part(label) {
    padding-left: 0;
  }
`;
export {
  r as default
};
