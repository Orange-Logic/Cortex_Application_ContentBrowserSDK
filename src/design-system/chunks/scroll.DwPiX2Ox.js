function m(o, t) {
  return {
    left: Math.round(
      o.getBoundingClientRect().left - t.getBoundingClientRect().left
    ),
    top: Math.round(
      o.getBoundingClientRect().top - t.getBoundingClientRect().top
    )
  };
}
const n = /* @__PURE__ */ new Set();
function g() {
  const o = document.documentElement.clientWidth;
  return Math.abs(window.innerWidth - o);
}
function p() {
  const o = Number(
    getComputedStyle(document.body).paddingRight.replace(/px/, "")
  );
  return isNaN(o) || !o ? 0 : o;
}
function h(o) {
  if (n.add(o), !document.documentElement.classList.contains("cx-scroll-lock")) {
    const t = g() + p();
    let l = getComputedStyle(
      document.documentElement
    ).scrollbarGutter;
    (!l || l === "auto") && (l = "stable"), t < 2 && (l = ""), document.documentElement.style.setProperty(
      "--cx-scroll-lock-gutter",
      l
    ), document.documentElement.classList.add("cx-scroll-lock"), document.documentElement.style.setProperty(
      "--cx-scroll-lock-size",
      `${t}px`
    );
  }
}
function y(o) {
  n.delete(o), n.size === 0 && (document.documentElement.classList.remove("cx-scroll-lock"), document.documentElement.style.removeProperty("--cx-scroll-lock-size"));
}
function x(o, t, l = "vertical", e = "smooth") {
  const d = m(o, t), c = d.top + t.scrollTop, s = d.left + t.scrollLeft, i = t.scrollLeft, f = t.scrollLeft + t.offsetWidth, u = t.scrollTop, r = t.scrollTop + t.offsetHeight;
  (l === "horizontal" || l === "both") && (s < i ? t.scrollTo({ behavior: e, left: s }) : s + o.clientWidth > f && t.scrollTo({
    behavior: e,
    left: s - t.offsetWidth + o.clientWidth
  })), (l === "vertical" || l === "both") && (c < u ? t.scrollTo({ behavior: e, top: c }) : c + o.clientHeight > r && t.scrollTo({
    behavior: e,
    top: c - t.offsetHeight + o.clientHeight
  }));
}
export {
  h as l,
  x as s,
  y as u
};
