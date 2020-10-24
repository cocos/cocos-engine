(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js", "../../gfx/sampler.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"), require("../../gfx/sampler.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.sampler, global.globalExports);
    global.samplerLib = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _sampler, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.genSamplerHash = genSamplerHash;
  _exports.samplerLib = _exports.defaultSamplerHash = _exports.SamplerInfoIndex = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var SamplerInfoIndex;
  _exports.SamplerInfoIndex = SamplerInfoIndex;

  (function (SamplerInfoIndex) {
    SamplerInfoIndex[SamplerInfoIndex["minFilter"] = 0] = "minFilter";
    SamplerInfoIndex[SamplerInfoIndex["magFilter"] = 1] = "magFilter";
    SamplerInfoIndex[SamplerInfoIndex["mipFilter"] = 2] = "mipFilter";
    SamplerInfoIndex[SamplerInfoIndex["addressU"] = 3] = "addressU";
    SamplerInfoIndex[SamplerInfoIndex["addressV"] = 4] = "addressV";
    SamplerInfoIndex[SamplerInfoIndex["addressW"] = 5] = "addressW";
    SamplerInfoIndex[SamplerInfoIndex["maxAnisotropy"] = 6] = "maxAnisotropy";
    SamplerInfoIndex[SamplerInfoIndex["cmpFunc"] = 7] = "cmpFunc";
    SamplerInfoIndex[SamplerInfoIndex["minLOD"] = 8] = "minLOD";
    SamplerInfoIndex[SamplerInfoIndex["maxLOD"] = 9] = "maxLOD";
    SamplerInfoIndex[SamplerInfoIndex["mipLODBias"] = 10] = "mipLODBias";
    SamplerInfoIndex[SamplerInfoIndex["total"] = 11] = "total";
  })(SamplerInfoIndex || (_exports.SamplerInfoIndex = SamplerInfoIndex = {}));

  var defaultInfo = [_define.GFXFilter.LINEAR, _define.GFXFilter.LINEAR, _define.GFXFilter.NONE, _define.GFXAddress.WRAP, _define.GFXAddress.WRAP, _define.GFXAddress.WRAP, 8, _define.GFXComparisonFunc.NEVER, 0, 0, 0];
  var defaultSamplerHash = genSamplerHash(defaultInfo);
  _exports.defaultSamplerHash = defaultSamplerHash;
  var borderColor = new _define.GFXColor();

  var _samplerInfo = new _sampler.GFXSamplerInfo();

  function genSamplerHash(info) {
    var value = 0;
    var hash = 0;

    for (var i = 0; i < defaultInfo.length; i++) {
      value = info[i] || defaultInfo[i];

      switch (i) {
        case SamplerInfoIndex.minFilter:
          hash |= value;
          break;

        case SamplerInfoIndex.magFilter:
          hash |= value << 2;
          break;

        case SamplerInfoIndex.mipFilter:
          hash |= value << 4;
          break;

        case SamplerInfoIndex.addressU:
          hash |= value << 6;
          break;

        case SamplerInfoIndex.addressV:
          hash |= value << 8;
          break;

        case SamplerInfoIndex.addressW:
          hash |= value << 10;
          break;

        case SamplerInfoIndex.maxAnisotropy:
          hash |= value << 12;
          break;

        case SamplerInfoIndex.cmpFunc:
          hash |= value << 16;
          break;

        case SamplerInfoIndex.minLOD:
          hash |= value << 20;
          break;

        case SamplerInfoIndex.maxLOD:
          hash |= value << 24;
          break;

        case SamplerInfoIndex.mipLODBias:
          hash |= value << 28;
          break;
      }
    }

    return hash;
  }
  /**
   * @zh
   * 维护 sampler 资源实例的全局管理器。
   */


  var SamplerLib = /*#__PURE__*/function () {
    function SamplerLib() {
      _classCallCheck(this, SamplerLib);

      this._cache = {};
    }

    _createClass(SamplerLib, [{
      key: "getSampler",

      /**
       * @zh
       * 获取指定属性的 sampler 资源。
       * @param device 渲染设备 [GFXDevice]
       * @param info 目标 sampler 属性
       */
      value: function getSampler(device, hash) {
        if (hash === 0) {
          hash = defaultSamplerHash;
        }

        var cache = this._cache[hash];

        if (cache) {
          return cache;
        }

        _samplerInfo.minFilter = hash & 3;
        _samplerInfo.magFilter = hash >> 2 & 3;
        _samplerInfo.mipFilter = hash >> 4 & 3;
        _samplerInfo.addressU = hash >> 6 & 3;
        _samplerInfo.addressV = hash >> 8 & 3;
        _samplerInfo.addressW = hash >> 10 & 3;
        _samplerInfo.maxAnisotropy = hash >> 12 & 15;
        _samplerInfo.cmpFunc = hash >> 16 & 15;
        _samplerInfo.minLOD = hash >> 20 & 15;
        _samplerInfo.maxLOD = hash >> 24 & 15;
        _samplerInfo.mipLODBias = hash >> 28 & 15;
        _samplerInfo.borderColor = borderColor;
        var sampler = this._cache[hash] = device.createSampler(_samplerInfo);
        return sampler;
      }
    }]);

    return SamplerLib;
  }();

  var samplerLib = new SamplerLib();
  _exports.samplerLib = samplerLib;
  _globalExports.legacyCC.samplerLib = samplerLib;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9zYW1wbGVyLWxpYi50cyJdLCJuYW1lcyI6WyJTYW1wbGVySW5mb0luZGV4IiwiZGVmYXVsdEluZm8iLCJHRlhGaWx0ZXIiLCJMSU5FQVIiLCJOT05FIiwiR0ZYQWRkcmVzcyIsIldSQVAiLCJHRlhDb21wYXJpc29uRnVuYyIsIk5FVkVSIiwiZGVmYXVsdFNhbXBsZXJIYXNoIiwiZ2VuU2FtcGxlckhhc2giLCJib3JkZXJDb2xvciIsIkdGWENvbG9yIiwiX3NhbXBsZXJJbmZvIiwiR0ZYU2FtcGxlckluZm8iLCJpbmZvIiwidmFsdWUiLCJoYXNoIiwiaSIsImxlbmd0aCIsIm1pbkZpbHRlciIsIm1hZ0ZpbHRlciIsIm1pcEZpbHRlciIsImFkZHJlc3NVIiwiYWRkcmVzc1YiLCJhZGRyZXNzVyIsIm1heEFuaXNvdHJvcHkiLCJjbXBGdW5jIiwibWluTE9EIiwibWF4TE9EIiwibWlwTE9EQmlhcyIsIlNhbXBsZXJMaWIiLCJfY2FjaGUiLCJkZXZpY2UiLCJjYWNoZSIsInNhbXBsZXIiLCJjcmVhdGVTYW1wbGVyIiwic2FtcGxlckxpYiIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFrQ1lBLGdCOzs7YUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7S0FBQUEsZ0IsaUNBQUFBLGdCOztBQWVaLE1BQU1DLFdBQVcsR0FBRyxDQUNsQkMsa0JBQVVDLE1BRFEsRUFFbEJELGtCQUFVQyxNQUZRLEVBR2xCRCxrQkFBVUUsSUFIUSxFQUlsQkMsbUJBQVdDLElBSk8sRUFLbEJELG1CQUFXQyxJQUxPLEVBTWxCRCxtQkFBV0MsSUFOTyxFQU9sQixDQVBrQixFQVFsQkMsMEJBQWtCQyxLQVJBLEVBU2xCLENBVGtCLEVBU2YsQ0FUZSxFQVNaLENBVFksQ0FBcEI7QUFXTyxNQUFNQyxrQkFBa0IsR0FBR0MsY0FBYyxDQUFDVCxXQUFELENBQXpDOztBQUVQLE1BQU1VLFdBQVcsR0FBRyxJQUFJQyxnQkFBSixFQUFwQjs7QUFFQSxNQUFNQyxZQUFZLEdBQUcsSUFBSUMsdUJBQUosRUFBckI7O0FBRU8sV0FBU0osY0FBVCxDQUF5QkssSUFBekIsRUFBK0Q7QUFDbEUsUUFBSUMsS0FBSyxHQUFHLENBQVo7QUFDQSxRQUFJQyxJQUFJLEdBQUcsQ0FBWDs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixXQUFXLENBQUNrQixNQUFoQyxFQUF3Q0QsQ0FBQyxFQUF6QyxFQUE2QztBQUN6Q0YsTUFBQUEsS0FBSyxHQUFJRCxJQUFJLENBQUNHLENBQUQsQ0FBSixJQUFXakIsV0FBVyxDQUFDaUIsQ0FBRCxDQUEvQjs7QUFDQSxjQUFRQSxDQUFSO0FBQ0ksYUFBS2xCLGdCQUFnQixDQUFDb0IsU0FBdEI7QUFBaUNILFVBQUFBLElBQUksSUFBSUQsS0FBUjtBQUFlOztBQUNoRCxhQUFLaEIsZ0JBQWdCLENBQUNxQixTQUF0QjtBQUFpQ0osVUFBQUEsSUFBSSxJQUFLRCxLQUFLLElBQUksQ0FBbEI7QUFBc0I7O0FBQ3ZELGFBQUtoQixnQkFBZ0IsQ0FBQ3NCLFNBQXRCO0FBQWlDTCxVQUFBQSxJQUFJLElBQUtELEtBQUssSUFBSSxDQUFsQjtBQUFzQjs7QUFDdkQsYUFBS2hCLGdCQUFnQixDQUFDdUIsUUFBdEI7QUFBZ0NOLFVBQUFBLElBQUksSUFBS0QsS0FBSyxJQUFJLENBQWxCO0FBQXNCOztBQUN0RCxhQUFLaEIsZ0JBQWdCLENBQUN3QixRQUF0QjtBQUFnQ1AsVUFBQUEsSUFBSSxJQUFLRCxLQUFLLElBQUksQ0FBbEI7QUFBc0I7O0FBQ3RELGFBQUtoQixnQkFBZ0IsQ0FBQ3lCLFFBQXRCO0FBQWdDUixVQUFBQSxJQUFJLElBQUtELEtBQUssSUFBSSxFQUFsQjtBQUF1Qjs7QUFDdkQsYUFBS2hCLGdCQUFnQixDQUFDMEIsYUFBdEI7QUFBcUNULFVBQUFBLElBQUksSUFBS0QsS0FBSyxJQUFJLEVBQWxCO0FBQXVCOztBQUM1RCxhQUFLaEIsZ0JBQWdCLENBQUMyQixPQUF0QjtBQUErQlYsVUFBQUEsSUFBSSxJQUFLRCxLQUFLLElBQUksRUFBbEI7QUFBdUI7O0FBQ3RELGFBQUtoQixnQkFBZ0IsQ0FBQzRCLE1BQXRCO0FBQThCWCxVQUFBQSxJQUFJLElBQUtELEtBQUssSUFBSSxFQUFsQjtBQUF1Qjs7QUFDckQsYUFBS2hCLGdCQUFnQixDQUFDNkIsTUFBdEI7QUFBOEJaLFVBQUFBLElBQUksSUFBS0QsS0FBSyxJQUFJLEVBQWxCO0FBQXVCOztBQUNyRCxhQUFLaEIsZ0JBQWdCLENBQUM4QixVQUF0QjtBQUFrQ2IsVUFBQUEsSUFBSSxJQUFLRCxLQUFLLElBQUksRUFBbEI7QUFBdUI7QUFYN0Q7QUFhSDs7QUFDRCxXQUFPQyxJQUFQO0FBQ0g7QUFFRDs7Ozs7O01BSU1jLFU7Ozs7V0FFUUMsTSxHQUFxQyxFOzs7Ozs7QUFFL0M7Ozs7OztpQ0FNbUJDLE0sRUFBbUJoQixJLEVBQWM7QUFDaEQsWUFBSUEsSUFBSSxLQUFLLENBQWIsRUFBZ0I7QUFBRUEsVUFBQUEsSUFBSSxHQUFHUixrQkFBUDtBQUE0Qjs7QUFDOUMsWUFBTXlCLEtBQUssR0FBRyxLQUFLRixNQUFMLENBQVlmLElBQVosQ0FBZDs7QUFDQSxZQUFJaUIsS0FBSixFQUFXO0FBQUUsaUJBQU9BLEtBQVA7QUFBZTs7QUFFNUJyQixRQUFBQSxZQUFZLENBQUNPLFNBQWIsR0FBOEJILElBQUksR0FBRyxDQUFyQztBQUNBSixRQUFBQSxZQUFZLENBQUNRLFNBQWIsR0FBK0JKLElBQUksSUFBSSxDQUFULEdBQWMsQ0FBNUM7QUFDQUosUUFBQUEsWUFBWSxDQUFDUyxTQUFiLEdBQStCTCxJQUFJLElBQUksQ0FBVCxHQUFjLENBQTVDO0FBQ0FKLFFBQUFBLFlBQVksQ0FBQ1UsUUFBYixHQUErQk4sSUFBSSxJQUFJLENBQVQsR0FBYyxDQUE1QztBQUNBSixRQUFBQSxZQUFZLENBQUNXLFFBQWIsR0FBK0JQLElBQUksSUFBSSxDQUFULEdBQWMsQ0FBNUM7QUFDQUosUUFBQUEsWUFBWSxDQUFDWSxRQUFiLEdBQStCUixJQUFJLElBQUksRUFBVCxHQUFlLENBQTdDO0FBQ0FKLFFBQUFBLFlBQVksQ0FBQ2EsYUFBYixHQUErQlQsSUFBSSxJQUFJLEVBQVQsR0FBZSxFQUE3QztBQUNBSixRQUFBQSxZQUFZLENBQUNjLE9BQWIsR0FBK0JWLElBQUksSUFBSSxFQUFULEdBQWUsRUFBN0M7QUFDQUosUUFBQUEsWUFBWSxDQUFDZSxNQUFiLEdBQStCWCxJQUFJLElBQUksRUFBVCxHQUFlLEVBQTdDO0FBQ0FKLFFBQUFBLFlBQVksQ0FBQ2dCLE1BQWIsR0FBK0JaLElBQUksSUFBSSxFQUFULEdBQWUsRUFBN0M7QUFDQUosUUFBQUEsWUFBWSxDQUFDaUIsVUFBYixHQUErQmIsSUFBSSxJQUFJLEVBQVQsR0FBZSxFQUE3QztBQUNBSixRQUFBQSxZQUFZLENBQUNGLFdBQWIsR0FBNkJBLFdBQTdCO0FBRUEsWUFBTXdCLE9BQU8sR0FBRyxLQUFLSCxNQUFMLENBQVlmLElBQVosSUFBb0JnQixNQUFNLENBQUNHLGFBQVAsQ0FBcUJ2QixZQUFyQixDQUFwQztBQUNBLGVBQU9zQixPQUFQO0FBQ0g7Ozs7OztBQUdFLE1BQU1FLFVBQVUsR0FBRyxJQUFJTixVQUFKLEVBQW5COztBQUNQTywwQkFBU0QsVUFBVCxHQUFzQkEsVUFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWEFkZHJlc3MsIEdGWENvbXBhcmlzb25GdW5jLCBHRlhGaWx0ZXIsIEdGWENvbG9yIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4uLy4uL2dmeC9kZXZpY2UnO1xyXG5pbXBvcnQgeyBHRlhTYW1wbGVyLCBHRlhTYW1wbGVySW5mbyB9IGZyb20gJy4uLy4uL2dmeC9zYW1wbGVyJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQgZW51bSBTYW1wbGVySW5mb0luZGV4IHtcclxuICAgIG1pbkZpbHRlcixcclxuICAgIG1hZ0ZpbHRlcixcclxuICAgIG1pcEZpbHRlcixcclxuICAgIGFkZHJlc3NVLFxyXG4gICAgYWRkcmVzc1YsXHJcbiAgICBhZGRyZXNzVyxcclxuICAgIG1heEFuaXNvdHJvcHksXHJcbiAgICBjbXBGdW5jLFxyXG4gICAgbWluTE9ELFxyXG4gICAgbWF4TE9ELFxyXG4gICAgbWlwTE9EQmlhcyxcclxuICAgIHRvdGFsLFxyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0SW5mbyA9IFtcclxuICBHRlhGaWx0ZXIuTElORUFSLFxyXG4gIEdGWEZpbHRlci5MSU5FQVIsXHJcbiAgR0ZYRmlsdGVyLk5PTkUsXHJcbiAgR0ZYQWRkcmVzcy5XUkFQLFxyXG4gIEdGWEFkZHJlc3MuV1JBUCxcclxuICBHRlhBZGRyZXNzLldSQVAsXHJcbiAgOCxcclxuICBHRlhDb21wYXJpc29uRnVuYy5ORVZFUixcclxuICAwLCAwLCAwLFxyXG5dO1xyXG5leHBvcnQgY29uc3QgZGVmYXVsdFNhbXBsZXJIYXNoID0gZ2VuU2FtcGxlckhhc2goZGVmYXVsdEluZm8pO1xyXG5cclxuY29uc3QgYm9yZGVyQ29sb3IgPSBuZXcgR0ZYQ29sb3IoKTtcclxuXHJcbmNvbnN0IF9zYW1wbGVySW5mbyA9IG5ldyBHRlhTYW1wbGVySW5mbygpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblNhbXBsZXJIYXNoIChpbmZvOiAobnVtYmVyIHwgdW5kZWZpbmVkKVtdKTogbnVtYmVyIHtcclxuICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICBsZXQgaGFzaCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlZmF1bHRJbmZvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUgPSAoaW5mb1tpXSB8fCBkZWZhdWx0SW5mb1tpXSk7XHJcbiAgICAgICAgc3dpdGNoIChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgU2FtcGxlckluZm9JbmRleC5taW5GaWx0ZXI6IGhhc2ggfD0gdmFsdWU7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNhbXBsZXJJbmZvSW5kZXgubWFnRmlsdGVyOiBoYXNoIHw9ICh2YWx1ZSA8PCAyKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU2FtcGxlckluZm9JbmRleC5taXBGaWx0ZXI6IGhhc2ggfD0gKHZhbHVlIDw8IDQpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTYW1wbGVySW5mb0luZGV4LmFkZHJlc3NVOiBoYXNoIHw9ICh2YWx1ZSA8PCA2KTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU2FtcGxlckluZm9JbmRleC5hZGRyZXNzVjogaGFzaCB8PSAodmFsdWUgPDwgOCk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNhbXBsZXJJbmZvSW5kZXguYWRkcmVzc1c6IGhhc2ggfD0gKHZhbHVlIDw8IDEwKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU2FtcGxlckluZm9JbmRleC5tYXhBbmlzb3Ryb3B5OiBoYXNoIHw9ICh2YWx1ZSA8PCAxMik7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNhbXBsZXJJbmZvSW5kZXguY21wRnVuYzogaGFzaCB8PSAodmFsdWUgPDwgMTYpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTYW1wbGVySW5mb0luZGV4Lm1pbkxPRDogaGFzaCB8PSAodmFsdWUgPDwgMjApOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTYW1wbGVySW5mb0luZGV4Lm1heExPRDogaGFzaCB8PSAodmFsdWUgPDwgMjQpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTYW1wbGVySW5mb0luZGV4Lm1pcExPREJpYXM6IGhhc2ggfD0gKHZhbHVlIDw8IDI4KTsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhhc2g7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog57u05oqkIHNhbXBsZXIg6LWE5rqQ5a6e5L6L55qE5YWo5bGA566h55CG5Zmo44CCXHJcbiAqL1xyXG5jbGFzcyBTYW1wbGVyTGliIHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NhY2hlOiBSZWNvcmQ8bnVtYmVyLCBHRlhTYW1wbGVyPiA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmjIflrprlsZ7mgKfnmoQgc2FtcGxlciDotYTmupDjgIJcclxuICAgICAqIEBwYXJhbSBkZXZpY2Ug5riy5p+T6K6+5aSHIFtHRlhEZXZpY2VdXHJcbiAgICAgKiBAcGFyYW0gaW5mbyDnm67moIcgc2FtcGxlciDlsZ7mgKdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNhbXBsZXIgKGRldmljZTogR0ZYRGV2aWNlLCBoYXNoOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaGFzaCA9PT0gMCkgeyBoYXNoID0gZGVmYXVsdFNhbXBsZXJIYXNoOyB9XHJcbiAgICAgICAgY29uc3QgY2FjaGUgPSB0aGlzLl9jYWNoZVtoYXNoXTtcclxuICAgICAgICBpZiAoY2FjaGUpIHsgcmV0dXJuIGNhY2hlOyB9XHJcblxyXG4gICAgICAgIF9zYW1wbGVySW5mby5taW5GaWx0ZXIgICAgID0gKGhhc2ggJiAzKTtcclxuICAgICAgICBfc2FtcGxlckluZm8ubWFnRmlsdGVyICAgICA9ICgoaGFzaCA+PiAyKSAmIDMpO1xyXG4gICAgICAgIF9zYW1wbGVySW5mby5taXBGaWx0ZXIgICAgID0gKChoYXNoID4+IDQpICYgMyk7XHJcbiAgICAgICAgX3NhbXBsZXJJbmZvLmFkZHJlc3NVICAgICAgPSAoKGhhc2ggPj4gNikgJiAzKTtcclxuICAgICAgICBfc2FtcGxlckluZm8uYWRkcmVzc1YgICAgICA9ICgoaGFzaCA+PiA4KSAmIDMpO1xyXG4gICAgICAgIF9zYW1wbGVySW5mby5hZGRyZXNzVyAgICAgID0gKChoYXNoID4+IDEwKSAmIDMpO1xyXG4gICAgICAgIF9zYW1wbGVySW5mby5tYXhBbmlzb3Ryb3B5ID0gKChoYXNoID4+IDEyKSAmIDE1KTtcclxuICAgICAgICBfc2FtcGxlckluZm8uY21wRnVuYyAgICAgICA9ICgoaGFzaCA+PiAxNikgJiAxNSk7XHJcbiAgICAgICAgX3NhbXBsZXJJbmZvLm1pbkxPRCAgICAgICAgPSAoKGhhc2ggPj4gMjApICYgMTUpO1xyXG4gICAgICAgIF9zYW1wbGVySW5mby5tYXhMT0QgICAgICAgID0gKChoYXNoID4+IDI0KSAmIDE1KTtcclxuICAgICAgICBfc2FtcGxlckluZm8ubWlwTE9EQmlhcyAgICA9ICgoaGFzaCA+PiAyOCkgJiAxNSk7XHJcbiAgICAgICAgX3NhbXBsZXJJbmZvLmJvcmRlckNvbG9yICAgPSBib3JkZXJDb2xvcjtcclxuXHJcbiAgICAgICAgY29uc3Qgc2FtcGxlciA9IHRoaXMuX2NhY2hlW2hhc2hdID0gZGV2aWNlLmNyZWF0ZVNhbXBsZXIoX3NhbXBsZXJJbmZvKTtcclxuICAgICAgICByZXR1cm4gc2FtcGxlcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNhbXBsZXJMaWIgPSBuZXcgU2FtcGxlckxpYigpO1xyXG5sZWdhY3lDQy5zYW1wbGVyTGliID0gc2FtcGxlckxpYjtcclxuIl19