THREE.VREffect = function(n, M) {
  var s, P, V = new THREE.Vector3(), T = new THREE.Vector3(), f, h, v = new THREE.Matrix4(), x = new THREE.Matrix4(), R = new THREE.Matrix4(), m = null;
  "VRFrameData" in window && (m = new window.VRFrameData());
  function L(t) {
    P = t, t.length > 0 ? s = t[0] : M && M("HMD not available");
  }
  navigator.getVRDisplays && navigator.getVRDisplays().then(L).catch(function() {
    console.warn("THREE.VREffect: Unable to get VR Displays");
  }), this.isPresenting = !1;
  var w = this, y = n.getSize(), S = !1, E = n.getPixelRatio();
  this.getVRDisplay = function() {
    return s;
  }, this.setVRDisplay = function(t) {
    s = t;
  }, this.getVRDisplays = function() {
    return console.warn("THREE.VREffect: getVRDisplays() is being deprecated."), P;
  }, this.setSize = function(t, e, i) {
    if (y = { width: t, height: e }, S = i, w.isPresenting) {
      var a = s.getEyeParameters("left");
      n.setPixelRatio(1), n.setSize(a.renderWidth * 2, a.renderHeight, !1);
    } else
      n.setPixelRatio(E), n.setSize(t, e, i);
  };
  var U = n.domElement, D = [0, 0, 0.5, 1], A = [0.5, 0, 0.5, 1];
  function F() {
    var t = w.isPresenting;
    if (w.isPresenting = s !== void 0 && s.isPresenting, w.isPresenting) {
      var e = s.getEyeParameters("left"), i = e.renderWidth, a = e.renderHeight;
      t || (E = n.getPixelRatio(), y = n.getSize(), n.setPixelRatio(1), n.setSize(i * 2, a, !1));
    } else t && (n.setPixelRatio(E), n.setSize(y.width, y.height, S));
  }
  window.addEventListener("vrdisplaypresentchange", F, !1), this.setFullScreen = function(t) {
    return new Promise(function(e, i) {
      if (s === void 0) {
        i(new Error("No VR hardware found."));
        return;
      }
      if (w.isPresenting === t) {
        e();
        return;
      }
      e(t ? s.requestPresent([{ source: U }]) : s.exitPresent());
    });
  }, this.requestPresent = function() {
    return this.setFullScreen(!0);
  }, this.exitPresent = function() {
    return this.setFullScreen(!1);
  }, this.requestAnimationFrame = function(t) {
    return s !== void 0 ? s.requestAnimationFrame(t) : window.requestAnimationFrame(t);
  }, this.cancelAnimationFrame = function(t) {
    s !== void 0 ? s.cancelAnimationFrame(t) : window.cancelAnimationFrame(t);
  }, this.submitFrame = function() {
    s !== void 0 && w.isPresenting && s.submitFrame();
  }, this.autoSubmitFrame = !0;
  var l = new THREE.PerspectiveCamera();
  l.layers.enable(1);
  var u = new THREE.PerspectiveCamera();
  u.layers.enable(2), this.render = function(t, e, i, a) {
    if (s && w.isPresenting) {
      var c = t.autoUpdate;
      c && (t.updateMatrixWorld(), t.autoUpdate = !1), Array.isArray(t) && (console.warn("THREE.VREffect.render() no longer supports arrays. Use object.layers instead."), t = t[0]);
      var o = n.getSize(), r = s.getLayers(), p, g;
      if (r.length) {
        var d = r[0];
        p = d.leftBounds !== null && d.leftBounds.length === 4 ? d.leftBounds : D, g = d.rightBounds !== null && d.rightBounds.length === 4 ? d.rightBounds : A;
      } else
        p = D, g = A;
      if (f = {
        x: Math.round(o.width * p[0]),
        y: Math.round(o.height * p[1]),
        width: Math.round(o.width * p[2]),
        height: Math.round(o.height * p[3])
      }, h = {
        x: Math.round(o.width * g[0]),
        y: Math.round(o.height * g[1]),
        width: Math.round(o.width * g[2]),
        height: Math.round(o.height * g[3])
      }, i ? (n.setRenderTarget(i), i.scissorTest = !0) : (n.setRenderTarget(null), n.setScissorTest(!0)), (n.autoClear || a) && n.clear(), e.parent === null && e.updateMatrixWorld(), e.matrixWorld.decompose(l.position, l.quaternion, l.scale), u.position.copy(l.position), u.quaternion.copy(l.quaternion), u.scale.copy(l.scale), s.getFrameData)
        s.depthNear = e.near, s.depthFar = e.far, s.getFrameData(m), l.projectionMatrix.elements = m.leftProjectionMatrix, u.projectionMatrix.elements = m.rightProjectionMatrix, W(m), l.updateMatrix(), l.matrix.multiply(x), l.matrix.decompose(l.position, l.quaternion, l.scale), u.updateMatrix(), u.matrix.multiply(R), u.matrix.decompose(u.position, u.quaternion, u.scale);
      else {
        var q = s.getEyeParameters("left"), O = s.getEyeParameters("right");
        l.projectionMatrix = j(q.fieldOfView, !0, e.near, e.far), u.projectionMatrix = j(O.fieldOfView, !0, e.near, e.far), V.fromArray(q.offset), T.fromArray(O.offset), l.translateOnAxis(V, l.scale.x), u.translateOnAxis(T, u.scale.x);
      }
      i ? (i.viewport.set(f.x, f.y, f.width, f.height), i.scissor.set(f.x, f.y, f.width, f.height)) : (n.setViewport(f.x, f.y, f.width, f.height), n.setScissor(f.x, f.y, f.width, f.height)), n.render(t, l, i, a), i ? (i.viewport.set(h.x, h.y, h.width, h.height), i.scissor.set(h.x, h.y, h.width, h.height)) : (n.setViewport(h.x, h.y, h.width, h.height), n.setScissor(h.x, h.y, h.width, h.height)), n.render(t, u, i, a), i ? (i.viewport.set(0, 0, o.width, o.height), i.scissor.set(0, 0, o.width, o.height), i.scissorTest = !1, n.setRenderTarget(null)) : (n.setViewport(0, 0, o.width, o.height), n.setScissorTest(!1)), c && (t.autoUpdate = !0), w.autoSubmitFrame && w.submitFrame();
      return;
    }
    n.render(t, e, i, a);
  }, this.dispose = function() {
    window.removeEventListener("vrdisplaypresentchange", F, !1);
  };
  var H = new THREE.Quaternion(), b = new THREE.Vector3();
  function W(t) {
    t.pose.orientation ? (H.fromArray(t.pose.orientation), v.makeRotationFromQuaternion(H)) : v.identity(), t.pose.position && (b.fromArray(t.pose.position), v.setPosition(b)), x.fromArray(t.leftViewMatrix), x.multiply(v), R.fromArray(t.rightViewMatrix), R.multiply(v), x.getInverse(x), R.getInverse(R);
  }
  function I(t) {
    var e = 2 / (t.leftTan + t.rightTan), i = (t.leftTan - t.rightTan) * e * 0.5, a = 2 / (t.upTan + t.downTan), c = (t.upTan - t.downTan) * a * 0.5;
    return { scale: [e, a], offset: [i, c] };
  }
  function C(t, e, i, a) {
    e = e === void 0 ? !0 : e, i = i === void 0 ? 0.01 : i, a = a === void 0 ? 1e4 : a;
    var c = e ? -1 : 1, o = new THREE.Matrix4(), r = o.elements, p = I(t);
    return r[0 * 4 + 0] = p.scale[0], r[0 * 4 + 1] = 0, r[0 * 4 + 2] = p.offset[0] * c, r[0 * 4 + 3] = 0, r[1 * 4 + 0] = 0, r[1 * 4 + 1] = p.scale[1], r[1 * 4 + 2] = -p.offset[1] * c, r[1 * 4 + 3] = 0, r[2 * 4 + 0] = 0, r[2 * 4 + 1] = 0, r[2 * 4 + 2] = a / (i - a) * -c, r[2 * 4 + 3] = a * i / (i - a), r[3 * 4 + 0] = 0, r[3 * 4 + 1] = 0, r[3 * 4 + 2] = c, r[3 * 4 + 3] = 0, o.transpose(), o;
  }
  function j(t, e, i, a) {
    var c = Math.PI / 180, o = {
      upTan: Math.tan(t.upDegrees * c),
      downTan: Math.tan(t.downDegrees * c),
      leftTan: Math.tan(t.leftDegrees * c),
      rightTan: Math.tan(t.rightDegrees * c)
    };
    return C(o, e, i, a);
  }
};
