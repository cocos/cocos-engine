(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../shader.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../shader.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.shader, global.webgl2Commands);
    global.webgl2Shader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _shader, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Shader = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Shader = /*#__PURE__*/function (_GFXShader) {
    _inherits(WebGL2Shader, _GFXShader);

    function WebGL2Shader() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Shader);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Shader)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuShader = null;
      return _this;
    }

    _createClass(WebGL2Shader, [{
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

        (0, _webgl2Commands.WebGL2CmdFuncCreateShader)(this._device, this._gpuShader);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuShader) {
          (0, _webgl2Commands.WebGL2CmdFuncDestroyShader)(this._device, this._gpuShader);
          this._gpuShader = null;
        }
      }
    }, {
      key: "gpuShader",
      get: function get() {
        return this._gpuShader;
      }
    }]);

    return WebGL2Shader;
  }(_shader.GFXShader);

  _exports.WebGL2Shader = WebGL2Shader;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItc2hhZGVyLnRzIl0sIm5hbWVzIjpbIldlYkdMMlNoYWRlciIsIl9ncHVTaGFkZXIiLCJpbmZvIiwiX25hbWUiLCJuYW1lIiwiX3N0YWdlcyIsInN0YWdlcyIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsIl9ibG9ja3MiLCJibG9ja3MiLCJfc2FtcGxlcnMiLCJzYW1wbGVycyIsImdwdVN0YWdlcyIsIkFycmF5IiwibGVuZ3RoIiwiZ2xQcm9ncmFtIiwiZ2xJbnB1dHMiLCJnbFVuaWZvcm1zIiwiZ2xCbG9ja3MiLCJnbFNhbXBsZXJzIiwiaSIsInN0YWdlIiwidHlwZSIsInNvdXJjZSIsImdsU2hhZGVyIiwiX2RldmljZSIsIkdGWFNoYWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFLYUEsWTs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLFUsR0FBc0MsSTs7Ozs7O2lDQUUzQkMsSSxFQUE4QjtBQUU3QyxhQUFLQyxLQUFMLEdBQWFELElBQUksQ0FBQ0UsSUFBbEI7QUFDQSxhQUFLQyxPQUFMLEdBQWVILElBQUksQ0FBQ0ksTUFBcEI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CTCxJQUFJLENBQUNNLFVBQXhCO0FBQ0EsYUFBS0MsT0FBTCxHQUFlUCxJQUFJLENBQUNRLE1BQXBCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQlQsSUFBSSxDQUFDVSxRQUF0QjtBQUVBLGFBQUtYLFVBQUwsR0FBa0I7QUFDZEcsVUFBQUEsSUFBSSxFQUFFRixJQUFJLENBQUNFLElBREc7QUFFZE0sVUFBQUEsTUFBTSxFQUFFUixJQUFJLENBQUNRLE1BRkM7QUFHZEUsVUFBQUEsUUFBUSxFQUFFVixJQUFJLENBQUNVLFFBSEQ7QUFLZEMsVUFBQUEsU0FBUyxFQUFFLElBQUlDLEtBQUosQ0FBaUNaLElBQUksQ0FBQ0ksTUFBTCxDQUFZUyxNQUE3QyxDQUxHO0FBTWRDLFVBQUFBLFNBQVMsRUFBRSxJQU5HO0FBT2RDLFVBQUFBLFFBQVEsRUFBRSxFQVBJO0FBUWRDLFVBQUFBLFVBQVUsRUFBRSxFQVJFO0FBU2RDLFVBQUFBLFFBQVEsRUFBRSxFQVRJO0FBVWRDLFVBQUFBLFVBQVUsRUFBRTtBQVZFLFNBQWxCOztBQWFBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR25CLElBQUksQ0FBQ0ksTUFBTCxDQUFZUyxNQUFoQyxFQUF3QyxFQUFFTSxDQUExQyxFQUE2QztBQUN6QyxjQUFNQyxLQUFLLEdBQUdwQixJQUFJLENBQUNJLE1BQUwsQ0FBWWUsQ0FBWixDQUFkO0FBQ0EsZUFBS3BCLFVBQUwsQ0FBZ0JZLFNBQWhCLENBQTBCUSxDQUExQixJQUErQjtBQUMzQkUsWUFBQUEsSUFBSSxFQUFFRCxLQUFLLENBQUNBLEtBRGU7QUFFM0JFLFlBQUFBLE1BQU0sRUFBRUYsS0FBSyxDQUFDRSxNQUZhO0FBRzNCQyxZQUFBQSxRQUFRLEVBQUU7QUFIaUIsV0FBL0I7QUFLSDs7QUFFRCx1REFBMEIsS0FBS0MsT0FBL0IsRUFBd0QsS0FBS3pCLFVBQTdEO0FBRUEsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUI7QUFDZCxZQUFJLEtBQUtBLFVBQVQsRUFBcUI7QUFDakIsMERBQTJCLEtBQUt5QixPQUFoQyxFQUF5RCxLQUFLekIsVUFBOUQ7QUFDQSxlQUFLQSxVQUFMLEdBQWtCLElBQWxCO0FBQ0g7QUFDSjs7OzBCQTlDa0M7QUFDL0IsZUFBUSxLQUFLQSxVQUFiO0FBQ0g7Ozs7SUFKNkIwQixpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFNoYWRlciwgR0ZYU2hhZGVySW5mbyB9IGZyb20gJy4uL3NoYWRlcic7XHJcbmltcG9ydCB7IFdlYkdMMkNtZEZ1bmNDcmVhdGVTaGFkZXIsIFdlYkdMMkNtZEZ1bmNEZXN0cm95U2hhZGVyIH0gZnJvbSAnLi93ZWJnbDItY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTDJEZXZpY2UgfSBmcm9tICcuL3dlYmdsMi1kZXZpY2UnO1xyXG5pbXBvcnQgeyBJV2ViR0wyR1BVU2hhZGVyLCBJV2ViR0wyR1BVU2hhZGVyU3RhZ2UgfSBmcm9tICcuL3dlYmdsMi1ncHUtb2JqZWN0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyU2hhZGVyIGV4dGVuZHMgR0ZYU2hhZGVyIHtcclxuXHJcbiAgICBnZXQgZ3B1U2hhZGVyICgpOiBJV2ViR0wyR1BVU2hhZGVyIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2dwdVNoYWRlciE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1U2hhZGVyOiBJV2ViR0wyR1BVU2hhZGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWFNoYWRlckluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGluZm8ubmFtZTtcclxuICAgICAgICB0aGlzLl9zdGFnZXMgPSBpbmZvLnN0YWdlcztcclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gaW5mby5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuX2Jsb2NrcyA9IGluZm8uYmxvY2tzO1xyXG4gICAgICAgIHRoaXMuX3NhbXBsZXJzID0gaW5mby5zYW1wbGVycztcclxuXHJcbiAgICAgICAgdGhpcy5fZ3B1U2hhZGVyID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBpbmZvLm5hbWUsXHJcbiAgICAgICAgICAgIGJsb2NrczogaW5mby5ibG9ja3MsXHJcbiAgICAgICAgICAgIHNhbXBsZXJzOiBpbmZvLnNhbXBsZXJzLFxyXG5cclxuICAgICAgICAgICAgZ3B1U3RhZ2VzOiBuZXcgQXJyYXk8SVdlYkdMMkdQVVNoYWRlclN0YWdlPihpbmZvLnN0YWdlcy5sZW5ndGgpLFxyXG4gICAgICAgICAgICBnbFByb2dyYW06IG51bGwsXHJcbiAgICAgICAgICAgIGdsSW5wdXRzOiBbXSxcclxuICAgICAgICAgICAgZ2xVbmlmb3JtczogW10sXHJcbiAgICAgICAgICAgIGdsQmxvY2tzOiBbXSxcclxuICAgICAgICAgICAgZ2xTYW1wbGVyczogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvLnN0YWdlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGFnZSA9IGluZm8uc3RhZ2VzW2ldO1xyXG4gICAgICAgICAgICB0aGlzLl9ncHVTaGFkZXIuZ3B1U3RhZ2VzW2ldID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogc3RhZ2Uuc3RhZ2UsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHN0YWdlLnNvdXJjZSxcclxuICAgICAgICAgICAgICAgIGdsU2hhZGVyOiBudWxsLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgV2ViR0wyQ21kRnVuY0NyZWF0ZVNoYWRlcih0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlLCB0aGlzLl9ncHVTaGFkZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dwdVNoYWRlcikge1xyXG4gICAgICAgICAgICBXZWJHTDJDbWRGdW5jRGVzdHJveVNoYWRlcih0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlLCB0aGlzLl9ncHVTaGFkZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9ncHVTaGFkZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=