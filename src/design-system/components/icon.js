import { C as d, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { i as y, x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as g } from "../chunks/state.-o_YRGMi.js";
import { e as b } from "../chunks/class-map.Cn0czwWq.js";
import v from "./font-awesome.style.js";
const x = y`
  :host {
    --font-size: var(--cx-font-size-large);
    display: inline-flex;
    min-width: 1em;
    min-height: 1em;
    overflow: hidden;
    box-sizing: content-box !important;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: var(--font-size);
  }

  :host:has(.icon) {
    max-width: var(--font-size, 1em);
    max-height: var(--font-size, 1em);
  }

  .icon {
    font-weight: normal;
    font-style: normal;
    line-height: inherit;
    letter-spacing: normal;
    text-transform: none;
    display: block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'liga';
    visibility: hidden;
    opacity: 0;
  }

  .icon--loaded {
    visibility: inherit;
    opacity: inherit;
  }

  .icon--outlined {
    font-family: 'Cortex Icons Outlined';
  }

  .icon--filled {
    font-family: 'Cortex Icons Filled';
  }

  .icon--round {
    font-family: 'Cortex Icons Round';
  }

  .icon--sharp {
    font-family: 'Cortex Icons Sharp';
  }

  .icon--two-tone {
    font-family: 'Cortex Icons Two Tone';
  }

  span.icon {
    display: block;
    height: 100%;
    width: 100%;
  }

  span.custom-icon {
    display: block;
    height: 1em;
    width: 1em;
  }

  span.custom-icon img {
    height: 100%;
    width: 100%;
  }
`;
var w = Object.defineProperty, C = Object.getOwnPropertyDescriptor, e = (o, a, r, s) => {
  for (var i = s > 1 ? void 0 : s ? C(a, r) : a, l = o.length - 1, c; l >= 0; l--)
    (c = o[l]) && (i = (s ? c(a, r, i) : c(i)) || i);
  return s && i && w(a, r, i), i;
};
const p = {
  filled: "Cortex Icons Filled",
  outlined: "Cortex Icons Outlined",
  round: "Cortex Icons Round",
  sharp: "Cortex Icons Sharp",
  "two-tone": "Cortex Icons Two Tone"
};
let t = class extends d {
  constructor() {
    super(...arguments), this.name = "", this.src = "", this.label = "", this.variant = "outlined", this.iconClass = "", this.fontLoaded = !1;
  }
  async checkFontLoaded() {
    await document.fonts.load(
      `16px ${p[this.variant]}`
    ), await document.fonts.ready;
    for (const o of document.fonts)
      o.family.replace(/['"]/g, "") === p[this.variant] && (this.fontLoaded = !0);
  }
  handleLabelChange() {
    typeof this.label == "string" && this.label.length > 0 ? (this.setAttribute("role", "img"), this.setAttribute("aria-label", this.label), this.removeAttribute("aria-hidden")) : (this.removeAttribute("role"), this.removeAttribute("aria-label"), this.setAttribute("aria-hidden", "true"));
  }
  render() {
    return this.src ? h`<span class="custom-icon" part="span"
        ><img src=${this.src}
      /></span>` : this.variant === "fa" ? h`<i class=${`${this.name} ${this.iconClass}`.trim()}></i>` : (this.fontLoaded || this.checkFontLoaded(), h`<span
      class=${b({
      icon: !0,
      "icon--filled": this.variant === "filled",
      "icon--loaded": this.fontLoaded,
      "icon--outlined": this.variant === "outlined",
      "icon--round": this.variant === "round",
      "icon--sharp": this.variant === "sharp",
      "icon--two-tone": this.variant === "two-tone"
    })}
      part="span"
      >${this.name}</span
    >`);
  }
};
t.styles = [f, x, v];
e([
  n({ type: String })
], t.prototype, "name", 2);
e([
  n({ type: String })
], t.prototype, "src", 2);
e([
  n({ type: String })
], t.prototype, "label", 2);
e([
  n({ type: String })
], t.prototype, "variant", 2);
e([
  n({ attribute: "icon-class", type: String })
], t.prototype, "iconClass", 2);
e([
  g()
], t.prototype, "fontLoaded", 2);
e([
  u("label")
], t.prototype, "handleLabelChange", 1);
t = e([
  m("cx-icon")
], t);
export {
  t as default
};
