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
 * Class for tiled map asset handling.
 * @class TiledMapAsset
 * @extends Asset
 *
 */
var TiledMapAsset = cc.Class({
    name: 'cc.TiledMapAsset',
    extends: cc.Asset,

    properties: {
        tmxXmlStr: '',
        tmxFolderPath: '',

        /**
         * @property {Texture2D[]} textures
         */
        textures: {
            default: [],
            type: [cc.Texture2D]
        },

        /**
         * @property {String[]} textureNames
         */
        textureNames: [cc.String],

        tsxFiles: [cc.RawAsset]
    },

    statics: {
        preventDeferredLoadDependents: true
    },

    createNode: CC_EDITOR && function (callback) {
        var node = new cc.Node(this.name);
        var tiledMap = node.addComponent(cc.TiledMap);
        tiledMap.tmxAsset = this;

        return callback(null, node);
    }
});

cc.TiledMapAsset = TiledMapAsset;
module.exports = TiledMapAsset;
