import { C as p, c as g } from "../chunks/custom-element.X6y1saJZ.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { i as f, x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { r as h } from "../chunks/state.-o_YRGMi.js";
import { e as x } from "../chunks/query.BNveAlQo.js";
import u from "./icon.js";
const v = f`
  :host {
    --control-box-size: 3rem;
    --icon-size: calc(var(--control-box-size) * 0.625);

    display: inline-flex;
    position: relative;
    cursor: pointer;
  }

  .animated-image {
    display: inline-grid;
    grid-template-columns: 1fr;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    grid-row-start: 1;
    grid-column-start: 1;
  }

  img[aria-hidden='true'] {
    visibility: hidden;
  }

  .animated-image__control-box {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    top: calc(50% - var(--control-box-size) / 2);
    right: calc(50% - var(--control-box-size) / 2);
    width: var(--control-box-size);
    height: var(--control-box-size);
    font-size: var(--icon-size);
    background: none;
    border: solid 2px currentColor;
    background-color: rgb(0 0 0 /50%);
    border-radius: var(--cx-border-radius-circle);
    color: white;
    pointer-events: none;
    transition: var(--cx-transition-fast) opacity;
  }

  :host([play]:hover) .animated-image__control-box {
    opacity: 1;
  }

  :host([play]:not(:hover)) .animated-image__control-box {
    opacity: 0;
  }

  :host([play]) slot[name='play-icon'],
  :host(:not([play])) slot[name='pause-icon'] {
    display: none;
  }
`;
var b = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, t = (a, i, r, n) => {
  for (var o = n > 1 ? void 0 : n ? _(i, r) : i, s = a.length - 1, l; s >= 0; s--)
    (l = a[s]) && (o = (n ? l(i, r, o) : l(o)) || o);
  return n && o && b(i, r, o), o;
};
let e = class extends p {
  constructor() {
    super(...arguments), this.isLoaded = !1;
  }
  handleClick() {
    this.play = !this.play;
  }
  handleLoad() {
    const a = document.createElement("canvas"), { height: i, width: r } = this.animatedImage;
    a.width = r, a.height = i, a.getContext("2d").drawImage(this.animatedImage, 0, 0, r, i), this.frozenFrame = a.toDataURL("image/gif"), this.isLoaded || (this.emit("cx-load"), this.isLoaded = !0);
  }
  handleError() {
    this.emit("cx-error");
  }
  handlePlayChange() {
    this.play && (this.animatedImage.src = "", this.animatedImage.src = this.src);
  }
  handleSrcChange() {
    this.isLoaded = !1;
  }
  render() {
    return d`
      <div class="animated-image">
        <img
          class="animated-image__animated"
          src=${this.src}
          alt=${this.alt}
          crossorigin="anonymous"
          aria-hidden=${this.play ? "false" : "true"}
          @click=${this.handleClick}
          @load=${this.handleLoad}
          @error=${this.handleError}
        />

        ${this.isLoaded ? d`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play ? "true" : "false"}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                <slot name="play-icon"
                  ><cx-icon name="play_arrow"></cx-icon
                ></slot>
                <slot name="pause-icon"><cx-icon name="pause"></cx-icon></slot>
              </div>
            ` : ""}
      </div>
    `;
  }
};
e.styles = [y, v];
e.dependencies = { "cx-icon": u };
t([
  x(".animated-image__animated")
], e.prototype, "animatedImage", 2);
t([
  h()
], e.prototype, "frozenFrame", 2);
t([
  h()
], e.prototype, "isLoaded", 2);
t([
  c()
], e.prototype, "src", 2);
t([
  c()
], e.prototype, "alt", 2);
t([
  c({ reflect: !0, type: Boolean })
], e.prototype, "play", 2);
t([
  m("play", { waitUntilFirstUpdate: !0 })
], e.prototype, "handlePlayChange", 1);
t([
  m("src")
], e.prototype, "handleSrcChange", 1);
e = t([
  g("cx-animated-image")
], e);
export {
  e as default
};
