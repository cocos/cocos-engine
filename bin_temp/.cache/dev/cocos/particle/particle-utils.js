(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/data/index.js", "../core/director.js", "../core/memop/index.js", "../core/scene-graph/index.js", "./particle-system.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/data/index.js"), require("../core/director.js"), require("../core/memop/index.js"), require("../core/scene-graph/index.js"), require("./particle-system.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.director, global.index, global.index, global.particleSystem);
    global.particleUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _director, _index2, _index3, _particleSystem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ParticleUtils = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ParticleUtils = /*#__PURE__*/function () {
    function ParticleUtils() {
      _classCallCheck(this, ParticleUtils);
    }

    _createClass(ParticleUtils, null, [{
      key: "instantiate",

      /**
       * instantiate
       */
      value: function instantiate(prefab) {
        if (!this.registeredSceneEvent) {
          _director.director.on(_director.Director.EVENT_BEFORE_SCENE_LAUNCH, this.onSceneUnload, this);

          this.registeredSceneEvent = true;
        }

        if (!this.particleSystemPool.has(prefab._uuid)) {
          this.particleSystemPool.set(prefab._uuid, new _index2.Pool(function () {
            return (0, _index.instantiate)(prefab) || new _index3.Node();
          }, 1));
        }

        return this.particleSystemPool.get(prefab._uuid).alloc();
      }
    }, {
      key: "destroy",
      value: function destroy(prefab) {
        if (this.particleSystemPool.has(prefab._prefab.asset._uuid)) {
          this.stop(prefab);
          this.particleSystemPool.get(prefab._prefab.asset._uuid).free(prefab);
        }
      }
    }, {
      key: "play",
      value: function play(rootNode) {
        var _iterator = _createForOfIteratorHelper(rootNode.getComponentsInChildren(_particleSystem.ParticleSystem)),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var ps = _step.value;
            ps.play();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "stop",
      value: function stop(rootNode) {
        var _iterator2 = _createForOfIteratorHelper(rootNode.getComponentsInChildren(_particleSystem.ParticleSystem)),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var ps = _step2.value;
            ps.stop();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }, {
      key: "onSceneUnload",
      value: function onSceneUnload() {
        this.particleSystemPool.forEach(function (value) {
          value.destroy(function (prefab) {
            prefab.destroy();
          });
        });
        this.particleSystemPool.clear();
      }
    }]);

    return ParticleUtils;
  }();

  _exports.ParticleUtils = ParticleUtils;
  ParticleUtils.particleSystemPool = new Map();
  ParticleUtils.registeredSceneEvent = false;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3BhcnRpY2xlLXV0aWxzLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlVXRpbHMiLCJwcmVmYWIiLCJyZWdpc3RlcmVkU2NlbmVFdmVudCIsImRpcmVjdG9yIiwib24iLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9TQ0VORV9MQVVOQ0giLCJvblNjZW5lVW5sb2FkIiwicGFydGljbGVTeXN0ZW1Qb29sIiwiaGFzIiwiX3V1aWQiLCJzZXQiLCJQb29sIiwiTm9kZSIsImdldCIsImFsbG9jIiwiX3ByZWZhYiIsImFzc2V0Iiwic3RvcCIsImZyZWUiLCJyb290Tm9kZSIsImdldENvbXBvbmVudHNJbkNoaWxkcmVuIiwiUGFydGljbGVTeXN0ZW0iLCJwcyIsInBsYXkiLCJmb3JFYWNoIiwidmFsdWUiLCJkZXN0cm95IiwiY2xlYXIiLCJNYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BV2FBLGE7Ozs7Ozs7O0FBRVQ7OztrQ0FHMkJDLE0sRUFBUTtBQUMvQixZQUFJLENBQUMsS0FBS0Msb0JBQVYsRUFBZ0M7QUFDNUJDLDZCQUFTQyxFQUFULENBQVlDLG1CQUFTQyx5QkFBckIsRUFBZ0QsS0FBS0MsYUFBckQsRUFBb0UsSUFBcEU7O0FBQ0EsZUFBS0wsb0JBQUwsR0FBNEIsSUFBNUI7QUFDSDs7QUFDRCxZQUFJLENBQUMsS0FBS00sa0JBQUwsQ0FBd0JDLEdBQXhCLENBQTRCUixNQUFNLENBQUNTLEtBQW5DLENBQUwsRUFBZ0Q7QUFDNUMsZUFBS0Ysa0JBQUwsQ0FBd0JHLEdBQXhCLENBQTRCVixNQUFNLENBQUNTLEtBQW5DLEVBQTBDLElBQUlFLFlBQUosQ0FBbUIsWUFBTTtBQUMvRCxtQkFBTyx3QkFBWVgsTUFBWixLQUF1QixJQUFJWSxZQUFKLEVBQTlCO0FBQ0gsV0FGeUMsRUFFdkMsQ0FGdUMsQ0FBMUM7QUFHSDs7QUFDRCxlQUFPLEtBQUtMLGtCQUFMLENBQXdCTSxHQUF4QixDQUE0QmIsTUFBTSxDQUFDUyxLQUFuQyxFQUEyQ0ssS0FBM0MsRUFBUDtBQUNIOzs7OEJBRXNCZCxNLEVBQVE7QUFDM0IsWUFBSSxLQUFLTyxrQkFBTCxDQUF3QkMsR0FBeEIsQ0FBNEJSLE1BQU0sQ0FBQ2UsT0FBUCxDQUFlQyxLQUFmLENBQXFCUCxLQUFqRCxDQUFKLEVBQTZEO0FBQ3pELGVBQUtRLElBQUwsQ0FBVWpCLE1BQVY7QUFDQSxlQUFLTyxrQkFBTCxDQUF3Qk0sR0FBeEIsQ0FBNEJiLE1BQU0sQ0FBQ2UsT0FBUCxDQUFlQyxLQUFmLENBQXFCUCxLQUFqRCxFQUF5RFMsSUFBekQsQ0FBOERsQixNQUE5RDtBQUNIO0FBQ0o7OzsyQkFFbUJtQixRLEVBQWdCO0FBQUEsbURBQ2ZBLFFBQVEsQ0FBQ0MsdUJBQVQsQ0FBaUNDLDhCQUFqQyxDQURlO0FBQUE7O0FBQUE7QUFDaEMsOERBQW1FO0FBQUEsZ0JBQXhEQyxFQUF3RDtBQUM5REEsWUFBQUEsRUFBRCxDQUF1QkMsSUFBdkI7QUFDSDtBQUgrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSW5DOzs7MkJBRW1CSixRLEVBQWdCO0FBQUEsb0RBQ2ZBLFFBQVEsQ0FBQ0MsdUJBQVQsQ0FBaUNDLDhCQUFqQyxDQURlO0FBQUE7O0FBQUE7QUFDaEMsaUVBQW1FO0FBQUEsZ0JBQXhEQyxFQUF3RDtBQUM5REEsWUFBQUEsRUFBRCxDQUF1QkwsSUFBdkI7QUFDSDtBQUgrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSW5DOzs7c0NBSStCO0FBQzVCLGFBQUtWLGtCQUFMLENBQXdCaUIsT0FBeEIsQ0FBZ0MsVUFBQ0MsS0FBRCxFQUFXO0FBQ3ZDQSxVQUFBQSxLQUFLLENBQUNDLE9BQU4sQ0FBYyxVQUFDMUIsTUFBRCxFQUFZO0FBQ3RCQSxZQUFBQSxNQUFNLENBQUMwQixPQUFQO0FBQ0gsV0FGRDtBQUdILFNBSkQ7QUFLQSxhQUFLbkIsa0JBQUwsQ0FBd0JvQixLQUF4QjtBQUNIOzs7Ozs7O0FBOUNRNUIsRUFBQUEsYSxDQW9DTVEsa0IsR0FBa0QsSUFBSXFCLEdBQUosRTtBQXBDeEQ3QixFQUFBQSxhLENBcUNNRSxvQixHQUFnQyxLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBpbnN0YW50aWF0ZSB9IGZyb20gJy4uL2NvcmUvZGF0YSc7XHJcbmltcG9ydCB7IENDT2JqZWN0IH0gZnJvbSAnLi4vY29yZS9kYXRhL29iamVjdCc7XHJcbmltcG9ydCB7IERpcmVjdG9yLCBkaXJlY3RvciB9IGZyb20gJy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBQb29sIH0gZnJvbSAnLi4vY29yZS9tZW1vcCc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9jb3JlL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgUGFydGljbGVTeXN0ZW0gfSBmcm9tICcuL3BhcnRpY2xlLXN5c3RlbSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFydGljbGVVdGlscyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbnN0YW50aWF0ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbnRpYXRlIChwcmVmYWIpIHtcclxuICAgICAgICBpZiAoIXRoaXMucmVnaXN0ZXJlZFNjZW5lRXZlbnQpIHtcclxuICAgICAgICAgICAgZGlyZWN0b3Iub24oRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCwgdGhpcy5vblNjZW5lVW5sb2FkLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlcmVkU2NlbmVFdmVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVN5c3RlbVBvb2wuaGFzKHByZWZhYi5fdXVpZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbVBvb2wuc2V0KHByZWZhYi5fdXVpZCwgbmV3IFBvb2w8Q0NPYmplY3Q+KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW50aWF0ZShwcmVmYWIpIHx8IG5ldyBOb2RlKCk7XHJcbiAgICAgICAgICAgIH0sIDEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFydGljbGVTeXN0ZW1Qb29sLmdldChwcmVmYWIuX3V1aWQpIS5hbGxvYygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVzdHJveSAocHJlZmFiKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTeXN0ZW1Qb29sLmhhcyhwcmVmYWIuX3ByZWZhYi5hc3NldC5fdXVpZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKHByZWZhYik7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW1Qb29sLmdldChwcmVmYWIuX3ByZWZhYi5hc3NldC5fdXVpZCkhLmZyZWUocHJlZmFiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5IChyb290Tm9kZTogTm9kZSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgcHMgb2Ygcm9vdE5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oUGFydGljbGVTeXN0ZW0pKSB7XHJcbiAgICAgICAgICAgIChwcyBhcyBQYXJ0aWNsZVN5c3RlbSkucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0b3AgKHJvb3ROb2RlOiBOb2RlKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBwcyBvZiByb290Tm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihQYXJ0aWNsZVN5c3RlbSkpIHtcclxuICAgICAgICAgICAgKHBzIGFzIFBhcnRpY2xlU3lzdGVtKS5zdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFydGljbGVTeXN0ZW1Qb29sOiBNYXA8c3RyaW5nLCBQb29sPENDT2JqZWN0Pj4gPSBuZXcgTWFwPHN0cmluZywgUG9vbDxDQ09iamVjdD4+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWdpc3RlcmVkU2NlbmVFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG9uU2NlbmVVbmxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW1Qb29sLmZvckVhY2goKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhbHVlLmRlc3Ryb3koKHByZWZhYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcHJlZmFiLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbVBvb2wuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG4iXX0=