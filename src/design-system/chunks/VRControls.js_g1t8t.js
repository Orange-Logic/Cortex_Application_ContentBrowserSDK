THREE.VRControls = function(a, e) {
  var o = this, t, r, n = new THREE.Matrix4(), s = null;
  "VRFrameData" in window && (s = new VRFrameData());
  function l(i) {
    r = i, i.length > 0 ? t = i[0] : e && e("VR input not available.");
  }
  navigator.getVRDisplays && navigator.getVRDisplays().then(l).catch(function() {
    console.warn("THREE.VRControls: Unable to get VR Displays");
  }), this.scale = 1, this.standing = !1, this.userHeight = 1.6, this.getVRDisplay = function() {
    return t;
  }, this.setVRDisplay = function(i) {
    t = i;
  }, this.getVRDisplays = function() {
    return console.warn("THREE.VRControls: getVRDisplays() is being deprecated."), r;
  }, this.getStandingMatrix = function() {
    return n;
  }, this.update = function() {
    if (t) {
      var i;
      t.getFrameData ? (t.getFrameData(s), i = s.pose) : t.getPose && (i = t.getPose()), i.orientation !== null && a.quaternion.fromArray(i.orientation), i.position !== null ? a.position.fromArray(i.position) : a.position.set(0, 0, 0), this.standing && (t.stageParameters ? (a.updateMatrix(), n.fromArray(t.stageParameters.sittingToStandingTransform), a.applyMatrix(n)) : a.position.setY(a.position.y + this.userHeight)), a.position.multiplyScalar(o.scale);
    }
  }, this.dispose = function() {
    t = null;
  };
};
