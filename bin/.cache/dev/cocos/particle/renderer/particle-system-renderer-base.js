(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../models/particle-batch-model.js", "../enum.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../models/particle-batch-model.js"), require("../enum.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.particleBatchModel, global._enum, global.globalExports);
    global.particleSystemRendererBase = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _particleBatchModel, _enum, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ParticleSystemRendererBase = void 0;
  _particleBatchModel = _interopRequireDefault(_particleBatchModel);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ParticleSystemRendererBase = /*#__PURE__*/function () {
    function ParticleSystemRendererBase(info) {
      _classCallCheck(this, ParticleSystemRendererBase);

      this._particleSystem = null;
      this._model = null;
      this._renderInfo = null;
      this._vertAttrs = [];
      this._renderInfo = info;
    }

    _createClass(ParticleSystemRendererBase, [{
      key: "onInit",
      value: function onInit(ps) {
        this._particleSystem = ps;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (!this._particleSystem) {
          return;
        }

        this.attachToScene();
        var model = this._model;

        if (model) {
          model.node = model.transform = this._particleSystem.node;
          model.enabled = this._particleSystem.enabledInHierarchy;
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.detachFromScene();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._model) {
          _globalExports.legacyCC.director.root.destroyModel(this._model);

          this._model = null;
        }
      }
    }, {
      key: "attachToScene",
      value: function attachToScene() {
        if (this._model) {
          if (this._model.scene) {
            this.detachFromScene();
          }

          this._particleSystem._getRenderScene().addModel(this._model);
        }
      }
    }, {
      key: "detachFromScene",
      value: function detachFromScene() {
        if (this._model && this._model.scene) {
          this._model.scene.removeModel(this._model);
        }
      }
    }, {
      key: "setVertexAttributes",
      value: function setVertexAttributes() {
        if (this._model) {
          this._model.setVertexAttributes(this._renderInfo.renderMode === _enum.RenderMode.Mesh ? this._renderInfo.mesh : null, this._vertAttrs);
        }
      }
    }, {
      key: "_initModel",
      value: function _initModel() {
        if (!this._model) {
          this._model = _globalExports.legacyCC.director.root.createModel(_particleBatchModel.default);

          this._model.setCapacity(this._particleSystem.capacity);

          this._model.visFlags = this._particleSystem.visibility;
        }
      }
    }, {
      key: "updateTrailMaterial",
      value: function updateTrailMaterial() {}
    }, {
      key: "getDefaultTrailMaterial",
      value: function getDefaultTrailMaterial() {
        return null;
      }
    }]);

    return ParticleSystemRendererBase;
  }();

  _exports.ParticleSystemRendererBase = ParticleSystemRendererBase;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3JlbmRlcmVyL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1iYXNlLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlU3lzdGVtUmVuZGVyZXJCYXNlIiwiaW5mbyIsIl9wYXJ0aWNsZVN5c3RlbSIsIl9tb2RlbCIsIl9yZW5kZXJJbmZvIiwiX3ZlcnRBdHRycyIsInBzIiwiYXR0YWNoVG9TY2VuZSIsIm1vZGVsIiwibm9kZSIsInRyYW5zZm9ybSIsImVuYWJsZWQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJkZXRhY2hGcm9tU2NlbmUiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsImRlc3Ryb3lNb2RlbCIsInNjZW5lIiwiX2dldFJlbmRlclNjZW5lIiwiYWRkTW9kZWwiLCJyZW1vdmVNb2RlbCIsInNldFZlcnRleEF0dHJpYnV0ZXMiLCJyZW5kZXJNb2RlIiwiUmVuZGVyTW9kZSIsIk1lc2giLCJtZXNoIiwiY3JlYXRlTW9kZWwiLCJQYXJ0aWNsZUJhdGNoTW9kZWwiLCJzZXRDYXBhY2l0eSIsImNhcGFjaXR5IiwidmlzRmxhZ3MiLCJ2aXNpYmlsaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStCc0JBLDBCO0FBTWxCLHdDQUFhQyxJQUFiLEVBQTJDO0FBQUE7O0FBQUEsV0FMakNDLGVBS2lDLEdBTFYsSUFLVTtBQUFBLFdBSmpDQyxNQUlpQyxHQUpHLElBSUg7QUFBQSxXQUhqQ0MsV0FHaUMsR0FIWSxJQUdaO0FBQUEsV0FGakNDLFVBRWlDLEdBRkosRUFFSTtBQUN2QyxXQUFLRCxXQUFMLEdBQW1CSCxJQUFuQjtBQUNIOzs7OzZCQUVjSyxFLEVBQWU7QUFDMUIsYUFBS0osZUFBTCxHQUF1QkksRUFBdkI7QUFDSDs7O2lDQUVrQjtBQUNmLFlBQUksQ0FBQyxLQUFLSixlQUFWLEVBQTJCO0FBQ3ZCO0FBQ0g7O0FBQ0QsYUFBS0ssYUFBTDtBQUNBLFlBQU1DLEtBQUssR0FBRyxLQUFLTCxNQUFuQjs7QUFDQSxZQUFJSyxLQUFKLEVBQVc7QUFDUEEsVUFBQUEsS0FBSyxDQUFDQyxJQUFOLEdBQWFELEtBQUssQ0FBQ0UsU0FBTixHQUFrQixLQUFLUixlQUFMLENBQXFCTyxJQUFwRDtBQUNBRCxVQUFBQSxLQUFLLENBQUNHLE9BQU4sR0FBZ0IsS0FBS1QsZUFBTCxDQUFxQlUsa0JBQXJDO0FBQ0g7QUFDSjs7O2tDQUVtQjtBQUNoQixhQUFLQyxlQUFMO0FBQ0g7OztrQ0FFbUI7QUFDaEIsWUFBSSxLQUFLVixNQUFULEVBQWlCO0FBQ2JXLGtDQUFTQyxRQUFULENBQWtCQyxJQUFsQixDQUF1QkMsWUFBdkIsQ0FBb0MsS0FBS2QsTUFBekM7O0FBQ0EsZUFBS0EsTUFBTCxHQUFjLElBQWQ7QUFDSDtBQUNKOzs7c0NBRXVCO0FBQ3BCLFlBQUksS0FBS0EsTUFBVCxFQUFpQjtBQUNiLGNBQUksS0FBS0EsTUFBTCxDQUFZZSxLQUFoQixFQUF1QjtBQUNuQixpQkFBS0wsZUFBTDtBQUNIOztBQUNELGVBQUtYLGVBQUwsQ0FBc0JpQixlQUF0QixHQUF3Q0MsUUFBeEMsQ0FBaUQsS0FBS2pCLE1BQXREO0FBQ0g7QUFDSjs7O3dDQUV5QjtBQUN0QixZQUFJLEtBQUtBLE1BQUwsSUFBZSxLQUFLQSxNQUFMLENBQVllLEtBQS9CLEVBQXNDO0FBQ2xDLGVBQUtmLE1BQUwsQ0FBWWUsS0FBWixDQUFrQkcsV0FBbEIsQ0FBOEIsS0FBS2xCLE1BQW5DO0FBQ0g7QUFDSjs7OzRDQUU2QjtBQUMxQixZQUFJLEtBQUtBLE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVltQixtQkFBWixDQUFnQyxLQUFLbEIsV0FBTCxDQUFrQm1CLFVBQWxCLEtBQWlDQyxpQkFBV0MsSUFBNUMsR0FBbUQsS0FBS3JCLFdBQUwsQ0FBa0JzQixJQUFyRSxHQUE0RSxJQUE1RyxFQUFrSCxLQUFLckIsVUFBdkg7QUFDSDtBQUNKOzs7bUNBRXVCO0FBQ3BCLFlBQUksQ0FBQyxLQUFLRixNQUFWLEVBQWtCO0FBQ2QsZUFBS0EsTUFBTCxHQUFjVyx3QkFBU0MsUUFBVCxDQUFrQkMsSUFBbEIsQ0FBdUJXLFdBQXZCLENBQW1DQywyQkFBbkMsQ0FBZDs7QUFDQSxlQUFLekIsTUFBTCxDQUFhMEIsV0FBYixDQUF5QixLQUFLM0IsZUFBTCxDQUFxQjRCLFFBQTlDOztBQUNBLGVBQUszQixNQUFMLENBQWE0QixRQUFiLEdBQXdCLEtBQUs3QixlQUFMLENBQXFCOEIsVUFBN0M7QUFDSDtBQUNKOzs7NENBRTZCLENBQUU7OztnREFDRTtBQUFFLGVBQU8sSUFBUDtBQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBHRlhBdHRyaWJ1dGUgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuaW1wb3J0IFBhcnRpY2xlQmF0Y2hNb2RlbCBmcm9tICcuLi9tb2RlbHMvcGFydGljbGUtYmF0Y2gtbW9kZWwnO1xyXG5pbXBvcnQgUGFydGljbGVTeXN0ZW1SZW5kZXJlciBmcm9tICcuL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1kYXRhJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcbmltcG9ydCB7IFBhcnRpY2xlLCBJUGFydGljbGVNb2R1bGUgfSBmcm9tICcuLi9wYXJ0aWNsZSc7XHJcbmltcG9ydCB7IFJlbmRlck1vZGUgfSBmcm9tICcuLi9lbnVtJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhcnRpY2xlU3lzdGVtUmVuZGVyZXIge1xyXG4gICAgb25Jbml0IChwczogQ29tcG9uZW50KTogdm9pZDtcclxuICAgIG9uRW5hYmxlICgpOiB2b2lkO1xyXG4gICAgb25EaXNhYmxlICgpOiB2b2lkO1xyXG4gICAgb25EZXN0cm95ICgpOiB2b2lkO1xyXG4gICAgY2xlYXIgKCk6IHZvaWQ7XHJcbiAgICBhdHRhY2hUb1NjZW5lICgpOiB2b2lkO1xyXG4gICAgZGV0YWNoRnJvbVNjZW5lICgpOiB2b2lkO1xyXG4gICAgdXBkYXRlTWF0ZXJpYWxQYXJhbXMgKCk6IHZvaWQ7XHJcbiAgICBzZXRWZXJ0ZXhBdHRyaWJ1dGVzICgpOiB2b2lkO1xyXG4gICAgdXBkYXRlUmVuZGVyTW9kZSAoKTogdm9pZDtcclxuICAgIG9uTWF0ZXJpYWxNb2RpZmllZCAoaW5kZXg6IG51bWJlciwgbWF0ZXJpYWw6IE1hdGVyaWFsKTogdm9pZDtcclxuICAgIG9uUmVidWlsZFBTTyAoaW5kZXg6IG51bWJlciwgbWF0ZXJpYWw6IE1hdGVyaWFsKSA6IHZvaWQ7XHJcbiAgICBnZXRQYXJ0aWNsZUNvdW50ICgpOiBudW1iZXI7XHJcbiAgICBnZXRGcmVlUGFydGljbGUgKCk6IFBhcnRpY2xlIHwgbnVsbDtcclxuICAgIHNldE5ld1BhcnRpY2xlIChwOiBQYXJ0aWNsZSk6IHZvaWQ7XHJcbiAgICB1cGRhdGVQYXJ0aWNsZXMgKGR0OiBudW1iZXIpOiBudW1iZXI7XHJcbiAgICB1cGRhdGVSZW5kZXJEYXRhICgpOiB2b2lkO1xyXG4gICAgZW5hYmxlTW9kdWxlIChuYW1lOiBzdHJpbmcsIHZhbDogQm9vbGVhbiwgcG06IElQYXJ0aWNsZU1vZHVsZSk6IHZvaWQ7XHJcbiAgICB1cGRhdGVUcmFpbE1hdGVyaWFsICgpOiB2b2lkO1xyXG4gICAgZ2V0RGVmYXVsdFRyYWlsTWF0ZXJpYWwgKCk6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhcnRpY2xlU3lzdGVtUmVuZGVyZXJCYXNlIGltcGxlbWVudHMgSVBhcnRpY2xlU3lzdGVtUmVuZGVyZXIge1xyXG4gICAgcHJvdGVjdGVkIF9wYXJ0aWNsZVN5c3RlbTogYW55ID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfbW9kZWw6IFBhcnRpY2xlQmF0Y2hNb2RlbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXJJbmZvOiBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3ZlcnRBdHRyczogR0ZYQXR0cmlidXRlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoaW5mbzogUGFydGljbGVTeXN0ZW1SZW5kZXJlcikge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckluZm8gPSBpbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkluaXQgKHBzOiBDb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbSA9IHBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYXR0YWNoVG9TY2VuZSgpO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5fbW9kZWw7XHJcbiAgICAgICAgaWYgKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsLm5vZGUgPSBtb2RlbC50cmFuc2Zvcm0gPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5ub2RlO1xyXG4gICAgICAgICAgICBtb2RlbC5lbmFibGVkID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uZW5hYmxlZEluSGllcmFyY2h5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICB0aGlzLmRldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRlc3Ryb3lNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuc2NlbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoRnJvbVNjZW5lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0hLl9nZXRSZW5kZXJTY2VuZSgpLmFkZE1vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRldGFjaEZyb21TY2VuZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsICYmIHRoaXMuX21vZGVsLnNjZW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLnNjZW5lLnJlbW92ZU1vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZlcnRleEF0dHJpYnV0ZXMgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zZXRWZXJ0ZXhBdHRyaWJ1dGVzKHRoaXMuX3JlbmRlckluZm8hLnJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuTWVzaCA/IHRoaXMuX3JlbmRlckluZm8hLm1lc2ggOiBudWxsLCB0aGlzLl92ZXJ0QXR0cnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2luaXRNb2RlbCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuY3JlYXRlTW9kZWwoUGFydGljbGVCYXRjaE1vZGVsKTtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwhLnNldENhcGFjaXR5KHRoaXMuX3BhcnRpY2xlU3lzdGVtLmNhcGFjaXR5KTtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwhLnZpc0ZsYWdzID0gdGhpcy5fcGFydGljbGVTeXN0ZW0udmlzaWJpbGl0eTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVRyYWlsTWF0ZXJpYWwgKCkge31cclxuICAgIHB1YmxpYyBnZXREZWZhdWx0VHJhaWxNYXRlcmlhbCAoKSB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0UGFydGljbGVDb3VudCAoKSA6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRGcmVlUGFydGljbGUgKCk6IFBhcnRpY2xlIHwgbnVsbDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBvbk1hdGVyaWFsTW9kaWZpZWQgKGluZGV4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCkgOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IG9uUmVidWlsZFBTTyAoaW5kZXg6IG51bWJlciwgbWF0ZXJpYWw6IE1hdGVyaWFsKSA6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgdXBkYXRlUmVuZGVyTW9kZSAoKSA6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgdXBkYXRlTWF0ZXJpYWxQYXJhbXMgKCkgOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsZWFyICgpIDogdm9pZDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXROZXdQYXJ0aWNsZSAocDogUGFydGljbGUpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHVwZGF0ZVBhcnRpY2xlcyAoZHQ6IG51bWJlcik6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCB1cGRhdGVSZW5kZXJEYXRhICgpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGVuYWJsZU1vZHVsZSAobmFtZTogc3RyaW5nLCB2YWw6IEJvb2xlYW4sIHBtOiBJUGFydGljbGVNb2R1bGUpOiB2b2lkO1xyXG59XHJcbiJdfQ==