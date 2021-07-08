/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
 */
/**
 * @packageDocumentation
 * @module asset-manager
 */
import { BUILD, EDITOR } from 'internal:constants';
import { sys } from '../platform/sys';
import { js } from '../utils';
import { basename } from '../utils/path';
import downloadDomImage from './download-dom-image';
import downloadFile from './download-file';
import downloadScript from './download-script';
import { CompleteCallback, CompleteCallbackNoData, IBundleOptions, IDownloadParseOptions, files } from './shared';
import { urlAppendTimestamp } from './utilities';
import { legacyCC } from '../global-exports';
import { IConfigOption } from './config';

export type DownloadHandler = (url: string, opitons: IDownloadParseOptions, onComplete: CompleteCallback) => void;

interface IDownloadRequest {
    id: string;
    priority: number;
    url: string;
    options: IDownloadParseOptions;
    completeCallbacks: CompleteCallback[];
    handler: DownloadHandler;
    maxRetryCount: number;
    maxConcurrency: number;
    maxRequestsPerFrame: number;
    retryTimes: number;
    delay: number;
    isDownloading: boolean;
    isFinished: boolean;
    err: Error | null;
    data: any;
}

const REGEX = /^(?:\w+:\/\/|\.+\/).+/;

const downloadImage = (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) => {
    // if createImageBitmap is valid, we can transform blob to ImageBitmap. Otherwise, just use HTMLImageElement to load
    const func = sys.capabilities.imageBitmap && legacyCC.assetManager.allowImageBitmap ? downloadBlob : downloadDomImage;
    func(url, options, onComplete);
};

const downloadBlob = (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) => {
    options.xhrResponseType = 'blob';
    downloadFile(url, options, options.onFileProgress, onComplete);
};

const downloadJson = (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback<Record<string, any>>) => {
    options.xhrResponseType = 'json';
    downloadFile(url, options, options.onFileProgress, onComplete);
};

const downloadArrayBuffer = (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) => {
    options.xhrResponseType = 'arraybuffer';
    downloadFile(url, options, options.onFileProgress, onComplete);
};

const downloadText = (url: string, options: IDownloadParseOptions, onComplete: CompleteCallback) => {
    options.xhrResponseType = 'text';
    downloadFile(url, options, options.onFileProgress, onComplete);
};

const downloadBundle = (nameOrUrl: string, options: IBundleOptions, onComplete: CompleteCallback) => {
    const bundleName = basename(nameOrUrl);
    let url = nameOrUrl;
    if (!REGEX.test(url)) {
        if (downloader.remoteBundles.indexOf(bundleName) !== -1) {
            url = `${downloader.remoteServerAddress}remote/${bundleName}`;
        } else {
            url = `assets/${bundleName}`;
        }
    }
    const version = options.version || downloader.bundleVers![bundleName];
    let count = 0;
    const config = `${url}/config.${version ? `${version}.` : ''}json`;
    let out: IConfigOption | null = null;
    let error: Error | null = null;
    downloadJson(config, options, (err, response) => {
        error = err;
        out = response as IConfigOption;
        if (out) { out.base = `${url}/`; }
        if (++count === 2) {
            onComplete(error, out);
        }
    });

    const jspath = `${url}/index.${version ? `${version}.` : ''}js`;
    downloadScript(jspath, options, (err) => {
        error = err;
        if (++count === 2) {
            onComplete(err, out);
        }
    });
};

/**
 * @en
 * Control all download process, it is a singleton. All member can be accessed with `cc.assetManager.downloader` , it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Audio
 * 4. Assets
 * 5. Scripts
 *
 * @zh
 * 管理所有下载过程，downloader 是个单例，所有成员能通过 `cc.assetManager.downloader` 访问，它能下载以下几种类型的文件：
 * 1. 文本
 * 2. 图片
 * 3. 音频
 * 4. 资源
 * 5. 脚本
 *
 */
export class Downloader {
    /**
     * @en
     * The maximum number of concurrent when downloading
     *
     * @zh
     * 下载时的最大并发数
     */
    public maxConcurrency = 6;

    /**
     * @en
     * The maximum number of request can be launched per frame when downloading
     *
     * @zh
     * 下载时每帧可以启动的最大请求数
     *
     */
    public maxRequestsPerFrame = 6;

