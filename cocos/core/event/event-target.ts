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
 * @category event
 */

import * as js from '../utils/js';
import { CallbacksInvoker } from './callbacks-invoker';

const fastRemove = js.array.fastRemove;

export interface ITargetImpl extends Object {
    __eventTargets?: Object[];
    node?: ITargetImpl;
}

/**
 * @zh
 * 事件目标是事件触发时，分派的事件对象，Node 是最常见的事件目标，
 * 但是其他对象也可以是事件目标。
 * 可通过 cc.EventTarget 获得该对象。
 */
export class EventTarget extends CallbacksInvoker {
    /**
     * @zh
     * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
     *
     * @param type - 一个监听事件类型的字符串.
     * @param callback - 事件分派时将被调用的回调函数。如果该回调存在则不会重复添加.
     * @param callback.arg1 回调的第一个参数
     * @param callback.arg2 回调的第二个参数
     * @param callback.arg3 回调的第三个参数
     * @param callback.arg4 回调的第四个参数
     * @param callback.arg5 回调的第五个参数
     * @param target - 回调的目标。可以为空。
     * @return - 返回监听回调函数自身。
     *
     * @example
     * ```typescript
     * eventTarget.on('fire', function () {
     *     cc.log("fire in the hole");
     * }, node);
     * ```
     */
    public on (type: string, callback: Function, target?: Object) {
        if (!callback) {
            cc.errorID(6800);
            return;
        }

        if (!this.hasEventListener(type, callback, target)) {
            super.on(type, callback, target);

            const targetImpl = target as ITargetImpl;
            if (target) {
                if (targetImpl.__eventTargets) {
                    targetImpl.__eventTargets.push(this);
                } else if (targetImpl.node && targetImpl.node.__eventTargets) {
                    targetImpl.node.__eventTargets.push(this);
                }
            }
        }
        return callback;
    }

    /**
     * @zh
     * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param callback - 事件分派时将被调用的回调函数。
     * @param target - 调用回调的目标。如果为空, 只有没有目标的事件会被移除。
     *
     * @example
     * ```typescript
     * // register fire eventListener
     * var callback = eventTarget.on('fire', function () {
     *     cc.log("fire in the hole");
     * }, target);
     * // remove fire event listener
     * eventTarget.off('fire', callback, target);
     * // remove all fire event listeners
     * eventTarget.off('fire');
     * ```
     */
    public off (type: string, callback?: Function, target?: Object) {
        if (!callback) {
            this.removeAll(type);
        }
        else {
            super.off(type, callback, target);

            const targetImpl = target as ITargetImpl;
            if (target) {
                if (targetImpl.__eventTargets) {
                    fastRemove(targetImpl.__eventTargets, this);
                } else if (targetImpl.node && targetImpl.node.__eventTargets) {
                    fastRemove(targetImpl.node.__eventTargets, this);
                }
            }
        }
    }

    /**
     * @zh
     * 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
     * 这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
     * 这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
     *
     * @param target - 注销所有指定目标的监听
     */
    public targetOff (keyOrTarget?: string | Object) {
        this.removeAll(keyOrTarget);
    }

    /**
     * @zh
     * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param callback - 事件分派时将被调用的回调函数。如果该回调存在则不会重复添加。
     * @param callback.arg1 回调的第一个参数。
     * @param callback.arg2 第二个参数。
     * @param callback.arg3 第三个参数。
     * @param callback.arg4 第四个参数。
     * @param callback.arg5 第五个参数。
     * @param target - 调用回调的目标。可以为空。
     *
     * @example
     * ```typescript
     * eventTarget.once('fire', function () {
     *     cc.log("this is the callback and will be invoked only once");
     * }, node);
     * ```
     */
    public once (type: string, callback: Function, target?: Object) {
        if (!callback) {
            cc.errorID(6800);
            return;
        }

        if (!this.hasEventListener(type, callback, target)) {
            super.on(type, callback, target, true);

            const targetImpl = target as ITargetImpl;
            if (target) {
                if (targetImpl.__eventTargets) {
                    targetImpl.__eventTargets.push(this);
                } else if (targetImpl.node && targetImpl.node.__eventTargets) {
                    targetImpl.node.__eventTargets.push(this);
                }
            }
        }
        return callback;
    }
}

cc.EventTarget = EventTarget;
