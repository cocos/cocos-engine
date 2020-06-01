/**
 * @category event
 */

import { fastRemove } from '../utils/array';
import { CallbacksInvoker } from './callbacks-invoker';
import { createMap } from '../utils/js';

type Constructor<T = {}> = new (...args: any[]) => T;

type EventType = string;

const {
    prototype: {
        on: callbacksInvokerOn,
        off: callbacksInvokerOff,
    },
} = CallbacksInvoker;

/**
 * @zh
 * 实现该接口的对象具有处理事件的能力。
 * @en
 * Objects those implement this interface have essentially the capability to process events.
 */
export interface IEventified {
    /**
     * @zh 检查指定事件是否已注册回调。
     * @en Checks whether there is correspond event listener registered on the given event.
     * @param type - Event type.
     * @param callback - Callback function when event triggered.
     * @param target - Callback callee.
     */
    hasEventListener (type: string, callback?: Function, target?: object): boolean;

    /**
     * @en
     * Register an callback of a specific event type on the EventTarget.
     * This type of event should be triggered via `emit`.
     * @zh
     * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
     *
     * @param type - A string representing the event type to listen for.
     * @param callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param thisArg - The target (this object) to invoke the callback, can be null
     * @return - Just returns the incoming callback so you can save the anonymous function easier.
     * @example
     * eventTarget.on('fire', function () {
     *     cc.log("fire in the hole");
     * }, node);
     */
    on<TFunction extends Function> (type: EventType, callback: TFunction, thisArg?: any): typeof callback;

    /**
     * @en
     * Register an callback of a specific event type on the EventTarget,
     * the callback will remove itself after the first time it is triggered.
     * @zh
     * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @param type - A string representing the event type to listen for.
     * @param callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param target - The target (this object) to invoke the callback, can be null
     * @example
     * eventTarget.once('fire', function () {
     *     cc.log("this is the callback and will be invoked only once");
     * }, node);
     */
    once<TFunction extends Function> (type: EventType, callback: TFunction, thisArg?: any): typeof callback;

    /**
     * @en
     * Removes the listeners previously registered with the same type, callback, target and or useCapture,
     * if only type is passed as parameter, all listeners registered with that type will be removed.
     * @zh
     * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     *
     * @param type - A string representing the event type being removed.
     * @param callback - The callback to remove.
     * @param target - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
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
    off<TFunction extends Function> (type: EventType, callback?: TFunction, thisArg?: any): void;

    /**
     * @en Removes all callbacks previously registered with the same target (passed as parameter).
     * This is not for removing all listeners in the current event target,
     * and this is not for removing all listeners the target parameter have registered.
     * It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
     * @zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
     * 这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
     * 这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
     * @param typeOrTarget - The target to be searched for all related listeners
     */
    targetOff (typeOrTarget: string | object): void;

    /**
     * @zh 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
     * @en Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
     * @param typeOrTarget - The event type or target with which the listeners will be removed
     */
    removeAll (typeOrTarget: string | object): void;

    /**
     * @zh 派发一个指定事件，并传递需要的参数
     * @en Trigger an event directly with the event name and necessary arguments.
     * @param type - event type
     * @param args - Arguments when the event triggered
     */
    emit (type: EventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
}

/**
 * @en Generate a new class from the given base class, after polyfill all functionalities in [[IEventified]] as if it's extended from [[EventTarget]]
 * @zh 生成一个类，该类继承自指定的基类，并以和 [[EventTarget]] 等同的方式实现了 [[IEventified]] 的所有接口。
 * @param base The base class
 * @example
 * ```ts
 * class Base { say() { console.log('Hello!'); } }
 * class MyClass extends Eventify(Base) { }
 * function (o: MyClass) {
 *     o.say(); // Ok: Extend from `Base`
 *     o.emit('sing', 'The ghost'); // Ok: `MyClass` implements IEventified
 * }
 * ```
 */
export function Eventify<TBase> (base: Constructor<TBase>): Constructor<TBase & IEventified> {
    class Eventified extends (base as unknown as any) {
        private _callbackTable = createMap(true);
        
        public on<Callback extends Function> (type: EventType, callback: Callback, target?: object) {
            if (!this.hasEventListener(type, callback, target)) {
                callbacksInvokerOn.call(this, type, callback, target);
                if (target) {
                    this._registerThisIntoTarget(target);
                }
            }
            return callback;
        }

        public once<Callback extends Function> (type: EventType, callback: Callback, target?: object) {
            if (!this.hasEventListener(type, callback, target)) {
                callbacksInvokerOn.call(this, type, callback, target, true);
                if (target) {
                    this._registerThisIntoTarget(target);
                }
            }
            return callback;
        }

        public off (type: EventType, callback?: Function, target?: object) {
            if (!callback) {
                this.removeAll(type);
            } else {
                callbacksInvokerOff.call(this, type, callback, target);
                if (target) {
                    this._unregisterThisIntoTarget(target);
                }
            }
        }

        public targetOff (typeOrTarget: string | object) {
            this.removeAll(typeOrTarget);
        }

        private _registerThisIntoTarget (target: ITargetImpl) {
            if (target.__eventTargets) {
                target.__eventTargets.push(this);
            } else if (target.node && target.node.__eventTargets) {
                target.node.__eventTargets.push(this);
            }
        }

        private _unregisterThisIntoTarget (target: ITargetImpl) {
            if (target.__eventTargets) {
                fastRemove(target.__eventTargets, this);
            } else if (target.node && target.node.__eventTargets) {
                fastRemove(target.node.__eventTargets, this);
            }
        }
    };

    // Mixin with `CallbacksInvokers`'s prototype
    const propertyDescriptors = Object.getOwnPropertyDescriptors(CallbacksInvoker.prototype);
    for (const propertyName in propertyDescriptors) {
        if (!(propertyName in Eventified.prototype)) {
            Object.defineProperty(Eventified.prototype, propertyName, propertyDescriptors[propertyName]);
        }
    }

    return Eventified as unknown as any;
}

interface ITargetImpl extends Object {
    __eventTargets?: any[];
    node?: ITargetImpl;
}
