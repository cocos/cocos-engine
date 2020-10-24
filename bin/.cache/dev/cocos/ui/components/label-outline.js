(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component.js", "../../core/data/decorators/index.js", "../../core/math/index.js", "./label.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component.js"), require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("./label.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.index, global.label);
    global.labelOutline = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _index2, _label) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LabelOutline = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _temp;

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * Outline effect used to change the display, only for system fonts or TTF fonts.
   *
   * @zh
   * 描边效果组件,用于字体描边,只能用于系统字体。
   *
   * @example
   * ```ts
   * import { Node, Label, LabelOutline } from 'cc';
   * // Create a new node and add label components.
   * const node = new Node("New Label");
   * const label = node.addComponent(Label);
   * const outline = node.addComponent(LabelOutline);
   * node.parent = this.node;
   * ```
   */
  var LabelOutline = (_dec = (0, _index.ccclass)('cc.LabelOutline'), _dec2 = (0, _index.help)('i18n:cc.LabelOutline'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/LabelOutline'), _dec5 = (0, _index.requireComponent)(_label.Label), _dec6 = (0, _index.tooltip)('描边的颜色'), _dec7 = (0, _index.tooltip)('描边的宽度'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(LabelOutline, _Component);

    function LabelOutline() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, LabelOutline);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(LabelOutline)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_color", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_width", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(LabelOutline, [{
      key: "onEnable",
      value: function onEnable() {
        this._updateRenderData();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._updateRenderData();
      }
    }, {
      key: "_updateRenderData",
      value: function _updateRenderData() {
        var label = this.node.getComponent(_label.Label);

        if (label) {
          label.updateRenderData(true);
        }
      }
    }, {
      key: "color",

      /**
       * @en
       * Outline color.
       *
       * @zh
       * 改变描边的颜色。
       *
       * @example
       * ```ts
       * import { Color } from 'cc';
       * outline.color = new Color(0.5, 0.3, 0.7, 1.0);
       * ```
       */
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        if (this._color === value) {
          return;
        }

        this._color.set(value);

        this._updateRenderData();
      }
      /**
       * @en
       * Change the outline width.
       *
       * @zh
       * 改变描边的宽度。
       *
       * @example
       * ```ts
       * outline.width = 3;
       * ```
       */

    }, {
      key: "width",
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        if (this._width === value) {
          return;
        }

        this._width = value;

        this._updateRenderData();
      }
    }]);

    return LabelOutline;
  }(_component.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_color", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Color(0, 0, 0, 255);
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_width", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 2;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "color", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "width", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "width"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.LabelOutline = LabelOutline;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvbGFiZWwtb3V0bGluZS50cyJdLCJuYW1lcyI6WyJMYWJlbE91dGxpbmUiLCJMYWJlbCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX3VwZGF0ZVJlbmRlckRhdGEiLCJsYWJlbCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJ1cGRhdGVSZW5kZXJEYXRhIiwiX2NvbG9yIiwidmFsdWUiLCJzZXQiLCJfd2lkdGgiLCJDb21wb25lbnQiLCJzZXJpYWxpemFibGUiLCJDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DQTs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF1QmFBLFksV0FOWixvQkFBUSxpQkFBUixDLFVBQ0EsaUJBQUssc0JBQUwsQyxVQUNBLDJCQUFlLEdBQWYsQyxVQUNBLGlCQUFLLGlCQUFMLEMsVUFDQSw2QkFBaUJDLFlBQWpCLEMsVUFxQkksb0JBQVEsT0FBUixDLFVBMkJBLG9CQUFRLE9BQVIsQyxnRkEvQ0pDLHdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lDQTZEc0I7QUFDZixhQUFLQyxpQkFBTDtBQUNIOzs7a0NBRW1CO0FBQ2hCLGFBQUtBLGlCQUFMO0FBQ0g7OzswQ0FFOEI7QUFDM0IsWUFBTUMsS0FBSyxHQUFHLEtBQUtDLElBQUwsQ0FBVUMsWUFBVixDQUF1QkwsWUFBdkIsQ0FBZDs7QUFDQSxZQUFJRyxLQUFKLEVBQVc7QUFDUEEsVUFBQUEsS0FBSyxDQUFDRyxnQkFBTixDQUF1QixJQUF2QjtBQUNIO0FBQ0o7Ozs7QUFuRUQ7Ozs7Ozs7Ozs7Ozs7MEJBZThCO0FBQzFCLGVBQU8sS0FBS0MsTUFBWjtBQUNILE87d0JBRVVDLEssRUFBTztBQUNkLFlBQUksS0FBS0QsTUFBTCxLQUFnQkMsS0FBcEIsRUFBMEI7QUFDdEI7QUFDSDs7QUFFRCxhQUFLRCxNQUFMLENBQVlFLEdBQVosQ0FBZ0JELEtBQWhCOztBQUNBLGFBQUtOLGlCQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzBCQWFhO0FBQ1QsZUFBTyxLQUFLUSxNQUFaO0FBQ0gsTzt3QkFFVUYsSyxFQUFPO0FBQ2QsWUFBSSxLQUFLRSxNQUFMLEtBQWdCRixLQUFwQixFQUEyQjtBQUN2QjtBQUNIOztBQUVELGFBQUtFLE1BQUwsR0FBY0YsS0FBZDs7QUFDQSxhQUFLTixpQkFBTDtBQUNIOzs7O0lBMUQ2QlMsb0Isa0ZBQzdCQyxtQjs7Ozs7YUFDa0IsSUFBSUMsYUFBSixDQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLEdBQW5CLEM7OzZFQUNsQkQsbUI7Ozs7O2FBQ2tCLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHRvb2x0aXAsIHJlcXVpcmVDb21wb25lbnQsIGV4ZWN1dGVJbkVkaXRNb2RlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IExhYmVsIH0gZnJvbSAnLi9sYWJlbCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE91dGxpbmUgZWZmZWN0IHVzZWQgdG8gY2hhbmdlIHRoZSBkaXNwbGF5LCBvbmx5IGZvciBzeXN0ZW0gZm9udHMgb3IgVFRGIGZvbnRzLlxyXG4gKlxyXG4gKiBAemhcclxuICog5o+P6L655pWI5p6c57uE5Lu2LOeUqOS6juWtl+S9k+aPj+i+uSzlj6rog73nlKjkuo7ns7vnu5/lrZfkvZPjgIJcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHNcclxuICogaW1wb3J0IHsgTm9kZSwgTGFiZWwsIExhYmVsT3V0bGluZSB9IGZyb20gJ2NjJztcclxuICogLy8gQ3JlYXRlIGEgbmV3IG5vZGUgYW5kIGFkZCBsYWJlbCBjb21wb25lbnRzLlxyXG4gKiBjb25zdCBub2RlID0gbmV3IE5vZGUoXCJOZXcgTGFiZWxcIik7XHJcbiAqIGNvbnN0IGxhYmVsID0gbm9kZS5hZGRDb21wb25lbnQoTGFiZWwpO1xyXG4gKiBjb25zdCBvdXRsaW5lID0gbm9kZS5hZGRDb21wb25lbnQoTGFiZWxPdXRsaW5lKTtcclxuICogbm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XHJcbiAqIGBgYFxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkxhYmVsT3V0bGluZScpXHJcbkBoZWxwKCdpMThuOmNjLkxhYmVsT3V0bGluZScpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9MYWJlbE91dGxpbmUnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChMYWJlbClcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBMYWJlbE91dGxpbmUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jb2xvciA9IG5ldyBDb2xvcigwLCAwLCAwLCAyNTUpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF93aWR0aCA9IDI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIE91dGxpbmUgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmlLnlj5jmj4/ovrnnmoTpopzoibLjgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IENvbG9yIH0gZnJvbSAnY2MnO1xyXG4gICAgICogb3V0bGluZS5jb2xvciA9IG5ldyBDb2xvcigwLjUsIDAuMywgMC43LCAxLjApO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmj4/ovrnnmoTpopzoibInKVxyXG4gICAgLy8gQGNvbnN0Z2V0XHJcbiAgICBnZXQgY29sb3IgKCk6IFJlYWRvbmx5PENvbG9yPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb2xvciAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29sb3IgPT09IHZhbHVlKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENoYW5nZSB0aGUgb3V0bGluZSB3aWR0aC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaUueWPmOaPj+i+ueeahOWuveW6puOAglxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogb3V0bGluZS53aWR0aCA9IDM7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aPj+i+ueeahOWuveW6picpXHJcbiAgICBnZXQgd2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2lkdGggKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3dpZHRoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVSZW5kZXJEYXRhICgpIHtcclxuICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoTGFiZWwpO1xyXG4gICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICBsYWJlbC51cGRhdGVSZW5kZXJEYXRhKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=