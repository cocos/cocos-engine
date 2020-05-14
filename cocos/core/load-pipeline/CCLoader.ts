/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { Asset, RawAsset } from '../assets';
import { SpriteFrame } from '../assets/sprite-frame';
import { Texture2D } from '../assets/texture-2d';
import { TextureCube } from '../assets/texture-cube';
import { createMap, getClassName, isChildClassOf } from '../utils/js';
import { callInNextTick } from '../utils/misc';
import AssetLoader from './asset-loader';
import { AssetTable } from './asset-table';
import { getDependsRecursively } from './auto-release-utils';
import { LoadCompleteCallback, LoadProgressCallback } from './callback-params';
import Downloader from './downloader';
import Loader from './loader';
import { LoadingItems } from './loading-items';
import { Pipeline } from './pipeline';
import ReleasedAssetChecker from './released-asset-checker';
import { DEBUG, EDITOR, DEV } from 'internal:constants';
import { legacyCC } from '../global-exports';

const assetTables = Object.create(null);
assetTables.assets = new AssetTable();
assetTables.internal = new AssetTable();

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

const _info = { url: null, raw: false };

/**
 * @en
 * Convert a resources by finding its real url with uuid, otherwise we will use the uuid or raw url as its url<br>
 * So we gurantee there will be url in result
 * @zh
 * 通过使用 uuid 查找资源的真实 url 来转换资源，否则将使用 uuid 或原始 url 作为其 url<br>
 * 所以可以保证结果中会有 url
 * @param res
 */
function getResWithUrl (res) {
    let id;
    let result;
    let isUuid;
    if (typeof res === 'object') {
        result = res;
        if (res.url) {
            return result;
        }
        else {
            id = res.uuid;
        }
    }
    else {
        result = {};
        id = res;
    }
    isUuid = result.type ? result.type === 'uuid' : legacyCC.AssetLibrary._uuidInSettings(id);
    legacyCC.AssetLibrary._getAssetInfoInRuntime(id, _info);
    result.url = !isUuid ? id : _info.url;
    if (_info.url && result.type === 'uuid' && _info.raw) {
        result.type = null;
        result.isRawAsset = true;
    }
    else if (!isUuid) {
        result.isRawAsset = true;
    }
    return result;
}

const _sharedResources: any = [];
const _sharedList: any = [];

/**
 * @en
 * Loader for resource loading process. It's a singleton object.
 * @zh
 * 资源加载程序，这是一个单例对象。
 */
export class CCLoader extends Pipeline {

    /**
     * @en
     * Gets a new XMLHttpRequest instance.
     * @zh
     * 获取一个新的 XMLHttpRequest 的实例。
     */
    public getXMLHttpRequest: Function;

    /**
     * @en
     * The asset loader in cc.loader's pipeline, it's by default the first pipe.<br>
     * It's used to identify an asset's type, and determine how to download it.
     * @zh
     * cc.loader 中的资源加载器，默认情况下是最先加载的。<br>
     * 用于标识资源的类型，并确定如何加载此资源。
     */
    public assetLoader: AssetLoader;

    /**
     * @en
     * The md5 pipe in cc.loader's pipeline, it could be absent if the project isn't build with md5 option.<br>
     * It's used to modify the url to the real downloadable url with md5 suffix.
     * @zh
     * cc.loader 中的 md5 加载管道，如果项目没有使用 md5 构建，则此项可能不存在。<br>
     * 用于修改带有 md5 后缀的真实可下载的 URL 。
     */
    public md5Pipe: null;

    /**
     * @en
     * The downloader in cc.loader's pipeline, it's by default the second pipe.<br>
     * It's used to download files with several handlers: pure text, image, script, audio, font, uuid.<br>
     * You can add your own download function with addDownloadHandlers
     * @zh
     * cc.loader 中的资源下载程序，默认情况下是第二个加载的。<br>
     * 它用于下载带有多个处理程序的文件：纯文本，图像，脚本，音频，字体，uuid。<br>
     * 您可以使用 addDownloadHandlers 来添加自己的下载函数
     */
    public downloader: Downloader;

    /**
     * @en
     * The loader in cc.loader's pipeline, it's by default the third pipe.<br>
     * It's used to parse downloaded content with several handlers: JSON, image, plist, fnt, uuid.<br>
     * You can add your own download function with addLoadHandlers
     * @zh
     * cc.loader 中的资源下载程序，默认情况下是第三个加载的。<br>
     * 它用于解析下载的内容及多个处理程序的文件：纯文本，图像，脚本，音频，字体，uuid。<br>
     * 您可以使用 addLoadHandlers 来添加自己的下载函数
     */
    public loader: Loader;
    public onProgress: null;
    public _assetTables: any;

    private _autoReleaseSetting: any;
    private _releasedAssetChecker_DEBUG: any;

