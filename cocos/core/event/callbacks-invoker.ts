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

    /**
     * @zh
     * 从指定数组中移除与指定目标相同编号的事件。
     *
     * @param array - 指定数组
     * @param value - 指定目标
     */
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

    /**
     * @zh
     * 移除指定编号事件。
     *
     * @param index - 指定编号。
     */
    public cancel (index: number) {
        this.callbacks[index] = this.targets[index] = null;
        this.containCanceled = true;
    }

    /**
     * @zh
     * 注销所有事件。
     */
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
     * @zh
     * 事件添加管理
     * @param key - 一个监听事件类型的字符串。
     * @param callback - 事件分派时将被调用的回调函数。
     * @param arget - 调用回调的目标。可以为空。
     */
    public add (key: string, callback: Function, target: Object | null = null) {
        let list = this._callbackTable[key];
        if (!list) {
            list = this._callbackTable[key] = callbackListPool.get!();
        }

        list.callbacks.push(callback);
        list.targets.push(target || null);
    }

    /**
     * @zh
     * 检查指定事件是否已注册回调。
     *
     * @param key - 一个监听事件类型的字符串。
     * @param callback - 事件分派时将被调用的回调函数。
     * @param target - 调用回调的目标。
     * @return - 指定事件是否已注册回调。
     */
    public hasEventListener (key: string, callback?: Function, target: Object | null = null) {
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

        target = target || null;
        const targets = list.targets;
        for (let i = 0; i < callbacks.length; ++i) {
            if (callbacks[i] === callback && targets[i] === target) {
                return true;
            }
        }
        return false;
    }

    /**
     * @zh
     * 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
     *
     * @param keyOrTarget - 要删除的事件键或要删除的目标。
     */
    public removeAll (keyOrTarget?: string | Object) {
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
     * @zh
     * 删除之前与同类型，回调，目标注册的回调。
     *
     * @param key - 一个监听事件类型的字符串。
     * @param callback - 移除指定注册回调。如果没有给，则删除全部同事件类型的监听。
     * @param target - 调用回调的目标。
     */
    public remove (key: string, callback?: Function, target: Object | null = null) {
        const list = this._callbackTable[key];
        if (list) {
            target = target || null;
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
 * @zh
 * CallbacksInvoker 用来根据 Key 管理并调用回调方法。
 */

export class CallbacksInvoker extends CallbacksHandler{
    /**
     * @zh
     * 事件派发
     *
     * @param key - 一个监听事件类型的字符串
     * @param p1 - 派发的第一个参数。
     * @param p2 - 派发的第二个参数。
     * @param p3 - 派发的第三个参数。
     * @param p4 - 派发的第四个参数。
     * @param p5 - 派发的第五个参数。
     */
    public emit (key: string, ...args: any[]) {
        const list: CallbackList = this._callbackTable[key];
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
