import { C as d } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { r as f } from "../chunks/state.-o_YRGMi.js";
import { e as p } from "../chunks/query.BNveAlQo.js";
import { e as m } from "../chunks/class-map.Cn0czwWq.js";
import { o as s } from "../chunks/if-defined.D8U9hdvp.js";
import { i as u, u as y } from "../chunks/static.C35JqlCk.js";
import $ from "./icon.component.js";
import v from "./icon-button.styles.js";
var g = Object.defineProperty, i = (c, t, n, z) => {
  for (var r = void 0, l = c.length - 1, h; l >= 0; l--)
    (h = c[l]) && (r = h(t, n, r) || r);
  return r && g(t, n, r), r;
};
const a = class a extends d {
  constructor() {
    super(...arguments), this.hasFocus = !1, this.variant = "outlined", this.label = "", this.disabled = !1, this.iconClass = "", this.size = "medium", this.outline = !1, this.circle = !1;
  }
  firstUpdated() {
    this.syncStyles(), new MutationObserver(() => this.syncStyles()).observe(this, {
      attributeFilter: ["style"],
      attributes: !0
    });
  }
  syncStyles() {
    const t = this.style.fontSize;
    t && this.button && (this.icon.style.setProperty("--font-size", t), this.button.style.fontSize = "inherit", this.style.fontSize = "");
  }
  handleBlur() {
    this.hasFocus = !1, this.emit("cx-blur");
  }
  handleFocus() {
    this.hasFocus = !0, this.emit("cx-focus");
  }
  handleClick(t) {
    this.disabled && (t.preventDefault(), t.stopPropagation());
  }
  /** Simulates a click on the icon button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the icon button. */
  focus(t) {
    this.button.focus(t);
  }
  /** Removes focus from the icon button. */
  blur() {
    this.button.blur();
  }
  render() {
    const t = !!this.href, n = t ? u`a` : u`button`;
    return y`
      <${n}
        part="base"
        class=${m({
      "icon-button": !0,
      "icon-button--circle": this.circle,
      "icon-button--custom": !!this.src,
      "icon-button--disabled": !t && this.disabled,
      "icon-button--focused": this.hasFocus,
      "icon-button--large": this.size === "large",
      "icon-button--medium": this.size === "medium",
      "icon-button--outline": this.outline,
      "icon-button--small": this.size === "small",
      "icon-button--x-large": this.size === "x-large"
    })}
        ?disabled=${s(t ? void 0 : this.disabled)}
        type=${s(t ? void 0 : "button")}
        href=${s(t ? this.href : void 0)}
        target=${s(t ? this.target : void 0)}
        download=${s(t ? this.download : void 0)}
        rel=${s(
      t && this.target ? "noreferrer noopener" : void 0
    )}
        role=${s(t ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-label="${this.label}"
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <cx-icon
          class="icon-button__icon"
          icon-class=${s(this.iconClass)}
          name=${s(this.name)}
          variant=${this.variant}
          src=${s(this.src)}
          aria-hidden="true"
          part="icon"
        ></cx-icon>
      </${n}>
    `;
  }
};
a.styles = [b, v], a.dependencies = { "cx-icon": $ };
let e = a;
i([
  p(".icon-button")
], e.prototype, "button");
i([
  p(".icon-button__icon")
], e.prototype, "icon");
i([
  f()
], e.prototype, "hasFocus");
i([
  o()
], e.prototype, "name");
i([
  o({ type: String })
], e.prototype, "variant");
i([
  o()
], e.prototype, "src");
i([
  o()
], e.prototype, "href");
i([
  o()
], e.prototype, "target");
i([
  o()
], e.prototype, "download");
i([
  o()
], e.prototype, "label");
i([
  o({ reflect: !0, type: Boolean })
], e.prototype, "disabled");
i([
  o({ attribute: "icon-class", type: String })
], e.prototype, "iconClass");
i([
  o({ reflect: !0 })
], e.prototype, "size");
i([
  o({ reflect: !0, type: Boolean })
], e.prototype, "outline");
i([
  o({ reflect: !0, type: Boolean })
], e.prototype, "circle");
export {
  e as default
};
