/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
/**
 * @module cc.AssetManager
 */
const js = require('../platform/js');
const debug = require('../CCDebug');
const { loadFont } = require('./font-loader');
const callInNextTick = require('../platform/utils').callInNextTick;
const downloadDomImage = require('./download-dom-image');
const downloadDomAudio = require('./download-dom-audio');
const downloadFile = require('./download-file');
const downloadScript = require('./download-script.js');
const Cache = require('./cache');
const { files } = require('./shared');
const { __audioSupport, capabilities } = require('../platform/CCSys');
const { urlAppendTimestamp, retry } = require('./utilities');

const REGEX = /^(?:\w+:\/\/|\.+\/).+/;


var formatSupport = __audioSupport.format || [];

var unsupported = function (url, options, onComplete) {
    onComplete(new Error(debug.getError(4927)));
}

var downloadAudio = function (url, options, onComplete) {
    // web audio need to download file as arrayBuffer
    if (options.audioLoadMode !== cc.AudioClip.LoadMode.DOM_AUDIO) {
        downloadArrayBuffer(url, options, onComplete);
    }
    else {
        downloadDomAudio(url, options, onComplete);
    }
};

var downloadAudio = (!CC_EDITOR || !Editor.isMainProcess) ? (formatSupport.length === 0 ? unsupported : (__audioSupport.WEB_AUDIO ? downloadAudio : downloadDomAudio)) : null;

var downloadImage = function (url, options, onComplete) {
    // if createImageBitmap is valid, we can transform blob to ImageBitmap. Otherwise, just use HTMLImageElement to load
    var func = capabilities.imageBitmap && cc.macro.ALLOW_IMAGE_BITMAP ? downloadBlob : downloadDomImage;
    func.apply(this, arguments);
};

var downloadBlob = function (url, options, onComplete) {
    options.responseType = "blob";
    downloadFile(url, options, options.onFileProgress, onComplete);
};

var downloadJson = function (url, options, onComplete) {
    options.responseType = "json";
    downloadFile(url, options, options.onFileProgress, function (err, data) {
        if (!err && typeof data === 'string') {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                err = e;
            }
        }
        onComplete && onComplete(err, data);
    });
};

var downloadArrayBuffer = function (url, options, onComplete) {
    options.responseType = "arraybuffer";
    downloadFile(url, options, options.onFileProgress, onComplete);
};

var downloadText = function (url, options, onComplete) {
    options.responseType = "text";
    downloadFile(url, options, options.onFileProgress, onComplete);
};

var downloadVideo = function (url, options, onComplete) {
    onComplete(null, url);
};

var downloadBundle = function (nameOrUrl, options, onComplete) {
    let bundleName = cc.path.basename(nameOrUrl);
    let url = nameOrUrl;
    if (!REGEX.test(url)) url = 'assets/' + bundleName;
    var version = options.version || downloader.bundleVers[bundleName];
    var count = 0;
    var config = `${url}/config.${version ? version + '.' : ''}json`;
    let out = null, error = null;
    downloadJson(config, options, function (err, response) {
        if (err) {
            error = err;
        }
        out = response;
        out && (out.base = url + '/');
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });

    var js = `${url}/index.${version ? version + '.' : ''}js`;
    downloadScript(js, options, function (err) {
        if (err) {
            error = err;
        }
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });
};

var _downloading = new Cache();
var _queue = [];
var _queueDirty = false;

// the number of loading thread
var _totalNum = 0;

// the number of request that launched in this period
var _totalNumThisPeriod = 0;

// last time, if now - lastTime > period, refresh _totalNumThisPeriod.
var _lastDate = -1;

// if _totalNumThisPeriod equals max, move request to next period using setTimeOut.
var _checkNextPeriod = false;

var updateTime = function () {
    var now = Date.now();
    // use deltaTime as interval
    let interval = cc.director._deltaTime > downloader._maxInterval ? downloader._maxInterval : cc.director._deltaTime;
    if (now - _lastDate > interval * 1000) {
        _totalNumThisPeriod = 0;
        _lastDate = now;
    }
};

// handle the rest request in next period
var handleQueue = function (maxConcurrency, maxRequestsPerFrame) {
    _checkNextPeriod = false;
    updateTime();
    while (_queue.length > 0 && _totalNum < maxConcurrency && _totalNumThisPeriod < maxRequestsPerFrame) {
        if (_queueDirty) {
            _queue.sort(function (a, b) {
                return a.priority - b.priority;
            });
            _queueDirty = false;
        }
        var nextOne = _queue.pop();
        if (!nextOne) {
            break;
        }
        _totalNum++;
        _totalNumThisPeriod++;
        nextOne.invoke();
    }

    if (_queue.length > 0 && _totalNum < maxConcurrency) {
        callInNextTick(handleQueue, maxConcurrency, maxRequestsPerFrame);
        _checkNextPeriod = true;
    }
}


