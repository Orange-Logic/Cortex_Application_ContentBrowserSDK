import { c as M } from "../chunks/_commonjsHelpers.BVfed4GL.js";
function Ce(I) {
  throw new Error('Could not dynamically require "' + I + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var H = { exports: {} };
(function(I, U) {
  (function(m, L) {
    L(U);
  })(M, function(m) {
    var L = typeof window < "u" ? window : typeof M < "u" ? M : typeof self < "u" ? self : {}, R = function(t, n) {
      if (n = n.split(":")[0], t = +t, !t)
        return !1;
      switch (n) {
        case "http":
        case "ws":
          return t !== 80;
        case "https":
        case "wss":
          return t !== 443;
        case "ftp":
          return t !== 21;
        case "gopher":
          return t !== 70;
        case "file":
          return !1;
      }
      return t !== 0;
    }, E = Object.prototype.hasOwnProperty, _;
    function J(r) {
      try {
        return decodeURIComponent(r.replace(/\+/g, " "));
      } catch {
        return null;
      }
    }
    function Y(r) {
      try {
        return encodeURIComponent(r);
      } catch {
        return null;
      }
    }
    function oe(r) {
      for (var t = /([^=?#&]+)=?([^&]*)/g, n = {}, e; e = t.exec(r); ) {
        var o = J(e[1]), i = J(e[2]);
        o === null || i === null || o in n || (n[o] = i);
      }
      return n;
    }
    function ne(r, t) {
      t = t || "";
      var n = [], e, o;
      typeof t != "string" && (t = "?");
      for (o in r)
        if (E.call(r, o)) {
          if (e = r[o], !e && (e === null || e === _ || isNaN(e)) && (e = ""), o = Y(o), e = Y(e), o === null || e === null)
            continue;
          n.push(o + "=" + e);
        }
      return n.length ? t + n.join("&") : "";
    }
    var ie = ne, se = oe, W = {
      stringify: ie,
      parse: se
    }, Z = /[\n\r\t]/g, ae = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, ce = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i, ue = /^[a-zA-Z]:/, le = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
    function D(r) {
      return (r || "").toString().replace(le, "");
    }
    var G = [
      ["#", "hash"],
      // Extract from the back.
      ["?", "query"],
      // Extract from the back.
      function(t, n) {
        return g(n.protocol) ? t.replace(/\\/g, "/") : t;
      },
      ["/", "pathname"],
      // Extract from the back.
      ["@", "auth", 1],
      // Extract from the front.
      [NaN, "host", void 0, 1, 1],
      // Set left over value.
      [/:(\d*)$/, "port", void 0, 1],
      // RegExp the back.
      [NaN, "hostname", void 0, 1, 1]
      // Set left over.
    ], X = { hash: 1, query: 1 };
    function K(r) {
      var t;
      typeof window < "u" ? t = window : typeof L < "u" ? t = L : typeof self < "u" ? t = self : t = {};
      var n = t.location || {};
      r = r || n;
      var e = {}, o = typeof r, i;
      if (r.protocol === "blob:")
        e = new b(unescape(r.pathname), {});
      else if (o === "string") {
        e = new b(r, {});
        for (i in X)
          delete e[i];
      } else if (o === "object") {
        for (i in r)
          i in X || (e[i] = r[i]);
        e.slashes === void 0 && (e.slashes = ae.test(r.href));
      }
      return e;
    }
    function g(r) {
      return r === "file:" || r === "ftp:" || r === "http:" || r === "https:" || r === "ws:" || r === "wss:";
    }
    function Q(r, t) {
      r = D(r), r = r.replace(Z, ""), t = t || {};
      var n = ce.exec(r), e = n[1] ? n[1].toLowerCase() : "", o = !!n[2], i = !!n[3], s = 0, a;
      return o ? i ? (a = n[2] + n[3] + n[4], s = n[2].length + n[3].length) : (a = n[2] + n[4], s = n[2].length) : i ? (a = n[3] + n[4], s = n[3].length) : a = n[4], e === "file:" ? s >= 2 && (a = a.slice(2)) : g(e) ? a = n[4] : e ? o && (a = a.slice(2)) : s >= 2 && g(t.protocol) && (a = n[4]), {
        protocol: e,
        slashes: o || g(e),
        slashesCount: s,
        rest: a
      };
    }
    function he(r, t) {
      if (r === "")
        return t;
      for (var n = (t || "/").split("/").slice(0, -1).concat(r.split("/")), e = n.length, o = n[e - 1], i = !1, s = 0; e--; )
        n[e] === "." ? n.splice(e, 1) : n[e] === ".." ? (n.splice(e, 1), s++) : s && (e === 0 && (i = !0), n.splice(e, 1), s--);
      return i && n.unshift(""), (o === "." || o === "..") && n.push(""), n.join("/");
    }
    function b(r, t, n) {
      if (r = D(r), r = r.replace(Z, ""), !(this instanceof b))
        return new b(r, t, n);
      var e, o, i, s, a, u, l = G.slice(), p = typeof t, c = this, z = 0;
      for (p !== "object" && p !== "string" && (n = t, t = null), n && typeof n != "function" && (n = W.parse), t = K(t), o = Q(r || "", t), e = !o.protocol && !o.slashes, c.slashes = o.slashes || e && t.slashes, c.protocol = o.protocol || t.protocol || "", r = o.rest, (o.protocol === "file:" && (o.slashesCount !== 2 || ue.test(r)) || !o.slashes && (o.protocol || o.slashesCount < 2 || !g(c.protocol))) && (l[3] = [/(.*)/, "pathname"]); z < l.length; z++) {
        if (s = l[z], typeof s == "function") {
          r = s(r, c);
          continue;
        }
        i = s[0], u = s[1], i !== i ? c[u] = r : typeof i == "string" ? (a = i === "@" ? r.lastIndexOf(i) : r.indexOf(i), ~a && (typeof s[2] == "number" ? (c[u] = r.slice(0, a), r = r.slice(a + s[2])) : (c[u] = r.slice(a), r = r.slice(0, a)))) : (a = i.exec(r)) && (c[u] = a[1], r = r.slice(0, a.index)), c[u] = c[u] || e && s[3] && t[u] || "", s[4] && (c[u] = c[u].toLowerCase());
      }
      n && (c.query = n(c.query)), e && t.slashes && c.pathname.charAt(0) !== "/" && (c.pathname !== "" || t.pathname !== "") && (c.pathname = he(c.pathname, t.pathname)), c.pathname.charAt(0) !== "/" && g(c.protocol) && (c.pathname = "/" + c.pathname), R(c.port, c.protocol) || (c.host = c.hostname, c.port = ""), c.username = c.password = "", c.auth && (a = c.auth.indexOf(":"), ~a ? (c.username = c.auth.slice(0, a), c.username = encodeURIComponent(decodeURIComponent(c.username)), c.password = c.auth.slice(a + 1), c.password = encodeURIComponent(decodeURIComponent(c.password))) : c.username = encodeURIComponent(decodeURIComponent(c.auth)), c.auth = c.password ? c.username + ":" + c.password : c.username), c.origin = c.protocol !== "file:" && g(c.protocol) && c.host ? c.protocol + "//" + c.host : "null", c.href = c.toString();
    }
    function fe(r, t, n) {
      var e = this;
      switch (r) {
        case "query":
          typeof t == "string" && t.length && (t = (n || W.parse)(t)), e[r] = t;
          break;
        case "port":
          e[r] = t, R(t, e.protocol) ? t && (e.host = e.hostname + ":" + t) : (e.host = e.hostname, e[r] = "");
          break;
        case "hostname":
          e[r] = t, e.port && (t += ":" + e.port), e.host = t;
          break;
        case "host":
          e[r] = t, /:\d+$/.test(t) ? (t = t.split(":"), e.port = t.pop(), e.hostname = t.join(":")) : (e.hostname = t, e.port = "");
          break;
        case "protocol":
          e.protocol = t.toLowerCase(), e.slashes = !n;
          break;
        case "pathname":
        case "hash":
          if (t) {
            var o = r === "pathname" ? "/" : "#";
            e[r] = t.charAt(0) !== o ? o + t : t;
          } else
            e[r] = t;
          break;
        case "username":
        case "password":
          e[r] = encodeURIComponent(t);
          break;
        case "auth":
          var i = t.indexOf(":");
          ~i ? (e.username = t.slice(0, i), e.username = encodeURIComponent(decodeURIComponent(e.username)), e.password = t.slice(i + 1), e.password = encodeURIComponent(decodeURIComponent(e.password))) : e.username = encodeURIComponent(decodeURIComponent(t));
      }
      for (var s = 0; s < G.length; s++) {
        var a = G[s];
        a[4] && (e[a[1]] = e[a[1]].toLowerCase());
      }
      return e.auth = e.password ? e.username + ":" + e.password : e.username, e.origin = e.protocol !== "file:" && g(e.protocol) && e.host ? e.protocol + "//" + e.host : "null", e.href = e.toString(), e;
    }
    function pe(r) {
      (!r || typeof r != "function") && (r = W.stringify);
      var t, n = this, e = n.host, o = n.protocol;
      o && o.charAt(o.length - 1) !== ":" && (o += ":");
      var i = o + (n.protocol && n.slashes || g(n.protocol) ? "//" : "");
      return n.username ? (i += n.username, n.password && (i += ":" + n.password), i += "@") : n.password ? (i += ":" + n.password, i += "@") : n.protocol !== "file:" && g(n.protocol) && !e && n.pathname !== "/" && (i += "@"), e[e.length - 1] === ":" && (e += ":"), i += e + n.pathname, t = typeof n.query == "object" ? r(n.query) : n.query, t && (i += t.charAt(0) !== "?" ? "?" + t : t), n.hash && (i += n.hash), i;
    }
    b.prototype = { set: fe, toString: pe }, b.extractProtocol = Q, b.location = K, b.trimLeft = D, b.qs = W;
    var q = b;
    function T(r, t) {
      setTimeout(function(n) {
        return r.call(n);
      }, 4, t);
    }
    function j(r, t) {
      typeof process < "u" && process.env.NODE_ENV !== "test" && console[r].call(null, t);
    }
    function B(r, t) {
      r === void 0 && (r = []);
      var n = [];
      return r.forEach(function(e) {
        t(e) || n.push(e);
      }), n;
    }
    function ve(r, t) {
      r === void 0 && (r = []);
      var n = [];
      return r.forEach(function(e) {
        t(e) && n.push(e);
      }), n;
    }
    var C = function() {
      this.listeners = {};
    };
    C.prototype.addEventListener = function(t, n) {
      typeof n == "function" && (Array.isArray(this.listeners[t]) || (this.listeners[t] = []), ve(this.listeners[t], function(e) {
        return e === n;
      }).length === 0 && this.listeners[t].push(n));
    }, C.prototype.removeEventListener = function(t, n) {
      var e = this.listeners[t];
      this.listeners[t] = B(e, function(o) {
        return o === n;
      });
    }, C.prototype.dispatchEvent = function(t) {
      for (var n = this, e = [], o = arguments.length - 1; o-- > 0; ) e[o] = arguments[o + 1];
      var i = t.type, s = this.listeners[i];
      return Array.isArray(s) ? (s.forEach(function(a) {
        e.length > 0 ? a.apply(n, e) : a.call(n, t);
      }), !0) : !1;
    };
    function w(r) {
      var t = r.indexOf("?");
      return t >= 0 ? r.slice(0, t) : r;
    }
    var O = function() {
      this.urlMap = {};
    };
    O.prototype.attachWebSocket = function(t, n) {
      var e = w(n), o = this.urlMap[e];
      if (o && o.server && o.websockets.indexOf(t) === -1)
        return o.websockets.push(t), o.server;
    }, O.prototype.addMembershipToRoom = function(t, n) {
      var e = this.urlMap[w(t.url)];
      e && e.server && e.websockets.indexOf(t) !== -1 && (e.roomMemberships[n] || (e.roomMemberships[n] = []), e.roomMemberships[n].push(t));
    }, O.prototype.attachServer = function(t, n) {
      var e = w(n), o = this.urlMap[e];
      if (!o)
        return this.urlMap[e] = {
          server: t,
          websockets: [],
          roomMemberships: {}
        }, t;
    }, O.prototype.serverLookup = function(t) {
      var n = w(t), e = this.urlMap[n];
      if (e)
        return e.server;
    }, O.prototype.websocketsLookup = function(t, n, e) {
      var o = w(t), i, s = this.urlMap[o];
      if (i = s ? s.websockets : [], n) {
        var a = s.roomMemberships[n];
        i = a || [];
      }
      return e ? i.filter(function(u) {
        return u !== e;
      }) : i;
    }, O.prototype.removeServer = function(t) {
      delete this.urlMap[w(t)];
    }, O.prototype.removeWebSocket = function(t, n) {
      var e = w(n), o = this.urlMap[e];
      o && (o.websockets = B(o.websockets, function(i) {
        return i === t;
      }));
    }, O.prototype.removeMembershipFromRoom = function(t, n) {
      var e = this.urlMap[w(t.url)], o = e.roomMemberships[n];
      e && o !== null && (e.roomMemberships[n] = B(o, function(i) {
        return i === t;
      }));
    };
    var h = new O(), d = {
      CLOSE_NORMAL: 1e3,
      CLOSE_GOING_AWAY: 1001,
      CLOSE_PROTOCOL_ERROR: 1002,
      CLOSE_UNSUPPORTED: 1003,
      CLOSE_NO_STATUS: 1005,
      CLOSE_ABNORMAL: 1006,
      UNSUPPORTED_DATA: 1007,
      POLICY_VIOLATION: 1008,
      CLOSE_TOO_LARGE: 1009,
      MISSING_EXTENSION: 1010,
      INTERNAL_ERROR: 1011,
      SERVICE_RESTART: 1012,
      TRY_AGAIN_LATER: 1013,
      TLS_HANDSHAKE: 1015
    }, v = {
      CONSTRUCTOR_ERROR: "Failed to construct 'WebSocket':",
      CLOSE_ERROR: "Failed to execute 'close' on 'WebSocket':",
      EVENT: {
        CONSTRUCT: "Failed to construct 'Event':",
        MESSAGE: "Failed to construct 'MessageEvent':",
        CLOSE: "Failed to construct 'CloseEvent':"
      }
    }, N = function() {
    };
    N.prototype.stopPropagation = function() {
    }, N.prototype.stopImmediatePropagation = function() {
    }, N.prototype.initEvent = function(t, n, e) {
      t === void 0 && (t = "undefined"), n === void 0 && (n = !1), e === void 0 && (e = !1), this.type = "" + t, this.bubbles = !!n, this.cancelable = !!e;
    };
    var de = function(r) {
      function t(n, e) {
        if (e === void 0 && (e = {}), r.call(this), !n)
          throw new TypeError(v.EVENT_ERROR + " 1 argument required, but only 0 present.");
        if (typeof e != "object")
          throw new TypeError(v.EVENT_ERROR + " parameter 2 ('eventInitDict') is not an object.");
        var o = e.bubbles, i = e.cancelable;
        this.type = "" + n, this.timeStamp = Date.now(), this.target = null, this.srcElement = null, this.returnValue = !0, this.isTrusted = !1, this.eventPhase = 0, this.defaultPrevented = !1, this.currentTarget = null, this.cancelable = i ? !!i : !1, this.cancelBubble = !1, this.bubbles = o ? !!o : !1;
      }
      return t.__proto__ = r, t.prototype = Object.create(r.prototype), t.prototype.constructor = t, t;
    }(N), ye = function(r) {
      function t(n, e) {
        if (e === void 0 && (e = {}), r.call(this), !n)
          throw new TypeError(v.EVENT.MESSAGE + " 1 argument required, but only 0 present.");
        if (typeof e != "object")
          throw new TypeError(v.EVENT.MESSAGE + " parameter 2 ('eventInitDict') is not an object");
        var o = e.bubbles, i = e.cancelable, s = e.data, a = e.origin, u = e.lastEventId, l = e.ports;
        this.type = "" + n, this.timeStamp = Date.now(), this.target = null, this.srcElement = null, this.returnValue = !0, this.isTrusted = !1, this.eventPhase = 0, this.defaultPrevented = !1, this.currentTarget = null, this.cancelable = i ? !!i : !1, this.canncelBubble = !1, this.bubbles = o ? !!o : !1, this.origin = "" + a, this.ports = typeof l > "u" ? null : l, this.data = typeof s > "u" ? null : s, this.lastEventId = "" + (u || "");
      }
      return t.__proto__ = r, t.prototype = Object.create(r.prototype), t.prototype.constructor = t, t;
    }(N), me = function(r) {
      function t(n, e) {
        if (e === void 0 && (e = {}), r.call(this), !n)
          throw new TypeError(v.EVENT.CLOSE + " 1 argument required, but only 0 present.");
        if (typeof e != "object")
          throw new TypeError(v.EVENT.CLOSE + " parameter 2 ('eventInitDict') is not an object");
        var o = e.bubbles, i = e.cancelable, s = e.code, a = e.reason, u = e.wasClean;
        this.type = "" + n, this.timeStamp = Date.now(), this.target = null, this.srcElement = null, this.returnValue = !0, this.isTrusted = !1, this.eventPhase = 0, this.defaultPrevented = !1, this.currentTarget = null, this.cancelable = i ? !!i : !1, this.cancelBubble = !1, this.bubbles = o ? !!o : !1, this.code = typeof s == "number" ? parseInt(s, 10) : 0, this.reason = "" + (a || ""), this.wasClean = u ? !!u : !1;
      }
      return t.__proto__ = r, t.prototype = Object.create(r.prototype), t.prototype.constructor = t, t;
    }(N);
    function y(r) {
      var t = r.type, n = r.target, e = new de(t);
      return n && (e.target = n, e.srcElement = n, e.currentTarget = n), e;
    }
    function A(r) {
      var t = r.type, n = r.origin, e = r.data, o = r.target, i = new ye(t, {
        data: e,
        origin: n
      });
      return o && (i.target = o, i.srcElement = o, i.currentTarget = o), i;
    }
    function S(r) {
      var t = r.code, n = r.reason, e = r.type, o = r.target, i = r.wasClean;
      i || (i = t === d.CLOSE_NORMAL || t === d.CLOSE_NO_STATUS);
      var s = new me(e, {
        code: t,
        reason: n,
        wasClean: i
      });
      return o && (s.target = o, s.srcElement = o, s.currentTarget = o), s;
    }
    function $(r, t, n) {
      r.readyState = f.CLOSING;
      var e = h.serverLookup(r.url), o = S({
        type: "close",
        target: r.target,
        code: t,
        reason: n
      });
      T(function() {
        h.removeWebSocket(r, r.url), r.readyState = f.CLOSED, r.dispatchEvent(o), e && e.dispatchEvent(o, e);
      }, r);
    }
    function Ee(r, t, n) {
      r.readyState = f.CLOSING;
      var e = h.serverLookup(r.url), o = S({
        type: "close",
        target: r.target,
        code: t,
        reason: n,
        wasClean: !1
      }), i = y({
        type: "error",
        target: r.target
      });
      T(function() {
        h.removeWebSocket(r, r.url), r.readyState = f.CLOSED, r.dispatchEvent(i), r.dispatchEvent(o), e && e.dispatchEvent(o, e);
      }, r);
    }
    function P(r) {
      return Object.prototype.toString.call(r) !== "[object Blob]" && !(r instanceof ArrayBuffer) && (r = String(r)), r;
    }
    var V = /* @__PURE__ */ new WeakMap();
    function ee(r) {
      if (V.has(r))
        return V.get(r);
      var t = new Proxy(r, {
        get: function(e, o) {
          if (o === "close")
            return function(a) {
              a === void 0 && (a = {});
              var u = a.code || d.CLOSE_NORMAL, l = a.reason || "";
              $(t, u, l);
            };
          if (o === "send")
            return function(a) {
              a = P(a), r.dispatchEvent(
                A({
                  type: "message",
                  data: a,
                  origin: this.url,
                  target: r
                })
              );
            };
          var i = function(s) {
            return s === "message" ? "server::" + s : s;
          };
          return o === "on" ? function(a, u) {
            r.addEventListener(i(a), u);
          } : o === "off" ? function(a, u) {
            r.removeEventListener(i(a), u);
          } : o === "target" ? r : e[o];
        }
      });
      return V.set(r, t), t;
    }
    function Se(r) {
      var t = encodeURIComponent(r).match(/%[89ABab]/g);
      return r.length + (t ? t.length : 0);
    }
    function ge(r) {
      var t = new q(r), n = t.pathname, e = t.protocol, o = t.hash;
      if (!r)
        throw new TypeError(v.CONSTRUCTOR_ERROR + " 1 argument required, but only 0 present.");
      if (n || (t.pathname = "/"), e === "")
        throw new SyntaxError(v.CONSTRUCTOR_ERROR + " The URL '" + t.toString() + "' is invalid.");
      if (e !== "ws:" && e !== "wss:")
        throw new SyntaxError(
          v.CONSTRUCTOR_ERROR + " The URL's scheme must be either 'ws' or 'wss'. '" + e + "' is not allowed."
        );
      if (o !== "")
        throw new SyntaxError(
          v.CONSTRUCTOR_ERROR + " The URL contains a fragment identifier ('" + o + "'). Fragment identifiers are not allowed in WebSocket URLs."
        );
      return t.toString();
    }
    function be(r) {
      if (r === void 0 && (r = []), !Array.isArray(r) && typeof r != "string")
        throw new SyntaxError(v.CONSTRUCTOR_ERROR + " The subprotocol '" + r.toString() + "' is invalid.");
      typeof r == "string" && (r = [r]);
      var t = r.map(function(e) {
        return { count: 1, protocol: e };
      }).reduce(function(e, o) {
        return e[o.protocol] = (e[o.protocol] || 0) + o.count, e;
      }, {}), n = Object.keys(t).filter(function(e) {
        return t[e] > 1;
      });
      if (n.length > 0)
        throw new SyntaxError(v.CONSTRUCTOR_ERROR + " The subprotocol '" + n[0] + "' is duplicated.");
      return r;
    }
    var f = function(r) {
      function t(e, o) {
        r.call(this), this._onopen = null, this._onmessage = null, this._onerror = null, this._onclose = null, this.url = ge(e), o = be(o), this.protocol = o[0] || "", this.binaryType = "blob", this.readyState = t.CONNECTING;
        var i = ee(this), s = h.attachWebSocket(i, this.url);
        T(function() {
          if (this.readyState === t.CONNECTING)
            if (s)
              if (s.options.verifyClient && typeof s.options.verifyClient == "function" && !s.options.verifyClient())
                this.readyState = t.CLOSED, j(
                  "error",
                  "WebSocket connection to '" + this.url + "' failed: HTTP Authentication failed; no valid credentials available"
                ), h.removeWebSocket(i, this.url), this.dispatchEvent(y({ type: "error", target: this })), this.dispatchEvent(S({ type: "close", target: this, code: d.CLOSE_NORMAL }));
              else {
                if (s.options.selectProtocol && typeof s.options.selectProtocol == "function") {
                  var u = s.options.selectProtocol(o), l = u !== "", p = o.indexOf(u) !== -1;
                  if (l && !p) {
                    this.readyState = t.CLOSED, j("error", "WebSocket connection to '" + this.url + "' failed: Invalid Sub-Protocol"), h.removeWebSocket(i, this.url), this.dispatchEvent(y({ type: "error", target: this })), this.dispatchEvent(S({ type: "close", target: this, code: d.CLOSE_NORMAL }));
                    return;
                  }
                  this.protocol = u;
                }
                this.readyState = t.OPEN, this.dispatchEvent(y({ type: "open", target: this })), s.dispatchEvent(y({ type: "connection" }), i);
              }
            else
              this.readyState = t.CLOSED, this.dispatchEvent(y({ type: "error", target: this })), this.dispatchEvent(S({ type: "close", target: this, code: d.CLOSE_NORMAL })), j("error", "WebSocket connection to '" + this.url + "' failed");
        }, this);
      }
      t.__proto__ = r, t.prototype = Object.create(r.prototype), t.prototype.constructor = t;
      var n = { onopen: {}, onmessage: {}, onclose: {}, onerror: {} };
      return n.onopen.get = function() {
        return this._onopen;
      }, n.onmessage.get = function() {
        return this._onmessage;
      }, n.onclose.get = function() {
        return this._onclose;
      }, n.onerror.get = function() {
        return this._onerror;
      }, n.onopen.set = function(e) {
        this.removeEventListener("open", this._onopen), this._onopen = e, this.addEventListener("open", e);
      }, n.onmessage.set = function(e) {
        this.removeEventListener("message", this._onmessage), this._onmessage = e, this.addEventListener("message", e);
      }, n.onclose.set = function(e) {
        this.removeEventListener("close", this._onclose), this._onclose = e, this.addEventListener("close", e);
      }, n.onerror.set = function(e) {
        this.removeEventListener("error", this._onerror), this._onerror = e, this.addEventListener("error", e);
      }, t.prototype.send = function(o) {
        var i = this;
        if (this.readyState === t.CONNECTING)
          throw new Error("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state");
        var s = A({
          type: "server::message",
          origin: this.url,
          data: P(o)
        }), a = h.serverLookup(this.url);
        a && T(function() {
          i.dispatchEvent(s, o);
        }, a);
      }, t.prototype.close = function(o, i) {
        if (o !== void 0 && (typeof o != "number" || o !== 1e3 && (o < 3e3 || o > 4999)))
          throw new TypeError(
            v.CLOSE_ERROR + " The code must be either 1000, or between 3000 and 4999. " + o + " is neither."
          );
        if (i !== void 0) {
          var s = Se(i);
          if (s > 123)
            throw new SyntaxError(v.CLOSE_ERROR + " The message must not be greater than 123 bytes.");
        }
        if (!(this.readyState === t.CLOSING || this.readyState === t.CLOSED)) {
          var a = ee(this);
          this.readyState === t.CONNECTING ? Ee(a, o || d.CLOSE_ABNORMAL, i) : $(a, o || d.CLOSE_NO_STATUS, i);
        }
      }, Object.defineProperties(t.prototype, n), t;
    }(C);
    f.CONNECTING = 0, f.prototype.CONNECTING = f.CONNECTING, f.OPEN = 1, f.prototype.OPEN = f.OPEN, f.CLOSING = 2, f.prototype.CLOSING = f.CLOSING, f.CLOSED = 3, f.prototype.CLOSED = f.CLOSED;
    var k = function(r) {
      function t(e, o) {
        var i = this;
        e === void 0 && (e = "socket.io"), o === void 0 && (o = ""), r.call(this), this.binaryType = "blob";
        var s = new q(e);
        s.pathname || (s.pathname = "/"), this.url = s.toString(), this.readyState = t.CONNECTING, this.protocol = "", this.target = this, typeof o == "string" || typeof o == "object" && o !== null ? this.protocol = o : Array.isArray(o) && o.length > 0 && (this.protocol = o[0]);
        var a = h.attachWebSocket(this, this.url);
        T(function() {
          a ? (this.readyState = t.OPEN, a.dispatchEvent(y({ type: "connection" }), a, this), a.dispatchEvent(y({ type: "connect" }), a, this), this.dispatchEvent(y({ type: "connect", target: this }))) : (this.readyState = t.CLOSED, this.dispatchEvent(y({ type: "error", target: this })), this.dispatchEvent(
            S({
              type: "close",
              target: this,
              code: d.CLOSE_NORMAL
            })
          ), j("error", "Socket.io connection to '" + this.url + "' failed"));
        }, this), this.addEventListener("close", function(u) {
          i.dispatchEvent(
            S({
              type: "disconnect",
              target: u.target,
              code: u.code
            })
          );
        });
      }
      t.__proto__ = r, t.prototype = Object.create(r.prototype), t.prototype.constructor = t;
      var n = { broadcast: {} };
      return t.prototype.close = function() {
        if (this.readyState === t.OPEN) {
          var o = h.serverLookup(this.url);
          return h.removeWebSocket(this, this.url), this.readyState = t.CLOSED, this.dispatchEvent(
            S({
              type: "close",
              target: this,
              code: d.CLOSE_NORMAL
            })
          ), o && o.dispatchEvent(
            S({
              type: "disconnect",
              target: this,
              code: d.CLOSE_NORMAL
            }),
            o
          ), this;
        }
      }, t.prototype.disconnect = function() {
        return this.close();
      }, t.prototype.emit = function(o) {
        for (var i = [], s = arguments.length - 1; s-- > 0; ) i[s] = arguments[s + 1];
        if (this.readyState !== t.OPEN)
          throw new Error("SocketIO is already in CLOSING or CLOSED state");
        var a = A({
          type: o,
          origin: this.url,
          data: i
        }), u = h.serverLookup(this.url);
        return u && u.dispatchEvent.apply(u, [a].concat(i)), this;
      }, t.prototype.send = function(o) {
        return this.emit("message", o), this;
      }, n.broadcast.get = function() {
        if (this.readyState !== t.OPEN)
          throw new Error("SocketIO is already in CLOSING or CLOSED state");
        var e = this, o = h.serverLookup(this.url);
        if (!o)
          throw new Error("SocketIO can not find a server at the specified URL (" + this.url + ")");
        return {
          emit: function(s, a) {
            return o.emit(s, a, { websockets: h.websocketsLookup(e.url, null, e) }), e;
          },
          to: function(s) {
            return o.to(s, e);
          },
          in: function(s) {
            return o.in(s, e);
          }
        };
      }, t.prototype.on = function(o, i) {
        return this.addEventListener(o, i), this;
      }, t.prototype.off = function(o, i) {
        this.removeEventListener(o, i);
      }, t.prototype.hasListeners = function(o) {
        var i = this.listeners[o];
        return Array.isArray(i) ? !!i.length : !1;
      }, t.prototype.join = function(o) {
        h.addMembershipToRoom(this, o);
      }, t.prototype.leave = function(o) {
        h.removeMembershipFromRoom(this, o);
      }, t.prototype.to = function(o) {
        return this.broadcast.to(o);
      }, t.prototype.in = function() {
        return this.to.apply(null, arguments);
      }, t.prototype.dispatchEvent = function(o) {
        for (var i = this, s = [], a = arguments.length - 1; a-- > 0; ) s[a] = arguments[a + 1];
        var u = o.type, l = this.listeners[u];
        if (!Array.isArray(l))
          return !1;
        l.forEach(function(p) {
          s.length > 0 ? p.apply(i, s) : p.call(i, o.data ? o.data : o);
        });
      }, Object.defineProperties(t.prototype, n), t;
    }(C);
    k.CONNECTING = 0, k.OPEN = 1, k.CLOSING = 2, k.CLOSED = 3;
    var F = function(t, n) {
      return new k(t, n);
    };
    F.connect = function(t, n) {
      return F(t, n);
    };
    var Oe = function(r) {
      return r.reduce(function(t, n) {
        return t.indexOf(n) > -1 ? t : t.concat(n);
      }, []);
    };
    function te() {
      return typeof window < "u" ? window : typeof process == "object" && typeof Ce == "function" && typeof M == "object" ? M : this;
    }
    var re = {
      mock: !0,
      verifyClient: null,
      selectProtocol: null
    }, x = function(r) {
      function t(n, e) {
        e === void 0 && (e = re), r.call(this);
        var o = new q(n);
        o.pathname || (o.pathname = "/"), this.url = o.toString(), this.originalWebSocket = null;
        var i = h.attachServer(this, this.url);
        if (!i)
          throw this.dispatchEvent(y({ type: "error" })), new Error("A mock server is already listening on this url");
        this.options = Object.assign({}, re, e), this.options.mock && this.mockWebsocket();
      }
      return t.__proto__ = r, t.prototype = Object.create(r.prototype), t.prototype.constructor = t, t.prototype.mockWebsocket = function() {
        var e = te();
        this.originalWebSocket = e.WebSocket, e.WebSocket = f;
      }, t.prototype.restoreWebsocket = function() {
        var e = te();
        this.originalWebSocket !== null && (e.WebSocket = this.originalWebSocket), this.originalWebSocket = null;
      }, t.prototype.stop = function(e) {
        e === void 0 && (e = function() {
        }), this.options.mock && this.restoreWebsocket(), h.removeServer(this.url), typeof e == "function" && e();
      }, t.prototype.on = function(e, o) {
        this.addEventListener(e, o);
      }, t.prototype.off = function(e, o) {
        this.removeEventListener(e, o);
      }, t.prototype.close = function(e) {
        e === void 0 && (e = {});
        var o = e.code, i = e.reason, s = e.wasClean, a = h.websocketsLookup(this.url);
        h.removeServer(this.url), a.forEach(function(u) {
          u.readyState = f.CLOSED, u.dispatchEvent(
            S({
              type: "close",
              target: u.target,
              code: o || d.CLOSE_NORMAL,
              reason: i || "",
              wasClean: s
            })
          );
        }), this.dispatchEvent(S({ type: "close" }), this);
      }, t.prototype.emit = function(e, o, i) {
        var s = this;
        i === void 0 && (i = {});
        var a = i.websockets;
        a || (a = h.websocketsLookup(this.url));
        var u;
        typeof i != "object" || arguments.length > 3 ? (o = Array.prototype.slice.call(arguments, 1, arguments.length), u = o.map(function(l) {
          return P(l);
        })) : u = P(o), a.forEach(function(l) {
          var p = l instanceof k ? o : u;
          Array.isArray(p) ? l.dispatchEvent.apply(
            l,
            [A({
              type: e,
              data: p,
              origin: s.url,
              target: l.target
            })].concat(p)
          ) : l.dispatchEvent(
            A({
              type: e,
              data: p,
              origin: s.url,
              target: l.target
            })
          );
        });
      }, t.prototype.clients = function() {
        return h.websocketsLookup(this.url);
      }, t.prototype.to = function(e, o, i) {
        var s = this;
        i === void 0 && (i = []);
        var a = this, u = Oe(i.concat(h.websocketsLookup(this.url, e, o)));
        return {
          to: function(l, p) {
            return s.to.call(s, l, p, u);
          },
          emit: function(p, c) {
            a.emit(p, c, { websockets: u });
          }
        };
      }, t.prototype.in = function() {
        for (var e = [], o = arguments.length; o--; ) e[o] = arguments[o];
        return this.to.apply(null, e);
      }, t.prototype.simulate = function(e) {
        var o = h.websocketsLookup(this.url);
        e === "error" && o.forEach(function(i) {
          i.readyState = f.CLOSED, i.dispatchEvent(y({ type: "error", target: i.target }));
        });
      }, t;
    }(C);
    x.of = function(t) {
      return new x(t);
    };
    var we = x, Le = f, Re = F;
    m.Server = we, m.WebSocket = Le, m.SocketIO = Re, Object.defineProperty(m, "__esModule", { value: !0 });
  });
})(H, H.exports);
var Ne = H.exports;
const _e = (I = "ws://localhost:8080") => {
  const U = new Ne.Server(I);
  return U.on("connection", (m) => {
    console.log("Mock SignalR Server: Client connected!");
    const L = JSON.stringify({ protocol: "json", version: 1 }) + "";
    m.send(L), m.on("message", (R) => {
      if (console.log("Received from client:", R), typeof R == "string")
        try {
          const E = JSON.parse(R.replace("", ""));
          if (E != null && E.invocationId) {
            const _ = JSON.stringify({
              // Completion
              invocationId: E.invocationId,
              // Match request ID
              result: "Message received successfully",
              type: 3
            }) + "";
            m.send(_);
          }
          if (E.type === 1 && E.target === "sendMessage" && E.arguments[0] === "Hi") {
            const _ = JSON.stringify({
              arguments: ["Hello from mock server", "Orange Logic"],
              target: "ReceiveMessage",
              type: 1
            }) + "";
            m.send(_);
          }
        } catch (E) {
          console.error("Error parsing client message:", E);
        }
    }), m.on("close", () => {
      console.log("Mock SignalR Server: Client disconnected.");
    });
  }), U;
};
export {
  _e as getMockServer
};
