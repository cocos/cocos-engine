(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../command-buffer.js", "../define.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../command-buffer.js"), require("../define.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.commandBuffer, global.define, global.webgl2Commands);
    global.webgl2CommandBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _commandBuffer, _define, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2CommandBuffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2CommandBuffer = /*#__PURE__*/function (_GFXCommandBuffer) {
    _inherits(WebGL2CommandBuffer, _GFXCommandBuffer);

    function WebGL2CommandBuffer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2CommandBuffer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2CommandBuffer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.cmdPackage = new _webgl2Commands.WebGL2CmdPackage();
      _this._webGLAllocator = null;
      _this._isInRenderPass = false;
      _this._curGPUPipelineState = null;
      _this._curGPUDescriptorSets = [];
      _this._curGPUInputAssembler = null;
      _this._curDynamicOffsets = [];
      _this._curViewport = null;
      _this._curScissor = null;
      _this._curLineWidth = null;
      _this._curDepthBias = null;
      _this._curBlendConstants = [];
      _this._curDepthBounds = null;
      _this._curStencilWriteMask = null;
      _this._curStencilCompareMask = null;
      _this._isStateInvalied = false;
      return _this;
    }

    _createClass(WebGL2CommandBuffer, [{
      key: "initialize",
      value: function initialize(info) {
        this._type = info.type;
        this._queue = info.queue;
        this._webGLAllocator = this._device.cmdAllocator;
        var setCount = this._device.bindingMappingInfo.bufferOffsets.length;

        for (var i = 0; i < setCount; i++) {
          this._curGPUDescriptorSets.push(null);

          this._curDynamicOffsets.push([]);
        }

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._webGLAllocator) {
          this._webGLAllocator.clearCmds(this.cmdPackage);

          this._webGLAllocator = null;
        }
      }
    }, {
      key: "begin",
      value: function begin(renderPass) {
        var subpass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var frameBuffer = arguments.length > 2 ? arguments[2] : undefined;

        this._webGLAllocator.clearCmds(this.cmdPackage);

        this._curGPUPipelineState = null;
        this._curGPUInputAssembler = null;
        this._curGPUDescriptorSets.length = 0;

        for (var i = 0; i < this._curDynamicOffsets.length; i++) {
          this._curDynamicOffsets[i].length = 0;
        }

        this._curViewport = null;
        this._curScissor = null;
        this._curLineWidth = null;
        this._curDepthBias = null;
        this._curBlendConstants.length = 0;
        this._curDepthBounds = null;
        this._curStencilWriteMask = null;
        this._curStencilCompareMask = null;
        this._numDrawCalls = 0;
        this._numInstances = 0;
        this._numTris = 0;
      }
    }, {
      key: "end",
      value: function end() {
        if (this._isStateInvalied) {
          this.bindStates();
        }

        this._isInRenderPass = false;
      }
    }, {
      key: "beginRenderPass",
      value: function beginRenderPass(renderPass, framebuffer, renderArea, clearColors, clearDepth, clearStencil) {
        var cmd = this._webGLAllocator.beginRenderPassCmdPool.alloc(_webgl2Commands.WebGL2CmdBeginRenderPass);

        cmd.gpuRenderPass = renderPass.gpuRenderPass;
        cmd.gpuFramebuffer = framebuffer.gpuFramebuffer;
        cmd.renderArea = renderArea;

        for (var i = 0; i < clearColors.length; ++i) {
          cmd.clearColors[i] = clearColors[i];
        }

        cmd.clearDepth = clearDepth;
        cmd.clearStencil = clearStencil;
        this.cmdPackage.beginRenderPassCmds.push(cmd);
        this.cmdPackage.cmds.push(_webgl2Commands.WebGL2Cmd.BEGIN_RENDER_PASS);
        this._isInRenderPass = true;
      }
    }, {
      key: "endRenderPass",
      value: function endRenderPass() {
        this._isInRenderPass = false;
      }
    }, {
      key: "bindPipelineState",
      value: function bindPipelineState(pipelineState) {
        var gpuPipelineState = pipelineState.gpuPipelineState;

        if (gpuPipelineState !== this._curGPUPipelineState) {
          this._curGPUPipelineState = gpuPipelineState;
          this._isStateInvalied = true;
        }
      }
    }, {
      key: "bindDescriptorSet",
      value: function bindDescriptorSet(set, descriptorSet, dynamicOffsets) {
        var gpuDescriptorSets = descriptorSet.gpuDescriptorSet;

        if (gpuDescriptorSets !== this._curGPUDescriptorSets[set]) {
          this._curGPUDescriptorSets[set] = gpuDescriptorSets;
          this._isStateInvalied = true;
        }

        if (dynamicOffsets) {
          var offsets = this._curDynamicOffsets[set];

          for (var i = 0; i < dynamicOffsets.length; i++) {
            offsets[i] = dynamicOffsets[i];
          }

          offsets.length = dynamicOffsets.length;
          this._isStateInvalied = true;
        }
      }
    }, {
      key: "bindInputAssembler",
      value: function bindInputAssembler(inputAssembler) {
        var gpuInputAssembler = inputAssembler.gpuInputAssembler;
        this._curGPUInputAssembler = gpuInputAssembler;
        this._isStateInvalied = true;
      }
    }, {
      key: "setViewport",
      value: function setViewport(viewport) {
        if (!this._curViewport) {
          this._curViewport = new _define.GFXViewport(viewport.left, viewport.top, viewport.width, viewport.height, viewport.minDepth, viewport.maxDepth);
        } else {
          if (this._curViewport.left !== viewport.left || this._curViewport.top !== viewport.top || this._curViewport.width !== viewport.width || this._curViewport.height !== viewport.height || this._curViewport.minDepth !== viewport.minDepth || this._curViewport.maxDepth !== viewport.maxDepth) {
            this._curViewport.left = viewport.left;
            this._curViewport.top = viewport.top;
            this._curViewport.width = viewport.width;
            this._curViewport.height = viewport.height;
            this._curViewport.minDepth = viewport.minDepth;
            this._curViewport.maxDepth = viewport.maxDepth;
            this._isStateInvalied = true;
          }
        }
      }
    }, {
      key: "setScissor",
      value: function setScissor(scissor) {
        if (!this._curScissor) {
          this._curScissor = new _define.GFXRect(scissor.x, scissor.y, scissor.width, scissor.height);
        } else {
          if (this._curScissor.x !== scissor.x || this._curScissor.y !== scissor.y || this._curScissor.width !== scissor.width || this._curScissor.height !== scissor.height) {
            this._curScissor.x = scissor.x;
            this._curScissor.y = scissor.y;
            this._curScissor.width = scissor.width;
            this._curScissor.height = scissor.height;
            this._isStateInvalied = true;
          }
        }
      }
    }, {
      key: "setLineWidth",
      value: function setLineWidth(lineWidth) {
        if (this._curLineWidth !== lineWidth) {
          this._curLineWidth = lineWidth;
          this._isStateInvalied = true;
        }
      }
    }, {
      key: "setDepthBias",
      value: function setDepthBias(depthBiasConstantFactor, depthBiasClamp, depthBiasSlopeFactor) {
        if (!this._curDepthBias) {
          this._curDepthBias = {
            constantFactor: depthBiasConstantFactor,
            clamp: depthBiasClamp,
            slopeFactor: depthBiasSlopeFactor
          };
          this._isStateInvalied = true;
        } else {
          if (this._curDepthBias.constantFactor !== depthBiasConstantFactor || this._curDepthBias.clamp !== depthBiasClamp || this._curDepthBias.slopeFactor !== depthBiasSlopeFactor) {
            this._curDepthBias.constantFactor = depthBiasConstantFactor;
            this._curDepthBias.clamp = depthBiasClamp;
            this._curDepthBias.slopeFactor = depthBiasSlopeFactor;
            this._isStateInvalied = true;
          }
        }
      }
    }, {
      key: "setBlendConstants",
      value: function setBlendConstants(blendConstants) {
        if (blendConstants.length === 4 && (this._curBlendConstants[0] !== blendConstants[0] || this._curBlendConstants[1] !== blendConstants[1] || this._curBlendConstants[2] !== blendConstants[2] || this._curBlendConstants[3] !== blendConstants[3])) {
          this._curBlendConstants.length = 0;
          Array.prototype.push.apply(this._curBlendConstants, blendConstants);
          this._isStateInvalied = true;
        }
      }
    }, {
      key: "setDepthBound",
      value: function setDepthBound(minDepthBounds, maxDepthBounds) {
        if (!this._curDepthBounds) {
          this._curDepthBounds = {
            minBounds: minDepthBounds,
            maxBounds: maxDepthBounds
          };
          this._isStateInvalied = true;
        } else {
          if (this._curDepthBounds.minBounds !== minDepthBounds || this._curDepthBounds.maxBounds !== maxDepthBounds) {
            this._curDepthBounds = {
              minBounds: minDepthBounds,
              maxBounds: maxDepthBounds
            };
            this._isStateInvalied = true;
          }
        }
      }
    }, {
      key: "setStencilWriteMask",
      value: function setStencilWriteMask(face, writeMask) {
        if (!this._curStencilWriteMask) {
          this._curStencilWriteMask = {
            face: face,
            writeMask: writeMask
          };
          this._isStateInvalied = true;
        } else {
          if (this._curStencilWriteMask.face !== face || this._curStencilWriteMask.writeMask !== writeMask) {
            this._curStencilWriteMask.face = face;
            this._curStencilWriteMask.writeMask = writeMask;
            this._isStateInvalied = true;
          }
        }
      }
    }, {
      key: "setStencilCompareMask",
      value: function setStencilCompareMask(face, reference, compareMask) {
        if (!this._curStencilCompareMask) {
          this._curStencilCompareMask = {
            face: face,
            reference: reference,
            compareMask: compareMask
          };
          this._isStateInvalied = true;
        } else {
          if (this._curStencilCompareMask.face !== face || this._curStencilCompareMask.reference !== reference || this._curStencilCompareMask.compareMask !== compareMask) {
            this._curStencilCompareMask.face = face;
            this._curStencilCompareMask.reference = reference;
            this._curStencilCompareMask.compareMask = compareMask;
            this._isStateInvalied = true;
          }
        }
      }
    }, {
      key: "draw",
      value: function draw(inputAssembler) {
        if (this._type === _define.GFXCommandBufferType.PRIMARY && this._isInRenderPass || this._type === _define.GFXCommandBufferType.SECONDARY) {
          if (this._isStateInvalied) {
            this.bindStates();
          }

          var cmd = this._webGLAllocator.drawCmdPool.alloc(_webgl2Commands.WebGL2CmdDraw); // cmd.drawInfo = inputAssembler;


          cmd.drawInfo.vertexCount = inputAssembler.vertexCount;
          cmd.drawInfo.firstVertex = inputAssembler.firstVertex;
          cmd.drawInfo.indexCount = inputAssembler.indexCount;
          cmd.drawInfo.firstIndex = inputAssembler.firstIndex;
          cmd.drawInfo.vertexOffset = inputAssembler.vertexOffset;
          cmd.drawInfo.instanceCount = inputAssembler.instanceCount;
          cmd.drawInfo.firstInstance = inputAssembler.firstInstance;
          this.cmdPackage.drawCmds.push(cmd);
          this.cmdPackage.cmds.push(_webgl2Commands.WebGL2Cmd.DRAW);
          ++this._numDrawCalls;
          this._numInstances += inputAssembler.instanceCount;
          var indexCount = inputAssembler.indexCount || inputAssembler.vertexCount;

          if (this._curGPUPipelineState) {
            var glPrimitive = this._curGPUPipelineState.glPrimitive;

            switch (glPrimitive) {
              case 0x0004:
                {
                  // WebGLRenderingContext.TRIANGLES
                  this._numTris += indexCount / 3 * Math.max(inputAssembler.instanceCount, 1);
                  break;
                }

              case 0x0005: // WebGLRenderingContext.TRIANGLE_STRIP

              case 0x0006:
                {
                  // WebGLRenderingContext.TRIANGLE_FAN
                  this._numTris += (indexCount - 2) * Math.max(inputAssembler.instanceCount, 1);
                  break;
                }
            }
          }
        } else {
          console.error('Command \'draw\' must be recorded inside a render pass.');
        }
      }
    }, {
      key: "updateBuffer",
      value: function updateBuffer(buffer, data, offset, size) {
        if (this._type === _define.GFXCommandBufferType.PRIMARY && !this._isInRenderPass || this._type === _define.GFXCommandBufferType.SECONDARY) {
          var gpuBuffer = buffer.gpuBuffer;

          if (gpuBuffer) {
            var cmd = this._webGLAllocator.updateBufferCmdPool.alloc(_webgl2Commands.WebGL2CmdUpdateBuffer);

            var buffSize = 0;
            var buff = null; // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
            // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now

            if (buffer.usage & _define.GFXBufferUsageBit.INDIRECT) {
              buff = data;
            } else {
              if (size !== undefined) {
                buffSize = size;
              } else {
                buffSize = data.byteLength;
              }

              buff = data;
            }

            cmd.gpuBuffer = gpuBuffer;
            cmd.buffer = buff;
            cmd.offset = offset !== undefined ? offset : 0;
            cmd.size = buffSize;
            this.cmdPackage.updateBufferCmds.push(cmd);
            this.cmdPackage.cmds.push(_webgl2Commands.WebGL2Cmd.UPDATE_BUFFER);
          }
        } else {
          console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
      }
    }, {
      key: "copyBuffersToTexture",
      value: function copyBuffersToTexture(buffers, texture, regions) {
        if (this._type === _define.GFXCommandBufferType.PRIMARY && !this._isInRenderPass || this._type === _define.GFXCommandBufferType.SECONDARY) {
          var gpuTexture = texture.gpuTexture;

          if (gpuTexture) {
            var cmd = this._webGLAllocator.copyBufferToTextureCmdPool.alloc(_webgl2Commands.WebGL2CmdCopyBufferToTexture);

            cmd.gpuTexture = gpuTexture;
            cmd.regions = regions; // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
            // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now

            cmd.buffers = buffers;
            this.cmdPackage.copyBufferToTextureCmds.push(cmd);
            this.cmdPackage.cmds.push(_webgl2Commands.WebGL2Cmd.COPY_BUFFER_TO_TEXTURE);
          }
        } else {
          console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
      }
    }, {
      key: "execute",
      value: function execute(cmdBuffs, count) {
        for (var i = 0; i < count; ++i) {
          var webGL2CmdBuff = cmdBuffs[i];

          for (var c = 0; c < webGL2CmdBuff.cmdPackage.beginRenderPassCmds.length; ++c) {
            var cmd = webGL2CmdBuff.cmdPackage.beginRenderPassCmds.array[c];
            ++cmd.refCount;
            this.cmdPackage.beginRenderPassCmds.push(cmd);
          }

          for (var _c = 0; _c < webGL2CmdBuff.cmdPackage.bindStatesCmds.length; ++_c) {
            var _cmd = webGL2CmdBuff.cmdPackage.bindStatesCmds.array[_c];
            ++_cmd.refCount;
            this.cmdPackage.bindStatesCmds.push(_cmd);
          }

          for (var _c2 = 0; _c2 < webGL2CmdBuff.cmdPackage.drawCmds.length; ++_c2) {
            var _cmd2 = webGL2CmdBuff.cmdPackage.drawCmds.array[_c2];
            ++_cmd2.refCount;
            this.cmdPackage.drawCmds.push(_cmd2);
          }

          for (var _c3 = 0; _c3 < webGL2CmdBuff.cmdPackage.updateBufferCmds.length; ++_c3) {
            var _cmd3 = webGL2CmdBuff.cmdPackage.updateBufferCmds.array[_c3];
            ++_cmd3.refCount;
            this.cmdPackage.updateBufferCmds.push(_cmd3);
          }

          for (var _c4 = 0; _c4 < webGL2CmdBuff.cmdPackage.copyBufferToTextureCmds.length; ++_c4) {
            var _cmd4 = webGL2CmdBuff.cmdPackage.copyBufferToTextureCmds.array[_c4];
            ++_cmd4.refCount;
            this.cmdPackage.copyBufferToTextureCmds.push(_cmd4);
          }

          this.cmdPackage.cmds.concat(webGL2CmdBuff.cmdPackage.cmds.array);
          this._numDrawCalls += webGL2CmdBuff._numDrawCalls;
          this._numInstances += webGL2CmdBuff._numInstances;
          this._numTris += webGL2CmdBuff._numTris;
        }
      }
    }, {
      key: "bindStates",
      value: function bindStates() {
        var bindStatesCmd = this._webGLAllocator.bindStatesCmdPool.alloc(_webgl2Commands.WebGL2CmdBindStates);

        bindStatesCmd.gpuPipelineState = this._curGPUPipelineState;
        Array.prototype.push.apply(bindStatesCmd.gpuDescriptorSets, this._curGPUDescriptorSets);

        for (var i = 0; i < this._curDynamicOffsets.length; i++) {
          Array.prototype.push.apply(bindStatesCmd.dynamicOffsets, this._curDynamicOffsets[i]);
        }

        bindStatesCmd.gpuInputAssembler = this._curGPUInputAssembler;
        bindStatesCmd.viewport = this._curViewport;
        bindStatesCmd.scissor = this._curScissor;
        bindStatesCmd.lineWidth = this._curLineWidth;
        bindStatesCmd.depthBias = this._curDepthBias;
        Array.prototype.push.apply(bindStatesCmd.blendConstants, this._curBlendConstants);
        bindStatesCmd.depthBounds = this._curDepthBounds;
        bindStatesCmd.stencilWriteMask = this._curStencilWriteMask;
        bindStatesCmd.stencilCompareMask = this._curStencilCompareMask;
        this.cmdPackage.bindStatesCmds.push(bindStatesCmd);
        this.cmdPackage.cmds.push(_webgl2Commands.WebGL2Cmd.BIND_STATES);
        this._isStateInvalied = false;
      }
    }, {
      key: "webGLDevice",
      get: function get() {
        return this._device;
      }
    }]);

    return WebGL2CommandBuffer;
  }(_commandBuffer.GFXCommandBuffer);

  _exports.WebGL2CommandBuffer = WebGL2CommandBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItY29tbWFuZC1idWZmZXIudHMiXSwibmFtZXMiOlsiV2ViR0wyQ29tbWFuZEJ1ZmZlciIsImNtZFBhY2thZ2UiLCJXZWJHTDJDbWRQYWNrYWdlIiwiX3dlYkdMQWxsb2NhdG9yIiwiX2lzSW5SZW5kZXJQYXNzIiwiX2N1ckdQVVBpcGVsaW5lU3RhdGUiLCJfY3VyR1BVRGVzY3JpcHRvclNldHMiLCJfY3VyR1BVSW5wdXRBc3NlbWJsZXIiLCJfY3VyRHluYW1pY09mZnNldHMiLCJfY3VyVmlld3BvcnQiLCJfY3VyU2Npc3NvciIsIl9jdXJMaW5lV2lkdGgiLCJfY3VyRGVwdGhCaWFzIiwiX2N1ckJsZW5kQ29uc3RhbnRzIiwiX2N1ckRlcHRoQm91bmRzIiwiX2N1clN0ZW5jaWxXcml0ZU1hc2siLCJfY3VyU3RlbmNpbENvbXBhcmVNYXNrIiwiX2lzU3RhdGVJbnZhbGllZCIsImluZm8iLCJfdHlwZSIsInR5cGUiLCJfcXVldWUiLCJxdWV1ZSIsIl9kZXZpY2UiLCJjbWRBbGxvY2F0b3IiLCJzZXRDb3VudCIsImJpbmRpbmdNYXBwaW5nSW5mbyIsImJ1ZmZlck9mZnNldHMiLCJsZW5ndGgiLCJpIiwicHVzaCIsImNsZWFyQ21kcyIsInJlbmRlclBhc3MiLCJzdWJwYXNzIiwiZnJhbWVCdWZmZXIiLCJfbnVtRHJhd0NhbGxzIiwiX251bUluc3RhbmNlcyIsIl9udW1UcmlzIiwiYmluZFN0YXRlcyIsImZyYW1lYnVmZmVyIiwicmVuZGVyQXJlYSIsImNsZWFyQ29sb3JzIiwiY2xlYXJEZXB0aCIsImNsZWFyU3RlbmNpbCIsImNtZCIsImJlZ2luUmVuZGVyUGFzc0NtZFBvb2wiLCJhbGxvYyIsIldlYkdMMkNtZEJlZ2luUmVuZGVyUGFzcyIsImdwdVJlbmRlclBhc3MiLCJncHVGcmFtZWJ1ZmZlciIsImJlZ2luUmVuZGVyUGFzc0NtZHMiLCJjbWRzIiwiV2ViR0wyQ21kIiwiQkVHSU5fUkVOREVSX1BBU1MiLCJwaXBlbGluZVN0YXRlIiwiZ3B1UGlwZWxpbmVTdGF0ZSIsInNldCIsImRlc2NyaXB0b3JTZXQiLCJkeW5hbWljT2Zmc2V0cyIsImdwdURlc2NyaXB0b3JTZXRzIiwiZ3B1RGVzY3JpcHRvclNldCIsIm9mZnNldHMiLCJpbnB1dEFzc2VtYmxlciIsImdwdUlucHV0QXNzZW1ibGVyIiwidmlld3BvcnQiLCJHRlhWaWV3cG9ydCIsImxlZnQiLCJ0b3AiLCJ3aWR0aCIsImhlaWdodCIsIm1pbkRlcHRoIiwibWF4RGVwdGgiLCJzY2lzc29yIiwiR0ZYUmVjdCIsIngiLCJ5IiwibGluZVdpZHRoIiwiZGVwdGhCaWFzQ29uc3RhbnRGYWN0b3IiLCJkZXB0aEJpYXNDbGFtcCIsImRlcHRoQmlhc1Nsb3BlRmFjdG9yIiwiY29uc3RhbnRGYWN0b3IiLCJjbGFtcCIsInNsb3BlRmFjdG9yIiwiYmxlbmRDb25zdGFudHMiLCJBcnJheSIsInByb3RvdHlwZSIsImFwcGx5IiwibWluRGVwdGhCb3VuZHMiLCJtYXhEZXB0aEJvdW5kcyIsIm1pbkJvdW5kcyIsIm1heEJvdW5kcyIsImZhY2UiLCJ3cml0ZU1hc2siLCJyZWZlcmVuY2UiLCJjb21wYXJlTWFzayIsIkdGWENvbW1hbmRCdWZmZXJUeXBlIiwiUFJJTUFSWSIsIlNFQ09OREFSWSIsImRyYXdDbWRQb29sIiwiV2ViR0wyQ21kRHJhdyIsImRyYXdJbmZvIiwidmVydGV4Q291bnQiLCJmaXJzdFZlcnRleCIsImluZGV4Q291bnQiLCJmaXJzdEluZGV4IiwidmVydGV4T2Zmc2V0IiwiaW5zdGFuY2VDb3VudCIsImZpcnN0SW5zdGFuY2UiLCJkcmF3Q21kcyIsIkRSQVciLCJnbFByaW1pdGl2ZSIsIk1hdGgiLCJtYXgiLCJjb25zb2xlIiwiZXJyb3IiLCJidWZmZXIiLCJkYXRhIiwib2Zmc2V0Iiwic2l6ZSIsImdwdUJ1ZmZlciIsInVwZGF0ZUJ1ZmZlckNtZFBvb2wiLCJXZWJHTDJDbWRVcGRhdGVCdWZmZXIiLCJidWZmU2l6ZSIsImJ1ZmYiLCJ1c2FnZSIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiSU5ESVJFQ1QiLCJ1bmRlZmluZWQiLCJieXRlTGVuZ3RoIiwidXBkYXRlQnVmZmVyQ21kcyIsIlVQREFURV9CVUZGRVIiLCJidWZmZXJzIiwidGV4dHVyZSIsInJlZ2lvbnMiLCJncHVUZXh0dXJlIiwiY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2wiLCJXZWJHTDJDbWRDb3B5QnVmZmVyVG9UZXh0dXJlIiwiY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMiLCJDT1BZX0JVRkZFUl9UT19URVhUVVJFIiwiY21kQnVmZnMiLCJjb3VudCIsIndlYkdMMkNtZEJ1ZmYiLCJjIiwiYXJyYXkiLCJyZWZDb3VudCIsImJpbmRTdGF0ZXNDbWRzIiwiY29uY2F0IiwiYmluZFN0YXRlc0NtZCIsImJpbmRTdGF0ZXNDbWRQb29sIiwiV2ViR0wyQ21kQmluZFN0YXRlcyIsImRlcHRoQmlhcyIsImRlcHRoQm91bmRzIiwic3RlbmNpbFdyaXRlTWFzayIsInN0ZW5jaWxDb21wYXJlTWFzayIsIkJJTkRfU1RBVEVTIiwiR0ZYQ29tbWFuZEJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyRGFBLG1COzs7Ozs7Ozs7Ozs7Ozs7WUFFRkMsVSxHQUErQixJQUFJQyxnQ0FBSixFO1lBQzVCQyxlLEdBQWlELEk7WUFDakRDLGUsR0FBMkIsSztZQUMzQkMsb0IsR0FBdUQsSTtZQUN2REMscUIsR0FBbUQsRTtZQUNuREMscUIsR0FBeUQsSTtZQUN6REMsa0IsR0FBaUMsRTtZQUNqQ0MsWSxHQUFtQyxJO1lBQ25DQyxXLEdBQThCLEk7WUFDOUJDLGEsR0FBK0IsSTtZQUMvQkMsYSxHQUF5QyxJO1lBQ3pDQyxrQixHQUErQixFO1lBQy9CQyxlLEdBQTZDLEk7WUFDN0NDLG9CLEdBQXVELEk7WUFDdkRDLHNCLEdBQTJELEk7WUFDM0RDLGdCLEdBQTRCLEs7Ozs7OztpQ0FHbkJDLEksRUFBcUM7QUFFcEQs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SSwrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXQgfSBmcm9tICcuLi9kZXNjcmlwdG9yLXNldCc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVyU291cmNlIH0gZnJvbSAnLi4vYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYQ29tbWFuZEJ1ZmZlciwgR0ZYQ29tbWFuZEJ1ZmZlckluZm8gfSBmcm9tICcuLi9jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7XHJcbiAgICBHRlhCdWZmZXJUZXh0dXJlQ29weSxcclxuICAgIEdGWEJ1ZmZlclVzYWdlQml0LFxyXG4gICAgR0ZYQ29tbWFuZEJ1ZmZlclR5cGUsXHJcbiAgICBHRlhTdGVuY2lsRmFjZSxcclxuICAgIEdGWENvbG9yLFxyXG4gICAgR0ZYUmVjdCxcclxuICAgIEdGWFZpZXdwb3J0LFxyXG59IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWEZyYW1lYnVmZmVyIH0gZnJvbSAnLi4vZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBHRlhJbnB1dEFzc2VtYmxlciB9IGZyb20gJy4uL2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IEdGWFBpcGVsaW5lU3RhdGUgfSBmcm9tICcuLi9waXBlbGluZS1zdGF0ZSc7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUgfSBmcm9tICcuLi90ZXh0dXJlJztcclxuaW1wb3J0IHsgV2ViR0wyRGVzY3JpcHRvclNldCB9IGZyb20gJy4vd2ViZ2wyLWRlc2NyaXB0b3Itc2V0JztcclxuaW1wb3J0IHsgV2ViR0wyQnVmZmVyIH0gZnJvbSAnLi93ZWJnbDItYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0wyQ29tbWFuZEFsbG9jYXRvciB9IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmQtYWxsb2NhdG9yJztcclxuaW1wb3J0IHtcclxuICAgIFdlYkdMMkNtZCxcclxuICAgIFdlYkdMMkNtZEJlZ2luUmVuZGVyUGFzcyxcclxuICAgIFdlYkdMMkNtZEJpbmRTdGF0ZXMsXHJcbiAgICBXZWJHTDJDbWRDb3B5QnVmZmVyVG9UZXh0dXJlLFxyXG4gICAgV2ViR0wyQ21kRHJhdyxcclxuICAgIFdlYkdMMkNtZFBhY2thZ2UsXHJcbiAgICBXZWJHTDJDbWRVcGRhdGVCdWZmZXIsXHJcbn0gZnJvbSAnLi93ZWJnbDItY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTDJEZXZpY2UgfSBmcm9tICcuL3dlYmdsMi1kZXZpY2UnO1xyXG5pbXBvcnQgeyBXZWJHTDJGcmFtZWJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wyLWZyYW1lYnVmZmVyJztcclxuaW1wb3J0IHsgSVdlYkdMMkdQVUlucHV0QXNzZW1ibGVyLCBJV2ViR0wyR1BVRGVzY3JpcHRvclNldCwgSVdlYkdMMkdQVVBpcGVsaW5lU3RhdGUgfSBmcm9tICcuL3dlYmdsMi1ncHUtb2JqZWN0cyc7XHJcbmltcG9ydCB7IFdlYkdMMklucHV0QXNzZW1ibGVyIH0gZnJvbSAnLi93ZWJnbDItaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgV2ViR0wyUGlwZWxpbmVTdGF0ZSB9IGZyb20gJy4vd2ViZ2wyLXBpcGVsaW5lLXN0YXRlJztcclxuaW1wb3J0IHsgV2ViR0wyVGV4dHVyZSB9IGZyb20gJy4vd2ViZ2wyLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi4vcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBXZWJHTDJSZW5kZXJQYXNzIH0gZnJvbSAnLi93ZWJnbDItcmVuZGVyLXBhc3MnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJV2ViR0wyRGVwdGhCaWFzIHtcclxuICAgIGNvbnN0YW50RmFjdG9yOiBudW1iZXI7XHJcbiAgICBjbGFtcDogbnVtYmVyO1xyXG4gICAgc2xvcGVGYWN0b3I6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJV2ViR0wyRGVwdGhCb3VuZHMge1xyXG4gICAgbWluQm91bmRzOiBudW1iZXI7XHJcbiAgICBtYXhCb3VuZHM6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJV2ViR0wyU3RlbmNpbFdyaXRlTWFzayB7XHJcbiAgICBmYWNlOiBHRlhTdGVuY2lsRmFjZTtcclxuICAgIHdyaXRlTWFzazogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElXZWJHTDJTdGVuY2lsQ29tcGFyZU1hc2sge1xyXG4gICAgZmFjZTogR0ZYU3RlbmNpbEZhY2U7XHJcbiAgICByZWZlcmVuY2U6IG51bWJlcjtcclxuICAgIGNvbXBhcmVNYXNrOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTDJDb21tYW5kQnVmZmVyIGV4dGVuZHMgR0ZYQ29tbWFuZEJ1ZmZlciB7XHJcblxyXG4gICAgcHVibGljIGNtZFBhY2thZ2U6IFdlYkdMMkNtZFBhY2thZ2UgPSBuZXcgV2ViR0wyQ21kUGFja2FnZSgpO1xyXG4gICAgcHJvdGVjdGVkIF93ZWJHTEFsbG9jYXRvcjogV2ViR0wyQ29tbWFuZEFsbG9jYXRvciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9pc0luUmVuZGVyUGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJHUFVQaXBlbGluZVN0YXRlOiBJV2ViR0wyR1BVUGlwZWxpbmVTdGF0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJHUFVEZXNjcmlwdG9yU2V0czogSVdlYkdMMkdQVURlc2NyaXB0b3JTZXRbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJHUFVJbnB1dEFzc2VtYmxlcjogSVdlYkdMMkdQVUlucHV0QXNzZW1ibGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckR5bmFtaWNPZmZzZXRzOiBudW1iZXJbXVtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2N1clZpZXdwb3J0OiBHRlhWaWV3cG9ydCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJTY2lzc29yOiBHRlhSZWN0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckxpbmVXaWR0aDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckRlcHRoQmlhczogSVdlYkdMMkRlcHRoQmlhcyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJCbGVuZENvbnN0YW50czogbnVtYmVyW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfY3VyRGVwdGhCb3VuZHM6IElXZWJHTDJEZXB0aEJvdW5kcyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJTdGVuY2lsV3JpdGVNYXNrOiBJV2ViR0wyU3RlbmNpbFdyaXRlTWFzayB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJTdGVuY2lsQ29tcGFyZU1hc2s6IElXZWJHTDJTdGVuY2lsQ29tcGFyZU1hc2sgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfaXNTdGF0ZUludmFsaWVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhDb21tYW5kQnVmZmVySW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gaW5mby50eXBlO1xyXG4gICAgICAgIHRoaXMuX3F1ZXVlID0gaW5mby5xdWV1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2ViR0xBbGxvY2F0b3IgPSAodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSkuY21kQWxsb2NhdG9yO1xyXG5cclxuICAgICAgICBjb25zdCBzZXRDb3VudCA9ICh0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlKS5iaW5kaW5nTWFwcGluZ0luZm8uYnVmZmVyT2Zmc2V0cy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckdQVURlc2NyaXB0b3JTZXRzLnB1c2gobnVsbCEpO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJEeW5hbWljT2Zmc2V0cy5wdXNoKFtdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fd2ViR0xBbGxvY2F0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fd2ViR0xBbGxvY2F0b3IuY2xlYXJDbWRzKHRoaXMuY21kUGFja2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYkdMQWxsb2NhdG9yID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJlZ2luIChyZW5kZXJQYXNzPzogR0ZYUmVuZGVyUGFzcywgc3VicGFzcyA9IDAsIGZyYW1lQnVmZmVyPzogR0ZYRnJhbWVidWZmZXIpIHtcclxuICAgICAgICB0aGlzLl93ZWJHTEFsbG9jYXRvciEuY2xlYXJDbWRzKHRoaXMuY21kUGFja2FnZSk7XHJcbiAgICAgICAgdGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyR1BVSW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1ckdQVURlc2NyaXB0b3JTZXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jdXJEeW5hbWljT2Zmc2V0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJEeW5hbWljT2Zmc2V0c1tpXS5sZW5ndGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jdXJWaWV3cG9ydCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyU2Npc3NvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyTGluZVdpZHRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJEZXB0aEJpYXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fY3VyRGVwdGhCb3VuZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1clN0ZW5jaWxDb21wYXJlTWFzayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbnVtRHJhd0NhbGxzID0gMDtcclxuICAgICAgICB0aGlzLl9udW1JbnN0YW5jZXMgPSAwO1xyXG4gICAgICAgIHRoaXMuX251bVRyaXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc1N0YXRlSW52YWxpZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5iaW5kU3RhdGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0luUmVuZGVyUGFzcyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiZWdpblJlbmRlclBhc3MgKFxyXG4gICAgICAgIHJlbmRlclBhc3M6IEdGWFJlbmRlclBhc3MsXHJcbiAgICAgICAgZnJhbWVidWZmZXI6IEdGWEZyYW1lYnVmZmVyLFxyXG4gICAgICAgIHJlbmRlckFyZWE6IEdGWFJlY3QsXHJcbiAgICAgICAgY2xlYXJDb2xvcnM6IEdGWENvbG9yW10sXHJcbiAgICAgICAgY2xlYXJEZXB0aDogbnVtYmVyLFxyXG4gICAgICAgIGNsZWFyU3RlbmNpbDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgY21kID0gdGhpcy5fd2ViR0xBbGxvY2F0b3IhLmJlZ2luUmVuZGVyUGFzc0NtZFBvb2wuYWxsb2MoV2ViR0wyQ21kQmVnaW5SZW5kZXJQYXNzKTtcclxuICAgICAgICBjbWQuZ3B1UmVuZGVyUGFzcyA9IChyZW5kZXJQYXNzIGFzIFdlYkdMMlJlbmRlclBhc3MpLmdwdVJlbmRlclBhc3M7XHJcbiAgICAgICAgY21kLmdwdUZyYW1lYnVmZmVyID0gKGZyYW1lYnVmZmVyIGFzIFdlYkdMMkZyYW1lYnVmZmVyKS5ncHVGcmFtZWJ1ZmZlcjtcclxuICAgICAgICBjbWQucmVuZGVyQXJlYSA9IHJlbmRlckFyZWE7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGVhckNvbG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjbWQuY2xlYXJDb2xvcnNbaV0gPSBjbGVhckNvbG9yc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY21kLmNsZWFyRGVwdGggPSBjbGVhckRlcHRoO1xyXG4gICAgICAgIGNtZC5jbGVhclN0ZW5jaWwgPSBjbGVhclN0ZW5jaWw7XHJcbiAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmJlZ2luUmVuZGVyUGFzc0NtZHMucHVzaChjbWQpO1xyXG5cclxuICAgICAgICB0aGlzLmNtZFBhY2thZ2UuY21kcy5wdXNoKFdlYkdMMkNtZC5CRUdJTl9SRU5ERVJfUEFTUyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzSW5SZW5kZXJQYXNzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5kUmVuZGVyUGFzcyAoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJblJlbmRlclBhc3MgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZFBpcGVsaW5lU3RhdGUgKHBpcGVsaW5lU3RhdGU6IEdGWFBpcGVsaW5lU3RhdGUpIHtcclxuICAgICAgICBjb25zdCBncHVQaXBlbGluZVN0YXRlID0gKHBpcGVsaW5lU3RhdGUgYXMgV2ViR0wyUGlwZWxpbmVTdGF0ZSkuZ3B1UGlwZWxpbmVTdGF0ZTtcclxuICAgICAgICBpZiAoZ3B1UGlwZWxpbmVTdGF0ZSAhPT0gdGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJHUFVQaXBlbGluZVN0YXRlID0gZ3B1UGlwZWxpbmVTdGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJpbmREZXNjcmlwdG9yU2V0IChzZXQ6IG51bWJlciwgZGVzY3JpcHRvclNldDogR0ZYRGVzY3JpcHRvclNldCwgZHluYW1pY09mZnNldHM/OiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IGdwdURlc2NyaXB0b3JTZXRzID0gKGRlc2NyaXB0b3JTZXQgYXMgV2ViR0wyRGVzY3JpcHRvclNldCkuZ3B1RGVzY3JpcHRvclNldDtcclxuICAgICAgICBpZiAoZ3B1RGVzY3JpcHRvclNldHMgIT09IHRoaXMuX2N1ckdQVURlc2NyaXB0b3JTZXRzW3NldF0pIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyR1BVRGVzY3JpcHRvclNldHNbc2V0XSA9IGdwdURlc2NyaXB0b3JTZXRzO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZHluYW1pY09mZnNldHMpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0cyA9IHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzW3NldF07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZHluYW1pY09mZnNldHMubGVuZ3RoOyBpKyspIG9mZnNldHNbaV0gPSBkeW5hbWljT2Zmc2V0c1tpXTtcclxuICAgICAgICAgICAgb2Zmc2V0cy5sZW5ndGggPSBkeW5hbWljT2Zmc2V0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiaW5kSW5wdXRBc3NlbWJsZXIgKGlucHV0QXNzZW1ibGVyOiBHRlhJbnB1dEFzc2VtYmxlcikge1xyXG4gICAgICAgIGNvbnN0IGdwdUlucHV0QXNzZW1ibGVyID0gKGlucHV0QXNzZW1ibGVyIGFzIFdlYkdMMklucHV0QXNzZW1ibGVyKS5ncHVJbnB1dEFzc2VtYmxlcjtcclxuICAgICAgICB0aGlzLl9jdXJHUFVJbnB1dEFzc2VtYmxlciA9IGdwdUlucHV0QXNzZW1ibGVyO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZpZXdwb3J0ICh2aWV3cG9ydDogR0ZYVmlld3BvcnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1clZpZXdwb3J0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0ID0gbmV3IEdGWFZpZXdwb3J0KHZpZXdwb3J0LmxlZnQsIHZpZXdwb3J0LnRvcCwgdmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCwgdmlld3BvcnQubWluRGVwdGgsIHZpZXdwb3J0Lm1heERlcHRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VyVmlld3BvcnQubGVmdCAhPT0gdmlld3BvcnQubGVmdCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQudG9wICE9PSB2aWV3cG9ydC50b3AgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0LndpZHRoICE9PSB2aWV3cG9ydC53aWR0aCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQuaGVpZ2h0ICE9PSB2aWV3cG9ydC5oZWlnaHQgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0Lm1pbkRlcHRoICE9PSB2aWV3cG9ydC5taW5EZXB0aCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQubWF4RGVwdGggIT09IHZpZXdwb3J0Lm1heERlcHRoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQubGVmdCA9IHZpZXdwb3J0LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJWaWV3cG9ydC50b3AgPSB2aWV3cG9ydC50b3A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJWaWV3cG9ydC53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQuaGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQubWluRGVwdGggPSB2aWV3cG9ydC5taW5EZXB0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0Lm1heERlcHRoID0gdmlld3BvcnQubWF4RGVwdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTY2lzc29yIChzY2lzc29yOiBHRlhSZWN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJTY2lzc29yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1clNjaXNzb3IgPSBuZXcgR0ZYUmVjdChzY2lzc29yLngsIHNjaXNzb3IueSwgc2Npc3Nvci53aWR0aCwgc2Npc3Nvci5oZWlnaHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJTY2lzc29yLnggIT09IHNjaXNzb3IueCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci55ICE9PSBzY2lzc29yLnkgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clNjaXNzb3Iud2lkdGggIT09IHNjaXNzb3Iud2lkdGggfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clNjaXNzb3IuaGVpZ2h0ICE9PSBzY2lzc29yLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci54ID0gc2Npc3Nvci54O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci55ID0gc2Npc3Nvci55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci53aWR0aCA9IHNjaXNzb3Iud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJTY2lzc29yLmhlaWdodCA9IHNjaXNzb3IuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TGluZVdpZHRoIChsaW5lV2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9jdXJMaW5lV2lkdGggIT09IGxpbmVXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJMaW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREZXB0aEJpYXMgKGRlcHRoQmlhc0NvbnN0YW50RmFjdG9yOiBudW1iZXIsIGRlcHRoQmlhc0NsYW1wOiBudW1iZXIsIGRlcHRoQmlhc1Nsb3BlRmFjdG9yOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1ckRlcHRoQmlhcykge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJEZXB0aEJpYXMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdGFudEZhY3RvcjogZGVwdGhCaWFzQ29uc3RhbnRGYWN0b3IsXHJcbiAgICAgICAgICAgICAgICBjbGFtcDogZGVwdGhCaWFzQ2xhbXAsXHJcbiAgICAgICAgICAgICAgICBzbG9wZUZhY3RvcjogZGVwdGhCaWFzU2xvcGVGYWN0b3IsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckRlcHRoQmlhcy5jb25zdGFudEZhY3RvciAhPT0gZGVwdGhCaWFzQ29uc3RhbnRGYWN0b3IgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcy5jbGFtcCAhPT0gZGVwdGhCaWFzQ2xhbXAgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcy5zbG9wZUZhY3RvciAhPT0gZGVwdGhCaWFzU2xvcGVGYWN0b3IpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJEZXB0aEJpYXMuY29uc3RhbnRGYWN0b3IgPSBkZXB0aEJpYXNDb25zdGFudEZhY3RvcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcy5jbGFtcCA9IGRlcHRoQmlhc0NsYW1wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyRGVwdGhCaWFzLnNsb3BlRmFjdG9yID0gZGVwdGhCaWFzU2xvcGVGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRCbGVuZENvbnN0YW50cyAoYmxlbmRDb25zdGFudHM6IG51bWJlcltdKSB7XHJcbiAgICAgICAgaWYgKGJsZW5kQ29uc3RhbnRzLmxlbmd0aCA9PT0gNCAmJiAoXHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzWzBdICE9PSBibGVuZENvbnN0YW50c1swXSB8fFxyXG4gICAgICAgICAgICB0aGlzLl9jdXJCbGVuZENvbnN0YW50c1sxXSAhPT0gYmxlbmRDb25zdGFudHNbMV0gfHxcclxuICAgICAgICAgICAgdGhpcy5fY3VyQmxlbmRDb25zdGFudHNbMl0gIT09IGJsZW5kQ29uc3RhbnRzWzJdIHx8XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzWzNdICE9PSBibGVuZENvbnN0YW50c1szXSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyQmxlbmRDb25zdGFudHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fY3VyQmxlbmRDb25zdGFudHMsIGJsZW5kQ29uc3RhbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlcHRoQm91bmQgKG1pbkRlcHRoQm91bmRzOiBudW1iZXIsIG1heERlcHRoQm91bmRzOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1ckRlcHRoQm91bmRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgbWluQm91bmRzOiBtaW5EZXB0aEJvdW5kcyxcclxuICAgICAgICAgICAgICAgIG1heEJvdW5kczogbWF4RGVwdGhCb3VuZHMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckRlcHRoQm91bmRzLm1pbkJvdW5kcyAhPT0gbWluRGVwdGhCb3VuZHMgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzLm1heEJvdW5kcyAhPT0gbWF4RGVwdGhCb3VuZHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkJvdW5kczogbWluRGVwdGhCb3VuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4Qm91bmRzOiBtYXhEZXB0aEJvdW5kcyxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTdGVuY2lsV3JpdGVNYXNrIChmYWNlOiBHRlhTdGVuY2lsRmFjZSwgd3JpdGVNYXNrOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2spIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzayA9IHtcclxuICAgICAgICAgICAgICAgIGZhY2UsXHJcbiAgICAgICAgICAgICAgICB3cml0ZU1hc2ssXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2suZmFjZSAhPT0gZmFjZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2sgIT09IHdyaXRlTWFzaykge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2suZmFjZSA9IGZhY2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJTdGVuY2lsV3JpdGVNYXNrLndyaXRlTWFzayA9IHdyaXRlTWFzaztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFN0ZW5jaWxDb21wYXJlTWFzayAoZmFjZTogR0ZYU3RlbmNpbEZhY2UsIHJlZmVyZW5jZTogbnVtYmVyLCBjb21wYXJlTWFzazogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2spIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrID0ge1xyXG4gICAgICAgICAgICAgICAgZmFjZSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgIGNvbXBhcmVNYXNrLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2suZmFjZSAhPT0gZmFjZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSAhPT0gcmVmZXJlbmNlIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2sgIT09IGNvbXBhcmVNYXNrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrLmZhY2UgPSBmYWNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzayA9IGNvbXBhcmVNYXNrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyAoaW5wdXRBc3NlbWJsZXI6IEdGWElucHV0QXNzZW1ibGVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IEdGWENvbW1hbmRCdWZmZXJUeXBlLlBSSU1BUlkgJiYgdGhpcy5faXNJblJlbmRlclBhc3MgfHxcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9PT0gR0ZYQ29tbWFuZEJ1ZmZlclR5cGUuU0VDT05EQVJZKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1N0YXRlSW52YWxpZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZFN0YXRlcygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEuZHJhd0NtZFBvb2wuYWxsb2MoV2ViR0wyQ21kRHJhdyk7XHJcbiAgICAgICAgICAgIC8vIGNtZC5kcmF3SW5mbyA9IGlucHV0QXNzZW1ibGVyO1xyXG4gICAgICAgICAgICBjbWQuZHJhd0luZm8udmVydGV4Q291bnQgPSBpbnB1dEFzc2VtYmxlci52ZXJ0ZXhDb3VudDtcclxuICAgICAgICAgICAgY21kLmRyYXdJbmZvLmZpcnN0VmVydGV4ID0gaW5wdXRBc3NlbWJsZXIuZmlyc3RWZXJ0ZXg7XHJcbiAgICAgICAgICAgIGNtZC5kcmF3SW5mby5pbmRleENvdW50ID0gaW5wdXRBc3NlbWJsZXIuaW5kZXhDb3VudDtcclxuICAgICAgICAgICAgY21kLmRyYXdJbmZvLmZpcnN0SW5kZXggPSBpbnB1dEFzc2VtYmxlci5maXJzdEluZGV4O1xyXG4gICAgICAgICAgICBjbWQuZHJhd0luZm8udmVydGV4T2Zmc2V0ID0gaW5wdXRBc3NlbWJsZXIudmVydGV4T2Zmc2V0O1xyXG4gICAgICAgICAgICBjbWQuZHJhd0luZm8uaW5zdGFuY2VDb3VudCA9IGlucHV0QXNzZW1ibGVyLmluc3RhbmNlQ291bnQ7XHJcbiAgICAgICAgICAgIGNtZC5kcmF3SW5mby5maXJzdEluc3RhbmNlID0gaW5wdXRBc3NlbWJsZXIuZmlyc3RJbnN0YW5jZTtcclxuICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmRyYXdDbWRzLnB1c2goY21kKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5jbWRzLnB1c2goV2ViR0wyQ21kLkRSQVcpO1xyXG5cclxuICAgICAgICAgICAgKyt0aGlzLl9udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bUluc3RhbmNlcyArPSBpbnB1dEFzc2VtYmxlci5pbnN0YW5jZUNvdW50O1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleENvdW50ID0gaW5wdXRBc3NlbWJsZXIuaW5kZXhDb3VudCB8fCBpbnB1dEFzc2VtYmxlci52ZXJ0ZXhDb3VudDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckdQVVBpcGVsaW5lU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsUHJpbWl0aXZlID0gdGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZS5nbFByaW1pdGl2ZTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZ2xQcmltaXRpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDAwNDogeyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVTXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX251bVRyaXMgKz0gaW5kZXhDb3VudCAvIDMgKiBNYXRoLm1heChpbnB1dEFzc2VtYmxlci5pbnN0YW5jZUNvdW50LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMDA1OiAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVfU1RSSVBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDAwNjogeyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVfRkFOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX251bVRyaXMgKz0gKGluZGV4Q291bnQgLSAyKSAqIE1hdGgubWF4KGlucHV0QXNzZW1ibGVyLmluc3RhbmNlQ291bnQsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb21tYW5kIFxcJ2RyYXdcXCcgbXVzdCBiZSByZWNvcmRlZCBpbnNpZGUgYSByZW5kZXIgcGFzcy4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUJ1ZmZlciAoYnVmZmVyOiBHRlhCdWZmZXIsIGRhdGE6IEdGWEJ1ZmZlclNvdXJjZSwgb2Zmc2V0PzogbnVtYmVyLCBzaXplPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IEdGWENvbW1hbmRCdWZmZXJUeXBlLlBSSU1BUlkgJiYgIXRoaXMuX2lzSW5SZW5kZXJQYXNzIHx8XHJcbiAgICAgICAgICAgIHRoaXMuX3R5cGUgPT09IEdGWENvbW1hbmRCdWZmZXJUeXBlLlNFQ09OREFSWSkge1xyXG4gICAgICAgICAgICBjb25zdCBncHVCdWZmZXIgPSAoYnVmZmVyIGFzIFdlYkdMMkJ1ZmZlcikuZ3B1QnVmZmVyO1xyXG4gICAgICAgICAgICBpZiAoZ3B1QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEudXBkYXRlQnVmZmVyQ21kUG9vbC5hbGxvYyhXZWJHTDJDbWRVcGRhdGVCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZTaXplID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBidWZmOiBHRlhCdWZmZXJTb3VyY2UgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBIYXZlIHRvIGNvcHkgdG8gc3RhZ2luZyBidWZmZXIgZmlyc3QgdG8gbWFrZSB0aGlzIHdvcmsgZm9yIHRoZSBleGVjdXRpb24gaXMgZGVmZXJyZWQuXHJcbiAgICAgICAgICAgICAgICAvLyBCdXQgc2luY2Ugd2UgYXJlIHVzaW5nIHNwZWNpYWxpemVkIHByaW1hcnkgY29tbWFuZCBidWZmZXJzIGluIFdlYkdMIGJhY2tlbmRzLCB3ZSBsZWF2ZSBpdCBhcyBpcyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZmID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmU2l6ZSA9IHNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZlNpemUgPSAoZGF0YSBhcyBBcnJheUJ1ZmZlcikuYnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZiA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY21kLmdwdUJ1ZmZlciA9IGdwdUJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGNtZC5idWZmZXIgPSBidWZmO1xyXG4gICAgICAgICAgICAgICAgY21kLm9mZnNldCA9IChvZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9mZnNldCA6IDApO1xyXG4gICAgICAgICAgICAgICAgY21kLnNpemUgPSBidWZmU2l6ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLnB1c2goY21kKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNtZFBhY2thZ2UuY21kcy5wdXNoKFdlYkdMMkNtZC5VUERBVEVfQlVGRkVSKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbW1hbmQgXFwndXBkYXRlQnVmZmVyXFwnIG11c3QgYmUgcmVjb3JkZWQgb3V0c2lkZSBhIHJlbmRlciBwYXNzLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weUJ1ZmZlcnNUb1RleHR1cmUgKGJ1ZmZlcnM6IEFycmF5QnVmZmVyVmlld1tdLCB0ZXh0dXJlOiBHRlhUZXh0dXJlLCByZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IEdGWENvbW1hbmRCdWZmZXJUeXBlLlBSSU1BUlkgJiYgIXRoaXMuX2lzSW5SZW5kZXJQYXNzIHx8XHJcbiAgICAgICAgICAgIHRoaXMuX3R5cGUgPT09IEdGWENvbW1hbmRCdWZmZXJUeXBlLlNFQ09OREFSWSkge1xyXG4gICAgICAgICAgICBjb25zdCBncHVUZXh0dXJlID0gKHRleHR1cmUgYXMgV2ViR0wyVGV4dHVyZSkuZ3B1VGV4dHVyZTtcclxuICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHRoaXMuX3dlYkdMQWxsb2NhdG9yIS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbC5hbGxvYyhXZWJHTDJDbWRDb3B5QnVmZmVyVG9UZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIGNtZC5ncHVUZXh0dXJlID0gZ3B1VGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIGNtZC5yZWdpb25zID0gcmVnaW9ucztcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IEhhdmUgdG8gY29weSB0byBzdGFnaW5nIGJ1ZmZlciBmaXJzdCB0byBtYWtlIHRoaXMgd29yayBmb3IgdGhlIGV4ZWN1dGlvbiBpcyBkZWZlcnJlZC5cclxuICAgICAgICAgICAgICAgIC8vIEJ1dCBzaW5jZSB3ZSBhcmUgdXNpbmcgc3BlY2lhbGl6ZWQgcHJpbWFyeSBjb21tYW5kIGJ1ZmZlcnMgaW4gV2ViR0wgYmFja2VuZHMsIHdlIGxlYXZlIGl0IGFzIGlzIGZvciBub3dcclxuICAgICAgICAgICAgICAgIGNtZC5idWZmZXJzID0gYnVmZmVycztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNtZFBhY2thZ2UuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMucHVzaChjbWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmNtZHMucHVzaChXZWJHTDJDbWQuQ09QWV9CVUZGRVJfVE9fVEVYVFVSRSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb21tYW5kIFxcJ2NvcHlCdWZmZXJUb1RleHR1cmVcXCcgbXVzdCBiZSByZWNvcmRlZCBvdXRzaWRlIGEgcmVuZGVyIHBhc3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleGVjdXRlIChjbWRCdWZmczogR0ZYQ29tbWFuZEJ1ZmZlcltdLCBjb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdlYkdMMkNtZEJ1ZmYgPSBjbWRCdWZmc1tpXSBhcyBXZWJHTDJDb21tYW5kQnVmZmVyO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTDJDbWRCdWZmLmNtZFBhY2thZ2UuYmVnaW5SZW5kZXJQYXNzQ21kcy5sZW5ndGg7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kID0gd2ViR0wyQ21kQnVmZi5jbWRQYWNrYWdlLmJlZ2luUmVuZGVyUGFzc0NtZHMuYXJyYXlbY107XHJcbiAgICAgICAgICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5iZWdpblJlbmRlclBhc3NDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTDJDbWRCdWZmLmNtZFBhY2thZ2UuYmluZFN0YXRlc0NtZHMubGVuZ3RoOyArK2MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHdlYkdMMkNtZEJ1ZmYuY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5hcnJheVtjXTtcclxuICAgICAgICAgICAgICAgICsrY21kLnJlZkNvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmJpbmRTdGF0ZXNDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTDJDbWRCdWZmLmNtZFBhY2thZ2UuZHJhd0NtZHMubGVuZ3RoOyArK2MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHdlYkdMMkNtZEJ1ZmYuY21kUGFja2FnZS5kcmF3Q21kcy5hcnJheVtjXTtcclxuICAgICAgICAgICAgICAgICsrY21kLnJlZkNvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmRyYXdDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTDJDbWRCdWZmLmNtZFBhY2thZ2UudXBkYXRlQnVmZmVyQ21kcy5sZW5ndGg7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kID0gd2ViR0wyQ21kQnVmZi5jbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMuYXJyYXlbY107XHJcbiAgICAgICAgICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTDJDbWRCdWZmLmNtZFBhY2thZ2UuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMubGVuZ3RoOyArK2MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHdlYkdMMkNtZEJ1ZmYuY21kUGFja2FnZS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5hcnJheVtjXTtcclxuICAgICAgICAgICAgICAgICsrY21kLnJlZkNvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmNtZHMuY29uY2F0KHdlYkdMMkNtZEJ1ZmYuY21kUGFja2FnZS5jbWRzLmFycmF5KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX251bURyYXdDYWxscyArPSB3ZWJHTDJDbWRCdWZmLl9udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bUluc3RhbmNlcyArPSB3ZWJHTDJDbWRCdWZmLl9udW1JbnN0YW5jZXM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bVRyaXMgKz0gd2ViR0wyQ21kQnVmZi5fbnVtVHJpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3ZWJHTERldmljZSAoKTogV2ViR0wyRGV2aWNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYmluZFN0YXRlcyAoKSB7XHJcbiAgICAgICAgY29uc3QgYmluZFN0YXRlc0NtZCA9IHRoaXMuX3dlYkdMQWxsb2NhdG9yIS5iaW5kU3RhdGVzQ21kUG9vbC5hbGxvYyhXZWJHTDJDbWRCaW5kU3RhdGVzKTtcclxuICAgICAgICBiaW5kU3RhdGVzQ21kLmdwdVBpcGVsaW5lU3RhdGUgPSB0aGlzLl9jdXJHUFVQaXBlbGluZVN0YXRlO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGJpbmRTdGF0ZXNDbWQuZ3B1RGVzY3JpcHRvclNldHMsIHRoaXMuX2N1ckdQVURlc2NyaXB0b3JTZXRzKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGJpbmRTdGF0ZXNDbWQuZHluYW1pY09mZnNldHMsIHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYmluZFN0YXRlc0NtZC5ncHVJbnB1dEFzc2VtYmxlciA9IHRoaXMuX2N1ckdQVUlucHV0QXNzZW1ibGVyO1xyXG4gICAgICAgIGJpbmRTdGF0ZXNDbWQudmlld3BvcnQgPSB0aGlzLl9jdXJWaWV3cG9ydDtcclxuICAgICAgICBiaW5kU3RhdGVzQ21kLnNjaXNzb3IgPSB0aGlzLl9jdXJTY2lzc29yO1xyXG4gICAgICAgIGJpbmRTdGF0ZXNDbWQubGluZVdpZHRoID0gdGhpcy5fY3VyTGluZVdpZHRoO1xyXG4gICAgICAgIGJpbmRTdGF0ZXNDbWQuZGVwdGhCaWFzID0gdGhpcy5fY3VyRGVwdGhCaWFzO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGJpbmRTdGF0ZXNDbWQuYmxlbmRDb25zdGFudHMsIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzKTtcclxuICAgICAgICBiaW5kU3RhdGVzQ21kLmRlcHRoQm91bmRzID0gdGhpcy5fY3VyRGVwdGhCb3VuZHM7XHJcbiAgICAgICAgYmluZFN0YXRlc0NtZC5zdGVuY2lsV3JpdGVNYXNrID0gdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzaztcclxuICAgICAgICBiaW5kU3RhdGVzQ21kLnN0ZW5jaWxDb21wYXJlTWFzayA9IHRoaXMuX2N1clN0ZW5jaWxDb21wYXJlTWFzaztcclxuXHJcbiAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmJpbmRTdGF0ZXNDbWRzLnB1c2goYmluZFN0YXRlc0NtZCk7XHJcbiAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmNtZHMucHVzaChXZWJHTDJDbWQuQklORF9TVEFURVMpO1xyXG5cclxuICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4iXX0=