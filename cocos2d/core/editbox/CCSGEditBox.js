/*global _ccsg */

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2012 James Chen
 Copyright (c) 2011-2012 cocos2d-x.org

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// https://segmentfault.com/q/1010000002914610
var SCROLLY = 40;
var TIMER_NAME = 400;
var LEFT_PADDING = 2;
var Utils = require('../platform/utils');

function adjustEditBoxPosition (editBox) {
    var worldPos = editBox.convertToWorldSpace(cc.p(0,0));
    var windowHeight = cc.visibleRect.height;
    var windowWidth = cc.visibleRect.width;
    var factor = 0.5;
    if(windowWidth > windowHeight) {
        factor = 0.7;
    }
    setTimeout(function() {
        if(window.scrollY < SCROLLY && worldPos.y < windowHeight * factor) {
            var scrollOffset = windowHeight * factor - worldPos.y - window.scrollY;
            if (scrollOffset < 35) scrollOffset = 35;
            if (scrollOffset > 320) scrollOffset = 320;
            window.scrollTo(scrollOffset, scrollOffset);
        }
    }, TIMER_NAME);
}

var capitalize = function(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * Enum for keyboard return types
 * @readonly
 * @enum cc.EditBox.KeyboardReturnType
 */
var KeyboardReturnType = cc.Enum({
    /**
     * @property {Number} DEFAULT
     */
    DEFAULT: 0,
    /**
     * @property {Number} DONE
     */
    DONE: 1,
    /**
     * @property {Number} SEND
     */
    SEND: 2,
    /**
     * @property {Number} SEARCH
     */
    SEARCH: 3,
    /**
     * @property {Number} GO
     */
    GO: 4
});

/**
 * The EditBox's InputMode defines the type of text that the user is allowed to enter
 * @readonly
 * @enum {number}
 * @memberof cc.EditBox.InputMode
 */
var InputMode = cc.Enum({

    /**
     * @property {Number} ANY
     */
    ANY: 0,

    /**
     * The user is allowed to enter an e-mail address.
     * @property {Number} EMAIL_ADDR
     */
    EMAIL_ADDR: 1,

    /**
     * The user is allowed to enter an integer value.
     * @property {Number} NUMERIC
     */
    NUMERIC: 2,

    /**
     * The user is allowed to enter a phone number.
     * @property {Number} PHONE_NUMBER
     */
    PHONE_NUMBER: 3,

    /**
     * The user is allowed to enter a URL.
     * @property {Number} URL
     */
    URL: 4,

    /**
     * The user is allowed to enter a real number value.
     * This extends kEditBoxInputModeNumeric by allowing a decimal point.
     * @property {Number} DECIMAL
     */
    DECIMAL: 5,

    /**
     * The user is allowed to enter any text, except for line breaks.
     * @property {Number} SINGLE_LINE
     */
    SINGLE_LINE: 6
});

/**
 * Enum for the EditBox's input flags
 * @readonly
 * @enum cc.EditBox.InputFlag
 */
var InputFlag = cc.Enum({
    /**
     * Indicates that the text entered is confidential data that should be
     * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
     *
     * @property {Number} PASSWORD
     */
    PASSWORD: 0,

    /**
     * Indicates that the text entered is sensitive data that the
     * implementation must never store into a dictionary or table for use
     * in predictive, auto-completing, or other accelerated input schemes.
     * A credit card number is an example of sensitive data.
     *
     * @property {Number} SENSITIVE
     */
    SENSITIVE: 1,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each word should be capitalized.
     *
     * @property {Number} INITIAL_CAPS_WORD
     */
    INITIAL_CAPS_WORD: 2,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each sentence should be capitalized.
     *
     * @property {Number} INITIAL_CAPS_SENTENCE
     */
    INITIAL_CAPS_SENTENCE: 3,

    /**
     * Capitalize all characters automatically.
     *
     * @property {Number} INITIAL_CAPS_ALL_CHARACTERS
     */
    INITIAL_CAPS_ALL_CHARACTERS: 4,

    /**
     * Don't do anything with the input text.
     * @property {Number} DEFAULT
     */
    DEFAULT: 5
});

/**
 * @class
 * @extends cc._Class
 */
cc.EditBoxDelegate = cc._Class.extend({
    /**
     * This method is called when an edit box gains focus after keyboard is shown.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidBegan: function (sender) {
    },

    /**
     * This method is called when an edit box loses focus after keyboard is hidden.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidEnded: function (sender) {
    },

    /**
     * This method is called when the edit box text was changed.
     * @param {cc.EditBox} sender
     * @param {String} text
     */
    editBoxTextChanged: function (sender, text) {
    },

    /**
     * This method is called when the return button was pressed.
     * @param {cc.EditBox} sender
     */
    editBoxEditingReturn: function (sender) {
    }
});


/**
 * <p>cc.EditBox is a brief Class for edit box.<br/>
 * You can use this widget to gather small amounts of text from the user.</p>
 *
 */
_ccsg.EditBox = _ccsg.Node.extend({
    _backgroundSprite: null,
    _delegate: null,
    _editBoxInputMode: InputMode.ANY,
    _editBoxInputFlag: InputFlag.DEFAULT,
    _keyboardReturnType: KeyboardReturnType.DEFAULT,
    _maxLength: 50,
    _text: '',
    _placeholderText: '',
    _alwaysOnTop: false,
    _placeholderFontName: '',
    _placeholderFontSize: 14,
    __fullscreen: false,
    __autoResize: false,
    _placeholderColor: null,
    _className: 'EditBox',

    ctor: function (size, normal9SpriteBg) {
        _ccsg.Node.prototype.ctor.call(this);

        this._textColor = cc.Color.WHITE;
        this._placeholderColor = cc.Color.GRAY;

        this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg);
        this._renderCmd._createLabels();
    },

    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            return new _ccsg.EditBox.CanvasRenderCmd(this);
        } else {
            return new _ccsg.EditBox.WebGLRenderCmd(this);
        }
    },

    setContentSize: function (width, height) {
        if (width.width !== undefined && width.height !== undefined) {
            height = width.height;
            width = width.width;
        }
        _ccsg.Node.prototype.setContentSize.call(this, width, height);
        this._updateEditBoxSize(width, height);
    },

    setVisible: function ( visible ) {
        _ccsg.Node.prototype.setVisible.call(this, visible);
        this._renderCmd.updateVisibility();
    },

    createDomElementIfNeeded: function () {
        if(!this._renderCmd._edTxt) {
            this._renderCmd._createDomTextArea();
        }
    },

    setTabIndex: function(index) {
        if(this._renderCmd._edTxt) {
            this._renderCmd._edTxt.tabIndex = index;
        }
    },

    getTabIndex: function() {
        if(this._renderCmd._edTxt) {
            return this._renderCmd._edTxt.tabIndex;
        }
        cc.warnID(4700);
        return -1;
    },

    setFocus: function() {
        if(this._renderCmd._edTxt) {
            this._renderCmd._edTxt.focus();
        }
    },

    isFocused: function() {
        if(this._renderCmd._edTxt) {
            return document.activeElement === this._renderCmd._edTxt;
        }
        cc.warnID(4700);
        return false;
    },

    stayOnTop: function (flag) {
        if(this._alwaysOnTop === flag) return;

        this._alwaysOnTop = flag;
        this._renderCmd.stayOnTop(this._alwaysOnTop);
    },

    cleanup: function () {
        this._super();
        this._renderCmd.removeDom();
    },

    _onTouchBegan: function (touch) {
        var touchPoint = touch.getLocation();
        var bb = cc.rect(0,0, this._contentSize.width, this._contentSize.height);
        var hitted = cc.rectContainsPoint(bb, this.convertToNodeSpace(touchPoint));
        if(hitted) {
            return true;
        }
        else {
            this._renderCmd._endEditing();
            return false;
        }
    },

    _onTouchEnded: function () {
        this._renderCmd._beginEditing();
    },

    _updateBackgroundSpriteSize: function (width, height) {
        if(this._backgroundSprite) {
            this._backgroundSprite.setContentSize(width, height);
        }
    },

    _updateEditBoxSize: function(size, height) {
        var newWidth = (typeof size.width === 'number') ? size.width : size;
        var newHeight = (typeof size.height === 'number') ? size.height : height;

        this._updateBackgroundSpriteSize(newWidth, newHeight);
        this._renderCmd.updateSize(newWidth, newHeight);
    },

    setLineHeight: function (lineHeight) {
        this._renderCmd.setLineHeight(lineHeight);
    },

    setFont: function (fontName, fontSize) {
        this._renderCmd.setFont(fontName, fontSize);
    },

    _setFont: function (fontStyle) {
        this._renderCmd._setFont(fontStyle);
    },

    getBackgroundSprite: function() {
        return this._backgroundSprite;
    },

    setFontName: function (fontName) {
        this._renderCmd.setFontName(fontName);
    },

    setFontSize: function (fontSize) {
        this._renderCmd.setFontSize(fontSize);
    },

    setString: function (text) {
        if (text.length >= this._maxLength) {
            text = text.slice(0, this._maxLength);
        }
        this._text = text;
        this._renderCmd.setString(text);
    },

    setFontColor: function (color) {
        this._textColor = color;
        this._renderCmd.setFontColor(color);
    },

    setMaxLength: function (maxLength) {
        if (!isNaN(maxLength)) {
            if(maxLength < 0) {
                //we can't set Number.MAX_VALUE to input's maxLength property
                //so we use a magic number here, it should works at most use cases.
                maxLength = 65535;
            }
            this._maxLength = maxLength;
            this._renderCmd.setMaxLength(maxLength);
        }
    },

    getMaxLength: function () {
        return this._maxLength;
    },

    setPlaceHolder: function (text) {
        if (text !== null) {
            this._renderCmd.setPlaceHolder(text);
            this._placeholderText = text;
        }
    },

    setPlaceholderFont: function (fontName, fontSize) {
        this._placeholderFontName = fontName;
        this._placeholderFontSize = fontSize;
        this._renderCmd._updateDOMPlaceholderFontStyle();
    },

    _setPlaceholderFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._placeholderFontName = res[2];
            this._placeholderFontSize = parseInt(res[1]);
            this._renderCmd._updateDOMPlaceholderFontStyle();
        }
    },

    setPlaceholderFontName: function (fontName) {
        this._placeholderFontName = fontName;
        this._renderCmd._updateDOMPlaceholderFontStyle();
    },

    setPlaceholderFontSize: function (fontSize) {
        this._placeholderFontSize = fontSize;
        this._renderCmd._updateDOMPlaceholderFontStyle();
    },

    setPlaceholderFontColor: function (color) {
        this._placeholderColor = color;
        this._renderCmd.setPlaceholderFontColor(color);
    },

    setInputFlag: function (inputFlag) {
        this._editBoxInputFlag = inputFlag;
        this._renderCmd.setInputFlag(inputFlag);
    },

    getString: function () {
        return this._text;
    },

    initWithSizeAndBackgroundSprite: function (size, normal9SpriteBg) {
        if(this._backgroundSprite) {
            this._backgroundSprite.removeFromParent();
        }
        this._backgroundSprite = normal9SpriteBg;
        _ccsg.Node.prototype.setContentSize.call(this, size);

        if(this._backgroundSprite && !this._backgroundSprite.parent) {
            this._backgroundSprite.setAnchorPoint(cc.p(0, 0));
            this.addChild(this._backgroundSprite);

            this._updateBackgroundSpriteSize(size.width, size.height);
        }


        this.x = 0;
        this.y = 0;
        return true;
    },

    setDelegate: function (delegate) {
        this._delegate = delegate;
    },

    getPlaceHolder: function () {
        return this._placeholderText;
    },

    setInputMode: function (inputMode) {
        if (this._editBoxInputMode === inputMode) return;

        var oldText = this.getString();
        this._editBoxInputMode = inputMode;

        this._renderCmd.setInputMode(inputMode);
        this._renderCmd.transform();

        this.setString(oldText);
        this._renderCmd._updateLabelPosition(this.getContentSize());
    },

    setReturnType: function (returnType) {
        this._keyboardReturnType = returnType;
        this._renderCmd._updateDomInputType();
    },

    initWithBackgroundColor: function (size, bgColor) {
        this._edWidth = size.width;
        this.dom.style.width = this._edWidth.toString() + 'px';
        this._edHeight = size.height;
        this.dom.style.height = this._edHeight.toString() + 'px';
        this.dom.style.backgroundColor = cc.colorToHex(bgColor);
    }
});

