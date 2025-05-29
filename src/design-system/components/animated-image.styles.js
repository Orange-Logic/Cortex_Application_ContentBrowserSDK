import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const t = o`
  :host {
    --control-box-size: 3rem;
    --icon-size: calc(var(--control-box-size) * 0.625);

    display: inline-flex;
    position: relative;
    cursor: pointer;
  }

  .animated-image {
    display: inline-grid;
    grid-template-columns: 1fr;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    grid-row-start: 1;
    grid-column-start: 1;
  }

  img[aria-hidden='true'] {
    visibility: hidden;
  }

  .animated-image__control-box {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    top: calc(50% - var(--control-box-size) / 2);
    right: calc(50% - var(--control-box-size) / 2);
    width: var(--control-box-size);
    height: var(--control-box-size);
    font-size: var(--icon-size);
    background: none;
    border: solid 2px currentColor;
    background-color: rgb(0 0 0 /50%);
    border-radius: var(--cx-border-radius-circle);
    color: white;
    pointer-events: none;
    transition: var(--cx-transition-fast) opacity;
  }

  :host([play]:hover) .animated-image__control-box {
    opacity: 1;
  }

  :host([play]:not(:hover)) .animated-image__control-box {
    opacity: 0;
  }

  :host([play]) slot[name='play-icon'],
  :host(:not([play])) slot[name='pause-icon'] {
    display: none;
  }
`;
export {
  t as default
};
