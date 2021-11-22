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

const Asset = require('./CCAsset');

const GifAsset = cc.Class({
    name: 'cc.GifAsset',
    extends: Asset,

    properties: {
        /**
         * !#en Gif prefab is used to create node
         * !#zh gif 节点预制
         * @property prefab
         * @type {Prefab}
         * @default null
         */
        _prefab: {
            default: null,
            type: cc.Prefab
        },
        prefab: {
            get: function () {
                return this._prefab;
            },
            set: function (value) {
                this._prefab = value;
            },
            type: cc.Prefab,
        },
        /**
         * !#en Gif sequence SpriteFrame
         * !#zh gif 序列 SpriteFrame
         * @property spriteFrames
         * @type {Object}
         * @default {}
         */
        _spriteFrames: {
            default: {},
            type: cc.SpriteFrame,
        },
        /**
         * !#en Gif AnimationClip
         * !#zh gif 动画剪辑
         * @property animationClip
         * @type {AnimationClip}
         * @default null
         */
        _animationClip: {
            default: null,
            type: cc.AnimationClip,
        },
        animationClip: {
            get: function () {
                return this._animationClip;
            },
            set: function (value) {
                this._animationClip = value;
            },
            type: cc.AnimationClip,
        }
    },


    /**
     * !#en Get a single SpriteFrame by name
     * !#zh 通过名字获取单个 SpriteFrame
     * @method getSpriteFrame
     * @param {String} name
     * @returns {SpriteFrame}
     */
    getSpriteFrame: function (name) {
        let sf = this._spriteFrames[name];
        if (!sf) {
            return null;
        }
        if (!sf.name) {
            sf.name = name;
        }
        return sf;
    },

    /**
     * !#en Gif sequence SpriteFrame
     * !#zh gif 序列 SpriteFrame
     * @method getSpriteFrames
     * @returns {[SpriteFrame]}
     */
    getSpriteFrames: function () {
        const frames = [];
        const spriteFrames = this._spriteFrames;

        for (const key in spriteFrames) {
            frames.push(this.getSpriteFrame(key));
        }

        return frames;
    }
});
cc.GifAsset = GifAsset;
module.exports = GifAsset;
