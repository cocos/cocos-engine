(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js", "../renderer/scene/light.js", "../renderer/core/pass.js", "./pipeline-state-manager.js", "../renderer/core/memory-pools.js", "../math/index.js", "../geometry/index.js", "../gfx/index.js", "../memop/index.js", "./instanced-buffer.js", "./batched-buffer.js", "./render-instanced-queue.js", "./render-batched-queue.js", "./pass-phase.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"), require("../renderer/scene/light.js"), require("../renderer/core/pass.js"), require("./pipeline-state-manager.js"), require("../renderer/core/memory-pools.js"), require("../math/index.js"), require("../geometry/index.js"), require("../gfx/index.js"), require("../memop/index.js"), require("./instanced-buffer.js"), require("./batched-buffer.js"), require("./render-instanced-queue.js"), require("./render-batched-queue.js"), require("./pass-phase.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.light, global.pass, global.pipelineStateManager, global.memoryPools, global.index, global.index, global.index, global.index, global.instancedBuffer, global.batchedBuffer, global.renderInstancedQueue, global.renderBatchedQueue, global.passPhase);
    global.renderAdditiveLightQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _light3, _pass, _pipelineStateManager, _memoryPools, _index, _index2, _index3, _index4, _instancedBuffer, _batchedBuffer, _renderInstancedQueue, _renderBatchedQueue, _passPhase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderAdditiveLightQueue = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _lightPassPool = new _index4.Pool(function () {
    return {
      subModel: null,
      passIdx: -1,
      dynamicOffsets: []
    };
  }, 16);

  var _vec4Array = new Float32Array(4);

  var _sphere = _index2.sphere.create(0, 0, 0, 1);

  var _dynamicOffsets = [];
  var _lightIndices = [];

  function cullSphereLight(light, model) {
    return !!(model.worldBounds && !_index2.intersect.aabb_aabb(model.worldBounds, light.aabb));
  }

  function cullSpotLight(light, model) {
    return !!(model.worldBounds && (!_index2.intersect.aabb_aabb(model.worldBounds, light.aabb) || !_index2.intersect.aabb_frustum(model.worldBounds, light.frustum)));
  }

  var _phaseID = (0, _passPhase.getPhaseID)('forward-add');

  function getLightPassIndex(subModels) {
    for (var j = 0; j < subModels.length; j++) {
      var passes = subModels[j].passes;

      for (var k = 0; k < passes.length; k++) {
        if (passes[k].phase === _phaseID) {
          return k;
        }
      }
    }

    return -1;
  }
  /**
   * @zh 叠加光照队列。
   */


  var RenderAdditiveLightQueue = /*#__PURE__*/function () {
    function RenderAdditiveLightQueue(pipeline) {
      _classCallCheck(this, RenderAdditiveLightQueue);

      this._device = void 0;
      this._validLights = [];
      this._lightPasses = [];
      this._lightBufferCount = 16;
      this._lightBufferStride = void 0;
      this._lightBufferElementCount = void 0;
      this._lightBuffer = void 0;
      this._firstlightBufferView = void 0;
      this._lightBufferData = void 0;
      this._isHDR = void 0;
      this._fpScale = void 0;
      this._renderObjects = void 0;
      this._instancedQueue = void 0;
      this._batchedQueue = void 0;
      this._lightMeterScale = 10000.0;
      this._device = pipeline.device;
      this._isHDR = pipeline.isHDR;
      this._fpScale = pipeline.fpScale;
      this._renderObjects = pipeline.renderObjects;
      this._instancedQueue = new _renderInstancedQueue.RenderInstancedQueue();
      this._batchedQueue = new _renderBatchedQueue.RenderBatchedQueue();
      this._lightBufferStride = Math.ceil(_define.UBOForwardLight.SIZE / this._device.uboOffsetAlignment) * this._device.uboOffsetAlignment;
      this._lightBufferElementCount = this._lightBufferStride / Float32Array.BYTES_PER_ELEMENT;
      this._lightBuffer = this._device.createBuffer(new _index3.GFXBufferInfo(_index3.GFXBufferUsageBit.UNIFORM | _index3.GFXBufferUsageBit.TRANSFER_DST, _index3.GFXMemoryUsageBit.HOST | _index3.GFXMemoryUsageBit.DEVICE, this._lightBufferStride * this._lightBufferCount, this._lightBufferStride));
      this._firstlightBufferView = this._device.createBuffer(new _index3.GFXBufferViewInfo(this._lightBuffer, 0, _define.UBOForwardLight.SIZE));
      this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);
    }

    _createClass(RenderAdditiveLightQueue, [{
      key: "gatherLightPasses",
      value: function gatherLightPasses(view, cmdBuff) {
        var validLights = this._validLights;
        var sphereLights = view.camera.scene.sphereLights;

        this._instancedQueue.clear();

        this._batchedQueue.clear();

        validLights.length = 0;

        for (var i = 0; i < this._lightPasses.length; i++) {
          var lp = this._lightPasses[i];
          lp.dynamicOffsets.length = 0;
        }

        _lightPassPool.freeArray(this._lightPasses);

        this._lightPasses.length = 0;

        for (var _i = 0; _i < sphereLights.length; _i++) {
          var light = sphereLights[_i];

          _index2.sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);

          if (_index2.intersect.sphere_frustum(_sphere, view.camera.frustum)) {
            validLights.push(light);
          }
        }

        var spotLights = view.camera.scene.spotLights;

        for (var _i2 = 0; _i2 < spotLights.length; _i2++) {
          var _light = spotLights[_i2];

          _index2.sphere.set(_sphere, _light.position.x, _light.position.y, _light.position.z, _light.range);

          if (_index2.intersect.sphere_frustum(_sphere, view.camera.frustum)) {
            validLights.push(_light);
          }
        }

        if (!validLights.length) return;

        this._updateUBOs(view, cmdBuff);

        for (var _i3 = 0; _i3 < this._renderObjects.length; _i3++) {
          var ro = this._renderObjects[_i3];
          var model = ro.model;
          var subModels = model.subModels; // this assumes light pass index is the same for all submodels

          var lightPassIdx = getLightPassIndex(subModels);
          if (lightPassIdx < 0) continue;
          _lightIndices.length = 0;

          for (var l = 0; l < validLights.length; l++) {
            var _light2 = validLights[l];
            var isCulled = false;

            switch (_light2.type) {
              case _light3.LightType.SPHERE:
                isCulled = cullSphereLight(_light2, model);
                break;

              case _light3.LightType.SPOT:
                isCulled = cullSpotLight(_light2, model);
                break;
            }

            if (!isCulled) {
              _lightIndices.push(l);
            }
          }

          if (!_lightIndices.length) continue;

          for (var j = 0; j < subModels.length; j++) {
            var subModel = subModels[j];
            var pass = subModel.passes[lightPassIdx];
            var batchingScheme = pass.batchingScheme;
            subModel.descriptorSet.bindBuffer(_define.UBOForwardLight.BINDING, this._firstlightBufferView);
            subModel.descriptorSet.update();

            if (batchingScheme === _pass.BatchingSchemes.INSTANCING) {
              // instancing
              for (var _l = 0; _l < _lightIndices.length; _l++) {
                var idx = _lightIndices[_l];

                var buffer = _instancedBuffer.InstancedBuffer.get(pass, idx);

                buffer.merge(subModel, model.instancedAttributes, lightPassIdx);
                buffer.dynamicOffsets[0] = this._lightBufferStride * idx;

                this._instancedQueue.queue.add(buffer);
              }
            } else if (batchingScheme === _pass.BatchingSchemes.VB_MERGING) {
              // vb-merging
              for (var _l2 = 0; _l2 < _lightIndices.length; _l2++) {
                var _idx = _lightIndices[_l2];

                var _buffer = _batchedBuffer.BatchedBuffer.get(pass, _idx);

                _buffer.merge(subModel, lightPassIdx, ro);

                _buffer.dynamicOffsets[0] = this._lightBufferStride * _idx;

                this._batchedQueue.queue.add(_buffer);
              }
            } else {
              // standard draw
              var _lp = _lightPassPool.alloc();

              _lp.subModel = subModel;
              _lp.passIdx = lightPassIdx;

              for (var _l3 = 0; _l3 < _lightIndices.length; _l3++) {
                _lp.dynamicOffsets.push(this._lightBufferStride * _lightIndices[_l3]);
              }

              this._lightPasses.push(_lp);
            }
          }
        }
      }
    }, {
      key: "recordCommandBuffer",
      value: function recordCommandBuffer(device, renderPass, cmdBuff) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (var i = 0; i < this._lightPasses.length; i++) {
          var _this$_lightPasses$i = this._lightPasses[i],
              subModel = _this$_lightPasses$i.subModel,
              passIdx = _this$_lightPasses$i.passIdx,
              dynamicOffsets = _this$_lightPasses$i.dynamicOffsets;

          var shader = _memoryPools.ShaderPool.get(_memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.SHADER_0 + passIdx));

          var pass = subModel.passes[passIdx];
          var ia = subModel.inputAssembler;

          var pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, pass.handle, shader, renderPass, ia);

          var matDS = _memoryPools.DSPool.get(_memoryPools.PassPool.get(pass.handle, _memoryPools.PassView.DESCRIPTOR_SET));

          var localDS = subModel.descriptorSet;
          cmdBuff.bindPipelineState(pso);
          cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, matDS);
          cmdBuff.bindInputAssembler(ia);

          for (var j = 0; j < dynamicOffsets.length; ++j) {
            _dynamicOffsets[0] = dynamicOffsets[j];
            cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, localDS, _dynamicOffsets);
            cmdBuff.draw(ia);
          }
        }
      }
    }, {
      key: "_updateUBOs",
      value: function _updateUBOs(view, cmdBuff) {
        var exposure = view.camera.exposure;

        if (this._validLights.length > this._lightBufferCount) {
          this._firstlightBufferView.destroy();

          this._lightBufferCount = (0, _index.nextPow2)(this._validLights.length);

          this._lightBuffer.resize(this._lightBufferStride * this._lightBufferCount);

          this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._lightBufferCount);

          this._firstlightBufferView.initialize(new _index3.GFXBufferViewInfo(this._lightBuffer, 0, _define.UBOForwardLight.SIZE));
        }

        for (var l = 0, offset = 0; l < this._validLights.length; l++, offset += this._lightBufferElementCount) {
          var light = this._validLights[l];

          switch (light.type) {
            case _light3.LightType.SPHERE:
              var sphereLit = light;

              _index.Vec3.toArray(_vec4Array, sphereLit.position);

              _vec4Array[3] = 0;

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_POS_OFFSET);

              _vec4Array[0] = sphereLit.size;
              _vec4Array[1] = sphereLit.range;
              _vec4Array[2] = 0.0;

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

              _index.Vec3.toArray(_vec4Array, light.color);

              if (light.useColorTemperature) {
                var tempRGB = light.colorTemperatureRGB;
                _vec4Array[0] *= tempRGB.x;
                _vec4Array[1] *= tempRGB.y;
                _vec4Array[2] *= tempRGB.z;
              }

              if (this._isHDR) {
                _vec4Array[3] = sphereLit.luminance * this._fpScale * this._lightMeterScale;
              } else {
                _vec4Array[3] = sphereLit.luminance * exposure * this._lightMeterScale;
              }

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_COLOR_OFFSET);

              break;

            case _light3.LightType.SPOT:
              var spotLit = light;

              _index.Vec3.toArray(_vec4Array, spotLit.position);

              _vec4Array[3] = 1;

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_POS_OFFSET);

              _vec4Array[0] = spotLit.size;
              _vec4Array[1] = spotLit.range;
              _vec4Array[2] = spotLit.spotAngle;

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

              _index.Vec3.toArray(_vec4Array, spotLit.direction);

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_DIR_OFFSET);

              _index.Vec3.toArray(_vec4Array, light.color);

              if (light.useColorTemperature) {
                var _tempRGB = light.colorTemperatureRGB;
                _vec4Array[0] *= _tempRGB.x;
                _vec4Array[1] *= _tempRGB.y;
                _vec4Array[2] *= _tempRGB.z;
              }

              if (this._isHDR) {
                _vec4Array[3] = spotLit.luminance * this._fpScale * this._lightMeterScale;
              } else {
                _vec4Array[3] = spotLit.luminance * exposure * this._lightMeterScale;
              }

              this._lightBufferData.set(_vec4Array, offset + _define.UBOForwardLight.LIGHT_COLOR_OFFSET);

              break;
          }
        }

        cmdBuff.updateBuffer(this._lightBuffer, this._lightBufferData);
      }
    }]);

    return RenderAdditiveLightQueue;
  }();

  _exports.RenderAdditiveLightQueue = RenderAdditiveLightQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLWFkZGl0aXZlLWxpZ2h0LXF1ZXVlLnRzIl0sIm5hbWVzIjpbIl9saWdodFBhc3NQb29sIiwiUG9vbCIsInN1Yk1vZGVsIiwicGFzc0lkeCIsImR5bmFtaWNPZmZzZXRzIiwiX3ZlYzRBcnJheSIsIkZsb2F0MzJBcnJheSIsIl9zcGhlcmUiLCJzcGhlcmUiLCJjcmVhdGUiLCJfZHluYW1pY09mZnNldHMiLCJfbGlnaHRJbmRpY2VzIiwiY3VsbFNwaGVyZUxpZ2h0IiwibGlnaHQiLCJtb2RlbCIsIndvcmxkQm91bmRzIiwiaW50ZXJzZWN0IiwiYWFiYl9hYWJiIiwiYWFiYiIsImN1bGxTcG90TGlnaHQiLCJhYWJiX2ZydXN0dW0iLCJmcnVzdHVtIiwiX3BoYXNlSUQiLCJnZXRMaWdodFBhc3NJbmRleCIsInN1Yk1vZGVscyIsImoiLCJsZW5ndGgiLCJwYXNzZXMiLCJrIiwicGhhc2UiLCJSZW5kZXJBZGRpdGl2ZUxpZ2h0UXVldWUiLCJwaXBlbGluZSIsIl9kZXZpY2UiLCJfdmFsaWRMaWdodHMiLCJfbGlnaHRQYXNzZXMiLCJfbGlnaHRCdWZmZXJDb3VudCIsIl9saWdodEJ1ZmZlclN0cmlkZSIsIl9saWdodEJ1ZmZlckVsZW1lbnRDb3VudCIsIl9saWdodEJ1ZmZlciIsIl9maXJzdGxpZ2h0QnVmZmVyVmlldyIsIl9saWdodEJ1ZmZlckRhdGEiLCJfaXNIRFIiLCJfZnBTY2FsZSIsIl9yZW5kZXJPYmplY3RzIiwiX2luc3RhbmNlZFF1ZXVlIiwiX2JhdGNoZWRRdWV1ZSIsIl9saWdodE1ldGVyU2NhbGUiLCJkZXZpY2UiLCJpc0hEUiIsImZwU2NhbGUiLCJyZW5kZXJPYmplY3RzIiwiUmVuZGVySW5zdGFuY2VkUXVldWUiLCJSZW5kZXJCYXRjaGVkUXVldWUiLCJNYXRoIiwiY2VpbCIsIlVCT0ZvcndhcmRMaWdodCIsIlNJWkUiLCJ1Ym9PZmZzZXRBbGlnbm1lbnQiLCJCWVRFU19QRVJfRUxFTUVOVCIsImNyZWF0ZUJ1ZmZlciIsIkdGWEJ1ZmZlckluZm8iLCJHRlhCdWZmZXJVc2FnZUJpdCIsIlVOSUZPUk0iLCJUUkFOU0ZFUl9EU1QiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkhPU1QiLCJERVZJQ0UiLCJHRlhCdWZmZXJWaWV3SW5mbyIsInZpZXciLCJjbWRCdWZmIiwidmFsaWRMaWdodHMiLCJzcGhlcmVMaWdodHMiLCJjYW1lcmEiLCJzY2VuZSIsImNsZWFyIiwiaSIsImxwIiwiZnJlZUFycmF5Iiwic2V0IiwicG9zaXRpb24iLCJ4IiwieSIsInoiLCJyYW5nZSIsInNwaGVyZV9mcnVzdHVtIiwicHVzaCIsInNwb3RMaWdodHMiLCJfdXBkYXRlVUJPcyIsInJvIiwibGlnaHRQYXNzSWR4IiwibCIsImlzQ3VsbGVkIiwidHlwZSIsIkxpZ2h0VHlwZSIsIlNQSEVSRSIsIlNQT1QiLCJwYXNzIiwiYmF0Y2hpbmdTY2hlbWUiLCJkZXNjcmlwdG9yU2V0IiwiYmluZEJ1ZmZlciIsIkJJTkRJTkciLCJ1cGRhdGUiLCJCYXRjaGluZ1NjaGVtZXMiLCJJTlNUQU5DSU5HIiwiaWR4IiwiYnVmZmVyIiwiSW5zdGFuY2VkQnVmZmVyIiwiZ2V0IiwibWVyZ2UiLCJpbnN0YW5jZWRBdHRyaWJ1dGVzIiwicXVldWUiLCJhZGQiLCJWQl9NRVJHSU5HIiwiQmF0Y2hlZEJ1ZmZlciIsImFsbG9jIiwicmVuZGVyUGFzcyIsInJlY29yZENvbW1hbmRCdWZmZXIiLCJzaGFkZXIiLCJTaGFkZXJQb29sIiwiU3ViTW9kZWxQb29sIiwiaGFuZGxlIiwiU3ViTW9kZWxWaWV3IiwiU0hBREVSXzAiLCJpYSIsImlucHV0QXNzZW1ibGVyIiwicHNvIiwiUGlwZWxpbmVTdGF0ZU1hbmFnZXIiLCJnZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUiLCJtYXREUyIsIkRTUG9vbCIsIlBhc3NQb29sIiwiUGFzc1ZpZXciLCJERVNDUklQVE9SX1NFVCIsImxvY2FsRFMiLCJiaW5kUGlwZWxpbmVTdGF0ZSIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJNQVRFUklBTCIsImJpbmRJbnB1dEFzc2VtYmxlciIsIkxPQ0FMIiwiZHJhdyIsImV4cG9zdXJlIiwiZGVzdHJveSIsInJlc2l6ZSIsImluaXRpYWxpemUiLCJvZmZzZXQiLCJzcGhlcmVMaXQiLCJWZWMzIiwidG9BcnJheSIsIkxJR0hUX1BPU19PRkZTRVQiLCJzaXplIiwiTElHSFRfU0laRV9SQU5HRV9BTkdMRV9PRkZTRVQiLCJjb2xvciIsInVzZUNvbG9yVGVtcGVyYXR1cmUiLCJ0ZW1wUkdCIiwiY29sb3JUZW1wZXJhdHVyZVJHQiIsImx1bWluYW5jZSIsIkxJR0hUX0NPTE9SX09GRlNFVCIsInNwb3RMaXQiLCJzcG90QW5nbGUiLCJkaXJlY3Rpb24iLCJMSUdIVF9ESVJfT0ZGU0VUIiwidXBkYXRlQnVmZmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQSxNQUFNQSxjQUFjLEdBQUcsSUFBSUMsWUFBSixDQUE2QjtBQUFBLFdBQU87QUFBRUMsTUFBQUEsUUFBUSxFQUFFLElBQVo7QUFBbUJDLE1BQUFBLE9BQU8sRUFBRSxDQUFDLENBQTdCO0FBQWdDQyxNQUFBQSxjQUFjLEVBQUU7QUFBaEQsS0FBUDtBQUFBLEdBQTdCLEVBQTJGLEVBQTNGLENBQXZCOztBQUVBLE1BQU1DLFVBQVUsR0FBRyxJQUFJQyxZQUFKLENBQWlCLENBQWpCLENBQW5COztBQUNBLE1BQU1DLE9BQU8sR0FBR0MsZUFBT0MsTUFBUCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsQ0FBaEI7O0FBQ0EsTUFBTUMsZUFBeUIsR0FBRyxFQUFsQztBQUNBLE1BQU1DLGFBQXVCLEdBQUcsRUFBaEM7O0FBRUEsV0FBU0MsZUFBVCxDQUEwQkMsS0FBMUIsRUFBOENDLEtBQTlDLEVBQTREO0FBQ3hELFdBQU8sQ0FBQyxFQUFFQSxLQUFLLENBQUNDLFdBQU4sSUFBcUIsQ0FBQ0Msa0JBQVVDLFNBQVYsQ0FB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MUIsRUFBd0MsS0FBS0UsZ0JBQTdDO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYQ29tbWFuZEJ1ZmZlciB9IGZyb20gJy4uL2dmeC9jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7IElSZW5kZXJPYmplY3QsIFVCT0ZvcndhcmRMaWdodCwgU2V0SW5kZXggfSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IExpZ2h0LCBMaWdodFR5cGUgfSBmcm9tICcuLi9yZW5kZXJlci9zY2VuZS9saWdodCc7XHJcbmltcG9ydCB7IFNwaGVyZUxpZ2h0IH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvc3BoZXJlLWxpZ2h0JztcclxuaW1wb3J0IHsgU3BvdExpZ2h0IH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvc3BvdC1saWdodCc7XHJcbmltcG9ydCB7IEJhdGNoaW5nU2NoZW1lcyB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvcGFzcydcclxuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuLi9yZW5kZXJlci9zY2VuZS9tb2RlbCc7XHJcbmltcG9ydCB7IFN1Yk1vZGVsIH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvc3VibW9kZWwnO1xyXG5pbXBvcnQgeyBQaXBlbGluZVN0YXRlTWFuYWdlciB9IGZyb20gJy4vcGlwZWxpbmUtc3RhdGUtbWFuYWdlcic7XHJcbmltcG9ydCB7IERTUG9vbCwgU2hhZGVyUG9vbCwgUGFzc1ZpZXcsIFBhc3NQb29sLCBTdWJNb2RlbFBvb2wsIFN1Yk1vZGVsVmlldywgU2hhZGVySGFuZGxlIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9tZW1vcnktcG9vbHMnO1xyXG5pbXBvcnQgeyBWZWMzLCBuZXh0UG93MiB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IFJlbmRlclZpZXcgfSBmcm9tICcuL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgc3BoZXJlLCBpbnRlcnNlY3QgfSBmcm9tICcuLi9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IEdGWERldmljZSwgR0ZYUmVuZGVyUGFzcywgR0ZYQnVmZmVyLCBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYTWVtb3J5VXNhZ2VCaXQsIEdGWEJ1ZmZlckluZm8sIEdGWEJ1ZmZlclZpZXdJbmZvIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgUG9vbCB9IGZyb20gJy4uL21lbW9wJztcclxuaW1wb3J0IHsgSW5zdGFuY2VkQnVmZmVyIH0gZnJvbSAnLi9pbnN0YW5jZWQtYnVmZmVyJztcclxuaW1wb3J0IHsgQmF0Y2hlZEJ1ZmZlciB9IGZyb20gJy4vYmF0Y2hlZC1idWZmZXInO1xyXG5pbXBvcnQgeyBGb3J3YXJkUGlwZWxpbmUgfSBmcm9tICcuL2ZvcndhcmQvZm9yd2FyZC1waXBlbGluZSc7XHJcbmltcG9ydCB7IFJlbmRlckluc3RhbmNlZFF1ZXVlIH0gZnJvbSAnLi9yZW5kZXItaW5zdGFuY2VkLXF1ZXVlJztcclxuaW1wb3J0IHsgUmVuZGVyQmF0Y2hlZFF1ZXVlIH0gZnJvbSAnLi9yZW5kZXItYmF0Y2hlZC1xdWV1ZSc7XHJcbmltcG9ydCB7IGdldFBoYXNlSUQgfSBmcm9tICcuL3Bhc3MtcGhhc2UnO1xyXG5cclxuaW50ZXJmYWNlIElBZGRpdGl2ZUxpZ2h0UGFzcyB7XHJcbiAgICBzdWJNb2RlbDogU3ViTW9kZWw7XHJcbiAgICBwYXNzSWR4OiBudW1iZXI7XHJcbiAgICBkeW5hbWljT2Zmc2V0czogbnVtYmVyW107XHJcbn1cclxuXHJcbmNvbnN0IF9saWdodFBhc3NQb29sID0gbmV3IFBvb2w8SUFkZGl0aXZlTGlnaHRQYXNzPigoKSA9PiAoeyBzdWJNb2RlbDogbnVsbCEsIHBhc3NJZHg6IC0xLCBkeW5hbWljT2Zmc2V0czogW10gfSksIDE2KTtcclxuXHJcbmNvbnN0IF92ZWM0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG5jb25zdCBfc3BoZXJlID0gc3BoZXJlLmNyZWF0ZSgwLCAwLCAwLCAxKTtcclxuY29uc3QgX2R5bmFtaWNPZmZzZXRzOiBudW1iZXJbXSA9IFtdO1xyXG5jb25zdCBfbGlnaHRJbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuZnVuY3Rpb24gY3VsbFNwaGVyZUxpZ2h0IChsaWdodDogU3BoZXJlTGlnaHQsIG1vZGVsOiBNb2RlbCkge1xyXG4gICAgcmV0dXJuICEhKG1vZGVsLndvcmxkQm91bmRzICYmICFpbnRlcnNlY3QuYWFiYl9hYWJiKG1vZGVsLndvcmxkQm91bmRzLCBsaWdodC5hYWJiKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGN1bGxTcG90TGlnaHQgKGxpZ2h0OiBTcG90TGlnaHQsIG1vZGVsOiBNb2RlbCkge1xyXG4gICAgcmV0dXJuICEhKG1vZGVsLndvcmxkQm91bmRzICYmXHJcbiAgICAgICAgKCFpbnRlcnNlY3QuYWFiYl9hYWJiKG1vZGVsLndvcmxkQm91bmRzLCBsaWdodC5hYWJiKSB8fCAhaW50ZXJzZWN0LmFhYmJfZnJ1c3R1bShtb2RlbC53b3JsZEJvdW5kcywgbGlnaHQuZnJ1c3R1bSkpKTtcclxufVxyXG5cclxuY29uc3QgX3BoYXNlSUQgPSBnZXRQaGFzZUlEKCdmb3J3YXJkLWFkZCcpO1xyXG5mdW5jdGlvbiBnZXRMaWdodFBhc3NJbmRleCAoc3ViTW9kZWxzOiBTdWJNb2RlbFtdKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN1Yk1vZGVscy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGNvbnN0IHBhc3NlcyA9IHN1Yk1vZGVsc1tqXS5wYXNzZXM7XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBwYXNzZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgaWYgKHBhc3Nlc1trXS5waGFzZSA9PT0gX3BoYXNlSUQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoIOWPoOWKoOWFieeFp+mYn+WIl+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlbmRlckFkZGl0aXZlTGlnaHRRdWV1ZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfZGV2aWNlOiBHRlhEZXZpY2U7XHJcbiAgICBwcml2YXRlIF92YWxpZExpZ2h0czogTGlnaHRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfbGlnaHRQYXNzZXM6IElBZGRpdGl2ZUxpZ2h0UGFzc1tdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfbGlnaHRCdWZmZXJDb3VudCA9IDE2O1xyXG4gICAgcHJpdmF0ZSBfbGlnaHRCdWZmZXJTdHJpZGU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2xpZ2h0QnVmZmVyRWxlbWVudENvdW50OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9saWdodEJ1ZmZlcjogR0ZYQnVmZmVyO1xyXG4gICAgcHJpdmF0ZSBfZmlyc3RsaWdodEJ1ZmZlclZpZXc6IEdGWEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgX2xpZ2h0QnVmZmVyRGF0YTogRmxvYXQzMkFycmF5O1xyXG5cclxuICAgIHByaXZhdGUgX2lzSERSOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfZnBTY2FsZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyT2JqZWN0czogSVJlbmRlck9iamVjdFtdO1xyXG4gICAgcHJpdmF0ZSBfaW5zdGFuY2VkUXVldWU6IFJlbmRlckluc3RhbmNlZFF1ZXVlO1xyXG4gICAgcHJpdmF0ZSBfYmF0Y2hlZFF1ZXVlOiBSZW5kZXJCYXRjaGVkUXVldWU7XHJcbiAgICBwcml2YXRlIF9saWdodE1ldGVyU2NhbGU6IG51bWJlciA9IDEwMDAwLjA7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHBpcGVsaW5lOiBGb3J3YXJkUGlwZWxpbmUpIHtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBwaXBlbGluZS5kZXZpY2U7XHJcbiAgICAgICAgdGhpcy5faXNIRFIgPSBwaXBlbGluZS5pc0hEUjtcclxuICAgICAgICB0aGlzLl9mcFNjYWxlID0gcGlwZWxpbmUuZnBTY2FsZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJPYmplY3RzID0gcGlwZWxpbmUucmVuZGVyT2JqZWN0cztcclxuICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZSA9IG5ldyBSZW5kZXJJbnN0YW5jZWRRdWV1ZSgpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZSA9IG5ldyBSZW5kZXJCYXRjaGVkUXVldWUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXJTdHJpZGUgPSBNYXRoLmNlaWwoVUJPRm9yd2FyZExpZ2h0LlNJWkUgLyB0aGlzLl9kZXZpY2UudWJvT2Zmc2V0QWxpZ25tZW50KSAqIHRoaXMuX2RldmljZS51Ym9PZmZzZXRBbGlnbm1lbnQ7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXJFbGVtZW50Q291bnQgPSB0aGlzLl9saWdodEJ1ZmZlclN0cmlkZSAvIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVDtcclxuXHJcbiAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXIgPSB0aGlzLl9kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICB0aGlzLl9saWdodEJ1ZmZlclN0cmlkZSAqIHRoaXMuX2xpZ2h0QnVmZmVyQ291bnQsXHJcbiAgICAgICAgICAgIHRoaXMuX2xpZ2h0QnVmZmVyU3RyaWRlLFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICB0aGlzLl9maXJzdGxpZ2h0QnVmZmVyVmlldyA9IHRoaXMuX2RldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlclZpZXdJbmZvKHRoaXMuX2xpZ2h0QnVmZmVyLCAwLCBVQk9Gb3J3YXJkTGlnaHQuU0laRSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9saWdodEJ1ZmZlckRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2xpZ2h0QnVmZmVyRWxlbWVudENvdW50ICogdGhpcy5fbGlnaHRCdWZmZXJDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdhdGhlckxpZ2h0UGFzc2VzICh2aWV3OiBSZW5kZXJWaWV3LCBjbWRCdWZmOiBHRlhDb21tYW5kQnVmZmVyKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbGlkTGlnaHRzID0gdGhpcy5fdmFsaWRMaWdodHM7XHJcbiAgICAgICAgY29uc3Qgc3BoZXJlTGlnaHRzID0gdmlldy5jYW1lcmEuc2NlbmUhLnNwaGVyZUxpZ2h0cztcclxuXHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9iYXRjaGVkUXVldWUuY2xlYXIoKTtcclxuICAgICAgICB2YWxpZExpZ2h0cy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xpZ2h0UGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxwID0gdGhpcy5fbGlnaHRQYXNzZXNbaV07XHJcbiAgICAgICAgICAgIGxwLmR5bmFtaWNPZmZzZXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9saWdodFBhc3NQb29sLmZyZWVBcnJheSh0aGlzLl9saWdodFBhc3Nlcyk7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRQYXNzZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGhlcmVMaWdodHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbGlnaHQgPSBzcGhlcmVMaWdodHNbaV07XHJcbiAgICAgICAgICAgIHNwaGVyZS5zZXQoX3NwaGVyZSwgbGlnaHQucG9zaXRpb24ueCwgbGlnaHQucG9zaXRpb24ueSwgbGlnaHQucG9zaXRpb24ueiwgbGlnaHQucmFuZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0LnNwaGVyZV9mcnVzdHVtKF9zcGhlcmUsIHZpZXcuY2FtZXJhLmZydXN0dW0pKSB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZExpZ2h0cy5wdXNoKGxpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzcG90TGlnaHRzID0gdmlldy5jYW1lcmEuc2NlbmUhLnNwb3RMaWdodHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcG90TGlnaHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpZ2h0ID0gc3BvdExpZ2h0c1tpXTtcclxuICAgICAgICAgICAgc3BoZXJlLnNldChfc3BoZXJlLCBsaWdodC5wb3NpdGlvbi54LCBsaWdodC5wb3NpdGlvbi55LCBsaWdodC5wb3NpdGlvbi56LCBsaWdodC5yYW5nZSk7XHJcbiAgICAgICAgICAgIGlmIChpbnRlcnNlY3Quc3BoZXJlX2ZydXN0dW0oX3NwaGVyZSwgdmlldy5jYW1lcmEuZnJ1c3R1bSkpIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkTGlnaHRzLnB1c2gobGlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXZhbGlkTGlnaHRzLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVVQk9zKHZpZXcsIGNtZEJ1ZmYpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3JlbmRlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgcm8gPSB0aGlzLl9yZW5kZXJPYmplY3RzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IHJvLm1vZGVsO1xyXG4gICAgICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSBtb2RlbC5zdWJNb2RlbHM7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGFzc3VtZXMgbGlnaHQgcGFzcyBpbmRleCBpcyB0aGUgc2FtZSBmb3IgYWxsIHN1Ym1vZGVsc1xyXG4gICAgICAgICAgICBjb25zdCBsaWdodFBhc3NJZHggPSBnZXRMaWdodFBhc3NJbmRleChzdWJNb2RlbHMpO1xyXG4gICAgICAgICAgICBpZiAobGlnaHRQYXNzSWR4IDwgMCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBfbGlnaHRJbmRpY2VzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGwgPSAwOyBsIDwgdmFsaWRMaWdodHMubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpZ2h0ID0gdmFsaWRMaWdodHNbbF07XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNDdWxsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobGlnaHQudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgTGlnaHRUeXBlLlNQSEVSRTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDdWxsZWQgPSBjdWxsU3BoZXJlTGlnaHQobGlnaHQgYXMgU3BoZXJlTGlnaHQsIG1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBMaWdodFR5cGUuU1BPVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDdWxsZWQgPSBjdWxsU3BvdExpZ2h0KGxpZ2h0IGFzIFNwb3RMaWdodCwgbW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghaXNDdWxsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBfbGlnaHRJbmRpY2VzLnB1c2gobCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghX2xpZ2h0SW5kaWNlcy5sZW5ndGgpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdWJNb2RlbHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVsID0gc3ViTW9kZWxzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFzcyA9IHN1Yk1vZGVsLnBhc3Nlc1tsaWdodFBhc3NJZHhdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmF0Y2hpbmdTY2hlbWUgPSBwYXNzLmJhdGNoaW5nU2NoZW1lO1xyXG4gICAgICAgICAgICAgICAgc3ViTW9kZWwuZGVzY3JpcHRvclNldC5iaW5kQnVmZmVyKFVCT0ZvcndhcmRMaWdodC5CSU5ESU5HLCB0aGlzLl9maXJzdGxpZ2h0QnVmZmVyVmlldyk7XHJcbiAgICAgICAgICAgICAgICBzdWJNb2RlbC5kZXNjcmlwdG9yU2V0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiYXRjaGluZ1NjaGVtZSA9PT0gQmF0Y2hpbmdTY2hlbWVzLklOU1RBTkNJTkcpIHsgLy8gaW5zdGFuY2luZ1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGwgPSAwOyBsIDwgX2xpZ2h0SW5kaWNlcy5sZW5ndGg7IGwrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBfbGlnaHRJbmRpY2VzW2xdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBJbnN0YW5jZWRCdWZmZXIuZ2V0KHBhc3MsIGlkeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5tZXJnZShzdWJNb2RlbCwgbW9kZWwuaW5zdGFuY2VkQXR0cmlidXRlcywgbGlnaHRQYXNzSWR4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmR5bmFtaWNPZmZzZXRzWzBdID0gdGhpcy5fbGlnaHRCdWZmZXJTdHJpZGUgKiBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlZFF1ZXVlLnF1ZXVlLmFkZChidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmF0Y2hpbmdTY2hlbWUgPT09IEJhdGNoaW5nU2NoZW1lcy5WQl9NRVJHSU5HKSB7IC8vIHZiLW1lcmdpbmdcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IF9saWdodEluZGljZXMubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gX2xpZ2h0SW5kaWNlc1tsXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gQmF0Y2hlZEJ1ZmZlci5nZXQocGFzcywgaWR4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCBsaWdodFBhc3NJZHgsIHJvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyLmR5bmFtaWNPZmZzZXRzWzBdID0gdGhpcy5fbGlnaHRCdWZmZXJTdHJpZGUgKiBpZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5xdWV1ZS5hZGQoYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBzdGFuZGFyZCBkcmF3XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbHAgPSBfbGlnaHRQYXNzUG9vbC5hbGxvYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxwLnN1Yk1vZGVsID0gc3ViTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgbHAucGFzc0lkeCA9IGxpZ2h0UGFzc0lkeDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IF9saWdodEluZGljZXMubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbHAuZHluYW1pY09mZnNldHMucHVzaCh0aGlzLl9saWdodEJ1ZmZlclN0cmlkZSAqIF9saWdodEluZGljZXNbbF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlnaHRQYXNzZXMucHVzaChscCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY29yZENvbW1hbmRCdWZmZXIgKGRldmljZTogR0ZYRGV2aWNlLCByZW5kZXJQYXNzOiBHRlhSZW5kZXJQYXNzLCBjbWRCdWZmOiBHRlhDb21tYW5kQnVmZmVyKSB7XHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUucmVjb3JkQ29tbWFuZEJ1ZmZlcihkZXZpY2UsIHJlbmRlclBhc3MsIGNtZEJ1ZmYpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcywgY21kQnVmZik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGlnaHRQYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeyBzdWJNb2RlbCwgcGFzc0lkeCwgZHluYW1pY09mZnNldHMgfSA9IHRoaXMuX2xpZ2h0UGFzc2VzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBzaGFkZXIgPSBTaGFkZXJQb29sLmdldChTdWJNb2RlbFBvb2wuZ2V0KHN1Yk1vZGVsLmhhbmRsZSwgU3ViTW9kZWxWaWV3LlNIQURFUl8wICsgcGFzc0lkeCkgYXMgU2hhZGVySGFuZGxlKTtcclxuICAgICAgICAgICAgY29uc3QgcGFzcyA9IHN1Yk1vZGVsLnBhc3Nlc1twYXNzSWR4XTtcclxuICAgICAgICAgICAgY29uc3QgaWEgPSBzdWJNb2RlbC5pbnB1dEFzc2VtYmxlcjtcclxuICAgICAgICAgICAgY29uc3QgcHNvID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgcGFzcy5oYW5kbGUsIHNoYWRlciwgcmVuZGVyUGFzcywgaWEpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXREUyA9IERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KHBhc3MuaGFuZGxlLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpO1xyXG4gICAgICAgICAgICBjb25zdCBsb2NhbERTID0gc3ViTW9kZWwuZGVzY3JpcHRvclNldDtcclxuXHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuYmluZFBpcGVsaW5lU3RhdGUocHNvKTtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5NQVRFUklBTCwgbWF0RFMpO1xyXG4gICAgICAgICAgICBjbWRCdWZmLmJpbmRJbnB1dEFzc2VtYmxlcihpYSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGR5bmFtaWNPZmZzZXRzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICBfZHluYW1pY09mZnNldHNbMF0gPSBkeW5hbWljT2Zmc2V0c1tqXTtcclxuICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTE9DQUwsIGxvY2FsRFMsIF9keW5hbWljT2Zmc2V0cyk7XHJcbiAgICAgICAgICAgICAgICBjbWRCdWZmLmRyYXcoaWEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlVUJPcyAodmlldzogUmVuZGVyVmlldywgY21kQnVmZjogR0ZYQ29tbWFuZEJ1ZmZlcikge1xyXG4gICAgICAgIGNvbnN0IGV4cG9zdXJlID0gdmlldy5jYW1lcmEuZXhwb3N1cmU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl92YWxpZExpZ2h0cy5sZW5ndGggPiB0aGlzLl9saWdodEJ1ZmZlckNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0bGlnaHRCdWZmZXJWaWV3LmRlc3Ryb3koKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2xpZ2h0QnVmZmVyQ291bnQgPSBuZXh0UG93Mih0aGlzLl92YWxpZExpZ2h0cy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB0aGlzLl9saWdodEJ1ZmZlci5yZXNpemUodGhpcy5fbGlnaHRCdWZmZXJTdHJpZGUgKiB0aGlzLl9saWdodEJ1ZmZlckNvdW50KTtcclxuICAgICAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXJEYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9saWdodEJ1ZmZlckVsZW1lbnRDb3VudCAqIHRoaXMuX2xpZ2h0QnVmZmVyQ291bnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZmlyc3RsaWdodEJ1ZmZlclZpZXcuaW5pdGlhbGl6ZShuZXcgR0ZYQnVmZmVyVmlld0luZm8odGhpcy5fbGlnaHRCdWZmZXIsIDAsIFVCT0ZvcndhcmRMaWdodC5TSVpFKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IGwgPSAwLCBvZmZzZXQgPSAwOyBsIDwgdGhpcy5fdmFsaWRMaWdodHMubGVuZ3RoOyBsKyssIG9mZnNldCArPSB0aGlzLl9saWdodEJ1ZmZlckVsZW1lbnRDb3VudCkge1xyXG4gICAgICAgICAgICBjb25zdCBsaWdodCA9IHRoaXMuX3ZhbGlkTGlnaHRzW2xdO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChsaWdodC50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIExpZ2h0VHlwZS5TUEhFUkU6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BoZXJlTGl0ID0gbGlnaHQgYXMgU3BoZXJlTGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy50b0FycmF5KF92ZWM0QXJyYXksIHNwaGVyZUxpdC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgX3ZlYzRBcnJheVszXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXJEYXRhLnNldChfdmVjNEFycmF5LCBvZmZzZXQgKyBVQk9Gb3J3YXJkTGlnaHQuTElHSFRfUE9TX09GRlNFVCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbMF0gPSBzcGhlcmVMaXQuc2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICBfdmVjNEFycmF5WzFdID0gc3BoZXJlTGl0LnJhbmdlO1xyXG4gICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbMl0gPSAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXJEYXRhLnNldChfdmVjNEFycmF5LCBvZmZzZXQgKyBVQk9Gb3J3YXJkTGlnaHQuTElHSFRfU0laRV9SQU5HRV9BTkdMRV9PRkZTRVQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBWZWMzLnRvQXJyYXkoX3ZlYzRBcnJheSwgbGlnaHQuY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaWdodC51c2VDb2xvclRlbXBlcmF0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBSR0IgPSBsaWdodC5jb2xvclRlbXBlcmF0dXJlUkdCO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdmVjNEFycmF5WzBdICo9IHRlbXBSR0IueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZlYzRBcnJheVsxXSAqPSB0ZW1wUkdCLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbMl0gKj0gdGVtcFJHQi56O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNIRFIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZlYzRBcnJheVszXSA9IHNwaGVyZUxpdC5sdW1pbmFuY2UgKiB0aGlzLl9mcFNjYWxlICogdGhpcy5fbGlnaHRNZXRlclNjYWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbM10gPSBzcGhlcmVMaXQubHVtaW5hbmNlICogZXhwb3N1cmUgKiB0aGlzLl9saWdodE1ldGVyU2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpZ2h0QnVmZmVyRGF0YS5zZXQoX3ZlYzRBcnJheSwgb2Zmc2V0ICsgVUJPRm9yd2FyZExpZ2h0LkxJR0hUX0NPTE9SX09GRlNFVCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTGlnaHRUeXBlLlNQT1Q6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BvdExpdCA9IGxpZ2h0IGFzIFNwb3RMaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy50b0FycmF5KF92ZWM0QXJyYXksIHNwb3RMaXQucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbM10gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpZ2h0QnVmZmVyRGF0YS5zZXQoX3ZlYzRBcnJheSwgb2Zmc2V0ICsgVUJPRm9yd2FyZExpZ2h0LkxJR0hUX1BPU19PRkZTRVQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfdmVjNEFycmF5WzBdID0gc3BvdExpdC5zaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbMV0gPSBzcG90TGl0LnJhbmdlO1xyXG4gICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbMl0gPSBzcG90TGl0LnNwb3RBbmdsZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saWdodEJ1ZmZlckRhdGEuc2V0KF92ZWM0QXJyYXksIG9mZnNldCArIFVCT0ZvcndhcmRMaWdodC5MSUdIVF9TSVpFX1JBTkdFX0FOR0xFX09GRlNFVCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMudG9BcnJheShfdmVjNEFycmF5LCBzcG90TGl0LmRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlnaHRCdWZmZXJEYXRhLnNldChfdmVjNEFycmF5LCBvZmZzZXQgKyBVQk9Gb3J3YXJkTGlnaHQuTElHSFRfRElSX09GRlNFVCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFZlYzMudG9BcnJheShfdmVjNEFycmF5LCBsaWdodC5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpZ2h0LnVzZUNvbG9yVGVtcGVyYXR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFJHQiA9IGxpZ2h0LmNvbG9yVGVtcGVyYXR1cmVSR0I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbMF0gKj0gdGVtcFJHQi54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdmVjNEFycmF5WzFdICo9IHRlbXBSR0IueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZlYzRBcnJheVsyXSAqPSB0ZW1wUkdCLno7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc0hEUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdmVjNEFycmF5WzNdID0gc3BvdExpdC5sdW1pbmFuY2UgKiB0aGlzLl9mcFNjYWxlICogdGhpcy5fbGlnaHRNZXRlclNjYWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF92ZWM0QXJyYXlbM10gPSBzcG90TGl0Lmx1bWluYW5jZSAqIGV4cG9zdXJlICogdGhpcy5fbGlnaHRNZXRlclNjYWxlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saWdodEJ1ZmZlckRhdGEuc2V0KF92ZWM0QXJyYXksIG9mZnNldCArIFVCT0ZvcndhcmRMaWdodC5MSUdIVF9DT0xPUl9PRkZTRVQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYudXBkYXRlQnVmZmVyKHRoaXMuX2xpZ2h0QnVmZmVyLCB0aGlzLl9saWdodEJ1ZmZlckRhdGEpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==