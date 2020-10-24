(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../descriptor-set-layout.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../descriptor-set-layout.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.descriptorSetLayout);
    global.webglDescriptorSetLayout = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _descriptorSetLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLDescriptorSetLayout = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLDescriptorSetLayout = /*#__PURE__*/function (_GFXDescriptorSetLayo) {
    _inherits(WebGLDescriptorSetLayout, _GFXDescriptorSetLayo);

    function WebGLDescriptorSetLayout() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLDescriptorSetLayout);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLDescriptorSetLayout)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuDescriptorSetLayout = null;
      return _this;
    }

    _createClass(WebGLDescriptorSetLayout, [{
      key: "initialize",
      value: function initialize(info) {
        Array.prototype.push.apply(this._bindings, info.bindings);
        var descriptorCount = 0;

        for (var i = 0; i < this._bindings.length; i++) {
          var binding = this._bindings[i];

          this._descriptorIndices.push(descriptorCount);

          descriptorCount += binding.count;
        }

        this._descriptorIndices.push(descriptorCount);

        var dynamicBindings = [];

        for (var _i = 0; _i < this._bindings.length; _i++) {
          var _binding = this._bindings[_i];

          if (_binding.descriptorType & _descriptorSetLayout.DESCRIPTOR_DYNAMIC_TYPE) {
            for (var j = 0; j < _binding.count; j++) {
              dynamicBindings.push(_i);
            }
          }
        }

        this._gpuDescriptorSetLayout = {
          bindings: this._bindings,
          dynamicBindings: dynamicBindings,
          descriptorIndices: this._descriptorIndices,
          descriptorCount: descriptorCount
        };
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._bindings.length = 0;
      }
    }, {
      key: "gpuDescriptorSetLayout",
      get: function get() {
        return this._gpuDescriptorSetLayout;
      }
    }]);

    return WebGLDescriptorSetLayout;
  }(_descriptorSetLayout.GFXDescriptorSetLayout);

  _exports.WebGLDescriptorSetLayout = WebGLDescriptorSetLayout;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWRlc2NyaXB0b3Itc2V0LWxheW91dC50cyJdLCJuYW1lcyI6WyJXZWJHTERlc2NyaXB0b3JTZXRMYXlvdXQiLCJfZ3B1RGVzY3JpcHRvclNldExheW91dCIsImluZm8iLCJBcnJheSIsInByb3RvdHlwZSIsInB1c2giLCJhcHBseSIsIl9iaW5kaW5ncyIsImJpbmRpbmdzIiwiZGVzY3JpcHRvckNvdW50IiwiaSIsImxlbmd0aCIsImJpbmRpbmciLCJfZGVzY3JpcHRvckluZGljZXMiLCJjb3VudCIsImR5bmFtaWNCaW5kaW5ncyIsImRlc2NyaXB0b3JUeXBlIiwiREVTQ1JJUFRPUl9EWU5BTUlDX1RZUEUiLCJqIiwiZGVzY3JpcHRvckluZGljZXMiLCJHRlhEZXNjcmlwdG9yU2V0TGF5b3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUdhQSx3Qjs7Ozs7Ozs7Ozs7Ozs7O1lBSURDLHVCLEdBQStELEk7Ozs7OztpQ0FFcERDLEksRUFBa0M7QUFDakRDLFFBQUFBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLEtBQXJCLENBQTJCLEtBQUtDLFNBQWhDLEVBQTJDTCxJQUFJLENBQUNNLFFBQWhEO0FBRUEsWUFBSUMsZUFBZSxHQUFHLENBQXRCOztBQUNBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLSCxTQUFMLENBQWVJLE1BQW5DLEVBQTJDRCxDQUFDLEVBQTVDLEVBQWdEO0FBQzVDLGNBQU1FLE9BQU8sR0FBRyxLQUFLTCxTQUFMLENBQWVHLENBQWYsQ0FBaEI7O0FBQ0EsZUFBS0csa0JBQUwsQ0FBd0JSLElBQXhCLENBQTZCSSxlQUE3Qjs7QUFDQUEsVUFBQUEsZUFBZSxJQUFJRyxPQUFPLENBQUNFLEtBQTNCO0FBQ0g7O0FBQ0QsYUFBS0Qsa0JBQUwsQ0FBd0JSLElBQXhCLENBQTZCSSxlQUE3Qjs7QUFFQSxZQUFNTSxlQUF5QixHQUFHLEVBQWxDOztBQUNBLGFBQUssSUFBSUwsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBRyxLQUFLSCxTQUFMLENBQWVJLE1BQW5DLEVBQTJDRCxFQUFDLEVBQTVDLEVBQWdEO0FBQzVDLGNBQU1FLFFBQU8sR0FBRyxLQUFLTCxTQUFMLENBQWVHLEVBQWYsQ0FBaEI7O0FBQ0EsY0FBSUUsUUFBTyxDQUFDSSxjQUFSLEdBQXlCQyw0Q0FBN0IsRUFBc0Q7QUFDbEQsaUJBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR04sUUFBTyxDQUFDRSxLQUE1QixFQUFtQ0ksQ0FBQyxFQUFwQyxFQUF3QztBQUNwQ0gsY0FBQUEsZUFBZSxDQUFDVixJQUFoQixDQUFxQkssRUFBckI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsYUFBS1QsdUJBQUwsR0FBK0I7QUFDM0JPLFVBQUFBLFFBQVEsRUFBRSxLQUFLRCxTQURZO0FBRTNCUSxVQUFBQSxlQUFlLEVBQWZBLGVBRjJCO0FBRzNCSSxVQUFBQSxpQkFBaUIsRUFBRSxLQUFLTixrQkFIRztBQUkzQkosVUFBQUEsZUFBZSxFQUFmQTtBQUoyQixTQUEvQjtBQU9BLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsYUFBS0YsU0FBTCxDQUFlSSxNQUFmLEdBQXdCLENBQXhCO0FBQ0g7OzswQkFyQzZCO0FBQUUsZUFBTyxLQUFLVix1QkFBWjtBQUF1Qzs7OztJQUY3Qm1CLDJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldExheW91dCwgR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8sIERFU0NSSVBUT1JfRFlOQU1JQ19UWVBFIH0gZnJvbSAnLi4vZGVzY3JpcHRvci1zZXQtbGF5b3V0JztcclxuaW1wb3J0IHsgSVdlYkdMR1BVRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMRGVzY3JpcHRvclNldExheW91dCBleHRlbmRzIEdGWERlc2NyaXB0b3JTZXRMYXlvdXQge1xyXG5cclxuICAgIGdldCBncHVEZXNjcmlwdG9yU2V0TGF5b3V0ICgpIHsgcmV0dXJuIHRoaXMuX2dwdURlc2NyaXB0b3JTZXRMYXlvdXQhOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1RGVzY3JpcHRvclNldExheW91dDogSVdlYkdMR1BVRGVzY3JpcHRvclNldExheW91dCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0SW5mbykge1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX2JpbmRpbmdzLCBpbmZvLmJpbmRpbmdzKTtcclxuXHJcbiAgICAgICAgbGV0IGRlc2NyaXB0b3JDb3VudCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gdGhpcy5fYmluZGluZ3NbaV07XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JJbmRpY2VzLnB1c2goZGVzY3JpcHRvckNvdW50KTtcclxuICAgICAgICAgICAgZGVzY3JpcHRvckNvdW50ICs9IGJpbmRpbmcuY291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JJbmRpY2VzLnB1c2goZGVzY3JpcHRvckNvdW50KTtcclxuXHJcbiAgICAgICAgY29uc3QgZHluYW1pY0JpbmRpbmdzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYmluZGluZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IHRoaXMuX2JpbmRpbmdzW2ldO1xyXG4gICAgICAgICAgICBpZiAoYmluZGluZy5kZXNjcmlwdG9yVHlwZSAmIERFU0NSSVBUT1JfRFlOQU1JQ19UWVBFKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJpbmRpbmcuY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNCaW5kaW5ncy5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ncHVEZXNjcmlwdG9yU2V0TGF5b3V0ID0ge1xyXG4gICAgICAgICAgICBiaW5kaW5nczogdGhpcy5fYmluZGluZ3MsXHJcbiAgICAgICAgICAgIGR5bmFtaWNCaW5kaW5ncyxcclxuICAgICAgICAgICAgZGVzY3JpcHRvckluZGljZXM6IHRoaXMuX2Rlc2NyaXB0b3JJbmRpY2VzLFxyXG4gICAgICAgICAgICBkZXNjcmlwdG9yQ291bnQsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX2JpbmRpbmdzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn1cclxuIl19