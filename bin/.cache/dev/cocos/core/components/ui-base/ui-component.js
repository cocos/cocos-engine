(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../component.js", "./ui-transform.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../component.js"), require("./ui-transform.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.component, global.uiTransform);
    global.uiComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _component, _uiTransform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIComponent = void 0;

  var _dec, _dec2, _dec3, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * @zh
   * UI 及 UI 模型渲染基类。
   */
  var UIComponent = (_dec = (0, _index.ccclass)('cc.UIComponent'), _dec2 = (0, _index.requireComponent)(_uiTransform.UITransform), _dec3 = (0, _index.executionOrder)(110), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.disallowMultiple)(_class = (0, _index.executeInEditMode)(_class = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(UIComponent, _Component);

    function UIComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UIComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._lastParent = null;
      return _this;
    }

    _createClass(UIComponent, [{
      key: "__preload",
      value: function __preload() {
        this.node._uiProps.uiComp = this;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {}
    }, {
      key: "onDisable",
      value: function onDisable() {}
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this.node._uiProps.uiComp === this) {
          this.node._uiProps.uiComp = null;
        }
      }
    }, {
      key: "updateAssembler",
      value: function updateAssembler(render) {}
    }, {
      key: "postUpdateAssembler",
      value: function postUpdateAssembler(render) {}
    }]);

    return UIComponent;
  }(_component.Component), _temp)) || _class) || _class) || _class) || _class) || _class);
  _exports.UIComponent = UIComponent;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLWNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJVSUNvbXBvbmVudCIsIlVJVHJhbnNmb3JtIiwiZGlzYWxsb3dNdWx0aXBsZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2xhc3RQYXJlbnQiLCJub2RlIiwiX3VpUHJvcHMiLCJ1aUNvbXAiLCJyZW5kZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0E7Ozs7TUFTYUEsVyxXQUxaLG9CQUFRLGdCQUFSLEMsVUFDQSw2QkFBaUJDLHdCQUFqQixDLFVBQ0EsMkJBQWUsR0FBZixDLGtEQUNBQyx1QixlQUNBQyx3Qjs7Ozs7Ozs7Ozs7Ozs7O1lBR2FDLFcsR0FBMkIsSTs7Ozs7O2tDQUVqQjtBQUNoQixhQUFLQyxJQUFMLENBQVVDLFFBQVYsQ0FBbUJDLE1BQW5CLEdBQTRCLElBQTVCO0FBQ0g7OztpQ0FFa0IsQ0FDbEI7OztrQ0FFbUIsQ0FFbkI7OztrQ0FFbUI7QUFDaEIsWUFBSSxLQUFLRixJQUFMLENBQVVDLFFBQVYsQ0FBbUJDLE1BQW5CLEtBQThCLElBQWxDLEVBQXdDO0FBQ3BDLGVBQUtGLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsTUFBbkIsR0FBNEIsSUFBNUI7QUFDSDtBQUNKOzs7c0NBRXVCQyxNLEVBQVksQ0FDbkM7OzswQ0FFMkJBLE0sRUFBWSxDQUN2Qzs7OztJQXpCNEJDLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgZGlzYWxsb3dNdWx0aXBsZSwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCByZXF1aXJlQ29tcG9uZW50IH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuLi8uLi9yZW5kZXJlci91aS91aSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi91aS10cmFuc2Zvcm0nO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgnO1xyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiBVSSDlj4ogVUkg5qih5Z6L5riy5p+T5Z+657G744CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuVUlDb21wb25lbnQnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQGRpc2FsbG93TXVsdGlwbGVcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBVSUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9sYXN0UGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIF9fcHJlbG9hZCAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLl91aVByb3BzLnVpQ29tcCA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS5fdWlQcm9wcy51aUNvbXAgPT09IHRoaXMpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLl91aVByb3BzLnVpQ29tcCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBc3NlbWJsZXIgKHJlbmRlcjogVUkpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdFVwZGF0ZUFzc2VtYmxlciAocmVuZGVyOiBVSSkge1xyXG4gICAgfVxyXG59XHJcbiJdfQ==