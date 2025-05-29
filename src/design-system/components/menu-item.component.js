import { C as m } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as b } from "../chunks/component.styles.BLcT4bOa.js";
import { H as f, g as y } from "../chunks/slot.DJLm4Dig.js";
import { w as c } from "../chunks/watch.ChG-_stu.js";
import { x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { e as d } from "../chunks/query.BNveAlQo.js";
import { e as x } from "../chunks/class-map.Cn0czwWq.js";
import { L as C } from "../chunks/localize.DV9I313e.js";
import v from "./icon.component.js";
import k from "./popup.component.js";
import g from "./spinner.component.js";
import _ from "./menu-item.styles.js";
import { SubmenuController as S } from "./submenu-controller.js";
var L = Object.defineProperty, D = Object.getOwnPropertyDescriptor, s = (p, e, o, r) => {
  for (var n = r > 1 ? void 0 : r ? D(e, o) : e, l = p.length - 1, h; l >= 0; l--)
    (h = p[l]) && (n = (r ? h(e, o, n) : h(n)) || n);
  return r && n && L(e, o, n), n;
};
const a = class a extends m {
  constructor() {
    super(...arguments), this.type = "normal", this.checked = !1, this.value = "", this.loading = !1, this.disabled = !1, this.readonly = !1, this.localize = new C(this), this.hasSlotController = new f(this, "submenu"), this.submenuController = new S(
      this,
      this.hasSlotController
    ), this.handleDocumentWheel = (e) => {
      const o = e.composedPath();
      this.submenuController.isExpanded() && (!this.submenuController.popup || !o.includes(this.submenuController.popup)) && (e.preventDefault(), this.submenuController.disableSubmenu());
    }, this.handleHostClick = (e) => {
      (this.disabled || this.readonly) && (e.preventDefault(), e.stopImmediatePropagation());
    }, this.handleMouseOver = (e) => {
      e.stopPropagation();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("click", this.handleHostClick), this.addEventListener("mouseover", this.handleMouseOver), document.addEventListener("wheel", this.handleDocumentWheel, {
      passive: !1
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("click", this.handleHostClick), this.removeEventListener("mouseover", this.handleMouseOver), document.removeEventListener("wheel", this.handleDocumentWheel);
  }
  handleDefaultSlotChange() {
    const e = this.getTextLabel();
    if (typeof this.cachedTextLabel > "u") {
      this.cachedTextLabel = e;
      return;
    }
    e !== this.cachedTextLabel && (this.cachedTextLabel = e, this.emit("slotchange", {
      bubbles: !0,
      cancelable: !1,
      composed: !1
    }));
  }
  handleCheckedChange() {
    if (this.checked && this.type !== "checkbox") {
      this.checked = !1, console.error(
        'The checked attribute can only be used on menu items with type="checkbox"',
        this
      );
      return;
    }
    this.type === "checkbox" ? this.setAttribute("aria-checked", this.checked ? "true" : "false") : this.removeAttribute("aria-checked");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  handleTypeChange() {
    this.type === "checkbox" ? (this.setAttribute("role", "menuitemcheckbox"), this.setAttribute("aria-checked", this.checked ? "true" : "false")) : (this.setAttribute("role", "menuitem"), this.removeAttribute("aria-checked"));
  }
  /** Returns a text label based on the contents of the menu item's default slot. */
  getTextLabel() {
    return y(this.defaultSlot);
  }
  isSubmenu() {
    return this.hasSlotController.test("submenu");
  }
  render() {
    const e = this.localize.dir() === "rtl", o = this.submenuController.isExpanded();
    return u`
      <div
        id="anchor"
        part="base"
        class=${x({
      "menu-item": !0,
      "menu-item--checked": this.checked,
      "menu-item--disabled": this.disabled,
      "menu-item--has-submenu": this.isSubmenu(),
      "menu-item--loading": this.loading,
      "menu-item--rtl": e,
      "menu-item--submenu-expanded": o
    })}
        aria-haspopup="${this.isSubmenu()}"
      >
        <span part="checked-icon" class="menu-item__check">
          <cx-icon name="check"></cx-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot
          part="label"
          class="menu-item__label"
          @slotchange=${this.handleDefaultSlotChange}
        ></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <cx-icon
            name=${e ? "chevron_left" : "chevron_right"}
            aria-hidden="true"
          ></cx-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading ? u`
              <cx-spinner
                part="spinner"
                exportparts="base:spinner__base"
              ></cx-spinner>
            ` : ""}
      </div>
    `;
  }
};
a.styles = [b, _], a.dependencies = {
  "cx-icon": v,
  "cx-popup": k,
  "cx-spinner": g
};
let t = a;
s([
  d("slot:not([name])")
], t.prototype, "defaultSlot", 2);
s([
  d(".menu-item")
], t.prototype, "menuItem", 2);
s([
  i()
], t.prototype, "type", 2);
s([
  i({ reflect: !0, type: Boolean })
], t.prototype, "checked", 2);
s([
  i()
], t.prototype, "value", 2);
s([
  i({ reflect: !0, type: Boolean })
], t.prototype, "loading", 2);
s([
  i({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
s([
  i({ reflect: !0, type: Boolean })
], t.prototype, "readonly", 2);
s([
  i({ attribute: !1, type: Object })
], t.prototype, "flipBoundary", 2);
s([
  i({ attribute: !1, type: Object })
], t.prototype, "shiftBoundary", 2);
s([
  c("checked")
], t.prototype, "handleCheckedChange", 1);
s([
  c("disabled")
], t.prototype, "handleDisabledChange", 1);
s([
  c("type")
], t.prototype, "handleTypeChange", 1);
export {
  t as default
};
