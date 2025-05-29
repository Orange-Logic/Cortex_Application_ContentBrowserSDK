import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as y } from "../chunks/component.styles.BLcT4bOa.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { x as h } from "../chunks/lit-element.DRlPF2me.js";
import { n as c } from "../chunks/property.CtZ87in4.js";
import { r as p } from "../chunks/state.-o_YRGMi.js";
import { e as g } from "../chunks/query.BNveAlQo.js";
import u from "./icon.component.js";
import _ from "./animated-image.styles.js";
var v = Object.defineProperty, x = Object.getOwnPropertyDescriptor, a = (d, e, o, i) => {
  for (var r = i > 1 ? void 0 : i ? x(e, o) : e, n = d.length - 1, l; n >= 0; n--)
    (l = d[n]) && (r = (i ? l(e, o, r) : l(r)) || r);
  return i && r && v(e, o, r), r;
};
const s = class s extends f {
  constructor() {
    super(...arguments), this.isLoaded = !1;
  }
  handleClick() {
    this.play = !this.play;
  }
  handleLoad() {
    const e = document.createElement("canvas"), { height: o, width: i } = this.animatedImage;
    e.width = i, e.height = o, e.getContext("2d").drawImage(this.animatedImage, 0, 0, i, o), this.frozenFrame = e.toDataURL("image/gif"), this.isLoaded || (this.emit("cx-load"), this.isLoaded = !0);
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
    return h`
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

        ${this.isLoaded ? h`
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
s.styles = [y, _], s.dependencies = { "cx-icon": u };
let t = s;
a([
  g(".animated-image__animated")
], t.prototype, "animatedImage", 2);
a([
  p()
], t.prototype, "frozenFrame", 2);
a([
  p()
], t.prototype, "isLoaded", 2);
a([
  c()
], t.prototype, "src", 2);
a([
  c()
], t.prototype, "alt", 2);
a([
  c({ reflect: !0, type: Boolean })
], t.prototype, "play", 2);
a([
  m("play", { waitUntilFirstUpdate: !0 })
], t.prototype, "handlePlayChange", 1);
a([
  m("src")
], t.prototype, "handleSrcChange", 1);
export {
  t as default
};
