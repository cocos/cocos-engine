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


const compareVersions = (curVersion, supportedVersion) => {
    const curVersionNum = curVersion.split('.').map(Number);
    const supportedVersionNum = supportedVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(curVersionNum.length, supportedVersionNum.length); i++) {
        const curVersionPart = curVersionNum[i] || 0;
        const supportedVersionPart = supportedVersionNum[i] || 0;
        if (curVersionPart > supportedVersionPart) return 1;
        if (curVersionPart < supportedVersionPart) return -1;
    }
    return 0;
}

import MultiWebSocket from './MultiWebSocket'
import WebSocket from './WebSocket'
const systemInfo = my.getSystemInfoSync();
if (typeof my !== 'undefined' && my && my.canIUse && my.canIUse('connectSocket.object.multiple')) {
    $global.WebSocket = MultiWebSocket;
} else {
    $global.WebSocket = WebSocket;
}