    constructor () {

        const assetLoader = new AssetLoader();
        const downloader = new Downloader();
        // tslint:disable-next-line: no-shadowed-letiable
        const loader = new Loader();

        super([
            assetLoader,
            downloader,
            loader,
        ]);

        this.getXMLHttpRequest =  getXMLHttpRequest;

        this.assetLoader = assetLoader;

        this.md5Pipe = null;

        this.downloader = downloader;

        this.loader = loader;

        this.onProgress = null;

        this._assetTables = assetTables;
        // assets to release automatically
        this._autoReleaseSetting = createMap(true);

        if (DEBUG) {
            this._releasedAssetChecker_DEBUG = new ReleasedAssetChecker();
        }
    }

    public init (director) {
        if (DEBUG) {
            const self = this;
            director.on(legacyCC.Director.EVENT_AFTER_UPDATE, () => {
                self._releasedAssetChecker_DEBUG.checkCouldRelease(self._cache);
            });
        }
    }

    /**
     * @en
     * Add custom supported types handler or modify existing type handler for download process.
     * @zh
     * 为下载程序添加自定义支持的类型处理程序或修改现有的类型处理程序。
     * @example
     * ```typescript
     *  cc.loader.addDownloadHandlers({
     *      // This will match all url with `.scene` extension or all url with `scene` type
     *      'scene' : function (url, callback) {}
     *  });
     * ```
     * @param extMap 具有相应处理程序的自定义支持类型
     */
    public addDownloadHandlers (extMap: Object) {
        this.downloader.addHandlers(extMap);
    }

    /**
     * @en
     * Add custom supported types handler or modify existing type handler for load process.
     * @zh
     * 为加载程序添加自定义支持的类型处理程序或修改现有的类型处理程序。
     * @example
     * ```typescript
     *  cc.loader.addLoadHandlers({
     *      // This will match all url with `.scene` extension or all url with `scene` type
     *      'scene' : function (url, callback) {}
     *  });
     * ```
     * @method addLoadHandlers
     * @param extMap 具有相应处理程序的自定义支持类型
     */
    public  addLoadHandlers (extMap: Object) {
        this.loader.addHandlers(extMap);
    }

    // tslint:disable: max-line-length

    // load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, completeCallback?: Function): void
    // load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: Function|null): void
    /**
     * @en
     * Load resources with a progression callback and a complete callback.<br>
     * The progression callback is the same as Pipeline's [[LoadingItems.onProgress]] <br>
     * The complete callback is almost the same as Pipeline's [[LoadingItems.onComplete]] <br>
     * The only difference is when user pass a single url as resources, the complete callback will set its result directly as the second parameter.
     * @zh
     * 使用进度回调和完整回调加载资源。<br>
     * 进度回调与 Pipeline 的 [[LoadingItems.onProgress]] 相同<br>
     * 完整的回调与 Pipeline 的 [[LoadingItems.onComplete]] 几乎相同<br>
     * 唯一的区别是当用户将单个 URL 作为资源传递时，完整的回调将其结果直接设置为第二个参数。
     * @example
     * ```TypeScript
     * cc.loader.load('a.png', function (err, tex) {
     *     cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
     * });
     *
     * cc.loader.load('http://example.com/a.png', function (err, tex) {
     *     cc.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
     * });
     *
     * cc.loader.load({url: 'http://example.com/getImageREST?file=a.png', type: 'png'}, function (err, tex) {
     *     cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
     * });
     *
     * cc.loader.load(['a.png', 'b.json'], function (errors, results) {
     *     if (errors) {
     *         for (let i = 0; i < errors.length; i++) {
     *             cc.log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
     *         }
     *     }
     *     let aTex = results.getContent('a.png');
     *     let bJsonObj = results.getContent('b.json');
     * });
     * ```
     * @method load
     * @param {String|String[]|Object} resources - Url 列表数组
     * @param {Function} progressCallback - 当进度改变时调用的回调函数
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed
     * @param {Number} progressCallback.totalCount - The total number of the items
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline
     * @param {Function} completeCallback - 当所有资源加载完毕后调用的回调函数
     */
    public load (resources, progressCallback, completeCallback?) {
        if (DEV && !resources) {
            return legacyCC.error('[cc.loader.load] resources must be non-nil.');
        }

        if (completeCallback === undefined) {
            completeCallback = progressCallback;
            progressCallback = this.onProgress || null;
        }

        const self = this;
        let singleRes: Boolean = false;
        let res;
        if (!(resources instanceof Array)) {
            if (resources) {
                singleRes = true;
                resources = [resources];
            } else {
                resources = [];
            }
        }

        _sharedResources.length = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < resources.length; ++i) {
            const resource = resources[i];
            // Backward compatibility
            if (resource && resource.id) {
                legacyCC.warnID(4920, resource.id);
                if (!resource.uuid && !resource.url) {
                    resource.url = resource.id;
                }
            }
            res = getResWithUrl(resource);
            if (!res.url && !res.uuid) {
                continue;
            }
            const item = this._cache[res.url];
            _sharedResources.push(item || res);
        }

