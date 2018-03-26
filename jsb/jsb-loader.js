/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

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
    return item.url;
}

function downloadImage(item, callback) {
    let img = new Image();
    img.src = item.url;
    img.onload = function(info) {
        callback(null, img);
    }
    // Don't return anything to use async loading.
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

//cjh FIXME: remote image should still use jsb.loadRemoteImage.

//function loadImage (item, callback) {
//    var url = item.url;
//
//    var cachedTex = cc.textureCache.getTextureForKey(url);
//    if (cachedTex) {
//        return cachedTex;
//    }
//    else if (url.match(jsb.urlRegExp)) {
//        jsb.loadRemoteImg(url, function(succeed, tex) {
//            if (succeed) {
//                tex.url = url;
//                callback && callback(null, tex);
//            }
//            else {
//                callback && callback(new Error('Load image failed: ' + url));
//            }
//        });
//    }
//    else {
//        var addImageCallback = function (tex) {
//            if (tex instanceof cc.Texture2D) {
//                tex.url = url;
//                callback && callback(null, tex);
//            }
//            else {
//                callback && callback(new Error('Load image failed: ' + url));
//            }
//        };
//        cc.textureCache._addImageAsync(url, addImageCallback);
//    }
//}

//cc.loader.addLoadHandlers({
//    // Images
//    'png' : loadImage,
//    'jpg' : loadImage,
//    'bmp' : loadImage,
//    'jpeg' : loadImage,
//    'gif' : loadImage,
//    'ico' : loadImage,
//    'tiff' : loadImage,
//    'webp' : loadImage,
//    'image' : loadImage,
//
//    'default' : empty
//});

