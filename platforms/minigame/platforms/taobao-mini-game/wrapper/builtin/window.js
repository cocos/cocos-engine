export navigator from './navigator'
export XMLHttpRequest from './XMLHttpRequest'
import MultiWebSocket from './MultiWebSocket'
import WebSocket from './WebSocket'
const systemInfo = my.getSystemInfoSync();
if (systemInfo.version >= '10.35.30') {
    $global.WebSocket = MultiWebSocket;
} else {
    $global.WebSocket = WebSocket;
}
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

