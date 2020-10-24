(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/material.js", "./pass-instance.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/material.js"), require("./pass-instance.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.material, global.passInstance);
    global.materialInstance = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _material, _passInstance) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MaterialInstance = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * @zh
   * 材质实例，当有材质修改需求时，根据材质资源创建的，可任意定制的实例。
   */
  var MaterialInstance = /*#__PURE__*/function (_Material) {
    _inherits(MaterialInstance, _Material);

    _createClass(MaterialInstance, [{
      key: "parent",
      get: function get() {
        return this._parent;
      }
    }, {
      key: "owner",
      get: function get() {
        return this._owner;
      }
    }]);

    function MaterialInstance(info) {
      var _this;

      _classCallCheck(this, MaterialInstance);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MaterialInstance).call(this));
      _this._passes = [];
      _this._parent = void 0;
      _this._owner = void 0;
      _this._subModelIdx = 0;
      _this._parent = info.parent;
      _this._owner = info.owner || null;
      _this._subModelIdx = info.subModelIdx || 0;

      _this.copy(_this._parent);

      return _this;
    }

    _createClass(MaterialInstance, [{
      key: "recompileShaders",
      value: function recompileShaders(overrides, passIdx) {
        if (!this._passes || !this.effectAsset) {
          return;
        }

        if (passIdx === undefined) {
          var _iterator = _createForOfIteratorHelper(this._passes),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var pass = _step.value;
              pass.tryCompile(overrides);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          this._passes[passIdx].tryCompile(overrides);
        }
      }
    }, {
      key: "overridePipelineStates",
      value: function overridePipelineStates(overrides, passIdx) {
        if (!this._passes || !this.effectAsset) {
          return;
        }

        var passInfos = this.effectAsset.techniques[this.technique].passes;

        if (passIdx === undefined) {
          for (var i = 0; i < this._passes.length; i++) {
            var pass = this._passes[i];
            var state = this._states[i] || (this._states[i] = {});

            for (var key in overrides) {
              state[key] = overrides[key];
            }

            pass.overridePipelineStates(passInfos[pass.passIndex], state);
          }
        } else {
          var _state = this._states[passIdx] || (this._states[passIdx] = {});

          for (var _key in overrides) {
            _state[_key] = overrides[_key];
          }

          this._passes[passIdx].overridePipelineStates(passInfos[passIdx], _state);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._doDestroy();

        return true;
      }
    }, {
      key: "onPassStateChange",
      value: function onPassStateChange(dontNotify) {
        this._hash = _material.Material.getHash(this);

        if (!dontNotify && this._owner) {
          // @ts-ignore
          this._owner._onRebuildPSO(this._subModelIdx, this);
        }
      }
    }, {
      key: "_createPasses",
      value: function _createPasses() {
        var passes = [];
        var parentPasses = this._parent.passes;

        if (!parentPasses) {
          return passes;
        }

        for (var k = 0; k < parentPasses.length; ++k) {
          passes.push(new _passInstance.PassInstance(parentPasses[k], this));
        }

        return passes;
      }
    }]);

    return MaterialInstance;
  }(_material.Material);

  _exports.MaterialInstance = MaterialInstance;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9tYXRlcmlhbC1pbnN0YW5jZS50cyJdLCJuYW1lcyI6WyJNYXRlcmlhbEluc3RhbmNlIiwiX3BhcmVudCIsIl9vd25lciIsImluZm8iLCJfcGFzc2VzIiwiX3N1Yk1vZGVsSWR4IiwicGFyZW50Iiwib3duZXIiLCJzdWJNb2RlbElkeCIsImNvcHkiLCJvdmVycmlkZXMiLCJwYXNzSWR4IiwiZWZmZWN0QXNzZXQiLCJ1bmRlZmluZWQiLCJwYXNzIiwidHJ5Q29tcGlsZSIsInBhc3NJbmZvcyIsInRlY2huaXF1ZXMiLCJ0ZWNobmlxdWUiLCJwYXNzZXMiLCJpIiwibGVuZ3RoIiwic3RhdGUiLCJfc3RhdGVzIiwia2V5Iiwib3ZlcnJpZGVQaXBlbGluZVN0YXRlcyIsInBhc3NJbmRleCIsIl9kb0Rlc3Ryb3kiLCJkb250Tm90aWZ5IiwiX2hhc2giLCJNYXRlcmlhbCIsImdldEhhc2giLCJfb25SZWJ1aWxkUFNPIiwicGFyZW50UGFzc2VzIiwiayIsInB1c2giLCJQYXNzSW5zdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBOzs7O01BSWFBLGdCOzs7OzswQkFFSztBQUNWLGVBQU8sS0FBS0MsT0FBWjtBQUNIOzs7MEJBRVk7QUFDVCxlQUFPLEtBQUtDLE1BQVo7QUFDSDs7O0FBUUQsOEJBQWFDLElBQWIsRUFBMEM7QUFBQTs7QUFBQTs7QUFDdEM7QUFEc0MsWUFOaENDLE9BTWdDLEdBTk4sRUFNTTtBQUFBLFlBSmxDSCxPQUlrQztBQUFBLFlBSGxDQyxNQUdrQztBQUFBLFlBRmxDRyxZQUVrQyxHQUZuQixDQUVtQjtBQUV0QyxZQUFLSixPQUFMLEdBQWVFLElBQUksQ0FBQ0csTUFBcEI7QUFDQSxZQUFLSixNQUFMLEdBQWNDLElBQUksQ0FBQ0ksS0FBTCxJQUFjLElBQTVCO0FBQ0EsWUFBS0Ys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QUFHRCxZQUFZLENBQUNaLE1BQWpDLEVBQXlDLEVBQUVhLENBQTNDLEVBQThDO0FBQzFDZixVQUFBQSxNQUFNLENBQUNnQixJQUFQLENBQVksSUFBSUMsMEJBQUosQ0FBaUJILFlBQVksQ0FBQ0MsQ0FBRCxDQUE3QixFQUFrQyxJQUFsQyxDQUFaO0FBQ0g7O0FBQ0QsZUFBT2YsTUFBUDtBQUNIOzs7O0lBekVpQ1csa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IG1hdGVyaWFsXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUmVuZGVyYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLzNkL2ZyYW1ld29yay9yZW5kZXJhYmxlLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgUGFzc0luc3RhbmNlIH0gZnJvbSAnLi9wYXNzLWluc3RhbmNlJztcclxuaW1wb3J0IHsgTWFjcm9SZWNvcmQgfSBmcm9tICcuL3Bhc3MtdXRpbHMnO1xyXG5pbXBvcnQgeyBQYXNzT3ZlcnJpZGVzIH0gZnJvbSAnLi9wYXNzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hdGVyaWFsSW5zdGFuY2VJbmZvIHtcclxuICAgIHBhcmVudDogTWF0ZXJpYWw7XHJcbiAgICBvd25lcj86IFJlbmRlcmFibGVDb21wb25lbnQ7XHJcbiAgICBzdWJNb2RlbElkeD86IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDmnZDotKjlrp7kvovvvIzlvZPmnInmnZDotKjkv67mlLnpnIDmsYLml7bvvIzmoLnmja7mnZDotKjotYTmupDliJvlu7rnmoTvvIzlj6/ku7vmhI/lrprliLbnmoTlrp7kvovjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbEluc3RhbmNlIGV4dGVuZHMgTWF0ZXJpYWwge1xyXG5cclxuICAgIGdldCBwYXJlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG93bmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3duZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9wYXNzZXM6IFBhc3NJbnN0YW5jZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFyZW50OiBNYXRlcmlhbDtcclxuICAgIHByaXZhdGUgX293bmVyOiBSZW5kZXJhYmxlQ29tcG9uZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgX3N1Yk1vZGVsSWR4ID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoaW5mbzogSU1hdGVyaWFsSW5zdGFuY2VJbmZvKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSBpbmZvLnBhcmVudDtcclxuICAgICAgICB0aGlzLl9vd25lciA9IGluZm8ub3duZXIgfHwgbnVsbDtcclxuICAgICAgICB0aGlzLl9zdWJNb2RlbElkeCA9IGluZm8uc3ViTW9kZWxJZHggfHwgMDtcclxuICAgICAgICB0aGlzLmNvcHkodGhpcy5fcGFyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjb21waWxlU2hhZGVycyAob3ZlcnJpZGVzOiBNYWNyb1JlY29yZCwgcGFzc0lkeD86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5fcGFzc2VzIHx8ICF0aGlzLmVmZmVjdEFzc2V0KSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmIChwYXNzSWR4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBwYXNzIG9mIHRoaXMuX3Bhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgcGFzcy50cnlDb21waWxlKG92ZXJyaWRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXNzZXNbcGFzc0lkeF0udHJ5Q29tcGlsZShvdmVycmlkZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3ZlcnJpZGVQaXBlbGluZVN0YXRlcyAob3ZlcnJpZGVzOiBQYXNzT3ZlcnJpZGVzLCBwYXNzSWR4PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYXNzZXMgfHwgIXRoaXMuZWZmZWN0QXNzZXQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgcGFzc0luZm9zID0gdGhpcy5lZmZlY3RBc3NldC50ZWNobmlxdWVzW3RoaXMudGVjaG5pcXVlXS5wYXNzZXM7XHJcbiAgICAgICAgaWYgKHBhc3NJZHggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Bhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFzcyA9IHRoaXMuX3Bhc3Nlc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fc3RhdGVzW2ldIHx8ICh0aGlzLl9zdGF0ZXNbaV0gPSB7fSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHsgc3RhdGVba2V5XSA9IG92ZXJyaWRlc1trZXldOyB9XHJcbiAgICAgICAgICAgICAgICBwYXNzLm92ZXJyaWRlUGlwZWxpbmVTdGF0ZXMocGFzc0luZm9zW3Bhc3MucGFzc0luZGV4XSwgc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9zdGF0ZXNbcGFzc0lkeF0gfHwgKHRoaXMuX3N0YXRlc1twYXNzSWR4XSA9IHt9KTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7IHN0YXRlW2tleV0gPSBvdmVycmlkZXNba2V5XTsgfVxyXG4gICAgICAgICAgICB0aGlzLl9wYXNzZXNbcGFzc0lkeF0ub3ZlcnJpZGVQaXBlbGluZVN0YXRlcyhwYXNzSW5mb3NbcGFzc0lkeF0sIHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX2RvRGVzdHJveSgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblBhc3NTdGF0ZUNoYW5nZSAoZG9udE5vdGlmeTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2hhc2ggPSBNYXRlcmlhbC5nZXRIYXNoKHRoaXMpO1xyXG4gICAgICAgIGlmICghZG9udE5vdGlmeSAmJiB0aGlzLl9vd25lcikge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHRoaXMuX293bmVyLl9vblJlYnVpbGRQU08odGhpcy5fc3ViTW9kZWxJZHgsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZVBhc3NlcyAoKSB7XHJcbiAgICAgICAgY29uc3QgcGFzc2VzOiBQYXNzSW5zdGFuY2VbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhc3NlcyA9IHRoaXMuX3BhcmVudC5wYXNzZXM7XHJcbiAgICAgICAgaWYgKCFwYXJlbnRQYXNzZXMpIHsgcmV0dXJuIHBhc3NlczsgfVxyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcGFyZW50UGFzc2VzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICAgIHBhc3Nlcy5wdXNoKG5ldyBQYXNzSW5zdGFuY2UocGFyZW50UGFzc2VzW2tdLCB0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXNzZXM7XHJcbiAgICB9XHJcbn1cclxuIl19