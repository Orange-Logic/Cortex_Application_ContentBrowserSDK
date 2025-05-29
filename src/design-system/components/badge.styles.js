import { i as r } from "../chunks/lit-element.DRlPF2me.js";
const e = r`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-medium);
    letter-spacing: var(--cx-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--cx-border-radius-small);
    border: solid 1px var(--cx-color-neutral-0);
    white-space: nowrap;
    padding: 0.65em 0.85em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--cx-color-primary-50);
    border-color: var(--cx-color-primary-200);
    color: var(--cx-color-primary-800);
  }

  .badge--success {
    background-color: var(--cx-color-success-50);
    border-color: var(--cx-color-success-200);
    color: var(--cx-color-success-800);
  }

  .badge--neutral {
    background-color: var(--cx-color-neutral-50);
    border-color: var(--cx-color-neutral-200);
    color: var(--cx-color-neutral-800);
  }

  .badge--warning {
    background-color: var(--cx-color-warning-50);
    border-color: var(--cx-color-warning-200);
    color: var(--cx-color-warning-800);
  }

  .badge--danger {
    background-color: var(--cx-color-danger-50);
    border-color: var(--cx-color-danger-200);
    color: var(--cx-color-danger-800);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--cx-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--cx-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--cx-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--cx-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--cx-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--cx-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;
export {
  e as default
};
