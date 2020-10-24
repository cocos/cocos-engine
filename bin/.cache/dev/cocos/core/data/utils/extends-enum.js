(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../platform/debug.js", "../../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../platform/debug.js"), require("../../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.defaultConstants);
    global.extendsEnum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.extendsEnum = extendsEnum;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function extendsEnum() {
    for (var _len = arguments.length, enums = new Array(_len), _key = 0; _key < _len; _key++) {
      enums[_key] = arguments[_key];
    }

    if (_defaultConstants.DEV) {
      var kvs = [];

      var _iterator = _createForOfIteratorHelper(enums),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var e = _step.value;

          for (var _i = 0, _Object$keys = Object.keys(e); _i < _Object$keys.length; _i++) {
            var kv = _Object$keys[_i];

            if (kvs.indexOf(kv) >= 0) {
              (0, _debug.errorID)(3659);
            } else {
              kvs.push(kv);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return Object.assign.apply(Object, [{}].concat(enums));
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9leHRlbmRzLWVudW0udHMiXSwibmFtZXMiOlsiZXh0ZW5kc0VudW0iLCJlbnVtcyIsIkRFViIsImt2cyIsImUiLCJPYmplY3QiLCJrZXlzIiwia3YiLCJpbmRleE9mIiwicHVzaCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ08sV0FBU0EsV0FBVCxHQUE0QztBQUFBLHNDQUFuQkMsS0FBbUI7QUFBbkJBLE1BQUFBLEtBQW1CO0FBQUE7O0FBQy9DLFFBQUlDLHFCQUFKLEVBQVM7QUFDTCxVQUFNQyxHQUFrQixHQUFHLEVBQTNCOztBQURLLGlEQUVXRixLQUZYO0FBQUE7O0FBQUE7QUFFTCw0REFBdUI7QUFBQSxjQUFaRyxDQUFZOztBQUNuQiwwQ0FBaUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZRixDQUFaLENBQWpCLGtDQUFpQztBQUE1QixnQkFBTUcsRUFBRSxtQkFBUjs7QUFDRCxnQkFBSUosR0FBRyxDQUFDSyxPQUFKLENBQVlELEVBQVosS0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEIsa0NBQVEsSUFBUjtBQUNILGFBRkQsTUFFTztBQUNISixjQUFBQSxHQUFHLENBQUNNLElBQUosQ0FBU0YsRUFBVDtBQUNIO0FBQ0o7QUFDSjtBQVZJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZUjs7QUFDRCxXQUFPRixNQUFNLENBQUNLLE1BQVAsT0FBQUwsTUFBTSxHQUFRLEVBQVIsU0FBZUosS0FBZixFQUFiO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgREVWIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog57uE5ZCI5Lu75oSP5aSa5Liq5p6a5Li+44CCXHJcbiAqIOatpOWHveaVsOeahOihjOS4uuetieS7t+S6jui/lOWbnuS6huS4gOS4quaWsOeahOaemuS4vu+8jOWFtuaIkOWRmOWbiuaLrOS6huaJgOaciea6kOaemuS4vueahOaIkOWRmOOAglxyXG4gKiDov5nkupvmnprkuL7nmoTmiJDlkZjlv4XpobvlkITkuI3nm7jlkIzvvIjljIXmi6zmiJDlkZjlkI3lkozlgLzvvInvvIzlkKbliJnooYzkuLrmmK/mnKrlrprkuYnnmoTjgIJcclxuICogQGVuXHJcbiAqIENvbWJpbmUgYXJiaXRyYXkgbnVtYmVyIG9mIGVudW1lcmF0aW9ucy5cclxuICogSXQgYmVoYXZlcyBsaWtlIGFuIGVudW1lcmF0aW9uIGhhdmluZyBtZW1iZXJzIHRoYXQgaXMgYSBjb21iaW5hdGlvbiBvZiBtZW1iZXJzIG9mIHRoZSBzb3VyY2UgZW51bWVyYXRpb25zXHJcbiAqIGlzIHJldHVybmVkLlxyXG4gKiBUaGVzZSBlbnVtZXJhdGlvbnMgc2hhbGwgaGF2ZSBub24tb3ZlcmxhcGVkIG1lbWJlciBuYW1lcyBvciBtZW1iZXIgdmFsdWVzLlxyXG4gKiBJZiBub3QsIHRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWQuXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGVudW0gQXBwbGUgeyBhcHBsZSA9ICdhcHBsZScsIH1cclxuICogZW51bSBQZW4geyBwZW4gPSAncGVuJyB9XHJcbiAqIC8vIEFzIGlmIGBlbnVtIEFwcGxlUGVuIHsgYXBwbGUgPSAnYXBwbGUnOyBwZW4gPSAncGVuJzsgfWBcclxuICogY29uc3QgQXBwbGVQZW4gPSBleHRlbmRzRW51bShBcHBsZSwgUGVuKTtcclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kc0VudW0gKCk6IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZHNFbnVtPEUwPiAoZTA6IEUwKTogRTA7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kc0VudW08RTAsIEUxPiAoZTA6IEUwLCBlMTogRTEpOiBFMCAmIEUxO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZHNFbnVtPEUwLCBFMSwgRTI+IChlMDogRTAsIGUxOiBFMSwgZTI6IEUyKTogRTAgJiBFMSAmIEUyO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZHNFbnVtPEUwLCBFMSwgRTIsIEUzPiAoZTA6IEUwLCBlMTogRTEsIGUyOiBFMiwgZTM6IEUzKTogRTAgJiBFMSAmIEUyICYgRTM7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kc0VudW0gKC4uLmVudW1zOiBhbnlbXSk6IGFueSB7XHJcbiAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgY29uc3Qga3ZzOiBQcm9wZXJ0eUtleVtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIGVudW1zKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga3Ygb2YgT2JqZWN0LmtleXMoZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrdnMuaW5kZXhPZihrdikgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ySUQoMzY1OSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGt2cy5wdXNoKGt2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCAuLi5lbnVtcyk7XHJcbn0iXX0=