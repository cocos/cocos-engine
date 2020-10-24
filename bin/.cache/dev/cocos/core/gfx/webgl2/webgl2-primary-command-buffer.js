(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../define.js", "./webgl2-command-buffer.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../define.js"), require("./webgl2-command-buffer.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.webgl2CommandBuffer, global.webgl2Commands);
    global.webgl2PrimaryCommandBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _webgl2CommandBuffer, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2PrimaryCommandBuffer = void 0;

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

  var WebGL2PrimaryCommandBuffer = /*#__PURE__*/function (_WebGL2CommandBuffer) {
    _inherits(WebGL2PrimaryCommandBuffer, _WebGL2CommandBuffer);

    function WebGL2PrimaryCommandBuffer() {
      _classCallCheck(this, WebGL2PrimaryCommandBuffer);

      return _possibleConstructorReturn(this, _getPrototypeOf(WebGL2PrimaryCommandBuffer).apply(this, arguments));
    }

    _createClass(WebGL2PrimaryCommandBuffer, [{
      key: "beginRenderPass",
      value: function beginRenderPass(renderPass, framebuffer, renderArea, clearColors, clearDepth, clearStencil) {
        (0, _webgl2Commands.WebGL2CmdFuncBeginRenderPass)(this._device, renderPass.gpuRenderPass, framebuffer.gpuFramebuffer, renderArea, clearColors, clearDepth, clearStencil);
        this._isInRenderPass = true;
      }
    }, {
      key: "draw",
      value: function draw(inputAssembler) {
        if (this._isInRenderPass) {
          if (this._isStateInvalied) {
            this.bindStates();
          }

          (0, _webgl2Commands.WebGL2CmdFuncDraw)(this._device, inputAssembler);
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

            (0, _webgl2Commands.WebGL2CmdFuncUpdateBuffer)(this._device, gpuBuffer, data, offset, buffSize);
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
            (0, _webgl2Commands.WebGL2CmdFuncCopyBuffersToTexture)(this._device, buffers, gpuTexture, regions);
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
          var webGL2CmdBuff = cmdBuffs[i];
          (0, _webgl2Commands.WebGL2CmdFuncExecuteCmds)(this._device, webGL2CmdBuff.cmdPackage);
          this._numDrawCalls += webGL2CmdBuff._numDrawCalls;
          this._numInstances += webGL2CmdBuff._numInstances;
          this._numTris += webGL2CmdBuff._numTris;
        }
      }
    }, {
      key: "bindStates",
      value: function bindStates() {
        _dynamicOffsets.length = 0;

        for (var i = 0; i < this._curDynamicOffsets.length; i++) {
          Array.prototype.push.apply(_dynamicOffsets, this._curDynamicOffsets[i]);
        }

        (0, _webgl2Commands.WebGL2CmdFuncBindStates)(this._device, this._curGPUPipelineState, this._curGPUInputAssembler, this._curGPUDescriptorSets, _dynamicOffsets, this._curViewport, this._curScissor, this._curLineWidth, this._curDepthBias, this._curBlendConstants, this._curDepthBounds, this._curStencilWriteMask, this._curStencilCompareMask);
        this._isStateInvalied = false;
      }
    }]);

    return WebGL2PrimaryCommandBuffer;
  }(_webgl2CommandBuffer.WebGL2CommandBuffer);

  _exports.WebGL2PrimaryCommandBuffer = WebGL2PrimaryCommandBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItcHJpbWFyeS1jb21tYW5kLWJ1ZmZlci50cyJdLCJuYW1lcyI6WyJfZHluYW1pY09mZnNldHMiLCJXZWJHTDJQcmltYXJ5Q29tbWFuZEJ1ZmZlciIsInJlbmRlclBhc3MiLCJmcmFtZWJ1ZmZlciIsInJlbmRlckFyZWEiLCJjbGVhckNvbG9ycyIsImNsZWFyRGVwdGgiLCJjbGVhclN0ZW5jaWwiLCJfZGV2aWNlIiwiZ3B1UmVuZGVyUGFzcyIsImdwdUZyYW1lYnVmZmVyIiwiX2lzSW5SZW5kZXJQYXNzIiwiaW5wdXRBc3NlbWJsZXIiLCJfaXNTdGF0ZUludmFsaWVkIiwiYmluZFN0YXRlcyIsIl9udW1EcmF3Q2FsbHMiLCJfbnVtSW5zdGFuY2VzIiwiaW5zdGFuY2VDb3VudCIsImluZGV4Q291bnQiLCJ2ZXJ0ZXhDb3VudCIsIl9jdXJHUFVQaXBlbGluZVN0YXRlIiwiZ2xQcmltaXRpdmUiLCJfbnVtVHJpcyIsIk1hdGgiLCJtYXgiLCJjb25zb2xlIiwiZXJyb3IiLCJidWZmZXIiLCJkYXRhIiwib2Zmc2V0Iiwic2l6ZSIsImdwdUJ1ZmZlciIsInVuZGVmaW5lZCIsImJ1ZmZTaXplIiwidXNhZ2UiLCJHRlhCdWZmZXJVc2FnZUJpdCIsIklORElSRUNUIiwiYnl0ZUxlbmd0aCIsImJ1ZmZlcnMiLCJ0ZXh0dXJlIiwicmVnaW9ucyIsImdwdVRleHR1cmUiLCJjbWRCdWZmcyIsImNvdW50IiwiaSIsIndlYkdMMkNtZEJ1ZmYiLCJjbWRQYWNrYWdlIiwibGVuZ3RoIiwiX2N1ckR5bmFtaWNPZmZzZXRzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwdXNoIiwiYXBwbHkiLCJfY3VyR1BVSW5wdXRBc3NlbWJsZXIiLCJfY3VyR1BVRGVzY3JpcHRvclNldHMiLCJfY3VyVmlld3BvcnQiLCJfY3VyU2Npc3NvciIsIl9jdXJMaW5lV2lkdGgiLCJfY3VyRGVwdGhCaWFzIiwiX2N1ckJsZW5kQ29uc3RhbnRzIiwiX2N1ckRlcHRoQm91bmRzIiwiX2N1clN0ZW5jaWxXcml0ZU1hc2siLCJfY3VyU3RlbmNpbENvbXBhcmVNYXNrIiwiV2ViR0wyQ29tbWFuZEJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsTUFBTUEsZUFBeUIsR0FBRyxFQUFsQzs7TUFFYUMsMEI7Ozs7Ozs7Ozs7O3NDQUdMQyxVLEVBQ0FDLFcsRUFDQUMsVSxFQUNBQyxXLEVBQ0FDLFUsRUFDQUMsWSxFQUFzQjtBQUV0QiwwREFDSSxLQUFLQyxPQURULEVBRUtOLFVBQUQsQ0FBaUNPLGFBRnJDLEVBR0tOLFdBQUQsQ0FBbUNPLGNBSHZDLEVBSUlOLFVBSkosRUFJZ0JDLFdBSmhCLEVBSTZCQyxVQUo3QixFQUl5Q0MsWUFKekM7QUFLQSxhQUFLSSxlQUFMLEdBQXVCLElBQXZCO0FBQ0g7OzsyQkFFWUMsYyxFQUFtQztBQUM1QyxZQUFJLEtBQUtELGVBQVQsRUFBMEI7QUFDdEIsY0FBSSxLQUFLRSxnQkFBVCxFQUEyQjtBQUN2QixpQkFBS0MsVUFBTDtBQUNIOztBQUVELGlEQUFrQixLQUFLTixPQUF2QixFQUFnREksY0FBaEQ7QUFFQSxZQUFFLEtBQUtHLGFBQVA7QUFDQSxlQUFLQyxhQUFMLElBQXNCSixjQUFjLENBQUNLLGFBQXJDO0FBQ0EsY0FBTUMsVUFBVSxHQUFHTixjQUFjLENBQUNNLFVBQWYsSUFBNkJOLGNBQWMsQ0FBQ08sV0FBL0Q7O0FBQ0EsY0FBSSxLQUFLQyxvQkFBVCxFQUErQjtBQUMzQixnQkFBTUMsV0FBVyxHQUFHLEtBQUtELG9CQUFMLENBQTBCQyxXQUE5Qzs7QUFDQSxvQkFBUUEsV0FBUjtBQUNJLG1CQUFLLE1BQUw7QUFBYTtBQUFFO0FBQ1gsdUJBQUtDLFFBQUwsSUFBaUJKLFVBQVUsR0FBRyxDQUFiLEdBQWlCSyxJQUFJLENBQUNDLEdBQUwsQ0FBU1osY0FBYyxDQUFDSyxhQUF4QixFQUF1QyxDQUF2QyxDQUFsQztB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LHFCQURoRSxFQUN1RnRELGVBRHZGLEVBRUksS0FBS3VELFlBRlQsRUFFdUIsS0FBS0MsV0FGNUIsRUFFeUMsS0FBS0MsYUFGOUMsRUFFNkQsS0FBS0MsYUFGbEUsRUFFaUYsS0FBS0Msa0JBRnRGLEVBR0ksS0FBS0MsZUFIVCxFQUcwQixLQUFLQyxvQkFIL0IsRUFHcUQsS0FBS0Msc0JBSDFEO0FBSUEsYUFBS2pELGdCQUFMLEdBQXdCLEtBQXhCO0FBQ0g7Ozs7SUF0RzJDa0Qsd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlclNvdXJjZSB9IGZyb20gJy4uL2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIgfSBmcm9tICcuLi9jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlclRleHR1cmVDb3B5LCBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYQ29sb3IsIEdGWFJlY3QgfSBmcm9tICcuLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhGcmFtZWJ1ZmZlciB9IGZyb20gJy4uL2ZyYW1lYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIgfSBmcm9tICcuLi9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlIH0gZnJvbSAnLi4vdGV4dHVyZSc7XHJcbmltcG9ydCB7IFdlYkdMMkJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wyLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMMkNvbW1hbmRCdWZmZXIgfSBmcm9tICcuL3dlYmdsMi1jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7XHJcbiAgICBXZWJHTDJDbWRGdW5jQmVnaW5SZW5kZXJQYXNzLCBXZWJHTDJDbWRGdW5jQmluZFN0YXRlcywgV2ViR0wyQ21kRnVuY0NvcHlCdWZmZXJzVG9UZXh0dXJlLFxyXG4gICAgV2ViR0wyQ21kRnVuY0RyYXcsIFdlYkdMMkNtZEZ1bmNFeGVjdXRlQ21kcywgV2ViR0wyQ21kRnVuY1VwZGF0ZUJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmRzJztcclxuaW1wb3J0IHsgV2ViR0wyRGV2aWNlIH0gZnJvbSAnLi93ZWJnbDItZGV2aWNlJztcclxuaW1wb3J0IHsgV2ViR0wyRnJhbWVidWZmZXIgfSBmcm9tICcuL3dlYmdsMi1mcmFtZWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMMlRleHR1cmUgfSBmcm9tICcuL3dlYmdsMi10ZXh0dXJlJztcclxuaW1wb3J0IHsgR0ZYUmVuZGVyUGFzcyB9IGZyb20gJy4uL3JlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgV2ViR0wyUmVuZGVyUGFzcyB9IGZyb20gJy4vd2ViZ2wyLXJlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgR0ZYRHJhd0luZm8gfSBmcm9tICcuLi8uLic7XHJcblxyXG5jb25zdCBfZHluYW1pY09mZnNldHM6IG51bWJlcltdID0gW107XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyUHJpbWFyeUNvbW1hbmRCdWZmZXIgZXh0ZW5kcyBXZWJHTDJDb21tYW5kQnVmZmVyIHtcclxuXHJcbiAgICBwdWJsaWMgYmVnaW5SZW5kZXJQYXNzIChcclxuICAgICAgICByZW5kZXJQYXNzOiBHRlhSZW5kZXJQYXNzLFxyXG4gICAgICAgIGZyYW1lYnVmZmVyOiBHRlhGcmFtZWJ1ZmZlcixcclxuICAgICAgICByZW5kZXJBcmVhOiBHRlhSZWN0LFxyXG4gICAgICAgIGNsZWFyQ29sb3JzOiBHRlhDb2xvcltdLFxyXG4gICAgICAgIGNsZWFyRGVwdGg6IG51bWJlcixcclxuICAgICAgICBjbGVhclN0ZW5jaWw6IG51bWJlcikge1xyXG5cclxuICAgICAgICBXZWJHTDJDbWRGdW5jQmVnaW5SZW5kZXJQYXNzKFxyXG4gICAgICAgICAgICB0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlLFxyXG4gICAgICAgICAgICAocmVuZGVyUGFzcyBhcyBXZWJHTDJSZW5kZXJQYXNzKS5ncHVSZW5kZXJQYXNzLFxyXG4gICAgICAgICAgICAoZnJhbWVidWZmZXIgYXMgV2ViR0wyRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyLFxyXG4gICAgICAgICAgICByZW5kZXJBcmVhLCBjbGVhckNvbG9ycywgY2xlYXJEZXB0aCwgY2xlYXJTdGVuY2lsKTtcclxuICAgICAgICB0aGlzLl9pc0luUmVuZGVyUGFzcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcgKGlucHV0QXNzZW1ibGVyOiBHRlhJbnB1dEFzc2VtYmxlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0luUmVuZGVyUGFzcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNTdGF0ZUludmFsaWVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRTdGF0ZXMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2ViR0wyQ21kRnVuY0RyYXcodGhpcy5fZGV2aWNlIGFzIFdlYkdMMkRldmljZSwgaW5wdXRBc3NlbWJsZXIgYXMgdW5rbm93biBhcyBHRlhEcmF3SW5mbyk7XHJcblxyXG4gICAgICAgICAgICArK3RoaXMuX251bURyYXdDYWxscztcclxuICAgICAgICAgICAgdGhpcy5fbnVtSW5zdGFuY2VzICs9IGlucHV0QXNzZW1ibGVyLmluc3RhbmNlQ291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4Q291bnQgPSBpbnB1dEFzc2VtYmxlci5pbmRleENvdW50IHx8IGlucHV0QXNzZW1ibGVyLnZlcnRleENvdW50O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VyR1BVUGlwZWxpbmVTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xQcmltaXRpdmUgPSB0aGlzLl9jdXJHUFVQaXBlbGluZVN0YXRlLmdsUHJpbWl0aXZlO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChnbFByaW1pdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMDA0OiB7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5UUklBTkdMRVNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbnVtVHJpcyArPSBpbmRleENvdW50IC8gMyAqIE1hdGgubWF4KGlucHV0QXNzZW1ibGVyLmluc3RhbmNlQ291bnQsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAweDAwMDU6IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5UUklBTkdMRV9TVFJJUFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMDA2OiB7IC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5UUklBTkdMRV9GQU5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbnVtVHJpcyArPSAoaW5kZXhDb3VudCAtIDIpICogTWF0aC5tYXgoaW5wdXRBc3NlbWJsZXIuaW5zdGFuY2VDb3VudCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbW1hbmQgXFwnZHJhd1xcJyBtdXN0IGJlIHJlY29yZGVkIGluc2lkZSBhIHJlbmRlciBwYXNzLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlQnVmZmVyIChidWZmZXI6IEdGWEJ1ZmZlciwgZGF0YTogR0ZYQnVmZmVyU291cmNlLCBvZmZzZXQ/OiBudW1iZXIsIHNpemU/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzSW5SZW5kZXJQYXNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdUJ1ZmZlciA9IChidWZmZXIgYXMgV2ViR0wyQnVmZmVyKS5ncHVCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmIChncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkgeyBvZmZzZXQgPSAwOyB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZTaXplOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZTaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZmU2l6ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZTaXplID0gKGRhdGEgYXMgQXJyYXlCdWZmZXIpLmJ5dGVMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgV2ViR0wyQ21kRnVuY1VwZGF0ZUJ1ZmZlcih0aGlzLl9kZXZpY2UgYXMgV2ViR0wyRGV2aWNlLCBncHVCdWZmZXIsIGRhdGEgYXMgQXJyYXlCdWZmZXIsIG9mZnNldCwgYnVmZlNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWFuZCBcXCd1cGRhdGVCdWZmZXJcXCcgbXVzdCBiZSByZWNvcmRlZCBvdXRzaWRlIGEgcmVuZGVyIHBhc3MuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5QnVmZmVyc1RvVGV4dHVyZSAoYnVmZmVyczogQXJyYXlCdWZmZXJWaWV3W10sIHRleHR1cmU6IEdGWFRleHR1cmUsIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzSW5SZW5kZXJQYXNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdVRleHR1cmUgPSAodGV4dHVyZSBhcyBXZWJHTDJUZXh0dXJlKS5ncHVUZXh0dXJlO1xyXG4gICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgV2ViR0wyQ21kRnVuY0NvcHlCdWZmZXJzVG9UZXh0dXJlKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsIGJ1ZmZlcnMsIGdwdVRleHR1cmUsIHJlZ2lvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWFuZCBcXCdjb3B5QnVmZmVyVG9UZXh0dXJlXFwnIG11c3QgYmUgcmVjb3JkZWQgb3V0c2lkZSBhIHJlbmRlciBwYXNzLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhlY3V0ZSAoY21kQnVmZnM6IEdGWENvbW1hbmRCdWZmZXJbXSwgY291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAvLyBhY3R1YWxseSB0aGV5IGFyZSBzZWNvbmRhcnkgYnVmZmVycywgdGhlIGNhc3QgaGVyZSBpcyBvbmx5IGZvciB0eXBlIGNoZWNraW5nXHJcbiAgICAgICAgICAgIGNvbnN0IHdlYkdMMkNtZEJ1ZmYgPSBjbWRCdWZmc1tpXSBhcyBXZWJHTDJQcmltYXJ5Q29tbWFuZEJ1ZmZlcjtcclxuICAgICAgICAgICAgV2ViR0wyQ21kRnVuY0V4ZWN1dGVDbWRzKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsIHdlYkdMMkNtZEJ1ZmYuY21kUGFja2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX251bURyYXdDYWxscyArPSB3ZWJHTDJDbWRCdWZmLl9udW1EcmF3Q2FsbHM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bUluc3RhbmNlcyArPSB3ZWJHTDJDbWRCdWZmLl9udW1JbnN0YW5jZXM7XHJcbiAgICAgICAgICAgIHRoaXMuX251bVRyaXMgKz0gd2ViR0wyQ21kQnVmZi5fbnVtVHJpcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGJpbmRTdGF0ZXMgKCkge1xyXG4gICAgICAgIF9keW5hbWljT2Zmc2V0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY3VyRHluYW1pY09mZnNldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoX2R5bmFtaWNPZmZzZXRzLCB0aGlzLl9jdXJEeW5hbWljT2Zmc2V0c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFdlYkdMMkNtZEZ1bmNCaW5kU3RhdGVzKHRoaXMuX2RldmljZSBhcyBXZWJHTDJEZXZpY2UsXHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckdQVVBpcGVsaW5lU3RhdGUsIHRoaXMuX2N1ckdQVUlucHV0QXNzZW1ibGVyLCB0aGlzLl9jdXJHUFVEZXNjcmlwdG9yU2V0cywgX2R5bmFtaWNPZmZzZXRzLFxyXG4gICAgICAgICAgICB0aGlzLl9jdXJWaWV3cG9ydCwgdGhpcy5fY3VyU2Npc3NvciwgdGhpcy5fY3VyTGluZVdpZHRoLCB0aGlzLl9jdXJEZXB0aEJpYXMsIHRoaXMuX2N1ckJsZW5kQ29uc3RhbnRzLFxyXG4gICAgICAgICAgICB0aGlzLl9jdXJEZXB0aEJvdW5kcywgdGhpcy5fY3VyU3RlbmNpbFdyaXRlTWFzaywgdGhpcy5fY3VyU3RlbmNpbENvbXBhcmVNYXNrKTtcclxuICAgICAgICB0aGlzLl9pc1N0YXRlSW52YWxpZWQgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG4iXX0=