(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../math/index.js", "../../memop/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../math/index.js"), require("../../memop/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index);
    global.renderData = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MeshRenderData = _exports.RenderData = _exports.BaseRenderData = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var BaseRenderData = function BaseRenderData() {
    _classCallCheck(this, BaseRenderData);

    this.material = null;
    this.vertexCount = 0;
    this.indicesCount = 0;
  };

  _exports.BaseRenderData = BaseRenderData;

  var RenderData = /*#__PURE__*/function (_BaseRenderData) {
    _inherits(RenderData, _BaseRenderData);

    function RenderData() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RenderData);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RenderData)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.vData = null;
      _this.uvDirty = true;
      _this.vertDirty = true;
      _this._data = [];
      _this._indices = [];
      _this._pivotX = 0;
      _this._pivotY = 0;
      _this._width = 0;
      _this._height = 0;
      return _this;
    }

    _createClass(RenderData, [{
      key: "updateSizeNPivot",
      value: function updateSizeNPivot(width, height, pivotX, pivotY) {
        if (width !== this._width || height !== this._height || pivotX !== this._pivotX || pivotY !== this._pivotY) {
          this._width = width;
          this._height = height;
          this._pivotX = pivotX;
          this._pivotY = pivotY;
          this.vertDirty = true;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this._data.length = 0;
        this._indices.length = 0;
        this._pivotX = 0;
        this._pivotY = 0;
        this._width = 0;
        this._height = 0;
        this.uvDirty = true;
        this.vertDirty = true;
        this.material = null;
        this.vertexCount = 0;
        this.indicesCount = 0;
      }
    }, {
      key: "dataLength",
      get: function get() {
        return this._data.length;
      },
      set: function set(length) {
        var data = this._data;

        if (data.length !== length) {
          // // Free extra data
          var value = data.length;
          var i = 0;

          for (i = length; i < value; i++) {
            _dataPool.free(data[i]);
          }

          for (i = value; i < length; i++) {
            data[i] = _dataPool.alloc();
          }

          data.length = length;
        }
      }
    }, {
      key: "data",
      get: function get() {
        return this._data;
      }
    }], [{
      key: "add",
      value: function add() {
        return _pool.add();
      }
    }, {
      key: "remove",
      value: function remove(data) {
        var idx = _pool.data.indexOf(data);

        if (idx === -1) {
          return;
        }

        _pool.data[idx].clear();

        _pool.removeAt(idx);
      }
    }]);

    return RenderData;
  }(BaseRenderData);

  _exports.RenderData = RenderData;

  var MeshRenderData = /*#__PURE__*/function (_BaseRenderData2) {
    _inherits(MeshRenderData, _BaseRenderData2);

    function MeshRenderData() {
      var _getPrototypeOf3;

      var _this2;

      _classCallCheck(this, MeshRenderData);

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(MeshRenderData)).call.apply(_getPrototypeOf3, [this].concat(args)));
      _this2.vData = new Float32Array(256 * 9 * Float32Array.BYTES_PER_ELEMENT);
      _this2.iData = new Uint16Array(256 * 6);
      _this2.vertexStart = 0;
      _this2.indicesStart = 0;
      _this2.byteStart = 0;
      _this2.byteCount = 0;
      _this2._formatByte = 9 * Float32Array.BYTES_PER_ELEMENT;
      return _this2;
    }

    _createClass(MeshRenderData, [{
      key: "request",
      value: function request(vertexCount, indicesCount) {
        var byteOffset = this.byteCount + vertexCount * this._formatByte;
        var indicesOffset = this.indicesCount + indicesCount;

        if (vertexCount + this.vertexCount > 65535) {
          return false;
        }

        var byteLength = this.vData.byteLength;
        var indicesLength = this.iData.length;
        var vCount = this.vData.length;
        var iCount = this.iData.length;

        if (byteOffset > byteLength || indicesOffset > indicesLength) {
          while (byteLength < byteOffset || indicesLength < indicesOffset) {
            vCount *= 2;
            iCount *= 2;
            byteLength = vCount * 4;
            indicesLength = iCount;
          } // copy old data


          var oldVData = this.vData;
          this.vData = new Float32Array(vCount);
          this.vData.set(oldVData, 0);
          var oldIData = this.iData;
          this.iData = new Uint16Array(iCount);
          this.iData.set(oldIData, 0);
        }

        this.vertexCount += vertexCount; // vertexOffset

        this.indicesCount += indicesCount; // indicesOffset

        this.byteCount = byteOffset; // byteOffset

        return true;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.vertexCount = 0;
        this.indicesCount = 0;
        this.byteCount = 0;
        this.vertexStart = 0;
        this.indicesStart = 0;
        this.byteStart = 0;
      }
    }]);

    return MeshRenderData;
  }(BaseRenderData);

  _exports.MeshRenderData = MeshRenderData;

  var _dataPool = new _index2.Pool(function () {
    return {
      x: 0,
      y: 0,
      z: 0,
      u: 0,
      v: 0,
      color: _index.Color.WHITE.clone()
    };
  }, 128);

  var _pool = new _index2.RecyclePool(function () {
    return new RenderData();
  }, 32);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvcmVuZGVyLWRhdGEudHMiXSwibmFtZXMiOlsiQmFzZVJlbmRlckRhdGEiLCJtYXRlcmlhbCIsInZlcnRleENvdW50IiwiaW5kaWNlc0NvdW50IiwiUmVuZGVyRGF0YSIsInZEYXRhIiwidXZEaXJ0eSIsInZlcnREaXJ0eSIsIl9kYXRhIiwiX2luZGljZXMiLCJfcGl2b3RYIiwiX3Bpdm90WSIsIl93aWR0aCIsIl9oZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsInBpdm90WCIsInBpdm90WSIsImxlbmd0aCIsImRhdGEiLCJ2YWx1ZSIsImkiLCJfZGF0YVBvb2wiLCJmcmVlIiwiYWxsb2MiLCJfcG9vbCIsImFkZCIsImlkeCIsImluZGV4T2YiLCJjbGVhciIsInJlbW92ZUF0IiwiTWVzaFJlbmRlckRhdGEiLCJGbG9hdDMyQXJyYXkiLCJCWVRFU19QRVJfRUxFTUVOVCIsImlEYXRhIiwiVWludDE2QXJyYXkiLCJ2ZXJ0ZXhTdGFydCIsImluZGljZXNTdGFydCIsImJ5dGVTdGFydCIsImJ5dGVDb3VudCIsIl9mb3JtYXRCeXRlIiwiYnl0ZU9mZnNldCIsImluZGljZXNPZmZzZXQiLCJieXRlTGVuZ3RoIiwiaW5kaWNlc0xlbmd0aCIsInZDb3VudCIsImlDb3VudCIsIm9sZFZEYXRhIiwic2V0Iiwib2xkSURhdGEiLCJQb29sIiwieCIsInkiLCJ6IiwidSIsInYiLCJjb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJjbG9uZSIsIlJlY3ljbGVQb29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTBDYUEsYzs7O1NBQ0ZDLFEsR0FBNEIsSTtTQUM1QkMsVyxHQUFzQixDO1NBQ3RCQyxZLEdBQXVCLEM7Ozs7O01BR3JCQyxVOzs7Ozs7Ozs7Ozs7Ozs7WUF5Q0ZDLEssR0FBNkIsSTtZQUU3QkMsTyxHQUFtQixJO1lBQ25CQyxTLEdB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cmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBQb29sLCBSZWN5Y2xlUG9vbCB9IGZyb20gJy4uLy4uL21lbW9wJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlckRhdGEge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgejogbnVtYmVyO1xyXG4gICAgdTogbnVtYmVyO1xyXG4gICAgdjogbnVtYmVyO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZVJlbmRlckRhdGEge1xyXG4gICAgcHVibGljIG1hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHZlcnRleENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIGluZGljZXNDb3VudDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlbmRlckRhdGEgZXh0ZW5kcyBCYXNlUmVuZGVyRGF0YSB7XHJcblxyXG4gICAgZ2V0IGRhdGFMZW5ndGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGF0YUxlbmd0aCAobGVuZ3RoOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkYXRhOiBJUmVuZGVyRGF0YVtdID0gdGhpcy5fZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggIT09IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyAvLyBGcmVlIGV4dHJhIGRhdGFcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBsZW5ndGg7IGkgPCB2YWx1ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBfZGF0YVBvb2wuZnJlZShkYXRhW2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gdmFsdWU7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IF9kYXRhUG9vbC5hbGxvYygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkYXRhLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRhdGEgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYWRkICgpIHtcclxuICAgICAgICByZXR1cm4gX3Bvb2wuYWRkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmUgKGRhdGE6IFJlbmRlckRhdGEpIHtcclxuICAgICAgICBjb25zdCBpZHggPSBfcG9vbC5kYXRhLmluZGV4T2YoZGF0YSk7XHJcbiAgICAgICAgaWYgKGlkeCA9PT0gLTEpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfcG9vbC5kYXRhW2lkeF0uY2xlYXIoKTtcclxuICAgICAgICBfcG9vbC5yZW1vdmVBdChpZHgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHZEYXRhOiBGbG9hdDMyQXJyYXkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgdXZEaXJ0eTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdmVydERpcnR5OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX2RhdGE6IElSZW5kZXJEYXRhW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2luZGljZXM6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9waXZvdFg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9waXZvdFk6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF93aWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2hlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlU2l6ZU5QaXZvdCAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHBpdm90WDogbnVtYmVyLCBwaXZvdFk6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh3aWR0aCAhPT0gdGhpcy5fd2lkdGggfHxcclxuICAgICAgICAgICAgaGVpZ2h0ICE9PSB0aGlzLl9oZWlnaHQgfHxcclxuICAgICAgICAgICAgcGl2b3RYICE9PSB0aGlzLl9waXZvdFggfHxcclxuICAgICAgICAgICAgcGl2b3RZICE9PSB0aGlzLl9waXZvdFkpIHtcclxuICAgICAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLl9waXZvdFggPSBwaXZvdFg7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90WSA9IHBpdm90WTtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuX2RhdGEubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9pbmRpY2VzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fcGl2b3RYID0gMDtcclxuICAgICAgICB0aGlzLl9waXZvdFkgPSAwO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gMDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMudXZEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy52ZXJ0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaW5kaWNlc0NvdW50ID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1lc2hSZW5kZXJEYXRhIGV4dGVuZHMgQmFzZVJlbmRlckRhdGEge1xyXG4gICAgcHVibGljIHZEYXRhOiBGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDI1NiAqIDkgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQpO1xyXG4gICAgcHVibGljIGlEYXRhOiBVaW50MTZBcnJheSA9IG5ldyBVaW50MTZBcnJheSgyNTYgKiA2KTtcclxuICAgIHB1YmxpYyB2ZXJ0ZXhTdGFydCA9IDA7XHJcbiAgICBwdWJsaWMgaW5kaWNlc1N0YXJ0ID0gMDtcclxuICAgIHB1YmxpYyBieXRlU3RhcnQgPSAwO1xyXG4gICAgcHVibGljIGJ5dGVDb3VudCA9IDA7XHJcbiAgICBwcml2YXRlIF9mb3JtYXRCeXRlID0gOSAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVDtcclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdCAodmVydGV4Q291bnQ6IG51bWJlciwgaW5kaWNlc0NvdW50OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBieXRlT2Zmc2V0ID0gdGhpcy5ieXRlQ291bnQgKyB2ZXJ0ZXhDb3VudCAqIHRoaXMuX2Zvcm1hdEJ5dGU7XHJcbiAgICAgICAgY29uc3QgaW5kaWNlc09mZnNldCA9IHRoaXMuaW5kaWNlc0NvdW50ICsgaW5kaWNlc0NvdW50O1xyXG5cclxuICAgICAgICBpZiAodmVydGV4Q291bnQgKyB0aGlzLnZlcnRleENvdW50ID4gNjU1MzUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJ5dGVMZW5ndGggPSB0aGlzLnZEYXRhIS5ieXRlTGVuZ3RoO1xyXG4gICAgICAgIGxldCBpbmRpY2VzTGVuZ3RoID0gdGhpcy5pRGF0YSEubGVuZ3RoO1xyXG4gICAgICAgIGxldCB2Q291bnQgPSB0aGlzLnZEYXRhLmxlbmd0aDtcclxuICAgICAgICBsZXQgaUNvdW50ID0gdGhpcy5pRGF0YS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgPiBieXRlTGVuZ3RoIHx8IGluZGljZXNPZmZzZXQgPiBpbmRpY2VzTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCB8fCBpbmRpY2VzTGVuZ3RoIDwgaW5kaWNlc09mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgdkNvdW50ICo9IDI7XHJcbiAgICAgICAgICAgICAgICBpQ291bnQgKj0gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBieXRlTGVuZ3RoID0gdkNvdW50ICogNDtcclxuICAgICAgICAgICAgICAgIGluZGljZXNMZW5ndGggPSBpQ291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29weSBvbGQgZGF0YVxyXG4gICAgICAgICAgICBjb25zdCBvbGRWRGF0YSA9IHRoaXMudkRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMudkRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHZDb3VudCk7XHJcbiAgICAgICAgICAgIHRoaXMudkRhdGEuc2V0KG9sZFZEYXRhLCAwKTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkSURhdGEgPSB0aGlzLmlEYXRhO1xyXG4gICAgICAgICAgICB0aGlzLmlEYXRhID0gbmV3IFVpbnQxNkFycmF5KGlDb3VudCk7XHJcbiAgICAgICAgICAgIHRoaXMuaURhdGEuc2V0KG9sZElEYXRhLCAwKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvdW50ICs9IHZlcnRleENvdW50OyAvLyB2ZXJ0ZXhPZmZzZXRcclxuICAgICAgICB0aGlzLmluZGljZXNDb3VudCArPSBpbmRpY2VzQ291bnQ7IC8vIGluZGljZXNPZmZzZXRcclxuICAgICAgICB0aGlzLmJ5dGVDb3VudCA9IGJ5dGVPZmZzZXQ7IC8vIGJ5dGVPZmZzZXRcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQgKCkge1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaW5kaWNlc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmJ5dGVDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhTdGFydCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbmRpY2VzU3RhcnQgPSAwO1xyXG4gICAgICAgIHRoaXMuYnl0ZVN0YXJ0ID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgX2RhdGFQb29sID0gbmV3IFBvb2woKCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDAsXHJcbiAgICAgICAgejogMCxcclxuICAgICAgICB1OiAwLFxyXG4gICAgICAgIHY6IDAsXHJcbiAgICAgICAgY29sb3I6IENvbG9yLldISVRFLmNsb25lKCksXHJcbiAgICB9O1xyXG59LCAxMjgpO1xyXG5cclxuY29uc3QgX3Bvb2wgPSBuZXcgUmVjeWNsZVBvb2woKCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBSZW5kZXJEYXRhKCk7XHJcbn0sIDMyKTtcclxuIl19