/**
 * !#en
 * Control all download process, it is a singleton. All member can be accessed with `cc.assetManager.downloader` , it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Audio
 * 4. Assets
 * 5. Scripts
 * 
 * !#zh
 * 管理所有下载过程，downloader 是个单例，所有成员能通过 `cc.assetManager.downloader` 访问，它能下载以下几种类型的文件：
 * 1. 文本
 * 2. 图片
 * 3. 音频
 * 4. 资源
 * 5. 脚本
 * 
 * @class Downloader
 */
var downloader = {

    _remoteServerAddress: '',
    _maxInterval: 1 / 30,
    
    /**
     * !#en 
     * The address of remote server
     * 
     * !#zh
     * 远程服务器地址
     * 
     * @property remoteServerAddress
     * @type {string}
     * @default ''
     */
    get remoteServerAddress () {
        return this._remoteServerAddress;
    },

    /**
     * !#en 
     * The maximum number of concurrent when downloading
     * 
     * !#zh
     * 下载时的最大并发数
     * 
     * @property maxConcurrency
     * @type {number}
     * @default 6
     */
    maxConcurrency: 6,

    /**
     * !#en 
     * The maximum number of request can be launched per frame when downloading
     * 
     * !#zh
     * 下载时每帧可以启动的最大请求数
     * 
     * @property maxRequestsPerFrame
     * @type {number}
     * @default 6
     */
    maxRequestsPerFrame: 6,

    /**
     * !#en
     * The max number of retries when fail
     *  
     * !#zh
     * 失败重试次数
     * 
     * @property maxRetryCount
     * @type {Number}
     */
    maxRetryCount: 3,

    appendTimeStamp: false,

    limited: true,

    /**
     * !#en
     * Wait for while before another retry, unit: ms
     * 
     * !#zh
     * 重试的间隔时间
     * 
     * @property retryInterval
     * @type {Number}
     */
    retryInterval: 2000,

    bundleVers: null,

    /*
     * !#en
     * Use Image element to download image
     *  
     * !#zh
     * 使用 Image 元素来下载图片
     * 
     * @method downloadDomImage
     * @param {string} url - Url of the image
     * @param {Object} [options] - Some optional paramters
     * @param {Function} [onComplete] - Callback when image loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {HTMLImageElement} onComplete.img - The loaded Image element, null if error occurred
     * @returns {HTMLImageElement} The image element
     * 
     * @example
     * downloadDomImage('http://example.com/test.jpg', null, (err, img) => console.log(err));
     * 
     * @typescript
     * downloadDomImage(url: string, options?: Record<string, any> , onComplete?: (err: Error, img: HTMLImageElement) => void): HTMLImageElement
     * downloadDomImage(url: string, onComplete?: (err: Error, img: HTMLImageElement) => void): HTMLImageElement
     */
    downloadDomImage: downloadDomImage,

    /*
     * !#en
     * Use audio element to download audio
     * 
     * !#zh
     * 使用 Audio 元素来下载音频 
     * 
     * @method downloadDomAudio
     * @param {string} url - Url of the audio
     * @param {Object} [options] - Some optional paramters
     * @param {Function} [onComplete] - Callback invoked when audio loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {HTMLAudioElement} onComplete.audio - The loaded audio element, null if error occurred
     * @returns {HTMLAudioElement} The audio element
     * 
     * @example
     * downloadDomAudio('http://example.com/test.mp3', null, (err, audio) => console.log(err));
     * 
     * @typescript
     * downloadDomAudio(url: string, options?: Record<string, any>, onComplete?: (err: Error, audio: HTMLAudioElement) => void): HTMLAudioElement
     * downloadDomAudio(url: string, onComplete?: (err: Error, audio: HTMLAudioElement) => void): HTMLAudioElement
     */
    downloadDomAudio: downloadDomAudio,
    
    /*
     * !#en
     * Use XMLHttpRequest to download file
     * 
     * !#zh
     * 使用 XMLHttpRequest 来下载文件
     * 
     * @method downloadFile
     * @param {string} url - Url of the file
     * @param {Object} [options] - Some optional paramters
     * @param {string} [options.responseType] - Indicate which type of content should be returned
     * @param {boolean} [options.withCredentials] - Indicate whether or not cross-site Access-Contorl requests should be made using credentials
     * @param {string} [options.mimeType] - Indicate which type of content should be returned. In some browsers, responseType does't work, you can use mimeType instead
     * @param {Number} [options.timeout] - Represent the number of ms a request can take before being terminated.
     * @param {Object} [options.header] - The header should be tranferred to server
     * @param {Function} [onFileProgress] - Callback continuously during download is processing
     * @param {Number} onFileProgress.loaded - Size of downloaded content.
     * @param {Number} onFileProgress.total - Total size of content.
     * @param {Function} [onComplete] - Callback when file loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {*} onComplete.response - The loaded content, null if error occurred, type of content can be indicated by options.responseType
     * @returns {XMLHttpRequest} The xhr to be send
     * 
     * @example
     * downloadFile('http://example.com/test.bin', {responseType: 'arraybuffer'}, null, (err, arrayBuffer) => console.log(err));
     * 
     * @typescript
     * downloadFile(url: string, options?: Record<string, any>, onFileProgress?: (loaded: Number, total: Number) => void, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
     * downloadFile(url: string, onFileProgress?: (loaded: Number, total: Number) => void, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
     * downloadFile(url: string, options?: Record<string, any>, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
     * downloadFile(url: string, onComplete?: (err: Error, response: any) => void): XMLHttpRequest
     */
    downloadFile: downloadFile,

    /*
     * !#en
     * Load script 
     * 
     * !#zh
     * 加载脚本
     * 
     * @method downloadScript
     * @param {string} url - Url of the script
     * @param {Object} [options] - Some optional paramters
     * @param {boolean} [options.isAsync] - Indicate whether or not loading process should be async
     * @param {Function} [onComplete] - Callback when script loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * 
     * @example
     * downloadScript('http://localhost:8080/index.js', null, (err) => console.log(err));
     * 
     * @typescript
     * downloadScript(url: string, options?: Record<string, any>, onComplete?: (err: Error) => void): void
     * downloadScript(url: string, onComplete?: (err: Error) => void): void
     */
    downloadScript: downloadScript,

    init (bundleVers, remoteServerAddress) {
        _downloading.clear();
        _queue.length = 0;
        this._remoteServerAddress = remoteServerAddress || '';
        this.bundleVers = bundleVers || Object.create(null);
    },

    /**
     * !#en
     * Register custom handler if you want to change default behavior or extend downloader to download other format file
     * 
     * !#zh
     * 当你想修改默认行为或者拓展 downloader 来下载其他格式文件时可以注册自定义的 handler 
     * 
     * @method register
     * @param {string|Object} type - Extension likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}
     * @param {Function} [handler] - handler
     * @param {string} handler.url - url
     * @param {Object} handler.options - some optional paramters will be transferred to handler.
     * @param {Function} handler.onComplete - callback when finishing downloading
     * 
     * @example
     * downloader.register('.tga', (url, options, onComplete) => onComplete(null, null));
     * downloader.register({'.tga': (url, options, onComplete) => onComplete(null, null), '.ext': (url, options, onComplete) => onComplete(null, null)});
     * 
     * @typescript
     * register(type: string, handler: (url: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void): void
     * register(map: Record<string, (url: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void>): void
     */
    register (type, handler) {
        if (typeof type === 'object') {
            js.mixin(downloaders, type);
        }
        else {
            downloaders[type] = handler;
        }
    },

    /**
     * !#en
     * Use corresponding handler to download file under limitation 
     * 
     * !#zh
     * 在限制下使用对应的 handler 来下载文件
     * 
     * @method download
     * @param {string} url - The url should be downloaded
     * @param {string} type - The type indicates that which handler should be used to download, such as '.jpg'
     * @param {Object} options - some optional paramters will be transferred to the corresponding handler.
     * @param {Function} [options.onFileProgress] - progressive callback will be transferred to handler.
     * @param {Number} [options.maxRetryCount] - How many times should retry when download failed
     * @param {Number} [options.maxConcurrency] - The maximum number of concurrent when downloading
     * @param {Number} [options.maxRequestsPerFrame] - The maximum number of request can be launched per frame when downloading
     * @param {Number} [options.priority] - The priority of this url, default is 0, the greater number is higher priority.
     * @param {Function} onComplete - callback when finishing downloading
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {*} onComplete.contetnt - The downloaded file
     * 
     * @example
     * download('http://example.com/test.tga', '.tga', {onFileProgress: (loaded, total) => console.lgo(loaded/total)}, onComplete: (err) => console.log(err));
     * 
     * @typescript
     * download(id: string, url: string, type: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void): void
     */
    download (id, url, type, options, onComplete) {
        let func = downloaders[type] || downloaders['default'];
        let self = this;
        // if it is downloaded, don't download again
        let file, downloadCallbacks;
        if (file = files.get(id)) {
            onComplete(null, file);
        }
        else if (downloadCallbacks = _downloading.get(id)) {
            downloadCallbacks.push(onComplete);
            for (let i = 0, l = _queue.length; i < l; i++) {
                var item = _queue[i];
                if (item.id === id) {
                    var priority = options.priority || 0;
                    if (item.priority < priority) {
                        item.priority = priority;
                        _queueDirty = true;
                    } 
                    return;
                }
            } 
        }
        else {
            // if download fail, should retry
            var maxRetryCount = typeof options.maxRetryCount !== 'undefined' ? options.maxRetryCount : this.maxRetryCount;
            var maxConcurrency = typeof options.maxConcurrency !== 'undefined' ? options.maxConcurrency : this.maxConcurrency;
            var maxRequestsPerFrame = typeof options.maxRequestsPerFrame !== 'undefined' ? options.maxRequestsPerFrame : this.maxRequestsPerFrame;

            function process (index, callback) {
                if (index === 0) {
                    _downloading.add(id, [onComplete]);
                }
                
                if (!self.limited) return func(urlAppendTimestamp(url), options, callback);

                // refresh
                updateTime();

                function invoke () {
                    func(urlAppendTimestamp(url), options, function () {
                        // when finish downloading, update _totalNum
                        _totalNum--;
                        if (!_checkNextPeriod && _queue.length > 0) {
                            callInNextTick(handleQueue, maxConcurrency, maxRequestsPerFrame);
                            _checkNextPeriod = true;
                        }
                        callback.apply(this, arguments);
                    });
                }

                if (_totalNum < maxConcurrency && _totalNumThisPeriod < maxRequestsPerFrame) {
                    invoke();
                    _totalNum++;
                    _totalNumThisPeriod++;
                }
                else {
                    // when number of request up to limitation, cache the rest
                    _queue.push({ id, priority: options.priority || 0, invoke });
                    _queueDirty = true;
    
                    if (!_checkNextPeriod && _totalNum < maxConcurrency) {
                        callInNextTick(handleQueue, maxConcurrency, maxRequestsPerFrame);
                        _checkNextPeriod = true;
                    }
                }
            }

            // when retry finished, invoke callbacks
            function finale (err, result) {
                if (!err) files.add(id, result);
                var callbacks = _downloading.remove(id);
                for (let i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i](err, result);
                }
            }
    
            retry(process, maxRetryCount, this.retryInterval, finale);
        }
    }
};

