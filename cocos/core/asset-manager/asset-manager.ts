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
import { BUILD, EDITOR, PREVIEW } from 'internal:constants';
import { Asset } from '../assets/asset';
import { legacyCC } from '../global-exports';
import { error } from '../platform/debug';
import { sys } from '../platform/sys';
import { basename, extname } from '../utils/path';
import Bundle from './bundle';
import Cache from './cache';
import CacheManager from './cache-manager';
import dependUtil from './depend-util';
import downloader from './downloader';
import factory from './factory';
import fetch from './fetch';
import { garbageCollectionManager, GarbageCollectorContext } from '../data/garbage-collection';
import * as helper from './helper';
import load from './load';
import packManager from './pack-manager';
import parser from './parser';
import { Pipeline } from './pipeline';
import preprocess from './preprocess';
import RequestItem from './request-item';
import { fetch as fetchSingleAsset, initialize, loadDepends, parse as parseSingleAsset } from './single-asset-load-pipeline';
import {
    CompleteCallbackWithData,
    CompleteCallbackNoData,
    ProgressCallback,
    IBundleOptions,
    INativeAssetOptions,
    IOptions,
    IRemoteOptions,
    presets,
    Request,
    references,
    IJsonAssetOptions,
    assets, BuiltinBundleName, bundles, fetchPipeline, files, parsed, pipeline, transformPipeline, singleAssetLoadPipeline } from './shared';

import Task from './task';
import { combine, parse } from './url-transformer';
import { asyncify, parseParameters } from './utilities';
import { ccclass } from '../data/decorators';

/**
 * @zh
 * AssetManager 配置。
 * @en
 * AssetManager configuration.
 */
export interface IAssetManagerOptions {
    /* Only valid on Editor */
    importBase?: string;
    /* Only valid on Editor */
    nativeBase?: string;
    /* Only valid on native */
    jsbDownloaderMaxTasks?: number;
    /* Only valid on native */
    jsbDownloaderTimeout?: number;

    /**
     * @zh
     * 所有 bundle 的版本信息
     * @en
     * Version for all bundles
     */
    bundleVers?: Record<string, string>;

    /**
     * @zh
     * 远程服务器地址
     * @en
     * Remote server address
     */
    server?: string;

    /**
     * @zh
     * 配置为子包的 bundle
     * @en
     * All subpackages
     */
    subpackages?: string[];

    /**
     * @zh
     * 配置为远程包的 bundle
     * @en
     * All remote bundles
     */
    remoteBundles?: string[];

}

/**
 * @en
 * This module controls asset's behaviors and information, include loading, releasing etc. it is a singleton
 * All member can be accessed with `cc.assetManager`.
 *
 * @zh
 * 此模块管理资源的行为和信息，包括加载，释放等，这是一个单例，所有成员能够通过 `cc.assetManager` 调用
 *
 */
@ccclass('cc.AssetManager')
export class AssetManager {
    /**
     * @en
     * Normal loading pipeline
     *
     * @zh
     * 正常加载管线
     *
     */
    public pipeline = pipeline.append(preprocess).append(load);

    /**
     * @en
     * Fetching pipeline
     *
     * @zh
     * 下载管线
     *
     */
    public fetchPipeline = fetchPipeline.append(preprocess).append(fetch);

    /**
     * @en
     * Url transformer
     *
     * @zh
     * Url 转换器
     *
     */
    public transformPipeline = transformPipeline.append(parse).append(combine);

    public singleAssetLoadPipeline = singleAssetLoadPipeline.append(fetchSingleAsset).append(parseSingleAsset).append(loadDepends).append(initialize);

    /**
     * @en
     * The collection of bundle which is already loaded, you can remove cache with {{#crossLink "AssetManager/removeBundle:method"}}{{/crossLink}}
     *
     * @zh
     * 已加载 bundle 的集合， 你能通过 {{#crossLink "AssetManager/removeBundle:method"}}{{/crossLink}} 来移除缓存
     *
     */
    public bundles: Cache<Bundle> = bundles;

    /**
     * @en
     * The collection of asset which is already loaded, you can remove cache with {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     *
     * @zh
     * 已加载资源的集合， 你能通过 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} 来移除缓存
     */
    public assets: Cache<Asset> = assets;

    public generalImportBase = '';
    public generalNativeBase = '';

    /**
     * @en
     * Manage relationship between asset and its dependencies
     *
     * @zh
     * 管理资源依赖关系
     */
    public dependUtil = dependUtil;

