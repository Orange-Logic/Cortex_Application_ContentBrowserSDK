import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const e = r`
  :host {
    --grid-width: 280px;
    --grid-height: 200px;
    --grid-handle-size: 16px;
    --slider-height: 15px;
    --slider-handle-size: 17px;
    --swatch-size: 25px;

    --control-border-color: var(--cx-color-neutral-300);
    --control-button-color: var(--cx-color-neutral-0);
    --control-caret-color: var(--cx-color-neutral-800);

    display: inline-block;
  }

  .color-picker {
    width: var(--grid-width);
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    color: var(--color);
    background-color: var(--cx-panel-background-color);
    border-radius: var(--cx-border-radius-small);
    user-select: none;
    -webkit-user-select: none;
  }

  .color-picker--inline {
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
  }

  .color-picker--inline:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .color-picker__grid {
    position: relative;
    height: var(--grid-height);
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%
      ),
      linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    border-top-left-radius: var(--cx-border-radius-small);
    border-top-right-radius: var(--cx-border-radius-small);
    cursor: crosshair;
    forced-color-adjust: none;
  }

  .color-picker__grid-handle {
    position: absolute;
    width: var(--grid-handle-size);
    height: var(--grid-handle-size);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    border: solid 2px white;
    margin-top: calc(var(--grid-handle-size) / -2);
    margin-left: calc(var(--grid-handle-size) / -2);
    transition: var(--cx-transition-fast) scale;
  }

  .color-picker__grid-handle--dragging {
    cursor: none;
    scale: 1.5;
  }

  .color-picker__grid-handle:focus-visible {
    outline: var(--cx-focus-ring);
  }

  .color-picker__controls {
    padding: var(--cx-spacing-small);
    display: flex;
    align-items: center;
    gap: var(--cx-spacing-small);
  }

  .color-picker__sliders {
    flex: 1 1 auto;
  }

  .color-picker__slider {
    position: relative;
    height: var(--slider-height);
    border-radius: var(--cx-border-radius-pill);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    forced-color-adjust: none;
  }

  .color-picker__slider:not(:last-of-type) {
    margin-bottom: var(--cx-spacing-small);
  }

  .color-picker__slider-handle {
    position: absolute;
    top: calc(50% - var(--slider-handle-size) / 2);
    width: var(--slider-handle-size);
    height: var(--slider-handle-size);
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    margin-left: calc(var(--slider-handle-size) / -2);
  }

  .color-picker__slider-handle:focus-visible {
    outline: var(--cx-focus-ring);
  }

  .color-picker__hue {
    background-image: linear-gradient(
      to right,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 17%,
      rgb(0, 255, 0) 33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 67%,
      rgb(255, 0, 255) 83%,
      rgb(255, 0, 0) 100%
    );
  }

  .color-picker__alpha .color-picker__alpha-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .color-picker__preview {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--cx-border-radius-circle);
    position: relative;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-picker__preview--button,
  .color-picker__preview--button::part(base) {
    border-radius: var(--cx-border-radius-small);
  }

  .color-picker__preview:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .color-picker__preview-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
  }

  .color-picker__preview-color--copied {
    animation: pulse 0.75s;
  }

  .color-picker__preview {
    width: var(--cx-input-height-medium);
    height: var(--cx-input-height-medium);
  }

  .color-picker__preview.color-picker__preview--button {
    width: calc(var(--cx-input-height-medium) * 0.65);
    height: calc(var(--cx-input-height-medium) * 0.65);
  }

  .color-picker__preview:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: var(--preview-color, currentColor);
    z-index: 1;
  }

  .color-picker__preview--empty:before {
    background-color: transparent;
  }

  .color-picker__preview__transparent-bg {
    background-image: linear-gradient(
        45deg,
        var(--cx-color-neutral-300) 25%,
        transparent 25%
      ),
      linear-gradient(45deg, transparent 75%, var(--cx-color-neutral-300) 75%),
      linear-gradient(45deg, transparent 75%, var(--cx-color-neutral-300) 75%),
      linear-gradient(45deg, var(--cx-color-neutral-300) 25%, transparent 25%);
    background-size: 10px 10px;
    background-position:
      0 0,
      0 0,
      -5px -5px,
      5px 5px;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--cx-color-primary-500);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .color-picker__preview__container {
    display: flex;
    align-items: center;
  }

  .color-picker__user-input {
    display: flex;
    padding: 0 var(--cx-spacing-small) var(--cx-spacing-small)
      var(--cx-spacing-small);
  }

  .color-picker__user-input cx-input {
    min-width: 0; /* fix input width in Safari */
    flex: 1 1 auto;
  }

  .color-picker__user-input cx-button-group {
    margin-left: var(--cx-spacing-small);
  }

  .color-picker__user-input cx-button {
    min-width: 3.25rem;
    max-width: 3.25rem;
    font-size: 1rem;
  }

  .color-picker__swatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    border-top: solid 1px var(--cx-color-neutral-200);
    padding: var(--cx-spacing-small);
    forced-color-adjust: none;
  }

  .color-picker__customSwatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    padding: 0 var(--cx-spacing-small) var(--cx-spacing-small)
      var(--cx-spacing-small);
    forced-color-adjust: none;
  }

  .color-picker__customSwatches-label {
    padding: var(--cx-spacing-small);
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .color-picker__spinner {
    text-align: center;
    margin: var(--cx-spacing-small) 0;
  }

  .color-picker__swatch {
    position: relative;
    width: var(--swatch-size);
    height: var(--swatch-size);
    border-radius: var(--cx-border-radius-small);
  }

  .color-picker__swatch .color-picker__swatch-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: inherit;
    cursor: pointer;
  }

  .color-picker__swatch:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .color-picker--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .color-picker--disabled .color-picker__grid,
  .color-picker--disabled .color-picker__grid-handle,
  .color-picker--disabled .color-picker__slider,
  .color-picker--disabled .color-picker__slider-handle,
  .color-picker--disabled .color-picker__preview,
  .color-picker--disabled .color-picker__swatch,
  .color-picker--disabled .color-picker__swatch-color {
    pointer-events: none;
  }

  /*
   * Color dropdown
   */

  .color-dropdown::part(panel) {
    max-height: none;
    background-color: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-radius: var(--cx-border-radius-small);
    overflow: visible;
  }

  .color-dropdown__trigger::part(base) {
    background-color: var(--control-button-color);
    border-color: var(--control-border-color);
    border-radius: var(--cx-border-radius-small);
    padding-inline-start: var(--cx-spacing-2x-small);
    padding-inline-end: var(--cx-spacing-2x-small);
  }

  .color-dropdown__trigger::part(label) {
    padding-inline-start: var(--cx-spacing-2x-small);
    padding-inline-end: var(--cx-spacing-2x-small);
  }

  .color-dropdown__trigger {
    display: inline-block;
    position: relative;
    background-color: transparent;
    border: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-dropdown__trigger:focus-visible {
    outline: none;
  }

  .color-dropdown__trigger.color-dropdown__trigger--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .color-dropdown__trigger-icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--control-caret-color);
    font-size: var(--cx-font-size-large);
    width: 100%;
    height: 100%;
  }
`;
export {
  e as default
};
