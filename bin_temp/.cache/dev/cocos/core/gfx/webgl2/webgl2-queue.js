(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../queue.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../queue.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.queue);
    global.webgl2Queue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _queue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Queue = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Queue = /*#__PURE__*/function (_GFXQueue) {
    _inherits(WebGL2Queue, _GFXQueue);

    function WebGL2Queue() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Queue);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Queue)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.numDrawCalls = 0;
      _this.numInstances = 0;
      _this.numTris = 0;
      return _this;
    }

    _createClass(WebGL2Queue, [{
      key: "initialize",
      value: function initialize(info) {
        this._type = info.type;
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "submit",
      value: function submit(cmdBuffs, fence) {
        // TODO: Async
        if (!this._isAsync) {
          for (var i = 0; i < cmdBuffs.length; i++) {
            var cmdBuff = cmdBuffs[i]; // WebGL2CmdFuncExecuteCmds(this._device as WebGL2Device, cmdBuff.cmdPackage); // opted out

            this.numDrawCalls += cmdBuff.numDrawCalls;
            this.numInstances += cmdBuff.numInstances;
            this.numTris += cmdBuff.numTris;
          }
        }

        if (fence) {
          fence.insert();
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.numDrawCalls = 0;
        this.numInstances = 0;
        this.numTris = 0;
      }
    }]);

    return WebGL2Queue;
  }(_queue.GFXQueue);

  _exports.WebGL2Queue = WebGL2Queue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItcXVldWUudHMiXSwibmFtZXMiOlsiV2ViR0wyUXVldWUiLCJudW1EcmF3Q2FsbHMiLCJudW1JbnN0YW5jZXMiLCJudW1UcmlzIiwiaW5mbyIsIl90eXBlIiwidHlwZSIsImNtZEJ1ZmZzIiwiZmVuY2UiLCJfaXNBc3luYyIsImkiLCJsZW5ndGgiLCJjbWRCdWZmIiwiaW5zZXJ0IiwiR0ZYUXVldWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLFc7Ozs7Ozs7Ozs7Ozs7OztZQUVGQyxZLEdBQXVCLEM7WUFDdkJDLFksR0FBdUIsQztZQUN2QkMsTyxHQUFrQixDOzs7Ozs7aUNBRU5DLEksRUFBNkI7QUFFNUMsYUFBS0MsS0FBTCxHQUFhRCxJQUFJLENBQUNFLElBQWxCO0FBRUEsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUIsQ0FDakI7Ozs2QkFFY0MsUSxFQUE4QkMsSyxFQUFrQjtBQUMzRDtBQUNBLFlBQUksQ0FBQyxLQUFLQyxRQUFWLEVBQW9CO0FBQ2hCLGVBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsUUFBUSxDQUFDSSxNQUE3QixFQUFxQ0QsQ0FBQyxFQUF0QyxFQUEwQztBQUN0QyxnQkFBTUUsT0FBTyxHQUFHTCxRQUFRLENBQUNHLENBQUQsQ0FBeEIsQ0FEc0MsQ0FFdEM7O0FBQ0EsaUJBQUtULFlBQUwsSUFBcUJXLE9BQU8sQ0FBQ1gsWUFBN0I7QUFDQSxpQkFBS0MsWUFBTCxJQUFxQlUsT0FBTyxDQUFDVixZQUE3QjtBQUNBLGlCQUFLQyxPQUFMLElBQWdCUyxPQUFPLENBQUNULE9BQXhCO0FBQ0g7QUFDSjs7QUFDRCxZQUFJSyxLQUFKLEVBQVc7QUFDTkEsVUFBQUEsS0FBRCxDQUF1QkssTUFBdkI7QUFDSDtBQUNKOzs7OEJBRWU7QUFDWixhQUFLWixZQUFMLEdBQW9CLENBQXBCO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNBLGFBQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0g7Ozs7SUFwQzRCVyxlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYQ29tbWFuZEJ1ZmZlciB9IGZyb20gJy4uL2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYUXVldWUsIEdGWFF1ZXVlSW5mbyB9IGZyb20gJy4uL3F1ZXVlJztcclxuaW1wb3J0IHsgV2ViR0wyQ29tbWFuZEJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYRmVuY2UgfSBmcm9tICcuLi9mZW5jZSc7XHJcbmltcG9ydCB7IFdlYkdMMkZlbmNlIH0gZnJvbSAnLi93ZWJnbDItZmVuY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMlF1ZXVlIGV4dGVuZHMgR0ZYUXVldWUge1xyXG5cclxuICAgIHB1YmxpYyBudW1EcmF3Q2FsbHM6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgbnVtSW5zdGFuY2VzOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIG51bVRyaXM6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWFF1ZXVlSW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gaW5mby50eXBlO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1Ym1pdCAoY21kQnVmZnM6IEdGWENvbW1hbmRCdWZmZXJbXSwgZmVuY2U/OiBHRlhGZW5jZSkge1xyXG4gICAgICAgIC8vIFRPRE86IEFzeW5jXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0FzeW5jKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY21kQnVmZnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZEJ1ZmYgPSBjbWRCdWZmc1tpXSBhcyBXZWJHTDJDb21tYW5kQnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgLy8gV2ViR0wyQ21kRnVuY0V4ZWN1dGVDbWRzKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsIGNtZEJ1ZmYuY21kUGFja2FnZSk7IC8vIG9wdGVkIG91dFxyXG4gICAgICAgICAgICAgICAgdGhpcy5udW1EcmF3Q2FsbHMgKz0gY21kQnVmZi5udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm51bUluc3RhbmNlcyArPSBjbWRCdWZmLm51bUluc3RhbmNlcztcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtVHJpcyArPSBjbWRCdWZmLm51bVRyaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZlbmNlKSB7XHJcbiAgICAgICAgICAgIChmZW5jZSBhcyBXZWJHTDJGZW5jZSkuaW5zZXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5udW1EcmF3Q2FsbHMgPSAwO1xyXG4gICAgICAgIHRoaXMubnVtSW5zdGFuY2VzID0gMDtcclxuICAgICAgICB0aGlzLm51bVRyaXMgPSAwO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==