    /**
     * @en
     * Whether or not load asset forcely, if it is true, asset will be loaded regardless of error
     *
     * @zh
     * 是否强制加载资源, 如果为 true ，加载资源将会忽略报错
     *
     */
    public force = EDITOR || PREVIEW;

    /**
     * @en
     * Whether to use image bitmap to load image first. If enabled, images loading will become faster but memory usage will increase.
     *
     * @zh
     * 是否优先使用 image bitmap 来加载图片，启用之后，图片加载速度会更快, 但内存占用会变高，
     *
     */
    public allowImageBitmap = !sys.isMobile;

    /**
     * @en
     * Some useful function
     *
     * @zh
     * 一些有用的方法
     *
     */
    public utils = helper;

    /**
     * @en
     * Manage all downloading task
     *
     * @zh
     * 管理所有下载任务
     *
     */
    public downloader = downloader;

    /**
     * @en
     * Manage all parsing task
     *
     * @zh
     * 管理所有解析任务
     *
     */
    public parser = parser;

    /**
     * @en
     * Manage all packed asset
     *
     * @zh
     * 管理所有合并后的资源
     *
     */
    public packManager = packManager;

    /**
     * @en
     * Whether or not cache the loaded asset
     *
     * @zh
     * 是否缓存已加载的资源
     *
     */
    public cacheAsset = true;

    /**
     * @en
     * Cache manager is a module which controls all caches downloaded from server in non-web platform.
     *
     * @zh
     * 缓存管理器是一个模块，在非 WEB 平台上，用于管理所有从服务器上下载下来的缓存
     *
     */
    public cacheManager: CacheManager | null = null;

    /**
     * @en
     * The preset of options
     *
     * @zh
     * 可选参数的预设集
     *
     */
    public presets = presets;

    public factory = factory;

    public preprocessPipe = preprocess;

    public fetchPipe = fetch;

    public loadPipe = load;

    public references = references;

    private _files = files;

    private _parsed = parsed;
    private _parsePipeline = BUILD ? null : new Pipeline('parse existing json', [this.loadPipe]);

    /**
     * @en
     * The builtin 'main' bundle
     *
     * @zh
     * 内置 main 包
     */
    public get main (): Bundle | null {
        return bundles.get(BuiltinBundleName.MAIN) || null;
    }

    /**
     * @en
     * The builtin 'resources' bundle
     *
     * @zh
     * 内置 resources 包
     *
     */
    public get resources (): Bundle | null {
        return bundles.get(BuiltinBundleName.RESOURCES) || null;
    }

    /**
     * @en
     * Initialize assetManager with options
     *
     * @zh
     * 初始化资源管理器
     *
     * @param options - the configuration
     *
     */
    public init (options: IAssetManagerOptions = {}) {
        this._files.clear();
        this._parsed.clear();
        this.assets.clear();
        this.bundles.clear();
        this.packManager.init();
        this.downloader.init(options.server, options.bundleVers, options.remoteBundles);
        this.parser.init();
        this.dependUtil.init();
        let importBase = options.importBase || '';
        if (importBase && importBase.endsWith('/')) {
            importBase = importBase.substr(0, importBase.length - 1);
        }
        let nativeBase = options.nativeBase || '';
        if (nativeBase && nativeBase.endsWith('/')) {
            nativeBase = nativeBase.substr(0, nativeBase.length - 1);
        }
        this.generalImportBase = importBase;
        this.generalNativeBase = nativeBase;
        garbageCollectionManager.addCCClassObjectToRoot(this);
    }

    /**
     * @en
     * Get the bundle which has been loaded
     *
     * @zh
     * 获取已加载的分包
     *
     * @param name - The name of bundle
     * @return - The loaded bundle
     *
     * @example
     * // ${project}/assets/test1
     * cc.assetManager.getBundle('test1');
     *
     * cc.assetManager.getBundle('resources');
     *
     */
    public getBundle (name: string): Bundle | null {
        return bundles.get(name) || null;
    }

    /**
     * @en
     * Remove this bundle. NOTE: The asset whthin this bundle will not be released automatically,
     * you can call {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} manually before remove it if you need
     *
     * @zh
     * 移除此包, 注意：这个包内的资源不会自动释放, 如果需要的话你可以在摧毁之前手动调用 {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} 进行释放
     *
     * @param bundle - The bundle to be removed
     *
     * @typescript
     * removeBundle(bundle: cc.AssetManager.Bundle): void
     */
    public removeBundle (bundle: Bundle) {
        bundle.destroy();
    }

