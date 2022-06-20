/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.
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
import { EDITOR } from 'internal:constants';
import { GCObject } from './gc-object';

declare class FinalizationRegistry {
    constructor (callback: (heldObj: any) => void);
    register (obj: any, heldObj: any, token?: any);
    unregister (token: any);
}

const targetSymbol = Symbol('[[target]]');

class GarbageCollectionManager {
    private _finalizationRegistry: FinalizationRegistry | null = EDITOR && typeof FinalizationRegistry !== 'undefined' ? new FinalizationRegistry(this.finalizationRegistryCallback.bind(this)) : null;
    private _gcObjects: WeakMap<any, GCObject> = new WeakMap();

    public registerGCObject (gcObject: GCObject): GCObject {
        if (EDITOR && this._finalizationRegistry) {
            const token = {};
            const proxy = new Proxy(gcObject, {
                get (target, property, receiver) {
                    if (property === targetSymbol) {
                        return target;
                    }
                    let val = target[property];
                    if (typeof val === 'function' && property !== 'constructor') {
                        const original = val;
                        val = function newFunc () {
                            // @ts-expect-error this is referenced to proxy
                            return original.apply(this[targetSymbol], arguments) as unknown;
                        };
                    }
                    return val as unknown;
                },
                set (target, prop, value, receiver) {
                    target[prop] = value;
                    return true;
                },
            });
            this._gcObjects.set(token, gcObject);
            this._finalizationRegistry.register(proxy, token, token);
            return proxy;
        } else {
            return gcObject;
        }
    }

    public init () {
    }

    private finalizationRegistryCallback (token: any) {
        const gcObject = this._gcObjects.get(token);
        if (gcObject) {
            this._gcObjects.delete(token);
            gcObject.destroy();
        }
        this._finalizationRegistry!.unregister(token);
    }

    public destroy () {
    }
}

const garbageCollectionManager = new GarbageCollectionManager();
export { garbageCollectionManager };
