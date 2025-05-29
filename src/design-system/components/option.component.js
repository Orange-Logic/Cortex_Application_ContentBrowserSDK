import { C as u } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as f } from "../chunks/component.styles.BLcT4bOa.js";
import { w as c } from "../chunks/watch.ChG-_stu.js";
import { x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { r as p } from "../chunks/state.-o_YRGMi.js";
import { e as m } from "../chunks/query.BNveAlQo.js";
import { e as v } from "../chunks/class-map.Cn0czwWq.js";
import { L as y } from "../chunks/localize.DV9I313e.js";
import x from "./icon.component.js";
import C from "./option.styles.js";
var _ = Object.defineProperty, g = Object.getOwnPropertyDescriptor, a = (d, t, o, s) => {
  for (var l = s > 1 ? void 0 : s ? g(t, o) : t, i = d.length - 1, h; i >= 0; i--)
    (h = d[i]) && (l = (s ? h(t, o, l) : h(l)) || l);
  return s && l && _(t, o, l), l;
};
const r = class r extends u {
  constructor() {
    super(...arguments), this.localize = new y(this), this.current = !1, this.selected = !1, this.hasHover = !1, this.value = "", this.disabled = !1, this.showCheck = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "option"), this.setAttribute("aria-selected", "false");
  }
  handleDefaultSlotChange() {
    const t = this.getTextLabel();
    if (typeof this.cachedTextLabel > "u") {
      this.cachedTextLabel = t;
      return;
    }
    t !== this.cachedTextLabel && (this.cachedTextLabel = t, this.emit("slotchange", {
      bubbles: !0,
      cancelable: !1,
      composed: !1
    }));
  }
  handleMouseEnter() {
    this.hasHover = !0;
  }
  handleMouseLeave() {
    this.hasHover = !1;
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleSelectedChange() {
    this.setAttribute("aria-selected", this.selected ? "true" : "false");
  }
  handleValueChange() {
    typeof this.value != "string" && (this.value = String(this.value)), this.value.includes(" ") && (console.error(
      "Option values cannot include a space. All spaces have been replaced with underscores.",
      this
    ), this.value = this.value.replace(/ /g, "_"));
  }
  /** Returns a plain text label based on the option's content. */
  getTextLabel() {
    const t = this.childNodes;
    let o = "";
    return [...t].forEach((s) => {
      s.nodeType === Node.ELEMENT_NODE && (s.hasAttribute("slot") || (o += s.textContent)), s.nodeType === Node.TEXT_NODE && (o += s.textContent);
    }), o.trim();
  }
  render() {
    return b`
      <div
        part="base"
        class=${v({
      option: !0,
      "option--current": this.current,
      "option--disabled": this.disabled,
      "option--hover": this.hasHover,
      "option--selected": this.selected,
      "option--show-check": this.showCheck
    })}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <cx-icon
          part="checked-icon"
          class="option__check"
          name="check"
          library="system"
          aria-hidden="true"
        ></cx-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot
          part="label"
          class="option__label"
          @slotchange=${this.handleDefaultSlotChange}
        ></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `;
  }
};
r.styles = [f, C], r.dependencies = { "cx-icon": x };
let e = r;
a([
  m(".option__label")
], e.prototype, "defaultSlot", 2);
a([
  p()
], e.prototype, "current", 2);
a([
  p()
], e.prototype, "selected", 2);
a([
  p()
], e.prototype, "hasHover", 2);
a([
  n({ reflect: !0 })
], e.prototype, "value", 2);
a([
  n({ reflect: !0, type: Boolean })
], e.prototype, "disabled", 2);
a([
  n({ attribute: "show-check", reflect: !0, type: Boolean })
], e.prototype, "showCheck", 2);
a([
  c("disabled")
], e.prototype, "handleDisabledChange", 1);
a([
  c("selected")
], e.prototype, "handleSelectedChange", 1);
a([
  c("value")
], e.prototype, "handleValueChange", 1);
export {
  e as default
};
