var h = (e) => {
  throw TypeError(e);
};
var x = (e, t, r) => t.has(e) || h("Cannot " + r);
var m = (e, t, r) => t.has(e) ? h("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r);
var u = (e, t, r) => (x(e, t, "access private method"), r);
import { C, c as _ } from "../chunks/custom-element.X6y1saJZ.js";
import { w } from "../chunks/watch.ChG-_stu.js";
import { x as E } from "../chunks/lit-element.DRlPF2me.js";
import { n as i } from "../chunks/property.CtZ87in4.js";
import { r as S } from "../chunks/state.-o_YRGMi.js";
import { o as g } from "../chunks/unsafe-html.BH_TRc1Y.js";
import { parser as O } from "./parser.js";
var p, f;
class k extends C {
  constructor() {
    super();
    m(this, p);
    u(this, p, f).call(this);
  }
  createRenderRoot() {
    return this;
  }
}
p = new WeakSet(), /**
 * LitElement applies the styles of a component to the Shadow DOM.
 * CortexLightElement applies the styles of a component to the Light DOM.
 */
f = function() {
  if (!A(this.constructor))
    return;
  const r = `${this.constructor.name}-styles`;
  if (!document.getElementById(r)) {
    const s = document.createElement("style");
    s.id = r, s.textContent = this.constructor.styles, s.textContent = s.textContent.replace(
      /:host/g,
      `${this.tagName.toLowerCase()}`
    ), document.head.appendChild(s);
  }
};
function A(e) {
  return e.styles !== void 0;
}
var $ = Object.defineProperty, I = Object.getOwnPropertyDescriptor, v = (e) => {
  throw TypeError(e);
}, a = (e, t, r, s) => {
  for (var n = s > 1 ? void 0 : s ? I(t, r) : t, d = e.length - 1, l; d >= 0; d--)
    (l = e[d]) && (n = (s ? l(t, r, n) : l(n)) || n);
  return s && n && $(t, r, n), n;
}, P = (e, t, r) => t.has(e) || v("Cannot " + r), y = (e, t, r) => (P(e, t, "read from private field"), r ? r.call(e) : t.get(e)), R = (e, t, r) => t.has(e) ? v("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), c;
let o = class extends k {
  constructor() {
    super(...arguments), R(this, c, O), this.classname = "", this.liveScript = !1, this.renderer = {}, this.extensions = [];
  }
  connectedCallback() {
    super.connectedCallback(), y(this, c).use({
      extensions: this.extensions,
      renderer: this.renderer
    });
  }
  updateRendered() {
    this.rendered = y(this, c).parse(this.markdown);
  }
  render() {
    return E`
      <div class=${this.classname}>${g(this.rendered)}</div>
    `;
  }
  async updated() {
    this.liveScript && T(this), this.emit("cx-ready");
  }
};
c = /* @__PURE__ */ new WeakMap();
a([
  i({ type: String })
], o.prototype, "classname", 2);
a([
  i({ type: Boolean })
], o.prototype, "liveScript", 2);
a([
  i({ type: String })
], o.prototype, "markdown", 2);
a([
  i({ type: Object })
], o.prototype, "renderer", 2);
a([
  i({ type: Object })
], o.prototype, "extensions", 2);
a([
  S()
], o.prototype, "rendered", 2);
a([
  w("markdown")
], o.prototype, "updateRendered", 1);
o = a([
  _("cx-markdown")
], o);
function T(e) {
  e.querySelectorAll("script").forEach((r) => {
    const s = document.createElement("script");
    r.src ? s.src = r.src : s.text = `(function() {
${r.text}
})();`, Array.from(r.attributes).forEach((n) => {
      n.name !== "src" && s.setAttribute(n.name, n.value);
    }), document.body.appendChild(s);
  });
}
export {
  o as default
};
