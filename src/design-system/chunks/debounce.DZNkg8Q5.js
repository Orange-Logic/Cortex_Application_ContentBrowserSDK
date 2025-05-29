const s = Symbol(), t = Symbol(), f = (l, o = !1) => (a, u, e) => {
  const i = e.value;
  e.value = function(...n) {
    clearTimeout(this[s]), o && !this[t] && (i.apply(this, n), this[t] = !0), this[s] = window.setTimeout(() => {
      o || i.apply(this, n), this[t] = !1;
    }, l);
  }, e.configurable === !1 && (e.configurable = !0);
};
export {
  f as d
};
