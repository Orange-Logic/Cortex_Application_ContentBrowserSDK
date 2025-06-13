import { C as p, c as m } from "../chunks/custom-element.X6y1saJZ.js";
import { c as u } from "../chunks/component.styles.BLcT4bOa.js";
import { w as h } from "../chunks/watch.ChG-_stu.js";
import { i as f, x as d } from "../chunks/lit-element.DRlPF2me.js";
import { n } from "../chunks/property.CtZ87in4.js";
import { requestInclude as x } from "./request.js";
const y = f`
  :host {
    display: block;
  }
`;
var w = Object.defineProperty, S = Object.getOwnPropertyDescriptor, c = (e, t, r, i) => {
  for (var s = i > 1 ? void 0 : i ? S(t, r) : t, l = e.length - 1, a; l >= 0; l--)
    (a = e[l]) && (s = (i ? a(t, r, s) : a(s)) || s);
  return i && s && w(t, r, s), s;
};
let o = class extends p {
  constructor() {
    super(...arguments), this.mode = "cors", this.allowScripts = !1;
  }
  executeScript(e) {
    const t = document.createElement("script");
    [...e.attributes].forEach(
      (r) => t.setAttribute(r.name, r.value)
    ), t.textContent = e.textContent, e.parentNode.replaceChild(t, e);
  }
  async handleSrcChange() {
    try {
      const e = this.src, t = await x(e, this.mode);
      if (e !== this.src)
        return;
      if (!t.ok) {
        this.emit("cx-error", { detail: { status: t.status } });
        return;
      }
      this.innerHTML = t.html, this.allowScripts && [...this.querySelectorAll("script")].forEach(
        (r) => this.executeScript(r)
      ), this.emit("cx-load");
    } catch {
      this.emit("cx-error", { detail: { status: -1 } });
    }
  }
  render() {
    return d`<slot></slot>`;
  }
};
o.styles = [u, y];
c([
  n()
], o.prototype, "src", 2);
c([
  n()
], o.prototype, "mode", 2);
c([
  n({ attribute: "allow-scripts", type: Boolean })
], o.prototype, "allowScripts", 2);
c([
  h("src")
], o.prototype, "handleSrcChange", 1);
o = c([
  m("cx-include")
], o);
export {
  o as default
};
