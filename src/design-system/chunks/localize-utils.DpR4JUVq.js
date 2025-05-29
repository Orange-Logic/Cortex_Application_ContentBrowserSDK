const l = /* @__PURE__ */ new Set(), f = new MutationObserver(g), i = /* @__PURE__ */ new Map();
let c = document.documentElement.dir || "ltr", d = document.documentElement.lang || navigator.language, s;
f.observe(document.documentElement, {
  attributeFilter: ["dir", "lang"],
  attributes: !0
});
function h(o) {
  return `${o.dir || c}`.toLowerCase();
}
function w(...o) {
  o.map((t) => {
    const e = t.$code.toLowerCase();
    i.has(e) ? i.set(e, { ...i.get(e), ...t }) : i.set(e, t), s || (s = t);
  }), g();
}
function g() {
  c = document.documentElement.dir || "ltr", d = document.documentElement.lang || navigator.language, [...l.keys()].forEach((o) => {
    typeof o.requestUpdate == "function" && o.requestUpdate();
  });
}
let L = class {
  constructor(t) {
    this.host = t, this.host.addController(this);
  }
  hostConnected() {
    l.add(this.host);
  }
  hostDisconnected() {
    l.delete(this.host);
  }
  /**
   * Gets the host element's directionality as determined by the `dir` attribute. The return value is transformed to
   * lowercase.
   */
  dir() {
    return `${this.host.dir || c}`.toLowerCase();
  }
  /**
   * Gets the host element's language as determined by the `lang` attribute. The return value is transformed to
   * lowercase.
   */
  lang() {
    return `${this.host.lang || d}`.toLowerCase();
  }
  getTranslationData(t) {
    var u;
    const e = new Intl.Locale(t.replace(/_/g, "-")), n = e == null ? void 0 : e.language.toLowerCase(), r = ((u = e == null ? void 0 : e.region) == null ? void 0 : u.toLowerCase()) ?? "", a = i.get(
      `${n}-${r}`
    ), m = i.get(n);
    return { language: n, locale: e, primary: a, region: r, secondary: m };
  }
  /** Determines if the specified term exists, optionally checking the fallback translation. */
  exists(t, e) {
    const { primary: n, secondary: r } = this.getTranslationData(
      e.lang ?? this.lang()
    );
    return e = {
      includeFallback: !1,
      ...e
    }, !!(n && n[t] || r && r[t] || e.includeFallback && s && s[t]);
  }
  /** Outputs a translated term. */
  term(t, ...e) {
    const { primary: n, secondary: r } = this.getTranslationData(this.lang());
    let a;
    if (n && n[t])
      a = n[t];
    else if (r && r[t])
      a = r[t];
    else if (s && s[t])
      a = s[t];
    else
      return console.error(`No translation found for: ${String(t)}`), String(t);
    return typeof a == "function" ? a(...e) : a;
  }
  /** Outputs a localized date in the specified format. */
  date(t, e) {
    return t = new Date(t), new Intl.DateTimeFormat(this.lang(), e).format(t);
  }
  /** Outputs a localized number in the specified format. */
  number(t, e) {
    return t = Number(t), isNaN(t) ? "" : new Intl.NumberFormat(this.lang(), e).format(t);
  }
  /** Outputs a localized time in relative format. */
  relativeTime(t, e, n) {
    if (t === 0 || e === "second" && t < 0 && t > -10) return "Just now";
    const r = new Intl.RelativeTimeFormat(this.lang(), n).format(
      t,
      e
    );
    return t > 0 ? r.replace("in ", "").concat(" left") : r;
  }
};
export {
  L,
  h as d,
  w as r
};
