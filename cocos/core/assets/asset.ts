/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, serializable } from 'cc.decorator';
import { EDITOR, PREVIEW } from 'internal:constants';
import { property } from '../data/decorators/property';
import { getUrlWithUuid } from '../asset-manager/helper';
import { Eventify } from '../event';
import { GCObject } from '../data/gc-object';
import { Node } from '../scene-graph';
import { legacyCC } from '../global-exports';
import { extname } from '../utils/path';
import { debug, getError, warn } from '../platform/debug';

/**
 * @en
 * Base class for handling assets used in Creator.<br/>
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - getset functions of _nativeAsset<br/>
 * - `Object._serialize`<br/>
 * - `Object._deserialize`<br/>
 * @zh
 * Creator 中的资源基类。<br/>
 *
 * 您可能需要重写：<br/>
 * - createNode <br/>
 * - _nativeAsset 的 getset 方法<br/>
 * - `Object._serialize`<br/>
 * - `Object._deserialize`<br/>
 *
 * @class Asset
 * @extends CCObject
 */
@ccclass('cc.Asset')
export class Asset extends Eventify(GCObject) {
    /**
     * 应 AssetDB 要求提供这个方法。
     * @method deserialize
     * @param {String} data
     * @return {Asset}
     */
    public static deserialize (data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return legacyCC.deserialize(data);
    }

    /**
     * @en
     * Whether the asset is loaded or not
     * @zh
     * 该资源是否已经成功加载。
     *
     * @deprecated since v3.3
     */
    public loaded = true;

    public declare _uuid: string;

    public declare isDefault: boolean;

    /**
     * @en
     * Serializable url for native asset. For internal usage.
     * @zh
     * 用于本机资产的可序列化URL。供内部使用。
     * @default ""
     */
    @serializable
    public _native = '';
    public _nativeUrl = '';

    private _file: any = null;
    private _ref = 0;

    /**
     * @en
     * Returns the url of this asset's native object, if none it will returns an empty string.
     * @zh
     * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
     * @readOnly
     */
    get nativeUrl () {
        if (!this._nativeUrl) {
            if (!this._native) return '';
            const name = this._native;
            if (name.charCodeAt(0) === 47) {    // '/'
                // remove library tag
                // not imported in library, just created on-the-fly
                return name.slice(1);
            }
            if (name.charCodeAt(0) === 46) {  // '.'
                // imported in dir where json exist
                this._nativeUrl = getUrlWithUuid(this._uuid, { nativeExt: name, isNative: true });
            } else {
                // imported in an independent dir
                this._nativeUrl = getUrlWithUuid(this._uuid, { __nativeName__: name, nativeExt: extname(name), isNative: true });
            }
        }
        return this._nativeUrl;
    }

    /**
     * @en
     * The underlying native asset of this asset if one is available.<br>
     * This property can be used to access additional details or functionality related to the asset.<br>
     * This property will be initialized by the loader if `_native` is available.
     * @zh
     * 此资源的基础资源（如果有）。 此属性可用于访问与资源相关的其他详细信息或功能。<br>
     * 如果`_native`可用，则此属性将由加载器初始化。
     * @default null
     * @private
     */
    @property
    get _nativeAsset () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._file;
    }
    set _nativeAsset (obj) {
        this._file = obj;
    }

    constructor (...args: ConstructorParameters<typeof GCObject>) {
        super(...args);

        Object.defineProperty(this, '_uuid', {
            value: '',
            writable: true,
            // enumerable is false by default, to avoid uuid being assigned to empty string during destroy
        });

        if (EDITOR || PREVIEW) {
            Object.defineProperty(this, 'isDefault', {
                value: false,
                writable: true,
            });
        }
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
    public _setRawAsset (filename: string, inLibrary = true) {
        if (inLibrary !== false) {
            this._native = filename || '';
        } else {
            this._native = `/${filename}`;  // simply use '/' to tag location where is not in the library
        }
    }

    /**
     * @en
     * Create a new node using this asset in the scene.<br/>
     * If this type of asset don't have its corresponding node type, this method should be null.
     * @zh
     * 使用该资源在场景中创建一个新节点。<br/>
     * 如果这类资源没有相应的节点类型，该方法应该是空的。
     */
    public createNode? (callback: CreateNodeCallback): void;

    public get _nativeDep () {
        if (this._native) {
            return { __isNative__: true, uuid: this._uuid, ext: this._native };
        }
        return undefined;
    }

    /**
     * @en
     * The number of reference
     *
     * @zh
     * 引用的数量
     */
    public get refCount (): number {
        return this._ref;
    }

    /**
     * @en
     * Add references of asset
     *
     * @zh
     * 增加资源的引用
     *
     * @return itself
     *
     */
    public addRef (): Asset {
        this._ref++;
        return this;
    }

    /**
     * @en
     * Reduce references of asset and it will be auto released when refCount equals 0.
     *
     * @zh
     * 减少资源的引用并尝试进行自动释放。
     *
     * @return itself
     *
     */
    public decRef (autoRelease = true): Asset {
        if (this._ref > 0) {
            this._ref--;
        }
        if (autoRelease) {
            legacyCC.assetManager._releaseManager.tryRelease(this);
        }
        return this;
    }

    public onLoaded () {}

    public initDefault (uuid?: string) {
        if (uuid) { this._uuid = uuid; }
        this.isDefault = true;
    }

    public validate (): boolean {
        return true;
    }

    public destroy () {
        debug(getError(12101, this._uuid));
        return super.destroy();
    }
}

/**
 * @param error - null or the error info
 * @param node - the created node or null
 */
type CreateNodeCallback = (error: Error | null, node: Node) => void;

Asset.prototype.createNode = null!;

legacyCC.Asset = Asset;