    /**
     * @en
     * The address of remote server
     *
     * @zh
     * 远程服务器地址
     *
     */
    public get remoteServerAddress () {
        return this._remoteServerAddress;
    }

    /**
     * @en
     * The max number of retries when fail
     *
     * @zh
     * 失败重试次数
     *
     * @property maxRetryCount
     * @type {Number}
     */
    public maxRetryCount = BUILD ? 3 : 0;

    /**
     * @en
     * Wait for while before another retry, unit: ms
     *
     * @zh
     * 重试的间隔时间
     *
     */
    public retryInterval = 2000;

    public appendTimeStamp = !!EDITOR;

    public limited = !EDITOR;

    public bundleVers: Record<string, string> | null = null;

    public remoteBundles: string[] = [];

    public downloadDomImage = downloadDomImage;

    public downloadDomAudio: DownloadHandler | null = null;

    public downloadFile = downloadFile;

    public downloadScript = downloadScript;

    // dafault handler map
    private _downloaders: Record<string, DownloadHandler> = {
        // Images
        '.png': downloadImage,
        '.jpg': downloadImage,
        '.bmp': downloadImage,
        '.jpeg': downloadImage,
        '.gif': downloadImage,
        '.ico': downloadImage,
        '.tiff': downloadImage,
        '.webp': downloadImage,
        '.image': downloadImage,
        '.pvr': downloadArrayBuffer,
        '.pkm': downloadArrayBuffer,
        '.astc': downloadArrayBuffer,

        // Txt
        '.txt': downloadText,
        '.xml': downloadText,
        '.vsh': downloadText,
        '.fsh': downloadText,
        '.atlas': downloadText,

        '.tmx': downloadText,
        '.tsx': downloadText,

        '.json': downloadJson,
        '.ExportJson': downloadJson,
        '.plist': downloadText,

        '.fnt': downloadText,

        // Binary
        '.binary': downloadArrayBuffer,
        '.bin': downloadArrayBuffer,
        '.dbbin': downloadArrayBuffer,
        '.skel': downloadArrayBuffer,

        '.js': downloadScript,

        bundle: downloadBundle,

        default: downloadText,
    };

    private _queue: IDownloadRequest[] = [];
    private _queueDirty = false;
    // the number of loading thread
    private _totalNum = 0;
    // the number of request that launched in this period
    private _totalNumThisPeriod = 0;
    private _remoteServerAddress = '';

    public init (remoteServerAddress = '', bundleVers: Record<string, string> = {}, remoteBundles: string[] = []) {
        this._queue.length = 0;
        this._remoteServerAddress = remoteServerAddress;
        this.bundleVers = bundleVers;
        this.remoteBundles = remoteBundles;
    }

    /**
     * @en
     * Register custom handler if you want to change default behavior or extend downloader to download other format file
     *
     * @zh
     * 当你想修改默认行为或者拓展 downloader 来下载其他格式文件时可以注册自定义的 handler
     *
     * @param type - Extension likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}
     * @param handler - handler
     * @param handler.url - url
     * @param handler.options - some optional paramters will be transferred to handler.
     * @param handler.onComplete - callback when finishing downloading
     *
     * @example
     * downloader.register('.tga', (url, options, onComplete) => onComplete(null, null));
     * downloader.register({'.tga': (url, options, onComplete) => onComplete(null, null), '.ext': (url, options, onComplete) => onComplete(null, null)});
     *
     */
    public register (type: string, handler: DownloadHandler): void;
    public register (map: Record<string, DownloadHandler>): void;
    public register (type: string | Record<string, DownloadHandler>, handler?: DownloadHandler) {
        if (typeof type === 'object') {
            js.mixin(this._downloaders, type);
        } else {
            this._downloaders[type] = handler as DownloadHandler;
        }
    }

