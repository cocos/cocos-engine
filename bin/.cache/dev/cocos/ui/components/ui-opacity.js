(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component.js", "../../core/data/decorators/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component.js"), require("../../core/data/decorators/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index);
    global.uiOpacity = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIOpacity = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Set the UI transparency component.
   * This component can be used to influence subsequent render nodes.
   * Nodes that already have a rendering component can modify the alpha channel of color directly.
   *
   * @zh
   * UI 透明度设置组件。可以通过该组件设置透明度来影响后续的渲染节点。已经带有渲染组件的节点可以直接修改 color 的 alpha 通道。
   */
  var UIOpacity = (_dec = (0, _index.ccclass)('cc.UIOpacity'), _dec2 = (0, _index.help)('i18n:cc.UIOpacity'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/UIOpacity'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(UIOpacity, _Component);

    function UIOpacity() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UIOpacity);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIOpacity)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_opacity", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(UIOpacity, [{
      key: "onEnable",
      value: function onEnable() {
        this.node._uiProps.opacity = this._opacity / 255;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.node._uiProps.opacity = 1;
      }
    }, {
      key: "opacity",

      /**
       * @en
       * The transparency value of the impact.
       *
       * @zh
       * 透明度。
       */
      get: function get() {
        return this._opacity;
      },
      set: function set(value) {
        if (this._opacity === value) {
          return;
        }

        this._opacity = value;
        this.node._uiProps.opacity = value / 255;
      }
    }]);

    return UIOpacity;
  }(_component.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "opacity", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "opacity"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_opacity", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 255;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.UIOpacity = UIOpacity;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdWktb3BhY2l0eS50cyJdLCJuYW1lcyI6WyJVSU9wYWNpdHkiLCJleGVjdXRlSW5FZGl0TW9kZSIsIm5vZGUiLCJfdWlQcm9wcyIsIm9wYWNpdHkiLCJfb3BhY2l0eSIsInZhbHVlIiwiQ29tcG9uZW50IiwiZWRpdGFibGUiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7Ozs7Ozs7O01BY2FBLFMsV0FMWixvQkFBUSxjQUFSLEMsVUFDQSxpQkFBSyxtQkFBTCxDLFVBQ0EsMkJBQWUsR0FBZixDLFVBQ0EsaUJBQUssY0FBTCxDLGlFQUNBQyx3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBMEJzQjtBQUNmLGFBQUtDLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsT0FBbkIsR0FBNkIsS0FBS0MsUUFBTCxHQUFnQixHQUE3QztBQUNIOzs7a0NBRWtCO0FBQ2YsYUFBS0gsSUFBTCxDQUFVQyxRQUFWLENBQW1CQyxPQUFuQixHQUE2QixDQUE3QjtBQUNIOzs7O0FBOUJEOzs7Ozs7OzBCQVFlO0FBQ1gsZUFBTyxLQUFLQyxRQUFaO0FBQ0gsTzt3QkFFWUMsSyxFQUFPO0FBQ2hCLFlBQUksS0FBS0QsUUFBTCxLQUFrQkMsS0FBdEIsRUFBNkI7QUFDekI7QUFDSDs7QUFFRCxhQUFLRCxRQUFMLEdBQWdCQyxLQUFoQjtBQUNBLGFBQUtKLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsT0FBbkIsR0FBNkJFLEtBQUssR0FBRyxHQUFyQztBQUNIOzs7O0lBcEIwQkMsb0IscUVBUTFCQyxlLDhKQWNBQyxtQjs7Ozs7YUFDb0IsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCBlZGl0YWJsZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2V0IHRoZSBVSSB0cmFuc3BhcmVuY3kgY29tcG9uZW50LlxyXG4gKiBUaGlzIGNvbXBvbmVudCBjYW4gYmUgdXNlZCB0byBpbmZsdWVuY2Ugc3Vic2VxdWVudCByZW5kZXIgbm9kZXMuXHJcbiAqIE5vZGVzIHRoYXQgYWxyZWFkeSBoYXZlIGEgcmVuZGVyaW5nIGNvbXBvbmVudCBjYW4gbW9kaWZ5IHRoZSBhbHBoYSBjaGFubmVsIG9mIGNvbG9yIGRpcmVjdGx5LlxyXG4gKlxyXG4gKiBAemhcclxuICogVUkg6YCP5piO5bqm6K6+572u57uE5Lu244CC5Y+v5Lul6YCa6L+H6K+l57uE5Lu26K6+572u6YCP5piO5bqm5p2l5b2x5ZON5ZCO57ut55qE5riy5p+T6IqC54K544CC5bey57uP5bim5pyJ5riy5p+T57uE5Lu255qE6IqC54K55Y+v5Lul55u05o6l5L+u5pS5IGNvbG9yIOeahCBhbHBoYSDpgJrpgZPjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5VSU9wYWNpdHknKVxyXG5AaGVscCgnaTE4bjpjYy5VSU9wYWNpdHknKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvVUlPcGFjaXR5JylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBVSU9wYWNpdHkgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB0cmFuc3BhcmVuY3kgdmFsdWUgb2YgdGhlIGltcGFjdC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmAj+aYjuW6puOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBvcGFjaXR5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3BhY2l0eTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgb3BhY2l0eSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fb3BhY2l0eSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fb3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubm9kZS5fdWlQcm9wcy5vcGFjaXR5ID0gdmFsdWUgLyAyNTU7XHJcbiAgICB9XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9vcGFjaXR5ID0gMjU1O1xyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLl91aVByb3BzLm9wYWNpdHkgPSB0aGlzLl9vcGFjaXR5IC8gMjU1O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCl7XHJcbiAgICAgICAgdGhpcy5ub2RlLl91aVByb3BzLm9wYWNpdHkgPSAxO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==