import display from '@ohos.display';
import webSocket from '@ohos.net.webSocket';
import http from '@ohos.net.http';


window.oh = {};

module.exports = function systemReady () {
    return new Promise(resolve => {
        if (typeof XMLHttpRequest === 'undefined') {
            window.XMLHttpRequest = function () { }
            window.oh.http = http;
        }
        if (typeof WebSocket === 'undefined') {
            window.oh.WebSocket = webSocket;
        }
        display.getDefaultDisplay((err, data) => {
            window.oh.display = data;
            // TODO: impl device in js.
            //https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-display-0000001281001106
        });
        resolve();
    })

}