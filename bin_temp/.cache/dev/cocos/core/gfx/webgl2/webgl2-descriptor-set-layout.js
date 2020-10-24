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
    global.webgl2DescriptorSetLayout = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _descriptorSetLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2DescriptorSetLayout = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2DescriptorSetLayout = /*#__PURE__*/function (_GFXDescriptorSetLayo) {
    _inherits(WebGL2DescriptorSetLayout, _GFXDescriptorSetLayo);

    function WebGL2DescriptorSetLayout() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2DescriptorSetLayout);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2DescriptorSetLayout)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuDescriptorSetLayout = null;
      return _this;
    }

    _createClass(WebGL2DescriptorSetLayout, [{
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

    return WebGL2DescriptorSetLayout;
  }(_descriptorSetLayout.GFXDescriptorSetLayout);

  _exports.WebGL2DescriptorSetLayout = WebGL2DescriptorSetLayout;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItZGVzY3JpcHRvci1zZXQtbGF5b3V0LnRzIl0sIm5hbWVzIjpbIldlYkdMMkRlc2NyaXB0b3JTZXRMYXlvdXQiLCJfZ3B1RGVzY3JpcHRvclNldExheW91dCIsImluZm8iLCJBcnJheSIsInByb3RvdHlwZSIsInB1c2giLCJhcHBseSIsIl9iaW5kaW5ncyIsImJpbmRpbmdzIiwiZGVzY3JpcHRvckNvdW50IiwiaSIsImxlbmd0aCIsImJpbmRpbmciLCJfZGVzY3JpcHRvckluZGljZXMiLCJjb3VudCIsImR5bmFtaWNCaW5kaW5ncyIsImRlc2NyaXB0b3JUeXBlIiwiREVTQ1JJUFRPUl9EWU5BTUlDX1RZUEUiLCJqIiwiZGVzY3JpcHRvckluZGljZXMiLCJHRlhEZXNjcmlwdG9yU2V0TGF5b3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUdhQSx5Qjs7Ozs7Ozs7Ozs7Ozs7O1lBSURDLHVCLEdBQWdFLEk7Ozs7OztpQ0FFckRDLEksRUFBa0M7QUFDakRDLFFBQUFBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLEtBQXJCLENBQTJCLEtBQUtDLFNBQWhDLEVBQTJDTCxJQUFJLENBQUNNLFFBQWhEO0FBRUEsWUFBSUMsZUFBZSxHQUFHLENBQXRCOztBQUNBLGFBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLSCxTQUFMLENBQWVJLE1BQW5DLEVBQTJDRCxDQUFDLEVBQTVDLEVBQWdEO0FBQzVDLGNBQU1FLE9BQU8sR0FBRyxLQUFLTCxTQUFMLENBQWVHLENBQWYsQ0FBaEI7O0FBQ0EsZUFBS0csa0JBQUwsQ0FBd0JSLElBQXhCLENBQTZCSSxlQUE3Qjs7QUFDQUEsVUFBQUEsZUFBZSxJQUFJRyxPQUFPLENBQUNFLEtBQTNCO0FBQ0g7O0FBQ0QsYUFBS0Qsa0JBQUwsQ0FBd0JSLElBQXhCLENBQTZCSSxlQUE3Qjs7QUFFQSxZQUFNTSxlQUF5QixHQUFHLEVBQWxDOztBQUNBLGFBQUssSUFBSUwsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBRyxLQUFLSCxTQUFMLENBQWVJLE1BQW5DLEVBQTJDRCxFQUFDLEVBQTVDLEVBQWdEO0FBQzVDLGNBQU1FLFFBQU8sR0FBRyxLQUFLTCxTQUFMLENBQWVHLEVBQWYsQ0FBaEI7O0FBQ0EsY0FBSUUsUUFBTyxDQUFDSSxjQUFSLEdBQXlCQyw0Q0FBN0IsRUFBc0Q7QUFDbEQsaUJBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR04sUUFBTyxDQUFDRSxLQUE1QixFQUFtQ0ksQ0FBQyxFQUFwQyxFQUF3QztBQUNwQ0gsY0FBQUEsZUFBZSxDQUFDVixJQUFoQixDQUFxQkssRUFBckI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsYUFBS1QsdUJBQUwsR0FBK0I7QUFDM0JPLFVBQUFBLFFBQVEsRUFBRSxLQUFLRCxTQURZO0FBRTNCUSxVQUFBQSxlQUFlLEVBQWZBLGVBRjJCO0FBRzNCSSxVQUFBQSxpQkFBaUIsRUFBRSxLQUFLTixrQkFIRztBQUkzQkosVUFBQUEsZUFBZSxFQUFmQTtBQUoyQixTQUEvQjtBQU9BLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsYUFBS0YsU0FBTCxDQUFlSSxNQUFmLEdBQXdCLENBQXhCO0FBQ0g7OzswQkFyQzZCO0FBQUUsZUFBTyxLQUFLVix1QkFBWjtBQUF1Qzs7OztJQUY1Qm1CLDJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldExheW91dCwgR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8sIERFU0NSSVBUT1JfRFlOQU1JQ19UWVBFIH0gZnJvbSAnLi4vZGVzY3JpcHRvci1zZXQtbGF5b3V0JztcclxuaW1wb3J0IHsgSVdlYkdMMkdQVURlc2NyaXB0b3JTZXRMYXlvdXQgfSBmcm9tICcuL3dlYmdsMi1ncHUtb2JqZWN0cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyRGVzY3JpcHRvclNldExheW91dCBleHRlbmRzIEdGWERlc2NyaXB0b3JTZXRMYXlvdXQge1xyXG5cclxuICAgIGdldCBncHVEZXNjcmlwdG9yU2V0TGF5b3V0ICgpIHsgcmV0dXJuIHRoaXMuX2dwdURlc2NyaXB0b3JTZXRMYXlvdXQhOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1RGVzY3JpcHRvclNldExheW91dDogSVdlYkdMMkdQVURlc2NyaXB0b3JTZXRMYXlvdXQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8pIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLl9iaW5kaW5ncywgaW5mby5iaW5kaW5ncyk7XHJcblxyXG4gICAgICAgIGxldCBkZXNjcmlwdG9yQ291bnQgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYmluZGluZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IHRoaXMuX2JpbmRpbmdzW2ldO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9ySW5kaWNlcy5wdXNoKGRlc2NyaXB0b3JDb3VudCk7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3JDb3VudCArPSBiaW5kaW5nLmNvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9ySW5kaWNlcy5wdXNoKGRlc2NyaXB0b3JDb3VudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGR5bmFtaWNCaW5kaW5nczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2JpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpbmRpbmcgPSB0aGlzLl9iaW5kaW5nc1tpXTtcclxuICAgICAgICAgICAgaWYgKGJpbmRpbmcuZGVzY3JpcHRvclR5cGUgJiBERVNDUklQVE9SX0RZTkFNSUNfVFlQRSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBiaW5kaW5nLmNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljQmluZGluZ3MucHVzaChpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZ3B1RGVzY3JpcHRvclNldExheW91dCA9IHtcclxuICAgICAgICAgICAgYmluZGluZ3M6IHRoaXMuX2JpbmRpbmdzLFxyXG4gICAgICAgICAgICBkeW5hbWljQmluZGluZ3MsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3JJbmRpY2VzOiB0aGlzLl9kZXNjcmlwdG9ySW5kaWNlcyxcclxuICAgICAgICAgICAgZGVzY3JpcHRvckNvdW50LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9iaW5kaW5ncy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==