    /**
     * @en
     * General interface used to load assets with a progression callback and a complete callback. You can achieve almost all
     * effect you want with combination of `requests` and `options`.It is highly recommended that you use more simple API,
     * such as `load`, `loadDir` etc. Every custom parameter in `options` will be distribute to each of `requests`. if request
     * already has same one, the parameter in request will be given priority. Besides, if request has dependencies, `options`
     * will distribute to dependencies too. Every custom parameter in `requests` will be tranfered to handler of `downloader`
     * and `parser` as `options`. You can register you own handler downloader or parser to collect these custom parameters for some effect.
     *
     * Reserved Keyword: `uuid`, `url`, `path`, `dir`, `scene`, `type`, `priority`, `preset`, `audioLoadMode`, `ext`,
     * `bundle`, `onFileProgress`, `maxConcurrency`, `maxRequestsPerFrame`, `maxRetryCount`, `version`, `xhrResponseType`,
     * `xhrWithCredentials`, `xhrMimeType`, `xhrTimeout`, `xhrHeader`, `reloadAsset`, `cacheAsset`, `cacheEnabled`,
     * Please DO NOT use these words as custom options!
     *
     * @zh
     * 通用加载资源接口，可传入进度回调以及完成回调，通过组合 `request` 和 `options` 参数，几乎可以实现和扩展所有想要的加载效果。非常建议
     * 你使用更简单的API，例如 `load`、`loadDir` 等。`options` 中的自定义参数将会分发到 `requests` 的每一项中，如果request中已存在同名的
     * 参数则以 `requests` 中为准，同时如果有其他依赖资源，则 `options` 中的参数会继续向依赖项中分发。request中的自定义参数都会以 `options`
     * 形式传入加载流程中的 `downloader`, `parser` 的方法中, 你可以扩展 `downloader`, `parser` 收集参数完成想实现的效果。
     *
     * 保留关键字: `uuid`, `url`, `path`, `dir`, `scene`, `type`, `priority`, `preset`, `audioLoadMode`, `ext`, `bundle`, `onFileProgress`,
     *  `maxConcurrency`, `maxRequestsPerFrame`, `maxRetryCount`, `version`, `xhrResponseType`, `xhrWithCredentials`, `xhrMimeType`, `xhrTimeout`, `xhrHeader`,
     *  `reloadAsset`, `cacheAsset`, `cacheEnabled`, 请不要使用这些字段为自定义参数!
     *
     * @param requests - The request you want to load
     * @param options - Optional parameters
     * @param onProgress - Callback invoked when progression change
     * @param onProgress.finished - The number of the items that are already completed
     * @param onProgress.total - The total number of the items
     * @param onProgress.item - The current request item
     * @param onComplete - Callback invoked when finish loading
     * @param onComplete.err - The error occured in loading process.
     * @param onComplete.data - The loaded content
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
     */
    public loadAny (requests: Request, options: IOptions | null, onProgress: ProgressCallback | null, onComplete: CompleteCallbackWithData | null): void;
    public loadAny (requests: Request, onProgress: ProgressCallback | null, onComplete: CompleteCallbackWithData | null): void;
    public loadAny (requests: Request, options: IOptions | null, onComplete?: CompleteCallbackWithData | null): void;
    public loadAny<T extends Asset> (requests: string, onComplete?: CompleteCallbackWithData<T> | null): void;
    public loadAny<T extends Asset> (requests: string[], onComplete?: CompleteCallbackWithData<T[]> | null): void;
    public loadAny (requests: Request, onComplete?: CompleteCallbackWithData | null): void;
    public loadAny (
        requests: Request,
        options?: IOptions | ProgressCallback | CompleteCallbackWithData | null,
        onProgress?: ProgressCallback | CompleteCallbackWithData | null,
        onComplete?: CompleteCallbackWithData | null,
    ) {
        const { options: opts, onProgress: onProg, onComplete: onComp } = parseParameters(options, onProgress, onComplete);
        opts.preset = opts.preset || 'default';
        requests = Array.isArray(requests) ? requests.slice() : requests;
        const task = Task.create({ input: requests, onProgress: onProg, onComplete: onComp, options: opts });
        pipeline.async(task);
    }

