/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
*/

/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { Eventify } from '../event';
import { RawAsset } from './raw-asset';
import { Node } from '../scene-graph';
import { legacyCC } from '../global-exports';
import { errorID } from '../platform/debug';

/**
 * @en
 * Base class for handling assets used in Creator.<br/>
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - getset functions of _nativeAsset<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 * @zh
 * Creator 中的资源基类。<br/>
 *
 * 您可能需要重写：<br/>
 * - createNode <br/>
 * - _nativeAsset 的 getset 方法<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 *
 * @class Asset
 * @extends RawAsset
 */
@ccclass('cc.Asset')
export class Asset extends Eventify(RawAsset) {

    /**
     * @en Indicates whether its dependent raw assets can support deferred load if the owner scene (or prefab) is marked as `asyncLoadAssets`.
     * @zh 当场景或 Prefab 被标记为 `asyncLoadAssets`，禁止延迟加载该资源所依赖的其它 RawAsset。
     *
     * @property {Boolean} preventDeferredLoadDependents
     * @default false
     * @static
     */
    public static preventDeferredLoadDependents = false;

    /**
     * @en Indicates whether its native object should be preloaded from native url.
     * @zh 禁止预加载原生对象。
     *
     * @property {Boolean} preventPreloadNativeObject
     * @default false
     * @static
     */
    public static preventPreloadNativeObject = false;

    /**
     * 应 AssetDB 要求提供这个方法。
     * @method deserialize
     * @param {String} data
     * @return {Asset}
     */
    public static deserialize (data) {
        return legacyCC.deserialize(data);
    }

    /**
     * @en
     * Whether the asset is loaded or not
     * @zh
     * 该资源是否已经成功加载。
     */
    public loaded = true;

    /**
     * @en
     * Serializable url for native asset. For internal usage.
     * @zh
     * 用于本机资产的可序列化URL。供内部使用。
     * @default ""
     */
    @property
    public _native: string = '';

    private _file: any = null;

    /**
     * @en
     * Returns the url of this asset's native object, if none it will returns an empty string.
     * @zh
     * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
     * @property nativeUrl
     * @type {String}
     * @readOnly
     */
    @property({
        visible: false,
    })
    get nativeUrl () {
        if (this._native) {
            const name = this._native;
            if (name.charCodeAt(0) === 47) {    // '/'
                // remove library tag
                // not imported in library, just created on-the-fly
                return name.slice(1);
            }
            if (legacyCC.AssetLibrary) {
                const base = legacyCC.AssetLibrary.getLibUrlNoExt(this._uuid, true);
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
                errorID(6400);
            }
        }
        return '';
    }

    /**
     * @en
     * The underlying native asset of this asset if one is available.<br>
     * This property can be used to access additional details or functionality releated to the asset.<br>
     * This property will be initialized by the loader if `_native` is available.
     * @zh
     * 此资源的基础资源（如果有）。 此属性可用于访问与资源相关的其他详细信息或功能。<br>
     * 如果`_native`可用，则此属性将由加载器初始化。
     * @property {Object} _nativeAsset
     * @default null
     * @private
     * @type {any}
     */
    @property
    get _nativeAsset (): any {
        return this._file;
    }
    set _nativeAsset (obj) {
        this._file = obj;
    }

    /**
     * @en
     * Returns the string representation of the object.<br>
     * The `Asset` object overrides the `toString()` method of the `Object` object.<br>
     * JavaScript calls the toString() method automatically<br>
     * when an asset is to be represented as a text value or when a texture is referred to in a string concatenation.<br>
     * <br>
     * For assets of the native type, it will return `this.nativeUrl`.<br>
     * Otherwise, an empty string is returned.<br>
     * This method may be overwritten by subclasses.
     * @zh
     * 返回对象的字符串表示形式。<br>
     * `Asset` 对象将会重写 `Object` 对象的 `toString()` 方法。<br>
     * 当资源要表示为文本值时或在字符串连接时引用时，<br>
     * JavaScript 会自动调用 toString() 方法。<br>
     * <br>
     * 对于原始类型的资源，它将返回`this.nativeUrl`。<br>
     * 否则，返回空字符串。<br>
     * 子类可能会覆盖此方法。
     * @method toString
     * @return {String}
     */
    public toString () {
        return this.nativeUrl;
    }

    /**
     * 应 AssetDB 要求提供这个方法。
     * 返回一个序列化后的对象
     *
     * @method serialize
     * @return {String}
     * @private
     */
    public serialize () { }

    /**
     * @en
     * Set native file name for this asset.
     * @zh
     * 为此资源设置原始文件名。
     * @seealso nativeUrl
     *
     * @param filename
     * @param inLibrary
     * @private
     */
    public _setRawAsset (filename: string, inLibrary: boolean = true) {
        if (inLibrary !== false) {
            this._native = filename || '';
        }
        else {
            this._native = '/' + filename;  // simply use '/' to tag location where is not in the library
        }
    }

    /**
     * @en
     * Create a new node using this asset in the scene.<br/>
     * If this type of asset dont have its corresponding node type, this method should be null.
     * @zh
     * 使用该资源在场景中创建一个新节点。<br/>
     * 如果这类资源没有相应的节点类型，该方法应该是空的。
     */
    public createNode? (callback: CreateNodeCallback): void;
}

/**
 * @param error - null or the error info
 * @param node - the created node or null
 */
type CreateNodeCallback = (error: Error | null, node: Node) => void;

// @ts-ignore
Asset.prototype.createNode = null;

legacyCC.Asset = Asset;
