(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ammoInstance = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoInstance = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var AmmoInstance = /*#__PURE__*/function () {
    function AmmoInstance() {
      _classCallCheck(this, AmmoInstance);
    }

    _createClass(AmmoInstance, null, [{
      key: "bodyStructs",
      get: function get() {
        return this.bodyAndGhosts;
      }
    }, {
      key: "ghostStructs",
      get: function get() {
        return this.bodyAndGhosts;
      }
    }]);

    return AmmoInstance;
  }();

  _exports.AmmoInstance = AmmoInstance;
  AmmoInstance.bodyAndGhosts = {};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLWluc3RhbmNlLnRzIl0sIm5hbWVzIjpbIkFtbW9JbnN0YW5jZSIsImJvZHlBbmRHaG9zdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRWFBLFk7Ozs7Ozs7MEJBS2lCO0FBQ3RCLGVBQU8sS0FBS0MsYUFBWjtBQUNIOzs7MEJBRTBCO0FBQ3ZCLGVBQU8sS0FBS0EsYUFBWjtBQUNIOzs7Ozs7O0FBWFFELEVBQUFBLFksQ0FDT0MsYSxHQUVaLEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQW1tb0JvZHlTdHJ1Y3QsIElBbW1vR2hvc3RTdHJ1Y3QgfSBmcm9tICcuL2FtbW8taW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBbW1vSW5zdGFuY2Uge1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGJvZHlBbmRHaG9zdHM6IHtcclxuICAgICAgICBbeDogc3RyaW5nXTogSUFtbW9Cb2R5U3RydWN0IHwgSUFtbW9HaG9zdFN0cnVjdFxyXG4gICAgfSA9IHt9O1xyXG5cclxuICAgIHN0YXRpYyBnZXQgYm9keVN0cnVjdHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvZHlBbmRHaG9zdHMgYXMgeyBbeDogc3RyaW5nXTogSUFtbW9Cb2R5U3RydWN0IH07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnaG9zdFN0cnVjdHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvZHlBbmRHaG9zdHMgYXMgeyBbeDogc3RyaW5nXTogSUFtbW9HaG9zdFN0cnVjdCB9O1xyXG4gICAgfVxyXG59Il19