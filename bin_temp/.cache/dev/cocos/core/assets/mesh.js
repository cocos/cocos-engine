(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../math/index.js", "../3d/misc/buffer.js", "../3d/misc/buffer-blob.js", "../geometry/index.js", "../gfx/buffer.js", "../gfx/define.js", "../gfx/device.js", "../gfx/input-assembler.js", "../platform/debug.js", "../platform/sys.js", "../utils/murmurhash2_gc.js", "./asset.js", "./utils/mesh-utils.js", "./morph.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../math/index.js"), require("../3d/misc/buffer.js"), require("../3d/misc/buffer-blob.js"), require("../geometry/index.js"), require("../gfx/buffer.js"), require("../gfx/define.js"), require("../gfx/device.js"), require("../gfx/input-assembler.js"), require("../platform/debug.js"), require("../platform/sys.js"), require("../utils/murmurhash2_gc.js"), require("./asset.js"), require("./utils/mesh-utils.js"), require("./morph.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.buffer, global.bufferBlob, global.index, global.buffer, global.define, global.device, global.inputAssembler, global.debug, global.sys, global.murmurhash2_gc, global.asset, global.meshUtils, global.morph, global.globalExports);
    global.mesh = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _buffer, _bufferBlob, _index3, _buffer2, _define, _device, _inputAssembler, _debug, _sys, _murmurhash2_gc, _asset, _meshUtils, _morph, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Mesh = _exports.RenderingSubMesh = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function getIndexStrideCtor(stride) {
    switch (stride) {
      case 1:
        return Uint8Array;

      case 2:
        return Uint16Array;

      case 4:
        return Uint32Array;
    }

    return Uint8Array;
  }
  /**
   * 允许存储索引的数组视图。
   */


  /**
   * 渲染子网格。
   */
  var RenderingSubMesh = /*#__PURE__*/function () {
    _createClass(RenderingSubMesh, [{
      key: "attributes",

      /**
       * 所有顶点属性。
       */
      get: function get() {
        return this._attributes;
      }
      /**
       * 使用的所有顶点缓冲区。
       */

    }, {
      key: "vertexBuffers",
      get: function get() {
        return this._vertexBuffers;
      }
      /**
       * 使用的索引缓冲区，若未使用则无需指定。
       */

    }, {
      key: "indexBuffer",
      get: function get() {
        return this._indexBuffer;
      }
      /**
       * 间接绘制缓冲区。
       */

    }, {
      key: "indirectBuffer",
      get: function get() {
        return this._indirectBuffer;
      }
      /**
       * 图元类型。
       */

    }, {
      key: "primitiveMode",
      get: function get() {
        return this._primitiveMode;
      }
      /**
       * （用于射线检测的）几何信息。
       */

    }, {
      key: "geometricInfo",
      get: function get() {
        if (this._geometricInfo) {
          return this._geometricInfo;
        }

        if (this.mesh === undefined) {
          return {
            positions: new Float32Array(),
            indices: new Uint8Array(),
            boundingBox: {
              min: _index2.Vec3.ZERO,
              max: _index2.Vec3.ZERO
            }
          };
        }

        if (this.subMeshIdx === undefined) {
          return {
            positions: new Float32Array(),
            indices: new Uint8Array(),
            boundingBox: {
              min: _index2.Vec3.ZERO,
              max: _index2.Vec3.ZERO
            }
          };
        }

        var mesh = this.mesh;
        var index = this.subMeshIdx;
        var positions = mesh.readAttribute(index, _define.GFXAttributeName.ATTR_POSITION);
        var indices = mesh.readIndices(index);
        var max = new _index2.Vec3();
        var min = new _index2.Vec3();
        var pAttri = this.attributes.find(function (element) {
          return element.name === _globalExports.legacyCC.GFXAttributeName.ATTR_POSITION;
        });

        if (pAttri) {
          var conut = _define.GFXFormatInfos[pAttri.format].count;

          if (conut === 2) {
            max.set(positions[0], positions[1], 0);
            min.set(positions[0], positions[1], 0);
          } else {
            max.set(positions[0], positions[1], positions[2]);
            min.set(positions[0], positions[1], positions[2]);
          }

          for (var i = 0; i < positions.length; i += conut) {
            if (conut === 2) {
              max.x = positions[i] > max.x ? positions[i] : max.x;
              max.y = positions[i + 1] > max.y ? positions[i + 1] : max.y;
              min.x = positions[i] < min.x ? positions[i] : min.x;
              min.y = positions[i + 1] < min.y ? positions[i + 1] : min.y;
            } else {
              max.x = positions[i] > max.x ? positions[i] : max.x;
              max.y = positions[i + 1] > max.y ? positions[i + 1] : max.y;
              max.z = positions[i + 2] > max.z ? positions[i + 2] : max.z;
              min.x = positions[i] < min.x ? positions[i] : min.x;
              min.y = positions[i + 1] < min.y ? positions[i + 1] : min.y;
              min.z = positions[i + 2] < min.z ? positions[i + 2] : min.z;
            }
          }
        }

        this._geometricInfo = {
          positions: positions,
          indices: indices,
          boundingBox: {
            max: max,
            min: min
          }
        };
        return this._geometricInfo;
      }
      /**
       * 扁平化的顶点缓冲区。
       */

    }, {
      key: "flatBuffers",
      get: function get() {
        if (this._flatBuffers) {
          return this._flatBuffers;
        }

        var buffers = this._flatBuffers = [];

        if (!this.mesh || this.subMeshIdx === undefined) {
          return buffers;
        }

        var mesh = this.mesh;
        var idxCount = 0;
        var prim = mesh.struct.primitives[this.subMeshIdx];

        if (prim.indexView) {
          idxCount = prim.indexView.count;
        }

        var _iterator = _createForOfIteratorHelper(prim.vertexBundelIndices),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var bundleIdx = _step.value;
            var _vertexBundle = mesh.struct.vertexBundles[bundleIdx];
            var vbCount = prim.indexView ? prim.indexView.count : _vertexBundle.view.count;
            var vbStride = _vertexBundle.view.stride;
            var vbSize = vbStride * vbCount;
            var view = new Uint8Array(mesh.data.buffer, _vertexBundle.view.offset, _vertexBundle.view.length);

            if (!prim.indexView) {
              this._flatBuffers.push({
                stride: vbStride,
                count: vbCount,
                buffer: view
              });

              continue;
            }

            var vbView = new Uint8Array(vbSize);
            var ibView = mesh.readIndices(this.subMeshIdx); // transform to flat buffer

            for (var n = 0; n < idxCount; ++n) {
              var idx = ibView[n];
              var offset = n * vbStride;
              var srcOffset = idx * vbStride;

              for (var m = 0; m < vbStride; ++m) {
                vbView[offset + m] = view[srcOffset + m];
              }
            }

            this._flatBuffers.push({
              stride: vbStride,
              count: vbCount,
              buffer: vbView
            });
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return this._flatBuffers;
      }
      /**
       * 骨骼索引按映射表处理后的顶点缓冲。
       */

    }, {
      key: "jointMappedBuffers",
      get: function get() {
        var _this = this;

        if (this._jointMappedBuffers) {
          return this._jointMappedBuffers;
        }

        var buffers = this._jointMappedBuffers = [];
        var indices = this._jointMappedBufferIndices = [];

        if (!this.mesh || this.subMeshIdx === undefined) {
          return this._jointMappedBuffers = this.vertexBuffers;
        }

        var struct = this.mesh.struct;
        var prim = struct.primitives[this.subMeshIdx];

        if (!struct.jointMaps || prim.jointMapIndex === undefined || !struct.jointMaps[prim.jointMapIndex]) {
          return this._jointMappedBuffers = this.vertexBuffers;
        }

        var jointFormat;
        var jointOffset;
        var device = _globalExports.legacyCC.director.root.device;

        for (var i = 0; i < prim.vertexBundelIndices.length; i++) {
          var bundle = struct.vertexBundles[prim.vertexBundelIndices[i]];
          jointOffset = 0;
          jointFormat = _define.GFXFormat.UNKNOWN;

          for (var j = 0; j < bundle.attributes.length; j++) {
            var attr = bundle.attributes[j];

            if (attr.name === _define.GFXAttributeName.ATTR_JOINTS) {
              jointFormat = attr.format;
              break;
            }

            jointOffset += _define.GFXFormatInfos[attr.format].size;
          }

          if (jointFormat) {
            (function () {
              var data = new Uint8Array(_this.mesh.data.buffer, bundle.view.offset, bundle.view.length);
              var dataView = new DataView(data.slice().buffer);
              var idxMap = struct.jointMaps[prim.jointMapIndex];
              (0, _buffer.mapBuffer)(dataView, function (cur) {
                return idxMap.indexOf(cur);
              }, jointFormat, jointOffset, bundle.view.length, bundle.view.stride, dataView);
              var buffer = device.createBuffer(new _buffer2.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.DEVICE, bundle.view.length, bundle.view.stride));
              buffer.update(dataView.buffer);
              buffers.push(buffer);
              indices.push(i);
            })();
          } else {
            buffers.push(this.vertexBuffers[prim.vertexBundelIndices[i]]);
          }
        }

        if (this._vertexIdChannel) {
          buffers.push(this._allocVertexIdBuffer(device));
        }

        return buffers;
      }
    }, {
      key: "iaInfo",
      get: function get() {
        return this._iaInfo;
      }
    }]);

    function RenderingSubMesh(vertexBuffers, attributes, primitiveMode) {
      var indexBuffer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var indirectBuffer = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      _classCallCheck(this, RenderingSubMesh);

      this.mesh = void 0;
      this.subMeshIdx = void 0;
      this._flatBuffers = void 0;
      this._jointMappedBuffers = void 0;
      this._jointMappedBufferIndices = void 0;
      this._vertexIdChannel = void 0;
      this._geometricInfo = void 0;
      this._vertexBuffers = void 0;
      this._attributes = void 0;
      this._indexBuffer = null;
      this._indirectBuffer = null;
      this._primitiveMode = void 0;
      this._iaInfo = void 0;
      this._attributes = attributes;
      this._vertexBuffers = vertexBuffers;
      this._indexBuffer = indexBuffer;
      this._indirectBuffer = indirectBuffer;
      this._primitiveMode = primitiveMode;
      this._iaInfo = new _inputAssembler.GFXInputAssemblerInfo(attributes, vertexBuffers, indexBuffer, indirectBuffer);
    }

    _createClass(RenderingSubMesh, [{
      key: "destroy",
      value: function destroy() {
        for (var i = 0; i < this.vertexBuffers.length; i++) {
          this.vertexBuffers[i].destroy();
        }

        this.vertexBuffers.length = 0;

        if (this._indexBuffer) {
          this._indexBuffer.destroy();

          this._indexBuffer = null;
        }

        if (this._jointMappedBuffers && this._jointMappedBufferIndices) {
          for (var _i = 0; _i < this._jointMappedBufferIndices.length; _i++) {
            this._jointMappedBuffers[this._jointMappedBufferIndices[_i]].destroy();
          }

          this._jointMappedBuffers = undefined;
          this._jointMappedBufferIndices = undefined;
        }

        if (this._indirectBuffer) {
          this._indirectBuffer.destroy();

          this._indirectBuffer = null;
        }
      }
      /**
       * Adds a vertex attribute input called 'a_vertexId' into this sub-mesh.
       * This is useful if you want to simulate `gl_VertexId` in WebGL context prior to 2.0.
       * Once you call this function, the vertex attribute is permanently added.
       * Subsequent calls to this function take no effect.
       * @param device Device used to create related rendering resources.
       */

    }, {
      key: "enableVertexIdChannel",
      value: function enableVertexIdChannel(device) {
        if (this._vertexIdChannel) {
          return;
        }

        var streamIndex = this.vertexBuffers.length;
        var attributeIndex = this.attributes.length;

        var vertexIdBuffer = this._allocVertexIdBuffer(device);

        this.vertexBuffers.push(vertexIdBuffer);
        this.attributes.push(new _inputAssembler.GFXAttribute('a_vertexId', _define.GFXFormat.R32F, false, streamIndex));
        this._vertexIdChannel = {
          stream: streamIndex,
          index: attributeIndex
        };
      }
    }, {
      key: "_allocVertexIdBuffer",
      value: function _allocVertexIdBuffer(device) {
        var vertexCount = this.vertexBuffers.length === 0 || this.vertexBuffers[0].stride === 0 ? 0 : // TODO: This depends on how stride of a vertex buffer is defined; Consider padding problem.
        this.vertexBuffers[0].size / this.vertexBuffers[0].stride;
        var vertexIds = new Float32Array(vertexCount);

        for (var iVertex = 0; iVertex < vertexCount; ++iVertex) {
          // `+0.5` because on some platforms, the "fetched integer" may have small error.
          // For example `26` may yield `25.99999`, which is convert to `25` instead of `26` using `int()`.
          vertexIds[iVertex] = iVertex + 0.5;
        }

        var vertexIdBuffer = device.createBuffer(new _buffer2.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.DEVICE, vertexIds.byteLength, vertexIds.BYTES_PER_ELEMENT));
        vertexIdBuffer.update(vertexIds);
        return vertexIdBuffer;
      }
    }]);

    return RenderingSubMesh;
  }();

  _exports.RenderingSubMesh = RenderingSubMesh;
  var v3_1 = new _index2.Vec3();
  var v3_2 = new _index2.Vec3();
  var globalEmptyMeshBuffer = new Uint8Array();
  /**
   * 网格资源。
   */

  var Mesh = (_dec = (0, _index.ccclass)('cc.Mesh'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(Mesh, _Asset);

    _createClass(Mesh, [{
      key: "_nativeAsset",
      get: function get() {
        return this._data.buffer;
      },
      set: function set(value) {
        if (this._data.byteLength === value.byteLength) {
          this._data.set(new Uint8Array(value));

          if (_globalExports.legacyCC.loader._cache[this.nativeUrl]) {
            _globalExports.legacyCC.loader._cache[this.nativeUrl].content = this._data.buffer;
          }
        } else {
          this._data = new Uint8Array(value);
        }

        this.loaded = true;
        this.emit('load');
      }
      /**
       * 此网格的子网格数量。
       * @deprecated 请使用 `this.renderingMesh.subMeshCount`。
       */

    }, {
      key: "subMeshCount",
      get: function get() {
        var renderingMesh = this.renderingSubMeshes;
        return renderingMesh ? renderingMesh.length : 0;
      }
      /**
       * （各分量都）小于等于此网格任何顶点位置的最大位置。
       * @deprecated 请使用 `this.struct.minPosition`。
       */

    }, {
      key: "minPosition",
      get: function get() {
        return this.struct.minPosition;
      }
      /**
       * （各分量都）大于等于此网格任何顶点位置的最大位置。
       * @deprecated 请使用 `this.struct.maxPosition`。
       */

    }, {
      key: "maxPosition",
      get: function get() {
        return this.struct.maxPosition;
      }
      /**
       * 此网格的结构。
       */

    }, {
      key: "struct",
      get: function get() {
        return this._struct;
      }
      /**
       * 此网格的数据。
       */

    }, {
      key: "data",
      get: function get() {
        return this._data;
      }
      /**
       * 此网格的哈希值。
       */

    }, {
      key: "hash",
      get: function get() {
        // hashes should already be computed offline, but if not, make one
        if (!this._hash) {
          this._hash = (0, _murmurhash2_gc.murmurhash2_32_gc)(this._data, 666);
        }

        return this._hash;
      }
    }, {
      key: "jointBufferIndices",
      get: function get() {
        if (this._jointBufferIndices) {
          return this._jointBufferIndices;
        }

        return this._jointBufferIndices = this._struct.primitives.map(function (p) {
          return p.jointMapIndex || 0;
        });
      }
    }]);

    function Mesh() {
      var _this2;

      _classCallCheck(this, Mesh);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Mesh).call(this));

      _initializerDefineProperty(_this2, "_struct", _descriptor, _assertThisInitialized(_this2));

      _initializerDefineProperty(_this2, "_dataLength", _descriptor2, _assertThisInitialized(_this2));

      _initializerDefineProperty(_this2, "_hash", _descriptor3, _assertThisInitialized(_this2));

      _this2._data = globalEmptyMeshBuffer;
      _this2._initialized = false;
      _this2._renderingSubMeshes = null;
      _this2._boneSpaceBounds = new Map();
      _this2._jointBufferIndices = null;
      _this2.morphRendering = null;
      _this2.loaded = false;
      return _this2;
    }

    _createClass(Mesh, [{
      key: "initialize",
      value: function initialize() {
        var _this3 = this;

        if (this._initialized) {
          return;
        }

        this._initialized = true;

        if (this._data.byteLength !== this._dataLength) {
          // In the case of deferred loading, `this._data` is created before
          // the actual binary buffer is loaded.
          this._data = new Uint8Array(this._dataLength);
          (0, _meshUtils.postLoadMesh)(this);
        }

        var buffer = this._data.buffer;
        var gfxDevice = _globalExports.legacyCC.director.root.device;

        var vertexBuffers = this._createVertexBuffers(gfxDevice, buffer);

        var indexBuffers = [];
        var subMeshes = [];

        var _loop = function _loop(i) {
          var prim = _this3._struct.primitives[i];

          if (prim.vertexBundelIndices.length === 0) {
            return "continue";
          }

          var indexBuffer = null;
          var ib = null;

          if (prim.indexView) {
            var idxView = prim.indexView;
            var dstStride = idxView.stride;
            var dstSize = idxView.length;

            if (dstStride === 4 && !gfxDevice.hasFeature(_device.GFXFeature.ELEMENT_INDEX_UINT)) {
              var vertexCount = _this3._struct.vertexBundles[prim.vertexBundelIndices[0]].view.count;

              if (vertexCount >= 65536) {
                (0, _debug.warnID)(10001, vertexCount, 65536);
                return "continue"; // Ignore this primitive
              } else {
                dstStride >>= 1; // Reduce to short.

                dstSize >>= 1;
              }
            }

            indexBuffer = gfxDevice.createBuffer(new _buffer2.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.DEVICE, dstSize, dstStride));
            indexBuffers.push(indexBuffer);
            ib = new (getIndexStrideCtor(idxView.stride))(buffer, idxView.offset, idxView.count);

            if (idxView.stride !== dstStride) {
              ib = getIndexStrideCtor(dstStride).from(ib);
            }

            if (_this3.loaded) {
              indexBuffer.update(ib);
            } else {
              _this3.once('load', function () {
                indexBuffer.update(ib);
              });
            }
          }

          var vbReference = prim.vertexBundelIndices.map(function (idx) {
            return vertexBuffers[idx];
          });
          var gfxAttributes = [];

          if (prim.vertexBundelIndices.length > 0) {
            var idx = prim.vertexBundelIndices[0];
            var _vertexBundle2 = _this3._struct.vertexBundles[idx];
            gfxAttributes = _vertexBundle2.attributes;
          }

          var subMesh = new RenderingSubMesh(vbReference, gfxAttributes, prim.primitiveMode, indexBuffer);
          subMesh.mesh = _this3;
          subMesh.subMeshIdx = i;
          subMeshes.push(subMesh);
        };

        for (var i = 0; i < this._struct.primitives.length; i++) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }

        this._renderingSubMeshes = subMeshes;

        if (this._struct.morph) {
          this.morphRendering = (0, _morph.createMorphRendering)(this, gfxDevice);
        }
      }
      /**
       * 销毁此网格，并释放它占有的所有 GPU 资源。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.destroyRenderingMesh();
        return _get(_getPrototypeOf(Mesh.prototype), "destroy", this).call(this);
      }
      /**
       * 释放此网格占有的所有 GPU 资源。
       */

    }, {
      key: "destroyRenderingMesh",
      value: function destroyRenderingMesh() {
        if (this._renderingSubMeshes) {
          for (var i = 0; i < this._renderingSubMeshes.length; i++) {
            this._renderingSubMeshes[i].destroy();
          }

          this._renderingSubMeshes = null;
          this._initialized = false;
        }
      }
      /**
       * 重置此网格的结构和数据。
       * @param struct 新的结构。
       * @param data 新的数据。
       * @deprecated 将在 V1.0.0 移除，请转用 `this.reset()`。
       */

    }, {
      key: "assign",
      value: function assign(struct, data) {
        this.reset({
          struct: struct,
          data: data
        });
      }
      /**
       * 重置此网格。
       * @param info 网格重置选项。
       */

    }, {
      key: "reset",
      value: function reset(info) {
        this.destroyRenderingMesh();
        this._struct = info.struct;
        this._data = info.data;
        this._dataLength = this.data.byteLength;
        this._hash = 0;
        this.loaded = true;
        this.emit('load');
      }
      /**
       * 此网格创建的渲染网格。
       */

    }, {
      key: "getBoneSpaceBounds",
      value: function getBoneSpaceBounds(skeleton) {
        if (this._boneSpaceBounds.has(skeleton.hash)) {
          return this._boneSpaceBounds.get(skeleton.hash);
        }

        var bounds = [];

        this._boneSpaceBounds.set(skeleton.hash, bounds);

        var valid = [];
        var bindposes = skeleton.bindposes;

        for (var i = 0; i < bindposes.length; i++) {
          bounds.push(new _index3.aabb(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity));
          valid.push(false);
        }

        var primitives = this._struct.primitives;

        for (var p = 0; p < primitives.length; p++) {
          var joints = this.readAttribute(p, _define.GFXAttributeName.ATTR_JOINTS);
          var weights = this.readAttribute(p, _define.GFXAttributeName.ATTR_WEIGHTS);
          var positions = this.readAttribute(p, _define.GFXAttributeName.ATTR_POSITION);

          if (!joints || !weights || !positions) {
            continue;
          }

          var vertCount = Math.min(joints.length / 4, weights.length / 4, positions.length / 3);

          for (var _i2 = 0; _i2 < vertCount; _i2++) {
            _index2.Vec3.set(v3_1, positions[3 * _i2 + 0], positions[3 * _i2 + 1], positions[3 * _i2 + 2]);

            for (var j = 0; j < 4; ++j) {
              var idx = 4 * _i2 + j;
              var joint = joints[idx];

              if (weights[idx] === 0 || joint >= bindposes.length) {
                continue;
              }

              _index2.Vec3.transformMat4(v3_2, v3_1, bindposes[joint]);

              valid[joint] = true;
              var b = bounds[joint];

              _index2.Vec3.min(b.center, b.center, v3_2);

              _index2.Vec3.max(b.halfExtents, b.halfExtents, v3_2);
            }
          }
        }

        for (var _i3 = 0; _i3 < bindposes.length; _i3++) {
          var _b = bounds[_i3];

          if (!valid[_i3]) {
            bounds[_i3] = null;
          } else {
            _index3.aabb.fromPoints(_b, _b.center, _b.halfExtents);
          }
        }

        return bounds;
      }
      /**
       * 合并指定的网格到此网格中。
       * @param mesh 合并的网格。
       * @param worldMatrix 合并的网格的世界变换矩阵
       * @param [validate=false] 是否进行验证。
       * @returns 是否验证成功。若验证选项为 `true` 且验证未通过则返回 `false`，否则返回 `true`。
       */

    }, {
      key: "merge",
      value: function merge(mesh, worldMatrix, validate) {
        if (validate) {
          if (!this.loaded || !mesh.loaded || !this.validateMergingMesh(mesh)) {
            return false;
          }
        }

        var vec3_temp = new _index2.Vec3();
        var rotate = worldMatrix && new _index2.Quat();
        var boundingBox = worldMatrix && new _index3.aabb();

        if (rotate) {
          worldMatrix.getRotation(rotate);
        }

        if (!this._initialized) {
          var struct = JSON.parse(JSON.stringify(mesh._struct));

          var data = mesh._data.slice();

          if (worldMatrix) {
            if (struct.maxPosition && struct.minPosition) {
              _index2.Vec3.add(boundingBox.center, struct.maxPosition, struct.minPosition);

              _index2.Vec3.multiplyScalar(boundingBox.center, boundingBox.center, 0.5);

              _index2.Vec3.subtract(boundingBox.halfExtents, struct.maxPosition, struct.minPosition);

              _index2.Vec3.multiplyScalar(boundingBox.halfExtents, boundingBox.halfExtents, 0.5);

              _index3.aabb.transform(boundingBox, boundingBox, worldMatrix);

              _index2.Vec3.add(struct.maxPosition, boundingBox.center, boundingBox.halfExtents);

              _index2.Vec3.subtract(struct.minPosition, boundingBox.center, boundingBox.halfExtents);
            }

            for (var i = 0; i < struct.vertexBundles.length; i++) {
              var vtxBdl = struct.vertexBundles[i];

              for (var j = 0; j < vtxBdl.attributes.length; j++) {
                if (vtxBdl.attributes[j].name === _define.GFXAttributeName.ATTR_POSITION || vtxBdl.attributes[j].name === _define.GFXAttributeName.ATTR_NORMAL) {
                  var format = vtxBdl.attributes[j].format;
                  var inputView = new DataView(data.buffer, vtxBdl.view.offset + getOffset(vtxBdl.attributes, j));
                  var reader = getReader(inputView, format);
                  var writer = getWriter(inputView, format);

                  if (!reader || !writer) {
                    continue;
                  }

                  var vertexCount = vtxBdl.view.count;
                  var vertexStride = vtxBdl.view.stride;
                  var attrComponentByteLength = getComponentByteLength(format);

                  for (var vtxIdx = 0; vtxIdx < vertexCount; vtxIdx++) {
                    var xOffset = vtxIdx * vertexStride;
                    var yOffset = xOffset + attrComponentByteLength;
                    var zOffset = yOffset + attrComponentByteLength;
                    vec3_temp.set(reader(xOffset), reader(yOffset), reader(zOffset));

                    switch (vtxBdl.attributes[j].name) {
                      case _define.GFXAttributeName.ATTR_POSITION:
                        vec3_temp.transformMat4(worldMatrix);
                        break;

                      case _define.GFXAttributeName.ATTR_NORMAL:
                        _index2.Vec3.transformQuat(vec3_temp, vec3_temp, rotate);

                        break;
                    }

                    writer(xOffset, vec3_temp.x);
                    writer(yOffset, vec3_temp.y);
                    writer(zOffset, vec3_temp.z);
                  }
                }
              }
            }
          }

          this.reset({
            struct: struct,
            data: data
          });
          this.initialize();
          return true;
        } // merge buffer


        var bufferBlob = new _bufferBlob.BufferBlob(); // merge vertex buffer

        var vertCount = 0;
        var vertStride = 0;
        var srcOffset = 0;
        var dstOffset = 0;
        var vb;
        var vbView;
        var srcVBView;
        var dstVBView;
        var srcAttrOffset = 0;
        var srcVBOffset = 0;
        var dstVBOffset = 0;
        var attrSize = 0;
        var dstAttrView;
        var hasAttr = false;
        var vertexBundles = new Array(this._struct.vertexBundles.length);

        for (var _i4 = 0; _i4 < this._struct.vertexBundles.length; ++_i4) {
          var bundle = this._struct.vertexBundles[_i4];
          var dstBundle = mesh._struct.vertexBundles[_i4];
          srcOffset = bundle.view.offset;
          dstOffset = dstBundle.view.offset;
          vertStride = bundle.view.stride;
          vertCount = bundle.view.count + dstBundle.view.count;
          vb = new ArrayBuffer(vertCount * vertStride);
          vbView = new Uint8Array(vb);
          srcVBView = this._data.subarray(srcOffset, srcOffset + bundle.view.length);
          srcOffset += srcVBView.length;
          dstVBView = mesh._data.subarray(dstOffset, dstOffset + dstBundle.view.length);
          dstOffset += dstVBView.length;
          vbView.set(srcVBView);
          srcAttrOffset = 0;

          var _iterator2 = _createForOfIteratorHelper(bundle.attributes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var attr = _step2.value;
              dstVBOffset = 0;
              hasAttr = false;

              var _iterator3 = _createForOfIteratorHelper(dstBundle.attributes),
                  _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var dstAttr = _step3.value;

                  if (attr.name === dstAttr.name && attr.format === dstAttr.format) {
                    hasAttr = true;
                    break;
                  }

                  dstVBOffset += _define.GFXFormatInfos[dstAttr.format].size;
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              if (hasAttr) {
                attrSize = _define.GFXFormatInfos[attr.format].size;
                srcVBOffset = bundle.view.length + srcAttrOffset;

                for (var v = 0; v < dstBundle.view.count; ++v) {
                  dstAttrView = dstVBView.subarray(dstVBOffset, dstVBOffset + attrSize);
                  vbView.set(dstAttrView, srcVBOffset);

                  if ((attr.name === _define.GFXAttributeName.ATTR_POSITION || attr.name === _define.GFXAttributeName.ATTR_NORMAL) && worldMatrix) {
                    var f32_temp = new Float32Array(vbView.buffer, srcVBOffset, 3);
                    vec3_temp.set(f32_temp[0], f32_temp[1], f32_temp[2]);

                    switch (attr.name) {
                      case _define.GFXAttributeName.ATTR_POSITION:
                        vec3_temp.transformMat4(worldMatrix);
                        break;

                      case _define.GFXAttributeName.ATTR_NORMAL:
                        _index2.Vec3.transformQuat(vec3_temp, vec3_temp, rotate);

                        break;
                    }

                    f32_temp[0] = vec3_temp.x;
                    f32_temp[1] = vec3_temp.y;
                    f32_temp[2] = vec3_temp.z;
                  }

                  srcVBOffset += bundle.view.stride;
                  dstVBOffset += dstBundle.view.stride;
                }
              }

              srcAttrOffset += _define.GFXFormatInfos[attr.format].size;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          vertexBundles[_i4] = {
            attributes: bundle.attributes,
            view: {
              offset: bufferBlob.getLength(),
              length: vb.byteLength,
              count: vertCount,
              stride: vertStride
            }
          };
          bufferBlob.addBuffer(vb);
        } // merge index buffer


        var idxCount = 0;
        var idxStride = 2;
        var vertBatchCount = 0;
        var ibView;
        var srcIBView;
        var dstIBView;
        var primitives = new Array(this._struct.primitives.length);

        for (var _i5 = 0; _i5 < this._struct.primitives.length; ++_i5) {
          var prim = this._struct.primitives[_i5];
          var dstPrim = mesh._struct.primitives[_i5];
          primitives[_i5] = {
            primitiveMode: prim.primitiveMode,
            vertexBundelIndices: prim.vertexBundelIndices
          };

          var _iterator4 = _createForOfIteratorHelper(prim.vertexBundelIndices),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var bundleIdx = _step4.value;
              vertBatchCount = Math.max(vertBatchCount, this._struct.vertexBundles[bundleIdx].view.count);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          if (prim.indexView && dstPrim.indexView) {
            idxCount = prim.indexView.count;
            idxCount += dstPrim.indexView.count;
            srcOffset = prim.indexView.offset;
            dstOffset = dstPrim.indexView.offset;

            if (idxCount < 256) {
              idxStride = 1;
            } else if (idxCount < 65536) {
              idxStride = 2;
            } else {
              idxStride = 4;
            }

            var ib = new ArrayBuffer(idxCount * idxStride);

            if (idxStride === 2) {
              ibView = new Uint16Array(ib);
            } else if (idxStride === 1) {
              ibView = new Uint8Array(ib);
            } else {
              // Uint32
              ibView = new Uint32Array(ib);
            } // merge src indices


            if (prim.indexView.stride === 2) {
              srcIBView = new Uint16Array(this._data.buffer, srcOffset, prim.indexView.count);
            } else if (prim.indexView.stride === 1) {
              srcIBView = new Uint8Array(this._data.buffer, srcOffset, prim.indexView.count);
            } else {
              // Uint32
              srcIBView = new Uint32Array(this._data.buffer, srcOffset, prim.indexView.count);
            }

            if (idxStride === prim.indexView.stride) {
              ibView.set(srcIBView);
            } else {
              for (var n = 0; n < prim.indexView.count; ++n) {
                ibView[n] = srcIBView[n];
              }
            }

            srcOffset += prim.indexView.length; // merge dst indices

            if (dstPrim.indexView.stride === 2) {
              dstIBView = new Uint16Array(mesh._data.buffer, dstOffset, dstPrim.indexView.count);
            } else if (dstPrim.indexView.stride === 1) {
              dstIBView = new Uint8Array(mesh._data.buffer, dstOffset, dstPrim.indexView.count);
            } else {
              // Uint32
              dstIBView = new Uint32Array(mesh._data.buffer, dstOffset, dstPrim.indexView.count);
            }

            for (var _n = 0; _n < dstPrim.indexView.count; ++_n) {
              ibView[prim.indexView.count + _n] = vertBatchCount + dstIBView[_n];
            }

            dstOffset += dstPrim.indexView.length;
            primitives[_i5].indexView = {
              offset: bufferBlob.getLength(),
              length: ib.byteLength,
              count: idxCount,
              stride: idxStride
            };
            bufferBlob.setNextAlignment(idxStride);
            bufferBlob.addBuffer(ib);
          }
        } // Create mesh struct.


        var meshStruct = {
          vertexBundles: vertexBundles,
          primitives: primitives,
          minPosition: this._struct.minPosition,
          maxPosition: this._struct.maxPosition
        };

        if (meshStruct.minPosition && mesh._struct.minPosition && meshStruct.maxPosition && mesh._struct.maxPosition) {
          if (worldMatrix) {
            _index2.Vec3.add(boundingBox.center, mesh._struct.maxPosition, mesh._struct.minPosition);

            _index2.Vec3.multiplyScalar(boundingBox.center, boundingBox.center, 0.5);

            _index2.Vec3.subtract(boundingBox.halfExtents, mesh._struct.maxPosition, mesh._struct.minPosition);

            _index2.Vec3.multiplyScalar(boundingBox.halfExtents, boundingBox.halfExtents, 0.5);

            _index3.aabb.transform(boundingBox, boundingBox, worldMatrix);

            _index2.Vec3.add(vec3_temp, boundingBox.center, boundingBox.halfExtents);

            _index2.Vec3.max(meshStruct.maxPosition, meshStruct.maxPosition, vec3_temp);

            _index2.Vec3.subtract(vec3_temp, boundingBox.center, boundingBox.halfExtents);

            _index2.Vec3.min(meshStruct.minPosition, meshStruct.minPosition, vec3_temp);
          } else {
            _index2.Vec3.min(meshStruct.minPosition, meshStruct.minPosition, mesh._struct.minPosition);

            _index2.Vec3.max(meshStruct.maxPosition, meshStruct.maxPosition, mesh._struct.maxPosition);
          }
        } // Create mesh.


        this.reset({
          struct: meshStruct,
          data: new Uint8Array(bufferBlob.getCombined())
        });
        this.initialize();
        return true;
      }
      /**
       * 验证指定网格是否可以合并至当前网格。
       *
       * 当满足以下条件之一时，指定网格可以合并至当前网格：
       *  - 当前网格无数据而待合并网格有数据；
       *  - 它们的顶点块数目相同且对应顶点块的布局一致，并且它们的子网格数目相同且对应子网格的布局一致。
       *
       * 两个顶点块布局一致当且仅当：
       *  - 它们具有相同数量的顶点属性且对应的顶点属性具有相同的属性格式。
       *
       * 两个子网格布局一致，当且仅当：
       *  - 它们具有相同的图元类型并且引用相同数量、相同索引的顶点块；并且，
       *  - 要么都需要索引绘制，要么都不需要索引绘制。
       * @param mesh 指定的网格。
       */

    }, {
      key: "validateMergingMesh",
      value: function validateMergingMesh(mesh) {
        // validate vertex bundles
        if (this._struct.vertexBundles.length !== mesh._struct.vertexBundles.length) {
          return false;
        }

        for (var i = 0; i < this._struct.vertexBundles.length; ++i) {
          var bundle = this._struct.vertexBundles[i];
          var dstBundle = mesh._struct.vertexBundles[i];

          if (bundle.attributes.length !== dstBundle.attributes.length) {
            return false;
          }

          for (var j = 0; j < bundle.attributes.length; ++j) {
            if (bundle.attributes[j].format !== dstBundle.attributes[j].format) {
              return false;
            }
          }
        } // validate primitives


        if (this._struct.primitives.length !== mesh._struct.primitives.length) {
          return false;
        }

        for (var _i6 = 0; _i6 < this._struct.primitives.length; ++_i6) {
          var prim = this._struct.primitives[_i6];
          var dstPrim = mesh._struct.primitives[_i6];

          if (prim.vertexBundelIndices.length !== dstPrim.vertexBundelIndices.length) {
            return false;
          }

          for (var _j = 0; _j < prim.vertexBundelIndices.length; ++_j) {
            if (prim.vertexBundelIndices[_j] !== dstPrim.vertexBundelIndices[_j]) {
              return false;
            }
          }

          if (prim.primitiveMode !== dstPrim.primitiveMode) {
            return false;
          }

          if (prim.indexView) {
            if (dstPrim.indexView === undefined) {
              return false;
            }
          } else {
            if (dstPrim.indexView) {
              return false;
            }
          }
        }

        return true;
      }
      /**
       * 读取子网格的指定属性。
       * @param primitiveIndex 子网格索引。
       * @param attributeName 属性名称。
       * @returns 不存在指定的子网格、子网格不存在指定的属性或属性无法读取时返回 `null`，
       * 否则，创建足够大的缓冲区包含指定属性的所有数据，并为该缓冲区创建与属性类型对应的数组视图。
       */

    }, {
      key: "readAttribute",
      value: function readAttribute(primitiveIndex, attributeName) {
        var _this4 = this;

        var result = null;

        this._accessAttribute(primitiveIndex, attributeName, function (vertexBundle, iAttribute) {
          var vertexCount = vertexBundle.view.count;
          var format = vertexBundle.attributes[iAttribute].format;
          var storageConstructor = (0, _define.getTypedArrayConstructor)(_define.GFXFormatInfos[format]);

          if (vertexCount === 0) {
            return new storageConstructor();
          }

          var inputView = new DataView(_this4._data.buffer, vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute));
          var formatInfo = _define.GFXFormatInfos[format];
          var reader = getReader(inputView, format);

          if (!storageConstructor || !reader) {
            return;
          }

          var componentCount = formatInfo.count;
          var storage = new storageConstructor(vertexCount * componentCount);
          var inputStride = vertexBundle.view.stride;

          for (var iVertex = 0; iVertex < vertexCount; ++iVertex) {
            for (var iComponent = 0; iComponent < componentCount; ++iComponent) {
              storage[componentCount * iVertex + iComponent] = reader(inputStride * iVertex + storage.BYTES_PER_ELEMENT * iComponent);
            }
          }

          result = storage;
          return;
        });

        return result;
      }
      /**
       * 读取子网格的指定属性到目标缓冲区中。
       * @param primitiveIndex 子网格索引。
       * @param attributeName 属性名称。
       * @param buffer 目标缓冲区。
       * @param stride 相邻属性在目标缓冲区的字节间隔。
       * @param offset 首个属性在目标缓冲区中的偏移。
       * @returns 不存在指定的子网格、子网格不存在指定的属性或属性无法读取时返回 `false`，否则返回 `true`。
       */

    }, {
      key: "copyAttribute",
      value: function copyAttribute(primitiveIndex, attributeName, buffer, stride, offset) {
        var _this5 = this;

        var written = false;

        this._accessAttribute(primitiveIndex, attributeName, function (vertexBundle, iAttribute) {
          var vertexCount = vertexBundle.view.count;

          if (vertexCount === 0) {
            written = true;
            return;
          }

          var format = vertexBundle.attributes[iAttribute].format;
          var inputView = new DataView(_this5._data.buffer, vertexBundle.view.offset + getOffset(vertexBundle.attributes, iAttribute));
          var outputView = new DataView(buffer, offset);
          var formatInfo = _define.GFXFormatInfos[format];
          var reader = getReader(inputView, format);
          var writer = getWriter(outputView, format);

          if (!reader || !writer) {
            return;
          }

          var componentCount = formatInfo.count;
          var inputStride = vertexBundle.view.stride;
          var inputComponentByteLength = getComponentByteLength(format);
          var outputStride = stride;
          var outputComponentByteLength = inputComponentByteLength;

          for (var iVertex = 0; iVertex < vertexCount; ++iVertex) {
            for (var iComponent = 0; iComponent < componentCount; ++iComponent) {
              var inputOffset = inputStride * iVertex + inputComponentByteLength * iComponent;
              var outputOffset = outputStride * iVertex + outputComponentByteLength * iComponent;
              writer(outputOffset, reader(inputOffset));
            }
          }

          written = true;
          return;
        });

        return written;
      }
      /**
       * 读取子网格的索引数据。
       * @param primitiveIndex 子网格索引。
       * @returns 不存在指定的子网格或子网格不存在索引数据时返回 `null`，
       * 否则，创建足够大的缓冲区包含所有索引数据，并为该缓冲区创建与索引类型对应的数组视图。
       */

    }, {
      key: "readIndices",
      value: function readIndices(primitiveIndex) {
        if (primitiveIndex >= this._struct.primitives.length) {
          return null;
        }

        var primitive = this._struct.primitives[primitiveIndex];

        if (!primitive.indexView) {
          return null;
        }

        var stride = primitive.indexView.stride;
        var ctor = stride === 1 ? Uint8Array : stride === 2 ? Uint16Array : Uint32Array;
        return new ctor(this._data.buffer, primitive.indexView.offset, primitive.indexView.count);
      }
      /**
       * 读取子网格的索引数据到目标数组中。
       * @param primitiveIndex 子网格索引。
       * @param outputArray 目标数组。
       * @returns 不存在指定的子网格或子网格不存在索引数据时返回 `false`，否则返回 `true`。
       */

    }, {
      key: "copyIndices",
      value: function copyIndices(primitiveIndex, outputArray) {
        if (primitiveIndex >= this._struct.primitives.length) {
          return false;
        }

        var primitive = this._struct.primitives[primitiveIndex];

        if (!primitive.indexView) {
          return false;
        }

        var indexCount = primitive.indexView.count;
        var indexFormat = primitive.indexView.stride === 1 ? _define.GFXFormat.R8UI : primitive.indexView.stride === 2 ? _define.GFXFormat.R16UI : _define.GFXFormat.R32UI;
        var reader = getReader(new DataView(this._data.buffer), indexFormat);

        for (var i = 0; i < indexCount; ++i) {
          outputArray[i] = reader(primitive.indexView.offset + _define.GFXFormatInfos[indexFormat].size * i);
        }

        return true;
      }
    }, {
      key: "_accessAttribute",
      value: function _accessAttribute(primitiveIndex, attributeName, accessor) {
        if (primitiveIndex >= this._struct.primitives.length) {
          return;
        }

        var primitive = this._struct.primitives[primitiveIndex];

        var _iterator5 = _createForOfIteratorHelper(primitive.vertexBundelIndices),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var vertexBundleIndex = _step5.value;
            var _vertexBundle3 = this._struct.vertexBundles[vertexBundleIndex];

            var _iAttribute = _vertexBundle3.attributes.findIndex(function (a) {
              return a.name === attributeName;
            });

            if (_iAttribute < 0) {
              continue;
            }

            accessor(_vertexBundle3, _iAttribute);
            break;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        return;
      }
    }, {
      key: "_createVertexBuffers",
      value: function _createVertexBuffers(gfxDevice, data) {
        var _this6 = this;

        return this._struct.vertexBundles.map(function (vertexBundle) {
          var vertexBuffer = gfxDevice.createBuffer(new _buffer2.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.DEVICE, vertexBundle.view.length, vertexBundle.view.stride));
          var view = new Uint8Array(data, vertexBundle.view.offset, vertexBundle.view.length);

          if (_this6.loaded) {
            vertexBuffer.update(view);
          } else {
            _this6.once('load', function () {
              vertexBuffer.update(view);
            });
          }

          return vertexBuffer;
        });
      }
    }, {
      key: "renderingSubMeshes",
      get: function get() {
        this.initialize();
        return this._renderingSubMeshes;
      }
    }]);

    return Mesh;
  }(_asset.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_struct", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return {
        vertexBundles: [],
        primitives: []
      };
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_dataLength", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_hash", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  _exports.Mesh = Mesh;
  _globalExports.legacyCC.Mesh = Mesh;

  function getOffset(attributes, attributeIndex) {
    var result = 0;

    for (var i = 0; i < attributeIndex; ++i) {
      var attribute = attributes[i];
      result += _define.GFXFormatInfos[attribute.format].size;
    }

    return result;
  }

  var isLittleEndian = _sys.sys.isLittleEndian;

  function getComponentByteLength(format) {
    var info = _define.GFXFormatInfos[format];
    return info.size / info.count;
  }

  function getReader(dataView, format) {
    var info = _define.GFXFormatInfos[format];
    var stride = info.size / info.count;

    switch (info.type) {
      case _define.GFXFormatType.UNORM:
        {
          switch (stride) {
            case 1:
              return function (offset) {
                return dataView.getUint8(offset);
              };

            case 2:
              return function (offset) {
                return dataView.getUint16(offset, isLittleEndian);
              };

            case 4:
              return function (offset) {
                return dataView.getUint32(offset, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.SNORM:
        {
          switch (stride) {
            case 1:
              return function (offset) {
                return dataView.getInt8(offset);
              };

            case 2:
              return function (offset) {
                return dataView.getInt16(offset, isLittleEndian);
              };

            case 4:
              return function (offset) {
                return dataView.getInt32(offset, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.INT:
        {
          switch (stride) {
            case 1:
              return function (offset) {
                return dataView.getInt8(offset);
              };

            case 2:
              return function (offset) {
                return dataView.getInt16(offset, isLittleEndian);
              };

            case 4:
              return function (offset) {
                return dataView.getInt32(offset, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.UINT:
        {
          switch (stride) {
            case 1:
              return function (offset) {
                return dataView.getUint8(offset);
              };

            case 2:
              return function (offset) {
                return dataView.getUint16(offset, isLittleEndian);
              };

            case 4:
              return function (offset) {
                return dataView.getUint32(offset, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.FLOAT:
        {
          return function (offset) {
            return dataView.getFloat32(offset, isLittleEndian);
          };
        }
    }

    return null;
  }

  function getWriter(dataView, format) {
    var info = _define.GFXFormatInfos[format];
    var stride = info.size / info.count;

    switch (info.type) {
      case _define.GFXFormatType.UNORM:
        {
          switch (stride) {
            case 1:
              return function (offset, value) {
                return dataView.setUint8(offset, value);
              };

            case 2:
              return function (offset, value) {
                return dataView.setUint16(offset, value, isLittleEndian);
              };

            case 4:
              return function (offset, value) {
                return dataView.setUint32(offset, value, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.SNORM:
        {
          switch (stride) {
            case 1:
              return function (offset, value) {
                return dataView.setInt8(offset, value);
              };

            case 2:
              return function (offset, value) {
                return dataView.setInt16(offset, value, isLittleEndian);
              };

            case 4:
              return function (offset, value) {
                return dataView.setInt32(offset, value, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.INT:
        {
          switch (stride) {
            case 1:
              return function (offset, value) {
                return dataView.setInt8(offset, value);
              };

            case 2:
              return function (offset, value) {
                return dataView.setInt16(offset, value, isLittleEndian);
              };

            case 4:
              return function (offset, value) {
                return dataView.setInt32(offset, value, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.UINT:
        {
          switch (stride) {
            case 1:
              return function (offset, value) {
                return dataView.setUint8(offset, value);
              };

            case 2:
              return function (offset, value) {
                return dataView.setUint16(offset, value, isLittleEndian);
              };

            case 4:
              return function (offset, value) {
                return dataView.setUint32(offset, value, isLittleEndian);
              };
          }

          break;
        }

      case _define.GFXFormatType.FLOAT:
        {
          return function (offset, value) {
            return dataView.setFloat32(offset, value, isLittleEndian);
          };
        }
    }

    return null;
  } // function get

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL21lc2gudHMiXSwibmFtZXMiOlsiZ2V0SW5kZXhTdHJpZGVDdG9yIiwic3RyaWRlIiwiVWludDhBcnJheSIsIlVpbnQxNkFycmF5IiwiVWludDMyQXJyYXkiLCJSZW5kZXJpbmdTdWJNZXNoIiwiX2F0dHJpYnV0ZXMiLCJfdmVydGV4QnVmZmVycyIsIl9pbmRleEJ1ZmZlciIsIl9pbmRpcmVjdEJ1ZmZlciIsIl9wcmltaXRpdmVNb2RlIiwiX2dlb21ldHJpY0luZm8iLCJtZXNoIiwidW5kZWZpbmVkIiwicG9zaXRpb25zIiwiRmxvYXQzMkFycmF5IiwiaW5kaWNlcyIsImJvdW5kaW5nQm94IiwibWluIiwiVmVjMyIsIlpFUk8iLCJtYXgiLCJzdWJNZXNoSWR4IiwiaW5kZXgiLCJyZWFkQXR0cmlidXRlIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkFUVFJfUE9TSVRJT04iLCJyZWFkSW5kaWNlcyIsInBBdHRyaSIsImF0dHJpYnV0ZXMiLCJmaW5kIiwiZWxlbWVudCIsIm5hbWUiLCJsZWdhY3lDQyIsImNvbnV0IiwiR0ZYRm9ybWF0SW5mb3MiLCJmb3JtYXQiLCJjb3VudCIsInNldCIsImkiLCJsZW5ndGgiLCJ4IiwieSIsInoiLCJfZmxhdEJ1ZmZlcnMiLCJidWZmZXJzIiwiaWR4Q291bnQiLCJwcmltIiwic3RydWN0IiwicHJpbWl0aXZlcyIsImluZGV4VmlldyIsInZlcnRleEJ1bmRlbEluZGljZXMiLCJidW5kbGVJZHgiLCJ2ZXJ0ZXhCdW5kbGUiLCJ2ZXJ0ZXhCdW5kbGVzIiwidmJDb3VudCIsInZpZXciLCJ2YlN0cmlkZSIsInZiU2l6ZSIsImRhdGEiLCJidWZmZXIiLCJvZmZzZXQiLCJwdXNoIiwidmJWaWV3IiwiaWJWaWV3IiwibiIsImlkeCIsInNyY09mZnNldCIsIm0iLCJfam9pbnRNYXBwZWRCdWZmZXJzIiwiX2pvaW50TWFwcGVkQnVmZmVySW5kaWNlcyIsInZlcnRleEJ1ZmZlcnMiLCJqb2ludE1hcHMiLCJqb2ludE1hcEluZGV4Iiwiam9pbnRGb3JtYXQiLCJqb2ludE9mZnNldCIsImRldmljZSIsImRpcmVjdG9yIiwicm9vdCIsImJ1bmRsZSIsIkdGWEZvcm1hdCIsIlVOS05PV04iLCJqIiwiYXR0ciIsIkFUVFJfSk9JTlRTIiwic2l6ZSIsImRhdGFWaWV3IiwiRGF0YVZpZXciLCJzbGljZSIsImlkeE1hcCIsImN1ciIsImluZGV4T2YiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJWRVJURVgiLCJUUkFOU0ZFUl9EU1QiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkRFVklDRSIsInVwZGF0ZSIsIl92ZXJ0ZXhJZENoYW5uZWwiLCJfYWxsb2NWZXJ0ZXhJZEJ1ZmZlciIsIl9pYUluZm8iLCJwcmltaXRpdmVNb2RlIiwiaW5kZXhCdWZmZXIiLCJpbmRpcmVjdEJ1ZmZlciIsIkdGWElucHV0QXNzZW1ibGVySW5mbyIsImRlc3Ryb3kiLCJzdHJlYW1JbmRleCIsImF0dHJpYnV0ZUluZGV4IiwidmVydGV4SWRCdWZmZXIiLCJHRlhBdHRyaWJ1dGUiLCJSMzJGIiwic3RyZWFtIiwidmVydGV4Q291bnQiLCJ2ZXJ0ZXhJZHMiLCJpVmVydGV4IiwiYnl0ZUxlbmd0aCIsIkJZVEVTX1BFUl9FTEVNRU5UIiwidjNfMSIsInYzXzIiLCJnbG9iYWxFbXB0eU1lc2hCdWZmZXIiLCJNZXNoIiwiX2RhdGEiLCJ2YWx1ZSIsImxvYWRlciIsIl9jYWNoZSIsIm5hdGl2ZVVybCIsImNvbnRlbnQiLCJsb2FkZWQiLCJlbWl0IiwicmVuZGVyaW5nTWVzaCIsInJlbmRlcmluZ1N1Yk1lc2hlcyIsIm1pblBvc2l0aW9uIiwibWF4UG9zaXRpb24iLCJfc3RydWN0IiwiX2hhc2giLCJfam9pbnRCdWZmZXJJbmRpY2VzIiwibWFwIiwicCIsIl9pbml0aWFsaXplZCIsIl9yZW5kZXJpbmdTdWJNZXNoZXMiLCJfYm9uZVNwYWNlQm91bmRzIiwiTWFwIiwibW9ycGhSZW5kZXJpbmciLCJfZGF0YUxlbmd0aCIsImdmeERldmljZSIsIl9jcmVhdGVWZXJ0ZXhCdWZmZXJzIiwiaW5kZXhCdWZmZXJzIiwic3ViTWVzaGVzIiwiaWIiLCJpZHhWaWV3IiwiZHN0U3RyaWRlIiwiZHN0U2l6ZSIsImhhc0ZlYXR1cmUiLCJHRlhGZWF0dXJlIiwiRUxFTUVOVF9JTkRFWF9VSU5UIiwiSU5ERVgiLCJmcm9tIiwib25jZSIsInZiUmVmZXJlbmNlIiwiZ2Z4QXR0cmlidXRlcyIsInN1Yk1lc2giLCJtb3JwaCIsImRlc3Ryb3lSZW5kZXJpbmdNZXNoIiwicmVzZXQiLCJpbmZvIiwic2tlbGV0b24iLCJoYXMiLCJoYXNoIiwiZ2V0IiwiYm91bmRzIiwidmFsaWQiLCJiaW5kcG9zZXMiLCJhYWJiIiwiSW5maW5pdHkiLCJqb2ludHMiLCJ3ZWlnaHRzIiwiQVRUUl9XRUlHSFRTIiwidmVydENvdW50IiwiTWF0aCIsImpvaW50IiwidHJhbnNmb3JtTWF0NCIsImIiLCJjZW50ZXIiLCJoYWxmRXh0ZW50cyIsImZyb21Qb2ludHMiLCJ3b3JsZE1hdHJpeCIsInZhbGlkYXRlIiwidmFsaWRhdGVNZXJnaW5nTWVzaCIsInZlYzNfdGVtcCIsInJvdGF0ZSIsIlF1YXQiLCJnZXRSb3RhdGlvbiIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImFkZCIsIm11bHRpcGx5U2NhbGFyIiwic3VidHJhY3QiLCJ0cmFuc2Zvcm0iLCJ2dHhCZGwiLCJBVFRSX05PUk1BTCIsImlucHV0VmlldyIsImdldE9mZnNldCIsInJlYWRlciIsImdldFJlYWRlciIsIndyaXRlciIsImdldFdyaXRlciIsInZlcnRleFN0cmlkZSIsImF0dHJDb21wb25lbnRCeXRlTGVuZ3RoIiwiZ2V0Q29tcG9uZW50Qnl0ZUxlbmd0aCIsInZ0eElkeCIsInhPZmZzZXQiLCJ5T2Zmc2V0Iiwiek9mZnNldCIsInRyYW5zZm9ybVF1YXQiLCJpbml0aWFsaXplIiwiYnVmZmVyQmxvYiIsIkJ1ZmZlckJsb2IiLCJ2ZXJ0U3RyaWRlIiwiZHN0T2Zmc2V0IiwidmIiLCJzcmNWQlZpZXciLCJkc3RWQlZpZXciLCJzcmNBdHRyT2Zmc2V0Iiwic3JjVkJPZmZzZXQiLCJkc3RWQk9mZnNldCIsImF0dHJTaXplIiwiZHN0QXR0clZpZXciLCJoYXNBdHRyIiwiQXJyYXkiLCJkc3RCdW5kbGUiLCJBcnJheUJ1ZmZlciIsInN1YmFycmF5IiwiZHN0QXR0ciIsInYiLCJmMzJfdGVtcCIsImdldExlbmd0aCIsImFkZEJ1ZmZlciIsImlkeFN0cmlkZSIsInZlcnRCYXRjaENvdW50Iiwic3JjSUJWaWV3IiwiZHN0SUJWaWV3IiwiZHN0UHJpbSIsInNldE5leHRBbGlnbm1lbnQiLCJtZXNoU3RydWN0IiwiZ2V0Q29tYmluZWQiLCJwcmltaXRpdmVJbmRleCIsImF0dHJpYnV0ZU5hbWUiLCJyZXN1bHQiLCJfYWNjZXNzQXR0cmlidXRlIiwiaUF0dHJpYnV0ZSIsInN0b3JhZ2VDb25zdHJ1Y3RvciIsImZvcm1hdEluZm8iLCJjb21wb25lbnRDb3VudCIsInN0b3JhZ2UiLCJpbnB1dFN0cmlkZSIsImlDb21wb25lbnQiLCJ3cml0dGVuIiwib3V0cHV0VmlldyIsImlucHV0Q29tcG9uZW50Qnl0ZUxlbmd0aCIsIm91dHB1dFN0cmlkZSIsIm91dHB1dENvbXBvbmVudEJ5dGVMZW5ndGgiLCJpbnB1dE9mZnNldCIsIm91dHB1dE9mZnNldCIsInByaW1pdGl2ZSIsImN0b3IiLCJvdXRwdXRBcnJheSIsImluZGV4Q291bnQiLCJpbmRleEZvcm1hdCIsIlI4VUkiLCJSMTZVSSIsIlIzMlVJIiwiYWNjZXNzb3IiLCJ2ZXJ0ZXhCdW5kbGVJbmRleCIsImZpbmRJbmRleCIsImEiLCJ2ZXJ0ZXhCdWZmZXIiLCJBc3NldCIsInNlcmlhbGl6YWJsZSIsImF0dHJpYnV0ZSIsImlzTGl0dGxlRW5kaWFuIiwic3lzIiwidHlwZSIsIkdGWEZvcm1hdFR5cGUiLCJVTk9STSIsImdldFVpbnQ4IiwiZ2V0VWludDE2IiwiZ2V0VWludDMyIiwiU05PUk0iLCJnZXRJbnQ4IiwiZ2V0SW50MTYiLCJnZXRJbnQzMiIsIklOVCIsIlVJTlQiLCJGTE9BVCIsImdldEZsb2F0MzIiLCJzZXRVaW50OCIsInNldFVpbnQxNiIsInNldFVpbnQzMiIsInNldEludDgiLCJzZXRJbnQxNiIsInNldEludDMyIiwic2V0RmxvYXQzMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3REEsV0FBU0Esa0JBQVQsQ0FBNkJDLE1BQTdCLEVBQTZDO0FBQ3pDLFlBQVFBLE1BQVI7QUFDSSxXQUFLLENBQUw7QUFBUSxlQUFPQyxVQUFQOztBQUNSLFdBQUssQ0FBTDtBQUFRLGVBQU9DLFdBQVA7O0FBQ1IsV0FBSyxDQUFMO0FBQVEsZUFBT0MsV0FBUDtBQUhaOztBQUtBLFdBQU9GLFVBQVA7QUFDSDtBQUVEOzs7OztBQW9DQTs7O01BR2FHLGdCOzs7O0FBRVQ7OzswQkFHa0I7QUFBRSxlQUFPLEtBQUtDLFdBQVo7QUFBMEI7QUFDOUM7Ozs7OzswQkFHcUI7QUFBRSxlQUFPLEtBQUtDLGNBQVo7QUFBNkI7QUFDcEQ7Ozs7OzswQkFHbUI7QUFBRSxlQUFPLEtBQUtDLFlBQVo7QUFBMkI7QUFDaEQ7Ozs7OzswQkFHc0I7QUFBRSxlQUFPLEtBQUtDLGVBQVo7QUFBOEI7QUFFdEQ7Ozs7OzswQkFHcUI7QUFBRSxlQUFPLEtBQUtDLGNBQVo7QUFBNkI7QUFFcEQ7Ozs7OzswQkFHcUI7QUFDakIsWUFBSSxLQUFLQyxjQUFULEVBQXlCO0FBQ3JCLGlCQUFPLEtBQUtBLGNBQVo7QUFDSDs7QUFDRCxZQUFJLEtBQUtDLElBQUwsS0FBY0MsU0FBbEIsRUFBNkI7QUFDekIsaUJBQU87QUFBRUMsWUFBQUEsU0FBUyxFQUFFLElBQUlDLFlBQUosRUFBYjtBQUFpQ0MsWUFBQUEsT0FBTyxFQUFFLElBQUlkLFVBQUosRUFBMUM7QUFBNERlLFlBQUFBLFdBQVcsRUFBRTtBQUFFQyxjQUFBQSxHQUFHLEVBQUVDLGFBQUtDLElBQVo7QUFBa0JDLGNBQUFB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QixFQUFrQzhKLGNBQWxDLENBQW5DO0FBQUEsZUFBUDs7QUFDUixpQkFBSyxDQUFMO0FBQVEscUJBQU8sVUFBQzdOLE1BQUQsRUFBaUIrRCxLQUFqQjtBQUFBLHVCQUFtQ3RDLFFBQVEsQ0FBQ3NOLFNBQVQsQ0FBbUIvTyxNQUFuQixFQUEyQitELEtBQTNCLEVBQWtDOEosY0FBbEMsQ0FBbkM7QUFBQSxlQUFQO0FBSFo7O0FBS0E7QUFDSDs7QUFDRCxXQUFLRyxzQkFBY1csS0FBbkI7QUFBMEI7QUFDdEIsaUJBQU8sVUFBQzNPLE1BQUQsRUFBaUIrRCxLQUFqQjtBQUFBLG1CQUFtQ3RDLFFBQVEsQ0FBQzBOLFVBQVQsQ0FBb0JuUCxNQUFwQixFQUE0QitELEtBQTVCLEVBQW1DOEosY0FBbkMsQ0FBbkM7QUFBQSxXQUFQO0FBQ0g7QUFuQ0w7O0FBc0NBLFdBQU8sSUFBUDtBQUNILEcsQ0FFRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBNYXQ0LCBRdWF0LCBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgbWFwQnVmZmVyIH0gZnJvbSAnLi4vM2QvbWlzYy9idWZmZXInO1xyXG5pbXBvcnQgeyBCdWZmZXJCbG9iIH0gZnJvbSAnLi4vM2QvbWlzYy9idWZmZXItYmxvYic7XHJcbmltcG9ydCB7IGFhYmIgfSBmcm9tICcuLi9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVySW5mbyB9IGZyb20gJy4uL2dmeC9idWZmZXInO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yLFxyXG4gICAgR0ZYQXR0cmlidXRlTmFtZSxcclxuICAgIEdGWEJ1ZmZlclVzYWdlQml0LFxyXG4gICAgR0ZYRm9ybWF0LFxyXG4gICAgR0ZYRm9ybWF0SW5mb3MsXHJcbiAgICBHRlhGb3JtYXRUeXBlLFxyXG4gICAgR0ZYTWVtb3J5VXNhZ2VCaXQsXHJcbiAgICBHRlhQcmltaXRpdmVNb2RlLFxyXG59IGZyb20gJy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UsIEdGWEZlYXR1cmUgfSBmcm9tICcuLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlLCBHRlhJbnB1dEFzc2VtYmxlckluZm8gfSBmcm9tICcuLi9nZngvaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgd2FybklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBzeXMgfSBmcm9tICcuLi9wbGF0Zm9ybS9zeXMnO1xyXG5pbXBvcnQgeyBtdXJtdXJoYXNoMl8zMl9nYyB9IGZyb20gJy4uL3V0aWxzL211cm11cmhhc2gyX2djJztcclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuL2Fzc2V0JztcclxuaW1wb3J0IHsgU2tlbGV0b24gfSBmcm9tICcuL3NrZWxldG9uJztcclxuaW1wb3J0IHsgcG9zdExvYWRNZXNoIH0gZnJvbSAnLi91dGlscy9tZXNoLXV0aWxzJztcclxuaW1wb3J0IHsgTW9ycGgsIGNyZWF0ZU1vcnBoUmVuZGVyaW5nLCBNb3JwaFJlbmRlcmluZyB9IGZyb20gJy4vbW9ycGgnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4U3RyaWRlQ3RvciAoc3RyaWRlOiBudW1iZXIpIHtcclxuICAgIHN3aXRjaCAoc3RyaWRlKSB7XHJcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gVWludDhBcnJheTtcclxuICAgICAgICBjYXNlIDI6IHJldHVybiBVaW50MTZBcnJheTtcclxuICAgICAgICBjYXNlIDQ6IHJldHVybiBVaW50MzJBcnJheTtcclxuICAgIH1cclxuICAgIHJldHVybiBVaW50OEFycmF5O1xyXG59XHJcblxyXG4vKipcclxuICog5YWB6K645a2Y5YKo57Si5byV55qE5pWw57uE6KeG5Zu+44CCXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBJQkFycmF5ID0gVWludDhBcnJheSB8IFVpbnQxNkFycmF5IHwgVWludDMyQXJyYXk7XHJcblxyXG4vKipcclxuICog5Yeg5L2V5L+h5oGv44CCXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElHZW9tZXRyaWNJbmZvIHtcclxuICAgIC8qKlxyXG4gICAgICog6aG254K55L2N572u44CCXHJcbiAgICAgKi9cclxuICAgIHBvc2l0aW9uczogRmxvYXQzMkFycmF5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog57Si5byV5pWw5o2u44CCXHJcbiAgICAgKi9cclxuICAgIGluZGljZXM/OiBJQkFycmF5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5bCG5Zu+5YWD5oyJ5Y+M6Z2i5a+55b6F44CCXHJcbiAgICAgKi9cclxuICAgIGRvdWJsZVNpZGVkPzogYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOatpOWHoOS9leS9k+eahOi9tOWvuem9kOWMheWbtOebkuOAglxyXG4gICAgICovXHJcbiAgICBib3VuZGluZ0JveDogeyBtYXg6IFZlYzM7IG1pbjogVmVjMzsgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElGbGF0QnVmZmVyIHtcclxuICAgIHN0cmlkZTogbnVtYmVyO1xyXG4gICAgY291bnQ6IG51bWJlcjtcclxuICAgIGJ1ZmZlcjogVWludDhBcnJheTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WtkOe9keagvOOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlbmRlcmluZ1N1Yk1lc2gge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omA5pyJ6aG254K55bGe5oCn44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBhdHRyaWJ1dGVzICgpIHsgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7IH1cclxuICAgIC8qKlxyXG4gICAgICog5L2/55So55qE5omA5pyJ6aG254K557yT5Yay5Yy644CCXHJcbiAgICAgKi9cclxuICAgIGdldCB2ZXJ0ZXhCdWZmZXJzICgpIHsgcmV0dXJuIHRoaXMuX3ZlcnRleEJ1ZmZlcnM7IH1cclxuICAgIC8qKlxyXG4gICAgICog5L2/55So55qE57Si5byV57yT5Yay5Yy677yM6Iul5pyq5L2/55So5YiZ5peg6ZyA5oyH5a6a44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBpbmRleEJ1ZmZlciAoKSB7IHJldHVybiB0aGlzLl9pbmRleEJ1ZmZlcjsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDpl7TmjqXnu5jliLbnvJPlhrLljLrjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGluZGlyZWN0QnVmZmVyICgpIHsgcmV0dXJuIHRoaXMuX2luZGlyZWN0QnVmZmVyOyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlm77lhYPnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHByaW1pdGl2ZU1vZGUgKCkgeyByZXR1cm4gdGhpcy5fcHJpbWl0aXZlTW9kZTsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog77yI55So5LqO5bCE57q/5qOA5rWL55qE77yJ5Yeg5L2V5L+h5oGv44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBnZW9tZXRyaWNJbmZvICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ2VvbWV0cmljSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2VvbWV0cmljSW5mbztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWVzaCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheSgpLCBpbmRpY2VzOiBuZXcgVWludDhBcnJheSgpLCBib3VuZGluZ0JveDogeyBtaW46IFZlYzMuWkVSTywgbWF4OiBWZWMzLlpFUk8gfSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdWJNZXNoSWR4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KCksIGluZGljZXM6IG5ldyBVaW50OEFycmF5KCksIGJvdW5kaW5nQm94OiB7IG1pbjogVmVjMy5aRVJPLCBtYXg6IFZlYzMuWkVSTyB9IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1lc2ggPSB0aGlzLm1lc2ghOyBjb25zdCBpbmRleCA9IHRoaXMuc3ViTWVzaElkeCE7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gbWVzaC5yZWFkQXR0cmlidXRlKGluZGV4LCBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04pIGFzIHVua25vd24gYXMgRmxvYXQzMkFycmF5O1xyXG4gICAgICAgIGNvbnN0IGluZGljZXMgPSBtZXNoLnJlYWRJbmRpY2VzKGluZGV4KSBhcyBVaW50MTZBcnJheTtcclxuICAgICAgICBjb25zdCBtYXggPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgY29uc3QgcEF0dHJpID0gdGhpcy5hdHRyaWJ1dGVzLmZpbmQoZWxlbWVudCA9PiBlbGVtZW50Lm5hbWUgPT09IGxlZ2FjeUNDLkdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9QT1NJVElPTik7XHJcbiAgICAgICAgaWYgKHBBdHRyaSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb251dCA9IEdGWEZvcm1hdEluZm9zW3BBdHRyaS5mb3JtYXRdLmNvdW50O1xyXG4gICAgICAgICAgICBpZiAoY29udXQgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIG1heC5zZXQocG9zaXRpb25zWzBdLCBwb3NpdGlvbnNbMV0sIDApO1xyXG4gICAgICAgICAgICAgICAgbWluLnNldChwb3NpdGlvbnNbMF0sIHBvc2l0aW9uc1sxXSwgMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXguc2V0KHBvc2l0aW9uc1swXSwgcG9zaXRpb25zWzFdLCBwb3NpdGlvbnNbMl0pO1xyXG4gICAgICAgICAgICAgICAgbWluLnNldChwb3NpdGlvbnNbMF0sIHBvc2l0aW9uc1sxXSwgcG9zaXRpb25zWzJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkgKz0gY29udXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb251dCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1heC54ID0gcG9zaXRpb25zW2ldID4gbWF4LnggPyBwb3NpdGlvbnNbaV0gOiBtYXgueDtcclxuICAgICAgICAgICAgICAgICAgICBtYXgueSA9IHBvc2l0aW9uc1tpICsgMV0gPiBtYXgueSA/IHBvc2l0aW9uc1tpICsgMV0gOiBtYXgueTtcclxuICAgICAgICAgICAgICAgICAgICBtaW4ueCA9IHBvc2l0aW9uc1tpXSA8IG1pbi54ID8gcG9zaXRpb25zW2ldIDogbWluLng7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLnkgPSBwb3NpdGlvbnNbaSArIDFdIDwgbWluLnkgPyBwb3NpdGlvbnNbaSArIDFdIDogbWluLnk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG1heC54ID0gcG9zaXRpb25zW2ldID4gbWF4LnggPyBwb3NpdGlvbnNbaV0gOiBtYXgueDtcclxuICAgICAgICAgICAgICAgICAgICBtYXgueSA9IHBvc2l0aW9uc1tpICsgMV0gPiBtYXgueSA/IHBvc2l0aW9uc1tpICsgMV0gOiBtYXgueTtcclxuICAgICAgICAgICAgICAgICAgICBtYXgueiA9IHBvc2l0aW9uc1tpICsgMl0gPiBtYXgueiA/IHBvc2l0aW9uc1tpICsgMl0gOiBtYXguejtcclxuICAgICAgICAgICAgICAgICAgICBtaW4ueCA9IHBvc2l0aW9uc1tpXSA8IG1pbi54ID8gcG9zaXRpb25zW2ldIDogbWluLng7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLnkgPSBwb3NpdGlvbnNbaSArIDFdIDwgbWluLnkgPyBwb3NpdGlvbnNbaSArIDFdIDogbWluLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluLnogPSBwb3NpdGlvbnNbaSArIDJdIDwgbWluLnogPyBwb3NpdGlvbnNbaSArIDJdIDogbWluLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZ2VvbWV0cmljSW5mbyA9IHsgcG9zaXRpb25zLCBpbmRpY2VzLCBib3VuZGluZ0JveDogeyBtYXgsIG1pbiB9IH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dlb21ldHJpY0luZm87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiYHlubPljJbnmoTpobbngrnnvJPlhrLljLrjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGZsYXRCdWZmZXJzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZmxhdEJ1ZmZlcnMpIHsgcmV0dXJuIHRoaXMuX2ZsYXRCdWZmZXJzOyB9XHJcbiAgICAgICAgY29uc3QgYnVmZmVyczogSUZsYXRCdWZmZXJbXSA9IHRoaXMuX2ZsYXRCdWZmZXJzID0gW107XHJcbiAgICAgICAgaWYgKCF0aGlzLm1lc2ggfHwgdGhpcy5zdWJNZXNoSWR4ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGJ1ZmZlcnM7IH1cclxuICAgICAgICBjb25zdCBtZXNoID0gdGhpcy5tZXNoO1xyXG4gICAgICAgIGxldCBpZHhDb3VudCA9IDA7XHJcbiAgICAgICAgY29uc3QgcHJpbSA9IG1lc2guc3RydWN0LnByaW1pdGl2ZXNbdGhpcy5zdWJNZXNoSWR4XTtcclxuICAgICAgICBpZiAocHJpbS5pbmRleFZpZXcpIHsgaWR4Q291bnQgPSBwcmltLmluZGV4Vmlldy5jb3VudDsgfVxyXG4gICAgICAgIGZvciAoY29uc3QgYnVuZGxlSWR4IG9mIHByaW0udmVydGV4QnVuZGVsSW5kaWNlcykge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhCdW5kbGUgPSBtZXNoLnN0cnVjdC52ZXJ0ZXhCdW5kbGVzW2J1bmRsZUlkeF07XHJcbiAgICAgICAgICAgIGNvbnN0IHZiQ291bnQgPSBwcmltLmluZGV4VmlldyA/IHByaW0uaW5kZXhWaWV3LmNvdW50IDogdmVydGV4QnVuZGxlLnZpZXcuY291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHZiU3RyaWRlID0gdmVydGV4QnVuZGxlLnZpZXcuc3RyaWRlO1xyXG4gICAgICAgICAgICBjb25zdCB2YlNpemUgPSB2YlN0cmlkZSAqIHZiQ291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheShtZXNoLmRhdGEuYnVmZmVyLCB2ZXJ0ZXhCdW5kbGUudmlldy5vZmZzZXQsIHZlcnRleEJ1bmRsZS52aWV3Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmICghcHJpbS5pbmRleFZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYXRCdWZmZXJzLnB1c2goeyBzdHJpZGU6IHZiU3RyaWRlLCBjb3VudDogdmJDb3VudCwgYnVmZmVyOiB2aWV3IH0pO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmJWaWV3ID0gbmV3IFVpbnQ4QXJyYXkodmJTaXplKTtcclxuICAgICAgICAgICAgY29uc3QgaWJWaWV3ID0gbWVzaC5yZWFkSW5kaWNlcyh0aGlzLnN1Yk1lc2hJZHgpITtcclxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtIHRvIGZsYXQgYnVmZmVyXHJcbiAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgaWR4Q291bnQ7ICsrbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gaWJWaWV3W25dO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gbiAqIHZiU3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3JjT2Zmc2V0ID0gaWR4ICogdmJTdHJpZGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtID0gMDsgbSA8IHZiU3RyaWRlOyArK20pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YlZpZXdbb2Zmc2V0ICsgbV0gPSB2aWV3W3NyY09mZnNldCArIG1dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsYXRCdWZmZXJzLnB1c2goeyBzdHJpZGU6IHZiU3RyaWRlLCBjb3VudDogdmJDb3VudCwgYnVmZmVyOiB2YlZpZXcgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mbGF0QnVmZmVycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmqqOmqvOe0ouW8leaMieaYoOWwhOihqOWkhOeQhuWQjueahOmhtueCuee8k+WGsuOAglxyXG4gICAgICovXHJcbiAgICBnZXQgam9pbnRNYXBwZWRCdWZmZXJzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fam9pbnRNYXBwZWRCdWZmZXJzKSB7IHJldHVybiB0aGlzLl9qb2ludE1hcHBlZEJ1ZmZlcnM7IH1cclxuICAgICAgICBjb25zdCBidWZmZXJzOiBHRlhCdWZmZXJbXSA9IHRoaXMuX2pvaW50TWFwcGVkQnVmZmVycyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gdGhpcy5fam9pbnRNYXBwZWRCdWZmZXJJbmRpY2VzID0gW107XHJcbiAgICAgICAgaWYgKCF0aGlzLm1lc2ggfHwgdGhpcy5zdWJNZXNoSWR4ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHRoaXMuX2pvaW50TWFwcGVkQnVmZmVycyA9IHRoaXMudmVydGV4QnVmZmVyczsgfVxyXG4gICAgICAgIGNvbnN0IHN0cnVjdCA9IHRoaXMubWVzaC5zdHJ1Y3Q7XHJcbiAgICAgICAgY29uc3QgcHJpbSA9IHN0cnVjdC5wcmltaXRpdmVzW3RoaXMuc3ViTWVzaElkeF07XHJcbiAgICAgICAgaWYgKCFzdHJ1Y3Quam9pbnRNYXBzIHx8IHByaW0uam9pbnRNYXBJbmRleCA9PT0gdW5kZWZpbmVkIHx8ICFzdHJ1Y3Quam9pbnRNYXBzW3ByaW0uam9pbnRNYXBJbmRleF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2pvaW50TWFwcGVkQnVmZmVycyA9IHRoaXMudmVydGV4QnVmZmVycztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGpvaW50Rm9ybWF0OiBHRlhGb3JtYXQ7XHJcbiAgICAgICAgbGV0IGpvaW50T2Zmc2V0OiBudW1iZXI7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlOiBHRlhEZXZpY2UgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRldmljZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByaW0udmVydGV4QnVuZGVsSW5kaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBidW5kbGUgPSBzdHJ1Y3QudmVydGV4QnVuZGxlc1twcmltLnZlcnRleEJ1bmRlbEluZGljZXNbaV1dO1xyXG4gICAgICAgICAgICBqb2ludE9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGpvaW50Rm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnVuZGxlLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBidW5kbGUuYXR0cmlidXRlc1tqXTtcclxuICAgICAgICAgICAgICAgIGlmIChhdHRyLm5hbWUgPT09IEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9KT0lOVFMpIHtcclxuICAgICAgICAgICAgICAgICAgICBqb2ludEZvcm1hdCA9IGF0dHIuZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgam9pbnRPZmZzZXQgKz0gR0ZYRm9ybWF0SW5mb3NbYXR0ci5mb3JtYXRdLnNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGpvaW50Rm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5tZXNoLmRhdGEuYnVmZmVyLCBidW5kbGUudmlldy5vZmZzZXQsIGJ1bmRsZS52aWV3Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhkYXRhLnNsaWNlKCkuYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkeE1hcCA9IHN0cnVjdC5qb2ludE1hcHNbcHJpbS5qb2ludE1hcEluZGV4XTtcclxuICAgICAgICAgICAgICAgIG1hcEJ1ZmZlcihkYXRhVmlldywgKGN1cikgPT4gaWR4TWFwLmluZGV4T2YoY3VyKSwgam9pbnRGb3JtYXQsIGpvaW50T2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1bmRsZS52aWV3Lmxlbmd0aCwgYnVuZGxlLnZpZXcuc3RyaWRlLCBkYXRhVmlldyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlZFUlRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVuZGxlLnZpZXcubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1bmRsZS52aWV3LnN0cmlkZSxcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyLnVwZGF0ZShkYXRhVmlldy5idWZmZXIpOyBidWZmZXJzLnB1c2goYnVmZmVyKTsgaW5kaWNlcy5wdXNoKGkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVycy5wdXNoKHRoaXMudmVydGV4QnVmZmVyc1twcmltLnZlcnRleEJ1bmRlbEluZGljZXNbaV1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fdmVydGV4SWRDaGFubmVsKSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcnMucHVzaCh0aGlzLl9hbGxvY1ZlcnRleElkQnVmZmVyKGRldmljZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYnVmZmVycztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaWFJbmZvICgpIHsgcmV0dXJuIHRoaXMuX2lhSW5mbzsgfVxyXG5cclxuICAgIHB1YmxpYyBtZXNoPzogTWVzaDtcclxuICAgIHB1YmxpYyBzdWJNZXNoSWR4PzogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgX2ZsYXRCdWZmZXJzPzogSUZsYXRCdWZmZXJbXTtcclxuICAgIHByaXZhdGUgX2pvaW50TWFwcGVkQnVmZmVycz86IEdGWEJ1ZmZlcltdO1xyXG4gICAgcHJpdmF0ZSBfam9pbnRNYXBwZWRCdWZmZXJJbmRpY2VzPzogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIF92ZXJ0ZXhJZENoYW5uZWw/OiB7IHN0cmVhbTogbnVtYmVyOyBpbmRleDogbnVtYmVyOyB9O1xyXG4gICAgcHJpdmF0ZSBfZ2VvbWV0cmljSW5mbz86IElHZW9tZXRyaWNJbmZvO1xyXG5cclxuICAgIHByaXZhdGUgX3ZlcnRleEJ1ZmZlcnM6IEdGWEJ1ZmZlcltdO1xyXG4gICAgcHJpdmF0ZSBfYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW107XHJcbiAgICBwcml2YXRlIF9pbmRleEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9pbmRpcmVjdEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9wcmltaXRpdmVNb2RlOiBHRlhQcmltaXRpdmVNb2RlO1xyXG4gICAgcHJpdmF0ZSBfaWFJbmZvOiBHRlhJbnB1dEFzc2VtYmxlckluZm87XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHZlcnRleEJ1ZmZlcnM6IEdGWEJ1ZmZlcltdLCBhdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSwgcHJpbWl0aXZlTW9kZTogR0ZYUHJpbWl0aXZlTW9kZSxcclxuICAgICAgICBpbmRleEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGwsIGluZGlyZWN0QnVmZmVyOiBHRlhCdWZmZXIgfCBudWxsID0gbnVsbCxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuX3ZlcnRleEJ1ZmZlcnMgPSB2ZXJ0ZXhCdWZmZXJzO1xyXG4gICAgICAgIHRoaXMuX2luZGV4QnVmZmVyID0gaW5kZXhCdWZmZXI7XHJcbiAgICAgICAgdGhpcy5faW5kaXJlY3RCdWZmZXIgPSBpbmRpcmVjdEJ1ZmZlcjtcclxuICAgICAgICB0aGlzLl9wcmltaXRpdmVNb2RlID0gcHJpbWl0aXZlTW9kZTtcclxuICAgICAgICB0aGlzLl9pYUluZm8gPSBuZXcgR0ZYSW5wdXRBc3NlbWJsZXJJbmZvKGF0dHJpYnV0ZXMsIHZlcnRleEJ1ZmZlcnMsIGluZGV4QnVmZmVyLCBpbmRpcmVjdEJ1ZmZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52ZXJ0ZXhCdWZmZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRleEJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4QnVmZmVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2pvaW50TWFwcGVkQnVmZmVycyAmJiB0aGlzLl9qb2ludE1hcHBlZEJ1ZmZlckluZGljZXMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9qb2ludE1hcHBlZEJ1ZmZlckluZGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50TWFwcGVkQnVmZmVyc1t0aGlzLl9qb2ludE1hcHBlZEJ1ZmZlckluZGljZXNbaV1dLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9qb2ludE1hcHBlZEJ1ZmZlcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2pvaW50TWFwcGVkQnVmZmVySW5kaWNlcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGlyZWN0QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGlyZWN0QnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5faW5kaXJlY3RCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSB2ZXJ0ZXggYXR0cmlidXRlIGlucHV0IGNhbGxlZCAnYV92ZXJ0ZXhJZCcgaW50byB0aGlzIHN1Yi1tZXNoLlxyXG4gICAgICogVGhpcyBpcyB1c2VmdWwgaWYgeW91IHdhbnQgdG8gc2ltdWxhdGUgYGdsX1ZlcnRleElkYCBpbiBXZWJHTCBjb250ZXh0IHByaW9yIHRvIDIuMC5cclxuICAgICAqIE9uY2UgeW91IGNhbGwgdGhpcyBmdW5jdGlvbiwgdGhlIHZlcnRleCBhdHRyaWJ1dGUgaXMgcGVybWFuZW50bHkgYWRkZWQuXHJcbiAgICAgKiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gdGFrZSBubyBlZmZlY3QuXHJcbiAgICAgKiBAcGFyYW0gZGV2aWNlIERldmljZSB1c2VkIHRvIGNyZWF0ZSByZWxhdGVkIHJlbmRlcmluZyByZXNvdXJjZXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmFibGVWZXJ0ZXhJZENoYW5uZWwgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZlcnRleElkQ2hhbm5lbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdHJlYW1JbmRleCA9IHRoaXMudmVydGV4QnVmZmVycy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlSW5kZXggPSB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0ZXhJZEJ1ZmZlciA9IHRoaXMuX2FsbG9jVmVydGV4SWRCdWZmZXIoZGV2aWNlKTtcclxuICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMucHVzaCh2ZXJ0ZXhJZEJ1ZmZlcik7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2gobmV3IEdGWEF0dHJpYnV0ZSgnYV92ZXJ0ZXhJZCcsIEdGWEZvcm1hdC5SMzJGLCBmYWxzZSwgc3RyZWFtSW5kZXgpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fdmVydGV4SWRDaGFubmVsID0ge1xyXG4gICAgICAgICAgICBzdHJlYW06IHN0cmVhbUluZGV4LFxyXG4gICAgICAgICAgICBpbmRleDogYXR0cmlidXRlSW5kZXgsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hbGxvY1ZlcnRleElkQnVmZmVyIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIGNvbnN0IHZlcnRleENvdW50ID0gKHRoaXMudmVydGV4QnVmZmVycy5sZW5ndGggPT09IDAgfHwgdGhpcy52ZXJ0ZXhCdWZmZXJzWzBdLnN0cmlkZSA9PT0gMCkgP1xyXG4gICAgICAgICAgICAwIDpcclxuICAgICAgICAgICAgLy8gVE9ETzogVGhpcyBkZXBlbmRzIG9uIGhvdyBzdHJpZGUgb2YgYSB2ZXJ0ZXggYnVmZmVyIGlzIGRlZmluZWQ7IENvbnNpZGVyIHBhZGRpbmcgcHJvYmxlbS5cclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzWzBdLnNpemUgLyB0aGlzLnZlcnRleEJ1ZmZlcnNbMF0uc3RyaWRlO1xyXG4gICAgICAgIGNvbnN0IHZlcnRleElkcyA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGV4Q291bnQpO1xyXG4gICAgICAgIGZvciAobGV0IGlWZXJ0ZXggPSAwOyBpVmVydGV4IDwgdmVydGV4Q291bnQ7ICsraVZlcnRleCkge1xyXG4gICAgICAgICAgICAvLyBgKzAuNWAgYmVjYXVzZSBvbiBzb21lIHBsYXRmb3JtcywgdGhlIFwiZmV0Y2hlZCBpbnRlZ2VyXCIgbWF5IGhhdmUgc21hbGwgZXJyb3IuXHJcbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlIGAyNmAgbWF5IHlpZWxkIGAyNS45OTk5OWAsIHdoaWNoIGlzIGNvbnZlcnQgdG8gYDI1YCBpbnN0ZWFkIG9mIGAyNmAgdXNpbmcgYGludCgpYC5cclxuICAgICAgICAgICAgdmVydGV4SWRzW2lWZXJ0ZXhdID0gaVZlcnRleCArIDAuNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZlcnRleElkQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVkVSVEVYIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIHZlcnRleElkcy5ieXRlTGVuZ3RoLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhJZHMuQllURVNfUEVSX0VMRU1FTlQsXHJcbiAgICAgICAgKSk7XHJcbiAgICAgICAgdmVydGV4SWRCdWZmZXIudXBkYXRlKHZlcnRleElkcyk7XHJcblxyXG4gICAgICAgIHJldHVybiB2ZXJ0ZXhJZEJ1ZmZlcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIE1lc2gge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQnVmZmVyVmlldyB7XHJcbiAgICAgICAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICAgICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgY291bnQ6IG51bWJlcjtcclxuICAgICAgICBzdHJpZGU6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6aG254K55Z2X44CC6aG254K55Z2X5o+P6L+w5LqG5LiA57uEKirkuqTplJnmjpLliJcqKu+8iGludGVybGVhdmVk77yJ55qE6aG254K55bGe5oCn5bm25a2Y5YKo5LqG6aG254K55bGe5oCn55qE5a6e6ZmF5pWw5o2u44CCPGJyPlxyXG4gICAgICog5Lqk6ZSZ5o6S5YiX5piv5oyH5Zyo5a6e6ZmF5pWw5o2u55qE57yT5Yay5Yy65Lit77yM5q+P5Liq6aG254K555qE5omA5pyJ5bGe5oCn5oC75piv5L6d5qyh5o6S5YiX77yM5bm25oC75piv5Ye6546w5Zyo5LiL5LiA5Liq6aG254K555qE5omA5pyJ5bGe5oCn5LmL5YmN44CCXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVZlcnRleEJ1bmRsZSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5omA5pyJ6aG254K55bGe5oCn55qE5a6e6ZmF5pWw5o2u5Z2X44CCXHJcbiAgICAgICAgICog5L2g5b+F6aG75L2/55SoIERhdGFWaWV3IOadpeivu+WPluaVsOaNruOAglxyXG4gICAgICAgICAqIOWboOS4uuS4jeiDveS/neivgeaJgOacieWxnuaAp+eahOi1t+Wni+WBj+enu+mDveaMiSBUeXBlZEFycmF5IOimgeaxgueahOWtl+iKguWvuem9kOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZpZXc6IElCdWZmZXJWaWV3O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDljIXlkKvnmoTmiYDmnInpobbngrnlsZ7mgKfjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICBhdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWtkOe9keagvOOAguWtkOe9keagvOeUseS4gOezu+WIl+ebuOWQjOexu+Wei+eahOWbvuWFg+e7hOaIkO+8iOS+i+WmgueCueOAgee6v+OAgemdouetie+8ieOAglxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdWJNZXNoIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmraTlrZDnvZHmoLzlvJXnlKjnmoTpobbngrnlnZfvvIzntKLlvJXoh7PnvZHmoLznmoTpobbngrnlnZfmlbDnu4TjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2ZXJ0ZXhCdW5kZWxJbmRpY2VzOiBudW1iZXJbXTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5q2k5a2Q572R5qC855qE5Zu+5YWD57G75Z6L44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpbWl0aXZlTW9kZTogR0ZYUHJpbWl0aXZlTW9kZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5q2k5a2Q572R5qC85L2/55So55qE57Si5byV5pWw5o2u44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaW5kZXhWaWV3PzogSUJ1ZmZlclZpZXc7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOatpOWtkOe9keagvOS9v+eUqOeahOWFs+iKgue0ouW8leaYoOWwhOihqOWcqCBJU3RydWN0LmpvaW50TWFwcyDkuK3nmoTntKLlvJXjgIJcclxuICAgICAgICAgKiDlpoLmnKrlrprkuYnmiJbmjIflkJHnmoTmmKDlsITooajkuI3lrZjlnKjvvIzliJnpu5jorqQgVkIg5YaF5omA5pyJ5YWz6IqC57Si5byV5pWw5o2u55u05o6l5a+55bqU6aqo6aq86LWE5rqQ5pWw5o2u44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgam9pbnRNYXBJbmRleD86IG51bWJlcjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmj4/ov7DkuobnvZHmoLznmoTnu5PmnoTjgIJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3RydWN0IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmraTnvZHmoLzmiYDmnInnmoTpobbngrnlnZfjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICB2ZXJ0ZXhCdW5kbGVzOiBJVmVydGV4QnVuZGxlW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOatpOe9keagvOeahOaJgOacieWtkOe9keagvOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaW1pdGl2ZXM6IElTdWJNZXNoW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIO+8iOWQhOWIhumHj+mDve+8ieWwj+S6juetieS6juatpOe9keagvOS7u+S9lemhtueCueS9jee9rueahOacgOWkp+S9jee9ruOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG1pblBvc2l0aW9uPzogVmVjMztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog77yI5ZCE5YiG6YeP6YO977yJ5aSn5LqO562J5LqO5q2k572R5qC85Lu75L2V6aG254K55L2N572u55qE5pyA5bCP5L2N572u44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbWF4UG9zaXRpb24/OiBWZWMzO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmraTnvZHmoLzkvb/nlKjnmoTlhbPoioLntKLlvJXmmKDlsITlhbPns7vliJfooajvvIzmlbDnu4Tplb/luqblupTkuLrlrZDmqKHlnovkuK3lrp7pmYXkvb/nlKjliLDnmoTmiYDmnInlhbPoioLvvIxcclxuICAgICAgICAgKiDmr4/kuKrlhYPntKDpg73lr7nlupTkuIDkuKrljp/pqqjpqrzotYTmupDph4znmoTntKLlvJXvvIzmjInlrZDmqKHlnosgVkIg5YaF55qE5a6e6ZmF57Si5byV5o6S5YiX44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgam9pbnRNYXBzPzogbnVtYmVyW11bXTtcclxuXHJcbiAgICAgICAgbW9ycGg/OiBNb3JwaDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDcmVhdGVJbmZvIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnvZHmoLznu5PmnoTjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdHJ1Y3Q6IE1lc2guSVN0cnVjdDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog572R5qC85LqM6L+b5Yi25pWw5o2u44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZGF0YTogVWludDhBcnJheTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHYzXzIgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBnbG9iYWxFbXB0eU1lc2hCdWZmZXIgPSBuZXcgVWludDhBcnJheSgpO1xyXG5cclxuLyoqXHJcbiAqIOe9keagvOi1hOa6kOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLk1lc2gnKVxyXG5leHBvcnQgY2xhc3MgTWVzaCBleHRlbmRzIEFzc2V0IHtcclxuXHJcbiAgICBnZXQgX25hdGl2ZUFzc2V0ICgpOiBBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBfbmF0aXZlQXNzZXQgKHZhbHVlOiBBcnJheUJ1ZmZlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9kYXRhLmJ5dGVMZW5ndGggPT09IHZhbHVlLmJ5dGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YS5zZXQobmV3IFVpbnQ4QXJyYXkodmFsdWUpKTtcclxuICAgICAgICAgICAgaWYgKGxlZ2FjeUNDLmxvYWRlci5fY2FjaGVbdGhpcy5uYXRpdmVVcmxdKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5sb2FkZXIuX2NhY2hlW3RoaXMubmF0aXZlVXJsXS5jb250ZW50ID0gdGhpcy5fZGF0YS5idWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraTnvZHmoLznmoTlrZDnvZHmoLzmlbDph4/jgIJcclxuICAgICAqIEBkZXByZWNhdGVkIOivt+S9v+eUqCBgdGhpcy5yZW5kZXJpbmdNZXNoLnN1Yk1lc2hDb3VudGDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHN1Yk1lc2hDb3VudCAoKSB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyaW5nTWVzaCA9IHRoaXMucmVuZGVyaW5nU3ViTWVzaGVzO1xyXG4gICAgICAgIHJldHVybiByZW5kZXJpbmdNZXNoID8gcmVuZGVyaW5nTWVzaC5sZW5ndGggOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog77yI5ZCE5YiG6YeP6YO977yJ5bCP5LqO562J5LqO5q2k572R5qC85Lu75L2V6aG254K55L2N572u55qE5pyA5aSn5L2N572u44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCDor7fkvb/nlKggYHRoaXMuc3RydWN0Lm1pblBvc2l0aW9uYOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWluUG9zaXRpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0cnVjdC5taW5Qb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIO+8iOWQhOWIhumHj+mDve+8ieWkp+S6juetieS6juatpOe9keagvOS7u+S9lemhtueCueS9jee9rueahOacgOWkp+S9jee9ruOAglxyXG4gICAgICogQGRlcHJlY2F0ZWQg6K+35L2/55SoIGB0aGlzLnN0cnVjdC5tYXhQb3NpdGlvbmDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG1heFBvc2l0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdHJ1Y3QubWF4UG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraTnvZHmoLznmoTnu5PmnoTjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHN0cnVjdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0cnVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOatpOe9keagvOeahOaVsOaNruOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGF0YSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraTnvZHmoLznmoTlk4jluIzlgLzjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGhhc2ggKCkge1xyXG4gICAgICAgIC8vIGhhc2hlcyBzaG91bGQgYWxyZWFkeSBiZSBjb21wdXRlZCBvZmZsaW5lLCBidXQgaWYgbm90LCBtYWtlIG9uZVxyXG4gICAgICAgIGlmICghdGhpcy5faGFzaCkgeyB0aGlzLl9oYXNoID0gbXVybXVyaGFzaDJfMzJfZ2ModGhpcy5fZGF0YSwgNjY2KTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBqb2ludEJ1ZmZlckluZGljZXMgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9qb2ludEJ1ZmZlckluZGljZXMpIHsgcmV0dXJuIHRoaXMuX2pvaW50QnVmZmVySW5kaWNlczsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9qb2ludEJ1ZmZlckluZGljZXMgPSB0aGlzLl9zdHJ1Y3QucHJpbWl0aXZlcy5tYXAoKHApID0+IHAuam9pbnRNYXBJbmRleCB8fCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9zdHJ1Y3Q6IE1lc2guSVN0cnVjdCA9IHtcclxuICAgICAgICB2ZXJ0ZXhCdW5kbGVzOiBbXSxcclxuICAgICAgICBwcmltaXRpdmVzOiBbXSxcclxuICAgIH07XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfZGF0YUxlbmd0aCA9IDA7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaGFzaCA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfZGF0YTogVWludDhBcnJheSA9IGdsb2JhbEVtcHR5TWVzaEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgX2luaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9yZW5kZXJpbmdTdWJNZXNoZXM6IFJlbmRlcmluZ1N1Yk1lc2hbXSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfYm9uZVNwYWNlQm91bmRzID0gbmV3IE1hcDxudW1iZXIsIChhYWJiIHwgbnVsbClbXT4oKTtcclxuICAgIHByaXZhdGUgX2pvaW50QnVmZmVySW5kaWNlczogbnVtYmVyW10gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fZGF0YS5ieXRlTGVuZ3RoICE9PSB0aGlzLl9kYXRhTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIGRlZmVycmVkIGxvYWRpbmcsIGB0aGlzLl9kYXRhYCBpcyBjcmVhdGVkIGJlZm9yZVxyXG4gICAgICAgICAgICAvLyB0aGUgYWN0dWFsIGJpbmFyeSBidWZmZXIgaXMgbG9hZGVkLlxyXG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZGF0YUxlbmd0aCk7XHJcbiAgICAgICAgICAgIHBvc3RMb2FkTWVzaCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5fZGF0YS5idWZmZXI7XHJcbiAgICAgICAgY29uc3QgZ2Z4RGV2aWNlOiBHRlhEZXZpY2UgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRldmljZTtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXJzID0gdGhpcy5fY3JlYXRlVmVydGV4QnVmZmVycyhnZnhEZXZpY2UsIGJ1ZmZlcik7XHJcbiAgICAgICAgY29uc3QgaW5kZXhCdWZmZXJzOiBHRlhCdWZmZXJbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHN1Yk1lc2hlczogUmVuZGVyaW5nU3ViTWVzaFtdID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcHJpbSA9IHRoaXMuX3N0cnVjdC5wcmltaXRpdmVzW2ldO1xyXG4gICAgICAgICAgICBpZiAocHJpbS52ZXJ0ZXhCdW5kZWxJbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBpYjogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHByaW0uaW5kZXhWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHhWaWV3ID0gcHJpbS5pbmRleFZpZXc7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGRzdFN0cmlkZSA9IGlkeFZpZXcuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRzdFNpemUgPSBpZHhWaWV3Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlmIChkc3RTdHJpZGUgPT09IDQgJiYgIWdmeERldmljZS5oYXNGZWF0dXJlKEdGWEZlYXR1cmUuRUxFTUVOVF9JTkRFWF9VSU5UKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleENvdW50ID0gdGhpcy5fc3RydWN0LnZlcnRleEJ1bmRsZXNbcHJpbS52ZXJ0ZXhCdW5kZWxJbmRpY2VzWzBdXS52aWV3LmNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhDb3VudCA+PSA2NTUzNikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuSUQoMTAwMDEsIHZlcnRleENvdW50LCA2NTUzNik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBJZ25vcmUgdGhpcyBwcmltaXRpdmVcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkc3RTdHJpZGUgPj49IDE7IC8vIFJlZHVjZSB0byBzaG9ydC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZHN0U2l6ZSA+Pj0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW5kZXhCdWZmZXIgPSBnZnhEZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LklOREVYIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgICAgICAgICBkc3RTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGRzdFN0cmlkZSxcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgaW5kZXhCdWZmZXJzLnB1c2goaW5kZXhCdWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGliID0gbmV3IChnZXRJbmRleFN0cmlkZUN0b3IoaWR4Vmlldy5zdHJpZGUpKShidWZmZXIsIGlkeFZpZXcub2Zmc2V0LCBpZHhWaWV3LmNvdW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHhWaWV3LnN0cmlkZSAhPT0gZHN0U3RyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWIgPSBnZXRJbmRleFN0cmlkZUN0b3IoZHN0U3RyaWRlKS5mcm9tKGliKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4QnVmZmVyLnVwZGF0ZShpYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2UoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4QnVmZmVyIS51cGRhdGUoaWIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2YlJlZmVyZW5jZSA9IHByaW0udmVydGV4QnVuZGVsSW5kaWNlcy5tYXAoKGlkeCkgPT4gdmVydGV4QnVmZmVyc1tpZHhdKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBnZnhBdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAocHJpbS52ZXJ0ZXhCdW5kZWxJbmRpY2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IHByaW0udmVydGV4QnVuZGVsSW5kaWNlc1swXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleEJ1bmRsZSA9IHRoaXMuX3N0cnVjdC52ZXJ0ZXhCdW5kbGVzW2lkeF07XHJcbiAgICAgICAgICAgICAgICBnZnhBdHRyaWJ1dGVzID0gdmVydGV4QnVuZGxlLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHN1Yk1lc2ggPSBuZXcgUmVuZGVyaW5nU3ViTWVzaCh2YlJlZmVyZW5jZSwgZ2Z4QXR0cmlidXRlcywgcHJpbS5wcmltaXRpdmVNb2RlLCBpbmRleEJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHN1Yk1lc2gubWVzaCA9IHRoaXM7IHN1Yk1lc2guc3ViTWVzaElkeCA9IGk7XHJcblxyXG4gICAgICAgICAgICBzdWJNZXNoZXMucHVzaChzdWJNZXNoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmluZ1N1Yk1lc2hlcyA9IHN1Yk1lc2hlcztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3N0cnVjdC5tb3JwaCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vcnBoUmVuZGVyaW5nID0gY3JlYXRlTW9ycGhSZW5kZXJpbmcodGhpcywgZ2Z4RGV2aWNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4HmraTnvZHmoLzvvIzlubbph4rmlL7lroPljaDmnInnmoTmiYDmnIkgR1BVIOi1hOa6kOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95UmVuZGVyaW5nTWVzaCgpO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7mraTnvZHmoLzljaDmnInnmoTmiYDmnIkgR1BVIOi1hOa6kOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveVJlbmRlcmluZ01lc2ggKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJpbmdTdWJNZXNoZXMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9yZW5kZXJpbmdTdWJNZXNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcmluZ1N1Yk1lc2hlc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyaW5nU3ViTWVzaGVzID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph43nva7mraTnvZHmoLznmoTnu5PmnoTlkozmlbDmja7jgIJcclxuICAgICAqIEBwYXJhbSBzdHJ1Y3Qg5paw55qE57uT5p6E44CCXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDmlrDnmoTmlbDmja7jgIJcclxuICAgICAqIEBkZXByZWNhdGVkIOWwhuWcqCBWMS4wLjAg56e76Zmk77yM6K+36L2s55SoIGB0aGlzLnJlc2V0KClg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3NpZ24gKHN0cnVjdDogTWVzaC5JU3RydWN0LCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICAgICAgdGhpcy5yZXNldCh7XHJcbiAgICAgICAgICAgIHN0cnVjdCxcclxuICAgICAgICAgICAgZGF0YSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHjee9ruatpOe9keagvOOAglxyXG4gICAgICogQHBhcmFtIGluZm8g572R5qC86YeN572u6YCJ6aG544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldCAoaW5mbzogTWVzaC5JQ3JlYXRlSW5mbykge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVJlbmRlcmluZ01lc2goKTtcclxuICAgICAgICB0aGlzLl9zdHJ1Y3QgPSBpbmZvLnN0cnVjdDtcclxuICAgICAgICB0aGlzLl9kYXRhID0gaW5mby5kYXRhO1xyXG4gICAgICAgIHRoaXMuX2RhdGFMZW5ndGggPSB0aGlzLmRhdGEuYnl0ZUxlbmd0aDtcclxuICAgICAgICB0aGlzLl9oYXNoID0gMDtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmraTnvZHmoLzliJvlu7rnmoTmuLLmn5PnvZHmoLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCByZW5kZXJpbmdTdWJNZXNoZXMgKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJpbmdTdWJNZXNoZXMhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRCb25lU3BhY2VCb3VuZHMgKHNrZWxldG9uOiBTa2VsZXRvbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9ib25lU3BhY2VCb3VuZHMuaGFzKHNrZWxldG9uLmhhc2gpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib25lU3BhY2VCb3VuZHMuZ2V0KHNrZWxldG9uLmhhc2gpITtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYm91bmRzOiAoYWFiYiB8IG51bGwpW10gPSBbXTtcclxuICAgICAgICB0aGlzLl9ib25lU3BhY2VCb3VuZHMuc2V0KHNrZWxldG9uLmhhc2gsIGJvdW5kcyk7XHJcbiAgICAgICAgY29uc3QgdmFsaWQ6IGJvb2xlYW5bXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGJpbmRwb3NlcyA9IHNrZWxldG9uLmJpbmRwb3NlcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmRwb3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBib3VuZHMucHVzaChuZXcgYWFiYihJbmZpbml0eSwgSW5maW5pdHksIEluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5KSk7XHJcbiAgICAgICAgICAgIHZhbGlkLnB1c2goZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwcmltaXRpdmVzID0gdGhpcy5fc3RydWN0LnByaW1pdGl2ZXM7XHJcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcmltaXRpdmVzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGpvaW50cyA9IHRoaXMucmVhZEF0dHJpYnV0ZShwLCBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfSk9JTlRTKTtcclxuICAgICAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IHRoaXMucmVhZEF0dHJpYnV0ZShwLCBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfV0VJR0hUUyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMucmVhZEF0dHJpYnV0ZShwLCBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04pO1xyXG4gICAgICAgICAgICBpZiAoIWpvaW50cyB8fCAhd2VpZ2h0cyB8fCAhcG9zaXRpb25zKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRDb3VudCA9IE1hdGgubWluKGpvaW50cy5sZW5ndGggLyA0LCB3ZWlnaHRzLmxlbmd0aCAvIDQsIHBvc2l0aW9ucy5sZW5ndGggLyAzKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodjNfMSwgcG9zaXRpb25zWzMgKiBpICsgMF0sIHBvc2l0aW9uc1szICogaSArIDFdLCBwb3NpdGlvbnNbMyAqIGkgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDQ7ICsraikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IDQgKiBpICsgajtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBqb2ludCA9IGpvaW50c1tpZHhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3ZWlnaHRzW2lkeF0gPT09IDAgfHwgam9pbnQgPj0gYmluZHBvc2VzLmxlbmd0aCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NCh2M18yLCB2M18xLCBiaW5kcG9zZXNbam9pbnRdKTtcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZFtqb2ludF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBib3VuZHNbam9pbnRdITtcclxuICAgICAgICAgICAgICAgICAgICBWZWMzLm1pbihiLmNlbnRlciwgYi5jZW50ZXIsIHYzXzIpO1xyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMubWF4KGIuaGFsZkV4dGVudHMsIGIuaGFsZkV4dGVudHMsIHYzXzIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluZHBvc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSBib3VuZHNbaV0hO1xyXG4gICAgICAgICAgICBpZiAoIXZhbGlkW2ldKSB7IGJvdW5kc1tpXSA9IG51bGw7IH1cclxuICAgICAgICAgICAgZWxzZSB7IGFhYmIuZnJvbVBvaW50cyhiLCBiLmNlbnRlciwgYi5oYWxmRXh0ZW50cyk7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWQiOW5tuaMh+WumueahOe9keagvOWIsOatpOe9keagvOS4reOAglxyXG4gICAgICogQHBhcmFtIG1lc2gg5ZCI5bm255qE572R5qC844CCXHJcbiAgICAgKiBAcGFyYW0gd29ybGRNYXRyaXgg5ZCI5bm255qE572R5qC855qE5LiW55WM5Y+Y5o2i55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gW3ZhbGlkYXRlPWZhbHNlXSDmmK/lkKbov5vooYzpqozor4HjgIJcclxuICAgICAqIEByZXR1cm5zIOaYr+WQpumqjOivgeaIkOWKn+OAguiLpemqjOivgemAiemhueS4uiBgdHJ1ZWAg5LiU6aqM6K+B5pyq6YCa6L+H5YiZ6L+U5ZueIGBmYWxzZWDvvIzlkKbliJnov5Tlm54gYHRydWVg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtZXJnZSAobWVzaDogTWVzaCwgd29ybGRNYXRyaXg/OiBNYXQ0LCB2YWxpZGF0ZT86IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodmFsaWRhdGUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmxvYWRlZCB8fCAhbWVzaC5sb2FkZWQgfHwgIXRoaXMudmFsaWRhdGVNZXJnaW5nTWVzaChtZXNoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2ZWMzX3RlbXAgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIGNvbnN0IHJvdGF0ZSA9IHdvcmxkTWF0cml4ICYmIG5ldyBRdWF0KCk7XHJcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSB3b3JsZE1hdHJpeCAmJiBuZXcgYWFiYigpO1xyXG4gICAgICAgIGlmIChyb3RhdGUpIHtcclxuICAgICAgICAgICAgd29ybGRNYXRyaXghLmdldFJvdGF0aW9uKHJvdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5faW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RydWN0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtZXNoLl9zdHJ1Y3QpKSBhcyBNZXNoLklTdHJ1Y3Q7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBtZXNoLl9kYXRhLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIGlmICh3b3JsZE1hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0cnVjdC5tYXhQb3NpdGlvbiAmJiBzdHJ1Y3QubWluUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBWZWMzLmFkZChib3VuZGluZ0JveCEuY2VudGVyLCBzdHJ1Y3QubWF4UG9zaXRpb24sIHN0cnVjdC5taW5Qb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihib3VuZGluZ0JveCEuY2VudGVyLCBib3VuZGluZ0JveCEuY2VudGVyLCAwLjUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzLCBzdHJ1Y3QubWF4UG9zaXRpb24sIHN0cnVjdC5taW5Qb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihib3VuZGluZ0JveCEuaGFsZkV4dGVudHMsIGJvdW5kaW5nQm94IS5oYWxmRXh0ZW50cywgMC41KTtcclxuICAgICAgICAgICAgICAgICAgICBhYWJiLnRyYW5zZm9ybShib3VuZGluZ0JveCEsIGJvdW5kaW5nQm94ISwgd29ybGRNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMuYWRkKHN0cnVjdC5tYXhQb3NpdGlvbiwgYm91bmRpbmdCb3ghLmNlbnRlciwgYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHN0cnVjdC5taW5Qb3NpdGlvbiwgYm91bmRpbmdCb3ghLmNlbnRlciwgYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0LnZlcnRleEJ1bmRsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2dHhCZGwgPSBzdHJ1Y3QudmVydGV4QnVuZGxlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHZ0eEJkbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2dHhCZGwuYXR0cmlidXRlc1tqXS5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04gfHwgdnR4QmRsLmF0dHJpYnV0ZXNbal0ubmFtZSA9PT0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX05PUk1BTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybWF0ID0gdnR4QmRsLmF0dHJpYnV0ZXNbal0uZm9ybWF0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0VmlldyA9IG5ldyBEYXRhVmlldyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2dHhCZGwudmlldy5vZmZzZXQgKyBnZXRPZmZzZXQodnR4QmRsLmF0dHJpYnV0ZXMsIGopKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBnZXRSZWFkZXIoaW5wdXRWaWV3LCBmb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3JpdGVyID0gZ2V0V3JpdGVyKGlucHV0VmlldywgZm9ybWF0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVhZGVyIHx8ICF3cml0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleENvdW50ID0gdnR4QmRsLnZpZXcuY291bnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4U3RyaWRlID0gdnR4QmRsLnZpZXcuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ckNvbXBvbmVudEJ5dGVMZW5ndGggPSBnZXRDb21wb25lbnRCeXRlTGVuZ3RoKGZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB2dHhJZHggPSAwOyB2dHhJZHggPCB2ZXJ0ZXhDb3VudDsgdnR4SWR4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4T2Zmc2V0ID0gdnR4SWR4ICogdmVydGV4U3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHlPZmZzZXQgPSB4T2Zmc2V0ICsgYXR0ckNvbXBvbmVudEJ5dGVMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgek9mZnNldCA9IHlPZmZzZXQgKyBhdHRyQ29tcG9uZW50Qnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWMzX3RlbXAuc2V0KHJlYWRlcih4T2Zmc2V0KSwgcmVhZGVyKHlPZmZzZXQpLCByZWFkZXIoek9mZnNldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodnR4QmRsLmF0dHJpYnV0ZXNbal0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9QT1NJVElPTjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzNfdGVtcC50cmFuc2Zvcm1NYXQ0KHdvcmxkTWF0cml4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUw6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQodmVjM190ZW1wLCB2ZWMzX3RlbXAsIHJvdGF0ZSEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlcih4T2Zmc2V0LCB2ZWMzX3RlbXAueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGVyKHlPZmZzZXQsIHZlYzNfdGVtcC55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0ZXIoek9mZnNldCwgdmVjM190ZW1wLnopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQoeyBzdHJ1Y3QsIGRhdGEgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIG1lcmdlIGJ1ZmZlclxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlckJsb2IgPSBuZXcgQnVmZmVyQmxvYigpO1xyXG5cclxuICAgICAgICAvLyBtZXJnZSB2ZXJ0ZXggYnVmZmVyXHJcbiAgICAgICAgbGV0IHZlcnRDb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IHZlcnRTdHJpZGUgPSAwO1xyXG4gICAgICAgIGxldCBzcmNPZmZzZXQgPSAwO1xyXG4gICAgICAgIGxldCBkc3RPZmZzZXQgPSAwO1xyXG4gICAgICAgIGxldCB2YjogQXJyYXlCdWZmZXI7XHJcbiAgICAgICAgbGV0IHZiVmlldzogVWludDhBcnJheTtcclxuICAgICAgICBsZXQgc3JjVkJWaWV3OiBVaW50OEFycmF5O1xyXG4gICAgICAgIGxldCBkc3RWQlZpZXc6IFVpbnQ4QXJyYXk7XHJcbiAgICAgICAgbGV0IHNyY0F0dHJPZmZzZXQgPSAwO1xyXG4gICAgICAgIGxldCBzcmNWQk9mZnNldCA9IDA7XHJcbiAgICAgICAgbGV0IGRzdFZCT2Zmc2V0ID0gMDtcclxuICAgICAgICBsZXQgYXR0clNpemUgPSAwO1xyXG4gICAgICAgIGxldCBkc3RBdHRyVmlldzogVWludDhBcnJheTtcclxuICAgICAgICBsZXQgaGFzQXR0ciA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdW5kbGVzID0gbmV3IEFycmF5PE1lc2guSVZlcnRleEJ1bmRsZT4odGhpcy5fc3RydWN0LnZlcnRleEJ1bmRsZXMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3N0cnVjdC52ZXJ0ZXhCdW5kbGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1bmRsZSA9IHRoaXMuX3N0cnVjdC52ZXJ0ZXhCdW5kbGVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBkc3RCdW5kbGUgPSBtZXNoLl9zdHJ1Y3QudmVydGV4QnVuZGxlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIHNyY09mZnNldCA9IGJ1bmRsZS52aWV3Lm9mZnNldDtcclxuICAgICAgICAgICAgZHN0T2Zmc2V0ID0gZHN0QnVuZGxlLnZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICB2ZXJ0U3RyaWRlID0gYnVuZGxlLnZpZXcuc3RyaWRlO1xyXG4gICAgICAgICAgICB2ZXJ0Q291bnQgPSBidW5kbGUudmlldy5jb3VudCArIGRzdEJ1bmRsZS52aWV3LmNvdW50O1xyXG5cclxuICAgICAgICAgICAgdmIgPSBuZXcgQXJyYXlCdWZmZXIodmVydENvdW50ICogdmVydFN0cmlkZSk7XHJcbiAgICAgICAgICAgIHZiVmlldyA9IG5ldyBVaW50OEFycmF5KHZiKTtcclxuXHJcbiAgICAgICAgICAgIHNyY1ZCVmlldyA9IHRoaXMuX2RhdGEuc3ViYXJyYXkoc3JjT2Zmc2V0LCBzcmNPZmZzZXQgKyBidW5kbGUudmlldy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBzcmNPZmZzZXQgKz0gc3JjVkJWaWV3Lmxlbmd0aDtcclxuICAgICAgICAgICAgZHN0VkJWaWV3ID0gbWVzaC5fZGF0YS5zdWJhcnJheShkc3RPZmZzZXQsIGRzdE9mZnNldCArIGRzdEJ1bmRsZS52aWV3Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGRzdE9mZnNldCArPSBkc3RWQlZpZXcubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgdmJWaWV3LnNldChzcmNWQlZpZXcpO1xyXG5cclxuICAgICAgICAgICAgc3JjQXR0ck9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBidW5kbGUuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgZHN0VkJPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICAgICAgaGFzQXR0ciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBkc3RBdHRyIG9mIGRzdEJ1bmRsZS5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIubmFtZSA9PT0gZHN0QXR0ci5uYW1lICYmIGF0dHIuZm9ybWF0ID09PSBkc3RBdHRyLmZvcm1hdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNBdHRyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRzdFZCT2Zmc2V0ICs9IEdGWEZvcm1hdEluZm9zW2RzdEF0dHIuZm9ybWF0XS5zaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGhhc0F0dHIpIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyU2l6ZSA9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XS5zaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIHNyY1ZCT2Zmc2V0ID0gYnVuZGxlLnZpZXcubGVuZ3RoICsgc3JjQXR0ck9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB2ID0gMDsgdiA8IGRzdEJ1bmRsZS52aWV3LmNvdW50OyArK3YpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHN0QXR0clZpZXcgPSBkc3RWQlZpZXcuc3ViYXJyYXkoZHN0VkJPZmZzZXQsIGRzdFZCT2Zmc2V0ICsgYXR0clNpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YlZpZXcuc2V0KGRzdEF0dHJWaWV3LCBzcmNWQk9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYXR0ci5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04gfHwgYXR0ci5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfTk9STUFMKSAmJiB3b3JsZE1hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZjMyX3RlbXAgPSBuZXcgRmxvYXQzMkFycmF5KHZiVmlldy5idWZmZXIsIHNyY1ZCT2Zmc2V0LCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzNfdGVtcC5zZXQoZjMyX3RlbXBbMF0sIGYzMl90ZW1wWzFdLCBmMzJfdGVtcFsyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGF0dHIubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWMzX3RlbXAudHJhbnNmb3JtTWF0NCh3b3JsZE1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYQXR0cmlidXRlTmFtZS5BVFRSX05PUk1BTDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KHZlYzNfdGVtcCwgdmVjM190ZW1wLCByb3RhdGUhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmMzJfdGVtcFswXSA9IHZlYzNfdGVtcC54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZjMyX3RlbXBbMV0gPSB2ZWMzX3RlbXAueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYzMl90ZW1wWzJdID0gdmVjM190ZW1wLno7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjVkJPZmZzZXQgKz0gYnVuZGxlLnZpZXcuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkc3RWQk9mZnNldCArPSBkc3RCdW5kbGUudmlldy5zdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3JjQXR0ck9mZnNldCArPSBHRlhGb3JtYXRJbmZvc1thdHRyLmZvcm1hdF0uc2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmVydGV4QnVuZGxlc1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGJ1bmRsZS5hdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICAgICAgdmlldzoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogYnVmZmVyQmxvYi5nZXRMZW5ndGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHZiLmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IHZlcnRDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBzdHJpZGU6IHZlcnRTdHJpZGUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgYnVmZmVyQmxvYi5hZGRCdWZmZXIodmIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWVyZ2UgaW5kZXggYnVmZmVyXHJcbiAgICAgICAgbGV0IGlkeENvdW50ID0gMDtcclxuICAgICAgICBsZXQgaWR4U3RyaWRlID0gMjtcclxuICAgICAgICBsZXQgdmVydEJhdGNoQ291bnQgPSAwO1xyXG4gICAgICAgIGxldCBpYlZpZXc6IFVpbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5O1xyXG4gICAgICAgIGxldCBzcmNJQlZpZXc6IFVpbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5O1xyXG4gICAgICAgIGxldCBkc3RJQlZpZXc6IFVpbnQ4QXJyYXkgfCBVaW50MTZBcnJheSB8IFVpbnQzMkFycmF5O1xyXG5cclxuICAgICAgICBjb25zdCBwcmltaXRpdmVzOiBNZXNoLklTdWJNZXNoW10gPSBuZXcgQXJyYXk8TWVzaC5JU3ViTWVzaD4odGhpcy5fc3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3N0cnVjdC5wcmltaXRpdmVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByaW0gPSB0aGlzLl9zdHJ1Y3QucHJpbWl0aXZlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgZHN0UHJpbSA9IG1lc2guX3N0cnVjdC5wcmltaXRpdmVzW2ldO1xyXG5cclxuICAgICAgICAgICAgcHJpbWl0aXZlc1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIHByaW1pdGl2ZU1vZGU6IHByaW0ucHJpbWl0aXZlTW9kZSxcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1bmRlbEluZGljZXM6IHByaW0udmVydGV4QnVuZGVsSW5kaWNlcyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYnVuZGxlSWR4IG9mIHByaW0udmVydGV4QnVuZGVsSW5kaWNlcykge1xyXG4gICAgICAgICAgICAgICAgdmVydEJhdGNoQ291bnQgPSBNYXRoLm1heCh2ZXJ0QmF0Y2hDb3VudCwgdGhpcy5fc3RydWN0LnZlcnRleEJ1bmRsZXNbYnVuZGxlSWR4XS52aWV3LmNvdW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHByaW0uaW5kZXhWaWV3ICYmIGRzdFByaW0uaW5kZXhWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICBpZHhDb3VudCA9IHByaW0uaW5kZXhWaWV3LmNvdW50O1xyXG4gICAgICAgICAgICAgICAgaWR4Q291bnQgKz0gZHN0UHJpbS5pbmRleFZpZXcuY291bnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgc3JjT2Zmc2V0ID0gcHJpbS5pbmRleFZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgZHN0T2Zmc2V0ID0gZHN0UHJpbS5pbmRleFZpZXcub2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpZHhDb3VudCA8IDI1Nikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkeFN0cmlkZSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlkeENvdW50IDwgNjU1MzYpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHhTdHJpZGUgPSAyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHhTdHJpZGUgPSA0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGliID0gbmV3IEFycmF5QnVmZmVyKGlkeENvdW50ICogaWR4U3RyaWRlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHhTdHJpZGUgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpYlZpZXcgPSBuZXcgVWludDE2QXJyYXkoaWIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpZHhTdHJpZGUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpYlZpZXcgPSBuZXcgVWludDhBcnJheShpYik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBVaW50MzJcclxuICAgICAgICAgICAgICAgICAgICBpYlZpZXcgPSBuZXcgVWludDMyQXJyYXkoaWIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIHNyYyBpbmRpY2VzXHJcbiAgICAgICAgICAgICAgICBpZiAocHJpbS5pbmRleFZpZXcuc3RyaWRlID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjSUJWaWV3ID0gbmV3IFVpbnQxNkFycmF5KHRoaXMuX2RhdGEuYnVmZmVyLCBzcmNPZmZzZXQsIHByaW0uaW5kZXhWaWV3LmNvdW50KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJpbS5pbmRleFZpZXcuc3RyaWRlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjSUJWaWV3ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZGF0YS5idWZmZXIsIHNyY09mZnNldCwgcHJpbS5pbmRleFZpZXcuY291bnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gVWludDMyXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjSUJWaWV3ID0gbmV3IFVpbnQzMkFycmF5KHRoaXMuX2RhdGEuYnVmZmVyLCBzcmNPZmZzZXQsIHByaW0uaW5kZXhWaWV3LmNvdW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWR4U3RyaWRlID09PSBwcmltLmluZGV4Vmlldy5zdHJpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpYlZpZXcuc2V0KHNyY0lCVmlldyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcHJpbS5pbmRleFZpZXcuY291bnQ7ICsrbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpYlZpZXdbbl0gPSBzcmNJQlZpZXdbbl07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3JjT2Zmc2V0ICs9IHByaW0uaW5kZXhWaWV3Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBkc3QgaW5kaWNlc1xyXG4gICAgICAgICAgICAgICAgaWYgKGRzdFByaW0uaW5kZXhWaWV3LnN0cmlkZSA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdElCVmlldyA9IG5ldyBVaW50MTZBcnJheShtZXNoLl9kYXRhLmJ1ZmZlciwgZHN0T2Zmc2V0LCBkc3RQcmltLmluZGV4Vmlldy5jb3VudCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRzdFByaW0uaW5kZXhWaWV3LnN0cmlkZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdElCVmlldyA9IG5ldyBVaW50OEFycmF5KG1lc2guX2RhdGEuYnVmZmVyLCBkc3RPZmZzZXQsIGRzdFByaW0uaW5kZXhWaWV3LmNvdW50KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIFVpbnQzMlxyXG4gICAgICAgICAgICAgICAgICAgIGRzdElCVmlldyA9IG5ldyBVaW50MzJBcnJheShtZXNoLl9kYXRhLmJ1ZmZlciwgZHN0T2Zmc2V0LCBkc3RQcmltLmluZGV4Vmlldy5jb3VudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IGRzdFByaW0uaW5kZXhWaWV3LmNvdW50OyArK24pIHtcclxuICAgICAgICAgICAgICAgICAgICBpYlZpZXdbcHJpbS5pbmRleFZpZXcuY291bnQgKyBuXSA9IHZlcnRCYXRjaENvdW50ICsgZHN0SUJWaWV3W25dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZHN0T2Zmc2V0ICs9IGRzdFByaW0uaW5kZXhWaWV3Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBwcmltaXRpdmVzW2ldLmluZGV4VmlldyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGJ1ZmZlckJsb2IuZ2V0TGVuZ3RoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBpYi5ieXRlTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBpZHhDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBzdHJpZGU6IGlkeFN0cmlkZSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgYnVmZmVyQmxvYi5zZXROZXh0QWxpZ25tZW50KGlkeFN0cmlkZSk7XHJcbiAgICAgICAgICAgICAgICBidWZmZXJCbG9iLmFkZEJ1ZmZlcihpYik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgbWVzaCBzdHJ1Y3QuXHJcbiAgICAgICAgY29uc3QgbWVzaFN0cnVjdDogTWVzaC5JU3RydWN0ID0ge1xyXG4gICAgICAgICAgICB2ZXJ0ZXhCdW5kbGVzLFxyXG4gICAgICAgICAgICBwcmltaXRpdmVzLFxyXG4gICAgICAgICAgICBtaW5Qb3NpdGlvbjogdGhpcy5fc3RydWN0Lm1pblBvc2l0aW9uLFxyXG4gICAgICAgICAgICBtYXhQb3NpdGlvbjogdGhpcy5fc3RydWN0Lm1heFBvc2l0aW9uLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChtZXNoU3RydWN0Lm1pblBvc2l0aW9uICYmIG1lc2guX3N0cnVjdC5taW5Qb3NpdGlvbiAmJiBtZXNoU3RydWN0Lm1heFBvc2l0aW9uICYmIG1lc2guX3N0cnVjdC5tYXhQb3NpdGlvbikge1xyXG4gICAgICAgICAgICBpZiAod29ybGRNYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuYWRkKGJvdW5kaW5nQm94IS5jZW50ZXIsIG1lc2guX3N0cnVjdC5tYXhQb3NpdGlvbiwgbWVzaC5fc3RydWN0Lm1pblBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIoYm91bmRpbmdCb3ghLmNlbnRlciwgYm91bmRpbmdCb3ghLmNlbnRlciwgMC41KTtcclxuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzLCBtZXNoLl9zdHJ1Y3QubWF4UG9zaXRpb24sIG1lc2guX3N0cnVjdC5taW5Qb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKGJvdW5kaW5nQm94IS5oYWxmRXh0ZW50cywgYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzLCAwLjUpO1xyXG4gICAgICAgICAgICAgICAgYWFiYi50cmFuc2Zvcm0oYm91bmRpbmdCb3ghLCBib3VuZGluZ0JveCEsIHdvcmxkTWF0cml4KTtcclxuICAgICAgICAgICAgICAgIFZlYzMuYWRkKHZlYzNfdGVtcCwgYm91bmRpbmdCb3ghLmNlbnRlciwgYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICAgICAgICAgIFZlYzMubWF4KG1lc2hTdHJ1Y3QubWF4UG9zaXRpb24sIG1lc2hTdHJ1Y3QubWF4UG9zaXRpb24sIHZlYzNfdGVtcCk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHZlYzNfdGVtcCwgYm91bmRpbmdCb3ghLmNlbnRlciwgYm91bmRpbmdCb3ghLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICAgICAgICAgIFZlYzMubWluKG1lc2hTdHJ1Y3QubWluUG9zaXRpb24sIG1lc2hTdHJ1Y3QubWluUG9zaXRpb24sIHZlYzNfdGVtcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLm1pbihtZXNoU3RydWN0Lm1pblBvc2l0aW9uLCBtZXNoU3RydWN0Lm1pblBvc2l0aW9uLCBtZXNoLl9zdHJ1Y3QubWluUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5tYXgobWVzaFN0cnVjdC5tYXhQb3NpdGlvbiwgbWVzaFN0cnVjdC5tYXhQb3NpdGlvbiwgbWVzaC5fc3RydWN0Lm1heFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIG1lc2guXHJcbiAgICAgICAgdGhpcy5yZXNldCh7XHJcbiAgICAgICAgICAgIHN0cnVjdDogbWVzaFN0cnVjdCxcclxuICAgICAgICAgICAgZGF0YTogbmV3IFVpbnQ4QXJyYXkoYnVmZmVyQmxvYi5nZXRDb21iaW5lZCgpKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpqozor4HmjIflrprnvZHmoLzmmK/lkKblj6/ku6XlkIjlubboh7PlvZPliY3nvZHmoLzjgIJcclxuICAgICAqXHJcbiAgICAgKiDlvZPmu6HotrPku6XkuIvmnaHku7bkuYvkuIDml7bvvIzmjIflrprnvZHmoLzlj6/ku6XlkIjlubboh7PlvZPliY3nvZHmoLzvvJpcclxuICAgICAqICAtIOW9k+WJjee9keagvOaXoOaVsOaNruiAjOW+heWQiOW5tue9keagvOacieaVsOaNru+8m1xyXG4gICAgICogIC0g5a6D5Lus55qE6aG254K55Z2X5pWw55uu55u45ZCM5LiU5a+55bqU6aG254K55Z2X55qE5biD5bGA5LiA6Ie077yM5bm25LiU5a6D5Lus55qE5a2Q572R5qC85pWw55uu55u45ZCM5LiU5a+55bqU5a2Q572R5qC855qE5biD5bGA5LiA6Ie044CCXHJcbiAgICAgKlxyXG4gICAgICog5Lik5Liq6aG254K55Z2X5biD5bGA5LiA6Ie05b2T5LiU5LuF5b2T77yaXHJcbiAgICAgKiAgLSDlroPku6zlhbfmnInnm7jlkIzmlbDph4/nmoTpobbngrnlsZ7mgKfkuJTlr7nlupTnmoTpobbngrnlsZ7mgKflhbfmnInnm7jlkIznmoTlsZ7mgKfmoLzlvI/jgIJcclxuICAgICAqXHJcbiAgICAgKiDkuKTkuKrlrZDnvZHmoLzluIPlsYDkuIDoh7TvvIzlvZPkuJTku4XlvZPvvJpcclxuICAgICAqICAtIOWug+S7rOWFt+acieebuOWQjOeahOWbvuWFg+exu+Wei+W5tuS4lOW8leeUqOebuOWQjOaVsOmHj+OAgeebuOWQjOe0ouW8leeahOmhtueCueWdl++8m+W5tuS4lO+8jFxyXG4gICAgICogIC0g6KaB5LmI6YO96ZyA6KaB57Si5byV57uY5Yi277yM6KaB5LmI6YO95LiN6ZyA6KaB57Si5byV57uY5Yi244CCXHJcbiAgICAgKiBAcGFyYW0gbWVzaCDmjIflrprnmoTnvZHmoLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHZhbGlkYXRlTWVyZ2luZ01lc2ggKG1lc2g6IE1lc2gpIHtcclxuICAgICAgICAvLyB2YWxpZGF0ZSB2ZXJ0ZXggYnVuZGxlc1xyXG4gICAgICAgIGlmICh0aGlzLl9zdHJ1Y3QudmVydGV4QnVuZGxlcy5sZW5ndGggIT09IG1lc2guX3N0cnVjdC52ZXJ0ZXhCdW5kbGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3N0cnVjdC52ZXJ0ZXhCdW5kbGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1bmRsZSA9IHRoaXMuX3N0cnVjdC52ZXJ0ZXhCdW5kbGVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBkc3RCdW5kbGUgPSBtZXNoLl9zdHJ1Y3QudmVydGV4QnVuZGxlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChidW5kbGUuYXR0cmlidXRlcy5sZW5ndGggIT09IGRzdEJ1bmRsZS5hdHRyaWJ1dGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYnVuZGxlLmF0dHJpYnV0ZXMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgICAgIGlmIChidW5kbGUuYXR0cmlidXRlc1tqXS5mb3JtYXQgIT09IGRzdEJ1bmRsZS5hdHRyaWJ1dGVzW2pdLmZvcm1hdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdmFsaWRhdGUgcHJpbWl0aXZlc1xyXG4gICAgICAgIGlmICh0aGlzLl9zdHJ1Y3QucHJpbWl0aXZlcy5sZW5ndGggIT09IG1lc2guX3N0cnVjdC5wcmltaXRpdmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJpbSA9IHRoaXMuX3N0cnVjdC5wcmltaXRpdmVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBkc3RQcmltID0gbWVzaC5fc3RydWN0LnByaW1pdGl2ZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChwcmltLnZlcnRleEJ1bmRlbEluZGljZXMubGVuZ3RoICE9PSBkc3RQcmltLnZlcnRleEJ1bmRlbEluZGljZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcmltLnZlcnRleEJ1bmRlbEluZGljZXMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmltLnZlcnRleEJ1bmRlbEluZGljZXNbal0gIT09IGRzdFByaW0udmVydGV4QnVuZGVsSW5kaWNlc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJpbS5wcmltaXRpdmVNb2RlICE9PSBkc3RQcmltLnByaW1pdGl2ZU1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHByaW0uaW5kZXhWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZHN0UHJpbS5pbmRleFZpZXcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChkc3RQcmltLmluZGV4Vmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDor7vlj5blrZDnvZHmoLznmoTmjIflrprlsZ7mgKfjgIJcclxuICAgICAqIEBwYXJhbSBwcmltaXRpdmVJbmRleCDlrZDnvZHmoLzntKLlvJXjgIJcclxuICAgICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lIOWxnuaAp+WQjeensOOAglxyXG4gICAgICogQHJldHVybnMg5LiN5a2Y5Zyo5oyH5a6a55qE5a2Q572R5qC844CB5a2Q572R5qC85LiN5a2Y5Zyo5oyH5a6a55qE5bGe5oCn5oiW5bGe5oCn5peg5rOV6K+75Y+W5pe26L+U5ZueIGBudWxsYO+8jFxyXG4gICAgICog5ZCm5YiZ77yM5Yib5bu66Laz5aSf5aSn55qE57yT5Yay5Yy65YyF5ZCr5oyH5a6a5bGe5oCn55qE5omA5pyJ5pWw5o2u77yM5bm25Li66K+l57yT5Yay5Yy65Yib5bu65LiO5bGe5oCn57G75Z6L5a+55bqU55qE5pWw57uE6KeG5Zu+44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkQXR0cmlidXRlIChwcmltaXRpdmVJbmRleDogbnVtYmVyLCBhdHRyaWJ1dGVOYW1lOiBHRlhBdHRyaWJ1dGVOYW1lKTogU3RvcmFnZSB8IG51bGwge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFR5cGVkQXJyYXkgfCBudWxsID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9hY2Nlc3NBdHRyaWJ1dGUocHJpbWl0aXZlSW5kZXgsIGF0dHJpYnV0ZU5hbWUsICh2ZXJ0ZXhCdW5kbGUsIGlBdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4Q291bnQgPSB2ZXJ0ZXhCdW5kbGUudmlldy5jb3VudDtcclxuICAgICAgICAgICAgY29uc3QgZm9ybWF0ID0gdmVydGV4QnVuZGxlLmF0dHJpYnV0ZXNbaUF0dHJpYnV0ZV0uZm9ybWF0O1xyXG4gICAgICAgICAgICBjb25zdCBzdG9yYWdlQ29uc3RydWN0b3IgPSBnZXRUeXBlZEFycmF5Q29uc3RydWN0b3IoR0ZYRm9ybWF0SW5mb3NbZm9ybWF0XSk7XHJcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXhDb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzdG9yYWdlQ29uc3RydWN0b3IoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5wdXRWaWV3ID0gbmV3IERhdGFWaWV3KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhCdW5kbGUudmlldy5vZmZzZXQgKyBnZXRPZmZzZXQodmVydGV4QnVuZGxlLmF0dHJpYnV0ZXMsIGlBdHRyaWJ1dGUpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdEluZm8gPSBHRlhGb3JtYXRJbmZvc1tmb3JtYXRdO1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBnZXRSZWFkZXIoaW5wdXRWaWV3LCBmb3JtYXQpO1xyXG4gICAgICAgICAgICBpZiAoIXN0b3JhZ2VDb25zdHJ1Y3RvciB8fCAhcmVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q291bnQgPSBmb3JtYXRJbmZvLmNvdW50O1xyXG4gICAgICAgICAgICBjb25zdCBzdG9yYWdlID0gbmV3IHN0b3JhZ2VDb25zdHJ1Y3Rvcih2ZXJ0ZXhDb3VudCAqIGNvbXBvbmVudENvdW50KTtcclxuICAgICAgICAgICAgY29uc3QgaW5wdXRTdHJpZGUgPSB2ZXJ0ZXhCdW5kbGUudmlldy5zdHJpZGU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlWZXJ0ZXggPSAwOyBpVmVydGV4IDwgdmVydGV4Q291bnQ7ICsraVZlcnRleCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaUNvbXBvbmVudCA9IDA7IGlDb21wb25lbnQgPCBjb21wb25lbnRDb3VudDsgKytpQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZVtjb21wb25lbnRDb3VudCAqIGlWZXJ0ZXggKyBpQ29tcG9uZW50XSA9IHJlYWRlcihpbnB1dFN0cmlkZSAqIGlWZXJ0ZXggKyBzdG9yYWdlLkJZVEVTX1BFUl9FTEVNRU5UICogaUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0ID0gc3RvcmFnZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDor7vlj5blrZDnvZHmoLznmoTmjIflrprlsZ7mgKfliLDnm67moIfnvJPlhrLljLrkuK3jgIJcclxuICAgICAqIEBwYXJhbSBwcmltaXRpdmVJbmRleCDlrZDnvZHmoLzntKLlvJXjgIJcclxuICAgICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lIOWxnuaAp+WQjeensOOAglxyXG4gICAgICogQHBhcmFtIGJ1ZmZlciDnm67moIfnvJPlhrLljLrjgIJcclxuICAgICAqIEBwYXJhbSBzdHJpZGUg55u46YK75bGe5oCn5Zyo55uu5qCH57yT5Yay5Yy655qE5a2X6IqC6Ze06ZqU44CCXHJcbiAgICAgKiBAcGFyYW0gb2Zmc2V0IOmmluS4quWxnuaAp+WcqOebruagh+e8k+WGsuWMuuS4reeahOWBj+enu+OAglxyXG4gICAgICogQHJldHVybnMg5LiN5a2Y5Zyo5oyH5a6a55qE5a2Q572R5qC844CB5a2Q572R5qC85LiN5a2Y5Zyo5oyH5a6a55qE5bGe5oCn5oiW5bGe5oCn5peg5rOV6K+75Y+W5pe26L+U5ZueIGBmYWxzZWDvvIzlkKbliJnov5Tlm54gYHRydWVg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb3B5QXR0cmlidXRlIChwcmltaXRpdmVJbmRleDogbnVtYmVyLCBhdHRyaWJ1dGVOYW1lOiBHRlhBdHRyaWJ1dGVOYW1lLCBidWZmZXI6IEFycmF5QnVmZmVyLCBzdHJpZGU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgd3JpdHRlbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2FjY2Vzc0F0dHJpYnV0ZShwcmltaXRpdmVJbmRleCwgYXR0cmlidXRlTmFtZSwgKHZlcnRleEJ1bmRsZSwgaUF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhDb3VudCA9IHZlcnRleEJ1bmRsZS52aWV3LmNvdW50O1xyXG4gICAgICAgICAgICBpZiAodmVydGV4Q291bnQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHdyaXR0ZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IHZlcnRleEJ1bmRsZS5hdHRyaWJ1dGVzW2lBdHRyaWJ1dGVdLmZvcm1hdDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0VmlldyA9IG5ldyBEYXRhVmlldyhcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgdmVydGV4QnVuZGxlLnZpZXcub2Zmc2V0ICsgZ2V0T2Zmc2V0KHZlcnRleEJ1bmRsZS5hdHRyaWJ1dGVzLCBpQXR0cmlidXRlKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXRWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlciwgb2Zmc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdEluZm8gPSBHRlhGb3JtYXRJbmZvc1tmb3JtYXRdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gZ2V0UmVhZGVyKGlucHV0VmlldywgZm9ybWF0KTtcclxuICAgICAgICAgICAgY29uc3Qgd3JpdGVyID0gZ2V0V3JpdGVyKG91dHB1dFZpZXcsIGZvcm1hdCk7XHJcbiAgICAgICAgICAgIGlmICghcmVhZGVyIHx8ICF3cml0ZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q291bnQgPSBmb3JtYXRJbmZvLmNvdW50O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5wdXRTdHJpZGUgPSB2ZXJ0ZXhCdW5kbGUudmlldy5zdHJpZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0Q29tcG9uZW50Qnl0ZUxlbmd0aCA9IGdldENvbXBvbmVudEJ5dGVMZW5ndGgoZm9ybWF0KTtcclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0U3RyaWRlID0gc3RyaWRlO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXRDb21wb25lbnRCeXRlTGVuZ3RoID0gaW5wdXRDb21wb25lbnRCeXRlTGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpVmVydGV4ID0gMDsgaVZlcnRleCA8IHZlcnRleENvdW50OyArK2lWZXJ0ZXgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGlDb21wb25lbnQgPSAwOyBpQ29tcG9uZW50IDwgY29tcG9uZW50Q291bnQ7ICsraUNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0T2Zmc2V0ID0gaW5wdXRTdHJpZGUgKiBpVmVydGV4ICsgaW5wdXRDb21wb25lbnRCeXRlTGVuZ3RoICogaUNvbXBvbmVudDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXRPZmZzZXQgPSBvdXRwdXRTdHJpZGUgKiBpVmVydGV4ICsgb3V0cHV0Q29tcG9uZW50Qnl0ZUxlbmd0aCAqIGlDb21wb25lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVyKG91dHB1dE9mZnNldCwgcmVhZGVyKGlucHV0T2Zmc2V0KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd3JpdHRlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gd3JpdHRlbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOivu+WPluWtkOe9keagvOeahOe0ouW8leaVsOaNruOAglxyXG4gICAgICogQHBhcmFtIHByaW1pdGl2ZUluZGV4IOWtkOe9keagvOe0ouW8leOAglxyXG4gICAgICogQHJldHVybnMg5LiN5a2Y5Zyo5oyH5a6a55qE5a2Q572R5qC85oiW5a2Q572R5qC85LiN5a2Y5Zyo57Si5byV5pWw5o2u5pe26L+U5ZueIGBudWxsYO+8jFxyXG4gICAgICog5ZCm5YiZ77yM5Yib5bu66Laz5aSf5aSn55qE57yT5Yay5Yy65YyF5ZCr5omA5pyJ57Si5byV5pWw5o2u77yM5bm25Li66K+l57yT5Yay5Yy65Yib5bu65LiO57Si5byV57G75Z6L5a+55bqU55qE5pWw57uE6KeG5Zu+44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkSW5kaWNlcyAocHJpbWl0aXZlSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChwcmltaXRpdmVJbmRleCA+PSB0aGlzLl9zdHJ1Y3QucHJpbWl0aXZlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX3N0cnVjdC5wcmltaXRpdmVzW3ByaW1pdGl2ZUluZGV4XTtcclxuICAgICAgICBpZiAoIXByaW1pdGl2ZS5pbmRleFZpZXcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN0cmlkZSA9IHByaW1pdGl2ZS5pbmRleFZpZXcuc3RyaWRlO1xyXG4gICAgICAgIGNvbnN0IGN0b3IgPSBzdHJpZGUgPT09IDEgPyBVaW50OEFycmF5IDogKHN0cmlkZSA9PT0gMiA/IFVpbnQxNkFycmF5IDogVWludDMyQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgY3Rvcih0aGlzLl9kYXRhLmJ1ZmZlciwgcHJpbWl0aXZlLmluZGV4Vmlldy5vZmZzZXQsIHByaW1pdGl2ZS5pbmRleFZpZXcuY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K+75Y+W5a2Q572R5qC855qE57Si5byV5pWw5o2u5Yiw55uu5qCH5pWw57uE5Lit44CCXHJcbiAgICAgKiBAcGFyYW0gcHJpbWl0aXZlSW5kZXgg5a2Q572R5qC857Si5byV44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0cHV0QXJyYXkg55uu5qCH5pWw57uE44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuI3lrZjlnKjmjIflrprnmoTlrZDnvZHmoLzmiJblrZDnvZHmoLzkuI3lrZjlnKjntKLlvJXmlbDmja7ml7bov5Tlm54gYGZhbHNlYO+8jOWQpuWImei/lOWbniBgdHJ1ZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHlJbmRpY2VzIChwcmltaXRpdmVJbmRleDogbnVtYmVyLCBvdXRwdXRBcnJheTogbnVtYmVyW10gfCBBcnJheUJ1ZmZlclZpZXcpIHtcclxuICAgICAgICBpZiAocHJpbWl0aXZlSW5kZXggPj0gdGhpcy5fc3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fc3RydWN0LnByaW1pdGl2ZXNbcHJpbWl0aXZlSW5kZXhdO1xyXG4gICAgICAgIGlmICghcHJpbWl0aXZlLmluZGV4Vmlldykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGluZGV4Q291bnQgPSBwcmltaXRpdmUuaW5kZXhWaWV3LmNvdW50O1xyXG4gICAgICAgIGNvbnN0IGluZGV4Rm9ybWF0ID0gcHJpbWl0aXZlLmluZGV4Vmlldy5zdHJpZGUgPT09IDEgPyBHRlhGb3JtYXQuUjhVSSA6IChwcmltaXRpdmUuaW5kZXhWaWV3LnN0cmlkZSA9PT0gMiA/IEdGWEZvcm1hdC5SMTZVSSA6IEdGWEZvcm1hdC5SMzJVSSk7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gZ2V0UmVhZGVyKG5ldyBEYXRhVmlldyh0aGlzLl9kYXRhLmJ1ZmZlciksIGluZGV4Rm9ybWF0KSE7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleENvdW50OyArK2kpIHtcclxuICAgICAgICAgICAgb3V0cHV0QXJyYXlbaV0gPSByZWFkZXIocHJpbWl0aXZlLmluZGV4Vmlldy5vZmZzZXQgKyBHRlhGb3JtYXRJbmZvc1tpbmRleEZvcm1hdF0uc2l6ZSAqIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hY2Nlc3NBdHRyaWJ1dGUgKFxyXG4gICAgICAgIHByaW1pdGl2ZUluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgYXR0cmlidXRlTmFtZTogR0ZYQXR0cmlidXRlTmFtZSxcclxuICAgICAgICBhY2Nlc3NvcjogKHZlcnRleEJ1bmRsZTogTWVzaC5JVmVydGV4QnVuZGxlLCBpQXR0cmlidXRlOiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgICAgICBpZiAocHJpbWl0aXZlSW5kZXggPj0gdGhpcy5fc3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fc3RydWN0LnByaW1pdGl2ZXNbcHJpbWl0aXZlSW5kZXhdO1xyXG4gICAgICAgIGZvciAoY29uc3QgdmVydGV4QnVuZGxlSW5kZXggb2YgcHJpbWl0aXZlLnZlcnRleEJ1bmRlbEluZGljZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4QnVuZGxlID0gdGhpcy5fc3RydWN0LnZlcnRleEJ1bmRsZXNbdmVydGV4QnVuZGxlSW5kZXhdO1xyXG4gICAgICAgICAgICBjb25zdCBpQXR0cmlidXRlID0gdmVydGV4QnVuZGxlLmF0dHJpYnV0ZXMuZmluZEluZGV4KChhKSA9PiBhLm5hbWUgPT09IGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaUF0dHJpYnV0ZSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFjY2Vzc29yKHZlcnRleEJ1bmRsZSwgaUF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlVmVydGV4QnVmZmVycyAoZ2Z4RGV2aWNlOiBHRlhEZXZpY2UsIGRhdGE6IEFycmF5QnVmZmVyKTogR0ZYQnVmZmVyW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJ1Y3QudmVydGV4QnVuZGxlcy5tYXAoKHZlcnRleEJ1bmRsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmVydGV4QnVmZmVyID0gZ2Z4RGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlZFUlRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1bmRsZS52aWV3Lmxlbmd0aCxcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1bmRsZS52aWV3LnN0cmlkZSxcclxuICAgICAgICAgICAgKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSwgdmVydGV4QnVuZGxlLnZpZXcub2Zmc2V0LCB2ZXJ0ZXhCdW5kbGUudmlldy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleEJ1ZmZlci51cGRhdGUodmlldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uY2UoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyLnVwZGF0ZSh2aWV3KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2ZXJ0ZXhCdWZmZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1vcnBoUmVuZGVyaW5nOiBNb3JwaFJlbmRlcmluZyB8IG51bGwgPSBudWxsO1xyXG59XHJcbmxlZ2FjeUNDLk1lc2ggPSBNZXNoO1xyXG5cclxuZnVuY3Rpb24gZ2V0T2Zmc2V0IChhdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSwgYXR0cmlidXRlSW5kZXg6IG51bWJlcikge1xyXG4gICAgbGV0IHJlc3VsdCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZUluZGV4OyArK2kpIHtcclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgIHJlc3VsdCArPSBHRlhGb3JtYXRJbmZvc1thdHRyaWJ1dGUuZm9ybWF0XS5zaXplO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuY29uc3QgaXNMaXR0bGVFbmRpYW4gPSBzeXMuaXNMaXR0bGVFbmRpYW47XHJcblxyXG5mdW5jdGlvbiBnZXRDb21wb25lbnRCeXRlTGVuZ3RoIChmb3JtYXQ6IEdGWEZvcm1hdCkge1xyXG4gICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2Zvcm1hdF07XHJcbiAgICByZXR1cm4gaW5mby5zaXplIC8gaW5mby5jb3VudDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmVhZGVyIChkYXRhVmlldzogRGF0YVZpZXcsIGZvcm1hdDogR0ZYRm9ybWF0KSB7XHJcbiAgICBjb25zdCBpbmZvID0gR0ZYRm9ybWF0SW5mb3NbZm9ybWF0XTtcclxuICAgIGNvbnN0IHN0cmlkZSA9IGluZm8uc2l6ZSAvIGluZm8uY291bnQ7XHJcblxyXG4gICAgc3dpdGNoIChpbmZvLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdFR5cGUuVU5PUk06IHtcclxuICAgICAgICAgICAgc3dpdGNoIChzdHJpZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIChvZmZzZXQ6IG51bWJlcikgPT4gZGF0YVZpZXcuZ2V0VWludDgob2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIChvZmZzZXQ6IG51bWJlcikgPT4gZGF0YVZpZXcuZ2V0VWludDE2KG9mZnNldCwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRVaW50MzIob2Zmc2V0LCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0VHlwZS5TTk9STToge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRJbnQ4KG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiAob2Zmc2V0OiBudW1iZXIpID0+IGRhdGFWaWV3LmdldEludDE2KG9mZnNldCwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRJbnQzMihvZmZzZXQsIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXRUeXBlLklOVDoge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRJbnQ4KG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiAob2Zmc2V0OiBudW1iZXIpID0+IGRhdGFWaWV3LmdldEludDE2KG9mZnNldCwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRJbnQzMihvZmZzZXQsIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXRUeXBlLlVJTlQ6IHtcclxuICAgICAgICAgICAgc3dpdGNoIChzdHJpZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIChvZmZzZXQ6IG51bWJlcikgPT4gZGF0YVZpZXcuZ2V0VWludDgob2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIChvZmZzZXQ6IG51bWJlcikgPT4gZGF0YVZpZXcuZ2V0VWludDE2KG9mZnNldCwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRVaW50MzIob2Zmc2V0LCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0VHlwZS5GTE9BVDoge1xyXG4gICAgICAgICAgICByZXR1cm4gKG9mZnNldDogbnVtYmVyKSA9PiBkYXRhVmlldy5nZXRGbG9hdDMyKG9mZnNldCwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V3JpdGVyIChkYXRhVmlldzogRGF0YVZpZXcsIGZvcm1hdDogR0ZYRm9ybWF0KSB7XHJcbiAgICBjb25zdCBpbmZvID0gR0ZYRm9ybWF0SW5mb3NbZm9ybWF0XTtcclxuICAgIGNvbnN0IHN0cmlkZSA9IGluZm8uc2l6ZSAvIGluZm8uY291bnQ7XHJcblxyXG4gICAgc3dpdGNoIChpbmZvLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdFR5cGUuVU5PUk06IHtcclxuICAgICAgICAgICAgc3dpdGNoIChzdHJpZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIChvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlcikgPT4gZGF0YVZpZXcuc2V0VWludDgob2Zmc2V0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IGRhdGFWaWV3LnNldFVpbnQxNihvZmZzZXQsIHZhbHVlLCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IGRhdGFWaWV3LnNldFVpbnQzMihvZmZzZXQsIHZhbHVlLCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0VHlwZS5TTk9STToge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiBkYXRhVmlldy5zZXRJbnQ4KG9mZnNldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiBkYXRhVmlldy5zZXRJbnQxNihvZmZzZXQsIHZhbHVlLCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IGRhdGFWaWV3LnNldEludDMyKG9mZnNldCwgdmFsdWUsIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXRUeXBlLklOVDoge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiBkYXRhVmlldy5zZXRJbnQ4KG9mZnNldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiBkYXRhVmlldy5zZXRJbnQxNihvZmZzZXQsIHZhbHVlLCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IGRhdGFWaWV3LnNldEludDMyKG9mZnNldCwgdmFsdWUsIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXRUeXBlLlVJTlQ6IHtcclxuICAgICAgICAgICAgc3dpdGNoIChzdHJpZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIChvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlcikgPT4gZGF0YVZpZXcuc2V0VWludDgob2Zmc2V0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IGRhdGFWaWV3LnNldFVpbnQxNihvZmZzZXQsIHZhbHVlLCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IGRhdGFWaWV3LnNldFVpbnQzMihvZmZzZXQsIHZhbHVlLCBpc0xpdHRsZUVuZGlhbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0VHlwZS5GTE9BVDoge1xyXG4gICAgICAgICAgICByZXR1cm4gKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiBkYXRhVmlldy5zZXRGbG9hdDMyKG9mZnNldCwgdmFsdWUsIGlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIGdldFxyXG4iXX0=