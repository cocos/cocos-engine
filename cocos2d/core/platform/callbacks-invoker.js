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

const js = require('./js');
const fastRemoveAt = js.array.fastRemoveAt;

function empty () {}

function CallbackInfo () {
    this.callback = empty;
    this.target = undefined;
    this.once = false;
}

CallbackInfo.prototype.set = function (callback, target, once) {
    this.callback = callback;
    this.target = target;
    this.once = !!once;
};

let callbackInfoPool = new js.Pool(function (info) {
    info.callback = empty;
    info.target = undefined;
    info.once = false;
    return true;
}, 32);

callbackInfoPool.get = function () {
    return this._get() || new CallbackInfo();
};

function CallbackList () {
    this.callbackInfos = [];
    this.isInvoking = false;
    this.containCanceled = false;
}

let proto = CallbackList.prototype;

/**
 * !#zh
 * 从列表中移除与指定目标相同回调函数的事件。
 * @param cb
 */
proto.removeByCallback = function (cb) {
    for (let i = 0; i < this.callbackInfos.length; ++i) {
        let info = this.callbackInfos[i];
        if (info && info.callback === cb) {
            callbackInfoPool.put(info);
            fastRemoveAt(this.callbackInfos, i);
            --i;
        }
    }
};

/**
 * !#zh
 * 从列表中移除与指定目标相同调用者的事件。
 * @param target
 */
proto.removeByTarget = function (target) {
    for (let i = 0; i < this.callbackInfos.length; ++i) {
        const info = this.callbackInfos[i];
        if (info && info.target === target) {
            callbackInfoPool.put(info);
            fastRemoveAt(this.callbackInfos, i);
            --i;
        }
    }
};

/**
 * !#zh
 * 移除指定编号事件。
 *
 * @param index
 */
proto.cancel = function (index) {
    const info = this.callbackInfos[index];
    if (info) {
        callbackInfoPool.put(info);
        this.callbackInfos[index] = null;
    }
    this.containCanceled = true;
};

/**
 * !#zh
 * 注销所有事件。
 */
proto.cancelAll = function () {
    for (let i = 0; i < this.callbackInfos.length; i++) {
        const info = this.callbackInfos[i];
        if (info) {
            callbackInfoPool.put(info);
            this.callbackInfos[i] = null;
        }
    }
    this.containCanceled = true;
};

// filter all removed callbacks and compact array
proto.purgeCanceled = function () {
    for (let i = this.callbackInfos.length - 1; i >= 0; --i) {
        const info = this.callbackInfos[i];
        if (!info) {
            fastRemoveAt(this.callbackInfos, i);
        }
    }
    this.containCanceled = false;
};

proto.clear = function () {
    this.cancelAll();
    this.callbackInfos.length = 0;
    this.isInvoking = false;
    this.containCanceled = false;
};

const MAX_SIZE = 16;
let callbackListPool = new js.Pool(function (info) {
    info.callback = empty;
    info.target = undefined;
    info.once = false;
    return true;
}, MAX_SIZE);

callbackListPool.get = function () {
    return this._get() || new CallbackList();
};

/**
 * !#en The callbacks invoker to handle and invoke callbacks by key.
 * !#zh CallbacksInvoker 用来根据 Key 管理并调用回调方法。
 * @class CallbacksInvoker
 */
function CallbacksInvoker () {
    this._callbackTable = js.createMap(true);
}

proto = CallbacksInvoker.prototype;

/**
 * !#zh
 * 事件添加管理
 *
 * @param key
 * @param callback
 * @param target
 * @param once
 */
proto.on = function (key, callback, target, once) {
    let list = this._callbackTable[key];
    if (!list) {
        list = this._callbackTable[key] = callbackListPool.get();
    }
    let info = callbackInfoPool.get();
    info.set(callback, target, once);
    list.callbackInfos.push(info);
};

/**
 *
 * !#zh
 * 检查指定事件是否已注册回调。
 *
 * !#en
 * Check if the specified key has any registered callback. If a callback is also specified,
 * it will only return true if the callback is registered.
 *
 * @method hasEventListener
 * @param {String} key
 * @param {Function} [callback]
 * @param {Object} [target]
 * @return {Boolean}
 */
proto.hasEventListener = function (key, callback, target) {
    const list = this._callbackTable[key];
    if (!list) {
        return false;
    }

    // check any valid callback
    const infos = list.callbackInfos;
    if (!callback) {
        // Make sure no cancelled callbacks
        if (list.isInvoking) {
            for (let i = 0; i < infos.length; ++i) {
                if (infos[i]) {
                    return true;
                }
            }
            return false;
        }
        else {
            return infos.length > 0;
        }
    }

    for (let i = 0; i < infos.length; ++i) {
        const info = infos[i];
        if (info && info.callback === callback && info.target === target) {
            return true;
        }
    }
    return false;
};

/**
 * !#zh
 * 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
 *
 * !#en
 * Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
 * @method removeAll
 * @param {String|Object} keyOrTarget - The event key to be removed or the target to be removed
 */
proto.removeAll = function (keyOrTarget) {
    if (typeof keyOrTarget === 'string') {
        // remove by key
        const list = this._callbackTable[keyOrTarget];
        if (list) {
            if (list.isInvoking) {
                list.cancelAll();
            }
            else {
                list.clear();
                callbackListPool.put(list);
                delete this._callbackTable[keyOrTarget];
            }
        }
    }
    else if (keyOrTarget) {
        // remove by target
        for (const key in this._callbackTable) {
            const list = this._callbackTable[key];
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
};

/**
 * !#zh
 * 删除之前与同类型，回调，目标注册的回调。
 *
 * @method off
 * @param {String} key
 * @param {Function} callback
 * @param {Object} [target]
 */
proto.off = function (key, callback, target) {
    const list = this._callbackTable[key];
    if (list) {
        const infos = list.callbackInfos;
        for (let i = 0; i < infos.length; ++i) {
            const info = infos[i];
            if (info && info.callback === callback && info.target === target) {
                if (list.isInvoking) {
                    list.cancel(i);
                }
                else {
                    fastRemoveAt(infos, i);
                    callbackInfoPool.put(info);
                }
                break;
            }
        }
    }
};


/**
 * !#en
 * Trigger an event directly with the event name and necessary arguments.
 * !#zh
 * 通过事件名发送自定义事件
 *
 * @method emit
 * @param {String} key - event type
 * @param {*} [arg1] - First argument
 * @param {*} [arg2] - Second argument
 * @param {*} [arg3] - Third argument
 * @param {*} [arg4] - Fourth argument
 * @param {*} [arg5] - Fifth argument
 * @example
 *
 * eventTarget.emit('fire', event);
 * eventTarget.emit('fire', message, emitter);
 */
proto.emit = function (key, arg1, arg2, arg3, arg4, arg5) {
    const list = this._callbackTable[key];
    if (list) {
        const rootInvoker = !list.isInvoking;
        list.isInvoking = true;

        const infos = list.callbackInfos;
        for (let i = 0, len = infos.length; i < len; ++i) {
            const info = infos[i];
            if (info) {
                let target = info.target;
                let callback = info.callback;
                if (info.once) {
                    this.off(key, callback, target);
                }

                if (target) {
                    callback.call(target, arg1, arg2, arg3, arg4, arg5);
                }
                else {
                    callback(arg1, arg2, arg3, arg4, arg5);
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
};

if (CC_TEST) {
    cc._Test.CallbacksInvoker = CallbacksInvoker;
}

module.exports = CallbacksInvoker;
