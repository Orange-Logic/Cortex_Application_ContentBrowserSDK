import { C as c, c as u } from "../chunks/custom-element.X6y1saJZ.js";
import { c as p } from "../chunks/component.styles.BLcT4bOa.js";
import { w as l } from "../chunks/watch.ChG-_stu.js";
import { i as b, x as f } from "../chunks/lit-element.DRlPF2me.js";
import { n as o } from "../chunks/property.CtZ87in4.js";
import { e as v } from "../chunks/query.BNveAlQo.js";
const O = b`
  :host {
    display: contents;
  }
`;
var m = Object.defineProperty, y = Object.getOwnPropertyDescriptor, a = (r, i, n, s) => {
  for (var e = s > 1 ? void 0 : s ? y(i, n) : i, h = r.length - 1, d; h >= 0; h--)
    (d = r[h]) && (e = (s ? d(i, n, e) : d(e)) || e);
  return s && e && m(i, n, e), e;
};
let t = class extends c {
  constructor() {
    super(...arguments), this.attrOldValue = !1, this.charData = !1, this.charDataOldValue = !1, this.childList = !1, this.disabled = !1, this.handleMutation = (r) => {
      this.emit("cx-mutation", {
        detail: { mutationList: r }
      });
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.mutationObserver = new MutationObserver(this.handleMutation), this.disabled || this.startObserver();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.stopObserver();
  }
  startObserver() {
    var s;
    const r = typeof this.attr == "string" && this.attr.length > 0, i = r && this.attr !== "*" ? this.attr.split(" ") : void 0;
    (((s = this.mutationSlot) == null ? void 0 : s.assignedNodes({ flatten: !0 })) || []).forEach((e) => {
      if (e.nodeType === Node.ELEMENT_NODE)
        try {
          this.mutationObserver.observe(e, {
            attributeFilter: i,
            attributeOldValue: this.attrOldValue,
            attributes: r,
            characterData: this.charData,
            characterDataOldValue: this.charDataOldValue,
            childList: this.childList,
            subtree: !0
          });
        } catch {
        }
    });
  }
  stopObserver() {
    this.mutationObserver.disconnect();
  }
  handleDisabledChange() {
    this.disabled ? this.stopObserver() : this.startObserver();
  }
  handleSlotChange() {
    this.stopObserver(), this.startObserver();
  }
  handleChange() {
    this.stopObserver(), this.startObserver();
  }
  render() {
    return f`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }
};
t.styles = [p, O];
a([
  v("slot")
], t.prototype, "mutationSlot", 2);
a([
  o({ reflect: !0 })
], t.prototype, "attr", 2);
a([
  o({ attribute: "attr-old-value", reflect: !0, type: Boolean })
], t.prototype, "attrOldValue", 2);
a([
  o({ attribute: "char-data", reflect: !0, type: Boolean })
], t.prototype, "charData", 2);
a([
  o({ attribute: "char-data-old-value", reflect: !0, type: Boolean })
], t.prototype, "charDataOldValue", 2);
a([
  o({ attribute: "child-list", reflect: !0, type: Boolean })
], t.prototype, "childList", 2);
a([
  o({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
a([
  l("disabled")
], t.prototype, "handleDisabledChange", 1);
a([
  l("attr", { waitUntilFirstUpdate: !0 }),
  l("attr-old-value", { waitUntilFirstUpdate: !0 }),
  l("char-data", { waitUntilFirstUpdate: !0 }),
  l("char-data-old-value", { waitUntilFirstUpdate: !0 }),
  l("childList", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleChange", 1);
t = a([
  u("cx-mutation-observer")
], t);
export {
  t as default
};
