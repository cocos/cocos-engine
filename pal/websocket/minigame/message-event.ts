import { Event } from './event';
import { defineReadonlyAttributeGetter } from './web';

class MessageEventShadow {
    static shadows = new WeakMap<MessageEvent, MessageEventShadow>();

    static of (event: MessageEvent): MessageEventShadow {
        const shadow = MessageEventShadow.shadows.get(event);
        if (!shadow) {
            throw new TypeError(`illegal invocation`);
        }
        return shadow;
    }

    constructor (eventInitDict: MessageEventInit = {}) {
        this.data = eventInitDict.data;
    }

    data: any;

    get origin (): string {
        return '';
    }

    get lastEventId (): string {
        return '';
    }

    get source (): MessageEventSource | null {
        return null;
    }

    get ports (): MessagePort[] {
        return [];
    }
}

export class MessageEvent extends Event {
    constructor (type: string, eventInitDict: MessageEventInit = {}) {
        super(type, eventInitDict);
        MessageEventShadow.shadows.set(this, new MessageEventShadow(eventInitDict));
    }

    declare readonly data: any;

    declare readonly origin: string;

    declare readonly lastEventId: string;

    declare readonly source: MessageEventSource | null;

    declare readonly ports: MessagePort[];
}

for (const key of ['data', 'origin', 'lastEventId', 'source', 'ports'] as const) {
    // eslint-disable-next-line func-names
    defineReadonlyAttributeGetter(MessageEvent.prototype, key, function (this: MessageEvent) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return MessageEventShadow.of(this)[key];
    });
}