var _p = _ccsg.EditBox.prototype;

// Extended properties
cc.defineGetterSetter(_p, 'font', null, _p._setFont);
cc.defineGetterSetter(_p, 'fontName', null, _p.setFontName);
cc.defineGetterSetter(_p, 'fontSize', null, _p.setFontSize);
cc.defineGetterSetter(_p, 'fontColor', null, _p.setFontColor);
cc.defineGetterSetter(_p, 'string', _p.getString, _p.setString);
cc.defineGetterSetter(_p, 'maxLength', _p.getMaxLength, _p.setMaxLength);
cc.defineGetterSetter(_p, 'placeholder', _p.getPlaceHolder, _p.setPlaceHolder);
cc.defineGetterSetter(_p, 'placeholderFont', null, _p._setPlaceholderFont);
cc.defineGetterSetter(_p, 'placeholderFontName', null, _p.setPlaceholderFontName);
cc.defineGetterSetter(_p, 'placeholderFontSize', null, _p.setPlaceholderFontSize);
cc.defineGetterSetter(_p, 'placeholderFontColor', null, _p.setPlaceholderFontColor);
cc.defineGetterSetter(_p, 'inputFlag', null, _p.setInputFlag);
cc.defineGetterSetter(_p, 'delegate', null, _p.setDelegate);
cc.defineGetterSetter(_p, 'inputMode', null, _p.setInputMode);
cc.defineGetterSetter(_p, 'returnType', null, _p.setReturnType);

