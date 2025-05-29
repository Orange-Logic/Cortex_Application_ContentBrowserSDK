import { C as y } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as g } from "../chunks/component.styles.BLcT4bOa.js";
import { w as m } from "../chunks/watch.ChG-_stu.js";
import { x as c } from "../chunks/lit-element.DRlPF2me.js";
import { t as u } from "../chunks/custom-element.ttkHUa8w.js";
import { n as r } from "../chunks/property.CtZ87in4.js";
import { r as d } from "../chunks/state.-o_YRGMi.js";
import { e as p } from "../chunks/class-map.Cn0czwWq.js";
import { n as f } from "../chunks/when.CDK1Tt5Y.js";
import x from "./icon.component.js";
import b from "./skeleton.component.js";
import k from "./space.component.js";
import S from "./image.styles.js";
var $ = Object.defineProperty, C = Object.getOwnPropertyDescriptor, e = (n, i, a, s) => {
  for (var o = s > 1 ? void 0 : s ? C(i, a) : i, l = n.length - 1, h; l >= 0; l--)
    (h = n[l]) && (o = (s ? h(i, a, o) : h(o)) || o);
  return s && o && $(i, a, o), o;
};
let t = class extends y {
  constructor() {
    super(...arguments), this.isLoaded = !1, this.isError = !1, this.src = "", this.placeholder = "", this.alt = "", this.width = "", this.height = "", this.objectFit = "fill", this.skeleton = !1, this.lazy = !1, this.fallback = !1;
  }
  handleLoad() {
    this.isLoaded || (this.emit("cx-load"), this.isLoaded = !0, this.isError = !1);
  }
  handleError() {
    this.emit("cx-error"), this.isLoaded = !0, this.isError = !0;
  }
  handleSrcChange() {
    this.isLoaded = !1, this.isError = !1;
  }
  handleSizeChange() {
    this.width && this.style.setProperty("--width", this.width + "px"), this.height && this.style.setProperty("--height", this.height + "px");
  }
  render() {
    return c`<img
    part="image"
    class=${p({
      image: !0,
      [`image--${this.objectFit}`]: !0,
      "image-error": this.isError && this.fallback
    })}
    src=${this.src || this.placeholder}
    alt=${this.alt}
    crossorigin="anonymous"
    @load=${this.handleLoad}
    @error=${this.handleError}
    loading=${this.lazy ? "lazy" : "eager"}
    ></img>
    ${f(this.skeleton && !this.isLoaded && !this.isError, () => c`
        <slot name="skeleton" part="skeleton">
          <div
            class=${p({
      skeleton: !0
    })}
          >
            <cx-skeleton effect="sheen"></cx-skeleton>
          </div>
        </slot>
      `)}
    ${f(this.isError && this.fallback, () => c`
        <slot name="fallback" part="fallback">
          <cx-space
            class=${p({ fallback: !0 })}
            direction="column"
            align-items="center"
            justify-content="center"
          >
            <cx-icon name="hide_image" part="fallback-icon"> </cx-icon>
          </cx-space>
        </slot>
      `)}
    `;
  }
};
t.styles = [g, S];
t.dependencies = {
  "cx-icon": x,
  "cx-skeleton": b,
  "cx-space": k
};
e([
  d()
], t.prototype, "isLoaded", 2);
e([
  d()
], t.prototype, "isError", 2);
e([
  r({ reflect: !0, type: String })
], t.prototype, "src", 2);
e([
  r({ reflect: !0, type: String })
], t.prototype, "placeholder", 2);
e([
  r({ reflect: !0, type: String })
], t.prototype, "alt", 2);
e([
  r({ reflect: !0, type: String })
], t.prototype, "width", 2);
e([
  r({ reflect: !0, type: String })
], t.prototype, "height", 2);
e([
  r({ attribute: "object-fit", reflect: !0 })
], t.prototype, "objectFit", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "skeleton", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "lazy", 2);
e([
  r({ reflect: !0, type: Boolean })
], t.prototype, "fallback", 2);
e([
  m("src")
], t.prototype, "handleSrcChange", 1);
e([
  m(["width", "height"])
], t.prototype, "handleSizeChange", 1);
t = e([
  u("cx-image")
], t);
export {
  t as default
};
