(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../pipeline-state.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../pipeline-state.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pipelineState);
    global.webgl2PipelineState = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pipelineState) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2PipelineState = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLPrimitives = [0x0000, // WebGLRenderingContext.POINTS,
  0x0001, // WebGLRenderingContext.LINES,
  0x0003, // WebGLRenderingContext.LINE_STRIP,
  0x0002, // WebGLRenderingContext.LINE_LOOP,
  0x0000, // WebGLRenderingContext.NONE,
  0x0000, // WebGLRenderingContext.NONE,
  0x0000, // WebGLRenderingContext.NONE,
  0x0004, // WebGLRenderingContext.TRIANGLES,
  0x0005, // WebGLRenderingContext.TRIANGLE_STRIP,
  0x0006, // WebGLRenderingContext.TRIANGLE_FAN,
  0x0000, // WebGLRenderingContext.NONE,
  0x0000, // WebGLRenderingContext.NONE,
  0x0000, // WebGLRenderingContext.NONE,
  0x0000 // WebGLRenderingContext.NONE,
  ];

  var WebGL2PipelineState = /*#__PURE__*/function (_GFXPipelineState) {
    _inherits(WebGL2PipelineState, _GFXPipelineState);

    function WebGL2PipelineState() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2PipelineState);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2PipelineState)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuPipelineState = null;
      return _this;
    }

    _createClass(WebGL2PipelineState, [{
      key: "initialize",
      value: function initialize(info) {
        this._primitive = info.primitive;
        this._shader = info.shader;
        this._pipelineLayout = info.pipelineLayout;
        this._rs = info.rasterizerState;
        this._dss = info.depthStencilState;
        this._bs = info.blendState;
        this._is = info.inputState;
        this._renderPass = info.renderPass;
        this._dynamicStates = info.dynamicStates;
        var dynamicStates = [];

        for (var i = 0; i < 31; i++) {
          if (this._dynamicStates & 1 << i) {
            dynamicStates.push(1 << i);
          }
        }

        this._gpuPipelineState = {
          glPrimitive: WebGLPrimitives[info.primitive],
          gpuShader: info.shader.gpuShader,
          gpuPipelineLayout: info.pipelineLayout.gpuPipelineLayout,
          rs: info.rasterizerState,
          dss: info.depthStencilState,
          bs: info.blendState,
          gpuRenderPass: info.renderPass.gpuRenderPass,
          dynamicStates: dynamicStates
        };
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._gpuPipelineState = null;
      }
    }, {
      key: "gpuPipelineState",
      get: function get() {
        return this._gpuPipelineState;
      }
    }]);

    return WebGL2PipelineState;
  }(_pipelineState.GFXPipelineState);

  _exports.WebGL2PipelineState = WebGL2PipelineState;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItcGlwZWxpbmUtc3RhdGUudHMiXSwibmFtZXMiOlsiV2ViR0xQcmltaXRpdmVzIiwiV2ViR0wyUGlwZWxpbmVTdGF0ZSIsIl9ncHVQaXBlbGluZVN0YXRlIiwiaW5mbyIsIl9wcmltaXRpdmUiLCJwcmltaXRpdmUiLCJfc2hhZGVyIiwic2hhZGVyIiwiX3BpcGVsaW5lTGF5b3V0IiwicGlwZWxpbmVMYXlvdXQiLCJfcnMiLCJyYXN0ZXJpemVyU3RhdGUiLCJfZHNzIiwiZGVwdGhTdGVuY2lsU3RhdGUiLCJfYnMiLCJibGVuZFN0YXRlIiwiX2lzIiwiaW5wdXRTdGF0ZSIsIl9yZW5kZXJQYXNzIiwicmVuZGVyUGFzcyIsIl9keW5hbWljU3RhdGVzIiwiZHluYW1pY1N0YXRlcyIsImkiLCJwdXNoIiwiZ2xQcmltaXRpdmUiLCJncHVTaGFkZXIiLCJncHVQaXBlbGluZUxheW91dCIsInJzIiwiZHNzIiwiYnMiLCJncHVSZW5kZXJQYXNzIiwiR0ZYUGlwZWxpbmVTdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxNQUFNQSxlQUF5QixHQUFHLENBQzlCLE1BRDhCLEVBQ3RCO0FBQ1IsUUFGOEIsRUFFdEI7QUFDUixRQUg4QixFQUd0QjtBQUNSLFFBSjhCLEVBSXRCO0FBQ1IsUUFMOEIsRUFLdEI7QUFDUixRQU44QixFQU10QjtBQUNSLFFBUDhCLEVBT3RCO0FBQ1IsUUFSOEIsRUFRdEI7QUFDUixRQVQ4QixFQVN0QjtBQUNSLFFBVjhCLEVBVXRCO0FBQ1IsUUFYOEIsRUFXdEI7QUFDUixRQVo4QixFQVl0QjtBQUNSLFFBYjhCLEVBYXRCO0FBQ1IsUUFkOEIsQ0FjdEI7QUFkc0IsR0FBbEM7O01BaUJhQyxtQjs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLGlCLEdBQW9ELEk7Ozs7OztpQ0FFekNDLEksRUFBcUM7QUFFcEQsYUFBS0MsVUFBTCxHQUFrQkQsSUFBSSxDQUFDRSxTQUF2QjtBQUNBLGFBQUtDLE9BQUwsR0FBZUgsSUFBSSxDQUFDSSxNQUFwQjtBQUNBLGFBQUtDLGVBQUwsR0FBdUJMLElBQUksQ0FBQ00sY0FBNUI7QUFDQSxhQUFLQyxHQUFMLEdBQVdQLElBQUksQ0FBQ1EsZUFBaEI7QUFDQSxhQUFLQyxJQUFMLEdBQVlULElBQUksQ0FBQ1UsaUJBQWpCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXWCxJQUFJLENBQUNZLFVBQWhCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXYixJQUFJLENBQUNjLFVBQWhCO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQmYsSUFBSSxDQUFDZ0IsVUFBeEI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCakIsSUFBSSxDQUFDa0IsYUFBM0I7QUFFQSxZQUFNQSxhQUF1QyxHQUFHLEVBQWhEOztBQUNBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxFQUFwQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUN6QixjQUFJLEtBQUtGLGNBQUwsR0FBdUIsS0FBS0UsQ0FBaEMsRUFBb0M7QUFDaENELFlBQUFBLGFBQWEsQ0FBQ0UsSUFBZCxDQUFtQixLQUFLRCxDQUF4QjtBQUNIO0FBQ0o7O0FBRUQsYUFBS3BCLGlCQUFMLEdBQXlCO0FBQ3JCc0IsVUFBQUEsV0FBVyxFQUFFeEIsZUFBZSxDQUFDRyxJQUFJLENBQUNFLFNBQU4sQ0FEUDtBQUVyQm9CLFVBQUFBLFNBQVMsRUFBR3RCLElBQUksQ0FBQ0ksTUFBTixDQUE4QmtCLFNBRnBCO0FBR3JCQyxVQUFBQSxpQkFBaUIsRUFBR3ZCLElBQUksQ0FBQ00sY0FBTixDQUE4Q2lCLGlCQUg1QztBQUlyQkMsVUFBQUEsRUFBRSxFQUFFeEIsSUFBSSxDQUFDUSxlQUpZO0FBS3JCaUIsVUFBQUEsR0FBRyxFQUFFekIsSUFBSSxDQUFDVSxpQkFMVztBQU1yQmdCLFVBQUFBLEVBQUUsRUFBRTFCLElBQUksQ0FBQ1ksVUFOWTtBQU9yQmUsVUFBQUEsYUFBYSxFQUFHM0IsSUFBSSxDQUFDZ0IsVUFBTixDQUFzQ1csYUFQaEM7QUFRckJULFVBQUFBLGFBQWEsRUFBYkE7QUFScUIsU0FBekI7QUFXQSxlQUFPLElBQVA7QUFDSDs7O2dDQUVpQjtBQUNkLGFBQUtuQixpQkFBTCxHQUF5QixJQUF6QjtBQUNIOzs7MEJBekNnRDtBQUM3QyxlQUFRLEtBQUtBLGlCQUFiO0FBQ0g7Ozs7SUFKb0M2QiwrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFBpcGVsaW5lU3RhdGUsIEdGWFBpcGVsaW5lU3RhdGVJbmZvIH0gZnJvbSAnLi4vcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBJV2ViR0wyR1BVUGlwZWxpbmVTdGF0ZSB9IGZyb20gJy4vd2ViZ2wyLWdwdS1vYmplY3RzJztcclxuaW1wb3J0IHsgV2ViR0wyUmVuZGVyUGFzcyB9IGZyb20gJy4vd2ViZ2wyLXJlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgV2ViR0wyU2hhZGVyIH0gZnJvbSAnLi93ZWJnbDItc2hhZGVyJztcclxuaW1wb3J0IHsgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdCB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IFdlYkdMMlBpcGVsaW5lTGF5b3V0IH0gZnJvbSAnLi93ZWJnbDItcGlwZWxpbmUtbGF5b3V0JztcclxuXHJcbmNvbnN0IFdlYkdMUHJpbWl0aXZlczogR0xlbnVtW10gPSBbXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5QT0lOVFMsXHJcbiAgICAweDAwMDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MSU5FUyxcclxuICAgIDB4MDAwMywgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkxJTkVfU1RSSVAsXHJcbiAgICAweDAwMDIsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MSU5FX0xPT1AsXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5OT05FLFxyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTk9ORSxcclxuICAgIDB4MDAwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5PTkUsXHJcbiAgICAweDAwMDQsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5UUklBTkdMRVMsXHJcbiAgICAweDAwMDUsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5UUklBTkdMRV9TVFJJUCxcclxuICAgIDB4MDAwNiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlRSSUFOR0xFX0ZBTixcclxuICAgIDB4MDAwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5PTkUsXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5OT05FLFxyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTk9ORSxcclxuICAgIDB4MDAwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5PTkUsXHJcbl07XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyUGlwZWxpbmVTdGF0ZSBleHRlbmRzIEdGWFBpcGVsaW5lU3RhdGUge1xyXG5cclxuICAgIGdldCBncHVQaXBlbGluZVN0YXRlICgpOiBJV2ViR0wyR1BVUGlwZWxpbmVTdGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVQaXBlbGluZVN0YXRlITtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9ncHVQaXBlbGluZVN0YXRlOiBJV2ViR0wyR1BVUGlwZWxpbmVTdGF0ZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhQaXBlbGluZVN0YXRlSW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICB0aGlzLl9wcmltaXRpdmUgPSBpbmZvLnByaW1pdGl2ZTtcclxuICAgICAgICB0aGlzLl9zaGFkZXIgPSBpbmZvLnNoYWRlcjtcclxuICAgICAgICB0aGlzLl9waXBlbGluZUxheW91dCA9IGluZm8ucGlwZWxpbmVMYXlvdXQ7XHJcbiAgICAgICAgdGhpcy5fcnMgPSBpbmZvLnJhc3Rlcml6ZXJTdGF0ZTtcclxuICAgICAgICB0aGlzLl9kc3MgPSBpbmZvLmRlcHRoU3RlbmNpbFN0YXRlO1xyXG4gICAgICAgIHRoaXMuX2JzID0gaW5mby5ibGVuZFN0YXRlO1xyXG4gICAgICAgIHRoaXMuX2lzID0gaW5mby5pbnB1dFN0YXRlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclBhc3MgPSBpbmZvLnJlbmRlclBhc3M7XHJcbiAgICAgICAgdGhpcy5fZHluYW1pY1N0YXRlcyA9IGluZm8uZHluYW1pY1N0YXRlcztcclxuXHJcbiAgICAgICAgY29uc3QgZHluYW1pY1N0YXRlczogR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdFtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9keW5hbWljU3RhdGVzICYgKDEgPDwgaSkpIHtcclxuICAgICAgICAgICAgICAgIGR5bmFtaWNTdGF0ZXMucHVzaCgxIDw8IGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ncHVQaXBlbGluZVN0YXRlID0ge1xyXG4gICAgICAgICAgICBnbFByaW1pdGl2ZTogV2ViR0xQcmltaXRpdmVzW2luZm8ucHJpbWl0aXZlXSxcclxuICAgICAgICAgICAgZ3B1U2hhZGVyOiAoaW5mby5zaGFkZXIgYXMgV2ViR0wyU2hhZGVyKS5ncHVTaGFkZXIsXHJcbiAgICAgICAgICAgIGdwdVBpcGVsaW5lTGF5b3V0OiAoaW5mby5waXBlbGluZUxheW91dCBhcyBXZWJHTDJQaXBlbGluZUxheW91dCkuZ3B1UGlwZWxpbmVMYXlvdXQsXHJcbiAgICAgICAgICAgIHJzOiBpbmZvLnJhc3Rlcml6ZXJTdGF0ZSxcclxuICAgICAgICAgICAgZHNzOiBpbmZvLmRlcHRoU3RlbmNpbFN0YXRlLFxyXG4gICAgICAgICAgICBiczogaW5mby5ibGVuZFN0YXRlLFxyXG4gICAgICAgICAgICBncHVSZW5kZXJQYXNzOiAoaW5mby5yZW5kZXJQYXNzIGFzIFdlYkdMMlJlbmRlclBhc3MpLmdwdVJlbmRlclBhc3MsXHJcbiAgICAgICAgICAgIGR5bmFtaWNTdGF0ZXMsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX2dwdVBpcGVsaW5lU3RhdGUgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==