_p = null;

_ccsg.EditBox.InputMode = InputMode;
_ccsg.EditBox.InputFlag = InputFlag;
_ccsg.EditBox.KeyboardReturnType = KeyboardReturnType;

(function (editbox) {
    editbox._polyfill = {
        zoomInvalid: false
    };

    if (cc.sys.OS_ANDROID === cc.sys.os
        && (cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU
            || cc.sys.browserType === cc.sys.BROWSER_TYPE_360)) {
        editbox._polyfill.zoomInvalid = true;
    }
})(_ccsg.EditBox);

(function (polyfill) {
    var EditBoxImpl = function () {
    };

    var proto = EditBoxImpl.prototype = Object.create(Object.prototype);

    proto.updateMatrix = function () {
        if (!this._edTxt) return;

        var node = this._node, scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        var dpr = cc.view._devicePixelRatio;
        var t = this._worldTransform;

        scaleX /= dpr;
        scaleY /= dpr;

        var container = cc.game.container;
        var a = t.a * scaleX, b = t.b, c = t.c, d = t.d * scaleY;

        var offsetX = container && container.style.paddingLeft &&  parseInt(container.style.paddingLeft);
        var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        var tx = t.tx * scaleX + offsetX, ty = t.ty * scaleY + offsetY;

        if (polyfill.zoomInvalid) {
            this.updateSize(node._contentSize.width * a, node._contentSize.height * d);
            a = 1;
            d = 1;
        }

        var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._edTxt.style['transform'] = matrix;
        this._edTxt.style['-webkit-transform'] = matrix;
        this._edTxt.style['transform-origin'] = '0px 100% 0px';
        this._edTxt.style['-webkit-transform-origin'] = '0px 100% 0px';
    };

    proto.updateVisibility = function () {
        if (!this._edTxt) return;

        if (this._node.visible) {
            this._edTxt.style.visibility = 'visible';
        } else {
            this._edTxt.style.visibility = 'hidden';
        }
    };

    proto.stayOnTop = function (flag) {
        if(flag) {
            this._removeLabels();
            this._edTxt.style.display = '';
        } else {
            this._createLabels();
            this._edTxt.style.display = 'none';
            this._showLabels();
        }
    };

    // Called before editbox focus to register cc.view status
    proto._beginEditingOnMobile = function (editBox) {
        this.__orientationChanged = function () {
            adjustEditBoxPosition(editBox);
        };

        window.addEventListener('orientationchange', this.__orientationChanged);

        if (cc.view.isAutoFullScreenEnabled()) {
            this.__fullscreen = true;
            cc.view.enableAutoFullScreen(false);
            cc.screen.exitFullScreen();
        } else {
            this.__fullscreen = false;
        }
        this.__autoResize = cc.view.__resizeWithBrowserSize;
        cc.view.resizeWithBrowserSize(false);
    };
    // Called after keyboard disappeared to readapte the game view
    proto._endEditingOnMobile = function () {
        if (this.__rotateScreen) {
            cc.container.style['-webkit-transform'] = 'rotate(90deg)';
            cc.container.style.transform = 'rotate(90deg)';

            var view = cc.view;
            var width = view._originalDesignResolutionSize.width;
            var height = view._originalDesignResolutionSize.height;
            if (width > 0) {
                view.setDesignResolutionSize(width, height, view._resolutionPolicy);
            }
            this.__rotateScreen = false;
        }

        window.removeEventListener('orientationchange', this.__orientationChanged);

        window.scrollTo(0, 0);
        if(this.__fullscreen) {
            cc.view.enableAutoFullScreen(true);
        }
        if (this.__autoResize) {
            cc.view.resizeWithBrowserSize(true);
        }
    };
    // Called after editbox focus to readapte the game view
    proto._onFocusOnMobile = function (editBox) {
        if (cc.view._isRotated) {
            cc.container.style['-webkit-transform'] = 'rotate(0deg)';
            cc.container.style.transform = 'rotate(0deg)';
            cc.view._isRotated = false;
            var policy = cc.view.getResolutionPolicy();
            policy.apply(cc.view, cc.view.getDesignResolutionSize());
            cc.view._isRotated = true;
            //use window scrollTo to adjust the input area
            window.scrollTo(35, 35);
            this.__rotateScreen = true;
        } else {
            this.__rotateScreen = false;
        }
        adjustEditBoxPosition(editBox);
    };



    proto._createDomInput = function () {
        this.removeDom();

        var thisPointer = this;
        var tmpEdTxt = this._edTxt = document.createElement('input');
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontSize = this._edFontSize + 'px';
        tmpEdTxt.style.color = '#000000';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        tmpEdTxt.style.width = '100%';
        tmpEdTxt.style.height = '100%';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.textTransform = 'uppercase';
        tmpEdTxt.style.display = 'none';
        tmpEdTxt.style.position = "absolute";
        tmpEdTxt.style.bottom = "0px";
        tmpEdTxt.style.left = LEFT_PADDING + "px";
        tmpEdTxt.style.className = "cocosEditBox";

        tmpEdTxt.addEventListener('input', function () {
            var editBox = thisPointer._editBox;


            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }

            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                if (editBox._text !== this.value) {
                    editBox._text = this.value;
                    thisPointer._updateDomTextCases();
                    editBox._delegate.editBoxTextChanged(editBox, editBox._text);
                }
            }
        });
        tmpEdTxt.addEventListener('keypress', function (e) {
            var editBox = thisPointer._editBox;

            if (e.keyCode === cc.KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                if(this.value === '') {
                    this.style.fontSize = editBox._placeholderFontSize + 'px';
                    this.style.color = cc.colorToHex(editBox._placeholderColor);
                }

                editBox._text = this.value;
                thisPointer._updateDomTextCases();

                thisPointer._endEditing();
                if (editBox._delegate && editBox._delegate.editBoxEditingReturn) {
                    editBox._delegate.editBoxEditingReturn(editBox);
                }
                cc._canvas.focus();
            }
        });

        tmpEdTxt.addEventListener('focus', function () {
            var editBox = thisPointer._editBox;
            this.style.fontSize = thisPointer._edFontSize + 'px';
            this.style.color = cc.colorToHex(editBox._textColor);
            thisPointer._hiddenLabels();

            if (cc.sys.isMobile) {
                thisPointer._onFocusOnMobile(editBox);
            }

            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegan) {
                editBox._delegate.editBoxEditingDidBegan(editBox);
            }
        });
        tmpEdTxt.addEventListener('blur', function () {
            var editBox = thisPointer._editBox;
            editBox._text = this.value;
            thisPointer._updateDomTextCases();

            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnded) {
                editBox._delegate.editBoxEditingDidEnded(editBox);
            }

            if (this.value === '') {
                this.style.fontSize = editBox._placeholderFontSize + 'px';
                this.style.color = cc.colorToHex(editBox._placeholderColor);
            }
            thisPointer._endEditing();
        });

        this._addDomToGameContainer();

        return tmpEdTxt;
    };

    proto._createDomTextArea = function () {
        this.removeDom();

        var thisPointer = this;
        var tmpEdTxt = this._edTxt = document.createElement('textarea');
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontSize = this._edFontSize + 'px';
        tmpEdTxt.style.color = '#000000';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        tmpEdTxt.style.width = '100%';
        tmpEdTxt.style.height = '100%';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.resize = 'none';
        tmpEdTxt.style.textTransform = 'uppercase';
        tmpEdTxt.style.overflow_y = 'scroll';
        tmpEdTxt.style.display = 'none';
        tmpEdTxt.style.position = "absolute";
        tmpEdTxt.style.bottom = "0px";
        tmpEdTxt.style.left = LEFT_PADDING + "px";
        tmpEdTxt.style.className = "cocosEditBox";

        tmpEdTxt.addEventListener('input', function () {
            if (this.value.length > this.maxLength) {
                this.value = this.value.slice(0, this.maxLength);
            }

            var editBox = thisPointer._editBox;
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                if(editBox._text.toLowerCase() !== this.value.toLowerCase()) {
                    editBox._text = this.value;
                    thisPointer._updateDomTextCases();
                    editBox._delegate.editBoxTextChanged(editBox, editBox._text);
                }
            }
        });

        tmpEdTxt.addEventListener('focus', function () {
            var editBox = thisPointer._editBox;
            thisPointer._hiddenLabels();

            this.style.fontSize = thisPointer._edFontSize + 'px';
            this.style.color = cc.colorToHex(editBox._textColor);

            if (cc.sys.isMobile) {
                thisPointer._onFocusOnMobile(editBox);
            }

            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegan) {
                editBox._delegate.editBoxEditingDidBegan(editBox);
            }

        });
        tmpEdTxt.addEventListener('keypress', function (e) {
            var editBox = thisPointer._editBox;

            if (e.keyCode === cc.KEY.enter) {
                e.stopPropagation();

                if (editBox._delegate && editBox._delegate.editBoxEditingReturn) {
                    editBox._delegate.editBoxEditingReturn(editBox);
                }
            }
        });
        tmpEdTxt.addEventListener('blur', function () {
            var editBox = thisPointer._editBox;
            editBox._text = this.value;
            thisPointer._updateDomTextCases();

            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnded) {
                editBox._delegate.editBoxEditingDidEnded(editBox);
            }

            if (this.value === '') {
                this.style.fontSize = editBox._placeholderFontSize + 'px';
                this.style.color = cc.colorToHex(editBox._placeholderColor);
            }

            thisPointer._endEditing();
        });

        this._addDomToGameContainer();
        return tmpEdTxt;
    };

    proto._createLabels = function () {
        var editBoxSize = this._editBox.getContentSize();
        if(!this._textLabel) {
            this._textLabel = _ccsg.Label.pool.get();
            this._textLabel.setAnchorPoint(cc.p(0, 1));
            this._textLabel.setOverflow(_ccsg.Label.Overflow.CLAMP);
            this._editBox.addChild(this._textLabel, 100);
        }

        if(!this._placeholderLabel) {
            this._placeholderLabel = _ccsg.Label.pool.get();
            this._placeholderLabel.setAnchorPoint(cc.p(0, 1));
            this._placeholderLabel.setColor(cc.Color.GRAY);
            this._editBox.addChild(this._placeholderLabel, 100);
        }

        this._updateLabelPosition(editBoxSize);
    };

    proto._removeLabels = function () {
        if(!this._textLabel) return;

        this._editBox.removeChild(this._textLabel);
        this._textLabel = null;
    };

    proto._updateLabelPosition = function (editBoxSize) {
        if(!this._textLabel || !this._placeholderLabel) return;

        var labelContentSize = cc.size(editBoxSize.width - LEFT_PADDING, editBoxSize.height);
        this._textLabel.setContentSize(labelContentSize);
        this._placeholderLabel.setLineHeight(editBoxSize.height);
        var placeholderLabelSize = this._placeholderLabel.getContentSize();

        if (this._editBox._editBoxInputMode === InputMode.ANY){
            this._textLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setVerticalAlign(cc.VerticalTextAlignment.TOP);
            this._textLabel.setVerticalAlign(cc.VerticalTextAlignment.TOP);
            this._textLabel.enableWrapText(true);
        }
        else {
            this._textLabel.enableWrapText(false);
            this._textLabel.setPosition(LEFT_PADDING, editBoxSize.height);
            this._placeholderLabel.setPosition(LEFT_PADDING, (editBoxSize.height + placeholderLabelSize.height) / 2);
            this._placeholderLabel.setVerticalAlign(cc.VerticalTextAlignment.CENTER);
            this._textLabel.setVerticalAlign(cc.VerticalTextAlignment.CENTER);
        }

    };

    proto.setLineHeight = function (lineHeight) {
        if(this._textLabel) {
            this._textLabel.setLineHeight(lineHeight);
        }
    };

    proto._hiddenLabels = function () {
        if(this._textLabel) {
            this._textLabel.setVisible(false);
        }

        if(this._placeholderLabel) {
            this._placeholderLabel.setVisible(false);
        }
    };

    proto._updateDomTextCases = function() {
        var inputFlag = this._editBox._editBoxInputFlag;
        if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            this._editBox._text = this._editBox._text.toUpperCase();
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            this._editBox._text = capitalize(this._editBox._text);
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_SENTENCE) {
            this._editBox._text = capitalizeFirstLetter(this._editBox._text);
        }
    };

    proto._updateLabelStringStyle = function() {
        if (this._edTxt.type === 'password') {
            var passwordString = '';
            var len = this._editBox._text.length;
            for (var i = 0; i < len; ++i) {
                passwordString += '\u25CF';
            }
            if(this._textLabel) {
                this._textLabel.setString(passwordString);
            }
        } else {
            this._updateDomTextCases();
            if(this._textLabel) {
                this._textLabel.setString(this._editBox._text);
            }
        }
    };

    proto._showLabels = function () {
        this._hiddenLabels();
        if (this._edTxt.value === '') {
            if(this._placeholderLabel) {
                this._placeholderLabel.setVisible(true);
                this._placeholderLabel.setString(this._editBox._placeholderText);
            }
        }
        else {
            if(this._textLabel) {
                this._textLabel.setVisible(true);
                this._textLabel.setString(this._editBox._text);
            }
        }
        this._updateLabelStringStyle();
    };

    proto._beginEditing = function() {
        if (!this._editBox._alwaysOnTop) {
            if (this._edTxt.style.display === 'none') {
                this._edTxt.style.display = '';
                if (cc.sys.browserType === cc.sys.BROWSER_TYPE_UC) {
                    setTimeout(function () {
                        this._edTxt.focus();
                    }.bind(this), TIMER_NAME);
                } else {
                    this._edTxt.focus();
                }
            }
        }

        if (cc.sys.isMobile && !this._editingMode) {
            // Pre adaptation and
            this._beginEditingOnMobile(this._editBox);
        }
        this._editingMode = true;
    };

    proto._endEditing = function() {
        if (!this._editBox._alwaysOnTop) {
            this._edTxt.style.display = 'none';
        }
        this._showLabels();
        if (cc.sys.isMobile && this._editingMode) {
            var self = this;
            // Delay end editing adaptation to ensure virtual keyboard is disapeared
            setTimeout(function () {
                self._endEditingOnMobile();
            }, TIMER_NAME);
        }
        this._editingMode = false;
    };

    proto._setFont = function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        var textFontName = res[2];
        var textFontSize = parseInt(res[1]);
        if (res) {
            this.setFont(textFontName, textFontSize);
        }
    };

    proto.setFont = function (fontName, fontSize) {
        this._edFontName = fontName || this._edFontName;
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    };

    proto.setFontName = function (fontName) {
        this._edFontName = fontName || this._edFontName;
        this._updateDOMFontStyle();
    };

    proto.setFontSize = function (fontSize) {
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    };

    proto.setFontColor = function (color) {
        if(!this._edTxt) return;

        if (this._edTxt.value !== this._editBox._placeholderText) {
            this._edTxt.style.color = cc.colorToHex(color);
        }
        if(this._textLabel) {
            this._textLabel.setColor(color);
        }
    };

    proto.setPlaceHolder = function (text) {
        this._placeholderLabel.setString(text);
    };

    proto.setMaxLength = function (maxLength) {
        if(!this._edTxt) return;
        this._edTxt.maxLength = maxLength;
    };

    proto._updateDOMPlaceholderFontStyle = function () {
        this._placeholderLabel.setFontFamily(this._editBox._placeholderFontName);
        this._placeholderLabel.setFontSize(this._editBox._placeholderFontSize);
    };

    proto.setPlaceholderFontColor = function (color) {
        this._placeholderLabel.setColor(color);
    };

    proto._updateDomInputType = function () {
        var inputMode = this._editBox._editBoxInputMode;
        if(inputMode === InputMode.EMAIL_ADDR) {
            this._edTxt.type = 'email';
        } else if(inputMode === InputMode.NUMERIC ||
                 inputMode === InputMode.DECIMAL) {
            this._edTxt.type = 'number';
        } else if(inputMode === InputMode.PHONE_NUMBER) {
            this._edTxt.type = 'number';
            this._edTxt.pattern = '[0-9]*';
        } else if(inputMode === InputMode.URL) {
            this._edTxt.type = 'url';
        } else {
            this._edTxt.type = 'text';

            if(this._editBox._keyboardReturnType === KeyboardReturnType.SEARCH) {
                this._edTxt.type = 'search';
            }
        }


        if (this._editBox._editBoxInputFlag === InputFlag.PASSWORD) {
            this._edTxt.type = 'password';
        }
    };

    proto.setInputFlag = function (inputFlag) {
        if(!this._edTxt) return;

        this._updateDomInputType();

        this._edTxt.style.textTransform = 'none';

        if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            this._edTxt.style.textTransform = 'uppercase';
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            this._edTxt.style.textTransform = 'capitalize';
        }
        this._updateLabelStringStyle();
    };

    proto.setInputMode = function (inputMode) {
        if (inputMode === InputMode.ANY) {
            this._createDomTextArea();
        }
        else {
            this._createDomInput();
        }

        this._updateDomInputType();
        var contentSize = this._node.getContentSize();
        this.updateSize(contentSize.width, contentSize.height);
    };

    proto.setString = function (text) {
        if(!this._edTxt) return;

        if (text !== null) {
            this._edTxt.value = text;

            if (text === '') {
                if(this._placeholderLabel) {
                    this._placeholderLabel.setString(this._editBox._placeholderText);
                    this._placeholderLabel.setColor(this._editBox._placeholderColor);
                }
                if(!this._editingMode) {
                    if (this._placeholderLabel) {
                        this._placeholderLabel.setVisible(true);
                    }
                    if (this._textLabel) {
                        this._textLabel.setVisible(false);
                    }
                }
            }
            else {
                this._edTxt.style.color = cc.colorToHex(this._editBox._textColor);
                if(this._textLabel) {
                    this._textLabel.setColor(this._editBox._textColor);
                }
                if (!this._editingMode) {
                    if(this._placeholderLabel) {
                        this._placeholderLabel.setVisible(false);
                    }
                    if(this._textLabel) {
                        this._textLabel.setVisible(true);
                    }
                }

                this._updateLabelStringStyle();
            }
        }
    };

    proto._updateDOMFontStyle = function() {
        if(!this._edTxt) return;

        if (this._edTxt.value !== '') {
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize + 'px';
        }
        if(this._textLabel) {
            this._textLabel.setFontSize(this._edFontSize);
            this._textLabel.setFontFamily(this._edFontName);
        }
    };


    proto.updateSize = function(newWidth, newHeight) {
        var editboxDomNode = this._edTxt;
        if (!editboxDomNode) return;

        editboxDomNode.style['width'] = newWidth + 'px';
        editboxDomNode.style['height'] = newHeight + 'px';

        this._updateLabelPosition(cc.size(newWidth, newHeight));
    };

    proto._addDomToGameContainer = function () {
        cc.game.container.appendChild(this._edTxt);
    };

    proto.removeDom = function () {
        var editBox = this._edTxt;
        if(editBox){
            var hasChild = Utils.contains(cc.game.container, editBox);
            if(hasChild) {
                cc.game.container.removeChild(editBox);
            }
        }
        this._edTxt = null;
    };

    proto.initializeRenderCmd = function (node) {
        this._editBox = node;

        //it's a dom node, may be assigned with Input or TextArea.
        this._edFontSize = 14;
        this._edFontName = 'Arial';
        this._textLabel = null;
        this._placeholderLabel = null;
        this._editingMode = false;

        this.__fullscreen = false;
        this.__autoResize = false;
        this.__rotateScreen = false;
        this.__orientationChanged = null;
    };

    //define the canvas render command
    _ccsg.EditBox.CanvasRenderCmd = function (node) {
        this._rootCtor(node);
        this.initializeRenderCmd(node);
    };

    var canvasRenderCmdProto = _ccsg.EditBox.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
    cc.js.mixin(canvasRenderCmdProto, proto);
    canvasRenderCmdProto.constructor = _ccsg.EditBox.CanvasRenderCmd;

    canvasRenderCmdProto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this.updateMatrix();
    };

    //define the webgl render command
    _ccsg.EditBox.WebGLRenderCmd = function (node) {
        this._rootCtor(node);
        this.initializeRenderCmd(node);
    };

    var webGLRenderCmdProto = _ccsg.EditBox.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
    cc.js.mixin(webGLRenderCmdProto, proto);
    webGLRenderCmdProto.constructor = _ccsg.EditBox.WebGLRenderCmd;

    webGLRenderCmdProto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this.updateMatrix();
    };

}(_ccsg.EditBox._polyfill));
