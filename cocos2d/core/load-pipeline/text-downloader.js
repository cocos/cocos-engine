var sys = require('../platform/CCSys');

if (CC_JSB || CC_RUNTIME) {
    module.exports = function (item, callback) {
        var url = item.url;

        var result = jsb.fileUtils.getStringFromFile(url);
        if (typeof result === 'string' && result) {
            return result;
        }
        else {
            return new Error('Download text failed: ' + url);
        }
    };
}
else {
    var urlAppendTimestamp = require('./utils').urlAppendTimestamp;

    module.exports = function (item, callback) {
        var url = item.url;
        url = urlAppendTimestamp(url);

        var xhr = cc.loader.getXMLHttpRequest(),
            errInfo = 'Load text file failed: ' + url,
            navigator = window.navigator;
        xhr.open('GET', url, true);
        if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    callback(null, xhr.responseText);
                }
                else {
                    callback({status:xhr.status, errorMessage:errInfo + '(wrong status)'});
                }
            }
            else {
                callback({status:xhr.status, errorMessage:errInfo + '(wrong readyState)'});
            }
        };
        xhr.onerror = function(){
            callback({status:xhr.status, errorMessage:errInfo + '(error)'});
        };
        xhr.ontimeout = function(){
            callback({status:xhr.status, errorMessage:errInfo + '(time out)'});
        };
        xhr.send(null);
    };
}
