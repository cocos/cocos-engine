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

const js = require('../platform/js');
const CallbacksInvoker = require('../platform/callbacks-invoker');

var fastRemove = js.array.fastRemove;

/**
 * !#en
 * EventTarget is an object to which an event is dispatched when something has occurred.
 * Entity are the most common event targets, but other objects can be event targets too.
 *
 * Event targets are an important part of the Fireball event model.
 * The event target serves as the focal point for how events flow through the scene graph.
 * When an event such as a mouse click or a keypress occurs, Fireball dispatches an event object
 * into the event flow from the root of the hierarchy. The event object then makes its way through
 * the scene graph until it reaches the event target, at which point it begins its return trip through
 * the scene graph. This round-trip journey to the event target is conceptually divided into three phases:
 * - The capture phase comprises the journey from the root to the last node before the event target's node
 * - The target phase comprises only the event target node
 * - The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the tree
 * See also: http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 *
 * Event targets can implement the following methods:
 *  - _getCapturingTargets
 *  - _getBubblingTargets
 *
 * !#zh
 * 事件目标是事件触发时，分派的事件对象，Node 是最常见的事件目标，
 * 但是其他对象也可以是事件目标。<br/>
 *
 * @class EventTarget
 */
function EventTarget () {
    CallbacksInvoker.call(this);
}
js.extend(EventTarget, CallbacksInvoker);

var proto = EventTarget.prototype;

/**
 * !#en Checks whether the EventTarget object has any callback registered for a specific type of event.
 * !#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
 * @method hasEventListener
 * @param {String} type - The type of event.
 * @return {Boolean} True if a callback of the specified type is registered; false otherwise.
 */

/**
 * !#en
 * Register an callback of a specific event type on the EventTarget.
 * This type of event should be triggered via `emit`.
 * !#zh
 * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
 *
 * @method on
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {any} [callback.arg1] arg1
 * @param {any} [callback.arg2] arg2
 * @param {any} [callback.arg3] arg3
 * @param {any} [callback.arg4] arg4
 * @param {any} [callback.arg5] arg5
 * @param {Object} [target] - The target (this object) to invoke the callback, can be null
 * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
 * @typescript
 * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
 * @example
 * eventTarget.on('fire', function () {
 *     cc.log("fire in the hole");
 * }, node);
 */
proto.__on = proto.on;
proto.on = function (type, callback, target, once) {
    if (!callback) {
        cc.errorID(6800);
        return;
    }

    if ( !this.hasEventListener(type, callback, target) ) {
        this.__on(type, callback, target, once);

        if (target && target.__eventTargets) {
            target.__eventTargets.push(this);
        }
    }
    return callback;
};

/**
 * !#en
 * Removes the listeners previously registered with the same type, callback, target and or useCapture,
 * if only type is passed as parameter, all listeners registered with that type will be removed.
 * !#zh
 * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
 *
 * @method off
 * @param {String} type - A string representing the event type being removed.
 * @param {Function} [callback] - The callback to remove.
 * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
 * @example
 * // register fire eventListener
 * var callback = eventTarget.on('fire', function () {
 *     cc.log("fire in the hole");
 * }, target);
 * // remove fire event listener
 * eventTarget.off('fire', callback, target);
 * // remove all fire event listeners
 * eventTarget.off('fire');
 */
proto.__off = proto.off;
proto.off = function (type, callback, target) {
    if (!callback) {
        let list = this._callbackTable[type];
        if (!list) return;
        let infos = list.callbackInfos;
        for (let i = 0; i < infos.length; ++i) {
            let target = infos[i].target;
            if (target && target.__eventTargets) {
                fastRemove(target.__eventTargets, this);
            }
        }
        this.removeAll(type);
    }
    else {
        this.__off(type, callback, target);

        if (target && target.__eventTargets) {
            fastRemove(target.__eventTargets, this);
        }
    }
};

/**
 * !#en Removes all callbacks previously registered with the same target (passed as parameter).
 * This is not for removing all listeners in the current event target,
 * and this is not for removing all listeners the target parameter have registered.
 * It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
 * !#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
 * 这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
 * 这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
 * @method targetOff
 * @param {Object} target - The target to be searched for all related listeners
 */
proto.targetOff = function (target) {
    this.removeAll(target);
    
    if (target && target.__eventTargets) {
        fastRemove(target.__eventTargets, this);
    }
};

/**
 * !#en
 * Register an callback of a specific event type on the EventTarget,
 * the callback will remove itself after the first time it is triggered.
 * !#zh
 * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
 *
 * @method once
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {any} [callback.arg1] arg1
 * @param {any} [callback.arg2] arg2
 * @param {any} [callback.arg3] arg3
 * @param {any} [callback.arg4] arg4
 * @param {any} [callback.arg5] arg5
 * @param {Object} [target] - The target (this object) to invoke the callback, can be null
 * @example
 * eventTarget.once('fire', function () {
 *     cc.log("this is the callback and will be invoked only once");
 * }, node);
 */
proto.once = function (type, callback, target) {
    this.on(type, callback, target, true);
};

/**
 * !#en
 * Send an event with the event object.
 * !#zh
 * 通过事件对象派发事件
 *
 * @method dispatchEvent
 * @param {Event} event
 */
proto.dispatchEvent = function (event) {
    this.emit(event.type, event);
};

cc.EventTarget = module.exports = EventTarget;
