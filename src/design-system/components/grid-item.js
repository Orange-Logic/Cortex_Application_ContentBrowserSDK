import { C as m, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { w as x } from "../chunks/watch.ChG-_stu.js";
import { i as h, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
function v(t) {
  return t.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/(\s+|_)/g, "-").toLowerCase().replace(/^-+|-+$/g, "");
}
function f(t) {
  return t.split(/[\s_-]+/).map(
    (r, i) => i === 0 ? r.toLowerCase() : r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()
  ).join("");
}
const w = (t) => {
  const r = t.match(/^[-]+/), i = t.replace(/^-+/, ""), s = v(i);
  return r ? r[0] + s : s;
}, y = (t, r = !1) => {
  if (!t) return {};
  const i = {};
  return t.trim().split(";").filter((s) => !!s).forEach((s) => {
    const e = s.trim().split(":"), a = r ? f(e[0]) : e[0], l = e[1];
    l && (i[a] = l.trim());
  }), i;
}, b = (t, r = !1) => {
  let i = "";
  return (r ? Object.keys(t).sort((e, a) => e.localeCompare(a)) : Object.keys(t)).forEach((e) => {
    i += `${w(e)}:${t[e]};`;
  }), i;
}, C = h`
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

  .grid-item--fill {
    height: 100%;
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
var _ = Object.defineProperty, O = Object.getOwnPropertyDescriptor, c = (t, r, i, s) => {
  for (var e = s > 1 ? void 0 : s ? O(r, i) : r, a = t.length - 1, l; a >= 0; a--)
    (l = t[a]) && (e = (s ? l(r, i, e) : l(e)) || e);
  return s && e && _(r, i, e), e;
};
let o = class extends m {
  constructor() {
    super(...arguments), this.xs = 12, this.sm = null, this.md = null, this.lg = null, this.xl = null, this.useContainer = !1, this.fill = !1;
  }
  handleXsChange() {
    const t = y(this.getAttribute("style") || "");
    t["--cx-grid-item-xs"] = this.xs, t["--cx-grid-item-sm"] = this.sm || this.xs, t["--cx-grid-item-md"] = this.md || this.sm || this.xs, t["--cx-grid-item-lg"] = this.lg || this.md || this.sm || this.xs, t["--cx-grid-item-xl"] = this.xl || this.lg || this.md || this.sm || this.xs, this.setAttribute("style", b(t));
  }
  render() {
    return g`<div
      class=${p({
      "grid-item": !0,
      "grid-item--fill": this.fill
    })}
      part="base"
    >
      <slot part="content"></slot>
    </div>`;
  }
};
o.styles = [d, C];
c([
  n({ reflect: !0 })
], o.prototype, "xs", 2);
c([
  n({ reflect: !0 })
], o.prototype, "sm", 2);
c([
  n({ reflect: !0 })
], o.prototype, "md", 2);
c([
  n({ reflect: !0 })
], o.prototype, "lg", 2);
c([
  n({ reflect: !0 })
], o.prototype, "xl", 2);
c([
  n({ attribute: "use-container", reflect: !0, type: Boolean })
], o.prototype, "useContainer", 2);
c([
  n({ reflect: !0, type: Boolean })
], o.prototype, "fill", 2);
c([
  x(["xs", "sm", "md", "lg", "xl"])
], o.prototype, "handleXsChange", 1);
o = c([
  u("cx-grid-item")
], o);
export {
  o as default
};
