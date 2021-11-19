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

const preprocess = require('./preprocess');
const fetch = require('./fetch');
const Cache = require('./cache');
const helper = require('./helper');
const releaseManager = require('./releaseManager');
const dependUtil = require('./depend-util');
const load = require('./load');
const Pipeline = require('./pipeline');
const Task = require('./task');
const RequestItem = require('./request-item');
const downloader = require('./downloader');
const parser = require('./parser');
const packManager = require('./pack-manager');
const Bundle = require('./bundle');
const builtins = require('./builtins');
const factory = require('./factory');
const { parse, combine } = require('./urlTransformer');
const { parseParameters, asyncify } = require('./utilities');
const { assets, files, parsed, pipeline, transformPipeline, fetchPipeline, RequestType, bundles, BuiltinBundleName } = require('./shared');


/**
 * @module cc
 */
/**
 * !#en
 * This module controls asset's behaviors and information, include loading, releasing etc. it is a singleton
 * All member can be accessed with `cc.assetManager`.
 * 
 * !#zh
 * 此模块管理资源的行为和信息，包括加载，释放等，这是一个单例，所有成员能够通过 `cc.assetManager` 调用
 * 
 * @class AssetManager
 */
function AssetManager () {

    this._preprocessPipe = preprocess;

    this._fetchPipe = fetch;

    this._loadPipe = load;

    /**
     * !#en 
     * Normal loading pipeline
     * 
     * !#zh
     * 正常加载管线
     * 
     * @property pipeline
     * @type {Pipeline}
     */
    this.pipeline = pipeline.append(preprocess).append(load);
    
    /**
     * !#en 
     * Fetching pipeline
     * 
     * !#zh
     * 下载管线
     * 
     * @property fetchPipeline
     * @type {Pipeline}
     */
    this.fetchPipeline = fetchPipeline.append(preprocess).append(fetch);

    /**
     * !#en 
     * Url transformer
     * 
     * !#zh
     * Url 转换器
     * 
     * @property transformPipeline
     * @type {Pipeline}
     */
    this.transformPipeline = transformPipeline.append(parse).append(combine);


    /**
     * !#en 
     * The collection of bundle which is already loaded, you can remove cache with {{#crossLink "AssetManager/removeBundle:method"}}{{/crossLink}}
     * 
     * !#zh
     * 已加载 bundle 的集合， 你能通过 {{#crossLink "AssetManager/removeBundle:method"}}{{/crossLink}} 来移除缓存
     * 
     * @property bundles
     * @type {Cache}
     * @typescript
     * bundles: AssetManager.Cache<AssetManager.Bundle>
     */
    this.bundles = bundles;

    /**
     * !#en 
     * The collection of asset which is already loaded, you can remove cache with {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     * 
     * !#zh
     * 已加载资源的集合， 你能通过 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} 来移除缓存
     * 
     * @property assets
     * @type {Cache}
     * @typescript
     * assets: AssetManager.Cache<cc.Asset>
     */
    this.assets = assets;
    
    this._files = files;
    
    this._parsed = parsed;

    this.generalImportBase = '';

    this.generalNativeBase = '';

    /**
     * !#en 
     * Manage relationship between asset and its dependencies
     * 
     * !#zh
     * 管理资源依赖关系
     * 
     * @property dependUtil
     * @type {DependUtil}
     */
    this.dependUtil = dependUtil;

    this._releaseManager = releaseManager;

    /**
     * !#en 
     * Whether or not cache the loaded asset
     * 
     * !#zh
     * 是否缓存已加载的资源
     * 
     * @property cacheAsset
     * @type {boolean}
     */
    this.cacheAsset = true;

    /**
     * !#en 
     * Whether or not load asset forcely, if it is true, asset will be loaded regardless of error
     * 
     * !#zh
     * 是否强制加载资源, 如果为 true ，加载资源将会忽略报错
     * 
     * @property force
     * @type {boolean}
     */
    this.force = false;

    /**
     * !#en 
     * Some useful function
     * 
     * !#zh
     * 一些有用的方法
     * 
     * @property utils
     * @type {Helper}
     */
    this.utils = helper;

    /**
     * !#en 
     * Manage all downloading task
     * 
     * !#zh
     * 管理所有下载任务
     * 
     * @property downloader
     * @type {Downloader}
     */
    this.downloader = downloader; 

    /**
     * !#en 
     * Manage all parsing task
     * 
     * !#zh
     * 管理所有解析任务
     * 
     * @property parser
     * @type {Parser}
     */
    this.parser = parser;

    /**
     * !#en 
     * Manage internal asset
     * 
     * !#zh
     * 管理内置资源
     * 
     * @property builtins
     * @type {Builtins}
     */
    this.builtins = builtins;

    /**
     * !#en 
     * Manage all packed asset
     * 
     * !#zh
     * 管理所有合并后的资源
     * 
     * @property packManager
     * @type {PackManager}
     */
    this.packManager = packManager;

    this.factory = factory;

    /**
     * !#en 
     * Cache manager is a module which controls all caches downloaded from server in non-web platform.
     * 
     * !#zh
     * 缓存管理器是一个模块，在非 WEB 平台上，用于管理所有从服务器上下载下来的缓存
     * 
     * @property cacheManager
     * @type {cc.AssetManager.CacheManager}
     * @typescript
     * cacheManager: cc.AssetManager.CacheManager|null
     */
    this.cacheManager = null;

    /**
     * !#en 
     * The preset of options
     * 
     * !#zh
     * 可选参数的预设集
     * 
     * @property presets
     * @type {Object}
     * @typescript
     * presets: Record<string, Record<string, any>>
     */
    this.presets = {
        'default': {
            priority: 0,
        },

        'preload': {
            maxConcurrency: 2, 
            maxRequestsPerFrame: 2,
            priority: -1,
        },

        'scene': {
            maxConcurrency: 8, 
            maxRequestsPerFrame: 8,
            priority: 1,
        },

        'bundle': {
            maxConcurrency: 8, 
            maxRequestsPerFrame: 8,
            priority: 2,
        },

        'remote': {
            maxRetryCount: 4
        },

        'script': {
            maxConcurrency: 1024,
            maxRequestsPerFrame: 1024,
            priority: 2
        }
    }

}

