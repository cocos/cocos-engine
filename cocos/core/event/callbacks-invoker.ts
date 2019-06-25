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
 * @hidden
 */

import Pool from '../../3d/memop/pool';
import { array, createMap } from '../utils/js';
const fastRemoveAt = array.fastRemoveAt;

type Constructor<T = {}> = new (...args: any[]) => T;

function empty (){}

class CallbackInfo {
    public callback: Function = empty;
    public target: Object | undefined = undefined;
    public once = false;

    public set (callback: Function, target?: Object, once?: boolean) {
        this.callback = callback;
        this.target = target;
        this.once = !!once;
    }
}

const callbackInfoPool = new Pool(() => {
    return new CallbackInfo();
}, 32);

export class CallbackList {
    public callbackInfos: Array<CallbackInfo | null> = [];
    public isInvoking = false;
    public containCanceled = false;

    /**
     * @zh
     * 从列表中移除与指定目标相同回调函数的事件。
     *
     * @param cb - 指定回调函数
     */
    public removeByCallback (cb: Function) {
        for (let i = 0; i < this.callbackInfos.length; ++i) {
            const info = this.callbackInfos[i];
            if (info && info.callback === cb) {
                callbackInfoPool.free(info);
                fastRemoveAt(this.callbackInfos, i);
                --i;
            }
        }
    }
    /**
     * @zh
     * 从列表中移除与指定目标相同调用者的事件。
     *
     * @param target - 指定调用者
     */
    public removeByTarget (target: Object) {
        for (let i = 0; i < this.callbackInfos.length; ++i) {
            const info = this.callbackInfos[i];
            if (info && info.target === target) {
                callbackInfoPool.free(info);
                fastRemoveAt(this.callbackInfos, i);
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
        const info = this.callbackInfos[index];
        if (info) {
            callbackInfoPool.free(info);
            this.callbackInfos[index] = null;
        }
        this.containCanceled = true;
    }

    /**
     * @zh
     * 注销所有事件。
     */
    public cancelAll () {
        for (let i = 0; i < this.callbackInfos.length; i++) {
            const info = this.callbackInfos[i];
            if (info) {
                callbackInfoPool.free(info);
                this.callbackInfos[i] = null;
            }
        }
        this.containCanceled = true;
    }

    /**
     * @zh
     * 取消所有回调。（在移除过程中会更加紧凑的排列数组）
     */
    public purgeCanceled () {
        for (let i = this.callbackInfos.length - 1; i >= 0; --i) {
            const info = this.callbackInfos[i];
            if (!info) {
                fastRemoveAt(this.callbackInfos, i);
            }
        }
        this.containCanceled = false;
    }

    /**
     * @zh
     * 清除并重置所有数据。
     */
    public clear () {
        this.cancelAll();
        this.callbackInfos.length = 0;
        this.isInvoking = false;
        this.containCanceled = false;
    }
}

const MAX_SIZE = 16;
const callbackListPool = new Pool<CallbackList>(() => {
    return new CallbackList();
}, MAX_SIZE);

export interface ICallbackTable {
    [x: string]: CallbackList | undefined;
}

/**
 * @zh
 * CallbacksInvoker 用来根据 Key 管理事件监听器列表并调用回调方法。
 * @class CallbacksInvoker
 */
export class CallbacksInvoker {
    public _callbackTable: ICallbackTable = createMap(true);

    /**
     * @zh
     * 事件添加管理
     *
     * @param key - 一个监听事件类型的字符串。
     * @param callback - 事件分派时将被调用的回调函数。
     * @param arget - 调用回调的目标。可以为空。
     * @param once - 是否只调用一次。
     */
    public on (key: string, callback: Function, target?: Object, once?: boolean) {
        let list = this._callbackTable[key];
        if (!list) {
            list = this._callbackTable[key] = callbackListPool.alloc();
        }
        const info = callbackInfoPool.alloc();
        info.set(callback, target, once);
        list.callbackInfos.push(info);
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
        const infos = list.callbackInfos;
        if (!callback) {
            // Make sure no cancelled callbacks
            if (list.isInvoking) {
                for (const info of infos) {
                    if (info) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return infos.length > 0;
            }
        }

        for (const info of infos) {
            if (info && info.callback === callback && info.target === target) {
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
                    list.clear();
                    callbackListPool.free(list);
                    delete this._callbackTable[keyOrTarget];
                }
            }
        }
        else if (keyOrTarget) {
            // remove by target
            for (const key in this._callbackTable) {
                const list = this._callbackTable[key]!;
                if (list.isInvoking) {
                    const infos = list.callbackInfos;
                    for (let i = 0; i < infos.length; ++i) {
                        const info = infos[i];
                        if (info && info.target === keyOrTarget) {
                            list.cancel(i);
                        }
                    }
                }
                else {
                    list.removeByTarget(keyOrTarget);
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
    public off (key: string, callback?: Function, target?: Object) {
        const list = this._callbackTable[key];
        if (list) {
            const infos = list.callbackInfos;
            if (callback) {
                for (let i = 0; i < infos.length; ++i) {
                    const info = infos[i];
                    if (info && info.callback === callback && info.target === target) {
                        if (list.isInvoking) {
                            list.cancel(i);
                        }
                        else {
                            fastRemoveAt(infos, i);
                            callbackInfoPool.free(info);
                        }
                        break;
                    }
                }
            }
            else {
                this.removeAll(key);
            }
        }
    }

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
        const list: CallbackList = this._callbackTable[key]!;
        if (list) {
            const rootInvoker = !list.isInvoking;
            list.isInvoking = true;

            const infos = list.callbackInfos;
            for (let i = 0, len = infos.length; i < len; ++i) {
                const info = infos[i];
                if (info) {
                    const callback = info.callback;
                    const target = info.target;
                    // Pre off once callbacks to avoid influence on logic in callback
                    if (info.once) {
                        this.off(key, callback, target);
                    }
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
