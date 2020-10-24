(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component.js", "../../core/components/ui-base/index.js", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/enum.js", "../../core/math/utils.js", "./sprite.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component.js"), require("../../core/components/ui-base/index.js"), require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("../../core/math/utils.js"), require("./sprite.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.index, global.index, global._enum, global.utils, global.sprite);
    global.scrollBar = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _index2, _index3, _enum, _utils, _sprite) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ScrollBar = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _temp;

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

  var GETTING_SHORTER_FACTOR = 20;
  var ZERO = new _index3.Vec3();

  var _tempPos_1 = new _index3.Vec3();

  var _tempPos_2 = new _index3.Vec3();

  var defaultAnchor = new _index3.Vec2();

  var _tempColor = new _index3.Color();
  /**
   * @en
   * Enum for ScrollBar direction.
   *
   * @zh
   * 滚动条方向。
   */


  var Direction;

  (function (Direction) {
    Direction[Direction["HORIZONTAL"] = 0] = "HORIZONTAL";
    Direction[Direction["VERTICAL"] = 1] = "VERTICAL";
  })(Direction || (Direction = {}));

  (0, _enum.ccenum)(Direction);
  /**
   * @en
   * The ScrollBar control allows the user to scroll an image or other view that is too large to see completely.
   *
   * @zh
   * 滚动条组件。
   */

  var ScrollBar = (_dec = (0, _index2.ccclass)('cc.ScrollBar'), _dec2 = (0, _index2.help)('i18n:cc.ScrollBar'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/ScrollBar'), _dec5 = (0, _index2.requireComponent)(_index.UITransform), _dec6 = (0, _index2.type)(_sprite.Sprite), _dec7 = (0, _index2.displayOrder)(0), _dec8 = (0, _index2.tooltip)('作为当前滚动区域位置显示的滑块 Sprite'), _dec9 = (0, _index2.type)(Direction), _dec10 = (0, _index2.displayOrder)(1), _dec11 = (0, _index2.tooltip)('ScrollBar 的滚动方向'), _dec12 = (0, _index2.displayOrder)(2), _dec13 = (0, _index2.tooltip)('是否在没有滚动动作时自动隐藏 ScrollBar'), _dec14 = (0, _index2.displayOrder)(3), _dec15 = (0, _index2.tooltip)('没有滚动动作后经过多久会自动隐藏。\n注意：只要当 “enableAutoHide” 为 true 时，才有效。'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(ScrollBar, _Component);

    function ScrollBar() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ScrollBar);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollBar)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_scrollView", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_handle", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_enableAutoHide", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_autoHideTime", _descriptor5, _assertThisInitialized(_this));

      _this._touching = false;
      _this._opacity = 255;
      _this._autoHideRemainingTime = 0;
      return _this;
    }

    _createClass(ScrollBar, [{
      key: "hide",

      /**
       * @en
       * Hide ScrollBar.
       *
       * @zh
       * 滚动条隐藏。
       */
      value: function hide() {
        this._autoHideRemainingTime = 0;

        this._setOpacity(0);
      }
      /**
       * @en
       * Show ScrollBar.
       *
       * @zh
       * 滚动条显示。
       */

    }, {
      key: "show",
      value: function show() {
        this._autoHideRemainingTime = this._autoHideTime;

        this._setOpacity(this._opacity);
      }
      /**
       * @en
       * Reset the position of ScrollBar.
       *
       * @zh
       * 重置滚动条位置。
       *
       * @param outOfBoundary - 滚动位移。
       */

    }, {
      key: "onScroll",
      value: function onScroll(outOfBoundary) {
        if (!this._scrollView) {
          return;
        }

        var content = this._scrollView.content;

        if (!content) {
          return;
        }

        var contentSize = content._uiProps.uiTransformComp.contentSize;
        var scrollViewSize = this._scrollView.node._uiProps.uiTransformComp.contentSize;
        var barSize = this.node._uiProps.uiTransformComp.contentSize;

        if (this._conditionalDisableScrollBar(contentSize, scrollViewSize)) {
          return;
        }

        if (this._enableAutoHide) {
          this._autoHideRemainingTime = this._autoHideTime;

          this._setOpacity(this._opacity);
        }

        var contentMeasure = 0;
        var scrollViewMeasure = 0;
        var outOfBoundaryValue = 0;
        var contentPosition = 0;
        var handleNodeMeasure = 0;

        if (this._direction === Direction.HORIZONTAL) {
          contentMeasure = contentSize.width;
          scrollViewMeasure = scrollViewSize.width;
          handleNodeMeasure = barSize.width;
          outOfBoundaryValue = outOfBoundary.x;
          contentPosition = -this._convertToScrollViewSpace(content).x;
        } else if (this._direction === Direction.VERTICAL) {
          contentMeasure = contentSize.height;
          scrollViewMeasure = scrollViewSize.height;
          handleNodeMeasure = barSize.height;
          outOfBoundaryValue = outOfBoundary.y;
          contentPosition = -this._convertToScrollViewSpace(content).y;
        }

        var length = this._calculateLength(contentMeasure, scrollViewMeasure, handleNodeMeasure, outOfBoundaryValue);

        var position = this._calculatePosition(contentMeasure, scrollViewMeasure, handleNodeMeasure, contentPosition, outOfBoundaryValue, length);

        this._updateLength(length);

        this._updateHandlerPosition(position);
      }
      /**
       * @zh
       * 滚动视窗设置。
       *
       * @param scrollView - 滚动视窗。
       */

    }, {
      key: "setScrollView",
      value: function setScrollView(scrollView) {
        this._scrollView = scrollView;
      }
    }, {
      key: "onTouchBegan",
      value: function onTouchBegan() {
        if (!this._enableAutoHide) {
          return;
        }

        this._touching = true;
      }
    }, {
      key: "onTouchEnded",
      value: function onTouchEnded() {
        if (!this._enableAutoHide) {
          return;
        }

        this._touching = false;

        if (this._autoHideTime <= 0) {
          return;
        }

        if (this._scrollView) {
          var content = this._scrollView.content;

          if (content) {
            var contentSize = content._uiProps.uiTransformComp.contentSize;
            var scrollViewSize = this._scrollView.node._uiProps.uiTransformComp.contentSize;

            if (this._conditionalDisableScrollBar(contentSize, scrollViewSize)) {
              return;
            }
          }
        }

        this._autoHideRemainingTime = this._autoHideTime;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        var renderComp = this.node.getComponent(_sprite.Sprite);

        if (renderComp) {
          this._opacity = renderComp.color.a;
        }
      }
    }, {
      key: "start",
      value: function start() {
        if (this._enableAutoHide) {
          this._setOpacity(0);
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        this._processAutoHide(dt);
      }
    }, {
      key: "_convertToScrollViewSpace",
      value: function _convertToScrollViewSpace(content) {
        var scrollTrans = this._scrollView && this._scrollView.node._uiProps.uiTransformComp;
        var contentTrans = content._uiProps.uiTransformComp;

        if (!scrollTrans || !contentTrans) {
          return ZERO;
        }

        _tempPos_1.set(-contentTrans.anchorX * contentTrans.width, -contentTrans.anchorY * contentTrans.height, 0);

        contentTrans.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);
        var scrollViewSpacePos = scrollTrans.convertToNodeSpaceAR(_tempPos_2);
        scrollViewSpacePos.x += scrollTrans.anchorX * scrollTrans.width;
        scrollViewSpacePos.y += scrollTrans.anchorY * scrollTrans.height;
        return scrollViewSpacePos;
      }
    }, {
      key: "_setOpacity",
      value: function _setOpacity(opacity) {
        if (this._handle) {
          var renderComp = this.node.getComponent(_sprite.Sprite);

          if (renderComp) {
            _tempColor.set(renderComp.color);

            _tempColor.a = opacity;
            renderComp.color = _tempColor;
          }

          renderComp = this._handle.getComponent(_sprite.Sprite);

          if (renderComp) {
            _tempColor.set(renderComp.color);

            _tempColor.a = opacity;
            renderComp.color = _tempColor;
          }
        }
      }
    }, {
      key: "_updateHandlerPosition",
      value: function _updateHandlerPosition(position) {
        if (this._handle) {
          var oldPosition = this._fixupHandlerPosition();

          this._handle.node.setPosition(position.x + oldPosition.x, position.y + oldPosition.y, oldPosition.z);
        }
      }
    }, {
      key: "_fixupHandlerPosition",
      value: function _fixupHandlerPosition() {
        var uiTrans = this.node._uiProps.uiTransformComp;
        var barSize = uiTrans.contentSize;
        var barAnchor = uiTrans.anchorPoint;
        var handleSize = this.handle.node._uiProps.uiTransformComp.contentSize;
        var handleParent = this.handle.node.parent;

        _index3.Vec3.set(_tempPos_1, -barSize.width * barAnchor.x, -barSize.height * barAnchor.y, 0);

        var leftBottomWorldPosition = this.node._uiProps.uiTransformComp.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);

        var fixupPosition = new _index3.Vec3();

        handleParent._uiProps.uiTransformComp.convertToNodeSpaceAR(leftBottomWorldPosition, fixupPosition);

        if (this.direction === Direction.HORIZONTAL) {
          fixupPosition = new _index3.Vec3(fixupPosition.x, fixupPosition.y + (barSize.height - handleSize.height) / 2, 0);
        } else if (this.direction === Direction.VERTICAL) {
          fixupPosition = new _index3.Vec3(fixupPosition.x + (barSize.width - handleSize.width) / 2, fixupPosition.y, 0);
        }

        this.handle.node.setPosition(fixupPosition);
        return fixupPosition;
      }
    }, {
      key: "_conditionalDisableScrollBar",
      value: function _conditionalDisableScrollBar(contentSize, scrollViewSize) {
        if (contentSize.width <= scrollViewSize.width && this._direction === Direction.HORIZONTAL) {
          return true;
        }

        if (contentSize.height <= scrollViewSize.height && this._direction === Direction.VERTICAL) {
          return true;
        }

        return false;
      }
    }, {
      key: "_calculateLength",
      value: function _calculateLength(contentMeasure, scrollViewMeasure, handleNodeMeasure, outOfBoundary) {
        var denominatorValue = contentMeasure;

        if (outOfBoundary) {
          denominatorValue += (outOfBoundary > 0 ? outOfBoundary : -outOfBoundary) * GETTING_SHORTER_FACTOR;
        }

        var lengthRation = scrollViewMeasure / denominatorValue;
        return handleNodeMeasure * lengthRation;
      }
    }, {
      key: "_calculatePosition",
      value: function _calculatePosition(contentMeasure, scrollViewMeasure, handleNodeMeasure, contentPosition, outOfBoundary, actualLenth) {
        var denominatorValue = contentMeasure - scrollViewMeasure;

        if (outOfBoundary) {
          denominatorValue += Math.abs(outOfBoundary);
        }

        var positionRatio = 0;

        if (denominatorValue) {
          positionRatio = contentPosition / denominatorValue;
          positionRatio = (0, _utils.clamp01)(positionRatio);
        }

        var position = (handleNodeMeasure - actualLenth) * positionRatio;

        if (this._direction === Direction.VERTICAL) {
          return new _index3.Vec3(0, position, 0);
        } else {
          return new _index3.Vec3(position, 0, 0);
        }
      }
    }, {
      key: "_updateLength",
      value: function _updateLength(length) {
        if (this._handle) {
          var handleNode = this._handle.node;
          var handleTrans = handleNode._uiProps.uiTransformComp;
          var handleNodeSize = handleTrans.contentSize;
          var anchor = handleTrans.anchorPoint;

          if (anchor.x !== defaultAnchor.x || anchor.y !== defaultAnchor.y) {
            handleTrans.setAnchorPoint(defaultAnchor);
          }

          if (this._direction === Direction.HORIZONTAL) {
            handleTrans.setContentSize(length, handleNodeSize.height);
          } else {
            handleTrans.setContentSize(handleNodeSize.width, length);
          }
        }
      }
    }, {
      key: "_processAutoHide",
      value: function _processAutoHide(deltaTime) {
        if (!this._enableAutoHide || this._autoHideRemainingTime <= 0) {
          return;
        } else if (this._touching) {
          return;
        }

        this._autoHideRemainingTime -= deltaTime;

        if (this._autoHideRemainingTime <= this._autoHideTime) {
          this._autoHideRemainingTime = Math.max(0, this._autoHideRemainingTime);
          var opacity = this._opacity * (this._autoHideRemainingTime / this._autoHideTime);

          this._setOpacity(opacity);
        }
      }
    }, {
      key: "handle",

      /**
       * @en
       * The "handle" part of the ScrollBar.
       *
       * @zh
       * 作为当前滚动区域位置显示的滑块 Sprite。
       */
      get: function get() {
        return this._handle;
      },
      set: function set(value) {
        if (this._handle === value) {
          return;
        }

        this._handle = value;
        this.onScroll(ZERO);
      }
      /**
       * @en
       * The direction of scrolling.
       *
       * @zh
       * ScrollBar 的滚动方向。
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
        this.onScroll(new _index3.Vec3());
      }
      /**
       * @en
       * Whether enable auto hide or not.
       *
       * @zh
       * 是否在没有滚动动作时自动隐藏 ScrollBar。
       */

    }, {
      key: "enableAutoHide",
      get: function get() {
        return this._enableAutoHide;
      },
      set: function set(value) {
        if (this._enableAutoHide === value) {
          return;
        }

        this._enableAutoHide = value;

        if (this._enableAutoHide) {
          this._setOpacity(0);
        }
      }
      /**
       * @en
       * The time to hide ScrollBar when scroll finished.
       * Note: This value is only useful when enableAutoHide is true.
       *
       * @zh
       * 没有滚动动作后经过多久会自动隐藏。<br/>
       * 注意：只要当 “enableAutoHide” 为 true 时，才有效。
       */

    }, {
      key: "autoHideTime",
      get: function get() {
        return this._autoHideTime;
      },
      set: function set(value) {
        if (this._autoHideTime === value) {
          return;
        }

        this._autoHideTime = value;
      }
    }]);

    return ScrollBar;
  }(_component.Component), _class3.Direction = Direction, _temp), (_applyDecoratedDescriptor(_class2.prototype, "handle", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "handle"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec9, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "direction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "enableAutoHide", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "enableAutoHide"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "autoHideTime", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "autoHideTime"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_scrollView", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_handle", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_direction", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Direction.HORIZONTAL;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_enableAutoHide", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_autoHideTime", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1.0;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.ScrollBar = ScrollBar;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvc2Nyb2xsLWJhci50cyJdLCJuYW1lcyI6WyJHRVRUSU5HX1NIT1JURVJfRkFDVE9SIiwiWkVSTyIsIlZlYzMiLCJfdGVtcFBvc18xIiwiX3RlbXBQb3NfMiIsImRlZmF1bHRBbmNob3IiLCJWZWMyIiwiX3RlbXBDb2xvciIsIkNvbG9yIiwiRGlyZWN0aW9uIiwiU2Nyb2xsQmFyIiwiVUlUcmFuc2Zvcm0iLCJTcHJpdGUiLCJfdG91Y2hpbmciLCJfb3BhY2l0eSIsIl9hdXRvSGlkZVJlbWFpbmluZ1RpbWUiLCJfc2V0T3BhY2l0eSIsIl9hdXRvSGlkZVRpbWUiLCJvdXRPZkJvdW5kYXJ5IiwiX3Njcm9sbFZpZXciLCJjb250ZW50IiwiY29udGVudFNpemUiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsInNjcm9sbFZpZXdTaXplIiwibm9kZSIsImJhclNpemUiLCJfY29uZGl0aW9uYWxEaXNhYmxlU2Nyb2xsQmFyIiwiX2VuYWJsZUF1dG9IaWRlIiwiY29udGVudE1lYXN1cmUiLCJzY3JvbGxWaWV3TWVhc3VyZSIsIm91dE9mQm91bmRhcnlWYWx1ZSIsImNvbnRlbnRQb3NpdGlvbiIsImhhbmRsZU5vZGVNZWFzdXJlIiwiX2RpcmVjdGlvbiIsIkhPUklaT05UQUwiLCJ3aWR0aCIsIngiLCJfY29udmVydFRvU2Nyb2xsVmlld1NwYWNlIiwiVkVSVElDQUwiLCJoZWlnaHQiLCJ5IiwibGVuZ3RoIiwiX2NhbGN1bGF0ZUxlbmd0aCIsInBvc2l0aW9uIiwiX2NhbGN1bGF0ZVBvc2l0aW9uIiwiX3VwZGF0ZUxlbmd0aCIsIl91cGRhdGVIYW5kbGVyUG9zaXRpb24iLCJzY3JvbGxWaWV3IiwicmVuZGVyQ29tcCIsImdldENvbXBvbmVudCIsImNvbG9yIiwiYSIsImR0IiwiX3Byb2Nlc3NBdXRvSGlkZSIsInNjcm9sbFRyYW5zIiwiY29udGVudFRyYW5zIiwic2V0IiwiYW5jaG9yWCIsImFuY2hvclkiLCJjb252ZXJ0VG9Xb3JsZFNwYWNlQVIiLCJzY3JvbGxWaWV3U3BhY2VQb3MiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsIm9wYWNpdHkiLCJfaGFuZGxlIiwib2xkUG9zaXRpb24iLCJfZml4dXBIYW5kbGVyUG9zaXRpb24iLCJzZXRQb3NpdGlvbiIsInoiLCJ1aVRyYW5zIiwiYmFyQW5jaG9yIiwiYW5jaG9yUG9pbnQiLCJoYW5kbGVTaXplIiwiaGFuZGxlIiwiaGFuZGxlUGFyZW50IiwicGFyZW50IiwibGVmdEJvdHRvbVdvcmxkUG9zaXRpb24iLCJmaXh1cFBvc2l0aW9uIiwiZGlyZWN0aW9uIiwiZGVub21pbmF0b3JWYWx1ZSIsImxlbmd0aFJhdGlvbiIsImFjdHVhbExlbnRoIiwiTWF0aCIsImFicyIsInBvc2l0aW9uUmF0aW8iLCJoYW5kbGVOb2RlIiwiaGFuZGxlVHJhbnMiLCJoYW5kbGVOb2RlU2l6ZSIsImFuY2hvciIsInNldEFuY2hvclBvaW50Iiwic2V0Q29udGVudFNpemUiLCJkZWx0YVRpbWUiLCJtYXgiLCJ2YWx1ZSIsIm9uU2Nyb2xsIiwiQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBLE1BQU1BLHNCQUFzQixHQUFHLEVBQS9CO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLElBQUlDLFlBQUosRUFBYjs7QUFDQSxNQUFNQyxVQUFVLEdBQUcsSUFBSUQsWUFBSixFQUFuQjs7QUFDQSxNQUFNRSxVQUFVLEdBQUcsSUFBSUYsWUFBSixFQUFuQjs7QUFDQSxNQUFNRyxhQUFhLEdBQUcsSUFBSUMsWUFBSixFQUF0Qjs7QUFDQSxNQUFNQyxVQUFVLEdBQUcsSUFBSUMsYUFBSixFQUFuQjtBQUVBOzs7Ozs7Ozs7TUFPS0MsUzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0tBQUFBLFMsS0FBQUEsUzs7QUFv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O0FBQ0g7O0FBQ0QsYUFBSzdCLE9BQUwsR0FBZTZCLEtBQWY7QUFDQSxhQUFLQyxRQUFMLENBQWM3RixJQUFkO0FBQ0g7QUFFRDs7Ozs7Ozs7OzswQkFVaUI7QUFDYixlQUFPLEtBQUtpQyxVQUFaO0FBQ0gsTzt3QkFFYzJELEssRUFBTztBQUNsQixZQUFJLEtBQUszRCxVQUFMLEtBQW9CMkQsS0FBeEIsRUFBK0I7QUFDM0I7QUFDSDs7QUFFRCxhQUFLM0QsVUFBTCxHQUFrQjJELEtBQWxCO0FBQ0EsYUFBS0MsUUFBTCxDQUFjLElBQUk1RixZQUFKLEVBQWQ7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVNzQjtBQUNsQixlQUFPLEtBQUswQixlQUFaO0FBQ0gsTzt3QkFFbUJpRSxLLEVBQU87QUFDdkIsWUFBSSxLQUFLakUsZUFBTCxLQUF5QmlFLEtBQTdCLEVBQW9DO0FBQ2hDO0FBQ0g7O0FBRUQsYUFBS2pFLGVBQUwsR0FBdUJpRSxLQUF2Qjs7QUFDQSxZQUFJLEtBQUtqRSxlQUFULEVBQTBCO0FBQ3RCLGVBQUtaLFdBQUwsQ0FBaUIsQ0FBakI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7OzswQkFXb0I7QUFDaEIsZUFBTyxLQUFLQyxhQUFaO0FBQ0gsTzt3QkFFaUI0RSxLLEVBQU87QUFDckIsWUFBSSxLQUFLNUUsYUFBTCxLQUF1QjRFLEtBQTNCLEVBQWtDO0FBQzlCO0FBQ0g7O0FBRUQsYUFBSzVFLGFBQUwsR0FBcUI0RSxLQUFyQjtBQUNIOzs7O0lBNUYwQkUsb0IsV0E4RmJ0RixTLEdBQVlBLFMsZ3ZCQUN6QnVGLG9COzs7OzthQUMwQyxJOzs4RUFDMUNBLG9COzs7OzthQUNrQyxJOztpRkFDbENBLG9COzs7OzthQUNzQnZGLFNBQVMsQ0FBQzBCLFU7O3NGQUNoQzZELG9COzs7OzthQUMyQixLOztvRkFDM0JBLG9COzs7OzthQUN5QixHIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlJ1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRpb25PcmRlciwgbWVudSwgcmVxdWlyZUNvbXBvbmVudCwgdG9vbHRpcCwgZGlzcGxheU9yZGVyLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xvciwgU2l6ZSwgVmVjMiwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IGNsYW1wMDEgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBTY3JvbGxWaWV3IH0gZnJvbSAnLi9zY3JvbGwtdmlldyc7XHJcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4vc3ByaXRlJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgR0VUVElOR19TSE9SVEVSX0ZBQ1RPUiA9IDIwO1xyXG5jb25zdCBaRVJPID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX3RlbXBQb3NfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF90ZW1wUG9zXzIgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBkZWZhdWx0QW5jaG9yID0gbmV3IFZlYzIoKTtcclxuY29uc3QgX3RlbXBDb2xvciA9IG5ldyBDb2xvcigpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBFbnVtIGZvciBTY3JvbGxCYXIgZGlyZWN0aW9uLlxyXG4gKlxyXG4gKiBAemhcclxuICog5rua5Yqo5p2h5pa55ZCR44CCXHJcbiAqL1xyXG5lbnVtIERpcmVjdGlvbiB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSG9yaXpvbnRhbCBzY3JvbGwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmqKrlkJHmu5rliqjjgIJcclxuICAgICAqL1xyXG4gICAgSE9SSVpPTlRBTCA9IDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFZlcnRpY2FsIHNjcm9sbC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOe6teWQkea7muWKqOOAglxyXG4gICAgICovXHJcbiAgICBWRVJUSUNBTCA9IDEsXHJcbn1cclxuXHJcbmNjZW51bShEaXJlY3Rpb24pO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgU2Nyb2xsQmFyIGNvbnRyb2wgYWxsb3dzIHRoZSB1c2VyIHRvIHNjcm9sbCBhbiBpbWFnZSBvciBvdGhlciB2aWV3IHRoYXQgaXMgdG9vIGxhcmdlIHRvIHNlZSBjb21wbGV0ZWx5LlxyXG4gKlxyXG4gKiBAemhcclxuICog5rua5Yqo5p2h57uE5Lu244CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU2Nyb2xsQmFyJylcclxuQGhlbHAoJ2kxOG46Y2MuU2Nyb2xsQmFyJylcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQG1lbnUoJ1VJL1Njcm9sbEJhcicpXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5leHBvcnQgY2xhc3MgU2Nyb2xsQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIFwiaGFuZGxlXCIgcGFydCBvZiB0aGUgU2Nyb2xsQmFyLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5L2c5Li65b2T5YmN5rua5Yqo5Yy65Z+f5L2N572u5pi+56S655qE5ruR5Z2XIFNwcml0ZeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBAdG9vbHRpcCgn5L2c5Li65b2T5YmN5rua5Yqo5Yy65Z+f5L2N572u5pi+56S655qE5ruR5Z2XIFNwcml0ZScpXHJcbiAgICBnZXQgaGFuZGxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBoYW5kbGUgKHZhbHVlOiBTcHJpdGUgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm9uU2Nyb2xsKFpFUk8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZGlyZWN0aW9uIG9mIHNjcm9sbGluZy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIFNjcm9sbEJhciDnmoTmu5rliqjmlrnlkJHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRGlyZWN0aW9uKVxyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ1Njcm9sbEJhciDnmoTmu5rliqjmlrnlkJEnKVxyXG4gICAgZ2V0IGRpcmVjdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGlyZWN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub25TY3JvbGwobmV3IFZlYzMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgZW5hYmxlIGF1dG8gaGlkZSBvciBub3QuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblnKjmsqHmnInmu5rliqjliqjkvZzml7boh6rliqjpmpDol48gU2Nyb2xsQmFy44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCfmmK/lkKblnKjmsqHmnInmu5rliqjliqjkvZzml7boh6rliqjpmpDol48gU2Nyb2xsQmFyJylcclxuICAgIGdldCBlbmFibGVBdXRvSGlkZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZUF1dG9IaWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBlbmFibGVBdXRvSGlkZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fZW5hYmxlQXV0b0hpZGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2VuYWJsZUF1dG9IaWRlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZUF1dG9IaWRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldE9wYWNpdHkoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgdGltZSB0byBoaWRlIFNjcm9sbEJhciB3aGVuIHNjcm9sbCBmaW5pc2hlZC5cclxuICAgICAqIE5vdGU6IFRoaXMgdmFsdWUgaXMgb25seSB1c2VmdWwgd2hlbiBlbmFibGVBdXRvSGlkZSBpcyB0cnVlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rKh5pyJ5rua5Yqo5Yqo5L2c5ZCO57uP6L+H5aSa5LmF5Lya6Ieq5Yqo6ZqQ6JeP44CCPGJyLz5cclxuICAgICAqIOazqOaEj++8muWPquimgeW9kyDigJxlbmFibGVBdXRvSGlkZeKAnSDkuLogdHJ1ZSDml7bvvIzmiY3mnInmlYjjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigzKVxyXG4gICAgQHRvb2x0aXAoJ+ayoeaciea7muWKqOWKqOS9nOWQjue7j+i/h+WkmuS5heS8muiHquWKqOmakOiXj+OAglxcbuazqOaEj++8muWPquimgeW9kyDigJxlbmFibGVBdXRvSGlkZeKAnSDkuLogdHJ1ZSDml7bvvIzmiY3mnInmlYjjgIInKVxyXG4gICAgZ2V0IGF1dG9IaWRlVGltZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9IaWRlVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYXV0b0hpZGVUaW1lICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hdXRvSGlkZVRpbWUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2F1dG9IaWRlVGltZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgRGlyZWN0aW9uID0gRGlyZWN0aW9uO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zY3JvbGxWaWV3OiBTY3JvbGxWaWV3IHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2hhbmRsZTogU3ByaXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2RpcmVjdGlvbiA9IERpcmVjdGlvbi5IT1JJWk9OVEFMO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9lbmFibGVBdXRvSGlkZSA9IGZhbHNlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9hdXRvSGlkZVRpbWUgPSAxLjA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF90b3VjaGluZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9vcGFjaXR5ID0gMjU1O1xyXG4gICAgcHJvdGVjdGVkIF9hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBIaWRlIFNjcm9sbEJhci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOadoemakOiXj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGlkZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gMDtcclxuICAgICAgICB0aGlzLl9zZXRPcGFjaXR5KDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTaG93IFNjcm9sbEJhci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOadoeaYvuekuuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvdyAoKSB7XHJcbiAgICAgICAgdGhpcy5fYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5fYXV0b0hpZGVUaW1lO1xyXG4gICAgICAgIHRoaXMuX3NldE9wYWNpdHkodGhpcy5fb3BhY2l0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlc2V0IHRoZSBwb3NpdGlvbiBvZiBTY3JvbGxCYXIuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDph43nva7mu5rliqjmnaHkvY3nva7jgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gb3V0T2ZCb3VuZGFyeSAtIOa7muWKqOS9jeenu+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25TY3JvbGwgKG91dE9mQm91bmRhcnk6IFZlYzMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3Njcm9sbFZpZXcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuX3Njcm9sbFZpZXcuY29udGVudDtcclxuICAgICAgICBpZiAoIWNvbnRlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29udGVudFNpemUgPSBjb250ZW50Ll91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsVmlld1NpemUgPSB0aGlzLl9zY3JvbGxWaWV3Lm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5jb250ZW50U2l6ZTtcclxuICAgICAgICBjb25zdCBiYXJTaXplID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jb25kaXRpb25hbERpc2FibGVTY3JvbGxCYXIoY29udGVudFNpemUsIHNjcm9sbFZpZXdTaXplKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZW5hYmxlQXV0b0hpZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5fYXV0b0hpZGVUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRPcGFjaXR5KHRoaXMuX29wYWNpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvbnRlbnRNZWFzdXJlID0gMDtcclxuICAgICAgICBsZXQgc2Nyb2xsVmlld01lYXN1cmUgPSAwO1xyXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5VmFsdWUgPSAwO1xyXG4gICAgICAgIGxldCBjb250ZW50UG9zaXRpb24gPSAwO1xyXG4gICAgICAgIGxldCBoYW5kbGVOb2RlTWVhc3VyZSA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5IT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnRNZWFzdXJlID0gY29udGVudFNpemUud2lkdGg7XHJcbiAgICAgICAgICAgIHNjcm9sbFZpZXdNZWFzdXJlID0gc2Nyb2xsVmlld1NpemUud2lkdGg7XHJcbiAgICAgICAgICAgIGhhbmRsZU5vZGVNZWFzdXJlID0gYmFyU2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeVZhbHVlID0gb3V0T2ZCb3VuZGFyeS54O1xyXG5cclxuICAgICAgICAgICAgY29udGVudFBvc2l0aW9uID0gLXRoaXMuX2NvbnZlcnRUb1Njcm9sbFZpZXdTcGFjZShjb250ZW50KS54O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVkVSVElDQUwpIHtcclxuICAgICAgICAgICAgY29udGVudE1lYXN1cmUgPSBjb250ZW50U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHNjcm9sbFZpZXdNZWFzdXJlID0gc2Nyb2xsVmlld1NpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICBoYW5kbGVOb2RlTWVhc3VyZSA9IGJhclNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5VmFsdWUgPSBvdXRPZkJvdW5kYXJ5Lnk7XHJcblxyXG4gICAgICAgICAgICBjb250ZW50UG9zaXRpb24gPSAtdGhpcy5fY29udmVydFRvU2Nyb2xsVmlld1NwYWNlKGNvbnRlbnQpLnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLl9jYWxjdWxhdGVMZW5ndGgoY29udGVudE1lYXN1cmUsIHNjcm9sbFZpZXdNZWFzdXJlLCBoYW5kbGVOb2RlTWVhc3VyZSwgb3V0T2ZCb3VuZGFyeVZhbHVlKTtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2NhbGN1bGF0ZVBvc2l0aW9uKGNvbnRlbnRNZWFzdXJlLCBzY3JvbGxWaWV3TWVhc3VyZSwgaGFuZGxlTm9kZU1lYXN1cmUsIGNvbnRlbnRQb3NpdGlvbiwgb3V0T2ZCb3VuZGFyeVZhbHVlLCBsZW5ndGgpO1xyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVMZW5ndGgobGVuZ3RoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVIYW5kbGVyUG9zaXRpb24ocG9zaXRpb24pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5rua5Yqo6KeG56qX6K6+572u44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNjcm9sbFZpZXcgLSDmu5rliqjop4bnqpfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFNjcm9sbFZpZXcgKHNjcm9sbFZpZXc6IFNjcm9sbFZpZXcpIHtcclxuICAgICAgICB0aGlzLl9zY3JvbGxWaWV3ID0gc2Nyb2xsVmlldztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Ub3VjaEJlZ2FuICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZUF1dG9IaWRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdG91Y2hpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblRvdWNoRW5kZWQgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlQXV0b0hpZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdG91Y2hpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9IaWRlVGltZSA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zY3JvbGxWaWV3KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLl9zY3JvbGxWaWV3LmNvbnRlbnQ7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50U2l6ZSA9IGNvbnRlbnQuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5jb250ZW50U2l6ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbFZpZXdTaXplID0gdGhpcy5fc2Nyb2xsVmlldy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY29uZGl0aW9uYWxEaXNhYmxlU2Nyb2xsQmFyKGNvbnRlbnRTaXplLCBzY3JvbGxWaWV3U2l6ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2F1dG9IaWRlUmVtYWluaW5nVGltZSA9IHRoaXMuX2F1dG9IaWRlVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25FbmFibGUgKCkge1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckNvbXAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgICAgaWYgKHJlbmRlckNvbXApIHtcclxuICAgICAgICAgICAgdGhpcy5fb3BhY2l0eSA9IHJlbmRlckNvbXAuY29sb3IuYTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXJ0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZW5hYmxlQXV0b0hpZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0T3BhY2l0eSgwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzQXV0b0hpZGUoZHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY29udmVydFRvU2Nyb2xsVmlld1NwYWNlIChjb250ZW50OiBOb2RlKSB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsVHJhbnMgPSB0aGlzLl9zY3JvbGxWaWV3ICYmIHRoaXMuX3Njcm9sbFZpZXcubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXA7XHJcbiAgICAgICAgY29uc3QgY29udGVudFRyYW5zID0gY29udGVudC5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXA7XHJcbiAgICAgICAgaWYgKCFzY3JvbGxUcmFucyB8fCAhY29udGVudFRyYW5zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBaRVJPO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfdGVtcFBvc18xLnNldCgtY29udGVudFRyYW5zLmFuY2hvclggKiBjb250ZW50VHJhbnMud2lkdGgsIC1jb250ZW50VHJhbnMuYW5jaG9yWSAqIGNvbnRlbnRUcmFucy5oZWlnaHQsIDApO1xyXG4gICAgICAgIGNvbnRlbnRUcmFucy5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoX3RlbXBQb3NfMSwgX3RlbXBQb3NfMik7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsVmlld1NwYWNlUG9zID0gc2Nyb2xsVHJhbnMuY29udmVydFRvTm9kZVNwYWNlQVIoX3RlbXBQb3NfMik7XHJcbiAgICAgICAgc2Nyb2xsVmlld1NwYWNlUG9zLnggKz0gc2Nyb2xsVHJhbnMuYW5jaG9yWCAqIHNjcm9sbFRyYW5zLndpZHRoO1xyXG4gICAgICAgIHNjcm9sbFZpZXdTcGFjZVBvcy55ICs9IHNjcm9sbFRyYW5zLmFuY2hvclkgKiBzY3JvbGxUcmFucy5oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIHNjcm9sbFZpZXdTcGFjZVBvcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NldE9wYWNpdHkgKG9wYWNpdHk6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGUpIHtcclxuICAgICAgICAgICAgbGV0IHJlbmRlckNvbXAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJDb21wKSB7XHJcbiAgICAgICAgICAgICAgICBfdGVtcENvbG9yLnNldChyZW5kZXJDb21wLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgIF90ZW1wQ29sb3IuYSA9IG9wYWNpdHk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJDb21wLmNvbG9yID0gX3RlbXBDb2xvcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVuZGVyQ29tcCA9IHRoaXMuX2hhbmRsZS5nZXRDb21wb25lbnQoU3ByaXRlKTtcclxuICAgICAgICAgICAgaWYgKHJlbmRlckNvbXApIHtcclxuICAgICAgICAgICAgICAgIF90ZW1wQ29sb3Iuc2V0KHJlbmRlckNvbXAuY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgX3RlbXBDb2xvci5hID0gb3BhY2l0eTtcclxuICAgICAgICAgICAgICAgIHJlbmRlckNvbXAuY29sb3IgPSBfdGVtcENvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlSGFuZGxlclBvc2l0aW9uIChwb3NpdGlvbjogVmVjMykge1xyXG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2xkUG9zaXRpb24gPSB0aGlzLl9maXh1cEhhbmRsZXJQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlLm5vZGUuc2V0UG9zaXRpb24ocG9zaXRpb24ueCArIG9sZFBvc2l0aW9uLngsIHBvc2l0aW9uLnkgKyBvbGRQb3NpdGlvbi55LCBvbGRQb3NpdGlvbi56KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9maXh1cEhhbmRsZXJQb3NpdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgdWlUcmFucyA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgIGNvbnN0IGJhclNpemUgPSB1aVRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IGJhckFuY2hvciA9IHVpVHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlU2l6ZSA9IHRoaXMuaGFuZGxlIS5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZVBhcmVudCA9IHRoaXMuaGFuZGxlIS5ub2RlLnBhcmVudCE7XHJcblxyXG4gICAgICAgIFZlYzMuc2V0KF90ZW1wUG9zXzEsIC1iYXJTaXplLndpZHRoICogYmFyQW5jaG9yLngsIC1iYXJTaXplLmhlaWdodCAqIGJhckFuY2hvci55LCAwKTtcclxuICAgICAgICBjb25zdCBsZWZ0Qm90dG9tV29ybGRQb3NpdGlvbiA9IHRoaXMubm9kZSEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoX3RlbXBQb3NfMSwgX3RlbXBQb3NfMik7XHJcbiAgICAgICAgbGV0IGZpeHVwUG9zaXRpb24gPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIGhhbmRsZVBhcmVudC5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLmNvbnZlcnRUb05vZGVTcGFjZUFSKGxlZnRCb3R0b21Xb3JsZFBvc2l0aW9uLCBmaXh1cFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICBmaXh1cFBvc2l0aW9uID0gbmV3IFZlYzMoZml4dXBQb3NpdGlvbi54LCBmaXh1cFBvc2l0aW9uLnkgKyAoYmFyU2l6ZS5oZWlnaHQgLSBoYW5kbGVTaXplLmhlaWdodCkgLyAyLCAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVkVSVElDQUwpIHtcclxuICAgICAgICAgICAgZml4dXBQb3NpdGlvbiA9IG5ldyBWZWMzKGZpeHVwUG9zaXRpb24ueCArIChiYXJTaXplLndpZHRoIC0gaGFuZGxlU2l6ZS53aWR0aCkgLyAyLCBmaXh1cFBvc2l0aW9uLnksIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGUhLm5vZGUuc2V0UG9zaXRpb24oZml4dXBQb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBmaXh1cFBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY29uZGl0aW9uYWxEaXNhYmxlU2Nyb2xsQmFyIChjb250ZW50U2l6ZTogU2l6ZSwgc2Nyb2xsVmlld1NpemU6IFNpemUpIHtcclxuICAgICAgICBpZiAoY29udGVudFNpemUud2lkdGggPD0gc2Nyb2xsVmlld1NpemUud2lkdGggJiYgdGhpcy5fZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250ZW50U2l6ZS5oZWlnaHQgPD0gc2Nyb2xsVmlld1NpemUuaGVpZ2h0ICYmIHRoaXMuX2RpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZFUlRJQ0FMKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYWxjdWxhdGVMZW5ndGggKGNvbnRlbnRNZWFzdXJlOiBudW1iZXIsIHNjcm9sbFZpZXdNZWFzdXJlOiBudW1iZXIsIGhhbmRsZU5vZGVNZWFzdXJlOiBudW1iZXIsIG91dE9mQm91bmRhcnk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBkZW5vbWluYXRvclZhbHVlID0gY29udGVudE1lYXN1cmU7XHJcbiAgICAgICAgaWYgKG91dE9mQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgZGVub21pbmF0b3JWYWx1ZSArPSAob3V0T2ZCb3VuZGFyeSA+IDAgPyBvdXRPZkJvdW5kYXJ5IDogLW91dE9mQm91bmRhcnkpICogR0VUVElOR19TSE9SVEVSX0ZBQ1RPUjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxlbmd0aFJhdGlvbiA9IHNjcm9sbFZpZXdNZWFzdXJlIC8gZGVub21pbmF0b3JWYWx1ZTtcclxuICAgICAgICByZXR1cm4gaGFuZGxlTm9kZU1lYXN1cmUgKiBsZW5ndGhSYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYWxjdWxhdGVQb3NpdGlvbiAoXHJcbiAgICAgICAgY29udGVudE1lYXN1cmU6IG51bWJlcixcclxuICAgICAgICBzY3JvbGxWaWV3TWVhc3VyZTogbnVtYmVyLFxyXG4gICAgICAgIGhhbmRsZU5vZGVNZWFzdXJlOiBudW1iZXIsXHJcbiAgICAgICAgY29udGVudFBvc2l0aW9uOiBudW1iZXIsXHJcbiAgICAgICAgb3V0T2ZCb3VuZGFyeTogbnVtYmVyLFxyXG4gICAgICAgIGFjdHVhbExlbnRoOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBsZXQgZGVub21pbmF0b3JWYWx1ZSA9IGNvbnRlbnRNZWFzdXJlIC0gc2Nyb2xsVmlld01lYXN1cmU7XHJcbiAgICAgICAgaWYgKG91dE9mQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgZGVub21pbmF0b3JWYWx1ZSArPSBNYXRoLmFicyhvdXRPZkJvdW5kYXJ5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwb3NpdGlvblJhdGlvID0gMDtcclxuICAgICAgICBpZiAoZGVub21pbmF0b3JWYWx1ZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvblJhdGlvID0gY29udGVudFBvc2l0aW9uIC8gZGVub21pbmF0b3JWYWx1ZTtcclxuICAgICAgICAgICAgcG9zaXRpb25SYXRpbyA9IGNsYW1wMDEocG9zaXRpb25SYXRpbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IChoYW5kbGVOb2RlTWVhc3VyZSAtIGFjdHVhbExlbnRoKSAqIHBvc2l0aW9uUmF0aW87XHJcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZFUlRJQ0FMKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMygwLCBwb3NpdGlvbiwgMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHBvc2l0aW9uLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVMZW5ndGggKGxlbmd0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZSkge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVOb2RlID0gdGhpcy5faGFuZGxlLm5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZVRyYW5zID0gaGFuZGxlTm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVOb2RlU2l6ZSA9IGhhbmRsZVRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBhbmNob3IgPSBoYW5kbGVUcmFucy5hbmNob3JQb2ludDtcclxuICAgICAgICAgICAgaWYgKGFuY2hvci54ICE9PSBkZWZhdWx0QW5jaG9yLnggfHwgYW5jaG9yLnkgIT09IGRlZmF1bHRBbmNob3IueSl7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVUcmFucy5zZXRBbmNob3JQb2ludChkZWZhdWx0QW5jaG9yKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVRyYW5zLnNldENvbnRlbnRTaXplKGxlbmd0aCwgaGFuZGxlTm9kZVNpemUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVRyYW5zLnNldENvbnRlbnRTaXplKGhhbmRsZU5vZGVTaXplLndpZHRoLCBsZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcHJvY2Vzc0F1dG9IaWRlIChkZWx0YVRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlQXV0b0hpZGUgfHwgdGhpcy5fYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdG91Y2hpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYXV0b0hpZGVSZW1haW5pbmdUaW1lIC09IGRlbHRhVGltZTtcclxuICAgICAgICBpZiAodGhpcy5fYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IHRoaXMuX2F1dG9IaWRlVGltZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSBNYXRoLm1heCgwLCB0aGlzLl9hdXRvSGlkZVJlbWFpbmluZ1RpbWUpO1xyXG4gICAgICAgICAgICBjb25zdCBvcGFjaXR5ID0gdGhpcy5fb3BhY2l0eSAqICh0aGlzLl9hdXRvSGlkZVJlbWFpbmluZ1RpbWUgLyB0aGlzLl9hdXRvSGlkZVRpbWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRPcGFjaXR5KG9wYWNpdHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=