    /**
     * @en
     * General interface used to preload assets with a progression callback and a complete callback.It is highly recommended that you use
     * more simple API, such as `preloadRes`, `preloadResDir` etc. Everything about preload is just likes `cc.assetManager.loadAny`, the
     * difference is `cc.assetManager.preloadAny` will only download asset but not parse asset. You need to invoke `cc.assetManager.loadAny(preloadTask)`
     * to finish loading asset
     *
     * @zh
     * 通用预加载资源接口，可传入进度回调以及完成回调，非常建议你使用更简单的 API ，例如 `preloadRes`, `preloadResDir` 等。`preloadAny` 和 `loadAny`
     * 几乎一样，区别在于 `preloadAny` 只会下载资源，不会去解析资源，你需要调用 `cc.assetManager.loadAny(preloadTask)` 来完成资源加载。
     *
     * @param requests - The request you want to preload
     * @param options - Optional parameters
     * @param onProgress - Callback invoked when progression change
     * @param onProgress.finished - The number of the items that are already completed
     * @param onProgress.total - The total number of the items
     * @param onProgress.item - The current request item
     * @param onComplete - Callback invoked when finish preloading
     * @param onComplete.err - The error occured in preloading process.
     * @param onComplete.items - The preloaded content
     *
     * @example
     * cc.assetManager.preloadAny('0cbZa5Y71CTZAccaIFluuZ', (err) => cc.assetManager.loadAny('0cbZa5Y71CTZAccaIFluuZ'));
     *
     */
    public preloadAny (
        requests: Request,
        options: IOptions | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallbackWithData<RequestItem[]>|null): void;
    public preloadAny (requests: Request, onProgress: ProgressCallback | null, onComplete: CompleteCallbackWithData<RequestItem[]> | null): void;
    public preloadAny (requests: Request, options: IOptions | null, onComplete?: CompleteCallbackWithData<RequestItem[]> | null): void;
    public preloadAny (requests: Request, onComplete?: CompleteCallbackWithData<RequestItem[]> | null): void;
    public preloadAny (
        requests: Request,
        options?: IOptions | ProgressCallback | CompleteCallbackWithData<RequestItem[]> | null,
        onProgress?: ProgressCallback | CompleteCallbackWithData<RequestItem[]> | null,
        onComplete?: CompleteCallbackWithData<RequestItem[]> | null,
    ) {
        const { options: opts, onProgress: onProg, onComplete: onComp } = parseParameters(options, onProgress, onComplete);
        opts.preset = opts.preset || 'preload';
        requests = Array.isArray(requests) ? requests.slice() : requests;
        const task = Task.create({ input: requests, onProgress: onProg, onComplete: onComp, options: opts });
        fetchPipeline.async(task);
    }

    /**
     * @en
     * Load native file of asset, if you check the option 'Async Load Assets', you may need to load native file with this before you use the asset
     *
     * @zh
     * 加载资源的原生文件，如果你勾选了'延迟加载资源'选项，你可能需要在使用资源之前调用此方法来加载原生文件
     *
     * @param asset - The asset
     * @param options - Some optional parameters
     * @param onComplete - Callback invoked when finish loading
     * @param onComplete.err - The error occured in loading process.
     *
     * @example
     * cc.assetManager.postLoadNative(texture, (err) => console.log(err));
     *
     */
    public postLoadNative (asset: Asset, options: INativeAssetOptions | null, onComplete: CompleteCallbackNoData | null): void;
    public postLoadNative (asset: Asset, onComplete?: CompleteCallbackNoData | null): void;
    public postLoadNative (asset: Asset, options?: INativeAssetOptions | CompleteCallbackNoData | null, onComplete?: CompleteCallbackNoData | null) {
        const { options: opts, onComplete: onComp } = parseParameters<CompleteCallbackNoData>(options, undefined, onComplete);

        if (!asset._native || !asset.__nativeDepend__) {
            asyncify(onComp)(null);
            return;
        }

        const depend = dependUtil.getNativeDep(asset._uuid);
        if (!depend) { return; }
        if (!bundles.has(depend.bundle)) {
            const bundle = bundles.find((b) => !!b.getAssetInfo(asset._uuid));
            if (bundle) {
                depend.bundle = bundle.name;
            }
        }

        this.loadAny(depend, opts, (err, native) => {
            if (!err) {
                if (asset.isValid && asset.__nativeDepend__) {
                    asset._nativeAsset = native;
                    asset.__nativeDepend__ = false;
                }
            } else {
                error(err.message, err.stack);
            }
            if (onComp) { onComp(err); }
        });
    }

