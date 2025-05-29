THREE.DeviceOrientationControls = function(c) {
  var e = this;
  this.object = c, this.object.rotation.reorder("YXZ"), this.enabled = !0, this.deviceOrientation = {}, this.screenOrientation = 0, this.alphaOffset = 0;
  var s = function(n) {
    e.deviceOrientation = n;
  }, a = function() {
    e.screenOrientation = window.orientation || 0;
  }, d = function() {
    var n = new THREE.Vector3(0, 0, 1), i = new THREE.Euler(), o = new THREE.Quaternion(), r = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    return function(t, v, h, E, l) {
      i.set(h, v, -E, "YXZ"), t.setFromEuler(i), t.multiply(r), t.multiply(o.setFromAxisAngle(n, -l));
    };
  }();
  this.connect = function() {
    a(), window.addEventListener("orientationchange", a, !1), window.addEventListener("deviceorientation", s, !1), e.enabled = !0;
  }, this.disconnect = function() {
    window.removeEventListener("orientationchange", a, !1), window.removeEventListener("deviceorientation", s, !1), e.enabled = !1;
  }, this.update = function() {
    if (e.enabled !== !1) {
      var n = e.deviceOrientation;
      if (n) {
        var i = n.alpha ? THREE.Math.degToRad(n.alpha) + e.alphaOffset : 0, o = n.beta ? THREE.Math.degToRad(n.beta) : 0, r = n.gamma ? THREE.Math.degToRad(n.gamma) : 0, t = e.screenOrientation ? THREE.Math.degToRad(e.screenOrientation) : 0;
        d(e.object.quaternion, i, o, r, t);
      }
    }
  }, this.dispose = function() {
    e.disconnect();
  }, this.connect();
};
