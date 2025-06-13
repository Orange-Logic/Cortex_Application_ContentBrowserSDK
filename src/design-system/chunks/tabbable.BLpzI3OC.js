const a = /* @__PURE__ */ new WeakMap();
function s(t) {
  let e = a.get(t);
  return e || (e = window.getComputedStyle(t, null), a.set(t, e)), e;
}
function c(t) {
  if (typeof t.checkVisibility == "function")
    return t.checkVisibility({
      checkOpacity: !1,
      checkVisibilityCSS: !0
    });
  const e = s(t);
  return e.visibility !== "hidden" && e.display !== "none";
}
function b(t) {
  const e = s(t), { overflowX: i, overflowY: r } = e;
  return r === "scroll" || i === "scroll" ? !0 : r !== "auto" || i !== "auto" ? !1 : t.scrollHeight > t.clientHeight && r === "auto" || t.scrollWidth > t.clientWidth && i === "auto";
}
function f(t) {
  const e = t.tagName.toLowerCase(), i = Number(t.getAttribute("tabindex"));
  return t.hasAttribute("tabindex") && (isNaN(i) || i <= -1) || t.hasAttribute("disabled") || t.closest("[inert]") || e === "input" && t.getAttribute("type") === "radio" && !t.hasAttribute("checked") || !c(t) ? !1 : (e === "audio" || e === "video") && t.hasAttribute("controls") || t.hasAttribute("tabindex") || t.hasAttribute("contenteditable") && t.getAttribute("contenteditable") !== "false" || [
    "button",
    "input",
    "select",
    "textarea",
    "a",
    "audio",
    "video",
    "summary",
    "iframe"
  ].includes(e) ? !0 : b(t);
}
function g(t) {
  const e = l(t), i = e[0] ?? null;
  return { end: e[e.length - 1] ?? null, start: i };
}
function d(t, e) {
  var i;
  return ((i = t.getRootNode({ composed: !0 })) == null ? void 0 : i.host) !== e;
}
function l(t) {
  const e = /* @__PURE__ */ new WeakMap(), i = [];
  function r(n) {
    if (n instanceof Element) {
      if (n.hasAttribute("inert") || n.closest("[inert]") || e.has(n))
        return;
      e.set(n, !0), !i.includes(n) && f(n) && i.push(n), n instanceof HTMLSlotElement && d(n, t) && n.assignedElements({ flatten: !0 }).forEach(
        (o) => {
          r(o);
        }
      ), n.shadowRoot !== null && n.shadowRoot.mode === "open" && r(n.shadowRoot);
    }
    for (const o of n.children)
      r(o);
  }
  return r(t), i.sort((n, o) => {
    const u = Number(n.getAttribute("tabindex")) || 0;
    return (Number(o.getAttribute("tabindex")) || 0) - u;
  });
}
export {
  g as a,
  l as g
};
