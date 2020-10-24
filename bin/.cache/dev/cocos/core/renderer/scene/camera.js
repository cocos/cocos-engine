(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../geometry/index.js", "../../gfx/define.js", "../../math/index.js", "../../pipeline/define.js", "../../global-exports.js", "../core/memory-pools.js", "../../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../geometry/index.js"), require("../../gfx/define.js"), require("../../math/index.js"), require("../../pipeline/define.js"), require("../../global-exports.js"), require("../core/memory-pools.js"), require("../../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.index, global.define, global.globalExports, global.memoryPools, global.defaultConstants);
    global.camera = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _index2, _define2, _globalExports, _memoryPools, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Camera = _exports.SKYBOX_FLAG = _exports.CameraShutter = _exports.CameraISO = _exports.CameraAperture = _exports.CameraProjection = _exports.CameraFOVAxis = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var CameraFOVAxis;
  _exports.CameraFOVAxis = CameraFOVAxis;

  (function (CameraFOVAxis) {
    CameraFOVAxis[CameraFOVAxis["VERTICAL"] = 0] = "VERTICAL";
    CameraFOVAxis[CameraFOVAxis["HORIZONTAL"] = 1] = "HORIZONTAL";
  })(CameraFOVAxis || (_exports.CameraFOVAxis = CameraFOVAxis = {}));

  var CameraProjection;
  _exports.CameraProjection = CameraProjection;

  (function (CameraProjection) {
    CameraProjection[CameraProjection["ORTHO"] = 0] = "ORTHO";
    CameraProjection[CameraProjection["PERSPECTIVE"] = 1] = "PERSPECTIVE";
  })(CameraProjection || (_exports.CameraProjection = CameraProjection = {}));

  var CameraAperture;
  _exports.CameraAperture = CameraAperture;

  (function (CameraAperture) {
    CameraAperture[CameraAperture["F1_8"] = 0] = "F1_8";
    CameraAperture[CameraAperture["F2_0"] = 1] = "F2_0";
    CameraAperture[CameraAperture["F2_2"] = 2] = "F2_2";
    CameraAperture[CameraAperture["F2_5"] = 3] = "F2_5";
    CameraAperture[CameraAperture["F2_8"] = 4] = "F2_8";
    CameraAperture[CameraAperture["F3_2"] = 5] = "F3_2";
    CameraAperture[CameraAperture["F3_5"] = 6] = "F3_5";
    CameraAperture[CameraAperture["F4_0"] = 7] = "F4_0";
    CameraAperture[CameraAperture["F4_5"] = 8] = "F4_5";
    CameraAperture[CameraAperture["F5_0"] = 9] = "F5_0";
    CameraAperture[CameraAperture["F5_6"] = 10] = "F5_6";
    CameraAperture[CameraAperture["F6_3"] = 11] = "F6_3";
    CameraAperture[CameraAperture["F7_1"] = 12] = "F7_1";
    CameraAperture[CameraAperture["F8_0"] = 13] = "F8_0";
    CameraAperture[CameraAperture["F9_0"] = 14] = "F9_0";
    CameraAperture[CameraAperture["F10_0"] = 15] = "F10_0";
    CameraAperture[CameraAperture["F11_0"] = 16] = "F11_0";
    CameraAperture[CameraAperture["F13_0"] = 17] = "F13_0";
    CameraAperture[CameraAperture["F14_0"] = 18] = "F14_0";
    CameraAperture[CameraAperture["F16_0"] = 19] = "F16_0";
    CameraAperture[CameraAperture["F18_0"] = 20] = "F18_0";
    CameraAperture[CameraAperture["F20_0"] = 21] = "F20_0";
    CameraAperture[CameraAperture["F22_0"] = 22] = "F22_0";
  })(CameraAperture || (_exports.CameraAperture = CameraAperture = {}));

  var CameraISO;
  _exports.CameraISO = CameraISO;

  (function (CameraISO) {
    CameraISO[CameraISO["ISO100"] = 0] = "ISO100";
    CameraISO[CameraISO["ISO200"] = 1] = "ISO200";
    CameraISO[CameraISO["ISO400"] = 2] = "ISO400";
    CameraISO[CameraISO["ISO800"] = 3] = "ISO800";
  })(CameraISO || (_exports.CameraISO = CameraISO = {}));

  var CameraShutter;
  _exports.CameraShutter = CameraShutter;

  (function (CameraShutter) {
    CameraShutter[CameraShutter["D1"] = 0] = "D1";
    CameraShutter[CameraShutter["D2"] = 1] = "D2";
    CameraShutter[CameraShutter["D4"] = 2] = "D4";
    CameraShutter[CameraShutter["D8"] = 3] = "D8";
    CameraShutter[CameraShutter["D15"] = 4] = "D15";
    CameraShutter[CameraShutter["D30"] = 5] = "D30";
    CameraShutter[CameraShutter["D60"] = 6] = "D60";
    CameraShutter[CameraShutter["D125"] = 7] = "D125";
    CameraShutter[CameraShutter["D250"] = 8] = "D250";
    CameraShutter[CameraShutter["D500"] = 9] = "D500";
    CameraShutter[CameraShutter["D1000"] = 10] = "D1000";
    CameraShutter[CameraShutter["D2000"] = 11] = "D2000";
    CameraShutter[CameraShutter["D4000"] = 12] = "D4000";
  })(CameraShutter || (_exports.CameraShutter = CameraShutter = {}));

  var FSTOPS = [1.8, 2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 8.0, 9.0, 10.0, 11.0, 13.0, 14.0, 16.0, 18.0, 20.0, 22.0];
  var SHUTTERS = [1.0, 1.0 / 2.0, 1.0 / 4.0, 1.0 / 8.0, 1.0 / 15.0, 1.0 / 30.0, 1.0 / 60.0, 1.0 / 125.0, 1.0 / 250.0, 1.0 / 500.0, 1.0 / 1000.0, 1.0 / 2000.0, 1.0 / 4000.0];
  var ISOS = [100.0, 200.0, 400.0, 800.0];
  var v_a = new _index2.Vec3();
  var v_b = new _index2.Vec3();

  var _tempMat1 = new _index2.Mat4();

  var _tempMat2 = new _index2.Mat4();

  var SKYBOX_FLAG = _define.GFXClearFlag.STENCIL << 1;
  _exports.SKYBOX_FLAG = SKYBOX_FLAG;

  var Camera = /*#__PURE__*/function () {
    function Camera(device) {
      _classCallCheck(this, Camera);

      this.isWindowSize = true;
      this.screenScale = void 0;
      this._device = void 0;
      this._scene = null;
      this._node = null;
      this._name = null;
      this._enabled = false;
      this._proj = -1;
      this._aspect = void 0;
      this._orthoHeight = 10.0;
      this._fovAxis = CameraFOVAxis.VERTICAL;
      this._fov = (0, _index2.toRadian)(45);
      this._nearClip = 1.0;
      this._farClip = 1000.0;
      this._clearColor = new _define.GFXColor(0.2, 0.2, 0.2, 1);
      this._viewport = new _index2.Rect(0, 0, 1, 1);
      this._isProjDirty = true;
      this._matView = new _index2.Mat4();
      this._matViewInv = null;
      this._matProj = new _index2.Mat4();
      this._matProjInv = new _index2.Mat4();
      this._matViewProj = new _index2.Mat4();
      this._matViewProjInv = new _index2.Mat4();
      this._frustum = new _index.frustum();
      this._forward = new _index2.Vec3();
      this._position = new _index2.Vec3();
      this._view = null;
      this._visibility = _define2.CAMERA_DEFAULT_MASK;
      this._priority = 0;
      this._aperture = CameraAperture.F16_0;
      this._apertureValue = void 0;
      this._shutter = CameraShutter.D125;
      this._shutterValue = 0.0;
      this._iso = CameraISO.ISO100;
      this._isoValue = 0.0;
      this._ec = 0.0;
      this._poolHandle = _memoryPools.NULL_HANDLE;
      this._frustumHandle = _memoryPools.NULL_HANDLE;
      this._device = device;
      this._apertureValue = FSTOPS[this._aperture];
      this._shutterValue = SHUTTERS[this._shutter];
      this._isoValue = ISOS[this._iso];
      this._aspect = this.screenScale = 1;
    }

    _createClass(Camera, [{
      key: "initialize",
      value: function initialize(info) {
        this._name = info.name;
        this._node = info.node;
        this._proj = info.projection;
        this._priority = info.priority || 0;
        this._aspect = this.screenScale = 1;

        var handle = this._poolHandle = _memoryPools.CameraPool.alloc();

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.WIDTH, 1);

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.HEIGHT, 1);

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.CLEAR_FLAG, _define.GFXClearFlag.NONE);

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.CLEAR_DEPTH, 1.0);

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.NODE, this._node.handle);

        if (this._scene) _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.SCENE, this._scene.handle);

        if (_defaultConstants.JSB) {
          this._frustumHandle = _memoryPools.FrustumPool.alloc();

          _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.FRUSTUM, this._frustumHandle);
        }

        this.updateExposure();
        this._view = _globalExports.legacyCC.director.root.createView({
          camera: this,
          name: this._name,
          priority: this._priority,
          flows: info.flows
        });

        _globalExports.legacyCC.director.root.attachCamera(this);

        this.changeTargetWindow(info.window);
        console.log('Created Camera: ' + this._name + ' ' + _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.WIDTH) + 'x' + _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.HEIGHT));
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _globalExports.legacyCC.director.root.detachCamera(this);

        if (this._view) {
          this._view.destroy();

          this._view = null;
        }

        this._name = null;

        if (this._poolHandle) {
          _memoryPools.CameraPool.free(this._poolHandle);

          this._poolHandle = _memoryPools.NULL_HANDLE;

          if (this._frustumHandle) {
            _memoryPools.FrustumPool.free(this._frustumHandle);

            this._frustumHandle = _memoryPools.NULL_HANDLE;
          }
        }
      }
    }, {
      key: "attachToScene",
      value: function attachToScene(scene) {
        this._scene = scene;

        _memoryPools.CameraPool.set(this._poolHandle, _memoryPools.CameraView.SCENE, scene.handle);

        if (this._view) {
          this._view.enable(true);
        }
      }
    }, {
      key: "detachFromScene",
      value: function detachFromScene() {
        this._scene = null;

        _memoryPools.CameraPool.set(this._poolHandle, _memoryPools.CameraView.SCENE, 0);

        if (this._view) {
          this._view.enable(false);
        }
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        var handle = this._poolHandle;

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.WIDTH, width);

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.HEIGHT, height);

        this._aspect = width * this._viewport.width / (height * this._viewport.height);
        this._isProjDirty = true;
      }
    }, {
      key: "setFixedSize",
      value: function setFixedSize(width, height) {
        var handle = this._poolHandle;

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.WIDTH, width);

        _memoryPools.CameraPool.set(handle, _memoryPools.CameraView.HEIGHT, height);

        this._aspect = width * this._viewport.width / (height * this._viewport.height);
        this.isWindowSize = false;
      }
    }, {
      key: "update",
      value: function update() {
        var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        // for lazy eval situations like the in-editor preview
        if (!this._node) return; // view matrix

        if (this._node.hasChangedFlags || forceUpdate) {
          _index2.Mat4.invert(this._matView, this._node.worldMatrix);

          _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW, this._matView);

          this._forward.x = -this._matView.m02;
          this._forward.y = -this._matView.m06;
          this._forward.z = -this._matView.m10;

          this._node.getWorldPosition(this._position);

          _memoryPools.CameraPool.setVec3(this._poolHandle, _memoryPools.CameraView.POSITION, this._position);

          _memoryPools.CameraPool.setVec3(this._poolHandle, _memoryPools.CameraView.FORWARD, this._forward);
        } // projection matrix


        if (this._isProjDirty) {
          var projectionSignY = this._device.screenSpaceSignY;

          if (this._view && this._view.window.hasOffScreenAttachments) {
            projectionSignY *= this._device.UVSpaceSignY; // need flipping if drawing on render targets
          }

          if (this._proj === CameraProjection.PERSPECTIVE) {
            _index2.Mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip, this._fovAxis === CameraFOVAxis.VERTICAL, this._device.clipSpaceMinZ, projectionSignY);
          } else {
            var x = this._orthoHeight * this._aspect;
            var y = this._orthoHeight;

            _index2.Mat4.ortho(this._matProj, -x, x, -y, y, this._nearClip, this._farClip, this._device.clipSpaceMinZ, projectionSignY);
          }

          _index2.Mat4.invert(this._matProjInv, this._matProj);

          _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_PROJ, this._matProj);

          _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_PROJ_INV, this._matProjInv);
        } // view-projection


        if (this._node.hasChangedFlags || this._isProjDirty || forceUpdate) {
          _index2.Mat4.multiply(this._matViewProj, this._matProj, this._matView);

          _index2.Mat4.invert(this._matViewProjInv, this._matViewProj);

          this._frustum.update(this._matViewProj, this._matViewProjInv);

          _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW_PROJ, this._matViewProj);

          _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW_PROJ_INV, this._matViewProjInv);

          this.recordFrustumInSharedMemory();
        }

        this._isProjDirty = false;
      }
    }, {
      key: "getSplitFrustum",
      value: function getSplitFrustum(out, nearClip, farClip) {
        if (!this._node) return;
        nearClip = Math.max(nearClip, this._nearClip);
        farClip = Math.min(farClip, this._farClip); // view matrix

        _index2.Mat4.invert(this._matView, this._node.worldMatrix);

        _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW, this._matView); // projection matrix


        if (this._proj === CameraProjection.PERSPECTIVE) {
          _index2.Mat4.perspective(_tempMat1, this._fov, this._aspect, nearClip, farClip, this._fovAxis === CameraFOVAxis.VERTICAL, this._device.clipSpaceMinZ, this._device.screenSpaceSignY);
        } else {
          var x = this._orthoHeight * this._aspect;
          var y = this._orthoHeight;

          _index2.Mat4.ortho(_tempMat1, -x, x, -y, y, nearClip, farClip, this._device.clipSpaceMinZ, this._device.screenSpaceSignY);
        } // view-projection


        _index2.Mat4.multiply(_tempMat2, _tempMat1, this._matView);

        _index2.Mat4.invert(_tempMat1, _tempMat2);

        out.update(_tempMat2, _tempMat1);
      }
    }, {
      key: "changeTargetWindow",
      value: function changeTargetWindow() {
        var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var win = window || _globalExports.legacyCC.director.root.mainWindow;

        if (win && this._view) {
          this._view.window = win;
          this.resize(win.width, win.height);
        }
      }
      /**
       * transform a screen position to a world space ray
       */

    }, {
      key: "screenPointToRay",
      value: function screenPointToRay(out, x, y) {
        var handle = this._poolHandle;

        var width = _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.WIDTH);

        var height = _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.HEIGHT);

        var cx = this._viewport.x * width;
        var cy = this._viewport.y * height;
        var cw = this._viewport.width * width;
        var ch = this._viewport.height * height; // far plane intersection

        _index2.Vec3.set(v_a, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);

        v_a.y *= this._device.screenSpaceSignY;

        _index2.Vec3.transformMat4(v_a, v_a, this._matViewProjInv);

        if (this._proj === CameraProjection.PERSPECTIVE) {
          // camera origin
          if (this._node) {
            this._node.getWorldPosition(v_b);
          }
        } else {
          // near plane intersection
          _index2.Vec3.set(v_b, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);

          v_b.y *= this._device.screenSpaceSignY;

          _index2.Vec3.transformMat4(v_b, v_b, this._matViewProjInv);
        }

        return _index.ray.fromPoints(out, v_b, v_a);
      }
      /**
       * transform a screen position to world space
       */

    }, {
      key: "screenToWorld",
      value: function screenToWorld(out, screenPos) {
        var handle = this._poolHandle;

        var width = _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.WIDTH);

        var height = _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.HEIGHT);

        var cx = this._viewport.x * width;
        var cy = this._viewport.y * height;
        var cw = this._viewport.width * width;
        var ch = this._viewport.height * height;

        if (this._proj === CameraProjection.PERSPECTIVE) {
          // calculate screen pos in far clip plane
          _index2.Vec3.set(out, (screenPos.x - cx) / cw * 2 - 1, (screenPos.y - cy) / ch * 2 - 1, 1.0); // transform to world


          _index2.Vec3.transformMat4(out, out, this._matViewProjInv); // lerp to depth z


          if (this._node) {
            this._node.getWorldPosition(v_a);
          }

          _index2.Vec3.lerp(out, v_a, out, (0, _index2.lerp)(this._nearClip / this._farClip, 1, screenPos.z));
        } else {
          _index2.Vec3.set(out, (screenPos.x - cx) / cw * 2 - 1, (screenPos.y - cy) / ch * 2 - 1, screenPos.z * 2 - 1); // transform to world


          _index2.Vec3.transformMat4(out, out, this.matViewProjInv);
        }

        return out;
      }
      /**
       * transform a world space position to screen space
       */

    }, {
      key: "worldToScreen",
      value: function worldToScreen(out, worldPos) {
        var handle = this._poolHandle;

        var width = _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.WIDTH);

        var height = _memoryPools.CameraPool.get(handle, _memoryPools.CameraView.HEIGHT);

        var cx = this._viewport.x * width;
        var cy = this._viewport.y * height;
        var cw = this._viewport.width * width;
        var ch = this._viewport.height * height;

        _index2.Vec3.transformMat4(out, worldPos, this.matViewProj);

        out.x = cx + (out.x + 1) * 0.5 * cw;
        out.y = cy + (out.y + 1) * 0.5 * ch;
        out.z = out.z * 0.5 + 0.5;
        return out;
      }
      /**
       * transform a world space matrix to screen space
       * @param {Mat4} out the resulting vector
       * @param {Mat4} worldMatrix the world space matrix to be transformed
       * @param {number} width framebuffer width
       * @param {number} height framebuffer height
       * @returns {Mat4} the resulting vector
       */

    }, {
      key: "worldMatrixToScreen",
      value: function worldMatrixToScreen(out, worldMatrix, width, height) {
        _index2.Mat4.multiply(out, this._matViewProj, worldMatrix);

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        _index2.Mat4.identity(_tempMat1);

        _index2.Mat4.transform(_tempMat1, _tempMat1, _index2.Vec3.set(v_a, halfWidth, halfHeight, 0));

        _index2.Mat4.scale(_tempMat1, _tempMat1, _index2.Vec3.set(v_a, halfWidth, halfHeight, 1));

        _index2.Mat4.multiply(out, _tempMat1, out);

        return out;
      }
    }, {
      key: "updateExposure",
      value: function updateExposure() {
        var ev100 = Math.log2(this._apertureValue * this._apertureValue / this._shutterValue * 100.0 / this._isoValue);

        _memoryPools.CameraPool.set(this._poolHandle, _memoryPools.CameraView.EXPOSURE, 0.833333 / Math.pow(2.0, ev100));
      }
    }, {
      key: "recordFrustumInSharedMemory",
      value: function recordFrustumInSharedMemory() {
        var frustumHandle = this._frustumHandle;
        var frstm = this._frustum;

        if (!frstm || frustumHandle === _memoryPools.NULL_HANDLE) {
          return;
        }

        var vertices = frstm.vertices;
        var vertexOffset = _memoryPools.FrustumView.VERTICES;

        for (var i = 0; i < 8; ++i) {
          _memoryPools.FrustumPool.setVec3(frustumHandle, vertexOffset, vertices[i]);

          vertexOffset += 3;
        }

        var planes = frstm.planes;
        var planeOffset = _memoryPools.FrustumView.PLANES;

        for (var _i = 0; _i < 6; _i++, planeOffset += 4) {
          _memoryPools.FrustumPool.setVec4(frustumHandle, planeOffset, planes[_i]);
        }
      }
    }, {
      key: "node",
      set: function set(val) {
        this._node = val;
      },
      get: function get() {
        return this._node;
      }
    }, {
      key: "enabled",
      set: function set(val) {
        this._enabled = val;

        if (this._view) {
          this._view.enable(val);
        }
      },
      get: function get() {
        return this._enabled;
      }
    }, {
      key: "view",
      get: function get() {
        return this._view;
      }
    }, {
      key: "orthoHeight",
      set: function set(val) {
        this._orthoHeight = val;
        this._isProjDirty = true;
      },
      get: function get() {
        return this._orthoHeight;
      }
    }, {
      key: "projectionType",
      set: function set(val) {
        this._proj = val;
        this._isProjDirty = true;
      },
      get: function get() {
        return this._proj;
      }
    }, {
      key: "fovAxis",
      set: function set(axis) {
        this._fovAxis = axis;
        this._isProjDirty = true;
      },
      get: function get() {
        return this._fovAxis;
      }
    }, {
      key: "fov",
      set: function set(fov) {
        this._fov = fov;
        this._isProjDirty = true;
      },
      get: function get() {
        return this._fov;
      }
    }, {
      key: "nearClip",
      set: function set(nearClip) {
        this._nearClip = nearClip;
        this._isProjDirty = true;
      },
      get: function get() {
        return this._nearClip;
      }
    }, {
      key: "farClip",
      set: function set(farClip) {
        this._farClip = farClip;
        this._isProjDirty = true;
      },
      get: function get() {
        return this._farClip;
      }
    }, {
      key: "clearColor",
      set: function set(val) {
        this._clearColor.x = val.x;
        this._clearColor.y = val.y;
        this._clearColor.z = val.z;
        this._clearColor.w = val.w;

        _memoryPools.CameraPool.setVec4(this._poolHandle, _memoryPools.CameraView.CLEAR_COLOR, val);
      },
      get: function get() {
        return this._clearColor;
      }
    }, {
      key: "viewport",
      get: function get() {
        return this._viewport;
      },
      set: function set(val) {
        var signY = this._device.screenSpaceSignY;
        this._viewport.x = val.x;

        if (signY > 0) {
          this._viewport.y = val.y;
        } else {
          this._viewport.y = 1 - val.y - val.height;
        }

        this._viewport.width = val.width;
        this._viewport.height = val.height;

        _memoryPools.CameraPool.setVec4(this._poolHandle, _memoryPools.CameraView.VIEW_PORT, this._viewport);

        this.resize(this.width, this.height);
      }
    }, {
      key: "scene",
      get: function get() {
        return this._scene;
      }
    }, {
      key: "name",
      get: function get() {
        return this._name;
      }
    }, {
      key: "width",
      get: function get() {
        return _memoryPools.CameraPool.get(this._poolHandle, _memoryPools.CameraView.WIDTH);
      }
    }, {
      key: "height",
      get: function get() {
        return _memoryPools.CameraPool.get(this._poolHandle, _memoryPools.CameraView.HEIGHT);
      }
    }, {
      key: "aspect",
      get: function get() {
        return this._aspect;
      }
    }, {
      key: "matView",
      set: function set(val) {
        this._matView = val;

        _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW, this._matView);
      },
      get: function get() {
        return this._matView;
      }
    }, {
      key: "matViewInv",
      set: function set(val) {
        this._matViewInv = val;
      },
      get: function get() {
        return this._matViewInv || this._node.worldMatrix;
      }
    }, {
      key: "matProj",
      set: function set(val) {
        this._matProj = val;

        _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_PROJ, this._matProj);
      },
      get: function get() {
        return this._matProj;
      }
    }, {
      key: "matProjInv",
      set: function set(val) {
        this._matProjInv = val;

        _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_PROJ_INV, this._matProjInv);
      },
      get: function get() {
        return this._matProjInv;
      }
    }, {
      key: "matViewProj",
      set: function set(val) {
        this._matViewProj = val;

        _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW_PROJ, this._matViewProj);
      },
      get: function get() {
        return this._matViewProj;
      }
    }, {
      key: "matViewProjInv",
      set: function set(val) {
        this._matViewProjInv = val;

        _memoryPools.CameraPool.setMat4(this._poolHandle, _memoryPools.CameraView.MAT_VIEW_PROJ_INV, this._matViewProjInv);
      },
      get: function get() {
        return this._matViewProjInv;
      }
    }, {
      key: "frustum",
      set: function set(val) {
        this._frustum = val;
        this.recordFrustumInSharedMemory();
      },
      get: function get() {
        return this._frustum;
      }
    }, {
      key: "forward",
      set: function set(val) {
        this._forward = val;

        _memoryPools.CameraPool.setVec3(this._poolHandle, _memoryPools.CameraView.FORWARD, this._forward);
      },
      get: function get() {
        return this._forward;
      }
    }, {
      key: "position",
      set: function set(val) {
        this._position = val;

        _memoryPools.CameraPool.setVec3(this._poolHandle, _memoryPools.CameraView.POSITION, this._position);
      },
      get: function get() {
        return this._position;
      }
    }, {
      key: "visibility",
      set: function set(vis) {
        this._visibility = vis;

        if (this._view) {
          this._view.visibility = vis;
        }
      },
      get: function get() {
        return this._visibility;
      }
    }, {
      key: "priority",
      get: function get() {
        return this._view ? this._view.priority : -1;
      },
      set: function set(val) {
        this._priority = val;

        if (this._view) {
          this._view.priority = this._priority;
        }
      }
    }, {
      key: "aperture",
      set: function set(val) {
        this._aperture = val;
        this._apertureValue = FSTOPS[this._aperture];
        this.updateExposure();
      },
      get: function get() {
        return this._aperture;
      }
    }, {
      key: "apertureValue",
      get: function get() {
        return this._apertureValue;
      }
    }, {
      key: "shutter",
      set: function set(val) {
        this._shutter = val;
        this._shutterValue = SHUTTERS[this._shutter];
        this.updateExposure();
      },
      get: function get() {
        return this._shutter;
      }
    }, {
      key: "shutterValue",
      get: function get() {
        return this._shutterValue;
      }
    }, {
      key: "iso",
      set: function set(val) {
        this._iso = val;
        this._isoValue = ISOS[this._iso];
        this.updateExposure();
      },
      get: function get() {
        return this._iso;
      }
    }, {
      key: "isoValue",
      get: function get() {
        return this._isoValue;
      }
    }, {
      key: "ec",
      set: function set(val) {
        this._ec = val;
      },
      get: function get() {
        return this._ec;
      }
    }, {
      key: "exposure",
      get: function get() {
        return _memoryPools.CameraPool.get(this._poolHandle, _memoryPools.CameraView.EXPOSURE);
      }
    }, {
      key: "flows",
      set: function set(val) {
        if (this._view) {
          this._view.setExecuteFlows(val);
        }
      }
    }, {
      key: "clearFlag",
      get: function get() {
        return _memoryPools.CameraPool.get(this._poolHandle, _memoryPools.CameraView.CLEAR_FLAG);
      },
      set: function set(flag) {
        _memoryPools.CameraPool.set(this._poolHandle, _memoryPools.CameraView.CLEAR_FLAG, flag);
      }
    }, {
      key: "clearDepth",
      get: function get() {
        return _memoryPools.CameraPool.get(this._poolHandle, _memoryPools.CameraView.CLEAR_DEPTH);
      },
      set: function set(depth) {
        _memoryPools.CameraPool.set(this._poolHandle, _memoryPools.CameraView.CLEAR_DEPTH, depth);
      }
    }, {
      key: "clearStencil",
      get: function get() {
        return _memoryPools.CameraPool.get(this._poolHandle, _memoryPools.CameraView.CLEAR_STENCIL);
      },
      set: function set(stencil) {
        _memoryPools.CameraPool.set(this._poolHandle, _memoryPools.CameraView.CLEAR_STENCIL, stencil);
      }
    }, {
      key: "handle",
      get: function get() {
        return this._poolHandle;
      }
    }]);

    return Camera;
  }();

  _exports.Camera = Camera;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvY2FtZXJhLnRzIl0sIm5hbWVzIjpbIkNhbWVyYUZPVkF4aXMiLCJDYW1lcmFQcm9qZWN0aW9uIiwiQ2FtZXJhQXBlcnR1cmUiLCJDYW1lcmFJU08iLCJDYW1lcmFTaHV0dGVyIiwiRlNUT1BTIiwiU0hVVFRFUlMiLCJJU09TIiwidl9hIiwiVmVjMyIsInZfYiIsIl90ZW1wTWF0MSIsIk1hdDQiLCJfdGVtcE1hdDIiLCJTS1lCT1hfRkxBRyIsIkdGWENsZWFyRmxhZyIsIlNURU5DSUwiLCJDYW1lcmEiLCJkZXZpY2UiLCJpc1dpbmRvd1NpemUiLCJzY3JlZW5TY2FsZSIsIl9kZXZpY2UiLCJfc2NlbmUiLCJfbm9kZSIsIl9uYW1lIiwiX2VuYWJsZWQiLCJfcHJvaiIsIl9hc3BlY3QiLCJfb3J0aG9IZWlnaHQiLCJfZm92QXhpcyIsIlZFUlRJQ0FMIiwiX2ZvdiIsIl9uZWFyQ2xpcCIsIl9mYXJDbGlwIiwiX2NsZWFyQ29sb3IiLCJHRlhDb2xvciIsIl92aWV3cG9ydCIsIlJlY3QiLCJfaXNQcm9qRGlydHkiLCJfbWF0VmlldyIsIl9tYXRWaWV3SW52IiwiX21hdFByb2oiLCJfbWF0UHJvakludiIsIl9tYXRWaWV3UHJvaiIsIl9tYXRWaWV3UHJvakludiIsIl9mcnVzdHVtIiwiZnJ1c3R1bSIsIl9mb3J3YXJkIiwiX3Bvc2l0aW9uIiwiX3ZpZXciLCJfdmlzaWJpbGl0eSIsIkNBTUVSQV9ERUZBVUxUX01BU0siLCJfcHJpb3JpdHkiLCJfYXBlcnR1cmUiLCJGMTZfMCIsIl9hcGVydHVyZVZhbHVlIiwiX3NodXR0ZXIiLCJEMTI1IiwiX3NodXR0ZXJWYWx1ZSIsIl9pc28iLCJJU08xMDAiLCJfaXNvVmFsdWUiLCJfZWMiLCJfcG9vbEhhbmRsZSIsIk5VTExfSEFORExFIiwiX2ZydXN0dW1IYW5kbGUiLCJpbmZvIiwibmFtZSIsIm5vZGUiLCJwcm9qZWN0aW9uIiwicHJpb3JpdHkiLCJoYW5kbGUiLCJDYW1lcmFQb29sIiwiYWxsb2MiLCJzZXQiLCJDYW1lcmFWaWV3IiwiV0lEVEgiLCJIRUlHSFQiLCJDTEVBUl9GTEFHIiwiTk9ORSIsIkNMRUFSX0RFUFRIIiwiTk9ERSIsIlNDRU5FIiwiSlNCIiwiRnJ1c3R1bVBvb2wiLCJGUlVTVFVNIiwidXBkYXRlRXhwb3N1cmUiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsImNyZWF0ZVZpZXciLCJjYW1lcmEiLCJmbG93cyIsImF0dGFjaENhbWVyYSIsImNoYW5nZVRhcmdldFdpbmRvdyIsIndpbmRvdyIsImNvbnNvbGUiLCJsb2ciLCJnZXQiLCJkZXRhY2hDYW1lcmEiLCJkZXN0cm95IiwiZnJlZSIsInNjZW5lIiwiZW5hYmxlIiwid2lkdGgiLCJoZWlnaHQiLCJmb3JjZVVwZGF0ZSIsImhhc0NoYW5nZWRGbGFncyIsImludmVydCIsIndvcmxkTWF0cml4Iiwic2V0TWF0NCIsIk1BVF9WSUVXIiwieCIsIm0wMiIsInkiLCJtMDYiLCJ6IiwibTEwIiwiZ2V0V29ybGRQb3NpdGlvbiIsInNldFZlYzMiLCJQT1NJVElPTiIsIkZPUldBUkQiLCJwcm9qZWN0aW9uU2lnblkiLCJzY3JlZW5TcGFjZVNpZ25ZIiwiaGFzT2ZmU2NyZWVuQXR0YWNobWVudHMiLCJVVlNwYWNlU2lnblkiLCJQRVJTUEVDVElWRSIsInBlcnNwZWN0aXZlIiwiY2xpcFNwYWNlTWluWiIsIm9ydGhvIiwiTUFUX1BST0oiLCJNQVRfUFJPSl9JTlYiLCJtdWx0aXBseSIsInVwZGF0ZSIsIk1BVF9WSUVXX1BST0oiLCJNQVRfVklFV19QUk9KX0lOViIsInJlY29yZEZydXN0dW1JblNoYXJlZE1lbW9yeSIsIm91dCIsIm5lYXJDbGlwIiwiZmFyQ2xpcCIsIk1hdGgiLCJtYXgiLCJtaW4iLCJ3aW4iLCJtYWluV2luZG93IiwicmVzaXplIiwiY3giLCJjeSIsImN3IiwiY2giLCJ0cmFuc2Zvcm1NYXQ0IiwicmF5IiwiZnJvbVBvaW50cyIsInNjcmVlblBvcyIsImxlcnAiLCJtYXRWaWV3UHJvakludiIsIndvcmxkUG9zIiwibWF0Vmlld1Byb2oiLCJoYWxmV2lkdGgiLCJoYWxmSGVpZ2h0IiwiaWRlbnRpdHkiLCJ0cmFuc2Zvcm0iLCJzY2FsZSIsImV2MTAwIiwibG9nMiIsIkVYUE9TVVJFIiwicG93IiwiZnJ1c3R1bUhhbmRsZSIsImZyc3RtIiwidmVydGljZXMiLCJ2ZXJ0ZXhPZmZzZXQiLCJGcnVzdHVtVmlldyIsIlZFUlRJQ0VTIiwiaSIsInBsYW5lcyIsInBsYW5lT2Zmc2V0IiwiUExBTkVTIiwic2V0VmVjNCIsInZhbCIsImF4aXMiLCJmb3YiLCJ3IiwiQ0xFQVJfQ09MT1IiLCJzaWduWSIsIlZJRVdfUE9SVCIsInZpcyIsInZpc2liaWxpdHkiLCJzZXRFeGVjdXRlRmxvd3MiLCJmbGFnIiwiZGVwdGgiLCJDTEVBUl9TVEVOQ0lMIiwic3RlbmNpbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFhWUEsYTs7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtLQUFBQSxhLDhCQUFBQSxhOztNQUtBQyxnQjs7O2FBQUFBLGdCO0FBQUFBLElBQUFBLGdCLENBQUFBLGdCO0FBQUFBLElBQUFBLGdCLENBQUFBLGdCO0tBQUFBLGdCLGlDQUFBQSxnQjs7TUFLQUMsYzs7O2FBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxD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QUFDSCxPO3dCQUVlNkcsSyxFQUFlO0FBQzNCckgsZ0NBQVdFLEdBQVgsQ0FBZSxLQUFLWCxXQUFwQixFQUFpQ1ksd0JBQVdLLFdBQTVDLEVBQXlENkcsS0FBekQ7QUFDSDs7OzBCQUU0QjtBQUN6QixlQUFPckgsd0JBQVcwQixHQUFYLENBQWUsS0FBS25DLFdBQXBCLEVBQWlDWSx3QkFBV21ILGFBQTVDLENBQVA7QUFDSCxPO3dCQUVpQkMsTyxFQUFpQjtBQUMvQnZILGdDQUFXRSxHQUFYLENBQWUsS0FBS1gsV0FBcEIsRUFBaUNZLHdCQUFXbUgsYUFBNUMsRUFBMkRDLE9BQTNEO0FBQ0g7OzswQkFFNEI7QUFDekIsZUFBTyxLQUFLaEksV0FBWjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJ1c3R1bSwgcmF5IH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBHRlhDbGVhckZsYWcsIEdGWENvbG9yIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IGxlcnAsIE1hdDQsIFJlY3QsIHRvUmFkaWFuLCBWZWMzLCBDb2xvciwgSVZlYzRMaWtlIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IENBTUVSQV9ERUZBVUxUX01BU0sgfSBmcm9tICcuLi8uLi9waXBlbGluZS9kZWZpbmUnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBSZW5kZXJTY2VuZSB9IGZyb20gJy4vcmVuZGVyLXNjZW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFJlbmRlcldpbmRvdyB9IGZyb20gJy4uL2NvcmUvcmVuZGVyLXdpbmRvdyc7XHJcbmltcG9ydCB7IENhbWVyYUhhbmRsZSwgQ2FtZXJhUG9vbCwgQ2FtZXJhVmlldywgRnJ1c3R1bUhhbmRsZSwgRnJ1c3R1bVBvb2wsIEZydXN0dW1WaWV3LCBOVUxMX0hBTkRMRSwgU2NlbmVIYW5kbGUgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IEpTQiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFGT1ZBeGlzIHtcclxuICAgIFZFUlRJQ0FMLFxyXG4gICAgSE9SSVpPTlRBTCxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gQ2FtZXJhUHJvamVjdGlvbiB7XHJcbiAgICBPUlRITyxcclxuICAgIFBFUlNQRUNUSVZFLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFBcGVydHVyZSB7XHJcbiAgICBGMV84LFxyXG4gICAgRjJfMCxcclxuICAgIEYyXzIsXHJcbiAgICBGMl81LFxyXG4gICAgRjJfOCxcclxuICAgIEYzXzIsXHJcbiAgICBGM181LFxyXG4gICAgRjRfMCxcclxuICAgIEY0XzUsXHJcbiAgICBGNV8wLFxyXG4gICAgRjVfNixcclxuICAgIEY2XzMsXHJcbiAgICBGN18xLFxyXG4gICAgRjhfMCxcclxuICAgIEY5XzAsXHJcbiAgICBGMTBfMCxcclxuICAgIEYxMV8wLFxyXG4gICAgRjEzXzAsXHJcbiAgICBGMTRfMCxcclxuICAgIEYxNl8wLFxyXG4gICAgRjE4XzAsXHJcbiAgICBGMjBfMCxcclxuICAgIEYyMl8wLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFJU08ge1xyXG4gICAgSVNPMTAwLFxyXG4gICAgSVNPMjAwLFxyXG4gICAgSVNPNDAwLFxyXG4gICAgSVNPODAwLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBDYW1lcmFTaHV0dGVyIHtcclxuICAgIEQxLFxyXG4gICAgRDIsXHJcbiAgICBENCxcclxuICAgIEQ4LFxyXG4gICAgRDE1LFxyXG4gICAgRDMwLFxyXG4gICAgRDYwLFxyXG4gICAgRDEyNSxcclxuICAgIEQyNTAsXHJcbiAgICBENTAwLFxyXG4gICAgRDEwMDAsXHJcbiAgICBEMjAwMCxcclxuICAgIEQ0MDAwLFxyXG59XHJcblxyXG5jb25zdCBGU1RPUFM6IG51bWJlcltdID0gWzEuOCwgMi4wLCAyLjIsIDIuNSwgMi44LCAzLjIsIDMuNSwgNC4wLCA0LjUsIDUuMCwgNS42LCA2LjMsIDcuMSwgOC4wLCA5LjAsIDEwLjAsIDExLjAsIDEzLjAsIDE0LjAsIDE2LjAsIDE4LjAsIDIwLjAsIDIyLjBdO1xyXG5jb25zdCBTSFVUVEVSUzogbnVtYmVyW10gPSBbMS4wLCAxLjAgLyAyLjAsIDEuMCAvIDQuMCwgMS4wIC8gOC4wLCAxLjAgLyAxNS4wLCAxLjAgLyAzMC4wLCAxLjAgLyA2MC4wLCAxLjAgLyAxMjUuMCxcclxuICAgIDEuMCAvIDI1MC4wLCAxLjAgLyA1MDAuMCwgMS4wIC8gMTAwMC4wLCAxLjAgLyAyMDAwLjAsIDEuMCAvIDQwMDAuMF07XHJcbmNvbnN0IElTT1M6IG51bWJlcltdID0gWzEwMC4wLCAyMDAuMCwgNDAwLjAsIDgwMC4wXTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNhbWVyYUluZm8ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgbm9kZTogTm9kZTtcclxuICAgIHByb2plY3Rpb246IG51bWJlcjtcclxuICAgIHRhcmdldERpc3BsYXk/OiBudW1iZXI7XHJcbiAgICB3aW5kb3c/OiBSZW5kZXJXaW5kb3cgfCBudWxsO1xyXG4gICAgcHJpb3JpdHk6IG51bWJlcjtcclxuICAgIHBpcGVsaW5lPzogc3RyaW5nO1xyXG4gICAgZmxvd3M/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuY29uc3Qgdl9hID0gbmV3IFZlYzMoKTtcclxuY29uc3Qgdl9iID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX3RlbXBNYXQxID0gbmV3IE1hdDQoKTtcclxuY29uc3QgX3RlbXBNYXQyID0gbmV3IE1hdDQoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBTS1lCT1hfRkxBRyA9IEdGWENsZWFyRmxhZy5TVEVOQ0lMIDw8IDE7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhIHtcclxuXHJcbiAgICBwdWJsaWMgaXNXaW5kb3dTaXplOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBzY3JlZW5TY2FsZTogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX2RldmljZTogR0ZYRGV2aWNlO1xyXG4gICAgcHJpdmF0ZSBfc2NlbmU6IFJlbmRlclNjZW5lIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9ub2RlOiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2VuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3Byb2o6IENhbWVyYVByb2plY3Rpb24gPSAtMTtcclxuICAgIHByaXZhdGUgX2FzcGVjdDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfb3J0aG9IZWlnaHQ6IG51bWJlciA9IDEwLjA7XHJcbiAgICBwcml2YXRlIF9mb3ZBeGlzID0gQ2FtZXJhRk9WQXhpcy5WRVJUSUNBTDtcclxuICAgIHByaXZhdGUgX2ZvdjogbnVtYmVyID0gdG9SYWRpYW4oNDUpO1xyXG4gICAgcHJpdmF0ZSBfbmVhckNsaXA6IG51bWJlciA9IDEuMDtcclxuICAgIHByaXZhdGUgX2ZhckNsaXA6IG51bWJlciA9IDEwMDAuMDtcclxuICAgIHByaXZhdGUgX2NsZWFyQ29sb3IgPSBuZXcgR0ZYQ29sb3IoMC4yLCAwLjIsIDAuMiwgMSk7XHJcbiAgICBwcml2YXRlIF92aWV3cG9ydDogUmVjdCA9IG5ldyBSZWN0KDAsIDAsIDEsIDEpO1xyXG4gICAgcHJpdmF0ZSBfaXNQcm9qRGlydHkgPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSBfbWF0VmlldzogTWF0NCA9IG5ldyBNYXQ0KCk7XHJcbiAgICBwcml2YXRlIF9tYXRWaWV3SW52OiBNYXQ0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9tYXRQcm9qOiBNYXQ0ID0gbmV3IE1hdDQoKTtcclxuICAgIHByaXZhdGUgX21hdFByb2pJbnY6IE1hdDQgPSBuZXcgTWF0NCgpO1xyXG4gICAgcHJpdmF0ZSBfbWF0Vmlld1Byb2o6IE1hdDQgPSBuZXcgTWF0NCgpO1xyXG4gICAgcHJpdmF0ZSBfbWF0Vmlld1Byb2pJbnY6IE1hdDQgPSBuZXcgTWF0NCgpO1xyXG4gICAgcHJpdmF0ZSBfZnJ1c3R1bTogZnJ1c3R1bSA9IG5ldyBmcnVzdHVtKCk7XHJcbiAgICBwcml2YXRlIF9mb3J3YXJkOiBWZWMzID0gbmV3IFZlYzMoKTtcclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uOiBWZWMzID0gbmV3IFZlYzMoKTtcclxuICAgIHByaXZhdGUgX3ZpZXc6IFJlbmRlclZpZXcgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3Zpc2liaWxpdHkgPSBDQU1FUkFfREVGQVVMVF9NQVNLO1xyXG4gICAgcHJpdmF0ZSBfcHJpb3JpdHk6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9hcGVydHVyZTogQ2FtZXJhQXBlcnR1cmUgPSBDYW1lcmFBcGVydHVyZS5GMTZfMDtcclxuICAgIHByaXZhdGUgX2FwZXJ0dXJlVmFsdWU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NodXR0ZXI6IENhbWVyYVNodXR0ZXIgPSBDYW1lcmFTaHV0dGVyLkQxMjU7XHJcbiAgICBwcml2YXRlIF9zaHV0dGVyVmFsdWU6IG51bWJlciA9IDAuMDtcclxuICAgIHByaXZhdGUgX2lzbzogQ2FtZXJhSVNPID0gQ2FtZXJhSVNPLklTTzEwMDtcclxuICAgIHByaXZhdGUgX2lzb1ZhbHVlOiBudW1iZXIgPSAwLjA7XHJcbiAgICBwcml2YXRlIF9lYzogbnVtYmVyID0gMC4wO1xyXG4gICAgcHJpdmF0ZSBfcG9vbEhhbmRsZTogQ2FtZXJhSGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICBwcml2YXRlIF9mcnVzdHVtSGFuZGxlOiBGcnVzdHVtSGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgICAgIHRoaXMuX2FwZXJ0dXJlVmFsdWUgPSBGU1RPUFNbdGhpcy5fYXBlcnR1cmVdO1xyXG4gICAgICAgIHRoaXMuX3NodXR0ZXJWYWx1ZSA9IFNIVVRURVJTW3RoaXMuX3NodXR0ZXJdO1xyXG4gICAgICAgIHRoaXMuX2lzb1ZhbHVlID0gSVNPU1t0aGlzLl9pc29dO1xyXG5cclxuICAgICAgICB0aGlzLl9hc3BlY3QgPSB0aGlzLnNjcmVlblNjYWxlID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSUNhbWVyYUluZm8pIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gaW5mby5uYW1lO1xyXG4gICAgICAgIHRoaXMuX25vZGUgPSBpbmZvLm5vZGU7XHJcbiAgICAgICAgdGhpcy5fcHJvaiA9IGluZm8ucHJvamVjdGlvbjtcclxuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IGluZm8ucHJpb3JpdHkgfHwgMDtcclxuXHJcbiAgICAgICAgdGhpcy5fYXNwZWN0ID0gdGhpcy5zY3JlZW5TY2FsZSA9IDE7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5fcG9vbEhhbmRsZSA9IENhbWVyYVBvb2wuYWxsb2MoKTtcclxuICAgICAgICBDYW1lcmFQb29sLnNldChoYW5kbGUsIENhbWVyYVZpZXcuV0lEVEgsIDEpO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5IRUlHSFQsIDEpO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5DTEVBUl9GTEFHLCBHRlhDbGVhckZsYWcuTk9ORSk7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXQoaGFuZGxlLCBDYW1lcmFWaWV3LkNMRUFSX0RFUFRILCAxLjApO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5OT0RFLCB0aGlzLl9ub2RlLmhhbmRsZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NjZW5lKSBDYW1lcmFQb29sLnNldChoYW5kbGUsIENhbWVyYVZpZXcuU0NFTkUsIHRoaXMuX3NjZW5lLmhhbmRsZSk7XHJcbiAgICAgICAgaWYgKEpTQikge1xyXG4gICAgICAgICAgICB0aGlzLl9mcnVzdHVtSGFuZGxlID0gRnJ1c3R1bVBvb2wuYWxsb2MoKTtcclxuICAgICAgICAgICAgQ2FtZXJhUG9vbC5zZXQoaGFuZGxlLCBDYW1lcmFWaWV3LkZSVVNUVU0sIHRoaXMuX2ZydXN0dW1IYW5kbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVFeHBvc3VyZSgpO1xyXG4gICAgICAgIHRoaXMuX3ZpZXcgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmNyZWF0ZVZpZXcoe1xyXG4gICAgICAgICAgICBjYW1lcmE6IHRoaXMsXHJcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWUsXHJcbiAgICAgICAgICAgIHByaW9yaXR5OiB0aGlzLl9wcmlvcml0eSxcclxuICAgICAgICAgICAgZmxvd3M6IGluZm8uZmxvd3MsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5hdHRhY2hDYW1lcmEodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VUYXJnZXRXaW5kb3coaW5mby53aW5kb3cpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnQ3JlYXRlZCBDYW1lcmE6ICcgKyB0aGlzLl9uYW1lICsgJyAnICsgQ2FtZXJhUG9vbC5nZXQoaGFuZGxlXHJcbiAgICAgICAgICAgICwgQ2FtZXJhVmlldy5XSURUSCkgKyAneCcgKyBDYW1lcmFQb29sLmdldChoYW5kbGUsIENhbWVyYVZpZXcuSEVJR0hUKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuZGV0YWNoQ2FtZXJhKHRoaXMpO1xyXG4gICAgICAgIGlmICh0aGlzLl92aWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvb2xIYW5kbGUpIHtcclxuICAgICAgICAgICAgQ2FtZXJhUG9vbC5mcmVlKHRoaXMuX3Bvb2xIYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sSGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9mcnVzdHVtSGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBGcnVzdHVtUG9vbC5mcmVlKHRoaXMuX2ZydXN0dW1IYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJ1c3R1bUhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhdHRhY2hUb1NjZW5lIChzY2VuZTogUmVuZGVyU2NlbmUpIHtcclxuICAgICAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuU0NFTkUsIHNjZW5lLmhhbmRsZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmlldy5lbmFibGUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXRhY2hGcm9tU2NlbmUgKCkge1xyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbnVsbDtcclxuICAgICAgICBDYW1lcmFQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3LlNDRU5FLCAwIGFzIHVua25vd24gYXMgU2NlbmVIYW5kbGUpO1xyXG4gICAgICAgIGlmICh0aGlzLl92aWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuZW5hYmxlKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2l6ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGUgPSB0aGlzLl9wb29sSGFuZGxlO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5XSURUSCwgd2lkdGgpO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5IRUlHSFQsIGhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fYXNwZWN0ID0gKHdpZHRoICogdGhpcy5fdmlld3BvcnQud2lkdGgpIC8gKGhlaWdodCAqIHRoaXMuX3ZpZXdwb3J0LmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5faXNQcm9qRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRGaXhlZFNpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IHRoaXMuX3Bvb2xIYW5kbGU7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXQoaGFuZGxlLCBDYW1lcmFWaWV3LldJRFRILCB3aWR0aCk7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXQoaGFuZGxlLCBDYW1lcmFWaWV3LkhFSUdIVCwgaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLl9hc3BlY3QgPSAod2lkdGggKiB0aGlzLl92aWV3cG9ydC53aWR0aCkgLyAoaGVpZ2h0ICogdGhpcy5fdmlld3BvcnQuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmlzV2luZG93U2l6ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKGZvcmNlVXBkYXRlID0gZmFsc2UpIHsgLy8gZm9yIGxhenkgZXZhbCBzaXR1YXRpb25zIGxpa2UgdGhlIGluLWVkaXRvciBwcmV2aWV3XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ub2RlKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIHZpZXcgbWF0cml4XHJcbiAgICAgICAgaWYgKHRoaXMuX25vZGUuaGFzQ2hhbmdlZEZsYWdzIHx8IGZvcmNlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIE1hdDQuaW52ZXJ0KHRoaXMuX21hdFZpZXcsIHRoaXMuX25vZGUud29ybGRNYXRyaXgpO1xyXG4gICAgICAgICAgICBDYW1lcmFQb29sLnNldE1hdDQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5NQVRfVklFVywgdGhpcy5fbWF0Vmlldyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkLnggPSAtdGhpcy5fbWF0Vmlldy5tMDI7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQueSA9IC10aGlzLl9tYXRWaWV3Lm0wNjtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZC56ID0gLXRoaXMuX21hdFZpZXcubTEwO1xyXG4gICAgICAgICAgICB0aGlzLl9ub2RlLmdldFdvcmxkUG9zaXRpb24odGhpcy5fcG9zaXRpb24pO1xyXG4gICAgICAgICAgICBDYW1lcmFQb29sLnNldFZlYzModGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5QT1NJVElPTiwgdGhpcy5fcG9zaXRpb24pO1xyXG4gICAgICAgICAgICBDYW1lcmFQb29sLnNldFZlYzModGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5GT1JXQVJELCB0aGlzLl9mb3J3YXJkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHByb2plY3Rpb24gbWF0cml4XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzUHJvakRpcnR5KSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uU2lnblkgPSB0aGlzLl9kZXZpY2Uuc2NyZWVuU3BhY2VTaWduWTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZpZXcgJiYgKHRoaXMuX3ZpZXcud2luZG93Lmhhc09mZlNjcmVlbkF0dGFjaG1lbnRzKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvblNpZ25ZICo9IHRoaXMuX2RldmljZS5VVlNwYWNlU2lnblk7IC8vIG5lZWQgZmxpcHBpbmcgaWYgZHJhd2luZyBvbiByZW5kZXIgdGFyZ2V0c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9qID09PSBDYW1lcmFQcm9qZWN0aW9uLlBFUlNQRUNUSVZFKSB7XHJcbiAgICAgICAgICAgICAgICBNYXQ0LnBlcnNwZWN0aXZlKHRoaXMuX21hdFByb2osIHRoaXMuX2ZvdiwgdGhpcy5fYXNwZWN0LCB0aGlzLl9uZWFyQ2xpcCwgdGhpcy5fZmFyQ2xpcCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mb3ZBeGlzID09PSBDYW1lcmFGT1ZBeGlzLlZFUlRJQ0FMLCB0aGlzLl9kZXZpY2UuY2xpcFNwYWNlTWluWiwgcHJvamVjdGlvblNpZ25ZKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9vcnRob0hlaWdodCAqIHRoaXMuX2FzcGVjdDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLl9vcnRob0hlaWdodDtcclxuICAgICAgICAgICAgICAgIE1hdDQub3J0aG8odGhpcy5fbWF0UHJvaiwgLXgsIHgsIC15LCB5LCB0aGlzLl9uZWFyQ2xpcCwgdGhpcy5fZmFyQ2xpcCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZXZpY2UuY2xpcFNwYWNlTWluWiwgcHJvamVjdGlvblNpZ25ZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBNYXQ0LmludmVydCh0aGlzLl9tYXRQcm9qSW52LCB0aGlzLl9tYXRQcm9qKTtcclxuICAgICAgICAgICAgQ2FtZXJhUG9vbC5zZXRNYXQ0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuTUFUX1BST0osIHRoaXMuX21hdFByb2opO1xyXG4gICAgICAgICAgICBDYW1lcmFQb29sLnNldE1hdDQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5NQVRfUFJPSl9JTlYsIHRoaXMuX21hdFByb2pJbnYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdmlldy1wcm9qZWN0aW9uXHJcbiAgICAgICAgaWYgKHRoaXMuX25vZGUuaGFzQ2hhbmdlZEZsYWdzIHx8IHRoaXMuX2lzUHJvakRpcnR5IHx8IGZvcmNlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgIE1hdDQubXVsdGlwbHkodGhpcy5fbWF0Vmlld1Byb2osIHRoaXMuX21hdFByb2osIHRoaXMuX21hdFZpZXcpO1xyXG4gICAgICAgICAgICBNYXQ0LmludmVydCh0aGlzLl9tYXRWaWV3UHJvakludiwgdGhpcy5fbWF0Vmlld1Byb2opO1xyXG4gICAgICAgICAgICB0aGlzLl9mcnVzdHVtLnVwZGF0ZSh0aGlzLl9tYXRWaWV3UHJvaiwgdGhpcy5fbWF0Vmlld1Byb2pJbnYpO1xyXG4gICAgICAgICAgICBDYW1lcmFQb29sLnNldE1hdDQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5NQVRfVklFV19QUk9KLCB0aGlzLl9tYXRWaWV3UHJvaik7XHJcbiAgICAgICAgICAgIENhbWVyYVBvb2wuc2V0TWF0NCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3Lk1BVF9WSUVXX1BST0pfSU5WLCB0aGlzLl9tYXRWaWV3UHJvakludik7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkRnJ1c3R1bUluU2hhcmVkTWVtb3J5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc1Byb2pEaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTcGxpdEZydXN0dW0gKG91dDogZnJ1c3R1bSwgbmVhckNsaXA6IG51bWJlciwgZmFyQ2xpcDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ub2RlKSByZXR1cm47XHJcblxyXG4gICAgICAgIG5lYXJDbGlwID0gTWF0aC5tYXgobmVhckNsaXAsIHRoaXMuX25lYXJDbGlwKTtcclxuICAgICAgICBmYXJDbGlwID0gTWF0aC5taW4oZmFyQ2xpcCwgdGhpcy5fZmFyQ2xpcCk7XHJcblxyXG4gICAgICAgIC8vIHZpZXcgbWF0cml4XHJcbiAgICAgICAgTWF0NC5pbnZlcnQodGhpcy5fbWF0VmlldywgIHRoaXMuX25vZGUud29ybGRNYXRyaXgpO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0TWF0NCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3Lk1BVF9WSUVXLCB0aGlzLl9tYXRWaWV3KTtcclxuXHJcbiAgICAgICAgLy8gcHJvamVjdGlvbiBtYXRyaXhcclxuICAgICAgICBpZiAodGhpcy5fcHJvaiA9PT0gQ2FtZXJhUHJvamVjdGlvbi5QRVJTUEVDVElWRSkge1xyXG4gICAgICAgICAgICBNYXQ0LnBlcnNwZWN0aXZlKF90ZW1wTWF0MSwgdGhpcy5fZm92LCB0aGlzLl9hc3BlY3QsIG5lYXJDbGlwLCBmYXJDbGlwLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm92QXhpcyA9PT0gQ2FtZXJhRk9WQXhpcy5WRVJUSUNBTCwgdGhpcy5fZGV2aWNlLmNsaXBTcGFjZU1pblosIHRoaXMuX2RldmljZS5zY3JlZW5TcGFjZVNpZ25ZKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5fb3J0aG9IZWlnaHQgKiB0aGlzLl9hc3BlY3Q7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLl9vcnRob0hlaWdodDtcclxuICAgICAgICAgICAgTWF0NC5vcnRobyhfdGVtcE1hdDEsIC14LCB4LCAteSwgeSwgbmVhckNsaXAsIGZhckNsaXAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXZpY2UuY2xpcFNwYWNlTWluWiwgdGhpcy5fZGV2aWNlLnNjcmVlblNwYWNlU2lnblkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdmlldy1wcm9qZWN0aW9uXHJcbiAgICAgICAgTWF0NC5tdWx0aXBseShfdGVtcE1hdDIsIF90ZW1wTWF0MSwgdGhpcy5fbWF0Vmlldyk7XHJcbiAgICAgICAgTWF0NC5pbnZlcnQoX3RlbXBNYXQxLCBfdGVtcE1hdDIpO1xyXG4gICAgICAgIG91dC51cGRhdGUoX3RlbXBNYXQyLCBfdGVtcE1hdDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBub2RlICh2YWw6IE5vZGUpIHtcclxuICAgICAgICB0aGlzLl9ub2RlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBub2RlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZSE7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGVuYWJsZWQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmlldy5lbmFibGUodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVuYWJsZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2aWV3ICgpOiBSZW5kZXJWaWV3IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlldyE7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG9ydGhvSGVpZ2h0ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9vcnRob0hlaWdodCA9IHZhbDtcclxuICAgICAgICB0aGlzLl9pc1Byb2pEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9ydGhvSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3J0aG9IZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHByb2plY3Rpb25UeXBlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9wcm9qID0gdmFsO1xyXG4gICAgICAgIHRoaXMuX2lzUHJvakRpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcHJvamVjdGlvblR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9qO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb3ZBeGlzIChheGlzKSB7XHJcbiAgICAgICAgdGhpcy5fZm92QXhpcyA9IGF4aXM7XHJcbiAgICAgICAgdGhpcy5faXNQcm9qRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb3ZBeGlzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm92QXhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm92IChmb3YpIHtcclxuICAgICAgICB0aGlzLl9mb3YgPSBmb3Y7XHJcbiAgICAgICAgdGhpcy5faXNQcm9qRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmb3YgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3Y7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG5lYXJDbGlwIChuZWFyQ2xpcCkge1xyXG4gICAgICAgIHRoaXMuX25lYXJDbGlwID0gbmVhckNsaXA7XHJcbiAgICAgICAgdGhpcy5faXNQcm9qRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBuZWFyQ2xpcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25lYXJDbGlwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmYXJDbGlwIChmYXJDbGlwKSB7XHJcbiAgICAgICAgdGhpcy5fZmFyQ2xpcCA9IGZhckNsaXA7XHJcbiAgICAgICAgdGhpcy5faXNQcm9qRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmYXJDbGlwICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmFyQ2xpcDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xlYXJDb2xvciAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJDb2xvci54ID0gdmFsLng7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJDb2xvci55ID0gdmFsLnk7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJDb2xvci56ID0gdmFsLno7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJDb2xvci53ID0gdmFsLnc7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXRWZWM0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuQ0xFQVJfQ09MT1IsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNsZWFyQ29sb3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGVhckNvbG9yIGFzIElWZWM0TGlrZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlld3BvcnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3cG9ydDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmlld3BvcnQgKHZhbCkge1xyXG4gICAgICAgIGNvbnN0IHNpZ25ZID0gdGhpcy5fZGV2aWNlLnNjcmVlblNwYWNlU2lnblk7XHJcbiAgICAgICAgdGhpcy5fdmlld3BvcnQueCA9IHZhbC54O1xyXG4gICAgICAgIGlmIChzaWduWSA+IDApIHsgdGhpcy5fdmlld3BvcnQueSA9IHZhbC55OyB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMuX3ZpZXdwb3J0LnkgPSAxIC0gdmFsLnkgLSB2YWwuaGVpZ2h0OyB9XHJcbiAgICAgICAgdGhpcy5fdmlld3BvcnQud2lkdGggPSB2YWwud2lkdGg7XHJcbiAgICAgICAgdGhpcy5fdmlld3BvcnQuaGVpZ2h0ID0gdmFsLmhlaWdodDtcclxuICAgICAgICBDYW1lcmFQb29sLnNldFZlYzQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5WSUVXX1BPUlQsIHRoaXMuX3ZpZXdwb3J0KTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNjZW5lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5hbWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIENhbWVyYVBvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuV0lEVEgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiBDYW1lcmFQb29sLmdldCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3LkhFSUdIVCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGFzcGVjdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FzcGVjdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWF0VmlldyAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0VmlldyA9IHZhbDtcclxuICAgICAgICBDYW1lcmFQb29sLnNldE1hdDQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5NQVRfVklFVywgdGhpcy5fbWF0Vmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1hdFZpZXcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRWaWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBtYXRWaWV3SW52ICh2YWw6IE1hdDQgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0Vmlld0ludiA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbWF0Vmlld0ludiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdFZpZXdJbnYgfHwgdGhpcy5fbm9kZSEud29ybGRNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG1hdFByb2ogKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX21hdFByb2ogPSB2YWw7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXRNYXQ0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuTUFUX1BST0osIHRoaXMuX21hdFByb2opO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtYXRQcm9qICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0UHJvajtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWF0UHJvakludiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0UHJvakludiA9IHZhbDtcclxuICAgICAgICBDYW1lcmFQb29sLnNldE1hdDQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5NQVRfUFJPSl9JTlYsIHRoaXMuX21hdFByb2pJbnYpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtYXRQcm9qSW52ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0UHJvakludjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWF0Vmlld1Byb2ogKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX21hdFZpZXdQcm9qID0gdmFsO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0TWF0NCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3Lk1BVF9WSUVXX1BST0osIHRoaXMuX21hdFZpZXdQcm9qKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbWF0Vmlld1Byb2ogKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRWaWV3UHJvajtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWF0Vmlld1Byb2pJbnYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX21hdFZpZXdQcm9qSW52ID0gdmFsO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0TWF0NCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3Lk1BVF9WSUVXX1BST0pfSU5WLCB0aGlzLl9tYXRWaWV3UHJvakludik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1hdFZpZXdQcm9qSW52ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0Vmlld1Byb2pJbnY7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZydXN0dW0gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2ZydXN0dW0gPSB2YWw7XHJcbiAgICAgICAgdGhpcy5yZWNvcmRGcnVzdHVtSW5TaGFyZWRNZW1vcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZnJ1c3R1bSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZydXN0dW07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvcndhcmQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2ZvcndhcmQgPSB2YWw7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXRWZWMzKHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuRk9SV0FSRCwgdGhpcy5fZm9yd2FyZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZvcndhcmQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwb3NpdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWw7XHJcbiAgICAgICAgQ2FtZXJhUG9vbC5zZXRWZWMzKHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuUE9TSVRJT04sIHRoaXMuX3Bvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcG9zaXRpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmlzaWJpbGl0eSAodmlzKSB7XHJcbiAgICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9IHZpcztcclxuICAgICAgICBpZiAodGhpcy5fdmlldykge1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3LnZpc2liaWxpdHkgPSB2aXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0IHZpc2liaWxpdHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aXNpYmlsaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwcmlvcml0eSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlldyA/IHRoaXMuX3ZpZXcucHJpb3JpdHkgOiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcHJpb3JpdHkgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmlldy5wcmlvcml0eSA9IHRoaXMuX3ByaW9yaXR5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgYXBlcnR1cmUgKHZhbDogQ2FtZXJhQXBlcnR1cmUpIHtcclxuICAgICAgICB0aGlzLl9hcGVydHVyZSA9IHZhbDtcclxuICAgICAgICB0aGlzLl9hcGVydHVyZVZhbHVlID0gRlNUT1BTW3RoaXMuX2FwZXJ0dXJlXTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUV4cG9zdXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGFwZXJ0dXJlICgpOiBDYW1lcmFBcGVydHVyZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwZXJ0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhcGVydHVyZVZhbHVlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcGVydHVyZVZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzaHV0dGVyICh2YWw6IENhbWVyYVNodXR0ZXIpIHtcclxuICAgICAgICB0aGlzLl9zaHV0dGVyID0gdmFsO1xyXG4gICAgICAgIHRoaXMuX3NodXR0ZXJWYWx1ZSA9IFNIVVRURVJTW3RoaXMuX3NodXR0ZXJdO1xyXG4gICAgICAgIHRoaXMudXBkYXRlRXhwb3N1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2h1dHRlciAoKTogQ2FtZXJhU2h1dHRlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NodXR0ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNodXR0ZXJWYWx1ZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2h1dHRlclZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpc28gKHZhbDogQ2FtZXJhSVNPKSB7XHJcbiAgICAgICAgdGhpcy5faXNvID0gdmFsO1xyXG4gICAgICAgIHRoaXMuX2lzb1ZhbHVlID0gSVNPU1t0aGlzLl9pc29dO1xyXG4gICAgICAgIHRoaXMudXBkYXRlRXhwb3N1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNvICgpOiBDYW1lcmFJU08ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc287XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzb1ZhbHVlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc29WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZWMgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZWMgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVjICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lYztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZXhwb3N1cmUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIENhbWVyYVBvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuRVhQT1NVUkUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmbG93cyAodmFsOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGlmICh0aGlzLl92aWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuc2V0RXhlY3V0ZUZsb3dzKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBjbGVhckZsYWcgKCkgOiBHRlhDbGVhckZsYWcge1xyXG4gICAgICAgIHJldHVybiBDYW1lcmFQb29sLmdldCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3LkNMRUFSX0ZMQUcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjbGVhckZsYWcgKGZsYWc6IEdGWENsZWFyRmxhZykge1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuQ0xFQVJfRkxBRywgZmxhZyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNsZWFyRGVwdGggKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBDYW1lcmFQb29sLmdldCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3LkNMRUFSX0RFUFRIKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xlYXJEZXB0aCAoZGVwdGg6IG51bWJlcikge1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuQ0xFQVJfREVQVEgsIGRlcHRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2xlYXJTdGVuY2lsICgpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gQ2FtZXJhUG9vbC5nZXQodGhpcy5fcG9vbEhhbmRsZSwgQ2FtZXJhVmlldy5DTEVBUl9TVEVOQ0lMKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xlYXJTdGVuY2lsIChzdGVuY2lsOiBudW1iZXIpIHtcclxuICAgICAgICBDYW1lcmFQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBDYW1lcmFWaWV3LkNMRUFSX1NURU5DSUwsIHN0ZW5jaWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoYW5kbGUgKCkgOiBDYW1lcmFIYW5kbGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb29sSGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VUYXJnZXRXaW5kb3cgKHdpbmRvdzogUmVuZGVyV2luZG93IHwgbnVsbCA9IG51bGwpIHtcclxuICAgICAgICBjb25zdCB3aW4gPSB3aW5kb3cgfHwgbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5tYWluV2luZG93O1xyXG4gICAgICAgIGlmICh3aW4gJiYgdGhpcy5fdmlldykge1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3LndpbmRvdyA9IHdpbjtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemUod2luLndpZHRoLCB3aW4uaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0cmFuc2Zvcm0gYSBzY3JlZW4gcG9zaXRpb24gdG8gYSB3b3JsZCBzcGFjZSByYXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcmVlblBvaW50VG9SYXkgKG91dDogcmF5LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHJheSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5fcG9vbEhhbmRsZTtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IENhbWVyYVBvb2wuZ2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5XSURUSCk7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gQ2FtZXJhUG9vbC5nZXQoaGFuZGxlLCBDYW1lcmFWaWV3LkhFSUdIVCk7XHJcbiAgICAgICAgY29uc3QgY3ggPSB0aGlzLl92aWV3cG9ydC54ICogd2lkdGg7XHJcbiAgICAgICAgY29uc3QgY3kgPSB0aGlzLl92aWV3cG9ydC55ICogaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGN3ID0gdGhpcy5fdmlld3BvcnQud2lkdGggKiB3aWR0aDtcclxuICAgICAgICBjb25zdCBjaCA9IHRoaXMuX3ZpZXdwb3J0LmhlaWdodCAqIGhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gZmFyIHBsYW5lIGludGVyc2VjdGlvblxyXG4gICAgICAgIFZlYzMuc2V0KHZfYSwgKHggLSBjeCkgLyBjdyAqIDIgLSAxLCAoeSAtIGN5KSAvIGNoICogMiAtIDEsIDEpO1xyXG4gICAgICAgIHZfYS55ICo9IHRoaXMuX2RldmljZS5zY3JlZW5TcGFjZVNpZ25ZO1xyXG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NCh2X2EsIHZfYSwgdGhpcy5fbWF0Vmlld1Byb2pJbnYpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fcHJvaiA9PT0gQ2FtZXJhUHJvamVjdGlvbi5QRVJTUEVDVElWRSkge1xyXG4gICAgICAgICAgICAvLyBjYW1lcmEgb3JpZ2luXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ub2RlKSB7IHRoaXMuX25vZGUuZ2V0V29ybGRQb3NpdGlvbih2X2IpOyB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gbmVhciBwbGFuZSBpbnRlcnNlY3Rpb25cclxuICAgICAgICAgICAgVmVjMy5zZXQodl9iLCAoeCAtIGN4KSAvIGN3ICogMiAtIDEsICh5IC0gY3kpIC8gY2ggKiAyIC0gMSwgLTEpO1xyXG4gICAgICAgICAgICB2X2IueSAqPSB0aGlzLl9kZXZpY2Uuc2NyZWVuU3BhY2VTaWduWTtcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHZfYiwgdl9iLCB0aGlzLl9tYXRWaWV3UHJvakludik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmF5LmZyb21Qb2ludHMob3V0LCB2X2IsIHZfYSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0cmFuc2Zvcm0gYSBzY3JlZW4gcG9zaXRpb24gdG8gd29ybGQgc3BhY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcmVlblRvV29ybGQgKG91dDogVmVjMywgc2NyZWVuUG9zOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5fcG9vbEhhbmRsZTtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IENhbWVyYVBvb2wuZ2V0KGhhbmRsZSwgQ2FtZXJhVmlldy5XSURUSCk7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gQ2FtZXJhUG9vbC5nZXQoaGFuZGxlLCBDYW1lcmFWaWV3LkhFSUdIVCk7XHJcbiAgICAgICAgY29uc3QgY3ggPSB0aGlzLl92aWV3cG9ydC54ICogd2lkdGg7XHJcbiAgICAgICAgY29uc3QgY3kgPSB0aGlzLl92aWV3cG9ydC55ICogaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGN3ID0gdGhpcy5fdmlld3BvcnQud2lkdGggKiB3aWR0aDtcclxuICAgICAgICBjb25zdCBjaCA9IHRoaXMuX3ZpZXdwb3J0LmhlaWdodCAqIGhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3Byb2ogPT09IENhbWVyYVByb2plY3Rpb24uUEVSU1BFQ1RJVkUpIHtcclxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHNjcmVlbiBwb3MgaW4gZmFyIGNsaXAgcGxhbmVcclxuICAgICAgICAgICAgVmVjMy5zZXQob3V0LFxyXG4gICAgICAgICAgICAgICAgKHNjcmVlblBvcy54IC0gY3gpIC8gY3cgKiAyIC0gMSxcclxuICAgICAgICAgICAgICAgIChzY3JlZW5Qb3MueSAtIGN5KSAvIGNoICogMiAtIDEsXHJcbiAgICAgICAgICAgICAgICAxLjAsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyB0cmFuc2Zvcm0gdG8gd29ybGRcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgb3V0LCB0aGlzLl9tYXRWaWV3UHJvakludik7XHJcblxyXG4gICAgICAgICAgICAvLyBsZXJwIHRvIGRlcHRoIHpcclxuICAgICAgICAgICAgaWYgKHRoaXMuX25vZGUpIHsgdGhpcy5fbm9kZS5nZXRXb3JsZFBvc2l0aW9uKHZfYSk7IH1cclxuXHJcbiAgICAgICAgICAgIFZlYzMubGVycChvdXQsIHZfYSwgb3V0LCBsZXJwKHRoaXMuX25lYXJDbGlwIC8gdGhpcy5fZmFyQ2xpcCwgMSwgc2NyZWVuUG9zLnopKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBWZWMzLnNldChvdXQsXHJcbiAgICAgICAgICAgICAgICAoc2NyZWVuUG9zLnggLSBjeCkgLyBjdyAqIDIgLSAxLFxyXG4gICAgICAgICAgICAgICAgKHNjcmVlblBvcy55IC0gY3kpIC8gY2ggKiAyIC0gMSxcclxuICAgICAgICAgICAgICAgIHNjcmVlblBvcy56ICogMiAtIDEsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyB0cmFuc2Zvcm0gdG8gd29ybGRcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgb3V0LCB0aGlzLm1hdFZpZXdQcm9qSW52KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0cmFuc2Zvcm0gYSB3b3JsZCBzcGFjZSBwb3NpdGlvbiB0byBzY3JlZW4gc3BhY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHdvcmxkVG9TY3JlZW4gKG91dDogVmVjMywgd29ybGRQb3M6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCBoYW5kbGUgPSB0aGlzLl9wb29sSGFuZGxlO1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gQ2FtZXJhUG9vbC5nZXQoaGFuZGxlLCBDYW1lcmFWaWV3LldJRFRIKTtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSBDYW1lcmFQb29sLmdldChoYW5kbGUsIENhbWVyYVZpZXcuSEVJR0hUKTtcclxuICAgICAgICBjb25zdCBjeCA9IHRoaXMuX3ZpZXdwb3J0LnggKiB3aWR0aDtcclxuICAgICAgICBjb25zdCBjeSA9IHRoaXMuX3ZpZXdwb3J0LnkgKiBoZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgY3cgPSB0aGlzLl92aWV3cG9ydC53aWR0aCAqIHdpZHRoO1xyXG4gICAgICAgIGNvbnN0IGNoID0gdGhpcy5fdmlld3BvcnQuaGVpZ2h0ICogaGVpZ2h0O1xyXG5cclxuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCB3b3JsZFBvcywgdGhpcy5tYXRWaWV3UHJvaik7XHJcblxyXG4gICAgICAgIG91dC54ID0gY3ggKyAob3V0LnggKyAxKSAqIDAuNSAqIGN3O1xyXG4gICAgICAgIG91dC55ID0gY3kgKyAob3V0LnkgKyAxKSAqIDAuNSAqIGNoO1xyXG4gICAgICAgIG91dC56ID0gb3V0LnogKiAwLjUgKyAwLjU7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0cmFuc2Zvcm0gYSB3b3JsZCBzcGFjZSBtYXRyaXggdG8gc2NyZWVuIHNwYWNlXHJcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCB0aGUgcmVzdWx0aW5nIHZlY3RvclxyXG4gICAgICogQHBhcmFtIHtNYXQ0fSB3b3JsZE1hdHJpeCB0aGUgd29ybGQgc3BhY2UgbWF0cml4IHRvIGJlIHRyYW5zZm9ybWVkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggZnJhbWVidWZmZXIgd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgZnJhbWVidWZmZXIgaGVpZ2h0XHJcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gdGhlIHJlc3VsdGluZyB2ZWN0b3JcclxuICAgICAqL1xyXG4gICAgcHVibGljIHdvcmxkTWF0cml4VG9TY3JlZW4gKG91dDogTWF0NCwgd29ybGRNYXRyaXg6IE1hdDQsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKXtcclxuICAgICAgICBNYXQ0Lm11bHRpcGx5KG91dCwgdGhpcy5fbWF0Vmlld1Byb2osIHdvcmxkTWF0cml4KTtcclxuICAgICAgICBjb25zdCBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgaGFsZkhlaWdodCA9IGhlaWdodCAvIDI7XHJcbiAgICAgICAgTWF0NC5pZGVudGl0eShfdGVtcE1hdDEpO1xyXG4gICAgICAgIE1hdDQudHJhbnNmb3JtKF90ZW1wTWF0MSwgX3RlbXBNYXQxLCBWZWMzLnNldCh2X2EsIGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCkpO1xyXG4gICAgICAgIE1hdDQuc2NhbGUoX3RlbXBNYXQxLCBfdGVtcE1hdDEsIFZlYzMuc2V0KHZfYSwgaGFsZldpZHRoLCBoYWxmSGVpZ2h0LCAxKSk7XHJcblxyXG4gICAgICAgIE1hdDQubXVsdGlwbHkob3V0LCBfdGVtcE1hdDEsIG91dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVFeHBvc3VyZSAoKSB7XHJcbiAgICAgICAgY29uc3QgZXYxMDAgPSBNYXRoLmxvZzIoKHRoaXMuX2FwZXJ0dXJlVmFsdWUgKiB0aGlzLl9hcGVydHVyZVZhbHVlKSAvIHRoaXMuX3NodXR0ZXJWYWx1ZSAqIDEwMC4wIC8gdGhpcy5faXNvVmFsdWUpO1xyXG4gICAgICAgIENhbWVyYVBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIENhbWVyYVZpZXcuRVhQT1NVUkUsIDAuODMzMzMzIC8gTWF0aC5wb3coMi4wLCBldjEwMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVjb3JkRnJ1c3R1bUluU2hhcmVkTWVtb3J5ICgpIHtcclxuICAgICAgICBjb25zdCBmcnVzdHVtSGFuZGxlID0gdGhpcy5fZnJ1c3R1bUhhbmRsZTtcclxuICAgICAgICBjb25zdCBmcnN0bSA9IHRoaXMuX2ZydXN0dW07XHJcbiAgICAgICAgaWYgKCFmcnN0bSB8fCBmcnVzdHVtSGFuZGxlID09PSBOVUxMX0hBTkRMRSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IGZyc3RtLnZlcnRpY2VzO1xyXG4gICAgICAgIGxldCB2ZXJ0ZXhPZmZzZXQgPSBGcnVzdHVtVmlldy5WRVJUSUNFUyBhcyBjb25zdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7ICsraSkge1xyXG4gICAgICAgICAgICBGcnVzdHVtUG9vbC5zZXRWZWMzKGZydXN0dW1IYW5kbGUsIHZlcnRleE9mZnNldCwgdmVydGljZXNbaV0pO1xyXG4gICAgICAgICAgICB2ZXJ0ZXhPZmZzZXQgKz0gMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYW5lcyA9IGZyc3RtLnBsYW5lcztcclxuICAgICAgICBsZXQgcGxhbmVPZmZzZXQgPSBGcnVzdHVtVmlldy5QTEFORVMgYXMgY29uc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyssIHBsYW5lT2Zmc2V0ICs9IDQpIHtcclxuICAgICAgICAgICAgRnJ1c3R1bVBvb2wuc2V0VmVjNChmcnVzdHVtSGFuZGxlLCBwbGFuZU9mZnNldCwgcGxhbmVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19