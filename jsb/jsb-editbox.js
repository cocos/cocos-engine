/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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

'use strict';

var _p = cc.EditBox.prototype;
cc.defineGetterSetter(_p, 'font', null, _p.setFont);
cc.defineGetterSetter(_p, 'fontName', null, _p.setFontName);
cc.defineGetterSetter(_p, 'fontSize', null, _p.setFontSize);
cc.defineGetterSetter(_p, 'fontColor', null, _p.setFontColor);
cc.defineGetterSetter(_p, 'string', _p.getString, _p.setString);
cc.defineGetterSetter(_p, 'maxLength', _p.getMaxLength, _p.setMaxLength);
cc.defineGetterSetter(_p, 'placeHolder', _p.getPlaceHolder, _p.setPlaceHolder);
cc.defineGetterSetter(_p, 'placeHolderFont', null, _p.setPlaceholderFont);
cc.defineGetterSetter(_p, 'placeHolderFontName', null, _p.setPlaceholderFontName);
cc.defineGetterSetter(_p, 'placeHolderFontSize', null, _p.setPlaceholderFontSize);
cc.defineGetterSetter(_p, 'placeHolderFontColor', null, _p.setPlaceholderFontColor);
cc.defineGetterSetter(_p, 'inputFlag', null, _p.setInputFlag);
cc.defineGetterSetter(_p, 'delegate', null, _p.setDelegate);
cc.defineGetterSetter(_p, 'inputMode', null, _p.setInputMode);
cc.defineGetterSetter(_p, 'returnType', null, _p.setReturnType);


_p.editBoxEditingDidBegin = function (sender) {
    this.editBoxEditingDidBegan(sender);
}
_p.editBoxEditingDidEnd = function (sender) {
    this.editBoxEditingDidEnded(sender);
}

_p = null;
