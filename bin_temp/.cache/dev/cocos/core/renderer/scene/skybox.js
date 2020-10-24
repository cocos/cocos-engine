(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../3d/builtin/index.js", "../../3d/misc/utils.js", "../../assets/material.js", "../../pipeline/define.js", "../../primitive/index.js", "../core/material-instance.js", "../core/sampler-lib.js", "../../global-exports.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../3d/builtin/index.js"), require("../../3d/misc/utils.js"), require("../../assets/material.js"), require("../../pipeline/define.js"), require("../../primitive/index.js"), require("../core/material-instance.js"), require("../core/sampler-lib.js"), require("../../global-exports.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.utils, global.material, global.define, global.index, global.materialInstance, global.samplerLib, global.globalExports, global.memoryPools);
    global.skybox = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _utils, _material, _define, _index2, _materialInstance, _samplerLib, _globalExports, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Skybox = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var skybox_mesh = null;
  var skybox_material = null;

  var Skybox = /*#__PURE__*/function () {
    _createClass(Skybox, [{
      key: "model",
      get: function get() {
        return this._model;
      }
      /**
       * @en Whether activate skybox in the scene
       * @zh 是否启用天空盒？
       */

    }, {
      key: "enabled",
      get: function get() {
        return _memoryPools.SkyboxPool.get(this._handle, _memoryPools.SkyboxView.ENABLE);
      },
      set: function set(val) {
        val ? this.activate() : this._updatePipeline();

        _memoryPools.SkyboxPool.set(this._handle, _memoryPools.SkyboxView.ENABLE, val ? 1 : 0);
      }
      /**
       * @en Whether use environment lighting
       * @zh 是否启用环境光照？
       */

    }, {
      key: "useIBL",
      get: function get() {
        return _memoryPools.SkyboxPool.get(this._handle, _memoryPools.SkyboxView.USE_IBL);
      },
      set: function set(val) {
        _memoryPools.SkyboxPool.set(this._handle, _memoryPools.SkyboxView.USE_IBL, val ? 1 : 0);

        this._updatePipeline();
      }
      /**
       * @en Whether enable RGBE data support in skybox shader
       * @zh 是否需要开启 shader 内的 RGBE 数据支持？
       */

    }, {
      key: "isRGBE",
      get: function get() {
        return _memoryPools.SkyboxPool.get(this._handle, _memoryPools.SkyboxView.IS_RGBE);
      },
      set: function set(val) {
        if (val) {
          if (skybox_material) {
            skybox_material.recompileShaders({
              USE_RGBE_CUBEMAP: val
            });
          }

          if (this._model) {
            this._model.setSubModelMaterial(0, skybox_material);
          }
        }

        _memoryPools.SkyboxPool.set(this._handle, _memoryPools.SkyboxView.IS_RGBE, val ? 1 : 0);

        this._updatePipeline();
      }
      /**
       * @en The texture cube used for the skybox
       * @zh 使用的立方体贴图
       */

    }, {
      key: "envmap",
      get: function get() {
        return this._envmap;
      },
      set: function set(val) {
        this._envmap = val || this._default;

        if (this._envmap) {
          _globalExports.legacyCC.director.root.pipeline.ambient.albedoArray[3] = this._envmap.mipmapLevel;

          this._updateGlobalBinding();
        }
      }
    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }]);

    function Skybox() {
      _classCallCheck(this, Skybox);

      this._envmap = null;
      this._globalDescriptorSet = null;
      this._model = null;
      this._default = null;
      this._handle = _memoryPools.NULL_HANDLE;
      this._handle = _memoryPools.SkyboxPool.alloc();
    }

    _createClass(Skybox, [{
      key: "activate",
      value: function activate() {
        var pipeline = _globalExports.legacyCC.director.root.pipeline;
        this._globalDescriptorSet = pipeline.descriptorSet;
        this._default = _index.builtinResMgr.get('default-cube-texture');

        if (!this._model) {
          this._model = new _globalExports.legacyCC.renderer.scene.Model();
        }

        _memoryPools.SkyboxPool.set(this._handle, _memoryPools.SkyboxView.MODEL, this._model.handle);

        pipeline.ambient.groundAlbedo[3] = this._envmap ? this._envmap.mipmapLevel : this._default.mipmapLevel;

        if (!skybox_material) {
          var mat = new _material.Material();
          mat.initialize({
            effectName: 'pipeline/skybox',
            defines: {
              USE_RGBE_CUBEMAP: this.isRGBE
            }
          });
          skybox_material = new _materialInstance.MaterialInstance({
            parent: mat
          });
        } else {
          skybox_material.recompileShaders({
            USE_RGBE_CUBEMAP: this.isRGBE
          });
        }

        if (!skybox_mesh) {
          skybox_mesh = (0, _utils.createMesh)((0, _index2.box)({
            width: 2,
            height: 2,
            length: 2
          }));
        }

        this._model.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);

        this.envmap = this._envmap;

        this._updateGlobalBinding();

        this._updatePipeline();
      }
    }, {
      key: "_updatePipeline",
      value: function _updatePipeline() {
        var value = this.enabled ? this.useIBL ? this.isRGBE ? 2 : 1 : 0 : 0;
        var root = _globalExports.legacyCC.director.root;
        var pipeline = root.pipeline;
        var current = pipeline.macros.CC_USE_IBL;

        if (current === value) {
          return;
        }

        pipeline.macros.CC_USE_IBL = value;
        root.onGlobalPipelineStateChanged();
      }
    }, {
      key: "_updateGlobalBinding",
      value: function _updateGlobalBinding() {
        var texture = this.envmap.getGFXTexture();

        var sampler = _samplerLib.samplerLib.getSampler(_globalExports.legacyCC.director._device, this.envmap.getSamplerHash());

        this._globalDescriptorSet.bindSampler(_define.UNIFORM_ENVIRONMENT_BINDING, sampler);

        this._globalDescriptorSet.bindTexture(_define.UNIFORM_ENVIRONMENT_BINDING, texture);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._handle) {
          _memoryPools.SkyboxPool.free(this._handle);

          this._handle = _memoryPools.NULL_HANDLE;
        }
      }
    }]);

    return Skybox;
  }();

  _exports.Skybox = Skybox;
  _globalExports.legacyCC.Skybox = Skybox;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvc2t5Ym94LnRzIl0sIm5hbWVzIjpbInNreWJveF9tZXNoIiwic2t5Ym94X21hdGVyaWFsIiwiU2t5Ym94IiwiX21vZGVsIiwiU2t5Ym94UG9vbCIsImdldCIsIl9oYW5kbGUiLCJTa3lib3hWaWV3IiwiRU5BQkxFIiwidmFsIiwiYWN0aXZhdGUiLCJfdXBkYXRlUGlwZWxpbmUiLCJzZXQiLCJVU0VfSUJMIiwiSVNfUkdCRSIsInJlY29tcGlsZVNoYWRlcnMiLCJVU0VfUkdCRV9DVUJFTUFQIiwic2V0U3ViTW9kZWxNYXRlcmlhbCIsIl9lbnZtYXAiLCJfZGVmYXVsdCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwicGlwZWxpbmUiLCJhbWJpZW50IiwiYWxiZWRvQXJyYXkiLCJtaXBtYXBMZXZlbCIsIl91cGRhdGVHbG9iYWxCaW5kaW5nIiwiX2dsb2JhbERlc2NyaXB0b3JTZXQiLCJOVUxMX0hBTkRMRSIsImFsbG9jIiwiZGVzY3JpcHRvclNldCIsImJ1aWx0aW5SZXNNZ3IiLCJyZW5kZXJlciIsInNjZW5lIiwiTW9kZWwiLCJNT0RFTCIsImhhbmRsZSIsImdyb3VuZEFsYmVkbyIsIm1hdCIsIk1hdGVyaWFsIiwiaW5pdGlhbGl6ZSIsImVmZmVjdE5hbWUiLCJkZWZpbmVzIiwiaXNSR0JFIiwiTWF0ZXJpYWxJbnN0YW5jZSIsInBhcmVudCIsIndpZHRoIiwiaGVpZ2h0IiwibGVuZ3RoIiwiaW5pdFN1Yk1vZGVsIiwicmVuZGVyaW5nU3ViTWVzaGVzIiwiZW52bWFwIiwidmFsdWUiLCJlbmFibGVkIiwidXNlSUJMIiwiY3VycmVudCIsIm1hY3JvcyIsIkNDX1VTRV9JQkwiLCJvbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkIiwidGV4dHVyZSIsImdldEdGWFRleHR1cmUiLCJzYW1wbGVyIiwic2FtcGxlckxpYiIsImdldFNhbXBsZXIiLCJfZGV2aWNlIiwiZ2V0U2FtcGxlckhhc2giLCJiaW5kU2FtcGxlciIsIlVOSUZPUk1fRU5WSVJPTk1FTlRfQklORElORyIsImJpbmRUZXh0dXJlIiwiZnJlZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxNQUFJQSxXQUF3QixHQUFHLElBQS9CO0FBQ0EsTUFBSUMsZUFBZ0MsR0FBRyxJQUF2Qzs7TUFFYUMsTTs7OzBCQUNrQjtBQUN2QixlQUFPLEtBQUtDLE1BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUl3QjtBQUNwQixlQUFPQyx3QkFBV0MsR0FBWCxDQUFlLEtBQUtDLE9BQXBCLEVBQTZCQyx3QkFBV0MsTUFBeEMsQ0FBUDtBQUNILE87d0JBRVlDLEcsRUFBYztBQUN2QkEsUUFBQUEsR0FBRyxHQUFHLEtBQUtDLFFBQUwsRUFBSCxHQUFxQixLQUFLQyxlQUFMLEVBQXhCOztBQUNBUCxnQ0FBV1EsR0FBWCxDQUFlLEtBQUtOLE9BQXBCLEVBQTZCQyx3QkFBV0MsTUFBeEMsRUFBZ0RDLEdBQUcsR0FBRyxDQUFILEdBQU8sQ0FBMUQ7QUFDSDtBQUVEOzs7Ozs7OzBCQUl1QjtBQUNuQixlQUFPTCx3QkFBV0MsR0FBWCxDQUFlLEtBQUtDLE9BQXBCLEVBQTZCQyx3QkFBV00sT0FBeEMsQ0FBUDtBQUNILE87d0JBRVdKLEcsRUFBYztBQUN0QkwsZ0NBQVdRLEdBQVgsQ0FBZSxLQUFLTixPQUFwQixFQUE2QkMsd0JBQVdNLE9BQXhDLEVBQWlESixHQUFHLEdBQUcsQ0FBSCxHQUFPLENBQTNEOztBQUNBLGFBQUtFLGVBQUw7QUFDSDtBQUVEOzs7Ozs7OzBCQUl1QjtBQUNuQixlQUFPUCx3QkFBV0MsR0FBWCxDQUFlLEtBQUtDLE9BQXBCLEVBQTZCQyx3QkFBV08sT0FBeEMsQ0FBUDtBQUNILE87d0JBRVdMLEcsRUFBYztBQUN0QixZQUFJQSxHQUFKLEVBQVM7QUFDTCxjQUFJUixlQUFKLEVBQXFCO0FBQ2pCQSxZQUFBQSxlQUFlLENBQUNjLGdCQUFoQixDQUFpQztBQUFFQyxjQUFBQSxn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T0FBVCxFQUFrQjtBQUNkRixrQ0FBV2tFLElBQVgsQ0FBZ0IsS0FBS2hFLE9BQXJCOztBQUNBLGVBQUtBLE9BQUwsR0FBZXVCLHdCQUFmO0FBQ0g7QUFDSjs7Ozs7OztBQUdMVCwwQkFBU2xCLE1BQVQsR0FBa0JBLE1BQWxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbHRpblJlc01nciB9IGZyb20gJy4uLy4uLzNkL2J1aWx0aW4nO1xyXG5pbXBvcnQgeyBjcmVhdGVNZXNoIH0gZnJvbSAnLi4vLi4vM2QvbWlzYy91dGlscyc7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgTWVzaCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgVGV4dHVyZUN1YmUgfSBmcm9tICcuLi8uLi9hc3NldHMvdGV4dHVyZS1jdWJlJztcclxuaW1wb3J0IHsgVU5JRk9STV9FTlZJUk9OTUVOVF9CSU5ESU5HIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvZGVmaW5lJztcclxuaW1wb3J0IHsgYm94IH0gZnJvbSAnLi4vLi4vcHJpbWl0aXZlJztcclxuaW1wb3J0IHsgTWF0ZXJpYWxJbnN0YW5jZSB9IGZyb20gJy4uL2NvcmUvbWF0ZXJpYWwtaW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBzYW1wbGVyTGliIH0gZnJvbSAnLi4vY29yZS9zYW1wbGVyLWxpYic7XHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi9tb2RlbCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yU2V0IH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuaW1wb3J0IHsgU2t5Ym94UG9vbCwgTlVMTF9IQU5ETEUsIFNreWJveFZpZXcsIFNreWJveEhhbmRsZSB9IGZyb20gJy4uL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuXHJcbmxldCBza3lib3hfbWVzaDogTWVzaCB8IG51bGwgPSBudWxsO1xyXG5sZXQgc2t5Ym94X21hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNreWJveCB7XHJcbiAgICBnZXQgbW9kZWwgKCk6IE1vZGVsIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgYWN0aXZhdGUgc2t5Ym94IGluIHRoZSBzY2VuZVxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOWkqeepuuebku+8n1xyXG4gICAgICovXHJcbiAgICBnZXQgZW5hYmxlZCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIFNreWJveFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgU2t5Ym94Vmlldy5FTkFCTEUpIGFzIHVua25vd24gYXMgYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZW5hYmxlZCAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFsID8gdGhpcy5hY3RpdmF0ZSgpIDogdGhpcy5fdXBkYXRlUGlwZWxpbmUoKTtcclxuICAgICAgICBTa3lib3hQb29sLnNldCh0aGlzLl9oYW5kbGUsIFNreWJveFZpZXcuRU5BQkxFLCB2YWwgPyAxIDogMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2hldGhlciB1c2UgZW52aXJvbm1lbnQgbGlnaHRpbmdcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjnjq/looPlhYnnhafvvJ9cclxuICAgICAqL1xyXG4gICAgZ2V0IHVzZUlCTCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIFNreWJveFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgU2t5Ym94Vmlldy5VU0VfSUJMKSBhcyB1bmtub3duIGFzIGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHVzZUlCTCAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgU2t5Ym94UG9vbC5zZXQodGhpcy5faGFuZGxlLCBTa3lib3hWaWV3LlVTRV9JQkwsIHZhbCA/IDEgOiAwKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVQaXBlbGluZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgZW5hYmxlIFJHQkUgZGF0YSBzdXBwb3J0IGluIHNreWJveCBzaGFkZXJcclxuICAgICAqIEB6aCDmmK/lkKbpnIDopoHlvIDlkK8gc2hhZGVyIOWGheeahCBSR0JFIOaVsOaNruaUr+aMge+8n1xyXG4gICAgICovXHJcbiAgICBnZXQgaXNSR0JFICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gU2t5Ym94UG9vbC5nZXQodGhpcy5faGFuZGxlLCBTa3lib3hWaWV3LklTX1JHQkUpIGFzIHVua25vd24gYXMgYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaXNSR0JFICh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChza3lib3hfbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgIHNreWJveF9tYXRlcmlhbC5yZWNvbXBpbGVTaGFkZXJzKHsgVVNFX1JHQkVfQ1VCRU1BUDogdmFsIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLnNldFN1Yk1vZGVsTWF0ZXJpYWwoMCwgc2t5Ym94X21hdGVyaWFsISk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgU2t5Ym94UG9vbC5zZXQodGhpcy5faGFuZGxlLCBTa3lib3hWaWV3LklTX1JHQkUsIHZhbCA/IDEgOiAwKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVQaXBlbGluZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0ZXh0dXJlIGN1YmUgdXNlZCBmb3IgdGhlIHNreWJveFxyXG4gICAgICogQHpoIOS9v+eUqOeahOeri+aWueS9k+i0tOWbvlxyXG4gICAgICovXHJcbiAgICBnZXQgZW52bWFwICgpOiBUZXh0dXJlQ3ViZSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbnZtYXA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGVudm1hcCAodmFsOiBUZXh0dXJlQ3ViZSB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9lbnZtYXAgPSB2YWwgfHwgdGhpcy5fZGVmYXVsdDtcclxuICAgICAgICBpZiAodGhpcy5fZW52bWFwKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QucGlwZWxpbmUuYW1iaWVudC5hbGJlZG9BcnJheVszXSA9IHRoaXMuX2Vudm1hcC5taXBtYXBMZXZlbDtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlR2xvYmFsQmluZGluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Vudm1hcDogVGV4dHVyZUN1YmUgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfZ2xvYmFsRGVzY3JpcHRvclNldDogR0ZYRGVzY3JpcHRvclNldCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9tb2RlbDogTW9kZWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfZGVmYXVsdDogVGV4dHVyZUN1YmUgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfaGFuZGxlOiBTa3lib3hIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuXHJcbiAgICBnZXQgaGFuZGxlICgpIDogU2t5Ym94SGFuZGxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSBTa3lib3hQb29sLmFsbG9jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2YXRlICgpIHtcclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QucGlwZWxpbmU7XHJcbiAgICAgICAgdGhpcy5fZ2xvYmFsRGVzY3JpcHRvclNldCA9IHBpcGVsaW5lLmRlc2NyaXB0b3JTZXQ7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdCA9IGJ1aWx0aW5SZXNNZ3IuZ2V0PFRleHR1cmVDdWJlPignZGVmYXVsdC1jdWJlLXRleHR1cmUnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbCA9IG5ldyBsZWdhY3lDQy5yZW5kZXJlci5zY2VuZS5Nb2RlbCgpIGFzIE1vZGVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU2t5Ym94UG9vbC5zZXQodGhpcy5faGFuZGxlLCBTa3lib3hWaWV3Lk1PREVMLCB0aGlzLl9tb2RlbC5oYW5kbGUpO1xyXG5cclxuICAgICAgICBwaXBlbGluZS5hbWJpZW50Lmdyb3VuZEFsYmVkb1szXSA9IHRoaXMuX2Vudm1hcCA/IHRoaXMuX2Vudm1hcC5taXBtYXBMZXZlbCA6IHRoaXMuX2RlZmF1bHQubWlwbWFwTGV2ZWw7XHJcblxyXG4gICAgICAgIGlmICghc2t5Ym94X21hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdCA9IG5ldyBNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICBtYXQuaW5pdGlhbGl6ZSh7IGVmZmVjdE5hbWU6ICdwaXBlbGluZS9za3lib3gnLCBkZWZpbmVzOiB7IFVTRV9SR0JFX0NVQkVNQVA6IHRoaXMuaXNSR0JFIH0gfSk7XHJcbiAgICAgICAgICAgIHNreWJveF9tYXRlcmlhbCA9IG5ldyBNYXRlcmlhbEluc3RhbmNlKHsgcGFyZW50OiBtYXQgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2t5Ym94X21hdGVyaWFsLnJlY29tcGlsZVNoYWRlcnMoeyBVU0VfUkdCRV9DVUJFTUFQOiB0aGlzLmlzUkdCRSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2t5Ym94X21lc2gpIHsgc2t5Ym94X21lc2ggPSBjcmVhdGVNZXNoKGJveCh7IHdpZHRoOiAyLCBoZWlnaHQ6IDIsIGxlbmd0aDogMiB9KSk7IH1cclxuICAgICAgICB0aGlzLl9tb2RlbC5pbml0U3ViTW9kZWwoMCwgc2t5Ym94X21lc2gucmVuZGVyaW5nU3ViTWVzaGVzWzBdLCBza3lib3hfbWF0ZXJpYWwpO1xyXG5cclxuICAgICAgICB0aGlzLmVudm1hcCA9IHRoaXMuX2Vudm1hcDtcclxuICAgICAgICB0aGlzLl91cGRhdGVHbG9iYWxCaW5kaW5nKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUGlwZWxpbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVBpcGVsaW5lICgpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZW5hYmxlZCA/ICh0aGlzLnVzZUlCTCA/IHRoaXMuaXNSR0JFID8gMiA6IDEgOiAwKSA6IDA7XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3Q7XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSByb290LnBpcGVsaW5lO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBwaXBlbGluZS5tYWNyb3MuQ0NfVVNFX0lCTDtcclxuICAgICAgICBpZiAoY3VycmVudCA9PT0gdmFsdWUpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgcGlwZWxpbmUubWFjcm9zLkNDX1VTRV9JQkwgPSB2YWx1ZTtcclxuICAgICAgICByb290Lm9uR2xvYmFsUGlwZWxpbmVTdGF0ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZUdsb2JhbEJpbmRpbmcgKCkge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSB0aGlzLmVudm1hcCEuZ2V0R0ZYVGV4dHVyZSgpITtcclxuICAgICAgICBjb25zdCBzYW1wbGVyID0gc2FtcGxlckxpYi5nZXRTYW1wbGVyKGxlZ2FjeUNDLmRpcmVjdG9yLl9kZXZpY2UsIHRoaXMuZW52bWFwIS5nZXRTYW1wbGVySGFzaCgpKTtcclxuICAgICAgICB0aGlzLl9nbG9iYWxEZXNjcmlwdG9yU2V0IS5iaW5kU2FtcGxlcihVTklGT1JNX0VOVklST05NRU5UX0JJTkRJTkcsIHNhbXBsZXIpO1xyXG4gICAgICAgIHRoaXMuX2dsb2JhbERlc2NyaXB0b3JTZXQhLmJpbmRUZXh0dXJlKFVOSUZPUk1fRU5WSVJPTk1FTlRfQklORElORywgdGV4dHVyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGUpIHtcclxuICAgICAgICAgICAgU2t5Ym94UG9vbC5mcmVlKHRoaXMuX2hhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuU2t5Ym94ID0gU2t5Ym94O1xyXG4iXX0=