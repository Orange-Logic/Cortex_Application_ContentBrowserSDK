import { C as d, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { i as b, x as c } from "../chunks/lit-element.DRlPF2me.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { e as g } from "../chunks/class-map.Cn0czwWq.js";
import { o as u } from "../chunks/if-defined.D8U9hdvp.js";
import { o as v } from "../chunks/style-map.De8UQbPP.js";
import { L as f } from "../chunks/localize.D5Yoww6T.js";
const w = b`
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
var x = Object.defineProperty, y = Object.getOwnPropertyDescriptor, t = (p, o, s, a) => {
  for (var r = a > 1 ? void 0 : a ? y(o, s) : o, l = p.length - 1, n; l >= 0; l--)
    (n = p[l]) && (r = (a ? n(o, s, r) : n(r)) || r);
  return a && r && x(o, s, r), r;
};
let e = class extends d {
  constructor() {
    super(...arguments), this.localize = new f(this), this.value = 0, this.indeterminate = !1, this.label = "", this.showProgress = "";
  }
  render() {
    return c`
      <div part="container" class="container">
        <div part="label" class="progress-bar-label">
          <span>${this.label}</span>
          ${this.showProgress ? c`<span>${this.value || 0}%</span>` : ""}
        </div>
        <div
          part="base"
          class=${g({
      "progress-bar": !0,
      "progress-bar--indeterminate": this.indeterminate,
      "progress-bar--rtl": this.localize.dir() === "rtl"
    })}
          role="progressbar"
          title=${u(this.title)}
          aria-label=${this.label.length > 0 ? this.label : this.localize.term("progress")}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${this.indeterminate ? 0 : this.value}
        >
          <div
            part="indicator"
            class="progress-bar__indicator"
            style=${v({ width: `${this.value || 0}%` })}
          >
            ${this.indeterminate ? "" : c` <slot part="label" class="progress-bar__label"></slot> `}
          </div>
        </div>
      </div>
    `;
  }
};
e.styles = [h, w];
t([
  i({ reflect: !0, type: Number })
], e.prototype, "value", 2);
t([
  i({ reflect: !0, type: Boolean })
], e.prototype, "indeterminate", 2);
t([
  i({ reflect: !0, type: String })
], e.prototype, "label", 2);
t([
  i({ attribute: "show-progress", reflect: !0, type: Boolean })
], e.prototype, "showProgress", 2);
e = t([
  m("cx-progress-bar")
], e);
export {
  e as default
};