    /**
     * @en
     * Load remote asset with url, such as audio, image, text and so on.
     *
     * @zh
     * 使用 url 加载远程资源，例如音频，图片，文本等等。
     *
     * @param url - The url of asset
     * @param options - Some optional parameters
     * @param options.audioLoadMode - Indicate which mode audio you want to load
     * @param options.ext - If the url does not have a extension name, you can specify one manually.
     * @param onComplete - Callback invoked when finish loading
     * @param onComplete.err - The error occured in loading process.
     * @param onComplete.asset - The loaded texture
     *
     * @example
     * cc.assetManager.loadRemote('http://www.cloud.com/test1.jpg', (err, texture) => console.log(err));
     * cc.assetManager.loadRemote('http://www.cloud.com/test2.mp3', (err, audioClip) => console.log(err));
     * cc.assetManager.loadRemote('http://www.cloud.com/test3', { ext: '.png' }, (err, texture) => console.log(err));
     *
     */
    public loadRemote<T extends Asset> (url: string, options: IRemoteOptions | null, onComplete?: CompleteCallbackWithData<T> | null): void;
    public loadRemote<T extends Asset> (url: string, onComplete?: CompleteCallbackWithData<T> | null): void;
    public loadRemote<T extends Asset> (url: string, options?: IRemoteOptions | CompleteCallbackWithData<T> | null, onComplete?: CompleteCallbackWithData<T> | null) {
        const { options: opts, onComplete: onComp } = parseParameters<CompleteCallbackWithData<T>>(options, undefined, onComplete);

        opts.__isNative__ = true;
        opts.preset = opts.preset || 'remote';
        this.loadAny({ url }, opts, null, (err, data) => {
            if (err) {
                error(err.message, err.stack);
                if (onComp) { onComp(err, data); }
            } else {
                factory.create(url, data, opts.ext || extname(url), opts, (p1, p2) => {
                    if (onComp) { onComp(p1, p2 as T); }
                });
            }
        });
    }

    /**
     * @en
     * load bundle
     *
     * @zh
     * 加载资源包
     *
     * @param nameOrUrl - The name or root path of bundle
     * @param options - Some optional paramter, same like downloader.downloadFile
     * @param options.version - The version of this bundle, you can check config.json in this bundle
     * @param onComplete - Callback when bundle loaded or failed
     * @param onComplete.err - The occurred error, null indicetes success
     * @param onComplete.bundle - The loaded bundle
     *
     * @example
     * loadBundle('http://localhost:8080/test', null, (err, bundle) => console.log(err));
     *
     */
    public loadBundle (nameOrUrl: string, options: IBundleOptions | null, onComplete?: CompleteCallbackWithData<Bundle> | null): void;
    public loadBundle (nameOrUrl: string, onComplete?: CompleteCallbackWithData<Bundle> | null): void;
    public loadBundle (nameOrUrl: string, options?: IBundleOptions | CompleteCallbackWithData<Bundle> | null, onComplete?: CompleteCallbackWithData<Bundle> | null) {
        const { options: opts, onComplete: onComp } = parseParameters<CompleteCallbackWithData<Bundle>>(options, undefined, onComplete);

        const bundleName = basename(nameOrUrl);

        if (this.bundles.has(bundleName)) {
            asyncify(onComp)(null, this.getBundle(bundleName));
            return;
        }

        opts.preset = opts.preset || 'bundle';
        opts.ext = 'bundle';
        opts.__isNative__ = true;
        this.loadAny({ url: nameOrUrl }, opts, null, (err, data) => {
            if (err) {
                error(err.message, err.stack);
                if (onComp) { onComp(err, data); }
            } else {
                factory.create(nameOrUrl, data, 'bundle', opts, (p1, p2) => {
                    if (onComp) { onComp(p1, p2 as Bundle); }
                });
            }
        });
    }

    /**
     * @en
     * Release asset and it's dependencies.
     * This method will not only remove the cache of the asset in assetManager, but also clean up its content.
     * For example, if you release a texture, the texture asset and its gl texture data will be freed up.
     * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture,
     * they may turn to black and report gl errors.
     *
     * @zh
     * 释放资源以及其依赖资源, 这个方法不仅会从 assetManager 中删除资源的缓存引用，还会清理它的资源内容。
     * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
     * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
     *
     * @param asset - The asset to be released
     *
     * @example
     * // release a texture which is no longer need
     * cc.assetManager.releaseAsset(texture);
     *
     * @deprecated
     */
    public releaseAsset (asset: Asset): void {
        asset.destroy();
    }

