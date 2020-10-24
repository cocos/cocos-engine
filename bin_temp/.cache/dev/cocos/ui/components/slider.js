(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/index.js", "../../core/components/ui-base/index.js", "../../core/data/decorators/index.js", "../../core/platform/index.js", "../../core/math/index.js", "../../core/value-types/enum.js", "../../core/math/utils.js", "./sprite.js", "../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/index.js"), require("../../core/components/ui-base/index.js"), require("../../core/data/decorators/index.js"), require("../../core/platform/index.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("../../core/math/utils.js"), require("./sprite.js"), require("../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.index, global._enum, global.utils, global.sprite, global.defaultConstants);
    global.slider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _index5, _enum, _utils, _sprite, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Slider = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _temp;

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

  var _tempPos = new _index5.Vec3();
  /**
   * @en
   * The Slider Direction.
   *
   * @zh
   * 滑动器方向。
   */


  var Direction;

  (function (Direction) {
    Direction[Direction["Horizontal"] = 0] = "Horizontal";
    Direction[Direction["Vertical"] = 1] = "Vertical";
  })(Direction || (Direction = {}));

  (0, _enum.ccenum)(Direction);
  /**
   * @en
   * The Slider Control.
   *
   * @zh
   * 滑动器组件。
   */

  var Slider = (_dec = (0, _index3.ccclass)('cc.Slider'), _dec2 = (0, _index3.help)('i18n:cc.Slider'), _dec3 = (0, _index3.executionOrder)(110), _dec4 = (0, _index3.menu)('UI/Slider'), _dec5 = (0, _index3.requireComponent)(_index2.UITransform), _dec6 = (0, _index3.type)(_sprite.Sprite), _dec7 = (0, _index3.tooltip)('滑块按钮部件'), _dec8 = (0, _index3.type)(Direction), _dec9 = (0, _index3.tooltip)('滑动方向'), _dec10 = (0, _index3.range)([0, 1, 0.01]), _dec11 = (0, _index3.tooltip)('当前进度值，该数值的区间是 0 - 1 之间。'), _dec12 = (0, _index3.type)([_index.EventHandler]), _dec13 = (0, _index3.tooltip)('滑动器组件事件回调函数'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(Slider, _Component);

    function Slider() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Slider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Slider)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "slideEvents", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_handle", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_progress", _descriptor4, _assertThisInitialized(_this));

      _this._offset = new _index5.Vec3();
      _this._dragging = false;
      _this._touchHandle = false;
      _this._handleLocalPos = new _index5.Vec3();
      _this._touchPos = new _index5.Vec3();
      return _this;
    }

    _createClass(Slider, [{
      key: "__preload",
      value: function __preload() {
        this._updateHandlePosition();
      } // 注册事件

    }, {
      key: "onEnable",
      value: function onEnable() {
        this._updateHandlePosition();

        this.node.on(_index4.SystemEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(_index4.SystemEventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(_index4.SystemEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(_index4.SystemEventType.TOUCH_CANCEL, this._onTouchCancelled, this);

        if (this._handle && this._handle.isValid) {
          this._handle.node.on(_index4.SystemEventType.TOUCH_START, this._onHandleDragStart, this);

          this._handle.node.on(_index4.SystemEventType.TOUCH_MOVE, this._onTouchMoved, this);

          this._handle.node.on(_index4.SystemEventType.TOUCH_END, this._onTouchEnded, this);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.node.off(_index4.SystemEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(_index4.SystemEventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(_index4.SystemEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(_index4.SystemEventType.TOUCH_CANCEL, this._onTouchCancelled, this);

        if (this._handle && this._handle.isValid) {
          this._handle.node.off(_index4.SystemEventType.TOUCH_START, this._onHandleDragStart, this);

          this._handle.node.off(_index4.SystemEventType.TOUCH_MOVE, this._onTouchMoved, this);

          this._handle.node.off(_index4.SystemEventType.TOUCH_END, this._onTouchEnded, this);
        }
      }
    }, {
      key: "_onHandleDragStart",
      value: function _onHandleDragStart(event) {
        if (!event || !this._handle || !this._handle.node._uiProps.uiTransformComp) {
          return;
        }

        this._dragging = true;
        this._touchHandle = true;
        var touhPos = event.touch.getUILocation();

        _index5.Vec3.set(this._touchPos, touhPos.x, touhPos.y, 0);

        this._handle.node._uiProps.uiTransformComp.convertToNodeSpaceAR(this._touchPos, this._offset);

        event.propagationStopped = true;
      }
    }, {
      key: "_onTouchBegan",
      value: function _onTouchBegan(event) {
        if (!this._handle || !event) {
          return;
        }

        this._dragging = true;

        if (!this._touchHandle) {
          this._handleSliderLogic(event.touch);
        }

        event.propagationStopped = true;
      }
    }, {
      key: "_onTouchMoved",
      value: function _onTouchMoved(event) {
        if (!this._dragging || !event) {
          return;
        }

        this._handleSliderLogic(event.touch);

        event.propagationStopped = true;
      }
    }, {
      key: "_onTouchEnded",
      value: function _onTouchEnded(event) {
        this._dragging = false;
        this._touchHandle = false;
        this._offset = new _index5.Vec3();

        if (event) {
          event.propagationStopped = true;
        }
      }
    }, {
      key: "_onTouchCancelled",
      value: function _onTouchCancelled(event) {
        this._dragging = false;

        if (event) {
          event.propagationStopped = true;
        }
      }
    }, {
      key: "_handleSliderLogic",
      value: function _handleSliderLogic(touch) {
        this._updateProgress(touch);

        this._emitSlideEvent();
      }
    }, {
      key: "_emitSlideEvent",
      value: function _emitSlideEvent() {
        _index.EventHandler.emitEvents(this.slideEvents, this);

        this.node.emit('slide', this);
      }
    }, {
      key: "_updateProgress",
      value: function _updateProgress(touch) {
        if (!this._handle || !touch) {
          return;
        }

        var touchPos = touch.getUILocation();

        _index5.Vec3.set(this._touchPos, touchPos.x, touchPos.y, 0);

        var uiTrans = this.node._uiProps.uiTransformComp;
        var localTouchPos = uiTrans.convertToNodeSpaceAR(this._touchPos, _tempPos);

        if (this.direction === Direction.Horizontal) {
          this.progress = (0, _utils.clamp01)(0.5 + (localTouchPos.x - this._offset.x) / uiTrans.width);
        } else {
          this.progress = (0, _utils.clamp01)(0.5 + (localTouchPos.y - this._offset.y) / uiTrans.height);
        }
      }
    }, {
      key: "_updateHandlePosition",
      value: function _updateHandlePosition() {
        if (!this._handle) {
          return;
        }

        this._handleLocalPos.set(this._handle.node.getPosition());

        var uiTrans = this.node._uiProps.uiTransformComp;

        if (this._direction === Direction.Horizontal) {
          this._handleLocalPos.x = -uiTrans.width * uiTrans.anchorX + this.progress * uiTrans.width;
        } else {
          this._handleLocalPos.y = -uiTrans.height * uiTrans.anchorY + this.progress * uiTrans.height;
        }

        this._handle.node.setPosition(this._handleLocalPos);
      }
    }, {
      key: "_changeLayout",
      value: function _changeLayout() {
        var uiTrans = this.node._uiProps.uiTransformComp;
        var contentSize = uiTrans.contentSize;
        uiTrans.setContentSize(contentSize.height, contentSize.width);

        if (this._handle) {
          var pos = this._handle.node.position;

          if (this._direction === Direction.Horizontal) {
            this._handle.node.setPosition(pos.x, 0, pos.z);
          } else {
            this._handle.node.setPosition(0, pos.y, pos.z);
          }

          this._updateHandlePosition();
        }
      }
    }, {
      key: "handle",

      /**
       * @en
       * The "handle" part of the slider.
       *
       * @zh
       * 滑动器滑块按钮部件。
       */
      get: function get() {
        return this._handle;
      },
      set: function set(value) {
        if (this._handle === value) {
          return;
        }

        this._handle = value;

        if (_defaultConstants.EDITOR && this._handle) {
          this._updateHandlePosition();
        }
      }
      /**
       * @en
       * The slider direction.
       *
       * @zh
       * 滑动器方向。
       */

    }, {
      key: "direction",
      get: function get() {
        return this._direction;
      },
      set: function set(value) {
        if (this._direction === value) {
          return;
        }

        this._direction = value;

        this._changeLayout();
      }
      /**
       * @en
       * The current progress of the slider. The valid value is between 0-1.
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

        this._updateHandlePosition();
      }
    }]);

    return Slider;
  }(_index.Component), _class3.Direction = Direction, _temp), (_applyDecoratedDescriptor(_class2.prototype, "handle", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "handle"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "direction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "progress", [_index3.slide, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "progress"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "slideEvents", [_dec12, _index3.serializable, _dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_handle", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_direction", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Direction.Horizontal;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_progress", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  /**
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event slide
   * @param {Event.EventCustom} event
   * @param {Slider} slider - The slider component.
   */

  _exports.Slider = Slider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvc2xpZGVyLnRzIl0sIm5hbWVzIjpbIl90ZW1wUG9zIiwiVmVjMyIsIkRpcmVjdGlvbiIsIlNsaWRlciIsIlVJVHJhbnNmb3JtIiwiU3ByaXRlIiwiRXZlbnRIYW5kbGVyIiwiX29mZnNldCIsIl9kcmFnZ2luZyIsIl90b3VjaEhhbmRsZSIsIl9oYW5kbGVMb2NhbFBvcyIsIl90b3VjaFBvcyIsIl91cGRhdGVIYW5kbGVQb3NpdGlvbiIsIm5vZGUiLCJvbiIsIlN5c3RlbUV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwiX29uVG91Y2hCZWdhbiIsIlRPVUNIX01PVkUiLCJfb25Ub3VjaE1vdmVkIiwiVE9VQ0hfRU5EIiwiX29uVG91Y2hFbmRlZCIsIlRPVUNIX0NBTkNFTCIsIl9vblRvdWNoQ2FuY2VsbGVkIiwiX2hhbmRsZSIsImlzVmFsaWQiLCJfb25IYW5kbGVEcmFnU3RhcnQiLCJvZmYiLCJldmVudCIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwidG91aFBvcyIsInRvdWNoIiwiZ2V0VUlMb2NhdGlvbiIsInNldCIsIngiLCJ5IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJwcm9wYWdhdGlvblN0b3BwZWQiLCJfaGFuZGxlU2xpZGVyTG9naWMiLCJfdXBkYXRlUHJvZ3Jlc3MiLCJfZW1pdFNsaWRlRXZlbnQiLCJlbWl0RXZlbnRzIiwic2xpZGVFdmVudHMiLCJlbWl0IiwidG91Y2hQb3MiLCJ1aVRyYW5zIiwibG9jYWxUb3VjaFBvcyIsImRpcmVjdGlvbiIsIkhvcml6b250YWwiLCJwcm9ncmVzcyIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0UG9zaXRpb24iLCJfZGlyZWN0aW9uIiwiYW5jaG9yWCIsImFuY2hvclkiLCJzZXRQb3NpdGlvbiIsImNvbnRlbnRTaXplIiwic2V0Q29udGVudFNpemUiLCJwb3MiLCJwb3NpdGlvbiIsInoiLCJ2YWx1ZSIsIkVESVRPUiIsIl9jaGFuZ2VMYXlvdXQiLCJfcHJvZ3Jlc3MiLCJDb21wb25lbnQiLCJzbGlkZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxNQUFNQSxRQUFRLEdBQUcsSUFBSUMsWUFBSixFQUFqQjtBQUNBOzs7Ozs7Ozs7TUFPS0MsUzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0tBQUFBLFMsS0FBQUEsUzs7QUFtQkwsb0JBQU9BLFNBQVA7QUFFQTs7Ozs7Ozs7TUFZYUMsTSxXQUxaLHFCQUFRLFdBQVIsQyxVQUNBLGtCQUFLLGdCQUFMLEMsVUFDQSw0QkFBZSxHQUFmLEMsVUFDQSxrQkFBSyxXQUFMLEMsVUFDQSw4QkFBaUJDLG1CQUFqQixDLFVBVUksa0JBQUtDLGNBQUwsQyxVQUNBLHFCQUFRLFFBQVIsQyxVQXVCQSxrQkFBS0gsU0FBTCxDLFVBQ0EscUJBQVEsTUFBUixDLFdBc0JBLG1CQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxJQUFQLENBQU4sQyxXQUNBLHFCQUFRLHlCQUFSLEMsV0F1QkEsa0JBQUssQ0FBQ0ksbUJBQUQsQ0FBTCxDLFdBRUEscUJBQVEsYUFBUixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFTT0MsTyxHQUFnQixJQUFJTixZQUFKLEU7WUFDaEJPLFMsR0FBWSxLO1lBQ1pDLFksR0FBZSxLO1lBQ2ZDLGUsR0FBa0IsSUFBSVQsWUFBSixFO1lBQ2xCVSxTLEdBQVksSUFBSVYsWUFBSixFOzs7Ozs7a0NBRUE7QUFDaEIsYUFBS1cscUJBQUw7QUFDSCxPLENBRUQ7Ozs7aUNBRW1CO0FBQ2YsYUFBS0EscUJBQUw7O0FBRUEsYUFBS0MsSUFBTCxDQUFVQyxFQUFWLENBQWFDLHdCQUFnQkMsV0FBN0IsRUFBMEMsS0FBS0MsYUFBL0MsRUFBOEQsSUFBOUQ7QUFDQSxhQUFLSixJQUFMLENBQVVDLEVBQVYsQ0FBYUMsd0JBQWdCRyxV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d0JBRVd1QyxLLEVBQXNCO0FBQzlCLFlBQUksS0FBS3ZDLE9BQUwsS0FBaUJ1QyxLQUFyQixFQUE0QjtBQUN4QjtBQUNIOztBQUVELGFBQUt2QyxPQUFMLEdBQWV1QyxLQUFmOztBQUNBLFlBQUlDLDRCQUFVLEtBQUt4QyxPQUFuQixFQUE0QjtBQUN4QixlQUFLWixxQkFBTDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzswQkFTaUI7QUFDYixlQUFPLEtBQUswQyxVQUFaO0FBQ0gsTzt3QkFFY1MsSyxFQUFlO0FBQzFCLFlBQUksS0FBS1QsVUFBTCxLQUFvQlMsS0FBeEIsRUFBK0I7QUFDM0I7QUFDSDs7QUFFRCxhQUFLVCxVQUFMLEdBQWtCUyxLQUFsQjs7QUFDQSxhQUFLRSxhQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7OzswQkFVZ0I7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSCxPO3dCQUVhSCxLLEVBQU87QUFDakIsWUFBSSxLQUFLRyxTQUFMLEtBQW1CSCxLQUF2QixFQUE4QjtBQUMxQjtBQUNIOztBQUVELGFBQUtHLFNBQUwsR0FBaUJILEtBQWpCOztBQUNBLGFBQUtuRCxxQkFBTDtBQUNIOzs7O0lBckV1QnVELGdCLFdBdUVWakUsUyxHQUFZQSxTLDZYQWhCekJrRSxhLDBMQTBCQUMsb0I7Ozs7O2FBRW9DLEU7OzhFQUNwQ0Esb0I7Ozs7O2FBQ2dDLEk7O2lGQUNoQ0Esb0I7Ozs7O2FBQ29CbkUsU0FBUyxDQUFDK0MsVTs7Z0ZBQzlCb0Isb0I7Ozs7O2FBQ21CLEc7OztBQXVKeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50SGFuZGxlciB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRpb25PcmRlciwgbWVudSwgcmVxdWlyZUNvbXBvbmVudCwgdG9vbHRpcCwgdHlwZSwgc2xpZGUsIHJhbmdlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBFdmVudFRvdWNoLCBTeXN0ZW1FdmVudFR5cGUsIFRvdWNoIH0gZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBjY2VudW0gfSBmcm9tICcuLi8uLi9jb3JlL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5pbXBvcnQgeyBjbGFtcDAxIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3V0aWxzJztcclxuaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgX3RlbXBQb3MgPSBuZXcgVmVjMygpO1xyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBTbGlkZXIgRGlyZWN0aW9uLlxyXG4gKlxyXG4gKiBAemhcclxuICog5ruR5Yqo5Zmo5pa55ZCR44CCXHJcbiAqL1xyXG5lbnVtIERpcmVjdGlvbiB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGhvcml6b250YWwgZGlyZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rC05bmz5pa55ZCR44CCXHJcbiAgICAgKi9cclxuICAgIEhvcml6b250YWwgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB2ZXJ0aWNhbCBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlnoLnm7TmlrnlkJHjgIJcclxuICAgICAqL1xyXG4gICAgVmVydGljYWwgPSAxLFxyXG59XHJcblxyXG5jY2VudW0oRGlyZWN0aW9uKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhlIFNsaWRlciBDb250cm9sLlxyXG4gKlxyXG4gKiBAemhcclxuICog5ruR5Yqo5Zmo57uE5Lu244CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU2xpZGVyJylcclxuQGhlbHAoJ2kxOG46Y2MuU2xpZGVyJylcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQG1lbnUoJ1VJL1NsaWRlcicpXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5leHBvcnQgY2xhc3MgU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIFwiaGFuZGxlXCIgcGFydCBvZiB0aGUgc2xpZGVyLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5ruR5Yqo5Zmo5ruR5Z2X5oyJ6ZKu6YOo5Lu244CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFNwcml0ZSlcclxuICAgIEB0b29sdGlwKCfmu5HlnZfmjInpkq7pg6jku7YnKVxyXG4gICAgZ2V0IGhhbmRsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaGFuZGxlICh2YWx1ZTogU3ByaXRlIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2hhbmRsZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgdGhpcy5faGFuZGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUhhbmRsZVBvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc2xpZGVyIGRpcmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7keWKqOWZqOaWueWQkeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShEaXJlY3Rpb24pXHJcbiAgICBAdG9vbHRpcCgn5ruR5Yqo5pa55ZCRJylcclxuICAgIGdldCBkaXJlY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGRpcmVjdGlvbiAodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZUxheW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgY3VycmVudCBwcm9ncmVzcyBvZiB0aGUgc2xpZGVyLiBUaGUgdmFsaWQgdmFsdWUgaXMgYmV0d2VlbiAwLTEuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY3ov5vluqblgLzvvIzor6XmlbDlgLznmoTljLrpl7TmmK8gMC0xIOS5i+mXtOOAglxyXG4gICAgICovXHJcbiAgICBAc2xpZGVcclxuICAgIEByYW5nZShbMCwgMSwgMC4wMV0pXHJcbiAgICBAdG9vbHRpcCgn5b2T5YmN6L+b5bqm5YC877yM6K+l5pWw5YC855qE5Yy66Ze05pivIDAgLSAxIOS5i+mXtOOAgicpXHJcbiAgICBnZXQgcHJvZ3Jlc3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmVzcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcHJvZ3Jlc3MgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Byb2dyZXNzID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUhhbmRsZVBvc2l0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBEaXJlY3Rpb24gPSBEaXJlY3Rpb247XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBzbGlkZXIgc2xpZGUgZXZlbnRzJyBjYWxsYmFjayBhcnJheS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7keWKqOWZqOe7hOS7tua7keWKqOS6i+S7tuWbnuiwg+WHveaVsOaVsOe7hOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShbRXZlbnRIYW5kbGVyXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB0b29sdGlwKCfmu5Hliqjlmajnu4Tku7bkuovku7blm57osIPlh73mlbAnKVxyXG4gICAgcHVibGljIHNsaWRlRXZlbnRzOiBFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaGFuZGxlOiBTcHJpdGUgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2RpcmVjdGlvbiA9IERpcmVjdGlvbi5Ib3Jpem9udGFsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfcHJvZ3Jlc3MgPSAwLjE7XHJcblxyXG4gICAgcHJpdmF0ZSBfb2Zmc2V0OiBWZWMzID0gbmV3IFZlYzMoKTtcclxuICAgIHByaXZhdGUgX2RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF90b3VjaEhhbmRsZSA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaGFuZGxlTG9jYWxQb3MgPSBuZXcgVmVjMygpO1xyXG4gICAgcHJpdmF0ZSBfdG91Y2hQb3MgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIHB1YmxpYyBfX3ByZWxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUhhbmRsZVBvc2l0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5rOo5YaM5LqL5Lu2XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVIYW5kbGVQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmVkLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbGxlZCwgdGhpcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZSAmJiB0aGlzLl9oYW5kbGUuaXNWYWxpZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGUubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uSGFuZGxlRHJhZ1N0YXJ0LCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uVG91Y2hNb3ZlZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZS5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuX29uVG91Y2hNb3ZlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbGxlZCwgdGhpcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZSAmJiB0aGlzLl9oYW5kbGUuaXNWYWxpZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGUubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vbkhhbmRsZURyYWdTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZS5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmVkLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25IYW5kbGVEcmFnU3RhcnQgKGV2ZW50PzogRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIGlmICghZXZlbnQgfHwgIXRoaXMuX2hhbmRsZSB8fCAhdGhpcy5faGFuZGxlLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl90b3VjaEhhbmRsZSA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgdG91aFBvcyA9IGV2ZW50LnRvdWNoIS5nZXRVSUxvY2F0aW9uKCk7XHJcbiAgICAgICAgVmVjMy5zZXQodGhpcy5fdG91Y2hQb3MsIHRvdWhQb3MueCwgdG91aFBvcy55LCAwKTtcclxuICAgICAgICB0aGlzLl9oYW5kbGUubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAuY29udmVydFRvTm9kZVNwYWNlQVIodGhpcy5fdG91Y2hQb3MsIHRoaXMuX29mZnNldCk7XHJcblxyXG4gICAgICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoQmVnYW4gKGV2ZW50PzogRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faGFuZGxlIHx8ICFldmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLl90b3VjaEhhbmRsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVTbGlkZXJMb2dpYyhldmVudC50b3VjaCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25Ub3VjaE1vdmVkIChldmVudD86IEV2ZW50VG91Y2gpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2RyYWdnaW5nIHx8ICFldmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9oYW5kbGVTbGlkZXJMb2dpYyhldmVudC50b3VjaCk7XHJcbiAgICAgICAgZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hFbmRlZCAoZXZlbnQ/OiBFdmVudFRvdWNoKSB7XHJcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl90b3VjaEhhbmRsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX29mZnNldCA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hDYW5jZWxsZWQgKGV2ZW50PzogRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIHRoaXMuX2RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaGFuZGxlU2xpZGVyTG9naWMgKHRvdWNoOiBUb3VjaCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzcyh0b3VjaCk7XHJcbiAgICAgICAgdGhpcy5fZW1pdFNsaWRlRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2VtaXRTbGlkZUV2ZW50ICgpIHtcclxuICAgICAgICBFdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnNsaWRlRXZlbnRzLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnc2xpZGUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVByb2dyZXNzICh0b3VjaDogVG91Y2ggfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9oYW5kbGUgfHwgIXRvdWNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRvdWNoUG9zID0gdG91Y2guZ2V0VUlMb2NhdGlvbigpO1xyXG4gICAgICAgIFZlYzMuc2V0KHRoaXMuX3RvdWNoUG9zLCB0b3VjaFBvcy54LCB0b3VjaFBvcy55LCAwKTtcclxuICAgICAgICBjb25zdCB1aVRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3QgbG9jYWxUb3VjaFBvcyA9IHVpVHJhbnMuY29udmVydFRvTm9kZVNwYWNlQVIodGhpcy5fdG91Y2hQb3MsIF90ZW1wUG9zKTtcclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBjbGFtcDAxKDAuNSArIChsb2NhbFRvdWNoUG9zLnggLSB0aGlzLl9vZmZzZXQueCkgLyB1aVRyYW5zLndpZHRoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gY2xhbXAwMSgwLjUgKyAobG9jYWxUb3VjaFBvcy55IC0gdGhpcy5fb2Zmc2V0LnkpIC8gdWlUcmFucy5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZUhhbmRsZVBvc2l0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2hhbmRsZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2hhbmRsZUxvY2FsUG9zLnNldCh0aGlzLl9oYW5kbGUubm9kZS5nZXRQb3NpdGlvbigpKTtcclxuICAgICAgICBjb25zdCB1aVRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxQb3MueCA9IC11aVRyYW5zLndpZHRoICogdWlUcmFucy5hbmNob3JYICsgdGhpcy5wcm9ncmVzcyAqIHVpVHJhbnMud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlTG9jYWxQb3MueSA9IC11aVRyYW5zLmhlaWdodCAqIHVpVHJhbnMuYW5jaG9yWSArIHRoaXMucHJvZ3Jlc3MgKiB1aVRyYW5zLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2hhbmRsZS5ub2RlLnNldFBvc2l0aW9uKHRoaXMuX2hhbmRsZUxvY2FsUG9zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jaGFuZ2VMYXlvdXQgKCkge1xyXG4gICAgICAgIGNvbnN0IHVpVHJhbnMgPSB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICBjb25zdCBjb250ZW50U2l6ZSA9IHVpVHJhbnMuY29udGVudFNpemU7XHJcbiAgICAgICAgdWlUcmFucy5zZXRDb250ZW50U2l6ZShjb250ZW50U2l6ZS5oZWlnaHQsIGNvbnRlbnRTaXplLndpZHRoKTtcclxuICAgICAgICBpZih0aGlzLl9oYW5kbGUpe1xyXG4gICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLl9oYW5kbGUubm9kZS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZS5ub2RlLnNldFBvc2l0aW9uKHBvcy54LCAwLCBwb3Mueik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGUubm9kZS5zZXRQb3NpdGlvbigwLCBwb3MueSwgcG9zLnopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVIYW5kbGVQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IHNsaWRlXHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2xpZGVyfSBzbGlkZXIgLSBUaGUgc2xpZGVyIGNvbXBvbmVudC5cclxuICovXHJcbiJdfQ==