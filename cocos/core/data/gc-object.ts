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
import { ccclass } from './decorators';
import { garbageCollectionManager, GarbageCollectorContext } from './garbage-collection';
import { CCObject } from './object';

@ccclass('cc.GCObject')
export class GCObject extends CCObject {
    public declare _finalizationToken: any;

    public _internalId = -1;
    public _ignoreId = -1;
    private _ref = 0;

    constructor (...arg: ConstructorParameters<typeof CCObject>) {
        super(...arg);
        return garbageCollectionManager.registerGCObject(this);
    }

    public destroy () {
        garbageCollectionManager.unregisterGCObject(this);
        garbageCollectionManager.unregisterIgnoredGCObject(this);
        garbageCollectionManager.removeGCObjectFromRoot(this);
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
            garbageCollectionManager.registerIgnoredGCObject(this);
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
            garbageCollectionManager.unregisterIgnoredGCObject(this);
        }
        return this;
    }

    public markDependencies? (context: GarbageCollectorContext);
}
