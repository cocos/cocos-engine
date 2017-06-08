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
var JS = require('../platform/js');
var Path = require('../utils/CCPath');
var misc = require('../utils/misc');
var Pipeline = require('./pipeline');
var PackDownloader = require('./pack-downloader');
// var downloadBinary = require('./binary-downloader');
var downloadText = require('./text-downloader');

var urlAppendTimestamp = require('./utils').urlAppendTimestamp;

var downloadAudio;
if (!CC_EDITOR || !Editor.isMainProcess) {
    downloadAudio = require('./audio-downloader');
}
else {
    downloadAudio = null;
}

function downloadScript (item, callback, isAsync) {
    var url = item.url,
        d = document,
        s = document.createElement('script');
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

function downloadWebp (item, callback, isCrossOrigin, img) {
    if (!cc.sys.capabilities.webp) {
        return new Error('Load Webp ( ' + item.url + ' ) failed');
    }
    return downloadImage(item, callback, isCrossOrigin, img);
}

function downloadImage (item, callback, isCrossOrigin, img) {
    if (isCrossOrigin === undefined) {
        isCrossOrigin = true;
    }

    var url = urlAppendTimestamp(item.url);
    img = img || misc.imagePool.get();
    if (isCrossOrigin && window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }
    else {
        img.crossOrigin = null;
    }

    if (img.complete && img.naturalWidth > 0 && img.src === url) {
        return img;
    }
    else {
        function loadCallback () {
            img.removeEventListener('load', loadCallback);
            img.removeEventListener('error', errorCallback);

            callback(null, img);
        }
        function errorCallback () {
            img.removeEventListener('load', loadCallback);
            img.removeEventListener('error', errorCallback);

            // Retry without crossOrigin mark if crossOrigin loading fails
            // Do not retry if protocol is https, even if the image is loaded, cross origin image isn't renderable.
            if (window.location.protocol !== 'https:' && img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
                downloadImage(item, callback, false, img);
            }
            else {
                callback(new Error('Load image (' + url + ') failed'));
            }
        }

        img.addEventListener('load', loadCallback);
        img.addEventListener('error', errorCallback);
        img.src = url;
    }
}

var FONT_TYPE = {
    '.eot' : 'embedded-opentype',
    '.ttf' : 'truetype',
    '.ttc' : 'truetype',
    '.woff' : 'woff',
    '.svg' : 'svg'
};
function _loadFont (name, srcs, type){
    var doc = document,
        fontStyle = document.createElement('style');
    fontStyle.type = 'text/css';
    doc.body.appendChild(fontStyle);

    var fontStr = '';
    if (isNaN(name - 0)) {
        fontStr += '@font-face { font-family:' + name + '; src:';
    }
    else {
        fontStr += '@font-face { font-family:\'' + name + '\'; src:';
    }
    if (srcs instanceof Array) {
        for (var i = 0, li = srcs.length; i < li; i++) {
            var src = srcs[i];
            type = Path.extname(src).toLowerCase();
            fontStr += 'url(\'' + srcs[i] + '\') format(\'' + FONT_TYPE[type] + '\')';
            fontStr += (i === li - 1) ? ';' : ',';
        }
    } else {
        type = type.toLowerCase();
        fontStr += 'url(\'' + srcs + '\') format(\'' + FONT_TYPE[type] + '\');';
    }
    fontStyle.textContent += fontStr + '}';

    //<div style="font-family: PressStart;">.</div>
    var preloadDiv = document.createElement('div');
    var _divStyle =  preloadDiv.style;
    _divStyle.fontFamily = name;
    preloadDiv.innerHTML = '.';
    _divStyle.position = 'absolute';
    _divStyle.left = '-100px';
    _divStyle.top = '-100px';
    doc.body.appendChild(preloadDiv);
}
function downloadFont (item, callback) {
    var url = item.url,
        type = item.type,
        name = item.name,
        srcs = item.srcs;
    if (name && srcs) {
        if (srcs.indexOf(url) === -1) {
            srcs.push(url);
        }
        _loadFont(name, srcs);
    } else {
        type = Path.extname(url);
        name = Path.basename(url, type);
        _loadFont(name, url, type);
    }
    if (document.fonts) {
        document.fonts.load('1em ' + name).then(function () {
            callback(null, null);
        }, function(err){
            callback(err);
        });
    } else {
        return null;
    }
}

function downloadUuid (item, callback) {
    var result = PackDownloader.load(item, callback);
    if (result === undefined) {
        return this.extMap['json'](item, callback);
    }
    else if (!!result) {
        return result;
    }
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
    'webp' : downloadWebp,
    'image' : downloadImage,

    // Audio
    'mp3' : downloadAudio,
    'ogg' : downloadAudio,
    'wav' : downloadAudio,
    'm4a' : downloadAudio,

    // Txt
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

    // Font
    'font' : downloadFont,
    'eot' : downloadFont,
    'ttf' : downloadFont,
    'woff' : downloadFont,
    'svg' : downloadFont,
    'ttc' : downloadFont,

    // Deserializer
    'uuid' : downloadUuid,

    'default' : downloadText
};

var ID = 'Downloader';

/**
 * The downloader pipe, it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Script
 * 4. Audio
 * 5. Assets
 * All unknown type will be downloaded as plain text.
 * You can pass custom supported types in the constructor.
 * @class Pipeline.Downloader
 */
/**
 * Constructor of Downloader, you can pass custom supported types.
 *
 * @method constructor
 * @param {Object} extMap Custom supported types with corresponded handler
 * @example
 *  var downloader = new Downloader({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 */
var Downloader = function (extMap) {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
    this._curConcurrent = 0;
    this._loadQueue = [];

    this.extMap = JS.mixin(extMap, defaultMap);
};
Downloader.ID = ID;

/**
 * Add custom supported types handler or modify existing type handler.
 * @method addHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */
Downloader.prototype.addHandlers = function (extMap) {
    JS.mixin(this.extMap, extMap);
};

Downloader.prototype._handleLoadQueue = function () {
    while (this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT) {
        var nextOne = this._loadQueue.shift();
        if (!nextOne) {
            break;
        }
        var syncRet = this.handle(nextOne.item, nextOne.callback);
        if (syncRet !== undefined) {
            if (syncRet instanceof Error) {
                nextOne.callback(syncRet);
            }
            else {
                nextOne.callback(null, syncRet);
            }
        }
    }
};

Downloader.prototype.handle = function (item, callback) {
    var self = this;
    var downloadFunc = this.extMap[item.type] || this.extMap['default'];
    var syncRet = undefined;
    if (this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT) {
        this._curConcurrent++;
        syncRet = downloadFunc.call(this, item, function (err, result) {
            self._curConcurrent = Math.max(0, self._curConcurrent - 1);
            self._handleLoadQueue();
            callback && callback(err, result);
        });
        if (syncRet !== undefined) {
            this._curConcurrent = Math.max(0, this._curConcurrent - 1);
            this._handleLoadQueue();
            return syncRet;
        }
    }
    else if (item.ignoreMaxConcurrency) {
        syncRet = downloadFunc.call(this, item, callback);
        if (syncRet !== undefined) {
            return syncRet;
        }
    }
    else {
        this._loadQueue.push({
            item: item,
            callback: callback
        });
    }
};

Pipeline.Downloader = module.exports = Downloader;
