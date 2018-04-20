/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

require('../cocos2d/core/load-pipeline');

function empty (item, callback) {
    return null;
}

function downloadScript (item, callback) {
    require(item.url);
    return null;
}

function downloadAudio (item, callback) {
    var loadByDeserializedAsset = item._owner instanceof cc.AudioClip;
    if (loadByDeserializedAsset) {
        return item.url;
    }
    else {
        var audioClip = new cc.AudioClip();
        // obtain user url through nativeUrl
        audioClip._setRawAsset(item.rawUrl, false);
        // obtain download url through _nativeAsset
        audioClip._nativeAsset = item.url;
        return audioClip;
    }
}

cc.loader.addDownloadHandlers({
    // JS
    'js' : downloadScript,
    'jsc' : downloadScript,

    //json
    'json': loadText,

    // Images
    'png' : loadImage,
    'jpg' : loadImage,
    'bmp' : loadImage,
    'jpeg' : loadImage,
    'gif' : loadImage,
    'ico' : loadImage,
    'tiff' : loadImage,
    'webp' : loadImage,
    'image' : loadImage,

    // Audio
    'mp3' : downloadAudio,
    'ogg' : downloadAudio,
    'wav' : downloadAudio,
    'mp4' : downloadAudio,
    'm4a' : downloadAudio,

    // Font
    'font' : empty,
    'eot' : empty,
    'ttf' : empty,
    'woff' : empty,
    'svg' : empty,
    'ttc' : empty,
});

//fixme:要设置到setting.js里面
let isAndroidInstant = true;
let serverPath = "http://192.168.54.67:7456/";
function loadImage (item, callback) {
    var url = item.url;
    var isRemote = jsb.urlRegExp.test(url);
    var downloadPath = jsb.fileUtils.getWritablePath() + url;
    if (isAndroidInstant) {
        isRemote = !jsb.fileUtils.isFileExist(url) && !jsb.fileUtils.isFileExist(downloadPath);
    }

    var loadByDeserializedTexture = item._owner instanceof cc.Texture2D;
    if (loadByDeserializedTexture) {
        // load Image
        var loader = isRemote ? jsb.initRemoteImg : jsb.initTextureAsync;
        loader(item._owner, isAndroidInstant && isRemote ? serverPath + url : url, function(succeed) {
            if (succeed) {
                callback && callback(null);
            }
            else {
                callback && callback(new Error('Load image failed: ' + url));
            }
        });
    }
    else {
        var cachedTex = cc.textureCache.getTextureForKey(url);
        if (cachedTex) {
            return cachedTex;
        }
        else if (isRemote) {
            jsb.loadRemoteImg(isAndroidInstant ? url : serverPath + url, function(succeed, tex) {
                if (succeed) {
                    tex.url = item.rawUrl;
                    tex._setRawAsset(item.rawUrl, false);
                    callback && callback(null, tex);
                }
                else {
                    callback && callback(new Error('Load image failed: ' + url));
                }
            });
        }
        else {
            cc.textureCache._addImageAsync(url, function (tex) {
                if (tex instanceof cc.Texture2D) {
                    tex.url = item.rawUrl;
                    tex._setRawAsset(item.rawUrl, false);
                    callback && callback(null, tex);
                }
                else {
                    callback && callback(new Error('Load image failed: ' + url));
                }
            });
        }
    }
}


let textDownloader = new jsb.Downloader({
    countOfMaxProcessingTasks: 32,
    timeoutInSeconds: 60,
    tempFileNameSuffix: 'game'
});
let downloaderCbMap = {};

textDownloader.setOnTaskError((function (task, errCode, errorCodeInternal, errorStr) {
    let cb = downloaderCbMap[task.requestURL];
    cb && cb({
        errorCode: errCode
    });
    delete downloaderCbMap[task.requestURL];
}));

textDownloader.setOnFileTaskSuccess((function (task) {
    var cb = downloaderCbMap[task.requestURL];
    if (cb) {
        var str = jsb.fileUtils.getStringFromFile(task.storagePath);
        console.log("str is ", str);
        str ? cb(null, str) : cb({
                errorMessage: "file not found"
            });
        delete downloaderCbMap[task.requestURL];
    }
}));

function loadText(item, callback) {
    let url = item.url;

    let remotePath = jsb.fileUtils.getWritablePath() + url;
    if (jsb.fileUtils.isFileExist(url)) {
        var result = jsb.fileUtils.getStringFromFile(url);
        if (typeof result === 'string' && result) {
            return result;
        }
    }

    if (jsb.fileUtils.isFileExist(remotePath)) {
        var result = jsb.fileUtils.getStringFromFile(remotePath);
        if (typeof result === 'string' && result) {
            return result;
        }
    }

    let remoteUrl = serverPath + url;
    downloaderCbMap[remoteUrl] = callback;
    textDownloader.createDownloadFileTask(remoteUrl, remotePath, item.uuid);
}

cc.loader.addLoadHandlers({
    // Images
    'png' : empty,
    'jpg' : empty,
    'bmp' : empty,
    'jpeg' : empty,
    'gif' : empty,
    'ico' : empty,
    'tiff' : empty,
    'webp' : empty,
    'image' : empty,

    'default' : empty
});