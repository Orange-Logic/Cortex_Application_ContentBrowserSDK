const u = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new WeakMap();
function f(t) {
  return t ?? { keyframes: [], options: { duration: 0 } };
}
function i(t, e) {
  return e.toLowerCase() === "rtl" ? {
    keyframes: t.rtlKeyframes || t.keyframes,
    options: t.options
  } : t;
}
function a(t, e) {
  u.set(t, f(e));
}
function c(t, e, n) {
  s.set(t, {
    ...s.get(t),
    [e]: f(n)
  });
}
function g(t, e, n) {
  const r = s.get(t);
  if (r != null && r[e])
    return i(r[e], n.dir);
  const o = u.get(e);
  return o ? i(o, n.dir) : {
    keyframes: [],
    options: { duration: 0 }
  };
}
export {
  a,
  g,
  c as s
};
