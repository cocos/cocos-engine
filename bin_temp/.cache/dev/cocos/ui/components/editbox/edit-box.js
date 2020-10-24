(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/components/ui-base/index.js", "../../../core/assets/sprite-frame.js", "../../../core/components/component.js", "../../../core/components/component-event-handler.js", "../../../core/data/decorators/index.js", "../../../core/math/index.js", "../../../core/platform/event-manager/event-enum.js", "../../../core/scene-graph/node.js", "../label.js", "../sprite.js", "./edit-box-impl.js", "./edit-box-impl-base.js", "./types.js", "../../../core/platform/sys.js", "../../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/components/ui-base/index.js"), require("../../../core/assets/sprite-frame.js"), require("../../../core/components/component.js"), require("../../../core/components/component-event-handler.js"), require("../../../core/data/decorators/index.js"), require("../../../core/math/index.js"), require("../../../core/platform/event-manager/event-enum.js"), require("../../../core/scene-graph/node.js"), require("../label.js"), require("../sprite.js"), require("./edit-box-impl.js"), require("./edit-box-impl-base.js"), require("./types.js"), require("../../../core/platform/sys.js"), require("../../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.spriteFrame, global.component, global.componentEventHandler, global.index, global.index, global.eventEnum, global.node, global.label, global.sprite, global.editBoxImpl, global.editBoxImplBase, global.types, global.sys, global.defaultConstants);
    global.editBox = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _spriteFrame, _component, _componentEventHandler, _index2, _index3, _eventEnum, _node, _label, _sprite, _editBoxImpl, _editBoxImplBase, _types, _sys, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EditBox = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class3, _temp;

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

  var LEFT_PADDING = 2;

  function capitalize(str) {
    return str.replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  var EventType;
  /**
   * @en
   * `EditBox` is a component for inputing text, you can use it to gather small amounts of text from users.
   *
   * @zh
   * `EditBox` 组件，用于获取用户的输入文本。
   */

  (function (EventType) {
    EventType["EDITING_DID_BEGAN"] = "editing-did-began";
    EventType["EDITING_DID_ENDED"] = "editing-did-ended";
    EventType["TEXT_CHANGED"] = "text-changed";
    EventType["EDITING_RETURN"] = "editing-return";
  })(EventType || (EventType = {}));

  var EditBox = (_dec = (0, _index2.ccclass)('cc.EditBox'), _dec2 = (0, _index2.help)('i18n:cc.EditBox'), _dec3 = (0, _index2.executionOrder)(100), _dec4 = (0, _index2.menu)('UI/EditBox'), _dec5 = (0, _index2.requireComponent)(_index.UITransform), _dec6 = (0, _index2.displayOrder)(1), _dec7 = (0, _index2.tooltip)('输入框的初始输入内容，如果为空则会显示占位符的文本'), _dec8 = (0, _index2.displayOrder)(2), _dec9 = (0, _index2.tooltip)('输入框占位符的文本内容'), _dec10 = (0, _index2.type)(_label.Label), _dec11 = (0, _index2.displayOrder)(3), _dec12 = (0, _index2.tooltip)('输入框输入文本节点上挂载的 Label 组件对象'), _dec13 = (0, _index2.type)(_label.Label), _dec14 = (0, _index2.displayOrder)(4), _dec15 = (0, _index2.tooltip)('输入框占位符节点上挂载的 Label 组件对象'), _dec16 = (0, _index2.type)(_spriteFrame.SpriteFrame), _dec17 = (0, _index2.displayOrder)(5), _dec18 = (0, _index2.tooltip)('输入框的背景图片'), _dec19 = (0, _index2.type)(_types.InputFlag), _dec20 = (0, _index2.displayOrder)(6), _dec21 = (0, _index2.tooltip)('指定输入标志位，可以指定输入方式为密码或者单词首字母大写'), _dec22 = (0, _index2.type)(_types.InputMode), _dec23 = (0, _index2.displayOrder)(7), _dec24 = (0, _index2.tooltip)('指定输入模式: ANY 表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式'), _dec25 = (0, _index2.type)(_types.KeyboardReturnType), _dec26 = (0, _index2.displayOrder)(8), _dec27 = (0, _index2.tooltip)('指定移动设备上面回车按钮的样式'), _dec28 = (0, _index2.displayOrder)(9), _dec29 = (0, _index2.tooltip)('输入框最大允许输入的字符个数'), _dec30 = (0, _index2.displayOrder)(10), _dec31 = (0, _index2.tooltip)('修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）'), _dec32 = (0, _index2.type)([_componentEventHandler.EventHandler]), _dec33 = (0, _index2.displayOrder)(11), _dec34 = (0, _index2.tooltip)('该事件在用户点击输入框获取焦点的时候被触发'), _dec35 = (0, _index2.type)([_componentEventHandler.EventHandler]), _dec36 = (0, _index2.displayOrder)(12), _dec37 = (0, _index2.tooltip)('编辑文本输入框时触发的事件回调'), _dec38 = (0, _index2.type)([_componentEventHandler.EventHandler]), _dec39 = (0, _index2.displayOrder)(13), _dec40 = (0, _index2.tooltip)('在单行模式下面，一般是在用户按下回车或者点击屏幕输入框以外的地方调用该函数。 如果是多行输入，一般是在用户点击屏幕输入框以外的地方调用该函数'), _dec41 = (0, _index2.type)([_componentEventHandler.EventHandler]), _dec42 = (0, _index2.displayOrder)(14), _dec43 = (0, _index2.tooltip)('该事件在用户按下回车键的时候被触发, 如果是单行输入框，按回车键还会使输入框失去焦点'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (0, _index2.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(EditBox, _Component);

    function EditBox() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, EditBox);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EditBox)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "editingDidBegan", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "textChanged", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "editingDidEnded", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "editingReturn", _descriptor4, _assertThisInitialized(_this));

      _this._impl = null;
      _this._background = null;

      _initializerDefineProperty(_this, "_textLabel", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_placeholderLabel", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_returnType", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_useOriginalSize", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_string", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_tabIndex", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_backgroundImage", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_inputFlag", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_inputMode", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_maxLength", _descriptor14, _assertThisInitialized(_this));

      _this._isLabelVisible = false;
      return _this;
    }

    _createClass(EditBox, [{
      key: "__preload",
      value: function __preload() {
        this._init();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (!_defaultConstants.EDITOR) {
          this._registerEvent();
        }

        if (this._impl) {
          this._impl.onEnable();
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (this._impl) {
          this._impl.update();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (!_defaultConstants.EDITOR) {
          this._unregisterEvent();
        }

        if (this._impl) {
          this._impl.onDisable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._impl) {
          this._impl.clear();
        }
      }
      /**
       * @en Let the EditBox get focus
       * @zh 让当前 EditBox 获得焦点。
       */

    }, {
      key: "setFocus",
      value: function setFocus() {
        if (this._impl) {
          this._impl.setFocus(true);
        }
      }
      /**
       * @en Let the EditBox get focus
       * @zh 让当前 EditBox 获得焦点
       */

    }, {
      key: "focus",
      value: function focus() {
        if (this._impl) {
          this._impl.setFocus(true);
        }
      }
      /**
       * @en Let the EditBox lose focus
       * @zh 让当前 EditBox 失去焦点
       */

    }, {
      key: "blur",
      value: function blur() {
        if (this._impl) {
          this._impl.setFocus(false);
        }
      }
      /**
       * @en Determine whether EditBox is getting focus or not.
       * @zh 判断 EditBox 是否获得了焦点。
       * Note: only available on Web at the moment.
       */

    }, {
      key: "isFocused",
      value: function isFocused() {
        if (this._impl) {
          return this._impl.isFocused();
        }

        return false;
      }
    }, {
      key: "_editBoxEditingDidBegan",
      value: function _editBoxEditingDidBegan() {
        _componentEventHandler.EventHandler.emitEvents(this.editingDidBegan, this);

        this.node.emit(EventType.EDITING_DID_BEGAN, this);
      }
    }, {
      key: "_editBoxEditingDidEnded",
      value: function _editBoxEditingDidEnded() {
        _componentEventHandler.EventHandler.emitEvents(this.editingDidEnded, this);

        this.node.emit(EventType.EDITING_DID_ENDED, this);
      }
    }, {
      key: "_editBoxTextChanged",
      value: function _editBoxTextChanged(text) {
        text = this._updateLabelStringStyle(text, true);
        this.string = text;

        _componentEventHandler.EventHandler.emitEvents(this.textChanged, text, this);

        this.node.emit(EventType.TEXT_CHANGED, this);
      }
    }, {
      key: "_editBoxEditingReturn",
      value: function _editBoxEditingReturn() {
        _componentEventHandler.EventHandler.emitEvents(this.editingReturn, this);

        this.node.emit(EventType.EDITING_RETURN, this);
      }
    }, {
      key: "_showLabels",
      value: function _showLabels() {
        this._isLabelVisible = true;

        this._updateLabels();
      }
    }, {
      key: "_hideLabels",
      value: function _hideLabels() {
        this._isLabelVisible = false;

        if (this._textLabel) {
          this._textLabel.node.active = false;
        }

        if (this._placeholderLabel) {
          this._placeholderLabel.node.active = false;
        }
      }
    }, {
      key: "_onTouchBegan",
      value: function _onTouchBegan(event) {
        event.propagationStopped = true;
      }
    }, {
      key: "_onTouchCancel",
      value: function _onTouchCancel(event) {
        event.propagationStopped = true;
      }
    }, {
      key: "_onTouchEnded",
      value: function _onTouchEnded(event) {
        if (this._impl) {
          this._impl.beginEditing();
        }

        event.propagationStopped = true;
      }
    }, {
      key: "_init",
      value: function _init() {
        this._createBackgroundSprite();

        this._updatePlaceholderLabel();

        this._updateTextLabel();

        this._isLabelVisible = true;
        this.node.on(_eventEnum.SystemEventType.SIZE_CHANGED, this._resizeChildNodes, this);
        var impl = this._impl = new EditBox._EditBoxImpl();
        impl.init(this);

        this._updateString(this._string);

        this._syncSize();
      }
    }, {
      key: "_createBackgroundSprite",
      value: function _createBackgroundSprite() {
        if (!this._background) {
          this._background = this.node.getComponent(_sprite.Sprite);

          if (!this._background) {
            this._background = this.node.addComponent(_sprite.Sprite);
          }
        }

        this._background.type = _sprite.Sprite.Type.SLICED;
        this._background.spriteFrame = this._backgroundImage;
      }
    }, {
      key: "_updateTextLabel",
      value: function _updateTextLabel() {
        var textLabel = this._textLabel; // If textLabel doesn't exist, create one.

        if (!textLabel) {
          var node = this.node.getChildByName('TEXT_LABEL');

          if (!node) {
            node = new _node.Node('TEXT_LABEL');
          }

          textLabel = node.getComponent(_label.Label);

          if (!textLabel) {
            textLabel = node.addComponent(_label.Label);
          }

          node.parent = this.node;
          this._textLabel = textLabel;
        } // update


        var transformComp = this._textLabel.node._uiProps.uiTransformComp;
        transformComp.setAnchorPoint(0, 1);
        textLabel.overflow = _label.Label.Overflow.CLAMP;

        if (this._inputMode === _types.InputMode.ANY) {
          textLabel.verticalAlign = _label.VerticalTextAlignment.TOP;
          textLabel.enableWrapText = true;
        } else {
          textLabel.verticalAlign = _label.VerticalTextAlignment.CENTER;
          textLabel.enableWrapText = false;
        }

        textLabel.string = this._updateLabelStringStyle(this._string);
      }
    }, {
      key: "_updatePlaceholderLabel",
      value: function _updatePlaceholderLabel() {
        var placeholderLabel = this._placeholderLabel; // If placeholderLabel doesn't exist, create one.

        if (!placeholderLabel) {
          var node = this.node.getChildByName('PLACEHOLDER_LABEL');

          if (!node) {
            node = new _node.Node('PLACEHOLDER_LABEL');
          }

          placeholderLabel = node.getComponent(_label.Label);

          if (!placeholderLabel) {
            placeholderLabel = node.addComponent(_label.Label);
          }

          node.parent = this.node;
          this._placeholderLabel = placeholderLabel;
        } // update


        var transform = this._placeholderLabel.node._uiProps.uiTransformComp;
        transform.setAnchorPoint(0, 1);
        placeholderLabel.overflow = _label.Label.Overflow.CLAMP;

        if (this._inputMode === _types.InputMode.ANY) {
          placeholderLabel.verticalAlign = _label.VerticalTextAlignment.TOP;
          placeholderLabel.enableWrapText = true;
        } else {
          placeholderLabel.verticalAlign = _label.VerticalTextAlignment.CENTER;
          placeholderLabel.enableWrapText = false;
        }

        placeholderLabel.string = this.placeholder;
      }
    }, {
      key: "_syncSize",
      value: function _syncSize() {
        var trans = this.node._uiProps.uiTransformComp;
        var size = trans.contentSize;

        if (this._background) {
          var bgTrans = this._background.node._uiProps.uiTransformComp;
          bgTrans.anchorPoint = trans.anchorPoint;
          bgTrans.setContentSize(size);
        }

        this._updateLabelPosition(size);

        if (this._impl) {
          this._impl.setSize(size.width, size.height);
        }
      }
    }, {
      key: "_updateLabels",
      value: function _updateLabels() {
        if (this._isLabelVisible) {
          var content = this._string;

          if (this._textLabel) {
            this._textLabel.node.active = content !== '';
          }

          if (this._placeholderLabel) {
            this._placeholderLabel.node.active = content === '';
          }
        }
      }
    }, {
      key: "_updateString",
      value: function _updateString(text) {
        var textLabel = this._textLabel; // Not inited yet

        if (!textLabel) {
          return;
        }

        var displayText = text;

        if (displayText) {
          displayText = this._updateLabelStringStyle(displayText);
        }

        textLabel.string = displayText;

        this._updateLabels();
      }
    }, {
      key: "_updateLabelStringStyle",
      value: function _updateLabelStringStyle(text) {
        var ignorePassword = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var inputFlag = this._inputFlag;

        if (!ignorePassword && inputFlag === _types.InputFlag.PASSWORD) {
          var passwordString = '';
          var len = text.length;

          for (var i = 0; i < len; ++i) {
            passwordString += "\u25CF";
          }

          text = passwordString;
        } else if (inputFlag === _types.InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
          text = text.toUpperCase();
        } else if (inputFlag === _types.InputFlag.INITIAL_CAPS_WORD) {
          text = capitalize(text);
        } else if (inputFlag === _types.InputFlag.INITIAL_CAPS_SENTENCE) {
          text = capitalizeFirstLetter(text);
        }

        return text;
      }
    }, {
      key: "_registerEvent",
      value: function _registerEvent() {
        this.node.on(_eventEnum.SystemEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(_eventEnum.SystemEventType.TOUCH_END, this._onTouchEnded, this);
      }
    }, {
      key: "_unregisterEvent",
      value: function _unregisterEvent() {
        this.node.off(_eventEnum.SystemEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(_eventEnum.SystemEventType.TOUCH_END, this._onTouchEnded, this);
      }
    }, {
      key: "_updateLabelPosition",
      value: function _updateLabelPosition(size) {
        var trans = this.node._uiProps.uiTransformComp;
        var offX = -trans.anchorX * trans.width;
        var offY = -trans.anchorY * trans.height;
        var placeholderLabel = this._placeholderLabel;
        var textLabel = this._textLabel;

        if (textLabel) {
          textLabel.node._uiProps.uiTransformComp.setContentSize(size.width - LEFT_PADDING, size.height);

          textLabel.node.position = new _index3.Vec3(offX + LEFT_PADDING, offY + size.height, textLabel.node.position.z);
          textLabel.verticalAlign = this._inputMode === _types.InputMode.ANY ? _label.VerticalTextAlignment.TOP : _label.VerticalTextAlignment.CENTER;
          textLabel.enableWrapText = this._inputMode === _types.InputMode.ANY ? true : false;
        }

        if (placeholderLabel) {
          placeholderLabel.node._uiProps.uiTransformComp.setContentSize(size.width - LEFT_PADDING, size.height);

          placeholderLabel.lineHeight = size.height;
          placeholderLabel.node.position = new _index3.Vec3(offX + LEFT_PADDING, offY + size.height, placeholderLabel.node.position.z);
          placeholderLabel.verticalAlign = this._inputMode === _types.InputMode.ANY ? _label.VerticalTextAlignment.TOP : _label.VerticalTextAlignment.CENTER;
          placeholderLabel.enableWrapText = this._inputMode === _types.InputMode.ANY ? true : false;
        }
      }
    }, {
      key: "_resizeChildNodes",
      value: function _resizeChildNodes() {
        var trans = this.node._uiProps.uiTransformComp;
        var textLabelNode = this._textLabel && this._textLabel.node;

        if (textLabelNode) {
          textLabelNode.position = new _index3.Vec3(-trans.width / 2, trans.height / 2, textLabelNode.position.z);

          textLabelNode._uiProps.uiTransformComp.setContentSize(trans.contentSize);
        }

        var placeholderLabelNode = this._placeholderLabel && this._placeholderLabel.node;

        if (placeholderLabelNode) {
          placeholderLabelNode.position = new _index3.Vec3(-trans.width / 2, trans.height / 2, placeholderLabelNode.position.z);

          placeholderLabelNode._uiProps.uiTransformComp.setContentSize(trans.contentSize);
        }

        var backgroundNode = this._background && this._background.node;

        if (backgroundNode) {
          backgroundNode._uiProps.uiTransformComp.setContentSize(trans.contentSize);
        }
      }
    }, {
      key: "string",

      /**
       * @en
       * Input string of EditBox.
       *
       * @zh
       * 输入框的初始输入内容，如果为空则会显示占位符的文本。
       */
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        if (this._maxLength >= 0 && value.length >= this._maxLength) {
          value = value.slice(0, this._maxLength);
        }

        this._string = value;

        this._updateString(value);
      }
      /**
       * @en
       * The display text of placeholder.
       *
       * @zh
       * 输入框占位符的文本内容。
       */

    }, {
      key: "placeholder",
      get: function get() {
        if (!this._placeholderLabel) {
          return '';
        }

        return this._placeholderLabel.string;
      },
      set: function set(value) {
        if (this._placeholderLabel) {
          this._placeholderLabel.string = value;
        }
      }
      /**
       * @en
       * The Label component attached to the node for EditBox's input text label
       *
       * @zh
       * 输入框输入文本节点上挂载的 Label 组件对象
       */

    }, {
      key: "textLabel",
      get: function get() {
        return this._textLabel;
      },
      set: function set(oldValue) {
        if (this._textLabel !== oldValue) {
          this._textLabel = oldValue;

          if (this._textLabel) {
            this._updateTextLabel();

            this._updateLabels();
          }
        }
      }
      /**
       * @en
       * The Label component attached to the node for EditBox's placeholder text label.
       *
       * @zh
       * 输入框占位符节点上挂载的 Label 组件对象。
       */

    }, {
      key: "placeholderLabel",
      get: function get() {
        return this._placeholderLabel;
      },
      set: function set(oldValue) {
        if (this._placeholderLabel !== oldValue) {
          this._placeholderLabel = oldValue;

          if (this._placeholderLabel) {
            this._updatePlaceholderLabel();

            this._updateLabels();
          }
        }
      }
      /**
       * @en
       * The background image of EditBox.
       *
       * @zh
       * 输入框的背景图片。
       */

    }, {
      key: "backgroundImage",
      get: function get() {
        return this._backgroundImage;
      },
      set: function set(value) {
        if (this._backgroundImage === value) {
          return;
        }

        this._backgroundImage = value;

        this._createBackgroundSprite();
      }
      /**
       * @en
       * Set the input flags that are to be applied to the EditBox.
       *
       * @zh
       * 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
       */

    }, {
      key: "inputFlag",
      get: function get() {
        return this._inputFlag;
      },
      set: function set(value) {
        this._inputFlag = value;

        this._updateString(this._string);
      }
      /**
       * @en
       * Set the input mode of the edit box.
       * If you pass ANY, it will create a multiline EditBox.
       *
       * @zh
       * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
       */

    }, {
      key: "inputMode",
      get: function get() {
        return this._inputMode;
      },
      set: function set(oldValue) {
        if (this._inputMode !== oldValue) {
          this._inputMode = oldValue;

          this._updateTextLabel();

          this._updatePlaceholderLabel();
        }
      }
      /**
       * @en
       * The return key type of EditBox.
       * Note: it is meaningless for web platforms and desktop platforms.
       *
       * @zh
       * 指定移动设备上面回车按钮的样式。
       * 注意：这个选项对 web 平台与 desktop 平台无效。
       */

    }, {
      key: "returnType",
      get: function get() {
        return this._returnType;
      },
      set: function set(value) {
        this._returnType = value;
      }
      /**
       * @en
       * The maximize input length of EditBox.
       * - If pass a value less than 0, it won't limit the input number of characters.
       * - If pass 0, it doesn't allow input any characters.
       *
       * @zh
       * 输入框最大允许输入的字符个数。
       * - 如果值为小于 0 的值，则不会限制输入字符个数。
       * - 如果值为 0，则不允许用户进行任何输入。
       */

    }, {
      key: "maxLength",
      get: function get() {
        return this._maxLength;
      },
      set: function set(value) {
        this._maxLength = value;
      }
      /**
       * @en
       * Set the tabIndex of the DOM input element (only useful on Web).
       *
       * @zh
       * 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
       */

    }, {
      key: "tabIndex",
      get: function get() {
        return this._tabIndex;
      },
      set: function set(value) {
        if (this._tabIndex !== value) {
          this._tabIndex = value;

          if (this._impl) {
            this._impl.setTabIndex(value);
          }
        }
      }
    }]);

    return EditBox;
  }(_component.Component), _class3._EditBoxImpl = _editBoxImplBase.EditBoxImplBase, _class3.KeyboardReturnType = _types.KeyboardReturnType, _class3.InputFlag = _types.InputFlag, _class3.InputMode = _types.InputMode, _class3.EventType = EventType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "string", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "string"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "placeholder", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "placeholder"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "textLabel", [_dec10, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "textLabel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "placeholderLabel", [_dec13, _dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "placeholderLabel"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "backgroundImage", [_dec16, _dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "backgroundImage"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "inputFlag", [_dec19, _dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "inputFlag"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "inputMode", [_dec22, _dec23, _dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "inputMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "returnType", [_dec25, _dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "returnType"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "maxLength", [_dec28, _dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "maxLength"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "tabIndex", [_dec30, _dec31], Object.getOwnPropertyDescriptor(_class2.prototype, "tabIndex"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "editingDidBegan", [_dec32, _dec33, _dec34], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "textChanged", [_dec35, _index2.serializable, _dec36, _dec37], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "editingDidEnded", [_dec38, _index2.serializable, _dec39, _dec40], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "editingReturn", [_dec41, _index2.serializable, _dec42, _dec43], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_textLabel", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_placeholderLabel", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_returnType", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _types.KeyboardReturnType.DEFAULT;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_useOriginalSize", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_string", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_tabIndex", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_backgroundImage", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_inputFlag", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _types.InputFlag.DEFAULT;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_inputMode", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _types.InputMode.ANY;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_maxLength", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 20;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.EditBox = EditBox;

  if (_sys.sys.isBrowser) {
    EditBox._EditBoxImpl = _editBoxImpl.EditBoxImpl;
  }
  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event editing-did-began
   * @param {Event.EventCustom} event
   * @param {EditBox} editbox - The EditBox component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event editing-did-ended
   * @param {Event.EventCustom} event
   * @param {EditBox} editbox - The EditBox component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event text-changed
   * @param {Event.EventCustom} event
   * @param {EditBox} editbox - The EditBox component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event editing-return
   * @param {Event.EventCustom} event
   * @param {EditBox} editbox - The EditBox component.
   */

  /**
   * @en if you don't need the EditBox and it isn't in any running Scene, you should
   * call the destroy method on this component or the associated node explicitly.
   * Otherwise, the created DOM element won't be removed from web page.
   * @zh
   * 如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
   * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
   * @example
   * ```
   * editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
   * // when you don't need editbox anymore
   * editbox.node.destroy();
   * ```
   * @return {Boolean} whether it is the first time the destroy being called
   */

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvZWRpdGJveC9lZGl0LWJveC50cyJdLCJuYW1lcyI6WyJMRUZUX1BBRERJTkciLCJjYXBpdGFsaXplIiwic3RyIiwicmVwbGFjZSIsImEiLCJ0b1VwcGVyQ2FzZSIsImNhcGl0YWxpemVGaXJzdExldHRlciIsImNoYXJBdCIsInNsaWNlIiwiRXZlbnRUeXBlIiwiRWRpdEJveCIsIlVJVHJhbnNmb3JtIiwiTGFiZWwiLCJTcHJpdGVGcmFtZSIsIklucHV0RmxhZyIsIklucHV0TW9kZSIsIktleWJvYXJkUmV0dXJuVHlwZSIsIkNvbXBvbmVudEV2ZW50SGFuZGxlciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2ltcGwiLCJfYmFja2dyb3VuZCIsIl9pc0xhYmVsVmlzaWJsZSIsIl9pbml0IiwiRURJVE9SIiwiX3JlZ2lzdGVyRXZlbnQiLCJvbkVuYWJsZSIsInVwZGF0ZSIsIl91bnJlZ2lzdGVyRXZlbnQiLCJvbkRpc2FibGUiLCJjbGVhciIsInNldEZvY3VzIiwiaXNGb2N1c2VkIiwiZW1pdEV2ZW50cyIsImVkaXRpbmdEaWRCZWdhbiIsIm5vZGUiLCJlbWl0IiwiRURJVElOR19ESURfQkVHQU4iLCJlZGl0aW5nRGlkRW5kZWQiLCJFRElUSU5HX0RJRF9FTkRFRCIsInRleHQiLCJfdXBkYXRlTGFiZWxTdHJpbmdTdHlsZSIsInN0cmluZyIsInRleHRDaGFuZ2VkIiwiVEVYVF9DSEFOR0VEIiwiZWRpdGluZ1JldHVybiIsIkVESVRJTkdfUkVUVVJOIiwiX3VwZGF0ZUxhYmVscyIsIl90ZXh0TGFiZWwiLCJhY3RpdmUiLCJfcGxhY2Vob2xkZXJMYWJlbCIsImV2ZW50IiwicHJvcGFnYXRpb25TdG9wcGVkIiwiYmVnaW5FZGl0aW5nIiwiX2NyZWF0ZUJhY2tncm91bmRTcHJpdGUiLCJfdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCIsIl91cGRhdGVUZXh0TGFiZWwiLCJvbiIsIlN5c3RlbUV2ZW50VHlwZSIsIlNJWkVfQ0hBTkdFRCIsIl9yZXNpemVDaGlsZE5vZGVzIiwiaW1wbCIsIl9FZGl0Qm94SW1wbCIsImluaXQiLCJfdXBkYXRlU3RyaW5nIiwiX3N0cmluZyIsIl9zeW5jU2l6ZSIsImdldENvbXBvbmVudCIsIlNwcml0ZSIsImFkZENvbXBvbmVudCIsInR5cGUiLCJUeXBlIiwiU0xJQ0VEIiwic3ByaXRlRnJhbWUiLCJfYmFja2dyb3VuZEltYWdlIiwidGV4dExhYmVsIiwiZ2V0Q2hpbGRCeU5hbWUiLCJOb2RlIiwicGFyZW50IiwidHJhbnNmb3JtQ29tcCIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwic2V0QW5jaG9yUG9pbnQiLCJvdmVyZmxvdyIsIk92ZXJmbG93IiwiQ0xBTVAiLCJfaW5wdXRNb2RlIiwiQU5ZIiwidmVydGljYWxBbGlnbiIsIlZlcnRpY2FsVGV4dEFsaWdubWVudCIsIlRPUCIsImVuYWJsZVdyYXBUZXh0IiwiQ0VOVEVSIiwicGxhY2Vob2xkZXJMYWJlbCIsInRyYW5zZm9ybSIsInBsYWNlaG9sZGVyIiwidHJhbnMiLCJzaXplIiwiY29udGVudFNpemUiLCJiZ1RyYW5zIiwiYW5jaG9yUG9pbnQiLCJzZXRDb250ZW50U2l6ZSIsIl91cGRhdGVMYWJlbFBvc2l0aW9uIiwic2V0U2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiY29udGVudCIsImRpc3BsYXlUZXh0IiwiaWdub3JlUGFzc3dvcmQiLCJpbnB1dEZsYWciLCJfaW5wdXRGbGFnIiwiUEFTU1dPUkQiLCJwYXNzd29yZFN0cmluZyIsImxlbiIsImxlbmd0aCIsImkiLCJJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMiLCJJTklUSUFMX0NBUFNfV09SRCIsIklOSVRJQUxfQ0FQU19TRU5URU5DRSIsIlRPVUNIX1NUQVJUIiwiX29uVG91Y2hCZWdhbiIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJvZmYiLCJvZmZYIiwiYW5jaG9yWCIsIm9mZlkiLCJhbmNob3JZIiwicG9zaXRpb24iLCJWZWMzIiwieiIsImxpbmVIZWlnaHQiLCJ0ZXh0TGFiZWxOb2RlIiwicGxhY2Vob2xkZXJMYWJlbE5vZGUiLCJiYWNrZ3JvdW5kTm9kZSIsInZhbHVlIiwiX21heExlbmd0aCIsIm9sZFZhbHVlIiwiX3JldHVyblR5cGUiLCJfdGFiSW5kZXgiLCJzZXRUYWJJbmRleCIsIkNvbXBvbmVudCIsIkVkaXRCb3hJbXBsQmFzZSIsInNlcmlhbGl6YWJsZSIsIkRFRkFVTFQiLCJzeXMiLCJpc0Jyb3dzZXIiLCJFZGl0Qm94SW1wbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdEQSxNQUFNQSxZQUFZLEdBQUcsQ0FBckI7O0FBRUEsV0FBU0MsVUFBVCxDQUFxQkMsR0FBckIsRUFBa0M7QUFDOUIsV0FBT0EsR0FBRyxDQUFDQyxPQUFKLENBQVksYUFBWixFQUEyQixVQUFDQyxDQUFELEVBQU87QUFDckMsYUFBT0EsQ0FBQyxDQUFDQyxXQUFGLEVBQVA7QUFDSCxLQUZNLENBQVA7QUFHSDs7QUFFRCxXQUFTQyxxQkFBVCxDQUFnQ0osR0FBaEMsRUFBNkM7QUFDekMsV0FBT0EsR0FBRyxDQUFDSyxNQUFKLENBQVcsQ0FBWCxFQUFjRixXQUFkLEtBQThCSCxHQUFHLENBQUNNLEtBQUosQ0FBVSxDQUFWLENBQXJDO0FBQ0g7O01BRUlDLFM7QUFNTDs7Ozs7Ozs7YUFOS0EsUztBQUFBQSxJQUFBQSxTO0FBQUFBLElBQUFBLFM7QUFBQUEsSUFBQUEsUztBQUFBQSxJQUFBQSxTO0tBQUFBLFMsS0FBQUEsUzs7TUFvQlFDLE8sV0FOWixxQkFBUSxZQUFSLEMsVUFDQSxrQkFBSyxpQkFBTCxDLFVBQ0EsNEJBQWUsR0FBZixDLFVBQ0Esa0JBQUssWUFBTCxDLFVBQ0EsOEJBQWlCQyxrQkFBakIsQyxVQVdJLDBCQUFhLENBQWIsQyxVQUNBLHFCQUFRLDJCQUFSLEMsVUFxQkEsMEJBQWEsQ0FBYixDLFVBQ0EscUJBQVEsYUFBUixDLFdBcUJBLGtCQUFLQyxZQUFMLEMsV0FDQSwwQkFBYSxDQUFiLEMsV0FDQSxxQkFBUSwwQkFBUixDLFdBc0JBLGtCQUFLQSxZQUFMLEMsV0FDQSwwQkFBYSxDQUFiLEMsV0FDQSxxQkFBUSx5QkFBUixDLFdBc0JBLGtCQUFLQyx3QkFBTCxDLFdBQ0EsMEJBQWEsQ0FBYixDLFdBQ0EscUJBQVEsVUFBUixDLFdBcUJBLGtCQUFLQyxnQkFBTCxDLFdBQ0EsMEJBQWEsQ0FBYixDLFdBQ0EscUJBQVEsOEJBQVIsQyxXQWtCQSxrQkFBS0MsZ0JBQUwsQyxXQUNBLDBCQUFhLENBQWIsQyxXQUNBLHFCQUFRLDRDQUFSLEMsV0FzQkEsa0JBQUtDLHlCQUFMLEMsV0FDQSwwQkFBYSxDQUFiLEMsV0FDQSxxQkFBUSxpQkFBUixDLFdBb0JBLDBCQUFhLENBQWIsQyxXQUNBLHFCQUFRLGdCQUFSLEMsV0FlQSwwQkFBYSxFQUFiLEMsV0FDQSxxQkFBUSw0Q0FBUixDLFdBMEJBLGtCQUFLLENBQUNDLG1DQUFELENBQUwsQyxXQUNBLDBCQUFhLEVBQWIsQyxXQUNBLHFCQUFRLHVCQUFSLEMsV0FVQSxrQkFBSyxDQUFDQSxtQ0FBRCxDQUFMLEMsV0FFQSwwQkFBYSxFQUFiLEMsV0FDQSxxQkFBUSxpQkFBUixDLFdBVUEsa0JBQUssQ0FBQ0EsbUNBQUQsQ0FBTCxDLFdBRUEsMEJBQWEsRUFBYixDLFdBQ0EscUJBQVEsd0VBQVIsQyxXQVVBLGtCQUFLLENBQUNBLG1DQUFELENBQUwsQyxXQUVBLDBCQUFhLEVBQWIsQyxXQUNBLHFCQUFRLDRDQUFSLEMsZ0ZBblJKQyx5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBc1JVQyxLLEdBQWdDLEk7WUFDaENDLFcsR0FBNkIsSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQXVCNUJDLGUsR0FBa0IsSzs7Ozs7O2tDQUVOO0FBQ2hCLGFBQUtDLEtBQUw7QUFDSDs7O2lDQUVrQjtBQUNmLFlBQUksQ0FBQ0Msd0JBQUwsRUFBYTtBQUNULGVBQUtDLGNBQUw7QUFDSDs7QUFDRCxZQUFJLEtBQUtMLEtBQVQsRUFBZ0I7QUFDWixlQUFLQSxLQUFMLENBQVdNLFFBQVg7QUFDSDtBQUNKOzs7K0JBRWdCO0FBQ2IsWUFBSSxLQUFLTixLQUFULEVBQWdCO0FBQ1osZUFBS0EsS0FBTCxDQUFXTyxNQUFYO0FBQ0g7QUFDSjs7O2tDQUVtQjtBQUNoQixZQUFJLENBQUNILHdCQUFMLEVBQWE7QUFDVCxlQUFLSSxnQkFBTDtBQUNIOztBQUNELFlBQUksS0FBS1IsS0FBVCxFQUFnQjtBQUNaLGVBQUtBLEtBQUwsQ0FBV1MsU0FBWDtBQUNIO0FBQ0o7OztrQ0FFbUI7QUFDaEIsWUFBSSxLQUFLVCxLQUFULEVBQWdCO0FBQ1osZUFBS0EsS0FBTCxDQUFXVSxLQUFYO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7O2lDQUltQjtBQUNmLFlBQUksS0FBS1YsS0FBVCxFQUFnQjtBQUNaLGVBQUtBLEtBQUwsQ0FBV1csUUFBWCxDQUFvQixJQUFwQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs4QkFJZ0I7QUFDWixZQUFJLEtBQUtYLEtBQVQsRUFBZ0I7QUFDWixlQUFLQSxLQUFMLENBQVdXLFFBQVgsQ0FBb0IsSUFBcEI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7NkJBSWU7QUFDWCxZQUFJLEtBQUtYLEtBQVQsRUFBZ0I7QUFDWixlQUFLQSxLQUFMLENBQVdXLFFBQVgsQ0FBb0IsS0FBcEI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7O2tDQUtvQjtBQUNoQixZQUFJLEtBQUtYLEtBQVQsRUFBZ0I7QUFDWixpQkFBTyxLQUFLQSxLQUFMLENBQVdZLFNBQVgsRUFBUDtBQUNIOztBQUNELGVBQU8sS0FBUDtBQUNIOzs7Z0RBRWlDO0FBQzlCZCw0Q0FBc0JlLFVBQXRCLENBQWlDLEtBQUtDLGVBQXRDLEVBQXVELElBQXZEOztBQUNBLGFBQUtDLElBQUwsQ0FBVUMsSUFBVixDQUFlMUIsU0FBUyxDQUFDMkIsaUJBQXpCLEVBQTRDLElBQTVDO0FBQ0g7OztnREFFaUM7QUFDOUJuQiw0Q0FBc0JlLFVBQXRCLENBQWlDLEtBQUtLLGVBQXRDLEVBQXVELElBQXZEOztBQUNBLGFBQUtILElBQUwsQ0FBVUMsSUFBVixDQUFlMUIsU0FBUyxDQUFDNkIsaUJBQXpCLEVBQTRDLElBQTVDO0FBQ0g7OzswQ0FFMkJDLEksRUFBYztBQUN0Q0EsUUFBQUEsSUFBSSxHQUFHLEtBQUtDLHVCQUFMLENBQTZCRCxJQUE3QixFQUFtQyxJQUFuQyxDQUFQO0FBQ0EsYUFBS0UsTUFBTCxHQUFjRixJQUFkOztBQUNBdEIsNENBQXNCZSxVQUF0QixDQUFpQyxLQUFLVSxXQUF0QyxFQUFtREgsSUFBbkQsRUFBeUQsSUFBekQ7O0FBQ0EsYUFBS0wsSUFBTCxDQUFVQyxJQUFWLENBQWUxQixTQUFTLENBQUNrQyxZQUF6QixFQUF1QyxJQUF2QztBQUNIOzs7OENBRStCO0FBQzVCMUIsNENBQXNCZSxVQUF0QixDQUFpQyxLQUFLWSxhQUF0QyxFQUFxRCxJQUFyRDs7QUFDQSxhQUFLVixJQUFMLENBQVVDLElBQVYsQ0FBZTFCLFNBQVMsQ0FBQ29DLGNBQXpCLEVBQXlDLElBQXpDO0FBQ0g7OztvQ0FFcUI7QUFDbEIsYUFBS3hCLGVBQUwsR0FBdUIsSUFBdkI7O0FBQ0EsYUFBS3lCLGFBQUw7QUFDSDs7O29DQUVxQjtBQUNsQixhQUFLekIsZUFBTCxHQUF1QixLQUF2Qjs7QUFDQSxZQUFJLEtBQUswQixVQUFULEVBQXFCO0FBQ2pCLGVBQUtBLFVBQUwsQ0FBZ0JiLElBQWhCLENBQXFCYyxNQUFyQixHQUE4QixLQUE5QjtBQUNIOztBQUNELFlBQUksS0FBS0MsaUJBQVQsRUFBNEI7QUFDeEIsZUFBS0EsaUJBQUwsQ0FBdUJmLElBQXZCLENBQTRCYyxNQUE1QixHQUFxQyxLQUFyQztBQUNIO0FBQ0o7OztvQ0FFd0JFLEssRUFBbUI7QUFDeENBLFFBQUFBLEtBQUssQ0FBQ0Msa0JBQU4sR0FBMkIsSUFBM0I7QUFDSDs7O3FDQUV5QkQsSyxFQUFtQjtBQUN6Q0EsUUFBQUEsS0FBSyxDQUFDQyxrQkFBTixHQUEyQixJQUEzQjtBQUNIOzs7b0NBRXdCRCxLLEVBQW1CO0FBQ3hDLFlBQUksS0FBSy9CLEtBQVQsRUFBZ0I7QUFDWixlQUFLQSxLQUFMLENBQVdpQyxZQUFYO0FBQ0g7O0FBQ0RGLFFBQUFBLEtBQUssQ0FBQ0Msa0JBQU4sR0FBMkIsSUFBM0I7QUFDSDs7OzhCQUVrQjtBQUNmLGFBQUtFLHVCQUFMOztBQUNBLGFBQUtDLHVCQUFMOztBQUNBLGFBQUtDLGdCQUFMOztBQUNBLGFBQUtsQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsYUFBS2EsSUFBTCxDQUFVc0IsRUFBVixDQUFhQywyQkFBZ0JDLFlBQTdCLEVBQTJDLEtBQUtDLGlCQUFoRCxFQUFtRSxJQUFuRTtBQUVBLFlBQU1DLElBQUksR0FBRyxLQUFLekMsS0FBTCxHQUFhLElBQUlULE9BQU8sQ0FBQ21ELFlBQVosRUFBMUI7QUFDQUQsUUFBQUEsSUFBSSxDQUFDRSxJQUFMLENBQVUsSUFBVjs7QUFDQSxhQUFLQyxhQUFMLENBQW1CLEtBQUtDLE9BQXhCOztBQUNBLGFBQUtDLFNBQUw7QUFDSDs7O2dEQUVvQztBQUNqQyxZQUFJLENBQUMsS0FBSzdDLFdBQVYsRUFBdUI7QUFDbkIsZUFBS0EsV0FBTCxHQUFtQixLQUFLYyxJQUFMLENBQVVnQyxZQUFWLENBQXVCQyxjQUF2QixDQUFuQjs7QUFDQSxjQUFJLENBQUMsS0FBSy9DLFdBQVYsRUFBdUI7QUFDbkIsaUJBQUtBLFdBQUwsR0FBbUIsS0FBS2MsSUFBTCxDQUFVa0MsWUFBVixDQUF1QkQsY0FBdkIsQ0FBbkI7QUFDSDtBQUVKOztBQUVELGFBQUsvQyxXQUFMLENBQWtCaUQsSUFBbEIsR0FBeUJGLGVBQU9HLElBQVAsQ0FBWUMsTUFBckM7QUFDQSxhQUFLbkQsV0FBTCxDQUFrQm9ELFdBQWxCLEdBQWdDLEtBQUtDLGdCQUFyQztBQUNIOzs7eUNBRTZCO0FBQzFCLFlBQUlDLFNBQVMsR0FBRyxLQUFLM0IsVUFBckIsQ0FEMEIsQ0FHMUI7O0FBQ0EsWUFBSSxDQUFDMkIsU0FBTCxFQUFnQjtBQUNaLGNBQUl4QyxJQUFJLEdBQUcsS0FBS0EsSUFBTCxDQUFVeUMsY0FBVixDQUF5QixZQUF6QixDQUFYOztBQUNBLGNBQUksQ0FBQ3pDLElBQUwsRUFBVztBQUNQQSxZQUFBQSxJQUFJLEdBQUcsSUFBSTBDLFVBQUosQ0FBUyxZQUFULENBQVA7QUFDSDs7QUFDREYsVUFBQUEsU0FBUyxHQUFHeEMsSUFBSSxDQUFFZ0MsWUFBTixDQUFtQnRELFlBQW5CLENBQVo7O0FBQ0EsY0FBSSxDQUFDOEQsU0FBTCxFQUFnQjtBQUNaQSxZQUFBQSxTQUFTLEdBQUd4QyxJQUFJLENBQUVrQyxZQUFOLENBQW1CeEQsWUFBbkIsQ0FBWjtBQUNIOztBQUNEc0IsVUFBQUEsSUFBSSxDQUFFMkMsTUFBTixHQUFlLEtBQUszQyxJQUFwQjtBQUNBLGVBQUthLFVBQUwsR0FBa0IyQixTQUFsQjtBQUNILFNBZnlCLENBaUIxQjs7O0FBQ0EsWUFBTUksYUFBYSxHQUFHLEtBQUsvQixVQUFMLENBQWlCYixJQUFqQixDQUFzQjZDLFFBQXRCLENBQStCQyxlQUFyRDtBQUNBRixRQUFBQSxhQUFhLENBQUVHLGNBQWYsQ0FBOEIsQ0FBOUIsRUFBaUMsQ0FBakM7QUFDQVAsUUFBQUEsU0FBUyxDQUFFUSxRQUFYLEdBQXNCdEUsYUFBTXVFLFFBQU4sQ0FBZUMsS0FBckM7O0FBQ0EsWUFBSSxLQUFLQyxVQUFMLEtBQW9CdEUsaUJBQVV1RSxHQUFsQyxFQUF1QztBQUNuQ1osVUFBQUEsU0FBUyxDQUFFYSxhQUFYLEdBQTJCQyw2QkFBc0JDLEdBQWpEO0FBQ0FmLFVBQUFBLFNBQVMsQ0FBRWdCLGNBQVgsR0FBNEIsSUFBNUI7QUFDSCxTQUhELE1BSUs7QUFDRGhCLFVBQUFBLFNBQVMsQ0FBRWEsYUFBWCxHQUEyQkMsNkJBQXNCRyxNQUFqRDtBQUNBakIsVUFBQUEsU0FBUyxDQUFFZ0IsY0FBWCxHQUE0QixLQUE1QjtBQUNIOztBQUNEaEIsUUFBQUEsU0FBUyxDQUFFakMsTUFBWCxHQUFvQixLQUFLRCx1QkFBTCxDQUE2QixLQUFLd0IsT0FBbEMsQ0FBcEI7QUFDSDs7O2dEQUVvQztBQUNqQyxZQUFJNEIsZ0JBQWdCLEdBQUcsS0FBSzNDLGlCQUE1QixDQURpQyxDQUdqQzs7QUFDQSxZQUFJLENBQUMyQyxnQkFBTCxFQUF1QjtBQUNuQixjQUFJMUQsSUFBSSxHQUFHLEtBQUtBLElBQUwsQ0FBVXlDLGNBQVYsQ0FBeUIsbUJBQXpCLENBQVg7O0FBQ0EsY0FBSSxDQUFDekMsSUFBTCxFQUFXO0FBQ1BBLFlBQUFBLElBQUksR0FBRyxJQUFJMEMsVUFBSixDQUFTLG1CQUFULENBQVA7QUFDSDs7QUFDRGdCLFVBQUFBLGdCQUFnQixHQUFHMUQsSUFBSSxDQUFFZ0MsWUFBTixDQUFtQnRELFlBQW5CLENBQW5COztBQUNBLGNBQUksQ0FBQ2dGLGdCQUFMLEVBQXVCO0FBQ25CQSxZQUFBQSxnQkFBZ0IsR0FBRzFELElBQUksQ0FBRWtDLFlBQU4sQ0FBbUJ4RCxZQUFuQixDQUFuQjtBQUNIOztBQUNEc0IsVUFBQUEsSUFBSSxDQUFFMkMsTUFBTixHQUFlLEtBQUszQyxJQUFwQjtBQUNBLGVBQUtlLGlCQUFMLEdBQXlCMkMsZ0JBQXpCO0FBQ0gsU0FmZ0MsQ0FpQmpDOzs7QUFDQSxZQUFNQyxTQUFTLEdBQUcsS0FBSzVDLGlCQUFMLENBQXdCZixJQUF4QixDQUE2QjZDLFFBQTdCLENBQXNDQyxlQUF4RDtBQUNBYSxRQUFBQSxTQUFTLENBQUVaLGNBQVgsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0I7QUFDQVcsUUFBQUEsZ0JBQWdCLENBQUVWLFFBQWxCLEdBQTZCdEUsYUFBTXVFLFFBQU4sQ0FBZUMsS0FBNUM7O0FBQ0EsWUFBSSxLQUFLQyxVQUFMLEtBQW9CdEUsaUJBQVV1RSxHQUFsQyxFQUF1QztBQUNuQ00sVUFBQUEsZ0JBQWdCLENBQUVMLGFBQWxCLEdBQWtDQyw2QkFBc0JDLEdBQXhEO0FBQ0FHLFVBQUFBLGdCQUFnQixDQUFFRixjQUFsQixHQUFtQyxJQUFuQztBQUNILFNBSEQsTUFJSztBQUNERSxVQUFBQSxnQkFBZ0IsQ0FBRUwsYUFBbEIsR0FBa0NDLDZCQUFzQkcsTUFBeEQ7QUFDQUMsVUFBQUEsZ0JBQWdCLENBQUVGLGNBQWxCLEdBQW1DLEtBQW5DO0FBQ0g7O0FBQ0RFLFFBQUFBLGdCQUFnQixDQUFFbkQsTUFBbEIsR0FBMkIsS0FBS3FELFdBQWhDO0FBQ0g7OztrQ0FFc0I7QUFDbkIsWUFBSUMsS0FBSyxHQUFHLEtBQUs3RCxJQUFMLENBQVU2QyxRQUFWLENBQW1CQyxlQUEvQjtBQUNBLFlBQU1nQixJQUFJLEdBQUdELEtBQUssQ0FBQ0UsV0FBbkI7O0FBRUEsWUFBSSxLQUFLN0UsV0FBVCxFQUFzQjtBQUNsQixjQUFJOEUsT0FBTyxHQUFHLEtBQUs5RSxXQUFMLENBQWlCYyxJQUFqQixDQUFzQjZDLFFBQXRCLENBQStCQyxlQUE3QztBQUNBa0IsVUFBQUEsT0FBTyxDQUFDQyxXQUFSLEdBQXNCSixLQUFLLENBQUNJLFdBQTVCO0FBQ0FELFVBQUFBLE9BQU8sQ0FBQ0UsY0FBUixDQUF1QkosSUFBdkI7QUFDSDs7QUFFRCxhQUFLSyxvQkFBTCxDQUEwQkwsSUFBMUI7O0FBQ0EsWUFBSSxLQUFLN0UsS0FBVCxFQUFnQjtBQUNaLGVBQUtBLEtBQUwsQ0FBV21GLE9BQVgsQ0FBbUJOLElBQUksQ0FBQ08sS0FBeEIsRUFBK0JQLElBQUksQ0FBQ1EsTUFBcEM7QUFDSDtBQUNKOzs7c0NBRTBCO0FBQ3ZCLFlBQUksS0FBS25GLGVBQVQsRUFBMEI7QUFDdEIsY0FBTW9GLE9BQU8sR0FBRyxLQUFLekMsT0FBckI7O0FBQ0EsY0FBSSxLQUFLakIsVUFBVCxFQUFxQjtBQUNqQixpQkFBS0EsVUFBTCxDQUFnQmIsSUFBaEIsQ0FBcUJjLE1BQXJCLEdBQStCeUQsT0FBTyxLQUFLLEVBQTNDO0FBQ0g7O0FBQ0QsY0FBSSxLQUFLeEQsaUJBQVQsRUFBNEI7QUFDeEIsaUJBQUtBLGlCQUFMLENBQXVCZixJQUF2QixDQUE0QmMsTUFBNUIsR0FBc0N5RCxPQUFPLEtBQUssRUFBbEQ7QUFDSDtBQUNKO0FBQ0o7OztvQ0FFd0JsRSxJLEVBQWM7QUFDbkMsWUFBTW1DLFNBQVMsR0FBRyxLQUFLM0IsVUFBdkIsQ0FEbUMsQ0FFbkM7O0FBQ0EsWUFBSSxDQUFDMkIsU0FBTCxFQUFnQjtBQUNaO0FBQ0g7O0FBRUQsWUFBSWdDLFdBQVcsR0FBR25FLElBQWxCOztBQUNBLFlBQUltRSxXQUFKLEVBQWlCO0FBQ2JBLFVBQUFBLFdBQVcsR0FBRyxLQUFLbEUsdUJBQUwsQ0FBNkJrRSxXQUE3QixDQUFkO0FBQ0g7O0FBRURoQyxRQUFBQSxTQUFTLENBQUNqQyxNQUFWLEdBQW1CaUUsV0FBbkI7O0FBRUEsYUFBSzVELGFBQUw7QUFDSDs7OzhDQUVrQ1AsSSxFQUErQztBQUFBLFlBQWpDb0UsY0FBaUMsdUVBQVAsS0FBTztBQUM5RSxZQUFNQyxTQUFTLEdBQUcsS0FBS0MsVUFBdkI7O0FBQ0EsWUFBSSxDQUFDRixjQUFELElBQW1CQyxTQUFTLEtBQUs5RixpQkFBVWdHLFFBQS9DLEVBQXlEO0FBQ3JELGNBQUlDLGNBQWMsR0FBRyxFQUFyQjtBQUNBLGNBQU1DLEdBQUcsR0FBR3pFLElBQUksQ0FBQzBFLE1BQWpCOztBQUNBLGVBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsR0FBcEIsRUFBeUIsRUFBRUUsQ0FBM0IsRUFBOEI7QUFDMUJILFlBQUFBLGNBQWMsSUFBSSxRQUFsQjtBQUNIOztBQUNEeEUsVUFBQUEsSUFBSSxHQUFHd0UsY0FBUDtBQUNILFNBUEQsTUFPTyxJQUFJSCxTQUFTLEtBQUs5RixpQkFBVXFHLDJCQUE1QixFQUF5RDtBQUM1RDVFLFVBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDbEMsV0FBTCxFQUFQO0FBQ0gsU0FGTSxNQUVBLElBQUl1RyxTQUFTLEtBQUs5RixpQkFBVXNHLGlCQUE1QixFQUErQztBQUNsRDdFLFVBQUFBLElBQUksR0FBR3RDLFVBQVUsQ0FBQ3NDLElBQUQsQ0FBakI7QUFDSCxTQUZNLE1BRUEsSUFBSXFFLFNBQVMsS0FBSzlGLGlCQUFVdUcscUJBQTVCLEVBQW1EO0FBQ3REOUUsVUFBQUEsSUFBSSxHQUFHakMscUJBQXFCLENBQUNpQyxJQUFELENBQTVCO0FBQ0g7O0FBRUQsZUFBT0EsSUFBUDtBQUNIOzs7dUNBRTJCO0FBQ3hCLGFBQUtMLElBQUwsQ0FBVXNCLEVBQVYsQ0FBYUMsMkJBQWdCNkQsV0FBN0IsRUFBMEMsS0FBS0MsYUFBL0MsRUFBOEQsSUFBOUQ7QUFDQSxhQUFLckYsSUFBTCxDQUFVc0IsRUFBVixDQUFhQywyQkFBZ0IrRCxTQUE3QixFQUF3QyxLQUFLQyxhQUE3QyxFQUE0RCxJQUE1RDtBQUNIOzs7eUNBRTZCO0FBQzFCLGFBQUt2RixJQUFMLENBQVV3RixHQUFWLENBQWNqRSwyQkFBZ0I2RCxXQUE5QixFQUEyQyxLQUFLQyxhQUFoRCxFQUErRCxJQUEvRDtBQUNBLGFBQUtyRixJQUFMLENBQVV3RixHQUFWLENBQWNqRSwyQkFBZ0IrRCxTQUE5QixFQUF5QyxLQUFLQyxhQUE5QyxFQUE2RCxJQUE3RDtBQUNIOzs7MkNBRStCekIsSSxFQUFZO0FBQ3hDLFlBQUlELEtBQUssR0FBRyxLQUFLN0QsSUFBTCxDQUFVNkMsUUFBVixDQUFtQkMsZUFBL0I7QUFDQSxZQUFNMkMsSUFBSSxHQUFHLENBQUM1QixLQUFLLENBQUM2QixPQUFQLEdBQWlCN0IsS0FBSyxDQUFDUSxLQUFwQztBQUNBLFlBQU1zQixJQUFJLEdBQUcsQ0FBQzlCLEtBQUssQ0FBQytCLE9BQVAsR0FBaUIvQixLQUFLLENBQUNTLE1BQXBDO0FBRUEsWUFBTVosZ0JBQWdCLEdBQUcsS0FBSzNDLGlCQUE5QjtBQUNBLFlBQU15QixTQUFTLEdBQUcsS0FBSzNCLFVBQXZCOztBQUNBLFlBQUkyQixTQUFKLEVBQWU7QUFDWEEsVUFBQUEsU0FBUyxDQUFDeEMsSUFBVixDQUFlNkMsUUFBZixDQUF3QkMsZUFBeEIsQ0FBeUNvQixjQUF6QyxDQUF3REosSUFBSSxDQUFDTyxLQUFMLEdBQWF2RyxZQUFyRSxFQUFtRmdHLElBQUksQ0FBQ1EsTUFBeEY7O0FBQ0E5QixVQUFBQSxTQUFTLENBQUN4QyxJQUFWLENBQWU2RixRQUFmLEdBQTBCLElBQUlDLFlBQUosQ0FBVUwsSUFBSSxHQUFHM0gsWUFBakIsRUFBK0I2SCxJQUFJLEdBQUc3QixJQUFJLENBQUNRLE1BQTNDLEVBQW1EOUIsU0FBUyxDQUFDeEMsSUFBVixDQUFlNkYsUUFBZixDQUF3QkUsQ0FBM0UsQ0FBMUI7QUFDQXZELFVBQUFBLFNBQVMsQ0FBQ2EsYUFBVixHQUEwQixLQUFLRixVQUFMLEtBQW9CdEUsaUJBQVV1RSxHQUE5QixHQUFvQ0UsNkJBQXNCQyxHQUExRCxHQUFnRUQsNkJBQXNCRyxNQUFoSDtBQUNBakIsVUFBQUEsU0FBUyxDQUFDZ0IsY0FBVixHQUEyQixLQUFLTCxVQUFMLEtBQW9CdEUsaUJBQVV1RSxHQUE5QixHQUFvQyxJQUFwQyxHQUEyQyxLQUF0RTtBQUNIOztBQUVELFlBQUlNLGdCQUFKLEVBQXNCO0FBQ2xCQSxVQUFBQSxnQkFBZ0IsQ0FBQzFELElBQWpCLENBQXNCNkMsUUFBdEIsQ0FBK0JDLGVBQS9CLENBQWdEb0IsY0FBaEQsQ0FBK0RKLElBQUksQ0FBQ08sS0FBTCxHQUFhdkcsWUFBNUUsRUFBMEZnRyxJQUFJLENBQUNRLE1BQS9GOztBQUNBWixVQUFBQSxnQkFBZ0IsQ0FBQ3NDLFVBQWpCLEdBQThCbEMsSUFBSSxDQUFDUSxNQUFuQztBQUNBWixVQUFBQSxnQkFBZ0IsQ0FBQzFELElBQWpCLENBQXNCNkYsUUFBdEIsR0FBaUMsSUFBSUMsWUFBSixDQUFVTCxJQUFJLEdBQUczSCxZQUFqQixFQUErQjZILElBQUksR0FBRzdCLElBQUksQ0FBQ1EsTUFBM0MsRUFBbURaLGdCQUFnQixDQUFDMUQsSUFBakIsQ0FBc0I2RixRQUF0QixDQUErQkUsQ0FBbEYsQ0FBakM7QUFDQXJDLFVBQUFBLGdCQUFnQixDQUFDTCxhQUFqQixHQUFpQyxLQUFLRixVQUFMLEtBQW9CdEUsaUJBQVV1RSxHQUE5QixHQUM3QkUsNkJBQXNCQyxHQURPLEdBQ0RELDZCQUFzQkcsTUFEdEQ7QUFFQUMsVUFBQUEsZ0JBQWdCLENBQUNGLGNBQWpCLEdBQWtDLEtBQUtMLFVBQUwsS0FBb0J0RSxpQkFBVXVFLEdBQTlCLEdBQW9DLElBQXBDLEdBQTJDLEtBQTdFO0FBQ0g7QUFDSjs7OzBDQUU4QjtBQUMzQixZQUFJUyxLQUFLLEdBQUcsS0FBSzdELElBQUwsQ0FBVTZDLFFBQVYsQ0FBbUJDLGVBQS9CO0FBQ0EsWUFBTW1ELGFBQWEsR0FBRyxLQUFLcEYsVUFBTCxJQUFtQixLQUFLQSxVQUFMLENBQWdCYixJQUF6RDs7QUFDQSxZQUFJaUcsYUFBSixFQUFtQjtBQUNmQSxVQUFBQSxhQUFhLENBQUNKLFFBQWQsR0FBeUIsSUFBSUMsWUFBSixDQUFTLENBQUNqQyxLQUFLLENBQUNRLEtBQVAsR0FBZSxDQUF4QixFQUEyQlIsS0FBSyxDQUFDUyxNQUFOLEdBQWUsQ0FBMUMsRUFBNkMyQixhQUFhLENBQUNKLFFBQWQsQ0FBdUJFLENBQXBFLENBQXpCOztBQUNBRSxVQUFBQSxhQUFhLENBQUNwRCxRQUFkLENBQXVCQyxlQUF2QixDQUF3Q29CLGNBQXhDLENBQXVETCxLQUFLLENBQUNFLFdBQTdEO0FBQ0g7O0FBQ0QsWUFBTW1DLG9CQUFvQixHQUFHLEtBQUtuRixpQkFBTCxJQUEwQixLQUFLQSxpQkFBTCxDQUF1QmYsSUFBOUU7O0FBQ0EsWUFBSWtHLG9CQUFKLEVBQTBCO0FBQ3RCQSxVQUFBQSxvQkFBb0IsQ0FBQ0wsUUFBckIsR0FBZ0MsSUFBSUMsWUFBSixDQUFTLENBQUNqQyxLQUFLLENBQUNRLEtBQVAsR0FBZSxDQUF4QixFQUEyQlIsS0FBSyxDQUFDUyxNQUFOLEdBQWUsQ0FBMUMsRUFBNkM0QixvQkFBb0IsQ0FBQ0wsUUFBckIsQ0FBOEJFLENBQTNFLENBQWhDOztBQUNBRyxVQUFBQSxvQkFBb0IsQ0FBQ3JELFFBQXJCLENBQThCQyxlQUE5QixDQUErQ29CLGNBQS9DLENBQThETCxLQUFLLENBQUNFLFdBQXBFO0FBQ0g7O0FBQ0QsWUFBTW9DLGNBQWMsR0FBRyxLQUFLakgsV0FBTCxJQUFvQixLQUFLQSxXQUFMLENBQWlCYyxJQUE1RDs7QUFDQSxZQUFJbUcsY0FBSixFQUFvQjtBQUNoQkEsVUFBQUEsY0FBYyxDQUFDdEQsUUFBZixDQUF3QkMsZUFBeEIsQ0FBeUNvQixjQUF6QyxDQUF3REwsS0FBSyxDQUFDRSxXQUE5RDtBQUNIO0FBQ0o7Ozs7QUExbkJEOzs7Ozs7OzBCQVNjO0FBQ1YsZUFBTyxLQUFLakMsT0FBWjtBQUNILE87d0JBRVdzRSxLLEVBQU87QUFDZixZQUFJLEtBQUtDLFVBQUwsSUFBbUIsQ0FBbkIsSUFBd0JELEtBQUssQ0FBQ3JCLE1BQU4sSUFBZ0IsS0FBS3NCLFVBQWpELEVBQTZEO0FBQ3pERCxVQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQzlILEtBQU4sQ0FBWSxDQUFaLEVBQWUsS0FBSytILFVBQXBCLENBQVI7QUFDSDs7QUFFRCxhQUFLdkUsT0FBTCxHQUFlc0UsS0FBZjs7QUFDQSxhQUFLdkUsYUFBTCxDQUFtQnVFLEtBQW5CO0FBQ0g7QUFFRDs7Ozs7Ozs7OzswQkFTbUI7QUFDZixZQUFJLENBQUMsS0FBS3JGLGlCQUFWLEVBQTZCO0FBQ3pCLGlCQUFPLEVBQVA7QUFDSDs7QUFDRCxlQUFPLEtBQUtBLGlCQUFMLENBQXVCUixNQUE5QjtBQUNILE87d0JBRWdCNkYsSyxFQUFPO0FBQ3BCLFlBQUksS0FBS3JGLGlCQUFULEVBQTRCO0FBQ3hCLGVBQUtBLGlCQUFMLENBQXVCUixNQUF2QixHQUFnQzZGLEtBQWhDO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7OzBCQVVpQjtBQUNiLGVBQU8sS0FBS3ZGLFVBQVo7QUFDSCxPO3dCQUVjeUYsUSxFQUFVO0FBQ3JCLFlBQUksS0FBS3pGLFVBQUwsS0FBb0J5RixRQUF4QixFQUFrQztBQUM5QixlQUFLekYsVUFBTCxHQUFrQnlGLFFBQWxCOztBQUNBLGNBQUksS0FBS3pGLFVBQVQsRUFBcUI7QUFDakIsaUJBQUtRLGdCQUFMOztBQUNBLGlCQUFLVCxhQUFMO0FBQ0g7QUFDSjtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7MEJBVXdCO0FBQ3BCLGVBQU8sS0FBS0csaUJBQVo7QUFDSCxPO3dCQUVxQnVGLFEsRUFBVTtBQUM1QixZQUFJLEtBQUt2RixpQkFBTCxLQUEyQnVGLFFBQS9CLEVBQXlDO0FBQ3JDLGVBQUt2RixpQkFBTCxHQUF5QnVGLFFBQXpCOztBQUNBLGNBQUksS0FBS3ZGLGlCQUFULEVBQTRCO0FBQ3hCLGlCQUFLSyx1QkFBTDs7QUFDQSxpQkFBS1IsYUFBTDtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7Ozs7OzBCQVV1QjtBQUNuQixlQUFPLEtBQUsyQixnQkFBWjtBQUNILE87d0JBRW9CNkQsSyxFQUEyQjtBQUM1QyxZQUFJLEtBQUs3RCxnQkFBTCxLQUEwQjZELEtBQTlCLEVBQXFDO0FBQ2pDO0FBQ0g7O0FBRUQsYUFBSzdELGdCQUFMLEdBQXdCNkQsS0FBeEI7O0FBQ0EsYUFBS2pGLHVCQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7OzswQkFVaUI7QUFDYixlQUFPLEtBQUt3RCxVQUFaO0FBQ0gsTzt3QkFFY3lCLEssRUFBTztBQUNsQixhQUFLekIsVUFBTCxHQUFrQnlCLEtBQWxCOztBQUNBLGFBQUt2RSxhQUFMLENBQW1CLEtBQUtDLE9BQXhCO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7MEJBV2lCO0FBQ2IsZUFBTyxLQUFLcUIsVUFBWjtBQUNILE87d0JBRWNtRCxRLEVBQVU7QUFDckIsWUFBSSxLQUFLbkQsVUFBTCxLQUFvQm1ELFFBQXhCLEVBQWtDO0FBQzlCLGVBQUtuRCxVQUFMLEdBQWtCbUQsUUFBbEI7O0FBQ0EsZUFBS2pGLGdCQUFMOztBQUNBLGVBQUtELHVCQUFMO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7Ozs7MEJBWWtCO0FBQ2QsZUFBTyxLQUFLbUYsV0FBWjtBQUNILE87d0JBRWVILEssRUFBMkI7QUFDdkMsYUFBS0csV0FBTCxHQUFtQkgsS0FBbkI7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7OzswQkFhaUI7QUFDYixlQUFPLEtBQUtDLFVBQVo7QUFDSCxPO3dCQUNjRCxLLEVBQWU7QUFDMUIsYUFBS0MsVUFBTCxHQUFrQkQsS0FBbEI7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQVNnQjtBQUNaLGVBQU8sS0FBS0ksU0FBWjtBQUNILE87d0JBRWFKLEssRUFBTztBQUNqQixZQUFJLEtBQUtJLFNBQUwsS0FBbUJKLEtBQXZCLEVBQThCO0FBQzFCLGVBQUtJLFNBQUwsR0FBaUJKLEtBQWpCOztBQUNBLGNBQUksS0FBS25ILEtBQVQsRUFBZ0I7QUFDWixpQkFBS0EsS0FBTCxDQUFXd0gsV0FBWCxDQUF1QkwsS0FBdkI7QUFDSDtBQUNKO0FBQ0o7Ozs7SUEzTndCTSxvQixXQTZOWC9FLFksR0FBZWdGLGdDLFVBQ2Y3SCxrQixHQUFxQkEseUIsVUFDckJGLFMsR0FBWUEsZ0IsVUFDWkMsUyxHQUFZQSxnQixVQUNaTixTLEdBQVlBLFM7Ozs7O2FBV3dCLEU7OzBGQVVqRHFJLG9COzs7OzthQUc2QyxFOzs4RkFVN0NBLG9COzs7OzthQUdpRCxFOzs0RkFVakRBLG9COzs7OzthQUcrQyxFOztpRkFLL0NBLG9COzs7OzthQUNvQyxJOzt3RkFDcENBLG9COzs7OzthQUMyQyxJOztrRkFDM0NBLG9COzs7OzthQUN3QjlILDBCQUFtQitILE87O3VGQUMzQ0Qsb0I7Ozs7O2FBQzZCLEk7OzhFQUM3QkEsb0I7Ozs7O2FBQ29CLEU7O2lGQUNwQkEsb0I7Ozs7O2FBQ3NCLEM7O3dGQUN0QkEsb0I7Ozs7O2FBQ2lELEk7O2tGQUNqREEsb0I7Ozs7O2FBQ3VCaEksaUJBQVVpSSxPOztrRkFDakNELG9COzs7OzthQUN1Qi9ILGlCQUFVdUUsRzs7a0ZBQ2pDd0Qsb0I7Ozs7O2FBQ3VCLEU7Ozs7O0FBb1Y1QixNQUFJRSxTQUFJQyxTQUFSLEVBQWtCO0FBQ2R2SSxJQUFBQSxPQUFPLENBQUNtRCxZQUFSLEdBQXVCcUYsd0JBQXZCO0FBQ0g7QUFFRDs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuLi8uLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZSc7XHJcbmltcG9ydCB7IFNwcml0ZUZyYW1lIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9hc3NldHMvc3ByaXRlLWZyYW1lJztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vY29yZS9jb21wb25lbnRzL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IEV2ZW50SGFuZGxlciBhcyBDb21wb25lbnRFdmVudEhhbmRsZXIgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50LWV2ZW50LWhhbmRsZXInO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHJlcXVpcmVDb21wb25lbnQsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ29sb3IsIFNpemUsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBFdmVudFRvdWNoIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IFN5c3RlbUV2ZW50VHlwZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1lbnVtJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZSc7XHJcbmltcG9ydCB7IExhYmVsLCBWZXJ0aWNhbFRleHRBbGlnbm1lbnQgfSBmcm9tICcuLi9sYWJlbCc7XHJcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4uL3Nwcml0ZSc7XHJcbmltcG9ydCB7IEVkaXRCb3hJbXBsIH0gZnJvbSAnLi9lZGl0LWJveC1pbXBsJztcclxuaW1wb3J0IHsgRWRpdEJveEltcGxCYXNlIH0gZnJvbSAnLi9lZGl0LWJveC1pbXBsLWJhc2UnO1xyXG5pbXBvcnQgeyBJbnB1dEZsYWcsIElucHV0TW9kZSwgS2V5Ym9hcmRSZXR1cm5UeXBlIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvcGxhdGZvcm0vc3lzJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IExFRlRfUEFERElORyA9IDI7XHJcblxyXG5mdW5jdGlvbiBjYXBpdGFsaXplIChzdHI6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oPzpefFxccylcXFMvZywgKGEpID0+IHtcclxuICAgICAgICByZXR1cm4gYS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlciAoc3RyOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XHJcbn1cclxuXHJcbmVudW0gRXZlbnRUeXBlIHtcclxuICAgIEVESVRJTkdfRElEX0JFR0FOID0gJ2VkaXRpbmctZGlkLWJlZ2FuJyxcclxuICAgIEVESVRJTkdfRElEX0VOREVEID0gJ2VkaXRpbmctZGlkLWVuZGVkJyxcclxuICAgIFRFWFRfQ0hBTkdFRCA9ICd0ZXh0LWNoYW5nZWQnLFxyXG4gICAgRURJVElOR19SRVRVUk4gPSAnZWRpdGluZy1yZXR1cm4nLFxyXG59XHJcbi8qKlxyXG4gKiBAZW5cclxuICogYEVkaXRCb3hgIGlzIGEgY29tcG9uZW50IGZvciBpbnB1dGluZyB0ZXh0LCB5b3UgY2FuIHVzZSBpdCB0byBnYXRoZXIgc21hbGwgYW1vdW50cyBvZiB0ZXh0IGZyb20gdXNlcnMuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiBgRWRpdEJveGAg57uE5Lu277yM55So5LqO6I635Y+W55So5oi355qE6L6T5YWl5paH5pys44CCXHJcbiAqL1xyXG5cclxuQGNjY2xhc3MoJ2NjLkVkaXRCb3gnKVxyXG5AaGVscCgnaTE4bjpjYy5FZGl0Qm94JylcclxuQGV4ZWN1dGlvbk9yZGVyKDEwMClcclxuQG1lbnUoJ1VJL0VkaXRCb3gnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBFZGl0Qm94IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSW5wdXQgc3RyaW5nIG9mIEVkaXRCb3guXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDovpPlhaXmoYbnmoTliJ3lp4vovpPlhaXlhoXlrrnvvIzlpoLmnpzkuLrnqbrliJnkvJrmmL7npLrljaDkvY3nrKbnmoTmlofmnKzjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ+i+k+WFpeahhueahOWIneWni+i+k+WFpeWGheWuue+8jOWmguaenOS4uuepuuWImeS8muaYvuekuuWNoOS9jeespueahOaWh+acrCcpXHJcbiAgICBnZXQgc3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzdHJpbmcgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21heExlbmd0aCA+PSAwICYmIHZhbHVlLmxlbmd0aCA+PSB0aGlzLl9tYXhMZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCB0aGlzLl9tYXhMZW5ndGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RyaW5nKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGRpc3BsYXkgdGV4dCBvZiBwbGFjZWhvbGRlci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi+k+WFpeahhuWNoOS9jeespueahOaWh+acrOWGheWuueOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDIpXHJcbiAgICBAdG9vbHRpcCgn6L6T5YWl5qGG5Y2g5L2N56ym55qE5paH5pys5YaF5a65JylcclxuICAgIGdldCBwbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wbGFjZWhvbGRlckxhYmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWwuc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwbGFjZWhvbGRlciAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGxhY2Vob2xkZXJMYWJlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsLnN0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIExhYmVsIGNvbXBvbmVudCBhdHRhY2hlZCB0byB0aGUgbm9kZSBmb3IgRWRpdEJveCdzIGlucHV0IHRleHQgbGFiZWxcclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi+k+WFpeahhui+k+WFpeaWh+acrOiKgueCueS4iuaMgui9veeahCBMYWJlbCDnu4Tku7blr7nosaFcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTGFiZWwpXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdG9vbHRpcCgn6L6T5YWl5qGG6L6T5YWl5paH5pys6IqC54K55LiK5oyC6L2955qEIExhYmVsIOe7hOS7tuWvueixoScpXHJcbiAgICBnZXQgdGV4dExhYmVsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dExhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0TGFiZWwgKG9sZFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHRMYWJlbCAhPT0gb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dExhYmVsID0gb2xkVmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0TGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHRMYWJlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgTGFiZWwgY29tcG9uZW50IGF0dGFjaGVkIHRvIHRoZSBub2RlIGZvciBFZGl0Qm94J3MgcGxhY2Vob2xkZXIgdGV4dCBsYWJlbC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi+k+WFpeahhuWNoOS9jeespuiKgueCueS4iuaMgui9veeahCBMYWJlbCDnu4Tku7blr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTGFiZWwpXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgn6L6T5YWl5qGG5Y2g5L2N56ym6IqC54K55LiK5oyC6L2955qEIExhYmVsIOe7hOS7tuWvueixoScpXHJcbiAgICBnZXQgcGxhY2Vob2xkZXJMYWJlbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBsYWNlaG9sZGVyTGFiZWwgKG9sZFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BsYWNlaG9sZGVyTGFiZWwgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWwgPSBvbGRWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BsYWNlaG9sZGVyTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgYmFja2dyb3VuZCBpbWFnZSBvZiBFZGl0Qm94LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L6T5YWl5qGG55qE6IOM5pmv5Zu+54mH44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFNwcml0ZUZyYW1lKVxyXG4gICAgQGRpc3BsYXlPcmRlcig1KVxyXG4gICAgQHRvb2x0aXAoJ+i+k+WFpeahhueahOiDjOaZr+WbvueJhycpXHJcbiAgICBnZXQgYmFja2dyb3VuZEltYWdlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZEltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBiYWNrZ3JvdW5kSW1hZ2UgKHZhbHVlOiBTcHJpdGVGcmFtZSB8IG51bGwpIHtcclxuICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZEltYWdlID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2UgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9jcmVhdGVCYWNrZ3JvdW5kU3ByaXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCB0aGUgaW5wdXQgZmxhZ3MgdGhhdCBhcmUgdG8gYmUgYXBwbGllZCB0byB0aGUgRWRpdEJveC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+Wumui+k+WFpeagh+W/l+S9je+8jOWPr+S7peaMh+Wumui+k+WFpeaWueW8j+S4uuWvhueggeaIluiAheWNleivjemmluWtl+avjeWkp+WGmeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShJbnB1dEZsYWcpXHJcbiAgICBAZGlzcGxheU9yZGVyKDYpXHJcbiAgICBAdG9vbHRpcCgn5oyH5a6a6L6T5YWl5qCH5b+X5L2N77yM5Y+v5Lul5oyH5a6a6L6T5YWl5pa55byP5Li65a+G56CB5oiW6ICF5Y2V6K+N6aaW5a2X5q+N5aSn5YaZJylcclxuICAgIGdldCBpbnB1dEZsYWcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnB1dEZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGlucHV0RmxhZyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9pbnB1dEZsYWcgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdHJpbmcodGhpcy5fc3RyaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IHRoZSBpbnB1dCBtb2RlIG9mIHRoZSBlZGl0IGJveC5cclxuICAgICAqIElmIHlvdSBwYXNzIEFOWSwgaXQgd2lsbCBjcmVhdGUgYSBtdWx0aWxpbmUgRWRpdEJveC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+Wumui+k+WFpeaooeW8jzogQU5Z6KGo56S65aSa6KGM6L6T5YWl77yM5YW25a6D6YO95piv5Y2V6KGM6L6T5YWl77yM56e75Yqo5bmz5Y+w5LiK6L+Y5Y+v5Lul5oyH5a6a6ZSu55uY5qC35byP44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKElucHV0TW9kZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoNylcclxuICAgIEB0b29sdGlwKCfmjIflrprovpPlhaXmqKHlvI86IEFOWSDooajnpLrlpJrooYzovpPlhaXvvIzlhbblroPpg73mmK/ljZXooYzovpPlhaXvvIznp7vliqjlubPlj7DkuIrov5jlj6/ku6XmjIflrprplK7nm5jmoLflvI8nKVxyXG4gICAgZ2V0IGlucHV0TW9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lucHV0TW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW5wdXRNb2RlIChvbGRWYWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbnB1dE1vZGUgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lucHV0TW9kZSA9IG9sZFZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUZXh0TGFiZWwoKTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHJldHVybiBrZXkgdHlwZSBvZiBFZGl0Qm94LlxyXG4gICAgICogTm90ZTogaXQgaXMgbWVhbmluZ2xlc3MgZm9yIHdlYiBwbGF0Zm9ybXMgYW5kIGRlc2t0b3AgcGxhdGZvcm1zLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oyH5a6a56e75Yqo6K6+5aSH5LiK6Z2i5Zue6L2m5oyJ6ZKu55qE5qC35byP44CCXHJcbiAgICAgKiDms6jmhI/vvJrov5nkuKrpgInpobnlr7kgd2ViIOW5s+WPsOS4jiBkZXNrdG9wIOW5s+WPsOaXoOaViOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShLZXlib2FyZFJldHVyblR5cGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDgpXHJcbiAgICBAdG9vbHRpcCgn5oyH5a6a56e75Yqo6K6+5aSH5LiK6Z2i5Zue6L2m5oyJ6ZKu55qE5qC35byPJylcclxuICAgIGdldCByZXR1cm5UeXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmV0dXJuVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcmV0dXJuVHlwZSAodmFsdWU6IEtleWJvYXJkUmV0dXJuVHlwZSkge1xyXG4gICAgICAgIHRoaXMuX3JldHVyblR5cGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1heGltaXplIGlucHV0IGxlbmd0aCBvZiBFZGl0Qm94LlxyXG4gICAgICogLSBJZiBwYXNzIGEgdmFsdWUgbGVzcyB0aGFuIDAsIGl0IHdvbid0IGxpbWl0IHRoZSBpbnB1dCBudW1iZXIgb2YgY2hhcmFjdGVycy5cclxuICAgICAqIC0gSWYgcGFzcyAwLCBpdCBkb2Vzbid0IGFsbG93IGlucHV0IGFueSBjaGFyYWN0ZXJzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L6T5YWl5qGG5pyA5aSn5YWB6K646L6T5YWl55qE5a2X56ym5Liq5pWw44CCXHJcbiAgICAgKiAtIOWmguaenOWAvOS4uuWwj+S6jiAwIOeahOWAvO+8jOWImeS4jeS8mumZkOWItui+k+WFpeWtl+espuS4quaVsOOAglxyXG4gICAgICogLSDlpoLmnpzlgLzkuLogMO+8jOWImeS4jeWFgeiuuOeUqOaIt+i/m+ihjOS7u+S9lei+k+WFpeOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDkpXHJcbiAgICBAdG9vbHRpcCgn6L6T5YWl5qGG5pyA5aSn5YWB6K646L6T5YWl55qE5a2X56ym5Liq5pWwJylcclxuICAgIGdldCBtYXhMZW5ndGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhMZW5ndGg7XHJcbiAgICB9XHJcbiAgICBzZXQgbWF4TGVuZ3RoICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbWF4TGVuZ3RoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCB0aGUgdGFiSW5kZXggb2YgdGhlIERPTSBpbnB1dCBlbGVtZW50IChvbmx5IHVzZWZ1bCBvbiBXZWIpLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5L+u5pS5IERPTSDovpPlhaXlhYPntKDnmoQgdGFiSW5kZXjvvIjov5nkuKrlsZ7mgKflj6rmnInlnKggV2ViIOS4iumdouS/ruaUueacieaEj+S5ie+8ieOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDEwKVxyXG4gICAgQHRvb2x0aXAoJ+S/ruaUuSBET00g6L6T5YWl5YWD57Sg55qEIHRhYkluZGV477yI6L+Z5Liq5bGe5oCn5Y+q5pyJ5ZyoIFdlYiDkuIrpnaLkv67mlLnmnInmhI/kuYnvvIknKVxyXG4gICAgZ2V0IHRhYkluZGV4ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGFiSW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRhYkluZGV4ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90YWJJbmRleCAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0VGFiSW5kZXgodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgX0VkaXRCb3hJbXBsID0gRWRpdEJveEltcGxCYXNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBLZXlib2FyZFJldHVyblR5cGUgPSBLZXlib2FyZFJldHVyblR5cGU7XHJcbiAgICBwdWJsaWMgc3RhdGljIElucHV0RmxhZyA9IElucHV0RmxhZztcclxuICAgIHB1YmxpYyBzdGF0aWMgSW5wdXRNb2RlID0gSW5wdXRNb2RlO1xyXG4gICAgcHVibGljIHN0YXRpYyBFdmVudFR5cGUgPSBFdmVudFR5cGU7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIHdoZW4gRWRpdEJveCBiZWdhbiB0byBlZGl0IHRleHQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvIDlp4vnvJbovpHmlofmnKzovpPlhaXmoYbop6blj5HnmoTkuovku7blm57osIPjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW0NvbXBvbmVudEV2ZW50SGFuZGxlcl0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDExKVxyXG4gICAgQHRvb2x0aXAoJ+ivpeS6i+S7tuWcqOeUqOaIt+eCueWHu+i+k+WFpeahhuiOt+WPlueEpueCueeahOaXtuWAmeiiq+inpuWPkScpXHJcbiAgICBwdWJsaWMgZWRpdGluZ0RpZEJlZ2FuOiBDb21wb25lbnRFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiBFZGl0Qm94IHRleHQgY2hhbmdlcy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOe8lui+keaWh+acrOi+k+WFpeahhuaXtuinpuWPkeeahOS6i+S7tuWbnuiwg+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShbQ29tcG9uZW50RXZlbnRIYW5kbGVyXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTIpXHJcbiAgICBAdG9vbHRpcCgn57yW6L6R5paH5pys6L6T5YWl5qGG5pe26Kem5Y+R55qE5LqL5Lu25Zue6LCDJylcclxuICAgIHB1YmxpYyB0ZXh0Q2hhbmdlZDogQ29tcG9uZW50RXZlbnRIYW5kbGVyW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIHdoZW4gRWRpdEJveCBlZGl0IGVuZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnu5PmnZ/nvJbovpHmlofmnKzovpPlhaXmoYbml7bop6blj5HnmoTkuovku7blm57osIPjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW0NvbXBvbmVudEV2ZW50SGFuZGxlcl0pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEzKVxyXG4gICAgQHRvb2x0aXAoJ+WcqOWNleihjOaooeW8j+S4i+mdou+8jOS4gOiIrOaYr+WcqOeUqOaIt+aMieS4i+Wbnui9puaIluiAheeCueWHu+Wxj+W5lei+k+WFpeahhuS7peWklueahOWcsOaWueiwg+eUqOivpeWHveaVsOOAgiDlpoLmnpzmmK/lpJrooYzovpPlhaXvvIzkuIDoiKzmmK/lnKjnlKjmiLfngrnlh7vlsY/luZXovpPlhaXmoYbku6XlpJbnmoTlnLDmlrnosIPnlKjor6Xlh73mlbAnKVxyXG4gICAgcHVibGljIGVkaXRpbmdEaWRFbmRlZDogQ29tcG9uZW50RXZlbnRIYW5kbGVyW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIHdoZW4gcmV0dXJuIGtleSBpcyBwcmVzc2VkLiBXaW5kb3dzIGlzIG5vdCBzdXBwb3J0ZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPnlKjmiLfmjInkuIvlm57ovabmjInplK7ml7bnmoTkuovku7blm57osIPvvIznm67liY3kuI3mlK/mjIEgd2luZG93cyDlubPlj7BcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW0NvbXBvbmVudEV2ZW50SGFuZGxlcl0pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDE0KVxyXG4gICAgQHRvb2x0aXAoJ+ivpeS6i+S7tuWcqOeUqOaIt+aMieS4i+Wbnui9pumUrueahOaXtuWAmeiiq+inpuWPkSwg5aaC5p6c5piv5Y2V6KGM6L6T5YWl5qGG77yM5oyJ5Zue6L2m6ZSu6L+Y5Lya5L2/6L6T5YWl5qGG5aSx5Y6754Sm54K5JylcclxuICAgIHB1YmxpYyBlZGl0aW5nUmV0dXJuOiBDb21wb25lbnRFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBfaW1wbDogRWRpdEJveEltcGxCYXNlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgX2JhY2tncm91bmQ6IFNwcml0ZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGV4dExhYmVsOiBMYWJlbCB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wbGFjZWhvbGRlckxhYmVsOiBMYWJlbCB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkICBfcmV0dXJuVHlwZSA9IEtleWJvYXJkUmV0dXJuVHlwZS5ERUZBVUxUO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkICBfdXNlT3JpZ2luYWxTaXplID0gdHJ1ZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCAgX3N0cmluZyA9ICcnO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkICBfdGFiSW5kZXggPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkICBfYmFja2dyb3VuZEltYWdlOiBTcHJpdGVGcmFtZSB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkICBfaW5wdXRGbGFnID0gSW5wdXRGbGFnLkRFRkFVTFQ7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgIF9pbnB1dE1vZGUgPSBJbnB1dE1vZGUuQU5ZO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkICBfbWF4TGVuZ3RoID0gMjA7XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNMYWJlbFZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgX19wcmVsb2FkICgpIHtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlckV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwub25FbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKCFFRElUT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5fdW5yZWdpc3RlckV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwub25EaXNhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTGV0IHRoZSBFZGl0Qm94IGdldCBmb2N1c1xyXG4gICAgICogQHpoIOiuqeW9k+WJjSBFZGl0Qm94IOiOt+W+l+eEpueCueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Rm9jdXMgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0Rm9jdXModHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIExldCB0aGUgRWRpdEJveCBnZXQgZm9jdXNcclxuICAgICAqIEB6aCDorqnlvZPliY0gRWRpdEJveCDojrflvpfnhKbngrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZvY3VzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLnNldEZvY3VzKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBMZXQgdGhlIEVkaXRCb3ggbG9zZSBmb2N1c1xyXG4gICAgICogQHpoIOiuqeW9k+WJjSBFZGl0Qm94IOWkseWOu+eEpueCuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYmx1ciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC5zZXRGb2N1cyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERldGVybWluZSB3aGV0aGVyIEVkaXRCb3ggaXMgZ2V0dGluZyBmb2N1cyBvciBub3QuXHJcbiAgICAgKiBAemgg5Yik5patIEVkaXRCb3gg5piv5ZCm6I635b6X5LqG54Sm54K544CCXHJcbiAgICAgKiBOb3RlOiBvbmx5IGF2YWlsYWJsZSBvbiBXZWIgYXQgdGhlIG1vbWVudC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzRm9jdXNlZCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwuaXNGb2N1c2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2VkaXRCb3hFZGl0aW5nRGlkQmVnYW4gKCkge1xyXG4gICAgICAgIENvbXBvbmVudEV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuZWRpdGluZ0RpZEJlZ2FuLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdChFdmVudFR5cGUuRURJVElOR19ESURfQkVHQU4sIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfZWRpdEJveEVkaXRpbmdEaWRFbmRlZCAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5lZGl0aW5nRGlkRW5kZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KEV2ZW50VHlwZS5FRElUSU5HX0RJRF9FTkRFRCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9lZGl0Qm94VGV4dENoYW5nZWQgKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRleHQgPSB0aGlzLl91cGRhdGVMYWJlbFN0cmluZ1N0eWxlKHRleHQsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuc3RyaW5nID0gdGV4dDtcclxuICAgICAgICBDb21wb25lbnRFdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnRleHRDaGFuZ2VkLCB0ZXh0LCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdChFdmVudFR5cGUuVEVYVF9DSEFOR0VELCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2VkaXRCb3hFZGl0aW5nUmV0dXJuICgpIHtcclxuICAgICAgICBDb21wb25lbnRFdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmVkaXRpbmdSZXR1cm4sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KEV2ZW50VHlwZS5FRElUSU5HX1JFVFVSTiwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9zaG93TGFiZWxzICgpIHtcclxuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9oaWRlTGFiZWxzICgpIHtcclxuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0TGFiZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dExhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9wbGFjZWhvbGRlckxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoQmVnYW4gKGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICAgICAgZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hDYW5jZWwgKGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICAgICAgZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hFbmRlZCAoZXZlbnQ6IEV2ZW50VG91Y2gpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLmJlZ2luRWRpdGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5fY3JlYXRlQmFja2dyb3VuZFNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVUZXh0TGFiZWwoKTtcclxuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3Jlc2l6ZUNoaWxkTm9kZXMsIHRoaXMpO1xyXG5cclxuICAgICAgICBjb25zdCBpbXBsID0gdGhpcy5faW1wbCA9IG5ldyBFZGl0Qm94Ll9FZGl0Qm94SW1wbCgpO1xyXG4gICAgICAgIGltcGwuaW5pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdHJpbmcodGhpcy5fc3RyaW5nKTtcclxuICAgICAgICB0aGlzLl9zeW5jU2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY3JlYXRlQmFja2dyb3VuZFNwcml0ZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JhY2tncm91bmQgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZCA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoU3ByaXRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2JhY2tncm91bmQhLnR5cGUgPSBTcHJpdGUuVHlwZS5TTElDRUQ7XHJcbiAgICAgICAgdGhpcy5fYmFja2dyb3VuZCEuc3ByaXRlRnJhbWUgPSB0aGlzLl9iYWNrZ3JvdW5kSW1hZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVUZXh0TGFiZWwgKCkge1xyXG4gICAgICAgIGxldCB0ZXh0TGFiZWwgPSB0aGlzLl90ZXh0TGFiZWw7XHJcblxyXG4gICAgICAgIC8vIElmIHRleHRMYWJlbCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgb25lLlxyXG4gICAgICAgIGlmICghdGV4dExhYmVsKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdURVhUX0xBQkVMJyk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5ldyBOb2RlKCdURVhUX0xBQkVMJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dExhYmVsID0gbm9kZSEuZ2V0Q29tcG9uZW50KExhYmVsKTtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0TGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRleHRMYWJlbCA9IG5vZGUhLmFkZENvbXBvbmVudChMYWJlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZSEucGFyZW50ID0gdGhpcy5ub2RlO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0TGFiZWwgPSB0ZXh0TGFiZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1cGRhdGVcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1Db21wID0gdGhpcy5fdGV4dExhYmVsIS5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICB0cmFuc2Zvcm1Db21wIS5zZXRBbmNob3JQb2ludCgwLCAxKTtcclxuICAgICAgICB0ZXh0TGFiZWwhLm92ZXJmbG93ID0gTGFiZWwuT3ZlcmZsb3cuQ0xBTVA7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0TW9kZSA9PT0gSW5wdXRNb2RlLkFOWSkge1xyXG4gICAgICAgICAgICB0ZXh0TGFiZWwhLnZlcnRpY2FsQWxpZ24gPSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QO1xyXG4gICAgICAgICAgICB0ZXh0TGFiZWwhLmVuYWJsZVdyYXBUZXh0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRleHRMYWJlbCEudmVydGljYWxBbGlnbiA9IFZlcnRpY2FsVGV4dEFsaWdubWVudC5DRU5URVI7XHJcbiAgICAgICAgICAgIHRleHRMYWJlbCEuZW5hYmxlV3JhcFRleHQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dExhYmVsIS5zdHJpbmcgPSB0aGlzLl91cGRhdGVMYWJlbFN0cmluZ1N0eWxlKHRoaXMuX3N0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVQbGFjZWhvbGRlckxhYmVsICgpIHtcclxuICAgICAgICBsZXQgcGxhY2Vob2xkZXJMYWJlbCA9IHRoaXMuX3BsYWNlaG9sZGVyTGFiZWw7XHJcblxyXG4gICAgICAgIC8vIElmIHBsYWNlaG9sZGVyTGFiZWwgZG9lc24ndCBleGlzdCwgY3JlYXRlIG9uZS5cclxuICAgICAgICBpZiAoIXBsYWNlaG9sZGVyTGFiZWwpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1BMQUNFSE9MREVSX0xBQkVMJyk7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5ldyBOb2RlKCdQTEFDRUhPTERFUl9MQUJFTCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwgPSBub2RlIS5nZXRDb21wb25lbnQoTGFiZWwpO1xyXG4gICAgICAgICAgICBpZiAoIXBsYWNlaG9sZGVyTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwgPSBub2RlIS5hZGRDb21wb25lbnQoTGFiZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5vZGUhLnBhcmVudCA9IHRoaXMubm9kZTtcclxuICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbCA9IHBsYWNlaG9sZGVyTGFiZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1cGRhdGVcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLl9wbGFjZWhvbGRlckxhYmVsIS5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICB0cmFuc2Zvcm0hLnNldEFuY2hvclBvaW50KDAsIDEpO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwhLm92ZXJmbG93ID0gTGFiZWwuT3ZlcmZsb3cuQ0xBTVA7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0TW9kZSA9PT0gSW5wdXRNb2RlLkFOWSkge1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsIS52ZXJ0aWNhbEFsaWduID0gVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUDtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbCEuZW5hYmxlV3JhcFRleHQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbCEudmVydGljYWxBbGlnbiA9IFZlcnRpY2FsVGV4dEFsaWdubWVudC5DRU5URVI7XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwhLmVuYWJsZVdyYXBUZXh0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwhLnN0cmluZyA9IHRoaXMucGxhY2Vob2xkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zeW5jU2l6ZSAoKSB7XHJcbiAgICAgICAgbGV0IHRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRyYW5zLmNvbnRlbnRTaXplO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fYmFja2dyb3VuZCkge1xyXG4gICAgICAgICAgICBsZXQgYmdUcmFucyA9IHRoaXMuX2JhY2tncm91bmQubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgICAgICBiZ1RyYW5zLmFuY2hvclBvaW50ID0gdHJhbnMuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgICAgIGJnVHJhbnMuc2V0Q29udGVudFNpemUoc2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVMYWJlbFBvc2l0aW9uKHNpemUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0U2l6ZShzaXplLndpZHRoLCBzaXplLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlTGFiZWxzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNMYWJlbFZpc2libGUpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuX3N0cmluZztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RleHRMYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dExhYmVsLm5vZGUuYWN0aXZlID0gKGNvbnRlbnQgIT09ICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGxhY2Vob2xkZXJMYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbC5ub2RlLmFjdGl2ZSA9IChjb250ZW50ID09PSAnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVTdHJpbmcgKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHRleHRMYWJlbCA9IHRoaXMuX3RleHRMYWJlbDtcclxuICAgICAgICAvLyBOb3QgaW5pdGVkIHlldFxyXG4gICAgICAgIGlmICghdGV4dExhYmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaXNwbGF5VGV4dCA9IHRleHQ7XHJcbiAgICAgICAgaWYgKGRpc3BsYXlUZXh0KSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlUZXh0ID0gdGhpcy5fdXBkYXRlTGFiZWxTdHJpbmdTdHlsZShkaXNwbGF5VGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0ZXh0TGFiZWwuc3RyaW5nID0gZGlzcGxheVRleHQ7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlTGFiZWxTdHJpbmdTdHlsZSAodGV4dDogc3RyaW5nLCBpZ25vcmVQYXNzd29yZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXRGbGFnID0gdGhpcy5faW5wdXRGbGFnO1xyXG4gICAgICAgIGlmICghaWdub3JlUGFzc3dvcmQgJiYgaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuUEFTU1dPUkQpIHtcclxuICAgICAgICAgICAgbGV0IHBhc3N3b3JkU3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZFN0cmluZyArPSAnXFx1MjVDRic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dCA9IHBhc3N3b3JkU3RyaW5nO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gY2FwaXRhbGl6ZSh0ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19TRU5URU5DRSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRleHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZWdpc3RlckV2ZW50ICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihTeXN0ZW1FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdW5yZWdpc3RlckV2ZW50ICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVMYWJlbFBvc2l0aW9uIChzaXplOiBTaXplKSB7XHJcbiAgICAgICAgbGV0IHRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3Qgb2ZmWCA9IC10cmFucy5hbmNob3JYICogdHJhbnMud2lkdGg7XHJcbiAgICAgICAgY29uc3Qgb2ZmWSA9IC10cmFucy5hbmNob3JZICogdHJhbnMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlckxhYmVsID0gdGhpcy5fcGxhY2Vob2xkZXJMYWJlbDtcclxuICAgICAgICBjb25zdCB0ZXh0TGFiZWwgPSB0aGlzLl90ZXh0TGFiZWw7XHJcbiAgICAgICAgaWYgKHRleHRMYWJlbCkge1xyXG4gICAgICAgICAgICB0ZXh0TGFiZWwubm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLnNldENvbnRlbnRTaXplKHNpemUud2lkdGggLSBMRUZUX1BBRERJTkcsIHNpemUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgdGV4dExhYmVsLm5vZGUucG9zaXRpb24gPSBuZXcgVmVjMyAob2ZmWCArIExFRlRfUEFERElORywgb2ZmWSArIHNpemUuaGVpZ2h0LCB0ZXh0TGFiZWwubm9kZS5wb3NpdGlvbi56KTtcclxuICAgICAgICAgICAgdGV4dExhYmVsLnZlcnRpY2FsQWxpZ24gPSB0aGlzLl9pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkgPyBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QIDogVmVydGljYWxUZXh0QWxpZ25tZW50LkNFTlRFUjtcclxuICAgICAgICAgICAgdGV4dExhYmVsLmVuYWJsZVdyYXBUZXh0ID0gdGhpcy5faW5wdXRNb2RlID09PSBJbnB1dE1vZGUuQU5ZID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyTGFiZWwpIHtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuc2V0Q29udGVudFNpemUoc2l6ZS53aWR0aCAtIExFRlRfUEFERElORywgc2l6ZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLmxpbmVIZWlnaHQgPSBzaXplLmhlaWdodDtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5ub2RlLnBvc2l0aW9uID0gbmV3IFZlYzMgKG9mZlggKyBMRUZUX1BBRERJTkcsIG9mZlkgKyBzaXplLmhlaWdodCwgcGxhY2Vob2xkZXJMYWJlbC5ub2RlLnBvc2l0aW9uLnopO1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLnZlcnRpY2FsQWxpZ24gPSB0aGlzLl9pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkgP1xyXG4gICAgICAgICAgICAgICAgVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUCA6IFZlcnRpY2FsVGV4dEFsaWdubWVudC5DRU5URVI7XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwuZW5hYmxlV3JhcFRleHQgPSB0aGlzLl9pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcmVzaXplQ2hpbGROb2RlcyAoKSB7XHJcbiAgICAgICAgbGV0IHRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3QgdGV4dExhYmVsTm9kZSA9IHRoaXMuX3RleHRMYWJlbCAmJiB0aGlzLl90ZXh0TGFiZWwubm9kZTtcclxuICAgICAgICBpZiAodGV4dExhYmVsTm9kZSkge1xyXG4gICAgICAgICAgICB0ZXh0TGFiZWxOb2RlLnBvc2l0aW9uID0gbmV3IFZlYzMoLXRyYW5zLndpZHRoIC8gMiwgdHJhbnMuaGVpZ2h0IC8gMiwgdGV4dExhYmVsTm9kZS5wb3NpdGlvbi56KTtcclxuICAgICAgICAgICAgdGV4dExhYmVsTm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLnNldENvbnRlbnRTaXplKHRyYW5zLmNvbnRlbnRTaXplKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXJMYWJlbE5vZGUgPSB0aGlzLl9wbGFjZWhvbGRlckxhYmVsICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWwubm9kZTtcclxuICAgICAgICBpZiAocGxhY2Vob2xkZXJMYWJlbE5vZGUpIHtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbE5vZGUucG9zaXRpb24gPSBuZXcgVmVjMygtdHJhbnMud2lkdGggLyAyLCB0cmFucy5oZWlnaHQgLyAyLCBwbGFjZWhvbGRlckxhYmVsTm9kZS5wb3NpdGlvbi56KTtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbE5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZSh0cmFucy5jb250ZW50U2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGJhY2tncm91bmROb2RlID0gdGhpcy5fYmFja2dyb3VuZCAmJiB0aGlzLl9iYWNrZ3JvdW5kLm5vZGU7XHJcbiAgICAgICAgaWYgKGJhY2tncm91bmROb2RlKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmROb2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuc2V0Q29udGVudFNpemUodHJhbnMuY29udGVudFNpemUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuaWYgKHN5cy5pc0Jyb3dzZXIpe1xyXG4gICAgRWRpdEJveC5fRWRpdEJveEltcGwgPSBFZGl0Qm94SW1wbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IGVkaXRpbmctZGlkLWJlZ2FuXHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7RWRpdEJveH0gZWRpdGJveCAtIFRoZSBFZGl0Qm94IGNvbXBvbmVudC5cclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cclxuICogQHpoXHJcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxyXG4gKiBAZXZlbnQgZWRpdGluZy1kaWQtZW5kZWRcclxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcclxuICogQHBhcmFtIHtFZGl0Qm94fSBlZGl0Ym94IC0gVGhlIEVkaXRCb3ggY29tcG9uZW50LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxyXG4gKiBAemhcclxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXHJcbiAqIEBldmVudCB0ZXh0LWNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcclxuICogQHBhcmFtIHtFZGl0Qm94fSBlZGl0Ym94IC0gVGhlIEVkaXRCb3ggY29tcG9uZW50LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxyXG4gKiBAemhcclxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXHJcbiAqIEBldmVudCBlZGl0aW5nLXJldHVyblxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge0VkaXRCb3h9IGVkaXRib3ggLSBUaGUgRWRpdEJveCBjb21wb25lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlbiBpZiB5b3UgZG9uJ3QgbmVlZCB0aGUgRWRpdEJveCBhbmQgaXQgaXNuJ3QgaW4gYW55IHJ1bm5pbmcgU2NlbmUsIHlvdSBzaG91bGRcclxuICogY2FsbCB0aGUgZGVzdHJveSBtZXRob2Qgb24gdGhpcyBjb21wb25lbnQgb3IgdGhlIGFzc29jaWF0ZWQgbm9kZSBleHBsaWNpdGx5LlxyXG4gKiBPdGhlcndpc2UsIHRoZSBjcmVhdGVkIERPTSBlbGVtZW50IHdvbid0IGJlIHJlbW92ZWQgZnJvbSB3ZWIgcGFnZS5cclxuICogQHpoXHJcbiAqIOWmguaenOS9oOS4jeWGjeS9v+eUqCBFZGl0Qm9477yM5bm25LiU57uE5Lu25pyq5re75Yqg5Yiw5Zy65pmv5Lit77yM6YKj5LmI5L2g5b+F6aG75omL5Yqo5a+557uE5Lu25oiW5omA5Zyo6IqC54K56LCD55SoIGRlc3Ryb3njgIJcclxuICog6L+Z5qC35omN6IO956e76Zmk572R6aG15LiK55qEIERPTSDoioLngrnvvIzpgb/lhY0gV2ViIOW5s+WPsOWGheWtmOazhOmcsuOAglxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGBcclxuICogZWRpdGJveC5ub2RlLnBhcmVudCA9IG51bGw7ICAvLyBvciAgZWRpdGJveC5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xyXG4gKiAvLyB3aGVuIHlvdSBkb24ndCBuZWVkIGVkaXRib3ggYW55bW9yZVxyXG4gKiBlZGl0Ym94Lm5vZGUuZGVzdHJveSgpO1xyXG4gKiBgYGBcclxuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBpdCBpcyB0aGUgZmlyc3QgdGltZSB0aGUgZGVzdHJveSBiZWluZyBjYWxsZWRcclxuICovXHJcbiJdfQ==