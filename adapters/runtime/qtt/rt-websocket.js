const cacheManager = require("./cache-manager");
const { existsSync } = require("./fs-utils");
class RTWebSocket extends window.WebSocket {
    constructor(wss, protocols, certificatePath) {
        if (typeof certificatePath === 'string') {
            certificatePath = cacheManager.getCache(certificatePath) || certificatePath;
            if (!existsSync(certificatePath)) certificatePath = undefined;
        }
        super(wss, protocols, certificatePath);
    }
}
delete window.WebSocket;
window.WebSocket = RTWebSocket;
delete window.RTWebSocket;
