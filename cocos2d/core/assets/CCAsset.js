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
 * Base class for handling assets used in Creator.<br/>
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 * !#zh
 * Creator 中的资源基类。<br/>
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
         * @property nativeUrl
         * @type {String}
         * @readOnly
         */
        nativeUrl: {
            get: function () {
                if (this._native) {
                    if (cc.AssetLibrary) {
                        var base = cc.AssetLibrary.getLibUrlNoExt(this._uuid);
                        var name = this._native;
                        if (name.charCodeAt(0) === 46) {  // '.'
                            // imported in dir where json exist
                            return base + name;
                        }
                        else {
                            // imported in an independent dir
                            return base + '/' + name;
                        }
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
         * 在 lite 版的 Fireball 里，raw asset 并不仅仅是在 properties 里声明了 rawType 才有，
         * 而是每个 asset 都能指定自己的 raw file url。这些 url 就存在 _rawFiles 字段中。
         * AssetLibrary 并不会帮你加载这些 url，除非你声明了 rawType。
         * 在 Creator 里，_rawFiles 保留了下来，为了复用 cocos 引擎原有实现，直接用 _rawFiles 来加载 Asset 在 import 之前的源文件。
         *
         * @property _native
         * @type {String}
         * @default ""
         * @private
         */
        _native: "",

        /**
         * The underlying native object of this asset if one is available.
         * The object can be used to access additional details or functionality releated to the asset.
         * The object will be initialized by the loader if `_native` is available.
         * @property {Object} _nativeObject
         * @default null
         * @private
         */
        _nativeObject: {
            default: null,
            serializable: false
        },
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
        deserialize: CC_EDITOR && function (data) {
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
        preventDeferredLoadDependents: false,

        /**
         * !#en Indicates whether its native object should be preloaded from native url.
         * !#zh 禁止预加载原生对象。
         *
         * @property {Boolean} preventPreloadNativeObject
         * @default false
         * @static
         */
        preventPreloadNativeObject: false
    },

    /**
     * 应 AssetDB 要求提供这个方法
     *
     * @method serialize
     * @return {String}
     * @private
     */
    serialize: CC_EDITOR && function () {
        return Editor.serialize(this);
    },

    /**
     * !#en
     * Create a new node using this asset in the scene.<br/>
     * If this type of asset dont have its corresponding node type, this method should be null.
     * !#zh
     * 使用该资源在场景中创建一个新节点。<br/>
     * 如果这类资源没有相应的节点类型，该方法应该是空的。
     *
     * @method createNode
     * @param {Function} callback
     * @param {String} callback.error - null or the error info
     * @param {Object} callback.node - the created node or null
     */
    createNode: null,

    /**
     * Set native file name for this asset.
     *
     * @method _setRawAsset
     * @param {String} filename
     * @private
     */
    _setRawAsset: (CC_EDITOR || CC_TEST) && function (filename) {
        this._native = filename || "";
    }
});

module.exports = cc.Asset;
