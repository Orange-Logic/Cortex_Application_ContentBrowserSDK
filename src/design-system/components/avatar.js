import { C as p, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { c as m } from "../chunks/component.styles.BLcT4bOa.js";
import { w as v } from "../chunks/watch.ChG-_stu.js";
import { i as g, x as i } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { r as u } from "../chunks/state.-o_YRGMi.js";
import { e as f } from "../chunks/class-map.Cn0czwWq.js";
import _ from "./icon.js";
const x = g`
  :host {
    display: inline-block;

    --size: 3rem;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: var(--size);
    height: var(--size);
    background-color: var(--cx-color-neutral-400);
    font-family: var(--cx-font-sans);
    font-size: calc(var(--size) * 0.5);
    font-weight: var(--cx-font-weight-regular);
    color: var(--cx-color-neutral-0);
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
  }

  .avatar--circle,
  .avatar--circle .avatar__image {
    border-radius: var(--cx-border-radius-circle);
  }

  .avatar--rounded,
  .avatar--rounded .avatar__image {
    border-radius: var(--cx-border-radius-small);
  }

  .avatar--square {
    border-radius: 0;
  }

  .avatar__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .avatar__initials {
    line-height: 1;
    text-transform: uppercase;
  }

  .avatar__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`;
var b = Object.defineProperty, y = Object.getOwnPropertyDescriptor, e = (s, r, n, l) => {
  for (var t = l > 1 ? void 0 : l ? y(r, n) : r, c = s.length - 1, h; c >= 0; c--)
    (h = s[c]) && (t = (l ? h(r, n, t) : h(t)) || t);
  return l && t && b(r, n, t), t;
};
let a = class extends p {
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
    const s = i`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${this.handleImageLoadError}"
      />
    `;
    let r = i``;
    return this.initials ? r = i`<div part="initials" class="avatar__initials">${this.initials}</div>` : r = i`
        <div part="icon" class="avatar__icon" aria-hidden="true">
          <slot name="icon">
            <cx-icon name="person"></cx-icon>
          </slot>
        </div>
      `, i`
      <div
        part="base"
        class=${f({
      avatar: !0,
      "avatar--circle": this.shape === "circle",
      "avatar--rounded": this.shape === "rounded",
      "avatar--square": this.shape === "square"
    })}
        role="img"
        aria-label=${this.label}
      >
        ${this.image && !this.hasError ? s : r}
      </div>
    `;
  }
};
a.styles = [m, x];
a.dependencies = {
  "cx-icon": _
};
e([
  u()
], a.prototype, "hasError", 2);
e([
  o()
], a.prototype, "image", 2);
e([
  o()
], a.prototype, "label", 2);
e([
  o()
], a.prototype, "initials", 2);
e([
  o()
], a.prototype, "loading", 2);
e([
  o({ reflect: !0 })
], a.prototype, "shape", 2);
e([
  v("image")
], a.prototype, "handleImageChange", 1);
a = e([
  d("cx-avatar")
], a);
export {
  a as default
};
