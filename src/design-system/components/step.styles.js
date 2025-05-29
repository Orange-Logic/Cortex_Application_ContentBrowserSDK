import { i as e } from "../chunks/lit-element.DRlPF2me.js";
const t = e`
  :host {
    --color: var(--color);

    flex: calc(100% / var(--columns) + var(--cx-spacing-small));
    margin-left: calc(-1 * var(--cx-spacing-small));
  }

  :host([round]) {
    max-width: 100%;
    margin-left: 0;
  }

  .step {
    font-family: var(--cx-font-sans);
    display: flex;
    gap: var(--cx-spacing-x-small);
    width: 100%;
  }

  .step__arrow {
    display: inline-flex;
    align-items: center;
    padding-top: var(--cx-spacing-x-small);
    padding-bottom: var(--cx-spacing-x-small);
    padding-left: var(--cx-spacing-x-large);
    padding-right: var(--cx-spacing-medium);
    background-color: var(--cx-color-neutral-100);
    cursor: pointer;
    position: relative;
    clip-path: polygon(
      calc(100% - var(--cx-spacing-medium)) 0%,
      100% 50%,
      calc(100% - var(--cx-spacing-medium)) 100%,
      0% 100%,
      var(--cx-spacing-medium) 50%,
      0% 0%
    );
    width: 100%;
  }

  .step--first .step__arrow {
    clip-path: polygon(
      calc(100% - var(--cx-spacing-medium)) 0%,
      100% 50%,
      calc(100% - var(--cx-spacing-medium)) 100%,
      0% 100%,
      0 50%,
      0% 0%
    );
    border-top-left-radius: var(--cx-border-radius-large);
    border-bottom-left-radius: var(--cx-border-radius-large);
    padding-left: var(--cx-spacing-small);
  }

  .step--last .step__arrow {
    clip-path: polygon(
      100% 0,
      100% 50%,
      100% 100%,
      0% 100%,
      var(--cx-spacing-medium) 50%,
      0% 0%
    );
    border-top-right-radius: var(--cx-border-radius-large);
    border-bottom-right-radius: var(--cx-border-radius-large);
  }

  .step--first.step--last .step__arrow {
    clip-path: polygon(100% 0%, 100% 50%, 100% 100%, 0% 100%, 0 50%, 0% 0%);
  }

  .step--active .step__arrow {
    background-color: color-mix(in srgb, var(--color) 15%, white);
    cursor: default;
  }

  .step--completed .step__arrow {
    opacity: 0.5;
  }

  .step--disabled .step__arrow {
    cursor: default;
  }

  .step--readonly .step__arrow {
    cursor: default;
  }

  .step__circle {
    align-items: center;
    background-color: color-mix(in srgb, var(--color) 15%, white);
    border: 2px solid var(--color);
    border-radius: var(--cx-border-radius-circle);
    color: var(--color);
    display: flex;
    flex: 0 0 32px;
    font-weight: var(--cx-font-weight-semibold);
    height: 32px;
    justify-content: center;

    cx-icon {
      font-size: var(--cx-font-size-medium);
    }
  }

  .step--round.step--active .step__circle,
  .step--round.step--completed .step__circle {
    background-color: var(--color);
    color: var(--cx-color-neutral-0);
  }

  .step--round.step--disabled .step__circle {
    background-color: var(--cx-color-neutral-0);
    border-color: var(--cx-color-neutral-400);
    color: var(--cx-color-neutral-400);
  }

  .step--round.step--error .step__circle {
    background-color: var(--cx-color-danger);
    border-color: var(--cx-color-danger);
    color: var(--cx-color-neutral-0);
  }

  .step__content {
    display: flex;
    align-items: center;
    gap: var(--cx-spacing-x-small);
    position: relative;
    max-width: 100%;
  }

  .step--round .step__content {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
  }

  .step__content__prefix::slotted(cx-icon) {
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-medium);
  }

  .step__content__label {
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-medium);
  }

  .step--active .step__content__label,
  .step--active .step__content__help-text,
  .step--active .step__content__prefix::slotted(cx-icon) {
    color: var(--color);
  }

  .step--round.step--completed .step__content__label,
  .step--round.step--completed .step__content__help-text {
    color: var(--color);
  }

  .step--disabled .step__content__label,
  .step--disabled .step__content__help-text,
  .step--disabled .step__content__prefix::slotted(cx-icon) {
    color: var(--cx-color-neutral-400);
  }

  .step--error .step__content__label,
  .step--error .step__content__help-text {
    color: var(--cx-color-danger);
  }

  .step--round .step__content__progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--cx-spacing-small);
    line-height: 1;
    min-width: 120px;
  }

  .step--round .step__content__progress__text {
    color: var(--color);
  }

  .step--round.step__content__help-text {
    color: var(--cx-color-neutral-600);
    font-size: var(--cx-font-size-small);
    line-height: 1;
  }

  .step__line {
    background-color: var(--color);
    flex: 1;
    height: 2rem;
    margin: var(--cx-spacing-medium) calc(32px / 2) 0;
    width: 2px;
  }

  .step--last ~ .step__line {
    display: none;
  }

  cx-progress-bar {
    --height: 8px;
    flex: 1;
  }
`;
export {
  t as default
};
