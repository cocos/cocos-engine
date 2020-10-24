(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../shader.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../shader.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.shader, global.webglCommands);
    global.webglShader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _shader, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLShader = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLShader = /*#__PURE__*/function (_GFXShader) {
    _inherits(WebGLShader, _GFXShader);

    function WebGLShader() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLShader);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLShader)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuShader = null;
      return _this;
    }

    _createClass(WebGLShader, [{
      key: "initialize",
      value: function initialize(info) {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;
        this._gpuShader = {
          name: info.name,
          blocks: info.blocks,
          samplers: info.samplers,
          gpuStages: new Array(info.stages.length),
          glProgram: null,
          glInputs: [],
          glUniforms: [],
          glBlocks: [],
          glSamplers: []
        };

        for (var i = 0; i < info.stages.length; ++i) {
          var stage = info.stages[i];
          this._gpuShader.gpuStages[i] = {
            type: stage.stage,
            source: stage.source,
            glShader: null
          };
        }

        (0, _webglCommands.WebGLCmdFuncCreateShader)(this._device, this._gpuShader);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuShader) {
          (0, _webglCommands.WebGLCmdFuncDestroyShader)(this._device, this._gpuShader);
          this._gpuShader = null;
        }
      }
    }, {
      key: "gpuShader",
      get: function get() {
        return this._gpuShader;
      }
    }]);

    return WebGLShader;
  }(_shader.GFXShader);

  _exports.WebGLShader = WebGLShader;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXNoYWRlci50cyJdLCJuYW1lcyI6WyJXZWJHTFNoYWRlciIsIl9ncHVTaGFkZXIiLCJpbmZvIiwiX25hbWUiLCJuYW1lIiwiX3N0YWdlcyIsInN0YWdlcyIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9ibG9ja3MiLCJibG9ja3MiLCJfc2FtcGxlcnMiLCJzYW1wbGVycyIsImdwdVN0YWdlcyIsIkFycmF5IiwibGVuZ3RoIiwiZ2xQcm9ncmFtIiwiZ2xJbnB1dHMiLCJnbFVuaWZvcm1zIiwiZ2xCbG9ja3MiLCJnbFNhbXBsZXJzIiwiaSIsInN0YWdlIiwidHlwZSIsInNvdXJjZSIsImdsU2hhZGVyIiwiX2RldmljZSIsIkdGWFNoYWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFLYUEsVzs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLFUsR0FBcUMsSTs7Ozs7O2lDQUUxQkMsSSxFQUE4QjtBQUU3QyxhQUFLQyxLQUFMLEdBQWFELElBQUksQ0FBQ0UsSUFBbEI7QUFDQSxhQUFLQyxPQUFMLEdBQWVILElBQUksQ0FBQ0ksTUFBcEI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CTCxJQUFJLENBQUNNLFVBQXhCO0FBQ0EsYUFBS0MsT0FBTCxHQUFlUCxJQUFJLENBQUNRLE1BQXBCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQlQsSUFBSSxDQUFDVSxRQUF0QjtBQUVBLGFBQUtYLFVBQUwsR0FBa0I7QUFDZEcsVUFBQUEsSUFBSSxFQUFFRixJQUFJLENBQUNFLElBREc7QUFFZE0sVUFBQUEsTUFBTSxFQUFFUixJQUFJLENBQUNRLE1BRkM7QUFHZEUsVUFBQUEsUUFBUSxFQUFFVixJQUFJLENBQUNVLFFBSEQ7QUFLZEMsVUFBQUEsU0FBUyxFQUFFLElBQUlDLEtBQUosQ0FBZ0NaLElBQUksQ0FBQ0ksTUFBTCxDQUFZUyxNQUE1QyxDQUxHO0FBTWRDLFVBQUFBLFNBQVMsRUFBRSxJQU5HO0FBT2RDLFVBQUFBLFFBQVEsRUFBRSxFQVBJO0FBUWRDLFVBQUFBLFVBQVUsRUFBRSxFQVJFO0FBU2RDLFVBQUFBLFFBQVEsRUFBRSxFQVRJO0FBVWRDLFVBQUFBLFVBQVUsRUFBRTtBQVZFLFNBQWxCOztBQWFBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR25CLElBQUksQ0FBQ0ksTUFBTCxDQUFZUyxNQUFoQyxFQUF3QyxFQUFFTSxDQUExQyxFQUE2QztBQUN6QyxjQUFNQyxLQUFLLEdBQUdwQixJQUFJLENBQUNJLE1BQUwsQ0FBWWUsQ0FBWixDQUFkO0FBQ0EsZUFBS3BCLFVBQUwsQ0FBZ0JZLFNBQWhCLENBQTBCUSxDQUExQixJQUErQjtBQUMzQkUsWUFBQUEsSUFBSSxFQUFFRCxLQUFLLENBQUNBLEtBRGU7QUFFM0JFLFlBQUFBLE1BQU0sRUFBRUYsS0FBSyxDQUFDRSxNQUZhO0FBRzNCQyxZQUFBQSxRQUFRLEVBQUU7QUFIaUIsV0FBL0I7QUFLSDs7QUFFRCxxREFBeUIsS0FBS0MsT0FBOUIsRUFBc0QsS0FBS3pCLFVBQTNEO0FBRUEsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUI7QUFDZCxZQUFJLEtBQUtBLFVBQVQsRUFBcUI7QUFDakIsd0RBQTBCLEtBQUt5QixPQUEvQixFQUF1RCxLQUFLekIsVUFBNUQ7QUFDQSxlQUFLQSxVQUFMLEdBQWtCLElBQWxCO0FBQ0g7QUFDSjs7OzBCQTlDaUM7QUFDOUIsZUFBUSxLQUFLQSxVQUFiO0FBQ0g7Ozs7SUFKNEIwQixpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFNoYWRlciwgR0ZYU2hhZGVySW5mbyB9IGZyb20gJy4uL3NoYWRlcic7XHJcbmltcG9ydCB7IFdlYkdMQ21kRnVuY0NyZWF0ZVNoYWRlciwgV2ViR0xDbWRGdW5jRGVzdHJveVNoYWRlciB9IGZyb20gJy4vd2ViZ2wtY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTERldmljZSB9IGZyb20gJy4vd2ViZ2wtZGV2aWNlJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVU2hhZGVyLCBJV2ViR0xHUFVTaGFkZXJTdGFnZSB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMU2hhZGVyIGV4dGVuZHMgR0ZYU2hhZGVyIHtcclxuXHJcbiAgICBnZXQgZ3B1U2hhZGVyICgpOiBJV2ViR0xHUFVTaGFkZXIge1xyXG4gICAgICAgIHJldHVybiAgdGhpcy5fZ3B1U2hhZGVyITtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ncHVTaGFkZXI6IElXZWJHTEdQVVNoYWRlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhTaGFkZXJJbmZvKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHRoaXMuX25hbWUgPSBpbmZvLm5hbWU7XHJcbiAgICAgICAgdGhpcy5fc3RhZ2VzID0gaW5mby5zdGFnZXM7XHJcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IGluZm8uYXR0cmlidXRlcztcclxuICAgICAgICB0aGlzLl9ibG9ja3MgPSBpbmZvLmJsb2NrcztcclxuICAgICAgICB0aGlzLl9zYW1wbGVycyA9IGluZm8uc2FtcGxlcnM7XHJcblxyXG4gICAgICAgIHRoaXMuX2dwdVNoYWRlciA9IHtcclxuICAgICAgICAgICAgbmFtZTogaW5mby5uYW1lLFxyXG4gICAgICAgICAgICBibG9ja3M6IGluZm8uYmxvY2tzLFxyXG4gICAgICAgICAgICBzYW1wbGVyczogaW5mby5zYW1wbGVycyxcclxuXHJcbiAgICAgICAgICAgIGdwdVN0YWdlczogbmV3IEFycmF5PElXZWJHTEdQVVNoYWRlclN0YWdlPihpbmZvLnN0YWdlcy5sZW5ndGgpLFxyXG4gICAgICAgICAgICBnbFByb2dyYW06IG51bGwsXHJcbiAgICAgICAgICAgIGdsSW5wdXRzOiBbXSxcclxuICAgICAgICAgICAgZ2xVbmlmb3JtczogW10sXHJcbiAgICAgICAgICAgIGdsQmxvY2tzOiBbXSxcclxuICAgICAgICAgICAgZ2xTYW1wbGVyczogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvLnN0YWdlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGFnZSA9IGluZm8uc3RhZ2VzW2ldO1xyXG4gICAgICAgICAgICB0aGlzLl9ncHVTaGFkZXIuZ3B1U3RhZ2VzW2ldID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogc3RhZ2Uuc3RhZ2UsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHN0YWdlLnNvdXJjZSxcclxuICAgICAgICAgICAgICAgIGdsU2hhZGVyOiBudWxsLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgV2ViR0xDbWRGdW5jQ3JlYXRlU2hhZGVyKHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZSwgdGhpcy5fZ3B1U2hhZGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ncHVTaGFkZXIpIHtcclxuICAgICAgICAgICAgV2ViR0xDbWRGdW5jRGVzdHJveVNoYWRlcih0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UsIHRoaXMuX2dwdVNoYWRlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2dwdVNoYWRlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==