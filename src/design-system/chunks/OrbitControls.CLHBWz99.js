THREE.OrbitControls = function(r, A) {
  this.object = r, this.domElement = A !== void 0 ? A : document, this.enabled = !0, this.target = new THREE.Vector3(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.25, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.enableKeys = !0, this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }, this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = function() {
    return s.phi;
  }, this.getAzimuthalAngle = function() {
    return s.theta;
  }, this.saveState = function() {
    e.target0.copy(e.target), e.position0.copy(e.object.position), e.zoom0 = e.object.zoom;
  }, this.reset = function() {
    e.target.copy(e.target0), e.object.position.copy(e.position0), e.object.zoom = e.zoom0, e.object.updateProjectionMatrix(), e.dispatchEvent(N), e.update(), o = n.NONE;
  }, this.update = function() {
    var t = new THREE.Vector3(), a = new THREE.Quaternion().setFromUnitVectors(r.up, new THREE.Vector3(0, 1, 0)), i = a.clone().inverse(), c = new THREE.Vector3(), l = new THREE.Quaternion();
    return function() {
      var y = e.object.position;
      return t.copy(y).sub(e.target), t.applyQuaternion(a), s.setFromVector3(t), e.autoRotate && o === n.NONE && S(B()), s.theta += u.theta, s.phi += u.phi, s.theta = Math.max(e.minAzimuthAngle, Math.min(e.maxAzimuthAngle, s.theta)), s.phi = Math.max(e.minPolarAngle, Math.min(e.maxPolarAngle, s.phi)), s.makeSafe(), s.radius *= w, s.radius = Math.max(e.minDistance, Math.min(e.maxDistance, s.radius)), e.target.add(R), t.setFromSpherical(s), t.applyQuaternion(i), y.copy(e.target).add(t), e.object.lookAt(e.target), e.enableDamping === !0 ? (u.theta *= 1 - e.dampingFactor, u.phi *= 1 - e.dampingFactor, R.multiplyScalar(1 - e.dampingFactor)) : (u.set(0, 0, 0), R.set(0, 0, 0)), w = 1, P || c.distanceToSquared(e.object.position) > k || 8 * (1 - l.dot(e.object.quaternion)) > k ? (e.dispatchEvent(N), c.copy(e.object.position), l.copy(e.object.quaternion), P = !1, !0) : !1;
    };
  }(), this.dispose = function() {
    e.domElement.removeEventListener("contextmenu", _, !1), e.domElement.removeEventListener("mousedown", z, !1), e.domElement.removeEventListener("wheel", Y, !1), e.domElement.removeEventListener("touchstart", F, !1), e.domElement.removeEventListener("touchend", K, !1), e.domElement.removeEventListener("touchmove", X, !1), document.removeEventListener("mousemove", C, !1), document.removeEventListener("mouseup", L, !1), window.removeEventListener("keydown", I, !1);
  };
  var e = this, N = { type: "change" }, M = { type: "start" }, j = { type: "end" }, n = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 }, o = n.NONE, k = 1e-6, s = new THREE.Spherical(), u = new THREE.Spherical(), w = 1, R = new THREE.Vector3(), P = !1, m = new THREE.Vector2(), d = new THREE.Vector2(), h = new THREE.Vector2(), p = new THREE.Vector2(), f = new THREE.Vector2(), E = new THREE.Vector2(), b = new THREE.Vector2(), g = new THREE.Vector2(), O = new THREE.Vector2();
  function B() {
    return 2 * Math.PI / 60 / 60 * e.autoRotateSpeed;
  }
  function H() {
    return Math.pow(0.95, e.zoomSpeed);
  }
  function S(t) {
    u.theta -= t;
  }
  function x(t) {
    u.phi -= t;
  }
  var U = function() {
    var t = new THREE.Vector3();
    return function(i, c) {
      t.setFromMatrixColumn(c, 0), t.multiplyScalar(-i), R.add(t);
    };
  }(), Z = function() {
    var t = new THREE.Vector3();
    return function(i, c) {
      e.screenSpacePanning === !0 ? t.setFromMatrixColumn(c, 1) : (t.setFromMatrixColumn(c, 0), t.crossVectors(e.object.up, t)), t.multiplyScalar(i), R.add(t);
    };
  }(), T = function() {
    var t = new THREE.Vector3();
    return function(i, c) {
      var l = e.domElement === document ? e.domElement.body : e.domElement;
      if (e.object.isPerspectiveCamera) {
        var v = e.object.position;
        t.copy(v).sub(e.target);
        var y = t.length();
        y *= Math.tan(e.object.fov / 2 * Math.PI / 180), U(2 * i * y / l.clientHeight, e.object.matrix), Z(2 * c * y / l.clientHeight, e.object.matrix);
      } else e.object.isOrthographicCamera ? (U(i * (e.object.right - e.object.left) / e.object.zoom / l.clientWidth, e.object.matrix), Z(c * (e.object.top - e.object.bottom) / e.object.zoom / l.clientHeight, e.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), e.enablePan = !1);
    };
  }();
  function D(t) {
    e.object.isPerspectiveCamera ? w /= t : e.object.isOrthographicCamera ? (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom * t)), e.object.updateProjectionMatrix(), P = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
  }
  function V(t) {
    e.object.isPerspectiveCamera ? w *= t : e.object.isOrthographicCamera ? (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom / t)), e.object.updateProjectionMatrix(), P = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
  }
  function q(t) {
    m.set(t.clientX, t.clientY);
  }
  function G(t) {
    b.set(t.clientX, t.clientY);
  }
  function W(t) {
    p.set(t.clientX, t.clientY);
  }
  function Q(t) {
    d.set(t.clientX, t.clientY), h.subVectors(d, m).multiplyScalar(e.rotateSpeed);
    var a = e.domElement === document ? e.domElement.body : e.domElement;
    S(2 * Math.PI * h.x / a.clientHeight), x(2 * Math.PI * h.y / a.clientHeight), m.copy(d), e.update();
  }
  function J(t) {
    g.set(t.clientX, t.clientY), O.subVectors(g, b), O.y > 0 ? D(H()) : O.y < 0 && V(H()), b.copy(g), e.update();
  }
  function $(t) {
    f.set(t.clientX, t.clientY), E.subVectors(f, p).multiplyScalar(e.panSpeed), T(E.x, E.y), p.copy(f), e.update();
  }
  function ee(t) {
    t.deltaY < 0 ? V(H()) : t.deltaY > 0 && D(H()), e.update();
  }
  function te(t) {
    switch (t.keyCode) {
      case e.keys.UP:
        T(0, e.keyPanSpeed), e.update();
        break;
      case e.keys.BOTTOM:
        T(0, -e.keyPanSpeed), e.update();
        break;
      case e.keys.LEFT:
        T(e.keyPanSpeed, 0), e.update();
        break;
      case e.keys.RIGHT:
        T(-e.keyPanSpeed, 0), e.update();
        break;
    }
  }
  function ne(t) {
    m.set(t.touches[0].pageX, t.touches[0].pageY);
  }
  function oe(t) {
    if (e.enableZoom) {
      var a = t.touches[0].pageX - t.touches[1].pageX, i = t.touches[0].pageY - t.touches[1].pageY, c = Math.sqrt(a * a + i * i);
      b.set(0, c);
    }
    if (e.enablePan) {
      var l = 0.5 * (t.touches[0].pageX + t.touches[1].pageX), v = 0.5 * (t.touches[0].pageY + t.touches[1].pageY);
      p.set(l, v);
    }
  }
  function ae(t) {
    d.set(t.touches[0].pageX, t.touches[0].pageY), h.subVectors(d, m).multiplyScalar(e.rotateSpeed);
    var a = e.domElement === document ? e.domElement.body : e.domElement;
    S(2 * Math.PI * h.x / a.clientHeight), x(2 * Math.PI * h.y / a.clientHeight), m.copy(d), e.update();
  }
  function re(t) {
    if (e.enableZoom) {
      var a = t.touches[0].pageX - t.touches[1].pageX, i = t.touches[0].pageY - t.touches[1].pageY, c = Math.sqrt(a * a + i * i);
      g.set(0, c), O.set(0, Math.pow(g.y / b.y, e.zoomSpeed)), D(O.y), b.copy(g);
    }
    if (e.enablePan) {
      var l = 0.5 * (t.touches[0].pageX + t.touches[1].pageX), v = 0.5 * (t.touches[0].pageY + t.touches[1].pageY);
      f.set(l, v), E.subVectors(f, p).multiplyScalar(e.panSpeed), T(E.x, E.y), p.copy(f);
    }
    e.update();
  }
  function z(t) {
    if (e.enabled !== !1) {
      switch (t.preventDefault(), t.button) {
        case e.mouseButtons.ORBIT:
          if (e.enableRotate === !1) return;
          q(t), o = n.ROTATE;
          break;
        case e.mouseButtons.ZOOM:
          if (e.enableZoom === !1) return;
          G(t), o = n.DOLLY;
          break;
        case e.mouseButtons.PAN:
          if (e.enablePan === !1) return;
          W(t), o = n.PAN;
          break;
      }
      o !== n.NONE && (document.addEventListener("mousemove", C, !1), document.addEventListener("mouseup", L, !1), e.dispatchEvent(M));
    }
  }
  function C(t) {
    if (e.enabled !== !1)
      switch (t.preventDefault(), o) {
        case n.ROTATE:
          if (e.enableRotate === !1) return;
          Q(t);
          break;
        case n.DOLLY:
          if (e.enableZoom === !1) return;
          J(t);
          break;
        case n.PAN:
          if (e.enablePan === !1) return;
          $(t);
          break;
      }
  }
  function L(t) {
    e.enabled !== !1 && (document.removeEventListener("mousemove", C, !1), document.removeEventListener("mouseup", L, !1), e.dispatchEvent(j), o = n.NONE);
  }
  function Y(t) {
    e.enabled === !1 || e.enableZoom === !1 || o !== n.NONE && o !== n.ROTATE || (t.preventDefault(), t.stopPropagation(), e.dispatchEvent(M), ee(t), e.dispatchEvent(j));
  }
  function I(t) {
    e.enabled === !1 || e.enableKeys === !1 || e.enablePan === !1 || te(t);
  }
  function F(t) {
    if (e.enabled !== !1) {
      switch (t.preventDefault(), t.touches.length) {
        case 1:
          if (e.enableRotate === !1) return;
          ne(t), o = n.TOUCH_ROTATE;
          break;
        case 2:
          if (e.enableZoom === !1 && e.enablePan === !1) return;
          oe(t), o = n.TOUCH_DOLLY_PAN;
          break;
        default:
          o = n.NONE;
      }
      o !== n.NONE && e.dispatchEvent(M);
    }
  }
  function X(t) {
    if (e.enabled !== !1)
      switch (t.preventDefault(), t.stopPropagation(), t.touches.length) {
        case 1:
          if (e.enableRotate === !1 || o !== n.TOUCH_ROTATE) return;
          ae(t);
          break;
        case 2:
          if (e.enableZoom === !1 && e.enablePan === !1 || o !== n.TOUCH_DOLLY_PAN) return;
          re(t);
          break;
        default:
          o = n.NONE;
      }
  }
  function K(t) {
    e.enabled !== !1 && (e.dispatchEvent(j), o = n.NONE);
  }
  function _(t) {
    e.enabled !== !1 && t.preventDefault();
  }
  e.domElement.addEventListener("contextmenu", _, !1), e.domElement.addEventListener("mousedown", z, !1), e.domElement.addEventListener("wheel", Y, !1), e.domElement.addEventListener("touchstart", F, !1), e.domElement.addEventListener("touchend", K, !1), e.domElement.addEventListener("touchmove", X, !1), window.addEventListener("keydown", I, !1), this.update();
};
THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;
Object.defineProperties(THREE.OrbitControls.prototype, {
  center: {
    get: function() {
      return console.warn("THREE.OrbitControls: .center has been renamed to .target"), this.target;
    }
  },
  // backward compatibility
  noZoom: {
    get: function() {
      return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), !this.enableZoom;
    },
    set: function(r) {
      console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), this.enableZoom = !r;
    }
  },
  noRotate: {
    get: function() {
      return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), !this.enableRotate;
    },
    set: function(r) {
      console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), this.enableRotate = !r;
    }
  },
  noPan: {
    get: function() {
      return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."), !this.enablePan;
    },
    set: function(r) {
      console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."), this.enablePan = !r;
    }
  },
  noKeys: {
    get: function() {
      return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), !this.enableKeys;
    },
    set: function(r) {
      console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), this.enableKeys = !r;
    }
  },
  staticMoving: {
    get: function() {
      return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), !this.enableDamping;
    },
    set: function(r) {
      console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), this.enableDamping = !r;
    }
  },
  dynamicDampingFactor: {
    get: function() {
      return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.dampingFactor;
    },
    set: function(r) {
      console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.dampingFactor = r;
    }
  }
});
