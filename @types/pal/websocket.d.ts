declare module 'pal/websocket' {
    export class WebSocket extends EventTarget {
        declare readonly CONNECTING: 0;

        declare readonly OPEN: 1;

        declare readonly CLOSING: 2;

        declare readonly CLOSED: 3;

        declare binaryType: 'arraybuffer' | 'blob';

        declare readonly bufferedAmount: number;

        declare readonly extensions: string;

        declare readonly protocol: string;

        declare readonly readyState: 0 | 1 | 2 | 3;

        declare readonly url: string;

        onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;

        onerror: ((this: WebSocket, ev: Event) => any) | null;

        onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;

        onopen: ((this: WebSocket, ev: Event) => any) | null;
    }

    export class CloseEvent extends Event {
        constructor(type: string, eventInitDict?: CloseEventInit);
        declare code: number;
        declare reason: string;
    }

    export interface CloseEventInit {
        code?: number;
        reason?: string;
        wasClean?: boolean;
    }

    export class MessageEvent extends Event {
        constructor(type: string, eventInitDict?: MessageEventInit);
        declare data: string | ArrayBuffer;
    }

    export interface MessageEventInit {
        data?: string | ArrayBuffer;
    }
}
