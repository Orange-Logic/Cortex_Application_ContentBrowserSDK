import { C as p } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as u } from "../chunks/component.styles.BLcT4bOa.js";
import { w as i } from "../chunks/watch.ChG-_stu.js";
import { x as b } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import { e as f } from "../chunks/query.BNveAlQo.js";
import v from "./mutation-observer.styles.js";
var O = Object.defineProperty, m = Object.getOwnPropertyDescriptor, r = (c, a, o, h) => {
  for (var e = h > 1 ? void 0 : h ? m(a, o) : a, s = c.length - 1, d; s >= 0; s--)
    (d = c[s]) && (e = (h ? d(a, o, e) : d(e)) || e);
  return h && e && O(a, o, e), e;
};
const n = class n extends p {
  constructor() {
    super(...arguments), this.attrOldValue = !1, this.charData = !1, this.charDataOldValue = !1, this.childList = !1, this.disabled = !1, this.handleMutation = (a) => {
      this.emit("cx-mutation", {
        detail: { mutationList: a }
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
    var e;
    const a = typeof this.attr == "string" && this.attr.length > 0, o = a && this.attr !== "*" ? this.attr.split(" ") : void 0;
    (((e = this.mutationSlot) == null ? void 0 : e.assignedNodes({ flatten: !0 })) || []).forEach((s) => {
      if (s.nodeType === Node.ELEMENT_NODE)
        try {
          this.mutationObserver.observe(s, {
            attributeFilter: o,
            attributeOldValue: this.attrOldValue,
            attributes: a,
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
    return b`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }
};
n.styles = [u, v];
let t = n;
r([
  f("slot")
], t.prototype, "mutationSlot", 2);
r([
  l({ reflect: !0 })
], t.prototype, "attr", 2);
r([
  l({ attribute: "attr-old-value", reflect: !0, type: Boolean })
], t.prototype, "attrOldValue", 2);
r([
  l({ attribute: "char-data", reflect: !0, type: Boolean })
], t.prototype, "charData", 2);
r([
  l({ attribute: "char-data-old-value", reflect: !0, type: Boolean })
], t.prototype, "charDataOldValue", 2);
r([
  l({ attribute: "child-list", reflect: !0, type: Boolean })
], t.prototype, "childList", 2);
r([
  l({ reflect: !0, type: Boolean })
], t.prototype, "disabled", 2);
r([
  i("disabled")
], t.prototype, "handleDisabledChange", 1);
r([
  i("attr", { waitUntilFirstUpdate: !0 }),
  i("attr-old-value", { waitUntilFirstUpdate: !0 }),
  i("char-data", { waitUntilFirstUpdate: !0 }),
  i("char-data-old-value", { waitUntilFirstUpdate: !0 }),
  i("childList", { waitUntilFirstUpdate: !0 })
], t.prototype, "handleChange", 1);
export {
  t as default
};
