import { WebSocket } from './websocket';

if (typeof globalThis.WebSocket !== 'function') {
    Object.defineProperty(globalThis, 'WebSocket', {
        value: WebSocket,
        writable: true,
        enumerable: false,
        configurable: true,
    });
}

export {};
