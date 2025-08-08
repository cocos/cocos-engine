import { IMiniGame, minigame } from 'pal/minigame';
import { DOMError, DOMErrorCode } from './web';
import { MessageEvent } from './message-event';
import { CloseEvent } from './close-event';
import { defineEventAttribute, Event, EventTarget } from './event';

const WebSocketState = Object.freeze({
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
});

function installWebSocketStates (target: object): void {
    for (const key of Object.keys(WebSocketState)) {
        Object.defineProperty(target, key, {
            value: WebSocketState[key],
            writable: false,
            enumerable: true,
            configurable: false,
        });
    }
}

class Shadow {
    constructor (host: WebSocket, url: string, protocols: string | string[] = []) {
        const urlMatch = /^(\w+)(:\/\/.+)$/.exec(url);
        let normalizedUrl = '';
        if (urlMatch) {
            const protocol = urlMatch[1];
            const remain = urlMatch[2];
            switch (protocol) {
            case 'ws':
            case 'wss':
                normalizedUrl = url;
                break;
            case 'http':
                normalizedUrl = `ws${remain}`;
                break;
            case 'https':
                normalizedUrl = `wss${remain}`;
                break;
            default:
                break;
            }
        }
        if (!normalizedUrl) {
            throw new DOMError(DOMErrorCode.SyntaxError, `Failed to construct 'WebSocket': The URL '${url}' is invalid`);
        }

        this._host = host;
        this._url = url;
        this._readyState = WebSocketState.CONNECTING;

        const normalizedProtocols = Array.isArray(protocols) ? protocols : [protocols];

        const socketTask = minigame.connectSocket({
            url,
            protocols: normalizedProtocols,
            multiple: true,
            tcpNoDelay: true,
        });

        socketTask.onClose((res) => {
            this._readyState = WebSocketState.CLOSED;
            this._host.dispatchEvent(new CloseEvent('close', {
                wasClean: true,
                code: res.code,
                reason: res.reason,
            }));
        });

        socketTask.onMessage((res) => {
            this._host.dispatchEvent(new MessageEvent('message', {
                data: res.data,
            }));
        });

        socketTask.onOpen(() => {
            this._readyState = WebSocketState.OPEN;
            this._host.dispatchEvent(new Event('open'));
        });

        socketTask.onError((res) => {
            // eslint-disable-next-line no-console
            console.error(res.errMsg);
            this._host.dispatchEvent(new Event('error'));
        });

        this._socketTask = socketTask;
    }

    get binaryType (): BinaryType {
        return 'arraybuffer';
    }

    set binaryType (value: BinaryType) {
        if (value !== 'arraybuffer') {
            throw new TypeError(`Invalid binary type: ${value}`);
        }
    }

    get bufferedAmount (): number {
        return 0;
    }

    get extensions (): string {
        return '';
    }

    get protocol (): string {
        return '';
    }

    get readyState (): ReadyState {
        return this._readyState;
    }

    get url (): string {
        return this._url;
    }

    close (code = 1000, reason = ''): void {
        if (code !== 1000 && !(code >= 3000 && code <= 4999)) {
            throw new DOMError(DOMErrorCode.InvalidAccessError, `Disallowed code ${code}`);
        }

        // > If this's ready state is CLOSING (2) or CLOSED (3)
        // > Do nothing.
        switch (this._readyState) {
        case WebSocketState.CLOSING:
        case WebSocketState.CLOSED:
            return;
        default:
            break;
        }

        // > If the WebSocket connection is not yet established
        // > Fail the WebSocket connection and set this's ready state to CLOSING (2)

        // > If the WebSocket closing handshake has not yet been started
        // >   Start the WebSocket closing handshake and set this's ready state to CLOSING (2)
        // >   If neither code nor reason is present, the WebSocket Close message must not have a body.
        // >   If code is present, then the status code to use in the WebSocket Close message must be the integer given by code.
        // >   If reason is also present, then reasonBytes must be provided in the Close message after the status code.

        this._socketTask.close({
            code,
            reason,
        });

        this._readyState = WebSocketState.CLOSING;
    }

    send (data: string | ArrayBuffer | ArrayBufferView): void {
        if (this._readyState === WebSocketState.CONNECTING) {
            throw new DOMError(DOMErrorCode.InvalidStateError, 'WebSocket is connecting');
        }
        let d: string | ArrayBuffer;
        if (typeof data === 'string') {
            d = data;
        } else if (data instanceof ArrayBuffer) {
            d = data;
        } else if (ArrayBuffer.isView(data)) {
            if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
                d = data.buffer;
            } else {
                d = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
            }
        } else {
            throw new TypeError(`Invalid data type: ${typeof data}`);
        }
        this._socketTask.send({
            data: d,
        });
    }

    private _host: WebSocket;
    private _url: string;
    private _socketTask: SocketTask;
    private _readyState: ReadyState;
}

const shadows = new WeakMap<WebSocket, Shadow>();

function shadowOf (websocket: WebSocket): Shadow {
    const shadow = shadows.get(websocket);
    if (!shadow) {
        throw new TypeError('illegal invocation');
    }
    return shadow;
}

type ReadyState = typeof WebSocketState[keyof typeof WebSocketState];

type BinaryType = 'blob' | 'arraybuffer';

export class WebSocket extends EventTarget {
    declare readonly CONNECTING: 0;

    declare readonly OPEN: 1;

    declare readonly CLOSING: 2;

    declare readonly CLOSED: 3;

    declare binaryType: BinaryType;

    declare readonly bufferedAmount: number;

    declare readonly extensions: string;

    declare readonly protocol: string;

    declare readonly readyState: ReadyState;

    declare readonly url: string;

    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;

    onerror: ((this: WebSocket, ev: Event) => any) | null = null;

    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;

    onopen: ((this: WebSocket, ev: Event) => any) | null = null;

    constructor (url: string, protocols?: string | string[]) {
        super();
        installWebSocketStates(this);
        const shadow = new Shadow(this, url, protocols);
        shadows.set(this, shadow);
    }
}

installWebSocketStates(WebSocket);

// Readonly properties.
for (const key of ['binaryType']) {
    Object.defineProperty(WebSocket.prototype, key, {
        get (this: WebSocket): any {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return shadowOf(this)[key];
        },
        writable: false,
        enumerable: false,
        configurable: false,
    });
}

// Properties.
for (const key of [
    'bufferedAmount',
    'extensions',
    'protocol',
    'readyState',
    'url',
]) {
    Object.defineProperty(WebSocket.prototype, key, {
        get (this: WebSocket): any {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return shadowOf(this)[key];
        },
        set (this: WebSocket, value: any): void {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            shadowOf(this)[key] = value;
        },
        writable: false,
        enumerable: false,
        configurable: false,
    });
}

// Methods.
for (const key of ['close', 'send']) {
    Object.defineProperty(WebSocket.prototype, key, {
        value (this: WebSocket, ...args: unknown[]): any {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return shadowOf(this)[key].apply(this, args);
        },
        writable: false,
        enumerable: false,
        configurable: false,
    });
}

for (const key of ['close', 'error', 'message', 'open'] as const) {
    defineEventAttribute(WebSocket.prototype, key);
}
