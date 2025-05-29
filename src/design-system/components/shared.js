function w(e, i, o = []) {
  for (let t = 0; t < i.length; ++t) {
    const r = i[t], a = e[t], n = a.parentElement || a.getRootNode();
    o[t] && o[t](r), n && n !== a && n.replaceChild(r, a), delete e[t];
  }
  return i;
}
const F = (e, i, {
  position: o,
  prepareCallback: t
} = { position: "beforeend" }) => {
  let { length: r } = e;
  if (r === 0)
    return () => e;
  let a = 1, n = 0;
  (o === "afterbegin" || o === "afterend") && (a = -1, n = r - 1);
  const l = new Array(r), d = new Array(r), p = document.createComment(
    "placeholder for reparented element"
  );
  do {
    const c = e[n];
    t && (d[n] = t(c)), l[n] = p.cloneNode();
    const s = c.parentElement || c.getRootNode();
    s && s !== c && s.replaceChild(l[n], c), i.insertAdjacentElement(o, c), n += a;
  } while (--r > 0);
  return function() {
    return w(l, e, d);
  };
};
function x() {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(4)),
    (e) => `0${(e & 255).toString(16)}`.slice(-2)
  ).join("");
}
const b = [
  "button",
  "[focusable]",
  "[href]",
  "input",
  "label",
  "select",
  "textarea",
  "[tabindex]"
], f = ':not([tabindex="-1"])', m = b.join(`${f}, `) + f, I = (e) => e.querySelector(
  m
), P = (e) => e.assignedElements().find(
  (o) => o.matches(m)
);
function g(e) {
  return typeof window < "u" && window.navigator != null ? e.test(window.navigator.userAgent) : !1;
}
function u(e) {
  return typeof window < "u" && window.navigator != null ? e.test(window.navigator.platform) : !1;
}
function h() {
  return u(/^Mac/);
}
function A() {
  return u(/^iPhone/);
}
function y() {
  return u(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  h() && navigator.maxTouchPoints > 1;
}
function v() {
  return A() || y();
}
function S() {
  return g(/Android/);
}
export {
  I as firstFocusableIn,
  P as firstFocusableSlottedIn,
  S as isAndroid,
  v as isIOS,
  y as isIPad,
  A as isIPhone,
  h as isMac,
  x as randomID,
  F as reparentChildren,
  m as userFocusableSelector
};
