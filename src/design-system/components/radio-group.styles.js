import { i as o } from "../chunks/lit-element.DRlPF2me.js";
const a = o`
  :host {
    display: block;
    --radio-group-gap: var(--cx-spacing-small);
  }

  .form-control {
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-control__label {
    padding: 0;
  }

  .radio-group__horizontal {
    display: flex;
    flex-wrap: wrap;
    gap: var(--radio-group-gap);
  }

  .radio-group__horizontal slot::slotted(cx-radio-card) {
    flex-basis: calc(
      100% / var(--radio-group-columns) - var(--radio-group-gap) /
        var(--radio-group-columns) * (var(--radio-group-columns) - 1)
    );
  }

  .radio-group__horizontal--filled slot::slotted(cx-radio-card) {
    flex-basis: auto;
  }

  .radio-group--required .radio-group__label::after {
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
export {
  a as default
};
