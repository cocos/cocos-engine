var sys = require('../platform/CCSys');

if (CC_JSB) {
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

        if (sys.platform === sys.WECHAT_GAME) {
            var fs = wx.getFileSystemManager();
            var filePath = url;
            // var localPath = wx.env.USER_DATA_PATH + '/' + filePath;
            // Read from package
            // fs.accessSync(filePath);
            fs.readFile({
                filePath: filePath,
                encoding: 'utf8',
                success: function (res) {
                    if (res.data) {
                        // console.error('read file success');
                        callback(null, res.data);
                    }
                },
                fail: function (res) {
                    if (res.errMsg) {
                        console.error('read file path' + filePath + ' failed!');
                        cc.game.emit('xhr-load-error:', res.errMsg);
                        callback({status:0, errorMessage: res.errMsg});
                    }
                }
            });
            return;
        }

        var xhr = cc.loader.getXMLHttpRequest(),
            errInfo = 'Load ' + url + ' failed!',
            navigator = window.navigator;
        xhr.open('GET', url, true);
        if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            // IE-specific logic here
            xhr.setRequestHeader('Accept-Charset', 'utf-8');
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        callback(null, xhr.responseText);
                    }
                    else {
                        callback({status:xhr.status, errorMessage:errInfo});
                    }
                }
            };
        } else {
            if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
            xhr.onload = function () {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        callback(null, xhr.responseText);
                    }
                    else {
                        callback({status:xhr.status, errorMessage:errInfo});
                    }
                }
            };
            xhr.onerror = function(){
                callback({status:xhr.status, errorMessage:errInfo});
            };
        }
        xhr.send(null);
    };
}
