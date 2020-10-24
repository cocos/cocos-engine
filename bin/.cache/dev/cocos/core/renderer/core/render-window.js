(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js", "../../gfx/index.js", "./memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"), require("../../gfx/index.js"), require("./memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.index, global.memoryPools);
    global.renderWindow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _index, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderWindow = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var RenderWindow = /*#__PURE__*/function () {
    _createClass(RenderWindow, [{
      key: "width",

      /**
       * @en Get window width.
       * @zh 窗口宽度。
       */
      get: function get() {
        return this._width;
      }
      /**
       * @en Get window height.
       * @zh 窗口高度。
       */

    }, {
      key: "height",
      get: function get() {
        return this._height;
      }
      /**
       * @en Get window frame buffer.
       * @zh GFX帧缓冲。
       */

    }, {
      key: "framebuffer",
      get: function get() {
        return _memoryPools.FramebufferPool.get(_memoryPools.RenderWindowPool.get(this._poolHandle, _memoryPools.RenderWindowView.FRAMEBUFFER));
      }
    }, {
      key: "shouldSyncSizeWithSwapchain",
      get: function get() {
        return this._shouldSyncSizeWithSwapchain;
      }
    }, {
      key: "hasOnScreenAttachments",
      get: function get() {
        return _memoryPools.RenderWindowPool.get(this._poolHandle, _memoryPools.RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS) === 1 ? true : false;
      }
    }, {
      key: "hasOffScreenAttachments",
      get: function get() {
        return _memoryPools.RenderWindowPool.get(this._poolHandle, _memoryPools.RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS) === 1 ? true : false;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._poolHandle;
      }
    }], [{
      key: "registerCreateFunc",
      value: function registerCreateFunc(root) {
        root._createWindowFun = function (_root) {
          return new RenderWindow(_root);
        };
      }
    }]);

    function RenderWindow(root) {
      _classCallCheck(this, RenderWindow);

      this._title = '';
      this._width = 1;
      this._height = 1;
      this._nativeWidth = 1;
      this._nativeHeight = 1;
      this._renderPass = null;
      this._colorTextures = [];
      this._depthStencilTexture = null;
      this._swapchainBufferIndices = 0;
      this._shouldSyncSizeWithSwapchain = false;
      this._poolHandle = _memoryPools.NULL_HANDLE;
    }

    _createClass(RenderWindow, [{
      key: "initialize",
      value: function initialize(device, info) {
        this._poolHandle = _memoryPools.RenderWindowPool.alloc();

        if (info.title !== undefined) {
          this._title = info.title;
        }

        if (info.swapchainBufferIndices !== undefined) {
          this._swapchainBufferIndices = info.swapchainBufferIndices;
        }

        if (info.shouldSyncSizeWithSwapchain !== undefined) {
          this._shouldSyncSizeWithSwapchain = info.shouldSyncSizeWithSwapchain;
        }

        this._width = info.width;
        this._height = info.height;
        this._nativeWidth = this._width;
        this._nativeHeight = this._height;
        var _info$renderPassInfo = info.renderPassInfo,
            colorAttachments = _info$renderPassInfo.colorAttachments,
            depthStencilAttachment = _info$renderPassInfo.depthStencilAttachment;

        for (var i = 0; i < colorAttachments.length; i++) {
          if (colorAttachments[i].format === _define.GFXFormat.UNKNOWN) {
            colorAttachments[i].format = device.colorFormat;
          }
        }

        if (depthStencilAttachment && depthStencilAttachment.format === _define.GFXFormat.UNKNOWN) {
          depthStencilAttachment.format = device.depthStencilFormat;
        }

        this._renderPass = device.createRenderPass(info.renderPassInfo);

        for (var _i = 0; _i < colorAttachments.length; _i++) {
          var colorTex = null;

          if (!(this._swapchainBufferIndices & 1 << _i)) {
            colorTex = device.createTexture(new _index.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.COLOR_ATTACHMENT | _define.GFXTextureUsageBit.SAMPLED, colorAttachments[_i].format, this._width, this._height));

            _memoryPools.RenderWindowPool.set(this._poolHandle, _memoryPools.RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS, 1);
          } else {
            _memoryPools.RenderWindowPool.set(this._poolHandle, _memoryPools.RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS, 1);
          }

          this._colorTextures.push(colorTex);
        } // Use the sign bit to indicate depth attachment


        if (depthStencilAttachment) {
          if (this._swapchainBufferIndices >= 0) {
            this._depthStencilTexture = device.createTexture(new _index.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT | _define.GFXTextureUsageBit.SAMPLED, depthStencilAttachment.format, this._width, this._height));

            _memoryPools.RenderWindowPool.set(this._poolHandle, _memoryPools.RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS, 1);
          } else {
            _memoryPools.RenderWindowPool.set(this._poolHandle, _memoryPools.RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS, 1);
          }
        }

        var hFBO = _memoryPools.FramebufferPool.alloc(device, new _index.GFXFramebufferInfo(this._renderPass, this._colorTextures, this._depthStencilTexture));

        _memoryPools.RenderWindowPool.set(this._poolHandle, _memoryPools.RenderWindowView.FRAMEBUFFER, hFBO);

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._depthStencilTexture) {
          this._depthStencilTexture.destroy();

          this._depthStencilTexture = null;
        }

        for (var i = 0; i < this._colorTextures.length; i++) {
          var colorTexture = this._colorTextures[i];

          if (colorTexture) {
            colorTexture.destroy();
          }
        }

        this._colorTextures.length = 0;

        if (this._poolHandle) {
          _memoryPools.FramebufferPool.get(_memoryPools.RenderWindowPool.get(this._poolHandle, _memoryPools.RenderWindowView.FRAMEBUFFER)).destroy();

          this._poolHandle = _memoryPools.NULL_HANDLE;
        }
      }
      /**
       * @en Resize window.
       * @zh 重置窗口大小。
       * @param width The new width.
       * @param height The new height.
       */

    }, {
      key: "resize",
      value: function resize(width, height) {
        this._width = width;
        this._height = height;

        if (width > this._nativeWidth || height > this._nativeHeight) {
          this._nativeWidth = width;
          this._nativeHeight = height;
          var needRebuild = false;

          if (this._depthStencilTexture) {
            this._depthStencilTexture.resize(width, height);

            needRebuild = true;
          }

          for (var i = 0; i < this._colorTextures.length; i++) {
            var colorTex = this._colorTextures[i];

            if (colorTex) {
              colorTex.resize(width, height);
              needRebuild = true;
            }
          }

          var framebuffer = _memoryPools.FramebufferPool.get(_memoryPools.RenderWindowPool.get(this._poolHandle, _memoryPools.RenderWindowView.FRAMEBUFFER));

          if (needRebuild && framebuffer) {
            framebuffer.destroy();
            framebuffer.initialize(new _index.GFXFramebufferInfo(this._renderPass, this._colorTextures, this._depthStencilTexture));
          }
        }
      }
    }]);

    return RenderWindow;
  }();

  _exports.RenderWindow = RenderWindow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9yZW5kZXItd2luZG93LnRzIl0sIm5hbWVzIjpbIlJlbmRlcldpbmRvdyIsIl93aWR0aCIsIl9oZWlnaHQiLCJGcmFtZWJ1ZmZlclBvb2wiLCJnZXQiLCJSZW5kZXJXaW5kb3dQb29sIiwiX3Bvb2xIYW5kbGUiLCJSZW5kZXJXaW5kb3dWaWV3IiwiRlJBTUVCVUZGRVIiLCJfc2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluIiwiSEFTX09OX1NDUkVFTl9BVFRBQ0hNRU5UUyIsIkhBU19PRkZfU0NSRUVOX0FUVEFDSE1FTlRTIiwicm9vdCIsIl9jcmVhdGVXaW5kb3dGdW4iLCJfcm9vdCIsIl90aXRsZSIsIl9uYXRpdmVXaWR0aCIsIl9uYXRpdmVIZWlnaHQiLCJfcmVuZGVyUGFzcyIsIl9jb2xvclRleHR1cmVzIiwiX2RlcHRoU3RlbmNpbFRleHR1cmUiLCJfc3dhcGNoYWluQnVmZmVySW5kaWNlcyIsIk5VTExfSEFORExFIiwiZGV2aWNlIiwiaW5mbyIsImFsbG9jIiwidGl0bGUiLCJ1bmRlZmluZWQiLCJzd2FwY2hhaW5CdWZmZXJJbmRpY2VzIiwic2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluIiwid2lkdGgiLCJoZWlnaHQiLCJyZW5kZXJQYXNzSW5mbyIsImNvbG9yQXR0YWNobWVudHMiLCJkZXB0aFN0ZW5jaWxBdHRhY2htZW50IiwiaSIsImxlbmd0aCIsImZvcm1hdCIsIkdGWEZvcm1hdCIsIlVOS05PV04iLCJjb2xvckZvcm1hdCIsImRlcHRoU3RlbmNpbEZvcm1hdCIsImNyZWF0ZVJlbmRlclBhc3MiLCJjb2xvclRleCIsImNyZWF0ZVRleHR1cmUiLCJHRlhUZXh0dXJlSW5mbyIsIkdGWFRleHR1cmVUeXBlIiwiVEVYMkQiLCJHRlhUZXh0dXJlVXNhZ2VCaXQiLCJDT0xPUl9BVFRBQ0hNRU5UIiwiU0FNUExFRCIsInNldCIsInB1c2giLCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQiLCJoRkJPIiwiR0ZYRnJhbWVidWZmZXJJbmZvIiwiZGVzdHJveSIsImNvbG9yVGV4dHVyZSIsIm5lZWRSZWJ1aWxkIiwicmVzaXplIiwiZnJhbWVidWZmZXIiLCJpbml0aWFsaXplIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWtCYUEsWTs7OztBQUVUOzs7OzBCQUlxQjtBQUNqQixlQUFPLEtBQUtDLE1BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlzQjtBQUNsQixlQUFPLEtBQUtDLE9BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUltQztBQUMvQixlQUFPQyw2QkFBZ0JDLEdBQWhCLENBQW9CQyw4QkFBaUJELEdBQWpCLENBQXFCLEtBQUtFLFdBQTFCLEVBQXVDQyw4QkFBaUJDLFdBQXhELENBQXBCLENBQVA7QUFDSDs7OzBCQUVrQztBQUMvQixlQUFPLEtBQUtDLDRCQUFaO0FBQ0g7OzswQkFFNkI7QUFDMUIsZUFBT0osOEJBQWlCRCxHQUFqQixDQUFxQixLQUFLRSxXQUExQixFQUF1Q0MsOEJBQWlCRyx5QkFBeEQsTUFBdUYsQ0FBdkYsR0FBMkYsSUFBM0YsR0FBa0csS0FBekc7QUFDSDs7OzBCQUU4QjtBQUMzQixlQUFPTCw4QkFBaUJELEdBQWpCLENBQXFCLEtBQUtFLFdBQTFCLEVBQXVDQyw4QkFBaUJJLDBCQUF4RCxNQUF3RixDQUF4RixHQUE0RixJQUE1RixHQUFtRyxLQUExRztBQUNIOzs7MEJBRWtDO0FBQy9CLGVBQU8sS0FBS0wsV0FBWjtBQUNIOzs7eUNBRWlDTSxJLEVBQVk7QUFDMUNBLFFBQUFBLElBQUksQ0FBQ0MsZ0JBQUwsR0FBd0IsVUFBQ0MsS0FBRDtBQUFBLGlCQUErQixJQUFJZCxZQUFKLENBQWlCYyxLQUFqQixDQUEvQjtBQUFBLFNBQXhCO0FBQ0g7OztBQWNELDBCQUFxQkYsSUFBckIsRUFBaUM7QUFBQTs7QUFBQSxXQVp2QkcsTUFZdUIsR0FaTixFQVlNO0FBQUEsV0FYdkJkLE1BV3VCLEdBWE4sQ0FXTTtBQUFB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QUFDLEdBQUcsS0FBS2hCLGNBQUwsQ0FBb0JpQixNQUF4QyxFQUFnREQsQ0FBQyxFQUFqRCxFQUFxRDtBQUNqRCxnQkFBTVEsUUFBUSxHQUFHLEtBQUt4QixjQUFMLENBQW9CZ0IsQ0FBcEIsQ0FBakI7O0FBQ0EsZ0JBQUlRLFFBQUosRUFBYztBQUNWQSxjQUFBQSxRQUFRLENBQUNnQixNQUFULENBQWdCN0IsS0FBaEIsRUFBdUJDLE1BQXZCO0FBQ0EyQixjQUFBQSxXQUFXLEdBQUcsSUFBZDtBQUNIO0FBQ0o7O0FBRUQsY0FBTUUsV0FBVyxHQUFHekQsNkJBQWdCQyxHQUFoQixDQUFvQkMsOEJBQWlCRCxHQUFqQixDQUFxQixLQUFLRSxXQUExQixFQUF1Q0MsOEJBQWlCQyxXQUF4RCxDQUFwQixDQUFwQjs7QUFDQSxjQUFJa0QsV0FBVyxJQUFJRSxXQUFuQixFQUFnQztBQUM1QkEsWUFBQUEsV0FBVyxDQUFDSixPQUFaO0FBQ0FJLFlBQUFBLFdBQVcsQ0FBQ0MsVUFBWixDQUF1QixJQUFJTix5QkFBSixDQUNuQixLQUFLckMsV0FEYyxFQUVuQixLQUFLQyxjQUZjLEVBR25CLEtBQUtDLG9CQUhjLENBQXZCO0FBS0g7QUFDSjtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIEdGWFRleHR1cmVUeXBlLFxyXG4gICAgR0ZYVGV4dHVyZVVzYWdlQml0LFxyXG4gICAgR0ZYRm9ybWF0LFxyXG59IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzLCBHRlhUZXh0dXJlLCBHRlhGcmFtZWJ1ZmZlciwgR0ZYUmVuZGVyUGFzc0luZm8sIEdGWERldmljZSwgR0ZYVGV4dHVyZUluZm8sIEdGWEZyYW1lYnVmZmVySW5mbyB9IGZyb20gJy4uLy4uL2dmeCc7XHJcbmltcG9ydCB7IFJvb3QgfSBmcm9tICcuLi8uLi9yb290JztcclxuaW1wb3J0IHsgUmVuZGVyV2luZG93SGFuZGxlLCBSZW5kZXJXaW5kb3dQb29sLCBSZW5kZXJXaW5kb3dWaWV3LCBGcmFtZWJ1ZmZlclBvb2wsIE5VTExfSEFORExFIH0gZnJvbSAnLi9tZW1vcnktcG9vbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUmVuZGVyV2luZG93SW5mbyB7XHJcbiAgICB0aXRsZT86IHN0cmluZztcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIHJlbmRlclBhc3NJbmZvOiBHRlhSZW5kZXJQYXNzSW5mbztcclxuICAgIHN3YXBjaGFpbkJ1ZmZlckluZGljZXM/OiBudW1iZXI7XHJcbiAgICBzaG91bGRTeW5jU2l6ZVdpdGhTd2FwY2hhaW4/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyV2luZG93IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgd2luZG93IHdpZHRoLlxyXG4gICAgICogQHpoIOeql+WPo+WuveW6puOAglxyXG4gICAgICovXHJcbiAgICBnZXQgd2lkdGggKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB3aW5kb3cgaGVpZ2h0LlxyXG4gICAgICogQHpoIOeql+WPo+mrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBnZXQgaGVpZ2h0ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHdpbmRvdyBmcmFtZSBidWZmZXIuXHJcbiAgICAgKiBAemggR0ZY5bin57yT5Yay44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBmcmFtZWJ1ZmZlciAoKTogR0ZYRnJhbWVidWZmZXIge1xyXG4gICAgICAgIHJldHVybiBGcmFtZWJ1ZmZlclBvb2wuZ2V0KFJlbmRlcldpbmRvd1Bvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJlbmRlcldpbmRvd1ZpZXcuRlJBTUVCVUZGRVIpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoYXNPblNjcmVlbkF0dGFjaG1lbnRzICgpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVyV2luZG93UG9vbC5nZXQodGhpcy5fcG9vbEhhbmRsZSwgUmVuZGVyV2luZG93Vmlldy5IQVNfT05fU0NSRUVOX0FUVEFDSE1FTlRTKSA9PT0gMSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFzT2ZmU2NyZWVuQXR0YWNobWVudHMgKCkge1xyXG4gICAgICAgIHJldHVybiBSZW5kZXJXaW5kb3dQb29sLmdldCh0aGlzLl9wb29sSGFuZGxlLCBSZW5kZXJXaW5kb3dWaWV3LkhBU19PRkZfU0NSRUVOX0FUVEFDSE1FTlRTKSA9PT0gMSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFuZGxlICgpIDogUmVuZGVyV2luZG93SGFuZGxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9vbEhhbmRsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyQ3JlYXRlRnVuYyAocm9vdDogUm9vdCkge1xyXG4gICAgICAgIHJvb3QuX2NyZWF0ZVdpbmRvd0Z1biA9IChfcm9vdDogUm9vdCk6IFJlbmRlcldpbmRvdyA9PiBuZXcgUmVuZGVyV2luZG93KF9yb290KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RpdGxlOiBzdHJpbmcgPSAnJztcclxuICAgIHByb3RlY3RlZCBfd2lkdGg6IG51bWJlciA9IDE7XHJcbiAgICBwcm90ZWN0ZWQgX2hlaWdodDogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfbmF0aXZlV2lkdGg6IG51bWJlciA9IDE7XHJcbiAgICBwcm90ZWN0ZWQgX25hdGl2ZUhlaWdodDogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jb2xvclRleHR1cmVzOiAoR0ZYVGV4dHVyZSB8IG51bGwpW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfZGVwdGhTdGVuY2lsVGV4dHVyZTogR0ZYVGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9zd2FwY2hhaW5CdWZmZXJJbmRpY2VzID0gMDtcclxuICAgIHByb3RlY3RlZCBfc2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX3Bvb2xIYW5kbGU6IFJlbmRlcldpbmRvd0hhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IgKHJvb3Q6IFJvb3QpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoZGV2aWNlOiBHRlhEZXZpY2UsIGluZm86IElSZW5kZXJXaW5kb3dJbmZvKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5fcG9vbEhhbmRsZSA9IFJlbmRlcldpbmRvd1Bvb2wuYWxsb2MoKTtcclxuXHJcbiAgICAgICAgaWYgKGluZm8udGl0bGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl90aXRsZSA9IGluZm8udGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5mby5zd2FwY2hhaW5CdWZmZXJJbmRpY2VzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3dhcGNoYWluQnVmZmVySW5kaWNlcyA9IGluZm8uc3dhcGNoYWluQnVmZmVySW5kaWNlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmZvLnNob3VsZFN5bmNTaXplV2l0aFN3YXBjaGFpbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Nob3VsZFN5bmNTaXplV2l0aFN3YXBjaGFpbiA9IGluZm8uc2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBpbmZvLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGluZm8uaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX25hdGl2ZVdpZHRoID0gdGhpcy5fd2lkdGg7XHJcbiAgICAgICAgdGhpcy5fbmF0aXZlSGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCB7IGNvbG9yQXR0YWNobWVudHMsIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQgfSA9IGluZm8ucmVuZGVyUGFzc0luZm87XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2xvckF0dGFjaG1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjb2xvckF0dGFjaG1lbnRzW2ldLmZvcm1hdCA9PT0gR0ZYRm9ybWF0LlVOS05PV04pIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudHNbaV0uZm9ybWF0ID0gZGV2aWNlLmNvbG9yRm9ybWF0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZXB0aFN0ZW5jaWxBdHRhY2htZW50ICYmIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuZm9ybWF0ID09PSBHRlhGb3JtYXQuVU5LTk9XTikge1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmZvcm1hdCA9IGRldmljZS5kZXB0aFN0ZW5jaWxGb3JtYXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJQYXNzID0gZGV2aWNlLmNyZWF0ZVJlbmRlclBhc3MoaW5mby5yZW5kZXJQYXNzSW5mbyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sb3JBdHRhY2htZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY29sb3JUZXg6IEdGWFRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5fc3dhcGNoYWluQnVmZmVySW5kaWNlcyAmICgxIDw8IGkpKSkge1xyXG4gICAgICAgICAgICAgICAgY29sb3JUZXggPSBkZXZpY2UuY3JlYXRlVGV4dHVyZShuZXcgR0ZYVGV4dHVyZUluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVVzYWdlQml0LkNPTE9SX0FUVEFDSE1FTlQgfCBHRlhUZXh0dXJlVXNhZ2VCaXQuU0FNUExFRCxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnRzW2ldLmZvcm1hdCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIFJlbmRlcldpbmRvd1Bvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJlbmRlcldpbmRvd1ZpZXcuSEFTX09GRl9TQ1JFRU5fQVRUQUNITUVOVFMsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgUmVuZGVyV2luZG93UG9vbC5zZXQodGhpcy5fcG9vbEhhbmRsZSwgUmVuZGVyV2luZG93Vmlldy5IQVNfT05fU0NSRUVOX0FUVEFDSE1FTlRTLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jb2xvclRleHR1cmVzLnB1c2goY29sb3JUZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVXNlIHRoZSBzaWduIGJpdCB0byBpbmRpY2F0ZSBkZXB0aCBhdHRhY2htZW50XHJcbiAgICAgICAgaWYgKGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N3YXBjaGFpbkJ1ZmZlckluZGljZXMgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVwdGhTdGVuY2lsVGV4dHVyZSA9IGRldmljZS5jcmVhdGVUZXh0dXJlKG5ldyBHRlhUZXh0dXJlSW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVHlwZS5URVgyRCxcclxuICAgICAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVXNhZ2VCaXQuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UIHwgR0ZYVGV4dHVyZVVzYWdlQml0LlNBTVBMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5mb3JtYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICBSZW5kZXJXaW5kb3dQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBSZW5kZXJXaW5kb3dWaWV3LkhBU19PRkZfU0NSRUVOX0FUVEFDSE1FTlRTLCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFJlbmRlcldpbmRvd1Bvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJlbmRlcldpbmRvd1ZpZXcuSEFTX09OX1NDUkVFTl9BVFRBQ0hNRU5UUywgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhGQk8gPSBGcmFtZWJ1ZmZlclBvb2wuYWxsb2MoZGV2aWNlLCBuZXcgR0ZYRnJhbWVidWZmZXJJbmZvKFxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJQYXNzLFxyXG4gICAgICAgICAgICB0aGlzLl9jb2xvclRleHR1cmVzLFxyXG4gICAgICAgICAgICB0aGlzLl9kZXB0aFN0ZW5jaWxUZXh0dXJlLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIFJlbmRlcldpbmRvd1Bvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJlbmRlcldpbmRvd1ZpZXcuRlJBTUVCVUZGRVIsIGhGQk8pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RlcHRoU3RlbmNpbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVwdGhTdGVuY2lsVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbFRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb2xvclRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yVGV4dHVyZSA9IHRoaXMuX2NvbG9yVGV4dHVyZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChjb2xvclRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29sb3JUZXh0dXJlcy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fcG9vbEhhbmRsZSkge1xyXG4gICAgICAgICAgICBGcmFtZWJ1ZmZlclBvb2wuZ2V0KFJlbmRlcldpbmRvd1Bvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJlbmRlcldpbmRvd1ZpZXcuRlJBTUVCVUZGRVIpKS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2xIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzaXplIHdpbmRvdy5cclxuICAgICAqIEB6aCDph43nva7nqpflj6PlpKflsI/jgIJcclxuICAgICAqIEBwYXJhbSB3aWR0aCBUaGUgbmV3IHdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBUaGUgbmV3IGhlaWdodC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2l6ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKHdpZHRoID4gdGhpcy5fbmF0aXZlV2lkdGggfHxcclxuICAgICAgICAgICAgaGVpZ2h0ID4gdGhpcy5fbmF0aXZlSGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9uYXRpdmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9uYXRpdmVIZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZXB0aFN0ZW5jaWxUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXB0aFN0ZW5jaWxUZXh0dXJlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIG5lZWRSZWJ1aWxkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb2xvclRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvclRleCA9IHRoaXMuX2NvbG9yVGV4dHVyZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY29sb3JUZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvclRleC5yZXNpemUod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmVlZFJlYnVpbGQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmcmFtZWJ1ZmZlciA9IEZyYW1lYnVmZmVyUG9vbC5nZXQoUmVuZGVyV2luZG93UG9vbC5nZXQodGhpcy5fcG9vbEhhbmRsZSwgUmVuZGVyV2luZG93Vmlldy5GUkFNRUJVRkZFUikpO1xyXG4gICAgICAgICAgICBpZiAobmVlZFJlYnVpbGQgJiYgZnJhbWVidWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGZyYW1lYnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIGZyYW1lYnVmZmVyLmluaXRpYWxpemUobmV3IEdGWEZyYW1lYnVmZmVySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJQYXNzISxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2xvclRleHR1cmVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbFRleHR1cmUsXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=