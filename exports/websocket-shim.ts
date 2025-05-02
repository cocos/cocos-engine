import { WebSocket, MessageEvent, CloseEvent } from './websocket-exports';

const shims = {
    WebSocket,
    MessageEvent,
    CloseEvent,
};

for (const name of Object.keys(shims)) {
    const shim = shims[name];
    if (typeof globalThis[name] === 'undefined') {
        globalThis[name] = shim;
    }
}

export {};
