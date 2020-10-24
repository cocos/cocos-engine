(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./url.js", "./downloader.js", "./loader.js", "./loading-items.js", "./pipeline.js", "./CCLoader.js", "./callback-params.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./url.js"), require("./downloader.js"), require("./loader.js"), require("./loading-items.js"), require("./pipeline.js"), require("./CCLoader.js"), require("./callback-params.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.url, global.downloader, global.loader, global.loadingItems, global.pipeline, global.CCLoader, global.callbackParams);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _url, _downloader, _loader, _loadingItems, _pipeline, _CCLoader, _callbackParams) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    url: true,
    Downloader: true,
    Loader: true,
    Pipeline: true,
    loader: true
  };
  Object.defineProperty(_exports, "url", {
    enumerable: true,
    get: function () {
      return _url.default;
    }
  });
  Object.defineProperty(_exports, "Downloader", {
    enumerable: true,
    get: function () {
      return _downloader.default;
    }
  });
  Object.defineProperty(_exports, "Loader", {
    enumerable: true,
    get: function () {
      return _loader.default;
    }
  });
  Object.defineProperty(_exports, "Pipeline", {
    enumerable: true,
    get: function () {
      return _pipeline.Pipeline;
    }
  });
  Object.defineProperty(_exports, "loader", {
    enumerable: true,
    get: function () {
      return _CCLoader.loader;
    }
  });
  _url = _interopRequireDefault(_url);
  _downloader = _interopRequireDefault(_downloader);
  _loader = _interopRequireDefault(_loader);
  Object.keys(_loadingItems).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _loadingItems[key];
      }
    });
  });
  Object.keys(_callbackParams).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _callbackParams[key];
      }
    });
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmV4cG9ydCB7ZGVmYXVsdCBhcyB1cmx9IGZyb20gJy4vdXJsJztcclxuZXhwb3J0IHtkZWZhdWx0IGFzIERvd25sb2FkZXJ9IGZyb20gJy4vZG93bmxvYWRlcic7XHJcbmV4cG9ydCB7ZGVmYXVsdCBhcyBMb2FkZXJ9IGZyb20gJy4vbG9hZGVyJztcclxuZXhwb3J0ICogZnJvbSAnLi9sb2FkaW5nLWl0ZW1zJztcclxuZXhwb3J0IHsgUGlwZWxpbmUgfSBmcm9tICcuL3BpcGVsaW5lJztcclxuZXhwb3J0IHsgbG9hZGVyIH0gZnJvbSAnLi9DQ0xvYWRlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vY2FsbGJhY2stcGFyYW1zJztcclxuIl19