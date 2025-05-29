function l(c, e) {
  function t(n) {
    const f = c.getBoundingClientRect(), r = c.ownerDocument.defaultView, u = f.left + r.scrollX, v = f.top + r.scrollY, a = n.pageX - u, m = n.pageY - v;
    e != null && e.onMove && e.onMove(a, m, n);
  }
  function d() {
    document.removeEventListener("pointermove", t), document.removeEventListener("pointerup", d), e != null && e.onStop && e.onStop();
  }
  document.addEventListener("pointermove", t, { passive: !0 }), document.addEventListener("pointerup", d), (e == null ? void 0 : e.initialEvent) instanceof PointerEvent && t(e.initialEvent);
}
export {
  l as d
};