    /**
     * @en
     * Use corresponding handler to download file under limitation
     *
     * @zh
     * 在限制下使用对应的 handler 来下载文件
     *
     * @param id - The unique id of this download
     * @param url - The url should be downloaded
     * @param type - The type indicates that which handler should be used to download, such as '.jpg'
     * @param options - some optional parameters will be transferred to the corresponding handler.
     * @param options.onFileProgress - progressive callback will be transferred to handler.
     * @param options.maxRetryCount - How many times should retry when download failed
     * @param options.maxConcurrency - The maximum number of concurrent when downloading
     * @param options.maxRequestsPerFrame - The maximum number of request can be launched per frame when downloading
     * @param options.priority - The priority of this url, default is 0, the greater number is higher priority.
     * @param onComplete - callback when finishing downloading
     * @param onComplete.err - The occurred error, null indicates success
     * @param onComplete.content - The downloaded file
     *
     * @example
     * download('http://example.com/test.tga', '.tga', {onFileProgress: (loaded, total) => console.lgo(loaded/total)}, onComplete: (err) => console.log(err));
     *
     */
    public download (id: string, url: string, type: string, options: IDownloadParseOptions, onComplete: CompleteCallback): void {
        // if it is downloaded, don't download again
        const file = files.get(id);
        if (file) {
            onComplete(null, file);
            return;
        }

        const request = this._queue.find((x) => x.id === id);
        if (request) {
            request.completeCallbacks.push(onComplete);
            const priority = options.priority || 0;
            if (request.priority < priority) {
                request.priority = priority;
                this._queueDirty = true;
            }
            return;
        }

        // if download fail, should retry
        const maxRetryCount = typeof options.maxRetryCount !== 'undefined' ? options.maxRetryCount : this.maxRetryCount;
        const maxConcurrency = typeof options.maxConcurrency !== 'undefined' ? options.maxConcurrency : this.maxConcurrency;
        const maxRequestsPerFrame = typeof options.maxRequestsPerFrame !== 'undefined' ? options.maxRequestsPerFrame : this.maxRequestsPerFrame;
        const handler = this._downloaders[type] || this._downloaders.default;

        this._queue.push({
            id,
            priority: options.priority || 0,
            url: urlAppendTimestamp(url, this.appendTimeStamp),
            options,
            completeCallbacks: [onComplete],
            handler,
            maxRetryCount,
            maxConcurrency,
            maxRequestsPerFrame,
            retryTimes: 0,
            delay: 0,
            isDownloading: false,
            isFinished: false,
            err: null,
            data: null,
        });
        this._queueDirty = true;
    }

    /**
     * @en Load sub package with name.
     * @zh 通过子包名加载子包代码。
     * @param name - Sub package name
     * @param completeCallback -  Callback invoked when sub package loaded
     * @param {Error} completeCallback.error - error information
     *
     * @deprecated loader.downloader.loadSubpackage is deprecated, please use AssetManager.loadBundle instead
     */
    public loadSubpackage (name: string, completeCallback?: CompleteCallbackNoData) {
        legacyCC.assetManager.loadBundle(name, null, completeCallback);
    }

    // handle the rest request in next period
    private handleQueue (dt: number) {
        for (let i = this._queue.length - 1; i >= 0; i--) {
            const request = this._queue[i];
            request.delay -= dt;
            if (request.delay > 0 || request.isDownloading) continue;
            if (request.isFinished) {
                this._queue.splice(i, 1);
                if (!request.err) { files.add(request.id, request.data); }
                const callbacks = request.completeCallbacks;
                for (let i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i](request.err, request.data);
                }
                continue;
            }
            if (!this.limited || (request.maxConcurrency > this._totalNum && request.maxRequestsPerFrame > this._totalNumThisPeriod)) {
                this._totalNum++;
                this._totalNumThisPeriod++;
                request.isDownloading = true;
                request.handler(request.url, request.options, (err, data) => {
                    request.isDownloading = false;
                    this._totalNum--;
                    if (!err) {
                        request.isFinished = true;
                        request.err = err;
                        request.data = data;
                    } else if (request.retryTimes < request.maxRetryCount) {
                        request.retryTimes++;
                        request.delay = this.retryInterval;
                    } else {
                        request.isFinished = true;
                        request.err = err;
                        request.data = data;
                    }
                });
            }
        }
    }

    private resetTotalNumOfThisFrame () {
        this._totalNumThisPeriod = 0;
    }

    public update (dt: number) {
        if (this._queue.length > 0) {
            if (this._queueDirty) {
                this._queue.sort((a, b) => a.priority - b.priority);
                this._queueDirty = false;
            }
            this.resetTotalNumOfThisFrame();
            this.handleQueue(dt);
        }
    }
}

const downloader = new Downloader();

export default downloader;
