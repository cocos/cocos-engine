/*global _ccsg */

/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2012 James Chen

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
    INITIAL_CAPS_ALL_CHARACTERS: 4
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
    editBoxReturn: function (sender) {
    }
});

var EditBoxImpl = function(editBox) {
    this._domInputSprite = null;
    this._spriteDOM = null;
    this._edTxt = null;
    this._edFontSize = 14;
    this._edFontName = 'Arial';
    this._editBox = editBox;
    this._textLabel = null;
    this._placeholderLabel = null;
};

EditBoxImpl.prototype = {
    constructor: EditBoxImpl,

    createNativeControl: function(size) {
        var tmpDOMSprite = this._domInputSprite = new _ccsg.Sprite();
        tmpDOMSprite.draw = function () {};  //redefine draw function
        this._editBox.addChild(tmpDOMSprite);
        this._spriteDOM = tmpDOMSprite;

        this._createDomTextArea();

        cc.DOM.convert(tmpDOMSprite);

        this._addDomInputControl();

        this._domInputSprite.dom.showTooltipDiv = false;
        this._domInputSprite.dom.style.width = (size.width - 6) + 'px';
        this._domInputSprite.dom.style.height = (size.height - 6) + 'px';

        tmpDOMSprite.canvas.remove();

        this._domInputSprite.x = 3;
        this._domInputSprite.y = 3;

        this._createLabels();
    },

    _createLabels: function () {
        var editBoxSize = this._editBox.getContentSize();
        this._textLabel = new _ccsg.Label();
        this._textLabel.setVisible(false);
        this._textLabel.setAnchorPoint(cc.p(0, 1));
        this._textLabel.setOverflow(_ccsg.Label.Overflow.CLAMP);
        this._editBox.addChild(this._textLabel, 100);

        this._placeholderLabel = new _ccsg.Label();
        this._placeholderLabel.setAnchorPoint(cc.p(0, 1));
        this._placeholderLabel.setColor(cc.Color.GRAY);
        this._editBox.addChild(this._placeholderLabel, 100);

        this._updateLabelPosition(editBoxSize);
    },

    _updateLabelPosition: function (editBoxSize) {
        this._textLabel.setContentSize(editBoxSize);
        this._placeholderLabel.setLineHeight(editBoxSize.height);
        var placeholderLabelSize = this._placeholderLabel.getContentSize();

        if (this._editBox._editBoxInputMode === InputMode.ANY){
            this._textLabel.setPosition(cc.p(0, editBoxSize.height));
            this._placeholderLabel.setPosition(cc.p(0, editBoxSize.height));
            this._placeholderLabel.setVerticalAlign(cc.VerticalTextAlignment.TOP);
            this._textLabel.setVerticalAlign(cc.VerticalTextAlignment.TOP);
            this._textLabel.enableWrapText(true);
        }
        else {
            this._textLabel.enableWrapText(false);
            this._textLabel.setPosition(cc.p(0, editBoxSize.height));
            this._placeholderLabel.setPosition(cc.p(0, (editBoxSize.height + placeholderLabelSize.height) / 2));
            this._placeholderLabel.setVerticalAlign(cc.VerticalTextAlignment.CENTER);
            this._textLabel.setVerticalAlign(cc.VerticalTextAlignment.CENTER);
        }

    },

    setLineHeight: function (lineHeight) {
        this._textLabel.setLineHeight(lineHeight);
    },

    _hiddenLabels: function () {
        this._textLabel.setVisible(false);
        this._placeholderLabel.setVisible(false);
    },

    _updateEditBoxContentStyle: function() {
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
    },

    _updateLabelString: function() {
        this._textLabel.setVisible(true);
        this._textLabel.setString(this._editBox._text);
        if (this._edTxt.type === 'password') {
            var passwordString = '';
            var len = this._editBox._text.length;
            for (var i = 0; i < len; ++i) {
                passwordString += '\u25CF';
            }
            this._textLabel.setString(passwordString);
        } else {
            this._updateEditBoxContentStyle();
            this._textLabel.setString(this._editBox._text);
        }
    },

    _showLabels: function () {
        this._hiddenLabels();
        if (this._edTxt.value === '') {
            this._placeholderLabel.setVisible(true);
            this._placeholderLabel.setString(this._editBox._placeholderText);

        }
        else {
            this._updateLabelString();
        }
    },

    registerClickEvent: function() {
        var self = this;
        var div = self._edTxt.parentNode;
        div.style.pointerEvents = 'none';
        div.addEventListener('click', function() {
            if (self._edTxt.style.display === 'none') {
                self._edTxt.style.display = '';
                self._edTxt.focus();
                self._hiddenLabels();
            }
        });
    },

    show: function() {
        var div = this._edTxt.parentNode;
        div.style.pointerEvents = '';
        window.setTimeout(function() {
            div.click();
        }, 10);
    },

    hidden: function() {
        this._edTxt.style.display = 'none';
        var div = this._edTxt.parentNode;
        div.style.pointerEvents = 'none';
        this._showLabels();
    },

    _setFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        var textFontName = res[2];
        var textFontSize = parseInt(res[1]);
        if (res) {
            this.setFont(textFontName, textFontSize);
        }
    },

    setFont: function (fontName, fontSize) {
        this._edFontName = fontName || this._edFontName;
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    },

    setFontName: function (fontName) {
        this._edFontName = fontName || this._edFontName;
        this._updateDOMFontStyle();
    },

    setFontSize: function (fontSize) {
        this._edFontSize = fontSize || this._edFontSize;
        this._updateDOMFontStyle();
    },

    setFontColor: function (color) {
        if (this._edTxt.value !== this._editBox._placeholderText) {
            this._edTxt.style.color = cc.colorToHex(color);
        }
        this._textLabel.setColor(color);
    },

    setPlaceHolder: function (text) {
        this._placeholderLabel.setString(text);
    },

    setMaxLength: function (maxLength) {
        this._edTxt.maxLength = maxLength;
    },

    _updateDOMPlaceholderFontStyle: function () {
        this._placeholderLabel.setFontFileOrFamily(this._editBox._placeholderFontName);
        this._placeholderLabel.setFontSize(this._editBox._placeholderFontSize);
    },

    setPlaceholderFontColor: function (color) {
        this._placeholderLabel.setColor(color);
    },

    setInputFlag: function (inputFlag) {
        if ((this._edTxt.value !== this._placeholderText) && (inputFlag === InputFlag.PASSWORD))
            this._edTxt.type = 'password';
        else
            this._edTxt.type = 'text';

        this._edTxt.style.textTransform = 'none';

        if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            this._edTxt.style.textTransform = 'uppercase';
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            this._edTxt.style.textTransform = 'capitalize';
        }
        this._updateLabelString();
    },

    setInputMode : function (inputMode) {
        if (inputMode === InputMode.ANY) {
            this._removeDomInputControl();
            this._createDomTextArea();
            this._addDomInputControl();
        }
        else if(this._editBox._editBoxInputMode === InputMode.ANY) {
            this._removeDomInputControl();
            this._createDomInput();
            this._addDomInputControl();
        }
    },

    /**
     *  Set the text entered in the edit box.
     * @param {string} text The given text.
     */
    setString: function (text) {
        if (text !== null) {
            this._edTxt.value = text;

            if (text === '') {
                this._edTxt.type = 'text';
                this._placeholderLabel.setString(this._editBox._placeholderText);
                this._placeholderLabel.setColor(this._editBox._placeholderColor);
                this._placeholderLabel.setVisible(true);
                this._textLabel.setVisible(false);
            }
            else {
                this._edTxt.style.color = cc.colorToHex(this._editBox._textColor);
                this._textLabel.setColor(this._editBox._textColor);
                this._placeholderLabel.setVisible(false);
                if (this._editBox._editBoxInputFlag === InputFlag.PASSWORD) {
                    this._edTxt.type = 'password';
                }
                else {
                    this._edTxt.type = 'text';
                }
                this._updateLabelString();
            }
        }
    },

    _updateDOMFontStyle: function() {
        if (this._edTxt.value !== '') {
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize + 'px';
            if (this._editBox._editBoxInputFlag === InputFlag.PASSWORD)
                this._edTxt.type = 'password';
            else
                this._edTxt.type = 'text';
        }
        this._textLabel.setFontSize(this._edFontSize);
        this._textLabel.setFontFileOrFamily(this._edFontName);
    },


    setSize: function(newWidth, newHeight) {
        this._spriteDOM.dom.style.width = (newWidth - 6) + 'px';
        this._spriteDOM.dom.style.height = (newHeight - 6) + 'px';
        this._updateLabelPosition(cc.size(newWidth, newHeight));
    },

    _createDomInput: function () {
        var selfPointer = this;
        var tmpEdTxt = this._edTxt = document.createElement('input');
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontSize = this._edFontSize + 'px';
        tmpEdTxt.style.color = '#000000';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        //tmpEdTxt.style.paddingLeft = '2px';
        tmpEdTxt.style.width = '100%';
        tmpEdTxt.style.height = '100%';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.textTransform = 'uppercase';
        tmpEdTxt.style.display = 'none';
        var onCanvasClick = function() { tmpEdTxt.blur();};

        tmpEdTxt.addEventListener('input', function () {
            var editBox = selfPointer._editBox;
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                editBox._text = this.value;
                selfPointer._updateEditBoxContentStyle();
                editBox._delegate.editBoxTextChanged(editBox, editBox._text);
            }
        });
        tmpEdTxt.addEventListener('keypress', function (e) {
            var editBox = selfPointer._editBox;

            if (e.keyCode === cc.KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                if(this.value === '') {
                    this.style.fontSize = editBox._placeholderFontSize + 'px';
                    this.style.color = cc.colorToHex(editBox._placeholderColor);
                }
                editBox._text = this.value;
                selfPointer._updateEditBoxContentStyle();
                selfPointer.hidden();
                if (editBox._delegate && editBox._delegate.editBoxReturn) {
                    editBox._delegate.editBoxReturn(editBox);
                }
                cc._canvas.focus();
            }
        });
        tmpEdTxt.addEventListener('focus', function () {
            var editBox = selfPointer._editBox;

            this.style.fontSize = selfPointer._edFontSize + 'px';
            this.style.color = cc.colorToHex(editBox._textColor);
            if (editBox._editBoxInputFlag === InputFlag.PASSWORD) {
                selfPointer._edTxt.type = 'password';
            } else {
                selfPointer._edTxt.type = 'text';
            }

            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegan) {
                editBox._delegate.editBoxEditingDidBegan(editBox);
            }
            cc._canvas.addEventListener('click', onCanvasClick);
        });
        tmpEdTxt.addEventListener('blur', function () {
            var editBox = selfPointer._editBox;
            editBox._text = this.value;
            selfPointer._updateEditBoxContentStyle();

            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnded) {
                editBox._delegate.editBoxEditingDidEnded(editBox);
            }
            cc._canvas.removeEventListener('click', onCanvasClick);

            if (this.value === '') {
                this.style.fontSize = editBox._placeholderFontSize + 'px';
                this.style.color = cc.colorToHex(editBox._placeholderColor);
            }
            selfPointer.hidden();
        });
        return tmpEdTxt;
    },

    _createDomTextArea: function () {
        var selfPointer = this;
        var tmpEdTxt = this._edTxt = document.createElement('textarea');
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontSize = this._edFontSize + 'px';
        tmpEdTxt.style.color = '#000000';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        //tmpEdTxt.style.paddingLeft = '2px';
        tmpEdTxt.style.width = '100%';
        tmpEdTxt.style.height = '100%';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.resize = 'none';
        tmpEdTxt.style.textTransform = 'uppercase';
        tmpEdTxt.style.overflow_y = 'scroll';
        tmpEdTxt.style.display = 'none';
        var onCanvasClick = function() { tmpEdTxt.blur();};

        tmpEdTxt.addEventListener('input', function () {
            var editBox = selfPointer._editBox;
            if (editBox._delegate && editBox._delegate.editBoxTextChanged) {
                editBox._text = this.value;
                selfPointer._updateEditBoxContentStyle();
                editBox._delegate.editBoxTextChanged(editBox, editBox._text);
            }
        });

        tmpEdTxt.addEventListener('focus', function () {
            var editBox = selfPointer._editBox;

            this.style.fontSize = selfPointer._edFontSize + 'px';
            this.style.color = cc.colorToHex(editBox._textColor);

            if (editBox._delegate && editBox._delegate.editBoxEditingDidBegan) {
                editBox._delegate.editBoxEditingDidBegan(editBox);
            }

            cc._canvas.addEventListener('click', onCanvasClick);
        });
        tmpEdTxt.addEventListener('blur', function () {
            var editBox = selfPointer._editBox;
            editBox._text = this.value;
            selfPointer._updateEditBoxContentStyle();

            if (editBox._delegate && editBox._delegate.editBoxEditingDidEnded) {
                editBox._delegate.editBoxEditingDidEnded(editBox);
            }

            if (this.value === '') {
                this.style.fontSize = editBox._placeholderFontSize + 'px';
                this.style.color = cc.colorToHex(editBox._placeholderColor);
            }

            selfPointer.hidden();
            cc._canvas.removeEventListener('click', onCanvasClick);
        });

        return tmpEdTxt;
    },

    _removeDomInputControl: function() {
        this._domInputSprite.dom.removeChild(this._edTxt);
    },

    _addDomInputControl: function () {
        this._domInputSprite.dom.appendChild(this._edTxt);
    },
};

