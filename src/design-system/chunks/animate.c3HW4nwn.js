function u(e, t, n) {
  return new Promise((r) => {
    if ((n == null ? void 0 : n.duration) === 1 / 0)
      throw new Error("Promise-based animations must be finite.");
    const i = e.animate(t, {
      ...n,
      duration: a() ? 0 : n.duration
    });
    i.addEventListener("cancel", r, { once: !0 }), i.addEventListener("finish", r, { once: !0 });
  });
}
function o(e) {
  return e = e.toString().toLowerCase(), e.indexOf("ms") > -1 ? parseFloat(e) : e.indexOf("s") > -1 ? parseFloat(e) * 1e3 : parseFloat(e);
}
function a() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function s(e) {
  return Promise.all(
    e.getAnimations().map((t) => new Promise((n) => {
      t.cancel(), requestAnimationFrame(n);
    }))
  );
}
function c(e, t) {
  return e.map((n) => ({
    ...n,
    height: n.height === "auto" ? `${t}px` : n.height
  }));
}
export {
  u as a,
  c as b,
  a as c,
  o as p,
  s
};
