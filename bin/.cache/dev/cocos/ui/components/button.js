(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/assets/index.js", "../../core/components/index.js", "../../core/components/ui-base/index.js", "../../core/platform/index.js", "../../core/math/index.js", "../../core/value-types/enum.js", "../../core/math/utils.js", "../../core/scene-graph/node.js", "./sprite.js", "../../core/default-constants.js", "../../core/global-exports.js", "../../core/scene-graph/node-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/assets/index.js"), require("../../core/components/index.js"), require("../../core/components/ui-base/index.js"), require("../../core/platform/index.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("../../core/math/utils.js"), require("../../core/scene-graph/node.js"), require("./sprite.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"), require("../../core/scene-graph/node-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.index, global.index, global._enum, global.utils, global.node, global.sprite, global.defaultConstants, global.globalExports, global.nodeEnum);
    global.button = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _index5, _index6, _enum, _utils, _node, _sprite, _defaultConstants, _globalExports, _nodeEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Button = _exports.EventType = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class3, _temp;

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

  var _tempColor = new _index6.Color();
  /**
   * @en Enum for transition type.
   *
   * @zh 过渡类型。
   */


  var Transition;

  (function (Transition) {
    Transition[Transition["NONE"] = 0] = "NONE";
    Transition[Transition["COLOR"] = 1] = "COLOR";
    Transition[Transition["SPRITE"] = 2] = "SPRITE";
    Transition[Transition["SCALE"] = 3] = "SCALE";
  })(Transition || (Transition = {}));

  (0, _enum.ccenum)(Transition);
  var State;

  (function (State) {
    State["NORMAL"] = "normal";
    State["HOVER"] = "hover";
    State["PRESSED"] = "pressed";
    State["DISABLED"] = "disabled";
  })(State || (State = {}));

  var EventType;
  /**
   * @en
   * Button has 4 Transition types<br/>
   * When Button state changed:<br/>
   *  If Transition type is Button.Transition.NONE, Button will do nothing<br/>
   *  If Transition type is Button.Transition.COLOR, Button will change target's color<br/>
   *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite<br/>
   *  If Transition type is Button.Transition.SCALE, Button will change target node's scale<br/>
   *
   * Button will trigger 5 events:<br/>
   *  Button.EVENT_TOUCH_DOWN<br/>
   *  Button.EVENT_TOUCH_UP<br/>
   *  Button.EVENT_HOVER_IN<br/>
   *  Button.EVENT_HOVER_MOVE<br/>
   *  Button.EVENT_HOVER_OUT<br/>
   *  User can get the current clicked node with 'event.target' from event object which is passed as parameter in the callback function of click event.
   *
   * @zh
   * 按钮组件。可以被按下，或者点击。
   *
   * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
   *
   *   - Button.Transition.NONE   // 不做任何过渡
   *   - Button.Transition.COLOR  // 进行颜色之间过渡
   *   - Button.Transition.SPRITE // 进行精灵之间过渡
   *   - Button.Transition.SCALE // 进行缩放过渡
   *
   * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
   * 以下事件可以在全平台上都触发：
   *
   *   - cc.Node.EventType.TOUCH_START  // 按下时事件
   *   - cc.Node.EventType.TOUCH_Move   // 按住移动后事件
   *   - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
   *   - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
   *
   * 以下事件只在 PC 平台上触发：
   *
   *   - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
   *   - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
   *   - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
   *   - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
   *   - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
   *   - cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件
   *
   * 用户可以通过获取 __点击事件__ 回调函数的参数 event 的 target 属性获取当前点击对象。
   *
   * @example
   * ```ts
   * import { log, Node } from 'cc';
   * // Add an event to the button.
   * button.node.on(Node.EventType.TOUCH_START, (event) => {
   *     log("This is a callback after the trigger event");
   * });
   * // You could also add a click event
   * //Note: In this way, you can't get the touch event info, so use it wisely.
   * button.node.on('click', (button) => {
   *    //The event is a custom event, you could get the Button component via first argument
   * })
   * ```
   */

  _exports.EventType = EventType;

  (function (EventType) {
    EventType["CLICK"] = "click";
  })(EventType || (_exports.EventType = EventType = {}));

  var Button = (_dec = (0, _index.ccclass)('cc.Button'), _dec2 = (0, _index.help)('i18n:cc.Button'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/Button'), _dec5 = (0, _index.requireComponent)(_index4.UITransform), _dec6 = (0, _index.type)(_node.Node), _dec7 = (0, _index.displayOrder)(0), _dec8 = (0, _index.tooltip)('指定 Button 背景节点，Button 状态改变时会修改此节点的 Color 或 Sprite 属性'), _dec9 = (0, _index.displayOrder)(1), _dec10 = (0, _index.tooltip)('按钮是否可交互，这一项未选中时，按钮处在禁用状态'), _dec11 = (0, _index.type)(Transition), _dec12 = (0, _index.displayOrder)(2), _dec13 = (0, _index.tooltip)('按钮状态变化时的过渡类型'), _dec14 = (0, _index.tooltip)('普通状态的按钮背景颜色'), _dec15 = (0, _index.tooltip)('按下状态的按钮背景颜色'), _dec16 = (0, _index.tooltip)('悬停状态的按钮背景颜色'), _dec17 = (0, _index.tooltip)('禁用状态的按钮背景颜色'), _dec18 = (0, _index.rangeMin)(0), _dec19 = (0, _index.rangeMax)(10), _dec20 = (0, _index.tooltip)('按钮颜色变化或者缩放变化的过渡时间'), _dec21 = (0, _index.tooltip)('当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale。'), _dec22 = (0, _index.type)(_index2.SpriteFrame), _dec23 = (0, _index.tooltip)('普通状态的按钮背景图资源'), _dec24 = (0, _index.type)(_index2.SpriteFrame), _dec25 = (0, _index.tooltip)('按下状态的按钮背景图资源'), _dec26 = (0, _index.type)(_index2.SpriteFrame), _dec27 = (0, _index.tooltip)('悬停状态的按钮背景图资源'), _dec28 = (0, _index.type)(_index2.SpriteFrame), _dec29 = (0, _index.tooltip)('禁用状态的按钮背景图资源'), _dec30 = (0, _index.type)([_index3.EventHandler]), _dec31 = (0, _index.displayOrder)(20), _dec32 = (0, _index.tooltip)('按钮点击事件的列表。先将数量改为1或更多，就可以为每个点击事件设置接受者和处理方法'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(Button, _Component);

    function Button() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Button);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Button)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "clickEvents", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_interactable", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_transition", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_normalColor", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_hoverColor", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_pressedColor", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_disabledColor", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_normalSprite", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_hoverSprite", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_pressedSprite", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_disabledSprite", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_duration", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_zoomScale", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_target", _descriptor14, _assertThisInitialized(_this));

      _this._pressed = false;
      _this._hovered = false;
      _this._fromColor = new _index6.Color();
      _this._toColor = new _index6.Color();
      _this._time = 0;
      _this._transitionFinished = true;
      _this._fromScale = new _index6.Vec3();
      _this._toScale = new _index6.Vec3();
      _this._originalScale = null;
      _this._sprite = null;
      _this._targetScale = new _index6.Vec3();
      return _this;
    }

    _createClass(Button, [{
      key: "__preload",
      value: function __preload() {
        if (!this.target) {
          this.target = this.node;
        }

        var sprite = this.node.getComponent(_sprite.Sprite);

        if (sprite) {
          this._normalSprite = sprite.spriteFrame;
        }

        this._applyTarget();

        this._resetState();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        var _this2 = this;

        // check sprite frames
        //
        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.on(_index5.SystemEventType.TOUCH_START, this._onTouchBegan, this);
          this.node.on(_index5.SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
          this.node.on(_index5.SystemEventType.TOUCH_END, this._onTouchEnded, this);
          this.node.on(_index5.SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);
          this.node.on(_index5.SystemEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
          this.node.on(_index5.SystemEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        } else {
          this.node.on(_sprite.Sprite.EventType.SPRITE_FRAME_CHANGED, function (comp) {
            if (_this2._transition === Transition.SPRITE) {
              _this2._normalSprite = comp.spriteFrame;
            } else {
              // avoid serialization data loss when in no-sprite mode
              _this2._normalSprite = null;
              _this2._hoverSprite = null;
              _this2._pressedSprite = null;
              _this2._disabledSprite = null;
            }
          }, this);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._resetState();

        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.off(_index5.SystemEventType.TOUCH_START, this._onTouchBegan, this);
          this.node.off(_index5.SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
          this.node.off(_index5.SystemEventType.TOUCH_END, this._onTouchEnded, this);
          this.node.off(_index5.SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);
          this.node.off(_index5.SystemEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
          this.node.off(_index5.SystemEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        } else {
          this.node.off(_sprite.Sprite.EventType.SPRITE_FRAME_CHANGED);
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        var target = this.target;

        if (this._transitionFinished || !target) {
          return;
        }

        if (this._transition !== Transition.COLOR && this._transition !== Transition.SCALE) {
          return;
        }

        this._time += dt;
        var ratio = 1.0;

        if (this._duration > 0) {
          ratio = this._time / this._duration;
        }

        if (ratio >= 1) {
          ratio = 1;
        }

        var renderComp = target.getComponent(_index4.UIRenderable);

        if (!renderComp) {
          return;
        }

        if (this._transition === Transition.COLOR) {
          _index6.Color.lerp(_tempColor, this._fromColor, this._toColor, ratio);

          renderComp.color = _tempColor;
        } else if (this.transition === Transition.SCALE) {
          target.getScale(this._targetScale);
          this._targetScale.x = (0, _utils.lerp)(this._fromScale.x, this._toScale.x, ratio);
          this._targetScale.y = (0, _utils.lerp)(this._fromScale.y, this._toScale.y, ratio);
          target.setScale(this._targetScale);
        }

        if (ratio === 1) {
          this._transitionFinished = true;
        }
      }
    }, {
      key: "_resizeNodeToTargetNode",
      value: function _resizeNodeToTargetNode() {
        if (!this.target) {
          return;
        }

        var targetTrans = this.target._uiProps.uiTransformComp;

        if (_defaultConstants.EDITOR && targetTrans) {
          this.node._uiProps.uiTransformComp.setContentSize(targetTrans.contentSize);
        }
      }
    }, {
      key: "_resetState",
      value: function _resetState() {
        this._pressed = false;
        this._hovered = false; // Restore button status

        var target = this.target;

        if (!target) {
          return;
        }

        var renderComp = target.getComponent(_index4.UIRenderable);

        if (!renderComp) {
          return;
        }

        var transition = this._transition;

        if (transition === Transition.COLOR && this._interactable) {
          renderComp.color = this._normalColor;
        } else if (transition === Transition.SCALE && this._originalScale) {
          target.setScale(this._originalScale);
        }

        this._transitionFinished = true;
      }
    }, {
      key: "_registerNodeEvent",
      value: function _registerNodeEvent() {
        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.on(_index5.SystemEventType.TOUCH_START, this._onTouchBegan, this);
          this.node.on(_index5.SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
          this.node.on(_index5.SystemEventType.TOUCH_END, this._onTouchEnded, this);
          this.node.on(_index5.SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);
          this.node.on(_index5.SystemEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
          this.node.on(_index5.SystemEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        }
      }
    }, {
      key: "_registerTargetEvent",
      value: function _registerTargetEvent(target) {
        if (_defaultConstants.EDITOR && !_globalExports.legacyCC.GAME_VIEW) {
          target.on(_sprite.Sprite.EventType.SPRITE_FRAME_CHANGED, this._onTargetSpriteFrameChanged, this);
          target.on(_index5.SystemEventType.COLOR_CHANGED, this._onTargetColorChanged, this);
        }

        target.on(_index5.SystemEventType.TRANSFORM_CHANGED, this._onTargetTransformChanged, this);
      }
    }, {
      key: "_unregisterNodeEvent",
      value: function _unregisterNodeEvent() {
        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.off(_index5.SystemEventType.TOUCH_START, this._onTouchBegan, this);
          this.node.off(_index5.SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
          this.node.off(_index5.SystemEventType.TOUCH_END, this._onTouchEnded, this);
          this.node.off(_index5.SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);
          this.node.off(_index5.SystemEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
          this.node.off(_index5.SystemEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        }
      }
    }, {
      key: "_unregisterTargetEvent",
      value: function _unregisterTargetEvent(target) {
        if (_defaultConstants.EDITOR && !_globalExports.legacyCC.GAME_VIEW) {
          target.off(_sprite.Sprite.EventType.SPRITE_FRAME_CHANGED);
          target.off(_index5.SystemEventType.COLOR_CHANGED);
        }

        target.off(_index5.SystemEventType.TRANSFORM_CHANGED);
      }
    }, {
      key: "_getTargetSprite",
      value: function _getTargetSprite(target) {
        var sprite = null;

        if (target) {
          sprite = target.getComponent(_sprite.Sprite);
        }

        return sprite;
      }
    }, {
      key: "_applyTarget",
      value: function _applyTarget() {
        if (this.target) {
          this._sprite = this._getTargetSprite(this.target);

          if (!this._originalScale) {
            this._originalScale = new _index6.Vec3();
          }

          _index6.Vec3.copy(this._originalScale, this.target.getScale());
        }
      }
    }, {
      key: "_onTargetSpriteFrameChanged",
      value: function _onTargetSpriteFrameChanged(comp) {
        if (this._transition === Transition.SPRITE) {
          this._setCurrentStateSpriteFrame(comp.spriteFrame);
        }
      }
    }, {
      key: "_setCurrentStateSpriteFrame",
      value: function _setCurrentStateSpriteFrame(spriteFrame) {
        if (!spriteFrame) {
          return;
        }

        switch (this._getButtonState()) {
          case State.NORMAL:
            this._normalSprite = spriteFrame;
            break;

          case State.HOVER:
            this._hoverSprite = spriteFrame;
            break;

          case State.PRESSED:
            this._pressedSprite = spriteFrame;
            break;

          case State.DISABLED:
            this._disabledSprite = spriteFrame;
            break;
        }
      }
    }, {
      key: "_onTargetColorChanged",
      value: function _onTargetColorChanged(color) {
        if (this._transition === Transition.COLOR) {
          this._setCurrentStateColor(color);
        }
      }
    }, {
      key: "_setCurrentStateColor",
      value: function _setCurrentStateColor(color) {
        switch (this._getButtonState()) {
          case State.NORMAL:
            this._normalColor = color;
            break;

          case State.HOVER:
            this._hoverColor = color;
            break;

          case State.PRESSED:
            this._pressedColor = color;
            break;

          case State.DISABLED:
            this._disabledColor = color;
            break;
        }
      }
    }, {
      key: "_onTargetTransformChanged",
      value: function _onTargetTransformChanged(transformBit) {
        // update originalScale
        if (transformBit | _nodeEnum.TransformBit.SCALE && this._originalScale && this._transition === Transition.SCALE && this._transitionFinished) {
          _index6.Vec3.copy(this._originalScale, this.target.getScale());
        }
      } // touch event handler

    }, {
      key: "_onTouchBegan",
      value: function _onTouchBegan(event) {
        if (!this._interactable || !this.enabledInHierarchy) {
          return;
        }

        this._pressed = true;

        this._updateState();

        if (event) {
          event.propagationStopped = true;
        }
      }
    }, {
      key: "_onTouchMove",
      value: function _onTouchMove(event) {
        if (!this._interactable || !this.enabledInHierarchy || !this._pressed) {
          return;
        } // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving


        if (!event) {
          return false;
        }

        var touch = event.touch;

        if (!touch) {
          return false;
        }

        var hit = this.node._uiProps.uiTransformComp.isHit(touch.getUILocation());

        if (this._transition === Transition.SCALE && this.target && this._originalScale) {
          if (hit) {
            _index6.Vec3.copy(this._fromScale, this._originalScale);

            _index6.Vec3.multiplyScalar(this._toScale, this._originalScale, this._zoomScale);

            this._transitionFinished = false;
          } else {
            this._time = 0;
            this._transitionFinished = true;
            this.target.setScale(this._originalScale);
          }
        } else {
          var state;

          if (hit) {
            state = State.PRESSED;
          } else {
            state = State.NORMAL;
          }

          this._applyTransition(state);
        }

        if (event) {
          event.propagationStopped = true;
        }
      }
    }, {
      key: "_onTouchEnded",
      value: function _onTouchEnded(event) {
        if (!this._interactable || !this.enabledInHierarchy) {
          return;
        }

        if (this._pressed) {
          _index3.EventHandler.emitEvents(this.clickEvents, event);

          this.node.emit(EventType.CLICK, this);
        }

        this._pressed = false;

        this._updateState();

        if (event) {
          event.propagationStopped = true;
        }
      }
    }, {
      key: "_onTouchCancel",
      value: function _onTouchCancel(event) {
        if (!this._interactable || !this.enabledInHierarchy) {
          return;
        }

        this._pressed = false;

        this._updateState();
      }
    }, {
      key: "_onMouseMoveIn",
      value: function _onMouseMoveIn(event) {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) {
          return;
        }

        if (this._transition === Transition.SPRITE && !this._hoverSprite) {
          return;
        }

        if (!this._hovered) {
          this._hovered = true;

          this._updateState();
        }
      }
    }, {
      key: "_onMouseMoveOut",
      value: function _onMouseMoveOut(event) {
        if (this._hovered) {
          this._hovered = false;

          this._updateState();
        }
      } // state handler

    }, {
      key: "_updateState",
      value: function _updateState() {
        var state = this._getButtonState();

        this._applyTransition(state);
      }
    }, {
      key: "_getButtonState",
      value: function _getButtonState() {
        var state = State.NORMAL;

        if (!this._interactable) {
          state = State.DISABLED;
        } else if (this._pressed) {
          state = State.PRESSED;
        } else if (this._hovered) {
          state = State.HOVER;
        }

        return state.toString();
      }
    }, {
      key: "_updateColorTransition",
      value: function _updateColorTransition(state) {
        var _this$target;

        var color = this[state + 'Color'];
        var renderComp = (_this$target = this.target) === null || _this$target === void 0 ? void 0 : _this$target.getComponent(_index4.UIRenderable);

        if (!renderComp) {
          return;
        }

        if (_defaultConstants.EDITOR || state === State.DISABLED) {
          renderComp.color = color;
        } else {
          this._fromColor = renderComp.color.clone();
          this._toColor = color;
          this._time = 0;
          this._transitionFinished = false;
        }
      }
    }, {
      key: "_updateSpriteTransition",
      value: function _updateSpriteTransition(state) {
        var sprite = this[state + 'Sprite'];

        if (this._sprite && sprite) {
          this._sprite.spriteFrame = sprite;
        }
      }
    }, {
      key: "_updateScaleTransition",
      value: function _updateScaleTransition(state) {
        if (!this._interactable) {
          return;
        }

        if (state === State.PRESSED) {
          this._zoomUp();
        } else {
          this._zoomBack();
        }
      }
    }, {
      key: "_zoomUp",
      value: function _zoomUp() {
        // skip before __preload()
        if (!this._originalScale) {
          return;
        }

        _index6.Vec3.copy(this._fromScale, this._originalScale);

        _index6.Vec3.multiplyScalar(this._toScale, this._originalScale, this._zoomScale);

        this._time = 0;
        this._transitionFinished = false;
      }
    }, {
      key: "_zoomBack",
      value: function _zoomBack() {
        if (!this.target || !this._originalScale) {
          return;
        }

        _index6.Vec3.copy(this._fromScale, this.target.getScale());

        _index6.Vec3.copy(this._toScale, this._originalScale);

        this._time = 0;
        this._transitionFinished = false;
      }
    }, {
      key: "_applyTransition",
      value: function _applyTransition(state) {
        var transition = this._transition;

        if (transition === Transition.COLOR) {
          this._updateColorTransition(state);
        } else if (transition === Transition.SPRITE) {
          this._updateSpriteTransition(state);
        } else if (transition === Transition.SCALE) {
          this._updateScaleTransition(state);
        }
      }
    }, {
      key: "target",

      /**
       * @en
       * Transition target.
       * When Button state changed:
       * - If Transition type is Button.Transition.NONE, Button will do nothing.
       * - If Transition type is Button.Transition.COLOR, Button will change target's color.
       * - If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite.
       *
       * @zh
       * 需要过渡的目标。<br/>
       * 当前按钮状态改变规则：<br/>
       * - 如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。
       * - 如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。
       * - 如果 Transition type 选择 Button.Transition.Sprite，按钮会对目标 Sprite 进行 Sprite 之间的过渡。
       */
      get: function get() {
        return this._target || this.node;
      },
      set: function set(value) {
        if (this._target === value) {
          return;
        }

        if (this._target) {
          // need to remove the old target event listeners
          this._unregisterTargetEvent(this._target);
        }

        this._target = value;

        this._applyTarget();
      }
      /**
       * @en
       * Whether the Button is disabled.
       * If true, the Button will trigger event and do transition.
       *
       * @zh
       * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
       */

    }, {
      key: "interactable",
      get: function get() {
        return this._interactable;
      },
      set: function set(value) {
        // if (EDITOR) {
        //     if (value) {
        //         this._previousNormalSprite = this.normalSprite;
        //     } else {
        //         this.normalSprite = this._previousNormalSprite;
        //     }
        // }
        this._interactable = value;

        this._updateState();

        if (!this._interactable) {
          this._resetState();
        }
      }
    }, {
      key: "_resizeToTarget",
      set: function set(value) {
        if (value) {
          this._resizeNodeToTargetNode();
        }
      }
      /**
       * @en
       * Transition type.
       *
       * @zh
       * 按钮状态改变时过渡方式。
       */

    }, {
      key: "transition",
      get: function get() {
        return this._transition;
      },
      set: function set(value) {
        if (this._transition === value) {
          return;
        } // Reset to normal data when change transition.


        if (this._transition === Transition.COLOR) {
          this._updateColorTransition(State.NORMAL);
        } else if (this._transition === Transition.SPRITE) {
          this._updateSpriteTransition(State.NORMAL);
        }

        this._transition = value;

        this._updateState();
      } // color transition

      /**
       * @en
       * Normal state color.
       *
       * @zh
       * 普通状态下按钮所显示的颜色。
       */

    }, {
      key: "normalColor",
      get: function get() {
        return this._normalColor;
      },
      set: function set(value) {
        if (this._normalColor === value) {
          return;
        }

        this._normalColor.set(value);

        this._updateState();
      }
      /**
       * @en
       * Pressed state color.
       *
       * @zh
       * 按下状态时按钮所显示的颜色。
       */

    }, {
      key: "pressedColor",
      get: function get() {
        return this._pressedColor;
      },
      set: function set(value) {
        if (this._pressedColor === value) {
          return;
        }

        this._pressedColor.set(value);
      }
      /**
       * @en
       * Hover state color.
       *
       * @zh
       * 悬停状态下按钮所显示的颜色。
       */

    }, {
      key: "hoverColor",
      get: function get() {
        return this._hoverColor;
      },
      set: function set(value) {
        if (this._hoverColor === value) {
          return;
        }

        this._hoverColor.set(value);
      }
      /**
       * @en
       * Disabled state color.
       *
       * @zh
       * 禁用状态下按钮所显示的颜色。
       */

    }, {
      key: "disabledColor",
      get: function get() {
        return this._disabledColor;
      },
      set: function set(value) {
        if (this._disabledColor === value) {
          return;
        }

        this._disabledColor.set(value);

        this._updateState();
      }
      /**
       * @en
       * Color and Scale transition duration.
       *
       * @zh
       * 颜色过渡和缩放过渡时所需时间。
       */

    }, {
      key: "duration",
      get: function get() {
        return this._duration;
      },
      set: function set(value) {
        if (this._duration === value) {
          return;
        }

        this._duration = value;
      }
      /**
       * @en
       * When user press the button, the button will zoom to a scale.
       * The final scale of the button equals (button original scale * zoomScale)
       * NOTE: Setting zoomScale less than 1 is not adviced, which could fire the touchCancel event if the touch point is out of touch area after scaling. 
       * if you need to do so, you should set target as another background node instead of the button node.
       *
       * @zh
       * 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale。
       * 注意：不建议 zoomScale 的值小于 1, 否则缩放后如果触摸点在触摸区域外, 则会触发 touchCancel 事件。
       * 如果你需要这么做，你应该把 target 设置为另一个背景节点，而不是按钮节点。
       */

    }, {
      key: "zoomScale",
      get: function get() {
        return this._zoomScale;
      },
      set: function set(value) {
        if (this._zoomScale === value) {
          return;
        }

        this._zoomScale = value;
      } // sprite transition

      /**
       * @en
       * Normal state sprite.
       *
       * @zh
       * 普通状态下按钮所显示的 Sprite。
       */

    }, {
      key: "normalSprite",
      get: function get() {
        return this._normalSprite;
      },
      set: function set(value) {
        if (this._normalSprite === value) {
          return;
        }

        this._normalSprite = value;
        var sprite = this.node.getComponent(_sprite.Sprite);

        if (sprite) {
          sprite.spriteFrame = value;
        }

        this._updateState();
      }
      /**
       * @en
       * Pressed state sprite.
       *
       * @zh
       * 按下状态时按钮所显示的 Sprite。
       */

    }, {
      key: "pressedSprite",
      get: function get() {
        return this._pressedSprite;
      },
      set: function set(value) {
        if (this._pressedSprite === value) {
          return;
        }

        this._pressedSprite = value;

        this._updateState();
      }
      /**
       * @en
       * Hover state sprite.
       *
       * @zh
       * 悬停状态下按钮所显示的 Sprite。
       */

    }, {
      key: "hoverSprite",
      get: function get() {
        return this._hoverSprite;
      },
      set: function set(value) {
        if (this._hoverSprite === value) {
          return;
        }

        this._hoverSprite = value;

        this._updateState();
      }
      /**
       * @en
       * Disabled state sprite.
       *
       * @zh
       * 禁用状态下按钮所显示的 Sprite。
       */

    }, {
      key: "disabledSprite",
      get: function get() {
        return this._disabledSprite;
      },
      set: function set(value) {
        if (this._disabledSprite === value) {
          return;
        }

        this._disabledSprite = value;

        this._updateState();
      }
    }]);

    return Button;
  }(_index3.Component), _class3.Transition = Transition, _class3.EventType = EventType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "target", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "target"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "interactable", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "interactable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "transition", [_dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "transition"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "normalColor", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "normalColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "pressedColor", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "pressedColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "hoverColor", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "hoverColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "disabledColor", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "disabledColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec18, _dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "duration"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "zoomScale", [_dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "zoomScale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "normalSprite", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "normalSprite"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "pressedSprite", [_dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "pressedSprite"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "hoverSprite", [_dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "hoverSprite"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "disabledSprite", [_dec28, _dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "disabledSprite"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "clickEvents", [_dec30, _index.serializable, _dec31, _dec32], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_interactable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_transition", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Transition.NONE;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_normalColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index6.Color(214, 214, 214, 255);
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_hoverColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index6.Color(211, 211, 211, 255);
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_pressedColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index6.Color.WHITE.clone();
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_disabledColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index6.Color(124, 124, 124, 255);
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_normalSprite", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_hoverSprite", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_pressedSprite", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_disabledSprite", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_duration", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_zoomScale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1.2;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_target", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  /**
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event click
   * @param {Event.EventCustom} event
   * @param {Button} button - The Button component.
   */

  _exports.Button = Button;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvYnV0dG9uLnRzIl0sIm5hbWVzIjpbIl90ZW1wQ29sb3IiLCJDb2xvciIsIlRyYW5zaXRpb24iLCJTdGF0ZSIsIkV2ZW50VHlwZSIsIkJ1dHRvbiIsIlVJVHJhbnNmb3JtIiwiTm9kZSIsIlNwcml0ZUZyYW1lIiwiQ29tcG9uZW50RXZlbnRIYW5kbGVyIiwiX3ByZXNzZWQiLCJfaG92ZXJlZCIsIl9mcm9tQ29sb3IiLCJfdG9Db2xvciIsIl90aW1lIiwiX3RyYW5zaXRpb25GaW5pc2hlZCIsIl9mcm9tU2NhbGUiLCJWZWMzIiwiX3RvU2NhbGUiLCJfb3JpZ2luYWxTY2FsZSIsIl9zcHJpdGUiLCJfdGFyZ2V0U2NhbGUiLCJ0YXJnZXQiLCJub2RlIiwic3ByaXRlIiwiZ2V0Q29tcG9uZW50IiwiU3ByaXRlIiwiX25vcm1hbFNwcml0ZSIsInNwcml0ZUZyYW1lIiwiX2FwcGx5VGFyZ2V0IiwiX3Jlc2V0U3RhdGUiLCJFRElUT1IiLCJsZWdhY3lDQyIsIkdBTUVfVklFVyIsIm9uIiwiU3lzdGVtRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJfb25Ub3VjaEJlZ2FuIiwiVE9VQ0hfTU9WRSIsIl9vblRvdWNoTW92ZSIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJUT1VDSF9DQU5DRUwiLCJfb25Ub3VjaENhbmNlbCIsIk1PVVNFX0VOVEVSIiwiX29uTW91c2VNb3ZlSW4iLCJNT1VTRV9MRUFWRSIsIl9vbk1vdXNlTW92ZU91dCIsIlNQUklURV9GUkFNRV9DSEFOR0VEIiwiY29tcCIsIl90cmFuc2l0aW9uIiwiU1BSSVRFIiwiX2hvdmVyU3ByaXRlIiwiX3ByZXNzZWRTcHJpdGUiLCJfZGlzYWJsZWRTcHJpdGUiLCJvZmYiLCJkdCIsIkNPTE9SIiwiU0NBTEUiLCJyYXRpbyIsIl9kdXJhdGlvbiIsInJlbmRlckNvbXAiLCJVSVJlbmRlcmFibGUiLCJsZXJwIiwiY29sb3IiLCJ0cmFuc2l0aW9uIiwiZ2V0U2NhbGUiLCJ4IiwieSIsInNldFNjYWxlIiwidGFyZ2V0VHJhbnMiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsInNldENvbnRlbnRTaXplIiwiY29udGVudFNpemUiLCJfaW50ZXJhY3RhYmxlIiwiX25vcm1hbENvbG9yIiwiX29uVGFyZ2V0U3ByaXRlRnJhbWVDaGFuZ2VkIiwiQ09MT1JfQ0hBTkdFRCIsIl9vblRhcmdldENvbG9yQ2hhbmdlZCIsIlRSQU5TRk9STV9DSEFOR0VEIiwiX29uVGFyZ2V0VHJhbnNmb3JtQ2hhbmdlZCIsIl9nZXRUYXJnZXRTcHJpdGUiLCJjb3B5IiwiX3NldEN1cnJlbnRTdGF0ZVNwcml0ZUZyYW1lIiwiX2dldEJ1dHRvblN0YXRlIiwiTk9STUFMIiwiSE9WRVIiLCJQUkVTU0VEIiwiRElTQUJMRUQiLCJfc2V0Q3VycmVudFN0YXRlQ29sb3IiLCJfaG92ZXJDb2xvciIsIl9wcmVzc2VkQ29sb3IiLCJfZGlzYWJsZWRDb2xvciIsInRyYW5zZm9ybUJpdCIsIlRyYW5zZm9ybUJpdCIsImV2ZW50IiwiZW5hYmxlZEluSGllcmFyY2h5IiwiX3VwZGF0ZVN0YXRlIiwicHJvcGFnYXRpb25TdG9wcGVkIiwidG91Y2giLCJoaXQiLCJpc0hpdCIsImdldFVJTG9jYXRpb24iLCJtdWx0aXBseVNjYWxhciIsIl96b29tU2NhbGUiLCJzdGF0ZSIsIl9hcHBseVRyYW5zaXRpb24iLCJlbWl0RXZlbnRzIiwiY2xpY2tFdmVudHMiLCJlbWl0IiwiQ0xJQ0siLCJpbnRlcmFjdGFibGUiLCJ0b1N0cmluZyIsImNsb25lIiwiX3pvb21VcCIsIl96b29tQmFjayIsIl91cGRhdGVDb2xvclRyYW5zaXRpb24iLCJfdXBkYXRlU3ByaXRlVHJhbnNpdGlvbiIsIl91cGRhdGVTY2FsZVRyYW5zaXRpb24iLCJfdGFyZ2V0IiwidmFsdWUiLCJfdW5yZWdpc3RlclRhcmdldEV2ZW50IiwiX3Jlc2l6ZU5vZGVUb1RhcmdldE5vZGUiLCJzZXQiLCJDb21wb25lbnQi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QUFwQjs7QUFDQSxhQUFLdkIsWUFBTDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7MEJBU3NCO0FBQ2xCLGVBQU8sS0FBSzVDLGVBQVo7QUFDSCxPO3dCQUVtQm1FLEssRUFBMkI7QUFDM0MsWUFBSSxLQUFLbkUsZUFBTCxLQUF5Qm1FLEtBQTdCLEVBQW9DO0FBQ2hDO0FBQ0g7O0FBRUQsYUFBS25FLGVBQUwsR0FBdUJtRSxLQUF2Qjs7QUFDQSxhQUFLdkIsWUFBTDtBQUNIOzs7O0lBeFV1QjJCLGlCLFdBMFVWM0gsVSxHQUFhQSxVLFVBQ2JFLFMsR0FBWUEsUyx1cUVBU3pCMEgsbUI7Ozs7O2FBRzZDLEU7O29GQUM3Q0EsbUI7Ozs7O2FBQ3lCLEk7O2tGQUN6QkEsbUI7Ozs7O2FBQ3VCNUgsVUFBVSxDQUFDNkgsSTs7bUZBQ2xDRCxtQjs7Ozs7YUFDK0IsSUFBSTdILGFBQUosQ0FBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QixHQUF6QixDOztrRkFDL0I2SCxtQjs7Ozs7YUFDOEIsSUFBSTdILGFBQUosQ0FBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QixHQUF6QixDOztvRkFDOUI2SCxtQjs7Ozs7YUFDZ0M3SCxjQUFNK0gsS0FBTixDQUFZZCxLQUFaLEU7O3FGQUNoQ1ksbUI7Ozs7O2FBQ2lDLElBQUk3SCxhQUFKLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsR0FBekIsQzs7b0ZBQ2pDNkgsbUI7Ozs7O2FBQzZDLEk7O21GQUM3Q0EsbUI7Ozs7O2FBQzRDLEk7O3NGQUM1Q0EsbUI7Ozs7O2FBQzhDLEk7O3VGQUM5Q0EsbUI7Ozs7O2FBQytDLEk7O2lGQUMvQ0EsbUI7Ozs7O2FBQ3FCLEc7O2tGQUNyQkEsbUI7Ozs7O2FBQ3NCLEc7OytFQUN0QkEsbUI7Ozs7O2FBQ2dDLEk7OztBQXFickMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICog55So5oi355WM6Z2i57uE5Lu2XHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCByZXF1aXJlQ29tcG9uZW50LCB0b29sdGlwLCBkaXNwbGF5T3JkZXIsIHR5cGUsIHJhbmdlTWluLCByYW5nZU1heCwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgU3ByaXRlRnJhbWUgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRIYW5kbGVyIGFzIENvbXBvbmVudEV2ZW50SGFuZGxlciB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtLCBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZSc7XHJcbmltcG9ydCB7IEV2ZW50TW91c2UsIEV2ZW50VG91Y2gsIFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBDb2xvciwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IGxlcnAgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vY29yZS9zY2VuZS1ncmFwaC9ub2RlJztcclxuaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1CaXQgfSBmcm9tICcuLi8uLi9jb3JlL3NjZW5lLWdyYXBoL25vZGUtZW51bSc7XHJcblxyXG5jb25zdCBfdGVtcENvbG9yID0gbmV3IENvbG9yKCk7XHJcblxyXG4vKipcclxuICogQGVuIEVudW0gZm9yIHRyYW5zaXRpb24gdHlwZS5cclxuICpcclxuICogQHpoIOi/h+a4oeexu+Wei+OAglxyXG4gKi9cclxuZW51bSBUcmFuc2l0aW9uIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBub25lIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOS4jeWBmuS7u+S9lei/h+a4oeOAglxyXG4gICAgICovXHJcbiAgICBOT05FID0gMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgY29sb3IgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAemgg6aKc6Imy6L+H5rih44CCXHJcbiAgICAgKi9cclxuICAgIENPTE9SID0gMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc3ByaXRlIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOeyvueBtei/h+a4oeOAglxyXG4gICAgICovXHJcbiAgICBTUFJJVEUgPSAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHNjYWxlIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoIOe8qeaUvui/h+a4oeOAglxyXG4gICAgICovXHJcbiAgICBTQ0FMRSA9IDMsXHJcbn1cclxuXHJcbmNjZW51bShUcmFuc2l0aW9uKTtcclxuXHJcbmVudW0gU3RhdGUge1xyXG4gICAgTk9STUFMID0gJ25vcm1hbCcsXHJcbiAgICBIT1ZFUiA9ICdob3ZlcicsXHJcbiAgICBQUkVTU0VEID0gJ3ByZXNzZWQnLFxyXG4gICAgRElTQUJMRUQgPSAnZGlzYWJsZWQnLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBFdmVudFR5cGUge1xyXG4gICAgQ0xJQ0sgPSAnY2xpY2snLFxyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEJ1dHRvbiBoYXMgNCBUcmFuc2l0aW9uIHR5cGVzPGJyLz5cclxuICogV2hlbiBCdXR0b24gc3RhdGUgY2hhbmdlZDo8YnIvPlxyXG4gKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLk5PTkUsIEJ1dHRvbiB3aWxsIGRvIG5vdGhpbmc8YnIvPlxyXG4gKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLkNPTE9SLCBCdXR0b24gd2lsbCBjaGFuZ2UgdGFyZ2V0J3MgY29sb3I8YnIvPlxyXG4gKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLlNQUklURSwgQnV0dG9uIHdpbGwgY2hhbmdlIHRhcmdldCBTcHJpdGUncyBzcHJpdGU8YnIvPlxyXG4gKiAgSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLlNDQUxFLCBCdXR0b24gd2lsbCBjaGFuZ2UgdGFyZ2V0IG5vZGUncyBzY2FsZTxici8+XHJcbiAqXHJcbiAqIEJ1dHRvbiB3aWxsIHRyaWdnZXIgNSBldmVudHM6PGJyLz5cclxuICogIEJ1dHRvbi5FVkVOVF9UT1VDSF9ET1dOPGJyLz5cclxuICogIEJ1dHRvbi5FVkVOVF9UT1VDSF9VUDxici8+XHJcbiAqICBCdXR0b24uRVZFTlRfSE9WRVJfSU48YnIvPlxyXG4gKiAgQnV0dG9uLkVWRU5UX0hPVkVSX01PVkU8YnIvPlxyXG4gKiAgQnV0dG9uLkVWRU5UX0hPVkVSX09VVDxici8+XHJcbiAqICBVc2VyIGNhbiBnZXQgdGhlIGN1cnJlbnQgY2xpY2tlZCBub2RlIHdpdGggJ2V2ZW50LnRhcmdldCcgZnJvbSBldmVudCBvYmplY3Qgd2hpY2ggaXMgcGFzc2VkIGFzIHBhcmFtZXRlciBpbiB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gb2YgY2xpY2sgZXZlbnQuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDmjInpkq7nu4Tku7bjgILlj6/ku6XooqvmjInkuIvvvIzmiJbogIXngrnlh7vjgIJcclxuICpcclxuICog5oyJ6ZKu5Y+v5Lul6YCa6L+H5L+u5pS5IFRyYW5zaXRpb24g5p2l6K6+572u5oyJ6ZKu54q25oCB6L+H5rih55qE5pa55byP77yaXHJcbiAqXHJcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5OT05FICAgLy8g5LiN5YGa5Lu75L2V6L+H5rihXHJcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5DT0xPUiAgLy8g6L+b6KGM6aKc6Imy5LmL6Ze06L+H5rihXHJcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5TUFJJVEUgLy8g6L+b6KGM57K+54G15LmL6Ze06L+H5rihXHJcbiAqICAgLSBCdXR0b24uVHJhbnNpdGlvbi5TQ0FMRSAvLyDov5vooYznvKnmlL7ov4fmuKFcclxuICpcclxuICog5oyJ6ZKu5Y+v5Lul57uR5a6a5LqL5Lu277yI5L2G5piv5b+F6aG76KaB5Zyo5oyJ6ZKu55qEIE5vZGUg5LiK5omN6IO957uR5a6a5LqL5Lu277yJ77yaPGJyLz5cclxuICog5Lul5LiL5LqL5Lu25Y+v5Lul5Zyo5YWo5bmz5Y+w5LiK6YO96Kem5Y+R77yaXHJcbiAqXHJcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCAgLy8g5oyJ5LiL5pe25LqL5Lu2XHJcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9Nb3ZlICAgLy8g5oyJ5L2P56e75Yqo5ZCO5LqL5Lu2XHJcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQgICAgLy8g5oyJ5LiL5ZCO5p2+5byA5ZCO5LqL5Lu2XHJcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwgLy8g5oyJ5LiL5Y+W5raI5LqL5Lu2XHJcbiAqXHJcbiAqIOS7peS4i+S6i+S7tuWPquWcqCBQQyDlubPlj7DkuIrop6blj5HvvJpcclxuICpcclxuICogICAtIGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04gIC8vIOm8oOagh+aMieS4i+aXtuS6i+S7tlxyXG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSAgLy8g6byg5qCH5oyJ5L2P56e75Yqo5ZCO5LqL5Lu2XHJcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiAvLyDpvKDmoIfov5vlhaXnm67moIfkuovku7ZcclxuICogICAtIGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0xFQVZFIC8vIOm8oOagh+emu+W8gOebruagh+S6i+S7tlxyXG4gKiAgIC0gY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfVVAgICAgLy8g6byg5qCH5p2+5byA5LqL5Lu2XHJcbiAqICAgLSBjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCAvLyDpvKDmoIfmu5rova7kuovku7ZcclxuICpcclxuICog55So5oi35Y+v5Lul6YCa6L+H6I635Y+WIF9f54K55Ye75LqL5Lu2X18g5Zue6LCD5Ye95pWw55qE5Y+C5pWwIGV2ZW50IOeahCB0YXJnZXQg5bGe5oCn6I635Y+W5b2T5YmN54K55Ye75a+56LGh44CCXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IGxvZywgTm9kZSB9IGZyb20gJ2NjJztcclxuICogLy8gQWRkIGFuIGV2ZW50IHRvIHRoZSBidXR0b24uXHJcbiAqIGJ1dHRvbi5ub2RlLm9uKE5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCAoZXZlbnQpID0+IHtcclxuICogICAgIGxvZyhcIlRoaXMgaXMgYSBjYWxsYmFjayBhZnRlciB0aGUgdHJpZ2dlciBldmVudFwiKTtcclxuICogfSk7XHJcbiAqIC8vIFlvdSBjb3VsZCBhbHNvIGFkZCBhIGNsaWNrIGV2ZW50XHJcbiAqIC8vTm90ZTogSW4gdGhpcyB3YXksIHlvdSBjYW4ndCBnZXQgdGhlIHRvdWNoIGV2ZW50IGluZm8sIHNvIHVzZSBpdCB3aXNlbHkuXHJcbiAqIGJ1dHRvbi5ub2RlLm9uKCdjbGljaycsIChidXR0b24pID0+IHtcclxuICogICAgLy9UaGUgZXZlbnQgaXMgYSBjdXN0b20gZXZlbnQsIHlvdSBjb3VsZCBnZXQgdGhlIEJ1dHRvbiBjb21wb25lbnQgdmlhIGZpcnN0IGFyZ3VtZW50XHJcbiAqIH0pXHJcbiAqIGBgYFxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkJ1dHRvbicpXHJcbkBoZWxwKCdpMThuOmNjLkJ1dHRvbicpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9CdXR0b24nKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRyYW5zaXRpb24gdGFyZ2V0LlxyXG4gICAgICogV2hlbiBCdXR0b24gc3RhdGUgY2hhbmdlZDpcclxuICAgICAqIC0gSWYgVHJhbnNpdGlvbiB0eXBlIGlzIEJ1dHRvbi5UcmFuc2l0aW9uLk5PTkUsIEJ1dHRvbiB3aWxsIGRvIG5vdGhpbmcuXHJcbiAgICAgKiAtIElmIFRyYW5zaXRpb24gdHlwZSBpcyBCdXR0b24uVHJhbnNpdGlvbi5DT0xPUiwgQnV0dG9uIHdpbGwgY2hhbmdlIHRhcmdldCdzIGNvbG9yLlxyXG4gICAgICogLSBJZiBUcmFuc2l0aW9uIHR5cGUgaXMgQnV0dG9uLlRyYW5zaXRpb24uU1BSSVRFLCBCdXR0b24gd2lsbCBjaGFuZ2UgdGFyZ2V0IFNwcml0ZSdzIHNwcml0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmcgOimgei/h+a4oeeahOebruagh+OAgjxici8+XHJcbiAgICAgKiDlvZPliY3mjInpkq7nirbmgIHmlLnlj5jop4TliJnvvJo8YnIvPlxyXG4gICAgICogLSDlpoLmnpwgVHJhbnNpdGlvbiB0eXBlIOmAieaLqSBCdXR0b24uVHJhbnNpdGlvbi5OT05F77yM5oyJ6ZKu5LiN5YGa5Lu75L2V6L+H5rih44CCXHJcbiAgICAgKiAtIOWmguaenCBUcmFuc2l0aW9uIHR5cGUg6YCJ5oupIEJ1dHRvbi5UcmFuc2l0aW9uLkNPTE9S77yM5oyJ6ZKu5Lya5a+555uu5qCH6aKc6Imy6L+b6KGM6aKc6Imy5LmL6Ze055qE6L+H5rih44CCXHJcbiAgICAgKiAtIOWmguaenCBUcmFuc2l0aW9uIHR5cGUg6YCJ5oupIEJ1dHRvbi5UcmFuc2l0aW9uLlNwcml0Ze+8jOaMiemSruS8muWvueebruaghyBTcHJpdGUg6L+b6KGMIFNwcml0ZSDkuYvpl7TnmoTov4fmuKHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTm9kZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMClcclxuICAgIEB0b29sdGlwKCfmjIflrpogQnV0dG9uIOiDjOaZr+iKgueCue+8jEJ1dHRvbiDnirbmgIHmlLnlj5jml7bkvJrkv67mlLnmraToioLngrnnmoQgQ29sb3Ig5oiWIFNwcml0ZSDlsZ7mgKcnKVxyXG4gICAgZ2V0IHRhcmdldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldCB8fCB0aGlzLm5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRhcmdldCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXQpIHtcclxuICAgICAgICAgICAgLy8gbmVlZCB0byByZW1vdmUgdGhlIG9sZCB0YXJnZXQgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIHRoaXMuX3VucmVnaXN0ZXJUYXJnZXRFdmVudCh0aGlzLl90YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl90YXJnZXQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9hcHBseVRhcmdldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBCdXR0b24gaXMgZGlzYWJsZWQuXHJcbiAgICAgKiBJZiB0cnVlLCB0aGUgQnV0dG9uIHdpbGwgdHJpZ2dlciBldmVudCBhbmQgZG8gdHJhbnNpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMiemSruS6i+S7tuaYr+WQpuiiq+WTjeW6lO+8jOWmguaenOS4uiBmYWxzZe+8jOWImeaMiemSruWwhuiiq+emgeeUqOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAdG9vbHRpcCgn5oyJ6ZKu5piv5ZCm5Y+v5Lqk5LqS77yM6L+Z5LiA6aG55pyq6YCJ5Lit5pe277yM5oyJ6ZKu5aSE5Zyo56aB55So54q25oCBJylcclxuICAgIGdldCBpbnRlcmFjdGFibGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRlcmFjdGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGludGVyYWN0YWJsZSAodmFsdWUpIHtcclxuICAgICAgICAvLyBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgLy8gICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5fcHJldmlvdXNOb3JtYWxTcHJpdGUgPSB0aGlzLm5vcm1hbFNwcml0ZTtcclxuICAgICAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMubm9ybWFsU3ByaXRlID0gdGhpcy5fcHJldmlvdXNOb3JtYWxTcHJpdGU7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5faW50ZXJhY3RhYmxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnRlcmFjdGFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgX3Jlc2l6ZVRvVGFyZ2V0ICh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZXNpemVOb2RlVG9UYXJnZXROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUcmFuc2l0aW9uIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmjInpkq7nirbmgIHmlLnlj5jml7bov4fmuKHmlrnlvI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVHJhbnNpdGlvbilcclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCfmjInpkq7nirbmgIHlj5jljJbml7bnmoTov4fmuKHnsbvlnosnKVxyXG4gICAgZ2V0IHRyYW5zaXRpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0cmFuc2l0aW9uICh2YWx1ZTogVHJhbnNpdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFJlc2V0IHRvIG5vcm1hbCBkYXRhIHdoZW4gY2hhbmdlIHRyYW5zaXRpb24uXHJcbiAgICAgICAgaWYgKHRoaXMuX3RyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29sb3JUcmFuc2l0aW9uKFN0YXRlLk5PUk1BTCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3RyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU1BSSVRFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24oU3RhdGUuTk9STUFMKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29sb3IgdHJhbnNpdGlvblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBOb3JtYWwgc3RhdGUgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmma7pgJrnirbmgIHkuIvmjInpkq7miYDmmL7npLrnmoTpopzoibLjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aZrumAmueKtuaAgeeahOaMiemSruiDjOaZr+minOiJsicpXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIGdldCBub3JtYWxDb2xvciAoKTogUmVhZG9ubHk8Q29sb3I+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9ybWFsQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG5vcm1hbENvbG9yICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ub3JtYWxDb2xvciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbm9ybWFsQ29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQcmVzc2VkIHN0YXRlIGNvbG9yLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oyJ5LiL54q25oCB5pe25oyJ6ZKu5omA5pi+56S655qE6aKc6Imy44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmjInkuIvnirbmgIHnmoTmjInpkq7og4zmma/popzoibInKVxyXG4gICAgLy8gQGNvbnN0Z2V0XHJcbiAgICBnZXQgcHJlc3NlZENvbG9yICgpOiBSZWFkb25seTxDb2xvcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcmVzc2VkQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHByZXNzZWRDb2xvciAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fcHJlc3NlZENvbG9yID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcmVzc2VkQ29sb3Iuc2V0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSG92ZXIgc3RhdGUgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmgqzlgZznirbmgIHkuIvmjInpkq7miYDmmL7npLrnmoTpopzoibLjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+aCrOWBnOeKtuaAgeeahOaMiemSruiDjOaZr+minOiJsicpXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIGdldCBob3ZlckNvbG9yICgpOiBSZWFkb25seTxDb2xvcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ob3ZlckNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBob3ZlckNvbG9yICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ob3ZlckNvbG9yID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ob3ZlckNvbG9yLnNldCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRGlzYWJsZWQgc3RhdGUgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnpoHnlKjnirbmgIHkuIvmjInpkq7miYDmmL7npLrnmoTpopzoibLjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+emgeeUqOeKtuaAgeeahOaMiemSruiDjOaZr+minOiJsicpXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIGdldCBkaXNhYmxlZENvbG9yICgpOiBSZWFkb25seTxDb2xvcj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZENvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBkaXNhYmxlZENvbG9yICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZENvbG9yID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9kaXNhYmxlZENvbG9yLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29sb3IgYW5kIFNjYWxlIHRyYW5zaXRpb24gZHVyYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDpopzoibLov4fmuKHlkoznvKnmlL7ov4fmuKHml7bmiYDpnIDml7bpl7TjgIJcclxuICAgICAqL1xyXG4gICAgQHJhbmdlTWluKDApXHJcbiAgICBAcmFuZ2VNYXgoMTApXHJcbiAgICBAdG9vbHRpcCgn5oyJ6ZKu6aKc6Imy5Y+Y5YyW5oiW6ICF57yp5pS+5Y+Y5YyW55qE6L+H5rih5pe26Ze0JylcclxuICAgIGdldCBkdXJhdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBkdXJhdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fZHVyYXRpb24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZW4gdXNlciBwcmVzcyB0aGUgYnV0dG9uLCB0aGUgYnV0dG9uIHdpbGwgem9vbSB0byBhIHNjYWxlLlxyXG4gICAgICogVGhlIGZpbmFsIHNjYWxlIG9mIHRoZSBidXR0b24gZXF1YWxzIChidXR0b24gb3JpZ2luYWwgc2NhbGUgKiB6b29tU2NhbGUpXHJcbiAgICAgKiBOT1RFOiBTZXR0aW5nIHpvb21TY2FsZSBsZXNzIHRoYW4gMSBpcyBub3QgYWR2aWNlZCwgd2hpY2ggY291bGQgZmlyZSB0aGUgdG91Y2hDYW5jZWwgZXZlbnQgaWYgdGhlIHRvdWNoIHBvaW50IGlzIG91dCBvZiB0b3VjaCBhcmVhIGFmdGVyIHNjYWxpbmcuIFxyXG4gICAgICogaWYgeW91IG5lZWQgdG8gZG8gc28sIHlvdSBzaG91bGQgc2V0IHRhcmdldCBhcyBhbm90aGVyIGJhY2tncm91bmQgbm9kZSBpbnN0ZWFkIG9mIHRoZSBidXR0b24gbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+eUqOaIt+eCueWHu+aMiemSruWQju+8jOaMiemSruS8mue8qeaUvuWIsOS4gOS4quWAvO+8jOi/meS4quWAvOetieS6jiBCdXR0b24g5Y6f5aeLIHNjYWxlICogem9vbVNjYWxl44CCXHJcbiAgICAgKiDms6jmhI/vvJrkuI3lu7rorq4gem9vbVNjYWxlIOeahOWAvOWwj+S6jiAxLCDlkKbliJnnvKnmlL7lkI7lpoLmnpzop6bmkbjngrnlnKjop6bmkbjljLrln5/lpJYsIOWImeS8muinpuWPkSB0b3VjaENhbmNlbCDkuovku7bjgIJcclxuICAgICAqIOWmguaenOS9oOmcgOimgei/meS5iOWBmu+8jOS9oOW6lOivpeaKiiB0YXJnZXQg6K6+572u5Li65Y+m5LiA5Liq6IOM5pmv6IqC54K577yM6ICM5LiN5piv5oyJ6ZKu6IqC54K544CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflvZPnlKjmiLfngrnlh7vmjInpkq7lkI7vvIzmjInpkq7kvJrnvKnmlL7liLDkuIDkuKrlgLzvvIzov5nkuKrlgLznrYnkuo4gQnV0dG9uIOWOn+WniyBzY2FsZSAqIHpvb21TY2FsZeOAgicpXHJcbiAgICBnZXQgem9vbVNjYWxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fem9vbVNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB6b29tU2NhbGUgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3pvb21TY2FsZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fem9vbVNjYWxlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3ByaXRlIHRyYW5zaXRpb25cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBOb3JtYWwgc3RhdGUgc3ByaXRlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5pmu6YCa54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qEIFNwcml0ZeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGVGcmFtZSlcclxuICAgIEB0b29sdGlwKCfmma7pgJrnirbmgIHnmoTmjInpkq7og4zmma/lm77otYTmupAnKVxyXG4gICAgZ2V0IG5vcm1hbFNwcml0ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vcm1hbFNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbm9ybWFsU3ByaXRlICh2YWx1ZTogU3ByaXRlRnJhbWUgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX25vcm1hbFNwcml0ZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbm9ybWFsU3ByaXRlID0gdmFsdWU7XHJcbiAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICAgIGlmIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQcmVzc2VkIHN0YXRlIHNwcml0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMieS4i+eKtuaAgeaXtuaMiemSruaJgOaYvuekuueahCBTcHJpdGXjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3ByaXRlRnJhbWUpXHJcbiAgICBAdG9vbHRpcCgn5oyJ5LiL54q25oCB55qE5oyJ6ZKu6IOM5pmv5Zu+6LWE5rqQJylcclxuICAgIGdldCBwcmVzc2VkU3ByaXRlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJlc3NlZFNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcHJlc3NlZFNwcml0ZSAodmFsdWU6IFNwcml0ZUZyYW1lIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcmVzc2VkU3ByaXRlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcmVzc2VkU3ByaXRlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSG92ZXIgc3RhdGUgc3ByaXRlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oKs5YGc54q25oCB5LiL5oyJ6ZKu5omA5pi+56S655qEIFNwcml0ZeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGVGcmFtZSlcclxuICAgIEB0b29sdGlwKCfmgqzlgZznirbmgIHnmoTmjInpkq7og4zmma/lm77otYTmupAnKVxyXG4gICAgZ2V0IGhvdmVyU3ByaXRlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faG92ZXJTcHJpdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGhvdmVyU3ByaXRlICh2YWx1ZTogU3ByaXRlRnJhbWUgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hvdmVyU3ByaXRlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ob3ZlclNwcml0ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIERpc2FibGVkIHN0YXRlIHNwcml0ZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOemgeeUqOeKtuaAgeS4i+aMiemSruaJgOaYvuekuueahCBTcHJpdGXjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3ByaXRlRnJhbWUpXHJcbiAgICBAdG9vbHRpcCgn56aB55So54q25oCB55qE5oyJ6ZKu6IOM5pmv5Zu+6LWE5rqQJylcclxuICAgIGdldCBkaXNhYmxlZFNwcml0ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkU3ByaXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBkaXNhYmxlZFNwcml0ZSAodmFsdWU6IFNwcml0ZUZyYW1lIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXNhYmxlZFNwcml0ZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZGlzYWJsZWRTcHJpdGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgVHJhbnNpdGlvbiA9IFRyYW5zaXRpb247XHJcbiAgICBwdWJsaWMgc3RhdGljIEV2ZW50VHlwZSA9IEV2ZW50VHlwZTtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJZiBCdXR0b24gaXMgY2xpY2tlZCwgaXQgd2lsbCB0cmlnZ2VyIGV2ZW50J3MgaGFuZGxlci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMiemSrueahOeCueWHu+S6i+S7tuWIl+ihqOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShbQ29tcG9uZW50RXZlbnRIYW5kbGVyXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMjApXHJcbiAgICBAdG9vbHRpcCgn5oyJ6ZKu54K55Ye75LqL5Lu255qE5YiX6KGo44CC5YWI5bCG5pWw6YeP5pS55Li6MeaIluabtOWkmu+8jOWwseWPr+S7peS4uuavj+S4queCueWHu+S6i+S7tuiuvue9ruaOpeWPl+iAheWSjOWkhOeQhuaWueazlScpXHJcbiAgICBwdWJsaWMgY2xpY2tFdmVudHM6IENvbXBvbmVudEV2ZW50SGFuZGxlcltdID0gW107XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ludGVyYWN0YWJsZSA9IHRydWU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3RyYW5zaXRpb24gPSBUcmFuc2l0aW9uLk5PTkU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX25vcm1hbENvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigyMTQsIDIxNCwgMjE0LCAyNTUpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9ob3ZlckNvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigyMTEsIDIxMSwgMjExLCAyNTUpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wcmVzc2VkQ29sb3I6IENvbG9yID0gQ29sb3IuV0hJVEUuY2xvbmUoKTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZGlzYWJsZWRDb2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoMTI0LCAxMjQsIDEyNCwgMjU1KTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbm9ybWFsU3ByaXRlOiBTcHJpdGVGcmFtZSB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9ob3ZlclNwcml0ZTogU3ByaXRlRnJhbWUgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcHJlc3NlZFNwcml0ZTogU3ByaXRlRnJhbWUgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZGlzYWJsZWRTcHJpdGU6IFNwcml0ZUZyYW1lIHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2R1cmF0aW9uID0gMC4xO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF96b29tU2NhbGUgPSAxLjI7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3RhcmdldDogTm9kZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaG92ZXJlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfZnJvbUNvbG9yOiBDb2xvciA9IG5ldyBDb2xvcigpO1xyXG4gICAgcHJpdmF0ZSBfdG9Db2xvcjogQ29sb3IgPSBuZXcgQ29sb3IoKTtcclxuICAgIHByaXZhdGUgX3RpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdHJhbnNpdGlvbkZpbmlzaGVkID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX2Zyb21TY2FsZTogVmVjMyA9IG5ldyBWZWMzKCk7XHJcbiAgICBwcml2YXRlIF90b1NjYWxlOiBWZWMzID0gbmV3IFZlYzMoKTtcclxuICAgIHByaXZhdGUgX29yaWdpbmFsU2NhbGU6IFZlYzMgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3Nwcml0ZTogU3ByaXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90YXJnZXRTY2FsZTogVmVjMyA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgcHVibGljIF9fcHJlbG9hZCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMubm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoU3ByaXRlKTtcclxuICAgICAgICBpZiAoc3ByaXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25vcm1hbFNwcml0ZSA9IHNwcml0ZS5zcHJpdGVGcmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2FwcGx5VGFyZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgLy8gY2hlY2sgc3ByaXRlIGZyYW1lc1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgaWYgKCFFRElUT1IgfHwgbGVnYWN5Q0MuR0FNRV9WSUVXKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hCZWdhbiwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuX29uVG91Y2hDYW5jZWwsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgdGhpcy5fb25Nb3VzZU1vdmVJbiwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuTU9VU0VfTEVBVkUsIHRoaXMuX29uTW91c2VNb3ZlT3V0LCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oU3ByaXRlLkV2ZW50VHlwZS5TUFJJVEVfRlJBTUVfQ0hBTkdFRCwgKGNvbXA6IFNwcml0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU1BSSVRFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsU3ByaXRlID0gY29tcC5zcHJpdGVGcmFtZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZvaWQgc2VyaWFsaXphdGlvbiBkYXRhIGxvc3Mgd2hlbiBpbiBuby1zcHJpdGUgbW9kZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbFNwcml0ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faG92ZXJTcHJpdGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXNzZWRTcHJpdGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVkU3ByaXRlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFFRElUT1IgfHwgbGVnYWN5Q0MuR0FNRV9WSUVXKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl9vblRvdWNoQ2FuY2VsLCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLl9vbk1vdXNlTW92ZUluLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuTU9VU0VfTEVBVkUsIHRoaXMuX29uTW91c2VNb3ZlT3V0LCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFNwcml0ZS5FdmVudFR5cGUuU1BSSVRFX0ZSQU1FX0NIQU5HRUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlIChkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCB8fCAhdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uICE9PSBUcmFuc2l0aW9uLkNPTE9SICYmIHRoaXMuX3RyYW5zaXRpb24gIT09IFRyYW5zaXRpb24uU0NBTEUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGltZSArPSBkdDtcclxuICAgICAgICBsZXQgcmF0aW8gPSAxLjA7XHJcbiAgICAgICAgaWYgKHRoaXMuX2R1cmF0aW9uID4gMCkge1xyXG4gICAgICAgICAgICByYXRpbyA9IHRoaXMuX3RpbWUgLyB0aGlzLl9kdXJhdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyYXRpbyA+PSAxKSB7XHJcbiAgICAgICAgICAgIHJhdGlvID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlckNvbXAgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KFVJUmVuZGVyYWJsZSk7XHJcbiAgICAgICAgaWYgKCFyZW5kZXJDb21wKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLkNPTE9SKSB7XHJcbiAgICAgICAgICAgIENvbG9yLmxlcnAoX3RlbXBDb2xvciwgdGhpcy5fZnJvbUNvbG9yLCB0aGlzLl90b0NvbG9yLCByYXRpbyk7XHJcbiAgICAgICAgICAgIHJlbmRlckNvbXAuY29sb3IgPSBfdGVtcENvbG9yO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNDQUxFKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5nZXRTY2FsZSh0aGlzLl90YXJnZXRTY2FsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldFNjYWxlLnggPSBsZXJwKHRoaXMuX2Zyb21TY2FsZS54LCB0aGlzLl90b1NjYWxlLngsIHJhdGlvKTtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0U2NhbGUueSA9IGxlcnAodGhpcy5fZnJvbVNjYWxlLnksIHRoaXMuX3RvU2NhbGUueSwgcmF0aW8pO1xyXG4gICAgICAgICAgICB0YXJnZXQuc2V0U2NhbGUodGhpcy5fdGFyZ2V0U2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAocmF0aW8gPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZXNpemVOb2RlVG9UYXJnZXROb2RlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRhcmdldFRyYW5zID0gdGhpcy50YXJnZXQuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgdGFyZ2V0VHJhbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuc2V0Q29udGVudFNpemUodGFyZ2V0VHJhbnMuY29udGVudFNpemUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Jlc2V0U3RhdGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9ob3ZlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgLy8gUmVzdG9yZSBidXR0b24gc3RhdHVzXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XHJcbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZW5kZXJDb21wID0gdGFyZ2V0LmdldENvbXBvbmVudChVSVJlbmRlcmFibGUpO1xyXG4gICAgICAgIGlmICghcmVuZGVyQ29tcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0cmFuc2l0aW9uID0gdGhpcy5fdHJhbnNpdGlvbjtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUiAmJiB0aGlzLl9pbnRlcmFjdGFibGUpIHtcclxuICAgICAgICAgICAgcmVuZGVyQ29tcC5jb2xvciA9IHRoaXMuX25vcm1hbENvbG9yO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSAmJiB0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5zZXRTY2FsZSh0aGlzLl9vcmlnaW5hbFNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUiB8fCBsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbCwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0VOVEVSLCB0aGlzLl9vbk1vdXNlTW92ZUluLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9MRUFWRSwgdGhpcy5fb25Nb3VzZU1vdmVPdXQsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlZ2lzdGVyVGFyZ2V0RXZlbnQgKHRhcmdldCkge1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgIWxlZ2FjeUNDLkdBTUVfVklFVykge1xyXG4gICAgICAgICAgICB0YXJnZXQub24oU3ByaXRlLkV2ZW50VHlwZS5TUFJJVEVfRlJBTUVfQ0hBTkdFRCwgdGhpcy5fb25UYXJnZXRTcHJpdGVGcmFtZUNoYW5nZWQsIHRoaXMpO1xyXG4gICAgICAgICAgICB0YXJnZXQub24oU3lzdGVtRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHRoaXMuX29uVGFyZ2V0Q29sb3JDaGFuZ2VkLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0Lm9uKFN5c3RlbUV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy5fb25UYXJnZXRUcmFuc2Zvcm1DaGFuZ2VkLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VucmVnaXN0ZXJOb2RlRXZlbnQgKCkge1xyXG4gICAgICAgIGlmICghRURJVE9SIHx8IGxlZ2FjeUNDLkdBTUVfVklFVykge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbCwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgdGhpcy5fb25Nb3VzZU1vdmVJbiwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vZmYoU3lzdGVtRXZlbnRUeXBlLk1PVVNFX0xFQVZFLCB0aGlzLl9vbk1vdXNlTW92ZU91dCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdW5yZWdpc3RlclRhcmdldEV2ZW50ICh0YXJnZXQpIHtcclxuICAgICAgICBpZiAoRURJVE9SICYmICFsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgdGFyZ2V0Lm9mZihTcHJpdGUuRXZlbnRUeXBlLlNQUklURV9GUkFNRV9DSEFOR0VEKTtcclxuICAgICAgICAgICAgdGFyZ2V0Lm9mZihTeXN0ZW1FdmVudFR5cGUuQ09MT1JfQ0hBTkdFRCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldC5vZmYoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VEKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldFRhcmdldFNwcml0ZSAodGFyZ2V0OiBOb2RlIHwgbnVsbCkge1xyXG4gICAgICAgIGxldCBzcHJpdGU6IFNwcml0ZSB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgc3ByaXRlID0gdGFyZ2V0LmdldENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3ByaXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXBwbHlUYXJnZXQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUgPSB0aGlzLl9nZXRUYXJnZXRTcHJpdGUodGhpcy50YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX29yaWdpbmFsU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2NhbGUgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLl9vcmlnaW5hbFNjYWxlLCB0aGlzLnRhcmdldC5nZXRTY2FsZSgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25UYXJnZXRTcHJpdGVGcmFtZUNoYW5nZWQgKGNvbXA6IFNwcml0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRDdXJyZW50U3RhdGVTcHJpdGVGcmFtZShjb21wLnNwcml0ZUZyYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0Q3VycmVudFN0YXRlU3ByaXRlRnJhbWUgKHNwcml0ZUZyYW1lOiBTcHJpdGVGcmFtZSB8IG51bGwpIHtcclxuICAgICAgICBpZiAoIXNwcml0ZUZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLl9nZXRCdXR0b25TdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsU3ByaXRlID0gc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTdGF0ZS5IT1ZFUjpcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hvdmVyU3ByaXRlID0gc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTdGF0ZS5QUkVTU0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3NlZFNwcml0ZSA9IHNwcml0ZUZyYW1lO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU3RhdGUuRElTQUJMRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNhYmxlZFNwcml0ZSA9IHNwcml0ZUZyYW1lO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29uVGFyZ2V0Q29sb3JDaGFuZ2VkIChjb2xvcjogQ29sb3IpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRDdXJyZW50U3RhdGVDb2xvcihjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldEN1cnJlbnRTdGF0ZUNvbG9yKGNvbG9yOiBDb2xvcikge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5fZ2V0QnV0dG9uU3RhdGUoKSkge1xyXG4gICAgICAgICAgICBjYXNlIFN0YXRlLk5PUk1BTDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbENvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTdGF0ZS5IT1ZFUjpcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hvdmVyQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFN0YXRlLlBSRVNTRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVzc2VkQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFN0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29uVGFyZ2V0VHJhbnNmb3JtQ2hhbmdlZCAodHJhbnNmb3JtQml0OiBUcmFuc2Zvcm1CaXQpIHtcclxuICAgICAgICAvLyB1cGRhdGUgb3JpZ2luYWxTY2FsZVxyXG4gICAgICAgIGlmICh0cmFuc2Zvcm1CaXQgfCBUcmFuc2Zvcm1CaXQuU0NBTEUgJiYgdGhpcy5fb3JpZ2luYWxTY2FsZVxyXG4gICAgICAgICAgICAmJiB0aGlzLl90cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNDQUxFICYmIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCkge1xyXG4gICAgICAgICAgICBWZWMzLmNvcHkodGhpcy5fb3JpZ2luYWxTY2FsZSwgdGhpcy50YXJnZXQuZ2V0U2NhbGUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvdWNoIGV2ZW50IGhhbmRsZXJcclxuICAgIHByb3RlY3RlZCBfb25Ub3VjaEJlZ2FuIChldmVudD86IEV2ZW50VG91Y2gpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2ludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XHJcbiAgICAgICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25Ub3VjaE1vdmUgKGV2ZW50PzogRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSB8fCAhdGhpcy5fcHJlc3NlZCkgeyByZXR1cm47IH1cclxuICAgICAgICAvLyBtb2JpbGUgcGhvbmUgd2lsbCBub3QgZW1pdCBfb25Nb3VzZU1vdmVPdXQsXHJcbiAgICAgICAgLy8gc28gd2UgaGF2ZSB0byBkbyBoaXQgdGVzdCB3aGVuIHRvdWNoIG1vdmluZ1xyXG4gICAgICAgIGlmICghZXZlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG91Y2ggPSAoZXZlbnQgYXMgRXZlbnRUb3VjaCkudG91Y2g7XHJcbiAgICAgICAgaWYgKCF0b3VjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBoaXQgPSB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5pc0hpdCh0b3VjaC5nZXRVSUxvY2F0aW9uKCkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSAmJiB0aGlzLnRhcmdldCAmJiB0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChoaXQpIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLl9mcm9tU2NhbGUsIHRoaXMuX29yaWdpbmFsU2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcih0aGlzLl90b1NjYWxlLCB0aGlzLl9vcmlnaW5hbFNjYWxlLCB0aGlzLl96b29tU2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkZpbmlzaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90aW1lID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRTY2FsZSh0aGlzLl9vcmlnaW5hbFNjYWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZTtcclxuICAgICAgICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5OT1JNQUw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXBwbHlUcmFuc2l0aW9uKHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hFbmRlZCAoZXZlbnQ/OiBFdmVudFRvdWNoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIENvbXBvbmVudEV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuY2xpY2tFdmVudHMsIGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoRXZlbnRUeXBlLkNMSUNLLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XHJcblxyXG4gICAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hDYW5jZWwgKGV2ZW50PzogRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbk1vdXNlTW92ZUluIChldmVudD86IEV2ZW50TW91c2UpIHtcclxuICAgICAgICBpZiAodGhpcy5fcHJlc3NlZCB8fCAhdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLlNQUklURSAmJiAhdGhpcy5faG92ZXJTcHJpdGUpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5faG92ZXJlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3ZlcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbk1vdXNlTW92ZU91dCAoZXZlbnQ/OiBFdmVudE1vdXNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hvdmVyZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faG92ZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGF0ZSBoYW5kbGVyXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVN0YXRlICgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2dldEJ1dHRvblN0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5fYXBwbHlUcmFuc2l0aW9uKHN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldEJ1dHRvblN0YXRlICgpIHtcclxuICAgICAgICBsZXQgc3RhdGUgPSBTdGF0ZS5OT1JNQUw7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnRlcmFjdGFibGUpIHtcclxuICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5ESVNBQkxFRDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3ByZXNzZWQpIHtcclxuICAgICAgICAgICAgc3RhdGUgPSBTdGF0ZS5QUkVTU0VEO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faG92ZXJlZCkge1xyXG4gICAgICAgICAgICBzdGF0ZSA9IFN0YXRlLkhPVkVSO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RhdGUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZUNvbG9yVHJhbnNpdGlvbiAoc3RhdGU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gdGhpc1tzdGF0ZSArICdDb2xvciddO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJDb21wID0gdGhpcy50YXJnZXQ/LmdldENvbXBvbmVudChVSVJlbmRlcmFibGUpO1xyXG4gICAgICAgIGlmICghcmVuZGVyQ29tcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoRURJVE9SIHx8IHN0YXRlID09PSBTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICByZW5kZXJDb21wLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZnJvbUNvbG9yID0gcmVuZGVyQ29tcC5jb2xvci5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl90b0NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVTcHJpdGVUcmFuc2l0aW9uIChzdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpc1tzdGF0ZSArICdTcHJpdGUnXTtcclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlICYmIHNwcml0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWUgPSBzcHJpdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlU2NhbGVUcmFuc2l0aW9uIChzdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnRlcmFjdGFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXRlID09PSBTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3pvb21VcCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3pvb21CYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfem9vbVVwICgpIHtcclxuICAgICAgICAvLyBza2lwIGJlZm9yZSBfX3ByZWxvYWQoKVxyXG4gICAgICAgIGlmICghdGhpcy5fb3JpZ2luYWxTY2FsZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9mcm9tU2NhbGUsIHRoaXMuX29yaWdpbmFsU2NhbGUpO1xyXG4gICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIodGhpcy5fdG9TY2FsZSwgdGhpcy5fb3JpZ2luYWxTY2FsZSwgdGhpcy5fem9vbVNjYWxlKTtcclxuICAgICAgICB0aGlzLl90aW1lID0gMDtcclxuICAgICAgICB0aGlzLl90cmFuc2l0aW9uRmluaXNoZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3pvb21CYWNrICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudGFyZ2V0IHx8ICF0aGlzLl9vcmlnaW5hbFNjYWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2Zyb21TY2FsZSwgdGhpcy50YXJnZXQuZ2V0U2NhbGUoKSk7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3RvU2NhbGUsIHRoaXMuX29yaWdpbmFsU2NhbGUpO1xyXG4gICAgICAgIHRoaXMuX3RpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25GaW5pc2hlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXBwbHlUcmFuc2l0aW9uIChzdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbiA9IHRoaXMuX3RyYW5zaXRpb247XHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29sb3JUcmFuc2l0aW9uKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU1BSSVRFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNwcml0ZVRyYW5zaXRpb24oc3RhdGUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTY2FsZVRyYW5zaXRpb24oc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXHJcbiAqIEBldmVudCBjbGlja1xyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge0J1dHRvbn0gYnV0dG9uIC0gVGhlIEJ1dHRvbiBjb21wb25lbnQuXHJcbiAqL1xyXG4iXX0=