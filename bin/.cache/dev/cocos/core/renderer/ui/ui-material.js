(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/material.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/material.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.material, global.memoryPools);
    global.uiMaterial = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _material, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIMaterial = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var UIMaterial = /*#__PURE__*/function () {
    function UIMaterial() {
      _classCallCheck(this, UIMaterial);

      this._material = null;
      this._pass = null;
      this._hDescriptorSet = _memoryPools.NULL_HANDLE;
      this._refCount = 0;
    }

    _createClass(UIMaterial, [{
      key: "initialize",
      value: function initialize(info) {
        if (!info.material) {
          return false;
        }

        this._material = new _material.Material();

        this._material.copy(info.material);

        this._pass = this._material.passes[0];

        this._pass.update();

        this._hDescriptorSet = _memoryPools.PassPool.get(this._pass.handle, _memoryPools.PassView.DESCRIPTOR_SET);
        return true;
      }
    }, {
      key: "increase",
      value: function increase() {
        this._refCount++;
        return this._refCount;
      }
    }, {
      key: "decrease",
      value: function decrease() {
        this._refCount--;

        if (this._refCount === 0) {
          this.destroy();
        }

        return this._refCount;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._material) {
          this._material.destroy();

          this._material = null;
        }

        this._refCount = 0;
      }
    }, {
      key: "material",
      get: function get() {
        return this._material;
      }
    }, {
      key: "pass",
      get: function get() {
        return this._pass;
      }
    }, {
      key: "hDescriptorSet",
      get: function get() {
        return this._hDescriptorSet;
      }
    }]);

    return UIMaterial;
  }();

  _exports.UIMaterial = UIMaterial;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvdWktbWF0ZXJpYWwudHMiXSwibmFtZXMiOlsiVUlNYXRlcmlhbCIsIl9tYXRlcmlhbCIsIl9wYXNzIiwiX2hEZXNjcmlwdG9yU2V0IiwiTlVMTF9IQU5ETEUiLCJfcmVmQ291bnQiLCJpbmZvIiwibWF0ZXJpYWwiLCJNYXRlcmlhbCIsImNvcHkiLCJwYXNzZXMiLCJ1cGRhdGUiLCJQYXNzUG9vbCIsImdldCIsImhhbmRsZSIsIlBhc3NWaWV3IiwiREVTQ1JJUFRPUl9TRVQiLCJkZXN0cm95Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW9DYUEsVTs7OztXQUVDQyxTLEdBQTZCLEk7V0FDN0JDLEssR0FBcUIsSTtXQUNyQkMsZSxHQUF1Q0Msd0I7V0FFekNDLFMsR0FBb0IsQzs7Ozs7aUNBY1RDLEksRUFBZ0M7QUFFL0MsWUFBSSxDQUFDQSxJQUFJLENBQUNDLFFBQVYsRUFBb0I7QUFDaEIsaUJBQU8sS0FBUDtBQUNIOztBQUVELGFBQUtOLFNBQUwsR0FBaUIsSUFBSU8sa0JBQUosRUFBakI7O0FBRUEsYUFBS1AsU0FBTCxDQUFlUSxJQUFmLENBQW9CSCxJQUFJLENBQUNDLFFBQXpCOztBQUVBLGFBQUtMLEtBQUwsR0FBYSxLQUFLRCxTQUFMLENBQWVTLE1BQWYsQ0FBc0IsQ0FBdEIsQ0FBYjs7QUFDQSxhQUFLUixLQUFMLENBQVdTLE1BQVg7O0FBRUEsYUFBS1IsZUFBTCxHQUF1QlMsc0JBQVNDLEdBQVQsQ0FBYSxLQUFLWCxLQUFMLENBQVlZLE1BQXpCLEVBQWlDQyxzQkFBU0MsY0FBMUMsQ0FBdkI7QUFFQSxlQUFPLElBQVA7QUFDSDs7O2lDQUVrQjtBQUNmLGFBQUtYLFNBQUw7QUFDQSxlQUFPLEtBQUtBLFNBQVo7QUFDSDs7O2lDQUVrQjtBQUNmLGFBQUtBLFNBQUw7O0FBQ0EsWUFBSSxLQUFLQSxTQUFMLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3RCLGVBQUtZLE9BQUw7QUFDSDs7QUFDRCxlQUFPLEtBQUtaLFNBQVo7QUFDSDs7O2dDQUVpQjtBQUNkLFlBQUksS0FBS0osU0FBVCxFQUFvQjtBQUNoQixlQUFLQSxTQUFMLENBQWVnQixPQUFmOztBQUNBLGVBQUtoQixTQUFMLEdBQWlCLElBQWpCO0FBQ0g7O0FBQ0QsYUFBS0ksU0FBTCxHQUFpQixDQUFqQjtBQUNIOzs7MEJBakRlO0FBQ1osZUFBTyxLQUFLSixTQUFaO0FBQ0g7OzswQkFFVztBQUNSLGVBQU8sS0FBS0MsS0FBWjtBQUNIOzs7MEJBRXFCO0FBQ2xCLGVBQU8sS0FBS0MsZUFBWjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgUGFzcyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IFBhc3NWaWV3LCBQYXNzUG9vbCwgRGVzY3JpcHRvclNldEhhbmRsZSwgTlVMTF9IQU5ETEUgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElVSU1hdGVyaWFsSW5mbyB7XHJcbiAgICBtYXRlcmlhbDogTWF0ZXJpYWw7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVSU1hdGVyaWFsIHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX21hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9wYXNzOiBQYXNzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2hEZXNjcmlwdG9yU2V0OiBEZXNjcmlwdG9yU2V0SGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVmQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgZ2V0IG1hdGVyaWFsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWwhO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXNzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFzcyE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhEZXNjcmlwdG9yU2V0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faERlc2NyaXB0b3JTZXQhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJVUlNYXRlcmlhbEluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgaWYgKCFpbmZvLm1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsLmNvcHkoaW5mby5tYXRlcmlhbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3Bhc3MgPSB0aGlzLl9tYXRlcmlhbC5wYXNzZXNbMF07XHJcbiAgICAgICAgdGhpcy5fcGFzcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5faERlc2NyaXB0b3JTZXQgPSBQYXNzUG9vbC5nZXQodGhpcy5fcGFzcyEuaGFuZGxlLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbmNyZWFzZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fcmVmQ291bnQrKztcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVmQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlY3JlYXNlICgpIHtcclxuICAgICAgICB0aGlzLl9yZWZDb3VudC0tO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZWZDb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZkNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlZkNvdW50ID0gMDtcclxuICAgIH1cclxufVxyXG4iXX0=