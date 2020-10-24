(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/mesh.js", "../../core/data/decorators/index.js", "../../core/director.js", "../../core/gfx/buffer.js", "../../core/gfx/define.js", "../../core/gfx/input-assembler.js", "../../core/math/index.js", "../../core/memop/index.js", "../../core/renderer/index.js", "../animator/curve-range.js", "../animator/gradient-range.js", "../enum.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/mesh.js"), require("../../core/data/decorators/index.js"), require("../../core/director.js"), require("../../core/gfx/buffer.js"), require("../../core/gfx/define.js"), require("../../core/gfx/input-assembler.js"), require("../../core/math/index.js"), require("../../core/memop/index.js"), require("../../core/renderer/index.js"), require("../animator/curve-range.js"), require("../animator/gradient-range.js"), require("../enum.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mesh, global.index, global.director, global.buffer, global.define, global.inputAssembler, global.index, global.index, global.index, global.curveRange, global.gradientRange, global._enum, global.globalExports);
    global.trail = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mesh, _index, _director, _buffer, _define, _inputAssembler, _index2, _index3, _index4, _curveRange, _gradientRange, _enum, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);
  _gradientRange = _interopRequireDefault(_gradientRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (_e) { function e(_x) { return _e.apply(this, arguments); } e.toString = function () { return _e.toString(); }; return e; }(function (e) { throw e; }), f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function (_e2) { function e(_x2) { return _e2.apply(this, arguments); } e.toString = function () { return _e2.toString(); }; return e; }(function (e) { didErr = true; err = e; }), f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // tslint:disable: max-line-length
  var PRE_TRIANGLE_INDEX = 1;
  var NEXT_TRIANGLE_INDEX = 1 << 2;
  var DIRECTION_THRESHOLD = Math.cos((0, _index2.toRadian)(100));
  var _temp_trailEle = {
    position: new _index2.Vec3(),
    velocity: new _index2.Vec3()
  };

  var _temp_quat = new _index2.Quat();

  var _temp_xform = new _index2.Mat4();

  var _temp_vec3 = new _index2.Vec3();

  var _temp_vec3_1 = new _index2.Vec3();

  var _temp_color = new _index2.Color();

  var barycentric = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // <wireframe debug>
  // tslint:disable-next-line: prefer-const

  var _bcIdx = 0;

  // the valid element is in [start,end) range.if start equals -1,it represents the array is empty.
  var TrailSegment = /*#__PURE__*/function () {
    function TrailSegment(maxTrailElementNum) {
      _classCallCheck(this, TrailSegment);

      this.start = void 0;
      this.end = void 0;
      this.trailElements = void 0;
      this.start = -1;
      this.end = -1;
      this.trailElements = [];

      while (maxTrailElementNum--) {
        this.trailElements.push({
          position: new _index2.Vec3(),
          lifetime: 0,
          width: 0,
          velocity: new _index2.Vec3(),
          direction: 0,
          color: new _index2.Color()
        });
      }
    }

    _createClass(TrailSegment, [{
      key: "getElement",
      value: function getElement(idx) {
        if (this.start === -1) {
          return null;
        }

        if (idx < 0) {
          idx = (idx + this.trailElements.length) % this.trailElements.length;
        }

        if (idx >= this.trailElements.length) {
          idx %= this.trailElements.length;
        }

        return this.trailElements[idx];
      }
    }, {
      key: "addElement",
      value: function addElement() {
        if (this.trailElements.length === 0) {
          return null;
        }

        if (this.start === -1) {
          this.start = 0;
          this.end = 1;
          return this.trailElements[0];
        }

        if (this.start === this.end) {
          this.trailElements.splice(this.end, 0, {
            position: new _index2.Vec3(),
            lifetime: 0,
            width: 0,
            velocity: new _index2.Vec3(),
            direction: 0,
            color: new _index2.Color()
          });
          this.start++;
          this.start %= this.trailElements.length;
        }

        var newEleLoc = this.end++;
        this.end %= this.trailElements.length;
        return this.trailElements[newEleLoc];
      }
    }, {
      key: "iterateElement",
      value: function iterateElement(target, f, p, dt) {
        var end = this.start >= this.end ? this.end + this.trailElements.length : this.end;

        for (var i = this.start; i < end; i++) {
          if (f(target, this.trailElements[i % this.trailElements.length], p, dt)) {
            this.start++;
            this.start %= this.trailElements.length;
          }
        }

        if (this.start === end) {
          this.start = -1;
          this.end = -1;
        }
      }
    }, {
      key: "count",
      value: function count() {
        if (this.start < this.end) {
          return this.end - this.start;
        } else {
          return this.trailElements.length + this.end - this.start;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.start = -1;
        this.end = -1;
      } // <debug>
      // public _print () {
      //     let msg = String();
      //     this.iterateElement(this, (target: object, e: ITrailElement, p: Particle, dt: number) => {
      //         msg += 'pos:' + e.position.toString() + ' lifetime:' + e.lifetime + ' dir:' + e.direction + ' velocity:' + e.velocity.toString() + '\n';
      //         return false;
      //     }, null, 0);
      //     console.log(msg);
      // }

    }]);

    return TrailSegment;
  }();

  var TrailModule = (_dec = (0, _index.ccclass)('cc.TrailModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.type)(_enum.TrailMode), _dec4 = (0, _index.displayOrder)(1), _dec5 = (0, _index.tooltip)('Particle在每个粒子的运动轨迹上形成拖尾效果'), _dec6 = (0, _index.type)(_curveRange.default), _dec7 = (0, _index.displayOrder)(3), _dec8 = (0, _index.tooltip)('拖尾的生命周期'), _dec9 = (0, _index.displayOrder)(5), _dec10 = (0, _index.tooltip)('粒子每生成一个拖尾节点所运行的最短距离'), _dec11 = (0, _index.type)(_enum.Space), _dec12 = (0, _index.displayOrder)(6), _dec13 = (0, _index.tooltip)('拖尾所在的坐标系，World在世界坐标系中运行，Local在本地坐标系中运行'), _dec14 = (0, _index.type)(_enum.TextureMode), _dec15 = (0, _index.displayOrder)(8), _dec16 = (0, _index.tooltip)('贴图在拖尾上的展开形式，Stretch贴图覆盖在整条拖尾上，Repeat贴图覆盖在一段拖尾上'), _dec17 = (0, _index.displayOrder)(9), _dec18 = (0, _index.tooltip)('拖尾宽度继承自粒子大小'), _dec19 = (0, _index.type)(_curveRange.default), _dec20 = (0, _index.displayOrder)(10), _dec21 = (0, _index.tooltip)('拖尾宽度，如果继承自粒子则是粒子大小的比例'), _dec22 = (0, _index.displayOrder)(11), _dec23 = (0, _index.tooltip)('拖尾颜色是否继承自粒子'), _dec24 = (0, _index.type)(_gradientRange.default), _dec25 = (0, _index.displayOrder)(12), _dec26 = (0, _index.tooltip)('拖尾颜色随拖尾自身长度的颜色渐变'), _dec27 = (0, _index.type)(_gradientRange.default), _dec28 = (0, _index.displayOrder)(13), _dec29 = (0, _index.tooltip)('拖尾颜色随时间的颜色渐变'), _dec30 = (0, _index.type)(_enum.Space), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    _createClass(TrailModule, [{
      key: "enable",

      /**
       * 是否启用。
       */
      get: function get() {
        return this._enable;
      },
      set: function set(val) {
        if (val === this._enable && this._trailModel) {
          return;
        }

        if (val && !this._enable) {
          this._enable = val;

          this._particleSystem.processor.updateTrailMaterial();
        }

        if (val && !this._trailModel) {
          this._createModel();

          this.rebuild();
        }

        this._enable = val;

        if (this._trailModel) {
          this._trailModel.enabled = val;
        }

        val ? this.onEnable() : this.onDisable();
      }
    }, {
      key: "minParticleDistance",

      /**
       * 每个轨迹粒子之间的最小间距。
       */
      get: function get() {
        return this._minParticleDistance;
      },
      set: function set(val) {
        this._minParticleDistance = val;
        this._minSquaredDistance = val * val;
      }
    }, {
      key: "space",
      get: function get() {
        return this._space;
      },
      set: function set(val) {
        this._space = val;

        if (this._particleSystem) {
          this._particleSystem.processor.updateTrailMaterial();
        }
      }
      /**
       * 粒子本身是否存在。
       */

    }]);

    function TrailModule() {
      _classCallCheck(this, TrailModule);

      _initializerDefineProperty(this, "_enable", _descriptor, this);

      _initializerDefineProperty(this, "mode", _descriptor2, this);

      _initializerDefineProperty(this, "lifeTime", _descriptor3, this);

      _initializerDefineProperty(this, "_minParticleDistance", _descriptor4, this);

      _initializerDefineProperty(this, "existWithParticles", _descriptor5, this);

      _initializerDefineProperty(this, "textureMode", _descriptor6, this);

      _initializerDefineProperty(this, "widthFromParticle", _descriptor7, this);

      _initializerDefineProperty(this, "widthRatio", _descriptor8, this);

      _initializerDefineProperty(this, "colorFromParticle", _descriptor9, this);

      _initializerDefineProperty(this, "colorOverTrail", _descriptor10, this);

      _initializerDefineProperty(this, "colorOvertime", _descriptor11, this);

      _initializerDefineProperty(this, "_space", _descriptor12, this);

      _initializerDefineProperty(this, "_particleSystem", _descriptor13, this);

      this._minSquaredDistance = 0;
      this._vertSize = void 0;
      this._trailNum = 0;
      this._trailLifetime = 0;
      this.vbOffset = 0;
      this.ibOffset = 0;
      this._trailSegments = null;
      this._particleTrail = void 0;
      this._trailModel = null;
      this._iaInfo = void 0;
      this._iaInfoBuffer = null;
      this._subMeshData = null;
      this._vertAttrs = void 0;
      this._vbF32 = null;
      this._vbUint32 = null;
      this._iBuffer = null;
      this._needTransform = false;
      this._material = null;
      this._iaInfo = new _buffer.GFXIndirectBuffer([new _buffer.GFXDrawInfo()]);
      this._vertAttrs = [new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), // xyz:position
      new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RGBA32F), // x:index y:size zw:texcoord
      // new GFXAttribute(GFXAttributeName.ATTR_TEX_COORD2, GFXFormat.RGB32F), // <wireframe debug>
      new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD1, _define.GFXFormat.RGB32F), // xyz:velocity
      new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA8, true)];
      this._vertSize = 0;

      var _iterator = _createForOfIteratorHelper(this._vertAttrs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var a = _step.value;
          this._vertSize += _define.GFXFormatInfos[a.format].size;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this._particleTrail = new Map();
    }

    _createClass(TrailModule, [{
      key: "onInit",
      value: function onInit(ps) {
        this._particleSystem = ps;
        this.minParticleDistance = this._minParticleDistance;
        var burstCount = 0;
        var psTime = ps.startLifetime.getMax();
        var psRate = ps.rateOverTime.getMax();
        var duration = ps.duration;

        for (var i = 0, len = ps.bursts.length; i < len; i++) {
          var b = ps.bursts[i];
          burstCount += b.getMaxCount(ps) * Math.ceil(psTime / duration);
        }

        this._trailNum = Math.ceil(psTime * this.lifeTime.getMax() * 60 * (psRate * duration + burstCount));
        this._trailSegments = new _index3.Pool(function () {
          return new TrailSegment(10);
        }, Math.ceil(psRate * duration));

        if (this._enable) {
          this.enable = this._enable;
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._attachToScene();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._particleTrail.clear();

        this._detachFromScene();
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {
        if (this._trailModel) {
          if (this._trailModel.scene) {
            this._detachFromScene();
          }

          this._particleSystem._getRenderScene().addModel(this._trailModel);
        }
      }
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {
        if (this._trailModel && this._trailModel.scene) {
          this._trailModel.scene.removeModel(this._trailModel);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.destroySubMeshData();

        if (this._trailModel) {
          _director.director.root.destroyModel(this._trailModel);

          this._trailModel = null;
        }

        if (this._trailSegments) {
          this._trailSegments.destroy(function (obj) {
            obj.trailElements.length = 0;
          });

          this._trailSegments = null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        if (this.enable) {
          var trailIter = this._particleTrail.values();

          var trail = trailIter.next();

          while (!trail.done) {
            trail.value.clear();
            trail = trailIter.next();
          }

          this._particleTrail.clear();

          this.updateRenderData();
        }
      }
    }, {
      key: "updateMaterial",
      value: function updateMaterial() {
        if (this._particleSystem) {
          this._material = this._particleSystem.getMaterialInstance(1) || this._particleSystem.processor._defaultTrailMat;

          if (this._trailModel) {
            this._trailModel.setSubModelMaterial(0, this._material);
          }
        }
      }
    }, {
      key: "update",
      value: function update() {
        this._trailLifetime = this.lifeTime.evaluate(this._particleSystem._time, 1);

        if (this.space === _enum.Space.World && this._particleSystem._simulationSpace === _enum.Space.Local) {
          this._needTransform = true;

          this._particleSystem.node.getWorldMatrix(_temp_xform);

          this._particleSystem.node.getWorldRotation(_temp_quat);
        } else {
          this._needTransform = false;
        }
      }
    }, {
      key: "animate",
      value: function animate(p, scaledDt) {
        if (!this._trailSegments) {
          return;
        }

        var trail = this._particleTrail.get(p);

        if (!trail) {
          trail = this._trailSegments.alloc();

          this._particleTrail.set(p, trail); // Avoid position and trail are one frame apart at the end of the particle animation.


          return;
        }

        var lastSeg = trail.getElement(trail.end - 1);

        if (this._needTransform) {
          _index2.Vec3.transformMat4(_temp_vec3, p.position, _temp_xform);
        } else {
          _index2.Vec3.copy(_temp_vec3, p.position);
        }

        if (lastSeg) {
          trail.iterateElement(this, this._updateTrailElement, p, scaledDt);

          if (_index2.Vec3.squaredDistance(lastSeg.position, _temp_vec3) < this._minSquaredDistance) {
            return;
          }
        }

        lastSeg = trail.addElement();

        if (!lastSeg) {
          return;
        }

        _index2.Vec3.copy(lastSeg.position, _temp_vec3);

        lastSeg.lifetime = 0;

        if (this.widthFromParticle) {
          lastSeg.width = p.size.x * this.widthRatio.evaluate(0, 1);
        } else {
          lastSeg.width = this.widthRatio.evaluate(0, 1);
        }

        var trailNum = trail.count();

        if (trailNum === 2) {
          var lastSecondTrail = trail.getElement(trail.end - 2);

          _index2.Vec3.subtract(lastSecondTrail.velocity, lastSeg.position, lastSecondTrail.position);
        } else if (trailNum > 2) {
          var _lastSecondTrail = trail.getElement(trail.end - 2);

          var lastThirdTrail = trail.getElement(trail.end - 3);

          _index2.Vec3.subtract(_temp_vec3, lastThirdTrail.position, _lastSecondTrail.position);

          _index2.Vec3.subtract(_temp_vec3_1, lastSeg.position, _lastSecondTrail.position);

          _index2.Vec3.subtract(_lastSecondTrail.velocity, _temp_vec3_1, _temp_vec3);

          if (_index2.Vec3.equals(_index2.Vec3.ZERO, _lastSecondTrail.velocity)) {
            _index2.Vec3.copy(_lastSecondTrail.velocity, _temp_vec3);
          }

          _index2.Vec3.normalize(_lastSecondTrail.velocity, _lastSecondTrail.velocity);

          this._checkDirectionReverse(_lastSecondTrail, lastThirdTrail);
        }

        if (this.colorFromParticle) {
          lastSeg.color.set(p.color);
        } else {
          lastSeg.color.set(this.colorOvertime.evaluate(0, 1));
        }
      }
    }, {
      key: "removeParticle",
      value: function removeParticle(p) {
        var trail = this._particleTrail.get(p);

        if (trail && this._trailSegments) {
          trail.clear();

          this._trailSegments.free(trail);

          this._particleTrail["delete"](p);
        }
      }
    }, {
      key: "updateRenderData",
      value: function updateRenderData() {
        this.vbOffset = 0;
        this.ibOffset = 0;

        var _iterator2 = _createForOfIteratorHelper(this._particleTrail.keys()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var p = _step2.value;

            var trailSeg = this._particleTrail.get(p);

            if (trailSeg.start === -1) {
              continue;
            }

            var indexOffset = this.vbOffset * 4 / this._vertSize;
            var end = trailSeg.start >= trailSeg.end ? trailSeg.end + trailSeg.trailElements.length : trailSeg.end;
            var trailNum = end - trailSeg.start; // const lastSegRatio = vec3.distance(trailSeg.getTailElement()!.position, p.position) / this._minParticleDistance;

            var textCoordSeg = 1 / trailNum
            /*- 1 + lastSegRatio*/
            ;
            var startSegEle = trailSeg.trailElements[trailSeg.start];

            this._fillVertexBuffer(startSegEle, this.colorOverTrail.evaluate(1, 1), indexOffset, 1, 0, NEXT_TRIANGLE_INDEX);

            for (var i = trailSeg.start + 1; i < end; i++) {
              var segEle = trailSeg.trailElements[i % trailSeg.trailElements.length];
              var j = i - trailSeg.start;

              this._fillVertexBuffer(segEle, this.colorOverTrail.evaluate(1 - j / trailNum, 1), indexOffset, 1 - j * textCoordSeg, j, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
            }

            if (this._needTransform) {
              _index2.Vec3.transformMat4(_temp_trailEle.position, p.position, _temp_xform);
            } else {
              _index2.Vec3.copy(_temp_trailEle.position, p.position);
            }

            if (trailNum === 1 || trailNum === 2) {
              var lastSecondTrail = trailSeg.getElement(trailSeg.end - 1);

              _index2.Vec3.subtract(lastSecondTrail.velocity, _temp_trailEle.position, lastSecondTrail.position);

              this._vbF32[this.vbOffset - this._vertSize / 4 - 4] = lastSecondTrail.velocity.x;
              this._vbF32[this.vbOffset - this._vertSize / 4 - 3] = lastSecondTrail.velocity.y;
              this._vbF32[this.vbOffset - this._vertSize / 4 - 2] = lastSecondTrail.velocity.z;
              this._vbF32[this.vbOffset - 4] = lastSecondTrail.velocity.x;
              this._vbF32[this.vbOffset - 3] = lastSecondTrail.velocity.y;
              this._vbF32[this.vbOffset - 2] = lastSecondTrail.velocity.z;

              _index2.Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);

              this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
            } else if (trailNum > 2) {
              var _lastSecondTrail2 = trailSeg.getElement(trailSeg.end - 1);

              var lastThirdTrail = trailSeg.getElement(trailSeg.end - 2);

              _index2.Vec3.subtract(_temp_vec3, lastThirdTrail.position, _lastSecondTrail2.position);

              _index2.Vec3.subtract(_temp_vec3_1, _temp_trailEle.position, _lastSecondTrail2.position);

              _index2.Vec3.normalize(_temp_vec3, _temp_vec3);

              _index2.Vec3.normalize(_temp_vec3_1, _temp_vec3_1);

              _index2.Vec3.subtract(_lastSecondTrail2.velocity, _temp_vec3_1, _temp_vec3);

              _index2.Vec3.normalize(_lastSecondTrail2.velocity, _lastSecondTrail2.velocity);

              this._checkDirectionReverse(_lastSecondTrail2, lastThirdTrail); // refresh last trail segment data


              this.vbOffset -= this._vertSize / 4 * 2;
              this.ibOffset -= 6; // _bcIdx = (_bcIdx - 6 + 9) % 9;  // <wireframe debug>

              this._fillVertexBuffer(_lastSecondTrail2, this.colorOverTrail.evaluate(textCoordSeg, 1), indexOffset, textCoordSeg, trailNum - 1, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);

              _index2.Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, _lastSecondTrail2.position);

              _index2.Vec3.normalize(_temp_trailEle.velocity, _temp_trailEle.velocity);

              this._checkDirectionReverse(_temp_trailEle, _lastSecondTrail2);
            }

            if (this.widthFromParticle) {
              _temp_trailEle.width = p.size.x * this.widthRatio.evaluate(0, 1);
            } else {
              _temp_trailEle.width = this.widthRatio.evaluate(0, 1);
            }

            _temp_trailEle.color = p.color;

            if (_index2.Vec3.equals(_temp_trailEle.velocity, _index2.Vec3.ZERO)) {
              this.ibOffset -= 3;
            } else {
              this._fillVertexBuffer(_temp_trailEle, this.colorOverTrail.evaluate(0, 1), indexOffset, 0, trailNum, PRE_TRIANGLE_INDEX);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        this.updateIA(this.ibOffset);
      }
    }, {
      key: "updateIA",
      value: function updateIA(count) {
        var subModels = this._trailModel && this._trailModel.subModels;

        if (subModels && subModels.length > 0) {
          var subModel = subModels[0];
          subModel.inputAssembler.vertexBuffers[0].update(this._vbF32);
          subModel.inputAssembler.indexBuffer.update(this._iBuffer);
          this._iaInfo.drawInfos[0].firstIndex = 0;
          this._iaInfo.drawInfos[0].indexCount = count;

          this._iaInfoBuffer.update(this._iaInfo);
        }
      }
    }, {
      key: "_createModel",
      value: function _createModel() {
        if (this._trailModel) {
          return;
        }

        this._trailModel = _globalExports.legacyCC.director.root.createModel(_index4.scene.Model);
      }
    }, {
      key: "rebuild",
      value: function rebuild() {
        var device = _director.director.root.device;
        var vertexBuffer = device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, this._vertSize * (this._trailNum + 1) * 2, this._vertSize));
        var vBuffer = new ArrayBuffer(this._vertSize * (this._trailNum + 1) * 2);
        this._vbF32 = new Float32Array(vBuffer);
        this._vbUint32 = new Uint32Array(vBuffer);
        vertexBuffer.update(vBuffer);
        var indexBuffer = device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, this._trailNum * 6 * Uint16Array.BYTES_PER_ELEMENT, Uint16Array.BYTES_PER_ELEMENT));
        this._iBuffer = new Uint16Array(this._trailNum * 6);
        indexBuffer.update(this._iBuffer);
        this._iaInfoBuffer = device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDIRECT, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _buffer.GFX_DRAW_INFO_SIZE, _buffer.GFX_DRAW_INFO_SIZE));
        this._iaInfo.drawInfos[0].vertexCount = (this._trailNum + 1) * 2;
        this._iaInfo.drawInfos[0].indexCount = this._trailNum * 6;

        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = new _mesh.RenderingSubMesh([vertexBuffer], this._vertAttrs, _define.GFXPrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        var trailModel = this._trailModel;

        if (trailModel) {
          trailModel.node = trailModel.transform = this._particleSystem.node;
          trailModel.visFlags = this._particleSystem.visibility;
          trailModel.initSubModel(0, this._subMeshData, this._material);
          trailModel.enabled = true;
        }
      }
    }, {
      key: "_updateTrailElement",
      value: function _updateTrailElement(module, trailEle, p, dt) {
        trailEle.lifetime += dt;

        if (module.colorFromParticle) {
          trailEle.color.set(p.color);
          trailEle.color.multiply(module.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
        } else {
          trailEle.color.set(module.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
        }

        if (module.widthFromParticle) {
          trailEle.width = p.size.x * module.widthRatio.evaluate(trailEle.lifetime / module._trailLifetime, 1);
        } else {
          trailEle.width = module.widthRatio.evaluate(trailEle.lifetime / module._trailLifetime, 1);
        }

        return trailEle.lifetime > module._trailLifetime;
      }
    }, {
      key: "_fillVertexBuffer",
      value: function _fillVertexBuffer(trailSeg, colorModifer, indexOffset, xTexCoord, trailEleIdx, indexSet) {
        this._vbF32[this.vbOffset++] = trailSeg.position.x;
        this._vbF32[this.vbOffset++] = trailSeg.position.y;
        this._vbF32[this.vbOffset++] = trailSeg.position.z;
        this._vbF32[this.vbOffset++] = trailSeg.direction;
        this._vbF32[this.vbOffset++] = trailSeg.width;
        this._vbF32[this.vbOffset++] = xTexCoord;
        this._vbF32[this.vbOffset++] = 0; // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // _bcIdx %= 9;

        this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.z;

        _temp_color.set(trailSeg.color);

        _temp_color.multiply(colorModifer);

        this._vbUint32[this.vbOffset++] = _temp_color._val;
        this._vbF32[this.vbOffset++] = trailSeg.position.x;
        this._vbF32[this.vbOffset++] = trailSeg.position.y;
        this._vbF32[this.vbOffset++] = trailSeg.position.z;
        this._vbF32[this.vbOffset++] = 1 - trailSeg.direction;
        this._vbF32[this.vbOffset++] = trailSeg.width;
        this._vbF32[this.vbOffset++] = xTexCoord;
        this._vbF32[this.vbOffset++] = 1; // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
        // _bcIdx %= 9;

        this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
        this._vbF32[this.vbOffset++] = trailSeg.velocity.z;
        this._vbUint32[this.vbOffset++] = _temp_color._val;

        if (indexSet & PRE_TRIANGLE_INDEX) {
          this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx;
          this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx - 1;
          this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
        }

        if (indexSet & NEXT_TRIANGLE_INDEX) {
          this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx;
          this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
          this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 2;
        }
      }
    }, {
      key: "_checkDirectionReverse",
      value: function _checkDirectionReverse(currElement, prevElement) {
        if (_index2.Vec3.dot(currElement.velocity, prevElement.velocity) < DIRECTION_THRESHOLD) {
          currElement.direction = 1 - prevElement.direction;
        } else {
          currElement.direction = prevElement.direction;
        }
      }
    }, {
      key: "destroySubMeshData",
      value: function destroySubMeshData() {
        if (this._subMeshData) {
          this._subMeshData.destroy();

          this._subMeshData = null;
        }
      } // <debug use>
      // private _printVB() {
      //     let log = new String();
      //     for (let i = 0; i < this.vbOffset; i++) {
      //         log += 'pos:' + this._vbF32![i++].toFixed(2) + ',' + this._vbF32![i++].toFixed(2) + ',' + this._vbF32![i++].toFixed(2) + ' dir:' + this._vbF32![i++].toFixed(0) + ' ';
      //         i += 6;
      //         log += 'vel:' + this._vbF32![i++].toFixed(2) + ',' + this._vbF32![i++].toFixed(2) + ',' + this._vbF32![i++].toFixed(2) + '\n';
      //     }
      //     if (log.length > 0) {
      //         console.log(log);
      //     }
      // }

    }]);

    return TrailModule;
  }(), _temp), (_applyDecoratedDescriptor(_class2.prototype, "enable", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec3, _index.serializable, _dec4, _dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.TrailMode.Particles;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lifeTime", [_dec6, _index.serializable, _dec7, _dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_minParticleDistance", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "minParticleDistance", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "minParticleDistance"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "space", [_dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "space"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "existWithParticles", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "textureMode", [_dec14, _index.serializable, _dec15, _dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.TextureMode.Stretch;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "widthFromParticle", [_index.serializable, _dec17, _dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "widthRatio", [_dec19, _index.serializable, _dec20, _dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "colorFromParticle", [_index.serializable, _dec22, _dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "colorOverTrail", [_dec24, _index.serializable, _dec25, _dec26], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradientRange.default();
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "colorOvertime", [_dec27, _index.serializable, _dec28, _dec29], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradientRange.default();
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_space", [_dec30], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.Space.World;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_particleSystem", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
  _exports.default = TrailModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3JlbmRlcmVyL3RyYWlsLnRzIl0sIm5hbWVzIjpbIlBSRV9UUklBTkdMRV9JTkRFWCIsIk5FWFRfVFJJQU5HTEVfSU5ERVgiLCJESVJFQ1RJT05fVEhSRVNIT0xEIiwiTWF0aCIsImNvcyIsIl90ZW1wX3RyYWlsRWxlIiwicG9zaXRpb24iLCJWZWMzIiwidmVsb2NpdHkiLCJfdGVtcF9xdWF0IiwiUXVhdCIsIl90ZW1wX3hmb3JtIiwiTWF0NCIsIl90ZW1wX3ZlYzMiLCJfdGVtcF92ZWMzXzEiLCJfdGVtcF9jb2xvciIsIkNvbG9yIiwiYmFyeWNlbnRyaWMiLCJfYmNJZHgiLCJUcmFpbFNlZ21lbnQiLCJtYXhUcmFpbEVsZW1lbnROdW0iLCJzdGFydCIsImVuZCIsInRyYWlsRWxlbWVudHMiLCJwdXNoIiwibGlmZXRpbWUiLCJ3aWR0aCIsImRpcmVjdGlvbiIsImNvbG9yIiwiaWR4IiwibGVuZ3RoIiwic3BsaWNlIiwibmV3RWxlTG9jIiwidGFyZ2V0IiwiZiIsInAiLCJkdCIsImkiLCJUcmFpbE1vZHVsZSIsIlRyYWlsTW9kZSIsIkN1cnZlUmFuZ2UiLCJTcGFjZSIsIlRleHR1cmVNb2RlIiwiR3JhZGllbnRSYW5nZSIsIl9lbmFibGUiLCJ2YWwiLCJfdHJhaWxNb2RlbCIsIl9wYXJ0aWNsZVN5c3RlbSIsInByb2Nlc3NvciIsInVwZGF0ZVRyYWlsTWF0ZXJpYWwiLCJfY3JlYXRlTW9kZWwiLCJyZWJ1aWxkIiwiZW5hYmxlZCIsIm9uRW5hYmxlIiwib25EaXNhYmxlIiwiX21pblBhcnRpY2xlRGlzdGFuY2UiLCJfbWluU3F1YXJlZERpc3RhbmNlIiwiX3NwYWNlIiwiX3ZlcnRTaXplIiwiX3RyYWlsTnVtIiwiX3RyYWlsTGlmZXRpbWUiLCJ2Yk9mZnNldCIsImliT2Zmc2V0IiwiX3RyYWlsU2VnbWVudHMiLCJfcGFydGljbGVUcmFpbCIsIl9pYUluZm8iLCJfaWFJbmZvQnVmZmVyIiwiX3N1Yk1lc2hEYXRhIiwiX3ZlcnRBdHRycyIsIl92YkYzMiIsIl92YlVpbnQzMiIsIl9pQnVmZmVyIiwiX25lZWRUcmFuc2Zvcm0iLCJfbWF0ZXJpYWwiLCJHRlhJbmRpcmVjdEJ1ZmZlciIsIkdGWERyYXdJbmZvIiwiR0ZYQXR0cmlidXRlIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkFUVFJfUE9TSVRJT04iLCJHRlhGb3JtYXQiLCJSR0IzMkYiLCJBVFRSX1RFWF9DT09SRCIsIlJHQkEzMkYiLCJBVFRSX1RFWF9DT09SRDEiLCJBVFRSX0NPTE9SIiwiUkdCQTgiLCJhIiwiR0ZYRm9ybWF0SW5mb3MiLCJmb3JtYXQiLCJzaXplIiwiTWFwIiwicHMiLCJtaW5QYXJ0aWNsZURpc3RhbmNlIiwiYnVyc3RDb3VudCIsInBzVGltZSIsInN0YXJ0TGlmZXRpbWUiLCJnZXRNYXgiLCJwc1JhdGUiLCJyYXRlT3ZlclRpbWUiLCJkdXJhdGlvbiIsImxlbiIsImJ1cnN0cyIsImIiLCJnZXRNYXhDb3VudCIsImNlaWwiLCJsaWZlVGltZSIsIlBvb2wiLCJlbmFibGUiLCJfYXR0YWNoVG9TY2VuZSIsImNsZWFyIiwiX2RldGFjaEZyb21TY2VuZSIsInNjZW5lIiwiX2dldFJlbmRlclNjZW5lIiwiYWRkTW9kZWwiLCJyZW1vdmVNb2RlbCIsImRlc3Ryb3lTdWJNZXNoRGF0YSIsImRpcmVjdG9yIiwicm9vdCIsImRlc3Ryb3lNb2RlbCIsImRlc3Ryb3kiLCJvYmoiLCJ0cmFpbEl0ZXIiLCJ2YWx1ZXMiLCJ0cmFpbCIsIm5leHQiLCJkb25lIiwidmFsdWUiLCJ1cGRhdGVSZW5kZXJEYXRhIiwiZ2V0TWF0ZXJpYWxJbnN0YW5jZSIsIl9kZWZhdWx0VHJhaWxNYXQiLCJzZXRTdWJNb2RlbE1hdGVyaWFsIiwiZXZhbHVhdGUiLCJfdGltZSIsInNwYWNlIiwiV29ybGQiLCJfc2ltdWxhdGlvblNwYWNlIiwiTG9jYWwiLCJub2RlIiwiZ2V0V29ybGRNYXRyaXgiLCJnZXRXb3JsZFJvdGF0aW9uIiwic2NhbGVkRHQiLCJnZXQiLCJhbGxvYyIsInNldCIsImxhc3RTZWciLCJnZXRFbGVtZW50IiwidHJhbnNmb3JtTWF0NCIsImNvcHkiLCJpdGVyYXRlRWxlbWVudCIsIl91cGRhdGVUcmFpbEVsZW1lbnQiLCJzcXVhcmVkRGlzdGFuY2UiLCJhZGRFbGVtZW50Iiwid2lkdGhGcm9tUGFydGljbGUiLCJ4Iiwid2lkdGhSYXRpbyIsInRyYWlsTnVtIiwiY291bnQiLCJsYXN0U2Vjb25kVHJhaWwiLCJzdWJ0cmFjdCIsImxhc3RUaGlyZFRyYWlsIiwiZXF1YWxzIiwiWkVSTyIsIm5vcm1hbGl6ZSIsIl9jaGVja0RpcmVjdGlvblJldmVyc2UiLCJjb2xvckZyb21QYXJ0aWNsZSIsImNvbG9yT3ZlcnRpbWUiLCJmcmVlIiwia2V5cyIsInRyYWlsU2VnIiwiaW5kZXhPZmZzZXQiLCJ0ZXh0Q29vcmRTZWciLCJzdGFydFNlZ0VsZSIsIl9maWxsVmVydGV4QnVmZmVyIiwiY29sb3JPdmVyVHJhaWwiLCJzZWdFbGUiLCJqIiwieSIsInoiLCJ1cGRhdGVJQSIsInN1Yk1vZGVscyIsInN1Yk1vZGVsIiwiaW5wdXRBc3NlbWJsZXIiLCJ2ZXJ0ZXhCdWZmZXJzIiwidXBkYXRlIiwiaW5kZXhCdWZmZXIiLCJkcmF3SW5mb3MiLCJmaXJzdEluZGV4IiwiaW5kZXhDb3VudCIsImxlZ2FjeUNDIiwiY3JlYXRlTW9kZWwiLCJNb2RlbCIsImRldmljZSIsInZlcnRleEJ1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsIkdGWEJ1ZmZlckluZm8iLCJHRlhCdWZmZXJVc2FnZUJpdCIsIlZFUlRFWCIsIlRSQU5TRkVSX0RTVCIsIkdGWE1lbW9yeVVzYWdlQml0IiwiSE9TVCIsIkRFVklDRSIsInZCdWZmZXIiLCJBcnJheUJ1ZmZlciIsIkZsb2F0MzJBcnJheSIsIlVpbnQzMkFycmF5IiwiSU5ERVgiLCJVaW50MTZBcnJheSIsIkJZVEVTX1BFUl9FTEVNRU5UIiwiSU5ESVJFQ1QiLCJHRlhfRFJBV19JTkZPX1NJWkUiLCJ2ZXJ0ZXhDb3VudCIsIlJlbmRlcmluZ1N1Yk1lc2giLCJHRlhQcmltaXRpdmVNb2RlIiwiVFJJQU5HTEVfTElTVCIsInRyYWlsTW9kZWwiLCJ0cmFuc2Zvcm0iLCJ2aXNGbGFncyIsInZpc2liaWxpdHkiLCJpbml0U3ViTW9kZWwiLCJtb2R1bGUiLCJ0cmFpbEVsZSIsIm11bHRpcGx5IiwicmVtYWluaW5nTGlmZXRpbWUiLCJjb2xvck1vZGlmZXIiLCJ4VGV4Q29vcmQiLCJ0cmFpbEVsZUlkeCIsImluZGV4U2V0IiwiX3ZhbCIsImN1cnJFbGVtZW50IiwicHJldkVsZW1lbnQiLCJkb3QiLCJzZXJpYWxpemFibGUiLCJQYXJ0aWNsZXMiLCJTdHJldGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQTtBQUNBLE1BQU1BLGtCQUFrQixHQUFHLENBQTNCO0FBQ0EsTUFBTUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFqQztBQUNBLE1BQU1DLG1CQUFtQixHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyxzQkFBUyxHQUFULENBQVQsQ0FBNUI7QUFFQSxNQUFNQyxjQUFjLEdBQUc7QUFBRUMsSUFBQUEsUUFBUSxFQUFFLElBQUlDLFlBQUosRUFBWjtBQUF3QkMsSUFBQUEsUUFBUSxFQUFFLElBQUlELFlBQUo7QUFBbEMsR0FBdkI7O0FBQ0EsTUFBTUUsVUFBVSxHQUFHLElBQUlDLFlBQUosRUFBbkI7O0FBQ0EsTUFBTUMsV0FBVyxHQUFHLElBQUlDLFlBQUosRUFBcEI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLElBQUlOLFlBQUosRUFBbkI7O0FBQ0EsTUFBTU8sWUFBWSxHQUFHLElBQUlQLFlBQUosRUFBckI7O0FBQ0EsTUFBTVEsV0FBVyxHQUFHLElBQUlDLGFBQUosRUFBcEI7O0FBRUEsTUFBTUMsV0FBVyxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsQ0FB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QzFNLFNBQXBDO0FBQ0g7QUFDSjs7OzJDQUU2QjtBQUMxQixZQUFJLEtBQUt3QyxZQUFULEVBQXVCO0FBQ25CLGVBQUtBLFlBQUwsQ0FBa0JvRCxPQUFsQjs7QUFDQSxlQUFLcEQsWUFBTCxHQUFvQixJQUFwQjtBQUNIO0FBQ0osTyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7eU9BdGdCQ29LLG1COzs7OzthQUNnQixLOztrRkFNaEJBLG1COzs7OzthQUdhaE0sZ0JBQVVpTSxTOztzRkFNdkJELG1COzs7OzthQUdpQixJQUFJL0wsbUJBQUosRTs7MkZBRWpCK0wsbUI7Ozs7O2FBQzZCLEc7OzhhQWlDN0JBLG1COzs7OzthQUMyQixJOzswRkFNM0JBLG1COzs7OzthQUdvQjdMLGtCQUFZK0wsTzs7d0ZBRWhDRixtQjs7Ozs7YUFHMEIsSTs7eUZBTTFCQSxtQjs7Ozs7YUFHbUIsSUFBSS9MLG1CQUFKLEU7O3dGQUVuQitMLG1COzs7OzthQUcwQixLOzs4RkFHMUJBLG1COzs7OzthQUd1QixJQUFJNUwsc0JBQUosRTs7NkZBR3ZCNEwsbUI7Ozs7O2FBR3NCLElBQUk1TCxzQkFBSixFOzs7Ozs7O2FBTU5GLFlBQU02RixLOzt1RkFFdEJpRyxtQjs7Ozs7YUFDOEIsSSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IHBhcnRpY2xlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cy9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IFJlbmRlcmluZ1N1Yk1lc2ggfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgY2NjbGFzcywgdG9vbHRpcCwgZGlzcGxheU9yZGVyLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBkaXJlY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBHRlhfRFJBV19JTkZPX1NJWkUsIEdGWEJ1ZmZlciwgR0ZYSW5kaXJlY3RCdWZmZXIsIEdGWEJ1ZmZlckluZm8sIEdGWERyYXdJbmZvIH0gZnJvbSAnLi4vLi4vY29yZS9nZngvYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlTmFtZSwgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWEZvcm1hdCwgR0ZYRm9ybWF0SW5mb3MsIEdGWE1lbW9yeVVzYWdlQml0LCBHRlhQcmltaXRpdmVNb2RlIH0gZnJvbSAnLi4vLi4vY29yZS9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vLi4vY29yZS9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi4vLi4vY29yZS9nZngvaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgQ29sb3IsIE1hdDQsIFF1YXQsIHRvUmFkaWFuLCBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgUG9vbCB9IGZyb20gJy4uLy4uL2NvcmUvbWVtb3AnO1xyXG5pbXBvcnQgeyBzY2VuZSB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXInO1xyXG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuLi9hbmltYXRvci9jdXJ2ZS1yYW5nZSc7XHJcbmltcG9ydCBHcmFkaWVudFJhbmdlIGZyb20gJy4uL2FuaW1hdG9yL2dyYWRpZW50LXJhbmdlJztcclxuaW1wb3J0IHsgU3BhY2UsIFRleHR1cmVNb2RlLCBUcmFpbE1vZGUgfSBmcm9tICcuLi9lbnVtJztcclxuaW1wb3J0IHsgUGFydGljbGUgfSBmcm9tICcuLi9wYXJ0aWNsZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXHJcbmNvbnN0IFBSRV9UUklBTkdMRV9JTkRFWCA9IDE7XHJcbmNvbnN0IE5FWFRfVFJJQU5HTEVfSU5ERVggPSAxIDw8IDI7XHJcbmNvbnN0IERJUkVDVElPTl9USFJFU0hPTEQgPSBNYXRoLmNvcyh0b1JhZGlhbigxMDApKTtcclxuXHJcbmNvbnN0IF90ZW1wX3RyYWlsRWxlID0geyBwb3NpdGlvbjogbmV3IFZlYzMoKSwgdmVsb2NpdHk6IG5ldyBWZWMzKCkgfSBhcyBJVHJhaWxFbGVtZW50O1xyXG5jb25zdCBfdGVtcF9xdWF0ID0gbmV3IFF1YXQoKTtcclxuY29uc3QgX3RlbXBfeGZvcm0gPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBfdGVtcF92ZWMzID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX3RlbXBfdmVjM18xID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX3RlbXBfY29sb3IgPSBuZXcgQ29sb3IoKTtcclxuXHJcbmNvbnN0IGJhcnljZW50cmljID0gWzEsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDFdOyAvLyA8d2lyZWZyYW1lIGRlYnVnPlxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1jb25zdFxyXG5sZXQgX2JjSWR4ID0gMDtcclxuXHJcbmludGVyZmFjZSBJVHJhaWxFbGVtZW50IHtcclxuICAgIHBvc2l0aW9uOiBWZWMzO1xyXG4gICAgbGlmZXRpbWU6IG51bWJlcjtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICB2ZWxvY2l0eTogVmVjMztcclxuICAgIGRpcmVjdGlvbjogbnVtYmVyOyAvLyBpZiBvbmUgZWxlbWVudCdzIGRpcmVjdGlvbiBkaWZmZXJzIGZyb20gdGhlIHByZXZpb3VzIG9uZSxpdCBtZWFucyB0aGUgdHJhaWwncyBkaXJlY3Rpb24gcmV2ZXJzZS5cclxuICAgIGNvbG9yOiBDb2xvcjtcclxufVxyXG5cclxuLy8gdGhlIHZhbGlkIGVsZW1lbnQgaXMgaW4gW3N0YXJ0LGVuZCkgcmFuZ2UuaWYgc3RhcnQgZXF1YWxzIC0xLGl0IHJlcHJlc2VudHMgdGhlIGFycmF5IGlzIGVtcHR5LlxyXG5jbGFzcyBUcmFpbFNlZ21lbnQge1xyXG4gICAgcHVibGljIHN0YXJ0OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZW5kOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHJhaWxFbGVtZW50czogSVRyYWlsRWxlbWVudFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChtYXhUcmFpbEVsZW1lbnROdW06IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSAtMTtcclxuICAgICAgICB0aGlzLmVuZCA9IC0xO1xyXG4gICAgICAgIHRoaXMudHJhaWxFbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHdoaWxlIChtYXhUcmFpbEVsZW1lbnROdW0tLSkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYWlsRWxlbWVudHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbmV3IFZlYzMoKSxcclxuICAgICAgICAgICAgICAgIGxpZmV0aW1lOiAwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogbmV3IFZlYzMoKSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBuZXcgQ29sb3IoKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFbGVtZW50IChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlkeCA8IDApIHtcclxuICAgICAgICAgICAgaWR4ID0gKGlkeCArIHRoaXMudHJhaWxFbGVtZW50cy5sZW5ndGgpICUgdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlkeCA+PSB0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlkeCAlPSB0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy50cmFpbEVsZW1lbnRzW2lkeF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEVsZW1lbnQgKCk6IElUcmFpbEVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsIGFzIGFueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnQgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmVuZCA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWlsRWxlbWVudHNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0ID09PSB0aGlzLmVuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYWlsRWxlbWVudHMuc3BsaWNlKHRoaXMuZW5kLCAwLCB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbmV3IFZlYzMoKSxcclxuICAgICAgICAgICAgICAgIGxpZmV0aW1lOiAwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogbmV3IFZlYzMoKSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBuZXcgQ29sb3IoKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQrKztcclxuICAgICAgICAgICAgdGhpcy5zdGFydCAlPSB0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBuZXdFbGVMb2MgPSB0aGlzLmVuZCsrO1xyXG4gICAgICAgIHRoaXMuZW5kICU9IHRoaXMudHJhaWxFbGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhaWxFbGVtZW50c1tuZXdFbGVMb2NdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpdGVyYXRlRWxlbWVudCAodGFyZ2V0OiBvYmplY3QsIGY6ICh0YXJnZXQ6IG9iamVjdCwgZTogSVRyYWlsRWxlbWVudCwgcDogUGFydGljbGUsIGR0OiBudW1iZXIpID0+IGJvb2xlYW4sIHA6IFBhcnRpY2xlLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5zdGFydCA+PSB0aGlzLmVuZCA/IHRoaXMuZW5kICsgdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aCA6IHRoaXMuZW5kO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGYodGFyZ2V0LCB0aGlzLnRyYWlsRWxlbWVudHNbaSAlIHRoaXMudHJhaWxFbGVtZW50cy5sZW5ndGhdLCBwLCBkdCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQrKztcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQgJT0gdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdGFydCA9PT0gZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy5lbmQgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvdW50ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGFydCA8IHRoaXMuZW5kKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZCAtIHRoaXMuc3RhcnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhaWxFbGVtZW50cy5sZW5ndGggKyB0aGlzLmVuZCAtIHRoaXMuc3RhcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydCA9IC0xO1xyXG4gICAgICAgIHRoaXMuZW5kID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPGRlYnVnPlxyXG4gICAgLy8gcHVibGljIF9wcmludCAoKSB7XHJcbiAgICAvLyAgICAgbGV0IG1zZyA9IFN0cmluZygpO1xyXG4gICAgLy8gICAgIHRoaXMuaXRlcmF0ZUVsZW1lbnQodGhpcywgKHRhcmdldDogb2JqZWN0LCBlOiBJVHJhaWxFbGVtZW50LCBwOiBQYXJ0aWNsZSwgZHQ6IG51bWJlcikgPT4ge1xyXG4gICAgLy8gICAgICAgICBtc2cgKz0gJ3BvczonICsgZS5wb3NpdGlvbi50b1N0cmluZygpICsgJyBsaWZldGltZTonICsgZS5saWZldGltZSArICcgZGlyOicgKyBlLmRpcmVjdGlvbiArICcgdmVsb2NpdHk6JyArIGUudmVsb2NpdHkudG9TdHJpbmcoKSArICdcXG4nO1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgfSwgbnVsbCwgMCk7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgIC8vIH1cclxufVxyXG5cclxuQGNjY2xhc3MoJ2NjLlRyYWlsTW9kdWxlJylcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhaWxNb2R1bGUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5ZCv55So44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMClcclxuICAgIHB1YmxpYyBnZXQgZW5hYmxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZW5hYmxlICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsID09PSB0aGlzLl9lbmFibGUgJiYgdGhpcy5fdHJhaWxNb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWwgJiYgIXRoaXMuX2VuYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbmFibGUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnByb2Nlc3Nvci51cGRhdGVUcmFpbE1hdGVyaWFsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWwgJiYgIXRoaXMuX3RyYWlsTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3JlYXRlTW9kZWwoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2VuYWJsZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fdHJhaWxNb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl90cmFpbE1vZGVsLmVuYWJsZWQgPSB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWwgPyB0aGlzLm9uRW5hYmxlKCkgOiB0aGlzLm9uRGlzYWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBfZW5hYmxlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7lrprnspLlrZDnlJ/miJDovajov7nnmoTmlrnlvI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVHJhaWxNb2RlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ1BhcnRpY2xl5Zyo5q+P5Liq57KS5a2Q55qE6L+Q5Yqo6L2o6L+55LiK5b2i5oiQ5ouW5bC+5pWI5p6cJylcclxuICAgIHB1YmxpYyBtb2RlID0gVHJhaWxNb2RlLlBhcnRpY2xlcztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi9qOi/ueWtmOWcqOeahOeUn+WRveWRqOacn+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigzKVxyXG4gICAgQHRvb2x0aXAoJ+aLluWwvueahOeUn+WRveWRqOacnycpXHJcbiAgICBwdWJsaWMgbGlmZVRpbWUgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBfbWluUGFydGljbGVEaXN0YW5jZSA9IDAuMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOavj+S4qui9qOi/ueeykuWtkOS5i+mXtOeahOacgOWwj+mXtOi3neOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDUpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5q+P55Sf5oiQ5LiA5Liq5ouW5bC+6IqC54K55omA6L+Q6KGM55qE5pyA55+t6Led56a7JylcclxuICAgIHB1YmxpYyBnZXQgbWluUGFydGljbGVEaXN0YW5jZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pblBhcnRpY2xlRGlzdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtaW5QYXJ0aWNsZURpc3RhbmNlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9taW5QYXJ0aWNsZURpc3RhbmNlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuX21pblNxdWFyZWREaXN0YW5jZSA9IHZhbCAqIHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShTcGFjZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoNilcclxuICAgIEB0b29sdGlwKCfmi5blsL7miYDlnKjnmoTlnZDmoIfns7vvvIxXb3JsZOWcqOS4lueVjOWdkOagh+ezu+S4rei/kOihjO+8jExvY2Fs5Zyo5pys5Zyw5Z2Q5qCH57O75Lit6L+Q6KGMJylcclxuICAgIHB1YmxpYyBnZXQgc3BhY2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcGFjZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNwYWNlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9zcGFjZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ucHJvY2Vzc29yLnVwZGF0ZVRyYWlsTWF0ZXJpYWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnspLlrZDmnKzouqvmmK/lkKblrZjlnKjjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHVibGljIGV4aXN0V2l0aFBhcnRpY2xlcyA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7lrprnurnnkIbloavlhYXmlrnlvI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVGV4dHVyZU1vZGUpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDgpXHJcbiAgICBAdG9vbHRpcCgn6LS05Zu+5Zyo5ouW5bC+5LiK55qE5bGV5byA5b2i5byP77yMU3RyZXRjaOi0tOWbvuimhuebluWcqOaVtOadoeaLluWwvuS4iu+8jFJlcGVhdOi0tOWbvuimhuebluWcqOS4gOauteaLluWwvuS4iicpXHJcbiAgICBwdWJsaWMgdGV4dHVyZU1vZGUgPSBUZXh0dXJlTW9kZS5TdHJldGNoO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoOSlcclxuICAgIEB0b29sdGlwKCfmi5blsL7lrr3luqbnu6fmib/oh6rnspLlrZDlpKflsI8nKVxyXG4gICAgcHVibGljIHdpZHRoRnJvbVBhcnRpY2xlID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaOp+WItui9qOi/uemVv+W6pueahOabsue6v+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigxMClcclxuICAgIEB0b29sdGlwKCfmi5blsL7lrr3luqbvvIzlpoLmnpznu6fmib/oh6rnspLlrZDliJnmmK/nspLlrZDlpKflsI/nmoTmr5TkvosnKVxyXG4gICAgcHVibGljIHdpZHRoUmF0aW8gPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTEpXHJcbiAgICBAdG9vbHRpcCgn5ouW5bC+6aKc6Imy5piv5ZCm57un5om/6Ieq57KS5a2QJylcclxuICAgIHB1YmxpYyBjb2xvckZyb21QYXJ0aWNsZSA9IGZhbHNlO1xyXG5cclxuICAgIEB0eXBlKEdyYWRpZW50UmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEyKVxyXG4gICAgQHRvb2x0aXAoJ+aLluWwvuminOiJsumaj+aLluWwvuiHqui6q+mVv+W6pueahOminOiJsua4kOWPmCcpXHJcbiAgICBwdWJsaWMgY29sb3JPdmVyVHJhaWwgPSBuZXcgR3JhZGllbnRSYW5nZSgpO1xyXG5cclxuICAgIEB0eXBlKEdyYWRpZW50UmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEzKVxyXG4gICAgQHRvb2x0aXAoJ+aLluWwvuminOiJsumaj+aXtumXtOeahOminOiJsua4kOWPmCcpXHJcbiAgICBwdWJsaWMgY29sb3JPdmVydGltZSA9IG5ldyBHcmFkaWVudFJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDovajov7norr7lrprml7bnmoTlnZDmoIfns7vjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3BhY2UpXHJcbiAgICBwcml2YXRlIF9zcGFjZSA9IFNwYWNlLldvcmxkO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3BhcnRpY2xlU3lzdGVtOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX21pblNxdWFyZWREaXN0YW5jZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3ZlcnRTaXplOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF90cmFpbE51bTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3RyYWlsTGlmZXRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHZiT2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBpYk9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3RyYWlsU2VnbWVudHM6IFBvb2w8VHJhaWxTZWdtZW50PiB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGFydGljbGVUcmFpbDogTWFwPFBhcnRpY2xlLCBUcmFpbFNlZ21lbnQ+O1xyXG4gICAgcHJpdmF0ZSBfdHJhaWxNb2RlbDogc2NlbmUuTW9kZWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2lhSW5mbzogR0ZYSW5kaXJlY3RCdWZmZXI7XHJcbiAgICBwcml2YXRlIF9pYUluZm9CdWZmZXI6IEdGWEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfc3ViTWVzaERhdGE6IFJlbmRlcmluZ1N1Yk1lc2ggfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3ZlcnRBdHRyczogR0ZYQXR0cmlidXRlW107XHJcbiAgICBwcml2YXRlIF92YkYzMjogRmxvYXQzMkFycmF5IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF92YlVpbnQzMjogVWludDMyQXJyYXkgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2lCdWZmZXI6IFVpbnQxNkFycmF5IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9uZWVkVHJhbnNmb3JtOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9tYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvID0gbmV3IEdGWEluZGlyZWN0QnVmZmVyKFtuZXcgR0ZYRHJhd0luZm8oKV0pO1xyXG5cclxuICAgICAgICB0aGlzLl92ZXJ0QXR0cnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OLCBHRlhGb3JtYXQuUkdCMzJGKSwgICAvLyB4eXo6cG9zaXRpb25cclxuICAgICAgICAgICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELCBHRlhGb3JtYXQuUkdCQTMyRiksIC8vIHg6aW5kZXggeTpzaXplIHp3OnRleGNvb3JkXHJcbiAgICAgICAgICAgIC8vIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRDIsIEdGWEZvcm1hdC5SR0IzMkYpLCAvLyA8d2lyZWZyYW1lIGRlYnVnPlxyXG4gICAgICAgICAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9URVhfQ09PUkQxLCBHRlhGb3JtYXQuUkdCMzJGKSwgLy8geHl6OnZlbG9jaXR5XHJcbiAgICAgICAgICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX0NPTE9SLCBHRlhGb3JtYXQuUkdCQTgsIHRydWUpLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5fdmVydFNpemUgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiB0aGlzLl92ZXJ0QXR0cnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemUgKz0gR0ZYRm9ybWF0SW5mb3NbYS5mb3JtYXRdLnNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVRyYWlsID0gbmV3IE1hcDxQYXJ0aWNsZSwgVHJhaWxTZWdtZW50PigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkluaXQgKHBzKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0gPSBwcztcclxuICAgICAgICB0aGlzLm1pblBhcnRpY2xlRGlzdGFuY2UgPSB0aGlzLl9taW5QYXJ0aWNsZURpc3RhbmNlO1xyXG4gICAgICAgIGxldCBidXJzdENvdW50ID0gMDtcclxuICAgICAgICBjb25zdCBwc1RpbWUgPSBwcy5zdGFydExpZmV0aW1lLmdldE1heCgpO1xyXG4gICAgICAgIGNvbnN0IHBzUmF0ZSA9IHBzLnJhdGVPdmVyVGltZS5nZXRNYXgoKTtcclxuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBzLmR1cmF0aW9uO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwcy5idXJzdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYiA9IHBzLmJ1cnN0c1tpXTtcclxuICAgICAgICAgICAgYnVyc3RDb3VudCArPSBiLmdldE1heENvdW50KHBzKSAqIE1hdGguY2VpbChwc1RpbWUgLyBkdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RyYWlsTnVtID0gTWF0aC5jZWlsKHBzVGltZSAqIHRoaXMubGlmZVRpbWUuZ2V0TWF4KCkgKiA2MCAqIChwc1JhdGUgKiBkdXJhdGlvbiArIGJ1cnN0Q291bnQpKTtcclxuICAgICAgICB0aGlzLl90cmFpbFNlZ21lbnRzID0gbmV3IFBvb2woKCkgPT4gbmV3IFRyYWlsU2VnbWVudCgxMCksIE1hdGguY2VpbChwc1JhdGUgKiBkdXJhdGlvbikpO1xyXG4gICAgICAgIGlmICh0aGlzLl9lbmFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGUgPSB0aGlzLl9lbmFibGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fYXR0YWNoVG9TY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlVHJhaWwuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2F0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFpbE1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFpbE1vZGVsLnNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fZ2V0UmVuZGVyU2NlbmUoKS5hZGRNb2RlbCh0aGlzLl90cmFpbE1vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9kZXRhY2hGcm9tU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFpbE1vZGVsICYmIHRoaXMuX3RyYWlsTW9kZWwuc2NlbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdHJhaWxNb2RlbC5zY2VuZS5yZW1vdmVNb2RlbCh0aGlzLl90cmFpbE1vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVN1Yk1lc2hEYXRhKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RyYWlsTW9kZWwpIHtcclxuICAgICAgICAgICAgZGlyZWN0b3Iucm9vdCEuZGVzdHJveU1vZGVsKHRoaXMuX3RyYWlsTW9kZWwpO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFpbE1vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3RyYWlsU2VnbWVudHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fdHJhaWxTZWdtZW50cy5kZXN0cm95KChvYmo6IFRyYWlsU2VnbWVudCkgPT4geyBvYmoudHJhaWxFbGVtZW50cy5sZW5ndGggPSAwOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5fdHJhaWxTZWdtZW50cyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYWlsSXRlciA9IHRoaXMuX3BhcnRpY2xlVHJhaWwudmFsdWVzKCk7XHJcbiAgICAgICAgICAgIGxldCB0cmFpbCA9IHRyYWlsSXRlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIHdoaWxlICghdHJhaWwuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgdHJhaWwudmFsdWUuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHRyYWlsID0gdHJhaWxJdGVyLm5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVRyYWlsLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlTWF0ZXJpYWwgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLmdldE1hdGVyaWFsSW5zdGFuY2UoMSkgfHwgdGhpcy5fcGFydGljbGVTeXN0ZW0ucHJvY2Vzc29yLl9kZWZhdWx0VHJhaWxNYXQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFpbE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90cmFpbE1vZGVsLnNldFN1Yk1vZGVsTWF0ZXJpYWwoMCwgdGhpcy5fbWF0ZXJpYWwhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICB0aGlzLl90cmFpbExpZmV0aW1lID0gdGhpcy5saWZlVGltZS5ldmFsdWF0ZSh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fdGltZSwgMSkhO1xyXG4gICAgICAgIGlmICh0aGlzLnNwYWNlID09PSBTcGFjZS5Xb3JsZCAmJiB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fc2ltdWxhdGlvblNwYWNlID09PSBTcGFjZS5Mb2NhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkVHJhbnNmb3JtID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ubm9kZS5nZXRXb3JsZE1hdHJpeChfdGVtcF94Zm9ybSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLm5vZGUuZ2V0V29ybGRSb3RhdGlvbihfdGVtcF9xdWF0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkVHJhbnNmb3JtID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhbmltYXRlIChwOiBQYXJ0aWNsZSwgc2NhbGVkRHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5fdHJhaWxTZWdtZW50cykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0cmFpbCA9IHRoaXMuX3BhcnRpY2xlVHJhaWwuZ2V0KHApO1xyXG4gICAgICAgIGlmICghdHJhaWwpIHtcclxuICAgICAgICAgICAgdHJhaWwgPSB0aGlzLl90cmFpbFNlZ21lbnRzLmFsbG9jKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlVHJhaWwuc2V0KHAsIHRyYWlsKTtcclxuICAgICAgICAgICAgLy8gQXZvaWQgcG9zaXRpb24gYW5kIHRyYWlsIGFyZSBvbmUgZnJhbWUgYXBhcnQgYXQgdGhlIGVuZCBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uLlxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsYXN0U2VnID0gdHJhaWwuZ2V0RWxlbWVudCh0cmFpbC5lbmQgLSAxKTtcclxuICAgICAgICBpZiAodGhpcy5fbmVlZFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQoX3RlbXBfdmVjMywgcC5wb3NpdGlvbiwgX3RlbXBfeGZvcm0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuY29weShfdGVtcF92ZWMzLCBwLnBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxhc3RTZWcpIHtcclxuICAgICAgICAgICAgdHJhaWwuaXRlcmF0ZUVsZW1lbnQodGhpcywgdGhpcy5fdXBkYXRlVHJhaWxFbGVtZW50LCBwLCBzY2FsZWREdCk7XHJcbiAgICAgICAgICAgIGlmIChWZWMzLnNxdWFyZWREaXN0YW5jZShsYXN0U2VnLnBvc2l0aW9uLCBfdGVtcF92ZWMzKSA8IHRoaXMuX21pblNxdWFyZWREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhc3RTZWcgPSB0cmFpbC5hZGRFbGVtZW50KCk7XHJcbiAgICAgICAgaWYgKCFsYXN0U2VnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVmVjMy5jb3B5KGxhc3RTZWcucG9zaXRpb24sIF90ZW1wX3ZlYzMpO1xyXG4gICAgICAgIGxhc3RTZWcubGlmZXRpbWUgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLndpZHRoRnJvbVBhcnRpY2xlKSB7XHJcbiAgICAgICAgICAgIGxhc3RTZWcud2lkdGggPSBwLnNpemUueCAqIHRoaXMud2lkdGhSYXRpby5ldmFsdWF0ZSgwLCAxKSE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGFzdFNlZy53aWR0aCA9IHRoaXMud2lkdGhSYXRpby5ldmFsdWF0ZSgwLCAxKSE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRyYWlsTnVtID0gdHJhaWwuY291bnQoKTtcclxuICAgICAgICBpZiAodHJhaWxOdW0gPT09IDIpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdFNlY29uZFRyYWlsID0gdHJhaWwuZ2V0RWxlbWVudCh0cmFpbC5lbmQgLSAyKSE7XHJcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QobGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5LCBsYXN0U2VnLnBvc2l0aW9uLCBsYXN0U2Vjb25kVHJhaWwucG9zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHJhaWxOdW0gPiAyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RTZWNvbmRUcmFpbCA9IHRyYWlsLmdldEVsZW1lbnQodHJhaWwuZW5kIC0gMikhO1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0VGhpcmRUcmFpbCA9IHRyYWlsLmdldEVsZW1lbnQodHJhaWwuZW5kIC0gMykhO1xyXG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX3ZlYzMsIGxhc3RUaGlyZFRyYWlsLnBvc2l0aW9uLCBsYXN0U2Vjb25kVHJhaWwucG9zaXRpb24pO1xyXG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX3ZlYzNfMSwgbGFzdFNlZy5wb3NpdGlvbiwgbGFzdFNlY29uZFRyYWlsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHksIF90ZW1wX3ZlYzNfMSwgX3RlbXBfdmVjMyk7XHJcbiAgICAgICAgICAgIGlmIChWZWMzLmVxdWFscyhWZWMzLlpFUk8sIGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eSkpIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuY29weShsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHksIF90ZW1wX3ZlYzMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eSwgbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tEaXJlY3Rpb25SZXZlcnNlKGxhc3RTZWNvbmRUcmFpbCwgbGFzdFRoaXJkVHJhaWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb2xvckZyb21QYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICBsYXN0U2VnLmNvbG9yLnNldChwLmNvbG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsYXN0U2VnLmNvbG9yLnNldCh0aGlzLmNvbG9yT3ZlcnRpbWUuZXZhbHVhdGUoMCwgMSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlUGFydGljbGUgKHA6IFBhcnRpY2xlKSB7XHJcbiAgICAgICAgY29uc3QgdHJhaWwgPSB0aGlzLl9wYXJ0aWNsZVRyYWlsLmdldChwKTtcclxuICAgICAgICBpZiAodHJhaWwgJiYgdGhpcy5fdHJhaWxTZWdtZW50cykge1xyXG4gICAgICAgICAgICB0cmFpbC5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFpbFNlZ21lbnRzLmZyZWUodHJhaWwpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVRyYWlsLmRlbGV0ZShwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVJlbmRlckRhdGEgKCkge1xyXG4gICAgICAgIHRoaXMudmJPZmZzZXQgPSAwO1xyXG4gICAgICAgIHRoaXMuaWJPZmZzZXQgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLl9wYXJ0aWNsZVRyYWlsLmtleXMoKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFpbFNlZyA9IHRoaXMuX3BhcnRpY2xlVHJhaWwuZ2V0KHApITtcclxuICAgICAgICAgICAgaWYgKHRyYWlsU2VnLnN0YXJ0ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW5kZXhPZmZzZXQgPSB0aGlzLnZiT2Zmc2V0ICogNCAvIHRoaXMuX3ZlcnRTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSB0cmFpbFNlZy5zdGFydCA+PSB0cmFpbFNlZy5lbmQgPyB0cmFpbFNlZy5lbmQgKyB0cmFpbFNlZy50cmFpbEVsZW1lbnRzLmxlbmd0aCA6IHRyYWlsU2VnLmVuZDtcclxuICAgICAgICAgICAgY29uc3QgdHJhaWxOdW0gPSBlbmQgLSB0cmFpbFNlZy5zdGFydDtcclxuICAgICAgICAgICAgLy8gY29uc3QgbGFzdFNlZ1JhdGlvID0gdmVjMy5kaXN0YW5jZSh0cmFpbFNlZy5nZXRUYWlsRWxlbWVudCgpIS5wb3NpdGlvbiwgcC5wb3NpdGlvbikgLyB0aGlzLl9taW5QYXJ0aWNsZURpc3RhbmNlO1xyXG4gICAgICAgICAgICBjb25zdCB0ZXh0Q29vcmRTZWcgPSAxIC8gKHRyYWlsTnVtIC8qLSAxICsgbGFzdFNlZ1JhdGlvKi8pO1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydFNlZ0VsZSA9IHRyYWlsU2VnLnRyYWlsRWxlbWVudHNbdHJhaWxTZWcuc3RhcnRdO1xyXG4gICAgICAgICAgICB0aGlzLl9maWxsVmVydGV4QnVmZmVyKHN0YXJ0U2VnRWxlLCB0aGlzLmNvbG9yT3ZlclRyYWlsLmV2YWx1YXRlKDEsIDEpLCBpbmRleE9mZnNldCwgMSwgMCwgTkVYVF9UUklBTkdMRV9JTkRFWCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSB0cmFpbFNlZy5zdGFydCArIDE7IGkgPCBlbmQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnRWxlID0gdHJhaWxTZWcudHJhaWxFbGVtZW50c1tpICUgdHJhaWxTZWcudHJhaWxFbGVtZW50cy5sZW5ndGhdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaiA9IGkgLSB0cmFpbFNlZy5zdGFydDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGxWZXJ0ZXhCdWZmZXIoc2VnRWxlLCB0aGlzLmNvbG9yT3ZlclRyYWlsLmV2YWx1YXRlKDEgLSBqIC8gdHJhaWxOdW0sIDEpLCBpbmRleE9mZnNldCwgMSAtIGogKiB0ZXh0Q29vcmRTZWcsIGosIFBSRV9UUklBTkdMRV9JTkRFWCB8IE5FWFRfVFJJQU5HTEVfSU5ERVgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9uZWVkVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQoX3RlbXBfdHJhaWxFbGUucG9zaXRpb24sIHAucG9zaXRpb24sIF90ZW1wX3hmb3JtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuY29weShfdGVtcF90cmFpbEVsZS5wb3NpdGlvbiwgcC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYWlsTnVtID09PSAxIHx8IHRyYWlsTnVtID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0U2Vjb25kVHJhaWwgPSB0cmFpbFNlZy5nZXRFbGVtZW50KHRyYWlsU2VnLmVuZCAtIDEpITtcclxuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QobGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5LCBfdGVtcF90cmFpbEVsZS5wb3NpdGlvbiwgbGFzdFNlY29uZFRyYWlsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0IC0gdGhpcy5fdmVydFNpemUgLyA0IC0gNF0gPSBsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHkueDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0IC0gdGhpcy5fdmVydFNpemUgLyA0IC0gM10gPSBsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHkueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0IC0gdGhpcy5fdmVydFNpemUgLyA0IC0gMl0gPSBsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHkuejtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0IC0gNF0gPSBsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHkueDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0IC0gM10gPSBsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHkueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0IC0gMl0gPSBsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHkuejtcclxuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoX3RlbXBfdHJhaWxFbGUudmVsb2NpdHksIF90ZW1wX3RyYWlsRWxlLnBvc2l0aW9uLCBsYXN0U2Vjb25kVHJhaWwucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tEaXJlY3Rpb25SZXZlcnNlKF90ZW1wX3RyYWlsRWxlLCBsYXN0U2Vjb25kVHJhaWwpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyYWlsTnVtID4gMikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFNlY29uZFRyYWlsID0gdHJhaWxTZWcuZ2V0RWxlbWVudCh0cmFpbFNlZy5lbmQgLSAxKSE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VGhpcmRUcmFpbCA9IHRyYWlsU2VnLmdldEVsZW1lbnQodHJhaWxTZWcuZW5kIC0gMikhO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChfdGVtcF92ZWMzLCBsYXN0VGhpcmRUcmFpbC5wb3NpdGlvbiwgbGFzdFNlY29uZFRyYWlsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoX3RlbXBfdmVjM18xLCBfdGVtcF90cmFpbEVsZS5wb3NpdGlvbiwgbGFzdFNlY29uZFRyYWlsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKF90ZW1wX3ZlYzMsIF90ZW1wX3ZlYzMpO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoX3RlbXBfdmVjM18xLCBfdGVtcF92ZWMzXzEpO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHksIF90ZW1wX3ZlYzNfMSwgX3RlbXBfdmVjMyk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHksIGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jaGVja0RpcmVjdGlvblJldmVyc2UobGFzdFNlY29uZFRyYWlsLCBsYXN0VGhpcmRUcmFpbCk7XHJcbiAgICAgICAgICAgICAgICAvLyByZWZyZXNoIGxhc3QgdHJhaWwgc2VnbWVudCBkYXRhXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZiT2Zmc2V0IC09IHRoaXMuX3ZlcnRTaXplIC8gNCAqIDI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmliT2Zmc2V0IC09IDY7XHJcbiAgICAgICAgICAgICAgICAvLyBfYmNJZHggPSAoX2JjSWR4IC0gNiArIDkpICUgOTsgIC8vIDx3aXJlZnJhbWUgZGVidWc+XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxsVmVydGV4QnVmZmVyKGxhc3RTZWNvbmRUcmFpbCwgdGhpcy5jb2xvck92ZXJUcmFpbC5ldmFsdWF0ZSh0ZXh0Q29vcmRTZWcsIDEpLCBpbmRleE9mZnNldCwgdGV4dENvb3JkU2VnLCB0cmFpbE51bSAtIDEsIFBSRV9UUklBTkdMRV9JTkRFWCB8IE5FWFRfVFJJQU5HTEVfSU5ERVgpO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChfdGVtcF90cmFpbEVsZS52ZWxvY2l0eSwgX3RlbXBfdHJhaWxFbGUucG9zaXRpb24sIGxhc3RTZWNvbmRUcmFpbC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShfdGVtcF90cmFpbEVsZS52ZWxvY2l0eSwgX3RlbXBfdHJhaWxFbGUudmVsb2NpdHkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tEaXJlY3Rpb25SZXZlcnNlKF90ZW1wX3RyYWlsRWxlLCBsYXN0U2Vjb25kVHJhaWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoRnJvbVBhcnRpY2xlKSB7XHJcbiAgICAgICAgICAgICAgICBfdGVtcF90cmFpbEVsZS53aWR0aCA9IHAuc2l6ZS54ICogdGhpcy53aWR0aFJhdGlvLmV2YWx1YXRlKDAsIDEpITtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF90ZW1wX3RyYWlsRWxlLndpZHRoID0gdGhpcy53aWR0aFJhdGlvLmV2YWx1YXRlKDAsIDEpITtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGVtcF90cmFpbEVsZS5jb2xvciA9IHAuY29sb3I7XHJcblxyXG4gICAgICAgICAgICBpZiAoVmVjMy5lcXVhbHMoX3RlbXBfdHJhaWxFbGUudmVsb2NpdHksIFZlYzMuWkVSTykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWJPZmZzZXQgLT0gMztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGxWZXJ0ZXhCdWZmZXIoX3RlbXBfdHJhaWxFbGUsIHRoaXMuY29sb3JPdmVyVHJhaWwuZXZhbHVhdGUoMCwgMSksIGluZGV4T2Zmc2V0LCAwLCB0cmFpbE51bSwgUFJFX1RSSUFOR0xFX0lOREVYKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUlBKHRoaXMuaWJPZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVJQSAoY291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IHRoaXMuX3RyYWlsTW9kZWwgJiYgdGhpcy5fdHJhaWxNb2RlbC5zdWJNb2RlbHM7XHJcbiAgICAgICAgaWYgKHN1Yk1vZGVscyAmJiBzdWJNb2RlbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJNb2RlbCA9IHN1Yk1vZGVsc1swXTtcclxuICAgICAgICAgICAgc3ViTW9kZWwuaW5wdXRBc3NlbWJsZXIhLnZlcnRleEJ1ZmZlcnNbMF0udXBkYXRlKHRoaXMuX3ZiRjMyISk7XHJcbiAgICAgICAgICAgIHN1Yk1vZGVsLmlucHV0QXNzZW1ibGVyIS5pbmRleEJ1ZmZlciEudXBkYXRlKHRoaXMuX2lCdWZmZXIhKTtcclxuICAgICAgICAgICAgdGhpcy5faWFJbmZvLmRyYXdJbmZvc1swXS5maXJzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgdGhpcy5faWFJbmZvLmRyYXdJbmZvc1swXS5pbmRleENvdW50ID0gY291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2lhSW5mb0J1ZmZlciEudXBkYXRlKHRoaXMuX2lhSW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZU1vZGVsICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHJhaWxNb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl90cmFpbE1vZGVsID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5jcmVhdGVNb2RlbChzY2VuZS5Nb2RlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWJ1aWxkICgpIHtcclxuICAgICAgICBjb25zdCBkZXZpY2U6IEdGWERldmljZSA9IGRpcmVjdG9yLnJvb3QhLmRldmljZTtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5WRVJURVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplICogKHRoaXMuX3RyYWlsTnVtICsgMSkgKiAyLFxyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZSxcclxuICAgICAgICApKTtcclxuICAgICAgICBjb25zdCB2QnVmZmVyOiBBcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLl92ZXJ0U2l6ZSAqICh0aGlzLl90cmFpbE51bSArIDEpICogMik7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIgPSBuZXcgRmxvYXQzMkFycmF5KHZCdWZmZXIpO1xyXG4gICAgICAgIHRoaXMuX3ZiVWludDMyID0gbmV3IFVpbnQzMkFycmF5KHZCdWZmZXIpO1xyXG4gICAgICAgIHZlcnRleEJ1ZmZlci51cGRhdGUodkJ1ZmZlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4QnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ERVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIHRoaXMuX3RyYWlsTnVtICogNiAqIFVpbnQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULFxyXG4gICAgICAgICAgICBVaW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCxcclxuICAgICAgICApKTtcclxuICAgICAgICB0aGlzLl9pQnVmZmVyID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuX3RyYWlsTnVtICogNik7XHJcbiAgICAgICAgaW5kZXhCdWZmZXIudXBkYXRlKHRoaXMuX2lCdWZmZXIpO1xyXG5cclxuICAgICAgICB0aGlzLl9pYUluZm9CdWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgR0ZYX0RSQVdfSU5GT19TSVpFLFxyXG4gICAgICAgICAgICBHRlhfRFJBV19JTkZPX1NJWkUsXHJcbiAgICAgICAgKSk7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvLmRyYXdJbmZvc1swXS52ZXJ0ZXhDb3VudCA9ICh0aGlzLl90cmFpbE51bSArIDEpICogMjtcclxuICAgICAgICB0aGlzLl9pYUluZm8uZHJhd0luZm9zWzBdLmluZGV4Q291bnQgPSB0aGlzLl90cmFpbE51bSAqIDY7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvQnVmZmVyLnVwZGF0ZSh0aGlzLl9pYUluZm8pO1xyXG5cclxuICAgICAgICB0aGlzLl9zdWJNZXNoRGF0YSA9IG5ldyBSZW5kZXJpbmdTdWJNZXNoKFt2ZXJ0ZXhCdWZmZXJdLCB0aGlzLl92ZXJ0QXR0cnMhLCBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX0xJU1QsIGluZGV4QnVmZmVyLCB0aGlzLl9pYUluZm9CdWZmZXIpO1xyXG5cclxuICAgICAgICBjb25zdCB0cmFpbE1vZGVsID0gdGhpcy5fdHJhaWxNb2RlbDtcclxuICAgICAgICBpZiAodHJhaWxNb2RlbCkge1xyXG4gICAgICAgICAgICB0cmFpbE1vZGVsLm5vZGUgPSB0cmFpbE1vZGVsLnRyYW5zZm9ybSA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLm5vZGU7XHJcbiAgICAgICAgICAgIHRyYWlsTW9kZWwudmlzRmxhZ3MgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS52aXNpYmlsaXR5O1xyXG4gICAgICAgICAgICB0cmFpbE1vZGVsLmluaXRTdWJNb2RlbCgwLCB0aGlzLl9zdWJNZXNoRGF0YSwgdGhpcy5fbWF0ZXJpYWwhKTtcclxuICAgICAgICAgICAgdHJhaWxNb2RlbC5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlVHJhaWxFbGVtZW50IChtb2R1bGU6IGFueSwgdHJhaWxFbGU6IElUcmFpbEVsZW1lbnQsIHA6IFBhcnRpY2xlLCBkdDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJhaWxFbGUubGlmZXRpbWUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKG1vZHVsZS5jb2xvckZyb21QYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICB0cmFpbEVsZS5jb2xvci5zZXQocC5jb2xvcik7XHJcbiAgICAgICAgICAgIHRyYWlsRWxlLmNvbG9yLm11bHRpcGx5KG1vZHVsZS5jb2xvck92ZXJ0aW1lLmV2YWx1YXRlKDEuMCAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWUsIDEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cmFpbEVsZS5jb2xvci5zZXQobW9kdWxlLmNvbG9yT3ZlcnRpbWUuZXZhbHVhdGUoMS4wIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZSwgMSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kdWxlLndpZHRoRnJvbVBhcnRpY2xlKSB7XHJcbiAgICAgICAgICAgIHRyYWlsRWxlLndpZHRoID0gcC5zaXplLnggKiBtb2R1bGUud2lkdGhSYXRpby5ldmFsdWF0ZSh0cmFpbEVsZS5saWZldGltZSAvIG1vZHVsZS5fdHJhaWxMaWZldGltZSwgMSkhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyYWlsRWxlLndpZHRoID0gbW9kdWxlLndpZHRoUmF0aW8uZXZhbHVhdGUodHJhaWxFbGUubGlmZXRpbWUgLyBtb2R1bGUuX3RyYWlsTGlmZXRpbWUsIDEpITtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyYWlsRWxlLmxpZmV0aW1lID4gbW9kdWxlLl90cmFpbExpZmV0aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZpbGxWZXJ0ZXhCdWZmZXIgKHRyYWlsU2VnOiBJVHJhaWxFbGVtZW50LCBjb2xvck1vZGlmZXI6IENvbG9yLCBpbmRleE9mZnNldDogbnVtYmVyLCB4VGV4Q29vcmQ6IG51bWJlciwgdHJhaWxFbGVJZHg6IG51bWJlciwgaW5kZXhTZXQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy5wb3NpdGlvbi56O1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcuZGlyZWN0aW9uO1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSB4VGV4Q29vcmQ7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSAwO1xyXG4gICAgICAgIC8vIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gYmFyeWNlbnRyaWNbX2JjSWR4KytdOyAgLy8gPHdpcmVmcmFtZSBkZWJ1Zz5cclxuICAgICAgICAvLyB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IGJhcnljZW50cmljW19iY0lkeCsrXTtcclxuICAgICAgICAvLyB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IGJhcnljZW50cmljW19iY0lkeCsrXTtcclxuICAgICAgICAvLyBfYmNJZHggJT0gOTtcclxuICAgICAgICB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnZlbG9jaXR5Lng7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy52ZWxvY2l0eS55O1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcudmVsb2NpdHkuejtcclxuICAgICAgICBfdGVtcF9jb2xvci5zZXQodHJhaWxTZWcuY29sb3IpO1xyXG4gICAgICAgIF90ZW1wX2NvbG9yLm11bHRpcGx5KGNvbG9yTW9kaWZlcik7XHJcbiAgICAgICAgdGhpcy5fdmJVaW50MzIhW3RoaXMudmJPZmZzZXQrK10gPSBfdGVtcF9jb2xvci5fdmFsO1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcucG9zaXRpb24ueDtcclxuICAgICAgICB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy5wb3NpdGlvbi56O1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gMSAtIHRyYWlsU2VnLmRpcmVjdGlvbjtcclxuICAgICAgICB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0geFRleENvb3JkO1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gMTtcclxuICAgICAgICAvLyB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IGJhcnljZW50cmljW19iY0lkeCsrXTsgIC8vIDx3aXJlZnJhbWUgZGVidWc+XHJcbiAgICAgICAgLy8gdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSBiYXJ5Y2VudHJpY1tfYmNJZHgrK107XHJcbiAgICAgICAgLy8gdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSBiYXJ5Y2VudHJpY1tfYmNJZHgrK107XHJcbiAgICAgICAgLy8gX2JjSWR4ICU9IDk7XHJcbiAgICAgICAgdGhpcy5fdmJGMzIhW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy52ZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMuX3ZiRjMyIVt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcudmVsb2NpdHkueTtcclxuICAgICAgICB0aGlzLl92YkYzMiFbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnZlbG9jaXR5Lno7XHJcbiAgICAgICAgdGhpcy5fdmJVaW50MzIhW3RoaXMudmJPZmZzZXQrK10gPSBfdGVtcF9jb2xvci5fdmFsO1xyXG4gICAgICAgIGlmIChpbmRleFNldCAmIFBSRV9UUklBTkdMRV9JTkRFWCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pQnVmZmVyIVt0aGlzLmliT2Zmc2V0KytdID0gaW5kZXhPZmZzZXQgKyAyICogdHJhaWxFbGVJZHg7XHJcbiAgICAgICAgICAgIHRoaXMuX2lCdWZmZXIhW3RoaXMuaWJPZmZzZXQrK10gPSBpbmRleE9mZnNldCArIDIgKiB0cmFpbEVsZUlkeCAtIDE7XHJcbiAgICAgICAgICAgIHRoaXMuX2lCdWZmZXIhW3RoaXMuaWJPZmZzZXQrK10gPSBpbmRleE9mZnNldCArIDIgKiB0cmFpbEVsZUlkeCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleFNldCAmIE5FWFRfVFJJQU5HTEVfSU5ERVgpIHtcclxuICAgICAgICAgICAgdGhpcy5faUJ1ZmZlciFbdGhpcy5pYk9mZnNldCsrXSA9IGluZGV4T2Zmc2V0ICsgMiAqIHRyYWlsRWxlSWR4O1xyXG4gICAgICAgICAgICB0aGlzLl9pQnVmZmVyIVt0aGlzLmliT2Zmc2V0KytdID0gaW5kZXhPZmZzZXQgKyAyICogdHJhaWxFbGVJZHggKyAxO1xyXG4gICAgICAgICAgICB0aGlzLl9pQnVmZmVyIVt0aGlzLmliT2Zmc2V0KytdID0gaW5kZXhPZmZzZXQgKyAyICogdHJhaWxFbGVJZHggKyAyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jaGVja0RpcmVjdGlvblJldmVyc2UgKGN1cnJFbGVtZW50OiBJVHJhaWxFbGVtZW50LCBwcmV2RWxlbWVudDogSVRyYWlsRWxlbWVudCkge1xyXG4gICAgICAgIGlmIChWZWMzLmRvdChjdXJyRWxlbWVudC52ZWxvY2l0eSwgcHJldkVsZW1lbnQudmVsb2NpdHkpIDwgRElSRUNUSU9OX1RIUkVTSE9MRCkge1xyXG4gICAgICAgICAgICBjdXJyRWxlbWVudC5kaXJlY3Rpb24gPSAxIC0gcHJldkVsZW1lbnQuZGlyZWN0aW9uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJFbGVtZW50LmRpcmVjdGlvbiA9IHByZXZFbGVtZW50LmRpcmVjdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXN0cm95U3ViTWVzaERhdGEgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zdWJNZXNoRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJNZXNoRGF0YS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1Yk1lc2hEYXRhID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPGRlYnVnIHVzZT5cclxuICAgIC8vIHByaXZhdGUgX3ByaW50VkIoKSB7XHJcbiAgICAvLyAgICAgbGV0IGxvZyA9IG5ldyBTdHJpbmcoKTtcclxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmJPZmZzZXQ7IGkrKykge1xyXG4gICAgLy8gICAgICAgICBsb2cgKz0gJ3BvczonICsgdGhpcy5fdmJGMzIhW2krK10udG9GaXhlZCgyKSArICcsJyArIHRoaXMuX3ZiRjMyIVtpKytdLnRvRml4ZWQoMikgKyAnLCcgKyB0aGlzLl92YkYzMiFbaSsrXS50b0ZpeGVkKDIpICsgJyBkaXI6JyArIHRoaXMuX3ZiRjMyIVtpKytdLnRvRml4ZWQoMCkgKyAnICc7XHJcbiAgICAvLyAgICAgICAgIGkgKz0gNjtcclxuICAgIC8vICAgICAgICAgbG9nICs9ICd2ZWw6JyArIHRoaXMuX3ZiRjMyIVtpKytdLnRvRml4ZWQoMikgKyAnLCcgKyB0aGlzLl92YkYzMiFbaSsrXS50b0ZpeGVkKDIpICsgJywnICsgdGhpcy5fdmJGMzIhW2krK10udG9GaXhlZCgyKSArICdcXG4nO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBpZiAobG9nLmxlbmd0aCA+IDApIHtcclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cobG9nKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbn1cclxuIl19