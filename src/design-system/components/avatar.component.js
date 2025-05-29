import { C as c } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as d } from "../chunks/component.styles.BLcT4bOa.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { x as s } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { r as f } from "../chunks/state.-o_YRGMi.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import u from "./icon.component.js";
import y from "./avatar.styles.js";
var _ = Object.defineProperty, E = Object.getOwnPropertyDescriptor, e = (m, i, a, l) => {
  for (var t = l > 1 ? void 0 : l ? E(i, a) : i, n = m.length - 1, p; n >= 0; n--)
    (p = m[n]) && (t = (l ? p(i, a, t) : p(t)) || t);
  return l && t && _(i, a, t), t;
};
const h = class h extends c {
  constructor() {
    super(...arguments), this.hasError = !1, this.image = "", this.label = "", this.initials = "", this.loading = "eager", this.shape = "circle";
  }
  handleImageChange() {
    this.hasError = !1;
  }
  handleImageLoadError() {
    this.hasError = !0, this.emit("cx-error");
  }
  render() {
    const i = s`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${this.handleImageLoadError}"
      />
    `;
    let a = s``;
    return this.initials ? a = s`<div part="initials" class="avatar__initials">${this.initials}</div>` : a = s`
        <div part="icon" class="avatar__icon" aria-hidden="true">
          <slot name="icon">
            <cx-icon name="person"></cx-icon>
          </slot>
        </div>
      `, s`
      <div
        part="base"
        class=${v({
      avatar: !0,
      "avatar--circle": this.shape === "circle",
      "avatar--rounded": this.shape === "rounded",
      "avatar--square": this.shape === "square"
    })}
        role="img"
        aria-label=${this.label}
      >
        ${this.image && !this.hasError ? i : a}
      </div>
    `;
  }
};
h.styles = [d, y], h.dependencies = {
  "cx-icon": u
};
let r = h;
e([
  f()
], r.prototype, "hasError", 2);
e([
  o()
], r.prototype, "image", 2);
e([
  o()
], r.prototype, "label", 2);
e([
  o()
], r.prototype, "initials", 2);
e([
  o()
], r.prototype, "loading", 2);
e([
  o({ reflect: !0 })
], r.prototype, "shape", 2);
e([
  g("image")
], r.prototype, "handleImageChange", 1);
export {
  r as default
};
