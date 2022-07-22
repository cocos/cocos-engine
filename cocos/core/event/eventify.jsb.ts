// ExtraEventify for jsb binding objects, as eventify is not suitable for native platforms

import { createMap } from "../utils/js-typed";
import { CallbacksInvoker } from "./callbacks-invoker";
import { IEventified } from "./eventify";
type Constructor<T> = new (...args: any[]) => T;

type EventType = string | number;
export function ExtraEventify (): Constructor<IEventified> {
    class Eventified {
        private _callbackTable = createMap(true);

        public once<Callback extends (...any) => void> (type: EventType, callback: Callback, target?: any) {
            return this.on(type, callback, target, true) as Callback;
        }

        public targetOff (typeOrTarget: any) {
            this.removeAll(typeOrTarget);
        }
    }

    // Mixin with `CallbacksInvokers`'s prototype
    const callbacksInvokerPrototype = CallbacksInvoker.prototype;
    const propertyKeys: (string | symbol)[] =        (Object.getOwnPropertyNames(callbacksInvokerPrototype) as (string | symbol)[]).concat(
        Object.getOwnPropertySymbols(callbacksInvokerPrototype),
    );
    for (let iPropertyKey = 0; iPropertyKey < propertyKeys.length; ++iPropertyKey) {
        const propertyKey = propertyKeys[iPropertyKey];
        if (!(propertyKey in Eventified.prototype)) {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(callbacksInvokerPrototype, propertyKey);
            if (propertyDescriptor) {
                Object.defineProperty(Eventified.prototype, propertyKey, propertyDescriptor);
            }
        }
    }

    return Eventified as unknown as Constructor<IEventified>;
}