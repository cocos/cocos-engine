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
    global.config = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  // Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  var _stageOffset = 0;
  var _name2stageID = {};
  var _default = {
    addStage: function addStage(name) {
      // already added
      if (_name2stageID[name] !== undefined) {
        return;
      }

      var stageID = 1 << _stageOffset;
      _name2stageID[name] = stageID;
      _stageOffset += 1;
    },
    stageID: function stageID(name) {
      var id = _name2stageID[name];

      if (id === undefined) {
        return -1;
      }

      return id;
    },
    stageIDs: function stageIDs(nameList) {
      var key = 0;

      var _iterator = _createForOfIteratorHelper(nameList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var name = _step.value;
          var id = _name2stageID[name];

          if (id !== undefined) {
            key |= id;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return key;
    }
  };
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29uZmlnLnRzIl0sIm5hbWVzIjpbIl9zdGFnZU9mZnNldCIsIl9uYW1lMnN0YWdlSUQiLCJhZGRTdGFnZSIsIm5hbWUiLCJ1bmRlZmluZWQiLCJzdGFnZUlEIiwiaWQiLCJzdGFnZUlEcyIsIm5hbWVMaXN0Iiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUEsTUFBSUEsWUFBWSxHQUFHLENBQW5CO0FBQ0EsTUFBTUMsYUFBYSxHQUFHLEVBQXRCO2lCQUVlO0FBQ1hDLElBQUFBLFFBRFcsb0JBQ0RDLElBREMsRUFDSztBQUNaO0FBQ0EsVUFBSUYsYUFBYSxDQUFDRSxJQUFELENBQWIsS0FBd0JDLFNBQTVCLEVBQXVDO0FBQ25DO0FBQ0g7O0FBRUQsVUFBTUMsT0FBTyxHQUFHLEtBQUtMLFlBQXJCO0FBQ0FDLE1BQUFBLGFBQWEsQ0FBQ0UsSUFBRCxDQUFiLEdBQXNCRSxPQUF0QjtBQUVBTCxNQUFBQSxZQUFZLElBQUksQ0FBaEI7QUFDSCxLQVhVO0FBYVhLLElBQUFBLE9BYlcsbUJBYUZGLElBYkUsRUFhSTtBQUNYLFVBQU1HLEVBQUUsR0FBR0wsYUFBYSxDQUFDRSxJQUFELENBQXhCOztBQUNBLFVBQUlHLEVBQUUsS0FBS0YsU0FBWCxFQUFzQjtBQUNsQixlQUFPLENBQUMsQ0FBUjtBQUNIOztBQUNELGFBQU9FLEVBQVA7QUFDSCxLQW5CVTtBQXFCWEMsSUFBQUEsUUFyQlcsb0JBcUJEQyxRQXJCQyxFQXFCUztBQUNoQixVQUFJQyxHQUFHLEdBQUcsQ0FBVjs7QUFEZ0IsaURBRUdELFFBRkg7QUFBQTs7QUFBQTtBQUVoQiw0REFBNkI7QUFBQSxjQUFsQkwsSUFBa0I7QUFDekIsY0FBTUcsRUFBRSxHQUFHTCxhQUFhLENBQUNFLElBQUQsQ0FBeEI7O0FBQ0EsY0FBSUcsRUFBRSxLQUFLRixTQUFYLEVBQXNCO0FBQ2xCSyxZQUFBQSxHQUFHLElBQUlILEVBQVA7QUFDSDtBQUNKO0FBUGU7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFRaEIsYUFBT0csR0FBUDtBQUNIO0FBOUJVLEciLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbmxldCBfc3RhZ2VPZmZzZXQgPSAwO1xyXG5jb25zdCBfbmFtZTJzdGFnZUlEID0ge307XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBhZGRTdGFnZSAobmFtZSkge1xyXG4gICAgICAgIC8vIGFscmVhZHkgYWRkZWRcclxuICAgICAgICBpZiAoX25hbWUyc3RhZ2VJRFtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlSUQgPSAxIDw8IF9zdGFnZU9mZnNldDtcclxuICAgICAgICBfbmFtZTJzdGFnZUlEW25hbWVdID0gc3RhZ2VJRDtcclxuXHJcbiAgICAgICAgX3N0YWdlT2Zmc2V0ICs9IDE7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YWdlSUQgKG5hbWUpIHtcclxuICAgICAgICBjb25zdCBpZCA9IF9uYW1lMnN0YWdlSURbbmFtZV07XHJcbiAgICAgICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YWdlSURzIChuYW1lTGlzdCkge1xyXG4gICAgICAgIGxldCBrZXkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IF9uYW1lMnN0YWdlSURbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgfD0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH0sXHJcbn07XHJcbiJdfQ==