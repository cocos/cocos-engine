export navigator from './navigator'
export XMLHttpRequest from './XMLHttpRequest'
export Image from './Image'
export ImageBitmap from './ImageBitmap'
export HTMLElement from './HTMLElement'
export HTMLCanvasElement from './HTMLCanvasElement'
export HTMLImageElement from './HTMLImageElement'
export WebGLRenderingContext from './WebGLRenderingContext'
export localStorage from './localStorage'
export location from './location'
export requestAnimationFrame from './requestAnimationFrame'
export cancelAnimationFrame from './cancelAnimationFrame'
export * from './WindowProperties'


import MultiWebSocket from './MultiWebSocket'
import WebSocket from './WebSocket'
const systemInfo = my.getSystemInfoSync();
if (typeof my !== 'undefined' && my && my.canIUse && my.canIUse('connectSocket.object.multiple')) {
    $global.WebSocket = MultiWebSocket;
} else {
    $global.WebSocket = WebSocket;
}