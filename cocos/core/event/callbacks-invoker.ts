/****************************************************************************
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
 ****************************************************************************/

import * as js from '../utils/js';
const fastRemoveAt = js.array.fastRemoveAt;

export class CallbackList {
    public callbacks: Array<Function | null> = [];
    public targets: Array<Object | null> = [];
    public isInvoking = false;
    public containCanceled = false;

    public removeBy (array: any[], value: any) {
        const callbacks = this.callbacks;
        const targets = this.targets;
        for (let i = 0; i < array.length; ++i) {
            if (array[i] === value) {
                fastRemoveAt(callbacks, i);
                fastRemoveAt(targets, i);
                --i;
            }
        }
    }

    public cancel (index: number) {
        this.callbacks[index] = this.targets[index] = null;
        this.containCanceled = true;
    }

    public cancelAll () {
        const callbacks = this.callbacks;
        const targets = this.targets;
        for (let i = 0; i < callbacks.length; i++) {
            callbacks[i] = targets[i] = null;
        }
        this.containCanceled = true;
    }

    // filter all removed callbacks and compact array
    public purgeCanceled () {
        this.removeBy(this.callbacks, null);
        this.containCanceled = false;
    }
}

const MAX_SIZE = 16;
const callbackListPool = new js.Pool((list: CallbackList) => {
    list.callbacks.length = 0;
    list.targets.length = 0;
    list.isInvoking = false;
    list.containCanceled = false;
}, MAX_SIZE);
callbackListPool.get = function () {
    return this._get() || new CallbackList();
};

/**
 * The CallbacksHandler is an abstract class that can register and unregister callbacks by key.
 * Subclasses should implement their own methods about how to invoke the callbacks.
 * @class _CallbacksHandler
 *
 * @private
 */

export class CallbacksHandler{
    protected _callbackTable: Map<string, CallbackList> = new Map<string, CallbackList>();

    /**
     * @method add
     * @param {String} key
     * @param {Function} callback
     * @param {Object} [target] - can be null
     */
    public add (key, callback, target) {
        let list = this._callbackTable[key];
        if (!list) {
            list = this._callbackTable[key] = callbackListPool.get();
        }
        list.callbacks.push(callback);
        list.targets.push(target || null);
    }

    /**
     * Check if the specified key has any registered callback. If a callback is also specified,
     * it will only return true if the callback is registered.
     * @method hasEventListener
     * @param {String} key
     * @param {Function} [callback]
     * @param {Object} [target]
     * @return {Boolean}
     */
    public hasEventListener (key: string, callback?: Function, target?: Object) {
        const list = this._callbackTable[key];
        if (!list) {
            return false;
        }

        // check any valid callback
        const callbacks = list.callbacks;
        if (!callback) {
            // Make sure no cancelled callbacks
            if (list.isInvoking) {
                for (const func of callbacks) {
                    if (func) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return callbacks.length > 0;
            }
        }

        target = target || undefined;
        const targets = list.targets;
        for (let i = 0; i < callbacks.length; ++i) {
            if (callbacks[i] === callback && targets[i] === target) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
     * @method removeAll
     * @param {String|Object} keyOrTarget - The event key to be removed or the target to be removed
     */
    public removeAll (keyOrTarget?: string | Object | undefined) {
        if (typeof keyOrTarget === 'string') {
            // remove by key
            const list = this._callbackTable[keyOrTarget];
            if (list) {
                if (list.isInvoking) {
                    list.cancelAll();
                }
                else {
                    callbackListPool.put(list);
                    delete this._callbackTable[keyOrTarget];
                }
            }
        }
        else if (keyOrTarget) {
            // remove by target
            for (const key of Object.keys(this._callbackTable)) {
                const list = this._callbackTable[key];
                if (list.isInvoking) {
                    const targets = list.targets;
                    for (let i = 0; i < targets.length; ++i) {
                        if (targets[i] === keyOrTarget) {
                            list.cancel(i);
                        }
                    }
                }
                else {
                    list.removeBy(list.targets, keyOrTarget);
                }
            }
        }
    }

    /**
     * @method remove
     * @param {String} key
     * @param {Function} callback
     * @param {Object} [target]
     */
    public remove (key: string, callback?: Function, target?: Object) {
        const list = this._callbackTable[key];
        if (list) {
            target = target || undefined;
            const callbacks = list.callbacks;
            const targets = list.targets;
            for (let i = 0; i < callbacks.length; ++i) {
                if (callbacks[i] === callback && targets[i] === target) {
                    if (list.isInvoking) {
                        list.cancel(i);
                    }
                    else {
                        fastRemoveAt(callbacks, i);
                        fastRemoveAt(targets, i);
                    }
                    break;
                }
            }
        }
    }
}

/**
 * !#en The callbacks invoker to handle and invoke callbacks by key.
 * !#zh CallbacksInvoker 用来根据 Key 管理并调用回调方法。
 * @class CallbacksInvoker
 *
 * @extends _CallbacksHandler
 */

export class CallbacksInvoker extends CallbacksHandler{
    /**
     * @method emit
     * @param {String} key
     * @param {any} [p1]
     * @param {any} [p2]
     * @param {any} [p3]
     * @param {any} [p4]
     * @param {any} [p5]
     */
    public emit (key: string, ...args: any[]) {
        const list = this._callbackTable[key];
        if (list) {
            const rootInvoker = !list.isInvoking;
            list.isInvoking = true;

            const callbacks = list.callbacks;
            const targets = list.targets;
            for (let i = 0, len = callbacks.length; i < len; ++i) {
                const callback = callbacks[i];
                if (callback) {
                    const target = targets[i];
                    if (target) {
                        callback.call(target, ...args);
                    }
                    else {
                        callback(...args);
                    }
                }
            }

            if (rootInvoker) {
                list.isInvoking = false;
                if (list.containCanceled) {
                    list.purgeCanceled();
                }
            }
        }
    }
}

if (CC_TEST) {
    cc._Test.CallbacksInvoker = CallbacksInvoker;
}
