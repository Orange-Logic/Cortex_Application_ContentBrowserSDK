import { C as c } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { x as p } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { e as u } from "../chunks/class-map.Cn0czwWq.js";
import { L as v } from "../chunks/localize.DV9I313e.js";
import f from "./icon-button.component.js";
import g from "./tag.styles.js";
var b = Object.defineProperty, s = (o, l, n, d) => {
  for (var t = void 0, i = o.length - 1, m; i >= 0; i--)
    (m = o[i]) && (t = m(l, n, t) || t);
  return t && b(l, n, t), t;
};
const r = class r extends c {
  constructor() {
    super(...arguments), this.localize = new v(this), this.variant = "neutral", this.size = "medium", this.pill = !1, this.removable = !1;
  }
  handleRemoveClick() {
    this.emit("cx-remove");
  }
  render() {
    return p`
      <span
        part="base"
        class=${u({
      tag: !0,
      "tag--danger": this.variant === "danger",
      "tag--large": this.size === "large",
      "tag--medium": this.size === "medium",
      "tag--neutral": this.variant === "neutral",
      // Modifiers
      "tag--pill": this.pill,
      "tag--primary": this.variant === "primary",
      "tag--removable": this.removable,
      // Sizes
      "tag--small": this.size === "small",
      "tag--success": this.variant === "success",
      "tag--text": this.variant === "text",
      "tag--warning": this.variant === "warning"
    })}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable ? p`
              <cx-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="close"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></cx-icon-button>
            ` : ""}
      </span>
    `;
  }
};
r.styles = [h, g], r.dependencies = { "cx-icon-button": f };
let e = r;
s([
  a({ reflect: !0 })
], e.prototype, "variant");
s([
  a({ reflect: !0 })
], e.prototype, "size");
s([
  a({ reflect: !0, type: Boolean })
], e.prototype, "pill");
s([
  a({ type: Boolean })
], e.prototype, "removable");
export {
  e as default
};
