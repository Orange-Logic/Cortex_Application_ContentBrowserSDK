import { i } from "../chunks/lit-element.DRlPF2me.js";
const t = i`
  :host {
    --border-radius: 0;
    --padding: 0;
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius);
    padding-bottom: var(--padding-bottom, var(--padding));
    padding-left: var(--padding-left, var(--padding));
    padding-right: var(--padding-right, var(--padding));
    padding-top: var(--padding-top, var(--padding));
    width: var(--width, auto);
    height: var(--height, auto);
    display: block;
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  img.image--fill {
    object-fit: fill;
  }

  img.image--contain {
    object-fit: contain;
  }

  img.image--cover {
    object-fit: cover;
  }

  img.image--none {
    object-fit: none;
  }

  img.image--scale-down {
    object-fit: scale-down;
  }

  img.image-error {
    display: none;
  }

  .skeleton {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .skeleton cx-skeleton {
    width: 100%;
    height: 100%;
    --border-radius: 0;
  }

  .fallback {
    position: relative;
  }

  .fallback cx-icon {
    --font-size: var(--cx-font-size-4x-large);
  }
`;
export {
  t as default
};
