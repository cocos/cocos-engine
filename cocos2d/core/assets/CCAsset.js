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

var RawAsset = require('./CCRawAsset');
/**
 * Base class for handling assets used in Fireball. This class can be instantiate.
 *
 * You may want to override:
 * - createNode
 * - cc.Object._serialize
 * - cc.Object._deserialize
 *
 * @class Asset
 * @extends RawAsset
 * @constructor
 */
cc.Asset = cc.Class({
    name: 'cc.Asset', extends: RawAsset,

    properties: {
        /**
         * Returns the url of this asset's first raw file, if none of rawFile exists,
         * it will returns the url of this serialized asset.
         *
         * @property url
         * @type {String}
         * @readOnly
         */
        url: {
            get: function () {
                if (this._rawFiles) {
                    if (cc.AssetLibrary) {
                        var url = cc.AssetLibrary.getImportedDir(this._uuid);
                        var filename = this._rawFiles[0];
                        return url + '/' + filename;
                    }
                    else {
                        cc.error('asset.url is not usable in core process');
                    }
                }
                return '';
            },
            visible: false
        },

        /**
         * Returns the url of this asset's raw files, if none of rawFile exists,
         * it will returns an empty array.
         *
         * @property urls
         * @type {String[]}
         * @readOnly
         */
        urls: {
            get: function () {
                if (this._rawFiles) {
                    if (cc.AssetLibrary) {
                        var url = cc.AssetLibrary.getImportedDir(this._uuid);
                        return this._rawFiles.map(function (filename) {
                            return url + '/' + filename;
                        });
                    }
                    else {
                        cc.error('asset.urls is not usable in core process');
                    }
                }
                return [];
            },
            visible: false
        },

        /**
         * 在 lite 版的 Fireball 里，raw asset 并不仅仅是在 properties 里声明了 rawType 才有，
         * 而是每个 asset 都能指定自己的 raw file url。这些 url 就存在 _rawFiles 字段中。
         * AssetLibrary 并不会帮你加载这些 url，除非你声明了 rawType。
         *
         * @property _rawFiles
         * @type {String[]}
         * @default null
         * @private
         */
        _rawFiles: null
    },

    statics: {
        /**
         * 应 AssetDB 要求提供这个方法
         *
         * @method deserialize
         * @param {String} data
         * @return {Asset}
         * @static
         * @private
         */
        deserialize: function (data) {
            return cc.deserialize(data);
        }
    },

    /**
     * 应 AssetDB 要求提供这个方法
     *
     * @method serialize
     * @return {String}
     * @private
     */
    serialize: function () {
        return Editor.serialize(this);
    },

    /**
     * Create a new node using this asset in the scene.
     * If this type of asset dont have its corresponding node type, this method should be null.
     *
     * @method createNode
     * @param {Function} callback
     * @param {String} callback.error - null or the error info
     * @param {Object} callback.node - the created node or null
     */
    createNode: null,

    /**
     * Set raw extname for this asset.
     *
     * @method _setRawFiles
     * @param {String[]} rawFiles
     * @private
     */
    _setRawFiles: function (rawFiles) {
        rawFiles = rawFiles.map(function (item) {
            if (item.charAt(0) === '.') {
                item = item.slice(1);
            }
            var nextChar = item.charAt(0);
            if (nextChar === '/' || nextChar === '\\') {
                item = item.slice(1);
            }
            return item;
        });
        this._rawFiles = rawFiles.length > 0 ? rawFiles : null;
    }
});

module.exports = cc.Asset;
