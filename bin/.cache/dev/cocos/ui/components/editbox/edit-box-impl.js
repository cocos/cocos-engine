(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/index.js", "../../../core/director.js", "../../../core/game.js", "../../../core/math/index.js", "../../../core/platform/index.js", "../../../core/platform/macro.js", "../../../core/utils/misc.js", "../label.js", "./tabIndexUtil.js", "./types.js", "../../../core/platform/sys.js", "../../../core/platform/visible-rect.js", "./edit-box-impl-base.js", "../../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/index.js"), require("../../../core/director.js"), require("../../../core/game.js"), require("../../../core/math/index.js"), require("../../../core/platform/index.js"), require("../../../core/platform/macro.js"), require("../../../core/utils/misc.js"), require("../label.js"), require("./tabIndexUtil.js"), require("./types.js"), require("../../../core/platform/sys.js"), require("../../../core/platform/visible-rect.js"), require("./edit-box-impl-base.js"), require("../../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.director, global.game, global.index, global.index, global.macro, global.misc, global.label, global.tabIndexUtil, global.types, global.sys, global.visibleRect, global.editBoxImplBase, global.globalExports);
    global.editBoxImpl = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _director, _game, _index2, _index3, _macro, _misc, _label, _tabIndexUtil, _types, _sys, _visibleRect, _editBoxImplBase, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EditBoxImpl = void 0;
  _visibleRect = _interopRequireDefault(_visibleRect);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  // https://segmentfault.com/q/1010000002914610
  var SCROLLY = 40;
  var LEFT_PADDING = 2;
  var DELAY_TIME = 400;

  var _matrix = new _index2.Mat4();

  var _matrix_temp = new _index2.Mat4();

  var _vec3 = new _index2.Vec3();

  var _currentEditBoxImpl = null;
  var _domCount = 0;

  var EditBoxImpl = /*#__PURE__*/function (_EditBoxImplBase) {
    _inherits(EditBoxImpl, _EditBoxImplBase);

    function EditBoxImpl() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, EditBoxImpl);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EditBoxImpl)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._delegate = null;
      _this._inputMode = -1;
      _this._inputFlag = -1;
      _this._returnType = -1;
      _this.__eventListeners = {};
      _this.__fullscreen = false;
      _this.__autoResize = false;
      _this.__orientationChanged = void 0;
      _this._edTxt = null;
      _this._isTextArea = false;
      _this._textLabelFont = null;
      _this._textLabelFontSize = null;
      _this._textLabelFontColor = null;
      _this._textLabelAlign = null;
      _this._placeholderLabelFont = null;
      _this._placeholderLabelFontSize = null;
      _this._placeholderLabelFontColor = null;
      _this._placeholderLabelAlign = null;
      _this._placeholderLineHeight = null;
      _this._placeholderStyleSheet = null;
      _this._domId = "EditBoxId_".concat(++_domCount);
      return _this;
    }

    _createClass(EditBoxImpl, [{
      key: "init",
      value: function init(delegate) {
        if (!delegate) {
          return;
        }

        this._delegate = delegate;

        if (delegate.inputMode === _types.InputMode.ANY) {
          this._createTextArea();
        } else {
          this._createInput();
        }

        _tabIndexUtil.tabIndexUtil.add(this);

        this.setTabIndex(delegate.tabIndex);

        this._initStyleSheet();

        this._registerEventListeners();

        this._addDomToGameContainer();

        this.__fullscreen = _index3.view.isAutoFullScreenEnabled();
        this.__autoResize = _index3.view._resizeWithBrowserSize;
      }
    }, {
      key: "clear",
      value: function clear() {
        this._removeEventListeners();

        this._removeDomFromGameContainer();

        _tabIndexUtil.tabIndexUtil.remove(this); // clear while editing


        if (_currentEditBoxImpl === this) {
          _currentEditBoxImpl = null;
        }

        this._delegate = null;
      }
    }, {
      key: "update",
      value: function update() {
        this._updateMatrix();
      }
    }, {
      key: "setTabIndex",
      value: function setTabIndex(index) {
        this._edTxt.tabIndex = index;

        _tabIndexUtil.tabIndexUtil.resort();
      }
    }, {
      key: "setSize",
      value: function setSize(width, height) {
        var elem = this._edTxt;

        if (elem) {
          elem.style.width = width + 'px';
          elem.style.height = height + 'px';
        }
      }
    }, {
      key: "beginEditing",
      value: function beginEditing() {
        if (_currentEditBoxImpl && _currentEditBoxImpl !== this) {
          _currentEditBoxImpl.setFocus(false);
        }

        this._editing = true;
        _currentEditBoxImpl = this;

        this._delegate._editBoxEditingDidBegan();

        this._showDom();

        this._edTxt.focus();
      }
    }, {
      key: "endEditing",
      value: function endEditing() {
        this._edTxt.blur();
      }
    }, {
      key: "_createInput",
      value: function _createInput() {
        this._isTextArea = false;
        this._edTxt = document.createElement('input');
      }
    }, {
      key: "_createTextArea",
      value: function _createTextArea() {
        this._isTextArea = true;
        this._edTxt = document.createElement('textarea');
      }
    }, {
      key: "_addDomToGameContainer",
      value: function _addDomToGameContainer() {
        if (_game.game.container && this._edTxt) {
          _game.game.container.appendChild(this._edTxt);

          document.head.appendChild(this._placeholderStyleSheet);
        }
      }
    }, {
      key: "_removeDomFromGameContainer",
      value: function _removeDomFromGameContainer() {
        var hasElem = (0, _misc.contains)(_game.game.container, this._edTxt);

        if (hasElem && this._edTxt) {
          _game.game.container.removeChild(this._edTxt);
        }

        var hasStyleSheet = (0, _misc.contains)(document.head, this._placeholderStyleSheet);

        if (hasStyleSheet) {
          document.head.removeChild(this._placeholderStyleSheet);
        }

        this._edTxt = null;
        delete this._placeholderStyleSheet;
      }
    }, {
      key: "_showDom",
      value: function _showDom() {
        this._updateMaxLength();

        this._updateInputType();

        this._updateStyleSheet();

        if (this._edTxt && this._delegate) {
          this._edTxt.style.display = '';

          this._delegate._hideLabels();
        }

        if (_sys.sys.isMobile) {
          this._showDomOnMobile();
        }
      }
    }, {
      key: "_hideDom",
      value: function _hideDom() {
        var elem = this._edTxt;

        if (elem && this._delegate) {
          elem.style.display = 'none';

          this._delegate._showLabels();
        }

        if (_sys.sys.isMobile) {
          this._hideDomOnMobile();
        }
      }
    }, {
      key: "_showDomOnMobile",
      value: function _showDomOnMobile() {
        if (_sys.sys.os !== _sys.sys.OS_ANDROID) {
          return;
        }

        if (this.__fullscreen) {
          _index3.view.enableAutoFullScreen(false);

          _index3.screen.exitFullScreen();
        }

        if (this.__autoResize) {
          _index3.view.resizeWithBrowserSize(false);
        }

        this._adjustWindowScroll();
      }
    }, {
      key: "_hideDomOnMobile",
      value: function _hideDomOnMobile() {
        var _this2 = this;

        if (_sys.sys.os === _sys.sys.OS_ANDROID) {
          if (this.__autoResize) {
            _index3.view.resizeWithBrowserSize(true);
          } // In case enter full screen when soft keyboard still showing


          setTimeout(function () {
            if (!_currentEditBoxImpl) {
              if (_this2.__fullscreen) {
                _index3.view.enableAutoFullScreen(true);
              }
            }
          }, DELAY_TIME);
        }

        this._scrollBackWindow();
      }
    }, {
      key: "_adjustWindowScroll",
      value: function _adjustWindowScroll() {
        var self = this;
        setTimeout(function () {
          if (window.scrollY < SCROLLY) {
            self._edTxt.scrollIntoView({
              block: 'start',
              inline: 'nearest',
              behavior: 'smooth'
            });
          }
        }, DELAY_TIME);
      }
    }, {
      key: "_scrollBackWindow",
      value: function _scrollBackWindow() {
        setTimeout(function () {
          if (_sys.sys.browserType === _sys.sys.BROWSER_TYPE_WECHAT && _sys.sys.os === _sys.sys.OS_IOS) {
            if (window.top) {
              window.top.scrollTo(0, 0);
            }

            return;
          }

          window.scrollTo(0, 0);
        }, DELAY_TIME);
      }
    }, {
      key: "_updateMatrix",
      value: function _updateMatrix() {
        if (!this._edTxt) {
          return;
        }

        var node = this._delegate.node;

        var scaleX = _index3.view.getScaleX();

        var scaleY = _index3.view.getScaleY();

        var viewport = _index3.view.getViewportRect();

        var dpr = _index3.view.getDevicePixelRatio();

        node.getWorldMatrix(_matrix);
        var transform = node._uiProps.uiTransformComp;

        if (transform) {
          _index2.Vec3.set(_vec3, -transform.anchorX * transform.width, -transform.anchorY * transform.height, _vec3.z);
        }

        _index2.Mat4.transform(_matrix, _matrix, _vec3);

        if (!node._uiProps.uiTransformComp) {
          return false;
        }

        var canvas = _director.director.root.ui.getScreen(node._uiProps.uiTransformComp.visibility);

        if (!canvas) {
          return;
        } // camera.getWorldToCameraMatrix(_matrix_temp);


        canvas.node.getWorldRT(_matrix_temp);
        var m12 = _matrix_temp.m12;
        var m13 = _matrix_temp.m13;
        var center = _visibleRect.default.center;
        _matrix_temp.m12 = center.x - (_matrix_temp.m00 * m12 + _matrix_temp.m04 * m13);
        _matrix_temp.m13 = center.y - (_matrix_temp.m01 * m12 + _matrix_temp.m05 * m13);

        _index2.Mat4.multiply(_matrix_temp, _matrix_temp, _matrix);

        scaleX /= dpr;
        scaleY /= dpr;
        var container = _game.game.container;
        var a = _matrix_temp.m00 * scaleX;
        var b = _matrix.m01;
        var c = _matrix.m04;
        var d = _matrix_temp.m05 * scaleY;
        var offsetX = parseInt(container && container.style.paddingLeft || '0');
        offsetX += viewport.x / dpr;
        var offsetY = parseInt(container && container.style.paddingBottom || '0');
        offsetY += viewport.y / dpr;
        var tx = _matrix_temp.m12 * scaleX + offsetX;
        var ty = _matrix_temp.m13 * scaleY + offsetY;
        var matrix = 'matrix(' + a + ',' + -b + ',' + -c + ',' + d + ',' + tx + ',' + -ty + ')';
        this._edTxt.style.transform = matrix;
        this._edTxt.style['-webkit-transform'] = matrix;
        this._edTxt.style['transform-origin'] = '0px 100% 0px';
        this._edTxt.style['-webkit-transform-origin'] = '0px 100% 0px';
      }
    }, {
      key: "_updateInputType",
      value: function _updateInputType() {
        var delegate = this._delegate;
        var inputMode = delegate.inputMode;
        var inputFlag = delegate.inputFlag;
        var returnType = delegate.returnType;
        var elem = this._edTxt;

        if (this._inputMode === inputMode && this._inputFlag === inputFlag && this._returnType === returnType) {
          return;
        } // update cache


        this._inputMode = inputMode;
        this._inputFlag = inputFlag;
        this._returnType = returnType; // FIX ME: TextArea actually dose not support password type.

        if (this._isTextArea) {
          // input flag
          var textTrans = 'none';

          if (inputFlag === _types.InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            textTrans = 'uppercase';
          } else if (inputFlag === _types.InputFlag.INITIAL_CAPS_WORD) {
            textTrans = 'capitalize';
          }

          elem.style.textTransform = textTrans;
          return;
        }

        elem = elem; // begin to updateInputType

        if (inputFlag === _types.InputFlag.PASSWORD) {
          elem.type = 'password';
          return;
        } // input mode


        var type = elem.type;

        if (inputMode === _types.InputMode.EMAIL_ADDR) {
          type = 'email';
        } else if (inputMode === _types.InputMode.NUMERIC || inputMode === _types.InputMode.DECIMAL) {
          type = 'number';
        } else if (inputMode === _types.InputMode.PHONE_NUMBER) {
          type = 'number';
          elem.pattern = '[0-9]*';
        } else if (inputMode === _types.InputMode.URL) {
          type = 'url';
        } else {
          type = 'text';

          if (returnType === _types.KeyboardReturnType.SEARCH) {
            type = 'search';
          }
        }

        elem.type = type; // input flag

        var textTransform = 'none';

        if (inputFlag === _types.InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
          textTransform = 'uppercase';
        } else if (inputFlag === _types.InputFlag.INITIAL_CAPS_WORD) {
          textTransform = 'capitalize';
        }

        elem.style.textTransform = textTransform;
      }
    }, {
      key: "_updateMaxLength",
      value: function _updateMaxLength() {
        var maxLength = this._delegate.maxLength;

        if (maxLength < 0) {
          maxLength = 65535;
        }

        this._edTxt.maxLength = maxLength;
      }
    }, {
      key: "_initStyleSheet",
      value: function _initStyleSheet() {
        if (!this._edTxt) {
          return;
        }

        var elem = this._edTxt;
        elem.style.color = '#000000';
        elem.style.border = '0px';
        elem.style.background = 'transparent';
        elem.style.width = '100%';
        elem.style.height = '100%';
        elem.style.outline = 'medium';
        elem.style.padding = '0';
        elem.style.textTransform = 'uppercase';
        elem.style.display = 'none';
        elem.style.position = 'absolute';
        elem.style.bottom = '0px';
        elem.style.left = LEFT_PADDING + 'px';
        elem.className = 'cocosEditBox';
        elem.style.fontFamily = 'Arial';
        elem.id = this._domId;

        if (!this._isTextArea) {
          elem = elem;
          elem.type = 'text';
          elem.style['-moz-appearance'] = 'textfield';
        } else {
          elem.style.resize = 'none';
          elem.style.overflowY = 'scroll';
        }

        this._placeholderStyleSheet = document.createElement('style');
      }
    }, {
      key: "_updateStyleSheet",
      value: function _updateStyleSheet() {
        var delegate = this._delegate;
        var elem = this._edTxt;

        if (elem && delegate) {
          elem.value = delegate.string;
          elem.placeholder = delegate.placeholder;

          this._updateTextLabel(delegate.textLabel);

          this._updatePlaceholderLabel(delegate.placeholderLabel);
        }
      }
    }, {
      key: "_updateTextLabel",
      value: function _updateTextLabel(textLabel) {
        if (!textLabel) {
          return;
        }

        var font = textLabel.font;

        if (font && !(font instanceof _index.BitmapFont)) {
          font = font._fontFamily;
        } else {
          font = textLabel.fontFamily;
        }

        var fontSize = textLabel.fontSize * textLabel.node.scale.y;

        if (this._textLabelFont === font && this._textLabelFontSize === fontSize && this._textLabelFontColor === textLabel.fontColor && this._textLabelAlign === textLabel.horizontalAlign) {
          return;
        }

        this._textLabelFont = font;
        this._textLabelFontSize = fontSize;
        this._textLabelFontColor = textLabel.fontColor;
        this._textLabelAlign = textLabel.horizontalAlign;

        if (!this._edTxt) {
          return;
        }

        var elem = this._edTxt;
        elem.style.fontSize = "".concat(fontSize, "px");
        elem.style.color = textLabel.color.toCSS('rgba');
        elem.style.fontFamily = font;

        switch (textLabel.horizontalAlign) {
          case _label.Label.HorizontalAlign.LEFT:
            elem.style.textAlign = 'left';
            break;

          case _label.Label.HorizontalAlign.CENTER:
            elem.style.textAlign = 'center';
            break;

          case _label.Label.HorizontalAlign.RIGHT:
            elem.style.textAlign = 'right';
            break;
        }
      }
    }, {
      key: "_updatePlaceholderLabel",
      value: function _updatePlaceholderLabel(placeholderLabel) {
        if (!placeholderLabel) {
          return;
        }

        var font = placeholderLabel.font;

        if (font && !(font instanceof _index.BitmapFont)) {
          font = placeholderLabel.font._fontFamily;
        } else {
          font = placeholderLabel.fontFamily;
        }

        var fontSize = placeholderLabel.fontSize * placeholderLabel.node.scale.y;

        if (this._placeholderLabelFont === font && this._placeholderLabelFontSize === fontSize && this._placeholderLabelFontColor === placeholderLabel.fontColor && this._placeholderLabelAlign === placeholderLabel.horizontalAlign && this._placeholderLineHeight === placeholderLabel.fontSize) {
          return;
        }

        this._placeholderLabelFont = font;
        this._placeholderLabelFontSize = fontSize;
        this._placeholderLabelFontColor = placeholderLabel.fontColor;
        this._placeholderLabelAlign = placeholderLabel.horizontalAlign;
        this._placeholderLineHeight = placeholderLabel.fontSize;
        var styleEl = this._placeholderStyleSheet;
        var fontColor = placeholderLabel.color.toCSS('rgba');
        var lineHeight = placeholderLabel.fontSize;
        var horizontalAlign = '';

        switch (placeholderLabel.horizontalAlign) {
          case _label.Label.HorizontalAlign.LEFT:
            horizontalAlign = 'left';
            break;

          case _label.Label.HorizontalAlign.CENTER:
            horizontalAlign = 'center';
            break;

          case _label.Label.HorizontalAlign.RIGHT:
            horizontalAlign = 'right';
            break;
        }

        styleEl.innerHTML = "#".concat(this._domId, "::-webkit-input-placeholder{text-transform: initial;-family: ").concat(font, ";font-size: ").concat(fontSize, "px;color: ").concat(fontColor, ";line-height: ").concat(lineHeight, "px;text-align: ").concat(horizontalAlign, ";}") + "#".concat(this._domId, "::-moz-placeholder{text-transform: initial;-family: ").concat(font, ";font-size: ").concat(fontSize, "px;color: ").concat(fontColor, ";line-height: ").concat(lineHeight, "px;text-align: ").concat(horizontalAlign, ";}") + "#".concat(this._domId, "::-ms-input-placeholder{text-transform: initial;-family: ").concat(font, ";font-size: ").concat(fontSize, "px;color: ").concat(fontColor, ";line-height: ").concat(lineHeight, "px;text-align: ").concat(horizontalAlign, ";}"); // EDGE_BUG_FIX: hide clear button, because clearing input box in Edge does not emit input event
        // issue refference: https://github.com/angular/angular/issues/26307

        if (_globalExports.legacyCC.sys.browserType === _globalExports.legacyCC.sys.BROWSER_TYPE_EDGE) {
          styleEl.innerHTML += "#".concat(this._domId, "::-ms-clear{display: none;}");
        }
      }
    }, {
      key: "_registerEventListeners",
      value: function _registerEventListeners() {
        if (!this._edTxt) {
          return;
        }

        var impl = this;
        var elem = this._edTxt;
        var inputLock = false;
        var cbs = this.__eventListeners;

        cbs.compositionStart = function () {
          inputLock = true;
        };

        cbs.compositionEnd = function () {
          inputLock = false;

          impl._delegate._editBoxTextChanged(elem.value);
        };

        cbs.onInput = function () {
          if (inputLock) {
            return;
          }

          var delegate = impl._delegate; // input of number type doesn't support maxLength attribute

          var maxLength = delegate.maxLength;

          if (maxLength >= 0) {
            elem.value = elem.value.slice(0, maxLength);
          }

          delegate._editBoxTextChanged(elem.value);
        };

        cbs.onClick = function () {
          if (impl._editing) {
            if (_sys.sys.isMobile) {
              impl._adjustWindowScroll();
            }
          }
        };

        cbs.onKeydown = function (e) {
          if (e.keyCode === _macro.macro.KEY.enter) {
            e.propagationStopped = true;

            impl._delegate._editBoxEditingReturn();

            if (!impl._isTextArea) {
              elem.blur();
            }
          } else if (e.keyCode === _macro.macro.KEY.tab) {
            e.propagationStopped = true;
            e.preventDefault();

            _tabIndexUtil.tabIndexUtil.next(impl);
          }
        };

        cbs.onBlur = function () {
          // on mobile, sometimes input element doesn't fire compositionend event
          if (_sys.sys.isMobile && inputLock) {
            cbs.compositionEnd();
          }

          impl._editing = false;
          _currentEditBoxImpl = null;

          impl._hideDom();

          impl._delegate._editBoxEditingDidEnded();
        };

        elem.addEventListener('compositionstart', cbs.compositionStart);
        elem.addEventListener('compositionend', cbs.compositionEnd);
        elem.addEventListener('input', cbs.onInput);
        elem.addEventListener('keydown', cbs.onKeydown);
        elem.addEventListener('blur', cbs.onBlur);
        elem.addEventListener('touchstart', cbs.onClick);
      }
    }, {
      key: "_removeEventListeners",
      value: function _removeEventListeners() {
        if (!this._edTxt) {
          return;
        }

        var elem = this._edTxt;
        var cbs = this.__eventListeners;
        elem.removeEventListener('compositionstart', cbs.compositionStart);
        elem.removeEventListener('compositionend', cbs.compositionEnd);
        elem.removeEventListener('input', cbs.onInput);
        elem.removeEventListener('keydown', cbs.onKeydown);
        elem.removeEventListener('blur', cbs.onBlur);
        elem.removeEventListener('touchstart', cbs.onClick);
        cbs.compositionStart = null;
        cbs.compositionEnd = null;
        cbs.onInput = null;
        cbs.onKeydown = null;
        cbs.onBlur = null;
        cbs.onClick = null;
      }
    }]);

    return EditBoxImpl;
  }(_editBoxImplBase.EditBoxImplBase);

  _exports.EditBoxImpl = EditBoxImpl;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvZWRpdGJveC9lZGl0LWJveC1pbXBsLnRzIl0sIm5hbWVzIjpbIlNDUk9MTFkiLCJMRUZUX1BBRERJTkciLCJERUxBWV9USU1FIiwiX21hdHJpeCIsIk1hdDQiLCJfbWF0cml4X3RlbXAiLCJfdmVjMyIsIlZlYzMiLCJfY3VycmVudEVkaXRCb3hJbXBsIiwiX2RvbUNvdW50IiwiRWRpdEJveEltcGwiLCJfZGVsZWdhdGUiLCJfaW5wdXRNb2RlIiwiX2lucHV0RmxhZyIsIl9yZXR1cm5UeXBlIiwiX19ldmVudExpc3RlbmVycyIsIl9fZnVsbHNjcmVlbiIsIl9fYXV0b1Jlc2l6ZSIsIl9fb3JpZW50YXRpb25DaGFuZ2VkIiwiX2VkVHh0IiwiX2lzVGV4dEFyZWEiLCJfdGV4dExhYmVsRm9udCIsIl90ZXh0TGFiZWxGb250U2l6ZSIsIl90ZXh0TGFiZWxGb250Q29sb3IiLCJfdGV4dExhYmVsQWxpZ24iLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnQiLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplIiwiX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IiLCJfcGxhY2Vob2xkZXJMYWJlbEFsaWduIiwiX3BsYWNlaG9sZGVyTGluZUhlaWdodCIsIl9wbGFjZWhvbGRlclN0eWxlU2hlZXQiLCJfZG9tSWQiLCJkZWxlZ2F0ZSIsImlucHV0TW9kZSIsIklucHV0TW9kZSIsIkFOWSIsIl9jcmVhdGVUZXh0QXJlYSIsIl9jcmVhdGVJbnB1dCIsInRhYkluZGV4VXRpbCIsImFkZCIsInNldFRhYkluZGV4IiwidGFiSW5kZXgiLCJfaW5pdFN0eWxlU2hlZXQiLCJfcmVnaXN0ZXJFdmVudExpc3RlbmVycyIsIl9hZGREb21Ub0dhbWVDb250YWluZXIiLCJ2aWV3IiwiaXNBdXRvRnVsbFNjcmVlbkVuYWJsZWQiLCJfcmVzaXplV2l0aEJyb3dzZXJTaXplIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXJzIiwiX3JlbW92ZURvbUZyb21HYW1lQ29udGFpbmVyIiwicmVtb3ZlIiwiX3VwZGF0ZU1hdHJpeCIsImluZGV4IiwicmVzb3J0Iiwid2lkdGgiLCJoZWlnaHQiLCJlbGVtIiwic3R5bGUiLCJzZXRGb2N1cyIsIl9lZGl0aW5nIiwiX2VkaXRCb3hFZGl0aW5nRGlkQmVnYW4iLCJfc2hvd0RvbSIsImZvY3VzIiwiYmx1ciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImdhbWUiLCJjb250YWluZXIiLCJhcHBlbmRDaGlsZCIsImhlYWQiLCJoYXNFbGVtIiwicmVtb3ZlQ2hpbGQiLCJoYXNTdHlsZVNoZWV0IiwiX3VwZGF0ZU1heExlbmd0aCIsIl91cGRhdGVJbnB1dFR5cGUiLCJfdXBkYXRlU3R5bGVTaGVldCIsImRpc3BsYXkiLCJfaGlkZUxhYmVscyIsInN5cyIsImlzTW9iaWxlIiwiX3Nob3dEb21Pbk1vYmlsZSIsIl9zaG93TGFiZWxzIiwiX2hpZGVEb21Pbk1vYmlsZSIsIm9zIiwiT1NfQU5EUk9JRCIsImVuYWJsZUF1dG9GdWxsU2NyZWVuIiwic2NyZWVuIiwiZXhpdEZ1bGxTY3JlZW4iLCJyZXNpemVXaXRoQnJvd3NlclNpemUiLCJfYWRqdXN0V2luZG93U2Nyb2xsIiwic2V0VGltZW91dCIsIl9zY3JvbGxCYWNrV2luZG93Iiwic2VsZiIsIndpbmRvdyIsInNjcm9sbFkiLCJzY3JvbGxJbnRvVmlldyIsImJsb2NrIiwiaW5saW5lIiwiYmVoYXZpb3IiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9XRUNIQVQiLCJPU19JT1MiLCJ0b3AiLCJzY3JvbGxUbyIsIm5vZGUiLCJzY2FsZVgiLCJnZXRTY2FsZVgiLCJzY2FsZVkiLCJnZXRTY2FsZVkiLCJ2aWV3cG9ydCIsImdldFZpZXdwb3J0UmVjdCIsImRwciIsImdldERldmljZVBpeGVsUmF0aW8iLCJnZXRXb3JsZE1hdHJpeCIsInRyYW5zZm9ybSIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwic2V0IiwiYW5jaG9yWCIsImFuY2hvclkiLCJ6IiwiY2FudmFzIiwiZGlyZWN0b3IiLCJyb290IiwidWkiLCJnZXRTY3JlZW4iLCJ2aXNpYmlsaXR5IiwiZ2V0V29ybGRSVCIsIm0xMiIsIm0xMyIsImNlbnRlciIsInZpc2libGVSZWN0IiwieCIsIm0wMCIsIm0wNCIsInkiLCJtMDEiLCJtMDUiLCJtdWx0aXBseSIsImEiLCJiIiwiYyIsImQiLCJvZmZzZXRYIiwicGFyc2VJbnQiLCJwYWRkaW5nTGVmdCIsIm9mZnNldFkiLCJwYWRkaW5nQm90dG9tIiwidHgiLCJ0eSIsIm1hdHJpeCIsImlucHV0RmxhZyIsInJldHVyblR5cGUiLCJ0ZXh0VHJhbnMiLCJJbnB1dEZsYWciLCJJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMiLCJJTklUSUFMX0NBUFNfV09SRCIsInRleHRUcmFuc2Zvcm0iLCJQQVNTV09SRCIsInR5cGUiLCJFTUFJTF9BRERSIiwiTlVNRVJJQyIsIkRFQ0lNQUwiLCJQSE9ORV9OVU1CRVIiLCJwYXR0ZXJuIiwiVVJMIiwiS2V5Ym9hcmRSZXR1cm5UeXBlIiwiU0VBUkNIIiwibWF4TGVuZ3RoIiwiY29sb3IiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwib3V0bGluZSIsInBhZGRpbmciLCJwb3NpdGlvbiIsImJvdHRvbSIsImxlZnQiLCJjbGFzc05hbWUiLCJmb250RmFtaWx5IiwiaWQiLCJyZXNpemUiLCJvdmVyZmxvd1kiLCJ2YWx1ZSIsInN0cmluZyIsInBsYWNlaG9sZGVyIiwiX3VwZGF0ZVRleHRMYWJlbCIsInRleHRMYWJlbCIsIl91cGRhdGVQbGFjZWhvbGRlckxhYmVsIiwicGxhY2Vob2xkZXJMYWJlbCIsImZvbnQiLCJCaXRtYXBGb250IiwiX2ZvbnRGYW1pbHkiLCJmb250U2l6ZSIsInNjYWxlIiwiZm9udENvbG9yIiwiaG9yaXpvbnRhbEFsaWduIiwidG9DU1MiLCJMYWJlbCIsIkhvcml6b250YWxBbGlnbiIsIkxFRlQiLCJ0ZXh0QWxpZ24iLCJDRU5URVIiLCJSSUdIVCIsInN0eWxlRWwiLCJsaW5lSGVpZ2h0IiwiaW5uZXJIVE1MIiwibGVnYWN5Q0MiLCJCUk9XU0VSX1RZUEVfRURHRSIsImltcGwiLCJpbnB1dExvY2siLCJjYnMiLCJjb21wb3NpdGlvblN0YXJ0IiwiY29tcG9zaXRpb25FbmQiLCJfZWRpdEJveFRleHRDaGFuZ2VkIiwib25JbnB1dCIsInNsaWNlIiwib25DbGljayIsIm9uS2V5ZG93biIsImUiLCJrZXlDb2RlIiwibWFjcm8iLCJLRVkiLCJlbnRlciIsInByb3BhZ2F0aW9uU3RvcHBlZCIsIl9lZGl0Qm94RWRpdGluZ1JldHVybiIsInRhYiIsInByZXZlbnREZWZhdWx0IiwibmV4dCIsIm9uQmx1ciIsIl9oaWRlRG9tIiwiX2VkaXRCb3hFZGl0aW5nRGlkRW5kZWQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkVkaXRCb3hJbXBsQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpREE7QUFDQSxNQUFNQSxPQUFPLEdBQUcsRUFBaEI7QUFDQSxNQUFNQyxZQUFZLEdBQUcsQ0FBckI7QUFDQSxNQUFNQyxVQUFVLEdBQUcsR0FBbkI7O0FBRUEsTUFBTUMsT0FBTyxHQUFHLElBQUlDLFlBQUosRUFBaEI7O0FBQ0EsTUFBTUMsWUFBWSxHQUFHLElBQUlELFlBQUosRUFBckI7O0FBQ0EsTUFBTUUsS0FBSyxHQUFHLElBQUlDLFlBQUosRUFBZDs7QUFFQSxNQUFJQyxtQkFBdUMsR0FBRyxJQUE5QztBQUVBLE1BQUlDLFNBQVMsR0FBRyxDQUFoQjs7TUFFYUMsVzs7Ozs7Ozs7Ozs7Ozs7O1lBQ0ZDLFMsR0FBNEIsSTtZQUM1QkMsVSxHQUF3QixDQUFDLEM7WUFDekJDLFUsR0FBd0IsQ0FBQyxDO1lBQ3pCQyxXLEdBQWtDLENBQUMsQztZQUNuQ0MsZ0IsR0FBd0IsRTtZQUN4QkMsWSxHQUFlLEs7WUFDZkMsWSxHQUFlLEs7WUFDZkMsb0I7WUFDQUMsTSxHQUF3RCxJO1lBQ3ZEQyxXLEdBQWMsSztZQUVk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QixNQUF6QixFQUFpQ3RCLEdBQUcsQ0FBQ2tCLE1BQXJDO0FBQ0E1SyxRQUFBQSxJQUFJLENBQUNnTCxtQkFBTCxDQUF5QixZQUF6QixFQUF1Q3RCLEdBQUcsQ0FBQ00sT0FBM0M7QUFFQU4sUUFBQUEsR0FBRyxDQUFDQyxnQkFBSixHQUF1QixJQUF2QjtBQUNBRCxRQUFBQSxHQUFHLENBQUNFLGNBQUosR0FBcUIsSUFBckI7QUFDQUYsUUFBQUEsR0FBRyxDQUFDSSxPQUFKLEdBQWMsSUFBZDtBQUNBSixRQUFBQSxHQUFHLENBQUNPLFNBQUosR0FBZ0IsSUFBaEI7QUFDQVAsUUFBQUEsR0FBRyxDQUFDa0IsTUFBSixHQUFhLElBQWI7QUFDQWxCLFFBQUFBLEdBQUcsQ0FBQ00sT0FBSixHQUFjLElBQWQ7QUFDSDs7OztJQTlrQjRCaUIsZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEyIEphbWVzIENoZW5cclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEJpdG1hcEZvbnQgfSBmcm9tICcuLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgZGlyZWN0b3IgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2RpcmVjdG9yJztcclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvZ2FtZSc7XHJcbmltcG9ydCB7IENvbG9yLCBNYXQ0LCBTaXplLCBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgc2NyZWVuLCB2aWV3IH0gZnJvbSAnLi4vLi4vLi4vY29yZS9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IG1hY3JvIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9wbGF0Zm9ybS9tYWNybyc7XHJcbmltcG9ydCB7IGNvbnRhaW5zIH0gZnJvbSAnLi4vLi4vLi4vY29yZS91dGlscy9taXNjJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi9sYWJlbCc7XHJcbmltcG9ydCB7IEVkaXRCb3ggfSBmcm9tICcuL2VkaXQtYm94JztcclxuaW1wb3J0IHsgdGFiSW5kZXhVdGlsIH0gZnJvbSAnLi90YWJJbmRleFV0aWwnO1xyXG5pbXBvcnQgeyBJbnB1dEZsYWcsIElucHV0TW9kZSwgS2V5Ym9hcmRSZXR1cm5UeXBlIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvcGxhdGZvcm0vc3lzJztcclxuaW1wb3J0IHZpc2libGVSZWN0IGZyb20gJy4uLy4uLy4uL2NvcmUvcGxhdGZvcm0vdmlzaWJsZS1yZWN0JztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBFZGl0Qm94SW1wbEJhc2UgfSBmcm9tICcuL2VkaXQtYm94LWltcGwtYmFzZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vLyBodHRwczovL3NlZ21lbnRmYXVsdC5jb20vcS8xMDEwMDAwMDAyOTE0NjEwXHJcbmNvbnN0IFNDUk9MTFkgPSA0MDtcclxuY29uc3QgTEVGVF9QQURESU5HID0gMjtcclxuY29uc3QgREVMQVlfVElNRSA9IDQwMDtcclxuXHJcbmNvbnN0IF9tYXRyaXggPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBfbWF0cml4X3RlbXAgPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBfdmVjMyA9IG5ldyBWZWMzKCk7XHJcblxyXG5sZXQgX2N1cnJlbnRFZGl0Qm94SW1wbDogRWRpdEJveEltcGwgfCBudWxsID0gbnVsbDtcclxuXHJcbmxldCBfZG9tQ291bnQgPSAwO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVkaXRCb3hJbXBsIGV4dGVuZHMgRWRpdEJveEltcGxCYXNlIHtcclxuICAgIHB1YmxpYyBfZGVsZWdhdGU6IEVkaXRCb3ggfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBfaW5wdXRNb2RlOiBJbnB1dE1vZGUgPSAtMTtcclxuICAgIHB1YmxpYyBfaW5wdXRGbGFnOiBJbnB1dEZsYWcgPSAtMTtcclxuICAgIHB1YmxpYyBfcmV0dXJuVHlwZTogS2V5Ym9hcmRSZXR1cm5UeXBlID0gLTE7XHJcbiAgICBwdWJsaWMgX19ldmVudExpc3RlbmVyczogYW55ID0ge307XHJcbiAgICBwdWJsaWMgX19mdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgX19hdXRvUmVzaXplID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgX19vcmllbnRhdGlvbkNoYW5nZWQ6IGFueTtcclxuICAgIHB1YmxpYyBfZWRUeHQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9pc1RleHRBcmVhID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGV4dExhYmVsRm9udCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90ZXh0TGFiZWxGb250U2l6ZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF90ZXh0TGFiZWxGb250Q29sb3IgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGV4dExhYmVsQWxpZ24gPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXJMYWJlbEZvbnQgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplOiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGxhY2Vob2xkZXJMYWJlbEFsaWduID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3BsYWNlaG9sZGVyTGluZUhlaWdodCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9wbGFjZWhvbGRlclN0eWxlU2hlZXQ6IGFueSA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9kb21JZCA9IGBFZGl0Qm94SWRfJHsrK19kb21Db3VudH1gO1xyXG5cclxuICAgIHB1YmxpYyBpbml0IChkZWxlZ2F0ZTogRWRpdEJveCkge1xyXG4gICAgICAgIGlmICghZGVsZWdhdGUpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkpe1xyXG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVUZXh0QXJlYSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUlucHV0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YWJJbmRleFV0aWwuYWRkKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2V0VGFiSW5kZXgoZGVsZWdhdGUudGFiSW5kZXgpO1xyXG4gICAgICAgIHRoaXMuX2luaXRTdHlsZVNoZWV0KCk7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMuX2FkZERvbVRvR2FtZUNvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9fZnVsbHNjcmVlbiA9IHZpZXcuaXNBdXRvRnVsbFNjcmVlbkVuYWJsZWQoKTtcclxuICAgICAgICB0aGlzLl9fYXV0b1Jlc2l6ZSA9IHZpZXcuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5fcmVtb3ZlRG9tRnJvbUdhbWVDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgdGFiSW5kZXhVdGlsLnJlbW92ZSh0aGlzKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYXIgd2hpbGUgZWRpdGluZ1xyXG4gICAgICAgIGlmIChfY3VycmVudEVkaXRCb3hJbXBsID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdHJpeCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUYWJJbmRleCAoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2VkVHh0IS50YWJJbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRhYkluZGV4VXRpbC5yZXNvcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0U2l6ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy5fZWRUeHQ7XHJcbiAgICAgICAgaWYgKGVsZW0pIHtcclxuICAgICAgICAgICAgZWxlbS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcclxuICAgICAgICAgICAgZWxlbS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJlZ2luRWRpdGluZyAoKSB7XHJcbiAgICAgICAgaWYgKF9jdXJyZW50RWRpdEJveEltcGwgJiYgX2N1cnJlbnRFZGl0Qm94SW1wbCAhPT0gdGhpcykge1xyXG4gICAgICAgICAgICBfY3VycmVudEVkaXRCb3hJbXBsLnNldEZvY3VzKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2VkaXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlIS5fZWRpdEJveEVkaXRpbmdEaWRCZWdhbigpO1xyXG4gICAgICAgIHRoaXMuX3Nob3dEb20oKTtcclxuICAgICAgICB0aGlzLl9lZFR4dCEuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5kRWRpdGluZyAoKSB7XHJcbiAgICAgICAgdGhpcy5fZWRUeHQhLmJsdXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVJbnB1dCAoKSB7XHJcbiAgICAgICAgdGhpcy5faXNUZXh0QXJlYSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2VkVHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVUZXh0QXJlYSAoKSB7XHJcbiAgICAgICAgdGhpcy5faXNUZXh0QXJlYSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZWRUeHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkZERvbVRvR2FtZUNvbnRhaW5lciAoKSB7XHJcbiAgICAgICAgaWYgKGdhbWUuY29udGFpbmVyICYmIHRoaXMuX2VkVHh0KSB7XHJcbiAgICAgICAgICAgIGdhbWUuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2VkVHh0KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW1vdmVEb21Gcm9tR2FtZUNvbnRhaW5lciAoKSB7XHJcbiAgICAgICAgY29uc3QgaGFzRWxlbSA9IGNvbnRhaW5zKGdhbWUuY29udGFpbmVyLCB0aGlzLl9lZFR4dCk7XHJcbiAgICAgICAgaWYgKGhhc0VsZW0gJiYgdGhpcy5fZWRUeHQpIHtcclxuICAgICAgICAgICAgZ2FtZS5jb250YWluZXIhLnJlbW92ZUNoaWxkKHRoaXMuX2VkVHh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaGFzU3R5bGVTaGVldCA9IGNvbnRhaW5zKGRvY3VtZW50LmhlYWQsIHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldCk7XHJcbiAgICAgICAgaWYgKGhhc1N0eWxlU2hlZXQpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZCh0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZWRUeHQgPSBudWxsO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd0RvbSAoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTWF4TGVuZ3RoKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW5wdXRUeXBlKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3R5bGVTaGVldCgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9lZFR4dCAmJiB0aGlzLl9kZWxlZ2F0ZSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkVHh0LnN0eWxlLmRpc3BsYXkgPSAnJztcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUuX2hpZGVMYWJlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN5cy5pc01vYmlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zaG93RG9tT25Nb2JpbGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGlkZURvbSAoKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuX2VkVHh0O1xyXG4gICAgICAgIGlmIChlbGVtICYmIHRoaXMuX2RlbGVnYXRlKSB7XHJcbiAgICAgICAgICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUuX3Nob3dMYWJlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN5cy5pc01vYmlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9oaWRlRG9tT25Nb2JpbGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd0RvbU9uTW9iaWxlICgpIHtcclxuICAgICAgICBpZiAoc3lzLm9zICE9PSBzeXMuT1NfQU5EUk9JRCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fX2Z1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgdmlldy5lbmFibGVBdXRvRnVsbFNjcmVlbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHNjcmVlbi5leGl0RnVsbFNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fX2F1dG9SZXNpemUpIHtcclxuICAgICAgICAgICAgdmlldy5yZXNpemVXaXRoQnJvd3NlclNpemUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWRqdXN0V2luZG93U2Nyb2xsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGlkZURvbU9uTW9iaWxlICgpIHtcclxuICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfQU5EUk9JRCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2F1dG9SZXNpemUpIHtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVzaXplV2l0aEJyb3dzZXJTaXplKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEluIGNhc2UgZW50ZXIgZnVsbCBzY3JlZW4gd2hlbiBzb2Z0IGtleWJvYXJkIHN0aWxsIHNob3dpbmdcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIV9jdXJyZW50RWRpdEJveEltcGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2Z1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5lbmFibGVBdXRvRnVsbFNjcmVlbih0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIERFTEFZX1RJTUUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsQmFja1dpbmRvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkanVzdFdpbmRvd1Njcm9sbCAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA8IFNDUk9MTFkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2VkVHh0IS5zY3JvbGxJbnRvVmlldyh7YmxvY2s6ICdzdGFydCcsIGlubGluZTogJ25lYXJlc3QnLCBiZWhhdmlvcjogJ3Ntb290aCd9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIERFTEFZX1RJTUUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Njcm9sbEJhY2tXaW5kb3cgKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX1dFQ0hBVCAmJiBzeXMub3MgPT09IHN5cy5PU19JT1MpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cudG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnRvcC5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcclxuICAgICAgICB9LCBERUxBWV9USU1FKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVNYXRyaXggKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWRUeHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuX2RlbGVnYXRlIS5ub2RlO1xyXG4gICAgICAgIGxldCBzY2FsZVggPSB2aWV3LmdldFNjYWxlWCgpO1xyXG4gICAgICAgIGxldCBzY2FsZVkgPSB2aWV3LmdldFNjYWxlWSgpO1xyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0ID0gdmlldy5nZXRWaWV3cG9ydFJlY3QoKTtcclxuICAgICAgICBjb25zdCBkcHIgPSB2aWV3LmdldERldmljZVBpeGVsUmF0aW8oKTtcclxuXHJcbiAgICAgICAgbm9kZS5nZXRXb3JsZE1hdHJpeChfbWF0cml4KTtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBub2RlIS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXA7XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBWZWMzLnNldChfdmVjMywgLXRyYW5zZm9ybS5hbmNob3JYICogdHJhbnNmb3JtLndpZHRoLCAtdHJhbnNmb3JtLmFuY2hvclkgKiB0cmFuc2Zvcm0uaGVpZ2h0LCBfdmVjMy56KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE1hdDQudHJhbnNmb3JtKF9tYXRyaXgsIF9tYXRyaXgsIF92ZWMzKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYW52YXMgPSBkaXJlY3Rvci5yb290IS51aS5nZXRTY3JlZW4obm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAudmlzaWJpbGl0eSk7XHJcbiAgICAgICAgaWYgKCFjYW52YXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2FtZXJhLmdldFdvcmxkVG9DYW1lcmFNYXRyaXgoX21hdHJpeF90ZW1wKTtcclxuICAgICAgICBjYW52YXMubm9kZS5nZXRXb3JsZFJUKF9tYXRyaXhfdGVtcCk7XHJcbiAgICAgICAgY29uc3QgbTEyID0gX21hdHJpeF90ZW1wLm0xMjtcclxuICAgICAgICBjb25zdCBtMTMgPSBfbWF0cml4X3RlbXAubTEzO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHZpc2libGVSZWN0LmNlbnRlcjtcclxuICAgICAgICBfbWF0cml4X3RlbXAubTEyID0gY2VudGVyLnggLSAoX21hdHJpeF90ZW1wLm0wMCAqIG0xMiArIF9tYXRyaXhfdGVtcC5tMDQgKiBtMTMpO1xyXG4gICAgICAgIF9tYXRyaXhfdGVtcC5tMTMgPSBjZW50ZXIueSAtIChfbWF0cml4X3RlbXAubTAxICogbTEyICsgX21hdHJpeF90ZW1wLm0wNSAqIG0xMyk7XHJcblxyXG4gICAgICAgIE1hdDQubXVsdGlwbHkoX21hdHJpeF90ZW1wLCBfbWF0cml4X3RlbXAsIF9tYXRyaXgpO1xyXG4gICAgICAgIHNjYWxlWCAvPSBkcHI7XHJcbiAgICAgICAgc2NhbGVZIC89IGRwcjtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZ2FtZS5jb250YWluZXI7XHJcbiAgICAgICAgY29uc3QgYSA9IF9tYXRyaXhfdGVtcC5tMDAgKiBzY2FsZVg7XHJcbiAgICAgICAgY29uc3QgYiA9IF9tYXRyaXgubTAxO1xyXG4gICAgICAgIGNvbnN0IGMgPSBfbWF0cml4Lm0wNDtcclxuICAgICAgICBjb25zdCBkID0gX21hdHJpeF90ZW1wLm0wNSAqIHNjYWxlWTtcclxuXHJcbiAgICAgICAgbGV0IG9mZnNldFggPSBwYXJzZUludCgoY29udGFpbmVyICYmIGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nTGVmdCkgfHwgJzAnKTtcclxuICAgICAgICBvZmZzZXRYICs9IHZpZXdwb3J0LnggLyBkcHI7XHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSBwYXJzZUludCgoY29udGFpbmVyICYmIGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nQm90dG9tKSB8fCAnMCcpO1xyXG4gICAgICAgIG9mZnNldFkgKz0gdmlld3BvcnQueSAvIGRwcjtcclxuICAgICAgICBjb25zdCB0eCA9IF9tYXRyaXhfdGVtcC5tMTIgKiBzY2FsZVggKyBvZmZzZXRYO1xyXG4gICAgICAgIGNvbnN0IHR5ID0gX21hdHJpeF90ZW1wLm0xMyAqIHNjYWxlWSArIG9mZnNldFk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9ICdtYXRyaXgoJyArIGEgKyAnLCcgKyAtYiArICcsJyArIC1jICsgJywnICsgZCArICcsJyArIHR4ICsgJywnICsgLXR5ICsgJyknO1xyXG4gICAgICAgIHRoaXMuX2VkVHh0LnN0eWxlLnRyYW5zZm9ybSA9IG1hdHJpeDtcclxuICAgICAgICB0aGlzLl9lZFR4dC5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9IG1hdHJpeDtcclxuICAgICAgICB0aGlzLl9lZFR4dC5zdHlsZVsndHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICAgICAgdGhpcy5fZWRUeHQuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlSW5wdXRUeXBlICgpIHtcclxuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRoaXMuX2RlbGVnYXRlO1xyXG4gICAgICAgIGNvbnN0IGlucHV0TW9kZSA9IGRlbGVnYXRlIS5pbnB1dE1vZGU7XHJcbiAgICAgICAgY29uc3QgaW5wdXRGbGFnID0gZGVsZWdhdGUhLmlucHV0RmxhZztcclxuICAgICAgICBjb25zdCByZXR1cm5UeXBlID0gZGVsZWdhdGUhLnJldHVyblR5cGU7XHJcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lZFR4dDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0TW9kZSA9PT0gaW5wdXRNb2RlICYmXHJcbiAgICAgICAgICAgIHRoaXMuX2lucHV0RmxhZyA9PT0gaW5wdXRGbGFnICYmXHJcbiAgICAgICAgICAgIHRoaXMuX3JldHVyblR5cGUgPT09IHJldHVyblR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGNhY2hlXHJcbiAgICAgICAgdGhpcy5faW5wdXRNb2RlID0gaW5wdXRNb2RlO1xyXG4gICAgICAgIHRoaXMuX2lucHV0RmxhZyA9IGlucHV0RmxhZztcclxuICAgICAgICB0aGlzLl9yZXR1cm5UeXBlID0gcmV0dXJuVHlwZTtcclxuXHJcbiAgICAgICAgLy8gRklYIE1FOiBUZXh0QXJlYSBhY3R1YWxseSBkb3NlIG5vdCBzdXBwb3J0IHBhc3N3b3JkIHR5cGUuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVGV4dEFyZWEpIHtcclxuICAgICAgICAgICAgLy8gaW5wdXQgZmxhZ1xyXG4gICAgICAgICAgICBsZXQgdGV4dFRyYW5zID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnMgPSAndXBwZXJjYXNlJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xyXG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zID0gJ2NhcGl0YWxpemUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW0hLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSB0ZXh0VHJhbnM7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsZW0gPSBlbGVtIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgLy8gYmVnaW4gdG8gdXBkYXRlSW5wdXRUeXBlXHJcbiAgICAgICAgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLlBBU1NXT1JEKSB7XHJcbiAgICAgICAgICAgIGVsZW0udHlwZSA9ICdwYXNzd29yZCc7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlucHV0IG1vZGVcclxuICAgICAgICBsZXQgdHlwZSA9IGVsZW0udHlwZTtcclxuICAgICAgICBpZiAoaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuRU1BSUxfQUREUikge1xyXG4gICAgICAgICAgICB0eXBlID0gJ2VtYWlsJztcclxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLk5VTUVSSUMgfHwgaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuREVDSU1BTCkge1xyXG4gICAgICAgICAgICB0eXBlID0gJ251bWJlcic7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dE1vZGUgPT09IElucHV0TW9kZS5QSE9ORV9OVU1CRVIpIHtcclxuICAgICAgICAgICAgdHlwZSA9ICdudW1iZXInO1xyXG4gICAgICAgICAgICBlbGVtLnBhdHRlcm4gPSAnWzAtOV0qJztcclxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLlVSTCkge1xyXG4gICAgICAgICAgICB0eXBlID0gJ3VybCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXR1cm5UeXBlID09PSBLZXlib2FyZFJldHVyblR5cGUuU0VBUkNIKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3NlYXJjaCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbSEudHlwZSA9IHR5cGU7XHJcblxyXG4gICAgICAgIC8vIGlucHV0IGZsYWdcclxuICAgICAgICBsZXQgdGV4dFRyYW5zZm9ybSA9ICdub25lJztcclxuICAgICAgICBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTKSB7XHJcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJztcclxuICAgICAgICB9IGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19XT1JEKSB7XHJcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAnY2FwaXRhbGl6ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW0uc3R5bGUudGV4dFRyYW5zZm9ybSA9IHRleHRUcmFuc2Zvcm07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlTWF4TGVuZ3RoICgpIHtcclxuICAgICAgICBsZXQgbWF4TGVuZ3RoID0gdGhpcy5fZGVsZWdhdGUhLm1heExlbmd0aDtcclxuICAgICAgICBpZiAobWF4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICBtYXhMZW5ndGggPSA2NTUzNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZWRUeHQhLm1heExlbmd0aCA9IG1heExlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbml0U3R5bGVTaGVldCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lZFR4dCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWRUeHQ7XHJcbiAgICAgICAgZWxlbS5zdHlsZS5jb2xvciA9ICcjMDAwMDAwJztcclxuICAgICAgICBlbGVtLnN0eWxlLmJvcmRlciA9ICcwcHgnO1xyXG4gICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XHJcbiAgICAgICAgZWxlbS5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgICAgICBlbGVtLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgICBlbGVtLnN0eWxlLm91dGxpbmUgPSAnbWVkaXVtJztcclxuICAgICAgICBlbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XHJcbiAgICAgICAgZWxlbS5zdHlsZS50ZXh0VHJhbnNmb3JtID0gJ3VwcGVyY2FzZSc7XHJcbiAgICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGVsZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgIGVsZW0uc3R5bGUuYm90dG9tID0gJzBweCc7XHJcbiAgICAgICAgZWxlbS5zdHlsZS5sZWZ0ID0gTEVGVF9QQURESU5HICsgJ3B4JztcclxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9ICdjb2Nvc0VkaXRCb3gnO1xyXG4gICAgICAgIGVsZW0uc3R5bGUuZm9udEZhbWlseSA9ICdBcmlhbCc7XHJcbiAgICAgICAgZWxlbS5pZCA9IHRoaXMuX2RvbUlkO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzVGV4dEFyZWEpIHtcclxuICAgICAgICAgICAgZWxlbSA9IGVsZW0gYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgICAgZWxlbS50eXBlID0gJ3RleHQnO1xyXG4gICAgICAgICAgICBlbGVtLnN0eWxlWyctbW96LWFwcGVhcmFuY2UnXSA9ICd0ZXh0ZmllbGQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbS5zdHlsZS5yZXNpemUgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIGVsZW0uc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVN0eWxlU2hlZXQgKCkge1xyXG4gICAgICAgIGNvbnN0IGRlbGVnYXRlID0gdGhpcy5fZGVsZWdhdGU7XHJcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuX2VkVHh0O1xyXG4gICAgICAgIGlmIChlbGVtICYmIGRlbGVnYXRlKXtcclxuICAgICAgICAgICAgZWxlbS52YWx1ZSA9IGRlbGVnYXRlLnN0cmluZztcclxuICAgICAgICAgICAgZWxlbS5wbGFjZWhvbGRlciA9IGRlbGVnYXRlLnBsYWNlaG9sZGVyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGV4dExhYmVsKGRlbGVnYXRlLnRleHRMYWJlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwoZGVsZWdhdGUucGxhY2Vob2xkZXJMYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVRleHRMYWJlbCAodGV4dExhYmVsKSB7XHJcbiAgICAgICAgaWYgKCF0ZXh0TGFiZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvbnQgPSB0ZXh0TGFiZWwuZm9udDtcclxuICAgICAgICBpZiAoZm9udCAmJiAhKGZvbnQgaW5zdGFuY2VvZiBCaXRtYXBGb250KSkge1xyXG4gICAgICAgICAgICBmb250ID0gZm9udC5fZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvbnQgPSB0ZXh0TGFiZWwuZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZvbnRTaXplID0gdGV4dExhYmVsLmZvbnRTaXplICogdGV4dExhYmVsLm5vZGUuc2NhbGUueTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHRMYWJlbEZvbnQgPT09IGZvbnRcclxuICAgICAgICAgICAgJiYgdGhpcy5fdGV4dExhYmVsRm9udFNpemUgPT09IGZvbnRTaXplXHJcbiAgICAgICAgICAgICYmIHRoaXMuX3RleHRMYWJlbEZvbnRDb2xvciA9PT0gdGV4dExhYmVsLmZvbnRDb2xvclxyXG4gICAgICAgICAgICAmJiB0aGlzLl90ZXh0TGFiZWxBbGlnbiA9PT0gdGV4dExhYmVsLmhvcml6b250YWxBbGlnbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGV4dExhYmVsRm9udCA9IGZvbnQ7XHJcbiAgICAgICAgdGhpcy5fdGV4dExhYmVsRm9udFNpemUgPSBmb250U2l6ZTtcclxuICAgICAgICB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPSB0ZXh0TGFiZWwuZm9udENvbG9yO1xyXG4gICAgICAgIHRoaXMuX3RleHRMYWJlbEFsaWduID0gdGV4dExhYmVsLmhvcml6b250YWxBbGlnbjtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9lZFR4dCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy5fZWRUeHQ7XHJcbiAgICAgICAgZWxlbS5zdHlsZS5mb250U2l6ZSA9IGAke2ZvbnRTaXplfXB4YDtcclxuICAgICAgICBlbGVtLnN0eWxlLmNvbG9yID0gdGV4dExhYmVsLmNvbG9yLnRvQ1NTKCdyZ2JhJyk7XHJcbiAgICAgICAgZWxlbS5zdHlsZS5mb250RmFtaWx5ID0gZm9udDtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0ZXh0TGFiZWwuaG9yaXpvbnRhbEFsaWduKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIExhYmVsLkhvcml6b250YWxBbGlnbi5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgZWxlbS5zdHlsZS50ZXh0QWxpZ24gPSAncmlnaHQnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwgKHBsYWNlaG9sZGVyTGFiZWwpIHtcclxuICAgICAgICBpZiAoIXBsYWNlaG9sZGVyTGFiZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvbnQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnQ7XHJcbiAgICAgICAgaWYgKGZvbnQgJiYgIShmb250IGluc3RhbmNlb2YgQml0bWFwRm9udCkpIHtcclxuICAgICAgICAgICAgZm9udCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udC5fZm9udEZhbWlseTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvbnQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY29uc3QgZm9udFNpemUgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplICogcGxhY2Vob2xkZXJMYWJlbC5ub2RlLnNjYWxlLnk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udCA9PT0gZm9udFxyXG4gICAgICAgICAgICAmJiB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udFNpemUgPT09IGZvbnRTaXplXHJcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IgPT09IHBsYWNlaG9sZGVyTGFiZWwuZm9udENvbG9yXHJcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxBbGlnbiA9PT0gcGxhY2Vob2xkZXJMYWJlbC5ob3Jpem9udGFsQWxpZ25cclxuICAgICAgICAgICAgJiYgdGhpcy5fcGxhY2Vob2xkZXJMaW5lSGVpZ2h0ID09PSBwbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udCA9IGZvbnQ7XHJcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplID0gZm9udFNpemU7XHJcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRDb2xvciA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udENvbG9yO1xyXG4gICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxBbGlnbiA9IHBsYWNlaG9sZGVyTGFiZWwuaG9yaXpvbnRhbEFsaWduO1xyXG4gICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyTGluZUhlaWdodCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemU7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0eWxlRWwgPSB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQ7XHJcbiAgICAgICAgY29uc3QgZm9udENvbG9yID0gcGxhY2Vob2xkZXJMYWJlbC5jb2xvci50b0NTUygncmdiYScpO1xyXG4gICAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplO1xyXG5cclxuICAgICAgICBsZXQgaG9yaXpvbnRhbEFsaWduID0gJyc7XHJcbiAgICAgICAgc3dpdGNoIChwbGFjZWhvbGRlckxhYmVsLmhvcml6b250YWxBbGlnbikge1xyXG4gICAgICAgICAgICBjYXNlIExhYmVsLkhvcml6b250YWxBbGlnbi5MRUZUOlxyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ2xlZnQnO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLkNFTlRFUjpcclxuICAgICAgICAgICAgICAgIGhvcml6b250YWxBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ3JpZ2h0JztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3R5bGVFbCEuaW5uZXJIVE1MID0gYCMke3RoaXMuX2RvbUlkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlcnt0ZXh0LXRyYW5zZm9ybTogaW5pdGlhbDstZmFtaWx5OiAke2ZvbnR9O2ZvbnQtc2l6ZTogJHtmb250U2l6ZX1weDtjb2xvcjogJHtmb250Q29sb3J9O2xpbmUtaGVpZ2h0OiAke2xpbmVIZWlnaHR9cHg7dGV4dC1hbGlnbjogJHtob3Jpem9udGFsQWxpZ259O31gICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAjJHt0aGlzLl9kb21JZH06Oi1tb3otcGxhY2Vob2xkZXJ7dGV4dC10cmFuc2Zvcm06IGluaXRpYWw7LWZhbWlseTogJHtmb250fTtmb250LXNpemU6ICR7Zm9udFNpemV9cHg7Y29sb3I6ICR7Zm9udENvbG9yfTtsaW5lLWhlaWdodDogJHtsaW5lSGVpZ2h0fXB4O3RleHQtYWxpZ246ICR7aG9yaXpvbnRhbEFsaWdufTt9YCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgIyR7dGhpcy5fZG9tSWR9OjotbXMtaW5wdXQtcGxhY2Vob2xkZXJ7dGV4dC10cmFuc2Zvcm06IGluaXRpYWw7LWZhbWlseTogJHtmb250fTtmb250LXNpemU6ICR7Zm9udFNpemV9cHg7Y29sb3I6ICR7Zm9udENvbG9yfTtsaW5lLWhlaWdodDogJHtsaW5lSGVpZ2h0fXB4O3RleHQtYWxpZ246ICR7aG9yaXpvbnRhbEFsaWdufTt9YDtcclxuICAgICAgICAvLyBFREdFX0JVR19GSVg6IGhpZGUgY2xlYXIgYnV0dG9uLCBiZWNhdXNlIGNsZWFyaW5nIGlucHV0IGJveCBpbiBFZGdlIGRvZXMgbm90IGVtaXQgaW5wdXQgZXZlbnRcclxuICAgICAgICAvLyBpc3N1ZSByZWZmZXJlbmNlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNjMwN1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5zeXMuYnJvd3NlclR5cGUgPT09IGxlZ2FjeUNDLnN5cy5CUk9XU0VSX1RZUEVfRURHRSkge1xyXG4gICAgICAgICAgICBzdHlsZUVsIS5pbm5lckhUTUwgKz0gYCMke3RoaXMuX2RvbUlkfTo6LW1zLWNsZWFye2Rpc3BsYXk6IG5vbmU7fWA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWRUeHQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbXBsID0gdGhpcztcclxuICAgICAgICBjb25zdCBlbGVtID0gdGhpcy5fZWRUeHQ7XHJcbiAgICAgICAgbGV0IGlucHV0TG9jayA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGNicyA9IHRoaXMuX19ldmVudExpc3RlbmVycztcclxuXHJcbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uU3RhcnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlucHV0TG9jayA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uRW5kID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnB1dExvY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW1wbC5fZGVsZWdhdGUhLl9lZGl0Qm94VGV4dENoYW5nZWQoZWxlbSEudmFsdWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNicy5vbklucHV0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXRMb2NrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBpbXBsLl9kZWxlZ2F0ZTtcclxuICAgICAgICAgICAgLy8gaW5wdXQgb2YgbnVtYmVyIHR5cGUgZG9lc24ndCBzdXBwb3J0IG1heExlbmd0aCBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgY29uc3QgbWF4TGVuZ3RoID0gZGVsZWdhdGUhLm1heExlbmd0aDtcclxuICAgICAgICAgICAgaWYgKG1heExlbmd0aCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnZhbHVlID0gZWxlbS52YWx1ZS5zbGljZSgwLCBtYXhMZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGVnYXRlIS5fZWRpdEJveFRleHRDaGFuZ2VkKGVsZW0hLnZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYnMub25DbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltcGwuX2VkaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzeXMuaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbXBsLl9hZGp1c3RXaW5kb3dTY3JvbGwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNicy5vbktleWRvd24gPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBtYWNyby5LRVkuZW50ZXIpIHtcclxuICAgICAgICAgICAgICAgIGUucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlIS5fZWRpdEJveEVkaXRpbmdSZXR1cm4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWltcGwuX2lzVGV4dEFyZWEpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmJsdXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IG1hY3JvLktFWS50YWIpIHtcclxuICAgICAgICAgICAgICAgIGUucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YWJJbmRleFV0aWwubmV4dChpbXBsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNicy5vbkJsdXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIG9uIG1vYmlsZSwgc29tZXRpbWVzIGlucHV0IGVsZW1lbnQgZG9lc24ndCBmaXJlIGNvbXBvc2l0aW9uZW5kIGV2ZW50XHJcbiAgICAgICAgICAgIGlmIChzeXMuaXNNb2JpbGUgJiYgaW5wdXRMb2NrKSB7XHJcbiAgICAgICAgICAgICAgICBjYnMuY29tcG9zaXRpb25FbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbXBsLl9lZGl0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwgPSBudWxsO1xyXG4gICAgICAgICAgICBpbXBsLl9oaWRlRG9tKCk7XHJcbiAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlIS5fZWRpdEJveEVkaXRpbmdEaWRFbmRlZCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcsIGNicy5jb21wb3NpdGlvblN0YXJ0KTtcclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgY2JzLmNvbXBvc2l0aW9uRW5kKTtcclxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2JzLm9uSW5wdXQpO1xyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNicy5vbktleWRvd24pO1xyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGNicy5vbkJsdXIpO1xyXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGNicy5vbkNsaWNrKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX3JlbW92ZUV2ZW50TGlzdGVuZXJzICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2VkVHh0KXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZWxlbSA9IHRoaXMuX2VkVHh0O1xyXG4gICAgICAgIGNvbnN0IGNicyA9IHRoaXMuX19ldmVudExpc3RlbmVycztcclxuXHJcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JywgY2JzLmNvbXBvc2l0aW9uU3RhcnQpO1xyXG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCBjYnMuY29tcG9zaXRpb25FbmQpO1xyXG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjYnMub25JbnB1dCk7XHJcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgY2JzLm9uS2V5ZG93bik7XHJcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgY2JzLm9uQmx1cik7XHJcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgY2JzLm9uQ2xpY2spO1xyXG5cclxuICAgICAgICBjYnMuY29tcG9zaXRpb25TdGFydCA9IG51bGw7XHJcbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uRW5kID0gbnVsbDtcclxuICAgICAgICBjYnMub25JbnB1dCA9IG51bGw7XHJcbiAgICAgICAgY2JzLm9uS2V5ZG93biA9IG51bGw7XHJcbiAgICAgICAgY2JzLm9uQmx1ciA9IG51bGw7XHJcbiAgICAgICAgY2JzLm9uQ2xpY2sgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==