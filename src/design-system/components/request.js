const n = /* @__PURE__ */ new Map();
function u(t, r = "cors") {
  const o = n.get(t);
  if (o !== void 0)
    return Promise.resolve(o);
  const s = fetch(t, { mode: r }).then(async (e) => {
    const i = {
      html: await e.text(),
      ok: e.ok,
      status: e.status
    };
    return n.set(t, i), i;
  });
  return n.set(t, s), s;
}
export {
  u as requestInclude
};
