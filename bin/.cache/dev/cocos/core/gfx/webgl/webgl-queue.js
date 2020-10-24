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
    global.webglQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _queue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLQueue = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLQueue = /*#__PURE__*/function (_GFXQueue) {
    _inherits(WebGLQueue, _GFXQueue);

    function WebGLQueue() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLQueue);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLQueue)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.numDrawCalls = 0;
      _this.numInstances = 0;
      _this.numTris = 0;
      return _this;
    }

    _createClass(WebGLQueue, [{
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
        if (!this._isAsync) {
          var len = cmdBuffs.length;

          for (var i = 0; i < len; i++) {
            var cmdBuff = cmdBuffs[i]; // WebGLCmdFuncExecuteCmds( this._device as WebGLDevice, (cmdBuff as WebGLCommandBuffer).cmdPackage); // opted out

            this.numDrawCalls += cmdBuff.numDrawCalls;
            this.numInstances += cmdBuff.numInstances;
            this.numTris += cmdBuff.numTris;
          }
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

    return WebGLQueue;
  }(_queue.GFXQueue);

  _exports.WebGLQueue = WebGLQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXF1ZXVlLnRzIl0sIm5hbWVzIjpbIldlYkdMUXVldWUiLCJudW1EcmF3Q2FsbHMiLCJudW1JbnN0YW5jZXMiLCJudW1UcmlzIiwiaW5mbyIsIl90eXBlIiwidHlwZSIsImNtZEJ1ZmZzIiwiZmVuY2UiLCJfaXNBc3luYyIsImxlbiIsImxlbmd0aCIsImkiLCJjbWRCdWZmIiwiR0ZYUXVldWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BSWFBLFU7Ozs7Ozs7Ozs7Ozs7OztZQUVGQyxZLEdBQXVCLEM7WUFDdkJDLFksR0FBdUIsQztZQUN2QkMsTyxHQUFrQixDOzs7Ozs7aUNBRU5DLEksRUFBNkI7QUFFNUMsYUFBS0MsS0FBTCxHQUFhRCxJQUFJLENBQUNFLElBQWxCO0FBRUEsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUIsQ0FDakI7Ozs2QkFFY0MsUSxFQUE4QkMsSyxFQUFrQjtBQUMzRCxZQUFJLENBQUMsS0FBS0MsUUFBVixFQUFvQjtBQUNoQixjQUFNQyxHQUFHLEdBQUdILFFBQVEsQ0FBQ0ksTUFBckI7O0FBQ0EsZUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixHQUFwQixFQUF5QkUsQ0FBQyxFQUExQixFQUE4QjtBQUMxQixnQkFBTUMsT0FBTyxHQUFHTixRQUFRLENBQUNLLENBQUQsQ0FBeEIsQ0FEMEIsQ0FFMUI7O0FBQ0EsaUJBQUtYLFlBQUwsSUFBcUJZLE9BQU8sQ0FBQ1osWUFBN0I7QUFDQSxpQkFBS0MsWUFBTCxJQUFxQlcsT0FBTyxDQUFDWCxZQUE3QjtBQUNBLGlCQUFLQyxPQUFMLElBQWdCVSxPQUFPLENBQUNWLE9BQXhCO0FBQ0g7QUFDSjtBQUNKOzs7OEJBRWU7QUFDWixhQUFLRixZQUFMLEdBQW9CLENBQXBCO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNBLGFBQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0g7Ozs7SUFqQzJCVyxlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYQ29tbWFuZEJ1ZmZlciB9IGZyb20gJy4uL2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYUXVldWUsIEdGWFF1ZXVlSW5mbyB9IGZyb20gJy4uL3F1ZXVlJztcclxuaW1wb3J0IHsgR0ZYRmVuY2UgfSBmcm9tICcuLi9mZW5jZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xRdWV1ZSBleHRlbmRzIEdGWFF1ZXVlIHtcclxuXHJcbiAgICBwdWJsaWMgbnVtRHJhd0NhbGxzOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIG51bUluc3RhbmNlczogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBudW1UcmlzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhRdWV1ZUluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IGluZm8udHlwZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdWJtaXQgKGNtZEJ1ZmZzOiBHRlhDb21tYW5kQnVmZmVyW10sIGZlbmNlPzogR0ZYRmVuY2UpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQXN5bmMpIHtcclxuICAgICAgICAgICAgY29uc3QgbGVuID0gY21kQnVmZnMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWRCdWZmID0gY21kQnVmZnNbaV07XHJcbiAgICAgICAgICAgICAgICAvLyBXZWJHTENtZEZ1bmNFeGVjdXRlQ21kcyggdGhpcy5fZGV2aWNlIGFzIFdlYkdMRGV2aWNlLCAoY21kQnVmZiBhcyBXZWJHTENvbW1hbmRCdWZmZXIpLmNtZFBhY2thZ2UpOyAvLyBvcHRlZCBvdXRcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtRHJhd0NhbGxzICs9IGNtZEJ1ZmYubnVtRHJhd0NhbGxzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5udW1JbnN0YW5jZXMgKz0gY21kQnVmZi5udW1JbnN0YW5jZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm51bVRyaXMgKz0gY21kQnVmZi5udW1UcmlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5udW1EcmF3Q2FsbHMgPSAwO1xyXG4gICAgICAgIHRoaXMubnVtSW5zdGFuY2VzID0gMDtcclxuICAgICAgICB0aGlzLm51bVRyaXMgPSAwO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==