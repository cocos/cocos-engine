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

var CCObject = require('../platform/CCObject');

/**
 * !#en
 * Base class for handling assets used in Creator.<br/>
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - getset functions of _nativeAsset<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 * !#zh
 * Creator 中的资源基类。<br/>
 *
 * 您可能需要重写：<br/>
 * - createNode <br/>
 * - _nativeAsset 的 getset 方法<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 *
 * @class Asset
 * @extends Object
 */
cc.Asset = cc.Class({
    name: 'cc.Asset', extends: CCObject,

    ctor () {
        /**
         * @property {String} _uuid
         * @private
         */
        // enumerable is false by default, to avoid uuid being assigned to empty string during destroy
        Object.defineProperty(this, '_uuid', {
            value: '',
            writable: true,
        });
        /**
         * !#en
         * Whether the asset is loaded or not.
         * !#zh
         * 该资源是否已经成功加载。
         *
         * @property loaded
         * @type {Boolean}
         */
        this.loaded = true;
        this._nativeUrl = '';
        this._ref = 0;
    },

    properties: {
        /**
         * !#en
         * Returns the url of this asset's native object, if none it will returns an empty string.
         * !#zh
         * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
         * @property nativeUrl
         * @type {String}
         * @readOnly
         */
        nativeUrl: {
            get: function () {
                if (!this._nativeUrl) {
                    if (this._native) {
                        var name = this._native;
                        if (name.charCodeAt(0) === 47) {    // '/'
                            // remove library tag
                            // not imported in library, just created on-the-fly
                            return name.slice(1);
                        }
                        if (name.charCodeAt(0) === 46) {  // '.'
                                // imported in dir where json exist
                            this._nativeUrl = cc.assetManager.utils.getUrlWithUuid(this._uuid, {nativeExt: name, isNative: true });
                        }
                        else {
                            // imported in an independent dir
                            this._nativeUrl = cc.assetManager.utils.getUrlWithUuid(this._uuid, {__nativeName__: name, nativeExt: cc.path.extname(name), isNative: true});
                        }
                    }
                }
                return this._nativeUrl;
            },
            visible: false
        },

        /**
         * !#en
         * The number of reference
         *
         * !#zh
         * 引用的数量
         *
         * @property refCount
         * @type {Number}
         */
        refCount: {
            get () {
                return this._ref;
            }
        },

        /**
         * !#en
         * Serializable url for native asset.
         * !#zh
         * 保存原生资源的 URL。
         * @property {String} _native
         * @default undefined
         * @private
         */
        _native: "",

        /**
         * !#en
         * The underlying native asset of this asset if one is available.
         * This property can be used to access additional details or functionality releated to the asset.
         * This property will be initialized by the loader if `_native` is available.
         * !#zh
         * 此资源依赖的底层原生资源（如果有的话）。
         * 此属性可用于访问与资源相关的其他详细信息或功能。
         * 如果 `_native` 可用，则此属性将由加载器初始化。
         * @property {Object} _nativeAsset
         * @default null
         * @private
         */
        _nativeAsset: {
            get () {
                return this._$nativeAsset;
            },
            set (obj) {
                this._$nativeAsset = obj;
            }
        },

        _nativeDep: {
            get () {
                if (this._native) {
                    return {__isNative__: true, uuid: this._uuid, ext: this._native};
                }
            }
        }
    },

    statics: {
        /**
         * !#en
         * Provide this method at the request of AssetDB.
         * !#zh
         * 应 AssetDB 要求提供这个方法。
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
         * !#zh 当场景或 Prefab 被标记为 `asyncLoadAssets`，禁止延迟加载该资源所依赖的其它原始资源。
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
     * !#en
     * Returns the asset's url.

     * The `Asset` object overrides the `toString()` method of the `Object` object.
     * For `Asset` objects, the `toString()` method returns a string representation of the object.
     * JavaScript calls the `toString()` method automatically when an asset is to be represented as a text value or when a texture is referred to in a string concatenation.
     * !#zh
     * 返回资源的 URL。
     *
     * Asset 对象将会重写 Object 对象的 `toString()` 方法。
     * 对于 Asset 对象，`toString()` 方法返回该对象的字符串表示形式。
     * 当资源要表示为文本值时或在字符串连接时引用时，JavaScript 会自动调用 `toString()` 方法。
     * @method toString
     * @return {String}
     */
    toString () {
        return this.nativeUrl;
    },

    /**
     * !#en
     * Provide this method at the request of AssetDB.
     * !#zh
     * 应 AssetDB 要求提供这个方法。
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
     * !#en
     * Set native file name for this asset.
     * !#zh
     * 为此资源设置原生文件名。
     *
     * @seealso nativeUrl
     *
     * @method _setRawAsset
     * @param {String} filename
     * @param {Boolean} [inLibrary=true]
     * @private
     */
    _setRawAsset: function (filename, inLibrary) {
        if (inLibrary !== false) {
            this._native = filename || undefined;
        }
        else {
            this._native = '/' + filename;  // simply use '/' to tag location where is not in the library
        }
    },

    /**
     * !#en
     * Add references of asset
     *
     * !#zh
     * 增加资源的引用
     *
     * @method addRef
     * @return {Asset} itself
     *
     * @typescript
     * addRef(): cc.Asset
     */
    addRef () {
        this._ref++;
        return this;
    },

    /**
     * !#en
     * Reduce references of asset and it will be auto released when refCount equals 0.
     *
     * !#zh
     * 减少资源的引用并尝试进行自动释放。
     *
     * @method decRef
     * @return {Asset} itself
     *
     * @typescript
     * decRef(): cc.Asset
     */
    decRef (autoRelease) {
        this._ref > 0 && this._ref--;
        autoRelease !== false && cc.assetManager._releaseManager.tryRelease(this);
        return this;
    },

    destroy () {
        this.loaded = false;
        return this._super();
    }
});

module.exports = cc.Asset;
