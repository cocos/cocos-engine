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

let FontLetterDefinition = function() {
    this.u = 0;
    this.v = 0;
    this.w = 0;
    this.h = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.textureID = 0;
    this.valid = false;
    this.xAdvance = 0;
};

let FontAtlas = function (texture) {
    this._letterDefinitions = {};
    this._texture = texture;
};

FontAtlas.prototype = {
    constructor: FontAtlas,
    addLetterDefinitions (letter, letterDefinition) {
        this._letterDefinitions[letter] = letterDefinition;
    },
    cloneLetterDefinition () {
        let copyLetterDefinitions = {};
        for (let key in this._letterDefinitions) {
            let value = new FontLetterDefinition();
            cc.js.mixin(value, this._letterDefinitions[key]);
            copyLetterDefinitions[key] = value;
        }
        return copyLetterDefinitions;
    },
    getTexture () {
        return this._texture;
    },
    getLetter (key) {
        return this._letterDefinitions[key];
    },
    getLetterDefinitionForChar (char) {
        let key = char.charCodeAt(0);
        let hasKey = this._letterDefinitions.hasOwnProperty(key);
        let letter;
        if (hasKey) {
            letter = this._letterDefinitions[key];
        } else {
            letter = null;
        }
        return letter;
    },
    clear () {
        this._letterDefinitions = {};
    }
};

/**
 * @module cc
 */
/**
 * !#en Class for BitmapFont handling.
 * !#zh 位图字体资源类。
 * @class BitmapFont
 * @extends Font
 *
 */
var BitmapFont = cc.Class({
    name: 'cc.BitmapFont',
    extends: cc.Font,

    properties: {
        fntDataStr: {
            default: ''
        },

        spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },

        fontSize: {
            default: -1
        },
        //用来缓存 BitmapFont 解析之后的数据
        _fntConfig: null,
        _fontDefDictionary: null
    },

    onLoad () {
        let spriteFrame = this.spriteFrame;
        if (!this._fontDefDictionary && spriteFrame) {
            this._fontDefDictionary = new FontAtlas(spriteFrame._texture);
        }

        let fntConfig = this._fntConfig;
        if (!fntConfig) {
            return;
        }
        let fontDict = fntConfig.fontDefDictionary;
        for (let fontDef in fontDict) {
            let letter = new FontLetterDefinition();

            let rect = fontDict[fontDef].rect;
            letter.offsetX = fontDict[fontDef].xOffset;
            letter.offsetY = fontDict[fontDef].yOffset;
            letter.w = rect.width;
            letter.h = rect.height;
            letter.u = rect.x;
            letter.v = rect.y;
            //FIXME: only one texture supported for now
            letter.textureID = 0;
            letter.valid = true;
            letter.xAdvance = fontDict[fontDef].xAdvance;

            this._fontDefDictionary.addLetterDefinitions(fontDef, letter);
        }
    }
});

cc.BitmapFont = BitmapFont;
cc.BitmapFont.FontLetterDefinition = FontLetterDefinition;
cc.BitmapFont.FontAtlas = FontAtlas;
module.exports = BitmapFont;
