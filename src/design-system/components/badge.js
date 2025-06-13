import { C as d, c as g } from "../chunks/custom-element.X6y1saJZ.js";
import { c as p } from "../chunks/component.styles.BLcT4bOa.js";
import { i as u, x as m } from "../chunks/lit-element.DRlPF2me.js";
import { n as s } from "../chunks/property.CtZ87in4.js";
import { e as b } from "../chunks/class-map.Cn0czwWq.js";
const v = u`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size, var(--cx-font-size-small));
    font-weight: var(--cx-font-weight-medium);
    letter-spacing: var(--cx-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--cx-border-radius-small);
    border: solid 1px var(--cx-color-neutral-0);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
    line-height: normal;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--cx-color-primary-600);
    border-color: var(--cx-color-primary-600);
    color: var(--cx-color-neutral-0);
  }

  .badge--success {
    background-color: var(--cx-color-success-600);
    border-color: var(--cx-color-success-600);
    color: var(--cx-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--cx-color-neutral-100);
    border-color: var(--cx-color-neutral-100);
    color: var(--cx-color-neutral);
  }

  .badge--warning {
    background-color: var(--cx-color-warning-600);
    border-color: var(--cx-color-warning-600);
    color: var(--cx-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--cx-color-danger-600);
    border-color: var(--cx-color-danger-600);
    color: var(--cx-color-danger-0);
  }

  /* Size modifiers */
  .badge--small {
    padding: var(--cx-spacing-2x-small) var(--cx-spacing-x-small);
    height: var(--cx-input-height-small);
    min-width: var(--cx-input-height-small);
  }

  .badge--medium {
    padding: var(--cx-spacing-x-small) var(--cx-spacing-small);
    height: var(--cx-input-height-medium);
    min-width: var(--cx-input-height-medium);
  }

  .badge--large {
    padding: var(--cx-spacing-small) var(--cx-spacing-medium);
    height: var(--cx-input-height-large);
    min-width: var(--cx-input-height-large);
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
var x = Object.defineProperty, h = Object.getOwnPropertyDescriptor, a = (n, o, i, l) => {
  for (var r = l > 1 ? void 0 : l ? h(o, i) : o, t = n.length - 1, c; t >= 0; t--)
    (c = n[t]) && (r = (l ? c(o, i, r) : c(r)) || r);
  return l && r && x(o, i, r), r;
};
let e = class extends d {
  constructor() {
    super(...arguments), this.variant = "primary", this.pill = !1, this.pulse = !1, this.size = "medium";
  }
  render() {
    return m`
      <span
        part="base"
        class=${b({
      badge: !0,
      "badge--danger": this.variant === "danger",
      "badge--large": this.size === "large",
      "badge--medium": this.size === "medium",
      "badge--neutral": this.variant === "neutral",
      "badge--pill": this.pill,
      "badge--primary": this.variant === "primary",
      "badge--pulse": this.pulse,
      "badge--small": this.size === "small",
      "badge--success": this.variant === "success",
      "badge--warning": this.variant === "warning"
    })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
  }
};
e.styles = [p, v];
a([
  s({ reflect: !0 })
], e.prototype, "variant", 2);
a([
  s({ reflect: !0, type: Boolean })
], e.prototype, "pill", 2);
a([
  s({ reflect: !0, type: Boolean })
], e.prototype, "pulse", 2);
a([
  s({ reflect: !0 })
], e.prototype, "size", 2);
e = a([
  g("cx-badge")
], e);
export {
  e as default
};
