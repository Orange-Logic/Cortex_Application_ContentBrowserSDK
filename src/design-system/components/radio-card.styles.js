import { i as a } from "../chunks/lit-element.DRlPF2me.js";
const e = a`
  :host {
    display: block;
    --label-text-align: left;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio-card {
    --border-radius: var(--cx-border-radius-large);
    --box-shadow: none;
    --padding: var(--cx-spacing-small);
    --image-border-radius: var(--cx-border-radius-medium);
    cursor: pointer;
    width: 100%;
    margin-block: var(--cx-spacing-2x-small);
  }

  .radio-card::part(image) {
    background-color: transparent;
  }

  .radio-card--compact::part(image) {
    display: none;
  }

  .radio-card--checked::part(base) {
    background-color: var(--cx-color-primary-50);
    border: 1px solid var(--cx-color-primary);
  }

  .radio-card--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .radio-card__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cx-spacing-2x-small);
    text-transform: var(--cx-radio-card-label-text-transform, none);
  }

  .radio-card__label > cx-line-clamp {
    flex: 1 1 auto;
    text-align: var(--label-text-align);
  }

  .radio-card--has-suffix .radio-card__label__suffix {
    width: 3rem;
  }

  .radio-card__label__suffix {
    display: flex;
    justify-content: flex-end;
    height: fit-content;
  }

  .radio-card__image::slotted(img) {
    border-radius: var(--cx-border-radius-small);
    width: 100%;
  }

  .radio-card__image::slotted(*) {
    display: flex;
    flex-direction: column;
  }

  cx-radio::part(base) {
    align-items: center;
    width: 100%;
    --toggle-size: var(--cx-toggle-size-large);
  }
`;
export {
  e as default
};
