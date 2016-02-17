/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var JS = require('../platform/js');
var Pipeline = require('./pipeline');

// var downloadBinary = require('binary-downloader');

var _noCacheRex = /\?/;
function urlAppendTimestamp (url) {
    if (cc.game.config['noCache'] && typeof url === 'string') {
        if(_noCacheRex.test(url))
            url += '&_t=' + (new Date() - 0);
        else
            url += '?_t=' + (new Date() - 0);
    }
    return url;
}

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

function downloadScript (url, callback, isAsync) {
    var d = document, s = document.createElement('script');
    s.async = isAsync;
    s.src = urlAppendTimestamp(url);
    function loadHandler () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        callback(null, url);
    }
    function errorHandler() {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        callback(new Error('Load ' + url + ' failed!'), url);
    }
    s.addEventListener('load', loadHandler, false);
    s.addEventListener('error', errorHandler, false);
    d.body.appendChild(s);
}

function downloadText (url, callback) {
    var xhr = getXMLHttpRequest(),
        errInfo = 'Load ' + url + ' failed!',
        navigator = window.navigator;

    url = urlAppendTimestamp(url);

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
}

function downloadTextSync (url) {
    var xhr = getXMLHttpRequest();
    xhr.open('GET', url, false);
    if (/msie/i.test(window.navigator.userAgent) && !/opera/i.test(window.navigator.userAgent)) {
        // IE-specific logic here
        xhr.setRequestHeader('Accept-Charset', 'utf-8');
    } else {
        if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
    }
    xhr.send(null);
    if (xhr.readyState !== 4 || !(xhr.status === 200 || xhr.status === 0)) {
        return null;
    }
    return xhr.responseText;
}

function downloadImage (url, callback, isCrossOrigin) {
    if (isCrossOrigin === undefined) {
        isCrossOrigin = true;
    }

    url = urlAppendTimestamp(url);
    var img = new Image();
    if (isCrossOrigin && window.location.origin !== 'file://') {
        img.crossOrigin = 'Anonymous';
    }

    if (img.complete && img.naturalWidth > 0) {
        callback(null, img);
    }
    else {
        function loadCallback () {
            img.removeEventListener('load', loadCallback);
            img.removeEventListener('error', errorCallback);

            if (callback) {
                callback(null, img);
            }
        }
        function errorCallback () {
            img.removeEventListener('load', loadCallback);
            img.removeEventListener('error', errorCallback);

            if (img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
                downloadImage(url, callback, false);
            }
            else {
                callback('Load image (' + url + ') failed');
            }
        }

        img.addEventListener('load', loadCallback);
        img.addEventListener('error', errorCallback);
    }
    img.src = url;
}

var defaultMap = {
    // JS
    'js' : downloadScript,

    // Images
    'png' : downloadImage,
    'jpg' : downloadImage,
    'bmp' : downloadImage,
    'jpeg' : downloadImage,
    'gif' : downloadImage,
    'ico' : downloadImage,
    'tiff' : downloadImage,
    'webp' : downloadImage,

    // Audio
    // "mp3",
    // "ogg",
    // "wav",
    // "mp4",
    // "m4a",

    // Txt
    'txt' : downloadText,
    'xml' : downloadText,
    'vsh' : downloadText,
    'fsh' : downloadText,
    'atlas' : downloadText,

    'json' : downloadText,
    'ExportJson' : downloadText,

    'font' : downloadText,
    'eot' : downloadText,
    'ttf' : downloadText,
    'woff' : downloadText,
    'svg' : downloadText,
    'ttc' : downloadText,
    'plist' : downloadText,

    'default' : downloadText
};

/**
 * The downloader pipe, it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Script
 * 4. Audio
 * All unknown type will be downloaded as plain text.
 * You can pass custom supported types in the constructor.
 * @class Downloader
 */
/**
 * Constructor of Downloader, you can pass custom supported types.
 * @example
 *  var downloader = new Downloader({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * 
 * @method Downloader
 * @param {Object} extMap
 */
var Downloader = function (extMap) {
    this.id = 'Downloader';
    this.async = true;
    this.pipeline = null;

    this.extMap = JS.addon(extMap, defaultMap);
};
JS.mixin(Downloader.prototype, {
    handle: function (item, callback) {
        var downloadFunc = this.extMap[item.type] || this.extMap['default'];
        downloadFunc(item.src, function (err, result) {
            callback && callback(err, result);
        });
    }
});

Pipeline.Downloader = module.exports = Downloader;