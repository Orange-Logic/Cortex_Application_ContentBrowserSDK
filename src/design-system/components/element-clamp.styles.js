import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const o = e`
  :host {
    display: block;
    overflow: hidden;
    --toggler-color: var(--cx-color-primary);
  }

  .element-clamp {
    overflow-anchor: none;
  }

  .element-clamp--disabled {
    opacity: 0.5;
  }

  .element-clamp-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--cx-transition-medium) rotate ease;
  }

  .details--open .element-clamp-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .element-clamp-icon {
    rotate: -90deg;
  }

  .element-clamp--open slot[name='expand-icon'],
  .element-clamp:not(.element-clamp--open) slot[name='collapse-icon'] {
    display: none;
  }

  .element-clamp__content {
    display: block;
    overflow: hidden;
  }

  .toggler {
    display: block;
    margin-top: var(--cx-spacing-2x-small);
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
  o as default
};
