/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const js = require('../platform/js');
const debug = require('../CCDebug');
require('../utils/CCPath');
const Pipeline = require('./pipeline');
const PackDownloader = require('./pack-downloader');

let downloadBinary = require('./binary-downloader');
let downloadText = require('./text-downloader');
let urlAppendTimestamp = require('./utils').urlAppendTimestamp;

var downloadAudio;
if (!CC_EDITOR || !Editor.isMainProcess) {
    downloadAudio = require('./audio-downloader');
}
else {
    downloadAudio = null;
}

function skip () {
    return null;
}

function downloadScript (item, callback, isAsync) {
    var url = item.url,
        d = document,
        s = document.createElement('script');

    if (window.location.protocol !== 'file:') {
        s.crossOrigin = 'anonymous';
    }

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
        callback(new Error(debug.getError(4928, url)));
    }
    s.addEventListener('load', loadHandler, false);
    s.addEventListener('error', errorHandler, false);
    d.body.appendChild(s);
}

function downloadImage (item, callback, isCrossOrigin, img) {
    if (isCrossOrigin === undefined) {
        isCrossOrigin = true;
    }

    var url = urlAppendTimestamp(item.url);
    img = img || new Image();
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

            img.id = item.id;
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
                callback(new Error(debug.getError(4930, url)));
            }
        }

        img.addEventListener('load', loadCallback);
        img.addEventListener('error', errorCallback);
        img.src = url;
    }
}

function downloadUuid (item, callback) {
    var result = PackDownloader.load(item, callback);
    if (result === undefined) {
        return this.extMap['json'](item, callback);
    }
    return result || undefined;
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
    'image' : downloadImage,
    'pvr': downloadBinary,
    'pkm': downloadBinary,

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
    'font' : skip,
    'eot' : skip,
    'ttf' : skip,
    'woff' : skip,
    'svg' : skip,
    'ttc' : skip,

    // Deserializer
    'uuid' : downloadUuid,

    // Binary
    'binary' : downloadBinary,
    'bin' : downloadBinary,
    'dbbin' : downloadBinary,
    'skel': downloadBinary,

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

    this._subpackages = {};

    this.extMap = js.mixin(extMap, defaultMap);
};
Downloader.ID = ID;
Downloader.PackDownloader = PackDownloader;

/**
 * Add custom supported types handler or modify existing type handler.
 * @method addHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */
Downloader.prototype.addHandlers = function (extMap) {
    js.mixin(this.extMap, extMap);
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

/**
 * !#en
 * Load subpackage with name.
 * !#zh
 * 通过子包名加载子包代码。
 * @method loadSubpackage
 * @param {String} name - Subpackage name
 * @param {Function} [progressCallback] - Callback when progress changed
 * @param {Function} [completeCallback] -  Callback invoked when subpackage loaded
 * @param {Error} completeCallback.error - error information
 */
Downloader.prototype.loadSubpackage = function (name, progressCallback, completeCallback) {
    if (!completeCallback && progressCallback) {
        completeCallback = progressCallback;
        progressCallback = null;
    }
    let pac = this._subpackages[name];
    if (pac) {
        if (pac.loaded) {
            if (completeCallback) completeCallback();
        }
        else {
            downloadScript({url: pac.path + 'index.js'}, function (err) {
                if (!err) {
                    pac.loaded = true;
                }
                if (completeCallback) completeCallback(err);
            });
        }
    }
    else if (completeCallback) {
        completeCallback(new Error(`Can't find subpackage ${name}`));
    }
};

Pipeline.Downloader = module.exports = Downloader;
