(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../gfx/index.js", "../gfx/buffer.js", "../gfx/input-assembler.js", "../renderer/core/memory-pools.js", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../gfx/index.js"), require("../gfx/buffer.js"), require("../gfx/input-assembler.js"), require("../renderer/core/memory-pools.js"), require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.buffer, global.inputAssembler, global.memoryPools, global.define);
    global.instancedBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _buffer, _inputAssembler, _memoryPools, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.InstancedBuffer = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var INITIAL_CAPACITY = 32;
  var MAX_CAPACITY = 1024;

  var InstancedBuffer = /*#__PURE__*/function () {
    _createClass(InstancedBuffer, null, [{
      key: "get",
      value: function get(pass) {
        var extraKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var buffers = InstancedBuffer._buffers;
        if (!buffers.has(pass)) buffers.set(pass, {});
        var record = buffers.get(pass);
        return record[extraKey] || (record[extraKey] = new InstancedBuffer(pass));
      }
    }]);

    function InstancedBuffer(pass) {
      _classCallCheck(this, InstancedBuffer);

      this.instances = [];
      this.hPass = _memoryPools.NULL_HANDLE;
      this.hasPendingModels = false;
      this.dynamicOffsets = [];
      this._device = void 0;
      this._device = pass.device;
      this.hPass = pass.handle;
    }

    _createClass(InstancedBuffer, [{
      key: "destroy",
      value: function destroy() {
        for (var i = 0; i < this.instances.length; ++i) {
          var instance = this.instances[i];
          instance.vb.destroy();
          instance.ia.destroy();
        }

        this.instances.length = 0;
      }
    }, {
      key: "merge",
      value: function merge(subModel, attrs, passIdx) {
        var stride = attrs.buffer.length;

        if (!stride) {
          return;
        } // we assume per-instance attributes are always present


        var sourceIA = subModel.inputAssembler;
        var lightingMap = subModel.descriptorSet.getTexture(_define.UNIFORM_LIGHTMAP_TEXTURE_BINDING);

        var hShader = _memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.SHADER_0 + passIdx);

        var hDescriptorSet = _memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.DESCRIPTOR_SET);

        for (var i = 0; i < this.instances.length; ++i) {
          var instance = this.instances[i];

          if (instance.ia.indexBuffer !== sourceIA.indexBuffer || instance.count >= MAX_CAPACITY) {
            continue;
          } // check same binding


          if (instance.lightingMap !== lightingMap) {
            continue;
          }

          if (instance.stride !== stride) {
            // console.error(`instanced buffer stride mismatch! ${stride}/${instance.stride}`);
            return;
          }

          if (instance.count >= instance.capacity) {
            // resize buffers
            instance.capacity <<= 1;
            var newSize = instance.stride * instance.capacity;
            var oldData = instance.data;
            instance.data = new Uint8Array(newSize);
            instance.data.set(oldData);
            instance.vb.resize(newSize);
          }

          if (instance.hShader !== hShader) {
            instance.hShader = hShader;
          }

          if (instance.hDescriptorSet !== hDescriptorSet) {
            instance.hDescriptorSet = hDescriptorSet;
          }

          instance.data.set(attrs.buffer, instance.stride * instance.count++);
          this.hasPendingModels = true;
          return;
        } // Create a new instance


        var vb = this._device.createBuffer(new _buffer.GFXBufferInfo(_index.GFXBufferUsageBit.VERTEX | _index.GFXBufferUsageBit.TRANSFER_DST, _index.GFXMemoryUsageBit.HOST | _index.GFXMemoryUsageBit.DEVICE, stride * INITIAL_CAPACITY, stride));

        var data = new Uint8Array(stride * INITIAL_CAPACITY);
        var vertexBuffers = sourceIA.vertexBuffers.slice();
        var attributes = sourceIA.attributes.slice();
        var indexBuffer = sourceIA.indexBuffer;

        for (var _i = 0; _i < attrs.list.length; _i++) {
          var attr = attrs.list[_i];
          var newAttr = new _inputAssembler.GFXAttribute(attr.name, attr.format, attr.isNormalized, vertexBuffers.length, true);
          attributes.push(newAttr);
        }

        data.set(attrs.buffer);
        vertexBuffers.push(vb);
        var iaInfo = new _inputAssembler.GFXInputAssemblerInfo(attributes, vertexBuffers, indexBuffer);

        var ia = this._device.createInputAssembler(iaInfo);

        this.instances.push({
          count: 1,
          capacity: INITIAL_CAPACITY,
          vb: vb,
          data: data,
          ia: ia,
          stride: stride,
          hShader: hShader,
          hDescriptorSet: hDescriptorSet,
          lightingMap: lightingMap
        });
        this.hasPendingModels = true;
      }
    }, {
      key: "uploadBuffers",
      value: function uploadBuffers() {
        for (var i = 0; i < this.instances.length; ++i) {
          var instance = this.instances[i];

          if (!instance.count) {
            continue;
          }

          instance.ia.instanceCount = instance.count;
          instance.vb.update(instance.data);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var i = 0; i < this.instances.length; ++i) {
          var instance = this.instances[i];
          instance.count = 0;
        }

        this.hasPendingModels = false;
      }
    }]);

    return InstancedBuffer;
  }();

  _exports.InstancedBuffer = InstancedBuffer;
  InstancedBuffer._buffers = new Map();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvaW5zdGFuY2VkLWJ1ZmZlci50cyJdLCJuYW1lcyI6WyJJTklUSUFMX0NBUEFDSVRZIiwiTUFYX0NBUEFDSVRZIiwiSW5zdGFuY2VkQnVmZmVyIiwicGFzcyIsImV4dHJhS2V5IiwiYnVmZmVycyIsIl9idWZmZXJzIiwiaGFzIiwic2V0IiwicmVjb3JkIiwiZ2V0IiwiaW5zdGFuY2VzIiwiaFBhc3MiLCJOVUxMX0hBTkRMRSIsImhhc1BlbmRpbmdNb2RlbHMiLCJkeW5hbWljT2Zmc2V0cyIsIl9kZXZpY2UiLCJkZXZpY2UiLCJoYW5kbGUiLCJpIiwibGVuZ3RoIiwiaW5zdGFuY2UiLCJ2YiIsImRlc3Ryb3kiLCJpYSIsInN1Yk1vZGVsIiwiYXR0cnMiLCJwYXNzSWR4Iiwic3RyaWRlIiwiYnVmZmVyIiwic291cmNlSUEiLCJpbnB1dEFzc2VtYmxlciIsImxpZ2h0aW5nTWFwIiwiZGVzY3JpcHRvclNldCIsImdldFRleHR1cmUiLCJVTklGT1JNX0xJR0hUTUFQX1RFWFRVUkVfQklORElORyIsImhTaGFkZXIiLCJTdWJNb2RlbFBvb2wiLCJTdWJNb2RlbFZpZXciLCJTSEFERVJfMCIsImhEZXNjcmlwdG9yU2V0IiwiREVTQ1JJUFRPUl9TRVQiLCJpbmRleEJ1ZmZlciIsImNvdW50IiwiY2FwYWNpdHkiLCJuZXdTaXplIiwib2xkRGF0YSIsImRhdGEiLCJVaW50OEFycmF5IiwicmVzaXplIiwiY3JlYXRlQnVmZmVyIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiVkVSVEVYIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwidmVydGV4QnVmZmVycyIsInNsaWNlIiwiYXR0cmlidXRlcyIsImxpc3QiLCJhdHRyIiwibmV3QXR0ciIsIkdGWEF0dHJpYnV0ZSIsIm5hbWUiLCJmb3JtYXQiLCJpc05vcm1hbGl6ZWQiLCJwdXNoIiwiaWFJbmZvIiwiR0ZYSW5wdXRBc3NlbWJsZXJJbmZvIiwiY3JlYXRlSW5wdXRBc3NlbWJsZXIiLCJpbnN0YW5jZUNvdW50IiwidXBkYXRlIiwiTWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxnQkFBZ0IsR0FBRyxFQUF6QjtBQUNBLE1BQU1DLFlBQVksR0FBRyxJQUFyQjs7TUFFYUMsZTs7OzBCQUlVQyxJLEVBQTBCO0FBQUEsWUFBZEMsUUFBYyx1RUFBSCxDQUFHO0FBQ3pDLFlBQU1DLE9BQU8sR0FBR0gsZUFBZSxDQUFDSSxRQUFoQztBQUNBLFlBQUksQ0FBQ0QsT0FBTyxDQUFDRSxHQUFSLENBQVlKLElBQVosQ0FBTCxFQUF3QkUsT0FBTyxDQUFDRyxHQUFSLENBQVlMLElBQVosRUFBa0IsRUFBbEI7QUFDeEIsWUFBTU0sTUFBTSxHQUFHSixPQUFPLENBQUNLLEdBQVIsQ0FBWVAsSUFBWixDQUFmO0FBQ0EsZUFBT00sTUFBTSxDQUFDTCxRQUFELENBQU4sS0FBcUJLLE1BQU0sQ0FBQ0wsUUFBRCxDQUFOLEdBQW1CLElBQUlGLGVBQUosQ0FBb0JDLElBQXBCLENBQXhDLENBQVA7QUFDSDs7O0FBUUQsNkJBQWFBLElBQWIsRUFBeUI7QUFBQTs7QUFBQSxXQU5sQlEsU0FNa0IsR0FOWSxFQU1aO0FBQUEsV0FMbEJDLEtBS2tCLEdBTEVDLHdCQUtGO0FBQUEsV0FKbEJDLGdCQUlrQixHQUpDLEtBSUQ7QUFBQSxXQUhsQkMsY0FHa0IsR0FIUyxFQUdUO0FBQUEsV0FGakJDLE9BRWlCO0FBQ3JCLFdBQUtBLE9BQUwsR0FBZWIsSUFBSSxDQUFDYyxNQUFwQjtBQUNBLFdBQUtMLEtBQUwsR0FBYVQsSUFBSSxDQUFDZSxNQUFsQjtBQUNIOzs7O2dDQUVpQjtBQUNkLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLUixTQUFMLENBQWVTLE1BQW5DLEVBQTJDLEVBQUVELENBQTdDLEVBQWdEO0FBQzVDLGNB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QyxjQUFNRSxRQUFRLEdBQUcsS0FBS1YsU0FBTCxDQUFlUSxDQUFmLENBQWpCO0FBQ0FFLFVBQUFBLFFBQVEsQ0FBQ3NCLEtBQVQsR0FBaUIsQ0FBakI7QUFDSDs7QUFDRCxhQUFLN0IsZ0JBQUwsR0FBd0IsS0FBeEI7QUFDSDs7Ozs7OztBQTNHUVosRUFBQUEsZSxDQUVNSSxRLEdBQVcsSUFBSW9FLEdBQUosRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWE1lbW9yeVVzYWdlQml0LCBHRlhEZXZpY2UsIEdGWFRleHR1cmUgfSBmcm9tICcuLi9nZngnO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlckluZm8gfSBmcm9tICcuLi9nZngvYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIsIEdGWElucHV0QXNzZW1ibGVySW5mbywgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi4vZ2Z4L2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi9yZW5kZXJlcic7XHJcbmltcG9ydCB7IElJbnN0YW5jZWRBdHRyaWJ1dGVCbG9jaywgU3ViTW9kZWwgfSBmcm9tICcuLi9yZW5kZXJlci9zY2VuZSc7XHJcbmltcG9ydCB7IFN1Yk1vZGVsVmlldywgU3ViTW9kZWxQb29sLCBTaGFkZXJIYW5kbGUsIERlc2NyaXB0b3JTZXRIYW5kbGUsIFBhc3NIYW5kbGUsIE5VTExfSEFORExFIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9tZW1vcnktcG9vbHMnO1xyXG5pbXBvcnQgeyBVTklGT1JNX0xJR0hUTUFQX1RFWFRVUkVfQklORElORyB9IGZyb20gJy4vZGVmaW5lJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUluc3RhbmNlZEl0ZW0ge1xyXG4gICAgY291bnQ6IG51bWJlcjtcclxuICAgIGNhcGFjaXR5OiBudW1iZXI7XHJcbiAgICB2YjogR0ZYQnVmZmVyO1xyXG4gICAgZGF0YTogVWludDhBcnJheTtcclxuICAgIGlhOiBHRlhJbnB1dEFzc2VtYmxlcjtcclxuICAgIHN0cmlkZTogbnVtYmVyO1xyXG4gICAgaFNoYWRlcjogU2hhZGVySGFuZGxlO1xyXG4gICAgaERlc2NyaXB0b3JTZXQ6IERlc2NyaXB0b3JTZXRIYW5kbGU7XHJcbiAgICBsaWdodGluZ01hcDogR0ZYVGV4dHVyZTtcclxufVxyXG5cclxuY29uc3QgSU5JVElBTF9DQVBBQ0lUWSA9IDMyO1xyXG5jb25zdCBNQVhfQ0FQQUNJVFkgPSAxMDI0O1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlZEJ1ZmZlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2J1ZmZlcnMgPSBuZXcgTWFwPFBhc3MsIFJlY29yZDxudW1iZXIsIEluc3RhbmNlZEJ1ZmZlcj4+KCk7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgKHBhc3M6IFBhc3MsIGV4dHJhS2V5ID0gMCkge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBJbnN0YW5jZWRCdWZmZXIuX2J1ZmZlcnM7XHJcbiAgICAgICAgaWYgKCFidWZmZXJzLmhhcyhwYXNzKSkgYnVmZmVycy5zZXQocGFzcywge30pO1xyXG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGJ1ZmZlcnMuZ2V0KHBhc3MpITtcclxuICAgICAgICByZXR1cm4gcmVjb3JkW2V4dHJhS2V5XSB8fCAocmVjb3JkW2V4dHJhS2V5XSA9IG5ldyBJbnN0YW5jZWRCdWZmZXIocGFzcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbnN0YW5jZXM6IElJbnN0YW5jZWRJdGVtW10gPSBbXTtcclxuICAgIHB1YmxpYyBoUGFzczogUGFzc0hhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgcHVibGljIGhhc1BlbmRpbmdNb2RlbHMgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBkeW5hbWljT2Zmc2V0czogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChwYXNzOiBQYXNzKSB7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gcGFzcy5kZXZpY2U7XHJcbiAgICAgICAgdGhpcy5oUGFzcyA9IHBhc3MuaGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5zdGFuY2VzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaV07XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnZiLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgaW5zdGFuY2UuaWEuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluc3RhbmNlcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtZXJnZSAoc3ViTW9kZWw6IFN1Yk1vZGVsLCBhdHRyczogSUluc3RhbmNlZEF0dHJpYnV0ZUJsb2NrLCBwYXNzSWR4OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBzdHJpZGUgPSBhdHRycy5idWZmZXIubGVuZ3RoO1xyXG4gICAgICAgIGlmICghc3RyaWRlKSB7IHJldHVybjsgfSAvLyB3ZSBhc3N1bWUgcGVyLWluc3RhbmNlIGF0dHJpYnV0ZXMgYXJlIGFsd2F5cyBwcmVzZW50XHJcbiAgICAgICAgY29uc3Qgc291cmNlSUEgPSBzdWJNb2RlbC5pbnB1dEFzc2VtYmxlcjtcclxuICAgICAgICBjb25zdCBsaWdodGluZ01hcCA9IHN1Yk1vZGVsLmRlc2NyaXB0b3JTZXQuZ2V0VGV4dHVyZShVTklGT1JNX0xJR0hUTUFQX1RFWFRVUkVfQklORElORyk7XHJcbiAgICAgICAgY29uc3QgaFNoYWRlciA9IFN1Yk1vZGVsUG9vbC5nZXQoc3ViTW9kZWwuaGFuZGxlLCBTdWJNb2RlbFZpZXcuU0hBREVSXzAgKyBwYXNzSWR4KSBhcyBTaGFkZXJIYW5kbGU7XHJcbiAgICAgICAgY29uc3QgaERlc2NyaXB0b3JTZXQgPSBTdWJNb2RlbFBvb2wuZ2V0KHN1Yk1vZGVsLmhhbmRsZSwgU3ViTW9kZWxWaWV3LkRFU0NSSVBUT1JfU0VUKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5zdGFuY2VzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5pYS5pbmRleEJ1ZmZlciAhPT0gc291cmNlSUEuaW5kZXhCdWZmZXIgfHwgaW5zdGFuY2UuY291bnQgPj0gTUFYX0NBUEFDSVRZKSB7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgICAgICAvLyBjaGVjayBzYW1lIGJpbmRpbmdcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlLmxpZ2h0aW5nTWFwICE9PSBsaWdodGluZ01hcCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZS5zdHJpZGUgIT09IHN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihgaW5zdGFuY2VkIGJ1ZmZlciBzdHJpZGUgbWlzbWF0Y2ghICR7c3RyaWRlfS8ke2luc3RhbmNlLnN0cmlkZX1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2UuY291bnQgPj0gaW5zdGFuY2UuY2FwYWNpdHkpIHsgLy8gcmVzaXplIGJ1ZmZlcnNcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmNhcGFjaXR5IDw8PSAxO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2l6ZSA9IGluc3RhbmNlLnN0cmlkZSAqIGluc3RhbmNlLmNhcGFjaXR5O1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkRGF0YSA9IGluc3RhbmNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5kYXRhID0gbmV3IFVpbnQ4QXJyYXkobmV3U2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5kYXRhLnNldChvbGREYXRhKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLnZiLnJlc2l6ZShuZXdTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2UuaFNoYWRlciAhPT0gaFNoYWRlcikgeyBpbnN0YW5jZS5oU2hhZGVyID0gaFNoYWRlcjsgfVxyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2UuaERlc2NyaXB0b3JTZXQgIT09IGhEZXNjcmlwdG9yU2V0KSB7IGluc3RhbmNlLmhEZXNjcmlwdG9yU2V0ID0gaERlc2NyaXB0b3JTZXQ7IH1cclxuICAgICAgICAgICAgaW5zdGFuY2UuZGF0YS5zZXQoYXR0cnMuYnVmZmVyLCBpbnN0YW5jZS5zdHJpZGUgKiBpbnN0YW5jZS5jb3VudCsrKTtcclxuICAgICAgICAgICAgdGhpcy5oYXNQZW5kaW5nTW9kZWxzID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlXHJcbiAgICAgICAgY29uc3QgdmIgPSB0aGlzLl9kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5WRVJURVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIHN0cmlkZSAqIElOSVRJQUxfQ0FQQUNJVFksXHJcbiAgICAgICAgICAgIHN0cmlkZSxcclxuICAgICAgICApKTtcclxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoc3RyaWRlICogSU5JVElBTF9DQVBBQ0lUWSk7XHJcbiAgICAgICAgY29uc3QgdmVydGV4QnVmZmVycyA9IHNvdXJjZUlBLnZlcnRleEJ1ZmZlcnMuc2xpY2UoKTtcclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gc291cmNlSUEuYXR0cmlidXRlcy5zbGljZSgpO1xyXG4gICAgICAgIGNvbnN0IGluZGV4QnVmZmVyID0gc291cmNlSUEuaW5kZXhCdWZmZXI7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyID0gYXR0cnMubGlzdFtpXTtcclxuICAgICAgICAgICAgY29uc3QgbmV3QXR0ciA9IG5ldyBHRlhBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLmZvcm1hdCwgYXR0ci5pc05vcm1hbGl6ZWQsIHZlcnRleEJ1ZmZlcnMubGVuZ3RoLCB0cnVlKTtcclxuICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKG5ld0F0dHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRhLnNldChhdHRycy5idWZmZXIpO1xyXG5cclxuICAgICAgICB2ZXJ0ZXhCdWZmZXJzLnB1c2godmIpO1xyXG4gICAgICAgIGNvbnN0IGlhSW5mbyA9IG5ldyBHRlhJbnB1dEFzc2VtYmxlckluZm8oYXR0cmlidXRlcywgdmVydGV4QnVmZmVycywgaW5kZXhCdWZmZXIpO1xyXG4gICAgICAgIGNvbnN0IGlhID0gdGhpcy5fZGV2aWNlLmNyZWF0ZUlucHV0QXNzZW1ibGVyKGlhSW5mbyk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMucHVzaCh7IGNvdW50OiAxLCBjYXBhY2l0eTogSU5JVElBTF9DQVBBQ0lUWSwgdmIsIGRhdGEsIGlhLCBzdHJpZGUsIGhTaGFkZXIsIGhEZXNjcmlwdG9yU2V0LCBsaWdodGluZ01hcH0pO1xyXG4gICAgICAgIHRoaXMuaGFzUGVuZGluZ01vZGVscyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwbG9hZEJ1ZmZlcnMgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pbnN0YW5jZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZS5jb3VudCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBpbnN0YW5jZS5pYS5pbnN0YW5jZUNvdW50ID0gaW5zdGFuY2UuY291bnQ7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnZiLnVwZGF0ZShpbnN0YW5jZS5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5zdGFuY2VzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbaV07XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmNvdW50ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5oYXNQZW5kaW5nTW9kZWxzID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuIl19