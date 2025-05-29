var y = (e) => {
  throw TypeError(e);
};
var m = (e, r, t) => r.has(e) || y("Cannot " + t);
var h = (e, r, t) => (m(e, r, "read from private field"), t ? t.call(e) : r.get(e)), u = (e, r, t) => r.has(e) ? y("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(e) : r.set(e, t), f = (e, r, t, s) => (m(e, r, "write to private field"), s ? s.call(e, t) : r.set(e, t), t), x = (e, r, t) => (m(e, r, "access private method"), t);
import { C } from "../chunks/cortex-element.v9MiwbrF.js";
import { w as g } from "../chunks/watch.ChG-_stu.js";
import { x as S } from "../chunks/lit-element.DRlPF2me.js";
import { n as a } from "../chunks/property.CtZ87in4.js";
import { r as b } from "../chunks/state.-o_YRGMi.js";
import { o as w } from "../chunks/unsafe-html.DgLLaYx0.js";
import { parser as E } from "./parser.js";
var p, v;
class O extends C {
  constructor() {
    super();
    u(this, p);
    x(this, p, v).call(this);
  }
  createRenderRoot() {
    return this;
  }
}
p = new WeakSet(), /**
 * LitElement applies the styles of a component to the Shadow DOM.
 * CortexLightElement applies the styles of a component to the Light DOM.
 */
v = function() {
  if (!_(this.constructor))
    return;
  const t = `${this.constructor.name}-styles`;
  if (!document.getElementById(t)) {
    const s = document.createElement("style");
    s.id = t, s.textContent = this.constructor.styles, s.textContent = s.textContent.replace(
      /:host/g,
      `${this.tagName.toLowerCase()}`
    ), document.head.appendChild(s);
  }
};
function _(e) {
  return e.styles !== void 0;
}
var $ = Object.defineProperty, j = Object.getOwnPropertyDescriptor, n = (e, r, t, s) => {
  for (var o = s > 1 ? void 0 : s ? j(r, t) : r, d = e.length - 1, l; d >= 0; d--)
    (l = e[d]) && (o = (s ? l(r, t, o) : l(o)) || o);
  return s && o && $(r, t, o), o;
}, c;
class i extends O {
  constructor() {
    super(...arguments);
    u(this, c);
    f(this, c, E), this.classname = "", this.liveScript = !1, this.renderer = {}, this.extensions = [];
  }
  connectedCallback() {
    super.connectedCallback(), h(this, c).use({
      extensions: this.extensions,
      renderer: this.renderer
    });
  }
  updateRendered() {
    this.rendered = h(this, c).parse(this.markdown);
  }
  render() {
    return S`
      <div class=${this.classname}>${w(this.rendered)}</div>
    `;
  }
  async updated() {
    this.liveScript && A(this), this.emit("cx-ready");
  }
}
c = new WeakMap();
n([
  a({ type: String })
], i.prototype, "classname", 2);
n([
  a({ type: Boolean })
], i.prototype, "liveScript", 2);
n([
  a({ type: String })
], i.prototype, "markdown", 2);
n([
  a({ type: Object })
], i.prototype, "renderer", 2);
n([
  a({ type: Object })
], i.prototype, "extensions", 2);
n([
  b()
], i.prototype, "rendered", 2);
n([
  g("markdown")
], i.prototype, "updateRendered", 1);
function A(e) {
  e.querySelectorAll("script").forEach((t) => {
    const s = document.createElement("script");
    t.src ? s.src = t.src : s.text = `(function() {
${t.text}
})();`, Array.from(t.attributes).forEach((o) => {
      o.name !== "src" && s.setAttribute(o.name, o.value);
    }), document.body.appendChild(s);
  });
}
export {
  i as default
};
