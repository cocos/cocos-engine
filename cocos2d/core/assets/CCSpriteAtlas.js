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

/**
 * !#en Class for sprite atlas handling.
 * !#zh 精灵图集资源类。
 * @class SpriteAtlas
 * @extends Asset
 */
var SpriteAtlas = cc.Class({
    name: 'cc.SpriteAtlas',
    extends: cc.Asset,
    properties: {
        _spriteFrames: {
            default: {}
        },
    },

    /**
     * Returns the texture of the sprite atlas
     * @method getTexture
     * @returns {Texture2D}
     */
    getTexture: function () {
        var keys = Object.keys(this._spriteFrames);
        if (keys.length > 0) {
            var spriteFrame = this._spriteFrames[keys[0]];
            return spriteFrame ? spriteFrame.getTexture() : null;
        }
        else {
            return null;
        }
    },

    /**
     * Returns the sprite frame correspond to the given key in sprite atlas.
     * @method getSpriteFrame
     * @param {String} key
     * @returns {SpriteFrame}
     */
    getSpriteFrame: function (key) {
        let sf = this._spriteFrames[key];
        if (!sf) {
            return null;
        } 
        if (!sf.name) {
            sf.name = key;
        }
        return sf;
    },

    /**
     * Returns the sprite frames in sprite atlas.
     * @method getSpriteFrames
     * @returns {[SpriteFrame]}
     */
    getSpriteFrames: function () {
        var frames = [];
        var spriteFrames = this._spriteFrames;

        for (var key in spriteFrames) {
            frames.push(this.getSpriteFrame(key));
        }

        return frames;
    }
});

cc.SpriteAtlas = SpriteAtlas;
module.exports =  SpriteAtlas;
