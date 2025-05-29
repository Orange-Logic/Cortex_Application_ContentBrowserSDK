import { C as m } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as h } from "../chunks/component.styles.BLcT4bOa.js";
import { w as f } from "../chunks/watch.ChG-_stu.js";
import { x as u } from "../chunks/lit-element.DRlPF2me.js";
import { n as l } from "../chunks/property.CtZ87in4.js";
import d from "./include.styles.js";
import { requestInclude as y } from "./request.js";
var w = Object.defineProperty, S = Object.getOwnPropertyDescriptor, i = (p, t, e, r) => {
  for (var s = r > 1 ? void 0 : r ? S(t, e) : t, c = p.length - 1, a; c >= 0; c--)
    (a = p[c]) && (s = (r ? a(t, e, s) : a(s)) || s);
  return r && s && w(t, e, s), s;
};
const n = class n extends m {
  constructor() {
    super(...arguments), this.mode = "cors", this.allowScripts = !1;
  }
  executeScript(t) {
    const e = document.createElement("script");
    [...t.attributes].forEach(
      (r) => e.setAttribute(r.name, r.value)
    ), e.textContent = t.textContent, t.parentNode.replaceChild(e, t);
  }
  async handleSrcChange() {
    try {
      const t = this.src, e = await y(t, this.mode);
      if (t !== this.src)
        return;
      if (!e.ok) {
        this.emit("cx-error", { detail: { status: e.status } });
        return;
      }
      this.innerHTML = e.html, this.allowScripts && [...this.querySelectorAll("script")].forEach(
        (r) => this.executeScript(r)
      ), this.emit("cx-load");
    } catch {
      this.emit("cx-error", { detail: { status: -1 } });
    }
  }
  render() {
    return u`<slot></slot>`;
  }
};
n.styles = [h, d];
let o = n;
i([
  l()
], o.prototype, "src", 2);
i([
  l()
], o.prototype, "mode", 2);
i([
  l({ attribute: "allow-scripts", type: Boolean })
], o.prototype, "allowScripts", 2);
i([
  f("src")
], o.prototype, "handleSrcChange", 1);
export {
  o as default
};