    /**
     * @en
     * Release all unused assets. Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
     *
     * @zh
     * 释放所有没有用到的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     */
    public releaseUnusedAssets () {
        garbageCollectionManager.collectGarbage();
    }

    /**
     * @en
     * Release all assets. Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
     *
     * @zh
     * 释放所有资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     *
     */
    public releaseAll () {
        assets.forEach((asset) => {
            asset.destroy();
        });
    }

    /**
     * For internal usage.
     * @param json
     * @param options
     * @param onComplete
     * @private
     */
    public loadWithJson<T extends Asset> (
        json: Record<string, any>,
        options: IJsonAssetOptions | null,
        onProgress: ProgressCallback | null,
        onComplete: CompleteCallbackWithData<T> | null): void;
    public loadWithJson<T extends Asset> (json: Record<string, any>, onProgress: ProgressCallback | null, onComplete: CompleteCallbackWithData<T> | null): void;
    public loadWithJson<T extends Asset> (json: Record<string, any>, options: IJsonAssetOptions | null, onComplete?: CompleteCallbackWithData<T> | null): void;
    public loadWithJson<T extends Asset> (json: Record<string, any>, onComplete?: CompleteCallbackWithData<T> | null): void;
    public loadWithJson<T extends Asset> (
        json: Record<string, any>,
        options?: IJsonAssetOptions | CompleteCallbackWithData<T> | null,
        onProgress?: ProgressCallback | CompleteCallbackWithData<T> | null,
        onComplete?: CompleteCallbackWithData<T> | null,
    ) {
        if (BUILD) { throw new Error('Only valid in Editor'); }

        const { options: opts, onProgress: onProg, onComplete: onComp } = parseParameters<CompleteCallbackWithData<T>>(options, onProgress, onComplete);

        const item = RequestItem.create();
        item.isNative = false;
        item.uuid = opts.assetId || (`${new Date().getTime()}${Math.random()}`);
        item.file = json;
        item.ext = '.json';

        const task = Task.create({
            input: [item],
            onProgress: onProg,
            options: opts,
            onComplete: (err, data: T) => {
                if (!err) {
                    if (!opts.assetId) {
                        data._uuid = '';
                    }
                }
                if (onComp) { onComp(err, data); }
            },
        });
        this._parsePipeline!.async(task);
    }

    public update (dt: number) {
        this.pipeline.update();
        this.fetchPipeline.update();
        this.singleAssetLoadPipeline.update();
        this._parsePipeline?.update();
        this.downloader.update(dt);
    }

    public markDependencies (garbageCollectionContext: GarbageCollectorContext) {
        const singleAssetTasks = this.singleAssetLoadPipeline.allTasks;
        for (let i = 0; i < singleAssetTasks.length; i++) {
            const task = singleAssetTasks[i];
            if (task.input.content) { garbageCollectionContext.markGCObject(task.input.content); }
        }
        const loadTasks = this.pipeline.allTasks;
        for (let i = 0; i < loadTasks.length; i++) {
            const task = loadTasks[i];
            for (let j = 0; j < task.output.length; j++) {
                if (task.output[i].content) garbageCollectionContext.markGCObject(task.output[i].content);
            }
        }
        const preloadTasks = this.fetchPipeline.allTasks;
        for (let i = 0; i < preloadTasks.length; i++) {
            const task = preloadTasks[i];
            for (let j = 0; j < task.output.length; j++) {
                if (task.output[i].content) garbageCollectionContext.markGCObject(task.output[i].content);
            }
        }
    }
}

AssetManager.Pipeline = Pipeline;
AssetManager.Task = Task;
AssetManager.Cache = Cache;
AssetManager.RequestItem = RequestItem;
AssetManager.Bundle = Bundle;
AssetManager.BuiltinBundleName = BuiltinBundleName;

export declare namespace AssetManager {
    export { Pipeline };
    export { Task };
    export { Cache };
    export { RequestItem };
    export { Bundle };
    export { BuiltinBundleName };
}

export default legacyCC.assetManager = new AssetManager();
legacyCC.AssetManager = AssetManager;
