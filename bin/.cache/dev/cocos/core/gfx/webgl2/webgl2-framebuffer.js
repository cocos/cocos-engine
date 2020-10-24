(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../framebuffer.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../framebuffer.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.framebuffer, global.webgl2Commands);
    global.webgl2Framebuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _framebuffer, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Framebuffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2Framebuffer = /*#__PURE__*/function (_GFXFramebuffer) {
    _inherits(WebGL2Framebuffer, _GFXFramebuffer);

    function WebGL2Framebuffer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Framebuffer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Framebuffer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuFramebuffer = null;
      return _this;
    }

    _createClass(WebGL2Framebuffer, [{
      key: "initialize",
      value: function initialize(info) {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

        if (info.depStencilMipmapLevel !== 0) {
          console.warn('The mipmap level of th texture image to be attached of depth stencil attachment should be 0. Convert to 0.');
        }

        for (var i = 0; i < info.colorMipmapLevels.length; ++i) {
          if (info.colorMipmapLevels[i] !== 0) {
            console.warn("The mipmap level of th texture image to be attached of color attachment ".concat(i, " should be 0. Convert to 0."));
          }
        }

        var gpuColorTextures = [];

        for (var _i = 0; _i < info.colorTextures.length; _i++) {
          var colorTexture = info.colorTextures[_i];

          if (colorTexture) {
            gpuColorTextures.push(colorTexture.gpuTexture);
          }
        }

        var gpuDepthStencilTexture = null;

        if (info.depthStencilTexture) {
          gpuDepthStencilTexture = info.depthStencilTexture.gpuTexture;
        }

        this._gpuFramebuffer = {
          gpuRenderPass: info.renderPass.gpuRenderPass,
          gpuColorTextures: gpuColorTextures,
          gpuDepthStencilTexture: gpuDepthStencilTexture,
          glFramebuffer: null
        };
        (0, _webgl2Commands.WebGL2CmdFuncCreateFramebuffer)(this._device, this._gpuFramebuffer);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuFramebuffer) {
          (0, _webgl2Commands.WebGL2CmdFuncDestroyFramebuffer)(this._device, this._gpuFramebuffer);
          this._gpuFramebuffer = null;
        }
      }
    }, {
      key: "gpuFramebuffer",
      get: function get() {
        return this._gpuFramebuffer;
      }
    }]);

    return WebGL2Framebuffer;
  }(_framebuffer.GFXFramebuffer);

  _exports.WebGL2Framebuffer = WebGL2Framebuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItZnJhbWVidWZmZXIudHMiXSwibmFtZXMiOlsiV2ViR0wyRnJhbWVidWZmZXIiLCJfZ3B1RnJhbWVidWZmZXIiLCJpbmZvIiwiX3JlbmRlclBhc3MiLCJyZW5kZXJQYXNzIiwiX2NvbG9yVGV4dHVyZXMiLCJjb2xvclRleHR1cmVzIiwiX2RlcHRoU3RlbmNpbFRleHR1cmUiLCJkZXB0aFN0ZW5jaWxUZXh0dXJlIiwiZGVwU3RlbmNpbE1pcG1hcExldmVsIiwiY29uc29sZSIsIndhcm4iLCJpIiwiY29sb3JNaXBtYXBMZXZlbHMiLCJsZW5ndGgiLCJncHVDb2xvclRleHR1cmVzIiwiY29sb3JUZXh0dXJlIiwicHVzaCIsImdwdVRleHR1cmUiLCJncHVEZXB0aFN0ZW5jaWxUZXh0dXJlIiwiZ3B1UmVuZGVyUGFzcyIsImdsRnJhbWVidWZmZXIiLCJfZGV2aWNlIiwiR0ZYRnJhbWVidWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BT2FBLGlCOzs7Ozs7Ozs7Ozs7Ozs7WUFNREMsZSxHQUFnRCxJOzs7Ozs7aUNBRXJDQyxJLEVBQW1DO0FBRWxELGFBQUtDLFdBQUwsR0FBbUJELElBQUksQ0FBQ0UsVUFBeEI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCSCxJQUFJLENBQUNJLGFBQUwsSUFBc0IsRUFBNUM7QUFDQSxhQUFLQyxvQkFBTCxHQUE0QkwsSUFBSSxDQUFDTSxtQkFBTCxJQUE0QixJQUF4RDs7QUFFQSxZQUFJTixJQUFJLENBQUNPLHFCQUFMLEtBQStCLENBQW5DLEVBQXNDO0FBQ2xDQyxVQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSw0R0FBYjtBQUNIOztBQUNELGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1YsSUFBSSxDQUFDVyxpQkFBTCxDQUF1QkMsTUFBM0MsRUFBbUQsRUFBRUYsQ0FBckQsRUFBd0Q7QUFDcEQsY0FBSVYsSUFBSSxDQUFDVyxpQkFBTCxDQUF1QkQsQ0FBdkIsTUFBOEIsQ0FBbEMsRUFBcUM7QUFDakNGLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUixtRkFBd0ZDLENBQXhGO0FBQ0g7QUFDSjs7QUFFRCxZQUFNRyxnQkFBcUMsR0FBRyxFQUE5Qzs7QUFDQSxhQUFLLElBQUlILEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdWLElBQUksQ0FBQ0ksYUFBTCxDQUFtQlEsTUFBdkMsRUFBK0NGLEVBQUMsRUFBaEQsRUFBb0Q7QUFDaEQsY0FBTUksWUFBWSxHQUFHZCxJQUFJLENBQUNJLGFBQUwsQ0FBbUJNLEVBQW5CLENBQXJCOztBQUNBLGNBQUlJLFlBQUosRUFBa0I7QUFDZEQsWUFBQUEsZ0JBQWdCLENBQUNFLElBQWpCLENBQXVCRCxZQUFELENBQWdDRSxVQUF0RDtBQUNIO0FBQ0o7O0FBRUQsWUFBSUMsc0JBQWdELEdBQUcsSUFBdkQ7O0FBQ0EsWUFBSWpCLElBQUksQ0FBQ00sbUJBQVQsRUFBOEI7QUFDMUJXLFVBQUFBLHNCQUFzQixHQUFJakIsSUFBSSxDQUFDTSxtQkFBTixDQUE0Q1UsVUFBckU7QUFDSDs7QUFFRCxhQUFLakIsZUFBTCxHQUF1QjtBQUNuQm1CLFVBQUFBLGFBQWEsRUFBR2xCLElBQUksQ0FBQ0UsVUFBTixDQUFzQ2dCLGFBRGxDO0FBRW5CTCxVQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUZtQjtBQUduQkksVUFBQUEsc0JBQXNCLEVBQXRCQSxzQkFIbUI7QUFJbkJFLFVBQUFBLGFBQWEsRUFBRTtBQUpJLFNBQXZCO0FBT0EsNERBQStCLEtBQUtDLE9BQXBDLEVBQTZELEtBQUtyQixlQUFsRTtBQUVBLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsWUFBSSxLQUFLQSxlQUFULEVBQTBCO0FBQ3RCLCtEQUFnQyxLQUFLcUIsT0FBckMsRUFBOEQsS0FBS3JCLGVBQW5FO0FBQ0EsZUFBS0EsZUFBTCxHQUF1QixJQUF2QjtBQUNIO0FBQ0o7OzswQkFuRDRDO0FBQ3pDLGVBQVEsS0FBS0EsZUFBYjtBQUNIOzs7O0lBSmtDc0IsMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhGcmFtZWJ1ZmZlciwgR0ZYRnJhbWVidWZmZXJJbmZvIH0gZnJvbSAnLi4vZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBXZWJHTDJDbWRGdW5jQ3JlYXRlRnJhbWVidWZmZXIsIFdlYkdMMkNtZEZ1bmNEZXN0cm95RnJhbWVidWZmZXIgfSBmcm9tICcuL3dlYmdsMi1jb21tYW5kcyc7XHJcbmltcG9ydCB7IFdlYkdMMkRldmljZSB9IGZyb20gJy4vd2ViZ2wyLWRldmljZSc7XHJcbmltcG9ydCB7IElXZWJHTDJHUFVGcmFtZWJ1ZmZlciwgSVdlYkdMMkdQVVRleHR1cmUgfSBmcm9tICcuL3dlYmdsMi1ncHUtb2JqZWN0cyc7XHJcbmltcG9ydCB7IFdlYkdMMlJlbmRlclBhc3MgfSBmcm9tICcuL3dlYmdsMi1yZW5kZXItcGFzcyc7XHJcbmltcG9ydCB7IFdlYkdMMlRleHR1cmUgfSBmcm9tICcuL3dlYmdsMi10ZXh0dXJlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTDJGcmFtZWJ1ZmZlciBleHRlbmRzIEdGWEZyYW1lYnVmZmVyIHtcclxuXHJcbiAgICBnZXQgZ3B1RnJhbWVidWZmZXIgKCk6IElXZWJHTDJHUFVGcmFtZWJ1ZmZlciB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVGcmFtZWJ1ZmZlciE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1RnJhbWVidWZmZXI6IElXZWJHTDJHUFVGcmFtZWJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhGcmFtZWJ1ZmZlckluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyUGFzcyA9IGluZm8ucmVuZGVyUGFzcztcclxuICAgICAgICB0aGlzLl9jb2xvclRleHR1cmVzID0gaW5mby5jb2xvclRleHR1cmVzIHx8IFtdO1xyXG4gICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbFRleHR1cmUgPSBpbmZvLmRlcHRoU3RlbmNpbFRleHR1cmUgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKGluZm8uZGVwU3RlbmNpbE1pcG1hcExldmVsICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIG1pcG1hcCBsZXZlbCBvZiB0aCB0ZXh0dXJlIGltYWdlIHRvIGJlIGF0dGFjaGVkIG9mIGRlcHRoIHN0ZW5jaWwgYXR0YWNobWVudCBzaG91bGQgYmUgMC4gQ29udmVydCB0byAwLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZm8uY29sb3JNaXBtYXBMZXZlbHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKGluZm8uY29sb3JNaXBtYXBMZXZlbHNbaV0gIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVGhlIG1pcG1hcCBsZXZlbCBvZiB0aCB0ZXh0dXJlIGltYWdlIHRvIGJlIGF0dGFjaGVkIG9mIGNvbG9yIGF0dGFjaG1lbnQgJHtpfSBzaG91bGQgYmUgMC4gQ29udmVydCB0byAwLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBncHVDb2xvclRleHR1cmVzOiBJV2ViR0wyR1BVVGV4dHVyZVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvLmNvbG9yVGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY29sb3JUZXh0dXJlID0gaW5mby5jb2xvclRleHR1cmVzW2ldO1xyXG4gICAgICAgICAgICBpZiAoY29sb3JUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBncHVDb2xvclRleHR1cmVzLnB1c2goKGNvbG9yVGV4dHVyZSBhcyBXZWJHTDJUZXh0dXJlKS5ncHVUZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGdwdURlcHRoU3RlbmNpbFRleHR1cmU6IElXZWJHTDJHUFVUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKGluZm8uZGVwdGhTdGVuY2lsVGV4dHVyZSkge1xyXG4gICAgICAgICAgICBncHVEZXB0aFN0ZW5jaWxUZXh0dXJlID0gKGluZm8uZGVwdGhTdGVuY2lsVGV4dHVyZSBhcyBXZWJHTDJUZXh0dXJlKS5ncHVUZXh0dXJlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZ3B1RnJhbWVidWZmZXIgPSB7XHJcbiAgICAgICAgICAgIGdwdVJlbmRlclBhc3M6IChpbmZvLnJlbmRlclBhc3MgYXMgV2ViR0wyUmVuZGVyUGFzcykuZ3B1UmVuZGVyUGFzcyxcclxuICAgICAgICAgICAgZ3B1Q29sb3JUZXh0dXJlcyxcclxuICAgICAgICAgICAgZ3B1RGVwdGhTdGVuY2lsVGV4dHVyZSxcclxuICAgICAgICAgICAgZ2xGcmFtZWJ1ZmZlcjogbnVsbCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBXZWJHTDJDbWRGdW5jQ3JlYXRlRnJhbWVidWZmZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1RnJhbWVidWZmZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dwdUZyYW1lYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIFdlYkdMMkNtZEZ1bmNEZXN0cm95RnJhbWVidWZmZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgdGhpcy5fZ3B1RnJhbWVidWZmZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9ncHVGcmFtZWJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==