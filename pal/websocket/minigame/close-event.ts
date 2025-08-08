import { Event } from './event';
import { defineReadonlyAttributeGetter } from './web';

class CloseEventShadow {
    static shadows = new WeakMap<CloseEvent, CloseEventShadow>();

    static of (event: CloseEvent): CloseEventShadow {
        const shadow = CloseEventShadow.shadows.get(event);
        if (!shadow) {
            throw new TypeError(`illegal invocation`);
        }
        return shadow;
    }

    constructor ({
        wasClean = false,
        code = 0,
        reason = '',
    }: CloseEventInit) {
        this.wasClean = wasClean;
        this.code = code;
        this.reason = reason;
    }

    wasClean = false;
    code = 0;
    reason = '';
}

export class CloseEvent extends Event {
    constructor (type: string, eventInitDict: CloseEventInit = {}) {
        super(type, eventInitDict);
        CloseEventShadow.shadows.set(this, new CloseEventShadow(eventInitDict));
    }

    declare readonly wasClean: boolean;
    declare readonly code: number;
    declare readonly reason: string;
}

for (const key of ['wasClean', 'code', 'reason'] as const) {
    // eslint-disable-next-line func-names
    defineReadonlyAttributeGetter(CloseEvent.prototype, key, function (this: CloseEvent) {
        return CloseEventShadow.of(this)[key];
    });
}
