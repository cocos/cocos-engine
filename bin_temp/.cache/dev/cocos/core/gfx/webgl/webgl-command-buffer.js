(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../command-buffer.js", "../define.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../command-buffer.js"), require("../define.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.commandBuffer, global.define, global.webglCommands);
    global.webglCommandBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _commandBuffer, _define, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLCommandBuffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLCommandBuffer = /*#__PURE__*/function (_GFXCommandBuffer) {
    _inherits(WebGLCommandBuffer, _GFXCommandBuffer);

    function WebGLCommandBuffer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLCommandBuffer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLCommandBuffer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.cmdPackage = new _webglCommands.WebGLCmdPackage();
      _this._webGLAllocator = null;
      _this._isInRenderPass = false;
      _this._curGPUPipelineState = null;
      _this._curGPUInputAssembler = null;
      _this._curGPUDescriptorSets = [];
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

    _createClass(WebGLCommandBuffer, [{
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
        var cmd = this._webGLAllocator.beginRenderPassCmdPool.alloc(_webglCommands.WebGLCmdBeginRenderPass);

        cmd.gpuRenderPass = renderPass.gpuRenderPass;
        cmd.gpuFramebuffer = framebuffer.gpuFramebuffer;
        cmd.renderArea = renderArea;
        cmd.clearColors.length = clearColors.length;

        for (var i = 0; i < clearColors.length; ++i) {
          cmd.clearColors[i] = clearColors[i];
        }

        cmd.clearDepth = clearDepth;
        cmd.clearStencil = clearStencil;
        this.cmdPackage.beginRenderPassCmds.push(cmd);
        this.cmdPackage.cmds.push(_webglCommands.WebGLCmd.BEGIN_RENDER_PASS);
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
        var gpuDescriptorSet = descriptorSet.gpuDescriptorSet;

        if (gpuDescriptorSet !== this._curGPUDescriptorSets[set]) {
          this._curGPUDescriptorSets[set] = gpuDescriptorSet;
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

          var cmd = this._webGLAllocator.drawCmdPool.alloc(_webglCommands.WebGLCmdDraw); // cmd.drawInfo = inputAssembler;


          cmd.drawInfo.vertexCount = inputAssembler.vertexCount;
          cmd.drawInfo.firstVertex = inputAssembler.firstVertex;
          cmd.drawInfo.indexCount = inputAssembler.indexCount;
          cmd.drawInfo.firstIndex = inputAssembler.firstIndex;
          cmd.drawInfo.vertexOffset = inputAssembler.vertexOffset;
          cmd.drawInfo.instanceCount = inputAssembler.instanceCount;
          cmd.drawInfo.firstInstance = inputAssembler.firstInstance;
          this.cmdPackage.drawCmds.push(cmd);
          this.cmdPackage.cmds.push(_webglCommands.WebGLCmd.DRAW);
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
            var cmd = this._webGLAllocator.updateBufferCmdPool.alloc(_webglCommands.WebGLCmdUpdateBuffer);

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
            this.cmdPackage.cmds.push(_webglCommands.WebGLCmd.UPDATE_BUFFER);
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
            var cmd = this._webGLAllocator.copyBufferToTextureCmdPool.alloc(_webglCommands.WebGLCmdCopyBufferToTexture);

            if (cmd) {
              cmd.gpuTexture = gpuTexture;
              cmd.regions = regions; // TODO: Have to copy to staging buffer first to make this work for the execution is deferred.
              // But since we are using specialized primary command buffers in WebGL backends, we leave it as is for now

              cmd.buffers = buffers;
              this.cmdPackage.copyBufferToTextureCmds.push(cmd);
              this.cmdPackage.cmds.push(_webglCommands.WebGLCmd.COPY_BUFFER_TO_TEXTURE);
            }
          }
        } else {
          console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
      } // tslint:disable: max-line-length

    }, {
      key: "execute",
      value: function execute(cmdBuffs, count) {
        for (var i = 0; i < count; ++i) {
          var webGLCmdBuff = cmdBuffs[i];

          for (var c = 0; c < webGLCmdBuff.cmdPackage.beginRenderPassCmds.length; ++c) {
            var cmd = webGLCmdBuff.cmdPackage.beginRenderPassCmds.array[c];
            ++cmd.refCount;
            this.cmdPackage.beginRenderPassCmds.push(cmd);
          }

          for (var _c = 0; _c < webGLCmdBuff.cmdPackage.bindStatesCmds.length; ++_c) {
            var _cmd = webGLCmdBuff.cmdPackage.bindStatesCmds.array[_c];
            ++_cmd.refCount;
            this.cmdPackage.bindStatesCmds.push(_cmd);
          }

          for (var _c2 = 0; _c2 < webGLCmdBuff.cmdPackage.drawCmds.length; ++_c2) {
            var _cmd2 = webGLCmdBuff.cmdPackage.drawCmds.array[_c2];
            ++_cmd2.refCount;
            this.cmdPackage.drawCmds.push(_cmd2);
          }

          for (var _c3 = 0; _c3 < webGLCmdBuff.cmdPackage.updateBufferCmds.length; ++_c3) {
            var _cmd3 = webGLCmdBuff.cmdPackage.updateBufferCmds.array[_c3];
            ++_cmd3.refCount;
            this.cmdPackage.updateBufferCmds.push(_cmd3);
          }

          for (var _c4 = 0; _c4 < webGLCmdBuff.cmdPackage.copyBufferToTextureCmds.length; ++_c4) {
            var _cmd4 = webGLCmdBuff.cmdPackage.copyBufferToTextureCmds.array[_c4];
            ++_cmd4.refCount;
            this.cmdPackage.copyBufferToTextureCmds.push(_cmd4);
          }

          this.cmdPackage.cmds.concat(webGLCmdBuff.cmdPackage.cmds.array);
          this._numDrawCalls += webGLCmdBuff._numDrawCalls;
          this._numInstances += webGLCmdBuff._numInstances;
          this._numTris += webGLCmdBuff._numTris;
        }
      }
    }, {
      key: "bindStates",
      value: function bindStates() {
        var bindStatesCmd = this._webGLAllocator.bindStatesCmdPool.alloc(_webglCommands.WebGLCmdBindStates);

        if (bindStatesCmd) {
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
          this.cmdPackage.cmds.push(_webglCommands.WebGLCmd.BIND_STATES);
          this._isStateInvalied = false;
        }
      }
    }, {
      key: "webGLDevice",
      get: function get() {
        return this._device;
      }
    }]);

    return WebGLCommandBuffer;
  }(_commandBuffer.GFXCommandBuffer);

  _exports.WebGLCommandBuffer = WebGLCommandBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWNvbW1hbmQtYnVmZmVyLnRzIl0sIm5hbWVzIjpbIldlYkdMQ29tbWFuZEJ1ZmZlciIsImNtZFBhY2thZ2UiLCJXZWJHTENtZFBhY2thZ2UiLCJfd2ViR0xBbGxvY2F0b3IiLCJfaXNJblJlbmRlclBhc3MiLCJfY3VyR1BVUGlwZWxpbmVTdGF0ZSIsIl9jdXJHUFVJbnB1dEFzc2VtYmxlciIsIl9jdXJHUFVEZXNjcmlwdG9yU2V0cyIsIl9jdXJEeW5hbWljT2Zmc2V0cyIsIl9jdXJWaWV3cG9ydCIsIl9jdXJTY2lzc29yIiwiX2N1ckxpbmVXaWR0aCIsIl9jdXJEZXB0aEJpYXMiLCJfY3VyQmxlbmRDb25zdGFudHMiLCJfY3VyRGVwdGhCb3VuZHMiLCJfY3VyU3RlbmNpbFdyaXRlTWFzayIsIl9jdXJTdGVuY2lsQ29tcGFyZU1hc2siLCJfaXNTdGF0ZUludmFsaWVkIiwiaW5mbyIsIl90eXBlIiwidHlwZSIsIl9xdWV1ZSIsInF1ZXVlIiwiX2RldmljZSIsImNtZEFsbG9jYXRvciIsInNldENvdW50IiwiYmluZGluZ01hcHBpbmdJbmZvIiwiYnVmZmVyT2Zmc2V0cyIsImxlbmd0aCIsImkiLCJwdXNoIiwiY2xlYXJDbWRzIiwicmVuZGVyUGFzcyIsInN1YnBhc3MiLCJmcmFtZUJ1ZmZlciIsIl9udW1EcmF3Q2FsbHMiLCJfbnVtSW5zdGFuY2VzIiwiX251bVRyaXMiLCJiaW5kU3RhdGVzIiwiZnJhbWVidWZmZXIiLCJyZW5kZXJBcmVhIiwiY2xlYXJDb2xvcnMiLCJjbGVhckRlcHRoIiwiY2xlYXJTdGVuY2lsIiwiY21kIiwiYmVnaW5SZW5kZXJQYXNzQ21kUG9vbCIsImFsbG9jIiwiV2ViR0xDbWRCZWdpblJlbmRlclBhc3MiLCJncHVSZW5kZXJQYXNzIiwiZ3B1RnJhbWVidWZmZXIiLCJiZWdpblJlbmRlclBhc3NDbWRzIiwiY21kcyIsIldlYkdMQ21kIiwiQkVHSU5fUkVOREVSX1BBU1MiLCJwaXBlbGluZVN0YXRlIiwiZ3B1UGlwZWxpbmVTdGF0ZSIsInNldCIsImRlc2NyaXB0b3JTZXQiLCJkeW5hbWljT2Zmc2V0cyIsImdwdURlc2NyaXB0b3JTZXQiLCJvZmZzZXRzIiwiaW5wdXRBc3NlbWJsZXIiLCJncHVJbnB1dEFzc2VtYmxlciIsInZpZXdwb3J0IiwiR0ZYVmlld3BvcnQiLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJoZWlnaHQiLCJtaW5EZXB0aCIsIm1heERlcHRoIiwic2Npc3NvciIsIkdGWFJlY3QiLCJ4IiwieSIsImxpbmVXaWR0aCIsImRlcHRoQmlhc0NvbnN0YW50RmFjdG9yIiwiZGVwdGhCaWFzQ2xhbXAiLCJkZXB0aEJpYXNTbG9wZUZhY3RvciIsImNvbnN0YW50RmFjdG9yIiwiY2xhbXAiLCJzbG9wZUZhY3RvciIsImJsZW5kQ29uc3RhbnRzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJhcHBseSIsIm1pbkRlcHRoQm91bmRzIiwibWF4RGVwdGhCb3VuZHMiLCJtaW5Cb3VuZHMiLCJtYXhCb3VuZHMiLCJmYWNlIiwid3JpdGVNYXNrIiwicmVmZXJlbmNlIiwiY29tcGFyZU1hc2siLCJHRlhDb21tYW5kQnVmZmVyVHlwZSIsIlBSSU1BUlkiLCJTRUNPTkRBUlkiLCJkcmF3Q21kUG9vbCIsIldlYkdMQ21kRHJhdyIsImRyYXdJbmZvIiwidmVydGV4Q291bnQiLCJmaXJzdFZlcnRleCIsImluZGV4Q291bnQiLCJmaXJzdEluZGV4IiwidmVydGV4T2Zmc2V0IiwiaW5zdGFuY2VDb3VudCIsImZpcnN0SW5zdGFuY2UiLCJkcmF3Q21kcyIsIkRSQVciLCJnbFByaW1pdGl2ZSIsIk1hdGgiLCJtYXgiLCJjb25zb2xlIiwiZXJyb3IiLCJidWZmZXIiLCJkYXRhIiwib2Zmc2V0Iiwic2l6ZSIsImdwdUJ1ZmZlciIsInVwZGF0ZUJ1ZmZlckNtZFBvb2wiLCJXZWJHTENtZFVwZGF0ZUJ1ZmZlciIsImJ1ZmZTaXplIiwiYnVmZiIsInVzYWdlIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJJTkRJUkVDVCIsInVuZGVmaW5lZCIsImJ5dGVMZW5ndGgiLCJ1cGRhdGVCdWZmZXJDbWRzIiwiVVBEQVRFX0JVRkZFUiIsImJ1ZmZlcnMiLCJ0ZXh0dXJlIiwicmVnaW9ucyIsImdwdVRleHR1cmUiLCJjb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbCIsIldlYkdMQ21kQ29weUJ1ZmZlclRvVGV4dHVyZSIsImNvcHlCdWZmZXJUb1RleHR1cmVDbWRzIiwiQ09QWV9CVUZGRVJfVE9fVEVYVFVSRSIsImNtZEJ1ZmZzIiwiY291bnQiLCJ3ZWJHTENtZEJ1ZmYiLCJjIiwiYXJyYXkiLCJyZWZDb3VudCIsImJpbmRTdGF0ZXNDbWRzIiwiY29uY2F0IiwiYmluZFN0YXRlc0NtZCIsImJpbmRTdGF0ZXNDbWRQb29sIiwiV2ViR0xDbWRCaW5kU3RhdGVzIiwiZ3B1RGVzY3JpcHRvclNldHMiLCJkZXB0aEJpYXMiLCJkZXB0aEJvdW5kcyIsInN0ZW5jaWxXcml0ZU1hc2siLCJzdGVuY2lsQ29tcGFyZU1hc2siLCJCSU5EX1NUQVRFUyIsIkdGWENvbW1hbmRCdWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BNkNhQSxrQjs7Ozs7Ozs7Ozs7Ozs7O1lBRUZDLFUsR0FBOEIsSUFBSUMsOEJBQUosRTtZQUMzQkMsZSxHQUFnRCxJO1lBQ2hEQyxlLEdBQTJCLEs7WUFDM0JDLG9CLEdBQXNELEk7WUFDdERDLHFCLEdBQXdELEk7WUFDeERDLHFCLEdBQWtELEU7WUFDbERDLGtCLEdBQWlDLEU7WUFDakNDLFksR0FBbUMsSTtZQUNuQ0MsVyxHQUE4QixJO1lBQzlCQyxhLEdBQStCLEk7WUFDL0JDLGEsR0FBd0MsSTtZQUN4Q0Msa0IsR0FBK0IsRTtZQUMvQkMsZSxHQUE0QyxJO1lBQzVDQyxvQixHQUFzRCxJO1lBQ3REQyxzQixHQUEwRCxJO1lBQzFEQyxnQixHQUE0QixLOzs7Ozs7aUNBRW5CQyxJLEVBQXFDO0FBRXBELGFBQUtDLEtBQUws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ckIsSUFBckIsQ0FBMEJzQix3QkFBU3NHLFdBQW5DO0FBRUEsZUFBS3pJLGdCQUFMLEdBQXdCLEtBQXhCO0FBQ0g7QUFDSjs7OzBCQTVCc0M7QUFDbkMsZUFBTyxLQUFLTSxPQUFaO0FBQ0g7Ozs7SUExWm1Db0ksK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhEZXNjcmlwdG9yU2V0IH0gZnJvbSAnLi4vZGVzY3JpcHRvci1zZXQnO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlclNvdXJjZSB9IGZyb20gJy4uL2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIsIEdGWENvbW1hbmRCdWZmZXJJbmZvIH0gZnJvbSAnLi4vY29tbWFuZC1idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhGcmFtZWJ1ZmZlciB9IGZyb20gJy4uL2ZyYW1lYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIgfSBmcm9tICcuLi9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBHRlhQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi4vcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlIH0gZnJvbSAnLi4vdGV4dHVyZSc7XHJcbmltcG9ydCB7IFdlYkdMRGVzY3JpcHRvclNldCB9IGZyb20gJy4vd2ViZ2wtZGVzY3JpcHRvci1zZXQnO1xyXG5pbXBvcnQgeyBXZWJHTEJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0xDb21tYW5kQWxsb2NhdG9yIH0gZnJvbSAnLi93ZWJnbC1jb21tYW5kLWFsbG9jYXRvcic7XHJcbmltcG9ydCB7IFdlYkdMRGV2aWNlIH0gZnJvbSAnLi93ZWJnbC1kZXZpY2UnO1xyXG5pbXBvcnQgeyBXZWJHTEZyYW1lYnVmZmVyIH0gZnJvbSAnLi93ZWJnbC1mcmFtZWJ1ZmZlcic7XHJcbmltcG9ydCB7IElXZWJHTEdQVUlucHV0QXNzZW1ibGVyLCBJV2ViR0xHUFVEZXNjcmlwdG9yU2V0LCBJV2ViR0xHUFVQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi93ZWJnbC1ncHUtb2JqZWN0cyc7XHJcbmltcG9ydCB7IFdlYkdMSW5wdXRBc3NlbWJsZXIgfSBmcm9tICcuL3dlYmdsLWlucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFdlYkdMUGlwZWxpbmVTdGF0ZSB9IGZyb20gJy4vd2ViZ2wtcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBXZWJHTFRleHR1cmUgfSBmcm9tICcuL3dlYmdsLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi4vcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBXZWJHTFJlbmRlclBhc3MgfSBmcm9tICcuL3dlYmdsLXJlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyVGV4dHVyZUNvcHksIEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhDb21tYW5kQnVmZmVyVHlwZSxcclxuICAgIEdGWFN0ZW5jaWxGYWNlLCBHRlhDb2xvciwgR0ZYUmVjdCwgR0ZYVmlld3BvcnQgfSBmcm9tICcuLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBXZWJHTENtZCwgV2ViR0xDbWRCZWdpblJlbmRlclBhc3MsIFdlYkdMQ21kQmluZFN0YXRlcywgV2ViR0xDbWRDb3B5QnVmZmVyVG9UZXh0dXJlLFxyXG4gICAgV2ViR0xDbWREcmF3LCBXZWJHTENtZFBhY2thZ2UsIFdlYkdMQ21kVXBkYXRlQnVmZmVyIH0gZnJvbSAnLi93ZWJnbC1jb21tYW5kcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElXZWJHTERlcHRoQmlhcyB7XHJcbiAgICBjb25zdGFudEZhY3RvcjogbnVtYmVyO1xyXG4gICAgY2xhbXA6IG51bWJlcjtcclxuICAgIHNsb3BlRmFjdG9yOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVdlYkdMRGVwdGhCb3VuZHMge1xyXG4gICAgbWluQm91bmRzOiBudW1iZXI7XHJcbiAgICBtYXhCb3VuZHM6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJV2ViR0xTdGVuY2lsV3JpdGVNYXNrIHtcclxuICAgIGZhY2U6IEdGWFN0ZW5jaWxGYWNlO1xyXG4gICAgd3JpdGVNYXNrOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVdlYkdMU3RlbmNpbENvbXBhcmVNYXNrIHtcclxuICAgIGZhY2U6IEdGWFN0ZW5jaWxGYWNlO1xyXG4gICAgcmVmZXJlbmNlOiBudW1iZXI7XHJcbiAgICBjb21wYXJlTWFzazogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xDb21tYW5kQnVmZmVyIGV4dGVuZHMgR0ZYQ29tbWFuZEJ1ZmZlciB7XHJcblxyXG4gICAgcHVibGljIGNtZFBhY2thZ2U6IFdlYkdMQ21kUGFja2FnZSA9IG5ldyBXZWJHTENtZFBhY2thZ2UoKTtcclxuICAgIHByb3RlY3RlZCBfd2ViR0xBbGxvY2F0b3I6IFdlYkdMQ29tbWFuZEFsbG9jYXRvciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9pc0luUmVuZGVyUGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJHUFVQaXBlbGluZVN0YXRlOiBJV2ViR0xHUFVQaXBlbGluZVN0YXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckdQVUlucHV0QXNzZW1ibGVyOiBJV2ViR0xHUFVJbnB1dEFzc2VtYmxlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJHUFVEZXNjcmlwdG9yU2V0czogSVdlYkdMR1BVRGVzY3JpcHRvclNldFtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckR5bmFtaWNPZmZzZXRzOiBudW1iZXJbXVtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2N1clZpZXdwb3J0OiBHRlhWaWV3cG9ydCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJTY2lzc29yOiBHRlhSZWN0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckxpbmVXaWR0aDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckRlcHRoQmlhczogSVdlYkdMRGVwdGhCaWFzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2N1ckJsZW5kQ29uc3RhbnRzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJEZXB0aEJvdW5kczogSVdlYkdMRGVwdGhCb3VuZHMgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfY3VyU3RlbmNpbFdyaXRlTWFzazogSVdlYkdMU3RlbmNpbFdyaXRlTWFzayB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJTdGVuY2lsQ29tcGFyZU1hc2s6IElXZWJHTFN0ZW5jaWxDb21wYXJlTWFzayB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9pc1N0YXRlSW52YWxpZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYQ29tbWFuZEJ1ZmZlckluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IGluZm8udHlwZTtcclxuICAgICAgICB0aGlzLl9xdWV1ZSA9IGluZm8ucXVldWU7XHJcblxyXG4gICAgICAgIHRoaXMuX3dlYkdMQWxsb2NhdG9yID0gKHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZSkuY21kQWxsb2NhdG9yO1xyXG5cclxuICAgICAgICBjb25zdCBzZXRDb3VudCA9ICh0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UpLmJpbmRpbmdNYXBwaW5nSW5mby5idWZmZXJPZmZzZXRzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNldENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyR1BVRGVzY3JpcHRvclNldHMucHVzaChudWxsISk7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzLnB1c2goW10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl93ZWJHTEFsbG9jYXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJHTEFsbG9jYXRvci5jbGVhckNtZHModGhpcy5jbWRQYWNrYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5fd2ViR0xBbGxvY2F0b3IgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmVnaW4gKHJlbmRlclBhc3M/OiBHRlhSZW5kZXJQYXNzLCBzdWJwYXNzID0gMCwgZnJhbWVCdWZmZXI/OiBHRlhGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgIHRoaXMuX3dlYkdMQWxsb2NhdG9yIS5jbGVhckNtZHModGhpcy5jbWRQYWNrYWdlKTtcclxuICAgICAgICB0aGlzLl9jdXJHUFVQaXBlbGluZVN0YXRlID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJHUFVJbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyR1BVRGVzY3JpcHRvclNldHMubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzW2ldLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2N1clZpZXdwb3J0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJTY2lzc29yID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJMaW5lV2lkdGggPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyQmxlbmRDb25zdGFudHMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9jdXJEZXB0aEJvdW5kcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9udW1EcmF3Q2FsbHMgPSAwO1xyXG4gICAgICAgIHRoaXMuX251bUluc3RhbmNlcyA9IDA7XHJcbiAgICAgICAgdGhpcy5fbnVtVHJpcyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVuZCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3RhdGVJbnZhbGllZCkge1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRTdGF0ZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzSW5SZW5kZXJQYXNzID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJlZ2luUmVuZGVyUGFzcyAoXHJcbiAgICAgICAgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcyxcclxuICAgICAgICBmcmFtZWJ1ZmZlcjogR0ZYRnJhbWVidWZmZXIsXHJcbiAgICAgICAgcmVuZGVyQXJlYTogR0ZYUmVjdCxcclxuICAgICAgICBjbGVhckNvbG9yczogR0ZYQ29sb3JbXSxcclxuICAgICAgICBjbGVhckRlcHRoOiBudW1iZXIsXHJcbiAgICAgICAgY2xlYXJTdGVuY2lsOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEuYmVnaW5SZW5kZXJQYXNzQ21kUG9vbC5hbGxvYyhXZWJHTENtZEJlZ2luUmVuZGVyUGFzcyk7XHJcbiAgICAgICAgY21kLmdwdVJlbmRlclBhc3MgPSAocmVuZGVyUGFzcyBhcyBXZWJHTFJlbmRlclBhc3MpLmdwdVJlbmRlclBhc3M7XHJcbiAgICAgICAgY21kLmdwdUZyYW1lYnVmZmVyID0gKGZyYW1lYnVmZmVyIGFzIFdlYkdMRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyO1xyXG4gICAgICAgIGNtZC5yZW5kZXJBcmVhID0gcmVuZGVyQXJlYTtcclxuICAgICAgICBjbWQuY2xlYXJDb2xvcnMubGVuZ3RoID0gY2xlYXJDb2xvcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xlYXJDb2xvcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY21kLmNsZWFyQ29sb3JzW2ldID0gY2xlYXJDb2xvcnNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNtZC5jbGVhckRlcHRoID0gY2xlYXJEZXB0aDtcclxuICAgICAgICBjbWQuY2xlYXJTdGVuY2lsID0gY2xlYXJTdGVuY2lsO1xyXG4gICAgICAgIHRoaXMuY21kUGFja2FnZS5iZWdpblJlbmRlclBhc3NDbWRzLnB1c2goY21kKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmNtZHMucHVzaChXZWJHTENtZC5CRUdJTl9SRU5ERVJfUEFTUyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzSW5SZW5kZXJQYXNzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5kUmVuZGVyUGFzcyAoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJblJlbmRlclBhc3MgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZFBpcGVsaW5lU3RhdGUgKHBpcGVsaW5lU3RhdGU6IEdGWFBpcGVsaW5lU3RhdGUpIHtcclxuICAgICAgICBjb25zdCBncHVQaXBlbGluZVN0YXRlID0gKHBpcGVsaW5lU3RhdGUgYXMgV2ViR0xQaXBlbGluZVN0YXRlKS5ncHVQaXBlbGluZVN0YXRlO1xyXG4gICAgICAgIGlmIChncHVQaXBlbGluZVN0YXRlICE9PSB0aGlzLl9jdXJHUFVQaXBlbGluZVN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckdQVVBpcGVsaW5lU3RhdGUgPSBncHVQaXBlbGluZVN0YXRlO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZERlc2NyaXB0b3JTZXQgKHNldDogbnVtYmVyLCBkZXNjcmlwdG9yU2V0OiBHRlhEZXNjcmlwdG9yU2V0LCBkeW5hbWljT2Zmc2V0cz86IG51bWJlcltdKSB7XHJcbiAgICAgICAgY29uc3QgZ3B1RGVzY3JpcHRvclNldCA9IChkZXNjcmlwdG9yU2V0IGFzIFdlYkdMRGVzY3JpcHRvclNldCkuZ3B1RGVzY3JpcHRvclNldDtcclxuICAgICAgICBpZiAoZ3B1RGVzY3JpcHRvclNldCAhPT0gdGhpcy5fY3VyR1BVRGVzY3JpcHRvclNldHNbc2V0XSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJHUFVEZXNjcmlwdG9yU2V0c1tzZXRdID0gZ3B1RGVzY3JpcHRvclNldDtcclxuICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGR5bmFtaWNPZmZzZXRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldHMgPSB0aGlzLl9jdXJEeW5hbWljT2Zmc2V0c1tzZXRdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGR5bmFtaWNPZmZzZXRzLmxlbmd0aDsgaSsrKSBvZmZzZXRzW2ldID0gZHluYW1pY09mZnNldHNbaV07XHJcbiAgICAgICAgICAgIG9mZnNldHMubGVuZ3RoID0gZHluYW1pY09mZnNldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZElucHV0QXNzZW1ibGVyIChpbnB1dEFzc2VtYmxlcjogR0ZYSW5wdXRBc3NlbWJsZXIpIHtcclxuICAgICAgICBjb25zdCBncHVJbnB1dEFzc2VtYmxlciA9IChpbnB1dEFzc2VtYmxlciBhcyBXZWJHTElucHV0QXNzZW1ibGVyKS5ncHVJbnB1dEFzc2VtYmxlcjtcclxuICAgICAgICB0aGlzLl9jdXJHUFVJbnB1dEFzc2VtYmxlciA9IGdwdUlucHV0QXNzZW1ibGVyO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZpZXdwb3J0ICh2aWV3cG9ydDogR0ZYVmlld3BvcnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1clZpZXdwb3J0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0ID0gbmV3IEdGWFZpZXdwb3J0KHZpZXdwb3J0LmxlZnQsIHZpZXdwb3J0LnRvcCwgdmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCwgdmlld3BvcnQubWluRGVwdGgsIHZpZXdwb3J0Lm1heERlcHRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VyVmlld3BvcnQubGVmdCAhPT0gdmlld3BvcnQubGVmdCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQudG9wICE9PSB2aWV3cG9ydC50b3AgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0LndpZHRoICE9PSB2aWV3cG9ydC53aWR0aCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQuaGVpZ2h0ICE9PSB2aWV3cG9ydC5oZWlnaHQgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0Lm1pbkRlcHRoICE9PSB2aWV3cG9ydC5taW5EZXB0aCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQubWF4RGVwdGggIT09IHZpZXdwb3J0Lm1heERlcHRoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQubGVmdCA9IHZpZXdwb3J0LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJWaWV3cG9ydC50b3AgPSB2aWV3cG9ydC50b3A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJWaWV3cG9ydC53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQuaGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyVmlld3BvcnQubWluRGVwdGggPSB2aWV3cG9ydC5taW5EZXB0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0Lm1heERlcHRoID0gdmlld3BvcnQubWF4RGVwdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTY2lzc29yIChzY2lzc29yOiBHRlhSZWN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJTY2lzc29yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1clNjaXNzb3IgPSBuZXcgR0ZYUmVjdChzY2lzc29yLngsIHNjaXNzb3IueSwgc2Npc3Nvci53aWR0aCwgc2Npc3Nvci5oZWlnaHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJTY2lzc29yLnggIT09IHNjaXNzb3IueCB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci55ICE9PSBzY2lzc29yLnkgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clNjaXNzb3Iud2lkdGggIT09IHNjaXNzb3Iud2lkdGggfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clNjaXNzb3IuaGVpZ2h0ICE9PSBzY2lzc29yLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci54ID0gc2Npc3Nvci54O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci55ID0gc2Npc3Nvci55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU2Npc3Nvci53aWR0aCA9IHNjaXNzb3Iud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJTY2lzc29yLmhlaWdodCA9IHNjaXNzb3IuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TGluZVdpZHRoIChsaW5lV2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9jdXJMaW5lV2lkdGggIT09IGxpbmVXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJMaW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREZXB0aEJpYXMgKGRlcHRoQmlhc0NvbnN0YW50RmFjdG9yOiBudW1iZXIsIGRlcHRoQmlhc0NsYW1wOiBudW1iZXIsIGRlcHRoQmlhc1Nsb3BlRmFjdG9yOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1ckRlcHRoQmlhcykge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJEZXB0aEJpYXMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdGFudEZhY3RvcjogZGVwdGhCaWFzQ29uc3RhbnRGYWN0b3IsXHJcbiAgICAgICAgICAgICAgICBjbGFtcDogZGVwdGhCaWFzQ2xhbXAsXHJcbiAgICAgICAgICAgICAgICBzbG9wZUZhY3RvcjogZGVwdGhCaWFzU2xvcGVGYWN0b3IsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckRlcHRoQmlhcy5jb25zdGFudEZhY3RvciAhPT0gZGVwdGhCaWFzQ29uc3RhbnRGYWN0b3IgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcy5jbGFtcCAhPT0gZGVwdGhCaWFzQ2xhbXAgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcy5zbG9wZUZhY3RvciAhPT0gZGVwdGhCaWFzU2xvcGVGYWN0b3IpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJEZXB0aEJpYXMuY29uc3RhbnRGYWN0b3IgPSBkZXB0aEJpYXNDb25zdGFudEZhY3RvcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQmlhcy5jbGFtcCA9IGRlcHRoQmlhc0NsYW1wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyRGVwdGhCaWFzLnNsb3BlRmFjdG9yID0gZGVwdGhCaWFzU2xvcGVGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRCbGVuZENvbnN0YW50cyAoYmxlbmRDb25zdGFudHM6IG51bWJlcltdKSB7XHJcbiAgICAgICAgaWYgKGJsZW5kQ29uc3RhbnRzLmxlbmd0aCA9PT0gNCAmJiAoXHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzWzBdICE9PSBibGVuZENvbnN0YW50c1swXSB8fFxyXG4gICAgICAgICAgICB0aGlzLl9jdXJCbGVuZENvbnN0YW50c1sxXSAhPT0gYmxlbmRDb25zdGFudHNbMV0gfHxcclxuICAgICAgICAgICAgdGhpcy5fY3VyQmxlbmRDb25zdGFudHNbMl0gIT09IGJsZW5kQ29uc3RhbnRzWzJdIHx8XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzWzNdICE9PSBibGVuZENvbnN0YW50c1szXSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyQmxlbmRDb25zdGFudHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fY3VyQmxlbmRDb25zdGFudHMsIGJsZW5kQ29uc3RhbnRzKTtcclxuICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlcHRoQm91bmQgKG1pbkRlcHRoQm91bmRzOiBudW1iZXIsIG1heERlcHRoQm91bmRzOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1ckRlcHRoQm91bmRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgbWluQm91bmRzOiBtaW5EZXB0aEJvdW5kcyxcclxuICAgICAgICAgICAgICAgIG1heEJvdW5kczogbWF4RGVwdGhCb3VuZHMsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckRlcHRoQm91bmRzLm1pbkJvdW5kcyAhPT0gbWluRGVwdGhCb3VuZHMgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzLm1heEJvdW5kcyAhPT0gbWF4RGVwdGhCb3VuZHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkJvdW5kczogbWluRGVwdGhCb3VuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4Qm91bmRzOiBtYXhEZXB0aEJvdW5kcyxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTdGVuY2lsV3JpdGVNYXNrIChmYWNlOiBHRlhTdGVuY2lsRmFjZSwgd3JpdGVNYXNrOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2spIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzayA9IHtcclxuICAgICAgICAgICAgICAgIGZhY2UsXHJcbiAgICAgICAgICAgICAgICB3cml0ZU1hc2ssXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2suZmFjZSAhPT0gZmFjZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2sgIT09IHdyaXRlTWFzaykge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2suZmFjZSA9IGZhY2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJTdGVuY2lsV3JpdGVNYXNrLndyaXRlTWFzayA9IHdyaXRlTWFzaztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFN0ZW5jaWxDb21wYXJlTWFzayAoZmFjZTogR0ZYU3RlbmNpbEZhY2UsIHJlZmVyZW5jZTogbnVtYmVyLCBjb21wYXJlTWFzazogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2spIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrID0ge1xyXG4gICAgICAgICAgICAgICAgZmFjZSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgIGNvbXBhcmVNYXNrLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2suZmFjZSAhPT0gZmFjZSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSAhPT0gcmVmZXJlbmNlIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2sgIT09IGNvbXBhcmVNYXNrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrLmZhY2UgPSBmYWNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzayA9IGNvbXBhcmVNYXNrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyAoaW5wdXRBc3NlbWJsZXI6IEdGWElucHV0QXNzZW1ibGVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IEdGWENvbW1hbmRCdWZmZXJUeXBlLlBSSU1BUlkgJiYgdGhpcy5faXNJblJlbmRlclBhc3MgfHxcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9PT0gR0ZYQ29tbWFuZEJ1ZmZlclR5cGUuU0VDT05EQVJZKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1N0YXRlSW52YWxpZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZFN0YXRlcygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEuZHJhd0NtZFBvb2wuYWxsb2MoV2ViR0xDbWREcmF3KTtcclxuICAgICAgICAgICAgLy8gY21kLmRyYXdJbmZvID0gaW5wdXRBc3NlbWJsZXI7XHJcbiAgICAgICAgICAgIGNtZC5kcmF3SW5mby52ZXJ0ZXhDb3VudCA9IGlucHV0QXNzZW1ibGVyLnZlcnRleENvdW50O1xyXG4gICAgICAgICAgICBjbWQuZHJhd0luZm8uZmlyc3RWZXJ0ZXggPSBpbnB1dEFzc2VtYmxlci5maXJzdFZlcnRleDtcclxuICAgICAgICAgICAgY21kLmRyYXdJbmZvLmluZGV4Q291bnQgPSBpbnB1dEFzc2VtYmxlci5pbmRleENvdW50O1xyXG4gICAgICAgICAgICBjbWQuZHJhd0luZm8uZmlyc3RJbmRleCA9IGlucHV0QXNzZW1ibGVyLmZpcnN0SW5kZXg7XHJcbiAgICAgICAgICAgIGNtZC5kcmF3SW5mby52ZXJ0ZXhPZmZzZXQgPSBpbnB1dEFzc2VtYmxlci52ZXJ0ZXhPZmZzZXQ7XHJcbiAgICAgICAgICAgIGNtZC5kcmF3SW5mby5pbnN0YW5jZUNvdW50ID0gaW5wdXRBc3NlbWJsZXIuaW5zdGFuY2VDb3VudDtcclxuICAgICAgICAgICAgY21kLmRyYXdJbmZvLmZpcnN0SW5zdGFuY2UgPSBpbnB1dEFzc2VtYmxlci5maXJzdEluc3RhbmNlO1xyXG4gICAgICAgICAgICB0aGlzLmNtZFBhY2thZ2UuZHJhd0NtZHMucHVzaChjbWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmNtZHMucHVzaChXZWJHTENtZC5EUkFXKTtcclxuXHJcbiAgICAgICAgICAgICsrdGhpcy5fbnVtRHJhd0NhbGxzO1xyXG4gICAgICAgICAgICB0aGlzLl9udW1JbnN0YW5jZXMgKz0gaW5wdXRBc3NlbWJsZXIuaW5zdGFuY2VDb3VudDtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXhDb3VudCA9IGlucHV0QXNzZW1ibGVyLmluZGV4Q291bnQgfHwgaW5wdXRBc3NlbWJsZXIudmVydGV4Q291bnQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJHUFVQaXBlbGluZVN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnbFByaW1pdGl2ZSA9IHRoaXMuX2N1ckdQVVBpcGVsaW5lU3RhdGUuZ2xQcmltaXRpdmU7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdsUHJpbWl0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAwMDQ6IHsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlRSSUFOR0xFU1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9udW1UcmlzICs9IGluZGV4Q291bnQgLyAzICogTWF0aC5tYXgoaW5wdXRBc3NlbWJsZXIuaW5zdGFuY2VDb3VudCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDAwNTogLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlRSSUFOR0xFX1NUUklQXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAwMDY6IHsgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlRSSUFOR0xFX0ZBTlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9udW1UcmlzICs9IChpbmRleENvdW50IC0gMikgKiBNYXRoLm1heChpbnB1dEFzc2VtYmxlci5pbnN0YW5jZUNvdW50LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWFuZCBcXCdkcmF3XFwnIG11c3QgYmUgcmVjb3JkZWQgaW5zaWRlIGEgcmVuZGVyIHBhc3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVCdWZmZXIgKGJ1ZmZlcjogR0ZYQnVmZmVyLCBkYXRhOiBHRlhCdWZmZXJTb3VyY2UsIG9mZnNldD86IG51bWJlciwgc2l6ZT86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl90eXBlID09PSBHRlhDb21tYW5kQnVmZmVyVHlwZS5QUklNQVJZICYmICF0aGlzLl9pc0luUmVuZGVyUGFzcyB8fFxyXG4gICAgICAgICAgICB0aGlzLl90eXBlID09PSBHRlhDb21tYW5kQnVmZmVyVHlwZS5TRUNPTkRBUlkpIHtcclxuICAgICAgICAgICAgY29uc3QgZ3B1QnVmZmVyID0gKGJ1ZmZlciBhcyBXZWJHTEJ1ZmZlcikuZ3B1QnVmZmVyO1xyXG4gICAgICAgICAgICBpZiAoZ3B1QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEudXBkYXRlQnVmZmVyQ21kUG9vbC5hbGxvYyhXZWJHTENtZFVwZGF0ZUJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZTaXplID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBidWZmOiBHRlhCdWZmZXJTb3VyY2UgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBIYXZlIHRvIGNvcHkgdG8gc3RhZ2luZyBidWZmZXIgZmlyc3QgdG8gbWFrZSB0aGlzIHdvcmsgZm9yIHRoZSBleGVjdXRpb24gaXMgZGVmZXJyZWQuXHJcbiAgICAgICAgICAgICAgICAvLyBCdXQgc2luY2Ugd2UgYXJlIHVzaW5nIHNwZWNpYWxpemVkIHByaW1hcnkgY29tbWFuZCBidWZmZXJzIGluIFdlYkdMIGJhY2tlbmRzLCB3ZSBsZWF2ZSBpdCBhcyBpcyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZmID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmU2l6ZSA9IHNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZlNpemUgPSAoZGF0YSBhcyBBcnJheUJ1ZmZlcikuYnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZiA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY21kLmdwdUJ1ZmZlciA9IGdwdUJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGNtZC5idWZmZXIgPSBidWZmO1xyXG4gICAgICAgICAgICAgICAgY21kLm9mZnNldCA9IChvZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9mZnNldCA6IDApO1xyXG4gICAgICAgICAgICAgICAgY21kLnNpemUgPSBidWZmU2l6ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLnB1c2goY21kKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNtZFBhY2thZ2UuY21kcy5wdXNoKFdlYkdMQ21kLlVQREFURV9CVUZGRVIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWFuZCBcXCd1cGRhdGVCdWZmZXJcXCcgbXVzdCBiZSByZWNvcmRlZCBvdXRzaWRlIGEgcmVuZGVyIHBhc3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5QnVmZmVyc1RvVGV4dHVyZSAoYnVmZmVyczogQXJyYXlCdWZmZXJWaWV3W10sIHRleHR1cmU6IEdGWFRleHR1cmUsIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gR0ZYQ29tbWFuZEJ1ZmZlclR5cGUuUFJJTUFSWSAmJiAhdGhpcy5faXNJblJlbmRlclBhc3MgfHxcclxuICAgICAgICAgICAgdGhpcy5fdHlwZSA9PT0gR0ZYQ29tbWFuZEJ1ZmZlclR5cGUuU0VDT05EQVJZKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdVRleHR1cmUgPSAodGV4dHVyZSBhcyBXZWJHTFRleHR1cmUpLmdwdVRleHR1cmU7XHJcbiAgICAgICAgICAgIGlmIChncHVUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEuY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2wuYWxsb2MoV2ViR0xDbWRDb3B5QnVmZmVyVG9UZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIGlmIChjbWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbWQuZ3B1VGV4dHVyZSA9IGdwdVRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kLnJlZ2lvbnMgPSByZWdpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IEhhdmUgdG8gY29weSB0byBzdGFnaW5nIGJ1ZmZlciBmaXJzdCB0byBtYWtlIHRoaXMgd29yayBmb3IgdGhlIGV4ZWN1dGlvbiBpcyBkZWZlcnJlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBCdXQgc2luY2Ugd2UgYXJlIHVzaW5nIHNwZWNpYWxpemVkIHByaW1hcnkgY29tbWFuZCBidWZmZXJzIGluIFdlYkdMIGJhY2tlbmRzLCB3ZSBsZWF2ZSBpdCBhcyBpcyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICAgICAgY21kLmJ1ZmZlcnMgPSBidWZmZXJzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNtZFBhY2thZ2UuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMucHVzaChjbWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5jbWRzLnB1c2goV2ViR0xDbWQuQ09QWV9CVUZGRVJfVE9fVEVYVFVSRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb21tYW5kIFxcJ2NvcHlCdWZmZXJUb1RleHR1cmVcXCcgbXVzdCBiZSByZWNvcmRlZCBvdXRzaWRlIGEgcmVuZGVyIHBhc3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuICAgIHB1YmxpYyBleGVjdXRlIChjbWRCdWZmczogR0ZYQ29tbWFuZEJ1ZmZlcltdLCBjb3VudDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB3ZWJHTENtZEJ1ZmYgPSBjbWRCdWZmc1tpXSBhcyBXZWJHTENvbW1hbmRCdWZmZXI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHdlYkdMQ21kQnVmZi5jbWRQYWNrYWdlLmJlZ2luUmVuZGVyUGFzc0NtZHMubGVuZ3RoOyArK2MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHdlYkdMQ21kQnVmZi5jbWRQYWNrYWdlLmJlZ2luUmVuZGVyUGFzc0NtZHMuYXJyYXlbY107XHJcbiAgICAgICAgICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5iZWdpblJlbmRlclBhc3NDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTENtZEJ1ZmYuY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5sZW5ndGg7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kID0gd2ViR0xDbWRCdWZmLmNtZFBhY2thZ2UuYmluZFN0YXRlc0NtZHMuYXJyYXlbY107XHJcbiAgICAgICAgICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5wdXNoKGNtZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgd2ViR0xDbWRCdWZmLmNtZFBhY2thZ2UuZHJhd0NtZHMubGVuZ3RoOyArK2MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHdlYkdMQ21kQnVmZi5jbWRQYWNrYWdlLmRyYXdDbWRzLmFycmF5W2NdO1xyXG4gICAgICAgICAgICAgICAgKytjbWQucmVmQ291bnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNtZFBhY2thZ2UuZHJhd0NtZHMucHVzaChjbWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHdlYkdMQ21kQnVmZi5jbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMubGVuZ3RoOyArK2MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHdlYkdMQ21kQnVmZi5jbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMuYXJyYXlbY107XHJcbiAgICAgICAgICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLnB1c2goY21kKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB3ZWJHTENtZEJ1ZmYuY21kUGFja2FnZS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5sZW5ndGg7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kID0gd2ViR0xDbWRCdWZmLmNtZFBhY2thZ2UuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMuYXJyYXlbY107XHJcbiAgICAgICAgICAgICAgICArK2NtZC5yZWZDb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5wdXNoKGNtZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5jbWRzLmNvbmNhdCh3ZWJHTENtZEJ1ZmYuY21kUGFja2FnZS5jbWRzLmFycmF5KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX251bURyYXdDYWxscyArPSB3ZWJHTENtZEJ1ZmYuX251bURyYXdDYWxscztcclxuICAgICAgICAgICAgdGhpcy5fbnVtSW5zdGFuY2VzICs9IHdlYkdMQ21kQnVmZi5fbnVtSW5zdGFuY2VzO1xyXG4gICAgICAgICAgICB0aGlzLl9udW1UcmlzICs9IHdlYkdMQ21kQnVmZi5fbnVtVHJpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3ZWJHTERldmljZSAoKTogV2ViR0xEZXZpY2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGJpbmRTdGF0ZXMgKCkge1xyXG4gICAgICAgIGNvbnN0IGJpbmRTdGF0ZXNDbWQgPSB0aGlzLl93ZWJHTEFsbG9jYXRvciEuYmluZFN0YXRlc0NtZFBvb2wuYWxsb2MoV2ViR0xDbWRCaW5kU3RhdGVzKTtcclxuXHJcbiAgICAgICAgaWYgKGJpbmRTdGF0ZXNDbWQpIHtcclxuICAgICAgICAgICAgYmluZFN0YXRlc0NtZC5ncHVQaXBlbGluZVN0YXRlID0gdGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYmluZFN0YXRlc0NtZC5ncHVEZXNjcmlwdG9yU2V0cywgdGhpcy5fY3VyR1BVRGVzY3JpcHRvclNldHMpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShiaW5kU3RhdGVzQ21kLmR5bmFtaWNPZmZzZXRzLCB0aGlzLl9jdXJEeW5hbWljT2Zmc2V0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmluZFN0YXRlc0NtZC5ncHVJbnB1dEFzc2VtYmxlciA9IHRoaXMuX2N1ckdQVUlucHV0QXNzZW1ibGVyO1xyXG4gICAgICAgICAgICBiaW5kU3RhdGVzQ21kLnZpZXdwb3J0ID0gdGhpcy5fY3VyVmlld3BvcnQ7XHJcbiAgICAgICAgICAgIGJpbmRTdGF0ZXNDbWQuc2Npc3NvciA9IHRoaXMuX2N1clNjaXNzb3I7XHJcbiAgICAgICAgICAgIGJpbmRTdGF0ZXNDbWQubGluZVdpZHRoID0gdGhpcy5fY3VyTGluZVdpZHRoO1xyXG4gICAgICAgICAgICBiaW5kU3RhdGVzQ21kLmRlcHRoQmlhcyA9IHRoaXMuX2N1ckRlcHRoQmlhcztcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoYmluZFN0YXRlc0NtZC5ibGVuZENvbnN0YW50cywgdGhpcy5fY3VyQmxlbmRDb25zdGFudHMpO1xyXG4gICAgICAgICAgICBiaW5kU3RhdGVzQ21kLmRlcHRoQm91bmRzID0gdGhpcy5fY3VyRGVwdGhCb3VuZHM7XHJcbiAgICAgICAgICAgIGJpbmRTdGF0ZXNDbWQuc3RlbmNpbFdyaXRlTWFzayA9IHRoaXMuX2N1clN0ZW5jaWxXcml0ZU1hc2s7XHJcbiAgICAgICAgICAgIGJpbmRTdGF0ZXNDbWQuc3RlbmNpbENvbXBhcmVNYXNrID0gdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbWRQYWNrYWdlLmJpbmRTdGF0ZXNDbWRzLnB1c2goYmluZFN0YXRlc0NtZCk7XHJcbiAgICAgICAgICAgIHRoaXMuY21kUGFja2FnZS5jbWRzLnB1c2goV2ViR0xDbWQuQklORF9TVEFURVMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faXNTdGF0ZUludmFsaWVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==