(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/assets/index.js", "../core/data/decorators/index.js", "../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/assets/index.js"), require("../core/data/decorators/index.js"), require("../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.globalExports);
    global.terrainAsset = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TerrainAsset = _exports.TerrainLayerInfo = _exports.TERRAIN_DATA_VERSION_DEFAULT = _exports.TERRAIN_DATA_VERSION3 = _exports.TERRAIN_DATA_VERSION2 = _exports.TERRAIN_DATA_VERSION = _exports.TERRAIN_EAST_INDEX = _exports.TERRAIN_WEST_INDEX = _exports.TERRAIN_SOUTH_INDEX = _exports.TERRAIN_NORTH_INDEX = _exports.TERRAIN_HEIGHT_FMAX = _exports.TERRAIN_HEIGHT_FMIN = _exports.TERRAIN_HEIGHT_FACTORY = _exports.TERRAIN_HEIGHT_BASE = _exports.TERRAIN_BLOCK_VERTEX_SIZE = _exports.TERRAIN_BLOCK_VERTEX_COMPLEXITY = _exports.TERRAIN_BLOCK_TILE_COMPLEXITY = _exports.TERRAIN_MAX_LAYER_COUNT = _exports.TERRAIN_MAX_BLEND_LAYERS = _exports.TERRAIN_MAX_LEVELS = void 0;

  var _dec, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var TERRAIN_MAX_LEVELS = 4;
  _exports.TERRAIN_MAX_LEVELS = TERRAIN_MAX_LEVELS;
  var TERRAIN_MAX_BLEND_LAYERS = 4;
  _exports.TERRAIN_MAX_BLEND_LAYERS = TERRAIN_MAX_BLEND_LAYERS;
  var TERRAIN_MAX_LAYER_COUNT = 256;
  _exports.TERRAIN_MAX_LAYER_COUNT = TERRAIN_MAX_LAYER_COUNT;
  var TERRAIN_BLOCK_TILE_COMPLEXITY = 32;
  _exports.TERRAIN_BLOCK_TILE_COMPLEXITY = TERRAIN_BLOCK_TILE_COMPLEXITY;
  var TERRAIN_BLOCK_VERTEX_COMPLEXITY = 33;
  _exports.TERRAIN_BLOCK_VERTEX_COMPLEXITY = TERRAIN_BLOCK_VERTEX_COMPLEXITY;
  var TERRAIN_BLOCK_VERTEX_SIZE = 8; // position + normal + uv

  _exports.TERRAIN_BLOCK_VERTEX_SIZE = TERRAIN_BLOCK_VERTEX_SIZE;
  var TERRAIN_HEIGHT_BASE = 32768;
  _exports.TERRAIN_HEIGHT_BASE = TERRAIN_HEIGHT_BASE;
  var TERRAIN_HEIGHT_FACTORY = 1.0 / 512.0;
  _exports.TERRAIN_HEIGHT_FACTORY = TERRAIN_HEIGHT_FACTORY;
  var TERRAIN_HEIGHT_FMIN = -TERRAIN_HEIGHT_BASE * TERRAIN_HEIGHT_FACTORY;
  _exports.TERRAIN_HEIGHT_FMIN = TERRAIN_HEIGHT_FMIN;
  var TERRAIN_HEIGHT_FMAX = (65535 - TERRAIN_HEIGHT_BASE) * TERRAIN_HEIGHT_FACTORY;
  _exports.TERRAIN_HEIGHT_FMAX = TERRAIN_HEIGHT_FMAX;
  var TERRAIN_NORTH_INDEX = 0;
  _exports.TERRAIN_NORTH_INDEX = TERRAIN_NORTH_INDEX;
  var TERRAIN_SOUTH_INDEX = 1;
  _exports.TERRAIN_SOUTH_INDEX = TERRAIN_SOUTH_INDEX;
  var TERRAIN_WEST_INDEX = 2;
  _exports.TERRAIN_WEST_INDEX = TERRAIN_WEST_INDEX;
  var TERRAIN_EAST_INDEX = 3;
  _exports.TERRAIN_EAST_INDEX = TERRAIN_EAST_INDEX;
  var TERRAIN_DATA_VERSION = 0x01010001;
  _exports.TERRAIN_DATA_VERSION = TERRAIN_DATA_VERSION;
  var TERRAIN_DATA_VERSION2 = 0x01010002;
  _exports.TERRAIN_DATA_VERSION2 = TERRAIN_DATA_VERSION2;
  var TERRAIN_DATA_VERSION3 = 0x01010003;
  _exports.TERRAIN_DATA_VERSION3 = TERRAIN_DATA_VERSION3;
  var TERRAIN_DATA_VERSION_DEFAULT = 0x01010111;
  _exports.TERRAIN_DATA_VERSION_DEFAULT = TERRAIN_DATA_VERSION_DEFAULT;

  var TerrainBuffer = /*#__PURE__*/function () {
    function TerrainBuffer() {
      _classCallCheck(this, TerrainBuffer);

      this.length = 0;
      this.buffer = new Uint8Array(2048);
      this._buffView = new DataView(this.buffer.buffer);
      this._seekPos = 0;
    }

    _createClass(TerrainBuffer, [{
      key: "reserve",
      value: function reserve(size) {
        if (this.buffer.byteLength > size) {
          return;
        }

        var capacity = this.buffer.byteLength;

        while (capacity < size) {
          capacity += capacity;
        }

        var temp = new Uint8Array(capacity);

        for (var i = 0; i < this.length; ++i) {
          temp[i] = this.buffer[i];
        }

        this.buffer = temp;
        this._buffView = new DataView(this.buffer.buffer);
      }
    }, {
      key: "assign",
      value: function assign(buff) {
        this.buffer = buff;
        this.length = buff.length;
        this._seekPos = buff.byteOffset;
        this._buffView = new DataView(buff.buffer);
      }
    }, {
      key: "writeInt8",
      value: function writeInt8(value) {
        this.reserve(this.length + 1);

        this._buffView.setInt8(this.length, value);

        this.length += 1;
      }
    }, {
      key: "writeInt16",
      value: function writeInt16(value) {
        this.reserve(this.length + 2);

        this._buffView.setInt16(this.length, value, true);

        this.length += 2;
      }
    }, {
      key: "writeInt32",
      value: function writeInt32(value) {
        this.reserve(this.length + 4);

        this._buffView.setInt32(this.length, value, true);

        this.length += 4;
      }
    }, {
      key: "writeIntArray",
      value: function writeIntArray(value) {
        this.reserve(this.length + 4 * value.length);

        for (var i = 0; i < value.length; ++i) {
          this._buffView.setInt32(this.length + i * 4, value[i], true);
        }

        this.length += 4 * value.length;
      }
    }, {
      key: "writeFloat",
      value: function writeFloat(value) {
        this.reserve(this.length + 4);

        this._buffView.setFloat32(this.length, value, true);

        this.length += 4;
      }
    }, {
      key: "writeFloatArray",
      value: function writeFloatArray(value) {
        this.reserve(this.length + 4 * value.length);

        for (var i = 0; i < value.length; ++i) {
          this._buffView.setFloat32(this.length + i * 4, value[i], true);
        }

        this.length += 4 * value.length;
      }
    }, {
      key: "writeString",
      value: function writeString(value) {
        this.reserve(this.length + value.length + 4);

        this._buffView.setInt32(this.length, value.length, true);

        for (var i = 0; i < value.length; ++i) {
          this._buffView.setInt8(this.length + 4 + i, value.charCodeAt(i));
        }

        this.length += value.length + 4;
      }
    }, {
      key: "readInt8",
      value: function readInt8() {
        var value = this._buffView.getInt8(this._seekPos);

        this._seekPos += 1;
        return value;
      }
    }, {
      key: "readInt16",
      value: function readInt16() {
        var value = this._buffView.getInt16(this._seekPos, true);

        this._seekPos += 2;
        return value;
      }
    }, {
      key: "readInt",
      value: function readInt() {
        var value = this._buffView.getInt32(this._seekPos, true);

        this._seekPos += 4;
        return value;
      }
    }, {
      key: "readIntArray",
      value: function readIntArray(value) {
        for (var i = 0; i < value.length; ++i) {
          value[i] = this._buffView.getInt32(this._seekPos + i * 4, true);
        }

        this._seekPos += 4 * value.length;
        return value;
      }
    }, {
      key: "readFloat",
      value: function readFloat() {
        var value = this._buffView.getFloat32(this._seekPos, true);

        this._seekPos += 4;
        return value;
      }
    }, {
      key: "readFloatArray",
      value: function readFloatArray(value) {
        for (var i = 0; i < value.length; ++i) {
          value[i] = this._buffView.getFloat32(this._seekPos + i * 4, true);
        }

        this._seekPos += 4 * value.length;
        return value;
      }
    }, {
      key: "readString",
      value: function readString() {
        var length = this.readInt();
        var value = '';

        for (var i = 0; i < length; ++i) {
          value += String.fromCharCode(this.readInt8());
        }

        return value;
      }
    }]);

    return TerrainBuffer;
  }();
  /**
   * @en terrain layer info
   * @zh 地形纹理信息
   */


  var TerrainLayerInfo = function TerrainLayerInfo() {
    _classCallCheck(this, TerrainLayerInfo);

    this.slot = 0;
    this.tileSize = 1;
    this.detailMap = '';
  };
  /**
   * @en terrain asset
   * @zh 地形资源
   */


  _exports.TerrainLayerInfo = TerrainLayerInfo;
  var TerrainAsset = (_dec = (0, _index2.ccclass)('cc.TerrainAsset'), _dec(_class = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(TerrainAsset, _Asset);

    function TerrainAsset() {
      var _this;

      _classCallCheck(this, TerrainAsset);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TerrainAsset).call(this));
      _this._data = null;
      _this._tileSize = 1;
      _this._blockCount = [1, 1];
      _this._weightMapSize = 128;
      _this._lightMapSize = 128;
      _this._heights = new Uint16Array();
      _this._weights = new Uint8Array();
      _this._layerBuffer = [-1, -1, -1, -1];
      _this._layerInfos = [];
      _this.loaded = false;
      return _this;
    }

    _createClass(TerrainAsset, [{
      key: "getLayer",

      /**
       * @en get layer
       * @param xBlock block index x
       * @param yBlock block index y
       * @param layerId layer id
       * @zh 获得纹理索引
       * @param xBlock 地形块索引x
       * @param yBlock 地形块索引y
       * @param layerId 层Id
       */
      value: function getLayer(xBlock, yBlock, layerId) {
        var blockId = yBlock * this.blockCount[0] + xBlock;
        var index = blockId * 4 + layerId;

        if (xBlock < this.blockCount[0] && yBlock < this.blockCount[1] && index < this._layerBuffer.length) {
          return this._layerBuffer[index];
        }

        return -1;
      }
    }, {
      key: "getHeight",
      value: function getHeight(i, j) {
        var vertexCountX = this._blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + 1;
        return (this._heights[j * vertexCountX + i] - TERRAIN_HEIGHT_BASE) * TERRAIN_HEIGHT_FACTORY;
      }
    }, {
      key: "getVertexCountI",
      value: function getVertexCountI() {
        if (this._blockCount.length < 1) return 0;
        return this._blockCount[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + 1;
      }
    }, {
      key: "getVertexCountJ",
      value: function getVertexCountJ() {
        if (this._blockCount.length < 2) return 0;
        return this._blockCount[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + 1;
      }
    }, {
      key: "_setNativeData",
      value: function _setNativeData(_nativeData) {
        this._data = _nativeData;
      }
    }, {
      key: "_loadNativeData",
      value: function _loadNativeData(_nativeData) {
        var stream = new TerrainBuffer();
        stream.assign(_nativeData); // version

        var version = stream.readInt();

        if (version === TERRAIN_DATA_VERSION_DEFAULT) {
          return true;
        }

        if (version !== TERRAIN_DATA_VERSION && version !== TERRAIN_DATA_VERSION2 && version !== TERRAIN_DATA_VERSION3) {
          return false;
        } // geometry info


        this.tileSize = stream.readFloat();
        stream.readIntArray(this._blockCount);
        this.weightMapSize = stream.readInt16();
        this.lightMapSize = stream.readInt16(); // heights

        var heightBufferSize = stream.readInt();
        this.heights = new Uint16Array(heightBufferSize);

        for (var i = 0; i < this.heights.length; ++i) {
          this.heights[i] = stream.readInt16();
        } // weights


        var WeightBufferSize = stream.readInt();
        this.weights = new Uint8Array(WeightBufferSize);

        for (var _i = 0; _i < this.weights.length; ++_i) {
          this.weights[_i] = stream.readInt8();
        } // layer buffer


        if (version >= TERRAIN_DATA_VERSION2) {
          var layerBufferSize = stream.readInt();
          this.layerBuffer = new Array(layerBufferSize);

          for (var _i2 = 0; _i2 < this.layerBuffer.length; ++_i2) {
            this.layerBuffer[_i2] = stream.readInt16();
          }
        } // layer infos


        if (version >= TERRAIN_DATA_VERSION3) {
          var layerInfoSize = stream.readInt();
          this.layerInfos = new Array(layerInfoSize);

          for (var _i3 = 0; _i3 < this.layerInfos.length; ++_i3) {
            this.layerInfos[_i3] = new TerrainLayerInfo();
            this.layerInfos[_i3].slot = stream.readInt();
            this.layerInfos[_i3].tileSize = stream.readFloat();
            this.layerInfos[_i3].detailMap = stream.readString();
          }
        }

        return true;
      }
    }, {
      key: "_exportNativeData",
      value: function _exportNativeData() {
        var stream = new TerrainBuffer(); // version

        stream.writeInt32(TERRAIN_DATA_VERSION3); // geometry info

        stream.writeFloat(this.tileSize);
        stream.writeIntArray(this._blockCount);
        stream.writeInt16(this.weightMapSize);
        stream.writeInt16(this.lightMapSize); // heights

        stream.writeInt32(this.heights.length);

        for (var i = 0; i < this.heights.length; ++i) {
          stream.writeInt16(this.heights[i]);
        } // weights


        stream.writeInt32(this.weights.length);

        for (var _i4 = 0; _i4 < this.weights.length; ++_i4) {
          stream.writeInt8(this.weights[_i4]);
        } // layer buffer


        stream.writeInt32(this.layerBuffer.length);

        for (var _i5 = 0; _i5 < this.layerBuffer.length; ++_i5) {
          stream.writeInt16(this.layerBuffer[_i5]);
        } // layer infos


        stream.writeInt32(this.layerInfos.length);

        for (var _i6 = 0; _i6 < this.layerInfos.length; ++_i6) {
          stream.writeInt32(this.layerInfos[_i6].slot);
          stream.writeFloat(this.layerInfos[_i6].tileSize);
          stream.writeString(this.layerInfos[_i6].detailMap);
        }

        return stream.buffer;
      }
    }, {
      key: "_exportDefaultNativeData",
      value: function _exportDefaultNativeData() {
        var stream = new TerrainBuffer();
        stream.writeInt32(TERRAIN_DATA_VERSION_DEFAULT);
        return stream.buffer;
      }
    }, {
      key: "_nativeAsset",
      get: function get() {
        return this._data.buffer;
      },
      set: function set(value) {
        if (this._data && this._data.byteLength === value.byteLength) {
          this._data.set(new Uint8Array(value));

          if (_globalExports.legacyCC.loader._cache[this.nativeUrl]) {
            _globalExports.legacyCC.loader._cache[this.nativeUrl].content = this._data.buffer;
          }
        } else {
          this._data = new Uint8Array(value);
        }

        this._loadNativeData(this._data);

        this.loaded = true;
        this.emit('load');
      }
      /**
       * @en tile size
       * @zh 栅格大小
       */

    }, {
      key: "tileSize",
      set: function set(value) {
        this._tileSize = value;
      },
      get: function get() {
        return this._tileSize;
      }
      /**
       * @en block count
       * @zh 块数量
       */

    }, {
      key: "blockCount",
      set: function set(value) {
        this._blockCount = value;
      },
      get: function get() {
        return this._blockCount;
      }
      /**
       * @en light map size
       * @zh 光照图大小
       */

    }, {
      key: "lightMapSize",
      set: function set(value) {
        this._lightMapSize = value;
      },
      get: function get() {
        return this._lightMapSize;
      }
      /**
       * @en weight map size
       * @zh 权重图大小
       */

    }, {
      key: "weightMapSize",
      set: function set(value) {
        this._weightMapSize = value;
      },
      get: function get() {
        return this._weightMapSize;
      }
      /**
       * @en height buffer
       * @zh 高度缓存
       */

    }, {
      key: "heights",
      set: function set(value) {
        this._heights = value;
      },
      get: function get() {
        return this._heights;
      }
      /**
       * @en weight buffer
       * @zh 权重缓存
       */

    }, {
      key: "weights",
      set: function set(value) {
        this._weights = value;
      },
      get: function get() {
        return this._weights;
      }
      /**
       * @en layer buffer
       * @zh 纹理索引缓存
       */

    }, {
      key: "layerBuffer",
      set: function set(value) {
        this._layerBuffer = value;
      },
      get: function get() {
        return this._layerBuffer;
      }
      /**
       * @en layer info
       * @zh 纹理信息
       */

    }, {
      key: "layerInfos",
      set: function set(value) {
        this._layerInfos = value;
      },
      get: function get() {
        return this._layerInfos;
      }
    }]);

    return TerrainAsset;
  }(_index.Asset), _temp)) || _class);
  _exports.TerrainAsset = TerrainAsset;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3RlcnJhaW4vdGVycmFpbi1hc3NldC50cyJdLCJuYW1lcyI6WyJURVJSQUlOX01BWF9MRVZFTFMiLCJURVJSQUlOX01BWF9CTEVORF9MQVlFUlMiLCJURVJSQUlOX01BWF9MQVlFUl9DT1VOVCIsIlRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZIiwiVEVSUkFJTl9CTE9DS19WRVJURVhfQ09NUExFWElUWSIsIlRFUlJBSU5fQkxPQ0tfVkVSVEVYX1NJWkUiLCJURVJSQUlOX0hFSUdIVF9CQVNFIiwiVEVSUkFJTl9IRUlHSFRfRkFDVE9SWSIsIlRFUlJBSU5fSEVJR0hUX0ZNSU4iLCJURVJSQUlOX0hFSUdIVF9GTUFYIiwiVEVSUkFJTl9OT1JUSF9JTkRFWCIsIlRFUlJBSU5fU09VVEhfSU5ERVgiLCJURVJSQUlOX1dFU1RfSU5ERVgiLCJURVJSQUlOX0VBU1RfSU5ERVgiLCJURVJSQUlOX0RBVEFfVkVSU0lPTiIsIlRFUlJBSU5fREFUQV9WRVJTSU9OMiIsIlRFUlJBSU5fREFUQV9WRVJTSU9OMyIsIlRFUlJBSU5fREFUQV9WRVJTSU9OX0RFRkFVTFQiLCJUZXJyYWluQnVmZmVyIiwibGVuZ3RoIiwiYnVmZmVyIiwiVWludDhBcnJheSIsIl9idWZmVmlldyIsIkRhdGFWaWV3IiwiX3NlZWtQb3MiLCJzaXplIiwiYnl0ZUxlbmd0aCIsImNhcGFjaXR5IiwidGVtcCIsImkiLCJidWZmIiwiYnl0ZU9mZnNldCIsInZhbHVlIiwicmVzZXJ2ZSIsInNldEludDgiLCJzZXRJbnQxNiIsInNldEludDMyIiwic2V0RmxvYXQzMiIsImNoYXJDb2RlQXQiLCJnZXRJbnQ4IiwiZ2V0SW50MTYiLCJnZXRJbnQzMiIsImdldEZsb2F0MzIiLCJyZWFkSW50IiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwicmVhZEludDgiLCJUZXJyYWluTGF5ZXJJbmZvIiwic2xvdCIsInRpbGVTaXplIiwiZGV0YWlsTWFwIiwiVGVycmFpbkFzc2V0IiwiX2RhdGEiLCJfdGlsZVNpemUiLCJfYmxvY2tDb3VudCIsIl93ZWlnaHRNYXBTaXplIiwiX2xpZ2h0TWFwU2l6ZSIsIl9oZWlnaHRzIiwiVWludDE2QXJyYXkiLCJfd2VpZ2h0cyIsIl9sYXllckJ1ZmZlciIsIl9sYXllckluZm9zIiwibG9hZGVkIiwieEJsb2NrIiwieUJsb2NrIiwibGF5ZXJJZCIsImJsb2NrSWQiLCJibG9ja0NvdW50IiwiaW5kZXgiLCJqIiwidmVydGV4Q291bnRYIiwiX25hdGl2ZURhdGEiLCJzdHJlYW0iLCJhc3NpZ24iLCJ2ZXJzaW9uIiwicmVhZEZsb2F0IiwicmVhZEludEFycmF5Iiwid2VpZ2h0TWFwU2l6ZSIsInJlYWRJbnQxNiIsImxpZ2h0TWFwU2l6ZSIsImhlaWdodEJ1ZmZlclNpemUiLCJoZWlnaHRzIiwiV2VpZ2h0QnVmZmVyU2l6ZSIsIndlaWdodHMiLCJsYXllckJ1ZmZlclNpemUiLCJsYXllckJ1ZmZlciIsIkFycmF5IiwibGF5ZXJJbmZvU2l6ZSIsImxheWVySW5mb3MiLCJyZWFkU3RyaW5nIiwid3JpdGVJbnQzMiIsIndyaXRlRmxvYXQiLCJ3cml0ZUludEFycmF5Iiwid3JpdGVJbnQxNiIsIndyaXRlSW50OCIsIndyaXRlU3RyaW5nIiwic2V0IiwibGVnYWN5Q0MiLCJsb2FkZXIiLCJfY2FjaGUiLCJuYXRpdmVVcmwiLCJjb250ZW50IiwiX2xvYWROYXRpdmVEYXRhIiwiZW1pdCIsIkFzc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT08sTUFBTUEsa0JBQWtCLEdBQUcsQ0FBM0I7O0FBQ0EsTUFBTUMsd0JBQXdCLEdBQUcsQ0FBakM7O0FBQ0EsTUFBTUMsdUJBQXVCLEdBQUcsR0FBaEM7O0FBQ0EsTUFBTUMsNkJBQTZCLEdBQUcsRUFBdEM7O0FBQ0EsTUFBTUMsK0JBQStCLEdBQUcsRUFBeEM7O0FBQ0EsTUFBTUMseUJBQXlCLEdBQUcsQ0FBbEMsQyxDQUFxQzs7O0FB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cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSB0ZXJyYWluXHJcbiAqL1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4uL2NvcmUvYXNzZXRzJztcclxuaW1wb3J0IHsgY2NjbGFzcyB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9NQVhfTEVWRUxTID0gNDtcclxuZXhwb3J0IGNvbnN0IFRFUlJBSU5fTUFYX0JMRU5EX0xBWUVSUyA9IDQ7XHJcbmV4cG9ydCBjb25zdCBURVJSQUlOX01BWF9MQVlFUl9DT1VOVCA9IDI1NjtcclxuZXhwb3J0IGNvbnN0IFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZID0gMzI7XHJcbmV4cG9ydCBjb25zdCBURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZID0gMzM7XHJcbmV4cG9ydCBjb25zdCBURVJSQUlOX0JMT0NLX1ZFUlRFWF9TSVpFID0gODsgLy8gcG9zaXRpb24gKyBub3JtYWwgKyB1dlxyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9IRUlHSFRfQkFTRSA9IDMyNzY4O1xyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9IRUlHSFRfRkFDVE9SWSA9IDEuMCAvIDUxMi4wO1xyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9IRUlHSFRfRk1JTiA9ICgtVEVSUkFJTl9IRUlHSFRfQkFTRSkgKiBURVJSQUlOX0hFSUdIVF9GQUNUT1JZO1xyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9IRUlHSFRfRk1BWCA9ICg2NTUzNSAtIFRFUlJBSU5fSEVJR0hUX0JBU0UpICogVEVSUkFJTl9IRUlHSFRfRkFDVE9SWTtcclxuZXhwb3J0IGNvbnN0IFRFUlJBSU5fTk9SVEhfSU5ERVggPSAwO1xyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9TT1VUSF9JTkRFWCA9IDE7XHJcbmV4cG9ydCBjb25zdCBURVJSQUlOX1dFU1RfSU5ERVggPSAyO1xyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9FQVNUX0lOREVYID0gMztcclxuXHJcbmV4cG9ydCBjb25zdCBURVJSQUlOX0RBVEFfVkVSU0lPTiA9IDB4MDEwMTAwMDE7XHJcbmV4cG9ydCBjb25zdCBURVJSQUlOX0RBVEFfVkVSU0lPTjIgPSAweDAxMDEwMDAyO1xyXG5leHBvcnQgY29uc3QgVEVSUkFJTl9EQVRBX1ZFUlNJT04zID0gMHgwMTAxMDAwMztcclxuZXhwb3J0IGNvbnN0IFRFUlJBSU5fREFUQV9WRVJTSU9OX0RFRkFVTFQgPSAweDAxMDEwMTExO1xyXG5cclxuY2xhc3MgVGVycmFpbkJ1ZmZlciB7XHJcbiAgICBwdWJsaWMgbGVuZ3RoOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIGJ1ZmZlcjogVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KDIwNDgpO1xyXG4gICAgcHJpdmF0ZSBfYnVmZlZpZXc6IERhdGFWaWV3ID0gbmV3IERhdGFWaWV3KHRoaXMuYnVmZmVyLmJ1ZmZlcik7XHJcbiAgICBwcml2YXRlIF9zZWVrUG9zOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyByZXNlcnZlIChzaXplOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5idWZmZXIuYnl0ZUxlbmd0aCA+IHNpemUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhcGFjaXR5ID0gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoY2FwYWNpdHkgPCBzaXplKSB7XHJcbiAgICAgICAgICAgIGNhcGFjaXR5ICs9IGNhcGFjaXR5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGVtcCA9IG5ldyBVaW50OEFycmF5KGNhcGFjaXR5KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGVtcFtpXSA9IHRoaXMuYnVmZmVyW2ldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5idWZmZXIgPSB0ZW1wO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZWaWV3ID0gbmV3IERhdGFWaWV3KHRoaXMuYnVmZmVyLmJ1ZmZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzc2lnbiAoYnVmZjogVWludDhBcnJheSkge1xyXG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZjtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGJ1ZmYubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuX3NlZWtQb3MgPSBidWZmLmJ5dGVPZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5fYnVmZlZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZi5idWZmZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZUludDggKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJlc2VydmUodGhpcy5sZW5ndGggKyAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYnVmZlZpZXcuc2V0SW50OCh0aGlzLmxlbmd0aCwgdmFsdWUpO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoICs9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHdyaXRlSW50MTYgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJlc2VydmUodGhpcy5sZW5ndGggKyAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYnVmZlZpZXcuc2V0SW50MTYodGhpcy5sZW5ndGgsIHZhbHVlLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmxlbmd0aCArPSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZUludDMyICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yZXNlcnZlKHRoaXMubGVuZ3RoICsgNCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2J1ZmZWaWV3LnNldEludDMyKHRoaXMubGVuZ3RoLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggKz0gNDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgd3JpdGVJbnRBcnJheSAodmFsdWU6IG51bWJlcltdKSB7XHJcbiAgICAgICAgdGhpcy5yZXNlcnZlKHRoaXMubGVuZ3RoICsgNCAqIHZhbHVlLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5fYnVmZlZpZXcuc2V0SW50MzIodGhpcy5sZW5ndGggKyBpICogNCwgdmFsdWVbaV0sIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxlbmd0aCArPSA0ICogdmFsdWUubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZUZsb2F0ICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5yZXNlcnZlKHRoaXMubGVuZ3RoICsgNCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2J1ZmZWaWV3LnNldEZsb2F0MzIodGhpcy5sZW5ndGgsIHZhbHVlLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmxlbmd0aCArPSA0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZUZsb2F0QXJyYXkgKHZhbHVlOiBudW1iZXJbXSkge1xyXG4gICAgICAgIHRoaXMucmVzZXJ2ZSh0aGlzLmxlbmd0aCArIDQgKiB2YWx1ZS5sZW5ndGgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZWaWV3LnNldEZsb2F0MzIodGhpcy5sZW5ndGggKyBpICogNCwgdmFsdWVbaV0sIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxlbmd0aCArPSA0ICogdmFsdWUubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB3cml0ZVN0cmluZyAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucmVzZXJ2ZSh0aGlzLmxlbmd0aCArIHZhbHVlLmxlbmd0aCArIDQpO1xyXG5cclxuICAgICAgICB0aGlzLl9idWZmVmlldy5zZXRJbnQzMih0aGlzLmxlbmd0aCwgdmFsdWUubGVuZ3RoLCB0cnVlKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZWaWV3LnNldEludDgodGhpcy5sZW5ndGggKyA0ICsgaSwgdmFsdWUuY2hhckNvZGVBdChpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGVuZ3RoICs9IHZhbHVlLmxlbmd0aCArIDQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlYWRJbnQ4ICgpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2J1ZmZWaWV3LmdldEludDgodGhpcy5fc2Vla1Bvcyk7XHJcbiAgICAgICAgdGhpcy5fc2Vla1BvcyArPSAxO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhZEludDE2ICgpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2J1ZmZWaWV3LmdldEludDE2KHRoaXMuX3NlZWtQb3MsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuX3NlZWtQb3MgKz0gMjtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlYWRJbnQgKCkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fYnVmZlZpZXcuZ2V0SW50MzIodGhpcy5fc2Vla1BvcywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fc2Vla1BvcyArPSA0O1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhZEludEFycmF5ICh2YWx1ZTogbnVtYmVyW10pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlW2ldID0gdGhpcy5fYnVmZlZpZXcuZ2V0SW50MzIodGhpcy5fc2Vla1BvcyArIGkgKiA0LCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2Vla1BvcyArPSA0ICogdmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhZEZsb2F0ICgpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2J1ZmZWaWV3LmdldEZsb2F0MzIodGhpcy5fc2Vla1BvcywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fc2Vla1BvcyArPSA0O1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhZEZsb2F0QXJyYXkgKHZhbHVlOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFsdWVbaV0gPSB0aGlzLl9idWZmVmlldy5nZXRGbG9hdDMyKHRoaXMuX3NlZWtQb3MgKyBpICogNCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NlZWtQb3MgKz0gNCAqIHZhbHVlLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlYWRTdHJpbmcgKCkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMucmVhZEludCgpO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWUgPSAnJztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5yZWFkSW50OCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiB0ZXJyYWluIGxheWVyIGluZm9cclxuICogQHpoIOWcsOW9oue6ueeQhuS/oeaBr1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRlcnJhaW5MYXllckluZm8ge1xyXG4gICAgcHVibGljIHNsb3Q6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdGlsZVNpemU6IG51bWJlciA9IDE7XHJcbiAgICBwdWJsaWMgZGV0YWlsTWFwOiBzdHJpbmcgPSAnJztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiB0ZXJyYWluIGFzc2V0XHJcbiAqIEB6aCDlnLDlvaLotYTmupBcclxuICovXHJcbkBjY2NsYXNzKCdjYy5UZXJyYWluQXNzZXQnKVxyXG5leHBvcnQgY2xhc3MgVGVycmFpbkFzc2V0IGV4dGVuZHMgQXNzZXQge1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOiBVaW50OEFycmF5fG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF90aWxlU2l6ZTogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfYmxvY2tDb3VudDogbnVtYmVyW10gPSBbMSwgMV07XHJcbiAgICBwcm90ZWN0ZWQgX3dlaWdodE1hcFNpemU6IG51bWJlciA9IDEyODtcclxuICAgIHByb3RlY3RlZCBfbGlnaHRNYXBTaXplOiBudW1iZXIgPSAxMjg7XHJcbiAgICBwcm90ZWN0ZWQgX2hlaWdodHM6IFVpbnQxNkFycmF5ID0gbmV3IFVpbnQxNkFycmF5KCk7XHJcbiAgICBwcm90ZWN0ZWQgX3dlaWdodHM6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheSgpO1xyXG4gICAgcHJvdGVjdGVkIF9sYXllckJ1ZmZlcjogbnVtYmVyW10gPSBbLTEsIC0xLCAtMSwgLTFdO1xyXG4gICAgcHJvdGVjdGVkIF9sYXllckluZm9zOiBUZXJyYWluTGF5ZXJJbmZvW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBfbmF0aXZlQXNzZXQgKCk6IEFycmF5QnVmZmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YSEuYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBfbmF0aXZlQXNzZXQgKHZhbHVlOiBBcnJheUJ1ZmZlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9kYXRhICYmIHRoaXMuX2RhdGEuYnl0ZUxlbmd0aCA9PT0gdmFsdWUuYnl0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhLnNldChuZXcgVWludDhBcnJheSh2YWx1ZSkpO1xyXG4gICAgICAgICAgICBpZiAobGVnYWN5Q0MubG9hZGVyLl9jYWNoZVt0aGlzLm5hdGl2ZVVybF0pIHtcclxuICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmxvYWRlci5fY2FjaGVbdGhpcy5uYXRpdmVVcmxdLmNvbnRlbnQgPSB0aGlzLl9kYXRhLmJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBVaW50OEFycmF5KHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2xvYWROYXRpdmVEYXRhKHRoaXMuX2RhdGEpO1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVtaXQoJ2xvYWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiB0aWxlIHNpemVcclxuICAgICAqIEB6aCDmoIXmoLzlpKflsI9cclxuICAgICAqL1xyXG4gICAgc2V0IHRpbGVTaXplICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdGlsZVNpemUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGlsZVNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aWxlU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBibG9jayBjb3VudFxyXG4gICAgICogQHpoIOWdl+aVsOmHj1xyXG4gICAgICovXHJcbiAgICBzZXQgYmxvY2tDb3VudCAodmFsdWU6IG51bWJlcltdKSB7XHJcbiAgICAgICAgdGhpcy5fYmxvY2tDb3VudCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBibG9ja0NvdW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBsaWdodCBtYXAgc2l6ZVxyXG4gICAgICogQHpoIOWFieeFp+WbvuWkp+Wwj1xyXG4gICAgICovXHJcbiAgICBzZXQgbGlnaHRNYXBTaXplICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRNYXBTaXplID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxpZ2h0TWFwU2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpZ2h0TWFwU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiB3ZWlnaHQgbWFwIHNpemVcclxuICAgICAqIEB6aCDmnYPph43lm77lpKflsI9cclxuICAgICAqL1xyXG4gICAgc2V0IHdlaWdodE1hcFNpemUgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93ZWlnaHRNYXBTaXplID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdlaWdodE1hcFNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZWlnaHRNYXBTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGhlaWdodCBidWZmZXJcclxuICAgICAqIEB6aCDpq5jluqbnvJPlrZhcclxuICAgICAqL1xyXG4gICAgc2V0IGhlaWdodHMgKHZhbHVlOiBVaW50MTZBcnJheSkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodHMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0cyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gd2VpZ2h0IGJ1ZmZlclxyXG4gICAgICogQHpoIOadg+mHjee8k+WtmFxyXG4gICAgICovXHJcbiAgICBzZXQgd2VpZ2h0cyAodmFsdWU6IFVpbnQ4QXJyYXkpIHtcclxuICAgICAgICB0aGlzLl93ZWlnaHRzID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdlaWdodHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZWlnaHRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGxheWVyIGJ1ZmZlclxyXG4gICAgICogQHpoIOe6ueeQhue0ouW8lee8k+WtmFxyXG4gICAgICovXHJcbiAgICBzZXQgbGF5ZXJCdWZmZXIgKHZhbHVlOiBudW1iZXJbXSkge1xyXG4gICAgICAgIHRoaXMuX2xheWVyQnVmZmVyID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxheWVyQnVmZmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gbGF5ZXIgaW5mb1xyXG4gICAgICogQHpoIOe6ueeQhuS/oeaBr1xyXG4gICAgICovXHJcbiAgICBzZXQgbGF5ZXJJbmZvcyAodmFsdWU6IFRlcnJhaW5MYXllckluZm9bXSkge1xyXG4gICAgICAgIHRoaXMuX2xheWVySW5mb3MgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGF5ZXJJbmZvcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVySW5mb3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IGxheWVyXHJcbiAgICAgKiBAcGFyYW0geEJsb2NrIGJsb2NrIGluZGV4IHhcclxuICAgICAqIEBwYXJhbSB5QmxvY2sgYmxvY2sgaW5kZXggeVxyXG4gICAgICogQHBhcmFtIGxheWVySWQgbGF5ZXIgaWRcclxuICAgICAqIEB6aCDojrflvpfnurnnkIbntKLlvJVcclxuICAgICAqIEBwYXJhbSB4QmxvY2sg5Zyw5b2i5Z2X57Si5byVeFxyXG4gICAgICogQHBhcmFtIHlCbG9jayDlnLDlvaLlnZfntKLlvJV5XHJcbiAgICAgKiBAcGFyYW0gbGF5ZXJJZCDlsYJJZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TGF5ZXIgKHhCbG9jazogbnVtYmVyLCB5QmxvY2s6IG51bWJlciwgbGF5ZXJJZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYmxvY2tJZCA9IHlCbG9jayAqIHRoaXMuYmxvY2tDb3VudFswXSArIHhCbG9jaztcclxuICAgICAgICBjb25zdCBpbmRleCA9IGJsb2NrSWQgKiA0ICsgbGF5ZXJJZDtcclxuXHJcbiAgICAgICAgaWYgKHhCbG9jayA8IHRoaXMuYmxvY2tDb3VudFswXSAmJiB5QmxvY2sgPCB0aGlzLmJsb2NrQ291bnRbMV0gJiYgaW5kZXggPCB0aGlzLl9sYXllckJ1ZmZlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyQnVmZmVyW2luZGV4XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SGVpZ2h0IChpOiBudW1iZXIsIGo6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHZlcnRleENvdW50WCA9IHRoaXMuX2Jsb2NrQ291bnRbMF0gKiBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWSArIDE7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9oZWlnaHRzW2ogKiB2ZXJ0ZXhDb3VudFggKyBpXSAtIFRFUlJBSU5fSEVJR0hUX0JBU0UpICogVEVSUkFJTl9IRUlHSFRfRkFDVE9SWTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VmVydGV4Q291bnRJICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYmxvY2tDb3VudC5sZW5ndGggPCAxKSByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tDb3VudFswXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICsgMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VmVydGV4Q291bnRKICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYmxvY2tDb3VudC5sZW5ndGggPCAyKSByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tDb3VudFsxXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICsgMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3NldE5hdGl2ZURhdGEgKF9uYXRpdmVEYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IF9uYXRpdmVEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfbG9hZE5hdGl2ZURhdGEgKF9uYXRpdmVEYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFRlcnJhaW5CdWZmZXIoKTtcclxuICAgICAgICBzdHJlYW0uYXNzaWduKF9uYXRpdmVEYXRhKTtcclxuXHJcbiAgICAgICAgLy8gdmVyc2lvblxyXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSBzdHJlYW0ucmVhZEludCgpO1xyXG4gICAgICAgIGlmICh2ZXJzaW9uID09PSBURVJSQUlOX0RBVEFfVkVSU0lPTl9ERUZBVUxUKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmVyc2lvbiAhPT0gVEVSUkFJTl9EQVRBX1ZFUlNJT04gJiZcclxuICAgICAgICAgICAgdmVyc2lvbiAhPT0gVEVSUkFJTl9EQVRBX1ZFUlNJT04yICYmXHJcbiAgICAgICAgICAgIHZlcnNpb24gIT09IFRFUlJBSU5fREFUQV9WRVJTSU9OMykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBnZW9tZXRyeSBpbmZvXHJcbiAgICAgICAgdGhpcy50aWxlU2l6ZSA9IHN0cmVhbS5yZWFkRmxvYXQoKTtcclxuICAgICAgICBzdHJlYW0ucmVhZEludEFycmF5KHRoaXMuX2Jsb2NrQ291bnQpO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0TWFwU2l6ZSA9IHN0cmVhbS5yZWFkSW50MTYoKTtcclxuICAgICAgICB0aGlzLmxpZ2h0TWFwU2l6ZSA9IHN0cmVhbS5yZWFkSW50MTYoKTtcclxuXHJcbiAgICAgICAgLy8gaGVpZ2h0c1xyXG4gICAgICAgIGNvbnN0IGhlaWdodEJ1ZmZlclNpemUgPSBzdHJlYW0ucmVhZEludCgpO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0cyA9IG5ldyBVaW50MTZBcnJheShoZWlnaHRCdWZmZXJTaXplKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodHNbaV0gPSBzdHJlYW0ucmVhZEludDE2KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB3ZWlnaHRzXHJcbiAgICAgICAgY29uc3QgV2VpZ2h0QnVmZmVyU2l6ZSA9IHN0cmVhbS5yZWFkSW50KCk7XHJcbiAgICAgICAgdGhpcy53ZWlnaHRzID0gbmV3IFVpbnQ4QXJyYXkoV2VpZ2h0QnVmZmVyU2l6ZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndlaWdodHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy53ZWlnaHRzW2ldID0gc3RyZWFtLnJlYWRJbnQ4KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsYXllciBidWZmZXJcclxuICAgICAgICBpZiAodmVyc2lvbiA+PSBURVJSQUlOX0RBVEFfVkVSU0lPTjIpIHtcclxuICAgICAgICAgICAgY29uc3QgbGF5ZXJCdWZmZXJTaXplID0gc3RyZWFtLnJlYWRJbnQoKTtcclxuICAgICAgICAgICAgdGhpcy5sYXllckJ1ZmZlciA9IG5ldyBBcnJheTxudW1iZXI+KGxheWVyQnVmZmVyU2l6ZSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sYXllckJ1ZmZlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXllckJ1ZmZlcltpXSA9IHN0cmVhbS5yZWFkSW50MTYoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbGF5ZXIgaW5mb3NcclxuICAgICAgICBpZiAodmVyc2lvbiA+PSBURVJSQUlOX0RBVEFfVkVSU0lPTjMpIHtcclxuICAgICAgICAgICAgY29uc3QgbGF5ZXJJbmZvU2l6ZSA9IHN0cmVhbS5yZWFkSW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMubGF5ZXJJbmZvcyA9IG5ldyBBcnJheTxUZXJyYWluTGF5ZXJJbmZvPihsYXllckluZm9TaXplKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxheWVySW5mb3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGF5ZXJJbmZvc1tpXSA9IG5ldyBUZXJyYWluTGF5ZXJJbmZvKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxheWVySW5mb3NbaV0uc2xvdCA9IHN0cmVhbS5yZWFkSW50KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxheWVySW5mb3NbaV0udGlsZVNpemUgPSBzdHJlYW0ucmVhZEZsb2F0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxheWVySW5mb3NbaV0uZGV0YWlsTWFwID0gc3RyZWFtLnJlYWRTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfZXhwb3J0TmF0aXZlRGF0YSAoKTogVWludDhBcnJheSB7XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFRlcnJhaW5CdWZmZXIoKTtcclxuXHJcbiAgICAgICAgLy8gdmVyc2lvblxyXG4gICAgICAgIHN0cmVhbS53cml0ZUludDMyKFRFUlJBSU5fREFUQV9WRVJTSU9OMyk7XHJcblxyXG4gICAgICAgIC8vIGdlb21ldHJ5IGluZm9cclxuICAgICAgICBzdHJlYW0ud3JpdGVGbG9hdCh0aGlzLnRpbGVTaXplKTtcclxuICAgICAgICBzdHJlYW0ud3JpdGVJbnRBcnJheSh0aGlzLl9ibG9ja0NvdW50KTtcclxuICAgICAgICBzdHJlYW0ud3JpdGVJbnQxNih0aGlzLndlaWdodE1hcFNpemUpO1xyXG4gICAgICAgIHN0cmVhbS53cml0ZUludDE2KHRoaXMubGlnaHRNYXBTaXplKTtcclxuXHJcbiAgICAgICAgIC8vIGhlaWdodHNcclxuICAgICAgICBzdHJlYW0ud3JpdGVJbnQzMih0aGlzLmhlaWdodHMubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBzdHJlYW0ud3JpdGVJbnQxNih0aGlzLmhlaWdodHNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gd2VpZ2h0c1xyXG4gICAgICAgIHN0cmVhbS53cml0ZUludDMyKHRoaXMud2VpZ2h0cy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53ZWlnaHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHN0cmVhbS53cml0ZUludDgodGhpcy53ZWlnaHRzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGxheWVyIGJ1ZmZlclxyXG4gICAgICAgIHN0cmVhbS53cml0ZUludDMyKHRoaXMubGF5ZXJCdWZmZXIubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGF5ZXJCdWZmZXIubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgc3RyZWFtLndyaXRlSW50MTYodGhpcy5sYXllckJ1ZmZlcltpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsYXllciBpbmZvc1xyXG4gICAgICAgIHN0cmVhbS53cml0ZUludDMyKHRoaXMubGF5ZXJJbmZvcy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sYXllckluZm9zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHN0cmVhbS53cml0ZUludDMyKHRoaXMubGF5ZXJJbmZvc1tpXS5zbG90KTtcclxuICAgICAgICAgICAgc3RyZWFtLndyaXRlRmxvYXQodGhpcy5sYXllckluZm9zW2ldLnRpbGVTaXplKTtcclxuICAgICAgICAgICAgc3RyZWFtLndyaXRlU3RyaW5nKHRoaXMubGF5ZXJJbmZvc1tpXS5kZXRhaWxNYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0cmVhbS5idWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9leHBvcnREZWZhdWx0TmF0aXZlRGF0YSAoKTogVWludDhBcnJheSB7XHJcbiAgICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFRlcnJhaW5CdWZmZXIoKTtcclxuICAgICAgICBzdHJlYW0ud3JpdGVJbnQzMihURVJSQUlOX0RBVEFfVkVSU0lPTl9ERUZBVUxUKTtcclxuICAgICAgICByZXR1cm4gc3RyZWFtLmJ1ZmZlcjtcclxuXHJcbiAgICB9XHJcbn1cclxuIl19