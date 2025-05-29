import { C as B } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as V } from "../chunks/component.styles.BLcT4bOa.js";
import { w as J } from "../chunks/watch.ChG-_stu.js";
import { x as Q } from "../chunks/lit-element.DRlPF2me.js";
import { n as G } from "../chunks/property.CtZ87in4.js";
import { e as U } from "../chunks/query.BNveAlQo.js";
import { o as I } from "../chunks/style-map.De8UQbPP.js";
import K from "./qr-code.styles.js";
let _ = null;
class $ {
}
$.render = function(E, d) {
  _(E, d);
};
self.QrCreator = $;
(function(E) {
  function d(z, n, o, l) {
    var r = {}, t = E(o, n);
    t.u(z), t.J(), l = l || 0;
    var u = t.h(), i = t.h() + 2 * l;
    return r.text = z, r.level = n, r.version = o, r.O = i, r.a = function(f, y) {
      return f -= l, y -= l, 0 > f || f >= u || 0 > y || y >= u ? !1 : t.a(f, y);
    }, r;
  }
  function P(z, n, o, l, r, t, u, i, f, y) {
    function A(s, h, e, a, c, M, w) {
      s ? (z.lineTo(h + M, e + w), z.arcTo(h, e, a, c, t)) : z.lineTo(h, e);
    }
    u ? z.moveTo(n + t, o) : z.moveTo(n, o), A(i, l, o, l, r, -t, 0), A(f, l, r, n, r, 0, -t), A(y, n, r, n, o, t, 0), A(u, n, o, l, o, 0, t);
  }
  function m(z, n, o, l, r, t, u, i, f, y) {
    function A(s, h, e, a) {
      z.moveTo(s + e, h), z.lineTo(
        s,
        h
      ), z.lineTo(s, h + a), z.arcTo(s, h, s + e, h, t);
    }
    u && A(n, o, t, t), i && A(l, o, -t, t), f && A(l, r, -t, -t), y && A(n, r, t, -t);
  }
  function C(z, n) {
    var o = n.fill;
    if (typeof o == "string") z.fillStyle = o;
    else {
      var l = o.type, r = o.colorStops;
      if (o = o.position.map((u) => Math.round(u * n.size)), l === "linear-gradient") var t = z.createLinearGradient.apply(z, o);
      else if (l === "radial-gradient") t = z.createRadialGradient.apply(z, o);
      else throw Error("Unsupported fill");
      r.forEach(([u, i]) => {
        t.addColorStop(u, i);
      }), z.fillStyle = t;
    }
  }
  function g(z, n) {
    r: {
      var o = n.text, l = n.v, r = n.N, t = n.K, u = n.P;
      for (r = Math.max(1, r || 1), t = Math.min(40, t || 40); r <= t; r += 1) try {
        var i = d(o, l, r, u);
        break r;
      } catch {
      }
      i = void 0;
    }
    if (!i) return null;
    for (o = z.getContext("2d"), n.background && (o.fillStyle = n.background, o.fillRect(n.left, n.top, n.size, n.size)), l = i.O, t = n.size / l, o.beginPath(), u = 0; u < l; u += 1) for (r = 0; r < l; r += 1) {
      var f = o, y = n.left + r * t, A = n.top + u * t, s = u, h = r, e = i.a, a = y + t, c = A + t, M = s - 1, w = s + 1, p = h - 1, v = h + 1, L = Math.floor(Math.min(0.5, Math.max(0, n.R)) * t), O = e(s, h), j = e(M, p), H = e(M, h);
      M = e(M, v);
      var N = e(s, v);
      v = e(w, v), h = e(
        w,
        h
      ), w = e(w, p), s = e(s, p), y = Math.round(y), A = Math.round(A), a = Math.round(a), c = Math.round(c), O ? P(f, y, A, a, c, L, !H && !s, !H && !N, !h && !N, !h && !s) : m(f, y, A, a, c, L, H && s && j, H && N && M, h && N && v, h && s && w);
    }
    return C(o, n), o.fill(), z;
  }
  var x = { minVersion: 1, maxVersion: 40, ecLevel: "L", left: 0, top: 0, size: 200, fill: "#000", background: null, text: "no text", radius: 0.5, quiet: 0 };
  _ = function(z, n) {
    var o = {};
    Object.assign(o, x, z), o.N = o.minVersion, o.K = o.maxVersion, o.v = o.ecLevel, o.left = o.left, o.top = o.top, o.size = o.size, o.fill = o.fill, o.background = o.background, o.text = o.text, o.R = o.radius, o.P = o.quiet, n instanceof HTMLCanvasElement ? ((n.width !== o.size || n.height !== o.size) && (n.width = o.size, n.height = o.size), n.getContext("2d").clearRect(0, 0, n.width, n.height), g(n, o)) : (z = document.createElement("canvas"), z.width = o.size, z.height = o.size, o = g(z, o), n.appendChild(o));
  };
})(function() {
  function E(n) {
    var o = P.s(n);
    return { S: function() {
      return 4;
    }, b: function() {
      return o.length;
    }, write: function(l) {
      for (var r = 0; r < o.length; r += 1) l.put(o[r], 8);
    } };
  }
  function d() {
    var n = [], o = 0, l = {
      B: function() {
        return n;
      },
      c: function(r) {
        return (n[Math.floor(r / 8)] >>> 7 - r % 8 & 1) == 1;
      },
      put: function(r, t) {
        for (var u = 0; u < t; u += 1) l.m((r >>> t - u - 1 & 1) == 1);
      },
      f: function() {
        return o;
      },
      m: function(r) {
        var t = Math.floor(o / 8);
        n.length <= t && n.push(0), r && (n[t] |= 128 >>> o % 8), o += 1;
      }
    };
    return l;
  }
  function P(n, o) {
    function l(s, h) {
      for (var e = -1; 7 >= e; e += 1) if (!(-1 >= s + e || i <= s + e)) for (var a = -1; 7 >= a; a += 1) -1 >= h + a || i <= h + a || (u[s + e][h + a] = 0 <= e && 6 >= e && (a == 0 || a == 6) || 0 <= a && 6 >= a && (e == 0 || e == 6) || 2 <= e && 4 >= e && 2 <= a && 4 >= a);
    }
    function r(s, h) {
      for (var e = i = 4 * n + 17, a = Array(e), c = 0; c < e; c += 1) {
        a[c] = Array(e);
        for (var M = 0; M < e; M += 1) a[c][M] = null;
      }
      for (u = a, l(0, 0), l(i - 7, 0), l(0, i - 7), e = g.G(n), a = 0; a < e.length; a += 1) for (c = 0; c < e.length; c += 1) {
        M = e[a];
        var w = e[c];
        if (u[M][w] == null) for (var p = -2; 2 >= p; p += 1) for (var v = -2; 2 >= v; v += 1) u[M + p][w + v] = p == -2 || p == 2 || v == -2 || v == 2 || p == 0 && v == 0;
      }
      for (e = 8; e < i - 8; e += 1) u[e][6] == null && (u[e][6] = e % 2 == 0);
      for (e = 8; e < i - 8; e += 1) u[6][e] == null && (u[6][e] = e % 2 == 0);
      for (e = g.w(t << 3 | h), a = 0; 15 > a; a += 1) c = !s && (e >> a & 1) == 1, u[6 > a ? a : 8 > a ? a + 1 : i - 15 + a][8] = c, u[8][8 > a ? i - a - 1 : 9 > a ? 15 - a : 14 - a] = c;
      if (u[i - 8][8] = !s, 7 <= n) {
        for (e = g.A(n), a = 0; 18 > a; a += 1) c = !s && (e >> a & 1) == 1, u[Math.floor(a / 3)][a % 3 + i - 8 - 3] = c;
        for (a = 0; 18 > a; a += 1) c = !s && (e >> a & 1) == 1, u[a % 3 + i - 8 - 3][Math.floor(a / 3)] = c;
      }
      if (f == null) {
        for (s = z.I(n, t), e = d(), a = 0; a < y.length; a += 1) c = y[a], e.put(4, 4), e.put(c.b(), g.f(4, n)), c.write(e);
        for (a = c = 0; a < s.length; a += 1) c += s[a].j;
        if (e.f() > 8 * c) throw Error("code length overflow. (" + e.f() + ">" + 8 * c + ")");
        for (e.f() + 4 <= 8 * c && e.put(0, 4); e.f() % 8 != 0; ) e.m(!1);
        for (; !(e.f() >= 8 * c) && (e.put(236, 8), !(e.f() >= 8 * c)); )
          e.put(17, 8);
        var L = 0;
        for (c = a = 0, M = Array(s.length), w = Array(s.length), p = 0; p < s.length; p += 1) {
          var O = s[p].j, j = s[p].o - O;
          for (a = Math.max(a, O), c = Math.max(c, j), M[p] = Array(O), v = 0; v < M[p].length; v += 1) M[p][v] = 255 & e.B()[v + L];
          for (L += O, v = g.C(j), O = m(M[p], v.b() - 1).l(v), w[p] = Array(v.b() - 1), v = 0; v < w[p].length; v += 1) j = v + O.b() - w[p].length, w[p][v] = 0 <= j ? O.c(j) : 0;
        }
        for (v = e = 0; v < s.length; v += 1) e += s[v].o;
        for (e = Array(e), v = L = 0; v < a; v += 1) for (p = 0; p < s.length; p += 1) v < M[p].length && (e[L] = M[p][v], L += 1);
        for (v = 0; v < c; v += 1) for (p = 0; p < s.length; p += 1) v < w[p].length && (e[L] = w[p][v], L += 1);
        f = e;
      }
      for (s = f, e = -1, a = i - 1, c = 7, M = 0, h = g.F(h), w = i - 1; 0 < w; w -= 2) for (w == 6 && --w; ; ) {
        for (p = 0; 2 > p; p += 1) u[a][w - p] == null && (v = !1, M < s.length && (v = (s[M] >>> c & 1) == 1), h(a, w - p) && (v = !v), u[a][w - p] = v, --c, c == -1 && (M += 1, c = 7));
        if (a += e, 0 > a || i <= a) {
          a -= e, e = -e;
          break;
        }
      }
    }
    var t = C[o], u = null, i = 0, f = null, y = [], A = { u: function(s) {
      s = E(s), y.push(s), f = null;
    }, a: function(s, h) {
      if (0 > s || i <= s || 0 > h || i <= h) throw Error(s + "," + h);
      return u[s][h];
    }, h: function() {
      return i;
    }, J: function() {
      for (var s = 0, h = 0, e = 0; 8 > e; e += 1) {
        r(!0, e);
        var a = g.D(A);
        (e == 0 || s > a) && (s = a, h = e);
      }
      r(!1, h);
    } };
    return A;
  }
  function m(n, o) {
    if (typeof n.length > "u") throw Error(n.length + "/" + o);
    var l = function() {
      for (var t = 0; t < n.length && n[t] == 0; ) t += 1;
      for (var u = Array(n.length - t + o), i = 0; i < n.length - t; i += 1) u[i] = n[i + t];
      return u;
    }(), r = { c: function(t) {
      return l[t];
    }, b: function() {
      return l.length;
    }, multiply: function(t) {
      for (var u = Array(r.b() + t.b() - 1), i = 0; i < r.b(); i += 1) for (var f = 0; f < t.b(); f += 1) u[i + f] ^= x.i(x.g(r.c(i)) + x.g(t.c(f)));
      return m(u, 0);
    }, l: function(t) {
      if (0 > r.b() - t.b()) return r;
      for (var u = x.g(r.c(0)) - x.g(t.c(0)), i = Array(r.b()), f = 0; f < r.b(); f += 1) i[f] = r.c(f);
      for (f = 0; f < t.b(); f += 1) i[f] ^= x.i(x.g(t.c(f)) + u);
      return m(i, 0).l(t);
    } };
    return r;
  }
  P.s = function(n) {
    for (var o = [], l = 0; l < n.length; l++) {
      var r = n.charCodeAt(l);
      128 > r ? o.push(r) : 2048 > r ? o.push(192 | r >> 6, 128 | r & 63) : 55296 > r || 57344 <= r ? o.push(224 | r >> 12, 128 | r >> 6 & 63, 128 | r & 63) : (l++, r = 65536 + ((r & 1023) << 10 | n.charCodeAt(l) & 1023), o.push(240 | r >> 18, 128 | r >> 12 & 63, 128 | r >> 6 & 63, 128 | r & 63));
    }
    return o;
  };
  var C = { L: 1, M: 0, Q: 3, H: 2 }, g = /* @__PURE__ */ function() {
    function n(r) {
      for (var t = 0; r != 0; ) t += 1, r >>>= 1;
      return t;
    }
    var o = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ], l = { w: function(r) {
      for (var t = r << 10; 0 <= n(t) - n(1335); ) t ^= 1335 << n(t) - n(1335);
      return (r << 10 | t) ^ 21522;
    }, A: function(r) {
      for (var t = r << 12; 0 <= n(t) - n(7973); ) t ^= 7973 << n(t) - n(7973);
      return r << 12 | t;
    }, G: function(r) {
      return o[r - 1];
    }, F: function(r) {
      switch (r) {
        case 0:
          return function(t, u) {
            return (t + u) % 2 == 0;
          };
        case 1:
          return function(t) {
            return t % 2 == 0;
          };
        case 2:
          return function(t, u) {
            return u % 3 == 0;
          };
        case 3:
          return function(t, u) {
            return (t + u) % 3 == 0;
          };
        case 4:
          return function(t, u) {
            return (Math.floor(t / 2) + Math.floor(u / 3)) % 2 == 0;
          };
        case 5:
          return function(t, u) {
            return t * u % 2 + t * u % 3 == 0;
          };
        case 6:
          return function(t, u) {
            return (t * u % 2 + t * u % 3) % 2 == 0;
          };
        case 7:
          return function(t, u) {
            return (t * u % 3 + (t + u) % 2) % 2 == 0;
          };
        default:
          throw Error("bad maskPattern:" + r);
      }
    }, C: function(r) {
      for (var t = m([1], 0), u = 0; u < r; u += 1) t = t.multiply(m([1, x.i(u)], 0));
      return t;
    }, f: function(r, t) {
      if (r != 4 || 1 > t || 40 < t) throw Error("mode: " + r + "; type: " + t);
      return 10 > t ? 8 : 16;
    }, D: function(r) {
      for (var t = r.h(), u = 0, i = 0; i < t; i += 1) for (var f = 0; f < t; f += 1) {
        for (var y = 0, A = r.a(i, f), s = -1; 1 >= s; s += 1) if (!(0 > i + s || t <= i + s)) for (var h = -1; 1 >= h; h += 1) 0 > f + h || t <= f + h || (s != 0 || h != 0) && A == r.a(i + s, f + h) && (y += 1);
        5 < y && (u += 3 + y - 5);
      }
      for (i = 0; i < t - 1; i += 1) for (f = 0; f < t - 1; f += 1) y = 0, r.a(i, f) && (y += 1), r.a(i + 1, f) && (y += 1), r.a(i, f + 1) && (y += 1), r.a(i + 1, f + 1) && (y += 1), (y == 0 || y == 4) && (u += 3);
      for (i = 0; i < t; i += 1) for (f = 0; f < t - 6; f += 1) r.a(i, f) && !r.a(i, f + 1) && r.a(i, f + 2) && r.a(i, f + 3) && r.a(i, f + 4) && !r.a(i, f + 5) && r.a(i, f + 6) && (u += 40);
      for (f = 0; f < t; f += 1) for (i = 0; i < t - 6; i += 1) r.a(i, f) && !r.a(i + 1, f) && r.a(i + 2, f) && r.a(i + 3, f) && r.a(i + 4, f) && !r.a(i + 5, f) && r.a(i + 6, f) && (u += 40);
      for (f = y = 0; f < t; f += 1) for (i = 0; i < t; i += 1) r.a(i, f) && (y += 1);
      return u += Math.abs(100 * y / t / t - 50) / 5 * 10;
    } };
    return l;
  }(), x = function() {
    for (var n = Array(256), o = Array(256), l = 0; 8 > l; l += 1) n[l] = 1 << l;
    for (l = 8; 256 > l; l += 1) n[l] = n[l - 4] ^ n[l - 5] ^ n[l - 6] ^ n[l - 8];
    for (l = 0; 255 > l; l += 1) o[n[l]] = l;
    return { g: function(r) {
      if (1 > r) throw Error("glog(" + r + ")");
      return o[r];
    }, i: function(r) {
      for (; 0 > r; ) r += 255;
      for (; 256 <= r; ) r -= 255;
      return n[r];
    } };
  }(), z = /* @__PURE__ */ function() {
    function n(r, t) {
      switch (t) {
        case C.L:
          return o[4 * (r - 1)];
        case C.M:
          return o[4 * (r - 1) + 1];
        case C.Q:
          return o[4 * (r - 1) + 2];
        case C.H:
          return o[4 * (r - 1) + 3];
      }
    }
    var o = [
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      [2, 146, 116],
      [
        3,
        58,
        36,
        2,
        59,
        37
      ],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],
      [5, 122, 98, 1, 123, 99],
      [
        7,
        73,
        45,
        3,
        74,
        46
      ],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      [
        4,
        151,
        121,
        5,
        152,
        122
      ],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ], l = { I: function(r, t) {
      var u = n(r, t);
      if (typeof u > "u") throw Error("bad rs block @ typeNumber:" + r + "/errorCorrectLevel:" + t);
      r = u.length / 3, t = [];
      for (var i = 0; i < r; i += 1) for (var f = u[3 * i], y = u[3 * i + 1], A = u[3 * i + 2], s = 0; s < f; s += 1) {
        var h = A, e = {};
        e.o = y, e.j = h, t.push(e);
      }
      return t;
    } };
    return l;
  }();
  return P;
}());
const D = QrCreator;
var W = Object.defineProperty, X = Object.getOwnPropertyDescriptor, S = (E, d, P, m) => {
  for (var C = m > 1 ? void 0 : m ? X(d, P) : d, g = E.length - 1, x; g >= 0; g--)
    (x = E[g]) && (C = (m ? x(d, P, C) : x(C)) || C);
  return m && C && W(d, P, C), C;
};
const R = class R extends B {
  constructor() {
    super(...arguments), this.value = "", this.label = "", this.size = 128, this.fill = "black", this.background = "white", this.radius = 0, this.errorCorrection = "H";
  }
  firstUpdated() {
    this.generate();
  }
  generate() {
    this.hasUpdated && D.render(
      {
        background: this.background,
        ecLevel: this.errorCorrection,
        fill: this.fill,
        radius: this.radius,
        // We draw the canvas larger and scale its container down to avoid blurring on high-density displays
        size: this.size * 2,
        text: this.value
      },
      this.canvas
    );
  }
  render() {
    var d;
    return Q`
      <canvas
        part="base"
        class="qr-code"
        role="img"
        aria-label=${((d = this.label) == null ? void 0 : d.length) > 0 ? this.label : this.value}
        style=${I({
      height: `${this.size}px`,
      width: `${this.size}px`
    })}
      ></canvas>
    `;
  }
};
R.styles = [V, K];
let T = R;
S([
  U("canvas")
], T.prototype, "canvas", 2);
S([
  G()
], T.prototype, "value", 2);
S([
  G()
], T.prototype, "label", 2);
S([
  G({ type: Number })
], T.prototype, "size", 2);
S([
  G()
], T.prototype, "fill", 2);
S([
  G()
], T.prototype, "background", 2);
S([
  G({ type: Number })
], T.prototype, "radius", 2);
S([
  G({ attribute: "error-correction" })
], T.prototype, "errorCorrection", 2);
S([
  J(["background", "errorCorrection", "fill", "radius", "size", "value"])
], T.prototype, "generate", 1);
export {
  T as default
};
