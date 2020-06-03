/*
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
 */

/**
 * @category loader
 */

import {mixin} from '../utils/js';
import * as debug from '../platform/debug';
import { Pipeline, IPipe } from './pipeline';
import * as PackDownloader from './pack-downloader';
import downloadBinary from './binary-downloader';
import downloadText from './text-downloader';
import {urlAppendTimestamp} from './utils';
import { downloadAudio } from '../../audio/audio-downloader';
import { legacyCC } from '../global-exports';

function skip () {
    return null;
}

function downloadScript (item, callback, isAsync?) {
    let url = item.url,
        d = document,
        s = document.createElement('script');
    s.async = !!isAsync;
    s.src = urlAppendTimestamp(url);
    function loadHandler () {
        if (s.parentNode)
            s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        callback(null, url);
    }
    function errorHandler() {
        if (s.parentNode)
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

    let url = urlAppendTimestamp(item.url);
    img = img || new Image();
    if (isCrossOrigin && window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }
    else {
        img.crossOrigin = null;
    }

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

    if (img.complete && img.naturalWidth > 0 && img.src === url) {
        return img;
    }
    else {
        img.addEventListener('load', loadCallback);
        img.addEventListener('error', errorCallback);
        img.src = url;
    }
}

function downloadUuid (item, callback) {
    let result = PackDownloader.load(item, callback);
    if (result === undefined) {
        // @ts-ignore
        return this.extMap['json'](item, callback);
    }
    return result || undefined;
}


let defaultMap = {
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
    'bin': downloadBinary,

    'default' : downloadText
};

const ID = 'Downloader';

interface IDownloadItem {
    item;
    callback;
}

/**
 * @en The downloader pipe in {{loader}}, it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Script
 * 4. Audio
 * 5. Binary
 * All unknown type will be downloaded as plain text.
 * You can pass custom supported types in the {{loader.addDownloadHandlers}}.
 * @zh {{loader}} 中的下载管线，可以下载下列类型的文件：
 * 1. Text
 * 2. Image
 * 3. Script
 * 4. Audio
 * 5. Binary
 * 所有未知类型会被当做文本来下载，也可以通过 {{loader.addDownloadHandlers}} 来定制下载行为
 */
export default class Downloader implements IPipe {
    static ID = ID;
    static PackDownloader = PackDownloader;

    public id: string = ID;
    public async: boolean = true;
    public pipeline: Pipeline | null = null;
    private extMap: object;
    private _curConcurrent = 0;
    private _loadQueue: Array<IDownloadItem> = [];
    private _subPackages = {};

    constructor (extMap?) {
        this.extMap = mixin(extMap, defaultMap);
    }

    /**
     * @en Set sub package configurations, only available in certain platforms
     * @zh 设置子包配置，只在部分平台支持
     * @param subPackages 
     */
    setSubPackages (subPackages) {
        this._subPackages = subPackages;
    }

    /**
     * @en Add custom supported types handler or modify existing type handler.
     * @zh 添加自定义支持的类型处理程序或修改现有的类型处理程序。
     * @param extMap Custom supported types with corresponded handler
     */
    addHandlers (extMap: Map<string, Function>) {
        mixin(this.extMap, extMap);
    }

    _handleLoadQueue () {
        while (this._curConcurrent < legacyCC.macro.DOWNLOAD_MAX_CONCURRENT) {
            let nextOne = this._loadQueue.shift();
            if (!nextOne) {
                break;
            }
            let syncRet = this.handle(nextOne.item, nextOne.callback) as any;
            if (syncRet !== undefined) {
                if (syncRet instanceof Error) {
                    nextOne.callback(syncRet);
                }
                else {
                    nextOne.callback(null, syncRet);
                }
            }
        }
    }

    handle (item, callback) {
        let self = this;
        let downloadFunc = this.extMap[item.type] || this.extMap['default'];
        let syncRet = undefined;
        if (this._curConcurrent < legacyCC.macro.DOWNLOAD_MAX_CONCURRENT) {
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
    }

    /**
     * @en Load sub package with name.
     * @zh 通过子包名加载子包代码。
     * @param name - Sub package name
     * @param completeCallback -  Callback invoked when sub package loaded
     * @param {Error} completeCallback.error - error information
     */
    loadSubpackage (name: string, completeCallback?: Function) {
        let pac = this._subPackages[name];
        if (pac) {
            if (pac.loaded) {
                if (completeCallback) completeCallback();
            }
            else {
                downloadScript({url: pac.path}, function (err) {
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
    }
}

// @ts-ignore
Pipeline.Downloader = Downloader;
