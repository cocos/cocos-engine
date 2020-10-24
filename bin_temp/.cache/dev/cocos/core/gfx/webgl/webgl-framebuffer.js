(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../framebuffer.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../framebuffer.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.framebuffer, global.webglCommands);
    global.webglFramebuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _framebuffer, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLFramebuffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLFramebuffer = /*#__PURE__*/function (_GFXFramebuffer) {
    _inherits(WebGLFramebuffer, _GFXFramebuffer);

    function WebGLFramebuffer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLFramebuffer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLFramebuffer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuFramebuffer = null;
      return _this;
    }

    _createClass(WebGLFramebuffer, [{
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

        for (var _i = 0; _i < info.colorTextures.length; ++_i) {
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
        (0, _webglCommands.WebGLCmdFuncCreateFramebuffer)(this._device, this._gpuFramebuffer);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._gpuFramebuffer) {
          (0, _webglCommands.WebGLCmdFuncDestroyFramebuffer)(this._device, this._gpuFramebuffer);
          this._gpuFramebuffer = null;
        }
      }
    }, {
      key: "gpuFramebuffer",
      get: function get() {
        return this._gpuFramebuffer;
      }
    }]);

    return WebGLFramebuffer;
  }(_framebuffer.GFXFramebuffer);

  _exports.WebGLFramebuffer = WebGLFramebuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWZyYW1lYnVmZmVyLnRzIl0sIm5hbWVzIjpbIldlYkdMRnJhbWVidWZmZXIiLCJfZ3B1RnJhbWVidWZmZXIiLCJpbmZvIiwiX3JlbmRlclBhc3MiLCJyZW5kZXJQYXNzIiwiX2NvbG9yVGV4dHVyZXMiLCJjb2xvclRleHR1cmVzIiwiX2RlcHRoU3RlbmNpbFRleHR1cmUiLCJkZXB0aFN0ZW5jaWxUZXh0dXJlIiwiZGVwU3RlbmNpbE1pcG1hcExldmVsIiwiY29uc29sZSIsIndhcm4iLCJpIiwiY29sb3JNaXBtYXBMZXZlbHMiLCJsZW5ndGgiLCJncHVDb2xvclRleHR1cmVzIiwiY29sb3JUZXh0dXJlIiwicHVzaCIsImdwdVRleHR1cmUiLCJncHVEZXB0aFN0ZW5jaWxUZXh0dXJlIiwiZ3B1UmVuZGVyUGFzcyIsImdsRnJhbWVidWZmZXIiLCJfZGV2aWNlIiwiR0ZYRnJhbWVidWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUWFBLGdCOzs7Ozs7Ozs7Ozs7Ozs7WUFNREMsZSxHQUErQyxJOzs7Ozs7aUNBRXBDQyxJLEVBQW1DO0FBRWxELGFBQUtDLFdBQUwsR0FBbUJELElBQUksQ0FBQ0UsVUFBeEI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCSCxJQUFJLENBQUNJLGFBQUwsSUFBc0IsRUFBNUM7QUFDQSxhQUFLQyxvQkFBTCxHQUE0QkwsSUFBSSxDQUFDTSxtQkFBTCxJQUE0QixJQUF4RDs7QUFFQSxZQUFJTixJQUFJLENBQUNPLHFCQUFMLEtBQStCLENBQW5DLEVBQXNDO0FBQ2xDQyxVQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSw0R0FBYjtBQUNIOztBQUNELGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1YsSUFBSSxDQUFDVyxpQkFBTCxDQUF1QkMsTUFBM0MsRUFBbUQsRUFBRUYsQ0FBckQsRUFBd0Q7QUFDcEQsY0FBSVYsSUFBSSxDQUFDVyxpQkFBTCxDQUF1QkQsQ0FBdkIsTUFBOEIsQ0FBbEMsRUFBcUM7QUFDakNGLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUixtRkFBd0ZDLENBQXhGO0FBQ0g7QUFDSjs7QUFFRCxZQUFNRyxnQkFBb0MsR0FBRyxFQUE3Qzs7QUFDQSxhQUFLLElBQUlILEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdWLElBQUksQ0FBQ0ksYUFBTCxDQUFtQlEsTUFBdkMsRUFBK0MsRUFBRUYsRUFBakQsRUFBb0Q7QUFDaEQsY0FBTUksWUFBWSxHQUFHZCxJQUFJLENBQUNJLGFBQUwsQ0FBbUJNLEVBQW5CLENBQXJCOztBQUNBLGNBQUlJLFlBQUosRUFBa0I7QUFDZEQsWUFBQUEsZ0JBQWdCLENBQUNFLElBQWpCLENBQXVCRCxZQUFELENBQStCRSxVQUFyRDtBQUNIO0FBQ0o7O0FBRUQsWUFBSUMsc0JBQStDLEdBQUcsSUFBdEQ7O0FBQ0EsWUFBSWpCLElBQUksQ0FBQ00sbUJBQVQsRUFBOEI7QUFDMUJXLFVBQUFBLHNCQUFzQixHQUFJakIsSUFBSSxDQUFDTSxtQkFBTixDQUEyQ1UsVUFBcEU7QUFDSDs7QUFFRCxhQUFLakIsZUFBTCxHQUF1QjtBQUNuQm1CLFVBQUFBLGFBQWEsRUFBR2xCLElBQUksQ0FBQ0UsVUFBTixDQUFxQ2dCLGFBRGpDO0FBRW5CTCxVQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUZtQjtBQUduQkksVUFBQUEsc0JBQXNCLEVBQXRCQSxzQkFIbUI7QUFJbkJFLFVBQUFBLGFBQWEsRUFBRTtBQUpJLFNBQXZCO0FBT0EsMERBQThCLEtBQUtDLE9BQW5DLEVBQTJELEtBQUtyQixlQUFoRTtBQUVBLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsWUFBSSxLQUFLQSxlQUFULEVBQTBCO0FBQ3RCLDZEQUErQixLQUFLcUIsT0FBcEMsRUFBNEQsS0FBS3JCLGVBQWpFO0FBQ0EsZUFBS0EsZUFBTCxHQUF1QixJQUF2QjtBQUNIO0FBQ0o7OzswQkFuRDJDO0FBQ3hDLGVBQVEsS0FBS0EsZUFBYjtBQUNIOzs7O0lBSmlDc0IsMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhGcmFtZWJ1ZmZlciwgR0ZYRnJhbWVidWZmZXJJbmZvIH0gZnJvbSAnLi4vZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBXZWJHTENtZEZ1bmNDcmVhdGVGcmFtZWJ1ZmZlciwgV2ViR0xDbWRGdW5jRGVzdHJveUZyYW1lYnVmZmVyIH0gZnJvbSAnLi93ZWJnbC1jb21tYW5kcyc7XHJcbmltcG9ydCB7IFdlYkdMRGV2aWNlIH0gZnJvbSAnLi93ZWJnbC1kZXZpY2UnO1xyXG5pbXBvcnQgeyBJV2ViR0xHUFVGcmFtZWJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5pbXBvcnQgeyBXZWJHTFJlbmRlclBhc3MgfSBmcm9tICcuL3dlYmdsLXJlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVVGV4dHVyZSB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5pbXBvcnQgeyBXZWJHTFRleHR1cmUgfSBmcm9tICcuL3dlYmdsLXRleHR1cmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMRnJhbWVidWZmZXIgZXh0ZW5kcyBHRlhGcmFtZWJ1ZmZlciB7XHJcblxyXG4gICAgZ2V0IGdwdUZyYW1lYnVmZmVyICgpOiBJV2ViR0xHUFVGcmFtZWJ1ZmZlciB7XHJcbiAgICAgICAgcmV0dXJuICB0aGlzLl9ncHVGcmFtZWJ1ZmZlciE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1RnJhbWVidWZmZXI6IElXZWJHTEdQVUZyYW1lYnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IEdGWEZyYW1lYnVmZmVySW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJQYXNzID0gaW5mby5yZW5kZXJQYXNzO1xyXG4gICAgICAgIHRoaXMuX2NvbG9yVGV4dHVyZXMgPSBpbmZvLmNvbG9yVGV4dHVyZXMgfHwgW107XHJcbiAgICAgICAgdGhpcy5fZGVwdGhTdGVuY2lsVGV4dHVyZSA9IGluZm8uZGVwdGhTdGVuY2lsVGV4dHVyZSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAoaW5mby5kZXBTdGVuY2lsTWlwbWFwTGV2ZWwgIT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdUaGUgbWlwbWFwIGxldmVsIG9mIHRoIHRleHR1cmUgaW1hZ2UgdG8gYmUgYXR0YWNoZWQgb2YgZGVwdGggc3RlbmNpbCBhdHRhY2htZW50IHNob3VsZCBiZSAwLiBDb252ZXJ0IHRvIDAuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mby5jb2xvck1pcG1hcExldmVscy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoaW5mby5jb2xvck1pcG1hcExldmVsc1tpXSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBUaGUgbWlwbWFwIGxldmVsIG9mIHRoIHRleHR1cmUgaW1hZ2UgdG8gYmUgYXR0YWNoZWQgb2YgY29sb3IgYXR0YWNobWVudCAke2l9IHNob3VsZCBiZSAwLiBDb252ZXJ0IHRvIDAuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGdwdUNvbG9yVGV4dHVyZXM6IElXZWJHTEdQVVRleHR1cmVbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5mby5jb2xvclRleHR1cmVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yVGV4dHVyZSA9IGluZm8uY29sb3JUZXh0dXJlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgZ3B1Q29sb3JUZXh0dXJlcy5wdXNoKChjb2xvclRleHR1cmUgYXMgV2ViR0xUZXh0dXJlKS5ncHVUZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGdwdURlcHRoU3RlbmNpbFRleHR1cmU6IElXZWJHTEdQVVRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBpZiAoaW5mby5kZXB0aFN0ZW5jaWxUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGdwdURlcHRoU3RlbmNpbFRleHR1cmUgPSAoaW5mby5kZXB0aFN0ZW5jaWxUZXh0dXJlIGFzIFdlYkdMVGV4dHVyZSkuZ3B1VGV4dHVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dwdUZyYW1lYnVmZmVyID0ge1xyXG4gICAgICAgICAgICBncHVSZW5kZXJQYXNzOiAoaW5mby5yZW5kZXJQYXNzIGFzIFdlYkdMUmVuZGVyUGFzcykuZ3B1UmVuZGVyUGFzcyxcclxuICAgICAgICAgICAgZ3B1Q29sb3JUZXh0dXJlcyxcclxuICAgICAgICAgICAgZ3B1RGVwdGhTdGVuY2lsVGV4dHVyZSxcclxuICAgICAgICAgICAgZ2xGcmFtZWJ1ZmZlcjogbnVsbCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBXZWJHTENtZEZ1bmNDcmVhdGVGcmFtZWJ1ZmZlcih0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UsIHRoaXMuX2dwdUZyYW1lYnVmZmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ncHVGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgICAgICBXZWJHTENtZEZ1bmNEZXN0cm95RnJhbWVidWZmZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMRGV2aWNlLCB0aGlzLl9ncHVGcmFtZWJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2dwdUZyYW1lYnVmZmVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19