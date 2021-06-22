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
import { finalizationManager } from './finalization-manager';
import { GarbageCollectorContext } from './garbage-collection';
import { CCObject } from './object';

export class GCObject extends CCObject {
    public ignoreFromGarbageCollection = true;
    public declare finalizationToken: any;

    private static _allGCObjects: GCObject[] = [];

    public static getAllGCObject (): readonly GCObject[] {
        return GCObject._allGCObjects;
    }

    private _internalId = -1;

    constructor (...arg: ConstructorParameters<typeof CCObject>) {
        super(...arg);
        const id = GCObject._allGCObjects.length;
        GCObject._allGCObjects.push(this);
        this._internalId = id;
        if (EDITOR) {
            this.finalizationToken = {};
            const proxy = new Proxy(this, {});
            finalizationManager.register(proxy, this);
            return proxy;
        }
    }

    public destroy () {
        if (this._internalId !== -1) {
            const tail = GCObject._allGCObjects[GCObject._allGCObjects.length - 1];
            tail._internalId = this._internalId;
            GCObject._allGCObjects.length -= 1;
            this._internalId = -1;
        }
        if (EDITOR) finalizationManager.unregister(this);
        return super.destroy();
    }

    public markDependencies? (context: GarbageCollectorContext);
}
