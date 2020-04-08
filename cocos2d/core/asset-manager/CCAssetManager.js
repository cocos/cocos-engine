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
const finalizer = require('./finalizer');
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
const { assets, files, parsed, pipeline, transformPipeline, fetchPipeline, LoadStrategy, RequestType, bundles, BuiltinBundleName } = require('./shared');


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
     * The collection of bundle which is already loaded, you can remove cache with {{#crossLink "Bundle/destroy:method"}}{{/crossLink}}
     * 
     * !#zh
     * 已加载 bundle 的集合， 你能通过 {{#crossLink "Bundle/destroy:method"}}{{/crossLink}} 来移除缓存
     * 
     * @property bundles
     * @type {Cache}
     */
    this.bundles = bundles;

    /**
     * !#en 
     * The collection of asset which is already loaded, you can remove cache with {{#crossLink "AssetManager/release:method"}}{{/crossLink}}
     * 
     * !#zh
     * 已加载资源的集合， 你能通过 {{#crossLink "AssetManager/release:method"}}{{/crossLink}} 来移除缓存
     * 
     * @property assets
     * @type {Cache}
     */
    this.assets = assets;
    
    this._files = files;
    
    this._parsed = parsed;

    this.generalImportBase = '';

    this.generalNativeBase = '';

    this.bundleVers = null;

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

    /**
     * !#en 
     * Manage the releasing of all asset
     * 
     * !#zh
     * 管理所有资源的释放
     * 
     * @property finalizer
     * @type {Finalizer}
     */
    this.finalizer = finalizer;

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

}

AssetManager.Pipeline = Pipeline;
AssetManager.Task = Task;
AssetManager.Cache = Cache;
AssetManager.RequestItem = RequestItem;
AssetManager.LoadStrategy = LoadStrategy;
AssetManager.RequestType = RequestType;
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
        this.assets.clear();
        this.bundles.clear();
        this.packManager.init();
        this.downloader.init();
        this.parser.init();
        this.finalizer.init();
        this.dependUtil.init();
        this.bundleVers = options.bundleVers || Object.create(null);
        this.generalImportBase = options.importBase;
        this.generalNativeBase = options.nativeBase;
    },

    /**
     * !#en
     * General interface used to load assets with a progression callback and a complete callback. You can achieve almost all effect you want with combination of `requests` and `options`.
     * It is highly recommended that you use more simple API, such as `loadRes`, `loadResDir` etc. Every custom parameter in `options` will be distribute to each of `requests`. 
     * if request already has same one, the parameter in request will be given priority. Besides, if request has dependencies, `options` will distribute to dependencies too.
     * Every custom parameter in `requests` will be tranfered to handler of `downloader` and `parser` as `options`. 
     * You can register you own handler downloader or parser to collect these custom parameters for some effect.
     * 
     * Reserved Keyword: [`uuid`, `url`, `path`, `dir`, `scene`, `requestType`, `type`, `isNative`, `priority`, `loadStrategy`, `audioLoadMode`, `name`, `ext`, `bundle`, `exclude`, `onProgress`,
     * `maxRetryCount`, `ver`, `isCrossOrigin`, `responseType`, `withCredentials`, `mimeType`, `timeout`, `header`, `reload` , `asyncLoadAssets`, `cacheAsset`, `saveFile`],
     * Please DO NOT use these words as custom options!
     * 
     * !#zh
     * 通用加载资源接口，可传入进度回调以及完成回调，通过组合 `request` 和 `options` 参数，几乎可以实现和扩展所有想要的加载效果。非常建议你使用更简单的API，例如 `loadRes`、`loadResDir` 等。
     * `options` 中的自定义参数将会分发到 `requests` 的每一项中，如果request中已存在同名的参数则以 `requests` 中为准，同时如果有其他
     * 依赖资源，则 `options` 中的参数会继续向依赖项中分发。request中的自定义参数都会以 `options` 形式传入加载流程中的 `downloader`, `parser` 的方法中, 你可以
     * 扩展 `downloader`, `parser` 收集参数完成想实现的效果。
     * 
     * 保留关键字: [`uuid`, `url`, `path`, `dir`, `scene`, `requestType`, `type`, `isNative`, `priority`, `loadStrategy`, `audioLoadMode`, `name`, `ext`, `bundle`, `exclude`, `onProgress`,
     * `maxRetryCount`, `ver`, `isCrossOrigin`, `responseType`, `withCredentials`, `mimeType`, `timeout`, `header`, `reload` , `asyncLoadAssets`, `cacheAsset`, `saveFile`],
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
     * cc.assetManager.loadAny({url: 'http://example.com/a.png', isCrossOrigin: true}, (err, img) => cc.log(img));
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
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options?: Record<string, any>, onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options?: Record<string, any>, onComplete?: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (err: Error, data: any) => void): void
     * loadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onComplete?: (err: Error, data: any) => void): void
     */
    loadAny (requests, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
        
        let task = new Task({input: requests, onProgress, onComplete: asyncify(onComplete), options});
        pipeline.async(task);
        return task;
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
     * @returns {Task} preloading task
     * 
     * @example
     * cc.assetManager.preloadAny('0cbZa5Y71CTZAccaIFluuZ', (err) => cc.assetManager.loadAny('0cbZa5Y71CTZAccaIFluuZ'));
     * 
     * @typescript
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options?: Record<string, any>, onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (err: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], options?: Record<string, any>, onComplete?: (err: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (err: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadAny(requests: string | string[] | Record<string, any> | Record<string, any>[], onComplete?: (err: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     */
    preloadAny (requests, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
    
        options.loadStrategy = LoadStrategy.PRELOAD;
        options.priority = -1;
        var task = new Task({input: requests, onProgress, onComplete: asyncify(onComplete), options});
        fetchPipeline.async(task);
        return task;
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
     * @param {Function} [onComplete] - Callback invoked when finish loading
     * @param {Error} onComplete.err - The error occured in loading process.
     * 
     * @example
     * cc.assetManager.postLoadNative(texture, (err) => console.log(err));
     * 
     * @typescript
     * postLoadNative(asset: cc.Asset, onComplete?: (err: Error) => void): void
     */
    postLoadNative (asset, onComplete) {
        if (!(asset instanceof cc.Asset)) throw new Error('input is not asset');

        if (asset.loaded || !asset._native || asset._nativeAsset) {
            return asyncify(onComplete)(null);
        }

        var depend = dependUtil.getNativeDep(asset._uuid);
        if (depend) {
            var bundle = null;
            if (bundles.has(depend.bundle)) {
                bundle = bundles.get(depend.bundle);
            }
            else {
                bundle = bundles.find(function (bundle) {
                    return bundle.getAssetInfo(asset._uuid);
                });
            }
            
            if (bundle) {
                depend.bundle = bundle.name;
            }

            this.loadAny(depend, function (err, native) {
                if (!err) {
                    asset._nativeAsset = native;
                }
                else {
                    cc.error(err);
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
     * @param {boolean} [options.isCrossOrigin] - Indicate whether or not image is CORS
     * @param {cc.AudioClip.LoadMode} [options.audioLoadMode] - Indicate which mode audio you want to load
     * @param {Function} [onComplete] - Callback invoked when finish loading
     * @param {Error} onComplete.err - The error occured in loading process.
     * @param {Asset} onComplete.asset - The loaded texture
     * 
     * @example
     * cc.assetManager.loadRemote('http://www.cloud.com/test1.jpg', (err, texture) => console.log(err));
     * cc.assetManager.loadRemote('http://www.cloud.com/test2.mp3', (err, audioClip) => console.log(err));
     * 
     * @typescript
     * loadRemote(url: string, options?: Record<string, any>, onComplete?: (err: Error, asset: cc.Asset) => void): void
     * loadRemote(url: string, onComplete?: (err: Error, asset: cc.Asset) => void): void
     */
    loadRemote (url, options, onComplete) {
        var { options, onComplete } = parseParameters(options, undefined, onComplete);

        options.isNative = true;
        this.loadAny({url}, options, null, function (err, data) {
            if (err) {
                onComplete && onComplete(err, null);
            }
            else {
                factory.create(url, data, options.ext || cc.path.extname(url), options, onComplete);
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
     * @param {boolean} [options.isAsync] - Indicate whether or not loading process should be async
     * @param {Function} [onComplete] - Callback when script loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * 
     * @example
     * loadScript('http://localhost:8080/index.js', null, (err) => console.log(err));
     * 
     * @typescript
     * loadScript(url: string|string[], options?: Record<string, any>, onComplete?: (err: Error) => void): void;
     * loadScript(url: string|string[], onComplete?: (err: Error) => void): void;
     */
    loadScript (url, options, onComplete) {
        var { options, onComplete } = parseParameters(options, undefined, onComplete);
        options.requestType = RequestType.URL;
        options.priority = options.priority || 2;
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
     * @param {string} root - The root path of bundle
     * @param {Object} [options] - Some optional paramter, same like downloader.downloadFile
     * @param {string} [options.ver] - The version of this bundle, you can check config.json in this bundle
     * @param {Function} [onComplete] - Callback when bundle loaded or failed
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Bundle} onComplete.bundle - The loaded bundle
     * 
     * @example
     * loadBundle('http://localhost:8080/test', null, (err, bundle) => console.log(err));
     * 
     * @typescript
     * loadBundle(root: string, options?: Record<string, any>, onComplete?: (err: Error, bundle: cc.AssetManager.Bundle) => void): void
     * loadBundle(root: string, onComplete?: (err: Error, bundle: cc.AssetManager.Bundle) => void): void
     */
    loadBundle (root, options, onComplete) {
        if (!root) return;
        var { options, onComplete } = parseParameters(options, undefined, onComplete);
        
        if (root.endsWith('/')) root = root.substr(0, root.length - 1);
        let bundleName = cc.path.basename(root);

        if (this.bundles.has(bundleName)) {
            return asyncify(onComplete)(null, this.bundles.get(bundleName));
        }

        options.priority = options.priority || 2;
        var ver = options.ver || this.bundleVers[bundleName];
        var config = ver ?  `${root}/config.${ver}.json`: `${root}/config.json`;
        var bundle = null;
        var count = 0;
        downloader.download(root, config, '.json', options, function (err, response) {
            if (err) {
                cc.error(err);
                onComplete && onComplete(err);
                return;
            }
            bundle = new Bundle();
            response.base = root + '/';
            bundle.init(response);
            count++;
            if (count === 2) {
                onComplete && onComplete(null, bundle);
            }
        });

        var js = ver ?  `${root}/index.${ver}.js`: `${root}/index.js`;
        this.loadScript(js, options, function (err) {
            if (err) cc.warn(err);
            count++;
            if (count === 2) {
                onComplete && onComplete(null, bundle);
            }
        });
        
    },

    /**
     * !#en
     * Load resources from the "resources" folder inside the "assets" folder of your project.<br>
     * <br>
     * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
     * 
     * !#zh
     * 加载 `resources` 目录下的资源，注意：所有资源路径应该使用斜杠，反斜杠将停止工作
     *
     * @method loadRes
     * @param {String|String[]} paths - Paths of the target resource.The path is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {RequestItem} onProgress.item - The finished request item.
     * @param {Function} [onComplete] - Callback invoked when the resource loaded.
     * @param {Error} onComplete.error - The error info or null if loaded successfully.
     * @param {Asset|Asset[]} onComplete.resources - The loaded resources.
     *
     * @example
     * // load the prefab (project/assets/resources/misc/character/cocos) from resources folder
     * cc.assetManager.loadRes('misc/character/cocos', (err, prefab) => console.log(err));
     *
     * // load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
     * cc.assetManager.loadRes('imgs/cocos', cc.SpriteFrame, null, (err, spriteFrame) => console.log(err));
     * 
     * @typescript
     * loadRes(paths: string|string[], type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, resources: cc.Asset|cc.Asset[]) => void): void
     * loadRes(paths: string|string[], onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, resources: cc.Asset|cc.Asset[]) => void): void
     * loadRes(paths: string|string[], type?: typeof cc.Asset, onComplete?: (error: Error, resources: cc.Asset|cc.Asset[]) => void): void
     * loadRes(paths: string|string[], onComplete?: (error: Error, resources: cc.Asset|cc.Asset[]) => void): void
     */
    loadRes (paths, type, onProgress, onComplete) {
        this.resources.load(paths, type, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload resources from the "resources" folder inside the "assets" folder of your project.<br>
     * Everything are like loadRes
     * 
     * !#zh
     * 预加载 `resources` 目录下的资源，其他都和 `loadRes` 相同
     *
     * @method preloadRes
     * @param {String|String[]} paths - Paths of the target resource.The path is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {RequestItem} onProgress.item - The finished request item.
     * @param {Function} [onComplete] - Callback invoked when the resource loaded.
     * @param {Error} onComplete.error - The error info or null if loaded successfully.
     * @param {RequestItem[]} onComplete.items - The preloaded items.
     * @return {Task} preloading task
     *
     * @example
     * // preload the prefab (project/assets/resources/misc/character/cocos) from resources folder
     * cc.assetManager.preloadRes('misc/character/cocos', (err) => console.log(err));
     *
     * // preload the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
     * cc.assetManager.preloadRes('imgs/cocos', cc.SpriteFrame, null, (err) => console.log(err));
     * 
     * @typescript
     * preloadRes(paths: string|string[], type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadRes(paths: string|string[], type?: typeof cc.Asset, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadRes(paths: string|string[], onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadRes(paths: string|string[], onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     */
    preloadRes (path, type, onProgress, onComplete) {
        return this.resources.preload(path, type, onProgress, onComplete);
    },

    /**
     * !#en
     * Load all assets in a folder inside the "assets/resources" folder of your project.<br>
     * <br>
     * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
     * 
     * !#zh
     * 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作
     *
     * @method loadResDir
     * @param {string} dir - path of the target folder.
     *                       The path is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Asset} onComplete.assets - An array of all loaded assets.
     * @returns {Task} loading task
     *                                             
     *
     * @example
     *
     * // load the texture (resources/imgs/cocos.png) and the corresponding sprite frame
     * cc.assetManager.loadResDir('imgs/cocos', function (err, assets) {
     *     if (err) {
     *         cc.error(err);
     *         return;
     *     }
     *     var texture = assets[0];
     *     var spriteFrame = assets[1];
     * });
     *
     * // load all textures in "resources/imgs/"
     * cc.assetManager.loadResDir('imgs', cc.Texture2D, null, function (err, textures) {
     *     var texture1 = textures[0];
     *     var texture2 = textures[1];
     * });
     *
     * @typescript
     * loadResDir(dir: string, type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): cc.AssetManager.Task
     * loadResDir(dir: string, type?: typeof cc.Asset, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): cc.AssetManager.Task
     * loadResDir(dir: string, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): cc.AssetManager.Task
     * loadResDir(dir: string, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): cc.AssetManager.Task
     */
    loadResDir (dir, type, onProgress, onComplete) {
        return this.resources.loadDir(dir, type, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload all assets in a folder inside the "assets/resources" folder of your project.<br>
     * <br>
     * Everything are like `loadResDir`
     * 
     * !#zh
     * 预加载目标文件夹中的所有资源, 其他和 `loadResDir` 一样
     *
     * @method preloadResDir
     * @param {string} dir - path of the target folder.
     *                       The path is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be preloaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are preloaded successfully, error will be null.
     * @param {RequestItem[]} onComplete.items - An array of all preloaded items.
     * 
     * @returns {Task} preloading task
     *                                             
     *
     * @example
     *
     * // preload the texture (resources/imgs/cocos.png) and the corresponding sprite frame
     * cc.assetManager.preloadResDir('imgs/cocos', function (err) {
     *     if (err) {
     *         cc.error(err);
     *         return;
     *     }
     *     cc.assetManager.loadResDir('imgs/cocos');
     * });
     *
     * @typescript
     * preloadResDir(dir: string, type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadResDir(dir: string, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadResDir(dir: string, type?: typeof cc.Asset, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     * preloadResDir(dir: string, onComplete?: (error: Error, items: cc.AssetManager.RequestItem[]) => void): cc.AssetManager.Task
     */
    preloadResDir (dir, type, onProgress, onComplete) {
        return this.resources.preloadDir(dir, type, onProgress, onComplete);
    },

    /**
     * !#en 
     * Loads the scene by its name.
     * 
     * !#zh 
     * 通过场景名称进行加载场景。
     *
     * @method loadScene
     * @param {String} sceneName - The name of the scene to load.
     * @param {Object} [options] - Some optional parameters
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - callback, will be called after scene launched.
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Scene} onComplete.scene - The scene
     * @return {Task} loading task
     * 
     * @example
     * cc.assetManager.loadScene('first', (err, scene) => cc.director.runScene(scene));
     * 
     * @typescript
     * loadScene(sceneName: string, options?: Record<string, any>, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, scene: cc.Scene) => void): cc.AssetManager.Task
     * loadScene(sceneName: string, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error, scene: cc.Scene) => void): cc.AssetManager.Task
     * loadScene(sceneName: string, options?: Record<string, any>, onComplete?: (error: Error, scene: cc.Scene) => void): cc.AssetManager.Task
     * loadScene(sceneName: string, onComplete?: (error: Error, scene: cc.Scene) => void): cc.AssetManager.Task
     */
    loadScene (sceneName, options, onProgress, onComplete) {
        var bundle = this.bundles.find(function (bundle) {
            return bundle.getSceneInfo(sceneName);
        });
        if (bundle) {
            return bundle.loadScene(sceneName, options, onProgress, onComplete);
        }
        else {
            cc.errorID(1209, sceneName);
            return null;
        }
    },

    /**
     * !#en
     * Preloads the scene to reduces loading time. You can call this method at any time you want.
     * After calling this method, you still need to finish loading by `cc.assetManager.loadScene` or `cc.director.loadScene`.
     * You don't have to wait for preloading callback before calling `cc.assetManager.loadScene`
     * 
     * !#zh 
     * 预加载场景，你可以在任何时候调用这个方法。
     * 调用完后，你仍然需要通过 `cc.assetManager.loadScene` 或 `cc.director.loadScene` 来完成加载，你不必等待预加载完成再调用 `cc.assetManager.loadScene`
     *
     * @method preloadScene
     * @param {String} sceneName - The name of the scene to preload.
     * @param {Object} [options] - Some optional parameters
     * @param {Function} [onProgress] - callback, will be called when the load progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed
     * @param {Number} onProgress.total - The total number of the items
     * @param {RequestItem} onProgress.item The latest request item
     * @param {Function} [onComplete] - callback, will be called after scene loaded.
     * @param {Error} onComplete.error - null or the error object.
     * @return {Task} The preloading task
     * 
     * @example
     * cc.assetManager.preloadScene('first', (err) => cc.assetManager.loadScene('first'));
     * 
     * @typescript
     * preloadScene(sceneName: string, options?: Record<string, any>, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error) => void): cc.AssetManager.Task
     * preloadScene(sceneName: string, onProgress?: (finish: number, total: number, item: cc.AssetManager.RequestItem) => void, onComplete?: (error: Error) => void): cc.AssetManager.Task
     * preloadScene(sceneName: string, options?: Record<string, any>, onComplete?: (error: Error) => void): cc.AssetManager.Task
     * preloadScene(sceneName: string, onComplete?: (error: Error) => void): cc.AssetManager.Task
     */
    preloadScene (sceneName, options, onProgress, onComplete) {
        var bundle = this.bundles.find(function (bundle) {
            return bundle.getSceneInfo(sceneName);
        });
        if (bundle) {
            return bundle.preloadScene(sceneName, options, onProgress, onComplete);
        }
        else {
            cc.errorID(1209, sceneName);
            return null;
        }
    },

    /**
     * !#en
     * Get resource data by path and type. <br>
     * After you load resources with {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}} or {{#crossLink "AssetManager/loadResDir:method"}}{{/crossLink}},
     * you can acquire them by passing the path to this API.
     * 
     * !#zh
     * 通过路径与类型获取资源。在你使用 {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}} 或者 {{#crossLink "AssetManager/loadResDir:method"}}{{/crossLink}} 之后，
     * 你能通过传路径通过这个 API 获取到这些资源。
     * 
     * @method getRes
     * @param {String} path - The path of resource
     * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
     * @returns {Asset}
     * 
     * @typescript
     * getRes(path: string, type?: typeof cc.Asset): cc.Asset
     */
    getRes (path, type) {
        return this.resources.getAsset(path, type);
    },

    /**
     * !#en
     * Release the content of an asset.
     * This method will not only remove the cache of the asset in assetManager, but also clean up its content.
     * For example, if you release a texture, the texture asset and its gl texture data will be freed up.
     * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.
     * When `force` is `false` or `undefined`, engine will try to compute the number of this asset's reference, if the count is zero, it will be released. You can also
     * set `force` to true to release this asset forcely
     * 
     * !#zh
     * 释放资源, 这个方法不仅会从 assetManager 中删除资源的缓存引用，还会清理它的资源内容。
     * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
     * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
     * 当 `force` 为 `false` 或者 `undefined` 时，引擎会尝试计算资源被引用的数量，如果数量为零，则资源会被释放。你也能将 `force` 置为true来强制释放这个资源
     *
     * @method release
     * @param {Asset} asset - The asset to be released
     * @param {boolean} [force] - Indicates whether or not release this asset forcely
     * 
     * @example
     * // release a texture which is no longer need
     * cc.assetManager.release(texture);
     *
     * @typescript
     * release(asset: cc.Asset, force?: boolean): void
     */
    release (asset, force) {
        finalizer.release(asset, force);
    },

    /**
     * !#en 
     * Release the asset loaded by {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}} or {{#crossLink "AssetManager/loadResDir:method"}}{{/crossLink}}. 
     * Refer to {{#crossLink "AssetManager/release:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放通过 {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "AssetManager/release:method"}}{{/crossLink}}
     *
     * @method releaseRes
     * @param {String} path - The path of resource
     * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
     * @param {boolean} [force] - Indicates whether or not release this asset forcely
     * 
     * @example
     * // release a texture which is no longer need
     * cc.assetManager.releaseRes('misc/character/cocos');
     *
     * @typescript
     * releaseRes(path: string, type: typeof cc.Asset, force?: boolean): void
     * releaseRes(path: string): void
     */
    releaseRes (path, type, force) {
        this.resources.releaseAsset(path, type, force);
    },

    /**
     * !#en 
     * Release all assets. Refer to {{#crossLink "AssetManager/release:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放所有资源。详细信息请参考 {{#crossLink "AssetManager/release:method"}}{{/crossLink}}
     *
     * @method releaseAll
     * @param {boolean} [force] - Indicates whether or not release this asset forcely
     * 
     * @typescript
     * releaseAll(force?: boolean): void
     */
    releaseAll (force) {
        assets.forEach(function (asset) {
            finalizer.release(asset, force);
        });
    },

    /**
     * !#en
     * General interface used to transform url.
     * The parameter of transform is just likes `cc.assetManager.loadAny`, the difference is `cc.assetManager.transform` will only parse requset but not load any asset. 
     * 
     * !#zh
     * 通用转换 URL 接口，`transform` 的参数和 `loadAny` 几乎一样，区别在于 `cc.assetManager.transform` 只会解析请求，不会去加载任何资源
     * 
     * @method transform
     * @param {string|string[]|Object|Object[]} input - The request you want to transfrom
     * @param {Object} [options] - Optional parameters
     * @param {RequestType} [options.requestType] - Indicates that which type the requests is
     * @param {string} [options.bundle] - Indicates in which bundle
     * @returns {string|string[]} urls - Transformed urls
     * 
     * @example
     * var urls = cc.assetManager.transform({ uuid: '0cbZa5Y71CTZAccaIFluuZ'});
     * 
     * @typescript
     * transform(input: string | string[] | Record<string, any> | Record<string, any>[], options?: Record<string, any>): string|string[]
     */
    transform (input, options) {
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
            cc.error(e);
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