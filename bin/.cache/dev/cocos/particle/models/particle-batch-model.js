(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/mesh.js", "../../core/gfx/buffer.js", "../../core/gfx/define.js", "../../core/math/color.js", "../../core/renderer/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/mesh.js"), require("../../core/gfx/buffer.js"), require("../../core/gfx/define.js"), require("../../core/math/color.js"), require("../../core/renderer/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mesh, global.buffer, global.define, global.color, global.index);
    global.particleBatchModel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mesh, _buffer, _define, _color, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _uvs = [0, 0, // bottom-left
  1, 0, // bottom-right
  0, 1, // top-left
  1, 1 // top-right
  ];

  var ParticleBatchModel = /*#__PURE__*/function (_scene$Model) {
    _inherits(ParticleBatchModel, _scene$Model);

    function ParticleBatchModel() {
      var _this;

      _classCallCheck(this, ParticleBatchModel);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ParticleBatchModel).call(this));
      _this._capacity = void 0;
      _this._vertAttrs = void 0;
      _this._vertSize = void 0;
      _this._vBuffer = void 0;
      _this._vertAttrsFloatCount = void 0;
      _this._vdataF32 = void 0;
      _this._vdataUint32 = void 0;
      _this._iaInfo = void 0;
      _this._iaInfoBuffer = void 0;
      _this._subMeshData = void 0;
      _this._mesh = void 0;
      _this._vertCount = 0;
      _this._indexCount = 0;
      _this._startTimeOffset = 0;
      _this._lifeTimeOffset = 0;
      _this._iaInfoBufferReady = true;
      _this._material = null;
      _this.type = _index.scene.ModelType.PARTICLE_BATCH;
      _this._capacity = 0;
      _this._vertAttrs = null;
      _this._vertSize = 0;
      _this._vBuffer = null;
      _this._vertAttrsFloatCount = 0;
      _this._vdataF32 = null;
      _this._vdataUint32 = null;
      _this._iaInfo = new _buffer.GFXIndirectBuffer([new _buffer.GFXDrawInfo()]);
      _this._iaInfoBuffer = _this._device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDIRECT, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _buffer.GFX_DRAW_INFO_SIZE, _buffer.GFX_DRAW_INFO_SIZE));
      _this._subMeshData = null;
      _this._mesh = null;
      return _this;
    }

    _createClass(ParticleBatchModel, [{
      key: "setCapacity",
      value: function setCapacity(capacity) {
        var capChanged = this._capacity !== capacity;
        this._capacity = capacity;

        if (this._subMeshData && capChanged) {
          this.rebuild();
        }
      }
    }, {
      key: "setVertexAttributes",
      value: function setVertexAttributes(mesh, attrs) {
        if (this._mesh === mesh && this._vertAttrs === attrs) {
          return;
        }

        this._mesh = mesh;
        this._vertAttrs = attrs;
        this._vertSize = 0;

        var _iterator = _createForOfIteratorHelper(this._vertAttrs),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var a = _step.value;
            a.offset = this._vertSize;
            this._vertSize += _define.GFXFormatInfos[a.format].size;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._vertAttrsFloatCount = this._vertSize / 4; // number of float
        // rebuid

        this.rebuild();
      }
    }, {
      key: "createSubMeshData",
      value: function createSubMeshData() {
        this.destroySubMeshData();
        this._vertCount = 4;
        this._indexCount = 6;

        if (this._mesh) {
          this._vertCount = this._mesh.struct.vertexBundles[this._mesh.struct.primitives[0].vertexBundelIndices[0]].view.count;
          this._indexCount = this._mesh.struct.primitives[0].indexView.count;
        }

        var vertexBuffer = this._device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, this._vertSize * this._capacity * this._vertCount, this._vertSize));

        var vBuffer = new ArrayBuffer(this._vertSize * this._capacity * this._vertCount);

        if (this._mesh) {
          var vIdx = this._vertAttrs.findIndex(function (val) {
            return val.name === _define.GFXAttributeName.ATTR_TEX_COORD3;
          });

          var vOffset = this._vertAttrs[vIdx++].offset;

          this._mesh.copyAttribute(0, _define.GFXAttributeName.ATTR_POSITION, vBuffer, this._vertSize, vOffset); // copy mesh position to ATTR_TEX_COORD3


          vOffset = this._vertAttrs[vIdx++].offset;

          this._mesh.copyAttribute(0, _define.GFXAttributeName.ATTR_NORMAL, vBuffer, this._vertSize, vOffset); // copy mesh normal to ATTR_NORMAL


          vOffset = this._vertAttrs[this._vertAttrs.findIndex(function (val) {
            return val.name === _define.GFXAttributeName.ATTR_TEX_COORD;
          })].offset;

          this._mesh.copyAttribute(0, _define.GFXAttributeName.ATTR_TEX_COORD, vBuffer, this._vertSize, vOffset); // copy mesh uv to ATTR_TEX_COORD


          vOffset = this._vertAttrs[vIdx++].offset;

          if (!this._mesh.copyAttribute(0, _define.GFXAttributeName.ATTR_COLOR, vBuffer, this._vertSize, vOffset)) {
            // copy mesh color to ATTR_COLOR1
            var vb = new Uint32Array(vBuffer);

            for (var iVertex = 0; iVertex < this._vertCount; ++iVertex) {
              vb[iVertex * this._vertAttrsFloatCount + vOffset / 4] = _color.Color.WHITE._val;
            }
          }

          var vbFloatArray = new Float32Array(vBuffer);

          for (var i = 1; i < this._capacity; i++) {
            vbFloatArray.copyWithin(i * this._vertSize * this._vertCount / 4, 0, this._vertSize * this._vertCount / 4);
          }
        }

        vertexBuffer.update(vBuffer);
        var indices = new Uint16Array(this._capacity * this._indexCount);

        if (this._mesh) {
          this._mesh.copyIndices(0, indices);

          for (var _i = 1; _i < this._capacity; _i++) {
            for (var j = 0; j < this._indexCount; j++) {
              indices[_i * this._indexCount + j] = indices[j] + _i * this._vertCount;
            }
          }
        } else {
          var dst = 0;

          for (var _i2 = 0; _i2 < this._capacity; ++_i2) {
            var baseIdx = 4 * _i2;
            indices[dst++] = baseIdx;
            indices[dst++] = baseIdx + 1;
            indices[dst++] = baseIdx + 2;
            indices[dst++] = baseIdx + 3;
            indices[dst++] = baseIdx + 2;
            indices[dst++] = baseIdx + 1;
          }
        }

        var indexBuffer = this._device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, this._capacity * this._indexCount * Uint16Array.BYTES_PER_ELEMENT, Uint16Array.BYTES_PER_ELEMENT));

        indexBuffer.update(indices);
        this._iaInfo.drawInfos[0].vertexCount = this._capacity * this._vertCount;
        this._iaInfo.drawInfos[0].indexCount = this._capacity * this._indexCount;

        if (!this._iaInfoBufferReady) {
          this._iaInfoBuffer.initialize(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDIRECT, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _buffer.GFX_DRAW_INFO_SIZE, _buffer.GFX_DRAW_INFO_SIZE));

          this._iaInfoBufferReady = true;
        }

        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = new _mesh.RenderingSubMesh([vertexBuffer], this._vertAttrs, _define.GFXPrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        this.initSubModel(0, this._subMeshData, this._material);
        return vBuffer;
      }
    }, {
      key: "updateMaterial",
      value: function updateMaterial(mat) {
        this._material = mat;
        this.setSubModelMaterial(0, mat);
      }
    }, {
      key: "addParticleVertexData",
      value: function addParticleVertexData(index, pvdata) {
        if (!this._mesh) {
          var offset = index * this._vertAttrsFloatCount;
          this._vdataF32[offset++] = pvdata[0].x; // position

          this._vdataF32[offset++] = pvdata[0].y;
          this._vdataF32[offset++] = pvdata[0].z;
          this._vdataF32[offset++] = pvdata[1].x; // uv

          this._vdataF32[offset++] = pvdata[1].y;
          this._vdataF32[offset++] = pvdata[1].z; // frame idx

          this._vdataF32[offset++] = pvdata[2].x; // size

          this._vdataF32[offset++] = pvdata[2].y;
          this._vdataF32[offset++] = pvdata[2].z;
          this._vdataF32[offset++] = pvdata[3].x; // rotation

          this._vdataF32[offset++] = pvdata[3].y;
          this._vdataF32[offset++] = pvdata[3].z;
          this._vdataUint32[offset++] = pvdata[4]; // color

          if (pvdata[5]) {
            this._vdataF32[offset++] = pvdata[5].x; // velocity

            this._vdataF32[offset++] = pvdata[5].y;
            this._vdataF32[offset++] = pvdata[5].z;
          }
        } else {
          for (var i = 0; i < this._vertCount; i++) {
            var _offset = (index * this._vertCount + i) * this._vertAttrsFloatCount;

            this._vdataF32[_offset++] = pvdata[0].x; // position

            this._vdataF32[_offset++] = pvdata[0].y;
            this._vdataF32[_offset++] = pvdata[0].z;
            _offset += 2; // this._vdataF32![offset++] = index;
            // this._vdataF32![offset++] = pvdata[1].y;

            this._vdataF32[_offset++] = pvdata[1].z; // frame idx

            this._vdataF32[_offset++] = pvdata[2].x; // size

            this._vdataF32[_offset++] = pvdata[2].y;
            this._vdataF32[_offset++] = pvdata[2].z;
            this._vdataF32[_offset++] = pvdata[3].x; // rotation

            this._vdataF32[_offset++] = pvdata[3].y;
            this._vdataF32[_offset++] = pvdata[3].z;
            this._vdataUint32[_offset++] = pvdata[4]; // color
          }
        }
      }
    }, {
      key: "addGPUParticleVertexData",
      value: function addGPUParticleVertexData(p, num, time) {
        var offset = num * this._vertAttrsFloatCount * this._vertCount;

        for (var i = 0; i < this._vertCount; i++) {
          var idx = offset;
          this._vdataF32[idx++] = p.position.x;
          this._vdataF32[idx++] = p.position.y;
          this._vdataF32[idx++] = p.position.z;
          this._vdataF32[idx++] = time;
          this._vdataF32[idx++] = p.startSize.x;
          this._vdataF32[idx++] = p.startSize.y;
          this._vdataF32[idx++] = p.startSize.z;
          this._vdataF32[idx++] = _uvs[2 * i];
          this._vdataF32[idx++] = p.rotation.x;
          this._vdataF32[idx++] = p.rotation.y;
          this._vdataF32[idx++] = p.rotation.z;
          this._vdataF32[idx++] = _uvs[2 * i + 1];
          this._vdataF32[idx++] = p.startColor.r / 255.0;
          this._vdataF32[idx++] = p.startColor.g / 255.0;
          this._vdataF32[idx++] = p.startColor.b / 255.0;
          this._vdataF32[idx++] = p.startColor.a / 255.0;
          this._vdataF32[idx++] = p.velocity.x;
          this._vdataF32[idx++] = p.velocity.y;
          this._vdataF32[idx++] = p.velocity.z;
          this._vdataF32[idx++] = p.startLifetime;
          this._vdataF32[idx++] = p.randomSeed;
          offset += this._vertAttrsFloatCount;
        }
      }
    }, {
      key: "updateGPUParticles",
      value: function updateGPUParticles(num, time, dt) {
        var pSize = this._vertAttrsFloatCount * this._vertCount;
        var pBaseIndex = 0;
        var startTime = 0;
        var lifeTime = 0;
        var lastBaseIndex = 0;
        var interval = 0;

        for (var i = 0; i < num; ++i) {
          pBaseIndex = i * pSize;
          startTime = this._vdataF32[pBaseIndex + this._startTimeOffset];
          lifeTime = this._vdataF32[pBaseIndex + this._lifeTimeOffset];
          interval = time - startTime;

          if (lifeTime - interval < dt) {
            lastBaseIndex = --num * pSize;

            this._vdataF32.copyWithin(pBaseIndex, lastBaseIndex, lastBaseIndex + pSize);

            i--;
          }
        }

        return num;
      }
    }, {
      key: "constructAttributeIndex",
      value: function constructAttributeIndex() {
        if (!this._vertAttrs) {
          return;
        }

        var vIdx = this._vertAttrs.findIndex(function (val) {
          return val.name === 'a_position_starttime';
        });

        var vOffset = this._vertAttrs[vIdx].offset;
        this._startTimeOffset = vOffset / 4 + 3;
        vIdx = this._vertAttrs.findIndex(function (val) {
          return val.name === 'a_dir_life';
        });
        vOffset = this._vertAttrs[vIdx].offset;
        this._lifeTimeOffset = vOffset / 4 + 3;
      }
    }, {
      key: "updateIA",
      value: function updateIA(count) {
        var ia = this._subModels[0].inputAssembler;
        ia.vertexBuffers[0].update(this._vdataF32);
        this._iaInfo.drawInfos[0].firstIndex = 0;
        this._iaInfo.drawInfos[0].indexCount = this._indexCount * count;

        this._iaInfoBuffer.update(this._iaInfo);
      }
    }, {
      key: "clear",
      value: function clear() {
        this._subModels[0].inputAssembler.indexCount = 0;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(ParticleBatchModel.prototype), "destroy", this).call(this);

        this._vBuffer = null;
        this._vdataF32 = null;
        this.destroySubMeshData();

        this._iaInfoBuffer.destroy();
      }
    }, {
      key: "rebuild",
      value: function rebuild() {
        this._vBuffer = this.createSubMeshData();
        this._vdataF32 = new Float32Array(this._vBuffer);
        this._vdataUint32 = new Uint32Array(this._vBuffer);
      }
    }, {
      key: "destroySubMeshData",
      value: function destroySubMeshData() {
        if (this._subMeshData) {
          this._subMeshData.destroy();

          this._subMeshData = null;
          this._iaInfoBufferReady = false;
        }
      }
    }]);

    return ParticleBatchModel;
  }(_index.scene.Model);

  _exports.default = ParticleBatchModel;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL21vZGVscy9wYXJ0aWNsZS1iYXRjaC1tb2RlbC50cyJdLCJuYW1lcyI6WyJfdXZzIiwiUGFydGljbGVCYXRjaE1vZGVsIiwiX2NhcGFjaXR5IiwiX3ZlcnRBdHRycyIsIl92ZXJ0U2l6ZSIsIl92QnVmZmVyIiwiX3ZlcnRBdHRyc0Zsb2F0Q291bnQiLCJfdmRhdGFGMzIiLCJfdmRhdGFVaW50MzIiLCJfaWFJbmZvIiwiX2lhSW5mb0J1ZmZlciIsIl9zdWJNZXNoRGF0YSIsIl9tZXNoIiwiX3ZlcnRDb3VudCIsIl9pbmRleENvdW50IiwiX3N0YXJ0VGltZU9mZnNldCIsIl9saWZlVGltZU9mZnNldCIsIl9pYUluZm9CdWZmZXJSZWFkeSIsIl9tYXRlcmlhbCIsInR5cGUiLCJzY2VuZSIsIk1vZGVsVHlwZSIsIlBBUlRJQ0xFX0JBVENIIiwiR0ZYSW5kaXJlY3RCdWZmZXIiLCJHRlhEcmF3SW5mbyIsIl9kZXZpY2UiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJJTkRJUkVDVCIsIkdGWE1lbW9yeVVzYWdlQml0IiwiSE9TVCIsIkRFVklDRSIsIkdGWF9EUkFXX0lORk9fU0laRSIsImNhcGFjaXR5IiwiY2FwQ2hhbmdlZCIsInJlYnVpbGQiLCJtZXNoIiwiYXR0cnMiLCJhIiwib2Zmc2V0IiwiR0ZYRm9ybWF0SW5mb3MiLCJmb3JtYXQiLCJzaXplIiwiZGVzdHJveVN1Yk1lc2hEYXRhIiwic3RydWN0IiwidmVydGV4QnVuZGxlcyIsInByaW1pdGl2ZXMiLCJ2ZXJ0ZXhCdW5kZWxJbmRpY2VzIiwidmlldyIsImNvdW50IiwiaW5kZXhWaWV3IiwidmVydGV4QnVmZmVyIiwiVkVSVEVYIiwiVFJBTlNGRVJfRFNUIiwidkJ1ZmZlciIsIkFycmF5QnVmZmVyIiwidklkeCIsImZpbmRJbmRleCIsInZhbCIsIm5hbWUiLCJHRlhBdHRyaWJ1dGVOYW1lIiwiQVRUUl9URVhfQ09PUkQzIiwidk9mZnNldCIsImNvcHlBdHRyaWJ1dGUiLCJBVFRSX1BPU0lUSU9OIiwiQVRUUl9OT1JNQUwiLCJBVFRSX1RFWF9DT09SRCIsIkFUVFJfQ09MT1IiLCJ2YiIsIlVpbnQzMkFycmF5IiwiaVZlcnRleCIsIkNvbG9yIiwiV0hJVEUiLCJfdmFsIiwidmJGbG9hdEFycmF5IiwiRmxvYXQzMkFycmF5IiwiaSIsImNvcHlXaXRoaW4iLCJ1cGRhdGUiLCJpbmRpY2VzIiwiVWludDE2QXJyYXkiLCJjb3B5SW5kaWNlcyIsImoiLCJkc3QiLCJiYXNlSWR4IiwiaW5kZXhCdWZmZXIiLCJJTkRFWCIsIkJZVEVTX1BFUl9FTEVNRU5UIiwiZHJhd0luZm9zIiwidmVydGV4Q291bnQiLCJpbmRleENvdW50IiwiaW5pdGlhbGl6ZSIsIlJlbmRlcmluZ1N1Yk1lc2giLCJHRlhQcmltaXRpdmVNb2RlIiwiVFJJQU5HTEVfTElTVCIsImluaXRTdWJNb2RlbCIsIm1hdCIsInNldFN1Yk1vZGVsTWF0ZXJpYWwiLCJpbmRleCIsInB2ZGF0YSIsIngiLCJ5IiwieiIsInAiLCJudW0iLCJ0aW1lIiwiaWR4IiwicG9zaXRpb24iLCJzdGFydFNpemUiLCJyb3RhdGlvbiIsInN0YXJ0Q29sb3IiLCJyIiwiZyIsImIiLCJ2ZWxvY2l0eSIsInN0YXJ0TGlmZXRpbWUiLCJyYW5kb21TZWVkIiwiZHQiLCJwU2l6ZSIsInBCYXNlSW5kZXgiLCJzdGFydFRpbWUiLCJsaWZlVGltZSIsImxhc3RCYXNlSW5kZXgiLCJpbnRlcnZhbCIsImlhIiwiX3N1Yk1vZGVscyIsImlucHV0QXNzZW1ibGVyIiwidmVydGV4QnVmZmVycyIsImZpcnN0SW5kZXgiLCJkZXN0cm95IiwiY3JlYXRlU3ViTWVzaERhdGEiLCJNb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNBLE1BQU1BLElBQUksR0FBRyxDQUNULENBRFMsRUFDTixDQURNLEVB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QW9CLElBQXBCO0FBQ0EsZUFBS00sa0JBQUwsR0FBMEIsS0FBMUI7QUFDSDtBQUNKOzs7O0lBM1MyQ0csYUFBTWdILEsiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFJlbmRlcmluZ1N1Yk1lc2gsIE1lc2ggfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgR0ZYX0RSQVdfSU5GT19TSVpFLCBHRlhCdWZmZXIsIEdGWEluZGlyZWN0QnVmZmVyLCBHRlhCdWZmZXJJbmZvLCBHRlhEcmF3SW5mbyB9IGZyb20gJy4uLy4uL2NvcmUvZ2Z4L2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZU5hbWUsIEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhGb3JtYXRJbmZvcyxcclxuICAgIEdGWE1lbW9yeVVzYWdlQml0LCBHRlhQcmltaXRpdmVNb2RlIH0gZnJvbSAnLi4vLi4vY29yZS9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi4vLi4vY29yZS9nZngvaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgvY29sb3InO1xyXG5pbXBvcnQgeyBzY2VuZSB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZSB9IGZyb20gJy4uL3BhcnRpY2xlJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcblxyXG5jb25zdCBfdXZzID0gW1xyXG4gICAgMCwgMCwgLy8gYm90dG9tLWxlZnRcclxuICAgIDEsIDAsIC8vIGJvdHRvbS1yaWdodFxyXG4gICAgMCwgMSwgLy8gdG9wLWxlZnRcclxuICAgIDEsIDEsIC8vIHRvcC1yaWdodFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGVCYXRjaE1vZGVsIGV4dGVuZHMgc2NlbmUuTW9kZWwge1xyXG5cclxuICAgIHByaXZhdGUgX2NhcGFjaXR5OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF92ZXJ0QXR0cnM6IEdGWEF0dHJpYnV0ZVtdIHwgbnVsbDtcclxuICAgIHByaXZhdGUgX3ZlcnRTaXplOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF92QnVmZmVyOiBBcnJheUJ1ZmZlciB8IG51bGw7XHJcbiAgICBwcml2YXRlIF92ZXJ0QXR0cnNGbG9hdENvdW50OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF92ZGF0YUYzMjogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuICAgIHByaXZhdGUgX3ZkYXRhVWludDMyOiBVaW50MzJBcnJheSB8IG51bGw7XHJcbiAgICBwcml2YXRlIF9pYUluZm86IEdGWEluZGlyZWN0QnVmZmVyO1xyXG4gICAgcHJpdmF0ZSBfaWFJbmZvQnVmZmVyOiBHRlhCdWZmZXI7XHJcbiAgICBwcml2YXRlIF9zdWJNZXNoRGF0YTogUmVuZGVyaW5nU3ViTWVzaCB8IG51bGw7XHJcbiAgICBwcml2YXRlIF9tZXNoOiBNZXNoIHwgbnVsbDtcclxuICAgIHByaXZhdGUgX3ZlcnRDb3VudDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2luZGV4Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9zdGFydFRpbWVPZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9saWZlVGltZU9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2lhSW5mb0J1ZmZlclJlYWR5OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX21hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBzY2VuZS5Nb2RlbFR5cGUuUEFSVElDTEVfQkFUQ0g7XHJcbiAgICAgICAgdGhpcy5fY2FwYWNpdHkgPSAwO1xyXG4gICAgICAgIHRoaXMuX3ZlcnRBdHRycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdmVydFNpemUgPSAwO1xyXG4gICAgICAgIHRoaXMuX3ZCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3ZlcnRBdHRyc0Zsb2F0Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3ZkYXRhRjMyID0gbnVsbDtcclxuICAgICAgICB0aGlzLl92ZGF0YVVpbnQzMiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvID0gbmV3IEdGWEluZGlyZWN0QnVmZmVyKFtuZXcgR0ZYRHJhd0luZm8oKV0pO1xyXG4gICAgICAgIHRoaXMuX2lhSW5mb0J1ZmZlciA9IHRoaXMuX2RldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LklORElSRUNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICBHRlhfRFJBV19JTkZPX1NJWkUsXHJcbiAgICAgICAgICAgIEdGWF9EUkFXX0lORk9fU0laRSxcclxuICAgICAgICApKTtcclxuICAgICAgICB0aGlzLl9zdWJNZXNoRGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENhcGFjaXR5IChjYXBhY2l0eTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgY2FwQ2hhbmdlZCA9IHRoaXMuX2NhcGFjaXR5ICE9PSBjYXBhY2l0eTtcclxuICAgICAgICB0aGlzLl9jYXBhY2l0eSA9IGNhcGFjaXR5O1xyXG4gICAgICAgIGlmICh0aGlzLl9zdWJNZXNoRGF0YSAmJiBjYXBDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VmVydGV4QXR0cmlidXRlcyAobWVzaDogTWVzaCB8IG51bGwsIGF0dHJzOiBHRlhBdHRyaWJ1dGVbXSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tZXNoID09PSBtZXNoICYmIHRoaXMuX3ZlcnRBdHRycyA9PT0gYXR0cnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tZXNoID0gbWVzaDtcclxuICAgICAgICB0aGlzLl92ZXJ0QXR0cnMgPSBhdHRycztcclxuICAgICAgICB0aGlzLl92ZXJ0U2l6ZSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHRoaXMuX3ZlcnRBdHRycykge1xyXG4gICAgICAgICAgICAoYSBhcyBhbnkpLm9mZnNldCA9IHRoaXMuX3ZlcnRTaXplO1xyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZSArPSBHRlhGb3JtYXRJbmZvc1thLmZvcm1hdF0uc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdmVydEF0dHJzRmxvYXRDb3VudCA9IHRoaXMuX3ZlcnRTaXplIC8gNDsgLy8gbnVtYmVyIG9mIGZsb2F0XHJcbiAgICAgICAgLy8gcmVidWlkXHJcbiAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdWJNZXNoRGF0YSAoKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVN1Yk1lc2hEYXRhKCk7XHJcbiAgICAgICAgdGhpcy5fdmVydENvdW50ID0gNDtcclxuICAgICAgICB0aGlzLl9pbmRleENvdW50ID0gNjtcclxuICAgICAgICBpZiAodGhpcy5fbWVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0Q291bnQgPSB0aGlzLl9tZXNoLnN0cnVjdC52ZXJ0ZXhCdW5kbGVzW3RoaXMuX21lc2guc3RydWN0LnByaW1pdGl2ZXNbMF0udmVydGV4QnVuZGVsSW5kaWNlc1swXV0udmlldy5jb3VudDtcclxuICAgICAgICAgICAgdGhpcy5faW5kZXhDb3VudCA9IHRoaXMuX21lc2guc3RydWN0LnByaW1pdGl2ZXNbMF0uaW5kZXhWaWV3IS5jb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdmVydGV4QnVmZmVyID0gdGhpcy5fZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVkVSVEVYIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZSAqIHRoaXMuX2NhcGFjaXR5ICogdGhpcy5fdmVydENvdW50LFxyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZSxcclxuICAgICAgICApKTtcclxuICAgICAgICBjb25zdCB2QnVmZmVyOiBBcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih0aGlzLl92ZXJ0U2l6ZSAqIHRoaXMuX2NhcGFjaXR5ICogdGhpcy5fdmVydENvdW50KTtcclxuICAgICAgICBpZiAodGhpcy5fbWVzaCkge1xyXG4gICAgICAgICAgICBsZXQgdklkeCA9IHRoaXMuX3ZlcnRBdHRycyEuZmluZEluZGV4KCh2YWwpID0+IHZhbC5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEMyk7XHJcbiAgICAgICAgICAgIGxldCB2T2Zmc2V0ID0gKHRoaXMuX3ZlcnRBdHRycyFbdklkeCsrXSBhcyBhbnkpLm9mZnNldDtcclxuICAgICAgICAgICAgdGhpcy5fbWVzaC5jb3B5QXR0cmlidXRlKDAsIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9QT1NJVElPTiwgdkJ1ZmZlciwgdGhpcy5fdmVydFNpemUsIHZPZmZzZXQpOyAgLy8gY29weSBtZXNoIHBvc2l0aW9uIHRvIEFUVFJfVEVYX0NPT1JEM1xyXG4gICAgICAgICAgICB2T2Zmc2V0ID0gKHRoaXMuX3ZlcnRBdHRycyFbdklkeCsrXSBhcyBhbnkpLm9mZnNldDtcclxuICAgICAgICAgICAgdGhpcy5fbWVzaC5jb3B5QXR0cmlidXRlKDAsIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwsIHZCdWZmZXIsIHRoaXMuX3ZlcnRTaXplLCB2T2Zmc2V0KTsgIC8vIGNvcHkgbWVzaCBub3JtYWwgdG8gQVRUUl9OT1JNQUxcclxuICAgICAgICAgICAgdk9mZnNldCA9ICh0aGlzLl92ZXJ0QXR0cnMhW3RoaXMuX3ZlcnRBdHRycyEuZmluZEluZGV4KCh2YWwpID0+IHZhbC5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEKV0gYXMgYW55KS5vZmZzZXQ7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2guY29weUF0dHJpYnV0ZSgwLCBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELCB2QnVmZmVyLCB0aGlzLl92ZXJ0U2l6ZSwgdk9mZnNldCk7ICAvLyBjb3B5IG1lc2ggdXYgdG8gQVRUUl9URVhfQ09PUkRcclxuICAgICAgICAgICAgdk9mZnNldCA9ICh0aGlzLl92ZXJ0QXR0cnMhW3ZJZHgrK10gYXMgYW55KS5vZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbWVzaC5jb3B5QXR0cmlidXRlKDAsIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9DT0xPUiwgdkJ1ZmZlciwgdGhpcy5fdmVydFNpemUsIHZPZmZzZXQpKSB7ICAvLyBjb3B5IG1lc2ggY29sb3IgdG8gQVRUUl9DT0xPUjFcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZiID0gbmV3IFVpbnQzMkFycmF5KHZCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaVZlcnRleCA9IDA7IGlWZXJ0ZXggPCB0aGlzLl92ZXJ0Q291bnQ7ICsraVZlcnRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZiW2lWZXJ0ZXggKiB0aGlzLl92ZXJ0QXR0cnNGbG9hdENvdW50ICsgdk9mZnNldCAvIDRdID0gQ29sb3IuV0hJVEUuX3ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB2YkZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHZCdWZmZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuX2NhcGFjaXR5OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZiRmxvYXRBcnJheS5jb3B5V2l0aGluKGkgKiB0aGlzLl92ZXJ0U2l6ZSAqIHRoaXMuX3ZlcnRDb3VudCAvIDQsIDAsIHRoaXMuX3ZlcnRTaXplICogdGhpcy5fdmVydENvdW50IC8gNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmVydGV4QnVmZmVyLnVwZGF0ZSh2QnVmZmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kaWNlczogVWludDE2QXJyYXkgPSBuZXcgVWludDE2QXJyYXkodGhpcy5fY2FwYWNpdHkgKiB0aGlzLl9pbmRleENvdW50KTtcclxuICAgICAgICBpZiAodGhpcy5fbWVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXNoLmNvcHlJbmRpY2VzKDAsIGluZGljZXMpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuX2NhcGFjaXR5OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5faW5kZXhDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc1tpICogdGhpcy5faW5kZXhDb3VudCArIGpdID0gaW5kaWNlc1tqXSArIGkgKiB0aGlzLl92ZXJ0Q291bnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgZHN0ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jYXBhY2l0eTsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlSWR4ID0gNCAqIGk7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHg7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tkc3QrK10gPSBiYXNlSWR4ICsgMjtcclxuICAgICAgICAgICAgICAgIGluZGljZXNbZHN0KytdID0gYmFzZUlkeCArIDM7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAyO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tkc3QrK10gPSBiYXNlSWR4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhCdWZmZXI6IEdGWEJ1ZmZlciA9IHRoaXMuX2RldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LklOREVYIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICB0aGlzLl9jYXBhY2l0eSAqIHRoaXMuX2luZGV4Q291bnQgKiBVaW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVCxcclxuICAgICAgICAgICAgVWludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQsXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIGluZGV4QnVmZmVyLnVwZGF0ZShpbmRpY2VzKTtcclxuXHJcbiAgICAgICAgdGhpcy5faWFJbmZvLmRyYXdJbmZvc1swXS52ZXJ0ZXhDb3VudCA9IHRoaXMuX2NhcGFjaXR5ICogdGhpcy5fdmVydENvdW50O1xyXG4gICAgICAgIHRoaXMuX2lhSW5mby5kcmF3SW5mb3NbMF0uaW5kZXhDb3VudCA9IHRoaXMuX2NhcGFjaXR5ICogdGhpcy5faW5kZXhDb3VudDtcclxuICAgICAgICBpZiAoIXRoaXMuX2lhSW5mb0J1ZmZlclJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lhSW5mb0J1ZmZlci5pbml0aWFsaXplKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QsXHJcbiAgICAgICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICAgICAgR0ZYX0RSQVdfSU5GT19TSVpFLFxyXG4gICAgICAgICAgICAgICAgR0ZYX0RSQVdfSU5GT19TSVpFLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgdGhpcy5faWFJbmZvQnVmZmVyUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pYUluZm9CdWZmZXIudXBkYXRlKHRoaXMuX2lhSW5mbyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3N1Yk1lc2hEYXRhID0gbmV3IFJlbmRlcmluZ1N1Yk1lc2goW3ZlcnRleEJ1ZmZlcl0sIHRoaXMuX3ZlcnRBdHRycyEsIEdGWFByaW1pdGl2ZU1vZGUuVFJJQU5HTEVfTElTVCwgaW5kZXhCdWZmZXIsIHRoaXMuX2lhSW5mb0J1ZmZlcik7XHJcbiAgICAgICAgdGhpcy5pbml0U3ViTW9kZWwoMCwgdGhpcy5fc3ViTWVzaERhdGEsIHRoaXMuX21hdGVyaWFsISk7XHJcbiAgICAgICAgcmV0dXJuIHZCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZU1hdGVyaWFsIChtYXQ6IE1hdGVyaWFsKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSBtYXQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdWJNb2RlbE1hdGVyaWFsKDAsIG1hdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFBhcnRpY2xlVmVydGV4RGF0YSAoaW5kZXg6IG51bWJlciwgcHZkYXRhOiBhbnlbXSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbWVzaCkge1xyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSBpbmRleCAqIHRoaXMuX3ZlcnRBdHRyc0Zsb2F0Q291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbMF0ueDsgLy8gcG9zaXRpb25cclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVswXS55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcHZkYXRhWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbMV0ueDsgLy8gdXZcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVsxXS55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcHZkYXRhWzFdLno7IC8vIGZyYW1lIGlkeFxyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcHZkYXRhWzJdLng7IC8vIHNpemVcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVsyXS55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcHZkYXRhWzJdLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbM10ueDsgLy8gcm90YXRpb25cclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVszXS55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcHZkYXRhWzNdLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhVWludDMyIVtvZmZzZXQrK10gPSBwdmRhdGFbNF07IC8vIGNvbG9yXHJcbiAgICAgICAgICAgIGlmIChwdmRhdGFbNV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbNV0ueDsgLy8gdmVsb2NpdHlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbNV0ueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbNV0uejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdmVydENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IChpbmRleCAqIHRoaXMuX3ZlcnRDb3VudCArIGkpICogdGhpcy5fdmVydEF0dHJzRmxvYXRDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbMF0ueDsgLy8gcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbMF0ueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbMF0uejtcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSAyO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVsxXS55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVsxXS56OyAvLyBmcmFtZSBpZHhcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwdmRhdGFbMl0ueDsgLy8gc2l6ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVsyXS55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVsyXS56O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVszXS54OyAvLyByb3RhdGlvblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVszXS55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHB2ZGF0YVszXS56O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFVaW50MzIhW29mZnNldCsrXSA9IHB2ZGF0YVs0XTsgLy8gY29sb3JcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkR1BVUGFydGljbGVWZXJ0ZXhEYXRhIChwOiBQYXJ0aWNsZSwgbnVtOiBudW1iZXIsIHRpbWU6bnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IG51bSAqIHRoaXMuX3ZlcnRBdHRyc0Zsb2F0Q291bnQgKiB0aGlzLl92ZXJ0Q291bnQ7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl92ZXJ0Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaWR4ID0gb2Zmc2V0O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5wb3NpdGlvbi56O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gdGltZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnN0YXJ0U2l6ZS54O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5zdGFydFNpemUueTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW2lkeCsrXSA9IHAuc3RhcnRTaXplLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBfdXZzWzIgKiBpXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnJvdGF0aW9uLng7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnJvdGF0aW9uLnk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnJvdGF0aW9uLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBfdXZzWzIgKiBpICsgMV07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5zdGFydENvbG9yLnIgLyAyNTUuMDtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW2lkeCsrXSA9IHAuc3RhcnRDb2xvci5nIC8gMjU1LjA7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnN0YXJ0Q29sb3IuYiAvIDI1NS4wO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5zdGFydENvbG9yLmEgLyAyNTUuMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnZlbG9jaXR5Lng7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnZlbG9jaXR5Lnk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnZlbG9jaXR5Lno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtpZHgrK10gPSBwLnN0YXJ0TGlmZXRpbWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbaWR4KytdID0gcC5yYW5kb21TZWVkO1xyXG5cclxuICAgICAgICAgICAgb2Zmc2V0ICs9IHRoaXMuX3ZlcnRBdHRyc0Zsb2F0Q291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVHUFVQYXJ0aWNsZXMgKG51bTogbnVtYmVyLCB0aW1lOiBudW1iZXIsIGR0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBwU2l6ZSA9IHRoaXMuX3ZlcnRBdHRyc0Zsb2F0Q291bnQgKiB0aGlzLl92ZXJ0Q291bnQ7XHJcbiAgICAgICAgbGV0IHBCYXNlSW5kZXggPSAwO1xyXG4gICAgICAgIGxldCBzdGFydFRpbWUgPSAwO1xyXG4gICAgICAgIGxldCBsaWZlVGltZSA9IDA7XHJcbiAgICAgICAgbGV0IGxhc3RCYXNlSW5kZXggPSAwO1xyXG4gICAgICAgIGxldCBpbnRlcnZhbCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07ICsraSkge1xyXG4gICAgICAgICAgICBwQmFzZUluZGV4ID0gaSAqIHBTaXplO1xyXG4gICAgICAgICAgICBzdGFydFRpbWUgPSB0aGlzLl92ZGF0YUYzMiFbcEJhc2VJbmRleCArIHRoaXMuX3N0YXJ0VGltZU9mZnNldF07XHJcbiAgICAgICAgICAgIGxpZmVUaW1lID0gdGhpcy5fdmRhdGFGMzIhW3BCYXNlSW5kZXggKyB0aGlzLl9saWZlVGltZU9mZnNldF07XHJcbiAgICAgICAgICAgIGludGVydmFsID0gdGltZSAtIHN0YXJ0VGltZTtcclxuICAgICAgICAgICAgaWYgKGxpZmVUaW1lIC0gaW50ZXJ2YWwgPCBkdCkge1xyXG4gICAgICAgICAgICAgICAgbGFzdEJhc2VJbmRleCA9IC0tIG51bSAqIHBTaXplO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhLmNvcHlXaXRoaW4ocEJhc2VJbmRleCwgbGFzdEJhc2VJbmRleCwgbGFzdEJhc2VJbmRleCArIHBTaXplKTtcclxuICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0QXR0cmlidXRlSW5kZXggKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fdmVydEF0dHJzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHZJZHggPSB0aGlzLl92ZXJ0QXR0cnMhLmZpbmRJbmRleCgodmFsKSA9PiB2YWwubmFtZSA9PT0gJ2FfcG9zaXRpb25fc3RhcnR0aW1lJyk7XHJcbiAgICAgICAgbGV0IHZPZmZzZXQgPSAodGhpcy5fdmVydEF0dHJzIVt2SWR4XSBhcyBhbnkpLm9mZnNldDtcclxuICAgICAgICB0aGlzLl9zdGFydFRpbWVPZmZzZXQgPSB2T2Zmc2V0IC8gNCArIDM7XHJcbiAgICAgICAgdklkeCA9IHRoaXMuX3ZlcnRBdHRycyEuZmluZEluZGV4KCh2YWwpID0+IHZhbC5uYW1lID09PSAnYV9kaXJfbGlmZScpO1xyXG4gICAgICAgIHZPZmZzZXQgPSAodGhpcy5fdmVydEF0dHJzIVt2SWR4XSBhcyBhbnkpLm9mZnNldDtcclxuICAgICAgICB0aGlzLl9saWZlVGltZU9mZnNldCA9IHZPZmZzZXQgLyA0ICsgMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlSUEgKGNvdW50OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBpYSA9IHRoaXMuX3N1Yk1vZGVsc1swXS5pbnB1dEFzc2VtYmxlcjtcclxuICAgICAgICBpYS52ZXJ0ZXhCdWZmZXJzWzBdLnVwZGF0ZSh0aGlzLl92ZGF0YUYzMiEpO1xyXG4gICAgICAgIHRoaXMuX2lhSW5mby5kcmF3SW5mb3NbMF0uZmlyc3RJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvLmRyYXdJbmZvc1swXS5pbmRleENvdW50ID0gdGhpcy5faW5kZXhDb3VudCAqIGNvdW50O1xyXG4gICAgICAgIHRoaXMuX2lhSW5mb0J1ZmZlci51cGRhdGUodGhpcy5faWFJbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuX3N1Yk1vZGVsc1swXS5pbnB1dEFzc2VtYmxlci5pbmRleENvdW50ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX3ZCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3ZkYXRhRjMyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRlc3Ryb3lTdWJNZXNoRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuX2lhSW5mb0J1ZmZlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWJ1aWxkICgpIHtcclxuICAgICAgICB0aGlzLl92QnVmZmVyID0gdGhpcy5jcmVhdGVTdWJNZXNoRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuX3ZkYXRhRjMyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl92QnVmZmVyKTtcclxuICAgICAgICB0aGlzLl92ZGF0YVVpbnQzMiA9IG5ldyBVaW50MzJBcnJheSh0aGlzLl92QnVmZmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc3Ryb3lTdWJNZXNoRGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N1Yk1lc2hEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1Yk1lc2hEYXRhLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fc3ViTWVzaERhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9pYUluZm9CdWZmZXJSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=