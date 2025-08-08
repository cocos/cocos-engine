import { EventTarget, getEventAttributeValue, setEventAttributeValue } from 'event-target-shim';

export {
    EventTarget,
    Event,
} from 'event-target-shim';

export function defineEventAttribute<TTarget extends EventTarget, TKey extends string> (
    target: EventTarget,
    type: TKey,
): void {
    Object.defineProperty(target, `on${type}`, {
        get (this: EventTarget) {
            return getEventAttributeValue(this, type);
        },
        set (this: EventTarget, value: EventTarget.CallbackFunction<any, any>): void {
            setEventAttributeValue(this, type, value);
        },
        enumerable: true,
        configurable: true,
    });
}
