/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
import { EDITOR } from 'internal:constants';
import { ccclass } from './decorators';
import { finalizationManager } from './finalization-manager';
import { garbageCollectionManager, GarbageCollectorContext } from './garbage-collection';
import { CCObject } from './object';

@ccclass('cc.GCObject')
export class GCObject extends CCObject {
    private declare _finalizationToken: any;

    private static _allGCObjects: GCObject[] = [];
    private static _ignoreGCObjects: GCObject[] = [];

    public static getAllGCObject (): readonly GCObject[] {
        return GCObject._allGCObjects;
    }

    public static getIgnoreFromGCObjects (): readonly GCObject[] {
        return GCObject._ignoreGCObjects;
    }

    private _internalId = -1;
    private _ignoreId = -1;
    private _ref = 0;

    constructor (...arg: ConstructorParameters<typeof CCObject>) {
        super(...arg);
        const id = GCObject._allGCObjects.length;
        GCObject._allGCObjects.push(this);
        this._internalId = id;
        if (EDITOR) {
            this._finalizationToken = {};
            const proxy = new Proxy(this, {});
            finalizationManager.register(proxy, this, this._finalizationToken);
            return proxy;
        }
    }

    public destroy () {
        if (this._internalId !== -1) {
            const tail = GCObject._allGCObjects[GCObject._allGCObjects.length - 1];
            tail._internalId = this._internalId;
            GCObject._allGCObjects[this._internalId] = tail;
            GCObject._allGCObjects.length -= 1;
            this._internalId = -1;
        }
        if (this._ignoreId !== -1) {
            const tail = GCObject._ignoreGCObjects[GCObject._ignoreGCObjects.length - 1];
            tail._ignoreId = this._ignoreId;
            GCObject._ignoreGCObjects[this._ignoreId] = tail;
            GCObject._ignoreGCObjects.length -= 1;
            this._ignoreId = -1;
        }
        garbageCollectionManager.removeCCClassObjectFromRoot(this);
        if (EDITOR) finalizationManager.unregister(this._finalizationToken);
        return super.destroy();
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
    public addRef () {
        if (this._ref === 0) {
            this._ignoreId = GCObject._ignoreGCObjects.length;
            GCObject._ignoreGCObjects.push(this);
        }
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
    public decRef () {
        this._ref--;
        if (this._ref === 0) {
            const tail = GCObject._ignoreGCObjects[GCObject._ignoreGCObjects.length - 1];
            tail._ignoreId = this._ignoreId;
            GCObject._ignoreGCObjects[this._ignoreId] = tail;
            GCObject._ignoreGCObjects.length -= 1;
            this._ignoreId = -1;
        }
        return this;
    }

    public markDependencies? (context: GarbageCollectorContext);
}
