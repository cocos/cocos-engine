(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/index.js", "../../core/components/ui-base/ui-transform.js", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/platform/debug.js", "../../core/platform/event-manager/event-enum.js", "../../core/platform/view.js", "../../core/platform/visible-rect.js", "../../core/scene-graph/index.js", "../../core/scene-graph/node.js", "../../core/value-types/enum.js", "../../core/scene-graph/node-enum.js", "../../core/default-constants.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/index.js"), require("../../core/components/ui-base/ui-transform.js"), require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/platform/debug.js"), require("../../core/platform/event-manager/event-enum.js"), require("../../core/platform/view.js"), require("../../core/platform/visible-rect.js"), require("../../core/scene-graph/index.js"), require("../../core/scene-graph/node.js"), require("../../core/value-types/enum.js"), require("../../core/scene-graph/node-enum.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.uiTransform, global.index, global.index, global.debug, global.eventEnum, global.view, global.visibleRect, global.index, global.node, global._enum, global.nodeEnum, global.defaultConstants, global.globalExports);
    global.widget = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _uiTransform, _index2, _index3, _debug, _eventEnum, _view, _visibleRect, _index4, _node, _enum, _nodeEnum, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getReadonlyNodeSize = getReadonlyNodeSize;
  _exports.computeInverseTransForTarget = computeInverseTransForTarget;
  _exports.Widget = _exports.AlignFlags = _exports.AlignMode = void 0;
  _visibleRect = _interopRequireDefault(_visibleRect);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _class3, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var _zeroVec3 = new _index3.Vec3(); // returns a readonly size of the node


  function getReadonlyNodeSize(parent) {
    if (parent instanceof _index4.Scene) {
      // @ts-ignore
      if (_defaultConstants.EDITOR) {
        // const canvasComp = parent.getComponentInChildren(Canvas);
        if (!_view.View.instance) {
          throw new Error('cc.view uninitiated');
        }

        return _view.View.instance.getDesignResolutionSize();
      }

      return _visibleRect.default;
    } else if (parent._uiProps.uiTransformComp) {
      return parent._uiProps.uiTransformComp.contentSize;
    } else {
      return _index3.Size.ZERO;
    }
  }

  function computeInverseTransForTarget(widgetNode, target, out_inverseTranslate, out_inverseScale) {
    var scale = widgetNode.parent ? widgetNode.parent.getScale() : _zeroVec3;
    var scaleX = scale.x;
    var scaleY = scale.y;
    var translateX = 0;
    var translateY = 0;

    for (var node = widgetNode.parent;;) {
      if (!node) {
        // ERROR: widgetNode should be child of target
        out_inverseTranslate.x = out_inverseTranslate.y = 0;
        out_inverseScale.x = out_inverseScale.y = 1;
        return;
      }

      var pos = node.getPosition();
      translateX += pos.x;
      translateY += pos.y;
      node = node.parent; // loop increment

      if (node !== target) {
        scale = node ? node.getScale() : _zeroVec3;
        var sx = scale.x;
        var sy = scale.y;
        translateX *= sx;
        translateY *= sy;
        scaleX *= sx;
        scaleY *= sy;
      } else {
        break;
      }
    }

    out_inverseScale.x = scaleX !== 0 ? 1 / scaleX : 1;
    out_inverseScale.y = scaleY !== 0 ? 1 / scaleY : 1;
    out_inverseTranslate.x = -translateX;
    out_inverseTranslate.y = -translateY;
  }
  /**
   * @en Enum for Widget's alignment mode, indicating when the widget should refresh.
   *
   * @zh Widget 的对齐模式，表示 Widget 应该何时刷新。
   */


  var AlignMode;
  _exports.AlignMode = AlignMode;

  (function (AlignMode) {
    AlignMode[AlignMode["ONCE"] = 0] = "ONCE";
    AlignMode[AlignMode["ALWAYS"] = 1] = "ALWAYS";
    AlignMode[AlignMode["ON_WINDOW_RESIZE"] = 2] = "ON_WINDOW_RESIZE";
  })(AlignMode || (_exports.AlignMode = AlignMode = {}));

  (0, _enum.ccenum)(AlignMode);
  /**
   * @en Enum for Widget's alignment flag, indicating when the widget select alignment.
   *
   * @zh Widget 的对齐标志，表示 Widget 选择对齐状态。
   */

  var AlignFlags;
  _exports.AlignFlags = AlignFlags;

  (function (AlignFlags) {
    AlignFlags[AlignFlags["TOP"] = 1] = "TOP";
    AlignFlags[AlignFlags["MID"] = 2] = "MID";
    AlignFlags[AlignFlags["BOT"] = 4] = "BOT";
    AlignFlags[AlignFlags["LEFT"] = 8] = "LEFT";
    AlignFlags[AlignFlags["CENTER"] = 16] = "CENTER";
    AlignFlags[AlignFlags["RIGHT"] = 32] = "RIGHT";
    AlignFlags[AlignFlags["HORIZONTAL"] = 56] = "HORIZONTAL";
    AlignFlags[AlignFlags["VERTICAL"] = 7] = "VERTICAL";
  })(AlignFlags || (_exports.AlignFlags = AlignFlags = {}));

  var TOP_BOT = AlignFlags.TOP | AlignFlags.BOT;
  var LEFT_RIGHT = AlignFlags.LEFT | AlignFlags.RIGHT;
  /**
   * @en
   * Stores and manipulate the anchoring based on its parent.
   * Widget are used for GUI but can also be used for other things.
   * Widget will adjust current node's position and size automatically,
   * but the results after adjustment can not be obtained until the next frame unless you call [[updateAlignment]] manually.
   *
   * @zh Widget 组件，用于设置和适配其相对于父节点的边距，Widget 通常被用于 UI 界面，也可以用于其他地方。<br/>
   * Widget 会自动调整当前节点的坐标和宽高，不过目前调整后的结果要到下一帧才能在脚本里获取到，除非你先手动调用 [[updateAlignment]]。
   */

  var Widget = (_dec = (0, _index2.ccclass)('cc.Widget'), _dec2 = (0, _index2.help)('i18n:cc.Widget'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/Widget'), _dec5 = (0, _index2.requireComponent)(_uiTransform.UITransform), _dec6 = (0, _index2.type)(_node.Node), _dec7 = (0, _index2.tooltip)('对齐目标'), _dec8 = (0, _index2.tooltip)('是否对齐上边'), _dec9 = (0, _index2.tooltip)('是否对齐下边'), _dec10 = (0, _index2.tooltip)('是否对齐左边'), _dec11 = (0, _index2.tooltip)('是否对齐右边'), _dec12 = (0, _index2.tooltip)('是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消'), _dec13 = (0, _index2.tooltip)('是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消'), _dec14 = (0, _index2.type)(AlignMode), _dec15 = (0, _index2.tooltip)('指定 widget 的对齐方式，用于决定运行时 widget 应何时更新'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (0, _index2.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(Widget, _Component);

    function Widget() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Widget);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Widget)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._lastPos = new _index3.Vec3();
      _this._lastSize = new _index3.Size();
      _this._dirty = true;

      _initializerDefineProperty(_this, "_alignFlags", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_target", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_left", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_right", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_top", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_bottom", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_horizontalCenter", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_verticalCenter", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isAbsLeft", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isAbsRight", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isAbsTop", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isAbsBottom", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isAbsHorizontalCenter", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isAbsVerticalCenter", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_originalWidth", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_originalHeight", _descriptor16, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_alignMode", _descriptor17, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_lockFlags", _descriptor18, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(Widget, [{
      key: "updateAlignment",

      /**
       * @en
       * Immediately perform the widget alignment. You need to manually call this method only if
       * you need to get the latest results after the alignment before the end of current frame.
       *
       * @zh
       * 立刻执行 widget 对齐操作。这个接口一般不需要手工调用。
       * 只有当你需要在当前帧结束前获得 widget 对齐后的最新结果时才需要手动调用这个方法。
       *
       * @example
       * ```ts
       * import { log } from 'cc';
       * widget.top = 10;       // change top margin
       * log(widget.node.y); // not yet changed
       * widget.updateAlignment();
       * log(widget.node.y); // changed
       * ```
       */
      value: function updateAlignment() {
        _globalExports.legacyCC._widgetManager.updateAlignment(this.node);
      }
    }, {
      key: "_validateTargetInDEV",
      value: function _validateTargetInDEV() {
        if (!_defaultConstants.DEV) {
          return;
        }

        var target = this._target;

        if (target) {
          var isParent = this.node !== target && this.node.isChildOf(target);

          if (!isParent) {
            (0, _debug.errorID)(6500);
            this.target = null;
          }
        }
      }
    }, {
      key: "setDirty",
      value: function setDirty() {
        this._recursiveDirty();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this.node.getPosition(this._lastPos);

        this._lastSize.set(this.node._uiProps.uiTransformComp.contentSize);

        _globalExports.legacyCC._widgetManager.add(this);

        this._registerEvent();

        this._registerTargetEvents();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _globalExports.legacyCC._widgetManager.remove(this);

        this._unregisterEvent();

        this._unregisterTargetEvents();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._removeParentEvent();
      }
    }, {
      key: "_adjustWidgetToAllowMovingInEditor",
      value: function _adjustWidgetToAllowMovingInEditor(eventType) {
        if (
        /*!EDITOR ||*/
        !(eventType & _nodeEnum.TransformBit.POSITION)) {
          return;
        }

        if (_globalExports.legacyCC._widgetManager.isAligning) {
          return;
        }

        var self = this;
        var newPos = self.node.getPosition();
        var oldPos = this._lastPos;
        var delta = new _index3.Vec3(newPos);
        delta.subtract(oldPos);
        var target = self.node.parent;
        var inverseScale = new _index3.Vec3(1, 1, 1);

        if (self.target) {
          target = self.target;
          computeInverseTransForTarget(self.node, target, new _index3.Vec3(), inverseScale);
        }

        if (!target) {
          return;
        }

        var targetSize = getReadonlyNodeSize(target);
        var deltaInPercent = new _index3.Vec3();

        if (targetSize.width !== 0 && targetSize.height !== 0) {
          _index3.Vec3.set(deltaInPercent, delta.x / targetSize.width, delta.y / targetSize.height, deltaInPercent.z);
        }

        if (self.isAlignTop) {
          self._top -= (self._isAbsTop ? delta.y : deltaInPercent.y) * inverseScale.y;
        }

        if (self.isAlignBottom) {
          self._bottom += (self._isAbsBottom ? delta.y : deltaInPercent.y) * inverseScale.y;
        }

        if (self.isAlignLeft) {
          self._left += (self._isAbsLeft ? delta.x : deltaInPercent.x) * inverseScale.x;
        }

        if (self.isAlignRight) {
          self._right -= (self._isAbsRight ? delta.x : deltaInPercent.x) * inverseScale.x;
        }

        if (self.isAlignHorizontalCenter) {
          self._horizontalCenter += (self._isAbsHorizontalCenter ? delta.x : deltaInPercent.x) * inverseScale.x;
        }

        if (self.isAlignVerticalCenter) {
          self._verticalCenter += (self._isAbsVerticalCenter ? delta.y : deltaInPercent.y) * inverseScale.y;
        }

        this._recursiveDirty();
      }
    }, {
      key: "_adjustWidgetToAllowResizingInEditor",
      value: function _adjustWidgetToAllowResizingInEditor() {
        // if (!EDITOR) {
        //     return;
        // }
        if (_globalExports.legacyCC._widgetManager.isAligning) {
          return;
        }

        this.setDirty();
        var self = this;
        var trans = self.node._uiProps.uiTransformComp;
        var newSize = trans.contentSize;
        var oldSize = this._lastSize;
        var delta = new _index3.Vec3(newSize.width - oldSize.width, newSize.height - oldSize.height, 0);
        var target = self.node.parent;
        var inverseScale = new _index3.Vec3(1, 1, 1);

        if (self.target) {
          target = self.target;
          computeInverseTransForTarget(self.node, target, new _index3.Vec3(), inverseScale);
        }

        if (!target) {
          return;
        }

        var targetSize = getReadonlyNodeSize(target);
        var deltaInPercent = new _index3.Vec3();

        if (targetSize.width !== 0 && targetSize.height !== 0) {
          _index3.Vec3.set(deltaInPercent, delta.x / targetSize.width, delta.y / targetSize.height, deltaInPercent.z);
        }

        var anchor = trans.anchorPoint;

        if (self.isAlignTop) {
          self._top -= (self._isAbsTop ? delta.y : deltaInPercent.y) * (1 - anchor.y) * inverseScale.y;
        }

        if (self.isAlignBottom) {
          self._bottom -= (self._isAbsBottom ? delta.y : deltaInPercent.y) * anchor.y * inverseScale.y;
        }

        if (self.isAlignLeft) {
          self._left -= (self._isAbsLeft ? delta.x : deltaInPercent.x) * anchor.x * inverseScale.x;
        }

        if (self.isAlignRight) {
          self._right -= (self._isAbsRight ? delta.x : deltaInPercent.x) * (1 - anchor.x) * inverseScale.x;
        }

        this._recursiveDirty();
      }
    }, {
      key: "_adjustWidgetToAnchorChanged",
      value: function _adjustWidgetToAnchorChanged() {
        this.setDirty();
      }
    }, {
      key: "_adjustTargetToParentChanged",
      value: function _adjustTargetToParentChanged(oldParent) {
        if (oldParent) {
          this._unregisterOldParentEvents(oldParent);
        }

        if (this.node.getParent()) {
          this._registerTargetEvents();
        }
      }
    }, {
      key: "_registerEvent",
      value: function _registerEvent() {
        this.node.on(_eventEnum.SystemEventType.TRANSFORM_CHANGED, this._adjustWidgetToAllowMovingInEditor, this);
        this.node.on(_eventEnum.SystemEventType.SIZE_CHANGED, this._adjustWidgetToAllowResizingInEditor, this);
        this.node.on(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._adjustWidgetToAnchorChanged, this);
        this.node.on(_eventEnum.SystemEventType.PARENT_CHANGED, this._adjustTargetToParentChanged, this);
      }
    }, {
      key: "_unregisterEvent",
      value: function _unregisterEvent() {
        this.node.off(_eventEnum.SystemEventType.TRANSFORM_CHANGED, this._adjustWidgetToAllowMovingInEditor, this);
        this.node.off(_eventEnum.SystemEventType.SIZE_CHANGED, this._adjustWidgetToAllowResizingInEditor, this);
        this.node.off(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._adjustWidgetToAnchorChanged, this);
      }
    }, {
      key: "_removeParentEvent",
      value: function _removeParentEvent() {
        this.node.off(_eventEnum.SystemEventType.PARENT_CHANGED, this._adjustTargetToParentChanged, this);
      }
    }, {
      key: "_autoChangedValue",
      value: function _autoChangedValue(flag, isAbs) {
        var current = (this._alignFlags & flag) > 0;
        var parentTrans = this.node.parent && this.node.parent._uiProps.uiTransformComp;

        if (!current || !parentTrans) {
          return;
        }

        var size = parentTrans.contentSize;

        if (this.isAlignLeft && flag === AlignFlags.LEFT) {
          this._left = isAbs ? this._left * size.width : this._left / size.width;
        } else if (this.isAlignRight && flag === AlignFlags.RIGHT) {
          this._right = isAbs ? this._right * size.width : this._right / size.width;
        } else if (this.isAlignHorizontalCenter && flag === AlignFlags.CENTER) {
          this._horizontalCenter = isAbs ? this._horizontalCenter * size.width : this._horizontalCenter / size.width;
        } else if (this.isAlignTop && flag === AlignFlags.TOP) {
          this._top = isAbs ? this._top * size.height : this._top / size.height;
        } else if (this.isAlignBottom && flag === AlignFlags.BOT) {
          this._bottom = isAbs ? this._bottom * size.height : this._bottom / size.height;
        } else if (this.isAbsoluteVerticalCenter && flag === AlignFlags.MID) {
          this._verticalCenter = isAbs ? this._verticalCenter / size.height : this._verticalCenter / size.height;
        }

        this._recursiveDirty();
      }
    }, {
      key: "_registerTargetEvents",
      value: function _registerTargetEvents() {
        var target = this._target || this.node.parent;

        if (target) {
          if (target.getComponent(_uiTransform.UITransform)) {
            target.on(_eventEnum.SystemEventType.TRANSFORM_CHANGED, this._targetChangedOperation, this);
            target.on(_eventEnum.SystemEventType.SIZE_CHANGED, this._targetChangedOperation, this);
          } else {
            (0, _debug.warnID)(6501, this.node.name);
          }
        }
      }
    }, {
      key: "_unregisterTargetEvents",
      value: function _unregisterTargetEvents() {
        var target = this._target || this.node.parent;

        if (target) {
          target.off(_eventEnum.SystemEventType.TRANSFORM_CHANGED, this._targetChangedOperation, this);
          target.off(_eventEnum.SystemEventType.SIZE_CHANGED, this._targetChangedOperation, this);
        }
      }
    }, {
      key: "_unregisterOldParentEvents",
      value: function _unregisterOldParentEvents(oldParent) {
        var target = this._target || oldParent;

        if (target) {
          target.off(_eventEnum.SystemEventType.TRANSFORM_CHANGED, this._targetChangedOperation, this);
          target.off(_eventEnum.SystemEventType.SIZE_CHANGED, this._targetChangedOperation, this);
        }
      }
    }, {
      key: "_targetChangedOperation",
      value: function _targetChangedOperation() {
        this._recursiveDirty();
      }
    }, {
      key: "_setAlign",
      value: function _setAlign(flag, isAlign) {
        var current = (this._alignFlags & flag) > 0;

        if (isAlign === current) {
          return;
        }

        var isHorizontal = (flag & LEFT_RIGHT) > 0;
        var trans = this.node._uiProps.uiTransformComp;

        if (isAlign) {
          this._alignFlags |= flag;

          if (isHorizontal) {
            this.isAlignHorizontalCenter = false;

            if (this.isStretchWidth) {
              // become stretch
              this._originalWidth = trans.width; // test check conflict

              if (_defaultConstants.EDITOR
              /*&& !cc.engine.isPlaying*/
              ) {// TODO:
                  // _Scene.DetectConflict.checkConflict_Widget(this);
                }
            }
          } else {
            this.isAlignVerticalCenter = false;

            if (this.isStretchHeight) {
              // become stretch
              this._originalHeight = trans.height; // test check conflict

              if (_defaultConstants.EDITOR
              /*&& !cc.engine.isPlaying*/
              ) {// TODO:
                  // _Scene.DetectConflict.checkConflict_Widget(this);
                }
            }
          }

          if (_defaultConstants.EDITOR && this.node.parent) {
            // adjust the offsets to keep the size and position unchanged after alignment changed
            _globalExports.legacyCC._widgetManager.updateOffsetsToStayPut(this, flag);
          }
        } else {
          if (isHorizontal) {
            if (this.isStretchWidth) {
              // will cancel stretch
              trans.width = this._originalWidth;
            }
          } else {
            if (this.isStretchHeight) {
              // will cancel stretch
              trans.height = this._originalHeight;
            }
          }

          this._alignFlags &= ~flag;
        }
      }
    }, {
      key: "_recursiveDirty",
      value: function _recursiveDirty() {
        if (this._dirty) {
          return;
        }

        this._dirty = true;
      }
    }, {
      key: "target",

      /**
       * @en
       * Specifies an alignment target that can only be one of the parent nodes of the current node.
       * The default value is null, and when null, indicates the current parent.
       *
       * @zh
       * 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。
       */
      get: function get() {
        return this._target;
      },
      set: function set(value) {
        if (this._target === value) {
          return;
        }

        this._unregisterTargetEvents();

        this._target = value;

        this._registerTargetEvents();

        if (_defaultConstants.EDITOR
        /*&& !cc.engine._isPlaying*/
        && this.node.parent) {
          // adjust the offsets to keep the size and position unchanged after target changed
          _globalExports.legacyCC._widgetManager.updateOffsetsToStayPut(this);
        }

        this._validateTargetInDEV();

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to align to the top.
       *
       * @zh
       * 是否对齐上边。
       */

    }, {
      key: "isAlignTop",
      get: function get() {
        return (this._alignFlags & AlignFlags.TOP) > 0;
      },
      set: function set(value) {
        this._setAlign(AlignFlags.TOP, value);

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to align to the bottom.
       *
       * @zh
       * 是否对齐下边。
       */

    }, {
      key: "isAlignBottom",
      get: function get() {
        return (this._alignFlags & AlignFlags.BOT) > 0;
      },
      set: function set(value) {
        this._setAlign(AlignFlags.BOT, value);

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to align to the left.
       *
       * @zh
       * 是否对齐左边。
       */

    }, {
      key: "isAlignLeft",
      get: function get() {
        return (this._alignFlags & AlignFlags.LEFT) > 0;
      },
      set: function set(value) {
        this._setAlign(AlignFlags.LEFT, value);

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to align to the right.
       *
       * @zh
       * 是否对齐右边。
       */

    }, {
      key: "isAlignRight",
      get: function get() {
        return (this._alignFlags & AlignFlags.RIGHT) > 0;
      },
      set: function set(value) {
        this._setAlign(AlignFlags.RIGHT, value);

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to align vertically.
       *
       * @zh
       * 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。
       */

    }, {
      key: "isAlignVerticalCenter",
      get: function get() {
        return (this._alignFlags & AlignFlags.MID) > 0;
      },
      set: function set(value) {
        if (value) {
          this.isAlignTop = false;
          this.isAlignBottom = false;
          this._alignFlags |= AlignFlags.MID;
        } else {
          this._alignFlags &= ~AlignFlags.MID;
        }

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to align horizontally.
       *
       * @zh
       * 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。
       */

    }, {
      key: "isAlignHorizontalCenter",
      get: function get() {
        return (this._alignFlags & AlignFlags.CENTER) > 0;
      },
      set: function set(value) {
        if (value) {
          this.isAlignLeft = false;
          this.isAlignRight = false;
          this._alignFlags |= AlignFlags.CENTER;
        } else {
          this._alignFlags &= ~AlignFlags.CENTER;
        }

        this._recursiveDirty();
      }
      /**
       * @en
       * Whether to stretch horizontally, when enable the left and right alignment will be stretched horizontally,
       * the width setting is invalid (read only).
       *
       * @zh
       * 当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸。此时节点的宽度（只读）。
       */

    }, {
      key: "isStretchWidth",
      get: function get() {
        return (this._alignFlags & LEFT_RIGHT) === LEFT_RIGHT;
      }
      /**
       * @en
       * Whether to stretch vertically, when enable the left and right alignment will be stretched vertically,
       * then height setting is invalid (read only).
       *
       * @zh
       * 当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度（只读）。
       */

    }, {
      key: "isStretchHeight",
      get: function get() {
        return (this._alignFlags & TOP_BOT) === TOP_BOT;
      } // ALIGN MARGINS

      /**
       * @en
       * The margins between the top of this node and the top of parent node,
       * the value can be negative, Only available in 'isAlignTop' open.
       *
       * @zh
       * 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。
       */

    }, {
      key: "top",
      get: function get() {
        return this._top;
      },
      set: function set(value) {
        this._top = value;

        this._recursiveDirty();
      }
      /**
       * @EditorOnly Not for user
       */

    }, {
      key: "editorTop",
      get: function get() {
        return this._isAbsTop ? this._top : this._top * 100;
      },
      set: function set(value) {
        this._top = this._isAbsTop ? value : value / 100;

        this._recursiveDirty();
      }
      /**
       * @en
       * The margins between the bottom of this node and the bottom of parent node,
       * the value can be negative, Only available in 'isAlignBottom' open.
       *
       * @zh
       * 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。
       */

    }, {
      key: "bottom",
      get: function get() {
        return this._bottom;
      },
      set: function set(value) {
        this._bottom = value;

        this._recursiveDirty();
      }
      /**
       * @EditorOnly Not for user
       */

    }, {
      key: "editorBottom",
      get: function get() {
        return this._isAbsBottom ? this._bottom : this._bottom * 100;
      },
      set: function set(value) {
        this._bottom = this._isAbsBottom ? value : value / 100;

        this._recursiveDirty();
      }
      /**
       * @en
       * The margins between the left of this node and the left of parent node,
       * the value can be negative, Only available in 'isAlignLeft' open.
       *
       * @zh
       * 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。
       */

    }, {
      key: "left",
      get: function get() {
        return this._left;
      },
      set: function set(value) {
        this._left = value;

        this._recursiveDirty();
      }
      /**
       * @EditorOnly Not for user
       */

    }, {
      key: "editorLeft",
      get: function get() {
        return this._isAbsLeft ? this._left : this._left * 100;
      },
      set: function set(value) {
        this._left = this._isAbsLeft ? value : value / 100;

        this._recursiveDirty();
      }
      /**
       * @en
       * The margins between the right of this node and the right of parent node,
       * the value can be negative, Only available in 'isAlignRight' open.
       *
       * @zh
       * 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。
       */

    }, {
      key: "right",
      get: function get() {
        return this._right;
      },
      set: function set(value) {
        this._right = value;

        this._recursiveDirty();
      }
      /**
       * @EditorOnly Not for user
       */

    }, {
      key: "editorRight",
      get: function get() {
        return this._isAbsRight ? this._right : this._right * 100;
      },
      set: function set(value) {
        this._right = this._isAbsRight ? value : value / 100;

        this._recursiveDirty();
      }
      /**
       * @en
       * Horizontally aligns the midpoint offset value,
       * the value can be negative, Only available in 'isAlignHorizontalCenter' open.
       *
       * @zh
       * 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。
       */

    }, {
      key: "horizontalCenter",
      get: function get() {
        return this._horizontalCenter;
      },
      set: function set(value) {
        this._horizontalCenter = value;

        this._recursiveDirty();
      }
      /**
       * @EditorOnly Not for user
       */

    }, {
      key: "editorHorizontalCenter",
      get: function get() {
        return this._isAbsHorizontalCenter ? this._horizontalCenter : this._horizontalCenter * 100;
      },
      set: function set(value) {
        this._horizontalCenter = this._isAbsHorizontalCenter ? value : value / 100;

        this._recursiveDirty();
      }
      /**
       * @en
       * Vertically aligns the midpoint offset value,
       * the value can be negative, Only available in 'isAlignVerticalCenter' open.
       *
       * @zh
       * 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。
       */

    }, {
      key: "verticalCenter",
      get: function get() {
        return this._verticalCenter;
      },
      set: function set(value) {
        this._verticalCenter = value;

        this._recursiveDirty();
      }
      /**
       * @EditorOnly Not for user
       */

    }, {
      key: "editorVerticalCenter",
      get: function get() {
        return this._isAbsVerticalCenter ? this._verticalCenter : this._verticalCenter * 100;
      },
      set: function set(value) {
        this._verticalCenter = this._isAbsVerticalCenter ? value : value / 100;

        this._recursiveDirty();
      }
      /**
       * @en
       * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
       *
       * @zh
       * 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的比例（0 到 1）作为边距。
       */

    }, {
      key: "isAbsoluteTop",
      get: function get() {
        return this._isAbsTop;
      },
      set: function set(value) {
        if (this._isAbsTop === value) {
          return;
        }

        this._isAbsTop = value;

        this._autoChangedValue(AlignFlags.TOP, this._isAbsTop);
      }
      /**
       * @en
       * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
       *
       * @zh
       * 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的比例（0 到 1）作为边距。
       */

    }, {
      key: "isAbsoluteBottom",
      get: function get() {
        return this._isAbsBottom;
      },
      set: function set(value) {
        if (this._isAbsBottom === value) {
          return;
        }

        this._isAbsBottom = value;

        this._autoChangedValue(AlignFlags.BOT, this._isAbsBottom);
      }
      /**
       * @en
       * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
       *
       * @zh
       * 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的比例（0 到 1）作为边距。
       */

    }, {
      key: "isAbsoluteLeft",
      get: function get() {
        return this._isAbsLeft;
      },
      set: function set(value) {
        if (this._isAbsLeft === value) {
          return;
        }

        this._isAbsLeft = value;

        this._autoChangedValue(AlignFlags.LEFT, this._isAbsLeft);
      }
      /**
       * @en
       * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
       *
       * @zh
       * 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的比例（0 到 1）作为边距。
       */

    }, {
      key: "isAbsoluteRight",
      get: function get() {
        return this._isAbsRight;
      },
      set: function set(value) {
        if (this._isAbsRight === value) {
          return;
        }

        this._isAbsRight = value;

        this._autoChangedValue(AlignFlags.RIGHT, this._isAbsRight);
      }
      /**
       * @en
       * If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
       *
       * @zh
       * 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为比例（0 到 1）。
       */

    }, {
      key: "isAbsoluteHorizontalCenter",
      get: function get() {
        return this._isAbsHorizontalCenter;
      },
      set: function set(value) {
        if (this._isAbsHorizontalCenter === value) {
          return;
        }

        this._isAbsHorizontalCenter = value;

        this._autoChangedValue(AlignFlags.CENTER, this._isAbsHorizontalCenter);
      }
      /**
       * @en
       * If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
       *
       * @zh
       * 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为比例（0 到 1）。
       */

    }, {
      key: "isAbsoluteVerticalCenter",
      get: function get() {
        return this._isAbsVerticalCenter;
      },
      set: function set(value) {
        if (this._isAbsVerticalCenter === value) {
          return;
        }

        this._isAbsVerticalCenter = value;

        this._autoChangedValue(AlignFlags.MID, this._isAbsVerticalCenter);
      }
      /**
       * @en
       * Specifies the alignment mode of the Widget, which determines when the widget should refresh.
       *
       * @zh
       * 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。
       *
       * @example
       * ```
       * import { Widget } from 'cc';
       * widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
       * ```
       */

    }, {
      key: "alignMode",
      get: function get() {
        return this._alignMode;
      },
      set: function set(value) {
        this._alignMode = value;

        this._recursiveDirty();
      }
      /**
       * @zh
       * 对齐开关，由 AlignFlags 组成
       */

    }, {
      key: "alignFlags",
      get: function get() {
        return this._alignFlags;
      },
      set: function set(value) {
        if (this._alignFlags === value) {
          return;
        }

        this._alignFlags = value;

        this._recursiveDirty();
      }
    }]);

    return Widget;
  }(_index.Component), _class3.AlignMode = AlignMode, _temp), (_applyDecoratedDescriptor(_class2.prototype, "target", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "target"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAlignTop", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "isAlignTop"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAlignBottom", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "isAlignBottom"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAlignLeft", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "isAlignLeft"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAlignRight", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "isAlignRight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAlignVerticalCenter", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "isAlignVerticalCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAlignHorizontalCenter", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "isAlignHorizontalCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "editorTop", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorTop"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "editorBottom", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorBottom"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "editorLeft", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorLeft"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "editorRight", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorRight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "editorHorizontalCenter", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorHorizontalCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "editorVerticalCenter", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorVerticalCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAbsoluteTop", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "isAbsoluteTop"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAbsoluteBottom", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "isAbsoluteBottom"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAbsoluteLeft", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "isAbsoluteLeft"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAbsoluteRight", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "isAbsoluteRight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAbsoluteHorizontalCenter", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "isAbsoluteHorizontalCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAbsoluteVerticalCenter", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "isAbsoluteVerticalCenter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "alignMode", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "alignMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "alignFlags", [_index2.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "alignFlags"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_alignFlags", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_target", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_left", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_right", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_top", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_bottom", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_horizontalCenter", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_verticalCenter", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_isAbsLeft", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_isAbsRight", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_isAbsTop", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_isAbsBottom", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_isAbsHorizontalCenter", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_isAbsVerticalCenter", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_originalWidth", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "_originalHeight", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "_alignMode", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return AlignMode.ON_WINDOW_RESIZE;
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "_lockFlags", [_index2.serializable, _index2.editorOnly], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.Widget = Widget;
  // cc.Widget = module.exports = Widget;
  _globalExports.legacyCC.internal.computeInverseTransForTarget = computeInverseTransForTarget;
  _globalExports.legacyCC.internal.getReadonlyNodeSize = getReadonlyNodeSize;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvd2lkZ2V0LnRzIl0sIm5hbWVzIjpbIl96ZXJvVmVjMyIsIlZlYzMiLCJnZXRSZWFkb25seU5vZGVTaXplIiwicGFyZW50IiwiU2NlbmUiLCJFRElUT1IiLCJWaWV3IiwiaW5zdGFuY2UiLCJFcnJvciIsImdldERlc2lnblJlc29sdXRpb25TaXplIiwidmlzaWJsZVJlY3QiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsImNvbnRlbnRTaXplIiwiU2l6ZSIsIlpFUk8iLCJjb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0Iiwid2lkZ2V0Tm9kZSIsInRhcmdldCIsIm91dF9pbnZlcnNlVHJhbnNsYXRlIiwib3V0X2ludmVyc2VTY2FsZSIsInNjYWxlIiwiZ2V0U2NhbGUiLCJzY2FsZVgiLCJ4Iiwic2NhbGVZIiwieSIsInRyYW5zbGF0ZVgiLCJ0cmFuc2xhdGVZIiwibm9kZSIsInBvcyIsImdldFBvc2l0aW9uIiwic3giLCJzeSIsIkFsaWduTW9kZSIsIkFsaWduRmxhZ3MiLCJUT1BfQk9UIiwiVE9QIiwiQk9UIiwiTEVGVF9SSUdIVCIsIkxFRlQiLCJSSUdIVCIsIldpZGdldCIsIlVJVHJhbnNmb3JtIiwiTm9kZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2xhc3RQb3MiLCJfbGFzdFNpemUiLCJfZGlydHkiLCJsZWdhY3lDQyIsIl93aWRnZXRNYW5hZ2VyIiwidXBkYXRlQWxpZ25tZW50IiwiREVWIiwiX3RhcmdldCIsImlzUGFyZW50IiwiaXNDaGlsZE9mIiwiX3JlY3Vyc2l2ZURpcnR5Iiwic2V0IiwiYWRkIiwiX3JlZ2lzdGVyRXZlbnQiLCJfcmVnaXN0ZXJUYXJnZXRFdmVudHMiLCJyZW1vdmUiLCJfdW5yZWdpc3RlckV2ZW50IiwiX3VucmVnaXN0ZXJUYXJnZXRFdmVudHMiLCJfcmVtb3ZlUGFyZW50RXZlbnQiLCJldmVudFR5cGUiLCJUcmFuc2Zvcm1CaXQiLCJQT1NJVElPTiIsImlzQWxpZ25pbmciLCJzZWxmIiwibmV3UG9zIiwib2xkUG9zIiwiZGVsdGEiLCJzdWJ0cmFjdCIsImludmVyc2VTY2FsZSIsInRhcmdldFNpemUiLCJkZWx0YUluUGVyY2VudCIsIndpZHRoIiwiaGVpZ2h0IiwieiIsImlzQWxpZ25Ub3AiLCJfdG9wIiwiX2lzQWJzVG9wIiwiaXNBbGlnbkJvdHRvbSIsIl9ib3R0b20iLCJfaXNBYnNCb3R0b20iLCJpc0FsaWduTGVmdCIsIl9sZWZ0IiwiX2lzQWJzTGVmdCIsImlzQWxpZ25SaWdodCIsIl9yaWdodCIsIl9pc0Fic1JpZ2h0IiwiaXNBbGlnbkhvcml6b250YWxDZW50ZXIiLCJfaG9yaXpvbnRhbENlbnRlciIsIl9pc0Fic0hvcml6b250YWxDZW50ZXIiLCJpc0FsaWduVmVydGljYWxDZW50ZXIiLCJfdmVydGljYWxDZW50ZXIiLCJfaXNBYnNWZXJ0aWNhbENlbnRlciIsInNldERpcnR5IiwidHJhbnMiLCJuZXdTaXplIiwib2xkU2l6ZSIsImFuY2hvciIsImFuY2hvclBvaW50Iiwib2xkUGFyZW50IiwiX3VucmVnaXN0ZXJPbGRQYXJlbnRFdmVudHMiLCJnZXRQYXJlbnQiLCJvbiIsIlN5c3RlbUV2ZW50VHlwZSIsIlRSQU5TRk9STV9DSEFOR0VEIiwiX2FkanVzdFdpZGdldFRvQWxsb3dNb3ZpbmdJbkVkaXRvciIsIlNJWkVfQ0hBTkdFRCIsIl9hZGp1c3RXaWRnZXRUb0FsbG93UmVzaXppbmdJbkVkaXRvciIsIkFOQ0hPUl9DSEFOR0VEIiwiX2FkanVzdFdpZGdldFRvQW5jaG9yQ2hhbmdlZCIsIlBBUkVOVF9DSEFOR0VEIiwiX2FkanVzdFRhcmdldFRvUGFyZW50Q2hhbmdlZCIsIm9mZiIsImZsYWciLCJpc0FicyIsImN1cnJlbnQiLCJfYWxpZ25GbGFncyIsInBhcmVudFRyYW5zIiwic2l6ZSIsIkNFTlRFUiIsImlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlciIsIk1JRCIsImdldENvbXBvbmVudCIsIl90YXJnZXRDaGFuZ2VkT3BlcmF0aW9uIiwibmFtZSIsImlzQWxpZ24iLCJpc0hvcml6b250YWwiLCJpc1N0cmV0Y2hXaWR0aCIsIl9vcmlnaW5hbFdpZHRoIiwiaXNTdHJldGNoSGVpZ2h0IiwiX29yaWdpbmFsSGVpZ2h0IiwidXBkYXRlT2Zmc2V0c1RvU3RheVB1dCIsInZhbHVlIiwiX3ZhbGlkYXRlVGFyZ2V0SW5ERVYiLCJfc2V0QWxpZ24iLCJfYXV0b0NoYW5nZWRWYWx1ZSIsIl9hbGlnbk1vZGUiLCJDb21wb25lbnQiLCJlZGl0YWJsZSIsInNlcmlhbGl6YWJsZSIsIk9OX1dJTkRPV19SRVNJWkUiLCJlZGl0b3JPbmx5IiwiaW50ZXJuYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZDQSxNQUFNQSxTQUFTLEdBQUcsSUFBSUMsWUFBSixFQUFsQixDLENBRUE7OztBQUNPLFdBQVNDLG1CQUFULENBQThCQyxNQUE5QixFQUFvRDtBQUN2RCxRQUFJQSxNQUFNLFlBQVlDLGFBQXRCLEVBQTZCO0FBQ3pCO0FBQ0EsVUFBSUMsd0JBQUosRUFBWTtBQUNSO0FBQ0EsWUFBSSxDQUFDQyxXQUFLQyxRQUFWLEVBQW9CO0FBQ2hCLGdCQUFNLElBQUlDLEtBQUosQ0FBVSxxQkFBVixDQUFOO0FBQ0g7O0FBRUQsZUFBT0YsV0FBS0MsUUFBTCxDQUFjRSx1QkFBZCxFQUFQO0FBQ0g7O0FBRUQsYUFBT0Msb0JBQVA7QUFDSCxLQVpELE1BYUssSUFBSVAsTUFBTSxDQUFDUSxRQUFQLENBQWdCQyxlQUFwQixFQUFxQztBQUN0QyxhQUFPVCxNQUFNLENBQUNRLFFBQVAsQ0FBZ0JDLGVBQWhCLENBQWdDQyxXQUF2QztBQUNILEtBRkksTUFHQTtBQUNELGFBQU9DLGFBQUtDLElBQVo7QUFDSDtBQUNKOztBQUVNLFdBQVNDLDRCQUFULENBQXVDQyxVQUF2QyxFQUF5REMsTUFBekQsRUFBdUVDLG9CQUF2RSxFQUFtR0MsZ0JBQW5HLEVBQTJIO0FBQzlILFFBQUlDLEtB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Qjs7Ozs7YUFDcUIsQzs7OEVBQ3JCQSxvQjs7Ozs7YUFDOEIsSTs7NEVBQzlCQSxvQjs7Ozs7YUFDZSxDOzs2RUFDZkEsb0I7Ozs7O2FBQ2dCLEM7OzJFQUNoQkEsb0I7Ozs7O2FBQ2MsQzs7OEVBQ2RBLG9COzs7OzthQUNpQixDOzt3RkFDakJBLG9COzs7OzthQUMyQixDOztzRkFDM0JBLG9COzs7OzthQUN5QixDOztpRkFDekJBLG9COzs7OzthQUNvQixJOzttRkFDcEJBLG9COzs7OzthQUNxQixJOztpRkFDckJBLG9COzs7OzthQUNtQixJOztvRkFDbkJBLG9COzs7OzthQUNzQixJOzs4RkFDdEJBLG9COzs7OzthQUNnQyxJOzs0RkFDaENBLG9COzs7OzthQUM4QixJOztzRkFFOUJBLG9COzs7OzthQUN3QixDOzt1RkFDeEJBLG9COzs7OzthQUN5QixDOztrRkFDekJBLG9COzs7OzthQUNvQjlHLFNBQVMsQ0FBQytHLGdCOztrRkFDOUJELG9CLEVBQ0FFLGtCOzs7OzthQUNvQixDOzs7O0FBZ1V6QjtBQUNBakcsMEJBQVNrRyxRQUFULENBQWtCbkksNEJBQWxCLEdBQWlEQSw0QkFBakQ7QUFDQWlDLDBCQUFTa0csUUFBVCxDQUFrQmpKLG1CQUFsQixHQUF3Q0EsbUJBQXhDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UvdWktdHJhbnNmb3JtJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCByZXF1aXJlQ29tcG9uZW50LCB0b29sdGlwLCB0eXBlLCBlZGl0b3JPbmx5LCBlZGl0YWJsZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgU2l6ZSwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGVycm9ySUQsIHdhcm5JRCB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBTeXN0ZW1FdmVudFR5cGUgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtL2V2ZW50LW1hbmFnZXIvZXZlbnQtZW51bSc7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtL3ZpZXcnO1xyXG5pbXBvcnQgdmlzaWJsZVJlY3QgZnJvbSAnLi4vLi4vY29yZS9wbGF0Zm9ybS92aXNpYmxlLXJlY3QnO1xyXG5pbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vY29yZS9zY2VuZS1ncmFwaC9ub2RlJztcclxuaW1wb3J0IHsgY2NlbnVtIH0gZnJvbSAnLi4vLi4vY29yZS92YWx1ZS10eXBlcy9lbnVtJztcclxuaW1wb3J0IHsgVHJhbnNmb3JtQml0IH0gZnJvbSAnLi4vLi4vY29yZS9zY2VuZS1ncmFwaC9ub2RlLWVudW0nO1xyXG5pbXBvcnQgeyBFRElUT1IsIERFViB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBfemVyb1ZlYzMgPSBuZXcgVmVjMygpO1xyXG5cclxuLy8gcmV0dXJucyBhIHJlYWRvbmx5IHNpemUgb2YgdGhlIG5vZGVcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlYWRvbmx5Tm9kZVNpemUgKHBhcmVudDogTm9kZSB8IFNjZW5lKSB7XHJcbiAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgU2NlbmUpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICAvLyBjb25zdCBjYW52YXNDb21wID0gcGFyZW50LmdldENvbXBvbmVudEluQ2hpbGRyZW4oQ2FudmFzKTtcclxuICAgICAgICAgICAgaWYgKCFWaWV3Lmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NjLnZpZXcgdW5pbml0aWF0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFZpZXcuaW5zdGFuY2UuZ2V0RGVzaWduUmVzb2x1dGlvblNpemUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2aXNpYmxlUmVjdDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBhcmVudC5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICByZXR1cm4gcGFyZW50Ll91aVByb3BzLnVpVHJhbnNmb3JtQ29tcC5jb250ZW50U2l6ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBTaXplLlpFUk87XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0ICh3aWRnZXROb2RlOiBOb2RlLCB0YXJnZXQ6IE5vZGUsIG91dF9pbnZlcnNlVHJhbnNsYXRlOiBWZWMzLCBvdXRfaW52ZXJzZVNjYWxlOiBWZWMzKSB7XHJcbiAgICBsZXQgc2NhbGUgPSB3aWRnZXROb2RlLnBhcmVudCA/IHdpZGdldE5vZGUucGFyZW50LmdldFNjYWxlKCkgOiBfemVyb1ZlYzM7XHJcbiAgICBsZXQgc2NhbGVYID0gc2NhbGUueDtcclxuICAgIGxldCBzY2FsZVkgPSBzY2FsZS55O1xyXG4gICAgbGV0IHRyYW5zbGF0ZVggPSAwO1xyXG4gICAgbGV0IHRyYW5zbGF0ZVkgPSAwO1xyXG4gICAgZm9yIChsZXQgbm9kZSA9IHdpZGdldE5vZGUucGFyZW50OyA7KSB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIC8vIEVSUk9SOiB3aWRnZXROb2RlIHNob3VsZCBiZSBjaGlsZCBvZiB0YXJnZXRcclxuICAgICAgICAgICAgb3V0X2ludmVyc2VUcmFuc2xhdGUueCA9IG91dF9pbnZlcnNlVHJhbnNsYXRlLnkgPSAwO1xyXG4gICAgICAgICAgICBvdXRfaW52ZXJzZVNjYWxlLnggPSBvdXRfaW52ZXJzZVNjYWxlLnkgPSAxO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwb3MgPSBub2RlLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdHJhbnNsYXRlWCArPSBwb3MueDtcclxuICAgICAgICB0cmFuc2xhdGVZICs9IHBvcy55O1xyXG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudDsgICAgLy8gbG9vcCBpbmNyZW1lbnRcclxuXHJcbiAgICAgICAgaWYgKG5vZGUgIT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICBzY2FsZSA9IG5vZGUgPyBub2RlLmdldFNjYWxlKCkgOiBfemVyb1ZlYzM7XHJcbiAgICAgICAgICAgIGNvbnN0IHN4ID0gc2NhbGUueDtcclxuICAgICAgICAgICAgY29uc3Qgc3kgPSBzY2FsZS55O1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVYICo9IHN4O1xyXG4gICAgICAgICAgICB0cmFuc2xhdGVZICo9IHN5O1xyXG4gICAgICAgICAgICBzY2FsZVggKj0gc3g7XHJcbiAgICAgICAgICAgIHNjYWxlWSAqPSBzeTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvdXRfaW52ZXJzZVNjYWxlLnggPSBzY2FsZVggIT09IDAgPyAoMSAvIHNjYWxlWCkgOiAxO1xyXG4gICAgb3V0X2ludmVyc2VTY2FsZS55ID0gc2NhbGVZICE9PSAwID8gKDEgLyBzY2FsZVkpIDogMTtcclxuICAgIG91dF9pbnZlcnNlVHJhbnNsYXRlLnggPSAtdHJhbnNsYXRlWDtcclxuICAgIG91dF9pbnZlcnNlVHJhbnNsYXRlLnkgPSAtdHJhbnNsYXRlWTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBXaWRnZXQncyBhbGlnbm1lbnQgbW9kZSwgaW5kaWNhdGluZyB3aGVuIHRoZSB3aWRnZXQgc2hvdWxkIHJlZnJlc2guXHJcbiAqXHJcbiAqIEB6aCBXaWRnZXQg55qE5a+56b2Q5qih5byP77yM6KGo56S6IFdpZGdldCDlupTor6XkvZXml7bliLfmlrDjgIJcclxuICovXHJcbmV4cG9ydCBlbnVtIEFsaWduTW9kZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPbmx5IGFsaWduIG9uY2Ugd2hlbiB0aGUgV2lkZ2V0IGlzIGVuYWJsZWQgZm9yIHRoZSBmaXJzdCB0aW1lLlxyXG4gICAgICogVGhpcyB3aWxsIGFsbG93IHRoZSBzY3JpcHQgb3IgYW5pbWF0aW9uIHRvIGNvbnRpbnVlIGNvbnRyb2xsaW5nIHRoZSBjdXJyZW50IG5vZGUuXHJcbiAgICAgKiBJdCB3aWxsIG9ubHkgYmUgYWxpZ25lZCBvbmNlIGJlZm9yZSB0aGUgZW5kIG9mIGZyYW1lIHdoZW4gb25FbmFibGUgaXMgY2FsbGVkLHRoZW4gaW1tZWRpYXRlbHkgZGlzYWJsZXMgdGhlIFdpZGdldC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5LuF5ZyoIFdpZGdldCDnrKzkuIDmrKHmv4DmtLvml7blr7npvZDkuIDmrKHvvIzkvr/kuo7ohJrmnKzmiJbliqjnlLvnu6fnu63mjqfliLblvZPliY3oioLngrnjgII8YnIvPlxyXG4gICAgICog5byA5ZCv5ZCO5Lya5ZyoIG9uRW5hYmxlIOaXtuaJgOWcqOeahOmCo+S4gOW4p+e7k+adn+WJjeWvuem9kOS4gOasoe+8jOeEtuWQjueri+WIu+emgeeUqOivpSBXaWRnZXTjgIJcclxuICAgICAqL1xyXG4gICAgT05DRSA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBLZWVwIGFsaWduaW5nIGFsbCB0aGUgd2F5LlxyXG4gICAgICpcclxuICAgICAqIEB6aCAg5aeL57uI5L+d5oyB5a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIEFMV0FZUyA9IDEsXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5LiA5byA5aeL5Lya5YOPIE9OQ0Ug5LiA5qC35a+56b2Q5LiA5qyh77yM5LmL5ZCO5q+P5b2T56qX5Y+j5aSn5bCP5pS55Y+Y5pe26L+Y5Lya6YeN5paw5a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIE9OX1dJTkRPV19SRVNJWkUgPSAyLFxyXG59XHJcblxyXG5jY2VudW0oQWxpZ25Nb2RlKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgV2lkZ2V0J3MgYWxpZ25tZW50IGZsYWcsIGluZGljYXRpbmcgd2hlbiB0aGUgd2lkZ2V0IHNlbGVjdCBhbGlnbm1lbnQuXHJcbiAqXHJcbiAqIEB6aCBXaWRnZXQg55qE5a+56b2Q5qCH5b+X77yM6KGo56S6IFdpZGdldCDpgInmi6nlr7npvZDnirbmgIHjgIJcclxuICovXHJcbmV4cG9ydCBlbnVtIEFsaWduRmxhZ3Mge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxpZ24gdG9wLlxyXG4gICAgICpcclxuICAgICAqIEB6aCDkuIrovrnlr7npvZDjgIJcclxuICAgICAqL1xyXG4gICAgVE9QID0gMSA8PCAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxpZ24gbWlkZGxlLlxyXG4gICAgICpcclxuICAgICAqIEB6aCDlnoLnm7TkuK3lv4Plr7npvZDjgIJcclxuICAgICAqL1xyXG4gICAgTUlEID0gMSA8PCAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxpZ24gYm90dG9tLlxyXG4gICAgICpcclxuICAgICAqIEB6aCDkuIvovrnlr7npvZDjgIJcclxuICAgICAqL1xyXG4gICAgQk9UID0gMSA8PCAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxpZ24gbGVmdC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5bem6L655a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIExFRlQgPSAxIDw8IDMsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBbGlnbiBjZW50ZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOaoquWQkeS4reW/g+Wvuem9kOOAglxyXG4gICAgICovXHJcbiAgICBDRU5URVIgPSAxIDw8IDQsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBbGlnbiByaWdodC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5Y+z6L655a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIFJJR0hUID0gMSA8PCA1LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWxpZ24gaG9yaXpvbnRhbC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5qiq5ZCR5a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIEhPUklaT05UQUwgPSBMRUZUIHwgQ0VOVEVSIHwgUklHSFQsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBbGlnbiB2ZXJ0aWNhbC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg57q15ZCR5a+56b2Q44CCXHJcbiAgICAgKi9cclxuICAgIFZFUlRJQ0FMID0gVE9QIHwgTUlEIHwgQk9ULFxyXG59XHJcblxyXG5jb25zdCBUT1BfQk9UID0gQWxpZ25GbGFncy5UT1AgfCBBbGlnbkZsYWdzLkJPVDtcclxuY29uc3QgTEVGVF9SSUdIVCA9IEFsaWduRmxhZ3MuTEVGVCB8IEFsaWduRmxhZ3MuUklHSFQ7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFN0b3JlcyBhbmQgbWFuaXB1bGF0ZSB0aGUgYW5jaG9yaW5nIGJhc2VkIG9uIGl0cyBwYXJlbnQuXHJcbiAqIFdpZGdldCBhcmUgdXNlZCBmb3IgR1VJIGJ1dCBjYW4gYWxzbyBiZSB1c2VkIGZvciBvdGhlciB0aGluZ3MuXHJcbiAqIFdpZGdldCB3aWxsIGFkanVzdCBjdXJyZW50IG5vZGUncyBwb3NpdGlvbiBhbmQgc2l6ZSBhdXRvbWF0aWNhbGx5LFxyXG4gKiBidXQgdGhlIHJlc3VsdHMgYWZ0ZXIgYWRqdXN0bWVudCBjYW4gbm90IGJlIG9idGFpbmVkIHVudGlsIHRoZSBuZXh0IGZyYW1lIHVubGVzcyB5b3UgY2FsbCBbW3VwZGF0ZUFsaWdubWVudF1dIG1hbnVhbGx5LlxyXG4gKlxyXG4gKiBAemggV2lkZ2V0IOe7hOS7tu+8jOeUqOS6juiuvue9ruWSjOmAgumFjeWFtuebuOWvueS6jueItuiKgueCueeahOi+uei3ne+8jFdpZGdldCDpgJrluLjooqvnlKjkuo4gVUkg55WM6Z2i77yM5Lmf5Y+v5Lul55So5LqO5YW25LuW5Zyw5pa544CCPGJyLz5cclxuICogV2lkZ2V0IOS8muiHquWKqOiwg+aVtOW9k+WJjeiKgueCueeahOWdkOagh+WSjOWuvemrmO+8jOS4jei/h+ebruWJjeiwg+aVtOWQjueahOe7k+aenOimgeWIsOS4i+S4gOW4p+aJjeiDveWcqOiEmuacrOmHjOiOt+WPluWIsO+8jOmZpOmdnuS9oOWFiOaJi+WKqOiwg+eUqCBbW3VwZGF0ZUFsaWdubWVudF1d44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuV2lkZ2V0JylcclxuQGhlbHAoJ2kxOG46Y2MuV2lkZ2V0JylcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQG1lbnUoJ1VJL1dpZGdldCcpXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIFdpZGdldCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3BlY2lmaWVzIGFuIGFsaWdubWVudCB0YXJnZXQgdGhhdCBjYW4gb25seSBiZSBvbmUgb2YgdGhlIHBhcmVudCBub2RlcyBvZiB0aGUgY3VycmVudCBub2RlLlxyXG4gICAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgbnVsbCwgYW5kIHdoZW4gbnVsbCwgaW5kaWNhdGVzIHRoZSBjdXJyZW50IHBhcmVudC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+WumuS4gOS4quWvuem9kOebruagh++8jOWPquiDveaYr+W9k+WJjeiKgueCueeahOWFtuS4reS4gOS4queItuiKgueCue+8jOm7mOiupOS4uuepuu+8jOS4uuepuuaXtuihqOekuuW9k+WJjeeItuiKgueCueOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShOb2RlKVxyXG4gICAgQHRvb2x0aXAoJ+Wvuem9kOebruaghycpXHJcbiAgICBnZXQgdGFyZ2V0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0YXJnZXQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdW5yZWdpc3RlclRhcmdldEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyVGFyZ2V0RXZlbnRzKCk7XHJcbiAgICAgICAgaWYgKEVESVRPUiAvKiYmICFjYy5lbmdpbmUuX2lzUGxheWluZyovICYmIHRoaXMubm9kZS5wYXJlbnQpIHtcclxuICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSBvZmZzZXRzIHRvIGtlZXAgdGhlIHNpemUgYW5kIHBvc2l0aW9uIHVuY2hhbmdlZCBhZnRlciB0YXJnZXQgY2hhbmdlZFxyXG4gICAgICAgICAgICBsZWdhY3lDQy5fd2lkZ2V0TWFuYWdlci51cGRhdGVPZmZzZXRzVG9TdGF5UHV0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVUYXJnZXRJbkRFVigpO1xyXG5cclxuICAgICAgICB0aGlzLl9yZWN1cnNpdmVEaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRvIGFsaWduIHRvIHRoZSB0b3AuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblr7npvZDkuIrovrnjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuWvuem9kOS4iui+uScpXHJcbiAgICBnZXQgaXNBbGlnblRvcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgQWxpZ25GbGFncy5UT1ApID4gMDtcclxuICAgIH1cclxuICAgIHNldCBpc0FsaWduVG9wICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NldEFsaWduKEFsaWduRmxhZ3MuVE9QLCB2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciB0byBhbGlnbiB0byB0aGUgYm90dG9tLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5a+56b2Q5LiL6L6544CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmmK/lkKblr7npvZDkuIvovrknKVxyXG4gICAgZ2V0IGlzQWxpZ25Cb3R0b20gKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fYWxpZ25GbGFncyAmIEFsaWduRmxhZ3MuQk9UKSA+IDA7XHJcbiAgICB9XHJcbiAgICBzZXQgaXNBbGlnbkJvdHRvbSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9zZXRBbGlnbihBbGlnbkZsYWdzLkJPVCwgdmFsdWUpO1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdG8gYWxpZ24gdG8gdGhlIGxlZnQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblr7npvZDlt6bovrnjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuWvuem9kOW3pui+uScpXHJcbiAgICBnZXQgaXNBbGlnbkxlZnQgKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fYWxpZ25GbGFncyAmIEFsaWduRmxhZ3MuTEVGVCkgPiAwO1xyXG4gICAgfVxyXG4gICAgc2V0IGlzQWxpZ25MZWZ0ICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3NldEFsaWduKEFsaWduRmxhZ3MuTEVGVCwgdmFsdWUpO1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdG8gYWxpZ24gdG8gdGhlIHJpZ2h0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5a+56b2Q5Y+z6L6544CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmmK/lkKblr7npvZDlj7PovrknKVxyXG4gICAgZ2V0IGlzQWxpZ25SaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgQWxpZ25GbGFncy5SSUdIVCkgPiAwO1xyXG4gICAgfVxyXG4gICAgc2V0IGlzQWxpZ25SaWdodCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9zZXRBbGlnbihBbGlnbkZsYWdzLlJJR0hULCB2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciB0byBhbGlnbiB2ZXJ0aWNhbGx5LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5Z6C55u05pa55ZCR5a+56b2Q5Lit54K577yM5byA5ZCv5q2k6aG55Lya5bCG5Z6C55u05pa55ZCR5YW25LuW5a+56b2Q6YCJ6aG55Y+W5raI44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmmK/lkKblnoLnm7TmlrnlkJHlr7npvZDkuK3ngrnvvIzlvIDlkK/mraTpobnkvJrlsIblnoLnm7TmlrnlkJHlhbbku5blr7npvZDpgInpobnlj5bmtognKVxyXG4gICAgZ2V0IGlzQWxpZ25WZXJ0aWNhbENlbnRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgQWxpZ25GbGFncy5NSUQpID4gMDtcclxuICAgIH1cclxuICAgIHNldCBpc0FsaWduVmVydGljYWxDZW50ZXIgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBbGlnblRvcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmlzQWxpZ25Cb3R0b20gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fYWxpZ25GbGFncyB8PSBBbGlnbkZsYWdzLk1JRDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9hbGlnbkZsYWdzICY9IH5BbGlnbkZsYWdzLk1JRDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdG8gYWxpZ24gaG9yaXpvbnRhbGx5LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5rC05bmz5pa55ZCR5a+56b2Q5Lit54K577yM5byA5ZCv5q2k6YCJ6aG55Lya5bCG5rC05bmz5pa55ZCR5YW25LuW5a+56b2Q6YCJ6aG55Y+W5raI44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmmK/lkKbmsLTlubPmlrnlkJHlr7npvZDkuK3ngrnvvIzlvIDlkK/mraTpgInpobnkvJrlsIbmsLTlubPmlrnlkJHlhbbku5blr7npvZDpgInpobnlj5bmtognKVxyXG4gICAgZ2V0IGlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyICgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2FsaWduRmxhZ3MgJiBBbGlnbkZsYWdzLkNFTlRFUikgPiAwO1xyXG4gICAgfVxyXG4gICAgc2V0IGlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQWxpZ25MZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBbGlnblJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsaWduRmxhZ3MgfD0gQWxpZ25GbGFncy5DRU5URVI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYWxpZ25GbGFncyAmPSB+QWxpZ25GbGFncy5DRU5URVI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdG8gc3RyZXRjaCBob3Jpem9udGFsbHksIHdoZW4gZW5hYmxlIHRoZSBsZWZ0IGFuZCByaWdodCBhbGlnbm1lbnQgd2lsbCBiZSBzdHJldGNoZWQgaG9yaXpvbnRhbGx5LFxyXG4gICAgICogdGhlIHdpZHRoIHNldHRpbmcgaXMgaW52YWxpZCAocmVhZCBvbmx5KS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeaYr+WQpuawtOW5s+aLieS8uOOAguW9k+WQjOaXtuWQr+eUqOW3puWPs+Wvuem9kOaXtu+8jOiKgueCueWwhuS8muiiq+awtOW5s+aLieS8uOOAguatpOaXtuiKgueCueeahOWuveW6pu+8iOWPquivu++8ieOAglxyXG4gICAgICovXHJcbiAgICBnZXQgaXNTdHJldGNoV2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fYWxpZ25GbGFncyAmIExFRlRfUklHSFQpID09PSBMRUZUX1JJR0hUO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRvIHN0cmV0Y2ggdmVydGljYWxseSwgd2hlbiBlbmFibGUgdGhlIGxlZnQgYW5kIHJpZ2h0IGFsaWdubWVudCB3aWxsIGJlIHN0cmV0Y2hlZCB2ZXJ0aWNhbGx5LFxyXG4gICAgICogdGhlbiBoZWlnaHQgc2V0dGluZyBpcyBpbnZhbGlkIChyZWFkIG9ubHkpLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5b2T5YmN5piv5ZCm5Z6C55u05ouJ5Ly444CC5b2T5ZCM5pe25ZCv55So5LiK5LiL5a+56b2Q5pe277yM6IqC54K55bCG5Lya6KKr5Z6C55u05ouJ5Ly477yM5q2k5pe26IqC54K555qE6auY5bqm77yI5Y+q6K+777yJ44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBpc1N0cmV0Y2hIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fYWxpZ25GbGFncyAmIFRPUF9CT1QpID09PSBUT1BfQk9UO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFMSUdOIE1BUkdJTlNcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1hcmdpbnMgYmV0d2VlbiB0aGUgdG9wIG9mIHRoaXMgbm9kZSBhbmQgdGhlIHRvcCBvZiBwYXJlbnQgbm9kZSxcclxuICAgICAqIHRoZSB2YWx1ZSBjYW4gYmUgbmVnYXRpdmUsIE9ubHkgYXZhaWxhYmxlIGluICdpc0FsaWduVG9wJyBvcGVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5pys6IqC54K56aG26L655ZKM54i26IqC54K56aG26L6555qE6Led56a777yM5Y+v5aGr5YaZ6LSf5YC877yM5Y+q5pyJ5ZyoIGlzQWxpZ25Ub3Ag5byA5ZCv5pe25omN5pyJ5L2c55So44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0b3AgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90b3A7XHJcbiAgICB9XHJcbiAgICBzZXQgdG9wICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3RvcCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBARWRpdG9yT25seSBOb3QgZm9yIHVzZXJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgZWRpdG9yVG9wICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNUb3AgPyB0aGlzLl90b3AgOiAodGhpcy5fdG9wICogMTAwKTtcclxuICAgIH1cclxuICAgIHNldCBlZGl0b3JUb3AgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fdG9wID0gdGhpcy5faXNBYnNUb3AgPyB2YWx1ZSA6ICh2YWx1ZSAvIDEwMCk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1hcmdpbnMgYmV0d2VlbiB0aGUgYm90dG9tIG9mIHRoaXMgbm9kZSBhbmQgdGhlIGJvdHRvbSBvZiBwYXJlbnQgbm9kZSxcclxuICAgICAqIHRoZSB2YWx1ZSBjYW4gYmUgbmVnYXRpdmUsIE9ubHkgYXZhaWxhYmxlIGluICdpc0FsaWduQm90dG9tJyBvcGVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5pys6IqC54K55bqV6L655ZKM54i26IqC54K55bqV6L6555qE6Led56a777yM5Y+v5aGr5YaZ6LSf5YC877yM5Y+q5pyJ5ZyoIGlzQWxpZ25Cb3R0b20g5byA5ZCv5pe25omN5pyJ5L2c55So44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBib3R0b20gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib3R0b207XHJcbiAgICB9XHJcbiAgICBzZXQgYm90dG9tICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2JvdHRvbSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBARWRpdG9yT25seSBOb3QgZm9yIHVzZXJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgZWRpdG9yQm90dG9tICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNCb3R0b20gPyB0aGlzLl9ib3R0b20gOiAodGhpcy5fYm90dG9tICogMTAwKTtcclxuICAgIH1cclxuICAgIHNldCBlZGl0b3JCb3R0b20gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fYm90dG9tID0gdGhpcy5faXNBYnNCb3R0b20gPyB2YWx1ZSA6ICh2YWx1ZSAvIDEwMCk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1hcmdpbnMgYmV0d2VlbiB0aGUgbGVmdCBvZiB0aGlzIG5vZGUgYW5kIHRoZSBsZWZ0IG9mIHBhcmVudCBub2RlLFxyXG4gICAgICogdGhlIHZhbHVlIGNhbiBiZSBuZWdhdGl2ZSwgT25seSBhdmFpbGFibGUgaW4gJ2lzQWxpZ25MZWZ0JyBvcGVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5pys6IqC54K55bem6L655ZKM54i26IqC54K55bem6L6555qE6Led56a777yM5Y+v5aGr5YaZ6LSf5YC877yM5Y+q5pyJ5ZyoIGlzQWxpZ25MZWZ0IOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgbGVmdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnQ7XHJcbiAgICB9XHJcbiAgICBzZXQgbGVmdCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9sZWZ0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBFZGl0b3JPbmx5IE5vdCBmb3IgdXNlclxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBlZGl0b3JMZWZ0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNMZWZ0ID8gdGhpcy5fbGVmdCA6ICh0aGlzLl9sZWZ0ICogMTAwKTtcclxuICAgIH1cclxuICAgIHNldCBlZGl0b3JMZWZ0ICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLl9pc0Fic0xlZnQgPyB2YWx1ZSA6ICh2YWx1ZSAvIDEwMCk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1hcmdpbnMgYmV0d2VlbiB0aGUgcmlnaHQgb2YgdGhpcyBub2RlIGFuZCB0aGUgcmlnaHQgb2YgcGFyZW50IG5vZGUsXHJcbiAgICAgKiB0aGUgdmFsdWUgY2FuIGJlIG5lZ2F0aXZlLCBPbmx5IGF2YWlsYWJsZSBpbiAnaXNBbGlnblJpZ2h0JyBvcGVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5pys6IqC54K55Y+z6L655ZKM54i26IqC54K55Y+z6L6555qE6Led56a777yM5Y+v5aGr5YaZ6LSf5YC877yM5Y+q5pyJ5ZyoIGlzQWxpZ25SaWdodCDlvIDlkK/ml7bmiY3mnInkvZznlKjjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHJpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHQ7XHJcbiAgICB9XHJcbiAgICBzZXQgcmlnaHQgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fcmlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9yZWN1cnNpdmVEaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQEVkaXRvck9ubHkgTm90IGZvciB1c2VyXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGVkaXRvclJpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNSaWdodCA/IHRoaXMuX3JpZ2h0IDogKHRoaXMuX3JpZ2h0ICogMTAwKTtcclxuICAgIH1cclxuICAgIHNldCBlZGl0b3JSaWdodCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9yaWdodCA9IHRoaXMuX2lzQWJzUmlnaHQgPyB2YWx1ZSA6ICh2YWx1ZSAvIDEwMCk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSG9yaXpvbnRhbGx5IGFsaWducyB0aGUgbWlkcG9pbnQgb2Zmc2V0IHZhbHVlLFxyXG4gICAgICogdGhlIHZhbHVlIGNhbiBiZSBuZWdhdGl2ZSwgT25seSBhdmFpbGFibGUgaW4gJ2lzQWxpZ25Ib3Jpem9udGFsQ2VudGVyJyBvcGVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rC05bmz5bGF5Lit55qE5YGP56e75YC877yM5Y+v5aGr5YaZ6LSf5YC877yM5Y+q5pyJ5ZyoIGlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyIOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgaG9yaXpvbnRhbENlbnRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hvcml6b250YWxDZW50ZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgaG9yaXpvbnRhbENlbnRlciAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9ob3Jpem9udGFsQ2VudGVyID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBFZGl0b3JPbmx5IE5vdCBmb3IgdXNlclxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBlZGl0b3JIb3Jpem9udGFsQ2VudGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNIb3Jpem9udGFsQ2VudGVyID8gdGhpcy5faG9yaXpvbnRhbENlbnRlciA6ICh0aGlzLl9ob3Jpem9udGFsQ2VudGVyICogMTAwKTtcclxuICAgIH1cclxuICAgIHNldCBlZGl0b3JIb3Jpem9udGFsQ2VudGVyICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2hvcml6b250YWxDZW50ZXIgPSB0aGlzLl9pc0Fic0hvcml6b250YWxDZW50ZXIgPyB2YWx1ZSA6ICh2YWx1ZSAvIDEwMCk7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVmVydGljYWxseSBhbGlnbnMgdGhlIG1pZHBvaW50IG9mZnNldCB2YWx1ZSxcclxuICAgICAqIHRoZSB2YWx1ZSBjYW4gYmUgbmVnYXRpdmUsIE9ubHkgYXZhaWxhYmxlIGluICdpc0FsaWduVmVydGljYWxDZW50ZXInIG9wZW4uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlnoLnm7TlsYXkuK3nmoTlgY/np7vlgLzvvIzlj6/loavlhpnotJ/lgLzvvIzlj6rmnInlnKggaXNBbGlnblZlcnRpY2FsQ2VudGVyIOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgdmVydGljYWxDZW50ZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbENlbnRlcjtcclxuICAgIH1cclxuICAgIHNldCB2ZXJ0aWNhbENlbnRlciAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl92ZXJ0aWNhbENlbnRlciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBARWRpdG9yT25seSBOb3QgZm9yIHVzZXJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgZWRpdG9yVmVydGljYWxDZW50ZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Fic1ZlcnRpY2FsQ2VudGVyID8gdGhpcy5fdmVydGljYWxDZW50ZXIgOiAodGhpcy5fdmVydGljYWxDZW50ZXIgKiAxMDApO1xyXG4gICAgfVxyXG4gICAgc2V0IGVkaXRvclZlcnRpY2FsQ2VudGVyICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3ZlcnRpY2FsQ2VudGVyID0gdGhpcy5faXNBYnNWZXJ0aWNhbENlbnRlciA/IHZhbHVlIDogKHZhbHVlIC8gMTAwKTtcclxuICAgICAgICB0aGlzLl9yZWN1cnNpdmVEaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJZiB0cnVlLCB0b3AgaXMgcGl4ZWwgbWFyZ2luLCBvdGhlcndpc2UgaXMgcGVyY2VudGFnZSAoMCAtIDEpIG1hcmdpbiByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgaGVpZ2h0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aaC5p6c5Li6IHRydWXvvIxcInRvcFwiIOWwhuS8muS7peWDj+e0oOS9nOS4uui+uei3ne+8jOWQpuWImeWwhuS8muS7peebuOWvueeItueJqeS9k+mrmOW6pueahOavlOS+i++8iDAg5YiwIDHvvInkvZzkuLrovrnot53jgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgaXNBYnNvbHV0ZVRvcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQWJzVG9wO1xyXG4gICAgfVxyXG4gICAgc2V0IGlzQWJzb2x1dGVUb3AgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzQWJzVG9wID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0Fic1RvcCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9DaGFuZ2VkVmFsdWUoQWxpZ25GbGFncy5UT1AsIHRoaXMuX2lzQWJzVG9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSWYgdHJ1ZSwgYm90dG9tIGlzIHBpeGVsIG1hcmdpbiwgb3RoZXJ3aXNlIGlzIHBlcmNlbnRhZ2UgKDAgLSAxKSBtYXJnaW4gcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIGhlaWdodC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWmguaenOS4uiB0cnVl77yMXCJib3R0b21cIiDlsIbkvJrku6Xlg4/ntKDkvZzkuLrovrnot53vvIzlkKbliJnlsIbkvJrku6Xnm7jlr7nniLbniankvZPpq5jluqbnmoTmr5TkvovvvIgwIOWIsCAx77yJ5L2c5Li66L656Led44CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGlzQWJzb2x1dGVCb3R0b20gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Fic0JvdHRvbTtcclxuICAgIH1cclxuICAgIHNldCBpc0Fic29sdXRlQm90dG9tICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0Fic0JvdHRvbSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faXNBYnNCb3R0b20gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9hdXRvQ2hhbmdlZFZhbHVlKEFsaWduRmxhZ3MuQk9ULCB0aGlzLl9pc0Fic0JvdHRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElmIHRydWUsIGxlZnQgaXMgcGl4ZWwgbWFyZ2luLCBvdGhlcndpc2UgaXMgcGVyY2VudGFnZSAoMCAtIDEpIG1hcmdpbiByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3Mgd2lkdGguXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlpoLmnpzkuLogdHJ1Ze+8jFwibGVmdFwiIOWwhuS8muS7peWDj+e0oOS9nOS4uui+uei3ne+8jOWQpuWImeWwhuS8muS7peebuOWvueeItueJqeS9k+WuveW6pueahOavlOS+i++8iDAg5YiwIDHvvInkvZzkuLrovrnot53jgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgaXNBYnNvbHV0ZUxlZnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Fic0xlZnQ7XHJcbiAgICB9XHJcbiAgICBzZXQgaXNBYnNvbHV0ZUxlZnQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzQWJzTGVmdCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faXNBYnNMZWZ0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fYXV0b0NoYW5nZWRWYWx1ZShBbGlnbkZsYWdzLkxFRlQsIHRoaXMuX2lzQWJzTGVmdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElmIHRydWUsIHJpZ2h0IGlzIHBpeGVsIG1hcmdpbiwgb3RoZXJ3aXNlIGlzIHBlcmNlbnRhZ2UgKDAgLSAxKSBtYXJnaW4gcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIHdpZHRoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aaC5p6c5Li6IHRydWXvvIxcInJpZ2h0XCIg5bCG5Lya5Lul5YOP57Sg5L2c5Li66L656Led77yM5ZCm5YiZ5bCG5Lya5Lul55u45a+554i254mp5L2T5a695bqm55qE5q+U5L6L77yIMCDliLAgMe+8ieS9nOS4uui+uei3neOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBpc0Fic29sdXRlUmlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Fic1JpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2V0IGlzQWJzb2x1dGVSaWdodCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNBYnNSaWdodCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faXNBYnNSaWdodCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9DaGFuZ2VkVmFsdWUoQWxpZ25GbGFncy5SSUdIVCwgdGhpcy5faXNBYnNSaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElmIHRydWUsIGhvcml6b250YWxDZW50ZXIgaXMgcGl4ZWwgbWFyZ2luLCBvdGhlcndpc2UgaXMgcGVyY2VudGFnZSAoMCAtIDEpIG1hcmdpbi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWmguaenOS4uiB0cnVl77yMXCJob3Jpem9udGFsQ2VudGVyXCIg5bCG5Lya5Lul5YOP57Sg5L2c5Li65YGP56e75YC877yM5Y+N5LmL5Li65q+U5L6L77yIMCDliLAgMe+8ieOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBpc0Fic29sdXRlSG9yaXpvbnRhbENlbnRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQWJzSG9yaXpvbnRhbENlbnRlcjtcclxuICAgIH1cclxuICAgIHNldCBpc0Fic29sdXRlSG9yaXpvbnRhbENlbnRlciAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNBYnNIb3Jpem9udGFsQ2VudGVyID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0Fic0hvcml6b250YWxDZW50ZXIgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9hdXRvQ2hhbmdlZFZhbHVlKEFsaWduRmxhZ3MuQ0VOVEVSLCB0aGlzLl9pc0Fic0hvcml6b250YWxDZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJZiB0cnVlLCB2ZXJ0aWNhbENlbnRlciBpcyBwaXhlbCBtYXJnaW4sIG90aGVyd2lzZSBpcyBwZXJjZW50YWdlICgwIC0gMSkgbWFyZ2luLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5aaC5p6c5Li6IHRydWXvvIxcInZlcnRpY2FsQ2VudGVyXCIg5bCG5Lya5Lul5YOP57Sg5L2c5Li65YGP56e75YC877yM5Y+N5LmL5Li65q+U5L6L77yIMCDliLAgMe+8ieOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBpc0Fic29sdXRlVmVydGljYWxDZW50ZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Fic1ZlcnRpY2FsQ2VudGVyO1xyXG4gICAgfVxyXG4gICAgc2V0IGlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlciAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNBYnNWZXJ0aWNhbENlbnRlciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faXNBYnNWZXJ0aWNhbENlbnRlciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9DaGFuZ2VkVmFsdWUoQWxpZ25GbGFncy5NSUQsIHRoaXMuX2lzQWJzVmVydGljYWxDZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGFsaWdubWVudCBtb2RlIG9mIHRoZSBXaWRnZXQsIHdoaWNoIGRldGVybWluZXMgd2hlbiB0aGUgd2lkZ2V0IHNob3VsZCByZWZyZXNoLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oyH5a6aIFdpZGdldCDnmoTlr7npvZDmqKHlvI/vvIznlKjkuo7lhrPlrpogV2lkZ2V0IOW6lOivpeS9leaXtuWIt+aWsOOAglxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBcclxuICAgICAqIGltcG9ydCB7IFdpZGdldCB9IGZyb20gJ2NjJztcclxuICAgICAqIHdpZGdldC5hbGlnbk1vZGUgPSBXaWRnZXQuQWxpZ25Nb2RlLk9OX1dJTkRPV19SRVNJWkU7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQWxpZ25Nb2RlKVxyXG4gICAgQHRvb2x0aXAoJ+aMh+WumiB3aWRnZXQg55qE5a+56b2Q5pa55byP77yM55So5LqO5Yaz5a6a6L+Q6KGM5pe2IHdpZGdldCDlupTkvZXml7bmm7TmlrAnKVxyXG4gICAgZ2V0IGFsaWduTW9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWduTW9kZTtcclxuICAgIH1cclxuICAgIHNldCBhbGlnbk1vZGUgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fYWxpZ25Nb2RlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5a+56b2Q5byA5YWz77yM55SxIEFsaWduRmxhZ3Mg57uE5oiQXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGFsaWduRmxhZ3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGlnbkZsYWdzO1xyXG4gICAgfVxyXG4gICAgc2V0IGFsaWduRmxhZ3MgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FsaWduRmxhZ3MgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FsaWduRmxhZ3MgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9yZWN1cnNpdmVEaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgQWxpZ25Nb2RlID0gQWxpZ25Nb2RlO1xyXG5cclxuICAgIHB1YmxpYyBfbGFzdFBvcyA9IG5ldyBWZWMzKCk7XHJcbiAgICBwdWJsaWMgX2xhc3RTaXplID0gbmV3IFNpemUoKTtcclxuICAgIHB1YmxpYyBfZGlydHkgPSB0cnVlO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2FsaWduRmxhZ3MgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfdGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9sZWZ0ID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3JpZ2h0ID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3RvcCA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9ib3R0b20gPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaG9yaXpvbnRhbENlbnRlciA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF92ZXJ0aWNhbENlbnRlciA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9pc0Fic0xlZnQgPSB0cnVlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaXNBYnNSaWdodCA9IHRydWU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9pc0Fic1RvcCA9IHRydWU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9pc0Fic0JvdHRvbSA9IHRydWU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9pc0Fic0hvcml6b250YWxDZW50ZXIgPSB0cnVlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaXNBYnNWZXJ0aWNhbENlbnRlciA9IHRydWU7XHJcbiAgICAvLyBvcmlnaW5hbCBzaXplIGJlZm9yZSBhbGlnblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfb3JpZ2luYWxXaWR0aCA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9vcmlnaW5hbEhlaWdodCA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9hbGlnbk1vZGUgPSBBbGlnbk1vZGUuT05fV0lORE9XX1JFU0laRTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0b3JPbmx5XHJcbiAgICBwcml2YXRlIF9sb2NrRmxhZ3MgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJbW1lZGlhdGVseSBwZXJmb3JtIHRoZSB3aWRnZXQgYWxpZ25tZW50LiBZb3UgbmVlZCB0byBtYW51YWxseSBjYWxsIHRoaXMgbWV0aG9kIG9ubHkgaWZcclxuICAgICAqIHlvdSBuZWVkIHRvIGdldCB0aGUgbGF0ZXN0IHJlc3VsdHMgYWZ0ZXIgdGhlIGFsaWdubWVudCBiZWZvcmUgdGhlIGVuZCBvZiBjdXJyZW50IGZyYW1lLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog56uL5Yi75omn6KGMIHdpZGdldCDlr7npvZDmk43kvZzjgILov5nkuKrmjqXlj6PkuIDoiKzkuI3pnIDopoHmiYvlt6XosIPnlKjjgIJcclxuICAgICAqIOWPquacieW9k+S9oOmcgOimgeWcqOW9k+WJjeW4p+e7k+adn+WJjeiOt+W+lyB3aWRnZXQg5a+56b2Q5ZCO55qE5pyA5paw57uT5p6c5pe25omN6ZyA6KaB5omL5Yqo6LCD55So6L+Z5Liq5pa55rOV44CCXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBsb2cgfSBmcm9tICdjYyc7XHJcbiAgICAgKiB3aWRnZXQudG9wID0gMTA7ICAgICAgIC8vIGNoYW5nZSB0b3AgbWFyZ2luXHJcbiAgICAgKiBsb2cod2lkZ2V0Lm5vZGUueSk7IC8vIG5vdCB5ZXQgY2hhbmdlZFxyXG4gICAgICogd2lkZ2V0LnVwZGF0ZUFsaWdubWVudCgpO1xyXG4gICAgICogbG9nKHdpZGdldC5ub2RlLnkpOyAvLyBjaGFuZ2VkXHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHVwZGF0ZUFsaWdubWVudCAoKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuX3dpZGdldE1hbmFnZXIudXBkYXRlQWxpZ25tZW50KHRoaXMubm9kZSBhcyBOb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3ZhbGlkYXRlVGFyZ2V0SW5ERVYgKCkge1xyXG4gICAgICAgIGlmICghREVWKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX3RhcmdldDtcclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzUGFyZW50ID0gdGhpcy5ub2RlICE9PSB0YXJnZXQgJiYgdGhpcy5ub2RlLmlzQ2hpbGRPZih0YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAoIWlzUGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDY1MDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGlydHkgKCkge1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0UG9zaXRpb24odGhpcy5fbGFzdFBvcyk7XHJcbiAgICAgICAgdGhpcy5fbGFzdFNpemUuc2V0KHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLmNvbnRlbnRTaXplKTtcclxuICAgICAgICBsZWdhY3lDQy5fd2lkZ2V0TWFuYWdlci5hZGQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudCgpO1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyVGFyZ2V0RXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuX3dpZGdldE1hbmFnZXIucmVtb3ZlKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJFdmVudCgpO1xyXG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJUYXJnZXRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9yZW1vdmVQYXJlbnRFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfYWRqdXN0V2lkZ2V0VG9BbGxvd01vdmluZ0luRWRpdG9yIChldmVudFR5cGU6IFRyYW5zZm9ybUJpdCkge1xyXG4gICAgICAgIGlmICgvKiFFRElUT1IgfHwqLyAhKGV2ZW50VHlwZSAmIFRyYW5zZm9ybUJpdC5QT1NJVElPTikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLl93aWRnZXRNYW5hZ2VyLmlzQWxpZ25pbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zID0gc2VsZi5ub2RlLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgY29uc3Qgb2xkUG9zID0gdGhpcy5fbGFzdFBvcztcclxuICAgICAgICBjb25zdCBkZWx0YSA9IG5ldyBWZWMzKG5ld1Bvcyk7XHJcbiAgICAgICAgZGVsdGEuc3VidHJhY3Qob2xkUG9zKTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IHNlbGYubm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgY29uc3QgaW52ZXJzZVNjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLnRhcmdldCkge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSBzZWxmLnRhcmdldDtcclxuICAgICAgICAgICAgY29tcHV0ZUludmVyc2VUcmFuc0ZvclRhcmdldChzZWxmLm5vZGUsIHRhcmdldCwgbmV3IFZlYzMoKSwgaW52ZXJzZVNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0U2l6ZSA9IGdldFJlYWRvbmx5Tm9kZVNpemUodGFyZ2V0KTtcclxuICAgICAgICBjb25zdCBkZWx0YUluUGVyY2VudCA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgaWYgKHRhcmdldFNpemUud2lkdGggIT09IDAgJiYgdGFyZ2V0U2l6ZS5oZWlnaHQgIT09IDApIHtcclxuICAgICAgICAgICAgVmVjMy5zZXQoZGVsdGFJblBlcmNlbnQsIGRlbHRhLnggLyB0YXJnZXRTaXplLndpZHRoLCBkZWx0YS55IC8gdGFyZ2V0U2l6ZS5oZWlnaHQsIGRlbHRhSW5QZXJjZW50LnopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNlbGYuaXNBbGlnblRvcCkge1xyXG4gICAgICAgICAgICBzZWxmLl90b3AgLT0gKHNlbGYuX2lzQWJzVG9wID8gZGVsdGEueSA6IGRlbHRhSW5QZXJjZW50LnkpICogaW52ZXJzZVNjYWxlLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxmLmlzQWxpZ25Cb3R0b20pIHtcclxuICAgICAgICAgICAgc2VsZi5fYm90dG9tICs9IChzZWxmLl9pc0Fic0JvdHRvbSA/IGRlbHRhLnkgOiBkZWx0YUluUGVyY2VudC55KSAqIGludmVyc2VTY2FsZS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZi5pc0FsaWduTGVmdCkge1xyXG4gICAgICAgICAgICBzZWxmLl9sZWZ0ICs9IChzZWxmLl9pc0Fic0xlZnQgPyBkZWx0YS54IDogZGVsdGFJblBlcmNlbnQueCkgKiBpbnZlcnNlU2NhbGUueDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGYuaXNBbGlnblJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHNlbGYuX3JpZ2h0IC09IChzZWxmLl9pc0Fic1JpZ2h0ID8gZGVsdGEueCA6IGRlbHRhSW5QZXJjZW50LngpICogaW52ZXJzZVNjYWxlLng7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxmLmlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyKSB7XHJcbiAgICAgICAgICAgIHNlbGYuX2hvcml6b250YWxDZW50ZXIgKz0gKHNlbGYuX2lzQWJzSG9yaXpvbnRhbENlbnRlciA/IGRlbHRhLnggOiBkZWx0YUluUGVyY2VudC54KSAqIGludmVyc2VTY2FsZS54O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZi5pc0FsaWduVmVydGljYWxDZW50ZXIpIHtcclxuICAgICAgICAgICAgc2VsZi5fdmVydGljYWxDZW50ZXIgKz0gKHNlbGYuX2lzQWJzVmVydGljYWxDZW50ZXIgPyBkZWx0YS55IDogZGVsdGFJblBlcmNlbnQueSkgKiBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2FkanVzdFdpZGdldFRvQWxsb3dSZXNpemluZ0luRWRpdG9yICgpIHtcclxuICAgICAgICAvLyBpZiAoIUVESVRPUikge1xyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBpZiAobGVnYWN5Q0MuX3dpZGdldE1hbmFnZXIuaXNBbGlnbmluZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldERpcnR5KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zID0gc2VsZi5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3QgbmV3U2l6ZSA9IHRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIGNvbnN0IG9sZFNpemUgPSB0aGlzLl9sYXN0U2l6ZTtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IG5ldyBWZWMzKG5ld1NpemUud2lkdGggLSBvbGRTaXplLndpZHRoLCBuZXdTaXplLmhlaWdodCAtIG9sZFNpemUuaGVpZ2h0LCAwKTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IHNlbGYubm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgY29uc3QgaW52ZXJzZVNjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcbiAgICAgICAgaWYgKHNlbGYudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHNlbGYudGFyZ2V0O1xyXG4gICAgICAgICAgICBjb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0KHNlbGYubm9kZSwgdGFyZ2V0LCBuZXcgVmVjMygpLCBpbnZlcnNlU2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0YXJnZXRTaXplID0gZ2V0UmVhZG9ubHlOb2RlU2l6ZSh0YXJnZXQpO1xyXG4gICAgICAgIGNvbnN0IGRlbHRhSW5QZXJjZW50ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICBpZiAodGFyZ2V0U2l6ZS53aWR0aCAhPT0gMCAmJiB0YXJnZXRTaXplLmhlaWdodCAhPT0gMCkge1xyXG4gICAgICAgICAgICBWZWMzLnNldChkZWx0YUluUGVyY2VudCwgZGVsdGEueCAvIHRhcmdldFNpemUud2lkdGgsIGRlbHRhLnkgLyB0YXJnZXRTaXplLmhlaWdodCwgZGVsdGFJblBlcmNlbnQueik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhbmNob3IgPSB0cmFucy5hbmNob3JQb2ludDtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYuaXNBbGlnblRvcCkge1xyXG4gICAgICAgICAgICBzZWxmLl90b3AgLT0gKHNlbGYuX2lzQWJzVG9wID8gZGVsdGEueSA6IGRlbHRhSW5QZXJjZW50LnkpICogKDEgLSBhbmNob3IueSkgKiBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGYuaXNBbGlnbkJvdHRvbSkge1xyXG4gICAgICAgICAgICBzZWxmLl9ib3R0b20gLT0gKHNlbGYuX2lzQWJzQm90dG9tID8gZGVsdGEueSA6IGRlbHRhSW5QZXJjZW50LnkpICogYW5jaG9yLnkgKiBpbnZlcnNlU2NhbGUueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGYuaXNBbGlnbkxlZnQpIHtcclxuICAgICAgICAgICAgc2VsZi5fbGVmdCAtPSAoc2VsZi5faXNBYnNMZWZ0ID8gZGVsdGEueCA6IGRlbHRhSW5QZXJjZW50LngpICogYW5jaG9yLnggKiBpbnZlcnNlU2NhbGUueDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGYuaXNBbGlnblJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHNlbGYuX3JpZ2h0IC09IChzZWxmLl9pc0Fic1JpZ2h0ID8gZGVsdGEueCA6IGRlbHRhSW5QZXJjZW50LngpICogKDEgLSBhbmNob3IueCkgKiBpbnZlcnNlU2NhbGUueDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcmVjdXJzaXZlRGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2FkanVzdFdpZGdldFRvQW5jaG9yQ2hhbmdlZCAoKSB7XHJcbiAgICAgICAgdGhpcy5zZXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfYWRqdXN0VGFyZ2V0VG9QYXJlbnRDaGFuZ2VkIChvbGRQYXJlbnQ6IE5vZGUpIHtcclxuICAgICAgICBpZiAob2xkUGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VucmVnaXN0ZXJPbGRQYXJlbnRFdmVudHMob2xkUGFyZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS5nZXRQYXJlbnQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlclRhcmdldEV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlZ2lzdGVyRXZlbnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQsIHRoaXMuX2FkanVzdFdpZGdldFRvQWxsb3dNb3ZpbmdJbkVkaXRvciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX2FkanVzdFdpZGdldFRvQWxsb3dSZXNpemluZ0luRWRpdG9yLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9hZGp1c3RXaWRnZXRUb0FuY2hvckNoYW5nZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuUEFSRU5UX0NIQU5HRUQsIHRoaXMuX2FkanVzdFRhcmdldFRvUGFyZW50Q2hhbmdlZCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91bnJlZ2lzdGVyRXZlbnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl9hZGp1c3RXaWRnZXRUb0FsbG93TW92aW5nSW5FZGl0b3IsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fYWRqdXN0V2lkZ2V0VG9BbGxvd1Jlc2l6aW5nSW5FZGl0b3IsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9hZGp1c3RXaWRnZXRUb0FuY2hvckNoYW5nZWQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVtb3ZlUGFyZW50RXZlbnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlBBUkVOVF9DSEFOR0VELCB0aGlzLl9hZGp1c3RUYXJnZXRUb1BhcmVudENoYW5nZWQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXV0b0NoYW5nZWRWYWx1ZSAoZmxhZzogQWxpZ25GbGFncywgaXNBYnM6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gKHRoaXMuX2FsaWduRmxhZ3MgJiBmbGFnKSA+IDA7XHJcbiAgICAgICAgY29uc3QgcGFyZW50VHJhbnMgPSB0aGlzLm5vZGUucGFyZW50ICYmIHRoaXMubm9kZS5wYXJlbnQuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgICAgIGlmICghY3VycmVudCB8fCAhcGFyZW50VHJhbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHBhcmVudFRyYW5zLmNvbnRlbnRTaXplO1xyXG4gICAgICAgIGlmICh0aGlzLmlzQWxpZ25MZWZ0ICYmIGZsYWcgPT09IEFsaWduRmxhZ3MuTEVGVCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0ID0gaXNBYnMgPyB0aGlzLl9sZWZ0ICogc2l6ZS53aWR0aCA6IHRoaXMuX2xlZnQgLyBzaXplLndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FsaWduUmlnaHQgJiYgZmxhZyA9PT0gQWxpZ25GbGFncy5SSUdIVCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yaWdodCA9IGlzQWJzID8gdGhpcy5fcmlnaHQgKiBzaXplLndpZHRoIDogdGhpcy5fcmlnaHQgLyBzaXplLndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FsaWduSG9yaXpvbnRhbENlbnRlciAmJiBmbGFnID09PSBBbGlnbkZsYWdzLkNFTlRFUikge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3Jpem9udGFsQ2VudGVyID0gaXNBYnMgPyB0aGlzLl9ob3Jpem9udGFsQ2VudGVyICogc2l6ZS53aWR0aCA6IHRoaXMuX2hvcml6b250YWxDZW50ZXIgLyBzaXplLndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FsaWduVG9wICYmIGZsYWcgPT09IEFsaWduRmxhZ3MuVE9QKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvcCA9IGlzQWJzID8gdGhpcy5fdG9wICogc2l6ZS5oZWlnaHQgOiB0aGlzLl90b3AgLyBzaXplLmhlaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBbGlnbkJvdHRvbSAmJiBmbGFnID09PSBBbGlnbkZsYWdzLkJPVCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib3R0b20gPSBpc0FicyA/IHRoaXMuX2JvdHRvbSAqIHNpemUuaGVpZ2h0IDogdGhpcy5fYm90dG9tIC8gc2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlciAmJiBmbGFnID09PSBBbGlnbkZsYWdzLk1JRCkge1xyXG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNhbENlbnRlciA9IGlzQWJzID8gdGhpcy5fdmVydGljYWxDZW50ZXIgLyBzaXplLmhlaWdodCA6IHRoaXMuX3ZlcnRpY2FsQ2VudGVyIC8gc2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZWN1cnNpdmVEaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVnaXN0ZXJUYXJnZXRFdmVudHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX3RhcmdldCB8fCB0aGlzLm5vZGUucGFyZW50O1xyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgaWYgKHRhcmdldC5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQub24oU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl90YXJnZXRDaGFuZ2VkT3BlcmF0aW9uLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5vbihTeXN0ZW1FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl90YXJnZXRDaGFuZ2VkT3BlcmF0aW9uLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCg2NTAxLCB0aGlzLm5vZGUubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91bnJlZ2lzdGVyVGFyZ2V0RXZlbnRzICgpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl90YXJnZXQgfHwgdGhpcy5ub2RlLnBhcmVudDtcclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5vZmYoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl90YXJnZXRDaGFuZ2VkT3BlcmF0aW9uLCB0aGlzKTtcclxuICAgICAgICAgICAgdGFyZ2V0Lm9mZihTeXN0ZW1FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl90YXJnZXRDaGFuZ2VkT3BlcmF0aW9uLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91bnJlZ2lzdGVyT2xkUGFyZW50RXZlbnRzIChvbGRQYXJlbnQ6IE5vZGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl90YXJnZXQgfHwgb2xkUGFyZW50O1xyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Lm9mZihTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQsIHRoaXMuX3RhcmdldENoYW5nZWRPcGVyYXRpb24sIHRoaXMpO1xyXG4gICAgICAgICAgICB0YXJnZXQub2ZmKFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3RhcmdldENoYW5nZWRPcGVyYXRpb24sIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RhcmdldENoYW5nZWRPcGVyYXRpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX3JlY3Vyc2l2ZURpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0QWxpZ24gKGZsYWc6IEFsaWduRmxhZ3MsIGlzQWxpZ246IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gKHRoaXMuX2FsaWduRmxhZ3MgJiBmbGFnKSA+IDA7XHJcbiAgICAgICAgaWYgKGlzQWxpZ24gPT09IGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpc0hvcml6b250YWwgPSAoZmxhZyAmIExFRlRfUklHSFQpID4gMDtcclxuICAgICAgICBjb25zdCB0cmFucyA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgIGlmIChpc0FsaWduKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsaWduRmxhZ3MgfD0gZmxhZztcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNBbGlnbkhvcml6b250YWxDZW50ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3RyZXRjaFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmVjb21lIHN0cmV0Y2hcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFdpZHRoID0gdHJhbnMud2lkdGghO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgY2hlY2sgY29uZmxpY3RcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRURJVE9SIC8qJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuY2hlY2tDb25mbGljdF9XaWRnZXQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0FsaWduVmVydGljYWxDZW50ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3RyZXRjaEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJlY29tZSBzdHJldGNoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxIZWlnaHQgPSB0cmFucy5oZWlnaHQhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgY2hlY2sgY29uZmxpY3RcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRURJVE9SIC8qJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuY2hlY2tDb25mbGljdF9XaWRnZXQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoRURJVE9SICYmIHRoaXMubm9kZS5wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFkanVzdCB0aGUgb2Zmc2V0cyB0byBrZWVwIHRoZSBzaXplIGFuZCBwb3NpdGlvbiB1bmNoYW5nZWQgYWZ0ZXIgYWxpZ25tZW50IGNoYW5nZWRcclxuICAgICAgICAgICAgICAgIGxlZ2FjeUNDLl93aWRnZXRNYW5hZ2VyLnVwZGF0ZU9mZnNldHNUb1N0YXlQdXQodGhpcywgZmxhZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1N0cmV0Y2hXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgY2FuY2VsIHN0cmV0Y2hcclxuICAgICAgICAgICAgICAgICAgICB0cmFucy53aWR0aCA9IHRoaXMuX29yaWdpbmFsV2lkdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1N0cmV0Y2hIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGNhbmNlbCBzdHJldGNoXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnMuaGVpZ2h0ID0gdGhpcy5fb3JpZ2luYWxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2FsaWduRmxhZ3MgJj0gfmZsYWc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlY3Vyc2l2ZURpcnR5ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgV2lkZ2V0IHtcclxuICAgIGV4cG9ydCB0eXBlIEFsaWduTW9kZSA9IEVudW1BbGlhczx0eXBlb2YgQWxpZ25Nb2RlPjtcclxufVxyXG5cclxuLy8gY2MuV2lkZ2V0ID0gbW9kdWxlLmV4cG9ydHMgPSBXaWRnZXQ7XHJcbmxlZ2FjeUNDLmludGVybmFsLmNvbXB1dGVJbnZlcnNlVHJhbnNGb3JUYXJnZXQgPSBjb21wdXRlSW52ZXJzZVRyYW5zRm9yVGFyZ2V0O1xyXG5sZWdhY3lDQy5pbnRlcm5hbC5nZXRSZWFkb25seU5vZGVTaXplID0gZ2V0UmVhZG9ubHlOb2RlU2l6ZTtcclxuIl19