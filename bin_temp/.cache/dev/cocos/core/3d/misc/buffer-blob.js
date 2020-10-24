(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.bufferBlob = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BufferBlob = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BufferBlob = /*#__PURE__*/function () {
    function BufferBlob() {
      _classCallCheck(this, BufferBlob);

      this._arrayBufferOrPaddings = [];
      this._length = 0;
    }

    _createClass(BufferBlob, [{
      key: "setNextAlignment",
      value: function setNextAlignment(align) {
        if (align !== 0) {
          var remainder = this._length % align;

          if (remainder !== 0) {
            var padding = align - remainder;

            this._arrayBufferOrPaddings.push(padding);

            this._length += padding;
          }
        }
      }
    }, {
      key: "addBuffer",
      value: function addBuffer(arrayBuffer) {
        var result = this._length;

        this._arrayBufferOrPaddings.push(arrayBuffer);

        this._length += arrayBuffer.byteLength;
        return result;
      }
    }, {
      key: "getLength",
      value: function getLength() {
        return this._length;
      }
    }, {
      key: "getCombined",
      value: function getCombined() {
        var result = new Uint8Array(this._length);
        var counter = 0;

        this._arrayBufferOrPaddings.forEach(function (arrayBufferOrPadding) {
          if (typeof arrayBufferOrPadding === 'number') {
            counter += arrayBufferOrPadding;
          } else {
            result.set(new Uint8Array(arrayBufferOrPadding), counter);
            counter += arrayBufferOrPadding.byteLength;
          }
        });

        return result.buffer;
      }
    }]);

    return BufferBlob;
  }();

  _exports.BufferBlob = BufferBlob;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvbWlzYy9idWZmZXItYmxvYi50cyJdLCJuYW1lcyI6WyJCdWZmZXJCbG9iIiwiX2FycmF5QnVmZmVyT3JQYWRkaW5ncyIsIl9sZW5ndGgiLCJhbGlnbiIsInJlbWFpbmRlciIsInBhZGRpbmciLCJwdXNoIiwiYXJyYXlCdWZmZXIiLCJyZXN1bHQiLCJieXRlTGVuZ3RoIiwiVWludDhBcnJheSIsImNvdW50ZXIiLCJmb3JFYWNoIiwiYXJyYXlCdWZmZXJPclBhZGRpbmciLCJzZXQiLCJidWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQWFBLFU7Ozs7V0FDREMsc0IsR0FBc0QsRTtXQUN0REMsTyxHQUFVLEM7Ozs7O3VDQUVPQyxLLEVBQWU7QUFDcEMsWUFBSUEsS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFDYixjQUFNQyxTQUFTLEdBQUcsS0FBS0YsT0FBTCxHQUFlQyxLQUFqQzs7QUFDQSxjQUFJQyxTQUFTLEtBQUssQ0FBbEIsRUFBcUI7QUFDakIsZ0JBQU1DLE9BQU8sR0FBR0YsS0FBSyxHQUFHQyxTQUF4Qjs7QUFDQSxpQkFBS0gsc0JBQUwsQ0FBNEJLLElBQTVCLENBQWlDRCxPQUFqQzs7QUFDQSxpQkFBS0gsT0FBTCxJQUFnQkcsT0FBaEI7QUFDSDtBQUNKO0FBQ0o7OztnQ0FFaUJFLFcsRUFBMEI7QUFDeEMsWUFBTUMsTUFBTSxHQUFHLEtBQUtOLE9BQXBCOztBQUNBLGFBQUtELHNCQUFMLENBQTRCSyxJQUE1QixDQUFpQ0MsV0FBakM7O0FBQ0EsYUFBS0wsT0FBTCxJQUFnQkssV0FBVyxDQUFDRSxVQUE1QjtBQUNBLGVBQU9ELE1BQVA7QUFDSDs7O2tDQUVtQjtBQUNoQixlQUFPLEtBQUtOLE9BQVo7QUFDSDs7O29DQUVxQjtBQUNsQixZQUFNTSxNQUFNLEdBQUcsSUFBSUUsVUFBSixDQUFlLEtBQUtSLE9BQXBCLENBQWY7QUFDQSxZQUFJUyxPQUFPLEdBQUcsQ0FBZDs7QUFDQSxhQUFLVixzQkFBTCxDQUE0QlcsT0FBNUIsQ0FBb0MsVUFBQ0Msb0JBQUQsRUFBMEI7QUFDMUQsY0FBSSxPQUFPQSxvQkFBUCxLQUFnQyxRQUFwQyxFQUE4QztBQUMxQ0YsWUFBQUEsT0FBTyxJQUFJRSxvQkFBWDtBQUNILFdBRkQsTUFFTztBQUNITCxZQUFBQSxNQUFNLENBQUNNLEdBQVAsQ0FBVyxJQUFJSixVQUFKLENBQWVHLG9CQUFmLENBQVgsRUFBaURGLE9BQWpEO0FBQ0FBLFlBQUFBLE9BQU8sSUFBSUUsb0JBQW9CLENBQUNKLFVBQWhDO0FBQ0g7QUFDSixTQVBEOztBQVFBLGVBQU9ELE1BQU0sQ0FBQ08sTUFBZDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEJ1ZmZlckJsb2Ige1xyXG4gICAgcHJpdmF0ZSBfYXJyYXlCdWZmZXJPclBhZGRpbmdzOiBBcnJheTxBcnJheUJ1ZmZlciB8IG51bWJlcj4gPSBbXTtcclxuICAgIHByaXZhdGUgX2xlbmd0aCA9IDA7XHJcblxyXG4gICAgcHVibGljIHNldE5leHRBbGlnbm1lbnQgKGFsaWduOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoYWxpZ24gIT09IDApIHtcclxuICAgICAgICAgICAgY29uc3QgcmVtYWluZGVyID0gdGhpcy5fbGVuZ3RoICUgYWxpZ247XHJcbiAgICAgICAgICAgIGlmIChyZW1haW5kZXIgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZGRpbmcgPSBhbGlnbiAtIHJlbWFpbmRlcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FycmF5QnVmZmVyT3JQYWRkaW5ncy5wdXNoKHBhZGRpbmcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGVuZ3RoICs9IHBhZGRpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEJ1ZmZlciAoYXJyYXlCdWZmZXI6IEFycmF5QnVmZmVyKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fbGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuX2FycmF5QnVmZmVyT3JQYWRkaW5ncy5wdXNoKGFycmF5QnVmZmVyKTtcclxuICAgICAgICB0aGlzLl9sZW5ndGggKz0gYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRMZW5ndGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbWJpbmVkICgpIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgVWludDhBcnJheSh0aGlzLl9sZW5ndGgpO1xyXG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLl9hcnJheUJ1ZmZlck9yUGFkZGluZ3MuZm9yRWFjaCgoYXJyYXlCdWZmZXJPclBhZGRpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcnJheUJ1ZmZlck9yUGFkZGluZyA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gYXJyYXlCdWZmZXJPclBhZGRpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyT3JQYWRkaW5nKSwgY291bnRlcik7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IGFycmF5QnVmZmVyT3JQYWRkaW5nLmJ5dGVMZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LmJ1ZmZlcjtcclxuICAgIH1cclxufVxyXG4iXX0=