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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZm9yd2FyZC9wbGFuYXItc2hhZG93LXF1ZXVlLnRzIl0sIm5hbWVzIjpbIl9hYiIsImFhYmIiLCJQbGFuYXJTaGFkb3dRdWV1ZSIsInBpcGVsaW5lIiwiX3BlbmRpbmdNb2RlbHMiLCJfcmVjb3JkIiwiTWFwIiwiX3BpcGVsaW5lIiwibW9kZWwiLCJzaGFkZXJzIiwic2hhZG93cyIsIm1hdGVyaWFsIiwiaXNJbnN0YW5jaW5nRW5hYmxlZCIsImluc3RhbmNpbmdNYXRlcmlhbCIsImluc3RhbmNlZEJ1ZmZlciIsIkluc3RhbmNlZEJ1ZmZlciIsImdldCIsInBhc3NlcyIsInN1Yk1vZGVscyIsImkiLCJsZW5ndGgiLCJoU2hhZGVyIiwiU3ViTW9kZWxQb29sIiwiaGFuZGxlIiwiU3ViTW9kZWxWaWV3IiwiU0hBREVSXzAiLCJwdXNoIiwiU2hhZGVyUG9vbCIsInZpZXciLCJlbmFibGVkIiwidHlwZSIsIlNoYWRvd1R5cGUiLCJQbGFuYXIiLCJjYW1lcmEiLCJzY2VuZSIsImZyc3RtIiwiZnJ1c3R1bSIsInNoYWRvd1Zpc2libGUiLCJ2aXNpYmlsaXR5IiwiTGF5ZXJzIiwiQml0TWFzayIsIkRFRkFVTFQiLCJtYWluTGlnaHQiLCJtb2RlbHMiLCJub2RlIiwiY2FzdFNoYWRvdyIsIndvcmxkQm91bmRzIiwidHJhbnNmb3JtIiwibWF0TGlnaHQiLCJpbnRlcnNlY3QiLCJhYWJiX2ZydXN0dW0iLCJkYXRhIiwiY3JlYXRlU2hhZG93RGF0YSIsImRldmljZSIsInJlbmRlclBhc3MiLCJjbWRCdWZmIiwibW9kZWxMZW4iLCJidWZmZXIiLCJjbGVhciIsImhQYXNzIiwiZGVzY3JpcHRvclNldCIsIkRTUG9vbCIsIlBhc3NQb29sIiwiUGFzc1ZpZXciLCJERVNDUklQVE9SX1NFVCIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJNQVRFUklBTCIsImoiLCJzdWJNb2RlbCIsInNoYWRlciIsIm1lcmdlIiwiaW5zdGFuY2VkQXR0cmlidXRlcyIsImlhIiwiaW5wdXRBc3NlbWJsZXIiLCJwc28iLCJQaXBlbGluZVN0YXRlTWFuYWdlciIsImdldE9yQ3JlYXRlUGlwZWxpbmVTdGF0ZSIsImJpbmRQaXBlbGluZVN0YXRlIiwiTE9DQUwiLCJiaW5kSW5wdXRBc3NlbWJsZXIiLCJkcmF3IiwiaGFzUGVuZGluZ01vZGVscyIsInVwbG9hZEJ1ZmZlcnMiLCJsYXN0UFNPIiwiYiIsImluc3RhbmNlcyIsImluc3RhbmNlIiwiY291bnQiLCJoRGVzY3JpcHRvclNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxNQUFNQSxHQUFHLEdBQUcsSUFBSUMsV0FBSixFQUFaOztNQVFhQyxpQjtBQUtULCtCQUFhQyxRQUFiLEVBQXdDO0FBQUE7O0FBQUEsV0FKaENDLGNBSWdDLEdBSk0sRUFJTjtBQUFBLFdBSGhDQyxPQUdnQyxHQUh0QixJQUFJQyxHQUFKLEVBR3NCO0FBQ3BDLFdBQUtDLFNBQUwsR0FBaUJKLFFBQWpCO0FBQ0g7Ozs7dUNBRXlCSyxLLEVBQWlDO0FBQ3ZELFlBQU1DLE9BQW9CLEdBQUcsRUFBN0I7QUFDQSxZQUFNQyxPQUFPLEdBQUcsS0FBS0gsU0FBTCxDQUFlRyxPQUEvQjtBQUNBLFlBQU1DLFFBQVEsR0FBR0gsS0FBSyxDQUFDSSxtQkFBTixHQUE0QkYsT0FBTyxDQUFDRyxrQkFBcEMsR0FBeURILE9BQU8sQ0FBQ0MsUUFBbEY7QUFDQSxZQUFNRyxlQUFlLEdBQUdOLEtBQUssQ0FBQ0ksbUJBQU4sR0FBNEJHLGlDQUFnQkMsR0FBaEIsQ0FBb0JMLFFBQVEsQ0FBQ00sTUFBVCxDQUFnQixDQUFoQixDQUFwQixDQUE1QixHQUFzRSxJQUE5RjtBQUNBLFlBQU1DLFNBQVMsR0FBR1YsS0FBSyxDQUFDVSxTQUF4Qjs7QUFDQSxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELFNBQVMsQ0FBQ0UsTUFBOUIsRUFBc0NE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SSxNQUFNLENBQUNFLEtBQTdELEVBQW9FVyxPQUFwRSxFQUE0RWhCLFVBQTVFLEVBQXdGaUMsUUFBUSxDQUFDZCxFQUFqRyxDQUFaOztBQUNBLGdCQUFJVyxPQUFPLEtBQUtULElBQWhCLEVBQXFCO0FBQ2pCcEIsY0FBQUEsT0FBTyxDQUFDdUIsaUJBQVIsQ0FBMEJILElBQTFCO0FBQ0FwQixjQUFBQSxPQUFPLENBQUNVLGlCQUFSLENBQTBCQyxpQkFBU2EsS0FBbkMsRUFBMENsQixvQkFBTzdDLEdBQVAsQ0FBV3VFLFFBQVEsQ0FBQ0UsY0FBcEIsQ0FBMUM7QUFDQUwsY0FBQUEsT0FBTyxHQUFHVCxJQUFWO0FBQ0g7O0FBQ0RwQixZQUFBQSxPQUFPLENBQUN5QixrQkFBUixDQUEyQk8sUUFBUSxDQUFDZCxFQUFwQztBQUNBbEIsWUFBQUEsT0FBTyxDQUFDMEIsSUFBUixDQUFhTSxRQUFRLENBQUNkLEVBQXRCO0FBQ0g7QUFDSjtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYWFiYiwgaW50ZXJzZWN0fSBmcm9tICcuLi8uLi9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IEdGWFBpcGVsaW5lU3RhdGUgfSBmcm9tICcuLi8uLi9nZngvcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBTZXRJbmRleH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYQ29tbWFuZEJ1ZmZlciwgR0ZYRGV2aWNlLCBHRlhSZW5kZXJQYXNzLCBHRlhTaGFkZXJ9IGZyb20gJy4uLy4uL2dmeCc7XHJcbmltcG9ydCB7IEluc3RhbmNlZEJ1ZmZlciB9IGZyb20gJy4uL2luc3RhbmNlZC1idWZmZXInO1xyXG5pbXBvcnQgeyBQaXBlbGluZVN0YXRlTWFuYWdlciB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL3BpcGVsaW5lLXN0YXRlLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3NjZW5lJztcclxuaW1wb3J0IHsgRFNQb29sLCBTaGFkZXJQb29sLCBQYXNzUG9vbCwgUGFzc1ZpZXcsIFN1Yk1vZGVsUG9vbCwgU3ViTW9kZWxWaWV3IH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9tZW1vcnktcG9vbHMnO1xyXG5pbXBvcnQgeyBGb3J3YXJkUGlwZWxpbmUgfSBmcm9tICcuL2ZvcndhcmQtcGlwZWxpbmUnO1xyXG5pbXBvcnQgeyBTaGFkb3dUeXBlIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvc2NlbmUvc2hhZG93cyc7XHJcbmltcG9ydCB7IFJlbmRlclZpZXcgfSBmcm9tICcuLi9yZW5kZXItdmlldyc7XHJcbmltcG9ydCB7IExheWVycyB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL2xheWVycyc7XHJcblxyXG5jb25zdCBfYWIgPSBuZXcgYWFiYigpO1xyXG5cclxuaW50ZXJmYWNlIElTaGFkb3dSZW5kZXJEYXRhIHtcclxuICAgIG1vZGVsOiBNb2RlbDtcclxuICAgIHNoYWRlcnM6IEdGWFNoYWRlcltdO1xyXG4gICAgaW5zdGFuY2VkQnVmZmVyOiBJbnN0YW5jZWRCdWZmZXIgfCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGxhbmFyU2hhZG93UXVldWUge1xyXG4gICAgcHJpdmF0ZSBfcGVuZGluZ01vZGVsczogSVNoYWRvd1JlbmRlckRhdGFbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfcmVjb3JkID0gbmV3IE1hcDxNb2RlbCwgSVNoYWRvd1JlbmRlckRhdGE+KCk7XHJcbiAgICBwcm90ZWN0ZWQgZGVjbGFyZSBfcGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHBpcGVsaW5lOiBGb3J3YXJkUGlwZWxpbmUpIHtcclxuICAgICAgICB0aGlzLl9waXBlbGluZSA9IHBpcGVsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU2hhZG93RGF0YSAobW9kZWw6IE1vZGVsKTogSVNoYWRvd1JlbmRlckRhdGEge1xyXG4gICAgICAgIGNvbnN0IHNoYWRlcnM6IEdGWFNoYWRlcltdID0gW107XHJcbiAgICAgICAgY29uc3Qgc2hhZG93cyA9IHRoaXMuX3BpcGVsaW5lLnNoYWRvd3M7XHJcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBtb2RlbC5pc0luc3RhbmNpbmdFbmFibGVkID8gc2hhZG93cy5pbnN0YW5jaW5nTWF0ZXJpYWwgOiBzaGFkb3dzLm1hdGVyaWFsO1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlZEJ1ZmZlciA9IG1vZGVsLmlzSW5zdGFuY2luZ0VuYWJsZWQgPyBJbnN0YW5jZWRCdWZmZXIuZ2V0KG1hdGVyaWFsLnBhc3Nlc1swXSkgOiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IG1vZGVsLnN1Yk1vZGVscztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yk1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBoU2hhZGVyID0gU3ViTW9kZWxQb29sLmdldChzdWJNb2RlbHNbaV0uaGFuZGxlLCBTdWJNb2RlbFZpZXcuU0hBREVSXzApO1xyXG4gICAgICAgICAgICBzaGFkZXJzLnB1c2goU2hhZGVyUG9vbC5nZXQoaFNoYWRlcikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBtb2RlbCwgc2hhZGVycywgaW5zdGFuY2VkQnVmZmVyIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVNoYWRvd0xpc3QgKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nTW9kZWxzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93cyA9IHRoaXMuX3BpcGVsaW5lLnNoYWRvd3M7XHJcbiAgICAgICAgaWYgKCFzaGFkb3dzLmVuYWJsZWQgfHwgc2hhZG93cy50eXBlICE9PSBTaGFkb3dUeXBlLlBsYW5hcikgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB2aWV3LmNhbWVyYTtcclxuICAgICAgICBjb25zdCBzY2VuZSA9IGNhbWVyYS5zY2VuZSE7XHJcbiAgICAgICAgY29uc3QgZnJzdG0gPSBjYW1lcmEuZnJ1c3R1bTtcclxuICAgICAgICBjb25zdCBzaGFkb3dWaXNpYmxlID0gIChjYW1lcmEudmlzaWJpbGl0eSAmIExheWVycy5CaXRNYXNrLkRFRkFVTFQpICE9PSAwO1xyXG4gICAgICAgIGlmICghc2NlbmUubWFpbkxpZ2h0IHx8ICFzaGFkb3dWaXNpYmxlKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHNjZW5lLm1vZGVscztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBtb2RlbHNbaV07XHJcbiAgICAgICAgICAgIGlmICghbW9kZWwuZW5hYmxlZCB8fCAhbW9kZWwubm9kZSB8fCAhbW9kZWwuY2FzdFNoYWRvdykgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBpZiAobW9kZWwud29ybGRCb3VuZHMpIHtcclxuICAgICAgICAgICAgICAgIGFhYmIudHJhbnNmb3JtKF9hYiwgbW9kZWwud29ybGRCb3VuZHMsIHNoYWRvd3MubWF0TGlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbnRlcnNlY3QuYWFiYl9mcnVzdHVtKF9hYiwgZnJzdG0pKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuY3JlYXRlU2hhZG93RGF0YShtb2RlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdNb2RlbHMucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY29yZENvbW1hbmRCdWZmZXIgKGRldmljZTogR0ZYRGV2aWNlLCByZW5kZXJQYXNzOiBHRlhSZW5kZXJQYXNzLCBjbWRCdWZmOiBHRlhDb21tYW5kQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93cyA9IHRoaXMuX3BpcGVsaW5lLnNoYWRvd3M7XHJcbiAgICAgICAgaWYgKCFzaGFkb3dzLmVuYWJsZWQgfHwgc2hhZG93cy50eXBlICE9PSBTaGFkb3dUeXBlLlBsYW5hcikgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgY29uc3QgbW9kZWxzID0gdGhpcy5fcGVuZGluZ01vZGVscztcclxuICAgICAgICBjb25zdCBtb2RlbExlbiA9IG1vZGVscy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFtb2RlbExlbikgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBidWZmZXIgPSBJbnN0YW5jZWRCdWZmZXIuZ2V0KHNoYWRvd3MuaW5zdGFuY2luZ01hdGVyaWFsLnBhc3Nlc1swXSk7XHJcbiAgICAgICAgaWYgKGJ1ZmZlcikgeyBidWZmZXIuY2xlYXIoKTsgfVxyXG4gICAgICAgIGNvbnN0IGhQYXNzID0gc2hhZG93cy5tYXRlcmlhbC5wYXNzZXNbMF0uaGFuZGxlO1xyXG4gICAgICAgIGxldCBkZXNjcmlwdG9yU2V0ID0gRFNQb29sLmdldChQYXNzUG9vbC5nZXQoaFBhc3MsIFBhc3NWaWV3LkRFU0NSSVBUT1JfU0VUKSk7XHJcbiAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5NQVRFUklBTCwgZGVzY3JpcHRvclNldCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbExlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgbW9kZWwsIHNoYWRlcnMsIGluc3RhbmNlZEJ1ZmZlciB9ID0gbW9kZWxzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoYWRlcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVsID0gbW9kZWwuc3ViTW9kZWxzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhZGVyID0gc2hhZGVyc1tqXTtcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZWRCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZWRCdWZmZXIubWVyZ2Uoc3ViTW9kZWwsIG1vZGVsLmluc3RhbmNlZEF0dHJpYnV0ZXMsIDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpYSA9IHN1Yk1vZGVsLmlucHV0QXNzZW1ibGVyITtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwc28gPSBQaXBlbGluZVN0YXRlTWFuYWdlci5nZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUoZGV2aWNlLCBoUGFzcywgc2hhZGVyLCByZW5kZXJQYXNzLCBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kQnVmZi5iaW5kUGlwZWxpbmVTdGF0ZShwc28pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTE9DQUwsIHN1Yk1vZGVsLmRlc2NyaXB0b3JTZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZElucHV0QXNzZW1ibGVyKGlhKTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmRyYXcoaWEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChidWZmZXIgJiYgYnVmZmVyLmhhc1BlbmRpbmdNb2RlbHMpIHtcclxuICAgICAgICAgICAgYnVmZmVyLnVwbG9hZEJ1ZmZlcnMoKTtcclxuICAgICAgICAgICAgZGVzY3JpcHRvclNldCA9IERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGJ1ZmZlci5oUGFzcywgUGFzc1ZpZXcuREVTQ1JJUFRPUl9TRVQpKTtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5NQVRFUklBTCwgZGVzY3JpcHRvclNldCk7XHJcbiAgICAgICAgICAgIGxldCBsYXN0UFNPOiBHRlhQaXBlbGluZVN0YXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYnVmZmVyLmluc3RhbmNlcy5sZW5ndGg7ICsrYikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBidWZmZXIuaW5zdGFuY2VzW2JdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5jb3VudCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhZGVyID0gU2hhZGVyUG9vbC5nZXQoaW5zdGFuY2UuaFNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwc28gPSBQaXBlbGluZVN0YXRlTWFuYWdlci5nZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUoZGV2aWNlLCBidWZmZXIuaFBhc3MsIHNoYWRlciwgcmVuZGVyUGFzcywgaW5zdGFuY2UuaWEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RQU08gIT09IHBzbykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZFBpcGVsaW5lU3RhdGUocHNvKTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmREZXNjcmlwdG9yU2V0KFNldEluZGV4LkxPQ0FMLCBEU1Bvb2wuZ2V0KGluc3RhbmNlLmhEZXNjcmlwdG9yU2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBTTyA9IHBzbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZElucHV0QXNzZW1ibGVyKGluc3RhbmNlLmlhKTtcclxuICAgICAgICAgICAgICAgIGNtZEJ1ZmYuZHJhdyhpbnN0YW5jZS5pYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19