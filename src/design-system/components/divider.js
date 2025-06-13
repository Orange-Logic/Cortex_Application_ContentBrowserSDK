import { C as c, c as p } from "../chunks/custom-element.X6y1saJZ.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { w as v } from "../chunks/watch.ChG-_stu.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { i as g } from "../chunks/lit-element.DRlPF2me.js";
import { DividerVariant as m } from "./divider.types.js";
const f = g`
  :host {
    --color: var(--cx-panel-border-color);
    --width: var(--cx-panel-border-width);
    --spacing: var(--cx-spacing-medium);
    --border-style: solid;
    --padding: var(--spacing);
    --max-width: 100%;
    --dash-width: 4px;
    --dash-spacing: 4px;
  }

  :host(:not([vertical])) {
    display: block;
    padding: var(--spacing) 0;
  }

  :host(:not([vertical]))::after {
    display: block;
    content: ' ';
    border-top: solid var(--width) var(--color);
    max-width: var(--max-width, 100%);
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    padding: 0 var(--spacing);
  }

  :host([use-padding]) {
    padding: var(--padding);
  }

  :host([vertical])::after {
    display: inline-block;
    content: ' ';
    height: 100%;
    border-left: solid var(--width) var(--color);
  }

  :host([variant='custom'])::after {
    border-image: repeating-linear-gradient(
      to right,
      var(--color) 0,
      var(--color) var(--dash-width),
      transparent var(--dash-width),
      transparent calc(var(--dash-width) + var(--dash-spacing))
    );
    border-image-slice: 1;
  }
`;
var u = Object.defineProperty, b = Object.getOwnPropertyDescriptor, a = (d, e, o, i) => {
  for (var t = i > 1 ? void 0 : i ? b(e, o) : e, s = d.length - 1, l; s >= 0; s--)
    (l = d[s]) && (t = (i ? l(e, o, t) : l(t)) || t);
  return i && t && u(e, o, t), t;
};
let r = class extends c {
  constructor() {
    super(...arguments), this.vertical = !1, this.variant = m.Solid, this.usePadding = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "separator");
  }
  handleVerticalChange() {
    this.setAttribute(
      "aria-orientation",
      this.vertical ? "vertical" : "horizontal"
    );
  }
};
r.styles = [h, f];
a([
  n({ reflect: !0, type: Boolean })
], r.prototype, "vertical", 2);
a([
  n({ reflect: !0, type: String })
], r.prototype, "variant", 2);
a([
  n({ attribute: "use-padding", reflect: !0, type: Boolean })
], r.prototype, "usePadding", 2);
a([
  v("vertical")
], r.prototype, "handleVerticalChange", 1);
r = a([
  p("cx-divider")
], r);
export {
  m as DividerVariant,
  r as default
};
