(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../geometry/index.js", "../define.js", "../instanced-buffer.js", "../pipeline-state-manager.js", "../../renderer/core/memory-pools.js", "../../renderer/scene/shadows.js", "../../scene-graph/layers.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../geometry/index.js"), require("../define.js"), require("../instanced-buffer.js"), require("../pipeline-state-manager.js"), require("../../renderer/core/memory-pools.js"), require("../../renderer/scene/shadows.js"), require("../../scene-graph/layers.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.instancedBuffer, global.pipelineStateManager, global.memoryPools, global.shadows, global.layers);
    global.planarShadowQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _instancedBuffer, _pipelineStateManager, _memoryPools, _shadows, _layers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PlanarShadowQueue = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _ab = new _index.aabb();

  var PlanarShadowQueue = /*#__PURE__*/function () {
    function PlanarShadowQueue(pipeline) {
      _classCallCheck(this, PlanarShadowQueue);

      this._pendingModels = [];
      this._record = new Map();
      this._pipeline = pipeline;
    }

    _createClass(PlanarShadowQueue, [{
      key: "createShadowData",
      value: function createShadowData(model) {
        var shaders = [];
        var shadows = this._pipeline.shadows;
        var material = model.isInstancingEnabled ? shadows.instancingMaterial : shadows.material;
        var instancedBuffer = model.isInstancingEnabled ? _instancedBuffer.InstancedBuffer.get(material.passes[0]) : null;
        var subModels = model.subModels;

        for (var i = 0; i < subModels.length; i++) {
          var hShader = _memoryPools.SubModelPool.get(subModels[i].handle, _memoryPools.SubModelView.SHADER_0);

          shaders.push(_memoryPools.ShaderPool.get(hShader));
        }

        return {
          model: model,
          shaders: shaders,
          instancedBuffer: instancedBuffer
        };
      }
    }, {
      key: "updateShadowList",
      value: function updateShadowList(view) {
        this._pendingModels.length = 0;
        var shadows = this._pipeline.shadows;

        if (!shadows.enabled || shadows.type !== _shadows.ShadowType.Planar) {
          return;
        }

        var camera = view.camera;
        var scene = camera.scene;
        var frstm = camera.frustum;
        var shadowVisible = (camera.visibility & _layers.Layers.BitMask.DEFAULT) !== 0;

        if (!scene.mainLight || !shadowVisible) {
          return;
        }

        var models = scene.models;

        for (var i = 0; i < models.length; i++) {
          var model = models[i];

          if (!model.enabled || !model.node || !model.castShadow) {
            continue;
          }

          if (model.worldBounds) {
            _index.aabb.transform(_ab, model.worldBounds, shadows.matLight);

            if (!_index.intersect.aabb_frustum(_ab, frstm)) {
              continue;
            }
          }

          var data = this.createShadowData(model);

          this._pendingModels.push(data);
        }
      }
    }, {
      key: "recordCommandBuffer",
      value: function recordCommandBuffer(device, renderPass, cmdBuff) {
        var shadows = this._pipeline.shadows;

        if (!shadows.enabled || shadows.type !== _shadows.ShadowType.Planar) {
          return;
        }

        var models = this._pendingModels;
        var modelLen = models.length;

        if (!modelLen) {
          return;
        }

        var buffer = _instancedBuffer.InstancedBuffer.get(shadows.instancingMaterial.passes[0]);

        if (buffer) {
          buffer.clear();
        }

        var hPass = shadows.material.passes[0].handle;

        var descriptorSet = _memoryPools.DSPool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DESCRIPTOR_SET));

        cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, descriptorSet);

        for (var i = 0; i < modelLen; i++) {
          var _models$i = models[i],
              model = _models$i.model,
              shaders = _models$i.shaders,
              instancedBuffer = _models$i.instancedBuffer;

          for (var j = 0; j < shaders.length; j++) {
            var subModel = model.subModels[j];
            var shader = shaders[j];

            if (instancedBuffer) {
              instancedBuffer.merge(subModel, model.instancedAttributes, 0);
            } else {
              var ia = subModel.inputAssembler;

              var pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, ia);

              cmdBuff.bindPipelineState(pso);
              cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, subModel.descriptorSet);
              cmdBuff.bindInputAssembler(ia);
              cmdBuff.draw(ia);
            }
          }
        }

        if (buffer && buffer.hasPendingModels) {
          buffer.uploadBuffers();
          descriptorSet = _memoryPools.DSPool.get(_memoryPools.PassPool.get(buffer.hPass, _memoryPools.PassView.DESCRIPTOR_SET));
          cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, descriptorSet);
          var lastPSO = null;

          for (var b = 0; b < buffer.instances.length; ++b) {
            var instance = buffer.instances[b];

            if (!instance.count) {
              continue;
            }

            var _shader = _memoryPools.ShaderPool.get(instance.hShader);

            var _pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, buffer.hPass, _shader, renderPass, instance.ia);

            if (lastPSO !== _pso) {
              cmdBuff.bindPipelineState(_pso);
              cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, _memoryPools.DSPool.get(instance.hDescriptorSet));
              lastPSO = _pso;
            }

            cmdBuff.bindInputAssembler(instance.ia);
            cmdBuff.draw(instance.ia);
          }
        }
      }
    }]);

    return PlanarShadowQueue;
  }();

  _exports.PlanarShadowQueue = PlanarShadowQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvcGxhbmFyLXNoYWRvdy1xdWV1ZS50cyJdLCJuYW1lcyI6WyJfYWIiLCJhYWJiIiwiUGxhbmFyU2hhZG93UXVldWUiLCJwaXBlbGluZSIsIl9wZW5kaW5nTW9kZWxzIiwiX3JlY29yZCIsIk1hcCIsIl9waXBlbGluZSIsIm1vZGVsIiwic2hhZGVycyIsInNoYWRvd3MiLCJtYXRlcmlhbCIsImlzSW5zdGFuY2luZ0VuYWJsZWQiLCJpbnN0YW5jaW5nTWF0ZXJpYWwiLCJpbnN0YW5jZWRCdWZmZXIiLCJJbnN0YW5jZWRCdWZmZXIiLCJnZXQiLCJwYXNzZXMiLCJzdWJNb2RlbHMiLCJpIiwibGVuZ3RoIiwiaFNoYWRlciIsIlN1Yk1vZGVsUG9vbCIsImhhbmRsZSIsIlN1Yk1vZGVsVmlldyIsIlNIQURFUl8wIiwicHVzaCIsIlNoYWRlclBvb2wiLCJ2aWV3IiwiZW5hYmxlZCIsInR5cGUiLCJTaGFkb3dUeXBlIiwiUGxhbmFyIiwiY2FtZXJhIiwic2NlbmUiLCJmcnN0bSIsImZydXN0dW0iLCJzaGFkb3dWaXNpYmxlIiwidmlzaWJpbGl0eSIsIkxheWVycyIsIkJpdE1hc2siLCJERUZBVUxUIiwibWFpbkxpZ2h0IiwibW9kZWxzIiwibm9kZSIsImNhc3RTaGFkb3ciLCJ3b3JsZEJvdW5kcyIsInRyYW5zZm9ybSIsIm1hdExpZ2h0IiwiaW50ZXJzZWN0IiwiYWFiYl9mcnVzdHVtIiwiZGF0YSIsImNyZWF0ZVNoYWRvd0RhdGEiLCJkZXZpY2UiLCJyZW5kZXJQYXNzIiwiY21kQnVmZiIsIm1vZGVsTGVuIiwiYnVmZmVyIiwiY2xlYXIiLCJoUGFzcyIsImRlc2NyaXB0b3JTZXQiLCJEU1Bvb2wiLCJQYXNzUG9vbCIsIlBhc3NWaWV3IiwiREVTQ1JJUFRPUl9TRVQiLCJiaW5kRGVzY3JpcHRvclNldCIsIlNldEluZGV4IiwiTUFURVJJQUwiLCJqIiwic3ViTW9kZWwiLCJzaGFkZXIiLCJtZXJnZSIsImluc3RhbmNlZEF0dHJpYnV0ZXMiLCJpYSIsImlucHV0QXNzZW1ibGVyIiwicHNvIiwiUGlwZWxpbmVTdGF0ZU1hbmFnZXIiLCJnZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUiLCJiaW5kUGlwZWxpbmVTdGF0ZSIsIkxPQ0FMIiwiYmluZElucHV0QXNzZW1ibGVyIiwiZHJhdyIsImhhc1BlbmRpbmdNb2RlbHMiLCJ1cGxvYWRCdWZmZXJzIiwibGFzdFBTTyIsImIiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZSIsImNvdW50IiwiaERlc2NyaXB0b3JTZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsTUFBTUEsR0FBRyxHQUFHLElBQUlDLFdBQUosRUFBWjs7TUFRYUMsaUI7QUFLVCwrQkFBYUMsUUFBYixFQUF5QztBQUFBOztBQUFBLFdBSmpDQyxjQUlpQyxHQUpLLEVBSUw7QUFBQSxXQUhqQ0MsT0FHaUMsR0FIdkIsSUFBSUMsR0FBSixFQUd1QjtBQUNyQyxXQUFLQyxTQUFMLEdBQWlCSixRQUFqQjtBQUNIOzs7O3VDQUV5QkssSyxFQUFpQztBQUN2RCxZQUFNQyxPQUFvQixHQUFHLEVBQTdCO0FBQ0EsWUFBTUMsT0FBTyxHQUFHLEtBQUtILFNBQUwsQ0FBZUcsT0FBL0I7QUFDQSxZQUFNQyxRQUFRLEdBQUdILEtBQUssQ0FBQ0ksbUJBQU4sR0FBNEJGLE9BQU8sQ0FBQ0csa0JBQXBDLEdBQXlESCxPQUFPLENBQUNDLFFBQWxGO0FBQ0EsWUFBTUcsZUFBZSxHQUFHTixLQUFLLENBQUNJLG1CQUFOLEdBQTRCRyxpQ0FBZ0JDLEdBQWhCLENBQW9CTCxRQUFRLENBQUNNLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBcEIsQ0FBNUIsR0FBc0UsSUFBOUY7QUFDQSxZQUFNQyxTQUFTLEdBQUdWLEtBQUssQ0FBQ1UsU0FBeEI7O0FBQ0EsYUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxTQUFTLENBQUNFLE1BQTlCLEVBQXND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REksTUFBTSxDQUFDRSxLQUE3RCxFQUFvRVcsT0FBcEUsRUFBNEVoQixVQUE1RSxFQUF3RmlDLFFBQVEsQ0FBQ2QsRUFBakcsQ0FBWjs7QUFDQSxnQkFBSVcsT0FBTyxLQUFLVCxJQUFoQixFQUFxQjtBQUNqQnBCLGNBQUFBLE9BQU8sQ0FBQ3VCLGlCQUFSLENBQTBCSCxJQUExQjtBQUNBcEIsY0FBQUEsT0FBTyxDQUFDVSxpQkFBUixDQUEwQkMsaUJBQVNhLEtBQW5DLEVBQTBDbEIsb0JBQU83QyxHQUFQLENBQVd1RSxRQUFRLENBQUNFLGNBQXBCLENBQTFDO0FBQ0FMLGNBQUFBLE9BQU8sR0FBR1QsSUFBVjtBQUNIOztBQUNEcEIsWUFBQUEsT0FBTyxDQUFDeUIsa0JBQVIsQ0FBMkJPLFFBQVEsQ0FBQ2QsRUFBcEM7QUFDQWxCLFlBQUFBLE9BQU8sQ0FBQzBCLElBQVIsQ0FBYU0sUUFBUSxDQUFDZCxFQUF0QjtBQUNIO0FBQ0o7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFhYmIsIGludGVyc2VjdH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBHRlhQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi4vLi4vZ2Z4L3BpcGVsaW5lLXN0YXRlJztcclxuaW1wb3J0IHsgU2V0SW5kZXh9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIsIEdGWERldmljZSwgR0ZYUmVuZGVyUGFzcywgR0ZYU2hhZGVyfSBmcm9tICcuLi8uLi9nZngnO1xyXG5pbXBvcnQgeyBJbnN0YW5jZWRCdWZmZXIgfSBmcm9tICcuLi9pbnN0YW5jZWQtYnVmZmVyJztcclxuaW1wb3J0IHsgUGlwZWxpbmVTdGF0ZU1hbmFnZXIgfSBmcm9tICcuLi8uLi9waXBlbGluZS9waXBlbGluZS1zdGF0ZS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9zY2VuZSc7XHJcbmltcG9ydCB7IERTUG9vbCwgU2hhZGVyUG9vbCwgUGFzc1Bvb2wsIFBhc3NWaWV3LCBTdWJNb2RlbFBvb2wsIFN1Yk1vZGVsVmlldyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuaW1wb3J0IHsgRGVmZXJyZWRQaXBlbGluZSB9IGZyb20gJy4vZGVmZXJyZWQtcGlwZWxpbmUnO1xyXG5pbXBvcnQgeyBTaGFkb3dUeXBlIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvc2NlbmUvc2hhZG93cyc7XHJcbmltcG9ydCB7IFJlbmRlclZpZXcgfSBmcm9tICcuLi9yZW5kZXItdmlldyc7XHJcbmltcG9ydCB7IExheWVycyB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL2xheWVycyc7XHJcblxyXG5jb25zdCBfYWIgPSBuZXcgYWFiYigpO1xyXG5cclxuaW50ZXJmYWNlIElTaGFkb3dSZW5kZXJEYXRhIHtcclxuICAgIG1vZGVsOiBNb2RlbDtcclxuICAgIHNoYWRlcnM6IEdGWFNoYWRlcltdO1xyXG4gICAgaW5zdGFuY2VkQnVmZmVyOiBJbnN0YW5jZWRCdWZmZXIgfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGxhbmFyU2hhZG93UXVldWUge1xyXG4gICAgcHJpdmF0ZSBfcGVuZGluZ01vZGVsczogSVNoYWRvd1JlbmRlckRhdGFbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfcmVjb3JkID0gbmV3IE1hcDxNb2RlbCwgSVNoYWRvd1JlbmRlckRhdGE+KCk7XHJcbiAgICBwcm90ZWN0ZWQgZGVjbGFyZSBfcGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHBpcGVsaW5lOiBEZWZlcnJlZFBpcGVsaW5lKSB7XHJcbiAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBwaXBlbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNoYWRvd0RhdGEgKG1vZGVsOiBNb2RlbCk6IElTaGFkb3dSZW5kZXJEYXRhIHtcclxuICAgICAgICBjb25zdCBzaGFkZXJzOiBHRlhTaGFkZXJbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHNoYWRvd3MgPSB0aGlzLl9waXBlbGluZS5zaGFkb3dzO1xyXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbW9kZWwuaXNJbnN0YW5jaW5nRW5hYmxlZCA/IHNoYWRvd3MuaW5zdGFuY2luZ01hdGVyaWFsIDogc2hhZG93cy5tYXRlcmlhbDtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZWRCdWZmZXIgPSBtb2RlbC5pc0luc3RhbmNpbmdFbmFibGVkID8gSW5zdGFuY2VkQnVmZmVyLmdldChtYXRlcmlhbC5wYXNzZXNbMF0pIDogbnVsbDtcclxuICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSBtb2RlbC5zdWJNb2RlbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaFNoYWRlciA9IFN1Yk1vZGVsUG9vbC5nZXQoc3ViTW9kZWxzW2ldLmhhbmRsZSwgU3ViTW9kZWxWaWV3LlNIQURFUl8wKTtcclxuICAgICAgICAgICAgc2hhZGVycy5wdXNoKFNoYWRlclBvb2wuZ2V0KGhTaGFkZXIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgbW9kZWwsIHNoYWRlcnMsIGluc3RhbmNlZEJ1ZmZlciB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVTaGFkb3dMaXN0ICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ01vZGVscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGNvbnN0IHNoYWRvd3MgPSB0aGlzLl9waXBlbGluZS5zaGFkb3dzO1xyXG4gICAgICAgIGlmICghc2hhZG93cy5lbmFibGVkIHx8IHNoYWRvd3MudHlwZSAhPT0gU2hhZG93VHlwZS5QbGFuYXIpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdmlldy5jYW1lcmE7XHJcbiAgICAgICAgY29uc3Qgc2NlbmUgPSBjYW1lcmEuc2NlbmUhO1xyXG4gICAgICAgIGNvbnN0IGZyc3RtID0gY2FtZXJhLmZydXN0dW07XHJcbiAgICAgICAgY29uc3Qgc2hhZG93VmlzaWJsZSA9ICAoY2FtZXJhLnZpc2liaWxpdHkgJiBMYXllcnMuQml0TWFzay5ERUZBVUxUKSAhPT0gMDtcclxuICAgICAgICBpZiAoIXNjZW5lLm1haW5MaWdodCB8fCAhc2hhZG93VmlzaWJsZSkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBtb2RlbHMgPSBzY2VuZS5tb2RlbHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gbW9kZWxzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIW1vZGVsLmVuYWJsZWQgfHwgIW1vZGVsLm5vZGUgfHwgIW1vZGVsLmNhc3RTaGFkb3cpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgaWYgKG1vZGVsLndvcmxkQm91bmRzKSB7XHJcbiAgICAgICAgICAgICAgICBhYWJiLnRyYW5zZm9ybShfYWIsIG1vZGVsLndvcmxkQm91bmRzLCBzaGFkb3dzLm1hdExpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGlmICghaW50ZXJzZWN0LmFhYmJfZnJ1c3R1bShfYWIsIGZyc3RtKSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmNyZWF0ZVNoYWRvd0RhdGEobW9kZWwpO1xyXG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nTW9kZWxzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvcmRDb21tYW5kQnVmZmVyIChkZXZpY2U6IEdGWERldmljZSwgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcywgY21kQnVmZjogR0ZYQ29tbWFuZEJ1ZmZlcikge1xyXG4gICAgICAgIGNvbnN0IHNoYWRvd3MgPSB0aGlzLl9waXBlbGluZS5zaGFkb3dzO1xyXG4gICAgICAgIGlmICghc2hhZG93cy5lbmFibGVkIHx8IHNoYWRvd3MudHlwZSAhPT0gU2hhZG93VHlwZS5QbGFuYXIpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuX3BlbmRpbmdNb2RlbHM7XHJcbiAgICAgICAgY29uc3QgbW9kZWxMZW4gPSBtb2RlbHMubGVuZ3RoO1xyXG4gICAgICAgIGlmICghbW9kZWxMZW4pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gSW5zdGFuY2VkQnVmZmVyLmdldChzaGFkb3dzLmluc3RhbmNpbmdNYXRlcmlhbC5wYXNzZXNbMF0pO1xyXG4gICAgICAgIGlmIChidWZmZXIpIHsgYnVmZmVyLmNsZWFyKCk7IH1cclxuICAgICAgICBjb25zdCBoUGFzcyA9IHNoYWRvd3MubWF0ZXJpYWwucGFzc2VzWzBdLmhhbmRsZTtcclxuICAgICAgICBsZXQgZGVzY3JpcHRvclNldCA9IERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpO1xyXG4gICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTUFURVJJQUwsIGRlc2NyaXB0b3JTZXQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kZWxMZW47IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB7IG1vZGVsLCBzaGFkZXJzLCBpbnN0YW5jZWRCdWZmZXIgfSA9IG1vZGVsc1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaGFkZXJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNb2RlbCA9IG1vZGVsLnN1Yk1vZGVsc1tqXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYWRlciA9IHNoYWRlcnNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2VkQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VkQnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCBtb2RlbC5pbnN0YW5jZWRBdHRyaWJ1dGVzLCAwKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWEgPSBzdWJNb2RlbC5pbnB1dEFzc2VtYmxlciE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHNvID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgaFBhc3MsIHNoYWRlciwgcmVuZGVyUGFzcywgaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZFBpcGVsaW5lU3RhdGUocHNvKTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmREZXNjcmlwdG9yU2V0KFNldEluZGV4LkxPQ0FMLCBzdWJNb2RlbC5kZXNjcmlwdG9yU2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmRJbnB1dEFzc2VtYmxlcihpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kQnVmZi5kcmF3KGlhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5oYXNQZW5kaW5nTW9kZWxzKSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlci51cGxvYWRCdWZmZXJzKCk7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQgPSBEU1Bvb2wuZ2V0KFBhc3NQb29sLmdldChidWZmZXIuaFBhc3MsIFBhc3NWaWV3LkRFU0NSSVBUT1JfU0VUKSk7XHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTUFURVJJQUwsIGRlc2NyaXB0b3JTZXQpO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFBTTzogR0ZYUGlwZWxpbmVTdGF0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IGJ1ZmZlci5pbnN0YW5jZXMubGVuZ3RoOyArK2IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVmZmVyLmluc3RhbmNlc1tiXTtcclxuICAgICAgICAgICAgICAgIGlmICghaW5zdGFuY2UuY291bnQpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYWRlciA9IFNoYWRlclBvb2wuZ2V0KGluc3RhbmNlLmhTaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHNvID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgYnVmZmVyLmhQYXNzLCBzaGFkZXIsIHJlbmRlclBhc3MsIGluc3RhbmNlLmlhKTtcclxuICAgICAgICAgICAgICAgIGlmIChsYXN0UFNPICE9PSBwc28pIHtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmRQaXBlbGluZVN0YXRlKHBzbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5MT0NBTCwgRFNQb29sLmdldChpbnN0YW5jZS5oRGVzY3JpcHRvclNldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RQU08gPSBwc287XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmRJbnB1dEFzc2VtYmxlcihpbnN0YW5jZS5pYSk7XHJcbiAgICAgICAgICAgICAgICBjbWRCdWZmLmRyYXcoaW5zdGFuY2UuaWEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==