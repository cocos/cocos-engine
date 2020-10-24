(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./pass.js", "./pass-utils.js", "./memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./pass.js"), require("./pass-utils.js"), require("./memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pass, global.passUtils, global.memoryPools);
    global.passInstance = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pass, _passUtils, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PassInstance = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  var PassInstance = /*#__PURE__*/function (_Pass) {
    _inherits(PassInstance, _Pass);

    _createClass(PassInstance, [{
      key: "parent",
      get: function get() {
        return this._parent;
      }
    }]);

    function PassInstance(parent, owner) {
      var _this;

      _classCallCheck(this, PassInstance);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PassInstance).call(this, parent.root));
      _this._parent = void 0;
      _this._owner = void 0;
      _this._dontNotify = false;
      _this._parent = parent;
      _this._owner = owner;

      _this._doInit(_this._parent, true); // defines may change now


      for (var i = 0; i < _this._shaderInfo.blocks.length; i++) {
        var u = _this._shaderInfo.blocks[i];
        var block = _this._blocks[u.binding];
        var parentBlock = _this._parent.blocks[u.binding];
        block.set(parentBlock);
      }

      _this._rootBufferDirty = true;
      var paren = _this._parent;

      for (var _i = 0; _i < _this._shaderInfo.samplers.length; _i++) {
        var _u = _this._shaderInfo.samplers[_i];

        for (var j = 0; j < _u.count; j++) {
          var sampler = paren._descriptorSet.getSampler(_u.binding, j);

          var texture = paren._descriptorSet.getTexture(_u.binding, j);

          _this._descriptorSet.bindSampler(_u.binding, sampler, j);

          _this._descriptorSet.bindTexture(_u.binding, texture, j);
        }
      }

      _get(_getPrototypeOf(PassInstance.prototype), "tryCompile", _assertThisInitialized(_this)).call(_assertThisInitialized(_this));

      return _this;
    }

    _createClass(PassInstance, [{
      key: "overridePipelineStates",
      value: function overridePipelineStates(original, overrides) {
        _memoryPools.BlendStatePool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.BLEND_STATE));

        _memoryPools.RasterizerStatePool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.RASTERIZER_STATE));

        _memoryPools.DepthStencilStatePool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.DEPTH_STENCIL_STATE));

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.BLEND_STATE, _memoryPools.BlendStatePool.alloc());

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.RASTERIZER_STATE, _memoryPools.RasterizerStatePool.alloc());

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.DEPTH_STENCIL_STATE, _memoryPools.DepthStencilStatePool.alloc());

        _pass.Pass.fillPipelineInfo(this._handle, original);

        _pass.Pass.fillPipelineInfo(this._handle, overrides);

        this._onStateChange();
      }
    }, {
      key: "tryCompile",
      value: function tryCompile(defineOverrides) {
        if (defineOverrides) {
          if (!(0, _passUtils.overrideMacros)(this._defines, defineOverrides)) {
            return false;
          }
        }

        var res = _get(_getPrototypeOf(PassInstance.prototype), "tryCompile", this).call(this);

        this._onStateChange();

        return res;
      }
    }, {
      key: "beginChangeStatesSilently",
      value: function beginChangeStatesSilently() {
        this._dontNotify = true;
      }
    }, {
      key: "endChangeStatesSilently",
      value: function endChangeStatesSilently() {
        this._dontNotify = false;
      }
    }, {
      key: "_syncBatchingScheme",
      value: function _syncBatchingScheme() {
        this._defines.USE_BATCHING = this._defines.USE_INSTANCING = false;

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.BATCHING_SCHEME, 0);
      }
    }, {
      key: "_onStateChange",
      value: function _onStateChange() {
        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.HASH, _pass.Pass.getPassHash(this._handle, this._hShaderDefault));

        this._owner.onPassStateChange(this._dontNotify);
      }
    }]);

    return PassInstance;
  }(_pass.Pass);

  _exports.PassInstance = PassInstance;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9wYXNzLWluc3RhbmNlLnRzIl0sIm5hbWVzIjpbIlBhc3NJbnN0YW5jZSIsIl9wYXJlbnQiLCJwYXJlbnQiLCJvd25lciIsInJvb3QiLCJfb3duZXIiLCJfZG9udE5vdGlmeSIsIl9kb0luaXQiLCJpIiwiX3NoYWRlckluZm8iLCJibG9ja3MiLCJsZW5ndGgiLCJ1IiwiYmxvY2siLCJfYmxvY2tzIiwiYmluZGluZyIsInBhcmVudEJsb2NrIiwic2V0IiwiX3Jvb3RCdWZmZXJEaXJ0eSIsInBhcmVuIiwic2FtcGxlcnMiLCJqIiwiY291bnQiLCJzYW1wbGVyIiwiX2Rlc2NyaXB0b3JTZXQiLCJnZXRTYW1wbGVyIiwidGV4dHVyZSIsImdldFRleHR1cmUiLCJiaW5kU2FtcGxlciIsImJpbmRUZXh0dXJlIiwib3JpZ2luYWwiLCJvdmVycmlkZXMiLCJCbGVuZFN0YXRlUG9vbCIsImZyZWUiLCJQYXNzUG9vbCIsImdldCIsIl9oYW5kbGUiLCJQYXNzVmlldyIsIkJMRU5EX1NUQVRFIiwiUmFzdGVyaXplclN0YXRlUG9vbCIsIlJBU1RFUklaRVJfU1RBVEUiLCJEZXB0aFN0ZW5jaWxTdGF0ZVBvb2wiLCJERVBUSF9TVEVOQ0lMX1NUQVRFIiwiYWxsb2MiLCJQYXNzIiwiZmlsbFBpcGVsaW5lSW5mbyIsIl9vblN0YXRlQ2hhbmdlIiwiZGVmaW5lT3ZlcnJpZGVzIiwiX2RlZmluZXMiLCJyZXMiLCJVU0VfQkFUQ0hJTkciLCJVU0VfSU5TVEFOQ0lORyIsIkJBVENISU5HX1NDSEVNRSIsIkhBU0giLCJnZXRQYXNzSGFzaCIsIl9oU2hhZGVyRGVmYXVsdCIsIm9uUGFzc1N0YXRlQ2hhbmdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFtQ2FBLFk7Ozs7OzBCQUVLO0FBQUUsZUFBTyxLQUFLQyxPQUFaO0FBQXNCOzs7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LE9BQWxCLEVBQTJCQyxzQkFBU0ssbUJBQXBDLEVBQXlERCxtQ0FBc0JFLEtBQXRCLEVBQXpEOztBQUVBQyxtQkFBS0MsZ0JBQUwsQ0FBc0IsS0FBS1QsT0FBM0IsRUFBb0NOLFFBQXBDOztBQUNBYyxtQkFBS0MsZ0JBQUwsQ0FBc0IsS0FBS1QsT0FBM0IsRUFBb0NMLFNBQXBDOztBQUNBLGFBQUtlLGNBQUw7QUFDSDs7O2lDQUVrQkMsZSxFQUErQjtBQUM5QyxZQUFJQSxlQUFKLEVBQXFCO0FBQ2pCLGNBQUksQ0FBQywrQkFBZSxLQUFLQyxRQUFwQixFQUE4QkQsZUFBOUIsQ0FBTCxFQUFxRDtBQUNqRCxtQkFBTyxLQUFQO0FBQ0g7QUFDSjs7QUFDRCxZQUFNRSxHQUFHLCtFQUFUOztBQUNBLGFBQUtILGNBQUw7O0FBQ0EsZUFBT0csR0FBUDtBQUNIOzs7a0RBRW1DO0FBQ2hDLGFBQUszQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0g7OztnREFFaUM7QUFDOUIsYUFBS0EsV0FBTCxHQUFtQixLQUFuQjtBQUNIOzs7NENBRWdDO0FBQzdCLGFBQUswQyxRQUFMLENBQWNFLFlBQWQsR0FBNkIsS0FBS0YsUUFBTCxDQUFjRyxjQUFkLEdBQStCLEtBQTVEOztBQUNBakIsOEJBQVNqQixHQUFULENBQWEsS0FBS21CLE9BQWxCLEVBQTJCQyxzQkFBU2UsZUFBcEMsRUFBcUQsQ0FBckQ7QUFDSDs7O3VDQUUyQjtBQUN4QmxCLDhCQUFTakIsR0FBVCxDQUFhLEtBQUttQixPQUFsQixFQUEyQkMsc0JBQVNnQixJQUFwQyxFQUEwQ1QsV0FBS1UsV0FBTCxDQUFpQixLQUFLbEIsT0FBdEIsRUFBK0IsS0FBS21CLGVBQXBDLENBQTFDOztBQUNBLGFBQUtsRCxNQUFMLENBQVltRCxpQkFBWixDQUE4QixLQUFLbEQsV0FBbkM7QUFDSDs7OztJQXpFNkJzQyxVIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBtYXRlcmlhbFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IElQYXNzSW5mbyB9IGZyb20gJy4uLy4uL2Fzc2V0cy9lZmZlY3QtYXNzZXQnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbEluc3RhbmNlIH0gZnJvbSAnLi9tYXRlcmlhbC1pbnN0YW5jZSc7XHJcbmltcG9ydCB7IFBhc3MsIFBhc3NPdmVycmlkZXMgfSBmcm9tICcuL3Bhc3MnO1xyXG5pbXBvcnQgeyBvdmVycmlkZU1hY3JvcywgTWFjcm9SZWNvcmQgfSBmcm9tICcuL3Bhc3MtdXRpbHMnO1xyXG5pbXBvcnQgeyBQYXNzVmlldywgUmFzdGVyaXplclN0YXRlUG9vbCwgRGVwdGhTdGVuY2lsU3RhdGVQb29sLCBCbGVuZFN0YXRlUG9vbCwgUGFzc1Bvb2wgfSBmcm9tICcuL21lbW9yeS1wb29scyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFzc0luc3RhbmNlIGV4dGVuZHMgUGFzcyB7XHJcblxyXG4gICAgZ2V0IHBhcmVudCAoKSB7IHJldHVybiB0aGlzLl9wYXJlbnQ7IH1cclxuXHJcbiAgICBwcml2YXRlIF9wYXJlbnQ6IFBhc3M7XHJcbiAgICBwcml2YXRlIF9vd25lcjogTWF0ZXJpYWxJbnN0YW5jZTtcclxuICAgIHByaXZhdGUgX2RvbnROb3RpZnkgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocGFyZW50OiBQYXNzLCBvd25lcjogTWF0ZXJpYWxJbnN0YW5jZSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmVudC5yb290KTtcclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5fb3duZXIgPSBvd25lcjtcclxuICAgICAgICB0aGlzLl9kb0luaXQodGhpcy5fcGFyZW50LCB0cnVlKTsgLy8gZGVmaW5lcyBtYXkgY2hhbmdlIG5vd1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhZGVySW5mby5ibG9ja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdSA9IHRoaXMuX3NoYWRlckluZm8uYmxvY2tzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuX2Jsb2Nrc1t1LmJpbmRpbmddO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRCbG9jayA9IHRoaXMuX3BhcmVudC5ibG9ja3NbdS5iaW5kaW5nXTtcclxuICAgICAgICAgICAgYmxvY2suc2V0KHBhcmVudEJsb2NrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcm9vdEJ1ZmZlckRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwYXJlbiA9IHRoaXMuX3BhcmVudCBhcyBQYXNzSW5zdGFuY2U7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFkZXJJbmZvLnNhbXBsZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHUgPSB0aGlzLl9zaGFkZXJJbmZvLnNhbXBsZXJzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHUuY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtcGxlciA9IHBhcmVuLl9kZXNjcmlwdG9yU2V0LmdldFNhbXBsZXIodS5iaW5kaW5nLCBqKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHR1cmUgPSBwYXJlbi5fZGVzY3JpcHRvclNldC5nZXRUZXh0dXJlKHUuYmluZGluZywgaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRTYW1wbGVyKHUuYmluZGluZywgc2FtcGxlciwgaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRUZXh0dXJlKHUuYmluZGluZywgdGV4dHVyZSwgaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIudHJ5Q29tcGlsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvdmVycmlkZVBpcGVsaW5lU3RhdGVzIChvcmlnaW5hbDogSVBhc3NJbmZvLCBvdmVycmlkZXM6IFBhc3NPdmVycmlkZXMpOiB2b2lkIHtcclxuICAgICAgICBCbGVuZFN0YXRlUG9vbC5mcmVlKFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkJMRU5EX1NUQVRFKSk7XHJcbiAgICAgICAgUmFzdGVyaXplclN0YXRlUG9vbC5mcmVlKFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LlJBU1RFUklaRVJfU1RBVEUpKTtcclxuICAgICAgICBEZXB0aFN0ZW5jaWxTdGF0ZVBvb2wuZnJlZShQYXNzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5ERVBUSF9TVEVOQ0lMX1NUQVRFKSk7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuQkxFTkRfU1RBVEUsIEJsZW5kU3RhdGVQb29sLmFsbG9jKCkpO1xyXG4gICAgICAgIFBhc3NQb29sLnNldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LlJBU1RFUklaRVJfU1RBVEUsIFJhc3Rlcml6ZXJTdGF0ZVBvb2wuYWxsb2MoKSk7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuREVQVEhfU1RFTkNJTF9TVEFURSwgRGVwdGhTdGVuY2lsU3RhdGVQb29sLmFsbG9jKCkpO1xyXG5cclxuICAgICAgICBQYXNzLmZpbGxQaXBlbGluZUluZm8odGhpcy5faGFuZGxlLCBvcmlnaW5hbCk7XHJcbiAgICAgICAgUGFzcy5maWxsUGlwZWxpbmVJbmZvKHRoaXMuX2hhbmRsZSwgb3ZlcnJpZGVzKTtcclxuICAgICAgICB0aGlzLl9vblN0YXRlQ2hhbmdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyeUNvbXBpbGUgKGRlZmluZU92ZXJyaWRlcz86IE1hY3JvUmVjb3JkKSB7XHJcbiAgICAgICAgaWYgKGRlZmluZU92ZXJyaWRlcykge1xyXG4gICAgICAgICAgICBpZiAoIW92ZXJyaWRlTWFjcm9zKHRoaXMuX2RlZmluZXMsIGRlZmluZU92ZXJyaWRlcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXMgPSBzdXBlci50cnlDb21waWxlKCk7XHJcbiAgICAgICAgdGhpcy5fb25TdGF0ZUNoYW5nZSgpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJlZ2luQ2hhbmdlU3RhdGVzU2lsZW50bHkgKCkge1xyXG4gICAgICAgIHRoaXMuX2RvbnROb3RpZnkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmRDaGFuZ2VTdGF0ZXNTaWxlbnRseSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZG9udE5vdGlmeSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfc3luY0JhdGNoaW5nU2NoZW1lICgpIHtcclxuICAgICAgICB0aGlzLl9kZWZpbmVzLlVTRV9CQVRDSElORyA9IHRoaXMuX2RlZmluZXMuVVNFX0lOU1RBTkNJTkcgPSBmYWxzZTtcclxuICAgICAgICBQYXNzUG9vbC5zZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5CQVRDSElOR19TQ0hFTUUsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25TdGF0ZUNoYW5nZSAoKSB7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuSEFTSCwgUGFzcy5nZXRQYXNzSGFzaCh0aGlzLl9oYW5kbGUsIHRoaXMuX2hTaGFkZXJEZWZhdWx0KSk7XHJcbiAgICAgICAgdGhpcy5fb3duZXIub25QYXNzU3RhdGVDaGFuZ2UodGhpcy5fZG9udE5vdGlmeSk7XHJcbiAgICB9XHJcbn1cclxuIl19