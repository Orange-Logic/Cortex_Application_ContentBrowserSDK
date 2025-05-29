import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const o = r`
  :host {
    --height: 1rem;
    --track-color: var(--cx-color-neutral-200);
    --indicator-color: var(--cx-color-primary-600);
    --label-color: var(--cx-color-neutral);
    --indicator-label-color: var(--cx-color-neutral-0);

    display: block;
  }

  .progress-bar-label {
    align-items: center;
    color: var(--label-color);
    display: flex;
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-medium);
    justify-content: space-between;
  }

  .progress-bar {
    position: relative;
    background-color: var(--track-color);
    height: var(--height);
    border-radius: var(--cx-border-radius-pill);
    box-shadow: inset var(--cx-shadow-small);
    overflow: hidden;
  }

  .progress-bar__indicator {
    height: 100%;
    font-family: var(--cx-font-sans);
    font-size: 12px;
    font-weight: var(--cx-font-weight-regular);
    background-color: var(--indicator-color);
    color: var(--indicator-label-color);
    text-align: center;
    line-height: var(--height);
    white-space: nowrap;
    overflow: hidden;
    transition:
      400ms width,
      400ms background-color;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Indeterminate */
  .progress-bar--indeterminate .progress-bar__indicator {
    position: absolute;
    animation: indeterminate 2.5s infinite cubic-bezier(0.37, 0, 0.63, 1);
  }

  .progress-bar--indeterminate.progress-bar--rtl .progress-bar__indicator {
    animation-name: indeterminate-rtl;
  }

  @media (forced-colors: active) {
    .progress-bar {
      outline: solid 1px SelectedItem;
      background-color: var(--cx-color-neutral-0);
    }

    .progress-bar__indicator {
      outline: solid 1px SelectedItem;
      background-color: SelectedItem;
    }
  }

  @keyframes indeterminate {
    0% {
      left: -50%;
      width: 50%;
    }
    75%,
    100% {
      left: 100%;
      width: 50%;
    }
  }

  @keyframes indeterminate-rtl {
    0% {
      right: -50%;
      width: 50%;
    }
    75%,
    100% {
      right: 100%;
      width: 50%;
    }
  }
`;
export {
  o as default
};