        const queue = LoadingItems.create(this, progressCallback, (errors, items) => {
            callInNextTick(() => {
                if (completeCallback) {
                    if (singleRes) {
                        const id = res.url;
                        completeCallback.call(self, items.getError(id), items.getContent(id));
                    }
                    else {
                        completeCallback.call(self, errors, items);
                    }
                    completeCallback = null;
                }

                items.destroy();
            });
        });
        LoadingItems.initQueueDeps(queue);
        queue.append(_sharedResources);
        _sharedResources.length = 0;
    }

    /**
     * @en
     * See: [[Pipeline.flowInDeps]]
     * @zh
     * 参考：[[Pipeline.flowInDeps]]
     */
    public flowInDeps (owner, urlList, callback) {
        _sharedList.length = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < urlList.length; ++i) {
            const res = getResWithUrl(urlList[i]);
            if (!res.url && !res.uuid) {
                continue;
            }
            const item = this._cache[res.url];
            if (item) {
                _sharedList.push(item);
            }
            else {
                _sharedList.push(res);
            }
        }
        // @ts-ignore
        const queue = LoadingItems.create(this, owner ? (completedCount, totalCount, item) => {
            // @ts-ignore
            if (queue._ownerQueue && queue._ownerQueue.onProgress) {
                // @ts-ignore
                queue._ownerQueue._childOnProgress(item);
            }
        } : null, (errors, items) => {
            callback(errors, items);
            // Clear deps because it's already done
            // Each item will only flowInDeps once, so it's still safe here
            if (owner && owner.deps) {
                owner.deps.length = 0;
            }
            items.destroy();
        });
        if (owner) {
            const ownerQueue = LoadingItems.getQueue(owner);
            // Set the root ownerQueue, if no ownerQueue defined in ownerQueue, it's the root
            queue._ownerQueue = (ownerQueue && ownerQueue._ownerQueue) || ownerQueue;
        }
        const accepted = queue.append(_sharedList, owner);
        _sharedList.length = 0;
        return accepted;
    }

    public loadRes<T> (
        url: string,
        type: Constructor<T>,
        mount: string,
        progressCallback: LoadProgressCallback,
        completeCallback: LoadCompleteCallback<T>,
    );

    public loadRes<T> (
        url: string,
        type: Constructor<T>,
        progressCallback: LoadProgressCallback,
        completeCallback: LoadCompleteCallback<T>,
    );

    public loadRes<T> (
        url: string,
        type: Constructor<T>,
        completeCallback: LoadCompleteCallback<T>,
    );

    // @typescript
    // loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
    // loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): void
    // loadRes(url: string, type: typeof cc.Asset): void
    // loadRes(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
    // loadRes(url: string, completeCallback: (error: Error, resource: any) => void): void
    // loadRes(url: string): void

    /**
     * @en
     * Load resources from the "resources" folder inside the "assets" folder of your project.<br>
     * <br>
     * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
     * @zh
     * 从项目的 “assets” 文件夹下的 “resources” 文件夹中加载资源<br>
     * <br>
     * 注意：Creator 中的所有资源 URL 都使用正斜杠，使用反斜杠的 URL 将不起作用。
     * @method loadRes
     * @param {String} url - 目标资源的 URL<br>
     *                       URl 相对于 “resources” 文件夹，必须省略文件扩展名。
     * @param {Function} type - 如果提供此参数，则将仅加载此类型的资源。
     * @param {Function} progressCallback - 当进度改变时调用的回调函数
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
     * @param {Number} progressCallback.totalCount - The total number of the items.
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
     * @param {Function} completeCallback - 当所有资源加载完毕后调用的回调函数
     * @param {Error} completeCallback.error - The error info or null if loaded successfully.
     * @param {Object} completeCallback.resource - The loaded resource if it can be found otherwise returns null.
     *
     * @example
     * ```typescript
     * // load the prefab (project/assets/resources/misc/character/cocos) from resources folder
     * cc.loader.loadRes('misc/character/cocos', function (err, prefab) {
     *     if (err) {
     *         cc.error(err.message || err);
     *         return;
     *     }
     *     cc.log('Result should be a prefab: ' + (prefab instanceof cc.Prefab));
     * });
     *
     * // load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
     * cc.loader.loadRes('imgs/cocos', cc.SpriteFrame, function (err, spriteFrame) {
     *     if (err) {
     *         cc.error(err.message || err);
     *         return;
     *     }
     *     cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
     * });
     * ```
     */
    public loadRes (url: String, type: Function, mount: string | Function, progressCallback?: Function, completeCallback?: Function) {
        if (arguments.length !== 5) {
            completeCallback = progressCallback;
            progressCallback = mount as Function;
            mount = 'assets';
        }
        const args = this._parseLoadResArgs(type, progressCallback, completeCallback);
        type = args.type;
        progressCallback = args.onProgress;
        completeCallback = args.onComplete;
        const self = this;
        const uuid = self._getResUuid(url, type, mount, true);
        if (uuid) {
            this.load(
                {
                    type: 'uuid',
                    uuid,
                },
                progressCallback,
                (err, asset) => {
                    if (asset) {
                        // should not release these assets, even if they are static referenced in the scene.
                        self.setAutoReleaseRecursively(uuid, false);
                    }
                    if (completeCallback) {
                        completeCallback(err, asset);
                    }
                });
        }
        else {
            self._urlNotFound(url, type, completeCallback);
        }
    }

    //  @typescript
    //  loadResDir(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
    //  loadResDir(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
    //  loadResDir(url: string, type: typeof cc.Asset): void
    //  loadResDir(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
    //  loadResDir(url: string, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
    //  loadResDir(url: string): void

    /**
     * @en
     * Load all assets in a folder inside the "assets/resources" folder of your project.<br>
     * <br>
     * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
     * @zh
     * 将所有资产加载到项目 “assets / resources” 文件夹中
     * <br>
     * 注意：Creator 中的所有资源 URL 都使用正斜杠，使用反斜杠的 URL 将不起作用。
     * @method loadResDir
     * @param {String} url - 目标文件夹的 URL<br>
     *                       URl 相对于 “resources” 文件夹，必须省略文件扩展名。
     * @param {Function} type - 如果提供此参数，则将仅加载此类型的资源。
     * @param {Function} progressCallback - 当进度改变时调用的回调函数
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
     * @param {Number} progressCallback.totalCount - The total number of the items.
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
     * @param {Function} completeCallback - 当所有资源加载完毕后或者发生错误时调用的回调函数
     * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
     *                                             If nothing to load, assets will be an empty array.
     * @param {String[]} completeCallback.urls - An array that lists all the URLs of loaded assets.
     *
     * @example
     * ```typescript
     * // load the texture (resources/imgs/cocos.png) and the corresponding sprite frame
     * cc.loader.loadResDir('imgs/cocos', function (err, assets) {
     *     if (err) {
     *         cc.error(err);
     *         return;
     *     }
     *     let texture = assets[0];
     *     let spriteFrame = assets[1];
     * });
     *
     * // load all textures in "resources/imgs/"
     * cc.loader.loadResDir('imgs', cc.Texture2D, function (err, textures) {
     *     let texture1 = textures[0];
     *     let texture2 = textures[1];
     * });
     *
     * // load all JSONs in "resources/data/"
     * cc.loader.loadResDir('data', function (err, objects, urls) {
     *     let data = objects[0];
     *     let url = urls[0];
     * });
     * ```
     */
    public loadResDir (url: String, type?: Function, mount?, progressCallback?: Function, completeCallback?: Function) {
        if (arguments.length !== 5) {
            completeCallback = progressCallback;
            progressCallback = mount;
            mount = 'assets';
        }

        if (!assetTables[mount]) { return; }

        const args = this._parseLoadResArgs(type, progressCallback, completeCallback);
        type = args.type;
        progressCallback = args.onProgress;
        completeCallback = args.onComplete;

        const urls = [];
        const uuids = assetTables[mount].getUuidArray(url, type, urls);
        this._loadResUuids(uuids, progressCallback, (errors, assetRes, urlRes) => {
            // The spriteFrame url in spriteAtlas will be removed after build project
            // To show users the exact structure in asset panel, we need to return the spriteFrame assets in spriteAtlas
            const assetResLength = assetRes.length;
            for (let i = 0; i < assetResLength; ++i) {
                if (assetRes[i] instanceof legacyCC.SpriteAtlas) {
                    const spriteFrames = assetRes[i].getSpriteFrames();
                    // tslint:disable: forin
                    for (const k in spriteFrames) {
                        const sf = spriteFrames[k];
                        assetRes.push(sf);
                        if (urlRes) {
                            urlRes.push(`${urlRes[i]}/${sf.name}`);
                        }
                    }
                }
            }
            if (completeCallback) {
                completeCallback(errors, assetRes, urlRes);
            }
        }, urls);
    }

    // * @typescript
    // * loadResArray(url: string[], type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
    // * loadResArray(url: string[], type: typeof cc.Asset, completeCallback: (error: Error, resource: any[]) => void): void
    // * loadResArray(url: string[], type: typeof cc.Asset): void
    // * loadResArray(url: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
    // * loadResArray(url: string[], completeCallback: (error: Error, resource: any[]) => void): void
    // * loadResArray(url: string[]): void
    /**
     * @en
     * This method is like [[loadRes]] except that it accepts array of url.
     * @zh
     * 此方法除了接受 URL 数组参数外，与 [[loadRes]] 方法相同。
     *
     * @method loadResArray
     * @param {String[]} urls - 目标资源的 URL 数组。
     *                          URl 为相对于 “resources” 文件夹的，且必须省略文件扩展名。
     * @param {Function} type - 如果提供此参数，则将仅加载此类型的资源。
     * @param {Function} progressCallback - 当进度改变时调用的回调函数
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
     * @param {Number} progressCallback.totalCount - The total number of the items.
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
     * @param {Function} completeCallback - 当所有资源加载完毕后或者发生错误时调用的回调函数
     * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
     *                                                     If nothing to load, assets will be an empty array.
     * @example
     * ```typescript
     * // load the SpriteFrames from resources folder
     * let spriteFrames;
     * let urls = ['misc/characters/character_01', 'misc/weapons/weapons_01'];
     * cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
     *     if (err) {
     *         cc.error(err);
     *         return;
     *     }
     *     spriteFrames = assets;
     *     // ...
     * });
     * ```
     */
    public loadResArray (urls: String[], type?: Function, mount?, progressCallback?: Function, completeCallback?: Function) {
        if (arguments.length !== 5) {
            completeCallback = progressCallback;
            progressCallback = mount;
            mount = 'assets';
        }

        const args = this._parseLoadResArgs(type, progressCallback, completeCallback);
        type = args.type;
        progressCallback = args.onProgress;
        completeCallback = args.onComplete;

        const uuids: any = [];
        // tslint:disable: prefer-for-of
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const uuid = this._getResUuid(url, type, mount, true);
            if (uuid) {
                uuids.push(uuid);
            }
            else {
                this._urlNotFound(url, type, completeCallback);
                return;
            }
        }
        this._loadResUuids(uuids, progressCallback, completeCallback);
    }

    /**
     * @en
     * Get resource data by id. <br>
     * When you load resources with [[load]] or [[loadRes]],
     * the url will be the unique identity of the resource.
     * After loaded, you can acquire them by passing the url to this API.
     * @zh
     * 根据 ID 获取资源数据。<br>
     * 当使用 [[load]] 或 [[loadRes]] 来加载资源时，<br>
     * URL 将是资源的唯一标识。<br>
     * 在完成加载之后，你可以通过将 URL 传递给此 API 来获取它们。
     * @method getRes
     * @param {String} url
     * @param {Function} type - 如果提供此参数，则将仅返回此类型的资源。
     * @returns {*}
     */
    public getRes<T = any> (url: string, type?: Function): T | null {
        let item = this._cache[url];
        if (!item) {
            const uuid = this._getResUuid(url, type, null, true);
            if (uuid) {
                const ref = this._getReferenceKey(uuid);
                item = this._cache[ref];
            }
            else {
                return null;
            }
        }
        if (item && item.alias) {
            item = item.alias;
        }
        return (item && item.complete) ? item.content : null;
    }

    /**
     * @en
     * Get total resources count in loader.
     * @zh
     * 获取加载的总资源数量
     */
    public getResCount (): Number {
        return Object.keys(this._cache).length;
    }

    /**
     * @en
     * Get all resource dependencies of the requested asset in an array, including itself.<br>
     * The owner parameter accept the following types: 1. The asset itself; 2. The resource url; 3. The asset's uuid.<br>
     * The returned array stores the dependencies with their uuids, after retrieve dependencies,<br>
     * you can release them, access dependent assets by passing the uuid to [[getRes]], or other stuffs you want.<br>
     * For release all dependencies of an asset, please refer to [[release]]
     * Here is some examples:
     * @zh
     * 获取一个指定资源的所有依赖资源，包含它自身，并保存在数组中返回。<br>
     * owner 参数接收以下几种类型：1. 资源 asset 对象；2. 资源目录下的 url；3. 资源的 uuid。<br>
     * 返回的数组将仅保存依赖资源的 uuid，获取这些 uuid 后，你可以从 loader 释放这些资源；通过 [[getRes]] 获取某个资源或者进行其他你需要的操作。<br>
     * 想要释放一个资源及其依赖资源，可以参考 [[release]]。<br>
     * 下面是一些示例代码：
     * @example
     * ```typescript
     * // Release all dependencies of a loaded prefab
     * let deps = cc.loader.getDependsRecursively(prefab);
     * cc.loader.release(deps);
     * // Retrieve all dependent textures
     * let deps = cc.loader.getDependsRecursively('prefabs/sample');
     * let textures = [];
     * for (let i = 0; i < deps.length; ++i) {
     *     let item = cc.loader.getRes(deps[i]);
     *     if (item instanceof cc.Texture2D) {
     *         textures.push(item);
     *     }
     * }
     * ```
     * @method getDependsRecursively
     * @param {Asset|RawAsset|String} owner - 资源本身或者是资源的 url 或者是资源的 uuid
     * @return {Array}
     */
    public getDependsRecursively (owner: Asset|RawAsset|String) {
        if (owner) {
            const key = this._getReferenceKey(owner);
            const assets = getDependsRecursively(key);
            assets.push(key);
            return assets;
        }
        else {
            return [];
        }
    }

    /**
     * @en
     * Release the content of an asset or an array of assets by uuid.<br>
     * Start from v1.3, this method will not only remove the cache of the asset in loader, but also clean up its content.<br>
     * For example, if you release a texture, the texture asset and its gl texture data will be freed up.<br>
     * In complexe project, you can use this function with [[getDependsRecursively]] to free up memory in critical circumstances.<br>
     * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.<br>
     * If you only want to remove the cache of an asset, please use [[Pipeline.removeItem]]
     * @zh
     * 通过 id（通常是资源 url）来释放一个资源或者一个资源数组。<br>
     * 从 v1.3 开始，这个方法不仅会从 loader 中删除资源的缓存引用，还会清理它的资源内容。<br>
     * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。<br>
     * 在复杂项目中，我们建议你结合 [[getDependsRecursively]] 来使用，便于在设备内存告急的情况下更快地释放不再需要的资源的内存。<br>
     * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。<br>
     * 如果你只想删除一个资源的缓存引用，请使用 [[Pipeline.removeItem]]
     *
     * @example
     * ```typescript
     * // Release a texture which is no longer need
     * cc.loader.release(texture);
     * // Release all dependencies of a loaded prefab
     * let deps = cc.loader.getDependsRecursively('prefabs/sample');
     * cc.loader.release(deps);
     * // If there is no instance of this prefab in the scene, the prefab and its dependencies like textures, sprite frames, etc, will be freed up.
     * // If you have some other nodes share a texture in this prefab, you can skip it in two ways:
     * // 1. Forbid auto release a texture before release
     * cc.loader.setAutoRelease(texture2d, false);
     * // 2. Remove it from the dependencies array
     * let deps = cc.loader.getDependsRecursively('prefabs/sample');
     * let index = deps.indexOf(texture2d._uuid);
     * if (index !== -1)
     *     deps.splice(index, 1);
     * cc.loader.release(deps);
     * ```
     * @method release
     * @param {Asset|RawAsset|String|Array} asset
     */
    public release (asset) {
        if (Array.isArray(asset)) {
            for (let i = 0; i < asset.length; i++) {
                const key = asset[i];
                this.release(key);
            }
        }
        else if (asset) {
            const id = this._getReferenceKey(asset);
            const item = this.getItem(id);
            if (item) {
                const removed = this.removeItem(id);
                asset = item.content;
                if (asset instanceof legacyCC.Asset) {
                    const nativeUrl = asset.nativeUrl;
                    if (nativeUrl) {
                        this.release(nativeUrl);  // uncache loading item of native asset
                    }
                    asset.destroy();
                }
                if (DEBUG && removed) {
                    this._releasedAssetChecker_DEBUG.setReleased(item, id);
                }
            }
        }
    }

    /**
     * @en Release the asset by its object. Refer to [[release]] for detailed informations.
     * @zh 通过资源对象自身来释放资源。详细信息请参考 [[release]]
     *
     * @method releaseAsset
     * @param {Asset} asset
     */
    public releaseAsset (asset: Asset) {
        const uuid = asset._uuid;
        if (uuid) {
            this.release(uuid);
        }
    }

    /**
     * @en
     * Release the asset loaded by [[loadRes]]. Refer to [[release]] for detailed informations.
     * @zh
     * 释放通过 [[loadRes]] 加载的资源。详细信息请参考 [[release]]
     *
     * @method releaseRes
     * @param {String} url
     * @param {Function} type - 如果提供此参数，则将仅释放此类型的资源。
     */
    public releaseRes (url: String, type?: Function, mount?) {
        const uuid = this._getResUuid(url, type, mount, true);
        if (uuid) {
            this.release(uuid);
        }
        else {
            legacyCC.errorID(4914, url);
        }
    }

    /**
     * @en
     * Release the all assets loaded by [[loadResDir]]. Refer to [[release]] for detailed informations.
     * @zh
     * 释放通过 [[loadResDir]] 加载的资源。详细信息请参考 [[release]]
     *
     * @method releaseResDir
     * @param {String} url
     * @param {Function} type - 如果提供此参数，则将仅释放此类型的资源。
     */
    public releaseResDir (url: String, type?: Function, mount?) {
        mount = mount || 'assets';
        if (!assetTables[mount]) { return; }

        const uuids = assetTables[mount].getUuidArray(url, type);
        for (let i = 0; i < uuids.length; i++) {
            const uuid = uuids[i];
            this.release(uuid);
        }
    }

    /**
     * @en Resource all assets. Refer to [[release]] for detailed informations.
     * @zh 释放所有资源。详细信息请参考 [[release]]
     *
     * @method releaseAll
     */
    public releaseAll () {
        for (const id in this._cache) {
            this.release(id);
        }
    }

    // AUTO RELEASE

    // override
    public removeItem (key) {
        const removed = Pipeline.prototype.removeItem.call(this, key);
        delete this._autoReleaseSetting[key];
        return removed;
    }

    /**
     * @en
     * Indicates whether to release the asset when loading a new scene.<br>
     * By default, when loading a new scene, all assets in the previous scene will be released or preserved<br>
     * according to whether the previous scene checked the "Auto Release Assets" option.<br>
     * On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`<br>
     * will not be affected by that option, remain not released by default.<br>
     * Use this API to change the default behavior on a single asset, to force preserve or release specified asset when scene switching.<br>
     * <br>
     * See: [[setAutoReleaseRecursively]], [[isAutoRelease]]
     * @zh
     * 设置当场景切换时是否自动释放资源。<br>
     * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。<br>
     * 而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
     * 使用这个 API 可以在单个资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
     * <br>
     * 参考：[[setAutoReleaseRecursively]]，[[isAutoRelease]]
     *
     * @example
     * ```typescript
     * // auto release the texture event if "Auto Release Assets" disabled in current scene
     * cc.loader.setAutoRelease(texture2d, true);
     * // don't release the texture even if "Auto Release Assets" enabled in current scene
     * cc.loader.setAutoRelease(texture2d, false);
     * // first parameter can be url
     * cc.loader.setAutoRelease(audioUrl, false);
     * ```
     * @method setAutoRelease
     * @param {Asset|String} assetOrUrlOrUuid - 资源对象或原始资源的 URL 或是 UUID
     * @param {Boolean} autoRelease - 表示是否自动释放
     */
    public setAutoRelease (assetOrUrlOrUuid: Asset|String, autoRelease: Boolean) {
        const key = this._getReferenceKey(assetOrUrlOrUuid);
        if (key) {
            this._autoReleaseSetting[key] = !!autoRelease;
        }
        else if (DEV) {
            legacyCC.warnID(4902);
        }
    }

    /**
     * @en
     * Indicates whether to release the asset and its referenced other assets when loading a new scene.<br>
     * By default, when loading a new scene, all assets in the previous scene will be released or preserved<br>
     * according to whether the previous scene checked the "Auto Release Assets" option.<br>
     * On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`<br>
     * will not be affected by that option, remain not released by default.<br>
     * Use this API to change the default behavior on the specified asset and its recursively referenced assets, to force preserve or release specified asset when scene switching.<br>
     * <br>
     * See: [[setAutoRelease]], [[isAutoRelease]]
     * @zh
     * 设置当场景切换时是否自动释放资源及资源引用的其它资源。<br>
     * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。<br>
     * 而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
     * 使用这个 API 可以在指定资源及资源递归引用到的所有资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
     * <br>
     * 参考：[[setAutoRelease]]，[[isAutoRelease]]
     *
     * @example
     * ```typescript
     * // auto release the SpriteFrame and its Texture event if "Auto Release Assets" disabled in current scene
     * cc.loader.setAutoReleaseRecursively(spriteFrame, true);
     * // don't release the SpriteFrame and its Texture even if "Auto Release Assets" enabled in current scene
     * cc.loader.setAutoReleaseRecursively(spriteFrame, false);
     * // don't release the Prefab and all the referenced assets
     * cc.loader.setAutoReleaseRecursively(prefab, false);
     * ```
     * @method setAutoReleaseRecursively
     * @param {Asset|String} assetOrUrlOrUuid - 资源对象或原始资源的 URL 或是 UUID
     * @param {Boolean} autoRelease - 表示是否自动释放
     */
    public setAutoReleaseRecursively (assetOrUrlOrUuid: Asset|String, autoRelease: Boolean) {
        autoRelease = !!autoRelease;
        const key = this._getReferenceKey(assetOrUrlOrUuid);
        if (key) {
            this._autoReleaseSetting[key] = autoRelease;

            const depends = getDependsRecursively(key);
            for (let i = 0; i < depends.length; i++) {
                const depend = depends[i];
                this._autoReleaseSetting[depend] = autoRelease;
            }
        }
        else if (DEV) {
            legacyCC.warnID(4902);
        }
    }

    /**
     * @en
     * Returns whether the asset is configured as auto released, despite how "Auto Release Assets" property is set on scene asset.<br>
     * <br>
     * See: [[setAutoRelease]], [[setAutoReleaseRecursively]]
     *
     * @zh
     * 返回指定的资源是否有被设置为自动释放，不论场景的“Auto Release Assets”如何设置。<br>
     * <br>
     * 参考：[[setAutoRelease]]，[[setAutoReleaseRecursively]]
     * @method isAutoRelease
     * @param {Asset|String} assetOrUrl - asset object or the raw asset's url
     * @returns {Boolean}
     */
    public isAutoRelease (assetOrUrl: Asset|String): Boolean{
        const key = this._getReferenceKey(assetOrUrl);
        if (key) {
            return !!this._autoReleaseSetting[key];
        }
        return false;
    }

    /**
     * @zh
     * 获取资源的 uuid
     */
    public _getResUuid (url, type, mount, quiet) {
        mount = mount || 'assets';
        let uuid = '';
        if (EDITOR) {
            const info = EditorExtends.Asset.getAssetInfoFromUrl(`db://${mount}/resources/${url}`);
            uuid = info ? info.uuid : '';
        }
        else {
            const assetTable = assetTables[mount];
            if (url && assetTable) {
                // Ignore parameter
                const index = url.indexOf('?');
                if (index !== -1) {
                    url = url.substr(0, index);
                }
                uuid = assetTable.getUuid(url, type);
                if (!uuid) {
                    const extname = legacyCC.path.extname(url);
                    if (extname) {
                        // strip extname
                        url = url.slice(0, - extname.length);
                        uuid = assetTable.getUuid(url, type);
                        if (uuid && !quiet) {
                            legacyCC.warnID(4901, url, extname);
                        }
                    }
                }
            }
        }
        if (!uuid && type) {
            if (isChildClassOf(type, SpriteFrame) || isChildClassOf(type, Texture2D) || isChildClassOf(type, TextureCube)) {
                legacyCC.warnID(4934);
            }
        }
        return uuid;
    }

    /**
     * @en
     * Find the asset's reference id in loader, asset could be asset object, asset uuid or asset url
     * @zh
     * 在 laoder 中找到资源的引用 id ，参数可以是资源对象、资源的 uuid 或者是资源的 url
     */
    public _getReferenceKey (assetOrUrlOrUuid) {
        let key;
        if (typeof assetOrUrlOrUuid === 'object') {
            key = assetOrUrlOrUuid._uuid || null;
        }
        else if (typeof assetOrUrlOrUuid === 'string') {
            key = this._getResUuid(assetOrUrlOrUuid, null, null, true) || assetOrUrlOrUuid;
        }
        if (!key) {
            legacyCC.warnID(4800, assetOrUrlOrUuid);
            return key;
        }
        legacyCC.AssetLibrary._getAssetInfoInRuntime(key, _info);
        return this._cache[_info.url!] ? _info.url : key;
    }

    /**
     * @zh
     * 当 url 未找到时的操作
     */
    private _urlNotFound (url, type, completeCallback) {
        callInNextTick(() => {
            url = legacyCC.url.normalize(url);
            const info = `${type ? getClassName(type) : 'Asset'} in "resources/${url}" does not exist.`;
            if (completeCallback) {
                completeCallback(new Error(info), []);
            }
        });
    }

    /**
     * @param {Function} [type]
     * @param {Function} [onProgress]
     * @param {Function} onComplete
     * @returns {Object} arguments
     * @returns {Function} arguments.type
     * @returns {Function} arguments.onProgress
     * @returns {Function} arguments.onComplete
     */
    private _parseLoadResArgs (type, onProgress, onComplete) {
        if (onComplete === undefined) {
            const isValidType = isChildClassOf(type, legacyCC.RawAsset);
            if (onProgress) {
                onComplete = onProgress;
                if (isValidType) {
                    onProgress = this.onProgress || null;
                }
            }
            else if (onProgress === undefined && !isValidType) {
                onComplete = type;
                onProgress = this.onProgress || null;
                type = null;
            }
            if (onProgress !== undefined && !isValidType) {
                onProgress = type;
                type = null;
            }
        }
        return {
            type,
            onProgress,
            onComplete,
        };
    }

    /**
     * @zh
     * 通过uuids 加载资源
     */
    private _loadResUuids (uuids, progressCallback, completeCallback, urls ?) {
        if (uuids.length > 0) {
            const self = this;
            const res = uuids.map((uuid) => {
                return {
                    type: 'uuid',
                    uuid,
                };
            });
            this.load(res, progressCallback, (errors, items) => {
                if (completeCallback) {
                    const assetRes: any = [];
                    const urlRes: any = urls && [];
                    for (let i = 0; i < res.length; ++i) {
                        const uuid = res[i].uuid;
                        const id = self._getReferenceKey(uuid);
                        const item = items.getContent(id);
                        if (item) {
                            // should not release these assets, even if they are static referenced in the scene.
                            self.setAutoReleaseRecursively(uuid, false);
                            assetRes.push(item);
                            if (urlRes) {
                                urlRes.push(urls[i]);
                            }
                        }
                    }
                    if (urls) {
                        completeCallback(errors, assetRes, urlRes);
                    }
                    else {
                        completeCallback(errors, assetRes);
                    }
                }
            });
        }
        else {
            if (completeCallback) {
                callInNextTick( () => {
                    if (urls) {
                        completeCallback(null, [], []);
                    }
                    else {
                        completeCallback(null, []);
                    }
                });
            }
        }
    }
}

export const loader = legacyCC.loader = new CCLoader();

if (EDITOR) {
    legacyCC.loader.refreshUrl = function (uuid, oldUrl, newUrl) {
        let item = this._cache[uuid];
        if (item) {
            item.url = newUrl;
        }

        item = this._cache[oldUrl];
        if (item) {
            item.id = newUrl;
            item.url = newUrl;
            this._cache[newUrl] = item;
            delete this._cache[oldUrl];
        }
    };
}
