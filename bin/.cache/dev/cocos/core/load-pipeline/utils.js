(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.urlAppendTimestamp = urlAppendTimestamp;
  _exports.decompressJson = decompressJson;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * @hidden
   */
  var _noCacheRex = /\?/;

  function urlAppendTimestamp(url) {
    if (_globalExports.legacyCC.game.config['noCache'] && typeof url === 'string') {
      if (_noCacheRex.test(url)) //@ts-ignore
        url += '&_t=' + (new Date() - 0);else //@ts-ignore
        url += '?_t=' + (new Date() - 0);
    }

    return url;
  }

  function decompressJson(data, keys) {
    if (Array.isArray(data)) {
      for (var i = 0, l = data.length; i < l; i++) {
        decompressJson(data[i], keys);
      }
    } else if (_typeof(data) === 'object') {
      for (var key in data) {
        decompressJson(data[key], keys);

        if (!Number.isNaN(Number(key))) {
          data[keys[key]] = data[key];
          delete data[key];
        }
      }
    }

    return null;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS91dGlscy50cyJdLCJuYW1lcyI6WyJfbm9DYWNoZVJleCIsInVybEFwcGVuZFRpbWVzdGFtcCIsInVybCIsImxlZ2FjeUNDIiwiZ2FtZSIsImNvbmZpZyIsInRlc3QiLCJEYXRlIiwiZGVjb21wcmVzc0pzb24iLCJkYXRhIiwia2V5cyIsIkFycmF5IiwiaXNBcnJheSIsImkiLCJsIiwibGVuZ3RoIiwia2V5IiwiTnVtYmVyIiwiaXNOYU4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBOzs7QUFJQSxNQUFJQSxXQUFXLEdBQUcsSUFBbEI7O0FBRU8sV0FBU0Msa0JBQVQsQ0FBNkJDLEdBQTdCLEVBQWtDO0FBQ3JDLFFBQUlDLHdCQUFTQyxJQUFULENBQWNDLE1BQWQsQ0FBcUIsU0FBckIsS0FBbUMsT0FBT0gsR0FBUCxLQUFlLFFBQXRELEVBQWdFO0FBQzVELFVBQUlGLFdBQVcsQ0FBQ00sSUFBWixDQUFpQkosR0FBakIsQ0FBSixFQUNJO0FBQ0FBLFFBQUFBLEdBQUcsSUFBSSxVQUFVLElBQUlLLElBQUosS0FBYSxDQUF2QixDQUFQLENBRkosS0FJSTtBQUNBTCxRQUFBQSxHQUFHLElBQUksVUFBVSxJQUFJSyxJQUFKLEtBQWEsQ0FBdkIsQ0FBUDtBQUNQOztBQUNELFdBQU9MLEdBQVA7QUFDSDs7QUFHTSxXQUFTTSxjQUFULENBQXlCQyxJQUF6QixFQUErQkMsSUFBL0IsRUFBcUM7QUFDeEMsUUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNILElBQWQsQ0FBSixFQUF5QjtBQUNyQixXQUFLLElBQUlJLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBR0wsSUFBSSxDQUFDTSxNQUF6QixFQUFpQ0YsQ0FBQyxHQUFHQyxDQUFyQyxFQUF3Q0QsQ0FBQyxFQUF6QyxFQUE2QztBQUN6Q0wsUUFBQUEsY0FBYyxDQUFDQyxJQUFJLENBQUNJLENBQUQsQ0FBTCxFQUFVSCxJQUFWLENBQWQ7QUFDSDtBQUNKLEtBSkQsTUFJTyxJQUFJLFFBQU9ELElBQVAsTUFBZ0IsUUFBcEIsRUFBOEI7QUFDakMsV0FBSyxJQUFJTyxHQUFULElBQWdCUCxJQUFoQixFQUFzQjtBQUNsQkQsUUFBQUEsY0FBYyxDQUFDQyxJQUFJLENBQUNPLEdBQUQsQ0FBTCxFQUFZTixJQUFaLENBQWQ7O0FBQ0EsWUFBSSxDQUFDTyxNQUFNLENBQUNDLEtBQVAsQ0FBYUQsTUFBTSxDQUFDRCxHQUFELENBQW5CLENBQUwsRUFBZ0M7QUFDNUJQLFVBQUFBLElBQUksQ0FBQ0MsSUFBSSxDQUFDTSxHQUFELENBQUwsQ0FBSixHQUFrQlAsSUFBSSxDQUFDTyxHQUFELENBQXRCO0FBQ0EsaUJBQU9QLElBQUksQ0FBQ08sR0FBRCxDQUFYO0FBQ0g7QUFDSjtBQUNKOztBQUNELFdBQU8sSUFBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmxldCBfbm9DYWNoZVJleCA9IC9cXD8vO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVybEFwcGVuZFRpbWVzdGFtcCAodXJsKSB7XHJcbiAgICBpZiAobGVnYWN5Q0MuZ2FtZS5jb25maWdbJ25vQ2FjaGUnXSAmJiB0eXBlb2YgdXJsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGlmIChfbm9DYWNoZVJleC50ZXN0KHVybCkpXHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB1cmwgKz0gJyZfdD0nICsgKG5ldyBEYXRlKCkgLSAwKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB1cmwgKz0gJz9fdD0nICsgKG5ldyBEYXRlKCkgLSAwKTtcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVjb21wcmVzc0pzb24gKGRhdGEsIGtleXMpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBkZWNvbXByZXNzSnNvbihkYXRhW2ldLCBrZXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGRlY29tcHJlc3NKc29uKGRhdGFba2V5XSwga2V5cyk7XHJcbiAgICAgICAgICAgIGlmICghTnVtYmVyLmlzTmFOKE51bWJlcihrZXkpKSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtrZXlzW2tleV1dID0gZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59Il19