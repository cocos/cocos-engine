/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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

function downloadScript (item, callback) {
    require(item.url);
    return null;
}

let audioDownloader = new jsb.Downloader();
let audioUrlMap = {};  // key: url, value: { loadingItem, callback }

audioDownloader.setOnFileTaskSuccess(task => {
    let { item, callback } = audioUrlMap[task.requestURL];
    if (!(item && callback)) {
        return;
    }

    item.url = task.storagePath;
    item.rawUrl = task.storagePath;
    
    callback(null, item);
    delete audioUrlMap[task.requestURL];
});

audioDownloader.setOnTaskError((task, errorCode, errorCodeInternal, errorStr) => {
    let { callback } = audioUrlMap[task.requestURL];
    callback && callback(errorStr, null);
    delete audioUrlMap[task.requestURL];
});

function downloadAudio (item, callback) {
    if (/^http/.test(item.url)) {
        let index = item.url.lastIndexOf('/');
        let fileName = item.url.substr(index+1);
        let storagePath = jsb.fileUtils.getWritablePath() + fileName;

        // load from local cache
        if (jsb.fileUtils.isFileExist(storagePath)) {
            item.url = storagePath;
            item.rawUrl = storagePath;
            callback && callback(null, item);
        }
        // download remote audio
        else {
            audioUrlMap[item.url] = { item, callback };
            audioDownloader.createDownloadFileTask(item.url, storagePath);
        }
        // Don't return anything to use async loading.
    }
    else {
        return item.url;
    }
}

function loadAudio (item, callback) {
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

function downloadImage(item, callback) {
    let img = new Image();
    img.src = item.url;
    img.onload = function(info) {
        callback(null, img);
    }
    // Don't return anything to use async loading.
}

function _getFontFamily (fontHandle) {
    var ttfIndex = fontHandle.lastIndexOf(".ttf");
    if (ttfIndex === -1) return fontHandle;

    var slashPos = fontHandle.lastIndexOf("/");
    var fontFamilyName;
    if (slashPos === -1) {
        fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
    } else {
        fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
    }
    if (fontFamilyName.indexOf(' ') !== -1) {
        fontFamilyName = '"' + fontFamilyName + '"';
    }
    return fontFamilyName;
}

function downloadText (item) {
    var url = item.url;

    var result = jsb.fileUtils.getStringFromFile(url);
    if (typeof result === 'string' && result) {
        result = result.replace(/\\r\\n/g, '\\n');
        return result;
    }
    else {
        return new Error('Download text failed: ' + url);
    }
}

function downloadBinary (item) {
    var url = item.url;

    var result = jsb.fileUtils.getDataFromFile(url);
    if (result) {
        return result;
    }
    else {
        return new Error('Download binary file failed: ' + url);
    }
}

function loadFont (item, callback) {
    let url = item.url;
    let fontFamilyName = _getFontFamily(url);

    let fontFace = new FontFace(fontFamilyName, "url('" + url + "')");
    document.fonts.add(fontFace);

    fontFace.load();
    fontFace.loaded.then(function() {
        callback(null, fontFamilyName);
    }, function () {
        cc.warnID(4933, fontFamilyName);
        callback(null, fontFamilyName);
    });
}

function loadCompressedTex (item) {
    return item.content;
}

cc.loader.addDownloadHandlers({
    // JS
    'js' : downloadScript,
    'jsc' : downloadScript,

    // Images
    'png' : downloadImage,
    'jpg' : downloadImage,
    'bmp' : downloadImage,
    'jpeg' : downloadImage,
    'gif' : downloadImage,
    'ico' : downloadImage,
    'tiff' : downloadImage,
    'webp' : downloadImage,
    'image' : downloadImage,
    'pvr' : downloadImage,
    'pkm' : downloadImage,

    // Audio
    'mp3' : downloadAudio,
    'ogg' : downloadAudio,
    'wav' : downloadAudio,
    'mp4' : downloadAudio,
    'm4a' : downloadAudio,

    // Text
    'txt' : downloadText,
    'xml' : downloadText,
    'vsh' : downloadText,
    'fsh' : downloadText,
    'atlas' : downloadText,

    'tmx' : downloadText,
    'tsx' : downloadText,

    'json' : downloadText,
    'ExportJson' : downloadText,
    'plist' : downloadText,

    'fnt' : downloadText,

    'binary' : downloadBinary,
    'bin' : downloadBinary,
    'dbbin': downloadBinary,

    'default' : downloadText
});

cc.loader.addLoadHandlers({
    // Font
    'font' : loadFont,
    'eot' : loadFont,
    'ttf' : loadFont,
    'woff' : loadFont,
    'svg' : loadFont,
    'ttc' : loadFont,

    // Audio
    'mp3' : loadAudio,
    'ogg' : loadAudio,
    'wav' : loadAudio,
    'mp4' : loadAudio,
    'm4a' : loadAudio,

    // compressed texture
    'pvr': loadCompressedTex,
    'pkm': loadCompressedTex,
});