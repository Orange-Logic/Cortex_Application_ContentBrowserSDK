import { C as G, c as O } from "../chunks/custom-element.X6y1saJZ.js";
import { c as U } from "../chunks/component.styles.BLcT4bOa.js";
import { d as K } from "../chunks/debounce.DZNkg8Q5.js";
import { d as W } from "../chunks/default-value.BaUjiOTd.js";
import { d as F } from "../chunks/drag.BixfMdxr.js";
import { F as X } from "../chunks/form.CBFaCEBn.js";
import { c as m } from "../chunks/math.DqTA6ya4.js";
import { w as R } from "../chunks/watch.ChG-_stu.js";
import { i as Y, x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as d } from "../chunks/property.CtZ87in4.js";
import { r as w } from "../chunks/state.-o_YRGMi.js";
import { t as Z } from "../chunks/event-options.CYHYGOd8.js";
import { e as $ } from "../chunks/query.BNveAlQo.js";
import { e as _ } from "../chunks/class-map.Cn0czwWq.js";
import { o as S } from "../chunks/if-defined.D8U9hdvp.js";
import { o as x } from "../chunks/style-map.De8UQbPP.js";
import { n as J } from "../chunks/when.CDK1Tt5Y.js";
import { L as Q } from "../chunks/localize.D5Yoww6T.js";
import tt from "./button.js";
import et from "./button-group.js";
import rt from "./dropdown.js";
import it from "./icon.js";
import st from "./input.js";
import at from "./spinner.js";
import ot from "./visually-hidden.js";
function p(r, t) {
  nt(r) && (r = "100%");
  const e = lt(r);
  return r = t === 360 ? r : Math.min(t, Math.max(0, parseFloat(r))), e && (r = parseInt(String(r * t), 10) / 100), Math.abs(r - t) < 1e-6 ? 1 : (t === 360 ? r = (r < 0 ? r % t + t : r % t) / parseFloat(String(t)) : r = r % t / parseFloat(String(t)), r);
}
function M(r) {
  return Math.min(1, Math.max(0, r));
}
function nt(r) {
  return typeof r == "string" && r.indexOf(".") !== -1 && parseFloat(r) === 1;
}
function lt(r) {
  return typeof r == "string" && r.indexOf("%") !== -1;
}
function T(r) {
  return r = parseFloat(r), (isNaN(r) || r < 0 || r > 1) && (r = 1), r;
}
function C(r) {
  return Number(r) <= 1 ? `${Number(r) * 100}%` : r;
}
function k(r) {
  return r.length === 1 ? "0" + r : String(r);
}
function ht(r, t, e) {
  return {
    r: p(r, 255) * 255,
    g: p(t, 255) * 255,
    b: p(e, 255) * 255
  };
}
function I(r, t, e) {
  r = p(r, 255), t = p(t, 255), e = p(e, 255);
  const i = Math.max(r, t, e), s = Math.min(r, t, e);
  let a = 0, o = 0;
  const l = (i + s) / 2;
  if (i === s)
    o = 0, a = 0;
  else {
    const c = i - s;
    switch (o = l > 0.5 ? c / (2 - i - s) : c / (i + s), i) {
      case r:
        a = (t - e) / c + (t < e ? 6 : 0);
        break;
      case t:
        a = (e - r) / c + 2;
        break;
      case e:
        a = (r - t) / c + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: o, l };
}
function E(r, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? r + (t - r) * (6 * e) : e < 1 / 2 ? t : e < 2 / 3 ? r + (t - r) * (2 / 3 - e) * 6 : r;
}
function ct(r, t, e) {
  let i, s, a;
  if (r = p(r, 360), t = p(t, 100), e = p(e, 100), t === 0)
    s = e, a = e, i = e;
  else {
    const o = e < 0.5 ? e * (1 + t) : e + t - e * t, l = 2 * e - o;
    i = E(l, o, r + 1 / 3), s = E(l, o, r), a = E(l, o, r - 1 / 3);
  }
  return { r: i * 255, g: s * 255, b: a * 255 };
}
function B(r, t, e) {
  r = p(r, 255), t = p(t, 255), e = p(e, 255);
  const i = Math.max(r, t, e), s = Math.min(r, t, e);
  let a = 0;
  const o = i, l = i - s, c = i === 0 ? 0 : l / i;
  if (i === s)
    a = 0;
  else {
    switch (i) {
      case r:
        a = (t - e) / l + (t < e ? 6 : 0);
        break;
      case t:
        a = (e - r) / l + 2;
        break;
      case e:
        a = (r - t) / l + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: c, v: o };
}
function ut(r, t, e) {
  r = p(r, 360) * 6, t = p(t, 100), e = p(e, 100);
  const i = Math.floor(r), s = r - i, a = e * (1 - t), o = e * (1 - s * t), l = e * (1 - (1 - s) * t), c = i % 6, V = [e, o, a, a, l, e][c], A = [l, e, e, o, a, a][c], q = [a, a, l, e, e, o][c];
  return { r: V * 255, g: A * 255, b: q * 255 };
}
function P(r, t, e, i) {
  const s = [
    k(Math.round(r).toString(16)),
    k(Math.round(t).toString(16)),
    k(Math.round(e).toString(16))
  ];
  return i && s[0].startsWith(s[0].charAt(1)) && s[1].startsWith(s[1].charAt(1)) && s[2].startsWith(s[2].charAt(1)) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("");
}
function dt(r, t, e, i, s) {
  const a = [
    k(Math.round(r).toString(16)),
    k(Math.round(t).toString(16)),
    k(Math.round(e).toString(16)),
    k(gt(i))
  ];
  return s && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1)) && a[3].startsWith(a[3].charAt(1)) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0) : a.join("");
}
function pt(r, t, e, i) {
  const s = r / 100, a = t / 100, o = e / 100, l = i / 100, c = 255 * (1 - s) * (1 - l), V = 255 * (1 - a) * (1 - l), A = 255 * (1 - o) * (1 - l);
  return { r: c, g: V, b: A };
}
function L(r, t, e) {
  let i = 1 - r / 255, s = 1 - t / 255, a = 1 - e / 255, o = Math.min(i, s, a);
  return o === 1 ? (i = 0, s = 0, a = 0) : (i = (i - o) / (1 - o) * 100, s = (s - o) / (1 - o) * 100, a = (a - o) / (1 - o) * 100), o *= 100, {
    c: Math.round(i),
    m: Math.round(s),
    y: Math.round(a),
    k: Math.round(o)
  };
}
function gt(r) {
  return Math.round(parseFloat(r) * 255).toString(16);
}
function N(r) {
  return b(r) / 255;
}
function b(r) {
  return parseInt(r, 16);
}
function ft(r) {
  return {
    r: r >> 16,
    g: (r & 65280) >> 8,
    b: r & 255
  };
}
const z = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function bt(r) {
  let t = { r: 0, g: 0, b: 0 }, e = 1, i = null, s = null, a = null, o = !1, l = !1;
  return typeof r == "string" && (r = xt(r)), typeof r == "object" && (f(r.r) && f(r.g) && f(r.b) ? (t = ht(r.r, r.g, r.b), o = !0, l = String(r.r).substr(-1) === "%" ? "prgb" : "rgb") : f(r.h) && f(r.s) && f(r.v) ? (i = C(r.s), s = C(r.v), t = ut(r.h, i, s), o = !0, l = "hsv") : f(r.h) && f(r.s) && f(r.l) ? (i = C(r.s), a = C(r.l), t = ct(r.h, i, a), o = !0, l = "hsl") : f(r.c) && f(r.m) && f(r.y) && f(r.k) && (t = pt(r.c, r.m, r.y, r.k), o = !0, l = "cmyk"), Object.prototype.hasOwnProperty.call(r, "a") && (e = r.a)), e = T(e), {
    ok: o,
    format: r.format || l,
    r: Math.min(255, Math.max(t.r, 0)),
    g: Math.min(255, Math.max(t.g, 0)),
    b: Math.min(255, Math.max(t.b, 0)),
    a: e
  };
}
const mt = "[-\\+]?\\d+%?", vt = "[-\\+]?\\d*\\.\\d+%?", y = "(?:" + vt + ")|(?:" + mt + ")", D = "[\\s|\\(]+(" + y + ")[,|\\s]+(" + y + ")[,|\\s]+(" + y + ")\\s*\\)?", H = (
  // eslint-disable-next-line prettier/prettier
  "[\\s|\\(]+(" + y + ")[,|\\s]+(" + y + ")[,|\\s]+(" + y + ")[,|\\s]+(" + y + ")\\s*\\)?"
), v = {
  CSS_UNIT: new RegExp(y),
  rgb: new RegExp("rgb" + D),
  rgba: new RegExp("rgba" + H),
  hsl: new RegExp("hsl" + D),
  hsla: new RegExp("hsla" + H),
  hsv: new RegExp("hsv" + D),
  hsva: new RegExp("hsva" + H),
  cmyk: new RegExp("cmyk" + H),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function xt(r) {
  if (r = r.trim().toLowerCase(), r.length === 0)
    return !1;
  let t = !1;
  if (z[r])
    r = z[r], t = !0;
  else if (r === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  let e = v.rgb.exec(r);
  return e ? { r: e[1], g: e[2], b: e[3] } : (e = v.rgba.exec(r), e ? { r: e[1], g: e[2], b: e[3], a: e[4] } : (e = v.hsl.exec(r), e ? { h: e[1], s: e[2], l: e[3] } : (e = v.hsla.exec(r), e ? { h: e[1], s: e[2], l: e[3], a: e[4] } : (e = v.hsv.exec(r), e ? { h: e[1], s: e[2], v: e[3] } : (e = v.hsva.exec(r), e ? { h: e[1], s: e[2], v: e[3], a: e[4] } : (e = v.cmyk.exec(r), e ? {
    c: e[1],
    m: e[2],
    y: e[3],
    k: e[4]
  } : (e = v.hex8.exec(r), e ? {
    r: b(e[1]),
    g: b(e[2]),
    b: b(e[3]),
    a: N(e[4]),
    format: t ? "name" : "hex8"
  } : (e = v.hex6.exec(r), e ? {
    r: b(e[1]),
    g: b(e[2]),
    b: b(e[3]),
    format: t ? "name" : "hex"
  } : (e = v.hex4.exec(r), e ? {
    r: b(e[1] + e[1]),
    g: b(e[2] + e[2]),
    b: b(e[3] + e[3]),
    a: N(e[4] + e[4]),
    format: t ? "name" : "hex8"
  } : (e = v.hex3.exec(r), e ? {
    r: b(e[1] + e[1]),
    g: b(e[2] + e[2]),
    b: b(e[3] + e[3]),
    format: t ? "name" : "hex"
  } : !1))))))))));
}
function f(r) {
  return typeof r == "number" ? !Number.isNaN(r) : v.CSS_UNIT.test(r);
}
class u {
  constructor(t = "", e = {}) {
    if (t instanceof u)
      return t;
    typeof t == "number" && (t = ft(t)), this.originalInput = t;
    const i = bt(t);
    this.originalInput = t, this.r = i.r, this.g = i.g, this.b = i.b, this.a = i.a, this.roundA = Math.round(100 * this.a) / 100, this.format = e.format ?? i.format, this.gradientType = e.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = i.ok;
  }
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return !this.isDark();
  }
  /**
   * Returns the perceived brightness of the color, from 0-255.
   */
  getBrightness() {
    const t = this.toRgb();
    return (t.r * 299 + t.g * 587 + t.b * 114) / 1e3;
  }
  /**
   * Returns the perceived luminance of a color, from 0-1.
   */
  getLuminance() {
    const t = this.toRgb();
    let e, i, s;
    const a = t.r / 255, o = t.g / 255, l = t.b / 255;
    return a <= 0.03928 ? e = a / 12.92 : e = Math.pow((a + 0.055) / 1.055, 2.4), o <= 0.03928 ? i = o / 12.92 : i = Math.pow((o + 0.055) / 1.055, 2.4), l <= 0.03928 ? s = l / 12.92 : s = Math.pow((l + 0.055) / 1.055, 2.4), 0.2126 * e + 0.7152 * i + 0.0722 * s;
  }
  /**
   * Returns the alpha value of a color, from 0-1.
   */
  getAlpha() {
    return this.a;
  }
  /**
   * Sets the alpha value on the current color.
   *
   * @param alpha - The new alpha value. The accepted range is 0-1.
   */
  setAlpha(t) {
    return this.a = T(t), this.roundA = Math.round(100 * this.a) / 100, this;
  }
  /**
   * Returns whether the color is monochrome.
   */
  isMonochrome() {
    const { s: t } = this.toHsl();
    return t === 0;
  }
  /**
   * Returns the object as a HSVA object.
   */
  toHsv() {
    const t = B(this.r, this.g, this.b);
    return { h: t.h * 360, s: t.s, v: t.v, a: this.a };
  }
  /**
   * Returns the hsva values interpolated into a string with the following format:
   * "hsva(xxx, xxx, xxx, xx)".
   */
  toHsvString() {
    const t = B(this.r, this.g, this.b), e = Math.round(t.h * 360), i = Math.round(t.s * 100), s = Math.round(t.v * 100);
    return this.a === 1 ? `hsv(${e}, ${i}%, ${s}%)` : `hsva(${e}, ${i}%, ${s}%, ${this.roundA})`;
  }
  /**
   * Returns the object as a HSLA object.
   */
  toHsl() {
    const t = I(this.r, this.g, this.b);
    return { h: t.h * 360, s: t.s, l: t.l, a: this.a };
  }
  /**
   * Returns the hsla values interpolated into a string with the following format:
   * "hsla(xxx, xxx, xxx, xx)".
   */
  toHslString() {
    const t = I(this.r, this.g, this.b), e = Math.round(t.h * 360), i = Math.round(t.s * 100), s = Math.round(t.l * 100);
    return this.a === 1 ? `hsl(${e}, ${i}%, ${s}%)` : `hsla(${e}, ${i}%, ${s}%, ${this.roundA})`;
  }
  /**
   * Returns the hex value of the color.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  toHex(t = !1) {
    return P(this.r, this.g, this.b, t);
  }
  /**
   * Returns the hex value of the color -with a # prefixed.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  toHexString(t = !1) {
    return "#" + this.toHex(t);
  }
  /**
   * Returns the hex 8 value of the color.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  toHex8(t = !1) {
    return dt(this.r, this.g, this.b, this.a, t);
  }
  /**
   * Returns the hex 8 value of the color -with a # prefixed.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  toHex8String(t = !1) {
    return "#" + this.toHex8(t);
  }
  /**
   * Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
   * @param allowShortChar will shorten hex value to 3 or 4 char if possible
   */
  toHexShortString(t = !1) {
    return this.a === 1 ? this.toHexString(t) : this.toHex8String(t);
  }
  /**
   * Returns the object as a RGBA object.
   */
  toRgb() {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a
    };
  }
  /**
   * Returns the RGBA values interpolated into a string with the following format:
   * "RGBA(xxx, xxx, xxx, xx)".
   */
  toRgbString() {
    const t = Math.round(this.r), e = Math.round(this.g), i = Math.round(this.b);
    return this.a === 1 ? `rgb(${t}, ${e}, ${i})` : `rgba(${t}, ${e}, ${i}, ${this.roundA})`;
  }
  /**
   * Returns the object as a RGBA object.
   */
  toPercentageRgb() {
    const t = (e) => `${Math.round(p(e, 255) * 100)}%`;
    return {
      r: t(this.r),
      g: t(this.g),
      b: t(this.b),
      a: this.a
    };
  }
  /**
   * Returns the RGBA relative values interpolated into a string
   */
  toPercentageRgbString() {
    const t = (e) => Math.round(p(e, 255) * 100);
    return this.a === 1 ? `rgb(${t(this.r)}%, ${t(this.g)}%, ${t(this.b)}%)` : `rgba(${t(this.r)}%, ${t(this.g)}%, ${t(this.b)}%, ${this.roundA})`;
  }
  toCmyk() {
    return {
      ...L(this.r, this.g, this.b)
    };
  }
  toCmykString() {
    const { c: t, m: e, y: i, k: s } = L(this.r, this.g, this.b);
    return `cmyk(${t}, ${e}, ${i}, ${s})`;
  }
  /**
   * The 'real' name of the color -if there is one.
   */
  toName() {
    if (this.a === 0)
      return "transparent";
    if (this.a < 1)
      return !1;
    const t = "#" + P(this.r, this.g, this.b, !1);
    for (const [e, i] of Object.entries(z))
      if (t === i)
        return e;
    return !1;
  }
  toString(t) {
    const e = !!t;
    t = t ?? this.format;
    let i = !1;
    const s = this.a < 1 && this.a >= 0;
    return !e && s && (t.startsWith("hex") || t === "name") ? t === "name" && this.a === 0 ? this.toName() : this.toRgbString() : (t === "rgb" && (i = this.toRgbString()), t === "prgb" && (i = this.toPercentageRgbString()), (t === "hex" || t === "hex6") && (i = this.toHexString()), t === "hex3" && (i = this.toHexString(!0)), t === "hex4" && (i = this.toHex8String(!0)), t === "hex8" && (i = this.toHex8String()), t === "name" && (i = this.toName()), t === "hsl" && (i = this.toHslString()), t === "hsv" && (i = this.toHsvString()), t === "cmyk" && (i = this.toCmykString()), i || this.toHexString());
  }
  toNumber() {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  }
  clone() {
    return new u(this.toString());
  }
  /**
   * Lighten the color a given amount. Providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  lighten(t = 10) {
    const e = this.toHsl();
    return e.l += t / 100, e.l = M(e.l), new u(e);
  }
  /**
   * Brighten the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  brighten(t = 10) {
    const e = this.toRgb();
    return e.r = Math.max(0, Math.min(255, e.r - Math.round(255 * -(t / 100)))), e.g = Math.max(0, Math.min(255, e.g - Math.round(255 * -(t / 100)))), e.b = Math.max(0, Math.min(255, e.b - Math.round(255 * -(t / 100)))), new u(e);
  }
  /**
   * Darken the color a given amount, from 0 to 100.
   * Providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  darken(t = 10) {
    const e = this.toHsl();
    return e.l -= t / 100, e.l = M(e.l), new u(e);
  }
  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  tint(t = 10) {
    return this.mix("white", t);
  }
  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  shade(t = 10) {
    return this.mix("black", t);
  }
  /**
   * Desaturate the color a given amount, from 0 to 100.
   * Providing 100 will is the same as calling greyscale
   * @param amount - valid between 1-100
   */
  desaturate(t = 10) {
    const e = this.toHsl();
    return e.s -= t / 100, e.s = M(e.s), new u(e);
  }
  /**
   * Saturate the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  saturate(t = 10) {
    const e = this.toHsl();
    return e.s += t / 100, e.s = M(e.s), new u(e);
  }
  /**
   * Completely desaturates a color into greyscale.
   * Same as calling `desaturate(100)`
   */
  greyscale() {
    return this.desaturate(100);
  }
  /**
   * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
   * Values outside of this range will be wrapped into this range.
   */
  spin(t) {
    const e = this.toHsl(), i = (e.h + t) % 360;
    return e.h = i < 0 ? 360 + i : i, new u(e);
  }
  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  mix(t, e = 50) {
    const i = this.toRgb(), s = new u(t).toRgb(), a = e / 100, o = {
      r: (s.r - i.r) * a + i.r,
      g: (s.g - i.g) * a + i.g,
      b: (s.b - i.b) * a + i.b,
      a: (s.a - i.a) * a + i.a
    };
    return new u(o);
  }
  analogous(t = 6, e = 30) {
    const i = this.toHsl(), s = 360 / e, a = [this];
    for (i.h = (i.h - (s * t >> 1) + 720) % 360; --t; )
      i.h = (i.h + s) % 360, a.push(new u(i));
    return a;
  }
  /**
   * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
   */
  complement() {
    const t = this.toHsl();
    return t.h = (t.h + 180) % 360, new u(t);
  }
  monochromatic(t = 6) {
    const e = this.toHsv(), { h: i } = e, { s } = e;
    let { v: a } = e;
    const o = [], l = 1 / t;
    for (; t--; )
      o.push(new u({ h: i, s, v: a })), a = (a + l) % 1;
    return o;
  }
  splitcomplement() {
    const t = this.toHsl(), { h: e } = t;
    return [
      this,
      new u({ h: (e + 72) % 360, s: t.s, l: t.l }),
      new u({ h: (e + 216) % 360, s: t.s, l: t.l })
    ];
  }
  /**
   * Compute how the color would appear on a background
   */
  onBackground(t) {
    const e = this.toRgb(), i = new u(t).toRgb(), s = e.a + i.a * (1 - e.a);
    return new u({
      r: (e.r * e.a + i.r * i.a * (1 - e.a)) / s,
      g: (e.g * e.a + i.g * i.a * (1 - e.a)) / s,
      b: (e.b * e.a + i.b * i.a * (1 - e.a)) / s,
      a: s
    });
  }
  /**
   * Alias for `polyad(3)`
   */
  triad() {
    return this.polyad(3);
  }
  /**
   * Alias for `polyad(4)`
   */
  tetrad() {
    return this.polyad(4);
  }
  /**
   * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
   * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
   */
  polyad(t) {
    const e = this.toHsl(), { h: i } = e, s = [this], a = 360 / t;
    for (let o = 1; o < t; o++)
      s.push(new u({ h: (i + o * a) % 360, s: e.s, l: e.l }));
    return s;
  }
  /**
   * compare color vs current color
   */
  equals(t) {
    const e = new u(t);
    return this.format === "cmyk" || e.format === "cmyk" ? this.toCmykString() === e.toCmykString() : this.toRgbString() === e.toRgbString();
  }
}
const yt = Y`
  :host {
    --grid-width: 280px;
    --grid-height: 200px;
    --grid-handle-size: 16px;
    --slider-height: 15px;
    --slider-handle-size: 17px;
    --swatch-size: 25px;

    --control-border-color: var(--cx-color-neutral-300);
    --control-button-color: var(--cx-color-neutral-0);
    --control-caret-color: var(--cx-color-neutral-800);

    display: inline-block;
  }

  .color-picker {
    width: var(--grid-width);
    font-family: var(--cx-font-sans);
    font-size: var(--cx-font-size-medium);
    font-weight: var(--cx-font-weight-regular);
    color: var(--color);
    background-color: var(--cx-panel-background-color);
    border-radius: var(--cx-border-radius-small);
    user-select: none;
    -webkit-user-select: none;
  }

  .color-picker--inline {
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
  }

  .color-picker--inline:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .color-picker__grid {
    position: relative;
    height: var(--grid-height);
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%
      ),
      linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    border-top-left-radius: var(--cx-border-radius-small);
    border-top-right-radius: var(--cx-border-radius-small);
    cursor: crosshair;
    forced-color-adjust: none;
  }

  .color-picker__grid-handle {
    position: absolute;
    width: var(--grid-handle-size);
    height: var(--grid-handle-size);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    border: solid 2px white;
    margin-top: calc(var(--grid-handle-size) / -2);
    margin-left: calc(var(--grid-handle-size) / -2);
    transition: var(--cx-transition-fast) scale;
  }

  .color-picker__grid-handle--dragging {
    cursor: none;
    scale: 1.5;
  }

  .color-picker__grid-handle:focus-visible {
    outline: var(--cx-focus-ring);
  }

  .color-picker__controls {
    padding: var(--cx-spacing-small);
    display: flex;
    align-items: center;
    gap: var(--cx-spacing-small);
  }

  .color-picker__sliders {
    flex: 1 1 auto;
  }

  .color-picker__slider {
    position: relative;
    height: var(--slider-height);
    border-radius: var(--cx-border-radius-pill);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    forced-color-adjust: none;
  }

  .color-picker__slider:not(:last-of-type) {
    margin-bottom: var(--cx-spacing-small);
  }

  .color-picker__slider-handle {
    position: absolute;
    top: calc(50% - var(--slider-handle-size) / 2);
    width: var(--slider-handle-size);
    height: var(--slider-handle-size);
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    margin-left: calc(var(--slider-handle-size) / -2);
  }

  .color-picker__slider-handle:focus-visible {
    outline: var(--cx-focus-ring);
  }

  .color-picker__hue {
    background-image: linear-gradient(
      to right,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 17%,
      rgb(0, 255, 0) 33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 67%,
      rgb(255, 0, 255) 83%,
      rgb(255, 0, 0) 100%
    );
  }

  .color-picker__alpha .color-picker__alpha-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .color-picker__preview {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--cx-border-radius-circle);
    position: relative;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-picker__preview--button,
  .color-picker__preview--button::part(base) {
    border-radius: var(--cx-border-radius-small);
  }

  .color-picker__preview:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .color-picker__preview-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
  }

  .color-picker__preview-color--copied {
    animation: pulse 0.75s;
  }

  .color-picker__preview {
    width: var(--cx-input-height-medium);
    height: var(--cx-input-height-medium);
  }

  .color-picker__preview.color-picker__preview--button {
    border: solid 1px var(--control-border-color);
  }

  .color-picker__preview--small.color-picker__preview--button {
    width: var(--cx-toggle-size-small);
    height: var(--cx-toggle-size-small);
  }

  .color-picker__preview--medium.color-picker__preview--button {
    width: var(--cx-toggle-size-medium);
    height: var(--cx-toggle-size-medium);
  }

  .color-picker__preview--large.color-picker__preview--button {
    width: var(--cx-toggle-size-large);
    height: var(--cx-toggle-size-large);
  }

  .color-picker__preview:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: var(--preview-color, currentColor);
    z-index: 1;
  }

  .color-picker__preview--empty:before {
    background-color: transparent;
  }

  .color-picker__preview__transparent-bg {
    background-image: linear-gradient(
        45deg,
        var(--cx-color-neutral-300) 25%,
        transparent 25%
      ),
      linear-gradient(45deg, transparent 75%, var(--cx-color-neutral-300) 75%),
      linear-gradient(45deg, transparent 75%, var(--cx-color-neutral-300) 75%),
      linear-gradient(45deg, var(--cx-color-neutral-300) 25%, transparent 25%);
    background-size: 10px 10px;
    background-position:
      0 0,
      0 0,
      -5px -5px,
      5px 5px;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--cx-color-primary-500);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .color-picker__preview__container {
    display: flex;
    align-items: center;
  }

  .color-picker__user-input {
    display: flex;
    padding: 0 var(--cx-spacing-small) var(--cx-spacing-small)
      var(--cx-spacing-small);
  }

  .color-picker__user-input cx-input {
    min-width: 0; /* fix input width in Safari */
    flex: 1 1 auto;
  }

  .color-picker__user-input cx-button-group {
    margin-left: var(--cx-spacing-small);
  }

  .color-picker__user-input cx-button {
    min-width: 3.25rem;
    max-width: 3.25rem;
    font-size: 1rem;
  }

  .color-picker__swatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    border-top: solid 1px var(--cx-color-neutral-200);
    padding: var(--cx-spacing-small);
    forced-color-adjust: none;
  }

  .color-picker__customSwatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    padding: 0 var(--cx-spacing-small) var(--cx-spacing-small)
      var(--cx-spacing-small);
    forced-color-adjust: none;
  }

  .color-picker__customSwatches-label {
    padding: var(--cx-spacing-small);
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .color-picker__spinner {
    text-align: center;
    margin: var(--cx-spacing-small) 0;
  }

  .color-picker__swatch {
    position: relative;
    width: var(--swatch-size);
    height: var(--swatch-size);
    border-radius: var(--cx-border-radius-small);
  }

  .color-picker__swatch .color-picker__swatch-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: inherit;
    cursor: pointer;
  }

  .color-picker__swatch:focus-visible {
    outline: var(--cx-focus-ring);
    outline-offset: var(--cx-focus-ring-offset);
  }

  .color-picker--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .color-picker--disabled .color-picker__grid,
  .color-picker--disabled .color-picker__grid-handle,
  .color-picker--disabled .color-picker__slider,
  .color-picker--disabled .color-picker__slider-handle,
  .color-picker--disabled .color-picker__preview,
  .color-picker--disabled .color-picker__swatch,
  .color-picker--disabled .color-picker__swatch-color {
    pointer-events: none;
  }

  /*
   * Color dropdown
   */

  .color-dropdown::part(panel) {
    max-height: none;
    background-color: var(--cx-panel-background-color);
    border: solid var(--cx-panel-border-width) var(--cx-panel-border-color);
    border-radius: var(--cx-border-radius-small);
    overflow: visible;
  }

  .color-dropdown__trigger::part(base) {
    background-color: var(--control-button-color);
    border-color: var(--control-border-color);
    border-radius: var(--cx-border-radius-medium);
    padding-inline-start: var(--cx-spacing-2x-small);
    padding-inline-end: var(--cx-spacing-2x-small);
  }

  .color-dropdown__trigger::part(label) {
    padding-inline-start: var(--cx-spacing-2x-small);
    padding-inline-end: var(--cx-spacing-2x-small);
  }

  .color-dropdown__trigger {
    display: inline-block;
    position: relative;
    background-color: transparent;
    border: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-dropdown__trigger:focus-visible {
    outline: none;
  }

  .color-dropdown__trigger.color-dropdown__trigger--disabled {
    opacity: 0.5;
    cursor: default;
  }

  .color-dropdown__trigger-icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--control-caret-color);
    font-size: var(--cx-font-size-large);
    width: 100%;
    height: 100%;
  }

  cx-tooltip {
    display: inline-block;
  }
`;
var wt = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, h = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? _t(t, e) : t, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (s = (i ? o(t, e, s) : o(s)) || s);
  return i && s && wt(t, e, s), s;
};
const j = "EyeDropper" in window;
let n = class extends G {
  constructor() {
    super(), this.formControlController = new X(this), this.isSafeValue = !1, this.localize = new Q(this), this.hasFocus = !1, this.isDraggingGridHandle = !1, this.isEmpty = !1, this.inputValue = "", this.hue = 0, this.saturation = 100, this.brightness = 100, this.alpha = 100, this.value = "", this.defaultValue = "", this.label = "", this.variant = "default", this.format = "hex", this.inline = !1, this.size = "medium", this.noFormatToggle = !1, this.name = "", this.disabled = !1, this.hoist = !1, this.opacity = !1, this.uppercase = !1, this.clearable = !1, this.tooltip = "", this.swatches = "", this.customSwatches = "", this.loading = !1, this.creatable = !1, this.form = "", this.required = !1, this.handleFocusIn = () => {
      this.hasFocus = !0, this.emit("cx-focus");
    }, this.handleFocusOut = () => {
      this.hasFocus = !1, this.emit("cx-blur");
    }, this.addEventListener("focusin", this.handleFocusIn), this.addEventListener("focusout", this.handleFocusOut);
  }
  /** Gets the validity state object */
  get validity() {
    return this.input.validity;
  }
  /** Gets the validation message */
  get validationMessage() {
    return this.input.validationMessage;
  }
  firstUpdated() {
    this.input.updateComplete.then(() => {
      this.formControlController.updateValidity();
    });
  }
  handleCopy() {
    this.input.select(), document.execCommand("copy"), this.previewButton.focus(), this.previewButton.classList.add("color-picker__preview-color--copied"), this.previewButton.addEventListener("animationend", () => {
      this.previewButton.classList.remove(
        "color-picker__preview-color--copied"
      );
    });
  }
  handleFormatToggle() {
    const r = ["hex", "rgb", "hsl", "hsv"], t = (r.indexOf(this.format) + 1) % r.length;
    this.format = r[t], this.setColor(this.value), this.emit("cx-change"), this.emit("cx-input");
  }
  handleAlphaDrag(r) {
    const t = this.shadowRoot.querySelector(
      ".color-picker__slider.color-picker__alpha"
    ), e = t.querySelector(
      ".color-picker__slider-handle"
    ), { width: i } = t.getBoundingClientRect();
    let s = this.value, a = this.value;
    e.focus(), r.preventDefault(), F(t, {
      initialEvent: r,
      onMove: (o) => {
        this.alpha = m(o / i * 100, 0, 100), this.syncValues(), this.value !== a && (a = this.value, this.emit("cx-input"));
      },
      onStop: () => {
        this.value !== s && (s = this.value, this.emit("cx-change"));
      }
    });
  }
  handleHueDrag(r) {
    const t = this.shadowRoot.querySelector(
      ".color-picker__slider.color-picker__hue"
    ), e = t.querySelector(
      ".color-picker__slider-handle"
    ), { width: i } = t.getBoundingClientRect();
    let s = this.value, a = this.value;
    e.focus(), r.preventDefault(), F(t, {
      initialEvent: r,
      onMove: (o) => {
        this.hue = m(o / i * 360, 0, 360), this.syncValues(), this.value !== a && (a = this.value, this.emit("cx-input"));
      },
      onStop: () => {
        this.value !== s && (s = this.value, this.emit("cx-change"));
      }
    });
  }
  handleGridDrag(r) {
    const t = this.shadowRoot.querySelector(
      ".color-picker__grid"
    ), e = t.querySelector(
      ".color-picker__grid-handle"
    ), { height: i, width: s } = t.getBoundingClientRect();
    let a = this.value, o = this.value;
    e.focus(), r.preventDefault(), this.isDraggingGridHandle = !0, F(t, {
      initialEvent: r,
      onMove: (l, c) => {
        this.saturation = m(l / s * 100, 0, 100), this.brightness = m(100 - c / i * 100, 0, 100), this.syncValues(), this.value !== o && (o = this.value, this.emit("cx-input"));
      },
      onStop: () => {
        this.isDraggingGridHandle = !1, this.value !== a && (a = this.value, this.emit("cx-change"));
      }
    });
  }
  handleAlphaKeyDown(r) {
    const t = r.shiftKey ? 10 : 1, e = this.value;
    r.key === "ArrowLeft" && (r.preventDefault(), this.alpha = m(this.alpha - t, 0, 100), this.syncValues()), r.key === "ArrowRight" && (r.preventDefault(), this.alpha = m(this.alpha + t, 0, 100), this.syncValues()), r.key === "Home" && (r.preventDefault(), this.alpha = 0, this.syncValues()), r.key === "End" && (r.preventDefault(), this.alpha = 100, this.syncValues()), this.value !== e && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleHueKeyDown(r) {
    const t = r.shiftKey ? 10 : 1, e = this.value;
    r.key === "ArrowLeft" && (r.preventDefault(), this.hue = m(this.hue - t, 0, 360), this.syncValues()), r.key === "ArrowRight" && (r.preventDefault(), this.hue = m(this.hue + t, 0, 360), this.syncValues()), r.key === "Home" && (r.preventDefault(), this.hue = 0, this.syncValues()), r.key === "End" && (r.preventDefault(), this.hue = 360, this.syncValues()), this.value !== e && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleGridKeyDown(r) {
    const t = r.shiftKey ? 10 : 1, e = this.value;
    r.key === "ArrowLeft" && (r.preventDefault(), this.saturation = m(this.saturation - t, 0, 100), this.syncValues()), r.key === "ArrowRight" && (r.preventDefault(), this.saturation = m(this.saturation + t, 0, 100), this.syncValues()), r.key === "ArrowUp" && (r.preventDefault(), this.brightness = m(this.brightness + t, 0, 100), this.syncValues()), r.key === "ArrowDown" && (r.preventDefault(), this.brightness = m(this.brightness - t, 0, 100), this.syncValues()), this.value !== e && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleInputChange(r) {
    const t = r.target, e = this.value;
    r.stopPropagation(), this.input.value ? (this.setColor(t.value), t.value = this.value) : this.value = "", this.value !== e && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleInputInput(r) {
    this.formControlController.updateValidity(), r.stopPropagation(), this.debouncedSetColor();
  }
  debouncedSetColor() {
    this.setColor(this.input.value, !1);
  }
  handleInputKeyDown(r) {
    if (r.key === "Enter") {
      const t = this.value;
      this.input.value ? (this.setColor(this.input.value), this.input.value = this.value, this.value !== t && (this.emit("cx-change"), this.emit("cx-input")), setTimeout(() => this.input.select())) : this.hue = 0;
    }
  }
  handleInputInvalid(r) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(r);
  }
  handleTouchMove(r) {
    r.preventDefault();
  }
  handleClear() {
    this.value = "", this.setColor(""), this.emit("cx-change"), this.emit("cx-input"), this.emit("cx-clear");
  }
  parseColor(r) {
    if (!r) return null;
    const t = new u(r);
    if (!t.isValid)
      return null;
    const e = t.toHsl(), i = {
      a: e.a,
      h: e.h,
      l: e.l * 100,
      s: e.s * 100
    }, s = t.toRgb(), a = t.toHexString(), o = t.toHex8String(), l = t.toHsv(), c = {
      a: l.a,
      h: l.h,
      s: l.s * 100,
      v: l.v * 100
    };
    return {
      hex: this.setLetterCase(a),
      hexa: this.setLetterCase(o),
      hsl: {
        h: i.h,
        l: i.l,
        s: i.s,
        string: this.setLetterCase(
          `hsl(${Math.round(i.h)}, ${Math.round(i.s)}%, ${Math.round(
            i.l
          )}%)`
        )
      },
      hsla: {
        a: i.a,
        h: i.h,
        l: i.l,
        s: i.s,
        string: this.setLetterCase(
          `hsla(${Math.round(i.h)}, ${Math.round(i.s)}%, ${Math.round(
            i.l
          )}%, ${i.a.toFixed(2).toString()})`
        )
      },
      hsv: {
        h: c.h,
        s: c.s,
        string: this.setLetterCase(
          `hsv(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(
            c.v
          )}%)`
        ),
        v: c.v
      },
      hsva: {
        a: c.a,
        h: c.h,
        s: c.s,
        string: this.setLetterCase(
          `hsva(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(
            c.v
          )}%, ${c.a.toFixed(2).toString()})`
        ),
        v: c.v
      },
      rgb: {
        b: s.b,
        g: s.g,
        r: s.r,
        string: this.setLetterCase(
          `rgb(${Math.round(s.r)}, ${Math.round(s.g)}, ${Math.round(
            s.b
          )})`
        )
      },
      rgba: {
        a: s.a,
        b: s.b,
        g: s.g,
        r: s.r,
        string: this.setLetterCase(
          `rgba(${Math.round(s.r)}, ${Math.round(s.g)}, ${Math.round(
            s.b
          )}, ${s.a.toFixed(2).toString()})`
        )
      }
    };
  }
  setColor(r, t = !0) {
    const e = this.parseColor(r);
    return e === null ? !1 : (this.hue = e.hsva.h, this.saturation = e.hsva.s, this.brightness = e.hsva.v, this.alpha = this.opacity ? e.hsva.a * 100 : 100, t && this.syncValues(), !0);
  }
  setLetterCase(r) {
    return typeof r != "string" ? "" : this.uppercase ? r.toUpperCase() : r.toLowerCase();
  }
  async syncValues() {
    const r = this.parseColor(
      `hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha / 100})`
    );
    r !== null && (this.format === "hsl" ? this.inputValue = this.opacity ? r.hsla.string : r.hsl.string : this.format === "rgb" ? this.inputValue = this.opacity ? r.rgba.string : r.rgb.string : this.format === "hsv" ? this.inputValue = this.opacity ? r.hsva.string : r.hsv.string : this.inputValue = this.opacity ? r.hexa : r.hex, this.isSafeValue = !0, this.value = this.inputValue, await this.updateComplete, this.isSafeValue = !1);
  }
  handleAfterHide() {
    this.previewButton.classList.remove("color-picker__preview-color--copied");
  }
  handleEyeDropper() {
    if (!j)
      return;
    new EyeDropper().open().then((t) => {
      const e = this.value;
      this.setColor(t.sRGBHex), this.value !== e && (this.emit("cx-change"), this.emit("cx-input"));
    }).catch(() => {
    });
  }
  handleSwatchAdd() {
    this.emit("cx-swatch-add", {
      cancelable: !0,
      detail: {
        color: this.getHexString(
          this.hue,
          this.saturation,
          this.brightness,
          this.alpha
        )
      }
    }).defaultPrevented || (Array.isArray(this.customSwatches) ? this.customSwatches = [...this.customSwatches, this.value] : this.customSwatches = `${this.customSwatches};${this.value}`.trim());
  }
  selectSwatch(r) {
    const t = this.value;
    this.disabled || (this.setColor(r), this.value !== t && (this.emit("cx-change"), this.emit("cx-input")));
  }
  /** Generates a hex string from HSV values. Hue must be 0-360. All other arguments must be 0-100. */
  getHexString(r, t, e, i = 100) {
    const s = new u(
      `hsva(${r}, ${t}%, ${e}%, ${i / 100})`
    );
    return s.isValid ? s.toHex8String() : "";
  }
  // Prevents nested components from leaking events
  stopNestedEventPropagation(r) {
    r.stopImmediatePropagation();
  }
  handleFormatChange() {
    this.syncValues();
  }
  handleOpacityChange() {
    this.alpha = 100;
  }
  handleValueChange(r, t) {
    if (this.isEmpty = !t, t || (this.hue = 0, this.saturation = 0, this.brightness = 100, this.alpha = 100), !this.isSafeValue) {
      const e = this.parseColor(t);
      e !== null ? (this.inputValue = this.value, this.hue = e.hsva.h, this.saturation = e.hsva.s, this.brightness = e.hsva.v, this.alpha = e.hsva.a * 100, this.syncValues()) : this.inputValue = r ?? "";
    }
  }
  /** Sets focus on the color picker. */
  focus(r) {
    this.inline ? this.base.focus(r) : this.trigger.focus(r);
  }
  /** Removes focus from the color picker. */
  blur() {
    var t;
    const r = this.inline ? this.base : this.trigger;
    this.hasFocus && (r.focus({ preventScroll: !0 }), r.blur()), (t = this.dropdown) != null && t.open && this.dropdown.hide();
  }
  /** Returns the current value as a string in the specified format. */
  getFormattedValue(r = "hex") {
    const t = this.parseColor(
      `hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha / 100})`
    );
    if (t === null)
      return "";
    switch (r) {
      case "hex":
        return t.hex;
      case "hexa":
        return t.hexa;
      case "rgb":
        return t.rgb.string;
      case "rgba":
        return t.rgba.string;
      case "hsl":
        return t.hsl.string;
      case "hsla":
        return t.hsla.string;
      case "hsv":
        return t.hsv.string;
      case "hsva":
        return t.hsva.string;
      default:
        return "";
    }
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    return this.input.checkValidity();
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return !this.inline && !this.validity.valid ? (this.dropdown.show(), this.addEventListener(
      "cx-after-show",
      () => this.input.reportValidity(),
      { once: !0 }
    ), this.disabled || this.formControlController.emitInvalidEvent(), !1) : this.input.reportValidity();
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(r) {
    this.input.setCustomValidity(r), this.formControlController.updateValidity();
  }
  renderSwatches(r) {
    return r.map((t) => {
      const e = this.parseColor(t);
      return e ? g`
        <div
          part="swatch"
          class="color-picker__swatch color-picker__transparent-bg"
          tabindex=${S(this.disabled ? void 0 : "0")}
          role="button"
          aria-label=${t}
          @click=${() => this.selectSwatch(t)}
          @keydown=${(i) => !this.disabled && i.key === "Enter" && this.setColor(e.hexa)}
        >
          <div
            class="color-picker__swatch-color"
            style=${x({ backgroundColor: e.hexa })}
          ></div>
        </div>
      ` : (console.error(`Unable to parse swatch color: "${t}"`, this), "");
    });
  }
  render() {
    var l;
    const r = this.saturation, t = 100 - this.brightness, e = this.swatches ? Array.isArray(this.swatches) ? this.swatches : this.swatches.split(";").filter((c) => c.trim() !== "") : [], i = this.customSwatches ? Array.isArray(this.customSwatches) ? this.customSwatches : this.customSwatches.split(";").filter((c) => c.trim() !== "") : [], s = g`
      <div
        part="base"
        class=${_({
      "color-picker": !0,
      "color-picker--disabled": this.disabled,
      "color-picker--focused": this.hasFocus,
      "color-picker--inline": this.inline
    })}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-labelledby="label"
        tabindex=${this.inline ? "0" : "-1"}
      >
        ${this.inline ? g`
              <cx-visually-hidden id="label">
                <slot name="label">${this.label}</slot>
              </cx-visually-hidden>
            ` : null}

        <div
          part="grid"
          class="color-picker__grid"
          style=${x({
      backgroundColor: this.getHexString(this.hue, 100, 100)
    })}
          @pointerdown=${this.handleGridDrag}
          @touchmove=${this.handleTouchMove}
        >
          <span
            part="grid-handle"
            class=${_({
      "color-picker__grid-handle": !0,
      "color-picker__grid-handle--dragging": this.isDraggingGridHandle
    })}
            style=${x({
      backgroundColor: this.getHexString(
        this.hue,
        this.saturation,
        this.brightness,
        this.alpha
      ),
      left: `${r}%`,
      top: `${t}%`
    })}
            role="application"
            aria-label="HSV"
            tabindex=${S(this.disabled ? void 0 : "0")}
            @keydown=${this.handleGridKeyDown}
          ></span>
        </div>

        <div class="color-picker__controls">
          <div class="color-picker__sliders">
            <div
              part="slider hue-slider"
              class="color-picker__hue color-picker__slider"
              @pointerdown=${this.handleHueDrag}
              @touchmove=${this.handleTouchMove}
            >
              <span
                part="slider-handle hue-slider-handle"
                class="color-picker__slider-handle"
                style=${x({
      left: `${this.hue === 0 ? 0 : 100 / (360 / this.hue)}%`
    })}
                role="slider"
                aria-label="hue"
                aria-orientation="horizontal"
                aria-valuemin="0"
                aria-valuemax="360"
                aria-valuenow=${`${Math.round(this.hue)}`}
                tabindex=${S(this.disabled ? void 0 : "0")}
                @keydown=${this.handleHueKeyDown}
              ></span>
            </div>

            ${this.opacity ? g`
                  <div
                    part="slider opacity-slider"
                    class="color-picker__alpha color-picker__slider color-picker__transparent-bg"
                    @pointerdown="${this.handleAlphaDrag}"
                    @touchmove=${this.handleTouchMove}
                  >
                    <div
                      class="color-picker__alpha-gradient"
                      style=${x({
      backgroundImage: `linear-gradient(
                          to right,
                          ${this.getHexString(
        this.hue,
        this.saturation,
        this.brightness,
        0
      )} 0%,
                          ${this.getHexString(
        this.hue,
        this.saturation,
        this.brightness,
        100
      )} 100%
                        )`
    })}
                    ></div>
                    <span
                      part="slider-handle opacity-slider-handle"
                      class="color-picker__slider-handle"
                      style=${x({
      left: `${this.alpha}%`
    })}
                      role="slider"
                      aria-label="alpha"
                      aria-orientation="horizontal"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${Math.round(this.alpha)}
                      tabindex=${S(this.disabled ? void 0 : "0")}
                      @keydown=${this.handleAlphaKeyDown}
                    ></span>
                  </div>
                ` : ""}
          </div>

          <div class="color-picker__preview__container">
            <button
              type="button"
              part="preview"
              class=${_({
      "color-picker__preview": !0,
      "color-picker__preview--button": this.variant === "button",
      "color-picker__preview--empty": this.isEmpty,
      "color-picker__preview__transparent-bg": this.isEmpty
    })}
              aria-label=${this.localize.term("copy")}
              style=${x({
      "--preview-color": this.getHexString(
        this.hue,
        this.saturation,
        this.brightness,
        this.alpha
      )
    })}
              @click=${this.handleCopy}
            ></button>

            ${this.clearable ? g`
                  <cx-button
                    variant="text"
                    class="color-picker__clear-button"
                    part="clear-button"
                    size="small"
                    exportparts="
                      base:clear-button__base,
                      prefix:clear-button__prefix,
                      label:clear-button__label,
                      suffix:clear-button__suffix,
                      caret:clear-button__caret
                    "
                    @click=${this.handleClear}
                    @cx-blur=${this.stopNestedEventPropagation}
                    @cx-focus=${this.stopNestedEventPropagation}
                  >
                    <cx-icon
                      class="color-picker__clear-button__icon"
                      name="close"
                    ></cx-icon>
                  </cx-button>
                ` : ""}
          </div>
        </div>

        <div class="color-picker__user-input" aria-live="polite">
          <cx-input
            part="input"
            type="text"
            name=${this.name}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            value=${this.isEmpty ? "" : this.inputValue}
            ?required=${this.required}
            ?disabled=${this.disabled}
            aria-label=${this.localize.term("currentValue")}
            @keydown=${this.handleInputKeyDown}
            @cx-change=${this.handleInputChange}
            @cx-input=${this.handleInputInput}
            @cx-invalid=${this.handleInputInvalid}
            @cx-blur=${this.stopNestedEventPropagation}
            @cx-focus=${this.stopNestedEventPropagation}
          ></cx-input>

          <cx-button-group>
            ${this.noFormatToggle ? "" : g`
                  <cx-button
                    part="format-button"
                    aria-label=${this.localize.term("toggleColorFormat")}
                    exportparts="
                      base:format-button__base,
                      prefix:format-button__prefix,
                      label:format-button__label,
                      suffix:format-button__suffix,
                      caret:format-button__caret
                    "
                    @click=${this.handleFormatToggle}
                    @cx-blur=${this.stopNestedEventPropagation}
                    @cx-focus=${this.stopNestedEventPropagation}
                  >
                    ${this.setLetterCase(this.format)}
                  </cx-button>
                `}
            ${j ? g`
                  <cx-button
                    part="eye-dropper-button"
                    exportparts="
                      base:eye-dropper-button__base,
                      prefix:eye-dropper-button__prefix,
                      label:eye-dropper-button__label,
                      suffix:eye-dropper-button__suffix,
                      caret:eye-dropper-button__caret
                    "
                    @click=${this.handleEyeDropper}
                    @cx-blur=${this.stopNestedEventPropagation}
                    @cx-focus=${this.stopNestedEventPropagation}
                  >
                    <cx-icon
                      name="colorize"
                      label=${this.localize.term("selectAColorFromTheScreen")}
                    ></cx-icon>
                  </cx-button>
                ` : ""}
          </cx-button-group>
        </div>

        ${e.length > 0 ? g`
              <div part="swatches" class="color-picker__swatches">
                ${this.renderSwatches(e)}
              </div>
            ` : ""}
        ${i.length > 0 || this.creatable ? g`
              <div class="color-picker__customSwatches-label">
                Custom
                ${this.creatable ? g`<cx-button part="swatch-add-button" size="small" @click=${this.handleSwatchAdd}>Add current</cuttx-button>` : ""}
              </div>
            ` : ""}
        ${i.length > 0 ? g`
              <div part="custom-swatches" class="color-picker__customSwatches">
                ${this.renderSwatches(i)}
              </div>
            ` : ""}
        ${this.loading ? g`<div part="loading-spinner" class="color-picker__spinner">
              <cx-spinner></cx-spinner>
            </div>` : ""}
      </div>
    `, a = this.variant === "button" ? g`<cx-button
            part="trigger"
            class=${_({
      "color-dropdown__trigger": !0,
      "color-dropdown__trigger--focused": this.hasFocus
    })}
            outline
            aria-label=${this.label}
            ?disabled=${this.disabled}
            type="button"
            size=${this.size}
          >
            <div
              slot="prefix"
              part="preview"
              class=${_({
      "color-picker__preview": !0,
      "color-picker__preview--button": !0,
      "color-picker__preview--empty": this.isEmpty,
      "color-picker__preview--large": this.size === "large",
      "color-picker__preview--medium": this.size === "medium",
      "color-picker__preview--small": this.size === "small",
      "color-picker__preview__transparent-bg": !0
    })}
              style=${x({
      color: this.getHexString(
        this.hue,
        this.saturation,
        this.brightness,
        this.alpha
      )
    })}
            ></div>
            <slot
              slot="suffix"
              name="expand-icon"
              part="expand-icon"
              class="color-dropdown__trigger-icon"
            >
              <cx-icon name="expand_more"></cx-icon>
            </slot>
            <cx-visually-hidden>
              <slot name="label">${this.label}</slot>
            </cx-visually-hidden>
          </cx-button>` : g`<button
            part="trigger"
            class=${_({
      "color-picker__preview": !0,
      "color-picker__preview--empty": this.isEmpty,
      "color-picker__preview--large": this.size === "large",
      "color-picker__preview--medium": this.size === "medium",
      "color-picker__preview--small": this.size === "small",
      "color-picker__preview__transparent-bg": !0
    })}
            style=${x({
      color: this.getHexString(
        this.hue,
        this.saturation,
        this.brightness,
        this.alpha
      )
    })}
          >
            <cx-visually-hidden>
              <slot name="label">${this.label}</slot>
            </cx-visually-hidden>
          </button>`, o = J(
      this.tooltip,
      () => g`<cx-tooltip content=${this.tooltip}>
          ${a}
        </cx-tooltip>`,
      () => a
    );
    return this.inline ? s : g`
      <cx-dropdown
        aria-disabled=${this.disabled ? "true" : "false"}
        class=${_({
      "color-dropdown": !0,
      "color-dropdown--opened": !!((l = this.dropdown) != null && l.open)
    })}
        .containing-element=${this}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        @cx-after-hide=${this.handleAfterHide}
      >
        <slot name="trigger" slot="trigger">${o}</slot>
        ${s}
      </cx-dropdown>
    `;
  }
};
n.styles = [U, yt];
n.dependencies = {
  "cx-button": tt,
  "cx-button-group": et,
  "cx-dropdown": rt,
  "cx-icon": it,
  "cx-input": st,
  "cx-spinner": at,
  "cx-visually-hidden": ot
};
h([
  $('[part~="base"]')
], n.prototype, "base", 2);
h([
  $('[part~="input"]')
], n.prototype, "input", 2);
h([
  $(".color-dropdown")
], n.prototype, "dropdown", 2);
h([
  $('[part~="preview"]')
], n.prototype, "previewButton", 2);
h([
  $('[part~="trigger"]')
], n.prototype, "trigger", 2);
h([
  w()
], n.prototype, "hasFocus", 2);
h([
  w()
], n.prototype, "isDraggingGridHandle", 2);
h([
  w()
], n.prototype, "isEmpty", 2);
h([
  w()
], n.prototype, "inputValue", 2);
h([
  w()
], n.prototype, "hue", 2);
h([
  w()
], n.prototype, "saturation", 2);
h([
  w()
], n.prototype, "brightness", 2);
h([
  w()
], n.prototype, "alpha", 2);
h([
  d()
], n.prototype, "value", 2);
h([
  W()
], n.prototype, "defaultValue", 2);
h([
  d()
], n.prototype, "label", 2);
h([
  d({ reflect: !0, type: String })
], n.prototype, "variant", 2);
h([
  d()
], n.prototype, "format", 2);
h([
  d({ reflect: !0, type: Boolean })
], n.prototype, "inline", 2);
h([
  d({ reflect: !0 })
], n.prototype, "size", 2);
h([
  d({ attribute: "no-format-toggle", type: Boolean })
], n.prototype, "noFormatToggle", 2);
h([
  d()
], n.prototype, "name", 2);
h([
  d({ reflect: !0, type: Boolean })
], n.prototype, "disabled", 2);
h([
  d({ type: Boolean })
], n.prototype, "hoist", 2);
h([
  d({ type: Boolean })
], n.prototype, "opacity", 2);
h([
  d({ type: Boolean })
], n.prototype, "uppercase", 2);
h([
  d({ type: Boolean })
], n.prototype, "clearable", 2);
h([
  d({ type: String })
], n.prototype, "tooltip", 2);
h([
  d()
], n.prototype, "swatches", 2);
h([
  d({ attribute: "custom-swatches", reflect: !0 })
], n.prototype, "customSwatches", 2);
h([
  d({ reflect: !0, type: Boolean })
], n.prototype, "loading", 2);
h([
  d({ reflect: !0, type: Boolean })
], n.prototype, "creatable", 2);
h([
  d({ reflect: !0 })
], n.prototype, "form", 2);
h([
  d({ reflect: !0, type: Boolean })
], n.prototype, "required", 2);
h([
  K(300)
], n.prototype, "debouncedSetColor", 1);
h([
  Z({ passive: !1 })
], n.prototype, "handleTouchMove", 1);
h([
  R("format", { waitUntilFirstUpdate: !0 })
], n.prototype, "handleFormatChange", 1);
h([
  R("opacity", { waitUntilFirstUpdate: !0 })
], n.prototype, "handleOpacityChange", 1);
h([
  R("value")
], n.prototype, "handleValueChange", 1);
n = h([
  O("cx-color-picker")
], n);
export {
  n as default
};
