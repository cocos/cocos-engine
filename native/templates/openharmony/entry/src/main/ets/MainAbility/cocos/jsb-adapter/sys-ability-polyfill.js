import display from '@ohos.display';

window.oh = {};

module.exports = function systemReady () {
    return new Promise(resolve => {
        if (typeof XMLHttpRequest === 'undefined') {
            window.XMLHttpRequest = function () {}
        }
        display.getDefaultDisplay((err, data) => {
            window.oh.display = data;
            //let device = jsb.device;
            
            //https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-display-0000001281001106
            //device.getDevicePixelRatio = function () { return data.densityPixels; }
            //device.getDeviceOrientation = function () { return data.rotation; }
        });
        resolve();
    })

}