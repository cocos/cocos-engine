(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../value-types/enum.js", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../value-types/enum.js"), require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._enum, global.define);
    global.device = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _enum, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXDevice = _exports.GFXDeviceInfo = _exports.GFXBindingMappingInfo = _exports.GFXFeature = _exports.GFXAPI = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  (0, _enum.ccenum)(_define.GFXFormat);
  var GFXAPI;
  _exports.GFXAPI = GFXAPI;

  (function (GFXAPI) {
    GFXAPI[GFXAPI["UNKNOWN"] = 0] = "UNKNOWN";
    GFXAPI[GFXAPI["GL"] = 1] = "GL";
    GFXAPI[GFXAPI["GLES2"] = 2] = "GLES2";
    GFXAPI[GFXAPI["GLES3"] = 3] = "GLES3";
    GFXAPI[GFXAPI["METAL"] = 4] = "METAL";
    GFXAPI[GFXAPI["VULKAN"] = 5] = "VULKAN";
    GFXAPI[GFXAPI["DX12"] = 6] = "DX12";
    GFXAPI[GFXAPI["WEBGL"] = 7] = "WEBGL";
    GFXAPI[GFXAPI["WEBGL2"] = 8] = "WEBGL2";
  })(GFXAPI || (_exports.GFXAPI = GFXAPI = {}));

  var GFXFeature;
  _exports.GFXFeature = GFXFeature;

  (function (GFXFeature) {
    GFXFeature[GFXFeature["COLOR_FLOAT"] = 0] = "COLOR_FLOAT";
    GFXFeature[GFXFeature["COLOR_HALF_FLOAT"] = 1] = "COLOR_HALF_FLOAT";
    GFXFeature[GFXFeature["TEXTURE_FLOAT"] = 2] = "TEXTURE_FLOAT";
    GFXFeature[GFXFeature["TEXTURE_HALF_FLOAT"] = 3] = "TEXTURE_HALF_FLOAT";
    GFXFeature[GFXFeature["TEXTURE_FLOAT_LINEAR"] = 4] = "TEXTURE_FLOAT_LINEAR";
    GFXFeature[GFXFeature["TEXTURE_HALF_FLOAT_LINEAR"] = 5] = "TEXTURE_HALF_FLOAT_LINEAR";
    GFXFeature[GFXFeature["FORMAT_R11G11B10F"] = 6] = "FORMAT_R11G11B10F";
    GFXFeature[GFXFeature["FORMAT_D16"] = 7] = "FORMAT_D16";
    GFXFeature[GFXFeature["FORMAT_D16S8"] = 8] = "FORMAT_D16S8";
    GFXFeature[GFXFeature["FORMAT_D24"] = 9] = "FORMAT_D24";
    GFXFeature[GFXFeature["FORMAT_D24S8"] = 10] = "FORMAT_D24S8";
    GFXFeature[GFXFeature["FORMAT_D32F"] = 11] = "FORMAT_D32F";
    GFXFeature[GFXFeature["FORMAT_D32FS8"] = 12] = "FORMAT_D32FS8";
    GFXFeature[GFXFeature["FORMAT_ETC1"] = 13] = "FORMAT_ETC1";
    GFXFeature[GFXFeature["FORMAT_ETC2"] = 14] = "FORMAT_ETC2";
    GFXFeature[GFXFeature["FORMAT_DXT"] = 15] = "FORMAT_DXT";
    GFXFeature[GFXFeature["FORMAT_PVRTC"] = 16] = "FORMAT_PVRTC";
    GFXFeature[GFXFeature["FORMAT_ASTC"] = 17] = "FORMAT_ASTC";
    GFXFeature[GFXFeature["FORMAT_RGB8"] = 18] = "FORMAT_RGB8";
    GFXFeature[GFXFeature["MSAA"] = 19] = "MSAA";
    GFXFeature[GFXFeature["ELEMENT_INDEX_UINT"] = 20] = "ELEMENT_INDEX_UINT";
    GFXFeature[GFXFeature["INSTANCED_ARRAYS"] = 21] = "INSTANCED_ARRAYS";
    GFXFeature[GFXFeature["COUNT"] = 22] = "COUNT";
  })(GFXFeature || (_exports.GFXFeature = GFXFeature = {}));

  var GFXBindingMappingInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXBindingMappingInfo() {
    var bufferOffsets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var samplerOffsets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var flexibleSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, GFXBindingMappingInfo);

    this.bufferOffsets = bufferOffsets;
    this.samplerOffsets = samplerOffsets;
    this.flexibleSet = flexibleSet;
  };

  _exports.GFXBindingMappingInfo = GFXBindingMappingInfo;

  var GFXDeviceInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXDeviceInfo(canvasElm) {
    var isAntialias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var isPremultipliedAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var devicePixelRatio = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var nativeWidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var nativeHeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    var bindingMappingInfo = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new GFXBindingMappingInfo();

    _classCallCheck(this, GFXDeviceInfo);

    this.canvasElm = canvasElm;
    this.isAntialias = isAntialias;
    this.isPremultipliedAlpha = isPremultipliedAlpha;
    this.devicePixelRatio = devicePixelRatio;
    this.nativeWidth = nativeWidth;
    this.nativeHeight = nativeHeight;
    this.bindingMappingInfo = bindingMappingInfo;
  };
  /**
   * @en GFX Device.
   * @zh GFX 设备。
   */


  _exports.GFXDeviceInfo = GFXDeviceInfo;

  var GFXDevice = /*#__PURE__*/function () {
    function GFXDevice() {
      _classCallCheck(this, GFXDevice);

      this._canvas = null;
      this._canvas2D = null;
      this._gfxAPI = GFXAPI.UNKNOWN;
      this._deviceName = '';
      this._renderer = '';
      this._vendor = '';
      this._version = '';
      this._features = new Array(GFXFeature.COUNT);
      this._queue = null;
      this._cmdBuff = null;
      this._devicePixelRatio = 1.0;
      this._width = 0;
      this._height = 0;
      this._nativeWidth = 0;
      this._nativeHeight = 0;
      this._maxVertexAttributes = 0;
      this._maxVertexUniformVectors = 0;
      this._maxFragmentUniformVectors = 0;
      this._maxTextureUnits = 0;
      this._maxVertexTextureUnits = 0;
      this._maxUniformBufferBindings = 0;
      this._maxUniformBlockSize = 0;
      this._maxTextureSize = 0;
      this._maxCubeMapTextureSize = 0;
      this._uboOffsetAlignment = 1;
      this._depthBits = 0;
      this._stencilBits = 0;
      this._colorFmt = _define.GFXFormat.UNKNOWN;
      this._depthStencilFmt = _define.GFXFormat.UNKNOWN;
      this._macros = new Map();
      this._numDrawCalls = 0;
      this._numInstances = 0;
      this._numTris = 0;
      this._memoryStatus = new _define.GFXMemoryStatus();
      this._clipSpaceMinZ = -1;
      this._screenSpaceSignY = 1;
      this._UVSpaceSignY = -1;
    }

    _createClass(GFXDevice, [{
      key: "hasFeature",

      /**
       * @en Whether the device has specific feature.
       * @zh 是否具备特性。
       * @param feature The GFX feature to be queried.
       */
      value: function hasFeature(feature) {
        return this._features[feature];
      }
    }, {
      key: "canvas",

      /**
       * @en The HTML canvas element.
       * @zh HTML 画布。
       */
      get: function get() {
        return this._canvas;
      }
      /**
       * @en The HTML canvas element for 2D rendering.
       * @zh 用于 2D 绘制的 HTML 画布。
       */

    }, {
      key: "canvas2D",
      get: function get() {
        return this._canvas2D;
      }
      /**
       * @en Current rendering API.
       * @zh 当前 GFX 使用的渲染 API。
       */

    }, {
      key: "gfxAPI",
      get: function get() {
        return this._gfxAPI;
      }
      /**
       * @en GFX default queue.
       * @zh GFX 默认队列。
       */

    }, {
      key: "queue",
      get: function get() {
        return this._queue;
      }
      /**
       * @en GFX default command buffer.
       * @zh GFX 默认命令缓冲。
       */

    }, {
      key: "commandBuffer",
      get: function get() {
        return this._cmdBuff;
      }
      /**
       * @en Device pixel ratio.
       * @zh DPR 设备像素比。
       */

    }, {
      key: "devicePixelRatio",
      get: function get() {
        return this._devicePixelRatio;
      }
      /**
       * @en Device pixel width.
       * @zh 设备像素宽度。
       */

    }, {
      key: "width",
      get: function get() {
        return this._width;
      }
      /**
       * @en Device pixel height.
       * @zh 设备像素高度。
       */

    }, {
      key: "height",
      get: function get() {
        return this._height;
      }
      /**
       * @en Device native width.
       * @zh 设备原生的像素宽度。
       */

    }, {
      key: "nativeWidth",
      get: function get() {
        return this._nativeWidth;
      }
      /**
       * @en Device native height.
       * @zh 设备原生的像素高度。
       */

    }, {
      key: "nativeHeight",
      get: function get() {
        return this._nativeHeight;
      }
      /**
       * @en Renderer description.
       * @zh 渲染器描述。
       */

    }, {
      key: "renderer",
      get: function get() {
        return this._renderer;
      }
      /**
       * @en Vendor description.
       * @zh 厂商描述。
       */

    }, {
      key: "vendor",
      get: function get() {
        return this._vendor;
      }
      /**
       * @en Max vertex attributes supported.
       * @zh 最大顶点属性数量。
       */

    }, {
      key: "maxVertexAttributes",
      get: function get() {
        return this._maxVertexAttributes;
      }
      /**
       * @en Max vertex uniform vectors supported.
       * @zh 最大顶点Uniform向量数。
       */

    }, {
      key: "maxVertexUniformVectors",
      get: function get() {
        return this._maxVertexUniformVectors;
      }
      /**
       * @en Max fragment uniform vectors supported.
       * @zh 最大片段Uniform向量数。
       */

    }, {
      key: "maxFragmentUniformVectors",
      get: function get() {
        return this._maxFragmentUniformVectors;
      }
      /**
       * @en Max texture units supported.
       * @zh 最大纹理单元数量。
       */

    }, {
      key: "maxTextureUnits",
      get: function get() {
        return this._maxTextureUnits;
      }
      /**
       * @en Max vertex texture units supported.
       * @zh 最大顶点纹理单元数量。
       */

    }, {
      key: "maxVertexTextureUnits",
      get: function get() {
        return this._maxVertexTextureUnits;
      }
      /**
       * @en Max uniform buffer bindings supported.
       * @zh 最大 uniform 缓冲绑定数量。
       */

    }, {
      key: "maxUniformBufferBindings",
      get: function get() {
        return this._maxUniformBufferBindings;
      }
      /**
       * @en Max uniform block size supported.
       * @zh 最大 uniform 缓冲大小。
       */

    }, {
      key: "maxUniformBlockSize",
      get: function get() {
        return this._maxUniformBlockSize;
      }
      /**
       * @en Max texture size supported.
       * @zh 最大贴图尺寸。
       */

    }, {
      key: "maxTextureSize",
      get: function get() {
        return this._maxTextureSize;
      }
      /**
       * @en Max cube map texture size supported.
       * @zh 最大立方贴图尺寸。
       */

    }, {
      key: "maxCubeMapTextureSize",
      get: function get() {
        return this._maxCubeMapTextureSize;
      }
      /**
       * @en Uniform buffer offset alignment.
       * @zh Uniform 缓冲偏移量的对齐单位。
       */

    }, {
      key: "uboOffsetAlignment",
      get: function get() {
        return this._uboOffsetAlignment;
      }
      /**
       * @en Device depth bits.
       * @zh 深度位数。
       */

    }, {
      key: "depthBits",
      get: function get() {
        return this._depthBits;
      }
      /**
       * @en Device stencil bits.
       * @zh 模板位数。
       */

    }, {
      key: "stencilBits",
      get: function get() {
        return this._stencilBits;
      }
      /**
       * @en Device color format.
       * @zh 颜色格式。
       */

    }, {
      key: "colorFormat",
      get: function get() {
        return this._colorFmt;
      }
      /**
       * @en Device depth stencil format.
       * @zh 深度模板格式。
       */

    }, {
      key: "depthStencilFormat",
      get: function get() {
        return this._depthStencilFmt;
      }
      /**
       * @en Device built-in macros.
       * @zh 系统宏定义。
       */

    }, {
      key: "macros",
      get: function get() {
        return this._macros;
      }
      /**
       * @en Number of draw calls currently recorded.
       * @zh 绘制调用次数。
       */

    }, {
      key: "numDrawCalls",
      get: function get() {
        return this._numDrawCalls;
      }
      /**
       * @en Number of instances currently recorded.
       * @zh 绘制 Instance 数量。
       */

    }, {
      key: "numInstances",
      get: function get() {
        return this._numInstances;
      }
      /**
       * @en Number of triangles currently recorded.
       * @zh 渲染三角形数量。
       */

    }, {
      key: "numTris",
      get: function get() {
        return this._numTris;
      }
      /**
       * @en Total memory size currently allocated.
       * @zh 内存状态。
       */

    }, {
      key: "memoryStatus",
      get: function get() {
        return this._memoryStatus;
      }
      /**
       * @en The minimum Z value in clip space for the device.
       * @zh 裁剪空间的最小 z 值。
       */

    }, {
      key: "clipSpaceMinZ",
      get: function get() {
        return this._clipSpaceMinZ;
      }
      /**
       * @en The sign of the screen space Y axis, positive if origin at lower-left.
       * @zh 屏幕空间的 y 轴符号，原点在左下角时为正。
       */

    }, {
      key: "screenSpaceSignY",
      get: function get() {
        return this._screenSpaceSignY;
      }
      /**
       * @en The sign of the UV space Y axis, positive if origin at upper-left.
       * @zh UV 空间的 y 轴符号，原点在左上角时为正。
       */

    }, {
      key: "UVSpaceSignY",
      get: function get() {
        return this._UVSpaceSignY;
      }
    }]);

    return GFXDevice;
  }();

  _exports.GFXDevice = GFXDevice;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2RldmljZS50cyJdLCJuYW1lcyI6WyJHRlhGb3JtYXQiLCJHRlhBUEkiLCJHRlhGZWF0dXJlIiwiR0ZYQmluZGluZ01hcHBpbmdJbmZvIiwiYnVmZmVyT2Zmc2V0cyIsInNhbXBsZXJPZmZzZXRzIiwiZmxleGlibGVTZXQiLCJHRlhEZXZpY2VJbmZvIiwiY2FudmFzRWxtIiwiaXNBbnRpYWxpYXMiLCJpc1ByZW11bHRpcGxpZWRBbHBoYSIsImRldmljZVBpeGVsUmF0aW8iLCJuYXRpdmVXaWR0aCIsIm5hdGl2ZUhlaWdodCIsImJpbmRpbmdNYXBwaW5nSW5mbyIsIkdGWERldmljZSIsIl9jYW52YXMiLCJfY2FudmFzMkQiLCJfZ2Z4QVBJIiwiVU5LTk9XTiIsIl9kZXZpY2VOYW1lIiwiX3JlbmRlcmVyIiwiX3ZlbmRvciIsIl92ZXJzaW9uIiwiX2ZlYXR1cmVzIiwiQXJyYXkiLCJDT1VOVCIsIl9xdWV1ZSIsIl9jbWRCdWZmIiwiX2RldmljZVBpeGVsUmF0aW8iLCJfd2lkdGgiLCJfaGVpZ2h0IiwiX25hdGl2ZVdpZHRoIiwiX25hdGl2ZUhlaWdodCIsIl9tYXhWZXJ0ZXhBdHRyaWJ1dGVzIiwiX21heFZlcnRleFVuaWZvcm1WZWN0b3JzIiwiX21heEZyYWdtZW50VW5pZm9ybVZlY3RvcnMiLCJfbWF4VGV4dHVyZVVuaXRzIiwiX21heFZlcnRleFRleHR1cmVVbml0cyIsIl9tYXhVbmlmb3JtQnVmZmVyQmluZGluZ3MiLCJfbWF4VW5pZm9ybUJsb2NrU2l6ZSIsIl9tYXhUZXh0dXJlU2l6ZSIsIl9tYXhDdWJlTWFwVGV4dHVyZVNpemUiLCJfdWJvT2Zmc2V0QWxpZ25tZW50IiwiX2RlcHRoQml0cyIsIl9zdGVuY2lsQml0cyIsIl9jb2xvckZtdCIsIl9kZXB0aFN0ZW5jaWxGbXQiLCJfbWFjcm9zIiwiTWFwIiwiX251bURyYXdDYWxscyIsIl9udW1JbnN0YW5jZXMiLCJfbnVtVHJpcyIsIl9tZW1vcnlTdGF0dXMiLCJHRlhNZW1vcnlTdGF0dXMiLCJfY2xpcFNwYWNlTWluWiIsIl9zY3JlZW5TcGFjZVNpZ25ZIiwiX1VWU3BhY2VTaWduWSIsImZlYXR1cmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLG9CQUFPQSxpQkFBUDtNQUVZQyxNOzs7YUFBQUEsTTtBQUFBQSxJQUFBQSxNLENBQUFBLE07QUFBQUEsSUFBQUEsTSxDQUFBQSxNO0FBQUFBLElBQUFBLE0sQ0FBQUEsTTtBQUFBQSxJQUFBQSxNLENBQUFBLE07QUFBQUEsSUFBQUEsTSxDQUFBQSxNO0FBQUFBLElBQUFBLE0sQ0FBQUEsTTtBQUFBQSxJQUFBQSxNLENBQUFBLE07QUFBQUEsSUFBQUEsTSxDQUFBQSxNO0FBQUFBLElBQUFBLE0sQ0FBQUEsTTtLQUFBQSxNLHVCQUFBQSxNOztNQVlBQyxVOzs7YUFBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEs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QkFJcUM7QUFDakMsZUFBTyxLQUFLQyxnQkFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSW1DO0FBQy9CLGVBQU8sS0FBS0MsT0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSTRCO0FBQ3hCLGVBQU8sS0FBS0UsYUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSTRCO0FBQ3hCLGVBQU8sS0FBS0MsYUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXVCO0FBQ25CLGVBQU8sS0FBS0MsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXFDO0FBQ2pDLGVBQU8sS0FBS0MsYUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXFCO0FBQ2pCLGVBQU8sS0FBS0UsY0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXdCO0FBQ3BCLGVBQU8sS0FBS0MsaUJBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlvQjtBQUNoQixlQUFPLEtBQUtDLGFBQVo7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NlbnVtIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXQsIEdGWERlc2NyaXB0b3JTZXRJbmZvIH0gZnJvbSAnLi9kZXNjcmlwdG9yLXNldCc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVySW5mbywgR0ZYQnVmZmVyVmlld0luZm8gfSBmcm9tICcuL2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIsIEdGWENvbW1hbmRCdWZmZXJJbmZvIH0gZnJvbSAnLi9jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlclRleHR1cmVDb3B5LCBHRlhGaWx0ZXIsIEdGWEZvcm1hdCwgR0ZYTWVtb3J5U3RhdHVzLCBHRlhSZWN0IH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhGZW5jZSwgR0ZYRmVuY2VJbmZvIH0gZnJvbSAnLi9mZW5jZSc7XHJcbmltcG9ydCB7IEdGWEZyYW1lYnVmZmVyLCBHRlhGcmFtZWJ1ZmZlckluZm8gfSBmcm9tICcuL2ZyYW1lYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIsIEdGWElucHV0QXNzZW1ibGVySW5mbyB9IGZyb20gJy4vaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgR0ZYUGlwZWxpbmVTdGF0ZSwgR0ZYUGlwZWxpbmVTdGF0ZUluZm8gfSBmcm9tICcuL3BpcGVsaW5lLXN0YXRlJztcclxuaW1wb3J0IHsgR0ZYUXVldWUsIEdGWFF1ZXVlSW5mbyB9IGZyb20gJy4vcXVldWUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzLCBHRlhSZW5kZXJQYXNzSW5mbyB9IGZyb20gJy4vcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBHRlhTYW1wbGVyLCBHRlhTYW1wbGVySW5mbyB9IGZyb20gJy4vc2FtcGxlcic7XHJcbmltcG9ydCB7IEdGWFNoYWRlciwgR0ZYU2hhZGVySW5mbyB9IGZyb20gJy4vc2hhZGVyJztcclxuaW1wb3J0IHsgR0ZYVGV4dHVyZSwgR0ZYVGV4dHVyZUluZm8sIEdGWFRleHR1cmVWaWV3SW5mbyB9IGZyb20gJy4vdGV4dHVyZSc7XHJcbmltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvLCBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0LCBHRlhQaXBlbGluZUxheW91dEluZm8sIEdGWFBpcGVsaW5lTGF5b3V0IH0gZnJvbSAnLi4vLi4vLi4vZXhwb3J0cy9iYXNlJztcclxuXHJcbmNjZW51bShHRlhGb3JtYXQpO1xyXG5cclxuZXhwb3J0IGVudW0gR0ZYQVBJIHtcclxuICAgIFVOS05PV04sXHJcbiAgICBHTCxcclxuICAgIEdMRVMyLFxyXG4gICAgR0xFUzMsXHJcbiAgICBNRVRBTCxcclxuICAgIFZVTEtBTixcclxuICAgIERYMTIsXHJcbiAgICBXRUJHTCxcclxuICAgIFdFQkdMMixcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYRmVhdHVyZSB7XHJcbiAgICBDT0xPUl9GTE9BVCxcclxuICAgIENPTE9SX0hBTEZfRkxPQVQsXHJcbiAgICBURVhUVVJFX0ZMT0FULFxyXG4gICAgVEVYVFVSRV9IQUxGX0ZMT0FULFxyXG4gICAgVEVYVFVSRV9GTE9BVF9MSU5FQVIsXHJcbiAgICBURVhUVVJFX0hBTEZfRkxPQVRfTElORUFSLFxyXG4gICAgRk9STUFUX1IxMUcxMUIxMEYsXHJcbiAgICBGT1JNQVRfRDE2LFxyXG4gICAgRk9STUFUX0QxNlM4LFxyXG4gICAgRk9STUFUX0QyNCxcclxuICAgIEZPUk1BVF9EMjRTOCxcclxuICAgIEZPUk1BVF9EMzJGLFxyXG4gICAgRk9STUFUX0QzMkZTOCxcclxuICAgIEZPUk1BVF9FVEMxLFxyXG4gICAgRk9STUFUX0VUQzIsXHJcbiAgICBGT1JNQVRfRFhULFxyXG4gICAgRk9STUFUX1BWUlRDLFxyXG4gICAgRk9STUFUX0FTVEMsXHJcbiAgICBGT1JNQVRfUkdCOCxcclxuICAgIE1TQUEsXHJcbiAgICBFTEVNRU5UX0lOREVYX1VJTlQsXHJcbiAgICBJTlNUQU5DRURfQVJSQVlTLFxyXG4gICAgQ09VTlQsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhCaW5kaW5nTWFwcGluZ0luZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBidWZmZXJPZmZzZXRzOiBudW1iZXJbXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyBzYW1wbGVyT2Zmc2V0czogbnVtYmVyW10gPSBbXSxcclxuICAgICAgICBwdWJsaWMgZmxleGlibGVTZXQ6IG51bWJlciA9IDAsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhEZXZpY2VJbmZvIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgY2FudmFzRWxtOiBIVE1MRWxlbWVudCxcclxuICAgICAgICBwdWJsaWMgaXNBbnRpYWxpYXM6IGJvb2xlYW4gPSB0cnVlLFxyXG4gICAgICAgIHB1YmxpYyBpc1ByZW11bHRpcGxpZWRBbHBoYTogYm9vbGVhbiA9IHRydWUsXHJcbiAgICAgICAgcHVibGljIGRldmljZVBpeGVsUmF0aW86IG51bWJlciA9IDEsXHJcbiAgICAgICAgcHVibGljIG5hdGl2ZVdpZHRoOiBudW1iZXIgPSAxLFxyXG4gICAgICAgIHB1YmxpYyBuYXRpdmVIZWlnaHQ6IG51bWJlciA9IDEsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRm9yIG5vbi12dWxrYW4gYmFja2VuZHMsIHRvIG1haW50YWluIGNvbXBhdGliaWxpdHkgYW5kIG1heGltaXplXHJcbiAgICAgICAgICogZGVzY3JpcHRvciBjYWNoZS1sb2NhbGl0eSwgZGVzY3JpcHRvci1zZXQtYmFzZWQgYmluZGluZyBudW1iZXJzIG5lZWRcclxuICAgICAgICAgKiB0byBiZSBtYXBwZWQgdG8gYmFja2VuZC1zcGVjaWZpYyBiaW5kaW5ncyBiYXNlZCBvbiBtYXhpbXVtIGxpbWl0XHJcbiAgICAgICAgICogb2YgYXZhaWxhYmxlIGRlc2NyaXB0b3Igc2xvdHMgaW4gZWFjaCBzZXQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBCZWNhdXNlIHRoZSBiaW5kaW5nIG51bWJlcnMgYXJlIGd1YXJhbnRlZWQgdG8gYmUgY29uc2VjdXRpdmUgZm9yIGVhY2hcclxuICAgICAgICAgKiBkZXNjcmlwdG9yIHR5cGUgaW5zaWRlIGVhY2ggc2V0LCB0aGUgbWFwcGluZyBwcm9jZWR1cmUgY2FuIGJlIHJlZHVjZWRcclxuICAgICAgICAgKiB0byBhIHNpbXBsZSBzaGlmdGluZyBvcGVyYXRpb24uIFRoaXMgZGF0YSBzdHJ1Y3R1cmUgc3BlY2lmaWVzIHRoZVxyXG4gICAgICAgICAqIGV4YWN0IG9mZnNldHMgZm9yIGVhY2ggZGVzY3JpcHRvciB0eXBlIGluIGVhY2ggc2V0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBiaW5kaW5nTWFwcGluZ0luZm8gPSBuZXcgR0ZYQmluZGluZ01hcHBpbmdJbmZvKCksXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIERldmljZS5cclxuICogQHpoIEdGWCDorr7lpIfjgIJcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHRlhEZXZpY2Uge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBIVE1MIGNhbnZhcyBlbGVtZW50LlxyXG4gICAgICogQHpoIEhUTUwg55S75biD44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBjYW52YXMgKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBIVE1MIGNhbnZhcyBlbGVtZW50IGZvciAyRCByZW5kZXJpbmcuXHJcbiAgICAgKiBAemgg55So5LqOIDJEIOe7mOWItueahCBIVE1MIOeUu+W4g+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgY2FudmFzMkQgKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzMkQgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ3VycmVudCByZW5kZXJpbmcgQVBJLlxyXG4gICAgICogQHpoIOW9k+WJjSBHRlgg5L2/55So55qE5riy5p+TIEFQSeOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZ2Z4QVBJICgpOiBHRlhBUEkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZnhBUEk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR0ZYIGRlZmF1bHQgcXVldWUuXHJcbiAgICAgKiBAemggR0ZYIOm7mOiupOmYn+WIl+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgcXVldWUgKCk6IEdGWFF1ZXVlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcXVldWUgYXMgR0ZYUXVldWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR0ZYIGRlZmF1bHQgY29tbWFuZCBidWZmZXIuXHJcbiAgICAgKiBAemggR0ZYIOm7mOiupOWRveS7pOe8k+WGsuOAglxyXG4gICAgICovXHJcbiAgICBnZXQgY29tbWFuZEJ1ZmZlciAoKTogR0ZYQ29tbWFuZEJ1ZmZlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NtZEJ1ZmYgYXMgR0ZYQ29tbWFuZEJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEZXZpY2UgcGl4ZWwgcmF0aW8uXHJcbiAgICAgKiBAemggRFBSIOiuvuWkh+WDj+e0oOavlOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGV2aWNlUGl4ZWxSYXRpbyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEZXZpY2UgcGl4ZWwgd2lkdGguXHJcbiAgICAgKiBAemgg6K6+5aSH5YOP57Sg5a695bqm44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB3aWR0aCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGV2aWNlIHBpeGVsIGhlaWdodC5cclxuICAgICAqIEB6aCDorr7lpIflg4/ntKDpq5jluqbjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGhlaWdodCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERldmljZSBuYXRpdmUgd2lkdGguXHJcbiAgICAgKiBAemgg6K6+5aSH5Y6f55Sf55qE5YOP57Sg5a695bqm44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBuYXRpdmVXaWR0aCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlV2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGV2aWNlIG5hdGl2ZSBoZWlnaHQuXHJcbiAgICAgKiBAemgg6K6+5aSH5Y6f55Sf55qE5YOP57Sg6auY5bqm44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBuYXRpdmVIZWlnaHQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hdGl2ZUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZW5kZXJlciBkZXNjcmlwdGlvbi5cclxuICAgICAqIEB6aCDmuLLmn5Plmajmj4/ov7DjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHJlbmRlcmVyICgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBWZW5kb3IgZGVzY3JpcHRpb24uXHJcbiAgICAgKiBAemgg5Y6C5ZWG5o+P6L+w44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB2ZW5kb3IgKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlbmRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNYXggdmVydGV4IGF0dHJpYnV0ZXMgc3VwcG9ydGVkLlxyXG4gICAgICogQHpoIOacgOWkp+mhtueCueWxnuaAp+aVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4VmVydGV4QXR0cmlidXRlcyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4VmVydGV4QXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNYXggdmVydGV4IHVuaWZvcm0gdmVjdG9ycyBzdXBwb3J0ZWQuXHJcbiAgICAgKiBAemgg5pyA5aSn6aG254K5VW5pZm9ybeWQkemHj+aVsOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4VmVydGV4VW5pZm9ybVZlY3RvcnMgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFZlcnRleFVuaWZvcm1WZWN0b3JzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE1heCBmcmFnbWVudCB1bmlmb3JtIHZlY3RvcnMgc3VwcG9ydGVkLlxyXG4gICAgICogQHpoIOacgOWkp+eJh+autVVuaWZvcm3lkJHph4/mlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG1heEZyYWdtZW50VW5pZm9ybVZlY3RvcnMgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heEZyYWdtZW50VW5pZm9ybVZlY3RvcnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWF4IHRleHR1cmUgdW5pdHMgc3VwcG9ydGVkLlxyXG4gICAgICogQHpoIOacgOWkp+e6ueeQhuWNleWFg+aVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWF4VGV4dHVyZVVuaXRzICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhUZXh0dXJlVW5pdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWF4IHZlcnRleCB0ZXh0dXJlIHVuaXRzIHN1cHBvcnRlZC5cclxuICAgICAqIEB6aCDmnIDlpKfpobbngrnnurnnkIbljZXlhYPmlbDph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG1heFZlcnRleFRleHR1cmVVbml0cyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4VmVydGV4VGV4dHVyZVVuaXRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE1heCB1bmlmb3JtIGJ1ZmZlciBiaW5kaW5ncyBzdXBwb3J0ZWQuXHJcbiAgICAgKiBAemgg5pyA5aSnIHVuaWZvcm0g57yT5Yay57uR5a6a5pWw6YeP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhVbmlmb3JtQnVmZmVyQmluZGluZ3MgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFVuaWZvcm1CdWZmZXJCaW5kaW5ncztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNYXggdW5pZm9ybSBibG9jayBzaXplIHN1cHBvcnRlZC5cclxuICAgICAqIEB6aCDmnIDlpKcgdW5pZm9ybSDnvJPlhrLlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG1heFVuaWZvcm1CbG9ja1NpemUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFVuaWZvcm1CbG9ja1NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWF4IHRleHR1cmUgc2l6ZSBzdXBwb3J0ZWQuXHJcbiAgICAgKiBAemgg5pyA5aSn6LS05Zu+5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhUZXh0dXJlU2l6ZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4VGV4dHVyZVNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWF4IGN1YmUgbWFwIHRleHR1cmUgc2l6ZSBzdXBwb3J0ZWQuXHJcbiAgICAgKiBAemgg5pyA5aSn56uL5pa56LS05Zu+5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXhDdWJlTWFwVGV4dHVyZVNpemUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heEN1YmVNYXBUZXh0dXJlU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVbmlmb3JtIGJ1ZmZlciBvZmZzZXQgYWxpZ25tZW50LlxyXG4gICAgICogQHpoIFVuaWZvcm0g57yT5Yay5YGP56e76YeP55qE5a+56b2Q5Y2V5L2N44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB1Ym9PZmZzZXRBbGlnbm1lbnQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Vib09mZnNldEFsaWdubWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEZXZpY2UgZGVwdGggYml0cy5cclxuICAgICAqIEB6aCDmt7HluqbkvY3mlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGRlcHRoQml0cyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVwdGhCaXRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERldmljZSBzdGVuY2lsIGJpdHMuXHJcbiAgICAgKiBAemgg5qih5p2/5L2N5pWw44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBzdGVuY2lsQml0cyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RlbmNpbEJpdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGV2aWNlIGNvbG9yIGZvcm1hdC5cclxuICAgICAqIEB6aCDpopzoibLmoLzlvI/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvbG9yRm9ybWF0ICgpOiBHRlhGb3JtYXQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvckZtdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEZXZpY2UgZGVwdGggc3RlbmNpbCBmb3JtYXQuXHJcbiAgICAgKiBAemgg5rex5bqm5qih5p2/5qC85byP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBkZXB0aFN0ZW5jaWxGb3JtYXQgKCk6IEdGWEZvcm1hdCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlcHRoU3RlbmNpbEZtdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEZXZpY2UgYnVpbHQtaW4gbWFjcm9zLlxyXG4gICAgICogQHpoIOezu+e7n+Wuj+WumuS5ieOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWFjcm9zICgpOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFjcm9zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE51bWJlciBvZiBkcmF3IGNhbGxzIGN1cnJlbnRseSByZWNvcmRlZC5cclxuICAgICAqIEB6aCDnu5jliLbosIPnlKjmrKHmlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG51bURyYXdDYWxscyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtRHJhd0NhbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE51bWJlciBvZiBpbnN0YW5jZXMgY3VycmVudGx5IHJlY29yZGVkLlxyXG4gICAgICogQHpoIOe7mOWItiBJbnN0YW5jZSDmlbDph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG51bUluc3RhbmNlcyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtSW5zdGFuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE51bWJlciBvZiB0cmlhbmdsZXMgY3VycmVudGx5IHJlY29yZGVkLlxyXG4gICAgICogQHpoIOa4suafk+S4ieinkuW9ouaVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgbnVtVHJpcyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVHJpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUb3RhbCBtZW1vcnkgc2l6ZSBjdXJyZW50bHkgYWxsb2NhdGVkLlxyXG4gICAgICogQHpoIOWGheWtmOeKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbWVtb3J5U3RhdHVzICgpOiBHRlhNZW1vcnlTdGF0dXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZW1vcnlTdGF0dXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG1pbmltdW0gWiB2YWx1ZSBpbiBjbGlwIHNwYWNlIGZvciB0aGUgZGV2aWNlLlxyXG4gICAgICogQHpoIOijgeWJquepuumXtOeahOacgOWwjyB6IOWAvOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgY2xpcFNwYWNlTWluWiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaXBTcGFjZU1pblo7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHNpZ24gb2YgdGhlIHNjcmVlbiBzcGFjZSBZIGF4aXMsIHBvc2l0aXZlIGlmIG9yaWdpbiBhdCBsb3dlci1sZWZ0LlxyXG4gICAgICogQHpoIOWxj+W5leepuumXtOeahCB5IOi9tOespuWPt++8jOWOn+eCueWcqOW3puS4i+inkuaXtuS4uuato+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgc2NyZWVuU3BhY2VTaWduWSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjcmVlblNwYWNlU2lnblk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHNpZ24gb2YgdGhlIFVWIHNwYWNlIFkgYXhpcywgcG9zaXRpdmUgaWYgb3JpZ2luIGF0IHVwcGVyLWxlZnQuXHJcbiAgICAgKiBAemggVVYg56m66Ze055qEIHkg6L2056ym5Y+377yM5Y6f54K55Zyo5bem5LiK6KeS5pe25Li65q2j44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBVVlNwYWNlU2lnblkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9VVlNwYWNlU2lnblk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYW52YXM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2NhbnZhczJEOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9nZnhBUEk6IEdGWEFQSSA9IEdGWEFQSS5VTktOT1dOO1xyXG4gICAgcHJvdGVjdGVkIF9kZXZpY2VOYW1lOiBzdHJpbmcgPSAnJztcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyZXI6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJvdGVjdGVkIF92ZW5kb3I6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJvdGVjdGVkIF92ZXJzaW9uOiBzdHJpbmcgPSAnJztcclxuICAgIHByb3RlY3RlZCBfZmVhdHVyZXM6IGJvb2xlYW5bXSA9IG5ldyBBcnJheTxib29sZWFuPihHRlhGZWF0dXJlLkNPVU5UKTtcclxuICAgIHByb3RlY3RlZCBfcXVldWU6IEdGWFF1ZXVlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2NtZEJ1ZmY6IEdGWENvbW1hbmRCdWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfZGV2aWNlUGl4ZWxSYXRpbzogbnVtYmVyID0gMS4wO1xyXG4gICAgcHJvdGVjdGVkIF93aWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfaGVpZ2h0OiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9uYXRpdmVXaWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfbmF0aXZlSGVpZ2h0OiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tYXhWZXJ0ZXhBdHRyaWJ1dGVzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tYXhWZXJ0ZXhVbmlmb3JtVmVjdG9yczogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfbWF4RnJhZ21lbnRVbmlmb3JtVmVjdG9yczogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfbWF4VGV4dHVyZVVuaXRzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tYXhWZXJ0ZXhUZXh0dXJlVW5pdHM6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX21heFVuaWZvcm1CdWZmZXJCaW5kaW5nczogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfbWF4VW5pZm9ybUJsb2NrU2l6ZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfbWF4VGV4dHVyZVNpemU6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX21heEN1YmVNYXBUZXh0dXJlU2l6ZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfdWJvT2Zmc2V0QWxpZ25tZW50OiBudW1iZXIgPSAxO1xyXG4gICAgcHJvdGVjdGVkIF9kZXB0aEJpdHM6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX3N0ZW5jaWxCaXRzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9jb2xvckZtdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICBwcm90ZWN0ZWQgX2RlcHRoU3RlbmNpbEZtdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICBwcm90ZWN0ZWQgX21hY3JvczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcclxuICAgIHByb3RlY3RlZCBfbnVtRHJhd0NhbGxzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9udW1JbnN0YW5jZXM6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX251bVRyaXM6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX21lbW9yeVN0YXR1cyA9IG5ldyBHRlhNZW1vcnlTdGF0dXMoKTtcclxuICAgIHByb3RlY3RlZCBfY2xpcFNwYWNlTWluWiA9IC0xO1xyXG4gICAgcHJvdGVjdGVkIF9zY3JlZW5TcGFjZVNpZ25ZID0gMTtcclxuICAgIHByb3RlY3RlZCBfVVZTcGFjZVNpZ25ZID0gLTE7XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGluaXRpYWxpemUgKGluZm86IEdGWERldmljZUluZm8pOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXN0cm95ICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlc2l6ZSB0aGUgZGV2aWNlLlxyXG4gICAgICogQHpoIOmHjee9ruiuvuWkh+Wkp+Wwj+OAglxyXG4gICAgICogQHBhcmFtIHdpZHRoIFRoZSBkZXZpY2Ugd2lkdGguXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IFRoZSBkZXZpY2UgaGVpZ2h0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVzaXplICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQmVnaW4gY3VycmVudCBmcmFtZS5cclxuICAgICAqIEB6aCDlvIDlp4vlvZPliY3luKfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGFjcXVpcmUgKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHJlc2VudCBjdXJyZW50IGZyYW1lLlxyXG4gICAgICogQHpoIOWRiOeOsOW9k+WJjeW4p+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcHJlc2VudCAoKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgY29tbWFuZCBidWZmZXIuXHJcbiAgICAgKiBAemgg5Yib5bu65ZG95Luk57yT5Yay44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggY29tbWFuZCBidWZmZXIgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZUNvbW1hbmRCdWZmZXIgKGluZm86IEdGWENvbW1hbmRCdWZmZXJJbmZvKTogR0ZYQ29tbWFuZEJ1ZmZlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgYnVmZmVyLlxyXG4gICAgICogQHpoIOWIm+W7uue8k+WGsuOAglxyXG4gICAgICogQHBhcmFtIGluZm8gR0ZYIGJ1ZmZlciBkZXNjcmlwdGlvbiBpbmZvLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlQnVmZmVyIChpbmZvOiBHRlhCdWZmZXJJbmZvIHwgR0ZYQnVmZmVyVmlld0luZm8pOiBHRlhCdWZmZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ3JlYXRlIHRleHR1cmUuXHJcbiAgICAgKiBAemgg5Yib5bu657q555CG44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggdGV4dHVyZSBkZXNjcmlwdGlvbiBpbmZvLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlVGV4dHVyZSAoaW5mbzogR0ZYVGV4dHVyZUluZm8gfCBHRlhUZXh0dXJlVmlld0luZm8pOiBHRlhUZXh0dXJlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENyZWF0ZSBzYW1wbGVyLlxyXG4gICAgICogQHpoIOWIm+W7uumHh+agt+WZqOOAglxyXG4gICAgICogQHBhcmFtIGluZm8gR0ZYIHNhbXBsZXIgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZVNhbXBsZXIgKGluZm86IEdGWFNhbXBsZXJJbmZvKTogR0ZYU2FtcGxlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgZGVzY3JpcHRvciBzZXRzLlxyXG4gICAgICogQHpoIOWIm+W7uuaPj+i/sOespumbhue7hOOAglxyXG4gICAgICogQHBhcmFtIGluZm8gR0ZYIGRlc2NyaXB0b3Igc2V0cyBkZXNjcmlwdGlvbiBpbmZvLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlRGVzY3JpcHRvclNldCAoaW5mbzogR0ZYRGVzY3JpcHRvclNldEluZm8pOiBHRlhEZXNjcmlwdG9yU2V0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENyZWF0ZSBzaGFkZXIuXHJcbiAgICAgKiBAemgg5Yib5bu6552A6Imy5Zmo44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggc2hhZGVyIGRlc2NyaXB0aW9uIGluZm8uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjcmVhdGVTaGFkZXIgKGluZm86IEdGWFNoYWRlckluZm8pOiBHRlhTaGFkZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ3JlYXRlIGlucHV0IGFzc2VtYmxlci5cclxuICAgICAqIEB6aCDliJvlu7rnurnnkIbjgIJcclxuICAgICAqIEBwYXJhbSBpbmZvIEdGWCBpbnB1dCBhc3NlbWJsZXIgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZUlucHV0QXNzZW1ibGVyIChpbmZvOiBHRlhJbnB1dEFzc2VtYmxlckluZm8pOiBHRlhJbnB1dEFzc2VtYmxlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgcmVuZGVyIHBhc3MuXHJcbiAgICAgKiBAemgg5Yib5bu65riy5p+T6L+H56iL44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggcmVuZGVyIHBhc3MgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZVJlbmRlclBhc3MgKGluZm86IEdGWFJlbmRlclBhc3NJbmZvKTogR0ZYUmVuZGVyUGFzcztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgZnJhbWUgYnVmZmVyLlxyXG4gICAgICogQHpoIOWIm+W7uuW4p+e8k+WGsuOAglxyXG4gICAgICogQHBhcmFtIGluZm8gR0ZYIGZyYW1lIGJ1ZmZlciBkZXNjcmlwdGlvbiBpbmZvLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlRnJhbWVidWZmZXIgKGluZm86IEdGWEZyYW1lYnVmZmVySW5mbyk6IEdGWEZyYW1lYnVmZmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENyZWF0ZSBkZXNjcmlwdG9yIHNldCBsYXlvdXQuXHJcbiAgICAgKiBAemgg5Yib5bu65o+P6L+w56ym6ZuG5biD5bGA44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggZGVzY3JpcHRvciBzZXQgbGF5b3V0IGRlc2NyaXB0aW9uIGluZm8uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjcmVhdGVEZXNjcmlwdG9yU2V0TGF5b3V0IChpbmZvOiBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0SW5mbyk6IEdGWERlc2NyaXB0b3JTZXRMYXlvdXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ3JlYXRlIHBpcGVsaW5lIGxheW91dC5cclxuICAgICAqIEB6aCDliJvlu7rnrqHnur/luIPlsYDjgIJcclxuICAgICAqIEBwYXJhbSBpbmZvIEdGWCBwaXBlbGluZSBsYXlvdXQgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZVBpcGVsaW5lTGF5b3V0IChpbmZvOiBHRlhQaXBlbGluZUxheW91dEluZm8pOiBHRlhQaXBlbGluZUxheW91dDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgcGlwZWxpbmUgc3RhdGUuXHJcbiAgICAgKiBAemgg5Yib5bu6566h57q/54q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggcGlwZWxpbmUgc3RhdGUgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZVBpcGVsaW5lU3RhdGUgKGluZm86IEdGWFBpcGVsaW5lU3RhdGVJbmZvKTogR0ZYUGlwZWxpbmVTdGF0ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgcXVldWUuXHJcbiAgICAgKiBAemgg5Yib5bu66Zif5YiX44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggcXVldWUgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZVF1ZXVlIChpbmZvOiBHRlhRdWV1ZUluZm8pOiBHRlhRdWV1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDcmVhdGUgZmVuY2UuXHJcbiAgICAgKiBAemgg5Yib5bu65ZCM5q2l5L+h5Y+344CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBHRlggZmVuY2UgZGVzY3JpcHRpb24gaW5mby5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZUZlbmNlIChpbmZvOiBHRlhGZW5jZUluZm8pOiBHRlhGZW5jZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDb3B5IGJ1ZmZlcnMgdG8gdGV4dHVyZS5cclxuICAgICAqIEB6aCDmi7fotJ3nvJPlhrLliLDnurnnkIbjgIJcclxuICAgICAqIEBwYXJhbSBidWZmZXJzIFRoZSBidWZmZXJzIHRvIGJlIGNvcGllZC5cclxuICAgICAqIEBwYXJhbSB0ZXh0dXJlIFRoZSB0ZXh0dXJlIHRvIGNvcHkgdG8uXHJcbiAgICAgKiBAcGFyYW0gcmVnaW9ucyBUaGUgcmVnaW9uIGRlc2NyaXB0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNvcHlCdWZmZXJzVG9UZXh0dXJlIChidWZmZXJzOiBBcnJheUJ1ZmZlclZpZXdbXSwgdGV4dHVyZTogR0ZYVGV4dHVyZSwgcmVnaW9uczogR0ZYQnVmZmVyVGV4dHVyZUNvcHlbXSk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ29weSB0ZXh0dXJlIGltYWdlcyB0byB0ZXh0dXJlLlxyXG4gICAgICogQHpoIOaLt+i0neWbvuWDj+WIsOe6ueeQhuOAglxyXG4gICAgICogQHBhcmFtIHRleEltYWdlcyBUaGUgdGV4dHVyZSB0byBiZSBjb3BpZWQuXHJcbiAgICAgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSB0byBjb3B5IHRvLlxyXG4gICAgICogQHBhcmFtIHJlZ2lvbnMgVGhlIHJlZ2lvbiBkZXNjcmlwdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjb3B5VGV4SW1hZ2VzVG9UZXh0dXJlICh0ZXhJbWFnZXM6IFRleEltYWdlU291cmNlW10sIHRleHR1cmU6IEdGWFRleHR1cmUsIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvcHkgZnJhbWUgYnVmZmVyIHRvIGJ1ZmZlci5cclxuICAgICAqIEB6aCDmi7fotJ3luKfnvJPlhrLliLDnvJPlhrLjgIJcclxuICAgICAqIEBwYXJhbSBzcmNGcmFtZWJ1ZmZlciBUaGUgZnJhbWUgYnVmZmVyIHRvIGJlIGNvcGllZC5cclxuICAgICAqIEBwYXJhbSBkc3RCdWZmZXIgVGhlIGJ1ZmZlciB0byBjb3B5IHRvLlxyXG4gICAgICogQHBhcmFtIHJlZ2lvbnMgVGhlIHJlZ2lvbiBkZXNjcmlwdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjb3B5RnJhbWVidWZmZXJUb0J1ZmZlciAoc3JjRnJhbWVidWZmZXI6IEdGWEZyYW1lYnVmZmVyLCBkc3RCdWZmZXI6IEFycmF5QnVmZmVyLCByZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCbGl0IGZyYW1lIGJ1ZmZlcnMuXHJcbiAgICAgKiBAemgg5aGr5YWF5bin57yT5Yay44CCXHJcbiAgICAgKiBAcGFyYW0gc3JjIFRoZSBzb3VyY2UgZnJhbWUgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIGRzdCBUaGUgZGVzdGluYXRpb24gZnJhbWUgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHNyY1JlY3QgVGhlIHNvdXJjZSByZWdpb24uXHJcbiAgICAgKiBAcGFyYW0gZHN0UmVjdCBUaGUgdGFyZ2V0IHJlZ2lvbi5cclxuICAgICAqIEBwYXJhbSBmaWx0ZXIgRmlsdGVyaW5nIG1vZGUgZm9yIHRoZSBwcm9jZXNzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYmxpdEZyYW1lYnVmZmVyIChzcmM6IEdGWEZyYW1lYnVmZmVyLCBkc3Q6IEdGWEZyYW1lYnVmZmVyLCBzcmNSZWN0OiBHRlhSZWN0LCBkc3RSZWN0OiBHRlhSZWN0LCBmaWx0ZXI6IEdGWEZpbHRlcik6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2hldGhlciB0aGUgZGV2aWNlIGhhcyBzcGVjaWZpYyBmZWF0dXJlLlxyXG4gICAgICogQHpoIOaYr+WQpuWFt+Wkh+eJueaAp+OAglxyXG4gICAgICogQHBhcmFtIGZlYXR1cmUgVGhlIEdGWCBmZWF0dXJlIHRvIGJlIHF1ZXJpZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYXNGZWF0dXJlIChmZWF0dXJlOiBHRlhGZWF0dXJlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZlYXR1cmVzW2ZlYXR1cmVdO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==