AssetManager.Pipeline = Pipeline;
AssetManager.Task = Task;
AssetManager.Cache = Cache;
AssetManager.RequestItem = RequestItem;
AssetManager.Bundle = Bundle;
AssetManager.BuiltinBundleName = BuiltinBundleName;

AssetManager.prototype = {

    constructor: AssetManager,

    /**
     * !#en 
     * The builtin 'main' bundle
     * 
     * !#zh
     * 内置 main 包
     * 
     * @property main
     * @readonly
     * @type {Bundle}
     */
    get main () {
        return bundles.get(BuiltinBundleName.MAIN);
    },

    /**
     * !#en 
     * The builtin 'resources' bundle
     * 
     * !#zh
     * 内置 resources 包
     * 
     * @property resources
     * @readonly
     * @type {Bundle}
     */
    get resources () {
        return bundles.get(BuiltinBundleName.RESOURCES);
    },

    /**
     * !#en 
     * The builtin 'internal' bundle
     * 
     * !#zh
     * 内置 internal 包
     * 
     * @property internal
     * @readonly
     * @type {Bundle}
     */
    get internal () {
        return bundles.get(BuiltinBundleName.INTERNAL);
    },

    /**
     * !#en
     * Initialize assetManager with options
     * 
     * !#zh
     * 初始化资源管理器
     * 
     * @method init
     * @param {Object} options 
     * 
     * @typescript
     * init(options: Record<string, any>): void
     */
    init (options) {
        options = options || Object.create(null);
        this._files.clear();
        this._parsed.clear();
        this._releaseManager.init();
        this.assets.clear();
        this.bundles.clear();
        this.packManager.init();
        this.downloader.init(options.bundleVers, options.server);
        this.parser.init();
        this.dependUtil.init();
        this.generalImportBase = options.importBase;
        this.generalNativeBase = options.nativeBase;
    },

    /**
     * !#en 
     * Get the bundle which has been loaded
     * 
     * !#zh
     * 获取已加载的分包
     * 
     * @method getBundle
     * @param {String} name - The name of bundle 
     * @return {Bundle} - The loaded bundle
     * 
     * @example
     * // ${project}/assets/test1
     * cc.assetManager.getBundle('test1');
     * 
     * cc.assetManager.getBundle('resources');
     * 
     * @typescript
     * getBundle (name: string): cc.AssetManager.Bundle
     */
    getBundle (name) {
        return bundles.get(name);
    },

    /**
     * !#en 
     * Remove this bundle. NOTE: The asset whthin this bundle will not be released automatically, you can call {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} manually before remove it if you need
     * 
     * !#zh 
     * 移除此包, 注意：这个包内的资源不会自动释放, 如果需要的话你可以在摧毁之前手动调用 {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} 进行释放
     *
     * @method removeBundle
     * @param {Bundle} bundle - The bundle to be removed 
     * 
     * @typescript
     * removeBundle(bundle: cc.AssetManager.Bundle): void
     */
    removeBundle (bundle) {
        bundle._destroy();
        bundles.remove(bundle.name);
    },

    /**
     * !#en
     * General interface used to load assets with a progression callback and a complete callback. You can achieve almost all effect you want with combination of `requests` and `options`.
     * It is highly recommended that you use more simple API, such as `load`, `loadDir` etc. Every custom parameter in `options` will be distribute to each of `requests`. 
     * if request already has same one, the parameter in request will be given priority. Besides, if request has dependencies, `options` will distribute to dependencies too.
     * Every custom parameter in `requests` will be tranfered to handler of `downloader` and `parser` as `options`. 
     * You can register you own handler downloader or parser to collect these custom parameters for some effect.
     * 
     * Reserved Keyword: `uuid`, `url`, `path`, `dir`, `scene`, `type`, `priority`, `preset`, `audioLoadMode`, `ext`, `bundle`, `onFileProgress`, `maxConcurrency`, `maxRequestsPerFrame`
     * `maxRetryCount`, `version`, `responseType`, `withCredentials`, `mimeType`, `timeout`, `header`, `reload`, `cacheAsset`, `cacheEnabled`,
     * Please DO NOT use these words as custom options!
     * 
     * !#zh
     * 通用加载资源接口，可传入进度回调以及完成回调，通过组合 `request` 和 `options` 参数，几乎可以实现和扩展所有想要的加载效果。非常建议你使用更简单的API，例如 `load`、`loadDir` 等。
     * `options` 中的自定义参数将会分发到 `requests` 的每一项中，如果request中已存在同名的参数则以 `requests` 中为准，同时如果有其他
     * 依赖资源，则 `options` 中的参数会继续向依赖项中分发。request中的自定义参数都会以 `options` 形式传入加载流程中的 `downloader`, `parser` 的方法中, 你可以
     * 扩展 `downloader`, `parser` 收集参数完成想实现的效果。
     * 
     * 保留关键字: `uuid`, `url`, `path`, `dir`, `scene`, `type`, `priority`, `preset`, `audioLoadMode`, `ext`, `bundle`, `onFileProgress`, `maxConcurrency`, `maxRequestsPerFrame`
     * `maxRetryCount`, `version`, `responseType`, `withCredentials`, `mimeType`, `timeout`, `header`, `reload`, `cacheAsset`, `cacheEnabled`,
     * 请不要使用这些字段为自定义参数!
     * 
     * @method loadAny
     * @param {string|string[]|Object|Object[]} requests - The request you want to load
     * @param {Object} [options] - Optional parameters
     * @param {Function} [onProgress] - Callback invoked when progression change
     * @param {Number} onProgress.finished - The number of the items that are already completed
     * @param {Number} onProgress.total - The total number of the items
     * @param {RequestItem} onProgress.item - The current request item
     * @param {Function} [onComplete] - Callback invoked when finish loading
     * @param {Error} onComplete.err - The error occured in loading process.
     * @param {Object} onComplete.data - The loaded content
     * 
     * @example
     * cc.assetManager.loadAny({url: 'http://example.com/a.png'}, (err, img) => cc.log(img));
     * cc.assetManager.loadAny(['60sVXiTH1D/6Aft4MRt9VC'], (err, assets) => cc.log(assets));
     * cc.assetManager.loadAny([{ uuid: '0cbZa5Y71CTZAccaIFluuZ'}, {url: 'http://example.com/a.png'}], (err, assets) => cc.log(assets));
     * cc.assetManager.downloader.register('.asset', (url, options, onComplete) => {
     *      url += '?userName=' + options.userName + "&password=" + options.password;
     *      cc.assetManager.downloader.downloadFile(url, null, onComplete);
     * });
     * cc.assetManager.parser.register('.asset', (file, options, onComplete) => {
     *      var json = JSON.parse(file);
     *      var skin = json[options.skin];
     *      var model = json[options.model];
     *      onComplete(null, {skin, model});
     * });
     * cc.assetManager.loadAny({ url: 'http://example.com/my.asset', skin: 'xxx', model: 'xxx', userName: 'xxx', password: 'xxx' });
     * 
     * @typescript
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onComplete: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onComplete: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[]): void
     */
    loadAny (requests, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
        
        options.preset = options.preset || 'default';
        requests = Array.isArray(requests) ? requests.concat() : requests;
        let task = new Task({input: requests, onProgress, onComplete: asyncify(onComplete), options});
        pipeline.async(task);
    },

    /**
     * !#en
     * General interface used to preload assets with a progression callback and a complete callback.It is highly recommended that you use more simple API, such as `preloadRes`, `preloadResDir` etc.
     * Everything about preload is just likes `cc.assetManager.loadAny`, the difference is `cc.assetManager.preloadAny` will only download asset but not parse asset. You need to invoke `cc.assetManager.loadAny(preloadTask)` 
     * to finish loading asset
     * 
     * !#zh
     * 通用预加载资源接口，可传入进度回调以及完成回调，非常建议你使用更简单的 API ，例如 `preloadRes`, `preloadResDir` 等。`preloadAny` 和 `loadAny` 几乎一样，区别在于 `preloadAny` 只会下载资源，不会去解析资源，你需要调用 `cc.assetManager.loadAny(preloadTask)`
     * 来完成资源加载。
     * 
     * @method preloadAny
     * @param {string|string[]|Object|Object[]} requests - The request you want to preload
     * @param {Object} [options] - Optional parameters
     * @param {Function} [onProgress] - Callback invoked when progression change
     * @param {Number} onProgress.finished - The number of the items that are already completed
     * @param {Number} onProgress.total - The total number of the items
     * @param {RequestItem} onProgress.item - The current request item
     * @param {Function} [onComplete] - Callback invoked when finish preloading
     * @param {Error} onComplete.err - The error occured in preloading process.
     * @param {RequestItem[]} onComplete.items - The preloaded content
     * 
     * @example
     * cc.assetManager.preloadAny('0cbZa5Y71CTZAccaIFluuZ', (err) => cc.assetManager.loadAny('0cbZa5Y71CTZAccaIFluuZ'));
     * 
     * @typescript
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onProgress: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onComplete: (err: Error, items: cc.AssetManager.RequestItem[]) => void): void
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>): void
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[]): void
     */
    preloadAny (requests, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
    
        options.preset = options.preset || 'preload';
        requests = Array.isArray(requests) ? requests.concat() : requests;
        var task = new Task({input: requests, onProgress, onComplete: asyncify(onComplete), options});
        fetchPipeline.async(task);
    },

    /**
     * !#en
     * Load native file of asset, if you check the option 'Async Load Assets', you may need to load native file with this before you use the asset
     * 
     * !#zh
     * 加载资源的原生文件，如果你勾选了'延迟加载资源'选项，你可能需要在使用资源之前调用此方法来加载原生文件
     * 
     * @method postLoadNative
     * @param {Asset} asset - The asset
     * @param {Object} [options] - Some optional parameters
     * @param {Function} [onComplete] - Callback invoked when finish loading
     * @param {Error} onComplete.err - The error occured in loading process.
     * 
     * @example
     * cc.assetManager.postLoadNative(texture, (err) => console.log(err));
     * 
     * @typescript
     * postLoadNative(asset: cc.Asset, options: Record<string, any>, onComplete: (err: Error) => void): void
     * postLoadNative(asset: cc.Asset, onComplete: (err: Error) => void): void
     * postLoadNative(asset: cc.Asset, options: Record<string, any>): void
     * postLoadNative(asset: cc.Asset): void
     */
    postLoadNative (asset, options, onComplete) {
        if (!(asset instanceof cc.Asset)) throw new Error('input is not asset');
        var { options, onComplete } = parseParameters(options, undefined, onComplete);

        if (!asset._native || asset._nativeAsset) {
            return asyncify(onComplete)(null);
        }

        var depend = dependUtil.getNativeDep(asset._uuid);
        if (depend) {
            if (!bundles.has(depend.bundle)) {
                var bundle = bundles.find(function (bundle) {
                    return bundle.getAssetInfo(asset._uuid);
                });
                if (bundle) {
                    depend.bundle = bundle.name;
                }
            }
            
            this.loadAny(depend, options, function (err, native) {
                if (!err) {
                    if (asset.isValid && !asset._nativeAsset) {
                        asset._nativeAsset = native
                    }
                }
                else {
                    cc.error(err.message, err.stack);
                }
                onComplete && onComplete(err);
            });
        }
    },

    /**
     * !#en
     * Load remote asset with url, such as audio, image, text and so on.
     * 
     * !#zh
     * 使用 url 加载远程资源，例如音频，图片，文本等等。
     * 
     * @method loadRemote
     * @param {string} url - The url of asset
     * @param {Object} [options] - Some optional parameters
     * @param {cc.AudioClip.LoadMode} [options.audioLoadMode] - Indicate which mode audio you want to load
     * @param {string} [options.ext] - If the url does not have a extension name, you can specify one manually.
     * @param {Function} [onComplete] - Callback invoked when finish loading
     * @param {Error} onComplete.err - The error occured in loading process.
     * @param {Asset} onComplete.asset - The loaded texture
     * 
     * @example
     * cc.assetManager.loadRemote('http://www.cloud.com/test1.jpg', (err, texture) => console.log(err));
     * cc.assetManager.loadRemote('http://www.cloud.com/test2.mp3', (err, audioClip) => console.log(err));
     * cc.assetManager.loadRemote('http://www.cloud.com/test3', { ext: '.png' }, (err, texture) => console.log(err));
     * 
     * @typescript
     * loadRemote<T extends cc.Asset>(url: string, options: Record<string, any>, onComplete: (err: Error, asset: T) => void): void
     * loadRemote<T extends cc.Asset>(url: string, onComplete: (err: Error, asset: T) => void): void
     * loadRemote<T extends cc.Asset>(url: string, options: Record<string, any>): void
     * loadRemote<T extends cc.Asset>(url: string): void
     */
    loadRemote (url, options, onComplete) {
        var { options, onComplete } = parseParameters(options, undefined, onComplete);

        if (this.assets.has(url)) {
            return asyncify(onComplete)(null, this.assets.get(url));
        }

        options.__isNative__ = true;
        options.preset = options.preset || 'remote';
        this.loadAny({url}, options, null, function (err, data) {
            if (err) {
                cc.error(err.message, err.stack);
                onComplete && onComplete(err, null);
            }
            else {
                factory.create(url, data, options.ext || cc.path.extname(url), options, function (err, out) {
                    onComplete && onComplete(err, out);
                });
            }
        });
    },

    /**
     * !#en
     * Load script 
     * 
     * !#zh
     * 加载脚本
     * 
     * @method loadScript
     * @param {string|string[]} url - Url of the script
     * @param {Object} [options] - Some optional paramters
     * @param {boolean} [options.async] - Indicate whether or not loading process should be async
     * @param {Function} [onComplete] - Callback when script loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * 
     * @example
     * loadScript('http://localhost:8080/index.js', null, (err) => console.log(err));
     * 
     * @typescript
     * loadScript(url: string|string[], options: Record<string, any>, onComplete: (err: Error) => void): void
     * loadScript(url: string|string[], onComplete: (err: Error) => void): void
     * loadScript(url: string|string[], options: Record<string, any>): void
     * loadScript(url: string|string[]): void
     */
    loadScript (url, options, onComplete) {
        var { options, onComplete } = parseParameters(options, undefined, onComplete);
        options.__requestType__ = RequestType.URL;
        options.preset = options.preset || 'script';
        this.loadAny(url, options, onComplete);
    },

    /**
     * !#en
     * load bundle
     * 
     * !#zh
     * 加载资源包
     * 
     * @method loadBundle
     * @param {string} nameOrUrl - The name or root path of bundle
     * @param {Object} [options] - Some optional paramter, same like downloader.downloadFile
     * @param {string} [options.version] - The version of this bundle, you can check config.json in this bundle
     * @param {Function} [onComplete] - Callback when bundle loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Bundle} onComplete.bundle - The loaded bundle
     * 
     * @example
     * loadBundle('http://localhost:8080/test', null, (err, bundle) => console.log(err));
     * 
     * @typescript
     * loadBundle(nameOrUrl: string, options: Record<string, any>, onComplete: (err: Error, bundle: cc.AssetManager.Bundle) => void): void
     * loadBundle(nameOrUrl: string, onComplete: (err: Error, bundle: cc.AssetManager.Bundle) => void): void
     * loadBundle(nameOrUrl: string, options: Record<string, any>): void
     * loadBundle(nameOrUrl: string): void
     */
    loadBundle (nameOrUrl, options, onComplete) {
        var { options, onComplete } = parseParameters(options, undefined, onComplete);

        let bundleName = cc.path.basename(nameOrUrl);

        if (this.bundles.has(bundleName)) {
            return asyncify(onComplete)(null, this.getBundle(bundleName));
        }

        options.preset = options.preset || 'bundle';
        options.ext = 'bundle';
        this.loadRemote(nameOrUrl, options, onComplete);
    },

    /**
     * !#en
     * Release asset and it's dependencies.
     * This method will not only remove the cache of the asset in assetManager, but also clean up its content.
     * For example, if you release a texture, the texture asset and its gl texture data will be freed up.
     * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.
     * 
     * !#zh
     * 释放资源以及其依赖资源, 这个方法不仅会从 assetManager 中删除资源的缓存引用，还会清理它的资源内容。
     * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
     * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
     *
     * @method releaseAsset
     * @param {Asset} asset - The asset to be released
     * 
     * @example
     * // release a texture which is no longer need
     * cc.assetManager.releaseAsset(texture);
     *
     * @typescript
     * releaseAsset(asset: cc.Asset): void
     */
    releaseAsset (asset) {
        releaseManager.tryRelease(asset, true);
    },

    /**
     * !#en 
     * Release all unused assets. Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放所有没有用到的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     *
     * @method releaseUnusedAssets
     * @private
     * 
     * @typescript
     * releaseUnusedAssets(): void
     */
    releaseUnusedAssets () {
        assets.forEach(function (asset) {
            releaseManager.tryRelease(asset);
        });
    },

    /**
     * !#en 
     * Release all assets. Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放所有资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     *
     * @method releaseAll
     * 
     * @typescript
     * releaseAll(): void
     */
    releaseAll () {
        assets.forEach(function (asset) {
            releaseManager.tryRelease(asset, true);
        });
        if (CC_EDITOR) {
            dependUtil._depends.clear();
        }
    },

    _transform (input, options) {
        var subTask = Task.create({input, options});
        var urls = [];
        try {
            var result = transformPipeline.sync(subTask);
            for (var i = 0, l = result.length; i < l; i++) {
                var item = result[i];
                var url = item.url;
                item.recycle();
                urls.push(url);
            }
        }
        catch (e) {
            for (var i = 0, l = subTask.output.length; i < l; i++) {
                subTask.output[i].recycle();
            }
            cc.error(e.message, e.stack);
        }
        subTask.recycle();
        return urls.length > 1 ? urls : urls[0];
    }
};

cc.AssetManager = AssetManager;
/**
 * @module cc
 */
/**
 * @property assetManager
 * @type {AssetManager}
 */
cc.assetManager = new AssetManager();

Object.defineProperty(cc, 'resources', {
    /**
     * !#en
     * cc.resources is a bundle and controls all asset under assets/resources
     * 
     * !#zh
     * cc.resources 是一个 bundle，用于管理所有在 assets/resources 下的资源
     * 
     * @property resources
     * @readonly
     * @type {AssetManager.Bundle}
     */
    get () {
        return bundles.get(BuiltinBundleName.RESOURCES);
    }
});


module.exports = cc.assetManager;

/**
 * !#en
 * This module controls asset's behaviors and information, include loading, releasing etc. 
 * All member can be accessed with `cc.assetManager`. All class or enum can be accessed with `cc.AssetManager`
 * 
 * !#zh
 * 此模块管理资源的行为和信息，包括加载，释放等，所有成员能够通过 `cc.assetManager` 调用. 所有类型或枚举能通过 `cc.AssetManager` 访问
 * 
 * @module cc.AssetManager
 */