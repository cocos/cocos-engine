import display from '@ohos.display';

let sys  = Object.create(null);
sys.oh = {};

module.exports = function systemReady () {
    return new Promise(resolve => {
        if (typeof XMLHttpRequest === 'undefined') {
            window.XMLHttpRequest = function () {}
        }
        display.getDefaultDisplay((err, data) => {
            sys.oh.display = data;
            // TODO: impl device in js.
            //https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-display-0000001281001106
        });
        resolve();
    })

}