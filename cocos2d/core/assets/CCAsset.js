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
 * !#en
 * Base class for handling assets used in Fireball. This class can be instantiate.
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 * !#zh
 * 资源基类，该类可以被实例化。<br/>
 *
 * 您可能需要重写：<br/>
 * - createNode <br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 *
 * @class Asset
 * @extends RawAsset
 */
cc.Asset = cc.Class({
    name: 'cc.Asset', extends: RawAsset,

    properties: {
        /**
         * !#en
         * Returns the url of this asset's first raw file, if none of rawFile exists,
         * it will returns an empty string.
         * !#zh 返回该资源的原始文件的 URL，如果不支持 RAW 文件，它将返回一个空字符串。
         * @property rawUrl
         * @type {String}
         * @readOnly
         */
        rawUrl: {
            get: function () {
                if (this._rawFiles) {
                    if (cc.AssetLibrary) {
                        return cc.AssetLibrary.getImportedDir(this._uuid) + '/' + this._rawFiles[0];
                    }
                    else {
                        cc.errorID(6400);
                    }
                }
                return '';
            },
            visible: false
        },

        /**
         * !#en
         * Returns the url of this asset's raw files, if none of rawFile exists,
         * it will returns an empty array.
         * !#zh 返回该资源的原文件的 URL 数组，如果不支持 RAW 文件，它将返回一个空数组。
         * @property rawUrls
         * @type {String[]}
         * @readOnly
         */
        rawUrls: {
            get: function () {
                if (this._rawFiles) {
                    if (cc.AssetLibrary) {
                        var dir = cc.AssetLibrary.getImportedDir(this._uuid) + '/';
                        return this._rawFiles.map(function (filename) {
                            return dir + filename;
                        });
                    }
                    else {
                        cc.errorID(6401);
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
         * 在 Creator 里，_rawFiles 保留了下来，为了复用 cocos 引擎原有实现，直接用 _rawFiles 来加载 Asset 在 import 之前的源文件。
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
        },

        /**
         * !#en Indicates whether its dependent raw assets can support deferred load if the owner scene (or prefab) is marked as `asyncLoadAssets`.
         * !#zh 当场景或 Prefab 被标记为 `asyncLoadAssets`，禁止延迟加载该资源所依赖的其它 RawAsset。
         *
         * @property {Boolean} preventDeferredLoadDependents
         * @default false
         * @static
         */
        preventDeferredLoadDependents: false
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
     * !#en
     * Create a new node using this asset in the scene.<br/>
     * If this type of asset dont have its corresponding node type, this method should be null.
     * !#zh
     * 使用该资源在场景中创建一个新节点。<br/>
     * 如果这类资源没有相应的节点类型，该方法应该是空的。
     * @method createNode
     * @param {Function} callback
     * @param {String} callback.error - null or the error info
     * @param {Object} callback.node - the created node or null
     */
    createNode: null,

    /**
     * Set raw file names for this asset.
     *
     * @method _setRawFiles
     * @param {String[]} rawFiles
     * @private
     */
    _setRawFiles: function (rawFiles) {
        this._rawFiles = rawFiles.length > 0 ? rawFiles : null;
    },

    /**
     * Preload raw files when loading scene.
     *
     * @method _preloadRawFiles
     * @param {Function} callback
     * @param {Error} callback.error
     * @private
     */
    _preloadRawFiles: null,
});

module.exports = cc.Asset;
