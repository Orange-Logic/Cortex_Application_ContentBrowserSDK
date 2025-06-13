import { C as c, c as l } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { i as p, x as d } from "../chunks/lit-element.DRlPF2me.js";
import { L as h } from "../chunks/localize.D5Yoww6T.js";
const f = p`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--cx-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    max-width: 1em;
    max-height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 1em;
    width: 1em;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 0.5em 0.5em;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`;
var _ = Object.defineProperty, g = Object.getOwnPropertyDescriptor, v = (n, e, a, t) => {
  for (var r = t > 1 ? void 0 : t ? g(e, a) : e, s = n.length - 1, i; s >= 0; s--)
    (i = n[s]) && (r = (t ? i(e, a, r) : i(r)) || r);
  return t && r && _(e, a, r), r;
};
let o = class extends c {
  constructor() {
    super(...arguments), this.localize = new h(this);
  }
  render() {
    return d`
      <svg
        part="base"
        class="spinner"
        role="progressbar"
        aria-label=${this.localize.term("loading")}
      >
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
};
o.styles = [m, f];
o = v([
  l("cx-spinner")
], o);
export {
  o as default
};
