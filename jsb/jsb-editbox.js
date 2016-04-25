/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

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

_p._setMaxLength = _p.setMaxLength;
_p.setMaxLength = function(maxLength) {
    if (maxLength == -1) {
        maxLength = Number.MAX_VALUE;
    }
    this._setMaxLength(maxLength);
}

_p.setLineHeight = function () {}

_p = null;
