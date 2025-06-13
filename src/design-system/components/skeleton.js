import { C as c, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { c as p } from "../chunks/component.styles.BLcT4bOa.js";
import { i as u, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as m } from "../chunks/property.CtZ87in4.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
const h = u`
  :host {
    --border-radius: var(--cx-border-radius-pill);
    --color: var(--cx-color-neutral-200);
    --sheen-color: var(--cx-color-neutral-300);

    display: block;
    position: relative;
  }

  .skeleton {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 1rem;
  }

  .skeleton__indicator {
    flex: 1 1 auto;
    background: var(--color);
    border-radius: var(--border-radius);
  }

  .skeleton--sheen .skeleton__indicator {
    background: linear-gradient(
      270deg,
      var(--sheen-color),
      var(--color),
      var(--color),
      var(--sheen-color)
    );
    background-size: 400% 100%;
    animation: sheen 8s ease-in-out infinite;
  }

  .skeleton--pulse .skeleton__indicator {
    animation: pulse 2s ease-in-out 0.5s infinite;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    :host {
      --color: GrayText;
    }
  }

  @keyframes sheen {
    0% {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`;
var k = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, l = (a, o, s, r) => {
  for (var e = r > 1 ? void 0 : r ? _(o, s) : o, n = a.length - 1, i; n >= 0; n--)
    (i = a[n]) && (e = (r ? i(o, s, e) : i(e)) || e);
  return r && e && k(o, s, e), e;
};
let t = class extends c {
  constructor() {
    super(...arguments), this.effect = "none";
  }
  render() {
    return f`
      <div
        part="base"
        class=${v({
      skeleton: !0,
      "skeleton--pulse": this.effect === "pulse",
      "skeleton--sheen": this.effect === "sheen"
    })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
};
t.styles = [p, h];
l([
  m()
], t.prototype, "effect", 2);
t = l([
  d("cx-skeleton")
], t);
export {
  t as default
};
