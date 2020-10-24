(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./buffer.js", "./command-buffer.js", "./define.js", "./device.js", "./framebuffer.js", "./input-assembler.js", "./pipeline-state.js", "./queue.js", "./render-pass.js", "./sampler.js", "./shader.js", "./texture.js", "../global-exports.js", "./descriptor-set.js", "./descriptor-set-layout.js", "./pipeline-layout.js", "./fence.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./buffer.js"), require("./command-buffer.js"), require("./define.js"), require("./device.js"), require("./framebuffer.js"), require("./input-assembler.js"), require("./pipeline-state.js"), require("./queue.js"), require("./render-pass.js"), require("./sampler.js"), require("./shader.js"), require("./texture.js"), require("../global-exports.js"), require("./descriptor-set.js"), require("./descriptor-set-layout.js"), require("./pipeline-layout.js"), require("./fence.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.buffer, global.commandBuffer, global.define, global.device, global.framebuffer, global.inputAssembler, global.pipelineState, global.queue, global.renderPass, global.sampler, global.shader, global.texture, global.globalExports, global.descriptorSet, global.descriptorSetLayout, global.pipelineLayout, global.fence);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _buffer, _commandBuffer, GFXDefines, _device, _framebuffer, _inputAssembler, _pipelineState, _queue, _renderPass, _sampler, _shader, _texture, _globalExports, _descriptorSet, _descriptorSetLayout, _pipelineLayout, _fence) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_buffer).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _buffer[key];
      }
    });
  });
  Object.keys(_commandBuffer).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _commandBuffer[key];
      }
    });
  });
  GFXDefines = _interopRequireWildcard(GFXDefines);
  Object.keys(GFXDefines).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return GFXDefines[key];
      }
    });
  });
  Object.keys(_device).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _device[key];
      }
    });
  });
  Object.keys(_framebuffer).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _framebuffer[key];
      }
    });
  });
  Object.keys(_inputAssembler).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _inputAssembler[key];
      }
    });
  });
  Object.keys(_pipelineState).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _pipelineState[key];
      }
    });
  });
  Object.keys(_queue).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _queue[key];
      }
    });
  });
  Object.keys(_renderPass).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _renderPass[key];
      }
    });
  });
  Object.keys(_sampler).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _sampler[key];
      }
    });
  });
  Object.keys(_shader).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _shader[key];
      }
    });
  });
  Object.keys(_texture).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _texture[key];
      }
    });
  });
  Object.keys(_descriptorSet).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _descriptorSet[key];
      }
    });
  });
  Object.keys(_descriptorSetLayout).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _descriptorSetLayout[key];
      }
    });
  });
  Object.keys(_pipelineLayout).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _pipelineLayout[key];
      }
    });
  });
  Object.keys(_fence).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _fence[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * @category gfx
   */
  _globalExports.legacyCC.GFXDevice = _device.GFXDevice;
  _globalExports.legacyCC.GFXBuffer = _buffer.GFXBuffer;
  _globalExports.legacyCC.GFXTexture = _texture.GFXTexture;
  _globalExports.legacyCC.GFXSampler = _sampler.GFXSampler;
  _globalExports.legacyCC.GFXShader = _shader.GFXShader;
  _globalExports.legacyCC.GFXInputAssembler = _inputAssembler.GFXInputAssembler;
  _globalExports.legacyCC.GFXRenderPass = _renderPass.GFXRenderPass;
  _globalExports.legacyCC.GFXFramebuffer = _framebuffer.GFXFramebuffer;
  _globalExports.legacyCC.GFXPipelineState = _pipelineState.GFXPipelineState;
  _globalExports.legacyCC.GFXCommandBuffer = _commandBuffer.GFXCommandBuffer;
  _globalExports.legacyCC.GFXQueue = _queue.GFXQueue;
  Object.assign(_globalExports.legacyCC, GFXDefines);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiR0ZYRGV2aWNlIiwiR0ZYQnVmZmVyIiwiR0ZYVGV4dHVyZSIsIkdGWFNhbXBsZXIiLCJHRlhTaGFkZXIiLCJHRlhJbnB1dEFzc2VtYmxlciIsIkdGWFJlbmRlclBhc3MiLCJHRlhGcmFtZWJ1ZmZlciIsIkdGWFBpcGVsaW5lU3RhdGUiLCJHRlhDb21tYW5kQnVmZmVyIiwiR0ZYUXVldWUiLCJPYmplY3QiLCJhc3NpZ24iLCJHRlhEZWZpbmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7O0FBNUJBOzs7QUFtQ0FBLDBCQUFTQyxTQUFULEdBQXFCQSxpQkFBckI7QUFDQUQsMEJBQVNFLFNBQVQsR0FBcUJBLGlCQUFyQjtBQUNBRiwwQkFBU0csVUFBVCxHQUFzQkEsbUJBQXRCO0FBQ0FILDBCQUFTSSxVQUFULEdBQXNCQSxtQkFBdEI7QUFDQUosMEJBQVNLLFNBQVQsR0FBcUJBLGlCQUFyQjtBQUNBTCwwQkFBU00saUJBQVQsR0FBNkJBLGlDQUE3QjtBQUNBTiwwQkFBU08sYUFBVCxHQUF5QkEseUJBQXpCO0FBQ0FQLDBCQUFTUSxjQUFULEdBQTBCQSwyQkFBMUI7QUFDQVIsMEJBQVNTLGdCQUFULEdBQTRCQSwrQkFBNUI7QUFDQVQsMEJBQVNVLGdCQUFULEdBQTRCQSwrQkFBNUI7QUFDQVYsMEJBQVNXLFFBQVQsR0FBb0JBLGVBQXBCO0FBRUFDLEVBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjYix1QkFBZCxFQUF3QmMsVUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWEJ1ZmZlciB9IGZyb20gJy4vYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYQ29tbWFuZEJ1ZmZlciB9IGZyb20gJy4vY29tbWFuZC1idWZmZXInO1xyXG5pbXBvcnQgKiBhcyBHRlhEZWZpbmVzIGZyb20gJy4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi9kZXZpY2UnO1xyXG5pbXBvcnQgeyBHRlhGcmFtZWJ1ZmZlciB9IGZyb20gJy4vZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBHRlhJbnB1dEFzc2VtYmxlciB9IGZyb20gJy4vaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgR0ZYUGlwZWxpbmVTdGF0ZSB9IGZyb20gJy4vcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBHRlhRdWV1ZSB9IGZyb20gJy4vcXVldWUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi9yZW5kZXItcGFzcyc7XHJcbmltcG9ydCB7IEdGWFNhbXBsZXIgfSBmcm9tICcuL3NhbXBsZXInO1xyXG5pbXBvcnQgeyBHRlhTaGFkZXIgfSBmcm9tICcuL3NoYWRlcic7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUgfSBmcm9tICcuL3RleHR1cmUnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vZGVzY3JpcHRvci1zZXQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2J1ZmZlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29tbWFuZC1idWZmZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL2RlZmluZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZGV2aWNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9mcmFtZWJ1ZmZlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vaW5wdXQtYXNzZW1ibGVyJztcclxuZXhwb3J0ICogZnJvbSAnLi9kZXNjcmlwdG9yLXNldC1sYXlvdXQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3BpcGVsaW5lLWxheW91dCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcGlwZWxpbmUtc3RhdGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL2ZlbmNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9xdWV1ZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcmVuZGVyLXBhc3MnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NhbXBsZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL3NoYWRlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vdGV4dHVyZSc7XHJcblxyXG5sZWdhY3lDQy5HRlhEZXZpY2UgPSBHRlhEZXZpY2U7XHJcbmxlZ2FjeUNDLkdGWEJ1ZmZlciA9IEdGWEJ1ZmZlcjtcclxubGVnYWN5Q0MuR0ZYVGV4dHVyZSA9IEdGWFRleHR1cmU7XHJcbmxlZ2FjeUNDLkdGWFNhbXBsZXIgPSBHRlhTYW1wbGVyO1xyXG5sZWdhY3lDQy5HRlhTaGFkZXIgPSBHRlhTaGFkZXI7XHJcbmxlZ2FjeUNDLkdGWElucHV0QXNzZW1ibGVyID0gR0ZYSW5wdXRBc3NlbWJsZXI7XHJcbmxlZ2FjeUNDLkdGWFJlbmRlclBhc3MgPSBHRlhSZW5kZXJQYXNzO1xyXG5sZWdhY3lDQy5HRlhGcmFtZWJ1ZmZlciA9IEdGWEZyYW1lYnVmZmVyO1xyXG5sZWdhY3lDQy5HRlhQaXBlbGluZVN0YXRlID0gR0ZYUGlwZWxpbmVTdGF0ZTtcclxubGVnYWN5Q0MuR0ZYQ29tbWFuZEJ1ZmZlciA9IEdGWENvbW1hbmRCdWZmZXI7XHJcbmxlZ2FjeUNDLkdGWFF1ZXVlID0gR0ZYUXVldWU7XHJcblxyXG5PYmplY3QuYXNzaWduKGxlZ2FjeUNDLCBHRlhEZWZpbmVzKTtcclxuIl19