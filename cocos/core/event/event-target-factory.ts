import * as js from '../utils/js';
import { CallbacksInvoker } from './callbacks-invoker-base';
import Event from './event';

const fastRemove = js.array.fastRemove;

type Constructor<T = {}> = new(...args: any[]) => T;

export type IEventTargetCallback = (...args: any[]) => void;

class Empty { protected constructor () {}; }

export function EventTargetFactory<Base extends Constructor<{}>> (b?: Base) {
    let base = b;
    if (!base) {
        base = Empty as Base;
    }
    class EventTarget extends base {
        private _callbacksInvoker = new CallbacksInvoker();

        /**
         * !#en Checks whether the EventTarget object has any callback registered for a specific type of event.
         * !#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
         *
         * @param type - The type of event.
         * @return True if a callback of the specified type is registered; false otherwise.
         */
        public hasEventListener (type: string) {
            return this._callbacksInvoker.hasEventListener(type);
        }

        /**
         * !#en
         * Register an callback of a specific event type on the EventTarget.
         * This type of event should be triggered via `emit`.
         * !#zh
         * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
         *
         * @param type - A string representing the event type to listen for.
         * @param callback - The callback that will be invoked when the event is dispatched.
         *                              The callback is ignored if it is a duplicate (the callbacks are unique).
         * @param [target] - The target (this object) to invoke the callback, can be null
         * @return - Just returns the incoming callback so you can save the anonymous function easier.
         * @typescript
         * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
         * @example
         * eventTarget.on('fire', function () {
         *     cc.log("fire in the hole");
         * }, node);
         */
        public on (type: string, callback: IEventTargetCallback, target: Object | null = null, useCapture?: boolean) {
            if (!callback) {
                cc.errorID(6800);
                return;
            }

            if (!this._callbacksInvoker.hasEventListener(type, callback, target) ) {
                this._callbacksInvoker.add(type, callback, target);
                const targetImpl = (target as ITargetImpl);
                if (target && targetImpl.__eventTargets) {
                    targetImpl.__eventTargets.push(this);
                }
            }
            return callback;
        }

        /**
         * !#en
         * Removes the listeners previously registered with the same type, callback, target and or useCapture,
         * if only type is passed as parameter, all listeners registered with that type will be removed.
         * !#zh
         * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
         *
         * @param type - A string representing the event type being removed.
         * @param [callback] - The callback to remove.
         * @param [target] - The target (this object) to invoke the callback,
         * if it's not given, only callback without target will be removed
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
        public off (type: string, callback: IEventTargetCallback, target: Object | null = null) {
            if (!callback) {
                this._callbacksInvoker.removeAll(type);
            } else {
                this._callbacksInvoker.remove(type, callback, target);
                const targetImpl = (target as ITargetImpl);
                if (target && targetImpl.__eventTargets) {
                    fastRemove(targetImpl.__eventTargets, this);
                }
            }
        }

        /**
         * !#en Removes all callbacks previously registered with the same target (passed as parameter).
         * This is not for removing all listeners in the current event target,
         * and this is not for removing all listeners the target parameter have registered.
         * It's only for removing all listeners (callback and target couple)
         * registered on the current event target by the target parameter.
         * !#zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
         * 这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
         * 这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
         * @param {Object} target - The target to be searched for all related listeners
         */
        public targetOff (target: Object) {
            this._callbacksInvoker.removeAll();
        }

        /**
         * !#en
         * Register an callback of a specific event type on the EventTarget,
         * the callback will remove itself after the first time it is triggered.
         * !#zh
         * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
         *
         * @param type - A string representing the event type to listen for.
         * @param callback - The callback that will be invoked when the event is dispatched.
         * The callback is ignored if it is a duplicate (the callbacks are unique).
         * @param [target] - The target (this object) to invoke the callback, can be null
         * @example
         * eventTarget.once('fire', function () {
         *     cc.log("this is the callback and will be invoked only once");
         * }, node);
         */
        public once (type: string, callback: IEventTargetCallback, target: Object | null = null) {
            const eventType_hasOnceListener = '__ONCE_FLAG:' + type;
            const hasOnceListener = this._callbacksInvoker.hasEventListener(
                eventType_hasOnceListener, callback, target);
            if (!hasOnceListener) {
                const onceWrapper = (...args: any[]) => {
                    this.off(type, onceWrapper, target);
                    this._callbacksInvoker.remove(eventType_hasOnceListener, callback, target);
                    callback(...args);
                };
                this.on(type, onceWrapper, target);
                this._callbacksInvoker.add(eventType_hasOnceListener, callback, target);
            }
        }

        /**
         * !#en
         * Trigger an event directly with the event name and necessary arguments.
         * !#zh
         * 通过事件名发送自定义事件
         *
         * @param type - event type
         * @param args - arguments
         * @example
         * eventTarget.emit('fire', event);
         * eventTarget.emit('fire', message, emitter);
         */
        public emit (type: string, ...args: any[]) {
            return this._callbacksInvoker.invoke(type, ...args);
        }

        /**
         * !#en
         * Send an event with the event object.
         * !#zh
         * 通过事件对象派发事件
         *
         * @param event
         */
        public dispatchEvent (event: Event) {
            return this._callbacksInvoker.invoke(event.type, event);
        }
    }
    return EventTarget;
}

interface ITargetImpl extends Object {
    __eventTargets?: Object[];
}
