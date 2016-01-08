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

// cc.Label
var jsbLabel = cc.Label;
// v3.3 bug fix
if (!jsbLabel.createWithTTF && jsbLabel.prototype.createWithTTF) {
    jsbLabel.createWithTTF = jsbLabel.prototype.createWithTTF;
}
jsbLabel.prototype.setHorizontalAlign = jsbLabel.prototype.setHorizontalAlignment;
jsbLabel.prototype.setVerticalAlign = jsbLabel.prototype.setVerticalAlignment;
//for back compatibility
if (!jsbLabel.prototype.setBMFontSize) {
    jsbLabel.prototype.setBMFontSize = function(){};
}
if (!jsbLabel.prototype.getBMFontSize) {
    jsbLabel.prototype.getBMFontSize = function(){};
}
if (!jsbLabel.prototype.setOverflow) {
    jsbLabel.prototype.setOverflow = function(){};
}
if (!jsbLabel.prototype.getOverflow) {
    jsbLabel.prototype.getOverflow = function(){};
}

jsbLabel.prototype.setFontSize = function (size) {
    if (this._labelType === _ccsg.Label.Type.SystemFont) {
        this.setSystemFontSize(size);
    }
    else if (this._labelType === _ccsg.Label.Type.BMFont) {
        this.setBMFontSize(size);
    }
    else if (this._labelType === _ccsg.Label.Type.TTF) {
        var ttfConfig = this.getTTFConfig();
        ttfConfig.fontSize = size;
        this.setTTFConfig(ttfConfig);
    }
};

jsbLabel.prototype.enableWrapText = jsbLabel.prototype.enableWrap || function(){};
jsbLabel.prototype.isWrapTextEnabled = jsbLabel.prototype.isWrapEnabled || function(){};

jsbLabel.prototype._setLineHeight = jsbLabel.prototype.setLineHeight;
jsbLabel.prototype.setLineHeight = function (height) {
    if (this._labelType !== _ccsg.Label.Type.SystemFont) {
        this._setLineHeight(height);
    }
};

jsbLabel.prototype._setTTFConfig = jsbLabel.prototype.setTTFConfig;
jsbLabel.prototype.setTTFConfig = function (config) {
    this._setTTFConfig(config);
    this._ttfConfig = config;
};
jsbLabel.prototype.getTTFConfig = function () {
    return this._ttfConfig;
};

jsbLabel.prototype.setContentSize = function(size, height) {
    if(height !== undefined){
        this.setDimensions(size, height);
    }
    else{
        this.setDimensions(size.width, size.height);
    }
};
cc.Label = function (string, fontHandle) {
    fontHandle = fontHandle || "Arial";
    var extName = cc.path.extname(fontHandle);

    var type = _ccsg.Label.Type.TTF;

    var label;
    if (extName === ".ttf") {
        var ttfConfig = {
            fontFilePath: fontHandle,
            fontSize: 40,
            outlineSize: 0,
            glyphs: 0,
            customGlyphs: "",
            distanceFieldEnable: false
        };
        label = jsbLabel.createWithTTF(ttfConfig, string, 40);
        label._ttfConfig = ttfConfig;
    }
    else if (extName === ".fnt") {
        label = jsbLabel.createWithBMFont(fontHandle, string);
        type = _ccsg.Label.Type.BMFont;
    }
    else {
        label = jsbLabel.createWithSystemFont(string, fontHandle, 40);
        type = _ccsg.Label.Type.SystemFont;
    }
    label._labelType = type;
    return label;
};
cc.Label.Type = cc.Enum({
    TTF: 0,
    BMFont: 1
});
cc.Label.Overflow = cc.Enum({
    //TODO: uncomment if normal is supported in web
    // NONE: 0,
    CLAMP: 1,
    SHRINK: 2,
    RESIZE_HEIGHT: 3
});