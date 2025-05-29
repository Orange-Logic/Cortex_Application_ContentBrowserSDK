import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const r = o`
  :host {
    --max-width: 40rem;
    --hide-delay: 0ms;
    --show-delay: 100ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--cx-tooltip-arrow-size);
    --arrow-color: var(--cx-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--cx-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip--disabled-hover::part(popup) {
    pointer-events: none;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--cx-tooltip-border-radius);
    background-color: var(--cx-tooltip-background-color);
    font-family: var(--cx-tooltip-font-family);
    font-size: var(--cx-tooltip-font-size);
    font-weight: var(--cx-tooltip-font-weight);
    line-height: var(--cx-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--cx-tooltip-color);
    padding: var(--cx-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    overflow-wrap: break-word;
  }
`;
export {
  r as default
};
