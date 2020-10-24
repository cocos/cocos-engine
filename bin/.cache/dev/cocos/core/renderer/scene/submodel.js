(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../pipeline/define.js", "../core/memory-pools.js", "../../gfx/index.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../pipeline/define.js"), require("../core/memory-pools.js"), require("../../gfx/index.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.memoryPools, global.index, global.globalExports);
    global.submodel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _memoryPools, _index, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SubModel = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _dsInfo = new _index.GFXDescriptorSetInfo(null);

  var SubModel = /*#__PURE__*/function () {
    function SubModel() {
      _classCallCheck(this, SubModel);

      this._device = null;
      this._passes = null;
      this._subMesh = null;
      this._patches = null;
      this._handle = _memoryPools.NULL_HANDLE;
      this._priority = _define.RenderPriority.DEFAULT;
      this._inputAssembler = null;
      this._descriptorSet = null;
    }

    _createClass(SubModel, [{
      key: "initialize",
      value: function initialize(subMesh, passes) {
        var patches = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        this._device = _globalExports.legacyCC.director.root.device;
        this._subMesh = subMesh;
        this._patches = patches;
        this._passes = passes;
        this._handle = _memoryPools.SubModelPool.alloc();

        this._flushPassInfo();

        _dsInfo.layout = passes[0].setLayouts[_define.SetIndex.LOCAL];

        var dsHandle = _memoryPools.DSPool.alloc(this._device, _dsInfo);

        var iaHandle = _memoryPools.IAPool.alloc(this._device, subMesh.iaInfo);

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.PRIORITY, _define.RenderPriority.DEFAULT);

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.INPUT_ASSEMBLER, iaHandle);

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.DESCRIPTOR_SET, dsHandle);

        this._inputAssembler = _memoryPools.IAPool.get(iaHandle);
        this._descriptorSet = _memoryPools.DSPool.get(dsHandle);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _memoryPools.DSPool.free(_memoryPools.SubModelPool.get(this._handle, _memoryPools.SubModelView.DESCRIPTOR_SET));

        _memoryPools.IAPool.free(_memoryPools.SubModelPool.get(this._handle, _memoryPools.SubModelView.INPUT_ASSEMBLER));

        _memoryPools.SubModelPool.free(this._handle);

        this._descriptorSet = null;
        this._inputAssembler = null;
        this._priority = _define.RenderPriority.DEFAULT;
        this._handle = _memoryPools.NULL_HANDLE;
        this._patches = null;
        this._subMesh = null;
        this._passes = null;
      }
    }, {
      key: "update",
      value: function update() {
        for (var i = 0; i < this._passes.length; ++i) {
          var pass = this._passes[i];
          pass.update();
        }

        this._descriptorSet.update();
      }
    }, {
      key: "onPipelineStateChanged",
      value: function onPipelineStateChanged() {
        var passes = this._passes;

        if (!passes) {
          return;
        }

        for (var i = 0; i < passes.length; i++) {
          var pass = passes[i];
          pass.beginChangeStatesSilently();
          pass.tryCompile(); // force update shaders

          pass.endChangeStatesSilently();
        }

        this._flushPassInfo();
      }
    }, {
      key: "_flushPassInfo",
      value: function _flushPassInfo() {
        var passes = this._passes;

        if (!passes) {
          return;
        }

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.PASS_COUNT, passes.length);

        var passOffset = _memoryPools.SubModelView.PASS_0;
        var shaderOffset = _memoryPools.SubModelView.SHADER_0;

        for (var i = 0; i < passes.length; i++, passOffset++, shaderOffset++) {
          _memoryPools.SubModelPool.set(this._handle, passOffset, passes[i].handle);

          _memoryPools.SubModelPool.set(this._handle, shaderOffset, passes[i].getShaderVariant(this._patches));
        }
      }
    }, {
      key: "passes",
      set: function set(passes) {
        this._passes = passes;

        this._flushPassInfo();
      },
      get: function get() {
        return this._passes;
      }
    }, {
      key: "subMesh",
      set: function set(subMesh) {
        this._subMesh = subMesh;

        this._inputAssembler.destroy();

        this._inputAssembler.initialize(subMesh.iaInfo);
      },
      get: function get() {
        return this._subMesh;
      }
    }, {
      key: "priority",
      set: function set(val) {
        this._priority = val;

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.PRIORITY, val);
      },
      get: function get() {
        return this._priority;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }, {
      key: "inputAssembler",
      get: function get() {
        return this._inputAssembler;
      }
    }, {
      key: "descriptorSet",
      get: function get() {
        return this._descriptorSet;
      }
    }]);

    return SubModel;
  }();

  _exports.SubModel = SubModel;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvc3VibW9kZWwudHMiXSwibmFtZXMiOlsiX2RzSW5mbyIsIkdGWERlc2NyaXB0b3JTZXRJbmZvIiwiU3ViTW9kZWwiLCJfZGV2aWNlIiwiX3Bhc3NlcyIsIl9zdWJNZXNoIiwiX3BhdGNoZXMiLCJfaGFuZGxlIiwiTlVMTF9IQU5ETEUiLCJfcHJpb3JpdHkiLCJSZW5kZXJQcmlvcml0eSIsIkRFRkFVTFQiLCJfaW5wdXRBc3NlbWJsZXIiLCJfZGVzY3JpcHRvclNldCIsInN1Yk1lc2giLCJwYXNzZXMiLCJwYXRjaGVzIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJkZXZpY2UiLCJTdWJNb2RlbFBvb2wiLCJhbGxvYyIsIl9mbHVzaFBhc3NJbmZvIiwibGF5b3V0Iiwic2V0TGF5b3V0cyIsIlNldEluZGV4IiwiTE9DQUwiLCJkc0hhbmRsZSIsIkRTUG9vbCIsImlhSGFuZGxlIiwiSUFQb29sIiwiaWFJbmZvIiwic2V0IiwiU3ViTW9kZWxWaWV3IiwiUFJJT1JJVFkiLCJJTlBVVF9BU1NFTUJMRVIiLCJERVNDUklQVE9SX1NFVCIsImdldCIsImZyZWUiLCJpIiwibGVuZ3RoIiwicGFzcyIsInVwZGF0ZSIsImJlZ2luQ2hhbmdlU3RhdGVzU2lsZW50bHkiLCJ0cnlDb21waWxlIiwiZW5kQ2hhbmdlU3RhdGVzU2lsZW50bHkiLCJQQVNTX0NPVU5UIiwicGFzc09mZnNldCIsIlBBU1NfMCIsInNoYWRlck9mZnNldCIsIlNIQURFUl8wIiwiaGFuZGxlIiwiZ2V0U2hhZGVyVmFyaWFudCIsImRlc3Ryb3kiLCJpbml0aWFsaXplIiwidmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLE1BQU1BLE9BQU8sR0FBRyxJQUFJQywyQkFBSixDQUF5QixJQUF6QixDQUFoQjs7TUFFYUMsUTs7OztXQUVDQyxPLEdBQTRCLEk7V0FDNUJD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QlMsT0FBaEI7O0FBQ0EsYUFBS0YsZUFBTCxDQUFzQjBDLE9BQXRCOztBQUNBLGFBQUsxQyxlQUFMLENBQXNCMkMsVUFBdEIsQ0FBaUN6QyxPQUFPLENBQUNrQixNQUF6QztBQUNILE87MEJBRWM7QUFDWCxlQUFPLEtBQUszQixRQUFaO0FBQ0g7Ozt3QkFFYW1ELEcsRUFBSztBQUNmLGFBQUsvQyxTQUFMLEdBQWlCK0MsR0FBakI7O0FBQ0FuQyxrQ0FBYVksR0FBYixDQUFpQixLQUFLMUIsT0FBdEIsRUFBK0IyQiwwQkFBYUMsUUFBNUMsRUFBc0RxQixHQUF0RDtBQUNILE87MEJBRWU7QUFDWixlQUFPLEtBQUsvQyxTQUFaO0FBQ0g7OzswQkFFYTtBQUNWLGVBQU8sS0FBS0YsT0FBWjtBQUNIOzs7MEJBRXFCO0FBQ2xCLGVBQU8sS0FBS0ssZUFBWjtBQUNIOzs7MEJBRW9CO0FBQ2pCLGVBQU8sS0FBS0MsY0FBWjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVuZGVyaW5nU3ViTWVzaCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWElucHV0QXNzZW1ibGVyIH0gZnJvbSAnLi4vLi4vZ2Z4L2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFJlbmRlclByaW9yaXR5LCBTZXRJbmRleCB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IElNYWNyb1BhdGNoLCBQYXNzIH0gZnJvbSAnLi4vY29yZS9wYXNzJztcclxuaW1wb3J0IHsgRFNQb29sLCBJQVBvb2wsIFN1Yk1vZGVsUG9vbCwgU3ViTW9kZWxWaWV3LCBTdWJNb2RlbEhhbmRsZSwgTlVMTF9IQU5ETEUgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXQsIEdGWERlc2NyaXB0b3JTZXRJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBfZHNJbmZvID0gbmV3IEdGWERlc2NyaXB0b3JTZXRJbmZvKG51bGwhKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdWJNb2RlbCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXZpY2U6IEdGWERldmljZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9wYXNzZXM6IFBhc3NbXSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9zdWJNZXNoOiBSZW5kZXJpbmdTdWJNZXNoIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3BhdGNoZXM6IElNYWNyb1BhdGNoW10gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2hhbmRsZTogU3ViTW9kZWxIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuICAgIHByb3RlY3RlZCBfcHJpb3JpdHk6IFJlbmRlclByaW9yaXR5ID0gUmVuZGVyUHJpb3JpdHkuREVGQVVMVDtcclxuICAgIHByb3RlY3RlZCBfaW5wdXRBc3NlbWJsZXI6IEdGWElucHV0QXNzZW1ibGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2Rlc2NyaXB0b3JTZXQ6IEdGWERlc2NyaXB0b3JTZXQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBzZXQgcGFzc2VzIChwYXNzZXMpIHtcclxuICAgICAgICB0aGlzLl9wYXNzZXMgPSBwYXNzZXM7XHJcbiAgICAgICAgdGhpcy5fZmx1c2hQYXNzSW5mbygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXNzZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXNzZXMhO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdWJNZXNoIChzdWJNZXNoKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViTWVzaCA9IHN1Yk1lc2g7XHJcbiAgICAgICAgdGhpcy5faW5wdXRBc3NlbWJsZXIhLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9pbnB1dEFzc2VtYmxlciEuaW5pdGlhbGl6ZShzdWJNZXNoLmlhSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN1Yk1lc2ggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJNZXNoITtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcHJpb3JpdHkgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3ByaW9yaXR5ID0gdmFsO1xyXG4gICAgICAgIFN1Yk1vZGVsUG9vbC5zZXQodGhpcy5faGFuZGxlLCBTdWJNb2RlbFZpZXcuUFJJT1JJVFksIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByaW9yaXR5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJpb3JpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhhbmRsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5wdXRBc3NlbWJsZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnB1dEFzc2VtYmxlciE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlc2NyaXB0b3JTZXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yU2V0ITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoc3ViTWVzaDogUmVuZGVyaW5nU3ViTWVzaCwgcGFzc2VzOiBQYXNzW10sIHBhdGNoZXM6IElNYWNyb1BhdGNoW10gfCBudWxsID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuZGV2aWNlIGFzIEdGWERldmljZTtcclxuXHJcbiAgICAgICAgdGhpcy5fc3ViTWVzaCA9IHN1Yk1lc2g7XHJcbiAgICAgICAgdGhpcy5fcGF0Y2hlcyA9IHBhdGNoZXM7XHJcbiAgICAgICAgdGhpcy5fcGFzc2VzID0gcGFzc2VzO1xyXG5cclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSBTdWJNb2RlbFBvb2wuYWxsb2MoKTtcclxuICAgICAgICB0aGlzLl9mbHVzaFBhc3NJbmZvKCk7XHJcblxyXG4gICAgICAgIF9kc0luZm8ubGF5b3V0ID0gcGFzc2VzWzBdLnNldExheW91dHNbU2V0SW5kZXguTE9DQUxdO1xyXG4gICAgICAgIGNvbnN0IGRzSGFuZGxlID0gRFNQb29sLmFsbG9jKHRoaXMuX2RldmljZSwgX2RzSW5mbyk7XHJcbiAgICAgICAgY29uc3QgaWFIYW5kbGUgPSBJQVBvb2wuYWxsb2ModGhpcy5fZGV2aWNlLCBzdWJNZXNoLmlhSW5mbyk7XHJcbiAgICAgICAgU3ViTW9kZWxQb29sLnNldCh0aGlzLl9oYW5kbGUsIFN1Yk1vZGVsVmlldy5QUklPUklUWSwgUmVuZGVyUHJpb3JpdHkuREVGQVVMVCk7XHJcbiAgICAgICAgU3ViTW9kZWxQb29sLnNldCh0aGlzLl9oYW5kbGUsIFN1Yk1vZGVsVmlldy5JTlBVVF9BU1NFTUJMRVIsIGlhSGFuZGxlKTtcclxuICAgICAgICBTdWJNb2RlbFBvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU3ViTW9kZWxWaWV3LkRFU0NSSVBUT1JfU0VULCBkc0hhbmRsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lucHV0QXNzZW1ibGVyID0gSUFQb29sLmdldChpYUhhbmRsZSk7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldCA9IERTUG9vbC5nZXQoZHNIYW5kbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBEU1Bvb2wuZnJlZShTdWJNb2RlbFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgU3ViTW9kZWxWaWV3LkRFU0NSSVBUT1JfU0VUKSk7XHJcbiAgICAgICAgSUFQb29sLmZyZWUoU3ViTW9kZWxQb29sLmdldCh0aGlzLl9oYW5kbGUsIFN1Yk1vZGVsVmlldy5JTlBVVF9BU1NFTUJMRVIpKTtcclxuICAgICAgICBTdWJNb2RlbFBvb2wuZnJlZSh0aGlzLl9oYW5kbGUpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9pbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSBSZW5kZXJQcmlvcml0eS5ERUZBVUxUO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXRjaGVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9zdWJNZXNoID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wYXNzZXMgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcGFzc2VzIS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXNzID0gdGhpcy5fcGFzc2VzIVtpXTtcclxuICAgICAgICAgICAgcGFzcy51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldCEudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUGlwZWxpbmVTdGF0ZUNoYW5nZWQgKCkge1xyXG4gICAgICAgIGNvbnN0IHBhc3NlcyA9IHRoaXMuX3Bhc3NlcztcclxuICAgICAgICBpZiAoIXBhc3NlcykgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcGFzcyA9IHBhc3Nlc1tpXTtcclxuICAgICAgICAgICAgcGFzcy5iZWdpbkNoYW5nZVN0YXRlc1NpbGVudGx5KCk7XHJcbiAgICAgICAgICAgIHBhc3MudHJ5Q29tcGlsZSgpOyAvLyBmb3JjZSB1cGRhdGUgc2hhZGVyc1xyXG4gICAgICAgICAgICBwYXNzLmVuZENoYW5nZVN0YXRlc1NpbGVudGx5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9mbHVzaFBhc3NJbmZvKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9mbHVzaFBhc3NJbmZvICgpIHtcclxuICAgICAgICBjb25zdCBwYXNzZXMgPSB0aGlzLl9wYXNzZXM7XHJcbiAgICAgICAgaWYgKCFwYXNzZXMpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIFN1Yk1vZGVsUG9vbC5zZXQodGhpcy5faGFuZGxlLCBTdWJNb2RlbFZpZXcuUEFTU19DT1VOVCwgcGFzc2VzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHBhc3NPZmZzZXQgPSBTdWJNb2RlbFZpZXcuUEFTU18wIGFzIGNvbnN0O1xyXG4gICAgICAgIGxldCBzaGFkZXJPZmZzZXQgPSBTdWJNb2RlbFZpZXcuU0hBREVSXzAgYXMgY29uc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXNzZXMubGVuZ3RoOyBpKyssIHBhc3NPZmZzZXQrKywgc2hhZGVyT2Zmc2V0KyspIHtcclxuICAgICAgICAgICAgU3ViTW9kZWxQb29sLnNldCh0aGlzLl9oYW5kbGUsIHBhc3NPZmZzZXQsIHBhc3Nlc1tpXS5oYW5kbGUpO1xyXG4gICAgICAgICAgICBTdWJNb2RlbFBvb2wuc2V0KHRoaXMuX2hhbmRsZSwgc2hhZGVyT2Zmc2V0LCBwYXNzZXNbaV0uZ2V0U2hhZGVyVmFyaWFudCh0aGlzLl9wYXRjaGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==