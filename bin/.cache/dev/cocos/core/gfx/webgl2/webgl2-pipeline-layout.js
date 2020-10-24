(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../pipeline-layout.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../pipeline-layout.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pipelineLayout);
    global.webgl2PipelineLayout = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pipelineLayout) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2PipelineLayout = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2PipelineLayout = /*#__PURE__*/function (_GFXPipelineLayout) {
    _inherits(WebGL2PipelineLayout, _GFXPipelineLayout);

    function WebGL2PipelineLayout() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2PipelineLayout);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2PipelineLayout)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuPipelineLayout = null;
      return _this;
    }

    _createClass(WebGL2PipelineLayout, [{
      key: "initialize",
      value: function initialize(info) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);
        var dynamicOffsetIndices = [];
        var gpuSetLayouts = [];
        var dynamicOffsetOffsets = [];
        var dynamicOffsetCount = 0;
        var idx = 0;

        for (var i = 0; i < this._setLayouts.length; i++) {
          var setLayout = this._setLayouts[i];
          var dynamicBindings = setLayout.gpuDescriptorSetLayout.dynamicBindings;
          var bindings = setLayout.bindings;
          var indices = [];
          gpuSetLayouts.push(setLayout.gpuDescriptorSetLayout);

          for (var j = 0, k = 0; j < bindings.length; j++) {
            if (dynamicBindings[k] === j) {
              indices.push(idx);

              while (dynamicBindings[k] === j) {
                k++, idx++;
              }
            } else {
              indices.push(-1);
            }
          }

          dynamicOffsetIndices.push(indices);
          dynamicOffsetOffsets.push(dynamicOffsetCount);
          dynamicOffsetCount += dynamicBindings.length;
        }

        this._gpuPipelineLayout = {
          gpuSetLayouts: gpuSetLayouts,
          dynamicOffsetCount: dynamicOffsetCount,
          dynamicOffsetOffsets: dynamicOffsetOffsets,
          dynamicOffsetIndices: dynamicOffsetIndices
        };
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._setLayouts.length = 0;
      }
    }, {
      key: "gpuPipelineLayout",
      get: function get() {
        return this._gpuPipelineLayout;
      }
    }]);

    return WebGL2PipelineLayout;
  }(_pipelineLayout.GFXPipelineLayout);

  _exports.WebGL2PipelineLayout = WebGL2PipelineLayout;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItcGlwZWxpbmUtbGF5b3V0LnRzIl0sIm5hbWVzIjpbIldlYkdMMlBpcGVsaW5lTGF5b3V0IiwiX2dwdVBpcGVsaW5lTGF5b3V0IiwiaW5mbyIsIkFycmF5IiwicHJvdG90eXBlIiwicHVzaCIsImFwcGx5IiwiX3NldExheW91dHMiLCJzZXRMYXlvdXRzIiwiZHluYW1pY09mZnNldEluZGljZXMiLCJncHVTZXRMYXlvdXRzIiwiZHluYW1pY09mZnNldE9mZnNldHMiLCJkeW5hbWljT2Zmc2V0Q291bnQiLCJpZHgiLCJpIiwibGVuZ3RoIiwic2V0TGF5b3V0IiwiZHluYW1pY0JpbmRpbmdzIiwiZ3B1RGVzY3JpcHRvclNldExheW91dCIsImJpbmRpbmdzIiwiaW5kaWNlcyIsImoiLCJrIiwiR0ZYUGlwZWxpbmVMYXlvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BSWFBLG9COzs7Ozs7Ozs7Ozs7Ozs7WUFJREMsa0IsR0FBc0QsSTs7Ozs7O2lDQUUzQ0MsSSxFQUE2QjtBQUM1Q0MsUUFBQUEsS0FBSyxDQUFDQyxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsS0FBckIsQ0FBMkIsS0FBS0MsV0FBaEMsRUFBNkNMLElBQUksQ0FBQ00sVUFBbEQ7QUFFQSxZQUFNQyxvQkFBZ0MsR0FBRyxFQUF6QztBQUVBLFlBQU1DLGFBQThDLEdBQUcsRUFBdkQ7QUFDQSxZQUFNQyxvQkFBOEIsR0FBRyxFQUF2QztBQUNBLFlBQUlDLGtCQUFrQixHQUFHLENBQXpCO0FBQTRCLFlBQUlDLEdBQUcsR0FBRyxDQUFWOztBQUM1QixhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS1AsV0FBTCxDQUFpQlEsTUFBckMsRUFBNkNELENBQUMsRUFBOUMsRUFBa0Q7QUFDOUMsY0FBTUUsU0FBUyxHQUFHLEtBQUtULFdBQUwsQ0FBaUJPLENBQWpCLENBQWxCO0FBQ0EsY0FBTUcsZUFBZSxHQUFHRCxTQUFTLENBQUNFLHNCQUFWLENBQWlDRCxlQUF6RDtBQUNBLGNBQU1FLFFBQVEsR0FBR0gsU0FBUyxDQUFDRyxRQUEzQjtBQUNBLGNBQU1DLE9BQWlCLEdBQUcsRUFBMUI7QUFDQVYsVUFBQUEsYUFBYSxDQUFDTCxJQUFkLENBQW1CVyxTQUFTLENBQUNFLHNCQUE3Qjs7QUFDQSxlQUFLLElBQUlHLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBRyxDQUFwQixFQUF1QkQsQ0FBQyxHQUFHRixRQUFRLENBQUNKLE1BQXBDLEVBQTRDTSxDQUFDLEVBQTdDLEVBQWlEO0FBQzdDLGdCQUFJSixlQUFlLENBQUNLLENBQUQsQ0FBZixLQUF1QkQsQ0FBM0IsRUFBOEI7QUFDMUJELGNBQUFBLE9BQU8sQ0FBQ2YsSUFBUixDQUFhUSxHQUFiOztBQUNBLHFCQUFPSSxlQUFlLENBQUNLLENBQUQsQ0FBZixLQUF1QkQsQ0FBOUI7QUFBaUNDLGdCQUFBQSxDQUFDLElBQUlULEdBQUcsRUFBUjtBQUFqQztBQUNILGFBSEQsTUFHTztBQUNITyxjQUFBQSxPQUFPLENBQUNmLElBQVIsQ0FBYSxDQUFDLENBQWQ7QUFDSDtBQUNKOztBQUVESSxVQUFBQSxvQkFBb0IsQ0FBQ0osSUFBckIsQ0FBMEJlLE9BQTFCO0FBQ0FULFVBQUFBLG9CQUFvQixDQUFDTixJQUFyQixDQUEwQk8sa0JBQTFCO0FBQ0FBLFVBQUFBLGtCQUFrQixJQUFJSyxlQUFlLENBQUNGLE1BQXRDO0FBQ0g7O0FBRUQsYUFBS2Qsa0JBQUwsR0FBMEI7QUFDdEJTLFVBQUFBLGFBQWEsRUFBYkEsYUFEc0I7QUFFdEJFLFVBQUFBLGtCQUFrQixFQUFsQkEsa0JBRnNCO0FBR3RCRCxVQUFBQSxvQkFBb0IsRUFBcEJBLG9CQUhzQjtBQUl0QkYsVUFBQUEsb0JBQW9CLEVBQXBCQTtBQUpzQixTQUExQjtBQU9BLGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsYUFBS0YsV0FBTCxDQUFpQlEsTUFBakIsR0FBMEIsQ0FBMUI7QUFDSDs7OzBCQTVDd0I7QUFBRSxlQUFPLEtBQUtkLGtCQUFaO0FBQWtDOzs7O0lBRnZCc0IsaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhQaXBlbGluZUxheW91dCwgR0ZYUGlwZWxpbmVMYXlvdXRJbmZvIH0gZnJvbSAnLi4vcGlwZWxpbmUtbGF5b3V0JztcclxuaW1wb3J0IHsgSVdlYkdMMkdQVVBpcGVsaW5lTGF5b3V0LCBJV2ViR0wyR1BVRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vd2ViZ2wyLWdwdS1vYmplY3RzJztcclxuaW1wb3J0IHsgV2ViR0wyRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vd2ViZ2wyLWRlc2NyaXB0b3Itc2V0LWxheW91dCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyUGlwZWxpbmVMYXlvdXQgZXh0ZW5kcyBHRlhQaXBlbGluZUxheW91dCB7XHJcblxyXG4gICAgZ2V0IGdwdVBpcGVsaW5lTGF5b3V0ICgpIHsgcmV0dXJuIHRoaXMuX2dwdVBpcGVsaW5lTGF5b3V0ITsgfVxyXG5cclxuICAgIHByaXZhdGUgX2dwdVBpcGVsaW5lTGF5b3V0OiBJV2ViR0wyR1BVUGlwZWxpbmVMYXlvdXQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYUGlwZWxpbmVMYXlvdXRJbmZvKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fc2V0TGF5b3V0cywgaW5mby5zZXRMYXlvdXRzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZHluYW1pY09mZnNldEluZGljZXM6IG51bWJlcltdW10gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3B1U2V0TGF5b3V0czogSVdlYkdMMkdQVURlc2NyaXB0b3JTZXRMYXlvdXRbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGR5bmFtaWNPZmZzZXRPZmZzZXRzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGxldCBkeW5hbWljT2Zmc2V0Q291bnQgPSAwOyBsZXQgaWR4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3NldExheW91dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc2V0TGF5b3V0ID0gdGhpcy5fc2V0TGF5b3V0c1tpXSBhcyBXZWJHTDJEZXNjcmlwdG9yU2V0TGF5b3V0O1xyXG4gICAgICAgICAgICBjb25zdCBkeW5hbWljQmluZGluZ3MgPSBzZXRMYXlvdXQuZ3B1RGVzY3JpcHRvclNldExheW91dC5keW5hbWljQmluZGluZ3M7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpbmRpbmdzID0gc2V0TGF5b3V0LmJpbmRpbmdzO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBncHVTZXRMYXlvdXRzLnB1c2goc2V0TGF5b3V0LmdwdURlc2NyaXB0b3JTZXRMYXlvdXQpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgayA9IDA7IGogPCBiaW5kaW5ncy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGR5bmFtaWNCaW5kaW5nc1trXSA9PT0gaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChpZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChkeW5hbWljQmluZGluZ3Nba10gPT09IGopIGsrKywgaWR4Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCgtMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGR5bmFtaWNPZmZzZXRJbmRpY2VzLnB1c2goaW5kaWNlcyk7XHJcbiAgICAgICAgICAgIGR5bmFtaWNPZmZzZXRPZmZzZXRzLnB1c2goZHluYW1pY09mZnNldENvdW50KTtcclxuICAgICAgICAgICAgZHluYW1pY09mZnNldENvdW50ICs9IGR5bmFtaWNCaW5kaW5ncy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ncHVQaXBlbGluZUxheW91dCA9IHtcclxuICAgICAgICAgICAgZ3B1U2V0TGF5b3V0cyxcclxuICAgICAgICAgICAgZHluYW1pY09mZnNldENvdW50LFxyXG4gICAgICAgICAgICBkeW5hbWljT2Zmc2V0T2Zmc2V0cyxcclxuICAgICAgICAgICAgZHluYW1pY09mZnNldEluZGljZXMsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX3NldExheW91dHMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufVxyXG4iXX0=