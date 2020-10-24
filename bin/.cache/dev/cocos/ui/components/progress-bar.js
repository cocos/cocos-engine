(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component.js", "../../core/components/ui-base/index.js", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/index.js", "../../core/math/utils.js", "./sprite.js", "../../core/platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component.js"), require("../../core/components/ui-base/index.js"), require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/index.js"), require("../../core/math/utils.js"), require("./sprite.js"), require("../../core/platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.index, global.index, global.index, global.utils, global.sprite, global.debug);
    global.progressBar = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _index2, _index3, _index4, _utils, _sprite, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ProgressBar = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _temp;

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
   * Enum for ProgressBar mode.
   *
   * @zh
   * 进度条模式。
   */
  var Mode;

  (function (Mode) {
    Mode[Mode["HORIZONTAL"] = 0] = "HORIZONTAL";
    Mode[Mode["VERTICAL"] = 1] = "VERTICAL";
    Mode[Mode["FILLED"] = 2] = "FILLED";
  })(Mode || (Mode = {}));

  (0, _index4.Enum)(Mode);
  /**
   * @en
   * Visual indicator of progress in some operation.
   * Displays a bar to the user representing how far the operation has progressed.
   *
   * @zh
   * 进度条组件，可用于显示加载资源时的进度。
   *
   * @example
   * ```ts
   * // update progressBar
   * update(dt) {
   *     var progress = progressBar.progress;
   *     if (progress > 0) {
   *         progress += dt;
   *     }
   *     else {
   *         progress = 1;
   *     }
   *     progressBar.progress = progress;
   * }
   * ```
   */

  var // @executeInEditMode
  ProgressBar = (_dec = (0, _index2.ccclass)('cc.ProgressBar'), _dec2 = (0, _index2.help)('i18n:cc.ProgressBar'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/ProgressBar'), _dec5 = (0, _index2.requireComponent)(_index.UITransform), _dec6 = (0, _index2.type)(_sprite.Sprite), _dec7 = (0, _index2.tooltip)('进度条显示用的 Sprite 节点，可以动态改变尺寸'), _dec8 = (0, _index2.type)(Mode), _dec9 = (0, _index2.tooltip)('进度条显示模式，目前支持水平和垂直两种'), _dec10 = (0, _index2.tooltip)('进度条在 progress 为 1 时的最大长度'), _dec11 = (0, _index2.range)([0, 1, 0.1]), _dec12 = (0, _index2.tooltip)('当前进度指示，范围从 0 到 1'), _dec13 = (0, _index2.tooltip)('是否反向驱动进度条'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(ProgressBar, _Component);

    function ProgressBar() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ProgressBar);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ProgressBar)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_barSprite", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_mode", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_totalLength", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_progress", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_reverse", _descriptor5, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(ProgressBar, [{
      key: "_initBarSprite",
      value: function _initBarSprite() {
        if (this._barSprite) {
          var entity = this._barSprite.node;

          if (!entity) {
            return;
          }

          var trans = this.node._uiProps.uiTransformComp;
          var nodeSize = trans.contentSize;
          var nodeAnchor = trans.anchorPoint;
          var barSpriteSize = entity._uiProps.uiTransformComp.contentSize; // if (entity.parent === this.node) {
          //     this.node.setContentSize(barSpriteSize);
          // }

          if (this._barSprite.fillType === _sprite.Sprite.FillType.RADIAL) {
            this._mode = Mode.FILLED;
          }

          if (this._mode === Mode.HORIZONTAL) {
            this.totalLength = barSpriteSize.width;
          } else if (this._mode === Mode.VERTICAL) {
            this.totalLength = barSpriteSize.height;
          } else {
            this.totalLength = this._barSprite.fillRange;
          }

          if (entity.parent === this.node) {
            var x = -nodeSize.width * nodeAnchor.x;
            entity.setPosition(x, 0, 0);
          }
        }
      }
    }, {
      key: "_updateBarStatus",
      value: function _updateBarStatus() {
        if (this._barSprite) {
          var entity = this._barSprite.node;

          if (!entity) {
            return;
          }

          var entTrans = entity._uiProps.uiTransformComp;
          var entityAnchorPoint = entTrans.anchorPoint;
          var entitySize = entTrans.contentSize;
          var entityPosition = entity.getPosition();
          var anchorPoint = new _index3.Vec2(0, 0.5);
          var progress = (0, _utils.clamp01)(this._progress);
          var actualLenth = this._totalLength * progress;
          var finalContentSize = entitySize;
          var totalWidth = 0;
          var totalHeight = 0;

          switch (this._mode) {
            case Mode.HORIZONTAL:
              if (this._reverse) {
                anchorPoint = new _index3.Vec2(1, 0.5);
              }

              finalContentSize = new _index3.Size(actualLenth, entitySize.height);
              totalWidth = this._totalLength;
              totalHeight = entitySize.height;
              break;

            case Mode.VERTICAL:
              if (this._reverse) {
                anchorPoint = new _index3.Vec2(0.5, 1);
              } else {
                anchorPoint = new _index3.Vec2(0.5, 0);
              }

              finalContentSize = new _index3.Size(entitySize.width, actualLenth);
              totalWidth = entitySize.width;
              totalHeight = this._totalLength;
              break;
          } // handling filled mode


          if (this._mode === Mode.FILLED) {
            if (this._barSprite.type !== _sprite.Sprite.Type.FILLED) {
              (0, _debug.warn)('ProgressBar FILLED mode only works when barSprite\'s Type is FILLED!');
            } else {
              if (this._reverse) {
                actualLenth = actualLenth * -1;
              }

              this._barSprite.fillRange = actualLenth;
            }
          } else {
            if (this._barSprite.type !== _sprite.Sprite.Type.FILLED) {
              var anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
              var anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
              var finalPosition = new _index3.Vec3(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY, 0);
              entity.setPosition(entityPosition.x + finalPosition.x, entityPosition.y + finalPosition.y, entityPosition.z);
              entTrans.setAnchorPoint(anchorPoint);
              entTrans.setContentSize(finalContentSize);
            } else {
              (0, _debug.warn)('ProgressBar non-FILLED mode only works when barSprite\'s Type is non-FILLED!');
            }
          }
        }
      }
    }, {
      key: "barSprite",

      /**
       * @en
       * The targeted Sprite which will be changed progressively.
       *
       * @zh
       * 用来显示进度条比例的 Sprite 对象。
       */
      get: function get() {
        return this._barSprite;
      },
      set: function set(value) {
        if (this._barSprite === value) {
          return;
        }

        this._barSprite = value;

        this._initBarSprite();
      }
      /**
       * @en
       * The progress mode, there are two modes supported now: horizontal and vertical.
       *
       * @zh
       * 进度条的模式。
       */

    }, {
      key: "mode",
      get: function get() {
        return this._mode;
      },
      set: function set(value) {
        if (this._mode === value) {
          return;
        }

        this._mode = value;

        if (this._barSprite) {
          var entity = this._barSprite.node;

          if (!entity) {
            return;
          }

          var entitySize = entity._uiProps.uiTransformComp.contentSize;

          if (this._mode === Mode.HORIZONTAL) {
            this.totalLength = entitySize.width;
          } else if (this._mode === Mode.VERTICAL) {
            this.totalLength = entitySize.height;
          } else if (this._mode === Mode.FILLED) {
            this.totalLength = this._barSprite.fillRange;
          }
        }
      }
      /**
       * @en
       * The total width or height of the bar sprite.
       *
       * @zh
       * 进度条实际的总长度。
       */

    }, {
      key: "totalLength",
      get: function get() {
        return this._totalLength;
      },
      set: function set(value) {
        if (this._mode === Mode.FILLED) {
          value = (0, _utils.clamp01)(value);
        }

        this._totalLength = value;

        this._updateBarStatus();
      }
      /**
       * @en
       * The current progress of the bar sprite. The valid value is between 0-1.
       *
       * @zh
       * 当前进度值，该数值的区间是 0-1 之间。
       */

    }, {
      key: "progress",
      get: function get() {
        return this._progress;
      },
      set: function set(value) {
        if (this._progress === value) {
          return;
        }

        this._progress = value;

        this._updateBarStatus();
      }
      /**
       * @en
       * Whether reverse the progress direction of the bar sprite.
       *
       * @zh
       * 进度条是否进行反方向变化。
       */

    }, {
      key: "reverse",
      get: function get() {
        return this._reverse;
      },
      set: function set(value) {
        if (this._reverse === value) {
          return;
        }

        this._reverse = value;

        if (this._barSprite) {
          this._barSprite.fillStart = 1 - this._barSprite.fillStart;
        }

        this._updateBarStatus();
      }
    }]);

    return ProgressBar;
  }(_component.Component), _class3.Mode = Mode, _temp), (_applyDecoratedDescriptor(_class2.prototype, "barSprite", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "barSprite"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "mode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "totalLength", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "totalLength"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "progress", [_dec11, _index2.slide, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "progress"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "reverse", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "reverse"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_barSprite", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_mode", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Mode.HORIZONTAL;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_totalLength", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_progress", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_reverse", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.ProgressBar = ProgressBar;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvcHJvZ3Jlc3MtYmFyLnRzIl0sIm5hbWVzIjpbIk1vZGUiLCJQcm9ncmVzc0JhciIsIlVJVHJhbnNmb3JtIiwiU3ByaXRlIiwiX2JhclNwcml0ZSIsImVudGl0eSIsIm5vZGUiLCJ0cmFucyIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwibm9kZVNpemUiLCJjb250ZW50U2l6ZSIsIm5vZGVBbmNob3IiLCJhbmNob3JQb2ludCIsImJhclNwcml0ZVNpemUiLCJmaWxsVHlwZSIsIkZpbGxUeXBlIiwiUkFESUFMIiwiX21vZGUiLCJGSUxMRUQiLCJIT1JJWk9OVEFMIiwidG90YWxMZW5ndGgiLCJ3aWR0aCIsIlZFUlRJQ0FMIiwiaGVpZ2h0IiwiZmlsbFJhbmdlIiwicGFyZW50IiwieCIsInNldFBvc2l0aW9uIiwiZW50VHJhbnMiLCJlbnRpdHlBbmNob3JQb2ludCIsImVudGl0eVNpemUiLCJlbnRpdHlQb3NpdGlvbiIsImdldFBvc2l0aW9uIiwiVmVjMiIsInByb2dyZXNzIiwiX3Byb2dyZXNzIiwiYWN0dWFsTGVudGgiLCJfdG90YWxMZW5ndGgiLCJmaW5hbENvbnRlbnRTaXplIiwidG90YWxXaWR0aCIsInRvdGFsSGVpZ2h0IiwiX3JldmVyc2UiLCJTaXplIiwidHlwZSIsIlR5cGUiLCJhbmNob3JPZmZzZXRYIiwiYW5jaG9yT2Zmc2V0WSIsInkiLCJmaW5hbFBvc2l0aW9uIiwiVmVjMyIsInoiLCJzZXRBbmNob3JQb2ludCIsInNldENvbnRlbnRTaXplIiwidmFsdWUiLCJfaW5pdEJhclNwcml0ZSIsIl91cGRhdGVCYXJTdGF0dXMiLCJmaWxsU3RhcnQiLCJDb21wb25lbnQiLCJzbGlkZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQTs7Ozs7OztNQU9LQSxJOzth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QUFBQSxLQUFLLEdBQUcsb0JBQVFBLEtBQVIsQ0FBUjtBQUNIOztBQUNELGFBQUtoQixZQUFMLEdBQW9CZ0IsS0FBcEI7O0FBQ0EsYUFBS0UsZ0JBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVVnQjtBQUNaLGVBQU8sS0FBS3BCLFNBQVo7QUFDSCxPO3dCQUVha0IsSyxFQUFPO0FBQ2pCLFlBQUksS0FBS2xCLFNBQUwsS0FBbUJrQixLQUF2QixFQUE4QjtBQUMxQjtBQUNIOztBQUVELGFBQUtsQixTQUFMLEdBQWlCa0IsS0FBakI7O0FBQ0EsYUFBS0UsZ0JBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVFlO0FBQ1gsZUFBTyxLQUFLZCxRQUFaO0FBQ0gsTzt3QkFFWVksSyxFQUFPO0FBQ2hCLFlBQUksS0FBS1osUUFBTCxLQUFrQlksS0FBdEIsRUFBNkI7QUFDekI7QUFDSDs7QUFFRCxhQUFLWixRQUFMLEdBQWdCWSxLQUFoQjs7QUFDQSxZQUFJLEtBQUtsRCxVQUFULEVBQXFCO0FBQ2pCLGVBQUtBLFVBQUwsQ0FBZ0JxRCxTQUFoQixHQUE0QixJQUFJLEtBQUtyRCxVQUFMLENBQWdCcUQsU0FBaEQ7QUFDSDs7QUFDRCxhQUFLRCxnQkFBTDtBQUNIOzs7O0lBM0g0QkUsb0IsV0E2SGYxRCxJLEdBQU9BLEksOGhCQXZDcEIyRCxhLDhUQXdDQUMsb0I7Ozs7O2FBQ3FDLEk7OzRFQUNyQ0Esb0I7Ozs7O2FBQ2lCNUQsSUFBSSxDQUFDb0IsVTs7bUZBQ3RCd0Msb0I7Ozs7O2FBQ3dCLEM7O2dGQUN4QkEsb0I7Ozs7O2FBQ3FCLEc7OytFQUNyQkEsb0I7Ozs7O2FBQ29CLEsiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRpb25PcmRlciwgbWVudSwgcmVxdWlyZUNvbXBvbmVudCwgdG9vbHRpcCwgdHlwZSwgcmFuZ2UsIHNsaWRlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBTaXplLCBWZWMyLCBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBjbGFtcDAxIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3V0aWxzJztcclxuaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEVudW0gZm9yIFByb2dyZXNzQmFyIG1vZGUuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDov5vluqbmnaHmqKHlvI/jgIJcclxuICovXHJcbmVudW0gTW9kZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1vZGUgb2YgaG9yaXpvbnRhbC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOawtOW5s+aWueWQkeaooeW8j+OAglxyXG4gICAgICovXHJcbiAgICBIT1JJWk9OVEFMID0gMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1vZGUgb2YgdmVydGljYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiAg5Z6C55u05pa55ZCR5qih5byP44CCXHJcbiAgICAgKi9cclxuICAgIFZFUlRJQ0FMID0gMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbW9kZSBvZiBmaWxsLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aGr5YWF5qih5byP44CCXHJcbiAgICAgKi9cclxuICAgIEZJTExFRCA9IDIsXHJcbn1cclxuXHJcbkVudW0oTW9kZSk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFZpc3VhbCBpbmRpY2F0b3Igb2YgcHJvZ3Jlc3MgaW4gc29tZSBvcGVyYXRpb24uXHJcbiAqIERpc3BsYXlzIGEgYmFyIHRvIHRoZSB1c2VyIHJlcHJlc2VudGluZyBob3cgZmFyIHRoZSBvcGVyYXRpb24gaGFzIHByb2dyZXNzZWQuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDov5vluqbmnaHnu4Tku7bvvIzlj6/nlKjkuo7mmL7npLrliqDovb3otYTmupDml7bnmoTov5vluqbjgIJcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHNcclxuICogLy8gdXBkYXRlIHByb2dyZXNzQmFyXHJcbiAqIHVwZGF0ZShkdCkge1xyXG4gKiAgICAgdmFyIHByb2dyZXNzID0gcHJvZ3Jlc3NCYXIucHJvZ3Jlc3M7XHJcbiAqICAgICBpZiAocHJvZ3Jlc3MgPiAwKSB7XHJcbiAqICAgICAgICAgcHJvZ3Jlc3MgKz0gZHQ7XHJcbiAqICAgICB9XHJcbiAqICAgICBlbHNlIHtcclxuICogICAgICAgICBwcm9ncmVzcyA9IDE7XHJcbiAqICAgICB9XHJcbiAqICAgICBwcm9ncmVzc0Jhci5wcm9ncmVzcyA9IHByb2dyZXNzO1xyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlByb2dyZXNzQmFyJylcclxuQGhlbHAoJ2kxOG46Y2MuUHJvZ3Jlc3NCYXInKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvUHJvZ3Jlc3NCYXInKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuLy8gQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc0JhciBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB0YXJnZXRlZCBTcHJpdGUgd2hpY2ggd2lsbCBiZSBjaGFuZ2VkIHByb2dyZXNzaXZlbHkuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlKjmnaXmmL7npLrov5vluqbmnaHmr5TkvovnmoQgU3ByaXRlIOWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGUpXHJcbiAgICBAdG9vbHRpcCgn6L+b5bqm5p2h5pi+56S655So55qEIFNwcml0ZSDoioLngrnvvIzlj6/ku6XliqjmgIHmlLnlj5jlsLrlr7gnKVxyXG4gICAgZ2V0IGJhclNwcml0ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhclNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYmFyU3ByaXRlICh2YWx1ZTogU3ByaXRlIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9iYXJTcHJpdGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2JhclNwcml0ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2luaXRCYXJTcHJpdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHByb2dyZXNzIG1vZGUsIHRoZXJlIGFyZSB0d28gbW9kZXMgc3VwcG9ydGVkIG5vdzogaG9yaXpvbnRhbCBhbmQgdmVydGljYWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDov5vluqbmnaHnmoTmqKHlvI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTW9kZSlcclxuICAgIEB0b29sdGlwKCfov5vluqbmnaHmmL7npLrmqKHlvI/vvIznm67liY3mlK/mjIHmsLTlubPlkozlnoLnm7TkuKTnp40nKVxyXG4gICAgZ2V0IG1vZGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBtb2RlICh2YWx1ZTogTW9kZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tb2RlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JhclNwcml0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLl9iYXJTcHJpdGUubm9kZTtcclxuICAgICAgICAgICAgaWYgKCFlbnRpdHkpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHlTaXplID0gZW50aXR5Ll91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlID09PSBNb2RlLkhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxMZW5ndGggPSBlbnRpdHlTaXplLndpZHRoO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGUgPT09IE1vZGUuVkVSVElDQUwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxMZW5ndGggPSBlbnRpdHlTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlID09PSBNb2RlLkZJTExFRCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IHRoaXMuX2JhclNwcml0ZS5maWxsUmFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB0b3RhbCB3aWR0aCBvciBoZWlnaHQgb2YgdGhlIGJhciBzcHJpdGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDov5vluqbmnaHlrp7pmYXnmoTmgLvplb/luqbjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+i/m+W6puadoeWcqCBwcm9ncmVzcyDkuLogMSDml7bnmoTmnIDlpKfplb/luqYnKVxyXG4gICAgZ2V0IHRvdGFsTGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRvdGFsTGVuZ3RoICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlID09PSBNb2RlLkZJTExFRCkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGNsYW1wMDEodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90b3RhbExlbmd0aCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUJhclN0YXR1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgY3VycmVudCBwcm9ncmVzcyBvZiB0aGUgYmFyIHNwcml0ZS4gVGhlIHZhbGlkIHZhbHVlIGlzIGJldHdlZW4gMC0xLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5b2T5YmN6L+b5bqm5YC877yM6K+l5pWw5YC855qE5Yy66Ze05pivIDAtMSDkuYvpl7TjgIJcclxuICAgICAqL1xyXG4gICAgQHJhbmdlKFswLCAxLCAwLjFdKVxyXG4gICAgQHNsaWRlXHJcbiAgICBAdG9vbHRpcCgn5b2T5YmN6L+b5bqm5oyH56S677yM6IyD5Zu05LuOIDAg5YiwIDEnKVxyXG4gICAgZ2V0IHByb2dyZXNzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3Jlc3M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHByb2dyZXNzICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcm9ncmVzcyA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVCYXJTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciByZXZlcnNlIHRoZSBwcm9ncmVzcyBkaXJlY3Rpb24gb2YgdGhlIGJhciBzcHJpdGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDov5vluqbmnaHmmK/lkKbov5vooYzlj43mlrnlkJHlj5jljJbjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuWPjeWQkempseWKqOi/m+W6puadoScpXHJcbiAgICBnZXQgcmV2ZXJzZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JldmVyc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJldmVyc2UgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JldmVyc2UgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JldmVyc2UgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5fYmFyU3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JhclNwcml0ZS5maWxsU3RhcnQgPSAxIC0gdGhpcy5fYmFyU3ByaXRlLmZpbGxTdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlQmFyU3RhdHVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBNb2RlID0gTW9kZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfYmFyU3ByaXRlOiBTcHJpdGUgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbW9kZSA9IE1vZGUuSE9SSVpPTlRBTDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdG90YWxMZW5ndGggPSAxO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wcm9ncmVzcyA9IDAuMTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcmV2ZXJzZSA9IGZhbHNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfaW5pdEJhclNwcml0ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JhclNwcml0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLl9iYXJTcHJpdGUubm9kZTtcclxuICAgICAgICAgICAgaWYgKCFlbnRpdHkpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cmFucyA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlU2l6ZSA9IHRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlQW5jaG9yID0gdHJhbnMuYW5jaG9yUG9pbnQ7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBiYXJTcHJpdGVTaXplID0gZW50aXR5Ll91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiAoZW50aXR5LnBhcmVudCA9PT0gdGhpcy5ub2RlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUoYmFyU3ByaXRlU2l6ZSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXJTcHJpdGUuZmlsbFR5cGUgPT09IFNwcml0ZS5GaWxsVHlwZS5SQURJQUwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGUgPSBNb2RlLkZJTExFRDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX21vZGUgPT09IE1vZGUuSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IGJhclNwcml0ZVNpemUud2lkdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbW9kZSA9PT0gTW9kZS5WRVJUSUNBTCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IGJhclNwcml0ZVNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IHRoaXMuX2JhclNwcml0ZS5maWxsUmFuZ2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkucGFyZW50ID09PSB0aGlzLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSAtIG5vZGVTaXplLndpZHRoICogbm9kZUFuY2hvci54O1xyXG4gICAgICAgICAgICAgICAgZW50aXR5LnNldFBvc2l0aW9uKHgsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlQmFyU3RhdHVzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYmFyU3ByaXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuX2JhclNwcml0ZS5ub2RlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlbnRpdHkpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRUcmFucyA9IGVudGl0eS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhXHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eUFuY2hvclBvaW50ID0gZW50VHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eVNpemUgPSBlbnRUcmFucy5jb250ZW50U2l6ZTtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5UG9zaXRpb24gPSBlbnRpdHkuZ2V0UG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbmNob3JQb2ludCA9IG5ldyBWZWMyKDAsIDAuNSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gY2xhbXAwMSh0aGlzLl9wcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIGxldCBhY3R1YWxMZW50aCA9IHRoaXMuX3RvdGFsTGVuZ3RoICogcHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgIGxldCBmaW5hbENvbnRlbnRTaXplID0gZW50aXR5U2l6ZTtcclxuICAgICAgICAgICAgbGV0IHRvdGFsV2lkdGggPSAwO1xyXG4gICAgICAgICAgICBsZXQgdG90YWxIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuX21vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kZS5IT1JJWk9OVEFMOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZXZlcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvclBvaW50ID0gbmV3IFZlYzIoMSwgMC41KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsQ29udGVudFNpemUgPSBuZXcgU2l6ZShhY3R1YWxMZW50aCwgZW50aXR5U2l6ZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsV2lkdGggPSB0aGlzLl90b3RhbExlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbEhlaWdodCA9IGVudGl0eVNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RlLlZFUlRJQ0FMOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9yZXZlcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvclBvaW50ID0gbmV3IFZlYzIoMC41LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JQb2ludCA9IG5ldyBWZWMyKDAuNSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaW5hbENvbnRlbnRTaXplID0gbmV3IFNpemUoZW50aXR5U2l6ZS53aWR0aCwgYWN0dWFsTGVudGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsV2lkdGggPSBlbnRpdHlTaXplLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gdGhpcy5fdG90YWxMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGhhbmRsaW5nIGZpbGxlZCBtb2RlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlID09PSBNb2RlLkZJTExFRCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2JhclNwcml0ZS50eXBlICE9PSBTcHJpdGUuVHlwZS5GSUxMRUQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKCdQcm9ncmVzc0JhciBGSUxMRUQgbW9kZSBvbmx5IHdvcmtzIHdoZW4gYmFyU3ByaXRlXFwncyBUeXBlIGlzIEZJTExFRCEnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3JldmVyc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsTGVudGggPSBhY3R1YWxMZW50aCAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYXJTcHJpdGUuZmlsbFJhbmdlID0gYWN0dWFsTGVudGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFyU3ByaXRlLnR5cGUgIT09IFNwcml0ZS5UeXBlLkZJTExFRCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmNob3JPZmZzZXRYID0gYW5jaG9yUG9pbnQueCAtIGVudGl0eUFuY2hvclBvaW50Lng7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5jaG9yT2Zmc2V0WSA9IGFuY2hvclBvaW50LnkgLSBlbnRpdHlBbmNob3JQb2ludC55O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmFsUG9zaXRpb24gPSBuZXcgVmVjMyh0b3RhbFdpZHRoICogYW5jaG9yT2Zmc2V0WCwgdG90YWxIZWlnaHQgKiBhbmNob3JPZmZzZXRZLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnNldFBvc2l0aW9uKGVudGl0eVBvc2l0aW9uLnggKyBmaW5hbFBvc2l0aW9uLngsIGVudGl0eVBvc2l0aW9uLnkgKyBmaW5hbFBvc2l0aW9uLnksIGVudGl0eVBvc2l0aW9uLnopO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbnRUcmFucy5zZXRBbmNob3JQb2ludChhbmNob3JQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50VHJhbnMuc2V0Q29udGVudFNpemUoZmluYWxDb250ZW50U2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhcm4oJ1Byb2dyZXNzQmFyIG5vbi1GSUxMRUQgbW9kZSBvbmx5IHdvcmtzIHdoZW4gYmFyU3ByaXRlXFwncyBUeXBlIGlzIG5vbi1GSUxMRUQhJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19