/**
 * <p>cc.EditBox is a brief Class for edit box.<br/>
 * You can use this widget to gather small amounts of text from the user.</p>
 *
 * @class
 * @extends cc.Node
 *
 * @property {String}   string                  - Content string of edit box
 * @property {String}   maxLength               - Max length of the content string
 * @property {String}   font                    - <@writeonly> Config font of edit box
 * @property {String}   fontName                - <@writeonly> Config font name of edit box
 * @property {Number}   fontSize                - <@writeonly> Config font size of edit box
 * @property {cc.Color} fontColor               - <@writeonly> Config font color of edit box
 * @property {String}   placeHolder             - Place holder of edit box
 * @property {String}   placeHolderFont         - <@writeonly> Config font of place holder
 * @property {String}   placeHolderFontName     - <@writeonly> Config font name of place holder
 * @property {Number}   placeHolderFontSize     - <@writeonly> Config font size of place holder
 * @property {cc.Color} placeHolderFontColor    - <@writeonly> Config font color of place holder
 * @property {cc.EditBox.InputFlag} inputFlag   - <@writeonly> Input flag of edit box, one of the cc.EditBox.InputFlag constants. e.g.cc.EditBox.InputFlag..PASSWORD
 * @property {Object}   delegate                - <@writeonly> Delegate of edit box
 * @property {cc.EditBox.InputMode} inputMode   - <@writeonly> Input mode of the edit box. Value should be one of the cc.EditBox.InputMode constants.
 * @property {Number}   returnType              - <@writeonly> Return type of edit box, value should be one of the KeyboardReturnType constants.
 *
 */
