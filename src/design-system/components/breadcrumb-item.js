import { C as b, c as d } from "../chunks/custom-element.X6y1saJZ.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { H as h } from "../chunks/slot.DJLm4Dig.js";
import { w as u } from "../chunks/watch.ChG-_stu.js";
import { i as x, x as s } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { r as _ } from "../chunks/state.-o_YRGMi.js";
import { e as g } from "../chunks/query.BNveAlQo.js";
import { e as y } from "../chunks/class-map.Cn0czwWq.js";
import { o as c } from "../chunks/if-defined.D8U9hdvp.js";
const v = x`
  :host {
    display: inline-flex;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-small);
    font-weight: var(--cx-font-weight-semibold);
    color: var(--cx-color-neutral);
    line-height: var(--cx-line-height-large);
    white-space: nowrap;
  }

  .breadcrumb-item__label {
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-decoration: none;
    color: inherit;
    background: none;
    border: none;
    border-radius: var(--cx-border-radius-small);
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: var(--cx-transition-fast) --color;
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label {
    color: var(--cx-color-primary);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:hover {
    color: var(--cx-color-primary-600);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:active {
    color: var(--cx-color-primary-600);
  }

  .breadcrumb-item__label:focus {
    outline: none;
  }

  .breadcrumb-item__label:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .breadcrumb-item__prefix,
  .breadcrumb-item__suffix {
    display: none;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .breadcrumb-item--has-prefix .breadcrumb-item__prefix {
    display: inline-flex;
    margin-inline-end: var(--cx-spacing-x-small);
  }

  .breadcrumb-item--has-suffix .breadcrumb-item__suffix {
    display: inline-flex;
    margin-inline-start: var(--cx-spacing-x-small);
  }

  :host(:last-of-type) .breadcrumb-item__separator {
    display: none;
  }

  .breadcrumb-item__separator {
    display: inline-flex;
    align-items: center;
    margin: 0 var(--cx-spacing-x-small);
    user-select: none;
    -webkit-user-select: none;
  }
`;
var w = Object.defineProperty, C = Object.getOwnPropertyDescriptor, t = (i, a, l, o) => {
  for (var r = o > 1 ? void 0 : o ? C(a, l) : a, n = i.length - 1, m; n >= 0; n--)
    (m = i[n]) && (r = (o ? m(a, l, r) : m(r)) || r);
  return o && r && w(a, l, r), r;
};
let e = class extends b {
  constructor() {
    super(...arguments), this.hasSlotController = new h(
      this,
      "prefix",
      "suffix"
    ), this.renderType = "button", this.rel = "noreferrer noopener";
  }
  setRenderType() {
    const i = this.defaultSlot.assignedElements({ flatten: !0 }).filter((a) => a.tagName.toLowerCase() === "cx-dropdown").length > 0;
    if (this.href) {
      this.renderType = "link";
      return;
    }
    if (i) {
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
    return s`
      <div
        part="base"
        class=${y({
      "breadcrumb-item": !0,
      "breadcrumb-item--has-prefix": this.hasSlotController.test("prefix"),
      "breadcrumb-item--has-suffix": this.hasSlotController.test("suffix")
    })}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${this.renderType === "link" ? s`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${c(this.target ? this.target : void 0)}"
                rel=${c(this.target ? this.rel : void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            ` : ""}
        ${this.renderType === "button" ? s`
              <button
                part="label"
                type="button"
                class="breadcrumb-item__label breadcrumb-item__label--button"
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            ` : ""}
        ${this.renderType === "dropdown" ? s`
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
e.styles = [f, v];
t([
  g("slot:not([name])")
], e.prototype, "defaultSlot", 2);
t([
  _()
], e.prototype, "renderType", 2);
t([
  p()
], e.prototype, "href", 2);
t([
  p()
], e.prototype, "target", 2);
t([
  p()
], e.prototype, "rel", 2);
t([
  u("href", { waitUntilFirstUpdate: !0 })
], e.prototype, "hrefChanged", 1);
e = t([
  d("cx-breadcrumb-item")
], e);
export {
  e as default
};
