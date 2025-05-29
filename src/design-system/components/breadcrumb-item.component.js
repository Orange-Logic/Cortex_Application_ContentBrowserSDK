import { C as f } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { H as u } from "../chunks/slot.DJLm4Dig.js";
import { w as c } from "../chunks/watch.ChG-_stu.js";
import { x as l } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { r as _ } from "../chunks/state.-o_YRGMi.js";
import { e as y } from "../chunks/query.BNveAlQo.js";
import { e as g } from "../chunks/class-map.Cn0czwWq.js";
import { o as d } from "../chunks/if-defined.D8U9hdvp.js";
import x from "./breadcrumb-item.styles.js";
var v = Object.defineProperty, w = Object.getOwnPropertyDescriptor, s = (m, r, o, a) => {
  for (var t = a > 1 ? void 0 : a ? w(r, o) : r, i = m.length - 1, n; i >= 0; i--)
    (n = m[i]) && (t = (a ? n(r, o, t) : n(t)) || t);
  return a && t && v(r, o, t), t;
};
const h = class h extends f {
  constructor() {
    super(...arguments), this.hasSlotController = new u(
      this,
      "prefix",
      "suffix"
    ), this.renderType = "button", this.rel = "noreferrer noopener";
  }
  setRenderType() {
    const r = this.defaultSlot.assignedElements({ flatten: !0 }).filter((o) => o.tagName.toLowerCase() === "cx-dropdown").length > 0;
    if (this.href) {
      this.renderType = "link";
      return;
    }
    if (r) {
      this.renderType = "dropdown";
      return;
    }
    this.renderType = "button";
  }
  hrefChanged() {
    this.setRenderType();
  }
  handleSlotChange() {
    this.setRenderType();
  }
  render() {
    return l`
      <div
        part="base"
        class=${g({
      "breadcrumb-item": !0,
      "breadcrumb-item--has-prefix": this.hasSlotController.test("prefix"),
      "breadcrumb-item--has-suffix": this.hasSlotController.test("suffix")
    })}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${this.renderType === "link" ? l`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${d(this.target ? this.target : void 0)}"
                rel=${d(this.target ? this.rel : void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            ` : ""}
        ${this.renderType === "button" ? l`
              <button
                part="label"
                type="button"
                class="breadcrumb-item__label breadcrumb-item__label--button"
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            ` : ""}
        ${this.renderType === "dropdown" ? l`
              <div
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--drop-down"
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            ` : ""}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span
          part="separator"
          class="breadcrumb-item__separator"
          aria-hidden="true"
        >
          <slot name="separator"></slot>
        </span>
      </div>
    `;
  }
};
h.styles = [b, x];
let e = h;
s([
  y("slot:not([name])")
], e.prototype, "defaultSlot", 2);
s([
  _()
], e.prototype, "renderType", 2);
s([
  p()
], e.prototype, "href", 2);
s([
  p()
], e.prototype, "target", 2);
s([
  p()
], e.prototype, "rel", 2);
s([
  c("href", { waitUntilFirstUpdate: !0 })
], e.prototype, "hrefChanged", 1);
export {
  e as default
};
