/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

var _p = cc.EditBox.prototype;

_p._setMaxLength = _p.setMaxLength;
_p.setMaxLength = function(maxLength) {
    if (maxLength < 0) {
        maxLength = 65535;
    }
    this._setMaxLength(maxLength);
};

cc.defineGetterSetter(_p, 'font', null, _p.setFont);
cc.defineGetterSetter(_p, 'fontName', null, _p.setFontName);
cc.defineGetterSetter(_p, 'fontSize', null, _p.setFontSize);
cc.defineGetterSetter(_p, 'fontColor', null, _p.setFontColor);
cc.defineGetterSetter(_p, 'string', _p.getString, _p.setString);
cc.defineGetterSetter(_p, 'maxLength', _p.getMaxLength, _p.setMaxLength);
cc.defineGetterSetter(_p, 'placeholder', _p.getPlaceHolder, _p.setPlaceHolder);
cc.defineGetterSetter(_p, 'placeholderFont', null, _p.setPlaceholderFont);
cc.defineGetterSetter(_p, 'placeholderFontName', null, _p.setPlaceholderFontName);
cc.defineGetterSetter(_p, 'placeholderFontSize', null, _p.setPlaceholderFontSize);
cc.defineGetterSetter(_p, 'placeholderFontColor', null, _p.setPlaceholderFontColor);
cc.defineGetterSetter(_p, 'inputFlag', null, _p.setInputFlag);
cc.defineGetterSetter(_p, 'delegate', null, _p.setDelegate);
cc.defineGetterSetter(_p, 'inputMode', null, _p.setInputMode);
cc.defineGetterSetter(_p, 'returnType', null, _p.setReturnType);


_p.setLineHeight = function () {};

_p.setTabIndex = function () {};
_p.getTabIndex = function () { return -1; };
_p.setFocus = function () {};
_p.isFocused = function () { return false; };
_p.stayOnTop = function () {};



cc.EditBox.InputMode = cc.Enum({
    
    ANY: 0,

    /**
     * The user is allowed to enter an e-mail address.
     */
    EMAIL_ADDR: 1,

    /**
     * The user is allowed to enter an integer value.
     */
    NUMERIC: 2,

    /**
     * The user is allowed to enter a phone number.
     */
    PHONE_NUMBER: 3,

    /**
     * The user is allowed to enter a URL.
     */
    URL: 4,

    /**
     * The user is allowed to enter a real number value.
     * This extends kEditBoxInputModeNumeric by allowing a decimal point.
     */
    DECIMAL: 5,

    /**
     * The user is allowed to enter any text, except for line breaks.
     */
    SINGLE_LINE: 6
});

/**
 * Enum for the EditBox's input flags
 * @readonly
 * @enum {number}
 * @memberof cc.EditBox
 */
cc.EditBox.InputFlag = cc.Enum({
    /**
     * Indicates that the text entered is confidential data that should be
     * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
     */
    PASSWORD: 0,

    /**
     * Indicates that the text entered is sensitive data that the
     * implementation must never store into a dictionary or table for use
     * in predictive, auto-completing, or other accelerated input schemes.
     * A credit card number is an example of sensitive data.
     */
    SENSITIVE: 1,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each word should be capitalized.
     */
    INITIAL_CAPS_WORD: 2,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each sentence should be capitalized.
     */
    INITIAL_CAPS_SENTENCE: 3,

    /**
     * Capitalize all characters automatically.
     */
    INITIAL_CAPS_ALL_CHARACTERS: 4,

    /**
     * Don't do anything with the input text.
     */
    DEFAULT: 5
});

/**
 * Enum for keyboard return types
 * @readonly
 * @enum {number}
 */
cc.EditBox.KeyboardReturnType = cc.Enum({
    DEFAULT: 0,
    DONE: 1,
    SEND: 2,
    SEARCH: 3,
    GO: 4
});