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
    global.webglPipelineState = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pipelineState) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLPipelineState = void 0;

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

  var WebGLPipelineState = /*#__PURE__*/function (_GFXPipelineState) {
    _inherits(WebGLPipelineState, _GFXPipelineState);

    function WebGLPipelineState() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLPipelineState);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLPipelineState)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuPipelineState = null;
      return _this;
    }

    _createClass(WebGLPipelineState, [{
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

    return WebGLPipelineState;
  }(_pipelineState.GFXPipelineState);

  _exports.WebGLPipelineState = WebGLPipelineState;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXBpcGVsaW5lLXN0YXRlLnRzIl0sIm5hbWVzIjpbIldlYkdMUHJpbWl0aXZlcyIsIldlYkdMUGlwZWxpbmVTdGF0ZSIsIl9ncHVQaXBlbGluZVN0YXRlIiwiaW5mbyIsIl9wcmltaXRpdmUiLCJwcmltaXRpdmUiLCJfc2hhZGVyIiwic2hhZGVyIiwiX3BpcGVsaW5lTGF5b3V0IiwicGlwZWxpbmVMYXlvdXQiLCJfcnMiLCJyYXN0ZXJpemVyU3RhdGUiLCJfZHNzIiwiZGVwdGhTdGVuY2lsU3RhdGUiLCJfYnMiLCJibGVuZFN0YXRlIiwiX2lzIiwiaW5wdXRTdGF0ZSIsIl9yZW5kZXJQYXNzIiwicmVuZGVyUGFzcyIsIl9keW5hbWljU3RhdGVzIiwiZHluYW1pY1N0YXRlcyIsImkiLCJwdXNoIiwiZ2xQcmltaXRpdmUiLCJncHVTaGFkZXIiLCJncHVQaXBlbGluZUxheW91dCIsInJzIiwiZHNzIiwiYnMiLCJncHVSZW5kZXJQYXNzIiwiR0ZYUGlwZWxpbmVTdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSxNQUFNQSxlQUF5QixHQUFHLENBQzlCLE1BRDhCLEVBQ3RCO0FBQ1IsUUFGOEIsRUFFdEI7QUFDUixRQUg4QixFQUd0QjtBQUNSLFFBSjhCLEVBSXRCO0FBQ1IsUUFMOEIsRUFLdEI7QUFDUixRQU44QixFQU10QjtBQUNSLFFBUDhCLEVBT3RCO0FBQ1IsUUFSOEIsRUFRdEI7QUFDUixRQVQ4QixFQVN0QjtBQUNSLFFBVjhCLEVBVXRCO0FBQ1IsUUFYOEIsRUFXdEI7QUFDUixRQVo4QixFQVl0QjtBQUNSLFFBYjhCLEVBYXRCO0FBQ1IsUUFkOEIsQ0FjdEI7QUFkc0IsR0FBbEM7O01BaUJhQyxrQjs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLGlCLEdBQW1ELEk7Ozs7OztpQ0FFeENDLEksRUFBcUM7QUFFcEQsYUFBS0MsVUFBTCxHQUFrQkQsSUFBSSxDQUFDRSxTQUF2QjtBQUNBLGFBQUtDLE9BQUwsR0FBZUgsSUFBSSxDQUFDSSxNQUFwQjtBQUNBLGFBQUtDLGVBQUwsR0FBdUJMLElBQUksQ0FBQ00sY0FBNUI7QUFDQSxhQUFLQyxHQUFMLEdBQVdQLElBQUksQ0FBQ1EsZUFBaEI7QUFDQSxhQUFLQyxJQUFMLEdBQVlULElBQUksQ0FBQ1UsaUJBQWpCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXWCxJQUFJLENBQUNZLFVBQWhCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXYixJQUFJLENBQUNjLFVBQWhCO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQmYsSUFBSSxDQUFDZ0IsVUFBeEI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCakIsSUFBSSxDQUFDa0IsYUFBM0I7QUFFQSxZQUFNQSxhQUF1QyxHQUFHLEVBQWhEOztBQUNBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxFQUFwQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUN6QixjQUFJLEtBQUtGLGNBQUwsR0FBdUIsS0FBS0UsQ0FBaEMsRUFBb0M7QUFDaENELFlBQUFBLGFBQWEsQ0FBQ0UsSUFBZCxDQUFtQixLQUFLRCxDQUF4QjtBQUNIO0FBQ0o7O0FBRUQsYUFBS3BCLGlCQUFMLEdBQXlCO0FBQ3JCc0IsVUFBQUEsV0FBVyxFQUFFeEIsZUFBZSxDQUFDRyxJQUFJLENBQUNFLFNBQU4sQ0FEUDtBQUVyQm9CLFVBQUFBLFNBQVMsRUFBR3RCLElBQUksQ0FBQ0ksTUFBTixDQUE2QmtCLFNBRm5CO0FBR3JCQyxVQUFBQSxpQkFBaUIsRUFBR3ZCLElBQUksQ0FBQ00sY0FBTixDQUE2Q2lCLGlCQUgzQztBQUlyQkMsVUFBQUEsRUFBRSxFQUFFeEIsSUFBSSxDQUFDUSxlQUpZO0FBS3JCaUIsVUFBQUEsR0FBRyxFQUFFekIsSUFBSSxDQUFDVSxpQkFMVztBQU1yQmdCLFVBQUFBLEVBQUUsRUFBRTFCLElBQUksQ0FBQ1ksVUFOWTtBQU9yQmUsVUFBQUEsYUFBYSxFQUFHM0IsSUFBSSxDQUFDZ0IsVUFBTixDQUFxQ1csYUFQL0I7QUFRckJULFVBQUFBLGFBQWEsRUFBYkE7QUFScUIsU0FBekI7QUFXQSxlQUFPLElBQVA7QUFDSDs7O2dDQUVpQjtBQUNkLGFBQUtuQixpQkFBTCxHQUF5QixJQUF6QjtBQUNIOzs7MEJBekMrQztBQUM1QyxlQUFRLEtBQUtBLGlCQUFiO0FBQ0g7Ozs7SUFKbUM2QiwrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWFBpcGVsaW5lU3RhdGUsIEdGWFBpcGVsaW5lU3RhdGVJbmZvIH0gZnJvbSAnLi4vcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBJV2ViR0xHUFVQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi93ZWJnbC1ncHUtb2JqZWN0cyc7XHJcbmltcG9ydCB7IFdlYkdMUmVuZGVyUGFzcyB9IGZyb20gJy4vd2ViZ2wtcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBXZWJHTFNoYWRlciB9IGZyb20gJy4vd2ViZ2wtc2hhZGVyJztcclxuaW1wb3J0IHsgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdCB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IFdlYkdMUGlwZWxpbmVMYXlvdXQgfSBmcm9tICcuL3dlYmdsLXBpcGVsaW5lLWxheW91dCc7XHJcblxyXG5jb25zdCBXZWJHTFByaW1pdGl2ZXM6IEdMZW51bVtdID0gW1xyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuUE9JTlRTLFxyXG4gICAgMHgwMDAxLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTElORVMsXHJcbiAgICAweDAwMDMsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MSU5FX1NUUklQLFxyXG4gICAgMHgwMDAyLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTElORV9MT09QLFxyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTk9ORSxcclxuICAgIDB4MDAwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5PTkUsXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5OT05FLFxyXG4gICAgMHgwMDA0LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVTLFxyXG4gICAgMHgwMDA1LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVfU1RSSVAsXHJcbiAgICAweDAwMDYsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5UUklBTkdMRV9GQU4sXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5OT05FLFxyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTk9ORSxcclxuICAgIDB4MDAwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5PTkUsXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5OT05FLFxyXG5dO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMUGlwZWxpbmVTdGF0ZSBleHRlbmRzIEdGWFBpcGVsaW5lU3RhdGUge1xyXG5cclxuICAgIGdldCBncHVQaXBlbGluZVN0YXRlICgpOiBJV2ViR0xHUFVQaXBlbGluZVN0YXRlIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2dwdVBpcGVsaW5lU3RhdGUhO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dwdVBpcGVsaW5lU3RhdGU6IElXZWJHTEdQVVBpcGVsaW5lU3RhdGUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYUGlwZWxpbmVTdGF0ZUluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcHJpbWl0aXZlID0gaW5mby5wcmltaXRpdmU7XHJcbiAgICAgICAgdGhpcy5fc2hhZGVyID0gaW5mby5zaGFkZXI7XHJcbiAgICAgICAgdGhpcy5fcGlwZWxpbmVMYXlvdXQgPSBpbmZvLnBpcGVsaW5lTGF5b3V0O1xyXG4gICAgICAgIHRoaXMuX3JzID0gaW5mby5yYXN0ZXJpemVyU3RhdGU7XHJcbiAgICAgICAgdGhpcy5fZHNzID0gaW5mby5kZXB0aFN0ZW5jaWxTdGF0ZTtcclxuICAgICAgICB0aGlzLl9icyA9IGluZm8uYmxlbmRTdGF0ZTtcclxuICAgICAgICB0aGlzLl9pcyA9IGluZm8uaW5wdXRTdGF0ZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJQYXNzID0gaW5mby5yZW5kZXJQYXNzO1xyXG4gICAgICAgIHRoaXMuX2R5bmFtaWNTdGF0ZXMgPSBpbmZvLmR5bmFtaWNTdGF0ZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGR5bmFtaWNTdGF0ZXM6IEdGWER5bmFtaWNTdGF0ZUZsYWdCaXRbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzE7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZHluYW1pY1N0YXRlcyAmICgxIDw8IGkpKSB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljU3RhdGVzLnB1c2goMSA8PCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZ3B1UGlwZWxpbmVTdGF0ZSA9IHtcclxuICAgICAgICAgICAgZ2xQcmltaXRpdmU6IFdlYkdMUHJpbWl0aXZlc1tpbmZvLnByaW1pdGl2ZV0sXHJcbiAgICAgICAgICAgIGdwdVNoYWRlcjogKGluZm8uc2hhZGVyIGFzIFdlYkdMU2hhZGVyKS5ncHVTaGFkZXIsXHJcbiAgICAgICAgICAgIGdwdVBpcGVsaW5lTGF5b3V0OiAoaW5mby5waXBlbGluZUxheW91dCBhcyBXZWJHTFBpcGVsaW5lTGF5b3V0KS5ncHVQaXBlbGluZUxheW91dCxcclxuICAgICAgICAgICAgcnM6IGluZm8ucmFzdGVyaXplclN0YXRlLFxyXG4gICAgICAgICAgICBkc3M6IGluZm8uZGVwdGhTdGVuY2lsU3RhdGUsXHJcbiAgICAgICAgICAgIGJzOiBpbmZvLmJsZW5kU3RhdGUsXHJcbiAgICAgICAgICAgIGdwdVJlbmRlclBhc3M6IChpbmZvLnJlbmRlclBhc3MgYXMgV2ViR0xSZW5kZXJQYXNzKS5ncHVSZW5kZXJQYXNzLFxyXG4gICAgICAgICAgICBkeW5hbWljU3RhdGVzLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9ncHVQaXBlbGluZVN0YXRlID0gbnVsbDtcclxuICAgIH1cclxufVxyXG4iXX0=