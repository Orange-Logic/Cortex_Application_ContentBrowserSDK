import { i as o } from "./lit-element.DRlPF2me.js";
const t = o`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--cx-input-label-color);
    margin-bottom: var(--cx-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--cx-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--cx-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--cx-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    color: var(--cx-input-required-content-color);
    content: var(--cx-input-required-content);
    margin-inline-start: var(--cx-input-required-content-offset);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--cx-input-help-text-color);
    margin-top: max(var(--cx-spacing-3x-small), 3px);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--cx-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--cx-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--cx-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group
    .form-control__help-text {
    margin-top: max(var(--cx-spacing-2x-small), 3px);
  }

  /* Validation styles for form */
  :host([data-user-invalid])::part(form-control-help-text) {
    color: var(--cx-input-invalid-color);
  }
`;
export {
  t as f
};
