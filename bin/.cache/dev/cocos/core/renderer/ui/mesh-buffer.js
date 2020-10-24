(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/buffer.js", "../../gfx/define.js", "../../gfx/input-assembler.js", "../core/memory-pools.js", "./ui-vertex-format.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/buffer.js"), require("../../gfx/define.js"), require("../../gfx/input-assembler.js"), require("../core/memory-pools.js"), require("./ui-vertex-format.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.buffer, global.define, global.inputAssembler, global.memoryPools, global.uiVertexFormat);
    global.meshBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _buffer, _define, _inputAssembler, _memoryPools, _uiVertexFormat) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MeshBuffer = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var MeshBuffer = /*#__PURE__*/function () {
    _createClass(MeshBuffer, [{
      key: "attributes",
      get: function get() {
        return this._attributes;
      }
    }, {
      key: "vertexBuffers",
      get: function get() {
        return this._vertexBuffers;
      }
    }, {
      key: "indexBuffer",
      get: function get() {
        return this._indexBuffer;
      }
    }]);

    function MeshBuffer(batcher) {
      _classCallCheck(this, MeshBuffer);

      this.vData = null;
      this.iData = null;
      this.byteStart = 0;
      this.byteOffset = 0;
      this.indicesStart = 0;
      this.indicesOffset = 0;
      this.vertexStart = 0;
      this.vertexOffset = 0;
      this.lastByteOffset = 1;
      this._attributes = null;
      this._vertexBuffers = [];
      this._indexBuffer = null;
      this._iaInfo = null;
      this._batcher = void 0;
      this._dirty = false;
      this._vertexFormatBytes = 0;
      this._initVDataCount = 0;
      this._initIDataCount = 256 * 6;
      this._outOfCallback = null;
      this._hInputAssemblers = [];
      this._nextFreeIAHandle = 0;
      this._batcher = batcher;
    }

    _createClass(MeshBuffer, [{
      key: "initialize",
      value: function initialize(attrs, outOfCallback) {
        this._outOfCallback = outOfCallback;
        var formatBytes = (0, _uiVertexFormat.getAttributeFormatBytes)(attrs);
        this._vertexFormatBytes = formatBytes * Float32Array.BYTES_PER_ELEMENT;
        this._initVDataCount = 256 * this._vertexFormatBytes;
        var vbStride = Float32Array.BYTES_PER_ELEMENT * formatBytes;

        if (!this.vertexBuffers.length) {
          this.vertexBuffers.push(this._batcher.device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, vbStride, vbStride)));
        }

        var ibStride = Uint16Array.BYTES_PER_ELEMENT;

        if (!this.indexBuffer) {
          this._indexBuffer = this._batcher.device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, ibStride, ibStride));
        }

        this._attributes = attrs;
        this._iaInfo = new _inputAssembler.GFXInputAssemblerInfo(this.attributes, this.vertexBuffers, this.indexBuffer);

        this._reallocBuffer();
      }
    }, {
      key: "request",
      value: function request() {
        var vertexCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
        var indicesCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
        this.lastByteOffset = this.byteOffset;
        var byteOffset = this.byteOffset + vertexCount * this._vertexFormatBytes;
        var indicesOffset = this.indicesOffset + indicesCount;

        if (vertexCount + this.vertexOffset > 65535) {
          // merge last state
          this._batcher.autoMergeBatches();

          if (this._outOfCallback) {
            this._outOfCallback.call(this._batcher, vertexCount, indicesCount);
          }

          return false;
        }

        var byteLength = this.vData.byteLength;
        var indicesLength = this.iData.length;

        if (byteOffset > byteLength || indicesOffset > indicesLength) {
          while (byteLength < byteOffset || indicesLength < indicesOffset) {
            this._initVDataCount *= 2;
            this._initIDataCount *= 2;
            byteLength = this._initVDataCount * 4;
            indicesLength = this._initIDataCount;
          }

          this._reallocBuffer();
        }

        this.vertexOffset += vertexCount;
        this.indicesOffset += indicesCount;
        this.byteOffset = byteOffset;
        this._dirty = true;
        return true;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indicesStart = 0;
        this.indicesOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;
        this.lastByteOffset = 0;
        this._nextFreeIAHandle = 0;
        this._dirty = false;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._attributes = null;
        this.vertexBuffers[0].destroy();
        this.vertexBuffers.length = 0;
        this.indexBuffer.destroy();
        this._indexBuffer = null;

        for (var i = 0; i < this._hInputAssemblers.length; i++) {
          _memoryPools.IAPool.free(this._hInputAssemblers[i]);
        }

        this._hInputAssemblers.length = 0;
      }
    }, {
      key: "recordBatch",
      value: function recordBatch() {
        var vCount = this.indicesOffset - this.indicesStart;

        if (!vCount) {
          return _memoryPools.NULL_HANDLE;
        }

        if (this._hInputAssemblers.length <= this._nextFreeIAHandle) {
          this._hInputAssemblers.push(_memoryPools.IAPool.alloc(this._batcher.device, this._iaInfo));
        }

        var hIA = this._hInputAssemblers[this._nextFreeIAHandle++];

        var ia = _memoryPools.IAPool.get(hIA);

        ia.firstIndex = this.indicesStart;
        ia.indexCount = vCount;
        return hIA;
      }
    }, {
      key: "uploadData",
      value: function uploadData() {
        if (this.byteOffset === 0 || !this._dirty) {
          return;
        }

        var verticesData = new Float32Array(this.vData.buffer, 0, this.byteOffset >> 2);
        var indicesData = new Uint16Array(this.iData.buffer, 0, this.indicesOffset);

        if (this.byteOffset > this.vertexBuffers[0].size) {
          this.vertexBuffers[0].resize(this.byteOffset);
        }

        this.vertexBuffers[0].update(verticesData);

        if (this.indicesOffset * 2 > this.indexBuffer.size) {
          this.indexBuffer.resize(this.indicesOffset * 2);
        }

        this.indexBuffer.update(indicesData);
      }
    }, {
      key: "_reallocBuffer",
      value: function _reallocBuffer() {
        this._reallocVData(true);

        this._reallocIData(true);
      }
    }, {
      key: "_reallocVData",
      value: function _reallocVData(copyOldData) {
        var oldVData;

        if (this.vData) {
          oldVData = new Uint8Array(this.vData.buffer);
        }

        this.vData = new Float32Array(this._initVDataCount);

        if (oldVData && copyOldData) {
          var newData = new Uint8Array(this.vData.buffer);

          for (var i = 0, l = oldVData.length; i < l; i++) {
            newData[i] = oldVData[i];
          }
        }
      }
    }, {
      key: "_reallocIData",
      value: function _reallocIData(copyOldData) {
        var oldIData = this.iData;
        this.iData = new Uint16Array(this._initIDataCount);

        if (oldIData && copyOldData) {
          var iData = this.iData;

          for (var i = 0, l = oldIData.length; i < l; i++) {
            iData[i] = oldIData[i];
          }
        }
      }
    }]);

    return MeshBuffer;
  }();

  _exports.MeshBuffer = MeshBuffer;
  MeshBuffer.OPACITY_OFFSET = 8;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvbWVzaC1idWZmZXIudHMiXSwibmFtZXMiOlsiTWVzaEJ1ZmZlciIsIl9hdHRyaWJ1dGVzIiwiX3ZlcnRleEJ1ZmZlcnMiLCJfaW5kZXhCdWZmZXIiLCJiYXRjaGVyIiwidkRhdGEiLCJpRGF0YSIsImJ5dGVTdGFydCIsImJ5dGVPZmZzZXQiLCJpbmRpY2VzU3RhcnQiLCJpbmRpY2VzT2Zmc2V0IiwidmVydGV4U3RhcnQiLCJ2ZXJ0ZXhPZmZzZXQiLCJsYXN0Qnl0ZU9mZnNldCIsIl9pYUluZm8iLCJfYmF0Y2hlciIsIl9kaXJ0eSIsIl92ZXJ0ZXhGb3JtYXRCeXRlcyIsIl9pbml0VkRhdGFDb3VudCIsIl9pbml0SURhdGFDb3VudCIsIl9vdXRPZkNhbGxiYWNrIiwiX2hJbnB1dEFzc2VtYmxlcnMiLCJfbmV4dEZyZWVJQUhhbmRsZSIsImF0dHJzIiwib3V0T2ZDYWxsYmFjayIsImZvcm1hdEJ5dGVzIiwiRmxvYXQzMkFycmF5IiwiQllURVNfUEVSX0VMRU1FTlQiLCJ2YlN0cmlkZSIsInZlcnRleEJ1ZmZlcnMiLCJsZW5ndGgiLCJwdXNoIiwiZGV2aWNlIiwiY3JlYXRlQnVmZmVyIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiVkVSVEVYIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiaWJTdHJpZGUiLCJVaW50MTZBcnJheSIsImluZGV4QnVmZmVyIiwiSU5ERVgiLCJHRlhJbnB1dEFzc2VtYmxlckluZm8iLCJhdHRyaWJ1dGVzIiwiX3JlYWxsb2NCdWZmZXIiLCJ2ZXJ0ZXhDb3VudCIsImluZGljZXNDb3VudCIsImF1dG9NZXJnZUJhdGNoZXMiLCJjYWxsIiwiYnl0ZUxlbmd0aCIsImluZGljZXNMZW5ndGgiLCJkZXN0cm95IiwiaSIsIklBUG9vbCIsImZyZWUiLCJ2Q291bnQiLCJOVUxMX0hBTkRMRSIsImFsbG9jIiwiaElBIiwiaWEiLCJnZXQiLCJmaXJzdEluZGV4IiwiaW5kZXhDb3VudCIsInZlcnRpY2VzRGF0YSIsImJ1ZmZlciIsImluZGljZXNEYXRhIiwic2l6ZSIsInJlc2l6ZSIsInVwZGF0ZSIsIl9yZWFsbG9jVkRhdGEiLCJfcmVhbGxvY0lEYXRhIiwiY29weU9sZERhdGEiLCJvbGRWRGF0YSIsIlVpbnQ4QXJyYXkiLCJuZXdEYXRhIiwibCIsIm9sZElEYXRhIiwiT1BBQ0lUWV9PRkZTRVQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bb0NhQSxVOzs7MEJBR1M7QUFBRSxlQUFPLEtBQUtDLFdBQVo7QUFBMEI7OzswQkFDekI7QUFBRSxlQUFPLEtBQUtDLGNBQVo7QUFBNkI7OzswQkFDakM7QUFBRSxlQUFPLEtBQUtDLFlBQVo7QUFBMkI7OztBQThCaEQsd0JBQWFDLE9BQWIsRUFBMEI7QUFBQTs7QUFBQSxXQTVCbkJDLEtBNEJtQixHQTVCVSxJQTRCVjtBQUFBLFdBM0JuQkMsS0EyQm1CLEdBM0JTLElBMkJUO0FBQUEsV0F6Qm5CQyxTQXlCbUIsR0F6QlAsQ0F5Qk87QUFBQSxXQXhCbkJDLFVBd0JtQixHQXhCTixDQXdCTTtBQUFBLFdBdkJuQkMsWUF1Qm1CLEdBdkJKLENBdUJJO0FBQUEsV0F0Qm5CQyxhQXNCbUIsR0F0QkgsQ0FzQkc7QUFBQSxXQXJCbkJDLFdBcUJtQixHQXJCTCxDQXFCSztBQUFBLFdBcEJuQkMsWUFvQm1CLEdBcEJKLENBb0JJO0FBQUEsV0FuQm5CQyxjQW1CbUIsR0FuQkYsQ0FtQkU7QUFBQSxXQWpCbEJaLFdBaUJrQixHQWpCWSxJQWlCWjtBQUFBLFdBaEJsQkMsY0FnQmtCLEdBaEJZLEVBZ0JaO0FBQUEsV0FmbEJDLFlBZWtCLEdBZlEsSUFlUjtBQUFBLFdBZGxCVyxPQWNrQixHQWRlLElBY2Y7QUFBQSxXQVRsQkMsUUFTa0I7QUFBQSxXQVJsQkMsTUFRa0IsR0FSVCxLQVFTO0FBQUEsV0FQbEJDLGtCQU9rQixHQVBHLENB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QUNIO0FBQ0o7QUFDSjs7O29DQUVzQm1CLFcsRUFBc0I7QUFDekMsWUFBTUssUUFBUSxHQUFHLEtBQUt6RSxLQUF0QjtBQUVBLGFBQUtBLEtBQUwsR0FBYSxJQUFJb0MsV0FBSixDQUFnQixLQUFLdkIsZUFBckIsQ0FBYjs7QUFFQSxZQUFJNEQsUUFBUSxJQUFJTCxXQUFoQixFQUE2QjtBQUN6QixjQUFNcEUsS0FBSyxHQUFHLEtBQUtBLEtBQW5COztBQUNBLGVBQUssSUFBSWlELENBQUMsR0FBRyxDQUFSLEVBQVd1QixDQUFDLEdBQUdDLFFBQVEsQ0FBQ2pELE1BQTdCLEVBQXFDeUIsQ0FBQyxHQUFHdUIsQ0FBekMsRUFBNEN2QixDQUFDLEVBQTdDLEVBQWlEO0FBQzdDakQsWUFBQUEsS0FBSyxDQUFDaUQsQ0FBRCxDQUFMLEdBQVd3QixRQUFRLENBQUN4QixDQUFELENBQW5CO0FBQ0g7QUFDSjtBQUNKOzs7Ozs7O0FBOU1RdkQsRUFBQUEsVSxDQUNLZ0YsYyxHQUFpQixDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVySW5mbyB9IGZyb20gJy4uLy4uL2dmeC9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYTWVtb3J5VXNhZ2VCaXQgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXJJbmZvLCBHRlhBdHRyaWJ1dGUgfSBmcm9tICcuLi8uLi9nZngvaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuL3VpJztcclxuaW1wb3J0IHsgSW5wdXRBc3NlbWJsZXJIYW5kbGUsIE5VTExfSEFORExFLCBJQVBvb2wgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IGdldEF0dHJpYnV0ZUZvcm1hdEJ5dGVzIH0gZnJvbSAnLi91aS12ZXJ0ZXgtZm9ybWF0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNoQnVmZmVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgT1BBQ0lUWV9PRkZTRVQgPSA4O1xyXG5cclxuICAgIGdldCBhdHRyaWJ1dGVzICgpIHsgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7IH1cclxuICAgIGdldCB2ZXJ0ZXhCdWZmZXJzICgpIHsgcmV0dXJuIHRoaXMuX3ZlcnRleEJ1ZmZlcnM7IH1cclxuICAgIGdldCBpbmRleEJ1ZmZlciAoKSB7IHJldHVybiB0aGlzLl9pbmRleEJ1ZmZlcjsgfVxyXG5cclxuICAgIHB1YmxpYyB2RGF0YTogRmxvYXQzMkFycmF5IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgaURhdGE6IFVpbnQxNkFycmF5IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGJ5dGVTdGFydCA9IDA7XHJcbiAgICBwdWJsaWMgYnl0ZU9mZnNldCA9IDA7XHJcbiAgICBwdWJsaWMgaW5kaWNlc1N0YXJ0ID0gMDtcclxuICAgIHB1YmxpYyBpbmRpY2VzT2Zmc2V0ID0gMDtcclxuICAgIHB1YmxpYyB2ZXJ0ZXhTdGFydCA9IDA7XHJcbiAgICBwdWJsaWMgdmVydGV4T2Zmc2V0ID0gMDtcclxuICAgIHB1YmxpYyBsYXN0Qnl0ZU9mZnNldCA9IDE7XHJcblxyXG4gICAgcHJpdmF0ZSBfYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBudWxsITtcclxuICAgIHByaXZhdGUgX3ZlcnRleEJ1ZmZlcnM6IEdGWEJ1ZmZlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9pbmRleEJ1ZmZlcjogR0ZYQnVmZmVyID0gbnVsbCE7XHJcbiAgICBwcml2YXRlIF9pYUluZm86IEdGWElucHV0QXNzZW1ibGVySW5mbyA9IG51bGwhO1xyXG5cclxuICAgIC8vIE5PVEU6XHJcbiAgICAvLyBhY3R1YWxseSAyNTYgKiA0ICogKHZlcnRleEZvcm1hdC5fYnl0ZXMgLyA0KVxyXG4gICAgLy8gaW5jbHVkZSBwb3MsIHV2LCBjb2xvciBpbiB1aSBhdHRyaWJ1dGVzXHJcbiAgICBwcml2YXRlIF9iYXRjaGVyOiBVSTtcclxuICAgIHByaXZhdGUgX2RpcnR5ID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF92ZXJ0ZXhGb3JtYXRCeXRlcyA9IDA7XHJcbiAgICBwcml2YXRlIF9pbml0VkRhdGFDb3VudCA9IDA7XHJcbiAgICBwcml2YXRlIF9pbml0SURhdGFDb3VudCA9IDI1NiAqIDY7XHJcbiAgICBwcml2YXRlIF9vdXRPZkNhbGxiYWNrOiAoKC4uLmFyZ3M6IG51bWJlcltdKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfaElucHV0QXNzZW1ibGVyczogSW5wdXRBc3NlbWJsZXJIYW5kbGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfbmV4dEZyZWVJQUhhbmRsZSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGJhdGNoZXI6IFVJKSB7XHJcbiAgICAgICAgdGhpcy5fYmF0Y2hlciA9IGJhdGNoZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGF0dHJzOiBHRlhBdHRyaWJ1dGVbXSwgb3V0T2ZDYWxsYmFjazogKCguLi5hcmdzOiBudW1iZXJbXSkgPT4gdm9pZCkgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fb3V0T2ZDYWxsYmFjayA9IG91dE9mQ2FsbGJhY2s7XHJcbiAgICAgICAgY29uc3QgZm9ybWF0Qnl0ZXMgPSBnZXRBdHRyaWJ1dGVGb3JtYXRCeXRlcyhhdHRycyk7XHJcbiAgICAgICAgdGhpcy5fdmVydGV4Rm9ybWF0Qnl0ZXMgPSBmb3JtYXRCeXRlcyAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVDtcclxuICAgICAgICB0aGlzLl9pbml0VkRhdGFDb3VudCA9IDI1NiAqIHRoaXMuX3ZlcnRleEZvcm1hdEJ5dGVzO1xyXG4gICAgICAgIGNvbnN0IHZiU3RyaWRlID0gRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogZm9ybWF0Qnl0ZXM7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnMucHVzaCh0aGlzLl9iYXRjaGVyLmRldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5WRVJURVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICAgICAgdmJTdHJpZGUsXHJcbiAgICAgICAgICAgICAgICB2YlN0cmlkZSxcclxuICAgICAgICAgICAgKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaWJTdHJpZGUgPSBVaW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmluZGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4QnVmZmVyID0gdGhpcy5fYmF0Y2hlci5kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ERVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICAgICAgaWJTdHJpZGUsXHJcbiAgICAgICAgICAgICAgICBpYlN0cmlkZSxcclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cnM7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvID0gbmV3IEdGWElucHV0QXNzZW1ibGVySW5mbyh0aGlzLmF0dHJpYnV0ZXMsIHRoaXMudmVydGV4QnVmZmVycywgdGhpcy5pbmRleEJ1ZmZlcik7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlYWxsb2NCdWZmZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdCAodmVydGV4Q291bnQgPSA0LCBpbmRpY2VzQ291bnQgPSA2KSB7XHJcbiAgICAgICAgdGhpcy5sYXN0Qnl0ZU9mZnNldCA9IHRoaXMuYnl0ZU9mZnNldDtcclxuICAgICAgICBjb25zdCBieXRlT2Zmc2V0ID0gdGhpcy5ieXRlT2Zmc2V0ICsgdmVydGV4Q291bnQgKiB0aGlzLl92ZXJ0ZXhGb3JtYXRCeXRlcztcclxuICAgICAgICBjb25zdCBpbmRpY2VzT2Zmc2V0ID0gdGhpcy5pbmRpY2VzT2Zmc2V0ICsgaW5kaWNlc0NvdW50O1xyXG5cclxuICAgICAgICBpZiAodmVydGV4Q291bnQgKyB0aGlzLnZlcnRleE9mZnNldCA+IDY1NTM1KSB7XHJcbiAgICAgICAgICAgIC8vIG1lcmdlIGxhc3Qgc3RhdGVcclxuICAgICAgICAgICAgdGhpcy5fYmF0Y2hlci5hdXRvTWVyZ2VCYXRjaGVzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vdXRPZkNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRPZkNhbGxiYWNrLmNhbGwodGhpcy5fYmF0Y2hlciwgdmVydGV4Q291bnQsIGluZGljZXNDb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGJ5dGVMZW5ndGggPSB0aGlzLnZEYXRhIS5ieXRlTGVuZ3RoO1xyXG4gICAgICAgIGxldCBpbmRpY2VzTGVuZ3RoID0gdGhpcy5pRGF0YSEubGVuZ3RoO1xyXG4gICAgICAgIGlmIChieXRlT2Zmc2V0ID4gYnl0ZUxlbmd0aCB8fCBpbmRpY2VzT2Zmc2V0ID4gaW5kaWNlc0xlbmd0aCkge1xyXG4gICAgICAgICAgICB3aGlsZSAoYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgfHwgaW5kaWNlc0xlbmd0aCA8IGluZGljZXNPZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRWRGF0YUNvdW50ICo9IDI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0SURhdGFDb3VudCAqPSAyO1xyXG5cclxuICAgICAgICAgICAgICAgIGJ5dGVMZW5ndGggPSB0aGlzLl9pbml0VkRhdGFDb3VudCAqIDQ7XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzTGVuZ3RoID0gdGhpcy5faW5pdElEYXRhQ291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlYWxsb2NCdWZmZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4T2Zmc2V0ICs9IHZlcnRleENvdW50O1xyXG4gICAgICAgIHRoaXMuaW5kaWNlc09mZnNldCArPSBpbmRpY2VzQ291bnQ7XHJcbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gYnl0ZU9mZnNldDtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNldCAoKSB7XHJcbiAgICAgICAgdGhpcy5ieXRlU3RhcnQgPSAwO1xyXG4gICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbmRpY2VzU3RhcnQgPSAwO1xyXG4gICAgICAgIHRoaXMuaW5kaWNlc09mZnNldCA9IDA7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhTdGFydCA9IDA7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhPZmZzZXQgPSAwO1xyXG4gICAgICAgIHRoaXMubGFzdEJ5dGVPZmZzZXQgPSAwO1xyXG4gICAgICAgIHRoaXMuX25leHRGcmVlSUFIYW5kbGUgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gbnVsbCE7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1swXS5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuaW5kZXhCdWZmZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2luZGV4QnVmZmVyID0gbnVsbCE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5faElucHV0QXNzZW1ibGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBJQVBvb2wuZnJlZSh0aGlzLl9oSW5wdXRBc3NlbWJsZXJzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faElucHV0QXNzZW1ibGVycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvcmRCYXRjaCAoKTogSW5wdXRBc3NlbWJsZXJIYW5kbGUge1xyXG4gICAgICAgIGNvbnN0IHZDb3VudCA9IHRoaXMuaW5kaWNlc09mZnNldCAtIHRoaXMuaW5kaWNlc1N0YXJ0O1xyXG4gICAgICAgIGlmICghdkNvdW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBOVUxMX0hBTkRMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9oSW5wdXRBc3NlbWJsZXJzLmxlbmd0aCA8PSB0aGlzLl9uZXh0RnJlZUlBSGFuZGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hJbnB1dEFzc2VtYmxlcnMucHVzaChJQVBvb2wuYWxsb2ModGhpcy5fYmF0Y2hlci5kZXZpY2UsIHRoaXMuX2lhSW5mbykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaElBID0gdGhpcy5faElucHV0QXNzZW1ibGVyc1t0aGlzLl9uZXh0RnJlZUlBSGFuZGxlKytdO1xyXG5cclxuICAgICAgICBjb25zdCBpYSA9IElBUG9vbC5nZXQoaElBKTtcclxuICAgICAgICBpYS5maXJzdEluZGV4ID0gdGhpcy5pbmRpY2VzU3RhcnQ7XHJcbiAgICAgICAgaWEuaW5kZXhDb3VudCA9IHZDb3VudDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhJQTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBsb2FkRGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnl0ZU9mZnNldCA9PT0gMCB8fCAhdGhpcy5fZGlydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmVydGljZXNEYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnZEYXRhIS5idWZmZXIsIDAsIHRoaXMuYnl0ZU9mZnNldCA+PiAyKTtcclxuICAgICAgICBjb25zdCBpbmRpY2VzRGF0YSA9IG5ldyBVaW50MTZBcnJheSh0aGlzLmlEYXRhIS5idWZmZXIsIDAsIHRoaXMuaW5kaWNlc09mZnNldCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJ5dGVPZmZzZXQgPiB0aGlzLnZlcnRleEJ1ZmZlcnNbMF0uc2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbMF0ucmVzaXplKHRoaXMuYnl0ZU9mZnNldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVydGV4QnVmZmVyc1swXS51cGRhdGUodmVydGljZXNEYXRhKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5kaWNlc09mZnNldCAqIDIgPiB0aGlzLmluZGV4QnVmZmVyIS5zaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhCdWZmZXIhLnJlc2l6ZSh0aGlzLmluZGljZXNPZmZzZXQgKiAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmRleEJ1ZmZlciEudXBkYXRlKGluZGljZXNEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZWFsbG9jQnVmZmVyICgpIHtcclxuICAgICAgICB0aGlzLl9yZWFsbG9jVkRhdGEodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fcmVhbGxvY0lEYXRhKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlYWxsb2NWRGF0YSAoY29weU9sZERhdGE6IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgb2xkVkRhdGE7XHJcbiAgICAgICAgaWYgKHRoaXMudkRhdGEpIHtcclxuICAgICAgICAgICAgb2xkVkRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLnZEYXRhLmJ1ZmZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZEYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9pbml0VkRhdGFDb3VudCk7XHJcblxyXG4gICAgICAgIGlmIChvbGRWRGF0YSAmJiBjb3B5T2xkRGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdEYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy52RGF0YS5idWZmZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG9sZFZEYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YVtpXSA9IG9sZFZEYXRhW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlYWxsb2NJRGF0YSAoY29weU9sZERhdGE6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBvbGRJRGF0YSA9IHRoaXMuaURhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuaURhdGEgPSBuZXcgVWludDE2QXJyYXkodGhpcy5faW5pdElEYXRhQ291bnQpO1xyXG5cclxuICAgICAgICBpZiAob2xkSURhdGEgJiYgY29weU9sZERhdGEpIHtcclxuICAgICAgICAgICAgY29uc3QgaURhdGEgPSB0aGlzLmlEYXRhO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG9sZElEYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaURhdGFbaV0gPSBvbGRJRGF0YVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=