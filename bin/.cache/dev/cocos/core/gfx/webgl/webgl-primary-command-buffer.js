(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../define.js", "./webgl-command-buffer.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../define.js"), require("./webgl-command-buffer.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.webglCommandBuffer, global.webglCommands);
    global.webglPrimaryCommandBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _webglCommandBuffer, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLPrimaryCommandBuffer = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _dynamicOffsets = [];

  var WebGLPrimaryCommandBuffer = /*#__PURE__*/function (_WebGLCommandBuffer) {
    _inherits(WebGLPrimaryCommandBuffer, _WebGLCommandBuffer);

    function WebGLPrimaryCommandBuffer() {
      _classCallCheck(this, WebGLPrimaryCommandBuffer);

      return _possibleConstructorReturn(this, _getPrototypeOf(WebGLPrimaryCommandBuffer).apply(this, arguments));
    }

    _createClass(WebGLPrimaryCommandBuffer, [{
      key: "beginRenderPass",
      value: function beginRenderPass(renderPass, framebuffer, renderArea, clearColors, clearDepth, clearStencil) {
        (0, _webglCommands.WebGLCmdFuncBeginRenderPass)(this._device, renderPass.gpuRenderPass, framebuffer.gpuFramebuffer, renderArea, clearColors, clearDepth, clearStencil);
        this._isInRenderPass = true;
      }
    }, {
      key: "draw",
      value: function draw(inputAssembler) {
        if (this._isInRenderPass) {
          if (this._isStateInvalied) {
            this.bindStates();
          }

          (0, _webglCommands.WebGLCmdFuncDraw)(this._device, inputAssembler);
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
        if (!this._isInRenderPass) {
          var gpuBuffer = buffer.gpuBuffer;

          if (gpuBuffer) {
            if (offset === undefined) {
              offset = 0;
            }

            var buffSize;

            if (size !== undefined) {
              buffSize = size;
            } else if (buffer.usage & _define.GFXBufferUsageBit.INDIRECT) {
              buffSize = 0;
            } else {
              buffSize = data.byteLength;
            }

            (0, _webglCommands.WebGLCmdFuncUpdateBuffer)(this._device, gpuBuffer, data, offset, buffSize);
          }
        } else {
          console.error('Command \'updateBuffer\' must be recorded outside a render pass.');
        }
      }
    }, {
      key: "copyBuffersToTexture",
      value: function copyBuffersToTexture(buffers, texture, regions) {
        if (!this._isInRenderPass) {
          var gpuTexture = texture.gpuTexture;

          if (gpuTexture) {
            (0, _webglCommands.WebGLCmdFuncCopyBuffersToTexture)(this._device, buffers, gpuTexture, regions);
          }
        } else {
          console.error('Command \'copyBufferToTexture\' must be recorded outside a render pass.');
        }
      }
    }, {
      key: "execute",
      value: function execute(cmdBuffs, count) {
        for (var i = 0; i < count; ++i) {
          // actually they are secondary buffers, the cast here is only for type checking
          var webGLCmdBuff = cmdBuffs[i];
          (0, _webglCommands.WebGLCmdFuncExecuteCmds)(this._device, webGLCmdBuff.cmdPackage);
          this._numDrawCalls += webGLCmdBuff._numDrawCalls;
          this._numInstances += webGLCmdBuff._numInstances;
          this._numTris += webGLCmdBuff._numTris;
        }
      }
    }, {
      key: "bindStates",
      value: function bindStates() {
        _dynamicOffsets.length = 0;

        for (var i = 0; i < this._curDynamicOffsets.length; i++) {
          Array.prototype.push.apply(_dynamicOffsets, this._curDynamicOffsets[i]);
        }

        (0, _webglCommands.WebGLCmdFuncBindStates)(this._device, this._curGPUPipelineState, this._curGPUInputAssembler, this._curGPUDescriptorSets, _dynamicOffsets, this._curViewport, this._curScissor, this._curLineWidth, this._curDepthBias, this._curBlendConstants, this._curDepthBounds, this._curStencilWriteMask, this._curStencilCompareMask);
        this._isStateInvalied = false;
      }
    }]);

    return WebGLPrimaryCommandBuffer;
  }(_webglCommandBuffer.WebGLCommandBuffer);

  _exports.WebGLPrimaryCommandBuffer = WebGLPrimaryCommandBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLXByaW1hcnktY29tbWFuZC1idWZmZXIudHMiXSwibmFtZXMiOlsiX2R5bmFtaWNPZmZzZXRzIiwiV2ViR0xQcmltYXJ5Q29tbWFuZEJ1ZmZlciIsInJlbmRlclBhc3MiLCJmcmFtZWJ1ZmZlciIsInJlbmRlckFyZWEiLCJjbGVhckNvbG9ycyIsImNsZWFyRGVwdGgiLCJjbGVhclN0ZW5jaWwiLCJfZGV2aWNlIiwiZ3B1UmVuZGVyUGFzcyIsImdwdUZyYW1lYnVmZmVyIiwiX2lzSW5SZW5kZXJQYXNzIiwiaW5wdXRBc3NlbWJsZXIiLCJfaXNTdGF0ZUludmFsaWVkIiwiYmluZFN0YXRlcyIsIl9udW1EcmF3Q2FsbHMiLCJfbnVtSW5zdGFuY2VzIiwiaW5zdGFuY2VDb3VudCIsImluZGV4Q291bnQiLCJ2ZXJ0ZXhDb3VudCIsIl9jdXJHUFVQaXBlbGluZVN0YXRlIiwiZ2xQcmltaXRpdmUiLCJfbnVtVHJpcyIsIk1hdGgiLCJtYXgiLCJjb25zb2xlIiwiZXJyb3IiLCJidWZmZXIiLCJkYXRhIiwib2Zmc2V0Iiwic2l6ZSIsImdwdUJ1ZmZlciIsInVuZGVmaW5lZCIsImJ1ZmZTaXplIiwidXNhZ2UiLCJHRlhCdWZmZXJVc2FnZUJpdCIsIklORElSRUNUIiwiYnl0ZUxlbmd0aCIsImJ1ZmZlcnMiLCJ0ZXh0dXJlIiwicmVnaW9ucyIsImdwdVRleHR1cmUiLCJjbWRCdWZmcyIsImNvdW50IiwiaSIsIndlYkdMQ21kQnVmZiIsImNtZFBhY2thZ2UiLCJsZW5ndGgiLCJfY3VyRHluYW1pY09mZnNldHMiLCJBcnJheSIsInByb3RvdHlwZSIsInB1c2giLCJhcHBseSIsIl9jdXJHUFVJbnB1dEFzc2VtYmxlciIsIl9jdXJHUFVEZXNjcmlwdG9yU2V0cyIsIl9jdXJWaWV3cG9ydCIsIl9jdXJTY2lzc29yIiwiX2N1ckxpbmVXaWR0aCIsIl9jdXJEZXB0aEJpYXMiLCJfY3VyQmxlbmRDb25zdGFudHMiLCJfY3VyRGVwdGhCb3VuZHMiLCJfY3VyU3RlbmNpbFdyaXRlTWFzayIsIl9jdXJTdGVuY2lsQ29tcGFyZU1hc2siLCJXZWJHTENvbW1hbmRCdWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLE1BQU1BLGVBQXlCLEdBQUcsRUFBbEM7O01BRWFDLHlCOzs7Ozs7Ozs7OztzQ0FHTEMsVSxFQUNBQyxXLEVBQ0FDLFUsRUFDQUMsVyxFQUNBQyxVLEVBQ0FDLFksRUFBc0I7QUFFdEIsd0RBQ0ksS0FBS0MsT0FEVCxFQUVLTixVQUFELENBQWdDTyxhQUZwQyxFQUdLTixXQUFELENBQWtDTyxjQUh0QyxFQUlJTixVQUpKLEVBSWdCQyxXQUpoQixFQUk2QkMsVUFKN0IsRUFJeUNDLFlBSnpDO0FBS0EsYUFBS0ksZUFBTCxHQUF1QixJQUF2QjtBQUNIOzs7MkJBRVlDLGMsRUFBbUM7QUFDNUMsWUFBSSxLQUFLRCxlQUFULEVBQTBCO0FBQ3RCLGNBQUksS0FBS0UsZ0JBQVQsRUFBMkI7QUFDdkIsaUJBQUtDLFVBQUw7QUFDSDs7QUFFRCwrQ0FBaUIsS0FBS04sT0FBdEIsRUFBOENJLGNBQTlDO0FBRUEsWUFBRSxLQUFLRyxhQUFQO0FBQ0EsZUFBS0MsYUFBTCxJQUFzQkosY0FBYyxDQUFDSyxhQUFyQztBQUNBLGNBQU1DLFVBQVUsR0FBR04sY0FBYyxDQUFDTSxVQUFmLElBQTZCTixjQUFjLENBQUNPLFdBQS9EOztBQUNBLGNBQUksS0FBS0Msb0JBQVQsRUFBK0I7QUFDM0IsZ0JBQU1DLFdBQVcsR0FBRyxLQUFLRCxvQkFBTCxDQUEwQkMsV0FBOUM7O0FBQ0Esb0JBQVFBLFdBQVI7QUFDSSxtQkFBSyxNQUFMO0FBQWE7QUFBRTtBQUNYLHVCQUFLQyxRQUFMLElBQWlCSixVQUFVLEdBQUcsQ0FBYixHQUFpQkssSUFBSSxDQUFDQyxHQUFMLENBQVNaLGNBQWMsQ0FBQ0ssYUFBeEIsRUFBdUMsQ0FBdkMsQ0FBbEM7QUFDQTtB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aEUsRUFDdUZ0RCxlQUR2RixFQUVJLEtBQUt1RCxZQUZULEVBRXVCLEtBQUtDLFdBRjVCLEVBRXlDLEtBQUtDLGFBRjlDLEVBRTZELEtBQUtDLGFBRmxFLEVBRWlGLEtBQUtDLGtCQUZ0RixFQUdJLEtBQUtDLGVBSFQsRUFHMEIsS0FBS0Msb0JBSC9CLEVBR3FELEtBQUtDLHNCQUgxRDtBQUlBLGFBQUtqRCxnQkFBTCxHQUF3QixLQUF4QjtBQUNIOzs7O0lBdEcwQ2tELHNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYQnVmZmVyLCBHRlhCdWZmZXJTb3VyY2UgfSBmcm9tICcuLi9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi4vY29tbWFuZC1idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXJUZXh0dXJlQ29weSwgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWENvbG9yLCBHRlhSZWN0IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRnJhbWVidWZmZXIgfSBmcm9tICcuLi9mcmFtZWJ1ZmZlcic7XHJcbmltcG9ydCB7IEdGWElucHV0QXNzZW1ibGVyIH0gZnJvbSAnLi4vaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgR0ZYVGV4dHVyZSB9IGZyb20gJy4uL3RleHR1cmUnO1xyXG5pbXBvcnQgeyBXZWJHTEJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0xDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi93ZWJnbC1jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7XHJcbiAgICBXZWJHTENtZEZ1bmNCZWdpblJlbmRlclBhc3MsIFdlYkdMQ21kRnVuY0JpbmRTdGF0ZXMsIFdlYkdMQ21kRnVuY0NvcHlCdWZmZXJzVG9UZXh0dXJlLFxyXG4gICAgV2ViR0xDbWRGdW5jRHJhdywgV2ViR0xDbWRGdW5jRXhlY3V0ZUNtZHMsIFdlYkdMQ21kRnVuY1VwZGF0ZUJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBXZWJHTERldmljZSB9IGZyb20gJy4vd2ViZ2wtZGV2aWNlJztcclxuaW1wb3J0IHsgV2ViR0xGcmFtZWJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBXZWJHTFRleHR1cmUgfSBmcm9tICcuL3dlYmdsLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi4vcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBXZWJHTFJlbmRlclBhc3MgfSBmcm9tICcuL3dlYmdsLXJlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgR0ZYRHJhd0luZm8gfSBmcm9tICcuLi8uLic7XHJcblxyXG5jb25zdCBfZHluYW1pY09mZnNldHM6IG51bWJlcltdID0gW107XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xQcmltYXJ5Q29tbWFuZEJ1ZmZlciBleHRlbmRzIFdlYkdMQ29tbWFuZEJ1ZmZlciB7XHJcblxyXG4gICAgcHVibGljIGJlZ2luUmVuZGVyUGFzcyAoXHJcbiAgICAgICAgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcyxcclxuICAgICAgICBmcmFtZWJ1ZmZlcjogR0ZYRnJhbWVidWZmZXIsXHJcbiAgICAgICAgcmVuZGVyQXJlYTogR0ZYUmVjdCxcclxuICAgICAgICBjbGVhckNvbG9yczogR0ZYQ29sb3JbXSxcclxuICAgICAgICBjbGVhckRlcHRoOiBudW1iZXIsXHJcbiAgICAgICAgY2xlYXJTdGVuY2lsOiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgV2ViR0xDbWRGdW5jQmVnaW5SZW5kZXJQYXNzKFxyXG4gICAgICAgICAgICB0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UsXHJcbiAgICAgICAgICAgIChyZW5kZXJQYXNzIGFzIFdlYkdMUmVuZGVyUGFzcykuZ3B1UmVuZGVyUGFzcyxcclxuICAgICAgICAgICAgKGZyYW1lYnVmZmVyIGFzIFdlYkdMRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyLFxyXG4gICAgICAgICAgICByZW5kZXJBcmVhLCBjbGVhckNvbG9ycywgY2xlYXJEZXB0aCwgY2xlYXJTdGVuY2lsKTtcclxuICAgICAgICB0aGlzLl9pc0luUmVuZGVyUGFzcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcgKGlucHV0QXNzZW1ibGVyOiBHRlhJbnB1dEFzc2VtYmxlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0luUmVuZGVyUGFzcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNTdGF0ZUludmFsaWVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRTdGF0ZXMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2ViR0xDbWRGdW5jRHJhdyh0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UsIGlucHV0QXNzZW1ibGVyIGFzIHVua25vd24gYXMgR0ZYRHJhd0luZm8pO1xyXG5cclxuICAgICAgICAgICAgKyt0aGlzLl9udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bUluc3RhbmNlcyArPSBpbnB1dEFzc2VtYmxlci5pbnN0YW5jZUNvdW50O1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleENvdW50ID0gaW5wdXRBc3NlbWJsZXIuaW5kZXhDb3VudCB8fCBpbnB1dEFzc2VtYmxlci52ZXJ0ZXhDb3VudDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckdQVVBpcGVsaW5lU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsUHJpbWl0aXZlID0gdGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZS5nbFByaW1pdGl2ZTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZ2xQcmltaXRpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDAwNDogeyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVTXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX251bVRyaXMgKz0gaW5kZXhDb3VudCAvIDMgKiBNYXRoLm1heChpbnB1dEFzc2VtYmxlci5pbnN0YW5jZUNvdW50LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMDA1OiAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVfU1RSSVBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDB4MDAwNjogeyAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuVFJJQU5HTEVfRkFOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX251bVRyaXMgKz0gKGluZGV4Q291bnQgLSAyKSAqIE1hdGgubWF4KGlucHV0QXNzZW1ibGVyLmluc3RhbmNlQ291bnQsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb21tYW5kIFxcJ2RyYXdcXCcgbXVzdCBiZSByZWNvcmRlZCBpbnNpZGUgYSByZW5kZXIgcGFzcy4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUJ1ZmZlciAoYnVmZmVyOiBHRlhCdWZmZXIsIGRhdGE6IEdGWEJ1ZmZlclNvdXJjZSwgb2Zmc2V0PzogbnVtYmVyLCBzaXplPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0luUmVuZGVyUGFzcykge1xyXG4gICAgICAgICAgICBjb25zdCBncHVCdWZmZXIgPSAoYnVmZmVyIGFzIFdlYkdMQnVmZmVyKS5ncHVCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmIChncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkgeyBvZmZzZXQgPSAwOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZTaXplOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZlNpemUgPSBzaXplO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChidWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZTaXplID0gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZlNpemUgPSAoZGF0YSBhcyBBcnJheUJ1ZmZlcikuYnl0ZUxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBXZWJHTENtZEZ1bmNVcGRhdGVCdWZmZXIodGhpcy5fZGV2aWNlIGFzIFdlYkdMRGV2aWNlLCBncHVCdWZmZXIsIGRhdGEgYXMgQXJyYXlCdWZmZXIsIG9mZnNldCwgYnVmZlNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWFuZCBcXCd1cGRhdGVCdWZmZXJcXCcgbXVzdCBiZSByZWNvcmRlZCBvdXRzaWRlIGEgcmVuZGVyIHBhc3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5QnVmZmVyc1RvVGV4dHVyZSAoYnVmZmVyczogQXJyYXlCdWZmZXJWaWV3W10sIHRleHR1cmU6IEdGWFRleHR1cmUsIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzSW5SZW5kZXJQYXNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdVRleHR1cmUgPSAodGV4dHVyZSBhcyBXZWJHTFRleHR1cmUpLmdwdVRleHR1cmU7XHJcbiAgICAgICAgICAgIGlmIChncHVUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBXZWJHTENtZEZ1bmNDb3B5QnVmZmVyc1RvVGV4dHVyZSh0aGlzLl9kZXZpY2UgYXMgV2ViR0xEZXZpY2UsIGJ1ZmZlcnMsIGdwdVRleHR1cmUsIHJlZ2lvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWFuZCBcXCdjb3B5QnVmZmVyVG9UZXh0dXJlXFwnIG11c3QgYmUgcmVjb3JkZWQgb3V0c2lkZSBhIHJlbmRlciBwYXNzLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhlY3V0ZSAoY21kQnVmZnM6IEdGWENvbW1hbmRCdWZmZXJbXSwgY291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAvLyBhY3R1YWxseSB0aGV5IGFyZSBzZWNvbmRhcnkgYnVmZmVycywgdGhlIGNhc3QgaGVyZSBpcyBvbmx5IGZvciB0eXBlIGNoZWNraW5nXHJcbiAgICAgICAgICAgIGNvbnN0IHdlYkdMQ21kQnVmZiA9IGNtZEJ1ZmZzW2ldIGFzIFdlYkdMUHJpbWFyeUNvbW1hbmRCdWZmZXI7XHJcbiAgICAgICAgICAgIFdlYkdMQ21kRnVuY0V4ZWN1dGVDbWRzKHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZSwgd2ViR0xDbWRCdWZmLmNtZFBhY2thZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9udW1EcmF3Q2FsbHMgKz0gd2ViR0xDbWRCdWZmLl9udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bUluc3RhbmNlcyArPSB3ZWJHTENtZEJ1ZmYuX251bUluc3RhbmNlcztcclxuICAgICAgICAgICAgdGhpcy5fbnVtVHJpcyArPSB3ZWJHTENtZEJ1ZmYuX251bVRyaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBiaW5kU3RhdGVzICgpIHtcclxuICAgICAgICBfZHluYW1pY09mZnNldHMubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2N1ckR5bmFtaWNPZmZzZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KF9keW5hbWljT2Zmc2V0cywgdGhpcy5fY3VyRHluYW1pY09mZnNldHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBXZWJHTENtZEZ1bmNCaW5kU3RhdGVzKHRoaXMuX2RldmljZSBhcyBXZWJHTERldmljZSxcclxuICAgICAgICAgICAgdGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZSwgdGhpcy5fY3VyR1BVSW5wdXRBc3NlbWJsZXIsIHRoaXMuX2N1ckdQVURlc2NyaXB0b3JTZXRzLCBfZHluYW1pY09mZnNldHMsXHJcbiAgICAgICAgICAgIHRoaXMuX2N1clZpZXdwb3J0LCB0aGlzLl9jdXJTY2lzc29yLCB0aGlzLl9jdXJMaW5lV2lkdGgsIHRoaXMuX2N1ckRlcHRoQmlhcywgdGhpcy5fY3VyQmxlbmRDb25zdGFudHMsXHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckRlcHRoQm91bmRzLCB0aGlzLl9jdXJTdGVuY2lsV3JpdGVNYXNrLCB0aGlzLl9jdXJTdGVuY2lsQ29tcGFyZU1hc2spO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhdGVJbnZhbGllZCA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==