(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../forward/enum.js", "../render-flow.js", "./ui-stage.js", "../pipeline-serialization.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../forward/enum.js"), require("../render-flow.js"), require("./ui-stage.js"), require("../pipeline-serialization.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global._enum, global.renderFlow, global.uiStage, global.pipelineSerialization);
    global.uiFlow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _enum, _renderFlow, _uiStage, _pipelineSerialization) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIFlow = void 0;

  var _dec, _class, _class2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * @en The UI render flow
   * @zh UI渲染流程。
   */
  var UIFlow = (_dec = (0, _index.ccclass)('UIFlow'), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_RenderFlow) {
    _inherits(UIFlow, _RenderFlow);

    function UIFlow() {
      _classCallCheck(this, UIFlow);

      return _possibleConstructorReturn(this, _getPrototypeOf(UIFlow).apply(this, arguments));
    }

    _createClass(UIFlow, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(UIFlow.prototype), "initialize", this).call(this, info);

        if (this._stages.length === 0) {
          var uiStage = new _uiStage.UIStage();
          uiStage.initialize(_uiStage.UIStage.initInfo);

          this._stages.push(uiStage);
        }

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(UIFlow.prototype), "destroy", this).call(this);
      }
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        pipeline.updateUBOs(view);

        _get(_getPrototypeOf(UIFlow.prototype), "render", this).call(this, view);
      }
    }]);

    return UIFlow;
  }(_renderFlow.RenderFlow), _class2.initInfo = {
    name: 'UIFlow',
    priority: _enum.ForwardFlowPriority.UI,
    tag: _pipelineSerialization.RenderFlowTag.UI,
    stages: []
  }, _temp)) || _class);
  _exports.UIFlow = UIFlow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvdWkvdWktZmxvdy50cyJdLCJuYW1lcyI6WyJVSUZsb3ciLCJpbmZvIiwiX3N0YWdlcyIsImxlbmd0aCIsInVpU3RhZ2UiLCJVSVN0YWdlIiwiaW5pdGlhbGl6ZSIsImluaXRJbmZvIiwicHVzaCIsInZpZXciLCJwaXBlbGluZSIsIl9waXBlbGluZSIsInVwZGF0ZVVCT3MiLCJSZW5kZXJGbG93IiwibmFtZSIsInByaW9yaXR5IiwiRm9yd2FyZEZsb3dQcmlvcml0eSIsIlVJIiwidGFnIiwiUmVuZGVyRmxvd1RhZyIsInN0YWdlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQTs7OztNQUthQSxNLFdBRFosb0JBQVEsUUFBUixDOzs7Ozs7Ozs7OztpQ0FVc0JDLEksRUFBZ0M7QUFDL0MsK0VBQWlCQSxJQUFqQjs7QUFDQSxZQUFJLEtBQUtDLE9BQUwsQ0FBYUMsTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUMzQixjQUFNQyxPQUFPLEdBQUcsSUFBSUMsZ0JBQUosRUFBaEI7QUFDQUQsVUFBQUEsT0FBTyxDQUFDRSxVQUFSLENBQW1CRCxpQkFBUUUsUUFBM0I7O0FBQ0EsZUFBS0wsT0FBTCxDQUFhTSxJQUFiLENBQWtCSixPQUFsQjtBQUNIOztBQUNELGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2Q7QUFDSDs7OzZCQUVjSyxJLEVBQWtCO0FBQzdCLFlBQU1DLFFBQVEsR0FBRyxLQUFLQyxTQUF0QjtBQUNBRCxRQUFBQSxRQUFRLENBQUNFLFVBQVQsQ0FBb0JILElBQXBCOztBQUNBLDJFQUFhQSxJQUFiO0FBQ0g7Ozs7SUEzQnVCSSxzQixXQUVWTixRLEdBQTRCO0FBQ3RDTyxJQUFBQSxJQUFJLEVBQUUsUUFEZ0M7QUFFdENDLElBQUFBLFFBQVEsRUFBRUMsMEJBQW9CQyxFQUZRO0FBR3RDQyxJQUFBQSxHQUFHLEVBQUVDLHFDQUFjRixFQUhtQjtBQUl0Q0csSUFBQUEsTUFBTSxFQUFFO0FBSjhCLEciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lXHJcbiAqL1xyXG5pbXBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgRm9yd2FyZEZsb3dQcmlvcml0eSB9IGZyb20gJy4uL2ZvcndhcmQvZW51bSc7XHJcbmltcG9ydCB7IElSZW5kZXJGbG93SW5mbywgUmVuZGVyRmxvdyB9IGZyb20gJy4uL3JlbmRlci1mbG93JztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4uL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgVUlTdGFnZSB9IGZyb20gJy4vdWktc3RhZ2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJGbG93VGFnIH0gZnJvbSAnLi4vcGlwZWxpbmUtc2VyaWFsaXphdGlvbic7XHJcbmltcG9ydCB7IEZvcndhcmRQaXBlbGluZSB9IGZyb20gJy4uL2ZvcndhcmQvZm9yd2FyZC1waXBlbGluZSc7XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBVSSByZW5kZXIgZmxvd1xyXG4gKiBAemggVUnmuLLmn5PmtYHnqIvjgIJcclxuICovXHJcbkBjY2NsYXNzKCdVSUZsb3cnKVxyXG5leHBvcnQgY2xhc3MgVUlGbG93IGV4dGVuZHMgUmVuZGVyRmxvdyB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0SW5mbzogSVJlbmRlckZsb3dJbmZvID0ge1xyXG4gICAgICAgIG5hbWU6ICdVSUZsb3cnLFxyXG4gICAgICAgIHByaW9yaXR5OiBGb3J3YXJkRmxvd1ByaW9yaXR5LlVJLFxyXG4gICAgICAgIHRhZzogUmVuZGVyRmxvd1RhZy5VSSxcclxuICAgICAgICBzdGFnZXM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUmVuZGVyRmxvd0luZm8pOiBib29sZWFuIHtcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKGluZm8pO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGFnZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVpU3RhZ2UgPSBuZXcgVUlTdGFnZSgpO1xyXG4gICAgICAgICAgICB1aVN0YWdlLmluaXRpYWxpemUoVUlTdGFnZS5pbml0SW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YWdlcy5wdXNoKHVpU3RhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIgKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuX3BpcGVsaW5lIGFzIEZvcndhcmRQaXBlbGluZTtcclxuICAgICAgICBwaXBlbGluZS51cGRhdGVVQk9zKHZpZXcpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcih2aWV3KTtcclxuICAgIH1cclxufVxyXG4iXX0=