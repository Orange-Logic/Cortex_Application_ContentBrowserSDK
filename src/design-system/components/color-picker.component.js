import { C as U } from "../chunks/cortex-element.v9MiwbrF.js";
import { c as K } from "../chunks/component.styles.BLcT4bOa.js";
import { d as j } from "../chunks/debounce.DZNkg8Q5.js";
import { d as W } from "../chunks/default-value.BaUjiOTd.js";
import { d as E } from "../chunks/drag.BixfMdxr.js";
import { F as X } from "../chunks/form.CBFaCEBn.js";
import { c as v } from "../chunks/math.DqTA6ya4.js";
import { w as B } from "../chunks/watch.ChG-_stu.js";
import { x as g } from "../chunks/lit-element.DRlPF2me.js";
import { n as p } from "../chunks/property.CtZ87in4.js";
import { r as $ } from "../chunks/state.-o_YRGMi.js";
import { t as Y } from "../chunks/event-options.CYHYGOd8.js";
import { e as S } from "../chunks/query.BNveAlQo.js";
import { e as k } from "../chunks/class-map.Cn0czwWq.js";
import { o as M } from "../chunks/if-defined.D8U9hdvp.js";
import { o as x } from "../chunks/style-map.De8UQbPP.js";
import { L as Z } from "../chunks/localize.DV9I313e.js";
import J from "./button.component.js";
import Q from "./button-group.component.js";
import tt from "./dropdown.component.js";
import et from "./icon.component.js";
import st from "./input.component.js";
import it from "./spinner.component.js";
import rt from "./visually-hidden.component.js";
import at from "./color-picker.styles.js";
function f(s, t) {
  nt(s) && (s = "100%");
  const e = ot(s);
  return s = t === 360 ? s : Math.min(t, Math.max(0, parseFloat(s))), e && (s = parseInt(String(s * t), 10) / 100), Math.abs(s - t) < 1e-6 ? 1 : (t === 360 ? s = (s < 0 ? s % t + t : s % t) / parseFloat(String(t)) : s = s % t / parseFloat(String(t)), s);
}
function C(s) {
  return Math.min(1, Math.max(0, s));
}
function nt(s) {
  return typeof s == "string" && s.indexOf(".") !== -1 && parseFloat(s) === 1;
}
function ot(s) {
  return typeof s == "string" && s.indexOf("%") !== -1;
}
function G(s) {
  return s = parseFloat(s), (isNaN(s) || s < 0 || s > 1) && (s = 1), s;
}
function H(s) {
  return Number(s) <= 1 ? `${Number(s) * 100}%` : s;
}
function _(s) {
  return s.length === 1 ? "0" + s : String(s);
}
function ht(s, t, e) {
  return {
    r: f(s, 255) * 255,
    g: f(t, 255) * 255,
    b: f(e, 255) * 255
  };
}
function L(s, t, e) {
  s = f(s, 255), t = f(t, 255), e = f(e, 255);
  const i = Math.max(s, t, e), r = Math.min(s, t, e);
  let a = 0, n = 0;
  const o = (i + r) / 2;
  if (i === r)
    n = 0, a = 0;
  else {
    const u = i - r;
    switch (n = o > 0.5 ? u / (2 - i - r) : u / (i + r), i) {
      case s:
        a = (t - e) / u + (t < e ? 6 : 0);
        break;
      case t:
        a = (e - s) / u + 2;
        break;
      case e:
        a = (s - t) / u + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: n, l: o };
}
function D(s, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? s + (t - s) * (6 * e) : e < 1 / 2 ? t : e < 2 / 3 ? s + (t - s) * (2 / 3 - e) * 6 : s;
}
function lt(s, t, e) {
  let i, r, a;
  if (s = f(s, 360), t = f(t, 100), e = f(e, 100), t === 0)
    r = e, a = e, i = e;
  else {
    const n = e < 0.5 ? e * (1 + t) : e + t - e * t, o = 2 * e - n;
    i = D(o, n, s + 1 / 3), r = D(o, n, s), a = D(o, n, s - 1 / 3);
  }
  return { r: i * 255, g: r * 255, b: a * 255 };
}
function N(s, t, e) {
  s = f(s, 255), t = f(t, 255), e = f(e, 255);
  const i = Math.max(s, t, e), r = Math.min(s, t, e);
  let a = 0;
  const n = i, o = i - r, u = i === 0 ? 0 : o / i;
  if (i === r)
    a = 0;
  else {
    switch (i) {
      case s:
        a = (t - e) / o + (t < e ? 6 : 0);
        break;
      case t:
        a = (e - s) / o + 2;
        break;
      case e:
        a = (s - t) / o + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: u, v: n };
}
function ut(s, t, e) {
  s = f(s, 360) * 6, t = f(t, 100), e = f(e, 100);
  const i = Math.floor(s), r = s - i, a = e * (1 - t), n = e * (1 - r * t), o = e * (1 - (1 - r) * t), u = i % 6, d = [e, n, a, a, o, e][u], F = [o, e, e, n, a, a][u], O = [a, a, o, e, e, n][u];
  return { r: d * 255, g: F * 255, b: O * 255 };
}
function P(s, t, e, i) {
  const r = [
    _(Math.round(s).toString(16)),
    _(Math.round(t).toString(16)),
    _(Math.round(e).toString(16))
  ];
  return i && r[0].startsWith(r[0].charAt(1)) && r[1].startsWith(r[1].charAt(1)) && r[2].startsWith(r[2].charAt(1)) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) : r.join("");
}
function ct(s, t, e, i, r) {
  const a = [
    _(Math.round(s).toString(16)),
    _(Math.round(t).toString(16)),
    _(Math.round(e).toString(16)),
    _(pt(i))
  ];
  return r && a[0].startsWith(a[0].charAt(1)) && a[1].startsWith(a[1].charAt(1)) && a[2].startsWith(a[2].charAt(1)) && a[3].startsWith(a[3].charAt(1)) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0) : a.join("");
}
function dt(s, t, e, i) {
  const r = s / 100, a = t / 100, n = e / 100, o = i / 100, u = 255 * (1 - r) * (1 - o), d = 255 * (1 - a) * (1 - o), F = 255 * (1 - n) * (1 - o);
  return { r: u, g: d, b: F };
}
function q(s, t, e) {
  let i = 1 - s / 255, r = 1 - t / 255, a = 1 - e / 255, n = Math.min(i, r, a);
  return n === 1 ? (i = 0, r = 0, a = 0) : (i = (i - n) / (1 - n) * 100, r = (r - n) / (1 - n) * 100, a = (a - n) / (1 - n) * 100), n *= 100, {
    c: Math.round(i),
    m: Math.round(r),
    y: Math.round(a),
    k: Math.round(n)
  };
}
function pt(s) {
  return Math.round(parseFloat(s) * 255).toString(16);
}
function T(s) {
  return m(s) / 255;
}
function m(s) {
  return parseInt(s, 16);
}
function ft(s) {
  return {
    r: s >> 16,
    g: (s & 65280) >> 8,
    b: s & 255
  };
}
const I = {
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
function gt(s) {
  let t = { r: 0, g: 0, b: 0 }, e = 1, i = null, r = null, a = null, n = !1, o = !1;
  return typeof s == "string" && (s = vt(s)), typeof s == "object" && (b(s.r) && b(s.g) && b(s.b) ? (t = ht(s.r, s.g, s.b), n = !0, o = String(s.r).substr(-1) === "%" ? "prgb" : "rgb") : b(s.h) && b(s.s) && b(s.v) ? (i = H(s.s), r = H(s.v), t = ut(s.h, i, r), n = !0, o = "hsv") : b(s.h) && b(s.s) && b(s.l) ? (i = H(s.s), a = H(s.l), t = lt(s.h, i, a), n = !0, o = "hsl") : b(s.c) && b(s.m) && b(s.y) && b(s.k) && (t = dt(s.c, s.m, s.y, s.k), n = !0, o = "cmyk"), Object.prototype.hasOwnProperty.call(s, "a") && (e = s.a)), e = G(e), {
    ok: n,
    format: s.format || o,
    r: Math.min(255, Math.max(t.r, 0)),
    g: Math.min(255, Math.max(t.g, 0)),
    b: Math.min(255, Math.max(t.b, 0)),
    a: e
  };
}
const bt = "[-\\+]?\\d+%?", mt = "[-\\+]?\\d*\\.\\d+%?", w = "(?:" + mt + ")|(?:" + bt + ")", R = "[\\s|\\(]+(" + w + ")[,|\\s]+(" + w + ")[,|\\s]+(" + w + ")\\s*\\)?", V = (
  // eslint-disable-next-line prettier/prettier
  "[\\s|\\(]+(" + w + ")[,|\\s]+(" + w + ")[,|\\s]+(" + w + ")[,|\\s]+(" + w + ")\\s*\\)?"
), y = {
  CSS_UNIT: new RegExp(w),
  rgb: new RegExp("rgb" + R),
  rgba: new RegExp("rgba" + V),
  hsl: new RegExp("hsl" + R),
  hsla: new RegExp("hsla" + V),
  hsv: new RegExp("hsv" + R),
  hsva: new RegExp("hsva" + V),
  cmyk: new RegExp("cmyk" + V),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function vt(s) {
  if (s = s.trim().toLowerCase(), s.length === 0)
    return !1;
  let t = !1;
  if (I[s])
    s = I[s], t = !0;
  else if (s === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  let e = y.rgb.exec(s);
  return e ? { r: e[1], g: e[2], b: e[3] } : (e = y.rgba.exec(s), e ? { r: e[1], g: e[2], b: e[3], a: e[4] } : (e = y.hsl.exec(s), e ? { h: e[1], s: e[2], l: e[3] } : (e = y.hsla.exec(s), e ? { h: e[1], s: e[2], l: e[3], a: e[4] } : (e = y.hsv.exec(s), e ? { h: e[1], s: e[2], v: e[3] } : (e = y.hsva.exec(s), e ? { h: e[1], s: e[2], v: e[3], a: e[4] } : (e = y.cmyk.exec(s), e ? {
    c: e[1],
    m: e[2],
    y: e[3],
    k: e[4]
  } : (e = y.hex8.exec(s), e ? {
    r: m(e[1]),
    g: m(e[2]),
    b: m(e[3]),
    a: T(e[4]),
    format: t ? "name" : "hex8"
  } : (e = y.hex6.exec(s), e ? {
    r: m(e[1]),
    g: m(e[2]),
    b: m(e[3]),
    format: t ? "name" : "hex"
  } : (e = y.hex4.exec(s), e ? {
    r: m(e[1] + e[1]),
    g: m(e[2] + e[2]),
    b: m(e[3] + e[3]),
    a: T(e[4] + e[4]),
    format: t ? "name" : "hex8"
  } : (e = y.hex3.exec(s), e ? {
    r: m(e[1] + e[1]),
    g: m(e[2] + e[2]),
    b: m(e[3] + e[3]),
    format: t ? "name" : "hex"
  } : !1))))))))));
}
function b(s) {
  return typeof s == "number" ? !Number.isNaN(s) : y.CSS_UNIT.test(s);
}
class c {
  constructor(t = "", e = {}) {
    if (t instanceof c)
      return t;
    typeof t == "number" && (t = ft(t)), this.originalInput = t;
    const i = gt(t);
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
    let e, i, r;
    const a = t.r / 255, n = t.g / 255, o = t.b / 255;
    return a <= 0.03928 ? e = a / 12.92 : e = Math.pow((a + 0.055) / 1.055, 2.4), n <= 0.03928 ? i = n / 12.92 : i = Math.pow((n + 0.055) / 1.055, 2.4), o <= 0.03928 ? r = o / 12.92 : r = Math.pow((o + 0.055) / 1.055, 2.4), 0.2126 * e + 0.7152 * i + 0.0722 * r;
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
    return this.a = G(t), this.roundA = Math.round(100 * this.a) / 100, this;
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
    const t = N(this.r, this.g, this.b);
    return { h: t.h * 360, s: t.s, v: t.v, a: this.a };
  }
  /**
   * Returns the hsva values interpolated into a string with the following format:
   * "hsva(xxx, xxx, xxx, xx)".
   */
  toHsvString() {
    const t = N(this.r, this.g, this.b), e = Math.round(t.h * 360), i = Math.round(t.s * 100), r = Math.round(t.v * 100);
    return this.a === 1 ? `hsv(${e}, ${i}%, ${r}%)` : `hsva(${e}, ${i}%, ${r}%, ${this.roundA})`;
  }
  /**
   * Returns the object as a HSLA object.
   */
  toHsl() {
    const t = L(this.r, this.g, this.b);
    return { h: t.h * 360, s: t.s, l: t.l, a: this.a };
  }
  /**
   * Returns the hsla values interpolated into a string with the following format:
   * "hsla(xxx, xxx, xxx, xx)".
   */
  toHslString() {
    const t = L(this.r, this.g, this.b), e = Math.round(t.h * 360), i = Math.round(t.s * 100), r = Math.round(t.l * 100);
    return this.a === 1 ? `hsl(${e}, ${i}%, ${r}%)` : `hsla(${e}, ${i}%, ${r}%, ${this.roundA})`;
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
    return ct(this.r, this.g, this.b, this.a, t);
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
    const t = (e) => `${Math.round(f(e, 255) * 100)}%`;
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
    const t = (e) => Math.round(f(e, 255) * 100);
    return this.a === 1 ? `rgb(${t(this.r)}%, ${t(this.g)}%, ${t(this.b)}%)` : `rgba(${t(this.r)}%, ${t(this.g)}%, ${t(this.b)}%, ${this.roundA})`;
  }
  toCmyk() {
    return {
      ...q(this.r, this.g, this.b)
    };
  }
  toCmykString() {
    const { c: t, m: e, y: i, k: r } = q(this.r, this.g, this.b);
    return `cmyk(${t}, ${e}, ${i}, ${r})`;
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
    for (const [e, i] of Object.entries(I))
      if (t === i)
        return e;
    return !1;
  }
  toString(t) {
    const e = !!t;
    t = t ?? this.format;
    let i = !1;
    const r = this.a < 1 && this.a >= 0;
    return !e && r && (t.startsWith("hex") || t === "name") ? t === "name" && this.a === 0 ? this.toName() : this.toRgbString() : (t === "rgb" && (i = this.toRgbString()), t === "prgb" && (i = this.toPercentageRgbString()), (t === "hex" || t === "hex6") && (i = this.toHexString()), t === "hex3" && (i = this.toHexString(!0)), t === "hex4" && (i = this.toHex8String(!0)), t === "hex8" && (i = this.toHex8String()), t === "name" && (i = this.toName()), t === "hsl" && (i = this.toHslString()), t === "hsv" && (i = this.toHsvString()), t === "cmyk" && (i = this.toCmykString()), i || this.toHexString());
  }
  toNumber() {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  }
  clone() {
    return new c(this.toString());
  }
  /**
   * Lighten the color a given amount. Providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  lighten(t = 10) {
    const e = this.toHsl();
    return e.l += t / 100, e.l = C(e.l), new c(e);
  }
  /**
   * Brighten the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  brighten(t = 10) {
    const e = this.toRgb();
    return e.r = Math.max(0, Math.min(255, e.r - Math.round(255 * -(t / 100)))), e.g = Math.max(0, Math.min(255, e.g - Math.round(255 * -(t / 100)))), e.b = Math.max(0, Math.min(255, e.b - Math.round(255 * -(t / 100)))), new c(e);
  }
  /**
   * Darken the color a given amount, from 0 to 100.
   * Providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  darken(t = 10) {
    const e = this.toHsl();
    return e.l -= t / 100, e.l = C(e.l), new c(e);
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
    return e.s -= t / 100, e.s = C(e.s), new c(e);
  }
  /**
   * Saturate the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  saturate(t = 10) {
    const e = this.toHsl();
    return e.s += t / 100, e.s = C(e.s), new c(e);
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
    return e.h = i < 0 ? 360 + i : i, new c(e);
  }
  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  mix(t, e = 50) {
    const i = this.toRgb(), r = new c(t).toRgb(), a = e / 100, n = {
      r: (r.r - i.r) * a + i.r,
      g: (r.g - i.g) * a + i.g,
      b: (r.b - i.b) * a + i.b,
      a: (r.a - i.a) * a + i.a
    };
    return new c(n);
  }
  analogous(t = 6, e = 30) {
    const i = this.toHsl(), r = 360 / e, a = [this];
    for (i.h = (i.h - (r * t >> 1) + 720) % 360; --t; )
      i.h = (i.h + r) % 360, a.push(new c(i));
    return a;
  }
  /**
   * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
   */
  complement() {
    const t = this.toHsl();
    return t.h = (t.h + 180) % 360, new c(t);
  }
  monochromatic(t = 6) {
    const e = this.toHsv(), { h: i } = e, { s: r } = e;
    let { v: a } = e;
    const n = [], o = 1 / t;
    for (; t--; )
      n.push(new c({ h: i, s: r, v: a })), a = (a + o) % 1;
    return n;
  }
  splitcomplement() {
    const t = this.toHsl(), { h: e } = t;
    return [
      this,
      new c({ h: (e + 72) % 360, s: t.s, l: t.l }),
      new c({ h: (e + 216) % 360, s: t.s, l: t.l })
    ];
  }
  /**
   * Compute how the color would appear on a background
   */
  onBackground(t) {
    const e = this.toRgb(), i = new c(t).toRgb(), r = e.a + i.a * (1 - e.a);
    return new c({
      r: (e.r * e.a + i.r * i.a * (1 - e.a)) / r,
      g: (e.g * e.a + i.g * i.a * (1 - e.a)) / r,
      b: (e.b * e.a + i.b * i.a * (1 - e.a)) / r,
      a: r
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
    const e = this.toHsl(), { h: i } = e, r = [this], a = 360 / t;
    for (let n = 1; n < t; n++)
      r.push(new c({ h: (i + n * a) % 360, s: e.s, l: e.l }));
    return r;
  }
  /**
   * compare color vs current color
   */
  equals(t) {
    const e = new c(t);
    return this.format === "cmyk" || e.format === "cmyk" ? this.toCmykString() === e.toCmykString() : this.toRgbString() === e.toRgbString();
  }
}
var yt = Object.defineProperty, xt = Object.getOwnPropertyDescriptor, l = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? xt(t, e) : t, a = s.length - 1, n; a >= 0; a--)
    (n = s[a]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && yt(t, e, r), r;
};
const z = "EyeDropper" in window, A = class A extends U {
  constructor() {
    super(), this.formControlController = new X(this), this.isSafeValue = !1, this.localize = new Z(this), this.hasFocus = !1, this.isDraggingGridHandle = !1, this.isEmpty = !1, this.inputValue = "", this.hue = 0, this.saturation = 100, this.brightness = 100, this.alpha = 100, this.value = "", this.defaultValue = "", this.label = "", this.variant = "default", this.format = "hex", this.inline = !1, this.size = "medium", this.noFormatToggle = !1, this.name = "", this.disabled = !1, this.hoist = !1, this.opacity = !1, this.uppercase = !1, this.clearable = !1, this.swatches = "", this.customSwatches = "", this.loading = !1, this.creatable = !1, this.form = "", this.required = !1, this.handleFocusIn = () => {
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
    const t = ["hex", "rgb", "hsl", "hsv"], e = (t.indexOf(this.format) + 1) % t.length;
    this.format = t[e], this.setColor(this.value), this.emit("cx-change"), this.emit("cx-input");
  }
  handleAlphaDrag(t) {
    const e = this.shadowRoot.querySelector(
      ".color-picker__slider.color-picker__alpha"
    ), i = e.querySelector(
      ".color-picker__slider-handle"
    ), { width: r } = e.getBoundingClientRect();
    let a = this.value, n = this.value;
    i.focus(), t.preventDefault(), E(e, {
      initialEvent: t,
      onMove: (o) => {
        this.alpha = v(o / r * 100, 0, 100), this.syncValues(), this.value !== n && (n = this.value, this.emit("cx-input"));
      },
      onStop: () => {
        this.value !== a && (a = this.value, this.emit("cx-change"));
      }
    });
  }
  handleHueDrag(t) {
    const e = this.shadowRoot.querySelector(
      ".color-picker__slider.color-picker__hue"
    ), i = e.querySelector(
      ".color-picker__slider-handle"
    ), { width: r } = e.getBoundingClientRect();
    let a = this.value, n = this.value;
    i.focus(), t.preventDefault(), E(e, {
      initialEvent: t,
      onMove: (o) => {
        this.hue = v(o / r * 360, 0, 360), this.syncValues(), this.value !== n && (n = this.value, this.emit("cx-input"));
      },
      onStop: () => {
        this.value !== a && (a = this.value, this.emit("cx-change"));
      }
    });
  }
  handleGridDrag(t) {
    const e = this.shadowRoot.querySelector(
      ".color-picker__grid"
    ), i = e.querySelector(
      ".color-picker__grid-handle"
    ), { height: r, width: a } = e.getBoundingClientRect();
    let n = this.value, o = this.value;
    i.focus(), t.preventDefault(), this.isDraggingGridHandle = !0, E(e, {
      initialEvent: t,
      onMove: (u, d) => {
        this.saturation = v(u / a * 100, 0, 100), this.brightness = v(100 - d / r * 100, 0, 100), this.syncValues(), this.value !== o && (o = this.value, this.emit("cx-input"));
      },
      onStop: () => {
        this.isDraggingGridHandle = !1, this.value !== n && (n = this.value, this.emit("cx-change"));
      }
    });
  }
  handleAlphaKeyDown(t) {
    const e = t.shiftKey ? 10 : 1, i = this.value;
    t.key === "ArrowLeft" && (t.preventDefault(), this.alpha = v(this.alpha - e, 0, 100), this.syncValues()), t.key === "ArrowRight" && (t.preventDefault(), this.alpha = v(this.alpha + e, 0, 100), this.syncValues()), t.key === "Home" && (t.preventDefault(), this.alpha = 0, this.syncValues()), t.key === "End" && (t.preventDefault(), this.alpha = 100, this.syncValues()), this.value !== i && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleHueKeyDown(t) {
    const e = t.shiftKey ? 10 : 1, i = this.value;
    t.key === "ArrowLeft" && (t.preventDefault(), this.hue = v(this.hue - e, 0, 360), this.syncValues()), t.key === "ArrowRight" && (t.preventDefault(), this.hue = v(this.hue + e, 0, 360), this.syncValues()), t.key === "Home" && (t.preventDefault(), this.hue = 0, this.syncValues()), t.key === "End" && (t.preventDefault(), this.hue = 360, this.syncValues()), this.value !== i && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleGridKeyDown(t) {
    const e = t.shiftKey ? 10 : 1, i = this.value;
    t.key === "ArrowLeft" && (t.preventDefault(), this.saturation = v(this.saturation - e, 0, 100), this.syncValues()), t.key === "ArrowRight" && (t.preventDefault(), this.saturation = v(this.saturation + e, 0, 100), this.syncValues()), t.key === "ArrowUp" && (t.preventDefault(), this.brightness = v(this.brightness + e, 0, 100), this.syncValues()), t.key === "ArrowDown" && (t.preventDefault(), this.brightness = v(this.brightness - e, 0, 100), this.syncValues()), this.value !== i && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleInputChange(t) {
    const e = t.target, i = this.value;
    t.stopPropagation(), this.input.value ? (this.setColor(e.value), e.value = this.value) : this.value = "", this.value !== i && (this.emit("cx-change"), this.emit("cx-input"));
  }
  handleInputInput(t) {
    this.formControlController.updateValidity(), t.stopPropagation(), this.debouncedSetColor();
  }
  debouncedSetColor() {
    this.setColor(this.input.value, !1);
  }
  handleInputKeyDown(t) {
    if (t.key === "Enter") {
      const e = this.value;
      this.input.value ? (this.setColor(this.input.value), this.input.value = this.value, this.value !== e && (this.emit("cx-change"), this.emit("cx-input")), setTimeout(() => this.input.select())) : this.hue = 0;
    }
  }
  handleInputInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  handleTouchMove(t) {
    t.preventDefault();
  }
  handleClear() {
    this.value = "", this.setColor(""), this.emit("cx-change"), this.emit("cx-input"), this.emit("cx-clear");
  }
  parseColor(t) {
    if (!t) return null;
    const e = new c(t);
    if (!e.isValid)
      return null;
    const i = e.toHsl(), r = {
      a: i.a,
      h: i.h,
      l: i.l * 100,
      s: i.s * 100
    }, a = e.toRgb(), n = e.toHexString(), o = e.toHex8String(), u = e.toHsv(), d = {
      a: u.a,
      h: u.h,
      s: u.s * 100,
      v: u.v * 100
    };
    return {
      hex: this.setLetterCase(n),
      hexa: this.setLetterCase(o),
      hsl: {
        h: r.h,
        l: r.l,
        s: r.s,
        string: this.setLetterCase(
          `hsl(${Math.round(r.h)}, ${Math.round(r.s)}%, ${Math.round(
            r.l
          )}%)`
        )
      },
      hsla: {
        a: r.a,
        h: r.h,
        l: r.l,
        s: r.s,
        string: this.setLetterCase(
          `hsla(${Math.round(r.h)}, ${Math.round(r.s)}%, ${Math.round(
            r.l
          )}%, ${r.a.toFixed(2).toString()})`
        )
      },
      hsv: {
        h: d.h,
        s: d.s,
        string: this.setLetterCase(
          `hsv(${Math.round(d.h)}, ${Math.round(d.s)}%, ${Math.round(
            d.v
          )}%)`
        ),
        v: d.v
      },
      hsva: {
        a: d.a,
        h: d.h,
        s: d.s,
        string: this.setLetterCase(
          `hsva(${Math.round(d.h)}, ${Math.round(d.s)}%, ${Math.round(
            d.v
          )}%, ${d.a.toFixed(2).toString()})`
        ),
        v: d.v
      },
      rgb: {
        b: a.b,
        g: a.g,
        r: a.r,
        string: this.setLetterCase(
          `rgb(${Math.round(a.r)}, ${Math.round(a.g)}, ${Math.round(
            a.b
          )})`
        )
      },
      rgba: {
        a: a.a,
        b: a.b,
        g: a.g,
        r: a.r,
        string: this.setLetterCase(
          `rgba(${Math.round(a.r)}, ${Math.round(a.g)}, ${Math.round(
            a.b
          )}, ${a.a.toFixed(2).toString()})`
        )
      }
    };
  }
  setColor(t, e = !0) {
    const i = this.parseColor(t);
    return i === null ? !1 : (this.hue = i.hsva.h, this.saturation = i.hsva.s, this.brightness = i.hsva.v, this.alpha = this.opacity ? i.hsva.a * 100 : 100, e && this.syncValues(), !0);
  }
  setLetterCase(t) {
    return typeof t != "string" ? "" : this.uppercase ? t.toUpperCase() : t.toLowerCase();
  }
  async syncValues() {
    const t = this.parseColor(
      `hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha / 100})`
    );
    t !== null && (this.format === "hsl" ? this.inputValue = this.opacity ? t.hsla.string : t.hsl.string : this.format === "rgb" ? this.inputValue = this.opacity ? t.rgba.string : t.rgb.string : this.format === "hsv" ? this.inputValue = this.opacity ? t.hsva.string : t.hsv.string : this.inputValue = this.opacity ? t.hexa : t.hex, this.isSafeValue = !0, this.value = this.inputValue, await this.updateComplete, this.isSafeValue = !1);
  }
  handleAfterHide() {
    this.previewButton.classList.remove("color-picker__preview-color--copied");
  }
  handleEyeDropper() {
    if (!z)
      return;
    new EyeDropper().open().then((e) => {
      const i = this.value;
      this.setColor(e.sRGBHex), this.value !== i && (this.emit("cx-change"), this.emit("cx-input"));
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
  selectSwatch(t) {
    const e = this.value;
    this.disabled || (this.setColor(t), this.value !== e && (this.emit("cx-change"), this.emit("cx-input")));
  }
  /** Generates a hex string from HSV values. Hue must be 0-360. All other arguments must be 0-100. */
  getHexString(t, e, i, r = 100) {
    const a = new c(
      `hsva(${t}, ${e}%, ${i}%, ${r / 100})`
    );
    return a.isValid ? a.toHex8String() : "";
  }
  // Prevents nested components from leaking events
  stopNestedEventPropagation(t) {
    t.stopImmediatePropagation();
  }
  handleFormatChange() {
    this.syncValues();
  }
  handleOpacityChange() {
    this.alpha = 100;
  }
  handleValueChange(t, e) {
    if (this.isEmpty = !e, e || (this.hue = 0, this.saturation = 0, this.brightness = 100, this.alpha = 100), !this.isSafeValue) {
      const i = this.parseColor(e);
      i !== null ? (this.inputValue = this.value, this.hue = i.hsva.h, this.saturation = i.hsva.s, this.brightness = i.hsva.v, this.alpha = i.hsva.a * 100, this.syncValues()) : this.inputValue = t ?? "";
    }
  }
  /** Sets focus on the color picker. */
  focus(t) {
    this.inline ? this.base.focus(t) : this.trigger.focus(t);
  }
  /** Removes focus from the color picker. */
  blur() {
    var e;
    const t = this.inline ? this.base : this.trigger;
    this.hasFocus && (t.focus({ preventScroll: !0 }), t.blur()), (e = this.dropdown) != null && e.open && this.dropdown.hide();
  }
  /** Returns the current value as a string in the specified format. */
  getFormattedValue(t = "hex") {
    const e = this.parseColor(
      `hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha / 100})`
    );
    if (e === null)
      return "";
    switch (t) {
      case "hex":
        return e.hex;
      case "hexa":
        return e.hexa;
      case "rgb":
        return e.rgb.string;
      case "rgba":
        return e.rgba.string;
      case "hsl":
        return e.hsl.string;
      case "hsla":
        return e.hsla.string;
      case "hsv":
        return e.hsv.string;
      case "hsva":
        return e.hsva.string;
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
  setCustomValidity(t) {
    this.input.setCustomValidity(t), this.formControlController.updateValidity();
  }
  renderSwatches(t) {
    return t.map((e) => {
      const i = this.parseColor(e);
      return i ? g`
        <div
          part="swatch"
          class="color-picker__swatch color-picker__transparent-bg"
          tabindex=${M(this.disabled ? void 0 : "0")}
          role="button"
          aria-label=${e}
          @click=${() => this.selectSwatch(e)}
          @keydown=${(r) => !this.disabled && r.key === "Enter" && this.setColor(i.hexa)}
        >
          <div
            class="color-picker__swatch-color"
            style=${x({ backgroundColor: i.hexa })}
          ></div>
        </div>
      ` : (console.error(`Unable to parse swatch color: "${e}"`, this), "");
    });
  }
  render() {
    var o;
    const t = this.saturation, e = 100 - this.brightness, i = this.swatches ? Array.isArray(this.swatches) ? this.swatches : this.swatches.split(";").filter((u) => u.trim() !== "") : [], r = this.customSwatches ? Array.isArray(this.customSwatches) ? this.customSwatches : this.customSwatches.split(";").filter((u) => u.trim() !== "") : [], a = g`
      <div
        part="base"
        class=${k({
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
            class=${k({
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
      left: `${t}%`,
      top: `${e}%`
    })}
            role="application"
            aria-label="HSV"
            tabindex=${M(this.disabled ? void 0 : "0")}
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
                tabindex=${M(this.disabled ? void 0 : "0")}
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
                      tabindex=${M(this.disabled ? void 0 : "0")}
                      @keydown=${this.handleAlphaKeyDown}
                    ></span>
                  </div>
                ` : ""}
          </div>

          <div class="color-picker__preview__container">
            <button
              type="button"
              part="preview"
              class=${k({
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
            ${z ? g`
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

        ${i.length > 0 ? g`
              <div part="swatches" class="color-picker__swatches">
                ${this.renderSwatches(i)}
              </div>
            ` : ""}
        ${r.length > 0 || this.creatable ? g`
              <div class="color-picker__customSwatches-label">
                Custom
                ${this.creatable ? g`<cx-button part="swatch-add-button" size="small" @click=${this.handleSwatchAdd}>Add current</cuttx-button>` : ""}
              </div>
            ` : ""}
        ${r.length > 0 ? g`
              <div part="custom-swatches" class="color-picker__customSwatches">
                ${this.renderSwatches(r)}
              </div>
            ` : ""}
        ${this.loading ? g`<div part="loading-spinner" class="color-picker__spinner">
              <cx-spinner></cx-spinner>
            </div>` : ""}
      </div>
    `, n = this.variant === "button" ? g`<cx-button
            part="trigger"
            class=${k({
      "color-dropdown__trigger": !0,
      "color-dropdown__trigger--focused": this.hasFocus
    })}
            outline
            aria-label=${this.label}
            ?disabled=${this.disabled}
            type="button"
          >
            <div
              slot="prefix"
              part="preview"
              class=${k({
      "color-picker__preview": !0,
      "color-picker__preview--button": !0,
      "color-picker__preview--empty": this.isEmpty,
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
            class=${k({
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
          </button>`;
    return this.inline ? a : g`
      <cx-dropdown
        aria-disabled=${this.disabled ? "true" : "false"}
        class=${k({
      "color-dropdown": !0,
      "color-dropdown--opened": !!((o = this.dropdown) != null && o.open)
    })}
        .containing-element=${this}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        @cx-after-hide=${this.handleAfterHide}
      >
        <slot name="trigger" slot="trigger">${n}</slot>
        ${a}
      </cx-dropdown>
    `;
  }
};
A.styles = [K, at], A.dependencies = {
  "cx-button": J,
  "cx-button-group": Q,
  "cx-dropdown": tt,
  "cx-icon": et,
  "cx-input": st,
  "cx-spinner": it,
  "cx-visually-hidden": rt
};
let h = A;
l([
  S('[part~="base"]')
], h.prototype, "base", 2);
l([
  S('[part~="input"]')
], h.prototype, "input", 2);
l([
  S(".color-dropdown")
], h.prototype, "dropdown", 2);
l([
  S('[part~="preview"]')
], h.prototype, "previewButton", 2);
l([
  S('[part~="trigger"]')
], h.prototype, "trigger", 2);
l([
  $()
], h.prototype, "hasFocus", 2);
l([
  $()
], h.prototype, "isDraggingGridHandle", 2);
l([
  $()
], h.prototype, "isEmpty", 2);
l([
  $()
], h.prototype, "inputValue", 2);
l([
  $()
], h.prototype, "hue", 2);
l([
  $()
], h.prototype, "saturation", 2);
l([
  $()
], h.prototype, "brightness", 2);
l([
  $()
], h.prototype, "alpha", 2);
l([
  p()
], h.prototype, "value", 2);
l([
  W()
], h.prototype, "defaultValue", 2);
l([
  p()
], h.prototype, "label", 2);
l([
  p({ reflect: !0, type: String })
], h.prototype, "variant", 2);
l([
  p()
], h.prototype, "format", 2);
l([
  p({ reflect: !0, type: Boolean })
], h.prototype, "inline", 2);
l([
  p({ reflect: !0 })
], h.prototype, "size", 2);
l([
  p({ attribute: "no-format-toggle", type: Boolean })
], h.prototype, "noFormatToggle", 2);
l([
  p()
], h.prototype, "name", 2);
l([
  p({ reflect: !0, type: Boolean })
], h.prototype, "disabled", 2);
l([
  p({ type: Boolean })
], h.prototype, "hoist", 2);
l([
  p({ type: Boolean })
], h.prototype, "opacity", 2);
l([
  p({ type: Boolean })
], h.prototype, "uppercase", 2);
l([
  p({ type: Boolean })
], h.prototype, "clearable", 2);
l([
  p()
], h.prototype, "swatches", 2);
l([
  p({ attribute: "custom-swatches", reflect: !0 })
], h.prototype, "customSwatches", 2);
l([
  p({ reflect: !0, type: Boolean })
], h.prototype, "loading", 2);
l([
  p({ reflect: !0, type: Boolean })
], h.prototype, "creatable", 2);
l([
  p({ reflect: !0 })
], h.prototype, "form", 2);
l([
  p({ reflect: !0, type: Boolean })
], h.prototype, "required", 2);
l([
  j(300)
], h.prototype, "debouncedSetColor", 1);
l([
  Y({ passive: !1 })
], h.prototype, "handleTouchMove", 1);
l([
  B("format", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleFormatChange", 1);
l([
  B("opacity", { waitUntilFirstUpdate: !0 })
], h.prototype, "handleOpacityChange", 1);
l([
  B("value")
], h.prototype, "handleValueChange", 1);
export {
  h as default
};
