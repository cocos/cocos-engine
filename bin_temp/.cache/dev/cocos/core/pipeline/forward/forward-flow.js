(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../render-flow.js", "./enum.js", "./forward-stage.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../render-flow.js"), require("./enum.js"), require("./forward-stage.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.renderFlow, global._enum, global.forwardStage);
    global.forwardFlow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _renderFlow, _enum, _forwardStage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ForwardFlow = void 0;

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
   * @en The forward flow in forward render pipeline
   * @zh 前向渲染流程。
   */
  var ForwardFlow = (_dec = (0, _index.ccclass)('ForwardFlow'), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_RenderFlow) {
    _inherits(ForwardFlow, _RenderFlow);

    function ForwardFlow() {
      _classCallCheck(this, ForwardFlow);

      return _possibleConstructorReturn(this, _getPrototypeOf(ForwardFlow).apply(this, arguments));
    }

    _createClass(ForwardFlow, [{
      key: "initialize",

      /**
       * @en The shared initialization information of forward render flow
       * @zh 共享的前向渲染流程初始化参数
       */
      value: function initialize(info) {
        _get(_getPrototypeOf(ForwardFlow.prototype), "initialize", this).call(this, info);

        if (this._stages.length === 0) {
          var forwardStage = new _forwardStage.ForwardStage();
          forwardStage.initialize(_forwardStage.ForwardStage.initInfo);

          this._stages.push(forwardStage);
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline) {
        _get(_getPrototypeOf(ForwardFlow.prototype), "activate", this).call(this, pipeline);
      }
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        pipeline.updateUBOs(view);

        _get(_getPrototypeOf(ForwardFlow.prototype), "render", this).call(this, view);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(ForwardFlow.prototype), "destroy", this).call(this);
      }
    }]);

    return ForwardFlow;
  }(_renderFlow.RenderFlow), _class2.initInfo = {
    name: _define.PIPELINE_FLOW_FORWARD,
    priority: _enum.ForwardFlowPriority.FORWARD,
    stages: []
  }, _temp)) || _class);
  _exports.ForwardFlow = ForwardFlow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZm9yd2FyZC9mb3J3YXJkLWZsb3cudHMiXSwibmFtZXMiOlsiRm9yd2FyZEZsb3ciLCJpbmZvIiwiX3N0YWdlcyIsImxlbmd0aCIsImZvcndhcmRTdGFnZSIsIkZvcndhcmRTdGFnZSIsImluaXRpYWxpemUiLCJpbml0SW5mbyIsInB1c2giLCJwaXBlbGluZSIsInZpZXciLCJfcGlwZWxpbmUiLCJ1cGRhdGVVQk9zIiwiUmVuZGVyRmxvdyIsIm5hbWUiLCJQSVBFTElORV9GTE9XX0ZPUldBUkQiLCJwcmlvcml0eSIsIkZvcndhcmRGbG93UHJpb3JpdHkiLCJGT1JXQVJEIiwic3RhZ2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBOzs7O01BS2FBLFcsV0FEWixvQkFBUSxhQUFSLEM7Ozs7Ozs7Ozs7OztBQUdHOzs7O2lDQVVtQkMsSSxFQUFnQztBQUMvQyxvRkFBaUJBLElBQWpCOztBQUNBLFlBQUksS0FBS0MsT0FBTCxDQUFhQyxNQUFiLEtBQXdCLENBQTVCLEVBQStCO0FBQzNCLGNBQU1DLFlBQVksR0FBRyxJQUFJQywwQkFBSixFQUFyQjtBQUNBRCxVQUFBQSxZQUFZLENBQUNFLFVBQWIsQ0FBd0JELDJCQUFhRSxRQUFyQzs7QUFDQSxlQUFLTCxPQUFMLENBQWFNLElBQWIsQ0FBa0JKLFlBQWxCO0FBQ0g7O0FBQ0QsZUFBTyxJQUFQO0FBQ0g7OzsrQkFFZ0JLLFEsRUFBMEI7QUFDdkMsa0ZBQWVBLFFBQWY7QUFDSDs7OzZCQUVjQyxJLEVBQWtCO0FBQzdCLFlBQU1ELFFBQVEsR0FBRyxLQUFLRSxTQUF0QjtBQUNBRixRQUFBQSxRQUFRLENBQUNHLFVBQVQsQ0FBb0JGLElBQXBCOztBQUNBLGdGQUFhQSxJQUFiO0FBQ0g7OztnQ0FFaUI7QUFDZDtBQUNIOzs7O0lBbEM0Qkcsc0IsV0FNZk4sUSxHQUE0QjtBQUN0Q08sSUFBQUEsSUFBSSxFQUFFQyw2QkFEZ0M7QUFFdENDLElBQUFBLFFBQVEsRUFBRUMsMEJBQW9CQyxPQUZRO0FBR3RDQyxJQUFBQSxNQUFNLEVBQUU7QUFIOEIsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUElQRUxJTkVfRkxPV19GT1JXQVJEIH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgSVJlbmRlckZsb3dJbmZvLCBSZW5kZXJGbG93IH0gZnJvbSAnLi4vcmVuZGVyLWZsb3cnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBGb3J3YXJkRmxvd1ByaW9yaXR5IH0gZnJvbSAnLi9lbnVtJztcclxuaW1wb3J0IHsgRm9yd2FyZFN0YWdlIH0gZnJvbSAnLi9mb3J3YXJkLXN0YWdlJztcclxuaW1wb3J0IHsgRm9yd2FyZFBpcGVsaW5lIH0gZnJvbSAnLi9mb3J3YXJkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyUGlwZWxpbmUgfSBmcm9tICcuLi9yZW5kZXItcGlwZWxpbmUnO1xyXG4vKipcclxuICogQGVuIFRoZSBmb3J3YXJkIGZsb3cgaW4gZm9yd2FyZCByZW5kZXIgcGlwZWxpbmVcclxuICogQHpoIOWJjeWQkea4suafk+a1geeoi+OAglxyXG4gKi9cclxuQGNjY2xhc3MoJ0ZvcndhcmRGbG93JylcclxuZXhwb3J0IGNsYXNzIEZvcndhcmRGbG93IGV4dGVuZHMgUmVuZGVyRmxvdyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHNoYXJlZCBpbml0aWFsaXphdGlvbiBpbmZvcm1hdGlvbiBvZiBmb3J3YXJkIHJlbmRlciBmbG93XHJcbiAgICAgKiBAemgg5YWx5Lqr55qE5YmN5ZCR5riy5p+T5rWB56iL5Yid5aeL5YyW5Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdEluZm86IElSZW5kZXJGbG93SW5mbyA9IHtcclxuICAgICAgICBuYW1lOiBQSVBFTElORV9GTE9XX0ZPUldBUkQsXHJcbiAgICAgICAgcHJpb3JpdHk6IEZvcndhcmRGbG93UHJpb3JpdHkuRk9SV0FSRCxcclxuICAgICAgICBzdGFnZXM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUmVuZGVyRmxvd0luZm8pOiBib29sZWFuIHtcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKGluZm8pO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGFnZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcndhcmRTdGFnZSA9IG5ldyBGb3J3YXJkU3RhZ2UoKTtcclxuICAgICAgICAgICAgZm9yd2FyZFN0YWdlLmluaXRpYWxpemUoRm9yd2FyZFN0YWdlLmluaXRJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhZ2VzLnB1c2goZm9yd2FyZFN0YWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2YXRlIChwaXBlbGluZTogUmVuZGVyUGlwZWxpbmUpIHtcclxuICAgICAgICBzdXBlci5hY3RpdmF0ZShwaXBlbGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlciAodmlldzogUmVuZGVyVmlldykge1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5fcGlwZWxpbmUgYXMgRm9yd2FyZFBpcGVsaW5lO1xyXG4gICAgICAgIHBpcGVsaW5lLnVwZGF0ZVVCT3Modmlldyk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKHZpZXcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbn1cclxuIl19