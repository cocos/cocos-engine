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

//fix jsb system font overflow
jsbLabel.prototype._setOverflow = jsbLabel.prototype.setOverflow;
jsbLabel.prototype.setOverflow = function(overflow) {
    this._overFlow = overflow;
    this._setOverflow(this._overFlow);
};

jsbLabel.prototype.getOverflow = function() {
    return this._overFlow;
};

if (!jsbLabel.prototype.isSystemFontUsed) {
    jsbLabel.prototype.isSystemFontUsed = function() {
        return this._isSystemFontUsed;
    };

    jsbLabel.prototype.setSystemFontUsed = function(value) {
        this._isSystemFontUsed = value;
        this.setSystemFontName("Arial");
        this.setSystemFontSize(this.getFontSize());
    }
}

jsbLabel.prototype.setFontSize = function (size) {
    this._fontSize = size;
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

jsbLabel.prototype.getFontSize = function () {
    return this._fontSize;
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

jsbLabel.prototype.setContentSize = function (size, height) {
    var newWidth = (typeof size.width === 'number') ? size.width : size;
    var newHeight = (typeof size.height === 'number') ? size.height : height;

    if(this.getOverflow() === cc.Label.Overflow.NONE) {
        newWidth = 0;
        newHeight = 0;
    }
    this.setDimensions(newWidth, newHeight);
};

jsbLabel.prototype.setFontFileOrFamily = function (fontHandle) {
    fontHandle = fontHandle || '';
    var extName = cc.path.extname(fontHandle);
    //specify font family name directly
    if (!extName) {
        this._labelType = _ccsg.Label.Type.SystemFont;
        this.setSystemFontName(fontHandle);
        this._isSystemFontUsed = true;
    }
    else {
        if (extName === '.ttf') {
            this._labelType = _ccsg.Label.Type.TTF;
            this._ttfConfig.fontFilePath = fontHandle;
            this.setTTFConfig(this._ttfConfig);
        } else if (extName === '.fnt') {
            this._labelType = _ccsg.Label.Type.BMFont;
            this.setBMFontFilePath(fontHandle);
            this.setFontSize(this.getFontSize());
        }
    }
    //FIXME: hack for bmfont crash. remove this line when it fixed in native
    this.getContentSize();
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
        label = jsbLabel.createWithSystemFont(string || '', fontHandle, 40);
        type = _ccsg.Label.Type.SystemFont;
        label._isSystemFontUsed = true;
    }
    label._labelType = type;
    return label;
};
cc.Label.Type = cc.Enum({
    TTF: 0,
    BMFont: 1,
    SystemFont: 2
});
cc.Label.Overflow = cc.Enum({
    NONE: 0,
    CLAMP: 1,
    SHRINK: 2,
    RESIZE_HEIGHT: 3
});
