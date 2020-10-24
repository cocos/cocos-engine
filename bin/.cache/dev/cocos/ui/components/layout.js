(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component.js", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/enum.js", "../../core/components/ui-base/ui-transform.js", "../../core/platform/event-manager/event-enum.js", "../../core/director.js", "../../core/scene-graph/node-enum.js", "../../core/default-constants.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component.js"), require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("../../core/components/ui-base/ui-transform.js"), require("../../core/platform/event-manager/event-enum.js"), require("../../core/director.js"), require("../../core/scene-graph/node-enum.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.index, global._enum, global.uiTransform, global.eventEnum, global.director, global.nodeEnum, global.defaultConstants, global.globalExports);
    global.layout = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _index2, _enum, _uiTransform, _eventEnum, _director, _nodeEnum, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Layout = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class3, _temp;

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

  var NodeEvent = _eventEnum.SystemEventType;
  /**
   * @en Enum for layout.
   *
   * @zh 布局类型。
   */

  var Type;

  (function (Type) {
    Type[Type["NONE"] = 0] = "NONE";
    Type[Type["HORIZONTAL"] = 1] = "HORIZONTAL";
    Type[Type["VERTICAL"] = 2] = "VERTICAL";
    Type[Type["GRID"] = 3] = "GRID";
  })(Type || (Type = {}));

  (0, _enum.ccenum)(Type);
  /**
   * @en Enum for Layout Resize Mode.
   *
   * @zh 缩放模式。
   */

  var ResizeMode;

  (function (ResizeMode) {
    ResizeMode[ResizeMode["NONE"] = 0] = "NONE";
    ResizeMode[ResizeMode["CONTAINER"] = 1] = "CONTAINER";
    ResizeMode[ResizeMode["CHILDREN"] = 2] = "CHILDREN";
  })(ResizeMode || (ResizeMode = {}));

  (0, _enum.ccenum)(ResizeMode);
  /**
   * @en Enum for Grid Layout start axis direction.
   *
   * @zh 布局轴向，只用于 GRID 布局。
   */

  var AxisDirection;

  (function (AxisDirection) {
    AxisDirection[AxisDirection["HORIZONTAL"] = 0] = "HORIZONTAL";
    AxisDirection[AxisDirection["VERTICAL"] = 1] = "VERTICAL";
  })(AxisDirection || (AxisDirection = {}));

  (0, _enum.ccenum)(AxisDirection);
  /**
   * @en Enum for vertical layout direction.
   *
   * @zh 垂直方向布局方式。
   */

  var VerticalDirection;

  (function (VerticalDirection) {
    VerticalDirection[VerticalDirection["BOTTOM_TO_TOP"] = 0] = "BOTTOM_TO_TOP";
    VerticalDirection[VerticalDirection["TOP_TO_BOTTOM"] = 1] = "TOP_TO_BOTTOM";
  })(VerticalDirection || (VerticalDirection = {}));

  (0, _enum.ccenum)(VerticalDirection);
  /**
   * @en Enum for horizontal layout direction.
   *
   * @zh 水平方向布局方式。
   */

  var HorizontalDirection;

  (function (HorizontalDirection) {
    HorizontalDirection[HorizontalDirection["LEFT_TO_RIGHT"] = 0] = "LEFT_TO_RIGHT";
    HorizontalDirection[HorizontalDirection["RIGHT_TO_LEFT"] = 1] = "RIGHT_TO_LEFT";
  })(HorizontalDirection || (HorizontalDirection = {}));

  (0, _enum.ccenum)(HorizontalDirection);

  var _tempPos = new _index2.Vec3();

  var _tempScale = new _index2.Vec3();
  /**
   * @en
   * The Layout is a container component, use it to arrange child elements easily.<br>
   * Note：<br>
   * 1.Scaling and rotation of child nodes are not considered.<br>
   * 2.After setting the Layout, the results need to be updated until the next frame,unless you manually call.[[updateLayout]]
   *
   * @zh
   * Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
   * 注意：<br>
   * 1.不会考虑子节点的缩放和旋转。<br>
   * 2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用。[[updateLayout]]
   */


  var Layout = (_dec = (0, _index.ccclass)('cc.Layout'), _dec2 = (0, _index.help)('i18n:cc.Layout'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/Layout'), _dec5 = (0, _index.requireComponent)(_uiTransform.UITransform), _dec6 = (0, _index.type)(Type), _dec7 = (0, _index.tooltip)('自动布局模式，包括：\n 1. NONE，不会对子节点进行自动布局 \n 2. HORIZONTAL，横向自动排布子物体 \n 3. VERTICAL，垂直自动排布子物体\n 4. GRID, 采用网格方式对子物体自动进行布局'), _dec8 = (0, _index.type)(ResizeMode), _dec9 = (0, _index.tooltip)('缩放模式，包括：\n 1. NONE，不会对子节点和容器进行大小缩放 \n 2. CONTAINER, 对容器的大小进行缩放 \n 3. CHILDREN, 对子节点的大小进行缩放'), _dec10 = (0, _index.tooltip)('每个格子的大小，只有布局类型为 GRID 的时候才有效'), _dec11 = (0, _index.type)(AxisDirection), _dec12 = (0, _index.tooltip)('起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效'), _dec13 = (0, _index.tooltip)('容器内左边距，只会在一个布局方向上生效'), _dec14 = (0, _index.tooltip)('容器内右边距，只会在一个布局方向上生效'), _dec15 = (0, _index.tooltip)('容器内上边距，只会在一个布局方向上生效'), _dec16 = (0, _index.tooltip)('容器内下边距，只会在一个布局方向上生效'), _dec17 = (0, _index.tooltip)('子节点之间的水平间距'), _dec18 = (0, _index.tooltip)('子节点之间的垂直间距'), _dec19 = (0, _index.type)(VerticalDirection), _dec20 = (0, _index.tooltip)('垂直排列子节点的方向'), _dec21 = (0, _index.type)(HorizontalDirection), _dec22 = (0, _index.tooltip)('水平排列子节点的方向'), _dec23 = (0, _index.tooltip)('容器内边距，该属性会在四个布局方向上生效'), _dec24 = (0, _index.tooltip)('子节点缩放比例是否影响布局'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(Layout, _Component);

    function Layout() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Layout);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Layout)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_resizeMode", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_N$layoutType", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_N$padding", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_cellSize", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_startAxis", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_paddingLeft", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_paddingRight", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_paddingTop", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_paddingBottom", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_spacingX", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_spacingY", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_verticalDirection", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_horizontalDirection", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_affectedByScale", _descriptor14, _assertThisInitialized(_this));

      _this._layoutSize = new _index2.Size(300, 200);
      _this._layoutDirty = true;
      _this._isAlign = false;
      return _this;
    }

    _createClass(Layout, [{
      key: "updateLayout",

      /**
       * @en
       * Perform the layout update.
       *
       * @zh
       * 立即执行更新布局。
       *
       * @example
       * ```ts
       * import { Layout, log } from 'cc';
       * layout.type = Layout.HORIZONTAL;
       * layout.node.addChild(childNode);
       * log(childNode.x); // not yet changed
       * layout.updateLayout();
       * log(childNode.x); // changed
       * ```
       */
      value: function updateLayout() {
        if (this._layoutDirty && this.node.children.length > 0) {
          this._doLayout();

          this._layoutDirty = false;
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._addEventListeners();

        var trans = this.node._uiProps.uiTransformComp;

        if (trans.contentSize.equals(_index2.Size.ZERO)) {
          trans.setContentSize(this._layoutSize);
        }

        if (this._N$padding !== 0) {
          this._migratePaddingData();
        }

        this._doLayoutDirty();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._removeEventListeners();
      }
    }, {
      key: "_migratePaddingData",
      value: function _migratePaddingData() {
        this._paddingLeft = this._N$padding;
        this._paddingRight = this._N$padding;
        this._paddingTop = this._N$padding;
        this._paddingBottom = this._N$padding;
        this._N$padding = 0;
      }
    }, {
      key: "_addEventListeners",
      value: function _addEventListeners() {
        _director.director.on(_director.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);

        this.node.on(NodeEvent.SIZE_CHANGED, this._resized, this);
        this.node.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.on(NodeEvent.CHILD_ADDED, this._childAdded, this);
        this.node.on(NodeEvent.CHILD_REMOVED, this._childRemoved, this); // this.node.on(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);

        this._addChildrenEventListeners();
      }
    }, {
      key: "_removeEventListeners",
      value: function _removeEventListeners() {
        _director.director.off(_director.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);

        this.node.off(NodeEvent.SIZE_CHANGED, this._resized, this);
        this.node.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.off(NodeEvent.CHILD_ADDED, this._childAdded, this);
        this.node.off(NodeEvent.CHILD_REMOVED, this._childRemoved, this); // this.node.off(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);

        this._removeChildrenEventListeners();
      }
    }, {
      key: "_addChildrenEventListeners",
      value: function _addChildrenEventListeners() {
        var children = this.node.children;

        for (var i = 0; i < children.length; ++i) {
          var child = children[i];
          child.on(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
          child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
          child.on(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
          child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
          child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
      }
    }, {
      key: "_removeChildrenEventListeners",
      value: function _removeChildrenEventListeners() {
        var children = this.node.children;

        for (var i = 0; i < children.length; ++i) {
          var child = children[i];
          child.off(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
          child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
          child.off(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
          child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
          child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
      }
    }, {
      key: "_childAdded",
      value: function _childAdded(child) {
        child.on(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
        child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
        child.on(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
        child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
      }
    }, {
      key: "_childRemoved",
      value: function _childRemoved(child) {
        child.off(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
        child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
        child.off(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
        child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
      }
    }, {
      key: "_resized",
      value: function _resized() {
        this._layoutSize.set(this.node._uiProps.uiTransformComp.contentSize);

        this._doLayoutDirty();
      }
    }, {
      key: "_doLayoutHorizontally",
      value: function _doLayoutHorizontally(baseWidth, rowBreak, fnPositionY, applyChildren) {
        var trans = this.node._uiProps.uiTransformComp;
        var layoutAnchor = trans.anchorPoint;
        var children = this.node.children;
        var sign = 1;
        var paddingX = this._paddingLeft;
        var startPos = -layoutAnchor.x * baseWidth;

        if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
          sign = -1;
          startPos = (1 - layoutAnchor.x) * baseWidth;
          paddingX = this._paddingRight;
        }

        var nextX = startPos + sign * paddingX - sign * this._spacingX;
        var rowMaxHeight = 0;
        var tempMaxHeight = 0;
        var secondMaxHeight = 0;
        var row = 0;
        var containerResizeBoundary = 0;
        var maxHeightChildAnchorY = 0;
        var activeChildCount = 0;

        for (var i = 0; i < children.length; ++i) {
          if (children[i].activeInHierarchy) {
            activeChildCount++;
          }
        }

        var newChildWidth = this._cellSize.width;

        if (this._N$layoutType !== Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
          newChildWidth = (baseWidth - (this._paddingLeft + this._paddingRight) - (activeChildCount - 1) * this._spacingX) / activeChildCount;
        }

        for (var _i = 0; _i < children.length; ++_i) {
          var child = children[_i];
          var childTrans = child._uiProps.uiTransformComp;

          if (!child.activeInHierarchy || !childTrans) {
            continue;
          }

          child.getScale(_tempScale);

          var childScaleX = this._getUsedScaleValue(_tempScale.x);

          var childScaleY = this._getUsedScaleValue(_tempScale.y); // for resizing children


          if (this._resizeMode === ResizeMode.CHILDREN) {
            childTrans.width = newChildWidth / childScaleX;

            if (this._N$layoutType === Type.GRID) {
              childTrans.height = this._cellSize.height / childScaleY;
            }
          }

          var anchorX = childTrans.anchorX;
          var childBoundingBoxWidth = childTrans.width * childScaleX;
          var childBoundingBoxHeight = childTrans.height * childScaleY;

          if (secondMaxHeight > tempMaxHeight) {
            tempMaxHeight = secondMaxHeight;
          }

          if (childBoundingBoxHeight >= tempMaxHeight) {
            secondMaxHeight = tempMaxHeight;
            tempMaxHeight = childBoundingBoxHeight;
            maxHeightChildAnchorY = childTrans.anchorY;
          }

          if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            anchorX = 1 - childTrans.anchorX;
          }

          nextX = nextX + sign * anchorX * childBoundingBoxWidth + sign * this._spacingX;
          var rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;

          if (rowBreak) {
            var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this._paddingRight : this._paddingLeft);
            var leftToRightRowBreak = false;

            if (this._horizontalDirection === HorizontalDirection.LEFT_TO_RIGHT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth) {
              leftToRightRowBreak = true;
            }

            var rightToLeftRowBreak = false;

            if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth) {
              rightToLeftRowBreak = true;
            }

            if (leftToRightRowBreak || rightToLeftRowBreak) {
              if (childBoundingBoxHeight >= tempMaxHeight) {
                if (secondMaxHeight === 0) {
                  secondMaxHeight = tempMaxHeight;
                }

                rowMaxHeight += secondMaxHeight;
                secondMaxHeight = tempMaxHeight;
              } else {
                rowMaxHeight += tempMaxHeight;
                secondMaxHeight = childBoundingBoxHeight;
                tempMaxHeight = 0;
              }

              nextX = startPos + sign * (paddingX + anchorX * childBoundingBoxWidth);
              row++;
            }
          }

          var finalPositionY = fnPositionY(child, childTrans, rowMaxHeight, row);

          if (baseWidth >= childBoundingBoxWidth + this._paddingLeft + this._paddingRight) {
            if (applyChildren) {
              child.getPosition(_tempPos);
              child.setPosition(nextX, finalPositionY, _tempPos.z);
            }
          }

          var signX = 1;
          var tempFinalPositionY = void 0;
          var topMargin = tempMaxHeight === 0 ? childBoundingBoxHeight : tempMaxHeight;

          if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            containerResizeBoundary = containerResizeBoundary || trans.height;
            signX = -1;
            tempFinalPositionY = finalPositionY + signX * (topMargin * maxHeightChildAnchorY + this._paddingBottom);

            if (tempFinalPositionY < containerResizeBoundary) {
              containerResizeBoundary = tempFinalPositionY;
            }
          } else {
            containerResizeBoundary = containerResizeBoundary || -trans.height;
            tempFinalPositionY = finalPositionY + signX * (topMargin * maxHeightChildAnchorY + this._paddingTop);

            if (tempFinalPositionY > containerResizeBoundary) {
              containerResizeBoundary = tempFinalPositionY;
            }
          }

          nextX += rightBoundaryOfChild;
        }

        return containerResizeBoundary;
      }
    }, {
      key: "_doLayoutVertically",
      value: function _doLayoutVertically(baseHeight, columnBreak, fnPositionX, applyChildren) {
        var trans = this.node._uiProps.uiTransformComp;
        var layoutAnchor = trans.anchorPoint;
        var children = this.node.children;
        var sign = 1;
        var paddingY = this._paddingBottom;
        var bottomBoundaryOfLayout = -layoutAnchor.y * baseHeight;

        if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
          sign = -1;
          bottomBoundaryOfLayout = (1 - layoutAnchor.y) * baseHeight;
          paddingY = this._paddingTop;
        }

        var nextY = bottomBoundaryOfLayout + sign * paddingY - sign * this._spacingY;
        var columnMaxWidth = 0;
        var tempMaxWidth = 0;
        var secondMaxWidth = 0;
        var column = 0;
        var containerResizeBoundary = 0;
        var maxWidthChildAnchorX = 0;
        var activeChildCount = 0;

        for (var i = 0; i < children.length; ++i) {
          if (children[i].activeInHierarchy) {
            activeChildCount++;
          }
        }

        var newChildHeight = this._cellSize.height;

        if (this._N$layoutType !== Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
          newChildHeight = (baseHeight - (this._paddingTop + this._paddingBottom) - (activeChildCount - 1) * this._spacingY) / activeChildCount;
        }

        for (var _i2 = 0; _i2 < children.length; ++_i2) {
          var child = children[_i2];

          if (!child) {
            continue;
          }

          var scale = child.getScale();

          var childScaleX = this._getUsedScaleValue(scale.x);

          var childScaleY = this._getUsedScaleValue(scale.y);

          var childTrans = child._uiProps.uiTransformComp;

          if (!child.activeInHierarchy || !childTrans) {
            continue;
          } // for resizing children


          if (this._resizeMode === ResizeMode.CHILDREN) {
            childTrans.height = newChildHeight / childScaleY;

            if (this._N$layoutType === Type.GRID) {
              childTrans.width = this._cellSize.width / childScaleX;
            }
          }

          var anchorY = childTrans.anchorY;
          var childBoundingBoxWidth = childTrans.width * childScaleX;
          var childBoundingBoxHeight = childTrans.height * childScaleY;

          if (secondMaxWidth > tempMaxWidth) {
            tempMaxWidth = secondMaxWidth;
          }

          if (childBoundingBoxWidth >= tempMaxWidth) {
            secondMaxWidth = tempMaxWidth;
            tempMaxWidth = childBoundingBoxWidth;
            maxWidthChildAnchorX = childTrans.anchorX;
          }

          if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            anchorY = 1 - childTrans.anchorY;
          }

          nextY = nextY + sign * anchorY * childBoundingBoxHeight + sign * this._spacingY;
          var topBoundaryOfChild = sign * (1 - anchorY) * childBoundingBoxHeight;

          if (columnBreak) {
            var columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this._paddingTop : this._paddingBottom);
            var bottomToTopColumnBreak = false;

            if (this._verticalDirection === VerticalDirection.BOTTOM_TO_TOP && columnBreakBoundary > (1 - layoutAnchor.y) * baseHeight) {
              bottomToTopColumnBreak = true;
            }

            var topToBottomColumnBreak = false;

            if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM && columnBreakBoundary < -layoutAnchor.y * baseHeight) {
              topToBottomColumnBreak = true;
            }

            if (bottomToTopColumnBreak || topToBottomColumnBreak) {
              if (childBoundingBoxWidth >= tempMaxWidth) {
                if (secondMaxWidth === 0) {
                  secondMaxWidth = tempMaxWidth;
                }

                columnMaxWidth += secondMaxWidth;
                secondMaxWidth = tempMaxWidth;
              } else {
                columnMaxWidth += tempMaxWidth;
                secondMaxWidth = childBoundingBoxWidth;
                tempMaxWidth = 0;
              }

              nextY = bottomBoundaryOfLayout + sign * (paddingY + anchorY * childBoundingBoxHeight);
              column++;
            }
          }

          var finalPositionX = fnPositionX(child, childTrans, columnMaxWidth, column);

          if (baseHeight >= childBoundingBoxHeight + (this._paddingTop + this._paddingBottom)) {
            if (applyChildren) {
              child.getPosition(_tempPos);
              child.setPosition(finalPositionX, nextY, _tempPos.z);
            }
          }

          var signX = 1;
          var tempFinalPositionX = void 0; // when the item is the last column break item, the tempMaxWidth will be 0.

          var rightMargin = tempMaxWidth === 0 ? childBoundingBoxWidth : tempMaxWidth;

          if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            signX = -1;
            containerResizeBoundary = containerResizeBoundary || trans.width;
            tempFinalPositionX = finalPositionX + signX * (rightMargin * maxWidthChildAnchorX + this._paddingLeft);

            if (tempFinalPositionX < containerResizeBoundary) {
              containerResizeBoundary = tempFinalPositionX;
            }
          } else {
            containerResizeBoundary = containerResizeBoundary || -trans.width;
            tempFinalPositionX = finalPositionX + signX * (rightMargin * maxWidthChildAnchorX + this._paddingRight);

            if (tempFinalPositionX > containerResizeBoundary) {
              containerResizeBoundary = tempFinalPositionX;
            }
          }

          nextY += topBoundaryOfChild;
        }

        return containerResizeBoundary;
      }
    }, {
      key: "_doLayoutBasic",
      value: function _doLayoutBasic() {
        var children = this.node.children;
        var allChildrenBoundingBox = null;

        for (var i = 0; i < children.length; ++i) {
          var child = children[i];
          var childTransform = child._uiProps.uiTransformComp;

          if (!childTransform) {
            continue;
          }

          if (child.activeInHierarchy) {
            if (!allChildrenBoundingBox) {
              allChildrenBoundingBox = childTransform.getBoundingBoxToWorld();
            } else {
              _index2.Rect.union(allChildrenBoundingBox, allChildrenBoundingBox, childTransform.getBoundingBoxToWorld());
            }
          }
        }

        if (allChildrenBoundingBox) {
          var parentTransform = this.node.parent.getComponent(_uiTransform.UITransform);

          if (!parentTransform) {
            return;
          }

          _index2.Vec3.set(_tempPos, allChildrenBoundingBox.x, allChildrenBoundingBox.y, 0);

          var leftBottomInParentSpace = new _index2.Vec3();
          parentTransform.convertToNodeSpaceAR(_tempPos, leftBottomInParentSpace);

          _index2.Vec3.set(leftBottomInParentSpace, leftBottomInParentSpace.x - this._paddingLeft, leftBottomInParentSpace.y - this._paddingBottom, leftBottomInParentSpace.z);

          _index2.Vec3.set(_tempPos, allChildrenBoundingBox.x + allChildrenBoundingBox.width, allChildrenBoundingBox.y + allChildrenBoundingBox.height, 0);

          var rightTopInParentSpace = new _index2.Vec3();
          parentTransform.convertToNodeSpaceAR(_tempPos, rightTopInParentSpace);

          _index2.Vec3.set(rightTopInParentSpace, rightTopInParentSpace.x + this._paddingRight, rightTopInParentSpace.y + this._paddingTop, rightTopInParentSpace.z);

          var newSize = _globalExports.legacyCC.size(parseFloat((rightTopInParentSpace.x - leftBottomInParentSpace.x).toFixed(2)), parseFloat((rightTopInParentSpace.y - leftBottomInParentSpace.y).toFixed(2)));

          this.node.getPosition(_tempPos);
          var trans = this.node._uiProps.uiTransformComp;

          if (newSize.width !== 0) {
            var newAnchorX = (_tempPos.x - leftBottomInParentSpace.x) / newSize.width;
            trans.anchorX = parseFloat(newAnchorX.toFixed(2));
          }

          if (newSize.height !== 0) {
            var newAnchorY = (_tempPos.y - leftBottomInParentSpace.y) / newSize.height;
            trans.anchorY = parseFloat(newAnchorY.toFixed(2));
          }

          trans.setContentSize(newSize);
        }
      }
    }, {
      key: "_doLayoutGridAxisHorizontal",
      value: function _doLayoutGridAxisHorizontal(layoutAnchor, layoutSize) {
        var _this2 = this;

        var baseWidth = layoutSize.width;
        var sign = 1;
        var bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;
        var paddingY = this._paddingBottom;

        if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
          sign = -1;
          bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
          paddingY = this._paddingTop;
        }

        var self = this;

        var fnPositionY = function fnPositionY(child, childTrans, topOffset, row) {
          return bottomBoundaryOfLayout + sign * (topOffset + childTrans.anchorY * childTrans.height * self._getUsedScaleValue(child.getScale().y) + paddingY + row * _this2._spacingY);
        };

        var newHeight = 0;

        if (this._resizeMode === ResizeMode.CONTAINER) {
          // calculate the new height of container, it won't change the position of it's children
          var boundary = this._doLayoutHorizontally(baseWidth, true, fnPositionY, false);

          newHeight = bottomBoundaryOfLayout - boundary;

          if (newHeight < 0) {
            newHeight *= -1;
          }

          bottomBoundaryOfLayout = -layoutAnchor.y * newHeight;

          if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * newHeight;
          }
        }

        this._doLayoutHorizontally(baseWidth, true, fnPositionY, true);

        if (this._resizeMode === ResizeMode.CONTAINER) {
          this.node._uiProps.uiTransformComp.setContentSize(baseWidth, newHeight);
        }
      }
    }, {
      key: "_doLayoutGridAxisVertical",
      value: function _doLayoutGridAxisVertical(layoutAnchor, layoutSize) {
        var _this3 = this;

        var baseHeight = layoutSize.height;
        var sign = 1;
        var leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;
        var paddingX = this._paddingLeft;

        if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
          sign = -1;
          leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
          paddingX = this._paddingRight;
        }

        var self = this;

        var fnPositionX = function fnPositionX(child, childTrans, leftOffset, column) {
          return leftBoundaryOfLayout + sign * (leftOffset + childTrans.anchorX * childTrans.width * self._getUsedScaleValue(child.getScale().x) + paddingX + column * _this3._spacingX);
        };

        var newWidth = 0;

        if (this._resizeMode === ResizeMode.CONTAINER) {
          var boundary = this._doLayoutVertically(baseHeight, true, fnPositionX, false);

          newWidth = leftBoundaryOfLayout - boundary;

          if (newWidth < 0) {
            newWidth *= -1;
          }

          leftBoundaryOfLayout = -layoutAnchor.x * newWidth;

          if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * newWidth;
          }
        }

        this._doLayoutVertically(baseHeight, true, fnPositionX, true);

        if (this._resizeMode === ResizeMode.CONTAINER) {
          this.node._uiProps.uiTransformComp.setContentSize(newWidth, baseHeight);
        }
      }
    }, {
      key: "_doLayoutGrid",
      value: function _doLayoutGrid() {
        var trans = this.node._uiProps.uiTransformComp;
        var layoutAnchor = trans.anchorPoint;
        var layoutSize = trans.contentSize;

        if (this.startAxis === AxisDirection.HORIZONTAL) {
          this._doLayoutGridAxisHorizontal(layoutAnchor, layoutSize);
        } else if (this.startAxis === AxisDirection.VERTICAL) {
          this._doLayoutGridAxisVertical(layoutAnchor, layoutSize);
        }
      }
    }, {
      key: "_getHorizontalBaseWidth",
      value: function _getHorizontalBaseWidth(children) {
        var newWidth = 0;
        var activeChildCount = 0;

        if (this._resizeMode === ResizeMode.CONTAINER) {
          for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.getScale(_tempScale);
            var childTrans = child._uiProps.uiTransformComp;

            if (child.activeInHierarchy && childTrans) {
              activeChildCount++;
              newWidth += childTrans.width * this._getUsedScaleValue(_tempScale.x);
            }
          }

          newWidth += (activeChildCount - 1) * this._spacingX + this._paddingLeft + this._paddingRight;
        } else {
          newWidth = this.node._uiProps.uiTransformComp.width;
        }

        return newWidth;
      }
    }, {
      key: "_getVerticalBaseHeight",
      value: function _getVerticalBaseHeight(children) {
        var newHeight = 0;
        var activeChildCount = 0;

        if (this._resizeMode === ResizeMode.CONTAINER) {
          for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.getScale(_tempScale);
            var childTrans = child._uiProps.uiTransformComp;

            if (child.activeInHierarchy && childTrans) {
              activeChildCount++;
              newHeight += childTrans.height * this._getUsedScaleValue(_tempScale.y);
            }
          }

          newHeight += (activeChildCount - 1) * this._spacingY + this._paddingBottom + this._paddingTop;
        } else {
          newHeight = this.node._uiProps.uiTransformComp.height;
        }

        return newHeight;
      }
    }, {
      key: "_doLayout",
      value: function _doLayout() {
        var _this4 = this;

        if (this._N$layoutType === Type.HORIZONTAL) {
          var newWidth = this._getHorizontalBaseWidth(this.node.children);

          var fnPositionY = function fnPositionY(child) {
            var pos = _this4._isAlign ? _index2.Vec3.ZERO : child.position;
            return pos.y;
          };

          this._doLayoutHorizontally(newWidth, false, fnPositionY, true);

          this._isAlign = false;
          this.node._uiProps.uiTransformComp.width = newWidth;
        } else if (this._N$layoutType === Type.VERTICAL) {
          var newHeight = this._getVerticalBaseHeight(this.node.children);

          var fnPositionX = function fnPositionX(child) {
            var pos = _this4._isAlign ? _index2.Vec3.ZERO : child.position;
            return pos.x;
          };

          this._doLayoutVertically(newHeight, false, fnPositionX, true);

          this._isAlign = false;
          this.node._uiProps.uiTransformComp.height = newHeight;
        } else if (this._N$layoutType === Type.NONE) {
          if (this._resizeMode === ResizeMode.CONTAINER) {
            this._doLayoutBasic();
          }
        } else if (this._N$layoutType === Type.GRID) {
          this._doLayoutGrid();
        }
      }
    }, {
      key: "_getUsedScaleValue",
      value: function _getUsedScaleValue(value) {
        return this._affectedByScale ? Math.abs(value) : 1;
      }
    }, {
      key: "_transformDirty",
      value: function _transformDirty(type) {
        if (!(type & _nodeEnum.TransformBit.POSITION)) {
          return;
        }

        this._doLayoutDirty();
      }
    }, {
      key: "_doLayoutDirty",
      value: function _doLayoutDirty() {
        this._layoutDirty = true;
      }
    }, {
      key: "_doScaleDirty",
      value: function _doScaleDirty(type) {
        if (type & _nodeEnum.TransformBit.SCALE) {
          this._layoutDirty = this._layoutDirty || this._affectedByScale;
        }
      }
    }, {
      key: "type",

      /**
       * @en
       * The layout type.
       *
       * @zh
       * 布局类型。
       */
      get: function get() {
        return this._N$layoutType;
      },
      set: function set(value) {
        this._N$layoutType = value;

        if (_defaultConstants.EDITOR && this._N$layoutType !== Type.NONE && this._resizeMode === ResizeMode.CONTAINER
        /*&& !cc.engine.isPlaying*/
        ) {// const reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
            // if (reLayouted) {
            //     return;
            // }
          }

        this._isAlign = true;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The are three resize modes for Layout. None, resize Container and resize children.
       *
       * @zh
       * 缩放模式。
       */

    }, {
      key: "resizeMode",
      get: function get() {
        return this._resizeMode;
      },
      set: function set(value) {
        if (this._N$layoutType === Type.NONE && value === ResizeMode.CHILDREN) {
          return;
        }

        this._resizeMode = value;

        if (_defaultConstants.EDITOR && value === ResizeMode.CONTAINER
        /*&& !cc.engine.isPlaying*/
        ) {// const reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
            // if (reLayouted) {
            //     return;
            // }
          }

        this._doLayoutDirty();
      }
      /**
       * @en
       * The cell size for grid layout.
       *
       * @zh
       * 每个格子的大小，只有布局类型为 GRID 的时候才有效。
       */

    }, {
      key: "cellSize",
      get: function get() {
        return this._cellSize;
      },
      set: function set(value) {
        if (this._cellSize === value) {
          return;
        }

        this._cellSize.set(value);

        this._doLayoutDirty();
      }
      /**
       * @en
       * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
       * and then break line on demand. Choose vertical if you want to layout vertically at first .
       *
       * @zh
       * 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。
       */

    }, {
      key: "startAxis",
      get: function get() {
        return this._startAxis;
      },
      set: function set(value) {
        if (this._startAxis === value) {
          return;
        }

        if (_defaultConstants.EDITOR && this._resizeMode === ResizeMode.CONTAINER && !_globalExports.legacyCC.GAME_VIEW) {// const reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
          // if (reLayouted) {
          //     return;
          // }
        }

        this._startAxis = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The left padding of layout, it only effect the layout in one direction.
       *
       * @zh
       * 容器内左边距，只会在一个布局方向上生效。
       */

    }, {
      key: "paddingLeft",
      get: function get() {
        return this._paddingLeft;
      },
      set: function set(value) {
        if (this._paddingLeft === value) {
          return;
        }

        this._paddingLeft = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The right padding of layout, it only effect the layout in one direction.
       *
       * @zh
       * 容器内右边距，只会在一个布局方向上生效。
       */

    }, {
      key: "paddingRight",
      get: function get() {
        return this._paddingRight;
      },
      set: function set(value) {
        if (this._paddingRight === value) {
          return;
        }

        this._paddingRight = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The top padding of layout, it only effect the layout in one direction.
       *
       * @zh
       * 容器内上边距，只会在一个布局方向上生效。
       */

    }, {
      key: "paddingTop",
      get: function get() {
        return this._paddingTop;
      },
      set: function set(value) {
        if (this._paddingTop === value) {
          return;
        }

        this._paddingTop = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The bottom padding of layout, it only effect the layout in one direction.
       *
       * @zh
       * 容器内下边距，只会在一个布局方向上生效。
       */

    }, {
      key: "paddingBottom",
      get: function get() {
        return this._paddingBottom;
      },
      set: function set(value) {
        if (this._paddingBottom === value) {
          return;
        }

        this._paddingBottom = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The distance in x-axis between each element in layout.
       *
       * @zh
       * 子节点之间的水平间距。
       */

    }, {
      key: "spacingX",
      get: function get() {
        return this._spacingX;
      },
      set: function set(value) {
        if (this._spacingX === value) {
          return;
        }

        this._spacingX = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The distance in y-axis between each element in layout.
       *
       * @zh
       * 子节点之间的垂直间距。
       */

    }, {
      key: "spacingY",
      get: function get() {
        return this._spacingY;
      },
      set: function set(value) {
        if (this._spacingY === value) {
          return;
        }

        this._spacingY = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * Only take effect in Vertical layout mode.
       * This option changes the start element's positioning.
       *
       * @zh
       * 垂直排列子节点的方向。
       */

    }, {
      key: "verticalDirection",
      get: function get() {
        return this._verticalDirection;
      },
      set: function set(value) {
        if (this._verticalDirection === value) {
          return;
        }

        this._verticalDirection = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * Only take effect in horizontal layout mode.
       * This option changes the start element's positioning.
       *
       * @zh
       * 水平排列子节点的方向。
       */

    }, {
      key: "horizontalDirection",
      get: function get() {
        return this._horizontalDirection;
      },
      set: function set(value) {
        if (this._horizontalDirection === value) {
          return;
        }

        this._horizontalDirection = value;

        this._doLayoutDirty();
      }
      /**
       * @en
       * The padding of layout, it will effect the layout in horizontal and vertical direction.
       *
       * @zh
       * 容器内边距，该属性会在四个布局方向上生效。
       */

    }, {
      key: "padding",
      get: function get() {
        return this._paddingLeft;
      },
      set: function set(value) {
        this._N$padding = value;

        this._migratePaddingData();

        this._doLayoutDirty();
      }
      /**
       * @en
       * Adjust the layout if the children scaled.
       *
       * @zh
       * 子节点缩放比例是否影响布局。
       */

    }, {
      key: "affectedByScale",
      get: function get() {
        return this._affectedByScale;
      },
      set: function set(value) {
        this._affectedByScale = value;

        this._doLayoutDirty();
      }
    }]);

    return Layout;
  }(_component.Component), _class3.Type = Type, _class3.VerticalDirection = VerticalDirection, _class3.HorizontalDirection = HorizontalDirection, _class3.ResizeMode = ResizeMode, _class3.AxisDirection = AxisDirection, _temp), (_applyDecoratedDescriptor(_class2.prototype, "type", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "resizeMode", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "resizeMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cellSize", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "cellSize"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "startAxis", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "startAxis"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "paddingLeft", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "paddingLeft"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "paddingRight", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "paddingRight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "paddingTop", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "paddingTop"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "paddingBottom", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "paddingBottom"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spacingX", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "spacingX"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spacingY", [_dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "spacingY"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "verticalDirection", [_dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "verticalDirection"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "horizontalDirection", [_dec21, _dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "horizontalDirection"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "padding", [_dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "padding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "affectedByScale", [_dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "affectedByScale"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_resizeMode", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return ResizeMode.NONE;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_N$layoutType", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Type.NONE;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_N$padding", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_cellSize", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Size(40, 40);
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_startAxis", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return AxisDirection.HORIZONTAL;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_paddingLeft", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_paddingRight", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_paddingTop", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_paddingBottom", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_spacingX", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_spacingY", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_verticalDirection", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return VerticalDirection.TOP_TO_BOTTOM;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_horizontalDirection", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return HorizontalDirection.LEFT_TO_RIGHT;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_affectedByScale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.Layout = Layout;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvbGF5b3V0LnRzIl0sIm5hbWVzIjpbIk5vZGVFdmVudCIsIlN5c3RlbUV2ZW50VHlwZSIsIlR5cGUiLCJSZXNpemVNb2RlIiwiQXhpc0RpcmVjdGlvbiIsIlZlcnRpY2FsRGlyZWN0aW9uIiwiSG9yaXpvbnRhbERpcmVjdGlvbiIsIl90ZW1wUG9zIiwiVmVjMyIsIl90ZW1wU2NhbGUiLCJMYXlvdXQiLCJVSVRyYW5zZm9ybSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2xheW91dFNpemUiLCJTaXplIiwiX2xheW91dERpcnR5IiwiX2lzQWxpZ24iLCJub2RlIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJfZG9MYXlvdXQiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJ0cmFucyIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwiY29udGVudFNpemUiLCJlcXVhbHMiLCJaRVJPIiwic2V0Q29udGVudFNpemUiLCJfTiRwYWRkaW5nIiwiX21pZ3JhdGVQYWRkaW5nRGF0YSIsIl9kb0xheW91dERpcnR5IiwiX3JlbW92ZUV2ZW50TGlzdGVuZXJzIiwiX3BhZGRpbmdMZWZ0IiwiX3BhZGRpbmdSaWdodCIsIl9wYWRkaW5nVG9wIiwiX3BhZGRpbmdCb3R0b20iLCJkaXJlY3RvciIsIm9uIiwiRGlyZWN0b3IiLCJFVkVOVF9BRlRFUl9VUERBVEUiLCJ1cGRhdGVMYXlvdXQiLCJTSVpFX0NIQU5HRUQiLCJfcmVzaXplZCIsIkFOQ0hPUl9DSEFOR0VEIiwiQ0hJTERfQURERUQiLCJfY2hpbGRBZGRlZCIsIkNISUxEX1JFTU9WRUQiLCJfY2hpbGRSZW1vdmVkIiwiX2FkZENoaWxkcmVuRXZlbnRMaXN0ZW5lcnMiLCJvZmYiLCJfcmVtb3ZlQ2hpbGRyZW5FdmVudExpc3RlbmVycyIsImkiLCJjaGlsZCIsIlRSQU5TRk9STV9DSEFOR0VEIiwiX2RvU2NhbGVEaXJ0eSIsIl90cmFuc2Zvcm1EaXJ0eSIsInNldCIsImJhc2VXaWR0aCIsInJvd0JyZWFrIiwiZm5Qb3NpdGlvblkiLCJhcHBseUNoaWxkcmVuIiwibGF5b3V0QW5jaG9yIiwiYW5jaG9yUG9pbnQiLCJzaWduIiwicGFkZGluZ1giLCJzdGFydFBvcyIsIngiLCJfaG9yaXpvbnRhbERpcmVjdGlvbiIsIlJJR0hUX1RPX0xFRlQiLCJuZXh0WCIsIl9zcGFjaW5nWCIsInJvd01heEhlaWdodCIsInRlbXBNYXhIZWlnaHQiLCJzZWNvbmRNYXhIZWlnaHQiLCJyb3ciLCJjb250YWluZXJSZXNpemVCb3VuZGFyeSIsIm1heEhlaWdodENoaWxkQW5jaG9yWSIsImFjdGl2ZUNoaWxkQ291bnQiLCJhY3RpdmVJbkhpZXJhcmNoeSIsIm5ld0NoaWxkV2lkdGgiLCJfY2VsbFNpemUiLCJ3aWR0aCIsIl9OJGxheW91dFR5cGUiLCJHUklEIiwiX3Jlc2l6ZU1vZGUiLCJDSElMRFJFTiIsImNoaWxkVHJhbnMiLCJnZXRTY2FsZSIsImNoaWxkU2NhbGVYIiwiX2dldFVzZWRTY2FsZVZhbHVlIiwiY2hpbGRTY2FsZVkiLCJ5IiwiaGVpZ2h0IiwiYW5jaG9yWCIsImNoaWxkQm91bmRpbmdCb3hXaWR0aCIsImNoaWxkQm91bmRpbmdCb3hIZWlnaHQiLCJhbmNob3JZIiwicmlnaHRCb3VuZGFyeU9mQ2hpbGQiLCJyb3dCcmVha0JvdW5kYXJ5IiwibGVmdFRvUmlnaHRSb3dCcmVhayIsIkxFRlRfVE9fUklHSFQiLCJyaWdodFRvTGVmdFJvd0JyZWFrIiwiZmluYWxQb3NpdGlvblkiLCJnZXRQb3NpdGlvbiIsInNldFBvc2l0aW9uIiwieiIsInNpZ25YIiwidGVtcEZpbmFsUG9zaXRpb25ZIiwidG9wTWFyZ2luIiwiX3ZlcnRpY2FsRGlyZWN0aW9uIiwiVE9QX1RPX0JPVFRPTSIsImJhc2VIZWlnaHQiLCJjb2x1bW5CcmVhayIsImZuUG9zaXRpb25YIiwicGFkZGluZ1kiLCJib3R0b21Cb3VuZGFyeU9mTGF5b3V0IiwibmV4dFkiLCJfc3BhY2luZ1kiLCJjb2x1bW5NYXhXaWR0aCIsInRlbXBNYXhXaWR0aCIsInNlY29uZE1heFdpZHRoIiwiY29sdW1uIiwibWF4V2lkdGhDaGlsZEFuY2hvclgiLCJuZXdDaGlsZEhlaWdodCIsInNjYWxlIiwidG9wQm91bmRhcnlPZkNoaWxkIiwiY29sdW1uQnJlYWtCb3VuZGFyeSIsImJvdHRvbVRvVG9wQ29sdW1uQnJlYWsiLCJCT1RUT01fVE9fVE9QIiwidG9wVG9Cb3R0b21Db2x1bW5CcmVhayIsImZpbmFsUG9zaXRpb25YIiwidGVtcEZpbmFsUG9zaXRpb25YIiwicmlnaHRNYXJnaW4iLCJhbGxDaGlsZHJlbkJvdW5kaW5nQm94IiwiY2hpbGRUcmFuc2Zvcm0iLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJSZWN0IiwidW5pb24iLCJwYXJlbnRUcmFuc2Zvcm0iLCJwYXJlbnQiLCJnZXRDb21wb25lbnQiLCJsZWZ0Qm90dG9tSW5QYXJlbnRTcGFjZSIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwicmlnaHRUb3BJblBhcmVudFNwYWNlIiwibmV3U2l6ZSIsImxlZ2FjeUNDIiwic2l6ZSIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwibmV3QW5jaG9yWCIsIm5ld0FuY2hvclkiLCJsYXlvdXRTaXplIiwic2VsZiIsInRvcE9mZnNldCIsIm5ld0hlaWdodCIsIkNPTlRBSU5FUiIsImJvdW5kYXJ5IiwiX2RvTGF5b3V0SG9yaXpvbnRhbGx5IiwibGVmdEJvdW5kYXJ5T2ZMYXlvdXQiLCJsZWZ0T2Zmc2V0IiwibmV3V2lkdGgiLCJfZG9MYXlvdXRWZXJ0aWNhbGx5Iiwic3RhcnRBeGlzIiwiSE9SSVpPTlRBTCIsIl9kb0xheW91dEdyaWRBeGlzSG9yaXpvbnRhbCIsIlZFUlRJQ0FMIiwiX2RvTGF5b3V0R3JpZEF4aXNWZXJ0aWNhbCIsIl9nZXRIb3Jpem9udGFsQmFzZVdpZHRoIiwicG9zIiwicG9zaXRpb24iLCJfZ2V0VmVydGljYWxCYXNlSGVpZ2h0IiwiTk9ORSIsIl9kb0xheW91dEJhc2ljIiwiX2RvTGF5b3V0R3JpZCIsInZhbHVlIiwiX2FmZmVjdGVkQnlTY2FsZSIsIk1hdGgiLCJhYnMiLCJ0eXBlIiwiVHJhbnNmb3JtQml0IiwiUE9TSVRJT04iLCJTQ0FMRSIsIkVESVRPUiIsIl9zdGFydEF4aXMiLCJHQU1FX1ZJRVciLCJDb21wb25lbnQiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Q0EsTUFBTUEsU0FBUyxHQUFHQywwQkFBbEI7QUFDQTs7Ozs7O01BS0tDLEk7O2FBQUFBLEk7QUFBQUEsSUFBQUEsSSxDQUFBQSxJO0FBQUFBLElBQUFBLEksQ0FBQUEsSTtBQUFBQSxJQUFBQSxJLENBQUFBLEk7QUFBQUEsSUFBQUEsSSxDQUFBQSxJO0tBQUFBLEksS0FBQUEsSTs7QUE0Qkwsb0JBQU9BLElBQVA7QUFFQTs7Ozs7O01BS0tDLFU7O2FBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7S0FBQUEsVSxLQUFBQSxVOztBQXFCTCxvQkFBT0EsVUFBUDtBQUVBOzs7Ozs7TUFLS0MsYTs7YUFBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0tBQUFBLGEsS0FBQUEsYTs7QUFlTCxvQkFBT0EsYUFBUDtBQUVBOzs7Ozs7TUFLS0MsaUI7O2FBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0tBQUFBLGlCLEtBQUFBLGlCOztBQWNMLG9CQUFPQSxpQkFBUDtBQUVBOzs7Ozs7TUFLS0MsbUI7O2FBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0tBQUFBLG1CLEtBQUFBLG1COztBQWNMLG9CQUFPQSxtQkFBUDs7QUFFQSxNQUFNQyxRQUFRLEdBQUcsSUFBSUMsWUFBSixFQUFqQjs7QUFDQSxNQUFNQyxVQUFVLEdBQUcsSUFBSUQsWUFBSixFQUFuQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7TUFtQmFFLE0sV0FOWixvQkFBUSxXQUFSLEMsVUFDQSxpQkFBSyxnQkFBTCxDLFVBQ0EsMkJBQWUsR0FBZixDLFVBQ0EsaUJBQUssV0FBTCxDLFVBQ0EsNkJBQWlCQyx3QkFBakIsQyxVQVdJLGlCQUFLVCxJQUFMLEMsVUFDQSxvQkFBUSxtSEFBUixDLFVBeUJBLGlCQUFLQyxVQUFMLEMsVUFDQSxvQkFBUSw0RkFBUixDLFdBMEJBLG9CQUFRLDZCQUFSLEMsV0F1QkEsaUJBQUtDLGFBQUwsQyxXQUNBLG9CQUFRLDBDQUFSLEMsV0EyQkEsb0JBQVEscUJBQVIsQyxXQW9CQSxvQkFBUSxxQkFBUixDLFdBb0JBLG9CQUFRLHFCQUFSLEMsV0FvQkEsb0JBQVEscUJBQVIsQyxXQW9CQSxvQkFBUSxZQUFSLEMsV0FxQkEsb0JBQVEsWUFBUixDLFdBc0JBLGlCQUFLQyxpQkFBTCxDLFdBQ0Esb0JBQVEsWUFBUixDLFdBc0JBLGlCQUFLQyxtQkFBTCxDLFdBQ0Esb0JBQVEsWUFBUixDLFdBcUJBLG9CQUFRLHNCQUFSLEMsV0FtQkEsb0JBQVEsZUFBUixDLGdGQTdTSk0sd0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBMlZhQyxXLEdBQWMsSUFBSUMsWUFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEM7WUFDZEMsWSxHQUFlLEk7WUFDZkMsUSxHQUFXLEs7Ozs7Ozs7QUFFckI7Ozs7Ozs7Ozs7Ozs7Ozs7O3FDQWlCdUI7QUFDbkIsWUFBSSxLQUFLRCxZQUFMLElBQXFCLEtBQUtFLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsTUFBbkIsR0FBNEIsQ0FBckQsRUFBd0Q7QUFDcEQsZUFBS0MsU0FBTDs7QUFDQSxlQUFLTCxZQUFMLEdBQW9CLEtBQXBCO0FBQ0g7QUFDSjs7O2lDQUVxQjtBQUNsQixhQUFLTSxrQkFBTDs7QUFFQSxZQUFJQyxLQUFLLEdBQUcsS0FBS0wsSUFBTCxDQUFVTSxRQUFWLENBQW1CQyxlQUEvQjs7QUFDQSxZQUFJRixLQUFLLENBQUNHLFdBQU4sQ0FBa0JDLE1BQWxCLENBQXlCWixhQUFLYSxJQUE5QixDQUFKLEVBQXlDO0FBQ3JDTCxVQUFBQSxLQUFLLENBQUNNLGNBQU4sQ0FBcUIsS0FBS2YsV0FBMUI7QUFDSDs7QUFFRCxZQUFJLEtBQUtnQixVQUFMLEtBQW9CLENBQXhCLEVBQTJCO0FBQ3ZCLGVBQUtDLG1CQUFMO0FBQ0g7O0FBRUQsYUFBS0MsY0FBTDtBQUNIOzs7a0NBRXNCO0FBQ25CLGFBQUtDLHFCQUFMO0FBQ0g7Ozs0Q0FFZ0M7QUFDN0IsYUFBS0MsWUFBTCxHQUFvQixLQUFLSixVQUF6QjtBQUNBLGFBQUtLLGFBQUwsR0FBcUIsS0FBS0wsVUFBMUI7QUFDQSxhQUFLTSxXQUFMLEdBQW1CLEtBQUtOLFVBQXhCO0FBQ0EsYUFBS08sY0FBTCxHQUFzQixLQUFLUCxVQUEzQjtBQUNBLGFBQUtBLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSDs7OzJDQUUrQjtBQUM1QlEsMkJBQVNDLEVBQVQsQ0FBWUMsbUJBQVNDLGtCQUFyQixFQUF5QyxLQUFLQyxZQUE5QyxFQUE0RCxJQUE1RDs7QUFDQSxhQUFLeEIsSUFBTCxDQUFVcUIsRUFBVixDQUFhdEMsU0FBUyxDQUFDMEMsWUFBdkIsRUFBcUMsS0FBS0MsUUFBMUMsRUFBb0QsSUFBcEQ7QUFDQSxhQUFLMUIsSUFBTCxDQUFVcUIsRUFBVixDQUFhdEMsU0FBUyxDQUFDNEMsY0FBdkIsRUFBdUMsS0FBS2IsY0FBNUMsRUFBNEQsSUFBNUQ7QUFDQSxhQUFLZCxJQUFMLENBQVVxQixFQUFWLENBQWF0QyxTQUFTLENBQUM2QyxXQUF2QixFQUFvQyxLQUFLQyxXQUF6QyxFQUFzRCxJQUF0RDtBQUNBLGFBQUs3QixJQUFMLENBQVVxQixFQUFWLENBQWF0QyxTQUFTLENBQUMrQyxhQUF2QixFQUFzQyxLQUFLQyxhQUEzQyxFQUEwRCxJQUExRCxFQUw0QixDQU01Qjs7QUFDQSxhQUFLQywwQkFBTDtBQUNIOzs7OENBRWtDO0FBQy9CWiwyQkFBU2EsR0FBVCxDQUFhWCxtQkFBU0Msa0JBQXRCLEVBQTBDLEtBQUtDLFlBQS9DLEVBQTZELElBQTdEOztBQUNBLGFBQUt4QixJQUFMLENBQVVpQyxHQUFWLENBQWNsRCxTQUFTLENBQUMwQyxZQUF4QixFQUFzQyxLQUFLQyxRQUEzQyxFQUFxRCxJQUFyRDtBQUNBLGFBQUsxQixJQUFMLENBQVVpQyxHQUFWLENBQWNsRCxTQUFTLENBQUM0QyxjQUF4QixFQUF3QyxLQUFLYixjQUE3QyxFQUE2RCxJQUE3RDtBQUNBLGFBQUtkLElBQUwsQ0FBVWlDLEdBQVYsQ0FBY2xELFNBQVMsQ0FBQzZDLFdBQXhCLEVBQXFDLEtBQUtDLFdBQTFDLEVBQXVELElBQXZEO0FBQ0EsYUFBSzdCLElBQUwsQ0FBVWlDLEdBQVYsQ0FBY2xELFNBQVMsQ0FBQytDLGFBQXhCLEVBQXVDLEtBQUtDLGFBQTVDLEVBQTJELElBQTNELEVBTCtCLENBTS9COztBQUNBLGFBQUtHLDZCQUFMO0FBQ0g7OzttREFFdUM7QUFDcEMsWUFBTWpDLFFBQVEsR0FBRyxLQUFLRCxJQUFMLENBQVVDLFFBQTNCOztBQUNBLGFBQUssSUFBSWtDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdsQyxRQUFRLENBQUNDLE1BQTdCLEVBQXFDLEVBQUVpQyxDQUF2QyxFQUEwQztBQUN0QyxjQUFNQyxLQUFLLEdBQUduQyxRQUFRLENBQUNrQyxDQUFELENBQXRCO0FBQ0FDLFVBQUFBLEtBQUssQ0FBQ2YsRUFBTixDQUFTdEMsU0FBUyxDQUFDc0QsaUJBQW5CLEVBQXNDLEtBQUtDLGFBQTNDLEVBQTBELElBQTFEO0FBQ0FGLFVBQUFBLEtBQUssQ0FBQ2YsRUFBTixDQUFTdEMsU0FBUyxDQUFDMEMsWUFBbkIsRUFBaUMsS0FBS1gsY0FBdEMsRUFBc0QsSUFBdEQ7QUFDQXNCLFVBQUFBLEtBQUssQ0FBQ2YsRUFBTixDQUFTdEMsU0FBUyxDQUFDc0QsaUJBQW5CLEVBQXNDLEtBQUtFLGVBQTNDLEVBQTRELElBQTVEO0FBQ0FILFVBQUFBLEtBQUssQ0FBQ2YsRUFBTixDQUFTdEMsU0FBUyxDQUFDNEMsY0FBbkIsRUFBbUMsS0FBS2IsY0FBeEMsRUFBd0QsSUFBeEQ7QUFDQXNCLFVBQUFBLEtBQUssQ0FBQ2YsRUFBTixDQUFTLDZCQUFULEVBQXdDLEtBQUtQLGNBQTdDLEVBQTZELElBQTdEO0FBQ0g7QUFDSjs7O3NEQUUwQztBQUN2QyxZQUFNYixRQUFRLEdBQUcsS0FBS0QsSUFBTCxDQUFVQyxRQUEzQjs7QUFDQSxhQUFLLElBQUlrQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbEMsUUFBUSxDQUFDQyxNQUE3QixFQUFxQyxFQUFFaUMsQ0FBdkMsRUFBMEM7QUFDdEMsY0FBTUMsS0FBSyxHQUFHbkMsUUFBUSxDQUFDa0MsQ0FBRCxDQUF0QjtBQUNBQyxVQUFBQSxLQUFLLENBQUNILEdBQU4sQ0FBVWxELFNBQVMsQ0FBQ3NELGlCQUFwQixFQUF1QyxLQUFLQyxhQUE1QyxFQUEyRCxJQUEzRDtBQUNBRixVQUFBQSxLQUFLLENBQUNILEdBQU4sQ0FBVWxELFNBQVMsQ0FBQzBDLFlBQXBCLEVBQWtDLEtBQUtYLGNBQXZDLEVBQXVELElBQXZEO0FBQ0FzQixVQUFBQSxLQUFLLENBQUNILEdBQU4sQ0FBVWxELFNBQVMsQ0FBQ3NELGlCQUFwQixFQUF1QyxLQUFLRSxlQUE1QyxFQUE2RCxJQUE3RDtBQUNBSCxVQUFBQSxLQUFLLENBQUNILEdBQU4sQ0FBVWxELFNBQVMsQ0FBQzRDLGNBQXBCLEVBQW9DLEtBQUtiLGNBQXpDLEVBQXlELElBQXpEO0FBQ0FzQixVQUFBQSxLQUFLLENBQUNILEdBQU4sQ0FBVSw2QkFBVixFQUF5QyxLQUFLbkIsY0FBOUMsRUFBOEQsSUFBOUQ7QUFDSDtBQUNKOzs7a0NBRXNCc0IsSyxFQUFhO0FBQ2hDQSxRQUFBQSxLQUFLLENBQUNmLEVBQU4sQ0FBU3RDLFNBQVMsQ0FBQ3NELGlCQUFuQixFQUFzQyxLQUFLQyxhQUEzQyxFQUEwRCxJQUExRDtBQUNBRixRQUFBQSxLQUFLLENBQUNmLEVBQU4sQ0FBU3RDLFNBQVMsQ0FBQzBDLFlBQW5CLEVBQWlDLEtBQUtYLGNBQXRDLEVBQXNELElBQXREO0FBQ0FzQixRQUFBQSxLQUFLLENBQUNmLEVBQU4sQ0FBU3RDLFNBQVMsQ0FBQ3NELGlCQUFuQixFQUFzQyxLQUFLRSxlQUEzQyxFQUE0RCxJQUE1RDtBQUNBSCxRQUFBQSxLQUFLLENBQUNmLEVBQU4sQ0FBU3RDLFNBQVMsQ0FBQzRDLGNBQW5CLEVBQW1DLEtBQUtiLGNBQXhDLEVBQXdELElBQXhEO0FBQ0FzQixRQUFBQSxLQUFLLENBQUNmLEVBQU4sQ0FBUyw2QkFBVCxFQUF3QyxLQUFLUCxjQUE3QyxFQUE2RCxJQUE3RDs7QUFFQSxhQUFLQSxjQUFMO0FBQ0g7OztvQ0FFd0JzQixLLEVBQWE7QUFDbENBLFFBQUFBLEtBQUssQ0FBQ0gsR0FBTixDQUFVbEQsU0FBUyxDQUFDc0QsaUJBQXBCLEVBQXVDLEtBQUtDLGFBQTVDLEVBQTJELElBQTNEO0FBQ0FGLFFBQUFBLEtBQUssQ0FBQ0gsR0FBTixDQUFVbEQsU0FBUyxDQUFDMEMsWUFBcEIsRUFBa0MsS0FBS1gsY0FBdkMsRUFBdUQsSUFBdkQ7QUFDQXNCLFFBQUFBLEtBQUssQ0FBQ0gsR0FBTixDQUFVbEQsU0FBUyxDQUFDc0QsaUJBQXBCLEVBQXVDLEtBQUtFLGVBQTVDLEVBQTZELElBQTdEO0FBQ0FILFFBQUFBLEtBQUssQ0FBQ0gsR0FBTixDQUFVbEQsU0FBUyxDQUFDNEMsY0FBcEIsRUFBb0MsS0FBS2IsY0FBekMsRUFBeUQsSUFBekQ7QUFDQXNCLFFBQUFBLEtBQUssQ0FBQ0gsR0FBTixDQUFVLDZCQUFWLEVBQXlDLEtBQUtuQixjQUE5QyxFQUE4RCxJQUE5RDs7QUFFQSxhQUFLQSxjQUFMO0FBQ0g7OztpQ0FFcUI7QUFDbEIsYUFBS2xCLFdBQUwsQ0FBaUI0QyxHQUFqQixDQUFxQixLQUFLeEMsSUFBTCxDQUFVTSxRQUFWLENBQW1CQyxlQUFuQixDQUFvQ0MsV0FBekQ7O0FBQ0EsYUFBS00sY0FBTDtBQUNIOzs7NENBRWdDMkIsUyxFQUFtQkMsUSxFQUFtQkMsVyxFQUF1QkMsYSxFQUF3QjtBQUNsSCxZQUFNdkMsS0FBSyxHQUFHLEtBQUtMLElBQUwsQ0FBVU0sUUFBVixDQUFtQkMsZUFBakM7QUFDQSxZQUFNc0MsWUFBWSxHQUFHeEMsS0FBSyxDQUFDeUMsV0FBM0I7QUFDQSxZQUFNN0MsUUFBUSxHQUFHLEtBQUtELElBQUwsQ0FBVUMsUUFBM0I7QUFFQSxZQUFJOEMsSUFBSSxHQUFHLENBQVg7QUFDQSxZQUFJQyxRQUFRLEdBQUcsS0FBS2hDLFlBQXBCO0FBQ0EsWUFBSWlDLFFBQVEsR0FBRyxDQUFDSixZQUFZLENBQUNLLENBQWQsR0FBa0JULFNBQWpDOztBQUNBLFlBQUksS0FBS1Usb0JBQUwsS0FBOEI5RCxtQkFBbUIsQ0FBQytELGFBQXRELEVBQXFFO0FBQ2pFTCxVQUFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFSO0FBQ0FFLFVBQUFBLFFBQVEsR0FBRyxDQUFDLElBQUlKLFlBQVksQ0FBQ0ssQ0FBbEIsSUFBdUJULFNBQWxDO0FBQ0FPLFVBQUFBLFFBQVEsR0FBRyxLQUFLL0IsYUFBaEI7QUFDSDs7QUFFRCxZQUFJb0MsS0FBSyxHQUFHSixRQUFRLEdBQUdGLElBQUksR0FBR0MsUUFBbEIsR0FBNkJELElBQUksR0FBRyxLQUFLTyxTQUFyRDtBQUNBLFlBQUlDLFlBQVksR0FBRyxDQUFuQjtBQUNBLFlBQUlDLGFBQWEsR0FBRyxDQUFwQjtBQUNBLFlBQUlDLGVBQWUsR0FBRyxDQUF0QjtBQUNBLFlBQUlDLEdBQUcsR0FBRyxDQUFWO0FBQ0EsWUFBSUMsdUJBQXVCLEdBQUcsQ0FBOUI7QUFFQSxZQUFJQyxxQkFBcUIsR0FBRyxDQUE1QjtBQUVBLFlBQUlDLGdCQUFnQixHQUFHLENBQXZCOztBQUNBLGFBQUssSUFBSTFCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdsQyxRQUFRLENBQUNDLE1BQTdCLEVBQXFDLEVBQUVpQyxDQUF2QyxFQUEwQztBQUN0QyxjQUFJbEMsUUFBUSxDQUFDa0MsQ0FBRCxDQUFSLENBQVkyQixpQkFBaEIsRUFBbUM7QUFDL0JELFlBQUFBLGdCQUFnQjtBQUNuQjtBQUNKOztBQUVELFlBQUlFLGFBQWEsR0FBRyxLQUFLQyxTQUFMLENBQWVDLEtBQW5DOztBQUNBLFlBQUksS0FBS0MsYUFBTCxLQUF1QmpGLElBQUksQ0FBQ2tGLElBQTVCLElBQW9DLEtBQUtDLFdBQUwsS0FBcUJsRixVQUFVLENBQUNtRixRQUF4RSxFQUFrRjtBQUM5RU4sVUFBQUEsYUFBYSxHQUFHLENBQUN0QixTQUFTLElBQUksS0FBS3pCLFlBQUwsR0FBb0IsS0FBS0MsYUFBN0IsQ0FBVCxHQUF1RCxDQUFDNEMsZ0JBQWdCLEdBQUcsQ0FBcEIsSUFBeUIsS0FBS1AsU0FBdEYsSUFBbUdPLGdCQUFuSDtBQUNIOztBQUVELGFBQUssSUFBSTFCLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdsQyxRQUFRLENBQUNDLE1BQTdCLEVBQXFDLEVBQUVpQyxFQUF2QyxFQUEwQztBQUN0QyxjQUFNQyxLQUFLLEdBQUduQyxRQUFRLENBQUNrQyxFQUFELENBQXRCO0FBQ0EsY0FBTW1DLFVBQVUsR0FBR2xDLEtBQUssQ0FBQzlCLFFBQU4sQ0FBZUMsZUFBbEM7O0FBQ0EsY0FBSSxDQUFDNkIsS0FBSyxDQUFDMEIsaUJBQVAsSUFBNEIsQ0FBQ1EsVUFBakMsRUFBNkM7QUFDekM7QUFDSDs7QUFFRGxDLFVBQUFBLEtBQUssQ0FBQ21DLFFBQU4sQ0FBZS9FLFVBQWY7O0FBQ0EsY0FBTWdGLFdBQVcsR0FBRyxLQUFLQyxrQkFBTCxDQUF3QmpGLFVBQVUsQ0FBQzBELENBQW5DLENBQXBCOztBQUNBLGNBQU13QixXQUFXLEdBQUcsS0FBS0Qsa0JBQUwsQ0FBd0JqRixVQUFVLENBQUNtRixDQUFuQyxDQUFwQixDQVRzQyxDQVV0Qzs7O0FBQ0EsY0FBSSxLQUFLUCxXQUFMLEtBQXFCbEYsVUFBVSxDQUFDbUYsUUFBcEMsRUFBOEM7QUFDMUNDLFlBQUFBLFVBQVUsQ0FBQ0wsS0FBWCxHQUFtQkYsYUFBYSxHQUFHUyxXQUFuQzs7QUFDQSxnQkFBSSxLQUFLTixhQUFMLEtBQXVCakYsSUFBSSxDQUFDa0YsSUFBaEMsRUFBc0M7QUFDbENHLGNBQUFBLFVBQVUsQ0FBQ00sTUFBWCxHQUFvQixLQUFLWixTQUFMLENBQWVZLE1BQWYsR0FBd0JGLFdBQTVDO0FBQ0g7QUFDSjs7QUFFRCxjQUFJRyxPQUFPLEdBQUdQLFVBQVUsQ0FBQ08sT0FBekI7QUFDQSxjQUFNQyxxQkFBcUIsR0FBR1IsVUFBVSxDQUFDTCxLQUFYLEdBQW1CTyxXQUFqRDtBQUNBLGNBQU1PLHNCQUFzQixHQUFHVCxVQUFVLENBQUNNLE1BQVgsR0FBb0JGLFdBQW5EOztBQUVBLGNBQUlqQixlQUFlLEdBQUdELGFBQXRCLEVBQXFDO0FBQ2pDQSxZQUFBQSxhQUFhLEdBQUdDLGVBQWhCO0FBQ0g7O0FBRUQsY0FBSXNCLHNCQUFzQixJQUFJdkIsYUFBOUIsRUFBNkM7QUFDekNDLFlBQUFBLGVBQWUsR0FBR0QsYUFBbEI7QUFDQUEsWUFBQUEsYUFBYSxHQUFHdUIsc0JBQWhCO0FBQ0FuQixZQUFBQSxxQkFBcUIsR0FBR1UsVUFBVSxDQUFDVSxPQUFuQztBQUNIOztBQUVELGNBQUksS0FBSzdCLG9CQUFMLEtBQThCOUQsbUJBQW1CLENBQUMrRCxhQUF0RCxFQUFxRTtBQUNqRXlCLFlBQUFBLE9BQU8sR0FBRyxJQUFJUCxVQUFVLENBQUNPLE9BQXpCO0FBQ0g7O0FBQ0R4QixVQUFBQSxLQUFLLEdBQUdBLEtBQUssR0FBR04sSUFBSSxHQUFHOEIsT0FBUCxHQUFpQkMscUJBQXpCLEdBQWlEL0IsSUFBSSxHQUFHLEtBQUtPLFNBQXJFO0FBQ0EsY0FBTTJCLG9CQUFvQixHQUFHbEMsSUFBSSxJQUFJLElBQUk4QixPQUFSLENBQUosR0FBdUJDLHFCQUFwRDs7QUFFQSxjQUFJcEMsUUFBSixFQUFjO0FBQ1YsZ0JBQU13QyxnQkFBZ0IsR0FBRzdCLEtBQUssR0FBRzRCLG9CQUFSLEdBQStCbEMsSUFBSSxJQUFJQSxJQUFJLEdBQUcsQ0FBUCxHQUFXLEtBQUs5QixhQUFoQixHQUFnQyxLQUFLRCxZQUF6QyxDQUE1RDtBQUNBLGdCQUFJbUUsbUJBQW1CLEdBQUcsS0FBMUI7O0FBQ0EsZ0JBQUksS0FBS2hDLG9CQUFMLEtBQThCOUQsbUJBQW1CLENBQUMrRixhQUFsRCxJQUFtRUYsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJckMsWUFBWSxDQUFDSyxDQUFsQixJQUF1QlQsU0FBakgsRUFBNEg7QUFDeEgwQyxjQUFBQSxtQkFBbUIsR0FBRyxJQUF0QjtBQUNIOztBQUVELGdCQUFJRSxtQkFBbUIsR0FBRyxLQUExQjs7QUFDQSxnQkFBSSxLQUFLbEMsb0JBQUwsS0FBOEI5RCxtQkFBbUIsQ0FBQytELGFBQWxELElBQW1FOEIsZ0JBQWdCLEdBQUcsQ0FBQ3JDLFlBQVksQ0FBQ0ssQ0FBZCxHQUFrQlQsU0FBNUcsRUFBdUg7QUFDbkg0QyxjQUFBQSxtQkFBbUIsR0FBRyxJQUF0QjtBQUNIOztBQUVELGdCQUFJRixtQkFBbUIsSUFBSUUsbUJBQTNCLEVBQWdEO0FBRTVDLGtCQUFJTixzQkFBc0IsSUFBSXZCLGFBQTlCLEVBQTZDO0FBQ3pDLG9CQUFJQyxlQUFlLEtBQUssQ0FBeEIsRUFBMkI7QUFDdkJBLGtCQUFBQSxlQUFlLEdBQUdELGFBQWxCO0FBQ0g7O0FBQ0RELGdCQUFBQSxZQUFZLElBQUlFLGVBQWhCO0FBQ0FBLGdCQUFBQSxlQUFlLEdBQUdELGFBQWxCO0FBQ0gsZUFORCxNQU1PO0FBQ0hELGdCQUFBQSxZQUFZLElBQUlDLGFBQWhCO0FBQ0FDLGdCQUFBQSxlQUFlLEdBQUdzQixzQkFBbEI7QUFDQXZCLGdCQUFBQSxhQUFhLEdBQUcsQ0FBaEI7QUFDSDs7QUFDREgsY0FBQUEsS0FBSyxHQUFHSixRQUFRLEdBQUdGLElBQUksSUFBSUMsUUFBUSxHQUFHNkIsT0FBTyxHQUFHQyxxQkFBekIsQ0FBdkI7QUFDQXBCLGNBQUFBLEdBQUc7QUFDTjtBQUNKOztBQUVELGNBQU00QixjQUFjLEdBQUczQyxXQUFXLENBQUNQLEtBQUQsRUFBUWtDLFVBQVIsRUFBb0JmLFlBQXBCLEVBQWtDRyxHQUFsQyxDQUFsQzs7QUFDQSxjQUFJakIsU0FBUyxJQUFLcUMscUJBQXFCLEdBQUcsS0FBSzlELFlBQTdCLEdBQTRDLEtBQUtDLGFBQW5FLEVBQW1GO0FBQy9FLGdCQUFJMkIsYUFBSixFQUFtQjtBQUNmUixjQUFBQSxLQUFLLENBQUNtRCxXQUFOLENBQWtCakcsUUFBbEI7QUFDQThDLGNBQUFBLEtBQUssQ0FBQ29ELFdBQU4sQ0FBa0JuQyxLQUFsQixFQUF5QmlDLGNBQXpCLEVBQXlDaEcsUUFBUSxDQUFDbUcsQ0FBbEQ7QUFDSDtBQUNKOztBQUVELGNBQUlDLEtBQUssR0FBRyxDQUFaO0FBQ0EsY0FBSUMsa0JBQWtCLFNBQXRCO0FBQ0EsY0FBTUMsU0FBUyxHQUFJcEMsYUFBYSxLQUFLLENBQW5CLEdBQXdCdUIsc0JBQXhCLEdBQWlEdkIsYUFBbkU7O0FBRUEsY0FBSSxLQUFLcUMsa0JBQUwsS0FBNEJ6RyxpQkFBaUIsQ0FBQzBHLGFBQWxELEVBQWlFO0FBQzdEbkMsWUFBQUEsdUJBQXVCLEdBQUdBLHVCQUF1QixJQUFJdEQsS0FBSyxDQUFDdUUsTUFBM0Q7QUFDQWMsWUFBQUEsS0FBSyxHQUFHLENBQUMsQ0FBVDtBQUNBQyxZQUFBQSxrQkFBa0IsR0FBR0wsY0FBYyxHQUFHSSxLQUFLLElBQUlFLFNBQVMsR0FBR2hDLHFCQUFaLEdBQW9DLEtBQUt6QyxjQUE3QyxDQUEzQzs7QUFDQSxnQkFBSXdFLGtCQUFrQixHQUFHaEMsdUJBQXpCLEVBQWtEO0FBQzlDQSxjQUFBQSx1QkFBdUIsR0FBR2dDLGtCQUExQjtBQUNIO0FBQ0osV0FQRCxNQU9PO0FBQ0hoQyxZQUFBQSx1QkFBdUIsR0FBR0EsdUJBQXVCLElBQUksQ0FBQ3RELEtBQUssQ0FBQ3VFLE1BQTVEO0FBQ0FlLFlBQUFBLGtCQUFrQixHQUFHTCxjQUFjLEdBQUdJLEtBQUssSUFBSUUsU0FBUyxHQUFHaEMscUJBQVosR0FBb0MsS0FBSzFDLFdBQTdDLENBQTNDOztBQUNBLGdCQUFJeUUsa0JBQWtCLEdBQUdoQyx1QkFBekIsRUFBa0Q7QUFDOUNBLGNBQUFBLHVCQUF1QixHQUFHZ0Msa0JBQTFCO0FBQ0g7QUFDSjs7QUFFRHRDLFVBQUFBLEtBQUssSUFBSTRCLG9CQUFUO0FBQ0g7O0FBRUQsZUFBT3RCLHVCQUFQO0FBQ0g7OzswQ0FHR29DLFUsRUFDQUMsVyxFQUNBQyxXLEVBQ0FyRCxhLEVBQ0Y7QUFDRSxZQUFNdkMsS0FBSyxHQUFHLEtBQUtMLElBQUwsQ0FBVU0sUUFBVixDQUFtQkMsZUFBakM7QUFDQSxZQUFNc0MsWUFBWSxHQUFHeEMsS0FBSyxDQUFDeUMsV0FBM0I7QUFDQSxZQUFNN0MsUUFBUSxHQUFHLEtBQUtELElBQUwsQ0FBVUMsUUFBM0I7QUFFQSxZQUFJOEMsSUFBSSxHQUFHLENBQVg7QUFDQSxZQUFJbUQsUUFBUSxHQUFHLEtBQUsvRSxjQUFwQjtBQUNBLFlBQUlnRixzQkFBc0IsR0FBRyxDQUFDdEQsWUFBWSxDQUFDOEIsQ0FBZCxHQUFrQm9CLFVBQS9DOztBQUNBLFlBQUksS0FBS0Ysa0JBQUwsS0FBNEJ6RyxpQkFBaUIsQ0FBQzBHLGFBQWxELEVBQWlFO0FBQzdEL0MsVUFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBUjtBQUNBb0QsVUFBQUEsc0JBQXNCLEdBQUcsQ0FBQyxJQUFJdEQsWUFBWSxDQUFDOEIsQ0FBbEIsSUFBdUJvQixVQUFoRDtBQUNBRyxVQUFBQSxRQUFRLEdBQUcsS0FBS2hGLFdBQWhCO0FBQ0g7O0FBRUQsWUFBSWtGLEtBQUssR0FBR0Qsc0JBQXNCLEdBQUdwRCxJQUFJLEdBQUdtRCxRQUFoQyxHQUEyQ25ELElBQUksR0FBRyxLQUFLc0QsU0FBbkU7QUFDQSxZQUFJQyxjQUFjLEdBQUcsQ0FBckI7QUFDQSxZQUFJQyxZQUFZLEdBQUcsQ0FBbkI7QUFDQSxZQUFJQyxjQUFjLEdBQUcsQ0FBckI7QUFDQSxZQUFJQyxNQUFNLEdBQUcsQ0FBYjtBQUNBLFlBQUk5Qyx1QkFBdUIsR0FBRyxDQUE5QjtBQUNBLFlBQUkrQyxvQkFBb0IsR0FBRyxDQUEzQjtBQUVBLFlBQUk3QyxnQkFBZ0IsR0FBRyxDQUF2Qjs7QUFDQSxhQUFLLElBQUkxQixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbEMsUUFBUSxDQUFDQyxNQUE3QixFQUFxQyxFQUFFaUMsQ0FBdkMsRUFBMEM7QUFDdEMsY0FBSWxDLFFBQVEsQ0FBQ2tDLENBQUQsQ0FBUixDQUFZMkIsaUJBQWhCLEVBQW1DO0FBQy9CRCxZQUFBQSxnQkFBZ0I7QUFDbkI7QUFDSjs7QUFFRCxZQUFJOEMsY0FBYyxHQUFHLEtBQUszQyxTQUFMLENBQWVZLE1BQXBDOztBQUNBLFlBQUksS0FBS1YsYUFBTCxLQUF1QmpGLElBQUksQ0FBQ2tGLElBQTVCLElBQW9DLEtBQUtDLFdBQUwsS0FBcUJsRixVQUFVLENBQUNtRixRQUF4RSxFQUFrRjtBQUM5RXNDLFVBQUFBLGNBQWMsR0FBRyxDQUFDWixVQUFVLElBQUksS0FBSzdFLFdBQUwsR0FBbUIsS0FBS0MsY0FBNUIsQ0FBVixHQUF3RCxDQUFDMEMsZ0JBQWdCLEdBQUcsQ0FBcEIsSUFBeUIsS0FBS3dDLFNBQXZGLElBQW9HeEMsZ0JBQXJIO0FBQ0g7O0FBRUQsYUFBSyxJQUFJMUIsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR2xDLFFBQVEsQ0FBQ0MsTUFBN0IsRUFBcUMsRUFBRWlDLEdBQXZDLEVBQTBDO0FBQ3RDLGNBQU1DLEtBQUssR0FBR25DLFFBQVEsQ0FBQ2tDLEdBQUQsQ0FBdEI7O0FBQ0EsY0FBSSxDQUFDQyxLQUFMLEVBQVk7QUFDUjtBQUNIOztBQUVELGNBQU13RSxLQUFLLEdBQUd4RSxLQUFLLENBQUNtQyxRQUFOLEVBQWQ7O0FBQ0EsY0FBTUMsV0FBVyxHQUFHLEtBQUtDLGtCQUFMLENBQXdCbUMsS0FBSyxDQUFDMUQsQ0FBOUIsQ0FBcEI7O0FBQ0EsY0FBTXdCLFdBQVcsR0FBRyxLQUFLRCxrQkFBTCxDQUF3Qm1DLEtBQUssQ0FBQ2pDLENBQTlCLENBQXBCOztBQUNBLGNBQU1MLFVBQVUsR0FBR2xDLEtBQUssQ0FBQzlCLFFBQU4sQ0FBZUMsZUFBbEM7O0FBQ0EsY0FBSSxDQUFDNkIsS0FBSyxDQUFDMEIsaUJBQVAsSUFBNEIsQ0FBQ1EsVUFBakMsRUFBNkM7QUFDekM7QUFDSCxXQVpxQyxDQWN0Qzs7O0FBQ0EsY0FBSSxLQUFLRixXQUFMLEtBQXFCbEYsVUFBVSxDQUFDbUYsUUFBcEMsRUFBOEM7QUFDMUNDLFlBQUFBLFVBQVUsQ0FBQ00sTUFBWCxHQUFvQitCLGNBQWMsR0FBR2pDLFdBQXJDOztBQUNBLGdCQUFJLEtBQUtSLGFBQUwsS0FBdUJqRixJQUFJLENBQUNrRixJQUFoQyxFQUFzQztBQUNsQ0csY0FBQUEsVUFBVSxDQUFDTCxLQUFYLEdBQW1CLEtBQUtELFNBQUwsQ0FBZUMsS0FBZixHQUF1Qk8sV0FBMUM7QUFDSDtBQUNKOztBQUVELGNBQUlRLE9BQU8sR0FBR1YsVUFBVSxDQUFDVSxPQUF6QjtBQUNBLGNBQU1GLHFCQUFxQixHQUFHUixVQUFVLENBQUNMLEtBQVgsR0FBbUJPLFdBQWpEO0FBQ0EsY0FBTU8sc0JBQXNCLEdBQUdULFVBQVUsQ0FBQ00sTUFBWCxHQUFvQkYsV0FBbkQ7O0FBRUEsY0FBSThCLGNBQWMsR0FBR0QsWUFBckIsRUFBbUM7QUFDL0JBLFlBQUFBLFlBQVksR0FBR0MsY0FBZjtBQUNIOztBQUVELGNBQUkxQixxQkFBcUIsSUFBSXlCLFlBQTdCLEVBQTJDO0FBQ3ZDQyxZQUFBQSxjQUFjLEdBQUdELFlBQWpCO0FBQ0FBLFlBQUFBLFlBQVksR0FBR3pCLHFCQUFmO0FBQ0E0QixZQUFBQSxvQkFBb0IsR0FBR3BDLFVBQVUsQ0FBQ08sT0FBbEM7QUFDSDs7QUFFRCxjQUFJLEtBQUtnQixrQkFBTCxLQUE0QnpHLGlCQUFpQixDQUFDMEcsYUFBbEQsRUFBaUU7QUFDN0RkLFlBQUFBLE9BQU8sR0FBRyxJQUFJVixVQUFVLENBQUNVLE9BQXpCO0FBQ0g7O0FBQ0RvQixVQUFBQSxLQUFLLEdBQUdBLEtBQUssR0FBR3JELElBQUksR0FBR2lDLE9BQVAsR0FBaUJELHNCQUF6QixHQUFrRGhDLElBQUksR0FBRyxLQUFLc0QsU0FBdEU7QUFDQSxjQUFNUSxrQkFBa0IsR0FBRzlELElBQUksSUFBSSxJQUFJaUMsT0FBUixDQUFKLEdBQXVCRCxzQkFBbEQ7O0FBRUEsY0FBSWlCLFdBQUosRUFBaUI7QUFDYixnQkFBTWMsbUJBQW1CLEdBQUdWLEtBQUssR0FBR1Msa0JBQVIsR0FBNkI5RCxJQUFJLElBQUlBLElBQUksR0FBRyxDQUFQLEdBQVcsS0FBSzdCLFdBQWhCLEdBQThCLEtBQUtDLGNBQXZDLENBQTdEO0FBQ0EsZ0JBQUk0RixzQkFBc0IsR0FBRyxLQUE3Qjs7QUFDQSxnQkFBSSxLQUFLbEIsa0JBQUwsS0FBNEJ6RyxpQkFBaUIsQ0FBQzRILGFBQTlDLElBQStERixtQkFBbUIsR0FBRyxDQUFDLElBQUlqRSxZQUFZLENBQUM4QixDQUFsQixJQUF1Qm9CLFVBQWhILEVBQTRIO0FBQ3hIZ0IsY0FBQUEsc0JBQXNCLEdBQUcsSUFBekI7QUFDSDs7QUFFRCxnQkFBSUUsc0JBQXNCLEdBQUcsS0FBN0I7O0FBQ0EsZ0JBQUksS0FBS3BCLGtCQUFMLEtBQTRCekcsaUJBQWlCLENBQUMwRyxhQUE5QyxJQUErRGdCLG1CQUFtQixHQUFHLENBQUNqRSxZQUFZLENBQUM4QixDQUFkLEdBQWtCb0IsVUFBM0csRUFBdUg7QUFDbkhrQixjQUFBQSxzQkFBc0IsR0FBRyxJQUF6QjtBQUNIOztBQUVELGdCQUFJRixzQkFBc0IsSUFBSUUsc0JBQTlCLEVBQXNEO0FBQ2xELGtCQUFJbkMscUJBQXFCLElBQUl5QixZQUE3QixFQUEyQztBQUN2QyxvQkFBSUMsY0FBYyxLQUFLLENBQXZCLEVBQTBCO0FBQ3RCQSxrQkFBQUEsY0FBYyxHQUFHRCxZQUFqQjtBQUNIOztBQUNERCxnQkFBQUEsY0FBYyxJQUFJRSxjQUFsQjtBQUNBQSxnQkFBQUEsY0FBYyxHQUFHRCxZQUFqQjtBQUNILGVBTkQsTUFNTztBQUNIRCxnQkFBQUEsY0FBYyxJQUFJQyxZQUFsQjtBQUNBQyxnQkFBQUEsY0FBYyxHQUFHMUIscUJBQWpCO0FBQ0F5QixnQkFBQUEsWUFBWSxHQUFHLENBQWY7QUFDSDs7QUFDREgsY0FBQUEsS0FBSyxHQUFHRCxzQkFBc0IsR0FBR3BELElBQUksSUFBSW1ELFFBQVEsR0FBR2xCLE9BQU8sR0FBR0Qsc0JBQXpCLENBQXJDO0FBQ0EwQixjQUFBQSxNQUFNO0FBQ1Q7QUFDSjs7QUFFRCxjQUFNUyxjQUFjLEdBQUdqQixXQUFXLENBQUM3RCxLQUFELEVBQVFrQyxVQUFSLEVBQW9CZ0MsY0FBcEIsRUFBb0NHLE1BQXBDLENBQWxDOztBQUNBLGNBQUlWLFVBQVUsSUFBS2hCLHNCQUFzQixJQUFJLEtBQUs3RCxXQUFMLEdBQW1CLEtBQUtDLGNBQTVCLENBQXpDLEVBQXVGO0FBQ25GLGdCQUFJeUIsYUFBSixFQUFtQjtBQUNmUixjQUFBQSxLQUFLLENBQUNtRCxXQUFOLENBQWtCakcsUUFBbEI7QUFDQThDLGNBQUFBLEtBQUssQ0FBQ29ELFdBQU4sQ0FBa0IwQixjQUFsQixFQUFrQ2QsS0FBbEMsRUFBeUM5RyxRQUFRLENBQUNtRyxDQUFsRDtBQUNIO0FBQ0o7O0FBRUQsY0FBSUMsS0FBSyxHQUFHLENBQVo7QUFDQSxjQUFJeUIsa0JBQWtCLFNBQXRCLENBaEZzQyxDQWlGdEM7O0FBQ0EsY0FBTUMsV0FBVyxHQUFJYixZQUFZLEtBQUssQ0FBbEIsR0FBdUJ6QixxQkFBdkIsR0FBK0N5QixZQUFuRTs7QUFFQSxjQUFJLEtBQUtwRCxvQkFBTCxLQUE4QjlELG1CQUFtQixDQUFDK0QsYUFBdEQsRUFBcUU7QUFDakVzQyxZQUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFUO0FBQ0EvQixZQUFBQSx1QkFBdUIsR0FBR0EsdUJBQXVCLElBQUl0RCxLQUFLLENBQUM0RCxLQUEzRDtBQUNBa0QsWUFBQUEsa0JBQWtCLEdBQUdELGNBQWMsR0FBR3hCLEtBQUssSUFBSTBCLFdBQVcsR0FBR1Ysb0JBQWQsR0FBcUMsS0FBSzFGLFlBQTlDLENBQTNDOztBQUNBLGdCQUFJbUcsa0JBQWtCLEdBQUd4RCx1QkFBekIsRUFBa0Q7QUFDOUNBLGNBQUFBLHVCQUF1QixHQUFHd0Qsa0JBQTFCO0FBQ0g7QUFDSixXQVBELE1BT087QUFDSHhELFlBQUFBLHVCQUF1QixHQUFHQSx1QkFBdUIsSUFBSSxDQUFDdEQsS0FBSyxDQUFDNEQsS0FBNUQ7QUFDQWtELFlBQUFBLGtCQUFrQixHQUFHRCxjQUFjLEdBQUd4QixLQUFLLElBQUkwQixXQUFXLEdBQUdWLG9CQUFkLEdBQXFDLEtBQUt6RixhQUE5QyxDQUEzQzs7QUFDQSxnQkFBSWtHLGtCQUFrQixHQUFHeEQsdUJBQXpCLEVBQWtEO0FBQzlDQSxjQUFBQSx1QkFBdUIsR0FBR3dELGtCQUExQjtBQUNIO0FBRUo7O0FBRURmLFVBQUFBLEtBQUssSUFBSVMsa0JBQVQ7QUFDSDs7QUFFRCxlQUFPbEQsdUJBQVA7QUFDSDs7O3VDQUUyQjtBQUN4QixZQUFNMUQsUUFBUSxHQUFHLEtBQUtELElBQUwsQ0FBVUMsUUFBM0I7QUFDQSxZQUFJb0gsc0JBQW1DLEdBQUcsSUFBMUM7O0FBRUEsYUFBSyxJQUFJbEYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2xDLFFBQVEsQ0FBQ0MsTUFBN0IsRUFBcUMsRUFBRWlDLENBQXZDLEVBQTBDO0FBQ3RDLGNBQU1DLEtBQUssR0FBR25DLFFBQVEsQ0FBQ2tDLENBQUQsQ0FBdEI7QUFDQSxjQUFNbUYsY0FBYyxHQUFHbEYsS0FBSyxDQUFDOUIsUUFBTixDQUFlQyxlQUF0Qzs7QUFDQSxjQUFJLENBQUMrRyxjQUFMLEVBQXFCO0FBQ2pCO0FBQ0g7O0FBRUQsY0FBSWxGLEtBQUssQ0FBQzBCLGlCQUFWLEVBQTZCO0FBQ3pCLGdCQUFJLENBQUN1RCxzQkFBTCxFQUE2QjtBQUN6QkEsY0FBQUEsc0JBQXNCLEdBQUdDLGNBQWMsQ0FBQ0MscUJBQWYsRUFBekI7QUFDSCxhQUZELE1BRU87QUFDSEMsMkJBQUtDLEtBQUwsQ0FBV0osc0JBQVgsRUFBbUNBLHNCQUFuQyxFQUEyREMsY0FBYyxDQUFDQyxxQkFBZixFQUEzRDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxZQUFJRixzQkFBSixFQUE0QjtBQUN4QixjQUFNSyxlQUFlLEdBQUcsS0FBSzFILElBQUwsQ0FBVTJILE1BQVYsQ0FBa0JDLFlBQWxCLENBQStCbEksd0JBQS9CLENBQXhCOztBQUNBLGNBQUksQ0FBQ2dJLGVBQUwsRUFBc0I7QUFDbEI7QUFDSDs7QUFFRG5JLHVCQUFLaUQsR0FBTCxDQUFTbEQsUUFBVCxFQUFtQitILHNCQUFzQixDQUFDbkUsQ0FBMUMsRUFBNkNtRSxzQkFBc0IsQ0FBQzFDLENBQXBFLEVBQXVFLENBQXZFOztBQUNBLGNBQU1rRCx1QkFBdUIsR0FBRyxJQUFJdEksWUFBSixFQUFoQztBQUNBbUksVUFBQUEsZUFBZSxDQUFDSSxvQkFBaEIsQ0FBcUN4SSxRQUFyQyxFQUErQ3VJLHVCQUEvQzs7QUFDQXRJLHVCQUFLaUQsR0FBTCxDQUFTcUYsdUJBQVQsRUFDSUEsdUJBQXVCLENBQUMzRSxDQUF4QixHQUE0QixLQUFLbEMsWUFEckMsRUFDbUQ2Ryx1QkFBdUIsQ0FBQ2xELENBQXhCLEdBQTRCLEtBQUt4RCxjQURwRixFQUVJMEcsdUJBQXVCLENBQUNwQyxDQUY1Qjs7QUFJQWxHLHVCQUFLaUQsR0FBTCxDQUFTbEQsUUFBVCxFQUFtQitILHNCQUFzQixDQUFDbkUsQ0FBdkIsR0FBMkJtRSxzQkFBc0IsQ0FBQ3BELEtBQXJFLEVBQTRFb0Qsc0JBQXNCLENBQUMxQyxDQUF2QixHQUEyQjBDLHNCQUFzQixDQUFDekMsTUFBOUgsRUFBc0ksQ0FBdEk7O0FBQ0EsY0FBTW1ELHFCQUFxQixHQUFHLElBQUl4SSxZQUFKLEVBQTlCO0FBQ0FtSSxVQUFBQSxlQUFlLENBQUNJLG9CQUFoQixDQUFxQ3hJLFFBQXJDLEVBQStDeUkscUJBQS9DOztBQUNBeEksdUJBQUtpRCxHQUFMLENBQVN1RixxQkFBVCxFQUFnQ0EscUJBQXFCLENBQUM3RSxDQUF0QixHQUEwQixLQUFLakMsYUFBL0QsRUFBOEU4RyxxQkFBcUIsQ0FBQ3BELENBQXRCLEdBQTBCLEtBQUt6RCxXQUE3RyxFQUEwSDZHLHFCQUFxQixDQUFDdEMsQ0FBaEo7O0FBRUEsY0FBTXVDLE9BQU8sR0FBR0Msd0JBQVNDLElBQVQsQ0FBY0MsVUFBVSxDQUFDLENBQUNKLHFCQUFxQixDQUFDN0UsQ0FBdEIsR0FBMEIyRSx1QkFBdUIsQ0FBQzNFLENBQW5ELEVBQXNEa0YsT0FBdEQsQ0FBOEQsQ0FBOUQsQ0FBRCxDQUF4QixFQUNaRCxVQUFVLENBQUMsQ0FBQ0oscUJBQXFCLENBQUNwRCxDQUF0QixHQUEwQmtELHVCQUF1QixDQUFDbEQsQ0FBbkQsRUFBc0R5RCxPQUF0RCxDQUE4RCxDQUE5RCxDQUFELENBREUsQ0FBaEI7O0FBR0EsZUFBS3BJLElBQUwsQ0FBVXVGLFdBQVYsQ0FBc0JqRyxRQUF0QjtBQUNBLGNBQU1lLEtBQUssR0FBRyxLQUFLTCxJQUFMLENBQVVNLFFBQVYsQ0FBbUJDLGVBQWpDOztBQUNBLGNBQUl5SCxPQUFPLENBQUMvRCxLQUFSLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3JCLGdCQUFNb0UsVUFBVSxHQUFHLENBQUMvSSxRQUFRLENBQUM0RCxDQUFULEdBQWEyRSx1QkFBdUIsQ0FBQzNFLENBQXRDLElBQTJDOEUsT0FBTyxDQUFDL0QsS0FBdEU7QUFDQTVELFlBQUFBLEtBQUssQ0FBQ3dFLE9BQU4sR0FBZ0JzRCxVQUFVLENBQUNFLFVBQVUsQ0FBQ0QsT0FBWCxDQUFtQixDQUFuQixDQUFELENBQTFCO0FBQ0g7O0FBQ0QsY0FBSUosT0FBTyxDQUFDcEQsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN0QixnQkFBTTBELFVBQVUsR0FBRyxDQUFDaEosUUFBUSxDQUFDcUYsQ0FBVCxHQUFha0QsdUJBQXVCLENBQUNsRCxDQUF0QyxJQUEyQ3FELE9BQU8sQ0FBQ3BELE1BQXRFO0FBQ0F2RSxZQUFBQSxLQUFLLENBQUMyRSxPQUFOLEdBQWdCbUQsVUFBVSxDQUFDRyxVQUFVLENBQUNGLE9BQVgsQ0FBbUIsQ0FBbkIsQ0FBRCxDQUExQjtBQUNIOztBQUNEL0gsVUFBQUEsS0FBSyxDQUFDTSxjQUFOLENBQXFCcUgsT0FBckI7QUFDSDtBQUNKOzs7a0RBRXNDbkYsWSxFQUFjMEYsVSxFQUFZO0FBQUE7O0FBQzdELFlBQU05RixTQUFTLEdBQUc4RixVQUFVLENBQUN0RSxLQUE3QjtBQUVBLFlBQUlsQixJQUFJLEdBQUcsQ0FBWDtBQUNBLFlBQUlvRCxzQkFBc0IsR0FBRyxDQUFDdEQsWUFBWSxDQUFDOEIsQ0FBZCxHQUFrQjRELFVBQVUsQ0FBQzNELE1BQTFEO0FBQ0EsWUFBSXNCLFFBQVEsR0FBRyxLQUFLL0UsY0FBcEI7O0FBQ0EsWUFBSSxLQUFLMEUsa0JBQUwsS0FBNEJ6RyxpQkFBaUIsQ0FBQzBHLGFBQWxELEVBQWlFO0FBQzdEL0MsVUFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBUjtBQUNBb0QsVUFBQUEsc0JBQXNCLEdBQUcsQ0FBQyxJQUFJdEQsWUFBWSxDQUFDOEIsQ0FBbEIsSUFBdUI0RCxVQUFVLENBQUMzRCxNQUEzRDtBQUNBc0IsVUFBQUEsUUFBUSxHQUFHLEtBQUtoRixXQUFoQjtBQUNIOztBQUVELFlBQU1zSCxJQUFJLEdBQUcsSUFBYjs7QUFDQSxZQUFNN0YsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ1AsS0FBRCxFQUFja0MsVUFBZCxFQUF1Q21FLFNBQXZDLEVBQTBEL0UsR0FBMUQsRUFBMEU7QUFDMUYsaUJBQU95QyxzQkFBc0IsR0FDekJwRCxJQUFJLElBQUkwRixTQUFTLEdBQUduRSxVQUFVLENBQUNVLE9BQVgsR0FBcUJWLFVBQVUsQ0FBQ00sTUFBaEMsR0FBeUM0RCxJQUFJLENBQUMvRCxrQkFBTCxDQUF3QnJDLEtBQUssQ0FBQ21DLFFBQU4sR0FBaUJJLENBQXpDLENBQXJELEdBQW1HdUIsUUFBbkcsR0FBOEd4QyxHQUFHLEdBQUcsTUFBSSxDQUFDMkMsU0FBN0gsQ0FEUjtBQUVILFNBSEQ7O0FBS0EsWUFBSXFDLFNBQVMsR0FBRyxDQUFoQjs7QUFDQSxZQUFJLEtBQUt0RSxXQUFMLEtBQXFCbEYsVUFBVSxDQUFDeUosU0FBcEMsRUFBK0M7QUFDM0M7QUFDQSxjQUFNQyxRQUFRLEdBQUcsS0FBS0MscUJBQUwsQ0FBMkJwRyxTQUEzQixFQUFzQyxJQUF0QyxFQUE0Q0UsV0FBNUMsRUFBeUQsS0FBekQsQ0FBakI7O0FBQ0ErRixVQUFBQSxTQUFTLEdBQUd2QyxzQkFBc0IsR0FBR3lDLFFBQXJDOztBQUNBLGNBQUlGLFNBQVMsR0FBRyxDQUFoQixFQUFtQjtBQUNmQSxZQUFBQSxTQUFTLElBQUksQ0FBQyxDQUFkO0FBQ0g7O0FBRUR2QyxVQUFBQSxzQkFBc0IsR0FBRyxDQUFDdEQsWUFBWSxDQUFDOEIsQ0FBZCxHQUFrQitELFNBQTNDOztBQUVBLGNBQUksS0FBSzdDLGtCQUFMLEtBQTRCekcsaUJBQWlCLENBQUMwRyxhQUFsRCxFQUFpRTtBQUM3RC9DLFlBQUFBLElBQUksR0FBRyxDQUFDLENBQVI7QUFDQW9ELFlBQUFBLHNCQUFzQixHQUFHLENBQUMsSUFBSXRELFlBQVksQ0FBQzhCLENBQWxCLElBQXVCK0QsU0FBaEQ7QUFDSDtBQUNKOztBQUVELGFBQUtHLHFCQUFMLENBQTJCcEcsU0FBM0IsRUFBc0MsSUFBdEMsRUFBNENFLFdBQTVDLEVBQXlELElBQXpEOztBQUVBLFlBQUksS0FBS3lCLFdBQUwsS0FBcUJsRixVQUFVLENBQUN5SixTQUFwQyxFQUErQztBQUMzQyxlQUFLM0ksSUFBTCxDQUFVTSxRQUFWLENBQW1CQyxlQUFuQixDQUFvQ0ksY0FBcEMsQ0FBbUQ4QixTQUFuRCxFQUE4RGlHLFNBQTlEO0FBQ0g7QUFDSjs7O2dEQUVvQzdGLFksRUFBb0IwRixVLEVBQWtCO0FBQUE7O0FBQ3ZFLFlBQU14QyxVQUFVLEdBQUd3QyxVQUFVLENBQUMzRCxNQUE5QjtBQUVBLFlBQUk3QixJQUFJLEdBQUcsQ0FBWDtBQUNBLFlBQUkrRixvQkFBb0IsR0FBRyxDQUFDakcsWUFBWSxDQUFDSyxDQUFkLEdBQWtCcUYsVUFBVSxDQUFDdEUsS0FBeEQ7QUFDQSxZQUFJakIsUUFBUSxHQUFHLEtBQUtoQyxZQUFwQjs7QUFDQSxZQUFJLEtBQUttQyxvQkFBTCxLQUE4QjlELG1CQUFtQixDQUFDK0QsYUFBdEQsRUFBcUU7QUFDakVMLFVBQUFBLElBQUksR0FBRyxDQUFDLENBQVI7QUFDQStGLFVBQUFBLG9CQUFvQixHQUFHLENBQUMsSUFBSWpHLFlBQVksQ0FBQ0ssQ0FBbEIsSUFBdUJxRixVQUFVLENBQUN0RSxLQUF6RDtBQUNBakIsVUFBQUEsUUFBUSxHQUFHLEtBQUsvQixhQUFoQjtBQUNIOztBQUVELFlBQU11SCxJQUFJLEdBQUcsSUFBYjs7QUFDQSxZQUFNdkMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQzdELEtBQUQsRUFBY2tDLFVBQWQsRUFBdUN5RSxVQUF2QyxFQUEyRHRDLE1BQTNELEVBQThFO0FBQzlGLGlCQUFPcUMsb0JBQW9CLEdBQ3ZCL0YsSUFBSSxJQUFJZ0csVUFBVSxHQUFHekUsVUFBVSxDQUFDTyxPQUFYLEdBQXFCUCxVQUFVLENBQUNMLEtBQWhDLEdBQXdDdUUsSUFBSSxDQUFDL0Qsa0JBQUwsQ0FBd0JyQyxLQUFLLENBQUNtQyxRQUFOLEdBQWlCckIsQ0FBekMsQ0FBckQsR0FBbUdGLFFBQW5HLEdBQThHeUQsTUFBTSxHQUFHLE1BQUksQ0FBQ25ELFNBQWhJLENBRFI7QUFFSCxTQUhEOztBQUtBLFlBQUkwRixRQUFRLEdBQUcsQ0FBZjs7QUFDQSxZQUFJLEtBQUs1RSxXQUFMLEtBQXFCbEYsVUFBVSxDQUFDeUosU0FBcEMsRUFBK0M7QUFDM0MsY0FBTUMsUUFBUSxHQUFHLEtBQUtLLG1CQUFMLENBQXlCbEQsVUFBekIsRUFBcUMsSUFBckMsRUFBMkNFLFdBQTNDLEVBQXdELEtBQXhELENBQWpCOztBQUNBK0MsVUFBQUEsUUFBUSxHQUFHRixvQkFBb0IsR0FBR0YsUUFBbEM7O0FBQ0EsY0FBSUksUUFBUSxHQUFHLENBQWYsRUFBa0I7QUFDZEEsWUFBQUEsUUFBUSxJQUFJLENBQUMsQ0FBYjtBQUNIOztBQUVERixVQUFBQSxvQkFBb0IsR0FBRyxDQUFDakcsWUFBWSxDQUFDSyxDQUFkLEdBQWtCOEYsUUFBekM7O0FBRUEsY0FBSSxLQUFLN0Ysb0JBQUwsS0FBOEI5RCxtQkFBbUIsQ0FBQytELGFBQXRELEVBQXFFO0FBQ2pFTCxZQUFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFSO0FBQ0ErRixZQUFBQSxvQkFBb0IsR0FBRyxDQUFDLElBQUlqRyxZQUFZLENBQUNLLENBQWxCLElBQXVCOEYsUUFBOUM7QUFDSDtBQUNKOztBQUVELGFBQUtDLG1CQUFMLENBQXlCbEQsVUFBekIsRUFBcUMsSUFBckMsRUFBMkNFLFdBQTNDLEVBQXdELElBQXhEOztBQUVBLFlBQUksS0FBSzdCLFdBQUwsS0FBcUJsRixVQUFVLENBQUN5SixTQUFwQyxFQUErQztBQUMzQyxlQUFLM0ksSUFBTCxDQUFVTSxRQUFWLENBQW1CQyxlQUFuQixDQUFvQ0ksY0FBcEMsQ0FBbURxSSxRQUFuRCxFQUE2RGpELFVBQTdEO0FBQ0g7QUFDSjs7O3NDQUUwQjtBQUN2QixZQUFJMUYsS0FBSyxHQUFHLEtBQUtMLElBQUwsQ0FBVU0sUUFBVixDQUFtQkMsZUFBL0I7QUFDQSxZQUFNc0MsWUFBWSxHQUFHeEMsS0FBSyxDQUFDeUMsV0FBM0I7QUFDQSxZQUFNeUYsVUFBVSxHQUFHbEksS0FBSyxDQUFDRyxXQUF6Qjs7QUFFQSxZQUFJLEtBQUswSSxTQUFMLEtBQW1CL0osYUFBYSxDQUFDZ0ssVUFBckMsRUFBaUQ7QUFDN0MsZUFBS0MsMkJBQUwsQ0FBaUN2RyxZQUFqQyxFQUErQzBGLFVBQS9DO0FBRUgsU0FIRCxNQUdPLElBQUksS0FBS1csU0FBTCxLQUFtQi9KLGFBQWEsQ0FBQ2tLLFFBQXJDLEVBQStDO0FBQ2xELGVBQUtDLHlCQUFMLENBQStCekcsWUFBL0IsRUFBNkMwRixVQUE3QztBQUNIO0FBRUo7Ozs4Q0FFa0N0SSxRLEVBQTRCO0FBQzNELFlBQUkrSSxRQUFRLEdBQUcsQ0FBZjtBQUNBLFlBQUluRixnQkFBZ0IsR0FBRyxDQUF2Qjs7QUFDQSxZQUFJLEtBQUtPLFdBQUwsS0FBcUJsRixVQUFVLENBQUN5SixTQUFwQyxFQUErQztBQUMzQyxlQUFLLElBQUl4RyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbEMsUUFBUSxDQUFDQyxNQUE3QixFQUFxQyxFQUFFaUMsQ0FBdkMsRUFBMEM7QUFDdEMsZ0JBQU1DLEtBQUssR0FBR25DLFFBQVEsQ0FBQ2tDLENBQUQsQ0FBdEI7QUFDQUMsWUFBQUEsS0FBSyxDQUFDbUMsUUFBTixDQUFlL0UsVUFBZjtBQUNBLGdCQUFJOEUsVUFBVSxHQUFHbEMsS0FBSyxDQUFDOUIsUUFBTixDQUFlQyxlQUFoQzs7QUFDQSxnQkFBSTZCLEtBQUssQ0FBQzBCLGlCQUFOLElBQTJCUSxVQUEvQixFQUEyQztBQUN2Q1QsY0FBQUEsZ0JBQWdCO0FBQ2hCbUYsY0FBQUEsUUFBUSxJQUFJMUUsVUFBVSxDQUFDTCxLQUFYLEdBQW1CLEtBQUtRLGtCQUFMLENBQXdCakYsVUFBVSxDQUFDMEQsQ0FBbkMsQ0FBL0I7QUFDSDtBQUNKOztBQUNEOEYsVUFBQUEsUUFBUSxJQUFJLENBQUNuRixnQkFBZ0IsR0FBRyxDQUFwQixJQUF5QixLQUFLUCxTQUE5QixHQUEwQyxLQUFLdEMsWUFBL0MsR0FBOEQsS0FBS0MsYUFBL0U7QUFDSCxTQVhELE1BV087QUFDSCtILFVBQUFBLFFBQVEsR0FBRyxLQUFLaEosSUFBTCxDQUFVTSxRQUFWLENBQW1CQyxlQUFuQixDQUFvQzBELEtBQS9DO0FBQ0g7O0FBQ0QsZUFBTytFLFFBQVA7QUFDSDs7OzZDQUVpQy9JLFEsRUFBNEI7QUFDMUQsWUFBSXlJLFNBQVMsR0FBRyxDQUFoQjtBQUNBLFlBQUk3RSxnQkFBZ0IsR0FBRyxDQUF2Qjs7QUFDQSxZQUFJLEtBQUtPLFdBQUwsS0FBcUJsRixVQUFVLENBQUN5SixTQUFwQyxFQUErQztBQUMzQyxlQUFLLElBQUl4RyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbEMsUUFBUSxDQUFDQyxNQUE3QixFQUFxQyxFQUFFaUMsQ0FBdkMsRUFBMEM7QUFDdEMsZ0JBQU1DLEtBQUssR0FBR25DLFFBQVEsQ0FBQ2tDLENBQUQsQ0FBdEI7QUFDQUMsWUFBQUEsS0FBSyxDQUFDbUMsUUFBTixDQUFlL0UsVUFBZjtBQUNBLGdCQUFJOEUsVUFBVSxHQUFHbEMsS0FBSyxDQUFDOUIsUUFBTixDQUFlQyxlQUFoQzs7QUFDQSxnQkFBSTZCLEtBQUssQ0FBQzBCLGlCQUFOLElBQTJCUSxVQUEvQixFQUEyQztBQUN2Q1QsY0FBQUEsZ0JBQWdCO0FBQ2hCNkUsY0FBQUEsU0FBUyxJQUFJcEUsVUFBVSxDQUFDTSxNQUFYLEdBQXFCLEtBQUtILGtCQUFMLENBQXdCakYsVUFBVSxDQUFDbUYsQ0FBbkMsQ0FBbEM7QUFDSDtBQUNKOztBQUVEK0QsVUFBQUEsU0FBUyxJQUFJLENBQUM3RSxnQkFBZ0IsR0FBRyxDQUFwQixJQUF5QixLQUFLd0MsU0FBOUIsR0FBMEMsS0FBS2xGLGNBQS9DLEdBQWdFLEtBQUtELFdBQWxGO0FBQ0gsU0FaRCxNQVlPO0FBQ0h3SCxVQUFBQSxTQUFTLEdBQUcsS0FBSzFJLElBQUwsQ0FBVU0sUUFBVixDQUFtQkMsZUFBbkIsQ0FBb0NxRSxNQUFoRDtBQUNIOztBQUNELGVBQU84RCxTQUFQO0FBQ0g7OztrQ0FFc0I7QUFBQTs7QUFFbkIsWUFBSSxLQUFLeEUsYUFBTCxLQUF1QmpGLElBQUksQ0FBQ2tLLFVBQWhDLEVBQTRDO0FBQ3hDLGNBQU1ILFFBQVEsR0FBRyxLQUFLTyx1QkFBTCxDQUE2QixLQUFLdkosSUFBTCxDQUFVQyxRQUF2QyxDQUFqQjs7QUFFQSxjQUFNMEMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ1AsS0FBRCxFQUFpQjtBQUNqQyxnQkFBTW9ILEdBQUcsR0FBRyxNQUFJLENBQUN6SixRQUFMLEdBQWdCUixhQUFLbUIsSUFBckIsR0FBNEIwQixLQUFLLENBQUNxSCxRQUE5QztBQUNBLG1CQUFPRCxHQUFHLENBQUM3RSxDQUFYO0FBQ0gsV0FIRDs7QUFLQSxlQUFLa0UscUJBQUwsQ0FBMkJHLFFBQTNCLEVBQXFDLEtBQXJDLEVBQTRDckcsV0FBNUMsRUFBeUQsSUFBekQ7O0FBQ0EsZUFBSzVDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxlQUFLQyxJQUFMLENBQVVNLFFBQVYsQ0FBbUJDLGVBQW5CLENBQW9DMEQsS0FBcEMsR0FBNEMrRSxRQUE1QztBQUNILFNBWEQsTUFXTyxJQUFJLEtBQUs5RSxhQUFMLEtBQXVCakYsSUFBSSxDQUFDb0ssUUFBaEMsRUFBMEM7QUFDN0MsY0FBTVgsU0FBUyxHQUFHLEtBQUtnQixzQkFBTCxDQUE0QixLQUFLMUosSUFBTCxDQUFVQyxRQUF0QyxDQUFsQjs7QUFFQSxjQUFNZ0csV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQzdELEtBQUQsRUFBaUI7QUFDakMsZ0JBQU1vSCxHQUFHLEdBQUcsTUFBSSxDQUFDekosUUFBTCxHQUFnQlIsYUFBS21CLElBQXJCLEdBQTRCMEIsS0FBSyxDQUFDcUgsUUFBOUM7QUFDQSxtQkFBT0QsR0FBRyxDQUFDdEcsQ0FBWDtBQUNILFdBSEQ7O0FBS0EsZUFBSytGLG1CQUFMLENBQXlCUCxTQUF6QixFQUFvQyxLQUFwQyxFQUEyQ3pDLFdBQTNDLEVBQXdELElBQXhEOztBQUNBLGVBQUtsRyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsZUFBS0MsSUFBTCxDQUFVTSxRQUFWLENBQW1CQyxlQUFuQixDQUFvQ3FFLE1BQXBDLEdBQTZDOEQsU0FBN0M7QUFDSCxTQVhNLE1BV0EsSUFBSSxLQUFLeEUsYUFBTCxLQUF1QmpGLElBQUksQ0FBQzBLLElBQWhDLEVBQXNDO0FBQ3pDLGNBQUksS0FBS3ZGLFdBQUwsS0FBcUJsRixVQUFVLENBQUN5SixTQUFwQyxFQUErQztBQUMzQyxpQkFBS2lCLGNBQUw7QUFDSDtBQUNKLFNBSk0sTUFJQSxJQUFJLEtBQUsxRixhQUFMLEtBQXVCakYsSUFBSSxDQUFDa0YsSUFBaEMsRUFBc0M7QUFDekMsZUFBSzBGLGFBQUw7QUFDSDtBQUNKOzs7eUNBRTZCQyxLLEVBQU87QUFDakMsZUFBTyxLQUFLQyxnQkFBTCxHQUF3QkMsSUFBSSxDQUFDQyxHQUFMLENBQVNILEtBQVQsQ0FBeEIsR0FBMEMsQ0FBakQ7QUFDSDs7O3NDQUUwQkksSSxFQUFvQjtBQUMzQyxZQUFJLEVBQUVBLElBQUksR0FBR0MsdUJBQWFDLFFBQXRCLENBQUosRUFBb0M7QUFDaEM7QUFDSDs7QUFFRCxhQUFLdEosY0FBTDtBQUNIOzs7dUNBRTJCO0FBQ3hCLGFBQUtoQixZQUFMLEdBQW9CLElBQXBCO0FBQ0g7OztvQ0FFd0JvSyxJLEVBQW9CO0FBQ3pDLFlBQUlBLElBQUksR0FBR0MsdUJBQWFFLEtBQXhCLEVBQThCO0FBQzFCLGVBQUt2SyxZQUFMLEdBQW9CLEtBQUtBLFlBQUwsSUFBcUIsS0FBS2lLLGdCQUE5QztBQUNIO0FBQ0o7Ozs7QUFuK0JEOzs7Ozs7OzBCQVNZO0FBQ1IsZUFBTyxLQUFLN0YsYUFBWjtBQUNILE87d0JBRVM0RixLLEVBQWE7QUFDbkIsYUFBSzVGLGFBQUwsR0FBcUI0RixLQUFyQjs7QUFFQSxZQUFJUSw0QkFBVSxLQUFLcEcsYUFBTCxLQUF1QmpGLElBQUksQ0FBQzBLLElBQXRDLElBQThDLEtBQUt2RixXQUFMLEtBQXFCbEYsVUFBVSxDQUFDeUo7QUFBVTtBQUE1RixVQUF5SCxDQUNySDtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVELGFBQUs1SSxRQUFMLEdBQWdCLElBQWhCOztBQUNBLGFBQUtlLGNBQUw7QUFDSDtBQUNEOzs7Ozs7Ozs7OzBCQVNrQjtBQUNkLGVBQU8sS0FBS3NELFdBQVo7QUFDSCxPO3dCQUNlMEYsSyxFQUFPO0FBQ25CLFlBQUksS0FBSzVGLGFBQUwsS0FBdUJqRixJQUFJLENBQUMwSyxJQUE1QixJQUFvQ0csS0FBSyxLQUFLNUssVUFBVSxDQUFDbUYsUUFBN0QsRUFBdUU7QUFDbkU7QUFDSDs7QUFFRCxhQUFLRCxXQUFMLEdBQW1CMEYsS0FBbkI7O0FBQ0EsWUFBSVEsNEJBQVVSLEtBQUssS0FBSzVLLFVBQVUsQ0FBQ3lKO0FBQVU7QUFBN0MsVUFBMEUsQ0FDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFDRCxhQUFLN0gsY0FBTDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7MEJBU2dDO0FBQzVCLGVBQU8sS0FBS2tELFNBQVo7QUFDSCxPO3dCQUVhOEYsSyxFQUFPO0FBQ2pCLFlBQUksS0FBSzlGLFNBQUwsS0FBbUI4RixLQUF2QixFQUE4QjtBQUMxQjtBQUNIOztBQUVELGFBQUs5RixTQUFMLENBQWV4QixHQUFmLENBQW1Cc0gsS0FBbkI7O0FBQ0EsYUFBS2hKLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzswQkFVaUI7QUFDYixlQUFPLEtBQUt5SixVQUFaO0FBQ0gsTzt3QkFFY1QsSyxFQUFPO0FBQ2xCLFlBQUksS0FBS1MsVUFBTCxLQUFvQlQsS0FBeEIsRUFBK0I7QUFDM0I7QUFDSDs7QUFFRCxZQUFJUSw0QkFBVSxLQUFLbEcsV0FBTCxLQUFxQmxGLFVBQVUsQ0FBQ3lKLFNBQTFDLElBQXVELENBQUNWLHdCQUFTdUMsU0FBckUsRUFBZ0YsQ0FDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRCxhQUFLRCxVQUFMLEdBQWtCVCxLQUFsQjs7QUFDQSxhQUFLaEosY0FBTDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7MEJBUW1CO0FBQ2YsZUFBTyxLQUFLRSxZQUFaO0FBQ0gsTzt3QkFDZ0I4SSxLLEVBQU87QUFDcEIsWUFBSSxLQUFLOUksWUFBTCxLQUFzQjhJLEtBQTFCLEVBQWlDO0FBQzdCO0FBQ0g7O0FBRUQsYUFBSzlJLFlBQUwsR0FBb0I4SSxLQUFwQjs7QUFDQSxhQUFLaEosY0FBTDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7MEJBUW9CO0FBQ2hCLGVBQU8sS0FBS0csYUFBWjtBQUNILE87d0JBQ2lCNkksSyxFQUFPO0FBQ3JCLFlBQUksS0FBSzdJLGFBQUwsS0FBdUI2SSxLQUEzQixFQUFrQztBQUM5QjtBQUNIOztBQUVELGFBQUs3SSxhQUFMLEdBQXFCNkksS0FBckI7O0FBQ0EsYUFBS2hKLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVFrQjtBQUNkLGVBQU8sS0FBS0ksV0FBWjtBQUNILE87d0JBQ2U0SSxLLEVBQU87QUFDbkIsWUFBSSxLQUFLNUksV0FBTCxLQUFxQjRJLEtBQXpCLEVBQWdDO0FBQzVCO0FBQ0g7O0FBRUQsYUFBSzVJLFdBQUwsR0FBbUI0SSxLQUFuQjs7QUFDQSxhQUFLaEosY0FBTDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7MEJBUXFCO0FBQ2pCLGVBQU8sS0FBS0ssY0FBWjtBQUNILE87d0JBQ2tCMkksSyxFQUFPO0FBQ3RCLFlBQUksS0FBSzNJLGNBQUwsS0FBd0IySSxLQUE1QixFQUFtQztBQUMvQjtBQUNIOztBQUVELGFBQUszSSxjQUFMLEdBQXNCMkksS0FBdEI7O0FBQ0EsYUFBS2hKLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVFnQjtBQUNaLGVBQU8sS0FBS3dDLFNBQVo7QUFDSCxPO3dCQUVhd0csSyxFQUFPO0FBQ2pCLFlBQUksS0FBS3hHLFNBQUwsS0FBbUJ3RyxLQUF2QixFQUE4QjtBQUMxQjtBQUNIOztBQUVELGFBQUt4RyxTQUFMLEdBQWlCd0csS0FBakI7O0FBQ0EsYUFBS2hKLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVFnQjtBQUNaLGVBQU8sS0FBS3VGLFNBQVo7QUFDSCxPO3dCQUVheUQsSyxFQUFPO0FBQ2pCLFlBQUksS0FBS3pELFNBQUwsS0FBbUJ5RCxLQUF2QixFQUE4QjtBQUMxQjtBQUNIOztBQUVELGFBQUt6RCxTQUFMLEdBQWlCeUQsS0FBakI7O0FBQ0EsYUFBS2hKLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzswQkFVeUI7QUFDckIsZUFBTyxLQUFLK0Usa0JBQVo7QUFDSCxPO3dCQUVzQmlFLEssRUFBMEI7QUFDN0MsWUFBSSxLQUFLakUsa0JBQUwsS0FBNEJpRSxLQUFoQyxFQUF1QztBQUNuQztBQUNIOztBQUVELGFBQUtqRSxrQkFBTCxHQUEwQmlFLEtBQTFCOztBQUNBLGFBQUtoSixjQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7MEJBVTJCO0FBQ3ZCLGVBQU8sS0FBS3FDLG9CQUFaO0FBQ0gsTzt3QkFFd0IyRyxLLEVBQTRCO0FBQ2pELFlBQUksS0FBSzNHLG9CQUFMLEtBQThCMkcsS0FBbEMsRUFBeUM7QUFDckM7QUFDSDs7QUFFRCxhQUFLM0csb0JBQUwsR0FBNEIyRyxLQUE1Qjs7QUFDQSxhQUFLaEosY0FBTDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7MEJBUWU7QUFDWCxlQUFPLEtBQUtFLFlBQVo7QUFDSCxPO3dCQUVZOEksSyxFQUFPO0FBQ2hCLGFBQUtsSixVQUFMLEdBQWtCa0osS0FBbEI7O0FBRUEsYUFBS2pKLG1CQUFMOztBQUNBLGFBQUtDLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVF1QjtBQUNuQixlQUFPLEtBQUtpSixnQkFBWjtBQUNILE87d0JBRW9CRCxLLEVBQU87QUFDeEIsYUFBS0MsZ0JBQUwsR0FBd0JELEtBQXhCOztBQUNBLGFBQUtoSixjQUFMO0FBQ0g7Ozs7SUFwVHVCMkosb0IsV0FzVFZ4TCxJLEdBQU9BLEksVUFDUEcsaUIsR0FBb0JBLGlCLFVBQ3BCQyxtQixHQUFzQkEsbUIsVUFDdEJILFUsR0FBYUEsVSxVQUNiQyxhLEdBQWdCQSxhLDB3RUFFN0J1TCxtQjs7Ozs7YUFDdUJ4TCxVQUFVLENBQUN5SyxJOztvRkFFbENlLG1COzs7OzthQUN5QnpMLElBQUksQ0FBQzBLLEk7O2lGQUM5QmUsbUI7Ozs7O2FBQ3NCLEM7O2dGQUN0QkEsbUI7Ozs7O2FBQ3FCLElBQUk3SyxZQUFKLENBQVMsRUFBVCxFQUFhLEVBQWIsQzs7aUZBQ3JCNkssbUI7Ozs7O2FBQ3NCdkwsYUFBYSxDQUFDZ0ssVTs7bUZBQ3BDdUIsbUI7Ozs7O2FBQ3dCLEM7O29GQUN4QkEsbUI7Ozs7O2FBQ3lCLEM7O2tGQUN6QkEsbUI7Ozs7O2FBQ3VCLEM7O3FGQUN2QkEsbUI7Ozs7O2FBQzBCLEM7O2lGQUMxQkEsbUI7Ozs7O2FBQ3FCLEM7O2lGQUNyQkEsbUI7Ozs7O2FBQ3FCLEM7OzBGQUNyQkEsbUI7Ozs7O2FBQzhCdEwsaUJBQWlCLENBQUMwRyxhOzs0RkFDaEQ0RSxtQjs7Ozs7YUFDZ0NyTCxtQkFBbUIsQ0FBQytGLGE7O3dGQUNwRHNGLG1COzs7OzthQUM0QixLIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHJlcXVpcmVDb21wb25lbnQsIHRvb2x0aXAsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFJlY3QsIFNpemUsIFZlYzIsIFZlYzMgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBjY2VudW0gfSBmcm9tICcuLi8uLi9jb3JlL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5pbXBvcnQgeyBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXRyYW5zZm9ybSc7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1lbnVtJztcclxuaW1wb3J0IHsgZGlyZWN0b3IsIERpcmVjdG9yIH0gZnJvbSAnLi4vLi4vY29yZS9kaXJlY3Rvcic7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1lbnVtJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5jb25zdCBOb2RlRXZlbnQgPSBTeXN0ZW1FdmVudFR5cGU7XHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgbGF5b3V0LlxyXG4gKlxyXG4gKiBAemgg5biD5bGA57G75Z6L44CCXHJcbiAqL1xyXG5lbnVtIFR5cGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTm9uZSBMYXlvdXQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOWPlua2iOW4g+WxgOOAglxyXG4gICAgICovXHJcbiAgICBOT05FID0gMCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEhvcml6b250YWwgTGF5b3V0LlxyXG4gICAgICpcclxuICAgICAqIEB6aCDmsLTlubPluIPlsYDjgIJcclxuICAgICAqL1xyXG4gICAgSE9SSVpPTlRBTCA9IDEsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVmVydGljYWwgTGF5b3V0LlxyXG4gICAgICpcclxuICAgICAqIEB6aCDlnoLnm7TluIPlsYDjgIJcclxuICAgICAqL1xyXG4gICAgVkVSVElDQUwgPSAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR3JpZCBMYXlvdXQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOe9keagvOW4g+WxgOOAglxyXG4gICAgICovXHJcbiAgICBHUklEID0gMyxcclxufVxyXG5cclxuY2NlbnVtKFR5cGUpO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBMYXlvdXQgUmVzaXplIE1vZGUuXHJcbiAqXHJcbiAqIEB6aCDnvKnmlL7mqKHlvI/jgIJcclxuICovXHJcbmVudW0gUmVzaXplTW9kZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEb24ndCBzY2FsZS5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5LiN5YGa5Lu75L2V57yp5pS+44CCXHJcbiAgICAgKi9cclxuICAgIE5PTkUgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGNvbnRhaW5lciBzaXplIHdpbGwgYmUgZXhwYW5kZWQgd2l0aCBpdHMgY2hpbGRyZW4ncyBzaXplLlxyXG4gICAgICpcclxuICAgICAqIEB6aCDlrrnlmajnmoTlpKflsI/kvJrmoLnmja7lrZDoioLngrnnmoTlpKflsI/oh6rliqjnvKnmlL7jgIJcclxuICAgICAqL1xyXG4gICAgQ09OVEFJTkVSID0gMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIENoaWxkIGl0ZW0gc2l6ZSB3aWxsIGJlIGFkanVzdGVkIHdpdGggdGhlIGNvbnRhaW5lcidzIHNpemUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOWtkOiKgueCueeahOWkp+Wwj+S8mumaj+edgOWuueWZqOeahOWkp+Wwj+iHquWKqOe8qeaUvuOAglxyXG4gICAgICovXHJcbiAgICBDSElMRFJFTiA9IDIsXHJcbn1cclxuXHJcbmNjZW51bShSZXNpemVNb2RlKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgR3JpZCBMYXlvdXQgc3RhcnQgYXhpcyBkaXJlY3Rpb24uXHJcbiAqXHJcbiAqIEB6aCDluIPlsYDovbTlkJHvvIzlj6rnlKjkuo4gR1JJRCDluIPlsYDjgIJcclxuICovXHJcbmVudW0gQXhpc0RpcmVjdGlvbiB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaG9yaXpvbnRhbCBheGlzLlxyXG4gICAgICpcclxuICAgICAqIEB6aCDov5vooYzmsLTlubPmlrnlkJHluIPlsYDjgIJcclxuICAgICAqL1xyXG4gICAgSE9SSVpPTlRBTCA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgdmVydGljYWwgYXhpcy5cclxuICAgICAqXHJcbiAgICAgKiBAemgg6L+b6KGM5Z6C55u05pa55ZCR5biD5bGA44CCXHJcbiAgICAgKi9cclxuICAgIFZFUlRJQ0FMID0gMSxcclxufVxyXG5cclxuY2NlbnVtKEF4aXNEaXJlY3Rpb24pO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciB2ZXJ0aWNhbCBsYXlvdXQgZGlyZWN0aW9uLlxyXG4gKlxyXG4gKiBAemgg5Z6C55u05pa55ZCR5biD5bGA5pa55byP44CCXHJcbiAqL1xyXG5lbnVtIFZlcnRpY2FsRGlyZWN0aW9uIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEl0ZW1zIGFycmFuZ2VkIGZyb20gYm90dG9tIHRvIHRvcC5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5LuO5LiL5Yiw5LiK5o6S5YiX44CCXHJcbiAgICAgKi9cclxuICAgIEJPVFRPTV9UT19UT1AgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSXRlbXMgYXJyYW5nZWQgZnJvbSB0b3AgdG8gYm90dG9tLlxyXG4gICAgICogQHpoIOS7juS4iuWIsOS4i+aOkuWIl+OAglxyXG4gICAgICovXHJcbiAgICBUT1BfVE9fQk9UVE9NID0gMSxcclxufVxyXG5cclxuY2NlbnVtKFZlcnRpY2FsRGlyZWN0aW9uKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgaG9yaXpvbnRhbCBsYXlvdXQgZGlyZWN0aW9uLlxyXG4gKlxyXG4gKiBAemgg5rC05bmz5pa55ZCR5biD5bGA5pa55byP44CCXHJcbiAqL1xyXG5lbnVtIEhvcml6b250YWxEaXJlY3Rpb24ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSXRlbXMgYXJyYW5nZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxyXG4gICAgICpcclxuICAgICAqIEB6aCDku47lt6blvoDlj7PmjpLliJfjgIJcclxuICAgICAqL1xyXG4gICAgTEVGVF9UT19SSUdIVCA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJdGVtcyBhcnJhbmdlZCBmcm9tIHJpZ2h0IHRvIGxlZnQuXHJcbiAgICAgKiBAemgg5LuO5Y+z5b6A5bem5o6S5YiX44CCXHJcbiAgICAgKi9cclxuICAgIFJJR0hUX1RPX0xFRlQgPSAxLFxyXG59XHJcblxyXG5jY2VudW0oSG9yaXpvbnRhbERpcmVjdGlvbik7XHJcblxyXG5jb25zdCBfdGVtcFBvcyA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF90ZW1wU2NhbGUgPSBuZXcgVmVjMygpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgTGF5b3V0IGlzIGEgY29udGFpbmVyIGNvbXBvbmVudCwgdXNlIGl0IHRvIGFycmFuZ2UgY2hpbGQgZWxlbWVudHMgZWFzaWx5Ljxicj5cclxuICogTm90Ze+8mjxicj5cclxuICogMS5TY2FsaW5nIGFuZCByb3RhdGlvbiBvZiBjaGlsZCBub2RlcyBhcmUgbm90IGNvbnNpZGVyZWQuPGJyPlxyXG4gKiAyLkFmdGVyIHNldHRpbmcgdGhlIExheW91dCwgdGhlIHJlc3VsdHMgbmVlZCB0byBiZSB1cGRhdGVkIHVudGlsIHRoZSBuZXh0IGZyYW1lLHVubGVzcyB5b3UgbWFudWFsbHkgY2FsbC5bW3VwZGF0ZUxheW91dF1dXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiBMYXlvdXQg57uE5Lu255u45b2T5LqO5LiA5Liq5a655Zmo77yM6IO96Ieq5Yqo5a+55a6D55qE5omA5pyJ5a2Q6IqC54K56L+b6KGM57uf5LiA5o6S54mI44CCPGJyPlxyXG4gKiDms6jmhI/vvJo8YnI+XHJcbiAqIDEu5LiN5Lya6ICD6JmR5a2Q6IqC54K555qE57yp5pS+5ZKM5peL6L2s44CCPGJyPlxyXG4gKiAyLuWvuSBMYXlvdXQg6K6+572u5ZCO57uT5p6c6ZyA6KaB5Yiw5LiL5LiA5bin5omN5Lya5pu05paw77yM6Zmk6Z2e5L2g6K6+572u5a6M5Lul5ZCO5omL5Yqo6LCD55So44CCW1t1cGRhdGVMYXlvdXRdXVxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkxheW91dCcpXHJcbkBoZWxwKCdpMThuOmNjLkxheW91dCcpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9MYXlvdXQnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBMYXlvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbGF5b3V0IHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDluIPlsYDnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVHlwZSlcclxuICAgIEB0b29sdGlwKCfoh6rliqjluIPlsYDmqKHlvI/vvIzljIXmi6zvvJpcXG4gMS4gTk9ORe+8jOS4jeS8muWvueWtkOiKgueCuei/m+ihjOiHquWKqOW4g+WxgCBcXG4gMi4gSE9SSVpPTlRBTO+8jOaoquWQkeiHquWKqOaOkuW4g+WtkOeJqeS9kyBcXG4gMy4gVkVSVElDQUzvvIzlnoLnm7Toh6rliqjmjpLluIPlrZDniankvZNcXG4gNC4gR1JJRCwg6YeH55So572R5qC85pa55byP5a+55a2Q54mp5L2T6Ieq5Yqo6L+b6KGM5biD5bGAJylcclxuICAgIGdldCB0eXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fTiRsYXlvdXRUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0eXBlICh2YWx1ZTogVHlwZSkge1xyXG4gICAgICAgIHRoaXMuX04kbGF5b3V0VHlwZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoRURJVE9SICYmIHRoaXMuX04kbGF5b3V0VHlwZSAhPT0gVHlwZS5OT05FICYmIHRoaXMuX3Jlc2l6ZU1vZGUgPT09IFJlc2l6ZU1vZGUuQ09OVEFJTkVSIC8qJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcqLykge1xyXG4gICAgICAgICAgICAvLyBjb25zdCByZUxheW91dGVkID0gX1NjZW5lLkRldGVjdENvbmZsaWN0LmNoZWNrQ29uZmxpY3RfTGF5b3V0KHRoaXMpO1xyXG4gICAgICAgICAgICAvLyBpZiAocmVMYXlvdXRlZCkge1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0FsaWduID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGFyZSB0aHJlZSByZXNpemUgbW9kZXMgZm9yIExheW91dC4gTm9uZSwgcmVzaXplIENvbnRhaW5lciBhbmQgcmVzaXplIGNoaWxkcmVuLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog57yp5pS+5qih5byP44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFJlc2l6ZU1vZGUpXHJcbiAgICBAdG9vbHRpcCgn57yp5pS+5qih5byP77yM5YyF5ous77yaXFxuIDEuIE5PTkXvvIzkuI3kvJrlr7nlrZDoioLngrnlkozlrrnlmajov5vooYzlpKflsI/nvKnmlL4gXFxuIDIuIENPTlRBSU5FUiwg5a+55a655Zmo55qE5aSn5bCP6L+b6KGM57yp5pS+IFxcbiAzLiBDSElMRFJFTiwg5a+55a2Q6IqC54K555qE5aSn5bCP6L+b6KGM57yp5pS+JylcclxuICAgIGdldCByZXNpemVNb2RlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzaXplTW9kZTtcclxuICAgIH1cclxuICAgIHNldCByZXNpemVNb2RlICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9OJGxheW91dFR5cGUgPT09IFR5cGUuTk9ORSAmJiB2YWx1ZSA9PT0gUmVzaXplTW9kZS5DSElMRFJFTikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZXNpemVNb2RlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiB2YWx1ZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIgLyomJiAhY2MuZW5naW5lLmlzUGxheWluZyovKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHJlTGF5b3V0ZWQgPSBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuY2hlY2tDb25mbGljdF9MYXlvdXQodGhpcyk7XHJcbiAgICAgICAgICAgIC8vIGlmIChyZUxheW91dGVkKSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgY2VsbCBzaXplIGZvciBncmlkIGxheW91dC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOavj+S4quagvOWtkOeahOWkp+Wwj++8jOWPquacieW4g+WxgOexu+Wei+S4uiBHUklEIOeahOaXtuWAmeaJjeacieaViOOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5q+P5Liq5qC85a2Q55qE5aSn5bCP77yM5Y+q5pyJ5biD5bGA57G75Z6L5Li6IEdSSUQg55qE5pe25YCZ5omN5pyJ5pWIJylcclxuICAgIC8vIEBjb25zdGdldFxyXG4gICAgZ2V0IGNlbGxTaXplICgpOiBSZWFkb25seTxTaXplPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjZWxsU2l6ZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2VsbFNpemUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NlbGxTaXplLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgc3RhcnQgYXhpcyBmb3IgZ3JpZCBsYXlvdXQuIElmIHlvdSBjaG9vc2UgaG9yaXpvbnRhbCwgdGhlbiBjaGlsZHJlbiB3aWxsIGxheW91dCBob3Jpem9udGFsbHkgYXQgZmlyc3QsXHJcbiAgICAgKiBhbmQgdGhlbiBicmVhayBsaW5lIG9uIGRlbWFuZC4gQ2hvb3NlIHZlcnRpY2FsIGlmIHlvdSB3YW50IHRvIGxheW91dCB2ZXJ0aWNhbGx5IGF0IGZpcnN0IC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi1t+Wni+i9tOaWueWQkeexu+Wei++8jOWPr+i/m+ihjOawtOW5s+WSjOWeguebtOW4g+WxgOaOkuWIl++8jOWPquacieW4g+WxgOexu+Wei+S4uiBHUklEIOeahOaXtuWAmeaJjeacieaViOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShBeGlzRGlyZWN0aW9uKVxyXG4gICAgQHRvb2x0aXAoJ+i1t+Wni+i9tOaWueWQkeexu+Wei++8jOWPr+i/m+ihjOawtOW5s+WSjOWeguebtOW4g+WxgOaOkuWIl++8jOWPquacieW4g+WxgOexu+Wei+S4uiBHUklEIOeahOaXtuWAmeaJjeacieaViCcpXHJcbiAgICBnZXQgc3RhcnRBeGlzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRBeGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdGFydEF4aXMgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0QXhpcyA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiB0aGlzLl9yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUiAmJiAhbGVnYWN5Q0MuR0FNRV9WSUVXKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHJlTGF5b3V0ZWQgPSBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuY2hlY2tDb25mbGljdF9MYXlvdXQodGhpcyk7XHJcbiAgICAgICAgICAgIC8vIGlmIChyZUxheW91dGVkKSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3N0YXJ0QXhpcyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbGVmdCBwYWRkaW5nIG9mIGxheW91dCwgaXQgb25seSBlZmZlY3QgdGhlIGxheW91dCBpbiBvbmUgZGlyZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a655Zmo5YaF5bem6L656Led77yM5Y+q5Lya5Zyo5LiA5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWI44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflrrnlmajlhoXlt6bovrnot53vvIzlj6rkvJrlnKjkuIDkuKrluIPlsYDmlrnlkJHkuIrnlJ/mlYgnKVxyXG4gICAgZ2V0IHBhZGRpbmdMZWZ0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFkZGluZ0xlZnQ7XHJcbiAgICB9XHJcbiAgICBzZXQgcGFkZGluZ0xlZnQgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhZGRpbmdMZWZ0ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYWRkaW5nTGVmdCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHJpZ2h0IHBhZGRpbmcgb2YgbGF5b3V0LCBpdCBvbmx5IGVmZmVjdCB0aGUgbGF5b3V0IGluIG9uZSBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlrrnlmajlhoXlj7Povrnot53vvIzlj6rkvJrlnKjkuIDkuKrluIPlsYDmlrnlkJHkuIrnlJ/mlYjjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WuueWZqOWGheWPs+i+uei3ne+8jOWPquS8muWcqOS4gOS4quW4g+WxgOaWueWQkeS4iueUn+aViCcpXHJcbiAgICBnZXQgcGFkZGluZ1JpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFkZGluZ1JpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2V0IHBhZGRpbmdSaWdodCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFkZGluZ1JpZ2h0ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYWRkaW5nUmlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB0b3AgcGFkZGluZyBvZiBsYXlvdXQsIGl0IG9ubHkgZWZmZWN0IHRoZSBsYXlvdXQgaW4gb25lIGRpcmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWuueWZqOWGheS4iui+uei3ne+8jOWPquS8muWcqOS4gOS4quW4g+WxgOaWueWQkeS4iueUn+aViOOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5a655Zmo5YaF5LiK6L656Led77yM5Y+q5Lya5Zyo5LiA5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWIJylcclxuICAgIGdldCBwYWRkaW5nVG9wICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFkZGluZ1RvcDtcclxuICAgIH1cclxuICAgIHNldCBwYWRkaW5nVG9wICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYWRkaW5nVG9wID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYWRkaW5nVG9wID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgYm90dG9tIHBhZGRpbmcgb2YgbGF5b3V0LCBpdCBvbmx5IGVmZmVjdCB0aGUgbGF5b3V0IGluIG9uZSBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlrrnlmajlhoXkuIvovrnot53vvIzlj6rkvJrlnKjkuIDkuKrluIPlsYDmlrnlkJHkuIrnlJ/mlYjjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WuueWZqOWGheS4i+i+uei3ne+8jOWPquS8muWcqOS4gOS4quW4g+WxgOaWueWQkeS4iueUn+aViCcpXHJcbiAgICBnZXQgcGFkZGluZ0JvdHRvbSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhZGRpbmdCb3R0b207XHJcbiAgICB9XHJcbiAgICBzZXQgcGFkZGluZ0JvdHRvbSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFkZGluZ0JvdHRvbSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGFkZGluZ0JvdHRvbSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGRpc3RhbmNlIGluIHgtYXhpcyBiZXR3ZWVuIGVhY2ggZWxlbWVudCBpbiBsYXlvdXQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlrZDoioLngrnkuYvpl7TnmoTmsLTlubPpl7Tot53jgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WtkOiKgueCueS5i+mXtOeahOawtOW5s+mXtOi3nScpXHJcbiAgICBnZXQgc3BhY2luZ1ggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcGFjaW5nWDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3BhY2luZ1ggKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNpbmdYID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zcGFjaW5nWCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGRpc3RhbmNlIGluIHktYXhpcyBiZXR3ZWVuIGVhY2ggZWxlbWVudCBpbiBsYXlvdXQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlrZDoioLngrnkuYvpl7TnmoTlnoLnm7Tpl7Tot53jgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WtkOiKgueCueS5i+mXtOeahOWeguebtOmXtOi3nScpXHJcbiAgICBnZXQgc3BhY2luZ1kgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcGFjaW5nWTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3BhY2luZ1kgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NwYWNpbmdZID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zcGFjaW5nWSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogT25seSB0YWtlIGVmZmVjdCBpbiBWZXJ0aWNhbCBsYXlvdXQgbW9kZS5cclxuICAgICAqIFRoaXMgb3B0aW9uIGNoYW5nZXMgdGhlIHN0YXJ0IGVsZW1lbnQncyBwb3NpdGlvbmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWeguebtOaOkuWIl+WtkOiKgueCueeahOaWueWQkeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShWZXJ0aWNhbERpcmVjdGlvbilcclxuICAgIEB0b29sdGlwKCflnoLnm7TmjpLliJflrZDoioLngrnnmoTmlrnlkJEnKVxyXG4gICAgZ2V0IHZlcnRpY2FsRGlyZWN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxEaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZlcnRpY2FsRGlyZWN0aW9uICh2YWx1ZTogVmVydGljYWxEaXJlY3Rpb24pIHtcclxuICAgICAgICBpZiAodGhpcy5fdmVydGljYWxEaXJlY3Rpb24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZlcnRpY2FsRGlyZWN0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBPbmx5IHRha2UgZWZmZWN0IGluIGhvcml6b250YWwgbGF5b3V0IG1vZGUuXHJcbiAgICAgKiBUaGlzIG9wdGlvbiBjaGFuZ2VzIHRoZSBzdGFydCBlbGVtZW50J3MgcG9zaXRpb25pbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmsLTlubPmjpLliJflrZDoioLngrnnmoTmlrnlkJHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoSG9yaXpvbnRhbERpcmVjdGlvbilcclxuICAgIEB0b29sdGlwKCfmsLTlubPmjpLliJflrZDoioLngrnnmoTmlrnlkJEnKVxyXG4gICAgZ2V0IGhvcml6b250YWxEaXJlY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ob3Jpem9udGFsRGlyZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBob3Jpem9udGFsRGlyZWN0aW9uICh2YWx1ZTogSG9yaXpvbnRhbERpcmVjdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9ob3Jpem9udGFsRGlyZWN0aW9uID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ob3Jpem9udGFsRGlyZWN0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgcGFkZGluZyBvZiBsYXlvdXQsIGl0IHdpbGwgZWZmZWN0IHRoZSBsYXlvdXQgaW4gaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgZGlyZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a655Zmo5YaF6L656Led77yM6K+l5bGe5oCn5Lya5Zyo5Zub5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWI44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflrrnlmajlhoXovrnot53vvIzor6XlsZ7mgKfkvJrlnKjlm5vkuKrluIPlsYDmlrnlkJHkuIrnlJ/mlYgnKVxyXG4gICAgZ2V0IHBhZGRpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYWRkaW5nTGVmdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcGFkZGluZyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9OJHBhZGRpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWlncmF0ZVBhZGRpbmdEYXRhKCk7XHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGp1c3QgdGhlIGxheW91dCBpZiB0aGUgY2hpbGRyZW4gc2NhbGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a2Q6IqC54K557yp5pS+5q+U5L6L5piv5ZCm5b2x5ZON5biD5bGA44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflrZDoioLngrnnvKnmlL7mr5TkvovmmK/lkKblvbHlk43luIPlsYAnKVxyXG4gICAgZ2V0IGFmZmVjdGVkQnlTY2FsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FmZmVjdGVkQnlTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYWZmZWN0ZWRCeVNjYWxlICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2FmZmVjdGVkQnlTY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIFR5cGUgPSBUeXBlO1xyXG4gICAgcHVibGljIHN0YXRpYyBWZXJ0aWNhbERpcmVjdGlvbiA9IFZlcnRpY2FsRGlyZWN0aW9uO1xyXG4gICAgcHVibGljIHN0YXRpYyBIb3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbjtcclxuICAgIHB1YmxpYyBzdGF0aWMgUmVzaXplTW9kZSA9IFJlc2l6ZU1vZGU7XHJcbiAgICBwdWJsaWMgc3RhdGljIEF4aXNEaXJlY3Rpb24gPSBBeGlzRGlyZWN0aW9uO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcmVzaXplTW9kZSA9IFJlc2l6ZU1vZGUuTk9ORTtcclxuICAgIC8vIFRPRE86IHJlZmFjdG9yaW5nIHRoaXMgbmFtZSBhZnRlciBkYXRhIHVwZ3JhZGUgbWFjaGFuaXNtIGlzIG91dC5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfTiRsYXlvdXRUeXBlID0gVHlwZS5OT05FO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9OJHBhZGRpbmcgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jZWxsU2l6ZSA9IG5ldyBTaXplKDQwLCA0MCk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3N0YXJ0QXhpcyA9IEF4aXNEaXJlY3Rpb24uSE9SSVpPTlRBTDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcGFkZGluZ0xlZnQgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wYWRkaW5nUmlnaHQgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wYWRkaW5nVG9wID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcGFkZGluZ0JvdHRvbSA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3NwYWNpbmdYID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfc3BhY2luZ1kgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF92ZXJ0aWNhbERpcmVjdGlvbiA9IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT007XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2hvcml6b250YWxEaXJlY3Rpb24gPSBIb3Jpem9udGFsRGlyZWN0aW9uLkxFRlRfVE9fUklHSFQ7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2FmZmVjdGVkQnlTY2FsZSA9IGZhbHNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfbGF5b3V0U2l6ZSA9IG5ldyBTaXplKDMwMCwgMjAwKTtcclxuICAgIHByb3RlY3RlZCBfbGF5b3V0RGlydHkgPSB0cnVlO1xyXG4gICAgcHJvdGVjdGVkIF9pc0FsaWduID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFBlcmZvcm0gdGhlIGxheW91dCB1cGRhdGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnq4vljbPmiafooYzmm7TmlrDluIPlsYDjgIJcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIGltcG9ydCB7IExheW91dCwgbG9nIH0gZnJvbSAnY2MnO1xyXG4gICAgICogbGF5b3V0LnR5cGUgPSBMYXlvdXQuSE9SSVpPTlRBTDtcclxuICAgICAqIGxheW91dC5ub2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XHJcbiAgICAgKiBsb2coY2hpbGROb2RlLngpOyAvLyBub3QgeWV0IGNoYW5nZWRcclxuICAgICAqIGxheW91dC51cGRhdGVMYXlvdXQoKTtcclxuICAgICAqIGxvZyhjaGlsZE5vZGUueCk7IC8vIGNoYW5nZWRcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlTGF5b3V0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbGF5b3V0RGlydHkgJiYgdGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpO1xyXG5cclxuICAgICAgICBsZXQgdHJhbnMgPSB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICBpZiAodHJhbnMuY29udGVudFNpemUuZXF1YWxzKFNpemUuWkVSTykpIHtcclxuICAgICAgICAgICAgdHJhbnMuc2V0Q29udGVudFNpemUodGhpcy5fbGF5b3V0U2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fTiRwYWRkaW5nICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21pZ3JhdGVQYWRkaW5nRGF0YSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9taWdyYXRlUGFkZGluZ0RhdGEgKCkge1xyXG4gICAgICAgIHRoaXMuX3BhZGRpbmdMZWZ0ID0gdGhpcy5fTiRwYWRkaW5nO1xyXG4gICAgICAgIHRoaXMuX3BhZGRpbmdSaWdodCA9IHRoaXMuX04kcGFkZGluZztcclxuICAgICAgICB0aGlzLl9wYWRkaW5nVG9wID0gdGhpcy5fTiRwYWRkaW5nO1xyXG4gICAgICAgIHRoaXMuX3BhZGRpbmdCb3R0b20gPSB0aGlzLl9OJHBhZGRpbmc7XHJcbiAgICAgICAgdGhpcy5fTiRwYWRkaW5nID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2FkZEV2ZW50TGlzdGVuZXJzICgpIHtcclxuICAgICAgICBkaXJlY3Rvci5vbihEaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMudXBkYXRlTGF5b3V0LCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGVFdmVudC5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGVFdmVudC5DSElMRF9BRERFRCwgdGhpcy5fY2hpbGRBZGRlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGVFdmVudC5DSElMRF9SRU1PVkVELCB0aGlzLl9jaGlsZFJlbW92ZWQsIHRoaXMpO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZS5vbihOb2RlRXZlbnQuQ0hJTERfUkVPUkRFUiwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fYWRkQ2hpbGRyZW5FdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMgKCkge1xyXG4gICAgICAgIGRpcmVjdG9yLm9mZihEaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMudXBkYXRlTGF5b3V0LCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGVFdmVudC5TSVpFX0NIQU5HRUQsIHRoaXMuX3Jlc2l6ZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoTm9kZUV2ZW50LkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGVFdmVudC5DSElMRF9BRERFRCwgdGhpcy5fY2hpbGRBZGRlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihOb2RlRXZlbnQuQ0hJTERfUkVNT1ZFRCwgdGhpcy5fY2hpbGRSZW1vdmVkLCB0aGlzKTtcclxuICAgICAgICAvLyB0aGlzLm5vZGUub2ZmKE5vZGVFdmVudC5DSElMRF9SRU9SREVSLCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcclxuICAgICAgICB0aGlzLl9yZW1vdmVDaGlsZHJlbkV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hZGRDaGlsZHJlbkV2ZW50TGlzdGVuZXJzICgpIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGNoaWxkLm9uKE5vZGVFdmVudC5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy5fZG9TY2FsZURpcnR5LCB0aGlzKTtcclxuICAgICAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uKE5vZGVFdmVudC5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy5fdHJhbnNmb3JtRGlydHksIHRoaXMpO1xyXG4gICAgICAgICAgICBjaGlsZC5vbihOb2RlRXZlbnQuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX2RvTGF5b3V0RGlydHksIHRoaXMpO1xyXG4gICAgICAgICAgICBjaGlsZC5vbignYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkJywgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVtb3ZlQ2hpbGRyZW5FdmVudExpc3RlbmVycyAoKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl9kb1NjYWxlRGlydHksIHRoaXMpO1xyXG4gICAgICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9mZihOb2RlRXZlbnQuVFJBTlNGT1JNX0NIQU5HRUQsIHRoaXMuX3RyYW5zZm9ybURpcnR5LCB0aGlzKTtcclxuICAgICAgICAgICAgY2hpbGQub2ZmKE5vZGVFdmVudC5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9mZignYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkJywgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2hpbGRBZGRlZCAoY2hpbGQ6IE5vZGUpIHtcclxuICAgICAgICBjaGlsZC5vbihOb2RlRXZlbnQuVFJBTlNGT1JNX0NIQU5HRUQsIHRoaXMuX2RvU2NhbGVEaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl90cmFuc2Zvcm1EaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcclxuICAgICAgICBjaGlsZC5vbignYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkJywgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NoaWxkUmVtb3ZlZCAoY2hpbGQ6IE5vZGUpIHtcclxuICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl9kb1NjYWxlRGlydHksIHRoaXMpO1xyXG4gICAgICAgIGNoaWxkLm9mZihOb2RlRXZlbnQuU0laRV9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcclxuICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl90cmFuc2Zvcm1EaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgY2hpbGQub2ZmKE5vZGVFdmVudC5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XHJcbiAgICAgICAgY2hpbGQub2ZmKCdhY3RpdmUtaW4taGllcmFyY2h5LWNoYW5nZWQnLCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVzaXplZCAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGF5b3V0U2l6ZS5zZXQodGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemUpO1xyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RvTGF5b3V0SG9yaXpvbnRhbGx5IChiYXNlV2lkdGg6IG51bWJlciwgcm93QnJlYWs6IGJvb2xlYW4sIGZuUG9zaXRpb25ZOiBGdW5jdGlvbiwgYXBwbHlDaGlsZHJlbjogYm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IHRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3QgbGF5b3V0QW5jaG9yID0gdHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGxldCBzaWduID0gMTtcclxuICAgICAgICBsZXQgcGFkZGluZ1ggPSB0aGlzLl9wYWRkaW5nTGVmdDtcclxuICAgICAgICBsZXQgc3RhcnRQb3MgPSAtbGF5b3V0QW5jaG9yLnggKiBiYXNlV2lkdGg7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWxEaXJlY3Rpb24gPT09IEhvcml6b250YWxEaXJlY3Rpb24uUklHSFRfVE9fTEVGVCkge1xyXG4gICAgICAgICAgICBzaWduID0gLTE7XHJcbiAgICAgICAgICAgIHN0YXJ0UG9zID0gKDEgLSBsYXlvdXRBbmNob3IueCkgKiBiYXNlV2lkdGg7XHJcbiAgICAgICAgICAgIHBhZGRpbmdYID0gdGhpcy5fcGFkZGluZ1JpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5leHRYID0gc3RhcnRQb3MgKyBzaWduICogcGFkZGluZ1ggLSBzaWduICogdGhpcy5fc3BhY2luZ1g7XHJcbiAgICAgICAgbGV0IHJvd01heEhlaWdodCA9IDA7XHJcbiAgICAgICAgbGV0IHRlbXBNYXhIZWlnaHQgPSAwO1xyXG4gICAgICAgIGxldCBzZWNvbmRNYXhIZWlnaHQgPSAwO1xyXG4gICAgICAgIGxldCByb3cgPSAwO1xyXG4gICAgICAgIGxldCBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IDA7XHJcblxyXG4gICAgICAgIGxldCBtYXhIZWlnaHRDaGlsZEFuY2hvclkgPSAwO1xyXG5cclxuICAgICAgICBsZXQgYWN0aXZlQ2hpbGRDb3VudCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0uYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUNoaWxkQ291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld0NoaWxkV2lkdGggPSB0aGlzLl9jZWxsU2l6ZS53aWR0aDtcclxuICAgICAgICBpZiAodGhpcy5fTiRsYXlvdXRUeXBlICE9PSBUeXBlLkdSSUQgJiYgdGhpcy5fcmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DSElMRFJFTikge1xyXG4gICAgICAgICAgICBuZXdDaGlsZFdpZHRoID0gKGJhc2VXaWR0aCAtICh0aGlzLl9wYWRkaW5nTGVmdCArIHRoaXMuX3BhZGRpbmdSaWdodCkgLSAoYWN0aXZlQ2hpbGRDb3VudCAtIDEpICogdGhpcy5fc3BhY2luZ1gpIC8gYWN0aXZlQ2hpbGRDb3VudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRUcmFucyA9IGNoaWxkLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZC5hY3RpdmVJbkhpZXJhcmNoeSB8fCAhY2hpbGRUcmFucykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNoaWxkLmdldFNjYWxlKF90ZW1wU2NhbGUpO1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZFNjYWxlWCA9IHRoaXMuX2dldFVzZWRTY2FsZVZhbHVlKF90ZW1wU2NhbGUueCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkU2NhbGVZID0gdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoX3RlbXBTY2FsZS55KTtcclxuICAgICAgICAgICAgLy8gZm9yIHJlc2l6aW5nIGNoaWxkcmVuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNISUxEUkVOKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZFRyYW5zLndpZHRoID0gbmV3Q2hpbGRXaWR0aCAvIGNoaWxkU2NhbGVYO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX04kbGF5b3V0VHlwZSA9PT0gVHlwZS5HUklEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRUcmFucy5oZWlnaHQgPSB0aGlzLl9jZWxsU2l6ZS5oZWlnaHQgLyBjaGlsZFNjYWxlWTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGFuY2hvclggPSBjaGlsZFRyYW5zLmFuY2hvclg7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkQm91bmRpbmdCb3hXaWR0aCA9IGNoaWxkVHJhbnMud2lkdGggKiBjaGlsZFNjYWxlWDtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRCb3VuZGluZ0JveEhlaWdodCA9IGNoaWxkVHJhbnMuaGVpZ2h0ICogY2hpbGRTY2FsZVk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Vjb25kTWF4SGVpZ2h0ID4gdGVtcE1heEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1heEhlaWdodCA9IHNlY29uZE1heEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNoaWxkQm91bmRpbmdCb3hIZWlnaHQgPj0gdGVtcE1heEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kTWF4SGVpZ2h0ID0gdGVtcE1heEhlaWdodDtcclxuICAgICAgICAgICAgICAgIHRlbXBNYXhIZWlnaHQgPSBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgbWF4SGVpZ2h0Q2hpbGRBbmNob3JZID0gY2hpbGRUcmFucy5hbmNob3JZO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbERpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbERpcmVjdGlvbi5SSUdIVF9UT19MRUZUKSB7XHJcbiAgICAgICAgICAgICAgICBhbmNob3JYID0gMSAtIGNoaWxkVHJhbnMuYW5jaG9yWDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXh0WCA9IG5leHRYICsgc2lnbiAqIGFuY2hvclggKiBjaGlsZEJvdW5kaW5nQm94V2lkdGggKyBzaWduICogdGhpcy5fc3BhY2luZ1g7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0Qm91bmRhcnlPZkNoaWxkID0gc2lnbiAqICgxIC0gYW5jaG9yWCkgKiBjaGlsZEJvdW5kaW5nQm94V2lkdGg7XHJcblxyXG4gICAgICAgICAgICBpZiAocm93QnJlYWspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0JyZWFrQm91bmRhcnkgPSBuZXh0WCArIHJpZ2h0Qm91bmRhcnlPZkNoaWxkICsgc2lnbiAqIChzaWduID4gMCA/IHRoaXMuX3BhZGRpbmdSaWdodCA6IHRoaXMuX3BhZGRpbmdMZWZ0KTtcclxuICAgICAgICAgICAgICAgIGxldCBsZWZ0VG9SaWdodFJvd0JyZWFrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbERpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbERpcmVjdGlvbi5MRUZUX1RPX1JJR0hUICYmIHJvd0JyZWFrQm91bmRhcnkgPiAoMSAtIGxheW91dEFuY2hvci54KSAqIGJhc2VXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZnRUb1JpZ2h0Um93QnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCByaWdodFRvTGVmdFJvd0JyZWFrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbERpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbERpcmVjdGlvbi5SSUdIVF9UT19MRUZUICYmIHJvd0JyZWFrQm91bmRhcnkgPCAtbGF5b3V0QW5jaG9yLnggKiBiYXNlV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodFRvTGVmdFJvd0JyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGVmdFRvUmlnaHRSb3dCcmVhayB8fCByaWdodFRvTGVmdFJvd0JyZWFrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ID49IHRlbXBNYXhIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlY29uZE1heEhlaWdodCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kTWF4SGVpZ2h0ID0gdGVtcE1heEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dNYXhIZWlnaHQgKz0gc2Vjb25kTWF4SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRNYXhIZWlnaHQgPSB0ZW1wTWF4SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd01heEhlaWdodCArPSB0ZW1wTWF4SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRNYXhIZWlnaHQgPSBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTWF4SGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFggPSBzdGFydFBvcyArIHNpZ24gKiAocGFkZGluZ1ggKyBhbmNob3JYICogY2hpbGRCb3VuZGluZ0JveFdpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICByb3crKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmluYWxQb3NpdGlvblkgPSBmblBvc2l0aW9uWShjaGlsZCwgY2hpbGRUcmFucywgcm93TWF4SGVpZ2h0LCByb3cpO1xyXG4gICAgICAgICAgICBpZiAoYmFzZVdpZHRoID49IChjaGlsZEJvdW5kaW5nQm94V2lkdGggKyB0aGlzLl9wYWRkaW5nTGVmdCArIHRoaXMuX3BhZGRpbmdSaWdodCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcHBseUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuZ2V0UG9zaXRpb24oX3RlbXBQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnNldFBvc2l0aW9uKG5leHRYLCBmaW5hbFBvc2l0aW9uWSwgX3RlbXBQb3Mueik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBzaWduWCA9IDE7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wRmluYWxQb3NpdGlvblk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcE1hcmdpbiA9ICh0ZW1wTWF4SGVpZ2h0ID09PSAwKSA/IGNoaWxkQm91bmRpbmdCb3hIZWlnaHQgOiB0ZW1wTWF4SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZlcnRpY2FsRGlyZWN0aW9uID09PSBWZXJ0aWNhbERpcmVjdGlvbi5UT1BfVE9fQk9UVE9NKSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5IHx8IHRyYW5zLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIHNpZ25YID0gLTE7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRmluYWxQb3NpdGlvblkgPSBmaW5hbFBvc2l0aW9uWSArIHNpZ25YICogKHRvcE1hcmdpbiAqIG1heEhlaWdodENoaWxkQW5jaG9yWSArIHRoaXMuX3BhZGRpbmdCb3R0b20pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBGaW5hbFBvc2l0aW9uWSA8IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyUmVzaXplQm91bmRhcnkgPSB0ZW1wRmluYWxQb3NpdGlvblk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5IHx8IC10cmFucy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRmluYWxQb3NpdGlvblkgPSBmaW5hbFBvc2l0aW9uWSArIHNpZ25YICogKHRvcE1hcmdpbiAqIG1heEhlaWdodENoaWxkQW5jaG9yWSArIHRoaXMuX3BhZGRpbmdUb3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlbXBGaW5hbFBvc2l0aW9uWSA+IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyUmVzaXplQm91bmRhcnkgPSB0ZW1wRmluYWxQb3NpdGlvblk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5leHRYICs9IHJpZ2h0Qm91bmRhcnlPZkNoaWxkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZG9MYXlvdXRWZXJ0aWNhbGx5IChcclxuICAgICAgICBiYXNlSGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgY29sdW1uQnJlYWs6IGJvb2xlYW4sXHJcbiAgICAgICAgZm5Qb3NpdGlvblg6IEZ1bmN0aW9uLFxyXG4gICAgICAgIGFwcGx5Q2hpbGRyZW46IGJvb2xlYW4sXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0cmFucyA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgIGNvbnN0IGxheW91dEFuY2hvciA9IHRyYW5zLmFuY2hvclBvaW50O1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgICAgICBsZXQgc2lnbiA9IDE7XHJcbiAgICAgICAgbGV0IHBhZGRpbmdZID0gdGhpcy5fcGFkZGluZ0JvdHRvbTtcclxuICAgICAgICBsZXQgYm90dG9tQm91bmRhcnlPZkxheW91dCA9IC1sYXlvdXRBbmNob3IueSAqIGJhc2VIZWlnaHQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZlcnRpY2FsRGlyZWN0aW9uID09PSBWZXJ0aWNhbERpcmVjdGlvbi5UT1BfVE9fQk9UVE9NKSB7XHJcbiAgICAgICAgICAgIHNpZ24gPSAtMTtcclxuICAgICAgICAgICAgYm90dG9tQm91bmRhcnlPZkxheW91dCA9ICgxIC0gbGF5b3V0QW5jaG9yLnkpICogYmFzZUhlaWdodDtcclxuICAgICAgICAgICAgcGFkZGluZ1kgPSB0aGlzLl9wYWRkaW5nVG9wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5leHRZID0gYm90dG9tQm91bmRhcnlPZkxheW91dCArIHNpZ24gKiBwYWRkaW5nWSAtIHNpZ24gKiB0aGlzLl9zcGFjaW5nWTtcclxuICAgICAgICBsZXQgY29sdW1uTWF4V2lkdGggPSAwO1xyXG4gICAgICAgIGxldCB0ZW1wTWF4V2lkdGggPSAwO1xyXG4gICAgICAgIGxldCBzZWNvbmRNYXhXaWR0aCA9IDA7XHJcbiAgICAgICAgbGV0IGNvbHVtbiA9IDA7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gMDtcclxuICAgICAgICBsZXQgbWF4V2lkdGhDaGlsZEFuY2hvclggPSAwO1xyXG5cclxuICAgICAgICBsZXQgYWN0aXZlQ2hpbGRDb3VudCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0uYWN0aXZlSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUNoaWxkQ291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld0NoaWxkSGVpZ2h0ID0gdGhpcy5fY2VsbFNpemUuaGVpZ2h0O1xyXG4gICAgICAgIGlmICh0aGlzLl9OJGxheW91dFR5cGUgIT09IFR5cGUuR1JJRCAmJiB0aGlzLl9yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNISUxEUkVOKSB7XHJcbiAgICAgICAgICAgIG5ld0NoaWxkSGVpZ2h0ID0gKGJhc2VIZWlnaHQgLSAodGhpcy5fcGFkZGluZ1RvcCArIHRoaXMuX3BhZGRpbmdCb3R0b20pIC0gKGFjdGl2ZUNoaWxkQ291bnQgLSAxKSAqIHRoaXMuX3NwYWNpbmdZKSAvIGFjdGl2ZUNoaWxkQ291bnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IGNoaWxkLmdldFNjYWxlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkU2NhbGVYID0gdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoc2NhbGUueCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkU2NhbGVZID0gdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoc2NhbGUueSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkVHJhbnMgPSBjaGlsZC5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXA7XHJcbiAgICAgICAgICAgIGlmICghY2hpbGQuYWN0aXZlSW5IaWVyYXJjaHkgfHwgIWNoaWxkVHJhbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBmb3IgcmVzaXppbmcgY2hpbGRyZW5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZU1vZGUgPT09IFJlc2l6ZU1vZGUuQ0hJTERSRU4pIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkVHJhbnMuaGVpZ2h0ID0gbmV3Q2hpbGRIZWlnaHQgLyBjaGlsZFNjYWxlWTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9OJGxheW91dFR5cGUgPT09IFR5cGUuR1JJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkVHJhbnMud2lkdGggPSB0aGlzLl9jZWxsU2l6ZS53aWR0aCAvIGNoaWxkU2NhbGVYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYW5jaG9yWSA9IGNoaWxkVHJhbnMuYW5jaG9yWTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRCb3VuZGluZ0JveFdpZHRoID0gY2hpbGRUcmFucy53aWR0aCAqIGNoaWxkU2NhbGVYO1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ID0gY2hpbGRUcmFucy5oZWlnaHQgKiBjaGlsZFNjYWxlWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWNvbmRNYXhXaWR0aCA+IHRlbXBNYXhXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1heFdpZHRoID0gc2Vjb25kTWF4V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZEJvdW5kaW5nQm94V2lkdGggPj0gdGVtcE1heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRNYXhXaWR0aCA9IHRlbXBNYXhXaWR0aDtcclxuICAgICAgICAgICAgICAgIHRlbXBNYXhXaWR0aCA9IGNoaWxkQm91bmRpbmdCb3hXaWR0aDtcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoQ2hpbGRBbmNob3JYID0gY2hpbGRUcmFucy5hbmNob3JYO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00pIHtcclxuICAgICAgICAgICAgICAgIGFuY2hvclkgPSAxIC0gY2hpbGRUcmFucy5hbmNob3JZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5leHRZID0gbmV4dFkgKyBzaWduICogYW5jaG9yWSAqIGNoaWxkQm91bmRpbmdCb3hIZWlnaHQgKyBzaWduICogdGhpcy5fc3BhY2luZ1k7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcEJvdW5kYXJ5T2ZDaGlsZCA9IHNpZ24gKiAoMSAtIGFuY2hvclkpICogY2hpbGRCb3VuZGluZ0JveEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW5CcmVhaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uQnJlYWtCb3VuZGFyeSA9IG5leHRZICsgdG9wQm91bmRhcnlPZkNoaWxkICsgc2lnbiAqIChzaWduID4gMCA/IHRoaXMuX3BhZGRpbmdUb3AgOiB0aGlzLl9wYWRkaW5nQm90dG9tKTtcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b21Ub1RvcENvbHVtbkJyZWFrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLkJPVFRPTV9UT19UT1AgJiYgY29sdW1uQnJlYWtCb3VuZGFyeSA+ICgxIC0gbGF5b3V0QW5jaG9yLnkpICogYmFzZUhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbVRvVG9wQ29sdW1uQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0b3BUb0JvdHRvbUNvbHVtbkJyZWFrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00gJiYgY29sdW1uQnJlYWtCb3VuZGFyeSA8IC1sYXlvdXRBbmNob3IueSAqIGJhc2VIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BUb0JvdHRvbUNvbHVtbkJyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYm90dG9tVG9Ub3BDb2x1bW5CcmVhayB8fCB0b3BUb0JvdHRvbUNvbHVtbkJyZWFrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkQm91bmRpbmdCb3hXaWR0aCA+PSB0ZW1wTWF4V2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlY29uZE1heFdpZHRoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRNYXhXaWR0aCA9IHRlbXBNYXhXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5NYXhXaWR0aCArPSBzZWNvbmRNYXhXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kTWF4V2lkdGggPSB0ZW1wTWF4V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uTWF4V2lkdGggKz0gdGVtcE1heFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRNYXhXaWR0aCA9IGNoaWxkQm91bmRpbmdCb3hXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE1heFdpZHRoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFkgPSBib3R0b21Cb3VuZGFyeU9mTGF5b3V0ICsgc2lnbiAqIChwYWRkaW5nWSArIGFuY2hvclkgKiBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmluYWxQb3NpdGlvblggPSBmblBvc2l0aW9uWChjaGlsZCwgY2hpbGRUcmFucywgY29sdW1uTWF4V2lkdGgsIGNvbHVtbik7XHJcbiAgICAgICAgICAgIGlmIChiYXNlSGVpZ2h0ID49IChjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ICsgKHRoaXMuX3BhZGRpbmdUb3AgKyB0aGlzLl9wYWRkaW5nQm90dG9tKSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcHBseUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuZ2V0UG9zaXRpb24oX3RlbXBQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnNldFBvc2l0aW9uKGZpbmFsUG9zaXRpb25YLCBuZXh0WSwgX3RlbXBQb3Mueik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBzaWduWCA9IDE7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wRmluYWxQb3NpdGlvblg7XHJcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlIGl0ZW0gaXMgdGhlIGxhc3QgY29sdW1uIGJyZWFrIGl0ZW0sIHRoZSB0ZW1wTWF4V2lkdGggd2lsbCBiZSAwLlxyXG4gICAgICAgICAgICBjb25zdCByaWdodE1hcmdpbiA9ICh0ZW1wTWF4V2lkdGggPT09IDApID8gY2hpbGRCb3VuZGluZ0JveFdpZHRoIDogdGVtcE1heFdpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWxEaXJlY3Rpb24gPT09IEhvcml6b250YWxEaXJlY3Rpb24uUklHSFRfVE9fTEVGVCkge1xyXG4gICAgICAgICAgICAgICAgc2lnblggPSAtMTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gY29udGFpbmVyUmVzaXplQm91bmRhcnkgfHwgdHJhbnMud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRmluYWxQb3NpdGlvblggPSBmaW5hbFBvc2l0aW9uWCArIHNpZ25YICogKHJpZ2h0TWFyZ2luICogbWF4V2lkdGhDaGlsZEFuY2hvclggKyB0aGlzLl9wYWRkaW5nTGVmdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcEZpbmFsUG9zaXRpb25YIDwgY29udGFpbmVyUmVzaXplQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IHRlbXBGaW5hbFBvc2l0aW9uWDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gY29udGFpbmVyUmVzaXplQm91bmRhcnkgfHwgLXRyYW5zLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGVtcEZpbmFsUG9zaXRpb25YID0gZmluYWxQb3NpdGlvblggKyBzaWduWCAqIChyaWdodE1hcmdpbiAqIG1heFdpZHRoQ2hpbGRBbmNob3JYICsgdGhpcy5fcGFkZGluZ1JpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGlmICh0ZW1wRmluYWxQb3NpdGlvblggPiBjb250YWluZXJSZXNpemVCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gdGVtcEZpbmFsUG9zaXRpb25YO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV4dFkgKz0gdG9wQm91bmRhcnlPZkNoaWxkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZG9MYXlvdXRCYXNpYyAoKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgbGV0IGFsbENoaWxkcmVuQm91bmRpbmdCb3g6IFJlY3QgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZFRyYW5zZm9ybSA9IGNoaWxkLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5hY3RpdmVJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhbGxDaGlsZHJlbkJvdW5kaW5nQm94KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveCA9IGNoaWxkVHJhbnNmb3JtLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBSZWN0LnVuaW9uKGFsbENoaWxkcmVuQm91bmRpbmdCb3gsIGFsbENoaWxkcmVuQm91bmRpbmdCb3gsIGNoaWxkVHJhbnNmb3JtLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFsbENoaWxkcmVuQm91bmRpbmdCb3gpIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50VHJhbnNmb3JtID0gdGhpcy5ub2RlLnBhcmVudCEuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVmVjMy5zZXQoX3RlbXBQb3MsIGFsbENoaWxkcmVuQm91bmRpbmdCb3gueCwgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC55LCAwKTtcclxuICAgICAgICAgICAgY29uc3QgbGVmdEJvdHRvbUluUGFyZW50U3BhY2UgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgICAgICBwYXJlbnRUcmFuc2Zvcm0uY29udmVydFRvTm9kZVNwYWNlQVIoX3RlbXBQb3MsIGxlZnRCb3R0b21JblBhcmVudFNwYWNlKTtcclxuICAgICAgICAgICAgVmVjMy5zZXQobGVmdEJvdHRvbUluUGFyZW50U3BhY2UsXHJcbiAgICAgICAgICAgICAgICBsZWZ0Qm90dG9tSW5QYXJlbnRTcGFjZS54IC0gdGhpcy5fcGFkZGluZ0xlZnQsIGxlZnRCb3R0b21JblBhcmVudFNwYWNlLnkgLSB0aGlzLl9wYWRkaW5nQm90dG9tLFxyXG4gICAgICAgICAgICAgICAgbGVmdEJvdHRvbUluUGFyZW50U3BhY2Uueik7XHJcblxyXG4gICAgICAgICAgICBWZWMzLnNldChfdGVtcFBvcywgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC54ICsgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC53aWR0aCwgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC55ICsgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC5oZWlnaHQsIDApO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodFRvcEluUGFyZW50U3BhY2UgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgICAgICBwYXJlbnRUcmFuc2Zvcm0uY29udmVydFRvTm9kZVNwYWNlQVIoX3RlbXBQb3MsIHJpZ2h0VG9wSW5QYXJlbnRTcGFjZSk7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHJpZ2h0VG9wSW5QYXJlbnRTcGFjZSwgcmlnaHRUb3BJblBhcmVudFNwYWNlLnggKyB0aGlzLl9wYWRkaW5nUmlnaHQsIHJpZ2h0VG9wSW5QYXJlbnRTcGFjZS55ICsgdGhpcy5fcGFkZGluZ1RvcCwgcmlnaHRUb3BJblBhcmVudFNwYWNlLnopO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3U2l6ZSA9IGxlZ2FjeUNDLnNpemUocGFyc2VGbG9hdCgocmlnaHRUb3BJblBhcmVudFNwYWNlLnggLSBsZWZ0Qm90dG9tSW5QYXJlbnRTcGFjZS54KS50b0ZpeGVkKDIpKSxcclxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoKHJpZ2h0VG9wSW5QYXJlbnRTcGFjZS55IC0gbGVmdEJvdHRvbUluUGFyZW50U3BhY2UueSkudG9GaXhlZCgyKSkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ub2RlLmdldFBvc2l0aW9uKF90ZW1wUG9zKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnMgPSB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUud2lkdGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0FuY2hvclggPSAoX3RlbXBQb3MueCAtIGxlZnRCb3R0b21JblBhcmVudFNwYWNlLngpIC8gbmV3U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRyYW5zLmFuY2hvclggPSBwYXJzZUZsb2F0KG5ld0FuY2hvclgudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld1NpemUuaGVpZ2h0ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdBbmNob3JZID0gKF90ZW1wUG9zLnkgLSBsZWZ0Qm90dG9tSW5QYXJlbnRTcGFjZS55KSAvIG5ld1NpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdHJhbnMuYW5jaG9yWSA9IHBhcnNlRmxvYXQobmV3QW5jaG9yWS50b0ZpeGVkKDIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmFucy5zZXRDb250ZW50U2l6ZShuZXdTaXplKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kb0xheW91dEdyaWRBeGlzSG9yaXpvbnRhbCAobGF5b3V0QW5jaG9yLCBsYXlvdXRTaXplKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZVdpZHRoID0gbGF5b3V0U2l6ZS53aWR0aDtcclxuXHJcbiAgICAgICAgbGV0IHNpZ24gPSAxO1xyXG4gICAgICAgIGxldCBib3R0b21Cb3VuZGFyeU9mTGF5b3V0ID0gLWxheW91dEFuY2hvci55ICogbGF5b3V0U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IHBhZGRpbmdZID0gdGhpcy5fcGFkZGluZ0JvdHRvbTtcclxuICAgICAgICBpZiAodGhpcy5fdmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00pIHtcclxuICAgICAgICAgICAgc2lnbiA9IC0xO1xyXG4gICAgICAgICAgICBib3R0b21Cb3VuZGFyeU9mTGF5b3V0ID0gKDEgLSBsYXlvdXRBbmNob3IueSkgKiBsYXlvdXRTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgcGFkZGluZ1kgPSB0aGlzLl9wYWRkaW5nVG9wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgZm5Qb3NpdGlvblkgPSAoY2hpbGQ6IE5vZGUsIGNoaWxkVHJhbnM6IFVJVHJhbnNmb3JtLCB0b3BPZmZzZXQ6IG51bWJlciwgcm93OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgK1xyXG4gICAgICAgICAgICAgICAgc2lnbiAqICh0b3BPZmZzZXQgKyBjaGlsZFRyYW5zLmFuY2hvclkgKiBjaGlsZFRyYW5zLmhlaWdodCAqIHNlbGYuX2dldFVzZWRTY2FsZVZhbHVlKGNoaWxkLmdldFNjYWxlKCkueSkgKyBwYWRkaW5nWSArIHJvdyAqIHRoaXMuX3NwYWNpbmdZKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgbmV3SGVpZ2h0ID0gMDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIpIHtcclxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBuZXcgaGVpZ2h0IG9mIGNvbnRhaW5lciwgaXQgd29uJ3QgY2hhbmdlIHRoZSBwb3NpdGlvbiBvZiBpdCdzIGNoaWxkcmVuXHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kYXJ5ID0gdGhpcy5fZG9MYXlvdXRIb3Jpem9udGFsbHkoYmFzZVdpZHRoLCB0cnVlLCBmblBvc2l0aW9uWSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBuZXdIZWlnaHQgPSBib3R0b21Cb3VuZGFyeU9mTGF5b3V0IC0gYm91bmRhcnk7XHJcbiAgICAgICAgICAgIGlmIChuZXdIZWlnaHQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdIZWlnaHQgKj0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgPSAtbGF5b3V0QW5jaG9yLnkgKiBuZXdIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00pIHtcclxuICAgICAgICAgICAgICAgIHNpZ24gPSAtMTtcclxuICAgICAgICAgICAgICAgIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgPSAoMSAtIGxheW91dEFuY2hvci55KSAqIG5ld0hlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXRIb3Jpem9udGFsbHkoYmFzZVdpZHRoLCB0cnVlLCBmblBvc2l0aW9uWSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUikge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZShiYXNlV2lkdGgsIG5ld0hlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZG9MYXlvdXRHcmlkQXhpc1ZlcnRpY2FsIChsYXlvdXRBbmNob3I6IFZlYzIsIGxheW91dFNpemU6IFNpemUpIHtcclxuICAgICAgICBjb25zdCBiYXNlSGVpZ2h0ID0gbGF5b3V0U2l6ZS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGxldCBzaWduID0gMTtcclxuICAgICAgICBsZXQgbGVmdEJvdW5kYXJ5T2ZMYXlvdXQgPSAtbGF5b3V0QW5jaG9yLnggKiBsYXlvdXRTaXplLndpZHRoO1xyXG4gICAgICAgIGxldCBwYWRkaW5nWCA9IHRoaXMuX3BhZGRpbmdMZWZ0O1xyXG4gICAgICAgIGlmICh0aGlzLl9ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsRGlyZWN0aW9uLlJJR0hUX1RPX0xFRlQpIHtcclxuICAgICAgICAgICAgc2lnbiA9IC0xO1xyXG4gICAgICAgICAgICBsZWZ0Qm91bmRhcnlPZkxheW91dCA9ICgxIC0gbGF5b3V0QW5jaG9yLngpICogbGF5b3V0U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgcGFkZGluZ1ggPSB0aGlzLl9wYWRkaW5nUmlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCBmblBvc2l0aW9uWCA9IChjaGlsZDogTm9kZSwgY2hpbGRUcmFuczogVUlUcmFuc2Zvcm0sIGxlZnRPZmZzZXQ6IG51bWJlciwgY29sdW1uOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGxlZnRCb3VuZGFyeU9mTGF5b3V0ICtcclxuICAgICAgICAgICAgICAgIHNpZ24gKiAobGVmdE9mZnNldCArIGNoaWxkVHJhbnMuYW5jaG9yWCAqIGNoaWxkVHJhbnMud2lkdGggKiBzZWxmLl9nZXRVc2VkU2NhbGVWYWx1ZShjaGlsZC5nZXRTY2FsZSgpLngpICsgcGFkZGluZ1ggKyBjb2x1bW4gKiB0aGlzLl9zcGFjaW5nWCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IG5ld1dpZHRoID0gMDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIpIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRhcnkgPSB0aGlzLl9kb0xheW91dFZlcnRpY2FsbHkoYmFzZUhlaWdodCwgdHJ1ZSwgZm5Qb3NpdGlvblgsIGZhbHNlKTtcclxuICAgICAgICAgICAgbmV3V2lkdGggPSBsZWZ0Qm91bmRhcnlPZkxheW91dCAtIGJvdW5kYXJ5O1xyXG4gICAgICAgICAgICBpZiAobmV3V2lkdGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdXaWR0aCAqPSAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGVmdEJvdW5kYXJ5T2ZMYXlvdXQgPSAtbGF5b3V0QW5jaG9yLnggKiBuZXdXaWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsRGlyZWN0aW9uLlJJR0hUX1RPX0xFRlQpIHtcclxuICAgICAgICAgICAgICAgIHNpZ24gPSAtMTtcclxuICAgICAgICAgICAgICAgIGxlZnRCb3VuZGFyeU9mTGF5b3V0ID0gKDEgLSBsYXlvdXRBbmNob3IueCkgKiBuZXdXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZG9MYXlvdXRWZXJ0aWNhbGx5KGJhc2VIZWlnaHQsIHRydWUsIGZuUG9zaXRpb25YLCB0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZU1vZGUgPT09IFJlc2l6ZU1vZGUuQ09OVEFJTkVSKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLnNldENvbnRlbnRTaXplKG5ld1dpZHRoLCBiYXNlSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kb0xheW91dEdyaWQgKCkge1xyXG4gICAgICAgIGxldCB0cmFucyA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgIGNvbnN0IGxheW91dEFuY2hvciA9IHRyYW5zLmFuY2hvclBvaW50O1xyXG4gICAgICAgIGNvbnN0IGxheW91dFNpemUgPSB0cmFucy5jb250ZW50U2l6ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRBeGlzID09PSBBeGlzRGlyZWN0aW9uLkhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXRHcmlkQXhpc0hvcml6b250YWwobGF5b3V0QW5jaG9yLCBsYXlvdXRTaXplKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0QXhpcyA9PT0gQXhpc0RpcmVjdGlvbi5WRVJUSUNBTCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kb0xheW91dEdyaWRBeGlzVmVydGljYWwobGF5b3V0QW5jaG9yLCBsYXlvdXRTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0SG9yaXpvbnRhbEJhc2VXaWR0aCAoY2hpbGRyZW46IFJlYWRvbmx5PE5vZGVbXT4pIHtcclxuICAgICAgICBsZXQgbmV3V2lkdGggPSAwO1xyXG4gICAgICAgIGxldCBhY3RpdmVDaGlsZENvdW50ID0gMDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmdldFNjYWxlKF90ZW1wU2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkVHJhbnMgPSBjaGlsZC5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXA7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuYWN0aXZlSW5IaWVyYXJjaHkgJiYgY2hpbGRUcmFucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNoaWxkQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICBuZXdXaWR0aCArPSBjaGlsZFRyYW5zLndpZHRoICogdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoX3RlbXBTY2FsZS54KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdXaWR0aCArPSAoYWN0aXZlQ2hpbGRDb3VudCAtIDEpICogdGhpcy5fc3BhY2luZ1ggKyB0aGlzLl9wYWRkaW5nTGVmdCArIHRoaXMuX3BhZGRpbmdSaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdXaWR0aCA9IHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3V2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRWZXJ0aWNhbEJhc2VIZWlnaHQgKGNoaWxkcmVuOiBSZWFkb25seTxOb2RlW10+KSB7XHJcbiAgICAgICAgbGV0IG5ld0hlaWdodCA9IDA7XHJcbiAgICAgICAgbGV0IGFjdGl2ZUNoaWxkQ291bnQgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuZ2V0U2NhbGUoX3RlbXBTY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRUcmFucyA9IGNoaWxkLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5hY3RpdmVJbkhpZXJhcmNoeSAmJiBjaGlsZFRyYW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2hpbGRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0hlaWdodCArPSBjaGlsZFRyYW5zLmhlaWdodCEgKiB0aGlzLl9nZXRVc2VkU2NhbGVWYWx1ZShfdGVtcFNjYWxlLnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXdIZWlnaHQgKz0gKGFjdGl2ZUNoaWxkQ291bnQgLSAxKSAqIHRoaXMuX3NwYWNpbmdZICsgdGhpcy5fcGFkZGluZ0JvdHRvbSArIHRoaXMuX3BhZGRpbmdUb3A7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3SGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZG9MYXlvdXQgKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fTiRsYXlvdXRUeXBlID09PSBUeXBlLkhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3V2lkdGggPSB0aGlzLl9nZXRIb3Jpem9udGFsQmFzZVdpZHRoKHRoaXMubm9kZS5jaGlsZHJlbik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmblBvc2l0aW9uWSA9IChjaGlsZDogTm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5faXNBbGlnbiA/IFZlYzMuWkVSTyA6IGNoaWxkLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvcy55O1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXRIb3Jpem9udGFsbHkobmV3V2lkdGgsIGZhbHNlLCBmblBvc2l0aW9uWSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQWxpZ24gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEud2lkdGggPSBuZXdXaWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX04kbGF5b3V0VHlwZSA9PT0gVHlwZS5WRVJUSUNBTCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSB0aGlzLl9nZXRWZXJ0aWNhbEJhc2VIZWlnaHQodGhpcy5ub2RlLmNoaWxkcmVuKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZuUG9zaXRpb25YID0gKGNoaWxkOiBOb2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSB0aGlzLl9pc0FsaWduID8gVmVjMy5aRVJPIDogY2hpbGQucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zLng7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kb0xheW91dFZlcnRpY2FsbHkobmV3SGVpZ2h0LCBmYWxzZSwgZm5Qb3NpdGlvblgsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc0FsaWduID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLmhlaWdodCA9IG5ld0hlaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX04kbGF5b3V0VHlwZSA9PT0gVHlwZS5OT05FKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXRCYXNpYygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9OJGxheW91dFR5cGUgPT09IFR5cGUuR1JJRCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kb0xheW91dEdyaWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRVc2VkU2NhbGVWYWx1ZSAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWZmZWN0ZWRCeVNjYWxlID8gTWF0aC5hYnModmFsdWUpIDogMTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RyYW5zZm9ybURpcnR5ICh0eXBlOiBUcmFuc2Zvcm1CaXQpIHtcclxuICAgICAgICBpZiAoISh0eXBlICYgVHJhbnNmb3JtQml0LlBPU0lUSU9OKSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RvTGF5b3V0RGlydHkgKCkge1xyXG4gICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RvU2NhbGVEaXJ0eSAodHlwZTogVHJhbnNmb3JtQml0KSB7XHJcbiAgICAgICAgaWYgKHR5cGUgJiBUcmFuc2Zvcm1CaXQuU0NBTEUpe1xyXG4gICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRoaXMuX2xheW91dERpcnR5IHx8IHRoaXMuX2FmZmVjdGVkQnlTY2FsZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==