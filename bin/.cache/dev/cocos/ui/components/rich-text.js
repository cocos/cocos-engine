(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/index.js", "../../core/data/decorators/index.js", "../../core/platform/index.js", "../../core/utils/index.js", "../../core/utils/pool.js", "../../core/math/index.js", "../../core/scene-graph/index.js", "./label.js", "./label-outline.js", "./sprite.js", "../../core/components/ui-base/index.js", "../../core/load-pipeline/index.js", "../../core/default-constants.js", "../../core/global-exports.js", "../../core/components/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/index.js"), require("../../core/data/decorators/index.js"), require("../../core/platform/index.js"), require("../../core/utils/index.js"), require("../../core/utils/pool.js"), require("../../core/math/index.js"), require("../../core/scene-graph/index.js"), require("./label.js"), require("./label-outline.js"), require("./sprite.js"), require("../../core/components/ui-base/index.js"), require("../../core/load-pipeline/index.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"), require("../../core/components/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.pool, global.index, global.index, global.label, global.labelOutline, global.sprite, global.index, global.index, global.defaultConstants, global.globalExports, global.index);
    global.richText = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _pool, _index5, _index6, _label, _labelOutline, _sprite, _index7, _index8, _defaultConstants, _globalExports, _index9) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RichText = void 0;
  _pool = _interopRequireDefault(_pool);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _class3, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _htmlTextParser = new _index4.HtmlTextParser();

  var RichTextChildName = 'RICHTEXT_CHILD';
  var RichTextChildImageName = 'RICHTEXT_Image_CHILD';
  /**
   * 富文本池。<br/>
   */

  var pool = new _pool.default(function (labelSeg) {
    if (_defaultConstants.EDITOR) {
      return false;
    }

    if (_defaultConstants.DEV) {
      (0, _index3.assert)(!labelSeg.node.parent, 'Recycling node\'s parent should be null!');
    }

    if (!_globalExports.legacyCC.isValid(labelSeg.node)) {
      return false;
    } else {
      var outline = labelSeg.node.getComponent(_labelOutline.LabelOutline);

      if (outline) {
        outline.width = 0;
      }
    }

    return true;
  }, 20); // @ts-ignore

  pool.get = function (str, richtext) {
    var labelSeg = this._get();

    if (!labelSeg) {
      labelSeg = {
        node: new _index6.PrivateNode(RichTextChildName),
        comp: null,
        lineCount: 0,
        styleIndex: 0,
        imageOffset: '',
        clickParam: '',
        clickHandler: ''
      };
    }

    var labelNode = labelSeg.node;

    if (!labelNode) {
      labelNode = new _index6.PrivateNode(RichTextChildName);
    }

    var label = labelNode.getComponent(_label.Label);

    if (!label) {
      label = labelNode.addComponent(_label.Label);
    }

    label.string = str;
    label.horizontalAlign = _label.HorizontalTextAlignment.LEFT;
    label.verticalAlign = _label.VerticalTextAlignment.TOP; // label._forceUseCanvas = true;

    labelNode.setPosition(0, 0, 0);
    var trans = labelNode._uiProps.uiTransformComp;
    trans.setAnchorPoint(0.5, 0.5);
    var labelObj = {
      node: labelNode,
      comp: label,
      lineCount: 0,
      styleIndex: 0,
      imageOffset: '',
      clickParam: '',
      clickHandler: ''
    };
    return labelObj;
  };

  /**
   * @en
   * The RichText Component.
   *
   * @zh
   * 富文本组件。
   */
  var RichText = (_dec = (0, _index2.ccclass)('cc.RichText'), _dec2 = (0, _index2.help)('i18n:cc.RichText'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/Render/RichText'), _dec5 = (0, _index2.tooltip)('富文本显示的文本内容'), _dec6 = (0, _index2.type)(_label.HorizontalTextAlignment), _dec7 = (0, _index2.tooltip)('文本内容的水平对齐方式'), _dec8 = (0, _index2.tooltip)('富文本字体大小'), _dec9 = (0, _index2.tooltip)('富文本定制系统字体'), _dec10 = (0, _index2.type)(_index.Font), _dec11 = (0, _index2.tooltip)('富文本定制字体'), _dec12 = (0, _index2.tooltip)('是否使用系统字体'), _dec13 = (0, _index2.type)(_label.CacheMode), _dec14 = (0, _index2.tooltip)('文本缓存模式, 该模式只支持系统字体。'), _dec15 = (0, _index2.tooltip)('富文本的最大宽度'), _dec16 = (0, _index2.tooltip)('富文本行高'), _dec17 = (0, _index2.type)(_index.SpriteAtlas), _dec18 = (0, _index2.tooltip)('对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效'), _dec19 = (0, _index2.tooltip)('选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index2.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_UIComponent) {
    _inherits(RichText, _UIComponent);

    _createClass(RichText, [{
      key: "string",

      /**
       * @en
       * Content string of RichText.
       *
       * @zh
       * 富文本显示的文本内容。
       */
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        if (this._string === value) {
          return;
        }

        this._string = value;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Horizontal Alignment of each line in RichText.
       *
       * @zh
       * 文本内容的水平对齐方式。
       */

    }, {
      key: "horizontalAlign",
      get: function get() {
        return this._horizontalAlign;
      },
      set: function set(value) {
        if (this.horizontalAlign === value) {
          return;
        }

        this._horizontalAlign = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Font size of RichText.
       *
       * @zh
       * 富文本字体大小。
       */

    }, {
      key: "fontSize",
      get: function get() {
        return this._fontSize;
      },
      set: function set(value) {
        if (this._fontSize === value) {
          return;
        }

        this._fontSize = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Custom System font of RichText
       *
       * @zh
       * 富文本定制系统字体
       */

    }, {
      key: "fontFamily",
      get: function get() {
        return this._fontFamily;
      },
      set: function set(value) {
        if (this._fontFamily === value) return;
        this._fontFamily = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Custom System font of RichText.
       *
       * @zh
       * 富文本定制字体。
       */

    }, {
      key: "font",
      get: function get() {
        return this._font;
      },
      set: function set(value) {
        if (this._font === value) {
          return;
        }

        this._font = value;
        this._layoutDirty = true;

        if (this._font) {
          if (_defaultConstants.EDITOR) {
            this._userDefinedFont = this._font;
          }

          this.useSystemFont = false;

          this._onTTFLoaded();
        } else {
          this.useSystemFont = true;
        }

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Whether use system font name or not.
       *
       * @zh
       * 是否使用系统字体。
       */

    }, {
      key: "useSystemFont",
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) {
          return;
        }

        this._isSystemFontUsed = value;

        if (_defaultConstants.EDITOR) {
          if (value) {
            this._font = null;
          } else if (this._userDefinedFont) {
            this._font = this._userDefinedFont;
            return;
          }
        }

        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * The cache mode of label. This mode only supports system fonts.
       *
       * @zh
       * 文本缓存模式, 该模式只支持系统字体。
       */

    }, {
      key: "cacheMode",
      get: function get() {
        return this._cacheMode;
      },
      set: function set(value) {
        if (this._cacheMode === value) {
          return;
        }

        this._cacheMode = value;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * The maximize width of the RichText.
       *
       * @zh
       * 富文本的最大宽度。
       */

    }, {
      key: "maxWidth",
      get: function get() {
        return this._maxWidth;
      },
      set: function set(value) {
        if (this._maxWidth === value) {
          return;
        }

        this._maxWidth = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Line Height of RichText.
       *
       * @zh
       * 富文本行高。
       */

    }, {
      key: "lineHeight",
      get: function get() {
        return this._lineHeight;
      },
      set: function set(value) {
        if (this._lineHeight === value) {
          return;
        }

        this._lineHeight = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
       *
       * @zh
       * 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
       */

    }, {
      key: "imageAtlas",
      get: function get() {
        return this._imageAtlas;
      },
      set: function set(value) {
        if (this._imageAtlas === value) {
          return;
        }

        this._imageAtlas = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
      /**
       * @en
       * Once checked, the RichText will block all input events (mouse and touch) within
       * the bounding box of the node, preventing the input from penetrating into the underlying node.
       *
       * @zh
       * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
       */

    }, {
      key: "handleTouchEvent",
      get: function get() {
        return this._handleTouchEvent;
      },
      set: function set(value) {
        if (this._handleTouchEvent === value) {
          return;
        }

        this._handleTouchEvent = value;

        if (this.enabledInHierarchy) {
          this.handleTouchEvent ? this._addEventListeners() : this._removeEventListeners();
        }
      }
    }]);

    function RichText() {
      var _this;

      _classCallCheck(this, RichText);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RichText).call(this));

      _initializerDefineProperty(_this, "_lineHeight", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_string", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_horizontalAlign", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fontSize", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_maxWidth", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fontFamily", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_font", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isSystemFontUsed", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_userDefinedFont", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_cacheMode", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_imageAtlas", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_handleTouchEvent", _descriptor12, _assertThisInitialized(_this));

      _this._textArray = [];
      _this._labelSegments = [];
      _this._labelSegmentsCache = [];
      _this._linesWidth = [];
      _this._lineCount = 1;
      _this._labelWidth = 0;
      _this._labelHeight = 0;
      _this._layoutDirty = true;
      _this._lineOffsetX = 0;
      _this._updateRichTextStatus = void 0;

      if (_defaultConstants.EDITOR) {
        _this._userDefinedFont = null;
      }

      _this._updateRichTextStatus = _this._updateRichText;
      return _this;
    }

    _createClass(RichText, [{
      key: "onEnable",
      value: function onEnable() {
        if (this.handleTouchEvent) {
          this._addEventListeners();
        }

        this._updateRichText();

        this._activateChildren(true);
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this.handleTouchEvent) {
          this._removeEventListeners();
        }

        this._activateChildren(false);
      }
    }, {
      key: "start",
      value: function start() {
        this._onTTFLoaded();

        this.node.on(_index6.Node.EventType.ANCHOR_CHANGED, this._updateRichTextPosition, this);
      }
    }, {
      key: "onRestore",
      value: function onRestore() {
        if (!_defaultConstants.EDITOR) {
          return;
        } // TODO: refine undo/redo system
        // Because undo/redo will not call onEnable/onDisable,
        // we need call onEnable/onDisable manually to active/disactive children nodes.


        if (this.enabledInHierarchy) {
          this.onEnable();
        } else {
          this.onDisable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        var _iterator = _createForOfIteratorHelper(this._labelSegments),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var seg = _step.value;
            seg.node.removeFromParent();
            pool.put(seg);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.node.off(_index6.Node.EventType.ANCHOR_CHANGED, this._updateRichTextPosition, this);
      }
    }, {
      key: "_addEventListeners",
      value: function _addEventListeners() {
        this.node.on(_index6.Node.EventType.TOUCH_END, this._onTouchEnded, this);
      }
    }, {
      key: "_removeEventListeners",
      value: function _removeEventListeners() {
        this.node.off(_index6.Node.EventType.TOUCH_END, this._onTouchEnded, this);
      }
    }, {
      key: "_updateLabelSegmentTextAttributes",
      value: function _updateLabelSegmentTextAttributes() {
        var _this2 = this;

        this._labelSegments.forEach(function (item) {
          _this2._applyTextAttribute(item);
        });
      }
    }, {
      key: "_createFontLabel",
      value: function _createFontLabel(str) {
        // @ts-ignore
        return pool.get(str, this);
      }
    }, {
      key: "_onTTFLoaded",
      value: function _onTTFLoaded() {
        if (this._font instanceof _index.TTFFont) {
          if (this._font._nativeAsset) {
            this._layoutDirty = true;

            this._updateRichText();
          } else {
            var self = this;

            _index8.loader.load(this._font.nativeUrl, function (err, fontFamily) {
              self._layoutDirty = true;

              self._updateRichText();
            });
          }
        } else {
          this._layoutDirty = true;

          this._updateRichText();
        }
      }
    }, {
      key: "_measureText",
      value: function _measureText(styleIndex, string) {
        var self = this;

        var func = function func(s) {
          var label;

          if (self._labelSegmentsCache.length === 0) {
            label = self._createFontLabel(s);

            self._labelSegmentsCache.push(label);
          } else {
            label = self._labelSegmentsCache[0];
            label.node.getComponent(_label.Label).string = s;
          }

          label.styleIndex = styleIndex;

          self._applyTextAttribute(label);

          var labelSize = label.node._uiProps.uiTransformComp.contentSize;
          return labelSize.width;
        };

        if (string) {
          return func(string);
        } else {
          return func;
        }
      }
    }, {
      key: "_onTouchEnded",
      value: function _onTouchEnded(event) {
        var _this3 = this;

        var components = this.node.getComponents(_index9.Component);
        var self = this;

        var _iterator2 = _createForOfIteratorHelper(this._labelSegments),
            _step2;

        try {
          var _loop = function _loop() {
            var seg = _step2.value;
            var clickHandler = seg.clickHandler;
            var clickParam = seg.clickParam;

            if (clickHandler && _this3._containsTouchLocation(seg, event.touch.getUILocation())) {
              components.forEach(function (component) {
                var func = component[clickHandler];

                if (component.enabledInHierarchy && func) {
                  func.call(component, event, clickParam);
                }
              });
              event.propagationStopped = true;
            }
          };

          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }, {
      key: "_containsTouchLocation",
      value: function _containsTouchLocation(label, point) {
        var comp = label.node.getComponent(_index7.UITransform);

        if (!comp) {
          return false;
        }

        var myRect = comp.getBoundingBoxToWorld();
        return myRect.contains(point);
      }
    }, {
      key: "_resetState",
      value: function _resetState() {
        var _this4 = this;

        var children = this.node.children;

        var _loop2 = function _loop2(i) {
          var child = children[i];

          if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
            if (child.parent === _this4.node) {
              child.parent = null;
            } else {
              // In case child.parent !== this.node, child cannot be removed from children
              children.splice(i, 1);
            }

            if (child.name === RichTextChildName) {
              var index = _this4._labelSegments.findIndex(function (seg) {
                return seg.node === child;
              });

              if (index !== -1) {
                pool.put(_this4._labelSegments[index]);
              }
            }
          }
        };

        for (var i = children.length - 1; i >= 0; i--) {
          _loop2(i);
        }

        this._labelSegments.length = 0;
        this._labelSegmentsCache.length = 0;
        this._linesWidth.length = 0;
        this._lineOffsetX = 0;
        this._lineCount = 1;
        this._labelWidth = 0;
        this._labelHeight = 0;
        this._layoutDirty = true;
      }
    }, {
      key: "_activateChildren",
      value: function _activateChildren(active) {
        for (var i = this.node.children.length - 1; i >= 0; i--) {
          var child = this.node.children[i];

          if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
            child.active = active;
          }
        }
      }
    }, {
      key: "_addLabelSegment",
      value: function _addLabelSegment(stringToken, styleIndex) {
        var labelSegment;

        if (this._labelSegmentsCache.length === 0) {
          labelSegment = this._createFontLabel(stringToken);
        } else {
          labelSegment = this._labelSegmentsCache.pop();
          var label = labelSegment.node.getComponent(_label.Label);

          if (label) {
            label.string = stringToken;
          }
        }

        labelSegment.styleIndex = styleIndex;
        labelSegment.lineCount = this._lineCount;

        labelSegment.node._uiProps.uiTransformComp.setAnchorPoint(0, 0);

        this._applyTextAttribute(labelSegment); // @ts-ignore


        this.node.addChild(labelSegment.node);

        this._labelSegments.push(labelSegment);

        return labelSegment;
      }
    }, {
      key: "_updateRichTextWithMaxWidth",
      value: function _updateRichTextWithMaxWidth(labelString, labelWidth, styleIndex) {
        var fragmentWidth = labelWidth;
        var labelSegment;

        if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this._maxWidth) {
          // concat previous line
          var checkStartIndex = 0;

          while (this._lineOffsetX <= this._maxWidth) {
            var checkEndIndex = this._getFirstWordLen(labelString, checkStartIndex, labelString.length);

            var checkString = labelString.substr(checkStartIndex, checkEndIndex);

            var checkStringWidth = this._measureText(styleIndex, checkString);

            if (this._lineOffsetX + checkStringWidth <= this._maxWidth) {
              this._lineOffsetX += checkStringWidth;
              checkStartIndex += checkEndIndex;
            } else {
              if (checkStartIndex > 0) {
                var remainingString = labelString.substr(0, checkStartIndex);

                this._addLabelSegment(remainingString, styleIndex);

                labelString = labelString.substr(checkStartIndex, labelString.length);
                fragmentWidth = this._measureText(styleIndex, labelString);
              }

              this._updateLineInfo();

              break;
            }
          }
        }

        if (fragmentWidth > this._maxWidth) {
          var fragments = (0, _index4.fragmentText)(labelString, fragmentWidth, this._maxWidth, this._measureText(styleIndex));

          for (var k = 0; k < fragments.length; ++k) {
            var splitString = fragments[k];
            labelSegment = this._addLabelSegment(splitString, styleIndex);
            var labelSize = labelSegment.node._uiProps.uiTransformComp.contentSize;
            this._lineOffsetX += labelSize.width;

            if (fragments.length > 1 && k < fragments.length - 1) {
              this._updateLineInfo();
            }
          }
        } else {
          this._lineOffsetX += fragmentWidth;

          this._addLabelSegment(labelString, styleIndex);
        }
      }
    }, {
      key: "_isLastComponentCR",
      value: function _isLastComponentCR(stringToken) {
        return stringToken.length - 1 === stringToken.lastIndexOf('\n');
      }
    }, {
      key: "_updateLineInfo",
      value: function _updateLineInfo() {
        this._linesWidth.push(this._lineOffsetX);

        this._lineOffsetX = 0;
        this._lineCount++;
      }
    }, {
      key: "_needsUpdateTextLayout",
      value: function _needsUpdateTextLayout(newTextArray) {
        if (this._layoutDirty || !this._textArray || !newTextArray) {
          return true;
        }

        if (this._textArray.length !== newTextArray.length) {
          return true;
        }

        for (var i = 0; i < this._textArray.length; i++) {
          var oldItem = this._textArray[i];
          var newItem = newTextArray[i];

          if (oldItem.text !== newItem.text) {
            return true;
          } else {
            var oldStyle = oldItem.style,
                newStyle = newItem.style;

            if (oldStyle) {
              if (newStyle) {
                if (!!newStyle.outline !== !!oldStyle.outline) {
                  return true;
                }

                if (oldStyle.size !== newStyle.size || oldStyle.italic !== newStyle.italic || oldStyle.isImage !== newStyle.isImage) {
                  return true;
                }

                if (oldStyle.src !== newStyle.src || oldStyle.imageAlign !== newStyle.imageAlign || oldStyle.imageHeight !== newStyle.imageHeight || oldStyle.imageWidth !== newStyle.imageWidth || oldStyle.imageOffset !== newStyle.imageOffset) {
                  return true;
                }
              } else {
                if (oldStyle.size || oldStyle.italic || oldStyle.isImage || oldStyle.outline) {
                  return true;
                }
              }
            } else {
              if (newStyle) {
                if (newStyle.size || newStyle.italic || newStyle.isImage || newStyle.outline) {
                  return true;
                }
              }
            }
          }
        }

        return false;
      }
    }, {
      key: "_addRichTextImageElement",
      value: function _addRichTextImageElement(richTextElement) {
        if (!richTextElement.style) {
          return;
        }

        var style = richTextElement.style;
        var spriteFrameName = style.src;

        var spriteFrame = this._imageAtlas && spriteFrameName && this._imageAtlas.getSpriteFrame(spriteFrameName);

        if (!spriteFrame) {
          (0, _index3.warnID)(4400);
        } else {
          var spriteNode = new _index6.PrivateNode(RichTextChildImageName);
          var sprite = spriteNode.addComponent(_sprite.Sprite);

          switch (style.imageAlign) {
            case 'top':
              spriteNode._uiProps.uiTransformComp.setAnchorPoint(0, 1);

              break;

            case 'center':
              spriteNode._uiProps.uiTransformComp.setAnchorPoint(0, 0.5);

              break;

            default:
              spriteNode._uiProps.uiTransformComp.setAnchorPoint(0, 0);

              break;
          }

          sprite.type = _sprite.Sprite.Type.SLICED;
          sprite.sizeMode = _sprite.Sprite.SizeMode.CUSTOM; // Why need to set spriteFrame before can add child ??

          sprite.spriteFrame = spriteFrame; // @ts-ignore

          this.node.addChild(spriteNode);
          var obj = {
            node: spriteNode,
            comp: sprite,
            lineCount: 0,
            styleIndex: 0,
            imageOffset: style.imageOffset || '',
            clickParam: '',
            clickHandler: ''
          };

          this._labelSegments.push(obj);

          var spriteRect = spriteFrame.rect.clone();
          var scaleFactor = 1;
          var spriteWidth = spriteRect.width;
          var spriteHeight = spriteRect.height;
          var expectWidth = style.imageWidth || 0;
          var expectHeight = style.imageHeight || 0;

          if (expectHeight > 0) {
            scaleFactor = expectHeight / spriteHeight;
            spriteWidth = spriteWidth * scaleFactor;
            spriteHeight = spriteHeight * scaleFactor;
          } else {
            scaleFactor = this._lineHeight / spriteHeight;
            spriteWidth = spriteWidth * scaleFactor;
            spriteHeight = spriteHeight * scaleFactor;
          }

          if (expectWidth > 0) {
            spriteWidth = expectWidth;
          }

          if (this._maxWidth > 0) {
            if (this._lineOffsetX + spriteWidth > this._maxWidth) {
              this._updateLineInfo();
            }

            this._lineOffsetX += spriteWidth;
          } else {
            this._lineOffsetX += spriteWidth;

            if (this._lineOffsetX > this._labelWidth) {
              this._labelWidth = this._lineOffsetX;
            }
          }

          spriteNode._uiProps.uiTransformComp.setContentSize(spriteWidth, spriteHeight);

          obj.lineCount = this._lineCount;
          obj.clickHandler = '';
          obj.clickParam = '';
          var event = style.event;

          if (event) {
            obj.clickHandler = event['click'];
            obj.clickParam = event['param'];
          }
        }
      }
    }, {
      key: "_updateRichText",
      value: function _updateRichText() {
        if (!this.enabledInHierarchy) {
          return;
        }

        var newTextArray = _htmlTextParser.parse(this._string);

        if (!this._needsUpdateTextLayout(newTextArray)) {
          this._textArray = newTextArray.slice();

          this._updateLabelSegmentTextAttributes();

          return;
        }

        this._textArray = newTextArray.slice();

        this._resetState();

        var lastEmptyLine = false;
        var label;

        for (var i = 0; i < this._textArray.length; ++i) {
          var richTextElement = this._textArray[i];
          var text = richTextElement.text;

          if (text === undefined) {
            continue;
          } // handle <br/> <img /> tag


          if (text === '') {
            if (richTextElement.style && richTextElement.style.isNewLine) {
              this._updateLineInfo();

              continue;
            }

            if (richTextElement.style && richTextElement.style.isImage && this._imageAtlas) {
              this._addRichTextImageElement(richTextElement);

              continue;
            }
          }

          var multilineTexts = text.split('\n');

          for (var j = 0; j < multilineTexts.length; ++j) {
            var labelString = multilineTexts[j];

            if (labelString === '') {
              // for continues \n
              if (this._isLastComponentCR(text) && j === multilineTexts.length - 1) {
                continue;
              }

              this._updateLineInfo();

              lastEmptyLine = true;
              continue;
            }

            lastEmptyLine = false;

            if (this._maxWidth > 0) {
              var labelWidth = this._measureText(i, labelString);

              this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

              if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                this._updateLineInfo();
              }
            } else {
              label = this._addLabelSegment(labelString, i);
              this._lineOffsetX += label.node._uiProps.uiTransformComp.width;

              if (this._lineOffsetX > this._labelWidth) {
                this._labelWidth = this._lineOffsetX;
              }

              if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                this._updateLineInfo();
              }
            }
          }
        }

        if (!lastEmptyLine) {
          this._linesWidth.push(this._lineOffsetX);
        }

        if (this._maxWidth > 0) {
          this._labelWidth = this._maxWidth;
        }

        this._labelHeight = (this._lineCount + _index4.BASELINE_RATIO) * this._lineHeight; // trigger "size-changed" event

        this.node._uiProps.uiTransformComp.setContentSize(this._labelWidth, this._labelHeight);

        this._updateRichTextPosition();

        this._layoutDirty = false;
      }
    }, {
      key: "_getFirstWordLen",
      value: function _getFirstWordLen(text, startIndex, textLen) {
        var character = text.charAt(startIndex);

        if ((0, _index4.isUnicodeCJK)(character) || (0, _index4.isUnicodeSpace)(character)) {
          return 1;
        }

        var len = 1;

        for (var index = startIndex + 1; index < textLen; ++index) {
          character = text.charAt(index);

          if ((0, _index4.isUnicodeSpace)(character) || (0, _index4.isUnicodeCJK)(character)) {
            break;
          }

          len++;
        }

        return len;
      }
    }, {
      key: "_updateRichTextPosition",
      value: function _updateRichTextPosition() {
        var nextTokenX = 0;
        var nextLineIndex = 1;
        var totalLineCount = this._lineCount;
        var trans = this.node._uiProps.uiTransformComp;
        var anchorX = trans.anchorX;
        var anchorY = trans.anchorY;

        for (var i = 0; i < this._labelSegments.length; ++i) {
          var segment = this._labelSegments[i];
          var lineCount = segment.lineCount;

          if (lineCount > nextLineIndex) {
            nextTokenX = 0;
            nextLineIndex = lineCount;
          }

          var lineOffsetX = this._labelWidth * (this._horizontalAlign * 0.5 - anchorX);

          switch (this._horizontalAlign) {
            case _label.HorizontalTextAlignment.LEFT:
              break;

            case _label.HorizontalTextAlignment.CENTER:
              lineOffsetX -= this._linesWidth[lineCount - 1] / 2;
              break;

            case _label.HorizontalTextAlignment.RIGHT:
              lineOffsetX -= this._linesWidth[lineCount - 1];
              break;

            default:
              break;
          }

          var pos = segment.node.position;
          segment.node.setPosition(nextTokenX + lineOffsetX, this._lineHeight * (totalLineCount - lineCount) - this._labelHeight * anchorY, pos.z);

          if (lineCount === nextLineIndex) {
            nextTokenX += segment.node._uiProps.uiTransformComp.width;
          }

          var sprite = segment.node.getComponent(_sprite.Sprite);

          if (sprite) {
            var position = segment.node.position.clone(); // adjust img align (from <img align=top|center|bottom>)

            var lineHeightSet = this._lineHeight;
            var lineHeightReal = this._lineHeight * (1 + _index4.BASELINE_RATIO); //single line node height

            switch (segment.node._uiProps.uiTransformComp.anchorY) {
              case 1:
                position.y += lineHeightSet + (lineHeightReal - lineHeightSet) / 2;
                break;

              case 0.5:
                position.y += lineHeightReal / 2;
                break;

              default:
                position.y += (lineHeightReal - lineHeightSet) / 2;
                break;
            } // adjust img offset (from <img offset=12|12,34>)


            if (segment.imageOffset) {
              var offsets = segment.imageOffset.split(',');

              if (offsets.length === 1 && offsets[0]) {
                var offsetY = parseFloat(offsets[0]);
                if (Number.isInteger(offsetY)) position.y += offsetY;
              } else if (offsets.length === 2) {
                var offsetX = parseFloat(offsets[0]);

                var _offsetY = parseFloat(offsets[1]);

                if (Number.isInteger(offsetX)) position.x += offsetX;
                if (Number.isInteger(_offsetY)) position.y += _offsetY;
              }
            }

            segment.node.position = position;
          } //adjust y for label with outline


          var outline = segment.node.getComponent(_labelOutline.LabelOutline);

          if (outline) {
            var _position = segment.node.position.clone();

            _position.y = _position.y - outline.width;
            segment.node.position = _position;
          }
        }
      }
    }, {
      key: "_convertLiteralColorValue",
      value: function _convertLiteralColorValue(color) {
        var colorValue = color.toUpperCase();

        if (_index5.Color[colorValue]) {
          return _index5.Color[colorValue];
        } else {
          var out = new _index5.Color();
          return out.fromHEX(color);
        }
      }
    }, {
      key: "_applyTextAttribute",
      value: function _applyTextAttribute(labelSeg) {
        var label = labelSeg.node.getComponent(_label.Label);

        if (!label) {
          return;
        }

        var index = labelSeg.styleIndex;
        var textStyle;

        if (this._textArray[index]) {
          textStyle = this._textArray[index].style;
        }

        if (textStyle) {
          label.color = this._convertLiteralColorValue(textStyle.color || 'white');
          label.isBold = !!textStyle.bold;
          label.isItalic = !!textStyle.italic; // TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.
          // if (textStyle.italic) {
          //     labelNode.skewX = 12;
          // }

          label.isUnderline = !!textStyle.underline;

          if (textStyle.outline) {
            var labelOutline = labelSeg.node.getComponent(_labelOutline.LabelOutline);

            if (!labelOutline) {
              labelOutline = labelSeg.node.addComponent(_labelOutline.LabelOutline);
            }

            labelOutline.color = this._convertLiteralColorValue(textStyle.outline.color);
            labelOutline.width = textStyle.outline.width;
          }

          if (textStyle.size) {
            label.fontSize = textStyle.size;
          }

          labelSeg.clickHandler = '';
          labelSeg.clickParam = '';
          var event = textStyle.event;

          if (event) {
            labelSeg.clickHandler = event['click'] || '';
            labelSeg.clickParam = event['param'] || '';
          }
        } else {
          label.fontSize = this._fontSize;
        }

        label.cacheMode = this._cacheMode;
        var isAsset = this._font instanceof _index.Font;

        if (isAsset && !this._isSystemFontUsed) {
          label.font = this._font;
        } else {
          label.fontFamily = this._fontFamily;
        }

        label.useSystemFont = this._isSystemFontUsed;
        label.lineHeight = this._lineHeight;
        label.updateRenderData(true);
      }
    }]);

    return RichText;
  }(_index7.UIComponent), _class3.HorizontalAlign = _label.HorizontalTextAlignment, _class3.VerticalAlign = _label.VerticalTextAlignment, _temp), (_applyDecoratedDescriptor(_class2.prototype, "string", [_index2.multiline, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "string"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "horizontalAlign", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "horizontalAlign"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fontSize", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "fontSize"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fontFamily", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "fontFamily"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "font", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "font"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "useSystemFont", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "useSystemFont"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cacheMode", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "cacheMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "maxWidth", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "maxWidth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "lineHeight", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "lineHeight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "imageAtlas", [_dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "imageAtlas"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleTouchEvent", [_dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "handleTouchEvent"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_lineHeight", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 40;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_string", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '<color=#00ff00>Rich</color><color=#0fffff>Text</color>';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_horizontalAlign", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _label.HorizontalTextAlignment.LEFT;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_fontSize", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 40;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_maxWidth", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_fontFamily", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 'Arial';
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_font", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_isSystemFontUsed", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_userDefinedFont", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_cacheMode", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _label.CacheMode.NONE;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_imageAtlas", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_handleTouchEvent", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.RichText = RichText;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvcmljaC10ZXh0LnRzIl0sIm5hbWVzIjpbIl9odG1sVGV4dFBhcnNlciIsIkh0bWxUZXh0UGFyc2VyIiwiUmljaFRleHRDaGlsZE5hbWUiLCJSaWNoVGV4dENoaWxkSW1hZ2VOYW1lIiwicG9vbCIsIlBvb2wiLCJsYWJlbFNlZyIsIkVESVRPUiIsIkRFViIsIm5vZGUiLCJwYXJlbnQiLCJsZWdhY3lDQyIsImlzVmFsaWQiLCJvdXRsaW5lIiwiZ2V0Q29tcG9uZW50IiwiTGFiZWxPdXRsaW5lIiwid2lkdGgiLCJnZXQiLCJzdHIiLCJyaWNodGV4dCIsIl9nZXQiLCJQcml2YXRlTm9kZSIsImNvbXAiLCJsaW5lQ291bnQiLCJzdHlsZUluZGV4IiwiaW1hZ2VPZmZzZXQiLCJjbGlja1BhcmFtIiwiY2xpY2tIYW5kbGVyIiwibGFiZWxOb2RlIiwibGFiZWwiLCJMYWJlbCIsImFkZENvbXBvbmVudCIsInN0cmluZyIsImhvcml6b250YWxBbGlnbiIsIkhvcml6b250YWxUZXh0QWxpZ25tZW50IiwiTEVGVCIsInZlcnRpY2FsQWxpZ24iLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJUT1AiLCJzZXRQb3NpdGlvbiIsInRyYW5zIiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJzZXRBbmNob3JQb2ludCIsImxhYmVsT2JqIiwiUmljaFRleHQiLCJGb250IiwiQ2FjaGVNb2RlIiwiU3ByaXRlQXRsYXMiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9zdHJpbmciLCJ2YWx1ZSIsIl91cGRhdGVSaWNoVGV4dFN0YXR1cyIsIl9ob3Jpem9udGFsQWxpZ24iLCJfbGF5b3V0RGlydHkiLCJfZm9udFNpemUiLCJfZm9udEZhbWlseSIsIl9mb250IiwiX3VzZXJEZWZpbmVkRm9udCIsInVzZVN5c3RlbUZvbnQiLCJfb25UVEZMb2FkZWQiLCJfaXNTeXN0ZW1Gb250VXNlZCIsIl9jYWNoZU1vZGUiLCJfbWF4V2lkdGgiLCJfbGluZUhlaWdodCIsIl9pbWFnZUF0bGFzIiwiX2hhbmRsZVRvdWNoRXZlbnQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJoYW5kbGVUb3VjaEV2ZW50IiwiX2FkZEV2ZW50TGlzdGVuZXJzIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXJzIiwiX3RleHRBcnJheSIsIl9sYWJlbFNlZ21lbnRzIiwiX2xhYmVsU2VnbWVudHNDYWNoZSIsIl9saW5lc1dpZHRoIiwiX2xpbmVDb3VudCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0IiwiX2xpbmVPZmZzZXRYIiwiX3VwZGF0ZVJpY2hUZXh0IiwiX2FjdGl2YXRlQ2hpbGRyZW4iLCJvbiIsIk5vZGUiLCJFdmVudFR5cGUiLCJBTkNIT1JfQ0hBTkdFRCIsIl91cGRhdGVSaWNoVGV4dFBvc2l0aW9uIiwib25FbmFibGUiLCJvbkRpc2FibGUiLCJzZWciLCJyZW1vdmVGcm9tUGFyZW50IiwicHV0Iiwib2ZmIiwiVE9VQ0hfRU5EIiwiX29uVG91Y2hFbmRlZCIsImZvckVhY2giLCJpdGVtIiwiX2FwcGx5VGV4dEF0dHJpYnV0ZSIsIlRURkZvbnQiLCJfbmF0aXZlQXNzZXQiLCJzZWxmIiwibG9hZGVyIiwibG9hZCIsIm5hdGl2ZVVybCIsImVyciIsImZvbnRGYW1pbHkiLCJmdW5jIiwicyIsImxlbmd0aCIsIl9jcmVhdGVGb250TGFiZWwiLCJwdXNoIiwibGFiZWxTaXplIiwiY29udGVudFNpemUiLCJldmVudCIsImNvbXBvbmVudHMiLCJnZXRDb21wb25lbnRzIiwiQ29tcG9uZW50IiwiX2NvbnRhaW5zVG91Y2hMb2NhdGlvbiIsInRvdWNoIiwiZ2V0VUlMb2NhdGlvbiIsImNvbXBvbmVudCIsImNhbGwiLCJwcm9wYWdhdGlvblN0b3BwZWQiLCJwb2ludCIsIlVJVHJhbnNmb3JtIiwibXlSZWN0IiwiZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImkiLCJjaGlsZCIsIm5hbWUiLCJzcGxpY2UiLCJpbmRleCIsImZpbmRJbmRleCIsImFjdGl2ZSIsInN0cmluZ1Rva2VuIiwibGFiZWxTZWdtZW50IiwicG9wIiwiYWRkQ2hpbGQiLCJsYWJlbFN0cmluZyIsImxhYmVsV2lkdGgiLCJmcmFnbWVudFdpZHRoIiwiY2hlY2tTdGFydEluZGV4IiwiY2hlY2tFbmRJbmRleCIsIl9nZXRGaXJzdFdvcmRMZW4iLCJjaGVja1N0cmluZyIsInN1YnN0ciIsImNoZWNrU3RyaW5nV2lkdGgiLCJfbWVhc3VyZVRleHQiLCJyZW1haW5pbmdTdHJpbmciLCJfYWRkTGFiZWxTZWdtZW50IiwiX3VwZGF0ZUxpbmVJbmZvIiwiZnJhZ21lbnRzIiwiayIsInNwbGl0U3RyaW5nIiwibGFzdEluZGV4T2YiLCJuZXdUZXh0QXJyYXkiLCJvbGRJdGVtIiwibmV3SXRlbSIsInRleHQiLCJvbGRTdHlsZSIsInN0eWxlIiwibmV3U3R5bGUiLCJzaXplIiwiaXRhbGljIiwiaXNJbWFnZSIsInNyYyIsImltYWdlQWxpZ24iLCJpbWFnZUhlaWdodCIsImltYWdlV2lkdGgiLCJyaWNoVGV4dEVsZW1lbnQiLCJzcHJpdGVGcmFtZU5hbWUiLCJzcHJpdGVGcmFtZSIsImdldFNwcml0ZUZyYW1lIiwic3ByaXRlTm9kZSIsInNwcml0ZSIsIlNwcml0ZSIsInR5cGUiLCJUeXBlIiwiU0xJQ0VEIiwic2l6ZU1vZGUiLCJTaXplTW9kZSIsIkNVU1RPTSIsIm9iaiIsInNwcml0ZVJlY3QiLCJyZWN0IiwiY2xvbmUiLCJzY2FsZUZhY3RvciIsInNwcml0ZVdpZHRoIiwic3ByaXRlSGVpZ2h0IiwiaGVpZ2h0IiwiZXhwZWN0V2lkdGgiLCJleHBlY3RIZWlnaHQiLCJzZXRDb250ZW50U2l6ZSIsInBhcnNlIiwiX25lZWRzVXBkYXRlVGV4dExheW91dCIsInNsaWNlIiwiX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzIiwiX3Jlc2V0U3RhdGUiLCJsYXN0RW1wdHlMaW5lIiwidW5kZWZpbmVkIiwiaXNOZXdMaW5lIiwiX2FkZFJpY2hUZXh0SW1hZ2VFbGVtZW50IiwibXVsdGlsaW5lVGV4dHMiLCJzcGxpdCIsImoiLCJfaXNMYXN0Q29tcG9uZW50Q1IiLCJfdXBkYXRlUmljaFRleHRXaXRoTWF4V2lkdGgiLCJCQVNFTElORV9SQVRJTyIsInN0YXJ0SW5kZXgiLCJ0ZXh0TGVuIiwiY2hhcmFjdGVyIiwiY2hhckF0IiwibGVuIiwibmV4dFRva2VuWCIsIm5leHRMaW5lSW5kZXgiLCJ0b3RhbExpbmVDb3VudCIsImFuY2hvclgiLCJhbmNob3JZIiwic2VnbWVudCIsImxpbmVPZmZzZXRYIiwiQ0VOVEVSIiwiUklHSFQiLCJwb3MiLCJwb3NpdGlvbiIsInoiLCJsaW5lSGVpZ2h0U2V0IiwibGluZUhlaWdodFJlYWwiLCJ5Iiwib2Zmc2V0cyIsIm9mZnNldFkiLCJwYXJzZUZsb2F0IiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwib2Zmc2V0WCIsIngiLCJjb2xvciIsImNvbG9yVmFsdWUiLCJ0b1VwcGVyQ2FzZSIsIkNvbG9yIiwib3V0IiwiZnJvbUhFWCIsInRleHRTdHlsZSIsIl9jb252ZXJ0TGl0ZXJhbENvbG9yVmFsdWUiLCJpc0JvbGQiLCJib2xkIiwiaXNJdGFsaWMiLCJpc1VuZGVybGluZSIsInVuZGVybGluZSIsImxhYmVsT3V0bGluZSIsImZvbnRTaXplIiwiY2FjaGVNb2RlIiwiaXNBc3NldCIsImZvbnQiLCJsaW5lSGVpZ2h0IiwidXBkYXRlUmVuZGVyRGF0YSIsIlVJQ29tcG9uZW50IiwiSG9yaXpvbnRhbEFsaWduIiwiVmVydGljYWxBbGlnbiIsIm11bHRpbGluZSIsInNlcmlhbGl6YWJsZSIsIk5PTkUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Q0EsTUFBTUEsZUFBZSxHQUFHLElBQUlDLHNCQUFKLEVBQXhCOztBQUNBLE1BQU1DLGlCQUFpQixHQUFHLGdCQUExQjtBQUNBLE1BQU1DLHNCQUFzQixHQUFHLHNCQUEvQjtBQUVBOzs7O0FBR0EsTUFBTUMs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c0JYLFdBQXBDOztBQUNBLFlBQUk4TSxPQUFPLElBQUksQ0FBQyxLQUFLL0wsaUJBQXJCLEVBQXdDO0FBQ3BDaEMsVUFBQUEsS0FBSyxDQUFDZ08sSUFBTixHQUFhLEtBQUtwTSxLQUFsQjtBQUNILFNBRkQsTUFFTztBQUNINUIsVUFBQUEsS0FBSyxDQUFDMkUsVUFBTixHQUFtQixLQUFLaEQsV0FBeEI7QUFDSDs7QUFDRDNCLFFBQUFBLEtBQUssQ0FBQzhCLGFBQU4sR0FBc0IsS0FBS0UsaUJBQTNCO0FBQ0FoQyxRQUFBQSxLQUFLLENBQUNpTyxVQUFOLEdBQW1CLEtBQUs5TCxXQUF4QjtBQUVBbkMsUUFBQUEsS0FBSyxDQUFDa08sZ0JBQU4sQ0FBdUIsSUFBdkI7QUFDSDs7OztJQTU4QnlCQyxtQixXQWtRWkMsZSxHQUFrQi9OLDhCLFVBQ2xCZ08sYSxHQUFnQjdOLDRCLG1FQTFQN0I4TixpQix1dERBNFBBQyxvQjs7Ozs7YUFDdUIsRTs7OEVBQ3ZCQSxvQjs7Ozs7YUFDbUIsd0Q7O3VGQUVuQkEsb0I7Ozs7O2FBQzRCbE8sK0JBQXdCQyxJOztnRkFDcERpTyxvQjs7Ozs7YUFDcUIsRTs7Z0ZBQ3JCQSxvQjs7Ozs7YUFDcUIsQzs7a0ZBQ3JCQSxvQjs7Ozs7YUFDK0IsTzs7NEVBQy9CQSxvQjs7Ozs7YUFDaUMsSTs7d0ZBQ2pDQSxvQjs7Ozs7YUFDc0MsSTs7dUZBQ3RDQSxvQjs7Ozs7YUFDNEMsSTs7a0ZBQzVDQSxvQjs7Ozs7YUFDaUNyTixpQkFBVXNOLEk7O21GQUMzQ0Qsb0I7Ozs7O2FBQzJDLEk7O3lGQUMzQ0Esb0I7Ozs7O2FBQzZCLEkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRm9udCwgU3ByaXRlQXRsYXMsIFRURkZvbnQgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGV4ZWN1dGVJbkVkaXRNb2RlLCBleGVjdXRpb25PcmRlciwgaGVscCwgbWVudSwgdG9vbHRpcCwgbXVsdGlsaW5lLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBhc3NlcnQsIEV2ZW50VG91Y2gsIHdhcm5JRCB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBCQVNFTElORV9SQVRJTywgZnJhZ21lbnRUZXh0LCBIdG1sVGV4dFBhcnNlciwgSUh0bWxUZXh0UGFyc2VyUmVzdWx0T2JqLCBJSHRtbFRleHRQYXJzZXJTdGFjaywgaXNVbmljb2RlQ0pLLCBpc1VuaWNvZGVTcGFjZSB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xyXG5pbXBvcnQgUG9vbCBmcm9tICcuLi8uLi9jb3JlL3V0aWxzL3Bvb2wnO1xyXG5pbXBvcnQgeyBDb2xvciwgVmVjMiB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IE5vZGUsIFByaXZhdGVOb2RlIH0gZnJvbSAnLi4vLi4vY29yZS9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IENhY2hlTW9kZSwgSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQsIExhYmVsLCBWZXJ0aWNhbFRleHRBbGlnbm1lbnQgfSBmcm9tICcuL2xhYmVsJztcclxuaW1wb3J0IHsgTGFiZWxPdXRsaW5lIH0gZnJvbSAnLi9sYWJlbC1vdXRsaW5lJztcclxuaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgeyBVSUNvbXBvbmVudCwgVUlSZW5kZXJhYmxlLCBVSVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cy91aS1iYXNlJztcclxuaW1wb3J0IHsgbG9hZGVyIH0gZnJvbSAnLi4vLi4vY29yZS9sb2FkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgREVWLCBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRzXCI7XHJcblxyXG5jb25zdCBfaHRtbFRleHRQYXJzZXIgPSBuZXcgSHRtbFRleHRQYXJzZXIoKTtcclxuY29uc3QgUmljaFRleHRDaGlsZE5hbWUgPSAnUklDSFRFWFRfQ0hJTEQnO1xyXG5jb25zdCBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lID0gJ1JJQ0hURVhUX0ltYWdlX0NISUxEJztcclxuXHJcbi8qKlxyXG4gKiDlr4zmlofmnKzmsaDjgII8YnIvPlxyXG4gKi9cclxuY29uc3QgcG9vbCA9IG5ldyBQb29sKChsYWJlbFNlZzogSUxhYmVsU2VnbWVudCkgPT4ge1xyXG4gICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBhc3NlcnQoIWxhYmVsU2VnLm5vZGUucGFyZW50LCAnUmVjeWNsaW5nIG5vZGVcXCdzIHBhcmVudCBzaG91bGQgYmUgbnVsbCEnKTtcclxuICAgIH1cclxuICAgIGlmICghbGVnYWN5Q0MuaXNWYWxpZChsYWJlbFNlZy5ub2RlKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBvdXRsaW5lID0gbGFiZWxTZWcubm9kZS5nZXRDb21wb25lbnQoTGFiZWxPdXRsaW5lKTtcclxuICAgICAgICBpZiAob3V0bGluZSkge1xyXG4gICAgICAgICAgICBvdXRsaW5lLndpZHRoID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufSwgMjApO1xyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5wb29sLmdldCA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZywgcmljaHRleHQ6IFJpY2hUZXh0KSB7XHJcbiAgICBsZXQgbGFiZWxTZWcgPSB0aGlzLl9nZXQoKTtcclxuICAgIGlmICghbGFiZWxTZWcpIHtcclxuICAgICAgICBsYWJlbFNlZyA9IHtcclxuICAgICAgICAgICAgbm9kZTogbmV3IFByaXZhdGVOb2RlKFJpY2hUZXh0Q2hpbGROYW1lKSxcclxuICAgICAgICAgICAgY29tcDogbnVsbCxcclxuICAgICAgICAgICAgbGluZUNvdW50OiAwLFxyXG4gICAgICAgICAgICBzdHlsZUluZGV4OiAwLFxyXG4gICAgICAgICAgICBpbWFnZU9mZnNldDogJycsXHJcbiAgICAgICAgICAgIGNsaWNrUGFyYW06ICcnLFxyXG4gICAgICAgICAgICBjbGlja0hhbmRsZXI6ICcnLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGxhYmVsTm9kZSA9IGxhYmVsU2VnLm5vZGU7XHJcbiAgICBpZiAoIWxhYmVsTm9kZSkge1xyXG4gICAgICAgIGxhYmVsTm9kZSA9IG5ldyBQcml2YXRlTm9kZShSaWNoVGV4dENoaWxkTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGxhYmVsID0gbGFiZWxOb2RlLmdldENvbXBvbmVudChMYWJlbCk7XHJcbiAgICBpZiAoIWxhYmVsKSB7XHJcbiAgICAgICAgbGFiZWwgPSBsYWJlbE5vZGUuYWRkQ29tcG9uZW50KExhYmVsKSE7XHJcbiAgICB9XHJcblxyXG4gICAgbGFiZWwuc3RyaW5nID0gc3RyO1xyXG4gICAgbGFiZWwuaG9yaXpvbnRhbEFsaWduID0gSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQuTEVGVDtcclxuICAgIGxhYmVsLnZlcnRpY2FsQWxpZ24gPSBWZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QO1xyXG4gICAgLy8gbGFiZWwuX2ZvcmNlVXNlQ2FudmFzID0gdHJ1ZTtcclxuXHJcbiAgICBsYWJlbE5vZGUuc2V0UG9zaXRpb24oMCwgMCwgMCk7XHJcbiAgICBsZXQgdHJhbnMgPSBsYWJlbE5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgIHRyYW5zLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcclxuXHJcbiAgICBjb25zdCBsYWJlbE9iajogSUxhYmVsU2VnbWVudCA9IHtcclxuICAgICAgICBub2RlOiBsYWJlbE5vZGUsXHJcbiAgICAgICAgY29tcDogbGFiZWwsXHJcbiAgICAgICAgbGluZUNvdW50OiAwLFxyXG4gICAgICAgIHN0eWxlSW5kZXg6IDAsXHJcbiAgICAgICAgaW1hZ2VPZmZzZXQ6ICcnLFxyXG4gICAgICAgIGNsaWNrUGFyYW06ICcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogJycsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBsYWJlbE9iajtcclxufTtcclxuXHJcbmludGVyZmFjZSBJTGFiZWxTZWdtZW50IHtcclxuICAgIG5vZGU6IFByaXZhdGVOb2RlO1xyXG4gICAgY29tcDogVUlSZW5kZXJhYmxlIHwgbnVsbDtcclxuICAgIGxpbmVDb3VudDogbnVtYmVyO1xyXG4gICAgc3R5bGVJbmRleDogbnVtYmVyO1xyXG4gICAgaW1hZ2VPZmZzZXQ6IHN0cmluZztcclxuICAgIGNsaWNrUGFyYW06IHN0cmluZztcclxuICAgIGNsaWNrSGFuZGxlcjogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBSaWNoVGV4dCBDb21wb25lbnQuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDlr4zmlofmnKznu4Tku7bjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5SaWNoVGV4dCcpXHJcbkBoZWxwKCdpMThuOmNjLlJpY2hUZXh0JylcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQG1lbnUoJ1VJL1JlbmRlci9SaWNoVGV4dCcpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgUmljaFRleHQgZXh0ZW5kcyBVSUNvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbnRlbnQgc3RyaW5nIG9mIFJpY2hUZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a+M5paH5pys5pi+56S655qE5paH5pys5YaF5a6544CCXHJcbiAgICAgKi9cclxuICAgIEBtdWx0aWxpbmVcclxuICAgIEB0b29sdGlwKCflr4zmlofmnKzmmL7npLrnmoTmlofmnKzlhoXlrrknKVxyXG4gICAgZ2V0IHN0cmluZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmluZztcclxuICAgIH1cclxuICAgIHNldCBzdHJpbmcgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0cmluZyA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc3RyaW5nID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSG9yaXpvbnRhbCBBbGlnbm1lbnQgb2YgZWFjaCBsaW5lIGluIFJpY2hUZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5paH5pys5YaF5a6555qE5rC05bmz5a+56b2Q5pa55byP44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEhvcml6b250YWxUZXh0QWxpZ25tZW50KVxyXG4gICAgQHRvb2x0aXAoJ+aWh+acrOWGheWuueeahOawtOW5s+Wvuem9kOaWueW8jycpXHJcbiAgICBnZXQgaG9yaXpvbnRhbEFsaWduICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faG9yaXpvbnRhbEFsaWduO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBob3Jpem9udGFsQWxpZ24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbEFsaWduID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ob3Jpem9udGFsQWxpZ24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRm9udCBzaXplIG9mIFJpY2hUZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a+M5paH5pys5a2X5L2T5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflr4zmlofmnKzlrZfkvZPlpKflsI8nKVxyXG4gICAgZ2V0IGZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvbnRTaXplICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9mb250U2l6ZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ3VzdG9tIFN5c3RlbSBmb250IG9mIFJpY2hUZXh0XHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlr4zmlofmnKzlrprliLbns7vnu5/lrZfkvZNcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WvjOaWh+acrOWumuWItuezu+e7n+Wtl+S9kycpXHJcbiAgICBnZXQgZm9udEZhbWlseSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRGYW1pbHk7XHJcbiAgICB9XHJcbiAgICBzZXQgZm9udEZhbWlseSAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLl9mb250RmFtaWx5ID09PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2ZvbnRGYW1pbHkgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ3VzdG9tIFN5c3RlbSBmb250IG9mIFJpY2hUZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a+M5paH5pys5a6a5Yi25a2X5L2T44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEZvbnQpXHJcbiAgICBAdG9vbHRpcCgn5a+M5paH5pys5a6a5Yi25a2X5L2TJylcclxuICAgIGdldCBmb250ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9udDtcclxuICAgIH1cclxuICAgIHNldCBmb250ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9mb250ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZvbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXNlckRlZmluZWRGb250ID0gdGhpcy5fZm9udDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVzZVN5c3RlbUZvbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fb25UVEZMb2FkZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlU3lzdGVtRm9udCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdXNlIHN5c3RlbSBmb250IG5hbWUgb3Igbm90LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5L2/55So57O757uf5a2X5L2T44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmmK/lkKbkvb/nlKjns7vnu5/lrZfkvZMnKVxyXG4gICAgZ2V0IHVzZVN5c3RlbUZvbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkO1xyXG4gICAgfVxyXG4gICAgc2V0IHVzZVN5c3RlbUZvbnQgKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fdXNlckRlZmluZWRGb250KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250ID0gdGhpcy5fdXNlckRlZmluZWRGb250O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGNhY2hlIG1vZGUgb2YgbGFiZWwuIFRoaXMgbW9kZSBvbmx5IHN1cHBvcnRzIHN5c3RlbSBmb250cy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaWh+acrOe8k+WtmOaooeW8jywg6K+l5qih5byP5Y+q5pSv5oyB57O757uf5a2X5L2T44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENhY2hlTW9kZSlcclxuICAgIEB0b29sdGlwKCfmlofmnKznvJPlrZjmqKHlvI8sIOivpeaooeW8j+WPquaUr+aMgeezu+e7n+Wtl+S9k+OAgicpXHJcbiAgICBnZXQgY2FjaGVNb2RlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVNb2RlO1xyXG4gICAgfVxyXG4gICAgc2V0IGNhY2hlTW9kZSAodmFsdWU6IENhY2hlTW9kZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZU1vZGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1heGltaXplIHdpZHRoIG9mIHRoZSBSaWNoVGV4dC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWvjOaWh+acrOeahOacgOWkp+WuveW6puOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5a+M5paH5pys55qE5pyA5aSn5a695bqmJylcclxuICAgIGdldCBtYXhXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBtYXhXaWR0aCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21heFdpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIExpbmUgSGVpZ2h0IG9mIFJpY2hUZXh0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a+M5paH5pys6KGM6auY44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCflr4zmlofmnKzooYzpq5gnKVxyXG4gICAgZ2V0IGxpbmVIZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saW5lSGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsaW5lSGVpZ2h0ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9saW5lSGVpZ2h0ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9saW5lSGVpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBpbWFnZSBhdGxhcyBmb3IgdGhlIGltZyB0YWcuIEZvciBlYWNoIHNyYyB2YWx1ZSBpbiB0aGUgaW1nIHRhZywgdGhlcmUgc2hvdWxkIGJlIGEgdmFsaWQgc3ByaXRlRnJhbWUgaW4gdGhlIGltYWdlIGF0bGFzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5a+55LqOIGltZyDmoIfnrb7ph4zpnaLnmoQgc3JjIOWxnuaAp+WQjeensO+8jOmDvemcgOimgeWcqCBpbWFnZUF0bGFzIOmHjOmdouaJvuWIsOS4gOS4quacieaViOeahCBzcHJpdGVGcmFtZe+8jOWQpuWImSBpbWcgdGFnIOS8muWIpOWumuS4uuaXoOaViOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGVBdGxhcylcclxuICAgIEB0b29sdGlwKCflr7nkuo4gaW1nIOagh+etvumHjOmdoueahCBzcmMg5bGe5oCn5ZCN56ew77yM6YO96ZyA6KaB5ZyoIGltYWdlQXRsYXMg6YeM6Z2i5om+5Yiw5LiA5Liq5pyJ5pWI55qEIHNwcml0ZUZyYW1l77yM5ZCm5YiZIGltZyB0YWcg5Lya5Yik5a6a5Li65peg5pWIJylcclxuICAgIGdldCBpbWFnZUF0bGFzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2VBdGxhcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW1hZ2VBdGxhcyAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1hZ2VBdGxhcyA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW1hZ2VBdGxhcyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dFN0YXR1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBPbmNlIGNoZWNrZWQsIHRoZSBSaWNoVGV4dCB3aWxsIGJsb2NrIGFsbCBpbnB1dCBldmVudHMgKG1vdXNlIGFuZCB0b3VjaCkgd2l0aGluXHJcbiAgICAgKiB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlLCBwcmV2ZW50aW5nIHRoZSBpbnB1dCBmcm9tIHBlbmV0cmF0aW5nIGludG8gdGhlIHVuZGVybHlpbmcgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmAieS4reatpOmAiemhueWQju+8jFJpY2hUZXh0IOWwhumYu+atouiKgueCuei+ueeVjOahhuS4reeahOaJgOaciei+k+WFpeS6i+S7tu+8iOm8oOagh+WSjOinpuaRuO+8ie+8jOS7juiAjOmYsuatoui+k+WFpeS6i+S7tuepv+mAj+WIsOW6leWxguiKgueCueOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn6YCJ5Lit5q2k6YCJ6aG55ZCO77yMUmljaFRleHQg5bCG6Zi75q2i6IqC54K56L6555WM5qGG5Lit55qE5omA5pyJ6L6T5YWl5LqL5Lu277yI6byg5qCH5ZKM6Kem5pG477yJ77yM5LuO6ICM6Ziy5q2i6L6T5YWl5LqL5Lu256m/6YCP5Yiw5bqV5bGC6IqC54K5JylcclxuICAgIGdldCBoYW5kbGVUb3VjaEV2ZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlVG91Y2hFdmVudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaGFuZGxlVG91Y2hFdmVudCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5faGFuZGxlVG91Y2hFdmVudCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faGFuZGxlVG91Y2hFdmVudCA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoRXZlbnQgPyB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpIDogdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIEhvcml6b250YWxBbGlnbiA9IEhvcml6b250YWxUZXh0QWxpZ25tZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBWZXJ0aWNhbEFsaWduID0gVmVydGljYWxUZXh0QWxpZ25tZW50O1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbGluZUhlaWdodCA9IDQwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zdHJpbmcgPSAnPGNvbG9yPSMwMGZmMDA+UmljaDwvY29sb3I+PGNvbG9yPSMwZmZmZmY+VGV4dDwvY29sb3I+JztcclxuICAgIC8vIHByb3RlY3RlZCBfdXBkYXRlUmljaFRleHRTdGF0dXMgPVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9ob3Jpem9udGFsQWxpZ24gPSBIb3Jpem9udGFsVGV4dEFsaWdubWVudC5MRUZUO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mb250U2l6ZSA9IDQwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9tYXhXaWR0aCA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvbnRGYW1pbHk6IHN0cmluZyA9ICdBcmlhbCc7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvbnQ6IFRURkZvbnQgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfaXNTeXN0ZW1Gb250VXNlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3VzZXJEZWZpbmVkRm9udDogVFRGRm9udCB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jYWNoZU1vZGU6IENhY2hlTW9kZSA9IENhY2hlTW9kZS5OT05FO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pbWFnZUF0bGFzOiBTcHJpdGVBdGxhcyB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9oYW5kbGVUb3VjaEV2ZW50ID0gdHJ1ZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3RleHRBcnJheTogSUh0bWxUZXh0UGFyc2VyUmVzdWx0T2JqW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfbGFiZWxTZWdtZW50czogSUxhYmVsU2VnbWVudFtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2xhYmVsU2VnbWVudHNDYWNoZTogSUxhYmVsU2VnbWVudFtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2xpbmVzV2lkdGg6IG51bWJlcltdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2xpbmVDb3VudCA9IDE7XHJcbiAgICBwcm90ZWN0ZWQgX2xhYmVsV2lkdGggPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9sYWJlbEhlaWdodCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2xheW91dERpcnR5ID0gdHJ1ZTtcclxuICAgIHByb3RlY3RlZCBfbGluZU9mZnNldFggPSAwO1xyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVSaWNoVGV4dFN0YXR1czogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZXJEZWZpbmVkRm9udCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzID0gdGhpcy5fdXBkYXRlUmljaFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5oYW5kbGVUb3VjaEV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlQ2hpbGRyZW4odHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlVG91Y2hFdmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVDaGlsZHJlbihmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0ICgpIHtcclxuICAgICAgICB0aGlzLl9vblRURkxvYWRlZCgpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlUmljaFRleHRQb3NpdGlvbiwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUmVzdG9yZSAoKSB7XHJcbiAgICAgICAgaWYgKCFFRElUT1IpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogcmVmaW5lIHVuZG8vcmVkbyBzeXN0ZW1cclxuICAgICAgICAvLyBCZWNhdXNlIHVuZG8vcmVkbyB3aWxsIG5vdCBjYWxsIG9uRW5hYmxlL29uRGlzYWJsZSxcclxuICAgICAgICAvLyB3ZSBuZWVkIGNhbGwgb25FbmFibGUvb25EaXNhYmxlIG1hbnVhbGx5IHRvIGFjdGl2ZS9kaXNhY3RpdmUgY2hpbGRyZW4gbm9kZXMuXHJcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25FbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25EaXNhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2VnIG9mIHRoaXMuX2xhYmVsU2VnbWVudHMpIHtcclxuICAgICAgICAgICAgc2VnLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xyXG4gICAgICAgICAgICBwb29sLnB1dChzZWcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihOb2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlUmljaFRleHRQb3NpdGlvbiwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hZGRFdmVudExpc3RlbmVycyAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlbW92ZUV2ZW50TGlzdGVuZXJzICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzICgpIHtcclxuICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fYXBwbHlUZXh0QXR0cmlidXRlKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY3JlYXRlRm9udExhYmVsIChzdHI6IHN0cmluZyk6IElMYWJlbFNlZ21lbnQge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICByZXR1cm4gcG9vbC5nZXQoc3RyLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVFRGTG9hZGVkICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZm9udCBpbnN0YW5jZW9mIFRURkZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZvbnQuX25hdGl2ZUFzc2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBsb2FkZXIubG9hZCh0aGlzLl9mb250Lm5hdGl2ZVVybCwgKGVyciwgZm9udEZhbWlseSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2xheW91dERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLl91cGRhdGVSaWNoVGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9tZWFzdXJlVGV4dCAoc3R5bGVJbmRleDogbnVtYmVyLCBzdHJpbmc/OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCBmdW5jID0gKHM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGFiZWw6IElMYWJlbFNlZ21lbnQ7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLl9sYWJlbFNlZ21lbnRzQ2FjaGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHNlbGYuX2NyZWF0ZUZvbnRMYWJlbChzKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2xhYmVsU2VnbWVudHNDYWNoZS5wdXNoKGxhYmVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxhYmVsID0gc2VsZi5fbGFiZWxTZWdtZW50c0NhY2hlWzBdO1xyXG4gICAgICAgICAgICAgICAgbGFiZWwubm9kZS5nZXRDb21wb25lbnQoTGFiZWwpIS5zdHJpbmcgPSBzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxhYmVsLnN0eWxlSW5kZXggPSBzdHlsZUluZGV4O1xyXG4gICAgICAgICAgICBzZWxmLl9hcHBseVRleHRBdHRyaWJ1dGUobGFiZWwpO1xyXG4gICAgICAgICAgICBjb25zdCBsYWJlbFNpemUgPSBsYWJlbC5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemU7XHJcbiAgICAgICAgICAgIHJldHVybiBsYWJlbFNpemUud2lkdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jKHN0cmluZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoRW5kZWQgKGV2ZW50OiBFdmVudFRvdWNoKSB7XHJcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IHRoaXMubm9kZS5nZXRDb21wb25lbnRzKENvbXBvbmVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2VnIG9mIHRoaXMuX2xhYmVsU2VnbWVudHMpIHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tIYW5kbGVyID0gc2VnLmNsaWNrSGFuZGxlcjtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tQYXJhbSA9IHNlZy5jbGlja1BhcmFtO1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tIYW5kbGVyICYmIHRoaXMuX2NvbnRhaW5zVG91Y2hMb2NhdGlvbihzZWcsIGV2ZW50LnRvdWNoIS5nZXRVSUxvY2F0aW9uKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBjb21wb25lbnRbY2xpY2tIYW5kbGVyXSBhcyBGdW5jdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmVuYWJsZWRJbkhpZXJhcmNoeSAmJiBmdW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMuY2FsbChjb21wb25lbnQsIGV2ZW50LCBjbGlja1BhcmFtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jb250YWluc1RvdWNoTG9jYXRpb24gKGxhYmVsOiBJTGFiZWxTZWdtZW50LCBwb2ludDogVmVjMikge1xyXG4gICAgICAgIGNvbnN0IGNvbXAgPSBsYWJlbC5ub2RlLmdldENvbXBvbmVudChVSVRyYW5zZm9ybSk7XHJcbiAgICAgICAgaWYgKCFjb21wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG15UmVjdCA9IGNvbXAuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XHJcbiAgICAgICAgcmV0dXJuIG15UmVjdC5jb250YWlucyhwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZXNldFN0YXRlICgpIHtcclxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbiBhcyBNdXRhYmxlPE5vZGVbXT47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQubmFtZSA9PT0gUmljaFRleHRDaGlsZE5hbWUgfHwgY2hpbGQubmFtZSA9PT0gUmljaFRleHRDaGlsZEltYWdlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCA9PT0gdGhpcy5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gY2FzZSBjaGlsZC5wYXJlbnQgIT09IHRoaXMubm9kZSwgY2hpbGQgY2Fubm90IGJlIHJlbW92ZWQgZnJvbSBjaGlsZHJlblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5hbWUgPT09IFJpY2hUZXh0Q2hpbGROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9sYWJlbFNlZ21lbnRzLmZpbmRJbmRleCgoc2VnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWcubm9kZSA9PT0gY2hpbGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9vbC5wdXQodGhpcy5fbGFiZWxTZWdtZW50c1tpbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2xhYmVsU2VnbWVudHNDYWNoZS5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2xpbmVzV2lkdGgubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGluZUNvdW50ID0gMTtcclxuICAgICAgICB0aGlzLl9sYWJlbFdpZHRoID0gMDtcclxuICAgICAgICB0aGlzLl9sYWJlbEhlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYWN0aXZhdGVDaGlsZHJlbiAoYWN0aXZlKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubm9kZS5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMubm9kZS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLm5hbWUgPT09IFJpY2hUZXh0Q2hpbGROYW1lIHx8IGNoaWxkLm5hbWUgPT09IFJpY2hUZXh0Q2hpbGRJbWFnZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmFjdGl2ZSA9IGFjdGl2ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2FkZExhYmVsU2VnbWVudCAoc3RyaW5nVG9rZW46IHN0cmluZywgc3R5bGVJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGxhYmVsU2VnbWVudDogSUxhYmVsU2VnbWVudDtcclxuICAgICAgICBpZiAodGhpcy5fbGFiZWxTZWdtZW50c0NhY2hlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBsYWJlbFNlZ21lbnQgPSB0aGlzLl9jcmVhdGVGb250TGFiZWwoc3RyaW5nVG9rZW4pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxhYmVsU2VnbWVudCA9IHRoaXMuX2xhYmVsU2VnbWVudHNDYWNoZS5wb3AoKSE7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxTZWdtZW50Lm5vZGUuZ2V0Q29tcG9uZW50KExhYmVsKTtcclxuICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBzdHJpbmdUb2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFiZWxTZWdtZW50LnN0eWxlSW5kZXggPSBzdHlsZUluZGV4O1xyXG4gICAgICAgIGxhYmVsU2VnbWVudC5saW5lQ291bnQgPSB0aGlzLl9saW5lQ291bnQ7XHJcbiAgICAgICAgbGFiZWxTZWdtZW50Lm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRBbmNob3JQb2ludCgwLCAwKTtcclxuICAgICAgICB0aGlzLl9hcHBseVRleHRBdHRyaWJ1dGUobGFiZWxTZWdtZW50KTtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGxhYmVsU2VnbWVudC5ub2RlKTtcclxuICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzLnB1c2gobGFiZWxTZWdtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxhYmVsU2VnbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVJpY2hUZXh0V2l0aE1heFdpZHRoIChsYWJlbFN0cmluZzogc3RyaW5nLCBsYWJlbFdpZHRoOiBudW1iZXIsIHN0eWxlSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBmcmFnbWVudFdpZHRoID0gbGFiZWxXaWR0aDtcclxuICAgICAgICBsZXQgbGFiZWxTZWdtZW50OiBJTGFiZWxTZWdtZW50O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbGluZU9mZnNldFggPiAwICYmIGZyYWdtZW50V2lkdGggKyB0aGlzLl9saW5lT2Zmc2V0WCA+IHRoaXMuX21heFdpZHRoKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbmNhdCBwcmV2aW91cyBsaW5lXHJcbiAgICAgICAgICAgIGxldCBjaGVja1N0YXJ0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5fbGluZU9mZnNldFggPD0gdGhpcy5fbWF4V2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrRW5kSW5kZXggPSB0aGlzLl9nZXRGaXJzdFdvcmRMZW4obGFiZWxTdHJpbmcsIGNoZWNrU3RhcnRJbmRleCwgbGFiZWxTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrU3RyaW5nID0gbGFiZWxTdHJpbmcuc3Vic3RyKGNoZWNrU3RhcnRJbmRleCwgY2hlY2tFbmRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja1N0cmluZ1dpZHRoID0gdGhpcy5fbWVhc3VyZVRleHQoc3R5bGVJbmRleCwgY2hlY2tTdHJpbmcpIGFzIG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGluZU9mZnNldFggKyBjaGVja1N0cmluZ1dpZHRoIDw9IHRoaXMuX21heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gY2hlY2tTdHJpbmdXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja1N0YXJ0SW5kZXggKz0gY2hlY2tFbmRJbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tTdGFydEluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1haW5pbmdTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoMCwgY2hlY2tTdGFydEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkTGFiZWxTZWdtZW50KHJlbWFpbmluZ1N0cmluZywgc3R5bGVJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsU3RyaW5nID0gbGFiZWxTdHJpbmcuc3Vic3RyKGNoZWNrU3RhcnRJbmRleCwgbGFiZWxTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KHN0eWxlSW5kZXgsIGxhYmVsU3RyaW5nKSBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpbmVJbmZvKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZyYWdtZW50V2lkdGggPiB0aGlzLl9tYXhXaWR0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBmcmFnbWVudFRleHQobGFiZWxTdHJpbmcsIGZyYWdtZW50V2lkdGgsIHRoaXMuX21heFdpZHRoLCB0aGlzLl9tZWFzdXJlVGV4dChzdHlsZUluZGV4KSBhcyAoczogc3RyaW5nKSA9PiBudW1iZXIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGZyYWdtZW50cy5sZW5ndGg7ICsraykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3BsaXRTdHJpbmcgPSBmcmFnbWVudHNba107XHJcbiAgICAgICAgICAgICAgICBsYWJlbFNlZ21lbnQgPSB0aGlzLl9hZGRMYWJlbFNlZ21lbnQoc3BsaXRTdHJpbmcsIHN0eWxlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFiZWxTaXplID0gbGFiZWxTZWdtZW50Lm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5jb250ZW50U2l6ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVPZmZzZXRYICs9IGxhYmVsU2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudHMubGVuZ3RoID4gMSAmJiBrIDwgZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBmcmFnbWVudFdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMYWJlbFNlZ21lbnQobGFiZWxTdHJpbmcsIHN0eWxlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2lzTGFzdENvbXBvbmVudENSIChzdHJpbmdUb2tlbikge1xyXG4gICAgICAgIHJldHVybiBzdHJpbmdUb2tlbi5sZW5ndGggLSAxID09PSBzdHJpbmdUb2tlbi5sYXN0SW5kZXhPZignXFxuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVMaW5lSW5mbyAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGluZXNXaWR0aC5wdXNoKHRoaXMuX2xpbmVPZmZzZXRYKTtcclxuICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGluZUNvdW50Kys7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9uZWVkc1VwZGF0ZVRleHRMYXlvdXQgKG5ld1RleHRBcnJheTogSUh0bWxUZXh0UGFyc2VyUmVzdWx0T2JqW10pIHtcclxuICAgICAgICBpZiAodGhpcy5fbGF5b3V0RGlydHkgfHwgIXRoaXMuX3RleHRBcnJheSB8fCAhbmV3VGV4dEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHRBcnJheS5sZW5ndGggIT09IG5ld1RleHRBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RleHRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBvbGRJdGVtID0gdGhpcy5fdGV4dEFycmF5W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdJdGVtID0gbmV3VGV4dEFycmF5W2ldO1xyXG4gICAgICAgICAgICBpZiAob2xkSXRlbS50ZXh0ICE9PSBuZXdJdGVtLnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9sZFN0eWxlID0gb2xkSXRlbS5zdHlsZSwgbmV3U3R5bGUgPSBuZXdJdGVtLnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIW5ld1N0eWxlLm91dGxpbmUgIT09ICEhb2xkU3R5bGUub3V0bGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFN0eWxlLnNpemUgIT09IG5ld1N0eWxlLnNpemUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFN0eWxlLml0YWxpYyAhPT0gbmV3U3R5bGUuaXRhbGljIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRTdHlsZS5pc0ltYWdlICE9PSBuZXdTdHlsZS5pc0ltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkU3R5bGUuc3JjICE9PSBuZXdTdHlsZS5zcmMgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFN0eWxlLmltYWdlQWxpZ24gIT09IG5ld1N0eWxlLmltYWdlQWxpZ24gfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFN0eWxlLmltYWdlSGVpZ2h0ICE9PSBuZXdTdHlsZS5pbWFnZUhlaWdodCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkU3R5bGUuaW1hZ2VXaWR0aCAhPT0gbmV3U3R5bGUuaW1hZ2VXaWR0aCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkU3R5bGUuaW1hZ2VPZmZzZXQgIT09IG5ld1N0eWxlLmltYWdlT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbGRTdHlsZS5zaXplIHx8IG9sZFN0eWxlLml0YWxpYyB8fCBvbGRTdHlsZS5pc0ltYWdlIHx8IG9sZFN0eWxlLm91dGxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlLnNpemUgfHwgbmV3U3R5bGUuaXRhbGljIHx8IG5ld1N0eWxlLmlzSW1hZ2UgfHwgbmV3U3R5bGUub3V0bGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYWRkUmljaFRleHRJbWFnZUVsZW1lbnQgKHJpY2hUZXh0RWxlbWVudDogSUh0bWxUZXh0UGFyc2VyUmVzdWx0T2JqKSB7XHJcbiAgICAgICAgaWYgKCFyaWNoVGV4dEVsZW1lbnQuc3R5bGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSByaWNoVGV4dEVsZW1lbnQuc3R5bGU7XHJcbiAgICAgICAgY29uc3Qgc3ByaXRlRnJhbWVOYW1lID0gc3R5bGUuc3JjO1xyXG4gICAgICAgIGNvbnN0IHNwcml0ZUZyYW1lID0gdGhpcy5faW1hZ2VBdGxhcyAmJiBzcHJpdGVGcmFtZU5hbWUgJiYgdGhpcy5faW1hZ2VBdGxhcy5nZXRTcHJpdGVGcmFtZShzcHJpdGVGcmFtZU5hbWUpO1xyXG4gICAgICAgIGlmICghc3ByaXRlRnJhbWUpIHtcclxuICAgICAgICAgICAgd2FybklEKDQ0MDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwcml0ZU5vZGUgPSBuZXcgUHJpdmF0ZU5vZGUoUmljaFRleHRDaGlsZEltYWdlTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwcml0ZSA9IHNwcml0ZU5vZGUuYWRkQ29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoc3R5bGUuaW1hZ2VBbGlnbikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVOb2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuc2V0QW5jaG9yUG9pbnQoMCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjZW50ZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRBbmNob3JQb2ludCgwLCAwLjUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVOb2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuc2V0QW5jaG9yUG9pbnQoMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3ByaXRlLnR5cGUgPSBTcHJpdGUuVHlwZS5TTElDRUQ7XHJcbiAgICAgICAgICAgIHNwcml0ZS5zaXplTW9kZSA9IFNwcml0ZS5TaXplTW9kZS5DVVNUT007XHJcblxyXG4gICAgICAgICAgICAvLyBXaHkgbmVlZCB0byBzZXQgc3ByaXRlRnJhbWUgYmVmb3JlIGNhbiBhZGQgY2hpbGQgPz9cclxuICAgICAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHNwcml0ZU5vZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBvYmo6IElMYWJlbFNlZ21lbnQgPSB7XHJcbiAgICAgICAgICAgICAgICBub2RlOiBzcHJpdGVOb2RlLFxyXG4gICAgICAgICAgICAgICAgY29tcDogc3ByaXRlLFxyXG4gICAgICAgICAgICAgICAgbGluZUNvdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgc3R5bGVJbmRleDogMCxcclxuICAgICAgICAgICAgICAgIGltYWdlT2Zmc2V0OiBzdHlsZS5pbWFnZU9mZnNldCB8fCAnJyxcclxuICAgICAgICAgICAgICAgIGNsaWNrUGFyYW06ICcnLFxyXG4gICAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiAnJyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cy5wdXNoKG9iaik7XHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3ByaXRlUmVjdCA9IHNwcml0ZUZyYW1lLnJlY3QuY2xvbmUoKTtcclxuICAgICAgICAgICAgbGV0IHNjYWxlRmFjdG9yID0gMTtcclxuICAgICAgICAgICAgbGV0IHNwcml0ZVdpZHRoID0gc3ByaXRlUmVjdC53aWR0aDtcclxuICAgICAgICAgICAgbGV0IHNwcml0ZUhlaWdodCA9IHNwcml0ZVJlY3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCBleHBlY3RXaWR0aCA9IHN0eWxlLmltYWdlV2lkdGggfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgZXhwZWN0SGVpZ2h0ID0gc3R5bGUuaW1hZ2VIZWlnaHQgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChleHBlY3RIZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBzY2FsZUZhY3RvciA9IGV4cGVjdEhlaWdodCAvIHNwcml0ZUhlaWdodDtcclxuICAgICAgICAgICAgICAgIHNwcml0ZVdpZHRoID0gc3ByaXRlV2lkdGggKiBzY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgICAgIHNwcml0ZUhlaWdodCA9IHNwcml0ZUhlaWdodCAqIHNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2NhbGVGYWN0b3IgPSB0aGlzLl9saW5lSGVpZ2h0IC8gc3ByaXRlSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlV2lkdGggPSBzcHJpdGVXaWR0aCAqIHNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlSGVpZ2h0ID0gc3ByaXRlSGVpZ2h0ICogc2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChleHBlY3RXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNwcml0ZVdpZHRoID0gZXhwZWN0V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXhXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5lT2Zmc2V0WCArIHNwcml0ZVdpZHRoID4gdGhpcy5fbWF4V2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gc3ByaXRlV2lkdGg7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gc3ByaXRlV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGluZU9mZnNldFggPiB0aGlzLl9sYWJlbFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFiZWxXaWR0aCA9IHRoaXMuX2xpbmVPZmZzZXRYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwcml0ZU5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZShzcHJpdGVXaWR0aCwgc3ByaXRlSGVpZ2h0KTtcclxuICAgICAgICAgICAgb2JqLmxpbmVDb3VudCA9IHRoaXMuX2xpbmVDb3VudDtcclxuXHJcbiAgICAgICAgICAgIG9iai5jbGlja0hhbmRsZXIgPSAnJztcclxuICAgICAgICAgICAgb2JqLmNsaWNrUGFyYW0gPSAnJztcclxuICAgICAgICAgICAgbGV0IGV2ZW50ID0gc3R5bGUuZXZlbnQ7XHJcbiAgICAgICAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLmNsaWNrSGFuZGxlciA9IGV2ZW50WydjbGljayddO1xyXG4gICAgICAgICAgICAgICAgb2JqLmNsaWNrUGFyYW0gPSBldmVudFsncGFyYW0nXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVJpY2hUZXh0ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1RleHRBcnJheSA9IF9odG1sVGV4dFBhcnNlci5wYXJzZSh0aGlzLl9zdHJpbmcpO1xyXG4gICAgICAgIGlmICghdGhpcy5fbmVlZHNVcGRhdGVUZXh0TGF5b3V0KG5ld1RleHRBcnJheSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dEFycmF5ID0gbmV3VGV4dEFycmF5LnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3RleHRBcnJheSA9IG5ld1RleHRBcnJheS5zbGljZSgpO1xyXG4gICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IGxhc3RFbXB0eUxpbmUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgbGFiZWw6IElMYWJlbFNlZ21lbnQ7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGV4dEFycmF5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpY2hUZXh0RWxlbWVudCA9IHRoaXMuX3RleHRBcnJheVtpXTtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHJpY2hUZXh0RWxlbWVudC50ZXh0O1xyXG4gICAgICAgICAgICBpZiAodGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaGFuZGxlIDxici8+IDxpbWcgLz4gdGFnXHJcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJpY2hUZXh0RWxlbWVudC5zdHlsZSAmJiByaWNoVGV4dEVsZW1lbnQuc3R5bGUuaXNOZXdMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyaWNoVGV4dEVsZW1lbnQuc3R5bGUgJiYgcmljaFRleHRFbGVtZW50LnN0eWxlLmlzSW1hZ2UgJiYgdGhpcy5faW1hZ2VBdGxhcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZFJpY2hUZXh0SW1hZ2VFbGVtZW50KHJpY2hUZXh0RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbXVsdGlsaW5lVGV4dHMgPSB0ZXh0LnNwbGl0KCdcXG4nKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbXVsdGlsaW5lVGV4dHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsU3RyaW5nID0gbXVsdGlsaW5lVGV4dHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAobGFiZWxTdHJpbmcgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGNvbnRpbnVlcyBcXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNMYXN0Q29tcG9uZW50Q1IodGV4dCkgJiYgaiA9PT0gbXVsdGlsaW5lVGV4dHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0RW1wdHlMaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3RFbXB0eUxpbmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF4V2lkdGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFiZWxXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KGksIGxhYmVsU3RyaW5nKSBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRXaXRoTWF4V2lkdGgobGFiZWxTdHJpbmcsIGxhYmVsV2lkdGgsIGkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlsaW5lVGV4dHMubGVuZ3RoID4gMSAmJiBqIDwgbXVsdGlsaW5lVGV4dHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9hZGRMYWJlbFNlZ21lbnQobGFiZWxTdHJpbmcsIGkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBsYWJlbC5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEud2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVPZmZzZXRYID4gdGhpcy5fbGFiZWxXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYWJlbFdpZHRoID0gdGhpcy5fbGluZU9mZnNldFg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlsaW5lVGV4dHMubGVuZ3RoID4gMSAmJiBqIDwgbXVsdGlsaW5lVGV4dHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWxhc3RFbXB0eUxpbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGluZXNXaWR0aC5wdXNoKHRoaXMuX2xpbmVPZmZzZXRYKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9tYXhXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fbGFiZWxXaWR0aCA9IHRoaXMuX21heFdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9sYWJlbEhlaWdodCA9ICh0aGlzLl9saW5lQ291bnQgKyBCQVNFTElORV9SQVRJTykgKiB0aGlzLl9saW5lSGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyB0cmlnZ2VyIFwic2l6ZS1jaGFuZ2VkXCIgZXZlbnRcclxuICAgICAgICB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZSh0aGlzLl9sYWJlbFdpZHRoLCB0aGlzLl9sYWJlbEhlaWdodCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0UG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0Rmlyc3RXb3JkTGVuICh0ZXh0OiBzdHJpbmcsIHN0YXJ0SW5kZXg6IG51bWJlciwgdGV4dExlbjogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGNoYXJhY3RlciA9IHRleHQuY2hhckF0KHN0YXJ0SW5kZXgpO1xyXG4gICAgICAgIGlmIChpc1VuaWNvZGVDSksoY2hhcmFjdGVyKSB8fCBpc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxlbiA9IDE7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4ICsgMTsgaW5kZXggPCB0ZXh0TGVuOyArK2luZGV4KSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IHRleHQuY2hhckF0KGluZGV4KTtcclxuICAgICAgICAgICAgaWYgKGlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikgfHwgaXNVbmljb2RlQ0pLKGNoYXJhY3RlcikpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZW4rKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVSaWNoVGV4dFBvc2l0aW9uICgpIHtcclxuICAgICAgICBsZXQgbmV4dFRva2VuWCA9IDA7XHJcbiAgICAgICAgbGV0IG5leHRMaW5lSW5kZXggPSAxO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsTGluZUNvdW50ID0gdGhpcy5fbGluZUNvdW50O1xyXG4gICAgICAgIGNvbnN0IHRyYW5zID0gdGhpcy5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgY29uc3QgYW5jaG9yWCA9IHRyYW5zLmFuY2hvclg7XHJcbiAgICAgICAgY29uc3QgYW5jaG9yWSA9IHRyYW5zLmFuY2hvclk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9sYWJlbFNlZ21lbnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlZ21lbnQgPSB0aGlzLl9sYWJlbFNlZ21lbnRzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lQ291bnQgPSBzZWdtZW50LmxpbmVDb3VudDtcclxuICAgICAgICAgICAgaWYgKGxpbmVDb3VudCA+IG5leHRMaW5lSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xyXG4gICAgICAgICAgICAgICAgbmV4dExpbmVJbmRleCA9IGxpbmVDb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGxpbmVPZmZzZXRYID0gdGhpcy5fbGFiZWxXaWR0aCAqICh0aGlzLl9ob3Jpem9udGFsQWxpZ24gKiAwLjUgLSBhbmNob3JYKTtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLl9ob3Jpem9udGFsQWxpZ24pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQuTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgSG9yaXpvbnRhbFRleHRBbGlnbm1lbnQuQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVPZmZzZXRYIC09IHRoaXMuX2xpbmVzV2lkdGhbbGluZUNvdW50IC0gMV0gLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBIb3Jpem9udGFsVGV4dEFsaWdubWVudC5SSUdIVDpcclxuICAgICAgICAgICAgICAgICAgICBsaW5lT2Zmc2V0WCAtPSB0aGlzLl9saW5lc1dpZHRoW2xpbmVDb3VudCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9zID0gc2VnbWVudC5ub2RlLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBzZWdtZW50Lm5vZGUuc2V0UG9zaXRpb24obmV4dFRva2VuWCArIGxpbmVPZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZUhlaWdodCAqICh0b3RhbExpbmVDb3VudCAtIGxpbmVDb3VudCkgLSB0aGlzLl9sYWJlbEhlaWdodCAqIGFuY2hvclksXHJcbiAgICAgICAgICAgICAgICBwb3MueixcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsaW5lQ291bnQgPT09IG5leHRMaW5lSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIG5leHRUb2tlblggKz0gc2VnbWVudC5ub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBzcHJpdGUgPSBzZWdtZW50Lm5vZGUuZ2V0Q29tcG9uZW50KFNwcml0ZSk7XHJcbiAgICAgICAgICAgIGlmIChzcHJpdGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHNlZ21lbnQubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IGltZyBhbGlnbiAoZnJvbSA8aW1nIGFsaWduPXRvcHxjZW50ZXJ8Ym90dG9tPilcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lSGVpZ2h0U2V0ID0gdGhpcy5fbGluZUhlaWdodDtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lSGVpZ2h0UmVhbCA9IHRoaXMuX2xpbmVIZWlnaHQgKiAoMSArIEJBU0VMSU5FX1JBVElPKTsgLy9zaW5nbGUgbGluZSBub2RlIGhlaWdodFxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChzZWdtZW50Lm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5hbmNob3JZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ICs9IChsaW5lSGVpZ2h0U2V0ICsgKChsaW5lSGVpZ2h0UmVhbCAtIGxpbmVIZWlnaHRTZXQpIC8gMikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDAuNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSArPSAobGluZUhlaWdodFJlYWwgLyAyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSArPSAoKGxpbmVIZWlnaHRSZWFsIC0gbGluZUhlaWdodFNldCkgLyAyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgaW1nIG9mZnNldCAoZnJvbSA8aW1nIG9mZnNldD0xMnwxMiwzND4pXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VnbWVudC5pbWFnZU9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRzID0gc2VnbWVudC5pbWFnZU9mZnNldC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRzLmxlbmd0aCA9PT0gMSAmJiBvZmZzZXRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRZID0gcGFyc2VGbG9hdChvZmZzZXRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob2Zmc2V0WSkpIHBvc2l0aW9uLnkgKz0gb2Zmc2V0WTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob2Zmc2V0cy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFggPSBwYXJzZUZsb2F0KG9mZnNldHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IHBhcnNlRmxvYXQob2Zmc2V0c1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9mZnNldFgpKSBwb3NpdGlvbi54ICs9IG9mZnNldFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9mZnNldFkpKSBwb3NpdGlvbi55ICs9IG9mZnNldFk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ub2RlLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vYWRqdXN0IHkgZm9yIGxhYmVsIHdpdGggb3V0bGluZVxyXG4gICAgICAgICAgICBsZXQgb3V0bGluZSA9IHNlZ21lbnQubm9kZS5nZXRDb21wb25lbnQoTGFiZWxPdXRsaW5lKTtcclxuICAgICAgICAgICAgaWYgKG91dGxpbmUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IHNlZ21lbnQubm9kZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgLSBvdXRsaW5lLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5ub2RlLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jb252ZXJ0TGl0ZXJhbENvbG9yVmFsdWUgKGNvbG9yOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBjb2xvclZhbHVlID0gY29sb3IudG9VcHBlckNhc2UoKTtcclxuICAgICAgICBpZiAoQ29sb3JbY29sb3JWYWx1ZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvbG9yW2NvbG9yVmFsdWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ID0gbmV3IENvbG9yKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQuZnJvbUhFWChjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXBwbHlUZXh0QXR0cmlidXRlIChsYWJlbFNlZzogSUxhYmVsU2VnbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGxhYmVsID0gbGFiZWxTZWcubm9kZS5nZXRDb21wb25lbnQoTGFiZWwpO1xyXG4gICAgICAgIGlmICghbGFiZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBsYWJlbFNlZy5zdHlsZUluZGV4O1xyXG5cclxuICAgICAgICBsZXQgdGV4dFN0eWxlOiBJSHRtbFRleHRQYXJzZXJTdGFjayB8IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5fdGV4dEFycmF5W2luZGV4XSkge1xyXG4gICAgICAgICAgICB0ZXh0U3R5bGUgPSB0aGlzLl90ZXh0QXJyYXlbaW5kZXhdLnN0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRleHRTdHlsZSkge1xyXG4gICAgICAgICAgICBsYWJlbC5jb2xvciA9IHRoaXMuX2NvbnZlcnRMaXRlcmFsQ29sb3JWYWx1ZSh0ZXh0U3R5bGUuY29sb3IgfHwgJ3doaXRlJyk7XHJcbiAgICAgICAgICAgIGxhYmVsLmlzQm9sZCA9ICEhdGV4dFN0eWxlLmJvbGQ7XHJcbiAgICAgICAgICAgIGxhYmVsLmlzSXRhbGljID0gISF0ZXh0U3R5bGUuaXRhbGljO1xyXG4gICAgICAgICAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgaW1wbGVtZW50YXRpb24sIHRoZSBpdGFsaWMgZWZmZWN0IHNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgaW50ZXJuYWwgb2YgbGFiZWwtYXNzZW1ibGVyLlxyXG4gICAgICAgICAgICAvLyBpZiAodGV4dFN0eWxlLml0YWxpYykge1xyXG4gICAgICAgICAgICAvLyAgICAgbGFiZWxOb2RlLnNrZXdYID0gMTI7XHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGxhYmVsLmlzVW5kZXJsaW5lID0gISF0ZXh0U3R5bGUudW5kZXJsaW5lO1xyXG4gICAgICAgICAgICBpZiAodGV4dFN0eWxlLm91dGxpbmUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsYWJlbE91dGxpbmUgPSBsYWJlbFNlZy5ub2RlLmdldENvbXBvbmVudChMYWJlbE91dGxpbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsYWJlbE91dGxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbE91dGxpbmUgPSBsYWJlbFNlZy5ub2RlLmFkZENvbXBvbmVudChMYWJlbE91dGxpbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxhYmVsT3V0bGluZS5jb2xvciA9IHRoaXMuX2NvbnZlcnRMaXRlcmFsQ29sb3JWYWx1ZSh0ZXh0U3R5bGUub3V0bGluZS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICBsYWJlbE91dGxpbmUud2lkdGggPSB0ZXh0U3R5bGUub3V0bGluZS53aWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRleHRTdHlsZS5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbC5mb250U2l6ZSA9IHRleHRTdHlsZS5zaXplO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsYWJlbFNlZy5jbGlja0hhbmRsZXIgPSAnJztcclxuICAgICAgICAgICAgbGFiZWxTZWcuY2xpY2tQYXJhbSA9ICcnO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnQgPSB0ZXh0U3R5bGUuZXZlbnQ7XHJcbiAgICAgICAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGFiZWxTZWcuY2xpY2tIYW5kbGVyID0gZXZlbnRbJ2NsaWNrJ10gfHwgJyc7XHJcbiAgICAgICAgICAgICAgICBsYWJlbFNlZy5jbGlja1BhcmFtID0gZXZlbnRbJ3BhcmFtJ10gfHwgJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxhYmVsLmZvbnRTaXplID0gdGhpcy5fZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYWJlbC5jYWNoZU1vZGUgPSB0aGlzLl9jYWNoZU1vZGU7XHJcblxyXG4gICAgICAgIGxldCBpc0Fzc2V0ID0gdGhpcy5fZm9udCBpbnN0YW5jZW9mIEZvbnQ7XHJcbiAgICAgICAgaWYgKGlzQXNzZXQgJiYgIXRoaXMuX2lzU3lzdGVtRm9udFVzZWQpIHtcclxuICAgICAgICAgICAgbGFiZWwuZm9udCA9IHRoaXMuX2ZvbnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGFiZWwuZm9udEZhbWlseSA9IHRoaXMuX2ZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsLnVzZVN5c3RlbUZvbnQgPSB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkO1xyXG4gICAgICAgIGxhYmVsLmxpbmVIZWlnaHQgPSB0aGlzLl9saW5lSGVpZ2h0O1xyXG5cclxuICAgICAgICBsYWJlbC51cGRhdGVSZW5kZXJEYXRhKHRydWUpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==