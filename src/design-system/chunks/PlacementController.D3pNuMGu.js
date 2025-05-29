const _ = Math.min, O = Math.max, ot = Math.round, et = Math.floor, k = (t) => ({
  x: t,
  y: t
}), $t = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Nt = {
  start: "end",
  end: "start"
};
function ut(t, e, n) {
  return O(t, _(e, n));
}
function K(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function I(t) {
  return t.split("-")[0];
}
function Q(t) {
  return t.split("-")[1];
}
function Ct(t) {
  return t === "x" ? "y" : "x";
}
function mt(t) {
  return t === "y" ? "height" : "width";
}
function j(t) {
  return ["top", "bottom"].includes(I(t)) ? "y" : "x";
}
function pt(t) {
  return Ct(j(t));
}
function Bt(t, e, n) {
  n === void 0 && (n = !1);
  const i = Q(t), o = pt(t), r = mt(o);
  let s = o === "x" ? i === (n ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[r] > e.floating[r] && (s = st(s)), [s, st(s)];
}
function Vt(t) {
  const e = st(t);
  return [dt(t), e, dt(e)];
}
function dt(t) {
  return t.replace(/start|end/g, (e) => Nt[e]);
}
function zt(t, e, n) {
  const i = ["left", "right"], o = ["right", "left"], r = ["top", "bottom"], s = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return n ? e ? o : i : e ? i : o;
    case "left":
    case "right":
      return e ? r : s;
    default:
      return [];
  }
}
function _t(t, e, n, i) {
  const o = Q(t);
  let r = zt(I(t), n === "start", i);
  return o && (r = r.map((s) => s + "-" + o), e && (r = r.concat(r.map(dt)))), r;
}
function st(t) {
  return t.replace(/left|right|bottom|top/g, (e) => $t[e]);
}
function It(t) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...t
  };
}
function Tt(t) {
  return typeof t != "number" ? It(t) : {
    top: t,
    right: t,
    bottom: t,
    left: t
  };
}
function rt(t) {
  const {
    x: e,
    y: n,
    width: i,
    height: o
  } = t;
  return {
    width: i,
    height: o,
    top: n,
    left: e,
    right: e + i,
    bottom: n + o,
    x: e,
    y: n
  };
}
function vt(t, e, n) {
  let {
    reference: i,
    floating: o
  } = t;
  const r = j(e), s = pt(e), c = mt(s), a = I(e), l = r === "y", f = i.x + i.width / 2 - o.width / 2, d = i.y + i.height / 2 - o.height / 2, m = i[c] / 2 - o[c] / 2;
  let u;
  switch (a) {
    case "top":
      u = {
        x: f,
        y: i.y - o.height
      };
      break;
    case "bottom":
      u = {
        x: f,
        y: i.y + i.height
      };
      break;
    case "right":
      u = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      u = {
        x: i.x - o.width,
        y: d
      };
      break;
    default:
      u = {
        x: i.x,
        y: i.y
      };
  }
  switch (Q(e)) {
    case "start":
      u[s] -= m * (n && l ? -1 : 1);
      break;
    case "end":
      u[s] += m * (n && l ? -1 : 1);
      break;
  }
  return u;
}
const Ut = async (t, e, n) => {
  const {
    placement: i = "bottom",
    strategy: o = "absolute",
    middleware: r = [],
    platform: s
  } = n, c = r.filter(Boolean), a = await (s.isRTL == null ? void 0 : s.isRTL(e));
  let l = await s.getElementRects({
    reference: t,
    floating: e,
    strategy: o
  }), {
    x: f,
    y: d
  } = vt(l, i, a), m = i, u = {}, h = 0;
  for (let p = 0; p < c.length; p++) {
    const {
      name: w,
      fn: g
    } = c[p], {
      x,
      y,
      data: v,
      reset: b
    } = await g({
      x: f,
      y: d,
      initialPlacement: i,
      placement: m,
      strategy: o,
      middlewareData: u,
      rects: l,
      platform: s,
      elements: {
        reference: t,
        floating: e
      }
    });
    f = x ?? f, d = y ?? d, u = {
      ...u,
      [w]: {
        ...u[w],
        ...v
      }
    }, b && h <= 50 && (h++, typeof b == "object" && (b.placement && (m = b.placement), b.rects && (l = b.rects === !0 ? await s.getElementRects({
      reference: t,
      floating: e,
      strategy: o
    }) : b.rects), {
      x: f,
      y: d
    } = vt(l, m, a)), p = -1);
  }
  return {
    x: f,
    y: d,
    placement: m,
    strategy: o,
    middlewareData: u
  };
};
async function gt(t, e) {
  var n;
  e === void 0 && (e = {});
  const {
    x: i,
    y: o,
    platform: r,
    rects: s,
    elements: c,
    strategy: a
  } = t, {
    boundary: l = "clippingAncestors",
    rootBoundary: f = "viewport",
    elementContext: d = "floating",
    altBoundary: m = !1,
    padding: u = 0
  } = K(e, t), h = Tt(u), w = c[m ? d === "floating" ? "reference" : "floating" : d], g = rt(await r.getClippingRect({
    element: (n = await (r.isElement == null ? void 0 : r.isElement(w))) == null || n ? w : w.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(c.floating)),
    boundary: l,
    rootBoundary: f,
    strategy: a
  })), x = d === "floating" ? {
    x: i,
    y: o,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, y = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(c.floating)), v = await (r.isElement == null ? void 0 : r.isElement(y)) ? await (r.getScale == null ? void 0 : r.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, b = rt(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: c,
    rect: x,
    offsetParent: y,
    strategy: a
  }) : x);
  return {
    top: (g.top - b.top + h.top) / v.y,
    bottom: (b.bottom - g.bottom + h.bottom) / v.y,
    left: (g.left - b.left + h.left) / v.x,
    right: (b.right - g.right + h.right) / v.x
  };
}
const jt = (t) => ({
  name: "arrow",
  options: t,
  async fn(e) {
    const {
      x: n,
      y: i,
      placement: o,
      rects: r,
      platform: s,
      elements: c,
      middlewareData: a
    } = e, {
      element: l,
      padding: f = 0
    } = K(t, e) || {};
    if (l == null)
      return {};
    const d = Tt(f), m = {
      x: n,
      y: i
    }, u = pt(o), h = mt(u), p = await s.getDimensions(l), w = u === "y", g = w ? "top" : "left", x = w ? "bottom" : "right", y = w ? "clientHeight" : "clientWidth", v = r.reference[h] + r.reference[u] - m[u] - r.floating[h], b = m[u] - r.reference[u], P = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(l));
    let E = P ? P[y] : 0;
    (!E || !await (s.isElement == null ? void 0 : s.isElement(P))) && (E = c.floating[y] || r.floating[h]);
    const W = v / 2 - b / 2, D = E / 2 - p[h] / 2 - 1, C = _(d[g], D), N = _(d[x], D), S = C, B = E - p[h] - N, A = E / 2 - p[h] / 2 + W, X = ut(S, A, B), $ = !a.arrow && Q(o) != null && A !== X && r.reference[h] / 2 - (A < S ? C : N) - p[h] / 2 < 0, M = $ ? A < S ? A - S : A - B : 0;
    return {
      [u]: m[u] + M,
      data: {
        [u]: X,
        centerOffset: A - X - M,
        ...$ && {
          alignmentOffset: M
        }
      },
      reset: $
    };
  }
}), Yt = function(t) {
  return t === void 0 && (t = {}), {
    name: "flip",
    options: t,
    async fn(e) {
      var n, i;
      const {
        placement: o,
        middlewareData: r,
        rects: s,
        initialPlacement: c,
        platform: a,
        elements: l
      } = e, {
        mainAxis: f = !0,
        crossAxis: d = !0,
        fallbackPlacements: m,
        fallbackStrategy: u = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: p = !0,
        ...w
      } = K(t, e);
      if ((n = r.arrow) != null && n.alignmentOffset)
        return {};
      const g = I(o), x = j(c), y = I(c) === c, v = await (a.isRTL == null ? void 0 : a.isRTL(l.floating)), b = m || (y || !p ? [st(c)] : Vt(c)), P = h !== "none";
      !m && P && b.push(..._t(c, p, h, v));
      const E = [c, ...b], W = await gt(e, w), D = [];
      let C = ((i = r.flip) == null ? void 0 : i.overflows) || [];
      if (f && D.push(W[g]), d) {
        const A = Bt(o, s, v);
        D.push(W[A[0]], W[A[1]]);
      }
      if (C = [...C, {
        placement: o,
        overflows: D
      }], !D.every((A) => A <= 0)) {
        var N, S;
        const A = (((N = r.flip) == null ? void 0 : N.index) || 0) + 1, X = E[A];
        if (X)
          return {
            data: {
              index: A,
              overflows: C
            },
            reset: {
              placement: X
            }
          };
        let $ = (S = C.filter((M) => M.overflows[0] <= 0).sort((M, V) => M.overflows[1] - V.overflows[1])[0]) == null ? void 0 : S.placement;
        if (!$)
          switch (u) {
            case "bestFit": {
              var B;
              const M = (B = C.filter((V) => {
                if (P) {
                  const z = j(V.placement);
                  return z === x || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  z === "y";
                }
                return !0;
              }).map((V) => [V.placement, V.overflows.filter((z) => z > 0).reduce((z, Wt) => z + Wt, 0)]).sort((V, z) => V[1] - z[1])[0]) == null ? void 0 : B[0];
              M && ($ = M);
              break;
            }
            case "initialPlacement":
              $ = c;
              break;
          }
        if (o !== $)
          return {
            reset: {
              placement: $
            }
          };
      }
      return {};
    }
  };
};
async function Xt(t, e) {
  const {
    placement: n,
    platform: i,
    elements: o
  } = t, r = await (i.isRTL == null ? void 0 : i.isRTL(o.floating)), s = I(n), c = Q(n), a = j(n) === "y", l = ["left", "top"].includes(s) ? -1 : 1, f = r && a ? -1 : 1, d = K(e, t);
  let {
    mainAxis: m,
    crossAxis: u,
    alignmentAxis: h
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return c && typeof h == "number" && (u = c === "end" ? h * -1 : h), a ? {
    x: u * f,
    y: m * l
  } : {
    x: m * l,
    y: u * f
  };
}
const qt = function(t) {
  return t === void 0 && (t = 0), {
    name: "offset",
    options: t,
    async fn(e) {
      var n, i;
      const {
        x: o,
        y: r,
        placement: s,
        middlewareData: c
      } = e, a = await Xt(e, t);
      return s === ((n = c.offset) == null ? void 0 : n.placement) && (i = c.arrow) != null && i.alignmentOffset ? {} : {
        x: o + a.x,
        y: r + a.y,
        data: {
          ...a,
          placement: s
        }
      };
    }
  };
}, Gt = function(t) {
  return t === void 0 && (t = {}), {
    name: "shift",
    options: t,
    async fn(e) {
      const {
        x: n,
        y: i,
        placement: o
      } = e, {
        mainAxis: r = !0,
        crossAxis: s = !1,
        limiter: c = {
          fn: (w) => {
            let {
              x: g,
              y: x
            } = w;
            return {
              x: g,
              y: x
            };
          }
        },
        ...a
      } = K(t, e), l = {
        x: n,
        y: i
      }, f = await gt(e, a), d = j(I(o)), m = Ct(d);
      let u = l[m], h = l[d];
      if (r) {
        const w = m === "y" ? "top" : "left", g = m === "y" ? "bottom" : "right", x = u + f[w], y = u - f[g];
        u = ut(x, u, y);
      }
      if (s) {
        const w = d === "y" ? "top" : "left", g = d === "y" ? "bottom" : "right", x = h + f[w], y = h - f[g];
        h = ut(x, h, y);
      }
      const p = c.fn({
        ...e,
        [m]: u,
        [d]: h
      });
      return {
        ...p,
        data: {
          x: p.x - n,
          y: p.y - i,
          enabled: {
            [m]: r,
            [d]: s
          }
        }
      };
    }
  };
}, Kt = function(t) {
  return t === void 0 && (t = {}), {
    name: "size",
    options: t,
    async fn(e) {
      var n, i;
      const {
        placement: o,
        rects: r,
        platform: s,
        elements: c
      } = e, {
        apply: a = () => {
        },
        ...l
      } = K(t, e), f = await gt(e, l), d = I(o), m = Q(o), u = j(o) === "y", {
        width: h,
        height: p
      } = r.floating;
      let w, g;
      d === "top" || d === "bottom" ? (w = d, g = m === (await (s.isRTL == null ? void 0 : s.isRTL(c.floating)) ? "start" : "end") ? "left" : "right") : (g = d, w = m === "end" ? "top" : "bottom");
      const x = p - f.top - f.bottom, y = h - f.left - f.right, v = _(p - f[w], x), b = _(h - f[g], y), P = !e.middlewareData.shift;
      let E = v, W = b;
      if ((n = e.middlewareData.shift) != null && n.enabled.x && (W = y), (i = e.middlewareData.shift) != null && i.enabled.y && (E = x), P && !m) {
        const C = O(f.left, 0), N = O(f.right, 0), S = O(f.top, 0), B = O(f.bottom, 0);
        u ? W = h - 2 * (C !== 0 || N !== 0 ? C + N : O(f.left, f.right)) : E = p - 2 * (S !== 0 || B !== 0 ? S + B : O(f.top, f.bottom));
      }
      await a({
        ...e,
        availableWidth: W,
        availableHeight: E
      });
      const D = await s.getDimensions(c.floating);
      return h !== D.width || p !== D.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function ct() {
  return typeof window < "u";
}
function J(t) {
  return Lt(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function R(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function F(t) {
  var e;
  return (e = (Lt(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Lt(t) {
  return ct() ? t instanceof Node || t instanceof R(t).Node : !1;
}
function T(t) {
  return ct() ? t instanceof Element || t instanceof R(t).Element : !1;
}
function H(t) {
  return ct() ? t instanceof HTMLElement || t instanceof R(t).HTMLElement : !1;
}
function At(t) {
  return !ct() || typeof ShadowRoot > "u" ? !1 : t instanceof ShadowRoot || t instanceof R(t).ShadowRoot;
}
function tt(t) {
  const {
    overflow: e,
    overflowX: n,
    overflowY: i,
    display: o
  } = L(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + n) && !["inline", "contents"].includes(o);
}
function Qt(t) {
  return ["table", "td", "th"].includes(J(t));
}
function lt(t) {
  return [":popover-open", ":modal"].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function wt(t) {
  const e = xt(), n = T(t) ? L(t) : t;
  return n.transform !== "none" || n.perspective !== "none" || (n.containerType ? n.containerType !== "normal" : !1) || !e && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !e && (n.filter ? n.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((i) => (n.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (n.contain || "").includes(i));
}
function Jt(t) {
  let e = U(t);
  for (; H(e) && !G(e); ) {
    if (wt(e))
      return e;
    if (lt(e))
      return null;
    e = U(e);
  }
  return null;
}
function xt() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function G(t) {
  return ["html", "body", "#document"].includes(J(t));
}
function L(t) {
  return R(t).getComputedStyle(t);
}
function at(t) {
  return T(t) ? {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  } : {
    scrollLeft: t.scrollX,
    scrollTop: t.scrollY
  };
}
function U(t) {
  if (J(t) === "html")
    return t;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    t.assignedSlot || // DOM Element detected.
    t.parentNode || // ShadowRoot detected.
    At(t) && t.host || // Fallback.
    F(t)
  );
  return At(e) ? e.host : e;
}
function Dt(t) {
  const e = U(t);
  return G(e) ? t.ownerDocument ? t.ownerDocument.body : t.body : H(e) && tt(e) ? e : Dt(e);
}
function Z(t, e, n) {
  var i;
  e === void 0 && (e = []), n === void 0 && (n = !0);
  const o = Dt(t), r = o === ((i = t.ownerDocument) == null ? void 0 : i.body), s = R(o);
  if (r) {
    const c = ht(s);
    return e.concat(s, s.visualViewport || [], tt(o) ? o : [], c && n ? Z(c) : []);
  }
  return e.concat(o, Z(o, [], n));
}
function ht(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function St(t) {
  const e = L(t);
  let n = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const o = H(t), r = o ? t.offsetWidth : n, s = o ? t.offsetHeight : i, c = ot(n) !== r || ot(i) !== s;
  return c && (n = r, i = s), {
    width: n,
    height: i,
    $: c
  };
}
function yt(t) {
  return T(t) ? t : t.contextElement;
}
function q(t) {
  const e = yt(t);
  if (!H(e))
    return k(1);
  const n = e.getBoundingClientRect(), {
    width: i,
    height: o,
    $: r
  } = St(e);
  let s = (r ? ot(n.width) : n.width) / i, c = (r ? ot(n.height) : n.height) / o;
  return (!s || !Number.isFinite(s)) && (s = 1), (!c || !Number.isFinite(c)) && (c = 1), {
    x: s,
    y: c
  };
}
const Zt = /* @__PURE__ */ k(0);
function Mt(t) {
  const e = R(t);
  return !xt() || !e.visualViewport ? Zt : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function te(t, e, n) {
  return e === void 0 && (e = !1), !n || e && n !== R(t) ? !1 : e;
}
function Y(t, e, n, i) {
  e === void 0 && (e = !1), n === void 0 && (n = !1);
  const o = t.getBoundingClientRect(), r = yt(t);
  let s = k(1);
  e && (i ? T(i) && (s = q(i)) : s = q(t));
  const c = te(r, n, i) ? Mt(r) : k(0);
  let a = (o.left + c.x) / s.x, l = (o.top + c.y) / s.y, f = o.width / s.x, d = o.height / s.y;
  if (r) {
    const m = R(r), u = i && T(i) ? R(i) : i;
    let h = m, p = ht(h);
    for (; p && i && u !== h; ) {
      const w = q(p), g = p.getBoundingClientRect(), x = L(p), y = g.left + (p.clientLeft + parseFloat(x.paddingLeft)) * w.x, v = g.top + (p.clientTop + parseFloat(x.paddingTop)) * w.y;
      a *= w.x, l *= w.y, f *= w.x, d *= w.y, a += y, l += v, h = R(p), p = ht(h);
    }
  }
  return rt({
    width: f,
    height: d,
    x: a,
    y: l
  });
}
function bt(t, e) {
  const n = at(t).scrollLeft;
  return e ? e.left + n : Y(F(t)).left + n;
}
function kt(t, e, n) {
  n === void 0 && (n = !1);
  const i = t.getBoundingClientRect(), o = i.left + e.scrollLeft - (n ? 0 : (
    // RTL <body> scrollbar.
    bt(t, i)
  )), r = i.top + e.scrollTop;
  return {
    x: o,
    y: r
  };
}
function ee(t) {
  let {
    elements: e,
    rect: n,
    offsetParent: i,
    strategy: o
  } = t;
  const r = o === "fixed", s = F(i), c = e ? lt(e.floating) : !1;
  if (i === s || c && r)
    return n;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = k(1);
  const f = k(0), d = H(i);
  if ((d || !d && !r) && ((J(i) !== "body" || tt(s)) && (a = at(i)), H(i))) {
    const u = Y(i);
    l = q(i), f.x = u.x + i.clientLeft, f.y = u.y + i.clientTop;
  }
  const m = s && !d && !r ? kt(s, a, !0) : k(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - a.scrollLeft * l.x + f.x + m.x,
    y: n.y * l.y - a.scrollTop * l.y + f.y + m.y
  };
}
function ne(t) {
  return Array.from(t.getClientRects());
}
function ie(t) {
  const e = F(t), n = at(t), i = t.ownerDocument.body, o = O(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), r = O(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let s = -n.scrollLeft + bt(t);
  const c = -n.scrollTop;
  return L(i).direction === "rtl" && (s += O(e.clientWidth, i.clientWidth) - o), {
    width: o,
    height: r,
    x: s,
    y: c
  };
}
function oe(t, e) {
  const n = R(t), i = F(t), o = n.visualViewport;
  let r = i.clientWidth, s = i.clientHeight, c = 0, a = 0;
  if (o) {
    r = o.width, s = o.height;
    const l = xt();
    (!l || l && e === "fixed") && (c = o.offsetLeft, a = o.offsetTop);
  }
  return {
    width: r,
    height: s,
    x: c,
    y: a
  };
}
function se(t, e) {
  const n = Y(t, !0, e === "fixed"), i = n.top + t.clientTop, o = n.left + t.clientLeft, r = H(t) ? q(t) : k(1), s = t.clientWidth * r.x, c = t.clientHeight * r.y, a = o * r.x, l = i * r.y;
  return {
    width: s,
    height: c,
    x: a,
    y: l
  };
}
function Ot(t, e, n) {
  let i;
  if (e === "viewport")
    i = oe(t, n);
  else if (e === "document")
    i = ie(F(t));
  else if (T(e))
    i = se(e, n);
  else {
    const o = Mt(t);
    i = {
      x: e.x - o.x,
      y: e.y - o.y,
      width: e.width,
      height: e.height
    };
  }
  return rt(i);
}
function Ht(t, e) {
  const n = U(t);
  return n === e || !T(n) || G(n) ? !1 : L(n).position === "fixed" || Ht(n, e);
}
function re(t, e) {
  const n = e.get(t);
  if (n)
    return n;
  let i = Z(t, [], !1).filter((c) => T(c) && J(c) !== "body"), o = null;
  const r = L(t).position === "fixed";
  let s = r ? U(t) : t;
  for (; T(s) && !G(s); ) {
    const c = L(s), a = wt(s);
    !a && c.position === "fixed" && (o = null), (r ? !a && !o : !a && c.position === "static" && !!o && ["absolute", "fixed"].includes(o.position) || tt(s) && !a && Ht(t, s)) ? i = i.filter((f) => f !== s) : o = c, s = U(s);
  }
  return e.set(t, i), i;
}
function ce(t) {
  let {
    element: e,
    boundary: n,
    rootBoundary: i,
    strategy: o
  } = t;
  const s = [...n === "clippingAncestors" ? lt(e) ? [] : re(e, this._c) : [].concat(n), i], c = s[0], a = s.reduce((l, f) => {
    const d = Ot(e, f, o);
    return l.top = O(d.top, l.top), l.right = _(d.right, l.right), l.bottom = _(d.bottom, l.bottom), l.left = O(d.left, l.left), l;
  }, Ot(e, c, o));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function le(t) {
  const {
    width: e,
    height: n
  } = St(t);
  return {
    width: e,
    height: n
  };
}
function ae(t, e, n) {
  const i = H(e), o = F(e), r = n === "fixed", s = Y(t, !0, r, e);
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = k(0);
  if (i || !i && !r)
    if ((J(e) !== "body" || tt(o)) && (c = at(e)), i) {
      const m = Y(e, !0, r, e);
      a.x = m.x + e.clientLeft, a.y = m.y + e.clientTop;
    } else o && (a.x = bt(o));
  const l = o && !i && !r ? kt(o, c) : k(0), f = s.left + c.scrollLeft - a.x - l.x, d = s.top + c.scrollTop - a.y - l.y;
  return {
    x: f,
    y: d,
    width: s.width,
    height: s.height
  };
}
function ft(t) {
  return L(t).position === "static";
}
function Rt(t, e) {
  if (!H(t) || L(t).position === "fixed")
    return null;
  if (e)
    return e(t);
  let n = t.offsetParent;
  return F(t) === n && (n = n.ownerDocument.body), n;
}
function Ft(t, e) {
  const n = R(t);
  if (lt(t))
    return n;
  if (!H(t)) {
    let o = U(t);
    for (; o && !G(o); ) {
      if (T(o) && !ft(o))
        return o;
      o = U(o);
    }
    return n;
  }
  let i = Rt(t, e);
  for (; i && Qt(i) && ft(i); )
    i = Rt(i, e);
  return i && G(i) && ft(i) && !wt(i) ? n : i || Jt(t) || n;
}
const fe = async function(t) {
  const e = this.getOffsetParent || Ft, n = this.getDimensions, i = await n(t.floating);
  return {
    reference: ae(t.reference, await e(t.floating), t.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function ue(t) {
  return L(t).direction === "rtl";
}
const de = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ee,
  getDocumentElement: F,
  getClippingRect: ce,
  getOffsetParent: Ft,
  getElementRects: fe,
  getClientRects: ne,
  getDimensions: le,
  getScale: q,
  isElement: T,
  isRTL: ue
};
function he(t, e) {
  let n = null, i;
  const o = F(t);
  function r() {
    var c;
    clearTimeout(i), (c = n) == null || c.disconnect(), n = null;
  }
  function s(c, a) {
    c === void 0 && (c = !1), a === void 0 && (a = 1), r();
    const {
      left: l,
      top: f,
      width: d,
      height: m
    } = t.getBoundingClientRect();
    if (c || e(), !d || !m)
      return;
    const u = et(f), h = et(o.clientWidth - (l + d)), p = et(o.clientHeight - (f + m)), w = et(l), x = {
      rootMargin: -u + "px " + -h + "px " + -p + "px " + -w + "px",
      threshold: O(0, _(1, a)) || 1
    };
    let y = !0;
    function v(b) {
      const P = b[0].intersectionRatio;
      if (P !== a) {
        if (!y)
          return s();
        P ? s(!1, P) : i = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      y = !1;
    }
    try {
      n = new IntersectionObserver(v, {
        ...x,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(v, x);
    }
    n.observe(t);
  }
  return s(!0), r;
}
function Pt(t, e, n, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: r = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: c = typeof IntersectionObserver == "function",
    animationFrame: a = !1
  } = i, l = yt(t), f = o || r ? [...l ? Z(l) : [], ...Z(e)] : [];
  f.forEach((g) => {
    o && g.addEventListener("scroll", n, {
      passive: !0
    }), r && g.addEventListener("resize", n);
  });
  const d = l && c ? he(l, n) : null;
  let m = -1, u = null;
  s && (u = new ResizeObserver((g) => {
    let [x] = g;
    x && x.target === l && u && (u.unobserve(e), cancelAnimationFrame(m), m = requestAnimationFrame(() => {
      var y;
      (y = u) == null || y.observe(e);
    })), n();
  }), l && !a && u.observe(l), u.observe(e));
  let h, p = a ? Y(t) : null;
  a && w();
  function w() {
    const g = Y(t);
    p && (g.x !== p.x || g.y !== p.y || g.width !== p.width || g.height !== p.height) && n(), p = g, h = requestAnimationFrame(w);
  }
  return n(), () => {
    var g;
    f.forEach((x) => {
      o && x.removeEventListener("scroll", n), r && x.removeEventListener("resize", n);
    }), d == null || d(), (g = u) == null || g.disconnect(), u = null, a && cancelAnimationFrame(h);
  };
}
const me = qt, pe = Gt, Et = Yt, ge = Kt, we = jt, xe = (t, e, n) => {
  const i = /* @__PURE__ */ new Map(), o = {
    platform: de,
    ...n
  }, r = {
    ...o.platform,
    _c: i
  };
  return Ut(t, e, {
    ...o,
    platform: r
  });
};
function nt(t) {
  if (typeof t > "u") return 0;
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e || -1e4;
}
const it = 8, ye = 100, be = (t) => ({
  bottom: ["top", "left", "right"],
  "bottom-end": ["top-end", "left", "right"],
  "bottom-start": ["top-start", "left", "right"],
  left: ["right", "bottom", "top"],
  "left-end": ["right-end", "bottom", "top"],
  "left-start": ["right-start", "bottom", "top"],
  right: ["left", "bottom", "top"],
  "right-end": ["left-end", "bottom", "top"],
  "right-start": ["left-start", "bottom", "top"],
  top: ["bottom", "left", "right"],
  "top-end": ["bottom-end", "left", "right"],
  "top-start": ["bottom-start", "left", "right"]
})[t] ?? [t], ve = Symbol("placement updated");
class Ae {
  constructor(e) {
    this.originalPlacements = /* @__PURE__ */ new WeakMap(), this.allowPlacementUpdate = !1, this.closeForAncestorUpdate = () => {
      !this.allowPlacementUpdate && this.options.type !== "modal" && this.cleanup && this.target.dispatchEvent(new Event("close", { bubbles: !0 })), this.allowPlacementUpdate = !1;
    }, this.updatePlacement = () => {
      this.computePlacement();
    }, this.resetOverlayPosition = () => {
      !this.target || !this.options || (this.clearOverlayPosition(), this.host.offsetHeight, this.computePlacement());
    }, this.host = e, this.host.addController(this);
  }
  async placeOverlay(e = this.target, n = this.options) {
    if (this.target = e, this.options = n, !e || !n) return;
    const i = Pt(
      n.trigger,
      e,
      this.closeForAncestorUpdate,
      {
        ancestorResize: !1,
        elementResize: !1,
        layoutShift: !1
      }
    ), o = Pt(
      n.trigger,
      e,
      this.updatePlacement,
      {
        ancestorScroll: !1
      }
    );
    this.cleanup = () => {
      var r;
      (r = this.host.elements) == null || r.forEach((s) => {
        s.addEventListener(
          "cx-closed",
          () => {
            const c = this.originalPlacements.get(s);
            c && s.setAttribute("placement", c), this.originalPlacements.delete(s);
          },
          { once: !0 }
        );
      }), i(), o();
    };
  }
  async computePlacement() {
    var m, u;
    const { options: e, target: n } = this;
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    const i = e.trigger instanceof HTMLElement ? Et() : Et({
      fallbackPlacements: be(e.placement),
      padding: it
    }), [o = 0, r = 0] = Array.isArray(e == null ? void 0 : e.offset) ? e.offset : [e.offset, 0], s = (m = this.host.elements.find(
      (h) => h.tipElement
    )) == null ? void 0 : m.tipElement, c = [
      me({
        crossAxis: r,
        mainAxis: o
      }),
      pe({ padding: it }),
      i,
      ge({
        apply: ({ availableHeight: h, availableWidth: p, rects: { floating: w } }) => {
          const g = Math.max(
            ye,
            Math.floor(h)
          ), x = w.height;
          this.initialHeight = this.isConstrained && this.initialHeight || x, this.isConstrained = x < this.initialHeight || g <= x;
          const y = this.isConstrained ? `${g}px` : "";
          Object.assign(n.style, {
            maxHeight: y,
            maxWidth: `${Math.floor(p)}px`
          });
        },
        padding: it
      }),
      ...s ? [
        we({
          element: s,
          padding: e.tipPadding || it
        })
      ] : []
    ], { middlewareData: a, placement: l, x: f, y: d } = await xe(
      e.trigger,
      n,
      {
        middleware: c,
        placement: e.placement,
        strategy: "fixed"
      }
    );
    if (Object.assign(n.style, {
      left: "0px",
      top: "0px",
      translate: `${nt(f)}px ${nt(d)}px`
    }), n.setAttribute("actual-placement", l), (u = this.host.elements) == null || u.forEach((h) => {
      this.originalPlacements.has(h) || this.originalPlacements.set(
        h,
        h.getAttribute("placement")
      ), h.setAttribute("placement", l);
    }), s && a.arrow) {
      const { x: h, y: p } = a.arrow;
      Object.assign(s.style, {
        left: l.startsWith("bottom") || l.startsWith("top") ? "0px" : "",
        top: l.startsWith("right") || l.startsWith("left") ? "0px" : "",
        translate: `${nt(h)}px ${nt(p)}px`
      });
    }
  }
  clearOverlayPosition() {
    this.target && (this.target.style.removeProperty("max-height"), this.target.style.removeProperty("max-width"), this.initialHeight = void 0, this.isConstrained = !1);
  }
  hostConnected() {
    document.addEventListener("cx-update-overlays", this.resetOverlayPosition);
  }
  hostUpdated() {
    var e;
    this.host.open || ((e = this.cleanup) == null || e.call(this), this.cleanup = void 0);
  }
  hostDisconnected() {
    var e;
    (e = this.cleanup) == null || e.call(this), this.cleanup = void 0, document.removeEventListener(
      "cx-update-overlays",
      this.resetOverlayPosition
    );
  }
}
export {
  Ae as P,
  Pt as a,
  ge as b,
  we as c,
  xe as d,
  ve as e,
  Et as f,
  me as o,
  de as p,
  pe as s
};
