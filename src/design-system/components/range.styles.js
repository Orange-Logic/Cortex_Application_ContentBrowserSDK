import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const t = r`
  :host {
    --thumb-size: 20px;
    --track-color-active: var(--cx-color-neutral-200);
    --track-color-inactive: var(--cx-color-neutral-200);
    --track-active-offset: 0%;
    --track-height: 6px;

    display: block;
  }

  .range {
    position: relative;
    cursor: pointer;
    margin: var(--cx-spacing-large) 0;
  }

  .range__container {
    position: relative;
    height: var(--track-height);
  }

  .range__control {
    position: absolute;
    top: 0;
    -webkit-appearance: none;
    border-radius: 3px;
    width: 100%;
    height: var(--track-height);
    background: transparent;
    line-height: var(--cx-input-height-medium);
    vertical-align: middle;
    margin: 0;

    background-image: linear-gradient(
      to right,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive)
        min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive)
        max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );

    cursor: pointer;
  }

  .range--disabled .range__control {
    cursor: default;
  }

  .range--rtl .range__control {
    background-image: linear-gradient(
      to left,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive)
        min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive)
        max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  /* Webkit */
  .range__control::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    border-radius: 3px;
    border: none;
  }

  .range__control::-webkit-slider-thumb {
    display: none;
  }

  /* Firefox */
  .range__control::-moz-focus-outer {
    border: 0;
  }

  .range__control::-moz-range-progress {
    background-color: var(--track-color-active);
    border-radius: 3px;
    height: var(--track-height);
  }

  .range__control::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--track-color-inactive);
    border-radius: 3px;
    border: none;
  }

  .range__control::-moz-range-thumb {
    display: none;
  }

  /* States */
  .range__control:focus-visible {
    outline: none;
  }

  .range__control:disabled {
    opacity: 0.5;
  }

  .range__control:disabled::-webkit-slider-thumb {
    cursor: default;
  }

  .range__control:disabled::-moz-range-thumb {
    cursor: default;
  }

  @media (forced-colors: active) {
    .range__control,
    .range__control::-webkit-slider-thumb {
      border: solid 1px transparent;
    }

    .range__control::-moz-range-thumb {
      border: solid 1px transparent;
    }
  }

  ::slotted([slot='marks']) {
    display: none;
  }

  .range__marks {
    position: absolute;
    height: 10px;
    width: 100%;
    transform: translateY(-50%);
    display: flex;
  }

  .mark__tick {
    height: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-left: 1px solid var(--cx-color-neutral-1000);
  }
  .mark__tick--hidden {
    visibility: hidden;
  }
  .mark__label {
    position: absolute;
    top: var(--cx-spacing-medium);
    transform: translateX(-50%);
  }
  .mark__label--hidden {
    visibility: hidden;
  }

  .range__thumb {
    position: absolute;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--cx-color-primary-600);
    top: 50%;
    transform: translate(-50%, -50%);
    left: var(--percent);
    z-index: 1;
  }

  .range__thumb:dir(rtl) {
    left: calc(100% - var(--percent));
  }

  .range__control:focus-visible ~ .range__thumb {
    outline: var(--cx-focus-ring);
    outline-offset: 2px;
  }

  .range--disabled .range__container {
    opacity: 0.5;
    cursor: default;
  }
`;
export {
  t as default
};