// dafault handler map
var downloaders = {
    // Images
    '.png' : downloadImage,
    '.jpg' : downloadImage,
    '.bmp' : downloadImage,
    '.jpeg' : downloadImage,
    '.gif' : downloadImage,
    '.ico' : downloadImage,
    '.tiff' : downloadImage,
    '.webp' : downloadImage,
    '.image' : downloadImage,
    '.pvr': downloadArrayBuffer,
    '.pkm': downloadArrayBuffer,
    '.astc': downloadArrayBuffer,

    // Audio
    '.mp3' : downloadAudio,
    '.ogg' : downloadAudio,
    '.wav' : downloadAudio,
    '.m4a' : downloadAudio,

    // Txt
    '.txt' : downloadText,
    '.xml' : downloadText,
    '.vsh' : downloadText,
    '.fsh' : downloadText,
    '.atlas' : downloadText,

    '.tmx' : downloadText,
    '.tsx' : downloadText,

    '.json' : downloadJson,
    '.ExportJson' : downloadJson,
    '.plist' : downloadText,

    '.fnt' : downloadText,

    // font
    '.font' : loadFont,
    '.eot' : loadFont,
    '.ttf' : loadFont,
    '.woff' : loadFont,
    '.svg' : loadFont,
    '.ttc' : loadFont,

    // Video
    '.mp4': downloadVideo,
    '.avi': downloadVideo,
    '.mov': downloadVideo,
    '.mpg': downloadVideo,
    '.mpeg': downloadVideo,
    '.rm': downloadVideo,
    '.rmvb': downloadVideo,

    // Binary
    '.binary' : downloadArrayBuffer,
    '.bin': downloadArrayBuffer,
    '.dbbin': downloadArrayBuffer,
    '.skel': downloadArrayBuffer,

    '.js': downloadScript,

    'bundle': downloadBundle,

    'default': downloadText

};

downloader._downloaders = downloaders;
module.exports = downloader;
