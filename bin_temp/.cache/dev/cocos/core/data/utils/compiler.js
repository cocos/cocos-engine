(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants);
    global.compiler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.flattenCodeArray = flattenCodeArray;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function deepFlatten(strList, array) {
    var _iterator = _createForOfIteratorHelper(array),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;

        if (Array.isArray(item)) {
          deepFlatten(strList, item);
        } // else if (item instanceof Declaration) {
        //     strList.push(item.toString());
        // }
        else {
            strList.push(item);
          }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  function flattenCodeArray(array) {
    var separator = _defaultConstants.DEV ? '\n' : '';
    var strList = [];
    deepFlatten(strList, array);
    return strList.join(separator);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9jb21waWxlci50cyJdLCJuYW1lcyI6WyJkZWVwRmxhdHRlbiIsInN0ckxpc3QiLCJhcnJheSIsIml0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwiZmxhdHRlbkNvZGVBcnJheSIsInNlcGFyYXRvciIsIkRFViIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLFdBQVNBLFdBQVQsQ0FBc0JDLE9BQXRCLEVBQStCQyxLQUEvQixFQUFzQztBQUFBLCtDQUNmQSxLQURlO0FBQUE7O0FBQUE7QUFDbEMsMERBQTBCO0FBQUEsWUFBZkMsSUFBZTs7QUFDdEIsWUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLElBQWQsQ0FBSixFQUF5QjtBQUNyQkgsVUFBQUEsV0FBVyxDQUFDQyxPQUFELEVBQVVFLElBQVYsQ0FBWDtBQUNILFNBRkQsQ0FHQTtBQUNBO0FBQ0E7QUFMQSxhQU1LO0FBQ0RGLFlBQUFBLE9BQU8sQ0FBQ0ssSUFBUixDQUFhSCxJQUFiO0FBQ0g7QUFDSjtBQVhpQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWXJDOztBQUVNLFdBQVNJLGdCQUFULENBQTJCTCxLQUEzQixFQUFrQztBQUNyQyxRQUFNTSxTQUFTLEdBQUdDLHdCQUFNLElBQU4sR0FBYSxFQUEvQjtBQUNBLFFBQU1SLE9BQU8sR0FBRyxFQUFoQjtBQUNBRCxJQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBVUMsS0FBVixDQUFYO0FBQ0EsV0FBT0QsT0FBTyxDQUFDUyxJQUFSLENBQWFGLFNBQWIsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgREVWIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuXHJcbmZ1bmN0aW9uIGRlZXBGbGF0dGVuIChzdHJMaXN0LCBhcnJheSkge1xyXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGFycmF5KSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcclxuICAgICAgICAgICAgZGVlcEZsYXR0ZW4oc3RyTGlzdCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBEZWNsYXJhdGlvbikge1xyXG4gICAgICAgIC8vICAgICBzdHJMaXN0LnB1c2goaXRlbS50b1N0cmluZygpKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0ckxpc3QucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQ29kZUFycmF5IChhcnJheSkge1xyXG4gICAgY29uc3Qgc2VwYXJhdG9yID0gREVWID8gJ1xcbicgOiAnJztcclxuICAgIGNvbnN0IHN0ckxpc3QgPSBbXTtcclxuICAgIGRlZXBGbGF0dGVuKHN0ckxpc3QsIGFycmF5KTtcclxuICAgIHJldHVybiBzdHJMaXN0LmpvaW4oc2VwYXJhdG9yKTtcclxufVxyXG4iXX0=