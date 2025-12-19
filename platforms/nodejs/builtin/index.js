globalThis.__EDITOR__ = globalThis.process && ('electron' in globalThis.process.versions);

require('./wasm');
const nodeWindow = globalThis.window;

const { btoa, atob } = require('./base64/base64.min');
nodeWindow.btoa = btoa;
nodeWindow.atob = atob;

const { Blob, URL } = require('./Blob');
nodeWindow.URL = URL; 
if (!nodeWindow.Blob) {
    nodeWindow.Blob = Blob;
}

nodeWindow.DOMParser = require('./xmldom/dom-parser').DOMParser;

nodeWindow.XMLHttpRequest = globalThis.nodeEnv.XMLHttpRequest;
nodeWindow.SocketIO = globalThis.nodeEnv.SocketIO;
nodeWindow.WebSocket = globalThis.nodeEnv.WebSocket;

require('./node-adapter');

nodeWindow.alert = console.error.bind(console);

nodeWindow.requestAnimationFrame = function (cb) {}
nodeWindow.cancelAnimationFrame = function (cb) {}

for (const key in nodeWindow) {
    if (globalThis[key] === undefined) {
        globalThis[key] = nodeWindow[key];
    }
}

if (typeof globalThis.window === 'undefined') {
    globalThis.window = globalThis;
}

// promise polyfill relies on setTimeout implementation
require('./promise.min');
