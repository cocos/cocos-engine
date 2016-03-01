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

/**
 * Class for sprite animation asset handling.
 * @class SpriteAnimationAsset
 * @extends Asset
 * @constructor
 */
var SpriteAnimationAsset = cc.Class({
    name: 'cc.SpriteAnimationAsset',
    extends: cc.Asset,

    properties: {
        0: {
            default: '',
            url: cc.Texture2D
        },

        1: {
            default: '',
            url: cc.Texture2D
        },

        2: {
            default: '',
            url: cc.Texture2D
        },

        3: {
            default: '',
            url: cc.Texture2D
        },

        4: {
            default: '',
            url: cc.Texture2D
        },

        5: {
            default: '',
            url: cc.Texture2D
        },

        6: {
            default: '',
            url: cc.Texture2D
        },

        7: {
            default: '',
            url: cc.Texture2D
        },

        8: {
            default: '',
            url: cc.Texture2D
        },

        9: {
            default: '',
            url: cc.Texture2D
        },

        /**
         *
         *
         * @property loop
         * @type {Boolean}
         */
        loop: {
            default: true
        },

        /**
         *
         *
         * @property delay
         * @type {Number}
         */
        delay: {
            default: 0.5
        }
    },
});

cc.SpriteAnimationAsset = SpriteAnimationAsset;

module.exports = SpriteAnimationAsset;
