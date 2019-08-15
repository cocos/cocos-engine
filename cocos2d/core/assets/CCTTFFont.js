/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const Font = require('./CCFont');

/**
 * @module cc
 */
/**
 * !#en Class for TTFFont handling.
 * !#zh TTF 字体资源类。
 * @class TTFFont
 * @extends Font
 *
 */
var TTFFont = cc.Class({
    name: 'cc.TTFFont',
    extends: Font,

    properties: {
        _fontFamily: null,
        _nativeAsset: {
            type: cc.String,
            get () {
                return this._fontFamily;
            },
            set (value) {
                this._fontFamily = value || 'Arial';
            },
            override: true
        },

        _nativeDep: {
            get () {
                return { uuid: this._uuid, _native: this._native,  ext: cc.path.extname(this._native), isNative: true };
            },
            override: true
        }
    },

    statics: {
        _parseDepsFromJson () {
            return [];
        },

        _parseNativeDepFromJson (json) {
            return { _native: json._native,  ext: cc.path.extname(json._native), isNative: true };
        }
    }
});

cc.TTFFont = module.exports = TTFFont;