_ccsg.EditBox = _ccsg.Node.extend({
    _backgroundSprite: null,

    _delegate: null,
    _editBoxInputMode: InputMode.ANY,
    _editBoxInputFlag: InputFlag.SENSITIVE,
    _keyboardReturnType: KeyboardReturnType.DEFAULT,
    _maxLength: 50,
    _nativeControl: null,

    _text: '',
    _textColor: null,

    _placeholderText: '',
    _placeholderFontName: '',
    _placeholderFontSize: 14,
    _placeholderColor: null,

    _adjustHeight: 18,
    _tooltip: false,
    _className: 'EditBox',

    /**
     * constructor of cc.EditBox
     * @param {cc.Size} size
     * @param {cc.Scale9Sprite} normal9SpriteBg
     * @param {cc.Scale9Sprite} press9SpriteBg
     * @param {cc.Scale9Sprite} disabled9SpriteBg
     */
    ctor: function (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
        _ccsg.Node.prototype.ctor.call(this);

        this._textColor = cc.Color.WHITE;
        this._placeholderColor = cc.Color.GRAY;
        _ccsg.Node.prototype.setContentSize.call(this, size);

        var editBoxImpl = this._nativeControl = new EditBoxImpl(this);
        editBoxImpl.createNativeControl(size);

        //because cc.DOM.convert will replace editbox's setContentSize method.
        //here is a hack to provide a better version of setContentSize.
        this._oldSetContentSize = this.setContentSize;
        this.setContentSize = this._updateEditBoxSize;

        this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg);

        this.scheduleOnce(function () {
            editBoxImpl.registerClickEvent();
        }, 0.01);
    },

    _onTouchBegan: function (touch, event) {
        var touchPoint = touch.getLocation();
        var bb = cc.rect(0,0, this._contentSize.width, this._contentSize.height);
        var hitted = cc.rectContainsPoint(bb, this.convertToNodeSpace(touchPoint));
        if(hitted) {
            return true;
        }
        else {
            this._nativeControl.hidden();
            return false;
        }
    },

    _onTouchEnded: function (touch, event) {
        this._nativeControl.show();
    },

    _updateBackgroundSpriteSize: function (width, height) {
        if(this._backgroundSprite) {
            this._backgroundSprite.setContentSize(width, height);
        }
    },

    _updateEditBoxSize: function(size, height) {
        this._oldSetContentSize(size, height);

        var newWidth = (typeof size.width === 'number') ? size.width : size;
        var newHeight = (typeof size.height === 'number') ? size.height : height;

        this._updateBackgroundSpriteSize(newWidth, newHeight);
        this._nativeControl.setSize(newWidth, newHeight);
    },

    setLineHeight: function (lineHeight) {
        this._nativeControl.setLineHeight(lineHeight);
    },

    /**
     * Set the font.
     * @param {String} fontName  The font name.
     * @param {Number} fontSize  The font size.
     */
    setFont: function (fontName, fontSize) {
        this._nativeControl.setFont(fontName, fontSize);
    },

    _setFont: function (fontStyle) {
        this._nativeControl._setFont(fontStyle);
    },

    getBackgroundSprite: function() {
        return this._backgroundSprite;
    },

    /**
     * set fontName
     * @param {String} fontName
     */
    setFontName: function (fontName) {
        this._nativeControl.setFontName(fontName);
    },

    /**
     * set fontSize
     * @param {Number} fontSize
     */
    setFontSize: function (fontSize) {
        this._nativeControl.setFontSize(fontSize);
    },

    /**
     *  Set the text entered in the edit box.
     * @deprecated
     * @param {string} text The given text.
     */
    setText: function (text) {
        cc.log('Please use the setString');
        this.setString(text);
    },

    setString: function (text) {
        if (text.length >= this._maxLength) {
            text = text.slice(0, this._maxLength);
        }
        this._text = text;
        this._nativeControl.setString(text);
    },

    /**
     * Set the font color of the widget's text.
     * @param {cc.Color} color
     */
    setFontColor: function (color) {
        this._textColor = color;
        this._nativeControl.setFontColor(color);
    },

    /**
     * <p>
     * Sets the maximum input length of the edit box. <br/>
     * Setting this value enables multiline input mode by default.
     * </p>
     * @param {Number} maxLength The maximum length.
     */
    setMaxLength: function (maxLength) {
        if (!isNaN(maxLength) && maxLength > 0) {
            this._maxLength = maxLength;
            this._nativeControl.setMaxLength(maxLength);
        }
    },

    /**
     * Gets the maximum input length of the edit box.
     * @return {Number} Maximum input length.
     */
    getMaxLength: function () {
        return this._maxLength;
    },

    /**
     * Set a text in the edit box that acts as a placeholder when an edit box is empty.
     * @param {string} text The given text.
     */
    setPlaceHolder: function (text) {
        if (text !== null) {
            //Note: the following calling order matters
            this._nativeControl.setPlaceHolder(text);
            this._placeholderText = text;
        }
    },

    /**
     * Set the placeholder's font.
     * @param {String} fontName
     * @param {Number} fontSize
     */
    setPlaceholderFont: function (fontName, fontSize) {
        this._placeholderFontName = fontName;
        this._placeholderFontSize = fontSize;
        this._nativeControl._updateDOMPlaceholderFontStyle();
    },

    _setPlaceholderFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._placeholderFontName = res[2];
            this._placeholderFontSize = parseInt(res[1]);
            this._nativeControl._updateDOMPlaceholderFontStyle();
        }
    },

    /**
     * Set the placeholder's fontName.
     * @param {String} fontName
     */
    setPlaceholderFontName: function (fontName) {
        this._placeholderFontName = fontName;
        this._nativeControl._updateDOMPlaceholderFontStyle();
    },

    /**
     * Set the placeholder's fontSize.
     * @param {Number} fontSize
     */
    setPlaceholderFontSize: function (fontSize) {
        this._placeholderFontSize = fontSize;
        this._nativeControl._updateDOMPlaceholderFontStyle();
    },

    /**
     * Set the font color of the placeholder text when the edit box is empty.
     * @param {cc.Color} color
     */
    setPlaceholderFontColor: function (color) {
        this._placeholderColor = color;
        this._nativeControl.setPlaceholderFontColor(color);
    },

    /**
     * Set the input flags that are to be applied to the edit box.
     * @param {cc.EditBox.InputFlag} inputFlag - One of the cc.EditBox.InputFlag constants.
     * e.g.cc.EditBox.InputFlag..PASSWORD
     */
    setInputFlag: function (inputFlag) {
        this._editBoxInputFlag = inputFlag;
        this._nativeControl.setInputFlag(inputFlag);
    },

    /**
     * Gets the  input string of the edit box.
     * @deprecated
     * @return {string}
     */
    getText: function () {
        cc.log('Please use the getString');
        return this.getString();
    },

    /**
     * Gets the  input string of the edit box.
     * @return {string}
     */
    getString: function () {
        return this._text;
    },

    /**
     * Init edit box with specified size.
     * @param {cc.Size} size
     * @param {cc.Color | cc.Scale9Sprite} normal9SpriteBg
     */
    initWithSizeAndBackgroundSprite: function (size, normal9SpriteBg) {
        if(this._backgroundSprite) {
            this._backgroundSprite.removeFromParent();
        }
        this._backgroundSprite = normal9SpriteBg;

        if(this._backgroundSprite && !this._backgroundSprite.parent) {
            this._backgroundSprite.setAnchorPoint(cc.p(0, 0));
            this.addChild(this._backgroundSprite);

            this._updateBackgroundSpriteSize(size.width, size.height);
        }


        this.x = 0;
        this.y = 0;
        return true;
    },

    /* override functions */
    /**
     * Set the delegate for edit box.
     * @param {cc.EditBoxDelegate} delegate
     */
    setDelegate: function (delegate) {
        this._delegate = delegate;
    },

    /**
     * Get a text in the edit box that acts as a placeholder when an
     * edit box is empty.
     * @return {String}
     */
    getPlaceHolder: function () {
        return this._placeholderText;
    },

    /**
     * Set the input mode of the edit box.
     * @param {Number} inputMode One of the EditBoxInputMode constants.
     */
    setInputMode: function (inputMode) {
        if (this._editBoxInputMode === inputMode) return;

        var oldText = this.getString();

        this._nativeControl.setInputMode(inputMode);

        this.setString(oldText);
        this._editBoxInputMode = inputMode;
        this._nativeControl._updateLabelPosition(this.getContentSize());
    },

    /**
     * Set the return type that are to be applied to the edit box.
     * @param {Number} returnType One of the CCKeyboardReturnType constants.
     */
    setReturnType: function (returnType) {
        this._keyboardReturnType = returnType;
    },

    keyboardWillShow: function (info) {
        var rectTracked = _ccsg.EditBox.getRect(this);
        // some adjustment for margin between the keyboard and the edit box.
        rectTracked.y -= 4;
        // if the keyboard area doesn't intersect with the tracking node area, nothing needs to be done.
        if (!rectTracked.intersectsRect(info.end)) {
            cc.log("needn't to adjust view layout.");
            return;
        }

        // assume keyboard at the bottom of screen, calculate the vertical adjustment.
        this._adjustHeight = info.end.getMaxY() - rectTracked.getMinY();

        //callback
    },

    /**
     * @warning HTML5 Only
     * @param {cc.Size} size
     * @param {cc.color} bgColor
     */
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
/** @expose */
_p.font;
cc.defineGetterSetter(_p, 'font', null, _p._setFont);
/** @expose */
_p.fontName;
cc.defineGetterSetter(_p, 'fontName', null, _p.setFontName);
/** @expose */
_p.fontSize;
cc.defineGetterSetter(_p, 'fontSize', null, _p.setFontSize);
/** @expose */
_p.fontColor;
cc.defineGetterSetter(_p, 'fontColor', null, _p.setFontColor);
/** @expose */
_p.string;
cc.defineGetterSetter(_p, 'string', _p.getString, _p.setString);
/** @expose */
_p.maxLength;
cc.defineGetterSetter(_p, 'maxLength', _p.getMaxLength, _p.setMaxLength);
/** @expose */
_p.placeHolder;
cc.defineGetterSetter(_p, 'placeholder', _p.getPlaceHolder, _p.setPlaceHolder);
/** @expose */
_p.placeHolderFont;
cc.defineGetterSetter(_p, 'placeholderFont', null, _p._setPlaceholderFont);
/** @expose */
_p.placeHolderFontName;
cc.defineGetterSetter(_p, 'placeholderFontName', null, _p.setPlaceholderFontName);
/** @expose */
_p.placeHolderFontSize;
cc.defineGetterSetter(_p, 'placeholderFontSize', null, _p.setPlaceholderFontSize);
/** @expose */
_p.placeHolderFontColor;
cc.defineGetterSetter(_p, 'placeholderFontColor', null, _p.setPlaceholderFontColor);
/** @expose */
_p.inputFlag;
cc.defineGetterSetter(_p, 'inputFlag', null, _p.setInputFlag);
/** @expose */
_p.delegate;
cc.defineGetterSetter(_p, 'delegate', null, _p.setDelegate);
/** @expose */
_p.inputMode;
cc.defineGetterSetter(_p, 'inputMode', null, _p.setInputMode);
/** @expose */
_p.returnType;
cc.defineGetterSetter(_p, 'returnType', null, _p.setReturnType);

_p = null;

/**
 * get the rect of a node in world coordinate frame
 * @function
 * @param {_ccsg.Node} node
 * @return {cc.Rect}
 */
_ccsg.EditBox.getRect = function (node) {
    var contentSize = node.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.rectApplyAffineTransform(rect, node.getNodeToWorldTransform());
};

_ccsg.EditBox.InputMode = InputMode;
_ccsg.EditBox.InputFlag = InputFlag;
_ccsg.EditBox.KeyboardReturnType = KeyboardReturnType;
