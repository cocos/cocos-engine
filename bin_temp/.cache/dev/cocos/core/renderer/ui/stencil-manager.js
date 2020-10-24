(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define);
    global.stencilManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StencilManager = _exports.Stage = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // Stage types
  var Stage;
  _exports.Stage = Stage;

  (function (Stage) {
    Stage[Stage["DISABLED"] = 0] = "DISABLED";
    Stage[Stage["CLEAR"] = 1] = "CLEAR";
    Stage[Stage["ENTER_LEVEL"] = 2] = "ENTER_LEVEL";
    Stage[Stage["ENABLED"] = 3] = "ENABLED";
    Stage[Stage["EXIT_LEVEL"] = 4] = "EXIT_LEVEL";
  })(Stage || (_exports.Stage = Stage = {}));

  var StencilManager = /*#__PURE__*/function () {
    function StencilManager() {
      _classCallCheck(this, StencilManager);

      this.stage = Stage.DISABLED;
      this._maskStack = [];
      this._stencilPattern = {
        stencilTest: true,
        func: _define.GFXComparisonFunc.ALWAYS,
        stencilMask: 0xffff,
        writeMask: 0xffff,
        failOp: _define.GFXStencilOp.KEEP,
        zFailOp: _define.GFXStencilOp.KEEP,
        passOp: _define.GFXStencilOp.KEEP,
        ref: 1
      };
    }

    _createClass(StencilManager, [{
      key: "pushMask",
      value: function pushMask(mask) {
        this._maskStack.push(mask);
      }
    }, {
      key: "clear",
      value: function clear() {
        this.stage = Stage.CLEAR;
      }
    }, {
      key: "enterLevel",
      value: function enterLevel() {
        this.stage = Stage.ENTER_LEVEL;
      }
    }, {
      key: "enableMask",
      value: function enableMask() {
        this.stage = Stage.ENABLED;
      }
    }, {
      key: "exitMask",
      value: function exitMask() {
        if (this._maskStack.length === 0) {
          // cc.errorID(9001);
          return;
        }

        this._maskStack.pop();

        if (this._maskStack.length === 0) {
          this.stage = Stage.DISABLED;
        } else {
          this.stage = Stage.ENABLED;
        }
      }
    }, {
      key: "handleMaterial",
      value: function handleMaterial(mat) {
        var pattern = this._stencilPattern;

        if (this.stage === Stage.DISABLED) {
          pattern.stencilTest = false;
          pattern.func = _define.GFXComparisonFunc.ALWAYS;
          pattern.failOp = _define.GFXStencilOp.KEEP;
          pattern.stencilMask = pattern.writeMask = 0xffff;
          pattern.ref = 1;
        } else {
          pattern.stencilTest = true;

          if (this.stage === Stage.ENABLED) {
            pattern.func = _define.GFXComparisonFunc.EQUAL;
            pattern.failOp = _define.GFXStencilOp.KEEP;
            pattern.stencilMask = pattern.ref = this.getStencilRef();
            pattern.writeMask = this.getWriteMask();
          } else if (this.stage === Stage.CLEAR) {
            var mask = this._maskStack[this._maskStack.length - 1];
            pattern.func = _define.GFXComparisonFunc.NEVER;
            pattern.failOp = mask.inverted ? _define.GFXStencilOp.REPLACE : _define.GFXStencilOp.ZERO;
            pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
          } else if (this.stage === Stage.ENTER_LEVEL) {
            var _mask = this._maskStack[this._maskStack.length - 1];
            pattern.func = _define.GFXComparisonFunc.NEVER;
            pattern.failOp = _mask.inverted ? _define.GFXStencilOp.ZERO : _define.GFXStencilOp.REPLACE;
            pattern.writeMask = pattern.stencilMask = pattern.ref = this.getWriteMask();
          }
        }

        return this._changed(mat.passes[0]);
      }
    }, {
      key: "getWriteMask",
      value: function getWriteMask() {
        return 1 << this._maskStack.length - 1;
      }
    }, {
      key: "getExitWriteMask",
      value: function getExitWriteMask() {
        return 1 << this._maskStack.length;
      }
    }, {
      key: "getStencilRef",
      value: function getStencilRef() {
        var result = 0;

        for (var i = 0; i < this._maskStack.length; ++i) {
          result += 0x00000001 << i;
        }

        return result;
      }
    }, {
      key: "reset",
      value: function reset() {
        // reset stack and stage
        this._maskStack.length = 0;
        this.stage = Stage.DISABLED;
      }
    }, {
      key: "_changed",
      value: function _changed(pass) {
        var stencilState = pass.depthStencilState;
        var pattern = this._stencilPattern;

        if (pattern.stencilTest !== stencilState.stencilTestFront || pattern.func !== stencilState.stencilFuncFront || pattern.failOp !== stencilState.stencilFailOpFront || pattern.zFailOp !== stencilState.stencilZFailOpFront || pattern.passOp !== stencilState.stencilPassOpFront || pattern.stencilMask !== stencilState.stencilReadMaskFront || pattern.writeMask !== stencilState.stencilWriteMaskFront || pattern.ref !== stencilState.stencilRefFront) {
          return true;
        }

        return false;
      }
    }, {
      key: "pattern",
      get: function get() {
        return this._stencilPattern;
      }
    }]);

    return StencilManager;
  }();

  _exports.StencilManager = StencilManager;
  StencilManager.sharedManager = null;
  StencilManager.sharedManager = new StencilManager();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvc3RlbmNpbC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbIlN0YWdlIiwiU3RlbmNpbE1hbmFnZXIiLCJzdGFnZSIsIkRJU0FCTEVEIiwiX21hc2tTdGFjayIsIl9zdGVuY2lsUGF0dGVybiIsInN0ZW5jaWxUZXN0IiwiZnVuYyIsIkdGWENvbXBhcmlzb25GdW5jIiwiQUxXQVlTIiwic3RlbmNpbE1hc2siLCJ3cml0ZU1hc2siLCJmYWlsT3AiLCJHRlhTdGVuY2lsT3AiLCJLRUVQIiwiekZhaWxPcCIsInBhc3NPcCIsInJlZiIsIm1hc2siLCJwdXNoIiwiQ0xFQVIiLCJFTlRFUl9MRVZFTCIsIkVOQUJMRUQiLCJsZW5ndGgiLCJwb3AiLCJtYXQiLCJwYXR0ZXJuIiwiRVFVQUwiLCJnZXRTdGVuY2lsUmVmIiwiZ2V0V3JpdGVNYXNrIiwiTkVWRVIiLCJpbnZlcnRlZCIsIlJFUExBQ0UiLCJaRVJPIiwiX2NoYW5nZWQiLCJwYXNzZXMiLCJyZXN1bHQiLCJpIiwicGFzcyIsInN0ZW5jaWxTdGF0ZSIsImRlcHRoU3RlbmNpbFN0YXRlIiwic3RlbmNpbFRlc3RGcm9udCIsInN0ZW5jaWxGdW5jRnJvbnQiLCJzdGVuY2lsRmFpbE9wRnJvbnQiLCJzdGVuY2lsWkZhaWxPcEZyb250Iiwic3RlbmNpbFBhc3NPcEZyb250Iiwic3RlbmNpbFJlYWRNYXNrRnJvbnQiLCJzdGVuY2lsV3JpdGVNYXNrRnJvbnQiLCJzdGVuY2lsUmVmRnJvbnQiLCJzaGFyZWRNYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQTtNQUNZQSxLOzs7YUFBQUEsSztBQUFBQSxJQUFBQSxLLENBQUFBLEs7QUFBQUEsSUFBQUEsSyxDQUFBQSxLO0FBQUFBLElBQUFBLEssQ0FBQUEsSztBQUFBQSxJQUFBQSxLLENBQUFBLEs7QUFBQUEsSUFBQUEsSyxDQUFBQSxLO0tBQUFB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SDs7OzhCQUVlO0FBQ1o7QUFDQSxhQUFLaEMsVUFBTCxDQUFnQm1CLE1BQWhCLEdBQXlCLENBQXpCO0FBQ0EsYUFBS3JCLEtBQUwsR0FBYUYsS0FBSyxDQUFDRyxRQUFuQjtBQUNIOzs7K0JBRWlCbUMsSSxFQUFZO0FBQzFCLFlBQU1DLFlBQVksR0FBR0QsSUFBSSxDQUFDRSxpQkFBMUI7QUFDQSxZQUFNZCxPQUFPLEdBQUcsS0FBS3JCLGVBQXJCOztBQUNBLFlBQUlxQixPQUFPLENBQUNwQixXQUFSLEtBQXdCaUMsWUFBWSxDQUFDRSxnQkFBckMsSUFDQWYsT0FBTyxDQUFDbkIsSUFBUixLQUFpQmdDLFlBQVksQ0FBQ0csZ0JBRDlCLElBRUFoQixPQUFPLENBQUNkLE1BQVIsS0FBbUIyQixZQUFZLENBQUNJLGtCQUZoQyxJQUdBakIsT0FBTyxDQUFDWCxPQUFSLEtBQW9Cd0IsWUFBWSxDQUFDSyxtQkFIakMsSUFJQWxCLE9BQU8sQ0FBQ1YsTUFBUixLQUFtQnVCLFlBQVksQ0FBQ00sa0JBSmhDLElBS0FuQixPQUFPLENBQUNoQixXQUFSLEtBQXdCNkIsWUFBWSxDQUFDTyxvQkFMckMsSUFNQXBCLE9BQU8sQ0FBQ2YsU0FBUixLQUFzQjRCLFlBQVksQ0FBQ1EscUJBTm5DLElBT0FyQixPQUFPLENBQUNULEdBQVIsS0FBZ0JzQixZQUFZLENBQUNTLGVBUGpDLEVBT2tEO0FBQzlDLGlCQUFPLElBQVA7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSDs7OzBCQXRHYztBQUNYLGVBQU8sS0FBSzNDLGVBQVo7QUFDSDs7Ozs7OztBQWpCUUosRUFBQUEsYyxDQUNLZ0QsYSxHQUF1QyxJO0FBdUh6RGhELEVBQUFBLGNBQWMsQ0FBQ2dELGFBQWYsR0FBK0IsSUFBSWhELGNBQUosRUFBL0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBHRlhDb21wYXJpc29uRnVuYywgR0ZYU3RlbmNpbE9wIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi9jb3JlL3Bhc3MnO1xyXG5cclxuLy8gU3RhZ2UgdHlwZXNcclxuZXhwb3J0IGVudW0gU3RhZ2Uge1xyXG4gICAgLy8gU3RlbmNpbCBkaXNhYmxlZFxyXG4gICAgRElTQUJMRUQgPSAwLFxyXG4gICAgLy8gQ2xlYXIgc3RlbmNpbCBidWZmZXJcclxuICAgIENMRUFSID0gMSxcclxuICAgIC8vIEVudGVyaW5nIGEgbmV3IGxldmVsLCBzaG91bGQgaGFuZGxlIG5ldyBzdGVuY2lsXHJcbiAgICBFTlRFUl9MRVZFTCA9IDIsXHJcbiAgICAvLyBJbiBjb250ZW50XHJcbiAgICBFTkFCTEVEID0gMyxcclxuICAgIC8vIEV4aXRpbmcgYSBsZXZlbCwgc2hvdWxkIHJlc3RvcmUgb2xkIHN0ZW5jaWwgb3IgZGlzYWJsZVxyXG4gICAgRVhJVF9MRVZFTCA9IDQsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdGVuY2lsTWFuYWdlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNoYXJlZE1hbmFnZXI6IFN0ZW5jaWxNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3RhZ2UgPSBTdGFnZS5ESVNBQkxFRDtcclxuICAgIHByaXZhdGUgX21hc2tTdGFjazogYW55W10gPSBbXTtcclxuICAgIHByaXZhdGUgX3N0ZW5jaWxQYXR0ZXJuID0ge1xyXG4gICAgICAgIHN0ZW5jaWxUZXN0OiB0cnVlLFxyXG4gICAgICAgIGZ1bmM6IEdGWENvbXBhcmlzb25GdW5jLkFMV0FZUyxcclxuICAgICAgICBzdGVuY2lsTWFzazogMHhmZmZmLFxyXG4gICAgICAgIHdyaXRlTWFzazogMHhmZmZmLFxyXG4gICAgICAgIGZhaWxPcDogR0ZYU3RlbmNpbE9wLktFRVAsXHJcbiAgICAgICAgekZhaWxPcDogR0ZYU3RlbmNpbE9wLktFRVAsXHJcbiAgICAgICAgcGFzc09wOiBHRlhTdGVuY2lsT3AuS0VFUCxcclxuICAgICAgICByZWY6IDEsXHJcbiAgICB9O1xyXG5cclxuICAgIGdldCBwYXR0ZXJuICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RlbmNpbFBhdHRlcm47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHB1c2hNYXNrIChtYXNrOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9tYXNrU3RhY2sucHVzaChtYXNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBTdGFnZS5DTEVBUjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXJMZXZlbCAoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFnZSA9IFN0YWdlLkVOVEVSX0xFVkVMO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmFibGVNYXNrICgpIHtcclxuICAgICAgICB0aGlzLnN0YWdlID0gU3RhZ2UuRU5BQkxFRDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhpdE1hc2sgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXNrU3RhY2subGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIGNjLmVycm9ySUQoOTAwMSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbWFza1N0YWNrLnBvcCgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXNrU3RhY2subGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UgPSBTdGFnZS5ESVNBQkxFRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UgPSBTdGFnZS5FTkFCTEVEO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFuZGxlTWF0ZXJpYWwgKG1hdDogTWF0ZXJpYWwpIHtcclxuICAgICAgICBjb25zdCBwYXR0ZXJuID0gdGhpcy5fc3RlbmNpbFBhdHRlcm47XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLkRJU0FCTEVEKSB7XHJcbiAgICAgICAgICAgIHBhdHRlcm4uc3RlbmNpbFRlc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgcGF0dGVybi5mdW5jID0gR0ZYQ29tcGFyaXNvbkZ1bmMuQUxXQVlTO1xyXG4gICAgICAgICAgICBwYXR0ZXJuLmZhaWxPcCA9IEdGWFN0ZW5jaWxPcC5LRUVQO1xyXG4gICAgICAgICAgICBwYXR0ZXJuLnN0ZW5jaWxNYXNrID0gcGF0dGVybi53cml0ZU1hc2sgPSAweGZmZmY7XHJcbiAgICAgICAgICAgIHBhdHRlcm4ucmVmID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXR0ZXJuLnN0ZW5jaWxUZXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLkVOQUJMRUQpIHtcclxuICAgICAgICAgICAgICAgIHBhdHRlcm4uZnVuYyA9IEdGWENvbXBhcmlzb25GdW5jLkVRVUFMO1xyXG4gICAgICAgICAgICAgICAgcGF0dGVybi5mYWlsT3AgPSBHRlhTdGVuY2lsT3AuS0VFUDtcclxuICAgICAgICAgICAgICAgIHBhdHRlcm4uc3RlbmNpbE1hc2sgPSBwYXR0ZXJuLnJlZiA9IHRoaXMuZ2V0U3RlbmNpbFJlZigpO1xyXG4gICAgICAgICAgICAgICAgcGF0dGVybi53cml0ZU1hc2sgPSB0aGlzLmdldFdyaXRlTWFzaygpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLkNMRUFSKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXNrID0gdGhpcy5fbWFza1N0YWNrW3RoaXMuX21hc2tTdGFjay5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIHBhdHRlcm4uZnVuYyA9IEdGWENvbXBhcmlzb25GdW5jLk5FVkVSO1xyXG4gICAgICAgICAgICAgICAgcGF0dGVybi5mYWlsT3AgPSBtYXNrLmludmVydGVkID8gR0ZYU3RlbmNpbE9wLlJFUExBQ0UgOiBHRlhTdGVuY2lsT3AuWkVSTztcclxuICAgICAgICAgICAgICAgIHBhdHRlcm4ud3JpdGVNYXNrID0gcGF0dGVybi5zdGVuY2lsTWFzayA9IHBhdHRlcm4ucmVmID0gdGhpcy5nZXRXcml0ZU1hc2soKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YWdlID09PSBTdGFnZS5FTlRFUl9MRVZFTCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFzayA9IHRoaXMuX21hc2tTdGFja1t0aGlzLl9tYXNrU3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBwYXR0ZXJuLmZ1bmMgPSBHRlhDb21wYXJpc29uRnVuYy5ORVZFUjtcclxuICAgICAgICAgICAgICAgIHBhdHRlcm4uZmFpbE9wID0gbWFzay5pbnZlcnRlZCA/IEdGWFN0ZW5jaWxPcC5aRVJPIDogR0ZYU3RlbmNpbE9wLlJFUExBQ0U7XHJcbiAgICAgICAgICAgICAgICBwYXR0ZXJuLndyaXRlTWFzayA9IHBhdHRlcm4uc3RlbmNpbE1hc2sgPSBwYXR0ZXJuLnJlZiA9IHRoaXMuZ2V0V3JpdGVNYXNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VkKG1hdC5wYXNzZXNbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRXcml0ZU1hc2sgKCkge1xyXG4gICAgICAgIHJldHVybiAxIDw8ICh0aGlzLl9tYXNrU3RhY2subGVuZ3RoIC0gMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEV4aXRXcml0ZU1hc2sgKCkge1xyXG4gICAgICAgIHJldHVybiAxIDw8IHRoaXMuX21hc2tTdGFjay5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0ZW5jaWxSZWYgKCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWFza1N0YWNrLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSAoMHgwMDAwMDAwMSA8PCBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQgKCkge1xyXG4gICAgICAgIC8vIHJlc2V0IHN0YWNrIGFuZCBzdGFnZVxyXG4gICAgICAgIHRoaXMuX21hc2tTdGFjay5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBTdGFnZS5ESVNBQkxFRDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jaGFuZ2VkIChwYXNzOiBQYXNzKSB7XHJcbiAgICAgICAgY29uc3Qgc3RlbmNpbFN0YXRlID0gcGFzcy5kZXB0aFN0ZW5jaWxTdGF0ZTtcclxuICAgICAgICBjb25zdCBwYXR0ZXJuID0gdGhpcy5fc3RlbmNpbFBhdHRlcm47XHJcbiAgICAgICAgaWYgKHBhdHRlcm4uc3RlbmNpbFRlc3QgIT09IHN0ZW5jaWxTdGF0ZS5zdGVuY2lsVGVzdEZyb250IHx8XHJcbiAgICAgICAgICAgIHBhdHRlcm4uZnVuYyAhPT0gc3RlbmNpbFN0YXRlLnN0ZW5jaWxGdW5jRnJvbnQgfHxcclxuICAgICAgICAgICAgcGF0dGVybi5mYWlsT3AgIT09IHN0ZW5jaWxTdGF0ZS5zdGVuY2lsRmFpbE9wRnJvbnQgfHxcclxuICAgICAgICAgICAgcGF0dGVybi56RmFpbE9wICE9PSBzdGVuY2lsU3RhdGUuc3RlbmNpbFpGYWlsT3BGcm9udCB8fFxyXG4gICAgICAgICAgICBwYXR0ZXJuLnBhc3NPcCAhPT0gc3RlbmNpbFN0YXRlLnN0ZW5jaWxQYXNzT3BGcm9udCB8fFxyXG4gICAgICAgICAgICBwYXR0ZXJuLnN0ZW5jaWxNYXNrICE9PSBzdGVuY2lsU3RhdGUuc3RlbmNpbFJlYWRNYXNrRnJvbnQgfHxcclxuICAgICAgICAgICAgcGF0dGVybi53cml0ZU1hc2sgIT09IHN0ZW5jaWxTdGF0ZS5zdGVuY2lsV3JpdGVNYXNrRnJvbnQgfHxcclxuICAgICAgICAgICAgcGF0dGVybi5yZWYgIT09IHN0ZW5jaWxTdGF0ZS5zdGVuY2lsUmVmRnJvbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcblN0ZW5jaWxNYW5hZ2VyLnNoYXJlZE1hbmFnZXIgPSBuZXcgU3RlbmNpbE1hbmFnZXIoKTtcclxuIl19