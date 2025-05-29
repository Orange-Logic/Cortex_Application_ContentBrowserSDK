import { i } from "../chunks/lit-element.DRlPF2me.js";
const t = i`
  :host {
    display: block;
    box-sizing: border-box !important;
    min-width: 0;
    padding: calc(var(--cx-grid-row-spacing) / 2)
      calc(var(--cx-grid-column-spacing) / 2);
    width: calc(
      100% * var(--cx-grid-item-xs) / var(--cx-grid-columns) -
        (var(--cx-grid-columns) - var(--cx-grid-item-xs)) *
        (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
    );
  }
  :host([xs='auto']) {
    width: auto;
  }

  :host([xs='']) {
    flex: 1;
    width: auto;
  }

  @media (min-width: 600px) {
    :host([sm]:not([use-container])) {
      width: calc(
        100% * var(--cx-grid-item-sm) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-sm)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([sm='auto']:not([use-container])) {
      width: auto;
    }
    :host([sm='']:not([use-container])) {
      flex: 1;
      width: auto;
    }
  }

  @media (min-width: 900px) {
    :host([md]:not([use-container])) {
      width: calc(
        100% * var(--cx-grid-item-md) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-md)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([md='auto']:not([use-container])) {
      width: auto;
    }
    :host([md='']:not([use-container])) {
      flex: 1;
      width: auto;
    }
  }

  @media (min-width: 1200px) {
    :host([lg]:not([use-container])) {
      width: calc(
        100% * var(--cx-grid-item-lg) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-lg)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([lg='auto']:not([use-container])) {
      width: auto;
    }
    :host([lg='']:not([use-container])) {
      flex: 1;
      width: auto;
    }
  }

  @media (min-width: 1536px) {
    :host([xl]:not([use-container])) {
      width: calc(
        100% * var(--cx-grid-item-xl) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-xl)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([xl='auto']:not([use-container])) {
      width: auto;
    }
    :host([xl='']:not([use-container])) {
      flex: 1;
      width: auto;
    }
  }

  @container (min-width: 600px) {
    :host([sm][use-container]) {
      width: calc(
        100% * var(--cx-grid-item-sm) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-sm)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([sm='auto'][use-container]) {
      width: auto;
    }
    :host([sm=''][use-container]) {
      flex: 1;
      width: auto;
    }
  }

  @container (min-width: 900px) {
    :host([md][use-container]) {
      width: calc(
        100% * var(--cx-grid-item-md) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-md)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([md='auto'][use-container]) {
      width: auto;
    }
    :host([md=''][use-container]) {
      flex: 1;
      width: auto;
    }
  }

  @container (min-width: 1200px) {
    :host([lg][use-container]) {
      width: calc(
        100% * var(--cx-grid-item-lg) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-lg)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([lg='auto'][use-container]) {
      width: auto;
    }
    :host([lg=''][use-container]) {
      flex: 1;
      width: auto;
    }
  }

  @container (min-width: 1536px) {
    :host([xl][use-container]) {
      width: calc(
        100% * var(--cx-grid-item-xl) / var(--cx-grid-columns) -
          (var(--cx-grid-columns) - var(--cx-grid-item-xl)) *
          (var(--cx-flex-column-spacing) / var(--cx-grid-columns))
      );
    }
    :host([xl='auto'][use-container]) {
      width: auto;
    }
    :host([xl=''][use-container]) {
      flex: 1;
      width: auto;
    }
  }
`;
export {
  t as default
};
